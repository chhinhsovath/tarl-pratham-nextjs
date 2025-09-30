# Phase 3 Implementation - Test Mode Toggle & Data Management

## Overview
Phase 3 implements UI components, test mode management, data migration, and admin tools for the record_status system.

## Features Implemented

### 1. Test Mode Toggle API
**Location:** `/app/api/users/[id]/toggle-test-mode/route.ts`

#### POST - Toggle Test Mode
Enables or disables test mode for teachers.

**Request:**
```bash
POST /api/users/123/toggle-test-mode
Content-Type: application/json

{
  "enabled": true
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "បានបើករបៀបសាកល្បងដោយជោគជ័យ",
  "user": {
    "id": 123,
    "name": "គ្រូ សុខា",
    "role": "teacher",
    "test_mode_enabled": true
  }
}
```

**Response (Has Test Data - Cannot Disable):**
```json
{
  "error": "មានទិន្នន័យសាកល្បងនៅសេសសល់",
  "warning": "សូមលុប ឬរក្សាទុកទិន្នន័យសាកល្បងជាមុនសិន",
  "test_data_count": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  }
}
```

#### GET - Get Test Mode Status
Returns current test mode status and related data.

**Request:**
```bash
GET /api/users/123/toggle-test-mode
```

**Response:**
```json
{
  "user": {
    "id": 123,
    "name": "គ្រូ សុខា",
    "role": "teacher",
    "test_mode_enabled": true,
    "can_use_test_mode": true
  },
  "active_session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "expires_at": "2025-10-07T..."
  },
  "test_data_count": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  }
}
```

**Permission Requirements:**
- Teachers can toggle their own test mode
- Admins can toggle test mode for any teacher
- Only teachers can have test mode

---

### 2. Promote to Production API
**Location:** `/app/api/test-data/promote-to-production/route.ts`

#### POST - Promote Test Data
Converts test data to production status.

**Request (By Session):**
```bash
POST /api/test-data/promote-to-production
Content-Type: application/json

{
  "test_session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request (By Status):**
```bash
{
  "record_status": "test_mentor"
}
```

**Request (By User):**
```bash
{
  "user_id": 123
}
```

**Request (Specific IDs):**
```bash
{
  "student_ids": [1, 2, 3],
  "assessment_ids": [10, 11, 12]
}
```

**Response:**
```json
{
  "success": true,
  "message": "បានផ្លាស់ប្តូរទិន្នន័យទៅផលិតកម្មដោយជោគជ័យ",
  "promoted": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  },
  "details": {
    "promoted_by": "Admin Name",
    "promoted_at": "2025-09-30T...",
    "filter_used": "session"
  }
}
```

#### GET - Preview Promotion (Dry Run)
Preview what data would be promoted without making changes.

**Request:**
```bash
GET /api/test-data/promote-to-production?test_session_id=550e8400...
```

**Response:**
```json
{
  "preview": {
    "students": [...],
    "assessments": [...],
    "mentoring_visits": [...]
  },
  "counts": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  },
  "warning": null
}
```

**What It Does:**
1. Changes `record_status` from `test_mentor`/`test_teacher` to `production`
2. Sets `is_temporary` to `false`
3. Clears `test_session_id`
4. Marks session as `completed` if promoting by session

**Permission Requirements:**
- Admin and coordinator only

---

### 3. Data Migration Script
**Location:** `/scripts/migrate-to-record-status.ts`

Migrates existing data from legacy boolean flags to record_status system.

#### Usage:
```bash
# Dry run (preview changes)
npx tsx scripts/migrate-to-record-status.ts --dry-run

# Verbose output
npx tsx scripts/migrate-to-record-status.ts --dry-run --verbose

# Execute migration
npx tsx scripts/migrate-to-record-status.ts
```

#### What It Does:
1. **Students:**
   - `is_temporary = true` + `added_by_mentor = true` → `record_status = 'test_mentor'`
   - `is_temporary = true` + `added_by.role = 'teacher'` → `record_status = 'test_teacher'`
   - Otherwise → `record_status = 'production'`

2. **Assessments:**
   - `is_temporary = true` + `assessed_by_mentor = true` → `record_status = 'test_mentor'`
   - `is_temporary = true` + `added_by.role = 'teacher'` → `record_status = 'test_teacher'`
   - Otherwise → `record_status = 'production'`

3. **Mentoring Visits:**
   - `is_temporary = true` + `mentor.role = 'mentor'` → `record_status = 'test_mentor'`
   - Otherwise → `record_status = 'production'`

#### Output Example:
```
🚀 Record Status Migration Script
==================================

