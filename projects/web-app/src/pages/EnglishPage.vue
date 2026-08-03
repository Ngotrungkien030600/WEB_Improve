<template>
  <div class="english-page" style="--color-accent: #34d399">
    <CTopbar
      title="📚 Học Tiếng Anh"
      back-label="← Trang chủ"
      @go-home="handleNavigate('/')"
    />

    <div class="english-container">
      <!-- Forge Timer Widget -->
      <div class="forge-timer-wrap">
        <div class="forge-timer-ring">
          <svg viewBox="0 0 68 68">
            <circle class="forge-ring-bg" cx="34" cy="34" r="30" />
            <circle class="forge-ring-progress" cx="34" cy="34" r="30" :style="{ strokeDashoffset: ringOffset }" />
          </svg>
          <div class="forge-time">{{ formattedTime }}</div>
        </div>
        <div class="forge-controls">
          <select v-model="timerDuration" @change="resetTimer">
            <option value="30">30p</option>
            <option value="60">1h</option>
          </select>
          <div class="forge-btn-row">
            <button class="forge-btn forge-btn-primary" @click="toggleTimer">
              {{ isRunning ? '⏸️' : '⚒️' }}
            </button>
            <button class="forge-btn forge-btn-secondary" @click="resetTimer">↻</button>
          </div>
        </div>
        <div class="forge-stats">
          <div class="forge-stat-row">📋 Hôm nay <span class="val fire">{{ todayMins }}m</span></div>
          <div class="forge-stat-row">🔥 Streak <span class="val">{{ streak }}🔥</span></div>
          <div class="forge-stat-row">📦 Đã rèn <span class="val">{{ total }}</span></div>
        </div>
      </div>

      <!-- Tabs -->
      <nav class="subpage-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab"
          :class="{ active: currentTab === tab.id }"
          @click="switchTab(tab.id)"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
        <a class="tab exam-link" href="/exam">📝 Thi</a>
      </nav>

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
          <div class="story-box" v-html="stories[storyIndex]?.content"></div>
          <p class="story-tip">🖱️ Rê chuột vào câu tiếng Anh để xem nghĩa tiếng Việt tương ứng.</p>
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

