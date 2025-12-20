#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TaRL Pratham Next.js - Deployment Script
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# This script helps deploy and manage the TaRL Pratham application
#
# Usage:
#   ./deploy.sh install   - Initial installation and setup
#   ./deploy.sh start     - Start the application
#   ./deploy.sh stop      - Stop the application
#   ./deploy.sh restart   - Restart the application
#   ./deploy.sh status    - Check application status
#   ./deploy.sh update    - Pull latest code and deploy
#   ./deploy.sh logs      - View application logs
#   ./deploy.sh backup    - Backup database
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on any error

# ─────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────
APP_NAME="tarl-pratham"
APP_DIR="/opt/tarl-pratham"
LOG_FILE="/var/log/$APP_NAME.log"
PID_FILE="/var/run/$APP_NAME.pid"
PORT=${PORT:-3006}
DB_HOST="157.10.73.82"
DB_PORT="5432"
DB_NAME="tarl_pratham"
DB_USER="admin"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─────────────────────────────────────────────────────────────────────────
# Helper Functions
# ─────────────────────────────────────────────────────────────────────────
function log {
    echo -e "${GREEN}[INFO] $(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
    echo "[INFO] $(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE" 2>/dev/null || true
}

function warn {
    echo -e "${YELLOW}[WARN] $(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
    echo "[WARN] $(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE" 2>/dev/null || true
}

function error {
    echo -e "${RED}[ERROR] $(date '+%Y-%m-%d %H:%M:%S')${NC} $1"
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') $1" >> "$LOG_FILE" 2>/dev/null || true
}

function info {
    echo -e "${BLUE}[INFO]${NC} $1"
}

function check_root {
    if [[ $EUID -eq 0 ]]; then
        log "Running as root"
    else
        warn "This script should be run as root for system-level operations"
        warn "Some operations may require sudo"
    fi
}

# ─────────────────────────────────────────────────────────────────────────
# Installation Functions
# ─────────────────────────────────────────────────────────────────────────
function install_dependencies {
    log "Installing Node.js and dependencies..."

    if ! command -v node &> /dev/null; then
        log "Installing Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
        sudo apt-get install -y nodejs
    else
        log "Node.js is already installed: $(node --version)"
    fi

    if ! command -v npm &> /dev/null; then
        error "npm is not available after installing Node.js"
        exit 1
    fi

    log "npm version: $(npm --version)"
}

function install_pm2 {
    if ! command -v pm2 &> /dev/null; then
        log "Installing PM2 globally..."
        sudo npm install -g pm2

        # Setup PM2 to start on boot
        sudo pm2 startup systemd -u $USER --hp $HOME
    else
        log "PM2 is already installed: $(pm2 --version)"
    fi
}

function setup_application {
    log "Setting up application directory: $APP_DIR"

    # Create app directory if it doesn't exist
    if [[ ! -d "$APP_DIR" ]]; then
        sudo mkdir -p "$APP_DIR"
        sudo chown -R $USER:$USER "$APP_DIR"
    fi

    # Copy application files (assuming this script is in the project directory)
    log "Copying application files..."
    rsync -av \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='*.log' \
        --exclude='.env*' \
        --exclude='backups' \
        . "$APP_DIR/"

    cd "$APP_DIR"

    log "Installing application dependencies..."
    npm install

    log "Generating Prisma client..."
    npx prisma generate

    log "Building application..."
    NODE_OPTIONS='--max-old-space-size=1024' npm run build

    # Create log file
    sudo touch "$LOG_FILE"
    sudo chmod 644 "$LOG_FILE"
    sudo chown $USER:$USER "$LOG_FILE"
}

function setup_env {
    log "Setting up environment variables..."

    if [[ ! -f "$APP_DIR/.env" ]]; then
        warn "No .env file found. Creating from template..."

        read -sp "Enter database password: " DB_PASSWORD
        echo

        cat > "$APP_DIR/.env" << EOF
DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000&connection_limit=3&pool_timeout=5"
POSTGRES_PRISMA_URL="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable&connect_timeout=5&statement_timeout=30000&idle_in_transaction_session_timeout=30000&connection_limit=3&pool_timeout=5"
POSTGRES_URL_NON_POOLING="postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable&connect_timeout=10"
NEXTAUTH_URL="https://tarl.openplp.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NODE_ENV="production"
PORT="$PORT"
EOF

        chmod 600 "$APP_DIR/.env"
        log "Environment file created"
    else
        log "Environment file already exists"
    fi
}

function setup_systemd {
    log "Setting up systemd service..."

    if [[ -f "$APP_DIR/tarl-pratham.service" ]]; then
        sudo cp "$APP_DIR/tarl-pratham.service" /etc/systemd/system/
        sudo systemctl daemon-reload
        sudo systemctl enable tarl-pratham
        log "Systemd service installed and enabled"
    else
        warn "Service file not found at $APP_DIR/tarl-pratham.service"
    fi
}

# ─────────────────────────────────────────────────────────────────────────
# Application Management Functions
# ─────────────────────────────────────────────────────────────────────────
function start_application {
    log "Starting $APP_NAME on port $PORT..."

    # Check if PM2 is available
    if command -v pm2 &> /dev/null; then
        cd "$APP_DIR"

        # Check if already running
        if pm2 list | grep -q "$APP_NAME"; then
            warn "$APP_NAME is already running in PM2"
            return 0
        fi

        # Start with PM2
        NODE_OPTIONS='--max-old-space-size=1024' \
        PORT=$PORT \
        pm2 start npm --name "$APP_NAME" -- run start:prod

        pm2 save
        log "$APP_NAME started successfully with PM2"
    else
        # Use systemd
        sudo systemctl start tarl-pratham
        log "$APP_NAME started successfully with systemd"
    fi

    sleep 5
    status_application
}

