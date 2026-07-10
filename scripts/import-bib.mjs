#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { parseBibtex, bibEntryToPublication } from './lib/bibtex.mjs';

const bibPath = process.argv[2];
if (!bibPath) {
  console.error('Usage: npm run import:bib -- <path-to.bib>');
  process.exit(1);
}
if (!existsSync(bibPath)) {
  console.error(`File not found: ${bibPath}`);
  process.exit(1);
}

const entries = parseBibtex(readFileSync(bibPath, 'utf8'));
if (entries.length === 0) {
  console.error('No BibTeX entries found.');
  process.exit(1);
}

let created = 0;
let skipped = 0;
for (const entry of entries) {
  const { relPath, contents } = bibEntryToPublication(entry);
  if (existsSync(relPath)) { console.log(`Skipped (exists): ${relPath}`); skipped++; continue; }
  mkdirSync(dirname(relPath), { recursive: true });
  writeFileSync(relPath, contents);
  console.log(`Created ${relPath}`);
  created++;
}
console.log(`\nDone: ${created} created, ${skipped} skipped, ${entries.length} total. Review and fill in citation/abstract fields.`);
