const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env file if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

// BMAD Agent system prompts (id → prompt lookup)
const AGENTS = {
  mary: `Bạn là Mary, Chuyên viên Phân tích Kinh doanh. Bạn kết hợp sự chặt chẽ chiến lược của Michael Porter và kỷ luật Tháp Minto. Mọi phát hiện đều phải dựa trên bằng chứng xác thực. Phong cách: hào hứng như người săn kho báu khi phát hiện patterns, có cấu trúc như bản ghi nhớ McKinsey.

Nguyên tắc:
1. Mọi phát hiện phải có bằng chứng kiểm chứng
2. Yêu cầu phải chính xác tuyệt đối
3. Mọi tiếng nói stakeholder đều được đại diện

Trả lời bằng tiếng Việt, sử dụng icon 📊 ở đầu mỗi tin nhắn.`,
  paige: `Bạn là Paige, Chuyên viên Viết Tài liệu Kỹ thuật. Bạn biến những khái niệm phức tạp thành tài liệu có cấu trúc dễ tiếp cận. Phong cách: như người thầy kiên nhẫn, dùng analogies để làm phức tạp trở nên đơn giản.

Nguyên tắc:
1. Mỗi từ phải xứng đáng với vị trí của nó
2. Ưu tiên sơ đồ hơn tường văn bản
3. Viết cho người đọc, dùng ví dụ và analogies

Trả lời bằng tiếng Việt, sử dụng icon 📚 ở đầu mỗi tin nhắn.`,
  john: `Bạn là John, Quản lý Sản phẩm. Bạn áp dụng Jobs-to-be-Done, đặt giá trị người dùng lên đầu. Phong cách: như thám tử — câu hỏi ngắn, đào sâu, mỗi "tại sao" đều thắt chặt lưới.

Nguyên tắc:
1. Jobs-to-be-Done over template filling
2. User value first, technical feasibility là constraint
3. Mọi tính năng phải gắn với nhu cầu người dùng thật

Trả lời bằng tiếng Việt, sử dụng icon 📋 ở đầu mỗi tin nhắn.`,
  sally: `Bạn là Sally, Nhà Thiết kế UX. Bạn cân bằng empathy với edge-case rigor, mọi quyết định phục vụ nhu cầu người dùng thực sự. Phong cách: như nhà làm phim pitching cảnh quay trước khi code tồn tại.

Nguyên tắc:
1. Mọi quyết định design phải phục vụ nhu cầu người dùng thật
2. Bắt đầu đơn giản, tiến hóa qua phản hồi
3. Surface closure: mọi nhu cầu đều có surface, mọi surface đều có journey

Trả lời bằng tiếng Việt, sử dụng icon 🎨 ở đầu mỗi tin nhắn.`,
  winston: `Bạn là Winston, Kiến trúc sư Hệ thống. Bạn ưu tiên công nghệ ổn định, năng suất lập trình viên là kiến trúc. Phong cách: như kỹ sư kỳ cựu bên bảng trắng — điềm tĩnh, đưa ra trade-offs thay vì phán quyết.

Nguyên tắc:
1. Công nghệ nhàm chán cho sự ổn định
2. Năng suất lập trình viên là kiến trúc
3. Mọi quyết định kiến trúc phải gắn với giá trị kinh doanh

Trả lời bằng tiếng Việt, sử dụng icon 🏗️ ở đầu mỗi tin nhắn.`,
  amelia: `Bạn là Amelia, Kỹ sư Phần mềm Cao cấp. Bạn áp dụng test-first discipline (red, green, refactor), 100% pass trước review. Phong cách: như terminal prompt — chính xác, ngắn gọn, không hoa mỹ.

Nguyên tắc:
1. Test-first: red, green, refactor
2. 100% tests pass trước khi review
3. Mọi câu lệnh đều có thể trích dẫn — đường dẫn file, AC IDs

Trả lời bằng tiếng Việt, sử dụng icon 💻 ở đầu mỗi tin nhắn.`,
};

// Load BMAD web-bundles metadata (used to build bundle-specific system prompts)
let bmadBundles = [];
try {
  const bundlesPath = path.join(__dirname, 'data', 'bmad-bundles.json');
  const raw = fs.readFileSync(bundlesPath, 'utf8');
  const parsed = JSON.parse(raw);
  bmadBundles = parsed.bundles || [];
} catch (e) {
  // ignore if file missing; fall back to empty
  bmadBundles = [];
}

function buildSystemForBundle(slug, topic) {
  const bundle = (bmadBundles || []).find(b => b.slug === slug);
  if (!bundle) {
    return {
      role: 'system',
      content: `Bạn là trợ lý AI chuyên về ${topic || 'phân tích nghiệp vụ'}. Trả lời bằng tiếng Việt, rõ ràng và có các bước hành động cụ thể.`
    };
  }

  const persona = bundle.defaultPersona?.title || bundle.defaultPersona?.name || 'BMad Assistant';
  const instructions = [
    `Bạn là ${persona}.`,
    `Mục tiêu: ${bundle.tagline || 'Hỗ trợ phân tích nghiệp vụ.'}`,
    'Khi trả lời, cung cấp: (1) tóm tắt ngắn, (2) phân tích chi tiết theo bước, (3) đề xuất hành động, (4) các câu hỏi cần làm rõ.',
    `Bundle: ${bundle.slug}.`
  ];
  if (bundle.needsDeepResearch) instructions.push('Nếu cần, hỏi user để xác định phạm vi nghiên cứu trước khi đưa kết luận.');

  return { role: 'system', content: instructions.join(' ') };
}

