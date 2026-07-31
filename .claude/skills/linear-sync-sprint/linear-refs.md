# linear-refs — ID tham chiếu team Bbf (workspace ladospices)

> Nguồn deterministic cho skill `linear-sync-sprint`. Nếu Linear bị tạo lại từ đầu, các ID này đổi → chạy `list_teams` / `list_projects` / `list_issue_labels` để refresh rồi cập nhật file này. Đừng hard-code ID vào flow, đọc từ đây.

## Team
- **Bbf** = `64bffef3-16d0-42fc-9ccf-e80a1201f0b2`
- Assignee mặc định (mọi story) = Giang Phạm Hà `0713ad67-67b6-4ebf-a841-11579982ad1e`

## Workflow states (cột Kanban)
| Tên | id | type |
|---|---|---|
| Backlog | `c76a7226-d00b-4654-abee-b2c4b489cdff` | backlog |
| Todo | `6cc2d1d8-2d85-4246-b148-457abf30e5be` | unstarted |
| In Progress | `4d804946-f69e-4dc8-a67b-6ae9e75264a9` | started |
| In Review | `65c328a9-1329-42ca-a685-7f4bccee8e49` | started |
| Done | `c6731b79-c519-413f-973d-697d07ff65ed` | completed |
| Canceled | `fc0e0816-9157-4146-b214-0c00c8c32248` | canceled |

## Projects theo epic (epic-N → projectId)
| Epic | Project name | id |
|---|---|---|
| 1 | Epic 1 — Đối soát sàn TMĐT (nền tảng) | `96f228a3-e3b3-49a9-818e-0eff310d79aa` |
| 2 | Epic 2 — Kế toán & Chốt sổ tài chính | `1e2fb048-4acd-4f0c-800f-cbae4514f8e7` |
| 3 | Epic 3 — Vận hành Logistics (OMS) | `72afae17-64ba-4e3e-a473-1fb431c6b96c` |
| 4 | Epic 4 — Nền tảng lõi (Launchpad + API) | `65fdbd34-c66b-45ed-b6db-bd8f4fd7067b` |
| 5 | Epic 5 — Nền kiến trúc v2 (Clean Arch + @bbf/ui) | `c0123dbf-0e11-4ccd-a3db-d111aa5dbb27` |
| 6 | Epic 6 — Giá vốn nhập hàng (Phiếu nhập → Giá vốn) | `227aa221-b55d-4028-9490-698b68dd718b` |
| 7 | Epic 7 — Thư viện component v2 (@bbf/ui) | `5da8ffdc-6f46-41a8-b878-dc98552f04a5` |
| 8 | Epic 8 — Di trú màn hình sang v2 | `18e79069-c3e5-4d40-bf48-c1d6effcd202` |
| 9 | Epic 9 — Pipeline đồng bộ TikTok | `0b32dda2-fe10-44f3-922e-68c3a6d89247` |
| 10 | Epic 10 — Màn dữ liệu OMS | `5dd8085a-94f7-45cc-b2e1-5da39715f39f` |
| 11 | Epic 11 — Chuẩn hoá Frontend (enum/badge) | `6306f18d-56bc-4820-a03d-ceab6029e83e` |
| 12 | Epic 12 — Hàng Về Kho (Trả/Hủy/Hoàn) | `4445bad7-5ccd-4f6c-ba10-8c416eb839e2` |
| 13 | Epic 13 — Pipeline đa sàn (Shopee) | `78108262-f154-4f35-b429-39b0114784b4` |
| 14 | Epic 14 — Chuẩn màn OMS (orders) | `37033abf-f1c3-4cab-a5ea-3cc2860cdf57` |
| 15 | Epic 15 — Gia cố Auth/SSO | `cfccb095-300f-485c-ba52-b130ce96dc3b` |
| 16 | Epic 16 — Bàn giao Đơn vị vận chuyển | `022faebf-fd31-4f42-a3e2-43cecc87fa4b` |
| 17 | Epic 17 — Chuẩn hoá model đơn hàng | `c6431cdf-ec8e-451e-bb0a-4359532c8a48` |
| 18 | Epic 18 — Vòng đời lô bàn giao vật lý | `418b2b5a-1917-4a4d-bcc0-41f275622a7d` |
| 19 | Epic 19 — Multi-Tenant SaaS (tenant context & RLS) | `b8bafc64-87f6-4f3e-b11c-a90a8f164dc8` |
| 20 | Epic 20 — Quản trị & Onboarding Tenant | `9b7cac2e-b6c3-4e8f-8b4b-10d002898236` |
| 21 | Epic 21 — Observability & Chuẩn hoá Error-Contract | `708dcf9b-bf5d-4967-b0b2-a5ee09628adf` |
| 22 | Epic 22 — Di trú OMS sang Client-Data (TanStack Query) | `8d982f8f-5c0a-4c22-827e-a2c0de12a0ef` |
| 23 | Epic 23 — Component Visual Finishing Pass (@bbf/ui) | `f8d8ce35-b3d4-45d6-9089-92d6b5a0e0ce` |

> Epic mới (chưa có project) → tạo project `Epic N — <tên tiếng Việt>` (addTeams Bbf), set state `completed` nếu epic đã done, rồi ghi id vào bảng này.

## Label độ khó (nhóm "Độ khó" `4ff040a6-e349-4b68-b35d-4711d9b0f8c7`) — map estimate → label
| Estimate (pts) | Độ khó | label id | thời gian |
|---|---|---|---|
| 1 | rất dễ | `dce7d221-0414-4f95-a338-d9cdbdeb3cce` | ~0.5d `92f75e46-d02d-479e-9d93-41bfc51a2c05` |
| 2 | dễ | `ebe452b1-1595-4179-a63d-9a9dfc72978b` | ~1d `8349b808-4e79-472c-a1ec-4b25fb80f31b` |
| 3 | vừa | `1c8fedce-41f0-46dd-8462-b5bf0e43d110` | ~1.5d `629b29d9-2214-4553-9f5d-f21e63347128` |
| 5 | khó | `7c676ce7-9388-4752-9fa1-cecc395ac4a4` | ~2.5d `a332f090-b2bf-4fad-b1e4-834b1cc76571` |
| 8 | rất khó | `c82d489b-2993-4bd6-8d84-d3240867321a` | ~4d `ac1e542f-083b-431d-828d-db426350345b` |
| 13 | cực khó | `0a557fc9-9048-49c3-bcc5-a80f8facbe7d` | ~6d `d8671aab-2735-43c6-8f8b-390e918ceed9` |

- Nhóm "Thời gian" = `c56e8707-d7f7-4023-87bf-c8478090dfa7`.
- `blocked` = `dbac454e-27e4-4c49-be66-2238e69ee04c`.
- Label cũ `epic-1..18` KHÔNG dùng nữa (Project đã thay vai gom epic) — đừng gắn lên issue mới.
