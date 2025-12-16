-- Data Consistency Verification Queries
-- TaRL Pratham Database
-- Date: November 22, 2025
--
-- Purpose: Verify all mentor and teacher relationships are correctly linked to pilot_schools
-- Run these queries regularly to ensure data integrity

-- ========================================
-- 1. MENTOR → SCHOOLS RELATIONSHIP
-- ========================================

-- 1.1: Count mentors and their school assignments
SELECT
    '1.1 Mentor School Assignments' as check_name,
    COUNT(DISTINCT mentor_id) as total_mentors,
    COUNT(*) as total_assignments,
    COUNT(DISTINCT pilot_school_id) as unique_schools
FROM mentor_school_assignments
WHERE is_active = true;

-- 1.2: Mentors with multiple schools (expected behavior)
SELECT
    '1.2 Mentors with Multiple Schools' as check_name,
    mentor_id,
    u.name as mentor_name,
    COUNT(DISTINCT pilot_school_id) as school_count,
    string_agg(ps.school_name, ', ') as schools
FROM mentor_school_assignments msa
JOIN users u ON msa.mentor_id = u.id
JOIN pilot_schools ps ON msa.pilot_school_id = ps.id
WHERE msa.is_active = true
GROUP BY mentor_id, u.name
HAVING COUNT(DISTINCT pilot_school_id) > 1
ORDER BY school_count DESC;

-- 1.3: Mentors by subject coverage
SELECT
    '1.3 Mentor Subject Coverage' as check_name,
    subject,
    COUNT(DISTINCT mentor_id) as mentor_count,
    COUNT(DISTINCT pilot_school_id) as school_count
FROM mentor_school_assignments
WHERE is_active = true
GROUP BY subject;

-- 1.4: Check for mentors WITHOUT any school assignment
SELECT
    '1.4 Mentors Without School Assignment' as check_name,
    u.id,
    u.name,
    u.email,
    u.pilot_school_id as fallback_school_id
FROM users u
LEFT JOIN mentor_school_assignments msa ON u.id = msa.mentor_id AND msa.is_active = true
WHERE u.role = 'mentor'
  AND msa.mentor_id IS NULL;

-- ========================================
-- 2. TEACHER → SCHOOL RELATIONSHIP
-- ========================================

-- 2.1: Teachers with school assignments
SELECT
    '2.1 Teacher School Assignment' as check_name,
    COUNT(*) as total_teachers,
    COUNT(CASE WHEN pilot_school_id IS NOT NULL THEN 1 END) as with_school,
    COUNT(CASE WHEN pilot_school_id IS NULL THEN 1 END) as without_school
FROM users
WHERE role = 'teacher';

-- 2.2: Teachers WITHOUT school (should be 0 after migration)
SELECT
    '2.2 Teachers Missing School' as check_name,
    u.id,
    u.name,
    u.email,
    u.subject,
    u.holding_classes
FROM users u
WHERE u.role = 'teacher'
  AND u.pilot_school_id IS NULL;

-- 2.3: Teachers by school distribution
SELECT
    '2.3 Teachers per School' as check_name,
    ps.id as school_id,
    ps.school_name,
    COUNT(u.id) as teacher_count,
    string_agg(u.name, ', ') as teachers
FROM pilot_schools ps
LEFT JOIN users u ON ps.id = u.pilot_school_id AND u.role = 'teacher'
GROUP BY ps.id, ps.school_name
ORDER BY teacher_count DESC;

-- ========================================
-- 3. STUDENTS → TEACHER → SCHOOL CONSISTENCY
-- ========================================

-- 3.1: Student school matches teacher school
SELECT
    '3.1 Student-Teacher School Consistency' as check_name,
    COUNT(*) as total_students,
    COUNT(CASE
        WHEN s.pilot_school_id = u.pilot_school_id THEN 1
    END) as matching_school,
    COUNT(CASE
        WHEN s.pilot_school_id != u.pilot_school_id THEN 1
    END) as mismatched_school,
    COUNT(CASE
        WHEN s.pilot_school_id IS NULL OR u.pilot_school_id IS NULL THEN 1
    END) as missing_school
