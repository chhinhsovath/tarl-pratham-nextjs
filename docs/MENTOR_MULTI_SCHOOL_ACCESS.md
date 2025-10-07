# Mentor Multi-School Access System

## 📋 Overview

This document describes the comprehensive mentor multi-school access system that allows coordinators to assign mentors to multiple schools for specific subjects (Language and/or Math).

## 🎯 Key Features

### 1. **Multi-School Assignment**
- Coordinators can assign one mentor to multiple schools
- Each assignment is subject-specific (Language or Math)
- One mentor can be assigned to different schools for different subjects
- Example: Mentor A → School 1 (Language), School 2 (Math), School 3 (Language + Math)

### 2. **Backwards Compatibility**
- System maintains compatibility with old single-school setup
- If a mentor has no assignments in `mentor_school_assignments` table, the system falls back to `user.pilot_school_id`
- Legacy mentors continue working without disruption

### 3. **Comprehensive Dashboard**
- Mentors see all their assigned schools in one dashboard
- Statistics aggregated across all schools
- School selector for filtering data
- Subject-specific indicators

## 🗄️ Database Schema

### Table: `mentor_school_assignments`

```sql
CREATE TABLE mentor_school_assignments (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER NOT NULL REFERENCES users(id),
  pilot_school_id INTEGER NOT NULL REFERENCES pilot_schools(id),
  subject VARCHAR(255) NOT NULL, -- "Language" or "Math"
  assigned_by_id INTEGER REFERENCES users(id),
  assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(mentor_id, pilot_school_id, subject)
);
```

**Indexes:**
- `idx_mentor_school_assignments_mentor_id`
- `idx_mentor_school_assignments_pilot_school_id`
- `idx_mentor_school_assignments_subject`
- `idx_mentor_school_assignments_is_active`

## 📁 File Structure

### Core Utilities

**`lib/mentorAssignments.ts`**
- `getMentorAssignedSchools()` - Get all schools assigned to a mentor
- `getMentorSchoolIds()` - Get array of school IDs
- `getMentorAssignedSubjects()` - Get subjects mentor teaches
- `canMentorAccessSchool()` - Check if mentor can access a school
- `getMentorAssignmentStats()` - Get assignment statistics
- `getMentorDetailedAssignments()` - Get full assignment details

**`lib/mentorAuthorization.ts`**
- `canMentorAccessStudent()` - Validate student access
- `canMentorAccessAssessment()` - Validate assessment access
- `canMentorAccessVisit()` - Validate visit access
- `getMentorAccessWhereClause()` - Build Prisma where clause
- `getMentorAuthContext()` - Get comprehensive auth context

### API Endpoints

#### Mentor Assignment Management
- **POST** `/api/mentor-assignments` - Create new assignment
- **GET** `/api/mentor-assignments` - List assignments
- **PUT** `/api/mentor-assignments` - Update assignment
- **DELETE** `/api/mentor-assignments` - Delete assignment

#### Mentor Dashboard
- **GET** `/api/dashboard/mentor` - Get dashboard data
- **GET** `/api/mentor/schools` - Get mentor's assigned schools

#### Updated APIs (Multi-School Support)
- **GET** `/api/students` - Now supports multi-school for mentors
- **GET** `/api/assessments` - Now supports multi-school for mentors
- **GET** `/api/mentoring-visits` - Now supports multi-school for mentors

### UI Components

**Pages:**
- `/coordinator/mentor-assignments` - Coordinator assignment management page
- `/mentor/dashboard` - Mentor dashboard showing all schools

**Components:**
- `components/mentor/SchoolSelector.tsx` - Reusable school selector

## 🔐 Authorization Flow

### How Multi-School Access Works

```typescript
// Old (Single School)
if (session.user.role === "mentor") {
  where.pilot_school_id = session.user.pilot_school_id;
}

// New (Multi-School)
if (session.user.role === "mentor") {
  const schoolIds = await getMentorSchoolIds(mentorId);
  where.pilot_school_id = { in: schoolIds };
}
```

### Backwards Compatibility Logic

