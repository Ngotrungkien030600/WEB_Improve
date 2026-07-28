/**
 * Stories — DOM / UI Layer
 * Renders bilingual paragraphs with word-level hover highlighting.
 */
import { getCurrentStory, getTotal, getCurrentIndex, next, prev } from './stories-logic.js';

export function initStoriesUI() {
  const storyTitle = document.getElementById('story-title');
  const storySubtitle = document.getElementById('story-subtitle');
  const storyCounter = document.getElementById('story-counter');
  const storyBox = document.getElementById('story-box');

  function wrapWords(text, lineIdx) {
    const fragment = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);
    let wordIndex = 0;
    parts.forEach(part => {
      if (/\s+/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
      } else if (part.length > 0) {
        const span = document.createElement('span');
        span.textContent = part;
        span.dataset.word = wordIndex;
        span.dataset.index = lineIdx;
        fragment.appendChild(span);
        wordIndex++;
      }
    });
    return fragment;
  }

  function highlightWord(lineIdx, wordIdx, active) {
    const en = storyBox.querySelector(`.story-en[data-index="${lineIdx}"] span[data-word="${wordIdx}"]`);
    const vi = storyBox.querySelector(`.story-vi[data-index="${lineIdx}"] span[data-word="${wordIdx}"]`);
    if (en) en.classList.toggle('highlight', active);
    if (vi) vi.classList.toggle('highlight', active);
  }

  function addHoverEvents() {
    const spans = storyBox.querySelectorAll('.story-en span[data-word]');
    spans.forEach(span => {
      span.addEventListener('mouseenter', () => highlightWord(span.dataset.index, span.dataset.word, true));
      span.addEventListener('mouseleave', () => highlightWord(span.dataset.index, span.dataset.word, false));
    });
  }

  function render() {
    const story = getCurrentStory();
    storyTitle.textContent = story.title;
    storySubtitle.textContent = story.subtitle;
    storyCounter.textContent = `${getCurrentIndex() + 1} / ${getTotal()}`;
    storyBox.innerHTML = '';

    story.paragraphs.forEach((para, lineIdx) => {
      const line = document.createElement('div');
      line.className = 'story-line';

      const enP = document.createElement('p');
      enP.className = 'story-en';
      enP.dataset.index = lineIdx;
      enP.appendChild(wrapWords(para.en, lineIdx));

      const viP = document.createElement('p');
      viP.className = 'story-vi';
      viP.dataset.index = lineIdx;
      viP.appendChild(wrapWords(para.vi, lineIdx));

      line.appendChild(enP);
      line.appendChild(viP);
      storyBox.appendChild(line);
    });

    addHoverEvents();
  }

  function handleNext() { next(); render(); }
  function handlePrev() { prev(); render(); }

  document.getElementById('story-next').addEventListener('click', handleNext);
  document.getElementById('story-prev').addEventListener('click', handlePrev);

  render();
}
