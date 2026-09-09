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

      <!-- ===== Mục 2: Bài nghe + Transcript đồng bộ ===== -->
      <section class="section">
        <div class="section-header">
          <h2>🎧 Bài nghe + Transcript đồng bộ</h2>
          <p class="section-sub">Audio đọc tới đâu, câu đó được tô xanh và hiện bản dịch tiếng Việt ngay bên dưới. Bấm vào một câu bất kỳ để tua audio tới đó.</p>
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
            <audio
              ref="audioEl"
              :key="selected.id"
              :src="selected.audioUrl"
              controls
              preload="metadata"
              @loadedmetadata="onMeta"
              @timeupdate="onTime"
              @play="onPlay"
              @pause="onPause"
              @ended="onEnded"
            ></audio>
            <p class="audio-hint">Audio phát trực tiếp từ máy chủ VOA. Nếu không nghe được, dùng nút "Trang nghe VOA".</p>
          </div>

          <!-- Transcript -->
          <div class="transcript">
            <div class="transcript-bar">
              <div class="transcript-tools">
                <span class="transcript-label">Transcript</span>
                <div class="tool-toggle">
                  <button
                    :class="{ active: !showAllVi }"
                    title="Chỉ hiện bản dịch của câu đang đọc"
                    @click="showAllVi = false"
                  >
                    Dịch theo câu đang đọc
                  </button>
                  <button
                    :class="{ active: showAllVi }"
                    title="Hiện bản dịch của tất cả các câu"
                    @click="showAllVi = true"
                  >
                    Xem hết bản dịch
                  </button>
                </div>
              </div>
              <label class="autoscroll" title="Tự cuộn theo câu đang đọc">
                <input v-model="autoScroll" type="checkbox" />
                <span>Tự cuộn theo audio</span>
              </label>
            </div>
            <div ref="transcriptBody" class="transcript-body">
              <div
                v-for="(line, index) in selected.lines"
                :key="index"
                class="t-line"
                :class="{ 'is-active': index === activeIndex }"
                @click="seekTo(index)"
              >
                <p class="t-en">{{ line.en }}</p>
                <p
                  v-if="showAllVi || index === activeIndex"
                  class="t-vi"
                  :class="{ 'quiet': showAllVi && index !== activeIndex }"
                >
                  {{ line.vi }}
                </p>
              </div>
              <p v-if="!durationSec && !cues.length" class="empty-state">
                Đang nạp audio để đồng bộ câu…
              </p>
              <p class="credit-note">
                Transcript tiếng Anh: VOA Learning English (public domain) · Bản dịch tiếng Việt: SkillForge biên soạn · Thời điểm câu được ước lượng theo độ dài audio.
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

// Khoảng lặng (giây) ở đầu/cuối audio — có thể chỉnh theo từng bài nếu cần tinh chỉnh.
const LEAD_SECONDS = 1.0;
const TAIL_SECONDS = 0.6;

