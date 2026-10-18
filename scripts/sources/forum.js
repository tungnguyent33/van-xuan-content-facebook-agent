// Nguồn diễn đàn (otofun.net, voz.vn), 2 bước:
//   1. apify/google-search-scraper với truy vấn "site:<diễn đàn> <từ khóa>" → tìm chủ đề thảo luận
//      (tiêu đề + đoạn trích). Rẻ, và chỉ dùng kết quả tìm kiếm công khai.
//   2. apify/website-content-crawler đọc nội dung N chủ đề liên quan nhất, CHỈ với diễn đàn có
//      crawl: true trong config. Tôn trọng robots.txt (respectRobotsTxtFile), không đi link con
//      (maxCrawlDepth 0), giới hạn số trang (max_threads).
// voz.vn để crawl: false: robots.txt của voz chặn các bot AI (ClaudeBot, GPTBot...) và ghi
// Content-Signal "ai-train=no" — chỉ dùng tiêu đề/đoạn trích từ Google.
//
// Ẩn danh: bỏ khối tên/ảnh/chữ ký người đăng của XenForo bằng removeElementsCssSelector, và
// che dòng "<tên> said:" / "<tên> nói:" còn sót trong trích dẫn.

function fold(text) {
  return (text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
}

function isRelevant(text, terms) {
  if (!terms?.length) return true;
  const t = fold(text);
  return terms.some(term => t.includes(fold(term)));
}

function anonymize(text) {
  if (!text) return null;
  return text
    .replace(/^.{1,40}\s(said|nói|đã viết|viết):\s*$/gimu, '(ẩn tên) nói:')
    .replace(/@[\p{L}\p{N}._-]+/gu, '@…');
}

// Chủ đề XenForo: /threads/<slug>.<id>/ — bỏ /page-N, /post-N để khử trùng
function threadUrl(url) {
  const m = url.match(/^(https?:\/\/[^/]+\/(?:[a-z-]+\/)?threads\/[^/]+\/)/i);
  return m ? m[1] : null;
}

export function buildSearchInput(keywords, cfg) {
  const queries = cfg.forums.flatMap(f => keywords.map(k => `site:${f.domain} ${k}`));
  return { ...cfg.search_input, queries: queries.join('\n'), resultsPerPage: cfg.max_results_per_keyword };
}

export function buildCrawlInput(urls, cfg) {
  return {
    ...cfg.crawl_input,
    startUrls: urls.map(url => ({ url })),
    maxCrawlDepth: 0,
    maxCrawlPages: urls.length,
    maxResults: urls.length,
    respectRobotsTxtFile: true
  };
}

export async function collect({ keywords, sourceConfig: cfg, runActor, dryRun, fetchedAt, timeoutSeconds, relevanceTerms = [] }) {
  const runs = [];
  const terms = cfg.relevance_terms ?? relevanceTerms;
  console.log(`🔍 ${cfg.id}: ${cfg.forums.length} diễn đàn × ${keywords.length} từ khóa, tối đa ${cfg.max_results_per_keyword} chủ đề/truy vấn`);
  const searchRes = await runActor(cfg.search_actor, buildSearchInput(keywords, cfg), {
    timeoutSeconds, dryRun, label: `${cfg.id}/search`, maxChargeUsd: cfg.max_charge_usd?.search
  });
  if (dryRun) {
    await runActor(cfg.crawl_actor, buildCrawlInput(['<link N chủ đề liên quan nhất, chỉ diễn đàn crawl: true>'], cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/crawl (N = ${cfg.max_threads})`, maxChargeUsd: cfg.max_charge_usd?.crawl
    });
    return { items: [], runs };
  }
  runs.push({ source: `${cfg.id}/search`, ...searchRes.run });

  // Kết quả Google → item "post" theo chủ đề (khử trùng theo link chủ đề)
  const threads = new Map();
  for (const page of searchRes.items) {
    const keyword = (page.searchQuery?.term ?? '').replace(/^site:\S+\s*/, '') || null;
    for (const r of (page.organicResults ?? []).slice(0, cfg.max_results_per_keyword)) {
      const url = r.url && threadUrl(r.url);
      if (!url || threads.has(url)) continue;
      const text = `${r.title ?? ''} ${r.description ?? ''}`;
      if (!isRelevant(text, terms)) continue;
      const forum = cfg.forums.find(f => url.includes(f.domain));
      threads.set(url, {
        crawl: forum?.crawl === true,
        item: {
          source: cfg.id,
          type: 'post',
          url,
          title: r.title ?? null,
          text: anonymize(r.description ?? null),
          author_hidden: true,
          published_at: r.date ?? null,
          metrics: { views: null, likes: null, comments: null, shares: null },
          parent_url: null,
          keyword,
          fetched_at: fetchedAt
        }
      });
    }
  }
  console.log(`   ✅ ${threads.size} chủ đề liên quan`);

  // Đọc nội dung chủ đề ở diễn đàn cho phép crawl (theo thứ tự xuất hiện trên Google)
  const toCrawl = [...threads.entries()].filter(([, t]) => t.crawl).slice(0, cfg.max_threads).map(([url]) => url);
  if (toCrawl.length) {
    console.log(`   📖 Đọc nội dung ${toCrawl.length} chủ đề (tôn trọng robots.txt)`);
    const res = await runActor(cfg.crawl_actor, buildCrawlInput(toCrawl, cfg), {
      timeoutSeconds, dryRun, label: `${cfg.id}/crawl`, maxChargeUsd: cfg.max_charge_usd?.crawl
    });
    runs.push({ source: `${cfg.id}/crawl`, ...res.run });
    let filled = 0;
    for (const page of res.items) {
      const url = threadUrl(page.url ?? page.crawl?.loadedUrl ?? '');
      const thread = url && threads.get(url);
      if (!thread || !page.text) continue;
      thread.item.text = anonymize(page.text.slice(0, cfg.max_text_chars));
      filled++;
    }
    console.log(`   ✅ Đọc được ${filled}/${toCrawl.length} chủ đề`);
  }

  return { items: [...threads.values()].map(t => t.item), runs };
}
