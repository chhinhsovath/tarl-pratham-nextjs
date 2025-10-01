# 🏢 Coordinator User Manual - TARL Pratham Platform

**Role:** Regional Coordinator
**Access Level:** Multi-School Management
**Language:** English/Khmer (ភាសាខ្មែរ)

---

## 📚 Table of Contents

1. [Getting Started](#getting-started)
2. [Coordinator Workspace](#coordinator-workspace)
3. [User Management](#user-management)
4. [School Management](#school-management)
5. [Student Management](#student-management)
6. [Bulk Import Tools](#bulk-import-tools)
7. [Regional Reports](#regional-reports)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### First Login

1. **Access the System**
   - Navigate to: `https://tarl.pratham.com/auth/login`
   - Enter your coordinator credentials
   - Click "ចូលប្រើប្រាស់ប្រព័ន្ធ" (Login)

   ![Screenshot: Coordinator Login]
   *Caption: Login screen for coordinators*

2. **Landing Page: Coordinator Workspace**
   - After login, you'll see your dedicated workspace
   - Overview of all schools in your region
   - Quick access to management functions

   ![Screenshot: Coordinator Workspace]
   *Caption: Main coordinator dashboard*

### Your Role & Permissions

**What You CAN Do:**
- ✅ Manage all schools in your region
- ✅ Create and edit users (except delete)
- ✅ Add and update schools
- ✅ Import students in bulk
- ✅ View all assessment data for your region
- ✅ Generate regional reports
- ✅ Export data for analysis

**What You CANNOT Do:**
- ❌ Delete users (admin-only)
- ❌ Access system settings
- ❌ Create assessment periods
- ❌ Verify assessment data
- ❌ Access schools outside your region

---

## 🏢 Coordinator Workspace

### Dashboard Overview

**Regional Statistics:**

Your workspace shows:
- Total Schools: Number of schools under your supervision
- Total Users: Mentors, teachers in your region
- Total Students: Enrolled students across all schools
- Active Assessments: Ongoing assessment activities
- This Month's Activities: Recent updates

![Screenshot: Coordinator Dashboard Stats]
*Caption: Key metrics for your region*

### School Performance Grid

**Monitor All Schools:**

View at-a-glance:
- School name and code
- Student enrollment
- Active teachers
- Assessment completion rate
- Last mentoring visit
- Performance indicator (color-coded)

![Screenshot: School Performance Grid]
*Caption: All schools with performance indicators*

**Actions Available:**
- Click school name → View detailed school data
- Click "របាយការណ៍" (Report) → School-specific report
- Click "កែសម្រួល" (Edit) → Update school details

### Quick Actions Panel

**Common Coordinator Tasks:**

- 👥 Create New User
- 🏫 Add School
- 📥 Import Students
- 📊 Generate Regional Report
- 👨‍🎓 View All Students

![Screenshot: Coordinator Quick Actions]
*Caption: Fast access to frequent tasks*

---

## 👥 User Management

### Creating Users

**Add Mentors, Teachers, Viewers:**

1. **Navigate to Users**
   - Click "អ្នកប្រើប្រាស់" (Users) in sidebar
   - Click "បង្កើតអ្នកប្រើប្រាស់ថ្មី" (Create New User)

   ![Screenshot: User Management Page]
   *Caption: User list with create button*

2. **Fill User Information:**
   ```
   Required Fields:
   - Full Name (ឈ្មោះពេញ)
   - Email Address (អ៊ីមែល)
   - Password (ពាក្យសម្ងាត់) - 8+ characters
   - Role (តួនាទី) - Mentor/Teacher/Viewer only
   - Phone Number (លេខទូរស័ព្ទ)
   - Assigned School (សាលា) - From your region

   Optional:
   - Alternative contact
   - Notes
   ```

   ![Screenshot: Create User Form]
   *Caption: User creation form for coordinators*

3. **Role Selection Guide:**

   - **Mentor (អ្នកណែនាំ)**:
     - Can create students and assessments
     - Can schedule mentoring visits
     - Can verify assessment data
     - School-limited access

   - **Teacher (គ្រូបង្រៀន)**:
     - Can create students
     - Can enter assessment data
     - Can view class reports
     - School-limited access

   - **Viewer (អ្នកមើល)**:
     - Can only view data
     - Can export reports
     - Read-only access

   ![Screenshot: Role Selection Dropdown]
   *Caption: Role options available to coordinators*

4. **Delivery Credentials:**
   - Email credentials to user
   - Print credentials PDF
   - Create quick login username

### Editing Users

**Update User Information:**

1. Find user in list
2. Click "កែសម្រួល" (Edit)
3. Modify allowed fields:
   - Name, email, phone
   - School assignment
   - Active/inactive status
4. Click "រក្សាទុក" (Save)

![Screenshot: Edit User Form]
*Caption: User editing interface*

**⚠️ Important:**
- You cannot change user roles (admin-only)
- You cannot delete users (admin-only)
- Changes take effect immediately

### Viewing User Activity

1. Click "សកម្មភាព" (Activity) next to user
2. View login history and actions performed
3. Monitor user engagement

![Screenshot: User Activity Log]
*Caption: User activity history*

---

## 🏫 School Management

### Adding New Schools

**Register School in Your Region:**

1. Navigate to "សាលា" (Schools)
2. Click "បន្ថែមសាលាថ្មី" (Add New School)

   ![Screenshot: School List]
   *Caption: Schools in your region*

3. **Enter School Information:**
   ```
   Required:
   - School Name (ឈ្មោះសាលា) - Khmer and English
   - School Code (លេខកូដសាលា) - Unique
   - Province (ខេត្ត)
   - District (ស្រុក)
   - Principal Name (ឈ្មោះនាយក)
   - Contact Phone (លេខទូរស័ព្ទ)

   Optional:
   - Full Address (អាសយដ្ឋាន)
   - Email (អ៊ីមែល)
   - GPS Location (ទីតាំង GPS)
   - Number of Teachers (ចំនួនគ្រូ)
   - Total Students (ចំនួនសិស្ស)
   - Infrastructure Notes (កំណត់ចំណាំហេដ្ឋារចនាសម្ព័ន្ធ)
   ```

   ![Screenshot: Add School Form]
   *Caption: School registration form*

4. Click "រក្សាទុក" (Save)

### Updating School Details

**Keep School Information Current:**

1. Find school in list
2. Click "កែសម្រួល" (Edit)
3. Update any field
4. Click "រក្សាទុកការផ្លាស់ប្តូរ" (Save Changes)

![Screenshot: Edit School Form]
*Caption: School editing interface*

**Updateable Information:**
- Contact details
- Principal name
- Enrollment numbers
- Infrastructure status
- Notes and comments

### School Reports

**View School Performance:**

1. Click "របាយការណ៍" (Reports) for a school
2. View:
   - Student enrollment by grade
   - Assessment completion rates
   - Teacher activity levels
   - Mentoring visit history
   - Performance trends

![Screenshot: Individual School Report]
*Caption: Detailed school performance report*

---

## 👨‍🎓 Student Management

### Viewing Students

**Access Student Data:**

1. Navigate to "សិស្ស" (Students)
2. View all students in your region
3. Filter by:
   - School
   - Grade
   - Gender
   - Assessment status

![Screenshot: Student List with Filters]
*Caption: Regional student list*

### Creating Students

**Individual Student Entry:**

1. Click "បង្កើតសិស្សថ្មី" (Create New Student)
2. **Enter Details:**
   ```
   Required:
   - Student Name (ឈ្មោះសិស្ស)
   - Gender (ភេទ)
   - Date of Birth (ថ្ងៃខែឆ្នាំកំណើត)
   - Grade (កម្រិតថ្នាក់)
   - School (សាលា) - From your region
   - Class (ថ្នាក់)

   Optional:
   - Student ID (លេខសម្គាល់)
   - Parent Name (ឈ្មោះមាតាបិតា)
   - Parent Phone (លេខទូរស័ព្ទមាតាបិតា)
   - Address (អាសយដ្ឋាន)
   ```

   ![Screenshot: Create Student Form]
   *Caption: Student creation form*

3. Click "រក្សាទុក" (Save)

### Editing Students

1. Search for student
2. Click "កែសម្រួល" (Edit)
3. Update information
4. Save changes

![Screenshot: Edit Student]
*Caption: Student editing interface*

---

## 📥 Bulk Import Tools

### Bulk Student Import

**Import Many Students at Once:**

1. **Prepare Data:**
   - Click "នាំចូលសិស្ស" (Import Students)
   - Download CSV template: "ទាញយកគំរូ" (Download Template)

   ![Screenshot: Import Students Page]
   *Caption: Bulk import landing page*

2. **Fill CSV Template:**
   ```csv
   name,gender,date_of_birth,grade,school_code,class_section,parent_name,parent_phone
   Sok Pisey,Female,2010-05-15,3,SCH001,3A,Sok Dara,012345678
   Chan Vanna,Male,2011-08-22,2,SCH001,2B,Chan Sopheap,087654321
   Meng Sreymom,Female,2009-12-10,4,SCH002,4C,Meng Sopheak,0123456789
   ```

   **Important:**
   - One student per row
   - Use exact school codes
   - Date format: YYYY-MM-DD
   - Gender: Male/Female/Other

3. **Upload File:**
   - Click "ជ្រើសរើសឯកសារ" (Choose File)
   - Select your CSV file
   - Click "នាំចូល" (Import)

   ![Screenshot: File Upload Dialog]
   *Caption: CSV file selection*

4. **Review Validation:**
   - System checks all data
   - Shows errors if any:
     - Invalid school codes
     - Duplicate students
     - Missing required fields
     - Invalid dates

   ![Screenshot: Validation Results]
   *Caption: Import validation errors and warnings*

5. **Confirm Import:**
   - Review summary: X students to import
   - Click "បញ្ជាក់ការនាំចូល" (Confirm Import)
   - Wait for completion

   ![Screenshot: Import Success]
   *Caption: Successful import confirmation*

### Bulk School Import

**Import Multiple Schools:**

1. Navigate to "នាំចូលសាលា" (Import Schools)
2. Download template
3. Fill with school data
4. Upload and validate
5. Confirm import

![Screenshot: School Bulk Import]
*Caption: School import interface*

**CSV Format:**
```csv
name,school_code,province,district,principal_name,phone
Wat Bo Primary,SCH001,Siem Reap,Siem Reap,Mr. Sok,012345678
Angkor High School,SCH002,Siem Reap,Siem Reap,Mrs. Chan,087654321
```

### Import History

**Track Your Imports:**

1. Click "ប្រវត្តិនាំចូល" (Import History)
2. View past imports:
   - Import date
   - File name
   - Records imported
   - Status (success/partial/failed)
   - Download original file

![Screenshot: Import History]
*Caption: List of past bulk imports*

---

## 📊 Regional Reports

### Available Reports

**Generate Regional Analytics:**

1. Navigate to "របាយការណ៍" (Reports)
2. **Report Types:**

   **A. Regional Overview Report**
   - All schools summary
   - Total students by grade
   - Assessment completion rates
   - Teacher distribution
   - Performance comparison

   ![Screenshot: Regional Overview Report]
   *Caption: High-level regional statistics*

   **B. School Comparison Report**
   - Side-by-side school metrics
   - Enrollment trends
   - Assessment results
   - Resource allocation
   - Performance ranking

   ![Screenshot: School Comparison Report]
   *Caption: School performance comparison*

   **C. Student Progress Report**
   - Baseline to Endline tracking
   - Grade-level improvements
   - Subject proficiency
   - At-risk student identification

   ![Screenshot: Student Progress Report]
   *Caption: Learning progress analytics*

   **D. User Activity Report**
   - Mentor/teacher engagement
   - Login frequency
   - Feature usage
   - Data entry completeness

   ![Screenshot: User Activity Report]
   *Caption: User engagement metrics*

   **E. Data Quality Report**
   - Missing data identification
   - Duplicate records
   - Data entry errors
   - Verification status

   ![Screenshot: Data Quality Report]
   *Caption: Data integrity check*

### Generating Reports

**Step-by-Step:**

1. Select report type
2. **Set Parameters:**
   ```
   - Date Range (ចន្លោះកាលបរិច្ឆេទ)
   - Schools (សាលា) - Select specific or all
   - Grades (កម្រិតថ្នាក់) - Optional filter
   - Assessment Period (រយៈពេលវាយតម្លៃ)
   ```

   ![Screenshot: Report Parameters]
   *Caption: Report configuration options*

3. Click "បង្កើតរបាយការណ៍" (Generate Report)
4. Wait for processing
5. View report

### Exporting Reports

**Export Options:**

- **PDF**: For printing and sharing
- **Excel**: For further analysis
- **CSV**: For data import

![Screenshot: Export Menu]
*Caption: Report export format options*

**How to Export:**
1. Generate report first
2. Click "នាំចេញ" (Export)
3. Select format
4. Download file

### Scheduling Reports

**Automatic Report Delivery:**

1. Click "កំណត់ពេលរបាយការណ៍" (Schedule Report)
2. Configure:
   ```
   - Report Type
   - Frequency (Daily/Weekly/Monthly)
   - Delivery Day/Time
   - Recipients (Email addresses)
   - Format (PDF/Excel)
   ```

   ![Screenshot: Schedule Report Form]
   *Caption: Automated report scheduling*

3. Click "រក្សាទុក" (Save Schedule)

---

## ✅ Best Practices

### User Management Best Practices

1. **Creating Users:**
   - ✅ Verify user information before creating account
   - ✅ Assign correct school immediately
   - ✅ Use strong, unique passwords
   - ✅ Deliver credentials securely
   - ❌ Don't share login credentials via unsecure channels

2. **Monitoring Users:**
   - ✅ Review user activity monthly
   - ✅ Deactivate accounts for transferred staff
   - ✅ Ensure users have appropriate role
   - ✅ Follow up on inactive accounts

### School Management Best Practices

1. **Data Accuracy:**
   - ✅ Update school contacts regularly
   - ✅ Keep enrollment numbers current
   - ✅ Verify principal information quarterly
   - ✅ Maintain accurate school codes

2. **School Monitoring:**
   - ✅ Review school reports weekly
   - ✅ Address data gaps promptly
   - ✅ Support low-performing schools
   - ✅ Share best practices across schools

### Student Data Best Practices

1. **Data Entry:**
   - ✅ Double-check student information
   - ✅ Use bulk import for efficiency
   - ✅ Validate data before importing
   - ✅ Fix duplicate records immediately
   - ❌ Don't create test data in production

2. **Data Quality:**
   - ✅ Run data quality reports monthly
   - ✅ Correct errors promptly
   - ✅ Follow up with schools on missing data
   - ✅ Document data issues and resolutions

### Reporting Best Practices

1. **Regular Reporting:**
   - ✅ Generate regional reports weekly
   - ✅ Share insights with school leaders
   - ✅ Track trends over time
   - ✅ Use data to inform decisions

2. **Report Distribution:**
   - ✅ Send reports to relevant stakeholders
   - ✅ Include context and explanations
   - ✅ Highlight key findings
   - ✅ Recommend actions based on data

---

## 🔧 Troubleshooting

### Common Issues

**Issue 1: Cannot Create User**

**Symptoms:**
- "Permission denied" error
- Form won't submit

**Solutions:**
- Verify you're creating Mentor/Teacher/Viewer (not Admin/Coordinator)
- Check that school is in your region
- Ensure all required fields are filled
- Try refreshing the page

---

**Issue 2: Bulk Import Failing**

**Symptoms:**
- Validation errors
- "Import failed" message

**Solutions:**
- Check CSV format matches template exactly
- Verify school codes exist in system
- Check date formats (YYYY-MM-DD)
- Remove duplicate rows
- Check for special characters in names
- Save CSV as UTF-8 encoding

---

**Issue 3: Reports Not Loading**

**Symptoms:**
- Report hangs on "Generating..."
- Timeout error

**Solutions:**
- Reduce date range
- Select fewer schools
- Try different report type
- Clear browser cache
- Try different browser

---

**Issue 4: Cannot See School Data**

**Symptoms:**
- Empty school lists
- "No schools found"

**Solutions:**
- Verify schools are assigned to your region
- Check filters are not too restrictive
- Refresh the page
- Contact admin to verify region assignment

---

### Getting Help

**Support Resources:**

1. **In-App Help:**
   - Click "?" icon for context help
   - View tutorial videos

2. **Contact Support:**
   - Email: support@tarl-pratham.com
   - Phone: [Support phone number]
   - Submit help ticket

3. **Documentation:**
   - User manual (this document)
   - FAQ section
   - Video tutorials

![Screenshot: Help Menu]
*Caption: Support resources*

---

## 📞 Quick Reference

### Important URLs

- Workspace: `/coordinator`
- Users: `/users`
- Schools: `/schools`
- Students: `/students`
- Import: `/coordinator/imports`
- Reports: `/reports`

### Common Tasks

| Task | Quick Path |
|------|-----------|
| Create User | Workspace → Users → Create New |
| Add School | Workspace → Schools → Add New |
| Import Students | Workspace → Imports → Students |
| Generate Report | Workspace → Reports → Select Type |
| View School Data | Workspace → Click School Name |

### Support Contact

- **Email:** support@tarl-pratham.com
- **Phone:** [Support phone number]
- **Hours:** Monday-Friday, 8:00 AM - 5:00 PM

---

**Coordinator User Manual - Version 2.0**
*Last Updated: 2025-10-01*
*TARL Pratham Platform - Regional Coordinator Guide*
