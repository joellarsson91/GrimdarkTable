import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_URL = 'https://minicompare.info/includes/_data.php';
const BASE_URL = 'https://minicompare.info/';
const TARGET_DIR = path.join(__dirname, 'images2');

// Ensure the folder exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR);
}

const downloadImages = async () => {
  try {
    const res = await fetch(DATA_URL);
    const data = await res.json();

    let downloaded = 0;

    const items = Array.isArray(data) ? data : data.miniatures || [];

    for (const item of items) {
      if (item.game === 'Warhammer 40k' && item.image) {
        const imageUrl = BASE_URL + item.image;
        const imageName = path.basename(item.image);
        const imagePath = path.join(TARGET_DIR, imageName);

        try {
          const imgRes = await fetch(imageUrl);
          const buffer = await imgRes.buffer();
          fs.writeFileSync(imagePath, buffer);
          console.log(`✅ Saved: ${imageName}`);
          downloaded++;
        } catch (imgErr) {
          console.error(`❌ Failed to download ${imageUrl}:`, imgErr.message);
        }
      }
    }

    console.log(`\n🎉 Done! Downloaded ${downloaded} Warhammer 40k images.`);
  } catch (err) {
    console.error('Failed to fetch or process data:', err.message);
  }
};

downloadImages();
