import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sourceHash, decideAction } from './translate-core.mjs';
import matter from 'gray-matter';
import { buildTranslatedFile } from './translate-core.mjs';
import { translate as mockTranslate } from './providers/mock.mjs';

test('sourceHash is a deterministic 64-char sha256 hex', () => {
  const h = sourceHash('hello world');
  assert.equal(h, sourceHash('hello world'));
  assert.match(h, /^[0-9a-f]{64}$/);
});

test('sourceHash differs for different input', () => {
  assert.notEqual(sourceHash('a'), sourceHash('b'));
});

test('decideAction: no translated file -> create', () => {
  assert.equal(
    decideAction({ translatedExists: false, translatedData: undefined, sourceHash: 'x' }),
    'create',
  );
});

test('decideAction: locked file -> skip-locked, even when the hash matches', () => {
  assert.equal(
    decideAction({ translatedExists: true, translatedData: { translationLocked: true, translationHash: 'x' }, sourceHash: 'x' }),
    'skip-locked',
  );
});

test('decideAction: matching hash -> skip-cached', () => {
  assert.equal(
    decideAction({ translatedExists: true, translatedData: { translationHash: 'x' }, sourceHash: 'x' }),
    'skip-cached',
  );
});

test('decideAction: stale hash -> update', () => {
  assert.equal(
    decideAction({ translatedExists: true, translatedData: { translationHash: 'old' }, sourceHash: 'new' }),
    'update',
  );
});

test('decideAction: existing file with no translationHash -> update', () => {
  assert.equal(
    decideAction({ translatedExists: true, translatedData: {}, sourceHash: 'new' }),
    'update',
  );
});

const SOURCE = `---
title: "HandArch"
date: 2021-11-22
venue: "WVC"
citation: "de Carvalho et al., 2021"
excerpt: "A deep learning architecture."
paperurl: "https://example.org/p.pdf"
tags: ["cv", "hand"]
bibtex: |
  @inproceedings{x, title={HandArch}}
---

This is the **body** paragraph.
`;

test('buildTranslatedFile translates title, excerpt, and body via the mock', async () => {
  const out = await buildTranslatedFile(SOURCE, 'ja', mockTranslate, 'HASH1');
  const parsed = matter(out);
  assert.equal(parsed.data.title, '[ja] HandArch');
  assert.equal(parsed.data.excerpt, '[ja] A deep learning architecture.');
  assert.match(parsed.content, /\[ja\] This is the \*\*body\*\* paragraph\./);
});

test('buildTranslatedFile copies structural fields verbatim', async () => {
  const out = await buildTranslatedFile(SOURCE, 'ja', mockTranslate, 'HASH1');
  const parsed = matter(out);
  assert.equal(parsed.data.venue, 'WVC');
  assert.equal(parsed.data.citation, 'de Carvalho et al., 2021');
  assert.equal(parsed.data.paperurl, 'https://example.org/p.pdf');
  assert.deepEqual(parsed.data.tags, ['cv', 'hand']);
  assert.match(parsed.data.bibtex, /@inproceedings\{x, title=\{HandArch\}\}/);
  assert.ok(parsed.data.date instanceof Date); // date preserved, never translated
});

test('buildTranslatedFile records the source hash', async () => {
  const out = await buildTranslatedFile(SOURCE, 'pt-br', mockTranslate, 'DEADBEEF');
  assert.equal(matter(out).data.translationHash, 'DEADBEEF');
});

test('buildTranslatedFile leaves excerpt absent when the source has none', async () => {
  const src = `---\ntitle: "T"\ndate: 2026-01-01\n---\n\nBody.\n`;
  const parsed = matter(await buildTranslatedFile(src, 'ja', mockTranslate, 'H'));
  assert.equal(parsed.data.title, '[ja] T');
  assert.equal(parsed.data.excerpt, undefined);
});

test('buildTranslatedFile copies an empty excerpt verbatim (does not translate it)', async () => {
  const src = `---\ntitle: "T"\ndate: 2026-01-01\nexcerpt: ""\n---\n\nBody.\n`;
  const parsed = matter(await buildTranslatedFile(src, 'ja', mockTranslate, 'H'));
  assert.equal(parsed.data.excerpt, '');
});
