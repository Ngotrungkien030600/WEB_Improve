/**

/**
 * Send a chat message to the BMAD multi-agent system.
 * @param {string[]} agentIds - Array of agent IDs to include
 * @param {Object} messages - Message history
 * @returns {Promise<Object>} JSON response from API
 */
export async function chat(agentIds, messages) {
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
