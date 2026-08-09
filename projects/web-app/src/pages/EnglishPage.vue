<template>
  <div class="english-page">
    <!-- Header with Timer -->
    <header class="page-header">
      <div class="header-content">
        <CTopbar title="📖 Tiếng Anh" back-label="Trang chủ" @go-home="handleNavigate('/')" />
        
        <!-- Stats Bar -->
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
      </div>
    </header>

    <div class="page-container">
      <!-- Search & Filter -->
      <div class="controls-section">
        <CSearch v-model="searchQuery" placeholder="Tìm kiếm từ vựng, thì..." />
        <CFilter v-model="activeCategory" :options="categoryOptions" />
      </div>

      <!-- Main Tabs -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
        <a class="tab-item tab-link" href="/exam">
          <span class="tab-icon">📝</span>
          <span class="tab-label">Thi</span>
        </a>
      </div>

      <!-- Content Sections -->
      <main class="content-area">
        <!-- Vocabulary Section -->
        <section v-show="currentTab === 'vocab'" class="content-section">
          <VocabCard
            v-if="currentVocab"
            :vocab="currentVocab"
            :index="vocabIndex"
            :total="filteredVocab.length"
            :flipped="vocabFlipped"
            @flip="vocabFlipped = !vocabFlipped"
            @prev="vocabPrev"
            @next="vocabNext"
            @speak="speakWord"
          />
          <div v-else class="empty-state">
            <span class="empty-icon">😕</span>
            <p>Không có từ vựng nào trong chủ đề này. Thử chọn chủ đề khác nhé!</p>
          </div>
        </section>

        <!-- Tense Section -->
        <section v-show="currentTab === 'tense'" class="content-section">
          <div class="sub-tabs">
            <button
              class="sub-tab"
              :class="{ active: tenseMode === 'learn' }"
              @click="tenseMode = 'learn'"
            >📘 Học thì</button>
            <button
              class="sub-tab"
              :class="{ active: tenseMode === 'practice' }"
              @click="tenseMode = 'practice'"
            >✍️ Luyện tập</button>
          </div>

          <!-- Learn Mode -->
          <div v-if="tenseMode === 'learn'" class="tense-container">
            <FlipCard
              :front="{
                title: tenseCard?.name,
                subtitle: tenseCard?.title,
                content: tenseCard?.form,
                hint: tenseCard?.signal
              }"
              :back="{ examples: tenseCard?.examples, note: tenseCard?.note }"
              :flipped="tenseFlipped"
              @flip="tenseFlipped = !tenseFlipped"
            />
            <div class="card-nav">
              <button class="nav-btn" @click="tensePrev">⬅️</button>
              <span class="nav-counter">{{ tenseIndex + 1 }} / {{ tenses.length }}</span>
              <button class="nav-btn" @click="tenseNext">➡️</button>
            </div>
          </div>

          <!-- Practice Mode -->
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
              <button class="action-btn" @click="checkPractice">✅ Kiểm tra</button>
              <button class="action-btn secondary" @click="resetPractice">🔄 Làm lại</button>
              <button class="action-btn" @click="nextPractice">Tiếp ➡️</button>
            </div>
            <div v-if="practiceFeedback" class="practice-feedback" :class="{ correct: practiceCorrect, show: true }">
              <span v-if="practiceCorrect">✅ Đúng!</span>
              <span v-else>❌ Sai. Đáp án: {{ practiceCard?.en }}</span>
            </div>
          </div>
        </section>

        <!-- Stories Section -->
        <section v-show="currentTab === 'story'" class="content-section">
          <div class="story-container">
            <div class="story-header">
              <span class="story-icon">{{ stories[storyIndex]?.image }}</span>
              <div>
                <h2 class="story-title">{{ stories[storyIndex]?.title }}</h2>
                <p class="story-subtitle">{{ stories[storyIndex]?.subtitle }}</p>
              </div>
            </div>
            <div class="story-nav">
              <button class="nav-btn" @click="storyPrev">⬅️ Truyện trước</button>
              <span class="nav-counter">{{ storyIndex + 1 }} / {{ stories.length }}</span>
              <button class="nav-btn" @click="storyNext">Truyện tiếp ➡️</button>
            </div>
            <div class="story-content">
              <p
                v-for="(sentence, idx) in stories[storyIndex]?.sentences"
                :key="idx"
                class="story-sentence"
              >
                <span class="sentence-en">{{ sentence.en }}</span>
                <span class="sentence-vi">{{ sentence.vi }}</span>
              </p>
            </div>
            <p class="story-tip">🖱️ Di chuột vào câu tiếng Anh để xem nghĩa</p>
          </div>
        </section>

        <!-- Q&A Section -->
        <section v-show="currentTab === 'qa'" class="content-section">
          <div class="qa-container">
            <h2 class="qa-title">❓ Học từ vựng hỏi</h2>
            <p class="qa-subtitle">Bấm vào từ để xem: nghĩa, cách dùng, và ví dụ</p>

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

            <FlipCard
              variant="large"
              :front="{ title: qaCurrentWord?.word, subtitle: qaCurrentWord?.type, content: '👆 Bấm để xem nghĩa' }"
              :back="{
                meaning: qaCurrentWord?.meaning,
                usage: qaCurrentWord?.usage,
                formula: qaCurrentWord?.formula,
                examples: qaCurrentWord?.examples
              }"
              :flipped="qaWordRevealed"
              @flip="qaWordReveal"
            />

            <div class="qa-controls">
              <button class="nav-btn" @click="qaWordPrev">⬅️</button>
              <button class="action-btn secondary" @click="qaShuffle">🔀 Ngẫu nhiên</button>
              <button class="nav-btn" @click="qaWordRevealed = false; qaWordNext()">➡️</button>
            </div>
          </div>
        </section>

        <!-- Idioms Section -->
        <section v-show="currentTab === 'idiom'" class="content-section">
          <div class="idiom-container">
            <div class="idiom-header">
              <h2>💬 Idioms & Phrasal Verbs</h2>
              <p>Học các cụm từ thông dụng và cách dùng</p>
            </div>

            <div class="idiom-tabs">
              <button
                class="idiom-tab"
                :class="{ active: idiomMode === 'idiom' }"
                @click="idiomMode = 'idiom'"
              >🏌️ Idioms</button>
              <button
                class="idiom-tab"
                :class="{ active: idiomMode === 'phrasal' }"
                @click="idiomMode = 'phrasal'"
              >🎯 Phrasal Verbs</button>
            </div>

            <div v-if="idiomMode === 'idiom'" class="idiom-list">
              <div
                v-for="item in filteredIdioms"
                :key="item.id"
                class="idiom-card"
              >
                <h4 class="idiom-title">{{ item.idiom }}</h4>
                <p class="idiom-meaning">{{ item.meaning }}</p>
                <p class="idiom-example">{{ item.example }}</p>
                <p class="idiom-vi">{{ item.exampleVi }}</p>
              </div>
            </div>

            <div v-else class="phrasal-list">
              <div
                v-for="item in filteredPhrasals"
                :key="item.id"
                class="idiom-card"
              >
                <h4 class="idiom-title">{{ item.verb }}</h4>
                <p class="idiom-meaning">{{ item.meaning }}</p>
                <p class="idiom-example">{{ item.example }}</p>
                <p class="idiom-vi">{{ item.exampleVi }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Games Section -->
        <section v-show="currentTab === 'game'" class="content-section">
          <div class="games-grid">
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
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue';
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CSearch from '../components/CSearch.vue';
import CFilter from '../components/CFilter.vue';
import CHubCard from '../components/CHubCard.vue';
import FlipCard from '../components/FlipCard.vue';
import VocabCard from '../components/VocabCard.vue';

import { vocabulary, vocabCategories } from '../data/vocabulary.js';
import { tenses, practiceSentences } from '../data/tenses.js';
import { stories } from '../data/stories.js';
import { idioms, phrasalVerbs, idiomCategories } from '../data/idioms.js';
import { getHistory } from '../logic/forge-timer-logic.js';

// Timer
const timerDuration = ref(30);
const timerSeconds = ref(30 * 60);
const isRunning = ref(false);
let timerInterval = null;
const todayMins = ref(0);
const streak = ref(0);
const total = ref(0);

const loadStats = () => {
  const h = getHistory();
  const todayKey = new Date().toISOString().slice(0, 10);
  todayMins.value = h.dates?.[todayKey] || 0;
  streak.value = h.streak || 0;
  total.value = h.totalMinutes || 0;
};

loadStats();

const formattedTime = computed(() => {
  const mins = Math.floor(timerSeconds.value / 60);
  const secs = timerSeconds.value % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
});

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timerInterval);
    isRunning.value = false;
  } else {
    timerInterval = setInterval(() => {
      if (timerSeconds.value > 0) {
        timerSeconds.value--;
      } else {
        clearInterval(timerInterval);
        isRunning.value = false;
      }
    }, 1000);
    isRunning.value = true;
  }
};

