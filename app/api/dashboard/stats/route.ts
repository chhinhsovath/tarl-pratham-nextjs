import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('role');
    const userId = searchParams.get('userId');
    const pilotSchoolId = searchParams.get('pilotSchoolId');

    // Base statistics
    let whereClause: any = {};
    
    // Apply role-based filtering
    if (userRole === 'teacher' || userRole === 'mentor') {
      if (pilotSchoolId) {
        whereClause.pilot_school_id = parseInt(pilotSchoolId);
      }
    }

    // Get comprehensive statistics
    const [
      totalUsers,
      totalSchools,
      totalPilotSchools,
      totalStudents,
      temporaryStudents,
      totalAssessments,
      temporaryAssessments,
      recentAssessments,
      totalMentoringVisits,
      recentMentoringVisits,
      totalClasses,
      assessmentsByType,
      assessmentsBySubject,
      studentsByGender,
      schoolsByProvince,
      mentoringVisitsByStatus
    ] = await Promise.all([
      // Users count
      prisma.user.count({
        where: userRole === 'admin' ? {} : { role: { not: 'admin' } }
      }),
      
      // Schools count
      prisma.school.count({ where: { is_active: true } }),
      
      // Pilot schools count
      prisma.pilotSchool.count({ where: { is_active: true } }),
      
      // Students count
      prisma.student.count({
        where: { 
          is_active: true,
          ...whereClause
        }
      }),
      
      // Temporary students count (mentor created)
      prisma.student.count({
        where: { 
          is_temporary: true,
          is_active: true,
          ...whereClause
        }
      }),
      
      // Assessments count
      prisma.assessment.count({
        where: whereClause.pilot_school_id ? 
          { pilot_school_id: whereClause.pilot_school_id } : {}
      }),
      
      // Temporary assessments count
      prisma.assessment.count({
        where: {
          is_temporary: true,
          ...(whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {})
        }
      }),
      
      // Recent assessments (last 7 days)
      prisma.assessment.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          ...(whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {})
        }
      }),
      
      // Mentoring visits count
      prisma.mentoringVisit.count({
        where: userRole === 'mentor' && userId ? 
          { mentor_id: parseInt(userId) } : 
          whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {}
      }),
      
      // Recent mentoring visits (last 30 days)
      prisma.mentoringVisit.count({
        where: {
          created_at: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          },
          ...(userRole === 'mentor' && userId ? 
            { mentor_id: parseInt(userId) } : 
            whereClause.pilot_school_id ? 
              { pilot_school_id: whereClause.pilot_school_id } : {})
        }
      }),
      
      // Classes count
      prisma.schoolClass.count(),
      
      // Assessments by type
      prisma.assessment.groupBy({
        by: ['assessment_type'],
        _count: { id: true },
        where: whereClause.pilot_school_id ? 
          { pilot_school_id: whereClause.pilot_school_id } : {}
      }),
      
      // Assessments by subject
      prisma.assessment.groupBy({
        by: ['subject'],
        _count: { id: true },
        where: whereClause.pilot_school_id ? 
          { pilot_school_id: whereClause.pilot_school_id } : {}
      }),
      
      // Students by gender
      prisma.student.groupBy({
        by: ['gender'],
        _count: { id: true },
        where: {
          is_active: true,
          gender: { not: null },
          ...whereClause
        }
      }),
      
      // Schools by province (admin/coordinator only)
      userRole === 'admin' || userRole === 'coordinator' ?
        prisma.school.groupBy({
          by: ['province_id'],
          _count: { id: true },
          where: { is_active: true }
        }) : Promise.resolve([]),
      
      // Mentoring visits by status
      prisma.mentoringVisit.groupBy({
        by: ['status'],
        _count: { id: true },
        where: userRole === 'mentor' && userId ? 
          { mentor_id: parseInt(userId) } : 
          whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {}
      })
    ]);

    // Get province names for school distribution
    let schoolDistribution = [];
    if (schoolsByProvince.length > 0) {
      const provinces = await prisma.province.findMany({
        where: {
          id: { in: schoolsByProvince.map(s => s.province_id) }
        },
        select: { id: true, name_english: true, name_khmer: true }
      });
      
      schoolDistribution = schoolsByProvince.map(item => {
        const province = provinces.find(p => p.id === item.province_id);
        return {
          province: province?.name_english || 'Unknown',
          province_khmer: province?.name_khmer || 'មិនស្គាល់',
          count: item._count.id
        };
      });
    }

    // Calculate growth/trends (last 30 days vs previous 30 days)
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const previous30Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      studentsLast30,
      studentsPrevious30,
      assessmentsLast30,
      assessmentsPrevious30
    ] = await Promise.all([
      prisma.student.count({
        where: {
          created_at: { gte: last30Days },
          ...whereClause
        }
      }),
      prisma.student.count({
        where: {
          created_at: { gte: previous30Days, lt: last30Days },
          ...whereClause
        }
      }),
      prisma.assessment.count({
        where: {
          created_at: { gte: last30Days },
          ...(whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {})
        }
      }),
      prisma.assessment.count({
        where: {
          created_at: { gte: previous30Days, lt: last30Days },
          ...(whereClause.pilot_school_id ? 
            { pilot_school_id: whereClause.pilot_school_id } : {})
        }
      })
    ]);

    // Calculate percentage changes
    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const statistics = {
      overview: {
        total_users: totalUsers,
        total_schools: totalSchools,
        total_pilot_schools: totalPilotSchools,
        total_students: totalStudents,
        temporary_students: temporaryStudents,
        total_assessments: totalAssessments,
        temporary_assessments: temporaryAssessments,
        total_mentoring_visits: totalMentoringVisits,
        total_classes: totalClasses
      },
      recent_activity: {
        assessments_last_7_days: recentAssessments,
        mentoring_visits_last_30_days: recentMentoringVisits,
        students_added_last_30_days: studentsLast30,
        assessments_last_30_days: assessmentsLast30
      },
      growth_trends: {
        students_growth: calculateGrowth(studentsLast30, studentsPrevious30),
        assessments_growth: calculateGrowth(assessmentsLast30, assessmentsPrevious30)
      },
      distributions: {
        assessments_by_type: assessmentsByType.reduce((acc, item) => {
          acc[item.assessment_type] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        assessments_by_subject: assessmentsBySubject.reduce((acc, item) => {
          acc[item.subject] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        students_by_gender: studentsByGender.reduce((acc, item) => {
          acc[item.gender || 'Unknown'] = item._count.id;
          return acc;
        }, {} as Record<string, number>),
        schools_by_province: schoolDistribution,
        mentoring_visits_by_status: mentoringVisitsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {} as Record<string, number>)
      }
    };

    return NextResponse.json({ statistics });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}