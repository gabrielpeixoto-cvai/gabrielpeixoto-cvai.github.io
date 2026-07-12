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
  await page.goto('/publications/');
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
  await page.goto('/blog/');
  await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
  const post = page.getByRole('link', { name: /Example blog post/ });
  await expect(post).toBeVisible();
  await post.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Example blog post');
});

test('talks list renders the example talk with its venue', async ({ page }) => {
  await page.goto('/talks/');
  await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();
  await expect(page.getByText('Example Venue')).toBeVisible();
});

test('cv page renders its sections', async ({ page }) => {
  await page.goto('/cv/');
  await expect(page.getByRole('heading', { name: 'Curriculum Vitae', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Education' })).toBeVisible();
});

test('every section list page renders its heading', async ({ page }) => {
  const sections: [string, string][] = [
    ['/publications/', 'Publications'],
    ['/talks/', 'Talks'],
    ['/teaching/', 'Teaching'],
    ['/portfolio/', 'Portfolio'],
    ['/blog/', 'Blog'],
    ['/notes/', 'Notes'],
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
