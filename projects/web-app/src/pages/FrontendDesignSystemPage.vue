<template>
  <div class="design-system-page" style="--forge-accent: #a78bfa">
    <div class="page-shell">
      <CTopbar
        title="🎨 Design System — thiết kế & triển khai"
        back-label="← Frontend"
        back-path="/frontend/hub"
        @go-home="handleNavigate('/frontend/hub')"
      />

      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">FRONTEND ENGINEERING · UI PLATFORM</div>
          <h1>Thiết kế một hệ thống giao diện có thể phát triển lâu dài.</h1>
          <p>Học cách biến quyết định thiết kế thành token, component, pattern, tài liệu và quy trình kiểm soát thay đổi — để nhiều người có thể xây sản phẩm nhất quán mà không copy-paste UI.</p>
          <div class="hero-actions">
            <a href="#learning-map" class="primary-link">Bắt đầu lộ trình <span>↓</span></a>
            <a href="#capstone" class="secondary-link">Xem project thực hành</a>
          </div>
        </div>
        <div class="hero-art" aria-label="Các lớp của một design system">
          <div class="stack-label">PRODUCT UI PLATFORM</div>
          <div class="stack-layer layer-app"><span>Ứng dụng sản phẩm</span><b>Web · Mobile · Admin</b></div>
          <div class="stack-layer layer-pattern"><span>Patterns</span><b>Checkout · Search · Data table</b></div>
          <div class="stack-layer layer-component"><span>Components</span><b>Button · Input · Dialog</b></div>
          <div class="stack-layer layer-token"><span>Tokens</span><b>Color · Type · Space · Motion</b></div>
          <div class="stack-foundation">Accessibility · Naming · Governance</div>
        </div>
      </section>

      <div class="page-layout">
        <aside class="toc" aria-label="Mục lục Design System">
          <div class="toc-title">TRONG BÀI HỌC</div>
          <a href="#definition">01 · Design System là gì</a>
          <a href="#learning-map">02 · Lộ trình học</a>
          <a href="#tokens">03 · Design tokens</a>
          <a href="#components">04 · Component API</a>
          <a href="#accessibility">05 · Accessibility</a>
          <a href="#documentation">06 · Docs & testing</a>
          <a href="#governance">07 · Governance</a>
          <a href="#capstone">08 · Project thực hành</a>
        </aside>

        <main class="lesson-content">
          <section id="definition" class="lesson-section">
            <div class="section-kicker">01 · NỀN TẢNG</div>
            <h2>Design System là gì?</h2>
            <p class="lead">Design System là hệ thống dùng chung để một tổ chức thiết kế, xây dựng, kiểm thử và duy trì trải nghiệm sản phẩm. Nó nối <strong>ngôn ngữ thiết kế</strong> với <strong>code chạy thật</strong>.</p>
            <div class="definition-grid">
              <article class="definition-card"><span class="definition-icon">🎛️</span><h3>Quyết định thiết kế</h3><p>Màu sắc, typography, spacing, elevation, motion, grid, icon và nguyên tắc sử dụng.</p></article>
              <article class="definition-card"><span class="definition-icon">🧩</span><h3>UI implementation</h3><p>Tokens, component API, trạng thái, accessibility, responsive behavior và cách kết hợp component.</p></article>
              <article class="definition-card"><span class="definition-icon">📚</span><h3>Cách làm việc chung</h3><p>Tài liệu, ví dụ, ownership, quy trình đề xuất thay đổi, review và phát hành phiên bản.</p></article>
            </div>
            <div class="callout"><strong>Phân biệt:</strong> UI Kit chủ yếu là tập asset/component. Style guide mô tả cách dùng hình ảnh và phong cách. Component library là phần code tái sử dụng. Design System bao gồm các phần đó cùng quy tắc, tài liệu, kiểm thử và cách quản trị.</div>
            <h3 class="subheading">Khi nào một nhóm cần Design System?</h3>
            <ul class="check-list">
              <li>Nhiều màn hình lặp lại cùng pattern: form, bảng, filter, dialog, navigation.</li>
              <li>Nhiều team làm các sản phẩm liên quan và UI bắt đầu lệch nhau.</li>
              <li>Thay đổi brand/accessibility mất công sửa thủ công nhiều nơi.</li>
              <li>Component bị copy riêng từng dự án, không rõ bản nào là đúng và ai bảo trì.</li>
            </ul>
          </section>

          <section id="learning-map" class="lesson-section">
            <div class="section-kicker">02 · LỘ TRÌNH</div>
            <h2>Học theo thứ tự nào để tự thiết kế được?</h2>
            <p class="section-intro">Đừng bắt đầu bằng viết thật nhiều component. Trước hết phải hiểu sản phẩm, đặt quy tắc, rồi mới mã hóa và kiểm soát chất lượng.</p>
            <div class="roadmap">
              <article><span class="roadmap-number">01</span><div><h3>Audit sản phẩm & người dùng</h3><p>Thu thập màn hình hiện tại, nhóm người dùng, nền tảng, yêu cầu thương hiệu và ràng buộc kỹ thuật. Gom UI giống nhau, ghi nhận điểm đang mâu thuẫn.</p><span class="deliverable">Đầu ra: inventory màn hình + danh sách vấn đề</span></div></article>
              <article><span class="roadmap-number">02</span><div><h3>Định nghĩa principle và visual foundation</h3><p>Thống nhất các nguyên tắc như rõ ràng, predictable, accessible; xác định color roles, typography scale, spacing scale, radius, elevation, breakpoints.</p><span class="deliverable">Đầu ra: foundation sheet + token proposal</span></div></article>
              <article><span class="roadmap-number">03</span><div><h3>Thiết kế token architecture</h3><p>Tách giá trị gốc khỏi ý nghĩa sử dụng. Đặt tên theo vai trò, tạo theme và kiểm tra contrast trước khi sinh CSS variables.</p><span class="deliverable">Đầu ra: token source + theme mapping</span></div></article>
              <article><span class="roadmap-number">04</span><div><h3>Chọn component theo tần suất và rủi ro</h3><p>Bắt đầu với Button, TextField, Select, Checkbox, Badge, Dialog và Table. Mỗi component có contract, variants, states, responsive behavior.</p><span class="deliverable">Đầu ra: component library nhỏ nhưng dùng được</span></div></article>
              <article><span class="roadmap-number">05</span><div><h3>Viết stories, docs và test</h3><p>Hiển thị từng trạng thái độc lập, hướng dẫn khi nào dùng/không dùng, test interaction, keyboard, responsive và visual regression.</p><span class="deliverable">Đầu ra: catalog tra cứu được</span></div></article>
              <article><span class="roadmap-number">06</span><div><h3>Áp dụng vào một luồng thật, rồi quản trị</h3><p>Thay component cũ theo từng màn hình, đo adoption và bug; review đề xuất, phân loại breaking change và phát hành có version.</p><span class="deliverable">Đầu ra: migration plan + contribution workflow</span></div></article>
            </div>
          </section>

          <section id="tokens" class="lesson-section">
            <div class="section-kicker">03 · DESIGN TOKENS</div>
            <h2>Tokens: nguồn gốc của giao diện nhất quán</h2>
            <p class="section-intro">Token là tên có ý nghĩa cho một quyết định thiết kế. Thay vì để mỗi component tự dùng màu <code>#5B5CE2</code>, component dùng token <code>color.action.primary</code>.</p>
            <div class="token-levels">
              <article><span class="level-tag">01 · Primitive</span><h3>Giá trị gốc</h3><p><code>blue.600</code>, <code>space.4</code>, <code>radius.md</code>. Đây là palette/scale; app không nên tham chiếu tràn lan vào các token này.</p></article>
              <div class="level-arrow">→</div>
              <article><span class="level-tag semantic">02 · Semantic</span><h3>Ý nghĩa trong sản phẩm</h3><p><code>text.primary</code>, <code>surface.canvas</code>, <code>action.primary</code>, <code>border.danger</code>. Theme có thể ánh xạ ý nghĩa sang giá trị khác.</p></article>
              <div class="level-arrow">→</div>
              <article><span class="level-tag component">03 · Component (khi cần)</span><h3>Vai trò cục bộ</h3><p><code>button.primary.bg</code>. Chỉ thêm khi component có nhu cầu riêng như nhiều theme/brand; tránh tạo token cho mọi CSS property.</p></article>
            </div>
            <div class="token-playground">
              <div><span class="demo-label">THỬ TOKEN THEME</span><h3>Đổi semantic token, các control cùng đổi</h3><p>Giá trị demo điều khiển <code>--color-action-primary</code>, không cần sửa từng button.</p></div>
              <div class="token-controls"><label for="accent-picker">Primary color</label><input id="accent-picker" type="color" v-model="accentColor" /><button class="demo-button">Save changes</button><button class="demo-button secondary">Cancel</button></div>
            </div>
            <h3 class="subheading">Ví dụ triển khai CSS variables</h3>
            <CodeBlock :code="tokenCss" language="CSS" />
            <h3 class="subheading">Cấu trúc thư mục có thể bắt đầu như sau</h3>
            <p>Một team nhỏ có thể để Design System cùng repo ứng dụng trước. Tách thành package riêng khi nhiều app thực sự cần version và release độc lập.</p>
            <CodeBlock :code="repoTree" language="PROJECT STRUCTURE" />
            <div class="two-column-notes">
              <div><h3>Naming nên như thế nào?</h3><p><code>color.text.muted</code> thể hiện role. <code>gray.500</code> thể hiện hue/value. Tránh tên theo màn hình như <code>dashboard-title-blue</code> vì khó tái sử dụng.</p></div>
              <div><h3>Một nguồn chuẩn (source of truth)</h3><p>Quyết định rõ token được sửa ở đâu: Figma, JSON hay code. Có thể generate qua các nền tảng, nhưng phải có validate và review để tránh design/code drift.</p></div>
            </div>
            <p class="reference-line">Nếu cần trao đổi token giữa công cụ, tham khảo <a href="https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/" target="_blank" rel="noopener noreferrer">Design Tokens Format Module của W3C Design Tokens Community Group</a>. Format trao đổi không thay thế quy tắc đặt tên và governance của team.</p>
          </section>

          <section id="components" class="lesson-section">
            <div class="section-kicker">04 · COMPONENT ENGINEERING</div>
            <h2>Thiết kế component bằng contract, không chỉ bằng CSS</h2>
            <p class="section-intro">Một component dùng chung cần trả lời: nó giải quyết việc gì, input nào hợp lệ, state nào có thể xuất hiện, hành vi keyboard ra sao và team thay đổi nó thế nào?</p>
            <div class="contract-grid">
              <div><b>Purpose</b><span>Trách nhiệm rõ, một mục đích chính</span></div>
              <div><b>API</b><span>Props, events, slots có tên nhất quán</span></div>
              <div><b>States</b><span>Default, hover, focus, disabled, loading, error</span></div>
              <div><b>Semantics</b><span>Native HTML, label, keyboard, ARIA cần thiết</span></div>
              <div><b>Responsive</b><span>Co giãn, wrap, overflow và touch target</span></div>
              <div><b>Compatibility</b><span>Deprecation, migration và versioning</span></div>
            </div>
            <h3 class="subheading">Ví dụ Button component cho Vue 3</h3>
            <p>API giữ tên đơn giản: <code>variant</code> mô tả ý nghĩa, <code>size</code> mô tả kích thước; native <code>button</code> giữ hành vi bàn phím. Loading tự disable để tránh submit nhiều lần.</p>
            <CodeBlock :code="buttonVue" language="Vue 3 · Button.vue" />
            <h3 class="subheading">State matrix trước khi gọi component là xong</h3>
            <div class="table-wrap"><table><thead><tr><th>State</th><th>Visual</th><th>Behavior</th><th>Verify</th></tr></thead><tbody>
              <tr><td>Default</td><td>Token thường</td><td>Action có thể thực hiện</td><td>Text/icon đúng</td></tr>
              <tr><td>Hover / Focus</td><td>Surface + focus ring riêng</td><td>Keyboard focus thấy rõ</td><td>Tab, Enter, Space</td></tr>
              <tr><td>Loading</td><td>Spinner + label ổn định</td><td>Không gửi lặp</td><td>aria-busy, disabled</td></tr>
              <tr><td>Disabled</td><td>Contrast vẫn đọc được</td><td>Không nhận click</td><td>Native disabled</td></tr>
              <tr><td>Destructive</td><td>Token danger, confirm nếu cần</td><td>Không đổi nghĩa chỉ bằng màu</td><td>Accessible name rõ</td></tr>
            </tbody></table></div>
            <div class="callout"><strong>Component hay Pattern?</strong> Button là component. “Form đăng nhập” là pattern gồm field, validation, submit state và error message. Không nhồi logic của cả pattern vào Button.</div>
          </section>

          <section id="accessibility" class="lesson-section">
            <div class="section-kicker">05 · ACCESSIBILITY BY DESIGN</div>
            <h2>Accessibility là một phần của API</h2>
            <p class="section-intro">Accessible không phải lớp polish cuối sprint. Quyết định semantic HTML, focus order, thông báo lỗi và contrast ảnh hưởng trực tiếp tới component contract.</p>
            <div class="a11y-grid">
              <article><b>Keyboard</b><p>Tab tới mọi control; Enter/Space kích hoạt đúng; dialog giữ focus khi mở và trả focus khi đóng.</p></article>
              <article><b>Names & labels</b><p>Input có label gắn bằng <code>for/id</code>; icon-only button có accessible name; lỗi liên kết với field.</p></article>
              <article><b>Contrast & color</b><p>Không truyền trạng thái chỉ bằng màu; kiểm tra contrast text, border, focus ring ở từng theme.</p></article>
              <article><b>Motion & zoom</b><p>Tôn trọng reduced motion, layout không vỡ khi zoom hoặc tăng cỡ chữ.</p></article>
            </div>
            <p class="reference-line">Dùng <a href="https://www.w3.org/WAI/WCAG22/quickref/" target="_blank" rel="noopener noreferrer">WCAG 2.2 Quick Reference</a> làm checklist tiêu chí; kết hợp kiểm tra tự động với thao tác bàn phím và screen reader.</p>
          </section>

          <section id="documentation" class="lesson-section">
            <div class="section-kicker">06 · DOCUMENTATION & QUALITY</div>
            <h2>Docs phải giúp người khác dùng đúng</h2>
            <div class="docs-layout">
              <div>
                <h3>Mỗi component nên có</h3>
                <ul class="check-list">
                  <li>Mục đích và trường hợp nên/không nên dùng.</li>
                  <li>Props, events, slots, default và constraints.</li>
                  <li>Ví dụ copy được và trạng thái edge case.</li>
                  <li>Hướng dẫn accessibility, responsive, theming.</li>
                  <li>Thay đổi gần đây và hướng dẫn migrate nếu breaking.</li>
                </ul>
              </div>
              <div class="quality-box">
                <h3>Quality gates gợi ý</h3>
                <ol><li>Type/lint + unit test cho logic.</li><li>Story cho mỗi variant và state quan trọng.</li><li>Interaction test cho keyboard, submit, dismiss.</li><li>Visual regression cho theme, responsive và edge cases.</li><li>Accessibility review và human design review.</li></ol>
              </div>
            </div>
            <div class="callout"><strong>Storybook workflow:</strong> đặt component vào trạng thái độc lập bằng stories, dùng chúng làm ví dụ và test case. Storybook hỗ trợ render/interaction tests; visual testing có thể so ảnh theo các trạng thái đã khai báo. Xem <a href="https://storybook.js.org/docs/writing-tests" target="_blank" rel="noopener noreferrer">tài liệu testing chính thức của Storybook</a>.</div>
          </section>

          <section id="governance" class="lesson-section">
            <div class="section-kicker">07 · GOVERNANCE</div>
            <h2>Quản lý thay đổi để hệ thống không biến thành “UI cũ”</h2>
            <div class="governance-flow"><span>Request</span><i>→</i><span>RFC / issue</span><i>→</i><span>Design + API review</span><i>→</i><span>Implementation + stories</span><i>→</i><span>Release + migration</span></div>
            <div class="two-column-notes">
              <div><h3>Chủ sở hữu và đóng góp</h3><p>Chỉ định maintainers, quy trình đề xuất, tiêu chí chấp nhận và người review. Team sản phẩm có thể đóng góp use case; core team giữ tính nhất quán và chất lượng API.</p></div>
              <div><h3>Version và deprecation</h3><p>Bug fix không đổi contract; feature thêm tương thích ngược; breaking change cần version/migration guide. Đánh dấu deprecated, theo dõi adoption rồi mới xóa.</p></div>
            </div>
            <div class="migration-steps"><b>Áp dụng vào sản phẩm cũ:</b><span>Inventory</span><span>→</span><span>Map UI cũ sang component</span><span>→</span><span>Migrate theo luồng</span><span>→</span><span>Gỡ implementation trùng</span></div>
          </section>

          <section id="capstone" class="lesson-section capstone">
            <div class="section-kicker">08 · CAPSTONE PROJECT</div>
            <h2>Xây “Ops Console UI Kit” cho trang quản trị đơn hàng</h2>
            <p class="section-intro">Làm trên một nghiệp vụ cụ thể để token/component/pattern giải quyết vấn đề thật, thay vì tạo thư viện component không có người dùng.</p>
            <div class="capstone-grid">
              <div><h3>Build</h3><ul><li>Token cho light/dark theme</li><li>Button, TextField, Select, Badge</li><li>Dialog xác nhận hủy đơn</li><li>DataTable có loading/empty/error</li><li>Pattern filter + search + pagination</li><li>Storybook docs và release notes</li></ul></div>
              <div><h3>Acceptance criteria</h3><ul><li>Không hard-code màu/spacing trong feature</li><li>Keyboard chạy được toàn bộ luồng</li><li>Loading, empty, error, disabled có ví dụ</li><li>Responsive ở mobile/tablet/desktop</li><li>Story ghi rõ khi nào dùng component</li><li>Có migration example từ UI cũ</li></ul></div>
            </div>
            <div class="practice-result"><span>Deliverable</span><p>Một trang Order Management ghép hoàn toàn từ system của bạn: filter đơn, mở chi tiết, đổi trạng thái, xác nhận hủy và hiển thị feedback.</p></div>
          </section>

          <section class="lesson-section final-check">
            <h2>Tự kiểm tra: bạn đã hiểu Design System khi…</h2>
            <ul class="check-list"><li>Giải thích được vì sao semantic token khác primitive token.</li><li>Thiết kế được component API và state matrix trước khi code.</li><li>Biết tách component cơ sở khỏi pattern nghiệp vụ.</li><li>Viết được story, interaction test và accessibility check cho component.</li><li>Đề xuất được quy trình review, deprecation và migrate.</li></ul>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { navigate } from '../utils/navigate.js';

