/**
 * Run this in your browser console at https://tarl.openplp.com/mentoring/create
 * while logged in as mentor1@prathaminternational.org
 */

const payload = {
  "visit_date": "2025-10-21",
  "mentor_name": "Mentor One",
  "pilot_school_id": 33,
  "teacher_id": 96,
  "class_in_session": 1,
  "full_session_observed": 1,
  "subject_observed": "Khmer",
  "total_students_enrolled": 2,
  "students_present": 12,
  "students_improved_from_last_week": 12,
  "classes_conducted_before_visit": 12,
  "class_started_on_time": 0,
  "materials_present": ["Chartលេខ ០-៩៩","បណ្ណតម្លៃលេខតាមខ្ទង់","ប្រាក់លេង","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា","Chartគុណលេខដោយផ្ទាល់មាត់","បណ្ណពាក្យ/បណ្ណព្យាង្គ","សៀវភៅគ្រូមុខវិជ្ជាភាសាខ្មែរ"],
  "children_grouped_appropriately": 1,
  "students_fully_involved": 1,
  "has_session_plan": 1,
  "number_of_activities": 2,
  "teacher_feedback": "tst",
  "language_levels_observed": ["កម្រិតដំបូង","តួអក្សរ","ពាក្យ","កថាខណ្ឌ"],
  "late_start_reason": "12",
  "followed_session_plan": 1,
  "session_plan_appropriate": 1,
  "session_plan_notes": "test",
  "activity1_name_language": "ការសន្ទនាសេរី",
  "activity1_duration": 12,
  "activity1_clear_instructions": 1,
  "activity1_followed_process": 1,
  "activity2_name_language": "ការពណ៌នារូបភាព",
  "activity2_duration": 12,
  "activity2_clear_instructions": 1,
  "activity2_followed_process": 1,
  "mentor_id": "7"
};

fetch('https://tarl.openplp.com/api/mentoring', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(payload),
  credentials: 'include' // This uses your existing browser session
})
.then(res => res.json())
.then(data => {
  console.log('✅ RESPONSE:', data);

  if (data.message && data.message.includes('successfully')) {
    console.log('🎉 SUCCESS! Visit created!');
  } else if (data.message && data.message.includes('session_plan_notes')) {
    console.log('❌ OLD CODE - session_plan_notes error still present');
  } else if (data.error) {
    console.log('⚠️  ERROR:', data.error);
    if (data.message) console.log('📝 MESSAGE:', data.message);
  }

  return data;
})
.catch(err => console.error('❌ FETCH ERROR:', err));
