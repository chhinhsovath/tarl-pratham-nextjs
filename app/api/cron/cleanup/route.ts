import { NextRequest, NextResponse } from 'next/server';
import { cleanupTemporaryMentorData, getTemporaryDataStats } from '@/lib/cleanup';

// This API endpoint should be called by a cron job every hour
// Can be set up with Vercel Cron Jobs or external cron services

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (add your own secret verification)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get stats before cleanup
    const beforeStats = await getTemporaryDataStats();
    
    // Perform cleanup
    const result = await cleanupTemporaryMentorData();
    
    // Get stats after cleanup
    const afterStats = await getTemporaryDataStats();
    
    // Log the cleanup operation
    console.log('[CRON] Cleanup completed:', {
      before: beforeStats,
      after: afterStats,
      deleted: result
    });
    
    return NextResponse.json({
      success: true,
      message: 'Cleanup completed successfully',
      before: beforeStats,
      after: afterStats,
      deleted: {
        students: result.deletedStudents,
        assessments: result.deletedAssessments,
        histories: result.deletedHistories
      },
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('[CRON] Cleanup failed:', error);
    return NextResponse.json(
      { 
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Manual trigger for testing
export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to manually trigger cleanup
    // Should be restricted to admin users only
    
    const result = await cleanupTemporaryMentorData();
    
    return NextResponse.json({
      success: true,
      message: 'Manual cleanup completed',
      deleted: {
        students: result.deletedStudents,
        assessments: result.deletedAssessments,
        histories: result.deletedHistories
      },
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('[MANUAL] Cleanup failed:', error);
    return NextResponse.json(
      { error: 'Manual cleanup failed' },
      { status: 500 }
    );
  }
}