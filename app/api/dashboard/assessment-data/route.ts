import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject') || 'khmer';
    
    // Return demo data matching Laravel structure
    const demoData = {
      baseline: {
        beginner: 45,
        letter: 78,
        word: 112,
        paragraph: 95,
        story: 65
      },
      midline: {
        beginner: 28,
        letter: 52,
        word: 98,
        paragraph: 125,
        story: 92
      },
      endline: {
        beginner: 15,
        letter: 35,
        word: 75,
        paragraph: 140,
        story: 130
      }
    };

    return NextResponse.json({
      success: true,
      data: demoData
    });
  } catch (error) {
    console.error('Assessment data error:', error);
    
    // Return demo data on error
    return NextResponse.json({
      success: true,
      data: {
        baseline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
        midline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
        endline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 }
      }
    });
  }
}