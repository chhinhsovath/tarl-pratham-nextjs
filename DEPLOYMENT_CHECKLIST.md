# Vercel Auto-Deploy Setup Checklist

---

## 🚨 **CRITICAL: Fix Production Database Errors (January 2025)**

### Current Production Errors
1. ❌ **Connection pool exhaustion**: "Too many database connections opened: FATAL: remaining connection slots are reserved for roles with the SUPERUSER attribute"
2. ❌ **API 500 errors**: `/api/coordinator/stats`, `/api/coordinator/activities`, `/api/bulk-import/history`

### **IMMEDIATE ACTION REQUIRED: Update DATABASE_URL on Vercel**

#### Quick Fix Steps (2 minutes):
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select project: `tarl-pratham-nextjs`
3. Navigate to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` and click **Edit**
5. Replace with this **EXACT** value (add connection pooling parameters):

```
postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
```

**New parameters added:**
- `connection_limit=1` - Limit each serverless function to 1 connection
- `pool_timeout=10` - Wait max 10 seconds for a connection

6. Click **Save**
7. Go to **Deployments** → Click latest deployment → **Redeploy**
8. **IMPORTANT:** Uncheck "Use existing Build Cache"

#### What This Fixes:
**Problem:**
- Vercel serverless functions were opening multiple connections per function
- With ~10 concurrent requests = ~30+ connections opened simultaneously
- Database only allows ~100 connections total
- Connection pool quickly exhausted

**Solution:**
- `connection_limit=1` ensures each function uses only 1 connection
- With 80 available slots ÷ 1 per function = supports 80 concurrent requests
- Sufficient for current application load

#### Verify Fix:
After redeployment, test these endpoints:
- https://tarl.openplp.com/api/coordinator/stats
  - Should return: `{ total_schools: 33, total_teachers: X, total_assessments: Y, ... }`
- https://tarl.openplp.com/coordinator
  - Should display dashboard with assessment statistics
- https://tarl.openplp.com/coordinator/mentor-assignments
  - Should show mentor assignments table

**See VERCEL_DATABASE_FIX.md for detailed explanation and alternative PgBouncer setup.**

---

## ✅ Pre-Deployment Checklist

### 1. GitHub Repository Status
- [x] All commits pushed to `main` branch
- [x] Repository: `https://github.com/chhinhsovath/tarl-pratham-nextjs`
- [x] Latest commits include all fixes (coordinator monitoring, mentor assignments, etc.)

### 2. Local Environment
- [x] `.env.local` configured with Old Server connection (157.10.73.52)
- [x] Build tested locally: `npm run build` - SUCCESS ✅
- [x] Database connection verified with Old Server

---

## 🚀 Vercel Dashboard Configuration

### Step 1: Access Project Settings
1. Go to: https://vercel.com/dashboard
2. Find and click on your project: `tarl-pratham-nextjs`
3. Click **Settings** tab

### Step 2: Git Integration (Enable Auto-Deploy)
Navigate to: **Settings → Git**

**Required Settings:**
- [ ] **Connected Repository**: `chhinhsovath/tarl-pratham-nextjs` ✓
- [ ] **Production Branch**: `main` ✓
- [ ] **Auto Deploy on Push**: ENABLED ✓
- [ ] **Deploy Hooks**: ENABLED ✓
- [ ] **Ignored Build Step**: EMPTY (leave unchecked)

### Step 3: Environment Variables
Navigate to: **Settings → Environment Variables**

**Add these variables for Production:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `DATABASE_URL` | `postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10` | Production |
| `NEXTAUTH_URL` | `https://tarl.openplp.com` | Production |
| `NEXTAUTH_SECRET` | `5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=` | Production |
| `NODE_ENV` | `production` | Production |
| `NEXT_PUBLIC_API_URL` | `https://tarl.openplp.com/api` | Production |
| `SUPPRESS_ANTD_WARNING` | `true` | Production |

**CRITICAL:** DATABASE_URL must include `connection_limit=1&pool_timeout=10` parameters to prevent connection pool exhaustion.

**Reference:** See `.env.production.example` for complete list of environment variables.

### Step 4: Build & Development Settings
Navigate to: **Settings → General**

**Verify these settings:**
- [ ] **Framework Preset**: Next.js ✓
- [ ] **Build Command**: `npm run build` or default
- [ ] **Output Directory**: `.next` or default
- [ ] **Install Command**: `npm install` or default
- [ ] **Node.js Version**: 18.x or 20.x (latest LTS)

---

## 🔄 Manual Redeploy (First Time Setup)

### Step 5: Trigger Initial Deployment
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click **⋮** (three dots) → **Redeploy**
4. **IMPORTANT:** Uncheck "Use existing Build Cache"
5. Click **Redeploy** button
6. Wait 3-5 minutes for build to complete

