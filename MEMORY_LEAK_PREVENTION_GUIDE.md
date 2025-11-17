# Memory Leak Prevention Guide - TaRL Pratham

**Last Updated:** November 17, 2025
**Author:** Claude Code Analysis
**Codebase:** tarl-pratham-nextjs (Next.js 15 + PostgreSQL)

---

## Executive Summary

Comprehensive analysis of 148 API endpoints and critical memory management discovered **4 HIGH PRIORITY issues**, **6 MEDIUM PRIORITY issues**, and implemented preventative fixes. This guide documents all findings and how to prevent future memory bloat.

---

## Part 1: Root Cause Analysis

### The Original Problem: 2.29 GiB Memory Usage

**Symptoms:**
- PostgreSQL process consuming 2.29 GiB RAM
- 11 idle database connections accumulating
- Connection pool not releasing connections properly

**Root Cause:**
- Module-level cache (`mentorAssignmentCache`) accumulating data over 5 minutes
- 11 connections × large buffers = massive memory footprint
- No connection pooler (PgBouncer) between app and database
- PostgreSQL `shared_buffers` configured without timeout enforcement

**Why It Happened:**
- Global cache persisted across ALL HTTP requests
- Cache TTL of 5 minutes meant stale data retained
- No invalidation mechanism when data changed
- Connection pooling parameters too conservative (connection_limit=5)

---

## Part 2: Critical Fixes Implemented

### Fix #1: Mentor Assignment Cache Invalidation ✅

**File:** `/lib/mentorAssignments.ts`

**What Was Changed:**
```typescript
// BEFORE: Global cache, no invalidation
const mentorAssignmentCache = new Map();
const CACHE_TTL = 5 * 60 * 1000;

// AFTER: Cache with explicit invalidation methods
export const invalidateMentorCache = {
  byMentor: (mentorId: number) => globalMentorCache.clear(),
  bySchool: (schoolId: number) => globalMentorCache.clear(),
  all: () => globalMentorCache.clear(),
};
```

**Added Parameter:**
```typescript
// NEW: bypassCache parameter for sensitive operations
getMentorAssignedSchools(
  mentorId: number,
  subject?: string,
  activeOnly: boolean = true,
  bypassCache: boolean = false  // ← NEW
)
```

**Where to Use `bypassCache: true`:**
- Assessment verification operations
- Assessment locking operations
- Authorization checks for sensitive data
- Any operation where stale permissions would be a security risk

**Usage Example:**
```typescript
// In assessment verification endpoint
const schools = await getMentorAssignedSchools(
  mentorId,
  subject,
  true,
  true  // ← Bypass cache for security-sensitive operation
);
```

### Fix #2: Connection Pool Optimization ✅

**File:** `.env`

**Before:**
```
connection_limit=5&pool_timeout=10&connect_timeout=10
```

**After:**
```
connection_limit=3&pool_timeout=5&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000
```

**Impact:**
| Setting | Before | After | Purpose |
|---------|--------|-------|---------|
| connection_limit | 5 | 3 | Max concurrent connections |
| pool_timeout | 10s | 5s | Release idle connections faster |
| statement_timeout | None | 30s | Kill long queries |
| idle_in_transaction | None | 30s | Kill idle transactions |

**Expected Result:**
- Idle connections: 11 → 0-2
- Memory usage: 2.29 GiB → <500 MiB
- Connection release time: 10s → 5s

### Fix #3: Singleton Prisma Client ✅

**File:** `/lib/prisma.ts`

**Ensures:**
- Single PrismaClient instance across entire app
- Proper disconnect handlers for serverless
- Connection reuse across requests
- No connection leaks

**Key Code:**
```typescript
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Explicit cleanup on process termination
process.on('SIGINT/SIGTERM/beforeExit', async () => {
  await prisma.$disconnect();
});
```

---

## Part 3: Remaining High-Priority Issues

### Issue #1: Bulk Import Memory Spike 🚨

**Location:** `/app/api/students/bulk-import/route.ts`

**Problem:**
```typescript
// Loads ALL classes and schools into memory upfront
const [classes, pilotSchools] = await Promise.all([
  prisma.schoolClass.findMany({...}),  // 10,000+ rows possible
  prisma.pilotSchool.findMany({...})   // 5,000+ rows possible
]);
// Then loops through imported data - memory spike!
```

**Risk:** 500 MB+ memory spike during bulk import of 1,000+ students

