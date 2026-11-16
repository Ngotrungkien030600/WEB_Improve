---
title: 'Thêm lối vào AI Engineer trên trang chủ'
type: 'feature'
created: '2026-11-16'
status: 'done'
route: 'one-shot'
---

# Thêm lối vào AI Engineer trên trang chủ

## Intent

**Problem:** Người học không thấy lộ trình AI Engineer từ trang chủ vì chỉ có thể mở lộ trình qua AI Hub.

**Approach:** Thêm thẻ “Lộ trình AI Engineer” vào nhóm “AI & công cụ phát triển” trên trang chủ và trỏ tới route lộ trình đã có `/ai/engineer`.

## Suggested Review Order

- Kiểm tra thẻ lối vào mới nằm cạnh các thẻ AI hiện có và dùng route đã đăng ký.
  [`HomePage.vue:108`](../../projects/web-app/src/pages/HomePage.vue#L108)
