<template>
  <div class="js-page" style="--color-accent: #f59e0b">
    <div class="page">
      <div class="topbar">
        <h1>⚡ JavaScript</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/frontend/hub')">← Frontend</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">ES6+, DOM, Async/Await, Closure, Promise, Event Loop, Web API, TypeScript cơ bản.</p>

      <div class="section">
        <h2>📦 ES6+ Features</h2>
        <pre><code>const add = (a, b) => a + b;                     // Arrow
const { name, age } = person;                     // Destructuring
const clone = { ...obj, key: 'val' };             // Spread
const zip = user?.address?.zip ?? 'N/A';          // Optional chaining & nullish</code></pre>
      </div>

      <div class="section">
        <h2>🧠 Closure &amp; Scope</h2>
        <pre><code>function createCounter() {
  let count = 0;
  return () => ++count;  // closure: inner function giữ reference đến count
}
const c = createCounter();
c(); // 1, c(); // 2</code></pre>
      </div>

      <div class="section">
        <h2>⏳ Promise &amp; Async/Await</h2>
        <pre><code>async function loadData() {
  try {
    const res = await fetch('/api/data');
    return await res.json();
  } catch (err) { console.error(err); }
}
// Promise.all: chạy song song
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r=&gt;r.json()),
  fetch('/api/posts').then(r=&gt;r.json())
]);</code></pre>
      </div>

      <div class="section">
        <h2>🔄 Event Loop</h2>
        <pre><code>console.log('1');
setTimeout(() => console.log('2'), 0);          // macrotask
Promise.resolve().then(() => console.log('3'));  // microtask
console.log('4');
// Output: 1, 4, 3, 2</code></pre>
      </div>

      <div class="section">
        <h2>🏗️ DOM &amp; Events</h2>
        <pre><code>const el = document.querySelector('.class');
el.textContent = 'Hello';
el.classList.add('active');
el.addEventListener('click', (e) => { /* e.target */ });

// Event delegation
parent.addEventListener('click', (e) => {
  if (e.target.matches('li')) handle(e.target);
});</code></pre>
      </div>

      <div class="section">
        <h2>🔗 Array Methods (quan trọng)</h2>
        <pre><code>items.map(x =&gt; x*2);      // transform
items.filter(x =&gt; x&gt;2);   // lọc
items.reduce((a,b)=&gt;a+b); // gộp
items.find(x =&gt; x&gt;3);     // tìm 1
items.some(x =&gt; x&gt;4);     // ít nhất 1
items.every(x =&gt; x&gt;0);    // tất cả
items.flatMap(x =&gt; [x,x*2]); // map + flatten</code></pre>
      </div>

      <div class="section">
        <h2>🌐 Web APIs</h2>
        <div class="grid-2">
          <div class="card"><h4>fetch()</h4><p>HTTP requests Promise-based</p></div>
          <div class="card"><h4>localStorage</h4><p>Persistent key-value</p></div>
          <div class="card"><h4>IntersectionObserver</h4><p>Lazy load, infinite scroll</p></div>
          <div class="card"><h4>WebSocket</h4><p>Real-time bidirectional</p></div>
        </div>
      </div>

      <div class="section">
        <h2>📘 TypeScript cơ bản</h2>
        <pre><code>interface User { id: number; name: string; }
type Status = 'active' | 'inactive';

function identity&lt;T&gt;(arg: T): T { return arg; }

// Utility: Partial&lt;User&gt;, Pick&lt;User,'id'&gt;, Omit&lt;User,'id'&gt;</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'FrontendJavaScriptPage',
  methods: {
    handleNav(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
@import '@legacy/css/variables.css';

.js-page {
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
