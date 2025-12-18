#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of files to fix (from grep results)
const filesToFix = [
  'app/api/reports/generate-comparison-md/route.ts',
  'app/api/assessments/verify/comparison/route.ts',
  'app/api/public/verification-stats/route.ts',
  'app/api/assessments/verify/route.ts',
  'app/api/assessments/verification/route.ts',
  'app/api/assessments/verification/stats/route.ts',
  'app/api/assessments/route.ts',
  'app/api/dashboard/mentor/route.ts',
  'app/api/students/route.ts',
  'app/api/coordinator/stats/route.ts',
  'app/api/assessments/[id]/route.ts',
  'app/api/assessments/bulk/route.ts',
  'app/api/assessments/manage/route.ts',
  'app/api/reports/route.ts',
  'app/api/reports/dashboard/route.ts',
  'app/api/reports/school-overview/export/route.ts',
  'app/api/reports/school-overview/route.ts',
  'app/api/assessment-management/bulk-unlock-assessments/route.ts',
  'app/api/assessment-management/assessments/route.ts',
  'app/api/assessment-management/bulk-lock-assessments/route.ts',
  'app/api/stats/summary/route.ts',
  'app/api/export/comprehensive/route.ts',
  'app/api/administration/stats/route.ts',
  'app/api/users/[id]/toggle-test-mode/route.ts',
  'app/api/public/assessment-data/route.ts',
  'app/api/public/results-by-school/route.ts',
  'app/api/test-sessions/[id]/expire/route.ts',
  'app/api/students/[id]/soft-delete/route.ts',
  'app/api/students/[id]/route.ts',
  'app/api/students/[id]/assessment-history/route.ts',
  'app/api/dashboard/stats/route.ts',
  'app/api/dashboard/admin-stats/route.ts',
  'app/api/dashboard/assessment-data/route.ts',
  'app/api/dashboard/mentor-stats/route.ts',
  'app/api/dashboard/results-by-school/route.ts',
  'app/api/dashboard/smart-stats/route.ts',
  'app/api/dashboard/viewer-stats/route.ts',
  'app/api/mentor/reset-test-data/route.ts',
  'app/api/mentor/test-session/route.ts',
  'app/api/admin/refresh-stats/route.ts',
  'app/api/admin/test-data/summary/route.ts',
  'app/api/test-data/promote-to-production/route.ts',
  'app/api/verify-db/route.ts',
  'app/api/coordinator/monitoring/route.ts',
  'app/api/coordinator/activities/route.ts',
  'app/api/bulk/archive-test-data/route.ts',
  'app/api/bulk/delete-test-data/route.ts',
  'app/api/assessments/[id]/soft-delete/route.ts',
  'app/api/assessments/[id]/lock/route.ts',
  'app/api/assessments/[id]/[operation]/route.ts',
  'app/api/assessments/[id]/verify/route.ts',
  'app/api/assessments/save-student/route.ts',
  'app/api/assessments/bulk-verify/route.ts',
  'app/api/rbac/dashboard/route.ts',
  'lib/db/query-optimizer.ts',
  'lib/stats-cache.ts',
  'lib/utils/mentor-cleanup.ts',
  'lib/services/TeacherRepository.ts',
  'lib/mentorAuthorization.ts',
  'scripts/migrate-to-record-status.ts',
  'lib/cleanup.ts'
];

let totalFixed = 0;
let totalFiles = 0;

console.log('Starting Prisma model name fixes...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  SKIP: ${filePath} (file not found)`);
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;

    // Replace all instances of prisma.assessment with prisma.assessments
    // Use word boundary to avoid replacing prisma.assessment_histories, etc.
    content = content.replace(/prisma\.assessment\b/g, 'prisma.assessments');

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      const matches = (originalContent.match(/prisma\.assessment\b/g) || []).length;
      console.log(`✅ FIXED: ${filePath} (${matches} replacements)`);
      totalFixed += matches;
      totalFiles++;
    } else {
      console.log(`ℹ️  NO CHANGE: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ ERROR: ${filePath}`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files processed: ${filesToFix.length}`);
console.log(`   Files modified: ${totalFiles}`);
console.log(`   Total replacements: ${totalFixed}`);
console.log(`\n✅ Done! Run 'npm run build' to verify no TypeScript errors.`);
