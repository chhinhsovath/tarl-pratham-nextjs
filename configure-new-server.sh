#!/bin/bash

# Complete PostgreSQL setup for new server
# This script will be executed on the remote server

cat << 'REMOTE_SCRIPT' | ssh ubuntu@157.10.73.82 'bash -s'

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== Starting PostgreSQL Configuration ===${NC}"

# Find PostgreSQL version
PG_VERSION=$(ls /etc/postgresql/ | head -n 1)
echo "PostgreSQL version: $PG_VERSION"

# Create database and user if not exists
echo -e "${BLUE}Creating database and user...${NC}"
sudo -u postgres psql << 'EOF'
-- Create user (ignore error if exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'admin') THEN
    CREATE USER admin WITH PASSWORD 'P@ssw0rd';
  END IF;
END
$$;

-- Create database (ignore error if exists)
SELECT 'CREATE DATABASE tarl_pratham OWNER admin'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tarl_pratham')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE tarl_pratham TO admin;

\q
EOF

# Configure listen_addresses
echo -e "${BLUE}Configuring PostgreSQL to listen on all interfaces...${NC}"
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf
sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/$PG_VERSION/main/postgresql.conf

# Add remote access to pg_hba.conf
echo -e "${BLUE}Adding remote access rules...${NC}"
if ! grep -q "# Remote access for TaRL Pratham" /etc/postgresql/$PG_VERSION/main/pg_hba.conf; then
  echo "" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
  echo "# Remote access for TaRL Pratham application" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
  echo "host    all             all             0.0.0.0/0               md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
  echo "host    all             all             ::/0                    md5" | sudo tee -a /etc/postgresql/$PG_VERSION/main/pg_hba.conf
fi

# Configure and enable firewall
echo -e "${BLUE}Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 5432/tcp
echo "y" | sudo ufw enable

# Restart PostgreSQL
echo -e "${BLUE}Restarting PostgreSQL...${NC}"
sudo systemctl restart postgresql
sleep 3

# Verify configuration
echo -e "${BLUE}=== Verification ===${NC}"
echo "PostgreSQL Status:"
sudo systemctl status postgresql --no-pager | head -n 3

echo ""
echo "Listening on:"
sudo netstat -plnt | grep 5432

echo ""
echo "Firewall status:"
sudo ufw status | grep 5432

echo ""
echo -e "${GREEN}=== Configuration Complete! ===${NC}"

REMOTE_SCRIPT
