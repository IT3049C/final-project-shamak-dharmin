import { test, expect } from '@playwright/test';

test.describe('Multiplayer API Integration', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the Create Room API
        await page.route('https://game-room-api.fly.dev/api/rooms', async route => {
            const method = route.request().method();
            if (method === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        roomId: 'TEST01',
                        gameState: {
                            board: Array(9).fill(null),
                            xIsNext: true,
                            players: [{ id: 'p1', name: 'TestPlayer' }],
                            hostId: 'p1'
                        }
                    })
                });
            } else {
                await route.continue();
            }
        });

        // Mock the Get Room API
        await page.route('https://game-room-api.fly.dev/api/rooms/TEST01', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: 'TEST01',
                    gameState: {
                        board: Array(9).fill(null),
                        xIsNext: true,
                        players: [{ id: 'p1', name: 'TestPlayer' }],
                        hostId: 'p1'
                    }
                })
            });
        });

        // Seed localStorage with a known player ID
        await page.addInitScript(() => {
            window.localStorage.setItem('game_player', JSON.stringify({
                name: 'TestPlayer',
                avatar: { id: 'wizard', name: 'Wizard', image: '/assets/wizard.png' },
                id: 'p1'
            }));
        });

        await page.goto('/');
        await page.getByRole('link', { name: 'Tic Tac Toe' }).click();

        // No need to login as we seeded localStorage
        // But we might need to wait for the page to load if it redirects or something
        // The previous test clicked 'Start Playing', but if we are already logged in,
        // Home page should show "Hi, TestPlayer" and TicTacToe should load directly.
        // Wait, if we go to /tictactoe directly, it should work.
        // But let's stick to the flow: Home -> TicTacToe.
        // Actually, if we are logged in, Home page header shows "Hi, ...".
        // And clicking TicTacToe should go straight to the game.
    });

    test('can create an online room', async ({ page }) => {
        // Click Create Online Room
        await page.getByRole('button', { name: /Create Online Room/i }).click();

        // Verify room code is displayed (from mock)
        await expect(page.getByText('Room: TEST01')).toBeVisible();
        await expect(page.getByText('You are: X')).toBeVisible();
    });

    test('can join an online room', async ({ page }) => {
        // Enter room code
        await page.getByPlaceholder('ROOM CODE').fill('TEST01');

        // Click Join
        await page.getByRole('button', { name: 'Join' }).click();

        // Verify room info
        await expect(page.getByText('Room: TEST01')).toBeVisible();
    });
});
