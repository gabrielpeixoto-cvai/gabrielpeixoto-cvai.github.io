#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import matter from 'gray-matter';
import { sourceHash, decideAction, buildTranslatedFile } from './lib/translate-core.mjs';
import { translate as mockTranslate } from './lib/providers/mock.mjs';
import { makeOllamaTranslate } from './lib/providers/ollama.mjs';

const CONTENT_ROOT = 'src/content';
const LOCALES = ['ja', 'pt-br'];
const LOCALE_RE = /\.(ja|pt-br)\.md$/;

function parseArgs(argv) {
  const args = { provider: 'ollama', locales: [...LOCALES], model: undefined, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--provider') args.provider = argv[++i];
    else if (a === '--locale') args.locales = argv[++i].split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--model') args.model = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else { console.error(`Unknown argument: ${a}`); process.exit(1); }
  }
  return args;
}

// Recursively list every *.md file under a directory (no glob dependency).
function walkMarkdown(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walkMarkdown(full));
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

// English sources: *.md that are NOT locale-suffixed translations.
function englishSources(root) {
  return walkMarkdown(root).filter((p) => !LOCALE_RE.test(p)).sort();
}

// src/content/pub/foo.md + 'ja' -> src/content/pub/foo.ja.md
function translatedPath(sourcePath, locale) {
  return sourcePath.replace(/\.md$/, `.${locale}.md`);
}

function makeProvider(args) {
  if (args.provider === 'mock') return mockTranslate;
  if (args.provider === 'ollama') return makeOllamaTranslate(args.model ? { model: args.model } : {});
  console.error(`Unknown provider "${args.provider}". Use "mock" or "ollama".`);
  process.exit(1);
}

function rel(p) {
  return relative('.', p).split(sep).join('/');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  for (const l of args.locales) {
    if (!LOCALES.includes(l)) {
      console.error(`Unknown locale "${l}". Valid: ${LOCALES.join(', ')}`);
      process.exit(1);
    }
  }
  const translate = makeProvider(args);
  const sources = englishSources(CONTENT_ROOT);
  const counts = { create: 0, update: 0, 'skip-cached': 0, 'skip-locked': 0 };

  for (const src of sources) {
    const raw = readFileSync(src, 'utf8');
    const hash = sourceHash(raw);
    for (const locale of args.locales) {
      const dest = translatedPath(src, locale);
      const translatedExists = existsSync(dest);
      const translatedData = translatedExists ? matter(readFileSync(dest, 'utf8')).data : undefined;
      const action = decideAction({ translatedExists, translatedData, sourceHash: hash });
      counts[action]++;

      if (action === 'skip-cached') { console.log(`skip (cached)  ${rel(dest)}`); continue; }
      if (action === 'skip-locked') { console.log(`skip (locked)  ${rel(dest)}`); continue; }
      if (args.dryRun) { console.log(`${action} (dry-run)  ${rel(dest)}`); continue; }

      try {
        const out = await buildTranslatedFile(raw, locale, translate, hash);
        writeFileSync(dest, out);
        console.log(`${action}         ${rel(dest)}`);
      } catch (err) {
        console.error(`\nFailed translating ${rel(dest)}: ${err.message}`);
        if (args.provider === 'ollama') {
          console.error('Start the Ollama container, e.g.:');
          console.error('  docker run -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama');
          console.error('  docker exec ollama ollama pull qwen2.5:32b');
        }
        process.exit(1);
      }
    }
  }
  console.log(
    `\nDone: ${counts.create} created, ${counts.update} updated, ` +
    `${counts['skip-cached']} cached, ${counts['skip-locked']} locked.`,
  );
}

main();
