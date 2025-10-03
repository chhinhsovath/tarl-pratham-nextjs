# Mentor Role Corrections & Clarifications
**TaRL Pratham Platform**
**Date:** October 3, 2025
**Status:** ✅ Corrections Based on Actual Implementation

---

## Purpose

This document corrects and clarifies the mentor role capabilities based on the actual platform implementation, as verified by the system owner.

---

## Corrected Mentor Capabilities

### 1. ✅ **Student Visibility - CORRECTED**

#### Previous (Incorrect) Understanding:
> "Mentors can only see students they created with `added_by_id = mentor.id`"

#### **Actual Implementation (CORRECT):**
> **Mentors can see ALL students at their assigned school, regardless of who created them.**

**Scope:**
```sql
SELECT * FROM students
WHERE pilot_school_id = mentor.pilot_school_id
  AND is_active = TRUE;
-- Shows ALL students at assigned school
-- NOT filtered by added_by_id
```

**What This Means:**
- Mentor sees students created by teachers
- Mentor sees students created by other mentors
- Mentor sees students created by coordinators
- Mentor sees students created by themselves
- **Filter:** Only students at `pilot_school_id` (assigned school)

**Use Cases:**
- Monitor all student progress at assigned school
- Verify assessments for all students
- Create assessments for any student at school
- Support all teachers at the school

---

### 2. ✅ **School Scope - CONFIRMED CORRECT**

**Implementation:**
> **Mentors can ONLY view data for the school they set up in their profile.**

**Profile Setup:**
- During onboarding: Mentor selects `pilot_school_id`
- This assignment is stored in `users.pilot_school_id`
- All data access is filtered by this `pilot_school_id`

**Data Visibility:**
```
Mentor Profile: pilot_school_id = 33

Can See:
✅ Students WHERE pilot_school_id = 33
✅ Teachers WHERE pilot_school_id = 33
✅ Assessments WHERE pilot_school_id = 33
✅ Classes WHERE pilot_school_id = 33
✅ Observations WHERE pilot_school_id = 33

Cannot See:
❌ Any data from pilot_school_id = 34
❌ Any data from pilot_school_id = 35
❌ Cross-school reports
```

**This Confirms:**
- ✅ School-scoped access (same as teachers)
- ✅ Set during profile setup
- ✅ Cannot change school without admin
- ✅ All queries filtered by pilot_school_id

---

### 3. ✅ **Teacher Visibility - CONFIRMED**

**Implementation:**
> **Mentors can view ALL teachers at their assigned school.**

**Access:**
```sql
SELECT * FROM users
WHERE pilot_school_id = mentor.pilot_school_id
  AND role = 'teacher'
  AND is_active = TRUE;
```

**What Mentors Can See:**
- Teacher names
- Teacher contact information
- Teacher assessment activity
- Teacher profile details
- Teacher performance metrics

**What Mentors Can Do:**
- Assign teachers to observations
- Monitor teacher assessment quality
- Provide teacher feedback
- Track teacher improvement

