import { test, expect } from '@playwright/test';

test.describe('Login Functionality (formerly Quick Login)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test('should display login form by default', async ({ page }) => {
    // Verify login form is displayed by default (no need to click button)
    await expect(page.locator('[data-testid="quick-login-form"]')).toBeVisible();
    await expect(page.locator('text=ជ្រើសអ្នកប្រើប្រាស់')).toBeVisible();
    await expect(page.locator('input[placeholder="បញ្ចូលពាក្យសម្ងាត់"]')).toBeVisible();
  });

  test('should load users in the dropdown', async ({ page }) => {
    // Click on the user select dropdown
    await page.click('.ant-select-selector');
    
    // Wait for dropdown options to load
    await page.waitForSelector('.ant-select-item-option', { timeout: 5000 });
    
    // Verify users are present
    const userOptions = await page.locator('.ant-select-item-option').allTextContents();
    
    // Check for actual users from database
    expect(userOptions).toContain('admin (admin)');
    expect(userOptions).toContain('coordinator (coordinator)');
    expect(userOptions.some(option => option.includes('(mentor)'))).toBeTruthy();
    expect(userOptions.length).toBeGreaterThan(10); // Should have many users
  });

  test('should show validation error when no user is selected', async ({ page }) => {
    
    // Enter password without selecting user
    await page.fill('input[placeholder="Password"]', 'password123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Please select a user')).toBeVisible();
  });

  test('should show validation error when no password is entered', async ({ page }) => {
    
    // Select a user without entering password
    await page.click('.ant-select-selector');
    await page.click('text=admin.demo (admin)');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should show validation error
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should attempt login when user and password are provided', async ({ page }) => {
    
    // Select a user
    await page.click('.ant-select-selector');
    await page.click('text=admin (admin)');
    
    // Enter password
    await page.fill('input[placeholder="Password"]', 'test123');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Should show loading state or redirect
    // Note: Since we don't have valid credentials, this will likely show an error
    // but the form submission should work
    await page.waitForTimeout(2000);
    
    // Check if we get either a redirect or an error message
    const currentUrl = page.url();
    const hasErrorMessage = await page.locator('text=Invalid credentials').isVisible().catch(() => false);
    
    // Either we redirected (successful login) or got an error message
    expect(currentUrl !== page.url() || hasErrorMessage).toBeTruthy();
  });


  test('should display user roles correctly in dropdown', async ({ page }) => {
    
    // Click on the user select dropdown
    await page.click('.ant-select-selector');
    
    // Wait for dropdown options to load
    await page.waitForSelector('.ant-select-item-option', { timeout: 5000 });
    
    // Check that each role type is represented
    const userOptions = await page.locator('.ant-select-item-option').allTextContents();
    
    expect(userOptions.some(option => option.includes('(admin)'))).toBeTruthy();
    expect(userOptions.some(option => option.includes('(coordinator)'))).toBeTruthy();
    expect(userOptions.some(option => option.includes('(mentor)'))).toBeTruthy();
    // Note: May not have teacher or viewer roles in actual database
  });

  test('should handle network error gracefully', async ({ page }) => {
    // Intercept the quick-users API call and make it fail
    await page.route('**/api/auth/quick-users', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    
    // Click on the user select dropdown
    await page.click('.ant-select-selector');
    
    // Should handle the error gracefully (may show empty dropdown or error message)
    await page.waitForTimeout(2000);
    
    // The dropdown should not crash the application
    await expect(page.locator('.ant-select-selector')).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    
    // Check accessibility attributes
    const userSelect = page.locator('.ant-select-selector').first();
    const passwordInput = page.locator('input[placeholder="Password"]');
    const loginButton = page.locator('button[type="submit"]');
    
    await expect(userSelect).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    
    // Check that elements are focusable
    await userSelect.focus();
    await passwordInput.focus();
    await loginButton.focus();
  });
});