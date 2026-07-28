# 📄 PHẦN 15 — AWS 

---

## 1. Các dịch vụ AWS phổ biến

| Dịch vụ | Dùng để |
|---|---|
| **EC2** | Máy chủ ảo |
| **S3** | Lưu trữ object (file, backup, static assets) |
| **RDS** | Database managed (MySQL, PostgreSQL) |
| **ElastiCache** | Managed Redis/Memcached |
| **SQS** | Message queue |
| **SNS** | Push notification / pub-sub |
| **Lambda** | Serverless function |
| **CloudWatch** | Giám sát log, metric |
| **IAM** | Quản lý user, role, permission |
| **VPC** | Mạng riêng ảo |
| **ELB / ALB** | Load balancer |
| **EKS / ECS** | Chạy container / Kubernetes |
| **Route 53** | DNS |

---

## 2. EC2 vs ECS vs EKS

| | EC2 | ECS | EKS |
|---|---|---|---|
| Quản lý | Tự quản lý server | Container managed service | Kubernetes managed |
| Scale | Tự cấu hình | Dễ scale container | Dễ scale, phức tạp hơn |
| Phù hợp | Legacy, cần kiểm soát cao | App container đơn giản | Microservices lớn |

---

## 3. S3

- Object storage: file, image, backup.
- Bucket name globally unique.
- Storage classes: Standard, IA, Glacier.
- Có thể cấu hình public/private, versioning, lifecycle.

---

## 4. RDS

- Managed relational database.
- Hỗ trợ MySQL, PostgreSQL, MariaDB, SQL Server, Oracle.
- Tự động backup, patching, multi-AZ failover.
- Read replica để scale read.

---

## 5. SQS

- Message queue fully managed.
- Hàng đợi giúp giải coupling, xử lý async.
- Visibility timeout, dead-letter queue (DLQ).

---

## 6. IAM Best Practices

- Không dùng root user cho daily tasks.
- Dùng IAM Role cho EC2/Lambda thay vì hardcode key.
- Áp dụng least privilege.
- Bật MFA.

---

## 💬 Câu trả lởi mẫu 60 giây

**Câu: EC2 vs ECS?**
> "EC2 là máy chủ ảo, mình tự quản lý OS và app. ECS là dịch vụ quản lý container, mình chỉ cần định nghĩa task và service, AWS lo việc chạy container trên cluster."

**Câu: Dùng S3 để làm gì?**
> "S3 là object storage dùng để lưu file, hình ảnh, backup. Nó durable, scalable, có nhiều storage class để tối ưu chi phí."

---

## ✅ CHECKLIST PHẦN 15

- [ ] Liệt kê các dịch vụ AWS phổ biến.
- [ ] Phân biệt EC2, ECS, EKS.
- [ ] Biết use case của S3, RDS, SQS.
- [ ] Biết IAM best practices.
- [ ] Giải thích high availability, multi-AZ, read replica.
