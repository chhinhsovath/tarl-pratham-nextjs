#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TaRL Pratham - Database Migration to Supabase
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# This script migrates the database from self-hosted PostgreSQL to Supabase
# Source: postgresql://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham
# Target: Supabase project blvvksvorllayhejrxpo
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# CONNECTION STRINGS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Source database (self-hosted PostgreSQL)
SOURCE_HOST="157.10.73.82"
SOURCE_PORT="5432"
SOURCE_USER="admin"
SOURCE_PASSWORD="P@ssw0rd"
SOURCE_DATABASE="tarl_pratham"
SOURCE_URL="postgresql://${SOURCE_USER}:${SOURCE_PASSWORD}@${SOURCE_HOST}:${SOURCE_PORT}/${SOURCE_DATABASE}"

# Target database (Supabase)
SUPABASE_PROJECT_ID="blvvksvorllayhejrxpo"
SUPABASE_PASSWORD="ZJoDImJMwTAMW3Yf"
SUPABASE_REGION="ap-southeast-1"  # Adjust if different

# Supabase connection URLs
# Direct connection (for migration and schema operations)
SUPABASE_DIRECT_URL="postgresql://postgres.${SUPABASE_PROJECT_ID}:${SUPABASE_PASSWORD}@db.${SUPABASE_PROJECT_ID}.supabase.co:5432/postgres"

# Pooler connection (for application use - Supavisor pooler)
SUPABASE_POOLER_URL="postgresql://postgres.${SUPABASE_PROJECT_ID}:${SUPABASE_PASSWORD}@aws-0-${SUPABASE_REGION}.pooler.supabase.com:6543/postgres"

# Backup directory
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="${BACKUP_DIR}/tarl_pratham_to_supabase_${TIMESTAMP}.dump"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FUNCTIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MAIN MIGRATION PROCESS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "TaRL Pratham - Database Migration to Supabase"
log_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Create backup directory
log_info "Step 1: Creating backup directory..."
mkdir -p "$BACKUP_DIR"
log_success "Backup directory ready: $BACKUP_DIR"
echo ""

# Step 2: Test source database connection
log_info "Step 2: Testing source database connection..."
if PGPASSWORD="$SOURCE_PASSWORD" psql -h "$SOURCE_HOST" -U "$SOURCE_USER" -d "$SOURCE_DATABASE" -p "$SOURCE_PORT" -c "SELECT version();" > /dev/null 2>&1; then
    log_success "Source database connection successful"

    # Get table counts
    log_info "Getting source database statistics..."
    PGPASSWORD="$SOURCE_PASSWORD" psql -h "$SOURCE_HOST" -U "$SOURCE_USER" -d "$SOURCE_DATABASE" -p "$SOURCE_PORT" -c "
        SELECT
            schemaname,
            tablename,
            (SELECT COUNT(*) FROM pg_class WHERE relname = tablename AND relkind = 'r') as row_count
        FROM pg_tables
        WHERE schemaname = 'public'
        ORDER BY tablename;
    "
else
    log_error "Cannot connect to source database"
    exit 1
fi
echo ""

# Step 3: Test Supabase connection
log_info "Step 3: Testing Supabase connection..."
if PGPASSWORD="$SUPABASE_PASSWORD" psql "${SUPABASE_DIRECT_URL}" -c "SELECT version();" > /dev/null 2>&1; then
    log_success "Supabase connection successful"
else
    log_error "Cannot connect to Supabase"
    log_info "Please check:"
    log_info "  1. Project ID: $SUPABASE_PROJECT_ID"
    log_info "  2. Database password is correct"
    log_info "  3. Supabase project is active"
    exit 1
fi
echo ""

# Step 4: Dump source database
log_info "Step 4: Dumping source database..."
log_info "This may take several minutes depending on database size..."

PGPASSWORD="$SOURCE_PASSWORD" pg_dump \
    -h "$SOURCE_HOST" \
    -U "$SOURCE_USER" \
    -d "$SOURCE_DATABASE" \
    -p "$SOURCE_PORT" \
    -F c \
    -b \
    -v \
    -f "$DUMP_FILE" 2>&1 | grep -v "NOTICE"

if [ -f "$DUMP_FILE" ]; then
    DUMP_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
    log_success "Database dump created: $DUMP_FILE ($DUMP_SIZE)"
else
    log_error "Database dump failed"
    exit 1
fi
echo ""

# Step 5: Backup existing Supabase data (optional but recommended)
log_warning "Step 5: Backing up existing Supabase data (if any)..."
SUPABASE_BACKUP_FILE="${BACKUP_DIR}/supabase_backup_before_migration_${TIMESTAMP}.dump"

PGPASSWORD="$SUPABASE_PASSWORD" pg_dump \
    "${SUPABASE_DIRECT_URL}" \
    -F c \
    -b \
    -v \
    -f "$SUPABASE_BACKUP_FILE" 2>&1 | grep -v "NOTICE" || log_warning "Supabase backup skipped (database may be empty)"

if [ -f "$SUPABASE_BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$SUPABASE_BACKUP_FILE" | cut -f1)
    log_success "Supabase backup created: $SUPABASE_BACKUP_FILE ($BACKUP_SIZE)"
fi
echo ""

# Step 6: Restore to Supabase
log_warning "Step 6: Restoring database to Supabase..."
log_warning "This will overwrite any existing data in the Supabase database!"
echo ""
read -p "Continue with restoration? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log_info "Migration cancelled by user"
    exit 0
fi

log_info "Starting restoration to Supabase..."

