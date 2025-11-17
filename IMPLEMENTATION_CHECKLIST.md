# Memory Issue Prevention - Implementation Checklist

**Status:** In Progress
**Last Updated:** November 17, 2025

---

## Phase 1: Critical Fixes ✅ COMPLETE

### Cache & Connection Management
- [x] Fix mentor assignment cache with `invalidateMentorCache` methods
- [x] Add `bypassCache: true` parameter for security-sensitive operations
- [x] Optimize connection pool settings (connection_limit=3, pool_timeout=5)
- [x] Add statement_timeout=30000 for long queries
- [x] Add idle_in_transaction_session_timeout=30000

### Verification
- [x] Regenerate Prisma client
- [x] Verify database connectivity
- [x] Test mentor assignment functions

---

## Phase 2: Pagination Limits (HIGH PRIORITY) ⏳

### Overview
Add max pagination limits to prevent users from requesting 1M+ records in single call.

### Affected Endpoints (10+)

#### Assessment Endpoints
- [ ] `/app/api/assessments/route.ts` - GET method
- [ ] `/app/api/assessments/verify/route.ts` - GET method
- [ ] `/app/api/assessments/verification/route.ts` - GET method
- [ ] `/app/api/assessments/periods/route.ts` - GET method

#### Student Endpoints
- [ ] `/app/api/students/route.ts` - GET method
- [ ] `/app/api/students/bulk-import/route.ts` - Check pagination

#### Mentoring Endpoints
- [ ] `/app/api/mentoring/route.ts` - GET method
- [ ] `/app/api/mentoring/visits/route.ts` - GET method

#### Dashboard Endpoints
- [ ] `/app/api/dashboard/admin-stats/route.ts` - GET method
- [ ] `/app/api/dashboard/assessment-data/route.ts` - GET method
- [ ] `/app/api/dashboard/mentor-stats/route.ts` - GET method

#### Report Endpoints
- [ ] `/app/api/reports/dashboard/route.ts` - GET method
- [ ] `/app/api/reports/school-overview/route.ts` - GET method

### Implementation Pattern

**Add this to each endpoint:**

```typescript
// At start of GET handler
const MAX_TAKE = 1000;  // or 500 for large datasets
const pageSize = Math.min(
  parseInt(request.nextUrl.searchParams.get('take') || '20'),
  MAX_TAKE
);

// Use pageSize in Prisma query
const results = await prisma.model.findMany({
  take: pageSize,
  skip: parseInt(request.nextUrl.searchParams.get('skip') || '0'),
  // ... rest of query
});
```

### Verification Checklist
- [ ] Each endpoint validates `take` parameter
- [ ] Max limit enforced (1000 or 500)
- [ ] Default page size is reasonable (20-50)
- [ ] Skip parameter validated
- [ ] Documentation updated with limits

---

## Phase 3: Rate Limit Cleanup Job (MEDIUM PRIORITY) ⏳

### Overview
Move rate limit cleanup from per-request to scheduled cron job.

### Task 1: Create Cleanup Endpoint

**File:** Create `/app/api/cron/cleanup-rate-limits/route.ts`

```typescript
/**
 * Cron endpoint to clean up old rate limit records
 * Scheduled to run daily at 2 AM
 *
 * Trigger with:
 * POST /api/cron/cleanup-rate-limits
 * Header: x-cron-secret=<CRON_SECRET>
 */

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const result = await prisma.rateLimit.deleteMany({
      where: {
        created_at: { lt: dayAgo }
      }
    });

    console.log(`[Cron] Deleted ${result.count} rate limit records`);

    return Response.json({
      success: true,
      deleted: result.count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Cron] Cleanup failed:', error);
    return Response.json(
      { error: 'Cleanup failed', message: error.message },
      { status: 500 }
    );
  }
}
```

### Task 2: Remove Per-Request Cleanup

**File:** `/lib/rate-limit.ts`

**Remove this:**
```typescript
// ❌ DELETE THIS - per-request cleanup is inefficient
const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
await prisma.rateLimit.deleteMany({
  where: { created_at: { lt: new Date(dayAgo) } }
});
```

### Task 3: Add Cron Configuration

**Add to `.env`:**
```
CRON_SECRET="your-secure-random-string-here"
```

**For Vercel:** Use Vercel Cron (`vercel.json`)
```json
{
  "crons": [{
    "path": "/api/cron/cleanup-rate-limits",
    "schedule": "0 2 * * *"
  }]
}
```

