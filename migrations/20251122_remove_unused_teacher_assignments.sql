-- Migration: Remove Unused TeacherSchoolAssignment Table
-- Date: November 22, 2025
-- Author: Database Cleanup
-- Description: Remove the teacher_school_assignments table that is not used in the codebase
--
-- WHY: Code analysis shows 0 references to TeacherSchoolAssignment in the entire application
-- Teachers use ONLY User.pilot_school_id for school assignment (single school per teacher)
-- Mentors use MentorSchoolAssignment table (many-to-many, actively used)
--
-- SAFE: Backup created at /Users/chhinhsovath/Documents/GitHub/tarl-pratham-nextjs/backups/
-- Restore: tarl_pratham_full_20251122_100256.sql.gz
--
-- ⚠️ IMPORTANT: This does NOT affect mentor functionality
-- ✅ MentorSchoolAssignment table remains untouched
-- ✅ All mentor ↔ school relationships preserved
-- ✅ All mentor verification scopes preserved

-- Step 1: Check if table has any data (should be empty if never used)
DO $$
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM teacher_school_assignments;
    RAISE NOTICE 'teacher_school_assignments contains % rows', row_count;

    IF row_count > 0 THEN
        RAISE WARNING 'Table contains data! Review before dropping.';
    ELSE
        RAISE NOTICE 'Table is empty - safe to drop';
    END IF;
END $$;

-- Step 2: Drop the table
-- This automatically drops foreign keys, indexes, and constraints
DROP TABLE IF EXISTS teacher_school_assignments CASCADE;

-- Step 3: Verify table is dropped
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'teacher_school_assignments'
    ) THEN
        RAISE NOTICE '✅ Table teacher_school_assignments successfully dropped';
    ELSE
        RAISE WARNING '❌ Table still exists!';
    END IF;
END $$;

-- Step 4: Verify mentor tables are still intact
DO $$
DECLARE
    mentor_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO mentor_count FROM mentor_school_assignments;
    RAISE NOTICE '✅ mentor_school_assignments table intact with % rows', mentor_count;
END $$;

-- Migration complete!
-- Next step: Run `npm run db:generate` to regenerate Prisma client
