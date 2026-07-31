/**
 * Search Index — Full-text search across all learning data
 * Builds an in-memory index for vocabulary, idioms, tenses, stories, and AI concepts.
 */
window.searchIndex = {
  index: [],
  built: false,

  /** Build the search index from all data sources */
  build() {
    this.index = [];

    // Index vocabulary
    if (window.vocabList) {
      window.vocabList.forEach((item, i) => {
        this.index.push({
          id: `vocab-${i}`,
          type: 'vocabulary',
          title: item.en,
          vi: item.vi,
          category: item.category,
          text: `${item.en} ${item.vi} ${item.phonetic || ''} ${item.exampleEn || ''} ${item.exampleVi || ''}`.toLowerCase(),
          difficulty: item.difficulty || 1,
          tags: item.tags || [],
          icon: '📝',
          url: `#vocab-${item.en}`,
        });
      });
    }

    // Index idioms
    if (window.idiomsList) {
      window.idiomsList.forEach((item, i) => {
        this.index.push({
          id: `idiom-${i}`,
          type: 'idiom',
          title: item.en,
          vi: item.vi,
          category: item.category || 'idioms',
          text: `${item.en} ${item.vi} ${item.phonetic || ''} ${item.exampleEn || ''} ${item.exampleVi || ''}`.toLowerCase(),
          difficulty: 3,
          tags: ['idiom', 'advanced'],
          icon: '🎯',
          url: `#idiom-${item.en}`,
        });
      });
    }

    // Index tenses
    if (window.tenses) {
      window.tenses.forEach((item, i) => {
        this.index.push({
          id: `tense-${i}`,
          type: 'tense',
          title: item.name,
          vi: item.title,
          category: 'grammar',
          text: `${item.name} ${item.title} ${item.form} ${item.usage} ${item.signal} ${item.exampleEn} ${item.exampleVi}`.toLowerCase(),
          difficulty: 1,
          tags: ['grammar', 'tense'],
          icon: '⏳',
          url: `#tense-${item.name}`,
        });
      });
    }

    // Index AI concepts
    if (window.aiConcepts) {
      window.aiConcepts.forEach((item, i) => {
        this.index.push({
          id: `ai-${i}`,
          type: 'ai-concept',
          title: item.en,
          vi: item.vi,
          category: item.category,
          text: `${item.en} ${item.vi} ${item.definition} ${item.example}`.toLowerCase(),
          difficulty: item.difficulty || 2,
          tags: [item.category, 'ai', 'ml'],
          icon: '🤖',
          url: `#ai-${item.en}`,
        });
      });
    }

    // Index AI agent concepts
    if (window.aiAgentConcepts) {
      window.aiAgentConcepts.forEach((item, i) => {
        this.index.push({
          id: `ai-agent-${i}`,
          type: 'ai-agent-concept',
          title: item.en,
          vi: item.vi,
          category: item.category,
          text: `${item.en} ${item.vi} ${item.definition} ${item.example}`.toLowerCase(),
          difficulty: item.difficulty || 2,
          tags: [item.category, 'ai', 'agent'],
          icon: '🤖',
          url: `#ai-agent-${item.en}`,
        });
      });
    }

    // Index AI agent topics
    if (window.aiAgentTopics) {
      window.aiAgentTopics.forEach((item, i) => {
        this.index.push({
          id: `ai-agent-topic-${i}`,
          type: 'ai-agent-topic',
          title: item.title,
          vi: item.title,
          category: 'ai-agent',
          text: `${item.title} ${item.content ? item.content.substring(0, 500) : ''} ${(item.checklist || []).join(' ')}`.toLowerCase(),
          difficulty: item.difficulty || 2,
          tags: ['ai', 'agent'],
          icon: '🤖',
          url: `#ai-agent-topic-${item.file}`,
        });
      });
    }

    // Index interview topics
    if (window.interviewTopics) {
      window.interviewTopics.forEach((item, i) => {
        this.index.push({
          id: `interview-${i}`,
          type: 'interview',
          title: item.title,
          vi: item.title,
          category: 'interview',
          text: `${item.title} ${item.content ? item.content.substring(0, 500) : ''} ${(item.checklist || []).join(' ')}`.toLowerCase(),
          difficulty: item.difficulty || 3,
          tags: ['java', 'interview'],
          icon: '📋',
          url: `#interview-${item.file}`,
        });
      });
    }

    this.built = true;
    return this.index.length;
  },

  /** Search the index */
  search(query, options = {}) {
    if (!this.built) this.build();
    if (!query || query.trim().length === 0) return [];

    const terms = query.toLowerCase().trim().split(/\s+/);
    const { type, category, limit = 20, exact = false } = options;

    let results = this.index.map(item => {
      // Calculate relevance score
      let score = 0;
      const searchText = item.text;

      for (const term of terms) {
        // Exact phrase match gets highest score
        if (exact) {
          if (searchText.includes(term)) score += 10;
        } else {
          // Term frequency in the text
          const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          const matches = searchText.match(regex);
          if (matches) score += matches.length;

          // Title match bonus
          if (item.title.toLowerCase().includes(term)) score += 5;
          if (item.vi && item.vi.toLowerCase().includes(term)) score += 3;
        }
      }

      return { ...item, score };
    });

    // Filter by type
    if (type) results = results.filter(r => r.type === type);
    if (category) results = results.filter(r => r.category === category);

    // Sort by score descending, then by difficulty ascending
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.difficulty || 1) - (b.difficulty || 1);
    });

    return results.filter(r => r.score > 0).slice(0, limit);
  },

  /** Get suggestions (for autocomplete) */
  getSuggestions(query, limit = 5) {
    const results = this.search(query, { limit });
    return results.map(r => ({
      text: r.title,
      type: r.type,
      icon: r.icon,
      vi: r.vi,
    }));
  },

  /** Search by category */
  searchByCategory(category) {
    if (!this.built) this.build();
    return this.index.filter(item => item.category === category);
  },

  /** Get all unique categories */
  getCategories() {
    if (!this.built) this.build();
    return [...new Set(this.index.map(item => item.category))].filter(Boolean);
  },

  /** Get index stats */
  getStats() {
    if (!this.built) this.build();
    const typeCount = {};
    this.index.forEach(item => {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    });
    return {
      totalItems: this.index.length,
      byType: typeCount,
      byCategory: [...new Set(this.index.map(i => i.category))].length,
    };
  },

  /** Load data from window globals (called on page load) */
  init() {
    // Wait for all data to be available
    const check = () => {
      if (window.vocabList || window.idiomsList || window.tenses) {
        this.build();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  },
};

// Auto-initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => window.searchIndex.init());
}
