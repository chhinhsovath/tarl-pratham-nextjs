# TaRL Pratham - Complete Features Documentation by User Role

## User Roles Overview
The system has 5 main user roles:
1. **Admin** (អ្នកគ្រប់គ្រង) - Full system access
2. **Coordinator** (សម្របសម្រួល) - Data management and imports
3. **Mentor** (អ្នកណែនាំ) - Mentoring and teacher support
4. **Teacher** (គ្រូបង្រៀន) - Student assessment and management
5. **Viewer** - Read-only access to reports

## Navigation Menu Structure by Role

### 1. ADMIN Role
**Full Access to All Features**

#### Main Navigation:
- **Dashboard** (ផ្ទាំងគ្រប់គ្រង)
  - Statistics overview
  - Recent assessments
  - School performance charts
  - Student progress tracking

- **Analytics Dashboard** (វិភាគ ផ្ទាំងគ្រប់គ្រង)
  - Advanced data visualization
  - Performance metrics
  - Trend analysis

- **Assessments** (ការវាយតម្លៃ)
  - View all assessments
  - Create new assessment
  - Select students for assessment
  - Export assessment data
  - Baseline/Midline/Endline assessments

- **Verification** (ផ្ទៀងផ្ទាត់)
  - Review submitted assessments
  - Approve/reject assessments
  - View assessment history

- **Students** (សិស្ស/និស្សិត)
  - List all students
  - Add/Edit/Delete students
  - Bulk import students
  - Export student data
  - View assessment history
  - Photo management

- **Mentoring** (ការណែនាំ)
  - List mentoring visits
  - Create mentoring visit
  - View/Edit visit reports
  - Export mentoring data

- **Reports** (របាយការណ៍) - Dropdown menu
  - Analytics Dashboard
  - Assessment Analysis Report
  - Attendance Report
  - Intervention Report
  - Student Performance
  - School Comparison
  - Mentoring Impact
  - Progress Tracking

- **Coordinator Workspace** (កន្លែងធ្វើការសម្របសម្រួល)
  - Bulk imports dashboard
  - Language management
  - System overview

- **Administration** (រដ្ឋបាល) - Dropdown menu
  - Users Management
  - Schools Management
  - Classes Management
  - Settings
  - Resources
  - Assessment Management

- **Help** (ជំនួយ)
  - Getting started guide
  - Onboarding tours
  - About the project

#### User Menu Dropdown:
- My Profile (ប្រវត្តិរូបរបស់ខ្ញុំ)
- Change Password (ផ្លាស់ពាក្យសម្ងាត់)
- Getting Started (ណែនាំចាប់ផ្តើម)
- Help & Tutorials (ជំនួយ & ការណែនាំ)
- About Project (អំពីគម្រោង)
- Sign Out (ចាកចេញ)

### 2. COORDINATOR Role
**Data Management Focus**

#### Main Navigation:
- **Workspace** (កន្លែងធ្វើការ)
  - Bulk import dashboard
  - Language management
  - System overview

- **Bulk Imports**
  - Import schools
  - Import users
  - Import students
  - Download templates

- **Language Management**
  - Edit translations
  - Add/Update Khmer translations
  - Export language files

- **Reports** (Limited)
  - System reports
  - Import logs
  - Data validation reports

### 3. MENTOR Role
**Teacher Support & Monitoring**

#### Main Navigation:
- **Dashboard** (ផ្ទាំងគ្រប់គ្រង)
  - Mentor statistics
  - Recent mentoring visits
  - School assignments

- **Analytics Dashboard** (វិភាគ ផ្ទាំងគ្រប់គ្រង)

- **Assessments** (ការវាយតម្លៃ)
  - Create assessments
  - View assessment results
  - Track teacher assessments

- **Verification** (ផ្ទៀងផ្ទាត់)
  - Verify teacher assessments
  - Provide feedback

- **Students** (សិស្ស)
  - View student list
  - Add temporary students (48-hour auto-deletion)
  - View student progress

- **Mentoring** (ការណែនាំ)
  - Schedule visits
  - Create visit reports
  - Upload photos
  - Track visit history

- **Teacher Workspace** (កន្លែងធ្វើការគ្រូ)
  - Access teacher features
  - Support teacher activities

- **Reports** (របាយការណ៍)
  - My mentoring reports
  - School visit reports
  - Teacher performance

### 4. TEACHER Role
**Student Assessment & Management**

