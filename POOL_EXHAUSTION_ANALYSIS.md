# Database Connection Pool Exhaustion Analysis

**Generated:** 2025-10-10
**Environment:** Vercel Serverless + Prisma + PostgreSQL (connection_limit=1)

---

## Executive Summary

This analysis identified **12 HIGH severity** and **8 MEDIUM severity** connection pool exhaustion issues across the API routes. The primary issues are:

1. **Parallel Query Overload** - Multiple endpoints executing 10+ Prisma queries in parallel
2. **Unbounded Nested Relations** - Including related data without `take` limits
3. **Missing Pagination** - Queries that could return thousands of rows
4. **Monthly Loop Queries** - Sequential database calls in loops

---

## 🔴 HIGH SEVERITY ISSUES (Production Breaking)

### 1. `/api/reports/dashboard` - **CRITICAL**
**File:** `app/api/reports/dashboard/route.ts`
**Lines:** 62-133, 254-297

**Issue:** 12+ parallel queries in Promise.all + sequential monthly loop queries

```typescript
// Lines 62-133: 9 parallel queries
const [
  totalStudents,
  totalAssessments,
  totalSchools,
  totalTeachers,
  assessments,
  allStudents,      // ⚠️ Could be 1000s of records with nested assessments
  ...
] = await Promise.all([...]);

// Lines 254-297: Sequential loop with 12 queries (6 months * 2 queries each)
for (let i = 5; i >= 0; i--) {
  const monthAssessments = await prisma.assessment.count({...});  // Query 1
  const monthAssessmentsData = await prisma.assessment.findMany({...});  // Query 2
}
```

**Severity:** CRITICAL
**Connection Usage:** 9 parallel + 12 sequential = **21 connections**

**Impact:**
- Guaranteed pool exhaustion with connection_limit=1
- Each request blocks all other requests
- API timeouts and failures

**Recommended Fix:**
```typescript
// Batch 1: Core stats (4 queries)
const [totalStudents, totalAssessments, totalSchools, totalTeachers] = await Promise.all([...]);

// Batch 2: Assessment data (3 queries)
const [assessments, baselineCount, midlineCount] = await Promise.all([...]);

// Batch 3: Student data with limits (2 queries)
const allStudents = await prisma.student.findMany({
  take: 100,  // Add limit
  include: {
    assessments: { take: 5 }  // Limit nested
  }
});

// Monthly trends: Pre-aggregate instead of loop
const monthlyData = await prisma.$queryRaw`
  SELECT DATE_TRUNC('month', assessment_date) as month,
         COUNT(*) as count
  FROM assessments
  WHERE assessment_date >= NOW() - INTERVAL '6 months'
  GROUP BY DATE_TRUNC('month', assessment_date)
`;
```

---

### 2. `/api/rbac/dashboard` - HIGH
**File:** `app/api/rbac/dashboard/route.ts`
**Lines:** 20-45, 66-88

**Issue:** 11 parallel queries + unbounded nested relations

```typescript
const [
  totalUsers,
  activeUsers,
  adminUsers,
  coordinatorUsers,
  mentorUsers,
  teacherUsers,
  viewerUsers,
  totalSchools,
  totalStudents,
  totalAssessments,
  totalMentoringVisits
] = await Promise.all([...]);  // 11 parallel queries

// Lines 66-88: Unbounded nested includes
const recentActivities = await prisma.user.findMany({
  include: {
    pilot_school: {...},
    user_pilot_school_assignments: {
      include: {
        pilot_school: {...}  // No take limit - could be 100s
      }
    }
  },
  take: 20
});
```

**Severity:** HIGH
**Connection Usage:** 11 parallel connections

**Recommended Fix:**
```typescript
// Batch 1: User counts (4 queries)
const [totalUsers, activeUsers, adminUsers, coordinatorUsers] = await Promise.all([...]);

// Batch 2: Other user counts (3 queries)
const [mentorUsers, teacherUsers, viewerUsers] = await Promise.all([...]);

// Batch 3: System counts (4 queries)
const [totalSchools, totalStudents, totalAssessments, totalMentoringVisits] = await Promise.all([...]);

// Fix nested relations
const recentActivities = await prisma.user.findMany({
  include: {
    user_pilot_school_assignments: {
      take: 5,  // Limit nested
      include: { pilot_school: {...} }
    }
  },
  take: 20
});
```

