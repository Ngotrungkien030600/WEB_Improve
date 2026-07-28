/**
 * Home — AI Chat Section
 * Full conversational chat with AI on the homepage.
 */
document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('ai-chat-messages');
  const chatInput = document.getElementById('ai-chat-input');
  const sendBtn = document.getElementById('ai-send-btn');
  const topicSelect = document.getElementById('ai-topic-select');
  const clearBtn = document.getElementById('ai-clear-btn');
  if (!chatMessages || !chatInput || !sendBtn) return;

  // Hoist helpers — must be defined BEFORE any usage
  function escHtml(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }

  function renderMd(text) {
    let html = escHtml(text);
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (m, lang, code) => {
      return `<pre><code>${escHtml(code.trim())}</code></pre>`;
    });
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\n/g, '<br>');
    return html;
  }

  const topics = window.interviewTopics || [];
  let conversation = [];

  // Populate topic select
  if (topicSelect) {
    topics.forEach((t, i) => {
      const opt = document.createElement('option');
      opt.value = i;
      opt.textContent = t.title.replace(/^📄 /, '').replace(/^📚 /, '');
      topicSelect.appendChild(opt);
    });
    topicSelect.addEventListener('change', clearChat);
  }

  if (clearBtn) clearBtn.addEventListener('click', clearChat);

  function getTopic() {
    if (!topicSelect || !topics.length) return '';
    return topics[parseInt(topicSelect.value)]?.title || '';
  }

  function clearChat() {
    conversation = [];
    chatMessages.innerHTML = '';
    addMessage('assistant', '👋 Chào bạn! Tôi là SkillForge AI. Hãy hỏi tôi bất kỳ câu gì về lập trình Java, phỏng vấn, bài tập...');
  }

  function addMessage(role, content) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-${role}`;
    div.innerHTML = role === 'user'
      ? `<div class="chat-bubble">${escHtml(content)}</div>`
      : `<div class="chat-avatar">🤖</div><div class="chat-bubble">${renderMd(content)}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-assistant';
    div.id = 'chat-typing';
    div.innerHTML = '<div class="chat-avatar">🤖</div><div class="chat-bubble chat-typing-dots"><span>.</span><span>.</span><span>.</span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTyping() {
    const el = document.getElementById('chat-typing');
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    addMessage('user', text);
    conversation.push({ role: 'user', content: text });
    addTyping();

    try {
      const resp = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation, topic: getTopic() }),
      });

      removeTyping();
      const data = await resp.json();

      if (!resp.ok) {
        addMessage('assistant', `❌ ${data.error || 'Lỗi kết nối AI.'}`);
        return;
      }

      const reply = data.reply || 'Xin lỗi, tôi chưa có câu trả lời.';
      addMessage('assistant', reply);
      conversation.push({ role: 'assistant', content: reply });
    } catch (e) {
      removeTyping();
      addMessage('assistant', `❌ Lỗi: ${e.message}`);
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Welcome message
  clearChat();
});
