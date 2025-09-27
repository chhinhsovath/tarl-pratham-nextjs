import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ['lock', 'unlock', 'verify', 'unverify', 'delete'],
    mentor: ['verify', 'unverify', 'delete'],
    teacher: [],
    coordinator: [],
    viewer: []
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access assessment
function canAccessAssessment(userRole: string, userId: number, assessment: any): boolean {
  if (userRole === 'admin') {
    return true;
  }
  
  if (userRole === 'mentor') {
    // Mentors can only access assessments from their assigned school
    return assessment.student.pilot_school_id === parseInt(userId.toString()); // This should be pilot_school_id from session
  }
  
  if (userRole === 'teacher') {
    return assessment.teacher_id === userId;
  }
  
  return false;
}

// POST /api/assessments/[id]/[operation] - Perform individual operations
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; operation: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assessmentId = parseInt(params.id);
    const operation = params.operation;
    
    if (isNaN(assessmentId)) {
      return NextResponse.json({ error: 'Invalid assessment ID' }, { status: 400 });
    }

    if (!['lock', 'unlock', 'verify', 'unverify', 'delete'].includes(operation)) {
      return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    if (!hasPermission(session.user.role, operation)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if assessment exists and user has access
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        student: {
          select: {
            pilot_school_id: true
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // For mentors, check school access
    if (session.user.role === 'mentor' && session.user.pilot_school_id) {
      if (assessment.student.pilot_school_id !== session.user.pilot_school_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Check if assessment is locked for certain operations
    if (['delete'].includes(operation) && assessment.is_locked) {
      return NextResponse.json(
        { error: 'Cannot perform operation on locked assessment' },
        { status: 403 }
      );
    }

    let updateData: any = {};
    let message = '';

    switch (operation) {
      case 'lock':
        updateData = { is_locked: true };
        message = 'ចាក់សោការវាយតម្លៃបានជោគជ័យ';
        break;
        
      case 'unlock':
        updateData = { is_locked: false };
        message = 'ដោះសោការវាយតម្លៃបានជោគជ័យ';
        break;
        
      case 'verify':
        updateData = { 
          is_verified: true,
          verified_by_id: parseInt(session.user.id),
          verified_at: new Date()
        };
        message = 'ផ្ទៀងផ្ទាត់ការវាយតម្លៃបានជោគជ័យ';
        break;
        
      case 'unverify':
        updateData = { 
          is_verified: false,
          verified_by_id: null,
          verified_at: null
        };
        message = 'លុបការផ្ទៀងផ្ទាត់ការវាយតម្លៃបានជោគជ័យ';
        break;
        
      case 'delete':
        // For mentors deleting temporary assessments, hard delete
        // For others, soft delete (mark as inactive)
        if (session.user.role === 'mentor' && assessment.is_temporary) {
          await prisma.assessment.delete({
            where: { id: assessmentId }
          });
        } else {
          await prisma.assessment.update({
            where: { id: assessmentId },
            data: { is_active: false }
          });
        }
        
        message = 'លុបការវាយតម្លៃបានជោគជ័យ';
        
        return NextResponse.json({ message });
    }

    // Perform update for non-delete operations
    if (operation !== 'delete') {
      await prisma.assessment.update({
        where: { id: assessmentId },
        data: {
          ...updateData,
          updated_at: new Date()
        }
      });
    }

    return NextResponse.json({ message });

  } catch (error) {
    console.error('Error performing assessment operation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}