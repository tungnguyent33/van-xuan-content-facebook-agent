// Gom item trong context/trends/<ngày mới nhất>.json thành cụm chủ đề và tính điểm thô (độ hot,
// tín hiệu tranh cãi) bằng code — không gọi AI, không gọi API. Kết quả: context/topic-candidates.json,
// để lệnh /find-topics (skill topic-scoring) đọc, phân loại bình luận và chấm điểm cuối cùng.
//
// Chạy: node scripts/score-topics.js [--file=context/trends/2026-10-18.json]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const trendsDir = path.join(rootDir, 'context', 'trends');
const outPath = path.join(rootDir, 'context', 'topic-candidates.json');
const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'trend-sources.json'), 'utf-8'));
const scoring = config.scoring ?? {};

const STOPWORDS = new Set(('va la cua co cho khi thi duoc khong nay mot cac nhung nhu de voi tu trong ra vao di da se dang rat bi lai con cung theo tai ve nao gi ai ma neu hay hoac thi thoi nhe a oi em anh chi ban minh toi ho no nguoi nam ngay gio moi nhat qua lam cai roi day do thay biet nhieu it hon ca chua van')
  .split(' '));

const args = process.argv.slice(2);
const fileArg = args.find(a => a.startsWith('--file='))?.slice('--file='.length);

function fold(text) {
  return (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
}

function tokens(text) {
  return new Set(fold(text).replace(/https?:\/\/\S+/g, ' ').split(/[^a-z0-9]+/).filter(w => w.length > 1 && !STOPWORDS.has(w)));
}

// Từ phản bác so khớp giữ nguyên dấu (chỉ hạ chữ thường): bỏ dấu thì "lừa" trùng "lúa", "bịa" trùng "bia"
function lower(text) {
  return (text ?? '').normalize('NFC').toLowerCase();
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter);
}

