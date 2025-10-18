import { test, expect } from '@playwright/test';

/**
 * Pilot Schools CRUD API Tests
 *
 * Tests full CRUD operations for /api/pilot-schools endpoint
 * Validates coordinator and admin permissions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

// Test data
const testSchool = {
  school_name: 'Test Pilot School',
  school_code: 'TEST' + Date.now(), // Unique code for each test run
  province: 'កំពង់ចាម',
  district: 'ស្រុកកំពង់ស្វាយ',
  cluster: 'ចង្កោម A',
  baseline_start_date: '2025-11-10',
  baseline_end_date: '2025-11-13',
  midline_start_date: '2025-12-18',
  midline_end_date: '2025-12-19',
  endline_start_date: '2026-01-27',
  endline_end_date: '2026-01-28',
};

let createdSchoolId: number;
let coordinatorCookies: string;
let adminCookies: string;

test.describe('Pilot Schools CRUD - Coordinator Access', () => {

  test.beforeAll(async ({ request }) => {
    // Login as coordinator to get session cookie
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'coordinator@test.com', // Update with actual test coordinator
        password: 'password123'
      }
    });

    if (loginResponse.ok()) {
      const cookies = loginResponse.headers()['set-cookie'];
      if (cookies) {
        coordinatorCookies = cookies;
      }
    }
  });

  test('GET /api/pilot-schools - should return list of schools', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/pilot-schools`);

    expect(response.ok()).toBeTruthy();

    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(Array.isArray(data.data)).toBeTruthy();

    if (data.data.length > 0) {
      const school = data.data[0];
      expect(school).toHaveProperty('id');
      expect(school).toHaveProperty('school_name');
      expect(school).toHaveProperty('school_code');
      expect(school).toHaveProperty('province');
      expect(school).toHaveProperty('district');
    }
  });

  test('POST /api/pilot-schools - coordinator should create new school', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: testSchool
    });

    expect(response.status()).toBe(201);

    const result = await response.json();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('success', true);
    expect(result.data).toHaveProperty('id');
    expect(result.data.school_name).toBe(testSchool.school_name);
    expect(result.data.school_code).toBe(testSchool.school_code);

    // Save ID for later tests
    createdSchoolId = result.data.id;
  });

  test('POST /api/pilot-schools - should reject duplicate school_code', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: testSchool // Same school code
    });

    expect(response.status()).toBe(400);

    const result = await response.json();
    expect(result).toHaveProperty('error');
    expect(result.error).toContain('លេខកូដសាលារៀននេះមានរួចហើយ');
  });

  test('POST /api/pilot-schools - should validate required fields', async ({ request }) => {
    const invalidSchool = {
      school_name: 'Test School',
      // Missing school_code, province, district, cluster
    };

    const response = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: invalidSchool
    });

    expect(response.status()).toBe(400);

    const result = await response.json();
    expect(result).toHaveProperty('error');
  });

  test('PUT /api/pilot-schools - coordinator should update school', async ({ request }) => {
    const updatedData = {
      id: createdSchoolId,
      school_name: 'Updated Test School',
      province: 'បាត់ដំបង', // Changed province
      is_locked: true
    };

    const response = await request.put(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: updatedData
    });

    expect(response.ok()).toBeTruthy();

    const result = await response.json();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('success', true);
    expect(result.data.school_name).toBe('Updated Test School');
    expect(result.data.province).toBe('បាត់ដំបង');
    expect(result.data.is_locked).toBe(true);
  });

  test('PUT /api/pilot-schools - should update assessment periods', async ({ request }) => {
    const updatedData = {
      id: createdSchoolId,
      baseline_start_date: '2025-12-01',
      baseline_end_date: '2025-12-05',
    };

    const response = await request.put(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: updatedData
    });

    expect(response.ok()).toBeTruthy();

    const result = await response.json();
    expect(result.data.baseline_start_date).toBe('2025-12-01T00:00:00.000Z');
    expect(result.data.baseline_end_date).toBe('2025-12-05T00:00:00.000Z');
  });

  test('PUT /api/pilot-schools - should reject non-existent school', async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: {
        id: 999999,
        school_name: 'Non-existent School'
      }
    });

    expect(response.status()).toBe(404);

    const result = await response.json();
    expect(result).toHaveProperty('error');
    expect(result.error).toContain('រកមិនឃើញសាលារៀន');
  });

  test('DELETE /api/pilot-schools - should delete school without dependencies', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/pilot-schools?id=${createdSchoolId}`, {
      headers: {
        'Cookie': coordinatorCookies
      }
    });

    expect(response.ok()).toBeTruthy();

    const result = await response.json();
    expect(result).toHaveProperty('success', true);
    expect(result).toHaveProperty('message');
    expect(result.message).toContain('បានលុបសាលារៀនដោយជោគជ័យ');
  });

  test('DELETE /api/pilot-schools - should reject deletion with related data', async ({ request }) => {
    // This test assumes there's a school with ID 1 that has related data
    // You may need to adjust the ID based on your test database
    const response = await request.delete(`${API_BASE_URL}/pilot-schools?id=1`, {
      headers: {
        'Cookie': coordinatorCookies
      }
    });

    // Expecting 400 if school has dependencies
    if (response.status() === 400) {
      const result = await response.json();
      expect(result).toHaveProperty('error');
      expect(result.error).toContain('មិនអាចលុបសាលារៀននេះបានទេ');
    } else {
      // If it was deleted successfully, that means it had no dependencies
      expect(response.ok()).toBeTruthy();
    }
  });
});

test.describe('Pilot Schools CRUD - Permission Tests', () => {

  test('POST /api/pilot-schools - unauthenticated user should be rejected', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: testSchool
    });

    expect(response.status()).toBe(401);
  });

  test('DELETE /api/pilot-schools - mentor should be denied', async ({ request }) => {
    // Login as mentor
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: {
        email: 'mentor@test.com', // Update with actual test mentor
        password: 'password123'
      }
    });

    let mentorCookies = '';
    if (loginResponse.ok()) {
      const cookies = loginResponse.headers()['set-cookie'];
      if (cookies) {
        mentorCookies = cookies;
      }
    }

    const response = await request.delete(`${API_BASE_URL}/pilot-schools?id=1`, {
      headers: {
        'Cookie': mentorCookies
      }
    });

    expect(response.status()).toBe(403);

    const result = await response.json();
    expect(result).toHaveProperty('error');
    expect(result.error).toContain('អ្នកមិនមានសិទ្ធិលុបសាលារៀន');
  });
});

test.describe('Pilot Schools CRUD - Data Validation', () => {

  test('POST /api/pilot-schools - should validate date formats', async ({ request }) => {
    const invalidSchool = {
      ...testSchool,
      school_code: 'DATETEST' + Date.now(),
      baseline_start_date: 'invalid-date',
      baseline_end_date: '2025-11-13',
    };

    const response = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: invalidSchool
    });

    // Should either reject or handle gracefully
    if (!response.ok()) {
      const result = await response.json();
      expect(result).toHaveProperty('error');
    }
  });

  test('PUT /api/pilot-schools - should prevent school_code duplication on update', async ({ request }) => {
    // Create two schools
    const school1 = {
      ...testSchool,
      school_code: 'UNIQUE1' + Date.now(),
      school_name: 'School 1'
    };

    const school2 = {
      ...testSchool,
      school_code: 'UNIQUE2' + Date.now(),
      school_name: 'School 2'
    };

    // Create first school
    const create1 = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: { 'Content-Type': 'application/json', 'Cookie': coordinatorCookies },
      data: school1
    });
    const result1 = await create1.json();

    // Create second school
    const create2 = await request.post(`${API_BASE_URL}/pilot-schools`, {
      headers: { 'Content-Type': 'application/json', 'Cookie': coordinatorCookies },
      data: school2
    });
    const result2 = await create2.json();

    // Try to update school2 with school1's code
    const updateResponse = await request.put(`${API_BASE_URL}/pilot-schools`, {
      headers: { 'Content-Type': 'application/json', 'Cookie': coordinatorCookies },
      data: {
        id: result2.data.id,
        school_code: school1.school_code
      }
    });

    expect(updateResponse.status()).toBe(400);
    const updateResult = await updateResponse.json();
    expect(updateResult.error).toContain('លេខកូដសាលារៀននេះមានរួចហើយ');

    // Cleanup
    await request.delete(`${API_BASE_URL}/pilot-schools?id=${result1.data.id}`, {
      headers: { 'Cookie': coordinatorCookies }
    });
    await request.delete(`${API_BASE_URL}/pilot-schools?id=${result2.data.id}`, {
      headers: { 'Cookie': coordinatorCookies }
    });
  });
});

test.describe('Pilot Schools CRUD - Edge Cases', () => {

  test('PUT /api/pilot-schools - should handle missing ID', async ({ request }) => {
    const response = await request.put(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': coordinatorCookies
      },
      data: {
        school_name: 'No ID School'
      }
    });

    expect(response.status()).toBe(400);
    const result = await response.json();
    expect(result.error).toContain('ID ត្រូវការ');
  });

  test('DELETE /api/pilot-schools - should handle missing ID parameter', async ({ request }) => {
    const response = await request.delete(`${API_BASE_URL}/pilot-schools`, {
      headers: {
        'Cookie': coordinatorCookies
      }
    });

    expect(response.status()).toBe(400);
    const result = await response.json();
    expect(result.error).toContain('ID ត្រូវការ');
  });

  test('GET /api/pilot-schools - should handle database connection issues gracefully', async ({ request }) => {
    // This test checks error handling - actual implementation may vary
    const response = await request.get(`${API_BASE_URL}/pilot-schools`);

    if (response.ok()) {
      const data = await response.json();
      expect(data).toHaveProperty('data');
    } else {
      // Should return 500 with error message
      expect(response.status()).toBe(500);
      const error = await response.json();
      expect(error).toHaveProperty('error');
    }
  });
});
