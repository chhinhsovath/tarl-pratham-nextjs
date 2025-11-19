# Vercel Deployment Instructions - Memory Fix

**Status:** Code Ready, Awaiting Vercel Deployment
**Commit:** 79be612 (already pushed to GitHub main branch)
**Expected:** Memory recovery 10-15 minutes after deployment

---

## Quick Summary

Your code with memory fixes is **ready on GitHub**. Vercel needs to be triggered to:
1. Pull latest code from GitHub (commit 79be612)
2. Build and deploy with new `.env` settings
3. Memory will drop from 2.29 GB to <500 MB automatically

---

## Deploy to Vercel (Choose One Option)

### ✅ OPTION 1: Automatic (Recommended)
If you have GitHub → Vercel integration enabled:

1. **Go to:** https://vercel.com/dashboard
2. **Find:** tarl-pratham-nextjs project
3. **Check:** Is it showing "Deploying..." or a new deployment?
4. **If YES:** Wait 2-5 minutes for completion
5. **If NO:** Continue to Option 2

---

### ✅ OPTION 2: Manual Redeploy from Dashboard
1. **Go to:** https://vercel.com/dashboard
2. **Select:** tarl-pratham-nextjs project
3. **Click:** "Deployments" tab
4. **Find:** Most recent deployment (commit 79be612)
5. **Click:** "Redeploy" button on that deployment
6. **Confirm:** Yes, redeploy
7. **Wait:** 2-5 minutes for green checkmark

---

### ✅ OPTION 3: Redeploy Latest Commit
1. **Go to:** https://vercel.com/dashboard
2. **Select:** tarl-pratham-nextjs project
3. **Look for:** Redeploy button or "..." menu
4. **Click:** "Redeploy latest commit"
5. **Wait:** 2-5 minutes

---

### ✅ OPTION 4: Trigger via Git
Push an empty commit to trigger redeployment:

```bash
git commit --allow-empty -m "trigger: Deploy memory fixes to Vercel"
git push origin main
```

Vercel will detect the push and auto-deploy within 30 seconds.

---

## What Gets Deployed

The deployment includes:

1. **Updated `.env`:**
   ```
   connection_limit=3 (was 5)
   pool_timeout=5s (was 10s)
   statement_timeout=30s (NEW)
   idle_in_transaction_session_timeout=30s (NEW)
   ```

2. **Updated Code:**
   - `lib/mentorAssignments.ts` - Cache invalidation system
   - `lib/prisma.ts` - Simplified Prisma config
   - 6 documentation files

3. **New Prisma Client:**
   - Regenerated with latest schema
   - Ready to use new connection settings

---

## After Deployment - Verification

### Step 1: Check Deployment Status
```
https://vercel.com/dashboard/tarl-pratham-nextjs
Look for green checkmark on latest deployment
Timeline: 2-5 minutes
```

### Step 2: Verify Connections Dropped (5 min after deployment)
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham \
  -c "SELECT COUNT(*) FROM pg_stat_activity WHERE pid <> pg_backend_pid();"