// Tabs & Navigation
const currentTab = ref('vocab');
const searchQuery = ref('');
const activeCategory = ref('all');

const tabs = [
  { id: 'vocab', icon: '📝', label: 'Từ vựng' },
  { id: 'tense', icon: '⏰', label: 'Các thì' },
  { id: 'story', icon: '📖', label: 'Đọc truyện' },
  { id: 'qa', icon: '❓', label: 'Hỏi & Đáp' },
  { id: 'idiom', icon: '💬', label: 'Idioms' },
  { id: 'game', icon: '🎮', label: 'Game' },
];

const categoryOptions = computed(() => [
  { value: 'all', label: 'Tất cả', icon: '📚' },
  ...Object.entries(vocabCategories).map(([key, val]) => ({
    value: key,
    label: val.label,
    icon: val.icon
  }))
]);

// Vocabulary
const vocabIndex = ref(0);
const vocabFlipped = ref(false);

const filteredVocab = computed(() => {
  let result = vocabulary;
  
  if (activeCategory.value !== 'all') {
    result = result.filter(v => v.tag === activeCategory.value);
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(v => 
      v.en.toLowerCase().includes(query) ||
      v.vi.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const currentVocab = computed(() => filteredVocab.value[vocabIndex.value]);

watch(filteredVocab, () => {
  vocabIndex.value = 0;
  vocabFlipped.value = false;
});

const vocabNext = () => {
  if (vocabIndex.value < filteredVocab.value.length - 1) {
    vocabIndex.value++;
    vocabFlipped.value = false;
  }
};

const vocabPrev = () => {
  if (vocabIndex.value > 0) {
    vocabIndex.value--;
    vocabFlipped.value = false;
  }
};

const speakWord = (word) => {
  if (word && window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
};

// Tenses
const tenseMode = ref('learn');
const tenseIndex = ref(0);
const tenseFlipped = ref(false);

const tenseCard = computed(() => tenses[tenseIndex.value]);

const tenseNext = () => {
  if (tenseIndex.value < tenses.length - 1) {
    tenseIndex.value++;
    tenseFlipped.value = false;
  }
};

const tensePrev = () => {
  if (tenseIndex.value > 0) {
    tenseIndex.value--;
    tenseFlipped.value = false;
  }
};

// Helpers
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Practice
const practiceIndex = ref(0);
const userSentence = ref('');
const usedWords = ref([]);
const practiceFeedback = ref(false);
const practiceCorrect = ref(false);
const wordBank = ref([]);

const practiceCard = computed(() => practiceSentences[practiceIndex.value]);

const shuffledWords = computed(() => wordBank.value);

// Re-shuffle the word bank once when the practice sentence changes
watch(practiceCard, () => {
  wordBank.value = practiceCard.value ? shuffle([...practiceCard.value.words]) : [];
}, { immediate: true });

const selectWord = (word) => {
  if (!usedWords.value.includes(word)) {
    userSentence.value = userSentence.value ? `${userSentence.value} ${word}` : word;
    usedWords.value.push(word);
    practiceFeedback.value = false;
  }
};

const checkPractice = () => {
  if (!practiceCard.value || userSentence.value.length === 0) {
    practiceFeedback.value = true;
    practiceCorrect.value = false;
    return;
  }
  const userNorm = (userSentence.value || '').toLowerCase().trim();
  const correctNorm = (practiceCard.value?.en || '').toLowerCase().trim();
  practiceCorrect.value = userNorm === correctNorm;
  practiceFeedback.value = true;
};

const resetPractice = () => {
  userSentence.value = '';
  usedWords.value = [];
  practiceFeedback.value = false;
};

const nextPractice = () => {
  if (practiceIndex.value < practiceSentences.length - 1) {
    practiceIndex.value++;
  } else {
    practiceIndex.value = 0;
  }
  resetPractice();
};

// Stories
const storyIndex = ref(0);

const storyNext = () => {
  if (storyIndex.value < stories.length - 1) storyIndex.value++;
};

const storyPrev = () => {
  if (storyIndex.value > 0) storyIndex.value--;
};

// Q&A
const qaWords = [
  { word: 'Where', type: 'adv', meaning: 'Ở đâu', category: 'WHERE', formula: 'WHERE + động từ', examples: ['Where do you live?', 'Where did you go yesterday?'] },
  { word: 'Why', type: 'adv', meaning: 'Tại sao', category: 'WHY', formula: 'WHY + động từ. Trả lời: Because...', examples: ['Why are you late?', 'Why do you learn English?'] },
  { word: 'What', type: 'pron', meaning: 'Cái gì / Là gì', category: 'WHAT', formula: 'WHAT + động từ', examples: ['What is your name?', 'What do you do?'] },
  { word: 'When', type: 'adv', meaning: 'Khi nào', category: 'WHEN', formula: 'WHEN + động từ', examples: ['When is your birthday?', 'When do you go to school?'] },
  { word: 'How', type: 'adv', meaning: 'Như thế nào', category: 'HOW', formula: 'HOW + are/is/do + S', examples: ['How are you today?', 'How do you go to school?'] },
  { word: 'How much', type: 'phrase', meaning: 'Bao nhiêu (không đếm được)', category: 'HOW', formula: 'HOW MUCH + danh từ + động từ', examples: ['How much does this cost?', 'How much water do you drink?'] },
  { word: 'How many', type: 'phrase', meaning: 'Bao nhiêu (đếm được)', category: 'HOW', formula: 'HOW MANY + danh từ số nhiều + động từ', examples: ['How many books do you have?', 'How many students are in your class?'] },
  { word: 'Who', type: 'pron', meaning: 'Ai', category: 'WHO', formula: 'WHO + động từ', examples: ['Who is your best friend?', 'Who do you love most?'] },
  { word: 'Which', type: 'pron', meaning: 'Cái nào', category: 'WHICH', formula: 'WHICH + danh từ + động từ', examples: ['Which color do you like?', 'Which book did you read?'] },
  { word: 'Whose', type: 'pron', meaning: 'Của ai', category: 'WHOSE', formula: 'WHOSE + danh từ + động từ', examples: ['Whose book is this?', 'Whose car is that?'] },
];

const qaCategories = ['ALL', 'WHERE', 'WHY', 'WHAT', 'WHEN', 'HOW', 'WHO', 'WHICH', 'WHOSE'];
const qaFilterCat = ref('ALL');
const qaWordIndex = ref(0);
const qaWordRevealed = ref(false);

const filteredQaWords = computed(() => {
  if (qaFilterCat.value === 'ALL') return qaWords;
  return qaWords.filter(w => w.category === qaFilterCat.value);
});

// Reset position/reveal when the Q&A category changes
watch(qaFilterCat, () => {
  qaWordIndex.value = 0;
  qaWordRevealed.value = false;
});

const qaCurrentWord = computed(() => filteredQaWords.value[qaWordIndex.value]);

const qaWordNext = () => {
  if (qaWordIndex.value < filteredQaWords.value.length - 1) {
    qaWordIndex.value++;
  } else {
    qaWordIndex.value = 0;
  }
  qaWordRevealed.value = false;
};

const qaWordPrev = () => {
  if (qaWordIndex.value > 0) {
    qaWordIndex.value--;
  } else {
    qaWordIndex.value = filteredQaWords.value.length - 1;
  }
  qaWordRevealed.value = false;
};

const qaWordReveal = () => {
  qaWordRevealed.value = !qaWordRevealed.value;
};

const qaShuffle = () => {
  qaWordIndex.value = Math.floor(Math.random() * filteredQaWords.value.length);
  qaWordRevealed.value = false;
};

// Idioms
const idiomMode = ref('idiom');

const filteredIdioms = computed(() => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    return idioms.filter(i => 
      i.idiom.toLowerCase().includes(query) ||
      i.meaning.toLowerCase().includes(query)
    );
  }
  return idioms;
});

const filteredPhrasals = computed(() => {
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    return phrasalVerbs.filter(p => 
      p.verb.toLowerCase().includes(query) ||
      p.meaning.toLowerCase().includes(query)
    );
  }
  return phrasalVerbs;
});

// Games
const gameCards = [
  { icon: '🃏', title: 'Memory Game', description: 'Ghép từ vựng với nghĩa', path: '/game-memory' },
  { icon: '🔀', title: 'Xếp chữ', description: 'Sắp xếp từ thành câu', path: '/game-scramble' },
  { icon: '⚡', title: 'Speed Quiz', description: 'Trắc nghiệm nhanh có thời gian', path: '/game-speedquiz' },
];

const handleNavigate = (path) => navigate(path);

// Cleanup
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.english-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e2e8f0;
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.8) 100%);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

