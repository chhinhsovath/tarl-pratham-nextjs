# Complete Guide: Record Status System Implementation

## 🎯 Overview

The Record Status System is a comprehensive solution for managing test data, production data, and data lifecycle in the TaRL Pratham application. It replaces scattered boolean flags with a unified enum-based system.

## 📊 System Architecture

### Record Status Enum
```typescript
enum RecordStatus {
  production    // Real production data
  test_mentor   // Test data created by mentors
  test_teacher  // Test data created by teachers (in test mode)
  demo          // Demo/sample data for training
  archived      // Soft-deleted data
}
```

### Core Tables
- **students** - Student records
- **assessments** - Assessment records
- **mentoring_visits** - Mentoring visit records
- **test_sessions** - Test session tracking

### Key Fields Added
All data tables now have:
- `record_status` - Status enum (production, test_mentor, test_teacher, demo, archived)
- `created_by_role` - Role of creator (admin, coordinator, mentor, teacher)
- `test_session_id` - UUID linking to test session (nullable)

## 🔄 Three-Phase Implementation

### Phase 1: Core Infrastructure ✅
**Completed:** Database schema, utilities, basic API updates

**Files:**
- Schema: `prisma/schema.prisma`
- Utilities: `lib/utils/recordStatus.ts`
- APIs: Updated students, assessments, mentoring visits
- Docs: `docs/RECORD_STATUS_IMPLEMENTATION.md`

**Key Features:**
- RecordStatus enum with 5 states
- TestSession model for tracking
- Helper functions for status management
- Backward compatibility with legacy flags

### Phase 2: Session Management & Bulk Operations ✅
**Completed:** Test sessions, bulk operations, permissions

**Files:**
- APIs:
  - `/api/test-sessions/create` - Create sessions
  - `/api/test-sessions/[id]/expire` - Expire sessions
  - `/api/bulk/delete-test-data` - Bulk delete
  - `/api/bulk/archive-test-data` - Bulk archive
- Permissions: `lib/permissions.ts`
- Docs: `docs/PHASE_2_TEST_CHECKLIST.md`

**Key Features:**
- Automatic session creation for test data
- Session expiry with 7-day default
- Bulk operations by status, user, or session
- Hard delete for test data, soft delete for production
- Permission-based access control

### Phase 3: UI, Management & Migration ✅
**Completed:** Test mode toggle, admin dashboard, migration script

**Files:**
- APIs:
  - `/api/users/[id]/toggle-test-mode` - Toggle test mode
  - `/api/test-data/promote-to-production` - Promote data
  - `/api/admin/test-data/summary` - Data summary
  - `/api/test-sessions/list` - List sessions
- UI:
  - `/components/TestModeToggle.tsx` - Toggle component
  - `/app/admin/test-data/page.tsx` - Admin dashboard
- Scripts:
  - `/scripts/migrate-to-record-status.ts` - Migration
- Docs: `docs/PHASE_3_IMPLEMENTATION.md`

**Key Features:**
- Teacher test mode toggle
- Promote test data to production
- Admin dashboard for bulk management
- Data migration from legacy system
- Comprehensive permissions

## 🚀 Getting Started

### For Teachers

**1. Enable Test Mode:**
```typescript
// In your settings page
<TestModeToggle
  userId={currentUser.id}
  showStats={true}
/>
```

**2. Create Test Data:**
```bash
# Students, assessments, and mentoring visits created while
# test mode is enabled will be marked as test_teacher
```

**3. Clean Up:**
```bash
# Option A: Delete test data
DELETE /api/bulk/delete-test-data
{ "user_id": YOUR_ID }

# Option B: Admin promotes to production
POST /api/test-data/promote-to-production
{ "user_id": YOUR_ID }
```

### For Mentors

**1. Create Test Session:**
```bash
POST /api/test-sessions/create
{
  "notes": "Testing student registration",
  "expiry_days": 7
}
```

**2. Create Test Data:**
All data created by mentors is automatically marked as `test_mentor` and linked to active session.

**3. Clean Up:**
```bash
# Delete all mentor test data
POST /api/bulk/delete-test-data
{ "record_status": "test_mentor" }

# Or expire specific session
POST /api/test-sessions/SESSION_ID/expire
{ "action": "delete" }
```

### For Admins/Coordinators

**1. View Test Data:**
Navigate to `/admin/test-data` to see:
- Summary by status
- All test sessions
- Bulk operation controls

**2. Manage Test Data:**
```bash
# Promote to production
POST /api/test-data/promote-to-production
{ "record_status": "test_mentor" }

# Archive
POST /api/bulk/archive-test-data
{ "record_status": "test_teacher" }

# Delete permanently
POST /api/bulk/delete-test-data
{ "test_session_id": "SESSION_ID" }
```

**3. Migrate Legacy Data:**
```bash
# Preview migration
npx tsx scripts/migrate-to-record-status.ts --dry-run --verbose

# Execute migration
npx tsx scripts/migrate-to-record-status.ts
```

## 📋 Common Workflows

