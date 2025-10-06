# Database Migration: PostgreSQL to Supabase

## Overview
This guide provides step-by-step instructions for migrating the TaRL Pratham database from the current PostgreSQL server (157.10.73.52) to Supabase.

## Pre-Migration Checklist

### ✅ Prerequisites
- [x] Supabase project created
- [x] Supabase credentials obtained:
  - Project URL: `https://cftkquoslfwkwavhkspu.supabase.co`
  - Anon public key
  - Service role secret
  - JWT secret
- [ ] **Supabase database connection string** (REQUIRED - see below)
- [x] `pg_dump` and `pg_restore` installed
- [ ] Backup storage space available (estimate ~500MB-2GB)
- [ ] Maintenance window scheduled (recommended: 2-4 hours)

### 🔑 Get Supabase Database Connection String

1. Go to: https://supabase.com/dashboard/project/cftkquoslfwkwavhkspu
2. Navigate to: **Settings** → **Database** → **Connection string**
3. Select **URI** mode
4. Copy the connection string (format):
   ```
   postgresql://postgres.cftkquoslfwkwavhkspu:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. **Note**: Use **Session mode** for migration (port 5432), not Transaction mode (port 6543)

---

## Migration Steps

### Step 1: Backup Current Database

#### A. Full Database Backup
```bash
# Create backup directory
mkdir -p ~/tarl-migration-backup
cd ~/tarl-migration-backup

# Full database dump (custom format - recommended)
PGPASSWORD="P@ssw0rd" pg_dump \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  --no-owner \
  --no-acl \
  -F c \
  -f tarl_pratham_$(date +%Y%m%d_%H%M%S).dump

# Verify backup file exists
ls -lh tarl_pratham_*.dump
```

**Expected output**: File size ~500MB-2GB depending on data volume

#### B. SQL Format Backup (Alternative)
```bash
# SQL format (human-readable, for inspection)
PGPASSWORD="P@ssw0rd" pg_dump \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  --no-owner \
  --no-acl \
  -f tarl_pratham_$(date +%Y%m%d_%H%M%S).sql
```

#### C. Schema-Only Backup (For verification)
```bash
PGPASSWORD="P@ssw0rd" pg_dump \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  --schema-only \
  --no-owner \
  --no-acl \
  -f tarl_pratham_schema_$(date +%Y%m%d_%H%M%S).sql
```

---

### Step 2: Prepare Supabase Database

#### A. Extract Connection Details from Supabase URL
From your connection string:
```
postgresql://postgres.cftkquoslfwkwavhkspu:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Extract:
- **Host**: `aws-0-us-east-1.pooler.supabase.com` (or similar)
- **Port**: `5432` (Session mode, NOT 6543)
- **User**: `postgres.cftkquoslfwkwavhkspu` (or just `postgres`)
- **Database**: `postgres`
- **Password**: `[YOUR-PASSWORD]`

#### B. Test Connection
```bash
# Replace with your actual Supabase connection details
PGPASSWORD="[YOUR-PASSWORD]" psql \
  -h aws-0-us-east-1.pooler.supabase.com \
  -p 5432 \
  -U postgres.cftkquoslfwkwavhkspu \
  -d postgres \
  -c "SELECT version();"
```

**Expected output**: PostgreSQL version info

---

### Step 3: Restore Database to Supabase

#### A. Restore Using Custom Format Dump
```bash
# Replace [YOUR-PASSWORD], [SUPABASE-HOST], [SUPABASE-USER] with actual values
PGPASSWORD="[YOUR-PASSWORD]" pg_restore \
  -h [SUPABASE-HOST] \
  -p 5432 \
  -U [SUPABASE-USER] \
  -d postgres \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  -v \
  tarl_pratham_*.dump

# Example:
# PGPASSWORD="your-supabase-password" pg_restore \
#   -h aws-0-us-east-1.pooler.supabase.com \
#   -p 5432 \
#   -U postgres.cftkquoslfwkwavhkspu \
#   -d postgres \
#   --no-owner \
#   --no-acl \
#   --clean \
#   --if-exists \
#   -v \
#   tarl_pratham_20250106_120000.dump
```

**Options explained**:
- `--no-owner`: Don't set ownership (Supabase manages this)
- `--no-acl`: Don't restore permissions (Supabase manages this)
- `--clean`: Drop existing objects before restoring
- `--if-exists`: Don't error if objects don't exist
- `-v`: Verbose output

#### B. If Restore Has Errors (Common)
Some errors are normal with `--no-owner` and `--no-acl`. To filter:

