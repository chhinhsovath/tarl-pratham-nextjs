#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Vercel Environment Variables Update Script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Updates database connection to new server (157.10.73.82)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Vercel Environment Variables Update${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}New Server: 157.10.73.82${NC}"
echo -e "${YELLOW}Old Server: 157.10.73.52 (backup)${NC}"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Login to Vercel (will open browser if not logged in)
echo -e "${BLUE}[1/5] Checking Vercel authentication...${NC}"
vercel whoami || vercel login

# Link project (if not already linked)
echo ""
echo -e "${BLUE}[2/5] Linking to Vercel project...${NC}"
if [ ! -d ".vercel" ]; then
    vercel link
else
    echo "✓ Project already linked"
fi

# Update environment variables
echo ""
echo -e "${BLUE}[3/5] Updating environment variables...${NC}"

# Remove old variables (if they exist)
echo "Removing old environment variables..."
vercel env rm DATABASE_URL production --yes 2>/dev/null || echo "DATABASE_URL not found (will create new)"
vercel env rm POSTGRES_PRISMA_URL production --yes 2>/dev/null || echo "POSTGRES_PRISMA_URL not found (will create new)"
vercel env rm POSTGRES_URL_NON_POOLING production --yes 2>/dev/null || echo "POSTGRES_URL_NON_POOLING not found (will create new)"
vercel env rm POSTGRES_HOST production --yes 2>/dev/null || echo "POSTGRES_HOST not found (will create new)"

# Add new environment variables
echo ""
echo "Adding new environment variables..."

echo "postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10" | vercel env add DATABASE_URL production

echo "postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10&connection_limit=1&pool_timeout=10" | vercel env add POSTGRES_PRISMA_URL production

echo "postgres://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham?sslmode=disable&connect_timeout=10" | vercel env add POSTGRES_URL_NON_POOLING production

echo "157.10.73.82" | vercel env add POSTGRES_HOST production

echo -e "${GREEN}✓ Environment variables updated${NC}"

# Pull environment variables to local
echo ""
echo -e "${BLUE}[4/5] Pulling environment variables...${NC}"
vercel env pull

# Deploy to production
echo ""
echo -e "${BLUE}[5/5] Deploying to production...${NC}"
vercel --prod

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ VERCEL UPDATE COMPLETE!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo "  ✓ Environment variables updated to new server (157.10.73.82)"
echo "  ✓ Production deployment triggered"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Wait 2-3 minutes for deployment to complete"
echo "  2. Visit https://tarl.openplp.com"
echo "  3. Test login and data loading"
echo ""
echo -e "${GREEN}Your application is now connected to the new database server!${NC}"
echo ""