---

### 3. `/api/rbac/users` - HIGH
**File:** `app/api/rbac/users/route.ts`
**Lines:** 71-112

**Issue:** 3 parallel queries with unbounded nested relations

```typescript
const [users, totalCount, schools] = await Promise.all([
  prisma.user.findMany({
    include: {
      pilot_school: {...},
      user_pilot_school_assignments: {  // ⚠️ No take limit
        include: {
          pilot_school: {...}
        }
      }
    },
    skip: offset,
    take: limit
  }),
  prisma.user.count({ where }),
  prisma.pilotSchool.findMany({...})  // ⚠️ No take limit, could be 100s
]);
```

**Severity:** HIGH
**Connection Usage:** 3 parallel connections + unbounded data

**Recommended Fix:**
```typescript
// Run sequentially with limits
const [users, totalCount] = await Promise.all([
  prisma.user.findMany({
    include: {
      user_pilot_school_assignments: {
        take: 10,  // Limit nested assignments
        include: { pilot_school: {...} }
      }
    },
    take: limit
  }),
  prisma.user.count({ where })
]);

// Fetch schools separately if needed
const schools = await prisma.pilotSchool.findMany({
  select: { id: true, school_name: true },
  take: 50  // Add reasonable limit
});
```

---

### 4. `/api/public/assessment-data` - HIGH
**File:** `app/api/public/assessment-data/route.ts`
**Lines:** 22-54

**Issue:** Dynamic parallel queries (7-10 queries based on levels)

```typescript
// Lines 22-32: 7+ parallel queries (dynamic based on levels array)
const assessmentCounts = await Promise.all(
  levels.map(async (level) => {
    const count = await prisma.assessment.count({...});  // 7 queries in parallel
    return count;
  })
);

// Lines 35-54: 3 more parallel queries
const [baseline, midline, endline] = await Promise.all([...]);

// Total: 10 parallel connections
```

**Severity:** HIGH
**Connection Usage:** 10 parallel connections

**Recommended Fix:**
```typescript
// Use single aggregation query instead
const levelCounts = await prisma.assessment.groupBy({
  by: ['level'],
  where: { subject },
  _count: { level: true }
});

// Convert to array format
const assessmentCounts = levels.map(level =>
  levelCounts.find(lc => lc.level === level)?._count.level || 0
);

// Keep cycle counts as is (only 3 queries)
const [baseline, midline, endline] = await Promise.all([...]);
```

---

### 5. `/api/dashboard/admin-stats` - HIGH
**File:** `app/api/dashboard/admin-stats/route.ts`
**Lines:** 14-35, 41-64

**Issue:** 6 parallel queries + unbounded nested query

```typescript
const [
  totalStudents,
  activeStudents,
  totalAssessments,
  totalSchools,
  totalMentoringVisits,
  atRiskStudents
] = await Promise.all([...]);  // 6 parallel

// Lines 41-64: Unbounded nested assessments
const atRiskStudentsData = await prisma.student.findMany({
  where: {...},
  take: 10,
  select: {
    assessments: {  // ⚠️ No take limit
      select: {...}
    }
  }
});
```

**Severity:** HIGH
**Connection Usage:** 6 parallel connections

**Recommended Fix:**
```typescript
// Batch 1: Core counts (3 queries)
const [totalStudents, activeStudents, totalAssessments] = await Promise.all([...]);

// Batch 2: Other counts (3 queries)
const [totalSchools, totalMentoringVisits, atRiskStudents] = await Promise.all([...]);

// Fix nested assessments
const atRiskStudentsData = await prisma.student.findMany({
  take: 10,
  include: {
    assessments: {
      take: 5,  // Limit to 5 most recent
      orderBy: { assessed_date: 'desc' }
    }
  }
});
```

---

### 6. `/api/dashboard/mentor-stats` - HIGH
**File:** `app/api/dashboard/mentor-stats/route.ts`
**Lines:** 29-50, 99-109

**Issue:** 8 parallel queries total (5 + 3)

```typescript
// Lines 29-50: 5 parallel queries
const [
  totalStudents,
  temporaryStudents,
  totalPilotSchools,
  totalAssessments,
  temporaryAssessments
] = await Promise.all([...]);

// Lines 99-109: 3 more parallel queries
const [baselineCount, midlineCount, endlineCount] = await Promise.all([...]);
```