/* Stats Bar */
.stats-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 0.75rem 1rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.stat-icon { font-size: 1rem; }
.stat-label { font-size: 0.7rem; color: #94a3b8; }
.stat-value { font-size: 0.85rem; font-weight: 700; }

.stat-timer { margin-left: auto; }

.timer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.timer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.timer-icon { font-size: 1rem; }
.timer-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

/* Container */
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Controls */
.controls-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Tab Bar */
.tab-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-bar::-webkit-scrollbar { height: 4px; }
.tab-bar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.1); border-radius: 2px; }
.tab-bar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 2px; }

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0.75rem 1rem;
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

.tab-icon { font-size: 1.25rem; }
.tab-label { font-size: 0.7rem; font-weight: 600; }

/* Content */
.content-section {
  animation: fadeIn 0.3s ease;
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #94a3b8;
}

.empty-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  font-size: 0.9rem;
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Sub Tabs */
.sub-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.sub-tab {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tab.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: white;
}

/* Tense Container */
.tense-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

/* Practice */
.practice-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

.tense-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #6366f1;
  text-align: center;
  margin-bottom: 0.25rem;
}

.counter {
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 1rem;
}

.practice-vietnamese {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #f1f5f9;
}

.word-bank {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.word-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
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
  min-height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.dropzone.filled {
  border-style: solid;
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.drop-hint {
  color: #64748b;
  font-style: italic;
  font-size: 0.85rem;
}

.practice-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: none;
  color: white;
}

.action-btn:hover { opacity: 0.9; transform: translateY(-2px); }
.action-btn.secondary { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); }
.action-btn.secondary:hover { background: rgba(255, 255, 255, 0.15); }

