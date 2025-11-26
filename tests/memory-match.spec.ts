import { test, expect } from '@playwright/test';

test.describe('Memory Match Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Memory Match' }).click();

    // Login Flow
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('MemoryPlayer');
    await page.getByRole('button', { name: 'Start Playing' }).click();
  });

  test('loads the game board', async ({ page }) => {
    await expect(page.locator('.card')).toHaveCount(16);
  });

  test('allows flipping a card', async ({ page }) => {
    const firstCard = page.locator('.card').first();

    // Ensure it's not flipped initially
    await expect(firstCard).not.toHaveClass(/flipped/);

    // Click to flip
    await firstCard.click();

    // Check if flipped
    await expect(firstCard).toHaveClass(/flipped/);

  });
});
