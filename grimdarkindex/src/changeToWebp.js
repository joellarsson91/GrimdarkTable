import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directory containing the images
const imagesDir = path.resolve(__dirname, "../images/changeExtension");

// Check if the directory exists
if (!fs.existsSync(imagesDir)) {
  console.error(`Directory does not exist: ${imagesDir}`);
  process.exit(1); // Exit the script
}

// Read all files in the directory
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error("Error reading the directory:", err);
    return;
  }

  files.forEach((file) => {
    const oldPath = path.join(imagesDir, file);
    const newPath = path.join(imagesDir, path.basename(file, path.extname(file)) + ".webp");

    // Rename the file to have a .webp extension
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error(`Error renaming file ${file}:`, err);
      } else {
        console.log(`Renamed ${file} to ${path.basename(newPath)}`);
      }
    });
  });
});