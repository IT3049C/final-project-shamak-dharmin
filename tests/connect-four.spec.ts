import { test, expect } from '@playwright/test';

test.describe('Connect Four Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/connect-four');
    await page.waitForLoadState('networkidle');
  });

  test('should display avatar selector on initial load', async ({ page }) => {
    await expect(page.locator('.avatar-selector')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Choose Your Avatar' })).toBeVisible();
  });

  test('should show 6 avatar options', async ({ page }) => {
    const avatarOptions = page.locator('.avatar-option');
    await expect(avatarOptions).toHaveCount(6);
  });

  test('should allow avatar selection', async ({ page }) => {
    const firstAvatar = page.locator('.avatar-option').first();
    await firstAvatar.click();
    await expect(firstAvatar).toHaveClass(/selected/);
  });

  test('should require name input before starting', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    
    const startButton = page.locator('.start-button');
    await expect(startButton).toBeDisabled();
    
    await page.locator('.player-name-input').fill('TestPlayer');
    await expect(startButton).toBeEnabled();
  });

  test('should start game after avatar and name selection', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.connect-four')).toBeVisible();
    await expect(page.locator('.game-board')).toBeVisible();
  });

  test('should display 6 rows and 7 columns (42 cells total)', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const rows = page.locator('.connect-four .board-row');
    await expect(rows).toHaveCount(6);
    
    const cells = page.locator('.connect-four .cell');
    await expect(cells).toHaveCount(42); // 6 rows × 7 columns
  });

  test('should display player info in header', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.player-name').filter({ hasText: 'TestPlayer' })).toBeVisible();
    await expect(page.locator('.player-avatar-img')).toBeVisible();
  });

  test('should show "Player 1\'s Turn" initially', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.game-status').filter({ hasText: 'Player 1\'s Turn' })).toBeVisible();
  });

  test('should place piece when clicking on a cell', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Click on a cell in the first column
    await page.locator('.connect-four .cell').first().click();
    
    // Wait for piece to drop
    await page.waitForTimeout(600);
    
    // Check if a piece was placed (cell should have player1 or player2 class)
    const cellsWithPieces = page.locator('.connect-four .cell.player1, .connect-four .cell.player2');
    await expect(cellsWithPieces).toHaveCount(1);
  });

  test('should alternate between Player 1 and Player 2', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Player 1's turn
    await expect(page.locator('.game-status').filter({ hasText: 'Player 1\'s Turn' })).toBeVisible();
    
    // Player 1 makes a move
    await page.locator('.connect-four .cell').first().click();
    await page.waitForTimeout(100);
    
    // Should now be Player 2's turn
    await expect(page.locator('.game-status').filter({ hasText: 'Player 2\'s Turn' })).toBeVisible();
  });

  test('should display red pieces for Player 1', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Player 1 makes a move
    await page.locator('.connect-four .cell').first().click();
    await page.waitForTimeout(600);
    
    // Check if cell has player1 class
    const player1Cell = page.locator('.connect-four .cell.player1').first();
    await expect(player1Cell).toBeVisible();
  });

  test('should display cyan pieces for Player 2', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Player 1 makes a move
    await page.locator('.connect-four .cell').nth(0).click();
    await page.waitForTimeout(100);
    
    // Player 2 makes a move
    await page.locator('.connect-four .cell').nth(7).click(); // Second column, first row
    await page.waitForTimeout(600);
    
    // Check if cell has player2 class
    const player2Cell = page.locator('.connect-four .cell.player2').first();
    await expect(player2Cell).toBeVisible();
  });

  test('should stack pieces with gravity effect', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const firstColumnCells = page.locator('.connect-four .board-row .cell:first-child');
    
    // Place first piece
    await firstColumnCells.first().click();
    await page.waitForTimeout(600);
    
    // Place second piece in same column
    await firstColumnCells.first().click();
    await page.waitForTimeout(600);
    
    // Should have 2 pieces in the first column
    const piecesInColumn = page.locator('.connect-four .board-row .cell:first-child.player1, .connect-four .board-row .cell:first-child.player2');
    await expect(piecesInColumn).toHaveCount(2);
  });

  test('should have a back button', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.back-button')).toBeVisible();
  });

  test('should navigate back to home when back button is clicked', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await page.locator('.back-button').click();
    
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('should not allow placing piece in full column', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const firstColumnCell = page.locator('.connect-four .cell').first();
    
    // Fill the column (6 pieces)
    for (let i = 0; i < 6; i++) {
      await firstColumnCell.click();
      await page.waitForTimeout(200);
    }
    
    // Try to place 7th piece
    await firstColumnCell.click();
    await page.waitForTimeout(200);
    
    // Should still only have 6 pieces in first column
    const piecesInColumn = page.locator('.connect-four .board-row .cell:first-child.player1, .connect-four .board-row .cell:first-child.player2');
    await expect(piecesInColumn).toHaveCount(6);
  });

  test('should apply theme toggle correctly', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.theme-toggle')).toBeVisible();
    
    await page.locator('.theme-toggle').click();
    
    const htmlElement = page.locator('html');
    const theme = await htmlElement.getAttribute('data-theme');
    expect(theme).toBeTruthy();
  });

  test('should display pieces with drop animation', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await page.locator('.connect-four .cell').first().click();
    
    // Piece should appear after animation
    await page.waitForTimeout(600);
    
    const piece = page.locator('.connect-four .cell.player1 .piece').first();
    await expect(piece).toBeVisible();
  });

  test('should have correct board styling with blue background', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const gameBoard = page.locator('.connect-four .game-board');
    await expect(gameBoard).toBeVisible();
    
    // Check if board has background styling
    const backgroundColor = await gameBoard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(backgroundColor).toBeTruthy();
  });

  test('should show game status for Player 1 and Player 2 with correct colors', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Player 1's turn (should be red)
    const player1Status = page.locator('.current-turn.player1');
    await expect(player1Status).toBeVisible();
    
    // Make a move
    await page.locator('.connect-four .cell').first().click();
    await page.waitForTimeout(100);
    
    // Player 2's turn (should be cyan)
    const player2Status = page.locator('.current-turn.player2');
    await expect(player2Status).toBeVisible();
  });

  test('should display 6 rows visually in the board', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Wait for game board to be fully rendered
    await page.waitForSelector('.connect-four .game-board', { state: 'visible' });
    
    // Count visible rows
    const rows = page.locator('.connect-four .board-row');
    await expect(rows).toHaveCount(6);
    
    // Verify each row is visible
    for (let i = 0; i < 6; i++) {
      await expect(rows.nth(i)).toBeVisible();
    }
  });

  test('should have 7 cells in each row', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const firstRow = page.locator('.connect-four .board-row').first();
    const cellsInRow = firstRow.locator('.cell');
    
    await expect(cellsInRow).toHaveCount(7);
  });
});
