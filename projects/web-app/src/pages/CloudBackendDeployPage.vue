<template>
  <main class="deploy-page">
    <div class="deploy-wrap">
      <CTopbar title="☁️ Deploy Backend lên AWS" back-label="AWS Cloud" @go-home="goCloud" />
      <header class="hero">
        <p class="eyebrow">SPRING BOOT · DOCKER · AWS ECS FARGATE</p>
        <h1>Đưa một backend từ dev lên production</h1>
        <p>Ví dụ kiến trúc cho Spring Boot API: build một image bất biến, đẩy lên ECR, chạy ECS Fargate sau ALB, kết nối RDS trong private subnet, rồi promote cùng artifact qua dev → stg → prod.</p>
      </header>

      <section class="lesson">
        <h2>1. Kiến trúc chạy thực tế</h2>
        <div class="architecture">
          <div class="flow"><span>Client</span><b>→</b><span>Route 53 / TLS</span><b>→</b><span>ALB · public subnets</span><b>→</b><span>ECS Fargate · private subnets</span></div>
          <div class="connectors">↓ private security-group rule · port 5432 ↓ &nbsp;&nbsp;&nbsp;&nbsp; task role → AWS APIs</div>
          <div class="flow secondary"><span>RDS Multi-AZ · private DB subnets</span><span>Secrets Manager</span><span>CloudWatch Logs / Metrics / Alarms</span></div>
          <p class="diagram-note">Ingress chỉ tới ALB. ECS chỉ nhận traffic từ ALB security group. Database không có public address. Task nhận quyền AWS qua IAM task role, không dùng access key hardcode.</p>
        </div>
        <div class="env-grid">
          <article><strong>DEV</strong><p>Deploy tự động sau merge vào develop; dữ liệu test; ít replica; smoke test nhanh.</p></article>
          <article><strong>STG</strong><p>Promote đúng image digest đã chạy ở dev; config/service dependency gần prod; chạy integration và acceptance tests.</p></article>
          <article><strong>PROD</strong><p>Promote cùng digest sau approval; nhiều AZ; alarm, rollback plan, backup và migration tương thích ngược.</p></article>
        </div>
      </section>

      <section class="lesson">
        <h2>2. Pipeline: build một lần, promote nhiều môi trường</h2>
        <ol class="pipeline">
          <li><strong>Validate:</strong> compile, unit/integration tests, dependency và image scan.</li>
          <li><strong>Build:</strong> tạo container image gắn commit SHA; không dùng tag <code>latest</code> làm định danh deploy.</li>
          <li><strong>Publish:</strong> push ECR image; lưu digest và metadata của build.</li>
          <li><strong>Deploy DEV:</strong> cập nhật ECS task definition sang digest đó; đợi service ổn định và chạy smoke test.</li>
          <li><strong>Promote STG:</strong> dùng đúng digest, đổi config/secret theo môi trường; kiểm tra API, DB migration, alarm.</li>
          <li><strong>Approve PROD:</strong> cùng digest, deployment circuit breaker/health check; theo dõi error rate và latency.</li>
          <li><strong>Rollback:</strong> quay task definition về revision/digest trước; migration DB phải tương thích để app cũ tiếp tục chạy.</li>
        </ol>
        <div class="callout"><strong>Không build lại cho từng môi trường.</strong> Nếu staging và production build từ source riêng, bạn không còn chắc artifact đã test chính là artifact đang phục vụ người dùng.</div>
      </section>

      <section class="lesson">
        <h2>3. Docker image mẫu cho Spring Boot</h2>
        <p>Multi-stage build giúp image runtime chỉ chứa JRE và file ứng dụng. Chạy non-root, expose health endpoint có kiểm soát, và pin base image theo quy tắc cập nhật bảo mật của team.</p>
        <CodeBlock :code="dockerCode" language="dockerfile" />
      </section>

      <section class="lesson">
        <h2>4. Mỗi environment khác nhau ở đâu?</h2>
        <div class="env-details">
          <div><h3>Giữ giống nhau</h3><ul><li>Cùng container image digest.</li><li>Cùng kiểu task definition và health checks.</li><li>Cùng pipeline kiểm tra, quyền triển khai có audit.</li><li>Infrastructure định nghĩa bằng Terraform/CloudFormation, review qua version control.</li></ul></div>
          <div><h3>Thay theo môi trường</h3><ul><li>Database endpoint và credentials lấy từ secret store.</li><li>CPU/memory/desired task count theo tải và chi phí.</li><li>Domain, callback URL, feature flag và external provider settings.</li><li>Approval gates, data classification và retention policy.</li></ul></div>
        </div>
        <CodeBlock :code="ecsDeployCode" language="yaml" />
      </section>

      <section class="lesson">
        <h2>5. Database migration không làm deploy hỏng</h2>
        <p>Dùng expand-and-contract: release đầu thêm schema mới nhưng giữ schema cũ; deploy app đọc/ghi tương thích; backfill dữ liệu theo batch; chuyển app sang field mới; release sau mới xóa schema cũ. Tránh deploy migration phá vỡ trong lúc task cũ vẫn đang chạy.</p>
        <div class="migration-flow"><span>Expand schema</span><b>→</b><span>Deploy compatible app</span><b>→</b><span>Backfill + verify</span><b>→</b><span>Contract later</span></div>
      </section>

      <section class="lesson">
        <h2>6. Checklist trước và sau production deploy</h2>
        <div class="check-grid">
          <div><h3>Trước deploy</h3><ul><li>Image digest khớp artifact đã test.</li><li>Secrets không nằm trong image, repo hoặc log.</li><li>DB migration tương thích task đang chạy.</li><li>ALB health check và ECS deployment alarms có cấu hình.</li><li>Biết ai phê duyệt và cách rollback.</li></ul></div>
          <div><h3>Sau deploy</h3><ul><li>ECS service ổn định, desired = running tasks.</li><li>Health check pass ở ALB và app.</li><li>Kiểm tra error rate, p95 latency, CPU/memory, DB connections.</li><li>Smoke test critical endpoint, auth và luồng tạo dữ liệu.</li><li>Ghi release/version vào dashboard và thông báo team.</li></ul></div>
        </div>
        <p class="interview-answer"><strong>Cách kể trong phỏng vấn:</strong> “We build the container once, tag it with the commit SHA, and promote the same image digest from dev to staging and production. Each environment injects its own configuration and secrets. Before production, we verify health checks and backward-compatible database migrations. If alarms fire, we roll the ECS service back to the previous task definition.”</p>
      </section>
    </div>
  </main>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import CodeBlock from '../components/CodeBlock.vue';
