#!/bin/bash

################################################################################
# TaRL Pratham Migration Verification Script
# Purpose: Verify database migration from old server to Supabase
# Usage: ./03_verify_migration.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

################################################################################
# Configuration
################################################################################

# Old database (source)
OLD_DB_HOST="157.10.73.52"
OLD_DB_PORT="5432"
OLD_DB_USER="admin"
OLD_DB_NAME="tarl_pratham"
OLD_DB_PASSWORD="P@ssw0rd"

# Supabase database (target) - read from .env or prompt
SUPABASE_HOST=""
SUPABASE_PORT="5432"
SUPABASE_USER=""
SUPABASE_DB="postgres"
SUPABASE_PASSWORD=""

# Results tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

VERIFICATION_LOG="$HOME/tarl-migration-backup/verification_$(date +%Y%m%d_%H%M%S).log"

################################################################################
# Functions
################################################################################

print_header() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  TaRL Pratham Migration Verification${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_warning() {
    echo -e "${YELLOW}⚠${NC}  $1"
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

print_info() {
    echo -e "${BLUE}ℹ${NC}  $1"
}

load_supabase_config() {
    print_section "Loading Supabase Configuration"

    # Try to load from .env file
    if [ -f ".env" ]; then
        print_info "Found .env file, attempting to parse..."

        # Extract DATABASE_URL
        DATABASE_URL=$(grep "^DATABASE_URL=" .env | cut -d'=' -f2- | tr -d '"' | tr -d "'")

        if [ -n "$DATABASE_URL" ]; then
            # Parse connection string
            # Format: postgresql://user:password@host:port/database?params

            # Extract user
            SUPABASE_USER=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

            # Extract password
            SUPABASE_PASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')

            # Extract host
            SUPABASE_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')

            # Extract port
            SUPABASE_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

            if [ -z "$SUPABASE_PORT" ]; then
                SUPABASE_PORT="5432"
            fi

            print_pass "Loaded configuration from .env"
            echo "  Host: $SUPABASE_HOST"
            echo "  Port: $SUPABASE_PORT"
            echo "  User: $SUPABASE_USER"
        else
            print_warning "Could not parse DATABASE_URL from .env"
        fi
    fi

    # Prompt for missing values
    if [ -z "$SUPABASE_HOST" ] || [ -z "$SUPABASE_USER" ] || [ -z "$SUPABASE_PASSWORD" ]; then
        echo ""
        print_warning "Missing Supabase configuration. Please provide:"
        echo ""

        if [ -z "$SUPABASE_HOST" ]; then
            read -p "  Supabase Host (e.g., aws-0-us-east-1.pooler.supabase.com): " SUPABASE_HOST
        fi

        if [ -z "$SUPABASE_USER" ]; then
            read -p "  Supabase User (e.g., postgres.cftkquoslfwkwavhkspu): " SUPABASE_USER
        fi

        if [ -z "$SUPABASE_PASSWORD" ]; then
            read -s -p "  Supabase Password: " SUPABASE_PASSWORD
            echo ""
        fi
    fi

    # Validate configuration
    if [ -z "$SUPABASE_HOST" ] || [ -z "$SUPABASE_USER" ] || [ -z "$SUPABASE_PASSWORD" ]; then
        print_fail "Incomplete Supabase configuration"
        exit 1
    fi
}

test_connections() {
    print_section "Testing Database Connections"

    # Test old database
    echo "Testing source database (old server)..."
    if PGPASSWORD="$OLD_DB_PASSWORD" psql -h "$OLD_DB_HOST" -p "$OLD_DB_PORT" -U "$OLD_DB_USER" -d "$OLD_DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
        print_pass "Source database connection successful"
    else
        print_warning "Cannot connect to source database (comparison will be skipped)"
    fi

    # Test Supabase
    echo ""
    echo "Testing Supabase database..."
    if PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -c "SELECT 1;" > /dev/null 2>&1; then
        print_pass "Supabase database connection successful"
    else
        print_fail "Cannot connect to Supabase database"
        exit 1
    fi
}

compare_table_counts() {
    print_section "Comparing Table Counts"

    # Get table count from old DB
    OLD_TABLE_COUNT=$(PGPASSWORD="$OLD_DB_PASSWORD" psql -h "$OLD_DB_HOST" -p "$OLD_DB_PORT" -U "$OLD_DB_USER" -d "$OLD_DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs || echo "0")

    # Get table count from Supabase
    NEW_TABLE_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs)

    echo "  Source database: $OLD_TABLE_COUNT tables"
    echo "  Supabase:        $NEW_TABLE_COUNT tables"

    if [ "$OLD_TABLE_COUNT" -eq "$NEW_TABLE_COUNT" ]; then
        print_pass "Table counts match"
    else
        print_warning "Table counts differ (expected $OLD_TABLE_COUNT, got $NEW_TABLE_COUNT)"
    fi

    # Expected table count from Prisma schema
    if [ "$NEW_TABLE_COUNT" -ge 30 ]; then
        print_pass "Supabase has sufficient tables (≥30)"
    else
        print_fail "Supabase has only $NEW_TABLE_COUNT tables (expected ~31)"
    fi
}

compare_row_counts() {
    print_section "Comparing Row Counts for Key Tables"

    # Define key tables
    TABLES=("users" "students" "assessments" "pilot_schools" "mentoring_visits" "teaching_activities" "quick_login_users" "audit_logs")

    for table in "${TABLES[@]}"; do
        echo ""
        echo "Table: $table"

        # Get count from old DB
        OLD_COUNT=$(PGPASSWORD="$OLD_DB_PASSWORD" psql -h "$OLD_DB_HOST" -p "$OLD_DB_PORT" -U "$OLD_DB_USER" -d "$OLD_DB_NAME" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | xargs || echo "ERROR")

        # Get count from Supabase
        NEW_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | xargs || echo "ERROR")

        if [ "$OLD_COUNT" = "ERROR" ] || [ "$NEW_COUNT" = "ERROR" ]; then
            print_warning "Could not query $table"
        else
            echo "  Source: $OLD_COUNT rows"
            echo "  Supabase: $NEW_COUNT rows"

            if [ "$OLD_COUNT" = "$NEW_COUNT" ]; then
                print_pass "$table: Row counts match"
            else
                print_fail "$table: Row counts differ (expected $OLD_COUNT, got $NEW_COUNT)"
            fi
        fi
    done
}

verify_foreign_keys() {
    print_section "Verifying Foreign Key Relationships"

    echo "Checking foreign key constraints..."

    FK_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public';" 2>/dev/null | xargs)

    echo "  Foreign key constraints: $FK_COUNT"

    if [ "$FK_COUNT" -gt 20 ]; then
        print_pass "Foreign keys present ($FK_COUNT constraints)"
    else
        print_warning "Only $FK_COUNT foreign key constraints found"
    fi

    # Test specific relationships
    echo ""
    echo "Testing key relationships..."

    # Students → pilot_schools
    STUDENTS_WITH_SCHOOLS=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM students WHERE pilot_school_id IS NOT NULL;" 2>/dev/null | xargs)

    echo "  Students with pilot_school_id: $STUDENTS_WITH_SCHOOLS"

    # Assessments → students
    ASSESSMENTS_WITH_STUDENTS=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM assessments WHERE student_id IS NOT NULL;" 2>/dev/null | xargs)

    echo "  Assessments with student_id: $ASSESSMENTS_WITH_STUDENTS"

    # Mentoring visits → users
    VISITS_WITH_MENTORS=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM mentoring_visits WHERE mentor_id IS NOT NULL;" 2>/dev/null | xargs)

    echo "  Mentoring visits with mentor_id: $VISITS_WITH_MENTORS"

    print_pass "Foreign key relationships preserved"
}

verify_indexes() {
    print_section "Verifying Indexes"

    INDEX_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';" 2>/dev/null | xargs)

    echo "  Total indexes: $INDEX_COUNT"

    if [ "$INDEX_COUNT" -gt 50 ]; then
        print_pass "Indexes present ($INDEX_COUNT indexes)"
    else
        print_warning "Only $INDEX_COUNT indexes found (expected 50+)"
    fi

    # Check key indexes
    echo ""
    echo "Checking key indexes..."

    KEY_INDEXES=(
        "users_email_idx"
        "students_pilot_school_id_idx"
        "assessments_student_id_idx"
        "assessments_assessment_type_idx"
        "mentoring_visits_mentor_id_idx"
    )

    for idx in "${KEY_INDEXES[@]}"; do
        EXISTS=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM pg_indexes WHERE indexname = '$idx';" 2>/dev/null | xargs)

        if [ "$EXISTS" = "1" ]; then
            echo -e "  ${GREEN}✓${NC} $idx"
        else
            echo -e "  ${YELLOW}⚠${NC}  $idx (not found)"
        fi
    done
}

verify_enums() {
    print_section "Verifying Enum Types"

    # Check RecordStatus enum
    ENUM_COUNT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM pg_type WHERE typname = 'RecordStatus';" 2>/dev/null | xargs)

    if [ "$ENUM_COUNT" = "1" ]; then
        print_pass "RecordStatus enum exists"

        # Check enum values
        ENUM_VALUES=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'RecordStatus');" 2>/dev/null | xargs)

        echo "  Values: $ENUM_VALUES"
    else
        print_fail "RecordStatus enum not found"
    fi
}

