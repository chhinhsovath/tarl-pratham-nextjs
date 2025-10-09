import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and coordinator can access import history
    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build filter - coordinators only see their own imports
    const whereFilter: any = {};

    if (session.user.role === 'coordinator') {
      // Coordinators can only see imports they created
      whereFilter.imported_by = parseInt(session.user.id);
      console.log(`[COORDINATOR] Filtering bulk imports by imported_by: ${session.user.id}`);
    }
    // Admins see all imports (no filter)

    // Fetch bulk import records
    const imports = await prisma.bulkImport.findMany({
      where: whereFilter,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        import_type: true,
        file_name: true,
        total_rows: true,
        successful_rows: true,
        failed_rows: true,
        status: true,
        errors: true,
        created_at: true,
        updated_at: true,
        imported_by: true,
      }
    });

    // Get user names for imports (if imported_by exists)
    const userIds = imports
      .map(imp => imp.imported_by)
      .filter((id): id is number => id !== null);

    const users = userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true }
        })
      : [];

    const userMap = new Map(users.map(u => [u.id, u.name]));

    // Transform to match frontend expectations
    const formattedImports = imports.map(imp => ({
      id: imp.id,
      type: imp.import_type,
      fileName: imp.file_name,
      totalRecords: imp.total_rows || 0,
      successfulRecords: imp.successful_rows || 0,
      failedRecords: imp.failed_rows || 0,
      status: imp.status,
      errors: imp.errors,
      createdAt: imp.created_at,
      completedAt: imp.updated_at,
      createdBy: imp.imported_by ? userMap.get(imp.imported_by) || 'Unknown' : 'System',
    }));

    return NextResponse.json({
      imports: formattedImports,
      total: formattedImports.length,
    });
  } catch (error) {
    console.error('Error fetching bulk import history:', error);

    // If BulkImport table doesn't exist, return empty array
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json({
        imports: [],
        total: 0,
        message: 'Bulk import tracking not yet configured'
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch bulk import history',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