# Restore with --clean to drop existing objects first
# Use --if-exists to avoid errors if objects don't exist
# --no-owner and --no-acl because Supabase manages permissions
PGPASSWORD="$SUPABASE_PASSWORD" pg_restore \
    --dbname="${SUPABASE_DIRECT_URL}" \
    --clean \
    --if-exists \
    --no-owner \
    --no-acl \
    --verbose \
    "$DUMP_FILE" 2>&1 | grep -E "(restoring|creating|ERROR)" || true

log_success "Database restoration completed"
echo ""

# Step 7: Verify migration
log_info "Step 7: Verifying migration..."

echo "Checking table counts in Supabase..."
PGPASSWORD="$SUPABASE_PASSWORD" psql "${SUPABASE_DIRECT_URL}" -c "
    SELECT
        schemaname,
        tablename,
        n_tup_ins as row_count
    FROM pg_stat_user_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
"
echo ""

# Step 8: Update .env file with Supabase credentials
log_info "Step 8: Creating new .env file for Supabase..."

ENV_FILE=".env.supabase"
cat > "$ENV_FILE" << 'ENVEOF'
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# TaRL Pratham - Supabase Configuration
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# Migrated: TIMESTAMP_PLACEHOLDER
# Project ID: SUPABASE_PROJECT_ID_PLACEHOLDER
# Project URL: https://SUPABASE_PROJECT_ID_PLACEHOLDER.supabase.co
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# DATABASE CONFIGURATION - Supabase
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Primary Database URL (Pooler - for application use)
# Recommended for serverless environments (Vercel, Netlify, etc.)
DATABASE_URL="postgresql://postgres.blvvksvorllayhejrxpo:ZJoDImJMwTAMW3Yf@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Prisma-specific URL (Pooler for connection pooling)
POSTGRES_PRISMA_URL="postgresql://postgres.blvvksvorllayhejrxpo:ZJoDImJMwTAMW3Yf@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Non-pooling URL (Direct connection - for migrations and schema operations)
# Use this for: npm run db:migrate, npm run db:push, npm run db:studio
POSTGRES_URL_NON_POOLING="postgresql://postgres.blvvksvorllayhejrxpo:ZJoDImJMwTAMW3Yf@db.blvvksvorllayhejrxpo.supabase.co:5432/postgres"

# Individual connection parameters
POSTGRES_HOST="db.blvvksvorllayhejrxpo.supabase.co"
POSTGRES_PORT="5432"
POSTGRES_USER="postgres.blvvksvorllayhejrxpo"
POSTGRES_PASSWORD="ZJoDImJMwTAMW3Yf"
POSTGRES_DATABASE="postgres"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SUPABASE API CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXT_PUBLIC_SUPABASE_URL="https://blvvksvorllayhejrxpo.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdnZrc3ZvcmxsYXloZWpyeHBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwMDU5NTMsImV4cCI6MjA4MTU4MTk1M30.-bXEvfPV3cfVdlahyDPCaQrs2JBYmWYb6tEELfzxRwM"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdnZrc3ZvcmxsYXloZWpyeHBvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjAwNTk1MywiZXhwIjoyMDgxNTgxOTUzfQ.0WUIgmQhGoY9pmjvTvLLDyTWV1rWCKlRcbZv_d-KX8c"

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NEXTAUTH CONFIGURATION (Keep existing)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NEXTAUTH_URL=http://localhost:3005
NEXTAUTH_SECRET=5ZIzBW/SBr7fIKlZT4LQCpNRnA1wnn7LTnAwx5bNvO0=

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SERVER CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3005/api

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# FILE UPLOAD CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

# Use Supabase Storage or keep Vercel Blob
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_BjWHYvEuAxrvzOzx_yMNPwtl7eKE8NJtnHvz3arBhyZsWRz"
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=5242880

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# SESSION CONFIGURATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SESSION_TIMEOUT=86400000

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# NOTES
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# Migration completed: TIMESTAMP_PLACEHOLDER
# Source: postgresql://admin:P@ssw0rd@157.10.73.82:5432/tarl_pratham
# Target: Supabase project blvvksvorllayhejrxpo
#
# To use this configuration:
# 1. Copy this file to .env: cp .env.supabase .env
# 2. Regenerate Prisma client: npm run db:generate
# 3. Restart your development server: npm run dev
#
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENVEOF

sed -i "" "s/TIMESTAMP_PLACEHOLDER/${TIMESTAMP}/g" "$ENV_FILE"
sed -i "" "s/SUPABASE_PROJECT_ID_PLACEHOLDER/${SUPABASE_PROJECT_ID}/g" "$ENV_FILE"

log_success "Supabase .env file created: $ENV_FILE"
echo ""

# Step 9: Summary
log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_success "Migration Completed Successfully!"
log_success "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
log_info "Summary:"
log_info "  Source dump: $DUMP_FILE"
log_info "  Supabase backup: $SUPABASE_BACKUP_FILE"
log_info "  New .env file: $ENV_FILE"
echo ""
log_info "Next steps:"
log_info "  1. Review the table counts above to verify all data migrated"
log_info "  2. Copy the new .env file: cp $ENV_FILE .env"
log_info "  3. Regenerate Prisma client: npm run db:generate"
log_info "  4. Test your application: npm run dev"
log_info "  5. Update production environment variables with Supabase URLs"
echo ""
log_warning "Important notes:"
log_warning "  - Use POOLER URL (port 6543) for your application (DATABASE_URL)"
log_warning "  - Use DIRECT URL (port 5432) for migrations (POSTGRES_URL_NON_POOLING)"
log_warning "  - Keep the backup files in case you need to rollback"
echo ""
log_info "Supabase Dashboard: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_ID}"
echo ""
