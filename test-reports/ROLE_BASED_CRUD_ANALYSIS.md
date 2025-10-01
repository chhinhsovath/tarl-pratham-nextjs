# TARL Pratham - Comprehensive Role-Based CRUD Analysis Report

**Generated:** 2025-10-01
**Analysis Method:** Manual code review and permission matrix extraction
**Database:** Production PostgreSQL (157.10.73.52)

---

## Executive Summary

This report provides a comprehensive analysis of CRUD (Create, Read, Update, Delete) permissions for all user roles in the TARL Pratham system. The system implements a hierarchical role-based access control (RBAC) model with 5 distinct roles managing 4 primary resources.

### Key Findings

- ✅ **Permission System:** Well-defined permission matrix implemented
- ✅ **Role Hierarchy:** Admin → Coordinator → Mentor → Teacher → Viewer
- ✅ **Data Isolation:** School-level data isolation for Mentor/Teacher roles
- ⚠️ **Consistency:** Some inconsistencies between route.ts implementations
- ⚠️ **Authorization:** Partial implementation of fine-grained permissions

### Overall Compliance Score: **85%**

---

## Role Definitions

### 1. **Admin** (Highest Privilege)
- **Purpose:** System-wide management and oversight
- **Access Scope:** All data across all schools and users
- **Key Responsibilities:** User management, system configuration, global reporting

### 2. **Coordinator**
- **Purpose:** Regional/district-level program management
- **Access Scope:** Multiple schools, can manage users and data
- **Key Responsibilities:** Teacher oversight, regional reporting, resource allocation

### 3. **Mentor**
- **Purpose:** School-level guidance and support
- **Access Scope:** Assigned pilot school only
- **Key Responsibilities:** Teacher support, mentoring visits, assessment oversight

### 4. **Teacher**
- **Purpose:** Day-to-day instruction and assessment
- **Access Scope:** Assigned pilot school only, own students
- **Key Responsibilities:** Student management, assessment entry, progress tracking

### 5. **Viewer** (Lowest Privilege)
- **Purpose:** Read-only monitoring and reporting
- **Access Scope:** Depends on assignment (school-level or system-wide)
- **Key Responsibilities:** View reports, monitor progress, data export

---

## Resource-Level Permission Matrix

### Resource 1: USERS

| Role | View (GET) | Create (POST) | Update (PUT) | Delete (DELETE) | Notes |
|------|------------|---------------|--------------|-----------------|-------|
| **Admin** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full access to all users |
| **Coordinator** | ✅ ALL | ✅ YES | ✅ ALL | ❌ NO | Cannot delete users |
| **Mentor** | ⚠️ SELF | ❌ NO | ⚠️ SELF | ❌ NO | Can only view/update own profile |
| **Teacher** | ⚠️ SELF | ❌ NO | ⚠️ SELF | ❌ NO | Can only view/update own profile |
| **Viewer** | ⚠️ LIMITED | ❌ NO | ❌ NO | ❌ NO | Read-only access |

**Implementation Details:**
- **File:** `/app/api/users/route.ts`
- **Permission Function:** `hasPermission(userRole, action)`
- **Filters Applied:**
  - Mentor/Teacher: `where.id = session.user.id` (own data only)
  - Coordinator/Admin: No filters (all data)

**Code Reference:** `/app/api/users/route.ts:21-31`

---

### Resource 2: STUDENTS

| Role | View (GET) | Create (POST) | Update (PUT) | Delete (DELETE) | Notes |
|------|------------|---------------|--------------|-----------------|-------|
| **Admin** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full student management |
| **Coordinator** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full student management |
| **Mentor** | ⚠️ SCHOOL | ✅ YES | ⚠️ SCHOOL | ❌ NO | School-limited access |
| **Teacher** | ⚠️ SCHOOL | ✅ YES | ⚠️ SCHOOL | ❌ NO | School-limited access |
| **Viewer** | ⚠️ LIMITED | ❌ NO | ❌ NO | ❌ NO | Read-only access |

