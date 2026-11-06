// Kiểm chứng chức năng lật thẻ ở /ai và /ai/agent bằng CDP.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const BASE = 'http://localhost:8080';

const profile = mkdtempSync(join(tmpdir(), 'dsh-flip-'));
const chrome = spawn(
  CHROME,
  ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--mute-audio', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'],
  { stdio: 'ignore' },
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getTarget() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (err) {
      // chờ Chrome
    }
    await sleep(250);
  }
  throw new Error('Không kết nối được Chrome CDP');
}

function createClient(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let nextId = 1;
  const pending = new Map();
  const ready = new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', () => reject(new Error('WS lỗi')));
  });
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(JSON.stringify(msg.error)));
      else resolve(msg.result);
    }
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  return { ready, send, close: () => ws.close() };
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error('Lỗi JS: ' + (result.exceptionDetails.exception?.description || result.exceptionDetails.text));
  return result.result.value;
}

const probe = (cardSel, innerSel, backSel) => `(() => {
  const card = document.querySelector('${cardSel}');
  const inner = document.querySelector('${innerSel}');
  const back = document.querySelector('${backSel}');
  if (!card || !inner) return { error: 'không thấy thẻ' };
  const cs = getComputedStyle(inner);
  const backRect = back ? back.getBoundingClientRect() : null;
  const frontText = (document.querySelector('${cardSel}')?.innerText || '').slice(0, 60);
  // Hit-test tại tâm thẻ: cho biết mặt nào đang thực sự nhìn thấy
  const rect = card.getBoundingClientRect();
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  const face = hit ? hit.closest('${cardSel} > * > *') : null;
  const hitFace = face ? face.className.split(' ').find((c) => c.includes('front') || c.includes('back')) : 'không rõ';
  return {
    flippedClass: card.classList.contains('flipped'),
    transform: cs.transform,
    transformStyle: cs.transformStyle,
    innerMinHeight: cs.minHeight,
    hitFace,
    backVisibleBefore: backRect ? (backRect.height > 0 && getComputedStyle(back).visibility !== 'hidden') : null,
    backTransform: back ? getComputedStyle(back).transform : null,
    backface: back ? getComputedStyle(back).backfaceVisibility : null,
    text: frontText.replace(/\\n/g, ' | '),
  };
})()`;

try {
  const client = createClient(await getTarget());
  await client.ready;
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  const pages = [
    ['/ai', '.flashcard', '.flashcard-inner', '.flashcard-back', '.flashcard-btn'],
    ['/ai/agent', '.ai-card', '.ai-card-inner', '.ai-card-back', '.ai-card-btn'],
  ];

  for (const [path, cardSel, innerSel, backSel, btnSel] of pages) {
    await client.send('Page.navigate', { url: BASE + path });
    await sleep(1200);
    console.log(`\n=== ${path} ===`);
    console.log('trước click:', JSON.stringify(await evaluate(client, probe(cardSel, innerSel, backSel))));

    // click vào thẻ
    await evaluate(client, `document.querySelector('${cardSel}')?.click()`);
    await sleep(800);
    console.log('sau click thẻ:', JSON.stringify(await evaluate(client, probe(cardSel, innerSel, backSel))));

    // click nút Lật (nếu có)
    const btnClicked = await evaluate(
      client,
      `(() => { const b = Array.from(document.querySelectorAll('${btnSel}')).find(el => el.textContent.includes('Lật')); if (!b) return 'KHONG_THAY'; b.click(); return 'DA_CLICK'; })()`,
    );
    await sleep(800);
    console.log(`sau click nút Lật (${btnClicked}):`, JSON.stringify(await evaluate(client, probe(cardSel, innerSel, backSel))));
  }

  client.close();
} catch (err) {
  console.error('LỖI:', err.message);
  process.exitCode = 2;
} finally {
  chrome.kill();
}
