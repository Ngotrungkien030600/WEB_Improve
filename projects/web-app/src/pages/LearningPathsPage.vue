<template>
  <div class="learning-paths-page" style="--color-accent: #7c5cfc">
    <div class="page">
      <CTopbar
        title="🗺️ Lộ trình học"
        back-label="Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="desc">
        Mỗi chặng có 6 phần: <strong>mục tiêu đo được</strong>, bài học, luyện tập có chấm,
        <strong>điều kiện đạt chuẩn</strong>, sản phẩm và cách ôn lại. Tiến độ lấy từ chính dữ liệu
        bạn đã làm ở Phòng luyện code, quiz Java, Thực chiến và Pomodoro — không phải tự khai.
      </p>

      <div class="track-tabs" role="tablist" aria-label="Chọn lộ trình">
        <button
          v-for="track in tracks"
          :key="track.id"
          type="button"
          role="tab"
          class="track-tab"
          :class="{ active: track.id === currentTrackId, primary: track.primary }"
          :style="{ '--track': track.color }"
          :aria-selected="track.id === currentTrackId ? 'true' : 'false'"
          @click="selectTrack(track.id)"
        >{{ track.icon }} {{ track.title }}</button>
      </div>

      <section class="today-card">
        <div class="today-head">
          <h2>🎯 Hôm nay học gì</h2>
          <span class="today-track">{{ track.icon }} {{ track.title }}</span>
        </div>

        <template v-if="next.stage">
          <p class="today-stage">
            Chặng {{ stageNumber(next.stage.id) }}/{{ track.stages.length }} · <strong>{{ next.stage.title }}</strong>
            <span class="today-weeks">({{ next.stage.weeks }})</span>
          </p>
          <p class="today-task">
            <template v-if="next.item">Việc tiếp theo: <strong>{{ next.item.label }}</strong></template>
            <template v-else>Chặng này đã xong — bấm “Đạt chuẩn chặng” nếu bạn thấy vững.</template>
          </p>
          <div class="today-actions">
            <a v-if="next.item && next.item.path" class="btn-start" @click="handleNavigate(next.item.path)">Làm ngay →</a>
            <span v-if="next.item && next.item.detail" class="today-detail">{{ next.item.detail }}</span>
          </div>
        </template>
        <template v-else>
          <p class="today-task">🎉 Bạn đã xong toàn bộ lộ trình này. Giờ là lúc ôn lại và làm dự án thật.</p>
        </template>

        <div class="today-foot">
          <span>⏱ Tổng thời gian học: <strong>{{ hoursLabel(signals.totalMinutes) }}</strong> ({{ signals.streak }} ngày liên tiếp)</span>
          <span v-if="reminders.length" class="review-nudge">
            🔁 Nên ôn lại: {{ reminders.map((item) => `${item.title} (${item.days} ngày trước)`).join(' · ') }}
          </span>
        </div>
      </section>

      <section class="track-head" :style="{ '--track': track.color }">
        <h2>{{ track.icon }} {{ track.title }}</h2>
        <p class="meta">{{ track.duration }} · {{ track.level }} · khoảng {{ track.hours }} giờ</p>
        <p class="track-goal"><strong>Mục tiêu cuối:</strong> {{ track.goal }}</p>
        <p class="track-why">{{ track.why }}</p>
        <div class="track-progress">
          <div class="progress-track"><div class="progress-fill" :style="{ width: `${progress.percent}%` }"></div></div>
          <span class="progress-text">
            {{ progress.doneItems }}/{{ progress.totalItems }} việc · xong {{ progress.doneStages }}/{{ progress.totalStages }} chặng · {{ progress.percent }}%
          </span>
        </div>
      </section>

      <article
        v-for="(stage, index) in progress.stages"
        :key="stage.id"
        class="stage-card"
        :class="{ done: stage.progress.percent === 100 }"
      >
        <header class="stage-head">
          <span class="stage-num">{{ index + 1 }}</span>
          <div class="stage-title">
            <h3>{{ stage.title }}</h3>
            <p class="stage-meta">{{ stage.weeks }} · {{ stage.hours }} giờ dự kiến</p>
          </div>
          <div class="stage-state">
            <span class="stage-percent">{{ stage.progress.percent }}%</span>
            <span class="stage-count">{{ stage.progress.done }}/{{ stage.progress.total }} việc</span>
          </div>
        </header>

        <div class="stage-progress-track">
          <div class="stage-progress-fill" :style="{ width: `${stage.progress.percent}%` }"></div>
        </div>

        <p class="stage-outcome"><strong>Làm được gì:</strong> {{ stage.outcome }}</p>

        <p v-if="warningsOf(stage).length" class="stage-warn">
          ⚠️ Nên học sau: {{ warningsOf(stage).map((id) => stageTitle(id)).join(', ') }} — cứ học tiếp nếu bạn đã vững.
        </p>

        <div class="stage-group">
          <h4>📚 Bài học</h4>
          <ul class="item-list">
            <li v-for="item in itemsOf(stage, 'lesson')" :key="item.key" class="item" :class="{ done: item.done }">
              <span class="item-state">{{ item.done ? '✅' : '⬜' }}</span>
              <a v-if="item.path" class="item-link" @click="handleNavigate(item.path)">{{ item.label }}</a>
              <span v-else class="item-label">{{ item.label }}</span>
            </li>
          </ul>
        </div>

        <div class="stage-group">
          <h4>🧪 Luyện tập có chấm</h4>
          <ul class="item-list">
            <li v-for="item in itemsOf(stage, 'practice')" :key="item.key" class="item" :class="{ done: item.done }">
              <button
                v-if="!item.auto"
                type="button"
                class="item-check"
                :aria-pressed="item.done ? 'true' : 'false'"
                :aria-label="`Đánh dấu ${item.label}`"
                @click="toggleItem(item.key, !item.done)"
              >{{ item.done ? '✅' : '⬜' }}</button>
              <span v-else class="item-state">{{ item.done ? '✅' : '⬜' }}</span>
              <a v-if="item.path" class="item-link" @click="handleNavigate(item.path)">{{ item.label }}</a>
              <span v-else class="item-label">{{ item.label }}</span>
              <span v-if="item.detail" class="item-detail">{{ item.detail }}</span>
            </li>
          </ul>
        </div>

        <div class="stage-group">
          <h4>✅ Điều kiện đạt chuẩn</h4>
          <ul class="item-list">
            <li v-for="item in itemsOf(stage, 'checkpoint')" :key="item.key" class="item checkpoint" :class="{ done: item.done }">
              <button
                type="button"
                class="item-check"
                :aria-pressed="item.done ? 'true' : 'false'"
                aria-label="Đánh dấu đạt chuẩn chặng"
                @click="toggleItem(item.key, !item.done)"
              >{{ item.done ? '✅' : '⬜' }}</button>
              <span class="item-label">{{ item.label }}</span>
            </li>
          </ul>
        </div>

        <div class="stage-foot">
          <p class="stage-project">🏗️ <strong>Sản phẩm:</strong> {{ stage.project }}</p>
          <p class="stage-review">🔁 <strong>Ôn lại:</strong> {{ stage.review }}</p>
          <div class="stage-actions">
            <button
              type="button"
              class="btn-mark"
              :class="{ active: stage.progress.completed }"
              @click="toggleStage(stage)"
            >{{ stage.progress.completed ? '✅ Đã đạt chuẩn chặng' : '🏁 Đạt chuẩn chặng này' }}</button>
            <span v-if="stage.progress.completedAt" class="stage-date">xong {{ formatDate(stage.progress.completedAt) }}</span>
          </div>
        </div>
      </article>

      <section class="rules-card">
        <h3>📌 Cách học cho hiệu quả (đừng bỏ qua)</h3>
        <ul>
          <li><strong>Mỗi buổi phải có sản phẩm</strong>: một đoạn code chạy được, một câu trả lời nói thành tiếng, hoặc một ghi chú tự viết. Đọc xong mà không làm gì là chưa học.</li>
          <li><strong>Học chủ động thay vì đọc lại</strong>: làm quiz trước, sai rồi mới đọc lại phần đó — nhớ lâu hơn nhiều so với đọc trước rồi làm sau.</li>
          <li><strong>Ôn ngắt quãng</strong>: mỗi chặng ghi rõ ôn lại sau 1-3-7 ngày. Quên là chuyện bình thường, không ôn mới là vấn đề.</li>
          <li><strong>Xen kẽ</strong>: chặng mới + ôn 1 bài cũ mỗi ngày, đừng học liền một mạch một chủ đề.</li>
          <li><strong>Khối thời gian tập trung</strong>: dùng Pomodoro 30 phút ở trang chủ; 1 giờ/ngày đều đặn tốt hơn 7 giờ cuối tuần.</li>
          <li><strong>Đo bằng năng lực, không bằng thời gian</strong>: chưa đạt điều kiện đạt chuẩn thì chưa tính là xong chặng, dù đã học đủ số ngày.</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import { JAVA_TU_ZERO } from '../utils/java-tu-zero-content.js';
