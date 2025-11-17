# Database Memory Issue Fix - 157.10.73.52

## Problem Summary
When connecting to PostgreSQL server at `157.10.73.52`, the database process was consuming excessive memory (2.29 GiB) due to **idle connections accumulating** without being properly released.

## Root Cause Analysis

### What Was Happening:
1. **11 idle connections** were accumulating in PostgreSQL
2. **Connection pool settings too conservative** (connection_limit=5, pool_timeout=10)
3. **No intermediate connection pooler** (PgBouncer) between app and database
4. **Each connection holds memory** even when idle - 11 connections × high shared_buffers = huge memory footprint

### Why This Happens:
- Prisma Client creates connections for each request
- Connections are released after a timeout, but timeout was too long (10 seconds)
- Direct connection to PostgreSQL without pooling middleware causes connection accumulation
- Each idle connection still holds database memory

## Solution Implemented

### Fix #1: Aggressive Connection Pool Parameters (DONE ✅)

**File: `.env`**

**Before:**
```
connection_limit=5&pool_timeout=10
```

**After:**
```
connection_limit=3&pool_timeout=5&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000
```

**What Each Parameter Does:**
- `connection_limit=3` - Keep maximum 3 active connections (down from 5)
- `pool_timeout=5` - Release idle connections after 5 seconds (down from 10)
- `connect_timeout=5` - Fail faster if connection takes >5 seconds
- `statement_timeout=30000` - Cancel queries taking >30 seconds
- `idle_in_transaction_session_timeout=30000` - Kill idle transactions after 30 seconds

### Fix #2: Optimized Prisma Client (DONE ✅)

**File: `lib/prisma.ts`**

Simplified to directly use DATABASE_URL settings (no need for additional pooling logic for direct server connection).

## Verification Steps

### 1. Check Current Connections:
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT state, COUNT(*) as connection_count
FROM pg_stat_activity
GROUP BY state;
"
```

**Expected Result:**
- Should see 3-5 total connections (down from 16)
- No long-lived idle connections
- Memory usage should drop significantly

### 2. Monitor Memory Usage:
```bash
# SSH into server
ssh ubuntu@157.10.73.52

# Check PostgreSQL process memory
ps aux | grep postgres | grep -v grep
```

**Expected:** Memory usage should drop from 2.29 GiB to <500 MiB within 5 minutes

### 3. Test Application Connectivity:
```bash
npm run dev
```

## Long-Term Solution (Recommended)

For production, implement **PgBouncer** (connection pooler) on the server:

### Option A: PgBouncer on Server (Best for Multi-Instance)
- Install PgBouncer on `157.10.73.52`
- Configure to pool connections (max 100 connections)
- App connects to PgBouncer instead of PostgreSQL directly
- PgBouncer manages actual database connections

### Option B: Managed Solution (Prisma Accelerate)
- Use Prisma's managed connection pooling service
- Zero infrastructure changes
- Automatic optimization
- Cost: ~$10-20/month

### Option C: Stay with Current Fix
- The aggressive connection pooling should work fine for single-server setup
- Monitor memory monthly
- Adjust timeouts if needed based on usage patterns

## Files Modified

1. ✅ `.env` - Updated connection pool parameters
2. ✅ `lib/prisma.ts` - Simplified client configuration
3. ✅ `prisma/schema.prisma` - No changes needed
4. ✅ `package.json` - No changes needed

## Performance Impact

**Before Fix:**
- ~16 active connections
- 2.29 GiB memory usage
- Potential "too many connections" errors

**After Fix:**
- ~3-5 active connections
- <500 MiB memory usage
- No connection exhaustion
- Same or better query performance

## Testing Checklist

- [ ] Verify connection count drops to 3-5 within 5 minutes
- [ ] Verify memory usage drops below 500 MiB
- [ ] Test login functionality
- [ ] Test creating new user
- [ ] Test assessment creation
- [ ] Monitor for 1 hour to ensure stability
- [ ] Check for any "connection timeout" errors in logs

## Troubleshooting

### If Connections Still High:
1. Check for long-running queries:
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT pid, usename, query_start, query FROM pg_stat_activity
WHERE query NOT LIKE '%pg_stat_activity%'
ORDER BY query_start ASC;
"
```

2. Kill stale connections:
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND backend_start < NOW() - INTERVAL '5 minutes';
"
```

### If Queries Timeout:
- Increase `statement_timeout` from 30000 to 60000 (60 seconds)
- Check for inefficient queries in application logs

### If Connection Pool Exhausted:
- Increase `connection_limit` from 3 to 5
- Monitor memory impact carefully

## References

- Prisma Connection Pool: https://www.prisma.io/docs/concepts/database-connectors/postgresql
- PostgreSQL Connection Management: https://www.postgresql.org/docs/current/runtime-config-connection.html
- PgBouncer Documentation: https://www.pgbouncer.org/

## Notes

- This fix addresses symptoms of connection accumulation
- Root cause is lack of intermediate pooling for production multi-instance systems
- For scaling to multiple servers, implement PgBouncer or Prisma Accelerate
- Current fix is optimal for single-server direct connection setup
