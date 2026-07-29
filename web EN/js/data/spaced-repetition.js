/**
 * Spaced Repetition System (SRS) — Smart vocabulary review scheduler
 * Implements SM-2 algorithm for optimal memory retention.
 * Uses IndexedDB for persistent review history.
 */
window.srsSystem = {
  dbName: 'SkillForgeSRS',
  dbVersion: 1,
  storeName: 'reviewHistory',
  db: null,

  // SM-2 default parameters
  params: {
    minInterval: 1,      // days
    maxInterval: 365,    // days
    easyBonus: 1.3,      // bonus for easy ratings
    initialInterval: 1,  // days after first review
    initialEase: 2.5,    // starting ease factor
  },

  /** Initialize IndexedDB */
  async initDB() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('dueDate', 'dueDate', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('difficulty', 'difficulty', { unique: false });
        }
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onerror = (e) => reject(e.target.error);
    });
  },

  /** Get a card's review state, creating default if new */
  async getCard(wordId, category) {
    await this.initDB();
    return new Promise((resolve) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(wordId);
      req.onsuccess = () => {
        if (req.result) resolve(req.result);
        else resolve(this._createDefaultCard(wordId, category));
      };
      req.onerror = () => resolve(this._createDefaultCard(wordId, category));
    });
  },

  /** Create default card state for a new word */
  _createDefaultCard(id, category) {
    return {
      id,
      category: category || 'unknown',
      ease: this.params.initialEase,
      interval: 0,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      lastReviewed: null,
      lapses: 0,
    };
  },

  /** Record a review and calculate next review date (SM-2 algorithm) */
  async review(wordId, category, quality) {
    // quality: 0=forgot, 1=hard, 2=good, 3=easy
    await this.initDB();
    const card = await this.getCard(wordId, category);

    if (quality < 2) {
      // Failed: reset interval
      card.lapses += 1;
      card.repetitions = 0;
      card.interval = 1;
    } else {
      // Passed: SM-2 interval calculation
      card.repetitions += 1;
      if (card.repetitions === 1) card.interval = 1;
      else if (card.repetitions === 2) card.interval = 6;
      else card.interval = Math.round(card.interval * card.ease);

      // Cap at max
      card.interval = Math.min(card.interval, this.params.maxInterval);
    }

    // Update ease factor (SM-2 formula)
    card.ease = Math.max(1.3, card.ease + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02)));

    // Set next review date
    const now = new Date();
    card.lastReviewed = now.toISOString();
    const nextDate = new Date(now);
    nextDate.setDate(nextDate.getDate() + card.interval);
    card.dueDate = nextDate.toISOString();

    // Save to DB
    await this._saveCard(card);
    return card;
  },

  /** Save card to IndexedDB */
  _saveCard(card) {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(card);
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  },

  /** Get all cards due for review (sorted by due date) */
  async getDueCards(limit = 20) {
    await this.initDB();
    const now = new Date().toISOString();
    return new Promise((resolve) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('dueDate');
      const range = IDBKeyRange.upperBound(now);
      const req = index.getAll(range, limit);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  /** Get all cards (for stats) */
  async getAllCards() {
    await this.initDB();
    return new Promise((resolve) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  },

  /** Get SRS stats */
  async getStats() {
    const cards = await this.getAllCards();
    const now = new Date();
    const dueCards = cards.filter(c => new Date(c.dueDate) <= now);

    return {
      totalCards: cards.length,
      dueCards: dueCards.length,
      masteredCards: cards.filter(c => c.interval >= 21).length, // 3 weeks+
      learningCards: cards.filter(c => c.interval > 0 && c.interval < 21).length,
      newCards: cards.filter(c => c.repetitions === 0).length,
      averageEase: cards.length > 0
        ? (cards.reduce((sum, c) => sum + c.ease, 0) / cards.length).toFixed(2)
        : 2.5,
      totalReviews: cards.reduce((sum, c) => sum + c.repetitions, 0),
      totalLapses: cards.reduce((sum, c) => sum + c.lapses, 0),
    };
  },

  /** Batch import words into SRS */
  async importWords(words, category) {
    await this.initDB();
    const cards = words.map(word => ({
      id: word.en || word.id || Math.random().toString(36),
      category: category || word.category || 'unknown',
      ease: this.params.initialEase,
      interval: 0,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      lastReviewed: null,
      lapses: 0,
    }));

    for (const card of cards) await this._saveCard(card);
    return cards.length;
  },

  /** Reset all progress */
  async reset() {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = (e) => reject(e.target.error);
    });
  },
};
