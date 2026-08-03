# Hướng dẫn Bastion Host & Jump Host trong AWS

> Tài liệu tiếng Việt đầy đủ về Bastion Host / Jump Host — từ khái niệm, kiến trúc, triển khai thực tế, bảo mật đến các phương án thay thế hiện đại.

---

## 1. Khái niệm cơ bản

### 1.1 Bastion Host là gì?

**Bastion Host** (còn gọi là **Jump Host**, **Jump Box**, hay **Jump Server**) là một máy chủ đặt ở vị trí **biên (edge) của mạng** — thường nằm trong **public subnet** — dùng làm **cổng vào duy nhất (single entry point)** để quản trị viên SSH/RDP vào các máy chủ nội bộ nằm trong **private subnet**.

```
                    Internet
                       │
                       │ SSH (port 22, chỉ từ IP của bạn)
                       ▼
              ┌──────────────────┐
              │   BASTION HOST   │   Public subnet (có public IP / EIP)
              │   (Jump Host)    │
              └────────┬─────────┘
                       │ SSH (port 22, private IP)
              ┌────────┴─────────┐
              │   PRIVATE SUBNET │
              ├──────────────────┤
              │  Web Server      │  10.0.1.10
              │  App Server      │  10.0.1.20
              │  DB Server       │  10.0.1.30
              └──────────────────┘
```

### 1.2 Bastion vs Jump Host — có khác nhau không?

| Thuật ngữ | Ý nghĩa | Khác biệt tinh tế |
|---|---|---|
| **Bastion Host** | Máy chủ "pháo đài" chuyên dùng để truy cập vào private network | Thường được **hardened** (bảo mật rất kỹ), cài thêm tool giám sát, 2FA |
| **Jump Host** | Điểm trung chuyển để "nhảy" vào máy khác | Cùng khái niệm, đôi khi chỉ là EC2 nhỏ dùng làm trung gian |

> Trong thực tế **2 thuật ngữ này dùng thay thế nhau được**. Bastion nhấn mạnh tính *bảo mật*, Jump Host nhấn mạnh chức năng *trung chuyển*.

### 1.3 Vì sao cần Bastion Host?

1. **Private subnet không có public IP** — không thể SSH trực tiếp từ internet
2. **Giảm attack surface** — chỉ 1 máy lộ ra internet thay vì tất cả
3. **Kiểm soát truy cập tập trung** — 1 điểm để log, audit, giám sát
4. **Security Group gọn** — private instances chỉ cần mở port 22 từ bastion, không cần mở cho internet
5. **Tuân thủ (compliance)** — kiểm soát ai vào hệ thống, ghi log đầy đủ

---

## 2. Kiến trúc triển khai

### 2.1 Kiến trúc chuẩn (đơn giản)

```
VPC (10.0.0.0/16)
├── Public Subnet (10.0.1.0/24)
│   ├── Internet Gateway
│   ├── Bastion Host (EC2 t2.micro) — EIP + Security Group Bastion-SG
│   └── NAT Gateway (cho private subnet ra internet)
│
└── Private Subnet (10.0.2.0/24)
    ├── App Server (10.0.2.10) — Security Group App-SG (chỉ nhận SSH từ Bastion-SG)
    ├── DB Server  (10.0.2.20) — Security Group DB-SG  (chỉ nhận port 3306 từ App-SG)
    └── Route table → NAT Gateway
```

### 2.2 Security Group — bảo mật theo chiều ngang

**Nguyên tắc vàng:** private instance **KHÔNG BAO GIỜ** mở port 22 cho `0.0.0.0/0`. Chỉ mở cho Security Group của bastion.

```text
Bastion-SG (inbound):
  SSH (22)   ←  Chỉ từ IP công ty / IP nhà bạn (VD: 203.0.113.5/32)
  HTTPS (443)←  Từ IP của bạn (cho SSM/console nếu cần)

App-SG (inbound):
  SSH (22)   ←  Chỉ từ Bastion-SG (hoặc source = SG id của bastion)

DB-SG (inbound):
  MySQL (3306) ← Chỉ từ App-SG
```

