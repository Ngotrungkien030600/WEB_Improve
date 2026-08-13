<template>
  <div class="bs-section">
    <h3>Docker — tại sao mọi backend team cần?</h3>
    <p class="section-text">Docker đóng gói app + môi trường (JDK, dependencies, config) vào 1 image chạy được ở <strong>mọi nơi</strong>: máy dev, CI, server. Hết bài toán "chạy được trên máy tôi". Đây là nền tảng cho microservices, K8s, và CI/CD — deploy cùng 1 image từ dev đến production.</p>

    <h3>Dockerfile cho Spring Boot — multi-stage build</h3>
    <p class="section-text">Multi-stage tách 2 giai đoạn: <strong>build</strong> (đầy đủ JDK + Maven) và <strong>runtime</strong> (chỉ JRE nhẹ). Image cuối nhỏ hơn nhiều, an toàn hơn. Chạy với <strong>user non-root</strong> và <code>HEALTHCHECK</code> — để K8s biết app còn sống không.</p>
    <CodeBlock :code="dockerfileCode" language="dockerfile" />

    <h3>docker-compose — chạy nhiều service cùng lúc</h3>
    <p class="section-text">Một file YAML khai báo toàn bộ stack: app + PostgreSQL + Redis... <code>depends_on + healthcheck</code> đảm bảo app chỉ start khi DB sẵn sàng — chuẩn cho local dev và cả staging.</p>
    <CodeBlock :code="dockerComposeCode" language="yaml" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const dockerfileCode = `# Multi-stage build
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src/ src/
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]`;

const dockerComposeCode = `version: '3.8'
services:
  app:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/skillforge
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: skillforge
      POSTGRES_PASSWORD: secret
    volumes: ["pgdata:/var/lib/postgresql/data"]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]`;

export default {
  name: 'BackendSectionDocker',
  components: { CodeBlock },
  data() {
    return { dockerfileCode, dockerComposeCode };
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

@media (max-width: 700px) {
  .cards-grid,
  .cards-grid.cols-4 {
    grid-template-columns: 1fr;
  }
}
</style>