function stop_application {
    log "Stopping $APP_NAME..."

    if command -v pm2 &> /dev/null && pm2 list | grep -q "$APP_NAME"; then
        pm2 stop "$APP_NAME"
        log "$APP_NAME stopped (PM2)"
    elif systemctl is-active --quiet tarl-pratham; then
        sudo systemctl stop tarl-pratham
        log "$APP_NAME stopped (systemd)"
    else
        warn "$APP_NAME does not appear to be running"
    fi
}

function restart_application {
    log "Restarting $APP_NAME..."

    if command -v pm2 &> /dev/null && pm2 list | grep -q "$APP_NAME"; then
        pm2 restart "$APP_NAME"
        log "$APP_NAME restarted (PM2)"
    elif systemctl is-enabled --quiet tarl-pratham; then
        sudo systemctl restart tarl-pratham
        log "$APP_NAME restarted (systemd)"
    else
        warn "Starting application (was not running)"
        start_application
    fi

    sleep 5
    status_application
}

function status_application {
    info "Checking $APP_NAME status..."

    if command -v pm2 &> /dev/null && pm2 list | grep -q "$APP_NAME"; then
        pm2 info "$APP_NAME"

        # Check if responding
        if curl -sf "http://localhost:$PORT" > /dev/null; then
            log "✅ Application is responding on port $PORT"
        else
            warn "⚠️  Application is running but not responding on port $PORT"
        fi
    elif systemctl is-active --quiet tarl-pratham; then
        sudo systemctl status tarl-pratham --no-pager -l

        # Check if responding
        if curl -sf "http://localhost:$PORT" > /dev/null; then
            log "✅ Application is responding on port $PORT"
        else
            warn "⚠️  Application is running but not responding on port $PORT"
        fi
    else
        warn "$APP_NAME is not running"
    fi
}

function view_logs {
    if command -v pm2 &> /dev/null && pm2 list | grep -q "$APP_NAME"; then
        pm2 logs "$APP_NAME" --lines 100
    elif systemctl is-active --quiet tarl-pratham; then
        sudo journalctl -u tarl-pratham -f -n 100
    else
        if [[ -f "$LOG_FILE" ]]; then
            tail -f "$LOG_FILE"
        else
            warn "No logs available"
        fi
    fi
}

# ─────────────────────────────────────────────────────────────────────────
# Update & Backup Functions
# ─────────────────────────────────────────────────────────────────────────
function update_application {
    log "Updating $APP_NAME..."

    cd "$APP_DIR"

    # Pull latest code
    log "Pulling latest code from git..."
    git pull origin main

    # Install dependencies
    log "Installing dependencies..."
    npm install

    # Generate Prisma client
    log "Generating Prisma client..."
    npx prisma generate

    # Check for schema changes
    if git diff HEAD~1 --name-only | grep -q "prisma/schema.prisma"; then
        warn "Database schema changed. Running migration..."
        npx prisma db push --skip-generate
    fi

    # Build application
    log "Building application..."
    NODE_OPTIONS='--max-old-space-size=1024' npm run build

    # Restart application
    restart_application

    log "✅ Update completed successfully"
}

function backup_database {
    log "Backing up database..."

    BACKUP_DIR="$APP_DIR/backups"
    mkdir -p "$BACKUP_DIR"

    BACKUP_FILE="$BACKUP_DIR/tarl_pratham_backup_$(date +%Y%m%d_%H%M%S).sql"

    read -sp "Enter database password: " DB_PASSWORD
    echo

    PGPASSWORD=$DB_PASSWORD pg_dump \
        -h $DB_HOST \
        -p $DB_PORT \
        -U $DB_USER \
        -d $DB_NAME \
        -F p \
        -f "$BACKUP_FILE"

    # Compress backup
    gzip "$BACKUP_FILE"

    log "✅ Database backup created: ${BACKUP_FILE}.gz"

    # Keep only last 7 backups
    cd "$BACKUP_DIR"
    ls -t tarl_pratham_backup_*.sql.gz | tail -n +8 | xargs rm -f 2>/dev/null || true

    log "Old backups cleaned up (kept last 7)"
}

# ─────────────────────────────────────────────────────────────────────────
# Main Function
# ─────────────────────────────────────────────────────────────────────────
function show_usage {
    cat << EOF
╔══════════════════════════════════════════════════════════════════╗
║              TaRL Pratham Deployment Script                      ║
╚══════════════════════════════════════════════════════════════════╝

Usage: $0 {command}

Commands:
  install     - Install and set up the application
  start       - Start the application
  stop        - Stop the application
  restart     - Restart the application
  status      - Check application status
  update      - Pull latest code and deploy
  logs        - View application logs
  backup      - Backup database
  help        - Show this help message

Examples:
  $0 install        # Initial setup
  $0 update         # Update to latest version
  $0 restart        # Restart application
  $0 status         # Check if running
  $0 logs           # View logs

EOF
}

function main {
    case "${1:-help}" in
        "install")
            check_root
            install_dependencies
            install_pm2
            setup_application
            setup_env
            setup_systemd
            log "✅ Installation completed. Use '$0 start' to start the application."
            ;;
        "start")
            start_application
            ;;
        "stop")
            stop_application
            ;;
        "restart")
            restart_application
            ;;
        "status")
            status_application
            ;;
        "update")
            update_application
            ;;
        "logs")
            view_logs
            ;;
        "backup")
            backup_database
            ;;
        "help"|*)
            show_usage
            exit 0
            ;;
    esac
}

# Run main function
main "$@"
