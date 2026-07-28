/**
 * Utility functions shared across modules.
 */

/** Fisher-Yates shuffle */
export function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Text-to-speech using Web Speech API */
export function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/** Escape HTML for XSS prevention */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

/** Get level text from percentage */
export function getLevelText(percent) {
  if (percent >= 90) return '🌟 Xuất sắc';
  if (percent >= 75) return '✅ Khá tốt';
  if (percent >= 50) return '⚠️ Trung bình';
  return '❌ Cần cố gắng';
}
