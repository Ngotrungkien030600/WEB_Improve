export const questionPatternGuide = [
  {
    id: 'be',
    title: 'Câu hỏi với am / is / are',
    pattern: 'WH-word + am / is / are + subject ...?',
    explanation: 'Dùng be khi hỏi trạng thái, danh tính hoặc hành động đang diễn ra. Chọn am với I, is với he/she/it, are với you/we/they.',
    question: 'Are you working on the API today?',
    questionVi: 'Hôm nay bạn có đang làm API không?',
    answer: 'Yes, I am. I am adding request validation.',
    answerVi: 'Có. Tôi đang thêm phần kiểm tra dữ liệu đầu vào.',
  },
  {
    id: 'do',
    title: 'Hiện tại đơn: do / does',
    pattern: 'WH-word + do / does + subject + verb (base form)?',
    explanation: 'Dùng do với I/you/we/they; dùng does với he/she/it. Sau does, động từ chính luôn trở về dạng nguyên mẫu.',
    question: 'What does this endpoint return?',
    questionVi: 'Endpoint này trả về dữ liệu gì?',
    answer: 'It returns a product response with the product ID and price.',
    answerVi: 'Nó trả về thông tin sản phẩm gồm mã sản phẩm và giá.',
  },
  {
    id: 'did',
    title: 'Quá khứ đơn: did',
    pattern: 'WH-word + did + subject + verb (base form)?',
    explanation: 'Dùng did cho mọi chủ ngữ khi hỏi việc đã xảy ra. Sau did, dùng động từ nguyên mẫu, không dùng quá khứ lần nữa.',
    question: 'Why did you choose Spring Data JPA?',
    questionVi: 'Tại sao bạn chọn Spring Data JPA?',
    answer: 'I chose it because it reduced repetitive data-access code.',
    answerVi: 'Tôi chọn nó vì nó giảm phần code truy cập dữ liệu lặp đi lặp lại.',
  },
];

export const whQuestionDialogues = {
  Where: [
    { q: 'Where do you deploy the service?', qVi: 'Bạn triển khai service ở đâu?', a: 'We deploy it to AWS after it passes the staging checks.', aVi: 'Chúng tôi triển khai lên AWS sau khi service vượt qua các bước kiểm tra ở staging.' },
    { q: 'Where are you working now?', qVi: 'Hiện tại bạn đang làm ở đâu?', a: 'I am working on a Spring Boot API for an e-commerce product.', aVi: 'Tôi đang làm API Spring Boot cho một sản phẩm thương mại điện tử.' },
  ],
  Why: [
    { q: 'Why did you choose Java for this service?', qVi: 'Tại sao bạn chọn Java cho service này?', a: 'I chose Java because our team already had strong Spring experience.', aVi: 'Tôi chọn Java vì nhóm đã có nhiều kinh nghiệm với Spring.' },
    { q: 'Why is this API slow?', qVi: 'Tại sao API này chậm?', a: 'It is slow because the query loads too many rows without an index.', aVi: 'API chậm vì truy vấn tải quá nhiều dòng và chưa có index phù hợp.' },
  ],
  What: [
    { q: 'What do you do as a developer?', qVi: 'Bạn làm công việc gì với vai trò lập trình viên?', a: 'I build backend services, review code, and help investigate production issues.', aVi: 'Tôi xây dựng backend service, review code và hỗ trợ điều tra sự cố production.' },
    { q: 'What does this endpoint return?', qVi: 'Endpoint này trả về dữ liệu gì?', a: 'It returns a response DTO and does not expose the database entity.', aVi: 'Nó trả về DTO phản hồi và không để lộ entity trong database.' },
  ],
  When: [
    { q: 'When do you use a repository method name query?', qVi: 'Khi nào bạn dùng query suy ra từ tên method của repository?', a: 'I use it when the condition is simple and the method name stays readable.', aVi: 'Tôi dùng nó khi điều kiện đơn giản và tên method vẫn dễ đọc.' },
    { q: 'When was the production issue resolved?', qVi: 'Sự cố production được xử lý khi nào?', a: 'It was resolved yesterday after we rolled back the deployment.', aVi: 'Sự cố được xử lý hôm qua sau khi chúng tôi rollback bản triển khai.' },
  ],
  How: [
    { q: 'How do you handle invalid requests?', qVi: 'Bạn xử lý request không hợp lệ như thế nào?', a: 'I validate the request DTO and return a consistent 400 response.', aVi: 'Tôi kiểm tra request DTO và trả về response 400 thống nhất.' },
    { q: 'How are you testing this change?', qVi: 'Bạn đang kiểm thử thay đổi này như thế nào?', a: 'I am running unit tests and checking the endpoint with Postman.', aVi: 'Tôi đang chạy unit test và kiểm tra endpoint bằng Postman.' },
  ],
  'How much': [
    { q: 'How much data does this report process?', qVi: 'Báo cáo này xử lý bao nhiêu dữ liệu?', a: 'It processes about fifty thousand records each day.', aVi: 'Mỗi ngày nó xử lý khoảng năm mươi nghìn bản ghi.' },
    { q: 'How much time did the optimization save?', qVi: 'Việc tối ưu tiết kiệm được bao nhiêu thời gian?', a: 'It reduced the average response time by about 40 percent.', aVi: 'Nó giảm thời gian phản hồi trung bình khoảng 40 phần trăm.' },
  ],
  'How many': [
    { q: 'How many services does this application have?', qVi: 'Ứng dụng này có bao nhiêu service?', a: 'It has five services, including the payment service.', aVi: 'Ứng dụng có năm service, bao gồm payment service.' },
    { q: 'How many requests does the API handle per minute?', qVi: 'API xử lý bao nhiêu request mỗi phút?', a: 'It handles around two thousand requests per minute at peak time.', aVi: 'Vào giờ cao điểm, API xử lý khoảng hai nghìn request mỗi phút.' },
  ],
  Who: [
    { q: 'Who reviews your pull requests?', qVi: 'Ai review pull request của bạn?', a: 'Another backend engineer reviews it, and I review their changes too.', aVi: 'Một kỹ sư backend khác review code của tôi, và tôi cũng review thay đổi của họ.' },
    { q: 'Who did you work with on the release?', qVi: 'Bạn đã phối hợp với ai trong đợt phát hành?', a: 'I worked with QA and DevOps to verify the release.', aVi: 'Tôi phối hợp với QA và DevOps để kiểm tra đợt phát hành.' },
  ],
  Which: [
    { q: 'Which database do you use for this project?', qVi: 'Dự án này dùng database nào?', a: 'We use PostgreSQL because we need reliable relational queries.', aVi: 'Chúng tôi dùng PostgreSQL vì cần các truy vấn quan hệ đáng tin cậy.' },
    { q: 'Which option is safer for this migration?', qVi: 'Phương án nào an toàn hơn cho lần migration này?', a: 'The first option is safer because it keeps the old column during rollout.', aVi: 'Phương án đầu an toàn hơn vì giữ lại cột cũ trong lúc triển khai.' },
  ],
  Whose: [
    { q: 'Whose responsibility is the database migration?', qVi: 'Ai chịu trách nhiệm cho việc migration database?', a: 'The backend team owns the migration, and DevOps monitors the deployment.', aVi: 'Nhóm backend phụ trách migration, còn DevOps theo dõi quá trình triển khai.' },
    { q: 'Whose approval do we need before deploying?', qVi: 'Chúng ta cần ai phê duyệt trước khi triển khai?', a: 'We need approval from the product owner and the release manager.', aVi: 'Chúng ta cần product owner và release manager phê duyệt.' },
  ],
};