✅ Database connected

📚 Migrating Students...
  Total: 150
  Production: 140
  Test (Mentor): 8
  Test (Teacher): 2
  Already Migrated: 0

📝 Migrating Assessments...
  Total: 300
  Production: 285
  Test (Mentor): 12
  Test (Teacher): 3
  Already Migrated: 0

👨‍🏫 Migrating Mentoring Visits...
  Total: 50
  Production: 45
  Test (Mentor): 5
  Test (Teacher): 0
  Already Migrated: 0

==================================================
📊 MIGRATION SUMMARY
==================================================

Total Records Processed: 500
  - Production: 470
  - Test (Mentor): 25
  - Test (Teacher): 5
  - Already Migrated: 0

✅ Migration completed successfully!
```

---

### 4. Test Mode Toggle UI Component
**Location:** `/components/TestModeToggle.tsx`

React component for teachers to toggle test mode.

#### Props:
```typescript
interface TestModeToggleProps {
  userId: number;
  initialEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  showStats?: boolean;
}
```

#### Usage:
```tsx
import TestModeToggle from '@/components/TestModeToggle';

// In a teacher settings page
<TestModeToggle
  userId={currentUser.id}
  initialEnabled={currentUser.test_mode_enabled}
  onToggle={(enabled) => {
    console.log('Test mode:', enabled);
  }}
  showStats={true}
