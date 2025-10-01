# 🎨 TARL Pratham - Visual Navigation Flowcharts

**Version:** 2.0
**Date:** 2025-10-01
**Purpose:** Visual representation of navigation flows per role

---

## 📊 Admin Role - Complete Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                          ADMIN DASHBOARD                            │
│                       (System-Wide Access)                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┼──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │    USERS     │ │   SCHOOLS   │ │   STUDENTS   │
        │  Management  │ │ Management  │ │  Management  │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │ List │ │Create│ │Edit │ │View │ │Create│ │Edit │ │ Import │
    │Users │ │ User │ │User │ │All  │ │      │ │     │ │ Bulk   │
    └──────┘ └─────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘

                ┌───────────────┴──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │ ASSESSMENTS  │ │  MENTORING  │ │ VERIFICATION │
        │  Management  │ │   Visits    │ │   System     │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │Create│ │Entry│ │Mgmt│ │Create│ │View  │ │Edit │ │ Verify │
    │      │ │     │ │    │ │Visit │ │All   │ │Own  │ │ Data   │
    └──────┘ └─────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘

                ┌───────────────┴──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │   REPORTS    │ │    ADMIN    │ │  SETTINGS    │
        │   & Analytics│ │    Tools    │ │   System     │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │Perf. │ │Comp.│ │Prog│ │Test │ │Config│ │Roles│ │Periods │
    │      │ │     │ │    │ │Data │ │      │ │     │ │        │
    └──────┘ └─────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘
```

---

## 🏢 Coordinator Role - Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                     COORDINATOR WORKSPACE                            │
│                  (Regional/District Management)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┼──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │    USERS     │ │   SCHOOLS   │ │   STUDENTS   │
        │  Management  │ │ Management  │ │  Management  │
        │  (No Delete) │ │  (Full)     │ │  (Full)      │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │ List │ │Create│ │Edit │ │All  │ │Create│ │Edit │ │ Import │
    │Users │ │ User │ │User │ │Schl │ │      │ │     │ │ Bulk   │
    └──────┘ └─────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘

                ┌───────────────┴──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │  BULK        │ │  MENTORING  │ │   REPORTS    │
        │  IMPORTS     │ │   Visits    │ │ Regional     │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │Import│ │Import│ │Imp │ │View │ │School│ │Comp.│ │Progress│
    │Users │ │Student│ │Schl│ │All  │ │Perf. │ │     │ │Track   │
    └──────┘ └──────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘
```

---

## 🎓 Mentor Role - Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MENTOR DASHBOARD                              │
│                  (School-Limited Access)                             │
│                  School: [Assigned School Only]                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┼──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │   STUDENTS   │ │ ASSESSMENTS │ │  MENTORING   │
        │  (Own School)│ │ (Own School)│ │   Visits     │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │ List │ │Create│ │Edit │ │Create│ │All   │ │Edit │ │ View   │
    │School│ │      │ │     │ │      │ │Visits│ │Own  │ │Other   │
    └──────┘ └─────┘ └────┘ └─────┘ └──────┘ └─────┘ └────────┘

                ┌───────────────┴──────────────┐
                │               │              │
                ▼               ▼              ▼
        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
        │ VERIFICATION │ │   REPORTS   │ │   TEACHER    │
        │   System     │ │(School Only)│ │  Dashboard   │
        └───────┬──────┘ └──────┬──────┘ └───────┬──────┘
                │               │                │
        ┌───────┼───────┐      │        ┌───────┼───────┐
        ▼       ▼       ▼       ▼        ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐ ┌─────┐ ┌──────┐ ┌─────┐ ┌────────┐
    │Verify│ │Approve│ │Lock│ │School│ │Can   │ │Access│ │Assess.│
    │Data  │ │      │ │    │ │Perf. │ │Access│ │Teach │ │Tools  │
    └──────┘ └──────┘ └────┘ └─────┘ └──────┘ └──────┘ └────────┘
