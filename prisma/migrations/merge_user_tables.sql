-- ================================================================
-- MIGRATION: Merge quick_login_users into users table
-- Date: 2025-10-02
-- Purpose: Eliminate dual user system and create single source of truth
-- ================================================================

-- STEP 1: Add new columns to users table
-- ================================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS login_type VARCHAR(20) DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS username_login VARCHAR(255) UNIQUE;

-- Set login_type for existing users based on whether they have username
UPDATE users
SET login_type = CASE
  WHEN username IS NOT NULL THEN 'username'
  ELSE 'email'
END;

-- Copy username to username_login for clarity
UPDATE users
SET username_login = username
WHERE username IS NOT NULL;

-- STEP 2: Find users that exist ONLY in quick_login_users (not in users)
-- ================================================================
CREATE TEMP TABLE quick_only_users AS
SELECT q.*
FROM quick_login_users q
LEFT JOIN users u ON u.username = q.username
WHERE u.id IS NULL;

-- Show count of users to migrate
SELECT 'Users only in quick_login_users' as info, COUNT(*) as count FROM quick_only_users;

-- STEP 3: Migrate quick-login-only users to users table
-- ================================================================
-- These users will get NEW IDs starting from current max + 1
INSERT INTO users (
  name,
  email,
  username,
  username_login,
  password,
  role,
  province,
  district,
  subject,
  holding_classes,
  pilot_school_id,
  login_type,
  onboarding_completed,
  onboarding_completed_at,
  show_onboarding,
  is_active,
  created_at,
  updated_at
)
SELECT
  username as name,                              -- Use username as name
  username || '@quick.login' as email,           -- Generate email from username
  username,                                       -- Keep username
  username as username_login,                    -- Set username_login
  password,
  role,
  province,
  district,
  subject,
  holding_classes,
  pilot_school_id,
  'username' as login_type,                      -- Mark as username login
  onboarding_completed,
  onboarding_completed_at,
  show_onboarding,
  is_active,
  created_at,
  updated_at
FROM quick_only_users;

-- STEP 4: Create mapping table for ID translation (CRITICAL for foreign keys)
-- ================================================================
CREATE TEMP TABLE user_id_mapping AS
SELECT
  q.id as old_quick_login_id,
  u.id as new_user_id,
  q.username
FROM quick_login_users q
JOIN users u ON u.username = q.username;

-- Show sample mapping
SELECT 'Sample ID Mapping' as info, * FROM user_id_mapping LIMIT 5;

-- STEP 5: Update foreign keys in other tables
-- ================================================================
-- NOTE: This assumes foreign keys currently point to users.id
-- If any foreign keys point to quick_login_users.id, they need special handling

-- Check if there are any orphaned foreign keys first
SELECT 'Orphaned assessments' as check_type, COUNT(*) as count
FROM assessments a
WHERE added_by_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = a.added_by_id);

SELECT 'Orphaned students' as check_type, COUNT(*) as count
FROM students s
WHERE added_by_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = s.added_by_id);

SELECT 'Orphaned mentoring_visits' as check_type, COUNT(*) as count
FROM mentoring_visits mv
WHERE mentor_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM users WHERE id = mv.mentor_id);

-- STEP 6: Add metadata tracking
-- ================================================================
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS migrated_from_quick_login BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS migration_date TIMESTAMP;

UPDATE users
SET
  migrated_from_quick_login = TRUE,
  migration_date = NOW()
WHERE login_type = 'username' AND email LIKE '%@quick.login';

-- STEP 7: Verification queries
-- ================================================================
SELECT '=== MIGRATION VERIFICATION ===' as status;

SELECT 'Total users after migration' as metric, COUNT(*) as count FROM users;

SELECT 'Users by login_type' as metric, login_type, COUNT(*) as count
FROM users
GROUP BY login_type;

SELECT 'Users by role' as metric, role, COUNT(*) as count
FROM users
GROUP BY role
ORDER BY role;

SELECT 'Migrated users' as metric, COUNT(*) as count
FROM users
WHERE migrated_from_quick_login = TRUE;

-- STEP 8: Final steps (commented out - execute manually after verification)
-- ================================================================
-- DROP TABLE IF EXISTS quick_login_users;
-- ALTER TABLE users DROP COLUMN IF EXISTS migrated_from_quick_login;
-- ALTER TABLE users DROP COLUMN IF EXISTS migration_date;

SELECT '=== MIGRATION COMPLETE - VERIFY BEFORE DROPPING quick_login_users ===' as status;
SELECT 'Run: DROP TABLE quick_login_users; after verification' as next_step;
