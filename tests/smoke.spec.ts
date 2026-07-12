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
