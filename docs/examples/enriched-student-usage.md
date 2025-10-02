# Enriched Student Data - Usage Examples

## Quick Start

### 1. Fetch Single Student with Teacher Info

```typescript
// In your API route or server component
import { getEnrichedStudentData } from '@/lib/helpers/student-user-link';

const student = await getEnrichedStudentData(123);

console.log(student?.teacher?.email);    // "sokha@example.com"
console.log(student?.teacher?.subject);  // "Mathematics"
console.log(student?.school?.province);  // "Phnom Penh"
```

### 2. Fetch Students for Current Teacher

```typescript
// In a teacher dashboard
import { getEnrichedStudentsList } from '@/lib/helpers/student-user-link';

const students = await getEnrichedStudentsList({
  teacherId: session.user.id,
  limit: 50
});

// Show teacher's students with school context
students.forEach(student => {
  console.log(`${student.name} - ${student.school?.school_name}`);
});
```

### 3. Display Student Card in React

```tsx
'use client';

import { useState, useEffect } from 'react';
import EnrichedStudentCard from '@/components/students/EnrichedStudentCard';

export default function StudentProfile({ studentId }: { studentId: number }) {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch(`/api/students/enriched?id=${studentId}`)
      .then(res => res.json())
      .then(data => setStudent(data.data));
  }, [studentId]);

  if (!student) return <div>Loading...</div>;

  return (
    <EnrichedStudentCard
      student={student}
      showTeacherInfo={true}
      showSchoolInfo={true}
      showAssessmentLevels={true}
    />
  );
}
```

---

## Advanced Examples

### Filter by Province

```typescript
// Get all students in Phnom Penh with teacher details
const students = await getEnrichedStudentsList({
  province: "Phnom Penh",
  limit: 100
});

// Group by teacher
const byTeacher = students.reduce((acc, student) => {
  const teacherName = student.teacher?.name || 'Unknown';
  if (!acc[teacherName]) acc[teacherName] = [];
  acc[teacherName].push(student);
  return acc;
}, {});
```

### Filter by School

```typescript
// Get all students in a specific school
const students = await getEnrichedStudentsList({
  schoolId: 5,
  limit: 200
});

// Calculate completion rates
const baselineCompleted = students.filter(s =>
  s.baseline_khmer_level || s.baseline_math_level
).length;

console.log(`Baseline completion: ${baselineCompleted}/${students.length}`);
```

### Check Teacher Access

```typescript
// Verify teacher can access student before displaying
import { canTeacherAccessStudent } from '@/lib/helpers/student-user-link';

const teacherProfile = {
  id: session.user.id,
  role: session.user.role,
  pilot_school_id: session.user.pilot_school_id,
  province: session.user.province
};

if (canTeacherAccessStudent(teacherProfile, student)) {
  // Show student details
} else {
  // Show access denied message
}
```

### Format for Display

```typescript
import { formatStudentDisplay } from '@/lib/helpers/student-user-link';

const displayText = formatStudentDisplay(student);
// "សុវត្ថិ | ថ្នាក់: Grade 4A | សាលា: Hun Sen Primary | គ្រូ: លោកគ្រូ សុខា | ខេត្ត: Phnom Penh"

// Use in select dropdowns
<Select>
  {students.map(s => (
    <Option key={s.id} value={s.id}>
      {formatStudentDisplay(s)}
    </Option>
  ))}
</Select>
```

---

## API Usage Examples

### Fetch with cURL

```bash
# Single student
curl http://localhost:3003/api/students/enriched?id=123

# Filter by school
curl http://localhost:3003/api/students/enriched?schoolId=5&limit=50

# Filter by province
curl http://localhost:3003/api/students/enriched?province=Phnom%20Penh

# With authentication
curl -H "Cookie: next-auth.session-token=YOUR_TOKEN" \
  http://localhost:3003/api/students/enriched?schoolId=5
```

### Fetch with JavaScript

```javascript
// In client component
const fetchEnrichedStudents = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/students/enriched?${params}`);
  const data = await response.json();
  return data.data; // Array of enriched students
};

// Usage
const students = await fetchEnrichedStudents({
  schoolId: 5,
  limit: 50
});
```

---

## Real-World Scenarios

### Scenario 1: Teacher Dashboard
**Goal**: Show teacher their students with assessment progress

```tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';

