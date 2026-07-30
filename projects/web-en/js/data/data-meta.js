/**
 * Data Metadata — category definitions, difficulty levels, tags, learning paths
 * Enriches vocabulary, idioms, and other learning data at runtime.
 */
window.dataMeta = {
  // Category difficulty & metadata
  categories: {
    greetings:  { difficulty: 1, tags: ['basic', 'conversation', 'social'], icon: '👋', color: '#3b82f6' },
    daily:      { difficulty: 1, tags: ['basic', 'routine', 'daily-life'], icon: '🌅', color: '#10b981' },
    food:       { difficulty: 1, tags: ['basic', 'dining', 'daily-life'], icon: '🍽️', color: '#f59e0b' },
    requests:   { difficulty: 1, tags: ['basic', 'politeness', 'social'], icon: '🙏', color: '#8b5cf6' },
    time:       { difficulty: 1, tags: ['basic', 'time', 'daily-life'], icon: '⏰', color: '#ec4899' },
    weather:    { difficulty: 1, tags: ['basic', 'nature', 'daily-life'], icon: '🌤️', color: '#06b6d4' },
    shopping:   { difficulty: 2, tags: ['intermediate', 'commerce', 'travel'], icon: '🛍️', color: '#14b8a6' },
    school:     { difficulty: 2, tags: ['intermediate', 'education', 'academic'], icon: '📚', color: '#6366f1' },
    health:     { difficulty: 2, tags: ['intermediate', 'health', 'emergency'], icon: '🏥', color: '#ef4444' },
    emotion:    { difficulty: 2, tags: ['intermediate', 'feeling', 'social'], icon: '😊', color: '#f97316' },
    opinion:    { difficulty: 2, tags: ['intermediate', 'discussion', 'social'], icon: '💬', color: '#84cc16' },
    travel:     { difficulty: 2, tags: ['intermediate', 'travel', 'tourism'], icon: '✈️', color: '#22d3ee' },
    work:       { difficulty: 3, tags: ['advanced', 'career', 'professional'], icon: '💼', color: '#64748b' },
    technology: { difficulty: 3, tags: ['advanced', 'tech', 'digital'], icon: '💻', color: '#0ea5e9' },
  },

  // Idioms sub-categories
  idiomCategories: {
    idioms:     { difficulty: 3, tags: ['advanced', 'idiom', 'expression'], icon: '🎯', color: '#a855f7' },
    phrasal:    { difficulty: 3, tags: ['advanced', 'phrasal-verb', 'grammar'], icon: '🔗', color: '#eab308' },
    collocation:{ difficulty: 3, tags: ['advanced', 'collocation', 'academic'], icon: '🧩', color: '#f97316' },
    slang:      { difficulty: 4, tags: ['expert', 'slang', 'informal'], icon: '🔥', color: '#ef4444' },
    workplace:  { difficulty: 4, tags: ['expert', 'business', 'professional'], icon: '📊', color: '#3b82f6' },
  },

  // Learning path recommendations
  paths: {
    beginner: {
      title: '🌱 Người mới bắt đầu',
      description: 'Từ vựng cơ bản, chào hỏi, sinh hoạt hàng ngày',
      categories: ['greetings', 'daily', 'food', 'requests', 'time', 'weather'],
      difficultyRange: [1, 1],
      estimatedDays: 14,
      nextPath: 'intermediate',
    },
    intermediate: {
      title: '📈 Trung cấp',
      description: 'Mở rộng vốn từ, cảm xúc, du lịch, công sở',
      categories: ['shopping', 'school', 'health', 'emotion', 'opinion', 'travel'],
      difficultyRange: [2, 2],
      estimatedDays: 21,
      nextPath: 'advanced',
    },
    advanced: {
      title: '🎯 Nâng cao',
      description: 'Chuyên môn, idioms, phrasal verbs, collocations',
      categories: ['work', 'technology'],
      difficultyRange: [3, 4],
      estimatedDays: 28,
      nextPath: null,
    },
  },

  // Helper: get enriched item
  enrich(item) {
    const cats = this.categories;
    const meta = cats[item.category] || { difficulty: 1, tags: [] };
    return {
      ...item,
      difficulty: meta.difficulty,
      tags: meta.tags || [],
      icon: meta.icon || '📝',
      color: meta.color || '#6b7280',
    };
  },

  // Helper: get items by difficulty
  filterByDifficulty(items, level) {
    return items.filter(i => {
      const meta = this.categories[i.category] || {};
      return meta.difficulty === level;
    });
  },

  // Helper: get items by tags
  filterByTags(items, tag) {
    return items.filter(i => {
      const meta = this.categories[i.category] || {};
      return (meta.tags || []).includes(tag);
    });
  },

  // Helper: get recommended next categories
  getNextCategories(currentCategories) {
    const allPaths = Object.values(this.paths);
    for (const path of allPaths) {
      if (path.categories.some(c => currentCategories.includes(c))) {
        const remaining = path.categories.filter(c => !currentCategories.includes(c));
        if (remaining.length > 0) return { path: path.title, next: remaining, description: path.description };
      }
    }
    return null;
  },

  // Word of the day helper
  getWordOfDay(items, dateStr) {
    const dayIndex = dateStr ? dateStr.split('-').reduce((a, b) => a + parseInt(b), 0) : new Date().getDate();
    return items[dayIndex % items.length];
  },

  // Stats helper
  getStats(items) {
    const cats = {};
    items.forEach(item => {
      const cat = item.category || 'unknown';
      cats[cat] = (cats[cat] || 0) + 1;
    });
    return {
      total: items.length,
      byCategory: cats,
      uniqueCategories: Object.keys(cats).length,
    };
  },
};
