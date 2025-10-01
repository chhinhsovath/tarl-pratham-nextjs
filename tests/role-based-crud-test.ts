/**
 * Comprehensive Role-Based CRUD Testing Script
 * Tests all CRUD operations for: Admin, Coordinator, Mentor, Teacher, Viewer
 * Resources tested: Users, Students, Assessments, Mentoring Visits
 */

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

interface TestResult {
  role: string;
  resource: string;
  operation: string;
  expected: 'ALLOW' | 'DENY';
  actual: 'ALLOW' | 'DENY' | 'ERROR';
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  error?: string;
  details?: string;
}

const testResults: TestResult[] = [];

// Role permission matrix (based on analysis)
const permissionMatrix = {
  users: {
    admin: { view: true, create: true, update: true, delete: true },
    coordinator: { view: true, create: true, update: true, delete: false },
    mentor: { view: true, create: false, update: false, delete: false }, // Only own data
    teacher: { view: true, create: false, update: false, delete: false }, // Only own data
    viewer: { view: true, create: false, update: false, delete: false },
  },
  students: {
    admin: { view: true, create: true, update: true, delete: true },
    coordinator: { view: true, create: true, update: true, delete: true },
    mentor: { view: true, create: true, update: true, delete: false },
    teacher: { view: true, create: true, update: true, delete: false },
    viewer: { view: true, create: false, update: false, delete: false },
  },
  assessments: {
    admin: { view: true, create: true, update: true, delete: true },
    coordinator: { view: true, create: true, update: true, delete: true },
    mentor: { view: true, create: true, update: true, delete: false },
    teacher: { view: true, create: true, update: true, delete: false },
    viewer: { view: true, create: false, update: false, delete: false },
  },
  mentoring_visits: {
    admin: { view: true, create: true, update: true, delete: true },
    coordinator: { view: true, create: true, update: true, delete: true },
    mentor: { view: true, create: true, update: true, delete: false },
    teacher: { view: true, create: false, update: false, delete: false },
    viewer: { view: true, create: false, update: false, delete: false },
  },
};

// Test user credentials (to be created)
const testUsers = {
  admin: { email: 'test_admin@tarl.test', password: 'Password123!', role: 'admin' },
  coordinator: { email: 'test_coordinator@tarl.test', password: 'Password123!', role: 'coordinator' },
  mentor: { email: 'test_mentor@tarl.test', password: 'Password123!', role: 'mentor' },
  teacher: { email: 'test_teacher@tarl.test', password: 'Password123!', role: 'teacher' },
  viewer: { email: 'test_viewer@tarl.test', password: 'Password123!', role: 'viewer' },
};

// Helper function to make authenticated API request
async function makeAuthenticatedRequest(
  method: string,
  endpoint: string,
  userRole: string,
  body?: any
): Promise<{ statusCode: number; data: any; error?: string }> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3003';

    // First, login to get session
    const loginResponse = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUsers[userRole as keyof typeof testUsers].email,
        password: testUsers[userRole as keyof typeof testUsers].password,
      }),
    });

    if (!loginResponse.ok) {
      return {
        statusCode: loginResponse.status,
        data: null,
        error: 'Authentication failed',
      };
    }

    const cookies = loginResponse.headers.get('set-cookie');

    // Make the actual API request
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies || '',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      data,
      error: data.error,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      data: null,
      error: error.message,
    };
  }
}

// Helper function to log results
function logResult(result: TestResult) {
  const statusColor = result.status === 'PASS' ? colors.green : colors.red;
  const expectedColor = result.expected === 'ALLOW' ? colors.cyan : colors.yellow;

  console.log(
    `${statusColor}[${result.status}]${colors.reset} ` +
    `${colors.blue}${result.role.toUpperCase()}${colors.reset} ` +
    `${colors.magenta}${result.operation.toUpperCase()}${colors.reset} ` +
    `${colors.white}${result.resource}${colors.reset} ` +
    `| Expected: ${expectedColor}${result.expected}${colors.reset} ` +
    `| Actual: ${result.actual} ` +
    `${result.statusCode ? `| Status: ${result.statusCode}` : ''}`
  );

  if (result.error) {
    console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
  }
  if (result.details) {
    console.log(`  ${colors.yellow}Details: ${result.details}${colors.reset}`);
  }
}

