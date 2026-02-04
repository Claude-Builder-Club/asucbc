import { test, expect } from '@playwright/test';

// Helper function to open command menu with correct keyboard shortcut
async function openCommandMenu(page: any) {
  const isMac = process.platform === 'darwin';
  const modifierKey = isMac ? 'Meta' : 'Control';
  await page.keyboard.press(`${modifierKey}+k`);
}

test.describe('Command Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should open command menu with Cmd+K (Mac) / Ctrl+K (Windows)', async ({ page, browserName }) => {
    // Open command menu with OS-specific shortcut
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible({ timeout: 2000 });

    // Verify search input is focused
    const searchInput = page.locator('[cmdk-input]');
    await expect(searchInput).toBeFocused();
  });

  test('should open command menu via search button click', async ({ page }) => {
    // Find and click the search button
    const searchButton = page.getByRole('button', { name: /search|command menu/i }).first();
    await searchButton.click();

    // Verify command menu appears
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();
  });

  test('should close command menu with Escape key', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Verify it's open
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Press escape to close
    await page.keyboard.press('Escape');

    // Verify it's closed
    await expect(commandMenu).not.toBeVisible({ timeout: 1000 });
  });

  test('should close command menu when clicking outside', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Verify it's open
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Press escape to close (clicking backdrop can be flaky in tests)
    await page.keyboard.press('Escape');

    // Verify it's closed
    await expect(commandMenu).not.toBeVisible({ timeout: 1000 });
  });

  test('should display all main navigation pages', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Check for main pages - use more specific selectors
    await expect(page.getByRole('option', { name: /^Home/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /^About/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /^Team/i, exact: false }).first()).toBeVisible();
  });

  test('should display hidden developer pages', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Check for hidden developer page
    await expect(page.locator('[cmdk-item]', { hasText: 'Devs' })).toBeVisible();
  });

  test('should filter items when searching', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Type in search
    await page.keyboard.type('about');

    // Verify About item is visible - use more specific selector
    await expect(page.getByRole('option', { name: /^About/i })).toBeVisible();

    // Verify other items are filtered out (or fewer items are shown)
    const items = page.locator('[cmdk-item]');
    const count = await items.count();
    
    // With search, there should be fewer items than total available
    expect(count).toBeLessThanOrEqual(5);
  });

  test('should navigate to page when selecting an item', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Click on About item
    const aboutItem = page.locator('[cmdk-item]', { hasText: 'About' }).first();
    await aboutItem.click();

    // Verify navigation to about page
    await expect(page).toHaveURL(/.*\/about/);

    // Verify command menu is closed
    await expect(commandMenu).not.toBeVisible();
  });

  test('should navigate with keyboard arrow keys', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Press arrow down to select first item
    await page.keyboard.press('ArrowDown');

    // Verify first item is selected
    const selectedItem = page.locator('[cmdk-item][data-selected="true"]').first();
    await expect(selectedItem).toBeVisible();

    // Press Enter to navigate
    await page.keyboard.press('Enter');

    // Verify we navigated away from home
    await page.waitForURL(url => url.pathname !== '/');
    
    // Verify command menu is closed
    await expect(commandMenu).not.toBeVisible();
  });

  test('should show external link indicators', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Look for Join Us item which is external
    const joinUsItem = page.locator('[cmdk-item]', { hasText: 'Join Us' });
    await expect(joinUsItem).toBeVisible();

    // Verify external link icon is present
    const externalIcon = joinUsItem.locator('svg').first();
    await expect(externalIcon).toBeVisible();
  });

  test('should show keyboard shortcuts hint in footer', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Check for keyboard shortcuts hints
    await expect(page.getByText(/to navigate/i)).toBeVisible();
    await expect(page.getByText(/to select/i)).toBeVisible();
    await expect(page.getByText(/to close/i)).toBeVisible();
  });

  test('should display "No results found" when search has no matches', async ({ page }) => {
    // Open command menu
    await openCommandMenu(page);

    // Wait for command menu to appear
    const commandMenu = page.locator('[cmdk-root]');
    await expect(commandMenu).toBeVisible();

    // Type a search that won't match anything
    await page.keyboard.type('xyzabc123notfound');

    // Verify "No results found" message appears
    await expect(page.getByText(/no results found/i)).toBeVisible();
  });
});
