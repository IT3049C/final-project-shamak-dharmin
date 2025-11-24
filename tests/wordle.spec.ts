import { test, expect } from '@playwright/test';

test.describe('Wordle Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wordle');
  });

  test('loads initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /wordle/i })).toBeVisible();
    await expect(page.getByLabel(/enter a 5-letter word/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /guess/i })).toBeVisible();
  });

  test('allows interacting with the game components', async ({ page }) => {
    const input = page.getByLabel(/enter a 5-letter word/i);

    await input.fill('APPLE');
    await page.getByRole('button', { name: /guess/i }).click();

    const rows = page.locator('.wordle-row');
    await expect(rows.first().locator('.wordle-cell')).toHaveCount(5);
  });

  test('can reset the game to return to initial state', async ({ page }) => {
    const input = page.getByLabel(/enter a 5-letter word/i);

    await input.fill('APPLE');
    await page.getByRole('button', { name: /guess/i }).click();

    await page.getByRole('button', { name: /new game/i }).click();

    await expect(page.locator('.wordle-row .correct, .wordle-row .present, .wordle-row .absent')).toHaveCount(0);
  });
});