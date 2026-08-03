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
    path: '/java/hub',
    name: 'java-hub',
    component: () => import('../components/HubPlaceholder.vue'),
    props: { hubPath: '/java/hub' },
  },
  {
    path: '/frontend/hub',
    name: 'frontend-hub',
    component: () => import('../components/HubPlaceholder.vue'),
    props: { hubPath: '/frontend/hub' },
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
    component: () => import('../components/HubPlaceholder.vue'),
    props: { hubPath: '/english/hub' },
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
