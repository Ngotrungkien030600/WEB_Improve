/**
 * Interview — State & Business Logic
 * Manages topic list, checklist persistence, progress calculation.
 */
const STORAGE_KEY = 'interviewChecklist';

function loadChecklist() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveChecklist(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getTopics(topics) {
  return topics || window.interviewTopics || [];
}

export function getTopic(index) {
  const topics = getTopics();
  return topics[index] || null;
}

export function getChecklist() {
  return loadChecklist();
}

export function toggleChecklistItem(item, checked) {
  const data = loadChecklist();
  data[item] = checked;
  saveChecklist(data);
  return data;
}

export function calcProgress() {
  const topics = getTopics();
  const checked = loadChecklist();
  let total = 0;
  let done = 0;
  topics.forEach(topic => {
    if (topic.checklist) {
      topic.checklist.forEach(item => {
        total++;
        if (checked[item]) done++;
      });
    }
  });
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

export function calcTopicProgress(topic) {
  const checked = loadChecklist();
  const total = topic.checklist ? topic.checklist.length : 0;
  const done = topic.checklist ? topic.checklist.filter(item => checked[item]).length : 0;
  return { done, total };
}
