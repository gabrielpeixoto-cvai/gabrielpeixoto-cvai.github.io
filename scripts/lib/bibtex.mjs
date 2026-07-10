import { slugify } from './slug.mjs';

export function parseBibtex(input) {
  const s = String(input);
  const n = s.length;
  const entries = [];
  let i = 0;
  const isWs = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r';
  while (i < n) {
    while (i < n && s[i] !== '@') i++;
    if (i >= n) break;
    i++; // '@'
    let type = '';
    while (i < n && /[a-zA-Z]/.test(s[i])) type += s[i++];
    type = type.toLowerCase();
    while (i < n && isWs(s[i])) i++;
    if (s[i] !== '{') continue;
    i++; // '{'
    let key = '';
    while (i < n && s[i] !== ',' && s[i] !== '}') key += s[i++];
    key = key.trim();
    if (s[i] === ',') i++;
    const fields = {};
    while (i < n) {
      while (i < n && (isWs(s[i]) || s[i] === ',')) i++;
      if (s[i] === '}') { i++; break; }
      let name = '';
      while (i < n && /[a-zA-Z0-9_+-]/.test(s[i])) name += s[i++];
      name = name.trim().toLowerCase();
      while (i < n && isWs(s[i])) i++;
      if (s[i] !== '=') break; // malformed
      i++; // '='
      while (i < n && isWs(s[i])) i++;
      let value = '';
      if (s[i] === '{') {
        i++; // consume the opening brace
        let depth = 1;
        while (i < n && depth > 0) {
          if (s[i] === '{') depth++;
          else if (s[i] === '}') depth--;
          if (depth > 0) value += s[i];
          i++;
        }
      } else if (s[i] === '"') {
        i++;
        while (i < n && s[i] !== '"') value += s[i++];
        i++;
      } else {
        while (i < n && s[i] !== ',' && s[i] !== '}' && !isWs(s[i])) value += s[i++];
      }
      if (name) fields[name] = value.replace(/\s+/g, ' ').trim();
    }
    if (type && key) entries.push({ type, key, fields });
  }
  return entries;
}

function reconstructBibtex(entry) {
  const lines = Object.entries(entry.fields).map(([k, v]) => `  ${k} = {${v}}`);
  return `@${entry.type}{${entry.key},\n${lines.join(',\n')}\n}`;
}

function indentBlock(text, indent = '  ') {
  return text.split('\n').map((l) => indent + l).join('\n');
}

export function bibEntryToPublication(entry) {
  const f = entry.fields;
  const title = (f.title || 'Untitled').replace(/[{}]/g, '');
  const year = (f.year || '').replace(/[^0-9]/g, '') || '0000';
  const iso = `${year}-01-01`;
  const venue = (f.journal || f.booktitle || f.publisher || '').replace(/[{}]/g, '');
  let paperurl;
  if (f.url) paperurl = f.url;
  else if (f.doi) paperurl = `https://doi.org/${f.doi.replace(/^https?:\/\/doi\.org\//, '')}`;
  const slug = slugify(title) || slugify(entry.key) || 'untitled';
  const relPath = `src/content/publications/${iso}-${slug}.md`;

  const esc = (v) => v.replace(/"/g, '\\"');
  const fm = [
    `title: "${esc(title)}"`,
    `date: ${iso}`,
    `venue: "${esc(venue)}"`,
  ];
  if (paperurl) fm.push(`paperurl: "${esc(paperurl)}"`);
  fm.push('citation: ""');
  fm.push('bibtex: |');
  const contents = `---\n${fm.join('\n')}\n${indentBlock(reconstructBibtex(entry), '  ')}\n---\n\nAdd an abstract here.\n`;
  return { relPath, contents };
}
