# API Connection Pooling & Double-Fetch Prevention

## Problem Identified

The assessments page was making **double API calls** (race condition), which:
- Wastes database connection pool slots
- Increases server load unnecessarily
- Causes data inconsistency (showing wrong counts)
- Exhausts the limited connection pool faster

## Root Cause Analysis

### Before Fix - Race Condition Flow:

```
Time 1: Component mounts
  → useEffect (line 89-92) calls fetchAssessments()
  → Request sent: GET /api/assessments?page=1&limit=20 (NO FILTERS)
  → Connection pool slot: 1/3 used
  → Returns: 159 assessments

Time 2: searchParams processed
  → useEffect (line 70-87) reads URL params
  → Sets filters state: pilot_school_id=25

Time 3: Filter change detected
  → useEffect (line 94-96) triggers
  → Calls fetchAssessments()
  → Request sent: GET /api/assessments?page=1&limit=20&pilot_school_id=25 (WITH FILTER)
  → Connection pool slot: 2/3 used
  → Returns: 87 assessments

Time 4: Race condition
  → First request completes AFTER second
  → Data overwrites: 87 → 159 (WRONG)
  → Connection pool briefly had 2 active queries
```

### Connection Pool Impact

With original 3-connection limit (from .env fix):
- **Each double-fetch uses 2 connections simultaneously**
- Multiple users = connection pool exhausted quickly
- Users get "connection timeout" errors
- System becomes unstable

## Solution Implemented

### New Approach - Single Consolidated Fetch

```typescript
// Track initialization state
const [isInitialized, setIsInitialized] = useState(false);
const hasInitialFetchRef = React.useRef(false);

// Single consolidated effect handles ALL triggers
useEffect(() => {
  if (!isInitialized) return;  // ← Gate 1: Wait for init

  // Prevent initial fetch from running twice
  if (!hasInitialFetchRef.current) {
    hasInitialFetchRef.current = true;
    fetchAssessments();  // ← Only ONE fetch on init
    return;
  }

  // Debounce subsequent changes (filter/pagination)
  const debounceTimer = setTimeout(() => {
    fetchAssessments();
  }, 300);  // ← Wait 300ms before fetching

  return () => clearTimeout(debounceTimer);
}, [isInitialized, filters, pagination.current, pagination.pageSize]);
```

### After Fix - Sequential Flow:

```
Time 1: Component mounts
  → useEffect (line 75-97) reads URL params
  → Sets filters state: pilot_school_id=25 if present
  → Sets isInitialized=true

Time 2: isInitialized=true detected
  → useEffect (line 106-123) triggers
  → hasInitialFetchRef.current = false (first time)
  → Calls fetchAssessments() ONCE
  → Request sent: GET /api/assessments?page=1&limit=20&pilot_school_id=25 (WITH FILTER)
  → Connection pool slot: 1/3 used
  → Returns: 87 assessments (CORRECT)

Time 3: User changes filter
  → Filter state updates
  → useEffect triggers
  → hasInitialFetchRef.current = true (already fetched)
  → setTimeout 300ms debounce starts
  → After 300ms, calls fetchAssessments() ONCE
  → Returns: updated results
```

## Benefits of This Fix

| Aspect | Before | After |
|--------|--------|-------|
| **API Calls on Load** | 2 (race condition) | 1 (guaranteed) |
| **Connection Pool Usage** | 2 simultaneous | 1 sequential |
| **Data Consistency** | 87 → 159 (wrong) | 87 → 87 (correct) |
| **Rapid Filter Changes** | Multiple calls | Debounced to 1 call |
| **Server Load** | High | Low |
| **User Experience** | Data flickers | Stable display |

## Key Techniques Used

### 1. Initialization Gate
```typescript
if (!isInitialized) return;  // Don't fetch until ready
```

### 2. Ref Flag (One-time trigger)
```typescript
const hasInitialFetchRef = React.useRef(false);
if (!hasInitialFetchRef.current) {
  hasInitialFetchRef.current = true;
  fetchAssessments();  // Only runs ONCE
  return;  // Exit to prevent multiple calls
}
```

### 3. Debouncing (Rapid changes)
```typescript
const debounceTimer = setTimeout(() => {
  fetchAssessments();
}, 300);  // Wait 300ms before calling API
return () => clearTimeout(debounceTimer);  // Cancel if deps change again
```

## Testing the Fix

### Test 1: URL Parameter Filtering
```bash
# Visit: https://tarl.openplp.com/assessments?pilot_school_id=25
# Expected:
# - Shows 87 assessments immediately
# - Number does NOT change to 159
# - No flickering or data updates after initial load
```

### Test 2: Check Network Tab
```
# Open DevTools → Network tab
# Filter: /api/assessments
# Expected:
# - Only 1 GET request on page load
# - No duplicate requests
# - Single response completes successfully
```

### Test 3: Connection Pool Monitoring
```sql
SELECT datname, count(*) FROM pg_stat_activity
WHERE state = 'active' GROUP BY datname;

-- Expected: No "active" connections
-- Max concurrent: 1 (not 2)
```

## Database Impact

### Before Fix
- Multiple users accessing assessments page
- Each user triggers 2 API calls
- 10 users = 20 simultaneous connection attempts
- Pool limit: 3 → **17 connections waiting** → TIMEOUT errors

### After Fix
- Each user triggers 1 API call
- 10 users = 10 simultaneous connection attempts
- Pool limit: 3 → Queued properly → No timeouts

## Related Commits

- `79be612` - Memory fixes & connection pool settings (limit: 5→3)
- `41d55d3` - Database cleanup (removed inactive records)
- `4807a08` - This fix (prevents double-fetching)

These three commits together solve the memory + connection pooling issues.

## Monitoring After Deployment

After deploying to Vercel:

```bash
# Check server logs for duplicate requests
grep "GET /api/assessments" logs | wc -l

# Should be significantly LOWER than before

# Monitor connection pool
PGPASSWORD="..." psql -h 157.10.73.52 -c "
SELECT
  datname,
  count(*) as connections,
  max(state_change) as last_activity
FROM pg_stat_activity
GROUP BY datname;
"

# Idle connections should stay under 5 (not spike to 15)
```

## Summary

The fix eliminates the race condition by:
1. ✅ Waiting for URL parameter initialization before first fetch
2. ✅ Using a ref flag to ensure initial fetch runs only once
3. ✅ Debouncing subsequent filter changes to prevent rapid API calls
4. ✅ Reducing simultaneous connection pool usage from 2 → 1

This reduces database load by ~50% on the assessments page and prevents connection pool exhaustion.
