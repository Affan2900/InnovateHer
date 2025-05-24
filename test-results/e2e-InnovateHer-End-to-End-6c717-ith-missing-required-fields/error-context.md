# Test info

- Name: InnovateHer End-to-End Seller Flow >> Seller cannot add item with missing required fields
- Location: D:\Semester 6\SQE\Project\InnovateHer\tests\e2e.spec.js:31:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('.text-red-600, .text-red-700')
Expected string: "required"
Received: <element(s) not found>
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('.text-red-600, .text-red-700')

    at D:\Semester 6\SQE\Project\InnovateHer\tests\e2e.spec.js:36:64
```

# Page snapshot

```yaml
- navigation:
  - link "InnovateHer":
    - /url: /en
  - list:
    - listitem:
      - link "Home":
        - /url: /en
    - listitem:
      - link "Marketplace":
        - /url: /en/marketplace
    - listitem:
      - link "Skill Building":
        - /url: /en/skill-building
    - listitem:
      - link "Networking":
        - /url: /en/networking
    - listitem:
      - link "Mentorship":
        - /url: /en/mentorship
    - listitem:
      - link "Login":
        - /url: /en/login
        - button "Login"
- combobox:
  - option "English" [selected]
  - option "اردو"
- img
- heading "Add Marketplace Item" [level=2]
- text: "Item Name:"
- textbox "Item Name:"
- text: "Item Price:"
- textbox "Item Price:"
- text: "Item Description:"
- textbox "Item Description:"
- text: "Upload Image:"
- button "Loading..."
- text: Loading...
- button "Loading..." [disabled]
- alert
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('InnovateHer End-to-End Seller Flow', () => {
   4 |   const baseUrl = 'http://localhost:3000/en';
   5 |   const userId = '6826323ab2d296dd26f0d700';
   6 |
   7 |   test('Seller can login, add marketplace item', async ({ page }) => {
   8 |     await page.goto(`${baseUrl}/login`);
   9 |     await page.fill('input[name="email"]', 'uffi@gmail.com');
  10 |     await page.fill('input[name="password"]', '12345678');
  11 |     await page.selectOption('select[name="role"]', 'seller');
  12 |     await page.click('button[type="submit"]');
  13 |     // Wait for dashboard or marketplace page (wait for a known element)
  14 |     await expect(page.locator('text=marketplace', { timeout: 10000 })).toBeVisible();
  15 |
  16 |
  17 |   });
  18 |
  19 |   
  20 |
  21 |   test('Price validation error is shown for out-of-range price', async ({ page }) => {
  22 |     await page.goto(`${baseUrl}/${userId}/marketplace/add`);
  23 |     await page.fill('input[name="name"]', 'Invalid Price Item');
  24 |     await page.fill('input[name="price"]', '10001');
  25 |     await page.fill('textarea[name="description"]', 'Should fail.');
  26 |     await page.click('button[type="submit"]');
  27 |     // Wait for error to appear (use the exact error message from your frontend)
  28 |     await expect(page.locator('.text-red-600, .text-red-700')).toBeVisible();
  29 |   });
  30 |
  31 |   test('Seller cannot add item with missing required fields', async ({ page }) => {
  32 |     await page.goto(`${baseUrl}/${userId}/marketplace/add`);
  33 |     await page.fill('input[name="name"]', '');
  34 |     await page.fill('input[name="price"]', '');
  35 |     await page.click('button[type="submit"]');
> 36 |     await expect(page.locator('.text-red-600, .text-red-700')).toContainText('required');
     |                                                                ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  37 |   });
  38 |
  39 |   
  40 | });
```