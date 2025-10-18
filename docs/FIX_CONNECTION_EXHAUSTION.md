# Fix Connection Exhaustion - Install PgBouncer

## Problem Summary

Vercel serverless functions spawn multiple instances, each creating their own Prisma connection pool (5 connections). With complex dashboard pages making multiple API calls in parallel, we quickly exhaust the PostgreSQL connection limit (100 connections).

## Why This Project Has Issues (Other Platforms Don't)

**This Project:**
- Vercel Serverless → Multiple ephemeral function instances
- Each API call spawns a new function with its own pool
- Coordinator dashboard makes 3 parallel API calls
- Stats API makes 29 database queries
- Activities API makes 3 queries with 6 joins
- Math: 3 APIs × 29 queries × 5 connections per pool = Exhaustion

**Your Other Platform (Probably):**
- Traditional Node.js server → Single long-lived process
- One connection pool shared across all requests
- No new connections per request
- Managed database with built-in pooling (like Supabase)
- OR has PgBouncer installed

## The Real Solution: PgBouncer

PgBouncer is a lightweight connection pooler that sits between your application and PostgreSQL. It maintains a small pool of actual database connections and multiplexes many client connections onto them.

### Architecture Change:

**Before:**
```
Vercel Function #1 (5 connections) ─┐
Vercel Function #2 (5 connections) ─┼─→ PostgreSQL (100 max)
Vercel Function #3 (5 connections) ─┤
Vercel Function #4 (5 connections) ─┘
Total: 20 connections for 1 request
```

**After (with PgBouncer):**
```
Vercel Function #1 (5 virtual) ─┐
Vercel Function #2 (5 virtual) ─┼─→ PgBouncer ─→ PostgreSQL (10 real connections)
Vercel Function #3 (5 virtual) ─┤   (Pool Mode)
Vercel Function #4 (5 virtual) ─┘
Total: 10 actual DB connections (90 connections saved!)
```

## Installation Steps (On Your Server: 157.10.73.52)

### Step 1: Install PgBouncer on Database Server

```bash
# SSH into your server
ssh ubuntu@157.10.73.52

# Install PgBouncer
sudo apt update
sudo apt install pgbouncer -y
```

### Step 2: Configure PgBouncer

Create `/etc/pgbouncer/pgbouncer.ini`:

```ini
[databases]
tarl_pratham = host=127.0.0.1 port=5432 dbname=tarl_pratham

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
admin_users = admin
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
reserve_pool_size = 5
reserve_pool_timeout = 3
server_lifetime = 3600
server_idle_timeout = 600
log_connections = 1
log_disconnections = 1
log_pooler_errors = 1
```

**Key Settings:**
- `pool_mode = transaction` - Most efficient for serverless
- `default_pool_size = 20` - Only 20 real PostgreSQL connections
- `max_client_conn = 1000` - Can handle 1000 virtual connections
- `listen_port = 6432` - PgBouncer port (different from 5432)

### Step 3: Create User Authentication File

Create `/etc/pgbouncer/userlist.txt`:

```txt
"admin" "md5<PASSWORD_HASH>"
```

To generate password hash:

```bash
# Generate MD5 hash for user 'admin' with password 'P@ssw0rd'
echo -n "P@ssw0rdadmin" | md5sum
# Result: abc123def456... (example)
# Add to userlist.txt as: "admin" "md5abc123def456..."
```

Or use this one-liner:

```bash
echo "\"admin\" \"md5$(echo -n 'P@ssw0rdadmin' | md5sum | cut -d' ' -f1)\"" | sudo tee /etc/pgbouncer/userlist.txt
```

### Step 4: Set Permissions

```bash
sudo chown postgres:postgres /etc/pgbouncer/*
sudo chmod 640 /etc/pgbouncer/userlist.txt
sudo chmod 644 /etc/pgbouncer/pgbouncer.ini
```

### Step 5: Start PgBouncer