// Setup test data
async function setupTestData() {
  console.log(`\n${colors.cyan}Setting up test data...${colors.reset}\n`);

  // Create pilot school for testing
  const pilotSchool = await prisma.pilotSchool.upsert({
    where: { school_code: 'TEST_SCHOOL_001' },
    update: {},
    create: {
      province: 'កំពង់ចាម',
      district: 'កំពង់សៀម',
      cluster_id: 1,
      cluster: 'Cluster A',
      school_name: 'សាលាសាកល្បង CRUD',
      school_code: 'TEST_SCHOOL_001',
    },
  });

  // Create test users for each role
  for (const [role, credentials] of Object.entries(testUsers)) {
    const hashedPassword = await bcrypt.hash(credentials.password, 12);

    await prisma.user.upsert({
      where: { email: credentials.email },
      update: {
        password: hashedPassword,
        role: credentials.role,
        pilot_school_id: pilotSchool.id,
      },
      create: {
        name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: credentials.email,
        password: hashedPassword,
        role: credentials.role,
        pilot_school_id: pilotSchool.id,
        province: 'កំពង់ចាម',
        is_active: true,
      },
    });
  }

  console.log(`${colors.green}✓ Test users created${colors.reset}`);
  console.log(`${colors.green}✓ Test pilot school created${colors.reset}`);

  return { pilotSchool };
}

