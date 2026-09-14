<template>
  <div class="code-editor">
    <div class="editor-bar">
      <span class="editor-lang">{{ languageLabel }}</span>
      <span class="editor-tips">Tab = thụt lề · Ctrl + Enter = chạy thử · Ctrl + Shift + Enter = nộp bài</span>
    </div>

    <div class="editor-scroll">
      <div class="editor-gutter" aria-hidden="true" :style="{ transform: `translateY(${-scrollTop}px)` }">
        <span v-for="line in lineCount" :key="line">{{ line }}</span>
      </div>
      <div class="editor-area">
        <pre
          class="editor-layer editor-highlight"
          aria-hidden="true"
          :style="{ transform: `translate(${-scrollLeft}px, ${-scrollTop}px)` }"
        ><code v-html="highlighted"></code></pre>
        <textarea
          ref="input"
          class="editor-layer editor-input"
          :value="modelValue"
          :aria-label="ariaLabel"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          wrap="off"
          @input="onInput"
          @keydown="onKeydown"
          @scroll="onScroll"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { highlightCode, findCodeLanguage } from '../logic/code-lab-logic.js';

const INDENT = '  ';

export default {
  name: 'CCodeEditor',
  props: {
    modelValue: { type: String, default: '' },
    ariaLabel: { type: String, default: 'Ô soạn code' },
    language: { type: String, default: 'javascript' },
  },
  emits: ['update:modelValue', 'run', 'submit', 'change'],
  data() {
    return { scrollTop: 0, scrollLeft: 0 };
  },
  computed: {
    languageLabel() {
      return findCodeLanguage(this.language).label;
    },
    lineCount() {
      return Math.max(1, this.modelValue.split('\n').length);
    },
    highlighted() {
      return highlightCode(this.modelValue, this.language);
    },
  },
  methods: {
    focus() {
      const input = this.$refs.input;
      if (input) input.focus();
    },
    insertText(text) {
      const input = this.$refs.input;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const next = this.modelValue.slice(0, start) + text + this.modelValue.slice(end);
      this.$emit('update:modelValue', next);
      this.$emit('change', next);
      this.$nextTick(() => {
        input.selectionStart = start + text.length;
        input.selectionEnd = start + text.length;
      });
    },
    currentLineBeforeCaret() {
      const input = this.$refs.input;
      const before = this.modelValue.slice(0, input.selectionStart);
      return before.slice(before.lastIndexOf('\n') + 1);
    },
    onInput(event) {
      this.$emit('update:modelValue', event.target.value);
      this.$emit('change', event.target.value);
    },
    onScroll(event) {
      this.scrollTop = event.target.scrollTop;
      this.scrollLeft = event.target.scrollLeft;
    },
    onKeydown(event) {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        if (event.shiftKey) this.$emit('submit');
        else this.$emit('run');
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        this.insertText(INDENT);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const line = this.currentLineBeforeCaret();
        const indent = (line.match(/^[ \t]*/) || [''])[0];
        const opensBlock = /[{([]\s*$/.test(line);
        this.insertText(`\n${indent}${opensBlock ? INDENT : ''}`);
      }
    },
  },
};
</script>

<style scoped>
.code-editor {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0f0d1f;
}

.editor-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-lang {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #a78bfa;
}

.editor-tips {
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
}

.editor-scroll {
  display: flex;
  height: 340px;
  overflow: hidden;
  background: #0f0d1f;
}

.editor-gutter {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  padding: 0.75rem 0.5rem 0.75rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  text-align: right;
  user-select: none;
}

.editor-gutter span {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13.5px;
  line-height: 21px;
  color: #64748b;
}

.editor-area {
  position: relative;
  flex: 1;
  min-width: 0;
}

.editor-layer {
  margin: 0;
  padding: 0.75rem;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13.5px;
  line-height: 21px;
  tab-size: 2;
  white-space: pre;
  word-wrap: normal;
  overflow-wrap: normal;
}

.editor-highlight {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  pointer-events: none;
  color: #e2e8f0;
}

.editor-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  overflow: auto;
  background: transparent;
  color: transparent;
  caret-color: #f8fafc;
  -webkit-text-fill-color: transparent;
}

.editor-input::selection {
  background: rgba(139, 92, 246, 0.35);
}

.editor-input:focus-visible {
  box-shadow: inset 0 0 0 2px rgba(139, 92, 246, 0.45);
}

:deep(.tk-com) { color: #6b7280; font-style: italic; }
:deep(.tk-str) { color: #86efac; }
:deep(.tk-kw) { color: #c084fc; font-weight: 600; }
:deep(.tk-num) { color: #fdba74; }
:deep(.tk-fn) { color: #7dd3fc; }
:deep(.tk-type) { color: #fcd34d; }

@media (max-width: 900px) {
  .editor-scroll {
    height: 260px;
  }
}

@media (max-width: 720px) {
  .editor-tips {
    display: none;
  }
}
</style>
