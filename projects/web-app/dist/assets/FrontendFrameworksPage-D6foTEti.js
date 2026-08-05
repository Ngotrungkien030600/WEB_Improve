import{f as e,g as t,l as n,n as r,p as i,s as a}from"./index-C-vzxM_u.js";import{t as o}from"./navigate-CE8fDTnR.js";var s={name:`FrontendFrameworksPage`,methods:{handleNav(e){o(e)}}},c={class:`frameworks-page`,style:{"--color-accent":`#22d3ee`}},l={class:`page`},u={class:`topbar`},d={class:`links`};function f(r,o,s,f,p,m){return t(),e(`div`,c,[n(`div`,l,[n(`div`,u,[o[2]||=n(`h1`,null,`⚛️ React / Vue / Angular`,-1),n(`div`,d,[n(`a`,{href:`#`,onClick:o[0]||=a(e=>m.handleNav(`/frontend/hub`),[`prevent`])},`← Frontend`),n(`a`,{href:`#`,onClick:o[1]||=a(e=>m.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),o[3]||=i(`<p class="desc" data-v-b593f73a>So sánh 3 framework phổ biến — component lifecycle, state, routing, ecosystem.</p><div class="section" data-v-b593f73a><h2 data-v-b593f73a>🔄 So sánh tổng quan</h2><div class="compare" data-v-b593f73a><div class="compare-item" data-v-b593f73a><h4 data-v-b593f73a>⚛️ React</h4><ul data-v-b593f73a><li data-v-b593f73a>Thư viện UI (cần thêm cho full framework)</li><li data-v-b593f73a>JSX: HTML trong JS</li><li data-v-b593f73a>Hooks (useState, useEffect)</li><li data-v-b593f73a>Virtual DOM</li><li data-v-b593f73a>Một chiều data flow</li><li data-v-b593f73a>Ecosystem lớn nhất</li></ul></div><div class="compare-item" data-v-b593f73a><h4 data-v-b593f73a>💚 Vue</h4><ul data-v-b593f73a><li data-v-b593f73a>Full framework đột biến</li><li data-v-b593f73a>Template + Composition API</li><li data-v-b593f73a>Reactivity Proxy-based</li><li data-v-b593f73a>Directives (v-if, v-for)</li><li data-v-b593f73a>Dễ học nhất</li></ul></div><div class="compare-item" data-v-b593f73a><h4 data-v-b593f73a>🔵 Angular</h4><ul data-v-b593f73a><li data-v-b593f73a>Full framework có DI</li><li data-v-b593f73a>TypeScript bắt buộc</li><li data-v-b593f73a>RxJS + Signals</li><li data-v-b593f73a>Module/NgModule</li><li data-v-b593f73a>Mạnh cho enterprise</li></ul></div></div></div><div class="section" data-v-b593f73a><h2 data-v-b593f73a>⚛️ React Hooks cốt lõi</h2><pre data-v-b593f73a><code data-v-b593f73a>// useState
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
}</code></pre></div><div class="section" data-v-b593f73a><h2 data-v-b593f73a>💚 Vue Composition API</h2><pre data-v-b593f73a><code data-v-b593f73a>&lt;script setup&gt;
import { ref, computed, watch, onMounted } from &#39;vue&#39;

const count = ref(0)                       // reactive state
const doubled = computed(() =&gt; count.value * 2)
watch(count, (newVal) =&gt; console.log(newVal))
onMounted(() =&gt; fetchData())

function increment() { count.value++ }
&lt;/script&gt;
&lt;template&gt;
  &lt;button @click=&quot;increment&quot;&gt;{{ count }} x2 = {{ doubled }}&lt;/button&gt;
&lt;/template&gt;</code></pre></div><div class="section" data-v-b593f73a><h2 data-v-b593f73a>🔵 Angular Signals &amp; RxJS</h2><pre data-v-b593f73a><code data-v-b593f73a>// Signal (Angular 16+)
count = signal(0);
doubled = computed(() =&gt; count() * 2);
effect(() =&gt; console.log(&#39;Count:&#39;, count()));

// RxJS Observable
data$ = this.http.get(&#39;/api/users&#39;);
this.data$.subscribe(data =&gt; this.users = data);

// Async pipe in template
// &lt;li *ngFor=&quot;let u of users$ | async&quot;&gt;{{ u.name }}&lt;/li&gt;</code></pre></div><div class="section" data-v-b593f73a><h2 data-v-b593f73a>📦 State Management</h2><div class="grid-2" data-v-b593f73a><div class="card" data-v-b593f73a><h4 data-v-b593f73a>React: Zustand</h4><p data-v-b593f73a><code data-v-b593f73a>create((set) =&gt; ({ count, inc: () =&gt; set(s =&gt; ({count: s.count+1})) }))</code></p></div><div class="card" data-v-b593f73a><h4 data-v-b593f73a>React: Redux Toolkit</h4><p data-v-b593f73a><code data-v-b593f73a>createSlice({ name, initialState, reducers })</code></p></div><div class="card" data-v-b593f73a><h4 data-v-b593f73a>Vue: Pinia</h4><p data-v-b593f73a><code data-v-b593f73a>defineStore(&#39;counter&#39;, () =&gt; { const count = ref(0); ... })</code></p></div><div class="card" data-v-b593f73a><h4 data-v-b593f73a>Angular: NgRx</h4><p data-v-b593f73a><code data-v-b593f73a>createAction, createReducer, Store.select()</code></p></div></div></div><div class="section" data-v-b593f73a><h2 data-v-b593f73a>🗂️ Routing</h2><pre data-v-b593f73a><code data-v-b593f73a>// React Router
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
]</code></pre></div>`,7)])])}var p=r(s,[[`render`,f],[`__scopeId`,`data-v-b593f73a`]]);export{p as default};