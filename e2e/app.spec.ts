import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should display title and forms', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Trut Online')).toBeVisible();
    await expect(page.getByTestId('create-game-form')).toBeVisible();
    await expect(page.getByTestId('join-game-form')).toBeVisible();
  });

  test('should have disabled create button initially', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('create-btn')).toBeDisabled();
  });

  test('should enable create button when pseudo entered', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('pseudo-input').fill('Alice');
    await expect(page.getByTestId('create-btn')).toBeEnabled();
  });

  test('should have disabled join button initially', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('join-btn')).toBeDisabled();
  });

  test('should enable join button when both fields filled', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('gameid-input').fill('some-id');
    await page.getByTestId('join-pseudo-input').fill('Bob');
    await expect(page.getByTestId('join-btn')).toBeEnabled();
  });

  test('should pre-fill game ID from URL param', async ({ page }) => {
    await page.goto('/?join=test-game-id');
    await expect(page.getByTestId('gameid-input')).toHaveValue('test-game-id');
  });

  test('should show error on create with failed API', async ({ page }) => {
    await page.route('**/api/games', (route) =>
      route.fulfill({ status: 500, body: 'Server error' })
    );
    await page.goto('/');
    await page.getByTestId('pseudo-input').fill('Alice');
    await page.getByTestId('create-btn').click();
    await expect(page.getByTestId('home-error')).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should redirect to home when accessing lobby without session', async ({ page }) => {
    await page.goto('/lobby/nonexistent');
    // Should redirect to / since no playerId in store
    await expect(page).toHaveURL('/');
  });

  test('should redirect to home when accessing game without session', async ({ page }) => {
    await page.goto('/game/nonexistent');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Create and Join flow (mocked API)', () => {
  test('should navigate to lobby after creating game', async ({ page }) => {
    await page.route('**/api/games', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameId: 'mock-game-id', playerId: 'mock-player-id' }),
      })
    );

    await page.goto('/');
    await page.getByTestId('pseudo-input').fill('Alice');
    await page.getByTestId('create-btn').click();

    await expect(page).toHaveURL(/\/lobby\/mock-game-id/);
    await expect(page.getByTestId('lobby-page')).toBeVisible();
  });

  test('should navigate to lobby after joining game', async ({ page }) => {
    await page.route('**/api/games/test-game/join', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          playerId: 'mock-player-2',
          players: [
            { id: 'p1', pseudo: 'Alice', team: 'TEAM_A', cardCount: 0 },
            { id: 'mock-player-2', pseudo: 'Bob', team: 'TEAM_B', cardCount: 0 },
          ],
        }),
      })
    );

    await page.goto('/');
    await page.getByTestId('gameid-input').fill('test-game');
    await page.getByTestId('join-pseudo-input').fill('Bob');
    await page.getByTestId('join-btn').click();

    await expect(page).toHaveURL(/\/lobby\/test-game/);
  });
});

test.describe('Lobby Page', () => {
  test('should display share link and copy button', async ({ page }) => {
    // Set up state via mocked create
    await page.route('**/api/games', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ gameId: 'share-test', playerId: 'p1' }),
      })
    );

    await page.goto('/');
    await page.getByTestId('pseudo-input').fill('Alice');
    await page.getByTestId('create-btn').click();

    await expect(page.getByTestId('share-link')).toBeVisible();
    await expect(page.getByTestId('copy-btn')).toBeVisible();
    await expect(page.getByText('share-test')).toBeVisible();
  });
});
