// Vite đổi tên file chunk mỗi lần build. Tab đang mở từ bản cũ sẽ 404 khi tải chunk,
// Vue Router để màn hình trắng. Tự tải lại trang (tối đa 1 lần) để người dùng không gặp màn hình trắng.
import router from '../router/index.js';

const RELOAD_KEY = 'sf_chunk_reload_at';
const RELOAD_COOLDOWN_MS = 15000;

function isChunkLoadError(error) {
  const message = (error && (error.message || error.toString())) || '';
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message);
}

function showLoadErrorNotice() {
  if (document.getElementById('sf-load-error')) return;
  const box = document.createElement('div');
  box.id = 'sf-load-error';
  box.setAttribute('role', 'alert');
  box.style.cssText = [
    'position:fixed', 'left:50%', 'bottom:24px', 'transform:translateX(-50%)',
    'z-index:10000', 'display:flex', 'gap:0.85rem', 'align-items:center',
    'padding:0.85rem 1.1rem', 'border-radius:14px', 'background:#1b1836',
    'border:1px solid rgba(248,113,113,0.45)', 'box-shadow:0 20px 50px rgba(0,0,0,0.6)',
    'color:#f8fafc', 'font:600 0.9rem/1.35 system-ui,sans-serif', 'max-width:92vw',
  ].join(';');
  const text = document.createElement('span');
  text.textContent = 'Không tải được trang này. Mã nguồn có thể vừa thay đổi hoặc máy chủ dev đang giữ bản cũ.';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Tải lại trang';
  button.style.cssText = 'flex-shrink:0;padding:0.5rem 0.9rem;border-radius:10px;border:none;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;font:700 0.85rem system-ui,sans-serif;cursor:pointer;';
  button.addEventListener('click', () => window.location.reload());
  box.append(text, button);
  document.body.append(box);
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) {
      showLoadErrorNotice();
      return;
    }
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch (err) {
    // sessionStorage bị chặn (chế độ riêng tư) → vẫn thử tải lại
  }
  window.location.reload();
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  reloadOnce();
});

// Dev server giữ module graph cũ (file đã xoá/đổi tên) làm component không tải được;
// lỗi này không đi qua router.onError nên phải bắt ở promise bị từ chối.
window.addEventListener('unhandledrejection', (event) => {
  if (isChunkLoadError(event.reason)) reloadOnce();
});

router.onError((error) => {
  if (isChunkLoadError(error)) reloadOnce();
});