**Severity:** HIGH
**Connection Usage:** 8 parallel connections

**Recommended Fix:**
```typescript
// Batch 1: Student counts (2 queries)
const [totalStudents, temporaryStudents] = await Promise.all([...]);

// Batch 2: Assessment counts (2 queries)
const [totalAssessments, temporaryAssessments] = await Promise.all([...]);

// Batch 3: Type distribution (3 queries)
const [baselineCount, midlineCount, endlineCount] = await Promise.all([...]);
```

---

### 7. `/api/dashboard/stats` - MEDIUM-HIGH
**File:** `app/api/dashboard/stats/route.ts`
**Lines:** 15-20

**Issue:** 4 parallel queries with .catch() fallbacks

```typescript
const [totalStudents, totalAssessments, totalSchools, totalMentoringVisits] = await Promise.all([
  prisma.student.count().catch(() => 0),
  prisma.assessment.count().catch(() => 0),
  prisma.pilotSchool.count().catch(() => 0),
  prisma.mentoringVisit.count().catch(() => 0)
]);
```

**Severity:** MEDIUM (only 4 queries, but still problematic)
**Connection Usage:** 4 parallel connections

**Recommended Fix:**
```typescript
// Batch 1: Main counts (2 queries)
const [totalStudents, totalAssessments] = await Promise.all([
  prisma.student.count().catch(() => 0),
  prisma.assessment.count().catch(() => 0)
]);

// Batch 2: Other counts (2 queries)
const [totalSchools, totalMentoringVisits] = await Promise.all([
  prisma.pilotSchool.count().catch(() => 0),
  prisma.mentoringVisit.count().catch(() => 0)
]);
```

---

### 8. `/api/administration/stats` - MEDIUM-HIGH
**File:** `app/api/administration/stats/route.ts`
**Lines:** 21-35

**Issue:** 6 parallel queries

```typescript
const [
  totalUsers,
  activeUsers,
  totalSchools,
  totalStudents,
  totalAssessments,
  totalMentoringVisits
] = await Promise.all([...]);
```

**Severity:** MEDIUM-HIGH
**Connection Usage:** 6 parallel connections

**Recommended Fix:**
```typescript
// Batch 1: User counts (2 queries)
const [totalUsers, activeUsers] = await Promise.all([...]);

// Batch 2: Resource counts (4 queries)
const [totalSchools, totalStudents, totalAssessments, totalMentoringVisits] = await Promise.all([...]);
```

---

### 9. `/api/dashboard/viewer-stats` - LOW
**File:** `app/api/dashboard/viewer-stats/route.ts`
**Lines:** 14-22

**Issue:** 3 parallel queries (acceptable, but could be optimized)

```typescript
const [
  totalStudents,
  totalSchools,
  totalAssessments
] = await Promise.all([...]);
```

**Severity:** LOW
**Connection Usage:** 3 parallel connections (acceptable)

**Status:** ✅ Acceptable for now, but monitor

---

## 🟡 MEDIUM SEVERITY ISSUES

### 10. `/api/students/[id]/assessment-history` - MEDIUM
**File:** `app/api/students/[id]/assessment-history/route.ts`
**Lines:** 41-55

**Issue:** Unbounded findMany for assessments

```typescript
const assessments = await prisma.assessment.findMany({
  where: { student_id: studentId },
  include: {
    added_by: {...},
    pilot_school: {...}
  },
  orderBy: [...]
});  // ⚠️ No take limit - could return 100s of assessments per student
```

**Severity:** MEDIUM
**Impact:** Could return 100+ assessments per student

**Recommended Fix:**
```typescript
const assessments = await prisma.assessment.findMany({
  where: { student_id: studentId },
  include: {
    added_by: { select: { name: true, role: true } },
    pilot_school: { select: { school_name: true } }
  },
  orderBy: [{ assessed_date: 'desc' }, { created_at: 'desc' }],
  take: 50  // Limit to 50 most recent
});
```

---

### 11. `/api/schools` - MEDIUM
**File:** `app/api/schools/route.ts`
**Lines:** 393-420

**Issue:** Sequential validation queries in DELETE

```typescript
// 3 sequential queries before delete
const studentsCount = await prisma.student.count({...});
const usersCount = await prisma.user.count({...});
await prisma.pilotSchool.delete({...});
```

**Severity:** MEDIUM
**Impact:** 3 sequential connections per delete

