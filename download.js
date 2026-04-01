const fs = require('fs');
const https = require('https');
const path = require('path');

const HTML_FILE = 'index.html';
const IMAGES_DIR = 'images';

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const stream = fs.createWriteStream(filepath);
                res.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
        }).on('error', (err) => reject(err));
    });
}

async function run() {
    let content = fs.readFileSync(HTML_FILE, 'utf8');
    
    // Regex to match WIX URLs.
    const urlRegex = /https:\/\/static\.wixstatic\.com\/[^"'\)\s]+/g;
    const matches = Array.from(content.matchAll(urlRegex)).map(m => m[0]);
    
    // Unique URLs
    const uniqueUrls = [...new Set(matches)];
    console.log(`Found ${uniqueUrls.length} unique URLs.`);
    
    if (!fs.existsSync(IMAGES_DIR)){
        fs.mkdirSync(IMAGES_DIR);
    }
    
    const replacements = {};
    let counter = 1;

    for (const url of uniqueUrls) {
        // Try to guess a filename or extension.
        // Some URLs look like: /c05135_c7d0...~mv2.jpg
        let ext = '.jpg';
        if (url.includes('.png')) ext = '.png';
        if (url.includes('.webp')) ext = '.webp';
        if (url.includes('.avif')) ext = '.avif';
        
        const filename = `image_${counter}${ext}`;
        const filepath = path.join(IMAGES_DIR, filename);
        
        console.log(`Downloading ${url} -> ${filepath}`);
        try {
            await downloadImage(url, filepath);
            replacements[url] = `./images/${filename}`;
        } catch (e) {
            console.error(e.message);
        }
        counter++;
    }
    
    // Replace in content
    console.log("Replacing URLs in HTML...");
    for (const [url, relativePath] of Object.entries(replacements)) {
        content = content.split(url).join(relativePath);
    }
    
    fs.writeFileSync(HTML_FILE, content, 'utf8');
    console.log("Done.");
}

run();
