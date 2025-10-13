import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    
    if (isNaN(classId)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 });
    }

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
      include: {
        school: {
          include: {
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        },
        students: {
          include: {
            assessments: {
              select: {
                assessment_type: true,
                subject: true,
                level: true,
                score: true,
                assessed_date: true
              }
            }
          },
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!schoolClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    return NextResponse.json({ class: schoolClass });

  } catch (error) {
    console.error('Class fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch class' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(classId)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 });
    }

    const {
      name,
      grade,
      teacher_name,
      student_count
    } = body;

    // Check if class exists
    const existingClass = await prisma.schoolClass.findUnique({
      where: { id: classId }
    });

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Update class
    const updatedClass = await prisma.schoolClass.update({
      where: { id: classId },
      data: {
        name: name || existingClass.name,
        grade: grade || existingClass.grade,
        teacher_name: teacher_name !== undefined ? teacher_name : existingClass.teacher_name,
        student_count: student_count !== undefined ? student_count : existingClass.student_count,
        updated_at: new Date()
      },
      include: {
        school: {
          include: {
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
      message: 'Class updated successfully',
      class: updatedClass
    });

  } catch (error) {
    console.error('Class update error:', error);
    return NextResponse.json(
      { error: 'Failed to update class' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const classId = parseInt(params.id);
    
    if (isNaN(classId)) {
      return NextResponse.json({ error: 'Invalid class ID' }, { status: 400 });
    }

    // Check if class exists
    const existingClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
      include: {
        students: { select: { id: true } }
      }
    });

    if (!existingClass) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    // Check if class has students
    if (existingClass.students.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete class with enrolled students' },
        { status: 400 }
      );
    }

    // Delete class
    await prisma.schoolClass.delete({
      where: { id: classId }
    });

    return NextResponse.json({
      success: true,
      message: 'Class deleted successfully'
    });

  } catch (error) {
    console.error('Class deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete class' },
      { status: 500 }
    );
  }
}