// Upload aikitsbox deploy/ to OSS bucket
const OSS = require('ali-oss');
const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = 'C:\\Oth\\Essie\\Gagne Geld\\packages\\aikitsbox\\deploy';
const BUCKET = 'aikitsbox';
const REGION = 'oss-cn-hongkong';

// Read credentials from env or args
const accessKeyId = process.env.OSS_ACCESS_KEY_ID || process.argv[2];
const accessKeySecret = process.env.OSS_ACCESS_KEY_SECRET || process.argv[3];

if (!accessKeyId || !accessKeySecret) {
  console.error('Usage: node upload-oss.js <ACCESS_KEY_ID> <ACCESS_KEY_SECRET>');
  console.error('  or set OSS_ACCESS_KEY_ID and OSS_ACCESS_KEY_SECRET env vars');
  process.exit(1);
}

const client = new OSS({
  region: REGION,
  accessKeyId,
  accessKeySecret,
  bucket: BUCKET,
  secure: true,
});

// Collect all files
function collectFiles(dir, base = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath, relativePath));
    } else {
      files.push({ localPath: fullPath, ossPath: relativePath });
    }
  }
  return files;
}

async function upload() {
  const files = collectFiles(DEPLOY_DIR);
  console.log(`Found ${files.length} files to upload to oss://${BUCKET}/`);

  // Content type mapping
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const ext = path.extname(file.localPath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';

    try {
      const result = await client.put(file.ossPath, file.localPath, {
        mime,
        headers: {
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
        },
      });
      uploaded++;
      if (uploaded % 5 === 0 || uploaded === files.length) {
        console.log(`  [${uploaded}/${files.length}] ${file.ossPath} ✓`);
      }
    } catch (err) {
      failed++;
      console.error(`  ✗ ${file.ossPath}: ${err.message}`);
    }
  }

  console.log(`\n=== Upload complete: ${uploaded} success, ${failed} failed ===`);
  console.log(`Site URL: https://${BUCKET}.${REGION}.aliyuncs.com/`);
  console.log(`(After DNS binding: https://aikitsbox.cn/)`);
}

upload().catch(err => {
  console.error('Upload failed:', err.message);
  process.exit(1);
});
