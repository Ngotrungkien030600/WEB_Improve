<template>
  <div class="english-page" style="--color-accent: #6366f1">
    <CTopbar
      title="Học Tiếng Anh"
      back-label="Trang chủ"
      @go-home="handleNavigate('/')"
    />

    <div class="english-container">
      <!-- Header Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-icon">📋</span>
          <span class="stat-label">Hôm nay</span>
          <span class="stat-value">{{ todayMins }}p</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔥</span>
          <span class="stat-label">Streak</span>
          <span class="stat-value">{{ streak }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📦</span>
          <span class="stat-label">Đã rèn</span>
          <span class="stat-value">{{ total }}</span>
        </div>
        <div class="stat-timer">
          <button class="timer-btn" @click="toggleTimer">
            <span class="timer-icon">{{ isRunning ? '⏸️' : '⚒️' }}</span>
            <span class="timer-time">{{ formattedTime }}</span>
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
        <a class="tab-item tab-link" href="/exam">
          <span class="tab-icon">📝</span>
          <span class="tab-label">Thi</span>
        </a>
      </div>

      <!-- Vocab Section -->
      <section v-if="currentTab === 'vocab'" class="english-section">
        <div class="category-select">
          <label for="vocab-category">Chủ đề:</label>
          <select v-model="vocabCategory" id="vocab-category">
            <option value="all">Tất cả</option>
            <option v-for="cat in vocabCategories" :key="cat" :value="cat">{{ vocabCategoryLabels[cat] }}</option>
          </select>
        </div>

        <div class="flip-card-container">
          <div class="flip-card" :class="{ flipped: vocabFlipped }" @click="vocabFlipped = !vocabFlipped">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <h2>{{ vocabCard?.en }}</h2>
                <button class="btn-speak" @click.stop="speakWord(vocabCard?.en)" title="Nghe phát âm">🔊</button>
                <p class="phonetic">{{ vocabCard?.phonetic }}</p>
                <span class="tag">{{ vocabCard?.tag }}</span>
              </div>
              <div class="flip-card-back">
                <h3>{{ vocabCard?.vi }}</h3>
                <p class="example-en">{{ vocabCard?.exampleEn }}</p>
                <p class="example-vi">{{ vocabCard?.exampleVi }}</p>
              </div>
            </div>
          </div>

          <div class="controls">
            <button @click="vocabPrev">⬅️ Trước</button>
            <button @click="vocabFlipped = !vocabFlipped">🔄 Lật</button>
            <button @click="vocabNext">Tiếp ➡️</button>
          </div>
          <p class="counter">{{ vocabIndex + 1 }} / {{ filteredVocab.length }}</p>
        </div>
      </section>

      <!-- Tense Section -->
      <section v-if="currentTab === 'tense'" class="english-section">
        <div class="subpage-tabs tense-subtabs">
          <button
            class="tab"
            :class="{ active: tenseMode === 'learn' }"
            @click="tenseMode = 'learn'"
          >📘 Học thì</button>
          <button
            class="tab"
            :class="{ active: tenseMode === 'practice' }"
            @click="tenseMode = 'practice'"
          >✍️ Luyện tập</button>
        </div>

        <!-- Learn Tense -->
        <div v-if="tenseMode === 'learn'" class="flip-card-container">
          <div class="flip-card" :class="{ flipped: tenseFlipped }" @click="tenseFlipped = !tenseFlipped">
            <div class="flip-card-inner">
              <div class="flip-card-front">
                <h2>{{ tenseCard?.name }}</h2>
                <p class="tense-subtitle">{{ tenseCard?.title }}</p>
                <p><strong>Công thức:</strong> {{ tenseCard?.form }}</p>
                <p><strong>Cách dùng:</strong> {{ tenseCard?.usage }}</p>
                <p><strong>Dấu hiệu:</strong> {{ tenseCard?.signal }}</p>
              </div>
              <div class="flip-card-back">
                <p class="tense-example-en">{{ tenseCard?.exampleEn }}</p>
                <p class="tense-example-vi">{{ tenseCard?.exampleVi }}</p>
                <p class="note">{{ tenseCard?.note }}</p>
              </div>
            </div>
          </div>
          <div class="controls">
            <button @click="tensePrev">⬅️ Trước</button>
            <button @click="tenseFlipped = !tenseFlipped">🔄 Lật</button>
            <button @click="tenseNext">Tiếp ➡️</button>
          </div>
          <p class="counter">{{ tenseIndex + 1 }} / {{ tenses.length }}</p>
        </div>

        <!-- Practice Tense -->
        <div v-if="tenseMode === 'practice'" class="practice-container">
          <p class="tense-label">{{ practiceCard?.name }}</p>
          <p class="counter">{{ practiceIndex + 1 }} / {{ practiceSentences.length }}</p>
          <h3 class="practice-vietnamese">{{ practiceCard?.vi }}</h3>
          <div class="word-bank">
            <button
              v-for="(word, i) in shuffledWords"
              :key="i"
              class="word-btn"
              :class="{ used: usedWords.includes(word) }"
              :disabled="usedWords.includes(word)"
              @click="selectWord(word)"
            >{{ word }}</button>
          </div>
          <div class="dropzone" :class="{ filled: !!userSentence }">
            <span v-if="!userSentence" class="drop-hint">Bấm từ bên dưới để xếp câu...</span>
            <span v-else>{{ userSentence }}</span>
          </div>
          <div class="practice-actions">
            <button @click="checkPractice">✅ Kiểm tra</button>
            <button @click="resetPractice">🔄 Làm lại</button>
            <button @click="nextPractice">Tiếp ➡️</button>
          </div>
          <div class="practice-feedback" :class="{ show: practiceFeedback }">
            <span v-if="practiceCorrect" class="feedback-correct">✅ Đúng!</span>
            <span v-else class="feedback-wrong">❌ Sai. Đáp án: {{ practiceCard?.en }}</span>
          </div>
        </div>
      </section>

      <!-- Story Section -->
      <section v-if="currentTab === 'story'" class="english-section">
        <div class="story-card">
          <h2>{{ stories[storyIndex]?.title }}</h2>
          <p class="story-subtitle">{{ stories[storyIndex]?.subtitle }}</p>
          <div class="story-nav">
            <button @click="storyPrev">⬅️ Truyện trước</button>
            <button @click="storyNext">Truyện tiếp theo ➡️</button>
          </div>
          <p class="counter">{{ storyIndex + 1 }} / {{ stories.length }}</p>
          <div class="story-box">
            <p
              v-for="(sentence, idx) in stories[storyIndex]?.sentences"
              :key="idx"
              class="story-sentence"
            >
              {{ sentence.en }}
              <span class="story-hover">{{ sentence.vi }}</span>
            </p>
          </div>
          <p class="story-tip">🖱️ Rê chuột vào câu tiếng Anh để xem nghĩa tiếng Việt tương ứng.</p>
        </div>
      </section>

      <!-- Q&A Section - Word by Word -->
      <section v-if="currentTab === 'qa'" class="english-section">
        <div class="qa-card">
          <h2>❓ Học từ vựng hỏi</h2>
          <p class="qa-subtitle">Bấm vào từ để xem: nghĩa, cách dùng, và ví dụ</p>

          <!-- Category Filter -->
          <div class="qa-filter">
            <button
              v-for="cat in qaCategories"
              :key="cat"
              class="qa-cat-btn"
              :class="{ active: qaFilterCat === cat }"
              @click="qaFilterCat = cat; qaShuffle()"
            >{{ cat }}</button>
          </div>

          <p class="qa-counter">Câu {{ qaWordIndex + 1 }} / {{ filteredQaWords.length }}</p>

          <!-- Word Card - Flip Animation -->
          <div class="qa-card-container" :class="{ flipped: qaWordRevealed }">
            <!-- Front Side -->
            <div class="qa-card-face qa-card-front" @click="qaWordReveal">
              <div class="qa-word-main">
                <span class="qa-word">{{ qaCurrentWord?.word }}</span>
                <span class="qa-type">{{ qaCurrentWord?.type }}</span>
              </div>
              <p class="hint-emoji">👆 Bấm để xem nghĩa</p>
            </div>

            <!-- Back Side -->
            <div class="qa-card-face qa-card-back">
              <div class="qa-word-main">
                <span class="qa-word">{{ qaCurrentWord?.word }}</span>
                <span class="qa-type">{{ qaCurrentWord?.type }}</span>
              </div>
              <div class="qa-detail-section">
                <p class="detail-label">📖 Nghĩa</p>
                <p class="detail-value">{{ qaCurrentWord?.meaning }}</p>
              </div>
              <div class="qa-detail-section">
                <p class="detail-label">💡 Dùng khi nào</p>
                <p class="detail-value">{{ qaCurrentWord?.usage }}</p>
              </div>
              <div class="qa-detail-section">
                <p class="detail-label">📝 Ví dụ</p>
                <div class="detail-examples">
                  <p v-for="(ex, i) in qaCurrentWord?.examples" :key="i" class="detail-example">{{ ex }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Formula Box -->
          <div class="qa-formula-box">
            <p class="formula-label">🔧 Công thức dùng {{ qaCurrentWord?.word }}:</p>
            <p class="formula-text">{{ qaCurrentWord?.formula }}</p>
          </div>

          <!-- Navigation -->
          <div class="qa-controls">
            <button @click="qaWordPrev">⬅️</button>
            <button @click="qaWordRevealed = false; qaWordNext()" v-if="qaWordRevealed">➡️ Tiếp</button>
            <button @click="qaWordRevealed = false" v-else>🔄 Lại</button>
            <button @click="qaShuffle">🔀 Ngẫu nhiên</button>
          </div>
        </div>
      </section>

      <!-- Game Section -->
      <section v-if="currentTab === 'game'" class="english-section">
        <div class="game-links">
          <CHubCard
            v-for="card in gameCards"
            :key="card.title"
            :icon="card.icon"
            :title="card.title"
            :description="card.description"
            :path="card.path"
            @navigate="handleNavigate"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CHubCard from '../components/CHubCard.vue';

// ====== DATA (inline, no R6) ======
const vocabData = [
  { en: 'Hello', phonetic: '/həˈloʊ/', vi: 'Xin chào', tag: 'greetings', exampleEn: '"Hello, nice to meet you!"', exampleVi: '"Xin chào, rất vui được gặp bạn!"' },
  { en: 'Goodbye', phonetic: '/ɡʊdˈbaɪ/', vi: 'Tạm biệt', tag: 'greetings', exampleEn: '"Goodbye, see you tomorrow!"', exampleVi: '"Tạm biệt, hẹn gặp lại ngày mai!"' },
  { en: 'Thank you', phonetic: '/θæŋk juː/', vi: 'Cảm ơn', tag: 'greetings', exampleEn: '"Thank you for your help!"', exampleVi: '"Cảm ơn bạn đã giúp đỡ!"' },
  { en: 'Please', phonetic: '/pliːz/', vi: 'Làm ơn / Xin', tag: 'greetings', exampleEn: '"Please close the door."', exampleVi: '"Làm ơn đóng cửa lại."' },
  { en: 'Sorry', phonetic: '/ˈsɒri/', vi: 'Xin lỗi', tag: 'greetings', exampleEn: '"Sorry, I\'m late."', exampleVi: '"Xin lỗi, tôi đến muộn."' },
  { en: 'Water', phonetic: '/ˈwɔːtər/', vi: 'Nước', tag: 'food', exampleEn: '"Can I have a glass of water?"', exampleVi: '"Tôi có thể xin một ly nước không?"' },
  { en: 'Coffee', phonetic: '/ˈkɒfi/', vi: 'Cà phê', tag: 'food', exampleEn: '"I drink coffee every morning."', exampleVi: '"Tôi uống cà phê mỗi sáng."' },
  { en: 'Book', phonetic: '/bʊk/', vi: 'Sách', tag: 'school', exampleEn: '"This book is very interesting."', exampleVi: '"Cuốn sách này rất thú vị."' },
  { en: 'Computer', phonetic: '/kəmˈpjuːtər/', vi: 'Máy tính', tag: 'technology', exampleEn: '"My computer is very slow."', exampleVi: '"Máy tính của tôi rất chậm."' },
  { en: 'Work', phonetic: '/wɜːrk/', vi: 'Làm việc', tag: 'work', exampleEn: '"I work at a tech company."', exampleVi: '"Tôi làm việc ở một công ty công nghệ."' },
  { en: 'Time', phonetic: '/taɪm/', vi: 'Thời gian', tag: 'time', exampleEn: '"What time is it?"', exampleVi: '"Bây giờ là mấy giờ?"' },
  { en: 'Sun', phonetic: '/sʌn/', vi: 'Mặt trời', tag: 'weather', exampleEn: '"The sun is very bright today."', exampleVi: '"Mặt trời rất chói chang hôm nay."' },
  { en: 'Happy', phonetic: '/ˈhæpi/', vi: 'Vui vẻ', tag: 'emotion', exampleEn: '"I am very happy today."', exampleVi: '"Tôi rất vui hôm nay."' },
  { en: 'Hospital', phonetic: '/ˈhɒspɪtl/', vi: 'Bệnh viện', tag: 'health', exampleEn: '"The hospital is near here."', exampleVi: '"Bệnh viện ở gần đây."' },
  { en: 'Apple', phonetic: '/ˈæpl/', vi: 'Quả táo', tag: 'food', exampleEn: '"An apple a day keeps the doctor away."', exampleVi: '"Một quả táo mỗi ngày giúp bạn không cần bác sĩ."' },
  { en: 'Car', phonetic: '/kɑːr/', vi: 'Ô tô', tag: 'travel', exampleEn: '"I drive a red car."', exampleVi: '"Tôi lái một chiếc ô tô màu đỏ."' },
  { en: 'Hotel', phonetic: '/hoʊˈtel/', vi: 'Khách sạn', tag: 'travel', exampleEn: '"The hotel is very expensive."', exampleVi: '"Khách sạn này rất đắt."' },
  { en: 'Shop', phonetic: '/ʃɒp/', vi: 'Cửa hàng', tag: 'shopping', exampleEn: '"The shop opens at 8 a.m."', exampleVi: '"Cửa hàng mở cửa lúc 8 giờ sáng."' },
  { en: 'Friend', phonetic: '/frend/', vi: 'Bạn bè', tag: 'emotion', exampleEn: '"He is my best friend."', exampleVi: '"An ấy là bạn thân của tôi."' },
  { en: 'Learn', phonetic: '/lɜːrn/', vi: 'Học', tag: 'school', exampleEn: '"I learn English every day."', exampleVi: '"Tôi học tiếng Anh mỗi ngày."' },
];

const tenses = [
  { name: 'Present Simple', title: 'Thì hiện tại đơn', form: 'S + V(s/es)', usage: 'Diễn tả thói quen, sự thật hiển nhiên', signal: 'always, usually, every day...', exampleEn: '"She goes to school every day."', exampleVi: '"Cô ấy đi học mỗi ngày."', note: 'Với third person singular (he/she/it), động từ thêm s/es.' },
  { name: 'Present Continuous', title: 'Thì hiện tại tiếp diễn', form: 'S + am/is/are + V-ing', usage: 'Diễn tả hành động đang xảy ra ngay lúc nói', signal: 'now, right now, at the moment...', exampleEn: '"She is studying now."', exampleVi: '"Cô ấy đang học bây giờ."', note: 'Dùng am/is/are + V-ing.' },
  { name: 'Past Simple', title: 'Thì quá khứ đơn', form: 'S + V(ed) / V2', usage: 'Diễn tả hành động đã xảy ra và kết thúc trong quá khứ', signal: 'yesterday, last week, in 2020...', exampleEn: '"She went to school yesterday."', exampleVi: '"Cô ấy đi học hôm qua."', note: 'Động từ chia quá khứ: regular → ed, irregular → V2.' },
  { name: 'Future Simple', title: 'Thì tương lai đơn', form: 'S + will + V', usage: 'Diễn tả hành động sẽ xảy ra trong tương lai', signal: 'tomorrow, next week, in the future...', exampleEn: '"She will go to school tomorrow."', exampleVi: '"Cô ấy sẽ đi học ngày mai."', note: 'Will + V (nguyên mẫu).' },
  { name: 'Present Perfect', title: 'Thì hiện tại hoàn thành', form: 'S + have/has + V3', usage: 'Diễn tả hành động bắt đầu trong quá khứ, còn ảnh hưởng đến hiện tại', signal: 'already, yet, just, ever, never...', exampleEn: '"She has finished her homework."', exampleVi: '"Cô ấy đã xong bài tập."', note: 'Have/has + V3 (quá khứ phân từ).' },
  { name: 'Past Continuous', title: 'Thì quá khứ tiếp diễn', form: 'S + was/were + V-ing', usage: 'Diễn tả hành động đang xảy ra tại một thời điểm trong quá khứ', signal: 'at 5 p.m. yesterday, while, when...', exampleEn: '"She was studying at 5 p.m."', exampleVi: '"Cô ấy đang học lúc 5 giờ chiều."', note: 'Was (I/he/she/it) + V-ing, Were (you/we/they) + V-ing.' },
  { name: 'Future Continuous', title: 'Thì tương lai tiếp diễn', form: 'S + will be + V-ing', usage: 'Diễn tả hành động sẽ đang xảy ra tại một thời điểm trong tương lai', signal: 'at this time tomorrow, at 8 p.m. next Friday...', exampleEn: '"She will be studying at 8 p.m."', exampleVi: '"Cô ấy sẽ đang học lúc 8 giờ tối."', note: 'Will be + V-ing.' },
  { name: 'Present Perfect Continuous', title: 'Thì HTD tiếp diễn', form: 'S + have/has + been + V-ing', usage: 'Diễn tả hành động bắt đầu trong quá khứ, kéo dài đến hiện tại, nhấn mạnh thời gian', signal: 'for, since, all day...', exampleEn: '"She has been studying for 3 hours."', exampleVi: '"Cô ấy đã học được 3 tiếng."', note: 'Have/has + been + V-ing.' },
  { name: 'Past Perfect', title: 'Thì quá khứ hoàn thành', form: 'S + had + V3', usage: 'Diễn tả hành động xảy ra trước một hành động khác trong quá khứ', signal: 'before, after, when, by the time...', exampleEn: '"She had finished before he came."', exampleVi: '"Cô ấy đã xong trước khi anh ấy đến."', note: 'Had + V3 (quá khứ phân từ).' },
  { name: 'Past Perfect Continuous', title: 'Thì QKHT tiếp diễn', form: 'S + had + been + V-ing', usage: 'Diễn tả hành động đang xảy ra và kéo dài đến một thời điểm trong quá khứ', signal: 'for, since, before...', exampleEn: '"She had been studying for 2 hours before he came."', exampleVi: '"Cô ấy đã học được 2 tiếng trước khi anh ấy đến."', note: 'Had + been + V-ing.' },
  { name: 'Future Perfect', title: 'Thì tương lai hoàn thành', form: 'S + will have + V3', usage: 'Diễn tả hành động sẽ hoàn thành TRƯỚC một thời điểm trong tương lai', signal: 'by, before, by the time...', exampleEn: '"She will have finished by tomorrow."', exampleVi: '"Cô ấy sẽ xong trước ngày mai."', note: 'Will have + V3.' },
  { name: 'Future Perfect Continuous', title: 'Thì TTHT tiếp diễn', form: 'S + will have been + V-ing', usage: 'Diễn tả hành động kéo dài đến một thời điểm trong tương lai', signal: 'for, by the time...', exampleEn: '"She will have been studying for 5 years by 2030."', exampleVi: '"Cô ấy sẽ đã học được 5 năm tính đến năm 2030."', note: 'Will have been + V-ing.' },
];

const practiceSentences = [
  { name: 'Present Simple', vi: 'Cô ấy đi học mỗi ngày.', en: 'She goes to school every day', words: ['She', 'goes', 'to', 'school', 'every', 'day'] },
  { name: 'Present Simple', vi: 'Tôi làm việc ở công ty ABC.', en: 'I work at ABC company', words: ['I', 'work', 'at', 'ABC', 'company'] },
  { name: 'Present Continuous', vi: 'Cô ấy đang học bài.', en: 'She is studying', words: ['She', 'is', 'studying'] },
  { name: 'Present Continuous', vi: 'Họ đang chơi bóng đá.', en: 'They are playing football', words: ['They', 'are', 'playing', 'football'] },
  { name: 'Past Simple', vi: 'Anh ấy đi Hà Nội hôm qua.', en: 'He went to Hanoi yesterday', words: ['He', 'went', 'to', 'Hanoi', 'yesterday'] },
  { name: 'Past Simple', vi: 'Tôi xem phim tối qua.', en: 'I watched a movie last night', words: ['I', 'watched', 'a', 'movie', 'last', 'night'] },
  { name: 'Future Simple', vi: 'Tôi sẽ đi Đà Nẵng tuần sau.', en: 'I will go to Da Nang next week', words: ['I', 'will', 'go', 'to', 'Da', 'Nang', 'next', 'week'] },
  { name: 'Future Simple', vi: 'Trời sẽ mưa ngày mai.', en: 'It will rain tomorrow', words: ['It', 'will', 'rain', 'tomorrow'] },
  { name: 'Present Perfect', vi: 'Tôi đã ăn sáng rồi.', en: 'I have had breakfast', words: ['I', 'have', 'had', 'breakfast'] },
  { name: 'Present Perfect', vi: 'Cô ấy học tiếng Anh 5 năm rồi.', en: 'She has learned English for 5 years', words: ['She', 'has', 'learned', 'English', 'for', '5', 'years'] },
  { name: 'Past Continuous', vi: 'Tôi đang đọc sách khi cô ấy gọi.', en: 'I was reading when she called', words: ['I', 'was', 'reading', 'when', 'she', 'called'] },
  { name: 'Past Continuous', vi: 'Họ đang chờ xe buýt lúc trời mưa.', en: 'They were waiting for the bus when it rained', words: ['They', 'were', 'waiting', 'for', 'the', 'bus', 'when', 'it', 'rained'] },
  { name: 'Present Perfect Continuous', vi: 'Tôi đã học được 3 tiếng rồi.', en: 'I have been studying for 3 hours', words: ['I', 'have', 'been', 'studying', 'for', '3', 'hours'] },
  { name: 'Present Perfect Continuous', vi: 'Cô ấy đã làm việc được 2 năm.', en: 'She has been working for 2 years', words: ['She', 'has', 'been', 'working', 'for', '2', 'years'] },
  { name: 'Past Perfect', vi: 'Tôi đã ăn xong trước khi cô ấy đến.', en: 'I had eaten before she came', words: ['I', 'had', 'eaten', 'before', 'she', 'came'] },
  { name: 'Past Perfect', vi: 'Anh ấy đã đi ngủ khi tôi gọi.', en: 'He had gone to bed when I called', words: ['He', 'had', 'gone', 'to', 'bed', 'when', 'I', 'called'] },
];

const qaWords = [
  // WHERE
  { word: 'Where', type: 'adv', meaning: 'Ở đâu', category: 'WHERE',
    usage: 'Hỏi về địa điểm, nơi chốn',
    formula: 'WHERE + động từ (thường chia: do/does/did/will)',
    examples: [
      'Where do you live? — I live in Hanoi.',
      'Where did you go yesterday? — I went to Da Nang.',
      'Where is the hospital? — It is near here.',
      'Where are you from? — I am from Vietnam.',
      'Where will we meet tomorrow? — At the cafe.',
    ] },
  // WHY
  { word: 'Why', type: 'adv', meaning: 'Tại sao', category: 'WHY',
    usage: 'Hỏi về lý do, nguyên nhân',
    formula: 'WHY + động từ. Trả lời: Because...',
    examples: [
      'Why are you late? — Because the bus was stuck.',
      'Why do you learn English? — Because I want a better job.',
      'Why did she study hard? — Because she had an exam.',
      'Why is he happy today? — Because it is his birthday.',
      'Why will you go home early? — Because I am tired.',
    ] },
  // WHAT
  { word: 'What', type: 'pron', meaning: 'Cái gì / Là gì', category: 'WHAT',
    usage: 'Hỏi về sự vật, công việc, sự việc',
    formula: 'WHAT + động từ. WHAT IS/ARE + danh từ',
    examples: [
      'What is your name? — My name is Linh.',
      'What do you do? — I am a student.',
      'What did you eat yesterday? — I ate pho.',
      'What will you do tomorrow? — I will go to school.',
      'What is this? — It is a book.',
    ] },
  // WHEN
  { word: 'When', type: 'adv', meaning: 'Khi nào', category: 'WHEN',
    usage: 'Hỏi về thời gian, ngày tháng',
    formula: 'WHEN + động từ',
    examples: [
      'When is your birthday? — It is on July 15th.',
      'When do you go to school? — I go at 7 a.m.',
      'When did you start learning English? — I started 3 years ago.',
      'When will they arrive? — They will arrive at 9 p.m.',
      'When is the meeting? — It is on Monday.',
    ] },
  // HOW - are
  { word: 'How', type: 'adv', meaning: 'Như thế nào', category: 'HOW',
    usage: 'Hỏi về cách thức, tình trạng (chung)',
    formula: 'HOW + are/is/do/does + S',
    examples: [
      'How are you today? — I am fine, thank you.',
      'How do you go to school? — I go by bike.',
      'How did she learn English? — She learned by watching videos.',
      'How is your new job? — It is great.',
      'How do you cook this? — I follow a recipe.',
    ] },
  // HOW MUCH
  { word: 'How much', type: 'phrase', meaning: 'Bao nhiêu (không đếm được)', category: 'HOW',
    usage: 'Hỏi về giá tiền, lượng không đếm được',
    formula: 'HOW MUCH + danh từ + động từ',
    examples: [
      'How much does this cost? — It costs 50,000 VND.',
      'How much water do you drink? — About 2 liters.',
      'How much time do we have? — We have 30 minutes.',
      'How much sugar do you want? — Just a little.',
      'How much does the ticket cost? — It is free.',
    ] },
  // HOW MANY
  { word: 'How many', type: 'phrase', meaning: 'Bao nhiêu (đếm được)', category: 'HOW',
    usage: 'Hỏi về số lượng đếm được',
    formula: 'HOW MANY + danh từ số nhiều + động từ',
    examples: [
      'How many books do you have? — I have 5 books.',
      'How many students are in your class? — There are 30.',
      'How many languages do you speak? — I speak two.',
      'How many times did you try? — I tried three times.',
      'How many brothers do you have? — I have one.',
    ] },
  // WHO
  { word: 'Who', type: 'pron', meaning: 'Ai', category: 'WHO',
    usage: 'Hỏi về người (chủ thể)',
    formula: 'WHO + động từ. WHO IS/ARE + danh từ',
    examples: [
      'Who is your best friend? — My best friend is Lan.',
      'Who do you love most? — I love my mother.',
      'Who did you meet yesterday? — I met my teacher.',
      'Who is calling, please? — It is John.',
      'Who will help you? — My sister will help me.',
    ] },
  // WHICH
  { word: 'Which', type: 'pron', meaning: 'Cái nào', category: 'WHICH',
    usage: 'Hỏi lựa chọn trong số ít đã biết',
    formula: 'WHICH + danh từ + động từ',
    examples: [
      'Which color do you like? — I like blue.',
      'Which book did you read? — I read the red one.',
      'Which one is yours? — The black one is mine.',
      'Which class are you in? — I am in class 5A.',
      'Which movie shall we watch? — The new one.',
    ] },
  // WHOSE
  { word: 'Whose', type: 'pron', meaning: 'Của ai', category: 'WHOSE',
    usage: 'Hỏi về sở hữu',
    formula: 'WHOSE + danh từ + động từ',
    examples: [
      'Whose book is this? — It is mine.',
      'Whose car is that? — It is my father\'s.',
      'Whose bag did you take? — I took my sister\'s.',
      'Whose idea was it? — It was Tom\'s.',
      'Whose children are playing outside?',
    ] },
  // CAN
  { word: 'Can', type: 'modal', meaning: 'Có thể', category: 'CAN',
    usage: 'Hỏi về khả năng, sự cho phép',
    formula: 'CAN + S + V (nguyên mẫu)',
    examples: [
      'Can you speak English? — Yes, I can.',
      'Can I help you? — Yes, please.',
      'Can she swim? — No, she can\'t.',
      'Can you play the piano? — A little.',
      'Can we sit here? — Sure.',
    ] },
  // COULD
  { word: 'Could', type: 'modal', meaning: 'Có thể (lịch sự hơn)', category: 'CAN',
    usage: 'Hỏi lịch sự hơn về khả năng',
    formula: 'COULD + S + V (nguyên mẫu)',
    examples: [
      'Could you help me, please?',
      'Could I borrow your pen? — Sure.',
      'Could you speak louder? — Of course.',
      'Could we have more time? — Sorry, no.',
      'Could she play chess? — Yes, very well.',
    ] },
  // WOULD
  { word: 'Would', type: 'modal', meaning: 'Sẽ / Muốn', category: 'WOULD',
    usage: 'Hỏi về nguyện vọng, lịch sự',
    formula: 'WOULD YOU LIKE + N? | WOULD + S + V',
    examples: [
      'Would you like some coffee? — Yes, please.',
      'Would you come to my party? — Sure, I would.',
      'What would you do in my place?',
      'Would you mind opening the window?',
      'Would you like tea or coffee?',
    ] },
  // SHOULD
  { word: 'Should', type: 'modal', meaning: 'Nên', category: 'SHOULD',
    usage: 'Hỏi về lời khuyên',
    formula: 'SHOULD + S + V (nguyên mẫu)',
    examples: [
      'Should I study today? — Yes, you should.',
      'What should I do? — You should rest.',
      'Should we leave now? — Yes, let\'s go.',
      'Should she apologize? — Yes, she should.',
      'Should I bring an umbrella? — Maybe.',
    ] },
  // WILL
  { word: 'Will', type: 'modal', meaning: 'Sẽ', category: 'WILL',
    usage: 'Hỏi về tương lai',
    formula: 'WILL + S + V (nguyên mẫu)',
    examples: [
      'Will you come tomorrow? — Yes, I will.',
      'Will it rain today? — No, it won\'t.',
      'Will she be here at 8? — Yes, she will.',
      'When will you finish? — I will finish soon.',
      'Will they win the game? — I hope so.',
    ] },
  // DO/DOES
  { word: 'Do / Does', type: 'aux', meaning: 'Dùng hỏi thì hiện tại đơn', category: 'DO',
    usage: 'Hỏi thói quen, sự thật chung (hiện tại đơn)',
    formula: 'DO + I/you/we/they + V. DOES + he/she/it + V',
    examples: [
      'Do you like coffee? — Yes, I do.',
      'Does she speak English? — Yes, she does.',
      'Do they work here? — No, they don\'t.',
      'Do you exercise every day? — I try to.',
      'Does he know the answer? — I think so.',
    ] },
  // DID
  { word: 'Did', type: 'aux', meaning: 'Dùng hỏi quá khứ đơn', category: 'DO',
    usage: 'Hỏi về sự việc đã xảy ra (quá khứ đơn)',
    formula: 'DID + S + V (nguyên mẫu)',
    examples: [
      'Did you eat breakfast? — Yes, I did.',
      'Did she go to school yesterday? — No, she didn\'t.',
      'Did you enjoy the movie? — Very much.',
      'Did they arrive on time? — Yes, they did.',
      'Did he call you last night? — No, he didn\'t.',
    ] },
  // IS/ARE
  { word: 'Is / Are', type: 'aux', meaning: 'Dùng hỏi về trạng thái', category: 'BE',
    usage: 'Hỏi về nghề nghiệp, tính chất, trạng thái',
    formula: 'IS + he/she/it. ARE + I/you/we/they',
    examples: [
      'Is she a teacher? — Yes, she is.',
      'Are they at home? — No, they are not.',
      'Is it cold today? — Yes, it is.',
      'Are you ready? — Not yet.',
      'Is the book on the table? — Yes, it is.',
    ] },
  // WAS/WERE
  { word: 'Was / Were', type: 'aux', meaning: 'Dùng hỏi quá khứ (trạng thái)', category: 'BE',
    usage: 'Hỏi về trạng thái trong quá khứ',
    formula: 'WAS + I/he/she/it. WERE + you/we/they',
    examples: [
      'Was it raining yesterday? — Yes, it was.',
      'Were you at school last week? — Yes, I was.',
      'Was she a doctor then? — No, she was a nurse.',
      'Were they home last night? — I think so.',
      'Was he happy yesterday? — Very.',
    ] },
  // HAVE/HAS
  { word: 'Have / Has', type: 'aux', meaning: 'Dùng hỏi HTD, QKHT', category: 'HAVE',
    usage: 'Hỏi về trải nghiệm, sự sở hữu (HTD, QKHT)',
    formula: 'HAVE/HAS + S + V3 (quá khứ phân từ)',
    examples: [
      'Have you been to Hanoi? — Yes, I have.',
      'Has she finished her homework? — Not yet.',
      'Have they eaten yet? — Yes, they have.',
      'Have you ever eaten sushi? — No, never.',
      'Has he left? — Yes, just now.',
    ] },
  // AM
  { word: 'Am', type: 'aux', meaning: 'Dùng với chủ ngữ I', category: 'BE',
    usage: 'Hỏi về bản thân người nói',
    formula: 'AM + I + ...?',
    examples: [
      'Am I late? — No, you are on time.',
      'Am I going the right way? — Yes, straight ahead.',
      'Am I interrupting? — No, go ahead.',
      'Am I invited? — Of course!',
      'Am I speaking too fast? — A little.',
    ] },
];

const stories = [
  {
    title: 'Cristiano Ronaldo — Discipline and Hard Work',
    subtitle: 'Kỷ luật và chăm chỉ',
    sentences: [
      { en: 'CR7 is one of the greatest footballers of all time.', vi: 'CR7 là một trong những cầu thủ vĩ đại nhất mọi thời đại.' },
      { en: 'He is famous for his hard work and strict discipline.', vi: 'Anh ấy nổi tiếng với sự chăm chỉ và kỷ luật nghiêm khắc.' },
      { en: 'Ronaldo trains every day, even on Christmas.', vi: 'Ronaldo tập luyện mỗi ngày, kể cả Giáng sinh.' },
      { en: 'He sleeps 8 hours every night to recover his body.', vi: 'Anh ấy ngủ 8 tiếng mỗi đêm để phục hồi cơ thể.' },
      { en: 'Lesson: Success comes from persistence.', vi: 'Bài học: Sự thành công đến từ sự kiên trì.' },
    ],
  },
  {
    title: 'Steve Jobs — Innovation',
    subtitle: 'Sáng tạo và đổi mới',
    sentences: [
      { en: 'Steve Jobs was the co-founder of Apple.', vi: 'Steve Jobs là đồng sáng lập Apple.' },
      { en: 'He changed the way we think about technology.', vi: 'Ông đã thay đổi cách chúng ta nghĩ về công nghệ.' },
      { en: 'The iPhone was a world-changing product.', vi: 'iPhone là sản phẩm thay đổi thế giới.' },
      { en: 'Steve Jobs was once fired from the company he founded.', vi: 'Steve Jobs từng bị đuổi khỏi công ty ông sáng lập.' },
      { en: 'He returned and turned Apple into the most valuable company in the world.', vi: 'Ông trở lại và biến Apple thành công ty giá trị nhất thế giới.' },
    ],
  },
  {
    title: 'Elon Musk — Thinking Big',
    subtitle: 'Nghĩ lớn và dám thất bại',
    sentences: [
      { en: 'Elon Musk wants to send humans to Mars.', vi: 'Elon Musk muốn đưa con người lên Sao Hỏa.' },
      { en: 'Many people thought he was crazy.', vi: 'Nhiều người cho rằng ông ấy điên rồ.' },
      { en: 'SpaceX has successfully launched many rockets.', vi: 'SpaceX đã phóng nhiều tên lửa thành công.' },
      { en: 'Tesla has changed the electric car industry.', vi: 'Tesla đã thay đổi ngành ô tô điện.' },
      { en: "Lesson: Don't be afraid to think big.", vi: 'Bài học: Đừng sợ nghĩ lớn.' },
    ],
  },
  {
    title: 'Bill Gates — Never Stop Learning',
    subtitle: 'Không ngừng học hỏi',
    sentences: [
      { en: 'Bill Gates dropped out of Harvard in his second year.', vi: 'Bill Gates đã rời Đại học Harvard năm 2.' },
      { en: 'He started Microsoft with his old friend Paul Allen.', vi: 'Ông bắt đầu Microsoft với bạn cũ Paul Allen.' },
      { en: 'Bill Gates reads books every night before sleeping.', vi: 'Bill Gates đọc sách mỗi đêm trước khi ngủ.' },
      { en: 'He has donated billions of dollars to charity.', vi: 'Ông ấy quyên góp hàng tỷ đô la cho từ thiện.' },
      { en: 'Lesson: Learning is a lifelong journey.', vi: 'Bài học: Học hỏi là hành trình không bao giờ kết thúc.' },
    ],
  },
  {
    title: 'Lionel Messi — Humility',
    subtitle: 'Khiêm nhường dù nổi tiếng',
    sentences: [
      { en: 'Messi is the most loved footballer in the world.', vi: 'Messi là cầu thủ được yêu mến nhất thế giới.' },
      { en: 'Although very famous, he is still very humble.', vi: 'Dù rất nổi tiếng, anh ấy vẫn rất khiêm nhường.' },
      { en: 'Messi always spends time with his family.', vi: 'Messi luôn dành thời gian cho gia đình.' },
      { en: "He doesn't like to show off or brag.", vi: 'Anh ấy không thích phô trương hay khoe khoang.' },
      { en: 'Lesson: Humility is the quality of great people.', vi: 'Bài học: Sự khiêm nhường là phẩm chất của người vĩ đại.' },
    ],
  },
  {
    title: 'Jack Ma — Persistence',
    subtitle: 'Kiên trì không bỏ cuộc',
    sentences: [
      { en: 'Jack Ma was rejected 30 times when applying for jobs.', vi: 'Jack Ma đã bị từ chối 30 lần khi xin việc.' },
      { en: 'He never gave up and kept trying.', vi: 'Ông ấy không bỏ cuộc và tiếp tục cố gắng.' },
      { en: 'Alibaba has become the biggest company in China.', vi: 'Alibaba đã trở thành công ty lớn nhất Trung Quốc.' },
      { en: 'Jack Ma is now one of the richest people in the world.', vi: 'Jack Ma giờ là một trong những người giàu nhất thế giới.' },
      { en: 'Lesson: Never give up on your dreams.', vi: 'Bài học: Đừng bao giờ từ bỏ ước mơ của bạn.' },
    ],
  },
  {
    title: 'Marie Curie — Curiosity',
    subtitle: 'Tò mò và đam mê khoa học',
    sentences: [
      { en: 'Marie Curie was the first female scientist to win the Nobel Prize.', vi: 'Marie Curie là nhà khoa học nữ đầu tiên đoạt giải Nobel.' },
      { en: 'She discovered two new chemical elements.', vi: 'Bà đã phát hiện ra hai nguyên tố hóa học mới.' },
      { en: 'Marie Curie worked in the laboratory every day.', vi: 'Marie Curie làm việc trong phòng thí nghiệm hàng ngày.' },
      { en: 'She was the first woman to study at the Sorbonne University.', vi: 'Bà là người phụ nữ đầu tiên học tại Đại học Sorbonne.' },
      { en: 'Lesson: Curiosity drives every invention.', vi: 'Bài học: Tò mò là động lực của mọi phát minh.' },
    ],
  },
  {
    title: 'Nelson Mandela — Forgiveness',
    subtitle: 'Tha thứ và hòa giải',
    sentences: [
      { en: 'Nelson Mandela was in prison for 27 years.', vi: 'Nelson Mandela đã ở tù 27 năm.' },
      { en: 'After leaving prison, he forgave those who had treated him badly.', vi: 'Sau khi ra tù, ông đã tha thứ cho những người đối xử tệ với ông.' },
      { en: 'He became the first President of South Africa.', vi: 'Ông trở thành Tổng thống đầu tiên của Nam Phi.' },
      { en: 'Mandela won the Nobel Peace Prize.', vi: 'Mandela đã đoạt giải Nobel Hòa bình.' },
      { en: 'Lesson: Forgiveness is the strength of the great.', vi: 'Bài học: Tha thứ là sức mạnh của người lớn.' },
    ],
  },
  {
    title: 'Thomas Edison — Trial and Error',
    subtitle: 'Thử và sai để thành công',
    sentences: [
      { en: 'Thomas Edison failed thousands of times before inventing the light bulb.', vi: 'Thomas Edison đã thất bại hàng nghìn lần trước khi phát minh bóng đèn.' },
      { en: "He didn't consider failure as the end.", vi: 'Ông ấy không coi thất bại là kết thúc.' },
      { en: "Edison said he found 1000 ways that don't work.", vi: 'Edison nói rằng ông đã tìm ra 1000 cách không làm việc.' },
      { en: 'He registered more than 1000 patents.', vi: 'Ông đã đăng ký hơn 1000 bằng sáng chế.' },
      { en: 'Lesson: Every failure is a lesson.', vi: 'Bài học: Mỗi thất bại là một bài học.' },
    ],
  },
  {
    title: 'Mahatma Gandhi — Simple Living',
    subtitle: 'Sống giản dị và có mục tiêu',
    sentences: [
      { en: 'Mahatma Gandhi led India to independence from Britain.', vi: 'Mahatma Gandhi đã lãnh đạo Ấn Độ độc lập khỏi Anh.' },
      { en: 'He lived very simply and wore traditional Indian clothes.', vi: 'Ông sống rất giản dị và mặc quần áo truyền thống Ấn Độ.' },
      { en: 'Gandhi read books every day to improve his knowledge.', vi: 'Gandhi đọc sách mỗi ngày để nâng cao kiến thức.' },
      { en: 'He believed in peace and non-violence.', vi: 'Ông tin vào hòa bình và không bạo lực.' },
      { en: 'Lesson: Live simply but with a big purpose.', vi: 'Bài học: Sống giản dị nhưng có mục tiêu lớn.' },
    ],
  },
];

const vocabCategoryLabels = {
  greetings: 'Chào hỏi & Giới thiệu',
  daily: 'Sinh hoạt hàng ngày',
  food: 'Ăn uống',
  shopping: 'Mua sắm',
  travel: 'Du lịch',
  work: 'Công việc',
  school: 'Trường học',
  health: 'Sức khỏe',
  emotion: 'Cảm xúc',
  opinion: 'Đưa ra ý kiến',
  requests: 'Yêu cầu & Xin phép',
  technology: 'Công nghệ',
  time: 'Thời gian',
  weather: 'Thời tiết',
  idioms: 'Idioms & Phrasal Verbs (Nâng cao)',
};

export default {
  name: 'EnglishPage',
  components: { CTopbar, CHubCard },

  data() {
    return {
      // Timer
      timerDuration: 30,
      timerSeconds: 30 * 60,
      isRunning: false,
      timerInterval: null,
      todayMins: 0,
      streak: 0,
      total: 0,

      // Tabs
      currentTab: 'vocab',
      tabs: [
        { id: 'vocab', icon: '📝', label: 'Từ vựng' },
        { id: 'tense', icon: '⏰', label: 'Các thì' },
        { id: 'story', icon: '📖', label: 'Đọc truyện' },
        { id: 'qa', icon: '❓', label: 'Hỏi & Đáp' },
        { id: 'game', icon: '🎮', label: 'Game' },
      ],

      // Data arrays - must be in data() for template access
      vocabData,
      vocabCategories: ['greetings', 'daily', 'food', 'shopping', 'travel', 'work', 'school', 'health', 'emotion', 'opinion', 'requests', 'technology', 'time', 'weather', 'idioms'],
      vocabCategoryLabels,
      vocabCategory: 'all',
      vocabIndex: 0,
      vocabFlipped: false,

      // Tense
      tenses,
      tenseMode: 'learn',
      tenseIndex: 0,
      tenseFlipped: false,
      practiceSentences,
      practiceIndex: 0,
      userSentence: '',
      usedWords: [],
      practiceFeedback: false,
      practiceCorrect: false,

      // Story
      stories,
      storyIndex: 0,

      // Q&A Word by Word
      qaWords,
      qaCategories: ['ALL', 'WHERE', 'WHY', 'WHAT', 'WHEN', 'HOW', 'WHO', 'WHICH', 'WHOSE', 'CAN', 'WOULD', 'SHOULD', 'WILL', 'DO', 'BE', 'HAVE'],
      qaFilterCat: 'ALL',
      qaWordIndex: 0,
      qaWordRevealed: false,

      // Game
      gameCards: [
        { icon: '🃏', title: 'Memory Game', description: 'Ghép từ vựng với nghĩa', path: '/game-memory' },
        { icon: '🔀', title: 'Xếp chữ', description: 'Sắp xếp từ thành câu', path: '/game-scramble' },
        { icon: '⚡', title: 'Speed Quiz', description: 'Trắc nghiệm nhanh có thời gian', path: '/game-speedquiz' },
      ],
    };
  },

  computed: {
    filteredVocab() {
      if (this.vocabCategory === 'all') return this.vocabData;
      return this.vocabData.filter(v => v.tag === this.vocabCategory);
    },
    vocabCard() {
      return this.filteredVocab[this.vocabIndex];
    },
    tenseCard() {
      return this.tenses[this.tenseIndex];
    },
    practiceCard() {
      return this.practiceSentences[this.practiceIndex];
    },
    shuffledWords() {
      return this.shuffle([...this.practiceCard.words]);
    },
    formattedTime() {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    filteredQaWords() {
      if (this.qaFilterCat === 'ALL') return this.qaWords;
      return this.qaWords.filter(w => w.category === this.qaFilterCat);
    },
    qaCurrentWord() {
      return this.filteredQaWords[this.qaWordIndex] || null;
    },
    ringOffset() {
      const circumference = 2 * Math.PI * 30;
      const total = this.timerDuration * 60;
      const fraction = this.timerSeconds / total;
      return circumference * fraction;
    },
  },

  watch: {
    vocabCategory() {
      this.vocabIndex = 0;
      this.vocabFlipped = false;
    },
  },

  methods: {
    handleNavigate(path) {
      navigate(path);
    },

    // Timer
    toggleTimer() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
      } else {
        this.timerInterval = setInterval(() => {
          if (this.timerSeconds > 0) {
            this.timerSeconds--;
          } else {
            clearInterval(this.timerInterval);
            this.isRunning = false;
          }
        }, 1000);
        this.isRunning = true;
      }
    },
    resetTimer() {
      clearInterval(this.timerInterval);
      this.timerSeconds = this.timerDuration * 60;
      this.isRunning = false;
    },

    // Vocab
    switchTab(tabId) {
      this.currentTab = tabId;
    },
    vocabNext() {
      if (this.vocabIndex < this.filteredVocab.length - 1) {
        this.vocabIndex++;
        this.vocabFlipped = false;
      }
    },
    vocabPrev() {
      if (this.vocabIndex > 0) {
        this.vocabIndex--;
        this.vocabFlipped = false;
      }
    },
    speakWord(word) {
      if (word && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    },

    // Tense
    tenseNext() {
      if (this.tenseIndex < this.tenses.length - 1) {
        this.tenseIndex++;
        this.tenseFlipped = false;
      }
    },
    tensePrev() {
      if (this.tenseIndex > 0) {
        this.tenseIndex--;
        this.tenseFlipped = false;
      }
    },

    // Practice
    selectWord(word) {
      if (!this.usedWords.includes(word)) {
        this.userSentence = this.userSentence ? `${this.userSentence} ${word}` : word;
        this.usedWords.push(word);
        this.practiceFeedback = false;
      }
    },
    checkPractice() {
      const userNorm = (this.userSentence || '').toLowerCase().trim();
      const correctNorm = (this.practiceCard.en || '').toLowerCase().trim();
      this.practiceCorrect = userNorm === correctNorm;
      this.practiceFeedback = true;
    },
    resetPractice() {
      this.userSentence = '';
      this.usedWords = [];
      this.practiceFeedback = false;
    },
    nextPractice() {
      if (this.practiceIndex < this.practiceSentences.length - 1) {
        this.practiceIndex++;
      } else {
        this.practiceIndex = 0;
      }
      this.resetPractice();
    },

    // Story
    storyNext() {
      if (this.storyIndex < this.stories.length - 1) {
        this.storyIndex++;
      }
    },
    storyPrev() {
      if (this.storyIndex > 0) {
        this.storyIndex--;
      }
    },

    // Q&A Word by Word
    qaWordNext() {
      if (this.qaWordIndex < this.filteredQaWords.length - 1) {
        this.qaWordIndex++;
      } else {
        this.qaWordIndex = 0;
      }
      this.qaWordRevealed = false;
    },
    qaWordPrev() {
      if (this.qaWordIndex > 0) {
        this.qaWordIndex--;
      } else {
        this.qaWordIndex = this.filteredQaWords.length - 1;
      }
      this.qaWordRevealed = false;
    },
    qaWordReveal() {
      this.qaWordRevealed = true;
    },
    qaShuffle() {
      this.qaWordIndex = Math.floor(Math.random() * this.filteredQaWords.length);
      this.qaWordRevealed = false;
    },

    // Helpers
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  },

  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
/* CSS variables are inherited from main.css global imports */

.english-page {
  background: var(--color-bg);
  min-height: 100vh;
}

.english-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1.5rem 2.5rem;
}

/* Forge Timer */
.forge-timer-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.forge-timer-ring {
  position: relative;
  width: 68px;
  height: 68px;
}

.forge-ring-bg {
  fill: none;
  stroke: var(--color-surface2);
  stroke-width: 4;
}

.forge-ring-progress {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 4;
  stroke-dasharray: 188.5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset 1s linear;
}

.forge-time {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-sm);
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.forge-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.forge-controls select {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-xs);
}

.forge-btn-row {
  display: flex;
  gap: var(--space-2);
}

.forge-btn {
  border: none;
  border-radius: 6px;
  padding: var(--space-2);
  font-size: var(--font-sm);
  cursor: pointer;
  transition: all 0.15s;
}

.forge-btn-primary {
  background: var(--color-accent);
  color: var(--color-bg);
}

.forge-btn-secondary {
  background: var(--color-surface2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.forge-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: var(--font-xs);
  color: var(--color-text2);
  flex: 1;
}

.forge-stat-row .val {
  color: var(--color-text);
  font-weight: 600;
}

.forge-stat-row .fire {
  color: var(--color-error, #ef4444);
}

/* Page Layout */
.english-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e2e8f0;
  padding: var(--space-4);
}

.english-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: var(--space-8);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-icon {
  font-size: var(--font-lg);
}

.stat-label {
  font-size: var(--font-xs);
  color: #94a3b8;
}

.stat-value {
  font-size: var(--font-sm);
  font-weight: 700;
  color: #f1f5f9;
}

.stat-timer {
  margin-left: auto;
}

.timer-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  padding: var(--space-2) var(--space-4);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.timer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.timer-icon {
  font-size: var(--font-lg);
}

.timer-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--font-lg);
  font-weight: 700;
  color: white;
}

