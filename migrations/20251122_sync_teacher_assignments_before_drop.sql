-- Migration: Sync Teacher Assignments Before Dropping Table
-- Date: November 22, 2025
-- Purpose: Restore school access for 4 teachers before dropping unused table
--
-- DISCOVERY:
-- - teacher_school_assignments table has 59 rows
-- - Code uses ONLY User.pilot_school_id (0 references to assignment table)
-- - 61 teachers have pilot_school_id set (actively used)
-- - 59 teachers in assignment table (legacy/stale data)
-- - 4 teachers have assignments but NO pilot_school_id
--   → These teachers currently have NO school access in the app!
--
-- SOLUTION:
-- 1. Sync assignment table data to User.pilot_school_id for 4 teachers
-- 2. Restore their school access
-- 3. Then drop the unused table
--
-- ✅ SAFE: Backup at tarl_pratham_full_20251122_100256.sql.gz

-- Step 1: Show affected teachers BEFORE sync
DO $$
DECLARE
    teacher_record RECORD;
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'TEACHERS MISSING SCHOOL ACCESS';
    RAISE NOTICE '========================================';

    FOR teacher_record IN
        SELECT
            u.id,
            u.name,
            u.email,
            tsa.pilot_school_id,
            ps.school_name,
            tsa.subject
        FROM users u
        JOIN teacher_school_assignments tsa ON u.id = tsa.teacher_id
        LEFT JOIN pilot_schools ps ON tsa.pilot_school_id = ps.id
        WHERE u.role = 'teacher'
          AND u.pilot_school_id IS NULL
          AND tsa.is_active = true
    LOOP
        RAISE NOTICE 'ID: %, Name: %, School: %, Subject: %',
            teacher_record.id,
            teacher_record.name,
            teacher_record.school_name,
            teacher_record.subject;
    END LOOP;
    RAISE NOTICE '========================================';
END $$;

-- Step 2: Sync pilot_school_id from assignment table to user profile
-- This restores school access for 4 teachers
UPDATE users u
SET
    pilot_school_id = tsa.pilot_school_id,
    updated_at = NOW()
FROM teacher_school_assignments tsa
WHERE u.id = tsa.teacher_id
  AND u.role = 'teacher'
  AND u.pilot_school_id IS NULL
  AND tsa.is_active = true;

-- Step 3: Verify sync success
DO $$
DECLARE
    synced_count INTEGER;
    remaining_count INTEGER;
BEGIN
    -- Count newly synced teachers
    SELECT COUNT(DISTINCT u.id) INTO synced_count
    FROM users u
    JOIN teacher_school_assignments tsa ON u.id = tsa.teacher_id
    WHERE u.role = 'teacher'
      AND u.pilot_school_id IS NOT NULL
      AND tsa.is_active = true;

    -- Count any remaining teachers without sync
    SELECT COUNT(DISTINCT u.id) INTO remaining_count
    FROM users u
    JOIN teacher_school_assignments tsa ON u.id = tsa.teacher_id
    WHERE u.role = 'teacher'
      AND u.pilot_school_id IS NULL
      AND tsa.is_active = true;

    RAISE NOTICE '✅ Synced teachers: %', synced_count;

    IF remaining_count > 0 THEN
        RAISE WARNING '⚠️ Still missing pilot_school_id: %', remaining_count;
    ELSE
        RAISE NOTICE '✅ All teachers now have school access';
    END IF;
END $$;

-- Step 4: Show data consistency AFTER sync
SELECT
    'Total teachers' as category,
    COUNT(*) as count
FROM users
WHERE role = 'teacher'

UNION ALL

SELECT
    'Teachers with pilot_school_id (active access)' as category,
    COUNT(*) as count
FROM users
WHERE role = 'teacher' AND pilot_school_id IS NOT NULL

UNION ALL

SELECT
    'Teachers in assignment table (legacy)' as category,
    COUNT(DISTINCT teacher_id) as count
FROM teacher_school_assignments
WHERE is_active = true;

-- Migration complete!
-- Next step: Run 20251122_remove_unused_teacher_assignments.sql to drop the table