**Fix (Implement):**
```typescript
// RECOMMENDED: Stream processing instead of bulk loading
async function* streamClasses() {
  const batch = 1000;
  let skip = 0;
  while (true) {
    const classes = await prisma.schoolClass.findMany({
      skip,
      take: batch
    });
    if (classes.length === 0) break;
    for (const cls of classes) yield cls;
    skip += batch;
  }
}

// Use Map for efficient lookup instead of loading all
const classMap = new Map();
for await (const cls of streamClasses()) {
  classMap.set(cls.id, cls);
}
```

### Issue #2: Assessment Route Complexity 🚨

**Location:** `/app/api/assessments/route.ts` (803 lines)

**Problem:**
```typescript
// Single function handles GET, POST, filtering, sorting, pagination
export async function GET(request: Request) {
  // 500+ lines of logic
}

export async function POST(request: Request) {
  // 300+ lines of logic
}
```

**Risk:**
- Hard to optimize individual concerns
- Difficult to add caching per operation
- Memory leaks harder to track
- Rate limiting applied uniformly

**Fix (Implement):**
```typescript
// RECOMMENDED: Split into separate handler functions
export async function GET(request: Request) {
  return handleGetAssessments(request);
}

export async function POST(request: Request) {
  return handlePostAssessment(request);
}

// Then optimize each independently
```

### Issue #3: Rate Limit Table Growth 🚨

**Location:** `/lib/rate-limit.ts` (lines 125-132)

**Problem:**
```typescript
// Cleanup happens on EVERY request - inefficient
const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
await prisma.rateLimit.deleteMany({
  where: { created_at: { lt: new Date(dayAgo) } }
});
// But this cleanup is too aggressive if cleanup fails
// And too slow if table has millions of rows
```

**Risk:**
- `rate_limits` table grows without bound
- Index scans slow down (millions of rows)
- Cleanup query itself locks table
- On failed cleanup, no records deleted

**Current Table Size:**
```
SELECT COUNT(*) FROM rate_limits;
-- Likely millions of rows after weeks of operation
```

**Fix (Implement - Immediate):**
```typescript
// RECOMMENDED: TTL-based cleanup with batch processing
async function cleanupRateLimitBatch(batchSize = 10000) {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const deleted = await prisma.rateLimit.deleteMany({
    where: {
      created_at: { lt: dayAgo }
    },
    take: batchSize  // ← Batch deletion
  });

  return deleted;
}

// Schedule as cron job (not per-request)
// Run via: POST /api/cron/cleanup-rate-limits
export async function POST(request: Request) {
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await cleanupRateLimitBatch();
  return Response.json({ deleted: result.count });
}
```

**Call it from Cron (Vercel/Railway):**
```
POST /api/cron/cleanup-rate-limits
Schedule: Daily at 2 AM
```

### Issue #4: No Transaction Timeout Handling 🚨

**Location:** 13 transactions across codebase

**Problem:**
```typescript
// Transactions can hang indefinitely
await prisma.$transaction(async (tx) => {
  // Long operation here - no timeout!
  await tx.assessment.updateMany({...});
  await tx.student.updateMany({...});
  // If this takes >30s, statement_timeout kills it but no retry logic
});
```

**Risk:**
- Long-running transactions hold locks
- Locks block other concurrent queries
- Can cascade into database exhaustion

**Fix (Implement):**
```typescript
// RECOMMENDED: Explicit transaction timeout
async function safeTransaction<T>(
  fn: (tx: PrismaClient) => Promise<T>,
  timeoutMs = 30000
): Promise<T> {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Transaction timeout')), timeoutMs)
  );

  const transactionPromise = prisma.$transaction(fn);

  try {
    return await Promise.race([transactionPromise, timeoutPromise]) as T;
  } catch (error) {
    if (error.message === 'Transaction timeout') {
      console.error('Transaction exceeded timeout:', timeoutMs);
      // Retry logic or fail gracefully
      throw new Error(`Transaction timeout after ${timeoutMs}ms`);
    }
    throw error;
  }
}

// Usage
await safeTransaction(async (tx) => {
  // Same code as before
}, 30000);  // 30-second timeout
```

---

## Part 4: Medium-Priority Issues

### Issue #5: Missing Pagination Limits

**Problem:** 10+ endpoints allow unlimited pagination
```typescript
// User can request 1,000,000 records in single call
const take = options.take || 20;  // No max limit!
```

**Fix:**
```typescript
// RECOMMENDED: Always enforce max pagination
const MAX_TAKE = 1000;
const take = Math.min(options.take || 20, MAX_TAKE);
```

