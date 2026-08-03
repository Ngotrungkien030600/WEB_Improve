# Story 4.7: Port interview-english và bmad-agents

## Context

Legacy pages:
- `web-en/pages/interview-english.html` — static content
- `web-en/pages/bmad-agents.html` — interactive chat

Vue stubs: chưa có (file mới tạo)
Status: **READY-FOR-DEV**

## Source thực tế (đã verify)

### interview-english
| Artifact | Path | Notes |
|----------|------|-------|
| HTML | `web-en/pages/interview-english.html` | Static content — 4 tuần + vocabulary |
| CSS tokens | `web-en/css/forge-tokens.css` | Forge dark theme |

**Pattern:** Static content page — hardcode HTML inline trong Vue component (AD-15)

### bmad-agents
| Artifact | Path | Notes |
|----------|------|-------|
| HTML | `web-en/pages/bmad-agents.html` | Agent grid + chat UI |
| CSS | `web-en/css/agents/bmad-chat.css` | Chat styles |
| Logic | `web-en/js/agents/bmad-chat.js` | 388 lines — agent grid, solo/party mode |
| Data | `web-en/js/agents/agents-config.js` | 7 agents — `window.BMAD_AGENTS` |
| Constants | `web-en/js/agents/agent-constants.js` | API endpoint config |
| API | `api/index.js` | Đã có `chat()` function — dùng AD-11 |

**Pattern:** Logic page — import logic qua `@legacy`, API call qua `src/api/index.js`

## Acceptance Criteria

### interview-english (static)

Given đang ở interview-english
When bấm link về hub
Then navigate về `/english/hub`

### bmad-agents (interactive)

Given bmad-agents đã render
When bấm agent card (solo mode)
Then chat view hiển thị
And welcome message từ agent được hiển thị

Given đang ở solo chat
When gửi tin nhắn
Then API call đi `/api/bmad/chat` (R2) qua `src/api/index.js`
And response hiển thị đúng format

Given đang ở bmad-agents
When bấm Party Mode
Then grid hiển thị checkboxes cho multi-select
And chọn ≥2 agents → nút "Bắt đầu Party" hiện

Given đang ở bmad-agents
When bấm quay về
Then navigate về `/`

## Invariant Notes

- **R2**: API endpoint là `/api/bmad/chat` — đi qua `src/api/index.js`, không hardcode URL
- **R7**: `/bmad-agents` phải thêm vào `PORTED_PAGES`
- **R8**: Không hex cứng — dùng forge tokens hoặc CSS vars

## Cases (Hardened)

### Happy Path
| # | Mô tả | Input | Expected Output |
|---|-------|-------|----------------|
| H1 | interview-english load | Navigate to page | 4 week cards + vocab hiển thị |
| H2 | interview-english back link | Click "Trang chủ" | Navigate về `/` |
| H3 | bmad-agents grid render | Navigate to page | 7 agent cards hiển thị |
| H4 | Solo mode — chọn agent | Click agent card | Chat view hiện, welcome message hiện |
| H5 | Solo chat — gửi message | Type + send | API call, response hiện |
| H6 | Party mode — chọn nhiều agent | Click Party, select ≥2 | Start button hiện |

### Edge Cases
| # | Mô tả | Input | Expected Output |
|---|-------|-------|-----------------|
| E1 | interview-english — empty content | HTML bị corrupt | No crash, hiển thị fallback |
| E2 | bmad-agents — agent không tìm thấy | Invalid agent ID | Fallback message |
| E3 | Solo chat — empty message | Gửi message rỗng | Không call API |
| E4 | Party — chỉ chọn 1 agent | Click Party, chọn 1 | Nút Start không hiện |
| E5 | Chat — network error | API fail | Error message hiện, retry possible |

### Invariant Cases
| # | Invariant | Case |
|---|-----------|------|
| I1 | R2 | API URL không hardcode — dùng `src/api/index.js` |
| I2 | R7 | `/bmad-agents` trong `PORTED_PAGES` |
| I3 | R8 | Không hex cứng trong `<style>` |

## Dev Notes

### interview-english
Inline HTML content vào Vue component — không import từ file khác (AD-15 pattern: hardcode static content).

### bmad-agents

#### Export data files (AD-16)

```js
// web-en/js/agents/agents-config.js — thêm export
export const BMAD_AGENTS = window.BMAD_AGENTS;

// web-en/js/agents/agent-constants.js — thêm export
export const BMAD_CONSTANTS = window.BMAD_CONSTANTS;
```

#### Import pattern

```js
import { BMAD_AGENTS } from '@legacy/js/agents/agents-config.js';
import { BMAD_CONSTANTS } from '@legacy/js/agents/agent-constants.js';
import { chat as bmadChat } from '../../api/index.js';
```

#### Markdown rendering
Dùng `markdownToHTML()` từ `@legacy/js/utils/markdown.js` — như CodeLearnPage.

#### State management
Vue reactive state cho:
- `currentMode` ('solo' | 'party')
- `selectedAgents` (array)
- `conversations` (object keyed by agentId)
- `messages` (current view messages)

**Implemented:** dev-story (2026-08-03) — 5 files (InterviewEnglishPage.vue + BmadAgentsPage.vue + agents-config.js export + agent-constants.js export + router + ported-pages.js)
