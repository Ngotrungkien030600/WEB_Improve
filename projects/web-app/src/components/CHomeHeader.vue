<template>
  <header class="home-header">
    <div class="home-header-row">
      <div class="brand-block">
        <h1 class="brand">⚒️ SkillForge</h1>
        <div class="brand-sub">Lò rèn kỹ năng — <span class="highlight">Tiếng Anh</span> &amp; <span class="highlight">Lập trình</span> mỗi ngày</div>
      </div>
      <slot />
    </div>
  </header>
</template>

<style scoped>
.home-header {
  margin-bottom: 3rem;
}

.home-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.brand-block {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.brand {
  font-size: 2.4rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, var(--forge-brand-start, #fbbf24) 0%, var(--forge-brand-mid, #f97316) 50%, var(--forge-brand-end, #ea580c) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  text-shadow: none;
  margin-bottom: 0;
}

.brand-sub {
  font-size: 0.95rem;
  color: var(--forge-text2);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.highlight {
  color: var(--forge-fire);
  font-weight: 600;
}
</style>