**Ví dụ mở SSH từ bastion SG (AWS console):**
```text
Type: SSH
Source: sg-0a1b2c3d4e5f67890   ← chọn security group của bastion, không phải IP
```

### 2.3 Chọn instance cho Bastion

| Tiêu chí | Khuyến nghị |
|---|---|
| **Instance type** | `t3.micro` / `t3.nano` là đủ (bastion không chạy ứng dụng nặng) |
| **AMI** | Amazon Linux 2023 (mặc định có SSM agent) hoặc Ubuntu LTS |
| **EBS** | 8-20GB gp3 là đủ |
| **Public IP** | Nên dùng **Elastic IP (EIP)** — IP cố định để whitelist trong SG |
| **Key pair** | Dùng riêng hoặc SSM để quản lý truy cập |

### 2.4 Chạy Bastion ở 2 AZ (HA) — khuyến nghị nâng cao

Để tránh bastion thành **single point of failure**, triển khai 2 bastion ở 2 Availability Zone:

```text
Public Subnet AZ-a → Bastion-a (EIP-a)
Public Subnet AZ-b → Bastion-b (EIP-b)

DNS: bastion.example.com → Route 53 health check → trỏ về EIP còn sống
```

Người dùng chỉ cần nhớ 1 hostname, hệ thống tự chuyển sang bastion còn hoạt động.

---

## 3. Các cách SSH qua Bastion

### 3.1 SSH Agent Forwarding (đơn giản, phổ biến)

Cách này không cần đặt private key trên bastion — nguy hiểm nhưng tiện.

```bash
# 1. Thêm key vào SSH agent (chạy trên máy local)
ssh-add ~/.ssh/my-key.pem

# 2. SSH vào bastion với -A (Agent Forwarding)
ssh -A ec2-user@bastion-public-ip

# 3. Từ bastion, SSH tiếp vào private server (dùng key local qua agent)
ssh ec2-user@10.0.2.10
```

> ⚠️ **Cảnh báo:** Agent forwarding cho phép *mọi tiến trình trên bastion* mượn key của bạn. Nếu bastion bị compromised, key của bạn bị lộ. Chỉ dùng khi bastion cực kỳ tin cậy, và dùng `ssh-add -t 3600` (key tự hết hạn sau 1 giờ).

### 3.2 ProxyJump / ProxyCommand (khuyến nghị an toàn nhất)

**Không cần đặt key trên bastion**, máy local tự kết nối trực tiếp tới đích qua bastion trung chuyển.

```bash
# Cách 1: ProxyJump (OpenSSH 7.3+, khuyến nghị)
ssh -J ec2-user@bastion-public-ip ec2-user@10.0.2.10

# Cách 2: ProxyCommand (tương thích rộng hơn)
ssh -o ProxyCommand="ssh -W %h:%p ec2-user@bastion-public-ip" ec2-user@10.0.2.10
```

**Cấu hình trong `~/.ssh/config` để dùng dài lâu:**

```text
Host bastion
    HostName 203.0.113.5
    User ec2-user
    IdentityFile ~/.ssh/aws-bastion.pem

Host 10.0.2.* 10.0.1.*
    User ec2-user
    IdentityFile ~/.ssh/aws-app.pem
    ProxyJump bastion
```

Sau đó chỉ cần gõ:

```bash
ssh 10.0.2.10     # Tự động đi qua bastion
```

### 3.3 SCP / SFTP qua bastion

```bash
# Copy file local → private server (qua bastion)
scp -o ProxyJump=ec2-user@bastion-ip ./file.txt ec2-user@10.0.2.10:/home/ec2-user/

# SFTP qua bastion
sftp -J ec2-user@bastion-ip ec2-user@10.0.2.10
```

---

## 4. Triển khai Bastion bằng Terraform

