# User Table Migration Guide - Option B Implementation

**Date:** 2025-10-02
**Status:** READY FOR EXECUTION
**Estimated Time:** 2-4 hours

## Overview

This migration consolidates `users` and `quick_login_users` tables into a single `users` table with a `login_type` field to eliminate the dual user system problem.

## Pre-Migration State

- **users table:** 85 users
- **quick_login_users table:** 87 users
- **Overlap:** All 85 users in `users` also exist in `quick_login_users`
- **Quick-only users:** 2 users (IDs 86-94 in quick_login_users)

## Migration Steps

### Step 1: Database Backup (CRITICAL!)

```bash
# Create full database backup
PGPASSWORD="P@ssw0rd" pg_dump \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  -F c \
  -f tarl_pratham_backup_$(date +%Y%m%d_%H%M%S).dump

# Verify backup file exists and has size
ls -lh tarl_pratham_backup_*.dump
```

**✅ CHECKPOINT:** Backup file must exist before continuing!

### Step 2: Run Migration SQL

```bash
# Execute migration script
PGPASSWORD="P@ssw0rd" psql \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  -f prisma/migrations/merge_user_tables.sql
```

**Expected Output:**
- "Users only in quick_login_users" count: 2
- Sample ID mapping shown
- Orphaned foreign keys check (should be 0)
- Total users after migration: 87
- Users by login_type: email (85), username (2)

**✅ CHECKPOINT:** Review migration output for errors!

### Step 3: Update Prisma Schema

```bash
# Generate new Prisma client with updated schema
npm run db:generate
```

**✅ CHECKPOINT:** No Prisma generation errors!

### Step 4: Update Authentication Logic

Edit `lib/auth.ts`:

**BEFORE:**
```typescript
if (credentials.loginType === "quick" && credentials.username) {
  const quickUser = await prisma.quickLoginUser.findUnique({
    where: { username: credentials.username }
  });
  // ...
}
```

**AFTER:**
```typescript
if (credentials.loginType === "quick" && credentials.username) {
  const user = await prisma.user.findUnique({
    where: { username_login: credentials.username }
  });

  if (!user || !user.is_active || user.login_type !== 'username') {
    throw new Error("Invalid credentials");
  }
  // ...
}
```

### Step 5: Remove QuickLoginUser References

**Files to Update:**
1. ✅ `prisma/schema.prisma` - Already commented out
2. `lib/auth.ts` - Remove all `prisma.quickLoginUser` calls
3. `app/api/auth/quick-users/route.ts` - Update to query `users` table
4. `app/api/auth/signup/route.ts` - Insert into `users` table instead

### Step 6: Test Authentication

```bash
# Start development server
npm run dev

# Test logins:
# 1. Email login (existing user)
# 2. Username login (migrated quick login user)
# 3. New signup
```

**Test Cases:**
- [ ] Admin email login works
- [ ] Teacher username login works (e.g., "Cheaphannha")
- [ ] New teacher signup creates user with login_type='username'
- [ ] Dashboard loads correctly
- [ ] User profile shows correct data
- [ ] Assessments show correct added_by user

**✅ CHECKPOINT:** All test cases pass!

### Step 7: Production Deployment

```bash
# 1. Build production
npm run build

# 2. Push to repository
git add -A
git commit -m "feat: Merge user tables - eliminate dual user system"
git push origin main

# 3. Deploy to production
# (Your deployment process here)
```

### Step 8: Drop Old Table (AFTER 48 HOURS)

**⚠️ WAIT 48 HOURS AFTER DEPLOYMENT!**

After confirming everything works in production:

```sql
-- Final cleanup
DROP TABLE IF EXISTS quick_login_users CASCADE;

-- Remove migration tracking fields
ALTER TABLE users DROP COLUMN IF EXISTS migrated_from_quick_login;
ALTER TABLE users DROP COLUMN IF EXISTS migration_date;
```

## Rollback Plan

If something goes wrong:

```bash
# Restore from backup
PGPASSWORD="P@ssw0rd" pg_restore \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  --clean \
  tarl_pratham_backup_TIMESTAMP.dump

# Revert code changes
git revert HEAD
npm run db:generate
npm run build
```

## Verification Queries

After migration, run these to verify:

```sql
-- Total users
SELECT COUNT(*) FROM users;
-- Expected: 87

-- Login types
SELECT login_type, COUNT(*) FROM users GROUP BY login_type;
-- Expected: email (85), username (2)

-- Migrated users
SELECT COUNT(*) FROM users WHERE migrated_from_quick_login = TRUE;
-- Expected: 2

-- Foreign key integrity
SELECT 'assessments' as table_name, COUNT(*) as broken_fks
FROM assessments a
WHERE added_by_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = a.added_by_id);
-- Expected: 0

SELECT 'students' as table_name, COUNT(*) as broken_fks
FROM students s
WHERE added_by_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = s.added_by_id);
-- Expected: 0
```

## Post-Migration Benefits

✅ **Single source of truth** for users
✅ **Consistent IDs** across entire system
✅ **No more isQuickLogin checks** everywhere
✅ **Simpler authentication** logic
✅ **Better data integrity**
✅ **Easier to add features**
✅ **Faster queries** (one table vs two)

## Timeline

- **Preparation:** 30 min (backup, review)
- **Migration Execution:** 15 min
- **Code Updates:** 2 hours
- **Testing:** 1 hour
- **Deployment:** 30 min
- **Monitoring:** 48 hours
- **Final Cleanup:** 15 min

**Total:** ~4-5 hours of active work + 48 hours monitoring

## Success Criteria

- [x] Migration SQL script created
- [x] Prisma schema updated
- [ ] All code references updated
- [ ] All tests passing
- [ ] Production deployment successful
- [ ] No authentication errors in production
- [ ] All foreign keys intact
- [ ] quick_login_users table dropped (after 48h)

---

**Last Updated:** 2025-10-02
**Migration Script:** `/prisma/migrations/merge_user_tables.sql`
**Backup Location:** TBD after Step 1
