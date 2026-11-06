// Kiểm tra prod Render: index.html + mọi asset nó tham chiếu có tải được không.
const BASE = process.argv[2] || 'https://skillforge-cuw1.onrender.com';

async function head(url) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const text = await res.text();
    return { status: res.status, len: text.length, text };
  } catch (err) {
    return { status: 0, len: 0, text: '', error: err.message };
  }
}

for (const path of ['/', '/login']) {
  const res = await head(BASE + path);
  console.log(`\n=== ${path} → HTTP ${res.status || 'LỖI'} (${res.error || res.len + ' ký tự'}) ===`);
  if (res.error) continue;
  console.log('Đầu nội dung:', JSON.stringify(res.text.slice(0, 160)));
  const assets = [...new Set([...res.text.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]))];
  console.log('Asset tham chiếu:', assets.length ? assets.join(', ') : '(không có)');
  for (const asset of assets) {
    const a = await head(BASE + asset);
    console.log(`   ${asset} → HTTP ${a.status || 'LỖI'} ${a.error || Math.round(a.len / 1024) + ' KB'}`);
  }
}
