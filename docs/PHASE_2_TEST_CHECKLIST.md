# Phase 2 Test Checklist

## Overview
Phase 2 implements test session management and bulk operations for the record_status system.

## ✅ Implementation Status

### Core Features
- [x] TestSession model with UUID primary key
- [x] Test session creation API
- [x] Automatic session linking in CRUD operations
- [x] Bulk delete API
- [x] Bulk archive API
- [x] Session expiry API
- [x] Permissions updated for bulk operations

## Test Scenarios

### 1. Test Session Creation

**Endpoint:** `POST /api/test-sessions/create`

**Test Cases:**

#### TC1.1: Mentor Creates Test Session
```bash
# Login as mentor first, then:
curl -X POST http://localhost:3003/api/test-sessions/create \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Testing session creation",
    "expiry_days": 7
  }'
```

**Expected:**
- Status: 201
- Response includes: `session.id`, `session.user_id`, `session.expires_at`
- Session status is "active"

#### TC1.2: Teacher Creates Test Session
```bash
# Login as teacher with test mode enabled
curl -X POST http://localhost:3003/api/test-sessions/create \
  -H "Content-Type: application/json" \
  -d '{"expiry_days": 3}'
```

**Expected:**
- Status: 201
- Session created with 3-day expiry

#### TC1.3: Cannot Create Multiple Active Sessions
```bash
# Try to create second session while first is active
curl -X POST http://localhost:3003/api/test-sessions/create \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected:**
- Status: 400
- Error: "You already have an active test session"
- Returns existing session info

### 2. Automatic Session Linking

**Endpoint:** `POST /api/students` (also applies to assessments, mentoring-visits)

#### TC2.1: Student Creation Links to Active Session
```bash
# Prerequisites: Active test session exists
# Create student as mentor
curl -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "សិស្សសាកល្បង",
    "age": 12,
    "gender": "male"
  }'
```

**Expected:**
- Status: 201
- Student has `test_session_id` matching active session
- `record_status` = "test_mentor"
- `created_by_role` = "mentor"

**Verification Query:**
```sql
SELECT id, name, test_session_id, record_status, created_by_role
FROM students
WHERE name = 'សិស្សសាកល្បង';
```

#### TC2.2: Assessment Linked to Session
```bash
# Create assessment for test student
curl -X POST http://localhost:3003/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 123,
    "assessment_type": "ដើមគ្រា",
    "subject": "khmer",
    "level": "beginner"
  }'
```

**Expected:**
- Assessment has same `test_session_id` as student
- `record_status` = "test_mentor"

### 3. Bulk Delete Operations

**Endpoint:** `POST /api/bulk/delete-test-data`

#### TC3.1: Delete All Test Data (Admin Only)
```bash
# Login as admin
curl -X POST http://localhost:3003/api/bulk/delete-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "delete_all_test_data": true
  }'
```

**Expected:**
- Status: 200
- Deletes all records with `record_status` IN ('test_mentor', 'test_teacher')
- Returns counts: `{deleted: {students: X, assessments: Y, ...}}`

#### TC3.2: Delete by Session ID
```bash
# Delete all data in specific session
curl -X POST http://localhost:3003/api/bulk/delete-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "test_session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Expected:**
- Hard deletes all records with matching `test_session_id`
- Updates session status to "expired"
- Sets session counts to 0

#### TC3.3: Delete by Record Status
```bash
# Delete only mentor test data
curl -X POST http://localhost:3003/api/bulk/delete-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "record_status": "test_mentor"
  }'
```

**Expected:**
- Deletes only records with `record_status` = "test_mentor"

#### TC3.4: Mentor Can Only Delete Own Data
```bash
# Login as mentor
curl -X POST http://localhost:3003/api/bulk/delete-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "record_status": "test_mentor"
  }'
```

**Expected:**
- Only deletes records where `added_by_id` = mentor's user_id
- Cannot delete other mentors' data

### 4. Bulk Archive Operations

**Endpoint:** `POST /api/bulk/archive-test-data`

#### TC4.1: Archive Test Data (Soft Delete)
```bash
# Login as coordinator
curl -X POST http://localhost:3003/api/bulk/archive-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "record_status": "test_mentor"
  }'
```

**Expected:**
- Students: `record_status` → 'archived', `is_active` → false
- Assessments: `record_status` → 'archived'
- Mentoring visits: `record_status` → 'archived'
- Original records preserved (soft delete)

#### TC4.2: Archive by Session
```bash
curl -X POST http://localhost:3003/api/bulk/archive-test-data \
  -H "Content-Type: application/json" \
  -d '{
    "test_session_id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Expected:**
- All session data archived
- Session status → 'archived'

### 5. Session Expiry

**Endpoint:** `POST /api/test-sessions/[id]/expire`

#### TC5.1: Expire Session with Archive
```bash
curl -X POST http://localhost:3003/api/test-sessions/550e8400-e29b-41d4-a716-446655440000/expire \
  -H "Content-Type: application/json" \
  -d '{
    "action": "archive"
  }'
```

**Expected:**
- All session data archived
- Session status → 'archived'
- Returns archived counts

#### TC5.2: Expire Session with Delete
```bash
curl -X POST http://localhost:3003/api/test-sessions/550e8400-e29b-41d4-a716-446655440000/expire \
  -H "Content-Type: application/json" \
  -d '{
    "action": "delete"
  }'
