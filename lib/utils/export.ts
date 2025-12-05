import * as XLSX from 'xlsx';

export interface ExportData {
  data: any[];
  filename: string;
  sheetName?: string;
  headers?: string[];
}

/**
 * Export data to Excel format
 */
export function exportToExcel(exportData: ExportData): void {
  try {
    const { data, filename, sheetName = 'Sheet1', headers } = exportData;

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data for export
    let worksheetData;
    
    if (headers && headers.length > 0) {
      // Use custom headers
      worksheetData = [headers, ...data.map(row => headers.map(header => row[header] || ''))];
    } else {
      // Use existing data structure
      worksheetData = data;
    }

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Auto-size columns
    const colWidths = [];
    if (worksheetData.length > 0) {
      for (let i = 0; i < worksheetData[0].length; i++) {
        let maxWidth = 0;
        for (let j = 0; j < Math.min(worksheetData.length, 100); j++) {
          const cellValue = worksheetData[j][i] ? worksheetData[j][i].toString() : '';
          maxWidth = Math.max(maxWidth, cellValue.length);
        }
        colWidths.push({ width: Math.min(maxWidth + 2, 50) });
      }
      worksheet['!cols'] = colWidths;
    }

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);

  } catch (error) {
    console.error('Export to Excel error:', error);
    throw new Error('Failed to export data to Excel');
  }
}

/**
 * Export assessments data
 */
export function exportAssessments(assessments: any[]): void {
  const headers = [
    'Student Name',
    'School/Pilot School',
    'Assessment Type',
    'Subject',
    'Level',
    'Score',
    'Assessment Date',
    'Assessed By',
    'Role',
    'Notes',
    'Is Temporary',
    'Created Date'
  ];

  const data = assessments.map(assessment => ({
    'Student Name': assessment.student?.name || '',
    'School/Pilot School': assessment.pilot_school?.name || assessment.student?.school_class?.school?.name || '',
    'Assessment Type': assessment.assessment_type || '',
    'Subject': assessment.subject || '',
    'Level': assessment.level || '',
    'Score': assessment.score || '',
    'Assessment Date': assessment.assessed_date ? new Date(assessment.assessed_date).toLocaleDateString() : '',
    'Assessed By': assessment.added_by?.name || '',
    'Role': assessment.added_by?.role || '',
    'Notes': assessment.notes || '',
    'Is Temporary': assessment.is_temporary ? 'Yes' : 'No',
    'Created Date': new Date(assessment.created_at).toLocaleDateString()
  }));

  exportToExcel({
    data,
    filename: `assessments_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Assessments',
    headers
  });
}

/**
 * Export students data
 */
export function exportStudents(students: any[]): void {
  const headers = [
    'Student Name',
    'Age',
    'Gender',
    'Guardian Name',
    'Guardian Phone',
    'Address',
    'School Class',
    'School Name',
    'Pilot School',
    'Added By',
    'Is Temporary',
    'Created Date'
  ];

  const data = students.map(student => ({
    'Student Name': student.name || '',
    'Age': student.age || '',
    'Gender': student.gender || '',
    'Guardian Name': student.guardian_name || '',
    'Guardian Phone': student.guardian_phone || '',
    'Address': student.address || '',
    'School Class': student.school_class?.name || '',
    'School Name': student.school_class?.school?.name || '',
    'Pilot School': student.pilot_school?.name || '',
    'Added By': student.added_by?.name || '',
    'Is Temporary': student.is_temporary ? 'Yes' : 'No',
    'Created Date': new Date(student.created_at).toLocaleDateString()
  }));

  exportToExcel({
    data,
    filename: `students_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Students',
    headers
  });
}

/**
 * Export mentoring visits data
 */
