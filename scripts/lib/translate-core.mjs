import { createHash } from 'node:crypto';

/**
 * Stable content hash of a raw source-file string (front matter + body).
 * Used to detect when an English source changed since a translation was made.
 * @param {string} rawFileString
 * @returns {string} sha256 hex digest
 */
export function sourceHash(rawFileString) {
  return createHash('sha256').update(String(rawFileString)).digest('hex');
}

/**
 * Decide what to do for one source × target-locale pair. Pure.
 * Precedence: no file -> create; locked -> skip-locked; cached -> skip-cached; else update.
 * @param {{ translatedExists: boolean, translatedData: object | undefined, sourceHash: string }} input
 * @returns {'create' | 'update' | 'skip-cached' | 'skip-locked'}
 */
export function decideAction({ translatedExists, translatedData, sourceHash }) {
  if (!translatedExists) return 'create';
  const data = translatedData ?? {};
  if (data.translationLocked === true) return 'skip-locked';
  if (data.translationHash === sourceHash) return 'skip-cached';
  return 'update';
}
