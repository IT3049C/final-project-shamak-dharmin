import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Tic Tac Toe' }).click();

    // Login Flow
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TicTacPlayer');
    await page.getByRole('button', { name: 'Start Playing' }).click();

    // Select Local Mode
    await page.getByRole('button', { name: /Local PvP/i }).click();
  });

  test('loads the game board', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Tic Tac Toe' })).toBeVisible();
    await expect(page.locator('.board-grid')).toBeVisible();
    await expect(page.locator('.square')).toHaveCount(9);
  });

  test('allows making a move', async ({ page }) => {
    // Click the first square
    await page.locator('.square').first().click();

    // Check if it's filled (X)
    // Using the aria-label we added or text content
    await expect(page.locator('.square').first()).toHaveText('X');

    // Check status update
    await expect(page.getByText('Next player: O')).toBeVisible();
  });


});
