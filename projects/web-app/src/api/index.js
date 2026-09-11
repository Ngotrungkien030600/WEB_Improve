/**

import { isLoggedIn } from '../utils/auth-store.js';
import { requireLogin } from '../utils/auth-guard.js';

const LOGIN_REQUIRED = 'Cần đăng nhập để dùng tính năng AI.';

function ensureAiAccess() {
  if (isLoggedIn()) return;
  requireLogin(window.location.pathname, 'ai');
  throw new Error(LOGIN_REQUIRED);
}

/**
 * Send a chat message to the BMAD multi-agent system.
 * @param {string[]} agentIds - Array of agent IDs to include
 * @param {Object} messages - Message history
 * @returns {Promise<Object>} JSON response from API
 */
export async function chat(agentIds, messages) {
  ensureAiAccess();
  const res = await fetch('/api/bmad/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentIds, messages }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(text);
  }
  return res.json();
}

/**
 * Call the AI chat endpoint.
 * @param {string} prompt - User prompt
 * @param {string} [model] - Optional model identifier
 * @returns {Promise<Object>} JSON response
 */
export async function aiChat(prompt, model) {
  ensureAiAccess();
  const res = await fetch('/api/ai-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, model }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(text);
  }
  return res.json();
}
