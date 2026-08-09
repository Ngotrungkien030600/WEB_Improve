<template>
  <div class="cloud-hub-page">
    <div class="hub-container">
      <CTopbar
        title="☁️ AWS Cloud"
        back-label="← Trang chủ"
        @go-home="handleNavigate('/')"
      />

      <p class="hub-description">IAM, VPC, EC2, Lambda, S3, RDS, ECS, CodePipeline — kiến trúc, code mẫu, best practices</p>

      <div class="toc">
        <a
          v-for="section in tocSections"
          :key="section.id"
          href="#"
          @click.prevent="scrollTo(section.id)"
        >
          {{ section.num }}. {{ section.title }}
        </a>
      </div>

      <CGrid>
        <CHubCard
          v-for="card in hubCards"
          :key="card.title"
          :icon="card.icon"
          :title="card.title"
          :description="card.description"
          :path="card.path"
          @navigate="handleNavigate"
        />
      </CGrid>

      <!-- Content sections -->
      <div class="cloud-sections">
        <section
          v-for="section in cloudSections"
          :id="section.id"
          :key="section.id"
          class="cloud-section"
        >
          <div class="cloud-section-title">{{ section.title }}</div>
          <div class="cloud-section-body" v-html="section.html"></div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import CTopbar from '../components/CTopbar.vue';
import CGrid from '../components/CGrid.vue';
import CHubCard from '../components/CHubCard.vue';
import { navigate } from '../utils/navigate.js';
import { cloudSections } from '../data/cloud-sections.js';

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

const hubCards = [
  {
    icon: '🔐',
    title: 'IAM & Security',
    description: 'Users, Roles, Policies, MFA, Least Privilege',
    path: '/cloud',
    hash: 'iam',
  },
  {
    icon: '🌐',
    title: 'VPC & Networking',
    description: 'Subnets, IGW, NAT, Security Groups, NACL',
    path: '/cloud',
    hash: 'vpc',
  },
  {
    icon: '🖥️',
    title: 'EC2 & Auto Scaling',
    description: 'Instance types, ASG, Load Balancer, EBS',
    path: '/cloud',
    hash: 'ec2',
  },
  {
    icon: '⚡',
    title: 'Lambda & Serverless',
    description: 'Functions, API Gateway, DynamoDB',
    path: '/cloud',
    hash: 'lambda',
  },
  {
    icon: '🔀',
    title: 'ALB & NLB',
    description: 'Load Balancers, Target Groups, Health Checks',
    path: '/cloud',
    hash: 'ec2',
  },
  {
    icon: '🚀',
    title: 'API Gateway',
    description: 'REST, HTTP, WebSocket, Lambda Authorizers',
    path: '/cloud',
    hash: 'lambda',
  },
  {
    icon: '🔗',
    title: 'Lambda Invoke',
    description: 'S3, SQS, DynamoDB, EventBridge, CloudWatch',
    path: '/cloud',
    hash: 'lambda',
  },
  {
    icon: '🪣',
    title: 'S3 & Storage',
    description: 'Buckets, Lifecycle, Replication, presigned URL',
    path: '/cloud',
    hash: 's3',
  },
  {
    icon: '🐳',
    title: 'ECS & Containers',
    description: 'Fargate, ECR, Task Definition, Service',
    path: '/cloud',
    hash: 'ecs',
  },
  {
    icon: '🗄️',
    title: 'RDS & DynamoDB',
    description: 'PostgreSQL, MySQL, Aurora, NoSQL',
    path: '/cloud',
    hash: 'rds',
  },
  {
    icon: '🔄',
    title: 'CI/CD & DevOps',
    description: 'CodePipeline, CodeBuild, CodeDeploy',
    path: '/cloud',
    hash: 'cicd',
  },
  {
    icon: '🏗️',
    title: 'Architecture',
    description: 'Patterns, Best Practices, Well-Architected',
    path: '/cloud',
    hash: 'arch',
  },
  {
    icon: '🔑',
    title: 'Bastion & Jump Host',
    description: 'SSH Tunnel, SSM Session Manager',
    path: '/cloud',
    hash: 'bastion',
  },
];

