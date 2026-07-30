/**
 * Accelerator — UI Module with Real-time Features
 * 
 * Real-time elements:
 * - Live session countdown (SSE + setInterval fallback)
 * - AI streaming feedback (SSE) for typing
 * - Speech recognition real-time transcript
 * - BroadcastChannel sync cross-tab
 * - Live progress ring + achievement toast
 */
import { ACCELERATOR_DAYS } from '../../data/accelerator-data.js';
import {
  loadState, getCurrentDay, setCurrentDay, completeDay, getProgress,
  startSession, endSession, getSessionElapsed, isDayCompleted, getDayScore,
  BROADCAST_CHANNEL,
} from './accelerator-logic.js';

// ---- DOM Refs (lazy) ----
const $ = id => document.getElementById(id);
let dayEl, titleEl, techConceptEl, techPracticeEl, englishVocabEl,
  englishListeningEl, englishPracticeEl, systemDesignCaseEl, keyTakeawayEl,
  completionMsgEl, progressBarEl, progressPctEl, xpEl, streakEl, sessionTimerEl,
  typingAreaEl, typingAiFeedbackEl, transcriptEl, speechBtnEl, vocabChipsEl,
  dayGridEl, dayNavLeftEl, dayNavRightEl, toastContainerEl, weekBarEl,
  englishRecordBtnEl, startSessionBtnEl, completeBtnEl;

// ---- State ----
let sessionInterval = null;
let sessionActive = false;
let ssEventSource = null;
let speechRecognition = null;
let isListening = false;
let bcChannel = null;
const CIRCUMFERENCE = 188.5;
const SESSION_DURATION = 3600; // 1h mặc định

// ---- Init ----
export function initAcceleratorUI() {
  cacheDOM();
  loadState();
  setupBroadcastChannel();
  setupSpeechRecognition();
  initDayNavigation();
  renderDay(getCurrentDay());
  renderProgress();
  renderDayGrid();
  updateSessionTimer(0);
  setupTypingAI();
  setupCompleteButton();
  setupStartSession();
  setupKeyboardShortcuts();
  // Khôi phục session timer nếu có
  checkSessionRestore();
  // Show welcome achievement if first visit
  welcomeAchievement();
}

function cacheDOM() {
  dayEl = $('acc-day');
  titleEl = $('acc-title');
  techConceptEl = $('acc-tech-concept');
  techPracticeEl = $('acc-tech-practice');
  englishVocabEl = $('acc-english-vocab');
  englishListeningEl = $('acc-english-listening');
  englishPracticeEl = $('acc-english-practice');
  systemDesignCaseEl = $('acc-system-design');
  keyTakeawayEl = $('acc-key-takeaway');
  completionMsgEl = $('acc-completion-msg');
  progressBarEl = $('acc-progress-bar');
  progressPctEl = $('acc-progress-pct');
  xpEl = $('acc-xp');
  streakEl = $('acc-streak');
  sessionTimerEl = $('acc-session-timer');
  typingAreaEl = $('acc-typing-area');
  typingAiFeedbackEl = $('acc-typing-feedback');
  transcriptEl = $('acc-transcript');
  speechBtnEl = $('acc-speech-btn');
  vocabChipsEl = $('acc-vocab-chips');
  dayGridEl = $('acc-day-grid');
  dayNavLeftEl = $('acc-nav-left');
  dayNavRightEl = $('acc-nav-right');
  toastContainerEl = $('acc-toast-container');
  weekBarEl = $('acc-week-bar');
  englishRecordBtnEl = $('acc-english-record');
  startSessionBtnEl = $('acc-start-session');
  completeBtnEl = $('acc-complete');
}

// ---- BroadcastChannel (Real-time cross-tab sync) ----
function setupBroadcastChannel() {
  try {
    bcChannel = new BroadcastChannel(BROADCAST_CHANNEL);
    bcChannel.onmessage = (e) => {
      if (e.data?.type === 'state-update') {
        renderProgress();
        renderDayGrid();
      }
    };
  } catch (e) { /* BC not available */ }
}

