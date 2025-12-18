#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding all TypeScript files with Prisma queries...\n');

// Find all .ts files in app/api and lib directories
const files = execSync('find app/api lib -name "*.ts" -type f', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let totalFiles = 0;
let totalReplacements = 0;

const replacements = [
  // Fix include/select relation field names
  { pattern: /(\s+)(student)(\s*:\s*\{)/g, replacement: '$1students$3', description: 'include/select: student → students' },
  { pattern: /(\s+)(pilot_school)(\s*:\s*\{)/g, replacement: '$1pilot_schools$3', description: 'include/select: pilot_school → pilot_schools' },
  { pattern: /(\s+)(added_by)(\s*:\s*\{)/g, replacement: '$1users_assessments_added_by_idTousers$3', description: 'include/select: added_by → users_...' },
  { pattern: /(\s+)(verified_by)(\s*:\s*\{)/g, replacement: '$1users_assessments_verified_by_idTousers$3', description: 'include/select: verified_by → users_...' },

  // Fix data access patterns (but keep optional chaining)
  { pattern: /\.student\?\./g, replacement: '.students?.', description: 'access: .student?. → .students?.' },
  { pattern: /\.pilot_school\?\./g, replacement: '.pilot_schools?.', description: 'access: .pilot_school?. → .pilot_schools?.' },
  { pattern: /\.added_by\?\./g, replacement: '.users_assessments_added_by_idTousers?.', description: 'access: .added_by?. → .users_...' },
  { pattern: /\.verified_by\?\./g, replacement: '.users_assessments_verified_by_idTousers?.', description: 'access: .verified_by?. → .users_...' },

  // Fix non-optional access patterns (careful - only if not already part of longer name)
  { pattern: /([^_])\.student\./g, replacement: '$1.students.', description: 'access: .student. → .students.' },
  { pattern: /([^_])\.pilot_school\./g, replacement: '$1.pilot_schools.', description: 'access: .pilot_school. → .pilot_schools.' },
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

    replacements.forEach(({ pattern, replacement, description }) => {
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
