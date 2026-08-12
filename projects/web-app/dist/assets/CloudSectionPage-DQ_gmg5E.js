import{C as e,N as t,S as n,T as r,g as i,h as a,j as o,n as s,p as c,u as l,y as u}from"./index-CYwTAEX9.js";import{t as d}from"./navigate-DtcTuuMM.js";import{t as f}from"./CTopbar-C48zRNtd.js";var p=[{id:`iam`,title:`1. IAM (Identity & Access Management)`,html:`<h3>IAM là gì?</h3>\r
      <p>IAM là dịch vụ quản lý danh tính và quyền truy cập AWS. Mọi thao tác với AWS API đều phải qua IAM authentication + authorization. <strong>IAM không phải là service-specific</strong> — nó áp dụng cho toàn bộ tài khoản AWS.</p>\r
\r
      <h3>IAM Components</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>👤 User</h4><p>Một người/vật thực thể. Có long-term credentials (password + access key). Khuyến nghị: 1 user = 1 người thật.</p></div>\r
        <div class="card"><h4>👥 Group</h4><p>Tập hợp users. Gán policy cho group thay vì từng user. Quản lý dễ hơn, ít trùng lặp.</p></div>\r
        <div class="card"><h4>🤖 Role</h4><p>Không gắn với user cụ thể. Được assume bởi users, services (EC2, Lambda), hoặc AWS accounts khác. Có temporary credentials (STS).</p></div>\r
        <div class="card"><h4>📜 Policy</h4><p>JSON document định nghĩa quyền (Allow/Deny) trên các resource. Gán vào User, Group, hoặc Role.</p>`},{id:`vpc`,title:`2. VPC (Virtual Private Cloud) & Networking`,html:`<h3>VPC là gì?</h3>\r
      <p>VPC là mạng ảo riêng trong AWS — <strong>logically isolated network</strong> trong tài khoản của bạn. Bạn tự định nghĩa IP range, subnets, route tables, gateways.</p>\r
\r
      <h3>VPC Architecture cơ bản</h3>\r
      <div class="diagram">\r
Internet ─→ Internet Gateway (IGW) ─→ Public Subnet ─→ EC2<br>\r
                                      │<br>\r
                                      └─→ NAT Gateway ─→ Private Subnet ─→ EC2/DB<br>\r
                                                            │<br>\r
                                                       VPC Peering / VPN / Direct Connect\r
      </div>\r
\r
      <h3>CIDR &amp; Subnets</h3>\r
      <pre><code>// VPC — 1 region, nhiều Availability Zones\r
VPC CIDR: 10.0.0.0/16 (65536 địa chỉ — AWS reserved 5 đầu mỗi subnet)\r
\r
// Public subnet — có route đến IGW\r
Public Subnet  10.0.1.0/24  (AZ: ap-southeast-1a) — Web servers, Load Balancers\r
Public Subnet  10.0.2.0/24  (AZ: ap-southeast-1b)\r
\r
// Private subnet — không có route đến IGW, ra internet qua NAT\r
Private Subnet 10.0.3.0/24  (AZ: ap-southeast-1a) — App servers\r
Private Subnet 10.0.4.0/24  (AZ: ap-southeast-1b)\r
\r
// Database subnet — private, chỉ app servers access\r
DB Subnet      10.0.5.0/24  (AZ: ap-southeast-1a) — RDS, ElastiCache\r
DB Subnet      10.0.6.0/24  (AZ: ap-southeast-1b)\r
</code></pre>\r
\r
      <h3>Security Groups vs NACL</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>🔒 Security Group (Stateful)</h4>\r
          <ul>\r
            <li>Stateful — allow inbound → tự động allow outbound response</li>\r
            <li>Chỉ có Allow rules (không Deny)</li>\r
            <li>Attach vào ENI (EC2, RDS, ELB)</li>\r
            <li>Reference SG khác: <code>sg-xxx</code></li>\r
            <li>Default: block all inbound, allow all outbound</li>\r
          </ul>\r
        </div>\r
        <div class="card"><h4>📋 NACL (Stateless)</h4>\r
          <ul>\r
            <li>Stateless — phải define cả inbound + outbound rules</li>\r
            <li>Có Allow + Deny rules (đánh số, số nhỏ ưu tiên hơn)</li>\r
            <li>Attach vào Subnet (affect all instances trong subnet)</li>\r
            <li>Chỉ reference IP/CIDR, không reference SG</li>\r
            <li>Dùng để deny list (block IP cụ thể)</li>\r
          </ul>`},{id:`ec2`,title:`3. EC2 & Auto Scaling`,html:`<h3>EC2 Instance Types &amp; Families</h3>\r
      <div class="grid-3">\r
        <div class="card"><h4>⚡ General Purpose (T3, M7g)</h4><p>Web servers, small DB, dev/test. T3 burstable (CPU credits). M7g: Graviton3 ARM, 20% rẻ hơn Intel.</p></div>\r
        <div class="card"><h4>🔬 Compute Optimized (C7g)</h4><p>Batch processing, gaming, HPC, CI/CD runners. Giá/vCPU thấp nhất. Graviton3 cho performance cao.</p></div>\r
        <div class="card"><h4>📦 Memory Optimized (R7g, X2iedn)</h4><p>In-memory caches (Redis), large DB, real-time analytics. X2iedn: up to 4TB RAM/instance.</p>`},{id:`lambda`,title:`4. Lambda & Serverless`,html:`<h3>Lambda là gì?</h3>\r
      <p>Function-as-a-Service (FaaS) — chạy code không cần quản lý server. AWS quản lý infrastructure, auto-scale từ 0 đến hàng ngàn concurrent executions. <strong>Chỉ trả tiền khi code chạy</strong> (per request + compute duration).</p>\r
\r
      <h3>Lambda Execution Model</h3>\r
      <div class="diagram">\r
Event Source (S3, SQS, API GW, DynamoDB Streams, EventBridge, ...)<br>\r
         ↓<br>\r
Lambda Service → Cold Start (nếu chưa có warm container)<br>\r
                    ↓<br>\r
                 Execution Environment (sandbox)<br>\r
                    ↓<br>\r
         Handler được gọi với event + context<br>\r
         ├── /tmp: 512 MB – 10 GB (ephemeral storage)<br>\r
         └── environment variables (4 KB max, encrypted với KMS)\r
      </div>\r
\r
      <h3>Lambda với API Gateway (REST API)</h3>\r
      <pre><code>// handler.mjs\r
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';\r
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';\r
\r
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));\r
\r
export const handler = async (event) => {\r
  const headers = {\r
    'Content-Type': 'application/json',\r
    'Access-Control-Allow-Origin': '*',   // CORS\r
  };\r
\r
  try {\r
    switch (event.httpMethod) {\r
      case 'GET': {\r
        const { id } = event.pathParameters || {};\r
        if (!id) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing id' }) };\r
\r
        const { Item } = await ddb.send(new GetCommand({\r
          TableName: process.env.TABLE_NAME,\r
          Key: { pk: id },\r
        }));\r
        return {\r
          statusCode: Item ? 200 : 404,\r
          headers,\r
          body: JSON.stringify(Item ?? { error: 'Not found' }),\r
        };\r
      }\r
\r
      case 'POST': {\r
        const body = JSON.parse(event.body || '{}');\r
        const item = { pk: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() };\r
        await ddb.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }));\r
        return { statusCode: 201, headers, body: JSON.stringify(item) };\r
      }\r
\r
      default:\r
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };\r
    }\r
  } catch (err) {\r
    console.error('Error:', err);\r
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };\r
  }\r
};\r
</code></pre>\r
\r
      <h3>Lambda Layers — Dependencies</h3>\r
      <pre><code>// Layer = ZIP chứa node_modules, Python packages, hoặc runtime extensions\r
// Giảm deployment package size, share dependencies giữa nhiều functions\r
\r
// Cấu trúc layer:\r
// layer.zip\r
// └── nodejs/\r
//     └── node_modules/\r
//         ├── uuid/\r
//         ├── aws-sdk/       (trừ aws-sdk v3 — đã có sẵn trong runtime)\r
//         └── ...\r
\r
// Gắn tối đa 5 layers / function (tổng ~250 MB giải nén)\r
// Layer version là immutable — tạo version mới khi cập nhật\r
</code></pre>\r
\r
      <h3>Event Source Mappings</h3>\r
      <pre><code>// Lambda poll SQS / DynamoDB Streams / Kinesis — không cần code poll\r
\r
// SQS — batching & partial batch response\r
export const handler = async (event) => {\r
  const failedIds = [];\r
  for (const record of event.Records) {\r
    try {\r
      await processMessage(JSON.parse(record.body));\r
    } catch (err) {\r
      console.error('Failed:', record.messageId, err);\r
      failedIds.push(record.messageId);\r
    }\r
  }\r
  // Report batch item failures — chỉ những message failed mới xuất hiện lại\r
  return { batchItemFailures: failedIds.map(id => ({ itemIdentifier: id })) };\r
};\r
\r
// Cấu hình mapping:\r
// - Batch size: 1–10 (SQS), tối đa 10000 (Kinesis/DynamoDB Streams)\r
// - Maximum batching window: 0–300s\r
// - Concurrency: Reserved concurrency (tránh throttling)\r
// - DLQ: cho event không xử lý được sau max retries\r
</code></pre>\r
\r
      <h3>Lambda Power Tuning</h3>\r
      <pre><code>// Memory: 128 MB – 10,240 MB (1 MB steps)\r
// CPU tỉ lệ với memory — 1769 MB = 1 vCPU, 3538 MB = 2 vCPU, ...\r
// Network bandwidth cũng tăng theo memory\r
\r
// Cost optimization: tăng memory → giảm duration\r
// Test: 128 MB → 3s (cost 128 × 3 = 384) vs 1024 MB → 0.4s (cost 1024 × 0.4 = 409)\r
\r
// → Dùng AWS Lambda Power Tuning (Step Functions state machine) để tìm optimal memory\r
// → Thường optimal ở 1024–2048 MB cho Node.js/Python, 2048+ cho Java\r
</code></pre>\r
\r
      <h3>Lambda Best Practices</h3>\r
      <ul>\r
        <li><strong>Cold Start:</strong> Java/.NET cold start ~1-5s, Node.js/Python/Go ~100-300ms. Dùng <strong>Provisioned Concurrency</strong> cho latency-critical apps</li>\r
        <li><strong>Execution Timeout:</strong> tối đa 15 ph (900s). Workflow >15 ph → Step Functions + Lambda</li>\r
        <li><strong>Environment Variables:</strong> dùng cho config (stage, table name). Secrets → Secrets Manager, Parameter Store (SecureString)</li>\r
        <li><strong>Stateless:</strong> không lưu state trong memory giữa các invocations. /tmp tồn tại giữa các warm starts</li>\r
        <li><strong>VPC Lambda:</strong> cần ENI trong VPC → cold start lâu hơn, tốn IP. Chỉ đặt Lambda trong VPC khi cần truy cập RDS/ElastiCache</li>\r
        <li><strong>Dead Letter Queue (DLQ):</strong> bắt event failed sau max retries. Dùng SQS hoặc SNS</li>\r
        <li><strong>Reserved Concurrency:</strong> tránh một function "ăn" hết account concurrency limit (1000/region)</li>\r
      </ul>`},{id:`ecs`,title:`5. ECS & Container Orchestration`,html:`<h3>ECS là gì?</h3>\r
      <p>Amazon Elastic Container Service — orchestration cho Docker containers. Có 2 launch types: <strong>Fargate</strong> (serverless — không quản lý server) và <strong>EC2</strong> (tự quản cluster).</p>\r
\r
      <h3>ECS Architecture</h3>\r
      <div class="diagram">\r
                     ┌─→ Target Group ─→ Service ─→ Task (Fargate/EC2)<br>\r
      ALB / NLB ────┤<br>\r
                     └─→ Target Group ─→ Service ─→ Task<br>\r
                                                    │<br>\r
                                               Task Definition<br>\r
                                               ├── container image (ECR)<br>\r
                                               ├── port mapping<br>\r
                                               ├── env vars / secrets<br>\r
                                               ├── resource (CPU, memory)<br>\r
                                               └── IAM Task Role\r
      </div>\r
\r
      <h3>Task Definition (ví dụ)</h3>\r
      <pre><code>// task-definition.json — JSON format\r
{\r
  "family": "my-app",\r
  "taskRoleArn": "arn:aws:iam::xxx:role/ecsTaskRole",\r
  "executionRoleArn": "arn:aws:iam::xxx:role/ecsExecutionRole",\r
  "networkMode": "awsvpc",        // Fargate bắt buộc\r
  "requiresCompatibilities": ["FARGATE"],\r
  "cpu": "512",                   // 0.5 vCPU (256=0.25, 512=0.5, 1024=1, 2048=2, 4096=4)\r
  "memory": "1024",               // MB\r
  "containerDefinitions": [{\r
    "name": "app",\r
    "image": "xxx.dkr.ecr.ap-southeast-1.amazonaws.com/my-app:latest",\r
    "portMappings": [{ "containerPort": 3000, "protocol": "tcp" }],\r
    "environment": [\r
      { "name": "NODE_ENV", "value": "production" }\r
    ],\r
    "secrets": [\r
      { "name": "DB_PASSWORD", "valueFrom": "arn:aws:ssm:...:parameter/prod/db/password" }\r
    ],\r
    "logConfiguration": {\r
      "logDriver": "awslogs",\r
      "options": {\r
        "awslogs-group": "/ecs/my-app",\r
        "awslogs-region": "ap-southeast-1",\r
        "awslogs-stream-prefix": "ecs"\r
      }\r
    },\r
    "healthCheck": {\r
      "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],\r
      "interval": 30,\r
      "timeout": 5,\r
      "retries": 3,\r
      "startPeriod": 60\r
    }\r
  }]\r
}</code></pre>\r
\r
      <h3>ECS Service với ALB</h3>\r
      <pre><code>// Service = long-running tasks (web app, worker)\r
// - Số lượng desired tasks\r
// - Gắn với ALB Target Group\r
// - Auto-recovery: ECS restart task nếu health check fail\r
// - Deployment: Rolling update hoặc Blue/Green (CodeDeploy)\r
\r
// Deploy mới với rolling update:\r
aws ecs update-service \\\r
  --cluster prod \\\r
  --service web \\\r
  --force-new-deployment \\\r
  --deployment-configuration '{\r
    "deploymentCircuitBreaker": {"enable": true, "rollback": true},\r
    "maximumPercent": 200,\r
    "minimumHealthyPercent": 100\r
  }'\r
\r
// deploymentCircuitBreaker — tự động rollback nếu deployment thất bại\r
</code></pre>\r
\r
      <h3>ECS vs EKS vs Lambda</h3>\r
      <div class="grid-3">\r
        <div class="card"><h4>🐳 ECS (Fargate)</h4><p>Serverless container. AWS quản lý control plane. Không cần quản lý cluster nodes. Tích hợp sâu AWS (ALB, CloudWatch, IAM). Đơn giản nhất.</p></div>\r
        <div class="card"><h4>☸️ EKS (Kubernetes)</h4><p>Managed K8s — chuẩn CNCF. Portable (chạy on-prem, multi-cloud). Phức tạp hơn nhưng flexible hơn. Cần quản lý worker nodes (self-managed hoặc Fargate).</p></div>\r
        <div class="card"><h4>⚡ Lambda</h4><p>FaaS — event-driven. Tối đa 15 ph execution. Cold start. Phù hợp: API, event processing, cron jobs. Không phù hợp: long-running, WebSocket, large containers.</p>`},{id:`s3`,title:`6. S3 (Simple Storage Service)`,html:`<h3>S3 là gì?</h3>\r
      <p>S3 là object storage — lưu trữ <strong>unlimited objects</strong> (0 byte – 5 TB). <strong>99.999999999% durability</strong> (11 9's). Dữ liệu replicated qua ít nhất 3 AZ trong region.</p>\r
\r
      <h3>S3 Storage Classes</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>⚡ S3 Standard</h4><p>Frequent access, low latency. 99.99% availability. $0.023/GB. Cho web app, big data analytics.</p></div>\r
        <div class="card"><h4>📉 S3 Intelligent-Tiering</h4><p>Tự động di chuyển objects giữa tiers dựa trên access pattern. $0.0025/1000 objects monitoring fee. Cho data access pattern khó đoán.</p></div>\r
        <div class="card"><h4>❄️ S3 Glacier (Instant/Flexible/Deep Archive)</h4><p>Archive — rẻ nhất $0.001/GB. Deep Archive: restore 12h. Cho backup, compliance.</p></div>\r
        <div class="card"><h4>🗄️ S3 One Zone-IA</h4><p>Chỉ 1 AZ, rẻ hơn Standard-IA 20%. Cho non-critical / reproducible data.</p>`},{id:`rds`,title:`7. RDS & DynamoDB`,html:`<h3>RDS — Relational Databases</h3>\r
      <p>Managed DB: <strong>Aurora, PostgreSQL, MySQL, MariaDB, SQL Server, Oracle</strong>. AWS quản lý: OS patching, backup, replication, failover.</p>\r
\r
      <h3>RDS Multi-AZ &amp; Read Replicas</h3>\r
      <div class="diagram">\r
Multi-AZ (HA):<br>\r
Primary (AZ-a) ↔ Standby (AZ-b) — synchronous replication<br>\r
                   ↓ auto failover (DNS CNAME switch, ~60-120s)<br>\r
                   CNAME luôn trỏ về primary<br><br>\r
Read Replicas (performance):<br>\r
Primary → Read Replica 1 (AZ-b) — async replication<br>\r
        → Read Replica 2 (region 2) — cross-region<br>\r
        → Read Replica 3 (region 3) — DR\r
      </div>\r
      <pre><code>// Tạo read replica — zero downtime cho primary\r
aws rds create-db-instance-read-replica \\\r
  --db-instance-identifier mydb-replica \\\r
  --source-db-instance-identifier mydb \\\r
  --region ap-southeast-1\r
\r
// Promote to standalone (cho DR / migration)\r
aws rds promote-read-replica --db-instance-identifier mydb-replica\r
</code></pre>\r
\r
      <h3>RDS Backup &amp; Restore</h3>\r
      <pre><code>// Automated backup — mặc định 7 ngày (tối đa 35)\r
// - Transaction logs: 5 phút → point-in-time recovery\r
// - Backup window: chọn giờ thấp tải\r
\r
// Manual snapshot — không tự động xóa\r
aws rds create-db-snapshot \\\r
  --db-instance-identifier mydb \\\r
  --db-snapshot-identifier mydb-pre-upgrade\r
\r
// Restore — tạo instance mới từ snapshot\r
aws rds restore-db-instance-from-db-snapshot \\\r
  --db-instance-identifier mydb-restored \\\r
  --db-snapshot-identifier mydb-pre-upgrade\r
</code></pre>\r
\r
      <h3>RDS Proxy</h3>\r
      <pre><code>// Connection pooling cho Lambda & ECS\r
// - Giảm connection churn (không tạo/destroy connection mỗi request)\r
// - IAM authentication — không cần DB password trong code\r
// - Failover: transparent — connections không bị drop khi DB failover\r
\r
aws rds create-db-proxy \\\r
  --db-proxy-name myproxy \\\r
  --engine-family POSTGRESQL \\\r
  --auth '[{\r
    " AuthScheme": "SECRETS",\r
    "SecretArn": "arn:aws:secretsmanager:...:secret:/prod/db",\r
    "IAMAuth": "REQUIRED"\r
  }]' \\\r
  --vpc-subnet-ids subnet-xxx subnet-yyy\r
</code></pre>\r
\r
      <h3>DynamoDB — NoSQL Key-Value &amp; Document</h3>\r
      <p>Managed NoSQL — <strong>single-digit millisecond</strong> latency ở bất kỳ scale nào. Auto-scaling, multi-AZ, DAX (in-memory cache).</p>\r
\r
      <h3>DynamoDB Table Design</h3>\r
      <pre><code>// Single Table Design — 1 bảng cho nhiều entity types\r
// Partition Key (PK) + Sort Key (SK) + Global Secondary Index (GSI)\r
\r
// Ví dụ: E-commerce app\r
// PK              SK                      Data\r
// USER#alice      PROFILE                 { name:"Alice", email, ... }\r
// USER#alice      ORDER#2024-01-01#001    { total: 50, items: [...] }\r
// USER#bob        PROFILE                 { name:"Bob", ... }\r
// PRODUCT#kindle  META                    { title:"Kindle", price:99, ... }\r
\r
// GSI1: PK=SK, SK=GSI1PK — query theo pattern khác\r
// GSI1PK = ORDER#2024-01-01#001  → Query đơn hàng theo order ID\r
// GSI2PK = STATUS#shipped         → Query all shipped orders\r
</code></pre>\r
\r
      <h3>DynamoDB Operations</h3>\r
      <pre><code>// Write\r
await ddb.send(new PutCommand({\r
  TableName: 'Orders',\r
  Item: {\r
    pk: 'USER#alice',\r
    sk: 'ORDER#001',\r
    total: 50,\r
    status: 'PENDING',\r
    items: [{ productId: 'kindle', qty: 1, price: 50 }],\r
  },\r
  ConditionExpression: 'attribute_not_exists(pk)',  // Chỉ tạo nếu chưa tồn tại\r
}));\r
\r
// Read — 2 loại: GetItem (1 item theo PK+SK), Query (nhiều items)\r
const { Items } = await ddb.send(new QueryCommand({\r
  TableName: 'Orders',\r
  KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',\r
  ExpressionAttributeValues: {\r
    ':pk': 'USER#alice',\r
    ':prefix': 'ORDER#',\r
  },\r
  Limit: 10,\r
  ScanIndexForward: false,  // DESC theo SK\r
}));\r
\r
// Transaction — ACID cross items\r
await ddb.send(new TransactWriteCommand({\r
  TransactItems: [\r
    { Put: { TableName: 'Orders', Item: order } },\r
    { Update: {\r
        TableName: 'Products',\r
        Key: { pk: 'PRODUCT#kindle', sk: 'META' },\r
        UpdateExpression: 'SET stock = stock - :qty',\r
        ConditionExpression: 'stock >= :qty',\r
      }\r
    }\r
  ]\r
}));\r
</code></pre>\r
\r
      <h3>DynamoDB Streams &amp; TTL</h3>\r
      <pre><code>// Streams — ghi lại thay đổi (INSERT, MODIFY, REMOVE) trong 24h\r
// Trigger Lambda để: sync sang OpenSearch, update cache, analytics\r
\r
// TTL (Time To Live) — tự động xóa item sau timestamp\r
// - Dùng cho session, event, log expiration\r
// - Item bị xóa trong ~48h sau TTL (miễn phí)\r
// - Item xóa vẫn ghi vào Streams\r
\r
aws dynamodb update-time-to-live \\\r
  --table-name Sessions \\\r
  --time-to-live-specification "Enabled=true, AttributeName=ttl"\r
</code></pre>\r
\r
      <h3>RDS vs DynamoDB — chọn cái nào?</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>🗄️ RDS (SQL)</h4>\r
          <ul>\r
            <li>Dữ liệu có quan hệ (JOIN, FK)</li>\r
            <li>Complex queries, aggregations, transactions</li>\r
            <li>Schema fixed, cần migration</li>\r
            <li>Ví dụ: ERP, CRM, accounting</li>\r
          </ul>\r
        </div>\r
        <div class="card"><h4>📊 DynamoDB (NoSQL)</h4>\r
          <ul>\r
            <li>Key-value access pattern, high scale</li>\r
            <li>Single-digit ms ở mọi scale</li>\r
            <li>Schema-less, denormalized</li>\r
            <li>Ví dụ: user session, shopping cart, IoT, gaming leaderboard</li>\r
          </ul>`},{id:`cicd`,title:`8. CodePipeline & DevOps`,html:`<h3>CI/CD trên AWS</h3>\r
      <p>AWS cung cấp CI/CD stack: <strong>CodeCommit</strong> (Git), <strong>CodeBuild</strong> (build/test), <strong>CodeDeploy</strong> (deploy), <strong>CodePipeline</strong> (orchestration). Hoặc dùng GitHub + Jenkins + ArgoCD truyền thống.</p>\r
\r
      <h3>CodePipeline — Pipeline CI/CD</h3>\r
      <div class="diagram">\r
Source Stage → Build Stage → Deploy Stage → Approval → Production<br>\r
  ├── GitHub / CodeCommit    ├── CodeBuild    ├── CodeDeploy (EC2/ECS/Lambda)<br>\r
  ├── S3                     ├── Jenkins      ├── ECS (Blue/Green)<br>\r
  └── ECR                    └── ...          └── CloudFormation / CDK\r
      </div>\r
\r
      <pre><code>// pipeline.yml — CloudFormation\r
Resources:\r
  AppPipeline:\r
    Type: AWS::CodePipeline::Pipeline\r
    Properties:\r
      RoleArn: !GetAtt PipelineRole.Arn\r
      Stages:\r
        - Name: Source\r
          Actions:\r
            - Name: GitHubSource\r
              ActionTypeId: { Category: Source, Owner: ThirdParty, Provider: GitHub, Version: 1 }\r
              Configuration:\r
                Owner: my-org\r
                Repo: my-app\r
                Branch: main\r
                PollForSourceChanges: false\r
              OutputArtifacts:\r
                - Name: source-code\r
\r
        - Name: Build\r
          Actions:\r
            - Name: CodeBuild\r
              ActionTypeId: { Category: Build, Owner: AWS, Provider: CodeBuild, Version: 1 }\r
              Configuration: { ProjectName: !Ref BuildProject }\r
              InputArtifacts:\r
                - Name: source-code\r
              OutputArtifacts:\r
                - Name: built-artifact\r
\r
        - Name: DeployStaging\r
          Actions:\r
            - Name: DeployECS\r
              ActionTypeId: { Category: Deploy, Owner: AWS, Provider: ECS, Version: 1 }\r
              Configuration:\r
                ClusterName: staging\r
                ServiceName: web\r
                FileName: imagedefinitions.json\r
              InputArtifacts:\r
                - Name: built-artifact\r
\r
        - Name: Approval\r
          Actions:\r
            - Name: ManualApproval\r
              ActionTypeId: { Category: Approval, Owner: AWS, Provider: Manual, Version: 1 }\r
\r
        - Name: DeployProd\r
          Actions:\r
            - Name: DeployECSProd\r
              ActionTypeId: { Category: Deploy, Owner: AWS, Provider: CodeDeploy, Version: 1 }\r
              Configuration:\r
                ApplicationName: prod-web\r
                DeploymentGroupName: ecs-bluegreen\r
              InputArtifacts:\r
                - Name: built-artifact\r
</code></pre>\r
\r
      <h3>CodeBuild — Build &amp; Test</h3>\r
      <pre><code># buildspec.yml\r
version: 0.2\r
\r
phases:\r
  install:\r
    runtime-versions:\r
      nodejs: 20\r
    commands:\r
      - npm ci\r
  pre_build:\r
    commands:\r
      - npm run lint\r
      - npm run test -- --coverage\r
  build:\r
    commands:\r
      - npm run build\r
      - docker build -t $REPOSITORY_URI:latest .\r
  post_build:\r
    commands:\r
      - aws ecr get-login-password | docker login --username AWS --password-stdin $REPOSITORY_URI\r
      - docker push $REPOSITORY_URI:latest\r
      - printf '[{"name":"app","imageUri":"%s"}]' $REPOSITORY_URI:latest > imagedefinitions.json\r
\r
artifacts:\r
  files: imagedefinitions.json\r
  discard-paths: yes\r
</code></pre>\r
\r
      <h3>CodeDeploy — ECS Blue/Green</h3>\r
      <pre><code># appspec.yaml — CodeDeploy ECS\r
version: 0.0\r
Resources:\r
  - TargetService:\r
      Type: AWS::ECS::Service\r
      Properties:\r
        TaskDefinition: "arn:aws:ecs:...:task-definition/my-app:123"\r
        LoadBalancerInfo:\r
          ContainerName: "app"\r
          ContainerPort: 3000\r
\r
# Blue/Green deployment flow:\r
# 1. CodeDeploy tạo Task Set mới (Green) bên cạnh Blue\r
# 2. Route % traffic đến Green (canary: 10% trong 5 ph)\r
# 3. Monitor CloudWatch alarms\r
# 4. Chuyển 100% traffic → Green → terminate Blue\r
# 5. Rollback: chuyển lại traffic về Blue (nếu alarm)\r
\r
Hooks:\r
  - BeforeInstall: Lambda để run DB migration\r
  - AfterAllowTraffic: Lambda để smoke test\r
</code></pre>\r
\r
      <h3>CloudFormation &amp; CDK — Infrastructure as Code</h3>\r
      <pre><code>// CloudFormation — YAML/JSON template\r
// CDK (Cloud Development Kit) — TypeScript/Python/Java code → CloudFormation\r
\r
// CDK — TypeScript example\r
import * as ecs from 'aws-cdk-lib/aws-ecs';\r
import * as ec2 from 'aws-cdk-lib/aws-ec2';\r
\r
export class AppStack extends Stack {\r
  constructor(scope: Construct, id: string, props?: StackProps) {\r
    super(scope, id, props);\r
\r
    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });\r
\r
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });\r
\r
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {\r
      cpu: 256,\r
      memoryLimitMiB: 512,\r
    });\r
\r
    taskDef.addContainer('app', {\r
      image: ecs.ContainerImage.fromAsset('./app'),\r
      portMappings: [{ containerPort: 3000 }],\r
      environment: { NODE_ENV: 'production' },\r
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'ecs', logRetention: 7 }),\r
    });\r
\r
    new ecs.FargateService(this, 'Service', {\r
      cluster,\r
      taskDefinition: taskDef,\r
      desiredCount: 2,\r
      assignPublicIp: true,\r
    });\r
  }\r
}\r
</code></pre>\r
\r
      <h3>CI/CD Best Practices</h3>\r
      <ul>\r
        <li><strong>Build artifact duy nhất</strong> — build 1 lần, deploy qua các môi trường (tránh rebuild mỗi stage)</li>\r
        <li><strong>Immutable infrastructure</strong> — tạo AMI mới / container image mới mỗi deploy. Không SSH vào server patch</li>\r
        <li><strong>Canary / Blue-Green</strong> — giảm blast radius. Dùng CodeDeploy deployment config</li>\r
        <li><strong>Automated rollback</strong> — CloudWatch alarm + deployment circuit breaker</li>\r
        <li><strong>Secret management</strong> — không hardcode secret trong buildspec. Dùng Parameter Store / Secrets Manager</li>\r
        <li><strong>Artifact storage</strong> — lưu artifacts trong S3, có version và lifecycle policy</li>\r
      </ul>`},{id:`arch`,title:`9. Architecture & Best Practices`,html:`<h3>Serverless Web Application</h3>\r
      <div class="diagram">\r
CloudFront (CDN) ─→ S3 (static files)<br>\r
         │<br>\r
    API Gateway (REST / HTTP API)<br>\r
         │<br>\r
    Lambda (business logic)<br>\r
         ├── DynamoDB (NoSQL)<br>\r
         ├── S3 (file upload)<br>\r
         ├── SQS (async tasks)<br>\r
         └── SES (email)<br>\r
         │<br>\r
    Cognito (authentication)<br>\r
    ─────────────────────────────────<br>\r
    Pros: zero server management, auto-scale, pay-per-use<br>\r
    Cons: cold start (3-5s cho Java, ~200ms cho Node.js), 15 ph timeout\r
      </div>\r
\r
      <h3>Microservices on ECS Fargate</h3>\r
      <div class="diagram">\r
Route 53 ─→ CloudFront ─→ ALB (public)<br>\r
                            ├── /api/users/* ─→ ECS Service (user-svc) ─→ RDS Aurora<br>\r
                            ├── /api/orders/* ─→ ECS Service (order-svc) ─→ DynamoDB<br>\r
                            └── /api/* ─→ ECS Service (gateway) ─→ SQS ─→ Worker Service<br>\r
                                                                         ├── S3<br>\r
                                                                         └── SES<br>\r
Service Mesh: App Mesh (Envoy sidecar) — mTLS, tracing, retry<br>\r
Observability: CloudWatch Logs + X-Ray + Prometheus + Grafana\r
      </div>\r
\r
      <h3>Disaster Recovery Strategies</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>🔄 Backup &amp; Restore (RTO: 24h, RPO: 24h)</h4><p>Rẻ nhất. Daily backup S3 → Glacier. Khi disaster: restore to new region. Phù hợp: non-critical systems.</p></div>\r
        <div class="card"><h4>🌊 Pilot Light (RTO: ~30m, RPO: ~15m)</h4><p>Replicate data (RDS cross-region replica, S3 CRR). Core services chạy minimal. Khi disaster: scale up.</p></div>\r
        <div class="card"><h4>📋 Warm Standby (RTO: ~5m, RPO: ~5m)</h4><p>Full-scale replica chạy ở region phụ. Route 53 failover routing. Tốn gấp đôi cost.</p></div>\r
        <div class="card"><h4>🏃 Active-Active (RTO: ~0, RPO: ~0)</h4><p>Multi-region, cả hai đều serve traffic. Route 53 latency/weighted routing. RDS Aurora Global Database. Đắt nhất.</p>`},{id:`bastion`,title:`10. Bastion & Jump Host`,html:`<h3>Bastion Host là gì?</h3>\r
      <p><strong>Bastion Host</strong> (Jump Host / Jump Box) là máy chủ hardened đặt ở <strong>public subnet</strong>, là <strong>cổng vào duy nhất (single entry point)</strong> để SSH/RDP vào các máy trong <strong>private subnet</strong> — nơi không có public IP.</p>\r
\r
      <div class="diagram">\r
        Internet ──SSH:22──▶ [ BASTION ] ──SSH──▶ [ App 10.0.1.10 ]<br />\r
        (chỉ từ IP của bạn)  Public subnet      │ [ DB  10.0.1.20 ]<br />\r
                                             Private subnet (không public IP)\r
      </div>\r
\r
      <h3>Bastion vs Jump Host</h3>\r
      <p>Hai thuật ngữ <strong>dùng thay thế được</strong>. Bastion nhấn mạnh tính <em>bảo mật</em> (hardened, 2FA, audit), Jump Host nhấn mạnh chức năng <em>trung chuyển</em>.</p>\r
\r
      <h3>Vì sao cần?</h3>\r
      <ul>\r
        <li><strong>Private subnet không có public IP</strong> — không SSH trực tiếp từ internet được</li>\r
        <li><strong>Giảm attack surface</strong> — chỉ 1 máy lộ ra internet, không phải tất cả</li>\r
        <li><strong>Kiểm soát tập trung</strong> — 1 điểm duy nhất để log, audit, giám sát truy cập</li>\r
        <li><strong>Security Group gọn</strong> — private instance chỉ mở port 22 từ bastion SG</li>\r
        <li><strong>Compliance</strong> — biết chính xác ai vào hệ thống lúc nào</li>\r
      </ul>\r
\r
      <h3>Kiến trúc + Security Group chuẩn</h3>\r
      <pre><code>VPC (10.0.0.0/16)\r
├── Public Subnet 10.0.1.0/24 → IGW + Bastion (EIP) + NAT Gateway\r
└── Private Subnet 10.0.2.0/24 → App + DB\r
\r
Bastion-SG (inbound): SSH 22 ← Chỉ IP công ty/VPn (VD 203.0.113.5/32)\r
App-SG (inbound):     SSH 22 ← source = Bastion-SG (không phải 0.0.0.0/0!)\r
DB-SG (inbound):      MySQL 3306 ← source = App-SG</code></pre>\r
      <p><strong>Nguyên tắc vàng:</strong> private instance KHÔNG BAO GIỜ mở port 22 cho <code>0.0.0.0/0</code> — chỉ mở cho security group của bastion.</p>\r
\r
      <h3>3 cách SSH qua Bastion</h3>\r
      <h4>1. SSH Agent Forwarding (tiện, rủi ro hơn)</h4>\r
      <pre><code>ssh-add ~/.ssh/my-key.pem          # thêm key vào agent (local)\r
ssh -A ec2-user@bastion-ip        # -A = agent forwarding\r
ssh ec2-user@10.0.2.10            # từ bastion SSH tiếp (mượn key local)</code></pre>\r
      <p>⚠️ Mọi tiến trình trên bastion có thể mượn key của bạn — chỉ dùng khi bastion cực tin cậy, thêm <code>ssh-add -t 3600</code> (key hết hạn sau 1h).</p>\r
\r
      <h4>2. ProxyJump — an toàn nhất (khuyến nghị)</h4>\r
      <p>Key <strong>không đặt trên bastion</strong>, máy local tự đi qua bastion tới đích.</p>\r
      <pre><code># 1 lần\r
ssh -J ec2-user@bastion-ip ec2-user@10.0.2.10\r
\r
# ~/.ssh/config — dùng lâu dài\r
Host bastion\r
    HostName 203.0.113.5\r
    User ec2-user\r
    IdentityFile ~/.ssh/aws-bastion.pem\r
\r
Host 10.0.2.*\r
    User ec2-user\r
    IdentityFile ~/.ssh/aws-app.pem\r
    ProxyJump bastion\r
# Sau đó chỉ cần: ssh 10.0.2.10</code></pre>\r
\r
      <h4>3. SCP / SFTP qua bastion</h4>\r
      <pre><code>scp -o ProxyJump=ec2-user@bastion-ip ./file.txt ec2-user@10.0.2.10:/tmp/\r
sftp -J ec2-user@bastion-ip ec2-user@10.0.2.10</code></pre>\r
\r
      <h3>Bảo mật — Checklist</h3>\r
      <ul>\r
        <li>SG chỉ mở SSH từ IP của bạn — <strong>không bao giờ</strong> <code>0.0.0.0/0</code></li>\r
        <li>Dùng key riêng cho bastion, tắt password auth (<code>PasswordAuthentication no</code>)</li>\r
        <li><strong>Không đặt private key lên bastion</strong> — dùng ProxyJump / SSM</li>\r
        <li>Cài <strong>fail2ban</strong> chống brute-force + giới hạn MaxAuthTries</li>\r
        <li><strong>MFA</strong> cho SSH (Google Authenticator PAM)</li>\r
        <li>Log SSH → <strong>CloudWatch Logs / S3</strong> để audit</li>\r
        <li>Patch định kỳ bằng <strong>SSM Patch Manager</strong></li>\r
        <li>Bastion chỉ làm đúng 1 việc — không cài tool thừa</li>\r
      </ul>\r
\r
      <h3>Thay thế hiện đại: SSM Session Manager (khuyến nghị)</h3>\r
      <p>SSH vào private instance <strong>không cần bastion, không mở port 22, không public IP</strong>. Dùng IAM thay vì SSH keys, log đầy đủ, tích hợp MFA, chi phí 0$.</p>\r
      <pre><code># Điều kiện: SSM agent + IAM role (AmazonSSMManagedInstanceCore) + route/NAT hoặc VPC Endpoint\r
aws ssm start-session --target i-xxxxx\r
\r
# Port forward qua SSM — truy cập RDS private không cần bastion\r
aws ssm start-session --target i-xxxxx \\\r
  --document-name AWS-StartPortForwardingSession \\\r
  --parameters '{"portNumber":["3306"],"localPortNumber":["8080"]}'\r
mysql -h localhost -P 8080 -u admin -p</code></pre>\r
\r
      <h3>Bastion vs NAT Gateway — đừng nhầm!</h3>\r
      <div class="grid-2">\r
        <div class="card"><h4>🛡️ Bastion Host</h4><p><strong>Inbound</strong> — cho người từ ngoài SSH vào private subnet. Cần public IP, SG hẹp.</p></div>\r
        <div class="card"><h4>🌐 NAT Gateway</h4><p><strong>Outbound</strong> — cho private instances đi ra internet. Không cho ai vào từ ngoài.</p>`}],m={name:`CloudSectionPage`,components:{CTopbar:f},data(){return{cloudSections:p}},computed:{currentId(){return this.$route.params.sectionId},current(){return this.cloudSections.find(e=>e.id===this.currentId)||null},currentIndex(){return this.cloudSections.findIndex(e=>e.id===this.currentId)},prev(){let e=this.currentIndex;return e>0?this.cloudSections[e-1]:null},next(){let e=this.currentIndex;return e>=0&&e<this.cloudSections.length-1?this.cloudSections[e+1]:null},prevTitle(){return this.prev?this.prev.title.replace(/^\d+\.\s*/,``):``},nextTitle(){return this.next?this.next.title.replace(/^\d+\.\s*/,``):``}},mounted(){this.current||d(`/cloud/iam`,{target:`router`})},watch:{"$route.params.sectionId"(){this.current?window.scrollTo({top:0,behavior:`smooth`}):d(`/cloud/iam`,{target:`router`})}},methods:{handleBack(){d(`/cloud`)},goTo(e){d(`/cloud/`+e,{target:`router`})}}},h={class:`cloud-section-page`},g={class:`cs-wrap`},_={class:`cs-nav`},v=[`onClick`],y={key:0,class:`cs-panel`},b={class:`cs-title`},x=[`innerHTML`],S={class:`cs-pager`},C=[`disabled`],w=[`disabled`];function T(s,d,f,p,m,T){let E=r(`CTopbar`);return n(),i(`div`,h,[c(`div`,g,[u(E,{title:`☁️ AWS Cloud`,"back-label":`← AWS Cloud`,onGoHome:T.handleBack},null,8,[`onGoHome`]),c(`div`,_,[(n(!0),i(l,null,e(m.cloudSections,(e,r)=>(n(),i(`button`,{key:e.id,class:o([`cs-nav-item`,{active:e.id===T.currentId}]),onClick:t=>T.goTo(e.id)},t(r+1),11,v))),128))]),T.current?(n(),i(`section`,y,[c(`div`,b,t(T.current.title),1),c(`div`,{class:`cs-body`,innerHTML:T.current.html},null,8,x)])):a(``,!0),c(`div`,S,[c(`button`,{class:`cs-pager-btn`,disabled:!T.prev,onClick:d[0]||=e=>T.goTo(T.prev.id)},` ← `+t(T.prevTitle),9,C),c(`button`,{class:`cs-pager-btn next`,disabled:!T.next,onClick:d[1]||=e=>T.goTo(T.next.id)},t(T.nextTitle)+` → `,9,w)])])])}var E=s(m,[[`render`,T],[`__scopeId`,`data-v-14c3763f`]]);export{E as default};