/* Tab Bar */
.tab-bar {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
}

.tab-bar::-webkit-scrollbar {
  height: 4px;
}

.tab-bar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.tab-bar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  min-width: 72px;
  flex-shrink: 0;
}

.tab-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.tab-item.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.tab-icon {
  font-size: var(--font-xl);
}

.tab-label {
  font-size: var(--font-xs);
  font-weight: 600;
}

/* English Section */
.english-section {
  margin-bottom: var(--space-4);
}

/* Category Select */
.category-select {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  background: rgba(255, 255, 255, 0.05);
  padding: var(--space-3);
  border-radius: 12px;
}

.category-select label {
  font-size: var(--font-sm);
  color: #94a3b8;
  font-weight: 500;
}

.category-select select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #f1f5f9;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-sm);
  flex: 1;
  cursor: pointer;
}

.category-select select option {
  background: #1e293b;
  color: #f1f5f9;
}

/* Flip Card */
.flip-card-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: var(--space-6);
}

.flip-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: var(--space-4);
  transition: transform 0.3s;
}

.flip-card:hover {
  transform: scale(1.02);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 220px;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  border-radius: 16px;
}

.flip-card-front {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.flip-card-back {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  transform: rotateY(180deg);
  color: white;
}

.flip-card-front h2 {
  font-size: var(--font-3xl);
  font-weight: 800;
  margin-bottom: var(--space-2);
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.phonetic {
  color: #94a3b8;
  font-size: var(--font-base);
  margin-bottom: var(--space-2);
}

.tag {
  background: rgba(99, 102, 241, 0.3);
  color: #a5b4fc;
  padding: var(--space-1) var(--space-3);
  border-radius: 99px;
  font-size: var(--font-xs);
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.4);
}

.btn-speak {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: var(--font-xl);
  cursor: pointer;
  margin-bottom: var(--space-2);
  transition: all 0.2s;
}

.btn-speak:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.flip-card-back h3 {
  font-size: var(--font-2xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.example-en {
  font-size: var(--font-base);
  margin-bottom: var(--space-2);
  font-style: italic;
  opacity: 0.9;
}

/* Controls */
.controls {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.controls button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: var(--space-2) var(--space-5);
  font-size: var(--font-sm);
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.controls button:hover {
  background: rgba(99, 102, 241, 0.3);
  border-color: #6366f1;
  transform: translateY(-2px);
}

.counter {
  text-align: center;
  font-size: var(--font-sm);
  color: #64748b;
}

/* Tense */
.tense-subtabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.tense-subtabs .tab {
  flex: 1;
  padding: var(--space-3);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  font-size: var(--font-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.tense-subtabs .tab.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: white;
}

.tense-subtitle {
  font-size: var(--font-sm);
  color: #64748b;
  margin-bottom: var(--space-2);
}

.tense-example-en {
  font-size: var(--font-lg);
  font-style: italic;
  margin-bottom: var(--space-2);
  color: #e2e8f0;
}

.note {
  font-size: var(--font-sm);
  margin-top: var(--space-2);
  opacity: 0.7;
  color: #94a3b8;
}

/* Practice */
.practice-container {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: var(--space-6);
}

.tense-label {
  font-size: var(--font-sm);
  color: #64748b;
  margin-bottom: var(--space-2);
}

.practice-vietnamese {
  font-size: var(--font-xl);
  color: #f1f5f9;
  margin-bottom: var(--space-4);
  font-weight: 500;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.word-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-sm);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.word-btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.3);
  border-color: #6366f1;
}

.word-btn.used {
  opacity: 0.3;
  cursor: not-allowed;
}

.dropzone {
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: var(--space-4);
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-4);
  transition: all 0.2s;
}

.dropzone.filled {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.drop-hint {
  color: #64748b;
  font-size: var(--font-sm);
}

.practice-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.practice-actions button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.practice-actions button:hover {
  background: rgba(99, 102, 241, 0.3);
}

.practice-feedback {
  margin-top: var(--space-4);
  padding: var(--space-3);
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  display: none;
}

.practice-feedback.show {
  display: block;
}

.feedback-correct {
  color: #4ade80;
}

.feedback-wrong {
  color: #f87171;
}

.tense-label {
  font-size: var(--font-sm);
  font-weight: 600;
  color: var(--color-accent);
  text-align: center;
  margin-bottom: var(--space-2);
}

.practice-vietnamese {
  font-size: var(--font-lg);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-4);
}

.dropzone {
  min-height: 60px;
  background: var(--color-surface2);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: var(--font-base);
  transition: border-color 0.2s;
}

.dropzone.filled {
  border-style: solid;
  border-color: var(--color-accent);
}

.drop-hint {
  color: var(--color-text2);
  font-style: italic;
  font-size: var(--font-sm);
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.word-btn {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s;
}

.word-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: var(--color-accent-bg, rgba(52, 211, 153, 0.1));
}

.word-btn.used {
  opacity: 0.4;
  cursor: not-allowed;
}

.practice-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.practice-actions button {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s;
}

.practice-actions button:first-child {
  background: var(--color-accent);
  color: var(--color-bg);
  border-color: var(--color-accent);
}

.practice-actions button:hover {
  opacity: 0.9;
}

.practice-feedback {
  margin-top: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: var(--font-sm);
  display: none;
}

.practice-feedback.show {
  display: block;
}

.feedback-correct {
  color: var(--color-accent);
  font-weight: 600;
}

.feedback-wrong {
  color: var(--color-error, #ef4444);
}

/* Story */
.story-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.story-card h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin-bottom: var(--space-1);
  text-align: center;
}

.story-subtitle {
  color: #6366f1;
  font-size: var(--font-sm);
  text-align: center;
  margin-bottom: var(--space-4);
}

.story-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.story-nav button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.story-nav button:hover {
  background: rgba(99, 102, 241, 0.3);
}

.story-box {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

/* Story */
.story-sentence {
  position: relative;
  padding: var(--space-3);
  margin-bottom: var(--space-2);
  border-radius: 8px;
  color: #e2e8f0;
  font-size: var(--font-base);
  transition: background 0.2s;
}

.story-sentence:hover {
  background: rgba(99, 102, 241, 0.2);
}

.story-hover {
  display: none;
  margin-left: var(--space-2);
  color: #4ade80;
  font-size: var(--font-sm);
}

.story-sentence:hover .story-hover {
  display: inline;
}

.story-tip {
  font-size: var(--font-xs);
  color: #64748b;
  font-style: italic;
}

/* Q&A - Word by Word */
.qa-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: var(--space-6);
  text-align: center;
}

.qa-card h2 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
  color: #f1f5f9;
}

.qa-subtitle {
  color: #64748b;
  font-size: var(--font-sm);
  margin-bottom: var(--space-4);
}

.qa-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.qa-cat-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-xs);
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.qa-cat-btn:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #f1f5f9;
}

