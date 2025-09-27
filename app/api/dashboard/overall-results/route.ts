import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'khmer';
    const school_id = searchParams.get('school_id');
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const cluster = searchParams.get('cluster');

    // Mock data matching Laravel dashboard format exactly
    const chartData = {
      labels: ['ដើមគ្រា', 'ពាក់កណ្តាលគ្រា', 'ចុងគ្រា'],
      datasets: [
        {
          label: 'ដំណាក់កាលដើម',
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          data: subject === 'khmer' ? [45, 25, 15] : [50, 30, 20]
        },
        {
          label: 'អក្សរ',
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          data: subject === 'khmer' ? [30, 35, 25] : [25, 30, 25]
        },
        {
          label: 'ពាក្យ',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          data: subject === 'khmer' ? [20, 30, 35] : [15, 25, 30]
        },
        {
          label: 'កថាខណ្ឌ',
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          data: subject === 'khmer' ? [5, 8, 15] : [7, 10, 15]
        },
        {
          label: 'សាច់រឿង',
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          data: subject === 'khmer' ? [0, 2, 10] : [3, 5, 10]
        }
      ]
    };

    // Apply filter adjustments (mock)
    if (school_id || district || province) {
      chartData.datasets.forEach(dataset => {
        dataset.data = dataset.data.map(val => Math.floor(val * 0.8));
      });
    }

    const totals = {
      baseline: 235,
      midline: 287,
      endline: 312
    };

    // Apply filter adjustments
    if (school_id) {
      totals.baseline = 24;
      totals.midline = 29;
      totals.endline = 31;
    } else if (cluster) {
      totals.baseline = 47;
      totals.midline = 57;
      totals.endline = 62;
    } else if (district) {
      totals.baseline = 78;
      totals.midline = 96;
      totals.endline = 104;
    } else if (province) {
      totals.baseline = 118;
      totals.midline = 144;
      totals.endline = 156;
    }

    return NextResponse.json({ chartData, totals });
  } catch (error) {
    console.error('Error fetching overall results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}