### Workflow 1: Teacher Testing New Feature
```
1. Teacher enables test mode in settings
2. Creates test students
3. Creates test assessments
4. Tests functionality
5. Decision:
   - If good → Admin promotes to production
   - If bad → Teacher deletes test data
6. Teacher disables test mode
```

### Workflow 2: Mentor Training Session
```
1. Mentor creates test session (7-day expiry)
2. Demonstrates creating students
3. Demonstrates conducting assessments
4. Demonstrates mentoring visits
5. After training → Bulk delete test session data
6. Test data auto-expires in 7 days if forgotten
```

### Workflow 3: Admin Data Cleanup
```
1. Admin views /admin/test-data
2. Reviews test data summary
3. Identifies old test sessions
4. Actions:
   - Promotes good test data to production
   - Archives data for record-keeping
   - Deletes expired/unnecessary data
```

### Workflow 4: Production Data Migration
```
1. Run migration script in dry-run mode
2. Review proposed changes
3. Execute migration
4. Verify data integrity
5. Optionally remove deprecated fields (future phase)
```

## 🔒 Permission Matrix

| Action | Admin | Coordinator | Mentor | Teacher | Viewer |
|--------|-------|-------------|--------|---------|--------|
| **Data Creation** |
| Create production data | ✅ | ✅ | ❌ | ✅* | ❌ |
| Create test data | ✅ | ✅ | ✅ | ✅** | ❌ |
| **Test Mode** |
| Toggle own test mode | - | - | N/A | ✅ | - |
| Toggle any test mode | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Data Management** |
| View all test data | ✅ | ✅ | ❌ | ❌ | ❌ |
| Promote to production | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bulk archive | ✅ | ✅ | ❌ | ❌ | ❌ |
| Bulk delete all | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete own test data | ✅ | ✅ | ✅ | ✅** | ❌ |
| **Sessions** |
| Create test session | ✅ | ✅ | ✅ | ✅** | ❌ |
| View all sessions | ✅ | ✅ | ❌ | ❌ | ❌ |
| Expire any session | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Dashboard** |
| Access admin dashboard | ✅ | ✅ | ❌ | ❌ | ❌ |

\* Teachers create production data for their classes
\** When test mode enabled

## 🔍 API Reference

### Quick Reference Table

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/test-sessions/create` | POST | Create test session | Mentor/Teacher |
| `/api/test-sessions/[id]/expire` | POST | Expire session | Owner/Admin |
| `/api/test-sessions/list` | GET | List all sessions | Admin/Coordinator |
| `/api/bulk/delete-test-data` | POST | Bulk delete | Admin/Coordinator/Mentor |
| `/api/bulk/archive-test-data` | POST | Bulk archive | Admin/Coordinator |
| `/api/test-data/promote-to-production` | POST | Promote data | Admin/Coordinator |
| `/api/test-data/promote-to-production` | GET | Preview promotion | Admin/Coordinator |
| `/api/users/[id]/toggle-test-mode` | POST | Toggle test mode | Teacher/Admin |
| `/api/users/[id]/toggle-test-mode` | GET | Get test mode status | Teacher/Admin |
| `/api/admin/test-data/summary` | GET | Data summary | Admin/Coordinator |

### Detailed Examples

#### Create Test Session
```bash
POST /api/test-sessions/create
Content-Type: application/json

{
  "notes": "Training session for new mentors",
  "expiry_days": 7
}

# Response
{
  "success": true,
  "message": "បានបង្កើតសម័យសាកល្បងថ្មីដោយជោគជ័យ",
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": 123,
    "user_role": "mentor",
    "expires_at": "2025-10-07T...",
    "status": "active"
  }
}
```

#### Toggle Test Mode
```bash
POST /api/users/123/toggle-test-mode
Content-Type: application/json

{
  "enabled": true
}

# Response (Success)
{
  "success": true,
  "message": "បានបើករបៀបសាកល្បងដោយជោគជ័យ",
  "user": {
    "id": 123,
    "test_mode_enabled": true
  }
}

# Response (Has Test Data)
{
  "error": "មានទិន្នន័យសាកល្បងនៅសេសសល់",
  "test_data_count": {
    "total": 50
  }
}
```

#### Promote to Production
```bash
POST /api/test-data/promote-to-production
Content-Type: application/json

{
  "test_session_id": "550e8400-e29b-41d4-a716-446655440000"
}

# Response
{
  "success": true,
  "promoted": {
    "students": 15,
    "assessments": 30,
    "mentoring_visits": 5,
    "total": 50
  }
}
```

#### Bulk Delete
```bash
POST /api/bulk/delete-test-data
Content-Type: application/json

{
  "record_status": "test_mentor"
}

# Response
{
  "success": true,
  "deleted": {
    "students": 10,
    "assessments": 20,
    "mentoring_visits": 3,
    "total": 33
  }
}
```

## 🗄️ Database Queries

### Check Data Distribution
```sql
-- Students by status
SELECT record_status, COUNT(*) as count
FROM students
GROUP BY record_status
ORDER BY count DESC;

