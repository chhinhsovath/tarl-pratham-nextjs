# Vercel Environment Variables Update Guide

**Update Date:** 2025-10-18
**Change:** Database server migration from 157.10.73.52 → 157.10.73.82
**Project:** TaRL Pratham (tarl.openplp.com)

---

## 🎯 What Needs to be Updated

You need to update **6 environment variables** in Vercel to point to the new database server.

---

## 📋 New Environment Variables for Vercel

### Copy these exact values:

```
DATABASE_URL
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

POSTGRES_PRISMA_URL
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

POSTGRES_URL_NON_POOLING
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10

POSTGRES_HOST
157.10.73.82

POSTGRES_PORT
5432

POSTGRES_USER
admin

POSTGRES_PASSWORD
P@ssw0rd

POSTGRES_DATABASE
tarl_pratham
```

---

## 🚀 Step-by-Step Update Instructions

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Login to Vercel
1. Go to https://vercel.com/login
2. Login with your account

#### Step 2: Select Your Project
1. Go to https://vercel.com/dashboard
2. Click on **"tarl-pratham-nextjs"** project (or your project name)

#### Step 3: Open Environment Variables
1. Click **Settings** in the top navigation
2. Click **Environment Variables** in the left sidebar

#### Step 4: Update Each Variable

**For each variable below, do this:**

1. Find the variable name in the list
2. Click the **"⋯"** (three dots) menu on the right
3. Click **"Edit"**
4. Replace the old value with the new value (from the list above)
5. Make sure it's checked for: **Production**, **Preview**, **Development**
6. Click **"Save"**

**Variables to update:**
- [ ] `DATABASE_URL` → Change `157.10.73.52` to `157.10.73.82`
- [ ] `POSTGRES_PRISMA_URL` → Change `157.10.73.52` to `157.10.73.82`
- [ ] `POSTGRES_URL_NON_POOLING` → Change `157.10.73.52` to `157.10.73.82`
- [ ] `POSTGRES_HOST` → Change to `157.10.73.82`
- [ ] `POSTGRES_PORT` → Keep as `5432`
- [ ] `POSTGRES_USER` → Keep as `admin`
- [ ] `POSTGRES_PASSWORD` → Keep as `P@ssw0rd`
- [ ] `POSTGRES_DATABASE` → Keep as `tarl_pratham`

#### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **"⋯"** menu → **"Redeploy"**
4. Check **"Use existing Build Cache"** (optional, faster)
5. Click **"Redeploy"**

---

### Method 2: Vercel CLI (Advanced)

If you have Vercel CLI installed:

```bash
# Login to Vercel
vercel login

# Link to your project (if not already linked)
vercel link

# Remove old environment variables
vercel env rm DATABASE_URL production
vercel env rm POSTGRES_PRISMA_URL production
vercel env rm POSTGRES_URL_NON_POOLING production
vercel env rm POSTGRES_HOST production

# Add new environment variables
vercel env add DATABASE_URL production
# Paste: postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

vercel env add POSTGRES_PRISMA_URL production
# Paste: postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

vercel env add POSTGRES_URL_NON_POOLING production
# Paste: postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10

vercel env add POSTGRES_HOST production
# Enter: 157.10.73.82

# Deploy to production
vercel --prod
```

---

## ✅ Verification Steps

### 1. Check Deployment Status

1. Go to **Deployments** tab in Vercel
2. Wait for deployment to complete (usually 2-3 minutes)
3. Look for **"Ready"** status with green checkmark

### 2. Test Your Live Site

1. Visit: https://tarl.openplp.com
2. Try logging in
3. Check if data loads:
   - Users list
   - Schools list
   - Students list
   - Assessments

### 3. Check Function Logs

1. In Vercel, go to **Deployments** → Latest deployment
2. Click **"View Function Logs"**
3. Look for database connection messages
4. Should see connections to `157.10.73.82` (not `157.10.73.52`)

### 4. Test API Endpoints

Visit these URLs to verify:
- https://tarl.openplp.com/api/users
- https://tarl.openplp.com/api/pilot-schools
- https://tarl.openplp.com/api/students

All should return data successfully.

---

## 🔧 Important Settings Notes

### Connection Limit = 1 for Vercel

**Why?** Vercel is serverless - each function instance creates connections. Setting `connection_limit=1` prevents exhausting the database connection pool.

```
connection_limit=1  ← Critical for Vercel serverless
pool_timeout=10     ← Releases idle connections quickly
connect_timeout=10  ← Fails fast if database unreachable
```

