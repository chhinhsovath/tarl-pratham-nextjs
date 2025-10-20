import { NextResponse } from 'next/server';

/**
 * Version check endpoint to verify deployment
 * GET /api/version
 */
export async function GET() {
  return NextResponse.json({
    version: '667543a',
    deployment: 'mentoring-fix-get-endpoint',
    timestamp: new Date().toISOString(),
    message: 'If you see version 667543a, the fix is deployed!'
  });
}
