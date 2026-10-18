import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const postsDir = path.resolve(__dirname, '..', 'posts');

if (fs.existsSync(postsDir)) {
  const folders = fs.readdirSync(postsDir);
  let cleanedCount = 0;

  folders.forEach(folder => {
    const filePath = path.join(postsDir, folder, 'noi-dung.md');
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Xóa tất cả các ký tự > ở đầu dòng
      const updatedContent = content.replace(/^>\s?/gm, '');
      
      if (content !== updatedContent) {
        fs.writeFileSync(filePath, updatedContent, 'utf-8');
        cleanedCount++;
        console.log(`✅ Đã làm sạch: posts/${folder}/noi-dung.md`);
      }
    }
  });

  console.log(`🎉 Hoàn tất! Đã xóa sạch dấu '>' từ ${cleanedCount} file nội dung.`);
}