/>
```

#### Features:
- ✅ Toggle switch with loading state
- ✅ Displays active test session info
- ✅ Shows test data statistics
- ✅ Warning modal when trying to disable with existing test data
- ✅ Help text explaining test mode
- ✅ Automatic status refresh
- ✅ Khmer localization

#### Visual States:

**Enabled:**
```
┌────────────────────────────────────────┐
│ 🧪 របៀបសាកល្បងបើកដំណើរការ     [ON] │
│ ទិន្នន័យដែលបង្កើតនឹងត្រូវកំណត់...    │
├────────────────────────────────────────┤
│ ℹ️ សម័យសាកល្បងសកម្ម                 │
│ លេខសម័យ: 550e8400...                 │
│ ផុតកំណត់: ០៧/១០/២០២៥               │
├────────────────────────────────────────┤
│ ទិន្នន័យសាកល្បង                      │
│ សិស្ស: 15  ការវាយតម្លៃ: 30  ទស្សនកិច្ច: 5│
│ សរុប: 50                               │
└────────────────────────────────────────┘
```

**Cannot Disable (Has Test Data):**
```
┌────────────────────────────────────────┐
│ ⚠️ មានទិន្នន័យសាកល្បងនៅសេសសល់       │
│ អ្នកមាន 50 កំណត់ត្រា                 │
│ សូមលុប ឬផ្លាស់ប្តូរទៅផលិតកម្ម...     │
│                                        │
│ [បោះបង់]  [គ្រប់គ្រងទិន្នន័យ]        │
└────────────────────────────────────────┘
```

---

### 5. Admin Dashboard for Test Data
**Location:** `/app/admin/test-data/page.tsx`

Comprehensive admin interface for managing all test data.

#### Features:

**Statistics Overview:**
- Total test data count
- Active sessions count
- Expired sessions count
- Archived sessions count

**Summary Tab:**
- Table showing counts by record_status
- Bulk action controls:
  - Select status filter
  - Promote to production
  - Archive data
  - Delete permanently

**Sessions Tab:**
- List of all test sessions
- Session details (ID, user, role, status, dates, data counts)
- Per-session actions:
  - Delete session data
  - Archive session data

#### Bulk Actions:

**Promote to Production:**
1. Select record_status (test_mentor, test_teacher, demo)
2. Click "ផ្លាស់ប្តូរទៅផលិតកម្ម"
3. Confirm action
4. Data converts to production

**Archive:**
1. Select record_status
2. Click "រក្សាទុក"
3. Data soft-deleted (status → archived)

**Delete:**
1. Select record_status
2. Click "លុបជាស្ថាពរ"
3. Data hard-deleted from database

#### Supporting APIs:

**Test Data Summary:**
```bash
GET /api/admin/test-data/summary
```

**Test Sessions List:**
```bash
GET /api/test-sessions/list?status=active&page=1&limit=50
```

---

## Permission Matrix

| Feature | Admin | Coordinator | Mentor | Teacher |
|---------|-------|-------------|--------|---------|
| Toggle own test mode | - | - | - | ✅ |
| Toggle any test mode | ✅ | - | - | - |
| View test data summary | ✅ | ✅ | - | - |
| Promote to production | ✅ | ✅ | - | - |
| Bulk archive | ✅ | ✅ | - | - |
| Bulk delete | ✅ | ✅ | ✅ (own) | - |
| View all sessions | ✅ | ✅ | - | - |
| Expire any session | ✅ | - | - | - |
| Admin dashboard | ✅ | ✅ | - | - |

## Integration Points

### Teacher Workflow:
1. Teacher logs in
2. Goes to Settings page
3. Sees TestModeToggle component
4. Enables test mode
5. Creates test students/assessments
6. Tests functionality
7. Either:
   - Deletes test data and disables test mode
   - Admin promotes data to production

### Admin Workflow:
1. Admin logs in
2. Goes to /admin/test-data
3. Views summary of all test data
4. Reviews test sessions
5. Actions:
   - Promotes useful test data to production
   - Archives old test data
   - Deletes expired test data
   - Expires active sessions

## Database Impact

### Schema Changes Required:
None - All Phase 3 features use existing schema from Phase 1.

### Data Changes:
- **Promotion:** `record_status` → 'production', `test_session_id` → null
- **Archive:** `record_status` → 'archived', `is_active` → false
- **Delete:** Physical deletion from database

## Error Handling

### Cannot Disable Test Mode:
```json
{
  "error": "មានទិន្នន័យសាកល្បងនៅសេសសល់",
  "test_data_count": { "total": 50 }
}
```

### Cannot Promote Production Data:
```json
{
  "error": "រកមិនឃើញទិន្នន័យសាកល្បងដែលត្រូវផ្លាស់ប្តូរ"
}
```

### Permission Denied:
```json
{
  "error": "អ្នកមិនមានសិទ្ធិកែប្រែការកំណត់នេះ"
}
```

## Testing Checklist

### Test Mode Toggle:
- [ ] Teacher can enable test mode
- [ ] Teacher can disable test mode (no data)
- [ ] Cannot disable with existing test data
- [ ] Admin can toggle any teacher's test mode
- [ ] Mentor cannot use toggle (teachers only)

### Promote to Production:
- [ ] Promote by session works
- [ ] Promote by status works
- [ ] Promote by user works
- [ ] Promote specific IDs works
- [ ] Preview (GET) shows correct data
- [ ] Session marked as completed

### Data Migration:
- [ ] Dry run works without changes
- [ ] Verbose mode shows details
- [ ] Migration correctly identifies test data
- [ ] Already-migrated data skipped
- [ ] Production data unchanged

### Admin Dashboard:
- [ ] Summary loads correctly
- [ ] Sessions list displays
- [ ] Bulk promote works
- [ ] Bulk archive works
- [ ] Bulk delete works
- [ ] Per-session actions work
- [ ] Statistics accurate

## Next Steps

After Phase 3:
1. Run data migration script on production
2. Test all workflows end-to-end
3. Update user documentation
4. Consider removing deprecated fields (Phase 4)

## Files Created

### APIs:
- `/app/api/users/[id]/toggle-test-mode/route.ts` - Toggle test mode
- `/app/api/test-data/promote-to-production/route.ts` - Promote data
- `/app/api/admin/test-data/summary/route.ts` - Test data summary
- `/app/api/test-sessions/list/route.ts` - List sessions

### Components:
- `/components/TestModeToggle.tsx` - Toggle UI component

### Pages:
- `/app/admin/test-data/page.tsx` - Admin dashboard

### Scripts:
- `/scripts/migrate-to-record-status.ts` - Data migration

### Permissions:
- Updated `/lib/permissions.ts` with Phase 3 permissions

## Success Criteria

- [x] Test mode toggle API implemented
- [x] Promote to production API implemented
- [x] Data migration script created
- [x] Test mode toggle UI component created
- [x] Admin dashboard created
- [x] Supporting APIs created
- [x] Permissions updated
- [ ] End-to-end testing complete
- [ ] Documentation finalized