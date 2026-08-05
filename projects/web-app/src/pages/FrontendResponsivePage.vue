<template>
  <div class="responsive-page" style="--color-accent: #34d399">
    <div class="page">
      <div class="topbar">
        <h1>📱 Responsive Design</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/frontend/hub')">← Frontend</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">Media Queries, Container Queries, Mobile-first, Fluid typography, Breakpoint system.</p>

      <div class="section">
        <h2>📐 Breakpoint System</h2>
        <pre><code>/* Mobile-first: base styles cho mobile, mở rộng dần */
/* 480px+ */  @media (min-width: 480px) { ... }
/* 768px+ */  @media (min-width: 768px) { ... }
/* 1024px+ */ @media (min-width: 1024px) { ... }
/* 1440px+ */ @media (min-width: 1440px) { ... }

/* Hoặc dùng max-width (desktop-first) */
/* &lt;600px */  @media (max-width: 599px) { ... }
/* &lt;900px */  @media (max-width: 899px) { ... }</code></pre>
      </div>

      <div class="section">
        <h2>📱 Mobile-first Approach</h2>
        <pre><code>/* Mobile: 1 cột */
.grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }

/* Tablet: 2 cột */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 4 cột */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}</code></pre>
      </div>

      <div class="section">
        <h2>📏 Fluid Typography</h2>
        <pre><code>/* clamp(min, preferred, max) */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
p  { font-size: clamp(0.875rem, 2vw, 1.125rem); }

/* Fluid spacing */
section { padding: clamp(1rem, 5vw, 3rem); }</code></pre>
      </div>

      <div class="section">
        <h2>🧩 Container Queries</h2>
        <pre><code>/* Component phản ứng theo container, không phải viewport */
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}

.parent { container-type: inline-size; container-name: sidebar; }
@container sidebar (min-width: 300px) { ... }</code></pre>
      </div>

      <div class="section">
        <h2>🖼️ Responsive Images</h2>
        <pre><code>&lt;picture&gt;
  &lt;source srcset="img-large.webp" media="(min-width: 1024px)" /&gt;
  &lt;source srcset="img-small.webp" media="(min-width: 480px)" /&gt;
  &lt;img src="img-fallback.jpg" alt="..." /&gt;
&lt;/picture&gt;

/* Hoặc srcset với width descriptor */
&lt;img srcset="img-400.jpg 400w, img-800.jpg 800w"
     sizes="(max-width: 600px) 100vw, 50vw"
     src="img-800.jpg" /&gt;</code></pre>
      </div>

      <div class="section">
        <h2>🖱️ Touch &amp; Pointer</h2>
        <pre><code>/* Phân biệt touch vs mouse */
@media (pointer: coarse) {
  button { min-height: 48px; }  /* touch: target lớn hơn */
}
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }  /* chỉ hover khi có mouse */
}</code></pre>
      </div>

      <div class="section">
        <h2>🔤 Logical Properties (RTL)</h2>
        <pre><code>/* Thay vì left/right dùng start/end */
.card { margin-inline: auto; }        /* margin-left + right */
.card { padding-inline: 1rem; }       /* padding-left + right */
.card { border-inline-start: 2px solid; }  /* border-left */

/* Tự động đảo chiều khi dir="rtl" */</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'FrontendResponsivePage',
  methods: {
    handleNav(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */

.responsive-page {
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

.section p,
.section li {
  font-size: 0.9rem;
  color: var(--color-text2);
}

.section ul {
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
  color: var(--color-text);
}

pre code {
  background: transparent;
  padding: 0;
}
</style>
