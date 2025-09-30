# Record Status System Implementation

## Overview
Comprehensive 3-phase implementation of universal record status tracking system to replace scattered `is_temporary` and `added_by_mentor` flags across all tables.

## Phase 1: Core Infrastructure ✅ COMPLETED

### Schema Changes
- ✅ Added `RecordStatus` enum: production, test_mentor, test_teacher, demo, archived
- ✅ Added `record_status` field to: Student, Assessment, MentoringVisit
- ✅ Added `created_by_role` field for tracking creator role
- ✅ Added `test_session_id` for grouping related test records
- ✅ Added `test_mode_enabled` to User model for teacher test toggle
- ✅ Added indexes for performance on all status fields
- ✅ Kept deprecated fields for backward compatibility

### Utilities Created
- ✅ `/lib/utils/recordStatus.ts` - Helper functions for:
  - `getRecordStatus()` - Determine status based on role
  - `getRecordStatusFilter()` - Build Prisma where clauses
  - `isTestData()` - Check if record is test data
  - `canModifyRecord()` - Permission checking
  - `generateTestSessionId()` - UUID generation
  - `getTestDataExpiryDate()` - Calculate expiry
  - UI helpers for labels and colors

### API Updates - In Progress
- ✅ Students API (GET/POST) - Uses record_status
- ⏳ Students API (PUT/DELETE) - Needs update
- ⏳ Assessments API - Needs update
- ⏳ Mentoring Visits API - Needs update
- ⏳ Mock Data Service - Needs update

## Phase 2: Test Session Management (Ready to implement)

### New Test_sessions Table ✅ Created
```prisma
model TestSession {
  id                    String
  user_id               Int
  user_role             String
  started_at            DateTime
  expires_at            DateTime?
  status                String // active, expired, archived
  student_count         Int
  assessment_count      Int
  mentoring_visit_count Int
  notes                 String?
}
```

### APIs to Create
- `/api/mentor/test-session` - Already exists, needs update
- `/api/test-sessions/create` - Start new session
- `/api/test-sessions/[id]/stats` - Get session statistics
- `/api/test-sessions/[id]/expire` - Manually expire session

### Bulk Operations to Add
- `/api/bulk/delete-test-data` - Delete by status
- `/api/bulk/archive-test-data` - Archive by status
- `/api/bulk/filter` - Advanced filtering

## Phase 3: Advanced Features (Ready to implement)

### Test Mode Toggle for Teachers
- ✅ Schema field added: `User.test_mode_enabled`
- ⏳ UI toggle in teacher dashboard
- ⏳ API: `/api/users/toggle-test-mode`
- ⏳ Automatic status assignment based on toggle

### Promote to Production
- ⏳ API: `/api/records/promote` - Convert test→production
- ⏳ Admin dashboard button
- ⏳ Bulk promote functionality
- ⏳ Validation before promotion

### Data Migration
- ⏳ Script: `/scripts/migrate-to-record-status.ts`
- ⏳ Migrate existing is_temporary → record_status
- ⏳ Migrate added_by_mentor → created_by_role
- ⏳ Backup before migration

### Cleanup Deprecated Fields
- ⏳ Remove `is_temporary` from models
- ⏳ Remove `added_by_mentor` from models
- ⏳ Remove `assessed_by_mentor` from models
- ⏳ Update all queries using old fields

## Admin Dashboard Features (Planned)

### Test Data Management Page
- View all test data by status
- Filter by: user, role, date range, session
- Bulk operations: delete, archive, promote
- Statistics: counts by status, creator, date

### Visualizations
- Test data timeline
- User test activity
- Session statistics
- Cleanup predictions

## Benefits

### 1. Single Source of Truth
✅ One field (`record_status`) instead of multiple booleans
✅ Clear, explicit status values
✅ Easy to query and filter

### 2. Flexible Data Management
✅ Easy bulk operations: `WHERE record_status IN ('test_mentor', 'test_teacher')`
✅ Clear separation of test and production data
✅ Support for demo and archived data

### 3. Session-Based Testing
✅ Group related test records
✅ Track test sessions over time
✅ Easy cleanup of entire sessions

### 4. Future-Proof
✅ Can add new statuses easily (e.g., 'draft', 'pending_review')
✅ Extensible for new features
✅ Backward compatible during transition

## Migration Strategy

### Current State
- Old fields still exist and work
- New fields being populated for new records
- Both systems running in parallel

### Transition Period (Recommended: 2 weeks)
1. Monitor data quality
2. Verify all new records have correct status
3. Test all CRUD operations
4. Validate queries and filters

### Final Cutover
1. Run migration script for existing data
2. Update all remaining APIs
3. Remove deprecated fields from schema
4. Update documentation

## Testing Checklist

### Phase 1
- [ ] Mentor creates student → record_status = 'test_mentor'
- [ ] Teacher creates student → record_status = 'production'
- [ ] Teacher with test_mode → record_status = 'test_teacher'
- [ ] Filter works: mentors see test_mentor + production
- [ ] Filter works: teachers see test_teacher + production
- [ ] Filter works: admins see production only (by default)

### Phase 2
- [ ] Create test session
- [ ] Link records to session
- [ ] Get session statistics
- [ ] Delete entire session
- [ ] Session auto-expiry

### Phase 3
- [ ] Toggle teacher test mode
- [ ] Promote test data to production
- [ ] Migrate existing data
- [ ] Remove deprecated fields
- [ ] All queries still work

## API Documentation

### Query Parameters
```typescript
// GET /api/students
?include_test_data=true    // Show all data including test
?record_status=production  // Filter by specific status
?test_session_id=xxx       // Filter by session
```

### Response Format
```json
{
  "data": [{
    "id": 1,
    "name": "Student",
    "record_status": "production",
    "created_by_role": "teacher",
    "test_session_id": null
  }],
  "meta": {
    "has_test_data": false,
    "test_data_count": 0
  }
}
```

## Next Steps

1. ✅ Complete Phase 1 API updates
2. Implement Phase 2 session management
3. Add admin dashboard
4. Implement Phase 3 features
5. Run comprehensive tests
6. Migrate existing data
7. Remove deprecated fields
8. Update documentation

## Files Modified

### Schema
- `prisma/schema.prisma` - Added enum, fields, indexes

### Utilities
- `lib/utils/recordStatus.ts` - NEW helper functions

### APIs (In Progress)
- `app/api/students/route.ts` - Using record_status
- `app/api/students/[id]/route.ts` - Needs update
- `app/api/assessments/*.ts` - Needs update
- `app/api/mentoring/*.ts` - Needs update

### APIs (To Create)
- `app/api/test-sessions/*.ts`
- `app/api/bulk/*.ts`
- `app/api/records/promote/route.ts`

### UI Components (To Create)
- Test mode toggle
- Test data badge
- Admin dashboard
- Bulk operations UI

## Timeline Estimate

- **Phase 1 Completion**: 2-3 hours remaining
- **Phase 2 Implementation**: 4-5 hours
- **Phase 3 Implementation**: 6-8 hours
- **Testing & Migration**: 4-6 hours
- **Total**: ~20-25 hours

## Success Criteria

✅ All new records use record_status
✅ Filtering works correctly for all roles
✅ Test data clearly identified in UI
✅ Easy bulk cleanup operations
✅ Session-based test tracking
✅ Zero data loss during migration
✅ All tests passing
✅ Documentation complete