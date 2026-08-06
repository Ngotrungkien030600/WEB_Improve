# Story: UI/UX Consistency cho Page English

## Context

Page English (`projects/web-en/pages/english.html`) đang chạy với Forge dark theme nhưng một số components vẫn dùng light theme colors hoặc không consistent với design system. Cuộc thảo luận giữa Sally (UX), Yui (Craftsman), Dana (Pragmatist) đã xác định các vấn đề cần fix.

## Sprint

**Sprint hiện tại** — UI/UX Polish

---

## Stories

### Story 1: Fix Top Bar Overlap
**Priority:** P0 | **Estimate:** 15 phút

**Problem:**
- Link "Trang chủ" bị icon đóng (×) đè lên trong modal/exam
- Back link không accessible trên mobile

**Solution:**
```css
/* Trong exam modal hoặc topbar */
.topbar {
  padding-right: 50px; /* Cho icon close */
}
.topbar .back {
  position: relative;
  z-index: 10;
}
```

**Acceptance Criteria:**
- [ ] Back link luôn visible không bị icon che
- [ ] Click được trên mobile

---

### Story 2: Flip Card Back Gradient Consistency
**Priority:** P1 | **Estimate:** 20 phút

**Problem:**
- Flip card back dùng nền vàng nhạt `#fff8e1` — không match Forge dark theme
- Lệch với orange accent của app

**Solution:**
```css
.flip-card-back {
  background: linear-gradient(145deg,
    rgba(249,115,22,0.08),
    rgba(249,115,22,0.03));
  border: 1px solid rgba(249,115,22,0.15);
}

.flip-card:hover .flip-card-inner {
  box-shadow: 0 0 20px rgba(249,115,22,0.15);
}
```

**Acceptance Criteria:**
- [ ] Flip card back có gradient orange nhẹ
- [ ] Hover có subtle glow effect
- [ ] Consistent với Forge theme

---

### Story 3: Dropzone & Word Chips Color Consistency
**Priority:** P1 | **Estimate:** 30 phút

**Problem:**
- Dropzone border: `#ccc` dashed — quá mờ, không nổi bật
- Word chips: `#f3e5f5` tím — lệch theme, nên dùng orange

**Solution:**
```css
/* Dropzone */
.dropzone {
  border: 2px dashed rgba(249,115,22,0.3);
  background: rgba(249,115,22,0.03);
}
.dropzone.correct {
  border-color: #22c55e;
  background: rgba(34,197,94,0.08);
}
.dropzone.wrong {
  border-color: #ef4444;
  background: rgba(239,68,68,0.08);
}

/* Word Chips */
.word-chip {
  background: rgba(249,115,22,0.1);
  color: var(--forge-text, #f1f5f9);
  border: 1px solid rgba(249,115,22,0.2);
}
.word-chip:hover {
  background: rgba(249,115,22,0.18);
  border-color: var(--forge-accent, #f97316);
}
.word-chip.in-dropzone {
  background: var(--forge-accent, #f97316);
  color: white;
  border-color: var(--forge-accent, #f97316);
}
```

**Acceptance Criteria:**
- [ ] Dropzone border nổi bật với accent color
- [ ] Word chips consistent với Forge orange theme
- [ ] Feedback states (correct/wrong) vẫn work

---

### Story 4: Mobile Touch Targets Improvement
**Priority:** P1 | **Estimate:** 25 phút

**Problem:**
- Tabs font-size 0.85rem, padding 0.45rem — khó bấm trên mobile
- Buttons touch target có thể nhỏ hơn 44px

**Solution:**
```css
/* Tabs - tăng touch target */
.tab, .quiz-tab, .tense-subtab {
  min-height: 44px;
  min-width: 44px;
  padding: 0.5rem 0.9rem;
  font-size: 0.9rem;
}

/* Buttons - đảm bảo touch target */
.controls button,
.practice-actions button {
  min-height: 44px;
  min-width: 44px;
  padding: 0.6rem 1rem;
}
```

**Acceptance Criteria:**
- [ ] Tất cả interactive elements có touch target ≥44px
- [ ] Test trên mobile (320px width)
- [ ] Spacing consistent không bị overlap

---

### Story 5: Stats Card Enhancement
**Priority:** P2 | **Estimate:** 15 phút

**Problem:**
- Stats card (VD: "Hôm nay 0m") không có icon
- Không trực quan bằng các phần khác

**Solution:**
```css
.quiz-stats {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  color: var(--forge-text-secondary, #94a3b8);
}

.quiz-stats::before {
  content: '📊';
  /* hoặc dùng SVG icon */
}
```

**Files to Modify:**
- `projects/web-en/css/components.css` — `.quiz-stats`

**Acceptance Criteria:**
- [ ] Stats hiển thị với icon/label rõ ràng
- [ ] Responsive không break

---

### Story 6: Micro-interactions & Polish
**Priority:** P2 | **Estimate:** 30 phút

**Problem:**
- Thiếu hover states cho một số elements
- Chưa có entrance animations

**Solution:**
```css
/* Subtle hover lift cho cards */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(249,115,22,0.1);
  border-color: var(--forge-accent, #f97316);
}

/* Button press effect */
button:active {
  transform: scale(0.97);
}

/* Progress bar animation */
.quiz-timer-fill {
  transition: width 0.3s ease-out;
}
```

**Acceptance Criteria:**
- [ ] Cards có lift effect khi hover
- [ ] Buttons có press feedback
- [ ] Progress bars animate smoothly

---

## Files cần modify

| File | Stories |
|------|---------|
| `css/components.css` | 1, 2, 3, 4, 5, 6 |
| `css/subpage.css` | 2, 3, 4 |

## Test Checklist

- [ ] Desktop (1920px, 1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px, 320px)
- [ ] Flip card animation smooth
- [ ] Touch targets ≥44px trên mobile
- [ ] Colors consistent với Forge theme

---

## Definition of Done

1. Tất cả visual inconsistencies đã fix
2. Mobile responsive đạt touch target standards
3. Không có console errors
4. Animation smooth, không janky
5. Tested trên Chrome, Firefox, Safari

---

## Notes

- Không thay đổi functionality — chỉ UI/UX polish
- Giữ nguyên existing interactions
- Backup CSS trước khi deploy
