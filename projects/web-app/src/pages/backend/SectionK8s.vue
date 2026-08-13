<template>
  <div class="bs-section">
    <h3>Kubernetes — tại sao cần khi đã có Docker?</h3>
    <p class="section-text">Docker chạy container, nhưng <strong>K8s quản lý hàng trăm container</strong>: tự deploy, scale, self-heal, load balance. Khi traffic tăng, K8s tự tạo thêm pod; pod chết thì tự tạo lại. Đây là lớp vận hành mà production thật cần — Docker chỉ giải quyết 1 container, K8s giải quyết cả hệ thống.</p>

    <h3>Deployment & Service — khai báo trạng thái mong muốn</h3>
    <p class="section-text"><strong>Deployment</strong> khai báo "tôi muốn 3 replicas" — K8s tự duy trì con số đó. <strong>RollingUpdate</strong> thay từng pod một, không downtime. <strong>Probes</strong> (liveness/readiness) giúp K8s biết pod sống và sẵn sàng nhận traffic — app phải expose <code>/actuator/health</code>.</p>
    <CodeBlock :code="k8sDeploymentCode" language="yaml" />

    <h3>ConfigMap & Secret — tách config khỏi image</h3>
    <p class="section-text"><strong>ConfigMap</strong> chứa cấu hình không nhạy cảm (application.yml), <strong>Secret</strong> chứa dữ liệu mật (password, token). Tách ra để: đổi config không cần build lại image, và không bao giờ commit secret vào repo/image.</p>
    <CodeBlock :code="k8sConfigMapCode" language="yaml" />

    <h3>HPA — tự scale theo tải</h3>
    <p class="section-text"><strong>HorizontalPodAutoscaler</strong> tự tăng/giảm số pod theo CPU/memory. Chạy 2 pod lúc thấp điểm, scale lên 10 khi cao điểm, rồi tự giảm về — không cần can thiệp tay, tiết kiệm chi phí.</p>
    <CodeBlock :code="k8sHpaCode" language="yaml" />
  </div>
</template>

<script>
import CodeBlock from '../../components/CodeBlock.vue';

const k8sDeploymentCode = `# deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  template:
    spec:
      containers:
        - name: app
          image: registry.example.com/user-service:1.2.3
          ports:
            - containerPort: 8080
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080
          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"`;

const k8sConfigMapCode = `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  application.yml: |
    app:
      name: user-service
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/users`;

const k8sHpaCode = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70`;

export default {
  name: 'BackendSectionK8s',
  components: { CodeBlock },
  data() {
    return { k8sDeploymentCode, k8sConfigMapCode, k8sHpaCode };
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
