/**
 * SkillForge — Interview App entry point.
 */
import { initInterviewUI } from './features/interview/interview-ui.js';
import { initQuizMode } from './features/interview/interview-quiz.js';
import { initWeakPointDashboard } from './features/interview/interview-weak-points.js';

document.addEventListener('DOMContentLoaded', async () => {
  await initInterviewUI();
  initQuizMode();
  initWeakPointDashboard();
  
  // Listen for focus-weak-points event from weak point dashboard
  window.addEventListener('focus-weak-points', (e) => {
    console.log('Focus on weak points:', e.detail);
    // Trigger quiz with weak points
    import('./features/interview/interview-quiz.js').then(({ startQuizWithWeakPoints }) => {
      if (startQuizWithWeakPoints) {
        startQuizWithWeakPoints(e.detail);
      }
    });
  });
});