import { navigate } from '../utils/navigate.js';

const dockerCode = `# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -B dependency:go-offline
COPY src ./src
RUN ./mvnw -B clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build /workspace/target/*.jar app.jar
USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]`;

const ecsDeployCode = `# Pipeline concept — same immutable image digest promoted by environment
image: 123456789012.dkr.ecr.ap-southeast-1.amazonaws.com/orders@sha256:abc...

dev:
  cluster: orders-dev
  desiredCount: 1
  config: dev parameter/secret namespace
  approval: automatic after checks

stg:
  cluster: orders-stg
  desiredCount: 2
  config: stg parameter/secret namespace
  approval: integration tests pass

prod:
  cluster: orders-prod
  desiredCount: 3
  config: prod parameter/secret namespace
  approval: protected manual approval
  deployment: rolling or blue/green with alarms

# IAM: CI role may push to ECR and update the intended ECS service only.
# ECS task role: app permissions (for example read one secret, publish one queue).
# ECS execution role: pull image and write logs.`;

export default {
  name: 'CloudBackendDeployPage',
  components: { CTopbar, CodeBlock },
  data() {
    return { dockerCode, ecsDeployCode };
  },
  methods: {
    goCloud() {
      navigate('/cloud');
    },
  },
};
</script>

<style scoped>
.deploy-page { min-height: 100vh; padding: 2rem 1.25rem 4rem; color: var(--forge-text); background: var(--forge-bg); }
.deploy-wrap { max-width: 1050px; margin: 0 auto; }
.hero,.lesson { padding: 1.35rem; margin: 1rem 0; border: 1px solid var(--forge-glass-border); border-radius: 18px; background: var(--forge-surface); }
.hero { background: linear-gradient(135deg, rgba(249,115,22,.14), rgba(35,47,62,.55)); }
.eyebrow { color: #fb923c; font-size: .68rem; font-weight: 850; letter-spacing: .14em; }
.hero h1 { margin: .5rem 0; font-size: clamp(1.7rem,4vw,2.6rem); }
.hero p:last-child,.lesson p { color: var(--forge-text2); font-size: .88rem; line-height: 1.7; }
.lesson h2 { margin: 0 0 .75rem; font-size: 1.1rem; color: #fdba74; }
.architecture { padding: 1rem; overflow-x: auto; border: 1px solid var(--forge-glass-border); border-radius: 14px; background: rgba(0,0,0,.12); }
.flow { display: flex; align-items: center; justify-content: center; gap: .55rem; min-width: 740px; }
.flow span,.migration-flow span { padding: .65rem .8rem; border: 1px solid var(--forge-glass-border); border-radius: 9px; background: var(--forge-surface); color: var(--forge-text); font-size: .74rem; text-align: center; }
.flow b,.connectors,.migration-flow b { color: #fb923c; }
.connectors { padding: .65rem; text-align: center; font: .7rem var(--font-mono); }
.secondary { justify-content: space-around; }
.diagram-note { margin: .8rem 0 0; font-size: .74rem !important; }
.env-grid,.env-details,.check-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: .75rem; margin-top: 1rem; }
.env-grid article,.env-details>div,.check-grid>div { padding: .9rem; border: 1px solid var(--forge-glass-border); border-radius: 12px; background: rgba(255,255,255,.025); }
.env-grid strong { color: #fdba74; }
.env-grid p { margin-bottom: 0; font-size: .78rem; }
.pipeline { display: grid; gap: .55rem; padding-left: 1.2rem; color: var(--forge-text2); font-size: .84rem; line-height: 1.6; }
.pipeline li::marker { color: #fb923c; font-weight: 850; }
.callout { padding: .9rem; border-left: 3px solid #fb923c; border-radius: 0 9px 9px 0; background: rgba(249,115,22,.08); color: var(--forge-text2); font-size: .84rem; line-height: 1.6; }
.env-details,.check-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
.env-details h3,.check-grid h3 { margin: 0; color: #fdba74; font-size: .88rem; }
.env-details ul,.check-grid ul { display: grid; gap: .4rem; padding-left: 1.1rem; color: var(--forge-text2); font-size: .78rem; line-height: 1.55; }
.migration-flow { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: .5rem; margin-top: .9rem; }
.interview-answer { padding: .9rem; border-radius: 10px; background: rgba(249,115,22,.07); }
@media(max-width:700px) { .deploy-page { padding: 1rem .75rem 3rem; }.env-grid,.env-details,.check-grid { grid-template-columns: 1fr; }.flow { justify-content: flex-start; }.hero,.lesson { padding: 1rem; } }
</style>
