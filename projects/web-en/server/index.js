const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const { ROOT, VUE_DIST_DIR, PORT, API_PATHS, AI_CONFIG, MIME_TYPES, AGENTS, AGENT_INFO } = require('./config');
const { callAI, callAIStream, buildSystemForBundle } = require('./ai-service');

// App cá nhân chạy loopback — không auth, chỉ giới hạn tần suất và kích thước body
const MAX_BODY_BYTES = 1024 * 1024;

// Hub legacy lệch quy ước "file → route" khi chuyển sang Vue (xem handler 301 /pages/)
const VUE_LEGACY_HUB_ROUTES = Object.freeze({
  'ai/hub': '/ai',
  'cloud/hub': '/cloud',
  'devops/hub': '/devops',
});
const RATE_LIMIT = { windowMs: 60_000, maxPerIp: 60 };
const requestLog = new Map(); // ip -> { count, windowStart }

function isRateLimited(ip) {
  const now = Date.now();
  const rec = requestLog.get(ip);
  if (!rec || now - rec.windowStart > RATE_LIMIT.windowMs) {
    requestLog.set(ip, { count: 1, windowStart: now });
    return false;
  }
  rec.count += 1;
  if (requestLog.size > 1000) {
    for (const [key, val] of requestLog) {
      if (now - val.windowStart > RATE_LIMIT.windowMs) requestLog.delete(key);
    }
  }
  return rec.count > RATE_LIMIT.maxPerIp;
}

function readJsonBody(req, res, onOk) {
  let body = '';
  let aborted = false;
  req.on('data', chunk => {
    if (aborted) return;
    body += chunk;
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
      aborted = true;
      res.writeHead(413, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Request body too large' }));
      req.pause();
    }
  });
  req.on('end', () => {
    if (aborted) return;
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      return;
    }
    onOk(parsed);
  });
}

