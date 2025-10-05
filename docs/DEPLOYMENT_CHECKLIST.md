# 🚀 Deployment Checklist - Assessment Form Updates

## ✅ Changes Committed (Ready for Production)

### Commits Pushed to GitHub:
1. **4c73775** - Redesign assessment edit form with card-based layout
2. **6c960b0** - Update note.md with assessment level reference
3. **f32676e** - Update assessment sample labels to Khmer
4. **006fce8** - Fix display of proper Khmer labels for all levels

---

## 📋 What's Been Updated

### 1. Assessment Edit Form (/assessments/[id]/edit)
**Status**: ✅ Redesigned to match create form

**Changes**:
- ✅ Card-based layout (like screenshot)
- ✅ Icons: 📚 BookOutlined, 🏆 TrophyOutlined
- ✅ 2-column responsive grid
- ✅ Dynamic levels (7 language, 6 math)
- ✅ Helper text showing level counts
- ✅ Character counter (0/500)

### 2. Assessment Detail Page (/assessments/[id])
**Status**: ✅ Fixed Khmer label display

**Changes**:
- ✅ Shows "លេខ២ខ្ទង" instead of "number_2digit"
- ✅ All 13 levels display correctly in Khmer
- ✅ Uses shared constants for consistency

### 3. Assessment Samples
**Status**: ✅ Updated to Khmer

**Changes**:
- ✅ "Sample 1" → "ឧបករណ៍តេស្ត លេខ១"
- ✅ "Sample 2" → "ឧបករណ៍តេស្ត លេខ២"
- ✅ "Sample 3" → "ឧបករណ៍តេស្ត លេខ៣"

---

## 🌐 To See Updates on tarl.openplp.com

### Option A: Auto-Deploy (Recommended)
If you use **Vercel** or **Netlify**:

```bash
# Check deployment status
# Visit your hosting dashboard
# Wait 2-5 minutes for auto-deploy
```

### Option B: Manual Deploy (VPS/Server)

```bash
# 1. SSH to your production server
ssh user@your-server-ip

# 2. Navigate to project directory
cd /path/to/tarl-pratham-nextjs

# 3. Pull latest changes
git pull origin main

# 4. Install dependencies (if needed)
npm install

# 5. Build the project
npm run build

# 6. Restart the application
# Using PM2:
pm2 restart tarl-pratham

# Using systemd:
sudo systemctl restart tarl-pratham

# Using Docker:
docker-compose down && docker-compose up -d --build
```

### Option C: Vercel CLI (If using Vercel)

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to production
vercel --prod
```

---

## ✅ Verification Steps (After Deployment)

### 1. Clear Browser Cache
```
Chrome/Edge: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
Firefox: Ctrl + F5 (Windows) / Cmd + Shift + R (Mac)
```

### 2. Test Assessment Edit Page
**URL**: `https://tarl.openplp.com/assessments/20/edit`

**What to verify**:
- [ ] Card-based layout visible
- [ ] Icons showing (📚 header, 🏆 level)
- [ ] 2-column layout (Type + Subject side-by-side)
- [ ] Helper text: "7 កម្រិតសម្រាប់ភាសាខ្មែរ" when language selected
- [ ] Character counter: "0 / 500" on notes field
- [ ] Sample dropdown shows: "ឧបករណ៍តេស្ត លេខ១, លេខ២, លេខ៣"

### 3. Test Assessment Detail Page
**URL**: `https://tarl.openplp.com/assessments/20`

**What to verify**:
- [ ] Level shows Khmer label (e.g., "លេខ២ខ្ទង" not "number_2digit")
- [ ] Subject shows "ភាសាខ្មែរ" or "គណិតវិទ្យា"
- [ ] Assessment type shows "តេស្តដើមគ្រា" etc.

### 4. Test Create Form
**URL**: `https://tarl.openplp.com/assessments/create?student_id=25`

**What to verify**:
- [ ] Sample dropdown shows: "ឧបករណ៍តេស្ត លេខ១, លេខ២, លេខ៣"
- [ ] All levels display in Khmer

---

## 📊 Level Display Reference

### ភាសាខ្មែរ (Language) - 7 Levels
1. កម្រិតដំបូង (beginner)
2. តួអក្សរ (letter)
3. ពាក្យ (word)
4. កថាខណ្ឌ (paragraph)
5. រឿង (story)
6. យល់ន័យ១ (comprehension1)
7. យល់ន័យ២ (comprehension2)

### គណិតវិទ្យា (Math) - 6 Levels
1. កម្រិតដំបូង (beginner)
2. លេខ១ខ្ទង (number_1digit)
3. លេខ២ខ្ទង (number_2digit)
4. ប្រមាណវិធីដក (subtraction)
5. ប្រមាណវិធីចែក (division)
6. ចំណោទ (word_problems)

---

## 🔧 Troubleshooting

### Issue: Changes not visible after deployment
**Solution**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache completely
3. Try incognito/private window
4. Check deployment logs for errors

### Issue: "number_2digit" still showing
**Solution**:
1. Verify deployment completed successfully
2. Check if correct commit deployed (006fce8)
3. Restart server/application
4. Clear CDN cache if using one

### Issue: Edit form not showing cards
**Solution**:
1. Check browser console for errors
2. Verify commit 4c73775 is deployed
3. Ensure build completed successfully
4. Check if CSS is loading properly

---

## 📝 Files Changed Summary

### Modified Files:
- `app/assessments/[id]/edit/page.tsx` - Edit form redesign
- `app/assessments/[id]/page.tsx` - Detail page label fix
- `components/wizards/AssessmentWizard.tsx` - Sample labels
- `components/wizards/steps/AssessmentDetailsStep.tsx` - Sample labels

### Documentation Added:
- `docs/ASSESSMENT_EDIT_FORM_UPDATE.md`
- `docs/ASSESSMENT_EDIT_LAYOUT_COMPARISON.md`
- `docs/DEPLOYMENT_CHECKLIST.md` (this file)

---

## 🎯 Expected Results

### Before Deployment:
❌ Edit form: Plain vertical layout
❌ Detail page: Shows "number_2digit"
❌ Samples: Shows "Sample 1"

### After Deployment:
✅ Edit form: Beautiful card-based layout matching create form
✅ Detail page: Shows "លេខ២ខ្ទង"
✅ Samples: Shows "ឧបករណ៍តេស្ត លេខ១"

---

## 🚀 Quick Deploy Commands

### For PM2:
```bash
ssh user@server
cd /path/to/project
git pull
npm run build
pm2 restart tarl-pratham
```

### For Systemd:
```bash
ssh user@server
cd /path/to/project
git pull
npm run build
sudo systemctl restart tarl-pratham
```

### For Docker:
```bash
ssh user@server
cd /path/to/project
git pull
docker-compose down
docker-compose up -d --build
```

---

**Status**: ✅ All code committed and pushed to GitHub `main` branch
**Next Step**: 🚀 Deploy to production server
**Verification**: Visit the URLs above after deployment

**Questions?** Check the troubleshooting section or review commit messages for details.