.qa-cat-btn.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: white;
}

.qa-counter {
  color: #64748b;
  font-size: var(--font-sm);
  margin-bottom: var(--space-3);
}

/* Flip Card Animation */
.qa-card-container {
  perspective: 1000px;
  margin-bottom: var(--space-4);
  height: 320px;
  position: relative;
}

.qa-card-face {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320px;
  background: rgba(99, 102, 241, 0.1);
  border: 2px solid rgba(99, 102, 241, 0.3);
  border-radius: 16px;
  padding: var(--space-6);
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.1);
  overflow-y: auto;
}

.qa-card-front {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.qa-card-front:hover {
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

.qa-card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15));
  cursor: default;
}

.qa-card-container.flipped .qa-card-front {
  transform: rotateY(180deg);
}

.qa-card-container.flipped .qa-card-back {
  transform: rotateY(0deg);
}

.hint-emoji {
  font-size: 1.2rem;
  color: #64748b;
  margin-top: var(--space-4);
}

.qa-word-main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.qa-word {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f1f5f9, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.qa-type {
  font-size: var(--font-xs);
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.1);
  padding: var(--space-1) var(--space-2);
  border-radius: 6px;
}

.qa-detail-section {
  margin-bottom: var(--space-4);
}

.qa-detail-section:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: var(--font-xs);
  color: #6366f1;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-2);
}

.detail-value {
  font-size: var(--font-base);
  color: #f1f5f9;
  line-height: 1.6;
}

.detail-examples {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-example {
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #6366f1;
  padding: var(--space-2) var(--space-3);
  border-radius: 0 8px 8px 0;
  font-size: var(--font-sm);
  color: #e2e8f0;
  font-style: italic;
}

.qa-formula-box {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  text-align: left;
}

.formula-label {
  font-size: var(--font-xs);
  color: #fbbf24;
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.formula-text {
  font-size: var(--font-base);
  color: #fbbf24;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
}

.qa-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.qa-controls button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  font-weight: 600;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.qa-controls button:hover {
  background: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

/* Game */
.game-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-4);
}

/* Game Card */
.game-links :deep(.hub-card) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: var(--space-4);
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}

.game-links :deep(.hub-card:hover) {
  transform: translateY(-4px);
  background: rgba(99, 102, 241, 0.2);
  border-color: #6366f1;
}

/* Hide old forge styles */
.forge-timer-wrap,
.forge-ring-bg,
.forge-ring-progress,
.forge-timer-ring,
.forge-time {
  display: none;
}
</style>
