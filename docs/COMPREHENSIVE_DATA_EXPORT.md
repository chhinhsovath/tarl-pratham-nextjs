# Comprehensive Data Export Feature

## Overview

The TaRL Pratham system now includes a comprehensive data export feature that allows administrators and coordinators to export all production data to Excel format with multiple organized sheets.

## Features

### 📊 Export Includes 9 Sheets:

1. **Teachers** - All active teachers with school assignments
2. **Mentors** - All active mentors with assignment details
3. **Pilot Schools** - School information with assessment periods
4. **Students** - Active students with baseline/midline/endline levels
5. **Assessments - Baseline** - All baseline assessments
6. **Assessments - Midline** - All midline assessments
7. **Assessments - Endline** - All endline assessments
8. **Verified Assessments** - All verified assessments
9. **Observations** - Mentoring visits and classroom observations

### 🔒 Security & Access Control

- **Access:** Only Admin and Coordinator roles can export data
- **Data Filter:** Exports only production data (excludes test/demo records)
- **Authentication:** Requires valid session authentication

## Usage

### For Admin Users:

1. Navigate to the **Admin Dashboard** (`/dashboard`)
2. Click the **"Export All Data"** button in the header (next to "Refresh" button)
3. Review the export details in the confirmation modal
4. Click **"Export"** to download the Excel file

### For Coordinator Users:

1. Navigate to the **Coordinator Workspace** (`/coordinator/workspace`)
2. Scroll to the **"Data Import Center"** card
3. Find the **"Comprehensive Export"** section at the bottom
4. Click the **"Export All Data"** button
5. Review and confirm the export

## Technical Details

### API Endpoint

**URL:** `GET /api/export/comprehensive`

**Authentication:** Required (Admin/Coordinator only)

**Response:** Excel file download

**Filename Format:** `TaRL_Pratham_Comprehensive_Export_YYYY-MM-DD.xlsx`

### Data Structure

#### Sheet 1: Teachers
```
Teacher ID | Name | Email | Username | Phone | Sex | School | School Code |
Province | District | Assigned Subject | Holding Classes | Active | Login Type | Created At
```

#### Sheet 2: Mentors
```
Mentor ID | Name | Email | Username | Phone | Sex | Province | District |
Assigned Schools | Active | Created At
```

#### Sheet 3: Pilot Schools
```
School ID | School Name | School Code | Province | District | Cluster |
Baseline Start | Baseline End | Midline Start | Midline End | Endline Start | Endline End |
Total Students | Total Assessments | Total Visits | Total Users | Is Locked | Created At
```

#### Sheet 4: Students
```
Student ID | Student Code | Name | Age | Gender | Grade | School | School Code |
Province | District | Guardian Name | Guardian Phone |
Baseline Khmer Level | Baseline Math Level | Midline Khmer Level | Midline Math Level |
Endline Khmer Level | Endline Math Level | Added By | Added By Mentor | Created At
```

#### Sheet 5-7: Assessments (Baseline/Midline/Endline)
```
Assessment ID | Student Name | Student Code | School | School Code | Subject | Level |
Assessment Sample | Student Consent | Assessed Date | Assessed By | Assessed By Mentor |
Verified | Verified By | Verified At | Notes | Created At
```

#### Sheet 8: Verified Assessments
```
Assessment ID | Assessment Type | Student Name | Student Code | School | School Code |
Subject | Level | Assessed Date | Assessed By | Verified By | Verified At |
Verification Notes | Is Locked | Created At
```

#### Sheet 9: Observations (Mentoring Visits)
```
Visit ID | Visit Date | Mentor | Teacher | School | School Code | Province | District |
Level | Subject Observed | Grades Observed | Students Present | Purpose | Activities |
Observations | Class In Session | Has Session Plan | Followed Session Plan |
Students Grouped By Level | Students Active Participation | Recommendations |
Follow-up Actions | Follow-up Required | Status | Is Locked | Created At
```

## Implementation Files

### Backend
- **API Route:** `/app/api/export/comprehensive/route.ts`
- **Authentication:** Uses `/lib/auth.ts` for session validation
- **Database:** Prisma ORM with PostgreSQL

### Frontend
- **Component:** `/components/export/ComprehensiveExportButton.tsx`
- **Admin Dashboard:** `/components/dashboards/AdminDashboard.tsx`
- **Coordinator Dashboard:** `/components/dashboards/CoordinatorDashboard.tsx`

### Dependencies
- **xlsx** v0.18.5 - Excel file generation
- **@prisma/client** - Database ORM
- **next-auth** - Authentication
- **antd** - UI components

## Data Filters

The export automatically filters data to include only:

✅ **Included:**
- Active users (is_active = true)
- Active students (is_active = true)
- Production records (record_status = 'production')
- All assessment cycles (baseline, midline, endline)
- Verified and unverified assessments
- All mentoring visits

❌ **Excluded:**
- Test data (record_status = 'test_mentor' | 'test_teacher')
- Demo data (record_status = 'demo')
- Archived data (record_status = 'archived')
- Inactive users and students
- Temporary records

