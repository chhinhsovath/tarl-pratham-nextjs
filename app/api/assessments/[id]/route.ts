import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = parseInt(params.id);
    
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        student: {
          include: {
            school_class: {
              include: {
                school: {
                  select: { name: true }
                }
              }
            },
            pilot_school: {
              select: { name: true, code: true }
            }
          }
        },
        pilot_school: {
          select: { name: true, code: true }
        },
        added_by: {
          select: { name: true, role: true }
        },
        assessment_histories: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({ assessment });

  } catch (error) {
    console.error('Assessment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assessment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = parseInt(params.id);
    const body = await request.json();
    
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    const {
      level,
      score,
      notes,
      assessed_date
    } = body;

    const addedByHeader = request.headers.get('user-id');
    const changedBy = addedByHeader ? parseInt(addedByHeader) : null;

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Update assessment
    const updatedAssessment = await prisma.assessment.update({
      where: { id: assessmentId },
      data: {
        level: level || existingAssessment.level,
        score: score !== undefined ? score : existingAssessment.score,
        notes: notes !== undefined ? notes : existingAssessment.notes,
        assessed_date: assessed_date ? new Date(assessed_date) : existingAssessment.assessed_date,
        updated_at: new Date()
      },
      include: {
        student: {
          select: { name: true }
        },
        added_by: {
          select: { name: true, role: true }
        },
        pilot_school: {
          select: { name: true }
        }
      }
    });

    // Create history record
    await prisma.assessmentHistory.create({
      data: {
        assessment_id: assessmentId,
        field_name: 'updated',
        old_value: JSON.stringify({
          level: existingAssessment.level,
          score: existingAssessment.score,
          notes: existingAssessment.notes,
          assessed_date: existingAssessment.assessed_date
        }),
        new_value: JSON.stringify({
          level: updatedAssessment.level,
          score: updatedAssessment.score,
          notes: updatedAssessment.notes,
          assessed_date: updatedAssessment.assessed_date
        }),
        changed_by: changedBy
      }
    });

    // Update student level field
    if (level && level !== existingAssessment.level) {
      const levelUpdateField = `${updatedAssessment.assessment_type}_${updatedAssessment.subject}_level`;
      await prisma.student.update({
        where: { id: updatedAssessment.student_id },
        data: {
          [levelUpdateField]: level
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Assessment updated successfully',
      assessment: updatedAssessment
    });

  } catch (error) {
    console.error('Assessment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update assessment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessmentId = parseInt(params.id);
    
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    // Check if assessment exists
    const existingAssessment = await prisma.assessment.findUnique({
      where: { id: assessmentId }
    });

    if (!existingAssessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Delete assessment histories first
    await prisma.assessmentHistory.deleteMany({
      where: { assessment_id: assessmentId }
    });

    // Delete assessment
    await prisma.assessment.delete({
      where: { id: assessmentId }
    });

    return NextResponse.json({
      success: true,
      message: 'Assessment deleted successfully'
    });

  } catch (error) {
    console.error('Assessment deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessment' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}