// Ghi JSON một lần duy nhất: nếu response đã gửi (client ngắt, hoặc lỗi sau khi gửi) thì bỏ qua
// thay vì ném ERR_HTTP_HEADERS_SENT làm sập cả tiến trình.
function sendJson(res, status, payload) {
  if (res.headersSent || res.writableEnded) return;
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function sseWrite(res, payload) {
  if (res.writableEnded || res.destroyed) return false;
  res.write(payload);
  return true;
}

function sseEnd(res) {
  if (res.writableEnded) return;
  res.end();
}

// AI trả về JSON hỏng là chuyện thường — parse hỏng phải trả null, không được ném lỗi.
function parseJsonArraySafe(text) {
  const match = String(text).match(/\[[\s\S]*\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

function parseJsonObjectSafe(text) {
  const match = String(text).match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

// Read .env file at startup
const envPath = path.join(ROOT, '.env');
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

/** POST /api/salary-interview — Salary-based question generator */
function handleSalaryInterview(req, res) {
  readJsonBody(req, res, (body) => {
    const { salary, customRequest } = body;
    const apiKey = process.env.OPENAI_API_KEY;

    const systemPrompt = `Bạn là senior Java backend interviewer. Dựa trên mức lương ${salary} triệu/tháng, hãy tạo câu hỏi phỏng vấn phù hợp.

QUY TẮC:
- ${salary < 20 ? 'Junior: hỏi core Java, OOP, SQL, Git, data structures cơ bản' : ''}
- ${salary >= 20 && salary < 40 ? 'Middle: Spring Boot, JPA, REST, Multithreading, Transaction, Security' : ''}
- ${salary >= 40 && salary < 70 ? 'Senior: Microservices, Docker, Kafka, Design Patterns, Cloud, Performance' : ''}
- ${salary >= 70 ? 'Architect: System Design, Distributed Systems, CAP, CQRS, Event Sourcing, Leadership' : ''}

Trả về JSON array, mỗi item có: { "id": "q1", "topic": "chủ đề", "question": "câu hỏi", "sampleAnswer": "gợi ý trả lời" }
Tạo 5-8 câu hỏi, focus vào mức lương ${salary}tr.`;

    const userMsg = customRequest
      ? `Yêu cầu đặc biệt: ${customRequest}. Hãy tạo câu hỏi phù hợp cho mức lương ${salary} triệu.`
      : `Tạo câu hỏi phỏng vấn Java cho mức lương ${salary} triệu/tháng.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMsg }
    ];

    callAI(messages, apiKey, 1500).then(reply => {
      const questions = parseJsonArraySafe(reply);
      if (questions) {
        sendJson(res, 200, { questions, fromAI: true });
        return;
      }
      // Fallback: parse từng dòng câu hỏi, id duy nhất theo số dòng
      const parsed = [];
      const lines = reply.split('\n');
      lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes('câu hỏi') && trimmed.length > 20) {
          parsed.push({ id: `q-fallback-${idx + 1}`, topic: 'General', question: trimmed.replace(/^\d+[\.\)]\s*/, ''), sampleAnswer: '—' });
        }
      });
      sendJson(res, 200, { questions: parsed, fromAI: true, note: 'fallback parse' });
    }).catch(err => {
      sendJson(res, 502, { error: err.message });
    });
  });
}

/** POST /api/accelerator/stream-feedback — SSE streaming AI feedback for Accelerator typing */
function handleAcceleratorStream(req, res) {
  readJsonBody(req, res, (body) => {
    const { text, day } = body;
    const apiKey = process.env.OPENAI_API_KEY;

    const systemPrompt = `Bạn là senior software engineer mentor. Phân tích câu trả lời của học viên và đưa feedback real-time.
Phân tích: (1) technical accuracy, (2) English grammar/vocabulary, (3) độ sâu và specific numbers.
Trả lời ngắn gọn, focus vào 1-2 points quan trọng nhất. Dùng markdown đơn giản.`;

    const userMsg = `Học viên đang học Day ${day}. Câu trả lời:\n\n${text}\n\nFeedback ngắn gọn:`;

    const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMsg }];

    // Set headers for SSE / streaming
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    if (apiKey) {
      // Use OpenAI streaming
      callAIStream(messages, apiKey, (chunk) => {
        const escaped = chunk.replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        sseWrite(res, `data: ${escaped}\n\n`);
      }).then(() => {
        sseWrite(res, 'data: [DONE]\n\n');
        sseEnd(res);
      }).catch(err => {
        sseWrite(res, `data: [ERROR] ${err.message}\n\n`);
        sseEnd(res);
      });
    } else {
      // Fallback: use Ollama non-streaming + simulate chunks
      callAI(messages, apiKey, 300).then(reply => {
        // Send as simulated chunks
        const words = reply.split(' ');
        let i = 0;
        const interval = setInterval(() => {
          if (i >= words.length) {
            clearInterval(interval);
            sseWrite(res, 'data: [DONE]\n\n');
            sseEnd(res);
            return;
          }
          if (!sseWrite(res, `data: ${words[i]} \n\n`)) {
            clearInterval(interval);
            return;
          }
          i++;
        }, 40);
      }).catch(err => {
        sseWrite(res, `data: [ERROR] ${err.message}\n\n`);
        sseEnd(res);
      });
    }
  });
}

// ---- Route Handlers ----

/** POST /api/ai-feedback — Interview answer evaluation */
function handleAiFeedback(req, res) {
  readJsonBody(req, res, (body) => {
    const { question, answer, topic } = body;
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

    callAI(messages, apiKey, 800).then(reply => {
      const parsed = parseJsonObjectSafe(reply);
      if (parsed) {
        sendJson(res, 200, parsed);
        return;
      }
      sendJson(res, 200, { score: 5, feedback: reply, suggestions: [] });
    }).catch(err => {
      sendJson(res, 502, { error: err.message });
    });
  });
}

/** POST /api/ai-chat — Chat mode with AI */
function handleAiChat(req, res) {
  readJsonBody(req, res, (body) => {
    const { messages: conversation, topic, bundleSlug } = body;
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing messages array' }));
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const systemMsg = buildSystemForBundle(bundleSlug, topic);
    const messages = [systemMsg, ...conversation];

    callAI(messages, apiKey).then(reply => {
      sendJson(res, 200, { reply });
    }).catch(err => {
      sendJson(res, 502, { error: err.message });
    });
  });
}

/** POST /api/bmad/chat — BMAD multi-agent chat */
function handleBmadChat(req, res) {
  readJsonBody(req, res, (body) => {
    const { agentIds, messages, userMessage, bundleSlug, topic, conversation } = body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (bundleSlug) {
      const convo = Array.isArray(conversation) ? conversation : [];
      if (convo.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing conversation for bundleSlug request' }));
        return;
      }

      const systemMsg = buildSystemForBundle(bundleSlug, topic);
      const msgs = [systemMsg, ...convo];

      return callAI(msgs, apiKey).then(reply => {
        sendJson(res, 200, { replies: [{ agentId: bundleSlug, name: 'BMad', icon: '🤖', text: reply }] });
      }).catch(err => {
        sendJson(res, 502, { error: err.message });
      });
    }

    if (!agentIds || !Array.isArray(agentIds) || agentIds.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing agentIds array' }));
      return;
    }

    const calls = agentIds.map(agentId => {
      const systemPrompt = AGENTS[agentId];
      if (!systemPrompt) return Promise.reject(new Error(`Unknown agent: ${agentId}`));

      const history = (messages && messages[agentId]) || [];
      const msgs = [
        { role: 'system', content: systemPrompt },
        ...history,
      ];

      if (userMessage) {
        msgs.push({ role: 'user', content: userMessage });
      }

      return callAI(msgs, apiKey).then(reply => ({
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
  });
}

// ---- Static File Server ----

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Endpoint AI tốn token — chặn spam dù server chỉ nghe loopback
  if (req.method === 'POST' && urlPath.startsWith('/api/')) {
    const ip = req.socket.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
      sendJson(res, 429, { error: 'Too many requests' });
      return;
    }
  }

  if (req.method === 'POST' && urlPath === API_PATHS.AI_FEEDBACK) return handleAiFeedback(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.AI_CHAT) return handleAiChat(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.BMAD_CHAT) return handleBmadChat(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.SALARY_INTERVIEW) return handleSalaryInterview(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.ACCELERATOR_STREAM) return handleAcceleratorStream(req, res);

  // Cutover: URL legacy /pages/<trang>.html → 301 sang route Vue (không phục vụ MPA cũ nữa).
  // Chỉ 3 trang hub lệch quy ước "X.html ↔ /X"; giữ đồng bộ với web-app/src/utils/legacy-redirect.js
  if (req.method === 'GET' && urlPath.startsWith('/pages/') && urlPath.endsWith('.html')) {
    const rel = urlPath.slice('/pages/'.length, -'.html'.length);
    const queryIndex = req.url.indexOf('?');
    const query = queryIndex >= 0 ? req.url.slice(queryIndex) : '';
    const target = (VUE_LEGACY_HUB_ROUTES[rel] || '/' + rel) + query;
    res.writeHead(301, { 'Location': target });
    res.end();
    return;
  }

  // Vue là app chính: root + asset build phục vụ từ dist (cùng origin, story 2-4 Option A)
  const isVueRoot = urlPath === '/' || urlPath === '/index.html';
  const serveFromDist = isVueRoot || urlPath.startsWith('/assets/');
  const readRoot = serveFromDist ? VUE_DIST_DIR : ROOT;
  const rawFileName = urlPath === '/' ? 'index.html' : urlPath;
  const filePath = path.join(readRoot, rawFileName);
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(readRoot))) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
    return;
  }
  // Reject dotfiles and dot-segments (e.g., /.env, /../README.md)
  const baseName = path.basename(rawFileName);
  if (baseName.startsWith('.') || rawFileName.includes('..')) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // Refuse unknown extensions to avoid octet-stream leakage
  if (ext && !MIME_TYPES[ext]) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>404</h1>');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA fallback: route Vue (history mode) không phải file legacy → trả index.html của Vue
        const wantsHtml = (req.headers.accept || '').includes('text/html');
        if (!serveFromDist && wantsHtml) {
          fs.readFile(path.join(VUE_DIST_DIR, 'index.html'), (e2, indexData) => {
            if (e2) {
              res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
              res.end('<h1>404 - Không tìm thấy</h1>');
              return;
            }
            res.writeHead(200, {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            });
            res.end(indexData);
          });
          return;
        }
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
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  });
});

// HOST mặc định chỉ loopback (an toàn local); production đặt HOST=0.0.0.0 (VD: Render)
const HOST = process.env.HOST || '127.0.0.1';

// Một request lỗi (AI trả JSON hỏng, client ngắt giữa chừng) không được phép hạ cả web.
process.on('unhandledRejection', (err) => {
  console.error('[unhandledRejection]', err && err.message ? err.message : err);
});

process.on('uncaughtException', (err) => {
  console.error('[uncaughtException]', err && err.message ? err.message : err);
});

server.listen(PORT, HOST, () => {
  console.log(`✓ SkillForge server running at http://${HOST}:${PORT}`);
  console.log(`  Root: ${ROOT}`);
});
