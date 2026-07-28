/**
 * BMAD Agent Chat — replaces home-ai.js
 * Grid luôn hiện, chat bên dưới — solo + party mode
 */
document.addEventListener('DOMContentLoaded', () => {

  const agents = window.BMAD_AGENTS;
  let currentMode = 'solo';
  let selectedAgents = [];
  let partyRound = 0;
  const conversations = {};
  agents.forEach(a => { conversations[a.id] = []; });

  const API_ENDPOINT = '/api/bmad/chat';
  const grid = document.getElementById('bmad-agent-grid');
  const partyStart = document.getElementById('bmad-party-start');
  const sessionInfo = document.getElementById('bmad-session-info');
  const sessionLabel = document.getElementById('bmad-session-label');
  const chatMessages = document.getElementById('bmad-chat-messages');
  const chatInput = document.getElementById('bmad-chat-input');
  const sendBtn = document.getElementById('bmad-send-btn');
  const backBtn = document.getElementById('bmad-back-btn');
  const clearBtn = document.getElementById('bmad-clear-btn');
  const partyStartBtn = document.getElementById('bmad-party-start-btn');

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

  // ---- Render Agent Grid ----
  function renderAgentGrid() {
    grid.innerHTML = '';
    agents.forEach(a => {
      const card = document.createElement('div');
      card.className = 'bmad-agent-card';
      card.dataset.id = a.id;

      const isSelected = currentMode === 'solo'
        ? selectedAgents[0] === a.id
        : selectedAgents.includes(a.id);

      if (currentMode === 'solo' && isSelected) card.classList.add('selected');
      if (currentMode === 'party' && isSelected) card.classList.add('party-selected');

      card.innerHTML = `
        <span class="agent-icon">${a.icon}</span>
        <span class="agent-name">${a.name}</span>
        <span class="agent-role">${a.title}</span>
        <div class="agent-check">✓</div>
      `;

      card.addEventListener('click', () => {
        if (currentMode === 'solo') {
          selectAgent(a.id);
        } else {
          togglePartyAgent(a.id);
        }
      });

      grid.appendChild(card);
    });

    if (currentMode === 'party') {
      partyStart.classList.toggle('visible', selectedAgents.length >= 2);
    } else {
      partyStart.classList.remove('visible');
    }
  }

  function togglePartyAgent(id) {
    const idx = selectedAgents.indexOf(id);
    if (idx >= 0) {
      selectedAgents.splice(idx, 1);
    } else {
      if (selectedAgents.length >= 4) return;
      selectedAgents.push(id);
    }
    renderAgentGrid();
  }

  // ---- Mode switching ----
  document.querySelectorAll('.bmad-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      document.querySelectorAll('.bmad-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === currentMode));
      selectedAgents = [];
      // Ẩn chat khi chuyển mode
      chatMessages.style.display = 'none';
      chatInput.style.display = 'none';
      sendBtn.style.display = 'none';
      sessionInfo.style.display = 'none';
      partyStart.classList.remove('visible');
      renderAgentGrid();
    });
  });

  // ---- Solo: select agent ----
  function selectAgent(id) {
    selectedAgents = [id];
    showChatView();
    renderAgentGrid(); // refresh highlight
  }

  // ---- Party: start ----
  function startParty() {
    if (selectedAgents.length < 2) return;
    partyRound = 0;
    showChatView();
  }

  // ---- Show chat view ----
  function showChatView() {
    partyStart.classList.remove('visible');
    sessionInfo.style.display = 'flex';
    chatMessages.style.display = 'flex';
    chatInput.style.display = '';
    sendBtn.style.display = '';

    if (currentMode === 'solo') {
      const a = agents.find(x => x.id === selectedAgents[0]);
      sessionLabel.textContent = `${a.icon} ${a.name} — ${a.title}`;
    } else {
      const names = selectedAgents.map(id => {
        const a = agents.find(x => x.id === id);
        return a ? `${a.icon} ${a.name}` : id;
      }).join(', ');
      sessionLabel.textContent = `🎉 Party: ${names}`;
    }

    chatMessages.innerHTML = '';
    if (currentMode === 'solo') {
      const a = agents.find(x => x.id === selectedAgents[0]);
      if (a && conversations[a.id].length === 0) {
        addSoloMessage(a.id, a.welcome);
        conversations[a.id].push({ role: 'assistant', content: a.welcome });
      } else if (a) {
        restoreConversation(a.id);
      }
    } else {
      const hasHistory = selectedAgents.some(id => conversations[id].length > 0);
      if (!hasHistory) {
        chatMessages.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:2rem 0;font-size:0.9rem;">🎉 Party Mode! Gửi tin nhắn và xem các agent thảo luận.</div>';
      } else {
        selectedAgents.forEach(id => {
          const conv = conversations[id];
          conv.forEach(msg => {
            if (msg.role === 'assistant') {
              addSoloMessage(id, msg.content);
            }
          });
        });
      }
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function restoreConversation(agentId) {
    const conv = conversations[agentId];
    conv.forEach(msg => {
      if (msg.role === 'user') {
        const div = document.createElement('div');
        div.className = 'chat-msg chat-user';
        div.innerHTML = `<div class="chat-bubble">${escHtml(msg.content)}</div>`;
        chatMessages.appendChild(div);
      } else if (msg.role === 'assistant') {
        addSoloMessage(agentId, msg.content);
      }
    });
  }

  function addSoloMessage(agentId, content) {
    const a = agents.find(x => x.id === agentId);
    if (!a) return;
    const div = document.createElement('div');
    div.className = 'chat-msg chat-assistant chat-msg-solo';
    div.innerHTML = `
      <div class="chat-avatar">${a.icon}</div>
      <div>
        <div class="chat-msg-header">
          <span class="agent-name">${a.name}</span>
        </div>
        <div class="chat-bubble">${renderMd(content)}</div>
      </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ---- Send message ----
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';

    if (currentMode === 'solo') {
      const agentId = selectedAgents[0];
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg chat-user';
      userDiv.innerHTML = `<div class="chat-bubble">${escHtml(text)}</div>`;
      chatMessages.appendChild(userDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      conversations[agentId].push({ role: 'user', content: text });
      const typingDiv = addTyping();

      try {
        const resp = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentIds: [agentId],
            messages: { [agentId]: conversations[agentId] },
          }),
        });

        removeTyping(typingDiv);
        const data = await resp.json();

        if (!resp.ok || data.error) {
          addSoloMessage(agentId, `❌ ${data.error || 'Lỗi kết nối.'}`);
          conversations[agentId].push({ role: 'assistant', content: `❌ ${data.error || 'Lỗi kết nối.'}` });
          return;
        }

        if (data.replies && data.replies.length > 0) {
          const reply = data.replies[0];
          addSoloMessage(agentId, reply.text);
          conversations[agentId].push({ role: 'assistant', content: reply.text });
        }
      } catch (e) {
        removeTyping(typingDiv);
        addSoloMessage(agentId, `❌ Lỗi: ${e.message}`);
        conversations[agentId].push({ role: 'assistant', content: `❌ Lỗi: ${e.message}` });
      }

    } else {
      const userDiv = document.createElement('div');
      userDiv.className = 'chat-msg chat-user';
      userDiv.innerHTML = `<div class="chat-bubble">${escHtml(text)}</div>`;
      chatMessages.appendChild(userDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      const typingDiv = addTyping();

      try {
        const resp = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentIds: selectedAgents,
            messages: selectedAgents.reduce((acc, id) => {
              acc[id] = conversations[id];
              return acc;
            }, {}),
            userMessage: text,
          }),
        });

        removeTyping(typingDiv);
        const data = await resp.json();

        selectedAgents.forEach(id => {
          conversations[id].push({ role: 'user', content: text });
        });

        if (!resp.ok) {
          const errDiv = document.createElement('div');
          errDiv.className = 'chat-msg chat-assistant';
          errDiv.innerHTML = `<div class="chat-bubble">❌ ${data.error || 'Lỗi kết nối.'}</div>`;
          chatMessages.appendChild(errDiv);
          return;
        }

        partyRound++;
        const roundDiv = document.createElement('div');
        roundDiv.className = 'party-round';

        const roundHeader = document.createElement('div');
        roundHeader.className = 'party-round-header';
        roundHeader.textContent = `🎉 Vòng ${partyRound}`;
        roundDiv.appendChild(roundHeader);

        (data.replies || []).forEach(reply => {
          const a = agents.find(x => x.id === reply.agentId);
          if (!a) return;
          const agentDiv = document.createElement('div');
          agentDiv.className = 'party-agent-reply';
          agentDiv.style.borderLeft = `3px solid ${a.color}`;
          agentDiv.innerHTML = `
            <div class="party-agent-icon">${reply.icon}</div>
            <div class="party-agent-body">
              <div class="party-agent-name">${reply.name}</div>
              <div class="party-agent-text">${renderMd(reply.text)}</div>
            </div>
          `;
          roundDiv.appendChild(agentDiv);

          conversations[reply.agentId].push({ role: 'assistant', content: reply.text });
        });

        chatMessages.appendChild(roundDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

      } catch (e) {
        removeTyping(typingDiv);
        const errDiv = document.createElement('div');
        errDiv.className = 'chat-msg chat-assistant';
        errDiv.innerHTML = `<div class="chat-bubble">❌ Lỗi: ${e.message}</div>`;
        chatMessages.appendChild(errDiv);
      }
    }
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-assistant';
    div.innerHTML = '<div class="chat-avatar">🤖</div><div class="chat-bubble chat-typing-dots"><span>.</span><span>.</span><span>.</span></div>';
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function removeTyping(el) {
    if (el && el.parentNode) el.remove();
  }

  function clearAllChats() {
    agents.forEach(a => { conversations[a.id] = []; });
    partyRound = 0;
    selectedAgents = [];
    chatMessages.innerHTML = '';
    chatMessages.style.display = 'none';
    chatInput.style.display = 'none';
    sendBtn.style.display = 'none';
    sessionInfo.style.display = 'none';
    renderAgentGrid();
  }

  // ---- Events ----
  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  if (backBtn) backBtn.addEventListener('click', () => {
    selectedAgents = [];
    chatMessages.innerHTML = '';
    chatMessages.style.display = 'none';
    chatInput.style.display = 'none';
    sendBtn.style.display = 'none';
    sessionInfo.style.display = 'none';
    renderAgentGrid();
  });
  if (clearBtn) clearBtn.addEventListener('click', clearAllChats);
  if (partyStartBtn) partyStartBtn.addEventListener('click', startParty);

  // ---- Init ----
  renderAgentGrid();
});