.practice-feedback {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
  display: none;
}

.practice-feedback.show {
  display: block;
}

.practice-feedback.correct {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.practice-feedback:not(.correct) {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

/* Story */
.story-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

.story-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.story-icon { font-size: 3rem; }

.story-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: #f1f5f9;
}

.story-subtitle {
  font-size: 0.85rem;
  color: #6366f1;
  margin: 0.25rem 0 0;
}

.story-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.nav-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-btn:hover {
  background: rgba(99, 102, 241, 0.3);
}

.nav-counter {
  font-size: 0.85rem;
  color: #64748b;
}

.story-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.story-sentence {
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  transition: background 0.2s;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.story-sentence:hover {
  background: rgba(99, 102, 241, 0.2);
}

.sentence-en {
  font-size: 0.95rem;
  color: #e2e8f0;
  line-height: 1.6;
}

.sentence-vi {
  font-size: 0.8rem;
  color: #4ade80;
  display: none;
}

.story-sentence:hover .sentence-vi {
  display: block;
}

.story-tip {
  font-size: 0.75rem;
  color: #64748b;
  font-style: italic;
  text-align: center;
}

/* Q&A */
.qa-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
  text-align: center;
}

.qa-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #f1f5f9;
}

.qa-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1.5rem;
}

.qa-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.qa-cat-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
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
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.qa-controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

