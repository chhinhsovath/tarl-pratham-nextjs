# Database Backup - TaRL Pratham

## Backup Information

**Date Created:** November 22, 2025 10:02 AM (Cambodia Time)
**Database:** tarl_pratham
**Server:** 157.10.73.52:5432
**PostgreSQL Version:** 16.10 (Ubuntu)
**Backed up by:** pg_dump version 16.11 (Homebrew)

## Backup Files

### Full Database Backup (Schema + Data)
- **Uncompressed:** `tarl_pratham_full_20251122_100256.sql` (970 KB)
- **Compressed:** `tarl_pratham_full_20251122_100256.sql.gz` (129 KB) ⭐ **Use this one**
- **Contents:** Complete database with all tables, data, indexes, constraints
- **Tables:** 32 tables with data included

### Schema-Only Backup (Reference)
- **Uncompressed:** `tarl_pratham_schema_20251122_100314.sql` (75 KB)
- **Compressed:** `tarl_pratham_schema_20251122_100314.sql.gz` (7.3 KB)
- **Contents:** Database structure only (no data)
- **Use case:** Quick reference for table structure, comparing schema changes

---

## Restoration Instructions

### Option 1: Full Database Restore (⚠️ DESTRUCTIVE - Drops existing database)

```bash
# Step 1: Decompress the backup
gunzip -k tarl_pratham_full_20251122_100256.sql.gz

# Step 2: Drop existing database (CAREFUL!)
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d postgres -c "DROP DATABASE IF EXISTS tarl_pratham;"

# Step 3: Create new database
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d postgres -c "CREATE DATABASE tarl_pratham;"

# Step 4: Restore backup
PGPASSWORD="P@ssw0rd" /opt/homebrew/Cellar/postgresql@16/16.11/bin/psql \
  -h 157.10.73.52 -U admin -d tarl_pratham \
  -f tarl_pratham_full_20251122_100256.sql

# Step 5: Verify restoration
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "\dt"
```

---

### Option 2: Selective Table Restore (SAFER)

If you only want to restore specific tables without affecting the entire database:

```bash
# Step 1: Decompress
gunzip -k tarl_pratham_full_20251122_100256.sql.gz

# Step 2: Extract specific table data
# Example: Restore only 'users' table
grep -A 10000 "COPY public.users" tarl_pratham_full_20251122_100256.sql > users_only.sql

# Step 3: Manually review and restore
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -f users_only.sql
```

---

### Option 3: Clone to New Database (SAFEST for testing)

```bash
# Step 1: Decompress
gunzip -k tarl_pratham_full_20251122_100256.sql.gz

# Step 2: Create test database
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d postgres -c "CREATE DATABASE tarl_pratham_backup_test;"

# Step 3: Restore to test database
PGPASSWORD="P@ssw0rd" /opt/homebrew/Cellar/postgresql@16/16.11/bin/psql \
  -h 157.10.73.52 -U admin -d tarl_pratham_backup_test \
  -f tarl_pratham_full_20251122_100256.sql

# Step 4: Verify
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham_backup_test -c "\dt"
```

---

## Quick Verification Queries

After restoration, verify data integrity:

```sql
-- Count users
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Count students
SELECT COUNT(*) as total_students FROM students;

-- Count assessments by type
SELECT assessment_type, COUNT(*) FROM assessments GROUP BY assessment_type;

-- Count pilot schools
SELECT COUNT(*) FROM pilot_schools;

-- Check mentor assignments
SELECT COUNT(*) FROM mentor_school_assignments WHERE is_active = true;
```

---

## Emergency Recovery Script

Save this as `emergency_restore.sh`:

```bash
#!/bin/bash
set -e

BACKUP_FILE="tarl_pratham_full_20251122_100256.sql.gz"
DB_HOST="157.10.73.52"
DB_USER="admin"
DB_NAME="tarl_pratham"
DB_PASS="P@ssw0rd"

echo "⚠️  EMERGENCY DATABASE RESTORE ⚠️"
echo "This will REPLACE the current database!"
echo ""
read -p "Type 'RESTORE' to continue: " confirm

if [ "$confirm" != "RESTORE" ]; then
    echo "❌ Cancelled"
    exit 1
fi

echo "🔄 Decompressing backup..."
gunzip -k $BACKUP_FILE

echo "🗑️  Dropping existing database..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "🏗️  Creating new database..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"

echo "📥 Restoring backup..."
PGPASSWORD=$DB_PASS /opt/homebrew/Cellar/postgresql@16/16.11/bin/psql \
  -h $DB_HOST -U $DB_USER -d $DB_NAME \
  -f "${BACKUP_FILE%.gz}"

echo "✅ Restoration complete!"
echo ""
echo "Verifying tables..."
PGPASSWORD=$DB_PASS psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "\dt"
```

Make executable: `chmod +x emergency_restore.sh`

---

## Important Notes

1. **Before Restoration:**
   - Always create a NEW backup before restoring
   - Test restore on a different database first
   - Coordinate with team (notify all users)
   - Stop application servers to prevent conflicts

2. **Compatibility:**
   - Use PostgreSQL 16.x for restoration (version 16.11+ recommended)
   - Don't use PostgreSQL 14 or older (version mismatch errors)

3. **What's NOT Backed Up:**
   - Database users/roles (restore manually if needed)
   - PostgreSQL extensions (restore manually if needed)
   - Server configuration files

4. **Storage:**
   - Keep backups for at least 30 days
   - Store compressed versions (.gz) to save space
   - Consider copying to cloud storage (Google Drive, Dropbox)

---

## Backup Verification Checklist

After creating backup, verify:
- [x] File size is reasonable (> 100 KB for full backup)
- [x] Header shows "PostgreSQL database dump"
- [x] Footer shows "PostgreSQL database dump complete"
- [x] Contains COPY statements for 32 tables
- [x] Compressed version exists
- [x] File permissions allow reading

---

## Contact Information

**Database Administrator:** Chhinh Sovath
**Project:** TaRL Pratham Next.js
**Repository:** /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

---

## Next Steps (After Backup)

Now that backup is complete, you can proceed with:
1. ✅ Remove unused `TeacherSchoolAssignment` table
2. ✅ Generate data consistency verification queries
3. ✅ Document assignment patterns for team

**To restore from this backup if anything goes wrong:**
```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/backups
./emergency_restore.sh
```
