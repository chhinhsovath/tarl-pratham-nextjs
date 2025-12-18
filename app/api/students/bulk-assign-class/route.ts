import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/students/bulk-assign-class
 * Bulk assign students to a class (creates class if it doesn't exist)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins, coordinators, teachers, and mentors can assign classes
    if (!["admin", "coordinator", "teacher", "mentor"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { student_ids, grade, pilot_school_id, class_name } = body;

    if (!student_ids || !Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json(
        { error: "សូមជ្រើសរើសសិស្សយ៉ាងតិច ១នាក់" },
        { status: 400 }
      );
    }

    if (!grade) {
      return NextResponse.json(
        { error: "សូមជ្រើសរើសកម្រិតថ្នាក់" },
        { status: 400 }
      );
    }

    // Only allow Grade 4 and Grade 5
    if (![4, 5].includes(Number(grade))) {
      return NextResponse.json(
        { error: "កម្រិតថ្នាក់ត្រូវតែជាថ្នាក់ទី៤ ឬថ្នាក់ទី៥ប៉ុណ្ណោះ" },
        { status: 400 }
      );
    }

    if (!pilot_school_id) {
      return NextResponse.json(
        { error: "សូមជ្រើសរើសសាលារៀន" },
        { status: 400 }
      );
    }

    // Verify all students exist and user has access
    const students = await prisma.students.findMany({
      where: {
        id: { in: student_ids }
      },
      select: {
        id: true,
        name: true,
        pilot_school_id: true
      }
    });

    if (students.length !== student_ids.length) {
      return NextResponse.json(
        { error: "រកមិនឃើញសិស្សមួយចំនួន" },
        { status: 404 }
      );
    }

    // For mentors and teachers, verify they can only assign students from their school
    if (["mentor", "teacher"].includes(session.user.role)) {
      const unauthorizedStudents = students.filter(
        s => s.pilot_school_id !== session.user.pilot_school_id
      );

      if (unauthorizedStudents.length > 0) {
        return NextResponse.json(
          {
            error: "អ្នកមិនមានសិទ្ធិកែប្រែសិស្សពីសាលាផ្សេងបានទេ",
            unauthorized_students: unauthorizedStudents.map(s => s.name)
          },
          { status: 403 }
        );
      }
    }

    // Step 1: Find or create a School entry from pilot_school
    const pilotSchool = await prisma.pilotSchool.findUnique({
      where: { id: pilot_school_id }
    });

    if (!pilotSchool) {
      return NextResponse.json(
        { error: "រកមិនឃើញសាលារៀន" },
        { status: 404 }
      );
    }

    // Find or create corresponding School entry
    let school = await prisma.school.findFirst({
      where: {
        code: pilotSchool.school_code
      }
    });

    if (!school) {
      // Create school from pilot_school data
      school = await prisma.school.create({
        data: {
          name: pilotSchool.school_name,
          code: pilotSchool.school_code || `SCH${pilot_school_id}`,
          district: pilotSchool.district || '',
          province_id: null // Will be linked later if needed
        }
      });
    }

    // Step 2: Find or create the class
    const finalClassName = class_name || `ថ្នាក់ទី${grade}`;

    let schoolClass = await prisma.schoolClass.findFirst({
      where: {
        school_id: school.id,
        grade: grade,
        name: finalClassName
      }
    });

    if (!schoolClass) {
      // Create the class if it doesn't exist
      schoolClass = await prisma.schoolClass.create({
        data: {
          school_id: school.id,
          name: finalClassName,
          grade: grade,
          teacher_name: session.user.name,
          student_count: 0
        }
      });
    }

    // Bulk update students to assign them to the class
    await prisma.students.updateMany({
      where: {
        id: { in: student_ids }
      },
      data: {
        school_class_id: schoolClass.id
      }
    });

    // Update student count in the class
    const newStudentCount = await prisma.students.count({
      where: {
        school_class_id: schoolClass.id,
        is_active: true
      }
    });

    await prisma.schoolClass.update({
      where: { id: schoolClass.id },
      data: { student_count: newStudentCount }
    });

    return NextResponse.json({
      success: true,
      message: `បានកំណត់សិស្ស ${student_ids.length} នាក់ទៅថ្នាក់ទី${grade} ដោយជោគជ័យ`,
      class: {
        id: schoolClass.id,
        name: schoolClass.name,
        grade: schoolClass.grade
      },
      updated_count: student_ids.length
    });

  } catch (error: any) {
    console.error("Error in bulk class assignment:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការកំណត់ថ្នាក់",
        details: error.message
      },
      { status: 500 }
    );
  }
}
