--
-- PostgreSQL database dump
--

\restrict gATUe8EmnlElfoQmXuSqpKoxmi1rGu7l8VbLRiMSdfpepoRvhH4Mv7fe1oOomJe

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: RecordStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RecordStatus" AS ENUM (
    'production',
    'test_mentor',
    'test_teacher',
    'demo',
    'archived'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assessment_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_histories (
    id integer NOT NULL,
    assessment_id integer NOT NULL,
    field_name text NOT NULL,
    old_value text,
    new_value text,
    changed_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: assessment_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assessment_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assessment_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_histories_id_seq OWNED BY public.assessment_histories.id;


--
-- Name: assessment_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessment_locks (
    id integer NOT NULL,
    assessment_id integer NOT NULL,
    locked_by integer,
    locked_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text
);


--
-- Name: assessment_locks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assessment_locks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assessment_locks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_locks_id_seq OWNED BY public.assessment_locks.id;


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assessments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    pilot_school_id integer,
    assessment_type text NOT NULL,
    subject text NOT NULL,
    level text,
    notes text,
    assessed_date timestamp(3) without time zone,
    added_by_id integer,
    is_temporary boolean DEFAULT false NOT NULL,
    assessed_by_mentor boolean DEFAULT false NOT NULL,
    mentor_assessment_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by_role text,
    record_status public."RecordStatus" DEFAULT 'production'::public."RecordStatus" NOT NULL,
    test_session_id text,
    assessment_sample text,
    student_consent text,
    verified_by_id integer,
    verified_at timestamp(3) without time zone,
    verification_notes text,
    is_locked boolean DEFAULT false NOT NULL,
    locked_by_id integer,
    locked_at timestamp(3) without time zone
);


