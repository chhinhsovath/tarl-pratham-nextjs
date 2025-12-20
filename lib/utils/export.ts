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
 * Export comparison data (teacher vs mentor assessments)
 */
export function exportComparisonData(comparisons: any[]): void {
  const headers = [
    'ឈ្មោះសិស្ស (Student Name)',
    'លេខសម្គាល់សិស្ស (Student ID)',
    'អាយុ (Age)',
    'ភេទ (Gender)',
    'សាលារៀន (School)',
    'លេខកូដសាលា (School Code)',
    'ខេត្ត (Province)',
    'ស្រុក (District)',
    'ប្រភេទការវាយតម្លៃ (Assessment Type)',
    'មុខវិជ្ជា (Subject)',
    
    // Teacher Assessment Columns
    'ឈ្មោះគ្រូបង្រៀន (Teacher Name)',
    'កម្រិតគ្រូបង្រៀន (Teacher Level)',
    'កាលបរិច្ឆេទវាយតម្លៃគ្រូ (Teacher Assessment Date)',
    
    // Mentor Assessment Columns
    'ឈ្មោះគ្រូព្រឹក្សា (Mentor Name)',
    'កម្រិតគ្រូព្រឹក្សា (Mentor Level)',
    'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Mentor Verification Date)',
    
    // Comparison Results
    'ស្ថានភាពផ្ទៀងផ្ទាត់ (Verification Status)',
    'ការប្រៀបធៀបកម្រិត (Level Match)',
    'កំណត់ចំណាំផ្ទៀងផ្ទាត់ (Verification Notes)'
  ];

  const data = comparisons.map(comparison => ({
    'ឈ្មោះសិស្ស (Student Name)': comparison.student_name || '',
    'លេខសម្គាល់សិស្ស (Student ID)': comparison.student_id || '',
    'អាយុ (Age)': comparison.age || '',
    'ភេទ (Gender)': comparison.gender || '',
    'សាលារៀន (School)': comparison.school_name || '',
    'លេខកូដសាលា (School Code)': comparison.school_code || '',
    'ខេត្ត (Province)': comparison.province || '',
    'ស្រុក (District)': comparison.district || '',
    'ប្រភេទការវាយតម្លៃ (Assessment Type)': comparison.assessment_type?.toUpperCase() || '',
    'មុខវិជ្ជា (Subject)': comparison.subject?.toUpperCase() || '',
    
    // Teacher Assessment Data
    'ឈ្មោះគ្រូបង្រៀន (Teacher Name)': comparison.teacher_name || '',
    'កម្រិតគ្រូបង្រៀន (Teacher Level)': comparison.teacher_level || '',
    'កាលបរិច្ឆេទវាយតម្លៃគ្រូ (Teacher Assessment Date)': comparison.teacher_assessment_date ? 
      new Date(comparison.teacher_assessment_date).toLocaleDateString('km-KH') : '',
    
    // Mentor Assessment Data
    'ឈ្មោះគ្រូព្រឹក្សា (Mentor Name)': comparison.mentor_name === 'រង់ចាំផ្ទៀងផ្ទាត់' ? 
      'រង់ចាំ (Pending)' : comparison.mentor_name || '',
    'កម្រិតគ្រូព្រឹក្សា (Mentor Level)': comparison.mentor_level || '',
    'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Mentor Verification Date)': comparison.mentor_verification_date ? 
      new Date(comparison.mentor_verification_date).toLocaleDateString('km-KH') : '',
    
    // Comparison Results
    'ស្ថានភាពផ្ទៀងផ្ទាត់ (Verification Status)': 
      comparison.verification_status === 'verified' ? 'បានផ្ទៀងផ្ទាត់ (VERIFIED)' : 'រង់ចាំ (PENDING)',
    'ការប្រៀបធៀបកម្រិត (Level Match)': 
      comparison.level_match === true ? 'ត្រូវគ្នា (MATCH)' : 
      comparison.level_match === false ? 'ខុសគ្នា (MISMATCH)' : 
      'មិនអាចប្រៀបធៀប (N/A)',
    'កំណត់ចំណាំផ្ទៀងផ្ទាត់ (Verification Notes)': comparison.verification_notes || ''
  }));

  exportToExcel({
    data,
    filename: `assessment_comparison_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'ការប្រៀបធៀបការវាយតម្លៃ',
    headers
  });
}

/**
 * Export assessments data
 */
export function exportAssessments(assessments: any[]): void {
  const headers = [
    'ឈ្មោះសិស្ស (Student Name)',
    'លេខសម្គាល់សិស្ស (Student ID)',
    'អាយុ (Age)',
    'ភេទ (Gender)',
    'សាលារៀន (School)',
    'លេខកូដសាលា (School Code)',
    'ប្រភេទការវាយតម្លៃ (Assessment Type)',
    'មុខវិជ្ជា (Subject)',
    'កម្រិត (Level)',
    'ពិន្ទុ (Score)',
    'កាលបរិច្ឆេទវាយតម្លៃ (Assessment Date)',
    'វាយតម្លៃដោយ (Assessed By)',
    'តួនាទី (Role)',
    'ស្ថានភាពផ្ទៀងផ្ទាត់ (Verification Status)',
    'ផ្ទៀងផ្ទាត់ដោយ (Verified By)',
    'កំណត់ចំណាំផ្ទៀងផ្ទាត់ (Verification Notes)',
    'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Verification Date)',
    'ស្ថានភាពសោ (Lock Status)',
    'កំណត់ចំណាំ (Notes)',
    'ប្រភេទទិន្នន័យ (Data Type)',
    'កាលបរិច្ឆេទបង្កើត (Created Date)'
  ];

  const data = assessments.map(assessment => ({
    'ឈ្មោះសិស្ស (Student Name)': assessment.students?.name || '',
    'លេខសម្គាល់សិស្ស (Student ID)': assessment.students?.student_id || assessment.students?.id || '',
    'អាយុ (Age)': assessment.students?.age || '',
    'ភេទ (Gender)': assessment.students?.gender || '',
    'សាលារៀន (School)': assessment.pilot_schools?.school_name || assessment.pilot_schools?.name || '',
    'លេខកូដសាលា (School Code)': assessment.pilot_schools?.school_code || '',
    'ប្រភេទការវាយតម្លៃ (Assessment Type)': assessment.assessment_type?.toUpperCase() || '',
    'មុខវិជ្ជា (Subject)': assessment.subject?.toUpperCase() || '',
    'កម្រិត (Level)': assessment.level || '',
    'ពិន្ទុ (Score)': assessment.score !== null ? assessment.score : '',
    'កាលបរិច្ឆេទវាយតម្លៃ (Assessment Date)': assessment.assessed_date ? new Date(assessment.assessed_date).toLocaleDateString('km-KH') : '',
    'វាយតម្លៃដោយ (Assessed By)': assessment.users_assessments_added_by_idTousers?.name || '',
    'តួនាទី (Role)': assessment.users_assessments_added_by_idTousers?.role?.toUpperCase() || '',
    'ស្ថានភាពផ្ទៀងផ្ទាត់ (Verification Status)': assessment.verified_by_id ? 'VERIFIED' : 'PENDING',
    'ផ្ទៀងផ្ទាត់ដោយ (Verified By)': assessment.users_assessments_verified_by_idTousers?.name || '',
    'កំណត់ចំណាំផ្ទៀងផ្ទាត់ (Verification Notes)': assessment.verification_notes || '',
    'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ (Verification Date)': assessment.verified_at ? new Date(assessment.verified_at).toLocaleDateString('km-KH') : '',
    'ស្ថានភាពសោ (Lock Status)': assessment.is_locked ? 'ជាប់សោ (LOCKED)' : 'សកម្ម (ACTIVE)',
    'កំណត់ចំណាំ (Notes)': assessment.notes || '',
    'ប្រភេទទិន្នន័យ (Data Type)': assessment.is_temporary ? 'បណ្តោះអាសន្ន (TEMPORARY)' : 'ផលិតកម្ម (PRODUCTION)',
    'កាលបរិច្ឆេទបង្កើត (Created Date)': assessment.created_at ? new Date(assessment.created_at).toLocaleDateString('km-KH') : ''
  }));

  exportToExcel({
    data,
    filename: `assessments_verification_export_${new Date().toISOString().split('T')[0]}`,
    sheetName: 'ការវាយតម្លៃ',
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
    'Pilot School': student.pilot_schools?.name || '',
    'Added By': student.users_assessments_added_by_idTousers?.name || '',
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
 * Helper function to convert boolean values to Khmer text
 * Handles: true/false, "true"/"false", 1/0, null/undefined
 */
function booleanToKhmer(value: any): string {
  if (value === null || value === undefined) return '';
  if (value === true || value === 'true' || value === 1 || value === '1') return 'បាទ/ចាស';
  if (value === false || value === 'false' || value === 0 || value === '0') return 'ទេ';
  return '';
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
      visit.pilot_schools?.school_name || '',
      visit.pilot_schools?.school_code || '',
      visit.users?.name || '',
      'មិនបានបញ្ជាក់', // teacher info not in relation
      visit.score !== undefined ? visit.score : '',
      booleanToKhmer(visit.follow_up_required),
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
        ['សាលារៀន', visit.pilot_schools?.school_name || ''],
        ['លេខកូដសាលា', visit.pilot_schools?.school_code || ''],
        ['គ្រូព្រឹក្សា', visit.users?.name || ''],
        ['អ៊ីមែលគ្រូព្រឹក្សា', visit.users?.email || ''],
        ['គ្រូបង្រៀន', 'មិនបានបញ្ជាក់'],
        ['អ៊ីមែលគ្រូបង្រៀន', ''],
        ['តំបន់', visit.region || ''],
        ['ជួរ', visit.cluster || ''],
        ['ប្រភេទកម្មវិធី', visit.program_type || ''],
        ['ពិន្ទុ', visit.score !== undefined ? visit.score : ''],
        [''],
        ['ព័ត៌មានថ្នាក់រៀន (Class Information)', ''],
        ['ថ្នាក់រៀនកំពុងបង្រៀន', booleanToKhmer(visit.class_in_session)],
        ['មូលហេតុមិនបានបង្រៀន', visit.class_not_in_session_reason || ''],
        ['អង្កេតពេញមួយមេរៀន', booleanToKhmer(visit.full_session_observed)],
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
        ['ថ្នាក់រៀនចាប់ផ្តើមទាន់ពេល', booleanToKhmer(visit.class_started_on_time)],
        ['មូលហេតុចាប់ផ្តើមយឺត', visit.late_start_reason || ''],
        ['ឧបករណ៍បង្រៀន', parseStringArray(visit.teaching_materials).join(', ')],
        ['សិស្សបានដាក់ក្រុមតាមកម្រិត', booleanToKhmer(visit.students_grouped_by_level)],
        ['សិស្សចូលរួមយ៉ាងសកម្ម', booleanToKhmer(visit.students_active_participation)],
        [''],
        ['ការរៀបចំរបស់អ្នកបង្រៀន (Teacher Planning)', ''],
        ['មានផែនការបង្រៀន', booleanToKhmer(visit.teacher_has_lesson_plan)],
        ['មូលហេតុមិនមានផែនការ', visit.no_lesson_plan_reason || ''],
        ['បានធ្វើតាមផែនការ', booleanToKhmer(visit.followed_lesson_plan)],
        ['មូលហេតុមិនធ្វើតាម', visit.not_followed_reason || ''],
        ['ផែនការសមរម្យ', booleanToKhmer(visit.plan_appropriate_for_levels)],
        ['មតិយោបល់អំពីផែនការ', visit.lesson_plan_feedback || ''],
        [''],
        ['សកម្មភាព (Activities)', ''],
        ['ចំនួនសកម្មភាពអង្កេត', visit.number_of_activities || visit.num_activities_observed || 0],
      ];

      // Add Activity 1 details if exists (check for any activity1 field)
      const hasActivity1 = visit.activity1_name_language || visit.activity1_name_numeracy || visit.activity1_duration;
      if (hasActivity1) {
        const act1_clear_value = booleanToKhmer(visit.activity1_clear_instructions);
        const act1_followed_value = booleanToKhmer(visit.activity1_followed_process);

        console.log(`Visit ${visit.id} Activity 1:`, {
          clear_raw: visit.activity1_clear_instructions,
          clear_converted: act1_clear_value,
          followed_raw: visit.activity1_followed_process,
          followed_converted: act1_followed_value
        });

        visitData.push(
          [''],
          ['សកម្មភាពទី ១', ''],
          ['ឈ្មោះសកម្មភាព (ភាសា)', visit.activity1_name_language || ''],
          ['ឈ្មោះសកម្មភាព (គណិត)', visit.activity1_name_numeracy || ''],
          ['រយៈពេល (នាទី)', visit.activity1_duration || ''],
          ['ការណែនាំច្បាស់', act1_clear_value],
          ['មូលហេតុមិនច្បាស់', visit.activity1_unclear_reason || visit.activity1_no_clear_instructions_reason || ''],
          ['ធ្វើតាមដំណើរការ', act1_followed_value],
          ['មូលហេតុមិនធ្វើតាម', visit.activity1_not_followed_reason || '']
        );
      }

      // Add Activity 2 details if exists
      const hasActivity2 = visit.activity2_name_language || visit.activity2_name_numeracy || visit.activity2_duration;
      if (hasActivity2) {
        visitData.push(
          [''],
          ['សកម្មភាពទី ២', ''],
          ['ឈ្មោះសកម្មភាព (ភាសា)', visit.activity2_name_language || ''],
          ['ឈ្មោះសកម្មភាព (គណិត)', visit.activity2_name_numeracy || ''],
          ['រយៈពេល (នាទី)', visit.activity2_duration || ''],
          ['ការណែនាំច្បាស់', booleanToKhmer(visit.activity2_clear_instructions)],
          ['មូលហេតុមិនច្បាស់', visit.activity2_unclear_reason || visit.activity2_no_clear_instructions_reason || ''],
          ['ធ្វើតាមដំណើរការ', booleanToKhmer(visit.activity2_followed_process)],
          ['មូលហេតុមិនធ្វើតាម', visit.activity2_not_followed_reason || '']
        );
      }

      // Add Activity 3 details if exists (note: no followed_process field for activity3)
      const hasActivity3 = visit.activity3_name_language || visit.activity3_name_numeracy || visit.activity3_duration;
      if (hasActivity3) {
        visitData.push(
          [''],
          ['សកម្មភាពទី ៣', ''],
          ['ឈ្មោះសកម្មភាព (ភាសា)', visit.activity3_name_language || ''],
          ['ឈ្មោះសកម្មភាព (គណិត)', visit.activity3_name_numeracy || ''],
          ['រយៈពេល (នាទី)', visit.activity3_duration || ''],
          ['ការណែនាំច្បាស់', booleanToKhmer(visit.activity3_clear_instructions)],
          ['មូលហេតុមិនច្បាស់', visit.activity3_no_clear_instructions_reason || ''],
          ['បានបង្ហាញ', booleanToKhmer(visit.activity3_demonstrated)]
        );
      }

      // Add observations and feedback
      visitData.push(
        [''],
        ['សេចក្តីសម្គាល់ និងមតិយោបល់ (Observations & Feedback)', ''],
        ['សេចក្តីសម្គាល់', visit.observation || ''],
        ['មតិយោបល់ចំពោះអ្នកបង្រៀន', visit.teacher_feedback || ''],
        ['ផែនការសកម្មភាព', visit.action_plan || ''],
        ['ត្រូវការការតាមដាន', booleanToKhmer(visit.follow_up_required)],
        [''],
        ['ស្ថានភាព (Status)', ''],
        ['ជាប់សោ', booleanToKhmer(visit.is_locked)],
        ['បណ្តោះអាសន្ន', booleanToKhmer(visit.is_temporary)],
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
    'Pilot School': user.pilot_schools?.name || '',
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
        student.school_class?.school?.name || student.pilot_schools?.name || '',
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
        assessment.students?.name,
        assessment.assessment_type,
        assessment.subject,
        assessment.level,
        assessment.score,
        assessment.assessed_date ? new Date(assessment.assessed_date).toLocaleDateString() : '',
        assessment.users_assessments_added_by_idTousers?.name,
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
        user.pilot_schools?.name || ''
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
        visit.users?.name,
        visit.pilot_schools?.name,
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