function listTrendFiles() {
  if (!fs.existsSync(trendsDir)) return [];
  return fs.readdirSync(trendsDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
}

const sum = (arr) => arr.reduce((s, x) => s + (x ?? 0), 0);
const engagement = (m) => (m.likes ?? 0) + (m.comments ?? 0) + (m.shares ?? 0);

// Từ khóa tìm kiếm thật (Google/TikTok/YouTube/diễn đàn) làm hạt nhân cụm; item không có từ khóa
// tìm kiếm (Facebook ghi "group:..."/"page:...") được gán vào cụm giống nhất theo từ ngữ.
function buildClusters(items) {
  const parents = items.filter(i => i.type !== 'comment');
  const comments = items.filter(i => i.type === 'comment' && i.text);
  const clusters = new Map();
  const keyOf = (i) => (i.keyword && !/^(group|page):/.test(i.keyword) ? i.keyword.replace(/^#/, '#') : null);

  for (const item of parents) {
    const k = keyOf(item);
    if (!k) continue;
    const key = fold(k);
    if (!clusters.has(key)) clusters.set(key, { name: k, seed: tokens(k), vocab: new Set(), items: [] });
    clusters.get(key).items.push(item);
  }
  for (const c of clusters.values()) {
    for (const i of c.items) for (const w of tokens(`${i.title ?? ''} ${i.text ?? ''}`)) c.vocab.add(w);
  }

  const minSim = scoring.min_similarity ?? 0.08;
  for (const item of parents) {
    if (keyOf(item)) continue;
    const t = tokens(`${item.title ?? ''} ${item.text ?? ''}`);
    let best = null, bestScore = 0;
    for (const c of clusters.values()) {
      // Trùng với từ khóa gốc của cụm được tính nặng hơn trùng từ vựng chung
      const seedHit = [...c.seed].filter(w => t.has(w)).length / Math.max(c.seed.size, 1);
      const score = 0.6 * seedHit + 0.4 * jaccard(t, c.vocab);
      if (score > bestScore) { best = c; bestScore = score; }
    }
    if (best && bestScore >= minSim) {
      best.items.push(item);
    } else {
      const name = `khác: ${(item.title ?? item.text ?? '').slice(0, 60).replace(/\s+/g, ' ')}`;
      clusters.set(`other:${item.url}`, { name, seed: t, vocab: t, items: [item] });
    }
  }

  // Gộp cụm có từ khóa gần như trùng (vd. "thi bằng A1" và "thi A1 trượt" thì KHÔNG gộp, chỉ gộp
  // khi bộ từ khóa gốc giống nhau ≥ merge_similarity)
  const mergeSim = scoring.merge_similarity ?? 0.75;
  const list = [...clusters.values()];
  for (let a = 0; a < list.length; a++) {
    for (let b = a + 1; b < list.length; b++) {
      if (!list[a] || !list[b]) continue;
      if (jaccard(list[a].seed, list[b].seed) >= mergeSim) {
        list[a].items.push(...list[b].items);
        list[a].name += ` / ${list[b].name}`;
        list[b] = null;
      }
    }
  }
  const result = list.filter(Boolean);

  // Bình luận đi theo bài/video cha
  const clusterOfUrl = new Map();
  for (const c of result) for (const i of c.items) clusterOfUrl.set(i.url, c);
  for (const c of result) c.comments = [];
  for (const cm of comments) clusterOfUrl.get(cm.parent_url)?.comments.push(cm);
  return result;
}

function sourceAverages(items) {
  const bySource = new Map();
  for (const i of items.filter(i => i.type !== 'comment')) {
    const s = bySource.get(i.source) ?? { views: [], eng: [] };
    if (i.metrics.views) s.views.push(i.metrics.views);
    if (engagement(i.metrics)) s.eng.push(engagement(i.metrics));
    bySource.set(i.source, s);
  }
  const avg = new Map();
  for (const [src, s] of bySource) {
    avg.set(src, { views: s.views.length ? sum(s.views) / s.views.length : null, eng: s.eng.length ? sum(s.eng) / s.eng.length : null });
  }
  return avg;
}

function clusterStats(c, avg, disputeTerms, previous) {
  // Độ hot: trung bình (view, tương tác) của item so với trung bình cùng nguồn (1 = ngang trung bình)
  const ratios = [];
  for (const i of c.items) {
    const a = avg.get(i.source);
    if (!a) continue;
    const parts = [];
    if (a.views && i.metrics.views != null) parts.push(i.metrics.views / a.views);
    if (a.eng && engagement(i.metrics)) parts.push(engagement(i.metrics) / a.eng);
    if (parts.length) ratios.push(sum(parts) / parts.length);
  }
  const relHot = ratios.length ? sum(ratios) / ratios.length : 0;

  // Tốc độ tăng: so tổng tương tác + số item với cụm cùng tên ở file lần chạy trước
  const totalEng = sum(c.items.map(i => engagement(i.metrics))) + c.comments.length;
  const prev = previous?.get(fold(c.name));
  const growth = prev ? (totalEng + 1) / (prev + 1) : null;

  // Tranh cãi thô
  const views = sum(c.items.map(i => i.metrics.views));
  const commentCount = sum(c.items.map(i => i.metrics.comments));
  const commentViewRatio = views ? commentCount / views : null;
  const replyChains = c.comments.filter(cm => (cm.metrics.comments ?? 0) > 0).length;
  const foldedTerms = disputeTerms.map(lower);
  const disputing = c.comments.filter(cm => foldedTerms.some(t => lower(cm.text).includes(t))).length;
  const disputeRatio = c.comments.length ? disputing / c.comments.length : 0;

  return {
    rel_hot: +relHot.toFixed(3), growth: growth && +growth.toFixed(2), total_engagement: totalEng,
    views, comment_count_reported: commentCount, comment_view_ratio: commentViewRatio && +commentViewRatio.toFixed(5),
    comments_collected: c.comments.length, reply_chains: replyChains, dispute_comments: disputing,
    dispute_ratio: +disputeRatio.toFixed(3)
  };
}

// Điểm thô: chuẩn hóa theo cụm cao nhất trong lần chạy. Hot tối đa 30, tranh cãi tối đa 30 —
// đúng thang của công thức chấm cuối; liên quan + an toàn do Claude chấm khi đọc cụm.
function rawScores(statsList) {
  const max = (key) => Math.max(...statsList.map(s => s[key] ?? 0), 0) || 1;
  const mHot = max('rel_hot'), mGrowth = max('growth'), mCvr = max('comment_view_ratio'),
    mChains = max('reply_chains'), mDispute = max('dispute_ratio'), mComments = max('comments_collected');
  return statsList.map(s => {
    const hot = 30 * (0.7 * (s.rel_hot / mHot) + 0.3 * ((s.growth ?? 1) / Math.max(mGrowth, 1)));
    const controversy = 30 * (0.3 * ((s.comment_view_ratio ?? 0) / mCvr) + 0.2 * (s.reply_chains / mChains)
      + 0.3 * (s.dispute_ratio / mDispute) + 0.2 * (s.comments_collected / mComments));
    return { hot: +hot.toFixed(1), controversy: +controversy.toFixed(1), total: +(hot + controversy).toFixed(1) };
  });
}

function main() {
  const files = listTrendFiles();
  const file = fileArg ? path.resolve(rootDir, fileArg) : (files.length ? path.join(trendsDir, files.at(-1)) : null);
  if (!file || !fs.existsSync(file)) {
    console.error('❌ Chưa có dữ liệu trong context/trends/ — chạy npm run fetch-trends trước.');
    process.exit(1);
  }
  const snapshot = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Bỏ video/bài không liên quan lái xe (tìm kiếm TikTok/YouTube hay trả video lạc đề) và bình
  // luận của chúng; bài Google giữ lại vì là nguồn xác minh
  const terms = (config.relevance_terms ?? []).map(fold);
  const relevant = (i) => i.source === 'google' || !terms.length || terms.some(t => fold(`${i.title ?? ''} ${i.text ?? ''}`).includes(t));
  const kept = new Set((snapshot.items ?? []).filter(i => i.type !== 'comment' && relevant(i)).map(i => i.url));
  const items = (snapshot.items ?? []).filter(i => (i.type === 'comment' ? kept.has(i.parent_url) : kept.has(i.url)));
  const dropped = (snapshot.items ?? []).length - items.length;
  const disputeTerms = scoring.dispute_terms ?? [];

  // File lần chạy trước (ngày trước đó) để tính tốc độ tăng
  const idx = files.indexOf(path.basename(file));
  let previous = null;
  if (idx > 0) {
    const prevItems = JSON.parse(fs.readFileSync(path.join(trendsDir, files[idx - 1]), 'utf-8')).items ?? [];
    previous = new Map();
    for (const c of buildClusters(prevItems)) {
      previous.set(fold(c.name), sum(c.items.map(i => engagement(i.metrics))) + c.comments.length);
    }
  }

  const avg = sourceAverages(items);
  const clusters = buildClusters(items);
  const stats = clusters.map(c => clusterStats(c, avg, disputeTerms, previous));
  const scores = rawScores(stats);
  const maxSamples = scoring.sample_comments_max ?? 100;

  const candidates = clusters.map((c, i) => {
    // Bình luận mẫu: ưu tiên bình luận có từ phản bác, nhiều like, nhiều trả lời
    const foldedTerms = disputeTerms.map(lower);
    const samples = [...c.comments]
      .map(cm => ({ cm, w: (foldedTerms.some(t => lower(cm.text).includes(t)) ? 1000 : 0) + (cm.metrics.likes ?? 0) + 2 * (cm.metrics.comments ?? 0) }))
      .sort((a, b) => b.w - a.w)
      .slice(0, maxSamples)
      .map(({ cm }) => ({ text: cm.text.slice(0, 400), likes: cm.metrics.likes, replies: cm.metrics.comments, source: cm.source, parent_url: cm.parent_url }));
    const links = [...c.items]
      .sort((a, b) => engagement(b.metrics) - engagement(a.metrics))
      .slice(0, 8)
      .map(it => ({ url: it.url, source: it.source, type: it.type, title: it.title ?? (it.text ?? '').slice(0, 100), metrics: it.metrics }));
    return {
      name: c.name,
      sources: [...new Set(c.items.map(it => it.source))],
      item_count: c.items.length,
      raw_score: scores[i],
      stats: stats[i],
      links,
      sample_comments: samples
    };
  }).sort((a, b) => b.raw_score.total - a.raw_score.total);

  const out = {
    generated_at: new Date().toISOString(),
    trends_file: path.relative(rootDir, file).replace(/\\/g, '/'),
    previous_file: idx > 0 ? `context/trends/${files[idx - 1]}` : null,
    note: 'Điểm thô: hot (0–30) + tranh cãi (0–30), chuẩn hóa theo cụm cao nhất trong lần chạy. Độ liên quan (25) và an toàn (15) do skill topic-scoring chấm.',
    clusters: candidates
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n', 'utf-8');

  console.log(`✅ ${candidates.length} cụm chủ đề từ ${items.length} item (${path.basename(file)}; bỏ ${dropped} item không liên quan lái xe) → context/topic-candidates.json`);
  for (const c of candidates.slice(0, 15)) {
    console.log(`   ${String(c.raw_score.total).padStart(5)}  hot ${c.raw_score.hot} · tranh cãi ${c.raw_score.controversy} · ${c.item_count} bài · ${c.sample_comments.length} BL · ${c.name}`);
  }
}

main();
