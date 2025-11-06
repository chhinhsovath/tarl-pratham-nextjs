-- Fix missing usernames for existing users
-- This script generates usernames from emails for users that don't have a username
-- It should be run in the production database after deploying the new user creation code

-- Step 1: Identify users without usernames
SELECT id, email, username FROM users WHERE username IS NULL;

-- Step 2: Generate usernames from emails (using a common email prefix pattern)
-- This creates a temporary mapping
WITH email_usernames AS (
  SELECT
    id,
    email,
    LOWER(SPLIT_PART(email, '@', 1)) as suggested_username
  FROM users
  WHERE username IS NULL AND is_active = true
)
UPDATE users u
SET username = eu.suggested_username
FROM email_usernames eu
WHERE u.id = eu.id;

-- Step 3: Verify the updates
SELECT COUNT(*) as fixed_count FROM users WHERE username IS NOT NULL;

-- If there are any duplicates (same username for different users), we can run this:
-- Find duplicates:
SELECT username, COUNT(*) as count FROM users
WHERE username IS NOT NULL
GROUP BY username HAVING COUNT(*) > 1;

-- Fix duplicates by appending email's numeric suffix or ID:
-- (This is more complex and depends on your preferences)