```

---

## 👨‍🏫 Teacher Role - Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TEACHER DASHBOARD                               │
│                    (Class-Level Access)                              │
│            School: [Own School] | Class: [Assigned Class]            │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┴──────────────┐
                │                              │
                ▼                              ▼
        ┌──────────────┐             ┌─────────────┐
        │  MY STUDENTS │             │ ASSESSMENTS │
        │ (Own Class)  │             │(Own Students)│
        └───────┬──────┘             └──────┬──────┘
                │                           │
        ┌───────┼───────┐           ┌───────┼───────┐
        ▼       ▼       ▼           ▼       ▼       ▼
    ┌──────┐ ┌─────┐ ┌────┐    ┌─────┐ ┌─────┐ ┌────┐
    │ List │ │Create│ │View │   │Create│ │Entry│ │View│
    │      │ │      │ │Detail│  │      │ │     │ │    │
    └──────┘ └─────┘ └────┘    └─────┘ └─────┘ └────┘

                ┌───────────────┴──────────────┐
                │                              │
                ▼                              ▼
        ┌──────────────┐             ┌─────────────┐
        │   REPORTS    │             │  MENTORING  │
        │ (Class Only) │             │   Visits    │
        └───────┬──────┘             └──────┬──────┘
                │                           │
        ┌───────┼───────┐           ┌───────┴───────┐
        ▼       ▼       ▼           ▼               ▼
    ┌──────┐ ┌─────┐ ┌────┐    ┌─────────┐  ┌──────────┐
    │Class │ │Stud.│ │Prog│   │  View   │  │ Cannot   │
    │Prog. │ │Perf.│ │    │   │  Only   │  │  Edit    │
    └──────┘ └─────┘ └────┘    └─────────┘  └──────────┘
```

---

## 👁️ Viewer Role - Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                       VIEWER DASHBOARD                               │
│                      (Read-Only Access)                              │
│                   Assigned School(s): [Schools]                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                ┌───────────────┴──────────────┐
                │                              │
                ▼                              ▼
        ┌──────────────┐             ┌─────────────┐
        │   STUDENTS   │             │ ASSESSMENTS │
        │  (View Only) │             │ (View Only) │
        └───────┬──────┘             └──────┬──────┘
                │                           │
                ▼                           ▼
        ┌──────────────┐             ┌─────────────┐
        │   Browse     │             │    View     │
        │   Records    │             │   Results   │
        └──────────────┘             └─────────────┘

                ┌───────────────┴──────────────┐
                │                              │
                ▼                              ▼
        ┌──────────────┐             ┌─────────────┐
        │   REPORTS    │             │  MENTORING  │
        │   & Export   │             │   Visits    │
        └───────┬──────┘             └──────┬──────┘
                │                           │
        ┌───────┼───────┐           ┌───────┴───────┐
        ▼       ▼       ▼           ▼               ▼
    ┌──────┐ ┌─────┐ ┌────┐    ┌─────────┐  ┌──────────┐
    │View  │ │Export│ │Down│   │  View   │  │ Read-Only│
    │All   │ │Data │ │load│   │  Only   │  │          │
    └──────┘ └─────┘ └────┘    └─────────┘  └──────────┘
```

---

## 🔄 User Journey Examples

### Journey 1: Teacher Creates & Assesses New Student

```
START: Teacher Dashboard
    │
    ├─> Navigate to "Students"
    │       │
    │       ├─> Click "Create New Student"
    │       │       │
    │       │       ├─> Fill Student Form
    │       │       │   • Name
    │       │       │   • Age
    │       │       │   • Gender
    │       │       │   • Guardian Info
    │       │       │
    │       │       ├─> Submit (Auto-assigns to own school)
    │       │       │
    │       │       └─> Success! → Student Record Created
    │       │
    │       └─> Return to Student List (See new student)
    │
    ├─> Navigate to "Assessments"
    │       │
    │       ├─> Click "Create Assessment"
    │       │       │
    │       │       ├─> Select Student (from dropdown)
    │       │       │
    │       │       ├─> Fill Assessment Form
    │       │       │   • Assessment Type: Baseline
    │       │       │   • Subject: Khmer
    │       │       │   • Level: Beginner
    │       │       │   • Score: 75
    │       │       │
    │       │       ├─> Submit
    │       │       │
    │       │       └─> Success! → Assessment Recorded
    │       │
    │       └─> View Assessment Results
    │
    └─> Navigate to "Reports" → View "Class Progress"
            │
            └─> See newly assessed student in progress report
                    │
                    └─> END
```

### Journey 2: Mentor Verifies School Assessment Data

```
START: Mentor Dashboard
    │
    ├─> Navigate to "Verification"
    │       │
    │       ├─> View Pending Assessments
    │       │   (Filtered to own school)
    │       │
    │       ├─> Select Assessment to Verify
    │       │       │
    │       │       ├─> Review Student Details
    │       │       │
    │       │       ├─> Review Assessment Data
    │       │       │   • Check accuracy
    │       │       │   • Verify levels match
    │       │       │   • Confirm scores reasonable
    │       │       │
    │       │       ├─> Decision Point:
    │       │       │   ├─> Approve → Mark as Verified
    │       │       │   └─> Reject → Add feedback, return to teacher
    │       │       │
    │       │       └─> Submit Verification
    │       │
    │       └─> Return to Verification Queue
    │           (Assessment removed from pending)
    │
    ├─> Navigate to "Reports"
    │       │
    │       └─> View "School Performance"
    │           (Now includes verified data)
    │
    └─> END
