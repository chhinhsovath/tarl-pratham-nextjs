#!/bin/bash

################################################################################
# TaRL Pratham Database Backup Script
# Purpose: Backup PostgreSQL database before Supabase migration
# Usage: ./01_backup_database.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration (current server)
DB_HOST="157.10.73.52"
DB_PORT="5432"
DB_USER="admin"
DB_NAME="tarl_pratham"
DB_PASSWORD="P@ssw0rd"

# Backup configuration
BACKUP_DIR="$HOME/tarl-migration-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE_CUSTOM="${BACKUP_DIR}/tarl_pratham_${TIMESTAMP}.dump"
BACKUP_FILE_SQL="${BACKUP_DIR}/tarl_pratham_${TIMESTAMP}.sql"
BACKUP_FILE_SCHEMA="${BACKUP_DIR}/tarl_pratham_schema_${TIMESTAMP}.sql"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  TaRL Pratham Database Backup${NC}"
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

check_dependencies() {
    echo "Checking dependencies..."

    if ! command -v pg_dump &> /dev/null; then
        print_error "pg_dump not found. Please install PostgreSQL client tools."
        echo ""
        echo "Install on macOS:"
        echo "  brew install postgresql"
        echo ""
        echo "Install on Ubuntu:"
        echo "  sudo apt-get install postgresql-client"
        exit 1
    fi

    print_step "pg_dump found: $(pg_dump --version)"
}

create_backup_dir() {
    echo ""
    echo "Creating backup directory..."

    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        print_step "Created: $BACKUP_DIR"
    else
        print_step "Directory exists: $BACKUP_DIR"
    fi
}

test_connection() {
    echo ""
    echo "Testing database connection..."

    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        print_step "Connection successful"
    else
        print_error "Cannot connect to database"
        echo ""
        echo "Details:"
        echo "  Host: $DB_HOST"
        echo "  Port: $DB_PORT"
        echo "  User: $DB_USER"
        echo "  Database: $DB_NAME"
        exit 1
    fi
}

get_database_info() {
    echo ""
    echo "Database information:"

    # Get database size
    DB_SIZE=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));")
    echo "  Database size: $DB_SIZE"

    # Get table count
    TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    echo "  Tables: $TABLE_COUNT"

    # Get record counts for key tables
    echo ""
    echo "  Key table counts:"

    USERS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")
    echo "    - users: $USERS_COUNT"

    STUDENTS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM students;" 2>/dev/null || echo "0")
    echo "    - students: $STUDENTS_COUNT"

    ASSESSMENTS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM assessments;" 2>/dev/null || echo "0")
    echo "    - assessments: $ASSESSMENTS_COUNT"

    SCHOOLS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM pilot_schools;" 2>/dev/null || echo "0")
    echo "    - pilot_schools: $SCHOOLS_COUNT"
}

backup_custom_format() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Backup 1/3: Custom format (recommended for restore)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-owner \
        --no-acl \
        -F c \
        -f "$BACKUP_FILE_CUSTOM" \
        -v

    if [ -f "$BACKUP_FILE_CUSTOM" ]; then
        FILE_SIZE=$(ls -lh "$BACKUP_FILE_CUSTOM" | awk '{print $5}')
        print_step "Custom format backup completed: $FILE_SIZE"
        echo "  File: $BACKUP_FILE_CUSTOM"
    else
        print_error "Custom format backup failed"
        exit 1
    fi
}

backup_sql_format() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Backup 2/3: SQL format (human-readable)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-owner \
        --no-acl \
        -f "$BACKUP_FILE_SQL"

    if [ -f "$BACKUP_FILE_SQL" ]; then
        FILE_SIZE=$(ls -lh "$BACKUP_FILE_SQL" | awk '{print $5}')
        print_step "SQL format backup completed: $FILE_SIZE"
        echo "  File: $BACKUP_FILE_SQL"
    else
        print_warning "SQL format backup failed (optional)"
    fi
}

