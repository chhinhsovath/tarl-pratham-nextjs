#!/bin/bash

################################################################################
# TaRL Pratham Database Restore to Supabase Script
# Purpose: Restore backup to Supabase database
# Usage: ./02_restore_to_supabase.sh [backup_file.dump]
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# SUPABASE CREDENTIALS (READY TO USE)
################################################################################

# Supabase database configuration
# Project: uyrmvvwwchzmqtstgwbi
# Dashboard: https://supabase.com/dashboard/project/uyrmvvwwchzmqtstgwbi

SUPABASE_HOST="aws-1-us-east-1.pooler.supabase.com"
SUPABASE_PORT="5432"  # Session mode for restore (direct connection)
SUPABASE_USER="postgres.uyrmvvwwchzmqtstgwbi"
SUPABASE_DB="postgres"
SUPABASE_PASSWORD="QtMVSsu8uw60WRjK"

# Project configuration
SUPABASE_PROJECT_URL="https://uyrmvvwwchzmqtstgwbi.supabase.co"

# Backup configuration
BACKUP_DIR="$HOME/tarl-migration-backup"
RESTORE_LOG="${BACKUP_DIR}/restore_$(date +%Y%m%d_%H%M%S).log"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  TaRL Pratham Database Restore to Supabase${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_step() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_configuration() {
    echo "Checking configuration..."

    local config_valid=true

    if [ -z "$SUPABASE_PASSWORD" ]; then
        print_error "SUPABASE_PASSWORD not set"
        config_valid=false
    fi

    if [ "$SUPABASE_HOST" == "aws-0-us-east-1.pooler.supabase.com" ] && [ -z "$SUPABASE_PASSWORD" ]; then
        print_warning "Using default host. Please verify this is correct."
    fi

    if [ "$SUPABASE_USER" == "postgres.cftkquoslfwkwavhkspu" ]; then
        print_step "Using full connection user format"
    fi

    if [ "$config_valid" = false ]; then
        echo ""
        echo "Please update the configuration section in this script:"
        echo "  1. Get connection string from: $SUPABASE_PROJECT_URL"
        echo "     → Settings → Database → Connection string (URI mode)"
        echo ""
        echo "  2. Update these variables:"
        echo "     - SUPABASE_HOST"
        echo "     - SUPABASE_USER"
        echo "     - SUPABASE_PASSWORD"
        echo ""
        exit 1
    fi

    print_step "Configuration check passed"
}

check_dependencies() {
    echo ""
    echo "Checking dependencies..."

    if ! command -v pg_restore &> /dev/null; then
        print_error "pg_restore not found. Please install PostgreSQL client tools."
        exit 1
    fi

    print_step "pg_restore found: $(pg_restore --version)"
}

find_backup_file() {
    if [ -n "$1" ]; then
        BACKUP_FILE="$1"
    else
        # Find most recent .dump file
        BACKUP_FILE=$(ls -t "${BACKUP_DIR}"/*.dump 2>/dev/null | head -1)
    fi

    if [ -z "$BACKUP_FILE" ] || [ ! -f "$BACKUP_FILE" ]; then
        print_error "No backup file found"
        echo ""
        echo "Usage:"
        echo "  $0 [backup_file.dump]"
        echo ""
        echo "Or place backup file in: $BACKUP_DIR"
        exit 1
    fi

    echo ""
    echo "Using backup file:"
    echo "  $(basename "$BACKUP_FILE") ($(ls -lh "$BACKUP_FILE" | awk '{print $5}'))"
}

test_supabase_connection() {
    echo ""
    echo "Testing Supabase connection..."

    if PGPASSWORD="$SUPABASE_PASSWORD" psql \
        -h "$SUPABASE_HOST" \
        -p "$SUPABASE_PORT" \
        -U "$SUPABASE_USER" \
        -d "$SUPABASE_DB" \
        -c "SELECT version();" > /dev/null 2>&1; then
        print_step "Supabase connection successful"
    else
        print_error "Cannot connect to Supabase"
        echo ""
        echo "Details:"
        echo "  Host: $SUPABASE_HOST"
        echo "  Port: $SUPABASE_PORT"
        echo "  User: $SUPABASE_USER"
        echo "  Database: $SUPABASE_DB"
        echo ""
        echo "Common issues:"
        echo "  1. Wrong password"
        echo "  2. IP not allowed (check Supabase → Settings → Database → Connection pooling)"
        echo "  3. Using Transaction mode port (6543) instead of Session mode (5432)"
        exit 1
    fi
}

check_existing_data() {
    echo ""
    echo "Checking existing data in Supabase..."

    TABLE_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql \
        -h "$SUPABASE_HOST" \
        -p "$SUPABASE_PORT" \
        -U "$SUPABASE_USER" \
        -d "$SUPABASE_DB" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

    echo "  Existing tables: $TABLE_COUNT"

    if [ "$TABLE_COUNT" -gt 0 ]; then
        print_warning "Database already contains $TABLE_COUNT tables"
        echo ""
        echo "  Restore will use --clean flag to drop existing objects."
        echo "  This is normal for migrations, but be careful!"
        echo ""
        read -p "  Continue with restore? (yes/no): " CONFIRM

        if [ "$CONFIRM" != "yes" ]; then
            echo ""
            print_error "Restore cancelled by user"
            exit 0
        fi
    else
        print_step "Database is empty (ready for restore)"
    fi
}

restore_database() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Starting database restore..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    print_warning "This may take 5-30 minutes depending on data size"
    echo ""

    # Start restore with logging
    PGPASSWORD="$SUPABASE_PASSWORD" pg_restore \
        -h "$SUPABASE_HOST" \
        -p "$SUPABASE_PORT" \
        -U "$SUPABASE_USER" \
        -d "$SUPABASE_DB" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        -v \
        "$BACKUP_FILE" 2>&1 | tee "$RESTORE_LOG"

    RESTORE_EXIT_CODE=${PIPESTATUS[0]}

    echo ""
    if [ $RESTORE_EXIT_CODE -eq 0 ]; then
        print_step "Restore completed"
    else
        print_warning "Restore completed with some errors (this is common)"
        echo "  Check log file: $RESTORE_LOG"
    fi
}

check_critical_errors() {
    echo ""
    echo "Checking for critical errors..."

    # Filter out expected errors
    CRITICAL_ERRORS=$(grep -i "error" "$RESTORE_LOG" | \
        grep -v "owner" | \
        grep -v "permission" | \
        grep -v "already exists" | \
        grep -v "does not exist" || true)

    if [ -n "$CRITICAL_ERRORS" ]; then
        print_warning "Found potential critical errors:"
        echo "$CRITICAL_ERRORS" | head -10
        echo ""
        echo "Full log: $RESTORE_LOG"
    else
        print_step "No critical errors found"
    fi
}

verify_restore() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Verifying restore..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Check table count
    TABLE_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql \
        -h "$SUPABASE_HOST" \
        -p "$SUPABASE_PORT" \
        -U "$SUPABASE_USER" \
        -d "$SUPABASE_DB" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null)

    echo "  Tables restored: $TABLE_COUNT"

    if [ "$TABLE_COUNT" -lt 30 ]; then
        print_warning "Expected ~31 tables, found only $TABLE_COUNT"
    else
        print_step "Table count looks good"
    fi

    # Check key tables
    echo ""
    echo "  Checking key tables:"

    for table in "users" "students" "assessments" "pilot_schools" "mentoring_visits"; do
        COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql \
            -h "$SUPABASE_HOST" \
            -p "$SUPABASE_PORT" \
            -U "$SUPABASE_USER" \
            -d "$SUPABASE_DB" \
            -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null || echo "ERROR")

        if [ "$COUNT" != "ERROR" ]; then
            print_step "$table: $COUNT rows"
        else
            print_error "$table: Failed to query"
        fi
    done
}

create_connection_string() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Creating .env configuration..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    ENV_FILE="${BACKUP_DIR}/.env.supabase"

    cat > "$ENV_FILE" << EOF
# Supabase Database Configuration
# Generated: $(date)

DATABASE_URL="postgresql://${SUPABASE_USER}:${SUPABASE_PASSWORD}@${SUPABASE_HOST}:${SUPABASE_PORT}/${SUPABASE_DB}?schema=public&connection_limit=5&pool_timeout=10"

# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_PROJECT_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cm12dnd3Y2h6bXF0c3Rnd2JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NTk4NDQsImV4cCI6MjA3NTMzNTg0NH0.00MKW0IYlq2qMHBQu4DsMYRz2EoQ4jnJYlXIwvabhQA"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cm12dnd3Y2h6bXF0c3Rnd2JpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc1OTg0NCwiZXhwIjoyMDc1MzM1ODQ0fQ.4TMdVWhsPTLoNig8eOFRaxQXZ2NClbrNZgLrsqVvnMk"

# NextAuth Configuration (copy from existing .env)
NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=

# Server Configuration
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3005/api

# File Upload Configuration
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=5242880

# Session Configuration
SESSION_TIMEOUT=86400000

# Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_BjWHYvEuAxrvzOzx_yMNPwtl7eKE8NJtnHvz3arBhyZsWRz"
EOF

    print_step "Configuration file created: $ENV_FILE"
}

print_summary() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Restore Completed!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Restore log: $RESTORE_LOG"
    echo "Configuration: ${BACKUP_DIR}/.env.supabase"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo ""
    echo "1. Review restore log for any critical errors:"
    echo "   → cat $RESTORE_LOG | grep -i error | grep -v owner | grep -v permission"
    echo ""
    echo "2. Update your project's .env file:"
    echo "   → cp ${BACKUP_DIR}/.env.supabase .env"
    echo "   → cd /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs"
    echo "   → npm run db:generate"
    echo ""
    echo "3. Run verification script:"
    echo "   → ./scripts/03_verify_migration.sh"
    echo ""
    echo "4. Test the application:"
    echo "   → npm run dev"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header
    check_configuration
    check_dependencies
    find_backup_file "$1"
    test_supabase_connection
    check_existing_data
    restore_database
    check_critical_errors
    verify_restore
    create_connection_string
    print_summary
}

# Run main function
main "$@"
