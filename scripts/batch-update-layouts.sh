#!/bin/bash

# Batch update all pages that need HorizontalLayout

echo "🔄 Batch updating pages to use HorizontalLayout..."

# Function to update a file
update_file() {
  local file=$1
  local filename=$(basename "$file")
  local dirname=$(basename $(dirname "$file"))
  
  echo "📝 Processing: $dirname/$filename"
  
  # Check if already has HorizontalLayout
  if grep -q "HorizontalLayout" "$file"; then
    echo "   ✓ Already has HorizontalLayout"
    return
  fi
  
  # Add import after 'use client' or at beginning
  if grep -q "'use client'" "$file"; then
    sed -i '' "/'use client'/a\\
import HorizontalLayout from '@/components/layout/HorizontalLayout';" "$file"
  elif grep -q '"use client"' "$file"; then
    sed -i '' '/"use client"/a\\
import HorizontalLayout from "@/components/layout/HorizontalLayout";' "$file"
  else
    # No use client, add both
    sed -i '' '1i\
"use client";\
import HorizontalLayout from "@/components/layout/HorizontalLayout";\
' "$file"
  fi
  
  # Find export default function and rename it
  if grep -q "^export default function" "$file"; then
    # Get the function name
    func_name=$(grep "^export default function" "$file" | sed 's/export default function \([^(]*\).*/\1/')
    content_func="${func_name}Content"
    
    # Rename the function
    sed -i '' "s/^export default function $func_name/function $content_func/" "$file"
    
    # Add new export at the end
    echo "" >> "$file"
    echo "export default function $func_name() {" >> "$file"
    echo "  return (" >> "$file"
    echo "    <HorizontalLayout>" >> "$file"
    echo "      <$content_func />" >> "$file"
    echo "    </HorizontalLayout>" >> "$file"
    echo "  );" >> "$file"
    echo "}" >> "$file"
    
    echo "   ✅ Updated successfully"
  else
    echo "   ⚠️ Manual update needed (complex structure)"
  fi
}

# List of files to update
files=(
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/resources/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/administration/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/bulk-import/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/select-students/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/data-entry/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/periods/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/coordinator/imports/page.tsx"
)

# Dynamic pages need special handling
dynamic_files=(
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/[id]/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/[id]/students/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/[id]/teachers/page.tsx"
)

echo ""
echo "📦 Processing regular pages..."
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    update_file "$file"
  fi
done

echo ""
echo "📦 Processing dynamic route pages..."
for file in "${dynamic_files[@]}"; do
  if [ -f "$file" ]; then
    update_file "$file"
  fi
done

echo ""
echo "✅ Batch update complete!"
echo ""
echo "🔍 Verifying remaining pages without HorizontalLayout..."
remaining=$(find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "page.tsx" -type f | while read file; do 
  # Skip auth, profile-setup, onboarding, unauthorized, and root page
  if [[ ! "$file" =~ "auth/" ]] && \
     [[ ! "$file" =~ "profile-setup" ]] && \
     [[ ! "$file" =~ "onboarding" ]] && \
     [[ ! "$file" =~ "unauthorized" ]] && \
     [[ ! "$file" =~ "app/page.tsx" ]]; then
    if ! grep -q "HorizontalLayout" "$file"; then 
      echo "$file"
    fi
  fi
done | wc -l | tr -d ' ')

echo "Remaining pages without HorizontalLayout: $remaining"