backup_schema_only() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Backup 3/3: Schema only (for verification)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --schema-only \
        --no-owner \
        --no-acl \
        -f "$BACKUP_FILE_SCHEMA"

    if [ -f "$BACKUP_FILE_SCHEMA" ]; then
        FILE_SIZE=$(ls -lh "$BACKUP_FILE_SCHEMA" | awk '{print $5}')
        print_step "Schema-only backup completed: $FILE_SIZE"
        echo "  File: $BACKUP_FILE_SCHEMA"
    else
        print_warning "Schema-only backup failed (optional)"
    fi
}

verify_backup() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Verifying backup integrity..."
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Verify custom format backup
    if pg_restore --list "$BACKUP_FILE_CUSTOM" > /dev/null 2>&1; then
        print_step "Custom format backup is valid"
    else
        print_error "Custom format backup is corrupted!"
        exit 1
    fi

    # Check if SQL file has content
    if [ -f "$BACKUP_FILE_SQL" ]; then
        SQL_LINES=$(wc -l < "$BACKUP_FILE_SQL")
        if [ "$SQL_LINES" -gt 100 ]; then
            print_step "SQL backup has $SQL_LINES lines"
        else
            print_warning "SQL backup seems too small ($SQL_LINES lines)"
        fi
    fi
}

create_backup_manifest() {
    echo ""
    echo "Creating backup manifest..."

    MANIFEST_FILE="${BACKUP_DIR}/backup_manifest_${TIMESTAMP}.txt"

    cat > "$MANIFEST_FILE" << EOF
TaRL Pratham Database Backup Manifest
=====================================

Backup Date: $(date)
Database: $DB_NAME
Host: $DB_HOST:$DB_PORT

Files Created:
--------------
1. Custom Format: $(basename "$BACKUP_FILE_CUSTOM")
   Size: $(ls -lh "$BACKUP_FILE_CUSTOM" | awk '{print $5}')

2. SQL Format: $(basename "$BACKUP_FILE_SQL")
   Size: $(ls -lh "$BACKUP_FILE_SQL" | awk '{print $5}')

3. Schema Only: $(basename "$BACKUP_FILE_SCHEMA")
   Size: $(ls -lh "$BACKUP_FILE_SCHEMA" | awk '{print $5}')

Database Statistics:
-------------------
Database Size: $DB_SIZE
Total Tables: $TABLE_COUNT
Users: $USERS_COUNT
Students: $STUDENTS_COUNT
Assessments: $ASSESSMENTS_COUNT
Pilot Schools: $SCHOOLS_COUNT

Restore Command:
----------------
PGPASSWORD="[YOUR-PASSWORD]" pg_restore \\
  -h [SUPABASE-HOST] \\
  -p 5432 \\
  -U [SUPABASE-USER] \\
  -d postgres \\
  --no-owner \\
  --no-acl \\
  --clean \\
  --if-exists \\
  -v \\
  $(basename "$BACKUP_FILE_CUSTOM")

Next Steps:
-----------
1. Get Supabase database connection string
2. Run: ./02_restore_to_supabase.sh
3. Verify migration with: ./03_verify_migration.sh

EOF

    print_step "Manifest created: $MANIFEST_FILE"
}

print_summary() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Backup Completed Successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Backup location: $BACKUP_DIR"
    echo ""
    echo "Files created:"
    ls -lh "$BACKUP_DIR"/*${TIMESTAMP}* | awk '{print "  " $9 " (" $5 ")"}'
    echo ""
    echo -e "${YELLOW}⚠  IMPORTANT: Keep these backup files safe!${NC}"
    echo "   These are your only restore point if migration fails."
    echo ""
    echo "Next steps:"
    echo "  1. Get Supabase database connection string"
    echo "     → https://supabase.com/dashboard/project/cftkquoslfwkwavhkspu"
    echo "     → Settings → Database → Connection string (URI mode)"
    echo ""
    echo "  2. Update restore script with Supabase credentials:"
    echo "     → Edit: scripts/02_restore_to_supabase.sh"
    echo ""
    echo "  3. Run restore script:"
    echo "     → ./scripts/02_restore_to_supabase.sh"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header
    check_dependencies
    create_backup_dir
    test_connection
    get_database_info
    backup_custom_format
    backup_sql_format
    backup_schema_only
    verify_backup
    create_backup_manifest
    print_summary
}

# Run main function
main
