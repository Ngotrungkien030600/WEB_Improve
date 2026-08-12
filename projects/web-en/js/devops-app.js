/**
 * DevOps Learn — Entry point
 */
import { initDevopsUI } from './features/devops/devops-ui.js';

console.log('[DevopsApp] Starting...');
document.addEventListener('DOMContentLoaded', () => {
  console.log('[DevopsApp] DOM ready');
  initDevopsUI();
});
