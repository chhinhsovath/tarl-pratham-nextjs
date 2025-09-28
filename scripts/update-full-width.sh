#!/bin/bash

echo "🔄 Updating all pages to use full width layout..."

# Find and update pages with padding: "24px" style
echo "📝 Updating pages with inline padding styles..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec grep -l 'style={{ padding: "24px" }}' {} \; | while read file; do
  echo "  Updating: $(basename $(dirname $file))/$(basename $file)"
  sed -i '' 's/style={{ padding: "24px" }}/className="w-full"/g' "$file"
done

# Update pages with div style={{ padding: '24px' }}
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec grep -l "style={{ padding: '24px' }}" {} \; | while read file; do
  echo "  Updating: $(basename $(dirname $file))/$(basename $file)"
  sed -i '' "s/style={{ padding: '24px' }}/className=\"w-full\"/g" "$file"
done

# Update pages with div style={{ padding: 24 }}
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec grep -l "style={{ padding: 24 }}" {} \; | while read file; do
  echo "  Updating: $(basename $(dirname $file))/$(basename $file)"
  sed -i '' "s/style={{ padding: 24 }}/className=\"w-full\"/g" "$file"
done

# Update container divs with constrained widths
echo ""
echo "📝 Updating container divs..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec grep -l '<div className="container' {} \; | while read file; do
  echo "  Updating: $(basename $(dirname $file))/$(basename $file)"
  sed -i '' 's/<div className="container[^"]*"/<div className="w-full"/g' "$file"
done

# Update max-w-screen constraints
echo ""
echo "📝 Updating max-w-screen constraints..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec grep -l 'max-w-screen' {} \; | while read file; do
  echo "  Updating: $(basename $(dirname $file))/$(basename $file)"
  sed -i '' 's/max-w-screen-[a-z]*/w-full/g' "$file"
done

echo ""
echo "✅ Full width update complete!"