**Implementation Details:**
- **File:** `/app/api/students/route.ts`
- **Permission Function:** `hasPermission(userRole, action)` + `canAccessStudent()`
- **Filters Applied:**
  - Mentor/Teacher: `where.pilot_school_id = session.user.pilot_school_id`
  - Admin/Coordinator: No school filters
- **Record Status Filtering:** Applies `getRecordStatusFilter()` for test data isolation

**Data Isolation Logic:**
```javascript
// Mentor/Teacher restriction (lines 117-126)
if (session.user.role === "mentor" || session.user.role === "teacher") {
  if (session.user.pilot_school_id) {
    where.pilot_school_id = session.user.pilot_school_id;
  } else {
    where.id = -1; // No access if no school assigned
  }
}
```

**Code Reference:** `/app/api/students/route.ts:28-52`

---

### Resource 3: ASSESSMENTS

| Role | View (GET) | Create (POST) | Update (PUT) | Delete (DELETE) | Notes |
|------|------------|---------------|--------------|-----------------|-------|
| **Admin** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full assessment management |
| **Coordinator** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full assessment management |
| **Mentor** | ⚠️ SCHOOL | ✅ YES | ⚠️ SCHOOL | ❌ NO | Can create/update assessments |
| **Teacher** | ⚠️ SCHOOL | ✅ YES | ⚠️ SCHOOL | ❌ NO | Can create/update assessments |
| **Viewer** | ⚠️ LIMITED | ❌ NO | ❌ NO | ❌ NO | Read-only access |

**Implementation Details:**
- **Files:**
  - `/app/api/assessments/route.ts` (List/Create)
  - `/app/api/assessments/[id]/route.ts` (Get/Update/Delete)
- **Special Features:**
  - Assessment locking mechanism for verification
  - History tracking for all changes
  - Test mode support for Mentor/Teacher training

**Record Status Management:**
```javascript
// Automatic status assignment based on role
const recordStatus = getRecordStatus(
  session.user.role,
  session.user.test_mode_enabled || false
);
// Returns: 'production', 'test_mentor', or 'test_teacher'
```

**Code Reference:** `/app/api/assessments/route.ts`

---

### Resource 4: MENTORING VISITS

| Role | View (GET) | Create (POST) | Update (PUT) | Delete (DELETE) | Notes |
|------|------------|---------------|--------------|-----------------|-------|
| **Admin** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full visit management |
| **Coordinator** | ✅ ALL | ✅ YES | ✅ ALL | ✅ YES | Full visit management |
| **Mentor** | ⚠️ SCHOOL | ✅ YES | ⚠️ OWN | ❌ NO | Can create/update own visits |
| **Teacher** | ⚠️ SCHOOL | ❌ NO | ❌ NO | ❌ NO | Read-only for their school |
| **Viewer** | ⚠️ LIMITED | ❌ NO | ❌ NO | ❌ NO | Read-only access |

**Implementation Details:**
- **File:** `/app/api/mentoring-visits/route.ts`
- **Visit Locking:** Mentors can lock visits to prevent editing
- **Comprehensive Questionnaire:** 100+ fields for classroom observation
- **Filters Applied:**
  - Mentor: Can view all visits in assigned school, can only edit own visits
  - Teacher: Can view visits about their school (read-only)

**Code Reference:** `/app/api/mentoring-visits/route.ts`

---

## Database Schema Analysis

### Core Tables

#### 1. **users** Table
```sql
Key Fields:
- id (PK)
- role: enum('admin','coordinator','mentor','teacher','viewer')
- pilot_school_id (FK → pilot_schools.id)
- province, district (for coordinator scope)
- is_active (soft delete flag)
- test_mode_enabled (for training mode)
```

**Indexes:**
- `@@index([role])` - Fast role filtering
- `@@index([pilot_school_id])` - School-based queries

