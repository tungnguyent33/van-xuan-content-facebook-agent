import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Tìm logo thật do người dùng cung cấp (logo.png, logo.jpg, logo-van-xuan.png...)
function getCustomLogoPath(specifiedPath) {
  if (specifiedPath && fs.existsSync(specifiedPath)) return specifiedPath;

  const candidates = [
    path.join(rootDir, 'context', 'image', 'logo.png'),
    path.join(rootDir, 'context', 'image', 'logo.jpg'),
    path.join(rootDir, 'context', 'image', 'logo.webp'),
    path.join(rootDir, 'context', 'image', 'logo-van-xuan.png'),
    path.join(rootDir, 'context', 'image', 'logo-emblem.png')
  ];

  for (const cand of candidates) {
    if (fs.existsSync(cand)) return cand;
  }
  return null;
}

/**
 * Đóng dấu Logo THIẾT KẾ THẬT của người dùng vào góc trên-trái (Top-Left)
 * Tự động tạo nền trắng che phủ các chi tiết vẽ thừa của AI nếu có.
 */
export async function watermarkImage(inputImagePath, outputImagePath, options = {}) {
  if (!fs.existsSync(inputImagePath)) {
    console.error(`❌ Không tìm thấy tệp ảnh nguồn: ${inputImagePath}`);
    return;
  }

  const {
    paddingX = 15,
    paddingY = 15,
    logoWidthRatio = 0.16,
    specifiedLogoPath = null,
    drawWhiteBackground = true // Tự động vẽ nền trắng đệm để che vết vẽ thừa của AI
  } = options;

  const logoFile = getCustomLogoPath(specifiedLogoPath);

  if (!logoFile) {
    console.error(`❌ Không tìm thấy file Logo thiết kế tại context/image/logo.png!`);
    console.log(`💡 Hãy lưu file logo thiết kế của bạn vào: context/image/logo.png`);
    return;
  }

  try {
    const baseImage = sharp(inputImagePath);
    const metadata = await baseImage.metadata();

    // 1. Tính kích thước logo thật
    const targetLogoWidth = Math.round(metadata.width * logoWidthRatio);

    const resizedLogo = sharp(logoFile).resize({ width: targetLogoWidth });
    const logoMetadata = await resizedLogo.metadata();
    const logoBuffer = await resizedLogo.toBuffer();

    const composites = [];

    // 2. Nếu có cờ drawWhiteBackground: tạo 1 ô vuông nền trắng bo góc nhẹ đệm phía dưới logo
    // Giúp che sạch 100% các chữ/vạch do AI vô tình vẽ nhầm phía dưới góc top-left
    if (drawWhiteBackground) {
      const bgWidth = logoMetadata.width + 16;
      const bgHeight = logoMetadata.height + 16;
      const bgTop = Math.max(0, paddingY - 8);
      const bgLeft = Math.max(0, paddingX - 8);

      const whiteBgSvg = `
      <svg width="${bgWidth}" height="${bgHeight}">
        <rect width="${bgWidth}" height="${bgHeight}" rx="12" fill="#FFFFFF" opacity="0.98"/>
      </svg>
      `;

      const whiteBgBuffer = await sharp(Buffer.from(whiteBgSvg)).png().toBuffer();
      composites.push({
        input: whiteBgBuffer,
        top: bgTop,
        left: bgLeft
      });
    }

    // 3. Đè Logo thật của người dùng lên trên nền trắng
    composites.push({
      input: logoBuffer,
      top: paddingY,
      left: paddingX
    });

    const destPath = outputImagePath || inputImagePath;

    await baseImage
      .composite(composites)
      .toFile(destPath + '.tmp');

    fs.renameSync(destPath + '.tmp', destPath);

    console.log(`✅ Đã ghép Logo THIẾT KẾ THẬT (${path.basename(logoFile)}) vào ảnh: ${path.basename(destPath)}`);
  } catch (err) {
    console.error(`❌ Lỗi khi đóng dấu logo vào ảnh ${inputImagePath}:`, err.message);
  }
}

// Phân tích tham số CLI
const args = process.argv.slice(2);
const targetArg = args.find(a => !a.startsWith('--'));

let logoWidthRatio = 0.16;
let paddingX = 15;
let paddingY = 15;
let drawWhiteBackground = true;
let customLogoFile = null;

args.forEach(arg => {
  if (arg.startsWith('--ratio=')) logoWidthRatio = parseFloat(arg.split('=')[1]);
  if (arg.startsWith('--top=')) paddingY = parseInt(arg.split('=')[1], 10);
  if (arg.startsWith('--left=')) paddingX = parseInt(arg.split('=')[1], 10);
  if (arg.startsWith('--logo=')) customLogoFile = arg.split('=')[1];
  if (arg === '--no-white-bg') drawWhiteBackground = false;
});

if (targetArg) {
  const absoluteTarget = path.resolve(process.cwd(), targetArg);
  if (fs.existsSync(absoluteTarget)) {
    const stat = fs.statSync(absoluteTarget);
    const opts = { paddingX, paddingY, logoWidthRatio, specifiedLogoPath: customLogoFile, drawWhiteBackground };

    if (stat.isDirectory()) {
      const files = fs.readdirSync(absoluteTarget);
      const imageFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f) && !f.includes('-watermarked'));
      console.log(`🖼️ Đang ghép Logo thiết kế thật vào ${imageFiles.length} ảnh...`);
      for (const file of imageFiles) {
        const fullPath = path.join(absoluteTarget, file);
        await watermarkImage(fullPath, fullPath, opts);
      }
    } else {
      await watermarkImage(absoluteTarget, absoluteTarget, opts);
    }
  } else {
    console.error(`❌ Đường dẫn không tồn tại: ${targetArg}`);
  }
} else {
  console.log(`
💡 Hướng dẫn ghép LOGO THIẾT KẾ THẬT của bạn:
   1. Lưu file logo thiết kế của bạn vào: context/image/logo.png
   2. Chạy lệnh ghép logo:
      node scripts/apply-watermark.js posts/bai-23/
`);
}