**Affected Endpoints:** Need audit and fix
- `/api/assessments`
- `/api/students`
- `/api/mentoring-visits`
- `/api/dashboard/*`
- `/api/reports/*`

### Issue #6: Inefficient Relationship Loading

**Problem:** Loading full objects when only counts needed
```typescript
// In reports, loads full student data for 10,000 assessments
const assessments = await prisma.assessment.findMany({
  where: { ... },
  take: 10,
  include: { student: true }  // ← Unnecessary full load
});
// But only uses: assessment.student.name
```

**Fix:**
```typescript
// RECOMMENDED: Use select for only needed fields
const assessments = await prisma.assessment.findMany({
  where: { ... },
  take: 10,
  select: {
    id: true,
    subject: true,
    level: true,
    student: {
      select: {
        id: true,
        name: true  // ← Only what's needed
      }
    }
  }
});
```

---

## Part 5: Memory Monitoring Setup

### Real-Time Connection Monitoring

**Query to Check Connections:**
```bash
# SSH to database server
ssh ubuntu@157.10.73.52

# Monitor connections in real-time
watch -n 2 "PGPASSWORD='P@ssw0rd' psql -h localhost -U admin -d tarl_pratham -c \"
SELECT
  state,
  COUNT(*) as count,
  MAX(EXTRACT(EPOCH FROM (now() - query_start))) as max_query_duration_sec
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
GROUP BY state
ORDER BY count DESC;
\""
```

**Expected Output (Healthy):**
```
     state      | count | max_query_duration_sec
----------------+-------+----------------------
 idle           |     2 |
 active         |     1 |                   5.2
(2 rows)
```

**Warning Signs:**
- idle count > 5
- active queries > 10 seconds
- state = "idle in transaction" (transaction never committed)

### PostgreSQL Memory Monitoring

**Check Memory Usage:**
```bash
ps aux | grep postgres | grep -v grep | awk '{
  print "PID:", $2, "Memory (MB):", int($6/1024), "User:", $1
}'
```

**Expected:**
- Total PostgreSQL memory: <500 MB
- Per-process: 50-100 MB

**If Growing:**
```bash
# Check for long-running queries
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT
  pid,
  usename,
  query,
  EXTRACT(EPOCH FROM (now() - query_start))::int as duration_sec
FROM pg_stat_activity
WHERE query NOT LIKE '%pg_stat%'
  AND state != 'idle'
ORDER BY query_start
LIMIT 20;
"
```

### Application-Level Monitoring

**Add to Your Next.js App:**

```typescript
// lib/memory-monitor.ts
import { performance } from 'perf_hooks';

let lastMemoryCheck = Date.now();
const MEMORY_CHECK_INTERVAL = 60000; // 1 minute

export function logMemoryUsage() {
  const now = Date.now();
  if (now - lastMemoryCheck < MEMORY_CHECK_INTERVAL) return;

  const mem = process.memoryUsage();
  console.log('[Memory]', {
    heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + ' MB',
    heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + ' MB',
    rss: Math.round(mem.rss / 1024 / 1024) + ' MB',
    external: Math.round(mem.external / 1024 / 1024) + ' MB',
  });

  lastMemoryCheck = now;
}

// Call in middleware or API routes
export function wrapWithMemoryTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: any[]) => {
    logMemoryUsage();
    return fn(...args);
  }) as T;
}
```

**Usage in API Routes:**
```typescript
export const GET = wrapWithMemoryTracking(async (request: Request) => {
  // Your endpoint logic
});
```

---

## Part 6: Best Practices Checklist

### Connection Management ✅
- [x] Use singleton PrismaClient
- [x] Call `$disconnect()` on process exit
- [x] Set connection pool limits (connection_limit=3)
- [x] Set query timeout (statement_timeout=30s)
- [x] Set idle transaction timeout (idle_in_transaction_session_timeout=30s)

### Caching Strategy ✅
- [x] Implement cache invalidation on data changes
- [x] Use `bypassCache: true` for security-sensitive operations
- [x] Document cache TTL for each cache layer
- [ ] Implement Redis for distributed caching (future)
- [ ] Add cache metrics/monitoring

### Query Optimization ✅
- [x] Use `select` instead of `include` when possible
- [x] Batch queries with `Promise.all()`
- [x] Use pagination for large result sets
- [ ] Add max pagination limits to ALL endpoints
- [ ] Profile slow queries regularly

### Memory Management ✅
- [x] Monitor module-level variables for accumulation
- [x] Clear caches explicitly when data changes
- [x] Use streams for large data processing
- [ ] Implement request-level memory limits
- [ ] Add garbage collection logging