**What Mentors CANNOT Do:**
- Create teacher accounts (coordinator/admin only)
- Delete teachers (admin only)
- Change teacher passwords (teacher's own action)
- Modify teacher roles (admin only)

---

### 4. ✅ **Class Creation - ADDED CAPABILITY**

**Implementation:**
> **Mentors CAN create classes at their assigned school.**

**Class Management Features:**

#### Create Class
```
Navigate to: /classes or /school-classes
Click: "Create New Class"
Fill Form:
  - Class name (e.g., "Grade 4A")
  - Grade level (Grade 4 or Grade 5)
  - School (auto-filled: assigned school)
  - Teacher assignment (optional)
Submit → Class created
```

#### What Mentors Can Do:
- ✅ Create new classes
- ✅ View all classes at school
- ✅ Update class information
- ❌ Delete classes (likely restricted)

**Use Cases:**
- Set up classes for new school year
- Organize students by grade level
- Assign teachers to classes
- Support school administration

**Database:**
```sql
INSERT INTO classes (
  class_name, grade_level, pilot_school_id,
  teacher_id, created_by_id
) VALUES (
  'Grade 4A', 4, {mentor.pilot_school_id},
  {teacher_id}, {mentor.id}
);
```

---

### 5. ✅ **Student Creation - CONFIRMED**

**Implementation:**
> **Mentors CAN create students at their assigned school.**

**Student Management:**
- ✅ Create students (same as teachers)
- ✅ Edit students (same as teachers)
- ✅ View students (ALL at assigned school)
- ✅ Soft delete students (same as teachers)

**Key Difference from Previous Doc:**
- Students created by mentor: `added_by_id = mentor.id`
- But mentor can see ALL students, not just their own
- Mentor can edit ANY student at assigned school
- Mentor can assess ANY student at assigned school

---

### 6. ✅ **Assessment Capabilities - CONFIRMED**

**Implementation:**
> **Mentors can conduct assessments (baseline, midline, endline) for ANY student at assigned school.**

#### Assessment Types:
1. **Baseline** - Initial assessment
2. **Midline** - Progress check
3. **Endline** - Final assessment

#### Mentor Assessment Workflow:
```
1. Navigate to /assessments/create
2. Select ANY student from assigned school
3. Choose assessment type (baseline/midline/endline)
4. Select subject (language/math)
5. Conduct assessment
6. Record level and score
7. Submit → Assessment created with:
   - created_by_role: 'mentor'
   - added_by_id: {mentor.id}
   - status: 'pending' (awaiting verification)
   - is_locked: false
```

**Key Points:**
- ✅ Can assess ANY student at school (not limited to own students)
- ✅ Can create baseline, midline, endline
- ✅ Can edit assessments before verification
- ✅ Own assessments need verification (cannot self-verify immediately)
- ✅ Can verify after creating (separate action)

---

### 7. ✅ **Verification Capabilities - CLARIFIED**

**Implementation:**
> **Mentors can verify BOTH teacher assessments AND mentor's own assessments.**

#### Verification Scope:

**Can Verify:**
1. ✅ Assessments created by teachers at assigned school
2. ✅ Assessments created by themselves (mentors)
3. ✅ Assessments created by other mentors at same school (if applicable)

**Verification Workflow:**
```
1. Navigate to /verification or /assessments/verify
2. View ALL pending assessments at assigned school
   - Filter shows: Teacher-created AND Mentor-created
3. Select assessment to review
4. Check details:
   - Student name
   - Assessment type
   - Subject and level
   - Score
   - Created by: [Teacher Name] OR [Mentor Name]
5. Verify or Reject with notes
6. Lock if finalized
```

**Important:**
- ❌ Cannot self-verify immediately upon creation
- ✅ Must create assessment first, then verify separately
- ✅ Can verify own assessments in verification queue
- ✅ Can verify teacher assessments
- ✅ No restriction on who created the assessment

**Database:**
```sql
-- Verification queue shows ALL pending
SELECT * FROM assessments
WHERE pilot_school_id = {mentor.pilot_school_id}
  AND status = 'pending'
  AND is_active = TRUE;
-- Includes assessments by teachers AND mentors
```

---

### 8. ✅ **Observation Management - CORRECTED**

**Implementation:**
> **Mentors have CRU (Create, Read, Update) on observations - NO DELETE capability.**

#### Previous (Incorrect):
> "Mentors have full CRUD on mentoring visits"

#### **Actual (CORRECT):**

**Mentor CAN:**
- ✅ **Create** observations (mentoring visits)
- ✅ **Read** observations (view details)
- ✅ **Update** observations (edit before locking)

**Mentor CANNOT:**
- ❌ **Delete** observations (no delete capability)

**Implications:**
- Once observation is created, it cannot be deleted
- Mentor can update/edit observation until locked
- After locking, observation becomes read-only
- No soft delete or hard delete available
- Must contact admin to remove incorrect observations

**Workflow:**
```
Create Observation:
  Navigate to /mentoring/create
  Fill comprehensive form (100+ fields)
  Submit → Observation created
  Status: is_locked = false

Update Observation:
  Navigate to /mentoring/[id]/edit
  Modify fields
  Save changes
  Can update multiple times

Lock Observation:
  Navigate to /mentoring/[id]
  Click "Lock Observation"
  Confirm → is_locked = true
  Cannot edit anymore
  Cannot unlock (permanent)

❌ Delete Observation:
  NO delete button available
  Cannot soft delete
  Cannot hard delete
  Contact admin if removal needed
```

**Why No Delete:**
- Observations are official records
- Historical documentation purposes
- Audit trail requirements
- Prevent accidental loss of data
- Maintain accountability

**Workaround for Mistakes:**
- Mark as "Cancelled" status
- Add note: "Created in error"
- Lock to prevent further changes
- Admin can delete if absolutely necessary

---

## Updated Feature Count

### Mentor Role Features (CORRECTED)

#### 1. Student Management (4 features)
- ✅ View ALL students at assigned school (not just own)
- ✅ Create students
- ✅ Edit ANY student at assigned school
- ✅ Delete students (soft delete)

#### 2. Teacher Management (2 features)
- ✅ View ALL teachers at assigned school
- ✅ Assign teachers to classes/observations

#### 3. Class Management (3 features) - **NEW**
- ✅ Create classes at assigned school
- ✅ View all classes
- ✅ Update class information

#### 4. Assessment Management (9 features)
- ✅ View ALL assessments at assigned school
- ✅ Create assessments for ANY student
- ✅ Conduct baseline assessments
- ✅ Conduct midline assessments
- ✅ Conduct endline assessments
- ✅ Edit assessments (before verification)
- ✅ Delete assessments (soft delete)
- ✅ Add assessment notes
- ✅ Track assessment history

#### 5. Verification (7 features)
- ✅ View verification queue
- ✅ Verify teacher assessments
- ✅ Verify mentor assessments (including own)
- ✅ Reject assessments with notes
- ✅ Bulk verify assessments
- ✅ Lock assessments
- ✅ Unlock assessments

#### 6. Observation Management (11 features) - **CORRECTED**
- ✅ Create comprehensive observations
- ✅ View observation list
- ✅ View observation details
- ✅ Update observations (before lock)
- ✅ Record classroom observations
- ✅ Document teacher performance
- ✅ Upload observation photos
- ✅ Add feedback and recommendations
- ✅ Create action plans
- ✅ Lock observations (finalize)
- ❌ Delete observations - **NOT AVAILABLE**

#### 7. Dashboard & Reporting (6 features)
- ✅ View mentor dashboard
- ✅ View teacher workspace
- ✅ Access reports
- ✅ Export reports
- ✅ Mentoring impact analysis
- ✅ Custom report generation

#### 8. Profile Management (2 features)
- ✅ Edit profile
- ✅ Change password

**Total: 44 features** (reduced from 52 due to corrections)

---

## Updated Comparison Table

| Feature | Teacher | Mentor | Notes |
|---------|---------|--------|-------|
| **View Students** | Own school | Own school | Both see ALL students |
| **Create Students** | ✅ | ✅ | Same capability |
| **Edit Students** | Own school | Own school | Mentor can edit ANY student |
| **Delete Students** | ✅ | ✅ | Soft delete |
| **View Teachers** | ❌ | ✅ | **Mentor only** |
| **Create Classes** | ❌ | ✅ | **Mentor only** |
| **Create Assessments** | ✅ | ✅ | Both can create |
| **Verify Assessments** | ❌ | ✅ | **Mentor only** |
| **Verify Own Assessments** | ❌ | ✅ | **Mentor only** (separate action) |
| **Delete Assessments** | ❌ | ✅ | **Mentor only** |
| **Create Observations** | ❌ | ✅ | **Mentor only** |
| **Update Observations** | ❌ | ✅ | **Mentor only** |
| **Delete Observations** | ❌ | ❌ | **Neither** (no delete) |
| **School Scope** | 1 school | 1 school | Same limitation |

---

## Key Corrections Summary

### ✅ What Changed:

1. **Student Visibility**
   - OLD: "Only own students"
   - NEW: "ALL students at assigned school"

2. **Class Management**
   - OLD: Not mentioned
   - NEW: Can create and manage classes

3. **Observation Delete**
   - OLD: Full CRUD (including delete)
   - NEW: CRU only (NO delete)

4. **Verification Scope**
   - OLD: Only teacher assessments
   - NEW: Teacher AND mentor assessments

5. **Feature Count**
   - OLD: 52 features
   - NEW: 44 features (more accurate)

### ✅ What Stayed the Same:

1. ✅ School-scoped access (correct)
2. ✅ Can create students (correct)
3. ✅ Can verify assessments (correct)
4. ✅ Can create observations (correct)
5. ✅ Profile setup determines school (correct)

---

## Updated Talking Points for Boss

### **Mentor Capabilities (CORRECTED):**

> "Mentors have **44 comprehensive features** focused on school-wide support and quality control. They can see ALL students and teachers at their assigned school, create classes, conduct assessments, verify ALL assessments (including their own), and create detailed observations with full update capabilities."

### **Key Differentiators:**

1. **School-Wide Visibility**
   - Mentors see ALL students (not just own)
   - Mentors see ALL teachers
   - Mentors see ALL assessments
   - Full school oversight within assigned school

2. **Class Management**
   - Can create and organize classes
   - Support school administration
   - Assign teachers to classes

3. **Flexible Assessment**
   - Can assess ANY student at school
   - Can verify teacher assessments
   - Can verify own assessments (separate action)
   - Full quality control capability

4. **Observation Accountability**
   - Can create and update observations
   - Cannot delete (permanent record)
   - Lock mechanism for finalization
   - Maintains data integrity

### **Limitations:**

1. ❌ Cannot delete observations (CRU only)
2. ❌ Cannot access other schools (single school scope)
3. ❌ Cannot create teacher accounts (admin only)
4. ❌ Cannot self-verify immediately (must create first, verify later)

---

## Recommendation

**Update Main Verification Document:**
- Replace "52 mentor features" with "44 mentor features"
- Clarify student visibility (ALL students, not just own)
- Add class management section
- Correct observation management (CRU, not CRUD)
- Update verification scope (teacher AND mentor assessments)

**Files to Update:**
1. `TEACHER_MENTOR_ROLE_VERIFICATION.md` - Main verification doc
2. `STAKEHOLDER_PRESENTATION.md` - Feature counts
3. `EXECUTIVE_SUMMARY.md` - Quick facts
4. `public/presentation.html` - Web presentation

---

**Document Status:** ✅ Corrections Documented
**Date:** October 3, 2025
**Verified By:** System Owner Clarification
