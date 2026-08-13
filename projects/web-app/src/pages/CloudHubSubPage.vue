<template>
  <div class="cloud-hub-page">
    <div class="ch-container">
      <div class="ch-topbar">
        <h1>☁️ AWS Cloud</h1>
        <a class="ch-back" href="/" @click.prevent="handleBack">← Trang chủ</a>
      </div>

      <p class="ch-desc">
        Kiến thức AWS toàn diện — từ Compute, Storage, Database đến Networking, Security, DevOps.
        Có code mẫu, kiến trúc, best practices.
      </p>

      <div class="ch-grid">
        <a class="ch-card" href="/cloud" @click.prevent="handleNavigate('/cloud')">
          <div class="ch-card-icon">⚡</div>
          <div class="ch-card-body">
            <h3>AWS Foundations & Core</h3>
            <p>IAM, VPC, EC2, Lambda, S3, RDS, ELB, Auto Scaling — kiến trúc, code mẫu, best practices</p>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

export default {
  name: 'CloudHubSubPage',
  methods: {
    handleBack() {
      navigate('/');
    },
    handleNavigate(path) {
      navigate(path);
    },
  },
};
</script>

<style scoped>
.cloud-hub-page {
  background: linear-gradient(135deg, #ff6b35, #f7931e, #232f3e);
  min-height: 100vh;
  padding: 2rem 1.5rem;
}

.ch-container {
  max-width: 960px;
  margin: 0 auto;
}

.ch-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.ch-topbar h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.ch-back {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}

.ch-back:hover {
  color: white;
}

.ch-desc {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.ch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.ch-card {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ch-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.ch-card-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.ch-card-body h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.5rem 0;
}

.ch-card-body p {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 600px) {
  .ch-grid {
    grid-template-columns: 1fr;
  }
}
</style>
