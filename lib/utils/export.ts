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
 * Helper function to parse string arrays
 */
function parseStringArray(value?: string | string[]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }

  return typeof value === 'string' && value ? [value] : [];
}

/**
 * Export mentoring visits data with individual sheets for each visit
 */
export function exportMentoringVisits(visits: any[]): void {
  try {
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary of all visits
    const summaryHeaders = [
      'កាលបរិច្ឆេទ (Visit Date)',
      'សាលារៀន (School)',
      'លេខកូដសាលា (School Code)',
      'គ្រូព្រឹក្សា (Mentor)',
      'គ្រូបង្រៀន (Teacher)',
      'ពិន្ទុ (Score)',
      'ត្រូវការតាមដាន (Follow-up)',
      'ស្ថានភាព (Status)'
    ];

    const summaryData = visits.map(visit => [
      visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('km-KH') : '',
      visit.pilot_school?.school_name || '',
      visit.pilot_school?.school_code || '',
      visit.mentor?.name || '',
      visit.teacher?.name || 'មិនបានបញ្ជាក់',
      visit.score !== undefined ? visit.score : '',
      visit.follow_up_required ? 'បាទ/ចាស' : 'ទេ',
      visit.is_locked ? 'ជាប់សោ' : (visit.is_temporary ? 'បណ្តោះអាសន្ន' : 'សកម្ម')
    ]);

    const summarySheet = XLSX.utils.aoa_to_sheet([summaryHeaders, ...summaryData]);

    // Auto-size columns for summary
    summarySheet['!cols'] = summaryHeaders.map(() => ({ width: 20 }));

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'សង្ខេប (Summary)');

    // Create individual sheets for each visit (up to 30 visits to avoid Excel sheet limit)
    visits.slice(0, 30).forEach((visit, index) => {
      const visitData = [
        ['ព័ត៌មានមូលដ្ឋាន (Basic Information)', ''],
        ['កាលបរិច្ឆេទចុះអប់រំ', visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('km-KH') : ''],
        ['សាលារៀន', visit.pilot_school?.school_name || ''],
        ['លេខកូដសាលា', visit.pilot_school?.school_code || ''],
        ['គ្រូព្រឹក្សា', visit.mentor?.name || ''],
        ['អ៊ីមែលគ្រូព្រឹក្សា', visit.mentor?.email || ''],
        ['គ្រូបង្រៀន', visit.teacher?.name || 'មិនបានបញ្ជាក់'],
        ['អ៊ីមែលគ្រូបង្រៀន', visit.teacher?.email || ''],
        ['តំបន់', visit.region || ''],
        ['ជួរ', visit.cluster || ''],
        ['ប្រភេទកម្មវិធី', visit.program_type || ''],
        ['ពិន្ទុ', visit.score !== undefined ? visit.score : ''],
        [''],
        ['ព័ត៌មានថ្នាក់រៀន (Class Information)', ''],
        ['ថ្នាក់រៀនកំពុងបង្រៀន', visit.class_in_session ? 'បាទ/ចាស' : 'ទេ'],
        ['មូលហេតុមិនបានបង្រៀន', visit.class_not_in_session_reason || ''],
        ['អង្កេតពេញមួយមេរៀន', visit.full_session_observed ? 'បាទ/ចាស' : 'ទេ'],
        ['ក្រុមថ្នាក់', visit.grade_group || ''],
        ['ថ្នាក់រៀនដែលបានអង្កេត', parseStringArray(visit.grades_observed).join(', ')],
        ['មុខវិជ្ជាដែលបានអង្កេត', visit.subject_observed || ''],
        ['កម្រិតភាសា', parseStringArray(visit.language_levels_observed).join(', ')],
        ['កម្រិតគណិតវិទ្យា', parseStringArray(visit.numeracy_levels_observed).join(', ')],
        [''],
        ['ទិន្នន័យសិស្ស (Student Data)', ''],
        ['សិស្សចុះឈ្មោះសរុប', visit.total_students_enrolled || 0],
        ['សិស្សមកវត្តមាន', visit.students_present || 0],
        ['សិស្សមានការរីកចម្រើន', visit.students_improved || 0],
        ['ថ្នាក់រៀនដែលធ្វើពីមុន', visit.classes_conducted_before || 0],
        [''],
        ['ការបង្រៀន និងការរៀបចំ (Teaching & Organization)', ''],
        ['ថ្នាក់រៀនចាប់ផ្តើមទាន់ពេល', visit.class_started_on_time ? 'បាទ/ចាស' : 'ទេ'],
        ['មូលហេតុចាប់ផ្តើមយឺត', visit.late_start_reason || ''],
        ['ឧបករណ៍បង្រៀន', parseStringArray(visit.teaching_materials).join(', ')],
        ['សិស្សបានដាក់ក្រុមតាមកម្រិត', visit.students_grouped_by_level ? 'បាទ/ចាស' : 'ទេ'],
        ['សិស្សចូលរួមយ៉ាងសកម្ម', visit.students_active_participation ? 'បាទ/ចាស' : 'ទេ'],
        [''],
        ['ការរៀបចំរបស់អ្នកបង្រៀន (Teacher Planning)', ''],
        ['មានផែនការបង្រៀន', visit.teacher_has_lesson_plan ? 'បាទ/ចាស' : 'ទេ'],
        ['មូលហេតុមិនមានផែនការ', visit.no_lesson_plan_reason || ''],
        ['បានធ្វើតាមផែនការ', visit.followed_lesson_plan ? 'បាទ/ចាស' : 'ទេ'],
        ['មូលហេតុមិនធ្វើតាម', visit.not_followed_reason || ''],
        ['ផែនការសមរម្យ', visit.plan_appropriate_for_levels ? 'បាទ/ចាស' : 'ទេ'],
        ['មតិយោបល់អំពីផែនការ', visit.lesson_plan_feedback || ''],
        [''],
        ['សកម្មភាព (Activities)', ''],
        ['ចំនួនសកម្មភាពអង្កេត', visit.num_activities_observed || 0],
      ];

      // Add Activity 1 details if exists
      if (visit.activity1_type) {
        visitData.push(
          [''],
          ['សកម្មភាពទី ១', ''],
          ['ប្រភេទ', visit.activity1_type],
          ['រយៈពេល (នាទី)', visit.activity1_duration || ''],
          ['ការណែនាំច្បាស់', visit.activity1_clear_instructions ? 'បាទ/ចាស' : 'ទេ'],
          ['មូលហេតុមិនច្បាស់', visit.activity1_unclear_reason || ''],
          ['ធ្វើតាមដំណើរការ', visit.activity1_followed_process ? 'បាទ/ចាស' : 'ទេ'],
          ['មូលហេតុមិនធ្វើតាម', visit.activity1_not_followed_reason || '']
        );
      }

      // Add Activity 2 details if exists
      if (visit.activity2_type) {
        visitData.push(
          [''],
          ['សកម្មភាពទី ២', ''],
          ['ប្រភេទ', visit.activity2_type],
          ['រយៈពេល (នាទី)', visit.activity2_duration || ''],
          ['ការណែនាំច្បាស់', visit.activity2_clear_instructions ? 'បាទ/ចាស' : 'ទេ'],
          ['មូលហេតុមិនច្បាស់', visit.activity2_unclear_reason || ''],
          ['ធ្វើតាមដំណើរការ', visit.activity2_followed_process ? 'បាទ/ចាស' : 'ទេ'],
          ['មូលហេតុមិនធ្វើតាម', visit.activity2_not_followed_reason || '']
        );
      }

      // Add observations and feedback
      visitData.push(
        [''],
        ['សេចក្តីសម្គាល់ និងមតិយោបល់ (Observations & Feedback)', ''],
        ['សេចក្តីសម្គាល់', visit.observation || ''],
        ['មតិយោបល់ចំពោះអ្នកបង្រៀន', visit.teacher_feedback || ''],
        ['ផែនការសកម្មភាព', visit.action_plan || ''],
        ['ត្រូវការការតាមដាន', visit.follow_up_required ? 'បាទ/ចាស' : 'ទេ'],
        [''],
        ['ស្ថានភាព (Status)', ''],
        ['ជាប់សោ', visit.is_locked ? 'បាទ/ចាស' : 'ទេ'],
        ['បណ្តោះអាសន្ន', visit.is_temporary ? 'បាទ/ចាស' : 'ទេ'],
        ['ថ្ងៃបង្កើត', visit.created_at ? new Date(visit.created_at).toLocaleDateString('km-KH') : ''],
        ['ថ្ងៃកែសម្រួល', visit.updated_at ? new Date(visit.updated_at).toLocaleDateString('km-KH') : '']
      );

      const visitSheet = XLSX.utils.aoa_to_sheet(visitData);

      // Auto-size columns
      visitSheet['!cols'] = [{ width: 30 }, { width: 50 }];

      // Create sheet name with visit number and date
      const visitDate = visit.visit_date ? new Date(visit.visit_date).toLocaleDateString('en-GB').replace(/\//g, '-') : '';
      const sheetName = `កាត់ទុក ${index + 1} (${visitDate})`.substring(0, 31); // Excel sheet name limit

      XLSX.utils.book_append_sheet(workbook, visitSheet, sheetName);
    });

    // Generate and download file
    XLSX.writeFile(workbook, `mentoring_visits_detailed_${new Date().toISOString().split('T')[0]}.xlsx`);

  } catch (error) {
    console.error('Export mentoring visits error:', error);
    throw new Error('Failed to export mentoring visits data');
  }
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