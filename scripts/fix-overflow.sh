#!/bin/bash

echo "🔧 Fixing horizontal overflow issues..."

# Replace standalone w-full divs with max-w-full to prevent overflow
echo "📝 Updating w-full to include overflow protection..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec sed -i '' 's/<div className="w-full">/<div className="max-w-full overflow-x-hidden">/g' {} \;

# Update w-full with other classes to include max-w-full
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec sed -i '' 's/className="w-full /className="max-w-full overflow-x-hidden /g' {} \;

# Fix tables that might cause overflow
echo "📝 Fixing table overflow..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec sed -i '' 's/<Table/<Table scroll={{ x: "max-content" }}/g' {} \;

# Fix Cards that might be too wide
echo "📝 Adding responsive width to Cards..."
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec sed -i '' 's/<Card>/<Card className="max-w-full">/g' {} \;
find /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/app -name "*.tsx" -exec sed -i '' 's/<Card /<Card className="max-w-full" /g' {} \;

echo "✅ Overflow fixes applied!"