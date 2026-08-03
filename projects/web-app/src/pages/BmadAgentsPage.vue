<template>
  <div class="subpage">
    <div class="subpage-container">
      <header class="subpage-topbar">
        <div class="subpage-topbar-left">
          <span class="icon">🗣️</span>
          <div>
            <h1>BMAD Agents</h1>
            <div class="subtitle">7 trợ lý AI — chọn 1 để trò chuyện, hoặc Party Mode thảo luận đa chiều</div>
          </div>
        </div>
        <div class="subpage-topbar-right">
          <a class="subpage-back" href="#" @click.prevent="goHome">← Trang chủ</a>
        </div>
      </header>

      <div class="mode-bar" :class="{ 'party-mode': currentMode === 'party' }">
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'solo' }"
          @click="setMode('solo')"
        >🧑‍💻 Trò chuyện 1-1</button>
        <button
          class="mode-btn"
          :class="{ active: currentMode === 'party' }"
          @click="setMode('party')"
        >🎉 Party Mode</button>
      </div>

      <div class="agent-grid" v-show="!showChat">
        <div
          v-for="agent in agents"
          :key="agent.id"
          class="agent-card"
          :class="getCardClass(agent.id)"
          :style="{ '--agent-color': agent.color }"
          @click="handleCardClick(agent)"
        >
          <span class="agent-icon">{{ agent.icon }}</span>
          <span class="agent-name">{{ agent.name }}</span>
          <span class="agent-role">{{ agent.title }}</span>
          <div class="agent-check" v-if="isSelected(agent.id)">✓</div>
        </div>
      </div>

      <div class="party-start" v-show="currentMode === 'party' && !showChat">
        <button class="ctrl-btn" @click="selectAll">✅ Chọn tất cả</button>
        <button class="ctrl-btn primary" @click="startParty" :disabled="selectedAgents.length < 2">🎉 Bắt đầu Party</button>
      </div>

      <div class="session-info" v-show="showChat">
        <span class="session-label">{{ sessionLabel }}</span>
        <button class="ctrl-btn" @click="backToList">← Danh sách</button>
        <button class="ctrl-btn danger" @click="clearChat">🗑️</button>
      </div>

      <div class="chat-messages" v-show="showChat" ref="chatMessages">
        <div
          v-for="(msg, i) in currentMessages"
          :key="i"
          class="chat-msg"
          :class="msg.role"
        >
          <span class="msg-icon" v-if="msg.agentId">{{ getAgentIcon(msg.agentId) }}</span>
          <div class="msg-bubble" v-html="msg.html"></div>
        </div>
        <div v-if="isLoading" class="chat-msg bmAD loading">
          <span class="msg-icon">⏳</span>
          <div class="msg-bubble typing">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="input-row" v-show="showChat">
        <textarea
          v-model="inputText"
          rows="2"
          placeholder="Nhập câu hỏi..."
          maxlength="2000"
          @keydown.enter.exact.prevent="sendMessage"
        ></textarea>
        <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()">➤</button>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import { BMAD_AGENTS } from '@legacy/js/agents/agents-config.js';
import { BMAD_CONSTANTS } from '@legacy/js/agents/agent-constants.js';
import { chat as bmadChat } from '../api/index.js';
import { markdownToHTML } from '@legacy/js/utils/markdown.js';