// ---- Speech Recognition (Real-time) ----
function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (speechBtnEl) speechBtnEl.disabled = true;
    if (englishRecordBtnEl) englishRecordBtnEl.disabled = true;
    return;
  }
  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = 'en-US';

  speechRecognition.onresult = (e) => {
    let interim = '';
    let final = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) final += e.results[i][0].transcript + ' ';
      else interim += e.results[i][0].transcript;
    }
    if (transcriptEl) {
      transcriptEl.innerHTML = final ? `<span class="acc-transcript-final">${final}</span>` : '';
      transcriptEl.innerHTML += interim ? ` <span class="acc-transcript-interim">${interim}</span>` : '';
    }
  };

  speechRecognition.onerror = () => toggleSpeech(false);

  if (speechBtnEl) {
    speechBtnEl.addEventListener('click', () => {
      if (isListening) toggleSpeech(false);
      else toggleSpeech(true);
    });
  }
  if (englishRecordBtnEl) {
    englishRecordBtnEl.addEventListener('click', () => {
      if (isListening) toggleSpeech(false);
      else toggleSpeech(true);
    });
  }
}

function toggleSpeech(start) {
  isListening = start;
  if (!speechRecognition) return;
  try {
    if (start) {
      speechRecognition.start();
      if (speechBtnEl) { speechBtnEl.textContent = '🔴'; speechBtnEl.classList.add('recording'); }
      if (englishRecordBtnEl) { englishRecordBtnEl.textContent = '🔴 Stop'; englishRecordBtnEl.classList.add('recording'); }
    } else {
      speechRecognition.stop();
      if (speechBtnEl) { speechBtnEl.textContent = '🎤'; speechBtnEl.classList.remove('recording'); }
      if (englishRecordBtnEl) { englishRecordBtnEl.textContent = '🎤 Record'; englishRecordBtnEl.classList.remove('recording'); }
    }
  } catch (e) { isListening = false; }
}

// ---- SSE for AI streaming feedback ----
function setupTypingAI() {
  if (!typingAreaEl || !typingAiFeedbackEl) return;
  let debounceTimer = null;
  typingAreaEl.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const text = typingAreaEl.value.trim();
    if (text.length < 5) {
      typingAiFeedbackEl.innerHTML = '';
      typingAiFeedbackEl.classList.remove('active');
      return;
    }
    debounceTimer = setTimeout(() => streamAIFeedback(text), 800);
  });
}

function streamAIFeedback(text) {
  if (typingAiFeedbackEl) {
    typingAiFeedbackEl.classList.add('active');
    typingAiFeedbackEl.innerHTML = '<span class="acc-streaming-dot">⏳</span> Đang phân tích...';
  }
  // Gửi request AI streaming
  fetch('/api/accelerator/stream-feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      day: getCurrentDay(),
      type: typingAreaEl.dataset.type || 'tech',
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            typingAiFeedbackEl.innerHTML = markdownToHTML(result);
            return;
          }
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          typingAiFeedbackEl.innerHTML = markdownToHTML(result) + '<span class="acc-cursor-blink">|</span>';
          read();
        }).catch(() => {
          typingAiFeedbackEl.innerHTML = markdownToHTML(result);
        });
      }
      read();
    })
    .catch(() => {
      // Fallback: simulate AI feedback client-side
      simulateAIFeedback(text);
    });
}

