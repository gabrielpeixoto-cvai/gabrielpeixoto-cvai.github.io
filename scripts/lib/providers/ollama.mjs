const LANG_NAMES = { ja: 'Japanese', 'pt-br': 'Brazilian Portuguese' };

function systemPrompt(lang) {
  const name = LANG_NAMES[lang] ?? lang;
  return [
    `Translate the user's Markdown text into ${name}.`,
    'Preserve the Markdown structure exactly (headings, lists, emphasis, links).',
    'Do NOT translate code blocks, inline code, or URLs.',
    'Output ONLY the translation, with no preamble, explanation, or code fences.',
  ].join(' ');
}

/**
 * Build an Ollama-backed translate(text, lang) function.
 * `fetchImpl` defaults to the global fetch; it exists so tests can inject a
 * stub — production always uses the real global fetch (Node 20, no dependency).
 * @param {{ host?: string, model?: string, fetchImpl?: typeof fetch }} [opts]
 * @returns {(text: string, lang: string) => Promise<string>}
 */
export function makeOllamaTranslate({
  host = process.env.OLLAMA_HOST || 'http://localhost:11434',
  model = process.env.OLLAMA_MODEL || 'qwen2.5:32b',
  fetchImpl = fetch,
} = {}) {
  return async function translate(text, lang) {
    let res;
    try {
      res = await fetchImpl(`${host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            { role: 'system', content: systemPrompt(lang) },
            { role: 'user', content: text },
          ],
        }),
      });
    } catch (err) {
      throw new Error(
        `Ollama request to ${host} failed: ${err.message}. Is the Ollama container running? See scripts/README.md.`,
      );
    }
    if (!res.ok) {
      throw new Error(`Ollama returned HTTP ${res.status} from ${host}/api/chat.`);
    }
    const data = await res.json();
    const content = data?.message?.content;
    if (typeof content !== 'string') {
      throw new Error(`Unexpected Ollama response shape from ${host}/api/chat (missing message.content).`);
    }
    return content.trim();
  };
}
