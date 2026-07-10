import { test } from 'node:test';
import assert from 'node:assert/strict';
import { yamlEscape } from './yaml.mjs';

test('yamlEscape escapes backslashes before quotes', () => {
  assert.equal(yamlEscape('a\\b"c'), 'a\\\\b\\"c');
});
test('yamlEscape leaves plain text unchanged', () => {
  assert.equal(yamlEscape('Plain Title 2026'), 'Plain Title 2026');
});
test('yamlEscape handles LaTeX-style backslashes', () => {
  assert.equal(yamlEscape('O(n \\log n)'), 'O(n \\\\log n)');
});