function simulateAIFeedback(text) {
  if (!typingAiFeedbackEl) return;
  const lower = text.toLowerCase();
  const feedback = [];
  // Grammar check simulation
  if (/\bi\s+[a-z]/.test(text) && !/\bI\b/.test(text)) {
    feedback.push('🔤 **Grammar tip:** "i" should be capitalized as **"I"** in English.');
  }
  if (/\bhe don't\b|\bshe don't\b/i.test(text)) {
    feedback.push('🔤 **Grammar tip:** Use "doesn\'t" instead of "don\'t" for third-person singular.');
  }
  // Vocabulary enhancement
  const goodWords = ['implement', 'design', 'architecture', 'scalable', 'robust', 'efficient', 'maintainable', 'distributed', 'asynchronous', 'fault-tolerant'];
  const found = goodWords.filter(w => lower.includes(w));
  if (found.length > 0) {
    feedback.push(`✅ **Good vocabulary:** "${found.join(', ')}" — senior-level terminology!`);
  } else {
    feedback.push('💡 **Tip:** Try using technical terms like "scalable", "fault-tolerant", "distributed" to sound more senior.');
  }
  // Length feedback
  if (text.length > 200) {
    feedback.push('📏 **Good length:** Detailed answer. Consider adding specific examples or numbers (QPS, latency, etc.).');
  } else if (text.length > 50) {
    feedback.push('📏 Try expanding with specific numbers (e.g., "handling 10K QPS with 99.9% uptime").');
  }
  if (feedback.length === 0) {
    feedback.push('💡 Continue typing — AI sẽ phân tích technical accuracy và grammar của bạn.');
  }
  typingAiFeedbackEl.innerHTML = feedback.map(f => `<div class="acc-feedback-item">${f}</div>`).join('');
}

// ---- Session Timer (Real-time countdown) ----
function setupStartSession() {
  if (!startSessionBtnEl) return;
  startSessionBtnEl.addEventListener('click', () => {
    if (sessionActive) return;
    sessionActive = true;
    startSession();
    startSessionBtnEl.textContent = '🔴 Đang học...';
    startSessionBtnEl.disabled = true;
    if (sessionTimerEl) sessionTimerEl.classList.add('active');
    sessionInterval = setInterval(() => {
      const elapsed = getSessionElapsed();
      updateSessionTimer(elapsed);
      if (elapsed >= SESSION_DURATION) autoCompleteSession();
    }, 1000);
    showAchievement('⚒️', 'Bắt đầu phiên học!', 'Học đều mỗi ngày 1h bạn nhé!');
  });
}

function updateSessionTimer(seconds) {
  if (!sessionTimerEl) return;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  sessionTimerEl.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  // Update progress ring
  const ringEl = document.getElementById('acc-session-ring');
  if (ringEl) {
    const ratio = Math.min(1, seconds / SESSION_DURATION);
    const offset = CIRCUMFERENCE * (1 - ratio);
    ringEl.style.strokeDashoffset = offset;
  }
}

function autoCompleteSession() {
  if (sessionInterval) clearInterval(sessionInterval);
  const minutes = endSession();
  sessionActive = false;
  if (startSessionBtnEl) { startSessionBtnEl.textContent = '⚒️ Bắt đầu 1h'; startSessionBtnEl.disabled = false; }
  if (sessionTimerEl) sessionTimerEl.classList.remove('active');
  showAchievement('🎯', `Hoàn thành ${minutes} phút!`, 'Mỗi ngày 1h, 30 ngày — bạn đang trên đường!');
  renderProgress();
}

function checkSessionRestore() {
  const elapsed = getSessionElapsed();
  if (elapsed > 0 && elapsed < SESSION_DURATION) {
    sessionActive = true;
    if (startSessionBtnEl) { startSessionBtnEl.textContent = '🔴 Đang học...'; startSessionBtnEl.disabled = true; }
    if (sessionTimerEl) sessionTimerEl.classList.add('active');
    sessionInterval = setInterval(() => {
      const e = getSessionElapsed();
      updateSessionTimer(e);
      if (e >= SESSION_DURATION) autoCompleteSession();
    }, 1000);
  }
}

// ---- Day Navigation ----
function initDayNavigation() {
  if (dayNavLeftEl) dayNavLeftEl.addEventListener('click', () => navigateDay(-1));
  if (dayNavRightEl) dayNavRightEl.addEventListener('click', () => navigateDay(1));
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) navigateDay(-1);
    if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) navigateDay(1);
  });
}

function navigateDay(delta) {
  const current = getCurrentDay();
  const next = current + delta;
  if (next < 1 || next > 30) return;
  setCurrentDay(next);
  renderDay(next);
  renderDayGrid();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Clear typing area
  if (typingAreaEl) typingAreaEl.value = '';
  if (typingAiFeedbackEl) { typingAiFeedbackEl.innerHTML = ''; typingAiFeedbackEl.classList.remove('active'); }
  if (transcriptEl) transcriptEl.innerHTML = '';
}

