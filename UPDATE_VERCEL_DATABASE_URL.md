# 🚨 URGENT: Update Vercel DATABASE_URL

## Problem
Your local `.env` has `connection_limit=20&pool_timeout=20`, but Vercel production still has old values causing timeout errors.

Error: `connection pool timeout: 10, connection limit: 1`

## Solution: Update Vercel Environment Variable

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Select project: **tarl-pratham-nextjs**
3. Go to **Settings** → **Environment Variables**

### Step 2: Find and Update DATABASE_URL

**Find:** `DATABASE_URL`

**Replace with (matches your local .env):**
```
postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=20&pool_timeout=20
```

**Key Parameters:**
- `connection_limit=20` - Allows up to 20 connections per serverless instance
- `pool_timeout=20` - Wait up to 20 seconds for connection
- `connect_timeout=10` - Initial connection timeout

### Step 3: Also Update POSTGRES_PRISMA_URL (if it exists)

**Find:** `POSTGRES_PRISMA_URL`

**Replace with:**
```
postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=20&pool_timeout=20
```

### Step 4: Save Changes
1. Click **Save** on each variable
2. Confirm the changes

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click **...** menu on latest deployment
3. Click **Redeploy**
4. ✅ **IMPORTANT:** Select **"Use existing Build Cache: No"**
5. Click **Redeploy**

## Why This is Needed

**Local vs Production:**
- Your local `.env` = `connection_limit=20&pool_timeout=20` ✅
- Vercel production = `connection_limit=1&pool_timeout=10` ❌ (OLD)

**The mismatch causes:**
- Timeout errors on production
- "Connection pool exhausted" errors
- 500 Internal Server Error

## Expected Result After Update

✅ All APIs will work without timeout errors
✅ School overview report will load successfully
✅ Students management will load successfully
✅ Connection pool will have 20 connections available

## Timeline

- **Update Vercel variable:** 1 minute
- **Redeploy:** 1-2 minutes
- **Total:** ~3 minutes to fix

## Verification

After redeployment completes:
1. Visit https://tarl.openplp.com/reports/school-overview
2. Should load without timeout error
3. Should show coordinator's school data

---

**DO THIS NOW** to fix the timeout errors! 🚀
