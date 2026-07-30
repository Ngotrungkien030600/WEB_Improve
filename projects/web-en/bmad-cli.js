/**
 * BMAD CLI — chat với AI agents ngay trong terminal
 * Chạy: node bmad-cli.js
 */
const http = require('http');
const readline = require('readline');

const API_ENDPOINT = 'http://localhost:8080/api/bmad/chat';

const AGENTS = [
  { id: 'mary', name: 'Mary', icon: '📊', title: 'Business Analyst' },
  { id: 'paige', name: 'Paige', icon: '📚', title: 'Technical Writer' },
  { id: 'john', name: 'John', icon: '📋', title: 'Product Manager' },
  { id: 'sally', name: 'Sally', icon: '🎨', title: 'UX Designer' },
  { id: 'winston', name: 'Winston', icon: '🏗️', title: 'System Architect' },
  { id: 'amelia', name: 'Amelia', icon: '💻', title: 'Senior Engineer' },
  { id: 'quinn', name: 'Quinn', icon: '🧪', title: 'QA Engineer' },
];

let mode = ''; // 'solo' | 'party'
let selectedAgents = [];
let conversations = {};
AGENTS.forEach(a => { conversations[a.id] = []; });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '',
});

function prompt(q) {
  return new Promise(resolve => rl.question(q, resolve));
}

async function listAgents(label, withIndex = true) {
  console.log(`\n${label}:`);
  AGENTS.forEach((a, i) => {
    console.log(`  ${withIndex ? `${i + 1}. ` : ''}${a.icon} ${a.name} — ${a.title}`);
  });
}