#### Main Navigation:
- **Dashboard** (ផ្ទាំងគ្រប់គ្រង)
  - Class overview
  - Recent assessments
  - Student statistics

- **Analytics Dashboard** (វិភាគ ផ្ទាំងគ្រប់គ្រង)

- **Assessments** (ការវាយតម្លៃ)
  - Create new assessment
  - Select students
  - Enter assessment data
  - View past assessments

- **Students** (សិស្ស)
  - Manage class students
  - Add new students
  - Quick add student
  - Bulk add students
  - Update student information

- **Reports** (របាយការណ៍)
  - My students report
  - Class progress
  - Assessment results

- **Teacher Profile Setup** (First-time setup)
  - Select pilot school
  - Set teaching preferences

### 5. VIEWER Role
**Read-Only Access**

#### Main Navigation:
- **Dashboard** (View only)
- **Assessments** (View only)
- **Reports** (View only)

## Forms and CRUD Operations

### User Management Forms
- **Create/Edit User Form**
  - Name (required)
  - Email (required, unique)
  - Password (required for new)
  - Role selection
  - Province selection
  - Subject selection
  - Phone number
  - Pilot school assignment

### School Management Forms
- **Create/Edit School Form**
  - School name (required)
  - School code (required, unique)
  - Province (dropdown)
  - District
  - Commune
  - Village
  - School type
  - Level
  - Total students
  - Total teachers
  - Latitude/Longitude
  - Contact phone
  - Contact email
  - Active status

### Student Management Forms
- **Create/Edit Student Form**
  - Name (required)
  - Age
  - Gender (Male/Female)
  - Guardian name
  - Guardian phone
  - Address
  - Photo upload
  - School class assignment
  - Pilot school (for mentors)

- **Bulk Import Student Form**
  - Excel file upload
  - Template download
  - Validation preview
  - Error handling

### Assessment Forms
- **Create Assessment Form**
  - Assessment type (Baseline/Midline/Endline)
  - Subject (Khmer/Math)
  - Student selection (multi-select)
  - Assessment date

- **Assessment Data Entry Form**
  - Student-by-student entry
  - Level selection (Beginner/Letter/Word/Paragraph/Story)
  - Score input
  - Notes field
  - Save & Next functionality
  - Submit all button

### Mentoring Visit Forms
- **Create/Edit Mentoring Visit Form**
  - Visit date (required)
  - Pilot school selection (required)
  - Level (Primary/Secondary)
  - Purpose of visit
  - Activities conducted (textarea)
  - Observations (textarea)
  - Recommendations (textarea)
  - Follow-up actions (textarea)
  - Photo uploads (multiple)
  - Participants count
  - Duration in minutes
  - Status (Scheduled/Completed/Cancelled)

## Special Features & Business Rules

### Mentor-Specific Rules:
1. **48-Hour Auto-Deletion**: Students and assessments created by mentors are automatically deleted after 48 hours
2. **Temporary Flag**: All mentor-created data is marked as temporary
3. **Teacher Profile Access**: Mentors can access teacher workspace features
4. **Pilot School Restriction**: Mentors can only work with assigned pilot schools

### Role-Based Restrictions:
- **Admin**: No restrictions, full access
- **Coordinator**: Cannot access student assessments directly
- **Mentor**: Cannot permanently modify data
- **Teacher**: Can only manage assigned students/classes
- **Viewer**: Read-only access to all allowed sections

### Data Validation Rules:
- Email must be unique across users
- School codes must be unique
- Student names required
- Assessment dates cannot be future dates
- Mentoring visits require school assignment

## API Endpoints Structure

### Authentication
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/session

### Users
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id
- POST /api/users/bulk-import

### Schools
- GET /api/schools
- POST /api/schools
- PUT /api/schools/:id
- DELETE /api/schools/:id
- GET /api/schools/:id/teachers
- POST /api/schools/:id/add-teacher

### Students
- GET /api/students
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id
- POST /api/students/bulk-import
- GET /api/students/:id/assessment-history

### Assessments
- GET /api/assessments
- POST /api/assessments
- PUT /api/assessments/:id
- POST /api/assessments/save-student
- POST /api/assessments/submit-all

### Mentoring
- GET /api/mentoring
- POST /api/mentoring
- PUT /api/mentoring/:id
- DELETE /api/mentoring/:id

### Reports
- GET /api/reports/dashboard
- GET /api/reports/student-performance
- GET /api/reports/school-comparison
- POST /api/reports/export