const tokenCss = `:root {
  /* Primitive: palette and scale */
  --blue-600: #5b5ce2;
  --blue-700: #4546c8;
  --gray-950: #171923;
  --gray-600: #596174;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;

  /* Semantic: UI role */
  --color-action-primary: var(--blue-600);
  --color-action-primary-hover: var(--blue-700);
  --color-action-danger: #b42318;
  --color-text-primary: var(--gray-950);
  --color-text-secondary: var(--gray-600);
  --color-surface-page: #ffffff;
  --color-surface-raised: #f3f4f8;
  --color-focus-ring: #5549d8;
  --color-disabled-bg: #d1d5db;
  --color-disabled-text: #4b5563;
  --radius-control: 0.625rem;
}

[data-theme="dark"] {
  --color-text-primary: #f6f7fb;
  --color-text-secondary: #b8bfd0;
  --color-surface-page: #171923;
  --color-surface-raised: #272a36;
  --color-focus-ring: #c4b5fd;
}

.button--primary {
  color: #fff;
  background: var(--color-action-primary);
  border-radius: var(--radius-control);
  padding: var(--space-2) var(--space-4);
}
.button--primary:hover {
  background: var(--color-action-primary-hover);
}`;

const repoTree = `src/design-system/
├── tokens/
│   ├── primitives.css       # palette và scales nền
│   ├── semantic.css         # text, surface, action, border roles
│   └── themes.css           # light/dark hoặc brand themes
├── components/
│   ├── Button/
│   │   ├── Button.vue
│   │   ├── Button.stories.ts
│   │   └── Button.test.ts
│   ├── TextField/
│   ├── Dialog/
│   └── DataTable/
├── patterns/
│   ├── SearchFilters/
│   └── ConfirmAction/
└── docs/
    ├── contribution.md
    └── release-notes.md`;

