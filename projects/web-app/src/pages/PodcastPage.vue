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
            <div class="sync-tools">
              <span class="sync-label">Chỉnh đồng bộ câu</span>
              <div class="sync-row">
                <span class="sync-sub">Highlight trễ/sớm hơn giọng đọc:</span>
                <button type="button" @click="adjustOffset(-100)">−100 ms</button>
                <span class="sync-value">{{ syncOffsetMs }} ms</span>
                <button type="button" @click="adjustOffset(100)">+100 ms</button>
              </div>
              <div class="sync-row">
                <span class="sync-sub">Đầu khớp nhưng càng cuối càng lệch:</span>
                <button type="button" @click="adjustPerLine(-20)">−20 ms/câu</button>
                <span class="sync-value">{{ syncPerMs }} ms/câu</span>
                <button type="button" @click="adjustPerLine(20)">+20 ms/câu</button>
                <button type="button" class="sync-reset" @click="resetSync()">Đặt lại</button>
              </div>
              <p class="sync-note">
                +ms: tô trễ hơn · −ms: tô sớm hơn. "ms/câu": mỗi câu về sau trễ/sớm thêm bấy nhiêu
                (dùng khi đầu bài khớp mà cuối bài lệch dồn lại). Chỉnh xong tự lưu theo từng bài.
              </p>
            </div>
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

// Tỉ lệ số từ của từng câu — dùng để chia tổng thời gian nói thành các mốc câu.
function computeFractions(lines) {
  const weights = lines.map((line) => {
    const words = (line.en.match(/\S+/g) || []).length;
    const endsPause = /[.!?…]"\s*$|[.!?…]\s*$/.test(line.en) ? 0.8 : 0.3;
    return words + endsPause;
  });
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const fractions = [];
  let cursor = 0;
  lines.forEach((line, index) => {
    fractions.push(cursor / totalWeight);
    cursor += weights[index];
  });
  return fractions;
}

// Thời điểm bắt đầu từng câu. `perLineSec` (giây/câu) bù độ lệch dồn về cuối:
// mỗi câu về sau trễ thêm/sớm bớt bấy nhiêu so với ước lượng ban đầu.
function buildCues(lines, totalSeconds, perLineSec) {
  const speechSeconds = Math.max(totalSeconds - LEAD_SECONDS - TAIL_SECONDS, 1);
  const fractions = computeFractions(lines);
  const starts = [];
  let previous = -Infinity;
  lines.forEach((line, index) => {
    const raw = LEAD_SECONDS + fractions[index] * speechSeconds + index * perLineSec;
    let start = raw;
    if (start < previous + 0.05) start = previous + 0.05;
    const lastAllowed = totalSeconds - 0.15;
    if (start > lastAllowed) start = lastAllowed;
    starts.push({ start });
    previous = start;
  });
  return starts;
}

const SYNC_KEY_PREFIX = 'podcast.sync.';

function readSync(lessonId) {
  try {
    const raw = localStorage.getItem(SYNC_KEY_PREFIX + lessonId);
    if (!raw) return { offsetMs: 0, perMs: 0 };
    const parsed = JSON.parse(raw);
    return {
      offsetMs: Number.isFinite(parsed.offsetMs) ? parsed.offsetMs : 0,
      perMs: Number.isFinite(parsed.perMs) ? parsed.perMs : 0,
    };
  } catch (err) {
    return { offsetMs: 0, perMs: 0 };
  }
}

function writeSync(lessonId, value) {
  try {
    localStorage.setItem(SYNC_KEY_PREFIX + lessonId, JSON.stringify(value));
  } catch (err) {
    // localStorage có thể bị chặn (private mode) — bỏ qua.
  }
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
      syncOffsetMs: 0,
      syncPerMs: 0,
    };
  },
  computed: {
    cues() {
      const lesson = this.selected;
      if (!lesson) return [];
      const total = this.durationSec > 0 ? this.durationSec : parseDuration(lesson.duration);
      if (total <= 0) return [];
      return buildCues(lesson.lines, total, this.syncPerMs / 1000);
    },
    activeIndex() {
      const time = this.currentTime - this.syncOffsetMs / 1000 + 0.05;
      let index = -1;
      this.cues.forEach((cue, i) => {
        if (cue.start <= time) index = i;
      });
      // Nhạc mở đầu (chưa tới câu đầu) — tô luôn câu đầu để highlight không biến mất.
      if (index === -1 && this.cues.length && this.currentTime >= 0 && this.currentTime < this.cues[0].start) {
        return 0;
      }
      return index;
    },
  },
  watch: {
    selected() {
      this.currentTime = 0;
      this.durationSec = 0;
      this.playing = false;
      this.loadSync();
    },
    syncOffsetMs() {
      this.persistSync();
    },
    syncPerMs() {
      this.persistSync();
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
    this.loadSync();
    this._ticker = window.setInterval(() => {
      const el = this.$refs.audioEl;
      if (el && !el.paused && Number.isFinite(el.currentTime)) {
        this.currentTime = el.currentTime;
      }
    }, 250);
  },
  beforeDestroy() {
    if (this._ticker) {
      window.clearInterval(this._ticker);
      this._ticker = null;
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
      // Giữ highlight ở câu cuối thay vì quay về 0 khiến highlight "biến mất".
      this.currentTime = this.durationSec > 0 ? this.durationSec : 0;
    },
    loadSync() {
      if (!this.selected) return;
      const saved = readSync(this.selected.id);
      this.syncOffsetMs = saved.offsetMs;
      this.syncPerMs = saved.perMs;
    },
    persistSync() {
      if (!this.selected) return;
      writeSync(this.selected.id, { offsetMs: this.syncOffsetMs, perMs: this.syncPerMs });
    },
    adjustOffset(deltaMs) {
      this.syncOffsetMs = Math.max(-3000, Math.min(3000, this.syncOffsetMs + deltaMs));
    },
    adjustPerLine(deltaMs) {
      const next = Math.round((this.syncPerMs + deltaMs) / 20) * 20;
      this.syncPerMs = Math.max(-200, Math.min(600, next));
    },
    resetSync() {
      this.syncOffsetMs = 0;
      this.syncPerMs = 0;
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

.sync-tools {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0 0 0.9rem;
  padding: 0.6rem 0.75rem;
  border: 1px dashed var(--forge-border);
  border-radius: 10px;
  background: color-mix(in srgb, var(--forge-accent) 5%, transparent);
}

.sync-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--forge-text);
}

.sync-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.sync-sub {
  color: var(--forge-text2);
  margin-right: 0.15rem;
}

.sync-row button {
  border: 1px solid var(--forge-border);
  background: var(--forge-surface);
  color: var(--forge-text2);
  font-size: 0.78rem;
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  cursor: pointer;
}

.sync-row button:hover {
  border-color: var(--forge-accent);
  color: var(--forge-accent);
}

.sync-row .sync-reset {
  margin-left: 0.4rem;
}

.sync-value {
  min-width: 5.2rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  color: var(--forge-accent);
  font-weight: 600;
}

.sync-note {
  margin: 0.1rem 0 0;
  font-size: 0.74rem;
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
