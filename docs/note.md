the most criticle part of this project is student assement, mentor assessment, and mentor observation. you have to conduct fully inspect every single layers of each pages, features and fuctions for each roles or you will miss alot of features and functions in laravel.



baseline តេស្តដើមគ្រា
mideline តេស្តពាក់កណ្ដាលគ្រា
endline តេស្តចុងក្រោយគ្រា


កម្រិត TaRL
ភាសាខ្មែរ:
កម្រិតដំបូង
តួអក្សរ
ពាក្យ
កថាខណ្ឌ
រឿង (យល់ន័យ១ យល់ន័យ២)

គណិតវិទ្យា
កម្រិតដំបូង
លេខ១ខ្ទង
លេខ២ខ្ទង
ប្រមាណវិធីដក                                                                                                  ប្រមាណវិធីចែក                                                                                                         
ចំណោទ


Loading student data...






if you check comprehensive table users in field email, username,role,school_id,subject,province
  that will be helpful to be smart to display student information which will be link with user
  profile information and the student. 



  Fixed gutter, no responsive array


  1. Should the new fields use snake_case (assessment_sample, student_consent) in the database? - Yes
  2. Do these fields need to be added to the assessments table in the database schema? - Yes
  3. Should these fields be required or optional? - Yes
  4. What should be the Khmer labels for these fields in the UI? assessment_sample=គម្រូតេស្ត, student_consent=យល់ព្រមចូលរួម

  > assessment_sample = លេខឧបករណ៍តេស្ត



  ឧបករណ៍តេស្ត លេខ១
  ឧបករណ៍តេស្ត លេខ២
  ឧបករណ៍តេស្ត លេខ៣



https://tarl.openplp.com/reports/student-performance
GET https://tarl.openplp.com/api/reports?type=student-performance 500 (Internal Server Error)
I @ page-a617974f8c9c9519.js?dpl=dpl_B6gz9KaHh4t3w3a6eg7vLc8wXmZ8:1
(anonymous) @ page-a617974f8c9c9519.js?dpl=dpl_B6gz9KaHh4t3w3a6eg7vLc8wXmZ8:1
layout-10581d63dd75547b.js?dpl=dpl_B6gz9KaHh4t3w3a6eg7vLc8wXmZ8:1 Failed to fetch performance data: SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
    at W (page-aa9ba2b7e9338b5a.js?dpl=dpl_B6gz9KaHh4t3w3a6eg7vLc8wXmZ8:1:2604)


  https://tarl.openplp.com/reports/progress-tracking
  page-a617974f8c9c951…3w3a6eg7vLc8wXmZ8:1 
 GET https://tarl.openplp.com/api/reports?type=student-performance 500 (Internal Server Error)
layout-10581d63dd755…3w3a6eg7vLc8wXmZ8:1 Failed to fetch progress data: SyntaxError: Failed to execute 'json' on 'Response': Unexpected end of JSON input
    at I (page-a617974f8c9c951…eg7vLc8wXmZ8:1:1387)
﻿


https://tarl.openplp.com/reports/attendance make sure we are showing real data not mock up. I live the way you design.