import { createRouter, createWebHistory } from 'vue-router';
import CNavRedirect from '../components/CNavRedirect.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/ai',
    name: 'ai',
    component: () => import('../pages/AiHubPage.vue'),
  },
  {
    path: '/ai/hub',
    name: 'ai-hub-sub',
    component: () => import('../pages/AiHubSubPage.vue'),
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
    path: '/frontend/ui-interview',
    name: 'frontend-ui-interview',
    component: () => import('../pages/FrontendUiInterviewPage.vue'),
  },
  {
    path: '/frontend/responsive',
    name: 'frontend-responsive',
    component: () => import('../pages/FrontendResponsivePage.vue'),
  },
  {
    path: '/frontend/javascript',
    name: 'frontend-javascript',
    component: () => import('../pages/FrontendJavaScriptPage.vue'),
  },
  {
    path: '/frontend/html-css',
    name: 'frontend-html-css',
    component: () => import('../pages/FrontendHtmlCssPage.vue'),
  },
  {
    path: '/frontend/frameworks',
    name: 'frontend-frameworks',
    component: () => import('../pages/FrontendFrameworksPage.vue'),
  },
  {
    path: '/cloud',
    name: 'cloud',
    component: () => import('../pages/CloudHubPage.vue'),
  },
  {
    path: '/cloud/hub',
    name: 'cloud-hub-sub',
    component: () => import('../pages/CloudHubSubPage.vue'),
  },
  {
    path: '/cloud/:sectionId',
    name: 'cloud-section',
    component: () => import('../pages/CloudSectionPage.vue'),
  },
  {
    path: '/devops',
    name: 'devops',
    component: () => import('../pages/DevopsHubPage.vue'),
  },
  {
    path: '/devops/aws',
    name: 'devops-aws',
    component: () => import('../pages/DevopsAwsPage.vue'),
  },
  {
    path: '/devops/docker',
    name: 'devops-docker',
    component: () => import('../pages/DevopsDockerPage.vue'),
  },
  {
    path: '/devops/kubernetes',
    name: 'devops-kubernetes',
    component: () => import('../pages/DevopsKubernetesPage.vue'),
  },
  {
    path: '/devops/terraform',
    name: 'devops-terraform',
    component: () => import('../pages/DevopsTerraformPage.vue'),
  },
  {
    path: '/devops/cicd',
    name: 'devops-cicd',
    component: () => import('../pages/DevopsCicdPage.vue'),
  },
  {
    path: '/devops/monitoring',
    name: 'devops-monitoring',
    component: () => import('../pages/DevopsMonitoringPage.vue'),
  },
  {
    path: '/devops/:topicId/:sectionId',
    name: 'devops-section',
    component: () => import('../pages/DevopsSectionPage.vue'),
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
    path: '/podcast',
    name: 'podcast',
    component: () => import('../pages/PodcastPage.vue'),
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
    path: '/podcast',
    name: 'podcast',
    component: () => import('../pages/PodcastPage.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../pages/DashboardPage.vue'),
  },
  {
    path: '/java/thuc-chien',
    name: 'java-thuc-chien',
    component: () => import('../pages/JavaThucChienPage.vue'),
  },
  {
    path: '/java/spring-boot',
    redirect: '/java/spring-boot/core',
  },
  {
    path: '/java/spring-boot/:sectionId',
    name: 'java-spring-boot',
    component: () => import('../pages/SpringSectionPage.vue'),
  },
  {
    path: '/java/backend',
    redirect: '/java/backend/sql',
  },
  {
    path: '/java/backend/:sectionId',
    name: 'java-backend',
    component: () => import('../pages/BackendSectionPage.vue'),
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
