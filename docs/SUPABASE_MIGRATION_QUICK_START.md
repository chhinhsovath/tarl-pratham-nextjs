# Supabase Migration - Quick Start Guide

## 🚀 Ready to Migrate? Follow These 3 Steps

### ✅ What You Have
- ✅ Supabase project: `cftkquoslfwkwavhkspu`
- ✅ Anon key
- ✅ Service role key
- ✅ JWT secret
- ✅ Project URL: `https://cftkquoslfwkwavhkspu.supabase.co`

### ❌ What You Need
- ❌ **Supabase database password** (get from dashboard)

---

## Step 1: Get Supabase Database Connection String

1. Go to: https://supabase.com/dashboard/project/cftkquoslfwkwavhkspu
2. Click: **Settings** → **Database**
3. Find: **Connection string** section
4. Select: **URI** mode
5. Copy the connection string

It will look like:
```
postgresql://postgres.cftkquoslfwkwavhkspu:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**Important**: Copy the full password from this string.

---

## Step 2: Run Migration Scripts

### A. Backup Current Database
```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

# Run backup script (will create ~/tarl-migration-backup/)
./scripts/01_backup_database.sh
```

**This will:**
- Connect to 157.10.73.52 (current database)
- Create 3 backup files (.dump, .sql, schema)
- Verify backup integrity
- Show database statistics

**Expected time**: 5-10 minutes

---

### B. Update Restore Script with Supabase Credentials

Edit the restore script:
```bash
nano scripts/02_restore_to_supabase.sh
```

Update these lines (around line 24-28):
```bash
SUPABASE_HOST="aws-0-us-east-1.pooler.supabase.com"  # From your connection string
SUPABASE_USER="postgres.cftkquoslfwkwavhkspu"        # From your connection string
SUPABASE_PASSWORD="your-actual-password-here"        # ⚠️ IMPORTANT: Set this!
```

Save and exit (Ctrl+O, Enter, Ctrl+X)

---

### C. Restore to Supabase
```bash
# Run restore script
./scripts/02_restore_to_supabase.sh
```

**This will:**
- Test Supabase connection
- Restore all tables and data
- Verify restore success
- Create new .env.supabase file

**Expected time**: 10-30 minutes

---

### D. Verify Migration
```bash
# Run verification script
./scripts/03_verify_migration.sh
```

**This will:**
- Compare table counts (source vs Supabase)
- Compare row counts for all tables
- Test foreign key relationships
- Verify indexes
- Run test queries

**Expected output**: All checks should pass (green ✓)

---

## Step 3: Update Application

### A. Backup Current .env
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### B. Copy New Supabase Configuration
```bash
# Copy generated config from migration backup
cp ~/tarl-migration-backup/.env.supabase .env
```

### C. Regenerate Prisma Client
```bash
npm run db:generate
```

### D. Test Application
```bash
npm run dev
```

**Test these flows:**
- [ ] Login with email/password
- [ ] Quick login with username
- [ ] View students list
- [ ] Create new student
- [ ] View/create assessments
- [ ] Dashboard loads correctly
- [ ] Reports work

---

## Quick Troubleshooting

### Issue: "Cannot connect to Supabase"
**Solution**: Check these:
1. Password is correct (no extra spaces)
2. Using Session mode port 5432 (not 6543)
3. IP is allowed in Supabase dashboard

### Issue: "Table counts don't match"
**Solution**: Check restore log:
```bash
cat ~/tarl-migration-backup/restore_*.log | grep -i error
```

### Issue: "Application can't connect to database"
**Solution**:
1. Verify DATABASE_URL in .env
2. Use Transaction mode for app (port 6543):
   ```
   DATABASE_URL="postgresql://...@host:6543/postgres?pgbouncer=true"
   ```
3. Regenerate Prisma: `npm run db:generate`

---

## Connection Modes Explained

**Session Mode (Port 5432)**
- For: Migrations, pg_dump, pg_restore, admin tasks
- Supports: All PostgreSQL features
- Use in: Migration scripts

**Transaction Mode (Port 6543)**
- For: Application queries
- Supports: Fast connection pooling (PgBouncer)
- Use in: .env DATABASE_URL
- Must add: `?pgbouncer=true` to connection string

---

## Rollback Plan

If migration fails:

```bash
# 1. Restore old .env
cp .env.backup.[TIMESTAMP] .env

# 2. Regenerate Prisma
npm run db:generate

# 3. Restart app
npm run dev
```

Your data on 157.10.73.52 remains unchanged.

---

## Complete Documentation

For detailed information, see:
- **Full Guide**: `docs/MIGRATION_TO_SUPABASE.md`
- **Backup Script**: `scripts/01_backup_database.sh`
- **Restore Script**: `scripts/02_restore_to_supabase.sh`
- **Verify Script**: `scripts/03_verify_migration.sh`
- **Env Template**: `.env.supabase.template`

---

## Need Help?

1. **Check logs**:
   - Backup: `~/tarl-migration-backup/backup_manifest_*.txt`
   - Restore: `~/tarl-migration-backup/restore_*.log`
   - Verify: `~/tarl-migration-backup/verification_*.log`

2. **Supabase Dashboard**:
   - Project: https://supabase.com/dashboard/project/cftkquoslfwkwavhkspu
   - Logs: https://supabase.com/dashboard/project/cftkquoslfwkwavhkspu/logs/postgres-logs

3. **Common Issues**: See `docs/MIGRATION_TO_SUPABASE.md#troubleshooting`

---

## Estimated Total Time

- **Backup**: 5-10 minutes
- **Restore**: 10-30 minutes
- **Verify**: 5 minutes
- **Update App**: 5 minutes
- **Testing**: 15-30 minutes

**Total**: 40-80 minutes (depending on data size)

---

## After Migration Checklist

- [ ] All tables migrated (31 tables)
- [ ] Row counts match source database
- [ ] Application connects to Supabase
- [ ] Login works (email and quick login)
- [ ] Students/assessments CRUD works
- [ ] Dashboard loads correctly
- [ ] Reports generate correctly
- [ ] No console errors
- [ ] Old .env backed up
- [ ] Migration logs saved
- [ ] Team notified of migration

---

**Ready to start?** Run: `./scripts/01_backup_database.sh`
