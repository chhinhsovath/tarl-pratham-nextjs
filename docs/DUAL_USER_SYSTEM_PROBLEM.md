# 🔴 CRITICAL: Dual User System Problem

**Created:** 2025-10-02
**Status:** ACTIVE ISSUE - NEEDS RESOLUTION

## The Problem

The TaRL system currently has **TWO separate user tables** that are causing massive confusion and inconsistency:

1. **`users`** table (85 users)
2. **`quick_login_users`** table (87 users)

### Current Distribution

**users table:**
- 2 admins
- 1 coordinator
- 18 mentors
- 64 teachers

**quick_login_users table:**
- 2 admins
- 1 coordinator
- 19 mentors
- 64 teachers
- 1 viewer

**Total Actual Users:** ~172 (but many might be duplicates!)

## Why This Is a Problem

### 1. **ID Inconsistency**
```typescript
// User ID 94 in quick_login_users is NOT the same as User ID 94 in users
// This breaks EVERYTHING that uses user_id as a foreign key
```

### 2. **Confusion When Querying**
```sql
-- Which table do I query?
SELECT * FROM users WHERE id = 94;           -- Returns one user
SELECT * FROM quick_login_users WHERE id = 94; -- Returns DIFFERENT user!
```

### 3. **Foreign Key Nightmare**
```typescript
// In assessments table, what does added_by_id point to?
// users.id or quick_login_users.id? WE DON'T KNOW!

model Assessment {
  added_by_id Int
  added_by    User? @relation("AssessmentAddedBy", fields: [added_by_id], references: [id])
  // ❌ This ONLY works if the user is in the "users" table
  // ❌ If the user is in "quick_login_users", this breaks!
}
```

### 4. **Duplicate Data**
The same person might exist in BOTH tables with:
- Different IDs
- Different field values
- Inconsistent data

### 5. **Code Complexity**
```typescript
// Every query needs to check both tables
if (token.isQuickLogin) {
  const user = await prisma.quickLoginUser.findUnique(...)
} else {
  const user = await prisma.user.findUnique(...)
}
// This is EVERYWHERE in the codebase!
```

### 6. **Schema Differences**

**Fields in User but NOT in QuickLoginUser:**
- `email` (Primary identifier)
- `profile_photo`
- `sex`
- `phone`
- `school_id`
- `commune`
- `village`
- Relations: `assessments`, `attendance_records`, `mentoring_visits`, `students`, etc.

**Fields in QuickLoginUser but NOT in User:**
- Nothing unique

## Real-World Impact

### Example 1: Creating an Assessment
```typescript
// Teacher logs in via quick_login
// Their ID is 94 in quick_login_users table

// Later, they create an assessment
const assessment = await prisma.assessment.create({
  data: {
    added_by_id: 94, // ❌ This points to users.id, not quick_login_users.id!
    ...
  }
})

// Result: Foreign key constraint fails OR points to wrong user!
```

### Example 2: Finding User's Assessments
```sql
-- User logged in as quick_login_users.id = 94
SELECT * FROM assessments WHERE added_by_id = 94;

-- ❌ Returns assessments from users.id = 94 (DIFFERENT PERSON!)
```

### Example 3: User Profile
```typescript
// Quick login user has no email, phone, or profile photo
// UI breaks when trying to display these fields
```

## Current Workaround (BAD)

The auth system tracks `isQuickLogin` flag and queries the correct table:

```typescript
// lib/auth.ts lines 113-178
if (token.isQuickLogin) {
  const freshQuickUser = await prisma.quickLoginUser.findUnique(...)
} else {
  const freshUser = await prisma.user.findUnique(...)
}
```

**This is a BAND-AID, not a solution!**

## Why Were There Two Tables?

**Original Intent:**
- `users`: Full-featured accounts with email, password reset, profile photos
- `quick_login_users`: Simplified username-only login for field workers with poor internet

**What Actually Happened:**
- Both tables have almost identical fields
- Both support the same roles
- Both store the same type of users
- The distinction is meaningless now

## The Cost

### Developer Time Wasted:
- ❌ 130+ fix commits due to confusion
- ❌ Hours debugging "user not found" errors
- ❌ Constant "which table?" questions
- ❌ This issue: "Invalid credentials" because user searched wrong table

### System Risks:
- ❌ Data integrity issues
- ❌ Reports showing wrong data
- ❌ Foreign key violations
- ❌ Impossible to track user activity across tables

### User Experience:
- ❌ Users get different features depending on which table they're in
- ❌ Some users have profiles, others don't
- ❌ Inconsistent permissions

## Recommended Solution

### Option 1: MERGE TABLES (Recommended)

**Unify into single `users` table:**

```prisma
model User {
  id                      Int       @id @default(autoincrement())

  // Universal fields
  username                String?   @unique  // For both email and username login
  email                   String?   @unique  // Optional, for email-based login
  password                String

  // Profile fields (optional for quick login users)
  name                    String?
  profile_photo           String?
  sex                     String?
  phone                   String?

  // Common fields
  role                    String    @default("teacher")
  province                String?
  district                String?
  subject                 String?
  holding_classes         String?
  pilot_school_id         Int?

  // Login type tracking
  login_type              String    @default("email") // "email" or "username"

  // ... rest of fields
}
```

**Migration Steps:**
1. Add `login_type` and `username` columns to `users` table
2. Migrate all `quick_login_users` to `users` table with `login_type = 'username'`
3. Update all foreign keys pointing to old quick_login_users IDs
4. Drop `quick_login_users` table
5. Update auth logic to use single table
6. Update all queries throughout codebase

**Estimated Time:** 8-16 hours
**Risk:** Medium (requires careful data migration)
**Benefit:** HUGE - eliminates entire class of bugs

### Option 2: Add Foreign Key References

**Keep both tables but link them:**

```prisma
model QuickLoginUser {
  id           Int    @id @default(autoincrement())
  user_id      Int?   @unique  // Link to users table
  user         User?  @relation(fields: [user_id], references: [id])
  // ...
}
```

**NOT RECOMMENDED because:**
- Still have two tables
- Still need to query both
- Doesn't solve the fundamental problem

### Option 3: Use Database Views

**Create a unified view:**

```sql
CREATE VIEW all_users AS
  SELECT id, email as identifier, 'email' as login_type, ... FROM users
  UNION ALL
  SELECT id + 10000 as id, username as identifier, 'username' as login_type, ... FROM quick_login_users;
```

**NOT RECOMMENDED because:**
- Complex ID offsetting
- Can't write to views easily
- Prisma doesn't handle views well

## Decision Needed

**Question for Product Owner:**
Should we invest 1-2 days to properly fix this and prevent 100+ future bugs, or continue with the current confusing dual-table system?

**Recommendation:** Option 1 (Merge Tables)

**Timeline:**
- Day 1 Morning: Write migration script
- Day 1 Afternoon: Test migration on dev database
- Day 2 Morning: Migrate production database
- Day 2 Afternoon: Update codebase, deploy, test

**Post-Migration Benefits:**
- ✅ Single source of truth for users
- ✅ Consistent IDs across entire system
- ✅ Foreign keys work correctly
- ✅ No more "which table?" confusion
- ✅ Simpler authentication logic
- ✅ Better reporting and analytics
- ✅ Easier to add new features
