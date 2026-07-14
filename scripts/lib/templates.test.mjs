import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scaffold, TYPES } from './templates.mjs';

const D = new Date('2026-07-10T00:00:00Z');

test('unknown type throws', () => {
  assert.throws(() => scaffold('bogus', 'x', D), /unknown type/i);
});

test('post goes to date-prefixed blog path', () => {
  const { relPath } = scaffold('post', 'My First Post', D);
  assert.equal(relPath, 'src/content/blog/2026-07-10-my-first-post.md');
});

test('portfolio has no date prefix', () => {
  const { relPath } = scaffold('portfolio', 'Cool Project', D);
  assert.equal(relPath, 'src/content/portfolio/cool-project.md');
});

test('publication template omits paperurl (empty would fail .url())', () => {
  const { contents } = scaffold('publication', 'A Paper', D);
  assert.match(contents, /title: "A Paper"/);
  assert.match(contents, /date: 2026-07-10/);
  assert.match(contents, /venue: ""/);
  assert.match(contents, /citation: ""/);
  assert.doesNotMatch(contents, /paperurl/);
});

test('talk template includes event fields and a type default', () => {
  const { contents } = scaffold('talk', 'A Talk', D);
  assert.match(contents, /type: "Talk"/);
  assert.match(contents, /venue: ""/);
  assert.match(contents, /location: ""/);
});

test('portfolio template omits link (empty would fail .url())', () => {
  const { contents } = scaffold('portfolio', 'Cool Project', D);
  assert.doesNotMatch(contents, /link:/);
});

test('every TYPES key scaffolds without throwing', () => {
  for (const type of Object.keys(TYPES)) {
    const { relPath, contents } = scaffold(type, 'Sample Title', D);
    assert.ok(relPath.startsWith('src/content/'));
    assert.match(contents, /title: "Sample Title"/);
  }
});
