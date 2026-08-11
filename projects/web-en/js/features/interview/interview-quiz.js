/**
 * Interview Quiz Mode — Active Recall Practice
 * Uses spaced repetition to prioritize weak points.
 */

import { getTopics } from './interview-logic.js';
import { getStats, getWeakPoints, recordReview } from './interview-srs.js';

let isQuizMode = false;
let currentQuestion = null;
let questions = [];
let currentIndex = 0;
let showingAnswer = false;
let sessionStats = { correct: 0, wrong: 0, skipped: 0 };

let _initCount = 0;
export function initQuizMode() {
  _initCount++;
  console.log('[Quiz] initQuizMode called:', _initCount);
  
  const quizBtn = document.getElementById('quiz-mode-btn');
  if (!quizBtn) {
    console.log('[Quiz] Button not found');
    return;
  }

  // Prevent duplicate listeners
  if (quizBtn.dataset.bound) {
    console.log('[Quiz] Already bound, skipping');
    return;
  }
  quizBtn.dataset.bound = '1';

  // Override click to log any programmatic calls
  const originalClick = quizBtn.onclick;
  quizBtn.onclick = null;
  
  console.log('[Quiz] Button bound, waiting for click...');
  quizBtn.addEventListener('click', (e) => {
    const isTrusted = e.isTrusted;
    console.log('[Quiz] Button clicked! isTrusted:', isTrusted);
    if (!isTrusted) {
      console.log('[Quiz] WARNING: Programmatic click detected!');
    }
    toggleQuizMode();
  });
}

/** Start quiz focused on specific weak points (for focus-weak-points event) */
export async function startQuizWithWeakPoints(weakPoints) {
  const mainContent = document.querySelector('.interview-content-wrapper');
  if (!mainContent) return;

  isQuizMode = true;
  sessionStats = { correct: 0, wrong: 0, skipped: 0 };
  const topics = getTopics();

  // Build question pool from weak points only
  questions = weakPoints.map(wp => ({
    topicIndex: wp.topicIndex,
    questionIndex: wp.questionIndex,
    question: wp.question,
    topicTitle: wp.topic?.title || '',
    isWeak: true,
    failCount: wp.failCount,
  }));

  // Fill with more weak points if needed
  if (questions.length < 10) {
    const allWeakPoints = await getWeakPoints(15);
    const filled = new Set(questions.map(q => `${q.topicIndex}-${q.questionIndex}`));
    for (const wp of allWeakPoints) {
      if (questions.length >= 15) break;
      const key = `${wp.topicIndex}-${wp.questionIndex}`;
      if (!filled.has(key)) {
        questions.push({
          topicIndex: wp.topicIndex,
          questionIndex: wp.questionIndex,
          question: wp.question,
          topicTitle: wp.topic?.title || '',
          isWeak: true,
          failCount: wp.failCount,
        });
        filled.add(key);
      }
    }
  }

  questions = shuffleArray(questions);
  currentIndex = 0;
  renderQuizUI(mainContent);
  showQuestion();
}

export async function toggleQuizMode() {
  const mainContent = document.querySelector('.interview-content-wrapper');
  if (!mainContent) return;

  if (!isQuizMode) {
    // Start quiz mode
    await startQuizMode(mainContent);
  } else {
    // End quiz mode
    exitQuizMode(mainContent);
  }
}

async function startQuizMode(container) {
  isQuizMode = true;
  sessionStats = { correct: 0, wrong: 0, skipped: 0 };

  // Get weak points first, then fill with random questions
  const weakPoints = await getWeakPoints(5);
  const topics = getTopics();
  
  // Build question pool prioritizing weak points
  questions = [];
  
  // Add weak points
  weakPoints.forEach(wp => {
    questions.push({
      topicIndex: wp.topicIndex,
      questionIndex: wp.questionIndex,
      question: wp.question,
      topicTitle: wp.topic?.title || '',
      isWeak: true,
      failCount: wp.failCount,
    });
  });

  // Fill remaining with random questions
  const filled = new Set(questions.map(q => `${q.topicIndex}-${q.questionIndex}`));
  const allQuestions = extractAllQuestions(topics);
  
  for (const q of allQuestions) {
    if (questions.length >= 15) break;
    const key = `${q.topicIndex}-${q.questionIndex}`;
    if (!filled.has(key)) {
      questions.push(q);
      filled.add(key);
    }
  }

  // Shuffle
  questions = shuffleArray(questions);
  currentIndex = 0;

  // Show quiz UI
  renderQuizUI(container);
  showQuestion();
}

