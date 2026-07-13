import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sourceHash, decideAction } from './translate-core.mjs';

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
