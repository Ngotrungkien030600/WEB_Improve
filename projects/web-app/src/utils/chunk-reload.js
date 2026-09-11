// Vite đổi tên file chunk mỗi lần build. Tab đang mở từ bản cũ sẽ 404 khi tải chunk,
// Vue Router để màn hình trắng. Tự tải lại trang (tối đa 1 lần) để người dùng không gặp màn hình trắng.
import router from '../router/index.js';

const RELOAD_KEY = 'sf_chunk_reload_at';
const RELOAD_COOLDOWN_MS = 15000;

function isChunkLoadError(error) {
  const message = (error && (error.message || error.toString())) || '';
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload CSS/i.test(message);
}

function reloadOnce() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return;
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

router.onError((error) => {
  if (isChunkLoadError(error)) reloadOnce();
});
