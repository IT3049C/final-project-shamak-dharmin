import { test, expect } from '@playwright/test';

test.describe('Tic Tac Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tic-tac-toe');
  });

  test('loads the initial state of the game', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /tic tac toe/i })).toBeVisible();
    
    // Check that all 9 squares are visible
    const board = page.getByLabel(/tic tac toe board/i);
    await expect(board).toBeVisible();
    
    const squares = page.locator('.square');
    await expect(squares).toHaveCount(9);
    
    // Check initial status message
    await expect(page.getByText(/next player: x/i)).toBeVisible();
  });

  test('allows interacting with the game components', async ({ page }) => {
    // Click on first square
    const firstSquare = page.getByLabel(/square 1, empty/i);
    await firstSquare.click();
    
    // Verify X appears in the square
    await expect(page.getByLabel(/square 1, x/i)).toBeVisible();
    
    // Verify turn changes
    await expect(page.getByText(/next player: o/i)).toBeVisible();
    
    // Click on second square
    const secondSquare = page.getByLabel(/square 2, empty/i);
    await secondSquare.click();
    
    // Verify O appears
    await expect(page.getByLabel(/square 2, o/i)).toBeVisible();
    
    // Verify turn changes back to X
    await expect(page.getByText(/next player: x/i)).toBeVisible();
  });

  test('can reset the game to return to initial state', async ({ page }) => {
    // Play a few moves
    await page.getByLabel(/square 1, empty/i).click();
    await page.getByLabel(/square 2, empty/i).click();
    await page.getByLabel(/square 3, empty/i).click();
    
    // Reset the game
    await page.getByRole('button', { name: /reset tic tac toe game/i }).click();
    
    // Verify all squares are empty
    const squares = page.locator('.square');
    for (let i = 0; i < 9; i++) {
      const square = squares.nth(i);
      const text = await square.textContent();
      expect(text?.trim()).toBe('');
    }
    
    // Verify status returns to initial
    await expect(page.getByText(/next player: x/i)).toBeVisible();
  });

  test('detects a winner', async ({ page }) => {
    // Play a winning game for X (top row: 0, 1, 2)
    await page.getByLabel(/square 1, empty/i).click(); // X
    await page.getByLabel(/square 4, empty/i).click(); // O
    await page.getByLabel(/square 2, empty/i).click(); // X
    await page.getByLabel(/square 5, empty/i).click(); // O
    await page.getByLabel(/square 3, empty/i).click(); // X wins
    
    // Check for winner message
    await expect(page.getByText(/winner: x/i)).toBeVisible();
  });

  test('detects a draw', async ({ page }) => {
    // Play a draw game
    // X O X
    // X O O
    // O X X
    await page.getByLabel(/square 1, empty/i).click(); // X
    await page.getByLabel(/square 2, empty/i).click(); // O
    await page.getByLabel(/square 3, empty/i).click(); // X
    await page.getByLabel(/square 4, empty/i).click(); // X
    await page.getByLabel(/square 5, empty/i).click(); // O
    await page.getByLabel(/square 6, empty/i).click(); // O
    await page.getByLabel(/square 7, empty/i).click(); // O
    await page.getByLabel(/square 8, empty/i).click(); // X
    await page.getByLabel(/square 9, empty/i).click(); // X
    
    // Check for draw message
    await expect(page.getByText(/it's a draw/i)).toBeVisible();
  });

  test('prevents clicking on occupied squares', async ({ page }) => {
    // Click on a square
    await page.getByLabel(/square 1, empty/i).click();
    await expect(page.getByLabel(/square 1, x/i)).toBeVisible();
    
    // Try to click on the same square again
    await page.getByLabel(/square 1, x/i).click();
    
    // Verify it's still X (not changed to O)
    await expect(page.getByLabel(/square 1, x/i)).toBeVisible();
    
    // Verify turn is still O's turn (didn't advance)
    await expect(page.getByText(/next player: o/i)).toBeVisible();
  });
});