export default {
  name: 'CloudHubPage',
  components: { CTopbar, CGrid, CHubCard },
  data() {
    return { tocSections, hubCards, cloudSections };
  },
  mounted() {
    // Scroll to hash if present on page load
    this.scrollToHash();
  },
  watch: {
    // Re-scroll whenever the URL hash changes (card clicks, toc clicks, back/forward)
    '$route.hash': function () {
      this.scrollToHash();
    },
  },
  methods: {
    scrollToHash() {
      const hash = window.location.hash.slice(1);
      if (!hash) return;
      // Wait a tick so the target section exists in the DOM
      this.$nextTick(() => {
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      });
    },
    handleNavigate(path) {
      // CHubCard emits its `path` prop; map back to the card to include the hash
      const card = this.hubCards.find(c => c.path === path);
      const target = card && card.hash ? card.path + '#' + card.hash : path;
      navigate(target);
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
/* Cloud Hub uses purple accent per AD-17 */
.cloud-hub-page {
  --forge-accent: var(--accent-cloud);
  background: var(--forge-bg);
  min-height: 100vh;
  padding: 2.5rem 1.5rem;
}

.hub-container {
  max-width: 960px;
  margin: 0 auto;
}

.hub-description {
  color: var(--forge-text2);
  margin-bottom: 2rem;
  font-size: 0.95rem;
  line-height: 1.6;
}

.toc {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.toc a {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--forge-text);
  font-size: 0.85rem;
  font-weight: 500;
  transition: all var(--transition-spring);
  text-align: center;
}

.toc a:hover {
  background: var(--forge-glass-hover);
  border-color: var(--forge-accent);
  color: var(--forge-accent);
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  .toc {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ============ Content sections ============ */
.cloud-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.cloud-section {
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--forge-card-radius);
  overflow: hidden;
  background: var(--forge-surface);
}

.cloud-section-title {
  background: var(--forge-bg2);
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-lg);
  font-weight: 700;
  border-bottom: 1px solid var(--forge-glass-border);
  color: var(--forge-text);
}

.cloud-section-body {
  padding: var(--space-5);
  font-size: var(--font-sm);
  color: var(--forge-text2);
  line-height: 1.7;
}

.cloud-section-body h3 {
  font-size: var(--font-base);
  font-weight: 700;
  margin: var(--space-5) 0 var(--space-2);
  color: var(--forge-accent, var(--accent-cloud));
}

.cloud-section-body h3:first-child {
  margin-top: 0;
}

.cloud-section-body h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin: var(--space-4) 0 var(--space-1);
  color: var(--forge-text);
}

.cloud-section-body p {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-3);
}

.cloud-section-body ul {
  padding-left: var(--space-5);
  margin-bottom: var(--space-3);
}

.cloud-section-body li {
  font-size: var(--font-sm);
  color: var(--forge-text2);
  margin-bottom: var(--space-1);
}

.cloud-section-body strong {
  color: var(--forge-text);
}

.cloud-section-body pre {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  font-size: var(--font-xs);
  font-family: var(--font-mono);
  overflow-x: auto;
  margin: var(--space-3) 0;
  line-height: 1.6;
  color: var(--forge-text2);
}

.cloud-section-body code {
  background: var(--forge-bg2);
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: var(--font-mono);
  color: var(--forge-text2);
}

.cloud-section-body pre code {
  background: transparent;
  padding: 0;
  color: inherit;
}

.cloud-section-body .diagram {
  background: var(--forge-bg2);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin: var(--space-3) 0;
  text-align: center;
  font-size: var(--font-xs);
  color: var(--forge-accent, var(--accent-cloud));
  font-weight: 600;
  line-height: 2;
  font-family: var(--font-mono);
  overflow-x: auto;
  white-space: pre-line;
}

.cloud-section-body .grid-2,
.cloud-section-body .grid-3 {
  display: grid;
  gap: var(--space-3);
  margin: var(--space-3) 0;
}

.cloud-section-body .grid-2 {
  grid-template-columns: 1fr 1fr;
}

.cloud-section-body .grid-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.cloud-section-body .card {
  background: var(--forge-glass);
  border: 1px solid var(--forge-glass-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
}

.cloud-section-body .card h4 {
  font-size: var(--font-sm);
  font-weight: 700;
  margin-bottom: var(--space-1);
  color: var(--forge-text);
}

.cloud-section-body .card p,
.cloud-section-body .card li {
  font-size: var(--font-xs);
  color: var(--forge-text3);
}

.cloud-section-body .card ul {
  padding-left: var(--space-4);
}

.cloud-section-body .card li {
  margin-bottom: 0.2rem;
}

.cloud-section-body table {
  width: 100%;
  border-collapse: collapse;
  margin: var(--space-3) 0;
  font-size: var(--font-xs);
}

.cloud-section-body th,
.cloud-section-body td {
  border: 1px solid var(--forge-glass-border);
  padding: var(--space-2);
  text-align: left;
}

.cloud-section-body th {
  background: var(--forge-bg2);
  color: var(--forge-accent, var(--accent-cloud));
}

@media (max-width: 700px) {
  .cloud-section-body .grid-2,
  .cloud-section-body .grid-3 {
    grid-template-columns: 1fr;
  }
}
</style>
