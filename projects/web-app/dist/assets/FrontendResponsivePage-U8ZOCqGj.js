import{S as e,_ as t,g as n,l as r,n as i,p as a}from"./index-Cp2Sqq2y.js";import{t as o}from"./navigate-CcK9ConP.js";var s={name:`FrontendResponsivePage`,methods:{handleNav(e){o(e)}}},c={class:`responsive-page`,style:{"--color-accent":`#34d399`}},l={class:`page`},u={class:`topbar`},d={class:`links`};function f(i,o,s,f,p,m){return e(),n(`div`,c,[a(`div`,l,[a(`div`,u,[o[2]||=a(`h1`,null,`📱 Responsive Design`,-1),a(`div`,d,[a(`a`,{href:`#`,onClick:o[0]||=r(e=>m.handleNav(`/frontend/hub`),[`prevent`])},`← Frontend`),a(`a`,{href:`#`,onClick:o[1]||=r(e=>m.handleNav(`/`),[`prevent`])},`Trang chủ`)])]),o[3]||=t(`<p class="desc" data-v-19dd2eda>Media Queries, Container Queries, Mobile-first, Fluid typography, Breakpoint system.</p><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>📐 Breakpoint System</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* Mobile-first: base styles cho mobile, mở rộng dần */
/* 480px+ */  @media (min-width: 480px) { ... }
/* 768px+ */  @media (min-width: 768px) { ... }
/* 1024px+ */ @media (min-width: 1024px) { ... }
/* 1440px+ */ @media (min-width: 1440px) { ... }

/* Hoặc dùng max-width (desktop-first) */
/* &lt;600px */  @media (max-width: 599px) { ... }
/* &lt;900px */  @media (max-width: 899px) { ... }</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>📱 Mobile-first Approach</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* Mobile: 1 cột */
.grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }

/* Tablet: 2 cột */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 4 cột */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>📏 Fluid Typography</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* clamp(min, preferred, max) */
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
p  { font-size: clamp(0.875rem, 2vw, 1.125rem); }

/* Fluid spacing */
section { padding: clamp(1rem, 5vw, 3rem); }</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>🧩 Container Queries</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* Component phản ứng theo container, không phải viewport */
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 200px 1fr; }
}

.parent { container-type: inline-size; container-name: sidebar; }
@container sidebar (min-width: 300px) { ... }</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>🖼️ Responsive Images</h2><pre data-v-19dd2eda><code data-v-19dd2eda>&lt;picture&gt;
  &lt;source srcset=&quot;img-large.webp&quot; media=&quot;(min-width: 1024px)&quot; /&gt;
  &lt;source srcset=&quot;img-small.webp&quot; media=&quot;(min-width: 480px)&quot; /&gt;
  &lt;img src=&quot;img-fallback.jpg&quot; alt=&quot;...&quot; /&gt;
&lt;/picture&gt;

/* Hoặc srcset với width descriptor */
&lt;img srcset=&quot;img-400.jpg 400w, img-800.jpg 800w&quot;
     sizes=&quot;(max-width: 600px) 100vw, 50vw&quot;
     src=&quot;img-800.jpg&quot; /&gt;</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>🖱️ Touch &amp; Pointer</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* Phân biệt touch vs mouse */
@media (pointer: coarse) {
  button { min-height: 48px; }  /* touch: target lớn hơn */
}
@media (hover: hover) {
  .card:hover { transform: translateY(-4px); }  /* chỉ hover khi có mouse */
}</code></pre></div><div class="section" data-v-19dd2eda><h2 data-v-19dd2eda>🔤 Logical Properties (RTL)</h2><pre data-v-19dd2eda><code data-v-19dd2eda>/* Thay vì left/right dùng start/end */
.card { margin-inline: auto; }        /* margin-left + right */
.card { padding-inline: 1rem; }       /* padding-left + right */
.card { border-inline-start: 2px solid; }  /* border-left */

/* Tự động đảo chiều khi dir=&quot;rtl&quot; */</code></pre></div>`,8)])])}var p=i(s,[[`render`,f],[`__scopeId`,`data-v-19dd2eda`]]);export{p as default};