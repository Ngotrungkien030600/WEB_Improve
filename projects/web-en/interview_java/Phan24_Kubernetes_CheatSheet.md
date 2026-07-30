# 📄 PHẦN 24 — KUBERNETES & CLOUD NATIVE

---

## 1. Kubernetes là gì?

Hệ thống orchestration container, tự động **deploy, scale, manage** container.

---

## 2. Core Concepts

| Khái niệm | Ý nghĩa |
|---|---|
| **Pod** | Đơn vị nhỏ nhất — 1 hoặc nhiều container chạy cùng nhau |
| **Deployment** | Quản lý replica Pod, rollout, rollback |
| **Service** | Stable endpoint để Pod giao tiếp (ClusterIP, NodePort, LoadBalancer) |
| **Ingress** | Router HTTP/HTTPS vào Service |
| **ConfigMap / Secret** | Lưu cấu hình / nhạy cảm |
| **PersistentVolume** | Lưu trữ dữ liệu bền vững |

---

## 3. Kubernetes Architecture

```
Control Plane (Master)
├── API Server (kube-apiserver)
├── Scheduler (kube-scheduler)
├── Controller Manager (kube-controller-manager)
└── etcd (distributed key-value store)

Worker Node
├── Kubelet (agent)
├── Kube-proxy (network)
└── Container Runtime (Docker / containerd)
```

---

## 4. Deployment cơ bản

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: myapp
        image: myapp:1.0.0
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "k8s"
```

---

## 5. Service & Ingress

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service
spec:
  type: ClusterIP
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8080
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
spec:
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp-service
            port:
              number: 80
```

---

## 6. Kubernetes với Spring Boot

**application-k8s.yaml:**
```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql-service:3306/db
  config:
    import: configmap:app-config
```

**Health check:** Spring Actuator `/actuator/health` → liveness + readiness.

---

## 7. Helm — Package Manager

```bash
helm create mychart
helm install myapp ./mychart
helm upgrade myapp ./mychart --set image.tag=1.1.0
helm rollback myapp 1
```

**Values file:**
```yaml
replicaCount: 3
image:
  repository: myapp
  tag: "1.0.0"
service:
  port: 80
```

---

## 8. kubectl commands hay dùng

```bash
kubectl get pods -w
kubectl logs -f deployment/myapp
kubectl exec -it pod-name -- /bin/sh
kubectl describe pod pod-name
kubectl port-forward svc/myapp-service 8080:80
kubectl apply -f deployment.yaml
kubectl rollout status deployment/myapp
kubectl rollout undo deployment/myapp
```

---

## 9. Auto-scaling

```bash
kubectl autoscale deployment myapp --cpu-percent=70 --min=2 --max=10
```

**Horizontal Pod Autoscaler (HPA):** Tự động tăng/giảm replicas dựa trên CPU/memory.

---

## 💬 Câu trả lời mẫu 60 giây

**Câu: Pod vs Deployment?**
> "Pod là instance nhỏ nhất. Deployment quản lý nhiều Pod replica, hỗ trợ rolling update và rollback. Không tạo Pod trực tiếp, luôn qua Deployment."

**Câu: Service dùng để gì?**
> "Pod trong K8s có IP tạm thời, có thể restart → đổi IP. Service cung cấp IP/DNS ổn định và load balance traffic đến Pod."

**Câu: Liveness vs Readiness probe?**
> "Liveness kiểm tra container còn sống không — nếu fail thì restart. Readiness kiểm tra container sẵn sàng nhận traffic — nếu fail thì remove khỏi Service."

---

## ✅ CHECKLIST PHẦN 24
- [ ] Giải thích Pod, Deployment, Service, Ingress.
- [ ] Viết Deployment YAML cơ bản.
- [ ] Cấu hình Service và Ingress.
- [ ] Cấu hình Spring Boot trên K8s.
- [ ] Dùng Helm triển khai.
- [ ] Biết các lệnh kubectl cơ bản.
- [ ] Giải thích HPA auto-scaling.
- [ ] Phân biệt liveness vs readiness probe.
