# Vercel Auto-Deploy Setup Checklist

## ✅ Pre-Deployment Checklist

### 1. GitHub Repository Status
- [x] All commits pushed to `main` branch
- [x] Repository: `https://github.com/chhinhsovath/tarl-pratham-nextjs`
- [x] Latest commits include all fixes (coordinator monitoring, mentor assignments, etc.)

### 2. Local Environment
- [x] `.env.local` configured with Supabase connection
- [x] Build tested locally: `npm run build` - SUCCESS ✅
- [x] Database connection verified with Supabase

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
| `DATABASE_URL` | `postgres://postgres.uyrmvvwwchzmqtstgwbi:...` | Production |
| `NEXTAUTH_URL` | `https://tarl.openplp.com` | Production |
| `NEXTAUTH_SECRET` | `your-secret-key` | Production |
| `NODE_ENV` | `production` | Production |
| `SUPPRESS_ANTD_WARNING` | `true` | Production |

**Important:** Use the full DATABASE_URL from `.env.production.example`

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
- [ ] GET https://tarl.openplp.com/api/coordinator/monitoring
  - Should return: `{ total_users: 92, total_schools: 33, ... }`
- [ ] GET https://tarl.openplp.com/api/pilot-schools
  - Should return list of 33 schools

### Step 8: Check for Errors
1. Open browser console (F12)
2. Navigate to each page
3. Look for:
   - [ ] No JavaScript errors
   - [ ] No "Cannot read properties of undefined" errors
   - [ ] All data loads correctly from Supabase

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
- ✅ Coordinator monitoring page loads without errors
- ✅ Mentor assignments page with multi-select functionality
- ✅ Real data from Supabase (92 users, 33 schools, 46 students)

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
2. Verify environment variables are set correctly
3. Check API responses in Network tab
4. Verify DATABASE_URL is using Supabase connection string

### Common Issues:
- **"Cannot read properties of undefined"**: Import order issue (fixed in latest commit)
- **"Invalid enum value"**: RecordStatus enum issue (fixed in latest commit)
- **"Invalid DateTime"**: DateTime format issue (fixed in latest commit)
- **Empty data**: Check DATABASE_URL points to Supabase, not local database

---

## 📝 Notes

- **Auto-Deploy**: Once configured, every `git push` to `main` will trigger automatic deployment
- **Build Time**: Typically takes 3-5 minutes
- **Database**: Connected to Supabase production database
- **Domain**: https://tarl.openplp.com

## 🎉 Success Criteria

Deployment is successful when:
- [x] Build completes without errors
- [x] All pages load without JavaScript errors
- [x] Data loads from Supabase correctly
- [x] Coordinator monitoring page displays stats
- [x] Mentor assignments page works with multi-select
- [x] Assessment period labels show in Khmer

---

**Last Updated:** 2025-10-07
**Latest Commit:** `a842320` - fix: Resolve client-side error in coordinator monitoring page
