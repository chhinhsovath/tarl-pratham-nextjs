import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/rbac/dashboard
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access RBAC dashboard
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get statistics for each role with proper data isolation
    // BATCH 1: User counts (4 queries)
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      coordinatorUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { is_active: true } }),
      prisma.user.count({ where: { role: "admin" } }),
      prisma.user.count({ where: { role: "coordinator" } })
    ]);

    // BATCH 2: More user counts (3 queries)
    const [
      mentorUsers,
      teacherUsers,
      viewerUsers
    ] = await Promise.all([
      prisma.user.count({ where: { role: "mentor" } }),
      prisma.user.count({ where: { role: "teacher" } }),
      prisma.user.count({ where: { role: "viewer" } })
    ]);

    // BATCH 3: System resources (4 queries)
    const [
      totalSchools,
      totalStudents,
      totalAssessments,
      totalMentoringVisits
    ] = await Promise.all([
      prisma.pilotSchool.count(),
      prisma.student.count(),
      prisma.assessment.count(),
      prisma.mentoringVisit.count()
    ]);

    const statistics = {
      total_users: totalUsers,
      active_users: activeUsers,
      roles: {
        admin: adminUsers,
        coordinator: coordinatorUsers,
        mentor: mentorUsers,
        teacher: teacherUsers,
        viewer: viewerUsers,
      },
      data_access: {
        schools: totalSchools,
        students: totalStudents,
        assessments: totalAssessments,
        mentoring_visits: totalMentoringVisits,
      }
    };

    // Get recent user activities
    const recentActivities = await prisma.user.findMany({
      where: { is_active: true },
      include: {
        pilot_school: {
          select: {
            id: true,
            school_name: true
          }
        },
        user_pilot_school_assignments: {
          take: 10, // Limit nested assignments to prevent unbounded query
          include: {
            pilot_school: {
              select: {
                id: true,
                school_name: true
              }
            }
          }
        }
      },
      orderBy: { updated_at: 'desc' },
      take: 20
    });

    // Get role permissions matrix
    const rolePermissions = {
      admin: {
        users: ['create', 'read', 'update', 'delete'],
        schools: ['create', 'read', 'update', 'delete'],
        students: ['create', 'read', 'update', 'delete'],
        assessments: ['create', 'read', 'update', 'delete'],
        mentoring_visits: ['create', 'read', 'update', 'delete'],
        reports: ['view_all'],
        rbac: ['manage'],
      },
      coordinator: {
        users: ['read'],
        schools: ['read', 'update'],
        students: ['create', 'read', 'update'],
        assessments: ['create', 'read', 'update'],
        mentoring_visits: ['read'],
        reports: ['view_all'],
        rbac: [],
      },
      mentor: {
        users: ['read_assigned'],
        schools: ['read_assigned'],
        students: ['read_assigned', 'update_assigned'],
        assessments: ['read_assigned'],
        mentoring_visits: ['create', 'read_assigned', 'update_own'],
        reports: ['view_assigned'],
        rbac: [],
      },
      teacher: {
        users: ['read_own'],
        schools: ['read_own'],
        students: ['read_own', 'update_own'],
        assessments: ['create_own', 'read_own'],
        mentoring_visits: ['read_own'],
        reports: ['view_own'],
        rbac: [],
      },
      viewer: {
        users: [],
        schools: ['read'],
        students: ['read'],
        assessments: ['read'],
        mentoring_visits: ['read'],
        reports: ['view'],
        rbac: [],
      },
    };

    return NextResponse.json({
      statistics,
      recentActivities,
      rolePermissions
    });

  } catch (error) {
    console.error("Error fetching RBAC dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}