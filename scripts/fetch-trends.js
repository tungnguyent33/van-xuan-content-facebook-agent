import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { runActor } from './lib/apify.js';
import { hideNames } from './lib/anonymize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const configPath = path.join(rootDir, 'config', 'trend-sources.json');
const trendsDir = path.join(rootDir, 'context', 'trends');
const trendsMdPath = path.join(rootDir, 'context', 'trends.md');

// Tham số CLI:
//   --dry-run            in input từng nguồn, không gọi API, không ghi file
//   --source=google      chỉ chạy các nguồn này (id trong config, cách nhau dấu phẩy; "all" = mọi nguồn kể cả đang tắt)
//   --keyword="..."      thay bộ từ khóa trong config bằng 1 từ khóa (chạy thử)
//   --limit=3            ghi đè max_results_per_keyword
//   --set=a.b=giá_trị    ghi đè 1 khóa bất kỳ trong cấu hình nguồn (lặp lại được),
//                        ví dụ --set=comments.max_videos=2 --set=comments.max_per_video=20
const args = process.argv.slice(2);
const getArg = (name) => args.find(a => a.startsWith(`--${name}=`))?.split('=').slice(1).join('=');
const dryRun = args.includes('--dry-run');
const onlySource = getArg('source');
const keywordOverride = getArg('keyword');
const limitOverride = getArg('limit') ? parseInt(getArg('limit'), 10) : null;
const setOverrides = args.filter(a => a.startsWith('--set=')).map(a => {
  const [key, ...rest] = a.slice('--set='.length).split('=');
  const raw = rest.join('=');
  let value;
  try { value = JSON.parse(raw); } catch { value = raw; }
  return { key, value };
});

// Áp --limit và --set lên bản sao cấu hình nguồn (không sửa file config)
function applyOverrides(source) {
  const cfg = structuredClone(source);
  if (limitOverride) cfg.max_results_per_keyword = limitOverride;
  for (const { key, value } of setOverrides) {
    const parts = key.split('.');
    let target = cfg;
    for (const part of parts.slice(0, -1)) target = target[part] ??= {};
    target[parts.at(-1)] = value;
  }
  return cfg;
}

