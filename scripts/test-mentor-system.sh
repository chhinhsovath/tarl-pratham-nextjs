#!/bin/bash

# Testing script for Mentor Multi-School Access System
# This script tests the database and APIs to ensure everything is working

echo "🎸 Testing Mentor Multi-School Access System"
echo "=============================================="
echo ""

# Database connection parameters
DB_HOST="aws-1-us-east-1.pooler.supabase.com"
DB_PORT="5432"
DB_USER="postgres.uyrmvvwwchzmqtstgwbi"
DB_NAME="postgres"
DB_PASSWORD="QtMVSsu8uw60WRjK"

echo "📊 Step 1: Checking database table exists..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'mentor_school_assignments'
) as table_exists;
"

echo ""
echo "📊 Step 2: Checking current assignments..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  COUNT(*) as total_assignments,
  COUNT(DISTINCT mentor_id) as unique_mentors,
  COUNT(DISTINCT pilot_school_id) as unique_schools
FROM mentor_school_assignments
WHERE is_active = true;
"

echo ""
echo "📊 Step 3: Sample assignments by subject..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  subject,
  COUNT(*) as assignment_count,
  COUNT(DISTINCT mentor_id) as mentors,
  COUNT(DISTINCT pilot_school_id) as schools
FROM mentor_school_assignments
WHERE is_active = true
GROUP BY subject;
"

echo ""
echo "📊 Step 4: List first 5 assignments..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  msa.id,
  u.name as mentor_name,
  ps.school_name,
  msa.subject,
  msa.assigned_date,
  msa.is_active
FROM mentor_school_assignments msa
LEFT JOIN users u ON msa.mentor_id = u.id
LEFT JOIN pilot_schools ps ON msa.pilot_school_id = ps.id
ORDER BY msa.assigned_date DESC
LIMIT 5;
"

echo ""
echo "📊 Step 5: Check mentors with multiple schools..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(DISTINCT msa.pilot_school_id) as school_count,
  COUNT(*) as total_assignments,
  STRING_AGG(DISTINCT msa.subject, ', ') as subjects
FROM mentor_school_assignments msa
JOIN users u ON msa.mentor_id = u.id
WHERE msa.is_active = true
GROUP BY u.id, u.name, u.email
HAVING COUNT(DISTINCT msa.pilot_school_id) > 1
ORDER BY school_count DESC;
"

echo ""
echo "📊 Step 6: Check backwards compatibility (mentors without assignments)..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
  u.id,
  u.name,
  u.email,
  u.pilot_school_id,
  ps.school_name
FROM users u
LEFT JOIN pilot_schools ps ON u.pilot_school_id = ps.id
WHERE u.role = 'mentor'
  AND u.is_active = true
  AND u.id NOT IN (
    SELECT DISTINCT mentor_id
    FROM mentor_school_assignments
    WHERE is_active = true
  )
LIMIT 5;
"

echo ""
echo "✅ Database tests complete!"
echo ""
echo "🌐 API Testing Instructions:"
echo "1. Start the dev server: npm run dev"
echo "2. Login as a coordinator"
echo "3. Navigate to: http://localhost:3005/coordinator/mentor-assignments"
echo "4. Create test assignment"
echo "5. Login as the assigned mentor"
echo "6. Navigate to: http://localhost:3005/mentor/dashboard"
echo "7. Verify you see all assigned schools"
echo ""
echo "📋 Next Steps:"
echo "- Review documentation: docs/MENTOR_MULTI_SCHOOL_ACCESS.md"
echo "- Test coordinator assignment page: /coordinator/mentor-assignments"
echo "- Test mentor dashboard: /mentor/dashboard"
echo "- Test API endpoints with Postman or curl"
echo ""
echo "🎉 Testing script complete!"
