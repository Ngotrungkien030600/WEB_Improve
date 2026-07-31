const PREFIX = 'sf_';

export function getItem(key) {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage quota exceeded or unavailable — fail silently at this layer
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Ignore
  }
}
