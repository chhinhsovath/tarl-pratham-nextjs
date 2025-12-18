/**
 * Migration Script: Convert Legacy Data to Record Status System
 *
 * This script migrates existing data that uses the old boolean flags
 * (is_temporary, added_by_mentor, assessed_by_mentor) to the new
 * record_status enum system.
 *
 * Usage:
 *   npx tsx scripts/migrate-to-record-status.ts [--dry-run] [--verbose]
 *
 * Options:
 *   --dry-run   Preview changes without applying them
 *   --verbose   Show detailed output
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MigrationStats {
  students: {
    total: number;
    production: number;
    test_mentor: number;
    test_teacher: number;
    already_migrated: number;
  };
  assessments: {
    total: number;
    production: number;
    test_mentor: number;
    test_teacher: number;
    already_migrated: number;
  };
  mentoring_visits: {
    total: number;
    production: number;
    test_mentor: number;
    test_teacher: number;
    already_migrated: number;
  };
}

async function migrateStudents(dryRun: boolean, verbose: boolean): Promise<MigrationStats['students']> {
  console.log('\n📚 Migrating Students...');

  const stats = {
    total: 0,
    production: 0,
    test_mentor: 0,
    test_teacher: 0,
    already_migrated: 0
  };

  // Get all students
  const students = await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      is_temporary: true,
      added_by_mentor: true,
      record_status: true,
      added_by_id: true,
      added_by: {
        select: {
          role: true
        }
      }
    }
  });

  stats.total = students.length;

  for (const student of students) {
    // Skip if already has non-production status
    if (student.record_status !== 'production') {
      stats.already_migrated++;
      continue;
    }

    // Determine new status based on legacy flags
    let newStatus: 'production' | 'test_mentor' | 'test_teacher' = 'production';

    if (student.is_temporary && student.added_by_mentor) {
      newStatus = 'test_mentor';
      stats.test_mentor++;
    } else if (student.is_temporary && student.added_by?.role === 'teacher') {
      newStatus = 'test_teacher';
      stats.test_teacher++;
    } else {
      stats.production++;
    }

    if (verbose) {
      console.log(`  Student #${student.id} (${student.name}): ${student.record_status} → ${newStatus}`);
    }

    if (!dryRun && newStatus !== 'production') {
      await prisma.student.update({
        where: { id: student.id },
        data: {
          record_status: newStatus,
          created_by_role: student.added_by?.role || null
        }
      });
    }
  }

  console.log(`  Total: ${stats.total}`);
  console.log(`  Production: ${stats.production}`);
  console.log(`  Test (Mentor): ${stats.test_mentor}`);
  console.log(`  Test (Teacher): ${stats.test_teacher}`);
  console.log(`  Already Migrated: ${stats.already_migrated}`);

  return stats;
}

async function migrateAssessments(dryRun: boolean, verbose: boolean): Promise<MigrationStats['assessments']> {
  console.log('\n📝 Migrating Assessments...');

  const stats = {
    total: 0,
    production: 0,
    test_mentor: 0,
    test_teacher: 0,
    already_migrated: 0
  };

  const assessments = await prisma.assessments.findMany({
    select: {
      id: true,
      is_temporary: true,
      assessed_by_mentor: true,
      record_status: true,
      added_by_id: true,
      added_by: {
        select: {
          role: true
        }
      },
      student: {
        select: {
          name: true
        }
      }
    }
  });

  stats.total = assessments.length;

  for (const assessment of assessments) {
    if (assessment.record_status !== 'production') {
      stats.already_migrated++;
      continue;
    }

    let newStatus: 'production' | 'test_mentor' | 'test_teacher' = 'production';

    if (assessment.is_temporary && assessment.assessed_by_mentor) {
      newStatus = 'test_mentor';
      stats.test_mentor++;
    } else if (assessment.is_temporary && assessment.added_by?.role === 'teacher') {
      newStatus = 'test_teacher';
      stats.test_teacher++;
    } else {
      stats.production++;
    }

    if (verbose) {
      console.log(`  Assessment #${assessment.id} (Student: ${assessment.student?.name}): ${assessment.record_status} → ${newStatus}`);
    }

    if (!dryRun && newStatus !== 'production') {
      await prisma.assessments.update({
        where: { id: assessment.id },
        data: {
          record_status: newStatus,
          created_by_role: assessment.added_by?.role || null
        }
      });
    }
  }

  console.log(`  Total: ${stats.total}`);
  console.log(`  Production: ${stats.production}`);
  console.log(`  Test (Mentor): ${stats.test_mentor}`);
  console.log(`  Test (Teacher): ${stats.test_teacher}`);
  console.log(`  Already Migrated: ${stats.already_migrated}`);

  return stats;
}

async function migrateMentoringVisits(dryRun: boolean, verbose: boolean): Promise<MigrationStats['mentoring_visits']> {
  console.log('\n👨‍🏫 Migrating Mentoring Visits...');

  const stats = {
    total: 0,
    production: 0,
    test_mentor: 0,
    test_teacher: 0,
    already_migrated: 0
  };

  const visits = await prisma.mentoringVisit.findMany({
    select: {
      id: true,
      is_temporary: true,
      record_status: true,
      mentor_id: true,
      mentor: {
        select: {
          role: true,
          name: true
        }
      },
      pilot_school: {
        select: {
          school_name: true
        }
      }
    }
  });

  stats.total = visits.length;

  for (const visit of visits) {
    if (visit.record_status !== 'production') {
      stats.already_migrated++;
      continue;
    }

    let newStatus: 'production' | 'test_mentor' | 'test_teacher' = 'production';

    if (visit.is_temporary && visit.mentor?.role === 'mentor') {
      newStatus = 'test_mentor';
      stats.test_mentor++;
    } else if (visit.is_temporary && visit.mentor?.role === 'teacher') {
      newStatus = 'test_teacher';
      stats.test_teacher++;
    } else {
      stats.production++;
    }

    if (verbose) {
      console.log(`  Visit #${visit.id} (School: ${visit.pilot_school?.school_name}): ${visit.record_status} → ${newStatus}`);
    }

    if (!dryRun && newStatus !== 'production') {
      await prisma.mentoringVisit.update({
        where: { id: visit.id },
        data: {
          record_status: newStatus
        }
      });
    }
  }

  console.log(`  Total: ${stats.total}`);
  console.log(`  Production: ${stats.production}`);
  console.log(`  Test (Mentor): ${stats.test_mentor}`);
  console.log(`  Test (Teacher): ${stats.test_teacher}`);
  console.log(`  Already Migrated: ${stats.already_migrated}`);

  return stats;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');

  console.log('🚀 Record Status Migration Script');
  console.log('==================================\n');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - No changes will be made\n');
  }

  if (verbose) {
    console.log('📢 Verbose mode enabled\n');
  }

  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connected\n');

    // Run migrations
    const studentStats = await migrateStudents(dryRun, verbose);
    const assessmentStats = await migrateAssessments(dryRun, verbose);
    const mentoringVisitStats = await migrateMentoringVisits(dryRun, verbose);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));

    const totalRecords = studentStats.total + assessmentStats.total + mentoringVisitStats.total;
    const totalProduction = studentStats.production + assessmentStats.production + mentoringVisitStats.production;
    const totalTestMentor = studentStats.test_mentor + assessmentStats.test_mentor + mentoringVisitStats.test_mentor;
    const totalTestTeacher = studentStats.test_teacher + assessmentStats.test_teacher + mentoringVisitStats.test_teacher;
    const totalAlreadyMigrated = studentStats.already_migrated + assessmentStats.already_migrated + mentoringVisitStats.already_migrated;

    console.log(`\nTotal Records Processed: ${totalRecords}`);
    console.log(`  - Production: ${totalProduction}`);
    console.log(`  - Test (Mentor): ${totalTestMentor}`);
    console.log(`  - Test (Teacher): ${totalTestTeacher}`);
    console.log(`  - Already Migrated: ${totalAlreadyMigrated}`);

    if (dryRun) {
      console.log('\n⚠️  This was a dry run. Run without --dry-run to apply changes.');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();