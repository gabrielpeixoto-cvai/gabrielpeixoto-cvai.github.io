import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseEntryId, localizedEntries, findLocalized } from './content.mjs';

test('parseEntryId: no suffix is English', () => {
  assert.deepEqual(parseEntryId('foo'), { baseId: 'foo', locale: 'en' });
});
test('parseEntryId: .ja suffix', () => {
  assert.deepEqual(parseEntryId('foo.ja'), { baseId: 'foo', locale: 'ja' });
});
test('parseEntryId: .pt-br suffix', () => {
  assert.deepEqual(parseEntryId('foo.pt-br'), { baseId: 'foo', locale: 'pt-br' });
});
test('parseEntryId: an unrelated trailing segment stays English', () => {
  assert.deepEqual(parseEntryId('foo.bar'), { baseId: 'foo.bar', locale: 'en' });
});
test('parseEntryId: nested id keeps its path', () => {
  assert.deepEqual(parseEntryId('sub/foo.ja'), { baseId: 'sub/foo', locale: 'ja' });
});

// Fabricated entries: base "a" has an en + ja file; base "b" is en-only.
const entries = [
  { id: 'a', data: { title: 'A (en)' } },
  { id: 'a.ja', data: { title: 'A (ja)' } },
  { id: 'b', data: { title: 'B (en)' } },
];

test('localizedEntries: ja uses the ja file and falls back to en for b', () => {
  const ids = localizedEntries(entries, 'ja').map((e) => e.id).sort();
  assert.deepEqual(ids, ['a.ja', 'b']);
});
test('localizedEntries: en returns only the base files', () => {
  const ids = localizedEntries(entries, 'en').map((e) => e.id).sort();
  assert.deepEqual(ids, ['a', 'b']);
});
test('localizedEntries: pt-br is missing everywhere, so all fall back to en', () => {
  const ids = localizedEntries(entries, 'pt-br').map((e) => e.id).sort();
  assert.deepEqual(ids, ['a', 'b']);
});
test('localizedEntries: other-locale files never leak into a locale list', () => {
  const list = localizedEntries(entries, 'en');
  assert.ok(!list.some((e) => e.id.endsWith('.ja')));
  assert.equal(list.length, 2);
});

test('findLocalized: returns the ja entry when present', () => {
  assert.equal(findLocalized(entries, 'a', 'ja').id, 'a.ja');
});
test('findLocalized: falls back to the en base when the locale is missing', () => {
  assert.equal(findLocalized(entries, 'b', 'ja').id, 'b');
  assert.equal(findLocalized(entries, 'a', 'pt-br').id, 'a');
});
test('findLocalized: returns undefined for an unknown base id', () => {
  assert.equal(findLocalized(entries, 'nope', 'en'), undefined);
});
