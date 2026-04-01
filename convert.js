const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, 'images');

async function convertToWebP() {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
        if (!file.endsWith('.webp') && !file.endsWith('.svg') && file !== 'logo.png') {
            const ext = path.extname(file);
            const basename = path.basename(file, ext);
            const inputPath = path.join(imagesDir, file);
            const outputPath = path.join(imagesDir, basename + '.webp');
            
            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`Converted ${file} to ${basename}.webp`);
                
                // Optionally delete original
                fs.unlinkSync(inputPath);
            } catch (err) {
                console.error(`Error converting ${file}: `, err);
            }
        }
    }
}

convertToWebP().then(() => console.log('All images converted to WebP!'));
