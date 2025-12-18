import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/reports/attendance - Get attendance report
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pilot_school_id = searchParams.get("pilot_school_id");
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");

    // Build base filters for role-based access
    const baseFilters: any = {};

    if (session.user.role === "mentor" || session.user.role === "teacher") {
      if (session.user.pilot_school_id) {
        baseFilters.pilot_school_id = session.user.pilot_school_id;
      }
    }

    const whereStudent: any = { is_active: true, ...baseFilters };

    if (pilot_school_id) {
      whereStudent.pilot_school_id = parseInt(pilot_school_id);
    }

    // Get students with their attendance records
    const students = await prisma.students.findMany({
      where: whereStudent,
      include: {
        pilot_schools: { select: { school_name: true } },
        school_class: {
          include: {
            school: { select: { name: true } }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Build attendance data from real students
    const attendanceData = students.map(student => {
      return {
        id: student.id,
        student_id: student.student_id,
        student_name: student.name,
        school_name: student.pilot_schools?.school_name || student.school_class?.school?.name || '-',
        class_name: '-',
        grade: student.grade || 0,
        gender: student.gender || '-',
        // Attendance stats (currently 0 as no attendance records exist)
        total_days: 0,
        days_present: 0,
        days_absent: 0,
        days_late: 0,
        attendance_rate: 0,
        consecutive_absences: 0,
        last_absence_date: null,
        attendance_trend: 'stable',
        status: student.is_active ? 'active' : 'inactive',
        recent_attendance: []
      };
    });

    // Calculate summary statistics
    const summary = {
      total_students: students.length,
      active_students: students.filter(s => s.is_active).length,
      male_students: students.filter(s => s.gender === 'male').length,
      female_students: students.filter(s => s.gender === 'female').length,
      average_attendance_rate: 0,
      students_with_perfect_attendance: 0,
      students_with_concerning_attendance: 0
    };

    return NextResponse.json({
      data: {
        attendance_records: attendanceData,
        summary: summary,
        message: 'បច្ចុប្បន្នមិនទាន់មានទិន្នន័យវត្តមាន។ ទិន្នន័យនេះបង្ហាញតែសិស្សសកម្ម។',
        has_data: false
      }
    });

  } catch (error: any) {
    console.error("Error generating attendance report:", error);

    return NextResponse.json(
      {
        error: 'មានបញ្ហាក្នុងការបង្កើតរបាយការណ៍វត្តមាន: ' + (error.message || 'Unknown error'),
        data: null,
        has_data: false
      },
      { status: 500 }
    );
  }
}
