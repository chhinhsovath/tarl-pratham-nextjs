# 🚀 START HERE - Database Migration to New VPS

Complete setup package for migrating TaRL Pratham from old server to new VPS.

---

## 📋 Migration Overview

**Task:** Move database to new VPS server while keeping old server as backup

| Server | IP | Role | Status After Migration |
|--------|-----|------|----------------------|
| **Old Server** | 157.10.73.52 | Backup | Untouched, preserved |
| **New Server** | 157.10.73.82 | Primary | Active production |

**Database:** tarl_pratham (94 users, 37 schools, 137 students, 157 assessments)

---

## 🎯 Choose Your Method

### Option 1: Quick Manual Steps (RECOMMENDED) ⭐

**Best for:** Quick migration with full control
**Time:** 15-20 minutes
**File:** `QUICK_MIGRATION_STEPS.md`

```bash
# Open the quick guide
open QUICK_MIGRATION_STEPS.md

# Or view in terminal
cat QUICK_MIGRATION_STEPS.md
```

**Why recommended:**
- ✓ Works around connection exhaustion on old server
- ✓ Step-by-step copy/paste commands
- ✓ Clear verification at each step
- ✓ Easy to troubleshoot if issues arise

---

### Option 2: Automated Script (If Connections Available)

**Best for:** Automation, if old server has free connections
**Time:** 10 minutes
**File:** `setup-new-database-server.sh`

```bash
bash setup-new-database-server.sh
```

**Note:** May fail if old server has connection exhaustion (like we saw earlier)

---

### Option 3: Complete Manual Guide

**Best for:** Understanding every detail
**Time:** 30-40 minutes
**File:** `DATABASE_MIGRATION_GUIDE.md`

```bash
open DATABASE_MIGRATION_GUIDE.md
```

**Includes:**
- Detailed explanations for each step
- Troubleshooting guide
- Post-migration monitoring
- Automated backup setup

---

## 🚀 Quick Start (Recommended Path)

### Step 1: Read the Quick Guide

```bash
open QUICK_MIGRATION_STEPS.md
```

### Step 2: Open 3 Terminal Windows

- **Terminal 1:** New server (157.10.73.82)
- **Terminal 2:** Old server (157.10.73.52)
- **Terminal 3:** Your local machine (for commands)

### Step 3: Follow QUICK_MIGRATION_STEPS.md

Copy and paste commands from each section in order.

### Step 4: Verify and Test

After migration:
```bash
npm run db:generate
npm run dev
```

Test application at http://localhost:3005

---

## 📁 Files Created for You

| File | Purpose |
|------|---------|
| `QUICK_MIGRATION_STEPS.md` | ⭐ Step-by-step migration (START HERE) |
| `DATABASE_MIGRATION_GUIDE.md` | Complete detailed guide with explanations |
| `setup-new-database-server.sh` | Automated migration script |
| `setup-postgresql-on-new-server.sh` | PostgreSQL setup for new server |
| `.claude/postgresql_vps_setup.md` | General PostgreSQL VPS setup guide |

---

## ✅ Pre-Migration Checklist

Before you start:

- [ ] You have access to **Old Server** (157.10.73.52)
  - SSH: `ssh ubuntu@157.10.73.52`
  - Password: `en_&xdX#!N(^OqCQzc3RE0B)m6ogU!`

- [ ] You have access to **New Server** (157.10.73.82)
  - SSH: `ssh ubuntu@157.10.73.82`
  - Password: `FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!`

- [ ] PostgreSQL client tools installed locally
  - Test: `which psql` (should show path)

- [ ] You have 20 minutes uninterrupted time

- [ ] You've backed up your current `.env` files (script does this automatically)

---

## 🎯 Migration Steps Summary

```
1. Setup PostgreSQL on new server (157.10.73.82)          [5 min]
2. Backup database from old server (157.10.73.52)         [2 min]
3. Transfer backup old → new                              [1 min]
4. Restore database on new server                         [3 min]
5. Verify data (counts should match)                      [2 min]
6. Update .env files (157.10.73.52 → 157.10.73.82)       [1 min]
7. Test connection from local machine                     [1 min]
8. Regenerate Prisma client and test app                  [5 min]
                                                    ─────────────
                                                    Total: 20 min
```

---

## 🛟 Safety Features

### Old Server Protection
- ✅ Old server database is **NEVER modified**
- ✅ Only **reads** data for backup
- ✅ Remains fully functional as backup
- ✅ Can rollback instantly if issues occur

