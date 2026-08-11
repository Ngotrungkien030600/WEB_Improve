/**
 * Interview SRS — Spaced Repetition for Interview Questions
 * Integrates SM-2 algorithm with interview topic questions.
 * Tracks weak points and schedules reviews optimally.
 */

import { getTopics } from './interview-logic.js';

window.interviewSRS = {
  /** Extract questions from interview topics for SRS */
  extractQuestions() {
    const topics = getTopics();
    const questions = [];

    topics.forEach((topic, topicIndex) => {
      // Extract questions from content (lines starting with numbers or patterns)
      const lines = (topic.content || '').split('\n');
      let currentSection = '';

      lines.forEach(line => {
        // Track section headers
        const sectionMatch = line.match(/^##?\s+(.+)/);
        if (sectionMatch) {
          currentSection = sectionMatch[1].trim();
          return;
        }

        // Extract numbered questions
        const numMatch = line.match(/^\d+[\.\)]\s+(.+)/);
        if (numMatch) {
          questions.push({
            id: `q-${topicIndex}-${questions.length}`,
            topicIndex,
            topicTitle: topic.title,
            section: currentSection,
            question: numMatch[1].trim(),
            answer: '', // User must recall
            difficulty: this._estimateDifficulty(numMatch[1]),
          });
        }
      });
    });

    return questions;
  },

  /** Estimate question difficulty based on keywords */
  _estimateDifficulty(question) {
    const hardKeywords = ['design', 'implement', 'optimize', 'explain', 'compare', 'analyze', 'architecture', 'scalable'];
    const mediumKeywords = ['difference', 'what is', 'how does', 'why', 'when'];
    
    const q = question.toLowerCase();
    
    if (hardKeywords.some(k => q.includes(k))) return 'hard';
    if (mediumKeywords.some(k => q.includes(k))) return 'medium';
    return 'easy';
  },

  /** Get questions due for review based on SRS */
  async getDueQuestions(limit = 10) {
    const srs = window.srsSystem;
    if (!srs) return [];

    const dueCards = await srs.getDueCards(limit);
    const topics = getTopics();
    
    // Convert SRS cards back to questions
    return dueCards
      .map(card => {
        const [_, topicIdx, qIdx] = card.id.split('-');
        const topic = topics[parseInt(topicIdx)];
        if (!topic) return null;
        
        const questions = this._getTopicQuestions(parseInt(topicIdx));
        const q = questions[parseInt(qIdx)];
        return q ? { ...q, card } : null;
      })
      .filter(Boolean);
  },

  /** Get questions for a specific topic */
  _getTopicQuestions(topicIndex) {
    const topics = getTopics();
    const topic = topics[topicIndex];
    if (!topic) return [];

    const questions = [];
    const lines = (topic.content || '').split('\n');
    let currentSection = '';

    lines.forEach(line => {
      const sectionMatch = line.match(/^##?\s+(.+)/);
      if (sectionMatch) {
        currentSection = sectionMatch[1].trim();
        return;
      }

      const numMatch = line.match(/^\d+[\.\)]\s+(.+)/);
      if (numMatch) {
        questions.push({
          question: numMatch[1].trim(),
          section: currentSection,
          difficulty: this._estimateDifficulty(numMatch[1]),
        });
      }
    });

    return questions;
  },

  /** Record a review result */
  async recordReview(topicIndex, questionIndex, quality) {
    // quality: 0=forgot, 1=hard, 2=good, 3=easy
    const srs = window.srsSystem;
    if (!srs) return;

    const cardId = `q-${topicIndex}-${questionIndex}`;
    await srs.review(cardId, 'interview', quality);
    
    // If failed, track as weak point
    if (quality < 2) {
      await this._trackWeakPoint(topicIndex, questionIndex);
    }
  },

  /** Track weak points */
  async _trackWeakPoint(topicIndex, questionIndex) {
    await window.progressDB.init();
    
    const key = `weak-${topicIndex}-${questionIndex}`;
    const existing = await this._getWeakPoint(topicIndex, questionIndex);
    
    await window.progressDB.db.transaction('stats', 'readwrite').objectStore('stats').put({
      key,
      topicIndex,
      questionIndex,
      failCount: (existing?.failCount || 0) + 1,
      lastFailed: new Date().toISOString(),
    });
  },

  /** Get weak point data */
  async _getWeakPoint(topicIndex, questionIndex) {
    await window.progressDB.init();
    const key = `weak-${topicIndex}-${questionIndex}`;
    
    return new Promise(resolve => {
      const tx = window.progressDB.db.transaction('stats', 'readonly');
      const req = tx.objectStore('stats').get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    });
  },

  /** Get all weak points sorted by fail count */
  async getWeakPoints(limit = 10) {
    await window.progressDB.init();
    const topics = getTopics();
    
    return new Promise(resolve => {
      const tx = window.progressDB.db.transaction('stats', 'readonly');
      const req = tx.objectStore('stats').getAll();
      req.onsuccess = () => {
        const weakPoints = req.result
          .filter(s => s.key.startsWith('weak-'))
          .map(s => ({
            topicIndex: s.topicIndex,
            questionIndex: s.questionIndex,
            failCount: s.failCount,
            lastFailed: s.lastFailed,
            topic: topics[s.topicIndex],
            question: this._getQuestionByIndex(s.topicIndex, s.questionIndex),
          }))
          .filter(wp => wp.topic && wp.question)
          .sort((a, b) => b.failCount - a.failCount)
          .slice(0, limit);
        
        resolve(weakPoints);
      };
      req.onerror = () => resolve([]);
    });
  },

  /** Get question text by topic and question index */
  _getQuestionByIndex(topicIndex, questionIndex) {
    const questions = this._getTopicQuestions(topicIndex);
    return questions[questionIndex]?.question || '';
  },

  /** Get SRS statistics */
  async getStats() {
    const srs = window.srsSystem;
    if (!srs) return null;

    const srsStats = await srs.getStats();
    const weakPoints = await this.getWeakPoints(5);
    const topics = getTopics();

    // Calculate mastery per topic
    const topicMastery = topics.map((topic, idx) => {
      const questions = this._getTopicQuestions(idx);
      if (questions.length === 0) return { topicIndex: idx, title: topic.title, mastered: 0, total: 0 };
      
      return { topicIndex: idx, title: topic.title, mastered: 0, total: questions.length };
    });

    return {
      ...srsStats,
      weakPoints,
      topicMastery,
      totalQuestions: topicMastery.reduce((sum, t) => sum + t.total, 0),
    };
  },

  /** Initialize SRS cards for all interview questions */
  async initializeCards() {
    const srs = window.srsSystem;
    if (!srs) return;

    const allQuestions = [];
    const topics = getTopics();

    topics.forEach((topic, topicIndex) => {
      const questions = this._getTopicQuestions(topicIndex);
      questions.forEach((q, qIndex) => {
        allQuestions.push({
          id: `q-${topicIndex}-${qIndex}`,
          category: 'interview',
          question: q.question,
          section: q.section,
          difficulty: q.difficulty,
        });
      });
    });

    // Import into SRS
    await srs.importWords(
      allQuestions.map(q => ({ id: q.id, ...q })),
      'interview'
    );

    return allQuestions.length;
  },

  /** Get review quality description */
  qualityToLabel(quality) {
    const labels = {
      0: 'Quên hoàn toàn 😢',
      1: 'Nhớ lờ mờ 😐',
      2: 'Trả lời được 👍',
      3: 'Thuần thục 🎯',
    };
    return labels[quality] || 'Không rõ';
  },
};

// ES module exports for other modules
export const getStats = (...args) => window.interviewSRS.getStats(...args);
export const getWeakPoints = (...args) => window.interviewSRS.getWeakPoints(...args);
export const recordReview = (...args) => window.interviewSRS.recordReview(...args);
export const initializeCards = (...args) => window.interviewSRS.initializeCards(...args);
