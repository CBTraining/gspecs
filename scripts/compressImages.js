import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesDir = path.join(__dirname, '../public/images');

async function compress() {
  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg'));
  console.log(`Found ${files.length} images to process.`);

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    
    // If over 500KB, let's compress it!
    if (stats.size > 500 * 1024) {
      console.log(`Compressing ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
      const tempPath = filePath + '.tmp.jpg';
      
      await sharp(filePath)
        .resize({ width: 1200, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(tempPath);
        
      fs.renameSync(tempPath, filePath);
      
      const newStats = fs.statSync(filePath);
      console.log(`Done: ${(newStats.size / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.log(`Skipping ${file} (Size OK)`);
    }
  }
}

compress().catch(console.error);