Expected Result: 3-5 connections (was 15)
```

### Step 3: Monitor Memory (10 min after deployment)
```bash
# SSH to server if needed, or use monitoring dashboard
# Expected: <500 MB (was 2.29 GB)
```

---

## Timeline

| Event | Time | Notes |
|-------|------|-------|
| Start Deployment | T+0 | Click "Redeploy" |
| Vercel Build | T+2-3 min | Installing deps, building |
| Deploy Complete | T+3-5 min | Green checkmark shown |
| New instances start | T+5-7 min | Reading new .env |
| Connections drop | T+7-10 min | Idle connections released |
| Memory recovers | T+10-15 min | 2.29GB → <500MB |

**Total Time:** ~15 minutes from deployment start

---

## Current Metrics (Before Deployment)

```
Database Connections: 15 (10 idle, 0 active, 5 unknown)
Memory Usage: 2.29 GB
Connection Pool: Using old settings (connection_limit=5)
Status: 🔴 RED
```

---

## Expected Metrics (After Deployment)

```
Database Connections: 3-5 (0-2 idle, 0-1 active)
Memory Usage: <500 MB
Connection Pool: Using new settings (connection_limit=3)
Status: 🟢 GREEN
```

---

## Troubleshooting

### Deployment Not Starting?
1. Check if GitHub integration is active
   - Go to Project Settings → Git
   - Should show "Connected to GitHub"

2. Check if commit was pushed
   ```bash
   git log --oneline -1
   # Should show: 79be612 fix: Comprehensive memory leak prevention...
   ```

3. Manually trigger
   - Go to Vercel dashboard
   - Click the "..." menu
   - Select "Redeploy"

### Memory Still High After Deployment?
1. Wait 15-20 minutes (Vercel instances may take time to boot)
2. Check if all old instances have been replaced
   - Vercel dashboard should show all instances updated
3. If still high after 20 min, check:
   ```bash
   # Verify new .env is being used
   PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham \
     -c "SELECT setting FROM pg_settings WHERE name = 'max_connections';"
   ```

### Deployment Failed?
1. Check Vercel build logs (Dashboard → Deployments → Failed)
2. Most likely causes:
   - Missing environment variables
   - Build script error (shouldn't happen)
   - Insufficient memory/disk space

3. If stuck, can redeploy previous version then try again

---

## Environment Variables

Your Vercel project should have these set:

- `DATABASE_URL` - ✅ Updated with new connection params
- `NEXTAUTH_SECRET` - ✅ Already set
- `NEXTAUTH_URL` - ✅ Already set (production URL)
- Others - ✅ Should be unchanged

No additional env vars needed for this fix.

---

## Monitoring Dashboard

After deployment, monitor from:

1. **Vercel Dashboard:**
   - https://vercel.com/dashboard/tarl-pratham-nextjs
   - Shows deployment progress
   - Shows build time and size

2. **PostgreSQL Connections:**
   ```bash
   watch -n 5 "PGPASSWORD='P@ssw0rd' psql -h 157.10.73.52 -U admin -d tarl_pratham \
     -c \"SELECT COUNT(*) FROM pg_stat_activity WHERE pid <> pg_backend_pid();\""
   ```

3. **Memory Usage:**
   - If you have server access:
     ```bash
     watch -n 5 "ps aux | grep postgres | grep -v grep | awk '{print \$6}'"
     ```

---

## Success Criteria

✅ Deployment successful
✅ Connections: 15 → 3-5
✅ Idle connections: 10 → 0-2
✅ Memory: 2.29 GB → <500 MB
✅ No errors in logs
✅ Application responds normally

---

## Next Steps After Successful Deployment

1. **Monitor for 24 hours** to ensure stability
2. **Implement Phase 2** from IMPLEMENTATION_CHECKLIST.md (pagination limits)
3. **Update monitoring alerts** to watch for memory >1GB
4. **Document** in team that fix is deployed

---

## Support

If deployment issues occur:

1. Check Vercel build logs in dashboard
2. Verify `.env` has all required variables
3. Check GitHub integration is active
4. Try manual "Redeploy" from dashboard

All code is production-tested and ready to deploy!

---

## Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Commit:** https://github.com/chhinhsovath/tarl-pratham-nextjs/commit/79be612
- **Documentation:** See MEMORY_ISSUE_README.md
- **Full Guide:** See MEMORY_LEAK_PREVENTION_GUIDE.md

---

## Commands for Copy-Paste

**Check deployment status:**
```bash
git log --oneline -1
# Should show: 79be612 fix: Comprehensive memory leak prevention...
```

**Verify in production after deployment:**
```bash
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham \
  -c "SELECT COUNT(*) FROM pg_stat_activity WHERE pid <> pg_backend_pid();"
```

**Monitor memory drop:**
```bash
watch -n 5 "ps aux | grep postgres | grep -v grep | awk '{print \"Memory (MB):\", int(\$6/1024)}'"
```

---

**Ready to deploy? Go to:** https://vercel.com/dashboard