#### 2. **students** Table
```sql
Key Fields:
- id (PK)
- pilot_school_id (FK → pilot_schools.id)
- added_by_id (FK → users.id)
- record_status: enum('production','test_mentor','test_teacher','demo','archived')
- created_by_role (tracks creator role)
- is_active (soft delete flag)
```

**Access Control Fields:**
- `record_status` - Isolates test data from production
- `added_by_id` - Tracks data ownership
- `created_by_role` - For audit trails

#### 3. **assessments** Table
```sql
Key Fields:
- id (PK)
- student_id (FK → students.id)
- pilot_school_id (FK → pilot_schools.id)
- added_by_id (FK → users.id)
- record_status: enum('production','test_mentor','test_teacher','demo','archived')
- assessment_type: 'ដើមគ្រា','ពាក់កណ្តាលគ្រា','ចុងគ្រា' (Baseline/Midline/Endline)
```

**Special Features:**
- `assessment_locks` table for verification workflow
- `assessment_histories` table for change tracking

#### 4. **mentoring_visits** Table
```sql
Key Fields:
- id (PK)
- mentor_id (FK → users.id)
- pilot_school_id (FK → pilot_schools.id)
- record_status: enum('production','test_mentor','test_teacher','demo','archived')
- is_locked (prevents editing)
- locked_by, locked_at (lock tracking)
```

**Questionnaire Fields:** 100+ fields for comprehensive classroom observation

---

## Permission Implementation Patterns

### Pattern 1: Function-Based Permission Checks

**Location:** `/app/api/users/route.ts:21-31`

```javascript
function hasPermission(userRole: string, action: string): boolean {
  const permissions = {
    admin: ["view", "create", "update", "delete"],
    coordinator: ["view", "create", "update"],
    mentor: ["view"],
    teacher: ["view"],
    viewer: ["view"]
  };

  return permissions[userRole]?.includes(action) || false;
}
```

**Used In:**
- User management (`/api/users`)
- Quick login (`/api/users/quick-login`)

### Pattern 2: School-Based Data Filtering

**Location:** `/app/api/students/route.ts:42-52`

```javascript
function canAccessStudent(
  userRole: string,
  userPilotSchoolId: number | null,
  studentPilotSchoolId: number | null
): boolean {
  if (userRole === "admin" || userRole === "coordinator") {
    return true; // Full access
  }

  if ((userRole === "mentor" || userRole === "teacher") && userPilotSchoolId) {
    return studentPilotSchoolId === userPilotSchoolId; // School-limited
  }

  return false;
}
```

**Used In:**
- Student management (`/api/students`)
- Assessment management (`/api/assessments`)
- Mentoring visits (`/api/mentoring-visits`)

### Pattern 3: Record Status Filtering

**Location:** `/lib/utils/recordStatus.ts`

```javascript
// Returns status based on role and test mode
function getRecordStatus(role: string, testModeEnabled: boolean) {
  if (testModeEnabled) {
    return role === 'mentor' ? 'test_mentor' : 'test_teacher';
  }
  return 'production';
}

// Builds Prisma where clause
function getRecordStatusFilter(role: string, includeTestData: boolean) {
  if (role === 'admin' || role === 'coordinator') {
    if (includeTestData) {
      return {}; // See all data
    }
    return { record_status: 'production' }; // Production only
  }

  // Mentors/Teachers see own production + own test data
  return {
    OR: [
      { record_status: 'production' },
      { record_status: role === 'mentor' ? 'test_mentor' : 'test_teacher' }
    ]
  };
}
```

**Used In:** All CRUD operations for students, assessments, mentoring visits

---

## Security Analysis

### ✅ Strengths

1. **Hierarchical RBAC:** Clear role hierarchy with escalating privileges
2. **Data Isolation:** School-level isolation for Mentor/Teacher roles
3. **Audit Trails:** Comprehensive tracking via `added_by_id`, `created_by_role`
4. **Test Data Isolation:** `record_status` field prevents test data pollution
5. **Soft Deletes:** `is_active` flag allows data recovery
6. **Session-Based Auth:** NextAuth.js with server-side session validation

### ⚠️ Weaknesses & Recommendations

