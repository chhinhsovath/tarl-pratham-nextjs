#!/bin/bash

echo "🔧 Batch updating all pages with HorizontalLayout to fix overflow..."

# Array of files to update
files=(
  "settings/page.tsx"
  "assessments/periods/page.tsx"
  "assessments/data-entry/page.tsx"
  "assessments/verify/page.tsx"
  "assessments/manage/page.tsx"
  "assessments/page.tsx"
  "assessments/create/page.tsx"
  "assessments/select-students/page.tsx"
  "test-roles/page.tsx"
  "coordinator/imports/page.tsx"
  "coordinator/page.tsx"
  "resources/page.tsx"
  "mentoring-visits/[id]/edit/page.tsx"
  "mentoring-visits/[id]/page.tsx"
  "mentoring-visits/page.tsx"
  "mentoring-visits/create/page.tsx"
  "dashboard/page.tsx"
  "students/bulk-import/page.tsx"
  "students/[id]/edit/page.tsx"
  "students/[id]/page.tsx"
  "students/page.tsx"
  "students/create/page.tsx"
  "verification/page.tsx"
  "profile/page.tsx"
  "users/[id]/edit/page.tsx"
  "users/page.tsx"
  "users/create/page.tsx"
  "administration/page.tsx"
  "schools/[id]/teachers/page.tsx"
  "schools/[id]/students/page.tsx"
  "schools/page.tsx"
  "teacher/dashboard/page.tsx"
  "help/page.tsx"
  "reports/intervention/page.tsx"
  "reports/dashboard/page.tsx"
  "reports/assessment-analysis/page.tsx"
  "reports/page.tsx"
  "mentoring/[id]/edit/page.tsx"
  "mentoring/[id]/page.tsx"
  "mentoring/page.tsx"
  "mentoring/create/page.tsx"
)

APP_DIR="/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app"

for file in "${files[@]}"; do
  FILE_PATH="$APP_DIR/$file"
  
  if [ -f "$FILE_PATH" ]; then
    echo "📝 Processing: $file"
    
    # First, check if the file already has the overflow fix
    if grep -q "max-w-full overflow-x-hidden" "$FILE_PATH"; then
      echo "   ✅ Already fixed"
    else
      # Replace common patterns that cause overflow
      
      # Pattern 1: <div className="w-full"> at the start of content
      sed -i '' 's/<div className="w-full">/<div className="max-w-full overflow-x-hidden">/g' "$FILE_PATH"
      
      # Pattern 2: className="w-full" with other classes
      sed -i '' 's/className="w-full\([^"]*\)"/className="max-w-full overflow-x-hidden\1"/g' "$FILE_PATH"
      
      # Pattern 3: Just w-full in className
      sed -i '' 's/className="\([^"]*\)w-full\([^"]*\)"/className="\1max-w-full overflow-x-hidden\2"/g' "$FILE_PATH"
      
      echo "   ✅ Updated"
    fi
    
    # Check for Tables and add scroll prop if needed
    if grep -q "<Table" "$FILE_PATH"; then
      # Check if Table already has scroll prop
      if ! grep -q 'scroll={{' "$FILE_PATH"; then
        echo "   📊 Adding table scroll..."
        # Add scroll={{ x: "max-content" }} to Table components
        sed -i '' 's/<Table$/<Table scroll={{ x: "max-content" }}/g' "$FILE_PATH"
        sed -i '' 's/<Table \([^>]*\)>/<Table scroll={{ x: "max-content" }} \1>/g' "$FILE_PATH"
        echo "   ✅ Table scroll added"
      fi
    fi
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "✅ Batch update completed!"
echo "📌 Please review the changes and test each page"