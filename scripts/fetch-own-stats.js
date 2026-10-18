// Lấy số liệu kênh của chính trung tâm (fanpage + TikTok) trong N ngày gần nhất qua Apify →
// context/own-stats/YYYY-MM-DD.json. Lệnh /review-performance đọc file này để ghép với posts/,
// videos/ và cập nhật context/matrix.md.
//
// Chạy: node scripts/fetch-own-stats.js [--dry-run] [--only=facebook|tiktok]
// Cấu hình: config/own-channels.json (link fanpage, tên kênh TikTok, số ngày, trần chi phí).

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runActor } from './lib/apify.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'own-channels.json'), 'utf-8'));
const outDir = path.join(rootDir, 'context', 'own-stats');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.find(a => a.startsWith('--only='))?.slice('--only='.length);
const timeoutSeconds = config.timeout_seconds ?? 600;

function localDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const since = localDate(new Date(Date.now() - config.days * 24 * 60 * 60 * 1000));
const num = (v) => (v === null || v === undefined || v === '' ? null : Number(v));

async function facebook(runs) {
  const cfg = config.facebook;
  console.log(`🔍 Fanpage ${cfg.page_url}: thông tin trang + bài từ ${since}`);
  const page = await runActor(cfg.page_actor, { startUrls: [{ url: cfg.page_url }] }, {
    timeoutSeconds, dryRun, label: 'own/facebook-page', maxChargeUsd: cfg.max_charge_usd
  });
  const posts = await runActor(cfg.posts_actor, { startUrls: [{ url: cfg.page_url }], resultsLimit: cfg.max_posts, onlyPostsNewerThan: since }, {
    timeoutSeconds, dryRun, label: 'own/facebook-posts', maxChargeUsd: cfg.max_charge_usd
  });
  if (dryRun) return null;
  runs.push({ source: 'own/facebook-page', ...page.run }, { source: 'own/facebook-posts', ...posts.run });
  const info = page.items[0] ?? {};
  const items = posts.items.filter(p => p.url && !p.error).map(p => ({
    url: p.url,
    published_at: p.time ?? null,
    text: (p.text ?? '').slice(0, 500),
    has_video: Boolean(p.isVideo ?? p.media?.some?.(m => m.__typename === 'Video')),
    metrics: {
      views: num(p.viewsCount ?? p.videoViewCount),
      likes: num(p.likes ?? p.likesCount),
      comments: num(p.comments ?? p.commentsCount),
      shares: num(p.shares ?? p.sharesCount)
    }
  }));
  console.log(`   ✅ ${items.length} bài · ${info.followers ?? '?'} người theo dõi`);
  return { url: cfg.page_url, followers: num(info.followers), likes: num(info.likes), rating: info.rating ?? null, posts: items };
}

async function tiktok(runs) {
  const cfg = config.tiktok;
  if (!cfg.profile) {
    console.log('⏭️  TikTok: chưa có tên kênh trong config/own-channels.json — bỏ qua.');
    return null;
  }
  console.log(`🔍 TikTok @${cfg.profile}: video từ ${since}`);
  const res = await runActor(cfg.actor, {
    profiles: [cfg.profile], profileScrapeSections: ['videos'], profileSorting: 'latest',
    resultsPerPage: cfg.max_videos, oldestPostDateUnified: since,
    shouldDownloadVideos: false, shouldDownloadCovers: false, shouldDownloadAvatars: false,
    shouldDownloadMusicCovers: false, shouldDownloadSlideshowImages: false
  }, { timeoutSeconds, dryRun, label: 'own/tiktok', maxChargeUsd: cfg.max_charge_usd });
  if (dryRun) return null;
  runs.push({ source: 'own/tiktok', ...res.run });
  const videos = res.items.filter(v => v.webVideoUrl && !v.errorCode);
  const items = videos.map(v => ({
    url: v.webVideoUrl,
    published_at: v.createTimeISO ?? null,
    text: (v.text ?? '').slice(0, 500),
    duration_seconds: v.videoMeta?.duration ?? null,
    metrics: { views: num(v.playCount), likes: num(v.diggCount), comments: num(v.commentCount), shares: num(v.shareCount) }
  }));
  const followers = num(videos[0]?.authorMeta?.fans);
  console.log(`   ✅ ${items.length} video · ${followers ?? '?'} người theo dõi`);
  return { profile: cfg.profile, followers, videos: items };
}

async function main() {
  const runs = [];
  const result = { date: localDate(), generated_at: new Date().toISOString(), days: config.days, since, facebook: null, tiktok: null, runs, errors: [] };
  for (const [name, fn] of [['facebook', facebook], ['tiktok', tiktok]]) {
    if (only && only !== name) continue;
    try {
      result[name] = await fn(runs);
    } catch (err) {
      console.error(`   ❌ ${err.message}`);
      result.errors.push({ source: name, message: err.message });
    }
  }
  if (runs.length) {
    const total = runs.reduce((s, r) => s + (r.usage_usd ?? 0), 0);
    console.log(`\n💵 Chi phí Apify: ${total.toFixed(4)} USD (${runs.map(r => `${r.source} ${r.usage_usd?.toFixed(4) ?? '?'}`).join(' · ')})`);
  }
  if (dryRun) {
    console.log('\n🧪 Dry-run xong — không gọi API, không ghi file.');
    return;
  }
  if (!result.facebook && !result.tiktok) {
    console.error('❌ Không lấy được số liệu kênh nào — không ghi file.');
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${result.date}.json`);
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n', 'utf-8');
  console.log(`✅ Đã lưu context/own-stats/${result.date}.json`);
  if (result.errors.length) process.exit(1);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