### 4.1 Code Terraform đầy đủ

```hcl
# variables.tf
variable "vpc_id"          { type = string }
variable "public_subnet"   { type = string }
variable "my_ip"           { type = string }
variable "key_name"        { type = string }

# bastion.tf
resource "aws_security_group" "bastion_sg" {
  name   = "bastion-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]          # Chỉ IP của bạn!
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app_sg" {
  name   = "app-sg"
  vpc_id = var.vpc_id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    security_groups = [aws_security_group.bastion_sg.id]   # ← chì từ bastion
  }
}

resource "aws_instance" "bastion" {
  ami                    = "ami-0abcdef1234567890"   # Amazon Linux 2023
  instance_type          = "t3.micro"
  subnet_id              = var.public_subnet
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.bastion_sg.id]
  associate_public_ip_address = true

  tags = { Name = "bastion" }
}

resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
}
```

### 4.2 AWS CLI — tạo nhanh

```bash
# Tạo SG cho bastion
BASTION_SG=$(aws ec2 create-security-group \
  --group-name bastion-sg \
  --description "Bastion SG" \
  --vpc-id vpc-xxxxx \
  --query 'GroupId' --output text)

# Mở SSH chỉ cho IP của bạn
aws ec2 authorize-security-group-ingress \
  --group-id $BASTION_SG \
  --protocol tcp --port 22 \
  --cidr 203.0.113.5/32

# Launch bastion
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --instance-type t3.micro \
  --subnet-id subnet-public-xxx \
  --security-group-ids $BASTION_SG \
  --key-name your-key \
  --associate-public-ip-address

# Gắn Elastic IP
aws ec2 allocate-address --domain vpc
aws ec2 associate-address \
  --instance-id i-xxxxx \
  --allocation-id eipalloc-xxxxx
```

---

## 5. Bảo mật Bastion Host — Best Practices

### 5.1 Checklist bảo mật tối thiểu

- [ ] **Giới hạn IP** — SG chỉ mở SSH từ IP công ty/VPn của bạn, KHÔNG `0.0.0.0/0`
- [ ] **Dùng key riêng** cho bastion, không dùng chung key với production server
- [ ] **Không đặt private key lên bastion** — dùng ProxyJump/SSM
- [ ] **Tắt SSH password auth** — chỉ dùng key (`PasswordAuthentication no`)
- [ ] **Đổi port SSH?** → Không nên! Security by obscurity. Dùng SG + fail2ban thay thế
- [ ] **Cài fail2ban** chặn brute-force SSH
- [ ] **2FA / MFA** cho SSH vào bastion (Google Authenticator PAM module)
- [ ] **Log + audit** — gửi `/var/log/secure` (hoặc `/var/log/auth.log`) về CloudWatch Logs / S3
- [ ] **Patch định kỳ** — dùng SSM Patch Manager
- [ ] **Bastion chỉ dùng đúng 1 việc** — không cài thêm công cụ không cần thiết
- [ ] **Auto-terminate** — bastion chỉ bật khi cần (cost saving, giảm attack surface)

### 5.2 Cấu hình sshd an toàn

```bash
# /etc/ssh/sshd_config — trên bastion
PasswordAuthentication no
PermitRootLogin no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
AllowUsers ec2-user admin
```

### 5.3 Cài fail2ban (Amazon Linux)

```bash
sudo dnf install -y fail2ban
sudo systemctl enable --now fail2ban

# Cấu hình: /etc/fail2ban/jail.local
[sshd]
enabled = true
maxretry = 5
bantime = 3600
```

---

## 6. Phương án thay thế hiện đại (Khuyến nghị mạnh)

### 6.1 AWS SSM Session Manager (Thay bastion hoàn toàn)

**SSM Session Manager** cho phép SSH vào instance **mà không cần mở port 22**, không cần bastion, không cần public IP:

```
Bạn → AWS Console / CLI → Systems Manager → Session Manager → EC2 (private subnet)
```

