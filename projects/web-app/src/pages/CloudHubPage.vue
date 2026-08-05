<template>
  <div class="cloud-page" style="--color-accent: #ff9900">
    <div class="page">
      <div class="topbar">
        <div>
          <h1>☁️ AWS Cloud Foundations &amp; Core</h1>
          <p class="desc">IAM, VPC, EC2, Lambda, S3, RDS, ECS, CodePipeline — kiến trúc, code mẫu, best practices</p>
        </div>
        <div class="links">
          <a href="#" @click.prevent="handleNav('/')">Trang chủ</a>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="toc">
        <a v-for="section in tocSections" :key="section.id" :href="'#' + section.id" @click.prevent="scrollTo(section.id)">
          {{ section.num }}. {{ section.title }}
        </a>
      </div>

      <!-- Section 1: IAM -->
      <div class="section" id="iam">
        <div class="section-title">1. IAM (Identity &amp; Access Management)</div>
        <div class="section-body">
          <h3>IAM là gì?</h3>
          <p>IAM là dịch vụ quản lý danh tính và quyền truy cập AWS. Mọi thao tác với AWS API đều phải qua IAM authentication + authorization. <strong>IAM không phải là service-specific</strong> — nó áp dụng cho toàn bộ tài khoản AWS.</p>

          <h3>IAM Components</h3>
          <div class="grid-2">
            <div class="card"><h4>👤 User</h4><p>Một người/vật thực thể. Có long-term credentials (password + access key). Khuyến nghị: 1 user = 1 người thật.</p></div>
            <div class="card"><h4>👥 Group</h4><p>Tập hợp users. Gán policy cho group thay vì từng user. Quản lý dễ hơn, ít trùng lặp.</p></div>
            <div class="card"><h4>🤖 Role</h4><p>Không gắn với user cụ thể. Được assume bởi users, services (EC2, Lambda), hoặc AWS accounts khác. Có temporary credentials (STS).</p></div>
            <div class="card"><h4>📜 Policy</h4><p>JSON document định nghĩa quyền (Allow/Deny) trên các resource. Gán vào User, Group, hoặc Role.</p></div>
          </div>

          <h3>IAM Policy — cấu trúc JSON</h3>
          <pre><code>{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/uploads/*"
    }
  ]
}</code></pre>

          <h3>Least Privilege — nguyên tắc vàng</h3>
          <p>Chỉ cấp quyền tối thiểu cần thiết. Dùng <strong>AWS Managed Policies</strong> khi bắt đầu, sau đó chuyển sang <strong>Customer Managed Policies</strong> chi tiết hơn.</p>

          <h3>IAM Best Practices</h3>
          <ul>
            <li><strong>Không dùng root account</strong> — tạo admin user với MFA</li>
            <li><strong>MFA bắt buộc</strong> cho users có quyền cao</li>
            <li><strong>Rotate access key</strong> định kỳ (90 ngày)</li>
            <li><strong>IAM Access Analyzer</strong> — phát hiện resource được share public</li>
          </ul>
        </div>
      </div>

      <!-- Section 2: VPC -->
      <div class="section" id="vpc">
        <div class="section-title">2. VPC (Virtual Private Cloud) &amp; Networking</div>
        <div class="section-body">
          <h3>VPC là gì?</h3>
          <p>VPC là mạng ảo riêng trong AWS — <strong>logically isolated network</strong> trong tài khoản của bạn. Bạn tự định nghĩa IP range, subnets, route tables, gateways.</p>

          <h3>VPC Architecture cơ bản</h3>
          <div class="diagram">
Internet → Internet Gateway (IGW) → Public Subnet → EC2<br>
                                     │<br>
                                     └→ NAT Gateway → Private Subnet → EC2/DB<br>
          </div>

          <h3>CIDR &amp; Subnets</h3>
          <pre><code>VPC CIDR: 10.0.0.0/16 (65536 địa chỉ)

Public Subnet  10.0.1.0/24  (AZ: ap-southeast-1a)
Private Subnet 10.0.3.0/24  (AZ: ap-southeast-1a)
DB Subnet      10.0.5.0/24  (AZ: ap-southeast-1a)</code></pre>

          <h3>Security Groups vs NACL</h3>
          <div class="grid-2">
            <div class="card"><h4>🔒 Security Group (Stateful)</h4>
              <ul><li>Stateful — allow inbound → tự động allow outbound</li><li>Chỉ có Allow rules</li><li>Reference SG khác: sg-xxx</li></ul>
            </div>
            <div class="card"><h4>📋 NACL (Stateless)</h4>
              <ul><li>Stateless — cần define cả inbound + outbound</li><li>Có Allow + Deny rules</li><li>Reference IP/CIDR</li></ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: EC2 -->
      <div class="section" id="ec2">
        <div class="section-title">3. EC2 &amp; Auto Scaling</div>
        <div class="section-body">
          <h3>EC2 Instance Types &amp; Families</h3>
          <div class="grid-3">
            <div class="card"><h4>⚡ General Purpose (T3, M7g)</h4><p>Web servers, small DB, dev/test. T3 burstable.</p></div>
            <div class="card"><h4>🔬 Compute Optimized (C7g)</h4><p>Batch processing, gaming, HPC. Graviton3 ARM, 20% rẻ hơn Intel.</p></div>
            <div class="card"><h4>📦 Memory Optimized (R7g, X2iedn)</h4><p>In-memory caches (Redis), large DB.</p></div>
          </div>

          <h3>Auto Scaling — Launch Template</h3>
          <pre><code>aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name prod-web-asg \
  --launch-template LaunchTemplateName=web-v2 \
  --min-size 2 --max-size 10 --desired-capacity 3 \
  --availability-zones ap-southeast-1a ap-southeast-1b</code></pre>

          <h3>EC2 Best Practices</h3>
          <ul>
            <li><strong>Dùng IAM Role</strong> cho EC2 — không bao giờ nhúng access key</li>
            <li><strong>IMDSv2 bắt buộc</strong> — set HttpTokens=required</li>
            <li><strong>SSM Session Manager</strong> thay vì SSH</li>
            <li><strong>Spot Instances</strong> cho workload chịu được interrupt — tiết kiệm 70-90%</li>
          </ul>
        </div>
      </div>

      <!-- Section 4: Lambda -->
      <div class="section" id="lambda">
        <div class="section-title">4. Lambda &amp; Serverless</div>
        <div class="section-body">
          <h3>Lambda là gì?</h3>
          <p>Function-as-a-Service (FaaS) — chạy code không cần quản lý server. AWS quản lý infrastructure, auto-scale. <strong>Chỉ trả tiền khi code chạy</strong>.</p>

          <h3>Lambda với API Gateway (REST API)</h3>
          <pre><code>export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    switch (event.httpMethod) {
      case 'GET': {
        const { id } = event.pathParameters || {};
        const { Item } = await ddb.send(new GetCommand({ TableName: process.env.TABLE_NAME, Key: { pk: id } }));
        return { statusCode: 200, headers, body: JSON.stringify(Item) };
      }
      case 'POST': {
        const body = JSON.parse(event.body || '{}');
        const item = { pk: crypto.randomUUID(), ...body };
        await ddb.send(new PutCommand({ TableName: process.env.TABLE_NAME, Item: item }));
        return { statusCode: 201, headers, body: JSON.stringify(item) };
      }
    }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal error' }) };
  }
};</code></pre>

          <h3>Lambda Best Practices</h3>
          <ul>
            <li><strong>Cold Start:</strong> Java/.NET ~1-5s, Node.js/Python ~100-300ms</li>
            <li><strong>Execution Timeout:</strong> tối đa 15 phút</li>
            <li><strong>Stateless:</strong> không lưu state trong memory</li>
            <li><strong>VPC Lambda:</strong> cần ENI → cold start lâu hơn</li>
          </ul>
        </div>
      </div>

      <!-- Section 5: ECS -->
      <div class="section" id="ecs">
        <div class="section-title">5. ECS &amp; Container Orchestration</div>
        <div class="section-body">
          <h3>ECS là gì?</h3>
          <p>Amazon Elastic Container Service — orchestration cho Docker containers. Có 2 launch types: <strong>Fargate</strong> (serverless) và <strong>EC2</strong> (tự quản cluster).</p>

          <h3>ECS vs EKS vs Lambda</h3>
          <div class="grid-3">
            <div class="card"><h4>🐳 ECS (Fargate)</h4><p>Serverless container. AWS quản lý control plane. Đơn giản nhất.</p></div>
            <div class="card"><h4>☸️ EKS (Kubernetes)</h4><p>Managed K8s — chuẩn CNCF. Portable nhưng phức tạp hơn.</p></div>
            <div class="card"><h4>⚡ Lambda</h4><p>FaaS — event-driven. Tối đa 15 ph execution.</p></div>
          </div>
        </div>
      </div>

      <!-- Section 6: S3 -->
      <div class="section" id="s3">
        <div class="section-title">6. S3 (Simple Storage Service)</div>
        <div class="section-body">
          <h3>S3 là gì?</h3>
          <p>S3 là object storage — lưu trữ <strong>unlimited objects</strong> (0 byte – 5 TB). <strong>99.999999999% durability</strong> (11 9's).</p>

          <h3>S3 Storage Classes</h3>
          <div class="grid-2">
            <div class="card"><h4>⚡ S3 Standard</h4><p>Frequent access. $0.023/GB. Cho web app, big data.</p></div>
            <div class="card"><h4>📉 S3 Intelligent-Tiering</h4><p>Tự động di chuyển objects giữa tiers.</p></div>
            <div class="card"><h4>❄️ S3 Glacier</h4><p>Archive — rẻ nhất $0.001/GB. Cho backup.</p></div>
            <div class="card"><h4>🗄️ S3 One Zone-IA</h4><p>Chỉ 1 AZ, rẻ hơn Standard-IA 20%.</p></div>
          </div>

          <h3>S3 Best Practices</h3>
          <ul>
            <li><strong>Prefix cho performance:</strong> 5500 GET/3500 PUT requests/s mỗi prefix</li>
            <li><strong>Multipart Upload:</strong> cho file &gt;100 MB</li>
            <li><strong>Object Lock:</strong> WORM — compliance, legal hold</li>
            <li><strong>Replication:</strong> CRR (cross-region) cho disaster recovery</li>
          </ul>
        </div>
      </div>

      <!-- Section 7: RDS & DynamoDB -->
      <div class="section" id="rds">
        <div class="section-title">7. RDS &amp; DynamoDB</div>
        <div class="section-body">
          <h3>RDS — Relational Databases</h3>
          <p>Managed DB: <strong>Aurora, PostgreSQL, MySQL, MariaDB, SQL Server</strong>. AWS quản lý: OS patching, backup, replication, failover.</p>

          <h3>RDS vs DynamoDB — chọn cái nào?</h3>
          <div class="grid-2">
            <div class="card"><h4>🗄️ RDS (SQL)</h4>
              <ul><li>Dữ liệu có quan hệ (JOIN, FK)</li><li>Complex queries, aggregations</li><li>Ví dụ: ERP, CRM</li></ul>
            </div>
            <div class="card"><h4>📊 DynamoDB (NoSQL)</h4>
              <ul><li>Key-value access pattern, high scale</li><li>Single-digit ms ở mọi scale</li><li>Ví dụ: session, shopping cart</li></ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 8: CI/CD -->
      <div class="section" id="cicd">
        <div class="section-title">8. CodePipeline &amp; DevOps</div>
        <div class="section-body">
          <h3>CI/CD trên AWS</h3>
          <p>AWS cung cấp CI/CD stack: <strong>CodeCommit</strong> (Git), <strong>CodeBuild</strong> (build/test), <strong>CodeDeploy</strong> (deploy), <strong>CodePipeline</strong> (orchestration).</p>

          <h3>CI/CD Best Practices</h3>
          <ul>
            <li><strong>Build artifact duy nhất</strong> — build 1 lần, deploy qua các môi trường</li>
            <li><strong>Immutable infrastructure</strong> — tạo AMI mới mỗi deploy</li>
            <li><strong>Canary / Blue-Green</strong> — giảm blast radius</li>
            <li><strong>Automated rollback</strong> — CloudWatch alarm + deployment circuit breaker</li>
          </ul>
        </div>
      </div>

      <!-- Section 9: Architecture -->
      <div class="section" id="arch">
        <div class="section-title">9. Architecture &amp; Best Practices</div>
        <div class="section-body">
          <h3>Well-Architected Framework</h3>
          <div class="grid-2">
            <div class="card"><h4>⚡ Operational Excellence</h4><p>IaC (CDK/CF), monitoring, runbooks, auto-remediation.</p></div>
            <div class="card"><h4>🔒 Security</h4><p>Least privilege IAM, encryption, VPC isolation.</p></div>
            <div class="card"><h4>💪 Reliability</h4><p>Multi-AZ, auto scaling, health checks.</p></div>
            <div class="card"><h4>💰 Cost Optimization</h4><p>Savings Plans, Spot instances, auto scaling.</p></div>
          </div>
        </div>
      </div>

      <!-- Section 10: Bastion -->
      <div class="section" id="bastion">
        <div class="section-title">10. Bastion &amp; Jump Host</div>
        <div class="section-body">
          <h3>Bastion Host là gì?</h3>
          <p><strong>Bastion Host</strong> là máy chủ hardened đặt ở <strong>public subnet</strong>, là <strong>cổng vào duy nhất</strong> để SSH/RDP vào các máy trong <strong>private subnet</strong>.</p>

          <h3>Thay thế hiện đại: SSM Session Manager</h3>
          <p>SSH vào private instance <strong>không cần bastion, không mở port 22, không public IP</strong>. Dùng IAM thay vì SSH keys, log đầy đủ, tích hợp MFA, chi phí 0$.</p>
          <pre><code>aws ssm start-session --target i-xxxxx</code></pre>

          <h3>Bastion vs NAT Gateway</h3>
          <div class="grid-2">
            <div class="card"><h4>🛡️ Bastion Host</h4><p><strong>Inbound</strong> — cho người từ ngoài SSH vào private subnet.</p></div>
            <div class="card"><h4>🌐 NAT Gateway</h4><p><strong>Outbound</strong> — cho private instances đi ra internet.</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';

const tocSections = [
  { id: 'iam', num: '1', title: 'IAM & Security' },
  { id: 'vpc', num: '2', title: 'VPC & Networking' },
  { id: 'ec2', num: '3', title: 'EC2 & Auto Scaling' },
  { id: 'lambda', num: '4', title: 'Lambda & Serverless' },
  { id: 'ecs', num: '5', title: 'ECS & Containers' },
  { id: 's3', num: '6', title: 'S3 & Storage' },
  { id: 'rds', num: '7', title: 'RDS & DynamoDB' },
  { id: 'cicd', num: '8', title: 'CodePipeline & DevOps' },
  { id: 'arch', num: '9', title: 'Architecture & Best Practices' },
  { id: 'bastion', num: '10', title: 'Bastion & Jump Host' },
];

export default {
  name: 'CloudHubPage',
  data() {
    return { tocSections };
  },
  methods: {
    handleNav(path) {
      navigate(path);
    },
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  },
};
</script>

<style scoped>
/* CSS variables inherited from main.css */

.cloud-page {
  background: var(--color-bg);
  min-height: 100vh;
  color: var(--color-text);
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.7;
}

.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.topbar h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}

