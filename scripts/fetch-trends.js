import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Đọc file .env
function getEnvToken() {
  const envPath = path.join(rootDir, '.env');
  if (!fs.existsSync(envPath)) return null;
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/^APIFY_API_TOKEN=(.+)$/m);
  return match ? match[1].trim() : null;
}

async function fetchTrends() {
  const token = getEnvToken();
  const trendsFilePath = path.join(rootDir, 'context', 'trends.md');

  if (!token) {
    console.log('⚠️ Không tìm thấy APIFY_API_TOKEN trong file .env');
    console.log('💡 Vui lòng thêm APIFY_API_TOKEN vào file .env để cào dữ liệu xu hướng thực tế.');
    return;
  }

  console.log('🔍 Đang gửi yêu cầu cào dữ liệu xu hướng ngành lái xe qua Apify API...');

  // Các từ khóa tìm kiếm xu hướng
  const keywords = [
    'thi sát hạch lái xe mới nhất',
    'mẹo thi sa hình b2 a1',
    'thay đổi quy định bằng lái xe 2026',
    'kinh nghiệm học lái xe ô tô phó thọ'
  ];

  const payload = {
    queries: keywords.join('\n'),
    maxPagesPerQuery: 1,
    resultsPerPage: 5,
    languageCode: 'vi',
    countryCode: 'vn'
  };

  try {
    // Sử dụng Actor Google Search Scraper của Apify (apify/google-search-scraper)
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${token}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Apify API Lỗi [${response.status}]:`, errorText);
      return;
    }

    const data = await response.json();
    let markdownOutput = `# Xu hướng & Tin tức mới nhất (Cập nhật từ Apify)\n\n`;
    markdownOutput += `> 🕒 Thời gian cập nhật: ${new Date().toLocaleString('vi-VN')}\n\n`;

    if (Array.isArray(data) && data.length > 0) {
      let count = 1;
      data.forEach((item) => {
        if (item.organicResults && Array.isArray(item.organicResults)) {
          item.organicResults.forEach((result) => {
            markdownOutput += `### ${count++}. ${result.title}\n`;
            markdownOutput += `- **Link:** ${result.url}\n`;
            markdownOutput += `- **Mô tả/Trích dẫn:** ${result.description || result.snippet || 'Không có mô tả'}\n\n`;
          });
        }
      });
    } else {
      markdownOutput += `*Chưa tìm thấy kết quả mới hoặc token Apify chưa được cấp đủ quyền.*\n`;
    }

    fs.writeFileSync(trendsFilePath, markdownOutput, 'utf-8');
    console.log(`✅ Đã cập nhật thành công xu hướng thực tế vào: context/trends.md`);
  } catch (err) {
    console.error('❌ Lỗi khi kết nối với Apify API:', err.message);
  }
}

fetchTrends();
