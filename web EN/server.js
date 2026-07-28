const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

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
      if (!apiKey) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'OPENAI_API_KEY not configured on server' }));
        return;
      }

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

      const postData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 800,
        temperature: 0.7,
      });

      const options = {
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

      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: parsed.error.message }));
              return;
            }
            const content = parsed.choices?.[0]?.message?.content || '';
            // Try to parse JSON from model response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(jsonMatch[0]);
            } else {
              // Fallback: return raw text
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ score: 5, feedback: content, suggestions: [] }));
            }
          } catch (e) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to parse AI response' }));
          }
        });
      });

      apiReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(postData);
      apiReq.end();
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
      const { messages: conversation, topic } = JSON.parse(body);
      if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Missing messages array' }));
        return;
      }

      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'OPENAI_API_KEY not configured on server' }));
        return;
      }

      const systemMsg = {
        role: 'system',
        content: `Bạn là trợ lý AI tên SkillForge, chuyên hỗ trợ học lập trình Java và tiếng Anh. Bạn trả lời bằng tiếng Việt, thân thiện, chi tiết, có ví dụ code khi cần. Chủ đề hiện tại: ${topic || 'Java Backend'}.`
      };

      const messages = [systemMsg, ...conversation];

      const postData = JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const options = {
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

      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: parsed.error.message }));
              return;
            }
            const reply = parsed.choices?.[0]?.message?.content || '';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ reply }));
          } catch (e) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to parse AI response' }));
          }
        });
      });

      apiReq.on('error', (err) => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });

      apiReq.write(postData);
      apiReq.end();
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON body' }));
    }
  });
}

const server = http.createServer((req, res) => {
  // API route: AI feedback
  if (req.method === 'POST' && req.url === '/api/ai-feedback') {
    return handleAiFeedback(req, res);
  }
  // API route: AI chat
  if (req.method === 'POST' && req.url === '/api/ai-chat') {
    return handleAiChat(req, res);
  }

  let filePath = path.join(ROOT, req.url === '/' ? 'index.html' : req.url);
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
      'Access-Control-Allow-Origin': '*'
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