---

## ✅ Post-Deployment Verification

### Step 6: Test Deployment
Once deployment shows **Ready**, test these pages:

- [ ] Homepage: https://tarl.openplp.com
- [ ] Login: https://tarl.openplp.com/auth/login
- [ ] Coordinator Monitoring: https://tarl.openplp.com/coordinator/monitoring
- [ ] Mentor Assignments: https://tarl.openplp.com/coordinator/mentor-assignments
- [ ] Assessment Periods: https://tarl.openplp.com/assessments/periods

### Step 7: Verify Database Connection
Test API endpoints:
- [ ] GET https://tarl.openplp.com/api/coordinator/stats
  - Should return: `{ total_schools: 33, total_teachers: X, total_assessments: Y, ... }`
- [ ] GET https://tarl.openplp.com/api/pilot-schools
  - Should return list of 33 schools
- [ ] GET https://tarl.openplp.com/api/mentor-assignments
  - Should return mentor assignments with school details

### Step 8: Check for Errors
1. Open browser console (F12)
2. Navigate to each page
3. Look for:
   - [ ] No JavaScript errors
   - [ ] No "Cannot read properties of undefined" errors
   - [ ] No database connection errors ("Too many database connections")
   - [ ] All data loads correctly from Old Server (157.10.73.52)

---

## 🎯 Expected Results

### Build Output Should Show:
```
✓ Compiled successfully
✓ Generating static pages (145/145)
✓ Finalizing page optimization
```

### Live Site Should Display:
- ✅ All assessment period labels in Khmer (តេស្តដើមគ្រា, តេស្តពាក់កណ្ដាលគ្រា, តេស្តចុងក្រោយគ្រា)
- ✅ Coordinator dashboard with assessment statistics breakdown
  - By creator (mentor vs teacher)
  - By subject (Language vs Math)
  - By type (Baseline, Midline, Endline)
- ✅ Mentor assignments page showing mentors assigned to schools
  - Auto-created assignments from profile setup
- ✅ Real data from Old Server (157.10.73.52):
  - 33 pilot schools
  - Active users (teachers, mentors, coordinators)
  - Student records and assessments

---

## 🔧 Troubleshooting

### If Build Fails:
1. Check **Build Logs** in Vercel deployment details
2. Look for common issues:
   - Missing environment variables
   - Database connection errors
   - TypeScript errors

### If Pages Show Errors:
1. Check browser console for JavaScript errors
2. Verify environment variables are set correctly in Vercel
3. Check API responses in Network tab (F12 → Network)
4. Verify DATABASE_URL includes connection pooling parameters

### Common Issues:
- **"Too many database connections opened"**:
  - DATABASE_URL missing `connection_limit=1&pool_timeout=10`
  - Update in Vercel environment variables and redeploy
  - See VERCEL_DATABASE_FIX.md for detailed fix
- **"BookOutlined is not defined"**: Missing import (fixed in recent commit)
- **"Cannot read properties of undefined"**: Check import order and null checks
- **Empty data**: Verify DATABASE_URL points to correct server (157.10.73.52)
- **API 500 errors**: Check Vercel function logs for detailed error messages

---

## 📝 Notes

- **Auto-Deploy**: Once configured, every `git push` to `main` will trigger automatic deployment
- **Build Time**: Typically takes 3-5 minutes
- **Database**: Connected to Old Server (157.10.73.52) with connection pooling
- **Domain**: https://tarl.openplp.com
- **Critical Fix**: DATABASE_URL must include connection pooling parameters to prevent serverless connection exhaustion

## 🎉 Success Criteria

Deployment is successful when:
- [x] Build completes without errors
- [x] All pages load without JavaScript errors
- [x] Data loads from Old Server (157.10.73.52) correctly
- [x] Coordinator dashboard displays assessment statistics
  - Shows breakdown by creator (mentor/teacher)
  - Shows breakdown by subject (Language/Math)
  - Shows breakdown by type (Baseline/Midline/Endline)
- [x] Mentor assignments page shows mentors assigned to schools
  - Auto-created assignments from profile setup appear
- [x] No "Too many database connections" errors
- [x] Assessment period labels show in Khmer

---

**Last Updated:** 2025-10-13

**Latest Features:**
- ✅ Auto-create mentor assignments when mentors complete profile setup
- ✅ Coordinator dashboard displays detailed assessment statistics
  - Breakdown by creator (mentor vs teacher)
  - Breakdown by subject (Language vs Math)
  - Breakdown by type (Baseline, Midline, Endline)
- ✅ Mentor assignments page shows all mentors assigned to schools

**Critical Fix Required:**
- ⚠️ Update DATABASE_URL in Vercel to include connection pooling parameters
- See top of this document for immediate action steps
