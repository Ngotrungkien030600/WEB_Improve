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

// Legacy storage keys (without prefix) for data migration
export const LEGACY_KEYS = {
  motivationState: 'skillforge_motivation_state',
};

/**
 * Migrate data from legacy localStorage keys to Vue app.
 * Call once on app mount.
 */
export function migrateLegacyData() {
  try {
    // Motivation state
    const motState = localStorage.getItem(LEGACY_KEYS.motivationState);
    if (motState) {
      // Just ensure it's accessible - key is the same
    }
  } catch (e) {
    console.warn('Migration: failed to read legacy data', e);
  }
}

/**
 * Get motivation state from localStorage.
 * Compatible with both legacy and Vue storage.
 */
export function getMotivationState() {
  try {
    const raw = localStorage.getItem(LEGACY_KEYS.motivationState);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save motivation state to localStorage.
 */
export function setMotivationState(state) {
  try {
    localStorage.setItem(LEGACY_KEYS.motivationState, JSON.stringify(state));
  } catch {}
}
