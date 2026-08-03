import { createRouter, createWebHistory } from 'vue-router';
import CNavRedirect from '../components/CNavRedirect.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/ai/hub',
    name: 'ai-hub',
    component: () => import('../components/HubPlaceholder.vue'),
    props: { hubPath: '/ai/hub' },
  },
  {
    path: '/ai/agent',
    name: 'ai-agent',
    component: () => import('../pages/AiAgentPage.vue'),
  },
  {
    path: '/java/hub',
    name: 'java-hub',
    component: () => import('../pages/JavaHubPage.vue'),
  },
  {
    path: '/frontend/hub',
    name: 'frontend-hub',
    component: () => import('../pages/FrontendHubPage.vue'),
  },
  {
    path: '/cloud/hub',
    name: 'cloud-hub',
    component: () => import('../components/HubPlaceholder.vue'),
    props: { hubPath: '/cloud/hub' },
  },
  {
    path: '/english/hub',
    name: 'english-hub',
    component: () => import('../pages/EnglishHubPage.vue'),
  },
  {
    path: '/interview',
    name: 'interview',
    component: () => import('../pages/InterviewPage.vue'),
  },
  {
    path: '/game-memory',
    name: 'game-memory',
    component: () => import('../pages/GameMemoryPage.vue'),
  },
  {
    path: '/game-scramble',
    name: 'game-scramble',
    component: () => import('../pages/GameScramblePage.vue'),
  },
  {
    path: '/game-speedquiz',
    name: 'game-speedquiz',
    component: () => import('../pages/GameSpeedQuizPage.vue'),
  },
  {
    path: '/exam',
    name: 'exam',
    component: () => import('../pages/ExamPage.vue'),
  },
  {
    path: '/skill-tracker',
    name: 'skill-tracker',
    component: () => import('../pages/SkillTrackerPage.vue'),
  },
  {
    path: '/sentence-practice',
    name: 'sentence-practice',
    component: () => import('../pages/SentencePracticePage.vue'),
  },
  {
    path: '/english',
    name: 'english',
    component: () => import('../pages/EnglishPage.vue'),
  },
  {
    path: '/learning-paths',
    name: 'learning-paths',
    component: () => import('../pages/LearningPathsPage.vue'),
  },
  {
    path: '/accelerator',
    name: 'accelerator',
    component: () => import('../pages/AcceleratorPage.vue'),
  },
  {
    path: '/salary-interview',
    name: 'salary-interview',
    component: () => import('../pages/SalaryInterviewPage.vue'),
  },
  {
    path: '/code-learn',
    name: 'code-learn',
    component: () => import('../pages/CodeLearnPage.vue'),
  },
  {
    path: '/interview-english',
    name: 'interview-english',
    component: () => import('../pages/InterviewEnglishPage.vue'),
  },
  {
    path: '/bmad-agents',
    name: 'bmad-agents',
    component: () => import('../pages/BmadAgentsPage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'nav-redirect',
    component: CNavRedirect,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
