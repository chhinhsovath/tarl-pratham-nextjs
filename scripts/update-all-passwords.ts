/**
 * Script to update all user passwords to "admin123"
 * This is useful for testing and development environments
 *
 * Usage: npx ts-node scripts/update-all-passwords.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updateAllPasswords() {
  try {
    console.log('🔐 Starting password update for all users...');

    const newPassword = 'admin123';
    const saltRounds = 10;

    // Hash the password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        username_login: true,
        name: true,
        role: true,
      }
    });

    console.log(`📊 Found ${users.length} users to update`);

    // Update all users
    const updateResult = await prisma.user.updateMany({
      data: {
        password: hashedPassword
      }
    });

    console.log(`✅ Successfully updated ${updateResult.count} user passwords`);
    console.log('\n📋 Updated users:');

    // Display updated users
    users.forEach((user, index) => {
      const identifier = user.email || user.username || user.username_login || 'N/A';
      console.log(`   ${index + 1}. ${user.role.toUpperCase().padEnd(12)} | ${identifier.padEnd(30)} | ${user.name || 'No name'}`);
    });

    console.log('\n🔑 All users can now login with password: admin123');
    console.log('⚠️  Remember to change passwords in production!');

  } catch (error) {
    console.error('❌ Error updating passwords:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateAllPasswords()
  .then(() => {
    console.log('\n✨ Password update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Password update failed:', error);
    process.exit(1);
  });
