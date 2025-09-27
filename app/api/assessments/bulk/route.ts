import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for bulk operations
const bulkOperationSchema = z.object({
  assessment_ids: z.array(z.number()),
  operation: z.enum(['lock', 'unlock', 'verify', 'unverify', 'delete'])
});

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

// POST /api/assessments/bulk - Perform bulk operations on assessments
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = bulkOperationSchema.parse(body);
    const { assessment_ids, operation } = validatedData;

    if (!hasPermission(session.user.role, operation)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Verify all assessments exist and user has access
    const assessments = await prisma.assessment.findMany({
      where: {
        id: { in: assessment_ids }
      },
      include: {
        student: {
          select: {
            pilot_school_id: true
          }
        }
      }
    });

    if (assessments.length !== assessment_ids.length) {
      return NextResponse.json(
        { error: 'Some assessments not found' },
        { status: 404 }
      );
    }

    // Check access permissions for mentor role
    if (session.user.role === 'mentor' && session.user.pilot_school_id) {
      const hasUnauthorizedAccess = assessments.some(assessment => 
        assessment.student.pilot_school_id !== session.user.pilot_school_id
      );
      
      if (hasUnauthorizedAccess) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Check for locked assessments in delete operation
    if (operation === 'delete') {
      const lockedAssessments = assessments.filter(a => a.is_locked);
      if (lockedAssessments.length > 0) {
        return NextResponse.json(
          { error: 'Cannot delete locked assessments' },
          { status: 400 }
        );
      }
    }

    let updateData: any = {};
    let message = '';

    switch (operation) {
      case 'lock':
        updateData = { is_locked: true };
        message = `ចាក់សោការវាយតម្លៃចំនួន ${assessment_ids.length} បានជោគជ័យ`;
        break;
        
      case 'unlock':
        updateData = { is_locked: false };
        message = `ដោះសោការវាយតម្លៃចំនួន ${assessment_ids.length} បានជោគជ័យ`;
        break;
        
      case 'verify':
        updateData = { 
          is_verified: true,
          verified_by_id: parseInt(session.user.id),
          verified_at: new Date()
        };
        message = `ផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${assessment_ids.length} បានជោគជ័យ`;
        break;
        
      case 'unverify':
        updateData = { 
          is_verified: false,
          verified_by_id: null,
          verified_at: null
        };
        message = `លុបការផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${assessment_ids.length} បានជោគជ័យ`;
        break;
        
      case 'delete':
        // For mentors deleting temporary assessments, hard delete
        // For others, soft delete (mark as inactive)
        if (session.user.role === 'mentor') {
          const temporaryAssessments = assessments.filter(a => a.is_temporary);
          const nonTemporaryAssessments = assessments.filter(a => !a.is_temporary);
          
          // Hard delete temporary assessments
          if (temporaryAssessments.length > 0) {
            await prisma.assessment.deleteMany({
              where: {
                id: { in: temporaryAssessments.map(a => a.id) }
              }
            });
          }
          
          // Soft delete non-temporary assessments
          if (nonTemporaryAssessments.length > 0) {
            await prisma.assessment.updateMany({
              where: {
                id: { in: nonTemporaryAssessments.map(a => a.id) }
              },
              data: { is_active: false }
            });
          }
        } else {
          // Admin can perform soft delete
          await prisma.assessment.updateMany({
            where: {
              id: { in: assessment_ids }
            },
            data: { is_active: false }
          });
        }
        
        message = `លុបការវាយតម្លៃចំនួន ${assessment_ids.length} បានជោគជ័យ`;
        
        return NextResponse.json({ message });
    }

    // Perform bulk update for non-delete operations
    if (operation !== 'delete') {
      await prisma.assessment.updateMany({
        where: {
          id: { in: assessment_ids }
        },
        data: {
          ...updateData,
          updated_at: new Date()
        }
      });
    }

    return NextResponse.json({ message });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error performing bulk operation on assessments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}