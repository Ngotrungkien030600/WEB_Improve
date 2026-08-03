/**
 * Interview — State & Business Logic
 * Manages topic list, checklist persistence, progress calculation.
 * Uses IndexedDB via progressDB for persistent storage.
 */

let checklistCache = {};
let isInitialized = false;

async function loadChecklistFromIDB() {
  try {
    const completed = await window.progressDB.getCompletedByType('checklist');
    return completed.reduce((acc, item) => {
      acc[item.itemId] = true;
      return acc;
    }, {});
  } catch (e) {
    console.warn('Failed to load checklist from IndexedDB:', e);
    return {};
  }
}

async function migrateFromLocalStorage() {
  try {
    const localData = localStorage.getItem('interviewChecklist');
    if (localData) {
      const parsed = JSON.parse(localData);
      for (const item of Object.keys(parsed)) {
        if (parsed[item]) {
          await window.progressDB.markCompleted(item, 'interview', 'checklist', { title: item });
        }
      }
      localStorage.removeItem('interviewChecklist');
    }
  } catch (e) {
    console.warn('Migration from localStorage failed:', e);
  }
}

export async function initChecklist() {
  if (isInitialized) return;
  await migrateFromLocalStorage();
  checklistCache = await loadChecklistFromIDB();
  isInitialized = true;
}

async function toggleChecklistItem(item, checked) {
  if (checked) {
    await window.progressDB.markCompleted(item, 'interview', 'checklist', { title: item });
  } else {
    await window.progressDB.uncomplete(item, 'checklist');
  }
  checklistCache[item] = checked;
  return checklistCache;
}

export function getTopics(topics) {
  return topics || window.interviewTopics || [];
}

export function getTopic(index) {
  const topics = getTopics();
  return topics[index] || null;
}

export function getChecklist() {
  return checklistCache;
}

export { toggleChecklistItem };

export function calcProgress(topics) {
  const list = getTopics(topics);
  let total = 0;
  let done = 0;
  list.forEach(topic => {
    if (topic.checklist) {
      topic.checklist.forEach(item => {
        total++;
        if (checklistCache[item]) done++;
      });
    }
  });
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function calcTopicProgress(topic) {
  const total = topic.checklist ? topic.checklist.length : 0;
  const done = topic.checklist ? topic.checklist.filter(item => checklistCache[item]).length : 0;
  return { done, total };
}
