# Vercel Environment Variables Setup & Verification Guide

## 📋 Step-by-Step Setup Checklist

### Phase 1: Remove Old Supabase Variables

**Go to:** https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Delete these 13 variables:**
- [ ] `TARL_OPENPLP_POSTGRES_URL`
- [ ] `TARL_OPENPLP_POSTGRES_URL_NON_POOLING`
- [ ] `TARL_OPENPLP_POSTGRES_PRISMA_URL`
- [ ] `TARL_OPENPLP_POSTGRES_HOST`
- [ ] `TARL_OPENPLP_POSTGRES_USER`
- [ ] `TARL_OPENPLP_POSTGRES_PASSWORD`
- [ ] `TARL_OPENPLP_POSTGRES_DATABASE`
- [ ] `TARL_OPENPLP_SUPABASE_URL`
- [ ] `TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_URL`
- [ ] `TARL_OPENPLP_SUPABASE_JWT_SECRET`
- [ ] `TARL_OPENPLP_SUPABASE_ANON_KEY`
- [ ] `TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `TARL_OPENPLP_SUPABASE_SERVICE_ROLE_KEY`

---

### Phase 2: Add New Database Variables

**For EACH variable below:**
1. Click "Add New" button
2. Enter the variable name (exactly as shown)
3. Paste the value
4. Select environments: ☑️ Production ☑️ Preview ☑️ Development
5. Click "Save"

#### Database Connection (Old Server 157.10.73.52)

```bash
# Variable 1
Name:  DATABASE_URL
Value: postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
Envs:  Production, Preview, Development

# Variable 2
Name:  POSTGRES_PRISMA_URL
Value: postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
Envs:  Production, Preview, Development

# Variable 3
Name:  POSTGRES_URL_NON_POOLING
Value: postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10
Envs:  Production, Preview, Development

# Variable 4
Name:  POSTGRES_HOST
Value: 157.10.73.52
Envs:  Production, Preview, Development

# Variable 5
Name:  POSTGRES_PORT
Value: 5432
Envs:  Production, Preview, Development

# Variable 6
Name:  POSTGRES_USER
Value: admin
Envs:  Production, Preview, Development

# Variable 7
Name:  POSTGRES_PASSWORD
Value: P@ssw0rd
Envs:  Production, Preview, Development

# Variable 8
Name:  POSTGRES_DATABASE
Value: tarl_pratham
Envs:  Production, Preview, Development
```

#### Authentication

```bash
# Variable 9
Name:  NEXTAUTH_URL
Value: https://tarl.openplp.com
Envs:  Production only

# Variable 10
Name:  NEXTAUTH_SECRET
Value: 5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=
Envs:  Production, Preview, Development
```

#### Server Configuration

```bash
# Variable 11
Name:  NODE_ENV
Value: production
Envs:  Production only

# Variable 12
Name:  NEXT_PUBLIC_API_URL
Value: https://tarl.openplp.com/api
Envs:  Production only
```

#### File Upload & Session (Keep existing if present)

```bash
# Variable 13 (if not exists)
Name:  UPLOAD_DIR
Value: /uploads
Envs:  Production, Preview, Development

# Variable 14 (if not exists)
Name:  MAX_FILE_SIZE
Value: 5242880
Envs:  Production, Preview, Development

# Variable 15 (if not exists)
Name:  SESSION_TIMEOUT
Value: 86400000
Envs:  Production, Preview, Development

