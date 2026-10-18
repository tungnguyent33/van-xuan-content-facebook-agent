import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Logo Banner rộng (Full Logo)
const svgBanner = `
<svg width="360" height="100" viewBox="0 0 360 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#048DD1" />
      <stop offset="100%" stop-color="#E4661F" />
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="356" height="96" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
  <g transform="translate(10, 10)">
    <circle cx="40" cy="40" r="36" fill="#0E3970"/>
    <circle cx="40" cy="40" r="24" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.3"/>
    <path d="M 20 24 L 34 58 L 43 58 L 30 24 Z" fill="#FFFFFF"/>
    <path d="M 36 24 L 60 58 L 50 58 L 27 24 Z" fill="url(#orangeGrad)"/>
    <path d="M 46 24 L 60 24 L 34 58 L 23 58 Z" fill="#E4661F"/>
  </g>
  <text x="100" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="18" fill="#0E3970">VẠN XUÂN</text>
  <text x="100" y="68" font-family="Arial, sans-serif" font-weight="700" font-size="12" fill="#E4661F">ĐÀO TẠO LÁI XE PHÚ THỌ</text>
</svg>
`;

// 2. Logo Emblem Tròn Gọn (Dành cho khung ô vuông top-left nhỏ)
const svgEmblem = `
<svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#048DD1" />
      <stop offset="100%" stop-color="#E4661F" />
    </linearGradient>
  </defs>
  <rect x="5" y="5" width="150" height="150" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
  <g transform="translate(15, 15)">
    <circle cx="65" cy="65" r="58" fill="#0E3970"/>
    <circle cx="65" cy="65" r="38" fill="none" stroke="#FFFFFF" stroke-width="5" opacity="0.3"/>
    <path d="M 32 38 L 56 94 L 70 94 L 48 38 Z" fill="#FFFFFF"/>
    <path d="M 58 38 L 98 94 L 80 94 L 44 38 Z" fill="url(#orangeGrad)"/>
    <path d="M 74 38 L 98 38 L 56 94 L 38 94 Z" fill="#E4661F"/>
  </g>
</svg>
`;

async function generateLogos() {
  const bannerPath = path.join(rootDir, 'context', 'image', 'logo-van-xuan.png');
  const emblemPath = path.join(rootDir, 'context', 'image', 'logo-emblem.png');

  await sharp(Buffer.from(svgBanner)).png().toFile(bannerPath);
  await sharp(Buffer.from(svgEmblem)).png().toFile(emblemPath);

  console.log(`✅ Đã sinh 2 mẫu logo:`);
  console.log(`   - Logo Ngang: context/image/logo-van-xuan.png`);
  console.log(`   - Logo Emblem Gọn: context/image/logo-emblem.png`);
}

generateLogos();