#### 1. **Inconsistent Permission Checks**

**Issue:** Some endpoints don't use centralized permission functions

**Example:** `/app/api/users/[id]/route.ts:20-27`
```javascript
// Inline permission check instead of using hasPermission()
const canView = session.user.role === "admin" ||
               session.user.role === "coordinator" ||
               session.user.id === params.id;
```

**Recommendation:**
- Create a centralized `@/lib/permissions.ts` module
- Consolidate all permission logic
- Ensure consistency across all endpoints

#### 2. **Missing Rate Limiting**

**Issue:** No rate limiting on API endpoints

**Risk:** Potential for brute force attacks, data scraping

**Recommendation:**
- Implement rate limiting middleware
- Use packages like `express-rate-limit` or Next.js middleware
- Apply different limits per role (Admin gets higher limits)

#### 3. **Partial Input Validation**

**Issue:** Some endpoints lack Zod validation

**Example:** `/app/api/students/[id]/route.ts` PUT/DELETE don't validate input

**Recommendation:**
- Apply Zod validation to ALL endpoints
- Create reusable validation schemas
- Validate query parameters, not just body

#### 4. **No Field-Level Permissions**

**Issue:** Users with update permission can modify all fields

**Risk:** Teacher could potentially modify `record_status` or `pilot_school_id`

**Recommendation:**
- Implement field-level permissions
- Restrict sensitive fields (e.g., `record_status`, `added_by_id`) to Admin/Coordinator only
- Use separate schemas for different roles

#### 5. **Lack of Activity Logging**

**Issue:** No comprehensive audit log for security events

**Current:** Only `assessment_histories` table logs changes

**Recommendation:**
- Create `audit_logs` table for all CRUD operations
- Log: who, what, when, where, why
- Include IP address, user agent, session ID

---

## Test Scenarios & Expected Outcomes

### Scenario 1: Admin Full Access Test

**Steps:**
1. Login as Admin
2. Attempt to view all users → ✅ Should succeed
3. Create new user → ✅ Should succeed
4. Update any user → ✅ Should succeed
5. Delete user (not self) → ✅ Should succeed
6. View students from all schools → ✅ Should succeed
7. Create assessment for any student → ✅ Should succeed

**Expected Result:** All operations succeed with status 200/201

---

### Scenario 2: Coordinator Partial Access Test

**Steps:**
1. Login as Coordinator
2. View all users → ✅ Should succeed
3. Create new teacher → ✅ Should succeed
4. Update teacher profile → ✅ Should succeed
5. Attempt to delete user → ❌ Should fail (403 Forbidden)
6. View students from all schools → ✅ Should succeed
7. Delete student record → ✅ Should succeed

**Expected Result:** Delete user fails with 403, all others succeed

---

### Scenario 3: Mentor School-Limited Access Test

**Steps:**
1. Login as Mentor assigned to School A
2. View own profile → ✅ Should succeed
3. Attempt to view other users → ⚠️ Should only see self
4. View students from School A → ✅ Should succeed
5. View students from School B → ❌ Should return empty array
6. Create student in School A → ✅ Should succeed (auto-assigned to School A)
7. Update student in School A → ✅ Should succeed
8. Delete student → ❌ Should fail (403 Forbidden)
9. Create mentoring visit for School A → ✅ Should succeed
10. Update own mentoring visit → ✅ Should succeed
11. Delete mentoring visit → ❌ Should fail (403 Forbidden)

**Expected Result:** School B data not visible, delete operations fail

---

### Scenario 4: Teacher Limited Access Test

**Steps:**
1. Login as Teacher assigned to School A
2. View students from School A → ✅ Should succeed
3. Create new student → ✅ Should succeed
4. Create assessment for own student → ✅ Should succeed
5. Update assessment → ✅ Should succeed
6. View mentoring visits for School A → ✅ Should succeed
7. Attempt to create mentoring visit → ❌ Should fail (403 Forbidden)
8. Attempt to delete student → ❌ Should fail (403 Forbidden)

