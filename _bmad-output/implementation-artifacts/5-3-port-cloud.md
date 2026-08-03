# Story 5.3: Port Cloud page (thay HubPlaceholder)
## Header

- **Epic:** 5 — Complete Vue Port (final 3 pages)
- **Story ID:** 5.3
- **Status:** ready-for-dev
- **Hardened:** light (2026-08-03) — 2 AC, heavy content page
- **Created:** 2026-08-03

---

## User Story

As a người dùng,
I want truy cập trang Cloud với kiến thức AWS (IAM, VPC, EC2, Lambda, S3, RDS, CI/CD) trên bản Vue,
So that học cloud không cần quay về bản Legacy.

---

## Acceptance Criteria

### AC1: Cloud page hiển thị đúng với 10 sections

**Given** Cloud page đã port sang Vue (thay HubPlaceholder)
**When** người dùng mở `/cloud`
**Then** hiển thị table of contents với 10 sections
**And** mỗi section có title, content với headings, paragraphs, lists, code blocks
**And** có breadcrumb navigation (AWS Cloud → Trang chủ)

### AC2: UI khớp Legacy (FR-6 five-point check)

**Given** Cloud page đang chạy trên Vue
**When** so sánh với Legacy
**Then** Block layout: tất cả sections xếp đúng vị trí
**And** Color: dùng token (`--color-accent: #ff9900` — AWS orange)
**And** Spacing: khoảng cách giữa sections khớp
**And** Font/size: Inter font, kích thước khớp
**And** Hover state: links hover effect khớp

---

## Technical Notes

### Legacy Files

- `web-en/pages/cloud.html` — page source (1250 lines, 10 sections)
  - Section 1: IAM (Identity & Access Management) — 77 lines
  - Section 2: VPC & Networking — 103 lines
  - Section 3: EC2 & Auto Scaling — 94 lines
  - Section 4: Lambda & Serverless — 132 lines
  - Section 5: ECS & Container Orchestration — 109 lines
  - Section 6: S3 (Simple Storage Service) — 113 lines
  - Section 7: RDS & DynamoDB — 155 lines
  - Section 8: CodePipeline & DevOps — 171 lines
  - Section 9: Architecture & Best Practices — 164 lines
  - Section 10: Bastion & Jump Host — 123 lines

### Content Patterns

**TOC links:**
```html
<div class="toc">
  <a href="#iam">1. IAM & Security</a>
  <a href="#vpc">2. VPC & Networking</a>
  ...
</div>
```

**Section structure:**
```html
<div class="section" id="iam">
  <div class="section-title">1. IAM ...</div>
  <div class="section-body">
    <h3>Sub-heading</h3>
    <p>Paragraph text...</p>
    <pre><code>Code block...</code></pre>
    <div class="grid-2">Card grid...</div>
    <div class="diagram">ASCII diagram...</div>
    <ul><li>List item...</li></ul>
  </div>
</div>
```

### CSS Classes to Preserve

- `.page` — max-width container
- `.topbar` — header với title và nav links
- `.toc` — grid of anchor links
- `.section` — content section với border
- `.section-title` — section header
- `.section-body` — section content
- `.grid-2`, `.grid-3` — card grids
- `.card` — info card
- `pre`, `code` — code blocks
- `.diagram` — ASCII/visual diagram boxes
- `.tag-*` — category tags (compute, storage, db, net, sec, devops)

### Strategy

- **Loại trang:** Static content page — heavy on text, code blocks, diagrams
- Copy HTML content từ `cloud.html` vào Vue template
- Preserve inline CSS classes (không tạo file mới)
- Dùng `<style scoped>` với các class trên
- Hoặc dùng `v-html` với preserved HTML (nếu acceptable)
- Route: `/cloud` (thay vì `/cloud/hub` để match Legacy URL shape)

### Accent Color

AWS orange: `#ff9900` → override `--color-accent` trên page root

---

## Files to Create/Modify

### Create
- `src/pages/CloudPage.vue`

### Modify
- `src/router/index.js` — thay HubPlaceholder tại `/cloud/hub` bằng CloudPage.vue
  - Hoặc thêm route `/cloud` → CloudPage.vue và giữ `/cloud/hub` redirect
- `src/utils/ported-pages.js` — entry `'/cloud'` (thay `'/cloud/hub'`)
- `PORTED_PAGE_LABELS` — update `'/cloud/hub'` → `'/cloud': 'AWS Cloud'`

---

## Non-Functional Requirements

- **NFR1:** Legacy app luôn chạy được — không sửa cloud.html
- **AD-8:** Không hex cứng — dùng CSS tokens hoặc preserve inline CSS từ Legacy
- **AD-10:** `<style scoped>` cho page component
- **AD-17:** Accent token override (`--color-accent: #ff9900`)

### Note on Content Size

`cloud.html` là 1250 lines — lớn nhất trong project. Có 2 approaches:

**Approach A (Recommended):** Preserve inline styles từ Legacy
- Copy entire `<style>` block từ `cloud.html` vào Vue `<style scoped>`
- Copy entire section HTML vào Vue template
- Thay đổi tối thiểu

**Approach B:** Extract content to data file
- Tách nội dung text ra JS data file
- Render trong Vue template
- Giữ CSS classes đơn giản

---

## Dev Agent Guardrails

### ✅ PHẢI LÀM
- Preserve tất cả 10 sections với content đầy đủ
- Preserve TOC navigation với anchor links
- Preserve code blocks với syntax highlighting (nếu có)
- Preserve ASCII diagrams trong `.diagram` class
- Preserve tag badges (compute, storage, db, etc.)
- Preserve card grids (grid-2, grid-3)

### ❌ KHÔNG ĐƯỢC LÀM
- Không tóm tắt/cắt nội dung — giữ nguyên 100%
- Không tạo component mới — single page component
- Không hex cứng ngoài approach A (nếu dùng approach A, preserve inline styles)
- Không tạo CSS file mới

### ⚠️ Content Volume Warning
Đây là page lớn nhất (1250 lines HTML). Dev nên:
1. Copy entire content từ Legacy
2. Verify từng section sau khi copy
3. Test TOC navigation cho tất cả 10 anchors
4. Test responsive (grid-2 → 1 column trên mobile)
