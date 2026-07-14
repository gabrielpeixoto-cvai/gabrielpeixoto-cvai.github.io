import { test, expect } from '@playwright/test';

test('homepage renders name and nav', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Gabriel Peixoto de Carvalho');
  await expect(page.getByRole('link', { name: 'Publications', exact: true })).toBeVisible();
});

test('theme toggle switches data-theme', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  const before = await html.getAttribute('data-theme');
  await page.locator('#theme-toggle').click();
  const after = await html.getAttribute('data-theme');
  expect(after).not.toBe(before);
});

test('publications list shows migrated entries and links to detail', async ({ page }) => {
  await page.goto('/en/publications/');
  await expect(page.getByRole('heading', { name: 'Publications' })).toBeVisible();
  const handArch = page.getByRole('link', { name: /HandArch/ });
  await expect(handArch).toBeVisible();
  await handArch.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HandArch');
  await expect(page.getByRole('heading', { name: 'Citation' })).toBeVisible();
});

test('nav links to all sections from the homepage', async ({ page }) => {
  await page.goto('/');
  for (const label of ['Talks', 'Teaching', 'Portfolio', 'Blog', 'Notes', 'CV']) {
    await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
});

test('blog list renders and opens the example post', async ({ page }) => {
  await page.goto('/en/blog/');
  await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  const post = page.getByRole('link', { name: /Example blog post/ });
  await expect(post).toBeVisible();
  await post.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Example blog post');
});

test('talks list renders the example talk with its venue', async ({ page }) => {
  await page.goto('/en/talks/');
  await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();
  await expect(page.getByText('Example Venue')).toBeVisible();
});

test('cv page renders its sections', async ({ page }) => {
  await page.goto('/en/cv/');
  await expect(page.getByRole('heading', { name: 'Curriculum Vitae', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
});

test('every section list page renders its heading', async ({ page }) => {
  const sections: [string, string][] = [
    ['/en/publications/', 'Publications'],
    ['/en/talks/', 'Talks'],
    ['/en/teaching/', 'Teaching'],
    ['/en/portfolio/', 'Portfolio'],
    ['/en/blog/', 'Blog'],
    ['/en/notes/', 'Notes'],
  ];
  for (const [path, heading] of sections) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
  }
});

test('root redirects to the English homepage', async ({ page }) => {
  await page.goto('/');
  await page.waitForURL(/\/en\/?$/);
  await expect(page.locator('h1')).toContainText('Gabriel Peixoto de Carvalho');
});

test('each locale homepage renders', async ({ page }) => {
  for (const path of ['/en/', '/ja/', '/pt-br/']) {
    await page.goto(path);
    await expect(page.locator('h1')).toContainText('Gabriel Peixoto de Carvalho');
  }
});

test('a non-English homepage shows a localized nav label', async ({ page }) => {
  await page.goto('/ja/');
  await expect(page.getByRole('link', { name: 'ブログ', exact: true })).toBeVisible();
});

test('the language switcher offers all three locales', async ({ page }) => {
  await page.goto('/en/');
  for (const name of ['EN', '日本語', 'PT-BR']) {
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  }
});

test('a non-English list falls back to English content', async ({ page }) => {
  await page.goto('/ja/publications/');
  await expect(page.getByRole('heading', { name: '論文', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /HandArch/ })).toBeVisible();
});

test('a publication detail page resolves under a locale', async ({ page }) => {
  await page.goto('/ja/publications/');
  await page.getByRole('link', { name: /HandArch/ }).click();
  await expect(page).toHaveURL(/\/ja\/publications\//);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HandArch');
});

test('every section renders under a non-English locale via fallback', async ({ page }) => {
  const sections: [string, string][] = [
    ['/ja/publications/', '論文'],
    ['/ja/talks/', '講演'],
    ['/ja/teaching/', '教育'],
    ['/ja/portfolio/', 'ポートフォリオ'],
    ['/ja/blog/', 'ブログ'],
    ['/ja/notes/', 'ノート'],
    ['/ja/cv/', '履歴書'],
  ];
  for (const [path, heading] of sections) {
    await page.goto(path);
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
  }
});

test('a page emits hreflang alternates for all three locales plus x-default', async ({ page }) => {
  await page.goto('/en/publications/');
  await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4);
  for (const hreflang of ['en', 'ja', 'pt-BR']) {
    await expect(page.locator(`link[rel="alternate"][hreflang="${hreflang}"]`)).toHaveCount(1);
  }
  await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1);
});

test('projects list shows the example project', async ({ page }) => {
  await page.goto('/en/projects/');
  await expect(page.getByRole('heading', { name: 'Projects', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Example Project/ })).toBeVisible();
});

test('a project detail page renders its hero, table, and links', async ({ page }) => {
  await page.goto('/en/projects/');
  await page.getByRole('link', { name: /Example Project/ }).click();
  await expect(page).toHaveURL(/\/en\/projects\/example-project\//);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Example Project');
  await expect(page.getByText('Ada Lovelace')).toBeVisible();
  await expect(page.getByText('0.947')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Paper', exact: true })).toBeVisible();
});

test('projects render under a non-English locale via fallback', async ({ page }) => {
  await page.goto('/ja/projects/');
  await expect(page.getByRole('heading', { name: 'プロジェクト', level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /Example Project/ })).toBeVisible();
});

test('an unlisted project page is password-gated and absent from the projects index', async ({ page }) => {
  await page.goto('/en/projects/sgm-preview-7a2f/');
  // The password gate is shown; the real content is hidden behind it.
  await expect(page.getByRole('heading', { name: 'Private preview' })).toBeVisible();
  await expect(page.getByLabel('Password')).toBeVisible();
  await expect(page.getByRole('heading', { name: /Safe Generative Motion/ })).toBeHidden();
  // Entering the correct password unlocks the page and reveals the content.
  // NOTE: keep this in sync with `passwordHash` in sgm-preview-7a2f.mdx
  // (sha256 of this string). If you change the page password, update it here.
  await page.getByLabel('Password').fill('safe-motion-2026');
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page.getByRole('heading', { name: /Safe Generative Motion/ })).toBeVisible();
  // It stays absent from the public projects index regardless.
  await page.goto('/en/projects/');
  await expect(page.getByRole('link', { name: /Safe Generative Motion/ })).toHaveCount(0);
});

test('an old Jekyll publication URL redirects to the new Astro page', async ({ page }) => {
  await page.goto('/publication/2021-11-22-wvc2021-handarch-gabriel');
  await page.waitForURL(/\/en\/publications\/2021-11-22-wvc-handarch\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HandArch');
});

test('an old Jekyll section URL redirects to the English section', async ({ page }) => {
  await page.goto('/publications/');
  await page.waitForURL(/\/en\/publications\/?$/);
  await expect(page.getByRole('heading', { name: 'Publications', level: 1 })).toBeVisible();
});
