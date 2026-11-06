// Kiểm tra prod với Accept: text/html (giống trình duyệt) — đây mới là cách SPA fallback chạy.
const BASE = process.argv[2] || 'https://skillforge-cuw1.onrender.com';

async function probe(path, accept) {
  try {
    const res = await fetch(BASE + path, { headers: { Accept: accept }, redirect: 'manual' });
    const text = await res.text();
    const title = (text.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const assets = [...new Set([...text.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]))];
    console.log(`${path.padEnd(24)} Accept: ${accept.padEnd(12)} → HTTP ${res.status}${res.headers.get('location') ? ' → ' + res.headers.get('location') : ''} | ${text.length} ký tự | title="${title}" | ${assets.join(', ') || 'không asset'}`);
    return { text, assets };
  } catch (err) {
    console.log(`${path.padEnd(24)} Accept: ${accept.padEnd(12)} → LỖI: ${err.message}`);
    return { text: '', assets: [] };
  }
}

const html = await probe('/', 'text/html');
await probe('/login', 'text/html');
await probe('/login', '*/*');
await probe('/register', 'text/html');
await probe('/dashboard', 'text/html');

for (const asset of html.assets) {
  try {
    const res = await fetch(BASE + asset);
    console.log(`asset ${asset} → HTTP ${res.status} ${Math.round((await res.text()).length / 1024)} KB`);
  } catch (err) {
    console.log(`asset ${asset} → LỖI: ${err.message}`);
  }
}

// Trang nào người dùng mở cũng phải tải được chunk; kiểm tra vài chunk con của bản prod
const chunks = [...new Set([...html.text.matchAll(/\/assets\/([A-Za-z0-9_\-\.]+\.js)/g)].map((m) => m[1]))];
console.log('\nChunk trong index.html prod:', chunks.join(', ') || '(không có)');
