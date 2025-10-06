# 🚀 MIGRATION READY - Start Now!

## ✅ Everything is Configured

Your Supabase credentials are loaded and ready to use. All scripts have been updated with the correct connection details.

**Supabase Project**: `uyrmvvwwchzmqtstgwbi`
**Dashboard**: https://supabase.com/dashboard/project/uyrmvvwwchzmqtstgwbi

---

## 📝 3-Step Migration Process

### Step 1: Backup Current Database (5-10 minutes)

```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs
./scripts/01_backup_database.sh
```

**What this does:**
- Connects to your current database (157.10.73.52)
- Creates 3 backup files in `~/tarl-migration-backup/`
- Verifies backup integrity
- Shows database statistics

**Expected output:**
```
✓ Custom format backup completed: 500MB
✓ SQL format backup completed: 1.2GB
✓ Schema-only backup completed: 2.5MB
✓ Backup integrity verified
```

---

### Step 2: Restore to Supabase (10-30 minutes)

```bash
./scripts/02_restore_to_supabase.sh
```

**What this does:**
- Tests Supabase connection
- Restores all 31 tables with data
- Preserves all foreign keys and indexes
- Creates new `.env.supabase` file
- Generates restore log

**Expected output:**
```
✓ Supabase connection successful
✓ Restore completed
✓ No critical errors found
✓ Tables restored: 31
✓ Configuration file created
```

---

### Step 3: Verify Migration (5 minutes)

```bash
./scripts/03_verify_migration.sh
```

**What this does:**
- Compares table counts (source vs Supabase)
- Compares row counts for all tables
- Verifies foreign key relationships
- Tests indexes and queries
- Generates verification report

**Expected output:**
```
✓ Table counts match: 31 tables
✓ users: Row counts match (250 rows)
✓ students: Row counts match (1500 rows)
✓ assessments: Row counts match (4200 rows)
✓ Foreign keys preserved
✓ Indexes present (75 indexes)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Migration Verified Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 After Migration: Update Application

### 1. Backup Current .env
```bash
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
```

### 2. Use New Supabase Configuration
```bash
cp .env.supabase .env
```

### 3. Regenerate Prisma Client
```bash
npm run db:generate
```

### 4. Start Application
```bash
npm run dev
```

### 5. Test Everything
- [ ] Login (email/password)
- [ ] Quick login (username)
- [ ] View students
- [ ] Create/edit student
- [ ] View assessments
- [ ] Create assessment
- [ ] Dashboard loads
- [ ] Reports work

---

## 📊 What's Included

### Scripts Created:
1. ✅ `scripts/01_backup_database.sh` - Automated backup with verification
2. ✅ `scripts/02_restore_to_supabase.sh` - **Pre-configured with your Supabase credentials**
3. ✅ `scripts/03_verify_migration.sh` - Comprehensive verification

### Configuration Files:
1. ✅ `.env.supabase` - **Ready-to-use with all your Supabase keys**
2. ✅ `.env.supabase.template` - Template for reference

### Documentation:
1. ✅ `docs/MIGRATION_TO_SUPABASE.md` - Complete 400+ line guide
2. ✅ `docs/SUPABASE_MIGRATION_QUICK_START.md` - Quick reference
3. ✅ `MIGRATION_READY.md` - This file

---

## 🔑 Your Supabase Configuration (Pre-loaded)

All scripts are already configured with these credentials:

**Database Connection:**
- Host: `aws-1-us-east-1.pooler.supabase.com`
- Port: 5432 (Session mode) / 6543 (Transaction mode)
- User: `postgres.uyrmvvwwchzmqtstgwbi`
- Password: `QtMVSsu8uw60WRjK`
- Database: `postgres`

**API Keys:**
- Project URL: `https://uyrmvvwwchzmqtstgwbi.supabase.co`
- Anon Key: ✅ Loaded
- Service Role Key: ✅ Loaded
- JWT Secret: ✅ Loaded

---

## 🎯 Quick Start Command

Run all 3 steps in sequence:

```bash
# Step 1: Backup
./scripts/01_backup_database.sh

# Step 2: Restore (credentials already loaded)
./scripts/02_restore_to_supabase.sh

# Step 3: Verify
./scripts/03_verify_migration.sh

# Update app
cp .env.backup.$(date +%Y%m%d_%H%M%S) .env.backup
cp .env.supabase .env
npm run db:generate
npm run dev
```

---

## 📁 Where Files Will Be Created

**Backup files**: `~/tarl-migration-backup/`
- `tarl_pratham_YYYYMMDD_HHMMSS.dump` (main backup)
- `tarl_pratham_YYYYMMDD_HHMMSS.sql` (readable)
- `tarl_pratham_schema_YYYYMMDD_HHMMSS.sql` (schema only)
- `backup_manifest_YYYYMMDD_HHMMSS.txt` (summary)
- `restore_YYYYMMDD_HHMMSS.log` (restore log)
- `verification_YYYYMMDD_HHMMSS.log` (verification log)
- `.env.supabase` (generated config)

---

## ⚠️ Important Notes

### Database Modes:
- **Session Mode (Port 5432)**: Used for restore/migrations (direct connection)
- **Transaction Mode (Port 6543)**: Used for application (PgBouncer pooling)

### Your .env will use Transaction Mode for best performance:
```env
DATABASE_URL="postgres://...@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### Rollback Plan:
If anything goes wrong:
```bash
cp .env.backup.[TIMESTAMP] .env
npm run db:generate
npm run dev
```

Your original database at 157.10.73.52 remains untouched!

---

## 🆘 Troubleshooting

### "Connection timeout"
Check: Supabase dashboard → Settings → Database → Network Restrictions

### "Table counts don't match"
Check: `~/tarl-migration-backup/restore_*.log` for errors

### "Application won't start"
1. Verify DATABASE_URL in .env
2. Run: `npm run db:generate`
3. Check: Port 6543 and `?pgbouncer=true` in URL

---

## 📞 Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/uyrmvvwwchzmqtstgwbi
- **Full Documentation**: `docs/MIGRATION_TO_SUPABASE.md`
- **Quick Guide**: `docs/SUPABASE_MIGRATION_QUICK_START.md`

---

## ✨ Ready to Start?

**Everything is configured. Just run:**

```bash
./scripts/01_backup_database.sh
```

**Estimated total time**: 40-80 minutes (mostly automated)

Good luck! 🚀
