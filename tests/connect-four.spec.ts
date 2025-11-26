import { test, expect } from '@playwright/test';

test.describe('Connect Four Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Connect Four' }).click();

    // Login Flow
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('C4Player');
    await page.getByRole('button', { name: 'Start Playing' }).click();
  });

  test('loads the game board', async ({ page }) => {
    // Check for cells (6 rows * 7 cols = 42)
    await expect(page.locator('.cell')).toHaveCount(42);
  });

  test('allows dropping a piece', async ({ page }) => {
    // Click the first cell (top-left) - logic usually handles column selection
    await page.locator('.cell').first().click();

    // Wait for animation/update
    await page.waitForTimeout(1000);

    // We check if ANY cell has the player class
    await expect(page.locator('.cell.player1')).toHaveCount(1);

    // Check turn update
    await expect(page.getByText("Player 2's Turn")).toBeVisible();
  });
});
