// Nguồn Facebook qua 3 actor (chỉ group/page CÔNG KHAI, không đăng nhập tài khoản cá nhân):
//   1. apify/facebook-groups-scraper — bài trong các group công khai (config: groups)
//   2. apify/facebook-posts-scraper — bài trên các page (config: pages)
//   3. apify/facebook-comments-scraper — bình luận (kèm trả lời) cho N bài nhiều bình luận nhất
// Tên tham số input/output đối chiếu từ input schema + dataset schema của actor (build 2026-10-16).
//
// Không lưu tên, id, ảnh, link hồ sơ của người đăng/người bình luận: normalize chỉ chép các
// trường nội dung và số liệu, bỏ user/author/profile*.

const DAY_MS = 24 * 60 * 60 * 1000;

// Bỏ dấu tiếng Việt + chữ thường để so khớp từ khóa liên quan
function fold(text) {
  return (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
}

// Bài có liên quan lái xe không: chứa ít nhất 1 từ trong relevance_terms (so khớp không dấu)
export function isRelevant(text, terms) {
  if (!terms?.length) return true;
  const t = fold(text);
  return terms.some(term => t.includes(fold(term)));
}

const toNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

function since(cfg) {
  return new Date(Date.now() - cfg.max_age_days * DAY_MS).toISOString().slice(0, 10);
}

export function buildGroupInput(cfg) {
  return {
    ...cfg.group_input,
    startUrls: cfg.groups.map(url => ({ url })),
    resultsLimit: cfg.max_posts_per_target,
    onlyPostsNewerThan: since(cfg)
  };
}

export function buildPageInput(cfg) {
  return {
    ...cfg.page_input,
    startUrls: cfg.pages.map(url => ({ url })),
    resultsLimit: cfg.max_posts_per_target,
    onlyPostsNewerThan: since(cfg)
  };
}

export function buildCommentInput(postUrls, cfg) {
  return {
    ...cfg.comment_input,
    startUrls: postUrls.map(url => ({ url })),
    resultsLimit: cfg.comments.max_per_post,
    includeNestedComments: cfg.comments.include_replies
  };
}

// Group và page trả về tên trường số liệu khác nhau (likesCount / likes...)
function normalizePosts(rawItems, cfg, fetchedAt, kind, terms) {
  const posts = [];
  let skipped = 0;
  for (const p of rawItems) {
    if (p.error || !p.url) continue;
    const text = p.text ?? p.title ?? null;
    if (!isRelevant(text, terms)) { skipped++; continue; }
    posts.push({
      source: cfg.id,
      type: 'post',
      url: p.url,
      title: null,
      text,
      author_hidden: true,
      published_at: p.time ?? null,
      metrics: {
        views: toNumber(p.viewsCount ?? p.videoViewCount),
        likes: toNumber(p.likesCount ?? p.likes),
        comments: toNumber(p.commentsCount ?? p.comments),
        shares: toNumber(p.sharesCount ?? p.shares)
      },
      parent_url: null,
      // Facebook không tìm theo từ khóa: ghi nơi lấy bài (group/page) vào keyword
      keyword: `${kind}:${p.facebookUrl ?? p.inputUrl ?? '?'}`,
      fetched_at: fetchedAt
    });
  }
  return { posts, skipped };
}

function normalizeComments(rawItems, cfg, fetchedAt, postByUrl) {
  const items = [];
  for (const c of rawItems) {
    if (c.error || !c.commentUrl || !c.text) continue;
    const post = postByUrl.get(c.facebookUrl) ?? null;
    items.push({
      source: cfg.id,
      type: 'comment',
      url: c.commentUrl,
      title: null,
      text: c.text,
      author_hidden: true,
      published_at: c.date ?? null,
      metrics: { views: null, likes: toNumber(c.likesCount), comments: toNumber(c.commentsCount), shares: null },
      parent_url: post?.url ?? c.facebookUrl ?? null,
      keyword: post?.keyword ?? null,
      fetched_at: fetchedAt
    });
  }
  return items;
}

export async function collect({ sourceConfig: cfg, runActor, dryRun, fetchedAt, timeoutSeconds, relevanceTerms = [] }) {
  const runs = [];
  const posts = [];
  const steps = [
    { kind: 'group', targets: cfg.groups ?? [], actor: cfg.groups_actor, build: buildGroupInput },
    { kind: 'page', targets: cfg.pages ?? [], actor: cfg.pages_actor, build: buildPageInput }
  ];

  for (const step of steps) {
    if (!step.targets.length) continue;
    console.log(`🔍 ${cfg.id}/${step.kind}: ${step.targets.length} nơi, tối đa ${cfg.max_posts_per_target} bài/nơi, ≤ ${cfg.max_age_days} ngày`);
    const res = await runActor(step.actor, step.build(cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/${step.kind}`, maxChargeUsd: cfg.max_charge_usd?.[step.kind]
    });
    if (dryRun) continue;
    runs.push({ source: `${cfg.id}/${step.kind}`, ...res.run });
    const { posts: found, skipped } = normalizePosts(res.items, cfg, fetchedAt, step.kind, cfg.relevance_terms ?? relevanceTerms);
    console.log(`   ✅ ${found.length} bài liên quan lái xe (bỏ ${skipped} bài không liên quan)`);
    posts.push(...found);
  }

  if (dryRun) {
    await runActor(cfg.comments_actor, buildCommentInput(['<link N bài nhiều bình luận nhất>'], cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments (N = ${cfg.comments.max_posts})`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    return { items: [], runs };
  }

  // Bình luận: N bài liên quan có nhiều bình luận nhất
  const picked = posts
    .filter(p => (p.metrics.comments ?? 0) > 0)
    .sort((a, b) => b.metrics.comments - a.metrics.comments)
    .slice(0, cfg.comments.max_posts);
  let comments = [];
  if (picked.length) {
    console.log(`   💬 Lấy bình luận cho ${picked.length} bài (tối đa ${cfg.comments.max_per_post} bình luận/bài)`);
    const res = await runActor(cfg.comments_actor, buildCommentInput(picked.map(p => p.url), cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    runs.push({ source: `${cfg.id}/comments`, ...res.run });
    comments = normalizeComments(res.items, cfg, fetchedAt, new Map(picked.map(p => [p.url, p])));
    console.log(`   ✅ ${comments.length} bình luận`);
  }

  return { items: [...posts, ...comments], runs };
}
