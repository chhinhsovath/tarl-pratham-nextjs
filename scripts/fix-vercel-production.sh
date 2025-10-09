#!/bin/bash
# Quick fix for production - Remove old Supabase variables

echo "🚨 Fixing Production Database Connection"
echo "=========================================="
echo ""
echo "This script will remove old Supabase environment variables from Vercel."
echo ""
echo "Prerequisites:"
echo "  - Vercel CLI installed (npm i -g vercel)"
echo "  - Logged in to Vercel (vercel login)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "Removing old Supabase variables..."
echo ""

# Remove old variables from Production environment
vercel env rm TARL_OPENPLP_POSTGRES_URL production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_URL"
vercel env rm TARL_OPENPLP_POSTGRES_URL_NON_POOLING production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_URL_NON_POOLING"
vercel env rm TARL_OPENPLP_POSTGRES_PRISMA_URL production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_PRISMA_URL"
vercel env rm TARL_OPENPLP_POSTGRES_HOST production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_HOST"
vercel env rm TARL_OPENPLP_POSTGRES_USER production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_USER"
vercel env rm TARL_OPENPLP_POSTGRES_PASSWORD production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_PASSWORD"
vercel env rm TARL_OPENPLP_POSTGRES_DATABASE production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_POSTGRES_DATABASE"
vercel env rm TARL_OPENPLP_SUPABASE_URL production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_SUPABASE_URL"
vercel env rm TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_URL production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_URL"
vercel env rm TARL_OPENPLP_SUPABASE_JWT_SECRET production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_SUPABASE_JWT_SECRET"
vercel env rm TARL_OPENPLP_SUPABASE_ANON_KEY production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_SUPABASE_ANON_KEY"
vercel env rm TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_ANON_KEY"
vercel env rm TARL_OPENPLP_SUPABASE_SERVICE_ROLE_KEY production --yes 2>/dev/null && echo "✓ Removed TARL_OPENPLP_SUPABASE_SERVICE_ROLE_KEY"

echo ""
echo "✅ Old Supabase variables removed!"
echo ""
echo "Now you need to add the new database variables if not already present:"
echo "  1. Go to Vercel Dashboard"
echo "  2. Add DATABASE_URL (from .env.production.example)"
echo "  3. Add other POSTGRES_* variables"
echo "  4. Redeploy"
echo ""
echo "Or run: vercel --prod"
