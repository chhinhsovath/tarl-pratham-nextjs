/**
 * Analyze which assessment TYPES are missing across the system
 * Show pattern: How many students have just baseline, baseline+midline, etc.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function analyzeAssessmentPatterns() {
  try {
    console.log('🔍 ANALYZING ASSESSMENT TYPE PATTERNS ACROSS SYSTEM\n');

    // Get all students with assessments
    const allStudents = await prisma.students.findMany({
      where: {
        assessments: { some: {} }, // Has at least one assessment
      },
      select: {
        id: true,
        name: true,
        assessments: {
          select: {
            assessment_type: true,
          }
        }
      }
    });

    console.log(`Total students with assessments: ${allStudents.length}\n`);

    // Categorize by assessment pattern
    const patterns = {
      'Baseline Only': 0,
      'Midline Only': 0,
      'Endline Only': 0,
      'Baseline + Midline': 0,
      'Baseline + Endline': 0,
      'Midline + Endline': 0,
      'All Three': 0,
      'Other': 0,
    };

    const patternDetails = {
      'Baseline Only': [],
      'Midline Only': [],
      'Endline Only': [],
      'Baseline + Midline': [],
      'Baseline + Endline': [],
      'Midline + Endline': [],
      'All Three': [],
      'Other': [],
    };

    allStudents.forEach(student => {
      const types = new Set(student.assessments.map(a => a.assessment_type));
      const has = {
        baseline: types.has('baseline'),
        midline: types.has('midline'),
        endline: types.has('endline'),
      };

      let pattern = 'Other';

      if (has.baseline && has.midline && has.endline) {
        pattern = 'All Three';
      } else if (has.baseline && has.midline) {
        pattern = 'Baseline + Midline';
      } else if (has.baseline && has.endline) {
        pattern = 'Baseline + Endline';
      } else if (has.midline && has.endline) {
        pattern = 'Midline + Endline';
      } else if (has.baseline && !has.midline && !has.endline) {
        pattern = 'Baseline Only';
      } else if (has.midline && !has.baseline && !has.endline) {
        pattern = 'Midline Only';
      } else if (has.endline && !has.baseline && !has.midline) {
        pattern = 'Endline Only';
      }

      patterns[pattern]++;
      patternDetails[pattern].push({
        name: student.name,
        hasBaseline: has.baseline,
        hasMidline: has.midline,
        hasEndline: has.endline,
      });
    });

    // Display results
    console.log('📊 ASSESSMENT TYPE DISTRIBUTION\n');
    console.log('Pattern'.padEnd(25) + 'Count'.padEnd(10) + 'Percentage\n');
    console.log('-'.repeat(50));

    Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .forEach(([pattern, count]) => {
        const percent = ((count / allStudents.length) * 100).toFixed(1);
        console.log(pattern.padEnd(25) + count.toString().padEnd(10) + `${percent}%`);
      });

    console.log('\n' + '='.repeat(50) + '\n');

    // Critical issue: students with Midline but NO Baseline
    console.log('🔴 CRITICAL ISSUE: Students with MIDLINE but NO BASELINE\n');

    const midlineNoBaseline = patternDetails['Midline Only'];

    console.log(`Total students with this pattern: ${midlineNoBaseline.length}\n`);

    if (midlineNoBaseline.length > 0) {
      console.log('Students (showing first 20):\n');
      midlineNoBaseline.slice(0, 20).forEach((s, idx) => {
        console.log(`${idx + 1}. ${s.name}`);
      });

      if (midlineNoBaseline.length > 20) {
        console.log(`... and ${midlineNoBaseline.length - 20} more\n`);
      }
    } else {
      console.log('✅ No students found with this pattern\n');
    }

    // Check baseline+endline without midline
    console.log('\n⚠️ UNUSUAL PATTERN: Students with BASELINE + ENDLINE but NO MIDLINE\n');
    const baselineEndlineNoMidline = patternDetails['Baseline + Endline'];
    console.log(`Total students with this pattern: ${baselineEndlineNoMidline.length}\n`);

    if (baselineEndlineNoMidline.length > 0) {
      baselineEndlineNoMidline.slice(0, 10).forEach((s, idx) => {
        console.log(`${idx + 1}. ${s.name}`);
      });
    }

    // Analyze by school
    console.log('\n\n' + '='.repeat(50));
    console.log('ASSESSMENT PATTERNS BY SCHOOL\n');

    const schoolStats = {};

    for (const [pattern, details] of Object.entries(patternDetails)) {
      for (const student of details) {
        // Get student's school
        const studentData = await prisma.students.findUnique({
          where: { id: allStudents.find(s => s.name === student.name)?.id },
          select: {
            pilot_school_id: true,
            pilot_schools: { select: { school_name: true } }
          }
        });

        if (!schoolStats[studentData.pilot_school_id]) {
          schoolStats[studentData.pilot_school_id] = {
            schoolName: studentData.pilot_schools?.school_name || 'Unknown',
            midlineNoBaseline: 0,
            allThree: 0,
            baselineOnly: 0,
            baselineMidline: 0,
            total: 0,
          };
        }

        schoolStats[studentData.pilot_school_id].total++;
        if (pattern === 'Midline Only') schoolStats[studentData.pilot_school_id].midlineNoBaseline++;
        if (pattern === 'All Three') schoolStats[studentData.pilot_school_id].allThree++;
        if (pattern === 'Baseline Only') schoolStats[studentData.pilot_school_id].baselineOnly++;
        if (pattern === 'Baseline + Midline') schoolStats[studentData.pilot_school_id].baselineMidline++;
      }
    }

    const schoolArray = Object.entries(schoolStats)
      .map(([id, data]) => ({
        id,
        ...data,
        midlinePercent: ((data.midlineNoBaseline / data.total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.midlineNoBaseline - a.midlineNoBaseline);

    console.log('Schools with Students having Midline but NO Baseline:\n');
    schoolArray.filter(s => s.midlineNoBaseline > 0).slice(0, 10).forEach(s => {
      console.log(`${s.schoolName}`);
      console.log(`  - Midline but no Baseline: ${s.midlineNoBaseline} students (${s.midlinePercent}%)`);
      console.log(`  - All Three: ${s.allThree}`);
      console.log(`  - Baseline + Midline: ${s.baselineMidline}`);
      console.log();
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeAssessmentPatterns();
