import { test, expect } from '@playwright/test';

test.describe('Wordle Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Wordle' }).click();

    // Login Flow
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('WordlePlayer');
    await page.getByRole('button', { name: 'Start Playing' }).click();
  });

  test('loads the game', async ({ page }) => {

    // Check for input field
    await expect(page.locator('.wordle-input')).toBeVisible();
  });

  test('allows entering a guess', async ({ page }) => {
    // Wait for game to be ready
    await expect(page.locator('.wordle-row').first()).toBeVisible({ timeout: 10000 });

    // Type a word using input
    await page.fill('.wordle-input', 'APPLE');

    // Click Guess button
    await page.getByRole('button', { name: 'Guess' }).click();

    // Wait for animation/validation
    await page.waitForTimeout(2000);

    // Check if first row is filled
    const firstRow = page.locator('.wordle-row').first();
    await expect(firstRow).toContainText('A');
  });
});