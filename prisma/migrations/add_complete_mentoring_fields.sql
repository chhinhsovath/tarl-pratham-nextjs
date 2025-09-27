-- Add complete mentoring visit fields to match Laravel system
-- This migration adds all 120+ fields for complete feature parity

-- Update mentoring_visits table with all Laravel fields
ALTER TABLE mentoring_visits 
ADD COLUMN IF NOT EXISTS teacher_id INTEGER,
ADD COLUMN IF NOT EXISTS school_id INTEGER,
ADD COLUMN IF NOT EXISTS observation TEXT,
ADD COLUMN IF NOT EXISTS score INTEGER,
ADD COLUMN IF NOT EXISTS photo VARCHAR(255),
ADD COLUMN IF NOT EXISTS questionnaire_data JSONB,
ADD COLUMN IF NOT EXISTS region VARCHAR(255),
ADD COLUMN IF NOT EXISTS province VARCHAR(255),
ADD COLUMN IF NOT EXISTS district VARCHAR(255),
ADD COLUMN IF NOT EXISTS commune VARCHAR(255),
ADD COLUMN IF NOT EXISTS village VARCHAR(255),
ADD COLUMN IF NOT EXISTS program_type VARCHAR(255) DEFAULT 'TaRL',
ADD COLUMN IF NOT EXISTS class_in_session BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS class_not_in_session_reason TEXT,
ADD COLUMN IF NOT EXISTS full_session_observed BOOLEAN,
ADD COLUMN IF NOT EXISTS grade_group VARCHAR(50),
ADD COLUMN IF NOT EXISTS grades_observed TEXT,
ADD COLUMN IF NOT EXISTS subject_observed VARCHAR(100),
ADD COLUMN IF NOT EXISTS language_levels_observed TEXT,
ADD COLUMN IF NOT EXISTS numeracy_levels_observed TEXT,
ADD COLUMN IF NOT EXISTS action_plan TEXT,
ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false,

-- Student data fields
ADD COLUMN IF NOT EXISTS total_students_enrolled INTEGER,
ADD COLUMN IF NOT EXISTS students_present INTEGER,
ADD COLUMN IF NOT EXISTS students_improved INTEGER,
ADD COLUMN IF NOT EXISTS classes_conducted_before INTEGER,
ADD COLUMN IF NOT EXISTS students_improved_from_last_week INTEGER,
ADD COLUMN IF NOT EXISTS classes_conducted_before_visit INTEGER,

-- Delivery questions
ADD COLUMN IF NOT EXISTS class_started_on_time BOOLEAN,
ADD COLUMN IF NOT EXISTS late_start_reason TEXT,

-- Classroom materials
ADD COLUMN IF NOT EXISTS teaching_materials TEXT,
ADD COLUMN IF NOT EXISTS materials_present TEXT,

-- Classroom organization
ADD COLUMN IF NOT EXISTS students_grouped_by_level BOOLEAN,
ADD COLUMN IF NOT EXISTS students_active_participation BOOLEAN,
ADD COLUMN IF NOT EXISTS children_grouped_appropriately BOOLEAN,
ADD COLUMN IF NOT EXISTS students_fully_involved BOOLEAN,

-- Teacher planning
ADD COLUMN IF NOT EXISTS teacher_has_lesson_plan BOOLEAN,
ADD COLUMN IF NOT EXISTS has_session_plan BOOLEAN,
ADD COLUMN IF NOT EXISTS no_lesson_plan_reason TEXT,
ADD COLUMN IF NOT EXISTS no_session_plan_reason TEXT,
ADD COLUMN IF NOT EXISTS followed_lesson_plan BOOLEAN,
ADD COLUMN IF NOT EXISTS followed_session_plan BOOLEAN,
ADD COLUMN IF NOT EXISTS not_followed_reason TEXT,
ADD COLUMN IF NOT EXISTS no_follow_plan_reason TEXT,
ADD COLUMN IF NOT EXISTS plan_appropriate_for_levels BOOLEAN,
ADD COLUMN IF NOT EXISTS session_plan_appropriate BOOLEAN,
ADD COLUMN IF NOT EXISTS lesson_plan_feedback TEXT,

-- Activity tracking
ADD COLUMN IF NOT EXISTS number_of_activities INTEGER,
ADD COLUMN IF NOT EXISTS num_activities_observed INTEGER,

-- Activity 1 fields
ADD COLUMN IF NOT EXISTS activity1_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity1_name_language VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity1_name_numeracy VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity1_duration INTEGER,
ADD COLUMN IF NOT EXISTS activity1_clear_instructions BOOLEAN,
ADD COLUMN IF NOT EXISTS activity1_unclear_reason TEXT,
ADD COLUMN IF NOT EXISTS activity1_no_clear_instructions_reason TEXT,
ADD COLUMN IF NOT EXISTS activity1_followed_process BOOLEAN,
ADD COLUMN IF NOT EXISTS activity1_not_followed_reason TEXT,
ADD COLUMN IF NOT EXISTS activity1_demonstrated BOOLEAN,
ADD COLUMN IF NOT EXISTS activity1_students_practice VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity1_small_groups VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity1_individual VARCHAR(50),

