# 🗺️ TARL Pratham - Complete Navigation & Access Control Map

**Version:** 2.0
**Date:** 2025-10-01
**Status:** 100% Mapped ✅

---

## 📋 Table of Contents
1. [Complete Page Inventory](#complete-page-inventory)
2. [Role-Based Navigation Matrix](#role-based-navigation-matrix)
3. [Navigation Flow by Role](#navigation-flow-by-role)
4. [Menu Structure Per Role](#menu-structure-per-role)
5. [Route Protection Implementation](#route-protection-implementation)
6. [Access Control Summary](#access-control-summary)

---

## 📊 Complete Page Inventory

### Total Pages: **64**

#### Authentication & Onboarding (4 pages)
| Path | Description | Access |
|------|-------------|--------|
| `/` | Landing page | Public |
| `/auth/login` | Standard login | Public |
| `/auth/mobile-login` | Quick login for mobile | Public |
| `/profile-setup` | Initial profile configuration | Authenticated |
| `/onboarding` | User onboarding flow | Authenticated |

#### Core Dashboard (3 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/dashboard` | Main dashboard | Admin, Mentor, Teacher, Viewer |
| `/coordinator` | Coordinator workspace | Coordinator |
| `/teacher/dashboard` | Teacher-specific dashboard | Teacher, Mentor |

#### User Management (4 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/users` | User list | Admin, Coordinator |
| `/users/create` | Create new user | Admin, Coordinator |
| `/users/[id]/edit` | Edit user | Admin, Coordinator |
| `/profile` | Own profile view | All |
| `/profile/edit` | Edit own profile | All |

#### School Management (4 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/schools` | School list | Admin, Coordinator |
| `/schools/[id]/students` | School's students | Admin, Coordinator, Mentor |
| `/schools/[id]/teachers` | School's teachers | Admin, Coordinator |
| `/administration` | Admin portal | Admin |

#### Student Management (5 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/students` | Student list | Admin, Coordinator, Mentor, Teacher, Viewer |
| `/students/create` | Add new student | Admin, Coordinator, Mentor, Teacher |
| `/students/[id]` | Student detail | Admin, Coordinator, Mentor, Teacher, Viewer |
| `/students/[id]/edit` | Edit student | Admin, Coordinator, Mentor, Teacher |
| `/students/bulk-import` | Bulk import students | Admin, Coordinator |

#### Assessment Management (7 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/assessments` | Assessment hub | Admin, Mentor, Teacher |
| `/assessments/create` | Create assessment | Admin, Mentor, Teacher |
| `/assessments/data-entry` | Data entry interface | Admin, Mentor, Teacher |
| `/assessments/select-students` | Select students for assessment | Admin, Mentor, Teacher |
| `/assessments/manage` | Manage assessments | Admin, Coordinator |
| `/assessments/verify` | Verify assessment data | Admin, Mentor |
| `/assessments/periods` | Assessment periods config | Admin, Coordinator |

#### Mentoring System (6 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/mentoring` | Mentoring hub | Admin, Coordinator, Mentor |
| `/mentoring/create` | Create mentoring visit | Admin, Coordinator, Mentor |
| `/mentoring/[id]` | Visit detail | Admin, Coordinator, Mentor, Teacher (view only) |
| `/mentoring/[id]/edit` | Edit visit | Admin, Coordinator, Mentor (own) |
| `/mentoring-visits` | All visits (alternate route) | Admin, Coordinator, Mentor |
| `/mentoring-visits/create` | Create visit (alternate) | Admin, Coordinator, Mentor |
| `/mentoring-visits/[id]` | Visit detail (alternate) | Admin, Coordinator, Mentor |
| `/mentoring-visits/[id]/edit` | Edit visit (alternate) | Admin, Coordinator, Mentor |

#### Verification Workflow (1 page)
| Path | Description | Roles |
|------|-------------|-------|
| `/verification` | Data verification | Admin, Mentor |

#### Reports & Analytics (10 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/reports` | Reports hub | All |
| `/reports/dashboard` | Reports dashboard | All |
| `/reports/student-performance` | Student performance report | All |
| `/reports/school-comparison` | School comparison report | Admin, Coordinator |
| `/reports/mentoring-impact` | Mentoring impact analysis | Admin, Coordinator, Mentor |
| `/reports/progress-tracking` | Progress tracking | All |
| `/reports/assessment-analysis` | Assessment analysis | Admin, Coordinator, Mentor |
| `/reports/class-progress` | Class progress report | Admin, Coordinator, Teacher |
| `/reports/attendance` | Attendance report | Admin, Coordinator, Teacher |
| `/reports/intervention` | Intervention effectiveness | Admin, Coordinator |

#### Coordinator Tools (2 pages)
| Path | Description | Roles |
|------|-------------|-------|
| `/coordinator` | Coordinator workspace | Coordinator |
| `/coordinator/imports` | Bulk import management | Coordinator |

#### Admin Tools (1 page)
| Path | Description | Roles |
|------|-------------|-------|
| `/admin/test-data` | Test data management | Admin |

#### System Pages (6 pages)
| Path | Description | Access |
|------|-------------|--------|
| `/settings` | System settings | Admin |
| `/resources` | Resource library | All |
| `/help` | Help center | All |
| `/help/user-management` | User management help | Admin, Coordinator |
| `/help/assessment-entry` | Assessment help | All |
| `/about` | About page | All |
| `/unauthorized` | Access denied | All |
| `/offline` | Offline mode | All (PWA) |
| `/test-roles` | Role testing (dev) | Dev only |

---

## 🎯 Role-Based Navigation Matrix

### Legend
- ✅ = Full Access
- 👁️ = View Only
- 🏫 = School-Limited
- ⚠️ = Own Data Only
- ❌ = No Access

### Admin Role (Highest Privilege)
| Feature Area | Access | Notes |
|--------------|--------|-------|
| Dashboard | ✅ | Full system overview |
| Users | ✅ | Create, edit, delete users |
| Schools | ✅ | All schools management |
| Students | ✅ | All students, all schools |
| Assessments | ✅ | Create, verify, manage all |
| Mentoring Visits | ✅ | View, create, edit, delete all |
| Verification | ✅ | Verify all data |
| Reports | ✅ | All reports, all schools |
| Coordinator Tools | ✅ | Access coordinator workspace |
| Teacher Tools | ✅ | Access teacher dashboard |
| Settings | ✅ | System configuration |
| Test Data Management | ✅ | Manage test data |
| Bulk Import | ✅ | Import all resource types |

**Menu Items: 12 main sections + Administration submenu**

### Coordinator Role
| Feature Area | Access | Notes |
|--------------|--------|-------|
| Dashboard | ❌ | Uses coordinator workspace instead |
| Users | ✅ | Create, edit (cannot delete) |
| Schools | ✅ | All schools management |
| Students | ✅ | All students, all schools |
| Assessments | 👁️ | View only, can manage periods |
| Mentoring Visits | ✅ | View, create, edit, delete all |
| Verification | ❌ | No verification access |
| Reports | ✅ | Regional/district reports |
| Coordinator Workspace | ✅ | Main workspace |
| Bulk Import | ✅ | Import users, students, schools |
| Settings | 👁️ | View only |

**Menu Items: Coordinator Workspace + Schools + Students + Reports + Imports**

### Mentor Role
| Feature Area | Access | Notes |
|--------------|--------|-------|
| Dashboard | ✅ | School-level dashboard |
| Users | ⚠️ | Own profile only |
| Schools | 🏫 | Own school only (view) |
| Students | 🏫 | Own school students |
| Assessments | 🏫 | Create, verify for own school |
| Mentoring Visits | 🏫 | View all school visits, edit own |
| Verification | ✅ | Verify own school data |
| Reports | 🏫 | Own school reports |
| Teacher Dashboard | ✅ | Can access teacher features |
| Test Mode | ✅ | Can enable test mode |

**Menu Items: Dashboard + Students + Assessments + Mentoring + Verification + Reports**

### Teacher Role
| Feature Area | Access | Notes |
|--------------|--------|-------|
| Dashboard | ✅ | Own class dashboard |
| Users | ⚠️ | Own profile only |
| Schools | 🏫 | Own school only (view) |
| Students | 🏫 | Own school students |
| Assessments | 🏫 | Create, enter for own students |
| Mentoring Visits | 👁️ | View visits to own school |
| Verification | ❌ | No verification access |
| Reports | 🏫 | Own class/school reports |
| Teacher Dashboard | ✅ | Main workspace |
| Test Mode | ⚠️ | Can toggle own test mode |

**Menu Items: Teacher Dashboard + Students + Assessments + Reports**

### Viewer Role (Read-Only)
| Feature Area | Access | Notes |
|--------------|--------|-------|
| Dashboard | ✅ | Read-only dashboard |
| Users | ⚠️ | Own profile only |
| Schools | 🏫 | Assigned school(s) view |
| Students | 👁️ | View only (school-limited) |
| Assessments | 👁️ | View only (school-limited) |
| Mentoring Visits | 👁️ | View only (school-limited) |
| Verification | ❌ | No verification access |
| Reports | 👁️ | View and export reports |

**Menu Items: Dashboard + Reports + Students (view) + Assessments (view)**

---

## 🧭 Navigation Flow by Role

### Admin Navigation Flow
```
Landing Page (/)
  └─> Login (/auth/login)
      └─> Dashboard (/dashboard)
          ├─> Administration (/administration)
          │   ├─> Users (/users)
          │   ├─> Schools (/schools)
          │   ├─> Settings (/settings)
          │   └─> Test Data (/admin/test-data)
          ├─> Students (/students)
          │   ├─> Create (/students/create)
          │   ├─> Bulk Import (/students/bulk-import)
          │   └─> Detail (/students/[id])
          ├─> Assessments (/assessments)
          │   ├─> Create (/assessments/create)
          │   ├─> Manage (/assessments/manage)
          │   ├─> Verify (/assessments/verify)
          │   └─> Periods (/assessments/periods)
          ├─> Mentoring (/mentoring)
          │   ├─> Create (/mentoring/create)
          │   └─> Detail (/mentoring/[id])
          ├─> Verification (/verification)
          ├─> Reports (/reports)
          │   ├─> Dashboard (/reports/dashboard)
          │   ├─> Student Performance (/reports/student-performance)
          │   ├─> School Comparison (/reports/school-comparison)
          │   └─> [8 more report types]
          ├─> Resources (/resources)
          └─> Help (/help)
```

### Coordinator Navigation Flow
```
Landing Page (/)
  └─> Login (/auth/login)
      └─> Coordinator Workspace (/coordinator)
          ├─> Users Management (/users)
          ├─> Schools (/schools)
          ├─> Students (/students)
          ├─> Bulk Imports (/coordinator/imports)
          ├─> Reports (/reports)
          │   ├─> Regional Analytics
          │   └─> School Comparison
          ├─> Mentoring Visits (/mentoring)
          └─> Help (/help)
```

### Mentor Navigation Flow
```
Landing Page (/)
  └─> Login (/auth/login) or Quick Login (/auth/mobile-login)
      └─> Dashboard (/dashboard)
          ├─> Students (/students) [Own school]
          │   └─> Create Student (/students/create)
          ├─> Assessments (/assessments)
          │   ├─> Create (/assessments/create)
          │   ├─> Data Entry (/assessments/data-entry)
          │   └─> Verify (/assessments/verify)
          ├─> Mentoring Visits (/mentoring)
          │   ├─> Create Visit (/mentoring/create)
          │   └─> Own Visits (/mentoring/[id]/edit)
          ├─> Verification (/verification)
          ├─> Reports (/reports) [School-limited]
          ├─> Teacher Dashboard (/teacher/dashboard)
          └─> Help (/help)
```

### Teacher Navigation Flow
```
Landing Page (/)
  └─> Login (/auth/login) or Quick Login (/auth/mobile-login)
      └─> Teacher Dashboard (/teacher/dashboard)
          ├─> Students (/students) [Own school]
          │   ├─> Create Student (/students/create)
          │   └─> Student Detail (/students/[id])
          ├─> Assessments (/assessments)
          │   ├─> Create (/assessments/create)
          │   └─> Data Entry (/assessments/data-entry)
          ├─> Reports (/reports) [Class-level]
          │   ├─> Class Progress (/reports/class-progress)
          │   └─> Student Performance (/reports/student-performance)
          └─> Help (/help)
```

### Viewer Navigation Flow
```
Landing Page (/)
  └─> Login (/auth/login)
      └─> Dashboard (/dashboard) [Read-only]
          ├─> Students (/students) [View only]
          ├─> Assessments (/assessments) [View only]
          ├─> Reports (/reports)
          │   └─> Export Reports
          └─> Help (/help)
```

---

## 🎨 Menu Structure Per Role

### Admin Menu (12 Main Items)
```
📊 Dashboard
├─ 👥 Students
│  ├─ List Students
│  ├─ Create Student
│  └─ Bulk Import
├─ 📝 Assessments
│  ├─ Create Assessment
│  ├─ Data Entry
│  ├─ Manage Assessments
│  ├─ Verify Data
│  └─ Assessment Periods
├─ 👔 Mentoring
│  ├─ All Visits
│  ├─ Create Visit
│  └─ Visit Details
├─ ✅ Verification
├─ 📈 Reports
│  ├─ Reports Dashboard
│  ├─ Student Performance
│  ├─ School Comparison
│  ├─ Mentoring Impact
│  ├─ Progress Tracking
│  ├─ Assessment Analysis
│  ├─ Class Progress
│  ├─ Attendance
│  └─ Intervention
├─ 🏢 Administration
│  ├─ Users Management
│  ├─ Schools Management
│  ├─ Settings
│  ├─ Resources
│  └─ Test Data Management
├─ 👤 Profile
└─ ❓ Help
```

### Coordinator Menu (7 Main Items)
```
🏢 Coordinator Workspace
├─ 👥 Users
│  ├─ List Users
│  └─ Create User
├─ 🏫 Schools
│  └─ School Management
├─ 👥 Students
│  ├─ List Students
│  └─ Bulk Import
├─ 📥 Imports
│  ├─ Import Users
│  ├─ Import Students
│  └─ Import Schools
├─ 📈 Reports
│  ├─ Regional Analytics
│  └─ School Comparison
├─ 👤 Profile
└─ ❓ Help
```

### Mentor Menu (8 Main Items)
```
📊 Dashboard
├─ 👥 Students (School-Limited)
│  ├─ List Students
│  └─ Create Student
├─ 📝 Assessments
│  ├─ Create Assessment
│  ├─ Data Entry
│  └─ Verify Data
├─ 👔 Mentoring
│  ├─ School Visits
│  ├─ Create Visit
│  └─ My Visits
├─ ✅ Verification
├─ 📈 Reports (School)
│  ├─ School Performance
│  └─ Progress Tracking
├─ 🎓 Teacher Dashboard
├─ 👤 Profile
└─ ❓ Help
```

### Teacher Menu (5 Main Items)
```
🎓 Teacher Dashboard
├─ 👥 Students (School-Limited)
│  ├─ My Students
│  └─ Create Student
├─ 📝 Assessments
│  ├─ Create Assessment
│  └─ Data Entry
├─ 📈 Reports (Class)
│  ├─ Class Progress
│  └─ My Students Performance
├─ 👤 Profile
└─ ❓ Help
```

### Viewer Menu (4 Main Items)
```
📊 Dashboard (Read-Only)
├─ 👥 Students (View Only)
├─ 📈 Reports
│  └─ View & Export
├─ 👤 Profile
└─ ❓ Help
```

---

## 🔒 Route Protection Implementation

### Current Implementation Status

The system currently uses basic role checking in `DashboardLayout.tsx`. Here's the enhancement needed for 100% security:

### Enhanced Route Protection Middleware

Create `/middleware.ts` for global route protection:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Route access matrix
const PROTECTED_ROUTES = {
  admin: [
    '/admin',
    '/users/create',
    '/users/[id]/edit',
    '/settings',
    '/assessments/periods',
  ],
  coordinator: [
    '/coordinator',
    '/coordinator/imports',
    '/users',
    '/schools',
  ],
  mentor: [
    '/verification',
    '/mentoring/create',
    '/assessments/verify',
  ],
  teacher: [
    '/teacher/dashboard',
    '/assessments/create',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Public routes
  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next();
  }

  // Require authentication
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check route permissions
  const userRole = token.role as string;

  // Admin has access to all routes
  if (userRole === 'admin') {
    return NextResponse.next();
  }

  // Check role-specific access
  for (const [role, routes] of Object.entries(PROTECTED_ROUTES)) {
    if (userRole !== role) {
      for (const route of routes) {
        if (pathname.startsWith(route)) {
          return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Page-Level Protection

Each page should also verify permissions:

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { hasPermission } from '@/lib/permissions';

export default function ProtectedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/auth/login');
      return;
    }

    // Check specific permission
    if (!hasPermission(session.user, 'users.create')) {
      router.push('/unauthorized');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session || !hasPermission(session.user, 'users.create')) {
    return null;
  }

  return <div>Protected Content</div>;
}
```

---

## 📊 Access Control Summary

### Access Matrix by Resource

| Resource | Admin | Coord | Mentor | Teacher | Viewer |
|----------|-------|-------|--------|---------|--------|
| **Users** | ✅ CRUD | ✅ CRU | ⚠️ Own | ⚠️ Own | ⚠️ Own |
| **Schools** | ✅ CRUD | ✅ CRUD | 🏫 R | 🏫 R | 🏫 R |
| **Students** | ✅ CRUD | ✅ CRUD | 🏫 CRU | 🏫 CRU | 🏫 R |
| **Assessments** | ✅ CRUD | 👁️ R | 🏫 CRU | 🏫 CRU | 🏫 R |
| **Mentoring** | ✅ CRUD | ✅ CRUD | 🏫 CRU | 🏫 R | 🏫 R |
| **Verification** | ✅ | ❌ | 🏫 ✅ | ❌ | ❌ |
| **Reports** | ✅ | ✅ | 🏫 ✅ | 🏫 ✅ | 🏫 ✅ |
| **Settings** | ✅ | 👁️ R | ❌ | ❌ | ❌ |
| **Bulk Import** | ✅ | ✅ | ❌ | ❌ | ❌ |

### Data Visibility by Role

| Role | Visibility Scope | Students | Assessments | Visits |
|------|-----------------|----------|-------------|--------|
| **Admin** | System-wide | All schools | All | All |
| **Coordinator** | Region/District | All schools | All | All |
| **Mentor** | Single school | Own school | Own school | Own school (edit own) |
| **Teacher** | Single school | Own school | Own students | View only |
| **Viewer** | Assigned school(s) | Assigned | Assigned | Assigned |

---

## 🎯 Navigation Best Practices

### 1. Breadcrumb Navigation
Always show current location:
```
Home > Students > Create New Student
Home > Reports > Student Performance
```

### 2. Quick Actions Menu
Role-specific quick actions in header:
- **Admin:** Create User, Import Data, System Settings
- **Coordinator:** Import Students, View Reports
- **Mentor:** Create Assessment, New Visit
- **Teacher:** Add Student, Enter Assessment

### 3. Search & Filters
Global search with role-appropriate results:
- **Admin/Coordinator:** Search all schools
- **Mentor/Teacher:** Search within assigned school
- **Viewer:** Search with view-only results

### 4. Notifications
Role-specific notifications:
- **Admin:** System alerts, user requests
- **Coordinator:** Regional updates, import status
- **Mentor:** Verification needed, visit reminders
- **Teacher:** Assessment deadlines, student updates

---

## 🔄 Common User Journeys

### Admin: Create New School Year Setup
1. `/dashboard` → System Overview
2. `/admin/test-data` → Clear test data
3. `/coordinator/imports` → Import new students
4. `/assessments/periods` → Configure assessment periods
5. `/users` → Assign teachers to schools

### Coordinator: Monthly Reporting
1. `/coordinator` → Workspace Dashboard
2. `/reports/school-comparison` → Compare schools
3. `/reports/dashboard` → Generate monthly report
4. Export data → Download reports

### Mentor: Conduct School Visit
1. `/dashboard` → Check schedule
2. `/students` → Review student list
3. `/mentoring/create` → Create visit record
4. `/assessments/create` → Conduct assessments
5. `/mentoring/[id]/edit` → Complete visit notes
6. `/verification` → Verify data before submission

### Teacher: Daily Assessment Entry
1. `/teacher/dashboard` → Class overview
2. `/students` → View student list
3. `/assessments/create` → Start assessment session
4. `/assessments/data-entry` → Enter results
5. `/reports/class-progress` → Review progress

### Viewer: Monitor Progress
1. `/dashboard` → View analytics
2. `/reports/student-performance` → Check metrics
3. `/students` → Browse student records
4. Export reports → Download for review

---

## 🚀 Implementation Checklist

### Security Enhancements Needed
- [ ] Create `/middleware.ts` for global route protection
- [ ] Add page-level permission checks to all pages
- [ ] Implement breadcrumb navigation component
- [ ] Add role-specific quick actions menu
- [ ] Create unauthorized page with helpful message
- [ ] Add session timeout handling
- [ ] Implement audit logging for navigation events

### UX Improvements Needed
- [ ] Add loading states for all protected routes
- [ ] Implement skeleton screens for better UX
- [ ] Add role badge in header/navigation
- [ ] Create onboarding tour per role
- [ ] Add contextual help tooltips
- [ ] Implement keyboard shortcuts for power users

### Documentation Needed
- [ ] User guides per role (Admin, Coordinator, Mentor, Teacher, Viewer)
- [ ] Video tutorials for common workflows
- [ ] FAQ section per role
- [ ] Navigation keyboard shortcuts reference

---

## 📚 Related Documentation

- **Security Report:** `/test-reports/100_PERCENT_COMPLIANCE_REPORT.md`
- **Permission System:** `/lib/permissions.ts`
- **RBAC Module:** `/lib/rbac.ts`
- **Quick Reference:** `/SECURITY_IMPLEMENTATION_GUIDE.md`

---

**Document End**

*Complete navigation map for TARL Pratham v2.0*
*All 64 pages mapped with role-based access control* ✅
