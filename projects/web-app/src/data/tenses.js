// Tenses data with Vietnamese explanations
export const tenses = [
  {
    name: 'Present Simple',
    title: 'Thì hiện tại đơn',
    form: 'S + V(s/es)',
    usage: 'Diễn tả thói quen, sự thật hiển nhiên, trạng thái thường xuyên',
    signal: 'always, usually, often, every day/week, sometimes, never, rarely',
    exampleEn: '"She goes to school every day."',
    exampleVi: '"Cô ấy đi học mỗi ngày."',
    examples: [
      { en: 'She goes to school every day.', vi: 'Cô ấy đi học mỗi ngày.' },
      { en: 'I work at ABC company.', vi: 'Tôi làm việc ở công ty ABC.' },
      { en: 'He likes to drink coffee.', vi: 'Anh ấy thích uống cà phê.' },
      { en: 'The sun rises in the east.', vi: 'Mặt trời mọc ở hướng đông.' },
      { en: 'They play football every weekend.', vi: 'Họ chơi bóng đá mỗi cuối tuần.' },
    ],
    note: 'Với third person singular (he/she/it), động từ thêm s/es. Đuôi y → ies (fly → flies)',
  },
  {
    name: 'Present Continuous',
    title: 'Thì hiện tại tiếp diễn',
    form: 'S + am/is/are + V-ing',
    usage: 'Diễn tả hành động đang xảy ra ngay lúc nói, có kế hoạch trong tương lai gần',
    signal: 'now, right now, at the moment, currently, at this time, look!, listen!',
    exampleEn: '"She is studying now."',
    exampleVi: '"Cô ấy đang học bây giờ."',
    examples: [
      { en: 'She is studying now.', vi: 'Cô ấy đang học bây giờ.' },
      { en: 'They are playing football.', vi: 'Họ đang chơi bóng đá.' },
      { en: 'I am reading a book at the moment.', vi: 'Tôi đang đọc sách lúc này.' },
      { en: 'Look! The baby is crying.', vi: 'Nhìn kìa! Em bé đang khóc.' },
      { en: 'We are leaving for Hanoi tomorrow.', vi: 'Chúng tôi sẽ đi Hà Nội vào ngày mai.' },
    ],
    note: 'Dùng am/is/are + V-ing. Có thể dùng cho kế hoạch đã sắp xếp trong tương lai.',
  },
  {
    name: 'Past Simple',
    title: 'Thì quá khứ đơn',
    form: 'S + V(ed) / V2',
    usage: 'Diễn tả hành động đã xảy ra và kết thúc trong quá khứ',
    signal: 'yesterday, last week/month/year, in 2020, ago, just, once, when...',
    exampleEn: '"She went to school yesterday."',
    exampleVi: '"Cô ấy đi học hôm qua."',
    examples: [
      { en: 'She went to school yesterday.', vi: 'Cô ấy đi học hôm qua.' },
      { en: 'He went to Hanoi last week.', vi: 'Anh ấy đi Hà Nội tuần trước.' },
      { en: 'I watched a movie last night.', vi: 'Tôi xem phim tối qua.' },
      { en: 'She bought a new dress.', vi: 'Cô ấy đã mua một chiếc váy mới.' },
      { en: 'They visited Nha Trang in 2020.', vi: 'Họ đã thăm Nha Trang vào năm 2020.' },
    ],
    note: 'Động từ chia quá khứ: regular → ed, irregular → V2 (bảng động từ bất quy tắc)',
  },
  {
    name: 'Future Simple',
    title: 'Thì tương lai đơn',
    form: 'S + will + V',
    usage: 'Diễn tả hành động sẽ xảy ra trong tương lai, quyết định tại thời điểm nói',
    signal: 'tomorrow, next week/month/year, in the future, soon, someday',
    exampleEn: '"She will go to school tomorrow."',
    exampleVi: '"Cô ấy sẽ đi học ngày mai."',
    examples: [
      { en: 'She will go to school tomorrow.', vi: 'Cô ấy sẽ đi học ngày mai.' },
      { en: 'I will go to Da Nang next week.', vi: 'Tôi sẽ đi Đà Nẵng tuần sau.' },
      { en: 'It will rain tomorrow.', vi: 'Trời sẽ mưa ngày mai.' },
      { en: 'We will meet on Saturday.', vi: 'Chúng tôi sẽ gặp nhau vào thứ Bảy.' },
      { en: 'I will help you with your homework.', vi: 'Tôi sẽ giúp bạn làm bài tập.' },
    ],
    note: 'Will + V (nguyên mẫu). Dùng "shall" cho I/we trong câu hỏi gợi ý.',
  },
  {
    name: 'Present Perfect',
    title: 'Thì hiện tại hoàn thành',
    form: 'S + have/has + V3',
    usage: 'Diễn tả hành động bắt đầu trong quá khứ, còn ảnh hưởng đến hiện tại',
    signal: 'already, yet, just, ever, never, for, since, recently, so far',
    exampleEn: '"She has finished her homework."',
    exampleVi: '"Cô ấy đã xong bài tập."',
    examples: [
      { en: 'She has finished her homework.', vi: 'Cô ấy đã xong bài tập.' },
      { en: 'I have had breakfast.', vi: 'Tôi đã ăn sáng rồi.' },
      { en: 'She has learned English for 5 years.', vi: 'Cô ấy học tiếng Anh 5 năm rồi.' },
      { en: 'I have never been to Japan.', vi: 'Tôi chưa bao giờ đến Nhật.' },
      { en: 'He has just arrived.', vi: 'Anh ấy vừa mới đến.' },
    ],
    note: 'Have/has + V3 (quá khứ phân từ). HAVE: I/you/we/they, HAS: he/she/it',
  },
  {
    name: 'Past Continuous',
    title: 'Thì quá khứ tiếp diễn',
    form: 'S + was/were + V-ing',
    usage: 'Diễn tả hành động đang xảy ra tại một thời điểm trong quá khứ',
    signal: 'at 5 p.m. yesterday, while, when, all day yesterday',
    exampleEn: '"She was studying at 5 p.m."',
    exampleVi: '"Cô ấy đang học lúc 5 giờ chiều."',
    examples: [
      { en: 'She was studying at 5 p.m.', vi: 'Cô ấy đang học lúc 5 giờ chiều.' },
      { en: 'I was reading when she called.', vi: 'Tôi đang đọc sách khi cô ấy gọi.' },
      { en: 'They were waiting for the bus when it rained.', vi: 'Họ đang chờ xe buýt thì trời mưa.' },
      { en: 'I was cooking when the phone rang.', vi: 'Tôi đang nấu ăn thì điện thoại reo.' },
      { en: 'He was sleeping all day yesterday.', vi: 'Anh ấy ngủ suốt cả ngày hôm qua.' },
    ],
    note: 'Was (I/he/she/it) + V-ing, Were (you/we/they) + V-ing',
  },
  {
    name: 'Future Continuous',
    title: 'Thì tương lai tiếp diễn',
    form: 'S + will be + V-ing',
    usage: 'Diễn tả hành động sẽ đang xảy ra tại một thời điểm trong tương lai',
    signal: 'at this time tomorrow, at 8 p.m. next Friday, while, during...',
    exampleEn: '"She will be studying at 8 p.m."',
    exampleVi: '"Cô ấy sẽ đang học lúc 8 giờ tối."',
    examples: [
      { en: 'She will be studying at 8 p.m.', vi: 'Cô ấy sẽ đang học lúc 8 giờ tối.' },
      { en: 'I will be studying at 8 p.m. tomorrow.', vi: 'Tôi sẽ đang học lúc 8 giờ tối mai.' },
      { en: 'They will be playing football at this time tomorrow.', vi: 'Họ sẽ đang chơi bóng đá vào giờ này ngày mai.' },
      { en: 'At this time next week, we will be flying to Japan.', vi: 'Vào giờ này tuần sau, chúng tôi sẽ đang bay đến Nhật.' },
      { en: 'He will be working when you arrive.', vi: 'Anh ấy sẽ đang làm việc khi bạn đến.' },
    ],
    note: 'Will be + V-ing',
  },
  {
    name: 'Present Perfect Continuous',
    title: 'Thì hiện tại hoàn thành tiếp diễn',
    form: 'S + have/has + been + V-ing',
    usage: 'Diễn tả hành động bắt đầu trong quá khứ, kéo dài đến hiện tại, nhấn mạnh thời gian',
    signal: 'for, since, all day, how long, recently, lately',
    exampleEn: '"She has been studying for 3 hours."',
    exampleVi: '"Cô ấy đã học được 3 tiếng."',
    examples: [
      { en: 'She has been studying for 3 hours.', vi: 'Cô ấy đã học được 3 tiếng.' },
      { en: 'I have been studying for 3 hours.', vi: 'Tôi đã học được 3 tiếng rồi.' },
      { en: 'She has been working for 2 years.', vi: 'Cô ấy đã làm việc được 2 năm.' },
      { en: 'They have been waiting for 1 hour.', vi: 'Họ đã chờ được 1 tiếng rồi.' },
      { en: 'It has been raining all day.', vi: 'Trời đã mưa suốt cả ngày.' },
    ],
    note: 'Have/has + been + V-ing. Nhấn mạnh hành động kéo dài liên tục.',
  },
  {
    name: 'Past Perfect',
    title: 'Thì quá khứ hoàn thành',
    form: 'S + had + V3',
    usage: 'Diễn tả hành động xảy ra trước một hành động khác trong quá khứ',
    signal: 'before, after, when, by the time, already, just, never...before',
    exampleEn: '"She had finished before he came."',
    exampleVi: '"Cô ấy đã xong trước khi anh ấy đến."',
    examples: [
      { en: 'She had finished before he came.', vi: 'Cô ấy đã xong trước khi anh ấy đến.' },
      { en: 'I had eaten before she came.', vi: 'Tôi đã ăn xong trước khi cô ấy đến.' },
      { en: 'He had gone to bed when I called.', vi: 'Anh ấy đã đi ngủ khi tôi gọi.' },
      { en: 'She had finished the homework before class.', vi: 'Cô ấy đã hoàn thành bài tập trước giờ học.' },
      { en: 'By the time we arrived, the movie had started.', vi: 'Khi chúng tôi đến, bộ phim đã bắt đầu.' },
    ],
    note: 'Had + V3 (quá khứ phân từ). Dùng cho hành động xảy ra trước trong quá khứ.',
  },
  {
    name: 'Past Perfect Continuous',
    title: 'Thì quá khứ hoàn thành tiếp diễn',
    form: 'S + had + been + V-ing',
    usage: 'Diễn tả hành động đang xảy ra và kéo dài đến một thời điểm trong quá khứ',
    signal: 'for, since, before, how long...before',
    exampleEn: '"She had been studying for 2 hours before he came."',
    exampleVi: '"Cô ấy đã học được 2 tiếng trước khi anh ấy đến."',
    examples: [
      { en: 'She had been studying for 2 hours before he came.', vi: 'Cô ấy đã học được 2 tiếng trước khi anh ấy đến.' },
      { en: 'They had been waiting for an hour before the bus came.', vi: 'Họ đã đợi 1 tiếng trước khi xe buýt đến.' },
      { en: 'He had been working at the company for 5 years before he quit.', vi: 'Anh ấy đã làm việc ở công ty 5 năm trước khi nghỉ.' },
      { en: 'She had been cooking for an hour when the guests arrived.', vi: 'Cô ấy đã nấu ăn 1 tiếng khi khách đến.' },
      { en: 'I had been saving money for years before I bought the house.', vi: 'Tôi đã tiết kiệm tiền nhiều năm trước khi mua nhà.' },
    ],
    note: 'Had + been + V-ing. Nhấn mạnh sự kéo dài của hành động trong quá khứ.',
  },
  {
    name: 'Future Perfect',
    title: 'Thì tương lai hoàn thành',
    form: 'S + will have + V3',
    usage: 'Diễn tả hành động sẽ hoàn thành TRƯỚC một thời điểm trong tương lai',
    signal: 'by, before, by the time, by tomorrow/next week...',
    exampleEn: '"She will have finished by tomorrow."',
    exampleVi: '"Cô ấy sẽ xong trước ngày mai."',
    examples: [
      { en: 'She will have finished by tomorrow.', vi: 'Cô ấy sẽ xong trước ngày mai.' },
      { en: 'I will have finished the project by Friday.', vi: 'Tôi sẽ hoàn thành dự án trước thứ Sáu.' },
      { en: 'She will have finished the work by 5 p.m.', vi: 'Cô ấy sẽ xong việc trước 5 giờ chiều.' },
      { en: 'By 2030, we will have built a new hospital.', vi: 'Đến năm 2030, chúng tôi sẽ đã xây xong bệnh viện mới.' },
      { en: 'He will have graduated by next year.', vi: 'Anh ấy sẽ đã tốt nghiệp vào năm sau.' },
    ],
    note: 'Will have + V3. Nhấn mạnh sự hoàn thành trước một thời điểm.',
  },
  {
    name: 'Future Perfect Continuous',
    title: 'Thì tương lai hoàn thành tiếp diễn',
    form: 'S + will have been + V-ing',
    usage: 'Diễn tả hành động kéo dài đến một thời điểm trong tương lai',
    signal: 'for, by the time',
    exampleEn: '"She will have been studying for 5 years by 2030."',
    exampleVi: '"Cô ấy sẽ đã học được 5 năm tính đến năm 2030."',
    examples: [
      { en: 'She will have been studying for 5 years by 2030.', vi: 'Cô ấy sẽ đã học được 5 năm tính đến năm 2030.' },
      { en: 'By next month I will have been working here for 2 years.', vi: 'Vào tháng sau, tôi sẽ đã làm việc ở đây được 2 năm.' },
      { en: 'By the end of this year, she will have been teaching for 10 years.', vi: 'Đến cuối năm nay, cô ấy sẽ đã dạy học được 10 năm.' },
      { en: 'By 2028, they will have been living here for 15 years.', vi: 'Đến năm 2028, họ sẽ đã sống ở đây được 15 năm.' },
      { en: 'By the time you come, I will have been waiting for 2 hours.', vi: 'Khi bạn đến, tôi sẽ đã chờ được 2 tiếng.' },
    ],
    note: 'Will have been + V-ing. Nhấn mạnh sự kéo dài đến một thời điểm.',
  },
];

