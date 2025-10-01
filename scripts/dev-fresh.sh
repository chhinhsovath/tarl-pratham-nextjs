#!/bin/bash
# Fresh development start - NO CACHE
# Usage: ./scripts/dev-fresh.sh

echo "🧹 Clearing all caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbopack

echo "🔄 Regenerating Prisma Client..."
npx prisma generate

echo "🚀 Starting fresh dev server on port 3003..."
PORT=3003 npm run dev
