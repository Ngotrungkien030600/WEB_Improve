/**
 * Weak Point Dashboard — Track and focus on areas needing improvement
 */

import { getWeakPoints, getStats } from './interview-srs.js';

let weakPointPanel = null;

let _initCount = 0;
export function initWeakPointDashboard() {
  _initCount++;
  console.log('[WeakPoints] initWeakPointDashboard called:', _initCount);
  
  const statsEl = document.getElementById('weak-points-btn');
  if (!statsEl) {
    console.log('[WeakPoints] Button not found');
    return;
  }

  // Prevent duplicate listeners
  if (statsEl.dataset.bound) {
    console.log('[WeakPoints] Already bound, skipping');
    return;
  }
  statsEl.dataset.bound = '1';

  console.log('[WeakPoints] Button bound, waiting for click...');
  statsEl.addEventListener('click', () => {
    console.log('[WeakPoints] Button clicked!');
    toggleWeakPointPanel();
  });
}

export async function toggleWeakPointPanel() {
  if (weakPointPanel) {
    weakPointPanel.remove();
    weakPointPanel = null;
    return;
  }

  await renderWeakPointPanel();
}

async function renderWeakPointPanel() {
  const stats = await getStats();
  const weakPoints = await getWeakPoints(10);

  weakPointPanel = document.createElement('div');
  weakPointPanel.className = 'weak-point-panel';
  weakPointPanel.innerHTML = `
    <div class="weak-panel-header">
      <h3>📊 Phân tích điểm yếu</h3>
      <button class="close-panel" id="close-weak-panel">✕</button>
    </div>
    
    <div class="weak-summary">
      <div class="summary-stat">
        <span class="stat-value">${stats?.dueCards || 0}</span>
        <span class="stat-label">Cần ôn</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value">${weakPoints.length}</span>
        <span class="stat-label">Điểm yếu</span>
      </div>
      <div class="summary-stat">
        <span class="stat-value">${stats?.masteredCards || 0}</span>
        <span class="stat-label">Đã vững</span>
      </div>
    </div>

    <div class="weak-list">
      <h4>⚠️ Cần tập trung:</h4>
      ${weakPoints.length > 0 ? weakPoints.map(wp => `
        <div class="weak-item" data-topic="${wp.topicIndex}">
          <div class="weak-item-header">
            <span class="weak-fail-count">${wp.failCount}✗</span>
            <span class="weak-topic">${wp.topic?.title || 'Unknown'}</span>
          </div>
          <p class="weak-question">${wp.question}</p>
        </div>
      `).join('') : '<p class="no-weak-points">🎉 Chưa có điểm yếu nào! Tiếp tục luyện tập.</p>'}
    </div>

    <div class="weak-actions">
      <button class="weak-action-btn focus-btn" id="focus-weak">
        🎯 Luyện tập điểm yếu
      </button>
      <button class="weak-action-btn stats-btn" id="view-full-stats">
        📈 Xem thống kê đầy đủ
      </button>
    </div>
  `;

  document.body.appendChild(weakPointPanel);

  // Bind events
  document.getElementById('close-weak-panel').addEventListener('click', () => {
    weakPointPanel.remove();
    weakPointPanel = null;
  });

  document.getElementById('focus-weak').addEventListener('click', () => {
    // Focus on weak points - start quiz with only weak questions
    window.dispatchEvent(new CustomEvent('focus-weak-points', { detail: weakPoints }));
    weakPointPanel.remove();
    weakPointPanel = null;
  });

  document.getElementById('view-full-stats').addEventListener('click', () => {
    showFullStats(stats);
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (weakPointPanel && !weakPointPanel.contains(e.target) && 
        !document.getElementById('weak-points-btn')?.contains(e.target)) {
      weakPointPanel.remove();
      weakPointPanel = null;
    }
  });
}

function showFullStats(stats) {
  const modal = document.createElement('div');
  modal.className = 'stats-modal';
  modal.innerHTML = `
    <div class="stats-modal-content">
      <div class="stats-modal-header">
        <h3>📈 Thống kê học tập</h3>
        <button class="close-modal" id="close-stats-modal">✕</button>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">📚</span>
          <span class="stat-number">${stats?.totalCards || 0}</span>
          <span class="stat-desc">Tổng câu hỏi</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⏰</span>
          <span class="stat-number">${stats?.dueCards || 0}</span>
          <span class="stat-desc">Cần ôn hôm nay</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <span class="stat-number">${stats?.masteredCards || 0}</span>
          <span class="stat-desc">Đã thuần thục</span>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📝</span>
          <span class="stat-number">${stats?.learningCards || 0}</span>
          <span class="stat-desc">Đang học</span>
        </div>
      </div>

      <div class="stats-section">
        <h4>📊 Độ khó</h4>
        <div class="difficulty-bars">
          <div class="difficulty-row">
            <span>Dễ</span>
            <div class="bar-bg">
              <div class="bar-fill easy" style="width: ${calculateEasyPercent(stats)}%"></div>
            </div>
          </div>
          <div class="difficulty-row">
            <span>Trung bình</span>
            <div class="bar-bg">
              <div class="bar-fill medium" style="width: ${calculateMediumPercent(stats)}%"></div>
            </div>
          </div>
          <div class="difficulty-row">
            <span>Khó</span>
            <div class="bar-bg">
              <div class="bar-fill hard" style="width: ${calculateHardPercent(stats)}%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <h4>🏆 Mastery theo chủ đề</h4>
        <div class="topic-mastery">
          ${(stats?.topicMastery || []).slice(0, 10).map(t => `
            <div class="topic-mastery-item">
              <span class="topic-name">${t.title?.replace(/^📄 /, '') || 'Unknown'}</span>
              <div class="mastery-bar-bg">
                <div class="mastery-bar-fill" style="width: ${t.total > 0 ? (t.mastered/t.total*100) : 0}%"></div>
              </div>
              <span class="mastery-percent">${t.total > 0 ? Math.round(t.mastered/t.total*100) : 0}%</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="stats-footer">
        <p>💡 Mẹo: Học đều mỗi ngày để duy trì streak và cải thiện trí nhớ dài hạn.</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById('close-stats-modal').addEventListener('click', () => modal.remove());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function calculateEasyPercent(stats) {
  if (!stats?.topicMastery) return 0;
  const total = stats.topicMastery.reduce((sum, t) => sum + t.total, 0);
  const easy = stats.topicMastery.reduce((sum, t) => sum + Math.floor(t.total * 0.3), 0);
  return total > 0 ? (easy / total * 100) : 0;
}

function calculateMediumPercent(stats) {
  if (!stats?.topicMastery) return 0;
  const total = stats.topicMastery.reduce((sum, t) => sum + t.total, 0);
  const medium = stats.topicMastery.reduce((sum, t) => sum + Math.floor(t.total * 0.4), 0);
  return total > 0 ? (medium / total * 100) : 0;
}

function calculateHardPercent(stats) {
  if (!stats?.topicMastery) return 0;
  const total = stats.topicMastery.reduce((sum, t) => sum + t.total, 0);
  const hard = stats.topicMastery.reduce((sum, t) => sum + Math.floor(t.total * 0.3), 0);
  return total > 0 ? (hard / total * 100) : 0;
}