// Ngày theo giờ máy (Việt Nam), dạng YYYY-MM-DD
function localDate(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Chuẩn hóa url để khử trùng: bỏ #fragment, tham số utm_*/srsltid, dấu / cuối
function urlKey(url) {
  try {
    const u = new URL(url);
    u.hash = '';
    for (const key of [...u.searchParams.keys()]) {
      if (key.startsWith('utm_') || key === 'srsltid') u.searchParams.delete(key);
    }
    return u.toString().replace(/\/$/, '');
  } catch {
    return url.trim();
  }
}

function dedupe(items) {
  const seen = new Map();
  for (const item of items) {
    const key = urlKey(item.url);
    if (!seen.has(key)) seen.set(key, item);
  }
  return [...seen.values()];
}

function keywordsFor(source, config) {
  if (keywordOverride) return [keywordOverride];
  return source.keyword_groups.flatMap(group => {
    const list = config.keyword_groups[group];
    if (!list) throw new Error(`Nguồn "${source.id}" dùng nhóm từ khóa "${group}" không có trong keyword_groups.`);
    return list;
  });
}

// Tóm tắt dạng markdown để các lệnh cũ (đọc context/trends.md) vẫn chạy
function buildMarkdown(dateStr, snapshot) {
  let md = `# Xu hướng & Tin tức mới nhất (Cập nhật từ Apify)\n\n`;
  md += `🕒 Thời gian cập nhật: ${new Date(snapshot.generated_at).toLocaleString('vi-VN')}\n`;
  md += `Dữ liệu đầy đủ: context/trends/${dateStr}.json (${snapshot.items.length} mục, nguồn: ${snapshot.sources_run.join(', ') || 'không có'})\n\n`;
  if (snapshot.errors.length) {
    md += `⚠️ Một số nguồn lỗi ở lần chạy này: ${snapshot.errors.map(e => e.source).join(', ')} — dữ liệu có thể chưa đủ.\n\n`;
  }
  if (snapshot.items.length === 0) {
    md += `*Chưa tìm thấy kết quả mới.*\n`;
    return md;
  }
  // Bình luận chỉ đếm theo video trong bản tóm tắt; nội dung đầy đủ nằm trong file JSON
  const commentCount = new Map();
  for (const item of snapshot.items) {
    if (item.type === 'comment') commentCount.set(item.parent_url, (commentCount.get(item.parent_url) ?? 0) + 1);
  }
  snapshot.items.filter(item => item.type !== 'comment').forEach((item, i) => {
    const heading = item.title ?? (item.text ? item.text.slice(0, 80) : '(không có tiêu đề)');
    md += `### ${i + 1}. ${heading}\n`;
    md += `- **Nguồn:** ${item.source} · **Loại:** ${item.type} · **Từ khóa:** ${item.keyword ?? '—'}\n`;
    md += `- **Link:** ${item.url}\n`;
    if (item.type !== 'article') {
      const m = item.metrics;
      md += `- **Số liệu:** ${m.views ?? '?'} view · ${m.likes ?? '?'} like · ${m.comments ?? '?'} bình luận · ${m.shares ?? '?'} chia sẻ${item.published_at ? ` · đăng ${item.published_at.slice(0, 10)}` : ''}\n`;
    }
    if (commentCount.has(item.url)) md += `- **Bình luận đã thu:** ${commentCount.get(item.url)} (xem file JSON)\n`;
    md += `- **Mô tả/Trích dẫn:** ${item.text || 'Không có mô tả'}\n\n`;
  });
  return md;
}

async function main() {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const timeoutSeconds = config.defaults?.timeout_seconds ?? 300;

  let sources = config.sources.filter(s => s.enabled);
  if (onlySource === "all") sources = config.sources;
  else if (onlySource) sources = config.sources.filter(s => onlySource.split(",").includes(s.id));
  if (sources.length === 0) {
    console.error(`❌ Không có nguồn nào để chạy${onlySource ? ` (không tìm thấy nguồn "${onlySource}")` : ' (tất cả đang tắt)'}.`);
    process.exit(1);
  }

  const fetchedAt = new Date().toISOString();
  const collected = [];
  const sourcesRun = [];
  const runs = [];
  const errors = [];

  for (const source of sources) {
    const sourceConfig = applyOverrides(source);
    const sourceTimeout = sourceConfig.timeout_seconds ?? timeoutSeconds;
    try {
      const mod = await import(pathToFileURL(path.join(__dirname, 'sources', `${source.module}.js`)).href);
      const keywords = keywordsFor(sourceConfig, config);

      // Nguồn nhiều bước (vd. tiktok: video → bình luận) tự điều khiển qua collect();
      // nguồn 1 bước (vd. google) chỉ cần buildInput + normalize
      let items;
      if (mod.collect) {
        const result = await mod.collect({
          keywords, sourceConfig, runActor, dryRun, fetchedAt, timeoutSeconds: sourceTimeout, keywordOverride,
          relevanceTerms: config.relevance_terms ?? []
        });
        items = result.items;
        runs.push(...result.runs);
      } else {
        const input = mod.buildInput(keywords, sourceConfig);
        console.log(`🔍 ${source.id}: ${keywords.length} từ khóa, tối đa ${sourceConfig.max_results_per_keyword} kết quả/từ khóa`);
        const { items: raw, run } = await runActor(source.actor, input, {
          timeoutSeconds: sourceTimeout, dryRun, label: source.id, maxChargeUsd: sourceConfig.max_charge_usd
        });
        if (dryRun) continue;
        runs.push({ source: source.id, ...run });
        items = mod.normalize(raw, sourceConfig, fetchedAt);
        console.log(`   ✅ ${items.length} mục`);
      }
      if (dryRun) continue;
      // Che tên còn sót trong nội dung bình luận (mọi nguồn)
      for (const item of items) if (item.type === 'comment') item.text = hideNames(item.text);
      collected.push(...items);
      sourcesRun.push(source.id);
    } catch (err) {
      console.error(`   ❌ ${err.message}`);
      errors.push({ source: source.id, message: err.message });
    }
  }

  if (runs.length) {
    console.log('\n💵 Chi phí Apify lần chạy này:');
    for (const r of runs) {
      console.log(`   ${r.source}: ${r.usage_usd?.toFixed(4) ?? '?'} USD · ${r.dataset_items} item · run ${r.id} · sự kiện tính phí ${JSON.stringify(r.charged_events)}`);
    }
    const total = runs.reduce((s, r) => s + (r.usage_usd ?? 0), 0);
    console.log(`   Tổng: ${total.toFixed(4)} USD`);
  }

  if (dryRun) {
    console.log('\n🧪 Dry-run xong — không gọi API, không ghi file.');
    return;
  }

  if (sourcesRun.length === 0) {
    console.error('❌ Không nguồn nào chạy thành công — giữ nguyên dữ liệu cũ, không ghi file.');
    process.exit(1);
  }

  // Gộp với file cùng ngày (nếu đã chạy trước đó trong ngày) rồi khử trùng theo url
  const dateStr = localDate();
  const jsonPath = path.join(trendsDir, `${dateStr}.json`);
  fs.mkdirSync(trendsDir, { recursive: true });
  const previous = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) : null;

  const snapshot = {
    date: dateStr,
    generated_at: fetchedAt,
    sources_run: [...new Set([...(previous?.sources_run ?? []), ...sourcesRun])],
    errors,
    // Lịch sử run trong ngày (id, chi phí USD) để theo dõi tín dụng Apify
    runs: [...(previous?.runs ?? []), ...runs.map(r => ({ ...r, at: fetchedAt }))],
    items: dedupe([...collected, ...(previous?.items ?? [])])
  };

  fs.writeFileSync(jsonPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(trendsMdPath, buildMarkdown(dateStr, snapshot), 'utf-8');
  console.log(`\n✅ Đã lưu ${snapshot.items.length} mục vào context/trends/${dateStr}.json và tóm tắt vào context/trends.md`);

  if (errors.length) process.exit(1);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