const stories = [
  {
    title: 'Cristiano Ronaldo — Discipline and Hard Work',
    subtitle: 'Kỷ luật và chăm chỉ',
    content: `<p class="story-sentence" data-vi="CR7 là một trong những cầu thủ vĩ đại nhất mọi thời đại.">CR7 is one of the greatest footballers of all time. <span class="story-hover">CR7 là một trong những cầu thủ vĩ đại nhất mọi thời đại.</span></p>
<p class="story-sentence" data-vi="Anh ấy nổi tiếng với sự chăm chỉ và kỷ luật nghiêm khắc.">He is famous for his hard work and strict discipline. <span class="story-hover">Anh ấy nổi tiếng với sự chăm chỉ và kỷ luật nghiêm khắc.</span></p>
<p class="story-sentence" data-vi="Ronaldo tập luyện mỗi ngày, kể cả Giáng sinh.">Ronaldo trains every day, even on Christmas. <span class="story-hover">Ronaldo tập luyện mỗi ngày, kể cả Giáng sinh.</span></p>
<p class="story-sentence" data-vi="Anh ấy ngủ 8 tiếng mỗi đêm để phục hồi cơ thể.">He sleeps 8 hours every night to recover his body. <span class="story-hover">Anh ấy ngủ 8 tiếng mỗi đêm để phục hồi cơ thể.</span></p>
<p class="story-sentence" data-vi="Bài học: Sự thành công đến từ sự kiên trì.">Lesson: Success comes from persistence. <span class="story-hover">Bài học: Sự thành công đến từ sự kiên trì.</span></p>`
  },
  {
    title: 'Steve Jobs — Innovation',
    subtitle: 'Sáng tạo và đổi mới',
    content: `<p class="story-sentence" data-vi="Steve Jobs là đồng sáng lập Apple.">Steve Jobs was the co-founder of Apple. <span class="story-hover">Steve Jobs là đồng sáng lập Apple.</span></p>
<p class="story-sentence" data-vi="Ông đã thay đổi cách chúng ta nghĩ về công nghệ.">He changed the way we think about technology. <span class="story-hover">Ông đã thay đổi cách chúng ta nghĩ về công nghệ.</span></p>
<p class="story-sentence" data-vi="iPhone là sản phẩm thay đổi thế giới.">The iPhone was a world-changing product. <span class="story-hover">iPhone là sản phẩm thay đổi thế giới.</span></p>
<p class="story-sentence" data-vi="Steve Jobs từng bị đuổi khỏi công ty ông sáng lập.">Steve Jobs was once fired from the company he founded. <span class="story-hover">Steve Jobs từng bị đuổi khỏi công ty ông sáng lập.</span></p>
<p class="story-sentence" data-vi="Ông trở lại và biến Apple thành công ty giá trị nhất thế giới.">He returned and turned Apple into the most valuable company in the world. <span class="story-hover">Ông trở lại và biến Apple thành công ty giá trị nhất thế giới.</span></p>`
  },
  {
    title: 'Elon Musk — Thinking Big',
    subtitle: 'Nghĩ lớn và dám thất bại',
    content: `<p class="story-sentence" data-vi="Elon Musk muốn đưa con người lên Sao Hỏa.">Elon Musk wants to send humans to Mars. <span class="story-hover">Elon Musk muốn đưa con người lên Sao Hỏa.</span></p>
<p class="story-sentence" data-vi="Nhiều người cho rằng ông ấy điên rồ.">Many people thought he was crazy. <span class="story-hover">Nhiều người cho rằng ông ấy điên rồ.</span></p>
<p class="story-sentence" data-vi="SpaceX đã phóng nhiều tên lửa thành công.">SpaceX has successfully launched many rockets. <span class="story-hover">SpaceX đã phóng nhiều tên lửa thành công.</span></p>
<p class="story-sentence" data-vi="Tesla đã thay đổi ngành ô tô điện.">Tesla has changed the electric car industry. <span class="story-hover">Tesla đã thay đổi ngành ô tô điện.</span></p>
<p class="story-sentence" data-vi="Bài học: Đừng sợ nghĩ lớn.">Lesson: Don\'t be afraid to think big. <span class="story-hover">Bài học: Đừng sợ nghĩ lớn.</span></p>`
  },
  {
    title: 'Bill Gates — Never Stop Learning',
    subtitle: 'Không ngừng học hỏi',
    content: `<p class="story-sentence" data-vi="Bill Gates đã rời Đại học Harvard năm 2.">Bill Gates dropped out of Harvard in his second year. <span class="story-hover">Bill Gates đã rời Đại học Harvard năm 2.</span></p>
<p class="story-sentence" data-vi="Ông bắt đầu Microsoft với bạn cũ Paul Allen.">He started Microsoft with his old friend Paul Allen. <span class="story-hover">Ông bắt đầu Microsoft với bạn cũ Paul Allen.</span></p>
<p class="story-sentence" data-vi="Bill Gates đọc sách mỗi đêm trước khi ngủ.">Bill Gates reads books every night before sleeping. <span class="story-hover">Bill Gates đọc sách mỗi đêm trước khi ngủ.</span></p>
<p class="story-sentence" data-vi="Ông ấy quyên góp hàng tỷ đô la cho từ thiện.">He has donated billions of dollars to charity. <span class="story-hover">Ông ấy quyên góp hàng tỷ đô la cho từ thiện.</span></p>
<p class="story-sentence" data-vi="Bài học: Học hỏi là hành trình không bao giờ kết thúc.">Lesson: Learning is a lifelong journey. <span class="story-hover">Bài học: Học hỏi là hành trình không bao giờ kết thúc.</span></p>`
  },
  {
    title: 'Lionel Messi — Humility',
    subtitle: 'Khiêm nhường dù nổi tiếng',
    content: `<p class="story-sentence" data-vi="Messi là cầu thủ được yêu mến nhất thế giới.">Messi is the most loved footballer in the world. <span class="story-hover">Messi là cầu thủ được yêu mến nhất thế giới.</span></p>
<p class="story-sentence" data-vi="Dù rất nổi tiếng, anh ấy vẫn rất khiêm nhường.">Although very famous, he is still very humble. <span class="story-hover">Dù rất nổi tiếng, anh ấy vẫn rất khiêm nhường.</span></p>
<p class="story-sentence" data-vi="Messi luôn dành thời gian cho gia đình.">Messi always spends time with his family. <span class="story-hover">Messi luôn dành thời gian cho gia đình.</span></p>
<p class="story-sentence" data-vi="Anh ấy không thích phô trương hay khoe khoang.">He doesn\'t like to show off or brag. <span class="story-hover">Anh ấy không thích phô trương hay khoe khoang.</span></p>
<p class="story-sentence" data-vi="Bài học: Sự khiêm nhường là phẩm chất của người vĩ đại.">Lesson: Humility is the quality of great people. <span class="story-hover">Bài học: Sự khiêm nhường là phẩm chất của người vĩ đại.</span></p>`
  },
  {
    title: 'Jack Ma — Persistence',
    subtitle: 'Kiên trì không bỏ cuộc',
    content: `<p class="story-sentence" data-vi="Jack Ma đã bị từ chối 30 lần khi xin việc.">Jack Ma was rejected 30 times when applying for jobs. <span class="story-hover">Jack Ma đã bị từ chối 30 lần khi xin việc.</span></p>
<p class="story-sentence" data-vi="Ông ấy không bỏ cuộc và tiếp tục cố gắng.">He never gave up and kept trying. <span class="story-hover">Ông ấy không bỏ cuộc và tiếp tục cố gắng.</span></p>
<p class="story-sentence" data-vi=" Alibaba đã trở thành công ty lớn nhất Trung Quốc.">Alibaba has become the biggest company in China. <span class="story-hover">Alibaba đã trở thành công ty lớn nhất Trung Quốc.</span></p>
<p class="story-sentence" data-vi="Jack Ma giờ là một trong những người giàu nhất thế giới.">Jack Ma is now one of the richest people in the world. <span class="story-hover">Jack Ma giờ là một trong những người giàu nhất thế giới.</span></p>
<p class="story-sentence" data-vi="Bài học: Đừng bao giờ từ bỏ ước mơ của bạn.">Lesson: Never give up on your dreams. <span class="story-hover">Bài học: Đừng bao giờ từ bỏ ước mơ của bạn.</span></p>`
  },
  {
    title: 'Marie Curie — Curiosity',
    subtitle: 'Tò mò và đam mê khoa học',
    content: `<p class="story-sentence" data-vi="Marie Curie là nhà khoa học nữ đầu tiên đoạt giải Nobel.">Marie Curie was the first female scientist to win the Nobel Prize. <span class="story-hover">Marie Curie là nhà khoa học nữ đầu tiên đoạt giải Nobel.</span></p>
<p class="story-sentence" data-vi="Bà đã phát hiện ra hai nguyên tố hóa học mới.">She discovered two new chemical elements. <span class="story-hover">Bà đã phát hiện ra hai nguyên tố hóa học mới.</span></p>
<p class="story-sentence" data-vi="Marie Curie làm việc trong phòng thí nghiệm hàng ngày.">Marie Curie worked in the laboratory every day. <span class="story-hover">Marie Curie làm việc trong phòng thí nghiệm hàng ngày.</span></p>
<p class="story-sentence" data-vi="Bà là người phụ nữ đầu tiên học tại Đại học Sorbonne.">She was the first woman to study at the Sorbonne University. <span class="story-hover">Bà là người phụ nữ đầu tiên học tại Đại học Sorbonne.</span></p>
<p class="story-sentence" data-vi="Bài học: Tò mò là động lực của mọi phát minh.">Lesson: Curiosity drives every invention. <span class="story-hover">Bài học: Tò mò là động lực của mọi phát minh.</span></p>`
  },
  {
    title: 'Nelson Mandela — Forgiveness',
    subtitle: ' Tha thứ và hòa giải',
    content: `<p class="story-sentence" data-vi="Nelson Mandela đã ở tù 27 năm.">Nelson Mandela was in prison for 27 years. <span class="story-hover">Nelson Mandela đã ở tù 27 năm.</span></p>
<p class="story-sentence" data-vi="Sau khi ra tù, ông đã tha thứ cho những người đối xử tệ với ông.">After leaving prison, he forgave those who had treated him badly. <span class="story-hover">Sau khi ra tù, ông đã tha thứ cho những người đối xử tệ với ông.</span></p>
<p class="story-sentence" data-vi="Ông trở thành Tổng thống đầu tiên của Nam Phi.">He became the first President of South Africa. <span class="story-hover">Ông trở thành Tổng thống đầu tiên của Nam Phi.</span></p>
<p class="story-sentence" data-vi="Mandela đã đoạt giải Nobel Hòa bình.">Mandela won the Nobel Peace Prize. <span class="story-hover">Mandela đã đoạt giải Nobel Hòa bình.</span></p>
<p class="story-sentence" data-vi="Bài học: Tha thứ là sức mạnh của người lớn.">Lesson: Forgiveness is the strength of the great. <span class="story-hover">Bài học: Tha thứ là sức mạnh của người lớn.</span></p>`
  },
  {
    title: 'Thomas Edison — Trial and Error',
    subtitle: 'Thử và sai để thành công',
    content: `<p class="story-sentence" data-vi="Thomas Edison đã thất bại hàng nghìn lần trước khi phát minh bóng đèn.">Thomas Edison failed thousands of times before inventing the light bulb. <span class="story-hover">Thomas Edison đã thất bại hàng nghìn lần trước khi phát minh bóng đèn.</span></p>
<p class="story-sentence" data-vi="Ông ấy không coi thất bại là kết thúc.">He didn\'t consider failure as the end. <span class="story-hover">Ông ấy không coi thất bại là kết thúc.</span></p>
<p class="story-sentence" data-vi="Edison nói rằng ông đã tìm ra 1000 cách không làm việc.">Edison said he found 1000 ways that don\'t work. <span class="story-hover">Edison nói rằng ông đã tìm ra 1000 cách không làm việc.</span></p>
<p class="story-sentence" data-vi="Ông đã đăng ký hơn 1000 bằng sáng chế.">He registered more than 1000 patents. <span class="story-hover">Ông đã đăng ký hơn 1000 bằng sáng chế.</span></p>
<p class="story-sentence" data-vi="Bài học: Mỗi thất bại là một bài học.">Lesson: Every failure is a lesson. <span class="story-hover">Bài học: Mỗi thất bại là một bài học.</span></p>`
  },
  {
    title: 'Mahatma Gandhi — Simple Living',
    subtitle: 'Sống giản dị và có mục tiêu',
    content: `<p class="story-sentence" data-vi="Mahatma Gandhi đã lãnh đạo Ấn Độ độc lập khỏi Anh.">Mahatma Gandhi led India to independence from Britain. <span class="story-hover">Mahatma Gandhi đã lãnh đạo Ấn Độ độc lập khỏi Anh.</span></p>
<p class="story-sentence" data-vi="Ông sống rất giản dị và mặc quần áo truyền thống Ấn Độ.">He lived very simply and wore traditional Indian clothes. <span class="story-hover">Ông sống rất giản dị và mặc quần áo truyền thống Ấn Độ.</span></p>
<p class="story-sentence" data-vi="Gandhi đọc sách mỗi ngày để nâng cao kiến thức.">Gandhi read books every day to improve his knowledge. <span class="story-hover">Gandhi đọc sách mỗi ngày để nâng cao kiến thức.</span></p>
<p class="story-sentence" data-vi="Ông tin vào hòa bình và không bạo lực.">He believed in peace and non-violence. <span class="story-hover">Ông tin vào hòa bình và không bạo lực.</span></p>
<p class="story-sentence" data-vi="Bài học: Sống giản dị nhưng có mục tiêu lớn.">Lesson: Live simply but with a big purpose. <span class="story-hover">Bài học: Sống giản dị nhưng có mục tiêu lớn.</span></p>`
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
        { id: 'game', icon: '🎮', label: 'Game' },
      ],

      // Vocab
      vocabCategory: 'all',
      vocabCategories: ['greetings', 'daily', 'food', 'shopping', 'travel', 'work', 'school', 'health', 'emotion', 'opinion', 'requests', 'technology', 'time', 'weather', 'idioms'],
      vocabCategoryLabels,
      vocabIndex: 0,
      vocabFlipped: false,

      // Tense
      tenseMode: 'learn',
      tenseIndex: 0,
      tenseFlipped: false,
      practiceIndex: 0,
      userSentence: '',
      usedWords: [],
      practiceFeedback: false,
      practiceCorrect: false,

      // Story
      storyIndex: 0,

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
      if (this.vocabCategory === 'all') return vocabData;
      return vocabData.filter(v => v.tag === this.vocabCategory);
    },
    vocabCard() {
      return this.filteredVocab[this.vocabIndex];
    },
    tenseCard() {
      return tenses[this.tenseIndex];
    },
    practiceCard() {
      return practiceSentences[this.practiceIndex];
    },
    shuffledWords() {
      return this.shuffle([...this.practiceCard.words]);
    },
    formattedTime() {
      const mins = Math.floor(this.timerSeconds / 60);
      const secs = this.timerSeconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
      if (this.tenseIndex < tenses.length - 1) {
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
      if (this.practiceIndex < practiceSentences.length - 1) {
        this.practiceIndex++;
      } else {
        this.practiceIndex = 0;
      }
      this.resetPractice();
    },

    // Story
    storyNext() {
      if (this.storyIndex < stories.length - 1) {
        this.storyIndex++;
      }
    },
    storyPrev() {
      if (this.storyIndex > 0) {
        this.storyIndex--;
      }
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
@import '@legacy/css/variables.css';
@import '@legacy/css/forge-tokens.css';

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

/* Tabs */
.subpage-tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}

.tab {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--color-text2);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}