```bash
# Restore and log output
PGPASSWORD="[YOUR-PASSWORD]" pg_restore \
  -h [SUPABASE-HOST] \
  -p 5432 \
  -U [SUPABASE-USER] \
  -d postgres \
  --no-owner \
  --no-acl \
  --clean \
  --if-exists \
  -v \
  tarl_pratham_*.dump 2>&1 | tee restore.log

# Check for critical errors (ignore owner/permission errors)
grep -i "error" restore.log | grep -v "owner" | grep -v "permission"
```

---

### Step 4: Verify Migration

#### A. Check Table Count
```bash
# Current database
PGPASSWORD="P@ssw0rd" psql \
  -h 157.10.73.52 \
  -p 5432 \
  -U admin \
  -d tarl_pratham \
  -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Supabase database
PGPASSWORD="[YOUR-PASSWORD]" psql \
  -h [SUPABASE-HOST] \
  -p 5432 \
  -U [SUPABASE-USER] \
  -d postgres \
  -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

**Expected**: Same table count (31 tables from Prisma schema)

#### B. Check Row Counts for Key Tables
```bash
# Save as check_row_counts.sh
cat > check_row_counts.sh << 'EOF'
#!/bin/bash

TABLES="users students assessments mentoring_visits pilot_schools schools quick_login_users"

echo "=== ROW COUNT COMPARISON ==="
echo ""

for table in $TABLES; do
  echo "Table: $table"

  # Current DB
  OLD_COUNT=$(PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -p 5432 -U admin -d tarl_pratham -t -c "SELECT COUNT(*) FROM $table;")

  # Supabase DB (UPDATE THESE VALUES)
  NEW_COUNT=$(PGPASSWORD="[YOUR-PASSWORD]" psql -h [SUPABASE-HOST] -p 5432 -U [SUPABASE-USER] -d postgres -t -c "SELECT COUNT(*) FROM $table;")

  echo "  Current DB: $OLD_COUNT"
  echo "  Supabase:   $NEW_COUNT"

  if [ "$OLD_COUNT" = "$NEW_COUNT" ]; then
    echo "  ✅ Match"
  else
    echo "  ❌ Mismatch!"
  fi
  echo ""
done
EOF

chmod +x check_row_counts.sh
./check_row_counts.sh
```

#### C. Test Critical Queries
```sql
-- Run on Supabase to verify data integrity

-- 1. Check users
SELECT COUNT(*) as total_users,
       COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
FROM users;

-- 2. Check students
SELECT COUNT(*) as total_students,
       COUNT(CASE WHEN is_active = true THEN 1 END) as active_students
FROM students;

-- 3. Check assessments
SELECT assessment_type, COUNT(*) as count
FROM assessments
GROUP BY assessment_type;

-- 4. Check pilot schools
SELECT COUNT(*) as total_schools
FROM pilot_schools;

-- 5. Test foreign key relationships
SELECT
  (SELECT COUNT(*) FROM students WHERE pilot_school_id IS NOT NULL) as students_with_schools,
  (SELECT COUNT(*) FROM assessments WHERE student_id IS NOT NULL) as assessments_with_students,
  (SELECT COUNT(*) FROM mentoring_visits WHERE mentor_id IS NOT NULL) as visits_with_mentors;
```

---

### Step 5: Update Application Configuration

#### A. Create New Environment File
```bash
# Backup current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)

# Create new .env with Supabase configuration
cat > .env.supabase << 'EOF'
# Supabase Database Configuration
DATABASE_URL="postgresql://postgres.cftkquoslfwkwavhkspu:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?schema=public&connection_limit=5&pool_timeout=10"

# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL="https://cftkquoslfwkwavhkspu.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdGtxdW9zbGZ3a3dhdmhrc3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyNzE2MTcsImV4cCI6MjA3MTg0NzYxN30._2vuYaBnWVu-zSujbyzOVdZ51T4tmBBjwcCUDoJNfsw"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdGtxdW9zbGZ3a3dhdmhrc3B1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjI3MTYxNywiZXhwIjoyMDcxODQ3NjE3fQ.OU2K-TO8CsRK5yabr_ah7Aohop09Dr87c4MTWUOPrRY"

# NextAuth Configuration (keep existing)
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=

# Server Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3005/api

# File Upload Configuration (TODO: Migrate to Supabase Storage)
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=5242880

# Session Configuration
SESSION_TIMEOUT=86400000

# Vercel Blob (if still needed)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_BjWHYvEuAxrvzOzx_yMNPwtl7eKE8NJtnHvz3arBhyZsWRz"
EOF

