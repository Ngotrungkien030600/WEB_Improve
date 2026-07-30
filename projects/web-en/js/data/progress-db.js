/**
 * Progress Database — IndexedDB-based persistent progress tracking
 * Replaces localStorage for more reliable, structured progress storage.
 * Supports: study history, completed items, skill points, streaks, goals.
 */
window.progressDB = {
  dbName: 'SkillForgeProgress',
  dbVersion: 2,
  db: null,

  /** Initialize/upgrade database */
  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;

        // Study sessions
        if (!db.objectStoreNames.contains('sessions')) {
          const sessions = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
          sessions.createIndex('date', 'date', { unique: false });
          sessions.createIndex('type', 'type', { unique: false });
        }

        // Completed items
        if (!db.objectStoreNames.contains('completed')) {
          const completed = db.createObjectStore('completed', { keyPath: 'id' });
          completed.createIndex('category', 'category', { unique: false });
          completed.createIndex('completedAt', 'completedAt', { unique: false });
        }

        // Skill points & streaks
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'key' });
        }

        // Goals
        if (!db.objectStoreNames.contains('goals')) {
          const goalsStore = db.createObjectStore('goals', { keyPath: 'id', autoIncrement: true });
          goalsStore.createIndex('dueDate', 'dueDate', { unique: false });
          goalsStore.createIndex('status', 'status', { unique: false });
        }

        // Bookmarks
        if (!db.objectStoreNames.contains('bookmarks')) {
          const bookmarks = db.createObjectStore('bookmarks', { keyPath: 'id' });
          bookmarks.createIndex('category', 'category', { unique: false });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  },

  /** Record a study session */
  async logSession({ type, itemId, duration, score, total }) {
    await this.init();
    const session = {
      date: new Date().toISOString(),
      type,
      itemId: itemId || null,
      duration: duration || 0,
      score: score || 0,
      total: total || 0,
      percentage: total > 0 ? Math.round((score / total) * 100) : 0,
    };
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sessions', 'readwrite');
      const store = tx.objectStore('sessions');
      const req = store.add(session);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /** Mark item as completed */
  async markCompleted(itemId, category, type, data = {}) {
    await this.init();
    const entry = {
      id: `${type}-${itemId}`,
      category,
      type,
      itemId,
      completedAt: new Date().toISOString(),
      ...data,
    };
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('completed', 'readwrite');
      const store = tx.objectStore('completed');
      const req = store.put(entry);
      req.onsuccess = () => resolve(entry);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /** Check if item is completed */
  async isCompleted(itemId, type) {
    await this.init();
    const key = `${type}-${itemId}`;
    return new Promise((resolve) => {
      const tx = this.db.transaction('completed', 'readonly');
      const store = tx.objectStore('completed');
      const req = store.get(key);
      req.onsuccess = () => resolve(!!req.result);
      req.onerror = () => resolve(false);
    });
  },

  /** Get all completed items of a type */
  async getCompletedByType(type) {
    await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('completed', 'readonly');
      const store = tx.objectStore('completed');
      const req = store.getAll();
      req.onsuccess = () => {
        const all = req.result || [];
        resolve(type ? all.filter(i => i.type === type) : all);
      };
      req.onerror = () => resolve([]);
    });
  },

  /** Get streak (consecutive days with study sessions) */
  async getStreak() {
    await this.init();
    const sessions = await this.getRecentSessions(365);
    if (sessions.length === 0) return { current: 0, longest: 0 };

    // Get unique dates sorted
    const dates = [...new Set(sessions.map(s => s.date.split('T')[0]))].sort().reverse();
    let current = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    for (let i = 0; i < dates.length; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates[i] === dateStr) {
        current++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Allow for today not yet having a session (check yesterday)
        if (i === 0 && dates[0] === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
          current = 1;
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    // Calculate longest streak
    let longest = 0, temp = 1;
    dates.sort().forEach((d, i) => {
      if (i > 0) {
        const prev = new Date(dates[i-1]);
        const curr = new Date(d);
        const diff = (curr - prev) / 86400000;
        if (diff === 1) temp++;
        else { longest = Math.max(longest, temp); temp = 1; }
      }
    });
    longest = Math.max(longest, temp);

    return { current, longest };
  },

  /** Get sessions for the last N days */
  async getRecentSessions(days = 30) {
    await this.init();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Promise((resolve) => {
      const tx = this.db.transaction('sessions', 'readonly');
      const store = tx.objectStore('sessions');
      const index = store.index('date');
      const range = IDBKeyRange.lowerBound(cutoff.toISOString());
      const req = index.getAll(range);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  /** Get total stats */
  async getTotalStats() {
    await this.init();
    const sessions = await this.getRecentSessions(365);
    const completed = await this.getCompletedByType();

    const totalStudyTime = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const quizzesTaken = sessions.filter(s => s.type === 'quiz').length;
    const avgQuizScore = sessions.filter(s => s.type === 'quiz' && s.total > 0)
      .reduce((sum, s, _, arr) => sum + (s.percentage || 0) / arr.length, 0);

    const streak = await this.getStreak();

    return {
      totalSessions: sessions.length,
      totalStudyTime, // in minutes
      quizzesTaken,
      avgQuizScore: Math.round(avgQuizScore),
      completedItems: completed.length,
      ...streak,
    };
  },

  /** Save a user goal */
  async saveGoal(goal) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('goals', 'readwrite');
      const store = tx.objectStore('goals');
      const req = store.add({
        ...goal,
        createdAt: new Date().toISOString(),
        status: goal.status || 'active',
      });
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /** Toggle bookmark for an item */
  async toggleBookmark(itemId, category, type, title) {
    await this.init();
    const existing = await this.getBookmark(itemId);
    if (existing) {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('bookmarks', 'readwrite');
        const store = tx.objectStore('bookmarks');
        const req = store.delete(itemId);
        req.onsuccess = () => resolve(false);
        req.onerror = (e) => reject(e.target.error);
      });
    } else {
      return new Promise((resolve, reject) => {
        const tx = this.db.transaction('bookmarks', 'readwrite');
        const store = tx.objectStore('bookmarks');
        const req = store.add({ id: itemId, category, type, title, createdAt: new Date().toISOString() });
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e.target.error);
      });
    }
  },

  /** Get bookmark status */
  async getBookmark(itemId) {
    await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('bookmarks', 'readonly');
      const store = tx.objectStore('bookmarks');
      const req = store.get(itemId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  },

  /** Get all bookmarks */
  async getAllBookmarks() {
    await this.init();
    return new Promise((resolve) => {
      const tx = this.db.transaction('bookmarks', 'readonly');
      const store = tx.objectStore('bookmarks');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  /** Migrate from localStorage to IndexedDB */
  async migrateFromLocalStorage() {
    try {
      // Migrate exam history
      const examHistory = localStorage.getItem('skillforge_exam_history');
      if (examHistory) {
        const exams = JSON.parse(examHistory);
        for (const exam of exams) {
          await this.logSession({
            type: 'quiz',
            itemId: exam.topic || 'general',
            duration: exam.duration || 0,
            score: exam.correct || 0,
            total: exam.total || 0,
          });
        }
      }

      // Migrate timer state
      const timerState = localStorage.getItem('skillforge_timer_state');
      if (timerState) {
        const timer = JSON.parse(timerState);
        if (timer.pomodoroCount > 0) {
          await this.logSession({
            type: 'focus',
            itemId: 'pomodoro',
            duration: timer.pomodoroCount * 25,
          });
        }
      }

      // Migrate skill tracker
      const skillState = localStorage.getItem('skillforge_skill_state');
      if (skillState) {
        const stats = JSON.parse(skillState);
        const store = this.db.transaction('stats', 'readwrite').objectStore('stats');
        if (stats.xp) store.put({ key: 'xp', value: stats.xp });
        if (stats.level) store.put({ key: 'level', value: stats.level });
        if (stats.streak) store.put({ key: 'previousStreak', value: stats.streak });
      }

      return true;
    } catch (e) {
      console.warn('Migration from localStorage failed:', e);
      return false;
    }
  },
};
