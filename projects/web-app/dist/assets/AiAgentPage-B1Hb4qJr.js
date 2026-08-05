import{C as e,S as t,_ as n,c as r,d as i,f as a,g as o,h as s,l as c,m as l,n as u,p as d,r as f,w as p,x as m,y as ee}from"./index-CkmND2NX.js";import{t as h}from"./navigate-DMkXde2y.js";window.aiAgentConcepts=[{en:`AI Agent`,vi:`Tác tử AI`,category:`agent`,definition:`Hệ thống AI tự chủ có khả năng nhận thức (perceive), suy luận (reason), lập kế hoạch (plan) và hành động (act) để đạt mục tiêu.`,example:`Agent đặt vé máy bay: hiểu yêu cầu → tìm chuyến → đặt vé → gửi email xác nhận.`},{en:`LLM Agent`,vi:`Agent dựa trên LLM`,category:`agent`,definition:`Agent dùng LLM làm 'bộ não' để suy luận, đưa ra quyết định và điều phối các công cụ thực thi.`,example:`Claude, GPT với tool use — LLM quyết định gọi tool nào, đọc kết quả, rồi hành động tiếp.`},{en:`ReAct`,vi:`Suy luận và hành động`,category:`agent`,definition:`Pattern (Reason + Act): agent luân phiên suy luận bằng lý luận (Thought), chọn hành động (Action), quan sát kết quả (Observation) rồi lặp lại.`,example:`Thought: cần tra thời tiết → Action: call weather API → Observation: trời mưa → Answer: mang ô.`},{en:`Tool Use`,vi:`Sử dụng công cụ`,category:`agent`,definition:`Khả năng agent gọi các hàm/API bên ngoài (search, calculator, database) qua các tool được khai báo cho model.`,example:`Agent hỏi LLM dùng tool 'get_weather(city)' để lấy dữ liệu thời tiết thực tế.`},{en:`Function Calling`,vi:`Gọi hàm`,category:`agent`,definition:`Cơ chế API cho phép model trả về cấu trúc JSON gọi một hàm cụ thể kèm tham số, thay vì chỉ trả văn bản.`,example:`Model trả về {"name": "get_weather", "arguments": {"city": "Hanoi"}} để app thực thi.`},{en:`Agentic Loop`,vi:`Vòng lặp agent`,category:`agent`,definition:`Vòng lặp lặp đi lặp lại: LLM sinh quyết định → thực thi tool → đưa kết quả về LLM → LLM sinh quyết định tiếp cho đến khi hoàn thành mục tiêu.`,example:`Agent tự lặp 5-10 vòng để giải quyết một yêu cầu phức tạp như 'phân tích và tổng hợp báo cáo'.`},{en:`Planning`,vi:`Lập kế hoạch`,category:`agent`,definition:`Khả năng agent chia mục tiêu lớn thành chuỗi bước nhỏ, xác định thứ tự và điều kiện thực hiện.`,example:`Mục tiêu 'tổ chức buổi họp' → plan: tìm phòng → mời người → chuẩn bị agenda.`},{en:`Multi-Agent`,vi:`Đa agent`,category:`agent`,definition:`Kiến trúc nhiều agent chuyên biệt phối hợp với nhau, mỗi agent đảm nhận một vai trò, giao tiếp qua message/queues.`,example:`Orchestrator agent điều phối: researcher agent tìm tài liệu → writer agent viết → reviewer agent kiểm tra.`},{en:`Agent Memory`,vi:`Bộ nhớ agent`,category:`agent`,definition:`Khả năng agent lưu và truy xuất thông tin qua các vòng lặp: short-term (context window), long-term (vector DB, files), working memory (session state).`,example:`Agent nhớ sở thích người dùng từ các hội thoại trước để gợi ý phù hợp hơn.`},{en:`RAG`,vi:`Truy xuất tăng cường sinh`,category:`agent`,definition:`Kỹ thuật tìm kiếm tài liệu liên quan từ knowledge base (vector DB) rồi đưa vào context để LLM trả lời chính xác, giảm hallucination.`,example:`Chatbot nội bộ: tìm tài liệu công ty → trả lời dựa trên tài liệu thay vì 'bịa'.`},{en:`Hallucination`,vi:`Ảo giác`,category:`agent`,definition:`Hiện tượng LLM sinh ra thông tin sai, bịa đặt nhưng trình bày rất tự tin; giảm bằng RAG, grounding, tool verification.`,example:`LLM khẳng định 'Đà Nẵng là thủ đô của Việt Nam' — hoàn toàn sai nhưng nghe rất thuyết phục.`},{en:`Orchestrator`,vi:`Điều phối viên`,category:`agent`,definition:`Agent/component trung tâm quyết định agent nào thực hiện task nào, tuần tự hay song song, và tổng hợp kết quả cuối.`,example:`Orchestrator nhận 'viết bài blog' → giao outline cho planner, giao draft cho writer, giao review cho editor.`},{en:`MCP`,vi:`Giao thức Model Context Protocol`,category:`tools`,definition:`Giao thức mở chuẩn hóa cách LLM kết nối với tools và data sources (resources, tools, prompts) — 'USB-C cho AI'.`,example:`Một MCP server duy nhất cung cấp 20 tools GitHub cho mọi LLM mà không cần viết lại code.`},{en:`Tool Schema`,vi:`Khai báo tool`,category:`tools`,definition:`Định nghĩa JSON mô tả tool: tên, mô tả, tham số (JSON Schema) để LLM hiểu khi nào và gọi thế nào.`,example:`{name: 'get_weather', description: 'Lấy thời tiết theo thành phố', parameters: {type: 'object', properties: {city: {type: 'string'}}}}`},{en:`Tool Choice`,vi:`Chọn tool`,category:`tools`,definition:`Cơ chế điều khiển model có được gọi tool hay không: auto (tự quyết), required (bắt buộc), none (chỉ chat).`,example:`Tool choice = 'required' khi muốn model luôn dùng tool để không trả lời bừa.`},{en:`Agent Framework`,vi:`Framework agent`,category:`tools`,definition:`Thư viện giúp xây agent nhanh: vòng lặp, tool registry, memory, orchestration có sẵn.`,example:`LangChain, LlamaIndex, CrewAI, OpenAI Agents SDK, Google ADK.`},{en:`Tool Registry`,vi:`Sổ đăng ký tool`,category:`tools`,definition:`Nơi tập trung đăng ký danh sách tool, kiểm tra schema hợp lệ, quản lý quyền gọi và version.`,example:`App đăng ký 5 tools, agent chỉ được gọi tool có trong registry và có permission.`},{en:`Guardrails`,vi:`Rào chắn an toàn`,category:`tools`,definition:`Lớp kiểm soát chặn hành động nguy hiểm/sai của agent: validate input, chặn tool nhạy cảm, huấn luyện model.`,example:`Chặn agent gọi tool 'delete_all_data' nếu không có xác nhận hai bước của người dùng.`},{en:`Token`,vi:`Token`,category:`token`,definition:`Đơn vị cơ bản mà LLM xử lý văn bản — có thể là từ, một phần từ (subword) hoặc ký tự; mỗi model có bộ tokenizer riêng.`,example:`'AI is fun' ≈ 4 tokens; tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh cùng nghĩa.`},{en:`Tokenizer`,vi:`Bộ tách token`,category:`token`,definition:`Thuật toán (thường là BPE/SentencePiece) chia văn bản thành tokens theo từ điển học được từ dữ liệu huấn luyện.`,example:`Tiktoken của OpenAI, tokenizer của Llama dùng BPE với vocab ~32k-100k tokens.`},{en:`Context Window`,vi:`Cửa sổ ngữ cảnh`,category:`token`,definition:`Số token tối đa model nhận trong một lần gọi (input + output); quá giới hạn sẽ lỗi hoặc bị cắt.`,example:`Context 128K tokens ≈ 200 trang sách — gồm cả prompt hệ thống, lịch sử chat và câu trả lời.`},{en:`Input / Output Tokens`,vi:`Token đầu vào / đầu ra`,category:`token`,definition:`Input tokens = prompt gửi lên; output tokens = câu trả lời sinh ra. Nhà cung cấp tính giá khác nhau cho 2 loại này.`,example:`Claude: input $3/M, output $15/M — output đắt hơn vì tốn tính toán sinh từng token.`},{en:`Max Tokens`,vi:`Giới hạn token sinh ra`,category:`token`,definition:`Tham số giới hạn số token output tối đa một lần sinh; nếu câu trả lời dài hơn sẽ bị cắt giữa chừng.`,example:`max_tokens=500 → câu trả lời dài 800 tokens bị cắt, kiểm tra finish_reason='length' để xử lý.`},{en:`Token Estimation`,vi:`Ước lượng token`,category:`token`,definition:`Kỹ thuật ước lượng nhanh số token để tính chi phí và kiểm soát context trước khi gọi API.`,example:`Quy tắc gần đúng: tiếng Anh ~1.3 token/từ, 4 ký tự ≈ 1 token; dùng tiktoken để đếm chính xác.`},{en:`Prompt Caching`,vi:`Bộ nhớ đệm prompt`,category:`token`,definition:`Nhà cung cấp cache phần prefix lặp lại giữa các request, tính giá rẻ hơn nhiều (còn 10%) cho token được cache.`,example:`Chat lặp lại system prompt + tài liệu dài → sau lần đầu, phần đó được cache, tiết kiệm tới 90% chi phí.`},{en:`Context Truncation`,vi:`Cắt ngắn ngữ cảnh`,category:`token`,definition:`Khi vượt context window, hệ thống phải cắt bớt (drop message cũ, tóm tắt, hoặc báo lỗi) — ảnh hưởng đến chất lượng.`,example:`Chat dài bị quên tin nhắn đầu vì bị truncate; giải pháp: summary buffer, RAG, sliding window.`},{en:`Rate Limit`,vi:`Giới hạn tốc độ`,category:`quota`,definition:`Nhà cung cấp giới hạn số request/khối lượng token trong một khoảng thời gian để bảo vệ hệ thống.`,example:`Giới hạn 60 requests/phút hoặc 100K tokens/phút cho tier miễn phí.`},{en:`RPM / TPM`,vi:`Requests / Tokens per minute`,category:`quota`,definition:`Đơn vị quota: RPM = số request mỗi phút, TPM = số token mỗi phút (input+output) cho phép.`,example:`Gói 100 RPM / 500K TPM → mỗi phút tối đa 100 lần gọi và 500K tokens.`},{en:`Token Bucket`,vi:`Xô token`,category:`quota`,definition:`Thuật toán điều tiết: bucket chứa tokens 'nạp' đều theo thời gian, mỗi request tốn tokens; hết thì chờ.`,example:`Bucket 10 tokens, nạp 1/s → bùng nổ 10 request ngay lập tức, sau đó 1 request/s.`},{en:`Retry & Backoff`,vi:`Thử lại và lùi thời gian`,category:`quota`,definition:`Khi gặp lỗi 429 (rate limit) hoặc 5xx, tự thử lại với thời gian chờ tăng dần (exponential backoff) + jitter.`,example:`Lần 1 chờ 1s, lần 2 chờ 2s, lần 3 chờ 4s... tối đa 5 lần, kèm jitter ngẫu nhiên tránh thundering herd.`},{en:`HTTP 429`,vi:`Mã lỗi quá tải`,category:`quota`,definition:`Too Many Requests — yêu cầu vượt quota; response có header Retry-After để biết chờ bao lâu.`,example:`429 + 'Retry-After: 30' → đợi 30s hoặc dùng backoff trước khi gọi lại.`},{en:`Quota`,vi:`Hạn mức`,category:`quota`,definition:`Tổng tài nguyên (token, request, chi phí) người dùng được phép dùng trong kỳ (ngày/tháng) theo gói đăng ký.`,example:`Gói free 1M tokens/tháng; dùng hết phải chờ tháng sau hoặc nâng cấp.`},{en:`Pricing per Token`,vi:`Giá theo token`,category:`quota`,definition:`Cách tính tiền phổ biến: trả theo số token input và output, khác nhau theo model và tier.`,example:`Model A: $1/M input, $10/M output → 10K in + 2K out = $0.01 + $0.02 = $0.03.`},{en:`Cost Optimization`,vi:`Tối ưu chi phí`,category:`quota`,definition:`Giảm tiền AI bằng cách: prompt ngắn, model rẻ cho task dễ, cache, batch, giảm output token, quản lý context.`,example:`Dùng mini model cho classification, big model chỉ cho task khó → giảm 70% chi phí.`},{en:`Budget & Alert`,vi:`Ngân sách và cảnh báo`,category:`quota`,definition:`Đặt ngân sách tháng, theo dõi chi phí realtime, cảnh báo khi vượt ngưỡng để tránh sốc hóa đơn.`,example:`Alert 80% ngân sách → tự chuyển model rẻ hơn hoặc chặn request mới.`},{en:`Edge AI`,vi:`AI tại biên`,category:`edge`,definition:`Chạy suy luận AI ngay trên thiết bị (điện thoại, laptop, IoT) thay vì gửi lên cloud — giảm latency, tăng privacy, hoạt động offline.`,example:`Google Translate chạy offline trên điện thoại, FaceID trên iPhone.`},{en:`On-Device LLM`,vi:`LLM trên thiết bị`,category:`edge`,definition:`Mô hình ngôn ngữ nhỏ chạy cục bộ trên thiết bị người dùng, không cần internet, dữ liệu không rời máy.`,example:`Ollama + Llama 3.2 3B, Gemma 2B, Qwen 0.5B chạy trên laptop/điện thoại.`},{en:`Quantization`,vi:`Lượng tử hóa`,category:`edge`,definition:`Giảm độ chính xác của trọng số (FP16 → INT8/INT4) để giảm kích thước và tăng tốc suy luận, đánh đổi chút chất lượng.`,example:`Model 7B FP16 ≈ 14GB → INT4 ≈ 4GB, chạy được trên máy 8GB RAM.`},{en:`Model Compression`,vi:`Nén mô hình`,category:`edge`,definition:`Nhóm kỹ thuật làm model nhỏ/nhanh hơn: quantization, pruning (tỉa), distillation (mô hình thầy-trò), low-rank (LoRA).`,example:`Distillation: GPT-4 (thầy) dạy model 7B (trò) → model nhỏ học được phần lớn khả năng.`},{en:`WebGPU`,vi:`WebGPU`,category:`edge`,definition:`API chuẩn cho phép trình duyệt tận dụng GPU để chạy suy luận neural network trực tiếp trên web.`,example:`WebLLM, Transformers.js chạy LLM/embedding ngay trong trình duyệt không cần server.`},{en:`WebAssembly`,vi:`WASM`,category:`edge`,definition:`Binary format chạy tốc độ gần native trên trình duyệt; dùng để chạy tokenizer, mô hình nhỏ, pipeline AI tại client.`,example:`Mô hình Whisper nhỏ chạy WASM để transcribe giọng nói 100% trên trình duyệt.`},{en:`Federated Learning`,vi:`Học liên kết`,category:`edge`,definition:`Huấn luyện mô hình trên nhiều thiết bị, chỉ gửi bản cập nhật gradient về server — dữ liệu không bao giờ rời máy.`,example:`Gboard học từ phong cách gõ của người dùng mà không thu thập nội dung gõ về Google.`},{en:`ML Kit / Core ML`,vi:`SDK on-device AI`,category:`edge`,definition:`SDK của Google (ML Kit) và Apple (Core ML) cho phép chạy model và task AI sẵn có ngay trên mobile.`,example:`ML Kit text recognition, Core ML convert PyTorch model sang .mlmodel chạy trên iPhone.`},{en:`Latency & Privacy`,vi:`Độ trễ và quyền riêng tư`,category:`edge`,definition:`Hai lợi ích chính của edge AI: phản hồi tức thì không cần mạng, và dữ liệu nhạy cảm không gửi lên cloud.`,example:`Camera an ninh nhận diện khuôn mặt ngay trên camera thay vì stream video lên server.`}],window.aiAgentQuizData={general:[{question:`AI Agent khác với chatbot thông thường ở điểm nào?`,options:[`Có khả năng tự chủ hành động, gọi tools, lập kế hoạch`,`Chỉ trả lời câu hỏi`,`Không dùng LLM`,`Chạy nhanh hơn`],correct:0},{question:`Pattern ReAct trong agent nghĩa là gì?`,options:[`ReactJS framework`,`Luân phiên Reason (Thought) → Action → Observation`,`Reactive programming`,`Rèn luyện lại mô hình`],correct:1},{question:`Function Calling cho phép model làm gì?`,options:[`Trả về cấu trúc JSON gọi hàm cụ thể kèm tham số`,`Tự cài đặt phần mềm`,`Gửi email không cần API`,`Viết code bằng mọi ngôn ngữ`],correct:0},{question:`MCP (Model Context Protocol) là gì?`,options:[`Một loại model AI`,`Giao thức mở chuẩn hóa kết nối LLM với tools và data`,`Ngôn ngữ lập trình cho agent`,`Một framework UI`],correct:1},{question:`Vòng lặp agentic (agentic loop) hoạt động thế nào?`,options:[`Gọi LLM một lần duy nhất`,`LLM quyết định → thực thi tool → đưa kết quả về LLM → lặp lại`,`Chạy không cần LLM`,`Chỉ gọi API một lần`],correct:1},{question:`Tác dụng chính của RAG trong agent?`,options:[`Làm model chạy nhanh hơn`,`Giảm hallucination bằng cách truy xuất tài liệu liên quan đưa vào context`,`Tăng kích thước model`,`Mã hóa dữ liệu`],correct:1},{question:`Multi-agent khác single agent ở điểm nào?`,options:[`Nhiều agent chuyên biệt phối hợp, mỗi agent một vai trò`,`Dùng nhiều GPU hơn`,`Chạy nhiều model cùng lúc`,`Không dùng LLM`],correct:0},{question:`Agent Memory chia làm mấy loại chính?`,options:[`1 loại`,`2 loại`,`3 loại: short-term, long-term, working memory`,`Không có memory`],correct:2}],token:[{question:`Token trong LLM là gì?`,options:[`Đơn vị cơ bản model xử lý văn bản (từ/subword/ký tự)`,`Mật khẩu API`,`Một loại model`,`Đơn vị đo tốc độ mạng`],correct:0},{question:`Context window là gì?`,options:[`Cửa sổ trình duyệt`,`Số token tối đa model nhận trong một lần gọi (input + output)`,`Kích thước màn hình`,`Bộ nhớ RAM`],correct:1},{question:`Tại sao output tokens thường đắt hơn input tokens?`,options:[`Vì output dài hơn`,`Vì sinh từng token tốn tính toán hơn đọc prompt`,`Vì nhà cung cấp thích vậy`,`Vì output cần GPU riêng`],correct:1},{question:`Prompt caching giúp gì?`,options:[`Cache phần prefix lặp lại, giảm chi phí tới 90%`,`Làm model nhanh hơn 2 lần`,`Tăng context window`,`Mã hóa prompt`],correct:0},{question:`finish_reason='length' nghĩa là gì?`,options:[`Câu trả lời bị cắt do vượt max_tokens`,`Hoàn thành bình thường`,`Lỗi network`,`Prompt quá ngắn`],correct:0},{question:`Ước lượng token gần đúng cho tiếng Anh là gì?`,options:[`1 từ ≈ 1.3 token`,`1 từ ≈ 10 token`,`1 từ ≈ 0.1 token`,`1 từ ≈ 1 token chính xác`],correct:0},{question:`Khi chat dài vượt context window, điều gì xảy ra?`,options:[`Model tự mở rộng memory`,`Bị truncate/cắt bớt, tin nhắn cũ bị quên`,`Model bị crash`,`Không có gì xảy ra`],correct:1}],quota:[{question:`RPM và TPM nghĩa là gì?`,options:[`Requests và Tokens per minute`,`Realtime Processing Model`,`Random Path Memory`,`Remote Process Manager`],correct:0},{question:`HTTP 429 nghĩa là gì?`,options:[`Internal Server Error`,`Too Many Requests — vượt rate limit/quota`,`Not Found`,`Unauthorized`],correct:1},{question:`Exponential backoff dùng để làm gì?`,options:[`Tăng tốc request`,`Thử lại với thời gian chờ tăng dần khi gặp 429/5xx`,`Giảm giá API`,`Mã hóa request`],correct:1},{question:`Token Bucket algorithm hoạt động thế nào?`,options:[`Bucket chứa tokens nạp đều theo thời gian, request tốn tokens`,`Chỉ cho 1 request mỗi giờ`,`Không giới hạn gì`,`Dùng blockchain`],correct:0},{question:`Cách tốt nhất khi gặp lỗi 429?`,options:[`Gửi lại ngay lập tức nhiều lần`,`Đợi theo Retry-After hoặc backoff + jitter rồi thử lại`,`Bỏ luôn request`,`Đổi API key`],correct:1},{question:`Làm sao giảm chi phí AI hiệu quả?`,options:[`Dùng model rẻ cho task dễ, tối ưu prompt, cache, giảm output`,`Gọi API nhiều lần hơn`,`Dùng model lớn nhất cho mọi thứ`,`Không thể giảm`],correct:0}],edge:[{question:`Edge AI là gì?`,options:[`AI chạy trên thiết bị biên (điện thoại, IoT) thay vì cloud`,`AI của công ty Edge`,`AI chạy ở biên giới`,`Một loại model`],correct:0},{question:`Quantization giúp gì cho on-device AI?`,options:[`Giảm kích thước model (FP16 → INT8/INT4) để chạy trên thiết bị nhỏ`,`Tăng độ chính xác`,`Làm model lớn hơn`,`Mã hóa model`],correct:0},{question:`Lợi ích chính của AI at edge là gì?`,options:[`Giảm latency và tăng privacy (dữ liệu không rời máy)`,`Rẻ hơn cloud`,`Model lớn hơn`,`Không cần CPU`],correct:0},{question:`WebGPU dùng để làm gì?`,options:[`Chạy suy luận neural network trong trình duyệt bằng GPU`,`Tăng tốc network`,`Vẽ đồ họa game`,`Lưu trữ data`],correct:0},{question:`Federated Learning là gì?`,options:[`Huấn luyện trên nhiều thiết bị, chỉ gửi gradient về server`,`Học trên một máy chủ trung tâm`,`Một loại mạng neural`,`Không liên quan AI`],correct:0},{question:`Model 7B FP16 ≈ 14GB, sau quantization INT4 còn bao nhiêu?`,options:[`~4GB`,`~14GB`,`~1GB`,`~100GB`],correct:0}]},window.aiAgentTopics=[{file:`README.md`,title:`🤖 AI Agent — Tổng quan`,content:`Tất tần tật về **AI Agent**: từ khái niệm, kiến trúc, tools, token, quota, chi phí đến AI at Edge.

## 📑 Lộ trình học

1. **[Agent Fundamentals](#)** — Agent là gì, ReAct, Planning, Memory, Multi-agent
2. **[Tools & Function Calling](#)** — Tool use, MCP, guardrails, frameworks
3. **[Token & Context](#)** — Tokenization, context window, đếm & tối ưu token
4. **[Quota & Rate Limit](#)** — RPM/TPM, token bucket, retry/backoff, xử lý 429
5. **[Chi phí & Tối ưu Cost](#)** — Pricing per token, caching, budget
6. **[AI at Edge](#)** — On-device LLM, quantization, WebGPU/WASM, federated learning
7. **[Xây dựng Agent thực tế](#)** — Kiến trúc, best practices, debugging
8. **[Mini Project](#)** — 4 dự án thực hành từ cơ bản đến nâng cao

## 🎯 Mục tiêu

- Hiểu rõ agent hoạt động thế nào (vòng lặp, tools, memory)
- Nắm vững token, context window, cách tính & tối ưu chi phí
- Biết cách xử lý quota, rate limit khi gọi AI API
- Hiểu AI at Edge và khi nào nên chọn on-device vs cloud
- Làm được mini project agent thực tế`,checklist:[`Hiểu AI Agent là gì và khác chatbot thế nào`,`Biết vòng lặp agent (reason → act → observe)`,`Hiểu token, context window và cách tính chi phí`,`Biết xử lý rate limit (429, backoff)`,`Hiểu AI at Edge và on-device LLM`]},{file:`Bai1_Agent_Fundamentals.md`,title:`📄 BÀI 1 — AGENT FUNDAMENTALS`,content:`## 1. AI Agent là gì?

**AI Agent** là hệ thống AI **tự chủ** có khả năng:

| Khả năng | Mô tả |
|---|---|
| **Perceive** | Nhận biết trạng thái, dữ liệu từ môi trường (user input, API, sensors) |
| **Reason** | Suy luận bằng LLM để quyết định nên làm gì |
| **Plan** | Chia mục tiêu lớn thành các bước nhỏ |
| **Act** | Thực thi qua tools (gọi API, chạy code, thao tác file) |
| **Learn** | Cải thiện từ feedback, lưu trữ memory |

> Chatbot chỉ *trả lời*, agent *hành động* và hoàn thành mục tiêu.

## 2. Vòng lặp Agentic (Agentic Loop)

Trái tim của agent — vòng lặp lặp đi lặp lại:

\`\`\`text
[1] User yêu cầu mục tiêu
        ↓
[2] LLM suy luận (Thought) → quyết định gọi tool nào
        ↓
[3] Hệ thống thực thi tool (Action) → nhận kết quả (Observation)
        ↓
[4] Kết quả đưa về LLM → LLM suy luận tiếp / hoặc kết thúc (Answer)
        ↓
[lặp lại 2→4 cho đến khi hoàn thành]
\`\`\`

Ví dụ agent "đặt vé máy bay":

\`\`\`text
User: Đặt vé HN → ĐN ngày 20/8, chuyến chiều
Thought: Cần tìm chuyến bay trước
Action: search_flights(from=HAN, to=DAD, date=20/8)
Observation: Có 3 chuyến, chuyến VN123 lúc 14:00 giá 1.2tr
Thought: Chọn chuyến VN123, cần đặt ghế
Action: book_flight(id=VN123, seat=window)
Observation: Đặt thành công, mã vé XYZ123
Thought: Mục tiêu hoàn thành → trả lời user
Answer: Đã đặt vé VN123 14:00 ngày 20/8, mã XYZ123 ✅
\`\`\`

## 3. Pattern ReAct

**ReAct = Reason + Act**: chia suy luận thành 3 phần rõ ràng:

- **Thought**: lý luận trung gian ("tôi cần dữ liệu X để trả lời")
- **Action**: hành động cụ thể ("gọi tool get_weather(city)")
- **Observation**: kết quả quan sát được ("trời mưa 25°C")

ReAct giúp agent: ít hallucination hơn, dễ debug (xem được chuỗi suy luận), giải được bài toán nhiều bước.

## 4. Planning & Memory

**Planning**: chia mục tiêu thành kế hoạch nhiều bước:
- Lập kế hoạch trước (plan-then-execute) hoặc vừa làm vừa lập (dynamic planning)
- Kỹ thuật: Task decomposition, Tree-of-Thoughts, Reflection (tự đánh giá lại kế hoạch)

**Memory** (bộ nhớ agent) chia 3 loại:

| Loại | Lưu ở đâu | Ví dụ |
|---|---|---|
| **Short-term** | Context window | Lịch sử chat trong session |
| **Long-term** | Vector DB, files, DB | Kiến thức học được qua nhiều session |
| **Working** | Session state | Biến tạm, kết quả trung gian |

## 5. Multi-Agent Systems

Khi task phức tạp, thay vì 1 agent "làm tất", chia thành nhiều agent chuyên biệt:

\`\`\`text
            Orchestrator Agent
           /        |          \\
    Researcher    Writer      Reviewer
   (tìm tài liệu) (viết nội dung) (kiểm tra chất lượng)
\`\`\`

**Lợi ích**: mỗi agent giỏi 1 việc, dễ maintain, xử lý song song.
**Thách thức**: giao tiếp giữa các agent, chia sẻ context, chi phí token tăng, khó debug.

## 📝 Checklist

- [ ] Giải thích được AI Agent khác chatbot thế nào
- [ ] Vẽ được vòng lặp agentic (Thought → Action → Observation)
- [ ] Hiểu pattern ReAct và lợi ích của nó
- [ ] Phân biệt 3 loại memory của agent
- [ ] Hiểu ưu/nhược điểm của multi-agent`,checklist:[`Giải thích được AI Agent khác chatbot thế nào`,`Vẽ được vòng lặp agentic (Thought → Action → Observation)`,`Hiểu pattern ReAct và lợi ích của nó`,`Phân biệt 3 loại memory của agent`,`Hiểu ưu/nhược điểm của multi-agent`]},{file:`Bai2_Tools_FunctionCalling.md`,title:`📄 BÀI 2 — TOOLS & FUNCTION CALLING`,content:`## 1. Tool Use là gì?

LLM chỉ biết suy luận trên text — muốn agent **hành động** phải có **tools** (công cụ):

- Gọi API bên ngoài (weather, payment, search)
- Truy vấn database
- Chạy code, thao tác file
- Gửi email, message

> Không có tools, agent chỉ là chatbot; có tools, agent mới thực sự *làm việc được*.

## 2. Function Calling hoạt động thế nào?

**Bước 1** — Khai báo tool (schema) cho model:

\`\`\`json
{
  "name": "get_weather",
  "description": "Lấy thời tiết hiện tại theo thành phố",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "Tên thành phố" }
    },
    "required": ["city"]
  }
}
\`\`\`

**Bước 2** — Model trả về lời gọi hàm (không tự thực thi!):

\`\`\`json
{
  "name": "get_weather",
  "arguments": "{"city": "Hanoi"}"
}
\`\`\`

**Bước 3** — Code của bạn thực thi hàm thật, lấy kết quả.

**Bước 4** — Đưa kết quả về model để model trả lời cuối cùng.

> ⚠️ Model **không thực thi** tool — nó chỉ *đề xuất*. Code của bạn quyết định có chạy hay không.

## 3. Tool Choice

Điều khiển model có được gọi tool không:

| Giá trị | Hành vi |
|---|---|
| \`auto\` | Model tự quyết định gọi tool hay không |
| \`required\` | Model **bắt buộc** gọi tool (dùng khi không có tool thì không trả lời được) |
| \`none\` | Cấm gọi tool (chỉ chat) |

## 4. MCP — Model Context Protocol

**MCP** (ra mắt 2024 bởi Anthropic) là giao thức mở chuẩn hóa kết nối LLM với **tools và data sources**:

- **MCP Server**: cung cấp tools/resources (VD: server kết nối GitHub, database, filesystem)
- **MCP Client**: ứng dụng agent kết nối tới server
- **Kiến trúc 3 thành phần**: Resources (data), Tools (hành động), Prompts (mẫu)

> Ví von: MCP là **"USB-C cho AI"** — một chuẩn duy nhất, cắm là chạy, không cần tích hợp riêng từng API.

## 5. Guardrails — Rào chắn an toàn

Agent có thể hành động sai/nguy hiểm, cần **guardrails**:

- Validate input trước khi thực thi tool
- Danh sách allowlist/denylist tool
- Yêu cầu xác nhận với hành động nhạy cảm (delete, pay, send)
- Kiểm tra kết quả tool trước khi đưa về model
- Log toàn bộ hành động để audit

## 6. Agent Frameworks phổ biến

| Framework | Đặc điểm |
|---|---|
| **LangChain** | Hệ sinh thái lớn, nhiều integration |
| **LlamaIndex** | Mạnh về RAG và data ingestion |
| **CrewAI** | Multi-agent role-based, dễ dùng |
| **OpenAI Agents SDK** | Nhẹ, đi kèm OpenAI API |
| **Google ADK** | Agent Development Kit của Google |

Framework giúp khỏi phải tự code vòng lặp agent, tool registry, memory.

## 📝 Checklist

- [ ] Hiểu vì sao agent cần tools
- [ ] Viết được tool schema JSON
- [ ] Hiểu model không tự thực thi tool, mà do code của bạn chạy
- [ ] Biết MCP là gì và kiến trúc của nó
- [ ] Áp dụng guardrails cho agent`,checklist:[`Hiểu vì sao agent cần tools`,`Viết được tool schema JSON`,`Hiểu model không tự thực thi tool, mà do code của bạn chạy`,`Biết MCP là gì và kiến trúc của nó`,`Áp dụng guardrails cho agent`]},{file:`Bai3_Token_Context.md`,title:`📄 BÀI 3 — TOKEN & CONTEXT WINDOW`,content:`## 1. Token là gì?

**Token** là đơn vị cơ bản mà LLM xử lý văn bản:

- Có thể là **cả từ** (\`apple\`), **subword** (\`un\` + \`believable\`) hoặc **ký tự**
- Mỗi model có **tokenizer riêng** với từ điển (vocabulary) riêng
- Tokenizer phổ biến: **BPE** (Byte-Pair Encoding), **SentencePiece**

\`\`\`text
"I love AI" → ["I", " love", " AI"]  (3-4 tokens tùy model)
"xin chào"  → thường nhiều token hơn tiếng Anh cùng nghĩa
\`\`\`

> Tiếng Việt có dấu thường tốn **nhiều token hơn** tiếng Anh cho cùng một nội dung → chi phí cao hơn.

## 2. Context Window

**Context window** = số token tối đa model nhận trong **một lần gọi**:

\`\`\`text
Tổng context = System prompt + lịch sử chat + tool results + user input + output
                ↑ hết chỗ là vấn đề ↑
\`\`\`

| Model | Context window |
|---|---|
| GPT-4o / Claude | ~128K tokens (≈ 200 trang sách) |
| Gemini 1.5/2.x | 1M+ tokens |
| Model nhỏ (on-device) | 4K – 32K tokens |

**Khi vượt context window**:
1. Bị **truncate** (cắt bớt message cũ) → mất ngữ cảnh đầu
2. Hoặc lỗi 400 (request quá lớn)
3. Giải pháp: tóm tắt lịch sử, RAG, sliding window

## 3. Input vs Output Tokens

- **Input tokens**: prompt bạn gửi lên (system, history, docs, tool results)
- **Output tokens**: câu trả lời model sinh ra

> Output thường **đắt hơn 3-5 lần** input vì model phải tính toán sinh từng token từ đầu.

## 4. Đếm và ước lượng token

**Ước lượng nhanh**:
- Tiếng Anh: ~**1.3 token/từ**, hoặc **4 ký tự ≈ 1 token**
- 100 tokens ≈ 75 từ tiếng Anh

**Đếm chính xác**:
- Dùng thư viện tokenizer của provider: \`tiktoken\` (OpenAI), \`tokenizers\` (HuggingFace)
- API trả về \`usage\` field sau mỗi call (prompt_tokens, completion_tokens, total_tokens)

## 5. Prompt Caching — Tiết kiệm chi phí

Nhiều provider cache **prefix giống nhau** giữa các request:

- Cache hit: chỉ tính **~10% giá** token
- Cache miss: giá 100% + phí ghi cache nhỏ

**Áp dụng khi nào**:
- Chat lặp lại system prompt dài
- Agent loop: context càng ngày càng dài nhưng prefix không đổi
- Đưa tài liệu hướng dẫn dài vào mỗi request

> ⚠️ Cache có cache TTL (vài phút) — không phù hợp request thưa.

## 6. Tối ưu token trong agent

| Kỹ thuật | Tác dụng |
|---|---|
| Prompt ngắn gọn, rõ ràng | Giảm input token |
| Chỉ gửi tool schema cần thiết | Giảm input token |
| Giới hạn max_tokens hợp lý | Kiểm soát output |
| Summarize lịch sử chat | Tránh vượt context |
| RAG thay vì nhét cả tài liệu | Chỉ đưa phần liên quan |
| Dùng model rẻ cho việc đơn giản | Giảm chi phí |

## 📝 Checklist

- [ ] Giải thích được token và tokenizer (BPE)
- [ ] Tính được context window gồm những phần nào
- [ ] Phân biệt input/output token và giá khác nhau
- [ ] Biết cách đếm token (tiktoken, usage field)
- [ ] Hiểu prompt caching và khi nào dùng
- [ ] Áp dụng kỹ thuật tối ưu token`,checklist:[`Giải thích được token và tokenizer (BPE)`,`Tính được context window gồm những phần nào`,`Phân biệt input/output token và giá khác nhau`,`Biết cách đếm token (tiktoken, usage field)`,`Hiểu prompt caching và khi nào dùng`,`Áp dụng kỹ thuật tối ưu token`]},{file:`Bai4_Quota_RateLimit.md`,title:`📄 BÀI 4 — QUOTA & RATE LIMIT`,content:`## 1. Tại sao có rate limit?

Nhà cung cấp AI API giới hạn tài nguyên để:
- Bảo vệ hệ thống khỏi quá tải
- Chia sẻ công bằng giữa người dùng
- Phân tầng theo gói trả phí

## 2. Các đơn vị quota quan trọng

| Đơn vị | Nghĩa | Ví dụ |
|---|---|---|
| **RPM** | Requests Per Minute — số request/phút | 60 RPM |
| **TPM** | Tokens Per Minute — số token/phút | 500K TPM |
| **RPD/TPD** | Requests/Tokens Per Day | 1M TPD |
| **Concurrency** | Số request song song tối đa | 5 concurrent |
| **Monthly quota** | Hạn mức theo tháng | 50$ free credit |

> TPM tính **input + output tokens** của tất cả request trong phút đó.

## 3. Token Bucket — Thuật toán điều tiết

Thuật toán phổ biến nhất:

\`\`\`text
Bucket dung lượng b (burst), nạp r token/giây (rate):
- Request đến: nếu bucket còn ≥ tokens cần → chấp nhận, trừ đi
- Nếu không đủ → reject (429) hoặc queue

VD: bucket=10, rate=1/s
→ Bùng nổ 10 request đầu tiên OK ngay lập tức
→ Sau đó tối đa 1 request/giây
\`\`\`

## 4. Mã lỗi thường gặp

| Mã | Ý nghĩa | Xử lý |
|---|---|---|
| **429** | Too Many Requests | Retry sau, backoff |
| **400** | Request không hợp lệ (VD: vượt context) | Sửa request |
| **401/403** | Thiếu/sai key, không có quyền | Kiểm tra key |
| **5xx** | Lỗi server | Retry (server tạm lỗi) |

429 thường kèm header **\`Retry-After\`** cho biết chờ bao lâu.

## 5. Retry & Exponential Backoff

Khi gặp 429 hoặc 5xx:

\`\`\`python
import time, random

def call_with_retry(fn, max_retries=5, base_delay=1):
    for attempt in range(max_retries):
        try:
            return fn()
        except RateLimitError as e:
            wait = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"429, retry sau {wait:.1f}s")
            time.sleep(wait)
    raise RuntimeError("Quá số lần retry")
\`\`\`

- **Exponential backoff**: chờ 1s → 2s → 4s → 8s...
- **Jitter**: + ngẫu nhiên để tránh "thundering herd" (mọi client cùng retry một lúc)
- **Max retries**: giới hạn số lần (3-5) để không treo mãi

## 6. Chiến lược tránh rate limit

1. **Queue + worker** xử lý tuần tự, kiểm soát tốc độ
2. **Rate limiter phía client** (token bucket) chủ động tự giới hạn
3. **Batch** nhiều yêu cầu nhỏ thành một (khi API hỗ trợ)
4. **Dự trữ**: giữ dưới 80% quota để có chỗ cho burst
5. **Fallback model**: khi hết quota model chính → chuyển model rẻ/dự phòng

## 📝 Checklist

- [ ] Hiểu RPM, TPM và các đơn vị quota
- [ ] Giải thích được token bucket algorithm
- [ ] Biết ý nghĩa các mã lỗi 429, 400, 5xx
- [ ] Viết được retry với exponential backoff + jitter
- [ ] Áp dụng chiến lược tránh rate limit`,checklist:[`Hiểu RPM, TPM và các đơn vị quota`,`Giải thích được token bucket algorithm`,`Biết ý nghĩa các mã lỗi 429, 400, 5xx`,`Viết được retry với exponential backoff + jitter`,`Áp dụng chiến lược tránh rate limit`]},{file:`Bai5_Cost_Optimization.md`,title:`📄 BÀI 5 — CHI PHÍ & TỐI ƯU COST`,content:`## 1. Cách tính giá AI API

Nhà cung cấp tính giá theo **token**, thường khác nhau input/output:

\`\`\`text
Ví dụ model X:
  Input:  $3  / 1M tokens
  Output: $15 / 1M tokens

Request: 10K input + 2K output
  = 10K × $3/1M + 2K × $15/1M
  = $0.03 + $0.03 = $0.06
\`\`\`

| Model | Input ($/1M) | Output ($/1M) |
|---|---|---|
| GPT-4o | 2.50 | 10.00 |
| Claude Sonnet | 3.00 | 15.00 |
| Model mini | 0.15 | 0.60 |

> 💡 Chi phí thực tế nằm ở **output** và **context dài** — tối ưu 2 thứ này là chính.

## 2. Tại sao agent tốn tiền?

Agent loop = **nhiều lần gọi LLM**:

\`\`\`text
1 request user đơn giản
  = 1 call LLM (chatbot)
  = 1K token

1 task agent phức tạp
  = 5-15 calls LLM (loop: reason → tool → observe)
  = 30-100K tokens
  = 30-100x chi phí chatbot
\`\`\`

Mỗi vòng lặp còn **gửi lại toàn bộ lịch sử** (context tăng dần) → token input tăng theo cấp số cộng.

## 3. Chiến lược tối ưu chi phí

### a. Chọn đúng model cho đúng việc
- Task đơn giản (classification, extract, summarize ngắn) → **mini model**
- Task khó (code, reasoning) → model lớn
- Có thể dùng **router** tự chọn model theo độ khó

### b. Giảm token
- Prompt ngắn gọn, bỏ bớt instructions không cần
- Chỉ gửi **tool schema** cần thiết trong từng bước
- Giới hạn **max_tokens** vừa đủ
- **Summarize** lịch sử chat dài
- **RAG**: chỉ đưa đoạn tài liệu liên quan, không cả file

### c. Tận dụng caching
- **Prompt caching**: prefix lặp lại → ~90% rẻ hơn
- Cache kết quả tool/research ở tầng ứng dụng (DB, Redis)

### d. Batch & concurrency
- Gộp nhiều request nhỏ (khi API hỗ trợ batch)
- Dùng async/concurrency tận dụng quota, giảm thời gian chờ

## 4. Budget & Monitoring

\`\`\`text
Đặt ngân sách tháng: $50
  ├── Theo dõi chi phí realtime (provider dashboard / API)
  ├── Cảnh báo ở 50%, 80%, 100% ngân sách
  ├── Hard stop: chặn request khi hết ngân sách
  └── Phân bổ theo feature/team (cost attribution)
\`\`\`

## 5. Ví dụ thực tế: tiết kiệm 70% chi phí

| Biện pháp | Tiết kiệm |
|---|---|
| Dùng mini model cho 60% traffic | ~50% |
| Prompt caching cho chat dài | ~30% |
| Giảm max_tokens 50% | ~15% |
| Summarize context dài | ~20% |

## 📝 Checklist

- [ ] Tính được chi phí một request theo token
- [ ] Hiểu vì sao agent tốn chi phí cao (loop, context)
- [ ] Chọn đúng model theo độ khó task
- [ ] Áp dụng prompt caching và giảm token
- [ ] Thiết lập budget và cảnh báo`,checklist:[`Tính được chi phí một request theo token`,`Hiểu vì sao agent tốn chi phí cao (loop, context)`,`Chọn đúng model theo độ khó task`,`Áp dụng prompt caching và giảm token`,`Thiết lập budget và cảnh báo`]},{file:`Bai6_AI_At_Edge.md`,title:`📄 BÀI 6 — AI AT EDGE`,content:`## 1. Edge AI là gì?

**Edge AI** = chạy suy luận AI **ngay trên thiết bị** (điện thoại, laptop, IoT, camera) thay vì gửi dữ liệu lên cloud:

| Tiêu chí | Cloud AI | Edge AI |
|---|---|---|
| **Latency** | 200ms – 1s+ (network) | 5-50ms (cục bộ) |
| **Privacy** | Dữ liệu gửi lên server | Dữ liệu không rời máy |
| **Offline** | Cần internet | Hoạt động không mạng |
| **Chi phí** | Trả theo API call | Trả 1 lần (model/device) |
| **Sức mạnh** | Model lớn nhất | Model nhỏ |

> Quy tắc chọn: cần độ chính xác tối đa → cloud; cần phản hồi tức thì + privacy → edge. Thực tế dùng **hybrid** cả hai.

## 2. On-Device LLM

Model nhỏ chạy cục bộ:

- **Ollama** — chạy LLM trên laptop/desktop
- **llama.cpp** — chạy được cả trên CPU/Raspberry Pi
- **MediaPipe LLM Inference** — LLM trên Android/iOS
- Model phổ biến: Llama 3.2 1B/3B, Gemma 2B, Qwen 0.5-4B, Phi-3

> Model on-device 3B có thể bằng 60-80% chất lượng model cloud 70B cho task đơn giản, nhưng nhanh và free.

## 3. Quantization — Bí quyết chạy model nhỏ

Lượng tử hóa giảm độ chính xác trọng số:

\`\`\`text
FP16 (16-bit):   model 7B ≈ 14GB → cần GPU lớn
INT8:            model 7B ≈ 7GB  → laptop chạy được
INT4:            model 7B ≈ 4GB  → điện thoại, máy 8GB RAM
\`\`\`

Mức giảm chất lượng thường nhỏ (1-3%) nhưng tiết kiệm 3-4x bộ nhớ.

## 4. Chạy AI trong trình duyệt

- **WebGPU**: API chuẩn dùng GPU trình duyệt → chạy LLM/embedding (WebLLM, Transformers.js, ONNX Runtime Web)
- **WebAssembly (WASM)**: chạy code gần native → tokenizer, model nhỏ, pipeline AI ngay tại client
- **Lợi ích**: không cần server, miễn phí, privacy, không cần key API

> VD: Trang web có thể chạy model dịch/đọc chính tả hoàn toàn trên trình duyệt của người dùng.

## 5. Các kỹ thuật nén model khác

| Kỹ thuật | Ý tưởng |
|---|---|
| **Pruning** | Tỉa bớt trọng số/kết nối không quan trọng |
| **Distillation** | Model lớn (teacher) dạy model nhỏ (student) |
| **LoRA** | Huấn luyện tham số ít hơn, chỉnh model nhỏ |
| **Low-rank decomposition** | Nén ma trận trọng số |

## 6. Federated Learning

Huấn luyện **phân tán** trên nhiều thiết bị:

\`\`\`text
Server gửi model → nhiều thiết bị
Thiết bị học trên dữ liệu local → chỉ gửi gradient về server
Server tổng hợp (Federated Averaging) → model mới
\`\`\`

**Ứng dụng**: Gboard (gõ phím), trợ lý sức khỏe, xe tự hành.

## 7. Khi nào dùng edge AI?

✅ **Nên dùng edge**:
- Ứng dụng realtime (camera, AR, giọng nói)
- Dữ liệu nhạy cảm (y tế, tài chính, doanh nghiệp)
- Không có internet ổn định
- Chi phí API quá cao khi scale

❌ **Không nên dùng edge**:
- Cần model mạnh nhất (reasoning phức tạp)
- Cần cập nhật kiến thức mới liên tục
- Thiết bị quá yếu

## 📝 Checklist

- [ ] So sánh được cloud vs edge AI
- [ ] Hiểu quantization và mức giảm kích thước
- [ ] Biết WebGPU/WASM chạy AI trong trình duyệt
- [ ] Hiểu federated learning hoạt động thế nào
- [ ] Quyết định được khi nào nên dùng edge`,checklist:[`So sánh được cloud vs edge AI`,`Hiểu quantization và mức giảm kích thước`,`Biết WebGPU/WASM chạy AI trong trình duyệt`,`Hiểu federated learning hoạt động thế nào`,`Quyết định được khi nào nên dùng edge`]},{file:`Bai7_XayDung_Agent.md`,title:`📄 BÀI 7 — XÂY DỰNG AGENT THỰC TẾ`,content:`## 1. Kiến trúc một agent hoàn chỉnh

\`\`\`text
┌─────────────────────────────────────────────┐
│                  App Layer                  │
│   UI / API / Trigger (cron, event, webhook) │
└────────────────────┬────────────────────────┘
                     ▼
┌─────────────────────────────────────────────┐
│                Agent Runtime                │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Planner │→ │  Executor│→ │ Observer  │  │
│  └──────────┘  └────┬─────┘  └─────┬─────┘  │
│         ┌───────────┴──────┐       │        │
│         ▼                  ▼       ▼        │
│   ┌─────────┐       ┌──────────┐ ┌────────┐ │
│   │ LLM(s)  │       │ Tool     │ │Memory  │ │
│   │         │       │ Registry │ │(DB/vec)│ │
│   └─────────┘       └──────────┘ └────────┘ │
└────────────────────┬────────────────────────┘
                     ▼
        ┌──────────────────────────┐
        │  External: APIs, DB, FS  │
        └──────────────────────────┘
\`\`\`

## 2. Các bước xây dựng

### Bước 1 — Định nghĩa mục tiêu & phạm vi
- Agent làm gì, input/output gì, giới hạn ở đâu
- Quyết định: single hay multi-agent

### Bước 2 — Chọn model & provider
- Model phù hợp độ khó task (mini vs lớn)
- Kiểm tra context window đủ cho workload
- Cân nhắc: cloud (GPT/Claude/Gemini) hay local (Ollama)

### Bước 3 — Thiết kế tools
- Liệt kê hành động agent cần thực hiện
- Viết schema rõ ràng: tên, mô tả, tham số, giới hạn
- Phân quyền: tool nào agent được tự gọi, tool nào cần xác nhận

### Bước 4 — Xử lý vòng lặp & error
- Giới hạn max iterations (VD: 10) tránh loop vô hạn
- Xử lý tool lỗi: retry, fallback, báo lỗi cho LLM
- Timeout tổng cho cả agent task

### Bước 5 — Memory & state
- Session state lưu ở đâu, có persist không
- Long-term memory: vector DB (Chroma, FAISS, pgvector)

### Bước 6 — Monitoring & testing
- Log toàn bộ: prompt, tool calls, kết quả, chi phí
- Evaluate bằng test case thực tế (evals)
- Theo dõi: success rate, latency, cost/task

## 3. Best Practices

1. **Prompt hệ thống rõ ràng**: mục tiêu, phong cách, giới hạn, format
2. **Tool description chi tiết** — LLM quyết định gọi tool dựa trên mô tả
3. **Validate output**: kiểm tra tool result trước khi đưa về LLM
4. **Giới hạn quyền**: principle of least privilege
5. **Human-in-the-loop** cho hành động nhạy cảm
6. **Idempotency**: chạy lại không gây hại (đặt vé 2 lần = thảm họa)
7. **Chi phí tối đa mỗi task**: giới hạn budget/agent run
8. **Fallback**: khi LLM lỗi/hết quota → model dự phòng

## 4. Debugging agent

| Vấn đề | Nguyên nhân | Cách xử lý |
|---|---|---|
| Loop vô hạn | Thiếu max iterations, plan sai | Giới hạn loop, improve prompt |
| Gọi sai tool | Tool description mơ hồ | Viết mô tả rõ, thêm example |
| Tool result rác | Không validate | Parse + validate kỹ |
| Quên context | Context bị truncate | Summarize, RAG |
| Chi phí cao | Loop dài, prompt lớn | Giảm iterations, cache, model rẻ |

## 📝 Checklist

- [ ] Vẽ được kiến trúc agent hoàn chỉnh
- [ ] Chọn đúng model và provider cho task
- [ ] Thiết kế tools với schema rõ ràng
- [ ] Xử lý được vòng lặp, error và timeout
- [ ] Thiết lập monitoring, logging, evals
- [ ] Áp dụng best practices an toàn`,checklist:[`Vẽ được kiến trúc agent hoàn chỉnh`,`Chọn đúng model và provider cho task`,`Thiết kế tools với schema rõ ràng`,`Xử lý được vòng lặp, error và timeout`,`Thiết lập monitoring, logging, evals`,`Áp dụng best practices an toàn`]},{file:`Bai8_Mini_Projects.md`,title:`📄 BÀI 8 — MINI PROJECTS`,content:`## Dự án 1 — Chatbot có Function Calling (Cơ bản)

**Mục tiêu**: chatbot hỏi thời tiết + tính toán bằng tools.

**Cấu trúc**:
\`\`\`text
chatbot/
├── weather.py     # tool get_weather (mock)
├── calculator.py  # tool calculate
├── agent.py       # vòng lặp: LLM → tool → LLM
└── main.py        # chạy CLI
\`\`\`

**Code mẫu vòng lặp đơn giản** (ý tưởng):
\`\`\`python
tools = [weather_schema, calculator_schema]

while True:
    response = llm.chat(messages, tools=tools)
    if response.tool_calls:
        for call in response.tool_calls:
            result = execute_tool(call)      # code CỦA BẠN chạy
            messages.append(tool_result(call, result))
        continue                              # loop tiếp
    print(response.text)                      # xong
    break
\`\`\`

**Checklist dự án**:
- [ ] Viết tool schema JSON
- [ ] Implement execute_tool
- [ ] Vòng lặp agent hoạt động đúng
- [ ] Xử lý khi LLM gọi sai tham số

---

## Dự án 2 — RAG Agent cho tài liệu nội bộ (Trung bình)

**Mục tiêu**: agent trả lời dựa trên tài liệu công ty, giảm hallucination.

**Cấu trúc**:
\`\`\`text
rag-agent/
├── ingest.py       # tách văn bản → chunk → embedding → vector DB
├── search.py       # semantic search top-k
├── agent.py        # retrieve → prompt → LLM
└── data/           # tài liệu nguồn
\`\`\`

**Pipeline**:
\`\`\`text
Tài liệu → chunk (500 token, overlap 50) → embedding → Chroma/FAISS
Question → embedding → search top-5 → RAG prompt → LLM → answer + sources
\`\`\`

**Checklist dự án**:
- [ ] Chunk tài liệu hợp lý
- [ ] Xây vector DB và search top-k
- [ ] Prompt RAG kèm nguồn tham chiếu
- [ ] Đánh giá độ chính xác trên 20 câu test

---

## Dự án 3 — Agent hỗ trợ coding (Trung bình)

**Mục tiêu**: agent đọc repo, tìm bug, đề xuất fix.

**Tools**:
\`\`\`text
read_file(path)       # đọc file
list_files(dir)       # liệt kê
grep(pattern, path)   # tìm kiếm
run_tests()           # chạy test
\`\`\`

**Flow**: user báo bug → agent grep tìm liên quan → đọc code → xác định nguyên nhân → đề xuất fix → chạy test xác nhận.

**Checklist dự án**:
- [ ] Tools đọc/liệt kê/grep file hoạt động
- [ ] Agent tìm đúng vùng code lỗi
- [ ] Đề xuất fix có giải thích
- [ ] Chạy test xác nhận fix không phá code

---

## Dự án 4 — On-device Agent với Ollama (Nâng cao)

**Mục tiêu**: agent chạy 100% local (không tốn API, không cần internet).

**Setup**:
\`\`\`bash
# Cài Ollama, pull model nhỏ
ollama pull llama3.2:3b
ollama pull qwen2.5:1.5b

# Ollama hỗ trợ function calling (tool use)
curl http://localhost:11434/api/chat \\
  -d '{"model":"llama3.2:3b","messages":[...],"tools":[...]}'
\`\`\`

**Checklist dự án**:
- [ ] Cài Ollama và pull model
- [ ] Agent dùng tool qua Ollama API
- [ ] Xử lý rate limit local (không có, nhưng cần giới hạn tài nguyên)
- [ ] Đo latency: model 1.5B vs 3B vs 7B

---

## Mẹo khi làm project

1. Bắt đầu **đơn giản**: 1 agent, 2-3 tools, không framework
2. Log mọi tool call để debug
3. Đặt max iterations = 5, budget = $0.10/task khi test
4. Có fallback khi model không hiểu tool`,checklist:[`Làm chatbot function calling cơ bản`,`Xây RAG agent cho tài liệu nội bộ`,`Làm agent hỗ trợ coding`,`Chạy on-device agent với Ollama`,`Biết cách debug và giới hạn chi phí khi làm project`]},{file:`Bai9_Pho_Bien.md`,title:`📄 BÀI 9 — TỔNG HỢP PHỎNG VẤN AI AGENT`,content:`## Câu hỏi phỏng vấn thường gặp

### 1. Agent là gì? Khác chatbot thế nào?
Agent có khả năng **tự chủ hành động** (gọi tools, lập kế hoạch, memory) để hoàn thành mục tiêu, còn chatbot chỉ trả lời. Agent dùng vòng lặp reason → act → observe.

### 2. Giải thích ReAct?
Luân phiên **Reason + Act**: Thought (suy luận) → Action (hành động qua tool) → Observation (quan sát kết quả), lặp lại đến khi trả lời được.

### 3. Function calling hoạt động thế nào?
Model nhận tool schema → trả về JSON gọi hàm (tên + tham số) → **code của bạn thực thi** → kết quả đưa về model → model trả lời cuối.

### 4. Làm sao giảm hallucination?
- **RAG**: truy xuất tài liệu liên quan làm nguồn
- **Tool/grounding**: yêu cầu model dùng tool để lấy dữ liệu thật
- **Prompt**: yêu cầu nói 'không biết' thay vì bịa
- **Temperature thấp** cho task cần chính xác

### 5. Context window là gì? Vượt thì sao?
Tổng token tối đa 1 lần gọi (input+output). Vượt → truncate/lỗi. Giải pháp: summarize, RAG, sliding window.

### 6. Làm sao kiểm soát chi phí agent?
Chọn model theo độ khó, prompt ngắn, prompt caching, giới hạn max_tokens và max iterations, summarize context, budget + alert.

### 7. 429 là gì? Xử lý thế nào?
Too Many Requests — vượt rate limit. Xử lý: exponential backoff + jitter, đọc Retry-After, queue, giảm concurrency, fallback model.

### 8. Khi nào dùng edge AI thay vì cloud?
Khi cần latency thấp (realtime), privacy cao (dữ liệu nhạy cảm), hoạt động offline, hoặc chi phí API quá cao. Cloud khi cần model mạnh nhất và cập nhật liên tục.

### 9. MCP là gì?
Giao thức mở chuẩn hóa kết nối LLM với tools và data (resources, tools, prompts) — một chuẩn duy nhất, khỏi tích hợp riêng từng API.

### 10. Nêu cách xây agent an toàn?
Guardrails, allowlist tools, human-in-the-loop cho hành động nhạy cảm, validate tool output, log đầy đủ, principle of least privilege, idempotency.

## 📝 Checklist

- [ ] Trả lời trôi chảy 10 câu phỏng vấn trên
- [ ] Giải thích được vòng lặp agent bằng ví dụ cụ thể
- [ ] Biết cách xử lý rate limit và tối ưu chi phí
- [ ] So sánh được edge vs cloud AI`,checklist:[`Trả lời trôi chảy 10 câu phỏng vấn trên`,`Giải thích được vòng lặp agent bằng ví dụ cụ thể`,`Biết cách xử lý rate limit và tối ưu chi phí`,`So sánh được edge vs cloud AI`]}];var g=window.aiAgentConcepts;window.aiAgentQuizData;var _=window.aiAgentTopics,v=`sf_forge_stats`;function y(){try{let e=localStorage.getItem(v);if(e)return JSON.parse(e)}catch{}return{todayMinutes:0,todayDate:null,streak:0,total:0}}function b(e){try{localStorage.setItem(v,JSON.stringify(e))}catch{}}var x={name:`ForgeTimer`,data(){let e=y(),t=new Date().toDateString();return e.todayDate!==t&&(e.todayMinutes=0,e.todayDate=t,b(e)),{totalSeconds:1800,remaining:1800,isRunning:!1,interval:null,selectedDuration:`30`,streak:0,total:0}},computed:{minutes(){return Math.floor(this.remaining/60)},seconds(){return this.remaining%60},formattedTime(){return`${String(this.minutes).padStart(2,`0`)}:${String(this.seconds).padStart(2,`0`)}`},progress(){return 1-this.remaining/this.totalSeconds},dashOffset(){return 2*Math.PI*30*(1-this.progress)},todayMinutes(){let e=y(),t=new Date().toDateString();return e.todayDate===t?e.todayMinutes:0}},methods:{toggle(){this.isRunning?this.pause():this.start()},start(){this.isRunning||this.remaining<=0||(this.isRunning=!0,this.interval=setInterval(()=>{this.remaining--,this.remaining<=0&&(this.pause(),this.remaining=0,this.complete())},1e3))},pause(){this.isRunning=!1,this.interval&&=(clearInterval(this.interval),null)},reset(){this.pause();let e=parseInt(this.selectedDuration)||30;this.totalSeconds=e*60,this.remaining=this.totalSeconds},complete(){let e=y(),t=new Date().toDateString(),n=parseInt(this.selectedDuration)||30;e.todayMinutes=(e.todayDate===t?e.todayMinutes:0)+n,e.todayDate=t,e.total=(e.total||0)+1,e.todayMinutes>n&&e.todayMinutes<n*2&&(e.streak=(e.streak||0)+1),b(e),this.todayMinutes=e.todayMinutes,this.streak=e.streak,this.total=e.total}},beforeUnmount(){this.pause()}},S={class:`forge-timer-wrap`},C={class:`forge-timer-ring`},w={viewBox:`0 0 68 68`},T={class:`forge-time`},E={class:`forge-controls`},D={class:`forge-btn-row`},O={class:`forge-stats`},k={class:`forge-stat-row`},A={class:`val fire`},j={class:`forge-stat-row`},M={class:`val`},N={class:`forge-stat-row`},P={class:`val`};function F(t,n,r,i,s,u){return o(),a(`div`,S,[c(`div`,C,[(o(),a(`svg`,w,[n[4]||=c(`circle`,{class:`forge-ring-bg`,cx:`34`,cy:`34`,r:`30`},null,-1),c(`circle`,{class:`forge-ring-progress`,style:e({strokeDashoffset:u.dashOffset}),cx:`34`,cy:`34`,r:`30`},null,4)])),c(`div`,T,p(u.formattedTime),1)]),c(`div`,E,[m(c(`select`,{"onUpdate:modelValue":n[0]||=e=>s.selectedDuration=e,onChange:n[1]||=(...e)=>u.reset&&u.reset(...e)},[...n[5]||=[c(`option`,{value:`30`},`30p`,-1),c(`option`,{value:`60`},`1h`,-1)]],544),[[f,s.selectedDuration]]),c(`div`,D,[c(`button`,{class:`forge-btn forge-btn-primary`,onClick:n[2]||=(...e)=>u.toggle&&u.toggle(...e)},p(s.isRunning?`⏸`:`⚒️`),1),c(`button`,{class:`forge-btn forge-btn-secondary`,onClick:n[3]||=(...e)=>u.reset&&u.reset(...e)},`↻`)])]),c(`div`,O,[c(`div`,k,[n[6]||=l(`📋 Hôm nay `,-1),c(`span`,A,p(u.todayMinutes)+`m`,1)]),c(`div`,j,[n[7]||=l(`🔥 Streak `,-1),c(`span`,M,p(s.streak)+`🔥`,1)]),c(`div`,N,[n[8]||=l(`📦 Đã rèn `,-1),c(`span`,P,p(s.total),1)])])])}var I=u(x,[[`render`,F],[`__scopeId`,`data-v-f0561c5b`]]),L=`aiAgentChecklist`;function R(){try{return JSON.parse(localStorage.getItem(L)||`{}`)}catch{return{}}}function z(e){localStorage.setItem(L,JSON.stringify(e))}function B(e,t){let n=0,r=0;return e.forEach(e=>{e.checklist&&e.checklist.forEach(e=>{n++,t[e]&&r++})}),{done:r,total:n,percent:n>0?Math.round(r/n*100):0}}function V(e,t){let n=e.checklist||[];return{done:n.filter(e=>t[e]).length,total:n.length}}var H=[{id:`learn`,label:`Học`,icon:`📚`},{id:`quiz`,label:`Thi`,icon:`🎯`},{id:`lessons`,label:`Bài học`,icon:`📖`}],U={name:`AiAgentPage`,components:{ForgeTimer:I},data(){return{tabs:H,activeTab:`learn`,filterCategory:`all`,currentIndex:0,isFlipped:!1,selectedLesson:0,concepts:g,lessons:_,checklist:{}}},computed:{filteredCards(){return this.filterCategory===`all`?this.concepts:this.concepts.filter(e=>e.category===this.filterCategory)},currentCard(){return this.filteredCards[this.currentIndex]},lessonProgress(){return B(this.lessons,this.checklist)},renderedLesson(){let e=this.lessons[this.selectedLesson];if(!e)return``;let t=e.content?this.renderMarkdown(e.content):``;return e.checklist&&e.checklist.length>0&&(t+=`<h3>📝 Checklist</h3>`,e.checklist.forEach(e=>{let n=!!this.checklist[e],r=e.replace(/"/g,`&quot;`);t+=`
            <label class="checklist-item ${n?`checked`:``}">
              <input type="checkbox" ${n?`checked`:``} data-item="${r}">
              <span>${e}</span>
            </label>`})),t}},mounted(){this.checklist=R(),this.$nextTick(()=>this.bindLessonEvents())},updated(){this.$nextTick(()=>this.bindLessonEvents())},methods:{handleNavigate(e){h(e)},filterCategory(){this.currentIndex=0,this.isFlipped=!1},prevCard(){this.currentIndex>0&&(this.currentIndex--,this.isFlipped=!1)},nextCard(){this.currentIndex<this.filteredCards.length-1&&(this.currentIndex++,this.isFlipped=!1)},toggleLessonItem(e,t){this.checklist={...this.checklist,[e]:t},z(this.checklist)},getLessonProgress(e){let t=this.lessons[e];if(!t)return`0/0`;let{done:n,total:r}=V(t,this.checklist);return`${n}/${r}`},bindLessonEvents(){document.querySelectorAll(`.ai-lesson-content .checklist-item input`).forEach(e=>{e._bound||(e._bound=!0,e.addEventListener(`change`,()=>{this.toggleLessonItem(e.dataset.item,e.checked);let t=e.closest(`.checklist-item`);t&&t.classList.toggle(`checked`,e.checked)}))})},renderMarkdown(e){return e?e.replace(/^#{1,6} (.+)$/gm,(e,t)=>`<h${t.length}>${t}</h${t.length}>`).replace(/\*\*(.+?)\*\*/g,`<strong>$1</strong>`).replace(/\n\n/g,`</p><p>`).replace(/^(?!<[h|p|u|o|l|b|c])(.+)$/gm,`<p>$1</p>`).replace(/<p><\/p>/g,``):``}}},W={class:`page-root`,style:{"--color-accent":`#f472b6`}},G={class:`container`},K={class:`ai-topbar`},te={class:`topbar-right`},q={class:`ai-tabs`},J=[`onClick`],Y={key:0,class:`ai-section active`},X={class:`ai-card-filter`},Z={class:`ai-card-inner`},Q={class:`ai-card-front`},ne={class:`ai-card-category`},re={class:`ai-card-en`},ie={class:`ai-card-vi`},ae={class:`ai-card-def`},oe={class:`ai-card-back`},se={class:`ai-card-ex`},ce={class:`ai-card-counter`},le={class:`ai-card-controls`},ue={key:1,class:`ai-section`},de={class:`quiz-placeholder`},fe={class:`quiz-categories`},pe={key:2,class:`ai-section`},$={class:`ai-lesson-layout`},me={class:`ai-lesson-sidebar`},he={class:`ai-lesson-list`},ge=[`onClick`],_e={class:`ai-lesson-stat`},ve={class:`ai-lesson-progress`},ye={class:`progress-track`},be={class:`ai-lesson-content`},xe={class:`ai-lesson-card`},Se=[`innerHTML`];function Ce(l,u,h,g,_,v){let y=ee(`ForgeTimer`);return o(),a(`div`,W,[c(`div`,G,[c(`header`,K,[u[8]||=c(`div`,{class:`topbar-left`},[c(`h1`,null,`🤖 Học AI Agent`),c(`p`,null,`Agent — Tools — Token — Quota — AI at Edge`)],-1),c(`div`,te,[s(y),c(`button`,{class:`home-btn`,type:`button`,"aria-label":`Về trang chủ`,title:`Về trang chủ`,onClick:u[0]||=e=>v.handleNavigate(`/`)},`🏠`)])]),c(`nav`,q,[(o(!0),a(r,null,n(_.tabs,e=>(o(),a(`button`,{key:e.id,class:t([`ai-tab`,{active:_.activeTab===e.id}]),onClick:t=>_.activeTab=e.id},p(e.icon)+` `+p(e.label),11,J))),128))]),_.activeTab===`learn`?(o(),a(`section`,Y,[c(`div`,X,[m(c(`select`,{"onUpdate:modelValue":u[1]||=e=>v.filterCategory=e},[...u[9]||=[d(`<option value="all" data-v-1a229706>📂 Tất cả chủ đề</option><option value="agent" data-v-1a229706>🤖 Agent Fundamentals</option><option value="tools" data-v-1a229706>🔧 Tools &amp; MCP</option><option value="token" data-v-1a229706>🔢 Token &amp; Context</option><option value="quota" data-v-1a229706>⏳ Quota &amp; Cost</option><option value="edge" data-v-1a229706>📡 AI at Edge</option>`,6)]],512),[[f,v.filterCategory]])]),c(`div`,{class:t([`ai-card`,{flipped:_.isFlipped}]),onClick:u[2]||=e=>_.isFlipped=!_.isFlipped},[c(`div`,Z,[c(`div`,Q,[c(`span`,ne,p(v.currentCard?.category?.toUpperCase()),1),c(`div`,re,p(v.currentCard?.en),1),c(`div`,ie,p(v.currentCard?.vi),1),c(`div`,ae,p(v.currentCard?.definition),1)]),c(`div`,oe,[u[10]||=c(`span`,{class:`ai-card-category`},`VÍ DỤ`,-1),c(`div`,se,p(v.currentCard?.example),1),u[11]||=c(`p`,{class:`flip-hint`},`🔄 Click để xem lại mặt trước`,-1)])])],2),c(`p`,ce,p(_.currentIndex+1)+` / `+p(v.filteredCards.length),1),c(`div`,le,[c(`button`,{class:`ai-card-btn`,onClick:u[3]||=(...e)=>v.prevCard&&v.prevCard(...e)},`⬅️ Trước`),c(`button`,{class:`ai-card-btn`,onClick:u[4]||=e=>_.isFlipped=!_.isFlipped},`🔄 Lật`),c(`button`,{class:`ai-card-btn`,onClick:u[5]||=(...e)=>v.nextCard&&v.nextCard(...e)},`Tiếp ➡️`)])])):i(``,!0),_.activeTab===`quiz`?(o(),a(`section`,ue,[c(`div`,de,[u[12]||=c(`h3`,null,`🎯 Quiz AI Agent`,-1),u[13]||=c(`p`,null,`Tính năng quiz đang được phát triển. Hiện tại bạn có thể học flashcards và bài học.`,-1),c(`p`,fe,[c(`span`,{class:`quiz-cat-tag`,onClick:u[6]||=e=>_.activeTab=`learn`},`📚 Học flashcards`),c(`span`,{class:`quiz-cat-tag`,onClick:u[7]||=e=>_.activeTab=`lessons`},`📖 Bài học`)])])])):i(``,!0),_.activeTab===`lessons`?(o(),a(`section`,pe,[c(`div`,$,[c(`aside`,me,[u[14]||=c(`h3`,null,`📚 Bài học`,-1),c(`ul`,he,[(o(!0),a(r,null,n(_.lessons,(e,n)=>(o(),a(`li`,{key:n,class:t([`ai-lesson-item`,{active:_.selectedLesson===n}]),onClick:e=>_.selectedLesson=n},[c(`span`,null,p(e.title?.replace(/^📄 /,``)),1),c(`span`,_e,p(v.getLessonProgress(n)),1)],10,ge))),128))]),c(`div`,ve,[c(`span`,null,p(v.lessonProgress.done)+` / `+p(v.lessonProgress.total),1),c(`div`,ye,[c(`div`,{class:`progress-fill`,style:e({width:v.lessonProgress.percent+`%`})},null,4)])])]),c(`div`,be,[c(`div`,xe,[c(`h2`,null,p(_.lessons[_.selectedLesson]?.title),1),c(`div`,{class:`lesson-body`,innerHTML:v.renderedLesson},null,8,Se)])])])])):i(``,!0)])])}var we=u(U,[[`render`,Ce],[`__scopeId`,`data-v-1a229706`]]);export{we as default};