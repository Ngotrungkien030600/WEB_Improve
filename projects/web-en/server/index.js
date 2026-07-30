const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const { ROOT, PORT, API_PATHS, AI_CONFIG, MIME_TYPES, AGENTS, AGENT_INFO } = require('./config');
const { callAI, callAIStream, buildSystemForBundle } = require('./ai-service');

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
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { salary, topic, customRequest } = JSON.parse(body);
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
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ questions: JSON.parse(jsonMatch[0]), fromAI: true }));
        } else {
          // Fallback: parse từng dòng câu hỏi
          const parsed = [];
          const lines = reply.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            const qMatch = trimmed.match(/[?"'](.+?)[?"']/);
            if (trimmed.toLowerCase().includes('câu hỏi') && trimmed.length > 20) {
              parsed.push({ id: 'q-fallback', topic: 'General', question: trimmed.replace(/^\d+[\.\)]\s*/, ''), sampleAnswer: '—' });
            }
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ questions: parsed, fromAI: true, note: 'fallback parse' }));
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

/** POST /api/accelerator/stream-feedback — SSE streaming AI feedback for Accelerator typing */
function handleAcceleratorStream(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { text, day } = JSON.parse(body);
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
          res.write(`data: ${escaped}\n\n`);
        }).then(() => {
          res.write('data: [DONE]\n\n');
          res.end();
        }).catch(err => {
          res.write(`data: [ERROR] ${err.message}\n\n`);
          res.end();
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
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            res.write(`data: ${words[i]} \n\n`);
            i++;
          }, 40);
        }).catch(err => {
          res.write(`data: [ERROR] ${err.message}\n\n`);
          res.end();
        });
      }
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

// ---- Route Handlers ----

/** POST /api/ai-feedback — Interview answer evaluation */
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

      callAI(messages, apiKey, 800).then(reply => {
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

/** POST /api/ai-chat — Chat mode with AI */
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
      const systemMsg = buildSystemForBundle(bundleSlug, topic);
      const messages = [systemMsg, ...conversation];

      callAI(messages, apiKey).then(reply => {
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

/** POST /api/bmad/chat — BMAD multi-agent chat */
function handleBmadChat(req, res) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const { agentIds, messages, userMessage, bundleSlug, topic, conversation } = JSON.parse(body);
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
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ replies: [{ agentId: bundleSlug, name: 'BMad', icon: '🤖', text: reply }] }));
        }).catch(err => {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
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
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

// ---- Static File Server ----

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (req.method === 'POST' && urlPath === API_PATHS.AI_FEEDBACK) return handleAiFeedback(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.AI_CHAT) return handleAiChat(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.BMAD_CHAT) return handleBmadChat(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.SALARY_INTERVIEW) return handleSalaryInterview(req, res);
  if (req.method === 'POST' && urlPath === API_PATHS.ACCELERATOR_STREAM) return handleAcceleratorStream(req, res);

  let filePath = path.join(ROOT, urlPath === '/' ? 'index.html' : urlPath);
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
  console.log(`✓ SkillForge server running at http://localhost:${PORT}`);
  console.log(`  Root: ${ROOT}`);
});