function renderQuizUI(container) {
  container.innerHTML = `
    <div class="quiz-container">
      <div class="quiz-header">
        <h2>🎯 Luyện tập Active Recall</h2>
        <div class="quiz-stats">
          <span class="quiz-stat correct">✓ <span id="quiz-correct">0</span></span>
          <span class="quiz-stat wrong">✗ <span id="quiz-wrong">0</span></span>
          <span class="quiz-stat progress"><span id="quiz-current">1</span>/${questions.length}</span>
        </div>
        <button class="quiz-exit-btn" id="quiz-exit-btn">✕ Thoát Quiz</button>
      </div>
      
      <div class="quiz-card" id="quiz-card">
        <div class="quiz-topic" id="quiz-topic"></div>
        <div class="quiz-question" id="quiz-question"></div>
        <div class="quiz-answer" id="quiz-answer" style="display:none;"></div>
        <div class="quiz-weak-badge" id="quiz-weak-badge" style="display:none;">
          ⚠️ Điểm yếu cần luyện tập
        </div>
      </div>

      <div class="quiz-actions" id="quiz-actions" style="display:none;">
        <div class="quality-buttons">
          <button class="quality-btn forgot" data-quality="0">😢 Quên</button>
          <button class="quality-btn hard" data-quality="1">😐 Lờ mờ</button>
          <button class="quality-btn good" data-quality="2">👍 Được</button>
          <button class="quality-btn easy" data-quality="3">🎯 Thuần thục</button>
        </div>
      </div>

      <button class="show-answer-btn" id="show-answer-btn">👁️ Xem đáp án</button>
    </div>
  `;

  // Bind events
  document.getElementById('show-answer-btn').addEventListener('click', revealAnswer);
  document.getElementById('quiz-exit-btn').addEventListener('click', () => exitQuizMode(container));
  
  document.querySelectorAll('.quality-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const quality = parseInt(btn.dataset.quality);
      await handleAnswer(quality);
    });
  });
}

function extractAllQuestions(topics) {
  const questions = [];
  
  topics.forEach((topic, topicIndex) => {
    const lines = (topic.content || '').split('\n');
    let currentSection = '';

    lines.forEach(line => {
      // Section headers
      const sectionMatch = line.match(/^##?\s+(.+)/);
      if (sectionMatch) {
        currentSection = sectionMatch[1].trim();
        return;
      }

      // Questions
      const numMatch = line.match(/^\d+[\.\)]\s+(.+)/);
      if (numMatch) {
        questions.push({
          topicIndex,
          questionIndex: questions.length,
          question: numMatch[1].trim(),
          topicTitle: topic.title.replace(/^📄 /, ''),
          isWeak: false,
          section: currentSection,
        });
      }
    });
  });

  return questions;
}

function getAnswerForQuestion(question) {
  const topics = getTopics();
  const topic = topics[question.topicIndex];
  if (!topic) return '';

  const lines = topic.content.split('\n');
  const questionText = question.question;
  
  // Find the section containing this question and extract answer
  let foundQuestion = false;
  let answerLines = [];
  
  for (const line of lines) {
    const numMatch = line.match(/^\d+[\.\)]\s+(.+)/);
    if (numMatch && numMatch[1].trim() === questionText) {
      foundQuestion = true;
      continue;
    }
    
    if (foundQuestion) {
      // Stop at next question or new section
      if (line.match(/^\d+[\.\)]\s+/) || line.match(/^##\s+/)) {
        break;
      }
      if (line.trim()) {
        answerLines.push(line);
      }
    }
  }
  
  return answerLines.join('\n').trim() || 'Xem lại cheat sheet gốc để biết đáp án chi tiết.';
}

