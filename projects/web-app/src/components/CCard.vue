<template>
  <a :href="href" class="home-card">
    <span class="icon">{{ icon }}</span>
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </a>
</template>

<script>
export default {
  name: 'CCard',
  props: {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    href: { type: String, required: true },
  },
};
</script>

<style scoped>
.home-card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 1.5rem 1.25rem;
  text-align: center;
  text-decoration: none;
  color: var(--forge-text);
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: cardAppear 0.6s ease-out backwards;
}

.home-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: var(--forge-card-radius);
  background: linear-gradient(135deg, transparent 30%, rgba(249, 115, 22, 0.15) 50%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
  z-index: 0;
}

.home-card:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-glass-hover-border);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(249, 115, 22, 0.08);
}

.home-card:hover::before {
  opacity: 1;
}

.icon,
.home-card h2,
.home-card p {
  position: relative;
  z-index: 2;
}

.icon {
  font-size: 2.8rem;
  display: block;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  line-height: 1;
  margin-bottom: 0.15rem;
}

.home-card:hover .icon {
  transform: scale(1.2) translateY(-2px);
}

.home-card h2 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--forge-text);
  margin-bottom: 0;
  transition: color 0.2s;
  letter-spacing: -0.01em;
}

.home-card:hover h2 {
  color: var(--forge-ember);
}

.home-card p {
  font-size: 0.82rem;
  color: var(--forge-text3);
  line-height: 1.6;
  margin-bottom: 0;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.home-card:nth-child(1) { animation-delay: 0.05s; }
.home-card:nth-child(2) { animation-delay: 0.1s; }
.home-card:nth-child(3) { animation-delay: 0.15s; }
.home-card:nth-child(4) { animation-delay: 0.2s; }
.home-card:nth-child(5) { animation-delay: 0.25s; }
.home-card:nth-child(6) { animation-delay: 0.3s; }
.home-card:nth-child(7) { animation-delay: 0.35s; }
.home-card:nth-child(8) { animation-delay: 0.4s; }
.home-card:nth-child(9) { animation-delay: 0.45s; }
.home-card:nth-child(10) { animation-delay: 0.5s; }
.home-card:nth-child(11) { animation-delay: 0.55s; }
</style>
