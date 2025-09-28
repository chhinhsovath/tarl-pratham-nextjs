import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data for demonstration - in a real app, this would be in a database
let customReports = [
  {
    id: 1,
    name: 'របាយការណ៍ទិន្នន័យសាកល្បង',
    description: 'របាយការណ៍សម្រាប់បង្ហាញទិន្នន័យសាកល្បងរបស់ការវាយតម្លៃ',
    type: 'វិភាគការវាយតម្លៃ',
    created_by: 'user_1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'តាមដានលទ្ធផលសិស្ស',
    description: 'របាយការណ៍តាមដានលទ្ធផលរបស់សិស្សតាមកាលបរិច្ឆេទ',
    type: 'សមត្ថភាពសិស្ស',
    created_by: 'user_2',
    created_at: '2024-01-20T14:30:00Z',
    updated_at: '2024-01-20T14:30:00Z'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'មិនបានកំណត់អត្តសញ្ញាណ' },
        { status: 401 }
      );
    }

    const reportId = parseInt(params.id);
    const report = customReports.find(r => r.id === reportId);

    if (!report) {
      return NextResponse.json(
        { error: 'រកមិនឃើញរបាយការណ៍' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error fetching custom report:', error);
    return NextResponse.json(
      { error: 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'មិនបានកំណត់អត្តសញ្ញាណ' },
        { status: 401 }
      );
    }

    const reportId = parseInt(params.id);
    const reportIndex = customReports.findIndex(r => r.id === reportId);

    if (reportIndex === -1) {
      return NextResponse.json(
        { error: 'រកមិនឃើញរបាយការណ៍' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { name, description, type } = data;

    if (!name || !description || !type) {
      return NextResponse.json(
        { error: 'សូមបំពេញព័ត៌មានទាំងអស់' },
        { status: 400 }
      );
    }

    customReports[reportIndex] = {
      ...customReports[reportIndex],
      name,
      description,
      type,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: customReports[reportIndex]
    });
  } catch (error) {
    console.error('Error updating custom report:', error);
    return NextResponse.json(
      { error: 'មានបញ្ហាក្នុងការកែសម្រួលរបាយការណ៍' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'មិនបានកំណត់អត្តសញ្ញាណ' },
        { status: 401 }
      );
    }

    const reportId = parseInt(params.id);
    const reportIndex = customReports.findIndex(r => r.id === reportId);

    if (reportIndex === -1) {
      return NextResponse.json(
        { error: 'រកមិនឃើញរបាយការណ៍' },
        { status: 404 }
      );
    }

    customReports.splice(reportIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'លុបរបាយការណ៍បានជោគជ័យ'
    });
  } catch (error) {
    console.error('Error deleting custom report:', error);
    return NextResponse.json(
      { error: 'មានបញ្ហាក្នុងការលុបរបាយការណ៍' },
      { status: 500 }
    );
  }
}