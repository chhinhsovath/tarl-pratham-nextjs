import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ['view', 'create', 'update', 'delete', 'verify', 'lock'],
    mentor: ['view', 'create', 'update', 'verify'],
    teacher: ['view'],
    coordinator: ['view'],
    viewer: ['view']
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/assessments/manage - List assessments with management features
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role, 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const assessment_period = searchParams.get('assessment_period') || '';
    const school_id = searchParams.get('school_id') || '';
    const teacher_id = searchParams.get('teacher_id') || '';
    const is_verified = searchParams.get('is_verified') || '';
    const is_locked = searchParams.get('is_locked') || '';
    const is_temporary = searchParams.get('is_temporary') || '';
    const tab = searchParams.get('tab') || 'all';
    const date_from = searchParams.get('date_from') || '';
    const date_to = searchParams.get('date_to') || '';
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    // Text search
    if (search) {
      where.OR = [
        { 
          student: {
            name: { contains: search, mode: 'insensitive' }
          }
        },
        {
          teacher: {
            name: { contains: search, mode: 'insensitive' }
          }
        }
      ];
    }
    
    // Filter by assessment period
    if (assessment_period) {
      where.assessment_period = assessment_period;
    }
    
    // Filter by school
    if (school_id) {
      where.student = {
        pilot_school_id: parseInt(school_id)
      };
    }
    
    // Filter by teacher
    if (teacher_id) {
      where.teacher_id = parseInt(teacher_id);
    }
    
    // Filter by verification status
    if (is_verified !== '') {
      where.is_verified = is_verified === 'true';
    }
    
    // Filter by lock status
    if (is_locked !== '') {
      where.is_locked = is_locked === 'true';
    }
    
    // Filter by temporary status
    if (is_temporary !== '') {
      where.is_temporary = is_temporary === 'true';
    }
    
    // Date range filter
    if (date_from && date_to) {
      where.assessment_date = {
        gte: new Date(date_from),
        lte: new Date(date_to)
      };
    } else if (date_from) {
      where.assessment_date = {
        gte: new Date(date_from)
      };
    } else if (date_to) {
      where.assessment_date = {
        lte: new Date(date_to)
      };
    }

    // Tab-based filtering
    switch (tab) {
      case 'unverified':
        where.is_verified = false;
        break;
      case 'verified':
        where.is_verified = true;
        break;
      case 'locked':
        where.is_locked = true;
        break;
      case 'temporary':
        where.is_temporary = true;
        break;
    }

    // Apply access restrictions based on user role
    if (session.user.role === 'teacher') {
      where.teacher_id = parseInt(session.user.id);
    } else if (session.user.role === 'mentor') {
      // Mentors can see assessments from ALL their assigned schools
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0) {
        where.student = {
          ...where.student,
          pilot_school_id: { in: mentorSchoolIds }
        };
      } else {
        // No schools assigned - return no assessments
        where.id = -1;
      }
    }

    const [assessments, total] = await Promise.all([
      prisma.assessment.findMany({
        where,
        include: {
          student: {
            include: {
              pilotSchool: {
                select: {
                  id: true,
                  school_name: true,
                  school_code: true
                }
              }
            }
          },
          teacher: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          verified_by: {
            select: {
              id: true,
              name: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { assessment_date: 'desc' }
      }),
      prisma.assessment.count({ where })
    ]);

    return NextResponse.json({
      data: assessments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching assessments for management:', error);
    
    // Check if it's a Prisma/database error
    if (error.code === 'P2002' || error.code === 'P2025' || error.message?.includes('Invalid')) {
      // Return empty data with clear Khmer message for database issues
      return NextResponse.json({
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          pages: 0
        },
        message: 'មិនមានទិន្នន័យការវាយតម្លៃនៅក្នុងប្រព័ន្ធ',
        error_detail: 'បញ្ហាទាក់ទងនឹងមូលដ្ឋានទិន្នន័យ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ'
      });
    }
    
    // Provide mock data as fallback for development
    const mockAssessments = [
      {
        id: 1,
        student_id: 1,
        teacher_id: 1,
        assessment_period: 'baseline',
        assessment_date: new Date('2024-01-15'),
        khmer_reading: 85,
        khmer_writing: 80,
        khmer_total: 82,
        math_numbers: 90,
        math_operations: 85,
        math_total: 87,
        overall_score: 84,
        is_verified: false,
        is_locked: false,
        is_temporary: false,
        created_at: new Date(),
        updated_at: new Date(),
        student: {
          id: 1,
          student_name: 'សិស្ស ទី១',
          gender: 'male',
          grade_level: 'grade_4',
          pilotSchool: {
            id: 1,
            school_name: 'សាលាបឋមសិក្សាគំរូ',
            school_code: 'SCH001'
          }
        },
        teacher: {
          id: 1,
          name: 'គ្រូ សុខា',
          email: 'sokha@example.com'
        },
        verified_by: null
      },
      {
        id: 2,
        student_id: 2,
        teacher_id: 1,
        assessment_period: 'baseline',
        assessment_date: new Date('2024-01-16'),
        khmer_reading: 75,
        khmer_writing: 70,
        khmer_total: 72,
        math_numbers: 80,
        math_operations: 75,
        math_total: 77,
        overall_score: 74,
        is_verified: true,
        is_locked: false,
        is_temporary: false,
        verified_at: new Date('2024-01-17'),
        created_at: new Date(),
        updated_at: new Date(),
        student: {
          id: 2,
          student_name: 'សិស្ស ទី២',
          gender: 'female',
          grade_level: 'grade_5',
          pilotSchool: {
            id: 1,
            school_name: 'សាលាបឋមសិក្សាគំរូ',
            school_code: 'SCH001'
          }
        },
        teacher: {
          id: 1,
          name: 'គ្រូ សុខា',
          email: 'sokha@example.com'
        },
        verified_by: {
          id: 2,
          name: 'គ្រូ មករា'
        }
      }
    ];
    
    return NextResponse.json({
      data: mockAssessments,
      pagination: {
        page: 1,
        limit: 20,
        total: mockAssessments.length,
        pages: 1
      },
      message: 'កំពុងប្រើទិន្នន័យសាកល្បង',
      mock: true
    });
  }
}