FROM students s
JOIN users u ON s.added_by_id = u.id;

-- 3.2: Students added by teachers from different schools (data issues)
SELECT
    '3.2 Cross-School Student Additions' as check_name,
    s.id as student_id,
    s.name as student_name,
    s.pilot_school_id as student_school,
    ps1.school_name as student_school_name,
    u.id as teacher_id,
    u.name as teacher_name,
    u.pilot_school_id as teacher_school,
    ps2.school_name as teacher_school_name
FROM students s
JOIN users u ON s.added_by_id = u.id
LEFT JOIN pilot_schools ps1 ON s.pilot_school_id = ps1.id
LEFT JOIN pilot_schools ps2 ON u.pilot_school_id = ps2.id
WHERE s.pilot_school_id != u.pilot_school_id
  AND u.role = 'teacher'
LIMIT 10;

-- 3.3: Students per school
SELECT
    '3.3 Students per School' as check_name,
    ps.id,
    ps.school_name,
    COUNT(s.id) as student_count
FROM pilot_schools ps
LEFT JOIN students s ON ps.id = s.pilot_school_id AND s.is_active = true
GROUP BY ps.id, ps.school_name
ORDER BY student_count DESC;

-- ========================================
-- 4. ASSESSMENTS → TEACHER → SCHOOL CONSISTENCY
-- ========================================

-- 4.1: Assessment school matches teacher school
SELECT
    '4.1 Assessment-Teacher School Consistency' as check_name,
    COUNT(*) as total_assessments,
    COUNT(CASE
        WHEN a.pilot_school_id = u.pilot_school_id THEN 1
    END) as matching_school,
    COUNT(CASE
        WHEN a.pilot_school_id != u.pilot_school_id THEN 1
    END) as mismatched_school,
    COUNT(CASE
        WHEN a.pilot_school_id IS NULL OR u.pilot_school_id IS NULL THEN 1
    END) as missing_school
FROM assessments a
JOIN users u ON a.added_by_id = u.id
WHERE a.created_by_role = 'teacher';

-- 4.2: Assessments by type and school
SELECT
    '4.2 Assessments by Type per School' as check_name,
    ps.school_name,
    a.assessment_type,
    COUNT(*) as count
FROM assessments a
JOIN pilot_schools ps ON a.pilot_school_id = ps.id
GROUP BY ps.school_name, a.assessment_type
ORDER BY ps.school_name, a.assessment_type;

-- ========================================
-- 5. MENTOR VERIFICATION SCOPE
-- ========================================

-- 5.1: Verify mentors can only see assessments from assigned schools
SELECT
    '5.1 Mentor Assessment Access Check' as check_name,
    u.id as mentor_id,
    u.name as mentor_name,
    COUNT(DISTINCT msa.pilot_school_id) as assigned_schools,
    COUNT(DISTINCT a.id) as accessible_assessments
FROM users u
JOIN mentor_school_assignments msa ON u.id = msa.mentor_id
LEFT JOIN assessments a ON a.pilot_school_id = msa.pilot_school_id
    AND a.created_by_role = 'teacher'
    AND msa.is_active = true
WHERE u.role = 'mentor'
GROUP BY u.id, u.name
ORDER BY accessible_assessments DESC;

-- 5.2: Check for assessments outside mentor scope (should be none)
SELECT
    '5.2 Out-of-Scope Assessments' as check_name,
    a.id as assessment_id,
    a.verified_by_id as mentor_id,
    u.name as mentor_name,
    a.pilot_school_id as assessment_school,
    ps.school_name
FROM assessments a
JOIN users u ON a.verified_by_id = u.id
LEFT JOIN pilot_schools ps ON a.pilot_school_id = ps.id
LEFT JOIN mentor_school_assignments msa
    ON u.id = msa.mentor_id
    AND a.pilot_school_id = msa.pilot_school_id
    AND msa.is_active = true
WHERE a.verified_by_id IS NOT NULL
  AND u.role = 'mentor'
  AND msa.mentor_id IS NULL
LIMIT 10;

