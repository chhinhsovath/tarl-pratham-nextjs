-- Migration to update assessment types from English to correct Khmer terminology
-- This script updates existing data to use the correct Khmer terms:
-- baseline → ដើមគ្រា
-- midline → ពាក់កណ្តាលគ្រា  
-- endline → ចុងគ្រា

BEGIN;

-- Update assessments table
UPDATE assessments 
SET assessment_type = CASE 
    WHEN assessment_type = 'baseline' THEN 'ដើមគ្រា'
    WHEN assessment_type = 'midline' THEN 'ពាក់កណ្តាលគ្រា'
    WHEN assessment_type = 'endline' THEN 'ចុងគ្រា'
    ELSE assessment_type
END
WHERE assessment_type IN ('baseline', 'midline', 'endline');

-- Update student assessment eligibilities table if it exists
UPDATE student_assessment_eligibilities 
SET assessment_type = CASE 
    WHEN assessment_type = 'baseline' THEN 'ដើមគ្រា'
    WHEN assessment_type = 'midline' THEN 'ពាក់កណ្តាលគ្រា'
    WHEN assessment_type = 'endline' THEN 'ចុងគ្រា'
    ELSE assessment_type
END
WHERE assessment_type IN ('baseline', 'midline', 'endline');

-- Log the migration completion
INSERT INTO settings (key, value, type, description, created_at, updated_at)
VALUES (
    'assessment_types_khmer_migration',
    'completed',
    'string',
    'Migration completed: Updated assessment types from English to Khmer terminology',
    NOW(),
    NOW()
) ON CONFLICT (key) DO UPDATE SET 
    value = 'completed',
    updated_at = NOW();

COMMIT;