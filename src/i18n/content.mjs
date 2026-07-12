/**
 * Split a content-collection entry id into its base id and locale.
 * `foo` -> { baseId: 'foo', locale: 'en' }
 * `foo.ja` -> { baseId: 'foo', locale: 'ja' }
 * `foo.pt-br` -> { baseId: 'foo', locale: 'pt-br' }
 * @param {string} id
 * @returns {{ baseId: string, locale: string }}
 */
export function parseEntryId(id) {
  const match = String(id).match(/^(.*)\.(ja|pt-br)$/);
  if (match) return { baseId: match[1], locale: match[2] };
  return { baseId: String(id), locale: 'en' };
}

/**
 * One entry per base id for the given locale: prefer the matching-locale file,
 * otherwise fall back to the English base. Other-locale files are excluded.
 * @template {{ id: string }} T
 * @param {T[]} allEntries
 * @param {string} locale
 * @returns {T[]}
 */
export function localizedEntries(allEntries, locale) {
  const byBase = new Map();
  for (const entry of allEntries) {
    const { baseId, locale: entryLocale } = parseEntryId(entry.id);
    let bucket = byBase.get(baseId);
    if (!bucket) {
      bucket = {};
      byBase.set(baseId, bucket);
    }
    bucket[entryLocale] = entry;
  }
  const result = [];
  for (const bucket of byBase.values()) {
    const chosen = bucket[locale] ?? bucket.en;
    if (chosen) result.push(chosen);
  }
  return result;
}

/**
 * The single entry for a base id in a locale, falling back to the English base.
 * @template {{ id: string }} T
 * @param {T[]} allEntries
 * @param {string} baseId
 * @param {string} locale
 * @returns {T | undefined}
 */
export function findLocalized(allEntries, baseId, locale) {
  let base;
  let match;
  for (const entry of allEntries) {
    const parsed = parseEntryId(entry.id);
    if (parsed.baseId !== baseId) continue;
    if (parsed.locale === locale) match = entry;
    if (parsed.locale === 'en') base = entry;
  }
  return match ?? base;
}
