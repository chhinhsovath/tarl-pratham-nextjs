# Authentication Security Audit - TaRL Pratham NextJS

**Audit Date**: 2025-10-06
**Audited By**: Claude Code
**Security Score**: 7/10

## Executive Summary

The authentication system uses NextAuth.js v4 with JWT strategy and implements role-based access control. While the core implementation is solid, several security and performance improvements are recommended before production deployment.

---

## ✅ Strengths

### 1. Proper JWT Implementation
- **Location**: `lib/auth.ts:119-189`
- 24-hour session expiration
- Automatic token refresh from database
- Proper token structure with user metadata

### 2. Secure Password Handling
- **Location**: `lib/auth.ts:33-42`
- bcrypt hashing (10 salt rounds)
- No plaintext password storage
- Proper password comparison in credential validation

### 3. Role-Based Access Control (RBAC)
- **Location**: `middleware.ts:20-80`
- 5 roles: admin, coordinator, mentor, teacher, viewer
- Hierarchical permission structure
- Route-level protection

### 4. Security Headers
- **Location**: `middleware.ts:109-113`
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### 5. Database Token Refresh
- **Location**: `lib/auth.ts:124-164`
- Fresh user data on every session check
- Automatic role/permission updates
- School assignment validation

---

## ⚠️ Critical Issues

### ISSUE #1: Weak NEXTAUTH_SECRET (CRITICAL)
**Severity**: 🔴 CRITICAL
**Location**: `.env.local`

**Current Value**:
```env
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
```

**Risk**: Predictable secret makes JWT tokens vulnerable to forgery

**Fix Required**:
```bash
# Generate strong secret
openssl rand -base64 32

# Update .env.local
NEXTAUTH_SECRET=<generated-value>
```

---

### ISSUE #2: No Rate Limiting
**Severity**: 🟡 HIGH
**Location**: `app/api/auth/[...nextauth]/route.ts`

**Risk**: Brute force attacks on authentication endpoints

**Recommended Fix**:
```typescript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to login endpoint
export async function POST(req: NextRequest) {
  // Add rate limiting middleware
  await loginLimiter(req);
  // ... existing code
}
```

---

### ISSUE #3: Token Refresh on Every Request
**Severity**: 🟡 MEDIUM
**Location**: `lib/auth.ts:124-164`

**Performance Impact**: Database query on every authenticated request

**Current Behavior**:
```typescript
async jwt({ token, user, trigger, session }) {
  // ALWAYS refreshes from database (no caching)
  if (!user && token.id) {
    const freshUser = await prisma.user.findUnique({
      where: { id: userId },
      // ... database query on EVERY request
    });
  }
}
```

**Recommended Fix**:
```typescript
async jwt({ token, user, trigger, session }) {
  // Only refresh every 5 minutes
  const shouldRefresh = !token.lastRefresh ||
    Date.now() - token.lastRefresh > 5 * 60 * 1000;

  if (!user && token.id && shouldRefresh) {
    const freshUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (freshUser && freshUser.is_active) {
      return {
        ...token,
        role: freshUser.role,
        pilot_school_id: freshUser.pilot_school_id,
        lastRefresh: Date.now(), // Track refresh time
      };
    }
  }

  return token;
}
```

---

### ISSUE #4: No CSRF Protection Configuration
**Severity**: 🟡 MEDIUM
**Location**: `lib/auth.ts`

**Risk**: Cross-Site Request Forgery attacks

**Recommended Fix**:
```typescript
export const authOptions: AuthOptions = {
  // ... existing config

  // Add explicit CSRF protection
  cookies: {
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  }
};
```

---

### ISSUE #5: No Authentication Audit Logging
**Severity**: 🟢 LOW
**Location**: `lib/auth.ts:33-42`

**Risk**: Cannot track suspicious login attempts or security incidents

