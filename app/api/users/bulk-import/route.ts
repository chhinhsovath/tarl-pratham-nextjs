import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const preview = formData.get('preview') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 });
    }

    // Validate and prepare data
    const validUsers = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowErrors = [];

      // Validate required fields
      if (!row.name || typeof row.name !== 'string') {
        rowErrors.push('Name is required');
      }
      if (!row.email || typeof row.email !== 'string') {
        rowErrors.push('Email is required');
      }
      if (!row.password || typeof row.password !== 'string') {
        rowErrors.push('Password is required');
      }
      if (!row.role || !['admin', 'coordinator', 'mentor', 'teacher', 'viewer'].includes(row.role)) {
        rowErrors.push('Valid role is required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (row.email && !emailRegex.test(row.email)) {
        rowErrors.push('Invalid email format');
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: i + 2, // Excel row number (1-indexed + header)
          errors: rowErrors,
          data: row
        });
      } else {
        validUsers.push({
          name: row.name.trim(),
          email: row.email.toLowerCase().trim(),
          password: row.password,
          role: row.role,
          province: row.province || null,
          subject: row.subject || null,
          phone: row.phone || null,
          pilot_school_id: row.pilot_school_id ? parseInt(row.pilot_school_id) : null
        });
      }
    }

    // If preview mode, return validation results
    if (preview) {
      return NextResponse.json({
        total: data.length,
        valid: validUsers.length,
        invalid: errors.length,
        users: validUsers.slice(0, 10), // Preview first 10
        errors: errors.slice(0, 10)
      });
    }

    // Check for duplicate emails in database
    const emails = validUsers.map(user => user.email);
    const existingUsers = await prisma.users.findMany({
      where: { email: { in: emails } },
      select: { email: true }
    });

    const existingEmails = new Set(existingUsers.map(user => user.email));
    const usersToCreate = validUsers.filter(user => !existingEmails.has(user.email));
    const duplicateEmails = validUsers.filter(user => existingEmails.has(user.email));

    if (duplicateEmails.length > 0) {
      errors.push(...duplicateEmails.map(user => ({
        row: 0,
        errors: ['Email already exists in database'],
        data: user
      })));
    }

    // Hash passwords and create users
    const hashedUsers = await Promise.all(
      usersToCreate.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12)
      }))
    );

    // Create users in database
    const createdUsers = await prisma.$transaction(
      hashedUsers.map(user => 
        prisma.users.create({
          data: user,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            created_at: true
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdUsers.length} users`,
      created: createdUsers.length,
      skipped: duplicateEmails.length,
      errors: errors,
      users: createdUsers
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import users' },
      { status: 500 }
    );  }
}

export async function GET() {
  // Return template for bulk import
  const template = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'admin123',
      role: 'teacher',
      province: 'Phnom Penh',
      subject: 'Math',
      phone: '012345678',
      pilot_school_id: ''
    }
  ];

  return NextResponse.json({
    template,
    fields: [
      { key: 'name', required: true, type: 'string', description: 'Full name of the user' },
      { key: 'email', required: true, type: 'email', description: 'Unique email address' },
      { key: 'password', required: true, type: 'string', description: 'Password (min 6 characters)' },
      { key: 'role', required: true, type: 'enum', options: ['admin', 'coordinator', 'mentor', 'teacher', 'viewer'], description: 'User role' },
      { key: 'province', required: false, type: 'string', description: 'Province name' },
      { key: 'subject', required: false, type: 'string', description: 'Teaching subject' },
      { key: 'phone', required: false, type: 'string', description: 'Phone number' },
      { key: 'pilot_school_id', required: false, type: 'number', description: 'Pilot school ID for mentors/teachers' }
    ]
  });
}