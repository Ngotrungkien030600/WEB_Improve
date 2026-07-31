<template>
  <div class="home-cards">
    <slot />
  </div>
</template>

<style scoped>
.home-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
}

@media (max-width: 1024px) {
  .home-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .home-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 400px) {
  .home-cards {
    grid-template-columns: 1fr;
  }
}
</style>
