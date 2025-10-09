#!/bin/bash

# Script to remove old Supabase environment variables from Vercel

echo "🗑️  Removing old Supabase environment variables from Vercel..."
echo ""

VARS=(
  "TARL_OPENPLP_POSTGRES_URL"
  "TARL_OPENPLP_POSTGRES_URL_NON_POOLING"
  "TARL_OPENPLP_POSTGRES_PRISMA_URL"
  "TARL_OPENPLP_POSTGRES_HOST"
  "TARL_OPENPLP_POSTGRES_USER"
  "TARL_OPENPLP_POSTGRES_PASSWORD"
  "TARL_OPENPLP_POSTGRES_DATABASE"
  "TARL_OPENPLP_SUPABASE_URL"
  "TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_URL"
  "TARL_OPENPLP_SUPABASE_JWT_SECRET"
  "TARL_OPENPLP_SUPABASE_ANON_KEY"
  "TARL_OPENPLP_NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "TARL_OPENPLP_SUPABASE_SERVICE_ROLE_KEY"
)

for var in "${VARS[@]}"; do
  echo "Removing: $var"
  vercel env rm "$var" production --yes 2>/dev/null
  vercel env rm "$var" preview --yes 2>/dev/null
  vercel env rm "$var" development --yes 2>/dev/null
done

echo ""
echo "✅ All old Supabase variables removed!"
echo ""
echo "Next: Add new environment variables from .env.production.example"
