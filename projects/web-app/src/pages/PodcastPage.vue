<template>
  <div class="podcast-page">
    <CTopbar
      title="🎧 Podcast"
      back-label="Tiếng Anh"
      @go-home="handleBack"
    />

    <div class="podcast-container">
      <!-- ===== Mục 1: Kênh YouTube ===== -->
      <section class="section">
        <div class="section-header">
          <h2>📺 Kênh YouTube học tiếng Anh</h2>
          <p class="section-sub">Bấm vào kênh để mở trang YouTube — chọn playlist nghe phù hợp trình độ.</p>
        </div>
        <div class="channel-grid">
          <a
            v-for="channel in channels"
            :key="channel.id"
            class="channel-card"
            :href="channel.url"
            target="_blank"
            rel="noopener"
          >
            <span class="channel-logo" :style="{ background: channel.color }">
              {{ channel.name.charAt(0) }}
            </span>
            <div class="channel-info">
              <span class="channel-name">{{ channel.name }}</span>
              <span class="channel-handle">{{ channel.handle }}</span>
              <span class="channel-desc">{{ channel.description }}</span>
            </div>
            <span class="channel-open">Mở kênh ↗</span>
          </a>
        </div>
      </section>

      <!-- ===== Mục 2: Bài nghe + Transcript ===== -->
      <section class="section">
        <div class="section-header">
          <h2>🎧 Bài nghe + Transcript</h2>
          <p class="section-sub">Nội dung VOA Learning English (public domain). Chọn bài → nghe audio → đọc transcript bên dưới.</p>
        </div>

        <div class="lesson-list">
          <button
            v-for="lesson in lessons"
            :key="lesson.id"
            class="lesson-item"
            :class="{ active: selected && selected.id === lesson.id }"
            @click="selectLesson(lesson)"
          >
            <span class="lesson-icon">🎙️</span>
            <span class="lesson-info">
              <span class="lesson-title">{{ lesson.title }}</span>
              <span class="lesson-meta">{{ lesson.series }} · {{ lesson.duration }}</span>
            </span>
            <span class="lesson-level">{{ lesson.level }}</span>
          </button>
        </div>

        <div v-if="selected" class="lesson-detail">
          <div class="detail-head">
            <div>
              <h3>{{ selected.title }}</h3>
              <p class="detail-meta">
                {{ selected.series }} · {{ formatDate(selected.date) }} · {{ selected.duration }}
              </p>
            </div>
            <div class="detail-links">
              <a :href="selected.audioPageUrl" target="_blank" rel="noopener">Trang nghe VOA ↗</a>
              <a :href="selected.articleUrl" target="_blank" rel="noopener">Bài viết gốc ↗</a>
            </div>
          </div>

          <!-- Audio -->
          <div class="audio-wrap">
            <audio :key="selected.id" :src="selected.audioUrl" controls preload="none"></audio>
            <p class="audio-hint">Audio phát trực tiếp từ máy chủ VOA. Nếu không nghe được, dùng nút "Trang nghe VOA".</p>
          </div>

          <!-- Transcript -->
          <div class="transcript">
            <div class="transcript-bar">
              <span class="transcript-label">Transcript</span>
              <div class="lang-toggle">
                <button :class="{ active: mode === 'en' }" @click="mode = 'en'">Tiếng Anh</button>
                <button :class="{ active: mode === 'vi' }" @click="mode = 'vi'">Tiếng Việt</button>
                <button :class="{ active: mode === 'both' }" @click="mode = 'both'">Song ngữ</button>
              </div>
            </div>
            <div class="transcript-body">
              <template v-for="(paragraph, index) in selected.en" :key="index">
                <p v-if="mode === 'en' || mode === 'both'" class="para-en">{{ paragraph }}</p>
                <p
                  v-if="mode === 'vi' || mode === 'both'"
                  class="para-vi"
                  :class="{ 'with-en': mode === 'both' }"
                >
                  {{ selected.vi[index] }}
                </p>
              </template>
              <p class="credit-note">
                Transcript tiếng Anh: VOA Learning English (public domain) · Bản dịch tiếng Việt: SkillForge biên soạn.
              </p>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>Đang tải danh sách bài nghe…</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import { YOUTUBE_CHANNELS, PODCAST_LESSONS } from '../utils/podcast-content.js';

