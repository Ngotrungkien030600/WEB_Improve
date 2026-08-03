/**
 * Vite plugin: Inject ESM re-exports for legacy /data/ JS files.
 *
 * Problem:
 * Legacy files (web-en/js/data/*.js) use window.X = ... for data sharing.
 * They are loaded via <script src> (non-module) in Legacy HTML.
 * Vue components import these files via @legacy alias — needs ESM exports.
 *
 * Rolldown parses source, then Vite transform hooks run.
 * Some files already have "export const X = [...]" (vocabulary.js, idioms.js, etc.)
 * For those, we don't need to inject anything.
 * For files with "window.X = [...]" only (no export), we inject re-exports.
 */
export default function legacyInjectExports() {
  return {
    name: 'legacy-inject-exports',
    enforce: 'pre',

    transform(code, id) {
      if (!id.includes('/web-en/js/data/')) return null;

      // Check if file already has ESM exports
      if (code.includes('export const') || code.includes('export function')) {
        return null;
      }

      // Find window.X = assignments
      const windowVars = [];
      const lines = code.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        const match = trimmed.match(/^window\.(\w+)\s*=/);
        if (match) {
          windowVars.push(match[1]);
        }
      }

      if (windowVars.length === 0) return null;

      const exports = windowVars.map(v => `export const ${v} = window.${v};`).join('\n');
      return {
        code: code + '\n' + exports,
        map: null,
      };
    },
  };
}
