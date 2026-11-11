<template>
  <div class="backend-basics-page">
    <header class="page-header">
      <div class="page-shell">
        <CTopbar
          title="10 điều cơ bản Backend cần biết"
          back-label="Java"
          back-path="/java/hub"
          @go-home="navigate"
        />
        <p class="eyebrow">LỘ TRÌNH NHẬP MÔN BACKEND</p>
        <p class="intro">
          Theo một đơn hàng từ lúc ứng dụng gửi yêu cầu, qua quy tắc nghiệp vụ và
          cơ sở dữ liệu, đến lúc triển khai và theo dõi. Mỗi chủ đề là một bài học
          riêng có ví dụ, checklist và bài tập nhỏ.
        </p>
        <div class="roadmap-meta">
          <span>10 bài học độc lập</span>
          <span aria-hidden="true">·</span>
          <span>Đi theo thứ tự để ghép thành một luồng hoàn chỉnh</span>
        </div>
      </div>
    </header>

    <main class="page-shell roadmap-content">
      <div class="section-heading">
        <div>
          <p class="eyebrow">BẮT ĐẦU TỪ ĐÂU?</p>
          <h2>Một lộ trình từ request đến vận hành</h2>
        </div>
        <p>
          Có thể mở từng bài riêng. Nếu mới học Backend, hãy bắt đầu từ bài 1 và
          lần lượt theo dõi vòng đời của đơn hàng.
        </p>
      </div>

      <ol class="lesson-grid" aria-label="Danh sách 10 bài học Backend">
        <li v-for="(lesson, index) in backendBasicsLessons" :key="lesson.id">
          <a
            class="lesson-card"
            :href="`/java/backend-basics/${lesson.id}`"
            @click="openLesson($event, lesson.id)"
          >
            <span class="lesson-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="lesson-card-content">
              <span class="lesson-title">{{ lesson.title }}</span>
              <span class="lesson-description">{{ lesson.summary }}</span>
              <span class="lesson-link">Mở bài học <span aria-hidden="true">→</span></span>
            </span>
          </a>
        </li>
      </ol>

      <section class="roadmap-flow" aria-labelledby="roadmap-flow-title">
        <h2 id="roadmap-flow-title">Bức tranh chung</h2>
        <p>
          Client gửi request → API kiểm tra dữ liệu và quyền → nghiệp vụ thao tác
          với database → test xác nhận quy tắc → triển khai và quan sát hệ thống.
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import CTopbar from '../components/CTopbar.vue';
import { backendBasicsLessons } from '../data/backend-basics-lessons.js';
import { navigate } from '../utils/navigate.js';

function openLesson(event, lessonId) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  navigate(`/java/backend-basics/${lessonId}`);
}
</script>

<style scoped>
.backend-basics-page {
  min-height: 100vh;
  color: var(--forge-text);
  background: var(--forge-bg);
}

.page-shell {
  width: min(100% - 2rem, 76rem);
  margin-inline: auto;
}

.page-header {
  padding: 2rem 0 2.5rem;
  border-bottom: 1px solid var(--forge-glass-border);
  background: var(--forge-bg2);
}

.page-header :deep(.hub-topbar) {
  margin-bottom: 2rem;
}

.eyebrow {
  margin: 0 0 0.6rem;
  color: var(--forge-fire);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.intro {
  max-width: 52rem;
  margin: 0;
  color: var(--forge-text2);
  font-size: clamp(1.05rem, 2vw, 1.25rem);
  line-height: 1.75;
}

.roadmap-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
  color: var(--forge-text3);
  font-size: 0.9rem;
}

.roadmap-content {
  padding-block: 2.5rem 4rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.section-heading h2,
.roadmap-flow h2 {
  margin: 0;
  font-size: clamp(1.4rem, 3vw, 2rem);
  line-height: 1.25;
}

.section-heading > p {
  max-width: 32rem;
  margin: 0;
  color: var(--forge-text2);
  line-height: 1.65;
}

.lesson-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.lesson-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 1rem;
  min-height: 100%;
  padding: 1.25rem;
  color: inherit;
  text-decoration: none;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  transition: border-color var(--transition-base), transform var(--transition-base);
}

.lesson-card:hover,
.lesson-card:focus-visible {
  border-color: var(--forge-fire);
  transform: translateY(-2px);
}

.lesson-card:focus-visible {
  outline: 2px solid var(--forge-fire);
  outline-offset: 3px;
}

.lesson-number {
  display: grid;
  width: 2.75rem;
  aspect-ratio: 1;
  place-items: center;
  color: var(--forge-fire);
  font-weight: 800;
  background: var(--forge-bg2);
  border-radius: 0.85rem;
}

.lesson-card-content {
  display: grid;
  gap: 0.6rem;
  min-width: 0;
}

.lesson-title {
  font-size: 1.05rem;
  font-weight: 750;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.lesson-description {
  color: var(--forge-text2);
  font-size: 0.92rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.lesson-link {
  color: var(--forge-fire);
  font-size: 0.88rem;
  font-weight: 700;
}

.roadmap-flow {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-left: 0.25rem solid var(--forge-fire);
  border-radius: var(--forge-card-radius);
}

.roadmap-flow p {
  margin: 0.8rem 0 0;
  color: var(--forge-text2);
  line-height: 1.75;
  overflow-wrap: anywhere;
}

@media (max-width: 42rem) {
  .page-header {
    padding-top: 1.25rem;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
    gap: 0.75rem;
  }

  .lesson-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .lesson-card {
    padding: 1rem;
  }
}
</style>
