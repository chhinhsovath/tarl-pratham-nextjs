# ⚡ Vercel Dashboard Update - Simple 5-Minute Guide

**Task:** Update database connection to new server (157.10.73.82)

---

## 🚀 Quick Steps

### Step 1: Login to Vercel
👉 Go to: **https://vercel.com/login**

Login with your account.

---

### Step 2: Find Your Project
1. After login, you'll see your dashboard
2. Find and click on: **"tarl-pratham-nextjs"** (or your project name)

---

### Step 3: Go to Environment Variables
1. Click **"Settings"** at the top
2. In the left sidebar, click **"Environment Variables"**

---

### Step 4: Update These 4 Variables

**You need to update 4 variables. For each one:**

#### Variable 1: DATABASE_URL

1. Find `DATABASE_URL` in the list
2. Click the **"⋯"** (three dots) on the right
3. Click **"Edit"**
4. **Replace the entire value** with:
   ```
   postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
   ```
5. Make sure these are checked: ✅ Production ✅ Preview ✅ Development
6. Click **"Save"**

---

#### Variable 2: POSTGRES_PRISMA_URL

1. Find `POSTGRES_PRISMA_URL` in the list
2. Click **"⋯"** → **"Edit"**
3. **Replace the entire value** with:
   ```
   postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
   ```
4. Check: ✅ Production ✅ Preview ✅ Development
5. Click **"Save"**

---

#### Variable 3: POSTGRES_URL_NON_POOLING

1. Find `POSTGRES_URL_NON_POOLING` in the list
2. Click **"⋯"** → **"Edit"**
3. **Replace the entire value** with:
   ```
   postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10
   ```
4. Check: ✅ Production ✅ Preview ✅ Development
5. Click **"Save"**

---

#### Variable 4: POSTGRES_HOST

1. Find `POSTGRES_HOST` in the list
2. Click **"⋯"** → **"Edit"**
3. **Replace the value** with:
   ```
   157.10.73.82
   ```
4. Check: ✅ Production ✅ Preview ✅ Development
5. Click **"Save"**

---

### Step 5: Redeploy

1. Click **"Deployments"** at the top
2. Find the most recent deployment (top of the list)
3. Click the **"⋯"** (three dots) on the right
4. Click **"Redeploy"**
5. In the popup:
   - ✅ Check "Use existing Build Cache" (optional, makes it faster)
   - Click **"Redeploy"**
6. **Wait 2-3 minutes** for deployment to complete
7. Look for **"Ready"** status with green checkmark ✅

---

### Step 6: Test Your Site

1. Visit: **https://tarl.openplp.com**
2. Try logging in
3. Check if data loads:
   - Users list
   - Schools list
   - Students list

**If everything works:** ✅ **You're done!**

---

## 📋 Copy-Paste Values (For Easy Reference)

```
DATABASE_URL:
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

POSTGRES_PRISMA_URL:
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10

POSTGRES_URL_NON_POOLING:
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10

POSTGRES_HOST:
157.10.73.82
```

---

## ✅ Checklist

- [ ] Logged into Vercel
- [ ] Found my project
- [ ] Opened Settings → Environment Variables
- [ ] Updated `DATABASE_URL`
- [ ] Updated `POSTGRES_PRISMA_URL`
- [ ] Updated `POSTGRES_URL_NON_POOLING`
- [ ] Updated `POSTGRES_HOST`
- [ ] Clicked "Redeploy"
- [ ] Waited for deployment to complete
- [ ] Tested https://tarl.openplp.com
- [ ] Verified data loads correctly

---

## 🆘 Troubleshooting

### "I don't see these variables"

**Solution:** Create them as new variables:
1. Click **"Add New"**
2. Enter the variable name (e.g., `DATABASE_URL`)
3. Enter the value
4. Select: Production, Preview, Development
5. Click **"Save"**

### "Deployment failed"

**Solution:** Check deployment logs:
1. Go to Deployments
2. Click on the failed deployment
3. Look for error messages
4. Usually connection errors - verify the values are correct

### "Site loads but no data"

**Solution:** Check you saved ALL 4 variables and redeployed

---

## 🎉 Done!

Your Vercel application is now connected to the new database server (157.10.73.82)!

**Total Time:** ~5 minutes

---

**Need help?** Check the full guide: `VERCEL_UPDATE_GUIDE.md`
