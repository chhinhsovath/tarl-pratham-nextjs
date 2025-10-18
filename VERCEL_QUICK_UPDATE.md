# 🚀 Vercel Quick Update - 5 Minute Guide

**New Database Server:** 157.10.73.82
**Old Database Server:** 157.10.73.52 (backup)

---

## ⚡ Quick Steps (5 minutes)

### 1. Open Vercel Dashboard
👉 https://vercel.com/dashboard

### 2. Go to Settings → Environment Variables

### 3. Update These 4 Variables:

Just change `157.10.73.52` → `157.10.73.82` in each:

**DATABASE_URL** - Edit and change to:
```
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
```

**POSTGRES_PRISMA_URL** - Edit and change to:
```
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10
```

**POSTGRES_URL_NON_POOLING** - Edit and change to:
```
postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10
```

**POSTGRES_HOST** - Edit and change to:
```
157.10.73.82
```

### 4. Redeploy
- Go to **Deployments** tab
- Click **"Redeploy"** on latest deployment
- Wait 2-3 minutes

### 5. Test
- Visit https://tarl.openplp.com
- Login and verify data loads

---

## ✅ Done!

Your Vercel app is now connected to the new server!

---

## 📄 Detailed Guides Available:

- **VERCEL_ENV_VARS.txt** - Copy-paste reference
- **VERCEL_UPDATE_GUIDE.md** - Detailed step-by-step guide
- **MIGRATION_SUCCESS_SUMMARY.md** - Complete migration summary

---

## 🆘 Need Help?

See **VERCEL_UPDATE_GUIDE.md** for troubleshooting.
