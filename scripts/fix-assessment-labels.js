const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Fixing Assessment Labels - TaRL Pratham Project');
console.log('==================================================\n');

// Label mappings
const LABEL_FIXES = [
  // Assessment types - be specific to avoid false positives
  { old: 'មូលដ្ឋាន', new: 'តេស្តដើមគ្រា', context: 'baseline' },
  { old: 'កុលសនភាព', new: 'តេស្តពាក់កណ្ដាលគ្រា', context: 'midline' },
  { old: 'កណ្តាល', new: 'តេស្តពាក់កណ្ដាលគ្រា', context: 'Midline' },
  { old: 'ពាក់កណ្តាល', new: 'តេស្តពាក់កណ្ដាលគ្រា', context: 'midline' },
];

// Specific replacements (exact matches)
const EXACT_REPLACEMENTS = [
  ['មូលដ្ឋាន (Baseline)', 'តេស្តដើមគ្រា (Baseline)'],
  ['កុលសនភាព (Midline)', 'តេស្តពាក់កណ្ដាលគ្រា (Midline)'],
  ['កណ្តាល (Midline)', 'តេស្តពាក់កណ្ដាលគ្រា (Midline)'],
  ['ពាក់កណ្តាល (Midline)', 'តេស្តពាក់កណ្ដាលគ្រា (Midline)'],
  ['បញ្ចប់ (Endline)', 'តេស្តចុងក្រោយគ្រា (Endline)'],

  // In Select Options
  ['value="baseline">មូលដ្ឋាន', 'value="baseline">តេស្តដើមគ្រា'],
  ['value="midline">កុលសនភាព', 'value="midline">តេស្តពាក់កណ្ដាលគ្រា'],
  ['value="midline">ពាក់កណ្តាល', 'value="midline">តេស្តពាក់កណ្ដាលគ្រា'],
  ['value="endline">បញ្ចប់', 'value="endline">តេស្តចុងក្រោយគ្រា'],

  // In Option components
  ['<Option value="baseline">មូលដ្ឋាន', '<Option value="baseline">តេស្តដើមគ្រា'],
  ['<Option value="midline">កុលសនភាព', '<Option value="midline">តេស្តពាក់កណ្ដាលគ្រា'],
  ['<Option value="midline">ពាក់កណ្តាល', '<Option value="midline">តេស្តពាក់កណ្ដាលគ្រា'],
  ['<Option value="endline">បញ្ចប់', '<Option value="endline">តេស្តចុងក្រោយគ្រា'],

  // In label mappings
  ["baseline: 'មូលដ្ឋាន'", "baseline: 'តេស្តដើមគ្រា'"],
  ["midline: 'កុលសនភាព'", "midline: 'តេស្តពាក់កណ្ដាលគ្រា'"],
  ["midline: 'ពាក់កណ្តាល'", "midline: 'តេស្តពាក់កណ្ដាលគ្រា'"],
  ["endline: 'បញ្ចប់'", "endline: 'តេស្តចុងក្រោយគ្រា'"],

  // Type conditional rendering
  ["type === 'baseline' ? 'មូលដ្ឋាន'", "type === 'baseline' ? 'តេស្តដើមគ្រា'"],
  ["type === 'midline' ? 'កុលសនភាព'", "type === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា'"],
  ["type === 'midline' ? 'ពាក់កណ្តាល'", "type === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា'"],
  ["type === 'endline' ? 'បញ្ចប់'", "type === 'endline' ? 'តេស្តចុងក្រោយគ្រា'"],

  // Standalone labels with colon
  ['មូលដ្ឋាន:', 'តេស្តដើមគ្រា:'],
  ['កុលសនភាព:', 'តេស្តពាក់កណ្ដាលគ្រា:'],
  ['បញ្ចប់:', 'តេស្តចុងក្រោយគ្រា:'],
];

// Files/patterns to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  'build',
  '.git',
  'ASSESSMENT_LABELS_FIX_SUMMARY.md',
  'fix-assessment-labels',
];

function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some(pattern => filePath.includes(pattern));
}

function findFiles(dir, ext = ['.tsx', '.ts']) {
  let results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldSkipFile(filePath)) {
        results = results.concat(findFiles(filePath, ext));
      }
    } else if (ext.some(e => file.endsWith(e))) {
      if (!shouldSkipFile(filePath)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Apply exact replacements
  EXACT_REPLACEMENTS.forEach(([old, newText]) => {
    if (content.includes(old)) {
      content = content.split(old).join(newText);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// Main execution
async function main() {
  console.log('Scanning files...\n');

  const dirs = ['app', 'components'];
  let allFiles = [];

  dirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles = allFiles.concat(findFiles(dir));
    }
  });

  console.log(`Found ${allFiles.length} files to check\n`);

  // Create backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = `backups/label-fix-${timestamp}`;

  console.log('Creating backup...');
  execSync(`mkdir -p ${backupDir}`);

  let modifiedCount = 0;
  const modifiedFiles = [];

  console.log('Processing files...\n');

  allFiles.forEach(file => {
    // Check if file needs fixing
    const content = fs.readFileSync(file, 'utf8');
    const needsFix = EXACT_REPLACEMENTS.some(([old]) => content.includes(old));

    if (needsFix) {
      // Backup file
      const relativePath = file;
      const backupPath = path.join(backupDir, relativePath);
      execSync(`mkdir -p "${path.dirname(backupPath)}"`);
      fs.copyFileSync(file, backupPath);

      // Fix file
      if (fixFile(file)) {
        console.log(`  ✓ ${file}`);
        modifiedCount++;
        modifiedFiles.push(file);
      }
    }
  });

  console.log('\n==================================================');
  console.log('✅ Fix Complete!');
  console.log(`   Files modified: ${modifiedCount}`);
  console.log(`   Backup location: ${backupDir}`);
  console.log('\nModified files:');
  modifiedFiles.forEach(f => console.log(`  - ${f}`));
  console.log('\nNext steps:');
  console.log('1. Review changes: git diff');
  console.log('2. Test the application');
  console.log('3. Commit changes if satisfied');
  console.log(`4. If issues occur, restore from: ${backupDir}`);
  console.log('');
}

main().catch(console.error);
