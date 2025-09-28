# Dashboard Mock Data Documentation

## Overview

This document describes the comprehensive mock data system implemented for dashboard charts and graphs in the TaRL Pratham Next.js application. The system ensures that dashboards always display meaningful visualizations, even when the database is empty or returns no data.

**Implementation Date:** September 28, 2025  
**Purpose:** Provide realistic fallback data for dashboard visualizations when database is empty

## 🎯 Implementation Strategy

### Dual Data Source Pattern

```javascript
// Primary: Try database first
const realData = await fetchFromDatabase();

// Fallback: Use mock if empty
if (isDataEmpty(realData)) {
  return generateMockDashboardData();
}

return realData;
```

## 📊 Mock Data Coverage by Role

### 1. Admin Dashboard Mock Data

**File:** `/lib/mockDashboardData.ts` - `generateAdminDashboardMockData()`

#### Key Performance Indicators
```javascript
stats: {
  totalSchools: 33,
  totalTeachers: 156,
  totalStudents: 2847,
  totalAssessments: 8541,
  activeUsers: 85,
  completionRate: 78.5,
  averageScore: 72.3,
  mentoringVisits: 234
}
```

#### Chart Data Provided:
- **School Performance Comparison** - Bar chart comparing 5 schools
- **Assessment Trend** - 6-month line chart with baseline/midline/endline
- **Level Distribution** - Pie charts for Khmer and Math levels
- **Province Distribution** - Geographic data for 7 provinces
- **Gender Distribution** - 50/50 male/female split
- **Phase Completion** - Progress bars for assessment phases
- **Recent Activities** - Live feed simulation

### 2. Coordinator Dashboard Mock Data

**File:** `/lib/mockDashboardData.ts` - `generateCoordinatorDashboardMockData()`

#### Regional Statistics
```javascript
stats: {
  totalSchools: 12,
  totalTeachers: 68,
  totalStudents: 980,
  totalAssessments: 2940,
  completionRate: 75.2,
  averageScore: 70.5,
  pendingVerifications: 45,
  recentMentoringVisits: 28
}
```

#### Chart Data Provided:
- **Regional Performance** - 6-month trend line
- **School Rankings** - Top 5 schools with trends
- **Teacher Performance** - Distribution chart
- **Assessment Coverage** - Multi-phase progress bars
- **Pending Actions** - Urgent items dashboard

### 3. Mentor Dashboard Mock Data

**File:** `/lib/mockDashboardData.ts` - `generateMentorDashboardMockData()`

#### Mentoring Statistics
```javascript
stats: {
  assignedSchools: 3,
  totalTeachers: 18,
  totalStudents: 280,
  completedVisits: 42,
  upcomingVisits: 5,
  temporaryStudents: 12,
  averageClassSize: 28,
  improvementRate: 68.5
}
```

#### Chart Data Provided:
- **Visit Schedule** - Calendar view with upcoming visits
- **Teacher Support Metrics** - Observation statistics
- **Class Observations** - Radar chart with 5 aspects
- **Student Progress** - 4-month trend
- **Temporary Data Status** - 48-hour tracking dashboard

### 4. Teacher Dashboard Mock Data

**File:** `/lib/mockDashboardData.ts` - `generateTeacherDashboardMockData()`

#### Classroom Statistics
```javascript
stats: {
  totalStudents: 45,
  boysCount: 23,
  girlsCount: 22,
  averageAttendance: 92.5,
  completedAssessments: 135,
  pendingAssessments: 15,
  classAverage: 68.7,
  improvementRate: 15.2
}
```

#### Chart Data Provided:
- **Class Performance** - Level distribution by subject
- **Student Progress** - 4-month trend chart
- **Recent Assessments** - Table with latest results
- **Top Performers** - Student achievement highlights
- **Needs Support** - Students requiring attention
- **Attendance Pattern** - Weekly attendance chart
- **Upcoming Tasks** - Task management widget

### 5. Viewer Dashboard Mock Data

**File:** `/lib/mockDashboardData.ts` - `generateViewerDashboardMockData()`

#### Read-Only Statistics
```javascript
overviewStats: {
  totalSchools: 33,
  totalStudents: 2847,
  totalAssessments: 8541,
  averageScore: 72.3,
  dataLastUpdated: new Date().toISOString()
}
```

#### Chart Data Provided:
- **Performance Summary** - By province, subject, and phase
- **Trend Analysis** - 6-month overview
- **Level Distribution** - Percentage breakdown
- **Gender Distribution** - Demographics chart
- **Key Metrics** - KPI dashboard with trends

## 📈 Chart Types and Visualizations

### Supported Chart Types

1. **Line Charts** - Progress over time
2. **Bar Charts** - Comparisons
3. **Pie Charts** - Distribution
4. **Area Charts** - Cumulative data
5. **Radar Charts** - Multi-dimensional analysis
6. **Heat Maps** - Performance matrices
7. **Tables** - Detailed data views

### Dynamic Data Generation

```javascript
// Generate trend data for line charts
const generateTrendData = (months: number = 6) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    data.push({
      month: date.toLocaleDateString('km-KH', { month: 'short' }),
      value: randomInRange(40, 95),
      baseline: randomInRange(30, 50),
      midline: randomInRange(50, 70),
      endline: randomInRange(70, 90)
    });
  }
  
  return data;
};
```

## 🔄 API Integration

### Updated API Endpoints

All dashboard APIs now include mock data fallback:

1. `/api/dashboard/admin-stats`
2. `/api/dashboard/coordinator-stats`
3. `/api/dashboard/mentor-stats`
4. `/api/dashboard/teacher-stats`
5. `/api/dashboard/viewer-stats`

