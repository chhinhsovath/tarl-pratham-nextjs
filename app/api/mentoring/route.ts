import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getMentorSchoolIds } from "@/lib/mentorAssignments";

// Comprehensive validation schema for complete mentoring visit
const mentoringVisitSchema = z.object({
  // Basic Information
  pilot_school_id: z.number().min(1, "Pilot school is required"),
  teacher_id: z.number().optional(),
  school_id: z.number().optional(),
  mentor_id: z.union([z.number(), z.string()]).optional(),
  mentor_name: z.string().optional(),
  visit_date: z.string(),
  program_type: z.string().optional().default("TaRL"),
  grade_group: z.string().optional(),
  grades_observed: z.any().optional(),

  // Location
  province: z.string().optional(),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),

  // Class Session - FIXED: Use nullish to preserve null/undefined
  class_in_session: z.union([z.boolean(), z.number()]).optional().default(true).transform(val => val === 1 || val === true),
  class_not_in_session_reason: z.string().optional(),
  full_session_observed: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  class_started_on_time: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  late_start_reason: z.string().optional(),

  // Student Data
  total_students_enrolled: z.number().min(0).optional(),
  students_present: z.number().min(0).optional(),
  students_improved: z.number().min(0).optional(),
  classes_conducted_before_visit: z.number().min(0).optional(),
  students_improved_from_last_week: z.number().min(0).optional(),

  // Subject and Levels
  subject_observed: z.string().optional(),
  language_levels_observed: z.any().optional(),
  numeracy_levels_observed: z.any().optional(),

  // Classroom Organization - FIXED: Use nullish
  children_grouped_appropriately: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  students_fully_involved: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),

  // Teacher Planning - FIXED: Use nullish
  has_session_plan: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  followed_session_plan: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  no_session_plan_reason: z.string().optional(),
  no_follow_plan_reason: z.string().optional(),
  session_plan_appropriate: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  session_plan_notes: z.string().optional(),

  // Classroom Materials
  teaching_materials: z.any().optional(),
  materials_present: z.any().optional(),
  teacher_feedback: z.string().optional(),

  // Activities
  number_of_activities: z.number().min(1).max(5).optional(),

  // Activity 1 - FIXED: Use nullish
  activity1_name_language: z.string().optional(),
  activity1_name_numeracy: z.string().optional(),
  activity1_duration: z.number().min(0).optional(),
  activity1_clear_instructions: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity1_no_clear_instructions_reason: z.string().optional(),
  activity1_followed_process: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity1_not_followed_reason: z.string().optional(),
  activity1_type: z.string().optional(),
  activity1_demonstrated: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity1_students_practice: z.string().optional(),
  activity1_small_groups: z.string().optional(),
  activity1_individual: z.string().optional(),

  // Activity 2 - FIXED: Use nullish
  activity2_name_language: z.string().optional(),
  activity2_name_numeracy: z.string().optional(),
  activity2_duration: z.number().min(0).optional(),
  activity2_clear_instructions: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity2_no_clear_instructions_reason: z.string().optional(),
  activity2_followed_process: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity2_not_followed_reason: z.string().optional(),
  activity2_type: z.string().optional(),
  activity2_demonstrated: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity2_students_practice: z.string().optional(),
  activity2_small_groups: z.string().optional(),
  activity2_individual: z.string().optional(),

  // Activity 3 - FIXED: Use nullish
  activity3_name_language: z.string().optional(),
  activity3_name_numeracy: z.string().optional(),
  activity3_duration: z.number().min(0).optional(),
  activity3_clear_instructions: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity3_no_clear_instructions_reason: z.string().optional(),
  activity3_followed_process: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity3_not_followed_reason: z.string().optional(),
  activity3_demonstrated: z.union([z.boolean(), z.number()]).nullish().transform(val => val == null ? null : (val === 1 || val === true)),
  activity3_students_practice: z.string().optional(),
  activity3_small_groups: z.string().optional(),
  activity3_individual: z.string().optional(),

  // Feedback and Actions
  observation: z.string().optional(),
  score: z.number().min(0).max(100).optional(),
  follow_up_required: z.union([z.boolean(), z.number()]).optional().default(false).transform(val => val === 1 || val === true),
  feedback_for_teacher: z.string().optional(),
  recommendations: z.string().optional(),
  action_plan: z.string().optional(),
  follow_up_actions: z.string().optional(),

  // Photos
  photo: z.string().optional(),
  photos: z.array(z.string()).optional(),

  // Status
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),

  // Legacy fields
  level: z.string().optional(),
  purpose: z.string().optional(),
  activities: z.string().optional(),
  observations: z.string().optional(),
  participants_count: z.number().min(0).optional(),
  duration_minutes: z.number().min(0).optional(),
});

