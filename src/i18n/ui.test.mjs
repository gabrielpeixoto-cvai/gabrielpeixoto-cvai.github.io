import { test } from 'node:test';
import assert from 'node:assert/strict';
import { t, ui, LOCALES, DEFAULT_LOCALE } from './ui.mjs';

test('LOCALES and DEFAULT_LOCALE are set', () => {
  assert.deepEqual(LOCALES, ['en']);
  assert.equal(DEFAULT_LOCALE, 'en');
});

test('t returns the English string', () => {
  assert.equal(t('en', 'nav.blog'), 'Blog');
});

test('t returns the Japanese string', () => {
  assert.equal(t('ja', 'nav.blog'), 'ブログ');
});

test('t returns the Brazilian Portuguese string', () => {
  assert.equal(t('pt-br', 'nav.publications'), 'Publicações');
});

test('t falls back to English for an unsupported locale', () => {
  assert.equal(t('de', 'nav.cv'), 'CV');
});

test('t falls back to the English table when a key is missing from a locale', () => {
  // Any key not present in the target locale table is looked up in ui.en.
  assert.equal(t('ja', 'does.not.exist'), ui.en['does.not.exist']);
});
