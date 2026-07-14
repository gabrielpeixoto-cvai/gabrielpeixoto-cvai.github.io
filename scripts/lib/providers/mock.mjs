/**
 * Deterministic offline translation stub. Prefixes each string with its target
 * locale so tests and smokes can assert on the output without a model.
 * @param {string} text
 * @param {string} lang
 * @returns {Promise<string>}
 */
export async function translate(text, lang) {
  return `[${lang}] ${text}`;
}