**Do NOT remove these parameters!** They prevent the connection exhaustion errors you experienced before.

### SSL Mode Disabled

```
sslmode=disable
```

This is OK because:
- Your VPS server is on a private network
- You control the server
- SSL adds overhead without security benefit in this case

If you want to enable SSL later, see: `DATABASE_MIGRATION_GUIDE.md`

---

## 🐛 Troubleshooting

### Problem: Deployment fails with database connection error

**Solution 1:** Check if new server is accessible
```bash
# From your local machine
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT 1;"
```

**Solution 2:** Verify firewall on new server
```bash
# SSH into new server
ssh ubuntu@157.10.73.82

# Check firewall
sudo ufw status | grep 5432

# Should show:
# 5432/tcp    ALLOW       Anywhere
```

**Solution 3:** Restart PostgreSQL on new server
```bash
# On new server
sudo systemctl restart postgresql
sudo systemctl status postgresql
```

---

### Problem: Old data showing instead of new data

**Check:** Make sure you saved ALL environment variables and redeployed.

**Verify:** Check function logs to see which server it's connecting to.

---

### Problem: "Too many connections" error

**This means:** Connection limit settings not working.

**Fix:** Double-check that your `DATABASE_URL` includes:
```
connection_limit=1&pool_timeout=10
```

---

## 📊 Before/After Comparison

### Before Migration
```
Old Server: 157.10.73.52
DATABASE_URL: postgres://admin:P@ssw0rd@157.10.73.52:5432/...
```

### After Migration ✅
```
New Server: 157.10.73.82
DATABASE_URL: postgres://admin:P@ssw0rd@157.10.73.82:5432/...
```

**Data:**
- 96 users ✅
- 45 pilot schools ✅
- 290 students ✅
- 434 assessments ✅

All data migrated successfully!

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong with the new server, you can rollback:

### Quick Rollback:

1. In Vercel Environment Variables, change:
   - `POSTGRES_HOST` → `157.10.73.52` (old server)
   - `DATABASE_URL` → Update to use `157.10.73.52`
   - `POSTGRES_PRISMA_URL` → Update to use `157.10.73.52`
   - `POSTGRES_URL_NON_POOLING` → Update to use `157.10.73.52`

2. Redeploy

The old server (157.10.73.52) is still running with all your data as a backup!

---

## 📱 Testing Checklist

After updating Vercel, test these features:

- [ ] Login functionality
- [ ] Dashboard loads
- [ ] User list displays (96 users)
- [ ] School list displays (45 schools)
- [ ] Student list displays (290 students)
- [ ] Assessment list displays (434 assessments)
- [ ] Create new record works
- [ ] Edit record works
- [ ] Delete record works
- [ ] Search functionality works
- [ ] Reports generate correctly

---

## 🎊 Success Criteria

You'll know the update was successful when:

1. ✅ Deployment completes without errors
2. ✅ Website loads at https://tarl.openplp.com
3. ✅ All data displays correctly
4. ✅ No "connection" errors in logs
5. ✅ Function logs show `157.10.73.82` connections

---

## 📞 Support

If you encounter issues:

1. **Check this guide's Troubleshooting section** ↑
2. **Review Vercel function logs** for error messages
3. **Test database connection** from your local machine
4. **Verify firewall settings** on new server (port 5432 open)

---

## 📝 Quick Reference Card

**Print this and keep handy:**

```
┌─────────────────────────────────────────────┐
│  TaRL Pratham - Production Database         │
├─────────────────────────────────────────────┤
│  Server IP:   157.10.73.82                  │
│  Port:        5432                          │
│  Database:    tarl_pratham                  │
│  Username:    admin                         │
│  Password:    P@ssw0rd                      │
│  SSL:         Disabled                      │
│  Conn Limit:  1 (for Vercel)                │
├─────────────────────────────────────────────┤
│  Live Site:   https://tarl.openplp.com      │
│  Vercel:      https://vercel.com/dashboard  │
└─────────────────────────────────────────────┘
```

---

**Update Date:** 2025-10-18
**Status:** Ready to deploy
**Backup Server:** 157.10.73.52 (still available)
**New Server:** 157.10.73.82 (active)

---

## 🚀 Ready to Update?

**Estimated Time:** 5-10 minutes

Follow **Method 1** (Vercel Dashboard) above, step by step.

Good luck! 🎉
