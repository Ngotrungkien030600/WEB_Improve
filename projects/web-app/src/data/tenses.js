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
];
