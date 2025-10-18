# Quick Migration Steps - TaRL Pratham Database

**IMPORTANT:** Old server has connection exhaustion. We need to backup from the server directly.

---

## Step 1: Setup PostgreSQL on New Server (157.10.73.82)

### Open Terminal 1 - SSH to New Server

```bash
ssh ubuntu@157.10.73.82
# Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!
```

### Run these commands on New Server:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE USER admin WITH PASSWORD 'P@ssw0rd';
CREATE DATABASE tarl_pratham OWNER admin;
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;
\q
EOF

# Configure for remote access
PG_VERSION=$(ls /etc/postgresql/)
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf
sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf

# Add remote access rules
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf

# Configure firewall
sudo ufw allow 22/tcp
sudo ufw allow 5432/tcp
sudo ufw --force enable

# Restart PostgreSQL
sudo systemctl restart postgresql

echo "✓ New server setup complete!"
```

**Keep this terminal open for Step 3**

---

## Step 2: Backup Database from Old Server (157.10.73.52)

### Open Terminal 2 - SSH to Old Server

```bash
ssh ubuntu@157.10.73.52
# Password: en_&xdX#!N(^OqCQzc3RE0B)m6ogU!
```

### Run backup on Old Server:

```bash
# Create backup
sudo -u postgres pg_dump tarl_pratham -F c -f /tmp/tarl_pratham_backup.sql

# Verify backup
ls -lh /tmp/tarl_pratham_backup.sql

echo "✓ Backup created on old server!"
```

**Keep this terminal open**

---

## Step 3: Transfer Backup from Old Server to New Server

### In Terminal 2 (Old Server), run:

```bash
# Transfer backup to new server using scp
scp /tmp/tarl_pratham_backup.sql ubuntu@157.10.73.82:/tmp/
# Password for new server: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!

echo "✓ Backup transferred to new server!"

# You can now exit old server (BACKUP REMAINS INTACT)
exit
```

---

## Step 4: Restore Database on New Server

### In Terminal 1 (New Server - 157.10.73.82), run:

```bash
# Restore database
sudo -u postgres pg_restore -d tarl_pratham /tmp/tarl_pratham_backup.sql

echo "✓ Database restored!"
```

---

## Step 5: Verify Data Migration

### Still in Terminal 1 (New Server), run:

```bash
# Check tables and data
sudo -u postgres psql tarl_pratham << 'EOF'
-- List all tables
\dt

-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'pilot_schools', COUNT(*) FROM pilot_schools
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'assessments', COUNT(*) FROM assessments;

-- Exit
\q
EOF

echo "✓ Verification complete!"

# You can now exit new server
exit
```

**Expected counts:**
- users: 94
- pilot_schools: 37
- students: 137
- assessments: 157

---

## Step 6: Update Next.js Configuration

### Open Terminal 3 - On Your Local Machine

```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

# Backup current .env files
cp .env .env.backup.old-server-$(date +%Y%m%d_%H%M%S)
cp .env.local .env.local.backup.old-server-$(date +%Y%m%d_%H%M%S)

# Update .env (change 157.10.73.52 to 157.10.73.82)
sed -i.bak 's/157\.10\.73\.52/157.10.73.82/g' .env
sed -i.bak 's/157\.10\.73\.52/157.10.73.82/g' .env.local

# Verify changes
grep "157.10.73.82" .env
grep "157.10.73.82" .env.local

echo "✓ Environment files updated!"
```

---

## Step 7: Test Connection from Local Machine

```bash
# Test connection to new server
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT COUNT(*) FROM users;"

# Should return: 94
```

---

## Step 8: Update Prisma and Test Application

```bash
# Generate Prisma client
npm run db:generate

# Start development server
npm run dev

# Open browser to http://localhost:3005 (or your configured port)
# Test: Login, view users, schools, students
```

---

## Verification Checklist

- [ ] New server PostgreSQL installed and configured
- [ ] Backup created on old server (/tmp/tarl_pratham_backup.sql)
- [ ] Backup transferred to new server
- [ ] Database restored on new server
- [ ] Record counts verified (94 users, 37 schools, 137 students, 157 assessments)
- [ ] .env files updated to point to 157.10.73.82
- [ ] Backup of old .env files created
- [ ] Connection test successful from local machine
- [ ] Prisma client regenerated
- [ ] Next.js application tested and working

---

## Cleanup (Optional - After Confirming Everything Works)

### On Old Server (157.10.73.52)

```bash
ssh ubuntu@157.10.73.52
# Remove temporary backup (database remains intact)
sudo rm /tmp/tarl_pratham_backup.sql
exit
```

### On New Server (157.10.73.82)

```bash
ssh ubuntu@157.10.73.82
# Remove temporary backup (data is now in database)
sudo rm /tmp/tarl_pratham_backup.sql
exit
```

---

## Rollback (If Needed)

If something goes wrong:

```bash
cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs

# Restore old .env files
cp .env.backup.old-server-* .env
cp .env.local.backup.old-server-* .env.local

# Regenerate Prisma
npm run db:generate

# Restart app
npm run dev
```

Your app will reconnect to old server (157.10.73.52) immediately.

---

## Summary

**What This Does:**
1. ✓ Installs PostgreSQL on new server (157.10.73.82)
2. ✓ Creates backup ON old server (no connection exhaustion)
3. ✓ Transfers backup old → new via scp
4. ✓ Restores database on new server
5. ✓ Verifies data integrity
6. ✓ Updates Next.js to use new server
7. ✓ **OLD SERVER REMAINS UNTOUCHED AS BACKUP**

**Time Estimate:** 15-20 minutes

**Safe:** Old server database is never modified, only read from.

---

**Ready to start? Begin with Step 1!**
