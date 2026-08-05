<template></template>

<script>
const LEGACY_TO_VUE = {
  'backend.html': '/java/backend',
  'java/backend.html': '/java/backend',
  'java/spring-boot.html': '/java/spring-boot',
  'java/thuc-chien.html': '/java/thuc-chien',
  'frontend/hub.html': '/frontend/hub',
  'frontend/ui-interview.html': '/frontend/ui-interview',
  'frontend/responsive.html': '/frontend/responsive',
  'frontend/javascript.html': '/frontend/javascript',
  'frontend/html-css.html': '/frontend/html-css',
  'frontend/frameworks.html': '/frontend/frameworks',
  'english.html': '/english',
  'english/hub.html': '/english/hub',
  'interview.html': '/interview',
  'interview-english.html': '/interview-english',
  'ai.html': '/ai',
  'ai/hub.html': '/ai',
  'ai-agent.html': '/ai/agent',
  'cloud.html': '/cloud',
  'cloud/hub.html': '/cloud',
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

export default {
  name: 'CNavRedirect',
  mounted() {
    const pathname = window.location.pathname;
    const page = pathname.replace(/^\/+/, '');
    const vueRoute = LEGACY_TO_VUE[page] || '/';
    window.location.href = vueRoute;
  },
};
</script>
