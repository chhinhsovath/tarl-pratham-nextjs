#!/bin/bash

# Script to update remaining pages to use HorizontalLayout
# Excluding auth pages, profile setup, and other pages that shouldn't have layout

echo "🔄 Updating remaining pages to use HorizontalLayout..."

# List of files that SHOULD have HorizontalLayout
files=(
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/settings/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/periods/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/data-entry/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/assessments/select-students/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/coordinator/imports/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/coordinator/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/resources/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/bulk-import/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/[id]/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/students/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/[id]/edit/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/users/create/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/administration/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/[id]/teachers/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/[id]/students/page.tsx"
  "/Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app/schools/page.tsx"
)

# Files that should NOT have layout (auth, setup pages)
# - app/auth/mobile-login/page.tsx
# - app/auth/login/page.tsx  
# - app/profile-setup/page.tsx
# - app/unauthorized/page.tsx
# - app/page.tsx (landing page)
# - app/onboarding/page.tsx

echo "Files to update: ${#files[@]}"
echo ""

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Checking: $(basename $(dirname $file))/$(basename $file)"
    
    # Check if file already has HorizontalLayout
    if grep -q "HorizontalLayout" "$file"; then
      echo "   ✓ Already has HorizontalLayout"
    else
      echo "   🔧 Adding HorizontalLayout..."
      
      # Read the file content
      content=$(cat "$file")
      
      # Check if it's a client component
      if echo "$content" | grep -q "'use client'"; then
        # Client component - add import and wrap content
        
        # Add import after 'use client'
        sed -i '' "/^'use client'/a\\
import HorizontalLayout from '@/components/layout/HorizontalLayout';" "$file"
        
        # Find the main export function and wrap its return
        # This is more complex, so we'll do it carefully
        echo "   ⚠️ Client component - manual wrapping needed for $(basename $file)"
        
      else
        # Server component - add use client, import and wrap
        
        # Add 'use client' at the beginning if not present
        if ! echo "$content" | grep -q "'use client'"; then
          sed -i '' "1i\\
'use client';\\
" "$file"
        fi
        
        # Add import
        sed -i '' "/^'use client'/a\\
import HorizontalLayout from '@/components/layout/HorizontalLayout';" "$file"
        
        echo "   ⚠️ Server component - manual wrapping needed for $(basename $file)"
      fi
    fi
  else
    echo "   ⚠️ File not found: $file"
  fi
done

echo ""
echo "⚠️ Note: Some files need manual wrapping with HorizontalLayout"
echo "Format should be:"
echo "  return ("
echo "    <HorizontalLayout>"
echo "      {/* existing content */}"
echo "    </HorizontalLayout>"
echo "  );"