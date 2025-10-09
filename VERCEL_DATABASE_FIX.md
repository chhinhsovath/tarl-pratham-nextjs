# 🔴 URGENT: Fix Database Connection Pool Exhaustion

## Problem
```
Too many database connections opened: FATAL: remaining connection slots are reserved for roles with the SUPERUSER attribute
```

All API endpoints returning 500 errors due to database connection pool exhaustion.

## Root Cause
Your DATABASE_URL is missing connection pooling parameters required for Vercel serverless functions.

**Current URL (WRONG):**
```
postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
```

## Solution - Update Vercel Environment Variable

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select your project: `tarl-pratham-nextjs`
3. Go to **Settings** → **Environment Variables**

### Step 2: Update DATABASE_URL

**Find the variable:** `DATABASE_URL`

**Replace with this new value:**
```
postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
```

**New parameters added:**
- `connection_limit=1` - Limit each serverless function to 1 connection
- `pool_timeout=10` - Wait max 10 seconds for a connection

### Step 3: Redeploy
After saving the environment variable:
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache: No**

## Why This Fixes It

**Problem:**
- Vercel runs your API in serverless functions
- Each function instance was opening multiple connections
- With ~10 concurrent requests = ~30+ connections opened
- Database only allows ~100 connections total
- SUPERUSER reserves ~20 connections
- Your app quickly exhausts the remaining ~80 connections

**Solution:**
- `connection_limit=1` ensures each function uses only 1 connection
- With 80 available slots ÷ 1 per function = supports 80 concurrent requests
- This is sufficient for your application's load

## Alternative: Use PgBouncer (Recommended for Production)

For better performance, install PgBouncer on your server (157.10.73.52):

### Install PgBouncer
```bash
ssh ubuntu@157.10.73.52
sudo apt-get update
sudo apt-get install pgbouncer
```

### Configure PgBouncer
Edit `/etc/pgbouncer/pgbouncer.ini`:
```ini
[databases]
tarl_pratham = host=127.0.0.1 port=5432 dbname=tarl_pratham

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
```

Create `/etc/pgbouncer/userlist.txt`:
```
"admin" "P@ssw0rd"
```

Start PgBouncer:
```bash
sudo systemctl enable pgbouncer
sudo systemctl start pgbouncer
sudo systemctl status pgbouncer
```

### Update Vercel DATABASE_URL to use PgBouncer
```
postgres://admin:P@ssw0rd@157.10.73.52:6432/tarl_pratham?sslmode=disable&pgbouncer=true&connection_limit=1
```

Note the port change: `5432` → `6432` (PgBouncer port)

## Immediate Action Required

**Option 1 (Quick Fix - 2 minutes):**
Update DATABASE_URL in Vercel with connection pooling parameters → Redeploy

**Option 2 (Proper Fix - 15 minutes):**
Install PgBouncer + Update DATABASE_URL → Redeploy

Choose Option 1 now to fix the immediate issue. Schedule Option 2 for proper production setup.
