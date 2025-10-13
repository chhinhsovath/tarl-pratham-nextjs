import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assessments } = body;

    const addedByHeader = request.headers.get('user-id');
    const userRoleHeader = request.headers.get('user-role');
    const pilotSchoolHeader = request.headers.get('pilot-school-id');

    if (!assessments || !Array.isArray(assessments) || assessments.length === 0) {
      return NextResponse.json(
        { error: 'Assessments array is required' },
        { status: 400 }
      );
    }

    const addedById = addedByHeader ? parseInt(addedByHeader) : null;
    const userRole = userRoleHeader || 'teacher';
    const pilotSchoolId = pilotSchoolHeader ? parseInt(pilotSchoolHeader) : null;

    // Validate all assessments
    const validationErrors = [];
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i];
      if (!assessment.student_id || !assessment.assessment_type || !assessment.subject) {
        validationErrors.push(`Assessment ${i + 1}: Missing required fields`);
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation errors', details: validationErrors },
        { status: 400 }
      );
    }

    // Process assessments in transaction
    const results = await prisma.$transaction(async (tx) => {
      const createdAssessments = [];
      const updatedAssessments = [];
      const errors = [];

      for (const assessmentData of assessments) {
        try {
          const {
            student_id,
            assessment_type,
            subject,
            level,
            score,
            notes,
            assessed_date
          } = assessmentData;

          // Check if student exists
          const student = await tx.student.findUnique({
            where: { id: student_id },
            include: { pilot_school: true }
          });

          if (!student) {
            errors.push({
              student_id,
              error: 'Student not found'
            });
            continue;
          }

          // Check for existing assessment
          const existingAssessment = await tx.assessment.findFirst({
            where: {
              student_id,
              assessment_type,
              subject,
              is_temporary: false
            }
          });

          let assessment;

          if (existingAssessment) {
            // Update existing assessment
            assessment = await tx.assessment.update({
              where: { id: existingAssessment.id },
              data: {
                level,
                score,
                notes,
                assessed_date: assessed_date ? new Date(assessed_date) : new Date(),
                updated_at: new Date()
              },
              include: {
                student: { select: { name: true } },
                added_by: { select: { name: true, role: true } },
                pilot_school: { select: { school_name: true } }
              }
            });

            updatedAssessments.push(assessment);
          } else {
            // Create new assessment
            assessment = await tx.assessment.create({
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
                is_temporary: userRole === 'mentor',
                assessed_by_mentor: userRole === 'mentor',
                mentor_assessment_id: userRole === 'mentor' ? 
                  `${student_id}_${assessment_type}_${subject}_${Date.now()}` : null
              },
              include: {
                student: { select: { name: true } },
                added_by: { select: { name: true, role: true } },
                pilot_school: { select: { school_name: true } }
              }
            });

            createdAssessments.push(assessment);
          }

          // Update student level fields
          const levelUpdateField = `${assessment_type}_${subject}_level`;
          await tx.student.update({
            where: { id: student_id },
            data: {
              [levelUpdateField]: level,
              updated_at: new Date()
            }
          });

          // Create assessment history record
          await tx.assessmentHistory.create({
            data: {
              assessment_id: assessment.id,
              field_name: existingAssessment ? 'bulk_updated' : 'bulk_created',
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

        } catch (error) {
          console.error(`Error processing assessment for student ${assessmentData.student_id}:`, error);
          errors.push({
            student_id: assessmentData.student_id,
            error: 'Failed to save assessment'
          });
        }
      }

      return {
        created: createdAssessments,
        updated: updatedAssessments,
        errors
      };
    });

    const totalProcessed = results.created.length + results.updated.length;
    const totalErrors = results.errors.length;

    return NextResponse.json({
      success: true,
      message: `Successfully processed ${totalProcessed} assessments`,
      summary: {
        total_submitted: assessments.length,
        created: results.created.length,
        updated: results.updated.length,
        errors: totalErrors
      },
      results,
      isTemporary: userRole === 'mentor'
    });

  } catch (error) {
    console.error('Bulk submit error:', error);
    return NextResponse.json(
      { error: 'Failed to submit assessments' },
      { status: 500 }
    );
  }
}