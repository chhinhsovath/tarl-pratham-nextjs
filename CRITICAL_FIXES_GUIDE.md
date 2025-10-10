# Critical Pool Exhaustion Fixes - Quick Reference

## 🚨 DEPLOY IMMEDIATELY (Production Breaking)

### 1. `/api/reports/dashboard` - CRITICAL (21 connections → 4 max)

**Current Code (Lines 62-133, 254-297):**
```typescript
// 9 parallel queries
const [totalStudents, totalAssessments, totalSchools, totalTeachers,
       assessments, allStudents, ...] = await Promise.all([...]);

// 12 sequential loop queries
for (let i = 5; i >= 0; i--) {
  const monthAssessments = await prisma.assessment.count({...});
  const monthAssessmentsData = await prisma.assessment.findMany({...});
}
```

**Fixed Code:**
```typescript
// Batch 1: Core counts (4 queries)
const [totalStudents, totalAssessments, totalSchools, totalTeachers] = await Promise.all([
  prisma.student.count({ where: { is_active: true, ...filters } }),
  prisma.assessment.count({ where: baseWhere }),
  prisma.pilotSchool.count({ where: { is_active: true, ...filters } }),
  prisma.user.count({ where: { role: 'teacher', ...filters } })
]);

// Batch 2: Assessment data (3 queries)
const [assessments, baselineCount, midlineCount] = await Promise.all([
  prisma.assessment.findMany({
    where: baseWhere,
    include: {
      student: { include: { pilotSchool: true } }
    },
    orderBy: { assessment_date: 'desc' },
    take: 100  // Add limit
  }),
  prisma.assessment.count({ where: { ...baseWhere, assessment_type: 'baseline' } }),
  prisma.assessment.count({ where: { ...baseWhere, assessment_type: 'midline' } })
]);

// Batch 3: Student completion data (2 queries)
const [endlineCount, allStudents] = await Promise.all([
  prisma.assessment.count({ where: { ...baseWhere, assessment_type: 'endline' } }),
  prisma.student.findMany({
    where: studentWhere,
    include: {
      assessments: {
        where: baseWhere,
        take: 5,  // Limit nested assessments
        orderBy: { assessment_date: 'desc' }
      }
    },
    take: 100  // Add limit
  })
]);

// Replace monthly loop with single aggregation query
const monthlyTrends = await prisma.$queryRaw`
  SELECT
    DATE_TRUNC('month', assessment_date) as month,
    COUNT(*) as assessments_count,
    COUNT(DISTINCT CASE
      WHEN khmer_level != 'មិនចេះអាន' OR math_level != 'មិនចេះរាប់'
      THEN student_id
    END) as improvements_count
  FROM assessments
  WHERE assessment_date >= NOW() - INTERVAL '6 months'
    ${baseWhere.student ? 'AND student_id IN (...)' : ''}
  GROUP BY DATE_TRUNC('month', assessment_date)
  ORDER BY month ASC
`;
```

---

### 2. `/api/rbac/dashboard` - HIGH (11 connections → 4 max)

**Current Code (Lines 20-45):**
```typescript
const [totalUsers, activeUsers, adminUsers, coordinatorUsers, mentorUsers,
       teacherUsers, viewerUsers, totalSchools, totalStudents,
       totalAssessments, totalMentoringVisits] = await Promise.all([...]);
```

**Fixed Code:**
```typescript
// Batch 1: User counts (4 queries)
const [totalUsers, activeUsers, adminUsers, coordinatorUsers] = await Promise.all([
  prisma.user.count(),
  prisma.user.count({ where: { is_active: true } }),
  prisma.user.count({ where: { role: "admin" } }),
  prisma.user.count({ where: { role: "coordinator" } })
]);

// Batch 2: More user counts (3 queries)
const [mentorUsers, teacherUsers, viewerUsers] = await Promise.all([
  prisma.user.count({ where: { role: "mentor" } }),
  prisma.user.count({ where: { role: "teacher" } }),
  prisma.user.count({ where: { role: "viewer" } })
]);

// Batch 3: System resources (4 queries)
const [totalSchools, totalStudents, totalAssessments, totalMentoringVisits] = await Promise.all([
  prisma.pilotSchool.count(),
  prisma.student.count(),
  prisma.assessment.count(),
  prisma.mentoringVisit.count()
]);
```

