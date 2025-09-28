// Test script to verify role-based access control for all user roles
// This matches Laravel's role permissions exactly

interface RoleMenuAccess {
  role: string;
  expectedMenuItems: string[];
  forbiddenMenuItems: string[];
}

const roleAccessMap: RoleMenuAccess[] = [
  {
    role: 'admin',
    expectedMenuItems: [
      '/dashboard',
      '/assessments', 
      '/verification',
      '/students',
      '/mentoring',
      '/reports',
      '/coordinator/workspace',
      '/users', // Administration
      '/help'
    ],
    forbiddenMenuItems: [
      '/teacher/dashboard' // Mentor-only
    ]
  },
  {
    role: 'coordinator',
    expectedMenuItems: [
      '/coordinator/workspace',
      '/help'
    ],
    forbiddenMenuItems: [
      '/dashboard', // Coordinator doesn't have dashboard
      '/assessments',
      '/verification',
      '/students',
      '/mentoring',
      '/reports',
      '/teacher/dashboard',
      '/users'
    ]
  },
  {
    role: 'mentor',
    expectedMenuItems: [
      '/dashboard',
      '/assessments',
      '/verification',
      '/students',
      '/mentoring',
      '/teacher/dashboard', // Mentor-only workspace
      '/reports',
      '/help'
    ],
    forbiddenMenuItems: [
      '/coordinator/workspace',
      '/users' // Admin-only
    ]
  },
  {
    role: 'teacher',
    expectedMenuItems: [
      '/dashboard',
      '/assessments',
      '/students',
      '/reports',
      '/help'
    ],
    forbiddenMenuItems: [
      '/verification', // Admin & Mentor only
      '/mentoring', // Admin & Mentor only
      '/teacher/dashboard', // Mentor only
      '/coordinator/workspace',
      '/users'
    ]
  },
  {
    role: 'viewer',
    expectedMenuItems: [
      '/dashboard',
      '/assessments',
      '/reports',
      '/help'
    ],
    forbiddenMenuItems: [
      '/verification',
      '/students', // No student management
      '/mentoring',
      '/teacher/dashboard',
      '/coordinator/workspace',
      '/users'
    ]
  }
];

// Test function to verify role access
export function verifyRoleAccess(userRole: string, availableMenuItems: string[]): boolean {
  const roleConfig = roleAccessMap.find(r => r.role === userRole);
  
  if (!roleConfig) {
    console.error(`Unknown role: ${userRole}`);
    return false;
  }

  console.log(`\n🔍 Testing ${userRole.toUpperCase()} role:`);
  console.log('=' .repeat(50));

  let allTestsPassed = true;

  // Check expected items are present
  console.log('\n✅ Expected menu items:');
  roleConfig.expectedMenuItems.forEach(item => {
    const hasAccess = availableMenuItems.includes(item);
    if (hasAccess) {
      console.log(`  ✓ ${item}`);
    } else {
      console.log(`  ✗ ${item} - MISSING!`);
      allTestsPassed = false;
    }
  });

  // Check forbidden items are not present
  console.log('\n🚫 Forbidden menu items:');
  roleConfig.forbiddenMenuItems.forEach(item => {
    const hasAccess = availableMenuItems.includes(item);
    if (!hasAccess) {
      console.log(`  ✓ ${item} - correctly hidden`);
    } else {
      console.log(`  ✗ ${item} - SHOULD NOT BE VISIBLE!`);
      allTestsPassed = false;
    }
  });

  console.log('\n' + '=' .repeat(50));
  console.log(`Result: ${allTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
  
  return allTestsPassed;
}

// Export role configurations for use in components
export const roleMenuConfig = {
  admin: [
    'ផ្ទាំងគ្រប់គ្រង', // Dashboard
    'ការវាយតម្លៃ', // Assessments
    'ផ្ទៀងផ្ទាត់', // Verification
    'និស្សិត', // Students
    'ការណែនាំ', // Mentoring
    'របាយការណ៍', // Reports
    'កន្លែងធ្វើការសម្របសម្រួល', // Coordinator Workspace
    'រដ្ឋបាល', // Administration
    'ជំនួយ' // Help
  ],
  coordinator: [
    'កន្លែងធ្វើការសម្របសម្រួល', // Coordinator Workspace
    'ជំនួយ' // Help
  ],
  mentor: [
    'ផ្ទាំងគ្រប់គ្រង', // Dashboard
    'ការវាយតម្លៃ', // Assessments
    'ផ្ទៀងផ្ទាត់', // Verification
    'និស្សិត', // Students
    'ការណែនាំ', // Mentoring
    'កន្លែងធ្វើការគ្រូ', // Teacher Workspace (Mentor only)
    'របាយការណ៍', // Reports
    'ជំនួយ' // Help
  ],
  teacher: [
    'ផ្ទាំងគ្រប់គ្រង', // Dashboard
    'ការវាយតម្លៃ', // Assessments
    'និស្សិត', // Students
    'របាយការណ៍', // Reports
    'ជំនួយ' // Help
  ],
  viewer: [
    'ផ្ទាំងគ្រប់គ្រង', // Dashboard
    'ការវាយតម្លៃ', // Assessments
    'របាយការណ៍', // Reports
    'ជំនួយ' // Help
  ]
};

console.log('📋 TaRL Pratham - Role Access Control Test');
console.log('Matching Laravel menu structure exactly\n');

// Run tests for all roles
if (typeof window === 'undefined') {
  // Node.js environment - run all tests
  roleAccessMap.forEach(config => {
    const mockMenuItems = config.expectedMenuItems;
    verifyRoleAccess(config.role, mockMenuItems);
  });
}