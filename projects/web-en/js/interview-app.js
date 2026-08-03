/**
 * SkillForge — Interview App entry point.
 */
import { initInterviewUI } from './features/interview/interview-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  initInterviewUI().catch(e => console.error('[InterviewApp] Error:', e));
});
