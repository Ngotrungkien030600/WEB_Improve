export const UI_INTERVIEW_TIERS = [
  {
    id: 'junior',
    emoji: '🌱',
    label: 'Junior',
    range: '0–2 năm',
    color: '#34d399',
    hint: 'Nền tảng HTML, CSS, JavaScript — người phỏng vấn kiểm tra bạn có hiểu bản chất không.',
  },
  {
    id: 'middle',
    emoji: '📈',
    label: 'Middle',
    range: '2–5 năm',
    color: '#f59e0b',
    hint: 'Đào sâu framework, hiệu năng, bất đồng bộ và chất lượng code.',
  },
  {
    id: 'senior',
    emoji: '🎯',
    label: 'Senior',
    range: '5+ năm',
    color: '#f472b6',
    hint: 'Kiến trúc, tối ưu, bảo mật và khả năng ra quyết định kỹ thuật.',
  },
];

export const UI_INTERVIEW_QUESTIONS = {
  junior: [
    {
      topic: 'HTML',
      q: 'Sự khác nhau giữa div và span?',
      a: [
        '- `div` là phần tử **block**: mặc định chiếm hết chiều ngang, xuống dòng.',
        '- `span` là phần tử **inline**: nằm cùng dòng, chỉ rộng bằng nội dung.',
        '- Dùng `div` để nhóm khối lớn, `span` để bọc một đoạn chữ trong câu.',
        '```\n<div>Khối</div> tiếp tục ở dòng mới\n<p>Chữ <span>được tô màu</span> cùng dòng</p>\n```',
      ].join('\n'),
    },
    {
      topic: 'HTML',
      q: 'Thẻ semantic là gì? Kể tên 5 thẻ.',
      a: [
        '- Là thẻ nói rõ **ý nghĩa** của vùng nội dung, không chỉ để hiển thị.',
        '- Lợi ích: tốt cho SEO, trình đọc màn hình hiểu cấu trúc, code dễ đọc.',
        '- 5 thẻ hay dùng: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`.',
        '- Thay `<div class="header">` bằng `<header>`; mỗi trang chỉ nên có **một** `main`.',
      ].join('\n'),
    },
    {
      topic: 'HTML',
      q: 'Block, inline và inline-block khác nhau thế nào?',
      a: [
        '- `block`: xuống dòng, nhận `width`/`height`, padding và margin đủ 4 phía.',
        '- `inline`: không xuống dòng, **không** nhận `width`/`height`, margin ngang mới ăn.',
        '- `inline-block`: nằm cùng dòng nhưng nhận `width`/`height` như block.',
        '- Muốn xếp hộp cùng dòng mà chỉnh kích thước → `inline-block` hoặc `flex`.',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Box model gồm những gì?',
      a: [
        '- Từ trong ra ngoài: `content` → `padding` → `border` → `margin`.',
        '- Mặc định `box-sizing: content-box`: `width` chỉ tính phần content.',
        '- Đặt `box-sizing: border-box` thì `width` bao gồm cả padding + border — layout dễ tính hơn.',
        '```\n* { box-sizing: border-box; }\n.card { width: 300px; padding: 16px; border: 1px solid; } /* vẫn đúng 300px */\n```',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Phân biệt class và id?',
      a: [
        '- `class` dùng lại được nhiều lần, `id` chỉ nên xuất hiện **một lần** trên trang.',
        '- Độ ưu tiên: `id` (0,1,0,0) cao hơn `class` (0,0,1,0).',
        '- Nên style bằng class; để `id` cho neo liên kết và nhãn form (`label for`).',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Flexbox: justify-content khác align-items thế nào?',
      a: [
        '- `justify-content`: căn theo **trục chính** (`flex-direction`).',
        '- `align-items`: căn theo **trục phụ**, vuông góc trục chính.',
        '- Mặc định `flex-direction: row` → trục chính là ngang, trục phụ là dọc.',
        '- Đặt `flex-direction: column` thì hai trục đổi vai cho nhau.',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Làm sao để căn giữa một div?',
      a: [
        '- Flexbox (khuyên dùng): `display: flex; justify-content: center; align-items: center;`',
        '- Grid gọn nhất: `display: grid; place-items: center;`',
        '- Căn giữa ngang cho khối có `width`: `margin: 0 auto;`',
        '- Cách cũ: `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);`',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'position có những giá trị nào?',
      a: [
        '- `static`: mặc định, theo luồng tài liệu.',
        '- `relative`: lệch so với vị trí gốc, **vẫn giữ chỗ** trong luồng.',
        '- `absolute`: lệch theo tổ tiên gần nhất có `position` khác `static`, **bỏ khỏi luồng**.',
        '- `fixed`: neo theo cửa sổ trình duyệt, không trôi khi cuộn.',
        '- `sticky`: bình thường cho tới ngưỡng thì dính lại (thanh tiêu đề).',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: '`==` và `===` khác nhau thế nào?',
      a: [
        '- `==` so sánh sau khi **ép kiểu** (type coercion): `1 == "1"` là `true`.',
        '- `===` so sánh cả giá trị **và** kiểu: `1 === "1"` là `false`.',
        '- Luôn dùng `===` để tránh bug ngầm; chỉ dùng `== null` khi muốn bắt cả `null` lẫn `undefined`.',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'let, const, var khác nhau thế nào?',
      a: [
        '- `var`: phạm vi **function**, bị hoisting và nhận `undefined` trước khi khai báo.',
        '- `let`: phạm vi **block**, không dùng được trước khi khai báo (temporal dead zone).',
        '- `const`: như `let` nhưng không gán lại được (nội dung object/array vẫn sửa được).',
        '- Thực tế: mặc định dùng `const`, chỉ đổi sang `let` khi cần gán lại.',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'Event bubbling và event delegation là gì?',
      a: [
        '- Bubbling: sự kiện nổi từ phần tử con lên các phần tử cha.',
        '- `event.target` là nơi phát sinh, `event.currentTarget` là nơi đang xử lý.',
        '- Delegation: gắn **một** listener ở cha, dựa vào `event.target` để biết con nào được bấm.',
        '- Lợi ích: ít listener, hoạt động cả với phần tử thêm sau này.',
        '```\nlist.addEventListener("click", (e) => {\n  const item = e.target.closest(".item");\n  if (item) select(item.dataset.id);\n});\n```',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: '`this` trong JavaScript hoạt động thế nào?',
      a: [
        '- Phụ thuộc **cách hàm được gọi**, không phải nơi khai báo.',
        '- Gọi thường: `this` là `undefined` (strict mode) hoặc object toàn cục.',
        '- Gọi qua object: `obj.method()` → `this` là `obj`.',
        '- Hàm mũi tên **không** có `this` riêng, lấy `this` từ phạm vi bao ngoài.',
      ].join('\n'),
    },
  ],
  middle: [
    {
      topic: 'React',
      q: 'useEffect dependency array hoạt động thế nào?',
      a: [
        '- Không truyền mảng: chạy sau **mọi** lần render.',
        '- Mảng rỗng `[]`: chạy một lần sau mount, cleanup khi unmount.',
        '- `[deps]`: chạy lại khi một giá trị trong mảng thay đổi (so sánh `Object.is`).',
        '- Cleanup chạy trước lần chạy kế tiếp — dùng để hủy timer, hủy subscribe.',
        '```\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);\n```',
      ].join('\n'),
    },
    {
      topic: 'React',
      q: 'Virtual DOM là gì và vì sao cần key?',
      a: [
        '- Virtual DOM là cây object JS mô tả UI; React so sánh (diff) rồi cập nhật DOM thật tối thiểu.',
        '- `key` giúp React nhận diện phần tử nào là phần tử nào giữa hai lần render.',
        '- Dùng `index` làm key dễ sai khi danh sách chèn/xóa/đổi thứ tự → state bị gán nhầm.',
        '- Key nên là id ổn định của dữ liệu.',
      ].join('\n'),
    },
    {
      topic: 'React',
      q: 'useCallback và useMemo khác nhau thế nào?',
      a: [
        '- `useMemo` ghi nhớ **giá trị** trả về; `useCallback` ghi nhớ **hàm**.',
        '- `useCallback(fn, deps)` tương đương `useMemo(() => fn, deps)`.',
        '- Chỉ dùng khi thật cần: truyền xuống component đã `memo`, hoặc tính toán nặng.',
        '- Lạm dụng làm code khó đọc mà lợi ích không đáng.',
      ].join('\n'),
    },
    {
      topic: 'React',
      q: 'Controlled và uncontrolled component khác nhau thế nào?',
      a: [
        '- Controlled: giá trị nằm trong state React, mọi thay đổi đi qua `onChange`.',
        '- Uncontrolled: giá trị nằm trong DOM, đọc bằng `ref` khi cần.',
        '- Form đơn giản, chỉ đọc lúc submit → uncontrolled gọn hơn (dùng `FormData`).',
        '- Cần validate ngay, disable nút, format khi gõ → controlled.',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'CSS specificity tính thế nào?',
      a: [
        '- Thứ tự ưu tiên: `!important` > inline style > `id` > `class`/attribute/pseudo-class > thẻ.',
        '- Ghi dạng bộ ba (id, class, element): `.card .title` = (0,2,0) > `.title` = (0,1,0).',
        '- Hai selector bằng điểm thì selector **khai báo sau** thắng.',
        '- Cách tránh đau đầu: giữ selector ngắn, dùng class, hạn chế `!important`.',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Khi nào dùng Grid, khi nào dùng Flexbox?',
      a: [
        '- Flexbox: bố cục **một chiều** — hàng nút, thanh điều hướng, căn giữa nội dung.',
        '- Grid: bố cục **hai chiều** — layout trang, lưới thẻ, vùng có hàng và cột rõ ràng.',
        '- Kết hợp tốt: Grid dựng khung trang, Flexbox xử lý bên trong từng ô.',
        '```\n.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }\n```',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'Closure là gì? Cho ví dụ.',
      a: [
        '- Closure là hàm **nhớ phạm vi** nơi nó được tạo, kể cả sau khi hàm ngoài đã chạy xong.',
        '- Dùng để tạo biến riêng tư, cache, hoặc factory function.',
        '```\nfunction createCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = createCounter();\nnext(); // 1\n```',
        '- Lưu ý: biến được giữ trong bộ nhớ, vòng lặp với `var` dễ dính bug closure.',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'Event loop xử lý microtask và macrotask thế nào?',
      a: [
        '- Call stack chạy hết code đồng bộ → mới lấy việc trong hàng đợi ra chạy.',
        '- Microtask: `Promise.then`, `queueMicrotask`, `MutationObserver`.',
        '- Macrotask: `setTimeout`, `setInterval`, sự kiện, `requestAnimationFrame` (khung vẽ).',
        '- Sau mỗi macrotask, **toàn bộ** microtask được xử lý hết trước khi sang macrotask kế.',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'Promise.all, allSettled, race khác nhau thế nào?',
      a: [
        '- `Promise.all`: chờ tất cả, **reject ngay** nếu một cái lỗi.',
        '- `Promise.allSettled`: chờ tất cả, luôn trả về mảng `{status, value|reason}`.',
        '- `Promise.race`: lấy kết quả của cái **xong trước** (kể cả lỗi).',
        '- `Promise.any`: lấy cái **thành công** đầu tiên, lỗi hết mới reject.',
      ].join('\n'),
    },
    {
      topic: 'JavaScript',
      q: 'Viết hàm debounce, phân biệt với throttle.',
      a: [
        '- Debounce: chỉ chạy **sau khi** ngừng kích hoạt một khoảng (ô tìm kiếm).',
        '- Throttle: chạy **tối đa một lần** trong mỗi khoảng (sự kiện cuộn, kéo thả).',
        '```\nfunction debounce(fn, wait = 300) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}\n```',
        '- Cả hai đều dùng để giảm số lần gọi hàm, chọn theo nhu cầu trải nghiệm.',
      ].join('\n'),
    },
    {
      topic: 'Accessibility',
      q: 'Làm sao để một trang web dễ tiếp cận?',
      a: [
        '- Dùng HTML semantic trước, chỉ thêm ARIA khi thật cần.',
        '- Ảnh có `alt`, nút/link có nhãn rõ, form có `label` gắn với `input`.',
        '- Điều hướng được hoàn toàn bằng bàn phím, có `:focus-visible` rõ ràng.',
        '- Tương phản chữ/nền tối thiểu 4.5:1; thứ tự tiêu đề `h1 → h2 → h3` không nhảy cấp.',
      ].join('\n'),
    },
    {
      topic: 'Hiệu năng',
      q: 'Reflow và repaint khác nhau thế nào? Tránh layout thrashing ra sao?',
      a: [
        '- Repaint: vẽ lại màu/nền, không đổi bố cục — rẻ hơn.',
        '- Reflow (layout): tính lại vị trí, kích thước — đắt hơn nhiều.',
        '- Layout thrashing: đọc thuộc tính layout (`offsetHeight`) rồi ghi style xen kẽ trong vòng lặp.',
        '- Cách tránh: gom việc đọc trước, ghi sau; đổi bằng `transform`/`opacity` để chỉ composite.',
      ].join('\n'),
    },
  ],
  senior: [
    {
      topic: 'Kiến trúc',
      q: 'Micro-frontend là gì? Lợi ích và thách thức?',
      a: [
        '- Chia ứng dụng FE thành các phần độc lập, mỗi team sở hữu và deploy riêng.',
        '- Lợi ích: team tự chủ, release độc lập, công nghệ linh hoạt theo phần.',
        '- Thách thức: chia sẻ dependency, đồng bộ routing, style xung đột, tăng kích thước tải.',
        '- Thường dùng Module Federation, Web Components, hoặc iframe (ít khuyến khích).',
        '- Chỉ nên dùng khi tổ chức đủ lớn; với một team nhỏ, monolith module hóa thường tốt hơn.',
      ].join('\n'),
    },
    {
      topic: 'Hiệu năng',
      q: 'Tối ưu Core Web Vitals như thế nào?',
      a: [
        '- LCP (tải nội dung chính): ảnh đúng kích thước, `fetchpriority="high"`, preload font, ít render-blocking.',
        '- INP (phản hồi tương tác): chia nhỏ JS, giảm việc nặng trong sự kiện, dùng `startTransition`.',
        '- CLS (nhảy bố cục): luôn đặt `width`/`height` cho ảnh, chừa chỗ cho quảng cáo, tránh chèn nội dung trên đầu.',
        '- Đo trước bằng Lighthouse/Web Vitals trường thực (RUM), rồi mới tối ưu chỗ tốn kém nhất.',
      ].join('\n'),
    },
    {
      topic: 'Hiệu năng',
      q: 'Giảm kích thước bundle bằng cách nào?',
      a: [
        '- Code splitting theo route và theo component nặng; lazy load phần dưới màn hình.',
        '- Tree shaking: chỉ import thứ cần, tránh import cả thư viện lớn.',
        '- Kiểm tra bằng bundle analyzer để tìm dependency phình to.',
        '- Nén Brotli, cache theo hash tên file, vài thư viện nhỏ nên tự viết hoặc thay bằng bản nhẹ.',
      ].join('\n'),
    },
    {
      topic: 'React',
      q: 'Khi nào dùng useRef thay vì useState? Giảm re-render thế nào?',
      a: [
        '- `useRef` giữ giá trị **qua các lần render mà không gây render lại**; `useState` thì có.',
        '- Dùng `useRef` cho tham chiếu DOM, id của timer, giá trị trước đó.',
        '- Giảm re-render: tách state xuống component con, `memo` cho component nặng, ổn định props bằng `useCallback`.',
        '- Đo bằng React DevTools Profiler trước khi tối ưu, tránh memo hóa tràn lan.',
      ].join('\n'),
    },
    {
      topic: 'State',
      q: 'Client state và server state khác nhau? Quản lý thế nào?',
      a: [
        '- Client state: trạng thái UI (theme, modal, filter) — thuộc về trình duyệt.',
        '- Server state: dữ liệu từ API — có thể cũ, cần cache, refetch, đồng bộ.',
        '- Server state nên dùng React Query/SWR: cache, retry, invalidate, optimistic update.',
        '- Tránh nhét dữ liệu server vào store toàn cục rồi tự viết loading/error bằng tay.',
      ].join('\n'),
    },
    {
      topic: 'CSS',
      q: 'Container Queries khác Media Queries thế nào?',
      a: [
        '- Media query phản ứng theo **viewport**; container query theo **kích thước khung chứa**.',
        '- Nhờ đó component tự thích ứng dù đặt ở sidebar hay vùng rộng.',
        '- Cần khai báo `container-type: inline-size` cho phần tử cha.',
        '```\n.card-wrap { container-type: inline-size; }\n@container (min-width: 420px) { .card { grid-template-columns: 120px 1fr; } }\n```',
      ].join('\n'),
    },
    {
      topic: 'Kiểm thử',
      q: 'Chiến lược kiểm thử cho frontend nên như thế nào?',
      a: [
        '- Nhiều unit test cho logic thuần, integration test cho luồng người dùng.',
        '- E2E chỉ giữ cho luồng quan trọng nhất (đăng nhập, thanh toán) để tránh chậm và chập chờn.',
        '- Test theo hành vi người dùng, không theo chi tiết cài đặt (tránh vỡ test khi refactor).',
        '- E2E chập chờn thường do chờ cứng `sleep`; hãy chờ theo điều kiện (`waitFor`, `toBeVisible`).',
      ].join('\n'),
    },
    {
      topic: 'Bảo mật',
      q: 'XSS và CSRF là gì? Phòng tránh thế nào?',
      a: [
        '- XSS: chèn script độc vào trang. Phòng: escape output, không dùng `innerHTML` với dữ liệu người dùng, CSP chặt.',
        '- CSRF: lừa trình duyệt gửi request kèm cookie hợp lệ. Phòng: CSRF token, `SameSite=Lax/Strict`, kiểm tra `Origin`.',
        '- Token phiên nên để trong cookie `HttpOnly` + `Secure`, không để trong localStorage.',
        '- Với nội dung người dùng nhập, sanitize bằng thư viện đã kiểm chứng (DOMPurify).',
      ].join('\n'),
    },
    {
      topic: 'Build',
      q: 'Vite và Webpack khác nhau? Vì sao Vite khởi động nhanh?',
      a: [
        '- Vite dev phục vụ ES module gốc, không bundle toàn bộ trước khi chạy; Webpack bundle rồi mới serve.',
        '- Vite pre-bundle dependency bằng esbuild (Go) nên nhanh hơn nhiều.',
        '- HMR của Vite chỉ cập nhật module thay đổi, không build lại cả cây.',
        '- Khi build production, Vite dùng Rollup để tối ưu; Webpack mạnh về hệ sinh thái plugin cũ.',
      ].join('\n'),
    },
    {
      topic: 'Mẫu thiết kế',
      q: 'Design pattern nào hay dùng ở frontend?',
      a: [
        '- Singleton: một instance dùng chung (client API, store).',
        '- Observer: event bus, subscription cho state.',
        '- Factory: hàm tạo component/config theo tham số.',
        '- Strategy: đổi thuật toán lúc chạy (nhiều cách sort/filter).',
        '- HOC/HOF: bọc thêm hành vi (logging, phân quyền) mà không sửa component gốc.',
      ].join('\n'),
    },
    {
      topic: 'System design',
      q: 'Thiết kế ứng dụng cộng tác thời gian thực (như Google Docs) ra sao?',
      a: [
        '- Kết nối hai chiều: WebSocket (hoặc WebRTC cho P2P).',
        '- Đồng bộ nội dung: CRDT (Yjs, Automerge) hoặc OT — CRDT hợp cho offline-first.',
        '- Cần xử lý: thứ tự sự kiện, khôi phục sau mất kết nối, hiển thị con trỏ từng người.',
        '- Lưu trữ: snapshot định kỳ + log thao tác; phân quyền theo tài liệu.',
        '- Đánh đổi chính: độ phức tạp đồng bộ so với trải nghiệm mượt mà.',
      ].join('\n'),
    },
    {
      topic: 'Design system',
      q: 'Xây dựng design system cho nhiều team như thế nào?',
      a: [
        '- Bắt đầu từ token: màu, khoảng cách, cỡ chữ, bo góc, bóng — một nguồn sự thật duy nhất.',
        '- Component API ổn định, có tài liệu và ví dụ chạy được (Storybook).',
        '- Phát hành theo phiên bản ngữ nghĩa, có ghi chú thay đổi khi phá vỡ tương thích.',
        '- Đo mức dùng thật: component nào được dùng, chỗ nào team còn tự viết lại.',
        '- Không tham lam: chỉ chuẩn hóa thứ lặp lại nhiều, để phần đặc thù cho từng team.',
      ].join('\n'),
    },
  ],
};
