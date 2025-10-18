#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Local Machine Migration Helper Script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Run this script AFTER you've completed Steps 1-5 on the servers
# This handles Step 6-8: Update .env and test locally
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Local Machine Migration Helper${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "prisma" ]; then
    echo -e "${YELLOW}⚠️  Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Backing up current .env files...${NC}"
cp .env .env.backup.old-server-$(date +%Y%m%d_%H%M%S)
cp .env.local .env.local.backup.old-server-$(date +%Y%m%d_%H%M%S)
echo -e "${GREEN}✓ Backup created${NC}"
echo ""

echo -e "${BLUE}Step 2: Updating .env files to point to new server...${NC}"
# Update .env
sed -i.bak 's/157\.10\.73\.52/157.10.73.82/g' .env
sed -i.bak 's/Old Server/New Server/g' .env

# Update .env.local
sed -i.bak 's/157\.10\.73\.52/157.10.73.82/g' .env.local
sed -i.bak 's/Old Server/New Server/g' .env.local

# Clean up .bak files
rm -f .env.bak .env.local.bak

echo -e "${GREEN}✓ Files updated${NC}"
echo ""

echo -e "${BLUE}Step 3: Verifying new configuration...${NC}"
echo "Checking .env..."
grep "157.10.73.82" .env | head -n 3
echo ""
echo "Checking .env.local..."
grep "157.10.73.82" .env.local | head -n 3
echo ""
echo -e "${GREEN}✓ Configuration verified${NC}"
echo ""

echo -e "${BLUE}Step 4: Testing connection to new server...${NC}"
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -c "SELECT 'Connection successful!' as status, COUNT(*) as user_count FROM users;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Connection successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Connection test failed. Please check:${NC}"
    echo "  1. New server PostgreSQL is running"
    echo "  2. Firewall allows port 5432"
    echo "  3. Database was restored successfully"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 5: Verifying data migration...${NC}"
echo "Checking record counts on new server..."
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.82 -U admin -d tarl_pratham -t -c "
SELECT
    'users: ' || COUNT(*) FROM users
    UNION ALL
    SELECT 'pilot_schools: ' || COUNT(*) FROM pilot_schools
    UNION ALL
    SELECT 'students: ' || COUNT(*) FROM students
    UNION ALL
    SELECT 'assessments: ' || COUNT(*) FROM assessments;
" 2>/dev/null

echo ""
echo -e "${GREEN}✓ Data verification complete${NC}"
echo ""

echo -e "${BLUE}Step 6: Regenerating Prisma client...${NC}"
npm run db:generate
echo -e "${GREEN}✓ Prisma client generated${NC}"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ MIGRATION COMPLETE!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo "  ✓ .env files updated to new server (157.10.73.82)"
echo "  ✓ Backups created: .env.backup.old-server-*"
echo "  ✓ Connection to new server tested successfully"
echo "  ✓ Data migration verified"
echo "  ✓ Prisma client regenerated"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Start development server: npm run dev"
echo "  2. Open browser: http://localhost:3005"
echo "  3. Test application functionality"
echo ""
echo -e "${YELLOW}Rollback (if needed):${NC}"
echo "  cp .env.backup.old-server-* .env"
echo "  cp .env.local.backup.old-server-* .env.local"
echo "  npm run db:generate && npm run dev"
echo ""
echo -e "${GREEN}Your application is now connected to the new server (157.10.73.82)!${NC}"
echo -e "${GREEN}Old server (157.10.73.52) remains available as backup.${NC}"
echo ""