```typescript
async function getMentorSchoolIds(mentorId: number) {
  // 1. Try to get from assignments table
  const assignments = await prisma.mentorSchoolAssignment.findMany({
    where: { mentor_id: mentorId, is_active: true }
  });

  if (assignments.length > 0) {
    return assignments.map(a => a.pilot_school_id);
  }

  // 2. Fallback to user.pilot_school_id (backwards compat)
  const user = await prisma.user.findUnique({ where: { id: mentorId }});
  if (user?.pilot_school_id) {
    return [user.pilot_school_id];
  }

  // 3. No access
  return [];
}
```

## 🚀 Usage Examples

### For Coordinators

#### 1. Assign Mentor to School

```bash
POST /api/mentor-assignments
{
  "mentor_id": 123,
  "pilot_school_id": 45,
  "subject": "Language",
  "notes": "Primary language mentor for this school"
}
```

#### 2. List All Assignments

```bash
GET /api/mentor-assignments?mentor_id=123
```

#### 3. Update Assignment Status

```bash
PUT /api/mentor-assignments
{
  "id": 1,
  "is_active": false,
  "notes": "Temporarily inactive due to leave"
}
```

### For Mentors

#### 1. View Dashboard

Navigate to `/mentor/dashboard` to see:
- All assigned schools
- Student counts per school
- Assessment statistics
- Recent activities
- School selector for filtering

#### 2. Using School Selector Component

```tsx
import SchoolSelector from "@/components/mentor/SchoolSelector";

function MyComponent() {
  const [selectedSchool, setSelectedSchool] = useState<number | "all">("all");

  return (
    <SchoolSelector
      value={selectedSchool}
      onChange={setSelectedSchool}
      allowAll={true}
      showSubjectTag={true}
    />
  );
}
```

## 🔧 API Integration Examples

### Students API (Multi-School)

```typescript
// Before
const students = await prisma.student.findMany({
  where: {
    pilot_school_id: session.user.pilot_school_id // Single school
  }
});

// After
const mentorSchoolIds = await getMentorSchoolIds(mentorId);
const students = await prisma.student.findMany({
  where: {
    pilot_school_id: { in: mentorSchoolIds } // Multiple schools
  }
});
```

### Assessments API (Multi-School + Subject Filtering)

```typescript
const mentorSchoolIds = await getMentorSchoolIds(mentorId);

// Optional: Add subject filtering
const assignedSubjects = await getMentorAssignedSubjects(mentorId);

const assessments = await prisma.assessment.findMany({
  where: {
    pilot_school_id: { in: mentorSchoolIds },
    // Uncomment for strict subject filtering:
    // subject: { in: assignedSubjects.map(s => s.toLowerCase()) }
  }
});
```

## 📊 Dashboard Data Structure

```typescript
{
  "mentor": {
    "id": 123,
    "name": "Mentor Name",
    "email": "mentor@example.com"
  },
  "assignments": {
    "total": 5,           // Total assignment records
    "schools": 3,         // Unique schools
    "subjects": ["Language", "Math"],
    "language_schools": 2,
    "math_schools": 2,
    "details": [
      {
        "assignment": {
          "pilot_school_id": 45,
          "subject": "Language",
          "pilot_school": {
            "school_name": "School A",
            "province": "Province X",
            "district": "District Y"
          }
        },
        "stats": {
          "student_count": 150,
          "language_assessments": 120,
          "math_assessments": 0,
          "total_assessments": 120,
          "recent_visits": 5
        }
      }
    ]
  },
  "summary": {
    "total_students": 450,
    "total_assessments": 320,
    "total_visits": 15,
    "pending_verifications": 8
  }
}
```

## 🎨 UI Features

### Coordinator Page (`/coordinator/mentor-assignments`)

**Features:**
- Create new assignments
- Filter by mentor, school, subject, or status
- Edit assignment notes and status
- Delete assignments
- Bilingual interface (Khmer/English)

**Validations:**
- Cannot assign same mentor to same school for same subject twice
- Validates mentor has "mentor" role
- Validates school exists
- Requires subject selection

### Mentor Dashboard (`/mentor/dashboard`)