const buttonVue = `<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
  disabled: false,
})
<\/script>

<template>
  <button
    :type="type"
    class="ds-button"
    :class="['ds-button--' + variant, 'ds-button--' + size]"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="ds-spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.ds-button { min-height: 2.75rem; display: inline-flex; align-items: center;
  justify-content: center; gap: var(--space-2); border-radius: var(--radius-control);
  font: inherit; font-weight: 650; cursor: pointer; }
.ds-button:focus-visible { outline: 3px solid var(--color-focus-ring); outline-offset: 2px; }
.ds-button:disabled { cursor: not-allowed; color: var(--color-disabled-text); background: var(--color-disabled-bg); }
.ds-button--primary { color: white; background: var(--color-action-primary); }
.ds-button--secondary { color: var(--color-text-primary); background: var(--color-surface-raised); }
.ds-button--danger { color: white; background: var(--color-action-danger); }
.ds-button--ghost { color: var(--color-action-primary); background: transparent; }
</style>`;

export default {
  name: 'FrontendDesignSystemPage',
  components: { CTopbar, CodeBlock },
  data() {
    return {
      accentColor: '#7c5cfc',
      tokenCss,
      repoTree,
      buttonVue,
    };
  },
  watch: {
    accentColor(value) {
      this.$el?.style.setProperty('--demo-action-primary', value);
    },
  },
  mounted() {
    this.$el.style.setProperty('--demo-action-primary', this.accentColor);
  },
  methods: {
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
.design-system-page {
  --forge-accent: #a78bfa;
  --demo-action-primary: #7c5cfc;
  min-height: 100vh;
  color: var(--forge-text, #f3f4f6);
  background:
    radial-gradient(ellipse at 12% 0%, rgba(124, 92, 252, .16), transparent 36rem),
    var(--forge-bg, #0c0a1d);
  font-family: Inter, system-ui, sans-serif;
}
.page-shell { max-width: 1240px; margin: 0 auto; padding: 2rem 1.5rem 5rem; }
.hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(300px, .72fr); gap: 3rem; align-items: center; padding: 2rem 0 3rem; }
.eyebrow,.section-kicker,.toc-title,.demo-label { color: #a78bfa; font-size: .68rem; font-weight: 800; letter-spacing: .16em; }
.hero h1 { max-width: 760px; margin: .8rem 0 1rem; color: var(--forge-text, #f8fafc); font-size: clamp(2rem, 4vw, 3.5rem); line-height: 1.08; letter-spacing: -.045em; }
.hero-copy > p { max-width: 720px; color: var(--forge-text2, #c4cad7); font-size: 1rem; line-height: 1.8; }
.hero-actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 1.5rem; }
.primary-link,.secondary-link { display: inline-flex; gap: .5rem; align-items: center; min-height: 44px; padding: .7rem 1rem; border-radius: 12px; text-decoration: none; font-size: .85rem; font-weight: 750; }
.primary-link { color: #fff; background: #7c5cfc; }
.secondary-link { color: var(--forge-text, #f8fafc); border: 1px solid var(--forge-glass-border, rgba(255,255,255,.12)); background: var(--forge-glass, rgba(255,255,255,.05)); }
.hero-art { padding: 1.3rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 24px; background: rgba(20,17,42,.72); box-shadow: 0 25px 70px rgba(0,0,0,.2); }
.stack-label { margin-bottom: .85rem; color: #9299ae; font-size: .62rem; font-weight: 800; letter-spacing: .15em; }
.stack-layer { display: flex; justify-content: space-between; gap: .5rem; align-items: center; margin: .45rem 0; padding: .85rem 1rem; border: 1px solid rgba(255,255,255,.08); border-radius: 12px; font-size: .75rem; }
.stack-layer span { color: #f8fafc; font-weight: 750; }.stack-layer b { color: #c1c7d5; font-size: .68rem; font-weight: 500; text-align: right; }
.layer-app { background: rgba(236,72,153,.14); }.layer-pattern { background: rgba(124,92,252,.16); }.layer-component { background: rgba(14,165,233,.15); }.layer-token { background: rgba(16,185,129,.13); }
.stack-foundation { padding: .65rem .3rem .1rem; color: #a78bfa; font-size: .65rem; font-weight: 700; text-align: center; }
.page-layout { display: grid; grid-template-columns: 220px minmax(0,1fr); gap: 2.5rem; align-items: start; }
.toc { position: sticky; top: 1.25rem; display: grid; gap: .25rem; padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 16px; background: rgba(19,16,39,.85); }
.toc-title { margin: 0 0 .4rem .55rem; font-size: .6rem; }.toc a { padding: .55rem; border-radius: 8px; color: var(--forge-text2, #b9bfd0); font-size: .72rem; text-decoration: none; }.toc a:hover { color: #fff; background: rgba(124,92,252,.16); }
.lesson-content { min-width: 0; }.lesson-section { scroll-margin-top: 2rem; margin-bottom: 1.2rem; padding: clamp(1.2rem, 3vw, 2rem); border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 20px; background: rgba(19,16,39,.82); }
.section-kicker { font-size: .62rem; }.lesson-section h2 { margin: .5rem 0 .8rem; color: var(--forge-text, #f8fafc); font-size: clamp(1.4rem, 2.5vw, 2rem); letter-spacing: -.025em; }.lesson-section h3 { color: var(--forge-text, #f8fafc); }.lead,.section-intro { color: var(--forge-text2, #c4cad7); font-size: .9rem; line-height: 1.75; }.lead { font-size: 1rem; }.lesson-section p,.lesson-section li { color: var(--forge-text2, #b9bfd0); }.lesson-section code { padding: .1rem .3rem; border-radius: 5px; color: #d8b4fe; background: rgba(167,139,250,.12); font-family: var(--font-mono, monospace); font-size: .88em; }
.definition-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .8rem; margin-top: 1.3rem; }.definition-card { padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 14px; background: rgba(255,255,255,.025); }.definition-icon { font-size: 1.3rem; }.definition-card h3 { margin: .6rem 0 .35rem; font-size: .85rem; }.definition-card p,.two-column-notes p { margin: 0; font-size: .75rem; line-height: 1.7; }
.callout { margin-top: 1.2rem; padding: 1rem 1.1rem; border-left: 3px solid #8b5cf6; border-radius: 0 12px 12px 0; color: var(--forge-text2, #c4cad7); background: rgba(139,92,246,.1); font-size: .8rem; line-height: 1.7; }.callout strong { color: #e9ddff; }.callout a,.reference-line a { color: #c4b5fd; text-underline-offset: 3px; }
.subheading { margin: 1.4rem 0 .6rem; font-size: .95rem; }.check-list { display: grid; gap: .5rem; padding-left: 1.2rem; font-size: .8rem; line-height: 1.65; }.check-list li::marker { color: #a78bfa; }
.roadmap { display: grid; gap: .7rem; margin-top: 1.2rem; }.roadmap article { display: grid; grid-template-columns: 38px 1fr; gap: .9rem; padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.09)); border-radius: 14px; background: rgba(255,255,255,.025); }.roadmap-number { display: grid; width: 34px; height: 34px; place-items: center; border-radius: 10px; color: #e9ddff; background: rgba(139,92,246,.2); font-size: .72rem; font-weight: 850; }.roadmap h3 { margin: .05rem 0 .25rem; font-size: .87rem; }.roadmap p { margin: 0; font-size: .76rem; line-height: 1.65; }.deliverable { display: inline-block; margin-top: .55rem; color: #a7f3d0; font-size: .68rem; font-weight: 700; }
.token-levels { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; gap: .6rem; align-items: center; margin: 1.2rem 0; }.token-levels article { height: 100%; padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 14px; background: rgba(255,255,255,.025); }.level-tag { color: #6ee7b7; font-size: .6rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }.level-tag.semantic { color: #93c5fd; }.level-tag.component { color: #f0abfc; }.token-levels h3 { margin: .5rem 0; font-size: .82rem; }.token-levels p { margin: 0; font-size: .72rem; line-height: 1.65; }.level-arrow { color: #8b5cf6; font-weight: 900; }
.token-playground { display: flex; justify-content: space-between; gap: 1.5rem; align-items: center; margin-top: 1.5rem; padding: 1.2rem; border: 1px solid rgba(124,92,252,.3); border-radius: 15px; background: linear-gradient(120deg,rgba(124,92,252,.12),rgba(56,189,248,.04)); }.demo-label { font-size: .58rem; }.token-playground h3 { margin: .35rem 0; font-size: .9rem; }.token-playground p { margin: 0; font-size: .72rem; line-height: 1.6; }.token-controls { display: flex; align-items: center; justify-content: end; flex-wrap: wrap; gap: .5rem; min-width: 270px; }.token-controls label { color: var(--forge-text2, #b9bfd0); font-size: .7rem; }.token-controls input { width: 35px; height: 35px; padding: 2px; border: 1px solid #ffffff30; border-radius: 8px; background: transparent; }.demo-button { min-height: 36px; padding: .45rem .75rem; border: 0; border-radius: 9px; color: white; background: var(--demo-action-primary); font: inherit; font-size: .7rem; font-weight: 750; }.demo-button.secondary { border: 1px solid #ffffff25; color: var(--forge-text2, #ddd); background: transparent; }
.two-column-notes { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.1rem; }.two-column-notes > div { padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.08)); border-radius: 13px; }.two-column-notes h3 { margin: 0 0 .4rem; font-size: .82rem; }.reference-line { margin-top: 1rem; font-size: .73rem; line-height: 1.7; }
.contract-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .6rem; margin: 1.1rem 0; }.contract-grid div { display: grid; gap: .35rem; padding: .8rem; border-radius: 11px; background: rgba(255,255,255,.04); }.contract-grid b { color: #c4b5fd; font-size: .73rem; }.contract-grid span { color: var(--forge-text2, #b9bfd0); font-size: .68rem; line-height: 1.5; }
.table-wrap { overflow-x: auto; margin: 1rem 0; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 12px; }.table-wrap table { width: 100%; min-width: 600px; border-collapse: collapse; font-size: .72rem; }.table-wrap th,.table-wrap td { padding: .65rem .75rem; border-bottom: 1px solid var(--forge-glass-border, rgba(255,255,255,.08)); color: var(--forge-text2, #c4cad7); text-align: left; }.table-wrap th { color: #e5e7eb; background: rgba(255,255,255,.04); }
.a11y-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: .7rem; margin-top: 1rem; }.a11y-grid article { padding: .9rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.09)); border-radius: 12px; }.a11y-grid b { color: #c4b5fd; font-size: .78rem; }.a11y-grid p { margin: .4rem 0 0; font-size: .73rem; line-height: 1.65; }
.docs-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 1rem; }.docs-layout h3,.quality-box h3 { margin-top: .3rem; font-size: .88rem; }.quality-box { padding: 1rem; border-radius: 13px; background: rgba(255,255,255,.035); }.quality-box ol { display: grid; gap: .5rem; padding-left: 1.1rem; color: var(--forge-text2, #b9bfd0); font-size: .74rem; line-height: 1.5; }.quality-box li::marker { color: #a78bfa; }
.governance-flow { display: flex; align-items: center; justify-content: space-between; gap: .5rem; overflow-x: auto; margin: 1.2rem 0; padding: 1rem; border-radius: 13px; background: rgba(139,92,246,.1); white-space: nowrap; }.governance-flow span,.migration-steps span { color: #e9ddff; font-size: .69rem; font-weight: 750; }.governance-flow i,.migration-steps span:nth-child(even) { color: #8b5cf6; font-style: normal; }.migration-steps { display: flex; flex-wrap: wrap; align-items: center; gap: .55rem; margin-top: 1rem; padding: 1rem; border: 1px solid var(--forge-glass-border, rgba(255,255,255,.1)); border-radius: 13px; }.migration-steps b { width: 100%; color: var(--forge-text, #f8fafc); font-size: .78rem; }
.capstone { border-color: rgba(139,92,246,.35); }.capstone-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.2rem; }.capstone-grid > div { padding: 1rem; border-radius: 14px; background: rgba(255,255,255,.035); }.capstone-grid h3 { margin: 0 0 .65rem; color: #c4b5fd; font-size: .85rem; }.capstone-grid ul { display: grid; gap: .45rem; padding-left: 1.1rem; font-size: .75rem; line-height: 1.5; }.capstone-grid li::marker { color: #a78bfa; }.practice-result { display: grid; grid-template-columns: 100px 1fr; gap: .8rem; margin-top: 1rem; padding: 1rem; border: 1px solid rgba(16,185,129,.24); border-radius: 13px; background: rgba(16,185,129,.08); }.practice-result span { color: #6ee7b7; font-size: .7rem; font-weight: 850; text-transform: uppercase; }.practice-result p { margin: 0; font-size: .78rem; line-height: 1.65; }.final-check { border-color: rgba(16,185,129,.25); }
@media (max-width: 900px) { .page-layout { grid-template-columns: 1fr; gap: 1rem; }.toc { position: static; display: flex; flex-wrap: wrap; gap: .25rem; }.toc-title { width: 100%; }.toc a { font-size: .67rem; }.hero { gap: 1.5rem; } }
@media (max-width: 680px) { .page-shell { padding: 1.25rem .9rem 3rem; }.hero { grid-template-columns: 1fr; padding-top: .5rem; }.hero-art { max-width: 520px; }.definition-grid,.contract-grid { grid-template-columns: 1fr 1fr; }.token-levels { grid-template-columns: 1fr; }.level-arrow { transform: rotate(90deg); justify-self: center; }.token-playground { align-items: flex-start; flex-direction: column; }.token-controls { justify-content: flex-start; min-width: 0; }.two-column-notes,.docs-layout,.capstone-grid { grid-template-columns: 1fr; }.practice-result { grid-template-columns: 1fr; }.governance-flow { justify-content: flex-start; } }
@media (max-width: 420px) { .definition-grid,.contract-grid,.a11y-grid { grid-template-columns: 1fr; }.stack-layer { align-items: flex-start; flex-direction: column; }.stack-layer b { text-align: left; } }
</style>
