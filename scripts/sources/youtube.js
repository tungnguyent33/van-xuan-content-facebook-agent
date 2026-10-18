// Nguồn YouTube qua 2 actor (chọn trên Apify Store 2026-10-18: nhiều người dùng nhất, đánh giá
// 4,8–4,9/5, cập nhật trong tuần):
//   1. streamers/youtube-scraper — tìm video theo từ khóa (searchQueries)
//   2. streamers/youtube-comments-scraper — bình luận (kèm trả lời) cho N video nhiều bình luận nhất
// Tên tham số input/output đối chiếu từ input schema + dataset schema của actor (build 2026-10-17).
//
// Không lưu tên kênh, tên/ảnh người bình luận: normalize bỏ channel*, author.

const DAY_MS = 24 * 60 * 60 * 1000;

function hideMentions(text) {
  return text ? text.replace(/@[\p{L}\p{N}._-]+/gu, '@…') : null;
}

function videoIdOf(url) {
  try { return new URL(url).searchParams.get('v'); } catch { return null; }
}

export function buildVideoInput(keywords, cfg) {
  return { ...cfg.video_input, searchQueries: keywords, maxResults: cfg.max_results_per_keyword };
}

export function buildCommentInput(videoUrls, cfg) {
  return { ...cfg.comment_input, startUrls: videoUrls.map(url => ({ url })), maxComments: cfg.comments.max_per_video };
}

function normalizeVideos(rawItems, cfg, fetchedAt) {
  const cutoff = Date.now() - cfg.max_age_days * DAY_MS;
  const videos = [];
  for (const v of rawItems) {
    if (v.error || !v.url || v.type === 'channel') continue;
    const created = v.date ? Date.parse(v.date) : NaN;
    if (Number.isFinite(created) && created < cutoff) continue;
    const id = v.id ?? videoIdOf(v.url);
    videos.push({
      source: cfg.id,
      type: 'video',
      url: id ? `https://www.youtube.com/watch?v=${id}` : v.url,
      title: v.title ?? null,
      text: hideMentions(v.text ?? null),
      author_hidden: true,
      published_at: v.date ?? null,
      metrics: { views: v.viewCount ?? null, likes: v.likes ?? null, comments: v.commentsCount ?? null, shares: null },
      parent_url: null,
      keyword: v.input ?? null,
      fetched_at: fetchedAt
    });
  }
  return videos;
}

function normalizeComments(rawItems, cfg, fetchedAt, videoById) {
  const items = [];
  for (const c of rawItems) {
    if (c.error || !c.cid || !c.comment) continue;
    const videoId = c.videoId ?? videoIdOf(c.pageUrl);
    const video = videoById.get(videoId);
    const videoUrl = video?.url ?? `https://www.youtube.com/watch?v=${videoId}`;
    items.push({
      source: cfg.id,
      type: 'comment',
      url: `${videoUrl}&lc=${c.cid}`,
      title: null,
      text: hideMentions(c.comment),
      author_hidden: true,
      // Actor chỉ trả thời gian tương đối ("2 tuần trước"), không có ngày chính xác
      published_at: null,
      metrics: { views: null, likes: c.voteCount ?? null, comments: c.replyCount ?? null, shares: null },
      parent_url: videoUrl,
      keyword: video?.keyword ?? null,
      fetched_at: fetchedAt
    });
  }
  return items;
}

export async function collect({ keywords, sourceConfig: cfg, runActor, dryRun, fetchedAt, timeoutSeconds }) {
  const runs = [];
  console.log(`🔍 ${cfg.id}: ${keywords.length} từ khóa, tối đa ${cfg.max_results_per_keyword} video/từ khóa`);
  const videoRes = await runActor(cfg.actor, buildVideoInput(keywords, cfg), {
    timeoutSeconds, dryRun, label: `${cfg.id}/video`, maxChargeUsd: cfg.max_charge_usd?.video
  });
  if (dryRun) {
    await runActor(cfg.comments_actor, buildCommentInput(['<link N video nhiều bình luận nhất>'], cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments (N = ${cfg.comments.max_videos})`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    return { items: [], runs };
  }
  runs.push({ source: `${cfg.id}/video`, ...videoRes.run });
  const videos = normalizeVideos(videoRes.items, cfg, fetchedAt);
  console.log(`   ✅ ${videos.length}/${videoRes.items.length} video ≤ ${cfg.max_age_days} ngày`);

  const picked = videos
    .filter(v => (v.metrics.comments ?? 0) > 0)
    .sort((a, b) => b.metrics.comments - a.metrics.comments)
    .slice(0, cfg.comments.max_videos);
  let comments = [];
  if (picked.length) {
    console.log(`   💬 Lấy bình luận cho ${picked.length} video (tối đa ${cfg.comments.max_per_video} bình luận/video)`);
    const res = await runActor(cfg.comments_actor, buildCommentInput(picked.map(v => v.url), cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    runs.push({ source: `${cfg.id}/comments`, ...res.run });
    comments = normalizeComments(res.items, cfg, fetchedAt, new Map(picked.map(v => [videoIdOf(v.url), v])));
    console.log(`   ✅ ${comments.length} bình luận`);
  }
  return { items: [...videos, ...comments], runs };
}