**Features:**
- Summary cards (schools, students, assessments, visits)
- Subject responsibility badges
- School selector for filtering
- Detailed school assignments table
- Recent activities timeline
- Recent visits timeline
- Pending verifications alert

**Statistics Shown:**
- Per School: Students, Assessments (by subject), Recent visits
- Overall: Total students, Total assessments, Total visits
- Activities: Student additions, Assessment entries

## 🔄 Migration Path

### For Existing Mentors

1. **No Action Required**: Existing mentors continue working with `user.pilot_school_id`
2. **Coordinator Creates Assignments**: When coordinator assigns them to schools, new system takes over
3. **Automatic Transition**: System automatically uses assignments when available, falls back to user profile otherwise

### For New Mentors

1. **Profile Setup**: Create user with role="mentor"
2. **Assignment Creation**: Coordinator assigns to schools via `/coordinator/mentor-assignments`
3. **Access Granted**: Mentor immediately has access to all assigned schools

## 🐛 Troubleshooting

### Mentor Can't See Any Data

**Check:**
1. Does mentor have assignments in `mentor_school_assignments`?
   ```sql
   SELECT * FROM mentor_school_assignments WHERE mentor_id = X;
   ```
2. If no assignments, does mentor have `pilot_school_id` in users table?
   ```sql
   SELECT pilot_school_id FROM users WHERE id = X;
   ```
3. Are assignments active?
   ```sql
   SELECT * FROM mentor_school_assignments WHERE mentor_id = X AND is_active = true;
   ```

### Duplicate Assignment Error

**Issue**: "Assignment already exists for this mentor, school, and subject"

**Solution**: Check for existing assignment:
```sql
SELECT * FROM mentor_school_assignments
WHERE mentor_id = X
  AND pilot_school_id = Y
  AND subject = 'Language';
```

Either update the existing one or delete it first.

## 📝 Design Decisions

### Why Not Strict Subject Filtering?

Currently, assessments API shows ALL assessments at assigned schools, regardless of subject assignment. This was intentional because:

1. **Flexibility**: Mentors often help across subjects
2. **Visibility**: Better to see all school data for comprehensive oversight
3. **Optional Filtering**: Code includes commented-out strict filtering if needed

To enable strict subject filtering, uncomment in `app/api/assessments/route.ts:145-151`:

```typescript
const assignedSubjects = await getMentorAssignedSubjects(parseInt(session.user.id));
if (assignedSubjects.length > 0 && !subject) {
  where.subject = { in: assignedSubjects.map(s => s.toLowerCase()) };
}
```

### Why Backwards Compatibility?

Keeps existing mentors working without database migration. Gradual transition allows:
- Testing new system with select mentors
- No downtime or data migration
- Smooth rollout

## 🔮 Future Enhancements

1. **Auto-Expiring Assignments**: Add `valid_until` date
2. **Assignment Templates**: Preset configurations for common patterns
3. **Bulk Assignment**: Assign multiple mentors at once
4. **Assignment History**: Track who was assigned when
5. **Notification System**: Alert mentors when assigned to new schools
6. **Mobile Dashboard**: Optimize mentor dashboard for mobile devices
7. **Offline Support**: Cache assignments for offline access

## ✅ Testing Checklist

- [ ] Coordinator can create assignments
- [ ] Coordinator can update assignment status
- [ ] Coordinator can delete assignments
- [ ] Mentor sees all assigned schools in dashboard
- [ ] Mentor can filter by school
- [ ] Students API returns students from all assigned schools
- [ ] Assessments API returns assessments from all assigned schools
- [ ] Mentoring visits API returns visits from all assigned schools
- [ ] Backwards compatibility works (mentor without assignments uses pilot_school_id)
- [ ] School selector component works
- [ ] Dashboard statistics are accurate
- [ ] Cannot create duplicate assignments
- [ ] Authorization prevents unauthorized access

## 📞 Support

For issues or questions:
1. Check Supabase dashboard for data integrity
2. Review API logs for error messages
3. Verify mentor has correct role in users table
4. Check network tab for failed API calls
5. Verify Prisma client is up to date: `npx prisma generate`
