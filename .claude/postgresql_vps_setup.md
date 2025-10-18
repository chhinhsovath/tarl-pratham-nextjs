# PostgreSQL VPS Server Setup Guide

Complete guide for installing and configuring PostgreSQL on your new VPS server.

---

## 1. Connect to Your VPS

```bash
ssh ubuntu@YOUR_SERVER_IP
# Or if you have specific credentials from daunpenh_server.md, use those
```

---

## 2. Update System Packages

```bash
sudo apt update
sudo apt upgrade -y
```

---

## 3. Install PostgreSQL

### Install PostgreSQL Server and Client
```bash
sudo apt install postgresql postgresql-contrib -y
```

### Verify Installation
```bash
# Check PostgreSQL version
psql --version

# Check PostgreSQL service status
sudo systemctl status postgresql
```

Expected output: PostgreSQL should be running and enabled

---

## 4. Initial PostgreSQL Configuration

### Switch to PostgreSQL User
```bash
sudo -i -u postgres
```

### Access PostgreSQL Prompt
```bash
psql
```

### Set Password for postgres User
```sql
ALTER USER postgres PASSWORD 'your_secure_password_here';
```

### Create Application Database
```sql
-- For TaRL Pratham project
CREATE DATABASE tarl_pratham;

-- Create application user
CREATE USER tarl_user WITH PASSWORD 'strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO tarl_user;

-- Exit psql
\q
```

### Exit postgres user
```bash
exit
```

---

## 5. Configure PostgreSQL for Remote Access

### Edit PostgreSQL Configuration
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Find and modify:
```conf
# Listen on all IP addresses (or specify your IP)
listen_addresses = '*'

# Increase max connections if needed
max_connections = 100
```

### Edit Client Authentication Configuration
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Add these lines at the end:
```conf
# Allow remote connections from specific IP (recommended)
host    all             all             YOUR_CLIENT_IP/32       md5

# OR allow from anywhere (less secure, use with caution)
host    all             all             0.0.0.0/0               md5
host    all             all             ::/0                    md5
```

**Security Note**: Replace `YOUR_CLIENT_IP` with your actual client IP for better security.

---

## 6. Configure Firewall

### Using UFW (Ubuntu Firewall)
```bash
# Allow SSH (if not already allowed)
sudo ufw allow 22/tcp

# Allow PostgreSQL
sudo ufw allow 5432/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Or using iptables
```bash
sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT
sudo iptables-save
```

---

## 7. Restart PostgreSQL

```bash
sudo systemctl restart postgresql

# Verify it's running
sudo systemctl status postgresql
```

---

## 8. Test Remote Connection

### From Your Local Machine
```bash
# Install PostgreSQL client if not already installed
# On macOS:
brew install postgresql

# On Ubuntu/Debian:
sudo apt install postgresql-client

# Test connection
psql -h YOUR_SERVER_IP -U tarl_user -d tarl_pratham
```

Enter password when prompted. If successful, you'll see the PostgreSQL prompt.

---

## 9. Connection String for Your Application

```bash
# Standard connection string
DATABASE_URL="postgresql://tarl_user:strong_password_here@YOUR_SERVER_IP:5432/tarl_pratham"

# With SSL (recommended for production)
DATABASE_URL="postgresql://tarl_user:strong_password_here@YOUR_SERVER_IP:5432/tarl_pratham?sslmode=require"
```

---

## 10. Additional Security Hardening

### Create SSL Certificates (Optional but Recommended)
```bash
# Generate self-signed certificate
sudo openssl req -new -x509 -days 365 -nodes -text \
  -out /etc/ssl/certs/postgresql.crt \
  -keyout /etc/ssl/private/postgresql.key \
  -subj "/CN=YOUR_SERVER_IP"

# Set permissions
sudo chmod 600 /etc/ssl/private/postgresql.key
sudo chown postgres:postgres /etc/ssl/private/postgresql.key
sudo chown postgres:postgres /etc/ssl/certs/postgresql.crt
```

### Enable SSL in PostgreSQL
Edit `/etc/postgresql/*/main/postgresql.conf`:
```conf
ssl = on
ssl_cert_file = '/etc/ssl/certs/postgresql.crt'
ssl_key_file = '/etc/ssl/private/postgresql.key'
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## 11. Useful PostgreSQL Commands

### Service Management
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Stop PostgreSQL
sudo systemctl stop postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql
```

### Database Operations
```bash
# Access PostgreSQL as postgres user
sudo -u postgres psql

# List all databases
\l

# Connect to specific database
\c database_name

# List all tables
\dt

# List all users
\du

# Show table structure
\d table_name

# Quit psql
\q
```

### Backup and Restore
```bash
# Backup database
sudo -u postgres pg_dump tarl_pratham > backup_$(date +%Y%m%d).sql

# Restore database
sudo -u postgres psql tarl_pratham < backup_20250118.sql

# Backup all databases
sudo -u postgres pg_dumpall > all_databases_backup.sql
```

---

## 12. Performance Tuning (Optional)

Edit `/etc/postgresql/*/main/postgresql.conf`:

```conf
# Shared memory (25% of total RAM)
shared_buffers = 256MB

