/**
 * BMad Agent — prototype UI script
 * - Loads `data/bmad-bundles.json`
 * - Renders bundle list and exposes a simple session panel
 * - Does NOT perform any model calls; provides `startAgentSession` hook
 */

async function loadBundles() {
  try {
    const res = await fetch('data/bmad/bmad-bundles.json');
    const json = await res.json();
    return json.bundles || [];
  } catch (err) {
    dbgError('Failed to load bundles', err && err.message ? err.message : err);
    return [];
  }
}

function dbg(...args) {
  try {
    console.log.apply(console, args);
    const out = document.getElementById('bmad-debug-entries');
    if (out) {
      const d = document.createElement('div');
      d.textContent = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');
      out.appendChild(d);
      out.scrollTop = out.scrollHeight;
    }
  } catch (e) {
    console.log.apply(console, args);
  }
}

function dbgWarn(...args) { dbg('WARN:', ...args); }
function dbgError(...args) { dbg('ERROR:', ...args); }

function renderBundles(bundles) {
  const container = document.getElementById('bmad-bundles');
  if (!container) return;
  container.innerHTML = '';
  bundles.forEach(b => {
    const card = document.createElement('div');
    card.className = 'home-card';
    card.style.display = 'block';
    card.style.marginBottom = '10px';
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px">
        <div style="font-size:28px">🤖</div>
        <div style="flex:1">
          <strong>${b.name}</strong>
          <div style="color:#666">${b.tagline}</div>
        </div>
        <div>
          <button data-slug="${b.slug}" class="open-bundle">Open</button>
        </div>
      </div>`;
    card.style.cursor = 'pointer';
    card.style.position = 'relative';
    container.appendChild(card);
  });

  // Make the whole card clickable and ensure the Open button also works
  container.querySelectorAll('.home-card').forEach((cardEl, idx) => {
    const bundle = bundles[idx];
    if (!bundle) return;
    dbg('attaching listener to card', bundle.slug);
    cardEl.addEventListener('click', () => {
      dbg('card clicked', bundle.slug);
      openBundle(bundle);
    });
    const btn = cardEl.querySelector('.open-bundle');
    if (btn) {
      btn.type = 'button';
      btn.style.padding = '6px 10px';
      btn.style.borderRadius = '6px';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        dbg('open button clicked', bundle.slug);
        openBundle(bundle);
      });
    }
  });
}

let currentBundle = null;

function openBundle(bundle) {
  currentBundle = bundle;
  document.getElementById('agent-panel').style.display = 'block';
  document.getElementById('agent-title').textContent = bundle.name;
  document.getElementById('agent-meta').innerHTML = `
    <div style="color:#666">${bundle.tagline}</div>
    <div style="margin-top:8px">${bundle.description}</div>`;
  const consoleEl = document.getElementById('agent-console');
  consoleEl.innerHTML = `Session ready for <strong>${bundle.slug}</strong>`;

  document.getElementById('agent-send').onclick = async () => {
    const input = document.getElementById('agent-input').value.trim();
    if (!input) return;
    appendConsole('User', input);
    // Try calling backend /api/ai-chat if available
    try {
      const resp = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: input }], topic: currentBundle.name, bundleSlug: currentBundle.slug })
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        appendConsole('BMad (error)', err.error || 'AI backend error');
        return;
      }
      const data = await resp.json();
      appendConsole('BMad', data.reply || JSON.stringify(data));
    } catch (e) {
      appendConsole('BMad (error)', e.message || 'Network error');
    }
  };
}

function appendConsole(who, text) {
  const el = document.getElementById('agent-console');
  const p = document.createElement('div');
  p.innerHTML = `<strong>${who}:</strong> ${text}`;
  el.appendChild(p);
  el.scrollTop = el.scrollHeight;
}

// Expose hook for later wiring
window.startAgentSession = function startAgentSession(bundleSlug, options = {}) {
  // Implement model integration here. Example: call backend endpoint with bundleSlug + prompt.
  dbg('startAgentSession called', bundleSlug, options);
};

function safeInit() {
  dbg('bmad-agent init');
  loadBundles().then(bundles => {
    dbg('loaded bundles', bundles.length);
    renderBundles(bundles);
    // Wire test button to open first bundle
    const testBtn = document.getElementById('open-first-bundle');
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        if (bundles && bundles.length > 0) {
          dbg('test button opening', bundles[0].slug);
          openBundle(bundles[0]);
        } else {
          dbgWarn('No bundles available to open');
        }
      });
    }
  }).catch(err => dbgError('loadBundles error', err && err.message ? err.message : err));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInit);
} else {
  safeInit();
}