// Test CRUD operations for Users resource
async function testUsersCRUD(role: string) {
  const resource = 'users';
  const permissions = permissionMatrix[resource][role as keyof typeof permissionMatrix.users];

  // Test VIEW (GET)
  const viewResult = await makeAuthenticatedRequest('GET', '/api/users?limit=5', role);
  testResults.push({
    role,
    resource,
    operation: 'view',
    expected: permissions.view ? 'ALLOW' : 'DENY',
    actual: viewResult.statusCode === 200 ? 'ALLOW' : viewResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.view && viewResult.statusCode === 200) ||
      (!permissions.view && viewResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: viewResult.statusCode,
    error: viewResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Test CREATE (POST)
  const createResult = await makeAuthenticatedRequest('POST', '/api/users', role, {
    name: `Test User by ${role}`,
    email: `test_created_by_${role}_${Date.now()}@tarl.test`,
    password: 'TestPassword123!',
    role: 'teacher',
    province: 'កំពង់ចាម',
  });
  testResults.push({
    role,
    resource,
    operation: 'create',
    expected: permissions.create ? 'ALLOW' : 'DENY',
    actual: createResult.statusCode === 201 ? 'ALLOW' : createResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.create && createResult.statusCode === 201) ||
      (!permissions.create && createResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: createResult.statusCode,
    error: createResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Test UPDATE (PUT) - try to update own profile
  const updateResult = await makeAuthenticatedRequest('PUT', '/api/users', role, {
    id: 1, // Assuming own user ID
    phone: '+855123456789',
  });
  testResults.push({
    role,
    resource,
    operation: 'update',
    expected: permissions.update ? 'ALLOW' : 'DENY',
    actual: updateResult.statusCode === 200 ? 'ALLOW' : updateResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.update && updateResult.statusCode === 200) ||
      (!permissions.update && updateResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: updateResult.statusCode,
    error: updateResult.error,
    details: 'Testing self-update',
  });
  logResult(testResults[testResults.length - 1]);

  // Test DELETE
  const deleteResult = await makeAuthenticatedRequest('DELETE', '/api/users?id=999', role);
  testResults.push({
    role,
    resource,
    operation: 'delete',
    expected: permissions.delete ? 'ALLOW' : 'DENY',
    actual: deleteResult.statusCode === 200 || deleteResult.statusCode === 404 ? 'ALLOW' : deleteResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.delete && (deleteResult.statusCode === 200 || deleteResult.statusCode === 404)) ||
      (!permissions.delete && deleteResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: deleteResult.statusCode,
    error: deleteResult.error,
    details: 'Testing delete non-existent user',
  });
  logResult(testResults[testResults.length - 1]);
}

// Test CRUD operations for Students resource
async function testStudentsCRUD(role: string, pilotSchoolId: number) {
  const resource = 'students';
  const permissions = permissionMatrix[resource][role as keyof typeof permissionMatrix.students];

  // Test VIEW (GET)
  const viewResult = await makeAuthenticatedRequest('GET', '/api/students?limit=5', role);
  testResults.push({
    role,
    resource,
    operation: 'view',
    expected: permissions.view ? 'ALLOW' : 'DENY',
    actual: viewResult.statusCode === 200 ? 'ALLOW' : viewResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.view && viewResult.statusCode === 200) ||
      (!permissions.view && viewResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: viewResult.statusCode,
    error: viewResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Test CREATE (POST)
  const createResult = await makeAuthenticatedRequest('POST', '/api/students', role, {
    name: `សិស្ស Test by ${role}`,
    pilot_school_id: pilotSchoolId,
    age: 10,
    gender: 'male',
  });
  testResults.push({
    role,
    resource,
    operation: 'create',
    expected: permissions.create ? 'ALLOW' : 'DENY',
    actual: createResult.statusCode === 201 ? 'ALLOW' : createResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.create && createResult.statusCode === 201) ||
      (!permissions.create && createResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: createResult.statusCode,
    error: createResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  let createdStudentId = createResult.data?.data?.id;

  // Test UPDATE (PUT)
  if (createdStudentId) {
    const updateResult = await makeAuthenticatedRequest('PUT', '/api/students', role, {
      id: createdStudentId,
      age: 11,
    });
    testResults.push({
      role,
      resource,
      operation: 'update',
      expected: permissions.update ? 'ALLOW' : 'DENY',
      actual: updateResult.statusCode === 200 ? 'ALLOW' : updateResult.statusCode === 403 ? 'DENY' : 'ERROR',
      status:
        (permissions.update && updateResult.statusCode === 200) ||
        (!permissions.update && updateResult.statusCode === 403)
          ? 'PASS'
          : 'FAIL',
      statusCode: updateResult.statusCode,
      error: updateResult.error,
    });
    logResult(testResults[testResults.length - 1]);
  }

  // Test DELETE
  const deleteResult = await makeAuthenticatedRequest(
    'DELETE',
    `/api/students?id=${createdStudentId || 999}`,
    role
  );
  testResults.push({
    role,
    resource,
    operation: 'delete',
    expected: permissions.delete ? 'ALLOW' : 'DENY',
    actual: deleteResult.statusCode === 200 ? 'ALLOW' : deleteResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.delete && deleteResult.statusCode === 200) ||
      (!permissions.delete && deleteResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: deleteResult.statusCode,
    error: deleteResult.error,
  });
  logResult(testResults[testResults.length - 1]);
}

// Test CRUD operations for Assessments resource
async function testAssessmentsCRUD(role: string, pilotSchoolId: number) {
  const resource = 'assessments';
  const permissions = permissionMatrix[resource][role as keyof typeof permissionMatrix.assessments];

  // Create a test student first
  const student = await prisma.student.create({
    data: {
      name: `សិស្សសម្រាប់ Assessment ${role}`,
      pilot_school_id: pilotSchoolId,
      age: 10,
      gender: 'male',
      record_status: 'test_mentor',
    },
  });

  // Test VIEW (GET)
  const viewResult = await makeAuthenticatedRequest('GET', '/api/assessments?limit=5', role);
  testResults.push({
    role,
    resource,
    operation: 'view',
    expected: permissions.view ? 'ALLOW' : 'DENY',
    actual: viewResult.statusCode === 200 ? 'ALLOW' : viewResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.view && viewResult.statusCode === 200) ||
      (!permissions.view && viewResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: viewResult.statusCode,
    error: viewResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Test CREATE (POST)
  const createResult = await makeAuthenticatedRequest('POST', '/api/assessments', role, {
    student_id: student.id,
    pilot_school_id: pilotSchoolId,
    assessment_type: 'ដើមគ្រា',
    subject: 'khmer',
    level: 'beginner',
    score: 80,
  });
  testResults.push({
    role,
    resource,
    operation: 'create',
    expected: permissions.create ? 'ALLOW' : 'DENY',
    actual: createResult.statusCode === 201 ? 'ALLOW' : createResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.create && createResult.statusCode === 201) ||
      (!permissions.create && createResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: createResult.statusCode,
    error: createResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  const createdAssessmentId = createResult.data?.data?.id;

  // Test UPDATE (PUT)
  if (createdAssessmentId) {
    const updateResult = await makeAuthenticatedRequest('PUT', `/api/assessments/${createdAssessmentId}`, role, {
      score: 85,
    });
    testResults.push({
      role,
      resource,
      operation: 'update',
      expected: permissions.update ? 'ALLOW' : 'DENY',
      actual: updateResult.statusCode === 200 ? 'ALLOW' : updateResult.statusCode === 403 ? 'DENY' : 'ERROR',
      status:
        (permissions.update && updateResult.statusCode === 200) ||
        (!permissions.update && updateResult.statusCode === 403)
          ? 'PASS'
          : 'FAIL',
      statusCode: updateResult.statusCode,
      error: updateResult.error,
    });
    logResult(testResults[testResults.length - 1]);
  }

  // Test DELETE
  const deleteResult = await makeAuthenticatedRequest(
    'DELETE',
    `/api/assessments/${createdAssessmentId || 999}`,
    role
  );
  testResults.push({
    role,
    resource,
    operation: 'delete',
    expected: permissions.delete ? 'ALLOW' : 'DENY',
    actual: deleteResult.statusCode === 200 ? 'ALLOW' : deleteResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.delete && deleteResult.statusCode === 200) ||
      (!permissions.delete && deleteResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: deleteResult.statusCode,
    error: deleteResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Cleanup test student
  await prisma.student.delete({ where: { id: student.id } });
}

// Test CRUD operations for Mentoring Visits resource
async function testMentoringVisitsCRUD(role: string, pilotSchoolId: number, mentorUserId: number) {
  const resource = 'mentoring_visits';
  const permissions = permissionMatrix[resource][role as keyof typeof permissionMatrix.mentoring_visits];

  // Test VIEW (GET)
  const viewResult = await makeAuthenticatedRequest('GET', '/api/mentoring-visits?limit=5', role);
  testResults.push({
    role,
    resource,
    operation: 'view',
    expected: permissions.view ? 'ALLOW' : 'DENY',
    actual: viewResult.statusCode === 200 ? 'ALLOW' : viewResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.view && viewResult.statusCode === 200) ||
      (!permissions.view && viewResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: viewResult.statusCode,
    error: viewResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  // Test CREATE (POST)
  const createResult = await makeAuthenticatedRequest('POST', '/api/mentoring-visits', role, {
    mentor_id: mentorUserId,
    pilot_school_id: pilotSchoolId,
    visit_date: new Date().toISOString(),
    purpose: `Test visit by ${role}`,
    status: 'scheduled',
  });
  testResults.push({
    role,
    resource,
    operation: 'create',
    expected: permissions.create ? 'ALLOW' : 'DENY',
    actual: createResult.statusCode === 201 ? 'ALLOW' : createResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.create && createResult.statusCode === 201) ||
      (!permissions.create && createResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: createResult.statusCode,
    error: createResult.error,
  });
  logResult(testResults[testResults.length - 1]);

  const createdVisitId = createResult.data?.data?.id;

  // Test UPDATE (PUT)
  if (createdVisitId) {
    const updateResult = await makeAuthenticatedRequest('PUT', `/api/mentoring-visits/${createdVisitId}`, role, {
      status: 'completed',
    });
    testResults.push({
      role,
      resource,
      operation: 'update',
      expected: permissions.update ? 'ALLOW' : 'DENY',
      actual: updateResult.statusCode === 200 ? 'ALLOW' : updateResult.statusCode === 403 ? 'DENY' : 'ERROR',
      status:
        (permissions.update && updateResult.statusCode === 200) ||
        (!permissions.update && updateResult.statusCode === 403)
          ? 'PASS'
          : 'FAIL',
      statusCode: updateResult.statusCode,
      error: updateResult.error,
    });
    logResult(testResults[testResults.length - 1]);
  }

  // Test DELETE
  const deleteResult = await makeAuthenticatedRequest(
    'DELETE',
    `/api/mentoring-visits/${createdVisitId || 999}`,
    role
  );
  testResults.push({
    role,
    resource,
    operation: 'delete',
    expected: permissions.delete ? 'ALLOW' : 'DENY',
    actual: deleteResult.statusCode === 200 ? 'ALLOW' : deleteResult.statusCode === 403 ? 'DENY' : 'ERROR',
    status:
      (permissions.delete && deleteResult.statusCode === 200) ||
      (!permissions.delete && deleteResult.statusCode === 403)
        ? 'PASS'
        : 'FAIL',
    statusCode: deleteResult.statusCode,
    error: deleteResult.error,
  });
  logResult(testResults[testResults.length - 1]);
}

// Generate comprehensive report
function generateReport() {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${colors.cyan}COMPREHENSIVE ROLE-BASED CRUD TEST REPORT${colors.reset}`);
  console.log(`${'='.repeat(80)}\n`);

  const totalTests = testResults.length;
  const passedTests = testResults.filter((r) => r.status === 'PASS').length;
  const failedTests = totalTests - passedTests;
  const passRate = ((passedTests / totalTests) * 100).toFixed(2);

  console.log(`${colors.white}Total Tests: ${totalTests}${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`${colors.cyan}Pass Rate: ${passRate}%${colors.reset}\n`);

  // Group results by role
  const roles = ['admin', 'coordinator', 'mentor', 'teacher', 'viewer'];

  roles.forEach((role) => {
    const roleResults = testResults.filter((r) => r.role === role);
    const rolePassed = roleResults.filter((r) => r.status === 'PASS').length;
    const roleTotal = roleResults.length;
    const rolePassRate = ((rolePassed / roleTotal) * 100).toFixed(2);

    console.log(`\n${colors.blue}${role.toUpperCase()} Role:${colors.reset}`);
    console.log(`  Tests: ${roleTotal} | Passed: ${rolePassed} | Pass Rate: ${rolePassRate}%`);

    // Show failed tests for this role
    const roleFailed = roleResults.filter((r) => r.status === 'FAIL');
    if (roleFailed.length > 0) {
      console.log(`  ${colors.red}Failed Tests:${colors.reset}`);
      roleFailed.forEach((r) => {
        console.log(
          `    - ${r.operation.toUpperCase()} ${r.resource} | ` +
          `Expected: ${r.expected}, Got: ${r.actual} | ` +
          `Status Code: ${r.statusCode}`
        );
        if (r.error) {
          console.log(`      Error: ${r.error}`);
        }
      });
    }
  });

  // Summary by resource
  console.log(`\n${colors.magenta}SUMMARY BY RESOURCE:${colors.reset}`);
  const resources = ['users', 'students', 'assessments', 'mentoring_visits'];

  resources.forEach((resource) => {
    const resourceResults = testResults.filter((r) => r.resource === resource);
    const resourcePassed = resourceResults.filter((r) => r.status === 'PASS').length;
    const resourceTotal = resourceResults.length;
    const resourcePassRate = ((resourcePassed / resourceTotal) * 100).toFixed(2);

    console.log(`\n  ${colors.white}${resource.toUpperCase()}:${colors.reset}`);
    console.log(`    Tests: ${resourceTotal} | Passed: ${resourcePassed} | Pass Rate: ${resourcePassRate}%`);

    // Operation breakdown
    const operations = ['view', 'create', 'update', 'delete'];
    operations.forEach((op) => {
      const opResults = resourceResults.filter((r) => r.operation === op);
      const opPassed = opResults.filter((r) => r.status === 'PASS').length;
      console.log(`      ${op.toUpperCase()}: ${opPassed}/${opResults.length} passed`);
    });
  });

  console.log(`\n${'='.repeat(80)}\n`);

  // Export results to JSON
  const reportData = {
    summary: {
      total_tests: totalTests,
      passed: passedTests,
      failed: failedTests,
      pass_rate: passRate,
    },
    results: testResults,
    permission_matrix: permissionMatrix,
    timestamp: new Date().toISOString(),
  };

  return reportData;
}

// Cleanup test data
async function cleanupTestData() {
  console.log(`\n${colors.yellow}Cleaning up test data...${colors.reset}`);

  // Delete test users
  for (const credentials of Object.values(testUsers)) {
    await prisma.user.deleteMany({
      where: { email: credentials.email },
    });
  }

  // Delete test pilot school
  await prisma.pilotSchool.deleteMany({
    where: { school_code: 'TEST_SCHOOL_001' },
  });

  console.log(`${colors.green}✓ Cleanup completed${colors.reset}\n`);
}

// Main execution
async function main() {
  try {
    console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
    console.log(`${colors.cyan}TARL PRATHAM - COMPREHENSIVE ROLE-BASED CRUD TESTING${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

    // Setup
    const { pilotSchool } = await setupTestData();

    // Get mentor user ID for mentoring visits tests
    const mentorUser = await prisma.user.findFirst({
      where: { email: testUsers.mentor.email },
    });

    if (!mentorUser) {
      throw new Error('Mentor user not found');
    }

    // Run tests for each role
    const roles = ['admin', 'coordinator', 'mentor', 'teacher', 'viewer'];

    for (const role of roles) {
      console.log(`\n${colors.cyan}${'='.repeat(80)}${colors.reset}`);
      console.log(`${colors.cyan}Testing Role: ${role.toUpperCase()}${colors.reset}`);
      console.log(`${colors.cyan}${'='.repeat(80)}${colors.reset}\n`);

      console.log(`${colors.yellow}[USERS RESOURCE]${colors.reset}`);
      await testUsersCRUD(role);

      console.log(`\n${colors.yellow}[STUDENTS RESOURCE]${colors.reset}`);
      await testStudentsCRUD(role, pilotSchool.id);

      console.log(`\n${colors.yellow}[ASSESSMENTS RESOURCE]${colors.reset}`);
      await testAssessmentsCRUD(role, pilotSchool.id);

      console.log(`\n${colors.yellow}[MENTORING VISITS RESOURCE]${colors.reset}`);
      await testMentoringVisitsCRUD(role, pilotSchool.id, mentorUser.id);
    }

    // Generate and display report
    const reportData = generateReport();

    // Save report to file
    const fs = require('fs');
    const reportPath = './test-reports/role-based-crud-test-report.json';
    fs.mkdirSync('./test-reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`${colors.green}Report saved to: ${reportPath}${colors.reset}\n`);

    // Cleanup
    await cleanupTestData();

    process.exit(failedTests > 0 ? 1 : 0);
  } catch (error: any) {
    console.error(`\n${colors.red}Test execution failed:${colors.reset}`, error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { main, generateReport, testResults };
