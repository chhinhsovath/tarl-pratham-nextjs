#!/bin/bash

################################################################################
# TaRL Pratham - Complete Migration to Supabase
# One-command migration script
# Usage: ./migrate-to-supabase.sh
################################################################################

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${BLUE}"
cat << "EOF"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ████████╗ █████╗ ██████╗ ██╗
  ╚══██╔══╝██╔══██╗██╔══██╗██║
     ██║   ███████║██████╔╝██║
     ██║   ██╔══██║██╔══██╗██║
     ██║   ██║  ██║██║  ██║███████╗
     ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝

  Supabase Migration Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
echo -e "${NC}"

echo ""
echo -e "${CYAN}This script will migrate your TaRL Pratham database to Supabase${NC}"
echo ""
echo "Current Database: 157.10.73.52:5432/tarl_pratham"
echo "Target Database:  Supabase (uyrmvvwwchzmqtstgwbi)"
echo ""
echo -e "${YELLOW}This will take approximately 40-80 minutes${NC}"
echo ""
echo "The script will:"
echo "  1. ✓ Backup current database"
echo "  2. ✓ Restore to Supabase"
echo "  3. ✓ Verify migration"
echo "  4. ✓ Update application configuration"
echo ""
read -p "Press ENTER to continue or Ctrl+C to cancel..."

################################################################################
# Step 1: Backup
################################################################################

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  STEP 1/4: Backup Current Database${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ ! -f "scripts/01_backup_database.sh" ]; then
    echo -e "${RED}✗ Backup script not found!${NC}"
    exit 1
fi

./scripts/01_backup_database.sh

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}✗ Backup failed! Migration aborted.${NC}"
    exit 1
fi

echo ""
read -p "Press ENTER to continue to Step 2 (Restore)..."

################################################################################
# Step 2: Restore
################################################################################

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  STEP 2/4: Restore to Supabase${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ ! -f "scripts/02_restore_to_supabase.sh" ]; then
    echo -e "${RED}✗ Restore script not found!${NC}"
    exit 1
fi

./scripts/02_restore_to_supabase.sh

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}✗ Restore failed! Check logs in ~/tarl-migration-backup/${NC}"
    echo ""
    echo "Your original database is still intact."
    echo "To rollback, do nothing - your .env still points to the old database."
    exit 1
fi

echo ""
read -p "Press ENTER to continue to Step 3 (Verify)..."

################################################################################
# Step 3: Verify
################################################################################

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  STEP 3/4: Verify Migration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ ! -f "scripts/03_verify_migration.sh" ]; then
    echo -e "${RED}✗ Verification script not found!${NC}"
    exit 1
fi

./scripts/03_verify_migration.sh

VERIFY_EXIT_CODE=$?

if [ $VERIFY_EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}⚠  Verification completed with warnings${NC}"
    echo ""
    read -p "Do you want to continue with application update? (yes/no): " CONTINUE

    if [ "$CONTINUE" != "yes" ]; then
        echo ""
        echo -e "${YELLOW}Migration paused. Your application still uses the old database.${NC}"
        echo ""
        echo "To complete later:"
        echo "  1. Review verification logs: ~/tarl-migration-backup/verification_*.log"
        echo "  2. Run: cp .env.supabase .env && npm run db:generate"
        exit 0
    fi
fi

echo ""
read -p "Press ENTER to continue to Step 4 (Update Application)..."

################################################################################
# Step 4: Update Application
################################################################################

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  STEP 4/4: Update Application Configuration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Backup current .env
if [ -f ".env" ]; then
    BACKUP_ENV=".env.backup.$(date +%Y%m%d_%H%M%S)"
    cp .env "$BACKUP_ENV"
    echo -e "${GREEN}✓${NC} Backed up current .env to: $BACKUP_ENV"
else
    echo -e "${YELLOW}⚠${NC}  No existing .env file found"
fi

# Copy Supabase configuration
if [ -f ".env.supabase" ]; then
    cp .env.supabase .env
    echo -e "${GREEN}✓${NC} Updated .env with Supabase configuration"
else
    echo -e "${RED}✗ .env.supabase not found!${NC}"
    exit 1
fi

# Regenerate Prisma client
echo ""
echo "Regenerating Prisma client..."
npm run db:generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Prisma client regenerated"
else
    echo -e "${RED}✗ Failed to regenerate Prisma client${NC}"
    exit 1
fi

################################################################################
# Success Summary
################################################################################

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  🎉 Migration Completed Successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Your TaRL Pratham application is now using Supabase!"
echo ""
echo -e "${CYAN}Next Steps:${NC}"
echo ""
echo "1. Start the application:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "2. Test critical functionality:"
echo "   • Login (email/password)"
echo "   • Quick login (username)"
echo "   • View students"
echo "   • Create/edit records"
echo "   • Dashboard and reports"
echo ""
echo "3. Review migration logs:"
echo "   • Backup:   ~/tarl-migration-backup/backup_manifest_*.txt"
echo "   • Restore:  ~/tarl-migration-backup/restore_*.log"
echo "   • Verify:   ~/tarl-migration-backup/verification_*.log"
echo ""
echo -e "${CYAN}Configuration:${NC}"
echo ""
echo "• Supabase Dashboard: https://supabase.com/dashboard/project/uyrmvvwwchzmqtstgwbi"
echo "• Database URL:       aws-1-us-east-1.pooler.supabase.com"
echo "• Project URL:        https://uyrmvvwwchzmqtstgwbi.supabase.co"
echo "• Old .env backup:    $BACKUP_ENV"
echo ""
echo -e "${YELLOW}Rollback (if needed):${NC}"
echo "  cp $BACKUP_ENV .env && npm run db:generate && npm run dev"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
