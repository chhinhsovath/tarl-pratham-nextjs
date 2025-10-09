const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('🔌 Testing database connection...\n');

    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');

    // Get counts from main tables
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.pilotSchool.count(),
      prisma.student.count(),
      prisma.assessment.count(),
      prisma.mentoringVisit.count(),
    ]);

    console.log('📊 Database Statistics:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Users:            ${counts[0]}`);
    console.log(`Pilot Schools:    ${counts[1]}`);
    console.log(`Students:         ${counts[2]}`);
    console.log(`Assessments:      ${counts[3]}`);
    console.log(`Mentoring Visits: ${counts[4]}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test a sample query
    const sampleSchool = await prisma.pilotSchool.findFirst({
      select: {
        id: true,
        school_name: true,
        province: true,
        district: true,
      }
    });

    if (sampleSchool) {
      console.log('📍 Sample School:');
      console.log(`   ID: ${sampleSchool.id}`);
      console.log(`   Name: ${sampleSchool.school_name}`);
      console.log(`   Province: ${sampleSchool.province}`);
      console.log(`   District: ${sampleSchool.district}\n`);
    }

    console.log('✅ All database operations successful!');
    console.log('🎉 Ready to use old server database!\n');

  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
