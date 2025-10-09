# Database Migration: Supabase → Old Server (157.10.73.52)

## ✅ Migration Completed: January 10, 2025

### Summary

Successfully migrated TaRL Pratham from Supabase to the old server database infrastructure.

---

## 📊 Database Details

### Old Server (Production)
```
Host:     157.10.73.52
Port:     5432
Database: tarl_pratham
User:     admin
```

### Current Data (as of migration)
- **Users:** 94
- **Pilot Schools:** 37
- **Students:** 137
- **Assessments:** 157
- **Mentoring Visits:** 0

---

## 📝 Changes Made

### 1. Environment Variables Updated

**Local Development (`.env`):**
```bash
DATABASE_URL="postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10"
```

**Backup Created:**
- Old Supabase config saved to: `.env.supabase.backup`

### 2. Prisma Client Regenerated
```bash
npm run db:generate  # ✅ Completed
```

### 3. Connection Tested
```bash
node scripts/test-db-connection.js  # ✅ Passed
```

---

## 🚀 Next Steps for Production Deployment

### Step 1: Update Vercel Environment Variables

Go to: [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

**Copy all variables from `.env.production.example`:**

| Variable Name | Value |
|---------------|-------|
| `DATABASE_URL` | `postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10` |
| `POSTGRES_PRISMA_URL` | `postgres://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham?sslmode=disable&connect_timeout=10` |
| `POSTGRES_URL_NON_POOLING` | Same as above |
| `POSTGRES_HOST` | `157.10.73.52` |
| `POSTGRES_PORT` | `5432` |
| `POSTGRES_USER` | `admin` |
| `POSTGRES_PASSWORD` | `P@ssw0rd` |
| `POSTGRES_DATABASE` | `tarl_pratham` |
| `NEXTAUTH_URL` | `https://tarl.openplp.com` |
| `NEXTAUTH_SECRET` | `5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=` |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_API_URL` | `https://tarl.openplp.com/api` |

**Apply to:** Production, Preview, and Development environments

### Step 2: Verify Vercel Can Access Database

**Important:** Ensure Vercel can reach `157.10.73.52:5432`

Check if firewall allows connections from Vercel IPs:
```bash
# On the server (157.10.73.52), check PostgreSQL config:
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Add this line if not exists:
host    tarl_pratham    admin           0.0.0.0/0               md5

# Reload PostgreSQL:
sudo systemctl reload postgresql
```

### Step 3: Deploy to Vercel

**Option A: Automatic (Push to Git)**
```bash
git add .
git commit -m "chore: Migrate database to old server"
git push origin main
```

**Option B: Manual (Vercel Dashboard)**
- Go to Deployments tab
- Click "Redeploy" on latest deployment
- Environment variables will be applied

### Step 4: Verify Production

1. Wait for deployment to complete (~2 minutes)
2. Go to: https://tarl.openplp.com
3. Try logging in
4. Check if data loads correctly

---

## ⚠️ Important Security Notes

### Database Security
- [ ] Database is accessible from internet (0.0.0.0)
- [ ] Consider setting up VPN or IP whitelist for production
- [ ] Current setup: Password authentication only

### Recommended Next Steps
1. **Set up SSL/TLS** for database connections
2. **Restrict access** to specific Vercel IPs only
3. **Enable database backups** on 157.10.73.52
4. **Monitor connection pool** usage

---

## 🔄 Rollback Plan (If Needed)

If you need to revert to Supabase:

```bash
# 1. Restore Supabase configuration
cp .env.supabase.backup .env

# 2. Regenerate Prisma client
npm run db:generate

# 3. Update Vercel env vars back to Supabase URLs
# (Copy from .env.supabase.backup)

# 4. Redeploy
git push origin main
```

---

## 📁 Files Created/Modified

### Created:
- `.env.production.example` - Production environment template
- `docs/DATABASE_MIGRATION.md` - This documentation
- `scripts/test-db-connection.js` - Database connection test
- `scripts/migrate-to-old-server.sh` - Migration script (for future reference)

### Modified:
- `.env` - Updated to use old server
- `node_modules/@prisma/client` - Regenerated with new connection

### Backed Up:
- `.env.supabase.backup` - Original Supabase configuration

---

## 🧪 Testing Checklist

Before going live, test these features:

- [ ] User login/authentication
- [ ] School data loading
- [ ] Student data loading
- [ ] Assessment creation/editing
- [ ] File uploads
- [ ] Reports generation
- [ ] Assessment periods page (bulk update feature)

---

## 📞 Troubleshooting

### Issue: "Connection timeout"
**Solution:** Check if 157.10.73.52 PostgreSQL is running and accessible
```bash
psql -h 157.10.73.52 -p 5432 -U admin -d tarl_pratham
```

### Issue: "SSL connection error"
**Solution:** Database uses `sslmode=disable` - this is expected for private server

### Issue: "Max connections reached"
**Solution:** Check PostgreSQL max_connections setting
```bash
# On server:
sudo -u postgres psql -c "SHOW max_connections;"
```

---

## 📊 Database Maintenance

### Backup Command
```bash
pg_dump -h 157.10.73.52 -U admin -d tarl_pratham > backup_$(date +%Y%m%d).sql
```

### Restore Command
```bash
psql -h 157.10.73.52 -U admin -d tarl_pratham < backup_YYYYMMDD.sql
```

---

## 🎉 Migration Complete!

The database has been successfully migrated from Supabase to the old server (157.10.73.52).

**Status:** ✅ Local development ready  
**Next:** Update Vercel environment variables and deploy

