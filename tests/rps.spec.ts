import { test, expect } from '@playwright/test';

test.describe('Rock Paper Scissors Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /RPS Duel/i }).click();

    // Login Flow
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('RPSPlayer');
    await page.getByRole('button', { name: 'Start Playing' }).click();
    await page.waitForTimeout(2000);
  });

  test('loads the game', async ({ page }) => {
    // Debug: Print page content
    console.log(await page.content());
    // Ensure login screen is gone
    await expect(page.locator('.avatar-selector')).not.toBeVisible();

    // Check for the 3 options
    await expect(page.locator('.choice-btn')).toHaveCount(3);
  });

  test('allows playing a round', async ({ page }) => {
    // Click Rock
    await page.getByRole('button', { name: /rock/i }).click();

    // Wait for result
    await expect(page.locator('.result-display h2')).toHaveText(/Win|Lose|Draw/);
  });
});
