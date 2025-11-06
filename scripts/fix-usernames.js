#!/usr/bin/env node

/**
 * Direct Node.js script to fix missing usernames
 * Run: node scripts/fix-usernames.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

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
        // Extract username from email
        const emailPrefix = user.email.split('@')[0];

        // Check if this username is already taken
        let baseUsername = emailPrefix;
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
            throw new Error(`Could not generate unique username for ${user.email}`);
          }
        }

        // Update the user
        const updatedUser = await prisma.user.update({
          where: { id: user.id },
          data: { username: usernameToUse }
        });

        results.fixed.push({
          id: updatedUser.id,
          email: updatedUser.email,
          generatedUsername: updatedUser.username
        });

        console.log(`✅ Fixed: ${user.email} → username: ${usernameToUse}`);
      } catch (error) {
        console.error(`❌ Error fixing user ${user.email}:`, error.message);
        results.errors.push({
          id: user.id,
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
        console.log(`   • ${u.email} → ${u.generatedUsername}`);
      });
    }

    if (results.errors.length > 0) {
      console.log('\n⚠️  Failed users:');
      results.errors.forEach(e => {
        console.log(`   • ${e.email}: ${e.error}`);
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
