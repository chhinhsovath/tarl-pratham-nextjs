#!/bin/bash

# Script to update all pages from DashboardLayout to HorizontalLayout

echo "🔄 Updating all pages to use HorizontalLayout..."

# List of files to update
files=(
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/verify/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/manage/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring-visits/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring-visits/[id]/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring-visits/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring-visits/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/profile/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/teacher/dashboard/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/reports/intervention/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/reports/dashboard/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/reports/assessment-analysis/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring/[id]/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/mentoring/create/page.tsx"
)

# Update each file
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Updating: $(basename $file)"
    
    # Replace DashboardLayout import with HorizontalLayout
    sed -i '' "s|import DashboardLayout from '@/components/layout/DashboardLayout'|import HorizontalLayout from '@/components/layout/HorizontalLayout'|g" "$file"
    
    # Replace <DashboardLayout> with <HorizontalLayout>
    sed -i '' 's|<DashboardLayout|<HorizontalLayout|g' "$file"
    sed -i '' 's|</DashboardLayout>|</HorizontalLayout>|g' "$file"
    
    echo "   ✅ Done"
  else
    echo "   ⚠️ File not found: $file"
  fi
done

echo ""
echo "✅ All files updated successfully!"
echo "🔍 Verifying changes..."
echo ""

# Verify no DashboardLayout remains
remaining=$(grep -r "DashboardLayout" /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app --include="*.tsx" -l | wc -l)

if [ "$remaining" -eq "0" ]; then
  echo "✅ Success! No files using DashboardLayout anymore."
else
  echo "⚠️ Warning: $remaining files still using DashboardLayout"
  grep -r "DashboardLayout" /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app --include="*.tsx" -l
fi