verify_data_integrity() {
    print_section "Verifying Data Integrity"

    # Check for NULL values in critical fields
    echo "Checking for NULL values in critical fields..."

    # Users without email
    USERS_NO_EMAIL=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM users WHERE email IS NULL;" 2>/dev/null | xargs)

    if [ "$USERS_NO_EMAIL" = "0" ]; then
        print_pass "All users have email addresses"
    else
        print_warning "$USERS_NO_EMAIL users without email addresses"
    fi

    # Students without names
    STUDENTS_NO_NAME=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM students WHERE name IS NULL OR name = '';" 2>/dev/null | xargs)

    if [ "$STUDENTS_NO_NAME" = "0" ]; then
        print_pass "All students have names"
    else
        print_warning "$STUDENTS_NO_NAME students without names"
    fi

    # Assessments without students
    ASSESSMENTS_NO_STUDENT=$(PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM assessments WHERE student_id IS NULL;" 2>/dev/null | xargs)

    if [ "$ASSESSMENTS_NO_STUDENT" = "0" ]; then
        print_pass "All assessments linked to students"
    else
        print_fail "$ASSESSMENTS_NO_STUDENT assessments without student_id"
    fi
}

test_queries() {
    print_section "Testing Common Queries"

    echo "Running typical application queries..."

    # Query 1: Get active users by role
    echo ""
    echo "Query 1: Active users by role"
    PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -c "SELECT role, COUNT(*) FROM users WHERE is_active = true GROUP BY role;" 2>&1 | head -10

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_pass "User role query successful"
    else
        print_fail "User role query failed"
    fi

    # Query 2: Assessment counts by type
    echo ""
    echo "Query 2: Assessment counts by type"
    PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -c "SELECT assessment_type, COUNT(*) FROM assessments GROUP BY assessment_type;" 2>&1 | head -10

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_pass "Assessment query successful"
    else
        print_fail "Assessment query failed"
    fi

    # Query 3: Students with assessments (JOIN test)
    echo ""
    echo "Query 3: Testing JOIN query"
    PGPASSWORD="$SUPABASE_PASSWORD" psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -t -c "SELECT COUNT(*) FROM students s JOIN assessments a ON s.id = a.student_id;" 2>/dev/null | xargs

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_pass "JOIN query successful"
    else
        print_fail "JOIN query failed"
    fi
}

print_summary() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  Verification Summary${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  Total checks: $TOTAL_CHECKS"
    echo -e "  ${GREEN}Passed:${NC}      $PASSED_CHECKS"
    echo -e "  ${RED}Failed:${NC}      $FAILED_CHECKS"
    echo -e "  ${YELLOW}Warnings:${NC}    $WARNING_CHECKS"
    echo ""

    # Calculate success rate
    if [ $TOTAL_CHECKS -gt 0 ]; then
        SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
        echo "  Success rate: $SUCCESS_RATE%"
    fi

    echo ""
    echo "Verification log: $VERIFICATION_LOG"
    echo ""

    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}  ✓ Migration Verified Successfully!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Next steps:"
        echo "  1. Test application: npm run dev"
        echo "  2. Test login flows"
        echo "  3. Test CRUD operations"
        echo "  4. Review warnings (if any)"
    else
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${RED}  ✗ Migration Has Issues${NC}"
        echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo "Please review failed checks and consider:"
        echo "  1. Re-running the restore script"
        echo "  2. Checking restore.log for errors"
        echo "  3. Verifying Supabase configuration"
    fi

    echo ""
}

################################################################################
# Main Execution
################################################################################

main() {
    # Redirect all output to log file while also showing on screen
    {
        print_header
        load_supabase_config
        test_connections
        compare_table_counts
        compare_row_counts
        verify_foreign_keys
        verify_indexes
        verify_enums
        verify_data_integrity
        test_queries
        print_summary
    } 2>&1 | tee "$VERIFICATION_LOG"
}

# Run main function
main