-- Assessments by status
SELECT record_status, COUNT(*) as count
FROM assessments
GROUP BY record_status
ORDER BY count DESC;
```

### Find Test Data by Session
```sql
SELECT
  s.id,
  s.name,
  s.record_status,
  s.test_session_id,
  ts.user_id,
  ts.status as session_status
FROM students s
JOIN test_sessions ts ON s.test_session_id = ts.id
WHERE ts.status = 'active';
```

### Session Statistics
```sql
SELECT
  ts.id,
  ts.user_role,
  ts.status,
  COUNT(DISTINCT s.id) as students,
  COUNT(DISTINCT a.id) as assessments,
  COUNT(DISTINCT mv.id) as visits
FROM test_sessions ts
LEFT JOIN students s ON s.test_session_id = ts.id
LEFT JOIN assessments a ON a.test_session_id = ts.id
LEFT JOIN mentoring_visits mv ON mv.test_session_id = ts.id
GROUP BY ts.id
ORDER BY ts.created_at DESC;
```

## 🐛 Troubleshooting

### Issue: Cannot disable test mode
**Symptom:** Error "មានទិន្នន័យសាកល្បងនៅសេសសល់"
**Solution:** Delete or promote test data first
```bash
# Check test data count
GET /api/users/123/toggle-test-mode

# Delete test data
POST /api/bulk/delete-test-data
{ "user_id": 123 }
```

### Issue: Data not linking to session
**Symptom:** `test_session_id` is null
**Solution:**
1. Check if user has active session
2. Verify record_status is test_mentor or test_teacher
3. Check session creation worked properly

### Issue: Cannot promote data
**Symptom:** "រកមិនឃើញទិន្នន័យសាកល្បង"
**Solution:** Verify data has test status (not already production)

### Issue: Migration script errors
**Symptom:** Script fails during migration
**Solution:**
1. Run with `--dry-run` first
2. Check database connection
3. Verify Prisma client is generated
4. Review error logs

## 📈 Monitoring & Maintenance

### Daily Tasks
- Review active test sessions
- Check for expired sessions
- Monitor test data volume

### Weekly Tasks
- Clean up expired test data
- Review and promote good test data
- Archive old sessions

### Monthly Tasks
- Run data distribution reports
- Review permission effectiveness
- Update documentation

### Monitoring Queries
```sql
-- Active sessions count
SELECT COUNT(*) FROM test_sessions WHERE status = 'active';

-- Expired but not cleaned
SELECT COUNT(*) FROM test_sessions
WHERE expires_at < NOW() AND status = 'active';

-- Test data volume
SELECT
  'students' as table_name,
  SUM(CASE WHEN record_status LIKE 'test%' THEN 1 ELSE 0 END) as test_count,
  COUNT(*) as total_count
FROM students
UNION ALL
SELECT
  'assessments',
  SUM(CASE WHEN record_status LIKE 'test%' THEN 1 ELSE 0 END),
  COUNT(*)
FROM assessments;
```

## 🔮 Future Enhancements

### Phase 4 (Optional):
- Remove deprecated fields (`is_temporary`, `added_by_mentor`, etc.)
- Add automated expiry cleanup job
- Create data retention policies
- Add test data usage analytics
- Implement data export for test sessions

### Potential Features:
- Test data templates
- Collaborative test sessions
- Test data snapshots
- Rollback functionality
- Advanced filtering in admin dashboard

## 📚 Additional Resources

- **Phase 1 Details:** `docs/RECORD_STATUS_IMPLEMENTATION.md`
- **Phase 2 Testing:** `docs/PHASE_2_TEST_CHECKLIST.md`
- **Phase 3 Implementation:** `docs/PHASE_3_IMPLEMENTATION.md`
- **Schema Reference:** `prisma/schema.prisma`
- **Utilities:** `lib/utils/recordStatus.ts`
- **Permissions:** `lib/permissions.ts`

## 🎓 Training Materials

### For Teachers:
1. What is test mode?
2. When to use test mode?
3. How to enable/disable test mode?
4. Managing test data

### For Mentors:
1. Creating test sessions
2. Demonstrating features safely
3. Cleaning up after training
4. Understanding session expiry

### For Admins:
1. Monitoring test data
2. Promoting useful test data
3. Managing test sessions
4. Running migration scripts
5. Using admin dashboard

## ✅ Success Metrics

- ✅ All 3 phases implemented
- ✅ 15+ APIs created
- ✅ Full test mode system
- ✅ Admin dashboard operational
- ✅ Data migration script ready
- ✅ Comprehensive documentation
- ✅ Permission system updated
- ✅ Backward compatibility maintained

## 🏆 Achievements

This implementation provides:
1. **Clear Data Lifecycle** - Know what's test vs production
2. **Safe Testing** - Test features without affecting real data
3. **Easy Cleanup** - Bulk operations for data management
4. **Session Tracking** - Know what data belongs together
5. **Flexible Promotion** - Convert test data to production when ready
6. **Audit Trail** - Track who created what and when
7. **Automatic Expiry** - Test data doesn't clutter system forever
8. **Admin Control** - Comprehensive dashboard for oversight

---

**Status:** ✅ All phases complete
**Last Updated:** 2025-09-30
**Version:** 1.0.0