async function showMenu() {
  console.clear();
  console.log('╔══════════════════════════════════════╗');
  console.log('║     🤖 BMAD Agent CLI Chat           ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('\nChọn chế độ:');
  console.log('  1. 🧑‍💻 Solo — chat 1-1 với 1 agent');
  console.log('  2. 🎉 Party — cả nhóm thảo luận');
  console.log('  0. Thoát');
  console.log();

  const choice = await prompt('Chọn (1/2/0): ');
  if (choice === '0') { rl.close(); return; }

  if (choice === '1') {
    mode = 'solo';
    await listAgents('Chọn agent');
    const idx = parseInt(await prompt('Số thứ tự: '), 10) - 1;
    if (idx >= 0 && idx < AGENTS.length) {
      selectedAgents = [AGENTS[idx].id];
      await startChat();
    } else {
      console.log('Số không hợp lệ!');
      await showMenu();
    }
  } else if (choice === '2') {
    mode = 'party';
    await listAgents('Chọn agent tham gia (nhập số cách nhau bằng dấu phẩy, VD: 1,2,3)');
    const input = await prompt('Số thứ tự: ');
    const indices = input.split(',').map(s => parseInt(s.trim(), 10) - 1).filter(i => i >= 0 && i < AGENTS.length);
    if (indices.length >= 2) {
      selectedAgents = indices.map(i => AGENTS[i].id);
      await startChat();
    } else {
      console.log('Cần chọn ít nhất 2 agent!');
      await showMenu();
    }
  } else {
    await showMenu();
  }
}

function escHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function stripMd(text) {
  return text
    .replace(/```(\w*)\n([\s\S]*?)```/g, '\n$2\n')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

function callAPI(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 8080,
      path: '/api/bmad/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch (e) { reject(new Error('Parse response failed')); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function startChat() {
  console.clear();
  const names = selectedAgents.map(id => {
    const a = AGENTS.find(x => x.id === id);
    return a ? `${a.icon} ${a.name}` : id;
  }).join(', ');
  console.log(`╔═══ BMAD Chat ${mode === 'party' ? '🎉 Party' : '🧑‍💻 Solo'} ═══╗`);
  console.log(`  ${names}`);
  console.log(`╚${'═'.repeat(40)}╝`);
  console.log('  Gõ /menu để quay lại, /clear để xóa, /exit để thoát\n');

  await chatLoop();
}

async function chatLoop() {
  while (true) {
    const text = await prompt('\n💬 Bạn: ');
    const trimmed = text.trim();

    if (trimmed === '/exit') { rl.close(); return; }
    if (trimmed === '/menu') { await showMenu(); return; }
    if (trimmed === '/clear') {
      console.clear();
      AGENTS.forEach(a => { conversations[a.id] = []; });
      console.log('🗑️ Đã xóa lịch sử.\n');
      continue;
    }
    if (!trimmed) continue;

    console.log('⏳ Đang đợi AI trả lời...\n');

    try {
      if (mode === 'solo') {
        const agentId = selectedAgents[0];
        conversations[agentId].push({ role: 'user', content: trimmed });
        const resp = await callAPI({
          agentIds: [agentId],
          messages: { [agentId]: conversations[agentId] },
        });

        if (resp.replies && resp.replies[0]) {
          const reply = resp.replies[0];
          const a = AGENTS.find(x => x.id === reply.agentId);
          console.log(`\n${a ? a.icon : '🤖'} ${reply.name}:`);
          console.log(`  ${stripMd(reply.text)}`);
          conversations[agentId].push({ role: 'assistant', content: reply.text });
        } else if (resp.error) {
          console.log(`❌ ${resp.error}`);
        }
      } else {
        selectedAgents.forEach(id => {
          conversations[id].push({ role: 'user', content: trimmed });
        });

        const resp = await callAPI({
          agentIds: selectedAgents,
          messages: selectedAgents.reduce((acc, id) => {
            acc[id] = conversations[id];
            return acc;
          }, {}),
          userMessage: trimmed,
        });

        if (resp.replies) {
          console.log(`🎉 Vòng ${Math.floor(conversations[selectedAgents[0]].filter(m => m.role === 'user').length)}:\n`);
          resp.replies.forEach(reply => {
            const a = AGENTS.find(x => x.id === reply.agentId);
            console.log(`  ${reply.icon} ${reply.name}:`);
            console.log(`    ${stripMd(reply.text)}\n`);
            conversations[reply.agentId].push({ role: 'assistant', content: reply.text });
          });
        }
        if (resp.errors) {
          resp.errors.forEach(e => console.log(`❌ ${e.agentId}: ${e.error}`));
        }
      }
    } catch (e) {
      console.log(`❌ Lỗi kết nối: ${e.message}`);
    }
  }
}

// ---- Main ----
const args = process.argv.slice(2);

if (args.length > 0) {
  // One-shot: node bmad-cli.js "câu hỏi"
  //   Nếu thêm --all: gửi cho tất cả 6 agent (party)
  //   Nếu thêm id: gửi cho agent đó (solo)
  //   Mặc định: gửi cho tất cả (party)
  const question = args[0];
  const option = args[1];
  let agentIds;
  if (option === '--all' || !option) {
    agentIds = AGENTS.map(a => a.id); // party: tất cả
  } else {
    const found = AGENTS.find(a => a.id === option);
    agentIds = found ? [found.id] : [option];
  }

  (async () => {
    const data = JSON.stringify({
      agentIds,
      messages: agentIds.reduce((acc, id) => { acc[id] = [{ role: 'user', content: question }]; return acc; }, {}),
      userMessage: question,
    });

    const options = {
      hostname: 'localhost', port: 8080, path: '/api/bmad/chat', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };

    const req = http.request(options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.replies) {
            parsed.replies.forEach(r => {
              console.log(`\n${r.icon} ${r.name}:`);
              console.log(`  ${stripMd(r.text)}`);
            });
          }
          if (parsed.errors) parsed.errors.forEach(e => console.log(`❌ ${e.error}`));
        } catch (e) {
          console.log('❌ Parse lỗi:', e.message);
        }
      });
    });
    req.on('error', () => console.log('❌ Server chưa chạy!'));
    req.write(data);
    req.end();
  })();

} else {
  // Interactive mode
  http.get('http://localhost:8080', () => {
    showMenu();
  }).on('error', () => {
    console.log('❌ Server chưa chạy! Hãy chạy "node server/index.js" trước.');
  });
}