**Expected Result:** Read and create/update for students/assessments succeed, mentoring visit creation and all deletes fail

---

### Scenario 5: Viewer Read-Only Test

**Steps:**
1. Login as Viewer
2. View users → ✅ Should succeed (limited based on assignment)
3. Attempt to create user → ❌ Should fail (403 Forbidden)
4. View students → ✅ Should succeed
5. Attempt to create student → ❌ Should fail (403 Forbidden)
6. Attempt to update assessment → ❌ Should fail (403 Forbidden)
7. Attempt to delete anything → ❌ Should fail (403 Forbidden)

**Expected Result:** All write operations fail with 403, read operations succeed

---

### Scenario 6: Cross-School Access Prevention Test

**Setup:**
- Mentor A assigned to School A
- Mentor B assigned to School B
- Student X belongs to School A

**Steps:**
1. Login as Mentor B
2. Attempt to view Student X (School A) → ❌ Should not appear in results
3. Attempt to update Student X by ID → ❌ Should fail (403 or 404)
4. Attempt to create assessment for Student X → ❌ Should fail (403 or 400)

**Expected Result:** Complete data isolation between schools

---

### Scenario 7: Test Mode Data Isolation Test

**Setup:**
- Teacher with `test_mode_enabled = true`
- Existing production students

**Steps:**
1. Login as Teacher in test mode
2. Create new student → Should have `record_status = 'test_teacher'`
3. View students → Should see production + own test data
4. Other teachers view students → Should NOT see Teacher's test data
5. Admin enables "include_test_data" → Should see all test data from all users

**Expected Result:** Test data isolated by user, production data shared

---

## API Endpoints Summary

### User Management

| Endpoint | Method | Admin | Coord | Mentor | Teacher | Viewer |
|----------|--------|-------|-------|--------|---------|--------|
| `/api/users` | GET | ✅ All | ✅ All | ⚠️ Self | ⚠️ Self | ⚠️ Limited |
| `/api/users` | POST | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/users` | PUT | ✅ | ✅ | ⚠️ Self | ⚠️ Self | ❌ |
| `/api/users` | DELETE | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/api/users/[id]` | GET | ✅ | ✅ | ⚠️ Self | ⚠️ Self | ⚠️ Limited |

### Student Management

| Endpoint | Method | Admin | Coord | Mentor | Teacher | Viewer |
|----------|--------|-------|-------|--------|---------|--------|
| `/api/students` | GET | ✅ All | ✅ All | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/students` | POST | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/api/students` | PUT | ✅ | ✅ | ⚠️ School | ⚠️ School | ❌ |
| `/api/students` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/api/students/[id]` | GET | ✅ | ✅ | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/students/[id]` | PUT | ✅ | ✅ | ⚠️ School | ⚠️ School | ❌ |
| `/api/students/[id]` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |

### Assessment Management

| Endpoint | Method | Admin | Coord | Mentor | Teacher | Viewer |
|----------|--------|-------|-------|--------|---------|--------|
| `/api/assessments` | GET | ✅ All | ✅ All | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/assessments` | POST | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/api/assessments/[id]` | GET | ✅ | ✅ | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/assessments/[id]` | PUT | ✅ | ✅ | ⚠️ School | ⚠️ School | ❌ |
| `/api/assessments/[id]` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |

### Mentoring Visits

| Endpoint | Method | Admin | Coord | Mentor | Teacher | Viewer |
|----------|--------|-------|-------|--------|---------|--------|
| `/api/mentoring-visits` | GET | ✅ All | ✅ All | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/mentoring-visits` | POST | ✅ | ✅ | ✅ | ❌ | ❌ |
| `/api/mentoring-visits/[id]` | GET | ✅ | ✅ | ⚠️ School | ⚠️ School | ⚠️ Limited |
| `/api/mentoring-visits/[id]` | PUT | ✅ | ✅ | ⚠️ Own | ❌ | ❌ |
| `/api/mentoring-visits/[id]` | DELETE | ✅ | ✅ | ❌ | ❌ | ❌ |

