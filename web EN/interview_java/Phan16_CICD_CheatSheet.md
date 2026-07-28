# 📄 PHẦN 16 — CI/CD 

---

## 1. CI/CD là gì?

| CI (Continuous Integration) | CD (Continuous Delivery/Deployment) |
|---|---|
| Tự động build, test khi code thay đổi | Tự động triển khai lên môi trường target |

---

## 2. Pipeline cơ bản

```
Source Code → Build → Test → Package → Deploy
   (push)    (mvn)  (junit) (docker)  (ecs/k8s)
```

---

## 3. Công cụ phổ biến

| Công cụ | Mô tả |
|---|---|
| **GitHub Actions** | CI/CD tích hợp GitHub |
| **GitLab CI** | CI/CD tích hợp GitLab |
| **Jenkins** | Self-hosted, linh hoạt |
| **CircleCI / Travis** | Cloud CI/CD |
| **ArgoCD** | GitOps continuous deployment cho K8s |

---

## 4. GitHub Actions cơ bản

```yaml
name: Java CI
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      - run: mvn clean test
      - run: mvn package -DskipTests
```

---

## 5. Docker trong CI/CD

```yaml
- name: Build Docker image
  run: docker build -t myapp:${{ github.sha }} .

- name: Push to ECR
  run: |
    aws ecr get-login-password | docker login --username AWS --password-stdin <ecr-url>
    docker push myapp:${{ github.sha }}
```

---

## 6. CI/CD Best Practices

- Chạy unit test trước khi merge.
- Không commit secret vào repo.
- Build once, deploy many (cùng image đến nhiều môi trường).
- Phân biệt staging và production.
- Rollback nhanh khi lỗi.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: CI/CD là gì?**
> "CI là tự động build và test khi developer push code. CD là tự động triển khai lên staging hoặc production. Ví dụ push lên main thì GitHub Actions chạy mvn test, build Docker image, push lên ECR và deploy lên ECS."

---

## ✅ CHECKLIST PHẦN 16

- [ ] Giải thích CI và CD.
- [ ] Biết các công cụ CI/CD.
- [ ] Viết pipeline cơ bản với GitHub Actions.
- [ ] Biết tích hợp Docker trong CI/CD.
- [ ] Biết CI/CD best practices.
