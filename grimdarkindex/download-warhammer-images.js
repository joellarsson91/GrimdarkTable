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

const extractImageUrls = (data, baseUrl) => {
  const urls = [];

  const traverse = (obj) => {
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        traverse(obj[key]);
      }
    } else if (typeof obj === 'string' && obj.endsWith('.webp')) {
      urls.push(baseUrl + obj.replace('../', ''));
    }
  };

  traverse(data);
  return urls;
};

const downloadImages = async () => {
  try {
    console.log(`Fetching data from: ${DATA_URL}`);
    const res = await fetch(DATA_URL);

    if (!res.ok) {
      console.error(`❌ Failed to fetch data from ${DATA_URL} - Status: ${res.status}`);
      return;
    }

    const data = await res.json();

    // Extract all image URLs
    const imageUrls = extractImageUrls(data, BASE_URL);
    console.log(`Total images found: ${imageUrls.length}`);

    let downloaded = 0;

    for (const imageUrl of imageUrls) {
      const imageName = path.basename(imageUrl);
      const imagePath = path.join(TARGET_DIR, imageName);

      console.log(`Downloading image: ${imageUrl}`);

      try {
        const imgRes = await fetch(imageUrl);
        if (!imgRes.ok) {
          console.error(`❌ Failed to fetch image: ${imageUrl} - Status: ${imgRes.status}`);
          continue;
        }

        const buffer = await imgRes.buffer();
        fs.writeFileSync(imagePath, buffer);
        console.log(`✅ Saved: ${imageName}`);
        downloaded++;
      } catch (imgErr) {
        console.error(`❌ Failed to download ${imageUrl}:`, imgErr.message);
      }
    }

    console.log(`\n🎉 Done! Downloaded ${downloaded} images.`);
  } catch (err) {
    console.error('Failed to fetch or process data:', err.message);
  }
};

downloadImages();