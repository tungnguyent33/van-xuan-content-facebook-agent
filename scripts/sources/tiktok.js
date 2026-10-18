// Nguồn TikTok qua 2 actor:
//   1. clockworks/tiktok-scraper — tìm video theo từ khóa (searchQueries) và hashtag (hashtags)
//   2. clockworks/tiktok-comments-scraper — lấy bình luận (kèm trả lời) cho N video có tỷ lệ
//      bình luận/view cao nhất
// Tên tham số input/output đối chiếu từ input schema + README của actor (build 2026-10-15).
//
// Nguồn nhiều bước nên xuất hàm collect() thay cho cặp buildInput/normalize của google.js.

const DAY_MS = 24 * 60 * 60 * 1000;

// Che @tên người dùng được nhắc trong nội dung — không lưu tên người dùng
function hideMentions(text) {
  return text ? text.replace(/@[\p{L}\p{N}._]+/gu, '@…') : null;
}

// Bỏ @tên người đăng khỏi link video: TikTok mở video theo id, link dạng
// https://www.tiktok.com/@/video/<id> vẫn vào đúng video (kiểm tra 2026-10-18)
function anonymizeVideoUrl(url) {
  return url.replace(/tiktok\.com\/@[^/]*\//, 'tiktok.com/@/');
}

export function buildVideoInput(keywords, hashtags, cfg) {
  const input = { ...cfg.video_input, resultsPerPage: cfg.max_results_per_keyword };
  if (keywords.length) input.searchQueries = keywords;
  if (hashtags.length) input.hashtags = hashtags;
  return input;
}

export function buildCommentInput(videoUrls, cfg) {
  return {
    ...cfg.comment_input,
    postURLs: videoUrls,
    commentsPerPost: cfg.comments.max_per_video,
    maxRepliesPerComment: cfg.comments.max_replies_per_comment
  };
}

function normalizeVideos(rawItems, cfg, fetchedAt, keywordOf) {
  const cutoff = Date.now() - cfg.max_age_days * DAY_MS;
  const allowed = cfg.languages ?? null;
  const videos = [];
  for (const v of rawItems) {
    // Actor đẩy "error item" (có errorCode) khi từ khóa/hashtag không có kết quả
    if (v.errorCode || !v.webVideoUrl) continue;
    const created = v.createTimeISO ? Date.parse(v.createTimeISO) : NaN;
    if (!Number.isFinite(created) || created < cutoff) continue;
    if (allowed && v.textLanguage && !allowed.includes(v.textLanguage)) continue;
    videos.push({
      // Link gốc chỉ giữ trong bộ nhớ để gửi cho actor bình luận, không ghi ra file
      sourceUrl: v.webVideoUrl,
      item: {
        source: cfg.id,
        type: 'video',
        url: anonymizeVideoUrl(v.webVideoUrl),
        title: null,
        text: hideMentions(v.text ?? null),
        author_hidden: true,
        published_at: v.createTimeISO,
        metrics: {
          views: v.playCount ?? null,
          likes: v.diggCount ?? null,
          comments: v.commentCount ?? null,
          shares: v.shareCount ?? null
        },
        parent_url: null,
        keyword: keywordOf(v),
        fetched_at: fetchedAt
      },
      language: v.textLanguage ?? null
    });
  }
  return videos;
}

// Chọn N video cho bước lấy bình luận: tiếng Việt trước, rồi tỷ lệ bình luận/view cao nhất.
// Video quá ít view (dưới min_views) dễ có tỷ lệ ảo nên chỉ dùng để lấp chỗ trống.
export function pickVideosForComments(videos, cfg) {
  const { max_videos, min_views } = cfg.comments;
  const preferred = cfg.languages?.[0] ?? null;
  const ratio = (v) => {
    const { views, comments } = v.item.metrics;
    return views ? (comments ?? 0) / views : 0;
  };
  const sorted = videos
    .filter(v => (v.item.metrics.comments ?? 0) > 0)
    .sort((a, b) => {
      const enoughA = (a.item.metrics.views ?? 0) >= min_views;
      const enoughB = (b.item.metrics.views ?? 0) >= min_views;
      if (enoughA !== enoughB) return enoughA ? -1 : 1;
      const langA = a.language === preferred, langB = b.language === preferred;
      if (langA !== langB) return langA ? -1 : 1;
      return ratio(b) - ratio(a);
    });
  return sorted.slice(0, max_videos);
}

function normalizeComments(rawItems, cfg, fetchedAt, videoByUrl) {
  const items = [];
  for (const c of rawItems) {
    if (c.errorCode || !c.videoWebUrl || !c.cid) continue;
    const video = videoByUrl.get(c.videoWebUrl);
    const videoUrl = video?.url ?? anonymizeVideoUrl(c.videoWebUrl);
    items.push({
      source: cfg.id,
      type: 'comment',
      // Bình luận không có link riêng — ghép link video + id bình luận để khử trùng theo url.
      // Bình luận gốc và trả lời (repliesToId) đều có parent_url là link video.
      url: `${videoUrl}?comment_id=${c.cid}`,
      title: null,
      text: hideMentions(c.text ?? null),
      author_hidden: true,
      published_at: c.createTimeISO ?? null,
      metrics: {
        views: null,
        likes: c.diggCount ?? null,
        comments: c.replyCommentTotal ?? null,
        shares: null
      },
      parent_url: videoUrl,
      keyword: video?.keyword ?? null,
      fetched_at: fetchedAt
    });
  }
  return items;
}

export async function collect({ keywords, sourceConfig: cfg, runActor, dryRun, fetchedAt, timeoutSeconds, keywordOverride }) {
  // Chạy thử với --keyword thì chỉ dùng từ khóa đó, bỏ hashtag
  const hashtags = keywordOverride ? [] : (cfg.hashtags ?? []).map(h => h.replace(/^#/, ''));
  const runs = [];

  console.log(`🔍 ${cfg.id}: ${keywords.length} từ khóa + ${hashtags.length} hashtag, tối đa ${cfg.max_results_per_keyword} video/mục`);
  const videoInput = buildVideoInput(keywords, hashtags, cfg);
  const videoRes = await runActor(cfg.actor, videoInput, {
    timeoutSeconds, dryRun, label: `${cfg.id}/video`, maxChargeUsd: cfg.max_charge_usd?.video
  });

  if (dryRun) {
    const sample = buildCommentInput(['<link N video có tỷ lệ bình luận/view cao nhất>'], cfg);
    await runActor(cfg.comments_actor, sample, {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments (N = ${cfg.comments.max_videos})`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    return { items: [], runs };
  }
  runs.push({ source: `${cfg.id}/video`, ...videoRes.run });

  // Video từ tìm kiếm có searchQuery (đã kiểm tra khi chạy thật 2026-10-18). Video từ hashtag
  // chưa kiểm tra field nguồn, nên đối chiếu danh sách hashtag của video (hashtags[].name)
  // với hashtag trong config.
  const keywordOf = (v) => {
    if (v.searchQuery) return v.searchQuery;
    const names = (v.hashtags ?? []).map(t => t.name?.toLowerCase());
    const match = hashtags.find(h => names.includes(h.toLowerCase()));
    return match ? `#${match}` : null;
  };
  const videos = normalizeVideos(videoRes.items, cfg, fetchedAt, keywordOf);
  console.log(`   ✅ ${videos.length}/${videoRes.items.length} video đạt điều kiện (≤ ${cfg.max_age_days} ngày, ngôn ngữ ${cfg.languages?.join('/') ?? 'bất kỳ'})`);

  const picked = pickVideosForComments(videos, cfg);
  let comments = [];
  if (picked.length && cfg.comments.max_videos > 0) {
    console.log(`   💬 Lấy bình luận cho ${picked.length} video (tối đa ${cfg.comments.max_per_video} bình luận/video)`);
    const commentRes = await runActor(cfg.comments_actor, buildCommentInput(picked.map(v => v.sourceUrl), cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/comments`, maxChargeUsd: cfg.max_charge_usd?.comments
    });
    runs.push({ source: `${cfg.id}/comments`, ...commentRes.run });
    // Actor bình luận trả videoWebUrl là link gốc → tra ra item video đã ẩn tên
    const videoByUrl = new Map(videos.map(v => [v.sourceUrl, v.item]));
    comments = normalizeComments(commentRes.items, cfg, fetchedAt, videoByUrl);
    console.log(`   ✅ ${comments.length} bình luận`);
  }

  return { items: [...videos.map(v => v.item), ...comments], runs };
}