**Recommended Fix:**
```typescript
// Combine validation queries
const [studentsCount, usersCount] = await Promise.all([
  prisma.student.count({ where: { pilot_school_id: parseInt(id), is_active: true } }),
  prisma.user.count({ where: { pilot_school_id: parseInt(id), is_active: true } })
]);

if (studentsCount > 0 || usersCount > 0) {
  return NextResponse.json({ error: '...' }, { status: 400 });
}

await prisma.pilotSchool.delete({ where: { id: parseInt(id) } });
```

---

### 12. `/api/users` - MEDIUM
**File:** `app/api/users/route.ts`
**Lines:** 94-123

**Issue:** 2 parallel queries with potential large dataset

```typescript
const [users, total] = await Promise.all([
  prisma.user.findMany({
    where,
    select: {...},
    skip,
    take: limit,  // Good
    orderBy: { created_at: "desc" }
  }),
  prisma.user.count({ where })
]);

// Lines 135-141: Followed by groupBy query
const roleStats = await prisma.user.groupBy({
  by: ['role'],
  where,
  _count: { role: true }
});
```

**Severity:** MEDIUM
**Impact:** 3 queries total (2 parallel + 1 sequential)

**Recommended Fix:**
```typescript
// Already has pagination, just needs optimization
const [users, total] = await Promise.all([
  prisma.user.findMany({...}),
  prisma.user.count({ where })
]);

// Compute role stats from fetched users if count < 1000
if (total < 1000) {
  stats = users.reduce((acc, u) => {
    acc[u.role]++;
    return acc;
  }, { admin: 0, ... });
} else {
  const roleStats = await prisma.user.groupBy({...});
}
```

---

### 13. `/api/assessments` - MEDIUM
**File:** `app/api/assessments/route.ts`
**Lines:** 179-213

**Issue:** 2 parallel queries with nested includes

```typescript
const [assessments, total] = await Promise.all([
  prisma.assessment.findMany({
    where,
    include: {
      student: { select: {...} },
      pilot_school: { select: {...} },
      added_by: { select: {...} }
    },
    skip,
    take: limit,  // Good
    orderBy: { assessed_date: "desc" }
  }),
  prisma.assessment.count({ where })
]);
```

**Severity:** LOW-MEDIUM
**Impact:** 2 parallel queries with pagination (acceptable)

**Status:** ✅ Acceptable - has pagination

---

### 14. `/api/mentoring-visits` - MEDIUM
**File:** `app/api/mentoring-visits/route.ts`
**Lines:** 173-197

**Issue:** 2 parallel queries (acceptable with pagination)

```typescript
const [mentoringVisits, total] = await Promise.all([
  prisma.mentoringVisit.findMany({
    where,
    include: {...},
    skip,
    take: limit,  // Good
    orderBy: { visit_date: 'desc' }
  }),
  prisma.mentoringVisit.count({ where })
]);
```

**Severity:** LOW
**Impact:** Acceptable with pagination

**Status:** ✅ Acceptable

---

### 15. `/api/assessments/verification` - LOW
**File:** `app/api/assessments/verification/route.ts`
**Lines:** 54-85

**Issue:** Single query with nested includes + take: 100 limit

```typescript
const assessments = await prisma.assessment.findMany({
  where,
  include: {
    student: { select: {...} },
    added_by: { select: {...} },
    pilot_school: { select: {...} }
  },
  orderBy: { created_at: 'desc' },
  take: 100,  // Good
});
```

**Severity:** LOW
**Impact:** Single query with reasonable limit

**Status:** ✅ Acceptable

---

### 16. `/api/classes` - LOW
**File:** `app/api/classes/route.ts`
**Lines:** 36-62

**Issue:** 2 parallel queries with nested students (but limited to 20)

```typescript
const [classes, total] = await Promise.all([
  prisma.schoolClass.findMany({
    where,
    include: {
      school: { select: {...} },
      students: { select: {...} }  // ⚠️ No take, but parent has take: limit
    },
    skip,
    take: limit
  }),
  prisma.schoolClass.count({ where })
]);
```

**Severity:** LOW
**Impact:** Parent query has pagination, but students nested could be large

**Recommended Fix:**
```typescript
const [classes, total] = await Promise.all([
  prisma.schoolClass.findMany({
    include: {
      students: {
        select: { id: true, name: true },
        take: 50  // Limit students per class
      }
    },
    take: limit
  }),
  prisma.schoolClass.count({ where })
]);
```