**Ưu điểm so với bastion:**

| Tiêu chí | Bastion Host | SSM Session Manager |
|---|---|---|
| Mở port 22 | Có | **Không cần** |
| Public IP | Cần | **Không cần** |
| Quản lý key | Quản lý SSH keys | **Dùng IAM** (mỗi user có role riêng) |
| Audit | Log SSH thủ công | **Log đầy đủ** (CloudTrail + Session logs vào S3) |
| MFA | Cấu hình thêm | **Tích hợp sẵn** với IAM |
| Chi phí | 1 EC2 luôn chạy | **0$** (chỉ tính SSM agent) |

**Điều kiện:**
1. Instance cài **SSM Agent** (Amazon Linux 2023/Ubuntu có sẵn hoặc cài thêm)
2. Instance có **IAM Instance Profile** với policy `AmazonSSMManagedInstanceCore`
3. Instance có route ra internet (NAT Gateway) hoặc dùng **VPC Endpoint** (Interface endpoint `com.amazonaws.region.ssm`, `ssmmessages`, `ec2messages`)

```bash
# SSH qua Session Manager (kết hợp AWS CLI)
aws ssm start-session --target i-xxxxx

# Hoặc dùng SSH chuẩn qua SSM (cấu hình ~/.ssh/config)
Host i-* mi-*
    ProxyCommand aws ssm start-session --target %h --port %p
# Sau đó: ssh i-xxxxx  ← SSH bình thường nhưng đi qua SSM
```

**VPC Endpoint cho SSM (không cần NAT):**
```text
- com.amazonaws.<region>.ssm
- com.amazonaws.<region>.ssmmessages
- com.amazonaws.<region>.ec2messages
```

### 6.2 Bastion với AWS Systems Manager + 1 lần dùng (ảo hóa bastion)

Dùng **SSM StartSession + Port Forwarding** để truy cập private instance mà không cần bastion vật lý:

```bash
# Port forward qua SSM: port local 8080 → port 3306 của RDS private
aws ssm start-session \
  --target i-xxxxx \
  --document-name AWS-StartPortForwardingSession \
  --parameters '{"portNumber":["3306"],"localPortNumber":["8080"]}'

# Giờ kết nối từ máy local:
mysql -h localhost -P 8080 -u admin -p
```

### 6.3 AWS Client VPN (cho team lớn)

Khi nhiều người cần truy cập, dùng **AWS Client VPN** (managed VPN):

- Mỗi nhân viên cài client, đăng nhập bằng **SAML + MFA** (tích hợp Okta/Azure AD)
- Vào thẳng private subnet — không cần bastion
- Chi phí theo số connection

### 6.4 Khi nào VẪN nên dùng bastion?

- Bạn cần **NAT/forward proxy** cho private subnet ra internet
- Ứng dụng **legacy yêu cầu SSH trực tiếp** (không dùng được SSM)
- Cần điểm để chạy **tool giám sát/migration** tạm thời (mysqldump, rsync)
- Team **chưa có SSM** hoặc instance không cài được agent

> **Kết luận:** Với project mới — **dùng SSM Session Manager** (an toàn + free + audit tốt). Bastion vẫn có giá trị cho nhu cầu đặc biệt, và là kiến thức **bắt buộc trong các kỳ thi AWS (SAA, SAP)**.

---

## 7. Xử lý sự cố (Troubleshooting)

| Vấn đề | Nguyên nhân | Cách xử lý |
|---|---|---|
| `Connection timed out` | SG không mở port 22 / sai IP | Kiểm tra inbound rule bastion SG; ping từ IP đúng |
| `Permission denied (publickey)` | Sai key / key không khớp | Kiểm tra `~/.ssh/` permission (600); key pair đúng |
| SSH vào private bị treo | Bastion không forward được / SG private chặn | Kiểm tra App-SG có source = Bastion-SG; thử `-vvv` |
| Agent forwarding không hoạt động | `-A` thiếu hoặc SSH agent không chạy | `eval $(ssh-agent)`; `ssh-add -l` kiểm tra key |
| Bastion chậm | Instance quá nhỏ / CPU credits hết | Nâng lên t3.small hoặc kiểm tra CloudWatch |
| Quên key bastion | Key pair mất | Dùng SSM session (nếu có agent) để vào sửa `authorized_keys` |
| 429 rate limit khi SSH | Brute-force tấn công | Bật fail2ban; giới hạn IP SG; dùng SSM thay thế |