**For Railway/Self-hosted:** Use external cron service
- Curl scheduling service
- GitHub Actions
- Traditional cron job

### Verification Checklist
- [ ] Cleanup endpoint created at `/api/cron/cleanup-rate-limits`
- [ ] CRON_SECRET configured in `.env`
- [ ] Per-request cleanup removed from `rate-limit.ts`
- [ ] Cron schedule configured (daily 2 AM)
- [ ] Test cleanup by calling endpoint manually
- [ ] Verify `rate_limits` table doesn't grow unbounded

---

## Phase 4: Transaction Timeout Handling (MEDIUM PRIORITY) ⏳

### Overview
Add explicit timeout handling to all 13 transactions to prevent hanging operations.

### Task 1: Create Transaction Wrapper

**File:** Create `/lib/db/safe-transaction.ts`

```typescript
import { prisma } from "@/lib/prisma";

/**
 * Execute a transaction with explicit timeout protection
 * @param fn Transaction function to execute
 * @param timeoutMs Timeout in milliseconds (default: 30000)
 * @returns Result of transaction function
 * @throws Error if transaction exceeds timeout
 */
export async function safeTransaction<T>(
  fn: (tx: typeof prisma) => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Transaction timeout after ${timeoutMs}ms`));
    }, timeoutMs);
    // Ensure timer doesn't keep process alive
    timer.unref?.();
  });

  try {
    const result = await Promise.race([
      prisma.$transaction(fn),
      timeoutPromise
    ]);
    return result;
  } catch (error) {
    if (error.message?.includes('timeout')) {
      console.error(`[Transaction] Timeout after ${timeoutMs}ms`);
      // Add monitoring/alerting here
      throw new Error(`Transaction timeout - operation took too long`);
    }
    throw error;
  }
}
```

### Task 2: Find All Transactions

**Run grep to find all transactions:**
```bash
grep -r "prisma.\$transaction" /app/api --include="*.ts" -n
```

**Files to update:** (~13 locations)
- `/app/api/assessments/route.ts`
- `/app/api/assessments/verify/route.ts`
- `/app/api/students/bulk-import/route.ts`
- `/app/api/mentoring/route.ts`
- (others to be identified by grep)

### Task 3: Replace Each Transaction

**Before:**
```typescript
await prisma.$transaction(async (tx) => {
  // Operations...
});
```

**After:**
```typescript
import { safeTransaction } from "@/lib/db/safe-transaction";

await safeTransaction(async (tx) => {
  // Same operations...
}, 30000);  // 30-second timeout
```

### Verification Checklist
- [ ] Safe transaction wrapper created
- [ ] All 13 transactions identified
- [ ] Each transaction replaced with `safeTransaction`
- [ ] Default timeout verified (30s recommended)
- [ ] Test long-running transaction behavior
- [ ] Verify timeout error handling

---

## Phase 5: Bulk Import Optimization (MEDIUM PRIORITY) ⏳

### Overview
Prevent memory spike during bulk student import by streaming instead of loading all data.

### File
`/app/api/students/bulk-import/route.ts`

### Current Problem
```typescript
// Loads 10,000+ records into memory
const [classes, pilotSchools] = await Promise.all([
  prisma.schoolClass.findMany(),
  prisma.pilotSchool.findMany()
]);
```

### Recommended Fix
```typescript
// Stream processing instead
async function* streamClassesById() {
  const batchSize = 1000;
  let skip = 0;
  while (true) {
    const batch = await prisma.schoolClass.findMany({
      select: { id: true, name: true, school_id: true },
      take: batchSize,
      skip
    });
    if (batch.length === 0) break;
    for (const item of batch) yield item;
    skip += batchSize;
  }
}

// Use Map for O(1) lookups
const classMap = new Map();
for await (const cls of streamClassesById()) {
  classMap.set(cls.id, cls);
}

// Rest of processing continues with Map
```

### Verification Checklist
- [ ] Streaming function implemented
- [ ] Memory usage compared before/after
- [ ] Bulk import tested with 1000+ records
- [ ] Performance validated (should be same or better)
- [ ] Error handling for stream failures

---

## Phase 6: Code Refactoring (OPTIONAL - Q1 2026)

### Task: Split Large Routes

**These files are too large (>600 lines):**
- [ ] `/app/api/assessments/route.ts` (803 lines)
- [ ] `/app/api/mentoring/route.ts` (677 lines)
- [ ] `/app/api/users/route.ts` (614 lines)

**Recommendation:** Split into separate handler files
- `/handlers/get-assessments.ts`
- `/handlers/post-assessment.ts`
- `/handlers/verify-assessment.ts`
- etc.

---

## Verification Tests

### Memory Leak Test

```bash
# Start application
npm run dev

