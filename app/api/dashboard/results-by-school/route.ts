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
    const cycle = searchParams.get('cycle') || 'baseline';
    const school_id = searchParams.get('school_id');
    const province = searchParams.get('province');
    const district = searchParams.get('district');
    const cluster = searchParams.get('cluster');

    // Mock school names matching Laravel format
    const schools = [
      'សាលាបឋមសិក្សាអង្គរវត្ត',
      'សាលាបឋមសិក្សាពោធិ៍បាត់',
      'សាលាបឋមសិក្សាភ្នំព្រះ',
      'សាលាបឋមសិក្សាទឹកថ្លា',
      'សាលាបឋមសិក្សាមង្គលបុរី',
      'សាលាបឋមសិក្សាអូររុស្សី',
      'សាលាបឋមសិក្សាព្រះវិហារ',
      'សាលាបឋមសិក្សាចំការលើ'
    ];

    // Generate mock data based on cycle and subject
    const generateData = () => {
      const baseValues = {
        baseline: { beginner: 45, letter: 30, word: 20, paragraph: 5, story: 0 },
        midline: { beginner: 25, letter: 35, word: 30, paragraph: 8, story: 2 },
        endline: { beginner: 15, letter: 25, word: 35, paragraph: 15, story: 10 }
      };

      const values = baseValues[cycle as keyof typeof baseValues];
      
      return schools.map(school => {
        // Add some variation to each school
        const variation = Math.random() * 10 - 5;
        return {
          school,
          beginner: Math.max(0, values.beginner + variation),
          letter: Math.max(0, values.letter + variation),
          word: Math.max(0, values.word + variation),
          paragraph: Math.max(0, values.paragraph + variation / 2),
          story: Math.max(0, values.story + variation / 3)
        };
      });
    };

    const schoolData = generateData();
    
    // Filter schools based on selection
    let filteredSchools = schoolData;
    if (school_id) {
      filteredSchools = schoolData.slice(0, 1);
    } else if (cluster) {
      filteredSchools = schoolData.slice(0, 3);
    } else if (district) {
      filteredSchools = schoolData.slice(0, 5);
    } else if (province) {
      filteredSchools = schoolData.slice(0, 6);
    }

    // Format data for horizontal bar chart (Chart.js format)
    const chartData = {
      labels: filteredSchools.map(s => s.school),
      datasets: [
        {
          label: 'ដំណាក់កាលដើម',
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          data: filteredSchools.map(s => s.beginner),
          counts: filteredSchools.map(s => Math.round(s.beginner * 2))
        },
        {
          label: 'អក្សរ',
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          data: filteredSchools.map(s => s.letter),
          counts: filteredSchools.map(s => Math.round(s.letter * 2))
        },
        {
          label: 'ពាក្យ',
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          data: filteredSchools.map(s => s.word),
          counts: filteredSchools.map(s => Math.round(s.word * 2))
        },
        {
          label: 'កថាខណ្ឌ',
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          data: filteredSchools.map(s => s.paragraph),
          counts: filteredSchools.map(s => Math.round(s.paragraph * 2))
        },
        {
          label: 'សាច់រឿង',
          backgroundColor: 'rgba(168, 85, 247, 0.8)',
          data: filteredSchools.map(s => s.story),
          counts: filteredSchools.map(s => Math.round(s.story * 2))
        }
      ]
    };

    // Adjust data based on subject
    if (subject === 'math') {
      chartData.datasets[0].label = 'លេខ 1-9';
      chartData.datasets[1].label = 'លេខ 10-99';
      chartData.datasets[2].label = 'បូក/ដក';
      chartData.datasets[3].label = 'គុណ/ចែក';
      chartData.datasets[4].label = 'ចម្រុះ';
    }

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error('Error fetching school results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}