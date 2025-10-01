# 👑 Admin User Manual - TARL Pratham Platform

**Role:** System Administrator
**Access Level:** Full System Access
**Language:** English/Khmer (ភាសាខ្មែរ)

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [User Management](#user-management)
4. [School Management](#school-management)
5. [Student Management](#student-management)
6. [Assessment Management](#assessment-management)
7. [Mentoring System](#mentoring-system)
8. [Reports & Analytics](#reports--analytics)
9. [System Settings](#system-settings)
10. [Test Data Management](#test-data-management)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)

---

## 🚀 Getting Started

### First Login

1. **Access the System**
   - Navigate to: `https://tarl.pratham.com/auth/login`
   - Enter your admin credentials
   - Click "ចូលប្រើប្រាស់ប្រព័ន្ធ" (Login)

   ![Screenshot: Admin Login Page]
   *Caption: Admin login screen with email/password fields*

2. **Complete Profile Setup** (First-time users)
   - Upload profile photo
   - Set display name
   - Configure notification preferences
   - Click "រក្សាទុក" (Save)

   ![Screenshot: Profile Setup Screen]
   *Caption: Initial profile configuration interface*

3. **Dashboard Landing**
   - After login, you'll see the Admin Dashboard
   - Overview of system-wide statistics
   - Quick access to all management functions

   ![Screenshot: Admin Dashboard]
   *Caption: Main admin dashboard with system statistics*

---

## 📊 Dashboard Overview

### System Statistics

**What You See:**
- Total Users: System-wide user count by role
- Total Schools: All registered pilot schools
- Total Students: All enrolled students (production + test)
- Active Assessments: Ongoing assessment periods
- Mentoring Visits: This month's mentoring activities
- System Health: Server status, database performance

![Screenshot: Dashboard Statistics Cards]
*Caption: Key metrics displayed as cards at top of dashboard*

### Quick Actions Panel

**Available Actions:**
- 👥 Create New User
- 🏫 Add School
- 📝 Start Assessment Period
- 📊 Generate Report
- ⚙️ System Settings

![Screenshot: Quick Actions Panel]
*Caption: Quick action buttons for common admin tasks*

### Recent Activity Feed

**Monitor:**
- User login activities
- CRUD operations (create, update, delete)
- Failed access attempts
- System errors
- Audit log highlights

![Screenshot: Activity Feed]
*Caption: Real-time activity log showing recent system events*

---

## 👥 User Management

### Creating Users

**Step-by-Step:**

1. **Navigate to Users**
   - Click "ការគ្រប់គ្រងអ្នកប្រើប្រាស់" (User Management) in sidebar
   - Click "បង្កើតអ្នកប្រើប្រាស់ថ្មី" (Create New User)

   ![Screenshot: Users List Page]
   *Caption: User management interface with user list*

2. **Fill User Details**
   ```
   Required Fields:
   - Full Name (ឈ្មោះពេញ)
   - Email Address (អ៊ីមែល)
   - Password (ពាក្យសម្ងាត់) - Must be 8+ characters with uppercase, lowercase, and number
   - Role (តួនាទី) - Select: Admin/Coordinator/Mentor/Teacher/Viewer
   - Phone Number (លេខទូរស័ព្ទ)
   - Assigned School (សាលា) - For Mentor/Teacher/Viewer only
   ```

   ![Screenshot: Create User Form]
   *Caption: User creation form with all required fields*

3. **Assign Permissions**
   - Admin: Full access to all functions
   - Coordinator: Multi-school management, user creation (no delete), regional reports
   - Mentor: School-limited access, verification rights, mentoring visits
   - Teacher: Class management, assessment entry, student tracking
   - Viewer: Read-only access to assigned school data

   ![Screenshot: Role Permission Selection]
   *Caption: Role dropdown with permission descriptions*

4. **Send Credentials**
   - Option 1: System auto-generates email with login credentials
   - Option 2: Download credentials PDF to print/share manually
   - Option 3: Create Quick Login username for field workers

   ![Screenshot: Credential Delivery Options]
   *Caption: Options for delivering user credentials*

### Editing Users

**Update User Information:**

1. Click "កែសម្រួល" (Edit) next to user name
2. Modify allowed fields:
   - Name, email, phone
   - Role (with caution - affects permissions)
   - School assignment
   - Active/inactive status
3. Click "រក្សាទុកការផ្លាស់ប្តូរ" (Save Changes)

![Screenshot: Edit User Form]
*Caption: User editing interface with modification history*

**⚠️ Important Notes:**
- Changing role immediately updates user permissions
- Deactivating user blocks access but preserves data
- Audit logs track all user modifications

### Viewing User Activity

**Audit Trail:**

1. Click "ប្រវត្តិសកម្មភាព" (Activity History) for any user
2. View detailed logs:
   - Login/logout times
   - CRUD operations performed
   - Data accessed
   - Failed access attempts
   - IP addresses and devices used

![Screenshot: User Activity Log]
*Caption: Detailed audit log for a specific user*

### Bulk User Import

**Import Multiple Users:**

1. Download CSV template: Click "ទាញយកគំរូ" (Download Template)
2. Fill template with user data (one user per row)
3. Upload CSV: Click "នាំចូលអ្នកប្រើប្រាស់" (Import Users)
4. Review validation results
5. Confirm import

![Screenshot: Bulk Import Interface]
*Caption: CSV import wizard with validation preview*

**CSV Format:**
```csv
name,email,password,role,phone,pilot_school_id
John Doe,john@example.com,Pass123!,mentor,012345678,5
Jane Smith,jane@example.com,Secure456!,teacher,087654321,5
```

---

## 🏫 School Management

### Adding Schools

**Register New Pilot School:**

1. Navigate to "ការគ្រប់គ្រងសាលា" (School Management)
2. Click "បន្ថែមសាលាថ្មី" (Add New School)

   ![Screenshot: School List Page]
   *Caption: School management interface with existing schools*

3. **Enter School Information:**
   ```
   Required:
   - School Name (ឈ្មោះសាលា) - Khmer and English
   - School Code (លេខកូដសាលា) - Unique identifier
   - Province/District (ខេត្ត/ស្រុក)
   - Contact Phone (លេខទូរស័ព្ទ)
   - Principal Name (ឈ្មោះនាយក)

   Optional:
   - Address (អាសយដ្ឋាន)
   - Email (អ៊ីមែល)
   - GPS Coordinates (ទីតាំង GPS)
   - Number of Teachers (ចំនួនគ្រូ)
   - Number of Students (ចំនួនសិស្ស)
   ```

   ![Screenshot: Add School Form]
   *Caption: School registration form with all fields*

4. Click "រក្សាទុក" (Save)

### Editing School Details

1. Find school in list
2. Click "កែសម្រួល" (Edit)
3. Update information
4. Click "រក្សាទុកការផ្លាស់ប្តូរ" (Save Changes)

![Screenshot: Edit School Form]
*Caption: School editing interface*

### School Reports

**View School Performance:**

1. Click "របាយការណ៍" (Reports) next to school name
2. Available reports:
   - Student enrollment trends
   - Assessment results by grade
   - Teacher activity
   - Mentoring visit history
   - Attendance rates

![Screenshot: School Reports Dashboard]
*Caption: School-specific analytics and reports*

---

## 👨‍🎓 Student Management

### Creating Students

**Individual Student Entry:**

1. Navigate to "សិស្ស" (Students)
2. Click "បង្កើតសិស្សថ្មី" (Create New Student)

   ![Screenshot: Student List Page]
   *Caption: Student management interface with search filters*

3. **Enter Student Details:**
   ```
   Required:
   - Student Name (ឈ្មោះសិស្ស) - Khmer and English
   - Gender (ភេទ) - Male/Female/Other
   - Date of Birth (ថ្ងៃខែឆ្នាំកំណើត)
   - Grade Level (កម្រិតថ្នាក់)
   - School (សាលា)
   - Class/Section (ថ្នាក់/វេន)

   Optional:
   - Student ID (លេខសម្គាល់សិស្ស)
   - Parent Name (ឈ្មោះម្តាយឪពុក)
   - Parent Phone (លេខទូរស័ព្ទម្តាយឪពុក)
   - Address (អាសយដ្ឋាន)
   - Special Needs (តម្រូវការពិសេស)
   ```

   ![Screenshot: Create Student Form]
   *Caption: Student creation form with all fields*

4. Click "រក្សាទុក" (Save)

### Bulk Student Import

**Import Multiple Students:**

1. Click "នាំចូលសិស្សជាច្រើន" (Import Students)
2. Download CSV template
3. Fill with student data
4. Upload file
5. Review validation
6. Confirm import

![Screenshot: Student Bulk Import]
*Caption: CSV import interface for students*

**CSV Format:**
```csv
name,gender,date_of_birth,grade,school_id,class_section
Sok Pisey,Female,2010-05-15,3,5,3A
Chan Dara,Male,2011-08-22,2,5,2B
```

### Managing Student Records

**Edit Student:**
1. Search for student
2. Click "កែសម្រួល" (Edit)
3. Update information
4. Click "រក្សាទុក" (Save)

![Screenshot: Edit Student Form]
*Caption: Student editing interface*

**View Student History:**
- Assessment results timeline
- Attendance records
- Progress tracking
- Mentoring notes
- Grade changes

![Screenshot: Student Profile Page]
*Caption: Complete student profile with history*

---

## 📝 Assessment Management

### Creating Assessment Periods

**Set Up New Assessment Cycle:**

1. Navigate to "ការគ្រប់គ្រងការវាយតម្លៃ" (Assessment Management)
2. Click "រយៈពេលវាយតម្លៃថ្មី" (New Assessment Period)

   ![Screenshot: Assessment Periods List]
   *Caption: Active and past assessment periods*

3. **Configure Period:**
   ```
   Required:
   - Period Name (ឈ្មោះរយៈពេល) - e.g., "Baseline Q1 2025"
   - Assessment Type (ប្រភេទ) - Baseline/Midline/Endline
   - Start Date (ថ្ងៃចាប់ផ្តើម)
   - End Date (ថ្ងៃបញ្ចប់)
   - Target Grades (កម្រិតថ្នាក់គោលដៅ)
   - Target Schools (សាលាគោលដៅ)

   Optional:
   - Description (ពិពណ៌នា)
   - Special Instructions (សេចក្តីណែនាំពិសេស)
   ```

   ![Screenshot: Create Assessment Period Form]
   *Caption: Assessment period configuration*

4. Click "បង្កើត" (Create)

### Monitoring Assessment Progress

**Track Completion:**

1. View assessment period dashboard
2. Monitor metrics:
   - Total students to assess
   - Completed assessments
   - In-progress assessments
   - Verification status
   - School-by-school breakdown

![Screenshot: Assessment Progress Dashboard]
*Caption: Real-time assessment completion tracking*

### Verifying Assessment Data

**Quality Assurance:**

1. Navigate to "ផ្ទៀងផ្ទាត់" (Verification)
2. Review flagged assessments:
   - Incomplete data
   - Unusual score patterns
   - Missing signatures
   - Data entry errors

   ![Screenshot: Verification Queue]
   *Caption: List of assessments requiring verification*

3. For each assessment:
   - Review student responses
   - Check assessor credentials
   - Verify data accuracy
   - Approve or reject

   ![Screenshot: Verification Details]
   *Caption: Individual assessment verification interface*

### Assessment Reports

**Generate Reports:**

1. Click "របាយការណ៍" (Reports) in Assessment section
2. Select report type:
   - System-wide results
   - School comparison
   - Grade-level analysis
   - Subject proficiency
   - Progress tracking (baseline → midline → endline)

![Screenshot: Assessment Reports Menu]
*Caption: Available assessment report types*

---

## 👔 Mentoring System

### Viewing All Mentoring Visits

**System-Wide Overview:**

1. Navigate to "ការណែនាំ" (Mentoring)
2. View all visits across all schools
3. Filter by:
   - Date range
   - School
   - Mentor
   - Visit type
   - Status (scheduled/completed/cancelled)

![Screenshot: Mentoring Visits List]
*Caption: All mentoring visits with filters*

### Creating Mentoring Visits (Admin Privilege)

**Schedule Visit:**

1. Click "បង្កើតការណែនាំថ្មី" (Create New Visit)
2. **Fill Details:**
   ```
   Required:
   - Visit Date (ថ្ងៃណែនាំ)
   - School (សាលា)
   - Mentor (អ្នកណែនាំ)
   - Visit Type (ប្រភេទ) - Classroom observation/Teacher support/Assessment support
   - Teachers Involved (គ្រូចូលរួម)

   Optional:
   - Visit Objectives (គោលបំណងណែនាំ)
   - Materials Needed (ឧបករណ៍ត្រូវការ)
   ```

   ![Screenshot: Create Mentoring Visit Form]
   *Caption: Mentoring visit scheduling interface*

3. Click "កំណត់ពេល" (Schedule)

### Reviewing Mentoring Reports

**Access Visit Reports:**

1. Click "របាយការណ៍" (Report) next to completed visit
2. Review:
   - Observation notes
   - Teacher feedback
   - Strengths identified
   - Areas for improvement
   - Action items
   - Follow-up plan

![Screenshot: Mentoring Report Details]
*Caption: Detailed mentoring visit report*

### Mentoring Analytics

**Track Mentoring Impact:**

1. Navigate to "វិភាគការណែនាំ" (Mentoring Analytics)
2. View metrics:
   - Total visits per school
   - Mentor productivity
   - Teacher development progress
   - Common challenges identified
   - Intervention effectiveness

![Screenshot: Mentoring Analytics Dashboard]
*Caption: Mentoring system analytics and trends*

---

## 📈 Reports & Analytics

### System-Wide Reports

**Available Report Types:**

1. **User Activity Report**
   - Login frequency
   - Feature usage
   - Time spent in system
   - Role-based activity breakdown

   ![Screenshot: User Activity Report]
   *Caption: System usage statistics*

2. **School Performance Report**
   - Enrollment trends
   - Assessment results comparison
   - Teacher activity levels
   - Student progress tracking

   ![Screenshot: School Performance Report]
   *Caption: School comparison dashboard*

3. **Assessment Results Report**
   - Baseline/Midline/Endline comparison
   - Subject proficiency levels
   - Grade-level analysis
   - Regional comparisons

   ![Screenshot: Assessment Results Report]
   *Caption: Assessment outcomes visualization*

4. **Mentoring Impact Report**
   - Visits completed vs. scheduled
   - Teacher development metrics
   - School improvement correlation
   - Mentor effectiveness ratings

   ![Screenshot: Mentoring Impact Report]
   *Caption: Mentoring program effectiveness data*

5. **Audit & Security Report**
   - Failed login attempts
   - Unauthorized access attempts
   - Data modification history
   - User permission changes

   ![Screenshot: Audit Report]
   *Caption: Security and compliance audit log*

### Generating Custom Reports

**Create Custom Report:**

1. Navigate to "របាយការណ៍ផ្ទាល់ខ្លួន" (Custom Reports)
2. Select data sources
3. Choose metrics
4. Apply filters
5. Configure visualization (charts/tables)
6. Generate and export

![Screenshot: Custom Report Builder]
*Caption: Drag-and-drop report builder interface*

### Exporting Data

**Export Options:**

- PDF: For printing/sharing
- Excel: For further analysis
- CSV: For data import to other systems
- JSON: For API integrations

![Screenshot: Export Options Menu]
*Caption: Data export format selection*

---

## ⚙️ System Settings

### General Settings

**Configure System Behavior:**

1. Navigate to "ការកំណត់" (Settings)
2. **General Tab:**
   ```
   - System Name (ឈ្មោះប្រព័ន្ធ)
   - Default Language (ភាសាលំនាំដើម)
   - Time Zone (តំបន់ពេលវេលា)
   - Date Format (ទ្រង់ទ្រាយកាលបរិច្ឆេទ)
   - Academic Year Start (ឆ្នាំសិក្សាចាប់ផ្តើម)
   ```

   ![Screenshot: General Settings]
   *Caption: System-wide configuration options*

### Security Settings

**Configure Security:**

1. **Authentication Settings:**
   - Password complexity rules
   - Session timeout duration
   - Multi-factor authentication (MFA) toggle
   - Quick login enable/disable

   ![Screenshot: Authentication Settings]
   *Caption: Security and authentication configuration*

2. **IP Whitelist Management:**
   - Add trusted IP addresses
   - Set IP restrictions for admin/coordinator roles
   - View IP access log

   ![Screenshot: IP Whitelist]
   *Caption: IP-based access control*

3. **Rate Limiting:**
   - Configure request limits per role
   - Set blocking duration
   - View rate limit violations

   ![Screenshot: Rate Limit Settings]
   *Caption: API rate limiting configuration*

### Notification Settings

**Email Notifications:**

1. Configure SMTP settings
2. Enable/disable notification types:
   - User account creation
   - Password reset
   - Assessment reminders
   - System alerts
   - Weekly reports

![Screenshot: Notification Settings]
*Caption: Email notification configuration*

### Backup & Restore

**Data Backup:**

1. Navigate to "ការបម្រុងទុក" (Backup)
2. **Manual Backup:**
   - Click "បម្រុងទុកឥឡូវនេះ" (Backup Now)
   - Download backup file
   - Store securely

   ![Screenshot: Backup Interface]
   *Caption: Database backup controls*

3. **Automatic Backup:**
   - Schedule daily/weekly backups
   - Set retention period
   - Configure backup location

   ![Screenshot: Automatic Backup Settings]
   *Caption: Scheduled backup configuration*

**Restore Data:**

1. Click "ស្តារទិន្នន័យ" (Restore Data)
2. Select backup file
3. Preview restore contents
4. Confirm restore

![Screenshot: Restore Interface]
*Caption: Data restoration wizard*

---

## 🧪 Test Data Management

### Creating Test Data

**Why Test Data?**
- Safely test features without affecting production data
- Train users on realistic scenarios
- Demonstrate system capabilities

**Create Test Users:**

1. Navigate to "ទិន្នន័យសាកល្បង" (Test Data Management)
2. Click "បង្កើតអ្នកប្រើប្រាស់សាកល្បង" (Create Test Users)
3. Select role and quantity
4. System auto-generates test accounts

![Screenshot: Test Data Management]
*Caption: Test data creation interface*

**Create Test Schools:**

1. Click "បង្កើតសាលាសាកល្បង" (Create Test Schools)
2. Specify number of schools
3. System generates realistic data

**Create Test Students:**

1. Click "បង្កើតសិស្សសាកល្បង" (Create Test Students)
2. Select school and grade distribution
3. Specify quantity
4. System generates student records

### Isolating Test Data

**Test Data Indicators:**

- All test records tagged with `record_status: 'test_mentor'` or `'test_teacher'`
- Test data badge appears in lists
- Separate test data filter in reports
- Test data never included in production reports (unless explicitly requested)

![Screenshot: Test Data Badge]
*Caption: Visual indicators for test records*

### Deleting Test Data

**Bulk Delete:**

1. Click "លុបទិន្នន័យសាកល្បង" (Delete Test Data)
2. Select what to delete:
   - Test users only
   - Test schools only
   - Test students only
   - All test data
3. Confirm deletion (irreversible)

![Screenshot: Delete Test Data Confirmation]
*Caption: Test data deletion wizard*

---

## 🔧 Troubleshooting

### Common Issues & Solutions

**Issue 1: Users Cannot Login**

**Symptoms:**
- "Invalid credentials" error
- Account locked message

**Solutions:**
1. Verify account is active: Check user status in user management
2. Reset password: Click "Reset Password" next to user
3. Check IP whitelist: If admin/coordinator, ensure IP is whitelisted
4. Review audit log: Check for failed login attempts

![Screenshot: User Status Check]
*Caption: Verifying user account status*

---

**Issue 2: Assessment Data Not Appearing**

**Symptoms:**
- Missing assessments in reports
- Empty assessment lists

**Solutions:**
1. Check assessment period dates: Ensure within active period
2. Verify school assignment: User must have school access
3. Check verification status: Unverified data may be hidden
4. Review data filters: Clear any active filters

![Screenshot: Assessment Filters]
*Caption: Checking assessment data filters*

---

**Issue 3: Slow System Performance**

**Symptoms:**
- Pages load slowly
- Timeouts on large reports
- Database errors

**Solutions:**
1. Check system health dashboard: Monitor server resources
2. Review audit log: Check for unusual activity
3. Clear cached data: Click "Clear Cache" in settings
4. Contact support: If issue persists

![Screenshot: System Health Dashboard]
*Caption: Server performance monitoring*

---

**Issue 4: Report Export Fails**

**Symptoms:**
- Export button not responding
- "Export failed" error message

**Solutions:**
1. Reduce report date range: Try smaller time periods
2. Apply filters: Limit data volume
3. Try different format: PDF instead of Excel
4. Check browser console: Look for JavaScript errors

---

### Getting Help

**Support Resources:**

1. **In-App Help:**
   - Click "?" icon in any page
   - Context-sensitive help tooltips
   - Video tutorials (if available)

2. **Contact Support:**
   - Email: support@tarl-pratham.com
   - Phone: [Support phone number]
   - Support ticket system: Click "Submit Ticket" in help menu

3. **Documentation:**
   - Complete system documentation: `/docs/`
   - API documentation: `/docs/api/`
   - User guides: `/docs/user-manuals/`

![Screenshot: Help Menu]
*Caption: In-app help resources*

---

## ✅ Best Practices

### Security Best Practices

1. **User Management:**
   - ✅ Regularly review user accounts for inactive users
   - ✅ Disable accounts for departed staff immediately
   - ✅ Audit user permissions quarterly
   - ✅ Enforce strong password policies
   - ❌ Never share admin credentials
   - ❌ Avoid creating generic shared accounts

2. **Data Protection:**
   - ✅ Review audit logs weekly
   - ✅ Monitor failed login attempts
   - ✅ Keep IP whitelist updated
   - ✅ Run backups before major changes
   - ❌ Never disable security features in production
   - ❌ Avoid exporting sensitive data unnecessarily

### Operational Best Practices

1. **System Maintenance:**
   - ✅ Schedule maintenance during low-usage hours
   - ✅ Notify users before planned downtime
   - ✅ Test changes in staging environment first
   - ✅ Keep backup of system settings
   - ✅ Document all configuration changes

2. **User Support:**
   - ✅ Respond to user issues within 24 hours
   - ✅ Document common issues and solutions
   - ✅ Provide training for new features
   - ✅ Collect user feedback regularly
   - ✅ Update user documentation when system changes

3. **Data Management:**
   - ✅ Clean up test data regularly
   - ✅ Archive old assessment periods
   - ✅ Validate data before bulk imports
   - ✅ Run data quality reports monthly
   - ❌ Never delete production data without backup
   - ❌ Avoid manual database edits

### Reporting Best Practices

1. **Regular Reporting Schedule:**
   - Weekly: User activity, system health
   - Monthly: School performance, assessment progress
   - Quarterly: Comprehensive program evaluation
   - Annually: Year-end summary report

2. **Report Distribution:**
   - ✅ Share relevant reports with stakeholders
   - ✅ Explain report findings with context
   - ✅ Use visualizations for clarity
   - ✅ Include actionable recommendations
   - ❌ Avoid overwhelming recipients with too much data

---

## 📞 Quick Reference

### Common Keyboard Shortcuts

- `Ctrl + K` - Quick search
- `Ctrl + N` - New record (context-aware)
- `Ctrl + S` - Save current form
- `Ctrl + /` - Open help
- `Esc` - Close modal/cancel action

### Important URLs

- Dashboard: `/dashboard`
- User Management: `/users`
- School Management: `/schools`
- Student Management: `/students`
- Assessment Management: `/assessments`
- Mentoring: `/mentoring`
- Reports: `/reports`
- Settings: `/settings`
- Test Data: `/admin/test-data`

### Support Contact

- **Email:** support@tarl-pratham.com
- **Phone:** [Support phone number]
- **Hours:** Monday-Friday, 8:00 AM - 5:00 PM ICT
- **Emergency:** [Emergency contact for critical issues]

---

**Admin User Manual - Version 2.0**
*Last Updated: 2025-10-01*
*TARL Pratham Platform - Complete System Administration Guide*
