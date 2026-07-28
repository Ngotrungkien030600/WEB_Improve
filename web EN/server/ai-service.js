const http = require('http');
const https = require('https');
const fs = require('fs');
const { AI_CONFIG, AGENTS, BUNDLE_METADATA_PATH } = require('./config');

// Load BMAD web-bundles metadata
let bmadBundles = [];
try {
  const raw = fs.readFileSync(BUNDLE_METADATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  bmadBundles = parsed.bundles || [];
} catch (e) {
  bmadBundles = [];
}

function buildSystemForBundle(slug, topic) {
  const bundle = bmadBundles.find(b => b.slug === slug);
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

function callAI(messages, apiKey, maxTokens = AI_CONFIG.DEFAULT_MAX_TOKENS) {
  return new Promise((resolve, reject) => {
    const geminiKey = process.env.GEMINI_API_KEY;
    const useGemini = !!geminiKey;
    const useOllama = !apiKey && !geminiKey;
    const model = useOllama
      ? (process.env.OLLAMA_MODEL || AI_CONFIG.DEFAULT_OLLAMA_MODEL)
      : AI_CONFIG.DEFAULT_OPENAI_MODEL;

    if (useGemini) {
      const contents = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      const postData = JSON.stringify({ contents });
      const options = {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/${AI_CONFIG.GEMINI_MODEL}:generateContent?key=${geminiKey}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      const apiReq = https.request(options, (apiRes) => {
        let data = '';
        apiRes.on('data', chunk => data += chunk);
        apiRes.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              reject(new Error(parsed.error.message || JSON.stringify(parsed.error)));
              return;
            }
            const reply = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            resolve(reply);
          } catch (e) {
            reject(new Error('Failed to parse Gemini response'));
          }
        });
      });
      apiReq.on('error', reject);
      apiReq.write(postData);
      apiReq.end();
      return;
    }

    const postData = JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: AI_CONFIG.TEMPERATURE,
      stream: false,
    });

    const options = useOllama
      ? {
          hostname: AI_CONFIG.OLLAMA_HOST,
          port: AI_CONFIG.OLLAMA_PORT,
          path: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        }
      : {
          hostname: AI_CONFIG.OPENAI_HOST,
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

module.exports = { callAI, buildSystemForBundle };
