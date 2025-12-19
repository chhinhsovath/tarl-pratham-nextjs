import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const school_id = searchParams.get('school_id');
    const grade = searchParams.get('grade');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { teacher_name: { contains: search, mode: 'insensitive' } },
        { school: { name: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (school_id) {
      where.school_id = parseInt(school_id);
    }

    if (grade) {
      where.grade = parseInt(grade);
    }

    // Get classes with pagination
    const [classes, total] = await Promise.all([
      prisma.school_classes.findMany({
        where,
        include: {
          school: {
            select: {
              id: true,
              name: true,
              code: true
            }
          },
          students: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: [
          { grade: 'asc' },
          { name: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.school_classes.count({ where })
    ]);

    // Add student count to each class
    const classesWithCounts = classes.map(schoolClass => ({
      ...schoolClass,
      actual_student_count: schoolClass.students.length,
      students: undefined // Remove students array to avoid large response
    }));

    const response = NextResponse.json({
      classes: classesWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

    // Cache class list for 30 minutes - changes infrequently
    // Only cache when there's no search query (exact matches should not be cached)
    if (!search && !school_id && !grade) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=1800, stale-while-revalidate=3600'
      );
    }

    return response;

  } catch (error) {
    console.error('Classes fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch classes',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: error
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      school_id,
      name,
      grade,
      teacher_name,
      student_count
    } = body;

    if (!school_id || !name || !grade) {
      return NextResponse.json(
        { error: 'School ID, class name, and grade are required' },
        { status: 400 }
      );
    }

    // Validate school exists
    const school = await prisma.school.findUnique({
      where: { id: school_id }
    });

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Check if class already exists for this school and grade
    const existingClass = await prisma.school_classes.findFirst({
      where: {
        school_id,
        name,
        grade
      }
    });

    if (existingClass) {
      return NextResponse.json(
        { error: 'Class already exists for this school and grade' },
        { status: 400 }
      );
    }

    // Create class
    const schoolClass = await prisma.school_classes.create({
      data: {
        school_id,
        name,
        grade,
        teacher_name,
        student_count: student_count || 0
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Class created successfully',
      class: schoolClass
    });

  } catch (error) {
    console.error('Class creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create class' },
      { status: 500 }
    );
  }
}