**Fix Nested Relations (Lines 66-88):**
```typescript
const recentActivities = await prisma.user.findMany({
  where: { is_active: true },
  include: {
    pilot_school: {
      select: { id: true, school_name: true }
    },
    user_pilot_school_assignments: {
      take: 10,  // ✅ Add limit
      include: {
        pilot_school: {
          select: { id: true, school_name: true }
        }
      }
    }
  },
  orderBy: { updated_at: 'desc' },
  take: 20
});
```

---

### 3. `/api/public/assessment-data` - HIGH (10 connections → 4 max)

**Current Code (Lines 22-54):**
```typescript
// 7+ parallel queries (dynamic)
const assessmentCounts = await Promise.all(
  levels.map(async (level) => {
    const count = await prisma.assessment.count({...});
    return count;
  })
);

// 3 more parallel queries
const [baseline, midline, endline] = await Promise.all([...]);
```

**Fixed Code:**
```typescript
// Single aggregation query instead of parallel map
const levelCounts = await prisma.assessment.groupBy({
  by: ['level'],
  where: { subject },
  _count: { level: true }
});

// Convert to array format
const assessmentCounts = levels.map(level => {
  const found = levelCounts.find(lc => lc.level === level.toLowerCase().replace(/\s+/g, "_").replace(/\./g, ""));
  return found?._count.level || 0;
});

// Cycle counts (3 queries in one batch)
const [baseline, midline, endline] = await Promise.all([
  prisma.assessment.count({ where: { subject, assessment_type: "baseline" } }),
  prisma.assessment.count({ where: { subject, assessment_type: "midline" } }),
  prisma.assessment.count({ where: { subject, assessment_type: "endline" } })
]);

// Total unique students
const totalStudents = await prisma.assessment.findMany({
  where: { subject },
  distinct: ['student_id'],
  select: { student_id: true }
});
```

---

### 4. `/api/dashboard/admin-stats` - HIGH (6 connections → 4 max)

**Current Code (Lines 14-35):**
```typescript
const [totalStudents, activeStudents, totalAssessments, totalSchools,
       totalMentoringVisits, atRiskStudents] = await Promise.all([...]);
```

**Fixed Code:**
```typescript
// Batch 1: Student & assessment counts (3 queries)
const [totalStudents, activeStudents, totalAssessments] = await Promise.all([
  prisma.student.count(),
  prisma.student.count({ where: { is_active: true } }),
  prisma.assessment.count()
]);

// Batch 2: System counts (3 queries)
const [totalSchools, totalMentoringVisits, atRiskStudents] = await Promise.all([
  prisma.pilotSchool.count(),
  prisma.mentoringVisit.count(),
  prisma.student.count({
    where: {
      OR: [
        { is_active: false },
        { assessments: { none: {} } }
      ]
    }
  })
]);
```

**Fix Nested Assessments (Lines 41-64):**
```typescript
const atRiskStudentsData = await prisma.student.findMany({
  where: {
    OR: [
      { is_active: false },
      { assessments: { none: {} } }
    ]
  },
  take: 10,
  select: {
    id: true,
    name: true,
    class: true,
    gender: true,
    age: true,
    is_active: true,
    assessments: {
      take: 5,  // ✅ Add limit
      orderBy: { assessed_date: 'desc' },
      select: {
        id: true,
        level: true,
        subject: true
      }
    }
  }
});
```

---

### 5. `/api/dashboard/mentor-stats` - HIGH (8 connections → 4 max)

**Current Code (Lines 29-50, 99-109):**
```typescript
// 5 parallel queries
const [totalStudents, temporaryStudents, totalPilotSchools,
       totalAssessments, temporaryAssessments] = await Promise.all([...]);

// 3 more parallel queries
const [baselineCount, midlineCount, endlineCount] = await Promise.all([...]);
```