```

**Expected:**
- All session data hard deleted
- Session status → 'expired'
- Session counts → 0
- Returns deleted counts

#### TC5.3: Unauthorized Access
```bash
# Login as different mentor (not session owner)
curl -X POST http://localhost:3003/api/test-sessions/OTHER_SESSION_ID/expire \
  -H "Content-Type: application/json" \
  -d '{"action": "delete"}'
```

**Expected:**
- Status: 403
- Error: "អ្នកមិនមានសិទ្ធិបិទសម័យនេះទេ"

### 6. Get Test Session Info

**Endpoint:** `GET /api/mentor/test-session`

#### TC6.1: Get Active Session
```bash
# Login as mentor with active session
curl http://localhost:3003/api/mentor/test-session
```

**Expected:**
```json
{
  "active_sessions": 1,
  "test_data_count": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  },
  "current_session": {
    "id": "...",
    "expires_at": "2025-10-07T...",
    "days_remaining": 7
  },
  "expiry_date": "2025-10-07T..."
}
```

### 7. Permission Checks

#### TC7.1: Admin Permissions
```bash
# Test all bulk operations as admin
# Should have access to:
- bulk.delete_test_data ✓
- bulk.archive_test_data ✓
- test_sessions.view ✓
- test_sessions.manage ✓
```

#### TC7.2: Coordinator Permissions
```bash
# Test as coordinator
# Should have access to:
- bulk.delete_test_data ✓
- bulk.archive_test_data ✓
- test_sessions.view ✓
# Should NOT have:
- test_sessions.manage ✗
```

#### TC7.3: Mentor Permissions
```bash
# Test as mentor
# Should have access to:
- Create test sessions ✓
- Delete own test data ✓
# Should NOT have:
- Delete other mentors' data ✗
- Bulk archive ✗
```

## Database Validation Queries

### Check Session Linking
```sql
-- Verify students are linked to sessions
SELECT
  s.name,
  s.test_session_id,
  s.record_status,
  s.created_by_role,
  ts.user_id as session_owner,
  ts.status as session_status
FROM students s
LEFT JOIN test_sessions ts ON s.test_session_id = ts.id
WHERE s.record_status IN ('test_mentor', 'test_teacher')
LIMIT 10;
```

### Check Session Statistics
```sql
-- Verify session counts
SELECT
  ts.id,
  ts.user_id,
  ts.status,
  COUNT(DISTINCT s.id) as actual_students,
  COUNT(DISTINCT a.id) as actual_assessments,
  COUNT(DISTINCT mv.id) as actual_mentoring_visits
FROM test_sessions ts
LEFT JOIN students s ON s.test_session_id = ts.id
LEFT JOIN assessments a ON a.test_session_id = ts.id
LEFT JOIN mentoring_visits mv ON mv.test_session_id = ts.id
GROUP BY ts.id;
```

### Check Record Status Distribution
```sql
SELECT
  record_status,
  COUNT(*) as count
FROM students
GROUP BY record_status;

SELECT
  record_status,
  COUNT(*) as count
FROM assessments
GROUP BY record_status;
```

## Integration Test Script

```bash
#!/bin/bash
# Phase 2 Integration Test

echo "=== Phase 2 Integration Test ==="

# 1. Create test session
echo "1. Creating test session..."
SESSION_RESPONSE=$(curl -s -X POST http://localhost:3003/api/test-sessions/create \
  -H "Content-Type: application/json" \
  -d '{"notes": "Integration test", "expiry_days": 1}')
SESSION_ID=$(echo $SESSION_RESPONSE | jq -r '.session.id')
echo "Session ID: $SESSION_ID"

# 2. Create test student
echo "2. Creating test student..."
STUDENT_RESPONSE=$(curl -s -X POST http://localhost:3003/api/students \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Student", "age": 10, "gender": "male"}')
STUDENT_ID=$(echo $STUDENT_RESPONSE | jq -r '.data.id')
echo "Student ID: $STUDENT_ID"

# 3. Verify linking
echo "3. Verifying session link..."
STUDENT_SESSION=$(echo $STUDENT_RESPONSE | jq -r '.data.test_session_id')
if [ "$STUDENT_SESSION" = "$SESSION_ID" ]; then
  echo "✓ Student linked to session"
else
  echo "✗ Session linking failed"
fi

# 4. Expire session with delete
echo "4. Expiring session..."
curl -s -X POST "http://localhost:3003/api/test-sessions/$SESSION_ID/expire" \
  -H "Content-Type: application/json" \
  -d '{"action": "delete"}' | jq

echo "=== Test Complete ==="
```

## Success Criteria

- [x] All APIs compile without errors
- [ ] Database schema synced
- [ ] Test session creation works
- [ ] Session linking automatic on create
- [ ] Bulk delete removes test data
- [ ] Bulk archive preserves data
- [ ] Session expiry works correctly
- [ ] Permissions enforced properly
- [ ] No data leakage between users
- [ ] Transaction safety maintained

## Known Issues
- None currently identified

## Next Phase
After Phase 2 testing completes, proceed to Phase 3:
- Test mode toggle UI
- Promote to production feature
- Data migration script
- Remove deprecated fields