export default {
  name: 'BmadAgentsPage',
  data() {
    return {
      agents: BMAD_AGENTS || [],
      currentMode: 'solo',
      selectedAgents: [],
      conversations: {},
      currentMessages: [],
      inputText: '',
      isLoading: false,
      showChat: false,
    };
  },
  computed: {
    sessionLabel() {
      if (this.currentMode === 'solo' && this.selectedAgents.length === 1) {
        const a = this.agents.find(x => x.id === this.selectedAgents[0]);
        return a ? `${a.icon} ${a.name} — ${a.title}` : 'Chat';
      }
      if (this.selectedAgents.length > 0) {
        const names = this.selectedAgents.map(id => {
          const a = this.agents.find(x => x.id === id);
          return a ? `${a.icon} ${a.name}` : id;
        }).join(', ');
        return `🎉 Party: ${names}`;
      }
      return 'Chat';
    },
  },
  methods: {
    goHome() { navigate('/'); },

    setMode(mode) {
      this.currentMode = mode;
      this.selectedAgents = [];
      this.showChat = false;
      this.currentMessages = [];
    },

    isSelected(id) {
      return this.currentMode === 'solo'
        ? this.selectedAgents[0] === id
        : this.selectedAgents.includes(id);
    },

    getCardClass(id) {
      if (this.currentMode === 'solo') {
        return this.selectedAgents[0] === id ? 'selected' : '';
      }
      return this.selectedAgents.includes(id) ? 'party-selected' : '';
    },

    handleCardClick(agent) {
      if (this.currentMode === 'solo') {
        this.selectedAgents = [agent.id];
        this.openChat();
      } else {
        this.togglePartyAgent(agent.id);
      }
    },

    togglePartyAgent(id) {
      const idx = this.selectedAgents.indexOf(id);
      if (idx >= 0) {
        this.selectedAgents.splice(idx, 1);
      } else {
        this.selectedAgents.push(id);
      }
    },

    selectAll() {
      this.selectedAgents = this.agents.map(a => a.id);
    },

    startParty() {
      if (this.selectedAgents.length < 2) return;
      this.openChat();
    },

    openChat() {
      this.conversations = {};
      this.agents.forEach(a => { this.conversations[a.id] = []; });
      this.currentMessages = [];

      if (this.currentMode === 'solo') {
        const a = this.agents.find(x => x.id === this.selectedAgents[0]);
        if (a) {
          const welcome = { role: 'bmad', agentId: a.id, html: markdownToHTML(a.welcome) };
          this.currentMessages.push(welcome);
          this.conversations[a.id].push({ role: 'assistant', content: a.welcome });
        }
      } else {
        const initMsg = {
          role: 'info',
          agentId: null,
          html: '🎉 Party Mode! Gửi tin nhắn và xem các agent thảo luận.',
        };
        this.currentMessages.push(initMsg);
      }

      this.showChat = true;
      this.$nextTick(() => this.scrollToBottom());
    },

    backToList() {
      this.showChat = false;
      this.selectedAgents = [];
    },

    clearChat() {
      this.conversations = {};
      this.agents.forEach(a => { this.conversations[a.id] = []; });
      this.currentMessages = [];
      this.openChat();
    },

    getAgentIcon(agentId) {
      const a = this.agents.find(x => x.id === agentId);
      return a ? a.icon : '🤖';
    },

    async sendMessage() {
      const text = this.inputText.trim();
      if (!text || this.isLoading) return;

      this.inputText = '';
      const userMsg = { role: 'user', agentId: null, html: markdownToHTML(text) };
      this.currentMessages.push(userMsg);

      if (this.currentMode === 'solo') {
        const agentId = this.selectedAgents[0];
        this.conversations[agentId].push({ role: 'user', content: text });
      }

      this.isLoading = true;
      this.scrollToBottom();

      try {
        const messages = this.selectedAgents.flatMap(id => {
          return (this.conversations[id] || []).map(msg => ({
            role: msg.role,
            content: msg.content,
          }));
        });

        const { reply } = await bmadChat(this.selectedAgents, messages);

        if (this.currentMode === 'solo') {
          const agentId = this.selectedAgents[0];
          this.conversations[agentId].push({ role: 'assistant', content: reply });
          const agentMsg = { role: 'bmad', agentId, html: markdownToHTML(reply) };
          this.currentMessages.push(agentMsg);
        } else {
          this.currentMessages.push({
            role: 'bmad',
            agentId: null,
            html: markdownToHTML(reply),
          });
        }
      } catch (err) {
        this.currentMessages.push({
          role: 'error',
          agentId: null,
          html: `<span style="color:var(--forge-error)">❌ Lỗi: ${err.message || 'Không thể kết nối AI'}</span>`,
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatMessages;
        if (el) el.scrollTop = el.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/subpage.css';
@import '@legacy/css/forge-tokens.css';
@import '@legacy/css/agents/bmad-chat.css';

:root {
  --forge-error: #ef4444;
  --forge-accent-inverse: #000;
}

.mode-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mode-btn {
  padding: 0.5rem 1rem;
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: 20px;
  color: var(--forge-text2);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn.active {
  background: var(--forge-accent);
  color: var(--forge-accent-inverse);
  border-color: var(--forge-accent);
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.agent-card {
  background: var(--forge-bg-card);
  border: 1px solid var(--forge-border);
  border-radius: var(--forge-radius-md);
  padding: 1rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: relative;
  transition: all 0.2s;
}

.agent-card:hover {
  border-color: var(--agent-color);
  transform: translateY(-2px);
}

.agent-card.selected,
.agent-card.party-selected {
  border-color: var(--agent-color);
  background: color-mix(in srgb, var(--agent-color) 15%, var(--forge-bg-card));
}

.agent-card .agent-check {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--agent-color);
  color: white;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.agent-card .agent-icon {
  font-size: 2rem;
  line-height: 1;
}

.agent-card .agent-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--forge-text);
}

.agent-card .agent-role {
  font-size: 0.8rem;
  color: var(--forge-text-muted);
}

.party-start {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.ctrl-btn {
  padding: 0.45rem 1rem;
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: 20px;
  color: var(--forge-text2);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.ctrl-btn:hover {
  background: var(--forge-bg-glass-hover);
}

.ctrl-btn.primary {
  background: var(--forge-accent);
  color: var(--forge-accent-inverse);
  border-color: var(--forge-accent);
}

.ctrl-btn.danger {
  color: var(--forge-error);
  border-color: rgba(239, 68, 68, 0.3);
}

.ctrl-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.session-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--forge-text);
  flex: 1;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 55vh;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: var(--forge-radius-md);
}

.chat-msg {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
}

.chat-msg.user {
  flex-direction: row-reverse;
}

.chat-msg .msg-icon {
  font-size: 1.4rem;
  line-height: 1.4;
  flex-shrink: 0;
}

.chat-msg .msg-bubble {
  max-width: 75%;
  padding: 0.6rem 0.9rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.6;
  word-break: break-word;
}

.chat-msg.user .msg-bubble {
  background: var(--forge-accent);
  color: var(--forge-accent-inverse);
  border-bottom-right-radius: 4px;
}

.chat-msg.bmad .msg-bubble {
  background: var(--forge-bg-card);
  border: 1px solid var(--forge-border);
  color: var(--forge-text);
  border-bottom-left-radius: 4px;
}

.chat-msg.info .msg-bubble {
  background: transparent;
  border: 1px dashed var(--forge-border);
  color: var(--forge-text-muted);
  text-align: center;
  font-size: 0.85rem;
}

.chat-msg.error .msg-bubble {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: var(--forge-error);
}

.chat-msg.loading .msg-bubble {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0.8rem 1rem;
}

.typing .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--forge-text-muted);
  animation: bounce 1.4s infinite ease-in-out;
}

.typing .dot:nth-child(1) { animation-delay: -0.32s; }
.typing .dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1.1); opacity: 1; }
}

.input-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.input-row textarea {
  flex: 1;
  background: var(--forge-bg-glass);
  border: 1px solid var(--forge-border-light);
  border-radius: var(--forge-radius-md);
  color: var(--forge-text);
  padding: 0.6rem 0.9rem;
  font-size: 0.9rem;
  font-family: inherit;
  resize: none;
  outline: none;
}

.input-row textarea:focus {
  border-color: var(--forge-accent);
}

.input-row .send-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--forge-accent);
  color: var(--forge-accent-inverse);
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.input-row .send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.input-row .send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
