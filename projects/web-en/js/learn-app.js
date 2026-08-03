/**
 * Learn Code — Entry point
 */
import { initLearnUI } from './features/learn/learn-ui.js';

console.log('[LearnApp] Starting...');
document.addEventListener('DOMContentLoaded', () => {
  console.log('[LearnApp] DOM ready');
  initLearnUI();
});