function showQuestion() {
  if (currentIndex >= questions.length) {
    showQuizComplete();
    return;
  }

  currentQuestion = questions[currentIndex];
  showingAnswer = false;

  const topicEl = document.getElementById('quiz-topic');
  const questionEl = document.getElementById('quiz-question');
  const answerEl = document.getElementById('quiz-answer');
  const actionsEl = document.getElementById('quiz-actions');
  const showBtn = document.getElementById('show-answer-btn');
  const weakBadge = document.getElementById('quiz-weak-badge');
  const currentNum = document.getElementById('quiz-current');

  topicEl.textContent = currentQuestion.topicTitle;
  questionEl.textContent = currentQuestion.question;
  answerEl.style.display = 'none';
  answerEl.innerHTML = getAnswerForQuestion(currentQuestion);
  actionsEl.style.display = 'none';
  showBtn.style.display = 'block';
  currentNum.textContent = currentIndex + 1;

  if (currentQuestion.isWeak) {
    weakBadge.style.display = 'block';
    weakBadge.textContent = `⚠️ Điểm yếu (đã sai ${currentQuestion.failCount} lần)`;
  } else {
    weakBadge.style.display = 'none';
  }
}

function revealAnswer() {
  showingAnswer = true;
  document.getElementById('quiz-answer').style.display = 'block';
  document.getElementById('show-answer-btn').style.display = 'none';
  document.getElementById('quiz-actions').style.display = 'flex';
}

async function handleAnswer(quality) {
  // Record to SRS
  await recordReview(currentQuestion.topicIndex, currentQuestion.questionIndex, quality);

  // Update stats
  if (quality < 2) {
    sessionStats.wrong++;
    document.getElementById('quiz-wrong').textContent = sessionStats.wrong;
    // Add back to queue if failed
    if (questions.length < 20) {
      questions.push({ ...currentQuestion, isWeak: true, failCount: (currentQuestion.failCount || 0) + 1 });
    }
  } else {
    sessionStats.correct++;
    document.getElementById('quiz-correct').textContent = sessionStats.correct;
  }

  // Next question
  currentIndex++;
  showQuestion();
}

function showQuizComplete() {
  const total = sessionStats.correct + sessionStats.wrong;
  const percent = total > 0 ? Math.round((sessionStats.correct / total) * 100) : 0;

  document.getElementById('quiz-card').innerHTML = `
    <div class="quiz-complete">
      <h3>🎉 Hoàn thành phiên luyện tập!</h3>
      <div class="quiz-result">
        <div class="result-score">${percent}%</div>
        <div class="result-details">
          <span class="correct">✓ Đúng: ${sessionStats.correct}</span>
          <span class="wrong">✗ Sai: ${sessionStats.wrong}</span>
        </div>
      </div>
      ${percent < 70 ? '<p class="result-warning">⚠️ Cần ôn lại thêm. Hãy tập trung vào các điểm yếu.</p>' : '<p class="result-good">✅ Tiến bộ tốt! Tiếp tục duy trì.</p>'}
      <button class="restart-btn" id="restart-quiz">🔄 Luyện tiếp</button>
    </div>
  `;

  document.getElementById('quiz-actions').style.display = 'none';
  document.getElementById('show-answer-btn').style.display = 'none';

  document.getElementById('restart-quiz').addEventListener('click', async () => {
    const container = document.querySelector('.interview-content-wrapper');
    await startQuizMode(container);
  });
}

function exitQuizMode(container) {
  isQuizMode = false;
  // Re-import interview UI
  import('./interview-ui.js').then(({ initInterviewUI }) => {
    initInterviewUI();
  });
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
