# New Server Credentials - Complete Reference

**Server:** 157.10.73.82 (New VPS)
**Setup Date:** 2025-10-18
**Operating System:** Ubuntu 24.04 LTS

---

## 🔐 Server Access Credentials

### SSH Access
```
Host: 157.10.73.82
Username: ubuntu
Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!
Port: 22
```

**SSH Command:**
```bash
ssh ubuntu@157.10.73.82
# Password: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!
```

---

## 🗄️ PostgreSQL Credentials

### PostgreSQL Superuser (postgres)

**Username:** `postgres`
**Password:** No password (uses peer authentication)

**Access Method:**
```bash
# SSH into server first
ssh ubuntu@157.10.73.82

# Then access PostgreSQL as postgres user (no password needed)
sudo -u postgres psql
```

**Important Notes:**
- The `postgres` superuser uses **peer authentication** on Ubuntu
- No password is needed when accessing via `sudo -u postgres`
- This is the default PostgreSQL security on Ubuntu
- You can set a password if needed (see below)

---

### Application Database User (admin)

**Username:** `admin`
**Password:** `P@ssw0rd`
**Database:** `tarl_pratham`
**Privileges:** All privileges on tarl_pratham database

**Access Method:**
```bash
# From local machine (remote access)
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham

# From server itself (local access)
PGPASSWORD="P@ssw0rd" psql -h localhost -U admin -d tarl_pratham
```

**Connection String:**
```
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham
```

---

## 📊 Database Information

| Item | Value |
|------|-------|
| **Database Name** | tarl_pratham |
| **Owner** | admin |
| **Port** | 5432 |
| **SSL** | Disabled (private VPS) |
| **Remote Access** | Enabled (0.0.0.0:5432) |
| **Firewall** | Enabled (ports 22, 5432 open) |

---

## 👥 PostgreSQL User Accounts

### Complete User List:

```
┌──────────┬────────────────────────────────────────────┐
│ Username │ Attributes                                 │
├──────────┼────────────────────────────────────────────┤
│ postgres │ Superuser, Create role, Create DB,         │
│          │ Replication, Bypass RLS                    │
│          │ Password: N/A (peer authentication)        │
├──────────┼────────────────────────────────────────────┤
│ admin    │ Application user                           │
│          │ Password: P@ssw0rd                         │
│          │ Owner of: tarl_pratham database            │
└──────────┴────────────────────────────────────────────┘
```

---

## 🔧 Common PostgreSQL Commands

### Access PostgreSQL

```bash
# As postgres superuser (from server)
sudo -u postgres psql

# As admin user (from anywhere)
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham
```

### List Databases
```sql
\l
```

### List Users
```sql
\du
```

### List Tables
```sql
\dt
```

### Check Database Size
```sql
SELECT pg_size_pretty(pg_database_size('tarl_pratham'));
```

### Check Active Connections
```sql
SELECT * FROM pg_stat_activity;
```

---

## 🛡️ Security Configuration

### Firewall Status
```bash
# Check firewall
sudo ufw status

# Expected output:
# 22/tcp    ALLOW       Anywhere
# 5432/tcp  ALLOW       Anywhere
```

### PostgreSQL Configuration
```bash
# Listen addresses
listen_addresses = '*'  # Listens on all interfaces

# Authentication (pg_hba.conf)
host    all    all    0.0.0.0/0    md5  # IPv4 remote access
host    all    all    ::/0         md5  # IPv6 remote access
```

---

## ⚙️ Optional: Set Password for postgres User

If you want to set a password for the `postgres` superuser:

```bash
# SSH into server
ssh ubuntu@157.10.73.82

# Access PostgreSQL
sudo -u postgres psql

# Set password
ALTER USER postgres PASSWORD 'your_new_password_here';

# Exit
\q
```

**Recommended Password Format:**
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: `Pg@Admin2025!Secure`

---

## 📝 Application Connection Strings

### For Next.js (.env)
```env
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=5&pool_timeout=10"
```

### For Vercel (Production)
```env
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10"
```

### For Direct psql Access
```bash
psql "postgresql://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable"
```

---

## 🔍 Testing Credentials

### Test SSH Access
```bash
ssh ubuntu@157.10.73.82
# Should connect successfully
```

### Test PostgreSQL Access (postgres user)
```bash
ssh ubuntu@157.10.73.82
sudo -u postgres psql -c "SELECT version();"
# Should show PostgreSQL version
```

### Test PostgreSQL Access (admin user)
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT COUNT(*) FROM users;"
# Should return: 96
```

---

## 📊 Current Data Status

As of 2025-10-18:

| Table | Count |
|-------|-------|
| users | 96 |
| pilot_schools | 45 |
| students | 290 |
| assessments | 434 |

**Total Records:** 865

---

## 🚨 Important Security Notes

1. **Change Default Passwords:** Consider changing the `admin` password to something more secure in production
2. **Firewall:** Keep UFW enabled at all times
3. **SSH Keys:** Consider setting up SSH key authentication instead of password
4. **Regular Backups:** Set up automated database backups
5. **Monitor Logs:** Check PostgreSQL logs regularly for suspicious activity

---

## 📞 Troubleshooting

### Cannot Connect Remotely

**Check 1:** Firewall allows port 5432
```bash
sudo ufw status | grep 5432
```

**Check 2:** PostgreSQL is listening on all interfaces
```bash
sudo netstat -plnt | grep 5432
# Should show: 0.0.0.0:5432
```

**Check 3:** PostgreSQL is running
```bash
sudo systemctl status postgresql
```

### "Password authentication failed"

**Solution:** Double-check password is exactly: `P@ssw0rd`

**Verify Password:**
```bash
# SSH into server
sudo -u postgres psql -c "ALTER USER admin PASSWORD 'P@ssw0rd';"
```

---

## 📋 Quick Reference Card

**Print this and keep it safe:**

```
┌─────────────────────────────────────────────────────────┐
│         NEW SERVER CREDENTIALS (157.10.73.82)           │
├─────────────────────────────────────────────────────────┤
│ SSH Access:                                             │
│   User: ubuntu                                          │
│   Pass: FJBPCWMd$jhkz+7A(oRgQXmv&HiE)!                 │
│                                                         │
│ PostgreSQL Superuser:                                   │
│   User: postgres                                        │
│   Pass: (peer auth - no password)                      │
│   Access: sudo -u postgres psql                        │
│                                                         │
│ PostgreSQL App User:                                    │
│   User: admin                                           │
│   Pass: P@ssw0rd                                       │
│   DB: tarl_pratham                                     │
│                                                         │
│ Connection String:                                      │
│   postgres://admin:P@ssw0rd@157.10.73.82:5432/        │
│   tarl_pratham                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 Backup Server Credentials (Old Server)

For reference, old server remains available as backup:

**Server:** 157.10.73.52
**SSH User:** ubuntu
**SSH Pass:** en_&xdX#!N(^OqCQzc3RE0B)m6ogU!
**DB User:** admin
**DB Pass:** P@ssw0rd (same)
**Database:** tarl_pratham (same)

---

**Document Updated:** 2025-10-18
**Server Status:** ✅ Active and operational
**Database Status:** ✅ All data migrated (865 records)
**Security Status:** ✅ Firewall enabled, remote access configured