```

### Journey 3: Coordinator Bulk Imports Students

```
START: Coordinator Workspace
    │
    ├─> Navigate to "Bulk Imports"
    │       │
    │       ├─> Select "Import Students"
    │       │       │
    │       │       ├─> Download Template (CSV/Excel)
    │       │       │
    │       │       ├─> Fill Template Offline
    │       │       │   • Student names
    │       │       │   • Ages, genders
    │       │       │   • Schools
    │       │       │   • Guardian info
    │       │       │
    │       │       ├─> Upload Completed File
    │       │       │
    │       │       ├─> Validate Data
    │       │       │   │
    │       │       │   ├─> If Errors → Show validation report
    │       │       │   │   └─> Fix & Re-upload
    │       │       │   │
    │       │       │   └─> If Valid → Continue
    │       │       │
    │       │       ├─> Confirm Import
    │       │       │   • Shows total count
    │       │       │   • Lists schools affected
    │       │       │
    │       │       ├─> Process Import
    │       │       │   (Background job)
    │       │       │
    │       │       └─> Success! → Import Summary
    │       │           • 250 students imported
    │       │           • 10 schools affected
    │       │           • 0 errors
    │       │
    │       └─> Return to Import Dashboard
    │
    ├─> Navigate to "Schools"
    │       │
    │       └─> Select School → View Students
    │           (See newly imported students)
    │
    └─> END
```

### Journey 4: Admin Manages System Settings

```
START: Admin Dashboard
    │
    ├─> Navigate to "Administration" → "Settings"
    │       │
    │       ├─> Configure Assessment Periods
    │       │       │
    │       │       ├─> Set Baseline Period
    │       │       │   • Start Date: 2025-11-01
    │       │       │   • End Date: 2025-12-15
    │       │       │
    │       │       ├─> Set Midline Period
    │       │       │   • Start Date: 2026-03-01
    │       │       │   • End Date: 2026-04-15
    │       │       │
    │       │       ├─> Set Endline Period
    │       │       │   • Start Date: 2026-07-01
    │       │       │   • End Date: 2026-08-15
    │       │       │
    │       │       └─> Save Configuration
    │       │
    │       ├─> Manage User Roles
    │       │       │
    │       │       ├─> View All Users
    │       │       │
    │       │       ├─> Promote Teacher to Mentor
    │       │       │   • Select User
    │       │       │   • Change Role: Teacher → Mentor
    │       │       │   • Assign School
    │       │       │   • Save
    │       │       │
    │       │       └─> Success! → User Role Updated
    │       │
    │       └─> Return to Administration
    │
    ├─> Navigate to "Test Data Management"
    │       │
    │       ├─> View All Test Data
    │       │
    │       ├─> Bulk Delete Test Records
    │       │   • Select "Test Session" ID
    │       │   • Confirm deletion
    │       │   • Clean up completed
    │       │
    │       └─> Return to Admin Dashboard
    │
    └─> END
```

---

## 🎯 Navigation Quick Reference

### Common Starting Points by Role

| Role | Default Landing | Common Actions |
|------|----------------|----------------|
| **Admin** | `/dashboard` | Users, Settings, Schools, All Data |
| **Coordinator** | `/coordinator` | Imports, Schools, Regional Reports |
| **Mentor** | `/dashboard` | Students, Assessments, Mentoring, Verification |
| **Teacher** | `/teacher/dashboard` | My Students, Create Assessment, Class Reports |
| **Viewer** | `/dashboard` | View Data, Export Reports |

### Quick Actions Menu (Header)

**Admin:**
- Create User
- Import Data
- System Settings
- Test Data Management

**Coordinator:**
- Import Students
- View Regional Reports
- Manage Schools

**Mentor:**
- Create Assessment
- New Mentoring Visit
- Verify Data

**Teacher:**
- Add Student
- Enter Assessment
- View Class Progress

**Viewer:**
- Export Reports
- View Analytics

---

## 📱 Mobile Navigation Patterns

### Mobile Menu Structure (All Roles)

```
☰ Hamburger Menu
    │
    ├─ 🏠 Dashboard
    ├─ 👤 Profile
    ├─ [Role-Specific Items]
    ├─ ❓ Help
    └─ 🚪 Logout
```

### Bottom Navigation (Mobile - Teacher/Mentor)

```
┌─────────┬─────────┬─────────┬─────────┐
│    🏠    │    👥    │    📝    │    📊    │
│  Home   │ Students│Assessments│Reports │
└─────────┴─────────┴─────────┴─────────┘
```

---

**Navigation Documentation Complete** ✅

*All 64 pages mapped with visual flowcharts*
*5 role-specific navigation patterns documented*
*4 complete user journey examples provided*
