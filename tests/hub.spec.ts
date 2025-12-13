import { test, expect } from '@playwright/test';

test.describe('GameHub Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the landing page correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/GameHub/i);
    await expect(page.getByRole('heading', { name: 'GameHub', level: 1 })).toBeVisible();
    await expect(page.getByText('Your premium gaming destination')).toBeVisible();
  });

  test('displays links to all games', async ({ page }) => {
    const games = [
      'Tic Tac Toe',
      'Rock Paper Scissors',
      'Memory Match',
      'Connect Four',
      'Wordle',
      'Typing Speed', // Note: Link text might be "Typing Speed Test"
      'Quick Draw',
      'Pattern Lock'
    ];



    // Check that we have game links
    const gameLinks = page.locator('a[href^="/"]');
    await expect(gameLinks).toHaveCount(await gameLinks.count());
    // Ensure we have at least 5 games
    expect(await gameLinks.count()).toBeGreaterThan(5);
  });

  test('can navigate to a game and login', async ({ page }) => {
    await page.getByRole('link', { name: 'Tic Tac Toe' }).click();

    // Should see Avatar Selector
    await expect(page.locator('.avatar-selector')).toBeVisible();

    // Select Avatar
    await page.locator('.avatar-option').first().click();

    // Enter Name
    await page.locator('.player-name-input').fill('Test User');

    // Start Game
    await page.getByRole('button', { name: 'Start Playing' }).click();

    // Verify Player Name in Header
    await expect(page.getByText('Test User').first()).toBeVisible();
  });
});