# Working memory per query
work_mem = 4MB

# Maintenance memory for vacuum, index creation
maintenance_work_mem = 64MB

# Effective cache size (50-75% of total RAM)
effective_cache_size = 1GB

# Connection pooling
max_connections = 100
```

Apply changes:
```bash
sudo systemctl restart postgresql
```

---

## 13. Monitoring and Logs

### View PostgreSQL Logs
```bash
# View logs
sudo tail -f /var/log/postgresql/postgresql-*-main.log

# Check log location
sudo -u postgres psql -c "SHOW log_directory;"
sudo -u postgres psql -c "SHOW data_directory;"
```

### Monitor Active Connections
```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- View active connections
SELECT * FROM pg_stat_activity;

-- Count connections by database
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

-- Kill specific connection
SELECT pg_terminate_backend(pid) WHERE pid = 'PID_NUMBER';
```

---

## 14. Migration from Old Database

If you're migrating from your existing database:

```bash
# 1. Backup from old server
export PGPASSWORD="QtMVSsu8uw60WRjK"
pg_dump -h old_server_ip -U old_user -d old_database > migration_backup.sql

# 2. Transfer to new server
scp migration_backup.sql ubuntu@NEW_SERVER_IP:/tmp/

# 3. Restore on new server
ssh ubuntu@NEW_SERVER_IP
sudo -u postgres psql tarl_pratham < /tmp/migration_backup.sql
```

---

## 15. Troubleshooting

### Connection Refused
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check which port it's listening on
sudo netstat -plnt | grep postgres

# Check firewall
sudo ufw status
```

### Authentication Failed
```bash
# Verify pg_hba.conf settings
sudo cat /etc/postgresql/*/main/pg_hba.conf

# Check user exists
sudo -u postgres psql -c "\du"

# Reset user password
sudo -u postgres psql -c "ALTER USER tarl_user PASSWORD 'new_password';"
```

### Too Many Connections
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Increase max_connections in postgresql.conf
-- Then restart PostgreSQL
```

---

## 16. Security Checklist

- [ ] Changed default postgres password
- [ ] Created application-specific user (not using postgres user)
- [ ] Configured firewall to allow only necessary ports
- [ ] Limited remote access to specific IPs in pg_hba.conf
- [ ] Enabled SSL for encrypted connections
- [ ] Set strong passwords for all database users
- [ ] Configured regular automated backups
- [ ] Disabled remote root login to VPS
- [ ] Keep PostgreSQL updated with security patches

---

## Quick Reference

### Connection Details
```
Host: YOUR_SERVER_IP
Port: 5432
Database: tarl_pratham
Username: tarl_user
Password: [your_password]
```

### Environment Variable for Next.js
```bash
# Add to .env.local
DATABASE_URL="postgresql://tarl_user:password@YOUR_SERVER_IP:5432/tarl_pratham?schema=public"
```

### Prisma Migration Commands
```bash
# After connecting to new database
npx prisma migrate deploy
npx prisma generate
npx prisma db push
```

---

## Next Steps After Setup

1. **Update your `.env` file** with new database connection string
2. **Run Prisma migrations** to set up schema
3. **Seed initial data** if needed
4. **Test connection** from your Next.js application
5. **Set up automated backups** (cron job)
6. **Monitor database performance** and adjust configurations

---

## Support Resources

- PostgreSQL Official Documentation: https://www.postgresql.org/docs/
- Ubuntu PostgreSQL Guide: https://ubuntu.com/server/docs/databases-postgresql
- Prisma PostgreSQL Setup: https://www.prisma.io/docs/concepts/database-connectors/postgresql

---

**Created**: 2025-01-18
**For Project**: TaRL Pratham Next.js
**Server OS**: Ubuntu (assumed based on daunpenh_server.md)
