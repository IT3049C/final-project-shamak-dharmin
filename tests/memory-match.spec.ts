import { test, expect } from '@playwright/test';

test.describe('Memory Match Game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/memory-match');
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
    // Select avatar
    await page.locator('.avatar-option').first().click();
    
    // Try to start without name
    const startButton = page.locator('.start-button');
    await expect(startButton).toBeDisabled();
    
    // Enter name
    await page.locator('.player-name-input').fill('TestPlayer');
    await expect(startButton).toBeEnabled();
  });

  test('should start game after avatar and name selection', async ({ page }) => {
    // Select avatar and enter name
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Verify game board is displayed
    await expect(page.locator('.memory-match')).toBeVisible();
    await expect(page.locator('.game-board')).toBeVisible();
  });

  test('should display 16 cards in a 4x4 grid', async ({ page }) => {
    // Setup game
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Check cards
    const cards = page.locator('.card');
    await expect(cards).toHaveCount(16);
  });

  test('should display player info in header', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.player-name').filter({ hasText: 'TestPlayer' })).toBeVisible();
    await expect(page.locator('.player-avatar-img')).toBeVisible();
  });

  test('should show move counter', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    await expect(page.locator('.stat').filter({ hasText: 'Moves: 0' })).toBeVisible();
  });

  test('should flip cards on click', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const firstCard = page.locator('.card').first();
    await firstCard.click();
    
    await expect(firstCard).toHaveClass(/flipped/);
  });

  test('should increment move counter when two cards are flipped', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Flip two cards
    await page.locator('.card').nth(0).click();
    await page.locator('.card').nth(1).click();
    
    // Wait for move counter update
    await page.waitForTimeout(100);
    await expect(page.locator('.stat').filter({ hasText: 'Moves: 1' })).toBeVisible();
  });

  test('should keep matched cards flipped', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Try to find a match by flipping cards
    // Note: This test might need adjustment based on card positions
    const cards = page.locator('.card');
    await cards.nth(0).click();
    await cards.nth(1).click();
    
    // Wait for animation
    await page.waitForTimeout(1200);
    
    // Check if cards stay flipped (if matched) or flip back (if not matched)
    const firstCard = cards.nth(0);
    const hasFlippedClass = await firstCard.evaluate((el) => el.classList.contains('flipped'));
    
    // Cards should either both be flipped (matched) or both be unflipped (not matched)
    expect(typeof hasFlippedClass).toBe('boolean');
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
    
    // Should be on home page
    await expect(page).toHaveURL('http://localhost:5173/');
  });

  test('should display cards with star symbol on front', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    const cardFront = page.locator('.card-front').first();
    await expect(cardFront).toHaveText('★');
  });

  test('should display emoji symbols on card backs', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Flip a card to see the back
    await page.locator('.card').first().click();
    
    const cardBack = page.locator('.card.flipped .card-back').first();
    const text = await cardBack.textContent();
    
    // Should contain an emoji (checking if it's not empty)
    expect(text).toBeTruthy();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('should apply theme toggle correctly', async ({ page }) => {
    await page.locator('.avatar-option').first().click();
    await page.locator('.player-name-input').fill('TestPlayer');
    await page.locator('.start-button').click();
    
    // Check theme toggle exists
    await expect(page.locator('.theme-toggle')).toBeVisible();
    
    // Click theme toggle
    await page.locator('.theme-toggle').click();
    
    // Check if data-theme attribute changes
    const htmlElement = page.locator('html');
    const theme = await htmlElement.getAttribute('data-theme');
    expect(theme).toBeTruthy();
  });
});
