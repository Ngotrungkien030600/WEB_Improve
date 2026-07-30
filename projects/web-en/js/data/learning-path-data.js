/**
 * Learning Paths — Structured study paths with milestones and objectives
 * Provides personalized learning journeys for English, Java, and AI/ML.
 */
window.learningPaths = {
  english: [
    {
      id: 'en-beginner',
      title: '🌱 Tiếng Anh Cơ Bản',
      description: 'Xây dựng nền tảng vững chắc với từ vựng và ngữ pháp cơ bản',
      level: 'beginner',
      estimatedDays: 14,
      icon: '🌱',
      color: '#10b981',
      milestones: [
        { id: 'en-b1', title: 'Chào hỏi & Giới thiệu', objective: 'Nắm 20+ từ chào hỏi, giới thiệu bản thân', categories: ['greetings'], lessons: ['Present Simple', 'Present Continuous'], vocabCount: 20 },
        { id: 'en-b2', title: 'Sinh hoạt hàng ngày', objective: 'Nói về thói quen hàng ngày bằng tiếng Anh', categories: ['daily', 'time'], lessons: ['Present Simple', 'Adverbs of Frequency'], vocabCount: 25 },
        { id: 'en-b3', title: 'Ẩm thực & Mua sắm', objective: 'Gọi món ăn và mua sắm tự tin', categories: ['food', 'shopping'], lessons: ['Some/Any', 'Countable/Uncountable'], vocabCount: 25 },
        { id: 'en-b4', title: 'Thời tiết & Cảm xúc', objective: 'Mô tả thời tiết và cảm xúc cơ bản', categories: ['weather', 'emotion'], lessons: ['It is + adjective', 'Feelings'], vocabCount: 20 },
      ],
      finalProject: 'Viết 1 đoạn giới thiệu bản thân 5-7 câu',
      prerequisites: [],
    },
    {
      id: 'en-intermediate',
      title: '📈 Tiếng Anh Trung Cấp',
      description: 'Mở rộng vốn từ và tự tin giao tiếp trong nhiều tình huống',
      level: 'intermediate',
      estimatedDays: 21,
      icon: '📈',
      color: '#f59e0b',
      milestones: [
        { id: 'en-i1', title: 'Du lịch & Định hướng', objective: 'Hỏi đường, đặt phòng, mua vé tự tin', categories: ['travel'], lessons: ['Past Simple', 'Can/Could'], vocabCount: 20 },
        { id: 'en-i2', title: 'Sức khỏe & Trường học', objective: 'Nói về sức khỏe và học tập', categories: ['health', 'school'], lessons: ['Present Perfect', 'Should/Must'], vocabCount: 25 },
        { id: 'en-i3', title: 'Công sở & Công nghệ', objective: 'Giao tiếp nơi làm việc bằng tiếng Anh', categories: ['work', 'technology'], lessons: ['Past Continuous', 'Present Perfect Continuous'], vocabCount: 25 },
        { id: 'en-i4', title: 'Ý kiến & Thảo luận', objective: 'Bày tỏ ý kiến và tham gia thảo luận', categories: ['opinion'], lessons: ['Conditionals', 'Passive Voice'], vocabCount: 20 },
      ],
      finalProject: 'Viết email giới thiệu dự án bằng tiếng Anh',
      prerequisites: ['en-beginner'],
    },
    {
      id: 'en-advanced',
      title: '🎯 Tiếng Anh Nâng Cao',
      description: 'Làm chủ idioms, phrasal verbs và giao tiếp chuyên nghiệp',
      level: 'advanced',
      estimatedDays: 28,
      icon: '🎯',
      color: '#8b5cf6',
      milestones: [
        { id: 'en-a1', title: 'Idioms & Thành ngữ', objective: 'Dùng 20+ idioms trong giao tiếp', categories: ['idioms'], lessons: ['Idioms', 'Collocations'], vocabCount: 30 },
        { id: 'en-a2', title: 'Phrasal Verbs Mastery', objective: 'Nắm 20+ phrasal verbs thông dụng', categories: ['phrasal'], lessons: ['Phrasal Verbs'], vocabCount: 25 },
        { id: 'en-a3', title: 'Giao tiếp Công sở', objective: 'Giao tiếp chuyên nghiệp trong môi trường làm việc', categories: ['workplace'], lessons: ['Business English'], vocabCount: 20 },
        { id: 'en-a4', title: 'Viết luận & Thuyết trình', objective: 'Viết essay và thuyết trình tự tin', categories: ['collocation', 'slang'], lessons: ['Academic Writing', 'Presentation Skills'], vocabCount: 25 },
      ],
      finalProject: 'Viết 1 bài luận 300-500 từ về chủ đề tự chọn',
      prerequisites: ['en-intermediate'],
    },
  ],

  java: [
    {
      id: 'java-beginner',
      title: '☕ Java Cơ Bản',
      description: 'Nắm vững nền tảng Java: biến, OOP, collections',
      level: 'beginner',
      estimatedDays: 14,
      icon: '☕',
      color: '#3b82f6',
      milestones: [
        { id: 'j-b1', title: 'Biến & Kiểu dữ liệu', objective: 'Hiểu primitive vs reference, ép kiểu', lessons: ['Bai1_Bien_KieuDuLieu.md'] },
        { id: 'j-b2', title: 'Điều kiện & Vòng lặp', objective: 'Viết if-else, switch, for, while', lessons: ['Bai2_CauDieuKien_VongLap.md'] },
        { id: 'j-b3', title: 'Mảng & Chuỗi', objective: 'Thao tác mảng và String, StringBuilder', lessons: ['Bai3_Mang_Chuoi.md'] },
        { id: 'j-b4', title: 'OOP', objective: 'Hiểu 4 tính chất OOP, interface vs abstract', lessons: ['Bai4_OOP.md'] },
      ],
      finalProject: 'Xây dựng lớp StudentManager cơ bản (CRUD)',
      prerequisites: [],
    },
    {
      id: 'java-intermediate',
      title: '⚙️ Java Trung Cấp',
      description: 'Collections, Generic, SQL, JDBC, Git',
      level: 'intermediate',
      estimatedDays: 21,
      icon: '⚙️',
      color: '#f59e0b',
      milestones: [
        { id: 'j-i1', title: 'Collection & Generic', objective: 'Dùng ArrayList, HashMap, Generic class', lessons: ['Bai5_Collection_Generic.md'] },
        { id: 'j-i2', title: 'Cấu trúc dữ liệu', objective: 'Stack, Queue, Linked List, Tree', lessons: ['Bai6_CauTrucDuLieu.md'] },
        { id: 'j-i3', title: 'Giải thuật', objective: 'Search, Sort, Recursion cơ bản', lessons: ['Bai7_ThuatToan.md'] },
        { id: 'j-i4', title: 'SQL & JDBC', objective: 'CRUD, JOIN, PreparedStatement, DAO', lessons: ['Bai8_SQL.md', 'Bai9_JDBC_Database.md'] },
      ],
      finalProject: 'Xây dựng ứng dụng quản lý sinh viên với JDBC + DAO',
      prerequisites: ['java-beginner'],
    },
  ],

  ai: [
    {
      id: 'ai-beginner',
      title: '🤖 AI/ML Cơ Bản',
      description: 'Nắm vững concepts Machine Learning cốt lõi',
      level: 'beginner',
      estimatedDays: 14,
      icon: '🤖',
      color: '#ef4444',
      milestones: [
        { id: 'ai-b1', title: 'ML Concepts', objective: 'Hiểu supervised, unsupervised, RL', categories: ['ml'], lessons: ['ML Cơ bản'] },
        { id: 'ai-b2', title: 'Deep Learning cơ bản', objective: 'Nắm NN, Backpropagation, CNN, RNN', categories: ['dl'], lessons: ['Deep Learning'] },
        { id: 'ai-b3', title: 'NLP cơ bản', objective: 'Tokenization, Embedding, Sentiment', categories: ['nlp'], lessons: ['NLP'] },
        { id: 'ai-b4', title: 'Dự án thực hành đầu tay', objective: 'Hoàn thành 1-2 dự án AI cơ bản', categories: ['ml'], lessons: ['Projects'] },
      ],
      finalProject: 'Xây dựng model dự đoán giá nhà (Linear Regression)',
      prerequisites: [],
    },
  ],

  /** Get next milestone in a path */
  getNextMilestone(pathId, completedIds) {
    const path = [...this.english, ...this.java, ...this.ai].find(p => p.id === pathId);
    if (!path) return null;
    return path.milestones.find(m => !completedIds.includes(m.id)) || null;
  },

  /** Get path progress */
  getPathProgress(pathId, completedIds) {
    const path = [...this.english, ...this.java, ...this.ai].find(p => p.id === pathId);
    if (!path) return 0;
    const total = path.milestones.length;
    const done = path.milestones.filter(m => completedIds.includes(m.id)).length;
    return Math.round((done / total) * 100);
  },

  /** Get recommended path based on skill level */
  getRecommendedPaths(interests) {
    const all = [...this.english, ...this.java, ...this.ai];
    if (!interests || interests.length === 0) return all.filter(p => p.level === 'beginner');
    return all.filter(p => interests.some(i => p.id.startsWith(i)));
  },
};
