import { test, expect } from '@playwright/test';

/**
 * Permission Tests for Teacher and Coordinator Roles
 *
 * These tests verify the new permission system:
 * - Teachers can delete students/assessments if not verified/locked
 * - Teachers cannot delete students/assessments if verified or locked
 * - Coordinators can lock/unlock assessments and mentoring visits
 */

// Test credentials (update these with actual test accounts)
const TEACHER_EMAIL = 'teacher@example.com';
const COORDINATOR_EMAIL = 'coordinator@prathaminternational.org';
const MENTOR_EMAIL = 'mentor@example.com';
const PASSWORD = 'password'; // Update with actual password

test.describe('Teacher Delete Permissions', () => {
  test.beforeEach(async ({ page }) => {
    // Login as teacher
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', TEACHER_EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('teacher should be able to delete student with no assessments', async ({ page }) => {
    // This test assumes a student with ID exists that has no assessments
    // In a real test, you'd create the student first
    test.skip(); // Skip until test data setup is automated

    await page.goto('/students');

    // Find delete button and click
    await page.click('[data-row-id="test-student"] [data-action="delete"]');

    // Confirm deletion
    await page.click('button:has-text("បាទ/ចាស")'); // Khmer "Yes"

    // Verify success message
    await expect(page.locator('.ant-message-success')).toBeVisible();
  });

  test('teacher should NOT be able to delete student with verified assessment', async ({ page }) => {
    test.skip(); // Skip until test data setup is automated

    await page.goto('/students');

    // Try to delete student with verified assessment
    await page.click('[data-row-id="verified-student"] [data-action="delete"]');
    await page.click('button:has-text("បាទ/ចាស")');

    // Verify error message in Khmer
    await expect(page.locator('.ant-message-error')).toContainText('មិនអាចលុបសិស្សបានទេ');
    await expect(page.locator('.ant-message-error')).toContainText('ផ្ទៀងផ្ទាត់');
  });
});

test.describe('Coordinator Lock Permissions', () => {
  test.beforeEach(async ({ page }) => {
    // Login as coordinator
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', COORDINATOR_EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('coordinator should be able to lock assessment', async ({ page }) => {
    test.skip(); // Skip until test data setup is automated

    await page.goto('/assessments');

    // Click on an assessment to view details
    await page.click('table tbody tr:first-child');

    // Click lock button
    await page.click('[data-action="lock"]');

    // Verify success
    await expect(page.locator('.ant-message-success')).toBeVisible();

    // Verify lock icon appears
    await expect(page.locator('[data-icon="lock"]')).toBeVisible();
  });

  test('coordinator should be able to bulk lock assessments', async ({ page }) => {
    test.skip(); // Skip until test data setup is automated

    await page.goto('/assessments');

    // Select multiple checkboxes
    await page.check('table tbody tr:nth-child(1) input[type="checkbox"]');
    await page.check('table tbody tr:nth-child(2) input[type="checkbox"]');
    await page.check('table tbody tr:nth-child(3) input[type="checkbox"]');

    // Click bulk lock button
    await page.click('button:has-text("Bulk Lock")');

    // Verify success message
    await expect(page.locator('.ant-message-success')).toContainText('locked successfully');
  });
});

test.describe('Permission Denials', () => {
  test('mentor should NOT be able to lock assessment', async ({ page }) => {
    test.skip(); // Skip until test data setup is automated

    // Login as mentor
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', MENTOR_EMAIL);
    await page.fill('input[type="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await page.goto('/assessments');

    // Lock button should not be visible for mentors
    await expect(page.locator('[data-action="lock"]')).not.toBeVisible();
  });
});

/**
 * API-Level Permission Tests
 *
 * These tests directly call the API endpoints to verify permissions
 */
test.describe('API Permission Tests', () => {
  test('DELETE /api/students/[id] - teacher can delete unverified', async ({ request }) => {
    test.skip(); // Skip until test data is set up

    // Login as teacher
    const loginResponse = await request.post('/api/auth/callback/credentials', {
      data: {
        email: TEACHER_EMAIL,
        password: PASSWORD
      }
    });

    const cookies = loginResponse.headers()['set-cookie'];

    // Try to delete student
    const deleteResponse = await request.delete('/api/students/999', {
      headers: {
        'Cookie': cookies || ''
      }
    });

    expect(deleteResponse.status()).toBe(200);
    const body = await deleteResponse.json();
    expect(body.success).toBe(true);
  });

  test('POST /api/assessments/[id]/lock - coordinator can lock', async ({ request }) => {
    test.skip(); // Skip until test data is set up

    // Login as coordinator
    const loginResponse = await request.post('/api/auth/callback/credentials', {
      data: {
        email: COORDINATOR_EMAIL,
        password: PASSWORD
      }
    });

    const cookies = loginResponse.headers()['set-cookie'];

    // Lock assessment
    const lockResponse = await request.post('/api/assessments/1/lock', {
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json'
      },
      data: {
        lock: true,
        locked_by: 2 // Coordinator user ID
      }
    });

    expect(lockResponse.status()).toBe(200);
    const body = await lockResponse.json();
    expect(body.success).toBe(true);
  });

  test('POST /api/assessments/[id]/lock - mentor CANNOT lock', async ({ request }) => {
    test.skip(); // Skip until test data is set up

    // Login as mentor
    const loginResponse = await request.post('/api/auth/callback/credentials', {
      data: {
        email: MENTOR_EMAIL,
        password: PASSWORD
      }
    });

    const cookies = loginResponse.headers()['set-cookie'];

    // Try to lock assessment
    const lockResponse = await request.post('/api/assessments/1/lock', {
      headers: {
        'Cookie': cookies || '',
        'Content-Type': 'application/json'
      },
      data: {
        lock: true
      }
    });

    expect(lockResponse.status()).toBe(403);
    const body = await lockResponse.json();
    expect(body.error).toContain('Admin or Coordinator only');
  });
});