// ---- Render Day Content ----
function renderDay(dayNumber) {
  const dayData = ACCELERATOR_DAYS.find(d => d.day === dayNumber);
  if (!dayData) return;

  const completed = isDayCompleted(dayNumber);
  const score = getDayScore(dayNumber);

  if (dayEl) dayEl.textContent = `Day ${String(dayNumber).padStart(2, '0')}`;
  if (titleEl) titleEl.textContent = dayData.title;
  if (techConceptEl) techConceptEl.innerHTML = `<strong>Technical Concept:</strong> ${dayData.techConcept}`;
  if (techPracticeEl) techPracticeEl.innerHTML = `<strong>Practice:</strong> ${dayData.techPractice}`;
  if (englishVocabEl) {
    englishVocabEl.innerHTML = '<strong>Vocabulary:</strong> ';
    renderVocabChips(dayData.englishVocab);
  }
  if (englishListeningEl) englishListeningEl.innerHTML = `<strong>🎧 Listening:</strong> ${dayData.englishListening}`;
  if (englishPracticeEl) englishPracticeEl.innerHTML = `<strong>🗣️ Speaking Practice:</strong> ${dayData.englishPractice}`;
  if (systemDesignCaseEl) systemDesignCaseEl.innerHTML = `<strong>🏛️ System Design:</strong> ${dayData.systemDesignCase}`;
  if (keyTakeawayEl) keyTakeawayEl.innerHTML = `💡 <strong>Key Takeaway:</strong> ${dayData.keyTakeaway}`;
  if (completionMsgEl) {
    completionMsgEl.textContent = dayData.completionMessage;
    completionMsgEl.classList.toggle('completed', !!completed);
  }
  if (completeBtnEl) completeBtnEl.textContent = completed ? '✅ Đã hoàn thành' : '🎯 Hoàn thành ngày này';
  if (completeBtnEl) completeBtnEl.disabled = !!completed;

  // Update typing area data type
  if (typingAreaEl) {
    typingAreaEl.placeholder = 'Practice your answer in English... Type your technical explanation here...';
    typingAreaEl.dataset.type = 'tech';
  }
}

function renderVocabChips(vocabList) {
  if (!vocabChipsEl) return;
  vocabChipsEl.innerHTML = '';
  if (!vocabList || vocabList.length === 0) {
    vocabChipsEl.innerHTML = '<span class="acc-vocab-chip">No vocabulary</span>';
    return;
  }
  vocabList.forEach(word => {
    const chip = document.createElement('span');
    chip.className = 'acc-vocab-chip';
    chip.textContent = word;
    chip.addEventListener('click', () => {
      if (typingAreaEl) typingAreaEl.value += (typingAreaEl.value ? ' ' : '') + word;
      typingAreaEl?.focus();
      typingAreaEl?.dispatchEvent(new Event('input'));
    });
    vocabChipsEl.appendChild(chip);
  });
}

// ---- Progress Bar (Real-time) ----
function renderProgress() {
  const p = getProgress();
  if (progressBarEl) progressBarEl.style.width = `${p.percent}%`;
  if (progressPctEl) progressPctEl.textContent = `${p.percent}% (${p.completed}/30)`;
  if (xpEl) xpEl.textContent = `${p.xp} XP`;
  if (streakEl) streakEl.textContent = `🔥 ${p.streak} ngày`;
}

