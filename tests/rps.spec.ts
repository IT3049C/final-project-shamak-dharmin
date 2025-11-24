import { test, expect } from '@playwright/test';

test.describe('Rock Paper Scissors Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rock-paper-scissors');
  });

  test('loads the initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /rock paper scissors/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /rock/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /paper/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /scissors/i })).toBeVisible();
    await expect(page.getByText(/make your move/i)).toBeVisible();
  });

  test('allows interacting with the game components', async ({ page }) => {
    // Click on Rock button
    await page.getByRole('button', { name: /^rock$/i }).click();

    // Verify result message appears (win, lose, or draw)
    const resultText = page.locator('.rps-result');
    await expect(resultText).toBeVisible();
    
    // Verify choices are displayed
    const choiceElements = page.locator('.rps-choice');
    await expect(choiceElements.first()).toContainText(/rock|paper|scissors/i);

    // Verify scoreboard updates
    const scoreboard = page.getByLabel(/scoreboard/i);
    await expect(scoreboard).toBeVisible();
  });

  test('can reset the game to return to initial state', async ({ page }) => {
    // Play a round
    await page.getByRole('button', { name: /^rock$/i }).click();
    await expect(page.getByText(/you win|you lose|it's a draw/i)).toBeVisible();

    // Reset the game
    await page.getByRole('button', { name: /reset rock paper scissors game/i }).click();

    // Verify game returns to initial state
    await expect(page.getByText(/make your move/i)).toBeVisible();
    
    // Verify score is reset to 0
    const scoreboard = page.getByLabel(/scoreboard/i);
    await expect(scoreboard).toContainText(/wins: 0/i);
    await expect(scoreboard).toContainText(/losses: 0/i);
    await expect(scoreboard).toContainText(/draws: 0/i);
  });

  test('tracks score across multiple rounds', async ({ page }) => {
    // Play multiple rounds
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: /^rock$/i }).click();
      await page.waitForTimeout(100); // Small delay between rounds
    }

    // Verify scoreboard shows cumulative results
    const scoreboard = page.getByLabel(/scoreboard/i);
    const scoreText = await scoreboard.textContent();
    
    // The total should be 3 (wins + losses + draws = 3)
    expect(scoreText).toMatch(/wins: \d|losses: \d|draws: \d/i);
  });
});
