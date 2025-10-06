import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
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

    // Get provinces for validation
    const provinces = await prisma.province.findMany({
      select: { id: true, name_english: true, code: true }
    });
    const provinceMap = new Map();
    provinces.forEach(p => {
      provinceMap.set(p.name_english.toLowerCase(), p.id);
      provinceMap.set(p.code.toLowerCase(), p.id);
    });

    // Validate and prepare data
    const validSchools = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowErrors = [];

      // Validate required fields
      if (!row.name || typeof row.name !== 'string') {
        rowErrors.push('School name is required');
      }
      if (!row.code || typeof row.code !== 'string') {
        rowErrors.push('School code is required');
      }
      if (!row.province) {
        rowErrors.push('Province is required');
      }

      // Validate province
      let province_id = null;
      if (row.province) {
        const provinceKey = row.province.toString().toLowerCase();
        province_id = provinceMap.get(provinceKey);
        if (!province_id) {
          rowErrors.push('Invalid province');
        }
      }

      // Validate numbers
      const total_students = row.total_students ? parseInt(row.total_students) : null;
      const total_teachers = row.total_teachers ? parseInt(row.total_teachers) : null;
      const latitude = row.latitude ? parseFloat(row.latitude) : null;
      const longitude = row.longitude ? parseFloat(row.longitude) : null;

      if (row.total_students && isNaN(total_students)) {
        rowErrors.push('Invalid total students number');
      }
      if (row.total_teachers && isNaN(total_teachers)) {
        rowErrors.push('Invalid total teachers number');
      }
      if (row.latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
        rowErrors.push('Invalid latitude');
      }
      if (row.longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
        rowErrors.push('Invalid longitude');
      }

      // Email validation
      if (row.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(row.email)) {
          rowErrors.push('Invalid email format');
        }
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: i + 2,
          errors: rowErrors,
          data: row
        });
      } else {
        validSchools.push({
          name: row.name.trim(),
          code: row.code.trim().toUpperCase(),
          province_id,
          district: row.district || null,
          commune: row.commune || null,
          village: row.village || null,
          school_type: row.school_type || null,
          level: row.level || null,
          total_students,
          total_teachers,
          latitude,
          longitude,
          phone: row.phone || null,
          email: row.email || null,
          is_active: row.is_active !== false
        });
      }
    }

    // If preview mode, return validation results
    if (preview) {
      return NextResponse.json({
        total: data.length,
        valid: validSchools.length,
        invalid: errors.length,
        schools: validSchools.slice(0, 10),
        errors: errors.slice(0, 10)
      });
    }

    // Check for duplicate codes in database
    const codes = validSchools.map(school => school.code);
    const existingSchools = await prisma.school.findMany({
      where: { code: { in: codes } },
      select: { code: true }
    });

    const existingCodes = new Set(existingSchools.map(school => school.code));
    const schoolsToCreate = validSchools.filter(school => !existingCodes.has(school.code));
    const duplicateCodes = validSchools.filter(school => existingCodes.has(school.code));

    if (duplicateCodes.length > 0) {
      errors.push(...duplicateCodes.map(school => ({
        row: 0,
        errors: ['School code already exists in database'],
        data: school
      })));
    }

    // Create schools in database
    const createdSchools = await prisma.$transaction(
      schoolsToCreate.map(school => 
        prisma.school.create({
          data: school,
          include: {
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdSchools.length} schools`,
      created: createdSchools.length,
      skipped: duplicateCodes.length,
      errors: errors,
      schools: createdSchools
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import schools' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  // Return template for bulk import
  const template = [
    {
      name: 'Sample Primary School',
      code: 'SPS001',
      province: 'Phnom Penh',
      district: 'Chamkar Mon',
      commune: 'Boeung Keng Kang',
      village: 'Boeung Keng Kang 1',
      school_type: 'Primary',
      level: 'Primary',
      total_students: 500,
      total_teachers: 25,
      latitude: 11.5564,
      longitude: 104.9282,
      phone: '023123456',
      email: 'info@sampleschool.edu.kh',
      is_active: true
    }
  ];

  return NextResponse.json({
    template,
    fields: [
      { key: 'name', required: true, type: 'string', description: 'School name' },
      { key: 'code', required: true, type: 'string', description: 'Unique school code' },
      { key: 'province', required: true, type: 'string', description: 'Province name or code' },
      { key: 'district', required: false, type: 'string', description: 'District name' },
      { key: 'commune', required: false, type: 'string', description: 'Commune name' },
      { key: 'village', required: false, type: 'string', description: 'Village name' },
      { key: 'school_type', required: false, type: 'string', description: 'Type of school' },
      { key: 'level', required: false, type: 'string', description: 'Education level' },
      { key: 'total_students', required: false, type: 'number', description: 'Total number of students' },
      { key: 'total_teachers', required: false, type: 'number', description: 'Total number of teachers' },
      { key: 'latitude', required: false, type: 'number', description: 'GPS latitude (-90 to 90)' },
      { key: 'longitude', required: false, type: 'number', description: 'GPS longitude (-180 to 180)' },
      { key: 'phone', required: false, type: 'string', description: 'Contact phone number' },
      { key: 'email', required: false, type: 'email', description: 'Contact email address' },
      { key: 'is_active', required: false, type: 'boolean', description: 'Active status (true/false)' }
    ]
  });
}