-- 5.3: Mentor verification statistics
SELECT
    '5.3 Mentor Verification Stats' as check_name,
    u.name as mentor_name,
    COUNT(a.id) as verified_count,
    COUNT(DISTINCT a.pilot_school_id) as schools_verified,
    string_agg(DISTINCT ps.school_name, ', ') as schools
FROM users u
LEFT JOIN assessments a ON u.id = a.verified_by_id
LEFT JOIN pilot_schools ps ON a.pilot_school_id = ps.id
WHERE u.role = 'mentor'
GROUP BY u.id, u.name
ORDER BY verified_count DESC;

-- ========================================
-- 6. MENTORING VISITS → MENTOR → SCHOOL
-- ========================================

-- 6.1: Mentoring visit school alignment
SELECT
    '6.1 Mentoring Visit Alignment' as check_name,
    COUNT(*) as total_visits,
    COUNT(CASE
        WHEN EXISTS (
            SELECT 1 FROM mentor_school_assignments msa
            WHERE msa.mentor_id = mv.mentor_id
            AND msa.pilot_school_id = mv.pilot_school_id
            AND msa.is_active = true
        ) THEN 1
    END) as visits_to_assigned_schools,
    COUNT(CASE
        WHEN NOT EXISTS (
            SELECT 1 FROM mentor_school_assignments msa
            WHERE msa.mentor_id = mv.mentor_id
            AND msa.pilot_school_id = mv.pilot_school_id
            AND msa.is_active = true
        ) THEN 1
    END) as visits_outside_assignment
FROM mentoring_visits mv;

-- 6.2: Mentoring visits per mentor
SELECT
    '6.2 Mentoring Visits per Mentor' as check_name,
    u.name as mentor_name,
    COUNT(mv.id) as visit_count,
    COUNT(DISTINCT mv.pilot_school_id) as schools_visited,
    COUNT(DISTINCT mv.teacher_id) as teachers_observed
FROM users u
LEFT JOIN mentoring_visits mv ON u.id = mv.mentor_id
WHERE u.role = 'mentor'
GROUP BY u.id, u.name
ORDER BY visit_count DESC;

-- ========================================
-- 7. OVERALL DATA INTEGRITY SUMMARY
-- ========================================

SELECT
    '=== DATA INTEGRITY SUMMARY ===' as summary,
    NULL::text as detail,
    NULL::bigint as count
UNION ALL
SELECT
    'Total Mentors' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM users WHERE role = 'mentor'
UNION ALL
SELECT
    'Mentors with School Assignments' as summary,
    NULL as detail,
    COUNT(DISTINCT mentor_id)::bigint FROM mentor_school_assignments WHERE is_active = true
UNION ALL
SELECT
    'Total Teachers' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM users WHERE role = 'teacher'
UNION ALL
SELECT
    'Teachers with School' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM users WHERE role = 'teacher' AND pilot_school_id IS NOT NULL
UNION ALL
SELECT
    'Total Pilot Schools' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM pilot_schools
UNION ALL
SELECT
    'Total Students' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM students WHERE is_active = true
UNION ALL
SELECT
    'Students with School' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM students WHERE is_active = true AND pilot_school_id IS NOT NULL
UNION ALL
SELECT
    'Total Assessments' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM assessments
UNION ALL
SELECT
    'Assessments with School' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM assessments WHERE pilot_school_id IS NOT NULL
UNION ALL
SELECT
    'Verified Assessments' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM assessments WHERE verified_at IS NOT NULL
UNION ALL
SELECT
    'Total Mentoring Visits' as summary,
    NULL as detail,
    COUNT(*)::bigint FROM mentoring_visits;

-- ========================================
-- USAGE INSTRUCTIONS
-- ========================================
--
-- Run this entire file to check data consistency:
-- PGPASSWORD="P@ssw0rd" psql -h 157.10.73.52 -U admin -d tarl_pratham -f VERIFY_DATA_CONSISTENCY.sql
--
-- Or run specific sections:
-- \i VERIFY_DATA_CONSISTENCY.sql
--
-- Look for:
-- - "Teachers Missing School" should return 0 rows
-- - "Out-of-Scope Assessments" should return 0 rows
-- - School consistency checks should show high match rates
-- - All mentors should have active assignments