.tab:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.tab.active {
  border-color: var(--color-accent);
  background: var(--color-accent-bg, rgba(52, 211, 153, 0.1));
  color: var(--color-accent);
}

.exam-link {
  color: var(--color-text2);
}

/* Category Select */
.category-select {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.category-select label {
  font-size: var(--font-sm);
  color: var(--color-text2);
}

.category-select select {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-sm);
  flex: 1;
}

/* English Section */
.english-section {
  margin-bottom: var(--space-4);
}

/* Flip Card */
.flip-card-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.flip-card {
  background: var(--color-surface2);
  border-radius: var(--radius-lg);
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: var(--space-4);
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 200px;
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
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

.flip-card-front {
  background: var(--color-surface2);
}

.flip-card-back {
  background: var(--color-accent);
  transform: rotateY(180deg);
  color: var(--color-bg);
}

.flip-card-front h2 {
  font-size: var(--font-2xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.phonetic {
  color: var(--color-text2);
  font-size: var(--font-sm);
  margin-bottom: var(--space-2);
}

.tag {
  background: var(--color-accent-bg, rgba(52, 211, 153, 0.2));
  color: var(--color-accent);
  padding: var(--space-1) var(--space-3);
  border-radius: 99px;
  font-size: var(--font-xs);
  font-weight: 500;
}

.btn-speak {
  background: none;
  border: none;
  font-size: var(--font-lg);
  cursor: pointer;
  margin-bottom: var(--space-2);
  opacity: 0.6;
  transition: opacity 0.15s;
}

.btn-speak:hover {
  opacity: 1;
}

.flip-card-back h3 {
  font-size: var(--font-xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
}

.example-en {
  font-size: var(--font-base);
  margin-bottom: var(--space-2);
  font-style: italic;
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

.controls button:hover {
  border-color: var(--color-accent);
}

.counter {
  text-align: center;
  font-size: var(--font-sm);
  color: var(--color-text2);
}

/* Tense */
.tense-subtabs {
  margin-bottom: var(--space-4);
}

.tense-subtitle {
  font-size: var(--font-sm);
  color: var(--color-text2);
  margin-bottom: var(--space-2);
}

.tense-example-en {
  font-size: var(--font-lg);
  font-style: italic;
  margin-bottom: var(--space-2);
}

.note {
  font-size: var(--font-sm);
  margin-top: var(--space-2);
  opacity: 0.8;
}

/* Practice */
.practice-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
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
  color: var(--color-accent);
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
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.15s;
}

.story-nav button:hover {
  border-color: var(--color-accent);
}

.story-box {
  background: var(--color-surface2);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-3);
  font-size: var(--font-base);
  line-height: 2;
}

.story-sentence {
  position: relative;
  margin-bottom: var(--space-3);
}

.story-hover {
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: var(--color-accent);
  color: var(--color-bg);
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-sm);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.story-sentence:hover .story-hover {
  opacity: 1;
}

.story-tip {
  font-size: var(--font-sm);
  color: var(--color-text2);
  font-style: italic;
}

/* Game */
.game-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}
</style>