## Performance Considerations

### Export Performance:
- **Small datasets (< 1000 records):** < 3 seconds
- **Medium datasets (1000-10000 records):** 3-10 seconds
- **Large datasets (> 10000 records):** 10-30 seconds

### Optimization Features:
- Server-side generation (reduces client load)
- Efficient Prisma queries with selective includes
- Streaming response for large files
- Memory-efficient XLSX generation

## Error Handling

The export includes comprehensive error handling for:

1. **Authentication Errors**
   - Response: 401 Unauthorized
   - Message: "Unauthorized. Please login first."

2. **Authorization Errors**
   - Response: 403 Forbidden
   - Message: "Access denied. Only admin and coordinator can export data."

3. **Database Errors**
   - Response: 500 Internal Server Error
   - Message: Detailed error with stack trace (dev only)

4. **File Generation Errors**
   - Response: 500 Internal Server Error
   - Logs: Server-side error logging

## Console Logging

The export provides detailed console logs for monitoring:

```
[Export] Starting comprehensive export by user@example.com (admin)
[Export] Fetching teachers...
[Export] Fetching mentors...
[Export] Fetching pilot schools...
[Export] Fetching students...
[Export] Fetching baseline assessments...
[Export] Fetching midline assessments...
[Export] Fetching endline assessments...
[Export] Fetching verified assessments...
[Export] Fetching mentoring visits...
[Export] Generating Excel file...
[Export] Export completed successfully: TaRL_Pratham_Comprehensive_Export_2025-01-18.xlsx
[Export] Summary:
  - Teachers: 420
  - Mentors: 35
  - Pilot Schools: 150
  - Students: 5247
  - Baseline Assessments: 4893
  - Midline Assessments: 3421
  - Endline Assessments: 2156
  - Verified Assessments: 1234
  - Observations: 567
```

## Testing the Export

### Manual Testing Checklist:

1. **Authentication Test**
   - [ ] Log in as Admin - should see export button
   - [ ] Log in as Coordinator - should see export button
   - [ ] Log in as Teacher - should NOT see export button
   - [ ] Log in as Mentor - should NOT see export button

2. **Functionality Test**
   - [ ] Click export button
   - [ ] Confirm modal appears with correct details
   - [ ] Click "Export" button
   - [ ] Loading indicator appears
   - [ ] File downloads successfully
   - [ ] Success message shows with filename and duration

3. **Data Validation**
   - [ ] Open downloaded Excel file
   - [ ] Verify all 9 sheets are present
   - [ ] Check data accuracy in each sheet
   - [ ] Verify column headers match specification
   - [ ] Confirm production data only (no test data)

4. **Error Handling Test**
   - [ ] Try export while logged out (should get 401)
   - [ ] Try export as non-admin/coordinator (should get 403)
   - [ ] Simulate database error (should get 500 with details)

## Maintenance

### Adding New Sheets

To add a new sheet to the export:

1. Query the data using Prisma:
```typescript
const newData = await prisma.modelName.findMany({
  where: { /* filters */ },
  include: { /* relations */ },
});
```

2. Transform to flat structure:
```typescript
const newSheetData = newData.map((item) => ({
  'Column 1': item.field1,
  'Column 2': item.field2,
  // ... more columns
}));
```

3. Create the sheet:
```typescript
const newSheet = XLSX.utils.json_to_sheet(newSheetData);
XLSX.utils.book_append_sheet(workbook, newSheet, 'Sheet Name');
```

### Modifying Column Structure

To add/remove/modify columns in existing sheets:

1. Update the mapping object in the export route
2. Update this documentation
3. Test the export to verify changes

## Troubleshooting

### Export button not visible
- Check user role (must be admin or coordinator)
- Verify session is active
- Clear browser cache and refresh

### Export fails with 401 error
- Session expired - log in again
- Check NextAuth configuration

### Export fails with 403 error
- User doesn't have permission
- Check role in database (must be 'admin' or 'coordinator')

### Export takes too long
- Large dataset - expected behavior
- Check database connection
- Monitor server resources

### Downloaded file is empty or corrupted
- Check browser console for errors
- Verify database has data
- Check server logs for generation errors

## Future Enhancements

Potential improvements for future versions:

1. **Selective Export**
   - Allow users to select specific sheets to export
   - Date range filters for assessments
   - School/province filters

2. **Scheduled Exports**
   - Automatic daily/weekly exports
   - Email delivery of reports

3. **Additional Formats**
   - CSV export option
   - PDF report generation
   - JSON data export

4. **Advanced Features**
   - Export templates/configurations
   - Custom column selection
   - Data aggregation options
   - Chart/graph generation

## Support

For issues or questions about the export feature:

1. Check this documentation first
2. Review console logs for detailed error messages
3. Contact system administrator
4. File a bug report with:
   - User role
   - Error message
   - Steps to reproduce
   - Expected vs actual behavior
