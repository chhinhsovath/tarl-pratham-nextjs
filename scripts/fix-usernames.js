#!/usr/bin/env node

/**
 * Direct Node.js script to fix missing usernames using smart name conversion
 * Run: node scripts/fix-usernames.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Inline Khmer to Latin converter (since we can't import TypeScript modules in Node.js directly)
const KHMER_TO_LATIN_MAP = {
  'ក': 'k', 'ខ': 'kh', 'គ': 'g', 'ឃ': 'kh',
  'ង': 'ng', 'ច': 'c', 'ឆ': 'ch', 'ជ': 'j', 'ឈ': 'ch',
  'ញ': 'ny', 'ដ': 'd', 'ឋ': 'th', 'ឌ': 'd', 'ឍ': 'th',
  'ន': 'n', 'ប': 'p', 'ផ': 'ph', 'ព': 'p', 'ភ': 'ph',
  'ម': 'm', 'យ': 'y', 'រ': 'r', 'ល': 'l', 'វ': 'v',
  'ស': 's', 'ហ': 'h', 'អ': 'a',
  'ា': 'a', 'ិ': 'i', 'ឹ': 'i', 'ឺ': 'ei', 'ុ': 'u', 'ូ': 'u', 'ួ': 'ua',
  'ើ': 'ae', 'ឿ': 'ue', 'ៀ': 'ie'
};

function khmerToLatin(khmerText) {
  if (!khmerText) return '';
  let result = '';
  for (const char of khmerText) {
    result += KHMER_TO_LATIN_MAP[char] || char;
  }
  return result;
}

function normalizeUsername(text) {
  if (!text) return '';
  let normalized = text.toLowerCase().trim();
  normalized = normalized
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s_-]/g, '');
  normalized = normalized.replace(/\s+/g, '_');
  normalized = normalized.replace(/_+/g, '_');
  normalized = normalized.replace(/^_+|_+$/g, '');
  return normalized;
}

function nameToUsername(fullName) {
  if (!fullName || fullName.trim().length === 0) {
    return '';
  }
  const khmerRegex = /[\u1780-\u17FF]/g;
  const hasKhmer = khmerRegex.test(fullName);
  let latinized = fullName;
  if (hasKhmer) {
    latinized = '';
    for (const char of fullName) {
      if (/[\u1780-\u17FF]/.test(char)) {
        latinized += khmerToLatin(char);
      } else {
        latinized += char;
      }
    }
  }
  const username = normalizeUsername(latinized);
  if (username.length === 0) {
    return 'user_' + Date.now().toString().slice(-6);
  }
  if (username.length < 3) {
    return username + '_' + Math.random().toString(36).substring(2, 5);
  }
  return username;
}

async function fixMissingUsernames() {
  console.log('🚀 Starting username fix...\n');

  try {
    // Get all users without usernames
    const usersWithoutUsernames = await prisma.user.findMany({
      where: {
        username: null,
        is_active: true
      },
      select: {
        id: true,
        email: true,
        username: true
      },
      orderBy: { id: 'asc' }
    });

    console.log(`📊 Found ${usersWithoutUsernames.length} active users without usernames\n`);

    if (usersWithoutUsernames.length === 0) {
      console.log('✅ All users already have usernames! No fix needed.\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    const results = {
      fixed: [],
      errors: []
    };

    // Process each user
    for (const user of usersWithoutUsernames) {
      try {
        // Generate username from full name using smart converter
        const baseUsername = nameToUsername(user.name);

        // Check if this username is already taken
        let usernameToUse = baseUsername;
        let counter = 1;

        while (true) {
          const existingUser = await prisma.user.findFirst({
            where: {
              username: usernameToUse,
              id: { not: user.id }
            }
          });

          if (!existingUser) {
            break;
          }

          usernameToUse = `${baseUsername}${counter}`;
          counter++;

          if (counter > 1000) {
            throw new Error(`Could not generate unique username for ${user.name}`);
          }
        }

        // Update the user
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { username: usernameToUse }
        });

        results.fixed.push({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          generatedUsername: updatedUser.username
        });

        console.log(`✅ Fixed: ${user.name} (${user.email}) → username: ${usernameToUse}`);
      } catch (error) {
        console.error(`❌ Error fixing user ${user.name}:`, error.message);
        results.errors.push({
          id: user.id,
          name: user.name,
          email: user.email,
          error: error.message
        });
      }
    }

    console.log(`\n✨ Username fix completed!`);
    console.log(`   Fixed: ${results.fixed.length}`);
    console.log(`   Errors: ${results.errors.length}\n`);

    if (results.fixed.length > 0) {
      console.log('📝 Fixed users:');
      results.fixed.forEach(u => {
        console.log(`   • ${u.name} (${u.email}) → ${u.generatedUsername}`);
      });
    }

    if (results.errors.length > 0) {
      console.log('\n⚠️  Failed users:');
      results.errors.forEach(e => {
        console.log(`   • ${e.name} (${e.email}): ${e.error}`);
      });
    }

    await prisma.$disconnect();
    process.exit(results.errors.length > 0 ? 1 : 0);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

fixMissingUsernames();
