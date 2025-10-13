import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      student_id,
      assessment_type,
      subject,
      level,
      score,
      notes,
      assessed_date
    } = body;

    const addedByHeader = request.headers.get('user-id');
    const userRoleHeader = request.headers.get('user-role');
    const pilotSchoolHeader = request.headers.get('pilot-school-id');

    if (!student_id || !assessment_type || !subject) {
      return NextResponse.json(
        { error: 'Student ID, assessment type, and subject are required' },
        { status: 400 }
      );
    }

    const addedById = addedByHeader ? parseInt(addedByHeader) : null;
    const userRole = userRoleHeader || 'teacher';
    const pilotSchoolId = pilotSchoolHeader ? parseInt(pilotSchoolHeader) : null;

    // Validate student exists
    const student = await prisma.student.findUnique({
      where: { id: student_id },
      include: {
        pilot_school: true,
        school_class: {
          include: { school: true }
        }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Check if assessment already exists for this student/type/subject
    const existingAssessment = await prisma.assessment.findFirst({
      where: {
        student_id,
        assessment_type,
        subject,
        is_temporary: false // Only check non-temporary assessments
      }
    });

    let assessment;

    if (existingAssessment) {
      // Update existing assessment
      assessment = await prisma.assessment.update({
        where: { id: existingAssessment.id },
        data: {
          level,
          score,
          notes,
          assessed_date: assessed_date ? new Date(assessed_date) : new Date(),
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
    } else {
      // Create new assessment
      assessment = await prisma.assessment.create({
        data: {
          student_id,
          pilot_school_id: pilotSchoolId || student.pilot_school_id,
          assessment_type,
          subject,
          level,
          score,
          notes,
          assessed_date: assessed_date ? new Date(assessed_date) : new Date(),
          added_by_id: addedById,
          is_temporary: userRole === 'mentor' && student.is_temporary,
          assessed_by_mentor: userRole === 'mentor',
          mentor_assessment_id: userRole === 'mentor' ? `${student_id}_${assessment_type}_${subject}_${Date.now()}` : null,
          expires_at: userRole === 'mentor' && student.is_temporary ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null
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
    }

    // Update student level fields
    const levelUpdateField = `${assessment_type}_${subject}_level`;
    await prisma.student.update({
      where: { id: student_id },
      data: {
        [levelUpdateField]: level,
        updated_at: new Date()
      }
    });

    // Create assessment history record
    await prisma.assessmentHistory.create({
      data: {
        assessment_id: assessment.id,
        field_name: existingAssessment ? 'updated' : 'created',
        old_value: existingAssessment ? JSON.stringify({
          level: existingAssessment.level,
          score: existingAssessment.score,
          notes: existingAssessment.notes
        }) : null,
        new_value: JSON.stringify({
          level,
          score,
          notes
        }),
        changed_by: addedById
      }
    });

    return NextResponse.json({
      success: true,
      message: existingAssessment ? 'Assessment updated successfully' : 'Assessment saved successfully',
      assessment,
      isTemporary: userRole === 'mentor'
    });

  } catch (error) {
    console.error('Save assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}