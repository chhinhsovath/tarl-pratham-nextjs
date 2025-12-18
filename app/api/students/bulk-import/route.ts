import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const preview = formData.get('preview') === 'true';
    const addedByHeader = request.headers.get('user-id');
    const userRoleHeader = request.headers.get('user-role');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const addedById = addedByHeader ? parseInt(addedByHeader) : null;
    const userRole = userRoleHeader || 'teacher';

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found in file' }, { status: 400 });
    }

    // Get classes and pilot schools for validation
    const [classes, pilotSchools] = await Promise.all([
      prisma.schoolClass.findMany({
        select: { id: true, name: true, school: { select: { name: true } } }
      }),
      prisma.pilotSchool.findMany({
        select: { id: true, name: true, code: true }
      })
    ]);

    const classMap = new Map();
    classes.forEach(c => {
      classMap.set(`${c.school.name}-${c.name}`.toLowerCase(), c.id);
      classMap.set(c.name.toLowerCase(), c.id);
    });

    const pilotSchoolMap = new Map();
    pilotSchools.forEach(p => {
      pilotSchoolMap.set(p.name.toLowerCase(), p.id);
      pilotSchoolMap.set(p.code.toLowerCase(), p.id);
    });

    // Validate and prepare data
    const validStudents = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowErrors = [];

      // Validate required fields
      if (!row.name || typeof row.name !== 'string') {
        rowErrors.push('Student name is required');
      }

      // Validate optional fields
      const age = row.age ? parseInt(row.age) : null;
      if (row.age && (isNaN(age) || age < 5 || age > 20)) {
        rowErrors.push('Age must be between 5 and 20');
      }

      if (row.gender && !['Male', 'Female'].includes(row.gender)) {
        rowErrors.push('Gender must be Male or Female');
      }

      // Validate class/school assignment
      let school_class_id = null;
      let pilot_school_id = null;

      if (row.class) {
        const classKey = row.school_class ? 
          `${row.school_class}-${row.class}`.toLowerCase() : 
          row.class.toLowerCase();
        school_class_id = classMap.get(classKey);
        if (!school_class_id) {
          rowErrors.push('Invalid class assignment');
        }
      }

      if (row.pilot_school) {
        const pilotSchoolKey = row.pilot_schools.toString().toLowerCase();
        pilot_school_id = pilotSchoolMap.get(pilotSchoolKey);
        if (!pilot_school_id) {
          rowErrors.push('Invalid pilot school');
        }
      }

      if (rowErrors.length > 0) {
        errors.push({
          row: i + 2,
          errors: rowErrors,
          data: row
        });
      } else {
        validStudents.push({
          name: row.name.trim(),
          age,
          gender: row.gender || null,
          guardian_name: row.guardian_name || null,
          guardian_phone: row.guardian_phone || null,
          address: row.address || null,
          school_class_id,
          pilot_school_id,
          added_by_id: addedById,
          is_temporary: userRole === 'mentor',
          added_by_mentor: userRole === 'mentor',
          mentor_created_at: userRole === 'mentor' ? new Date() : null
        });
      }
    }

    // If preview mode, return validation results
    if (preview) {
      return NextResponse.json({
        total: data.length,
        valid: validStudents.length,
        invalid: errors.length,
        students: validStudents.slice(0, 10),
        errors: errors.slice(0, 10)
      });
    }

    // Create students in database
    const createdStudents = await prisma.$transaction(
      validStudents.map(student => 
        prisma.students.create({
          data: student,
          include: {
            school_class: {
              include: {
                school: {
                  select: { name: true }
                }
              }
            },
            pilot_schools: {
              select: { name: true }
            }
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${createdStudents.length} students`,
      created: createdStudents.length,
      errors: errors,
      students: createdStudents,
      isTemporary: userRole === 'mentor'
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json(
      { error: 'Failed to import students' },
      { status: 500 }
    );  }
}

export async function GET() {
  // Return template for bulk import
  const template = [
    {
      name: 'Sok Dara',
      age: 8,
      gender: 'Female',
      guardian_name: 'Mrs. Sok Mala',
      guardian_phone: '012345678',
      address: 'Phnom Penh',
      class: 'Grade 2A',
      school_class: 'Sample Primary School',
      pilot_school: ''
    }
  ];

  return NextResponse.json({
    template,
    fields: [
      { key: 'name', required: true, type: 'string', description: 'Student full name' },
      { key: 'age', required: false, type: 'number', description: 'Age (5-20)' },
      { key: 'gender', required: false, type: 'enum', options: ['Male', 'Female'], description: 'Student gender' },
      { key: 'guardian_name', required: false, type: 'string', description: 'Guardian/parent name' },
      { key: 'guardian_phone', required: false, type: 'string', description: 'Guardian phone number' },
      { key: 'address', required: false, type: 'string', description: 'Student address' },
      { key: 'class', required: false, type: 'string', description: 'Class name' },
      { key: 'school_class', required: false, type: 'string', description: 'School name (if class specified)' },
      { key: 'pilot_school', required: false, type: 'string', description: 'Pilot school name or code' }
    ]
  });
}