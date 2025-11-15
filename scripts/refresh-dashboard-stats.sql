-- Refresh Dashboard Stats Cache
-- This script manually updates the dashboard_stats table with current data

-- Delete old cache
DELETE FROM dashboard_stats WHERE cache_key = 'global';

-- Insert fresh stats
INSERT INTO dashboard_stats (
  cache_key,
  role,
  total_schools,
  total_students,
  total_teachers,
  total_mentors,
  total_assessments,
  baseline_assessments,
  midline_assessments,
  endline_assessments,
  language_assessments,
  math_assessments,
  stats_data,
  last_updated
)
SELECT
  'global' as cache_key,
  'coordinator' as role,
  (SELECT COUNT(*) FROM pilot_schools) as total_schools,
  (SELECT COUNT(*) FROM students) as total_students,
  (SELECT COUNT(*) FROM users WHERE role = 'teacher') as total_teachers,
  (SELECT COUNT(*) FROM users WHERE role = 'mentor') as total_mentors,
  (SELECT COUNT(*) FROM assessments) as total_assessments,
  (SELECT COUNT(*) FROM assessments WHERE assessment_type = 'baseline') as baseline_assessments,
  (SELECT COUNT(*) FROM assessments WHERE assessment_type = 'midline') as midline_assessments,
  (SELECT COUNT(*) FROM assessments WHERE assessment_type = 'endline') as endline_assessments,
  (SELECT COUNT(*) FROM assessments WHERE subject = 'language') as language_assessments,
  (SELECT COUNT(*) FROM assessments WHERE subject = 'math') as math_assessments,
  '{}'::jsonb as stats_data,
  NOW() as last_updated;

-- Show result
SELECT
  'Dashboard stats refreshed!' as status,
  total_schools,
  total_students,
  total_assessments,
  last_updated
FROM dashboard_stats
WHERE cache_key = 'global';