```bash
sudo systemctl enable pgbouncer
sudo systemctl start pgbouncer
sudo systemctl status pgbouncer
```

### Step 6: Update Your Next.js Environment Variables

Update `.env` and Vercel environment variables:

**Before:**
```env
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connection_limit=5&pool_timeout=10"
```

**After:**
```env
# Use PgBouncer port 6432 instead of 5432
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.52:6432/tarl_pratham?sslmode=disable&connection_limit=5&pool_timeout=10"
```

Only change: `5432` → `6432`

### Step 7: Update Vercel Environment Variables

```bash
# Set in Vercel Dashboard → Settings → Environment Variables
DATABASE_URL=postgres://admin:P@ssw0rd@157.10.73.52:6432/tarl_pratham?sslmode=disable&connection_limit=5&pool_timeout=10
POSTGRES_PRISMA_URL=postgres://admin:P@ssw0rd@157.10.73.52:6432/tarl_pratham?sslmode=disable&connection_limit=5&pool_timeout=10
POSTGRES_URL_NON_POOLING=postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable
```

Note: Keep `POSTGRES_URL_NON_POOLING` on port 5432 for migrations.

### Step 8: Redeploy

```bash
git commit --allow-empty -m "chore: Switch to PgBouncer port 6432"
git push
```

Vercel will redeploy with new environment variables.

## Testing PgBouncer

### Check if PgBouncer is Running:

```bash
sudo systemctl status pgbouncer
```

### Connect via PgBouncer:

```bash
psql -h 157.10.73.52 -p 6432 -U admin -d tarl_pratham
```

### Monitor PgBouncer:

```bash
# Connect to PgBouncer admin console
psql -h 127.0.0.1 -p 6432 -U admin pgbouncer

# Show pools
SHOW POOLS;

# Show databases
SHOW DATABASES;

# Show clients
SHOW CLIENTS;

# Show servers (actual PostgreSQL connections)
SHOW SERVERS;
```

## Expected Results

**Before PgBouncer:**
- 5 coordinators visiting dashboard = 100 connections
- Error: "Too many connections"

**After PgBouncer:**
- 5 coordinators visiting dashboard = 20 PostgreSQL connections (pooled)
- 1000 concurrent users = still only 20 PostgreSQL connections
- No more connection errors

## Alternative Solutions (If You Can't Install PgBouncer)

### Option 1: Use Supabase (Managed PostgreSQL with Built-in Pooling)

Supabase provides:
- Transaction pooling via PgBouncer (built-in)
- Connection URL already optimized for serverless
- No manual setup required

### Option 2: Reduce Queries (Band-aid, Not a Solution)

- Combine multiple count queries into fewer queries
- Remove joins from activity feeds
- Cache dashboard statistics
- **Problem:** This is fighting the symptom, not the cause

### Option 3: Use a Dedicated PostgreSQL Instance with More Connections

- Increase `max_connections` in PostgreSQL config to 500
- **Problem:** More connections = more memory usage, not scalable

## Why PgBouncer is the Best Solution

| Solution | Pros | Cons |
|----------|------|------|
| **PgBouncer** | ✅ Solves root cause<br>✅ Industry standard<br>✅ Free<br>✅ Works with existing DB | ⚠️ Requires server access<br>⚠️ 15 min setup |
| Supabase | ✅ Built-in pooling<br>✅ No setup | ❌ Costs money<br>❌ Data migration required |
| Reduce Queries | ✅ Free<br>✅ No setup | ❌ Doesn't solve root cause<br>❌ Still breaks at scale |
| More Connections | ✅ Quick fix | ❌ More memory usage<br>❌ Not scalable |

## Conclusion

Install PgBouncer. It's the industry-standard solution for this exact problem, takes 15 minutes to set up, and will permanently fix your connection exhaustion issues.

Your other platforms probably already have this (either via managed database or explicit installation), which is why they don't have connection issues.
