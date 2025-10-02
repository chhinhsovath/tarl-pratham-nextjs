# TaRL Pratham Next.js - Production Deployment Guide

## 🚀 Quick Deployment Checklist

After pulling latest changes, run these commands on your production server:

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies (auto-runs prisma generate via postinstall)
npm install

# 3. Build the application (also runs prisma generate)
npm run build

# 4. Restart the application
pm2 restart all
# OR if using systemd:
# sudo systemctl restart tarl-pratham
```

## 📋 Detailed Deployment Steps

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running (157.10.73.52:5432)
- PM2 or similar process manager
- Git configured with repository access

### Step 1: Backup Current Deployment
```bash
# Create backup of current build
cp -r .next .next.backup-$(date +%Y%m%d-%H%M%S)

# Optional: Backup database
pg_dump -h 157.10.73.52 -U admin -d tarl_pratham > backup_$(date +%Y%m%d).sql
```

### Step 2: Pull Latest Changes
```bash
cd /path/to/tarl-pratham-nextjs
git fetch origin
git pull origin main
```

### Step 3: Install Dependencies
```bash
# This will auto-run prisma generate (defined in postinstall script)
npm install

# Verify Prisma client is generated
ls -la node_modules/.prisma/client/
```

### Step 4: Database Migrations (if schema changed)
```bash
# Check for schema changes
git diff HEAD~1 prisma/schema.prisma

# If schema changed, push to database
npx prisma db push

# Or if you want to create a migration
npx prisma migrate deploy
```

### Step 5: Build Application
```bash
# Build runs prisma generate automatically
npm run build

# Verify build succeeded
ls -la .next/
```

### Step 6: Restart Application
```bash
# If using PM2:
pm2 restart tarl-pratham
pm2 logs tarl-pratham --lines 50

# If using systemd:
sudo systemctl restart tarl-pratham
sudo journalctl -u tarl-pratham -f

# If using direct node:
# Kill old process
pkill -f "next start"
# Start new process
npm run start &
```

### Step 7: Verify Deployment
```bash
# Check if app is running
pm2 list
# OR
curl http://localhost:3000/api/health

# Check logs for errors
pm2 logs --lines 100
# OR
tail -f logs/application.log
```

## 🔧 Environment Configuration

### Required Environment Variables (.env.local)
```bash
# Database
DATABASE_URL="postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham"

# NextAuth
NEXTAUTH_URL="https://tarl.openplp.com"
NEXTAUTH_SECRET="your-secret-here"

# Node Environment
NODE_ENV="production"
```

## 🐛 Troubleshooting

### Issue: "Unknown argument" errors from Prisma
**Cause:** Prisma client not regenerated after schema changes

**Solution:**
```bash
npx prisma generate
npm run build
pm2 restart all
```

### Issue: Profile setup fails with 500 error
**Cause:** quick_login_users table missing columns

**Solution:**
```bash
# Push schema changes to database
npx prisma db push

# Verify columns exist
psql -h 157.10.73.52 -U admin -d tarl_pratham -c "\\d quick_login_users"

# Regenerate Prisma client
npx prisma generate

# Rebuild and restart
npm run build && pm2 restart all
```

### Issue: Mock data still showing in teacher dashboard
**Cause:** Old build cached or Prisma client outdated

**Solution:**
```bash
# Clear build cache
rm -rf .next

# Regenerate and rebuild
npx prisma generate
npm run build
pm2 restart all
```

### Issue: Login redirects but page doesn't load
**Cause:** Middleware/auth issues or session not established

**Solution:**
```bash
# Check logs for JWT errors
pm2 logs tarl-pratham --err

# Verify session secret is set
echo $NEXTAUTH_SECRET

# Restart with fresh session
pm2 restart tarl-pratham --update-env
```

## 📊 Health Checks

### Application Health
```bash
# Check if Next.js is running
curl http://localhost:3000

# Check API health
curl http://localhost:3000/api/health

# Check database connection
psql -h 157.10.73.52 -U admin -d tarl_pratham -c "SELECT 1"
```

### Performance Monitoring
```bash
# PM2 monitoring
pm2 monit

# Check memory usage
pm2 show tarl-pratham

# View error logs
pm2 logs tarl-pratham --err --lines 50
```

## 🔄 Rollback Procedure

If deployment fails, rollback to previous version:

```bash
# 1. Checkout previous commit
git log --oneline -5  # Find previous commit hash
git checkout <previous-commit-hash>

# 2. Reinstall dependencies
npm install

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart all

# 5. Verify
curl http://localhost:3000
```

## 📝 Post-Deployment Verification

After deployment, verify these critical flows:

### ✅ Authentication
- [ ] Quick login works (chan.kimsrorn.kam / admin123)
- [ ] Regular email login works
- [ ] Session persists after login
- [ ] Redirects to correct dashboard

### ✅ Profile Setup
- [ ] Can select school from dropdown
- [ ] Can save profile (subject, classes)
- [ ] Profile data persists in database
- [ ] Redirects to onboarding after save

### ✅ Student Management
- [ ] Can create student (auto-linked to teacher's school)
- [ ] Can view student list (real data, not mock)
- [ ] Can edit student
- [ ] Can delete student

### ✅ Dashboard
- [ ] Teacher dashboard shows real student count
- [ ] Assessment stats are accurate
- [ ] No mock Khmer names showing
- [ ] Performance charts show real data

## 🔐 Security Notes

- Never commit .env files to git
- Rotate NEXTAUTH_SECRET regularly
- Keep database credentials secure
- Use HTTPS in production (NEXTAUTH_URL)
- Enable rate limiting for API routes

## 📞 Support Contacts

- **Repository:** https://github.com/chhinhsovath/tarl-pratham-nextjs
- **Issues:** https://github.com/chhinhsovath/tarl-pratham-nextjs/issues
- **Database Admin:** admin@157.10.73.52:5432

---

**Last Updated:** 2025-10-02
**Version:** 2.0.0 (Quick Login User Support + Real Data)