### Backup Strategy
- ✅ Current `.env` files backed up before changes
- ✅ Database backup created before migration
- ✅ Can restore old configuration in seconds

### Rollback Plan
If anything goes wrong:
```bash
# Restore old .env files
cp .env.backup.old-server-* .env
cp .env.local.backup.old-server-* .env.local

# Reconnect to old server
npm run db:generate
npm run dev
```

---

## 💡 What Happens During Migration

### On Old Server (157.10.73.52)
1. Connect and create backup file
2. Transfer backup to new server
3. **Database remains 100% untouched**
4. Still functional for rollback

### On New Server (157.10.73.82)
1. Install PostgreSQL
2. Create database and user (same credentials)
3. Receive backup from old server
4. Restore backup to new database
5. Become primary production server

### On Your Application
1. `.env` files updated to point to new server IP
2. Prisma client regenerated
3. Application connects to new server
4. All data available immediately

---

## 🔍 Verification

After migration, these should match:

| Table | Expected Count |
|-------|----------------|
| users | 94 |
| pilot_schools | 37 |
| students | 137 |
| assessments | 157 |

Test in application:
- ✅ Login works
- ✅ View users list
- ✅ View schools list
- ✅ View students list
- ✅ Create/edit records

---

## 🐛 Common Issues

### "Connection slots full" on old server
**Solution:** Use QUICK_MIGRATION_STEPS.md - it backs up directly on the server

### "Permission denied" when SSH
**Solution:** Double-check password, ensure correct server IP

### "Connection refused" to new server
**Solution:**
```bash
# On new server
sudo systemctl status postgresql
sudo ufw status
sudo systemctl restart postgresql
```

### Data counts don't match
**Solution:** Re-run restore step from QUICK_MIGRATION_STEPS.md

---

## 📞 Support

If you encounter issues:

1. **Check the guide:** `DATABASE_MIGRATION_GUIDE.md` - Troubleshooting section
2. **Check logs:**
   ```bash
   # On new server
   sudo tail -f /var/log/postgresql/postgresql-*-main.log
   ```
3. **Test connection manually:**
   ```bash
   PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT version();"
   ```
4. **Rollback if needed:** Use rollback commands above

---

## 🎉 After Successful Migration

### What Changed
- ✅ Next.js now uses new server (157.10.73.82)
- ✅ All data migrated successfully
- ✅ Old server preserved as backup

### What Stayed Same
- ✅ Database name: tarl_pratham
- ✅ Username: admin
- ✅ Password: P@ssw0rd
- ✅ All data intact and verified

### Next Steps
1. Monitor new server for 24-48 hours
2. Set up automated backups (see DATABASE_MIGRATION_GUIDE.md)
3. After confirming stability, can optionally shutdown old server

---

## 📊 Server Comparison

| Feature | Old Server | New Server |
|---------|------------|------------|
| IP | 157.10.73.52 | 157.10.73.82 |
| Role | Backup | Primary |
| PostgreSQL | ✓ Running | ✓ Running (after setup) |
| Database | tarl_pratham | tarl_pratham (migrated) |
| Data | 94 users, 37 schools... | Same data (verified) |
| Application | Old connection | **New connection** |

---

## 🚀 Ready to Start?

### 1. Open the Quick Guide
```bash
open QUICK_MIGRATION_STEPS.md
```

### 2. Follow Step-by-Step

Each step has:
- ✅ Exact commands to copy/paste
- ✅ Expected output
- ✅ Verification checks

### 3. Total Time: ~20 minutes

---

## 📝 Migration Checklist

- [ ] Read this START_HERE document
- [ ] Open QUICK_MIGRATION_STEPS.md
- [ ] Open 3 terminal windows
- [ ] Complete Step 1: Setup new server
- [ ] Complete Step 2: Backup old server
- [ ] Complete Step 3: Transfer backup
- [ ] Complete Step 4: Restore database
- [ ] Complete Step 5: Verify data
- [ ] Complete Step 6: Update .env files
- [ ] Complete Step 7: Test connection
- [ ] Complete Step 8: Test application
- [ ] ✅ Migration complete!

---

**Good luck! The migration is straightforward and safe. Old server remains as backup.**

**Questions? Check DATABASE_MIGRATION_GUIDE.md for detailed explanations and troubleshooting.**

---

**Created:** 2025-01-18
**For:** TaRL Pratham Next.js
**Migration:** 157.10.73.52 → 157.10.73.82
**Status:** Ready to execute
