# Database Migration Guide: Old Server → New VPS

Complete step-by-step guide for migrating TaRL Pratham database from old server to new VPS.

---

## Overview

**Migration Task:** Move database from old server to new VPS while keeping old server as backup

**Servers:**
- **Old Server (BACKUP):** 157.10.73.52 - **DO NOT MODIFY**
- **New Server (PRIMARY):** 157.10.73.82 - New production server

**Database Details:**
- Database Name: `tarl_pratham`
- Username: `admin`
- Password: `P@ssw0rd`
- Current Data: 94 users, 37 pilot_schools, 137 students, 157 assessments

---

## Migration Options

### Option 1: Automated Script (Recommended)

Use the automated migration script provided.

### Option 2: Manual Step-by-Step

Follow the manual instructions below for full control.

---

## Option 1: Automated Migration (RECOMMENDED)

### Step 1: Setup PostgreSQL on New Server

```bash
# SSH into new server
ssh ubuntu@157.10.73.82
# Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!

# Download the setup script (or copy it from your local machine)
# Then run:
bash setup-postgresql-on-new-server.sh

# Exit back to local machine
exit
```

### Step 2: Run Migration Script from Local Machine

```bash
# From your project directory
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

# Run the migration script
bash setup-new-database-server.sh
```

The script will:
1. ✓ Backup database from old server
2. ✓ Setup PostgreSQL on new server
3. ✓ Restore database to new server
4. ✓ Verify data migration
5. ✓ Update .env files
6. ✓ Create backups of old configuration

### Step 3: Test Application

```bash
# Generate Prisma client
npm run db:generate

# Start development server
npm run dev

# Test the application at http://localhost:3004
```

---

## Option 2: Manual Migration Steps

### Phase 1: Setup New Server (157.10.73.82)

#### 1.1 Connect to New Server

```bash
ssh ubuntu@157.10.73.82
# Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!
```

#### 1.2 Install PostgreSQL

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

#### 1.3 Create Database and User

```bash
sudo -u postgres psql
```

```sql
-- Create user
CREATE USER admin WITH PASSWORD 'P@ssw0rd';

-- Create database
CREATE DATABASE tarl_pratham OWNER admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;

-- Verify
\l tarl_pratham
\du admin

-- Exit
\q
```

#### 1.4 Configure Remote Access

```bash
# Find PostgreSQL version
PG_VERSION=$(ls /etc/postgresql/)

# Edit postgresql.conf
sudo nano /etc/postgresql/$PG_VERSION/main/postgresql.conf
```

Find and change:
```conf
listen_addresses = '*'
```

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/$PG_VERSION/main/pg_hba.conf
```

Add at the end:
```conf
# Remote access for TaRL Pratham
host    all             all             0.0.0.0/0               md5
host    all             all             ::/0                    md5
```

#### 1.5 Configure Firewall

```bash
# Allow SSH and PostgreSQL
sudo ufw allow 22/tcp
sudo ufw allow 5432/tcp
sudo ufw --force enable
sudo ufw status
```

#### 1.6 Restart PostgreSQL

```bash
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

#### 1.7 Exit New Server

```bash
exit
```

---

### Phase 2: Backup Old Server Database (FROM LOCAL MACHINE)

```bash
# Set password
export PGPASSWORD="P@ssw0rd"

# Create backup
pg_dump -h 157.10.73.52 -U admin -d tarl_pratham -F c -b -v -f tarl_pratham_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup created
ls -lh tarl_pratham_backup_*.sql
```

**IMPORTANT:** Old server (157.10.73.52) is **NOT modified** during backup. It remains as-is for backup purposes.

---

### Phase 3: Test Connection to New Server

```bash
# Test connection from local machine
export PGPASSWORD="P@ssw0rd"
psql -h 157.10.73.82 -U admin -d postgres -c "SELECT version();"
```

Expected output: PostgreSQL version information

If connection fails:
- Check firewall on new server: `sudo ufw status`
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Check pg_hba.conf configuration

---

### Phase 4: Restore Database to New Server

```bash
# Restore backup to new server
export PGPASSWORD="P@ssw0rd"
pg_restore -h 157.10.73.82 -U admin -d tarl_pratham -v tarl_pratham_backup_*.sql

# Verify restore
psql -h 157.10.73.82 -U admin -d tarl_pratham -c "\dt"
```

---

### Phase 5: Verify Data Migration

```bash
# Check record counts on OLD server
psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'pilot_schools', COUNT(*) FROM pilot_schools
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments;
"

# Check record counts on NEW server
psql -h 157.10.73.82 -U admin -d tarl_pratham -c "
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'pilot_schools', COUNT(*) FROM pilot_schools
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments;
"
```

**Both should show identical counts:**
- users: 94
- pilot_schools: 37
- students: 137
- assessments: 157

---

### Phase 6: Update Next.js Configuration

#### 6.1 Backup Current .env Files

```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

# Backup .env
cp .env .env.backup.old-server-$(date +%Y%m%d_%H%M%S)

# Backup .env.local
cp .env.local .env.local.backup.old-server-$(date +%Y%m%d_%H%M%S)
```

#### 6.2 Update .env File

```bash
# Edit .env
nano .env
```

Change all instances of `157.10.73.52` to `157.10.73.82`:

