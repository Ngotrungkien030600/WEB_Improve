/**
 * Expanded Practice Sentences — 32 sentence scramble exercises covering all tenses
 * Extends practice.js with more sentence types and difficulty levels.
 */
export const expandedPractice = [
  // === Present Simple (4 sentences) ===
  { tense: "Present Simple", vi: "Tôi uống cà phê mỗi sáng.", words: ["I", "drink", "coffee", "every", "morning."], explain: "Thì hiện tại đơn với chủ ngữ 'I', động từ nguyên thể 'drink'.", difficulty: 1 },
  { tense: "Present Simple", vi: "Mặt trời mọc ở hướng đông.", words: ["The", "sun", "rises", "in", "the", "east."], explain: "Sự thật hiển nhiên: 'the sun rises' dùng hiện tại đơn.", difficulty: 1 },
  { tense: "Present Simple", vi: "Họ không thích xem TV.", words: ["They", "do", "not", "like", "watching", "TV."], explain: "Phủ định hiện tại đơn: do not + V nguyên thể.", difficulty: 1 },
  { tense: "Present Simple", vi: "Bạn có nói tiếng Anh không?", words: ["Do", "you", "speak", "English", "?"], explain: "Câu hỏi hiện tại đơn: Do + S + V?", difficulty: 1 },

  // === Present Continuous (4 sentences) ===
  { tense: "Present Continuous", vi: "Cô ấy đang nấu bữa tối.", words: ["She", "is", "cooking", "dinner", "now."], explain: "Thì hiện tại tiếp diễn: is + V-ing (cooking).", difficulty: 1 },
  { tense: "Present Continuous", vi: "Họ đang xây một ngôi nhà mới.", words: ["They", "are", "building", "a", "new", "house."], explain: "Chủ ngữ số nhiều 'They' dùng 'are + V-ing'.", difficulty: 1 },
  { tense: "Present Continuous", vi: "Trời đang mưa bên ngoài.", words: ["It", "is", "raining", "outside."], explain: "Thời tiết: 'It is raining' — hiện tại tiếp diễn.", difficulty: 1 },
  { tense: "Present Continuous", vi: "Bạn đang làm gì?", words: ["What", "are", "you", "doing", "?"], explain: "Câu hỏi hiện tại tiếp diễn: What + am/is/are + S + V-ing?", difficulty: 1 },

  // === Present Perfect (4 sentences) ===
  { tense: "Present Perfect", vi: "Tôi chưa bao giờ đến Nhật Bản.", words: ["I", "have", "never", "been", "to", "Japan."], explain: "Present perfect với 'never': have/has + never + V3/ed.", difficulty: 2 },
  { tense: "Present Perfect", vi: "Cô ấy vừa mới về đến nhà.", words: ["She", "has", "just", "arrived", "home."], explain: "'Just' dùng với present perfect cho hành động vừa xảy ra.", difficulty: 2 },
  { tense: "Present Perfect", vi: "Bạn đã ăn sushi bao giờ chưa?", words: ["Have", "you", "ever", "eaten", "sushi", "?"], explain: "Câu hỏi kinh nghiệm: Have + S + ever + V3/ed?", difficulty: 2 },
  { tense: "Present Perfect", vi: "Chúng tôi đã sống ở đây từ năm 2020.", words: ["We", "have", "lived", "here", "since", "2020."], explain: "'Since' + mốc thời gian — dùng với present perfect.", difficulty: 2 },

  // === Past Simple (4 sentences) ===
  { tense: "Past Simple", vi: "Họ đã xem một bộ phim hay tối qua.", words: ["They", "watched", "a", "good", "movie", "last", "night."], explain: "Quá khứ đơn: V2/ed. 'Last night' là dấu hiệu.", difficulty: 1 },
  { tense: "Past Simple", vi: "Tôi đã không đi học hôm qua.", words: ["I", "did", "not", "go", "to", "school", "yesterday."], explain: "Phủ định quá khứ: did not + V nguyên thể.", difficulty: 1 },
  { tense: "Past Simple", vi: "Cô ấy đã bắt đầu học năm ngoái.", words: ["She", "started", "learning", "last", "year."], explain: "'Started' là V2/ed của 'start'.", difficulty: 1 },
  { tense: "Past Simple", vi: "Họ đã gặp nhau ở đâu?", words: ["Where", "did", "they", "meet", "?"], explain: "Câu hỏi quá khứ: Wh-word + did + S + V?", difficulty: 1 },

  // === Future (4 sentences) ===
  { tense: "Future Simple", vi: "Tuần sau tôi sẽ bắt đầu công việc mới.", words: ["Next", "week,", "I", "will", "start", "a", "new", "job."], explain: "Tương lai đơn: will + V nguyên thể.", difficulty: 1 },
  { tense: "Future Simple", vi: "Tôi hứa tôi sẽ gọi cho bạn.", words: ["I", "promise", "I", "will", "call", "you."], explain: "Lời hứa dùng 'will' trong tương lai đơn.", difficulty: 1 },
  { tense: "Future Simple", vi: "Ngày mai trời sẽ nắng.", words: ["It", "will", "be", "sunny", "tomorrow."], explain: "Dự báo thời tiết: will + be.", difficulty: 1 },
  { tense: "Future Simple", vi: "Bạn sẽ làm gì vào cuối tuần này?", words: ["What", "will", "you", "do", "this", "weekend", "?"], explain: "Câu hỏi tương lai: Wh-word + will + S + V?", difficulty: 1 },

  // === Mixed & Conditional (4 sentences) ===
  { tense: "Conditional Type 1", vi: "Nếu trời mưa, tôi sẽ ở nhà.", words: ["If", "it", "rains,", "I", "will", "stay", "home."], explain: "Câu điều kiện loại 1: If + S + V(s/es), S + will + V.", difficulty: 2 },
  { tense: "Conditional Type 2", vi: "Nếu tôi là bạn, tôi sẽ học chăm chỉ hơn.", words: ["If", "I", "were", "you,", "I", "would", "study", "harder."], explain: "Câu điều kiện loại 2 (không thật ở hiện tại): If + S + V2/ed, S + would + V.", difficulty: 3 },
  { tense: "Passive Voice", vi: "Ngôi nhà này được xây vào năm 2010.", words: ["This", "house", "was", "built", "in", "2010."], explain: "Bị động quá khứ: S + was/were + V3/ed.", difficulty: 2 },
  { tense: "Present Perfect Continuous", vi: "Trời đã mưa suốt từ sáng sớm.", words: ["It", "has", "been", "raining", "since", "early", "morning."], explain: "Hiện tại hoàn thành tiếp diễn: has been + V-ing.", difficulty: 3 },
  { tense: "Reported Speech", vi: "Cô ấy nói rằng cô ấy đang bận.", words: ["She", "said", "that", "she", "was", "busy."], explain: "Câu tường thuật: said + that + S + V lùi thì.", difficulty: 3 },

  // === Phrasal Verb practice (4 sentences) ===
  { tense: "Phrasal Verb", vi: "Làm ơn tắt TV trước khi đi ngủ.", words: ["Please", "turn", "off", "the", "TV", "before", "going", "to", "bed."], explain: "Phrasal verb 'turn off' = tắt (thiết bị).", difficulty: 2 },
  { tense: "Phrasal Verb", vi: "Tôi đang mong chờ kỳ nghỉ.", words: ["I", "am", "looking", "forward", "to", "the", "vacation."], explain: "Phrasal verb 'look forward to' = mong chờ.", difficulty: 2 },
  { tense: "Phrasal Verb", vi: "Anh ấy đã lớn lên ở một ngôi làng nhỏ.", words: ["He", "grew", "up", "in", "a", "small", "village."], explain: "Phrasal verb 'grow up' = lớn lên.", difficulty: 2 },
  { tense: "Phrasal Verb", vi: "Chúng ta hãy cùng nhau giải quyết vấn đề này.", words: ["Let's", "figure", "out", "this", "problem", "together."], explain: "Phrasal verb 'figure out' = tìm ra giải pháp.", difficulty: 2 },
];

// Expose to window for non-module scripts
if (typeof window !== 'undefined') {
  window.expandedPractice = expandedPractice;
}