**Recommended Implementation**:
```typescript
// Create new Prisma model
model AuthLog {
  id         Int      @id @default(autoincrement())
  user_id    Int?
  username   String
  event_type String   // 'login_success', 'login_failed', 'logout'
  ip_address String?
  user_agent String?
  created_at DateTime @default(now())

  @@map("auth_logs")
}

// Add to authorize callback
async authorize(credentials) {
  const user = await prisma.user.findUnique({
    where: { username: credentials.username }
  });

  if (!user) {
    // Log failed attempt
    await prisma.authLog.create({
      data: {
        username: credentials.username,
        event_type: 'login_failed',
        ip_address: credentials.ip_address,
        user_agent: credentials.user_agent,
      }
    });
    return null;
  }

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) {
    await prisma.authLog.create({
      data: {
        user_id: user.id,
        username: user.username,
        event_type: 'login_failed',
        ip_address: credentials.ip_address,
      }
    });
    return null;
  }

  // Log successful login
  await prisma.authLog.create({
    data: {
      user_id: user.id,
      username: user.username,
      event_type: 'login_success',
      ip_address: credentials.ip_address,
    }
  });

  return user;
}
```

---

## 🔧 Additional Recommendations

### 1. Reduce JWT Token Size
**Location**: `lib/auth.ts:168-178`

**Current JWT Contains**:
- id, username, name, email, role
- pilot_school_id, phone, province, profile_picture_url

**Recommendation**: Remove non-essential fields (phone, province) from JWT to reduce token size

### 2. Remove Production Console.log
**Locations**:
- `middleware.ts:88, 99`
- Various API routes

**Fix**: Replace with proper logging library or remove

### 3. Add Password Complexity Requirements
**Location**: User registration endpoints

**Current**: No minimum password requirements enforced

**Recommendation**:
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain uppercase letter')
  .regex(/[a-z]/, 'Password must contain lowercase letter')
  .regex(/[0-9]/, 'Password must contain number');
```

---

## Priority Action Plan

### Immediate (Before Production)
1. ✅ Generate strong NEXTAUTH_SECRET
2. ✅ Implement rate limiting on auth endpoints
3. ✅ Add CSRF protection configuration
4. ✅ Remove console.log statements

### Short Term (Next Sprint)
5. ✅ Optimize token refresh interval (5 min cache)
6. ✅ Implement authentication audit logging
7. ✅ Add password complexity validation

### Long Term (Future Enhancement)
8. ✅ Add 2FA/MFA support
9. ✅ Implement session management dashboard
10. ✅ Add IP-based access restrictions for admin role

---

## Testing Checklist

Before deploying security fixes:

- [ ] Test login with correct credentials
- [ ] Test login with incorrect credentials
- [ ] Test rate limiting (6 failed attempts)
- [ ] Test token expiration (after 24 hours)
- [ ] Test role-based route access
- [ ] Test middleware protection on protected routes
- [ ] Test session refresh on user role change
- [ ] Test logout functionality
- [ ] Test concurrent sessions
- [ ] Monitor database connection count

---

## Database Connection Health

**Current Status**: Fixed - using singleton Prisma client
**Connection Limit**: 5 connections with 10s timeout
**Monitoring**: Check production logs for connection warnings

```bash
# Monitor active connections
PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -p 5432 -U admin -d tarl_pratham -c "
SELECT count(*) as active_connections
FROM pg_stat_activity
WHERE datname = 'tarl_pratham';
"
```

---

## Conclusion

The authentication system has a solid foundation with proper JWT implementation, bcrypt password hashing, and comprehensive RBAC. The main concerns are:

1. **Production Secret** - Must be changed before deployment
2. **Rate Limiting** - Should be implemented to prevent brute force
3. **Performance** - Token refresh optimization recommended
4. **Audit Trail** - Logging will help with security monitoring

**Estimated Implementation Time**: 4-6 hours for all critical and high priority fixes.

**Next Steps**: Review this audit with the team and prioritize which fixes to implement first.