// Practice sentences for each tense
export const practiceSentences = [
  // Present Simple
  { name: 'Present Simple', vi: 'Cô ấy đi học mỗi ngày.', en: 'She goes to school every day', words: ['She', 'goes', 'to', 'school', 'every', 'day'] },
  { name: 'Present Simple', vi: 'Tôi làm việc ở công ty ABC.', en: 'I work at ABC company', words: ['I', 'work', 'at', 'ABC', 'company'] },
  { name: 'Present Simple', vi: 'Anh ấy thích uống cà phê.', en: 'He likes to drink coffee', words: ['He', 'likes', 'to', 'drink', 'coffee'] },

  // Present Continuous
  { name: 'Present Continuous', vi: 'Cô ấy đang học bài.', en: 'She is studying', words: ['She', 'is', 'studying'] },
  { name: 'Present Continuous', vi: 'Họ đang chơi bóng đá.', en: 'They are playing football', words: ['They', 'are', 'playing', 'football'] },
  { name: 'Present Continuous', vi: 'Tôi đang đọc sách bây giờ.', en: 'I am reading a book now', words: ['I', 'am', 'reading', 'a', 'book', 'now'] },

  // Past Simple
  { name: 'Past Simple', vi: 'Anh ấy đi Hà Nội hôm qua.', en: 'He went to Hanoi yesterday', words: ['He', 'went', 'to', 'Hanoi', 'yesterday'] },
  { name: 'Past Simple', vi: 'Tôi xem phim tối qua.', en: 'I watched a movie last night', words: ['I', 'watched', 'a', 'movie', 'last', 'night'] },
  { name: 'Past Simple', vi: 'Cô ấy mua một chiếc váy mới.', en: 'She bought a new dress', words: ['She', 'bought', 'a', 'new', 'dress'] },

  // Future Simple
  { name: 'Future Simple', vi: 'Tôi sẽ đi Đà Nẵng tuần sau.', en: 'I will go to Da Nang next week', words: ['I', 'will', 'go', 'to', 'Da', 'Nang', 'next', 'week'] },
  { name: 'Future Simple', vi: 'Trời sẽ mưa ngày mai.', en: 'It will rain tomorrow', words: ['It', 'will', 'rain', 'tomorrow'] },
  { name: 'Future Simple', vi: 'Chúng tôi sẽ gặp nhau vào thứ Bảy.', en: 'We will meet on Saturday', words: ['We', 'will', 'meet', 'on', 'Saturday'] },

  // Present Perfect
  { name: 'Present Perfect', vi: 'Tôi đã ăn sáng rồi.', en: 'I have had breakfast', words: ['I', 'have', 'had', 'breakfast'] },
  { name: 'Present Perfect', vi: 'Cô ấy học tiếng Anh 5 năm rồi.', en: 'She has learned English for 5 years', words: ['She', 'has', 'learned', 'English', 'for', '5', 'years'] },
  { name: 'Present Perfect', vi: 'Tôi chưa bao giờ đến Nhật.', en: 'I have never been to Japan', words: ['I', 'have', 'never', 'been', 'to', 'Japan'] },

  // Past Continuous
  { name: 'Past Continuous', vi: 'Tôi đang đọc sách khi cô ấy gọi.', en: 'I was reading when she called', words: ['I', 'was', 'reading', 'when', 'she', 'called'] },
  { name: 'Past Continuous', vi: 'Họ đang chờ xe buýt lúc trời mưa.', en: 'They were waiting for the bus when it rained', words: ['They', 'were', 'waiting', 'for', 'the', 'bus', 'when', 'it', 'rained'] },
  { name: 'Past Continuous', vi: 'Tôi đang nấu ăn khi điện thoại reo.', en: 'I was cooking when the phone rang', words: ['I', 'was', 'cooking', 'when', 'the', 'phone', 'rang'] },

  // Present Perfect Continuous
  { name: 'Present Perfect Continuous', vi: 'Tôi đã học được 3 tiếng rồi.', en: 'I have been studying for 3 hours', words: ['I', 'have', 'been', 'studying', 'for', '3', 'hours'] },
  { name: 'Present Perfect Continuous', vi: 'Cô ấy đã làm việc được 2 năm.', en: 'She has been working for 2 years', words: ['She', 'has', 'been', 'working', 'for', '2', 'years'] },
  { name: 'Present Perfect Continuous', vi: 'Họ đã chờ được 1 tiếng rồi.', en: 'They have been waiting for 1 hour', words: ['They', 'have', 'been', 'waiting', 'for', '1', 'hour'] },

  // Past Perfect
  { name: 'Past Perfect', vi: 'Tôi đã ăn xong trước khi cô ấy đến.', en: 'I had eaten before she came', words: ['I', 'had', 'eaten', 'before', 'she', 'came'] },
  { name: 'Past Perfect', vi: 'Anh ấy đã đi ngủ khi tôi gọi.', en: 'He had gone to bed when I called', words: ['He', 'had', 'gone', 'to', 'bed', 'when', 'I', 'called'] },
  { name: 'Past Perfect', vi: 'Cô ấy đã hoàn thành bài tập trước giờ học.', en: 'She had finished the homework before class', words: ['She', 'had', 'finished', 'the', 'homework', 'before', 'class'] },

  // Past Perfect Continuous
  { name: 'Past Perfect Continuous', vi: 'Họ đã đợi 1 tiếng trước khi xe buýt đến.', en: 'They had been waiting for an hour before the bus came', words: ['They', 'had', 'been', 'waiting', 'for', 'an', 'hour', 'before', 'the', 'bus', 'came'] },
  { name: 'Past Perfect Continuous', vi: 'Cô ấy đã học được 2 tiếng trước khi anh ấy đến.', en: 'She had been studying for 2 hours before he came', words: ['She', 'had', 'been', 'studying', 'for', '2', 'hours', 'before', 'he', 'came'] },

  // Future Continuous
  { name: 'Future Continuous', vi: 'Tôi sẽ đang học lúc 8 giờ tối mai.', en: 'I will be studying at 8 p.m. tomorrow', words: ['I', 'will', 'be', 'studying', 'at', '8', 'p.m.', 'tomorrow'] },
  { name: 'Future Continuous', vi: 'Họ sẽ đang chơi bóng lúc này ngày mai.', en: 'They will be playing football at this time tomorrow', words: ['They', 'will', 'be', 'playing', 'football', 'at', 'this', 'time', 'tomorrow'] },

  // Future Perfect
  { name: 'Future Perfect', vi: 'Tôi sẽ hoàn thành dự án trước thứ Sáu.', en: 'I will have finished the project by Friday', words: ['I', 'will', 'have', 'finished', 'the', 'project', 'by', 'Friday'] },
  { name: 'Future Perfect', vi: 'Cô ấy sẽ xong việc trước 5 giờ chiều.', en: 'She will have finished the work by 5 p.m.', words: ['She', 'will', 'have', 'finished', 'the', 'work', 'by', '5', 'p.m.'] },

  // Future Perfect Continuous
  { name: 'Future Perfect Continuous', vi: 'Vào tháng sau, tôi sẽ đã làm việc ở đây được 2 năm.', en: 'By next month I will have been working here for 2 years', words: ['By', 'next', 'month', 'I', 'will', 'have', 'been', 'working', 'here', 'for', '2', 'years'] },
];
