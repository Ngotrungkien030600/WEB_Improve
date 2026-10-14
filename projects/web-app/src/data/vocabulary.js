// Vocabulary data organized by category
export const vocabCategories = {
  itInterview: { label: 'IT & Phỏng vấn', icon: '💻' },
  greetings: { label: 'Chào hỏi & Giới thiệu', icon: '👋' },
  daily: { label: 'Sinh hoạt hàng ngày', icon: '🏠' },
  food: { label: 'Ăn uống', icon: '🍽️' },
  shopping: { label: 'Mua sắm', icon: '🛒' },
  travel: { label: 'Du lịch', icon: '✈️' },
  work: { label: 'Công việc', icon: '💼' },
  school: { label: 'Trường học', icon: '📚' },
  health: { label: 'Sức khỏe', icon: '🏥' },
  emotion: { label: 'Cảm xúc', icon: '❤️' },
  technology: { label: 'Công nghệ', icon: '💻' },
  time: { label: 'Thời gian', icon: '⏰' },
  weather: { label: 'Thời tiết', icon: '☀️' },
  nature: { label: 'Thiên nhiên', icon: '🌳' },
  family: { label: 'Gia đình', icon: '👨‍👩‍👧' },
};

export const vocabulary = [
  // IT workplace & interview vocabulary: learn each phrase through varied complete sentences.
  { en: 'take ownership', phonetic: '', vi: 'chủ động chịu trách nhiệm đến cùng', tag: 'itInterview', examples: [
    { en: 'I took ownership of the payment API from design to production.', vi: 'Tôi chịu trách nhiệm với API thanh toán từ khâu thiết kế đến khi đưa lên production.' },
    { en: 'When an issue affects the team, I take ownership instead of waiting for someone else.', vi: 'Khi một vấn đề ảnh hưởng đến nhóm, tôi chủ động nhận trách nhiệm thay vì chờ người khác.' },
    { en: 'I can take ownership of the migration and keep stakeholders updated.', vi: 'Tôi có thể phụ trách việc migration và thường xuyên cập nhật cho các bên liên quan.' },
  ] },
  { en: 'troubleshoot', phonetic: '', vi: 'điều tra và xử lý sự cố', tag: 'itInterview', examples: [
    { en: 'I troubleshoot production issues by checking logs, metrics, and recent deployments.', vi: 'Tôi điều tra sự cố production bằng cách kiểm tra log, metrics và các lần deploy gần đây.' },
    { en: 'We used a thread dump to troubleshoot the high CPU usage.', vi: 'Chúng tôi dùng thread dump để tìm nguyên nhân CPU sử dụng cao.' },
    { en: 'I enjoy troubleshooting problems that cross service boundaries.', vi: 'Tôi thích điều tra những vấn đề liên quan đến nhiều service.' },
  ] },
  { en: 'root cause', phonetic: '', vi: 'nguyên nhân gốc rễ', tag: 'itInterview', examples: [
    { en: 'We found the root cause in a missing database index.', vi: 'Chúng tôi tìm thấy nguyên nhân gốc rễ là thiếu index trong database.' },
    { en: 'Before applying a fix, I try to understand the root cause.', vi: 'Trước khi sửa, tôi cố gắng hiểu nguyên nhân gốc rễ.' },
    { en: 'The incident review helped us identify the root cause and prevent it from happening again.', vi: 'Buổi đánh giá sự cố giúp chúng tôi xác định nguyên nhân gốc rễ và ngăn vấn đề tái diễn.' },
  ] },
  { en: 'clarify requirements', phonetic: '', vi: 'làm rõ yêu cầu', tag: 'itInterview', examples: [
    { en: 'I clarify requirements with the client before estimating the work.', vi: 'Tôi làm rõ yêu cầu với khách hàng trước khi ước lượng công việc.' },
    { en: 'Could you clarify what should happen when the payment times out?', vi: 'Bạn có thể làm rõ điều gì cần xảy ra khi thanh toán hết thời gian chờ không?' },
    { en: 'We clarified the acceptance criteria during sprint planning.', vi: 'Chúng tôi đã làm rõ tiêu chí nghiệm thu trong buổi lập kế hoạch sprint.' },
  ] },
  { en: 'trade-off', phonetic: '', vi: 'sự đánh đổi giữa các lựa chọn', tag: 'itInterview', examples: [
    { en: 'There is a trade-off between faster delivery and broader test coverage.', vi: 'Có sự đánh đổi giữa việc giao hàng nhanh hơn và độ bao phủ kiểm thử rộng hơn.' },
    { en: 'We chose a simpler design after discussing the performance trade-offs.', vi: 'Sau khi thảo luận các đánh đổi về hiệu năng, chúng tôi chọn thiết kế đơn giản hơn.' },
    { en: 'In the interview, I explained the trade-offs behind that architecture decision.', vi: 'Trong buổi phỏng vấn, tôi giải thích những đánh đổi đằng sau quyết định kiến trúc đó.' },
  ] },
  { en: 'maintainable', phonetic: '', vi: 'dễ bảo trì', tag: 'itInterview', examples: [
    { en: 'I try to keep the code maintainable by separating business logic from controllers.', vi: 'Tôi cố gắng giữ code dễ bảo trì bằng cách tách nghiệp vụ khỏi controller.' },
    { en: 'Clear naming makes the codebase more maintainable for the whole team.', vi: 'Đặt tên rõ ràng giúp cả nhóm dễ bảo trì codebase hơn.' },
    { en: 'We refactored the module to make future changes safer and more maintainable.', vi: 'Chúng tôi refactor module để các thay đổi sau này an toàn và dễ bảo trì hơn.' },
  ] },
  { en: 'scalable', phonetic: '', vi: 'có khả năng mở rộng khi tải tăng', tag: 'itInterview', examples: [
    { en: 'We designed the service to be scalable as the number of users grows.', vi: 'Chúng tôi thiết kế service có thể mở rộng khi số người dùng tăng.' },
    { en: 'The current solution works well, but it may not be scalable for millions of records.', vi: 'Giải pháp hiện tại hoạt động tốt nhưng có thể không mở rộng được với hàng triệu bản ghi.' },
    { en: 'I consider scalability, reliability, and cost when choosing an architecture.', vi: 'Tôi cân nhắc khả năng mở rộng, độ tin cậy và chi phí khi chọn kiến trúc.' },
  ] },
  { en: 'optimize', phonetic: '', vi: 'tối ưu hóa', tag: 'itInterview', examples: [
    { en: 'I optimized the SQL query and reduced the response time from two seconds to 300 milliseconds.', vi: 'Tôi tối ưu truy vấn SQL và giảm thời gian phản hồi từ hai giây xuống 300 mili giây.' },
    { en: 'We should measure performance before we optimize the code.', vi: 'Chúng ta nên đo hiệu năng trước khi tối ưu code.' },
    { en: 'I optimized the CI pipeline by caching dependencies.', vi: 'Tôi tối ưu pipeline CI bằng cách cache các dependency.' },
  ] },
  { en: 'deploy', phonetic: '', vi: 'triển khai phiên bản lên môi trường', tag: 'itInterview', examples: [
    { en: 'We deploy to staging first and run smoke tests before production.', vi: 'Chúng tôi triển khai lên staging trước và chạy smoke test trước khi lên production.' },
    { en: 'The team deploys small changes several times a week.', vi: 'Nhóm triển khai các thay đổi nhỏ vài lần mỗi tuần.' },
    { en: 'I monitored the service after the deployment to make sure everything was stable.', vi: 'Tôi theo dõi service sau khi triển khai để đảm bảo mọi thứ ổn định.' },
  ] },
  { en: 'code review', phonetic: '', vi: 'đánh giá mã nguồn', tag: 'itInterview', examples: [
    { en: 'I use code reviews to share context and catch issues early.', vi: 'Tôi dùng việc review code để chia sẻ ngữ cảnh và phát hiện vấn đề sớm.' },
    { en: 'I try to make my pull requests small and easy to review.', vi: 'Tôi cố gắng giữ pull request nhỏ và dễ review.' },
    { en: 'During code review, I focus on correctness, readability, and edge cases.', vi: 'Khi review code, tôi tập trung vào tính đúng đắn, khả năng đọc hiểu và các trường hợp biên.' },
  ] },
  { en: 'collaborate', phonetic: '', vi: 'phối hợp làm việc', tag: 'itInterview', examples: [
    { en: 'I collaborate with product managers to break down business requirements.', vi: 'Tôi phối hợp với product manager để chia nhỏ yêu cầu nghiệp vụ.' },
    { en: 'I collaborated with the QA team to reproduce and resolve the issue.', vi: 'Tôi đã phối hợp với nhóm QA để tái hiện và xử lý vấn đề.' },
    { en: 'In my current role, I collaborate with developers across different time zones.', vi: 'Trong vai trò hiện tại, tôi phối hợp với các lập trình viên ở nhiều múi giờ khác nhau.' },
  ] },
  { en: 'resolve', phonetic: '', vi: 'giải quyết, xử lý dứt điểm', tag: 'itInterview', examples: [
    { en: 'I resolved a data consistency issue by adding a transaction boundary.', vi: 'Tôi xử lý vấn đề nhất quán dữ liệu bằng cách thêm ranh giới transaction.' },
    { en: 'We resolved the customer’s concern before the release.', vi: 'Chúng tôi đã giải quyết lo ngại của khách hàng trước khi phát hành.' },
    { en: 'I prioritize issues based on user impact and urgency.', vi: 'Tôi ưu tiên vấn đề dựa trên ảnh hưởng đến người dùng và mức độ khẩn cấp.' },
  ] },
  { en: 'impact', phonetic: '', vi: 'ảnh hưởng, tác động', tag: 'itInterview', examples: [
    { en: 'The change has a positive impact on API response time.', vi: 'Thay đổi này tác động tích cực đến thời gian phản hồi API.' },
    { en: 'I assess the impact on existing clients before changing the contract.', vi: 'Tôi đánh giá ảnh hưởng đến các client hiện tại trước khi thay đổi contract.' },
    { en: 'This bug affects a small number of users, but the business impact is high.', vi: 'Lỗi này ảnh hưởng đến ít người dùng nhưng tác động đến hoạt động kinh doanh lại lớn.' },
  ] },
  { en: 'reliable', phonetic: '', vi: 'đáng tin cậy, hoạt động ổn định', tag: 'itInterview', examples: [
    { en: 'We added retries and monitoring to make the integration more reliable.', vi: 'Chúng tôi thêm cơ chế thử lại và monitoring để tích hợp đáng tin cậy hơn.' },
    { en: 'A reliable system should fail gracefully and provide useful logs.', vi: 'Một hệ thống đáng tin cậy nên xử lý lỗi có kiểm soát và cung cấp log hữu ích.' },
    { en: 'I focus on building reliable services, not just adding new features.', vi: 'Tôi tập trung xây dựng service ổn định, không chỉ thêm tính năng mới.' },
  ] },
  { en: 'meet a deadline', phonetic: '', vi: 'hoàn thành đúng thời hạn', tag: 'itInterview', examples: [
    { en: 'We met the deadline by reducing the scope of the first release.', vi: 'Chúng tôi kịp thời hạn bằng cách giảm phạm vi của đợt phát hành đầu.' },
    { en: 'I raise risks early if I think we may not meet a deadline.', vi: 'Tôi báo rủi ro sớm nếu nghĩ rằng nhóm có thể không kịp thời hạn.' },
    { en: 'The team delivered on time without skipping critical tests.', vi: 'Nhóm bàn giao đúng hạn mà không bỏ qua các kiểm thử quan trọng.' },
  ] },
  { en: 'be responsible for', phonetic: '', vi: 'chịu trách nhiệm về', tag: 'itInterview', examples: [
    { en: 'I was responsible for building REST APIs for the customer portal.', vi: 'Tôi chịu trách nhiệm xây dựng REST API cho cổng thông tin khách hàng.' },
    { en: 'I am responsible for maintaining several backend services.', vi: 'Tôi chịu trách nhiệm bảo trì một số backend service.' },
    { en: 'I was responsible for the implementation, while another engineer handled the infrastructure.', vi: 'Tôi phụ trách phần triển khai tính năng, còn một kỹ sư khác phụ trách hạ tầng.' },
  ] },
  { en: 'contribute to', phonetic: '', vi: 'đóng góp vào', tag: 'itInterview', examples: [
    { en: 'I contributed to the migration from a monolith to smaller services.', vi: 'Tôi đã đóng góp vào quá trình chuyển từ monolith sang các service nhỏ hơn.' },
    { en: 'My main contribution was improving the reliability of the payment flow.', vi: 'Đóng góp chính của tôi là cải thiện độ ổn định của luồng thanh toán.' },
    { en: 'I would like to contribute to a product used by customers across different markets.', vi: 'Tôi muốn đóng góp vào một sản phẩm được khách hàng ở nhiều thị trường sử dụng.' },
  ] },
  { en: 'workaround', phonetic: '', vi: 'cách xử lý tạm thời', tag: 'itInterview', examples: [
    { en: 'We applied a workaround to restore the service while preparing a permanent fix.', vi: 'Chúng tôi áp dụng cách xử lý tạm thời để khôi phục service trong khi chuẩn bị bản sửa triệt để.' },
    { en: 'The workaround reduced the impact, but it did not fix the root cause.', vi: 'Cách xử lý tạm thời giảm ảnh hưởng nhưng không giải quyết nguyên nhân gốc rễ.' },
    { en: 'I documented the workaround so the support team could help customers.', vi: 'Tôi ghi lại cách xử lý tạm thời để nhóm hỗ trợ có thể giúp khách hàng.' },
  ] },
  { en: 'break down a task', phonetic: '', vi: 'chia nhỏ một đầu việc', tag: 'itInterview', examples: [
    { en: 'I break down large tasks into smaller steps that can be reviewed independently.', vi: 'Tôi chia đầu việc lớn thành các bước nhỏ có thể review độc lập.' },
    { en: 'Breaking down the migration helped us identify dependencies early.', vi: 'Việc chia nhỏ migration giúp chúng tôi nhận ra các phụ thuộc từ sớm.' },
    { en: 'Could we break this task down and deliver the highest-priority part first?', vi: 'Chúng ta có thể chia nhỏ việc này và bàn giao phần ưu tiên cao nhất trước không?' },
  ] },
  { en: 'keep stakeholders informed', phonetic: '', vi: 'cập nhật thông tin cho các bên liên quan', tag: 'itInterview', examples: [
    { en: 'I keep stakeholders informed when a delivery date or scope changes.', vi: 'Tôi cập nhật cho các bên liên quan khi ngày bàn giao hoặc phạm vi thay đổi.' },
    { en: 'During the incident, we kept stakeholders informed with short, regular updates.', vi: 'Trong sự cố, chúng tôi cập nhật ngắn gọn và đều đặn cho các bên liên quan.' },
    { en: 'I share risks early so stakeholders have time to make a decision.', vi: 'Tôi chia sẻ rủi ro sớm để các bên liên quan có thời gian đưa ra quyết định.' },
  ] },
  { en: 'one of my key contributions', phonetic: '', vi: 'một trong những đóng góp nổi bật của tôi', tag: 'itInterview', examples: [
    { en: 'One of my key contributions was reducing the API’s average response time.', vi: 'Một trong những đóng góp nổi bật của tôi là giảm thời gian phản hồi trung bình của API.' },
    { en: 'One of my key contributions was introducing automated checks to the deployment pipeline.', vi: 'Một đóng góp nổi bật của tôi là đưa các bước kiểm tra tự động vào pipeline triển khai.' },
    { en: 'One of my key contributions was helping the team deliver the migration safely.', vi: 'Một đóng góp nổi bật của tôi là giúp nhóm thực hiện migration an toàn.' },
  ] },
  // Greetings
  { en: 'Hello', phonetic: '/həˈloʊ/', vi: 'Xin chào', tag: 'greetings', exampleEn: '"Hello, nice to meet you!"', exampleVi: '"Xin chào, rất vui được gặp bạn!"' },
  { en: 'Goodbye', phonetic: '/ɡʊdˈbaɪ/', vi: 'Tạm biệt', tag: 'greetings', exampleEn: '"Goodbye, see you tomorrow!"', exampleVi: '"Tạm biệt, hẹn gặp lại ngày mai!"' },
  { en: 'Thank you', phonetic: '/θæŋk juː/', vi: 'Cảm ơn', tag: 'greetings', exampleEn: '"Thank you for your help!"', exampleVi: '"Cảm ơn bạn đã giúp đỡ!"' },
  { en: 'Please', phonetic: '/pliːz/', vi: 'Làm ơn / Xin', tag: 'greetings', exampleEn: '"Please close the door."', exampleVi: '"Làm ơn đóng cửa lại."' },
  { en: 'Sorry', phonetic: '/ˈsɒri/', vi: 'Xin lỗi', tag: 'greetings', exampleEn: '"Sorry, I\'m late."', exampleVi: '"Xin lỗi, tôi đến muộn."' },
  { en: 'Welcome', phonetic: '/ˈwelkəm/', vi: 'Chào mừng', tag: 'greetings', exampleEn: '"Welcome to our home!"', exampleVi: '"Chào mừng đến nhà chúng tôi!"' },
  { en: 'Good morning', phonetic: '/ɡʊd ˈmɔːrnɪŋ/', vi: 'Chào buổi sáng', tag: 'greetings', exampleEn: '"Good morning, how are you?"', exampleVi: '"Chào buổi sáng, bạn khỏe không?"' },
  { en: 'Good night', phonetic: '/ɡʊd naɪt/', vi: 'Chúc ngủ ngon', tag: 'greetings', exampleEn: '"Good night, sweet dreams!"', exampleVi: '"Chúc ngủ ngon, mơ đẹp nhé!"' },

  // Daily (Sinh hoạt hàng ngày)
  { en: 'Wake up', phonetic: '/weɪk ʌp/', vi: 'Thức dậy', tag: 'daily', exampleEn: '"I wake up at 6 a.m. every day."', exampleVi: '"Tôi thức dậy lúc 6 giờ sáng mỗi ngày."' },
  { en: 'Eat', phonetic: '/iːt/', vi: 'Ăn', tag: 'daily', exampleEn: '"I eat breakfast at 7 o\'clock."', exampleVi: '"Tôi ăn sáng lúc 7 giờ."' },
  { en: 'Drink', phonetic: '/drɪŋk/', vi: 'Uống', tag: 'daily', exampleEn: '"I drink a glass of water every morning."', exampleVi: '"Tôi uống một cốc nước mỗi sáng."' },
  { en: 'Sleep', phonetic: '/sliːp/', vi: 'Ngủ', tag: 'daily', exampleEn: '"I sleep 8 hours every night."', exampleVi: '"Tôi ngủ 8 tiếng mỗi đêm."' },
  { en: 'Bath', phonetic: '/bæθ/', vi: 'Tắm', tag: 'daily', exampleEn: '"I take a bath before going to bed."', exampleVi: '"Tôi tắm trước khi đi ngủ."' },
  { en: 'Brush teeth', phonetic: '/brʌʃ tiːθ/', vi: 'Đánh răng', tag: 'daily', exampleEn: '"I brush my teeth twice a day."', exampleVi: '"Tôi đánh răng hai lần mỗi ngày."' },
  { en: 'Work', phonetic: '/wɜːrk/', vi: 'Đi làm', tag: 'daily', exampleEn: '"I go to work at 8 o\'clock."', exampleVi: '"Tôi đi làm lúc 8 giờ."' },
  { en: 'Cook', phonetic: '/kʊk/', vi: 'Nấu ăn', tag: 'daily', exampleEn: '"I cook dinner for my family."', exampleVi: '"Tôi nấu bữa tối cho gia đình."' },
  { en: 'Clean', phonetic: '/kliːn/', vi: 'Dọn dẹp', tag: 'daily', exampleEn: '"I clean the house on weekends."', exampleVi: '"Tôi dọn dẹp nhà cửa vào cuối tuần."' },
  { en: 'Watch TV', phonetic: '/wɒtʃ tiː ˈviː/', vi: 'Xem TV', tag: 'daily', exampleEn: '"I watch TV in the evening."', exampleVi: '"Tôi xem TV vào buổi tối."' },

  // Food
  { en: 'Water', phonetic: '/ˈwɔːtər/', vi: 'Nước', tag: 'food', exampleEn: '"Can I have a glass of water?"', exampleVi: '"Tôi có thể xin một ly nước không?"' },
  { en: 'Coffee', phonetic: '/ˈkɒfi/', vi: 'Cà phê', tag: 'food', exampleEn: '"I drink coffee every morning."', exampleVi: '"Tôi uống cà phê mỗi sáng."' },
  { en: 'Apple', phonetic: '/ˈæpl/', vi: 'Quả táo', tag: 'food', exampleEn: '"An apple a day keeps the doctor away."', exampleVi: '"Một quả táo mỗi ngày giúp bạn không cần bác sĩ."' },
  { en: 'Bread', phonetic: '/bred/', vi: 'Bánh mì', tag: 'food', exampleEn: '"I eat bread for breakfast."', exampleVi: '"Tôi ăn bánh mì vào bữa sáng."' },
  { en: 'Rice', phonetic: '/raɪs/', vi: 'Cơm / Gạo', tag: 'food', exampleEn: '"We eat rice every day."', exampleVi: '"Chúng tôi ăn cơm mỗi ngày."' },
  { en: 'Fish', phonetic: '/fɪʃ/', vi: 'Cá', tag: 'food', exampleEn: '"I like grilled fish."', exampleVi: '"Tôi thích cá nướng."' },
  { en: 'Chicken', phonetic: '/ˈtʃɪkɪn/', vi: 'Gà', tag: 'food', exampleEn: '"Chicken is my favorite."', exampleVi: '"Gà là món tôi yêu thích."' },
  { en: 'Egg', phonetic: '/eɡ/', vi: 'Trứng', tag: 'food', exampleEn: '"I have two eggs for breakfast."', exampleVi: '"Tôi ăn hai quả trứng vào bữa sáng."' },

  // School
  { en: 'Book', phonetic: '/bʊk/', vi: 'Sách', tag: 'school', exampleEn: '"This book is very interesting."', exampleVi: '"Cuốn sách này rất thú vị."' },
  { en: 'Learn', phonetic: '/lɜːrn/', vi: 'Học', tag: 'school', exampleEn: '"I learn English every day."', exampleVi: '"Tôi học tiếng Anh mỗi ngày."' },
  { en: 'Study', phonetic: '/ˈstʌdi/', vi: 'Nghiên cứu / Học tập', tag: 'school', exampleEn: '"She studies at Harvard."', exampleVi: '"Cô ấy học tại Harvard."' },
  { en: 'Teacher', phonetic: '/ˈtiːtʃər/', vi: 'Giáo viên', tag: 'school', exampleEn: '"My teacher is very kind."', exampleVi: '"Giáo viên của tôi rất tốt."' },
  { en: 'Student', phonetic: '/ˈstjuːdənt/', vi: 'Học sinh / Sinh viên', tag: 'school', exampleEn: '"I am a student at university."', exampleVi: '"Tôi là sinh viên đại học."' },
  { en: 'Class', phonetic: '/klæs/', vi: 'Lớp học', tag: 'school', exampleEn: '"What class do you have today?"', exampleVi: '"Hôm nay bạn có lớp gì?"' },

  // Technology
  { en: 'Computer', phonetic: '/kəmˈpjuːtər/', vi: 'Máy tính', tag: 'technology', exampleEn: '"My computer is very slow."', exampleVi: '"Máy tính của tôi rất chậm."' },
  { en: 'Phone', phonetic: '/foʊn/', vi: 'Điện thoại', tag: 'technology', exampleEn: '"My phone battery is low."', exampleVi: '"Pin điện thoại của tôi sắp hết."' },
  { en: 'Internet', phonetic: '/ˈɪntərnet/', vi: 'Internet', tag: 'technology', exampleEn: '"The internet is down."', exampleVi: '"Internet bị chậm."' },
  { en: 'Email', phonetic: '/ˈiːmeɪl/', vi: 'Thư điện tử', tag: 'technology', exampleEn: '"I sent you an email."', exampleVi: '"Tôi đã gửi bạn một email."' },
  { en: 'Website', phonetic: '/ˈwebsaɪt/', vi: 'Trang web', tag: 'technology', exampleEn: '"This website is very useful."', exampleVi: '"Trang web này rất hữu ích."' },
  { en: 'App', phonetic: '/æp/', vi: 'Ứng dụng', tag: 'technology', exampleEn: '"I downloaded a new app."', exampleVi: '"Tôi đã tải một ứng dụng mới."' },

  // Work
  { en: 'Work', phonetic: '/wɜːrk/', vi: 'Làm việc', tag: 'work', exampleEn: '"I work at a tech company."', exampleVi: '"Tôi làm việc ở một công ty công nghệ."' },
  { en: 'Job', phonetic: '/dʒɒb/', vi: 'Công việc', tag: 'work', exampleEn: '"I have a good job."', exampleVi: '"Tôi có một công việc tốt."' },
  { en: 'Office', phonetic: '/ˈɒfɪs/', vi: 'Văn phòng', tag: 'work', exampleEn: '"The office is downtown."', exampleVi: '"Văn phòng ở trung tâm thành phố."' },
  { en: 'Meeting', phonetic: '/ˈmiːtɪŋ/', vi: 'Cuộc họp', tag: 'work', exampleEn: '"We have a meeting at 3pm."', exampleVi: '"Chúng tôi có cuộc họp lúc 3 giờ."' },
  { en: 'Project', phonetic: '/ˈprɒdʒekt/', vi: 'Dự án', tag: 'work', exampleEn: '"This project is important."', exampleVi: '"Dự án này rất quan trọng."' },
  { en: 'Deadline', phonetic: '/ˈdedlaɪn/', vi: 'Thời hạn', tag: 'work', exampleEn: '"The deadline is next Friday."', exampleVi: '"Thời hạn là thứ Sáu tuần sau."' },

  // Time
  { en: 'Time', phonetic: '/taɪm/', vi: 'Thời gian', tag: 'time', exampleEn: '"What time is it?"', exampleVi: '"Bây giờ là mấy giờ?"' },
  { en: 'Today', phonetic: '/təˈdeɪ/', vi: 'Hôm nay', tag: 'time', exampleEn: '"Today is Monday."', exampleVi: '"Hôm nay là thứ Hai."' },
  { en: 'Tomorrow', phonetic: '/təˈmɒroʊ/', vi: 'Ngày mai', tag: 'time', exampleEn: '"See you tomorrow!"', exampleVi: '"Hẹn gặp ngày mai!"' },
  { en: 'Yesterday', phonetic: '/ˈjestərdeɪ/', vi: 'Hôm qua', tag: 'time', exampleEn: '"Yesterday was my birthday."', exampleVi: '"Hôm qua là sinh nhật của tôi."' },
  { en: 'Week', phonetic: '/wiːk/', vi: 'Tuần', tag: 'time', exampleEn: '"This week is very busy."', exampleVi: '"Tuần này rất bận."' },
  { en: 'Month', phonetic: '/mʌnθ/', vi: 'Tháng', tag: 'time', exampleEn: '"I will travel next month."', exampleVi: '"Tôi sẽ đi du lịch vào tháng tới."' },

  // Travel
  { en: 'Car', phonetic: '/kɑːr/', vi: 'Ô tô', tag: 'travel', exampleEn: '"I drive a red car."', exampleVi: '"Tôi lái một chiếc ô tô màu đỏ."' },
  { en: 'Hotel', phonetic: '/hoʊˈtel/', vi: 'Khách sạn', tag: 'travel', exampleEn: '"The hotel is very expensive."', exampleVi: '"Khách sạn này rất đắt."' },
  { en: 'Airport', phonetic: '/ˈeərpɔːrt/', vi: 'Sân bay', tag: 'travel', exampleEn: '"The flight is at the airport."', exampleVi: '"Chuyến bay ở sân bay."' },
  { en: 'Ticket', phonetic: '/ˈtɪkɪt/', vi: 'Vé', tag: 'travel', exampleEn: '"I bought a plane ticket."', exampleVi: '"Tôi đã mua một vé máy bay."' },
  { en: 'Passport', phonetic: '/ˈpæspɔːrt/', vi: 'Hộ chiếu', tag: 'travel', exampleEn: '"Where is your passport?"', exampleVi: '"Hộ chiếu của bạn đâu?"' },

  // Shopping
  { en: 'Shop', phonetic: '/ʃɒp/', vi: 'Cửa hàng', tag: 'shopping', exampleEn: '"The shop opens at 8 a.m."', exampleVi: '"Cửa hàng mở cửa lúc 8 giờ sáng."' },
  { en: 'Price', phonetic: '/praɪs/', vi: 'Giá', tag: 'shopping', exampleEn: '"What is the price?"', exampleVi: '"Giá bao nhiêu?"' },
  { en: 'Buy', phonetic: '/baɪ/', vi: 'Mua', tag: 'shopping', exampleEn: '"I want to buy this shirt."', exampleVi: '"Tôi muốn mua chiếc áo này."' },
  { en: 'Sell', phonetic: '/sel/', vi: 'Bán', tag: 'shopping', exampleEn: '"They sell fresh fruits."', exampleVi: '"Họ bán trái cây tươi."' },
  { en: 'Money', phonetic: '/ˈmʌni/', vi: 'Tiền', tag: 'shopping', exampleEn: '"I don\'t have enough money."', exampleVi: '"Tôi không có đủ tiền."' },

  // Health
  { en: 'Hospital', phonetic: '/ˈhɒspɪtl/', vi: 'Bệnh viện', tag: 'health', exampleEn: '"The hospital is near here."', exampleVi: '"Bệnh viện ở gần đây."' },
  { en: 'Doctor', phonetic: '/ˈdɒktər/', vi: 'Bác sĩ', tag: 'health', exampleEn: '"I need to see a doctor."', exampleVi: '"Tôi cần gặp bác sĩ."' },
  { en: 'Medicine', phonetic: '/ˈmedɪsɪn/', vi: 'Thuốc', tag: 'health', exampleEn: '"Take this medicine twice a day."', exampleVi: '"Uống thuốc này hai lần một ngày."' },
  { en: 'Headache', phonetic: '/ˈhedeɪk/', vi: 'Đau đầu', tag: 'health', exampleEn: '"I have a headache."', exampleVi: '"Tôi bị đau đầu."' },
  { en: 'Fever', phonetic: '/ˈfiːvər/', vi: 'Sốt', tag: 'health', exampleEn: '"She has a high fever."', exampleVi: '"Cô ấy bị sốt cao."' },

  // Emotion
  { en: 'Happy', phonetic: '/ˈhæpi/', vi: 'Vui vẻ', tag: 'emotion', exampleEn: '"I am very happy today."', exampleVi: '"Tôi rất vui hôm nay."' },
  { en: 'Friend', phonetic: '/frend/', vi: 'Bạn bè', tag: 'emotion', exampleEn: '"He is my best friend."', exampleVi: '"An ấy là bạn thân của tôi."' },
  { en: 'Love', phonetic: '/lʌv/', vi: 'Yêu', tag: 'emotion', exampleEn: '"I love my family."', exampleVi: '"Tôi yêu gia đình."' },
  { en: 'Sad', phonetic: '/sæd/', vi: 'Buồn', tag: 'emotion', exampleEn: '"Why do you look sad?"', exampleVi: '"Sao bạn trông buồn vậy?"' },
  { en: 'Tired', phonetic: '/ˈtaɪərd/', vi: 'Mệt', tag: 'emotion', exampleEn: '"I am very tired today."', exampleVi: '"Tôi rất mệt hôm nay."' },
  { en: 'Excited', phonetic: '/ɪkˈsaɪtɪd/', vi: 'Hào hứng', tag: 'emotion', exampleEn: '"I am excited about the trip."', exampleVi: '"Tôi rất hào hứng về chuyến đi."' },

  // Weather
  { en: 'Sun', phonetic: '/sʌn/', vi: 'Mặt trời', tag: 'weather', exampleEn: '"The sun is very bright today."', exampleVi: '"Mặt trời rất chói chang hôm nay."' },
  { en: 'Rain', phonetic: '/reɪn/', vi: 'Mưa', tag: 'weather', exampleEn: '"It will rain this afternoon."', exampleVi: '"Chiều nay sẽ có mưa."' },
  { en: 'Hot', phonetic: '/hɒt/', vi: 'Nóng', tag: 'weather', exampleEn: '"It is very hot today."', exampleVi: '"Hôm nay trời rất nóng."' },
  { en: 'Cold', phonetic: '/koʊld/', vi: 'Lạnh', tag: 'weather', exampleEn: '"It is cold in winter."', exampleVi: '"Mùa đông trời rất lạnh."' },
  { en: 'Weather', phonetic: '/ˈweðər/', vi: 'Thời tiết', tag: 'weather', exampleEn: '"What is the weather like?"', exampleVi: '"Thời tiết như thế nào?"' },

  // Nature
  { en: 'Tree', phonetic: '/triː/', vi: 'Cây', tag: 'nature', exampleEn: '"There are many trees in the park."', exampleVi: '"Công viên có nhiều cây xanh."' },
  { en: 'Flower', phonetic: '/ˈflaʊər/', vi: 'Hoa', tag: 'nature', exampleEn: '"The flowers are beautiful."', exampleVi: '"Những bông hoa rất đẹp."' },
  { en: 'Mountain', phonetic: '/ˈmaʊntɪn/', vi: 'Núi', tag: 'nature', exampleEn: '"We climbed the mountain."', exampleVi: '"Chúng tôi đã leo núi."' },
  { en: 'River', phonetic: '/ˈrɪvər/', vi: 'Sông', tag: 'nature', exampleEn: '"The river is very long."', exampleVi: '"Con sông rất dài."' },
  { en: 'Sea', phonetic: '/siː/', vi: 'Biển', tag: 'nature', exampleEn: '"The sea is blue and calm."', exampleVi: '"Biển xanh và yên bình."' },

  // Family
  { en: 'Mother', phonetic: '/ˈmʌðər/', vi: 'Mẹ', tag: 'family', exampleEn: '"My mother is a teacher."', exampleVi: '"Mẹ tôi là giáo viên."' },
  { en: 'Father', phonetic: '/ˈfɑːðər/', vi: 'Bố', tag: 'family', exampleEn: '"My father works hard."', exampleVi: '"Bố tôi làm việc vất vả."' },
  { en: 'Brother', phonetic: '/ˈbrʌðər/', vi: 'Anh / Em trai', tag: 'family', exampleEn: '"My brother is older than me."', exampleVi: '"Anh trai tôi lớn hơn tôi."' },
  { en: 'Sister', phonetic: '/ˈsɪstər/', vi: 'Chị / Em gái', tag: 'family', exampleEn: '"My sister lives in Hanoi."', exampleVi: '"Chị gái tôi sống ở Hà Nội."' },
  { en: 'Baby', phonetic: '/ˈbeɪbi/', vi: 'Em bé', tag: 'family', exampleEn: '"The baby is sleeping."', exampleVi: '"Em bé đang ngủ."' },
];