export default function TeacherStudentList() {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/students/enriched?teacherId=${session.user.id}`)
        .then(res => res.json())
        .then(data => setStudents(data.data));
    }
  }, [session]);

  const columns = [
    { title: 'ឈ្មោះសិស្ស', dataIndex: 'name' },
    {
      title: 'ថ្នាក់',
      render: (_, record) => record.class?.name || '-'
    },
    {
      title: 'Baseline ខ្មែរ',
      render: (_, record) =>
        record.baseline_khmer_level ?
          <Tag color="blue">{record.baseline_khmer_level}</Tag> :
          <Tag>មិនទាន់</Tag>
    },
    {
      title: 'Baseline គណិត',
      render: (_, record) =>
        record.baseline_math_level ?
          <Tag color="green">{record.baseline_math_level}</Tag> :
          <Tag>មិនទាន់</Tag>
    }
  ];

  return <Table dataSource={students} columns={columns} />;
}
```

### Scenario 2: Provincial Report
**Goal**: Generate report of all students in a province

```typescript
import { getEnrichedStudentsList } from '@/lib/helpers/student-user-link';

async function generateProvincialReport(province: string) {
  const students = await getEnrichedStudentsList({
    province,
    limit: 1000
  });

  // Calculate statistics
  const report = {
    province,
    total_students: students.length,
    schools: new Set(students.map(s => s.school?.id)).size,
    teachers: new Set(students.map(s => s.teacher?.id)).size,
    baseline_complete: students.filter(s =>
      s.baseline_khmer_level && s.baseline_math_level
    ).length,
    by_school: students.reduce((acc, s) => {
      const schoolName = s.school?.school_name || 'Unknown';
      acc[schoolName] = (acc[schoolName] || 0) + 1;
      return acc;
    }, {})
  };

  return report;
}

// Usage
const report = await generateProvincialReport("Phnom Penh");
console.log(report);
```

### Scenario 3: Contact List
**Goal**: Create emergency contact list with teacher info

```typescript
import { getEnrichedStudentsList } from '@/lib/helpers/student-user-link';

async function generateContactList(schoolId: number) {
  const students = await getEnrichedStudentsList({
    schoolId,
    limit: 500
  });

  const contacts = students
    .filter(s => s.teacher?.phone || s.teacher?.email)
    .map(s => ({
      student_name: s.name,
      class: s.class?.name,
      teacher_name: s.teacher?.name,
      teacher_email: s.teacher?.email,
      teacher_phone: s.teacher?.phone,
      teacher_subject: s.teacher?.subject
    }));

  return contacts;
}

// Export to CSV
const contacts = await generateContactList(5);
// Convert to CSV and download...
```

---

## Testing

```typescript
// Test helper functions
import {
  getEnrichedStudentData,
  getEnrichedStudentsList,
  formatStudentDisplay,
  canTeacherAccessStudent
} from '@/lib/helpers/student-user-link';

// Test 1: Single student
const student = await getEnrichedStudentData(1);
console.assert(student?.teacher !== undefined, 'Should have teacher info');

// Test 2: Filtered list
const students = await getEnrichedStudentsList({ schoolId: 1, limit: 10 });
console.assert(students.length <= 10, 'Should respect limit');

// Test 3: Format display
const displayText = formatStudentDisplay(student);
console.assert(displayText.includes(student.name), 'Should include student name');

// Test 4: Access control
const hasAccess = canTeacherAccessStudent(
  { id: 1, role: 'teacher', pilot_school_id: 5 },
  student
);
console.assert(typeof hasAccess === 'boolean', 'Should return boolean');
```

---

## Performance Tips

1. **Use pagination** for large datasets:
```typescript
const students = await getEnrichedStudentsList({
  limit: 50,
  offset: page * 50
});
```

2. **Filter server-side** instead of client-side:
```typescript
// ✅ Good - filter on server
const students = await getEnrichedStudentsList({ province: "Phnom Penh" });

// ❌ Bad - fetch all then filter
const all = await getEnrichedStudentsList({ limit: 1000 });
const filtered = all.filter(s => s.school?.province === "Phnom Penh");
```

3. **Cache results** for frequently accessed data:
```typescript
import { cache } from 'react';

const getCachedStudents = cache(async (schoolId: number) => {
  return await getEnrichedStudentsList({ schoolId });
});
```

---

## Troubleshooting

### Student has no teacher info
```typescript
if (!student.teacher) {
  // Student was created without added_by_id
  // Or added_by user was deleted
  console.log('Orphaned student - no teacher assigned');
}
```

### Permission denied
```typescript
if (!canTeacherAccessStudent(teacherProfile, student)) {
  // Teacher doesn't have access to this student
  // Check school/province matching
}
```

### Missing school info
```typescript
if (!student.school) {
  // Student.pilot_school_id is null
  // Or school was deleted
  console.log('Student not assigned to school');
}
```

---

**Created**: 2025-10-02
**Last Updated**: 2025-10-02