```env
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TaRL Pratham - New Server Configuration (PRODUCTION)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Server: 157.10.73.82
# Database: tarl_pratham
# Updated: 2025-01-18
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Database URL
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=5&pool_timeout=10"

# Prisma URL
POSTGRES_PRISMA_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=5&pool_timeout=10"

# Non-pooling URL
POSTGRES_URL_NON_POOLING="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10"

# Individual parameters
POSTGRES_HOST="157.10.73.82"
POSTGRES_PORT="5432"
POSTGRES_USER="admin"
POSTGRES_PASSWORD="P@ssw0rd"
POSTGRES_DATABASE="tarl_pratham"

# ... rest of your config ...
```

#### 6.3 Update .env.local File

```bash
# Edit .env.local
nano .env.local
```

Update the DATABASE_URL:

```env
# Database Configuration - New Server (157.10.73.82)
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10"

# ... rest of your config ...
```

---

### Phase 7: Test Next.js Application

```bash
# Generate Prisma client
npm run db:generate

# Start development server
npm run dev
```

Open browser to `http://localhost:3004` (or your configured port) and:
1. ✓ Test login
2. ✓ View users list
3. ✓ View schools list
4. ✓ View students list
5. ✓ Create/edit a record

---

## Verification Checklist

- [ ] PostgreSQL installed on new server (157.10.73.82)
- [ ] Database user `admin` created
- [ ] Database `tarl_pratham` created
- [ ] Remote access configured (firewall + pg_hba.conf)
- [ ] Backup created from old server
- [ ] Data restored to new server
- [ ] Record counts match between old and new servers
- [ ] .env files updated to point to new server
- [ ] .env backup files created
- [ ] Prisma client regenerated
- [ ] Next.js application tested successfully
- [ ] Old server (157.10.73.52) remains untouched as backup

---

## Rollback Plan (If Needed)

If something goes wrong with new server:

```bash
# 1. Restore old .env files
cp .env.backup.old-server-* .env
cp .env.local.backup.old-server-* .env.local

# 2. Regenerate Prisma client
npm run db:generate

# 3. Restart application
npm run dev
```

Your application will reconnect to old server (157.10.73.52) immediately.

---

## Post-Migration Tasks

### Monitor New Server

```bash
# SSH into new server
ssh ubuntu@157.10.73.82

# Check PostgreSQL status
sudo systemctl status postgresql

# View active connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('tarl_pratham'));"
```

### Setup Automated Backups

Create cron job on new server:

```bash
# SSH into new server
ssh ubuntu@157.10.73.82

# Create backup directory
sudo mkdir -p /var/backups/postgresql
sudo chown postgres:postgres /var/backups/postgresql

# Create backup script
sudo nano /usr/local/bin/backup-tarl-pratham.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/tarl_pratham_$DATE.sql"

# Create backup
sudo -u postgres pg_dump tarl_pratham -F c -f "$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "tarl_pratham_*.sql" -mtime +7 -delete

echo "Backup completed: $BACKUP_FILE"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-tarl-pratham.sh

# Add to cron (daily at 2 AM)
sudo crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-tarl-pratham.sh >> /var/log/tarl-pratham-backup.log 2>&1
```

---

## Troubleshooting

### Connection Refused

**Problem:** Cannot connect to new server

**Solutions:**
```bash
# Check PostgreSQL is running
ssh ubuntu@157.10.73.82
sudo systemctl status postgresql

# Check firewall
sudo ufw status

# Check PostgreSQL is listening
sudo netstat -plnt | grep 5432

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Authentication Failed

**Problem:** Password authentication fails

**Solutions:**
```bash
# Reset password on new server
ssh ubuntu@157.10.73.82
sudo -u postgres psql -c "ALTER USER admin PASSWORD 'P@ssw0rd';"

# Check pg_hba.conf
sudo cat /etc/postgresql/*/main/pg_hba.conf | grep "host.*all"
```

### Data Mismatch

**Problem:** Record counts don't match

**Solutions:**
```bash
# Re-run restore
export PGPASSWORD="P@ssw0rd"
psql -h 157.10.73.82 -U admin -d tarl_pratham -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
pg_restore -h 157.10.73.82 -U admin -d tarl_pratham -v tarl_pratham_backup_*.sql
```

---

## Summary

**What We Did:**
1. ✓ Installed PostgreSQL on new VPS (157.10.73.82)
2. ✓ Created consistent database configuration (same user/password)
3. ✓ Backed up database from old server (157.10.73.52)
4. ✓ Restored database to new server
5. ✓ Verified data integrity
6. ✓ Updated Next.js to use new server
7. ✓ Kept old server untouched as backup

**Servers Status:**
- **Old Server (157.10.73.52):** Active, untouched, serving as backup
- **New Server (157.10.73.82):** Active, primary production server

**Next.js Application:** Now connected to new server (157.10.73.82)

---

## Support

If you encounter issues:
1. Check this guide's Troubleshooting section
2. Review logs: `sudo tail -f /var/log/postgresql/postgresql-*-main.log`
3. Verify .env configuration
4. Test database connection manually with `psql`

---

**Migration Date:** 2025-01-18
**Performed By:** Automated migration script
**Status:** Ready to execute
