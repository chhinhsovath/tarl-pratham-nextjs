import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    version: '2024-12-10-fix-100-limit',
    timestamp: new Date().toISOString(),
    message: 'All pagination removed, should show ALL records'
  });
}