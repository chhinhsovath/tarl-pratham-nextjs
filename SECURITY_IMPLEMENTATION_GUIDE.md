# 🔐 Security Implementation Quick Reference

**System:** TARL Pratham v2.0
**Compliance:** 100% ✅
**Date:** 2025-10-01

---

## 📚 Table of Contents
1. [New Security Modules](#new-security-modules)
2. [Quick Start](#quick-start)
3. [API Endpoint Template](#api-endpoint-template)
4. [Common Patterns](#common-patterns)
5. [Database Schema](#database-schema)
6. [Environment Setup](#environment-setup)

---

## 🆕 New Security Modules

### 1. `/lib/rbac.ts` - Role-Based Access Control
```typescript
import { hasPermission, checkPermission, validateFieldPermissions } from '@/lib/rbac';

// Check if role has permission
hasPermission('teacher', 'students', 'create') // → true/false

// Comprehensive permission check
const result = checkPermission({
  userRole: 'teacher',
  userId: 123,
  userPilotSchoolId: 5,
  resourceType: 'students',
  action: 'create',
});
// → { allowed: true/false, reason?: string, statusCode?: number }

// Validate field permissions
validateFieldPermissions('teacher', 'students', ['name', 'age', 'pilot_school_id']);
// → { allowed: boolean, forbiddenFields: string[], message?: string }
```

### 2. `/lib/audit.ts` - Audit Logging
```typescript
import { logCreate, logUpdate, logDelete, logAccessDenied, logFailure } from '@/lib/audit';

// Log successful creation
await logCreate(request, session, 'students', studentId, studentName, newValues);

// Log update with changes
await logUpdate(request, session, 'students', studentId, studentName, oldValues, newValues, changedFields);

// Log deletion
await logDelete(request, session, 'students', studentId, studentName, oldValues);

// Log access denial
await logAccessDenied(request, session, 'students', 'create', 'Permission denied');

// Log failures
await logFailure(request, session, 'students', 'create', error.message);
```

### 3. `/lib/rate-limit.ts` - Rate Limiting
```typescript
import { withRateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  return withRateLimit(request, session, async () => {
    // Your actual handler code here
    const data = await prisma.users.findMany();
    return NextResponse.json({ data });
  });
}
```

### 4. `/lib/ip-whitelist.ts` - IP Access Control
```typescript
import { isIpWhitelisted } from '@/lib/ip-whitelist';

const ipCheck = await isIpWhitelisted(request, userRole);
if (!ipCheck.allowed) {
  return NextResponse.json({ error: ipCheck.reason }, { status: 403 });
}
```

### 5. `/lib/validation.ts` - Input Validation
```typescript
import { userCreateSchema, validateBody, formatValidationErrors } from '@/lib/validation';

const body = await request.json();
const validation = await validateBody(userCreateSchema, body);

if (!validation.success) {
  return NextResponse.json({
    error: "ទិន្នន័យមិនត្រឹមត្រូវ",
    details: formatValidationErrors(validation.errors!),
  }, { status: 400 });
}

const validatedData = validation.data!;
```

---

## 🚀 Quick Start

### Step 1: Import Security Modules
```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Security modules
import { checkPermission, type UserRole } from "@/lib/rbac";
import { logCreate, logAccessDenied, logFailure } from "@/lib/audit";
import { withRateLimit } from "@/lib/rate-limit";
import { isIpWhitelisted } from "@/lib/ip-whitelist";
import { validateBody, formatValidationErrors } from "@/lib/validation";
```

### Step 2: Use Security Template
See [API Endpoint Template](#api-endpoint-template) below.

---

## 📝 API Endpoint Template

### Complete Secure Endpoint (Copy & Modify)

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkPermission, type UserRole } from "@/lib/rbac";
import { logCreate, logAccessDenied, logFailure } from "@/lib/audit";
import { withRateLimit } from "@/lib/rate-limit";
import { isIpWhitelisted } from "@/lib/ip-whitelist";
import { validateBody, formatValidationErrors, studentCreateSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      await logAccessDenied(request, session, 'students', 'create', 'Not authenticated');
      return NextResponse.json({ error: "សូមចូលប្រើប្រាស់ប្រព័ន្ធជាមុនសិន" }, { status: 401 });
    }

    // 2. Rate limit
    return withRateLimit(request, session, async () => {
      const userRole = session.user.role as UserRole;
      const userId = parseInt(session.user.id);

      // 3. Check permissions
      const permissionCheck = checkPermission({
        userRole,
        userId,
        userPilotSchoolId: session.user.pilot_school_id,
        resourceType: 'students',
        action: 'create',
      });

      if (!permissionCheck.allowed) {
        await logAccessDenied(request, session, 'students', 'create', permissionCheck.reason!);
        return NextResponse.json({ error: permissionCheck.reason }, { status: 403 });
      }

      // 4. IP whitelist (admin/coordinator only)
      const ipCheck = await isIpWhitelisted(request, userRole);
      if (!ipCheck.allowed) {
        await logAccessDenied(request, session, 'students', 'create', ipCheck.reason!);
        return NextResponse.json({ error: ipCheck.reason }, { status: 403 });
      }

      // 5. Validate input
      const body = await request.json();
      const validation = await validateBody(studentCreateSchema, body);

      if (!validation.success) {
        return NextResponse.json({
          success: false,
          error: "ទិន្នន័យមិនត្រឹមត្រូវ",
          details: formatValidationErrors(validation.errors!),
        }, { status: 400 });
      }

      const validatedData = validation.data!;

      // 6. Execute operation
      const student = await prisma.student.create({
        data: {
          ...validatedData,
          added_by_id: userId,
        },
      });

      // 7. Audit log
      await logCreate(request, session, 'students', student.id, student.name, student);

      // 8. Return response
      return NextResponse.json({
        success: true,
        message: "បានបង្កើតសិស្សដោយជោគជ័យ",
        data: student
      }, { status: 201 });
    });

  } catch (error: any) {
    const session = await getServerSession(authOptions);
    await logFailure(request, session, 'students', 'create', error.message);

    return NextResponse.json({
      success: false,
      error: "មានបញ្ហាក្នុងការបង្កើតសិស្ស",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
```

---

## 🔄 Common Patterns

### Pattern 1: Simple Permission Check
```typescript
const permissionCheck = checkPermission({
  userRole: session.user.role as UserRole,
  userId: parseInt(session.user.id),
  userPilotSchoolId: session.user.pilot_school_id,
  resourceType: 'students',
  action: 'view',
});

if (!permissionCheck.allowed) {
  await logAccessDenied(request, session, 'students', 'view', permissionCheck.reason!);
  return NextResponse.json({ error: permissionCheck.reason }, { status: 403 });
}
```

### Pattern 2: Resource Ownership Check
```typescript
const permissionCheck = checkPermission({
  userRole: session.user.role as UserRole,
  userId: parseInt(session.user.id),
  userPilotSchoolId: session.user.pilot_school_id,
  resourceOwnerId: existingStudent.added_by_id, // Check ownership
  resourcePilotSchoolId: existingStudent.pilot_school_id, // Check school
  resourceType: 'students',
  action: 'update',
});
```

### Pattern 3: Field-Level Permission Check
```typescript
const fieldValidation = validateFieldPermissions(
  userRole,
  'students',
  Object.keys(updateData)
);

if (!fieldValidation.allowed) {
  return NextResponse.json({
    error: fieldValidation.message,
    forbiddenFields: fieldValidation.forbiddenFields
  }, { status: 403 });
}
```

### Pattern 4: Audit Logging with Changes
```typescript
// Before update
const oldStudent = await prisma.student.findUnique({ where: { id } });

// After update
const updatedStudent = await prisma.student.update({ where: { id }, data });

// Log with changes
const changedFields = getChangedFields(oldStudent, updatedStudent);
await logUpdate(request, session, 'students', id, updatedStudent.name, oldStudent, updatedStudent, changedFields);
```

---

## 🗄️ Database Schema

### New Security Tables

```sql
-- Audit Logging
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT,
  user_role VARCHAR(50),
  user_email VARCHAR(255),
  action VARCHAR(50), -- create, update, delete, view, export, import
  resource_type VARCHAR(100),
  resource_id INT,
  resource_name VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  changed_fields JSONB,
  ip_address VARCHAR(100),
  user_agent TEXT,
  session_id VARCHAR(255),
  status VARCHAR(50), -- success, failed, denied
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rate Limiting
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  identifier VARCHAR(255), -- IP or user ID
  endpoint VARCHAR(500),
  requests_count INT DEFAULT 1,
  window_start TIMESTAMP DEFAULT NOW(),
  blocked_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Session Tracking
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INT,
  user_role VARCHAR(50),
  ip_address VARCHAR(100),
  user_agent TEXT,
  device_info JSONB,
  started_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  terminated_at TIMESTAMP,
  termination_reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- IP Whitelist
CREATE TABLE ip_whitelist (
  id SERIAL PRIMARY KEY,
  ip_address VARCHAR(100) UNIQUE,
  description TEXT,
  allowed_roles JSONB, -- ["admin", "coordinator"]
  is_active BOOLEAN DEFAULT TRUE,
  added_by INT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes (Already Created)
```sql
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_rate_limits_identifier ON rate_limits(identifier);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_ip_whitelist_ip ON ip_whitelist(ip_address);
```

---

## ⚙️ Environment Setup

### .env Configuration

```bash
# Database (Already configured)
DATABASE_URL="postgresql://admin:P@ssw0rd@157.10.73.52:5432/tarl_pratham"

# IP Whitelisting (Optional)
IP_WHITELIST_ENABLED=false  # Set to true in production

# No other configuration needed!
# Rate limiting and audit logging work automatically
```

### Production Deployment

1. **Enable IP Whitelisting**
```bash
IP_WHITELIST_ENABLED=true
```

2. **Add Whitelisted IPs**
```sql
INSERT INTO ip_whitelist (ip_address, description, allowed_roles, is_active, added_by)
VALUES
  ('YOUR_OFFICE_IP', 'Office HQ', '["admin", "coordinator"]', true, 1),
  ('YOUR_VPN_IP', 'VPN Gateway', '["admin"]', true, 1);
```

3. **Test Security**
```bash
# Try accessing admin endpoint from non-whitelisted IP
curl -X GET https://your-domain.com/api/users/secured

# Should return 403 if IP whitelisting is working
```

---

## 📊 Monitoring Queries

### Check Audit Logs
```sql
-- Recent denied access attempts
SELECT user_email, resource_type, action, ip_address, created_at
FROM audit_logs
WHERE status = 'denied'
ORDER BY created_at DESC
LIMIT 20;

-- User activity summary
SELECT user_email, action, COUNT(*) as count
FROM audit_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY user_email, action
ORDER BY count DESC;
```

### Check Rate Limits
```sql
-- Currently blocked IPs
SELECT identifier, endpoint, blocked_until
FROM rate_limits
WHERE blocked_until > NOW()
ORDER BY blocked_until DESC;

-- Top rate-limited endpoints
SELECT endpoint, COUNT(*) as hit_count
FROM rate_limits
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY endpoint
ORDER BY hit_count DESC;
```

### Check Active Sessions
```sql
-- Active user sessions
SELECT user_id, user_role, ip_address, started_at, last_activity
FROM user_sessions
WHERE is_active = true
ORDER BY last_activity DESC;
```

---

## 🎯 Testing Checklist

### Before Deployment
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Test secured endpoint: `/api/users/secured`
- [ ] Verify audit logs are created
- [ ] Test rate limiting (make >300 requests)
- [ ] Test IP whitelist (if enabled)
- [ ] Test field-level permissions

### After Deployment
- [ ] Monitor audit logs for denials
- [ ] Check rate limit blocks
- [ ] Review IP whitelist entries
- [ ] Verify session tracking works

---

## 🆘 Troubleshooting

### Issue: "Module not found: Can't resolve '@/lib/rbac'"
**Solution:** Run `npm install` and restart dev server

### Issue: Prisma client error about missing tables
**Solution:** Run `npx prisma db push` to sync schema

### Issue: Rate limiting not working
**Solution:** Check database connection and ensure `rate_limits` table exists

### Issue: IP whitelist blocking all requests
**Solution:** Set `IP_WHITELIST_ENABLED=false` in development

### Issue: Audit logs not appearing
**Solution:** Check database connection and verify `audit_logs` table exists

---

## 📚 Further Reading

- **Full Compliance Report:** `/test-reports/100_PERCENT_COMPLIANCE_REPORT.md`
- **Original Analysis:** `/test-reports/ROLE_BASED_CRUD_ANALYSIS.md`
- **Example Implementation:** `/app/api/users/secured/route.ts`
- **RBAC Module:** `/lib/rbac.ts`
- **Audit Module:** `/lib/audit.ts`
- **Rate Limit Module:** `/lib/rate-limit.ts`
- **Validation Schemas:** `/lib/validation.ts`

---

**Quick Reference End**

*For questions, see `/test-reports/100_PERCENT_COMPLIANCE_REPORT.md`*
*System: TARL Pratham v2.0 - 100% Compliant ✅*
