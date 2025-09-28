import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete", "export"],
    coordinator: ["view", "create", "update", "delete", "export"],
    mentor: ["view", "create", "update", "delete", "export"],
    teacher: ["view"],
    viewer: ["view"]
  };
  
  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// GET /api/mentoring/export - Export mentoring visits to CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "export")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const pilot_school_id = searchParams.get("pilot_school_id") || "";
    const mentor_id = searchParams.get("mentor_id") || "";
    const date_from = searchParams.get("date_from") || "";
    const date_to = searchParams.get("date_to") || "";
    
    // Build where clause
    const where: any = {};
    
    if (pilot_school_id) {
      where.pilot_school_id = parseInt(pilot_school_id);
    }
    
    if (mentor_id) {
      where.mentor_id = parseInt(mentor_id);
    }
    
    if (date_from) {
      where.visit_date = {
        ...where.visit_date,
        gte: new Date(date_from)
      };
    }
    
    if (date_to) {
      where.visit_date = {
        ...where.visit_date,
        lte: new Date(date_to)
      };
    }

    // Apply access restrictions for mentors and teachers
    if (session.user.role === "mentor") {
      if (session.user.pilot_school_id) {
        where.OR = [
          { mentor_id: parseInt(session.user.id) },
          { pilot_school_id: session.user.pilot_school_id }
        ];
      } else {
        where.mentor_id = parseInt(session.user.id);
      }
    } else if (session.user.role === "teacher") {
      if (session.user.pilot_school_id) {
        where.pilot_school_id = session.user.pilot_school_id;
      } else {
        // If teacher has no pilot school, they can't see any visits
        where.id = -1;
      }
    }

    const visits = await prisma.mentoringVisit.findMany({
      where,
      include: {
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_school: {
          select: {
            id: true,
            name: true,
            code: true,
            province: {
              select: {
                name_english: true,
                name_khmer: true
              }
            }
          }
        }
      },
      orderBy: { visit_date: "desc" }
    });

    if (format === "json") {
      return NextResponse.json({
        data: visits,
        total: visits.length,
        exported_at: new Date().toISOString(),
        exported_by: session.user.name || session.user.email
      });
    }

    // Generate CSV content
    const csvHeaders = [
      "ID",
      "កាលបរិច្ចេទ",
      "ឈ្មោះសាលា",
      "កូដសាលា", 
      "ឈ្មោះអ្នកណែនាំ",
      "ឈ្មោះគ្រូ",
      "ថ្នាក់រៀនដំណើរការ",
      "មុខវិជ្ជា",
      "សិស្សចុះឈ្មោះ",
      "សិស្សមកថ្នាក់",
      "សិស្សប្រសើរឡើង",
      "សកម្មភាពចំនួន",
      "ពិន្ទុ",
      "ត្រូវការតាមដាន",
      "ស្ថានភាព"
    ];

    const csvRows = visits.map(visit => [
      visit.id,
      visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('km-KH') : '',
      visit.pilot_school?.name || '',
      visit.pilot_school?.code || '',
      visit.mentor?.name || '',
      visit.teacher?.name || '',
      visit.class_in_session ? 'បាទ/ចាស' : 'ទេ',
      visit.subject_observed || '',
      visit.total_students_enrolled || 0,
      visit.students_present || 0,
      visit.students_improved || 0,
      visit.number_of_activities || 0,
      visit.score || '',
      visit.follow_up_required ? 'បាទ/ចាស' : 'ទេ',
      visit.status === 'completed' ? 'បានបញ្ចប់' : 
      visit.status === 'cancelled' ? 'បានបោះបង់' : 'កំពុងដំណើរការ'
    ]);

    // Convert to CSV format
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && cell.includes(',') 
            ? `"${cell.replace(/"/g, '""')}"` 
            : cell
        ).join(',')
      )
    ].join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    return new Response(csvWithBom, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mentoring_visits_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error("Error exporting mentoring visits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}