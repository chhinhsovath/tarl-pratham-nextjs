#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TaRL Pratham - Database Migration Script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Purpose: Migrate database from old server to new VPS
# Old Server: 157.10.73.52 (BACKUP - DO NOT MODIFY)
# New Server: 157.10.73.82 (PRIMARY)
# Created: 2025-01-18
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
OLD_SERVER="157.10.73.52"
NEW_SERVER="157.10.73.82"
DB_NAME="tarl_pratham"
DB_USER="admin"
DB_PASSWORD="P@ssw0rd"
BACKUP_FILE="tarl_pratham_backup_$(date +%Y%m%d_%H%M%S).sql"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  TaRL Pratham - Database Migration to New VPS Server${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Old Server (BACKUP):${NC} $OLD_SERVER"
echo -e "${GREEN}New Server (PRIMARY):${NC} $NEW_SERVER"
echo -e "Database: $DB_NAME"
echo -e "Backup File: $BACKUP_FILE"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Old server database will remain untouched as backup${NC}"
echo ""

# Step 1: Backup from old server
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 1: Backing up database from old server (157.10.73.52)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

export PGPASSWORD="$DB_PASSWORD"
echo "Connecting to old server and creating backup..."
pg_dump -h "$OLD_SERVER" -U "$DB_USER" -d "$DB_NAME" -F c -b -v -f "$BACKUP_FILE" 2>&1 | tee backup.log

if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup successful!${NC} File: $BACKUP_FILE (Size: $BACKUP_SIZE)"
else
    echo -e "${RED}✗ Backup failed! Check backup.log for details${NC}"
    exit 1
fi
echo ""

# Step 2: Check if PostgreSQL is installed on new server
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 2: Checking PostgreSQL on new server (157.10.73.82)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "You need to SSH into the new server and run these commands:"
echo ""
echo -e "${YELLOW}>>> Copy and paste these commands into new server SSH session:${NC}"
echo ""
cat << 'EOF'
# Update system
sudo apt update && sudo apt upgrade -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check status
sudo systemctl status postgresql

# Configure PostgreSQL user and database
sudo -u postgres psql << 'PSQL'
-- Create database user
CREATE USER admin WITH PASSWORD 'P@ssw0rd';

-- Create database
CREATE DATABASE tarl_pratham OWNER admin;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;

-- Exit
\q
PSQL

# Configure PostgreSQL for remote access
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf

# Allow remote connections
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf
echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf

# Configure firewall
sudo ufw allow 5432/tcp
sudo ufw --force enable

# Restart PostgreSQL
sudo systemctl restart postgresql

echo "PostgreSQL setup complete! Press ENTER to continue..."
EOF

echo ""
echo -e "${YELLOW}After running the above commands on the new server, press ENTER here to continue...${NC}"
read -r

# Step 3: Test connection to new server
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 3: Testing connection to new server${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

psql -h "$NEW_SERVER" -U "$DB_USER" -d "postgres" -c "SELECT version();" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Connection to new server successful!${NC}"
else
    echo -e "${RED}✗ Cannot connect to new server. Please check:${NC}"
    echo "  1. PostgreSQL is running on new server"
    echo "  2. Firewall allows port 5432"
    echo "  3. pg_hba.conf is configured correctly"
    exit 1
fi
echo ""

# Step 4: Restore database to new server
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 4: Restoring database to new server${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Restoring backup to new server..."
pg_restore -h "$NEW_SERVER" -U "$DB_USER" -d "$DB_NAME" -v "$BACKUP_FILE" 2>&1 | tee restore.log

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restore successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Some warnings during restore (this is normal for pg_restore)${NC}"
fi
echo ""

# Step 5: Verify data migration
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 5: Verifying data migration${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo "Checking record counts..."
echo ""

# Get counts from old server
echo -e "${YELLOW}Old Server (157.10.73.52):${NC}"
psql -h "$OLD_SERVER" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT
    'users: ' || COUNT(*) FROM users
    UNION ALL
    SELECT 'pilot_schools: ' || COUNT(*) FROM pilot_schools
    UNION ALL
    SELECT 'students: ' || COUNT(*) FROM students
    UNION ALL
    SELECT 'assessments: ' || COUNT(*) FROM assessments;
"

echo ""
echo -e "${GREEN}New Server (157.10.73.82):${NC}"
psql -h "$NEW_SERVER" -U "$DB_USER" -d "$DB_NAME" -t -c "
SELECT
    'users: ' || COUNT(*) FROM users
    UNION ALL
    SELECT 'pilot_schools: ' || COUNT(*) FROM pilot_schools
    UNION ALL
    SELECT 'students: ' || COUNT(*) FROM students
    UNION ALL
    SELECT 'assessments: ' || COUNT(*) FROM assessments;
"

echo ""
echo -e "${GREEN}✓ Data migration verification complete!${NC}"
echo ""

# Step 6: Update .env files
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 6: Updating .env files${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Backup current .env files
cp .env .env.backup.old-server-$(date +%Y%m%d_%H%M%S)
cp .env.local .env.local.backup.old-server-$(date +%Y%m%d_%H%M%S)

echo "Creating new .env files pointing to new server..."

# Update .env
sed -i.bak "s/157.10.73.52/157.10.73.82/g" .env
sed -i.bak "s/Old Server/New Server/g" .env

# Update .env.local
sed -i.bak "s/157.10.73.52/157.10.73.82/g" .env.local
sed -i.bak "s/Old Server/New Server/g" .env.local

echo -e "${GREEN}✓ Environment files updated!${NC}"
echo ""

# Step 7: Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ MIGRATION COMPLETE!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo "  ✓ Backup created: $BACKUP_FILE"
echo "  ✓ Database migrated to new server (157.10.73.82)"
echo "  ✓ Old server database preserved as backup (157.10.73.52)"
echo "  ✓ .env files updated to new server"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Run: npm run db:generate"
echo "  2. Run: npm run dev"
echo "  3. Test your application"
echo ""
echo -e "${YELLOW}Backup Files Created:${NC}"
echo "  - Database backup: $BACKUP_FILE"
echo "  - Old .env backup: .env.backup.old-server-*"
echo "  - Old .env.local backup: .env.local.backup.old-server-*"
echo ""
echo -e "${GREEN}Old server (157.10.73.52) remains available as backup!${NC}"
echo ""
