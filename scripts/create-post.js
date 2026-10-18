import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function getNextPostNumber() {
  const postsDir = path.join(rootDir, 'posts');
  if (!fs.existsSync(postsDir)) fs.mkdirSync(postsDir, { recursive: true });
  
  const entries = fs.readdirSync(postsDir);
  let maxNum = 0;
  
  entries.forEach(entry => {
    const match = entry.match(/^bai-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });
  
  return maxNum + 1;
}

const customTopic = process.argv.slice(2).join(' ').trim();
const nextNum = getNextPostNumber();
const formattedNum = String(nextNum).padStart(2, '0');
const folderName = `bai-${formattedNum}`;
const postFolderPath = path.join(rootDir, 'posts', folderName);

console.log(`🚀 Đang khởi tạo bài viết tiếp theo: Bài ${formattedNum} (${folderName})...`);
if (customTopic) {
  console.log(`📌 Chủ đề được chọn: "${customTopic}"`);
} else {
  console.log(`📌 Chưa truyền chủ đề. Bài sẽ được chọn tự động từ kế hoạch mới nhất.`);
}

if (!fs.existsSync(postFolderPath)) {
  fs.mkdirSync(postFolderPath, { recursive: true });
}

console.log(`
✅ Thư mục bài viết đã tạo: posts/${folderName}/
💡 Bạn có thể khởi động Claude Code CLI và chạy:
   /create-post ${customTopic || ''}
hoặc yêu cầu AI viết tiếp vào bài ${formattedNum}!
`);
