#!/bin/bash

################################################################################
# TaRL Pratham Database Backup Script
# Database Server: 157.10.73.82
# Usage: ./backup_database_82.sh
################################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Database configuration from .env.52
DB_HOST="157.10.73.82"
DB_PORT="5432"
DB_USER="admin"
DB_NAME="tarl_pratham"
DB_PASSWORD="P@ssw0rd"

# Backup configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE_SQL="${BACKUP_DIR}/tarl_pratham_full_${TIMESTAMP}.sql"
BACKUP_FILE_COMPRESSED="${BACKUP_DIR}/tarl_pratham_full_${TIMESTAMP}.sql.gz"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  TaRL Pratham Database Full Backup${NC}"
    echo -e "${BLUE}  Server: ${DB_HOST}:${DB_PORT}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

create_backup_dir() {
    if [ ! -d "$BACKUP_DIR" ]; then
        mkdir -p "$BACKUP_DIR"
        echo -e "${GREEN}✓${NC} Created backup directory: $BACKUP_DIR"
    else
        echo -e "${GREEN}✓${NC} Backup directory exists: $BACKUP_DIR"
    fi
}

test_connection() {
    echo ""
    echo "Testing database connection..."

    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Connection successful"
    else
        echo -e "${YELLOW}✗${NC} Cannot connect to database"
        echo ""
        echo "Connection details:"
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
    DB_SIZE=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT pg_size_pretty(pg_database_size('$DB_NAME'));" 2>/dev/null | tr -d ' ')
    echo "  Database size: $DB_SIZE"

    # Get table count
    TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    echo "  Total tables: $TABLE_COUNT"

    # Get key table counts
    echo ""
    echo "  Key table record counts:"

    USERS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')
    echo "    - users: $USERS_COUNT"

    STUDENTS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM students;" 2>/dev/null | tr -d ' ')
    echo "    - students: $STUDENTS_COUNT"

    ASSESSMENTS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM assessments;" 2>/dev/null | tr -d ' ')
    echo "    - assessments: $ASSESSMENTS_COUNT"

    SCHOOLS_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM pilot_schools;" 2>/dev/null | tr -d ' ')
    echo "    - pilot_schools: $SCHOOLS_COUNT"
}

backup_database() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo "Creating full database backup..."
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Create SQL backup
    PGPASSWORD="$DB_PASSWORD" pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        -f "$BACKUP_FILE_SQL"

    if [ -f "$BACKUP_FILE_SQL" ]; then
        FILE_SIZE=$(ls -lh "$BACKUP_FILE_SQL" | awk '{print $5}')
        echo -e "${GREEN}✓${NC} SQL backup created: $FILE_SIZE"
        echo "  File: $BACKUP_FILE_SQL"

        # Compress the backup
        echo ""
        echo "Compressing backup..."
        gzip -c "$BACKUP_FILE_SQL" > "$BACKUP_FILE_COMPRESSED"

        if [ -f "$BACKUP_FILE_COMPRESSED" ]; then
            COMPRESSED_SIZE=$(ls -lh "$BACKUP_FILE_COMPRESSED" | awk '{print $5}')
            echo -e "${GREEN}✓${NC} Compressed backup created: $COMPRESSED_SIZE"
            echo "  File: $BACKUP_FILE_COMPRESSED"

            # Remove uncompressed file to save space
            rm "$BACKUP_FILE_SQL"
            echo -e "${GREEN}✓${NC} Removed uncompressed file (keeping .gz only)"
        fi
    else
        echo -e "${YELLOW}✗${NC} Backup failed"
        exit 1
    fi
}

print_summary() {
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  Backup Completed Successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Backup file: $BACKUP_FILE_COMPRESSED"

    if [ -f "$BACKUP_FILE_COMPRESSED" ]; then
        echo "File size: $(ls -lh "$BACKUP_FILE_COMPRESSED" | awk '{print $5}')"
    fi

    echo ""
    echo -e "${YELLOW}⚠  IMPORTANT: Keep this backup file safe!${NC}"
    echo ""
    echo "To restore this backup:"
    echo ""
    echo "  # Step 1: Decompress"
    echo "  gunzip -k $BACKUP_FILE_COMPRESSED"
    echo ""
    echo "  # Step 2: Drop and recreate database (CAREFUL!)"
    echo "  PGPASSWORD=\"P@ssw0rd\" psql -h $DB_HOST -U $DB_USER -d postgres -c \"DROP DATABASE IF EXISTS $DB_NAME;\""
    echo "  PGPASSWORD=\"P@ssw0rd\" psql -h $DB_HOST -U $DB_USER -d postgres -c \"CREATE DATABASE $DB_NAME;\""
    echo ""
    echo "  # Step 3: Restore"
    echo "  PGPASSWORD=\"P@ssw0rd\" psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f ${BACKUP_FILE_SQL}"
    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    print_header
    create_backup_dir
    test_connection
    get_database_info
    backup_database
    print_summary
}

# Run main function
main
