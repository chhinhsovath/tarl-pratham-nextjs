import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to check permissions
function hasPermission(userRole: string): boolean {
  const allowedRoles = ["admin", "coordinator", "mentor", "teacher", "viewer"];
  return allowedRoles.includes(userRole);
}

// GET /api/reports - Get various report data based on type parameter
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិមើលរបាយការណ៍" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("type") || "overview";
    const pilot_school_id = searchParams.get("pilot_school_id");
    const province_id = searchParams.get("province_id");
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");

    // Build base filters for role-based access
    const baseFilters = getBaseFilters(session);

    switch (reportType) {
      case "overview":
        return getOverviewReport(baseFilters, { pilot_school_id, province_id });
      
      case "assessment-progress":
        return getAssessmentProgressReport(baseFilters, { pilot_school_id, province_id, date_from, date_to });
      
      case "student-performance":
        return getStudentPerformanceReport(baseFilters, { pilot_school_id, province_id, date_from, date_to });
      
      case "mentor-activity":
        return getMentorActivityReport(baseFilters, { pilot_school_id, date_from, date_to });
      
      case "school-statistics":
        return getSchoolStatisticsReport(baseFilters, { pilot_school_id, province_id });
      
      case "export-data":
        return getExportDataReport(baseFilters, { pilot_school_id, province_id, date_from, date_to });
      
      default:
        return NextResponse.json({ error: "ប្រភេទរបាយការណ៍មិនត្រឹមត្រូវ" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("Error generating report:", error);
    
    // Check if it's a Prisma/database error
    if (error.code === 'P2002' || error.code === 'P2025' || error.message?.includes('Invalid')) {
      return NextResponse.json({
        data: null,
        message: 'មិនមានទិន្នន័យរបាយការណ៍នៅក្នុងប្រព័ន្ធ',
        error_detail: 'បញ្ហាទាក់ទងនឹងមូលដ្ឋានទិន្នន័យ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ'
      }, { status: 500 });
    }
    
    return NextResponse.json(
      { 
        error: 'មានបញ្ហាក្នុងការបង្កើតរបាយការណ៍ សូមព្យាយាមម្តងទៀត',
        data: null,
        message: 'កំពុងប្រើទិន្នន័យសាកល្បង',
        mock: true
      },
      { status: 500 }
    );
  }
}

// Helper function to get base filters based on user role
function getBaseFilters(session: any) {
  const filters: any = {};
  
  if (session.user.role === "mentor" || session.user.role === "teacher") {
    if (session.user.pilot_school_id) {
      filters.pilot_school_id = session.user.pilot_school_id;
    }
  }
  
  return filters;
}

// Overview Report - General statistics
async function getOverviewReport(baseFilters: any, params: any) {
  const whereStudent: any = { is_active: true, ...baseFilters };
  const whereAssessment: any = { ...baseFilters };
  const whereMentoring: any = { ...baseFilters };
  
  if (params.pilot_school_id) {
    whereStudent.pilot_school_id = parseInt(params.pilot_school_id);
    whereAssessment.pilot_school_id = parseInt(params.pilot_school_id);
    whereMentoring.pilot_school_id = parseInt(params.pilot_school_id);
  }

  const [
    totalStudents,
    totalAssessments,
    totalMentoringVisits,
    studentsByGender,
    assessmentsByType,
    recentAssessments
  ] = await Promise.all([
    prisma.student.count({ where: whereStudent }),
    prisma.assessment.count({ where: whereAssessment }),
    prisma.mentoringVisit.count({ where: whereMentoring }),
    prisma.student.groupBy({
      by: ['gender'],
      where: whereStudent,
      _count: { gender: true }
    }),
    prisma.assessment.groupBy({
      by: ['assessment_type', 'subject'],
      where: whereAssessment,
      _count: { assessment_type: true }
    }),
    prisma.assessment.findMany({
      where: whereAssessment,
      include: {
        student: { select: { name: true } },
        pilot_school: { select: { school_name: true } }
      },
      orderBy: { assessed_date: 'desc' },
      take: 10
    })
  ]);

  return NextResponse.json({
    data: {
      overview: {
        total_students: totalStudents,
        total_assessments: totalAssessments,
        total_mentoring_visits: totalMentoringVisits
      },
      demographics: {
        students_by_gender: studentsByGender
      },
      assessments: {
        by_type: assessmentsByType,
        recent: recentAssessments
      }
    }
  });
}

// Assessment Progress Report
async function getAssessmentProgressReport(baseFilters: any, params: any) {
  const whereAssessment: any = { ...baseFilters };
  const whereStudent: any = { is_active: true, ...baseFilters };
  
  if (params.pilot_school_id) {
    whereAssessment.pilot_school_id = parseInt(params.pilot_school_id);
    whereStudent.pilot_school_id = parseInt(params.pilot_school_id);
  }
  
  if (params.date_from) {
    whereAssessment.assessed_date = { gte: new Date(params.date_from) };
  }
  
  if (params.date_to) {
    whereAssessment.assessed_date = {
      ...whereAssessment.assessed_date,
      lte: new Date(params.date_to)
    };
  }

  const [
    progressByLevel,
    assessmentCompletion,
    improvementTrends
  ] = await Promise.all([
    prisma.assessment.groupBy({
      by: ['subject', 'level'],
      where: whereAssessment,
      _count: { level: true },
      _avg: { score: true }
    }),
    prisma.student.findMany({
      where: whereStudent,
      select: {
        id: true,
        name: true,
        baseline_khmer_level: true,
        baseline_math_level: true,
        midline_khmer_level: true,
        midline_math_level: true,
        endline_khmer_level: true,
        endline_math_level: true,
        assessments: {
          select: {
            assessment_type: true,
            subject: true,
            level: true,
            score: true,
            assessed_date: true
          }
        }
      }
    }),
    prisma.assessment.findMany({
      where: whereAssessment,
      select: {
        student_id: true,
        assessment_type: true,
        subject: true,
        level: true,
        score: true,
        assessed_date: true
      },
      orderBy: { assessed_date: 'asc' }
    })
  ]);

  return NextResponse.json({
    data: {
      progress_by_level: progressByLevel,
      assessment_completion: assessmentCompletion,
      improvement_trends: improvementTrends
    }
  });
}

// Student Performance Report
async function getStudentPerformanceReport(baseFilters: any, params: any) {
  const whereStudent: any = { is_active: true, ...baseFilters };
  
  if (params.pilot_school_id) {
    whereStudent.pilot_school_id = parseInt(params.pilot_school_id);
  }

  const studentsWithPerformance = await prisma.student.findMany({
    where: whereStudent,
    include: {
      pilot_school: { select: { school_name: true, school_code: true } },
      school_class: {
        include: {
          school: { select: { name: true, code: true } }
        }
      },
      assessments: {
        select: {
          assessment_type: true,
          subject: true,
          level: true,
          score: true,
          assessed_date: true
        },
        orderBy: { assessed_date: 'desc' }
      }
    }
  });

  // Calculate performance metrics
  const performanceData = studentsWithPerformance.map(student => {
    const khmerAssessments = student.assessments.filter(a => a.subject === 'khmer');
    const mathAssessments = student.assessments.filter(a => a.subject === 'math');
    
    return {
      student_id: student.id,
      student_name: student.name,
      age: student.age,
      gender: student.gender,
      school: student.school_class?.school?.name || student.pilot_school?.school_name,
      khmer_progress: calculateProgress(khmerAssessments),
      math_progress: calculateProgress(mathAssessments),
      latest_khmer_level: khmerAssessments[0]?.level || null,
      latest_math_level: mathAssessments[0]?.level || null,
      assessment_count: student.assessments.length
    };
  });

  return NextResponse.json({
    data: {
      student_performance: performanceData,
      summary: {
        total_students: performanceData.length,
        avg_assessments_per_student: performanceData.reduce((sum, s) => sum + s.assessment_count, 0) / performanceData.length,
        students_with_progress: performanceData.filter(s => s.khmer_progress.trend === 'improving' || s.math_progress.trend === 'improving').length
      }
    }
  });
}

// Helper function to calculate progress
function calculateProgress(assessments: any[]) {
  if (assessments.length < 2) {
    return { trend: 'insufficient_data', improvement: 0 };
  }

  const levelOrder = ['beginner', 'letter', 'word', 'paragraph', 'story'];
  const latest = assessments[0];
  const previous = assessments[assessments.length - 1];
  
  const latestIndex = levelOrder.indexOf(latest.level);
  const previousIndex = levelOrder.indexOf(previous.level);
  
  const improvement = latestIndex - previousIndex;
  
  return {
    trend: improvement > 0 ? 'improving' : improvement < 0 ? 'declining' : 'stable',
    improvement: improvement,
    score_change: (latest.score || 0) - (previous.score || 0)
  };
}

// Mentor Activity Report
async function getMentorActivityReport(baseFilters: any, params: any) {
  const whereMentoring: any = { ...baseFilters };
  
  if (params.pilot_school_id) {
    whereMentoring.pilot_school_id = parseInt(params.pilot_school_id);
  }
  
  if (params.date_from) {
    whereMentoring.visit_date = { gte: new Date(params.date_from) };
  }
  
  if (params.date_to) {
    whereMentoring.visit_date = {
      ...whereMentoring.visit_date,
      lte: new Date(params.date_to)
    };
  }

  const [
    mentorVisits,
    mentorStats,
    temporaryStudents
  ] = await Promise.all([
    prisma.mentoringVisit.findMany({
      where: whereMentoring,
      include: {
        mentor: { select: { name: true, email: true } },
        pilot_school: { select: { school_name: true, school_code: true } }
      },
      orderBy: { visit_date: 'desc' }
    }),
    prisma.mentoringVisit.groupBy({
      by: ['mentor_id', 'status'],
      where: whereMentoring,
      _count: { mentor_id: true },
      _avg: { duration_minutes: true, participants_count: true }
    }),
    prisma.student.findMany({
      where: {
        is_temporary: true,
        added_by_mentor: true,
        ...baseFilters
      },
      include: {
        added_by: { select: { name: true } },
        pilot_school: { select: { school_name: true } }
      }
    })
  ]);

  return NextResponse.json({
    data: {
      mentor_visits: mentorVisits,
      mentor_statistics: mentorStats,
      temporary_students: temporaryStudents,
      summary: {
        total_visits: mentorVisits.length,
        avg_duration: mentorStats.reduce((sum, stat) => sum + (stat._avg.duration_minutes || 0), 0) / mentorStats.length,
        total_temporary_students: temporaryStudents.length
      }
    }
  });
}

// School Statistics Report
async function getSchoolStatisticsReport(baseFilters: any, params: any) {
  const whereSchool: any = { is_active: true };
  const whereStudent: any = { is_active: true, ...baseFilters };
  
  if (params.province_id) {
    whereSchool.province_id = parseInt(params.province_id);
  }
  
  if (params.pilot_school_id) {
    whereStudent.pilot_school_id = parseInt(params.pilot_school_id);
  }

  const [
    schoolStats,
    pilotSchoolStats
  ] = await Promise.all([
    prisma.school.findMany({
      where: whereSchool,
      include: {
        province: { select: { name_english: true } },
        classes: {
          include: {
            students: {
              where: { is_active: true },
              select: { id: true }
            }
          }
        }
      }
    }),
    prisma.pilotSchool.findMany({
      where: {},
      include: {
        students: {
          where: { is_active: true },
          select: { id: true }
        },
        users: {
          where: { role: 'mentor' },
          select: { id: true, name: true }
        },
        mentoring_visits: {
          select: { id: true, status: true }
        }
      }
    })
  ]);

  const schoolData = schoolStats.map(school => ({
    school_id: school.id,
    school_name: school.name,
    school_code: school.code,
    province: school.province.name_english,
    total_classes: school.classes.length,
    total_students: school.classes.reduce((sum, cls) => sum + cls.students.length, 0),
    registered_students: school.total_students,
    registered_teachers: school.total_teachers
  }));

  const pilotSchoolData = pilotSchoolStats.map(school => ({
    pilot_school_id: school.id,
    school_name: school.school_name,
    school_code: school.school_code,
    province: school.province,
    total_students: school.students.length,
    mentor_count: school.users.length,
    mentoring_visits: school.mentoring_visits.length,
    completed_visits: school.mentoring_visits.filter(v => v.status === 'completed').length
  }));

  return NextResponse.json({
    data: {
      regular_schools: schoolData,
      pilot_schools: pilotSchoolData,
      summary: {
        total_schools: schoolData.length,
        total_pilot_schools: pilotSchoolData.length,
        total_students_regular: schoolData.reduce((sum, s) => sum + s.total_students, 0),
        total_students_pilot: pilotSchoolData.reduce((sum, s) => sum + s.total_students, 0)
      }
    }
  });
}

// Export Data Report - Raw data for Excel export
async function getExportDataReport(baseFilters: any, params: any) {
  const whereStudent: any = { is_active: true, ...baseFilters };
  const whereAssessment: any = { ...baseFilters };
  
  if (params.pilot_school_id) {
    whereStudent.pilot_school_id = parseInt(params.pilot_school_id);
    whereAssessment.pilot_school_id = parseInt(params.pilot_school_id);
  }
  
  if (params.date_from) {
    whereAssessment.assessed_date = { gte: new Date(params.date_from) };
  }
  
  if (params.date_to) {
    whereAssessment.assessed_date = {
      ...whereAssessment.assessed_date,
      lte: new Date(params.date_to)
    };
  }

  const [students, assessments] = await Promise.all([
    prisma.student.findMany({
      where: whereStudent,
      include: {
        school_class: {
          include: { school: true }
        },
        pilot_school: true,
        added_by: { select: { name: true, role: true } }
      }
    }),
    prisma.assessment.findMany({
      where: whereAssessment,
      include: {
        student: { select: { name: true } },
        pilot_school: { select: { school_name: true } },
        added_by: { select: { name: true, role: true } }
      }
    })
  ]);

  return NextResponse.json({
    data: {
      students: students,
      assessments: assessments,
      export_timestamp: new Date().toISOString(),
      filters_applied: { ...params, ...baseFilters }
    }
  });
}