// Helper function to check permissions
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update", "delete"],
    mentor: ["view", "create", "update", "delete"],
    teacher: ["view"],
    viewer: ["view"]
  };

  return permissions[userRole as keyof typeof permissions]?.includes(action) || false;
}

// Helper function to check if user can access mentoring visit data
function canAccessVisit(userRole: string, userPilotSchoolId: number | null, visitPilotSchoolId: number | null, mentorId: number, userId: string): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true;
  }

  if (userRole === "mentor") {
    return mentorId === parseInt(userId) || (userPilotSchoolId && visitPilotSchoolId === userPilotSchoolId);
  }

  if (userRole === "teacher" && userPilotSchoolId) {
    return visitPilotSchoolId === userPilotSchoolId;
  }

  return false;
}

// GET /api/mentoring - List mentoring visits with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "view")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam && /^\d+$/.test(pageParam) ? Math.max(1, parseInt(pageParam)) : 1;

    const maxLimit = (session.user.role === 'admin' || session.user.role === 'coordinator') ? 100000 : 100;
    const limit = limitParam && /^\d+$/.test(limitParam) ? Math.max(1, Math.min(maxLimit, parseInt(limitParam))) : 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const pilot_school_id_param = searchParams.get("pilot_school_id") || "";
    const pilot_school_id = pilot_school_id_param && /^\d+$/.test(pilot_school_id_param) ? parseInt(pilot_school_id_param) : "";
    const mentor_id_param = searchParams.get("mentor_id") || "";
    const mentor_id = mentor_id_param && /^\d+$/.test(mentor_id_param) ? parseInt(mentor_id_param) : "";
    const date_from = searchParams.get("date_from") || "";
    const date_to = searchParams.get("date_to") || "";

    const skip = (page - 1) * limit;

    let where: any = {};

    if (search) {
      where.OR = [
        { purpose: { contains: search, mode: "insensitive" } },
        { activities: { contains: search, mode: "insensitive" } },
        { observations: { contains: search, mode: "insensitive" } },
        { recommendations: { contains: search, mode: "insensitive" } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (pilot_school_id && typeof pilot_school_id === 'number' && !isNaN(pilot_school_id)) {
      where.pilot_school_id = pilot_school_id;
    }

    if (mentor_id && typeof mentor_id === 'number' && !isNaN(mentor_id)) {
      where.mentor_id = mentor_id;
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

    if (session.user.role === "mentor") {
      if (session.user.pilot_school_id) {
        const hasMentorIdFilter = mentor_id && mentor_id !== "";

        if (hasMentorIdFilter) {
          const requestedMentorId = mentor_id;
          const currentUserId = parseInt(session.user.id.toString());
          if (!isNaN(currentUserId) && requestedMentorId === currentUserId) {
            // OK
          } else {
            const hasPilotSchoolFilter = pilot_school_id && typeof pilot_school_id === 'number' && !isNaN(pilot_school_id);
            where = {
              AND: [
                { mentor_id: requestedMentorId },
                { pilot_school_id: hasPilotSchoolFilter ? pilot_school_id : session.user.pilot_school_id }
              ]
            };
          }
        } else {
          const currentUserId = parseInt(session.user.id.toString());
          if (!isNaN(currentUserId)) {
            const mentorAccessConditions = [
              { mentor_id: currentUserId },
              { pilot_school_id: session.user.pilot_school_id }
            ];

            if (where.OR) {
              where.OR = [...mentorAccessConditions, ...where.OR];
            } else {
              where.OR = mentorAccessConditions;
            }
          }
        }
      } else {
        const currentUserId = parseInt(session.user.id.toString());
        if (!isNaN(currentUserId)) {
          where.mentor_id = currentUserId;
        }
      }
    } else if (session.user.role === "teacher") {
      if (session.user.pilot_school_id) {
        where.pilot_school_id = session.user.pilot_school_id;
      } else {
        where.id = -1;
      }
    }

    const [visits, total] = await Promise.all([
      prisma.mentoring_visits.findMany({
        where,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          },
          pilot_schools: {
            select: {
              id: true,
              school_name: true,
              school_code: true,
              province: true,
              district: true,
              cluster: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { visit_date: "desc" }
      }),
      prisma.mentoring_visits.count({ where })
    ]);

    return NextResponse.json({
      data: visits,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error("Error fetching mentoring visits:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការដំណើរការ",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

// POST /api/mentoring - Create new mentoring visit
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "create")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = mentoringVisitSchema.parse(body);

    if (session.user.role === "mentor") {
      const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
      if (mentorSchoolIds.length > 0 && !mentorSchoolIds.includes(validatedData.pilot_school_id)) {
        return NextResponse.json(
          { error: "អ្នកណែនាំអាចបង្កើតការចុះអប់រំបានត្រឹមតែសាលាដែលត្រូវបានចាត់តាំងប៉ុណ្ណោះ" },
          { status: 403 }
        );
      }
    }

    const pilotSchool = await prisma.pilot_schools.findUnique({
      where: { id: validatedData.pilot_school_id }
    });

    if (!pilotSchool) {
      return NextResponse.json(
        { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
        { status: 400 }
      );
    }

    // COMPLETE field mapping - NO fields lost!
    const dbData: any = {
      mentor_id: parseInt(session.user.id),
      pilot_school_id: validatedData.pilot_school_id,
      visit_date: new Date(validatedData.visit_date),
      updated_at: new Date(),

      // Direct mappings (form field = DB field)
      teacher_id: validatedData.teacher_id ?? null,
      school_id: validatedData.school_id ?? null,
      program_type: validatedData.program_type ?? null,
      grade_group: validatedData.grade_group ?? null,
      province: validatedData.province ?? null,
      district: validatedData.district ?? null,
      commune: validatedData.commune ?? null,
      village: validatedData.village ?? null,
      class_in_session: validatedData.class_in_session ?? true,
      class_not_in_session_reason: validatedData.class_not_in_session_reason ?? null,
      full_session_observed: validatedData.full_session_observed ?? null,
      class_started_on_time: validatedData.class_started_on_time ?? null,
      late_start_reason: validatedData.late_start_reason ?? null,
      total_students_enrolled: validatedData.total_students_enrolled ?? null,
      students_present: validatedData.students_present ?? null,
      students_improved: validatedData.students_improved ?? null,
      classes_conducted_before_visit: validatedData.classes_conducted_before_visit ?? null,
      students_improved_from_last_week: validatedData.students_improved_from_last_week ?? null,
      subject_observed: validatedData.subject_observed ?? null,
      number_of_activities: validatedData.number_of_activities ?? null,

      // Form → DB mapping (different field names)
      students_grouped_by_level: validatedData.children_grouped_appropriately ?? null,
      students_active_participation: validatedData.students_fully_involved ?? null,
      teacher_has_lesson_plan: validatedData.has_session_plan ?? null,
      followed_lesson_plan: validatedData.followed_session_plan ?? null,
      no_lesson_plan_reason: validatedData.no_session_plan_reason ?? null,
      not_followed_reason: validatedData.no_follow_plan_reason ?? null,
      plan_appropriate_for_levels: validatedData.session_plan_appropriate ?? null,
      lesson_plan_feedback: validatedData.session_plan_notes ?? null,

      // Activity 1 fields
      activity1_name_language: validatedData.activity1_name_language ?? null,
      activity1_name_numeracy: validatedData.activity1_name_numeracy ?? null,
      activity1_duration: validatedData.activity1_duration ?? null,
      activity1_clear_instructions: validatedData.activity1_clear_instructions ?? null,
      activity1_no_clear_instructions_reason: validatedData.activity1_no_clear_instructions_reason ?? null,
      activity1_followed_process: validatedData.activity1_followed_process ?? null,
      activity1_not_followed_reason: validatedData.activity1_not_followed_reason ?? null,
      activity1_type: validatedData.activity1_type ?? null,
      activity1_demonstrated: validatedData.activity1_demonstrated ?? null,
      activity1_students_practice: validatedData.activity1_students_practice ?? null,
      activity1_small_groups: validatedData.activity1_small_groups ?? null,
      activity1_individual: validatedData.activity1_individual ?? null,

      // Activity 2 fields
      activity2_name_language: validatedData.activity2_name_language ?? null,
      activity2_name_numeracy: validatedData.activity2_name_numeracy ?? null,
      activity2_duration: validatedData.activity2_duration ?? null,
      activity2_clear_instructions: validatedData.activity2_clear_instructions ?? null,
      activity2_no_clear_instructions_reason: validatedData.activity2_no_clear_instructions_reason ?? null,
      activity2_followed_process: validatedData.activity2_followed_process ?? null,
      activity2_not_followed_reason: validatedData.activity2_not_followed_reason ?? null,
      activity2_type: validatedData.activity2_type ?? null,
      activity2_demonstrated: validatedData.activity2_demonstrated ?? null,
      activity2_students_practice: validatedData.activity2_students_practice ?? null,
      activity2_small_groups: validatedData.activity2_small_groups ?? null,
      activity2_individual: validatedData.activity2_individual ?? null,

      // Activity 3 fields (followed_process NOT saved - DB doesn't have it)
      activity3_name_language: validatedData.activity3_name_language ?? null,
      activity3_name_numeracy: validatedData.activity3_name_numeracy ?? null,
      activity3_duration: validatedData.activity3_duration ?? null,
      activity3_clear_instructions: validatedData.activity3_clear_instructions ?? null,
      activity3_no_clear_instructions_reason: validatedData.activity3_no_clear_instructions_reason ?? null,
      activity3_demonstrated: validatedData.activity3_demonstrated ?? null,
      activity3_students_practice: validatedData.activity3_students_practice ?? null,
      activity3_small_groups: validatedData.activity3_small_groups ?? null,
      activity3_individual: validatedData.activity3_individual ?? null,

      // Feedback fields
      observation: validatedData.observation ?? null,
      teacher_feedback: validatedData.teacher_feedback ?? null,
      score: validatedData.score ?? null,
      follow_up_required: validatedData.follow_up_required ?? false,
      feedback_for_teacher: validatedData.feedback_for_teacher ?? null,
      recommendations: validatedData.recommendations ?? null,
      action_plan: validatedData.action_plan ?? null,
      follow_up_actions: validatedData.follow_up_actions ?? null,
      status: validatedData.status ?? "scheduled",

      // Array/JSON fields - stringify
      photos: validatedData.photos ? JSON.stringify(validatedData.photos) : null,
      grades_observed: validatedData.grades_observed ? JSON.stringify(validatedData.grades_observed) : null,
      language_levels_observed: validatedData.language_levels_observed ? JSON.stringify(validatedData.language_levels_observed) : null,
      numeracy_levels_observed: validatedData.numeracy_levels_observed ? JSON.stringify(validatedData.numeracy_levels_observed) : null,
      materials_present: validatedData.materials_present ? JSON.stringify(validatedData.materials_present) : null,
      teaching_materials: validatedData.teaching_materials ? JSON.stringify(validatedData.teaching_materials) : null,

      // Legacy fields
      level: validatedData.level ?? null,
      purpose: validatedData.purpose ?? null,
      activities: validatedData.activities ?? null,
      observations: validatedData.observations ?? null,
      participants_count: validatedData.participants_count ?? null,
      duration_minutes: validatedData.duration_minutes ?? null,
    };

    const visit = await prisma.mentoring_visits.create({
      data: dbData,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "បានបង្កើតការចុះអប់រំដោយជោគជ័យ",
      data: visit
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការដំណើរការ",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

// PUT /api/mentoring - Update mentoring visit
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "update")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ត្រូវការលេខសម្គាល់ការចុះអប់រំ" }, { status: 400 });
    }

    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "រកមិនឃើញការចុះអប់រំ" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const updateSchema = mentoringVisitSchema.partial();
    const validatedData = updateSchema.parse(updateData);

    if (session.user.role === "mentor" && session.user.pilot_school_id && validatedData.pilot_school_id) {
      if (validatedData.pilot_school_id !== session.user.pilot_school_id) {
        return NextResponse.json(
          { error: "អ្នកណែនាំអាចចាត់តាំងការចុះអប់រំបានត្រឹមតែសាលាដែលបានចាត់តាំងប៉ុណ្ណោះ" },
          { status: 403 }
        );
      }
    }

    if (validatedData.pilot_school_id) {
      const pilotSchool = await prisma.pilot_schools.findUnique({
        where: { id: validatedData.pilot_school_id }
      });

      if (!pilotSchool) {
        return NextResponse.json(
          { error: "លេខសម្គាល់សាលារៀនមិនត្រឹមត្រូវ" },
          { status: 400 }
        );
      }
    }

    // COMPLETE update mapping
    const updateDbData: any = {
      updated_at: new Date() // Always update timestamp
    };

    if (validatedData.visit_date !== undefined) updateDbData.visit_date = new Date(validatedData.visit_date);
    if (validatedData.pilot_school_id !== undefined) updateDbData.pilot_school_id = validatedData.pilot_school_id;
    if (validatedData.teacher_id !== undefined) updateDbData.teacher_id = validatedData.teacher_id;
    if (validatedData.school_id !== undefined) updateDbData.school_id = validatedData.school_id;
    if (validatedData.program_type !== undefined) updateDbData.program_type = validatedData.program_type;
    if (validatedData.grade_group !== undefined) updateDbData.grade_group = validatedData.grade_group;
    if (validatedData.province !== undefined) updateDbData.province = validatedData.province;
    if (validatedData.district !== undefined) updateDbData.district = validatedData.district;
    if (validatedData.commune !== undefined) updateDbData.commune = validatedData.commune;
    if (validatedData.village !== undefined) updateDbData.village = validatedData.village;
    if (validatedData.class_in_session !== undefined) updateDbData.class_in_session = validatedData.class_in_session;
    if (validatedData.class_not_in_session_reason !== undefined) updateDbData.class_not_in_session_reason = validatedData.class_not_in_session_reason;
    if (validatedData.full_session_observed !== undefined) updateDbData.full_session_observed = validatedData.full_session_observed;
    if (validatedData.class_started_on_time !== undefined) updateDbData.class_started_on_time = validatedData.class_started_on_time;
    if (validatedData.late_start_reason !== undefined) updateDbData.late_start_reason = validatedData.late_start_reason;
    if (validatedData.total_students_enrolled !== undefined) updateDbData.total_students_enrolled = validatedData.total_students_enrolled;
    if (validatedData.students_present !== undefined) updateDbData.students_present = validatedData.students_present;
    if (validatedData.students_improved !== undefined) updateDbData.students_improved = validatedData.students_improved;
    if (validatedData.classes_conducted_before_visit !== undefined) updateDbData.classes_conducted_before_visit = validatedData.classes_conducted_before_visit;
    if (validatedData.students_improved_from_last_week !== undefined) updateDbData.students_improved_from_last_week = validatedData.students_improved_from_last_week;
    if (validatedData.subject_observed !== undefined) updateDbData.subject_observed = validatedData.subject_observed;
    if (validatedData.number_of_activities !== undefined) updateDbData.number_of_activities = validatedData.number_of_activities;
    if (validatedData.observation !== undefined) updateDbData.observation = validatedData.observation;
    if (validatedData.teacher_feedback !== undefined) updateDbData.teacher_feedback = validatedData.teacher_feedback;
    if (validatedData.score !== undefined) updateDbData.score = validatedData.score;
    if (validatedData.follow_up_required !== undefined) updateDbData.follow_up_required = validatedData.follow_up_required;
    if (validatedData.feedback_for_teacher !== undefined) updateDbData.feedback_for_teacher = validatedData.feedback_for_teacher;
    if (validatedData.recommendations !== undefined) updateDbData.recommendations = validatedData.recommendations;
    if (validatedData.action_plan !== undefined) updateDbData.action_plan = validatedData.action_plan;
    if (validatedData.follow_up_actions !== undefined) updateDbData.follow_up_actions = validatedData.follow_up_actions;
    if (validatedData.status !== undefined) updateDbData.status = validatedData.status;

    // Form → DB mapped fields
    if (validatedData.children_grouped_appropriately !== undefined) updateDbData.students_grouped_by_level = validatedData.children_grouped_appropriately;
    if (validatedData.students_fully_involved !== undefined) updateDbData.students_active_participation = validatedData.students_fully_involved;
    if (validatedData.has_session_plan !== undefined) updateDbData.teacher_has_lesson_plan = validatedData.has_session_plan;
    if (validatedData.followed_session_plan !== undefined) updateDbData.followed_lesson_plan = validatedData.followed_session_plan;
    if (validatedData.no_session_plan_reason !== undefined) updateDbData.no_lesson_plan_reason = validatedData.no_session_plan_reason;
    if (validatedData.no_follow_plan_reason !== undefined) updateDbData.not_followed_reason = validatedData.no_follow_plan_reason;
    if (validatedData.session_plan_appropriate !== undefined) updateDbData.plan_appropriate_for_levels = validatedData.session_plan_appropriate;
    if (validatedData.session_plan_notes !== undefined) updateDbData.lesson_plan_feedback = validatedData.session_plan_notes;

    // Activity fields - all of them
    if (validatedData.activity1_name_language !== undefined) updateDbData.activity1_name_language = validatedData.activity1_name_language;
    if (validatedData.activity1_name_numeracy !== undefined) updateDbData.activity1_name_numeracy = validatedData.activity1_name_numeracy;
    if (validatedData.activity1_duration !== undefined) updateDbData.activity1_duration = validatedData.activity1_duration;
    if (validatedData.activity1_clear_instructions !== undefined) updateDbData.activity1_clear_instructions = validatedData.activity1_clear_instructions;
    if (validatedData.activity1_no_clear_instructions_reason !== undefined) updateDbData.activity1_no_clear_instructions_reason = validatedData.activity1_no_clear_instructions_reason;
    if (validatedData.activity1_followed_process !== undefined) updateDbData.activity1_followed_process = validatedData.activity1_followed_process;
    if (validatedData.activity1_not_followed_reason !== undefined) updateDbData.activity1_not_followed_reason = validatedData.activity1_not_followed_reason;
    if (validatedData.activity1_type !== undefined) updateDbData.activity1_type = validatedData.activity1_type;
    if (validatedData.activity1_demonstrated !== undefined) updateDbData.activity1_demonstrated = validatedData.activity1_demonstrated;
    if (validatedData.activity1_students_practice !== undefined) updateDbData.activity1_students_practice = validatedData.activity1_students_practice;
    if (validatedData.activity1_small_groups !== undefined) updateDbData.activity1_small_groups = validatedData.activity1_small_groups;
    if (validatedData.activity1_individual !== undefined) updateDbData.activity1_individual = validatedData.activity1_individual;

    if (validatedData.activity2_name_language !== undefined) updateDbData.activity2_name_language = validatedData.activity2_name_language;
    if (validatedData.activity2_name_numeracy !== undefined) updateDbData.activity2_name_numeracy = validatedData.activity2_name_numeracy;
    if (validatedData.activity2_duration !== undefined) updateDbData.activity2_duration = validatedData.activity2_duration;
    if (validatedData.activity2_clear_instructions !== undefined) updateDbData.activity2_clear_instructions = validatedData.activity2_clear_instructions;
    if (validatedData.activity2_no_clear_instructions_reason !== undefined) updateDbData.activity2_no_clear_instructions_reason = validatedData.activity2_no_clear_instructions_reason;
    if (validatedData.activity2_followed_process !== undefined) updateDbData.activity2_followed_process = validatedData.activity2_followed_process;
    if (validatedData.activity2_not_followed_reason !== undefined) updateDbData.activity2_not_followed_reason = validatedData.activity2_not_followed_reason;
    if (validatedData.activity2_type !== undefined) updateDbData.activity2_type = validatedData.activity2_type;
    if (validatedData.activity2_demonstrated !== undefined) updateDbData.activity2_demonstrated = validatedData.activity2_demonstrated;
    if (validatedData.activity2_students_practice !== undefined) updateDbData.activity2_students_practice = validatedData.activity2_students_practice;
    if (validatedData.activity2_small_groups !== undefined) updateDbData.activity2_small_groups = validatedData.activity2_small_groups;
    if (validatedData.activity2_individual !== undefined) updateDbData.activity2_individual = validatedData.activity2_individual;

    if (validatedData.activity3_name_language !== undefined) updateDbData.activity3_name_language = validatedData.activity3_name_language;
    if (validatedData.activity3_name_numeracy !== undefined) updateDbData.activity3_name_numeracy = validatedData.activity3_name_numeracy;
    if (validatedData.activity3_duration !== undefined) updateDbData.activity3_duration = validatedData.activity3_duration;
    if (validatedData.activity3_clear_instructions !== undefined) updateDbData.activity3_clear_instructions = validatedData.activity3_clear_instructions;
    if (validatedData.activity3_no_clear_instructions_reason !== undefined) updateDbData.activity3_no_clear_instructions_reason = validatedData.activity3_no_clear_instructions_reason;
    if (validatedData.activity3_demonstrated !== undefined) updateDbData.activity3_demonstrated = validatedData.activity3_demonstrated;
    if (validatedData.activity3_students_practice !== undefined) updateDbData.activity3_students_practice = validatedData.activity3_students_practice;
    if (validatedData.activity3_small_groups !== undefined) updateDbData.activity3_small_groups = validatedData.activity3_small_groups;
    if (validatedData.activity3_individual !== undefined) updateDbData.activity3_individual = validatedData.activity3_individual;

    // JSON fields
    if (validatedData.photos !== undefined) updateDbData.photos = validatedData.photos ? JSON.stringify(validatedData.photos) : null;
    if (validatedData.grades_observed !== undefined) updateDbData.grades_observed = validatedData.grades_observed ? JSON.stringify(validatedData.grades_observed) : null;
    if (validatedData.language_levels_observed !== undefined) updateDbData.language_levels_observed = validatedData.language_levels_observed ? JSON.stringify(validatedData.language_levels_observed) : null;
    if (validatedData.numeracy_levels_observed !== undefined) updateDbData.numeracy_levels_observed = validatedData.numeracy_levels_observed ? JSON.stringify(validatedData.numeracy_levels_observed) : null;
    if (validatedData.materials_present !== undefined) updateDbData.materials_present = validatedData.materials_present ? JSON.stringify(validatedData.materials_present) : null;
    if (validatedData.teaching_materials !== undefined) updateDbData.teaching_materials = validatedData.teaching_materials ? JSON.stringify(validatedData.teaching_materials) : null;

    // Legacy
    if (validatedData.level !== undefined) updateDbData.level = validatedData.level;
    if (validatedData.purpose !== undefined) updateDbData.purpose = validatedData.purpose;
    if (validatedData.activities !== undefined) updateDbData.activities = validatedData.activities;
    if (validatedData.observations !== undefined) updateDbData.observations = validatedData.observations;
    if (validatedData.participants_count !== undefined) updateDbData.participants_count = validatedData.participants_count;
    if (validatedData.duration_minutes !== undefined) updateDbData.duration_minutes = validatedData.duration_minutes;

    const visit = await prisma.mentoring_visits.update({
      where: { id: parseInt(id) },
      data: updateDbData,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        pilot_schools: {
          select: {
            id: true,
            school_name: true,
            school_code: true,
            province: true,
            district: true,
            cluster: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Mentoring visit updated successfully",
      data: visit
    });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "ទិន្នន័យមិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការដំណើរការ",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}

// DELETE /api/mentoring - Delete mentoring visit
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    if (!hasPermission(session.user.role, "delete")) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ត្រូវការលេខសម្គាល់ការចុះអប់រំ" }, { status: 400 });
    }

    const existingVisit = await prisma.mentoring_visits.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingVisit) {
      return NextResponse.json({ error: "រកមិនឃើញការចុះអប់រំ" }, { status: 404 });
    }

    if (!canAccessVisit(session.user.role, session.user.pilot_school_id, existingVisit.pilot_school_id, existingVisit.mentor_id, session.user.id)) {
      return NextResponse.json({ error: "អ្នកមិនមានសិទ្ធិចូលប្រើប្រាស់មុខងារនេះទេ" }, { status: 403 });
    }

    await prisma.mentoring_visits.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({
      message: "Mentoring visit deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting mentoring visit:", error);
    return NextResponse.json(
      {
        error: "មានបញ្ហាក្នុងការដំណើរការ",
        message: error.message || "Unknown error",
        code: error.code || "UNKNOWN",
        meta: error.meta || {}
      },
      { status: 500 }
    );
  }
}