/* Idioms */
.idiom-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 1.5rem;
}

.idiom-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.idiom-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: #f1f5f9;
}

.idiom-header p {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

.idiom-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.idiom-tab {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.idiom-tab.active {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border-color: transparent;
  color: white;
}

.idiom-list,
.phrasal-list {
  display: grid;
  gap: 1rem;
}

.idiom-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s;
}

.idiom-card:hover {
  border-color: #6366f1;
  transform: translateY(-2px);
}

.idiom-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem;
}

.idiom-meaning {
  font-size: 0.85rem;
  color: #4ade80;
  margin: 0 0 0.5rem;
}

.idiom-example {
  font-size: 0.8rem;
  color: #e2e8f0;
  font-style: italic;
  margin: 0 0 0.25rem;
}

.idiom-vi {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* Games */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

/* Card Nav */
.card-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-bar {
    justify-content: center;
  }
  
  .stat-timer {
    margin-left: 0;
    width: 100%;
  }
  
  .page-container {
    padding: 1rem;
  }
  
  .tab-item {
    min-width: 60px;
    padding: 0.5rem 0.75rem;
  }
  
  .tab-label {
    font-size: 0.6rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .content-section {
    animation: none;
  }
  
  .timer-btn:hover,
  .action-btn:hover,
  .word-btn:hover,
  .nav-btn:hover,
  .idiom-card:hover {
    transform: none;
  }
}
</style>
