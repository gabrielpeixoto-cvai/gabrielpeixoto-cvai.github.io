import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugify } from './slug.mjs';

test('slugify lowercases and hyphenates', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
});
test('slugify collapses punctuation and repeated separators', () => {
  assert.equal(slugify('A  Great: Talk!! (2026)'), 'a-great-talk-2026');
});
test('slugify trims leading and trailing separators', () => {
  assert.equal(slugify('  --Edge__Case--  '), 'edge-case');
});
test('slugify handles an empty result', () => {
  assert.equal(slugify('!!!'), '');
});
test('slugify transliterates accented Latin characters', () => {
  assert.equal(slugify('Café com Pão'), 'cafe-com-pao');
});
