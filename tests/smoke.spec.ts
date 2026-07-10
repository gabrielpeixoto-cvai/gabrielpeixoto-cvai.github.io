import { test, expect } from '@playwright/test';

test('homepage renders name and nav', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Gabriel Peixoto de Carvalho');
  await expect(page.getByRole('link', { name: 'Publications' })).toBeVisible();
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