export default {
  name: 'PodcastPage',
  components: { CTopbar },
  data() {
    return {
      channels: YOUTUBE_CHANNELS,
      lessons: PODCAST_LESSONS,
      selected: PODCAST_LESSONS[0] || null,
      mode: 'en',
    };
  },
  methods: {
    handleBack() {
      navigate('/english/hub');
    },
    selectLesson(lesson) {
      this.selected = lesson;
      this.mode = 'en';
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    },
  },
};
</script>

<style scoped>
.podcast-page {
  min-height: 100vh;
  background: var(--forge-bg);
}

.podcast-container {
  max-width: 860px;
  margin: 0 auto;
  padding: 1.25rem 1rem 3rem;
}

.section {
  margin-bottom: 2.25rem;
}

.section-header h2 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  color: var(--forge-text);
}

.section-sub {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--forge-text3);
}

/* ---- Kênh YouTube ---- */
.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}

.channel-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem;
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  background: var(--forge-surface);
  text-decoration: none;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.channel-card:hover {
  transform: translateY(-2px);
  border-color: var(--forge-accent);
}

.channel-logo {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 1.15rem;
}

.channel-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.channel-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--forge-text);
}

.channel-handle {
  font-size: 0.78rem;
  color: var(--forge-text3);
}

.channel-desc {
  font-size: 0.8rem;
  color: var(--forge-text2);
  margin-top: 0.2rem;
}

.channel-open {
  font-size: 0.78rem;
  color: var(--forge-accent);
  white-space: nowrap;
}

/* ---- Danh sách bài ---- */
.lesson-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
  padding: 0.8rem 1rem;
  border: 1px solid var(--forge-border);
  border-radius: 12px;
  background: var(--forge-surface);
  cursor: pointer;
  color: var(--forge-text);
  font: inherit;
}

.lesson-item.active {
  border-color: var(--forge-accent);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--forge-accent) 22%, transparent);
}

.lesson-icon {
  font-size: 1.3rem;
}

.lesson-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.lesson-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.lesson-meta {
  font-size: 0.8rem;
  color: var(--forge-text3);
}

.lesson-level {
  flex-shrink: 0;
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--forge-accent) 16%, transparent);
  color: var(--forge-accent);
}

/* ---- Chi tiết bài ---- */
.lesson-detail {
  border: 1px solid var(--forge-border);
  border-radius: 14px;
  background: var(--forge-surface);
  padding: 1.1rem;
}

.detail-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.detail-head h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  color: var(--forge-text);
}

.detail-meta {
  margin: 0;
  font-size: 0.82rem;
  color: var(--forge-text3);
}

.detail-links {
  display: flex;
  gap: 0.6rem;
}

.detail-links a {
  font-size: 0.8rem;
  color: var(--forge-accent);
  text-decoration: none;
}

.detail-links a:hover {
  text-decoration: underline;
}

.audio-wrap audio {
  width: 100%;
  margin-bottom: 0.5rem;
}

.audio-hint {
  margin: 0 0 0.9rem;
  font-size: 0.78rem;
  color: var(--forge-text3);
}

/* ---- Transcript ---- */
.transcript {
  border-top: 1px dashed var(--forge-border);
  padding-top: 0.9rem;
}

.transcript-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
}

.transcript-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--forge-text);
}

.lang-toggle {
  display: flex;
  gap: 0.35rem;
}

.lang-toggle button {
  border: 1px solid var(--forge-border);
  background: transparent;
  color: var(--forge-text2);
  font-size: 0.8rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
}

.lang-toggle button.active {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: #fff;
}

.transcript-body p {
  line-height: 1.65;
  margin: 0 0 0.7rem;
  color: var(--forge-text);
}

.para-vi.with-en {
  color: var(--forge-text2);
  font-style: italic;
}

.credit-note {
  font-size: 0.75rem;
  color: var(--forge-text3);
}

.empty-state {
  text-align: center;
  color: var(--forge-text3);
  padding: 2rem 0;
}

@media (max-width: 640px) {
  .channel-grid {
    grid-template-columns: 1fr;
  }
}
</style>
