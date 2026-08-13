import{S as e,_ as t,g as n,l as r,n as i,p as a}from"./index-DO2FyL4v.js";import{t as o}from"./navigate-BqqpeOlv.js";var s={name:`FrontendJavaScriptPage`,methods:{handleNav(e){o(e)}}},c={class:`js-page`,style:{"--color-accent":`#f59e0b`}},l={class:`page`},u={class:`topbar`},d={class:`links`};function f(i,o,s,f,p,m){return e(),n(`div`,c,[a(`div`,l,[a(`div`,u,[o[2]||=a(`h1`,null,`⚡ JavaScript`,-1),a(`div`,d,[a(`a`,{href:`#`,onClick:o[0]||=r(e=>m.handleNav(`/frontend/hub`),[`prevent`])},`← Frontend`),a(`a`,{href:`#`,onClick:o[1]||=r(e=>m.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),o[3]||=t(`<p class="desc" data-v-eeaf1192>ES6+, DOM, Async/Await, Closure, Promise, Event Loop, Web API, TypeScript cơ bản.</p><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>📦 ES6+ Features</h2><pre data-v-eeaf1192><code data-v-eeaf1192>const add = (a, b) =&gt; a + b;                     // Arrow
const { name, age } = person;                     // Destructuring
const clone = { ...obj, key: &#39;val&#39; };             // Spread
const zip = user?.address?.zip ?? &#39;N/A&#39;;          // Optional chaining &amp; nullish</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>🧠 Closure &amp; Scope</h2><pre data-v-eeaf1192><code data-v-eeaf1192>function createCounter() {
  let count = 0;
  return () =&gt; ++count;  // closure: inner function giữ reference đến count
}
const c = createCounter();
c(); // 1, c(); // 2</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>⏳ Promise &amp; Async/Await</h2><pre data-v-eeaf1192><code data-v-eeaf1192>async function loadData() {
  try {
    const res = await fetch(&#39;/api/data&#39;);
    return await res.json();
  } catch (err) { console.error(err); }
}
// Promise.all: chạy song song
const [users, posts] = await Promise.all([
  fetch(&#39;/api/users&#39;).then(r=&gt;r.json()),
  fetch(&#39;/api/posts&#39;).then(r=&gt;r.json())
]);</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>🔄 Event Loop</h2><pre data-v-eeaf1192><code data-v-eeaf1192>console.log(&#39;1&#39;);
setTimeout(() =&gt; console.log(&#39;2&#39;), 0);          // macrotask
Promise.resolve().then(() =&gt; console.log(&#39;3&#39;));  // microtask
console.log(&#39;4&#39;);
// Output: 1, 4, 3, 2</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>🏗️ DOM &amp; Events</h2><pre data-v-eeaf1192><code data-v-eeaf1192>const el = document.querySelector(&#39;.class&#39;);
el.textContent = &#39;Hello&#39;;
el.classList.add(&#39;active&#39;);
el.addEventListener(&#39;click&#39;, (e) =&gt; { /* e.target */ });

// Event delegation
parent.addEventListener(&#39;click&#39;, (e) =&gt; {
  if (e.target.matches(&#39;li&#39;)) handle(e.target);
});</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>🔗 Array Methods (quan trọng)</h2><pre data-v-eeaf1192><code data-v-eeaf1192>items.map(x =&gt; x*2);      // transform
items.filter(x =&gt; x&gt;2);   // lọc
items.reduce((a,b)=&gt;a+b); // gộp
items.find(x =&gt; x&gt;3);     // tìm 1
items.some(x =&gt; x&gt;4);     // ít nhất 1
items.every(x =&gt; x&gt;0);    // tất cả
items.flatMap(x =&gt; [x,x*2]); // map + flatten</code></pre></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>🌐 Web APIs</h2><div class="grid-2" data-v-eeaf1192><div class="card" data-v-eeaf1192><h4 data-v-eeaf1192>fetch()</h4><p data-v-eeaf1192>HTTP requests Promise-based</p></div><div class="card" data-v-eeaf1192><h4 data-v-eeaf1192>localStorage</h4><p data-v-eeaf1192>Persistent key-value</p></div><div class="card" data-v-eeaf1192><h4 data-v-eeaf1192>IntersectionObserver</h4><p data-v-eeaf1192>Lazy load, infinite scroll</p></div><div class="card" data-v-eeaf1192><h4 data-v-eeaf1192>WebSocket</h4><p data-v-eeaf1192>Real-time bidirectional</p></div></div></div><div class="section" data-v-eeaf1192><h2 data-v-eeaf1192>📘 TypeScript cơ bản</h2><pre data-v-eeaf1192><code data-v-eeaf1192>interface User { id: number; name: string; }
type Status = &#39;active&#39; | &#39;inactive&#39;;

function identity&lt;T&gt;(arg: T): T { return arg; }

// Utility: Partial&lt;User&gt;, Pick&lt;User,&#39;id&#39;&gt;, Omit&lt;User,&#39;id&#39;&gt;</code></pre></div>`,9)])])}var p=i(s,[[`render`,f],[`__scopeId`,`data-v-eeaf1192`]]);export{p as default};