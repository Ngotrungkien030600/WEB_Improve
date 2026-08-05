<template>
  <div class="frameworks-page" style="--color-accent: #22d3ee">
    <div class="page">
      <div class="topbar">
        <h1>⚛️ React / Vue / Angular</h1>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/frontend/hub')">← Frontend</a>
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>
      <p class="desc">So sánh 3 framework phổ biến — component lifecycle, state, routing, ecosystem.</p>

      <div class="section">
        <h2>🔄 So sánh tổng quan</h2>
        <div class="compare">
          <div class="compare-item">
            <h4>⚛️ React</h4>
            <ul>
              <li>Thư viện UI (cần thêm cho full framework)</li>
              <li>JSX: HTML trong JS</li>
              <li>Hooks (useState, useEffect)</li>
              <li>Virtual DOM</li>
              <li>Một chiều data flow</li>
              <li>Ecosystem lớn nhất</li>
            </ul>
          </div>
          <div class="compare-item">
            <h4>💚 Vue</h4>
            <ul>
              <li>Full framework đột biến</li>
              <li>Template + Composition API</li>
              <li>Reactivity Proxy-based</li>
              <li>Directives (v-if, v-for)</li>
              <li>Dễ học nhất</li>
            </ul>
          </div>
          <div class="compare-item">
            <h4>🔵 Angular</h4>
            <ul>
              <li>Full framework có DI</li>
              <li>TypeScript bắt buộc</li>
              <li>RxJS + Signals</li>
              <li>Module/NgModule</li>
              <li>Mạnh cho enterprise</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>⚛️ React Hooks cốt lõi</h2>
        <pre><code>// useState
const [count, setCount] = useState(0);

// useEffect
useEffect(() => {
  fetchData();
  return () => cleanup(); // unmount
}, [deps]);

// useRef
const inputRef = useRef(null);

// useMemo / useCallback
const memo = useMemo(() => compute(a, b), [a, b]);
const cb = useCallback(() => { ... }, [deps]);

// Custom hook
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val]);
  return [val, setVal];
}</code></pre>
      </div>

      <div class="section">
        <h2>💚 Vue Composition API</h2>
        <pre><code>&lt;script setup&gt;
import { ref, computed, watch, onMounted } from 'vue'

const count = ref(0)                       // reactive state
const doubled = computed(() => count.value * 2)
watch(count, (newVal) => console.log(newVal))
onMounted(() => fetchData())

function increment() { count.value++ }
&lt;/script&gt;
&lt;template&gt;
  &lt;button @click="increment"&gt;&#123;&#123; count &#125;&#125; x2 = &#123;&#123; doubled &#125;&#125;&lt;/button&gt;
&lt;/template&gt;</code></pre>
      </div>

      <div class="section">
        <h2>🔵 Angular Signals &amp; RxJS</h2>
        <pre><code>// Signal (Angular 16+)
count = signal(0);
doubled = computed(() => count() * 2);
effect(() => console.log('Count:', count()));

// RxJS Observable
data$ = this.http.get('/api/users');
this.data$.subscribe(data => this.users = data);

// Async pipe in template
// &lt;li *ngFor="let u of users$ | async"&gt;&#123;&#123; u.name &#125;&#125;&lt;/li&gt;</code></pre>
      </div>

      <div class="section">
        <h2>📦 State Management</h2>
        <div class="grid-2">
          <div class="card"><h4>React: Zustand</h4><p><code>create((set) => ({ count, inc: () => set(s => ({count: s.count+1})) }))</code></p></div>
          <div class="card"><h4>React: Redux Toolkit</h4><p><code>createSlice({ name, initialState, reducers })</code></p></div>
          <div class="card"><h4>Vue: Pinia</h4><p><code>defineStore('counter', () => { const count = ref(0); ... })</code></p></div>
          <div class="card"><h4>Angular: NgRx</h4><p><code>createAction, createReducer, Store.select()</code></p></div>
        </div>
      </div>

      <div class="section">
        <h2>🗂️ Routing</h2>
        <pre><code>// React Router
&lt;BrowserRouter&gt;
  &lt;Routes&gt;
    &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
    &lt;Route path="/users/:id" element={&lt;User /&gt;} /&gt;
  &lt;/Routes&gt;
&lt;/BrowserRouter&gt;

// Vue Router
const routes = [{ path: '/', component: Home },
                { path: '/users/:id', component: User }]

// Angular Router
const routes: Routes = [
  { path: '', component: Home },
  { path: 'users/:id', component: User }
]</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'FrontendFrameworksPage',
  methods: {
    handleNav(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */

.frameworks-page {
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
}

pre code {
  background: transparent;
  padding: 0;
}

.compare {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
}

.compare-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--color-radius);
  padding: 1rem;
}

.compare-item h4 {
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.compare-item ul {
  padding-left: 1rem;
}

.compare-item li {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
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
  .compare,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
