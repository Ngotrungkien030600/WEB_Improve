const http = require('http');
const fs = require('fs');

const bugReport = `🧪 **BUG REPORT — SkillForge UI Audit**
===============================
Sếp yêu cầu: tìm và fix 10 bug UI. Danh sách chi tiết:

---

**BUG 1** 🔴 **Hero stats sai số**
- File: index.html dòng 77
- Actual: '6 AI Agents' (cũ, trước khi thêm Quinn)
- Expected: '7 AI Agents'
- Fix: đổi '6' thành '7'

**BUG 2** 🔴 **BMAD page title sai số**
- File: pages/bmad-agents.html dòng 73
- Actual: '6 trợ lý AI'
- Expected: '7 trợ lý AI'
- Fix: đổi 6 thành 7

**BUG 3** 🟡 **CSS conflict display trong .bmad-party-start**
- File: css/agents/bmad-chat.css dòng 109-121
- Actual: .bmad-party-start { display:none; ... display:flex } — dòng 113 override
- Expected: chỉ hiện nút khi có class .visible
- Fix: bỏ dòng 'display: flex' thừa

**BUG 4** 🟡 **CSS variable undefined: --surface-chat**
- File: css/agents/bmad-chat.css dòng 210
- Actual: dùng var(--surface-chat) không được define
- Fix: đổi thành var(--surface2) hoặc define nó

**BUG 5** 🟡 **BMAD agent-grid class sai**
- File: pages/bmad-agents.html dòng 78
- Actual: class="agent-grid" (thiếu bmad- prefix)
- Expected: class="bmad-agent-grid"
- Fix: sửa class

**BUG 6** 🟡 **components.css story-subtitle màu sai**
- File: css/components.css dòng 568-572
- Actual: color: var(--surface-card) — surface-card là trắng
- Expected: white hoặc text-primary-dark
- Fix: đổi màu

**BUG 7** 🟡 **base.css gradient body xung đột dark theme**
- File: css/base.css dòng 17
- Actual: background: var(--color-gradient) (tím sáng)
- Expected: dark bg mặc định
- Fix: chuyển base.css sang dark

**BUG 8** 🟡 **Container max-width không đồng nhất**
- File: base.css (1200px) vs home.css (1240px)
- Fix: đồng bộ về 1240px

**BUG 9** 🟡 **Thiếu dark mode mặc định cho feature pages**
- File: variables.css
- Actual: light theme mặc định
- Expected: dark theme xuyên suốt
- Fix: chuyển variables sang dark

**BUG 10** 🟡 **Timer JS thiếu null check**
- File: js/utils/timer.js
- Actual: không có DOM vẫn querySelector gây console error
- Fix: thêm null check

---

Sếp yêu cầu: TẤT CẢ agents họp Party Mode. Mỗi người phân tích bug liên quan tới mình và đề xuất fix. Amelia + Winston code fix. Quinn review verify trước khi merge.`;

const msg = bugReport + '\n\nSếp yêu cầu: Mary phân tích business impact, Paige ghi docs, John ưu tiên bugs, Sally UI bugs, Winston + Amelia code fix, Quinn verify. Ai có ý kiến gì?';

const data = JSON.stringify({
  agentIds: ['mary','paige','john','sally','winston','amelia','quinn'],
  messages: {},
  userMessage: msg
});

const opts = {
  hostname: 'localhost', port: 8080, path: '/api/bmad/chat', method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
};

console.log('Gửi bug report cho BMAD team...');
const req = http.request(opts, res => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    try {
      const p = JSON.parse(b);
      if (p.replies) {
        let output = '=== BMAD TEAM RESPONSE ===\n\n';
        p.replies.forEach(r => {
          const icon = {mary:'📊',paige:'📚',john:'📋',sally:'🎨',winston:'🏗️',amelia:'💻',quinn:'🧪'}[r.agentId] || '🤖';
          output += `${icon} ${r.name}:\n${r.text}\n\n---\n\n`;
        });
        fs.writeFileSync('bmad-fix-responses.txt', output, 'utf8');
        console.log(`✅ Đã nhận ${p.replies.length} phản hồi từ BMAD team!`);
        console.log(`Lưu tại: bmad-fix-responses.txt`);
        p.replies.forEach(r => {
          const first = r.text.split('\n')[0].substring(0, 90);
          console.log(`  ${r.icon} ${r.name}: ${first}...`);
        });
      } else console.log('❌ ERR:', p.error);
    } catch(e) { console.log('❌ Parse lỗi:', e.message); }
  });
});
req.on('error', () => console.log('❌ Server chưa chạy!'));
req.write(data);
req.end();
