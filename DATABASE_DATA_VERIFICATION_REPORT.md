# Database Data Verification Report

## Executive Summary

This report verifies whether the TaRL Pratham Next.js application displays data from the actual PostgreSQL database or uses mock/fallback data.

**Date:** September 28, 2025  
**Database:** PostgreSQL @ 157.10.73.52:5432/tarl_pratham  
**Application:** TaRL Pratham Next.js (Port 3003)

## 🔍 Verification Results

### Database Connection Status

✅ **DATABASE IS CONNECTED AND CONFIGURED CORRECTLY**

**Connection String:**
```
postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?schema=public
```

### Current Database Content

| Table | Record Count | Status |
|-------|-------------|---------|
| **users** | 85 | ✅ Has real data |
| **pilot_schools** | 33 | ✅ Has real data |
| **students** | 0 | ⚠️ Empty |
| **assessments** | 0 | ⚠️ Empty |
| **mentoring_visits** | 0 | ⚠️ Empty |

### Sample Real Users in Database
```sql
ID | Name              | Email                                | Role
---|-------------------|--------------------------------------|-------------
1  | Kairav Admin      | kairav@prathaminternational.org     | admin
2  | System Admin      | admin@prathaminternational.org      | coordinator
3  | Coordinator One   | coordinator@prathaminternational.org| coordinator
4  | Deab Chhoeun     | deab.chhoeun                       | mentor
5  | Heap Sophea      | heap.sophea                        | mentor
```

## ⚠️ IMPORTANT FINDINGS

### Data Display Logic

The application uses a **DUAL DATA SOURCE STRATEGY**:

1. **PRIMARY**: Always attempts to fetch from the PostgreSQL database first
2. **FALLBACK**: If database fails or returns empty, shows mock data

### How It Works

#### Normal Flow (Database Available):
```javascript
// 1. Try database first
const [students, total] = await Promise.all([
  prisma.student.findMany({
    where,
    include: { /* relations */ },
    skip,
    take: limit,
    orderBy: { created_at: "desc" }
  }),
  prisma.student.count({ where })
]);

// 2. Return real database data
return NextResponse.json({
  data: students,  // Real database data
  pagination: { /* ... */ }
});
```

#### Fallback Flow (Database Error or Empty):
```javascript
} catch (error) {
  // Database error occurred
  if (error.code === 'P2002' || error.code === 'P2025') {
    // Return empty with message
    return NextResponse.json({
      data: [],
      message: 'មិនមានទិន្នន័យសិស្សនៅក្នុងប្រព័ន្ធ'
    });
  }
  
  // Provide mock data for development
  const mockStudents = [/* ... */];
  return NextResponse.json({
    data: mockStudents,
    mock: true  // Indicates mock data
  });
}
```

## 📊 Current Data Display Status

### What Users See Now:

| Feature | Data Source | Reason |
|---------|------------|---------|
| **User List** | ✅ Real Database | 85 users exist in database |
| **Pilot Schools** | ✅ Real Database | 33 schools exist in database |
| **Student List** | ⚠️ Mock Data | No students in database (count = 0) |
| **Assessments** | ⚠️ Mock Data | No assessments in database (count = 0) |
| **Mentoring Visits** | ⚠️ Mock Data | No visits in database (count = 0) |

## 🔧 Affected API Endpoints

### APIs with Mock Data Fallback:
1. `/api/students/route.ts` - Returns mock when no students exist
2. `/api/users/route.ts` - Returns mock on database error
3. `/api/assessments/manage/route.ts` - Returns mock when empty
4. `/api/mentoring-visits/route.ts` - Returns mock when empty
5. `/api/reports/route.ts` - Returns mock data for empty reports

### Mock Data Indicator:
When mock data is returned, the API response includes:
```json
{
  "data": [/* mock records */],
  "mock": true,
  "message": "កំពុងប្រើទិន្នន័យសាកល្បង"
}
```

## ✅ How to Ensure Real Database Data

### 1. Add Real Data to Database

To see real data instead of mock data, populate the database:

```bash
# Add sample students
INSERT INTO students (name, age, gender, pilot_school_id, created_at, updated_at) 
VALUES 
  ('សិស្សទី១', 12, 'male', 1, NOW(), NOW()),
  ('សិស្សទី២', 11, 'female', 1, NOW(), NOW());

# Add sample assessments
INSERT INTO assessments (student_id, assessment_type, subject, level, created_at, updated_at)
VALUES 
  (1, 'ដើមគ្រា', 'khmer', 'beginner', NOW(), NOW()),
  (2, 'ដើមគ្រា', 'math', 'beginner', NOW(), NOW());
```

### 2. Use Database Seeding

Run the seed script to populate initial data:

```bash
npm run db:seed
```

### 3. Monitor for Mock Data

Check the browser console or network tab for the `mock: true` flag:
- If `mock: true` appears, you're seeing fallback data
- If no `mock` field, you're seeing real database data

## 🎯 Recommendations

### Immediate Actions:

1. **Populate Empty Tables**
   - Add students via the UI or database seed
   - Create assessments through the application
   - Add mentoring visits

2. **Remove Mock Data (Production)**
   - For production, remove mock data fallbacks
   - Return empty arrays with appropriate messages

3. **Add Data Indicators**
   - Show badge/indicator when displaying mock data
   - Add warning message for administrators

### Code Modification to Disable Mock Data:

```javascript
// In catch blocks, replace mock data with:
return NextResponse.json({
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  },
  message: 'No data available. Please add records to the database.',
  error: process.env.NODE_ENV === 'development' ? error.message : undefined
});
```

## 📋 Summary

### Current State:
- ✅ **Database IS properly connected**
- ✅ **Application CAN read from database**
- ✅ **Users and Schools display REAL data**
- ⚠️ **Students/Assessments/Visits show MOCK data** (because tables are empty)

### Data Source Priority:
1. **First Priority:** Real PostgreSQL database
2. **Fallback:** Mock data (only when database is empty or errors)

### How to Verify Real Data:
1. Check response for `mock: true` flag
2. Look at browser network tab
3. Verify database record count matches UI display
4. Check for Khmer message "កំពុងប្រើទិន្នន័យសាកល្បង" (Using test data)

## 🔒 Production Readiness

For production deployment:
1. ✅ Database connection works
2. ⚠️ Need to populate empty tables
3. ⚠️ Consider removing mock data fallbacks
4. ✅ Error handling is appropriate
5. ✅ Real data displays when available

---

**Conclusion:** The application IS configured to display real database data. It currently shows mock data for some features because those database tables are empty. Once data is added to the database, the application will automatically display the real data instead of mock data.