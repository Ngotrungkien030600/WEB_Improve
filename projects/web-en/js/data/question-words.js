// ===== Question Words (Wh-questions) — Hỏi & Đáp =====
// Lý thuyết từ để hỏi + thực hành sắp xếp câu + trắc nghiệm

window.questionWords = {
  // 1. Lý thuyết — flip-card cho từng từ để hỏi
  whWords: [
    {
      word: "What",
      usage: "Hỏi về vật, việc, thông tin — cái gì, điều gì",
      structure: "What + is/are + S? | What + do/does + S + V? | What + V (số nhiều)?",
      examples: [
        { q: "What is your name?", vi: "Tên bạn là gì?", a: "My name is Lan." },
        { q: "What do you do?", vi: "Bạn làm nghề gì?", a: "I am a software engineer." },
        { q: "What did you eat for breakfast?", vi: "Bạn đã ăn gì vào bữa sáng?", a: "I ate bread and eggs." }
      ]
    },
    {
      word: "Where",
      usage: "Hỏi về nơi chốn — ở đâu",
      structure: "Where + is/are + S? | Where + do/does + S + V? | Where + did + S + V?",
      examples: [
        { q: "Where are you from?", vi: "Bạn đến từ đâu?", a: "I am from Hanoi, Vietnam." },
        { q: "Where do you live?", vi: "Bạn sống ở đâu?", a: "I live in District 1, Ho Chi Minh City." },
        { q: "Where did you go last weekend?", vi: "Cuối tuần trước bạn đã đi đâu?", a: "I went to Da Nang with my family." }
      ]
    },
    {
      word: "When",
      usage: "Hỏi về thời gian — khi nào",
      structure: "When + do/does + S + V? | When + did + S + V? | When + is/are + S?",
      examples: [
        { q: "When is your birthday?", vi: "Sinh nhật bạn khi nào?", a: "It's in May." },
        { q: "When do you get up?", vi: "Bạn dậy lúc mấy giờ?", a: "I get up at 6 o'clock." },
        { q: "When did you start learning English?", vi: "Bạn bắt đầu học tiếng Anh khi nào?", a: "I started when I was 10 years old." }
      ]
    },
    {
      word: "Why",
      usage: "Hỏi về lý do, nguyên nhân — tại sao, vì sao",
      structure: "Why + do/does + S + V? | Why + did + S + V? — Trả lời: Because...",
      examples: [
        { q: "Why are you late?", vi: "Tại sao bạn đến muộn?", a: "Because the bus was stuck in traffic." },
        { q: "Why do you like coffee?", vi: "Tại sao bạn thích cà phê?", a: "Because it helps me stay awake." },
        { q: "Why did you choose this job?", vi: "Tại sao bạn chọn công việc này?", a: "Because I love technology and coding." }
      ]
    },
    {
      word: "Who",
      usage: "Hỏi về người — ai",
      structure: "Who + is/are + S? | Who + V (số ít)? | Who + do/does + S + V?",
      examples: [
        { q: "Who is that man?", vi: "Người đàn ông kia là ai?", a: "He is my English teacher." },
        { q: "Who wrote this book?", vi: "Ai đã viết cuốn sách này?", a: "J.K. Rowling wrote it." },
        { q: "Who do you live with?", vi: "Bạn sống với ai?", a: "I live with my parents." }
      ]
    },
    {
      word: "Whose",
      usage: "Hỏi về sở hữu — của ai",
      structure: "Whose + noun + is/are + ...? | Whose + noun + do/does + S + V?",
      examples: [
        { q: "Whose book is this?", vi: "Cuốn sách này của ai?", a: "It's mine." },
        { q: "Whose car is parked outside?", vi: "Chiếc xe đỗ ngoài kia là của ai?", a: "It belongs to our neighbor." },
        { q: "Whose idea was it?", vi: "Đó là ý tưởng của ai?", a: "It was my brother's idea." }
      ]
    },
    {
      word: "Which",
      usage: "Hỏi về sự lựa chọn (giữa các đối tượng xác định) — cái nào, người nào",
      structure: "Which + noun + do/does + S + V? | Which + is + ...? | Which one...?",
      examples: [
        { q: "Which color do you like?", vi: "Bạn thích màu nào?", a: "I like blue." },
        { q: "Which subject is your favorite?", vi: "Môn học nào là môn yêu thích của bạn?", a: "My favorite subject is Math." },
        { q: "Which bus goes to the airport?", vi: "Chuyến xe buýt nào đi đến sân bay?", a: "Bus number 109 goes there." }
      ]
    },
    {
      word: "How",
      usage: "Hỏi về cách thức — bằng cách nào, như thế nào",
      structure: "How + do/does + S + V? | How + is/are + S? | How + can + S + V?",
      examples: [
        { q: "How do you go to work?", vi: "Bạn đi làm bằng cách nào?", a: "I go by motorbike." },
        { q: "How are you?", vi: "Bạn khỏe không?", a: "I'm fine, thank you." },
        { q: "How can I get to the station?", vi: "Làm sao tôi đến được nhà ga?", a: "Go straight and turn left at the traffic light." }
      ]
    },
    {
      word: "How many",
      usage: "Hỏi số lượng (đếm được) — bao nhiêu",
      structure: "How many + noun (số nhiều) + do/does + S + V? | How many + noun + are + there + ...?",
      examples: [
        { q: "How many brothers do you have?", vi: "Bạn có bao nhiêu anh em?", a: "I have one brother and two sisters." },
        { q: "How many students are there in your class?", vi: "Lớp bạn có bao nhiêu học sinh?", a: "There are 35 students." },
        { q: "How many cups of coffee do you drink a day?", vi: "Một ngày bạn uống bao nhiêu tách cà phê?", a: "I drink two cups a day." }
      ]
    },
    {
      word: "How much",
      usage: "Hỏi giá cả / số lượng (không đếm được) — bao nhiêu",
      structure: "How much + is/are + S? (giá) | How much + noun (không đếm được) + do/does + S + V?",
      examples: [
        { q: "How much is this shirt?", vi: "Chiếc áo này giá bao nhiêu?", a: "It's 200,000 dong." },
        { q: "How much money do you have?", vi: "Bạn có bao nhiêu tiền?", a: "I have 100,000 dong." },
        { q: "How much water do you drink every day?", vi: "Mỗi ngày bạn uống bao nhiêu nước?", a: "About two liters." }
      ]
    },
    {
      word: "How often",
      usage: "Hỏi về tần suất — bao lâu một lần, thường xuyên thế nào",
      structure: "How often + do/does + S + V? — Trả lời: always, usually, often, sometimes, never...",
      examples: [
        { q: "How often do you exercise?", vi: "Bạn tập thể dục thường xuyên thế nào?", a: "I exercise three times a week." },
        { q: "How often do you eat out?", vi: "Bạn ăn ngoài bao lâu một lần?", a: "About once a month." },
        { q: "How often does she travel abroad?", vi: "Cô ấy đi nước ngoài bao lâu một lần?", a: "She travels abroad twice a year." }
      ]
    },
    {
      word: "How long",
      usage: "Hỏi về độ dài thời gian / chiều dài — bao lâu",
      structure: "How long + does/did + S + V? | How long + is + S? | Trả lời: For + khoảng tg / Since + mốc tg",
      examples: [
        { q: "How long have you studied English?", vi: "Bạn đã học tiếng Anh bao lâu?", a: "I have studied for 10 years." },
        { q: "How long does it take to get there?", vi: "Mất bao lâu để đến đó?", a: "It takes about 30 minutes by car." },
        { q: "How long is the Mekong River?", vi: "Sông Mekong dài bao nhiêu?", a: "It is about 4,350 kilometers long." }
      ]
    }
  ],

  // 2. Thực hành dạng 1 — Sắp xếp từ thành câu hỏi
  scramble: [
    { wh: "What", vi: "Tên bạn là gì?", words: ["What", "is", "your", "name", "?"], explain: "Cấu trúc: What + is + ...?", answer: "My name is Minh." },
    { wh: "What", vi: "Bạn làm gì vào cuối tuần?", words: ["What", "do", "you", "do", "on", "weekends", "?"], explain: "Cấu trúc: What + do + S + V?", answer: "I usually go hiking with my friends." },
    { wh: "What", vi: "Bạn đã ăn gì cho bữa tối?", words: ["What", "did", "you", "eat", "for", "dinner", "?"], explain: "Quá khứ: What + did + S + V?", answer: "I ate pho with my family." },
    { wh: "Where", vi: "Bạn đến từ đâu?", words: ["Where", "are", "you", "from", "?"], explain: "Cấu trúc: Where + are + S + from?", answer: "I am from Hue, Vietnam." },
    { wh: "Where", vi: "Bạn sống ở đâu?", words: ["Where", "do", "you", "live", "?"], explain: "Cấu trúc: Where + do + S + V?", answer: "I live in Hanoi." },
    { wh: "When", vi: "Bạn dậy lúc mấy giờ?", words: ["When", "do", "you", "get", "up", "?"], explain: "Cấu trúc: When + do + S + V?", answer: "I get up at 6 a.m." },
    { wh: "When", vi: "Bạn đã đến Việt Nam khi nào?", words: ["When", "did", "you", "come", "to", "Vietnam", "?"], explain: "Quá khứ: When + did + S + V?", answer: "I came to Vietnam last year." },
    { wh: "Why", vi: "Tại sao bạn học tiếng Anh?", words: ["Why", "do", "you", "learn", "English", "?"], explain: "Cấu trúc: Why + do + S + V? Trả lời: Because...", answer: "Because I want to work abroad." },
    { wh: "Why", vi: "Tại sao cô ấy khóc?", words: ["Why", "is", "she", "crying", "?"], explain: "Hiện tại tiếp diễn: Why + is + S + V-ing?", answer: "Because she lost her phone." },
    { wh: "Who", vi: "Ai đang gõ cửa?", words: ["Who", "is", "knocking", "at", "the", "door", "?"], explain: "Cấu trúc: Who + is + V-ing?", answer: "It's the postman." },
    { wh: "Who", vi: "Bạn đang đợi ai?", words: ["Who", "are", "you", "waiting", "for", "?"], explain: "Cấu trúc: Who + are + S + V-ing + for?", answer: "I'm waiting for my friend." },
    { wh: "Whose", vi: "Chiếc điện thoại này của ai?", words: ["Whose", "phone", "is", "this", "?"], explain: "Cấu trúc: Whose + noun + is + this?", answer: "It's my sister's phone." },
    { wh: "Which", vi: "Bạn thích màu nào?", words: ["Which", "color", "do", "you", "like", "?"], explain: "Cấu trúc: Which + noun + do + S + V?", answer: "I like green." },
    { wh: "How", vi: "Bạn đi làm bằng cách nào?", words: ["How", "do", "you", "go", "to", "work", "?"], explain: "Cấu trúc: How + do + S + V?", answer: "I go to work by bus." },
    { wh: "How many", vi: "Bạn có bao nhiêu chị em gái?", words: ["How", "many", "sisters", "do", "you", "have", "?"], explain: "Cấu trúc: How many + noun (số nhiều) + do + S + have?", answer: "I have two sisters." },
    { wh: "How much", vi: "Cái áo khoác này giá bao nhiêu?", words: ["How", "much", "is", "this", "jacket", "?"], explain: "Hỏi giá: How much + is + S?", answer: "It's 500,000 dong." },
    { wh: "How often", vi: "Bạn xem phim bao lâu một lần?", words: ["How", "often", "do", "you", "watch", "movies", "?"], explain: "Cấu trúc: How often + do + S + V?", answer: "I watch movies every weekend." },
    { wh: "How long", vi: "Bạn đã làm việc ở đây bao lâu?", words: ["How", "long", "have", "you", "worked", "here", "?"], explain: "Hiện tại hoàn thành: How long + have + S + V3/ed?", answer: "I have worked here for 3 years." },
    { wh: "How long", vi: "Mất bao lâu để đi đến sân bay?", words: ["How", "long", "does", "it", "take", "to", "get", "to", "the", "airport", "?"], explain: "Cấu trúc: How long + does it take + to V?", answer: "It takes about 40 minutes." }
  ],

  // 3. Thực hành dạng 2 — Trắc nghiệm chọn từ để hỏi
  quiz: [
    { question: "____ is your birthday? — It's in May.", options: ["What", "Where", "When", "Why"], correct: 2, explain: "Hỏi về thời gian → When." },
    { question: "____ are you from? — I'm from Vietnam.", options: ["When", "Who", "Where", "Why"], correct: 2, explain: "Hỏi nơi chốn → Where." },
    { question: "____ is your favorite singer? — Taylor Swift.", options: ["Who", "Where", "How", "Whose"], correct: 0, explain: "Hỏi về người → Who." },
    { question: "____ do you go to school? — By bicycle.", options: ["When", "How", "Why", "What"], correct: 1, explain: "Hỏi cách thức → How." },
    { question: "____ did you leave early? — Because I was tired.", options: ["What", "Where", "When", "Why"], correct: 3, explain: "Hỏi lý do, trả lời Because → Why." },
    { question: "____ book is this? — It's Nam's book.", options: ["Whose", "Which", "Who", "How"], correct: 0, explain: "Hỏi sở hữu → Whose." },
    { question: "____ students are there in your class? — 40 students.", options: ["How much", "How many", "How often", "How long"], correct: 1, explain: "Students đếm được → How many." },
    { question: "____ is this dress? — It's 300,000 dong.", options: ["How many", "How much", "How often", "How long"], correct: 1, explain: "Hỏi giá → How much." },
    { question: "____ do you visit your grandparents? — Twice a month.", options: ["How much", "How long", "How often", "How many"], correct: 2, explain: "Hỏi tần suất → How often." },
    { question: "____ have you learned English? — For five years.", options: ["How long", "How often", "How much", "How many"], correct: 0, explain: "Hỏi độ dài thời gian → How long." },
    { question: "____ is the weather today? — It's sunny.", options: ["What", "How", "Where", "When"], correct: 1, explain: "Hỏi về trạng thái/đặc điểm → How." },
    { question: "____ did you buy? — I bought a new laptop.", options: ["Who", "Where", "What", "Why"], correct: 2, explain: "Hỏi về vật → What." },
    { question: "____ subject do you like better, Math or English?", options: ["Which", "Who", "When", "How"], correct: 0, explain: "Lựa chọn giữa 2 đối tượng → Which." },
    { question: "____ does the meeting start? — At 9 a.m.", options: ["Where", "What", "Who", "When"], correct: 3, explain: "Hỏi thời gian → When." },
    { question: "____ does your father do? — He is a doctor.", options: ["Who", "What", "Where", "How"], correct: 1, explain: "Hỏi về nghề nghiệp → What." },
    { question: "____ did she go yesterday? — She went to the market.", options: ["When", "Why", "Where", "Whose"], correct: 2, explain: "Hỏi nơi chốn → Where." },
    { question: "____ do you usually have lunch? — At noon.", options: ["Where", "When", "How", "What"], correct: 1, explain: "Hỏi thời điểm → When." },
    { question: "____ is that woman in the red dress? — She's my aunt.", options: ["What", "How", "Who", "Whose"], correct: 2, explain: "Hỏi về người → Who." },
    { question: "____ milk do you want in your coffee? — Just a little.", options: ["How many", "How much", "How often", "How long"], correct: 1, explain: "Milk không đếm được → How much." },
    { question: "____ do you play football? — Twice a week.", options: ["How long", "How much", "How often", "How many"], correct: 2, explain: "Hỏi tần suất → How often." }
  ]
};

// Expose cho module scripts
export const questionWords = window.questionWords;