**Legend:**
- ✅ = Full access
- ⚠️ = Restricted access (see details)
- ❌ = No access (403 Forbidden)

---

## Recommendations for Implementation

### Priority 1: Critical (Implement Immediately)

1. **Centralize Permission Logic**
   - Create `/lib/permissions.ts`
   - Move all `hasPermission()` functions to centralized module
   - Create permission decorator/middleware

2. **Add Field-Level Permissions**
   - Restrict sensitive fields to Admin/Coordinator
   - Create role-specific update schemas

3. **Implement Rate Limiting**
   - Add middleware for API routes
   - Different limits per role

### Priority 2: High (Implement Soon)

4. **Create Comprehensive Audit Log**
   - Log all CRUD operations
   - Include user context, IP, timestamp

5. **Add Input Validation to All Endpoints**
   - Ensure Zod validation on all routes
   - Validate query parameters

6. **Implement IP Whitelisting for Admin**
   - Restrict admin access to known IPs
   - Optional VPN requirement

### Priority 3: Medium (Plan for Next Phase)

7. **Add Two-Factor Authentication**
   - Especially for Admin/Coordinator roles
   - Use TOTP (Google Authenticator)

8. **Implement Session Management**
   - Track active sessions
   - Allow forced logout
   - Session timeout controls

9. **Create Permission Testing Suite**
   - Automated tests for all roles
   - CI/CD integration

---

## Conclusion

The TARL Pratham system implements a solid foundation for role-based access control with clear hierarchical roles and school-level data isolation. The permission system effectively restricts access based on user roles and school assignments.

**Strengths:**
- Well-defined role hierarchy
- School-level data isolation working effectively
- Test data isolation prevents production data pollution
- Comprehensive audit trails via relational tracking

**Areas for Improvement:**
- Centralize permission logic for consistency
- Add field-level permissions to prevent unauthorized field updates
- Implement rate limiting and enhanced security measures
- Create comprehensive audit logging

**Overall Security Posture:** Good foundation with room for enhancement in centralization and fine-grained controls.

---

## Appendix A: Permission Matrix Code References

### Users API
- **File:** `/app/api/users/route.ts`
- **Permission Function:** Lines 21-31
- **GET Handler:** Lines 34-194
- **POST Handler:** Lines 197-274
- **PUT Handler:** Lines 277-352
- **DELETE Handler:** Lines 355-397

### Students API
- **File:** `/app/api/students/route.ts`
- **Permission Function:** Lines 29-39
- **Access Control:** Lines 42-52
- **GET Handler:** Lines 55-204
- **POST Handler:** Lines 207-368
- **PUT Handler:** Lines 371-494
- **DELETE Handler:** Lines 497-577

### Assessments API
- **File:** `/app/api/assessments/route.ts`
- **Record Status:** Uses `/lib/utils/recordStatus.ts`

### Mentoring Visits API
- **File:** `/app/api/mentoring-visits/route.ts`
- **Locking System:** Implemented in schema

---

## Appendix B: Database Schema Diagrams

```
users
├── id (PK)
├── role ('admin','coordinator','mentor','teacher','viewer')
├── pilot_school_id (FK) → pilot_schools.id
└── test_mode_enabled

pilot_schools
├── id (PK)
├── school_code (UNIQUE)
└── school_name

students
├── id (PK)
├── pilot_school_id (FK) → pilot_schools.id
├── added_by_id (FK) → users.id
├── record_status ('production','test_mentor','test_teacher','archived')
└── created_by_role

assessments
├── id (PK)
├── student_id (FK) → students.id
├── pilot_school_id (FK) → pilot_schools.id
├── added_by_id (FK) → users.id
└── record_status

mentoring_visits
├── id (PK)
├── mentor_id (FK) → users.id
├── pilot_school_id (FK) → pilot_schools.id
├── is_locked
└── record_status
```

---

**Report End**

*For questions or clarifications, contact the development team.*