--
-- Name: assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessments_id_seq OWNED BY public.assessments.id;


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    student_id integer NOT NULL,
    teacher_id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    status text NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    user_role text,
    user_email text,
    action text NOT NULL,
    resource_type text NOT NULL,
    resource_id integer,
    resource_name text,
    old_values jsonb,
    new_values jsonb,
    changed_fields jsonb,
    ip_address text,
    user_agent text,
    session_id text,
    status text NOT NULL,
    error_message text,
    metadata jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bulk_imports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bulk_imports (
    id integer NOT NULL,
    import_type text NOT NULL,
    file_name text,
    file_path text,
    total_rows integer,
    successful_rows integer,
    failed_rows integer,
    errors jsonb,
    imported_by integer,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: bulk_imports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bulk_imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bulk_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bulk_imports_id_seq OWNED BY public.bulk_imports.id;


--
-- Name: clusters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clusters (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: clusters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.clusters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;


--
-- Name: dashboard_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboard_stats (
    id integer NOT NULL,
    cache_key text NOT NULL,
    role text NOT NULL,
    user_id integer,
    total_schools integer DEFAULT 0 NOT NULL,
    total_students integer DEFAULT 0 NOT NULL,
    total_teachers integer DEFAULT 0 NOT NULL,
    total_mentors integer DEFAULT 0 NOT NULL,
    total_assessments integer DEFAULT 0 NOT NULL,
    baseline_assessments integer DEFAULT 0 NOT NULL,
    midline_assessments integer DEFAULT 0 NOT NULL,
    endline_assessments integer DEFAULT 0 NOT NULL,
    language_assessments integer DEFAULT 0 NOT NULL,
    math_assessments integer DEFAULT 0 NOT NULL,
    stats_data jsonb,
    last_updated timestamp(3) without time zone NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: dashboard_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboard_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboard_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_stats_id_seq OWNED BY public.dashboard_stats.id;


--
-- Name: intervention_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.intervention_programs (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    target_group text,
    expected_outcomes text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: intervention_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.intervention_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: intervention_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intervention_programs_id_seq OWNED BY public.intervention_programs.id;


--
-- Name: ip_whitelist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ip_whitelist (
    id integer NOT NULL,
    ip_address text NOT NULL,
    description text,
    allowed_roles jsonb,
    is_active boolean DEFAULT true NOT NULL,
    added_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: ip_whitelist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ip_whitelist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ip_whitelist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ip_whitelist_id_seq OWNED BY public.ip_whitelist.id;


--
-- Name: mentor_school_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mentor_school_assignments (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    pilot_school_id integer NOT NULL,
    subject text NOT NULL,
    assigned_by_id integer,
    assigned_date timestamp(3) without time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mentor_school_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentor_school_assignments_id_seq OWNED BY public.mentor_school_assignments.id;


--
-- Name: mentoring_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mentoring_visits (
    id integer NOT NULL,
    mentor_id integer NOT NULL,
    pilot_school_id integer,
    visit_date timestamp(3) without time zone NOT NULL,
    level text,
    purpose text,
    activities text,
    observations text,
    recommendations text,
    follow_up_actions text,
    photos jsonb,
    participants_count integer,
    duration_minutes integer,
    status text DEFAULT 'scheduled'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    action_plan text,
    activities_data jsonb,
    activity1_clear_instructions boolean,
    activity1_demonstrated boolean,
    activity1_duration integer,
    activity1_followed_process boolean,
    activity1_individual text,
    activity1_name_language text,
    activity1_name_numeracy text,
    activity1_no_clear_instructions_reason text,
    activity1_not_followed_reason text,
    activity1_small_groups text,
    activity1_students_practice text,
    activity1_type text,
    activity1_unclear_reason text,
    activity2_clear_instructions boolean,
    activity2_demonstrated boolean,
    activity2_duration integer,
    activity2_followed_process boolean,
    activity2_individual text,
    activity2_name_language text,
    activity2_name_numeracy text,
    activity2_no_clear_instructions_reason text,
    activity2_not_followed_reason text,
    activity2_small_groups text,
    activity2_students_practice text,
    activity2_type text,
    activity2_unclear_reason text,
    activity3_clear_instructions boolean,
    activity3_demonstrated boolean,
    activity3_duration integer,
    activity3_individual text,
    activity3_name_language text,
    activity3_name_numeracy text,
    activity3_no_clear_instructions_reason text,
    activity3_small_groups text,
    activity3_students_practice text,
    children_grouped_appropriately boolean,
    class_in_session boolean DEFAULT true NOT NULL,
    class_not_in_session_reason text,
    class_started_on_time boolean,
    classes_conducted_before integer,
    classes_conducted_before_visit integer,
    commune text,
    district text,
    feedback_for_teacher text,
    follow_up_required boolean DEFAULT false NOT NULL,
    followed_lesson_plan boolean,
    followed_session_plan boolean,
    full_session_observed boolean,
    grade_group text,
    grades_observed text,
    has_session_plan boolean,
    is_locked boolean DEFAULT false NOT NULL,
    language_levels_observed text,
    late_start_reason text,
    lesson_plan_feedback text,
    locked_at timestamp(3) without time zone,
    locked_by integer,
    materials_present text,
    no_follow_plan_reason text,
    no_lesson_plan_reason text,
    no_session_plan_reason text,
    not_followed_reason text,
    num_activities_observed integer,
    number_of_activities integer,
    numeracy_levels_observed text,
    observation text,
    photo text,
    plan_appropriate_for_levels boolean,
    program_type text DEFAULT 'TaRL'::text,
    province text,
    questionnaire_data jsonb,
    region text,
    school_id integer,
    score integer,
    session_plan_appropriate boolean,
    students_active_participation boolean,
    students_fully_involved boolean,
    students_grouped_by_level boolean,
    students_improved integer,
    students_improved_from_last_week integer,
    students_present integer,
    subject_observed text,
    teacher_feedback text,
    teacher_has_lesson_plan boolean,
    teacher_id integer,
    teaching_materials text,
    total_students_enrolled integer,
    village text,
    created_by_role text,
    is_temporary boolean DEFAULT false NOT NULL,
    record_status public."RecordStatus" DEFAULT 'production'::public."RecordStatus" NOT NULL,
    test_session_id text
);


--
-- Name: mentoring_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.mentoring_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: mentoring_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentoring_visits_id_seq OWNED BY public.mentoring_visits.id;


--
-- Name: pilot_schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pilot_schools (
    id integer NOT NULL,
    province text NOT NULL,
    district text NOT NULL,
    cluster_id integer,
    cluster text NOT NULL,
    school_name text NOT NULL,
    school_code text NOT NULL,
    baseline_start_date timestamp(3) without time zone,
    baseline_end_date timestamp(3) without time zone,
    midline_start_date timestamp(3) without time zone,
    midline_end_date timestamp(3) without time zone,
    endline_start_date timestamp(3) without time zone,
    endline_end_date timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    is_locked boolean DEFAULT false NOT NULL
);


--
-- Name: pilot_schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pilot_schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pilot_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pilot_schools_id_seq OWNED BY public.pilot_schools.id;


--
-- Name: progress_trackings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.progress_trackings (
    id integer NOT NULL,
    student_id integer NOT NULL,
    tracking_date timestamp(3) without time zone NOT NULL,
    khmer_progress text,
    math_progress text,
    attendance_rate double precision,
    behavior_notes text,
    teacher_comments text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: progress_trackings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.progress_trackings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: progress_trackings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_trackings_id_seq OWNED BY public.progress_trackings.id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name_english text NOT NULL,
    name_khmer text,
    code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- Name: quick_login_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quick_login_users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'teacher'::text NOT NULL,
    province text,
    subject text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    district text,
    holding_classes text,
    pilot_school_id integer,
    onboarding_completed jsonb,
    onboarding_completed_at timestamp(3) without time zone,
    show_onboarding boolean DEFAULT true NOT NULL
);


--
-- Name: quick_login_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.quick_login_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: quick_login_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quick_login_users_id_seq OWNED BY public.quick_login_users.id;


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limits (
    id integer NOT NULL,
    identifier text NOT NULL,
    endpoint text NOT NULL,
    requests_count integer DEFAULT 1 NOT NULL,
    window_start timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    blocked_until timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rate_limits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- Name: report_exports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_exports (
    id integer NOT NULL,
    report_type text NOT NULL,
    filters jsonb,
    file_path text,
    status text DEFAULT 'processing'::text NOT NULL,
    exported_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp(3) without time zone
);


--
-- Name: report_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.report_exports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: report_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.report_exports_id_seq OWNED BY public.report_exports.id;


--
-- Name: resource_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resource_views (
    id integer NOT NULL,
    resource_id integer NOT NULL,
    user_id integer,
    ip_address text,
    user_agent text,
    viewed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: resource_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resource_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resource_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_views_id_seq OWNED BY public.resource_views.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    title text NOT NULL,
    description text,
    type text,
    file_url text,
    youtube_url text,
    grade_levels text,
    subjects text,
    uploaded_by integer,
    is_public boolean DEFAULT false NOT NULL,
    views_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: school_classes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_classes (
    id integer NOT NULL,
    school_id integer NOT NULL,
    name text NOT NULL,
    grade integer NOT NULL,
    teacher_name text,
    student_count integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: school_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.school_classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: school_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_classes_id_seq OWNED BY public.school_classes.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schools (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    province_id integer NOT NULL,
    district text,
    commune text,
    village text,
    school_type text,
    level text,
    total_students integer,
    total_teachers integer,
    latitude double precision,
    longitude double precision,
    phone text,
    email text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    key text NOT NULL,
    value text,
    type text,
    description text,
    updated_by integer,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: student_assessment_eligibilities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_assessment_eligibilities (
    id integer NOT NULL,
    student_id integer NOT NULL,
    assessment_type text NOT NULL,
    is_eligible boolean DEFAULT true NOT NULL,
    reason text,
    eligible_from timestamp(3) without time zone,
    eligible_until timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_assessment_eligibilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_assessment_eligibilities_id_seq OWNED BY public.student_assessment_eligibilities.id;


--
-- Name: student_interventions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.student_interventions (
    id integer NOT NULL,
    student_id integer NOT NULL,
    intervention_program_id integer NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone,
    status text DEFAULT 'active'::text NOT NULL,
    progress_notes text,
    outcome text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: student_interventions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.student_interventions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: student_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_interventions_id_seq OWNED BY public.student_interventions.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.students (
    id integer NOT NULL,
    school_class_id integer,
    pilot_school_id integer,
    name text NOT NULL,
    age integer,
    gender text,
    guardian_name text,
    guardian_phone text,
    address text,
    photo text,
    baseline_assessment text,
    midline_assessment text,
    endline_assessment text,
    baseline_khmer_level text,
    baseline_math_level text,
    midline_khmer_level text,
    midline_math_level text,
    endline_khmer_level text,
    endline_math_level text,
    is_active boolean DEFAULT true NOT NULL,
    is_temporary boolean DEFAULT false NOT NULL,
    added_by_id integer,
    added_by_mentor boolean DEFAULT false NOT NULL,
    assessed_by_mentor boolean DEFAULT false NOT NULL,
    mentor_created_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    created_by_role text,
    record_status public."RecordStatus" DEFAULT 'production'::public."RecordStatus" NOT NULL,
    test_session_id text,
    student_id text,
    grade integer
);


--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: teacher_school_assignments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teacher_school_assignments (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    pilot_school_id integer NOT NULL,
    subject text NOT NULL,
    assigned_by_id integer,
    assigned_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teacher_school_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teacher_school_assignments_id_seq OWNED BY public.teacher_school_assignments.id;


--
-- Name: teaching_activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teaching_activities (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    activity_date timestamp(3) without time zone NOT NULL,
    subject text NOT NULL,
    topic text NOT NULL,
    duration integer,
    materials_used text,
    student_count integer,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: teaching_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teaching_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teaching_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teaching_activities_id_seq OWNED BY public.teaching_activities.id;


--
-- Name: test_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_sessions (
    id text NOT NULL,
    user_id integer NOT NULL,
    user_role text NOT NULL,
    started_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone,
    status text DEFAULT 'active'::text NOT NULL,
    student_count integer DEFAULT 0 NOT NULL,
    assessment_count integer DEFAULT 0 NOT NULL,
    mentoring_visit_count integer DEFAULT 0 NOT NULL,
    notes text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


--
-- Name: user_schools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_schools (
    id integer NOT NULL,
    user_id integer NOT NULL,
    school_id integer,
    pilot_school_id integer,
    assigned_date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assigned_by integer,
    is_primary boolean DEFAULT false NOT NULL
);


--
-- Name: user_schools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_schools_id_seq OWNED BY public.user_schools.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    id text NOT NULL,
    user_id integer NOT NULL,
    user_role text NOT NULL,
    ip_address text,
    user_agent text,
    device_info jsonb,
    started_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    terminated_at timestamp(3) without time zone,
    termination_reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    username text,
    profile_photo text,
    sex text,
    phone text,
    holding_classes text,
    assigned_subject text,
    role text DEFAULT 'teacher'::text NOT NULL,
    email_verified_at timestamp(3) without time zone,
    password text NOT NULL,
    remember_token text,
    onboarding_completed jsonb,
    onboarding_completed_at timestamp(3) without time zone,
    show_onboarding boolean DEFAULT true NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    profile_expires_at timestamp(3) without time zone,
    original_school_id integer,
    original_subject text,
    original_classes text,
    school_id integer,
    subject text,
    pilot_school_id integer,
    province text,
    district text,
    commune text,
    village text,
    is_active boolean DEFAULT true NOT NULL,
    test_mode_enabled boolean DEFAULT false NOT NULL,
    login_type character varying(20) DEFAULT 'email'::character varying,
    username_login character varying(255),
    migrated_from_quick_login boolean DEFAULT false,
    migration_date timestamp without time zone,
    onboarding_activities jsonb
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assessment_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories ALTER COLUMN id SET DEFAULT nextval('public.assessment_histories_id_seq'::regclass);


--
-- Name: assessment_locks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks ALTER COLUMN id SET DEFAULT nextval('public.assessment_locks_id_seq'::regclass);


--
-- Name: assessments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments ALTER COLUMN id SET DEFAULT nextval('public.assessments_id_seq'::regclass);


--
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bulk_imports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports ALTER COLUMN id SET DEFAULT nextval('public.bulk_imports_id_seq'::regclass);


--
-- Name: clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);


--
-- Name: dashboard_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats ALTER COLUMN id SET DEFAULT nextval('public.dashboard_stats_id_seq'::regclass);


--
-- Name: intervention_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs ALTER COLUMN id SET DEFAULT nextval('public.intervention_programs_id_seq'::regclass);


--
-- Name: ip_whitelist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist ALTER COLUMN id SET DEFAULT nextval('public.ip_whitelist_id_seq'::regclass);


--
-- Name: mentor_school_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.mentor_school_assignments_id_seq'::regclass);


--
-- Name: mentoring_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits ALTER COLUMN id SET DEFAULT nextval('public.mentoring_visits_id_seq'::regclass);


--
-- Name: pilot_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools ALTER COLUMN id SET DEFAULT nextval('public.pilot_schools_id_seq'::regclass);


--
-- Name: progress_trackings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings ALTER COLUMN id SET DEFAULT nextval('public.progress_trackings_id_seq'::regclass);


--
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- Name: quick_login_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users ALTER COLUMN id SET DEFAULT nextval('public.quick_login_users_id_seq'::regclass);


--
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- Name: report_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports ALTER COLUMN id SET DEFAULT nextval('public.report_exports_id_seq'::regclass);


--
-- Name: resource_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views ALTER COLUMN id SET DEFAULT nextval('public.resource_views_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: school_classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes ALTER COLUMN id SET DEFAULT nextval('public.school_classes_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: student_assessment_eligibilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities ALTER COLUMN id SET DEFAULT nextval('public.student_assessment_eligibilities_id_seq'::regclass);


--
-- Name: student_interventions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions ALTER COLUMN id SET DEFAULT nextval('public.student_interventions_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: teacher_school_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.teacher_school_assignments_id_seq'::regclass);


--
-- Name: teaching_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities ALTER COLUMN id SET DEFAULT nextval('public.teaching_activities_id_seq'::regclass);


--
-- Name: user_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools ALTER COLUMN id SET DEFAULT nextval('public.user_schools_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: assessment_histories assessment_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_pkey PRIMARY KEY (id);


--
-- Name: assessment_locks assessment_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bulk_imports bulk_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports
    ADD CONSTRAINT bulk_imports_pkey PRIMARY KEY (id);


--
-- Name: clusters clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- Name: dashboard_stats dashboard_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats
    ADD CONSTRAINT dashboard_stats_pkey PRIMARY KEY (id);


--
-- Name: intervention_programs intervention_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs
    ADD CONSTRAINT intervention_programs_pkey PRIMARY KEY (id);


--
-- Name: ip_whitelist ip_whitelist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist
    ADD CONSTRAINT ip_whitelist_pkey PRIMARY KEY (id);


--
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_pilot_school_id_subject_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_pilot_school_id_subject_key UNIQUE (mentor_id, pilot_school_id, subject);


--
-- Name: mentor_school_assignments mentor_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pkey PRIMARY KEY (id);


--
-- Name: mentoring_visits mentoring_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pkey PRIMARY KEY (id);


--
-- Name: pilot_schools pilot_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools
    ADD CONSTRAINT pilot_schools_pkey PRIMARY KEY (id);


--
-- Name: progress_trackings progress_trackings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings
    ADD CONSTRAINT progress_trackings_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: quick_login_users quick_login_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users
    ADD CONSTRAINT quick_login_users_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: report_exports report_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_pkey PRIMARY KEY (id);


--
-- Name: resource_views resource_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views
    ADD CONSTRAINT resource_views_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: school_classes school_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: student_assessment_eligibilities student_assessment_eligibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_pkey PRIMARY KEY (id);


--
-- Name: student_interventions student_interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: teacher_school_assignments teacher_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pkey PRIMARY KEY (id);


--
-- Name: teaching_activities teaching_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_pkey PRIMARY KEY (id);


--
-- Name: test_sessions test_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_sessions
    ADD CONSTRAINT test_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_schools user_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools
    ADD CONSTRAINT user_schools_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_login_key UNIQUE (username_login);


--
-- Name: assessment_histories_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_histories_assessment_id_idx ON public.assessment_histories USING btree (assessment_id);


--
-- Name: assessment_locks_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_locks_assessment_id_idx ON public.assessment_locks USING btree (assessment_id);


--
-- Name: assessment_locks_assessment_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_locks_assessment_id_key ON public.assessment_locks USING btree (assessment_id);


--
-- Name: assessments_assessed_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_by_mentor_idx ON public.assessments USING btree (assessed_by_mentor);


--
-- Name: assessments_assessed_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_date_idx ON public.assessments USING btree (assessed_date);


--
-- Name: assessments_assessment_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessment_type_idx ON public.assessments USING btree (assessment_type);


--
-- Name: assessments_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_locked_idx ON public.assessments USING btree (is_locked);


--
-- Name: assessments_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_temporary_idx ON public.assessments USING btree (is_temporary);


--
-- Name: assessments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_pilot_school_id_idx ON public.assessments USING btree (pilot_school_id);


--
-- Name: assessments_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_record_status_idx ON public.assessments USING btree (record_status);


--
-- Name: assessments_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_student_id_idx ON public.assessments USING btree (student_id);


--
-- Name: assessments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_subject_idx ON public.assessments USING btree (subject);


--
-- Name: assessments_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_test_session_id_idx ON public.assessments USING btree (test_session_id);


--
-- Name: assessments_verified_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_verified_by_id_idx ON public.assessments USING btree (verified_by_id);


--
-- Name: attendance_records_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_date_idx ON public.attendance_records USING btree (date);


--
-- Name: attendance_records_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_student_id_idx ON public.attendance_records USING btree (student_id);


--
-- Name: attendance_records_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_teacher_id_idx ON public.attendance_records USING btree (teacher_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_id_idx ON public.audit_logs USING btree (resource_id);


--
-- Name: audit_logs_resource_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_type_idx ON public.audit_logs USING btree (resource_type);


--
-- Name: audit_logs_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_status_idx ON public.audit_logs USING btree (status);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: audit_logs_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_role_idx ON public.audit_logs USING btree (user_role);


--
-- Name: bulk_imports_import_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_import_type_idx ON public.bulk_imports USING btree (import_type);


--
-- Name: bulk_imports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_status_idx ON public.bulk_imports USING btree (status);


--
-- Name: clusters_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX clusters_code_key ON public.clusters USING btree (code);


--
-- Name: dashboard_stats_cache_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_cache_key_idx ON public.dashboard_stats USING btree (cache_key);


--
-- Name: dashboard_stats_cache_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboard_stats_cache_key_key ON public.dashboard_stats USING btree (cache_key);


--
-- Name: dashboard_stats_last_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_last_updated_idx ON public.dashboard_stats USING btree (last_updated);


--
-- Name: dashboard_stats_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_role_idx ON public.dashboard_stats USING btree (role);


--
-- Name: dashboard_stats_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_user_id_idx ON public.dashboard_stats USING btree (user_id);


--
-- Name: ip_whitelist_ip_address_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_ip_address_idx ON public.ip_whitelist USING btree (ip_address);


--
-- Name: ip_whitelist_ip_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ip_whitelist_ip_address_key ON public.ip_whitelist USING btree (ip_address);


--
-- Name: ip_whitelist_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_is_active_idx ON public.ip_whitelist USING btree (is_active);


--
-- Name: mentor_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_is_active_idx ON public.mentor_school_assignments USING btree (is_active);


--
-- Name: mentor_school_assignments_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_mentor_id_idx ON public.mentor_school_assignments USING btree (mentor_id);


--
-- Name: mentor_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_pilot_school_id_idx ON public.mentor_school_assignments USING btree (pilot_school_id);


--
-- Name: mentor_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_subject_idx ON public.mentor_school_assignments USING btree (subject);


--
-- Name: mentoring_visits_class_in_session_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_class_in_session_idx ON public.mentoring_visits USING btree (class_in_session);


--
-- Name: mentoring_visits_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_is_locked_idx ON public.mentoring_visits USING btree (is_locked);


--
-- Name: mentoring_visits_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_mentor_id_idx ON public.mentoring_visits USING btree (mentor_id);


--
-- Name: mentoring_visits_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_pilot_school_id_idx ON public.mentoring_visits USING btree (pilot_school_id);


--
-- Name: mentoring_visits_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_record_status_idx ON public.mentoring_visits USING btree (record_status);


--
-- Name: mentoring_visits_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_school_id_idx ON public.mentoring_visits USING btree (school_id);


--
-- Name: mentoring_visits_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_status_idx ON public.mentoring_visits USING btree (status);


--
-- Name: mentoring_visits_subject_observed_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_subject_observed_idx ON public.mentoring_visits USING btree (subject_observed);


--
-- Name: mentoring_visits_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_teacher_id_idx ON public.mentoring_visits USING btree (teacher_id);


--
-- Name: mentoring_visits_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_test_session_id_idx ON public.mentoring_visits USING btree (test_session_id);


--
-- Name: mentoring_visits_visit_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_visit_date_idx ON public.mentoring_visits USING btree (visit_date);


--
-- Name: pilot_schools_baseline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_baseline_start_date_idx ON public.pilot_schools USING btree (baseline_start_date);


--
-- Name: pilot_schools_cluster_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_cluster_idx ON public.pilot_schools USING btree (cluster);


--
-- Name: pilot_schools_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_district_idx ON public.pilot_schools USING btree (district);


--
-- Name: pilot_schools_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_is_locked_idx ON public.pilot_schools USING btree (is_locked);


--
-- Name: pilot_schools_midline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_midline_start_date_idx ON public.pilot_schools USING btree (midline_start_date);


--
-- Name: pilot_schools_province_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_province_idx ON public.pilot_schools USING btree (province);


--
-- Name: pilot_schools_school_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_school_code_idx ON public.pilot_schools USING btree (school_code);


--
-- Name: pilot_schools_school_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pilot_schools_school_code_key ON public.pilot_schools USING btree (school_code);


--
-- Name: progress_trackings_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_student_id_idx ON public.progress_trackings USING btree (student_id);


--
-- Name: progress_trackings_tracking_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_tracking_date_idx ON public.progress_trackings USING btree (tracking_date);


--
-- Name: provinces_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX provinces_code_key ON public.provinces USING btree (code);


--
-- Name: quick_login_users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quick_login_users_username_idx ON public.quick_login_users USING btree (username);


--
-- Name: quick_login_users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quick_login_users_username_key ON public.quick_login_users USING btree (username);


--
-- Name: rate_limits_blocked_until_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_blocked_until_idx ON public.rate_limits USING btree (blocked_until);


--
-- Name: rate_limits_endpoint_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_endpoint_idx ON public.rate_limits USING btree (endpoint);


--
-- Name: rate_limits_identifier_endpoint_window_start_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rate_limits_identifier_endpoint_window_start_key ON public.rate_limits USING btree (identifier, endpoint, window_start);


--
-- Name: rate_limits_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_identifier_idx ON public.rate_limits USING btree (identifier);


--
-- Name: rate_limits_window_start_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_window_start_idx ON public.rate_limits USING btree (window_start);


--
-- Name: report_exports_report_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_report_type_idx ON public.report_exports USING btree (report_type);


--
-- Name: report_exports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_status_idx ON public.report_exports USING btree (status);


--
-- Name: resource_views_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_resource_id_idx ON public.resource_views USING btree (resource_id);


--
-- Name: resource_views_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_user_id_idx ON public.resource_views USING btree (user_id);


--
-- Name: resources_is_public_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_is_public_idx ON public.resources USING btree (is_public);


--
-- Name: resources_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_type_idx ON public.resources USING btree (type);


--
-- Name: school_classes_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX school_classes_school_id_idx ON public.school_classes USING btree (school_id);


--
-- Name: schools_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_code_idx ON public.schools USING btree (code);


--
-- Name: schools_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schools_code_key ON public.schools USING btree (code);


--
-- Name: schools_province_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_province_id_idx ON public.schools USING btree (province_id);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: student_assessment_eligibilities_student_id_assessment_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_assessment_eligibilities_student_id_assessment_type_key ON public.student_assessment_eligibilities USING btree (student_id, assessment_type);


--
-- Name: student_assessment_eligibilities_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_assessment_eligibilities_student_id_idx ON public.student_assessment_eligibilities USING btree (student_id);


--
-- Name: student_interventions_intervention_program_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_intervention_program_id_idx ON public.student_interventions USING btree (intervention_program_id);


--
-- Name: student_interventions_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_student_id_idx ON public.student_interventions USING btree (student_id);


--
-- Name: students_added_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_id_idx ON public.students USING btree (added_by_id);


--
-- Name: students_added_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_mentor_idx ON public.students USING btree (added_by_mentor);


--
-- Name: students_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_is_temporary_idx ON public.students USING btree (is_temporary);


--
-- Name: students_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_pilot_school_id_idx ON public.students USING btree (pilot_school_id);


--
-- Name: students_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_record_status_idx ON public.students USING btree (record_status);


--
-- Name: students_school_class_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_school_class_id_idx ON public.students USING btree (school_class_id);


--
-- Name: students_student_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);


--
-- Name: students_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_test_session_id_idx ON public.students USING btree (test_session_id);


--
-- Name: teacher_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_is_active_idx ON public.teacher_school_assignments USING btree (is_active);


--
-- Name: teacher_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_pilot_school_id_idx ON public.teacher_school_assignments USING btree (pilot_school_id);


--
-- Name: teacher_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_subject_idx ON public.teacher_school_assignments USING btree (subject);


--
-- Name: teacher_school_assignments_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_teacher_id_idx ON public.teacher_school_assignments USING btree (teacher_id);


--
-- Name: teacher_school_assignments_teacher_id_pilot_school_id_subje_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teacher_school_assignments_teacher_id_pilot_school_id_subje_key ON public.teacher_school_assignments USING btree (teacher_id, pilot_school_id, subject);


--
-- Name: teaching_activities_activity_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_activity_date_idx ON public.teaching_activities USING btree (activity_date);


--
-- Name: teaching_activities_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_teacher_id_idx ON public.teaching_activities USING btree (teacher_id);


--
-- Name: test_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_expires_at_idx ON public.test_sessions USING btree (expires_at);


--
-- Name: test_sessions_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_status_idx ON public.test_sessions USING btree (status);


--
-- Name: test_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_id_idx ON public.test_sessions USING btree (user_id);


--
-- Name: test_sessions_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_role_idx ON public.test_sessions USING btree (user_role);


--
-- Name: user_schools_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_school_id_idx ON public.user_schools USING btree (school_id);


--
-- Name: user_schools_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_user_id_idx ON public.user_schools USING btree (user_id);


--
-- Name: user_schools_user_id_pilot_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_pilot_school_id_key ON public.user_schools USING btree (user_id, pilot_school_id);


--
-- Name: user_schools_user_id_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_school_id_key ON public.user_schools USING btree (user_id, school_id);


--
-- Name: user_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_expires_at_idx ON public.user_sessions USING btree (expires_at);


--
-- Name: user_sessions_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_is_active_idx ON public.user_sessions USING btree (is_active);


--
-- Name: user_sessions_last_activity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_last_activity_idx ON public.user_sessions USING btree (last_activity);


--
-- Name: user_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_user_id_idx ON public.user_sessions USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_pilot_school_id_idx ON public.users USING btree (pilot_school_id);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: assessment_histories assessment_histories_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessment_locks assessment_locks_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessments assessments_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_locked_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_locked_by_id_fkey FOREIGN KEY (locked_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessments assessments_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_records attendance_records_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentor_school_assignments mentor_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentor_school_assignments mentor_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentoring_visits mentoring_visits_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentoring_visits mentoring_visits_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: school_classes school_classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schools schools_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_assessment_eligibilities student_assessment_eligibilities_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_interventions student_interventions_intervention_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_intervention_program_id_fkey FOREIGN KEY (intervention_program_id) REFERENCES public.intervention_programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_interventions student_interventions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_school_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_school_class_id_fkey FOREIGN KEY (school_class_id) REFERENCES public.school_classes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_school_assignments teacher_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_school_assignments teacher_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_school_assignments teacher_school_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_activities teaching_activities_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict gATUe8EmnlElfoQmXuSqpKoxmi1rGu7l8VbLRiMSdfpepoRvhH4Mv7fe1oOomJe