export function exportMentoringVisits(visits: any[]): void {
  const headers = [
    'កាលបរិច្ឆេទ (Visit Date)',
    'សាលារៀន (School)',
    'លេខកូដសាលា (School Code)',
    'គ្រូព្រឹក្សា (Mentor)',
    'អ៊ីមែលគ្រូព្រឹក្សា (Mentor Email)',
    'គ្រូបង្រៀន (Teacher)',
    'អ៊ីមែលគ្រូបង្រៀន (Teacher Email)',
    'ពិន្ទុ (Score)',
    'កំណត់ហេតុ (Observation)',
    'ផែនការសកម្មភាព (Action Plan)',
    'ត្រូវការតាមដាន (Follow-up Required)',
    'ស្ថានភាព (Status)',
    'ថ្ងៃបង្កើត (Created Date)'
  ];

  const data = visits.map(visit => ({
    'កាលបរិច្ឆេទ (Visit Date)': visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('km-KH') : '',
    'សាលារៀន (School)': visit.pilot_school?.school_name || visit.pilot_school?.name || '',
    'លេខកូដសាលា (School Code)': visit.pilot_school?.school_code || '',
    'គ្រូព្រឹក្សា (Mentor)': visit.mentor?.name || '',
    'អ៊ីមែលគ្រូព្រឹក្សា (Mentor Email)': visit.mentor?.email || '',
    'គ្រូបង្រៀន (Teacher)': visit.teacher?.name || 'មិនបានបញ្ជាក់',
    'អ៊ីមែលគ្រូបង្រៀន (Teacher Email)': visit.teacher?.email || '',
    'ពិន្ទុ (Score)': visit.score !== undefined ? visit.score : '',
    'កំណត់ហេតុ (Observation)': visit.observation || '',
    'ផែនការសកម្មភាព (Action Plan)': visit.action_plan || '',
    'ត្រូវការតាមដាន (Follow-up Required)': visit.follow_up_required ? 'បាទ/ចាស' : 'ទេ',
    'ស្ថានភាព (Status)': visit.is_locked ? 'ជាប់សោ' : (visit.is_temporary ? 'បណ្តោះអាសន្ន' : 'សកម្ម'),
    'ថ្ងៃបង្កើត (Created Date)': visit.created_at ? new Date(visit.created_at).toLocaleDateString('km-KH') : ''
  }));

  exportToExcel({
    data,
    filename: `mentoring_visits_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'ប្រឹក្សាគរុកោសល្យ',
    headers
  });
}

/**
 * Export schools data
 */
export function exportSchools(schools: any[]): void {
  const headers = [
    'School Name',
    'School Code',
    'Province',
    'District',
    'Commune',
    'Village',
    'School Type',
    'Level',
    'Total Students',
    'Total Teachers',
    'Phone',
    'Email',
    'Latitude',
    'Longitude',
    'Created Date'
  ];

  const data = schools.map(school => ({
    'School Name': school.name || '',
    'School Code': school.code || '',
    'Province': school.province?.name_english || '',
    'District': school.district || '',
    'Commune': school.commune || '',
    'Village': school.village || '',
    'School Type': school.school_type || '',
    'Level': school.level || '',
    'Total Students': school.total_students || '',
    'Total Teachers': school.total_teachers || '',
    'Phone': school.phone || '',
    'Email': school.email || '',
    'Latitude': school.latitude || '',
    'Longitude': school.longitude || '',
    'Created Date': new Date(school.created_at).toLocaleDateString()
  }));

  exportToExcel({
    data,
    filename: `schools_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Schools',
    headers
  });
}

/**
 * Export users data
 */