// Shared helper: call AI and return the reply text
// Supports OpenAI (when OPENAI_API_KEY is set) or Ollama (local, no key needed)
function callOpenAI(messages, apiKey, maxTokens = 1000) {
  return new Promise((resolve, reject) => {
    const useOllama = !apiKey;
    const model = useOllama ? (process.env.OLLAMA_MODEL || 'qwen2.5:7b') : 'gpt-4o-mini';

    const postData = JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false,
    });

    const options = useOllama
      ? {
          hostname: '127.0.0.1',
          port: 11434,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        }
      : {
          hostname: 'api.openai.com',
          port: 443,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Content-Length': Buffer.byteLength(postData),
          },
        };

    const mod = useOllama ? http : https;
    const apiReq = mod.request(options, (apiRes) => {
      let data = '';
      apiRes.on('data', chunk => data += chunk);
      apiRes.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
            return;
          }
          const reply = parsed.choices?.[0]?.message?.content || '';
          resolve(reply);
        } catch (e) {
          reject(new Error('Failed to parse AI response'));
        }
      });
    });

    apiReq.on('error', (err) => {
      if (useOllama) {
        reject(new Error('Không thể kết nối Ollama. Hãy chạy "ollama run qwen2.5:7b" trước.'));
      } else {
        reject(err);
      }
    });
    apiReq.write(postData);
    apiReq.end();
  });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.md': 'text/markdown'
};

/**
 * POST /api/ai-feedback — Proxy to OpenAI for interview answer evaluation.
 * Expects JSON body: { question, answer, topic }
 * Returns JSON: { score, feedback, suggestions }
 */
function handleAiFeedback(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { question, answer, topic } = JSON.parse(body);
      if (!question || !answer) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing question or answer' }));
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;

      const systemPrompt = `Bạn là một senior Java backend interviewer người Việt. Nhiệm vụ: chấm điểm câu trả lời phỏng vấn Java của ứng viên.

Nguyên tắc:
- Thang điểm 1-10 (10 là xuất sắc).
- Đưa ra nhận xét cụ thể, chỉ ra điểm đúng và thiếu sót.
- Gợi ý cải thiện rõ ràng.
- Trả lời bằng tiếng Việt.

Trả về kết quả dạng JSON với format:
{
  "score": <số>,
  "feedback": "<nhận xét chi tiết>",
  "suggestions": ["<gợi ý 1>", "<gợi ý 2>", "<gợi ý 3>"]
}`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Chủ đề: ${topic || 'Java Backend'}\n\nCâu hỏi: ${question}\n\nCâu trả lời của ứng viên:\n${answer}` }
      ];

      callOpenAI(messages, apiKey, 800).then(reply => {
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(jsonMatch[0]);
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ score: 5, feedback: reply, suggestions: [] }));
        }
      }).catch(err => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

/**
 * POST /api/ai-chat — Chat mode with OpenAI (conversation).
 * Expects JSON body: { messages: [{role, content}], topic? }
 * Returns JSON: { reply: "..." }
 */
function handleAiChat(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { messages: conversation, topic, bundleSlug } = JSON.parse(body);
      if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing messages array' }));
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;

      // Build a system message using the selected BMAD bundle when provided
      const systemMsg = buildSystemForBundle(bundleSlug, topic);
      const messages = [systemMsg, ...conversation];

      callOpenAI(messages, apiKey).then(reply => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ reply }));
      }).catch(err => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

/**
 * POST /api/bmad/chat — BMAD multi-agent chat.
 * Expects JSON body: { agentIds, messages: { agentId: [...] }, partyMode, userMessage }
 * Returns JSON: { replies: [{agentId, name, icon, text}] }
 */
function handleBmadChat(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { agentIds, messages, userMessage } = JSON.parse(body);
      if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing agentIds array' }));
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;

      const AGENT_INFO = {
        mary:    { name: 'Mary',    icon: '📊' },
        paige:   { name: 'Paige',   icon: '📚' },
        john:    { name: 'John',    icon: '📋' },
        sally:   { name: 'Sally',   icon: '🎨' },
        winston: { name: 'Winston', icon: '🏗️' },
        amelia:  { name: 'Amelia',  icon: '💻' },
      };

      const calls = agentIds.map(agentId => {
        const systemPrompt = AGENTS[agentId];
        if (!systemPrompt) return Promise.reject(new Error(`Unknown agent: ${agentId}`));

        const history = (messages && messages[agentId]) || [];
        const msgs = [
          { role: 'system', content: systemPrompt },
          ...history,
        ];

        // Add user message if present (for party mode, it's new; solo mode already includes it in history)
        if (userMessage) {
          msgs.push({ role: 'user', content: userMessage });
        }

        return callOpenAI(msgs, apiKey).then(reply => ({
          agentId,
          name: AGENT_INFO[agentId].name,
          icon: AGENT_INFO[agentId].icon,
          text: reply,
        }));
      });

      Promise.allSettled(calls).then(results => {
        const replies = [];
        const errors = [];
        results.forEach(r => {
          if (r.status === 'fulfilled') replies.push(r.value);
          else errors.push({ agentId: 'unknown', error: r.reason?.message || 'Unknown error' });
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const resp = { replies };
        if (errors.length) resp.errors = errors;
        res.end(JSON.stringify(resp));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // API route: AI feedback
  if (req.method === 'POST' && urlPath === '/api/ai-feedback') {
    return handleAiFeedback(req, res);
  }
  // API route: AI chat
  if (req.method === 'POST' && urlPath === '/api/ai-chat') {
    return handleAiChat(req, res);
  }
  // API route: BMAD multi-agent chat
  if (req.method === 'POST' && urlPath === '/api/bmad/chat') {
    return handleBmadChat(req, res);
  }

  const cleanUrl = urlPath;
  let filePath = path.join(ROOT, cleanUrl === '/' ? 'index.html' : cleanUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Không tìm thấy</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 - Lỗi máy chủ</h1>');
      }
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
