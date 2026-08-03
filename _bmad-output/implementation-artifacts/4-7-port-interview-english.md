# Story 4.7: Port interview-english và bmad-agents

## Context

Legacy pages: 
- `web-en/pages/interview-english.html`
- `web-en/pages/bmad-agents.html`

Vue stubs: chưa có (file mới tạo)
Status: **BACKLOG**

## Source

### interview-english
- HTML: `projects/web-en/pages/interview-english.html`
- CSS: `projects/web-en/css/interview-english.css`
- Logic: `projects/web-en/js/features/interview-english/interview-english-logic.js`
- Data: `projects/web-en/js/data/interview-english-data.js`

### bmad-agents
- HTML: `projects/web-en/pages/bmad-agents.html`
- CSS: `projects/web-en/css/bmad-agents.css`
- Logic: `projects/web-en/js/features/bmad-agents/bmad-agents-logic.js`
- API endpoint: `http://localhost:8080/api/chat` (đã fix story 1.2)
- Style tokens: `projects/web-en/css/variables.css`

## Acceptance Criteria

### interview-english
Given interview-english đã port
When người dùng chọn chủ đề và trả lời câu hỏi
Then checklist tiến độ được lưu (AD-6)
And có thể chuyển giữa các topics

Given đang ở interview-english
When bấm quay về hub
Then navigate về `/english/hub` hoặc `/interview`

### bmad-agents
Given bmad-agents đã port sang Vue
When người dùng chat với agents
Then API call đi qua proxy `/api/chat` (Vite proxy → backend)
And chat UI hiển thị đúng style
And response từ AI hiển thị đúng

Given đang ở bmad-agents
When bấm quay về
Then navigate về `/` (home)

## Notes

- bmad-agents cần đọc kỹ story 1.2 để hiểu API endpoint và fix
- interview-english có thể reuse pattern từ story 3-2 (interview page)
- BMAD agents: 6 personas từ `projects/web-en/js/data/bmad-agents-data.js`
