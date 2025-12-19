#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding all TypeScript files with camelCase Prisma models...\n');

// Find all .ts files
const files = execSync('find app/api lib scripts -name "*.ts" -type f', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let totalFiles = 0;
let totalReplacements = 0;

// Map of camelCase to snake_case model names
const modelReplacements = [
  // Model names
  { pattern: /prisma\.dashboardStats\b/g, replacement: 'prisma.dashboard_stats', description: 'dashboardStats → dashboard_stats' },
  { pattern: /prisma\.pilotSchool\b/g, replacement: 'prisma.pilot_schools', description: 'pilotSchool → pilot_schools' },
  { pattern: /prisma\.pilotSchools\b/g, replacement: 'prisma.pilot_schools', description: 'pilotSchools → pilot_schools (already plural)' },
  { pattern: /prisma\.quickLoginUser\b/g, replacement: 'prisma.quick_login_users', description: 'quickLoginUser → quick_login_users' },
  { pattern: /prisma\.mentorSchoolAssignment\b/g, replacement: 'prisma.mentor_school_assignments', description: 'mentorSchoolAssignment → mentor_school_assignments' },
  { pattern: /prisma\.mentoringVisit\b/g, replacement: 'prisma.mentoring_visits', description: 'mentoringVisit → mentoring_visits' },
  { pattern: /prisma\.userSchool\b/g, replacement: 'prisma.user_schools', description: 'userSchool → user_schools' },
  { pattern: /prisma\.userSession\b/g, replacement: 'prisma.user_sessions', description: 'userSession → user_sessions' },
  { pattern: /prisma\.testSession\b/g, replacement: 'prisma.test_sessions', description: 'testSession → test_sessions' },
  { pattern: /prisma\.auditLog\b/g, replacement: 'prisma.audit_logs', description: 'auditLog → audit_logs' },
  { pattern: /prisma\.bulkImport\b/g, replacement: 'prisma.bulk_imports', description: 'bulkImport → bulk_imports' },
  { pattern: /prisma\.schoolClass\b/g, replacement: 'prisma.school_classes', description: 'schoolClass → school_classes' },
  { pattern: /prisma\.progressTracking\b/g, replacement: 'prisma.progress_trackings', description: 'progressTracking → progress_trackings' },
  { pattern: /prisma\.ipWhitelist\b/g, replacement: 'prisma.ip_whitelist', description: 'ipWhitelist → ip_whitelist' },
  { pattern: /prisma\.rateLimit\b/g, replacement: 'prisma.rate_limits', description: 'rateLimit → rate_limits' },
];

console.log('📝 Processing files...\n');

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;

    modelReplacements.forEach(({ pattern, replacement, description }) => {
      const matches = (content.match(pattern) || []).length;
      if (matches > 0) {
        content = content.replace(pattern, replacement);
        fileReplacements += matches;
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} (${fileReplacements} changes)`);
      totalFiles++;
      totalReplacements += fileReplacements;
    }
  } catch (error) {
    console.error(`❌ ERROR: ${filePath}`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files modified: ${totalFiles}`);
console.log(`   Total changes: ${totalReplacements}`);
console.log(`\n✅ Done!`);
