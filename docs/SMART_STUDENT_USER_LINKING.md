# Smart Student-User Linking System

## Overview

This system creates intelligent connections between `students` and `users` tables, enriching student information with teacher/user profile data for comprehensive student management.

---

## Database Schema Relationships

### User Table Fields Used:
- `email` - Teacher contact email
- `username` - Quick login username
- `role` - User role (teacher, mentor, admin, etc.)
- `pilot_school_id` - School assignment
- `subject` - Teaching subject
- `province` - Geographic assignment
- `district` - District assignment
- `phone` - Contact phone

### Student Table Relationships:
```typescript
Student {
  added_by_id      → User.id         // Who created this student
  pilot_school_id  → PilotSchool.id  // School assignment
  school_class_id  → SchoolClass.id  // Class assignment
}
```

---

## Smart Linking Features

### 1. Enriched Student Data
Each student record can now include:
- ✅ **Teacher Profile**: Email, username, role, subject, province, phone
- ✅ **School Info**: Name, code, province, district
- ✅ **Class Info**: Name, grade level
- ✅ **Assessment Levels**: Baseline, midline, endline (Khmer & Math)

### 2. Intelligent Filtering
Filter students by teacher profile:
```typescript
// By teacher's school
filters.schoolId = teacher.pilot_school_id

// By teacher's province
filters.province = teacher.province

// By teacher's subject
filters.subject = teacher.subject

// By specific teacher
filters.teacherId = teacher.id
```

### 3. Access Control
Smart permission checking:
```typescript
canTeacherAccessStudent(teacherProfile, student)
// Returns true/false based on:
// - Role (admin/coordinator = all access)
// - School match (teachers/mentors = same school only)
// - Province match (fallback)
```

---

## API Endpoints

### GET /api/students/enriched

Returns students with complete teacher/school profile data.

**Query Parameters:**
```
?id=123                  // Single student lookup
?schoolId=5             // Filter by school
?province=Phnom Penh    // Filter by province
?subject=Mathematics    // Filter by subject
?limit=50               // Results per page
?offset=0               // Pagination offset
```

**Response Example:**
```json
{
  "message": "Students retrieved successfully",
  "data": [
    {
      "id": 123,
      "name": "សុវត្ថិ",
      "age": 10,
      "gender": "male",
      "baseline_khmer_level": "word",
      "baseline_math_level": "letter",
      "teacher": {
        "id": 76,
        "name": "លោកគ្រូ សុខា",
        "email": "sokha@example.com",
        "username": "sokha.teacher",
        "role": "teacher",
        "subject": "Mathematics",
        "province": "Phnom Penh",
        "district": "Chamkar Mon",
        "phone": "+855 12 345 678"
      },
      "school": {
        "id": 5,
        "school_name": "Hun Sen Primary School",
        "school_code": "PP001",
        "province": "Phnom Penh",
        "district": "Chamkar Mon"
      },
      "class": {
        "id": 12,
        "name": "Grade 4A",
        "grade_level": "4"
      }
    }
  ],
  "stats": {
    "total_students": 45,
    "with_teacher": 45,
    "with_school": 45,
    "with_class": 42,
    "by_province": {
      "Phnom Penh": 30,
      "Kandal": 15
    },
    "by_teacher_subject": {
      "Mathematics": 25,
      "Khmer Language": 20
    }
  }
}
```

---

## Helper Functions

### 1. Get Single Enriched Student
```typescript
import { getEnrichedStudentData } from '@/lib/helpers/student-user-link';

const student = await getEnrichedStudentData(studentId);
// Returns: EnrichedStudentData | null
```

### 2. Get Multiple Students with Filtering
```typescript
import { getEnrichedStudentsList } from '@/lib/helpers/student-user-link';

const students = await getEnrichedStudentsList({
  teacherId: 76,
  schoolId: 5,
  province: "Phnom Penh",
  limit: 50,
  offset: 0
});
```

### 3. Format for Display
```typescript
import { formatStudentDisplay } from '@/lib/helpers/student-user-link';

const displayText = formatStudentDisplay(student);
// Returns: "សុវត្ថិ | ថ្នាក់: Grade 4A | សាលា: Hun Sen Primary | គ្រូ: លោកគ្រូ សុខា | ខេត្ត: Phnom Penh"
```

### 4. Check Access Permissions
```typescript
import { canTeacherAccessStudent } from '@/lib/helpers/student-user-link';

const hasAccess = canTeacherAccessStudent(
  {
    id: teacherId,
    role: "teacher",
    pilot_school_id: 5,
    province: "Phnom Penh"
  },
  student
);
// Returns: boolean
```

---

## React Component

### EnrichedStudentCard
Displays student info with linked teacher and school data.