### Debug SSH với verbose

```bash
ssh -vvv -J ec2-user@bastion-ip ec2-user@10.0.2.10
```

Output sẽ cho biết bước nào đang hỏng (DNS, kết nối, auth).

---

## 8. Câu hỏi phỏng vấn thường gặp

### Q1. Bastion host là gì? Tại sao cần?
Bastion host là máy chủ hardened đặt ở public subnet, là **cổng vào duy nhất** để SSH/RDP vào private subnet. Cần vì private instances không có public IP, giảm attack surface, tập trung kiểm soát/log/audit.

### Q2. Bastion và NAT Gateway khác nhau thế nào?
- **Bastion**: cho phép **inbound** truy cập từ ngoài vào (SSH vào private instances)
- **NAT Gateway**: cho phép **outbound** — private instances đi ra internet, nhưng **không** cho ai từ ngoài vào
- Nhiều người nhầm: bastion = "đi vào", NAT = "đi ra"

### Q3. Làm sao để SSH vào private subnet an toàn nhất?
Ba cách xếp theo độ an toàn:
1. **SSM Session Manager** — không cần port 22, IAM-based, audit đầy đủ
2. **ProxyJump qua bastion** — key không đặt trên bastion
3. Bastion + Agent Forwarding — tiện nhưng rủi ro nếu bastion bị hack

### Q4. Làm sao kiểm soát nhiều người dùng truy cập bastion?
- Mỗi người 1 **IAM user + SSH key riêng** (đặt public key vào `authorized_keys`)
- Hoặc dùng **SSM** — IAM quyết định ai vào được instance nào
- **MFA** bắt buộc khi login
- Log mọi session vào CloudWatch/S3

### Q5. Bastion single point of failure — xử lý thế nào?
- Chạy **2 bastion ở 2 AZ** + Route 53 health check
- Hoặc **Auto Scaling Group** với bastion AMI — bastion tự thay mới khi hỏng
- Hoặc bỏ hẳn bastion dùng **SSM**

### Q6. Bastion có cần public IP không?
Có — bastion phải có public IP (hoặc EIP) để admin SSH từ internet. Nếu chỉ truy cập qua VPN/PrivateLink thì không cần.

### Q7. Security Group của private instance nên mở port 22 cho ai?
Chỉ cho **security group của bastion** (source = sg-xxx), **KHÔNG** mở `0.0.0.0/0`.

### Q8. AWS exam (SAA) thường hỏi gì về bastion?
- Nhận diện kiến trúc bastion trong diagram
- So sánh bastion vs NAT vs VPN vs Direct Connect
- Làm sao **an toàn hóa** bastion (SG giới hạn IP, hardened, MFA)
- Khi nào dùng **SSM Session Manager thay bastion** (câu trả lời "đúng nhất" thường là SSM)

---

## 9. Tóm tắt nhanh

```
BASTION / JUMP HOST — Ý CHÍNH
├── Là gì?      Cổng vào duy nhất SSH vào private subnet
├── Đặt ở đâu?  Public subnet, có EIP, SG giới hạn IP
├── An toàn?    Hardened: key-only, MFA, fail2ban, log, patch
├── SSH kiểu gì? ProxyJump (-J) là an toàn nhất, không để key trên bastion
├── Thay thế?   SSM Session Manager (khuyến nghị), AWS Client VPN
└── Lưu ý exam? Bastion = inbound; NAT = outbound; SSM = không cần bastion
```
