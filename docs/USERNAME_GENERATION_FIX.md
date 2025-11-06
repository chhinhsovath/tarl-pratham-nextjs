# Username Auto-Generation for Login Dropdown

## Problem

Previously, when admin users created new users via the `/users` page, the new users would **not appear in the quick-login dropdown** at `/auth/login` because:

1. The `username` field was optional during user creation
2. Admin users were only providing `email` (not username)
3. The quick-login dropdown filters by `username IS NOT NULL`
4. Result: New users had no username, so they were filtered out

## Solution

### Change 1: Auto-Generate Username on Create (Deployed)
**File:** `/app/api/users/route.ts` (POST endpoint)

When creating a user without a username:
- Extract the email prefix (everything before @)
- Example: `HortKunthea@gmail.com` → username: `HortKunthea`
- If the username is already taken, append a number: `HortKunthea1`, `HortKunthea2`, etc.
- Return the generated username in the API response

```typescript
// When creating a user via /api/users
{
  "name": "Hort Kunthea",
  "email": "HortKunthea@gmail.com",
  "role": "teacher",
  // No username provided - will be auto-generated
}

// Response includes the generated username
{
  "message": "User created successfully. Username: HortKunthea",
  "data": {
    "id": 123,
    "email": "HortKunthea@gmail.com",
    "username": "HortKunthea",  // ← Auto-generated
    ...
  }
}
```

### Change 2: Fix Existing Users Without Usernames
**File:** `/app/api/users/fix-missing-usernames/route.ts` (NEW)

Admin-only endpoint to batch-fix all existing users that don't have usernames.

**Check status:**
```bash
curl -H "Authorization: Bearer <token>" \
  https://tarl.openplp.com/api/users/fix-missing-usernames
```

Response:
```json
{
  "status": "ok",
  "usersWithoutUsernames": 5,
  "samples": [
    {
      "id": 1,
      "email": "teacher1@example.com",
      "name": "Teacher One",
      "role": "teacher",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "message": "5 users without usernames. Call POST to fix them."
}
```

**Run the fix:**
```bash
curl -X POST -H "Authorization: Bearer <token>" \
  https://tarl.openplp.com/api/users/fix-missing-usernames
```

Response:
```json
{
  "success": true,
  "message": "Fixed 5 users without usernames",
  "results": {
    "fixed": [
      {
        "id": 1,
        "email": "teacher1@example.com",
        "generatedUsername": "teacher1"
      }
    ],
    "errors": []
  }
}
```

### Change 3: Improved Quick-Login Endpoint
**File:** `/app/api/users/quick-login/route.ts`

- Now logs warnings if it detects users without usernames
- Includes email in response for backup
- Provides helpful message: "Call /api/users/fix-missing-usernames to fix them"

## How to Use

### For New Users (After Deployment)
No action needed! New users created via `/users` admin page will automatically:
1. Get a username generated from their email
2. Appear in the login dropdown immediately
3. Be able to login via quick-login

### For Existing Users (Before This Fix)
Run the fix endpoint once:

**Option A: Via API (Recommended)**
```bash
# Step 1: Check how many need fixing
curl -H "Authorization: Bearer <admin-token>" \
  https://tarl.openplp.com/api/users/fix-missing-usernames

# Step 2: Run the fix
curl -X POST -H "Authorization: Bearer <admin-token>" \
  https://tarl.openplp.com/api/users/fix-missing-usernames

# Step 3: Verify in dropdown
# Go to https://tarl.openplp.com/auth/login
# All users should now appear in the dropdown
```

**Option B: Via Database (SQL)**
```bash
PGPASSWORD="your_password" psql -h your_host -U admin -d tarl_pratham < scripts/fix-missing-usernames.sql
```

## Testing the Fix

1. **Create a new user via admin panel**
   - Go to https://tarl.openplp.com/users
   - Click "Add New User"
   - Fill in: name, email, role (don't fill username)
   - Click Create
   - Check the response message for generated username

2. **Verify in login dropdown**
   - Go to https://tarl.openplp.com/auth/login
   - The new user should appear in the dropdown
   - You should be able to select them and login

3. **Check for remaining users without usernames**
   - Call GET endpoint: `/api/users/fix-missing-usernames`
   - Should return: `"usersWithoutUsernames": 0`

## Database Changes

**No schema changes required!**

The `username` field already exists in the `users` table:
```prisma
model User {
  username String? @unique
  ...
}
```

We're just:
1. Populating this field when it's NULL
2. Filtering on this field in the quick-login endpoint

## Performance Impact

- **User creation**: +1 query to check username uniqueness (minimal)
- **Login dropdown**: Same as before (filters by username IS NOT NULL)
- **Fix endpoint**: Batch operation (5-10 users/second depending on database)

## Security Notes

- Username auto-generation from email prefix doesn't expose sensitive data
- Email prefixes are typically public information (used in usernames everywhere)
- Usernames are only visible to logged-in admins and in the public login dropdown
- Passwords remain secure and unchanged

## Rollback Plan

If needed, we can revert by:
1. Making username optional again in validation
2. Removing the auto-generation logic

But this is **not recommended** because:
- Existing users would disappear from dropdown
- We'd be back to the original problem

## Questions?

If users aren't appearing in the dropdown after:
1. Creating them
2. Running the fix endpoint

Check:
1. Is `is_active = true`? (Users must be active)
2. Does the user have a `username`? (Check database directly)
3. Are there any errors in server logs?

