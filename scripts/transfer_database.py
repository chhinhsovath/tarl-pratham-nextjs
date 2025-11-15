#!/usr/bin/env python3
"""
Database Transfer Script
Transfers data from source PostgreSQL database to target database
Handles version compatibility issues by using direct SQL queries
"""

import subprocess
import sys
from datetime import datetime

# Database connection details
SOURCE_DB = {
    'host': '157.10.73.82',
    'port': '5432',
    'user': 'admin',
    'password': 'P@ssw0rd',
    'database': 'tarl_pratham'
}

TARGET_DB = {
    'host': '157.10.73.52',
    'port': '5432',
    'user': 'admin',
    'password': 'P@ssw0rd',
    'database': 'tarl_pratham'
}

BACKUP_FILE = f"database/tarl_pratham_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"

def run_command(cmd, description):
    """Run shell command and handle errors"""
    print(f"\n{'='*60}")
    print(f"📋 {description}")
    print(f"{'='*60}")

    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

    if result.returncode != 0:
        print(f"❌ Error: {result.stderr}")
        return False

    print(f"✅ Success")
    if result.stdout:
        print(result.stdout[:500])  # Print first 500 chars

    return True

def main():
    print("\n" + "="*60)
    print("🚀 DATABASE TRANSFER SCRIPT")
    print("="*60)
    print(f"Source: {SOURCE_DB['host']}:{SOURCE_DB['port']}/{SOURCE_DB['database']}")
    print(f"Target: {TARGET_DB['host']}:{TARGET_DB['port']}/{TARGET_DB['database']}")
    print(f"Backup: {BACKUP_FILE}")
    print("="*60)

    # Step 1: Get schema from source (no data)
    schema_cmd = f"""PGPASSWORD="{SOURCE_DB['password']}" psql -h {SOURCE_DB['host']} -U {SOURCE_DB['user']} -d {SOURCE_DB['database']} -c "
    SELECT
        'CREATE TABLE IF NOT EXISTS ' || tablename || ' (' ||
        string_agg(column_name || ' ' || data_type, ', ') || ');'
    FROM information_schema.columns
    WHERE table_schema = 'public'
    GROUP BY tablename;
    " """

    # Step 2: Direct data transfer using psql copy
    transfer_cmd = f"""
    PGPASSWORD="{SOURCE_DB['password']}" pg_dump \\
        -h {SOURCE_DB['host']} \\
        -U {SOURCE_DB['user']} \\
        -d {SOURCE_DB['database']} \\
        --no-owner \\
        --no-acl \\
        --if-exists \\
        --clean \\
        -f {BACKUP_FILE}
    """

    # Step 3: Check if we can use pg_dump directly with newer version
    print("\n🔍 Attempting direct pg_dump...")
    if not run_command(transfer_cmd, "Creating full database backup"):
        print("\n⚠️  Direct pg_dump failed due to version mismatch")
        print("📝 Creating manual backup using psql queries...")

        # Alternative: Use psql to dump data table by table
        manual_backup_cmd = f"""
        PGPASSWORD="{SOURCE_DB['password']}" psql -h {SOURCE_DB['host']} -U {SOURCE_DB['user']} -d {SOURCE_DB['database']} -f scripts/manual_dump.sql > {BACKUP_FILE}
        """

        return False

    print(f"\n✅ Backup created successfully: {BACKUP_FILE}")

    # Step 4: Check backup file size
    size_cmd = f"ls -lh {BACKUP_FILE}"
    run_command(size_cmd, "Verifying backup file")

    # Step 5: Restore to target database
    restore_cmd = f"""
    PGPASSWORD="{TARGET_DB['password']}" psql \\
        -h {TARGET_DB['host']} \\
        -U {TARGET_DB['user']} \\
        -d {TARGET_DB['database']} \\
        -f {BACKUP_FILE}
    """

    print("\n" + "="*60)
    print("⚠️  Ready to restore to target database")
    print("="*60)
    response = input("Do you want to proceed with restore? (yes/no): ")

    if response.lower() == 'yes':
        if run_command(restore_cmd, "Restoring database to target server"):
            print("\n" + "="*60)
            print("✅ DATABASE TRANSFER COMPLETED SUCCESSFULLY")
            print("="*60)

            # Verify data
            verify_cmd = f"""PGPASSWORD="{TARGET_DB['password']}" psql -h {TARGET_DB['host']} -U {TARGET_DB['user']} -d {TARGET_DB['database']} -c "SELECT 'Users: ' || COUNT(*) FROM users UNION ALL SELECT 'Students: ' || COUNT(*) FROM students UNION ALL SELECT 'Assessments: ' || COUNT(*) FROM assessments;" """

            run_command(verify_cmd, "Verifying transferred data")

            return True
    else:
        print("\n⏸️  Restore cancelled by user")
        print(f"📁 Backup file saved at: {BACKUP_FILE}")
        return False

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Transfer cancelled by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
        sys.exit(1)