.desc {
  color: var(--color-text2);
  margin-top: 0.3rem;
  font-size: 0.95rem;
}

.links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.links a {
  color: var(--color-accent);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}

.toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
  margin-bottom: 2.5rem;
}

.toc a {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 0.7rem 1rem;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 500;
  transition: border-color 0.2s, color 0.2s;
}

.toc a:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.section {
  margin-bottom: 3rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.section-title {
  background: var(--color-surface2);
  padding: 0.9rem 1.25rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-bottom: 1px solid var(--color-border);
}

.section-body {
  padding: 1.25rem;
}

.section-body h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-accent);
}

.section-body h3:first-child {
  margin-top: 0;
}

.section-body h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 1rem 0 0.4rem;
  color: var(--color-text);
}

.section-body p {
  font-size: 0.9rem;
  color: var(--color-text2);
  margin-bottom: 0.75rem;
}

.section-body ul {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.section-body li {
  font-size: 0.85rem;
  color: var(--color-text2);
  margin-bottom: 0.3rem;
}

.section-body strong {
  color: var(--color-text);
}

pre {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  font-size: 0.82rem;
  overflow-x: auto;
  margin: 0.75rem 0;
  line-height: 1.6;
  color: var(--color-text);
}

code {
  background: var(--color-surface2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.85em;
  color: var(--color-text);
}

pre code {
  background: transparent;
  padding: 0;
}

.diagram {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 0.75rem 0;
  text-align: center;
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 600;
  line-height: 2;
  font-family: monospace;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
}

.card {
  background: var(--color-surface2);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: 1rem;
}

.card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--color-text);
}

.card p,
.card li {
  font-size: 0.8rem;
  color: var(--color-text2);
}

.card ul {
  padding-left: 1rem;
}

.card li {
  margin-bottom: 0.2rem;
}

@media (max-width: 600px) {
  .grid-2,
  .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
