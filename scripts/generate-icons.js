const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  const sourceIcon = path.join(__dirname, '../public/icons/icon-512x512.png');
  const iconDir = path.join(__dirname, '../public/icons');

  // Ensure directory exists
  if (!fs.existsSync(iconDir)) {
    fs.mkdirSync(iconDir, { recursive: true });
  }

  for (const size of sizes) {
    const outputPath = path.join(iconDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(sourceIcon)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`Error generating ${size}x${size} icon:`, error);
    }
  }
}

generateIcons().catch(console.error);