import { createHash } from 'node:crypto';
import matter from 'gray-matter';

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

/**
 * Build a translated Markdown file from an English source.
 *
 * ONLY `title`, `excerpt`, and the Markdown body are translated. Every other
 * front-matter field (date, venue, citation, tags, type, location, paperurl,
 * image, link, bibtex, …) is copied verbatim. `translationHash` is stamped so
 * later runs can skip an unchanged source (see `decideAction`).
 *
 * @param {string} sourceRaw  raw English file string (front matter + body)
 * @param {string} targetLang target locale, e.g. 'ja' | 'pt-br'
 * @param {(text: string, lang: string) => Promise<string>} translateFn provider
 * @param {string} sourceHash hash of `sourceRaw` (from `sourceHash`)
 * @returns {Promise<string>} the translated file's full contents
 */
export async function buildTranslatedFile(sourceRaw, targetLang, translateFn, sourceHash) {
  const parsed = matter(String(sourceRaw));
  const data = { ...parsed.data }; // copies every structural field verbatim

  data.title = await translateFn(String(parsed.data.title ?? ''), targetLang);
  if (typeof parsed.data.excerpt === 'string' && parsed.data.excerpt.trim() !== '') {
    data.excerpt = await translateFn(parsed.data.excerpt, targetLang);
  }
  // gray-matter preserves the blank line conventionally left between the
  // closing `---` and the body, so trim it before handing text to the
  // provider (avoids feeding stray boundary whitespace into translation).
  const body = await translateFn(parsed.content.trim(), targetLang);

  data.translationHash = sourceHash;
  return matter.stringify(body, data);
}
