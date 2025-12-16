# User-School Assignment Patterns

## Overview

This document explains how mentors and teachers are linked to pilot schools in the TaRL Pratham system.

**Last Updated:** November 22, 2025
**Database:** PostgreSQL 16.10 @ 157.10.73.52:5432

---

## Table of Contents

1. [Architecture Summary](#architecture-summary)
2. [Mentor Assignment Pattern](#mentor-assignment-pattern)
3. [Teacher Assignment Pattern](#teacher-assignment-pattern)
4. [Data Flow](#data-flow)
5. [Code Implementation](#code-implementation)
6. [Migration History](#migration-history)
7. [Common Queries](#common-queries)

---

## Architecture Summary

### The Big Picture

```
Mentors ──► MentorSchoolAssignment ──► Multiple Schools ✅
   │                                         │
   └──────► (fallback: User.pilot_school_id) │
                                              │
Teachers ──► User.pilot_school_id ──► ONE School ✅
   │
   └──────► Students ──► Assessments ──► Same School
```

### Design Decisions

| Role | Assignment Method | Why |
|------|------------------|-----|
| **Mentor** | `MentorSchoolAssignment` table (many-to-many) | Mentors oversee multiple schools, need flexible multi-school access |
| **Teacher** | `User.pilot_school_id` (single FK) | Teachers work at ONE school, simple direct relationship |

---

## Mentor Assignment Pattern

### Database Structure

**Table:** `mentor_school_assignments`

```sql
CREATE TABLE mentor_school_assignments (
  id              SERIAL PRIMARY KEY,
  mentor_id       INT NOT NULL REFERENCES users(id),
  pilot_school_id INT NOT NULL REFERENCES pilot_schools(id),
  subject         VARCHAR NOT NULL,  -- 'Language' or 'Math'
  assigned_by_id  INT REFERENCES users(id),
  assigned_date   TIMESTAMP DEFAULT NOW(),
  is_active       BOOLEAN DEFAULT true,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),

  UNIQUE(mentor_id, pilot_school_id, subject)
);
```

### How It Works

**1. Hybrid Two-Table System:**

```typescript
// Primary: Check assignment table first
const assignments = await prisma.mentorSchoolAssignment.findMany({
  where: { mentor_id: mentorId, is_active: true }
});

// Fallback: If no assignments, use User.pilot_school_id
if (assignments.length === 0 && user.pilot_school_id) {
  return [{
    pilot_school_id: user.pilot_school_id,
    subject: 'Language', // Both subjects
    subject: 'Math'
  }];
}
```

**2. Auto-Creation on Profile Setup:**

When a mentor completes their profile (`/api/profile/update`), the system automatically creates assignment records:

```typescript
// app/api/profile/update/route.ts:141-185
if (isMentor && pilot_school_id) {
  const subjects = normalizedSubject === 'both'
    ? ['Language', 'Math']
    : [normalizedSubject];

  for (const subject of subjects) {
    await prisma.mentorSchoolAssignment.create({
      data: {
        mentor_id: userId,
        pilot_school_id: parseInt(pilot_school_id),
        subject: subject,
        assigned_by_id: userId, // Self-assigned
        notes: 'Auto-created from profile setup'
      }
    });
  }
}
```

**3. Access Control:**

```typescript
// lib/mentorAssignments.ts
export async function getMentorSchoolIds(mentorId: number): Promise<number[]> {
  const assignments = await getMentorAssignedSchools(mentorId);
  return [...new Set(assignments.map(a => a.pilot_school_id))];
}

// Used in APIs to filter data
// app/api/students/route.ts:181-184
if (session.user.role === "mentor") {
  const mentorSchoolIds = await getMentorSchoolIds(parseInt(session.user.id));
  where.AND.push({ pilot_school_id: { in: mentorSchoolIds } });
}
```

### Current State (Nov 22, 2025)

```sql
-- 33 active mentor assignments
SELECT COUNT(*) FROM mentor_school_assignments WHERE is_active = true;
-- Result: 33

-- Some mentors have multiple schools
SELECT mentor_id, COUNT(DISTINCT pilot_school_id) as school_count
FROM mentor_school_assignments
WHERE is_active = true
GROUP BY mentor_id
HAVING COUNT(DISTINCT pilot_school_id) > 1;
```

---

## Teacher Assignment Pattern

### Database Structure

**Field:** `users.pilot_school_id` (Foreign Key to `pilot_schools.id`)

```sql
-- teachers table uses ONLY this field:
ALTER TABLE users
  ADD COLUMN pilot_school_id INT REFERENCES pilot_schools(id);
```

### How It Works

**1. Direct Foreign Key:**

```typescript
// Teachers have ONE school via direct FK
const teacher = await prisma.user.findUnique({
  where: { id: teacherId },
  include: { pilot_school: true }
});

console.log(teacher.pilot_school_id); // Single school ID
```

**2. Auto-Inheritance:**

When teachers create students or assessments, the school is automatically inherited:

```typescript
// app/api/assessments/route.ts:329-342
if (session.user.role === "teacher") {
  if (!session.user.pilot_school_id) {
    return NextResponse.json({
      error: "Teacher must be assigned to a pilot school"
    });
  }

  // Auto-set from teacher's profile
  validatedData.pilot_school_id = session.user.pilot_school_id;
}
```

**3. Access Control:**

```typescript
// app/api/students/route.ts:192-202
if (session.user.role === "teacher") {
  if (session.user.pilot_school_id) {
    where.AND.push({
      pilot_school_id: session.user.pilot_school_id
    });
  } else {
    // No school = no access
    where.AND.push({ id: -1 });
  }
}
```

### Current State (Nov 22, 2025)

```sql
-- 65 out of 66 teachers have school assignments
SELECT
  COUNT(*) FILTER (WHERE pilot_school_id IS NOT NULL) as with_school,
  COUNT(*) FILTER (WHERE pilot_school_id IS NULL) as without_school,
  COUNT(*) as total
FROM users
WHERE role = 'teacher';

-- Result:
-- with_school: 65
-- without_school: 1 (new user, not completed profile)
-- total: 66
```

---

## Data Flow

### Workflow: Teacher Creates Assessment

```
1. Teacher logs in → Session contains pilot_school_id
                               ↓
2. Teacher creates student → Student.pilot_school_id = Teacher.pilot_school_id
                               ↓
3. Teacher assesses student → Assessment.pilot_school_id = Teacher.pilot_school_id
                               ↓
4. All linked to same school ✅
```

### Workflow: Mentor Verifies Assessment

```
1. Mentor logs in → Load assigned schools via MentorSchoolAssignment
                               ↓
2. Mentor views assessments → Filter: pilot_school_id IN (assigned_schools)
                               ↓
3. Mentor verifies assessment → Check: assessment.pilot_school_id in assigned_schools
                               ↓
4. Scope enforced ✅
```

### Workflow: Mentor Observes Teacher

```
1. Mentor creates visit → MentoringVisit.pilot_school_id must match assignment
                               ↓
2. System validates → mentor_school_assignments.pilot_school_id = visit.pilot_school_id
                               ↓
3. Observation recorded ✅
```

---

## Code Implementation

### Key Files

| File | Purpose |
|------|---------|
| `lib/mentorAssignments.ts` | Core mentor assignment logic, caching, access helpers |
| `app/api/profile/update/route.ts` | Auto-creates assignments on profile setup |
| `app/api/students/route.ts` | Access control for student data |
| `app/api/assessments/route.ts` | Auto-sets school for assessments |
| `app/api/assessments/verify/route.ts` | Mentor verification scope enforcement |

### Critical Functions

**1. Get Mentor's Assigned Schools:**

```typescript
// lib/mentorAssignments.ts:62-76
import { getMentorAssignedSchools } from '@/lib/mentorAssignments';

const schools = await getMentorAssignedSchools(
  mentorId,
  'Language', // Optional: filter by subject
  true,       // Only active assignments
  false       // Use cache (set true for sensitive operations)
);

// Returns: [{ pilot_school_id: 1, subject: 'Language', school_name: '...' }]
```

**2. Get Mentor's School IDs:**

```typescript
// lib/mentorAssignments.ts:169-176
import { getMentorSchoolIds } from '@/lib/mentorAssignments';

const schoolIds = await getMentorSchoolIds(mentorId, 'Math');
// Returns: [1, 3, 5, 7]  - Array of school IDs
```

**3. Check Mentor Access:**

```typescript
// lib/mentorAssignments.ts:204-211
import { canMentorAccessSchool } from '@/lib/mentorAssignments';

const hasAccess = await canMentorAccessSchool(
  mentorId,
  schoolId,
  'Language' // Optional: also check subject
);
// Returns: true/false
```

**4. Build Prisma Where Clause:**

```typescript
// lib/mentorAssignments.ts:249-261
import { getMentorSchoolsWhereClause } from '@/lib/mentorAssignments';

const whereClause = await getMentorSchoolsWhereClause(mentorId);
// Returns: { pilot_school_id: { in: [1, 3, 5] } }

// Use in queries:
const students = await prisma.student.findMany({
  where: {
    ...whereClause,
    is_active: true
  }
});
```

---

## Migration History

### November 22, 2025: Table Cleanup

**Problem Found:**
- `teacher_school_assignments` table existed in schema
- **NEVER used** in any code file (0 references)
- Contained 59 rows of stale data
- 4 teachers had assignments in table but NOT in `User.pilot_school_id`
- These 4 teachers effectively had NO school access in the app

**Actions Taken:**

1. **Data Sync** (`migrations/20251122_sync_teacher_assignments_before_drop.sql`)
   - Synced 4 teachers' assignments from table to `User.pilot_school_id`
   - Restored school access for affected teachers:
     - Ms. Seun Sophary (ID: 83)
     - Ms. Kheav Sreyoun (ID: 31)
     - Ms. Nov Pelim (ID: 78)
     - Moy Sodara (ID: 55)

2. **Table Removal** (`migrations/20251122_remove_unused_teacher_assignments.sql`)
   - Dropped `teacher_school_assignments` table
   - Cleaned up foreign key references in Prisma schema
   - Regenerated Prisma client

3. **Result:**
   - Teachers: 65/66 have school assignments (1 new user pending profile setup)
   - Mentors: 33 active assignments across multiple schools
   - All data consistent ✅

**Backup:**
- Full backup: `backups/tarl_pratham_full_20251122_100256.sql.gz`
- Restoration guide: `backups/README_BACKUP.md`

---

## Common Queries

### Get All Mentors and Their Assigned Schools

```sql
SELECT
  u.name as mentor_name,
  msa.subject,
  ps.school_name,
  msa.is_active
FROM users u
JOIN mentor_school_assignments msa ON u.id = msa.mentor_id
JOIN pilot_schools ps ON msa.pilot_school_id = ps.id
WHERE u.role = 'mentor'
ORDER BY u.name, msa.subject;
```

### Get All Teachers and Their Schools

```sql
SELECT
  u.name as teacher_name,
  u.subject,
  ps.school_name,
  u.pilot_school_id
FROM users u
LEFT JOIN pilot_schools ps ON u.pilot_school_id = ps.id
WHERE u.role = 'teacher'
ORDER BY ps.school_name, u.name;
```

### Find Teachers Without School Assignment

```sql
SELECT id, name, email, subject, created_at
FROM users
WHERE role = 'teacher'
  AND pilot_school_id IS NULL;

-- Expected: Only new users who haven't completed profile setup
```

### Count Students/Assessments per School

```sql
SELECT
  ps.school_name,
  COUNT(DISTINCT s.id) as student_count,
  COUNT(DISTINCT a.id) as assessment_count,
  COUNT(DISTINCT u.id) FILTER (WHERE u.role = 'teacher') as teacher_count,
  COUNT(DISTINCT msa.mentor_id) as mentor_count
FROM pilot_schools ps
LEFT JOIN students s ON ps.id = s.pilot_school_id
LEFT JOIN assessments a ON ps.id = a.pilot_school_id
LEFT JOIN users u ON ps.id = u.pilot_school_id
LEFT JOIN mentor_school_assignments msa ON ps.id = msa.pilot_school_id AND msa.is_active = true
GROUP BY ps.id, ps.school_name
ORDER BY student_count DESC;
```

### Check Mentor Verification Scope

```sql
-- Verify mentor can only see assessments from assigned schools
SELECT
  u.name as mentor_name,
  COUNT(DISTINCT msa.pilot_school_id) as assigned_schools,
  COUNT(DISTINCT a.id) as accessible_assessments
FROM users u
JOIN mentor_school_assignments msa ON u.id = msa.mentor_id
LEFT JOIN assessments a ON a.pilot_school_id = msa.pilot_school_id
  AND a.created_by_role = 'teacher'
  AND msa.is_active = true
WHERE u.role = 'mentor'
GROUP BY u.id, u.name;
```

---

## Best Practices

### For Developers

1. **Always use helper functions** from `lib/mentorAssignments.ts`:
   - Don't query `mentor_school_assignments` directly
   - Use `getMentorSchoolIds()`, `canMentorAccessSchool()`, etc.

2. **For teachers, use `User.pilot_school_id`:**
   - No special helper functions needed
   - Direct access via `session.user.pilot_school_id`

3. **Auto-inherit school for child records:**
   ```typescript
   // Students, Assessments, etc. should inherit from creator
   const data = {
     ...userData,
     pilot_school_id: session.user.pilot_school_id
   };
   ```

4. **Cache considerations:**
   - `getMentorAssignedSchools()` uses 5-min cache by default
   - For security-sensitive operations (verification, locking), use `bypassCache: true`
   - Call `invalidateMentorCache.all()` after assignment changes

### For Database Administrators

1. **Regular consistency checks:**
   - Run `migrations/VERIFY_DATA_CONSISTENCY.sql` monthly
   - Look for teachers without schools
   - Check for cross-school data mismatches

2. **Adding new mentors:**
   - Let them complete profile via `/profile` page
   - System auto-creates `MentorSchoolAssignment` records
   - Verify with: `SELECT * FROM mentor_school_assignments WHERE mentor_id = X`

3. **Reassigning mentors:**
   - Update `mentor_school_assignments` table
   - Don't forget to call `invalidateMentorCache.byMentor(mentorId)`
   - Or wait 5 minutes for cache to expire

4. **Reassigning teachers:**
   - Update `users.pilot_school_id` directly
   - Effects are immediate (no caching)

---

## Troubleshooting

### Issue: Mentor can't see assessments from assigned school

**Check:**
```sql
-- 1. Verify assignment exists
SELECT * FROM mentor_school_assignments
WHERE mentor_id = <mentor_id> AND is_active = true;

-- 2. Check assessments exist at that school
SELECT COUNT(*) FROM assessments
WHERE pilot_school_id = <school_id> AND created_by_role = 'teacher';

-- 3. Clear cache (if needed)
-- Wait 5 minutes OR restart application
```

### Issue: Teacher can't create students/assessments

**Check:**
```sql
-- 1. Verify teacher has school
SELECT id, name, pilot_school_id FROM users
WHERE id = <teacher_id> AND role = 'teacher';

-- 2. If NULL, assign school:
UPDATE users SET pilot_school_id = <school_id>
WHERE id = <teacher_id>;
```

### Issue: Cross-school data appearing

**Check:**
```sql
-- Find students from different school than teacher
SELECT s.id, s.name, s.pilot_school_id as student_school,
       u.pilot_school_id as teacher_school
FROM students s
JOIN users u ON s.added_by_id = u.id
WHERE s.pilot_school_id != u.pilot_school_id;

-- Fix: Update student's school to match teacher
UPDATE students s
SET pilot_school_id = u.pilot_school_id
FROM users u
WHERE s.added_by_id = u.id
  AND s.pilot_school_id != u.pilot_school_id;
```

---

## Related Documentation

- **Database Schema:** `prisma/schema.prisma`
- **Verification Queries:** `migrations/VERIFY_DATA_CONSISTENCY.sql`
- **Backup/Restore:** `backups/README_BACKUP.md`
- **Migration Scripts:**
  - `migrations/20251122_sync_teacher_assignments_before_drop.sql`
  - `migrations/20251122_remove_unused_teacher_assignments.sql`
- **API Documentation:** See route files in `app/api/`

---

## Questions?

**Contact:** Database Administrator
**Last Reviewed:** November 22, 2025
**Next Review:** December 22, 2025
