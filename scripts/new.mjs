#!/usr/bin/env node
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { scaffold, TYPES } from './lib/templates.mjs';

const [type, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ').trim();

if (!type || !title) {
  console.error(`Usage: npm run new -- <type> "<title>"\nTypes: ${Object.keys(TYPES).join(', ')}`);
  process.exit(1);
}
if (!TYPES[type]) {
  console.error(`Unknown type "${type}". Valid types: ${Object.keys(TYPES).join(', ')}`);
  process.exit(1);
}

const { relPath, contents } = scaffold(type, title, new Date());
if (existsSync(relPath)) {
  console.error(`Refusing to overwrite existing file: ${relPath}`);
  process.exit(1);
}
mkdirSync(dirname(relPath), { recursive: true });
writeFileSync(relPath, contents);
console.log(`Created ${relPath}`);