### Implementation Pattern

```javascript
// In each dashboard API
import { generateXDashboardMockData } from '@/lib/mockDashboardData';

export async function GET(request: NextRequest) {
  try {
    // Fetch real data
    const data = await fetchRealData();
    
    // Check if empty
    if (isDataEmpty(data)) {
      return NextResponse.json(generateXDashboardMockData());
    }
    
    return NextResponse.json(data);
  } catch (error) {
    // Return mock on error
    return NextResponse.json(generateXDashboardMockData());
  }
}
```

## 🏷️ Mock Data Indicators

### Response Format

When mock data is returned, the response includes:

```json
{
  "stats": { /* statistics */ },
  "charts": { /* chart data */ },
  "mock": true,
  "message": "កំពុងប្រើទិន្នន័យគំរូសម្រាប់បង្ហាញ"
}
```

### UI Indicators

Frontend components should check for the `mock` flag:

```javascript
const DashboardComponent = ({ data }) => {
  return (
    <>
      {data.mock && (
        <Alert type="info">
          កំពុងប្រើទិន្នន័យគំរូ / Using sample data
        </Alert>
      )}
      <Charts data={data.charts} />
    </>
  );
};
```

## 🌐 Localization Support

### Bilingual Data

Mock data includes both Khmer and English:

- Month names in both languages
- School names in Khmer
- Labels and messages bilingual
- Number formatting appropriate for locale

### Example:

```javascript
monthData: {
  month: 'មករា',      // Khmer
  monthEn: 'Jan',    // English
  value: 85
}
```

## ⚙️ Configuration

### Random Data Ranges

Configurable ranges for realistic data:

```javascript
const DATA_RANGES = {
  scores: { min: 40, max: 95 },
  attendance: { min: 70, max: 98 },
  students: { min: 20, max: 50 },
  improvements: { min: 5, max: 30 }
};
```

### Consistency Rules

- Gender distribution ~50/50
- Level distribution follows normal curve
- Scores increase from baseline to endline
- Attendance patterns realistic (lower on Fridays)

## 🔍 Detection Logic

### When Mock Data is Used:

1. **Empty Database Tables**
   ```javascript
   if (totalStudents === 0 && totalAssessments === 0)
   ```

2. **Database Connection Error**
   ```javascript
   catch (error) {
     return mockData;
   }
   ```

3. **Null/Undefined Results**
   ```javascript
   if (!data || data.length === 0)
   ```

## 📊 Sample Chart Configurations

### Line Chart Example

```javascript
const lineChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Baseline',
      data: [62, 64, 61, 65, 63, 64],
      borderColor: 'rgb(255, 99, 132)'
    },
    {
      label: 'Midline',
      data: [70, 72, 71, 73, 72, 74],
      borderColor: 'rgb(54, 162, 235)'
    },
    {
      label: 'Endline',
      data: [78, 80, 79, 81, 80, 82],
      borderColor: 'rgb(75, 192, 192)'
    }
  ]
};
```

### Pie Chart Example

```javascript
const pieChartData = {
  labels: ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'],
  datasets: [{
    data: [320, 580, 750, 680, 517],
    backgroundColor: [
      '#ff6b6b',
      '#4ecdc4',
      '#45b7d1',
      '#96ceb4',
      '#6c5ce7'
    ]
  }]
};
```

## 🚀 Performance Considerations

### Caching Strategy

Mock data is generated on-demand but could be cached:

```javascript
let cachedMockData = null;
let cacheTimestamp = null;

const getMockData = () => {
  const now = Date.now();
  if (!cachedMockData || now - cacheTimestamp > 300000) { // 5 min
    cachedMockData = generateMockData();
    cacheTimestamp = now;
  }
  return cachedMockData;
};
```

### Data Size

Mock datasets are optimized for performance:
- Max 6 months of trend data
- Max 10 items in lists
- Simplified calculations

## 🔧 Maintenance

### Adding New Mock Data

To add mock data for a new dashboard:

1. Create generator function in `/lib/mockDashboardData.ts`
2. Import in relevant API route
3. Add fallback logic
4. Document chart types

### Updating Mock Values

Edit ranges in `/lib/mockDashboardData.ts`:

```javascript
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
```

## 📝 Testing

### Verify Mock Data Display

1. **Empty Database Test**
   ```bash
   # Clear database
   TRUNCATE TABLE students, assessments, mentoring_visits;
   
   # Load dashboard - should show mock data
   ```

2. **Error Simulation Test**
   ```bash
   # Stop database
   # Load dashboard - should show mock data
   ```

3. **Mock Flag Verification**
   ```javascript
   // Check response
   expect(response.mock).toBe(true);
   expect(response.message).toContain('គំរូ');
   ```

## ✅ Benefits

1. **Always Functional** - Dashboards work even with empty database
2. **Realistic Demo** - Professional presentation for stakeholders
3. **Development Aid** - No need to seed data for UI development
4. **Error Recovery** - Graceful fallback on database issues
5. **Consistent UX** - Users always see meaningful visualizations

## ⚠️ Important Notes

1. **Production Consideration** - Consider disabling mock data in production
2. **Data Accuracy** - Mock data is random and not real
3. **Performance** - Mock generation is lightweight but adds overhead
4. **Security** - No sensitive data in mock responses

## 🎯 Conclusion

The dashboard mock data system ensures:
- Professional appearance even with empty database
- Comprehensive chart/graph coverage for all roles
- Realistic data patterns and relationships
- Clear indication when mock data is displayed
- Easy maintenance and extension

This implementation follows the same pattern as the successful mock data fallback for Students, Assessments, and Mentoring Visits, providing a consistent and reliable user experience across the entire application.