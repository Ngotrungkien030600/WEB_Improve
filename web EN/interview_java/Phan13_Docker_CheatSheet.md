# 📄 PHẦN 13 — DOCKER 

---

## 1. Image vs Container

| **Image** | **Container** |
|---|---|
| Template read-only chứa app + dependencies | Instance đang chạy của image |
| Giống class | Giống object |
| Lưu trữ được, push/pull từ registry | Chạy, dừng, xóa |

---

## 2. Dockerfile

```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Giải thích:**
- `FROM`: base image.
- `WORKDIR`: thư mục làm việc.
- `COPY`: copy file vào image.
- `EXPOSE`: cổng lắng nghe.
- `ENTRYPOINT`: lệnh chạy khi container khởi động.

---

## 3. Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/db
    depends_on:
      - db

  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: secret
      MYSQL_DATABASE: db
    ports:
      - "3306:3306"
```

---

## 4. Lệnh Docker thường dùng

```bash
docker build -t myapp:1.0 .
docker run -p 8080:8080 myapp:1.0
docker ps
docker stop <container_id>
docker rm <container_id>
docker images
```

---

## 5. Tại sao dùng Docker?

- Đóng gói app + môi trường chạy.
- Chạy giống nhau ở dev, test, production.
- Dễ scale, triển khai.

---

## 6. Container Registry

Nơi lưu Docker image:
- Docker Hub.
- Amazon ECR.
- GitHub Container Registry.
- Private registry.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: Docker Image vs Container?**
> "Image là template read-only chứa ứng dụng và dependencies. Container là instance đang chạy của image. Một image có thể tạo nhiều container."

---

## ✅ CHECKLIST PHẦN 13

- [ ] Phân biệt Image vs Container.
- [ ] Viết Dockerfile cơ bản.
- [ ] Biết Docker Compose.
- [ ] Biết các lệnh Docker thường dùng.
- [ ] Giải thích lợi ích Docker.
- [ ] Biết Container Registry.
