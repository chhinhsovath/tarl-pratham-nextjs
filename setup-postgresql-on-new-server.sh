#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# PostgreSQL Setup Script for New VPS Server (157.10.73.82)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Purpose: Install and configure PostgreSQL on new VPS
# Run this script ON THE NEW SERVER (157.10.73.82)
# Usage: bash setup-postgresql-on-new-server.sh
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  PostgreSQL Installation and Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Update system
echo -e "${BLUE}[1/8] Updating system packages...${NC}"
sudo apt update -y
sudo apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Step 2: Install PostgreSQL
echo -e "${BLUE}[2/8] Installing PostgreSQL...${NC}"
sudo apt install postgresql postgresql-contrib -y
echo -e "${GREEN}✓ PostgreSQL installed${NC}"
echo ""

# Step 3: Start and enable PostgreSQL
echo -e "${BLUE}[3/8] Starting PostgreSQL service...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql --no-pager | head -n 5
echo -e "${GREEN}✓ PostgreSQL started and enabled${NC}"
echo ""

# Step 4: Create database user and database
echo -e "${BLUE}[4/8] Creating database user and database...${NC}"
sudo -u postgres psql << 'EOF'
-- Create user
CREATE USER admin WITH PASSWORD 'P@ssw0rd';

-- Create database
CREATE DATABASE tarl_pratham OWNER admin;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;

-- Display confirmation
\l tarl_pratham
\du admin
EOF
echo -e "${GREEN}✓ Database and user created${NC}"
echo ""

# Step 5: Configure PostgreSQL for remote access
echo -e "${BLUE}[5/8] Configuring PostgreSQL for remote access...${NC}"

# Find PostgreSQL version directory
PG_VERSION=$(ls /etc/postgresql/)
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"

# Backup original configs
sudo cp "$PG_CONF" "$PG_CONF.backup"
sudo cp "$PG_HBA" "$PG_HBA.backup"

# Configure listen_addresses
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"

# Add remote access rules to pg_hba.conf
echo "" | sudo tee -a "$PG_HBA"
echo "# Remote access for TaRL Pratham application" | sudo tee -a "$PG_HBA"
echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a "$PG_HBA"
echo "host    all             all             ::/0                    md5" | sudo tee -a "$PG_HBA"

echo -e "${GREEN}✓ PostgreSQL configured for remote access${NC}"
echo ""

# Step 6: Configure firewall
echo -e "${BLUE}[6/8] Configuring firewall...${NC}"
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 5432/tcp  # PostgreSQL
sudo ufw --force enable
sudo ufw status numbered
echo -e "${GREEN}✓ Firewall configured${NC}"
echo ""

# Step 7: Restart PostgreSQL
echo -e "${BLUE}[7/8] Restarting PostgreSQL...${NC}"
sudo systemctl restart postgresql
sleep 2
sudo systemctl status postgresql --no-pager | head -n 5
echo -e "${GREEN}✓ PostgreSQL restarted${NC}"
echo ""

# Step 8: Verify setup
echo -e "${BLUE}[8/8] Verifying setup...${NC}"
sudo -u postgres psql -c "SELECT version();"
echo ""
sudo -u postgres psql -l | grep tarl_pratham
echo -e "${GREEN}✓ Setup verified${NC}"
echo ""

# Summary
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ PostgreSQL Setup Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Database Configuration:${NC}"
echo "  Host: $(hostname -I | awk '{print $1}')"
echo "  Port: 5432"
echo "  Database: tarl_pratham"
echo "  Username: admin"
echo "  Password: P@ssw0rd"
echo ""
echo -e "${GREEN}Connection String:${NC}"
echo "  postgres://admin:P@ssw0rd@$(hostname -I | awk '{print $1}'):5432/tarl_pratham"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Test connection from your local machine:"
echo "     psql -h $(hostname -I | awk '{print $1}') -U admin -d tarl_pratham"
echo ""
echo "  2. Run the migration script from your local machine"
echo ""
