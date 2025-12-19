#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Finding files with prisma.user...\n');

const files = execSync('find app/api lib -name "*.ts" -type f', { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let totalFiles = 0;
let totalReplacements = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) return;
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;
    
    // Replace prisma.user with prisma.users (but not prisma.users, prisma.user_schools, etc.)
    const matches = (content.match(/prisma\.user\b/g) || []).length;
    content = content.replace(/prisma\.user\b/g, 'prisma.users');
    
    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ ${filePath} (${matches} changes)`);
      totalFiles++;
      totalReplacements += matches;
    }
  } catch (error) {
    console.error(`❌ ERROR: ${filePath}`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Files modified: ${totalFiles}`);
console.log(`   Total changes: ${totalReplacements}`);
console.log(`\n✅ Done!`);
