<template>
  <div class="bs-section">
    <h3>CI/CD — tự động hóa từ commit đến production</h3>
    <p class="section-text"><strong>CI (Continuous Integration):</strong> mỗi commit được build + test tự động → phát hiện lỗi sớm. <strong>CD (Continuous Deployment):</strong> artifact đạt chuẩn tự động deploy. Kết quả: deploy nhanh, ít lỗi do tay, và mọi người trong team đều thấy pipeline trạng thái như nhau.</p>

    <h3>GitHub Actions — pipeline trong repo</h3>
    <p class="section-text">Workflow YAML nằm ngay trong repo: push lên <code>main</code> → chạy test → build Docker image → push registry → update K8s deployment. Toàn bộ tự động, có log, có thể review như code.</p>
    <CodeBlock :code="githubActionsCode" language="yaml" />

    <h3>Git Flow — nhánh chuẩn cho team</h3>
    <div class="cards-grid cols-4">
      <div class="info-card"><h4>main</h4><p>Production-ready. Chỉ merge từ release/hotfix.</p></div>
      <div class="info-card"><h4>develop</h4><p>Tích hợp feature branches.</p></div>
      <div class="info-card"><h4>feature/xxx</h4><p>Nhánh từ develop. Tên theo ticket.</p></div>
      <div class="info-card"><h4>release/v1.2</h4><p>Chuẩn bị release. Chỉ fix bug.</p></div>
    </div>

    <h3>Code Quality Gates — chặn code xấu trước khi vào production</h3>
    <ul class="tips-list">
      <li><strong>SonarQube:</strong> code smell, bug, coverage gate</li>
      <li><strong>Checkstyle/PMD:</strong> coding convention</li>
      <li><strong>OWASP Dependency Check:</strong> scan CVE (lỗ hổng bảo mật trong thư viện)</li>
      <li><strong>Trivy:</strong> scan Docker image vulnerabilities</li>
    </ul>
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const githubActionsCode = `name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '17' }
      - run: ./mvnw verify

  build-and-deploy:
    needs: test
    steps:
      - uses: actions/checkout@v4
      - run: |
          docker build -t registry.example.com/app:\${{ github.sha }} .
          docker push registry.example.com/app:\${{ github.sha }}
      - run: kubectl set image deployment/app app=registry.example.com/app:\${{ github.sha }}`;

export default {
  name: 'BackendSectionCicd',
  components: { CodeBlock },
  data() {
    return { githubActionsCode };
  },
};
</script>

<style scoped>
.bs-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--forge-fire);
}

.bs-section h3:first-child {
  margin-top: 0;
}

.section-text {
  color: var(--forge-text2);
  font-size: 0.9rem;
  line-height: 1.7;
  margin: 1rem 0;
}

.section-text code {
  background: var(--forge-surface);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.85em;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.cards-grid.cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.info-card {
  background: var(--forge-surface);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  transition: all var(--transition-fast);
}

.info-card:hover {
  border-color: var(--forge-fire);
  transform: translateY(-2px);
}

.info-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--forge-text);
}

.info-card p,
.info-card li {
  font-size: 0.8rem;
  color: var(--forge-text3);
  margin: 0;
  line-height: 1.5;
}

.info-card ul {
  padding-left: 1rem;
  margin: 0.25rem 0 0;
}

.info-card li {
  margin-bottom: 0.2rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.tips-list li {
  padding: 0.5rem 0.75rem;
  background: var(--forge-surface);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: var(--forge-text2);
}

.tips-list strong {
  color: var(--forge-fire);
}

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
