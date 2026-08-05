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
    </div>
  </div>
</template>

<script>
import { navigate } from '../utils/navigate.js';
import CTopbar from '../components/CTopbar.vue';
import CGrid from '../components/CGrid.vue';
import CHubCard from '../components/CHubCard.vue';

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
    path: '/cloud#iam',
  },
  {
    icon: '🌐',
    title: 'VPC & Networking',
    description: 'Subnets, IGW, NAT, Security Groups, NACL',
    path: '/cloud#vpc',
  },
  {
    icon: '🖥️',
    title: 'EC2 & Auto Scaling',
    description: 'Instance types, ASG, Load Balancer, EBS',
    path: '/cloud#ec2',
  },
  {
    icon: '⚡',
    title: 'Lambda & Serverless',
    description: 'Functions, API Gateway, DynamoDB',
    path: '/cloud#lambda',
  },
];

export default {
  name: 'CloudHubPage',
  components: { CTopbar, CGrid, CHubCard },
  data() {
    return { tocSections, hubCards };
  },
  methods: {
    handleNavigate(path) {
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
</style>
