import fs from 'fs';
import path from 'path';
import stringSimilarity from 'string-similarity'; // Install this package using `npm install string-similarity`

// Correctly resolve __dirname for Windows
const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const IMAGES_DIR = path.join(__dirname, 'images');
const IMAGES2_DIR = path.join(__dirname, 'images2');
const IMAGES3_DIR = path.join(__dirname, 'images3');

// Ensure the target folder exists
if (!fs.existsSync(IMAGES3_DIR)) {
  fs.mkdirSync(IMAGES3_DIR);
}

// Get all filenames from a directory
const getFilenames = (dir) => {
  return fs.readdirSync(dir).filter((file) => file.endsWith('.webp'));
};

// Match and move similar images
const matchAndMoveImages = () => {
  const images = getFilenames(IMAGES_DIR);
  const images2 = getFilenames(IMAGES2_DIR);

  images.forEach((image) => {
    const baseImageName = path.basename(image, '.webp').toLowerCase();

    // Find the best match in images2
    const matches = stringSimilarity.findBestMatch(
      baseImageName,
      images2.map((img) => path.basename(img, '.webp').toLowerCase())
    );

    if (matches.bestMatch.rating > 0.6) { // Adjust threshold as needed
      const matchedImage = images2[matches.bestMatchIndex];
      const sourcePath = path.join(IMAGES2_DIR, matchedImage);
      const targetPath = path.join(IMAGES3_DIR, image); // Use the name from the "images" folder

      // Copy the matched image to images3 with the new name
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✅ Copied: ${matchedImage} as ${image}`);
    }
  });

  console.log('🎉 Matching and copying completed!');
};

matchAndMoveImages();