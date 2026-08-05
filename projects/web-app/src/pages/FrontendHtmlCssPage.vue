<template>
  <div class="htmlcss-page" style="--color-accent: #7c5cfc">
    <div class="page">
      <div class="topbar">
        <h1>🎨 HTML &amp; CSS</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/frontend/hub')">← Frontend</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">Từ semantic HTML đến CSS hiện đại: Flexbox, Grid, Animation, Custom Properties, BEM, và 25+ kỹ thuật thực tế.</p>

      <div class="section">
        <h2>📐 HTML5 Semantic</h2>
        <p>Các thẻ semantic giúp SEO, accessibility, và maintain code tốt hơn.</p>
        <pre><code>&lt;header&gt; &lt;nav&gt; &lt;main&gt; &lt;section&gt; &lt;article&gt; &lt;aside&gt; &lt;footer&gt;</code></pre>
        <div class="grid-2">
          <div class="card"><h4>&lt;header&gt;</h4><p>Đầu trang, chứa logo, navigation, search bar</p></div>
          <div class="card"><h4>&lt;nav&gt;</h4><p>Điều hướng chính, menu links</p></div>
          <div class="card"><h4>&lt;main&gt;</h4><p>Nội dung chính, chỉ 1 lần/trang</p></div>
          <div class="card"><h4>&lt;article&gt;</h4><p>Nội dung độc lập, có thể tái sử dụng</p></div>
          <div class="card"><h4>&lt;section&gt;</h4><p>Nhóm nội dung theo chủ đề</p></div>
          <div class="card"><h4>&lt;aside&gt;</h4><p>Nội dung liên quan, sidebar</p></div>
        </div>
      </div>

      <div class="section">
        <h2>📦 CSS Box Model &amp; Units</h2>
        <pre><code>* { box-sizing: border-box; } /* content-box vs border-box */</code></pre>
        <p><strong>Units:</strong> <code>px</code> (cố định), <code>rem</code> (dựa trên root font-size), <code>em</code> (dựa trên parent), <code>%</code>, <code>vw/vh</code> (viewport), <code>ch</code> (độ rộng chữ), <code>fr</code> (fraction trong grid)</p>
      </div>

      <div class="section">
        <h2>🧩 Flexbox</h2>
        <p>Bố cục 1 chiều — dùng cho navigation, card rows, center content.</p>
        <pre><code>.container {
  display: flex;
  justify-content: center; /* flex-start | center | space-between | space-around */
  align-items: center;     /* stretch | center | flex-start */
  gap: 1rem;               /* khoảng cách giữa các item */
  flex-wrap: wrap;         /* xuống dòng khi hết chỗ */
}
.item { flex: 1; }          /* chia đều không gian */</code></pre>
      </div>

      <div class="section">
        <h2>🔲 CSS Grid</h2>
        <p>Bố cục 2 chiều — dùng cho layout chính, gallery, dashboard.</p>
        <pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 cột bằng nhau */
  grid-template-columns: 200px 1fr;        /* sidebar + content */
  gap: 1rem;
}
.item { grid-column: span 2; }            /* chiếm 2 cột */
.item { grid-area: 1 / 1 / 3 / 3; }       /* row-start / col-start / row-end / col-end */</code></pre>
      </div>

      <div class="section">
        <h2>🎭 CSS Custom Properties (Variables)</h2>
        <pre><code>:root {
  --primary: #6366f1;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.btn { background: var(--primary); border-radius: var(--radius); }
/* Fallback: var(--primary, blue) */</code></pre>
      </div>

      <div class="section">
        <h2>✨ CSS Animations &amp; Transitions</h2>
        <pre><code>.btn {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s;
}
.btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.box { animation: fadeIn 0.5s ease forwards; }</code></pre>
      </div>

      <div class="section">
        <h2>🧱 BEM Methodology</h2>
        <pre><code>/* Block__Element--Modifier */
.card { }                    /* Block */
.card__title { }             /* Element */
.card__title--highlight { }  /* Modifier */
.card--featured { }          /* Modifier của Block */</code></pre>
      </div>

      <div class="section">
        <h2>🎪 25+ CSS Techniques</h2>
        <div class="grid-2">
          <div class="card"><h4>Hover Effect</h4><p><code>cubic-bezier</code> spring + glow shadow</p></div>
          <div class="card"><h4>Tooltip</h4><p><code>[data-tooltip]::after</code> CSS-only</p></div>
          <div class="card"><h4>Glassmorphism</h4><p><code>backdrop-filter: blur(14px)</code></p></div>
          <div class="card"><h4>Neumorphism</h4><p>Inset/outset soft shadows</p></div>
          <div class="card"><h4>Card Hover</h4><p>Sweep shimmer <code>::before</code></p></div>
          <div class="card"><h4>Ripple Effect</h4><p>JS + <code>@keyframes</code></p></div>
          <div class="card"><h4>Skeleton</h4><p>Shimmer gradient animation</p></div>
          <div class="card"><h4>Gradient Text</h4><p><code>background-clip: text</code></p></div>
          <div class="card"><h4>Flip Card</h4><p><code>perspective + rotateY</code></p></div>
          <div class="card"><h4>Accordion</h4><p>Checkbox hack CSS-only</p></div>
          <div class="card"><h4>Modal</h4><p><code>:target</code> pseudo-class</p></div>
          <div class="card"><h4>Toggle Switch</h4><p>Checkbox styling + spring</p></div>
          <div class="card"><h4>Custom Scrollbar</h4><p><code>::-webkit-scrollbar</code></p></div>
          <div class="card"><h4>Masonry</h4><p><code>columns: 3</code></p></div>
          <div class="card"><h4>Parallax</h4><p><code>background-attachment</code></p></div>
          <div class="card"><h4>Loading Spinner</h4><p>Border rotation keyframe</p></div>
          <div class="card"><h4>Timeline</h4><p><code>::before</code> line + dots</p></div>
          <div class="card"><h4>Animated Button</h4><p>Slide fill <code>::before</code></p></div>
          <div class="card"><h4>Sticky Header</h4><p><code>position: sticky</code></p></div>
          <div class="card"><h4>Dropdown</h4><p>CSS hover menu</p></div>
          <div class="card"><h4>Sidebar</h4><p>Checkbox toggle animation</p></div>
          <div class="card"><h4>Responsive Nav</h4><p>Media query + hamburger</p></div>
          <div class="card"><h4>Image Zoom</h4><p><code>scale(1.25)</code> overflow hidden</p></div>
          <div class="card"><h4>Carousel</h4><p>JS + CSS <code>translateX</code></p></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'FrontendHtmlCssPage',
  methods: {
    handleNav(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';
@import '@legacy/css/forge-tokens.css';

.htmlcss-page {
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

.section {
  margin-bottom: 2.5rem;
}

.section h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.section h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-accent);
}

.section p,
.section li {
  font-size: 0.9rem;
  color: var(--color-text2);
}

.section ul,
.section ol {
  padding-left: 1.25rem;
}

.section li {
  margin-bottom: 0.35rem;
}

pre {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
  font-size: 0.85rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  line-height: 1.6;
}

code {
  background: var(--color-surface2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
}

pre code {
  background: transparent;
  padding: 0;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
}

.card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.card p {
  font-size: 0.8rem;
  color: var(--color-text2);
}

@media (max-width: 600px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