echo "✅ Created .env.supabase"
echo "📝 Review and update [YOUR-PASSWORD] before using"
```

#### B. Update DATABASE_URL
```bash
# After reviewing .env.supabase and updating password:
cp .env.supabase .env
```

#### C. Regenerate Prisma Client
```bash
# Generate Prisma client with new connection
npm run db:generate

# Verify connection
npx prisma db pull
```

---

### Step 6: Test Application

#### A. Start Development Server
```bash
npm run dev
```

#### B. Test Critical Flows
- [ ] Login (standard email/password)
- [ ] Quick login (username-based)
- [ ] View students list
- [ ] Create new student
- [ ] View assessments
- [ ] Create new assessment
- [ ] View dashboard
- [ ] Generate reports

#### C. Check Browser Console
Look for:
- Database connection errors
- Query errors
- Authentication issues

---

## Post-Migration Tasks

### 1. File Storage Migration
Current setup uses local `/uploads` directory. Migrate to Supabase Storage:

```bash
# TODO: Create migration script for existing files
# See: https://supabase.com/docs/guides/storage
```

### 2. Enable Row Level Security (RLS)
```sql
-- Enable RLS on all tables (run in Supabase SQL Editor)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Create policies based on role
CREATE POLICY "Teachers can view own students"
ON students FOR SELECT
USING (auth.uid() = added_by_id::text OR auth.jwt()->>'role' IN ('admin', 'coordinator'));

-- More policies as needed...
```

### 3. Set Up Supabase Realtime (Optional)
For real-time updates on dashboard:
```sql
-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE assessments;
```

### 4. Configure Backups
Supabase provides automatic daily backups, but set up additional:
- Point-in-time recovery (PITR) - Available on paid plans
- Manual backup scripts (weekly)

### 5. Update Production Environment
```bash
# For production deployment
# Update environment variables in Vercel/hosting platform:
DATABASE_URL="[PRODUCTION_SUPABASE_URL]"
NEXT_PUBLIC_SUPABASE_URL="https://cftkquoslfwkwavhkspu.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
```

---

## Rollback Plan

If migration fails, rollback to original database:

```bash
# 1. Stop application
# 2. Restore .env
cp .env.backup.[TIMESTAMP] .env

# 3. Regenerate Prisma client
npm run db:generate

# 4. Restart application
npm run dev
```

---

## Troubleshooting

### Issue: Connection Timeout
**Solution**: Use Session mode (port 5432), not Transaction mode (port 6543)

### Issue: Permission Denied Errors During Restore
**Solution**: These are expected with `--no-owner` and `--no-acl`. Verify data integrity instead.

### Issue: Missing Tables After Restore
**Solution**: Check restore.log for errors:
```bash
grep -i "error" restore.log | less
```

### Issue: Prisma Can't Connect
**Solution**:
1. Verify DATABASE_URL format
2. Check password has no special characters needing URL encoding
3. Test connection with psql first

### Issue: Row Counts Don't Match
**Solution**:
1. Check if restore completed fully
2. Look for foreign key constraint errors in restore.log
3. Re-run restore with `--disable-triggers` if needed

---

## Performance Optimization

### Connection Pooling
Supabase uses PgBouncer. Update connection string for pooling:
```
# Transaction mode (for short queries)
postgresql://postgres.cftkquoslfwkwavhkspu:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

# Session mode (for migrations, long transactions)
postgresql://postgres.cftkquoslfwkwavhkspu:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### Indexes
All indexes from Prisma schema should be preserved. Verify:
```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

---

## Migration Checklist

### Pre-Migration
- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] pg_dump/pg_restore installed
- [ ] Backup storage available
- [ ] Maintenance window scheduled
- [ ] Team notified

### During Migration
- [ ] Full database backup completed
- [ ] Backup verified (file size, can be opened)
- [ ] Supabase connection tested
- [ ] Database restored to Supabase
- [ ] Table count verified
- [ ] Row counts verified
- [ ] Foreign key relationships verified

### Post-Migration
- [ ] .env updated with Supabase credentials
- [ ] Prisma client regenerated
- [ ] Application tested locally
- [ ] Login flows tested
- [ ] CRUD operations tested
- [ ] Reports/dashboards tested
- [ ] File storage plan created
- [ ] RLS policies designed
- [ ] Backup strategy implemented
- [ ] Production deployment planned

---

## Support

- **Supabase Docs**: https://supabase.com/docs
- **Prisma + Supabase**: https://supabase.com/docs/guides/integrations/prisma
- **Migration Issues**: Check `restore.log` and Supabase dashboard logs

---

**Migration Date**: ___________
**Migrated By**: ___________
**Status**: ⬜ Planned | ⬜ In Progress | ⬜ Completed | ⬜ Rolled Back
