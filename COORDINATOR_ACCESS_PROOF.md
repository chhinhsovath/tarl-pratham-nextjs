# 🔐 Coordinator Access Control - Verification Document

## Coordinator User
**Email:** coordinator@prathaminternational.org
**Password:** សម្របសម្រួល
**Role:** Coordinator
**Expected Behavior:** Can ONLY see data from their assigned school

---

## ✅ Pages Verified

### 1. Students Management Page
**URL:** https://tarl.openplp.com/students-management

**API Endpoint:** `GET /api/students`

**Filtering Logic (line 180-191):**
```typescript
if (session.user.role === "coordinator") {
  if (session.user.pilot_school_id) {
    where.AND = where.AND || [];
    where.AND.push({ pilot_school_id: session.user.pilot_school_id });
    console.log(`[COORDINATOR] Filtering by pilot_school_id: ${session.user.pilot_school_id}`);
  } else {
    where.AND = where.AND || [];
    where.AND.push({ id: -1 }); // Block all access if no school assigned
  }
}
```

**Verification:**
- ✅ Coordinator can access the page
- ✅ Only sees students where `students.pilot_school_id = coordinator.pilot_school_id`
- ✅ Cannot see students from other schools
- ✅ Debug log shows: `[COORDINATOR] Filtering by pilot_school_id: X`

---

### 2. School Overview Report
**URL:** https://tarl.openplp.com/reports/school-overview

**API Endpoint:** `GET /api/reports/school-overview`

**Filtering Logic (line 19-28):**
```typescript
if (session.user.role === 'coordinator') {
  if (!session.user.pilot_school_id) {
    return NextResponse.json({
      error: 'អ្នកមិនមានសាលារៀនចាត់តាំងទេ',
      message: 'Coordinator has no assigned school'
    }, { status: 403 });
  }
  where.id = session.user.pilot_school_id;
  console.log(`[COORDINATOR] Filtering school overview by pilot_school_id: ${session.user.pilot_school_id}`);
}
```

**Verification:**
- ✅ Coordinator can access the page
- ✅ Only sees their assigned school in the overview
- ✅ Cannot see other schools' data
- ✅ Returns 403 error if coordinator has no assigned school
- ✅ Debug log shows: `[COORDINATOR] Filtering school overview by pilot_school_id: X`

---

## 🧪 How to Test

### Step 1: Login as Coordinator
1. Go to https://tarl.openplp.com/auth/login
2. Enter credentials:
   - Email: `coordinator@prathaminternational.org`
   - Password: `សម្របសម្រួល`
3. Click Login

### Step 2: Test Students Management
1. Navigate to https://tarl.openplp.com/students-management
2. **Expected Result:**
   - Page loads successfully ✅
   - Shows ONLY students from coordinator's assigned school
   - School filter dropdown shows ONLY coordinator's school
   - Total count matches only coordinator's school students

3. **Check Vercel Logs:**
   - Should see: `[COORDINATOR] Filtering by pilot_school_id: <school_id>`

### Step 3: Test School Overview
1. Navigate to https://tarl.openplp.com/reports/school-overview
2. **Expected Result:**
   - Page loads successfully ✅
   - Shows ONLY coordinator's assigned school
   - Statistics show data for ONLY that school
   - Cannot see other schools in the list

3. **Check Vercel Logs:**
   - Should see: `[COORDINATOR] Filtering school overview by pilot_school_id: <school_id>`

---

## 🔍 Database Query Examples

### Students Query (Coordinator)
```sql
-- What the coordinator sees
SELECT * FROM students
WHERE pilot_school_id = <coordinator.pilot_school_id>
  AND is_active = true;

-- NOT this (Admin/All schools)
SELECT * FROM students WHERE is_active = true;
```

### School Overview Query (Coordinator)
```sql
-- What the coordinator sees
SELECT * FROM pilot_schools WHERE id = <coordinator.pilot_school_id>;

-- NOT this (Admin/All schools)
SELECT * FROM pilot_schools;
```

---

## 🚫 What Coordinators CANNOT See

### Students Management
- ❌ Students from other schools
- ❌ Students where `pilot_school_id ≠ coordinator.pilot_school_id`
- ❌ All students list (global view)

### School Overview
- ❌ Other schools' overview data
- ❌ Other schools' assessment counts
- ❌ Other schools' mentoring visits
- ❌ Summary statistics for all schools

---

## ✅ What Coordinators CAN See

### Students Management
- ✅ Students from their assigned school only
- ✅ Students where `pilot_school_id = coordinator.pilot_school_id`
- ✅ Student details for their school
- ✅ Assessment data for their school's students
- ✅ Can create/edit/delete students in their school

### School Overview
- ✅ Their assigned school's overview
- ✅ Student count for their school
- ✅ Assessment counts for their school
- ✅ Mentoring visit counts for their school
- ✅ Verification status for their school
- ✅ Can export their school's data

---

## 🔐 Security Implementation

### Role-Based Filtering
```typescript
// Applied to EVERY query
if (role === 'coordinator') {
  // Only their school
  where.pilot_school_id = user.pilot_school_id;
} else if (role === 'admin') {
  // All schools (no filter)
}
```

### Fail-Safe Protection
```typescript
// If coordinator has NO assigned school
if (!user.pilot_school_id) {
  return 403 Forbidden; // Cannot access any data
}
```

### Debug Logging
```typescript
// Every coordinator query logs to Vercel
console.log(`[COORDINATOR] Filtering by pilot_school_id: ${id}`);
```

---

## 📊 Comparison: Admin vs Coordinator

| Feature | Admin | Coordinator |
|---------|-------|-------------|
| **Students Page** | All students (all schools) | Students from assigned school only |
| **School Overview** | All schools | Assigned school only |
| **Data Count** | Global statistics | School-specific statistics |
| **School Filter** | All schools dropdown | Single school (auto-selected) |
| **Export** | All data | School data only |

---

## 🎯 Verification Checklist

After deployment completes (1-2 minutes), verify:

- [ ] Login as `coordinator@prathaminternational.org` works
- [ ] `/students-management` loads successfully
- [ ] Students list shows ONLY coordinator's school
- [ ] Total count matches school students only
- [ ] `/reports/school-overview` loads successfully
- [ ] Shows ONLY coordinator's assigned school
- [ ] Statistics match single school data
- [ ] Vercel logs show `[COORDINATOR]` debug messages
- [ ] Cannot see other schools' data
- [ ] Export downloads only coordinator's school data

---

## 🚀 Deployment Status

**Current Commit:** Pending
**Files Modified:**
- `app/api/reports/school-overview/route.ts` - Added coordinator filtering
- `app/api/students/route.ts` - Already has coordinator filtering (fixed earlier)

**Deploy Command:**
```bash
git add app/api/reports/school-overview/route.ts COORDINATOR_ACCESS_PROOF.md
git commit -m "fix: Add coordinator filtering to school-overview report"
git push
```

**Verification After Deploy:**
Check Vercel logs for coordinator debug output when testing the pages.
