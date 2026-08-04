<template>
  <div class="ui-interview-page" style="--color-accent: #f472b6">
    <div class="page">
      <div class="topbar">
        <h1>💼 Phỏng vấn UI/FE</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/frontend/hub')">← Frontend</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">Câu hỏi phỏng vấn Frontend theo cấp độ — bấm vào câu hỏi để xem câu trả lời mẫu.</p>

      <div class="tier-tabs">
        <button
          v-for="tier in tiers"
          :key="tier.id"
          class="tier-tab"
          :class="{ active: currentTier === tier.id }"
          @click="switchTier(tier.id)"
        >
          {{ tier.emoji }} {{ tier.label }}
        </button>
      </div>

      <p v-if="currentData" class="count">📋 {{ currentData.questions.length }} câu hỏi — {{ currentData.label }}</p>

      <div class="questions">
        <div
          v-for="(item, i) in currentData?.questions"
          :key="i"
          class="q-item"
          :class="{ show: expanded[i] }"
          @click="toggleAnswer(i)"
        >
          <div class="q-topic">{{ item.topic }}</div>
          <div class="q-text">{{ i + 1 }}. {{ item.q }}</div>
          <div class="q-answer">{{ item.a }}</div>
          <span class="q-toggle">{{ expanded[i] ? '🙈 Ẩn trả lời' : '📝 Xem trả lời' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

const data = {
  junior: {
    label: 'Junior (0-2 năm)',
    questions: [
      { topic: 'HTML', q: 'Sự khác nhau giữa div và span?', a: 'div là block-level (chiếm full width), span là inline (nằm trên cùng dòng).' },
      { topic: 'HTML', q: 'Thẻ semantic là gì? Kể tên 5 thẻ.', a: 'Thẻ mang ý nghĩa, giúp SEO và accessibility: header, nav, main, section, article, aside, footer.' },
      { topic: 'CSS', q: 'Box model gồm những gì?', a: 'Content → Padding → Border → Margin. Dùng box-sizing: border-box để tính width bao gồm padding + border.' },
      { topic: 'CSS', q: 'Phân biệt class và id?', a: 'class dùng nhiều lần, id duy nhất 1 lần/trang. id có độ ưu tiên cao hơn trong CSS specificity.' },
      { topic: 'CSS', q: 'Flexbox: justify-content vs align-items?', a: 'justify-content: căn theo trục chính (main axis). align-items: căn theo trục phụ (cross axis).' },
      { topic: 'JS', q: '`==` và `===` khác nhau thế nào?', a: '== so sánh value sau khi type coercion. === so sánh cả value và type (strict equality).' },
      { topic: 'JS', q: 'let, const, var khác nhau?', a: 'var: function scope, hoisted. let/const: block scope. const không thể reassign.' },
      { topic: 'JS', q: 'Event bubbling là gì?', a: 'Sự kiện từ phần tử con nổi lên cha. Dùng e.stopPropagation() để ngăn.' },
      { topic: 'CSS', q: 'Làm sao để center một div?', a: 'display: flex; justify-content: center; align-items: center; hoặc display: grid; place-items: center;' },
      { topic: 'JS', q: '`this` trong JavaScript hoạt động thế nào?', a: 'Phụ thuộc vào context: global → window, object method → object, arrow function → lexical this.' },
    ]
  },
  middle: {
    label: 'Middle (2-5 năm)',
    questions: [
      { topic: 'React', q: 'useEffect dependency array hoạt động thế nào?', a: '[] chạy 1 lần (mount). [deps] chạy lại khi deps thay đổi. Không có deps chạy mỗi render.' },
      { topic: 'React', q: 'Virtual DOM là gì?', a: 'Bản sao nhẹ của DOM thật. React tính diff, cập nhật tối thiểu real DOM. Giúp tăng performance.' },
      { topic: 'CSS', q: 'CSS specificity tính thế nào?', a: '!important > inline > id > class/attribute/pseudo-class > element. (0,0,0,0) theo id-class-element.' },
      { topic: 'CSS', q: 'Khi nào dùng Grid, khi nào Flexbox?', a: 'Grid: layout 2 chiều, page layout. Flexbox: 1 chiều, navigation, card rows, center content.' },
      { topic: 'JS', q: 'Closure là gì? Ví dụ?', a: 'Function nhớ scope nơi nó được tạo. Ví dụ: function createCounter() { let c=0; return ()=>++c; }' },
      { topic: 'JS', q: 'Event Loop giải thích?', a: 'Call stack → Web APIs → Task queue (macro/micro). Microtask (Promise) chạy trước macrotask (setTimeout).' },
      { topic: 'JS', q: 'Promise.all vs Promise.allSettled?', a: 'all: reject nếu bất kỳ Promise nào fail. allSettled: chờ tất cả hoàn thành (bất kể fail/success).' },
      { topic: 'React', q: 'useCallback vs useMemo?', a: 'useCallback memo hóa function, useMemo memo hóa giá trị. Cả 2 tránh re-compute không cần thiết.' },
      { topic: 'CSS', q: 'CSS Variables vs preprocessor (SASS) variables?', a: 'CSS vars live trong browser, dynamic, không cần build. SASS vars compile-time, thích hợp cho toán tử.' },
      { topic: 'Accessibility', q: 'Làm sao để web accessible?', a: 'Semantic HTML, alt text, ARIA labels, keyboard navigation, focus visible, color contrast, heading hierarchy.' },
    ]
  },
  senior: {
    label: 'Senior (5+ năm)',
    questions: [
      { topic: 'Architecture', q: 'Micro-frontend là gì? Lợi ích và thách thức?', a: 'Chia FE thành nhiều module độc lập. Lợi: team tự chủ, deploy độc lập. Thách thức: bundle size, routing đồng bộ, shared dependencies.' },
      { topic: 'Performance', q: 'Làm sao tối ưu Core Web Vitals?', a: 'LCP: tối ưu images, preload key resources. FID: code splitting, lazy load JS. CLS: set kích thước cho images/ads.' },
      { topic: 'React', q: 'Khi nào nên dùng useRef thay vì useState?', a: 'useRef: giá trị thay đổi không gây re-render. Dùng cho DOM refs, interval ids, giữ giá trị qua render.' },
      { topic: 'CSS', q: 'Container Queries khác Media Queries thế nào?', a: 'Container queries phản ứng theo kích thước container (component), không phải viewport. Dùng cho reusable components.' },
      { topic: 'State', q: 'Client state vs Server state? Cách quản lý?', a: 'Client state: UI state (theme, modal). Server state: data từ API. Dùng React Query/SWR cho server state — cache, refetch, optimistic update.' },
      { topic: 'Testing', q: 'Các loại test trong FE?', a: 'Unit test (Vitest/Jest): test function/component. Integration test: test user flow. E2E (Playwright/Cypress): test full user journey.' },
      { topic: 'Security', q: 'XSS và CSRF? Cách phòng tránh?', a: 'XSS: chèn script độc → escape output, Content-Security-Policy. CSRF: giả mạo request → CSRF token, SameSite=Strict cookie.' },
      { topic: 'Build', q: 'Webpack vs Vite? Tại sao Vite nhanh hơn?', a: 'Vite dùng ES modules dev server, pre-bundle bằng esbuild. Webpack bundle tất cả. Vite: HMR nhanh hơn 10x, cấu hình đơn giản hơn.' },
      { topic: 'Patterns', q: 'Design patterns trong FE?', a: 'Singleton (tạo 1 instance), Observer (event bus), Factory (tạo component), Strategy (swap algorithm), HOC/HOF (higher-order).' },
      { topic: 'System Design', q: 'Thiết kế real-time collaborative app?', a: 'WebSocket + CRDT/OT. CRDT cho offline-first. OT cho Google Docs style. Operational Transform hoặc Yjs/Collaboration.' },
    ]
  }
};

export default {
  name: 'FrontendUiInterviewPage',
  data() {
    return {
      currentTier: 'junior',
      expanded: {},
      tiers: [
        { id: 'junior', label: 'Junior (0-2 năm)', emoji: '🌱' },
        { id: 'middle', label: 'Middle (2-5 năm)', emoji: '📈' },
        { id: 'senior', label: 'Senior (5+ năm)', emoji: '🎯' },
      ],
    };
  },
  computed: {
    currentData() {
      return data[this.currentTier];
    },
  },
  methods: {
    handleNav(path) {
      navigate(path);
    },
    switchTier(tier) {
      this.currentTier = tier;
      this.expanded = {};
    },
    toggleAnswer(index) {
      this.expanded = { ...this.expanded, [index]: !this.expanded[index] };
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';

.ui-interview-page {
  background: var(--color-bg);
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}

.desc {
  color: var(--color-text2);
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.tier-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1.5rem;
  background: var(--color-surface2);
  border-radius: var(--color-radius);
  padding: 0.25rem;
}

.tier-tab {
  flex: 1;
  padding: 0.5rem;
  text-align: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text2);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Inter', system-ui, sans-serif;
  transition: all 0.2s;
}

.tier-tab.active {
  background: var(--color-accent);
  color: #ffffff;
}

.tier-tab:hover:not(.active) {
  color: var(--color-text);
}

.count {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-bottom: 1rem;
}

.questions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.q-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.q-item:hover {
  border-color: var(--color-accent);
}

.q-item.show {
  border-color: var(--color-accent);
}

.q-topic {
  font-size: 0.7rem;
  color: var(--color-accent);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.q-text {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.q-answer {
  font-size: 0.8rem;
  color: var(--color-text2);
  border-top: 1px solid var(--color-border);
  padding-top: 0.5rem;
  display: none;
}

.q-item.show .q-answer {
  display: block;
}

.q-toggle {
  font-size: 0.75rem;
  color: var(--color-accent);
  user-select: none;
  display: block;
  margin-top: 0.5rem;
}

@media (max-width: 600px) {
  .tier-tabs {
    flex-direction: column;
  }
}
</style>
