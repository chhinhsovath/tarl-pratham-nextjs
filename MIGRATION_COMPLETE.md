# ✅ Database Migration Complete!

## 🎉 Summary

Your TaRL Pratham application has been successfully migrated from Supabase to your old server database.

---

## 📊 Current Status

### Local Development ✅
```
Database:  157.10.73.52 / tarl_pratham
Status:    Connected
Build:     Successful
Dev Server: Working on port 3004

Current Data:
  - Users: 94
  - Schools: 37
  - Students: 137
  - Assessments: 157
```

### Verification Endpoint Created ✅
```
URL: /api/verify-db
Test locally: http://localhost:3004/api/verify-db
Test production (after deploy): https://tarl.openplp.com/api/verify-db
```

---

## 🚀 Next Steps for Production

### Step 1: Update Vercel Environment Variables

**Open:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

#### A. Remove Old Supabase Variables (13 total)

Delete these by clicking ⋮ → Delete on each:
- `TARL_OPENPLP_POSTGRES_URL`
- `TARL_OPENPLP_POSTGRES_URL_NON_POOLING`
- `TARL_OPENPLP_POSTGRES_PRISMA_URL`
- `TARL_OPENPLP_POSTGRES_HOST`
- `TARL_OPENPLP_POSTGRES_USER`
- `TARL_OPENPLP_POSTGRES_PASSWORD`
- `TARL_OPENPLP_POSTGRES_DATABASE`
- `TARL_OPENPLP_SUPABASE_URL`
- `TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_URL`
- `TARL_OPENPLP_SUPABASE_JWT_SECRET`
- `TARL_OPENPLP_SUPABASE_ANON_KEY`
- `TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `TARL_OPENPLP_SUPABASE_SERVICE_ROLE_KEY`

#### B. Add New Variables

Click "Add New" for each variable:

**Database (8 variables):**
```
DATABASE_URL = postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
POSTGRES_PRISMA_URL = postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
POSTGRES_URL_NON_POOLING = postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
POSTGRES_HOST = 157.10.73.52
POSTGRES_PORT = 5432
POSTGRES_USER = admin
POSTGRES_PASSWORD = P@ssw0rd
POSTGRES_DATABASE = tarl_pratham
```

**Auth & Config (4 variables):**
```
NEXTAUTH_URL = https://tarl.openplp.com
NEXTAUTH_SECRET = 5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=
NODE_ENV = production
NEXT_PUBLIC_API_URL = https://tarl.openplp.com/api
```

**For each variable:**
- Select: ☑️ Production ☑️ Preview ☑️ Development
- Click "Save"

---

### Step 2: Ensure Database Accessibility

**On server 157.10.73.52:**

```bash
# SSH to server
ssh ubuntu@157.10.73.52

# Edit PostgreSQL config
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Add this line (if not exists):
host    tarl_pratham    admin    0.0.0.0/0    md5

# Reload PostgreSQL
sudo systemctl reload postgresql

# Test connection
psql -h 157.10.73.52 -U admin -d tarl_pratham -c "SELECT COUNT(*) FROM users;"
```

---

### Step 3: Deploy to Vercel

**Option A: Auto Deploy (Recommended)**
```bash
git add .
git commit -m "chore: Migrate to old server database (157.10.73.52)"
git push origin main
```

Vercel will automatically deploy (~2 minutes)

**Option B: Manual Redeploy**
- Go to Vercel Dashboard → Deployments
- Click "..." on latest deployment
- Click "Redeploy"

---

### Step 4: Verify Production

**After deployment completes:**

1. **Check Deployment Status**
   ```
   Vercel Dashboard → Deployments
   Status should show: ✅ Ready
   ```

2. **Test Verification Endpoint**
   ```
   Open: https://tarl.openplp.com/api/verify-db
   
   Expected response:
   {
     "status": "connected",
     "database": {
       "host": "157.10.73.52",
       "name": "tarl_pratham"
     },
     "stats": {
       "users": 94,
       "schools": 37,
       "students": 137,
       "assessments": 157
     }
   }
   ```

3. **Test Application**
   - Visit: https://tarl.openplp.com
   - Login with existing account
   - Verify data loads correctly
   - Test creating/editing records

---

## 📁 Files Created/Modified

### Created:
- ✅ `.env.production.example` - Production environment template
- ✅ `docs/VERCEL_ENV_SETUP.md` - Detailed setup guide
- ✅ `docs/DATABASE_MIGRATION.md` - Migration documentation
- ✅ `app/api/verify-db/route.ts` - Verification endpoint
- ✅ `scripts/test-db-connection.js` - Connection test script
- ✅ `scripts/remove-vercel-env.sh` - Cleanup script
- ✅ `MIGRATION_COMPLETE.md` - This summary

### Modified:
- ✅ `.env` - Updated to old server
- ✅ `.env.local` - Updated to old server

### Backed Up:
- ✅ `.env.supabase.backup` - Original Supabase config
- ✅ `.env.local.supabase.backup` - Local Supabase config

---

## ✅ Verification Checklist

### Local Development
- [x] Database connected to 157.10.73.52
- [x] Prisma client generated
- [x] Build successful
- [x] Dev server working
- [x] Verification endpoint working

### Production Deployment
- [ ] Old Supabase variables removed from Vercel
- [ ] New database variables added to Vercel
- [ ] Deployed to production
- [ ] Verification endpoint returns old server data
- [ ] Application loads correctly
- [ ] Can login and access data
- [ ] Assessment periods feature working

---

## 🔄 Rollback Plan (If Needed)

If you need to revert to Supabase:

```bash
# 1. Restore Supabase config
cp .env.supabase.backup .env
cp .env.local.supabase.backup .env.local

# 2. Regenerate Prisma
npm run db:generate

# 3. Restart dev server
npm run dev
```

For production:
- Restore Supabase variables in Vercel
- Remove old server variables
- Redeploy

---

## 📞 Support & Documentation

**Detailed Guides:**
- `docs/VERCEL_ENV_SETUP.md` - Complete Vercel setup
- `docs/DATABASE_MIGRATION.md` - Migration details
- `.env.production.example` - Production config template

**Test Endpoints:**
```bash
# Local
curl http://localhost:3004/api/verify-db | jq '.'

# Production (after deploy)
curl https://tarl.openplp.com/api/verify-db | jq '.'
```

**Database Direct Connection:**
```bash
psql -h 157.10.73.52 -U admin -d tarl_pratham
Password: P@ssw0rd
```

---

## 🎯 Success Criteria

You're done when:
1. ✅ All Vercel environment variables updated
2. ✅ https://tarl.openplp.com/api/verify-db shows old server
3. ✅ Can login to https://tarl.openplp.com
4. ✅ Data displays correctly
5. ✅ Assessment periods bulk update feature works

---

**Migration Date:** 2025-01-10  
**Status:** ✅ Ready for Production Deployment  
**Next Action:** Update Vercel environment variables

