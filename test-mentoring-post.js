/**
 * Test script to POST mentoring data with authentication
 * Run with: node test-mentoring-post.js
 */

const https = require('https');

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

// Step 1: Get CSRF token
function getCSRF() {
  return new Promise((resolve, reject) => {
    const req = https.get('https://tarl.openplp.com/api/auth/csrf', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const cookies = res.headers['set-cookie'] || [];
          resolve({ csrfToken: json.csrfToken, cookies });
        } catch(e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
  });
}

// Step 2: Login
function login(csrfToken, cookies) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      email: 'mentor1@prathaminternational.org',
      password: 'admin123',
      csrfToken: csrfToken,
      callbackUrl: '/dashboard',
      json: 'true'
    }).toString();

    const options = {
      hostname: 'tarl.openplp.com',
      path: '/api/auth/callback/credentials',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'Cookie': cookies.join('; ')
      }
    };

    const req = https.request(options, (res) => {
      const allCookies = [...cookies, ...(res.headers['set-cookie'] || [])];
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Login response:', data);
        console.log('Login cookies:', allCookies);
        resolve(allCookies);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Step 3: POST mentoring data
function postMentoring(cookies) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);

    const options = {
      hostname: 'tarl.openplp.com',
      path: '/api/mentoring',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Cookie': cookies.join('; ')
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n🎯 RESPONSE STATUS:', res.statusCode);
        console.log('🎯 RESPONSE BODY:', data);
        try {
          const json = JSON.parse(data);
          console.log('\n✅ PARSED JSON:', JSON.stringify(json, null, 2));
        } catch(e) {
          console.log('\n❌ NOT JSON:', data);
        }
        resolve({ status: res.statusCode, body: data });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Run the test
async function test() {
  try {
    console.log('Step 1: Getting CSRF token...');
    const { csrfToken, cookies } = await getCSRF();
    console.log('✅ CSRF Token:', csrfToken);

    console.log('\nStep 2: Logging in...');
    const sessionCookies = await login(csrfToken, cookies);

    console.log('\nStep 3: Posting mentoring data...');
    const result = await postMentoring(sessionCookies);

    if (result.status === 201) {
      console.log('\n🎉 SUCCESS! Mentoring visit created!');
    } else if (result.status === 500 && result.body.includes('session_plan_notes')) {
      console.log('\n❌ OLD CODE STILL DEPLOYED - session_plan_notes error detected');
    } else {
      console.log('\n⚠️  Got status:', result.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