**Fixed Code:**
```typescript
// Batch 1: Student counts (2 queries)
const [totalStudents, temporaryStudents] = await Promise.all([
  prisma.student.count({ where: schoolFilter }),
  prisma.student.count({ where: { ...schoolFilter, is_temporary: true } })
]);

// Batch 2: Assessment counts (3 queries)
const [totalAssessments, temporaryAssessments, totalPilotSchools] = await Promise.all([
  prisma.assessment.count({ where: { student: schoolFilter } }),
  prisma.assessment.count({ where: { is_temporary: true, student: schoolFilter } }),
  mentorUser.pilot_school_id ? Promise.resolve(1) : Promise.resolve(0)
]);

// Batch 3: Assessment type distribution (3 queries)
const [baselineCount, midlineCount, endlineCount] = await Promise.all([
  prisma.assessment.count({ where: { assessment_type: 'baseline', student: schoolFilter } }),
  prisma.assessment.count({ where: { assessment_type: 'midline', student: schoolFilter } }),
  prisma.assessment.count({ where: { assessment_type: 'endline', student: schoolFilter } })
]);
```

---

### 6. `/api/rbac/users` - HIGH (unbounded nested relations)

**Current Code (Lines 71-112):**
```typescript
const [users, totalCount, schools] = await Promise.all([
  prisma.user.findMany({
    include: {
      user_pilot_school_assignments: {  // ⚠️ No take limit
        include: { pilot_school: {...} }
      }
    }
  }),
  prisma.user.count({ where }),
  prisma.pilotSchool.findMany({...})  // ⚠️ No take limit
]);
```

**Fixed Code:**
```typescript
// Run main queries in parallel
const [users, totalCount] = await Promise.all([
  prisma.user.findMany({
    where,
    include: {
      pilot_school: {
        select: { id: true, school_name: true }
      },
      user_pilot_school_assignments: {
        take: 10,  // ✅ Limit nested assignments
        include: {
          pilot_school: {
            select: { id: true, school_name: true }
          }
        }
      }
    },
    orderBy: { created_at: 'desc' },
    skip: offset,
    take: limit
  }),
  prisma.user.count({ where })
]);

// Fetch schools separately with limit
const schools = await prisma.pilotSchool.findMany({
  select: { id: true, school_name: true },
  orderBy: { school_name: 'asc' },
  take: 100  // ✅ Add reasonable limit
});
```

---

## 🔧 Quick Deployment Steps

### Step 1: Fix Reports Dashboard (CRITICAL)
```bash
# Edit file
code app/api/reports/dashboard/route.ts

# Apply fixes from section 1 above
# Test locally
npm run dev
# Test endpoint: http://localhost:3000/api/reports/dashboard

# Commit and deploy
git add app/api/reports/dashboard/route.ts
git commit -m "fix: Resolve connection pool exhaustion in reports dashboard (21→4 queries)"
git push
```

### Step 2: Fix RBAC Dashboard
```bash
code app/api/rbac/dashboard/route.ts
# Apply fixes from section 2
# Test and deploy
git add app/api/rbac/dashboard/route.ts
git commit -m "fix: Batch RBAC dashboard queries to prevent pool exhaustion (11→4 queries)"
git push
```

### Step 3: Fix Public Assessment Data
```bash
code app/api/public/assessment-data/route.ts
# Apply fixes from section 3
# Test and deploy
git add app/api/public/assessment-data/route.ts
git commit -m "fix: Use groupBy instead of parallel map for assessment counts (10→4 queries)"
git push
```

### Continue with sections 4-6...

---

## ✅ Verification After Each Fix

```bash
# Test endpoint
curl http://localhost:3000/api/ENDPOINT

# Check Prisma query logs
# Add to .env: DATABASE_URL="...?connection_limit=1"
# Add to prisma/schema.prisma: log = ["query", "error"]

# Monitor connection usage
# Should see max 4-5 concurrent queries, never >5
```

---

## 📊 Expected Results

| Endpoint | Before | After | Improvement |
|----------|--------|-------|-------------|
| `/api/reports/dashboard` | 21 connections | 4-5 max | **80% reduction** |
| `/api/rbac/dashboard` | 11 connections | 4 max | **64% reduction** |
| `/api/public/assessment-data` | 10 connections | 4 max | **60% reduction** |
| `/api/dashboard/admin-stats` | 6 connections | 4 max | **33% reduction** |
| `/api/dashboard/mentor-stats` | 8 connections | 4 max | **50% reduction** |

**Overall:** From guaranteed pool exhaustion → Stable operation with connection_limit=1

---

## 🚨 Rollback Plan

If issues occur after deployment:

```bash
# Revert specific commit
git revert <commit-hash>
git push

# Or revert all fixes
git revert HEAD~6..HEAD  # Reverts last 6 commits
git push
```

**Monitor:** Check Vercel logs for any new errors after each deployment.