// ---- Day Grid (Collapsible Week Navigation) ----
function renderDayGrid() {
  if (!dayGridEl) return;
  const current = getCurrentDay();
  dayGridEl.innerHTML = '';

  for (let week = 1; week <= 6; week++) {
    const startDay = (week - 1) * 5 + 1;
    const endDay = week * 5;

    const weekGroup = document.createElement('div');
    weekGroup.className = 'acc-week-group';
    weekGroup.dataset.week = week;

    const weekHeader = document.createElement('div');
    weekHeader.className = 'acc-week-header';
    weekHeader.innerHTML = `<span>Tuần ${week}</span><span class="acc-week-arrow">▾</span>`;
    weekHeader.addEventListener('click', () => {
      weekGroup.classList.toggle('collapsed');
    });

    const weekDays = document.createElement('div');
    weekDays.className = 'acc-week-days';

    for (let d = startDay; d <= endDay; d++) {
      const dayData = ACCELERATOR_DAYS.find(ad => ad.day === d);
      if (!dayData) continue;
      const completed = isDayCompleted(d);
      const isCurrent = d === current;

      const btn = document.createElement('button');
      btn.className = 'acc-day-btn';
      btn.classList.toggle('completed', completed);
      btn.classList.toggle('current', isCurrent);
      btn.innerHTML = `<span class="acc-day-num">${String(d).padStart(2, '0')}</span><span class="acc-day-title">${dayData.title}</span>`;
      if (completed) btn.innerHTML += ' <span class="acc-day-check">✅</span>';
      btn.addEventListener('click', () => {
        setCurrentDay(d);
        renderDay(d);
        renderDayGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (typingAreaEl) typingAreaEl.value = '';
        if (typingAiFeedbackEl) { typingAiFeedbackEl.innerHTML = ''; typingAiFeedbackEl.classList.remove('active'); }
      });
      weekDays.appendChild(btn);
    }

    weekGroup.appendChild(weekHeader);
    weekGroup.appendChild(weekDays);
    dayGridEl.appendChild(weekGroup);

    // Auto-expand current week by default
    if (current >= startDay && current <= endDay) {
      // keep expanded
    } else {
      weekGroup.classList.add('collapsed');
    }
  }

  // Scroll current day into view
  const currentBtn = dayGridEl.querySelector('.acc-day-btn.current');
  if (currentBtn) currentBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---- Complete Button ----
function setupCompleteButton() {
  if (!completeBtnEl) return;
  completeBtnEl.addEventListener('click', () => {
    const day = getCurrentDay();
    if (isDayCompleted(day)) return;
    const sessionMin = Math.max(1, Math.round(getSessionElapsed() / 60));
    const result = completeDay(day, sessionMin, 8);
    renderDay(day);
    renderProgress();
    renderDayGrid();
    // Toast achievement
    showAchievement('🎉', `Day ${day} hoàn thành!`, `+${result.xpReward} XP • Streak: ${result.streak}🔥`);
    // Auto advance
    if (result.newDay <= 30 && result.newDay !== day) {
      setTimeout(() => {
        setCurrentDay(result.newDay);
        renderDay(result.newDay);
        renderDayGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
    // Stop session timer
    if (sessionInterval) clearInterval(sessionInterval);
    sessionActive = false;
    if (startSessionBtnEl) { startSessionBtnEl.textContent = '⚒️ Bắt đầu 1h'; startSessionBtnEl.disabled = false; }
  });
}

// ---- Keyboard Shortcuts ----
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Enter: complete day
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      completeBtnEl?.click();
    }
    // Escape: stop speech
    if (e.key === 'Escape' && isListening) toggleSpeech(false);
  });
}

// ---- Achievement Toast (Real-time) ----
function showAchievement(icon, title, desc) {
  if (!toastContainerEl) return;
  const toast = document.createElement('div');
  toast.className = 'acc-toast';
  toast.innerHTML = `<span class="acc-toast-icon">${icon}</span><div><strong>${title}</strong><br><small>${desc}</small></div>`;
  toastContainerEl.appendChild(toast);
  // Animate in
  requestAnimationFrame(() => toast.classList.add('show'));
  // Auto remove
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function welcomeAchievement() {
  const p = getProgress();
  if (p.completed === 0) {
    setTimeout(() => {
      showAchievement('🚀', 'Chào mừng đến với Accelerator!', '30 ngày — 1h/ngày — lên senior!');
    }, 500);
  }
}

// ---- Simple Markdown to HTML ----
function markdownToHTML(md) {
  if (!md) return '';
  return md
    .replace(/### (.+)/g, '<h4>$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}