import { LEARNING_TRACKS, PRIMARY_TRACK_ID, findTrack } from '../data/learning-paths.js';
import {
  collectSignals,
  countQuizResult,
  hoursLabel,
  markStageComplete,
  nextStep,
  prerequisiteWarnings,
  readQuizState,
  readTicks,
  reviewReminders,
  setItemTick,
  trackProgress,
} from '../logic/learning-path-logic.js';

export default {
  name: 'LearningPathsPage',
  components: { CTopbar },

  data() {
    return {
      tracks: LEARNING_TRACKS,
      currentTrackId: PRIMARY_TRACK_ID,
      signals: {},
      ticks: { items: {}, stages: {} },
    };
  },

  computed: {
    track() {
      return findTrack(this.currentTrackId);
    },
    progress() {
      return trackProgress(this.track, this.signals, this.ticks);
    },
    next() {
      return nextStep(this.track, this.signals, this.ticks);
    },
    reminders() {
      return reviewReminders(this.track, this.ticks).slice(0, 2);
    },
  },

  created() {
    this.refresh();
  },

  methods: {
    handleNavigate(path) {
      navigate(path);
    },
    hoursLabel,
    refresh() {
      this.signals = collectSignals({ quizResult: countQuizResult(JAVA_TU_ZERO, readQuizState()) });
      this.ticks = readTicks();
    },
    selectTrack(trackId) {
      this.currentTrackId = trackId;
      this.refresh();
    },
    stageNumber(stageId) {
      const index = this.track.stages.findIndex((stage) => stage.id === stageId);
      return index === -1 ? 1 : index + 1;
    },
    stageTitle(stageId) {
      const stage = this.track.stages.find((item) => item.id === stageId);
      return stage ? stage.title : stageId;
    },
    itemsOf(stage, group) {
      return stage.progress.items.filter((item) => item.group === group);
    },
    warningsOf(stage) {
      return prerequisiteWarnings(stage, this.ticks);
    },
    toggleItem(itemKey, done) {
      this.ticks = setItemTick(itemKey, done);
    },
    toggleStage(stage) {
      this.ticks = markStageComplete(stage, this.signals, !stage.progress.completed);
    },
    formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
.learning-paths-page {
  background: var(--color-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.page {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

.desc {
  color: var(--color-text2);
  margin-bottom: 1.25rem;
  font-size: var(--font-sm);
  line-height: 1.7;
}

.track-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
}

.track-tab {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text2);
  font-size: var(--font-xs);
  font-weight: 700;
  cursor: pointer;
}

.track-tab:hover {
  border-color: var(--track);
  color: var(--color-text);
}

.track-tab.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.track-tab.primary::after {
  content: '★';
  margin-left: 0.35rem;
  font-size: 0.7rem;
}

.today-card {
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  background: linear-gradient(140deg, rgba(139, 92, 246, 0.16), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.35);
}

.today-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.today-head h2 {
  font-size: var(--font-lg);
  font-weight: 800;
}

.today-track {
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.today-stage,
.today-task {
  font-size: var(--font-sm);
  color: var(--color-text);
  line-height: 1.65;
  margin-bottom: 0.35rem;
}

.today-weeks {
  color: var(--color-text2);
  font-size: var(--font-xs);
}

.today-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin: 0.6rem 0 0.4rem;
}

.today-detail {
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.today-foot {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.6rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.review-nudge {
  color: #fcd34d;
}

.track-head {
  border-left: 3px solid var(--track);
  padding-left: var(--space-4);
  margin-bottom: var(--space-4);
}

.track-head h2 {
  font-size: var(--font-xl);
  font-weight: 800;
  margin-bottom: 0.25rem;
}

.meta {
  font-size: var(--font-xs);
  color: var(--color-text2);
  margin-bottom: 0.6rem;
}

.track-goal,
.track-why {
  font-size: var(--font-sm);
  color: var(--color-text2);
  line-height: 1.65;
  margin-bottom: 0.35rem;
}

.track-progress {
  margin-top: 0.6rem;
}

.progress-track {
  height: 8px;
  border-radius: 999px;
  background: var(--color-surface2);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6, #06b6d4);
  transition: width 0.3s ease;
}

.progress-text {
  display: inline-block;
  margin-top: 0.35rem;
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.stage-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-bottom: var(--space-4);
}

.stage-card.done {
  border-color: rgba(52, 211, 153, 0.5);
}

.stage-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stage-num {
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--color-surface2);
  color: var(--color-accent);
  font-weight: 800;
  font-size: var(--font-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-title {
  flex: 1 1 auto;
  min-width: 0;
}

.stage-title h3 {
  font-size: var(--font-base);
  font-weight: 700;
}

.stage-meta {
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.stage-state {
  text-align: right;
  flex: 0 0 auto;
}

.stage-percent {
  display: block;
  font-size: var(--font-base);
  font-weight: 800;
  color: var(--color-accent);
}

.stage-count {
  font-size: 0.68rem;
  color: var(--color-text2);
}

.stage-progress-track {
  height: 5px;
  margin: 0.6rem 0 0.75rem;
  border-radius: 999px;
  background: var(--color-surface2);
  overflow: hidden;
}

.stage-progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.stage-outcome {
  font-size: var(--font-sm);
  color: var(--color-text);
  line-height: 1.65;
  margin-bottom: 0.5rem;
}

.stage-warn {
  font-size: var(--font-xs);
  color: #fcd34d;
  background: rgba(252, 211, 77, 0.08);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.6rem;
  margin-bottom: 0.6rem;
}

.stage-group {
  margin-bottom: 0.75rem;
}

.stage-group h4 {
  font-size: var(--font-xs);
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 0.35rem;
}

.item-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.3rem 0;
  font-size: var(--font-sm);
  color: var(--color-text2);
  border-bottom: 1px dashed var(--color-border);
}

.item:last-child {
  border-bottom: none;
}

.item.done {
  color: var(--color-text);
}

.item-state,
.item-check {
  flex: 0 0 auto;
  font-size: var(--font-sm);
  line-height: 1.4;
}

.item-check {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
}

.item-link {
  color: var(--color-text);
  text-decoration: underline;
  text-decoration-color: rgba(139, 92, 246, 0.5);
  cursor: pointer;
}

.item-link:hover {
  color: var(--color-accent);
}

.item-label {
  flex: 1 1 auto;
}

.item-detail {
  flex: 0 0 auto;
  font-size: 0.68rem;
  color: var(--color-text2);
}

.item.checkpoint .item-label {
  color: var(--color-text);
  font-weight: 600;
}

.stage-foot {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.stage-project,
.stage-review {
  font-size: var(--font-xs);
  color: var(--color-text2);
  line-height: 1.6;
  margin-bottom: 0.35rem;
}

.stage-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.btn-start {
  display: inline-block;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-sm);
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
}

.btn-start:hover {
  opacity: 0.9;
}

.btn-mark {
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text2);
  border-radius: var(--radius-sm);
  padding: 0.4rem 0.8rem;
  font-size: var(--font-xs);
  font-weight: 700;
  cursor: pointer;
}

.btn-mark:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
}

.btn-mark.active {
  border-color: rgba(52, 211, 153, 0.6);
  color: #34d399;
  background: rgba(52, 211, 153, 0.1);
}

.stage-date {
  font-size: var(--font-xs);
  color: var(--color-text2);
}

.rules-card {
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}

.rules-card h3 {
  font-size: var(--font-base);
  font-weight: 800;
  margin-bottom: 0.6rem;
}

.rules-card ul {
  margin: 0;
  padding-left: 1.1rem;
}

.rules-card li {
  font-size: var(--font-sm);
  color: var(--color-text2);
  line-height: 1.7;
  margin-bottom: 0.45rem;
}

@media (max-width: 640px) {
  .learning-paths-page {
    padding: 1.5rem 0.75rem;
  }

  .page {
    padding: 0 0.5rem 2rem;
  }

  .stage-head {
    flex-wrap: wrap;
  }

  .stage-state {
    text-align: left;
  }

  .item {
    flex-wrap: wrap;
  }
}
</style>