# In another terminal, monitor memory
watch -n 1 'node -e "console.log(Math.round(process.memoryUsage().heapUsed / 1024 / 1024)) + \" MB\""'

# Simulate 100 requests
for i in {1..100}; do
  curl "http://localhost:3003/api/assessments" \
    -H "Authorization: Bearer <token>" \
    -s -o /dev/null
  sleep 0.1
done

# Memory should NOT grow continuously
```

### Database Connection Test

```bash
# Monitor connections in real-time
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT
  state,
  COUNT(*) as count,
  MAX(EXTRACT(EPOCH FROM (now() - query_start)))::int as max_duration_sec
FROM pg_stat_activity
WHERE pid <> pg_backend_pid()
GROUP BY state
ORDER BY count DESC;
" && sleep 5 && \
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT COUNT(*) as total_connections
FROM pg_stat_activity
WHERE pid <> pg_backend_pid();
"

# Expected: 3-5 total connections, idle count should decrease
```

### Rate Limit Table Size Test

```bash
# Check table size before cleanup
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -c "
SELECT
  COUNT(*) as total_rows,
  pg_size_pretty(pg_total_relation_size('rate_limits')) as table_size
FROM rate_limits;
"

# Run cleanup
curl -X POST http://localhost:3003/api/cron/cleanup-rate-limits \
  -H "x-cron-secret: $CRON_SECRET" \
  -s | jq .

# Check size after
# Should see smaller row count if >24 hours old
```

---

## Deployment Checklist

### Before Deploy
- [ ] All Phase 1 fixes verified locally
- [ ] New environment variables configured (CRON_SECRET)
- [ ] Database connection limits updated in production
- [ ] Backup database before applying timeouts

### During Deploy
- [ ] Deploy updated code with mentor cache fixes
- [ ] Verify no connection errors during rollout
- [ ] Monitor memory usage for 1 hour

### After Deploy
- [ ] Verify database connections drop to 3-5
- [ ] Monitor memory for 24 hours
- [ ] Set up alerts for memory > 1 GB
- [ ] Document any issues encountered

---

## Rollback Plan

If issues arise:

### Revert Mentor Cache Changes
```bash
git checkout lib/mentorAssignments.ts
npm run db:generate
npm run dev
```

### Increase Connection Limits (If Too Strict)
```env
# In .env, change back to:
connection_limit=5&pool_timeout=10
```

### Disable Cleanup Job (If Causing Issues)
```bash
# Remove or comment out cron configuration in vercel.json
# Or manually stop the cron schedule
```

---

## Success Criteria

### Memory Management
- [x] Database connections: 16 → 3-5 ✅
- [x] Memory usage: 2.29 GiB → <500 MiB ✅
- [ ] Idle connections: Always <2
- [ ] No "too many connections" errors

### Performance
- [ ] Query P95 < 500ms
- [ ] Cache hit rate > 70%
- [ ] Rate limit table cleanup: Daily
- [ ] Transaction timeout: Properly handled

### Stability
- [ ] No memory leaks over 72 hours
- [ ] No cascading failures under load
- [ ] Graceful handling of edge cases
- [ ] Comprehensive error logging

---

## Timeline

### This Week (CRITICAL)
- [x] Complete Phase 1 (cache + connection fixes)
- [x] Create comprehensive documentation
- [ ] Deploy to staging for testing

### Next Week (HIGH)
- [ ] Complete Phase 2 (pagination limits)
- [ ] Complete Phase 3 (cleanup job)
- [ ] Deploy to production

### Following Weeks (MEDIUM)
- [ ] Complete Phase 4 (transaction timeouts)
- [ ] Complete Phase 5 (bulk import optimization)
- [ ] Load testing & verification

### Q1 2026 (OPTIONAL)
- [ ] Phase 6 (code refactoring)
- [ ] Implement Redis caching
- [ ] Advanced monitoring setup

---

## Questions & Support

See main documentation:
- `MEMORY_LEAK_PREVENTION_GUIDE.md` - Detailed explanations
- `DATABASE_MEMORY_ISSUE_FIX.md` - Original issue & fix
- `QUICK_FIX_REFERENCE.md` - Quick reference

For implementation help, refer to specific code examples in this document.