# Variable 16 (Keep existing BLOB_READ_WRITE_TOKEN)
Name:  BLOB_READ_WRITE_TOKEN
Value: (keep existing value)
Envs:  Production, Preview, Development
```

---

### Phase 3: Deploy

**Option A: Auto Deploy (Recommended)**
```bash
git add .
git commit -m "chore: Update to old server database connection"
git push origin main
```

**Option B: Manual Redeploy**
1. Go to Vercel Dashboard → Deployments
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait ~2 minutes

---

## ✅ Verification Steps

### 1. Check Deployment Status

**Go to:** Vercel Dashboard → Deployments

**Verify:**
- [ ] Latest deployment shows "Ready" (green checkmark)
- [ ] No build errors
- [ ] Deployment time: ~1-2 minutes

### 2. Test Database Connection

**Open:** https://tarl.openplp.com/api/verify-db

**Expected Response:**
```json
{
  "status": "connected",
  "database": "tarl_pratham",
  "host": "157.10.73.52",
  "tables": 30,
  "sample_data": {
    "users": 94,
    "schools": 37,
    "students": 137
  }
}
```

**If Error:**
```json
{
  "error": "Connection failed",
  "message": "..."
}
```
→ Check environment variables are set correctly

### 3. Test Application Pages

**Visit these URLs and verify they load:**

- [ ] https://tarl.openplp.com (Homepage)
- [ ] https://tarl.openplp.com/auth/login (Login page)
- [ ] https://tarl.openplp.com/api/pilot-schools (API - should return schools)
- [ ] https://tarl.openplp.com/dashboard (Dashboard - after login)

### 4. Test Authentication

- [ ] Can log in with existing user
- [ ] Can see user data
- [ ] Session persists after refresh

### 5. Test Database Operations

After logging in as admin:

- [ ] Can view schools list
- [ ] Can view students list
- [ ] Can view assessments
- [ ] Can create new assessment
- [ ] Data loads correctly

---

## 🔍 Troubleshooting

### Issue: "Connection timeout"

**Check:**
1. Is 157.10.73.52 accessible from internet?
2. Is PostgreSQL listening on 0.0.0.0?
3. Is port 5432 open in firewall?

**Test from your machine:**
```bash
psql -h 157.10.73.52 -U admin -d tarl_pratham
```

### Issue: "Environment variable not found"

**Solution:**
1. Check variable names are EXACT (case-sensitive)
2. Verify all environments are selected
3. Redeploy after adding variables

### Issue: "Authentication failed"

**Check:**
- [ ] `NEXTAUTH_URL` = `https://tarl.openplp.com` (no trailing slash)
- [ ] `NEXTAUTH_SECRET` is set correctly
- [ ] Clear browser cookies and try again

### Issue: "Invalid SSL mode"

**For old server without SSL:**
Ensure connection string includes: `?sslmode=disable`

---

## 📊 Final Checklist

### Environment Variables (16 total)

**Database (8 variables):**
- [ ] DATABASE_URL
- [ ] POSTGRES_PRISMA_URL
- [ ] POSTGRES_URL_NON_POOLING
- [ ] POSTGRES_HOST
- [ ] POSTGRES_PORT
- [ ] POSTGRES_USER
- [ ] POSTGRES_PASSWORD
- [ ] POSTGRES_DATABASE

**Auth (2 variables):**
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET

**Config (6 variables):**
- [ ] NODE_ENV
- [ ] NEXT_PUBLIC_API_URL
- [ ] UPLOAD_DIR
- [ ] MAX_FILE_SIZE
- [ ] SESSION_TIMEOUT
- [ ] BLOB_READ_WRITE_TOKEN

### Deployment
- [ ] Pushed to GitHub
- [ ] Vercel auto-deployed
- [ ] Deployment status: Ready
- [ ] No build errors

### Verification
- [ ] Database connection test passed
- [ ] Homepage loads
- [ ] Login works
- [ ] API endpoints respond
- [ ] Can view data

---

## ✅ Success Criteria

**You're done when:**
1. ✅ All 16 environment variables are set
2. ✅ Vercel deployment is successful
3. ✅ https://tarl.openplp.com loads
4. ✅ Can log in and see data
5. ✅ Data comes from 157.10.73.52

---

## 📞 Quick Commands

**Test database from terminal:**
```bash
psql -h 157.10.73.52 -U admin -d tarl_pratham -c "SELECT COUNT(*) FROM users;"
```

**Check Vercel deployment logs:**
```bash
vercel logs tarl.openplp.com
```

**Force redeploy:**
```bash
vercel --prod --force
```

---

**Migration Date:** 2025-01-10  
**Old Database:** Supabase  
**New Database:** 157.10.73.52 / tarl_pratham