export function exportUsers(users: any[]): void {
  const headers = [
    'Name',
    'Email',
    'Role',
    'Province',
    'Subject',
    'Phone',
    'Pilot School',
    'Profile Setup Complete',
    'Created Date'
  ];

  const data = users.map(user => ({
    'Name': user.name || '',
    'Email': user.email || '',
    'Role': user.role || '',
    'Province': user.province || '',
    'Subject': user.subject || '',
    'Phone': user.phone || '',
    'Pilot School': user.pilot_school?.name || '',
    'Profile Setup Complete': user.teacher_profile_setup ? 'Yes' : 'No',
    'Created Date': new Date(user.created_at).toLocaleDateString()
  }));

  exportToExcel({
    data,
    filename: `users_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'Users',
    headers
  });
}

/**
 * Create comprehensive system export with multiple sheets
 */
export function exportComprehensiveData(data: {
  students: any[];
  assessments: any[];
  schools: any[];
  users: any[];
  mentoringVisits: any[];
}): void {
  try {
    const workbook = XLSX.utils.book_new();

    // Students sheet
    if (data.students.length > 0) {
      const studentsData = data.students.map(student => [
        student.name,
        student.age,
        student.gender,
        student.guardian_name,
        student.guardian_phone,
        student.school_class?.school?.name || student.pilot_school?.name || '',
        student.is_temporary ? 'Yes' : 'No',
        new Date(student.created_at).toLocaleDateString()
      ]);
      
      const studentsSheet = XLSX.utils.aoa_to_sheet([
        ['Name', 'Age', 'Gender', 'Guardian', 'Phone', 'School', 'Temporary', 'Created'],
        ...studentsData
      ]);
      XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Students');
    }

    // Assessments sheet
    if (data.assessments.length > 0) {
      const assessmentsData = data.assessments.map(assessment => [
        assessment.student?.name,
        assessment.assessment_type,
        assessment.subject,
        assessment.level,
        assessment.score,
        assessment.assessed_date ? new Date(assessment.assessed_date).toLocaleDateString() : '',
        assessment.added_by?.name,
        assessment.is_temporary ? 'Yes' : 'No'
      ]);
      
      const assessmentsSheet = XLSX.utils.aoa_to_sheet([
        ['Student', 'Type', 'Subject', 'Level', 'Score', 'Date', 'Assessed By', 'Temporary'],
        ...assessmentsData
      ]);
      XLSX.utils.book_append_sheet(workbook, assessmentsSheet, 'Assessments');
    }

    // Schools sheet
    if (data.schools.length > 0) {
      const schoolsData = data.schools.map(school => [
        school.name,
        school.code,
        school.province?.name_english,
        school.total_students,
        school.total_teachers,
        school.phone,
        school.email
      ]);
      
      const schoolsSheet = XLSX.utils.aoa_to_sheet([
        ['Name', 'Code', 'Province', 'Students', 'Teachers', 'Phone', 'Email'],
        ...schoolsData
      ]);
      XLSX.utils.book_append_sheet(workbook, schoolsSheet, 'Schools');
    }

    // Users sheet
    if (data.users.length > 0) {
      const usersData = data.users.map(user => [
        user.name,
        user.email,
        user.role,
        user.province,
        user.subject,
        user.pilot_school?.name || ''
      ]);
      
      const usersSheet = XLSX.utils.aoa_to_sheet([
        ['Name', 'Email', 'Role', 'Province', 'Subject', 'Pilot School'],
        ...usersData
      ]);
      XLSX.utils.book_append_sheet(workbook, usersSheet, 'Users');
    }

    // Mentoring visits sheet
    if (data.mentoringVisits.length > 0) {
      const visitsData = data.mentoringVisits.map(visit => [
        visit.mentor?.name,
        visit.pilot_school?.name,
        visit.visit_date ? new Date(visit.visit_date).toLocaleDateString() : '',
        visit.status,
        visit.participants_count,
        visit.duration_minutes
      ]);
      
      const visitsSheet = XLSX.utils.aoa_to_sheet([
        ['Mentor', 'School', 'Date', 'Status', 'Participants', 'Duration'],
        ...visitsData
      ]);
      XLSX.utils.book_append_sheet(workbook, visitsSheet, 'Mentoring Visits');
    }

    // Generate and download file
    XLSX.writeFile(workbook, `tarl_comprehensive_export_${new Date().toISOString().split('T')[0]}.xlsx`);

  } catch (error) {
    console.error('Comprehensive export error:', error);
    throw new Error('Failed to export comprehensive data');
  }
}

/**
 * Parse CSV/Excel file for import
 */
export function parseImportFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(jsonData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsBinaryString(file);
  });
}