```tsx
import EnrichedStudentCard from '@/components/students/EnrichedStudentCard';

<EnrichedStudentCard
  student={enrichedStudentData}
  showTeacherInfo={true}
  showSchoolInfo={true}
  showAssessmentLevels={true}
/>
```

**Features:**
- 👤 Student avatar with name, age, gender
- 🏫 School information with province/district
- 👨‍🏫 Teacher profile with email, phone, subject
- 📊 Assessment levels (baseline, midline, endline)
- 📋 Class information
- 📞 Copyable email and phone numbers

---

## Use Cases

### 1. Teacher Dashboard
Show all students assigned to the logged-in teacher:
```typescript
const students = await getEnrichedStudentsList({
  teacherId: session.user.id,
  limit: 100
});
```

### 2. School Administration
View all students in a specific school with teacher details:
```typescript
const students = await getEnrichedStudentsList({
  schoolId: schoolId,
  limit: 200
});
```

### 3. Provincial Reports
Generate reports for all students in a province:
```typescript
const students = await getEnrichedStudentsList({
  province: "Phnom Penh",
  limit: 1000
});
```

### 4. Subject-Based Analysis
Find all students taught by math teachers:
```typescript
const students = await getEnrichedStudentsList({
  subject: "Mathematics",
  limit: 500
});
```

---

## Smart Features Explained

### 🎯 Automatic School Linking
When a teacher creates a student:
```typescript
// Teacher profile has pilot_school_id = 5
// Student automatically gets pilot_school_id = 5
// Smart link: student.school.school_name appears in UI
```

### 📧 Email & Username Display
```typescript
// Show teacher contact in student profile
student.teacher.email    → "sokha@example.com"
student.teacher.username → "sokha.teacher"
```

### 🌍 Geographic Context
```typescript
// Province/district from both teacher AND school
student.teacher.province   → "Phnom Penh"
student.school.province    → "Phnom Penh"
// Match = good data quality!
```

### 📚 Subject Context
```typescript
// Know which subject teacher created this student
student.teacher.subject → "Mathematics"
// Useful for subject-specific reports
```

### 🔐 Role-Based Access
```typescript
// Admin sees all students
// Teacher sees only their school's students
// Mentor sees students from assigned schools
```

---

## Statistics & Analytics

The enriched API provides automatic stats:

```typescript
{
  stats: {
    total_students: 150,
    with_teacher: 148,      // 98.7% have teacher info
    with_school: 150,       // 100% have school info
    with_class: 142,        // 94.7% have class assignment
    by_province: {
      "Phnom Penh": 80,
      "Kandal": 45,
      "Kampong Cham": 25
    },
    by_teacher_subject: {
      "Mathematics": 60,
      "Khmer Language": 55,
      "Science": 35
    }
  }
}
```

---

## Benefits

✅ **Comprehensive Student Profiles**: All related info in one API call
✅ **Teacher Context**: Know who teaches each student
✅ **Geographic Intelligence**: Province/district for reporting
✅ **Subject Tracking**: Subject-specific analysis
✅ **Access Control**: Automatic permission checking
✅ **Data Quality**: Validate teacher-school-student relationships
✅ **Performance**: Efficient joins via Prisma
✅ **Type Safety**: Full TypeScript support

---

## Migration Path

### Before (Old Way):
```typescript
// Multiple API calls needed
const student = await getStudent(id);
const teacher = await getUser(student.added_by_id);
const school = await getSchool(student.pilot_school_id);
const classInfo = await getClass(student.school_class_id);
```

### After (Smart Way):
```typescript
// Single API call gets everything!
const student = await getEnrichedStudentData(id);
// student.teacher ✅
// student.school ✅
// student.class ✅
```

---

## Files Created

1. `/lib/helpers/student-user-link.ts` - Core helper functions
2. `/app/api/students/enriched/route.ts` - Enhanced API endpoint
3. `/components/students/EnrichedStudentCard.tsx` - Display component
4. `/docs/SMART_STUDENT_USER_LINKING.md` - This documentation

---

## Testing

```bash
# Test single student enrichment
curl http://localhost:3003/api/students/enriched?id=123

# Test filtered list
curl http://localhost:3003/api/students/enriched?province=Phnom%20Penh&limit=10

# Test with authentication
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:3003/api/students/enriched?schoolId=5
```

---

## Next Steps

1. ✅ Create helper functions
2. ✅ Create enriched API endpoint
3. ✅ Create display component
4. ⏳ Integrate into student list page
5. ⏳ Add to reports/analytics
6. ⏳ Create admin dashboard view
7. ⏳ Add export functionality

---

**Created**: 2025-10-02
**Purpose**: Smart student-teacher-school data linking
**Status**: ✅ Ready to use