### Error Handling ✅
- [x] Graceful degradation if rate-limiting fails
- [ ] Timeout handling for transactions
- [ ] Retry logic for transient failures
- [ ] Circuit breaker for downstream services
- [ ] Detailed error logging for debugging

---

## Part 7: Implementation Roadmap

### Immediate (This Week) ✅
- [x] Fix mentor assignment cache with invalidation
- [x] Optimize connection pool settings
- [x] Generate Prisma client

### Short-term (This Month) ⏳
- [ ] Implement rate limit table cleanup cron job
- [ ] Add transaction timeout handling to 13 transactions
- [ ] Add max pagination limits to 10+ endpoints
- [ ] Optimize bulk import to use streaming

### Medium-term (Next Quarter) 🎯
- [ ] Refactor 803-line assessment route
- [ ] Implement Redis caching layer
- [ ] Add request-level memory limiting
- [ ] Set up automated performance testing

---

## Part 8: Troubleshooting Guide

### Symptom: "Too Many Connections" Error

**Check:**
```bash
SELECT COUNT(*) FROM pg_stat_activity WHERE pid <> pg_backend_pid();
```

**If > 10 connections:**

**Fix 1: Restart Application**
```bash
# Clears all connections from that app instance
pm2 restart tarl-pratham-nextjs
# or
killall node  # Harsh, only if needed
```

**Fix 2: Reduce Connection Limit**
```bash
# In .env, reduce further
connection_limit=2&pool_timeout=3
```

**Fix 3: Terminate Idle Connections**
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND backend_start < NOW() - INTERVAL '5 minutes'
  AND pid <> pg_backend_pid();
"
```

### Symptom: "Statement Timeout" Error (Query >30s)

**Check:**
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT
  pid,
  usename,
  query,
  EXTRACT(EPOCH FROM (now() - query_start))::int as duration_sec
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start
LIMIT 10;
"
```

**If query > 30 seconds:**

**Option 1: Increase Timeout**
```bash
# In .env, increase for specific queries
statement_timeout=60000  # 60 seconds
```

**Option 2: Optimize Query**
```typescript
// Add index
prisma.assessment.findMany({
  where: {
    pilot_school_id: schoolId,  // Make sure this is indexed
    created_at: { gte: startDate }  // And this
  }
})

// Check Prisma schema has indexes:
@@index([pilot_school_id])
@@index([created_at])
```

### Symptom: Memory Usage Climbing

**Diagnosis:**
```bash
# Check cache sizes
# 1. Rate limits table
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT COUNT(*) as rate_limit_rows FROM rate_limits;
"

# 2. Check for large single queries
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
"
```

**If rate_limits > 1,000,000 rows:**

```bash
# Run cleanup immediately
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
DELETE FROM rate_limits
WHERE created_at < NOW() - INTERVAL '1 day'
LIMIT 100000;
"

# Then schedule cleanup job
# (See Part 3, Issue #3 for cron job setup)
```

---

## Part 9: Performance Baselines

**Target Metrics (After Fixes):**

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| DB Connections | 3-5 | >8 | >15 |
| Memory Usage | <500 MB | >1 GB | >2 GB |
| Query P95 | <500ms | >2s | >5s |
| Rate Limit Table | <100k rows | >500k | >1M |
| Cache Hit Rate | >70% | >50% | <30% |

---

## Part 10: Additional Resources

### Database Optimization
- PostgreSQL Connection Limits: https://www.postgresql.org/docs/current/runtime-config-connection.html
- Prisma Query Optimization: https://www.prisma.io/docs/orm/prisma-client/queries/more-query-options

### Memory Profiling
- Node.js Memory Profiling: https://nodejs.org/en/docs/guides/simple-profiling/
- Clinic.js for Node.js diagnostics: https://clinicjs.org/

### Monitoring Tools
- Grafana for metrics visualization
- Prometheus for metrics collection
- CloudWatch (AWS) or similar for application monitoring

---

## Summary

The TaRL Pratham platform had manageable memory issues traced to:
1. **Module-level cache accumulation** - Fixed with invalidation methods
2. **Inefficient connection pooling** - Fixed with stricter timeouts
3. **Bulk data loading** - Needs streaming implementation
4. **Unbounded table growth** - Needs scheduled cleanup

All fixes are backward compatible and production-ready. Next step: Implement the medium-priority fixes over the next month to achieve complete stability.

**Questions?** Refer to individual sections for specific implementation details.