function parseDuration(text) {
  const parts = String(text).split(':').map((part) => Number(part));
  if (parts.some((part) => Number.isNaN(part))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// Ước lượng thời điểm bắt đầu của mỗi câu theo tỉ lệ số từ so với tổng độ dài audio.
function buildCues(lines, totalSeconds) {
  const speechSeconds = Math.max(totalSeconds - LEAD_SECONDS - TAIL_SECONDS, 1);
  const weights = lines.map((line) => {
    const words = (line.en.match(/\S+/g) || []).length;
    const endsPause = /[.!?…]"\s*$|[.!?…]\s*$/.test(line.en) ? 0.8 : 0.3;
    return words + endsPause;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const cues = [];
  let cursor = 0;
  lines.forEach((line, index) => {
    cues.push({ start: LEAD_SECONDS + (cursor / totalWeight) * speechSeconds });
    cursor += weights[index];
  });
  return cues;
}

export default {
  name: 'PodcastPage',
  components: { CTopbar },
  data() {
    return {
      channels: YOUTUBE_CHANNELS,
      lessons: PODCAST_LESSONS,
      selected: PODCAST_LESSONS[0] || null,
      showAllVi: false,
      autoScroll: true,
      durationSec: 0,
      currentTime: 0,
      playing: false,
      cues: [],
    };
  },
  computed: {
    activeIndex() {
      const time = this.currentTime + 0.05;
      let index = -1;
      this.cues.forEach((cue, i) => {
        if (cue.start <= time) index = i;
      });
      return index;
    },
  },
  watch: {
    selected() {
      this.currentTime = 0;
      this.durationSec = 0;
      this.playing = false;
      this.cues = buildCues(this.selected.lines, parseDuration(this.selected.duration));
    },
    activeIndex(next, prev) {
      if (next !== prev && next >= 0 && this.playing && this.autoScroll) {
        this.$nextTick(() => {
          const el = this.$el.querySelector('.t-line.is-active');
          if (el) {
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
          }
        });
      }
    },
  },
  mounted() {
    // Cues tạm theo thời lượng hiển thị; khi audio nạp xong sẽ tính lại theo thời lượng thật.
    if (this.selected) {
      this.cues = buildCues(this.selected.lines, parseDuration(this.selected.duration));
    }
  },
  methods: {
    handleBack() {
      navigate('/english/hub');
    },
    selectLesson(lesson) {
      this.selected = lesson;
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    },
    onMeta(event) {
      const audio = event.target;
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        this.durationSec = audio.duration;
        this.cues = buildCues(this.selected.lines, audio.duration);
      }
    },
    onTime(event) {
      this.currentTime = event.target.currentTime;
    },
    onPlay() {
      this.playing = true;
    },
    onPause() {
      this.playing = false;
    },
    onEnded() {
      this.playing = false;
      this.currentTime = 0;
    },
    seekTo(index) {
      const cue = this.cues[index];
      const audio = this.$refs.audioEl;
      if (!cue || !audio) return;
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Math.min(cue.start + 0.03, Math.max(audio.duration - 0.1, 0));
      }
      if (!this.playing) {
        const promise = audio.play();
        if (promise && promise.catch) {
          promise.catch(() => {
            // Trình duyệt chặn autoplay — người dùng bấm play trên thanh audio.
          });
        }
      }
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

/* ---- Transcript đồng bộ ---- */
.transcript {
  border-top: 1px dashed var(--forge-border);
  padding-top: 0.9rem;
}

.transcript-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.transcript-tools {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
}

.transcript-label {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--forge-text);
}

.tool-toggle {
  display: flex;
  gap: 0.35rem;
}

.tool-toggle button {
  border: 1px solid var(--forge-border);
  background: transparent;
  color: var(--forge-text2);
  font-size: 0.78rem;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
}

.tool-toggle button.active {
  background: var(--forge-accent);
  border-color: var(--forge-accent);
  color: #fff;
}

.autoscroll {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--forge-text2);
  cursor: pointer;
  user-select: none;
}

.transcript-body {
  max-height: 420px;
  overflow-y: auto;
  padding: 0.35rem 0.4rem 0.35rem 0;
  border: 1px solid var(--forge-border);
  border-radius: 10px;
  background: var(--forge-surface2, var(--forge-surface));
}

.t-line {
  padding: 0.45rem 0.85rem;
  border-left: 3px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.t-line:hover {
  background: color-mix(in srgb, var(--forge-accent) 7%, transparent);
}

.t-line.is-active {
  background: rgba(33, 106, 219, 0.1);
  border-left-color: #216adb;
}

.t-line .t-en {
  margin: 0;
  line-height: 1.6;
  font-size: 0.96rem;
  color: var(--forge-text);
}

.t-line.is-active .t-en {
  color: #1158c7;
  font-weight: 600;
}

.t-line .t-vi {
  margin: 0.25rem 0 0 0.4rem;
  line-height: 1.55;
  font-size: 0.9rem;
  color: #0d47a1;
}

.t-line .t-vi.quiet {
  color: var(--forge-text2);
  font-style: italic;
  font-size: 0.88rem;
}

.credit-note {
  margin: 0.8rem 0.85rem 0.3rem;
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
