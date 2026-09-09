// Legacy file → Vue route — nguồn ánh xạ duy nhất khi chuyển hẳn sang Vue
import { PORTED_PAGES, PORTED_PREFIXES } from './ported-pages.js';

const LEGACY_TO_VUE = {
  'index.html': '/',
  'ai.html': '/ai',
  'ai/hub.html': '/ai',
  'ai-agent.html': '/ai/agent',
  'cloud.html': '/cloud',
  'cloud/hub.html': '/cloud',
  'english.html': '/english',
  'english/hub.html': '/english/hub',
  'backend.html': '/java/backend',
  'java/hub.html': '/java/hub',
  'java/backend.html': '/java/backend',
  'java/spring-boot.html': '/java/spring-boot',
  'java/thuc-chien.html': '/java/thuc-chien',
  'frontend/hub.html': '/frontend/hub',
  'frontend/frameworks.html': '/frontend/frameworks',
  'frontend/html-css.html': '/frontend/html-css',
  'frontend/javascript.html': '/frontend/javascript',
  'frontend/responsive.html': '/frontend/responsive',
  'frontend/ui-interview.html': '/frontend/ui-interview',
  'devops.html': '/devops',
  'devops/hub.html': '/devops',
  'devops/aws.html': '/devops/aws',
  'devops/docker.html': '/devops/docker',
  'devops/kubernetes.html': '/devops/kubernetes',
  'devops/terraform.html': '/devops/terraform',
  'devops/cicd.html': '/devops/cicd',
  'devops/monitoring.html': '/devops/monitoring',
  'interview.html': '/interview',
  'interview-english.html': '/interview-english',
  'dashboard.html': '/dashboard',
  'exam.html': '/exam',
  'learning-paths.html': '/learning-paths',
  'accelerator.html': '/accelerator',
  'skill-tracker.html': '/skill-tracker',
  'salary-interview.html': '/salary-interview',
  'code-learn.html': '/code-learn',
  'sentence-practice.html': '/sentence-practice',
  'bmad-agents.html': '/bmad-agents',
  'game-memory.html': '/game-memory',
  'game-scramble.html': '/game-scramble',
  'game-speedquiz.html': '/game-speedquiz',
};

function normalizeKey(filePath) {
  if (!filePath) return '';
  let p = filePath.split('?')[0].split('#')[0];
  p = p.replace(/^\/+/, '').replace(/\/+$/, '');
  p = p.replace(/^pages\//, '');
  return p;
}

export function legacyFileToRoute(filePath) {
  const key = normalizeKey(filePath);
  if (!key) return null;
  if (LEGACY_TO_VUE[key]) return LEGACY_TO_VUE[key];

  // Quy ước mặc định: X.html ↔ /X khi route đã ported
  const route = key.endsWith('.html') ? '/' + key.slice(0, -5) : '/' + key;
  const isPorted = PORTED_PAGES.includes(route) || PORTED_PREFIXES.some(prefix => route.startsWith(prefix));
  return isPorted ? route : null;
}
