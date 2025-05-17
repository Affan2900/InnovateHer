import { test, expect } from '@playwright/test';

test.describe('InnovateHer End-to-End Seller Flow', () => {
  const baseUrl = 'http://localhost:3000/en';
  const userId = '6826323ab2d296dd26f0d700';

  test('Seller can login, add marketplace item', async ({ page }) => {
    await page.goto(`${baseUrl}/login`);
    await page.fill('input[name="email"]', 'uffi@gmail.com');
    await page.fill('input[name="password"]', '12345678');
    await page.selectOption('select[name="role"]', 'seller');
    await page.click('button[type="submit"]');
    // Wait for dashboard or marketplace page (wait for a known element)
    await expect(page.locator('text=marketplace', { timeout: 10000 })).toBeVisible();


  });

  

  test('Price validation error is shown for out-of-range price', async ({ page }) => {
    await page.goto(`${baseUrl}/${userId}/marketplace/add`);
    await page.fill('input[name="name"]', 'Invalid Price Item');
    await page.fill('input[name="price"]', '10001');
    await page.fill('textarea[name="description"]', 'Should fail.');
    await page.click('button[type="submit"]');
    // Wait for error to appear (use the exact error message from your frontend)
    await expect(page.locator('.text-red-600, .text-red-700')).toBeVisible();
  });

  test('Seller cannot add item with missing required fields', async ({ page }) => {
    await page.goto(`${baseUrl}/${userId}/marketplace/add`);
    await page.fill('input[name="name"]', '');
    await page.fill('input[name="price"]', '');
    await page.click('button[type="submit"]');
    await expect(page.locator('.text-red-600, .text-red-700')).toContainText('required');
  });

  
});