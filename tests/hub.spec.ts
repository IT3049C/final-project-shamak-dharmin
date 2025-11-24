import { test, expect } from '@playwright/test';

test.describe('GameHub Landing Page', () => {
  test('loads the landing page and lists available games', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /gamehub/i })).toBeVisible();
    await expect(page.getByText(/developed by/i)).toBeVisible();

    await expect(page.getByRole('link', { name: /memory match/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /connect four/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /wordle/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /typing speed test/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /rock paper scissors/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /tic tac toe/i })).toBeVisible();
  });

  test('captures a player name', async ({ page }) => {
    await page.goto('/');

    const nameInput = page.getByLabel('Player name');
    await nameInput.fill('Test Player');

    await expect(page.getByText(/welcome, test player/i)).toBeVisible();
  });

  test('navigates from hub into all game pages and back, keeping player name', async ({ page }) => {
    await page.goto('/');

    const nameInput = page.getByLabel('Player name');
    await nameInput.fill('Navigator');

    const links = [
      { name: /memory match/i, path: '/memory-match' },
      { name: /connect four/i, path: '/connect-four' },
      { name: /wordle/i, path: '/wordle' },
      { name: /typing speed test/i, path: '/typing-speed' },
      { name: /rock paper scissors/i, path: '/rock-paper-scissors' },
      { name: /tic tac toe/i, path: '/tic-tac-toe' },
    ];

    for (const link of links) {
      await page.getByRole('link', { name: link.name }).click();
      await expect(page).toHaveURL(new RegExp(`${link.path}$`));

      // Handle avatar selection for games that require it
      const hasAvatarSelector = await page.locator('.avatar-selector').isVisible().catch(() => false);
      if (hasAvatarSelector) {
        await page.click('.avatar-option:first-child');
        await page.fill('input[type="text"]', 'Navigator');
        await page.click('button:has-text("Start Playing")');
      }

      // Check for player name (different formats for different games)
      const hasPlayerBanner = await page.getByLabel('Current player').isVisible().catch(() => false);
      const hasPlayerInfo = await page.locator('.player-info').isVisible().catch(() => false);
      
      if (hasPlayerBanner) {
        await expect(page.getByLabel('Current player')).toContainText('Navigator');
      } else if (hasPlayerInfo) {
        await expect(page.locator('.player-info')).toContainText('Navigator');
      }

      await page.getByRole('button', { name: /back/i }).click();
      await expect(page).toHaveURL(/\/$/);
    }
  });
});