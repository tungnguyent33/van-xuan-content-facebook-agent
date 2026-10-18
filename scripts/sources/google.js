// Nguồn Google Search qua actor apify/google-search-scraper.
// Mỗi nguồn trong scripts/sources/ xuất 2 hàm: buildInput (dựng input cho actor) và
// normalize (chuyển item thô của actor thành item chuẩn hóa dùng chung).

export function buildInput(keywords, sourceConfig) {
  return {
    ...sourceConfig.input,
    queries: keywords.join('\n'),
    resultsPerPage: sourceConfig.max_results_per_keyword
  };
}

export function normalize(rawItems, sourceConfig, fetchedAt) {
  const items = [];
  for (const page of rawItems) {
    const keyword = page.searchQuery?.term ?? null;
    const results = Array.isArray(page.organicResults) ? page.organicResults : [];
    // Google có thể trả nhiều hơn số yêu cầu — cắt đúng giới hạn trong config
    for (const result of results.slice(0, sourceConfig.max_results_per_keyword)) {
      if (!result.url) continue;
      items.push({
        source: sourceConfig.id,
        type: 'article',
        url: result.url,
        title: result.title ?? null,
        text: result.description ?? result.snippet ?? null,
        author_hidden: true,
        published_at: result.date ?? null,
        metrics: { views: null, likes: null, comments: null, shares: null },
        parent_url: null,
        keyword,
        fetched_at: fetchedAt
      });
    }
  }
  return items;
}