-- Activity 2 fields
ADD COLUMN IF NOT EXISTS activity2_type VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity2_name_language VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity2_name_numeracy VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity2_duration INTEGER,
ADD COLUMN IF NOT EXISTS activity2_clear_instructions BOOLEAN,
ADD COLUMN IF NOT EXISTS activity2_unclear_reason TEXT,
ADD COLUMN IF NOT EXISTS activity2_no_clear_instructions_reason TEXT,
ADD COLUMN IF NOT EXISTS activity2_followed_process BOOLEAN,
ADD COLUMN IF NOT EXISTS activity2_not_followed_reason TEXT,
ADD COLUMN IF NOT EXISTS activity2_demonstrated BOOLEAN,
ADD COLUMN IF NOT EXISTS activity2_students_practice VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity2_small_groups VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity2_individual VARCHAR(50),

-- Activity 3 fields
ADD COLUMN IF NOT EXISTS activity3_name_language VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity3_name_numeracy VARCHAR(255),
ADD COLUMN IF NOT EXISTS activity3_duration INTEGER,
ADD COLUMN IF NOT EXISTS activity3_clear_instructions BOOLEAN,
ADD COLUMN IF NOT EXISTS activity3_no_clear_instructions_reason TEXT,
ADD COLUMN IF NOT EXISTS activity3_demonstrated BOOLEAN,
ADD COLUMN IF NOT EXISTS activity3_students_practice VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity3_small_groups VARCHAR(50),
ADD COLUMN IF NOT EXISTS activity3_individual VARCHAR(50),

-- Overall feedback
ADD COLUMN IF NOT EXISTS teacher_feedback TEXT,
ADD COLUMN IF NOT EXISTS feedback_for_teacher TEXT,
ADD COLUMN IF NOT EXISTS activities_data JSONB,

-- Locking system
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS locked_by INTEGER,
ADD COLUMN IF NOT EXISTS locked_at TIMESTAMP;

-- Add foreign key constraints
ALTER TABLE mentoring_visits
ADD CONSTRAINT fk_teacher_id FOREIGN KEY (teacher_id) REFERENCES users(id),
ADD CONSTRAINT fk_school_id FOREIGN KEY (school_id) REFERENCES schools(id),
ADD CONSTRAINT fk_locked_by FOREIGN KEY (locked_by) REFERENCES users(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_mentoring_teacher_id ON mentoring_visits(teacher_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_school_id ON mentoring_visits(school_id);
CREATE INDEX IF NOT EXISTS idx_mentoring_class_in_session ON mentoring_visits(class_in_session);
CREATE INDEX IF NOT EXISTS idx_mentoring_subject_observed ON mentoring_visits(subject_observed);
CREATE INDEX IF NOT EXISTS idx_mentoring_is_locked ON mentoring_visits(is_locked);

-- Create coordinator workspace tables
CREATE TABLE IF NOT EXISTS bulk_imports (
    id SERIAL PRIMARY KEY,
    import_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    total_rows INTEGER,
    successful_rows INTEGER,
    failed_rows INTEGER,
    errors JSONB,
    imported_by INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assessment management tables
CREATE TABLE IF NOT EXISTS assessment_locks (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES assessments(id),
    locked_by INTEGER REFERENCES users(id),
    locked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT,
    UNIQUE(assessment_id)
);

-- Resources table for educational materials
CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    file_url VARCHAR(500),
    youtube_url VARCHAR(500),
    grade_levels TEXT,
    subjects TEXT,
    uploaded_by INTEGER REFERENCES users(id),
    is_public BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Settings table for system configuration
CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50),
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User school assignments for multiple school access
CREATE TABLE IF NOT EXISTS user_schools (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    school_id INTEGER REFERENCES schools(id),
    pilot_school_id INTEGER REFERENCES pilot_schools(id),
    assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER REFERENCES users(id),
    is_primary BOOLEAN DEFAULT false,
    UNIQUE(user_id, school_id),
    UNIQUE(user_id, pilot_school_id)
);

-- Report exports tracking
CREATE TABLE IF NOT EXISTS report_exports (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(100),
    filters JSONB,
    file_path VARCHAR(500),
    status VARCHAR(50) DEFAULT 'processing',
    exported_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Add indexes for new tables
CREATE INDEX IF NOT EXISTS idx_bulk_imports_type ON bulk_imports(import_type);
CREATE INDEX IF NOT EXISTS idx_bulk_imports_status ON bulk_imports(status);
CREATE INDEX IF NOT EXISTS idx_assessment_locks_assessment ON assessment_locks(assessment_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_public ON resources(is_public);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_user_schools_user ON user_schools(user_id);
CREATE INDEX IF NOT EXISTS idx_user_schools_school ON user_schools(school_id);
CREATE INDEX IF NOT EXISTS idx_report_exports_type ON report_exports(report_type);
CREATE INDEX IF NOT EXISTS idx_report_exports_status ON report_exports(status);