# Mentor Test Environment - Design Document

## Overview
Mentors need a full testing environment where they can perform all CRUD operations on temporary data that auto-resets at midnight or on-demand, similar to teacher role capabilities.

## Current Mentor Permissions (from lib/permissions.ts)
```
- students.view, students.create, students.edit (temporary only)
- assessments.view, assessments.create, assessments.edit (temporary only)
- mentoring.view, mentoring.create, mentoring.edit, mentoring.delete
- verification.view, verification.approve
- reports.view, reports.my_mentoring
- teacher.workspace (can access teacher features)
- analytics.dashboard
```

## Mentor Test Data System Architecture

### 1. Test Data Identification
All mentor-created data will be marked as temporary with these fields:
- `is_temporary: true`
- `added_by_mentor: true`
- `mentor_created_at: timestamp`
- `added_by_id: mentor_user_id`
- `test_session_id: unique_session_id` (NEW - for bulk reset)

### 2. Tables/Entities Mentors Can Test

#### Primary Entities (Full CRUD):
- **Students** - Create, view, edit, delete temporary students
- **Assessments** - Create, view, edit, delete temporary assessments
- **Mentoring Visits** - Already have full CRUD
- **Classes** - Create temporary classes for testing
- **Schools** (Pilot Schools) - View only, but can test with temporary data

#### Secondary Entities (Limited):
- **Users** - View only (can't create test users for security)
- **Reports** - Can generate reports on temporary data
- **Verification** - Can approve/reject temporary assessments

### 3. Mock Data Generation

When no real data exists, API endpoints will return mock data for mentors:

```typescript
// Example: /api/students
if (students.length === 0 && user.role === 'mentor') {
  return {
    data: MOCK_STUDENTS_DATA,
    is_mock: true,
    message: "Using test data. Create your own to start testing!"
  }
}
```

Mock data sets to generate:
- 20 mock students (various grades, genders, levels)
- 50 mock assessments (baseline, midline, endline)
- 10 mock mentoring visits
- 5 mock classes
- Mock progress reports

### 4. Auto-Reset Mechanism

#### Midnight Auto-Reset (00:00 server time)
- Cron job: `/api/cron/reset-mentor-test-data`
- Runs daily at midnight
- Deletes all records where:
  - `is_temporary = true`
  - `added_by_mentor = true`
  - `mentor_created_at < 24 hours ago`

#### Manual Reset Button
Location: Mentor dashboard / Test settings page
- Button: "Reset All Test Data"
- Confirmation modal
- Endpoint: `/api/mentor/reset-test-data`
- Deletes all temporary data created by current mentor
- Shows success message with count of deleted records

### 5. Test Session Management

Each mentor gets isolated test sessions:
```typescript
interface TestSession {
  id: string;
  mentor_id: number;
  created_at: timestamp;
  expires_at: timestamp; // midnight
  student_count: number;
  assessment_count: number;
  status: 'active' | 'expired'
}
```

### 6. UI Indicators

Visual indicators for test mode:
- Banner at top: "🧪 Test Mode - All data will reset at midnight"
- Tag on each record: `<Tag color="orange">TEST DATA</Tag>`
- Different color scheme for test records (orange/yellow tint)
- Counter: "You have created 5 test students today"

### 7. Data Isolation

Mentors can only:
- View their own temporary data
- View production data (read-only)
- NOT mix temporary and production data
- NOT affect other mentors' test data

### 8. Reset Process Flow

```
User clicks "Reset Test Data"
  ↓
Confirmation modal appears
  ↓
User confirms
  ↓
API call: DELETE /api/mentor/reset-test-data
  ↓
Backend:
  1. Find all records where:
     - added_by_id = current_mentor_id
     - is_temporary = true
  2. Delete in order:
     - Assessments
     - Students
     - Mentoring Visits
     - Classes
  3. Reset test session
  ↓
Return deleted counts
  ↓
UI shows success message
  ↓
Redirect to refreshed page with clean state
```

## Implementation Plan

### Phase 1: Database Schema Updates
- [x] Existing: `is_temporary`, `added_by_mentor` fields
- [ ] Add: `test_session_id` to relevant tables
- [ ] Create: `test_sessions` table for tracking

### Phase 2: Mock Data Service
- [ ] Create: `/lib/services/mockDataService.ts`
- [ ] Generate consistent mock data
- [ ] API fallback to mock data when empty

### Phase 3: Reset Functionality
- [ ] API endpoint: `/api/mentor/reset-test-data` (POST)
- [ ] UI button in mentor dashboard
- [ ] Confirmation modal component
- [ ] Success/error handling

### Phase 4: Cron Job
- [ ] API endpoint: `/api/cron/reset-mentor-test-data` (GET)
- [ ] Vercel cron configuration
- [ ] Logging for reset operations

### Phase 5: UI Updates
- [ ] Test mode banner component
- [ ] Test data tags/badges
- [ ] Session info display
- [ ] Reset button UI

### Phase 6: Permission Updates
- [ ] Add `mentor.test_mode` permission
- [ ] Add `mentor.reset_data` permission
- [ ] Update permission checks in APIs

## API Endpoints to Create

```
POST   /api/mentor/reset-test-data          - Manual reset
GET    /api/mentor/test-session             - Get current session info
GET    /api/cron/reset-mentor-test-data     - Midnight auto-reset (cron)
GET    /api/mentor/test-statistics          - Count of test records
```

## Database Tables to Modify

### students
- Already has: `is_temporary`, `added_by_mentor`, `added_by_id`, `mentor_created_at`
- Add: `test_session_id`

### assessments
- Already has: `is_temporary`, `assessed_by_mentor`
- Add: `test_session_id`, `added_by_id`

### mentoring_visits
- Add: `is_temporary`, `test_session_id`

### NEW: test_sessions
```sql
CREATE TABLE test_sessions (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  student_count INTEGER DEFAULT 0,
  assessment_count INTEGER DEFAULT 0,
  visit_count INTEGER DEFAULT 0
);
```

## Benefits

1. **Safe Testing** - Mentors can experiment without affecting production data
2. **Clean Environment** - Auto-reset ensures fresh start daily
3. **Realistic Training** - Full CRUD operations like production
4. **Isolated** - Each mentor's test data is separate
5. **Auditable** - Track all test operations
6. **Flexible** - Manual reset for training sessions

## Security Considerations

1. Test data is clearly marked and isolated
2. Cannot accidentally promote test data to production
3. Test operations logged for audit
4. Permissions enforce test-only operations
5. Auto-expiry prevents data accumulation

## Future Enhancements

1. Shared test scenarios for training
2. Test data templates (e.g., "10 struggling students")
3. Export test results for review
4. Test mode dashboard with analytics
5. Scheduled test data refresh (not just midnight)