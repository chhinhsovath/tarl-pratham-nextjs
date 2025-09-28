import { test, expect } from '@playwright/test';

test.describe('TaRL Homepage Tests', () => {
  test('should load homepage and verify key elements', async ({ page }) => {
    // Navigate to the live homepage
    await page.goto('https://tarl.openplp.com/');

    // Verify page title
    await expect(page).toHaveTitle(/TaRL/);

    // Verify main header elements
    await expect(page.locator('h1')).toContainText('TaRL ប្រាថម');

    // Verify navigation menu exists
    await expect(page.locator('nav')).toBeVisible();

    // Verify hero section
    await expect(page.locator('h2')).toContainText('ប្រព័ន្ធការបង្រៀនស្របតាមសមត្ថភាព');

    // Verify login buttons
    await expect(page.locator('text=ចូលរហ័ស')).toBeVisible();
    await expect(page.locator('text=ចូល')).toBeVisible();

    console.log('✅ Homepage loaded successfully with all key elements');
  });

  test('should verify navigation links work', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Test navigation to overview section
    await page.click('text=ទិដ្ឋភាពរួម');
    await expect(page.locator('#overview')).toBeInViewport();

    // Test navigation to assessments section
    await page.click('text=ការវាយតម្លៃ');
    await expect(page.locator('#assessments')).toBeInViewport();

    // Test navigation to progress section
    await page.click('text=វឌ្ឍនភាព');
    await expect(page.locator('#progress')).toBeInViewport();

    console.log('✅ Navigation links working correctly');
  });

  test('should verify stats cards are visible', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Wait for stats section to load
    await page.waitForSelector('#overview');

    // Verify stats cards
    const statsCards = page.locator('#overview .grid > div');
    await expect(statsCards).toHaveCount(4);

    // Verify stats content
    await expect(page.locator('text=សរុបសិស្ស')).toBeVisible();
    await expect(page.locator('text=ការវាយតម្លៃ')).toBeVisible();
    await expect(page.locator('text=មុខវិជ្ជា')).toBeVisible();
    await expect(page.locator('text=កម្រិត')).toBeVisible();

    console.log('✅ Stats cards displayed correctly');
  });

  test('should verify charts section works', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Wait for charts to load
    await page.waitForSelector('#assessments');

    // Verify subject selector buttons
    await expect(page.locator('text=ខ្មែរ')).toBeVisible();
    await expect(page.locator('text=គណិតវិទ្យា')).toBeVisible();

    // Test subject switching
    await page.click('text=គណិតវិទ្យា');
    
    // Wait a moment for chart to update
    await page.waitForTimeout(1000);

    // Switch back to Khmer
    await page.click('text=ខ្មែរ');
    
    await page.waitForTimeout(1000);

    console.log('✅ Chart subject switching works correctly');
  });

  test('should verify progress charts are visible', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Scroll to progress section
    await page.locator('#progress').scrollIntoViewIfNeeded();

    // Verify progress chart titles
    await expect(page.locator('text=វឌ្ឍនភាពតាមរយៈកាល')).toBeVisible();
    await expect(page.locator('text=ការធ្វើតេស្តតាមមុខវិជ្ជា')).toBeVisible();

    console.log('✅ Progress charts section visible');
  });

  test('should verify assessment cycles table', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Scroll to find the table
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify table headers
    await expect(page.locator('text=ប្រភេទ')).toBeVisible();
    await expect(page.locator('text=ដើមគ្រា')).toBeVisible();
    await expect(page.locator('text=ពាក់កណ្តាលគ្រា')).toBeVisible();
    await expect(page.locator('text=ចុងគ្រា')).toBeVisible();

    // Verify table content
    await expect(page.locator('text=សិស្សបានធ្វើតេស្ត')).toBeVisible();

    console.log('✅ Assessment cycles table displayed correctly');
  });

  test('should verify footer content', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Verify footer sections
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('text=TaRL ប្រាថម')).toBeVisible();
    await expect(page.locator('text=តំណភ្ជាប់')).toBeVisible();
    await expect(page.locator('text=ភាគីដៃគូ')).toBeVisible();

    // Verify copyright
    await expect(page.locator('text=© 2024 TaRL ប្រាថម')).toBeVisible();

    console.log('✅ Footer content displayed correctly');
  });

  test('should test login link', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Click on login button
    const loginLink = page.locator('text=ចូលប្រព័ន្ធ');
    await expect(loginLink).toBeVisible();
    
    // Get the href attribute
    const href = await loginLink.getAttribute('href');
    expect(href).toBe('/auth/login');

    console.log('✅ Login link configured correctly');
  });

  test('should test responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('https://tarl.openplp.com/');

    // Verify mobile navigation still works
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=ចូល')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();

    // Verify layout adapts
    await expect(page.locator('#overview')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.reload();

    // Verify full navigation is visible
    await expect(page.locator('text=ទិដ្ឋភាពរួម')).toBeVisible();
    await expect(page.locator('text=ការវាយតម្លៃ')).toBeVisible();

    console.log('✅ Responsive design works across different screen sizes');
  });
});

test.describe('TaRL Performance Tests', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('https://tarl.openplp.com/');
    
    // Wait for main content to load
    await page.waitForSelector('h1');
    
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Homepage loaded in ${loadTime}ms`);
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should verify API endpoints respond', async ({ page }) => {
    await page.goto('https://tarl.openplp.com/');

    // Monitor network requests
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/public/assessment-data') && response.status() === 200
    );

    // Trigger API call by switching subjects
    await page.click('text=គណិតវិទ្យា');

    const response = await responsePromise;
    expect(response.status()).toBe(200);

    console.log('✅ API endpoints responding correctly');
  });
});