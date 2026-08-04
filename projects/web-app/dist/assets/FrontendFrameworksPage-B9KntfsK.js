import{f as e,g as t,l as n,n as r,p as i,s as a,w as o}from"./index-Dz1t9-Mx.js";import{t as s}from"./navigate-CpeDEQ7S.js";var c={name:`FrontendFrameworksPage`,methods:{handleNav(e){s(e)}}},l={class:`frameworks-page`,style:{"--color-accent":`#22d3ee`}},u={class:`page`},d={class:`topbar`},f={class:`links`},p={class:`section`},m={class:`section`};function h(r,s,c,h,g,_){return t(),e(`div`,l,[n(`div`,u,[n(`div`,d,[s[2]||=n(`h1`,null,`⚛️ React / Vue / Angular`,-1),n(`div`,f,[n(`a`,{href:`#`,onClick:s[0]||=a(e=>_.handleNav(`/frontend/hub`),[`prevent`])},`← Frontend`),n(`a`,{href:`#`,onClick:s[1]||=a(e=>_.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),s[5]||=i(`<p class="desc" data-v-113abada>So sánh 3 framework phổ biến — component lifecycle, state, routing, ecosystem.</p><div class="section" data-v-113abada><h2 data-v-113abada>🔄 So sánh tổng quan</h2><div class="compare" data-v-113abada><div class="compare-item" data-v-113abada><h4 data-v-113abada>⚛️ React</h4><ul data-v-113abada><li data-v-113abada>Thư viện UI (cần thêm cho full framework)</li><li data-v-113abada>JSX: HTML trong JS</li><li data-v-113abada>Hooks (useState, useEffect)</li><li data-v-113abada>Virtual DOM</li><li data-v-113abada>Một chiều data flow</li><li data-v-113abada>Ecosystem lớn nhất</li></ul></div><div class="compare-item" data-v-113abada><h4 data-v-113abada>💚 Vue</h4><ul data-v-113abada><li data-v-113abada>Full framework đột biến</li><li data-v-113abada>Template + Composition API</li><li data-v-113abada>Reactivity Proxy-based</li><li data-v-113abada>Directives (v-if, v-for)</li><li data-v-113abada>Dễ học nhất</li></ul></div><div class="compare-item" data-v-113abada><h4 data-v-113abada>🔵 Angular</h4><ul data-v-113abada><li data-v-113abada>Full framework có DI</li><li data-v-113abada>TypeScript bắt buộc</li><li data-v-113abada>RxJS + Signals</li><li data-v-113abada>Module/NgModule</li><li data-v-113abada>Mạnh cho enterprise</li></ul></div></div></div><div class="section" data-v-113abada><h2 data-v-113abada>⚛️ React Hooks cốt lõi</h2><pre data-v-113abada><code data-v-113abada>// useState
const [count, setCount] = useState(0);

// useEffect
useEffect(() =&gt; {
  fetchData();
  return () =&gt; cleanup(); // unmount
}, [deps]);

// useRef
const inputRef = useRef(null);

// useMemo / useCallback
const memo = useMemo(() =&gt; compute(a, b), [a, b]);
const cb = useCallback(() =&gt; { ... }, [deps]);

// Custom hook
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() =&gt; {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  });
  useEffect(() =&gt; localStorage.setItem(key, JSON.stringify(val)), [key, val]);
  return [val, setVal];
}</code></pre></div>`,3),n(`div`,p,[s[3]||=n(`h2`,null,`💚 Vue Composition API`,-1),n(`pre`,null,[n(`code`,null,`<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const count = ref(0)                       // reactive state
const doubled = computed(() => count.value * 2)
watch(count, (newVal) => console.log(newVal))
onMounted(() => fetchData())

function increment() { count.value++ }
<\/script>
<template>
  <button @click="increment">`+o(r.count)+` x2 = `+o(r.doubled)+`</button>
</template>`,1)])]),n(`div`,m,[s[4]||=n(`h2`,null,`🔵 Angular Signals & RxJS`,-1),n(`pre`,null,[n(`code`,null,`// Signal (Angular 16+)
count = signal(0);
doubled = computed(() => count() * 2);
effect(() => console.log('Count:', count()));

// RxJS Observable
data$ = this.http.get('/api/users');
this.data$.subscribe(data => this.users = data);

// Async pipe in template
// <li *ngFor="let u of users$ | async">`+o(r.u.name)+`</li>`,1)])]),s[6]||=i(`<div class="section" data-v-113abada><h2 data-v-113abada>📦 State Management</h2><div class="grid-2" data-v-113abada><div class="card" data-v-113abada><h4 data-v-113abada>React: Zustand</h4><p data-v-113abada><code data-v-113abada>create((set) =&gt; ({ count, inc: () =&gt; set(s =&gt; ({count: s.count+1})) }))</code></p></div><div class="card" data-v-113abada><h4 data-v-113abada>React: Redux Toolkit</h4><p data-v-113abada><code data-v-113abada>createSlice({ name, initialState, reducers })</code></p></div><div class="card" data-v-113abada><h4 data-v-113abada>Vue: Pinia</h4><p data-v-113abada><code data-v-113abada>defineStore(&#39;counter&#39;, () =&gt; { const count = ref(0); ... })</code></p></div><div class="card" data-v-113abada><h4 data-v-113abada>Angular: NgRx</h4><p data-v-113abada><code data-v-113abada>createAction, createReducer, Store.select()</code></p></div></div></div><div class="section" data-v-113abada><h2 data-v-113abada>🗂️ Routing</h2><pre data-v-113abada><code data-v-113abada>// React Router
&lt;BrowserRouter&gt;
  &lt;Routes&gt;
    &lt;Route path=&quot;/&quot; element={&lt;Home /&gt;} /&gt;
    &lt;Route path=&quot;/users/:id&quot; element={&lt;User /&gt;} /&gt;
  &lt;/Routes&gt;
&lt;/BrowserRouter&gt;

// Vue Router
const routes = [{ path: &#39;/&#39;, component: Home },
                { path: &#39;/users/:id&#39;, component: User }]

// Angular Router
const routes: Routes = [
  { path: &#39;&#39;, component: Home },
  { path: &#39;users/:id&#39;, component: User }
]</code></pre></div>`,2)])])}var g=r(c,[[`render`,h],[`__scopeId`,`data-v-113abada`]]);export{g as default};