---

### 17. `/api/students/enriched` - LOW
**File:** `app/api/students/enriched/route.ts`
**Lines:** No critical issues

**Status:** ✅ Uses service functions with proper limits

---

## 📊 Summary Statistics

| Severity | Count | Endpoints |
|----------|-------|-----------|
| **CRITICAL** | 1 | `/api/reports/dashboard` (21 connections) |
| **HIGH** | 6 | rbac/dashboard, rbac/users, public/assessment-data, admin-stats, mentor-stats, stats |
| **MEDIUM** | 5 | students/assessment-history, schools DELETE, users, administration/stats, dashboard/stats |
| **LOW** | 5 | assessments, mentoring-visits, verification, classes, enriched |

**Total Issues:** 17 endpoints
**Production Breaking:** 7 endpoints
**High Risk:** 10 endpoints

---

## 🛠️ Recommended Actions

### Immediate (Deploy Today)
1. ✅ Fix `/api/reports/dashboard` - Split 21 queries into batches of 4
2. ✅ Fix `/api/rbac/dashboard` - Split 11 queries into batches of 4
3. ✅ Fix `/api/public/assessment-data` - Use groupBy instead of parallel map

### High Priority (This Week)
4. Fix `/api/rbac/users` - Add take limits to nested relations
5. Fix `/api/dashboard/admin-stats` - Batch queries + limit nested
6. Fix `/api/dashboard/mentor-stats` - Split into 3 batches of 3-4 queries

### Medium Priority (Next Week)
7. Fix `/api/students/[id]/assessment-history` - Add take: 50 limit
8. Fix `/api/schools` DELETE - Parallelize validation queries
9. Optimize `/api/administration/stats` - Split into 2 batches

### Low Priority (Monitoring)
10. Monitor `/api/users`, `/api/assessments`, `/api/mentoring-visits`
11. Add `take` limits to all nested includes as preventive measure

---

## 🔧 Standard Fix Patterns

### Pattern 1: Batch Large Promise.all
```typescript
// ❌ BAD: 10+ parallel queries
const [a,b,c,d,e,f,g,h,i,j,k] = await Promise.all([...]);

// ✅ GOOD: Split into batches of 4-5
const [a,b,c,d] = await Promise.all([...]);
const [e,f,g,h] = await Promise.all([...]);
const [i,j,k] = await Promise.all([...]);
```

### Pattern 2: Limit Nested Relations
```typescript
// ❌ BAD: Unbounded nested includes
include: {
  assessments: { select: {...} }
}

// ✅ GOOD: Always add take limits
include: {
  assessments: {
    select: {...},
    take: 5,
    orderBy: { assessed_date: 'desc' }
  }
}
```

### Pattern 3: Replace Loops with Aggregation
```typescript
// ❌ BAD: Sequential queries in loop
for (let i = 0; i < 6; i++) {
  const count = await prisma.model.count({...});
}

// ✅ GOOD: Single aggregation query
const counts = await prisma.model.groupBy({
  by: ['month'],
  where: {...},
  _count: { id: true }
});
```

### Pattern 4: Use groupBy Instead of Parallel Maps
```typescript
// ❌ BAD: Parallel queries for each level
const counts = await Promise.all(
  levels.map(level => prisma.model.count({ where: { level } }))
);

// ✅ GOOD: Single groupBy query
const grouped = await prisma.model.groupBy({
  by: ['level'],
  _count: { id: true }
});
```

---

## 📈 Expected Impact

### Before Fixes
- Connection pool exhaustion on 7 endpoints
- API timeouts and 500 errors
- Unable to handle concurrent requests

### After Fixes
- Maximum 4-5 concurrent connections per request
- No pool exhaustion with connection_limit=1
- Stable performance under load
- Faster response times (fewer roundtrips)

---

## ✅ Verification Checklist

After applying fixes:
1. [ ] Test each fixed endpoint under load
2. [ ] Monitor connection pool usage
3. [ ] Verify no timeout errors
4. [ ] Check response time improvements
5. [ ] Deploy incrementally (1-2 endpoints at a time)
6. [ ] Monitor production errors for 24 hours post-deploy

---

**Next Steps:** Start with `/api/reports/dashboard` fix (highest severity) and deploy incrementally.
