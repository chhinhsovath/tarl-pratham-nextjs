--
-- PostgreSQL database dump
--

\restrict l3yA0DMCH18srEMUrRbumkbOrBXigsLAnv2BPVGa5Dftkz87BDRZug4M2l7NHT6

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Homebrew)

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
-- Name: RecordStatus; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public."RecordStatus" AS ENUM (
    'production',
    'test_mentor',
    'test_teacher',
    'demo',
    'archived'
);


ALTER TYPE public."RecordStatus" OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assessment_histories; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.assessment_histories OWNER TO admin;

--
-- Name: assessment_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assessment_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assessment_histories_id_seq OWNER TO admin;

--
-- Name: assessment_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assessment_histories_id_seq OWNED BY public.assessment_histories.id;


--
-- Name: assessment_locks; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.assessment_locks (
    id integer NOT NULL,
    assessment_id integer NOT NULL,
    locked_by integer,
    locked_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reason text
);


ALTER TABLE public.assessment_locks OWNER TO admin;

--
-- Name: assessment_locks_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assessment_locks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assessment_locks_id_seq OWNER TO admin;

--
-- Name: assessment_locks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assessment_locks_id_seq OWNED BY public.assessment_locks.id;


--
-- Name: assessments; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.assessments OWNER TO admin;

--
-- Name: assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assessments_id_seq OWNER TO admin;

--
-- Name: assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.assessments_id_seq OWNED BY public.assessments.id;


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.attendance_records OWNER TO admin;

--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attendance_records_id_seq OWNER TO admin;

--
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.audit_logs OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO admin;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: bulk_imports; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.bulk_imports OWNER TO admin;

--
-- Name: bulk_imports_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.bulk_imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bulk_imports_id_seq OWNER TO admin;

--
-- Name: bulk_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.bulk_imports_id_seq OWNED BY public.bulk_imports.id;


--
-- Name: clusters; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.clusters (
    id integer NOT NULL,
    name text NOT NULL,
    code text NOT NULL,
    description text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.clusters OWNER TO admin;

--
-- Name: clusters_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.clusters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clusters_id_seq OWNER TO admin;

--
-- Name: clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;


--
-- Name: dashboard_stats; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.dashboard_stats OWNER TO admin;

--
-- Name: dashboard_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.dashboard_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dashboard_stats_id_seq OWNER TO admin;

--
-- Name: dashboard_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.dashboard_stats_id_seq OWNED BY public.dashboard_stats.id;


--
-- Name: intervention_programs; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.intervention_programs OWNER TO admin;

--
-- Name: intervention_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.intervention_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.intervention_programs_id_seq OWNER TO admin;

--
-- Name: intervention_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.intervention_programs_id_seq OWNED BY public.intervention_programs.id;


--
-- Name: ip_whitelist; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.ip_whitelist OWNER TO admin;

--
-- Name: ip_whitelist_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.ip_whitelist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ip_whitelist_id_seq OWNER TO admin;

--
-- Name: ip_whitelist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.ip_whitelist_id_seq OWNED BY public.ip_whitelist.id;


--
-- Name: mentor_school_assignments; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.mentor_school_assignments OWNER TO admin;

--
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.mentor_school_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentor_school_assignments_id_seq OWNER TO admin;

--
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.mentor_school_assignments_id_seq OWNED BY public.mentor_school_assignments.id;


--
-- Name: mentoring_visits; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.mentoring_visits OWNER TO admin;

--
-- Name: mentoring_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.mentoring_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mentoring_visits_id_seq OWNER TO admin;

--
-- Name: mentoring_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.mentoring_visits_id_seq OWNED BY public.mentoring_visits.id;


--
-- Name: pilot_schools; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.pilot_schools OWNER TO admin;

--
-- Name: pilot_schools_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.pilot_schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pilot_schools_id_seq OWNER TO admin;

--
-- Name: pilot_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.pilot_schools_id_seq OWNED BY public.pilot_schools.id;


--
-- Name: progress_trackings; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.progress_trackings OWNER TO admin;

--
-- Name: progress_trackings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.progress_trackings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.progress_trackings_id_seq OWNER TO admin;

--
-- Name: progress_trackings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.progress_trackings_id_seq OWNED BY public.progress_trackings.id;


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name_english text NOT NULL,
    name_khmer text,
    code text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.provinces OWNER TO admin;

--
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provinces_id_seq OWNER TO admin;

--
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- Name: quick_login_users; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.quick_login_users OWNER TO admin;

--
-- Name: quick_login_users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.quick_login_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quick_login_users_id_seq OWNER TO admin;

--
-- Name: quick_login_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.quick_login_users_id_seq OWNED BY public.quick_login_users.id;


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.rate_limits OWNER TO admin;

--
-- Name: rate_limits_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.rate_limits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rate_limits_id_seq OWNER TO admin;

--
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- Name: report_exports; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.report_exports OWNER TO admin;

--
-- Name: report_exports_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.report_exports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_exports_id_seq OWNER TO admin;

--
-- Name: report_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.report_exports_id_seq OWNED BY public.report_exports.id;


--
-- Name: resource_views; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.resource_views (
    id integer NOT NULL,
    resource_id integer NOT NULL,
    user_id integer,
    ip_address text,
    user_agent text,
    viewed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.resource_views OWNER TO admin;

--
-- Name: resource_views_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resource_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resource_views_id_seq OWNER TO admin;

--
-- Name: resource_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resource_views_id_seq OWNED BY public.resource_views.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.resources OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO admin;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: school_classes; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.school_classes OWNER TO admin;

--
-- Name: school_classes_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.school_classes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_classes_id_seq OWNER TO admin;

--
-- Name: school_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.school_classes_id_seq OWNED BY public.school_classes.id;


--
-- Name: schools; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.schools OWNER TO admin;

--
-- Name: schools_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.schools_id_seq OWNER TO admin;

--
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.settings OWNER TO admin;

--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.settings_id_seq OWNER TO admin;

--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: student_assessment_eligibilities; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.student_assessment_eligibilities OWNER TO admin;

--
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.student_assessment_eligibilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_assessment_eligibilities_id_seq OWNER TO admin;

--
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.student_assessment_eligibilities_id_seq OWNED BY public.student_assessment_eligibilities.id;


--
-- Name: student_interventions; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.student_interventions OWNER TO admin;

--
-- Name: student_interventions_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.student_interventions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.student_interventions_id_seq OWNER TO admin;

--
-- Name: student_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.student_interventions_id_seq OWNED BY public.student_interventions.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.students OWNER TO admin;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO admin;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: teacher_school_assignments; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.teacher_school_assignments OWNER TO admin;

--
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.teacher_school_assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teacher_school_assignments_id_seq OWNER TO admin;

--
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.teacher_school_assignments_id_seq OWNED BY public.teacher_school_assignments.id;


--
-- Name: teaching_activities; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.teaching_activities OWNER TO admin;

--
-- Name: teaching_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.teaching_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teaching_activities_id_seq OWNER TO admin;

--
-- Name: teaching_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.teaching_activities_id_seq OWNED BY public.teaching_activities.id;


--
-- Name: test_sessions; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.test_sessions OWNER TO admin;

--
-- Name: user_schools; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.user_schools OWNER TO admin;

--
-- Name: user_schools_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_schools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_schools_id_seq OWNER TO admin;

--
-- Name: user_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_schools_id_seq OWNED BY public.user_schools.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.user_sessions OWNER TO admin;

--
-- Name: users; Type: TABLE; Schema: public; Owner: admin
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


ALTER TABLE public.users OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assessment_histories id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_histories ALTER COLUMN id SET DEFAULT nextval('public.assessment_histories_id_seq'::regclass);


--
-- Name: assessment_locks id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_locks ALTER COLUMN id SET DEFAULT nextval('public.assessment_locks_id_seq'::regclass);


--
-- Name: assessments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments ALTER COLUMN id SET DEFAULT nextval('public.assessments_id_seq'::regclass);


--
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: bulk_imports id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bulk_imports ALTER COLUMN id SET DEFAULT nextval('public.bulk_imports_id_seq'::regclass);


--
-- Name: clusters id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);


--
-- Name: dashboard_stats id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.dashboard_stats ALTER COLUMN id SET DEFAULT nextval('public.dashboard_stats_id_seq'::regclass);


--
-- Name: intervention_programs id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.intervention_programs ALTER COLUMN id SET DEFAULT nextval('public.intervention_programs_id_seq'::regclass);


--
-- Name: ip_whitelist id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ip_whitelist ALTER COLUMN id SET DEFAULT nextval('public.ip_whitelist_id_seq'::regclass);


--
-- Name: mentor_school_assignments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.mentor_school_assignments_id_seq'::regclass);


--
-- Name: mentoring_visits id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentoring_visits ALTER COLUMN id SET DEFAULT nextval('public.mentoring_visits_id_seq'::regclass);


--
-- Name: pilot_schools id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pilot_schools ALTER COLUMN id SET DEFAULT nextval('public.pilot_schools_id_seq'::regclass);


--
-- Name: progress_trackings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.progress_trackings ALTER COLUMN id SET DEFAULT nextval('public.progress_trackings_id_seq'::regclass);


--
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- Name: quick_login_users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quick_login_users ALTER COLUMN id SET DEFAULT nextval('public.quick_login_users_id_seq'::regclass);


--
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- Name: report_exports id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_exports ALTER COLUMN id SET DEFAULT nextval('public.report_exports_id_seq'::regclass);


--
-- Name: resource_views id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_views ALTER COLUMN id SET DEFAULT nextval('public.resource_views_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: school_classes id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.school_classes ALTER COLUMN id SET DEFAULT nextval('public.school_classes_id_seq'::regclass);


--
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Name: student_assessment_eligibilities id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_assessment_eligibilities ALTER COLUMN id SET DEFAULT nextval('public.student_assessment_eligibilities_id_seq'::regclass);


--
-- Name: student_interventions id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_interventions ALTER COLUMN id SET DEFAULT nextval('public.student_interventions_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: teacher_school_assignments id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.teacher_school_assignments_id_seq'::regclass);


--
-- Name: teaching_activities id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teaching_activities ALTER COLUMN id SET DEFAULT nextval('public.teaching_activities_id_seq'::regclass);


--
-- Name: user_schools id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_schools ALTER COLUMN id SET DEFAULT nextval('public.user_schools_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: assessment_histories; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.assessment_histories VALUES (1, 12, 'updated', '{"student_id":26,"assessment_type":"baseline","subject":"language","level":"letter","notes":"Mr.Vibol","assessed_date":"2025-10-05T07:59:18.993Z","assessment_sample":null,"student_consent":null}', '{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"Sample 1","student_consent":"Yes"}', 98, '2025-10-05 09:41:22.961');
INSERT INTO public.assessment_histories VALUES (2, 20, 'updated', '{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T09:03:22.036Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 10:17:51.548');
INSERT INTO public.assessment_histories VALUES (3, 20, 'updated', '{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', '{"student_id":18,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"No"}', 98, '2025-10-05 10:18:34.736');
INSERT INTO public.assessment_histories VALUES (4, 12, 'updated', '{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 10:20:13.89');
INSERT INTO public.assessment_histories VALUES (5, 16, 'updated', '{"student_id":22,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T08:57:35.332Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":22,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 10:43:50.341');
INSERT INTO public.assessment_histories VALUES (6, 20, 'updated', '{"student_id":18,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"No"}', '{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}', 98, '2025-10-05 10:53:09.158');
INSERT INTO public.assessment_histories VALUES (7, 20, 'updated', '{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}', '{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}', 98, '2025-10-05 10:54:02.071');
INSERT INTO public.assessment_histories VALUES (8, 20, 'updated', '{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}', '{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}', 98, '2025-10-05 10:54:36.27');
INSERT INTO public.assessment_histories VALUES (9, 15, 'updated', '{"student_id":23,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:04:54.365Z","assessment_sample":null,"student_consent":null}', '{"student_id":23,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 10:55:24.558');
INSERT INTO public.assessment_histories VALUES (10, 14, 'updated', '{"student_id":24,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:04:15.125Z","assessment_sample":null,"student_consent":null}', '{"student_id":24,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 10:56:13.724');
INSERT INTO public.assessment_histories VALUES (11, 17, 'updated', '{"student_id":21,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T08:58:44.830Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":21,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-05 11:08:10.843');
INSERT INTO public.assessment_histories VALUES (12, 11, 'updated', '{"student_id":27,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T07:56:37.518Z","assessment_sample":null,"student_consent":null}', '{"student_id":27,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-06 05:37:19.315');
INSERT INTO public.assessment_histories VALUES (13, 13, 'updated', '{"student_id":25,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:03:30.627Z","assessment_sample":null,"student_consent":null}', '{"student_id":25,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-06 05:38:30.164');
INSERT INTO public.assessment_histories VALUES (14, 18, 'updated', '{"student_id":20,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":null,"assessed_date":"2025-10-05T08:59:19.394Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":20,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-06 05:39:17.627');
INSERT INTO public.assessment_histories VALUES (15, 19, 'updated', '{"student_id":19,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T09:02:52.673Z","assessment_sample":"Sample 1","student_consent":"Yes"}', '{"student_id":19,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 98, '2025-10-06 05:40:03.271');
INSERT INTO public.assessment_histories VALUES (16, 66, 'updated', '{"student_id":73,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្ត","assessed_date":"2025-10-08T13:16:07.968Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', '{"student_id":73,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្ត","assessed_date":"2025-10-07T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', 5, '2025-10-08 13:33:16.031');
INSERT INTO public.assessment_histories VALUES (17, 77, 'updated', '{"student_id":92,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-09-24T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', '{"student_id":92,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-09-25T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', 14, '2025-10-08 14:11:41.457');
INSERT INTO public.assessment_histories VALUES (18, 164, 'updated', '{"student_id":177,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-25T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', '{"student_id":177,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', 10, '2025-10-10 02:32:13.749');
INSERT INTO public.assessment_histories VALUES (19, 161, 'updated', '{"student_id":178,"assessment_type":"baseline","subject":"language","level":"comprehension1","notes":null,"assessed_date":"2025-09-25T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', '{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 10, '2025-10-10 02:34:09.479');
INSERT INTO public.assessment_histories VALUES (20, 161, 'updated', '{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', '{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 10, '2025-10-10 02:34:49.414');
INSERT INTO public.assessment_histories VALUES (21, 157, 'updated', '{"student_id":144,"assessment_type":"baseline","subject":"language","level":"beginner","notes":"test by sovath","assessed_date":"2025-10-09T05:03:54.146Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', '{"student_id":144,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":"test by set socheat","assessed_date":"2025-10-09T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', 100, '2025-10-10 08:34:30.102');
INSERT INTO public.assessment_histories VALUES (22, 287, 'updated', '{"student_id":93,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-10-09T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', '{"student_id":93,"assessment_type":"endline","subject":"math","level":"word_problems","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-10-10T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}', 14, '2025-10-13 01:39:26.015');
INSERT INTO public.assessment_histories VALUES (23, 296, 'updated', '{"student_id":306,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្ចើតេស្តរួចរាល់","assessed_date":"2025-09-28T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', '{"student_id":306,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្ចើតេស្តរួចរាល់","assessed_date":"2025-09-30T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', 101, '2025-10-13 15:13:00.668');
INSERT INTO public.assessment_histories VALUES (24, 337, 'updated', '{"student_id":258,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-02T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', '{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', 17, '2025-10-14 08:45:48.2');
INSERT INTO public.assessment_histories VALUES (25, 337, 'updated', '{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', '{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}', 17, '2025-10-14 08:46:58.501');
INSERT INTO public.assessment_histories VALUES (26, 459, 'updated', '{"student_id":18,"assessment_type":"endline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-09T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', '{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}', 15, '2025-10-18 08:09:29.49');


--
-- Data for Name: assessment_locks; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.assessments VALUES (10, 17, 25, 'baseline', 'language', 'word', 'រួចហើយ', '2025-10-05 07:36:19.147', 69, false, false, NULL, '2025-10-05 07:37:24.063', '2025-10-05 07:37:24.063', 'teacher', 'production', NULL, NULL, NULL, NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (40, 60, 4, 'baseline', 'language', 'beginner', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:09:25.317', '2025-10-08 11:09:25.317', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (11, 27, 23, 'baseline', 'language', 'story', 'Mr.Vibol', '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 07:57:45.308', '2025-10-06 05:37:16.41', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (41, 59, 4, 'baseline', 'language', 'word', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:11:26.125', '2025-10-08 11:11:26.125', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (26, 38, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:38:05.008', '2025-10-06 05:38:05.008', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (13, 25, 23, 'baseline', 'language', 'comprehension2', 'Mr.Vibol', '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:03:54.86', '2025-10-06 05:38:28.311', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (12, 26, 23, 'baseline', 'language', 'story', 'Mr.Vibol', '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 07:59:36.645', '2025-10-05 10:20:11.111', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (16, 22, 23, 'baseline', 'language', 'comprehension2', NULL, '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:58:04.317', '2025-10-05 10:43:47.379', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (18, 20, 23, 'baseline', 'language', 'paragraph', NULL, '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:59:38.084', '2025-10-06 05:39:14.618', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (20, 18, 23, 'baseline', 'language', 'comprehension2', NULL, '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 09:03:34.693', '2025-10-05 10:54:33.369', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'No', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (15, 23, 23, 'baseline', 'language', 'comprehension2', 'Mr.Vibol', '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:05:08.877', '2025-10-05 10:55:21.568', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (14, 24, 23, 'baseline', 'language', 'comprehension2', 'Mr.Vibol', '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:04:30.694', '2025-10-05 10:56:10.497', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (17, 21, 23, 'baseline', 'language', 'comprehension2', NULL, '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 08:59:01.432', '2025-10-05 11:08:07.833', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (22, 35, 8, 'baseline', 'language', 'word', 'បានធ្វើតេស្តរួច', '2025-10-06 04:05:15.631', 18, true, true, NULL, '2025-10-06 04:05:59.86', '2025-10-06 04:05:59.86', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (23, 34, 8, 'baseline', 'language', 'paragraph', 'តេស្ត', '2025-10-06 04:06:47.984', 18, true, true, NULL, '2025-10-06 04:07:24.733', '2025-10-06 04:07:24.733', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (24, 36, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:30:29.2', '2025-10-06 05:30:29.2', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (25, 37, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:36:14.206', '2025-10-06 05:36:14.206', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (19, 19, 23, 'baseline', 'language', 'comprehension2', NULL, '2025-10-05 00:00:00', 98, false, false, NULL, '2025-10-05 09:03:02.576', '2025-10-06 05:40:00.3', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (27, 39, 8, 'baseline', 'language', 'story', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:40:07.347', '2025-10-06 05:40:07.347', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (28, 40, 8, 'baseline', 'language', 'word', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:41:34.956', '2025-10-06 05:41:34.956', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (29, 41, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:43:02.566', '2025-10-06 05:43:02.566', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (30, 42, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:44:30.782', '2025-10-06 05:44:30.782', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (31, 43, 8, 'baseline', 'language', 'letter', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:45:46.073', '2025-10-06 05:45:46.073', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (32, 44, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:47:20.047', '2025-10-06 05:47:20.047', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (33, 45, 8, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 11, true, true, NULL, '2025-10-06 05:48:48.809', '2025-10-06 05:48:48.809', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (35, 54, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួចរាល់', '2025-09-24 17:00:00', 18, true, true, NULL, '2025-10-06 09:08:45.589', '2025-10-06 09:08:45.589', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (36, 64, 4, 'baseline', 'language', 'beginner', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 10:54:20.501', '2025-10-08 10:54:20.501', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (37, 63, 4, 'baseline', 'language', 'paragraph', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 10:59:01.101', '2025-10-08 10:59:01.101', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (38, 62, 4, 'baseline', 'language', 'beginner', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:04:47.267', '2025-10-08 11:04:47.267', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (39, 61, 4, 'baseline', 'language', 'letter', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:07:13.871', '2025-10-08 11:07:13.871', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (42, 58, 4, 'baseline', 'language', 'letter', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:13:57.461', '2025-10-08 11:13:57.461', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (43, 57, 4, 'baseline', 'language', 'paragraph', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:15:59.483', '2025-10-08 11:15:59.483', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (44, 56, 4, 'baseline', 'language', 'paragraph', 'បានធ្វើរួច', '2025-09-24 17:00:00', 4, true, true, NULL, '2025-10-08 11:17:58.392', '2025-10-08 11:17:58.392', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (45, 76, 9, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 12:45:29.001', '2025-10-08 12:45:29.001', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (46, 75, 9, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 12:50:00.488', '2025-10-08 12:50:00.488', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (47, 73, 9, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 12:53:05.603', '2025-10-08 12:53:05.603', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (48, 86, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 12:53:25.178', '2025-10-08 12:53:25.178', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (49, 72, 9, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 12:55:09.237', '2025-10-08 12:55:09.237', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (50, 85, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 12:56:43.95', '2025-10-08 12:56:43.95', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (51, 71, 9, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 12:56:50.816', '2025-10-08 12:56:50.816', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (52, 84, 13, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 12:58:49.72', '2025-10-08 12:58:49.72', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (53, 70, 9, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 13:00:17.142', '2025-10-08 13:00:17.142', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (54, 83, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:01:05.899', '2025-10-08 13:01:05.899', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (55, 82, 13, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:02:55.84', '2025-10-08 13:02:55.84', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (56, 69, 9, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 13:03:57.233', '2025-10-08 13:03:57.233', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (57, 68, 9, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 13:06:09.269', '2025-10-08 13:06:09.269', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (58, 67, 9, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 5, true, true, NULL, '2025-10-08 13:08:01.745', '2025-10-08 13:08:01.745', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (59, 81, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:08:03.874', '2025-10-08 13:08:03.874', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (60, 80, 13, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:10:15.87', '2025-10-08 13:10:15.87', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (61, 78, 13, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:11:55.912', '2025-10-08 13:11:55.912', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (62, 76, 9, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:13:01.816', '2025-10-08 13:13:01.816', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (63, 77, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:13:17.458', '2025-10-08 13:13:17.458', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (64, 74, 13, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 13, true, true, NULL, '2025-10-08 13:14:54.224', '2025-10-08 13:14:54.224', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (65, 75, 9, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:15:09.964', '2025-10-08 13:15:09.964', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (67, 72, 9, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:21:12.757', '2025-10-08 13:21:12.757', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (68, 71, 9, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:23:29.274', '2025-10-08 13:23:29.274', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (69, 70, 9, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:25:10.317', '2025-10-08 13:25:10.317', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (70, 69, 9, 'endline', 'math', 'number_2digit', 'មិនបានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:27:08.501', '2025-10-08 13:27:08.501', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (71, 68, 9, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:28:44.398', '2025-10-08 13:28:44.398', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (72, 67, 9, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-06 17:00:00', 5, true, true, NULL, '2025-10-08 13:30:27.525', '2025-10-08 13:30:27.525', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (73, 87, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 13:32:35.883', '2025-10-08 13:32:35.883', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (66, 73, 9, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-07 00:00:00', 5, true, true, NULL, '2025-10-08 13:18:07.707', '2025-10-08 13:33:13.117', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (74, 88, 8, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 13:36:28.88', '2025-10-08 13:36:28.88', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (75, 90, 8, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 13:38:29.035', '2025-10-08 13:38:29.035', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (76, 91, 8, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 13:48:00.636', '2025-10-08 13:48:00.636', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (78, 93, 8, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 13:58:39.936', '2025-10-08 13:58:39.936', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (79, 94, 8, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 14:00:13.396', '2025-10-08 14:00:13.396', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (80, 95, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 14:03:02.477', '2025-10-08 14:03:02.477', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (81, 96, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 14:04:26.78', '2025-10-08 14:04:26.78', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (82, 97, 8, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 14, true, true, NULL, '2025-10-08 14:07:37.911', '2025-10-08 14:07:37.911', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (77, 92, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-25 00:00:00', 14, true, true, NULL, '2025-10-08 13:49:30.501', '2025-10-08 14:11:38.53', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (83, 98, 2, 'baseline', 'language', 'beginner', 'តេស្តរួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:32:59.258', '2025-10-08 14:32:59.258', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (84, 99, 2, 'baseline', 'language', 'paragraph', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:34:24.516', '2025-10-08 14:34:24.516', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (85, 107, 2, 'baseline', 'language', 'paragraph', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:35:21.811', '2025-10-08 14:35:21.811', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (86, 106, 2, 'baseline', 'language', 'comprehension2', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:36:03.914', '2025-10-08 14:36:03.914', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (87, 105, 2, 'baseline', 'language', 'beginner', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:36:36.238', '2025-10-08 14:36:36.238', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (88, 104, 2, 'baseline', 'language', 'letter', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:37:14.173', '2025-10-08 14:37:14.173', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (89, 103, 2, 'baseline', 'language', 'word', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:37:53.501', '2025-10-08 14:37:53.501', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (90, 102, 2, 'baseline', 'language', 'story', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:38:34.83', '2025-10-08 14:38:34.83', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (91, 101, 2, 'baseline', 'language', 'comprehension2', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:39:17.781', '2025-10-08 14:39:17.781', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (92, 100, 2, 'baseline', 'language', 'beginner', 'រួច', '2025-09-24 17:00:00', 21, true, true, NULL, '2025-10-08 14:39:57.422', '2025-10-08 14:39:57.422', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (93, 99, 2, 'midline', 'language', 'paragraph', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:43:16.566', '2025-10-08 14:43:16.566', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (94, 101, 2, 'midline', 'language', 'comprehension2', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:44:19.577', '2025-10-08 14:44:19.577', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (95, 102, 2, 'midline', 'language', 'story', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:45:31.23', '2025-10-08 14:45:31.23', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (96, 103, 2, 'midline', 'language', 'paragraph', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:46:11.835', '2025-10-08 14:46:11.835', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (97, 104, 2, 'midline', 'language', 'letter', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:47:05.845', '2025-10-08 14:47:05.845', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (98, 105, 2, 'midline', 'language', 'word', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:47:48.229', '2025-10-08 14:47:48.229', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (99, 107, 2, 'midline', 'language', 'story', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:48:30.107', '2025-10-08 14:48:30.107', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (100, 99, 2, 'endline', 'language', 'comprehension2', 'រួច', '2025-10-04 17:00:00', 21, true, true, NULL, '2025-10-08 14:49:24.354', '2025-10-08 14:49:24.354', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (101, 100, 2, 'endline', 'language', 'word', 'រួច', '2025-10-08 14:49:34.685', 21, true, true, NULL, '2025-10-08 14:50:01.893', '2025-10-08 14:50:01.893', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (102, 101, 2, 'endline', 'language', 'comprehension2', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:50:50.769', '2025-10-08 14:50:50.769', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (103, 102, 2, 'endline', 'language', 'comprehension2', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:51:27.731', '2025-10-08 14:51:27.731', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (104, 104, 2, 'endline', 'language', 'word', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:52:09.409', '2025-10-08 14:52:09.409', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (105, 105, 2, 'endline', 'language', 'word', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:53:05.466', '2025-10-08 14:53:05.466', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (106, 107, 2, 'endline', 'language', 'comprehension2', 'រួច', '2025-09-30 17:00:00', 21, true, true, NULL, '2025-10-08 14:53:36.445', '2025-10-08 14:53:36.445', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (107, 108, 33, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2023-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:31:29.671', '2025-10-08 15:31:29.671', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (108, 109, 33, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:33:37.951', '2025-10-08 15:33:37.951', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (109, 110, 33, 'baseline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:35:10.588', '2025-10-08 15:35:10.588', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (110, 111, 33, 'baseline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:36:27.775', '2025-10-08 15:36:27.775', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (111, 112, 33, 'baseline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:37:36.514', '2025-10-08 15:37:36.514', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (112, 113, 33, 'baseline', 'math', 'subtraction', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:38:50.658', '2025-10-08 15:38:50.658', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (113, 114, 33, 'baseline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:40:54.259', '2025-10-08 15:40:54.259', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (114, 115, 33, 'baseline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:42:10.91', '2025-10-08 15:42:10.91', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (115, 116, 33, 'baseline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:43:18.152', '2025-10-08 15:43:18.152', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (116, 117, 33, 'baseline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-09-26 17:00:00', 94, true, true, NULL, '2025-10-08 15:44:24.18', '2025-10-08 15:44:24.18', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (117, 108, 33, 'midline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:46:03.744', '2025-10-08 15:46:03.744', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (118, 109, 33, 'midline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:47:34.82', '2025-10-08 15:47:34.82', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (119, 110, 33, 'midline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:50:02.416', '2025-10-08 15:50:02.416', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (120, 111, 33, 'midline', 'math', 'division', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:51:23.366', '2025-10-08 15:51:23.366', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (121, 112, 33, 'midline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:52:53.234', '2025-10-08 15:52:53.234', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (122, 113, 33, 'midline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:54:03.883', '2025-10-08 15:54:03.883', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (123, 115, 33, 'midline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:55:21.432', '2025-10-08 15:55:21.432', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (124, 116, 33, 'midline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-03 17:00:00', 94, true, true, NULL, '2025-10-08 15:56:44.647', '2025-10-08 15:56:44.647', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (125, 108, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-07 17:00:00', 94, true, true, NULL, '2025-10-08 15:58:09.998', '2025-10-08 15:58:09.998', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (126, 109, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-07 17:00:00', 94, true, true, NULL, '2025-10-08 15:59:26.587', '2025-10-08 15:59:26.587', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (127, 110, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 15:59:48.439', 94, true, true, NULL, '2025-10-08 16:00:28.067', '2025-10-08 16:00:28.067', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (128, 111, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 16:00:56.034', 94, true, true, NULL, '2025-10-08 16:01:53.862', '2025-10-08 16:01:53.862', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (129, 112, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 16:02:29.513', 94, true, true, NULL, '2025-10-08 16:03:12.093', '2025-10-08 16:03:12.093', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (130, 113, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 16:03:36.759', 94, true, true, NULL, '2025-10-08 16:04:18.822', '2025-10-08 16:04:18.822', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (131, 115, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 16:04:40.649', 94, true, true, NULL, '2025-10-08 16:05:22.216', '2025-10-08 16:05:22.216', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (132, 116, 33, 'endline', 'math', 'word_problems', 'បាន​ធ្វើតេស្តរួច', '2025-10-08 16:05:40.429', 94, true, true, NULL, '2025-10-08 16:06:20.083', '2025-10-08 16:06:20.083', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (133, 127, 28, 'baseline', 'language', 'story', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:26:15.883', '2025-10-09 03:26:15.883', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (134, 126, 28, 'baseline', 'language', 'comprehension1', 'បានធ្វើតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:32:14.016', '2025-10-09 03:32:14.016', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (135, 125, 28, 'baseline', 'language', 'story', NULL, '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:34:46.528', '2025-10-09 03:34:46.528', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (136, 124, 28, 'baseline', 'language', 'paragraph', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:36:37.367', '2025-10-09 03:36:37.367', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (137, 123, 28, 'baseline', 'language', 'story', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:38:08.453', '2025-10-09 03:38:08.453', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (138, 122, 28, 'baseline', 'language', 'paragraph', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:39:31.247', '2025-10-09 03:39:31.247', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (139, 121, 28, 'baseline', 'language', 'story', NULL, '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:40:38.275', '2025-10-09 03:40:38.275', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (140, 120, 28, 'baseline', 'language', 'paragraph', NULL, '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:41:28.66', '2025-10-09 03:41:28.66', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (141, 119, 28, 'baseline', 'language', 'comprehension1', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:42:49.545', '2025-10-09 03:42:49.545', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (142, 118, 28, 'baseline', 'language', 'paragraph', 'បានតេស្ត', '2025-09-24 17:00:00', 19, true, true, NULL, '2025-10-09 03:44:04.839', '2025-10-09 03:44:04.839', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (143, 127, 28, 'endline', 'language', 'story', NULL, '2025-10-06 17:00:00', 19, true, true, NULL, '2025-10-09 03:50:35.826', '2025-10-09 03:50:35.826', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (144, 126, 28, 'endline', 'language', 'comprehension2', NULL, '2025-10-06 17:00:00', 19, true, true, NULL, '2025-10-09 03:54:43.933', '2025-10-09 03:54:43.933', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (145, 137, 33, 'baseline', 'language', 'comprehension2', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:03:18.018', '2025-10-09 04:03:18.018', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (146, 136, 33, 'baseline', 'language', 'comprehension2', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:05:34.873', '2025-10-09 04:05:34.873', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (147, 135, 33, 'baseline', 'language', 'story', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:06:45.366', '2025-10-09 04:06:45.366', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (148, 134, 33, 'baseline', 'language', 'comprehension2', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:09:17.356', '2025-10-09 04:09:17.356', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (149, 133, 33, 'baseline', 'language', 'comprehension1', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:11:07.416', '2025-10-09 04:11:07.416', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (150, 132, 33, 'baseline', 'language', 'comprehension2', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:12:08.155', '2025-10-09 04:12:08.155', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (151, 131, 33, 'baseline', 'language', 'comprehension2', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:12:55.008', '2025-10-09 04:12:55.008', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (152, 130, 33, 'baseline', 'language', 'comprehension1', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:13:56.44', '2025-10-09 04:13:56.44', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (153, 129, 33, 'baseline', 'language', 'word', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:14:51.577', '2025-10-09 04:14:51.577', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (154, 128, 33, 'baseline', 'language', 'story', NULL, '2025-09-26 17:00:00', 97, true, true, NULL, '2025-10-09 04:19:05.613', '2025-10-09 04:19:05.613', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (155, 137, 33, 'baseline', 'math', 'subtraction', NULL, '2025-10-09 04:26:50.374', 94, true, true, NULL, '2025-10-09 04:29:39.765', '2025-10-09 04:29:39.765', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (158, 125, 28, 'endline', 'language', 'story', 'បានតេស្ត', '2025-10-06 17:00:00', 19, true, true, NULL, '2025-10-09 08:57:19.639', '2025-10-09 08:57:19.639', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (159, 124, 28, 'endline', 'language', 'story', 'បានតេស្ត', '2025-10-06 17:00:00', 19, true, true, NULL, '2025-10-09 08:59:09.266', '2025-10-09 08:59:09.266', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (160, 123, 28, 'endline', 'language', 'comprehension1', 'បានតេស្ត', '2025-10-06 17:00:00', 19, true, true, NULL, '2025-10-09 09:04:21.638', '2025-10-09 09:04:21.638', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (162, 178, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-01 17:00:00', 10, true, true, NULL, '2025-10-10 01:50:42.746', '2025-10-10 01:50:42.746', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (157, 144, 1, 'baseline', 'language', 'paragraph', 'test by set socheat', '2025-10-09 00:00:00', 100, true, true, NULL, '2025-10-09 05:04:17.054', '2025-10-10 08:34:27.022', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (163, 178, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 01:51:49.787', '2025-10-10 01:51:49.787', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (165, 177, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 01:54:09.831', '2025-10-10 01:54:09.831', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (166, 177, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 01:56:54.709', '2025-10-10 01:56:54.709', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (167, 176, 37, 'baseline', 'language', 'paragraph', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 01:57:52.856', '2025-10-10 01:57:52.856', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (168, 176, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 01:58:56.19', '2025-10-10 01:58:56.19', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (169, 176, 37, 'endline', 'language', 'comprehension1', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:01:32.097', '2025-10-10 02:01:32.097', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (170, 175, 37, 'baseline', 'language', 'paragraph', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:02:49.567', '2025-10-10 02:02:49.567', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (171, 175, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:03:44.883', '2025-10-10 02:03:44.883', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (172, 175, 37, 'endline', 'language', 'comprehension1', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:04:30.909', '2025-10-10 02:04:30.909', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (173, 174, 37, 'baseline', 'language', 'paragraph', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:05:30.304', '2025-10-10 02:05:30.304', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (174, 174, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:06:11.885', '2025-10-10 02:06:11.885', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (175, 174, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:07:01.406', '2025-10-10 02:07:01.406', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (176, 173, 37, 'baseline', 'language', 'paragraph', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:08:14.417', '2025-10-10 02:08:14.417', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (177, 173, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:08:56.032', '2025-10-10 02:08:56.032', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (178, 173, 37, 'endline', 'language', 'comprehension1', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:17:03.133', '2025-10-10 02:17:03.133', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (179, 172, 37, 'baseline', 'language', 'comprehension1', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:18:43.481', '2025-10-10 02:18:43.481', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (180, 172, 37, 'midline', 'language', 'comprehension2', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:19:38.972', '2025-10-10 02:19:38.972', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (181, 172, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:20:26.07', '2025-10-10 02:20:26.07', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (182, 171, 37, 'baseline', 'language', 'comprehension1', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:21:17.939', '2025-10-10 02:21:17.939', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (183, 171, 37, 'midline', 'language', 'comprehension2', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:21:53.142', '2025-10-10 02:21:53.142', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (184, 171, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:22:19.699', '2025-10-10 02:22:19.699', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (185, 181, 37, 'baseline', 'language', 'story', NULL, '2025-09-25 17:00:00', 10, true, true, NULL, '2025-10-10 02:24:54.124', '2025-10-10 02:24:54.124', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (186, 181, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:25:28.448', '2025-10-10 02:25:28.448', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (187, 181, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:25:59.47', '2025-10-10 02:25:59.47', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (164, 177, 37, 'baseline', 'language', 'story', NULL, '2025-09-26 00:00:00', 10, true, true, NULL, '2025-10-10 01:53:06.709', '2025-10-10 02:32:10.756', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (161, 178, 37, 'baseline', 'language', 'story', NULL, '2025-09-26 00:00:00', 10, true, true, NULL, '2025-10-10 01:46:20.956', '2025-10-10 02:34:47.439', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (188, 182, 37, 'baseline', 'language', 'story', NULL, '2025-09-28 17:00:00', 10, true, true, NULL, '2025-10-10 02:37:33.446', '2025-10-10 02:37:33.446', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (189, 182, 37, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 10, true, true, NULL, '2025-10-10 02:38:23.047', '2025-10-10 02:38:23.047', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (190, 182, 37, 'endline', 'language', 'comprehension2', NULL, '2025-10-05 17:00:00', 10, true, true, NULL, '2025-10-10 02:38:51.921', '2025-10-10 02:38:51.921', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (191, 143, 1, 'baseline', 'language', 'story', 'set socheat', '2025-10-10 08:54:10.056', 100, true, true, NULL, '2025-10-10 08:55:27.953', '2025-10-10 08:55:27.953', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (192, 192, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 08:55:35.16', 100, true, true, NULL, '2025-10-10 08:56:24.933', '2025-10-10 08:56:24.933', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (193, 138, 1, 'baseline', 'language', 'story', 'set socheat', '2025-10-10 08:56:29.317', 100, true, true, NULL, '2025-10-10 08:57:09.772', '2025-10-10 08:57:09.772', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (194, 139, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 08:57:13.548', 100, true, true, NULL, '2025-10-10 08:57:42.632', '2025-10-10 08:57:42.632', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (195, 140, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 08:57:44.825', 100, true, true, NULL, '2025-10-10 08:58:12.263', '2025-10-10 08:58:12.263', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (196, 141, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 08:58:14.022', 100, true, true, NULL, '2025-10-10 08:58:50.369', '2025-10-10 08:58:50.369', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (197, 142, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 08:58:52.881', 100, true, true, NULL, '2025-10-10 08:59:47.717', '2025-10-10 08:59:47.717', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (198, 183, 1, 'baseline', 'language', 'paragraph', 'set socheat', '2025-10-10 08:59:55.124', 100, true, true, NULL, '2025-10-10 09:00:38.471', '2025-10-10 09:00:38.471', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (199, 184, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:00:41.618', 100, true, true, NULL, '2025-10-10 09:01:09.387', '2025-10-10 09:01:09.387', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (200, 185, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:01:12.796', 100, true, true, NULL, '2025-10-10 09:02:02.337', '2025-10-10 09:02:02.337', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (201, 186, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:02:04.162', 100, true, true, NULL, '2025-10-10 09:02:36.89', '2025-10-10 09:02:36.89', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (202, 187, 1, 'baseline', 'language', 'paragraph', 'set socheat', '2025-10-10 09:02:40.081', 100, true, true, NULL, '2025-10-10 09:03:14.2', '2025-10-10 09:03:14.2', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (203, 188, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:03:16.132', 100, true, true, NULL, '2025-10-10 09:03:49.772', '2025-10-10 09:03:49.772', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (204, 189, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:03:51.697', 100, true, true, NULL, '2025-10-10 09:04:17.5', '2025-10-10 09:04:17.5', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (205, 190, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:04:20.221', 100, true, true, NULL, '2025-10-10 09:04:49.397', '2025-10-10 09:04:49.397', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (206, 191, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:04:53.134', 100, true, true, NULL, '2025-10-10 09:05:22.4', '2025-10-10 09:05:22.4', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (207, 1, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:09:12.006', 100, true, true, NULL, '2025-10-10 09:09:52.264', '2025-10-10 09:09:52.264', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (208, 148, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-10 09:11:46.484', 100, true, true, NULL, '2025-10-10 09:12:19.75', '2025-10-10 09:12:19.75', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (209, 203, 40, 'baseline', 'language', 'letter', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 10:52:59.841', '2025-10-10 10:52:59.841', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (210, 204, 40, 'baseline', 'language', 'word', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 10:54:59.916', '2025-10-10 10:54:59.916', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (211, 215, 40, 'baseline', 'language', 'word', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 10:56:35.967', '2025-10-10 10:56:35.967', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (212, 217, 40, 'baseline', 'language', 'word', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 10:58:22.724', '2025-10-10 10:58:22.724', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (213, 218, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 10:59:28.307', '2025-10-10 10:59:28.307', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (214, 219, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:00:36.684', '2025-10-10 11:00:36.684', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (215, 220, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:01:36.043', '2025-10-10 11:01:36.043', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (216, 221, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:02:40.684', '2025-10-10 11:02:40.684', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (217, 222, 40, 'baseline', 'language', 'letter', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:03:36.506', '2025-10-10 11:03:36.506', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (218, 223, 40, 'baseline', 'language', 'letter', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:04:22.345', '2025-10-10 11:04:22.345', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (219, 225, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:05:16.065', '2025-10-10 11:05:16.065', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (220, 226, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:06:05.948', '2025-10-10 11:06:05.948', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (221, 227, 40, 'baseline', 'language', 'story', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:06:52.909', '2025-10-10 11:06:52.909', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (222, 229, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:07:35.042', '2025-10-10 11:07:35.042', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (223, 230, 40, 'baseline', 'language', 'story', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:08:32.543', '2025-10-10 11:08:32.543', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (224, 231, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:09:15.067', '2025-10-10 11:09:15.067', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (225, 232, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:09:57.242', '2025-10-10 11:09:57.242', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (226, 234, 40, 'baseline', 'language', 'story', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:10:41.87', '2025-10-10 11:10:41.87', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (227, 235, 40, 'baseline', 'language', 'paragraph', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:11:19.578', '2025-10-10 11:11:19.578', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (228, 236, 40, 'baseline', 'language', 'word', 'បានតេស្ដរួចរាល់', '2025-09-30 17:00:00', 16, true, true, NULL, '2025-10-10 11:11:56.939', '2025-10-10 11:11:56.939', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (229, 149, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:32:50.277', '2025-10-10 13:32:50.277', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (230, 150, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:35:52.455', '2025-10-10 13:35:52.455', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (231, 151, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:38:47.043', '2025-10-10 13:38:47.043', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (232, 152, 29, 'baseline', 'math', 'division', 'បានតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:42:32.009', '2025-10-10 13:42:32.009', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (233, 153, 29, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:44:54.506', '2025-10-10 13:44:54.506', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (234, 154, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:46:47.999', '2025-10-10 13:46:47.999', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (235, 155, 29, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:47:53.521', '2025-10-10 13:47:53.521', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (236, 156, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:49:05.58', '2025-10-10 13:49:05.58', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (237, 157, 29, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:50:45.171', '2025-10-10 13:50:45.171', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (238, 158, 29, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:51:49.953', '2025-10-10 13:51:49.953', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (239, 159, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:53:02.173', '2025-10-10 13:53:02.173', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (240, 160, 29, 'baseline', 'math', 'number_2digit', NULL, '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:53:53.387', '2025-10-10 13:53:53.387', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (241, 161, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:54:39.166', '2025-10-10 13:54:39.166', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (242, 162, 29, 'baseline', 'math', 'division', 'បានធ្វើតេស្តដើមគ្រារួចហើយ', '2025-09-29 17:00:00', 9, true, true, NULL, '2025-10-10 13:55:18.425', '2025-10-10 13:55:18.425', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (243, 86, 13, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:22:11.556', '2025-10-11 01:22:11.556', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (244, 85, 13, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:24:44.043', '2025-10-11 01:24:44.043', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (245, 84, 13, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:27:10.567', '2025-10-11 01:27:10.567', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (246, 83, 13, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:30:11.445', '2025-10-11 01:30:11.445', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (247, 82, 13, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:31:40.581', '2025-10-11 01:31:40.581', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (248, 81, 13, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:32:58.163', '2025-10-11 01:32:58.163', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (249, 80, 13, 'endline', 'math', 'number_2digit', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:34:33.384', '2025-10-11 01:34:33.384', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (250, 78, 13, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:36:02.95', '2025-10-11 01:36:02.95', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (251, 77, 13, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:37:29.626', '2025-10-11 01:37:29.626', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (252, 74, 13, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-05 17:00:00', 13, true, true, NULL, '2025-10-11 01:38:43.32', '2025-10-11 01:38:43.32', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (254, 278, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, false, NULL, '2025-10-11 12:36:36.584', '2025-10-11 12:36:36.584', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (255, 277, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, false, NULL, '2025-10-11 12:38:32.821', '2025-10-11 12:38:32.821', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (256, 276, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, false, NULL, '2025-10-11 12:40:53.972', '2025-10-11 12:40:53.972', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (257, 275, 34, 'baseline', 'language', 'story', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:43:30.151', '2025-10-11 12:43:30.151', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (258, 274, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:45:06.517', '2025-10-11 12:45:06.517', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (259, 273, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:46:13.241', '2025-10-11 12:46:13.241', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (260, 272, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:48:28.662', '2025-10-11 12:48:28.662', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (261, 271, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:49:54.64', '2025-10-11 12:49:54.64', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (262, 270, 34, 'baseline', 'language', 'paragraph', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:50:50.65', '2025-10-11 12:50:50.65', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (263, 269, 34, 'baseline', 'language', 'story', NULL, '2025-09-26 17:00:00', 103, true, true, NULL, '2025-10-11 12:51:35.893', '2025-10-11 12:51:35.893', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (264, 278, 34, 'midline', 'language', 'story', NULL, '2025-10-02 17:00:00', 103, true, false, NULL, '2025-10-12 00:55:21.384', '2025-10-12 00:55:21.384', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (265, 277, 34, 'midline', 'language', 'paragraph', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 00:56:30.59', '2025-10-12 00:56:30.59', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (266, 276, 34, 'midline', 'language', 'story', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 00:57:41.446', '2025-10-12 00:57:41.446', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (267, 275, 34, 'midline', 'language', 'comprehension2', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 00:58:42.548', '2025-10-12 00:58:42.548', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (268, 274, 34, 'midline', 'language', 'story', NULL, '2025-10-12 00:58:53.26', 103, true, true, NULL, '2025-10-12 00:59:46.996', '2025-10-12 00:59:46.996', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (269, 273, 34, 'midline', 'language', 'story', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 01:00:48.897', '2025-10-12 01:00:48.897', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (270, 272, 34, 'midline', 'language', 'paragraph', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 01:01:37.462', '2025-10-12 01:01:37.462', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (271, 271, 34, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 01:02:42.203', '2025-10-12 01:02:42.203', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (272, 270, 34, 'midline', 'language', 'comprehension1', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 01:03:44.426', '2025-10-12 01:03:44.426', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (273, 269, 34, 'midline', 'language', 'comprehension2', NULL, '2025-10-02 17:00:00', 103, true, true, NULL, '2025-10-12 01:04:28.048', '2025-10-12 01:04:28.048', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (274, 46, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 02:53:58.231', '2025-10-12 02:53:58.231', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (275, 47, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 02:57:30.591', '2025-10-12 02:57:30.591', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (276, 48, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 02:59:01.865', '2025-10-12 02:59:01.865', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (277, 49, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:00:59.9', '2025-10-12 03:00:59.9', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (278, 50, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:02:34.678', '2025-10-12 03:02:34.678', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (279, 51, 8, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:04:01.982', '2025-10-12 03:04:01.982', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (280, 52, 8, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:05:34.485', '2025-10-12 03:05:34.485', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (281, 53, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:06:53.956', '2025-10-12 03:06:53.956', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (282, 55, 8, 'baseline', 'math', 'word_problems', 'បានធ្វើតស្តរួច', '2025-09-24 17:00:00', 18, true, false, NULL, '2025-10-12 03:09:47.451', '2025-10-12 03:09:47.451', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (283, 97, 8, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:29:47.748', '2025-10-13 01:29:47.748', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (284, 96, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:32:25.17', '2025-10-13 01:32:25.17', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (285, 95, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:34:06.734', '2025-10-13 01:34:06.734', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (286, 94, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:35:28.5', '2025-10-13 01:35:28.5', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (287, 93, 8, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-10-10 00:00:00', 14, true, false, NULL, '2025-10-13 01:36:55.346', '2025-10-13 01:39:23.05', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (288, 92, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:40:57.474', '2025-10-13 01:40:57.474', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (289, 91, 8, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:42:25.196', '2025-10-13 01:42:25.196', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (290, 90, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:44:08.258', '2025-10-13 01:44:08.258', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (291, 88, 8, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:45:47.796', '2025-10-13 01:45:47.796', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (292, 87, 8, 'endline', 'math', 'division', 'បានធ្វើតេស្តរួច', '2025-10-09 17:00:00', 14, true, false, NULL, '2025-10-13 01:47:14.876', '2025-10-13 01:47:14.876', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (297, 305, 1, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, false, NULL, '2025-10-13 14:33:50.874', '2025-10-13 14:33:50.874', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (298, 296, 1, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:37:38.452', '2025-10-13 14:37:38.452', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (299, 295, 1, 'baseline', 'math', 'number_2digit', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:40:21.721', '2025-10-13 14:40:21.721', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (300, 297, 1, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួចរាល់', '2025-09-29 17:00:00', 101, true, true, NULL, '2025-10-13 14:44:43.321', '2025-10-13 14:44:43.321', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (301, 294, 1, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:46:45.108', '2025-10-13 14:46:45.108', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (302, 293, 1, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:51:10.355', '2025-10-13 14:51:10.355', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (303, 292, 1, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:53:29.461', '2025-10-13 14:53:29.461', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (304, 291, 1, 'baseline', 'math', 'subtraction', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, true, NULL, '2025-10-13 14:56:52.148', '2025-10-13 14:56:52.148', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (305, 308, 1, 'baseline', 'math', 'division', 'បានធ្វើតេស្តរួចរាល់', '2025-09-28 17:00:00', 101, true, false, NULL, '2025-10-13 15:05:51.685', '2025-10-13 15:05:51.685', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (306, 307, 1, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួចរាល់', '2025-09-29 17:00:00', 101, true, true, NULL, '2025-10-13 15:08:03.14', '2025-10-13 15:08:03.14', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (296, 306, 1, 'baseline', 'math', 'subtraction', 'បានធ្ចើតេស្តរួចរាល់', '2025-09-30 00:00:00', 101, true, false, NULL, '2025-10-13 14:19:40.477', '2025-10-13 15:12:57.714', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (307, 309, 1, 'baseline', 'math', 'word_problems', 'បានធ្វើតេស្តរួចរាល់', '2025-09-29 17:00:00', 101, true, false, NULL, '2025-10-13 15:17:20.502', '2025-10-13 15:17:20.502', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (308, 193, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-09-29 17:00:00', 100, true, false, NULL, '2025-10-14 06:37:56.339', '2025-10-14 06:37:56.339', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (309, 194, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-09-29 17:00:00', 100, true, true, NULL, '2025-10-14 06:41:26.263', '2025-10-14 06:41:26.263', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (310, 195, 1, 'baseline', 'language', 'comprehension2', 'set socheat', '2025-10-14 06:42:11.529', 100, true, true, NULL, '2025-10-14 06:42:44.45', '2025-10-14 06:42:44.45', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (311, 196, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-14 06:42:50.675', 100, true, true, NULL, '2025-10-14 06:43:20.499', '2025-10-14 06:43:20.499', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (312, 197, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-14 06:43:26.119', 100, true, true, NULL, '2025-10-14 06:43:54.451', '2025-10-14 06:43:54.451', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (313, 198, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-14 06:43:58.725', 100, true, true, NULL, '2025-10-14 06:44:44.865', '2025-10-14 06:44:44.865', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (314, 199, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-14 06:44:49.728', 100, true, true, NULL, '2025-10-14 06:45:18.577', '2025-10-14 06:45:18.577', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (315, 310, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-14 06:45:23.96', 100, true, true, NULL, '2025-10-14 06:45:46.108', '2025-10-14 06:45:46.108', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (316, 311, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-14 06:47:06.713', 100, true, true, NULL, '2025-10-14 06:47:41.686', '2025-10-14 06:47:41.686', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (317, 360, 44, 'baseline', 'math', 'subtraction', NULL, '2025-10-09 17:00:00', 6, true, false, NULL, '2025-10-14 07:36:16.453', '2025-10-14 07:36:16.453', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (318, 359, 44, 'baseline', 'math', 'subtraction', NULL, '2025-10-09 17:00:00', 6, true, true, NULL, '2025-10-14 07:37:10.413', '2025-10-14 07:37:10.413', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (319, 358, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:38:11.334', '2025-10-14 07:38:11.334', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (320, 356, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, false, NULL, '2025-10-14 07:40:02.267', '2025-10-14 07:40:02.267', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (321, 354, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:40:48.435', '2025-10-14 07:40:48.435', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (322, 353, 44, 'baseline', 'math', 'number_1digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:41:29.811', '2025-10-14 07:41:29.811', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (323, 352, 44, 'baseline', 'math', 'number_1digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:42:38.181', '2025-10-14 07:42:38.181', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (324, 351, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:43:25.371', '2025-10-14 07:43:25.371', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (325, 348, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:44:18.251', '2025-10-14 07:44:18.251', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (326, 347, 44, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 6, true, true, NULL, '2025-10-14 07:45:00.671', '2025-10-14 07:45:00.671', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (327, 258, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:16:02.465', '2025-10-14 08:16:02.465', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (328, 255, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:17:21.083', '2025-10-14 08:17:21.083', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (329, 253, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:18:16.221', '2025-10-14 08:18:16.221', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (330, 250, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:19:21.124', '2025-10-14 08:19:21.124', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (331, 249, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:20:36.756', '2025-10-14 08:20:36.756', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (332, 245, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:21:29.667', '2025-10-14 08:21:29.667', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (333, 241, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:22:15.64', '2025-10-14 08:22:15.64', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (334, 239, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:22:58.477', '2025-10-14 08:22:58.477', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (335, 238, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:23:42.491', '2025-10-14 08:23:42.491', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (336, 237, 41, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 17, true, false, NULL, '2025-10-14 08:24:58.936', '2025-10-14 08:24:58.936', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (338, 241, 41, 'midline', 'math', 'division', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:43:26.25', '2025-10-14 08:43:26.25', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (339, 245, 41, 'midline', 'math', 'division', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:45:09.264', '2025-10-14 08:45:09.264', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (337, 258, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-03 00:00:00', 17, true, false, NULL, '2025-10-14 08:36:07.168', '2025-10-14 08:46:55.546', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (340, 250, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:48:15.328', '2025-10-14 08:48:15.328', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (341, 255, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:49:17.681', '2025-10-14 08:49:17.681', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (342, 249, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:50:50.442', '2025-10-14 08:50:50.442', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (343, 253, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, false, NULL, '2025-10-14 08:55:01.445', '2025-10-14 08:55:01.445', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (344, 237, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, true, NULL, '2025-10-14 08:55:50.061', '2025-10-14 08:55:50.061', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (345, 238, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, true, NULL, '2025-10-14 08:56:38.797', '2025-10-14 08:56:38.797', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (346, 239, 41, 'midline', 'math', 'subtraction', NULL, '2025-10-02 17:00:00', 17, true, true, NULL, '2025-10-14 08:57:23.047', '2025-10-14 08:57:23.047', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (347, 237, 41, 'endline', 'math', 'word_problems', 'បញ្ចប់', '2025-10-09 17:00:00', 17, true, false, NULL, '2025-10-14 08:59:30.731', '2025-10-14 08:59:30.731', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (348, 239, 41, 'endline', 'math', 'division', 'រួចរាល់', '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:01:28.87', '2025-10-14 09:01:28.87', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (349, 255, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:02:16.618', '2025-10-14 09:02:16.618', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (350, 238, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:03:19.68', '2025-10-14 09:03:19.68', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (351, 241, 41, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:04:38.515', '2025-10-14 09:04:38.515', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (352, 245, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:06:53.735', '2025-10-14 09:06:53.735', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (353, 258, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:07:59.024', '2025-10-14 09:07:59.024', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (354, 250, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:08:47.927', '2025-10-14 09:08:47.927', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (355, 249, 41, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:09:51.167', '2025-10-14 09:09:51.167', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (356, 253, 41, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 17, true, true, NULL, '2025-10-14 09:11:07.422', '2025-10-14 09:11:07.422', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (357, 278, 34, 'endline', 'language', 'story', NULL, '2025-10-12 17:00:00', 20, true, false, NULL, '2025-10-14 11:30:35.213', '2025-10-14 11:30:35.213', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (358, 277, 34, 'endline', 'language', 'story', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:31:43.482', '2025-10-14 11:31:43.482', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (359, 276, 34, 'endline', 'language', 'comprehension1', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:34:14.763', '2025-10-14 11:34:14.763', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (360, 275, 34, 'endline', 'language', 'comprehension2', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:35:18.766', '2025-10-14 11:35:18.766', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (361, 274, 34, 'endline', 'language', 'comprehension1', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:36:30.218', '2025-10-14 11:36:30.218', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (362, 273, 34, 'endline', 'language', 'comprehension1', NULL, '2025-10-12 17:00:00', 20, true, false, NULL, '2025-10-14 11:40:29.398', '2025-10-14 11:40:29.398', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (363, 272, 34, 'endline', 'language', 'story', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:42:38.819', '2025-10-14 11:42:38.819', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (364, 271, 34, 'endline', 'language', 'comprehension2', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:44:02.887', '2025-10-14 11:44:02.887', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (365, 270, 34, 'endline', 'language', 'comprehension2', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:45:03.045', '2025-10-14 11:45:03.045', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (366, 269, 34, 'endline', 'language', 'comprehension2', NULL, '2025-10-12 17:00:00', 20, true, true, NULL, '2025-10-14 11:45:43.681', '2025-10-14 11:45:43.681', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (367, 149, 29, 'midline', 'math', 'subtraction', NULL, '2025-10-03 17:00:00', 9, true, false, NULL, '2025-10-15 03:06:23.23', '2025-10-15 03:06:23.23', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (368, 151, 29, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តបញ្ជាប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:11:17.978', '2025-10-15 03:11:17.978', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (369, 149, 29, 'endline', 'math', 'division', 'បានធ្វើតេស្តបញ្ជប់រួហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:12:50.919', '2025-10-15 03:12:50.919', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (370, 152, 29, 'endline', 'math', 'division', NULL, '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:16:45.447', '2025-10-15 03:16:45.447', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (371, 153, 29, 'endline', 'math', 'division', NULL, '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:17:28.924', '2025-10-15 03:17:28.924', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (372, 154, 29, 'endline', 'math', 'word_problems', NULL, '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:18:25.524', '2025-10-15 03:18:25.524', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (373, 155, 29, 'endline', 'math', 'word_problems', NULL, '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:19:24.896', '2025-10-15 03:19:24.896', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (374, 156, 29, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:27:20.201', '2025-10-15 03:27:20.201', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (375, 157, 29, 'endline', 'math', 'division', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:28:25.441', '2025-10-15 03:28:25.441', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (376, 158, 29, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:29:22.024', '2025-10-15 03:29:22.024', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (377, 159, 29, 'endline', 'math', 'division', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:30:06.264', '2025-10-15 03:30:06.264', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (378, 160, 29, 'endline', 'math', 'division', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:31:26.34', '2025-10-15 03:31:26.34', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (379, 161, 29, 'endline', 'math', 'division', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:32:37.334', '2025-10-15 03:32:37.334', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (380, 162, 29, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្តបញ្ចប់រួចហើយ', '2025-10-12 17:00:00', 9, true, false, NULL, '2025-10-15 03:33:15.269', '2025-10-15 03:33:15.269', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (381, 313, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:31:27.113', 100, true, false, NULL, '2025-10-15 12:32:39.381', '2025-10-15 12:32:39.381', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (382, 317, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:32:45.945', 100, true, true, NULL, '2025-10-15 12:34:21.836', '2025-10-15 12:34:21.836', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (383, 318, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:34:26.302', 100, true, true, NULL, '2025-10-15 12:34:51.68', '2025-10-15 12:34:51.68', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (384, 319, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:34:56.046', 100, true, true, NULL, '2025-10-15 12:35:36.138', '2025-10-15 12:35:36.138', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (385, 321, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:36:20.784', 100, true, true, NULL, '2025-10-15 12:36:58.042', '2025-10-15 12:36:58.042', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (386, 322, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:37:02.728', 100, true, true, NULL, '2025-10-15 12:37:32.173', '2025-10-15 12:37:32.173', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (387, 346, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:38:09.458', 100, true, false, NULL, '2025-10-15 12:38:32.944', '2025-10-15 12:38:32.944', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (388, 345, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:39:01.691', 100, true, false, NULL, '2025-10-15 12:39:32.552', '2025-10-15 12:39:32.552', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (389, 344, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:39:50.812', 100, true, false, NULL, '2025-10-15 12:40:18.983', '2025-10-15 12:40:18.983', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (390, 343, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:40:26.96', 100, true, false, NULL, '2025-10-15 12:40:55.066', '2025-10-15 12:40:55.066', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (391, 342, 1, 'baseline', 'language', 'story', NULL, '2025-10-15 12:41:01.139', 100, true, false, NULL, '2025-10-15 12:41:25.082', '2025-10-15 12:41:25.082', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (392, 341, 1, 'baseline', 'language', 'story', NULL, '2025-10-15 12:41:30.932', 100, true, false, NULL, '2025-10-15 12:42:01.443', '2025-10-15 12:42:01.443', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (393, 340, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:42:20.63', 100, true, false, NULL, '2025-10-15 12:42:48.062', '2025-10-15 12:42:48.062', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (394, 339, 1, 'baseline', 'language', 'story', NULL, '2025-10-15 12:42:53.29', 100, true, false, NULL, '2025-10-15 12:43:24.411', '2025-10-15 12:43:24.411', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (395, 338, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:43:30.568', 100, true, false, NULL, '2025-10-15 12:44:23.553', '2025-10-15 12:44:23.553', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (396, 337, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:44:28.972', 100, true, true, NULL, '2025-10-15 12:45:03.049', '2025-10-15 12:45:03.049', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (397, 334, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:45:05.976', 100, true, true, NULL, '2025-10-15 12:45:36.203', '2025-10-15 12:45:36.203', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (398, 333, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:45:39.248', 100, true, true, NULL, '2025-10-15 12:45:59.961', '2025-10-15 12:45:59.961', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (399, 332, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-15 12:46:03.168', 100, true, true, NULL, '2025-10-15 12:46:30.43', '2025-10-15 12:46:30.43', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (400, 331, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:46:36.341', 100, true, false, NULL, '2025-10-15 12:47:08.192', '2025-10-15 12:47:08.192', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (401, 330, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:47:12.626', 100, true, true, NULL, '2025-10-15 12:47:41.288', '2025-10-15 12:47:41.288', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (402, 329, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:47:45.486', 100, true, true, NULL, '2025-10-15 12:48:06.556', '2025-10-15 12:48:06.556', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (403, 328, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:48:10.728', 100, true, true, NULL, '2025-10-15 12:48:39.209', '2025-10-15 12:48:39.209', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (404, 327, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:48:41.858', 100, true, true, NULL, '2025-10-15 12:49:02.696', '2025-10-15 12:49:02.696', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (405, 326, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:49:12.701', 100, true, true, NULL, '2025-10-15 12:49:33.324', '2025-10-15 12:49:33.324', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (406, 325, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-15 12:49:36.448', 100, true, true, NULL, '2025-10-15 12:50:04.601', '2025-10-15 12:50:04.601', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (407, 312, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-15 12:50:07.501', 100, true, true, NULL, '2025-10-15 12:53:04.712', '2025-10-15 12:53:04.712', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (408, 320, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-15 12:53:14.415', 100, true, true, NULL, '2025-10-15 12:54:22.782', '2025-10-15 12:54:22.782', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (409, 324, 1, 'baseline', 'language', 'comprehension2', NULL, '2025-10-15 12:54:29.114', 100, true, true, NULL, '2025-10-15 12:54:55.214', '2025-10-15 12:54:55.214', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (410, 323, 1, 'baseline', 'language', 'comprehension1', NULL, '2025-10-15 12:54:58.196', 100, true, true, NULL, '2025-10-15 12:55:29.086', '2025-10-15 12:55:29.086', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (411, 309, 1, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:20:05.462', '2025-10-17 00:20:05.462', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (412, 330, 1, 'endline', 'language', 'comprehension2', NULL, '2025-10-17 00:21:15.923', 100, true, false, NULL, '2025-10-17 00:23:48.223', '2025-10-17 00:23:48.223', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (413, 308, 1, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:25:35.215', '2025-10-17 00:25:35.215', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (414, 307, 1, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:28:13.231', '2025-10-17 00:28:13.231', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (415, 332, 1, 'endline', 'language', 'comprehension2', NULL, '2025-10-17 00:28:52.603', 100, true, false, NULL, '2025-10-17 00:29:12.522', '2025-10-17 00:29:12.522', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (416, 306, 1, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:31:50.787', '2025-10-17 00:31:50.787', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (417, 339, 1, 'endline', 'language', 'comprehension1', NULL, '2025-10-17 00:30:45.39', 100, true, false, NULL, '2025-10-17 00:33:14.086', '2025-10-17 00:33:14.086', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (418, 305, 1, 'endline', 'math', 'subtraction', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:34:37.668', '2025-10-17 00:34:37.668', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (419, 297, 1, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:36:32.289', '2025-10-17 00:36:32.289', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (420, 312, 1, 'endline', 'language', 'comprehension2', NULL, '2025-10-17 00:37:58.467', 100, true, false, NULL, '2025-10-17 00:38:42.727', '2025-10-17 00:38:42.727', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (421, 296, 1, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 00:38:56.062', '2025-10-17 00:38:56.062', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (422, 138, 1, 'endline', 'language', 'comprehension2', NULL, '2025-10-17 00:51:01.009', 100, true, false, NULL, '2025-10-17 00:53:15.878', '2025-10-17 00:53:15.878', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (423, 183, 1, 'endline', 'language', 'comprehension1', NULL, '2025-10-17 00:59:41.731', 100, true, false, NULL, '2025-10-17 01:00:23.41', '2025-10-17 01:00:23.41', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (424, 187, 1, 'endline', 'language', 'story', NULL, '2025-10-17 01:00:31.661', 100, true, true, NULL, '2025-10-17 01:02:11.652', '2025-10-17 01:02:11.652', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (425, 143, 1, 'endline', 'language', 'comprehension1', NULL, '2025-10-17 01:03:08.936', 100, true, false, NULL, '2025-10-17 01:05:43.535', '2025-10-17 01:05:43.535', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (426, 144, 1, 'endline', 'language', 'story', NULL, '2025-10-17 01:07:14.876', 100, true, false, NULL, '2025-10-17 01:09:24.053', '2025-10-17 01:09:24.053', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (427, 295, 1, 'endline', 'math', 'division', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 01:28:00.167', '2025-10-17 01:28:00.167', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (428, 294, 1, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 01:31:24.131', '2025-10-17 01:31:24.131', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (429, 293, 1, 'endline', 'math', 'word_problems', 'បានធ្វើតេស្ត', '2025-10-09 17:00:00', 101, true, false, NULL, '2025-10-17 01:39:21.052', '2025-10-17 01:39:21.052', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (430, 381, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:07:40.717', '2025-10-17 02:07:40.717', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (431, 380, 39, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:08:46.884', '2025-10-17 02:08:46.884', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (432, 379, 39, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:09:40.325', '2025-10-17 02:09:40.325', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (433, 378, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:10:49.569', '2025-10-17 02:10:49.569', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (434, 377, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:12:24.553', '2025-10-17 02:12:24.553', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (435, 376, 39, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:14:00.153', '2025-10-17 02:14:00.153', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (436, 375, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:15:07.377', '2025-10-17 02:15:07.377', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (437, 374, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:19:33.851', '2025-10-17 02:19:33.851', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (438, 373, 39, 'baseline', 'math', 'subtraction', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:21:02.523', '2025-10-17 02:21:02.523', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (439, 372, 39, 'baseline', 'math', 'number_2digit', NULL, '2025-09-28 17:00:00', 12, true, false, NULL, '2025-10-17 02:22:16.069', '2025-10-17 02:22:16.069', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (440, 372, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:23:22.337', '2025-10-17 02:23:22.337', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (441, 373, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:24:48.975', '2025-10-17 02:24:48.975', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (442, 374, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:25:38.326', '2025-10-17 02:25:38.326', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (443, 376, 39, 'endline', 'math', 'number_2digit', 'សិស្សមានការភ្លេចច្រើន', '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:27:05.057', '2025-10-17 02:27:05.057', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (444, 381, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:29:47.378', '2025-10-17 02:29:47.378', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (445, 380, 39, 'endline', 'math', 'number_2digit', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:30:33.372', '2025-10-17 02:30:33.372', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (446, 379, 39, 'endline', 'math', 'division', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:31:48.078', '2025-10-17 02:31:48.078', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (447, 378, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:32:49.601', '2025-10-17 02:32:49.601', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (448, 377, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-17 02:33:35.891', '2025-10-17 02:33:35.891', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (449, 27, 23, 'endline', 'language', 'story', NULL, '2025-10-09 17:00:00', 98, false, false, NULL, '2025-10-17 03:19:40.521', '2025-10-17 03:19:40.521', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (450, 375, 39, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 12, true, false, NULL, '2025-10-18 04:45:03.456', '2025-10-18 04:45:03.456', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (451, 26, 23, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 07:55:21.507', '2025-10-18 07:55:21.507', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (452, 25, 23, 'endline', 'math', 'word_problems', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 07:56:16.302', '2025-10-18 07:56:16.302', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (453, 24, 23, 'endline', 'language', 'comprehension2', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 07:57:35.443', '2025-10-18 07:57:35.443', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (454, 21, 23, 'endline', 'language', 'comprehension2', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 07:59:17.188', '2025-10-18 07:59:17.188', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (468, 392, 6, 'baseline', 'language', 'word', 'test', '2025-10-30 10:47:39.932', 7, false, false, NULL, '2025-10-30 10:47:57.013', '2025-10-31 09:35:33.944', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', 7, '2025-10-31 09:35:33.943', 'Bulk verification', false, NULL, NULL);
INSERT INTO public.assessments VALUES (478, 399, 25, 'baseline', 'language', 'word', NULL, '2025-11-16 17:00:00', 69, false, false, NULL, '2025-11-01 06:51:41.725', '2025-11-01 06:51:41.725', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (486, 407, 21, 'midline', 'language', 'story', NULL, '2025-12-30 17:00:00', 66, false, false, NULL, '2025-11-01 07:34:35.311', '2025-11-01 07:34:35.311', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (492, 437, 4, 'baseline', 'language', 'paragraph', 'test', '2025-11-08 15:44:03.461', 4, false, false, NULL, '2025-11-08 15:45:03.318', '2025-11-08 15:49:10.358', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', 4, '2025-11-08 15:49:10.357', 'Verified by mentor assessment #493', false, NULL, NULL);
INSERT INTO public.assessments VALUES (455, 23, 23, 'endline', 'language', 'comprehension2', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 08:00:52.602', '2025-10-18 08:00:52.602', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (456, 22, 23, 'endline', 'language', 'comprehension2', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 08:01:39.822', '2025-10-18 08:01:39.822', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (457, 20, 23, 'endline', 'language', 'story', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 08:03:09.391', '2025-10-18 08:03:09.391', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (476, 392, 6, 'baseline_verification', 'math', 'division', 'fdfd', '2025-10-31 09:10:03.413', 7, false, true, '469', '2025-10-31 09:10:12.894', '2025-10-31 09:10:12.894', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (469, 392, 6, 'baseline', 'math', 'number_2digit', 'test', '2025-10-30 10:49:19.152', 7, false, false, NULL, '2025-10-30 11:01:56.704', '2025-10-31 09:35:33.944', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', 7, '2025-10-31 09:35:33.943', 'Bulk verification', false, NULL, NULL);
INSERT INTO public.assessments VALUES (479, 398, 25, 'baseline', 'language', 'story', NULL, '2025-11-16 17:00:00', 69, false, false, NULL, '2025-11-01 06:53:14.958', '2025-11-01 06:53:14.958', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (480, 399, 25, 'midline', 'language', 'paragraph', NULL, '2025-12-30 17:00:00', 69, false, false, NULL, '2025-11-01 06:56:49.711', '2025-11-01 06:56:49.711', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (487, 409, 25, 'baseline', 'language', 'story', NULL, '2025-11-16 17:00:00', 69, false, false, NULL, '2025-11-01 07:37:10.595', '2025-11-01 07:37:10.595', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (489, 408, 26, 'baseline', 'math', 'subtraction', NULL, '2025-11-16 17:00:00', 82, false, false, NULL, '2025-11-01 07:39:12.416', '2025-11-01 07:39:12.416', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (493, 437, 4, 'baseline_verification', 'language', 'comprehension1', 'test verify', '2025-11-08 15:47:52.819', 4, false, true, '492', '2025-11-08 15:49:07.045', '2025-11-08 15:49:07.045', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (458, 19, 23, 'endline', 'language', 'comprehension2', NULL, '2025-10-09 17:00:00', 15, true, false, NULL, '2025-10-18 08:04:13', '2025-10-18 08:04:13', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (459, 18, 23, 'midline', 'language', 'comprehension2', NULL, '2025-10-03 00:00:00', 15, true, false, NULL, '2025-10-18 08:07:17.11', '2025-10-18 08:09:26.651', 'mentor', 'test_mentor', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (477, 392, 6, 'baseline_verification', 'language', 'comprehension1', 'https://tarl.openplp.com/assessments/create?verificationMode=true&originalAssessmentId=468&studentId=392&studentName=sovath-sovath&assessmentType=baseline&subject=language', '2025-10-31 09:10:31.002', 7, false, true, '468', '2025-10-31 09:10:46.826', '2025-10-31 09:10:46.826', 'mentor', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (481, 399, 25, 'endline', 'language', 'comprehension1', NULL, '2026-02-01 17:00:00', 69, false, false, NULL, '2025-11-01 06:59:17.465', '2025-11-01 06:59:17.465', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ៣', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (488, 403, 24, 'baseline', 'language', 'letter', NULL, '2025-11-16 17:00:00', 85, false, false, NULL, '2025-11-01 07:37:37.361', '2025-11-01 07:37:37.361', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (482, 400, 25, 'baseline', 'language', 'word', NULL, '2025-11-16 17:00:00', 69, false, false, NULL, '2025-11-01 07:27:30.942', '2025-11-01 07:27:30.942', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (483, 405, 25, 'baseline', 'language', 'letter', NULL, '2025-11-16 17:00:00', 69, false, false, NULL, '2025-11-01 07:31:51.793', '2025-11-01 07:31:51.793', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (490, 413, 2, 'baseline', 'math', 'subtraction', NULL, '2025-11-16 17:00:00', 54, false, false, NULL, '2025-11-01 07:41:29.863', '2025-11-01 07:41:29.863', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (484, 404, 24, 'baseline', 'language', 'paragraph', NULL, '2025-11-16 17:00:00', 85, false, false, NULL, '2025-11-01 07:31:57.334', '2025-11-01 07:31:57.334', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (485, 407, 21, 'baseline', 'language', 'word', NULL, '2025-11-16 17:00:00', 66, false, false, NULL, '2025-11-01 07:32:38.367', '2025-11-01 07:32:38.367', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ១', 'Yes', NULL, NULL, NULL, false, NULL, NULL);
INSERT INTO public.assessments VALUES (491, 407, 21, 'endline', 'language', 'comprehension2', NULL, '2026-02-01 17:00:00', 66, false, false, NULL, '2025-11-01 07:43:14.268', '2025-11-01 07:43:14.268', 'teacher', 'production', NULL, 'ឧបករណ៍តេស្ត លេខ២', 'Yes', NULL, NULL, NULL, false, NULL, NULL);


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: bulk_imports; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: dashboard_stats; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.dashboard_stats VALUES (3, 'global', 'coordinator', NULL, 45, 292, 69, 23, 443, 266, 47, 130, 221, 222, '{"by_level": [{"math": 0, "khmer": 14, "level": "word"}, {"math": 0, "khmer": 6, "level": "beginner"}, {"math": 0, "khmer": 40, "level": "story"}, {"math": 0, "khmer": 47, "level": "paragraph"}, {"math": 0, "khmer": 89, "level": "comprehension2"}, {"math": 0, "khmer": 8, "level": "letter"}, {"math": 58, "khmer": 0, "level": "word_problems"}, {"math": 56, "khmer": 0, "level": "division"}, {"math": 40, "khmer": 0, "level": "number_2digit"}, {"math": 51, "khmer": 0, "level": "subtraction"}, {"math": 0, "khmer": 32, "level": "comprehension1"}, {"math": 2, "khmer": 0, "level": "number_1digit"}], "overall_results_math": [{"cycle": "baseline", "levels": {"division": 21, "subtraction": 31, "number_1digit": 2, "number_2digit": 36, "word_problems": 16}}, {"cycle": "midline", "levels": {"division": 5, "subtraction": 9, "word_problems": 5}}, {"cycle": "endline", "levels": {"division": 30, "subtraction": 11, "number_2digit": 4, "word_problems": 37}}], "overall_results_khmer": [{"cycle": "baseline", "levels": {"word": 10, "story": 24, "letter": 7, "beginner": 6, "paragraph": 43, "comprehension1": 12, "comprehension2": 58}}, {"cycle": "midline", "levels": {"word": 1, "story": 6, "letter": 1, "paragraph": 4, "comprehension1": 10, "comprehension2": 6}}, {"cycle": "endline", "levels": {"word": 3, "story": 10, "comprehension1": 10, "comprehension2": 25}}]}', '2025-10-18 08:46:18.216', '2025-10-18 08:46:18.216');


--
-- Data for Name: intervention_programs; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: ip_whitelist; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: mentor_school_assignments; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.mentor_school_assignments VALUES (3, 97, 17, 'Language', 3, '2025-10-13 08:23:21.866', true, NULL, '2025-10-13 08:23:21.866', '2025-10-13 08:23:21.866');
INSERT INTO public.mentor_school_assignments VALUES (5, 12, 42, 'Language', 12, '2025-10-14 08:05:37.445', true, 'Auto-created from profile setup', '2025-10-14 08:05:37.445', '2025-10-14 08:05:37.445');
INSERT INTO public.mentor_school_assignments VALUES (6, 9, 35, 'Math', 9, '2025-10-14 08:07:22.618', true, 'Auto-created from profile setup', '2025-10-14 08:07:22.618', '2025-10-14 08:07:22.618');
INSERT INTO public.mentor_school_assignments VALUES (7, 20, 34, 'Language', 20, '2025-10-14 11:25:47.728', true, 'Auto-created from profile setup', '2025-10-14 11:25:47.728', '2025-10-14 11:25:47.728');
INSERT INTO public.mentor_school_assignments VALUES (9, 12, 39, 'Language', 12, '2025-10-15 01:41:46.141', true, 'Auto-created from profile setup', '2025-10-15 01:41:46.141', '2025-10-15 01:41:46.141');
INSERT INTO public.mentor_school_assignments VALUES (10, 12, 42, 'Math', 12, '2025-10-15 01:42:37.216', true, 'Auto-created from profile setup', '2025-10-15 01:42:37.216', '2025-10-15 01:42:37.216');
INSERT INTO public.mentor_school_assignments VALUES (11, 12, 39, 'Math', 12, '2025-10-16 08:56:49.461', true, 'Auto-created from profile setup', '2025-10-16 08:56:49.461', '2025-10-16 08:56:49.461');
INSERT INTO public.mentor_school_assignments VALUES (12, 101, 1, 'Math', 101, '2025-10-17 00:09:33.887', true, 'Auto-created from profile setup', '2025-10-17 00:09:33.887', '2025-10-17 00:09:33.887');
INSERT INTO public.mentor_school_assignments VALUES (13, 15, 23, 'Language', 15, '2025-10-17 02:41:24.788', true, 'Auto-created from profile setup', '2025-10-17 02:41:24.788', '2025-10-17 02:41:24.788');
INSERT INTO public.mentor_school_assignments VALUES (14, 94, 17, 'Math', 3, '2025-10-17 03:39:11.062', true, 'sovath entry', '2025-10-17 03:39:11.062', '2025-10-17 03:39:11.062');
INSERT INTO public.mentor_school_assignments VALUES (15, 21, 2, 'Language', 3, '2025-10-17 03:43:53.17', true, NULL, '2025-10-17 03:43:53.17', '2025-10-17 03:43:53.17');
INSERT INTO public.mentor_school_assignments VALUES (16, 21, 3, 'Language', 3, '2025-10-17 03:43:57.532', true, NULL, '2025-10-17 03:43:57.532', '2025-10-17 03:43:57.532');
INSERT INTO public.mentor_school_assignments VALUES (17, 100, 1, 'Language', 3, '2025-10-18 12:25:31.134', true, NULL, '2025-10-18 12:25:31.134', '2025-10-18 12:25:31.134');
INSERT INTO public.mentor_school_assignments VALUES (18, 4, 4, 'Language', 3, '2025-10-18 12:29:00.231', true, NULL, '2025-10-18 12:29:00.231', '2025-10-18 12:29:00.231');
INSERT INTO public.mentor_school_assignments VALUES (19, 4, 5, 'Language', 3, '2025-10-18 12:29:04.357', true, NULL, '2025-10-18 12:29:04.357', '2025-10-18 12:29:04.357');
INSERT INTO public.mentor_school_assignments VALUES (20, 11, 7, 'Language', 3, '2025-10-18 12:31:52.782', true, NULL, '2025-10-18 12:31:52.782', '2025-10-18 12:31:52.782');
INSERT INTO public.mentor_school_assignments VALUES (21, 11, 8, 'Language', 3, '2025-10-18 12:31:55.824', true, NULL, '2025-10-18 12:31:55.824', '2025-10-18 12:31:55.824');
INSERT INTO public.mentor_school_assignments VALUES (22, 5, 9, 'Math', 3, '2025-10-18 12:32:55.515', true, NULL, '2025-10-18 12:32:55.515', '2025-10-18 12:32:55.515');
INSERT INTO public.mentor_school_assignments VALUES (23, 5, 10, 'Math', 3, '2025-10-18 12:32:58.659', true, NULL, '2025-10-18 12:32:58.659', '2025-10-18 12:32:58.659');
INSERT INTO public.mentor_school_assignments VALUES (24, 14, 11, 'Math', 3, '2025-10-18 12:34:16.45', true, NULL, '2025-10-18 12:34:16.45', '2025-10-18 12:34:16.45');
INSERT INTO public.mentor_school_assignments VALUES (25, 14, 12, 'Math', 3, '2025-10-18 12:34:20.562', true, NULL, '2025-10-18 12:34:20.562', '2025-10-18 12:34:20.562');
INSERT INTO public.mentor_school_assignments VALUES (26, 13, 13, 'Math', 3, '2025-10-18 12:35:59.251', true, NULL, '2025-10-18 12:35:59.251', '2025-10-18 12:35:59.251');
INSERT INTO public.mentor_school_assignments VALUES (27, 13, 14, 'Math', 3, '2025-10-18 12:36:02.4', true, NULL, '2025-10-18 12:36:02.4', '2025-10-18 12:36:02.4');
INSERT INTO public.mentor_school_assignments VALUES (28, 13, 15, 'Math', 3, '2025-10-18 12:36:05.575', true, NULL, '2025-10-18 12:36:05.575', '2025-10-18 12:36:05.575');
INSERT INTO public.mentor_school_assignments VALUES (29, 13, 16, 'Math', 3, '2025-10-18 12:36:08.79', true, NULL, '2025-10-18 12:36:08.79', '2025-10-18 12:36:08.79');
INSERT INTO public.mentor_school_assignments VALUES (30, 16, 18, 'Language', 3, '2025-10-18 12:38:22.881', true, NULL, '2025-10-18 12:38:22.881', '2025-10-18 12:38:22.881');
INSERT INTO public.mentor_school_assignments VALUES (31, 16, 19, 'Language', 3, '2025-10-18 12:38:25.919', true, NULL, '2025-10-18 12:38:25.919', '2025-10-18 12:38:25.919');
INSERT INTO public.mentor_school_assignments VALUES (32, 16, 20, 'Language', 3, '2025-10-18 12:38:28.961', true, NULL, '2025-10-18 12:38:28.961', '2025-10-18 12:38:28.961');
INSERT INTO public.mentor_school_assignments VALUES (33, 19, 21, 'Language', 3, '2025-10-18 12:39:27.485', true, NULL, '2025-10-18 12:39:27.485', '2025-10-18 12:39:27.485');
INSERT INTO public.mentor_school_assignments VALUES (34, 19, 22, 'Language', 3, '2025-10-18 12:39:31.664', true, NULL, '2025-10-18 12:39:31.664', '2025-10-18 12:39:31.664');
INSERT INTO public.mentor_school_assignments VALUES (35, 15, 24, 'Language', 3, '2025-10-18 12:40:33.458', true, NULL, '2025-10-18 12:40:33.458', '2025-10-18 12:40:33.458');
INSERT INTO public.mentor_school_assignments VALUES (36, 15, 25, 'Language', 3, '2025-10-18 12:40:36.513', true, NULL, '2025-10-18 12:40:36.513', '2025-10-18 12:40:36.513');
INSERT INTO public.mentor_school_assignments VALUES (37, 17, 26, 'Math', 3, '2025-10-18 12:41:35.821', true, NULL, '2025-10-18 12:41:35.821', '2025-10-18 12:41:35.821');
INSERT INTO public.mentor_school_assignments VALUES (38, 17, 27, 'Math', 3, '2025-10-18 12:41:39.93', true, NULL, '2025-10-18 12:41:39.93', '2025-10-18 12:41:39.93');
INSERT INTO public.mentor_school_assignments VALUES (39, 12, 28, 'Math', 3, '2025-10-18 12:42:38.121', true, NULL, '2025-10-18 12:42:38.121', '2025-10-18 12:42:38.121');
INSERT INTO public.mentor_school_assignments VALUES (40, 12, 29, 'Math', 3, '2025-10-18 12:42:41.371', true, NULL, '2025-10-18 12:42:41.371', '2025-10-18 12:42:41.371');
INSERT INTO public.mentor_school_assignments VALUES (41, 12, 30, 'Math', 3, '2025-10-18 12:42:44.683', true, NULL, '2025-10-18 12:42:44.683', '2025-10-18 12:42:44.683');
INSERT INTO public.mentor_school_assignments VALUES (42, 6, 31, 'Math', 3, '2025-10-18 12:43:30.431', true, NULL, '2025-10-18 12:43:30.431', '2025-10-18 12:43:30.431');
INSERT INTO public.mentor_school_assignments VALUES (43, 6, 32, 'Math', 3, '2025-10-18 12:43:33.734', true, NULL, '2025-10-18 12:43:33.734', '2025-10-18 12:43:33.734');
INSERT INTO public.mentor_school_assignments VALUES (44, 4, 6, 'Language', 3, '2025-10-18 12:49:59.801', true, NULL, '2025-10-18 12:49:59.801', '2025-10-18 12:49:59.801');
INSERT INTO public.mentor_school_assignments VALUES (45, 7, 33, 'Language', 3, '2025-10-20 04:32:25.938', true, 'test', '2025-10-20 04:32:25.938', '2025-10-20 04:32:25.938');
INSERT INTO public.mentor_school_assignments VALUES (46, 7, 6, 'Language', 7, '2025-10-30 05:31:54.891', true, 'Self-assigned by mentor', '2025-10-30 05:31:54.891', '2025-10-30 05:31:54.891');
INSERT INTO public.mentor_school_assignments VALUES (47, 10, 37, 'Language', 3, '2025-11-05 05:20:50.319', true, 'តេសត', '2025-11-05 05:20:50.319', '2025-11-05 05:20:50.319');
INSERT INTO public.mentor_school_assignments VALUES (48, 10, 37, 'Math', 3, '2025-11-05 05:20:54.408', true, 'តេសត', '2025-11-05 05:20:54.408', '2025-11-05 05:20:54.408');
INSERT INTO public.mentor_school_assignments VALUES (49, 17, 45, 'Math', 3, '2025-11-06 07:38:14.481', true, NULL, '2025-11-06 07:38:14.481', '2025-11-06 07:38:14.481');


--
-- Data for Name: mentoring_visits; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.mentoring_visits VALUES (1, 7, 33, '2025-10-20 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, 'scheduled', '2025-10-20 18:38:04.998', '2025-10-20 18:38:04.998', NULL, NULL, true, false, 12, true, NULL, NULL, 'ចំនួនដោយប្រើបាច់ឈើនិងឈើ', NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, true, NULL, NULL, 'ការអានChartលេខ', NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, NULL, NULL, 'ល្បែងលោតលើលេខ', NULL, NULL, NULL, true, true, NULL, true, NULL, 12, NULL, NULL, NULL, false, NULL, false, true, NULL, '["ទី៤"]', false, false, NULL, NULL, NULL, NULL, NULL, '["Chartលេខ ០-៩៩","បណ្ណតម្លៃលេខតាមខ្ទង់","Chartដកលេខដោយផ្ទាល់មាត់","Chartបូកលេខដោយផ្ទាល់មាត់","Chartតម្លៃលេខតាមខ្ទង់","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ"]', NULL, NULL, NULL, NULL, NULL, 3, '["កម្រិតដំបូង","លេខ២ខ្ទង់","ប្រមាណវិធីដក"]', NULL, NULL, NULL, 'TaRL', NULL, NULL, NULL, NULL, NULL, false, false, true, false, NULL, 12, 12, 'Math', 'tst', NULL, 96, NULL, 12, NULL, NULL, false, 'production', NULL);
INSERT INTO public.mentoring_visits VALUES (2, 7, 33, '2025-10-21 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, 'scheduled', '2025-10-21 07:51:55.086', '2025-10-21 07:51:55.086', NULL, NULL, true, false, 12, true, NULL, 'ការសន្ទនាសេរី', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, true, NULL, 'ល្បែងបោះចូលកន្ត្រក (បោះព្យញ្ជនៈ, ស្រៈ , ពាក្យ ចូលកន្ត្រក)', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, NULL, 'ការអានកថាខណ្ឌ', NULL, NULL, NULL, NULL, true, true, NULL, true, NULL, 12, NULL, NULL, NULL, false, NULL, true, true, NULL, '["ទី៤"]', true, false, '["កម្រិតដំបូង","តួអក្សរ","ពាក្យ"]', NULL, 'test', NULL, NULL, '["Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","ការតម្រៀបល្បះ និងកូនសៀវភៅកែតម្រូវកំហុស","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)","Chartបូកលេខដោយផ្ទាល់មាត់","បណ្ណពាក្យ/បណ្ណព្យាង្គ","Chartគុណលេខដោយផ្ទាល់មាត់"]', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, 'TaRL', NULL, NULL, NULL, NULL, NULL, true, false, true, false, NULL, 12, 12, 'Khmer', 'test', NULL, 96, NULL, 12, NULL, NULL, false, 'production', NULL);
INSERT INTO public.mentoring_visits VALUES (3, 7, 33, '2025-10-31 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, 'scheduled', '2025-10-31 10:09:52.529', '2025-10-31 14:15:41.449', NULL, NULL, true, false, 12, true, NULL, 'ការពណ៌នារូបភាព', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, true, NULL, 'ល្បែងត្រឡប់បណ្ណពាក្យ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, true, NULL, 12, NULL, NULL, NULL, false, NULL, false, true, NULL, '["ទី៤"]', true, false, '["តួអក្សរ","កថាខណ្ឌ","អត្ថបទខ្លី"]', NULL, 'test', NULL, NULL, '["Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា","Chartគុណលេខដោយផ្ទាល់មាត់"]', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, 'TaRL', NULL, NULL, NULL, NULL, NULL, false, false, true, false, NULL, 12, 12, 'Khmer', 'មតិយោបល់សម្រាប់គ្រូបង្រៀន (ប្រសិនបើមាន) (១០០-១២០ ពាក្យ)', NULL, 95, NULL, 12, NULL, NULL, false, 'production', NULL);
INSERT INTO public.mentoring_visits VALUES (4, 10, 37, '2025-11-05 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, 'scheduled', '2025-11-05 05:53:58.391', '2025-11-05 05:53:58.391', NULL, NULL, true, false, 12, true, NULL, 'ការអានកថាខណ្ឌ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 12, true, NULL, 'ល្បែងត្រឡប់បណ្ណពាក្យ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, NULL, true, NULL, 12, NULL, NULL, NULL, false, NULL, true, true, NULL, '["ទី៤"]', true, false, '["កម្រិតដំបូង","តួអក្សរ","ពាក្យ","កថាខណ្ឌ"]', NULL, 'sdfdsf', NULL, NULL, '["Chartលេខ ០-៩៩","Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)","Chartគុណលេខដោយផ្ទាល់មាត់","Chartបូកលេខដោយផ្ទាល់មាត់"]', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, 'TaRL', NULL, NULL, NULL, NULL, NULL, true, false, true, false, NULL, 12, 12, 'Khmer', 'sdfdsf', NULL, 99, NULL, 12, NULL, NULL, false, 'production', NULL);
INSERT INTO public.mentoring_visits VALUES (5, 4, 4, '2025-11-08 00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 'null', NULL, NULL, 'scheduled', '2025-11-08 15:55:27.414', '2025-11-08 15:55:27.414', NULL, NULL, true, false, 5, true, NULL, 'ការសន្ទនាសេរី', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 5, true, NULL, 'ការអានកថាខណ្ឌ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 15, NULL, 'ការចម្លងនិងសរសេរតាមអាន', NULL, NULL, NULL, NULL, true, true, NULL, true, NULL, 2, NULL, NULL, NULL, false, NULL, true, true, NULL, '["ទី៤"]', true, false, '["កម្រិតដំបូង","ពាក្យ","កថាខណ្ឌ","តួអក្សរ"]', NULL, 'test', NULL, NULL, '["លេខ ០-៩៩","ដកលេខដោយផ្ទាល់មាត់","ទុយោ","គុណលេខដោយផ្ទាល់មាត់","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)"]', NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, 'TaRL', NULL, NULL, NULL, NULL, NULL, true, false, true, false, NULL, 2, 2, 'Khmer', 'test', NULL, 47, NULL, 30, NULL, NULL, false, 'production', NULL);


--
-- Data for Name: pilot_schools; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.pilot_schools VALUES (19, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងស្តៅលើអ្នកចុះគាំទ្រ', 'សាលាបឋមសិក្សាស្តៅ', 'KAM_SDA_841', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:37', '2025-10-21 07:29:35.033', false);
INSERT INTO public.pilot_schools VALUES (16, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងភ្ជាវចុះគាំទ្រ', 'សាលាបឋមសិក្សារកាភីង', 'BAT_ROK_614', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:32', '2025-10-21 07:36:53.29', false);
INSERT INTO public.pilot_schools VALUES (24, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកលីវចុះគាំទ្រ', 'សាលាបឋមសិក្សាស្វាយស្រណោះ', 'KAM_SVA_757', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:43', '2025-10-21 07:38:29.287', false);
INSERT INTO public.pilot_schools VALUES (15, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងភ្ជាវចុះគាំទ្រ', 'សាលាបឋមសិក្សាតាគ្រក់', 'BAT_TAK_691', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:31', '2025-10-21 07:41:26.645', false);
INSERT INTO public.pilot_schools VALUES (13, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងភ្ជាវចុះគាំទ្រ', 'សាលាបឋមសិក្សាភ្ជាវ', 'BAT_PCH_569', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:29', '2025-10-21 07:43:19.842', false);
INSERT INTO public.pilot_schools VALUES (11, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងព្រៃអំពេរចុះគាំទ្រ', 'សាលាបឋមសិក្សាសីនតុ', 'BAT_SIN_290', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:26', '2025-10-21 07:45:49.296', false);
INSERT INTO public.pilot_schools VALUES (9, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងបឹងខ្ទុមចុះគាំទ្រ', 'សាលាបឋមសិក្សាបឹងខ្ទុម', 'BAT_BEU_872', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:23', '2025-10-21 07:49:39.855', false);
INSERT INTO public.pilot_schools VALUES (7, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងស្តៅចុះគាំទ្រ', 'សាលាបឋមសិក្សាបឹងអំពិល', 'BAT_BEU_882', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:20', '2025-10-21 07:52:28.956', false);
INSERT INTO public.pilot_schools VALUES (5, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងត្រែងចុះគាំទ្រ', 'សាលាបឋមសិក្សាត្រែង', 'BAT_TRE_344', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:18', '2025-10-21 07:55:43.065', false);
INSERT INTO public.pilot_schools VALUES (3, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងបាដាកចុះគាំទ្រ', 'បឋមសិក្សាបាដាក', 'BAT_BAD_335', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:15', '2025-10-21 07:58:04.447', false);
INSERT INTO public.pilot_schools VALUES (45, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកកុយចុះគាំទ្រ', 'បឋមសិក្សាព្រែកកុយ', 'កំព014718', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-14 04:26:55.8', '2025-10-21 08:04:30.036', false);
INSERT INTO public.pilot_schools VALUES (43, 'កំពង់ចាម', 'កងមាស', NULL, 'សាលាMentorដែលចុះអនុវត្តជាមួយសិស្ស (មិនមែនសាលាគោលដៅ)', 'សាលាបឋមសិក្សាគងជ័យ', 'កំព837368', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-13 07:00:38.403', '2025-10-21 08:06:13.331', false);
INSERT INTO public.pilot_schools VALUES (37, 'បាត់ដំបង', 'បាត់តំបង', NULL, 'សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាអូរតាគាំ១ (Mentor សាលល្បង)', '340946', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-10-09 04:15:42.013', '2025-10-21 08:10:25.824', false);
INSERT INTO public.pilot_schools VALUES (41, 'កំពង់ចាម', 'កងមាស', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាគងជ័យ( Mentor សាកល្បង)', 'កំព675304', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:37:56.378', '2025-10-21 08:11:52.692', false);
INSERT INTO public.pilot_schools VALUES (40, 'កំពង់ចាម', 'កងមាស', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាស្តៅលើ (Mentor សាកល្បង)', 'កំព646150', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:37:29.05', '2025-10-21 08:12:25.866', false);
INSERT INTO public.pilot_schools VALUES (34, 'កំពង់ចាម', 'កំពង់ចាម', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាបឹងកុក (POE សាកល្បង) កំពង់ចាម', 'កំព029213', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-10-08 06:30:30.286', '2025-10-21 08:13:35.872', false);
INSERT INTO public.pilot_schools VALUES (33, 'កំពង់ចាម', 'កំពង់ចាម', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'សាលាសាលល្បងចុះទិន្ន័យរបស៉ Mentor PTTC', 'DEMO001', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-16 00:15:08', '2025-10-21 08:14:56.385', false);
INSERT INTO public.pilot_schools VALUES (31, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងរាយប៉ាយចុះគាំទ្រ', 'សាលាបឋមសិក្សាទួលវិហារ', 'KAM_TOU_631', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:53', '2025-10-21 08:16:50.65', false);
INSERT INTO public.pilot_schools VALUES (30, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងអង្គរបានចុះគាំទ្រ', 'សាលាបឋមសិក្សាសាខា១', 'KAM_SAK_402', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:51', '2025-10-21 08:17:22.713', false);
INSERT INTO public.pilot_schools VALUES (29, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងអង្គរបានចុះជួយគាំទ្រ', 'សាលាបឋមសិក្សាអន្ទង់ស', 'KAM_ANT_574', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:50', '2025-10-21 08:18:10.633', false);
INSERT INTO public.pilot_schools VALUES (26, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកកុយចុះជួយគាំទ្រ', 'សាលាបឋមសិក្សាអូរស្វាយ', 'KAM_OUS_666', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:47', '2025-10-21 08:21:44.762', false);
INSERT INTO public.pilot_schools VALUES (21, 'កំពង់ចាម', 'កងមាស', NULL, 'អ្នកគ្រូ សុជាតា DOE ចុះជួយគាំទ្រ', 'សាលាបឋមសិក្សាព្រែកតាឡោក', 'KAM_PRE_559', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:40', '2025-10-21 08:23:54.031', false);
INSERT INTO public.pilot_schools VALUES (22, 'កំពង់ចាម', 'កងមាស', NULL, 'អ្នកគ្រូ សុជាតា DOE ចុះជួយគាំទ្រ', 'សាលាបឋមសិក្សាទួលបី', 'KAM_TOU_569', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:41', '2025-10-21 08:24:34.959', false);
INSERT INTO public.pilot_schools VALUES (6, 'Battambang', 'Battambang', NULL, 'កម្រងត្រែងចុះគាំទ្រ', 'Raksmey Sangha PS', 'BAT_RAK_596', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:19', '2025-10-21 08:28:22.857', false);
INSERT INTO public.pilot_schools VALUES (1, 'បាត់ដំបង', 'បាត់ដំបង', NULL, 'លោកគ្រូ សែត សុជាតិ និង អ្នកគ្រូ សុន ណៃស៊ីមចុះគាំទ្រ', 'បឋមសិក្សាអនុវត្តន៍', 'BAT_ANO_832', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:11', '2025-10-21 08:29:43.119', false);
INSERT INTO public.pilot_schools VALUES (20, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងស្តៅលើអ្នកចុះគាំទ្រ', 'សាលាបឋមសិក្សាវត្តចាស់', 'KAM_WAT_774', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:38', '2025-10-21 07:27:34.401', false);
INSERT INTO public.pilot_schools VALUES (18, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងស្តៅលើអ្នកចុះគាំទ្រ', 'សាលាបឋមសិក្សាស្តៅលើ', 'KAM_SDA_609', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:36', '2025-10-21 07:31:09.198', false);
INSERT INTO public.pilot_schools VALUES (17, 'កំពង់ចាម', 'កំពង់ចា', NULL, 'លោកគ្រូបញ្ញា និង អ្មកគ្រូ សុម៉ាលីណា PTTC ចុះគាំទ្រ', 'សាលាបឋមសិក្សាវាលវង់ ', 'KAM_VEA_307', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:34', '2025-10-21 07:34:36.771', false);
INSERT INTO public.pilot_schools VALUES (23, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកលីវចុះគាំទ្រ', 'សាលាបឋមសិក្សាខ្ចៅ', 'KAM_KCH_793', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:42', '2025-10-21 07:39:17.641', false);
INSERT INTO public.pilot_schools VALUES (25, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកលីវចុះគាំទ្រ', 'សាលាបឋមសិក្សារកាអារ', 'KAM_ROK_564', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:45', '2025-10-21 07:40:03.136', false);
INSERT INTO public.pilot_schools VALUES (14, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងភ្ជាវចុះគាំទ្រ', 'សាលាបឋមសិក្សាជីសាង', 'BAT_CHI_242', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:30', '2025-10-21 07:42:24.02', false);
INSERT INTO public.pilot_schools VALUES (12, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងព្រៃអំពេរចុះគាំទ្រ', 'សាលាបឋមសិក្សាព្រៃអំពេរ', 'BAT_PRE_453', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:28', '2025-10-21 07:44:52.004', false);
INSERT INTO public.pilot_schools VALUES (10, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងបឹងខ្ទុមចុះគាំទ្រ', 'សាលាបឋមសិក្សាផ្លូវមាស ', 'BAT_PLO_314', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:25', '2025-10-21 07:48:56.827', false);
INSERT INTO public.pilot_schools VALUES (8, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងស្តៅចុះគាំទ្រ', 'សាលាបឋមសិក្សាអ៊ុីនសុីដារ៉េ ', 'BAT_INS_670', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:22', '2025-10-21 07:51:28.642', false);
INSERT INTO public.pilot_schools VALUES (4, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងត្រែងចុះគាំទ្រ', 'សាលាបឋមសិក្សាមាសពិទូគីឡូ៣៨ ', 'BAT_MEA_377', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:16', '2025-10-21 07:57:14.532', false);
INSERT INTO public.pilot_schools VALUES (2, 'បាត់ដំបង', 'រតនមណ្ឌល', NULL, 'កម្រងបាដាកចុះគាំទ្រ', 'សាលាបឋមសិក្សាពេជ្រចង្វា', 'BAT_PEC_497', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:14', '2025-10-21 08:00:26.548', false);
INSERT INTO public.pilot_schools VALUES (44, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងរាយប៉ាយចុះគាំទ្រ', 'សាលាបឋមសិក្សារាយប៉ាយ', 'កំព854437', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-13 07:00:55.847', '2025-10-21 08:05:06.843', false);
INSERT INTO public.pilot_schools VALUES (42, 'កំពង់ចាម', 'កងមាស', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាសំបួរមាស', 'កំព794439', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-13 06:59:55.512', '2025-10-21 08:07:10.867', false);
INSERT INTO public.pilot_schools VALUES (38, 'បាត់ដំបង', 'បាត់ដំបង', NULL, 'សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'សាលាបឋមសិក្សាក្តុលដូនទាវ', '252914', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:30:53.995', '2025-10-21 08:09:05.244', false);
INSERT INTO public.pilot_schools VALUES (36, 'កំពង់ចាម', 'កំពង់ចាម', NULL, 'សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាដីដុះ (BTEC សាកល្បង) កំពង់ចាម', '267727', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-10-08 06:34:28.263', '2025-10-21 08:11:00.745', false);
INSERT INTO public.pilot_schools VALUES (39, 'កំពង់ចាម', 'កងមាស', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'សំបួរមាស ( Mentor សាកល្បង)', 'កំព603674', NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-09 09:36:45.572', '2025-10-21 08:12:44.589', false);
INSERT INTO public.pilot_schools VALUES (35, 'កំពង់ចាម', 'គំពង់ចាម', NULL, 'សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ', 'បឋមសិក្សាបឹងស្នាយ (POE សាកល្បង)', 'កំព254119', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-10-08 06:34:15.197', '2025-10-21 08:13:12.126', false);
INSERT INTO public.pilot_schools VALUES (32, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងរាយប៉ាយចុះគាំទ្រ', 'សាលាបឋមសិក្សារាយប៉ាយ', 'KAM_REA_470', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:54', '2025-10-21 08:16:05.063', false);
INSERT INTO public.pilot_schools VALUES (28, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងអង្គរបាន ចុះជួយគាំទ្រ', 'សាលាឋបសិក្សាសាខា២', 'KAM_SAK_138', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:49', '2025-10-21 08:19:22.047', false);
INSERT INTO public.pilot_schools VALUES (27, 'កំពង់ចាម', 'កងមាស', NULL, 'កម្រងព្រែកកុយចុះជួយគាំទ្រ', 'សាលាបឋមសិក្សាព្រែកកុយ', 'KAM_PRE_826', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-10-05 00:00:00', '2025-12-06 00:00:00', '2025-09-28 00:00:00', '2025-11-08 00:00:00', '2025-09-10 19:05:48', '2025-10-21 08:21:00.157', false);


--
-- Data for Name: progress_trackings; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: quick_login_users; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.quick_login_users VALUES (8, 'kairav', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'admin', NULL, NULL, true, '2025-09-27 05:57:48.469', '2025-09-27 05:57:48.469', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (9, 'admin', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'admin', NULL, NULL, true, '2025-09-27 05:57:48.491', '2025-09-27 05:57:48.491', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (10, 'coordinator', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'coordinator', NULL, NULL, true, '2025-09-27 05:57:48.499', '2025-09-27 05:57:48.499', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (11, 'deab.chhoeun', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.507', '2025-09-27 05:57:48.507', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (12, 'heap.sophea', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.52', '2025-09-27 05:57:48.52', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (13, 'leang.chhun.hourth', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.527', '2025-09-27 05:57:48.527', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (14, 'mentor1', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.536', '2025-09-27 05:57:48.536', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (15, 'mentor2', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.557', '2025-09-27 05:57:48.557', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (16, 'chhorn.sopheak', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.564', '2025-09-27 05:57:48.564', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (17, 'em.rithy', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.572', '2025-09-27 05:57:48.572', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (18, 'nhim.sokha', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.58', '2025-09-27 05:57:48.58', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (19, 'noa.cham.roeun', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.588', '2025-09-27 05:57:48.588', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (20, 'rorn.sareang', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.595', '2025-09-27 05:57:48.595', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (21, 'sorn.sophaneth', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.602', '2025-09-27 05:57:48.602', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (22, 'eam.vichhak.rith', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.612', '2025-09-27 05:57:48.612', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (23, 'el.kunthea', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.619', '2025-09-27 05:57:48.619', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (24, 'san.aun', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.626', '2025-09-27 05:57:48.626', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (26, 'horn.socheata', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.647', '2025-09-27 05:57:48.647', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (27, 'phann.savoeun', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.655', '2025-09-27 05:57:48.655', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (28, 'sin.borndoul', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', NULL, NULL, true, '2025-09-27 05:57:48.67', '2025-09-27 05:57:48.67', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (29, 'chann.leakeana.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.678', '2025-09-27 05:57:48.678', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (30, 'ho.mealtey.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.686', '2025-09-27 05:57:48.686', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (31, 'hol.phanna.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.694', '2025-09-27 05:57:48.694', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (32, 'ieang.bunthoeurn.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.701', '2025-09-27 05:57:48.701', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (33, 'kan.ray.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.71', '2025-09-27 05:57:48.71', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (34, 'keo.socheat.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.723', '2025-09-27 05:57:48.723', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (35, 'keo.vesith.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.731', '2025-09-27 05:57:48.731', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (36, 'khim.kosal.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.739', '2025-09-27 05:57:48.739', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (37, 'koe.kimsou.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.753', '2025-09-27 05:57:48.753', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (38, 'kheav.sreyoun.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.763', '2025-09-27 05:57:48.763', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (39, 'ret.sreynak.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.775', '2025-09-27 05:57:48.775', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (40, 'nann.phary.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.783', '2025-09-27 05:57:48.783', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (41, 'ny.cheanichniron.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.792', '2025-09-27 05:57:48.792', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (42, 'oeun.kosal.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.807', '2025-09-27 05:57:48.807', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (43, 'on.phors.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.815', '2025-09-27 05:57:48.815', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (44, 'ou.sreynuch.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.835', '2025-09-27 05:57:48.835', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (45, 'pat.sokheng.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.843', '2025-09-27 05:57:48.843', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (46, 'pech.peakleka.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.852', '2025-09-27 05:57:48.852', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (47, 'raeun.sovathary.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.86', '2025-09-27 05:57:48.86', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (48, 'rin.vannra.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.867', '2025-09-27 05:57:48.867', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (49, 'rom.ratanak.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.88', '2025-09-27 05:57:48.88', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (50, 'sak.samnang.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.889', '2025-09-27 05:57:48.889', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (51, 'sang.sangha.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.898', '2025-09-27 05:57:48.898', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (52, 'seum.sovin.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.906', '2025-09-27 05:57:48.906', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (53, 'soeun.danut.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.919', '2025-09-27 05:57:48.919', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (54, 'sokh.chamrong.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.935', '2025-09-27 05:57:48.935', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (25, 'chhoeng.marady', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'mentor', 'Battambang', 'both', true, '2025-09-27 05:57:48.64', '2025-10-02 03:33:07.818', 'Battambang', 'both', 1, '["complete_profile"]', '2025-10-02 03:33:07.818', true);
INSERT INTO public.quick_login_users VALUES (55, 'som.phally.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.951', '2025-09-27 05:57:48.951', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (56, 'sor.kimseak.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.964', '2025-09-27 05:57:48.964', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (57, 'soth.thida.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:48.977', '2025-09-27 05:57:48.977', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (58, 'tep.sokly.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Khmer', true, '2025-09-27 05:57:48.993', '2025-09-27 05:57:48.993', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (59, 'thiem.thida.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:49.002', '2025-09-27 05:57:49.002', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (60, 'thy.sophat.bat', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'Maths', true, '2025-09-27 05:57:49.021', '2025-09-27 05:57:49.021', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (61, 'chea.putthyda.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.031', '2025-09-27 05:57:49.031', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (62, 'moy.sodara.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.039', '2025-09-27 05:57:49.039', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (63, 'chhom.borin.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.069', '2025-09-27 05:57:49.069', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (64, 'hoat.vimol.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.084', '2025-09-27 05:57:49.084', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (65, 'khoem.sithuon.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.091', '2025-09-27 05:57:49.091', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (66, 'neang.spheap.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.105', '2025-09-27 05:57:49.105', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (67, 'nov.barang.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.112', '2025-09-27 05:57:49.112', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (68, 'onn.thalin.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.119', '2025-09-27 05:57:49.119', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (69, 'pheap.sreynith.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.128', '2025-09-27 05:57:49.128', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (70, 'phoeurn.virath.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.135', '2025-09-27 05:57:49.135', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (71, 'phuong.pheap.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.142', '2025-09-27 05:57:49.142', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (72, 'say.kamsath.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.149', '2025-09-27 05:57:49.149', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (73, 'sorm.vannak.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.156', '2025-09-27 05:57:49.156', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (74, 'sum.chek.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.163', '2025-09-27 05:57:49.163', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (75, 'teour.phanna.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.172', '2025-09-27 05:57:49.172', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (77, 'chhorn.srey.pov.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.188', '2025-09-27 05:57:49.188', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (78, 'heak.tom.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.195', '2025-09-27 05:57:49.195', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (79, 'heng.chhengky.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.202', '2025-09-27 05:57:49.202', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (80, 'heng.navy.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.209', '2025-09-27 05:57:49.209', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (81, 'heng.neang.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.217', '2025-09-27 05:57:49.217', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (82, 'him.sokhaleap.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.224', '2025-09-27 05:57:49.224', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (83, 'mach.serynak.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.234', '2025-09-27 05:57:49.234', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (84, 'my.savy.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.241', '2025-09-27 05:57:49.241', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (85, 'nov.pelim.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.251', '2025-09-27 05:57:49.251', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (86, 'oll.phaleap.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.257', '2025-09-27 05:57:49.257', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (87, 'phann.srey.roth.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.275', '2025-09-27 05:57:49.275', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (88, 'phornd.sokthy.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.281', '2025-09-27 05:57:49.281', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (89, 'seiha.ratana.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Maths', true, '2025-09-27 05:57:49.293', '2025-09-27 05:57:49.293', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (90, 'seun.sophary.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.3', '2025-09-27 05:57:49.3', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (91, 'thin.dalin.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.307', '2025-09-27 05:57:49.307', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (92, 'nheb.channin.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Kampong Cham', 'Khmer', true, '2025-09-27 05:57:49.316', '2025-09-27 05:57:49.316', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (93, 'viewer', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'viewer', NULL, NULL, true, '2025-09-27 05:57:49.325', '2025-09-27 05:57:49.325', NULL, NULL, NULL, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (95, 'sanaun123', '$2b$10$AfG4Ksb5y0stEKzgA7FIUO15Y53Fq9eUGVkHATPGJB0fkKcw0x6Fi', 'teacher', 'Kampong Cham', 'គណិតវិទ្យា', true, '2025-10-02 10:01:36.097', '2025-10-02 10:01:36.097', 'Kampong Cham', 'ថ្នាក់ទី៤, ថ្នាក់ទី៥', 33, NULL, NULL, true);
INSERT INTO public.quick_login_users VALUES (76, 'chan.kimsrorn.kam', '$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S', 'teacher', 'Battambang', 'khmer', true, '2025-09-27 05:57:49.179', '2025-10-02 04:35:48.541', 'Battambang', 'grade_5', 1, '["complete_profile"]', '2025-10-02 03:23:44.848', true);
INSERT INTO public.quick_login_users VALUES (94, 'Cheaphannha', '$2b$10$NUZ4k4BZUpfEgFp5JJTb/.NE8N85B6H3AvtQzzcYL6C6/O9z1XIn6', 'mentor', 'Kampong Cham', 'គណិតវិទ្យា', true, '2025-10-02 09:21:17.284', '2025-10-02 09:21:17.284', 'Kampong Cham', 'ថ្នាក់ទី៤, ថ្នាក់ទី៥', 33, NULL, NULL, true);


--
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: report_exports; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: resource_views; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: school_classes; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: student_assessment_eligibilities; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: student_interventions; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.students VALUES (47, NULL, 8, 'អាត ឧត្តមបញ្ញាសិរីវឌ្ឍនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:43:39.774', '2025-10-06 08:43:39.775', '2025-10-12 02:57:33.283', 'mentor', 'test_mentor', NULL, '3027', 4);
INSERT INTO public.students VALUES (46, NULL, 8, 'ថេង ណាថាន់', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:42:20.923', '2025-10-06 08:42:20.926', '2025-10-12 02:54:01.384', 'mentor', 'test_mentor', NULL, '3213', 5);
INSERT INTO public.students VALUES (48, NULL, 8, 'វណ្ណ សុផានិត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:44:21.293', '2025-10-06 08:44:21.296', '2025-10-12 02:59:04.928', 'mentor', 'test_mentor', NULL, '3106', 5);
INSERT INTO public.students VALUES (49, NULL, 8, 'សំណាង ចិន្តា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:44:58.897', '2025-10-06 08:44:58.899', '2025-10-12 03:01:03.083', 'mentor', 'test_mentor', NULL, '2991', 4);
INSERT INTO public.students VALUES (50, NULL, 8, 'សេថាន ប្រាយុទ្ធ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:46:26.566', '2025-10-06 08:46:26.567', '2025-10-12 03:02:36.468', 'mentor', 'test_mentor', NULL, '3082', 5);
INSERT INTO public.students VALUES (51, NULL, 8, 'សែន ចាន់ស៊ីហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:47:06.9', '2025-10-06 08:47:06.901', '2025-10-12 03:04:03.84', 'mentor', 'test_mentor', NULL, '3190', 5);
INSERT INTO public.students VALUES (4, NULL, 1, 'ស្កាលិត', 12, 'ស្រី', 'sovath a', '0121122121', '12121', NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, false, false, 76, false, false, NULL, '2025-10-02 08:31:39.48', '2025-10-06 10:40:48.091', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (2, NULL, 1, 'sovath', 13, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, false, false, 76, false, false, NULL, '2025-10-02 03:35:20.38', '2025-10-06 10:40:43.441', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (5, NULL, 33, 'អាត ណារាត់', 13, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:38:17.424', '2025-10-02 11:38:17.424', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (6, NULL, 33, 'ហម ម៉េងលី', 11, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:40:33.382', '2025-10-02 11:40:33.382', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (7, NULL, 33, 'រស់ ផាន់ណា', 12, 'ស្រី', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:41:31.483', '2025-10-02 11:41:31.483', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (8, NULL, 33, 'មឿន សុខបាន', 13, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:42:47.283', '2025-10-02 11:42:47.283', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (9, NULL, 33, 'លី តៃឡឹង', 11, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:48:35.499', '2025-10-02 11:48:35.499', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (10, NULL, 33, 'បូរ៉ា ឆៃយ៉ា', 10, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 95, false, false, NULL, '2025-10-02 11:54:44.495', '2025-10-02 11:54:44.495', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (52, NULL, 8, 'ណាល់ វ៉ាឃីម', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:47:54.315', '2025-10-06 08:47:54.316', '2025-10-12 03:05:37.164', 'mentor', 'test_mentor', NULL, '3101', 4);
INSERT INTO public.students VALUES (53, NULL, 8, 'កែវ យ៉ីង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:48:32.084', '2025-10-06 08:48:32.085', '2025-10-12 03:06:56.893', 'mentor', 'test_mentor', NULL, '3133', 5);
INSERT INTO public.students VALUES (14, NULL, 33, 'ម៉ៅ តុលា', 9, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, false, 95, false, true, NULL, '2025-10-02 11:57:18.254', '2025-10-04 15:39:18.715', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (13, NULL, 33, 'រុន សុផល', 9, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, false, 95, false, true, NULL, '2025-10-02 11:56:32.287', '2025-10-05 07:20:58.036', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (12, NULL, 33, 'ប៊ុត វាសនា', 9, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, false, 95, false, true, NULL, '2025-10-02 11:56:04.793', '2025-10-05 07:21:01.948', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (11, NULL, 33, 'ឡាន សិនលី', 9, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, false, 95, false, true, NULL, '2025-10-02 11:55:13.614', '2025-10-05 07:21:05.575', 'teacher', 'production', NULL, NULL, NULL);
INSERT INTO public.students VALUES (35, NULL, 8, 'មាន សម្រស់', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 04:02:43.318', '2025-10-06 04:02:43.319', '2025-10-06 04:06:03.17', 'mentor', 'test_mentor', NULL, '00111៤', 4);
INSERT INTO public.students VALUES (34, NULL, 8, 'រស់ សាក់សម្យ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 04:02:10.115', '2025-10-06 04:02:10.117', '2025-10-06 04:07:27.398', 'mentor', 'test_mentor', NULL, '001113', 4);
INSERT INTO public.students VALUES (36, NULL, 8, 'យឿន វិច្ឆកា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:15:35.064', '2025-10-06 05:15:35.067', '2025-10-06 05:30:32.21', 'mentor', 'test_mentor', NULL, '5725', 4);
INSERT INTO public.students VALUES (37, NULL, 8, 'សឺន រ័ត្ននី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:16:56.965', '2025-10-06 05:16:56.967', '2025-10-06 05:36:17.54', 'mentor', 'test_mentor', NULL, '5650', 4);
INSERT INTO public.students VALUES (38, NULL, 8, 'សឺន ទិត្យសុភា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:19:06.983', '2025-10-06 05:19:06.984', '2025-10-06 05:38:07.78', 'mentor', 'test_mentor', NULL, '5651', 4);
INSERT INTO public.students VALUES (39, NULL, 8, 'ស៊ាវ ដាលីញ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:20:03.884', '2025-10-06 05:20:03.885', '2025-10-06 05:40:09.801', 'mentor', 'test_mentor', NULL, '5743', 4);
INSERT INTO public.students VALUES (40, NULL, 8, 'ឆង សុវណ្ណរាជ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:21:37.279', '2025-10-06 05:21:37.28', '2025-10-06 05:41:38.207', 'mentor', 'test_mentor', NULL, '5676', 4);
INSERT INTO public.students VALUES (41, NULL, 8, 'សឺន សុខវាសនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:22:44.819', '2025-10-06 05:22:44.82', '2025-10-06 05:43:05.255', 'mentor', 'test_mentor', NULL, '5580', 5);
INSERT INTO public.students VALUES (42, NULL, 8, 'ហ្វី ហ្វាហ្ស៊ី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:23:49.165', '2025-10-06 05:23:49.166', '2025-10-06 05:44:32.654', 'mentor', 'test_mentor', NULL, '5813', 5);
INSERT INTO public.students VALUES (43, NULL, 8, 'ភ្នំ វិថៃ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:24:48.208', '2025-10-06 05:24:48.209', '2025-10-06 05:45:48.726', 'mentor', 'test_mentor', NULL, '5550', 5);
INSERT INTO public.students VALUES (44, NULL, 8, 'វុន មិនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:25:28.161', '2025-10-06 05:25:28.162', '2025-10-06 05:47:23.299', 'mentor', 'test_mentor', NULL, '5547', 5);
INSERT INTO public.students VALUES (45, NULL, 8, 'ភ័ក្រ លីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 11, true, true, '2025-10-06 05:26:17.509', '2025-10-06 05:26:17.51', '2025-10-06 05:48:50.718', 'mentor', 'test_mentor', NULL, '5453', 5);
INSERT INTO public.students VALUES (3, NULL, 1, 'salena', 12, 'ស្រី', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, false, false, 76, false, false, NULL, '2025-10-02 07:56:20.912', '2025-10-06 10:40:39.375', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (54, NULL, 8, 'ចំរើន លីហ្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:49:32.562', '2025-10-06 08:49:32.563', '2025-10-06 09:08:48.833', 'mentor', 'test_mentor', NULL, '2772', 5);
INSERT INTO public.students VALUES (17, NULL, 25, 'លោក វិបុល', 14, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, false, false, 69, false, false, NULL, '2025-10-05 07:35:51.431', '2025-10-06 10:40:59.882', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (56, NULL, 4, 'ប៉ាក់ ខេមម៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:33:18.075', '2025-10-08 10:33:18.077', '2025-10-08 11:18:01.049', 'mentor', 'test_mentor', NULL, '1915', 4);
INSERT INTO public.students VALUES (32, NULL, 29, 'មាន វិបុល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 9, true, true, '2025-10-05 10:30:04.665', '2025-10-05 10:30:04.666', '2025-10-09 04:48:13.151', 'mentor', 'test_mentor', NULL, '32', 5);
INSERT INTO public.students VALUES (348, NULL, 44, 'ធឿន សុខជា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:26:09.029', '2025-10-14 07:26:09.03', '2025-10-14 07:44:20.576', 'mentor', 'test_mentor', NULL, '037', 4);
INSERT INTO public.students VALUES (347, NULL, 44, 'ណៃដា នុច', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:25:23.748', '2025-10-14 07:25:23.749', '2025-10-14 07:45:03.371', 'mentor', 'test_mentor', NULL, '034', 5);
INSERT INTO public.students VALUES (295, NULL, 1, 'ជា រតនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 101, true, true, '2025-10-13 13:48:13.826', '2025-10-13 13:48:13.827', '2025-10-17 01:28:02.998', 'mentor', 'test_mentor', NULL, '000015', 4);
INSERT INTO public.students VALUES (64, NULL, 4, 'ខាយ ស្រីខួច', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:41:35.582', '2025-10-08 10:41:35.583', '2025-10-08 10:54:23.736', 'mentor', 'test_mentor', NULL, '1897', 4);
INSERT INTO public.students VALUES (63, NULL, 4, 'ចេង សុខរក្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:40:45.408', '2025-10-08 10:40:45.409', '2025-10-08 10:59:04.042', 'mentor', 'test_mentor', NULL, '1902', 4);
INSERT INTO public.students VALUES (62, NULL, 4, 'អើន សុផាន់ណា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:39:58.658', '2025-10-08 10:39:58.659', '2025-10-08 11:04:49.975', 'mentor', 'test_mentor', NULL, '1938', 4);
INSERT INTO public.students VALUES (61, NULL, 4, 'ចោម រដ្ឋា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:39:10.01', '2025-10-08 10:39:10.011', '2025-10-08 11:07:16.747', 'mentor', 'test_mentor', NULL, '1901', 4);
INSERT INTO public.students VALUES (24, NULL, 23, 'ឈឿន មង្គលឧត្តម', 13, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:50:35.307', '2025-11-12 01:55:15.968', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (23, NULL, 23, 'ថា សុខសីម៉ូលី', 13, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:50:14.929', '2025-11-12 01:55:21.028', 'teacher', 'archived', NULL, '0986', 5);
INSERT INTO public.students VALUES (22, NULL, 23, 'សា រ៉ាវី', 15, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:49:50.594', '2025-11-12 01:55:27.651', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (20, NULL, 23, 'នាង មូលី', 12, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, 'story', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:48:54.547', '2025-11-12 01:55:36.909', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (19, NULL, 23, 'លី ហ្វីហុង', 12, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:48:52.65', '2025-11-12 01:55:41.851', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (27, NULL, 23, 'វិបុល សុខបញ្ញា', 10, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'story', NULL, false, false, 98, false, false, NULL, '2025-10-05 07:52:10.076', '2025-11-12 01:47:01.036', 'teacher', 'archived', NULL, '001', 4);
INSERT INTO public.students VALUES (25, NULL, 23, 'ស៊្រន់ សូនីតា', 14, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, 'word_problems', false, false, 98, false, true, NULL, '2025-10-05 07:51:03.382', '2025-11-12 01:55:12.457', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (60, NULL, 4, 'ហូន ម៉េងហុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:38:20.639', '2025-10-08 10:38:20.64', '2025-10-08 11:09:28.019', 'mentor', 'test_mentor', NULL, '1937', 4);
INSERT INTO public.students VALUES (59, NULL, 4, 'ចន្ធី ជីវន្ត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:37:32.294', '2025-10-08 10:37:32.295', '2025-10-08 11:11:29.387', 'mentor', 'test_mentor', NULL, '1921', 4);
INSERT INTO public.students VALUES (58, NULL, 4, 'ភិរម្យ អរុណ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:35:30.976', '2025-10-08 10:35:30.977', '2025-10-08 11:14:00.78', 'mentor', 'test_mentor', NULL, '1919', 4);
INSERT INTO public.students VALUES (57, NULL, 4, 'មឿន ឡតម៉ាលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-10-08 10:34:34.334', '2025-10-08 10:34:34.335', '2025-10-08 11:16:01.387', 'mentor', 'test_mentor', NULL, '1920', 4);
INSERT INTO public.students VALUES (55, NULL, 8, 'អាង សូរស័ក្ដិ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 18, true, true, '2025-10-06 08:50:35.152', '2025-10-06 08:50:35.153', '2025-10-12 03:09:49.321', 'mentor', 'test_mentor', NULL, '3103', 4);
INSERT INTO public.students VALUES (96, NULL, 8, 'ហេន ណារាជ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:15:22.387', '2025-10-08 13:15:22.388', '2025-10-13 01:32:28.153', 'mentor', 'test_mentor', NULL, '0020', 5);
INSERT INTO public.students VALUES (95, NULL, 8, 'គីម ហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:14:51.028', '2025-10-08 13:14:51.029', '2025-10-13 01:34:09.511', 'mentor', 'test_mentor', NULL, '0019', 5);
INSERT INTO public.students VALUES (70, NULL, 9, 'សល់ សូណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 5, true, true, '2025-10-08 12:27:43.798', '2025-10-08 12:27:43.799', '2025-10-08 13:25:12.995', 'mentor', 'test_mentor', NULL, '005', 4);
INSERT INTO public.students VALUES (69, NULL, 9, 'ចាន់ រតនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'number_2digit', true, true, 5, true, true, '2025-10-08 12:26:30.169', '2025-10-08 12:26:30.17', '2025-10-08 13:27:11.745', 'mentor', 'test_mentor', NULL, '004', 4);
INSERT INTO public.students VALUES (68, NULL, 9, 'រុំ ណារីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, 'word_problems', true, true, 5, true, true, '2025-10-08 12:24:29.466', '2025-10-08 12:24:29.467', '2025-10-08 13:28:47.099', 'mentor', 'test_mentor', NULL, '003', 4);
INSERT INTO public.students VALUES (85, NULL, 13, 'គង់ ចិន្តា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 13, true, true, '2025-10-08 12:39:39.132', '2025-10-08 12:39:39.133', '2025-10-11 01:24:46.635', 'mentor', 'test_mentor', NULL, '044', 4);
INSERT INTO public.students VALUES (67, NULL, 9, 'ធី ឡាយហួយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'subtraction', true, true, 5, true, true, '2025-10-08 12:22:16.644', '2025-10-08 12:22:16.647', '2025-10-08 13:30:29.419', 'mentor', 'test_mentor', NULL, '002', 4);
INSERT INTO public.students VALUES (84, NULL, 13, 'វ៉ិត ជីវ័ន្ត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 13, true, true, '2025-10-08 12:38:59.812', '2025-10-08 12:38:59.814', '2025-10-11 01:27:13.281', 'mentor', 'test_mentor', NULL, '065', 5);
INSERT INTO public.students VALUES (83, NULL, 13, 'សម្បត្តិ រក្សា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'subtraction', true, true, 13, true, true, '2025-10-08 12:37:48.203', '2025-10-08 12:37:48.204', '2025-10-11 01:30:14.712', 'mentor', 'test_mentor', NULL, '066', 4);
INSERT INTO public.students VALUES (92, NULL, 8, 'លឹម ថោងសុខគៀង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:12:28.557', '2025-10-08 13:12:28.558', '2025-10-13 01:41:00.217', 'mentor', 'test_mentor', NULL, '0016', 4);
INSERT INTO public.students VALUES (82, NULL, 13, 'លឹម សេងលីហួរ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 13, true, true, '2025-10-08 12:36:50.187', '2025-10-08 12:36:50.188', '2025-10-11 01:31:43.165', 'mentor', 'test_mentor', NULL, '063', 4);
INSERT INTO public.students VALUES (81, NULL, 13, 'យុត ដាវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 13, true, true, '2025-10-08 12:35:55.01', '2025-10-08 12:35:55.011', '2025-10-11 01:33:00.068', 'mentor', 'test_mentor', NULL, '058', 4);
INSERT INTO public.students VALUES (93, NULL, 8, 'សុវណ្ណ សៀវម៉ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 14, true, true, '2025-10-08 13:13:12.196', '2025-10-08 13:13:12.197', '2025-10-13 01:39:26.559', 'mentor', 'test_mentor', NULL, '0017', 4);
INSERT INTO public.students VALUES (91, NULL, 8, 'ហាក់ពេជ្រ លីស៊ីងយ៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 14, true, true, '2025-10-08 13:11:24.746', '2025-10-08 13:11:24.747', '2025-10-13 01:42:27.621', 'mentor', 'test_mentor', NULL, '0015', 4);
INSERT INTO public.students VALUES (90, NULL, 8, 'ជាតិ ឧត្តរៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:10:25.639', '2025-10-08 13:10:25.64', '2025-10-13 01:44:11.488', 'mentor', 'test_mentor', NULL, '0014', 4);
INSERT INTO public.students VALUES (80, NULL, 13, 'សារឿន រតនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'number_2digit', true, true, 13, true, true, '2025-10-08 12:34:24.497', '2025-10-08 12:34:24.499', '2025-10-11 01:34:35.192', 'mentor', 'test_mentor', NULL, '068', 4);
INSERT INTO public.students VALUES (88, NULL, 8, 'អែល ណាហ្វី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 14, true, true, '2025-10-08 13:09:11.953', '2025-10-08 13:09:11.954', '2025-10-13 01:45:50.524', 'mentor', 'test_mentor', NULL, '0013', 4);
INSERT INTO public.students VALUES (78, NULL, 13, 'បូ សាកាយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 13, true, true, '2025-10-08 12:33:20.014', '2025-10-08 12:33:20.015', '2025-10-11 01:36:06.13', 'mentor', 'test_mentor', NULL, '054', 4);
INSERT INTO public.students VALUES (77, NULL, 13, 'គឹង បូណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 13, true, true, '2025-10-08 12:32:28.966', '2025-10-08 12:32:28.967', '2025-10-11 01:37:32.347', 'mentor', 'test_mentor', NULL, '046', 4);
INSERT INTO public.students VALUES (76, NULL, 9, 'សាំង សុភក្រ្តា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 5, true, true, '2025-10-08 12:32:24.845', '2025-10-08 12:32:24.846', '2025-10-08 13:13:04.587', 'mentor', 'test_mentor', NULL, '010', 5);
INSERT INTO public.students VALUES (74, NULL, 13, 'គឹង បូរិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 13, true, true, '2025-10-08 12:31:06.029', '2025-10-08 12:31:06.03', '2025-10-11 01:38:45.169', 'mentor', 'test_mentor', NULL, '045', 4);
INSERT INTO public.students VALUES (87, NULL, 8, 'សាវណ្ណ ដេវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:06:17.189', '2025-10-08 13:06:17.19', '2025-10-13 01:47:16.76', 'mentor', 'test_mentor', NULL, '0012', 4);
INSERT INTO public.students VALUES (75, NULL, 9, 'រ៉ា សោភ័ណ្ឌ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 5, true, true, '2025-10-08 12:31:34.554', '2025-10-08 12:31:34.555', '2025-10-08 13:15:11.842', 'mentor', 'test_mentor', NULL, '009', 5);
INSERT INTO public.students VALUES (73, NULL, 9, 'ចិន្ដា ដាឡាង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 5, true, true, '2025-10-08 12:30:46.739', '2025-10-08 12:30:46.74', '2025-10-08 13:18:10.372', 'mentor', 'test_mentor', NULL, '008', 5);
INSERT INTO public.students VALUES (72, NULL, 9, 'ម៉ាប់ លីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'subtraction', true, true, 5, true, true, '2025-10-08 12:30:03.914', '2025-10-08 12:30:03.915', '2025-10-08 13:21:15.964', 'mentor', 'test_mentor', NULL, '007', 5);
INSERT INTO public.students VALUES (71, NULL, 9, 'ជ្រឿន សម្ផស្ស', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 5, true, true, '2025-10-08 12:28:56.6', '2025-10-08 12:28:56.601', '2025-10-08 13:23:32.254', 'mentor', 'test_mentor', NULL, '006', 5);
INSERT INTO public.students VALUES (98, NULL, 2, 'ឆន អេលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, NULL, NULL, true, true, 21, true, true, '2025-10-08 14:21:57.411', '2025-10-08 14:21:57.414', '2025-10-08 14:33:02.458', 'mentor', 'test_mentor', NULL, '00001', 4);
INSERT INTO public.students VALUES (102, NULL, 2, 'សៀប លីហេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'story', NULL, 'comprehension2', NULL, true, true, 21, true, true, '2025-10-08 14:24:01.897', '2025-10-08 14:24:01.898', '2025-10-08 14:51:29.599', 'mentor', 'test_mentor', NULL, '00005', 4);
INSERT INTO public.students VALUES (99, NULL, 2, 'ណារ៉ង់ ហ្សាគី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'paragraph', NULL, 'comprehension2', NULL, true, true, 21, true, true, '2025-10-08 14:22:36.799', '2025-10-08 14:22:36.8', '2025-10-08 14:49:26.222', 'mentor', 'test_mentor', NULL, '00002', 4);
INSERT INTO public.students VALUES (106, NULL, 2, 'លឿយ ដាឡុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 21, true, true, '2025-10-08 14:30:13.115', '2025-10-08 14:30:13.116', '2025-10-08 14:36:05.781', 'mentor', 'test_mentor', NULL, '00009', 5);
INSERT INTO public.students VALUES (107, NULL, 2, 'សឿន ចំរើន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'story', NULL, 'comprehension2', NULL, true, true, 21, true, true, '2025-10-08 14:30:39.353', '2025-10-08 14:30:39.354', '2025-10-08 14:53:38.322', 'mentor', 'test_mentor', NULL, '00010', 4);
INSERT INTO public.students VALUES (105, NULL, 2, 'ហ៊ីម គឹមហាន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, 'word', NULL, 'word', NULL, true, true, 21, true, true, '2025-10-08 14:28:32.129', '2025-10-08 14:28:32.13', '2025-10-08 14:53:07.353', 'mentor', 'test_mentor', NULL, '00008', 5);
INSERT INTO public.students VALUES (104, NULL, 2, 'ណាត នីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, 'letter', NULL, 'word', NULL, true, true, 21, true, true, '2025-10-08 14:25:02.094', '2025-10-08 14:25:02.097', '2025-10-08 14:52:11.27', 'mentor', 'test_mentor', NULL, '00007', 5);
INSERT INTO public.students VALUES (103, NULL, 2, 'ឡុង ល្វីស៊ីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, 'paragraph', NULL, NULL, NULL, true, true, 21, true, true, '2025-10-08 14:24:33.186', '2025-10-08 14:24:33.188', '2025-10-08 14:46:14.769', 'mentor', 'test_mentor', NULL, '00006', 5);
INSERT INTO public.students VALUES (101, NULL, 2, 'សំបូរ ពេជ្រពណ្ណរ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, 'comprehension2', NULL, 'comprehension2', NULL, true, true, 21, true, true, '2025-10-08 14:23:33.194', '2025-10-08 14:23:33.195', '2025-10-08 14:50:54.003', 'mentor', 'test_mentor', NULL, '00004', 4);
INSERT INTO public.students VALUES (100, NULL, 2, 'ឡឺត សុខវិកែវ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, 'word', NULL, true, true, 21, true, true, '2025-10-08 14:23:02.026', '2025-10-08 14:23:02.027', '2025-10-08 14:50:04.553', 'mentor', 'test_mentor', NULL, '00003', 4);
INSERT INTO public.students VALUES (86, NULL, 13, 'ជឿន ស្រីដេត', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'subtraction', true, true, 13, true, true, '2025-10-08 12:40:38.693', '2025-10-08 12:40:38.694', '2025-10-11 01:22:14.158', 'mentor', 'test_mentor', NULL, '048', 4);
INSERT INTO public.students VALUES (110, NULL, 33, 'ហាក់ សាវី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, 'division', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:21:00.167', '2025-10-08 15:21:00.168', '2025-10-08 16:00:29.926', 'mentor', 'test_mentor', NULL, '03', 4);
INSERT INTO public.students VALUES (118, NULL, 28, 'ចាន់ សុខវ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 19, true, true, '2025-10-09 02:51:51.655', '2025-10-09 02:51:51.657', '2025-10-09 03:44:07.991', 'mentor', 'test_mentor', NULL, '00041', 4);
INSERT INTO public.students VALUES (127, NULL, 28, 'ស្រ៊ីម ធារៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'story', NULL, true, true, 19, true, true, '2025-10-09 03:01:39.438', '2025-10-09 03:01:39.439', '2025-10-09 03:50:38.759', 'mentor', 'test_mentor', NULL, '00055', 5);
INSERT INTO public.students VALUES (114, NULL, 33, 'រ៉េន សុជាតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, NULL, true, true, 94, true, true, '2025-10-08 15:24:23.407', '2025-10-08 15:24:23.408', '2025-10-08 15:40:57.431', 'mentor', 'test_mentor', NULL, '07', 5);
INSERT INTO public.students VALUES (117, NULL, 33, 'យាន វុទ្ធី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, NULL, true, true, 94, true, true, '2025-10-08 15:26:09.215', '2025-10-08 15:26:09.216', '2025-10-08 15:44:26.031', 'mentor', 'test_mentor', NULL, '10', 5);
INSERT INTO public.students VALUES (126, NULL, 28, 'សំរិទ្ធ ឈីងលាង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, 'comprehension2', NULL, true, true, 19, true, true, '2025-10-09 03:00:58.914', '2025-10-09 03:00:58.915', '2025-10-09 03:54:47.137', 'mentor', 'test_mentor', NULL, '00054', 5);
INSERT INTO public.students VALUES (108, NULL, 33, 'កេង លីឈួ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, 'division', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:19:43.688', '2025-10-08 15:19:43.69', '2025-10-08 15:58:12.646', 'mentor', 'test_mentor', NULL, '01', 4);
INSERT INTO public.students VALUES (109, NULL, 33, 'ខេមរៈ វីរៈបុត្រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, 'word_problems', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:20:29.76', '2025-10-08 15:20:29.761', '2025-10-08 15:59:28.55', 'mentor', 'test_mentor', NULL, '02', 4);
INSERT INTO public.students VALUES (111, NULL, 33, 'នី ម៉ូលីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, 'division', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:21:53.722', '2025-10-08 15:21:53.723', '2025-10-08 16:01:56.805', 'mentor', 'test_mentor', NULL, '04', 4);
INSERT INTO public.students VALUES (112, NULL, 33, 'ចក្រី មួយលាង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, 'word_problems', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:23:07.006', '2025-10-08 15:23:07.007', '2025-10-08 16:03:14.735', 'mentor', 'test_mentor', NULL, '05', 5);
INSERT INTO public.students VALUES (113, NULL, 33, 'តាំង ស៊ាវហឺ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, 'word_problems', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:23:52.258', '2025-10-08 15:23:52.26', '2025-10-08 16:04:20.697', 'mentor', 'test_mentor', NULL, '06', 5);
INSERT INTO public.students VALUES (115, NULL, 33, 'លី ម៉ីជូ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, 'word_problems', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:25:01.022', '2025-10-08 15:25:01.023', '2025-10-08 16:05:24.089', 'mentor', 'test_mentor', NULL, '08', 5);
INSERT INTO public.students VALUES (116, NULL, 33, 'វិចិត្ត ជិលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, 'word_problems', NULL, 'word_problems', true, true, 94, true, true, '2025-10-08 15:25:37.62', '2025-10-08 15:25:37.621', '2025-10-08 16:06:21.932', 'mentor', 'test_mentor', NULL, '09', 5);
INSERT INTO public.students VALUES (122, NULL, 28, 'ង៉ា សង្ហា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 19, true, true, '2025-10-09 02:57:05.033', '2025-10-09 02:57:05.035', '2025-10-09 03:39:33.941', 'mentor', 'test_mentor', NULL, '00045', 4);
INSERT INTO public.students VALUES (121, NULL, 28, 'ចាន់ ត្រ័យលក្ខណ៍', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 19, true, true, '2025-10-09 02:55:40.942', '2025-10-09 02:55:40.944', '2025-10-09 03:40:40.468', 'mentor', 'test_mentor', NULL, '00044', 4);
INSERT INTO public.students VALUES (120, NULL, 28, 'ទូច ភ័ក្ត្រា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 19, true, true, '2025-10-09 02:54:30.631', '2025-10-09 02:54:30.633', '2025-10-09 03:41:30.582', 'mentor', 'test_mentor', NULL, '00043', 4);
INSERT INTO public.students VALUES (119, NULL, 28, 'ធី សុខលាប', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 19, true, true, '2025-10-09 02:53:21.045', '2025-10-09 02:53:21.046', '2025-10-09 03:42:52.681', 'mentor', 'test_mentor', NULL, '00042', 4);
INSERT INTO public.students VALUES (136, NULL, 33, 'យឿន ឈីវសា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:57:55.208', '2025-10-09 03:57:55.209', '2025-10-09 04:05:37.47', 'mentor', 'test_mentor', NULL, '0108', 5);
INSERT INTO public.students VALUES (135, NULL, 33, 'ភេង យូរី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:57:24.594', '2025-10-09 03:57:24.596', '2025-10-09 04:06:48.615', 'mentor', 'test_mentor', NULL, '0107', 5);
INSERT INTO public.students VALUES (151, NULL, 29, 'ធួន ចរិយា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:41:40.636', '2025-10-09 14:41:40.637', '2025-10-15 03:11:21.14', 'mentor', 'test_mentor', NULL, '0003', 4);
INSERT INTO public.students VALUES (134, NULL, 33, 'លី រតនៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:55:57.452', '2025-10-09 03:55:57.453', '2025-10-09 04:09:19.251', 'mentor', 'test_mentor', NULL, '0106', 5);
INSERT INTO public.students VALUES (133, NULL, 33, 'អ៉ឹម រតនៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:55:27.428', '2025-10-09 03:55:27.43', '2025-10-09 04:11:10.066', 'mentor', 'test_mentor', NULL, '0105', 5);
INSERT INTO public.students VALUES (132, NULL, 33, 'សេង លីឆាយ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:54:47.083', '2025-10-09 03:54:47.084', '2025-10-09 04:12:10.01', 'mentor', 'test_mentor', NULL, '0104', 5);
INSERT INTO public.students VALUES (131, NULL, 33, 'ឌី យូម៉េង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:54:15.73', '2025-10-09 03:54:15.731', '2025-10-09 04:12:57.793', 'mentor', 'test_mentor', NULL, '0103', 4);
INSERT INTO public.students VALUES (130, NULL, 33, 'ហៀង ដាវិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:53:41.346', '2025-10-09 03:53:41.347', '2025-10-09 04:13:59.675', 'mentor', 'test_mentor', NULL, '0102', 4);
INSERT INTO public.students VALUES (129, NULL, 33, 'លី សក្កា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:53:07.616', '2025-10-09 03:53:07.617', '2025-10-09 04:14:54.801', 'mentor', 'test_mentor', NULL, '0101', 4);
INSERT INTO public.students VALUES (128, NULL, 33, 'ស៊ីណាត អេលីស', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:50:52.368', '2025-10-09 03:50:52.37', '2025-10-09 04:19:08.786', 'mentor', 'test_mentor', NULL, '0100', 4);
INSERT INTO public.students VALUES (137, NULL, 33, 'អ៊ាង រក្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', 'subtraction', NULL, NULL, NULL, NULL, true, true, 97, true, true, '2025-10-09 03:58:36.299', '2025-10-09 03:58:36.3', '2025-10-09 04:29:42.614', 'mentor', 'test_mentor', NULL, '0109', 5);
INSERT INTO public.students VALUES (152, NULL, 29, 'ម៉ាប់ លីន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:42:34.088', '2025-10-09 14:42:34.089', '2025-10-15 03:16:48.17', 'mentor', 'test_mentor', NULL, '0004', 4);
INSERT INTO public.students VALUES (154, NULL, 29, 'ហៀង សុវណ្ណរាជ្យ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:44:00.624', '2025-10-09 14:44:00.625', '2025-10-15 03:18:28.25', 'mentor', 'test_mentor', NULL, '0006', 4);
INSERT INTO public.students VALUES (155, NULL, 29, 'ធៀប ប៊ុនស្រីនិច្ច', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:44:45.369', '2025-10-09 14:44:45.37', '2025-10-15 03:19:26.804', 'mentor', 'test_mentor', NULL, '0007', 4);
INSERT INTO public.students VALUES (125, NULL, 28, 'ណោ ស្រីនីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'story', NULL, true, true, 19, true, true, '2025-10-09 03:00:05.921', '2025-10-09 03:00:05.922', '2025-10-09 08:57:22.634', 'mentor', 'test_mentor', NULL, '00053', 5);
INSERT INTO public.students VALUES (124, NULL, 28, 'ហួត លីហ័រ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, 'story', NULL, true, true, 19, true, true, '2025-10-09 02:58:57.28', '2025-10-09 02:58:57.281', '2025-10-09 09:00:52.533', 'mentor', 'test_mentor', NULL, '00052', 5);
INSERT INTO public.students VALUES (144, NULL, 1, 'ហឺយ ជាដាវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', NULL, NULL, NULL, 'story', NULL, true, true, 100, true, true, '2025-10-09 04:55:04.579', '2025-10-09 04:55:04.58', '2025-10-17 01:09:26.743', 'mentor', 'test_mentor', NULL, '9', 4);
INSERT INTO public.students VALUES (156, NULL, 29, 'ភា ស៊ីងហួង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:45:43.584', '2025-10-09 14:45:43.585', '2025-10-15 03:27:23.466', 'mentor', 'test_mentor', NULL, '0008', 4);
INSERT INTO public.students VALUES (157, NULL, 29, 'ឈាវ ស្រីលីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:46:20.506', '2025-10-09 14:46:20.507', '2025-10-15 03:28:28.035', 'mentor', 'test_mentor', NULL, '0009', 4);
INSERT INTO public.students VALUES (158, NULL, 29, 'ស៊ុន សុខវួចនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:47:41.905', '2025-10-09 14:47:41.906', '2025-10-15 03:29:24.695', 'mentor', 'test_mentor', NULL, '០០០១០', 5);
INSERT INTO public.students VALUES (159, NULL, 29, 'សុខនី ស្រីពេជ្រ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:49:54.491', '2025-10-09 14:49:54.494', '2025-10-15 03:30:08.173', 'mentor', 'test_mentor', NULL, '00011', 5);
INSERT INTO public.students VALUES (143, NULL, 1, 'លី សុភារិទ្ធិ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'comprehension1', NULL, true, true, 100, true, true, '2025-10-09 04:54:28.228', '2025-10-09 04:54:28.229', '2025-10-17 01:05:46.849', 'mentor', 'test_mentor', NULL, '8', 4);
INSERT INTO public.students VALUES (139, NULL, 1, 'ភិន សៃណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-09 04:52:24.263', '2025-10-09 04:52:24.264', '2025-10-10 08:57:44.567', 'mentor', 'test_mentor', NULL, '4', 4);
INSERT INTO public.students VALUES (140, NULL, 1, 'វុន ស៊ីង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-09 04:53:04.336', '2025-10-09 04:53:04.337', '2025-10-10 08:58:14.132', 'mentor', 'test_mentor', NULL, '5', 4);
INSERT INTO public.students VALUES (141, NULL, 1, 'លាង លក្ខិណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-09 04:53:27.606', '2025-10-09 04:53:27.607', '2025-10-10 08:58:52.306', 'mentor', 'test_mentor', NULL, '6', 4);
INSERT INTO public.students VALUES (142, NULL, 1, 'ភើយ ម៉ីលីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-09 04:53:55.272', '2025-10-09 04:53:55.273', '2025-10-10 08:59:51.024', 'mentor', 'test_mentor', NULL, '7', 4);
INSERT INTO public.students VALUES (148, NULL, 1, 'តាក់ វិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-09 05:05:52.509', '2025-10-09 05:05:52.51', '2025-10-10 09:12:22.699', 'mentor', 'test_mentor', NULL, '2', 4);
INSERT INTO public.students VALUES (160, NULL, 29, 'អ៉ិន ហ្គេកលិវ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:51:00.264', '2025-10-09 14:51:00.265', '2025-10-15 03:31:28.155', 'mentor', 'test_mentor', NULL, '00012', 5);
INSERT INTO public.students VALUES (150, NULL, 29, 'អ៊ុនសៀវ ឡាយឃ័រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, NULL, true, true, 9, true, true, '2025-10-09 14:40:55.131', '2025-10-09 14:40:55.132', '2025-10-10 13:35:55.183', 'mentor', 'test_mentor', NULL, '0002', 4);
INSERT INTO public.students VALUES (161, NULL, 29, 'សេង ហួលីហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:52:19.174', '2025-10-09 14:52:19.175', '2025-10-15 03:32:39.929', 'mentor', 'test_mentor', NULL, '00013', 5);
INSERT INTO public.students VALUES (138, NULL, 1, 'សំណាង ណារ៉ុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'comprehension2', NULL, true, true, 100, true, true, '2025-10-09 04:51:30.773', '2025-10-09 04:51:30.775', '2025-10-17 00:53:19.041', 'mentor', 'test_mentor', NULL, '3', 4);
INSERT INTO public.students VALUES (194, NULL, 1, 'លឹម វ៉ាន់សក្ដិ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:19:33.103', '2025-10-10 09:19:33.104', '2025-10-14 06:41:29.487', 'mentor', 'test_mentor', NULL, '21', 5);
INSERT INTO public.students VALUES (195, NULL, 1, 'សយ សុម៉ានីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:19:59.847', '2025-10-10 09:19:59.848', '2025-10-14 06:42:47.447', 'mentor', 'test_mentor', NULL, '22', 5);
INSERT INTO public.students VALUES (196, NULL, 1, 'វីរៈ ឫទ្ធីរាជ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:20:25.315', '2025-10-10 09:20:25.316', '2025-10-14 06:43:22.645', 'mentor', 'test_mentor', NULL, '23', 5);
INSERT INTO public.students VALUES (197, NULL, 1, 'ឡាយ សុវណ្ណឌី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:20:55.173', '2025-10-10 09:20:55.174', '2025-10-14 06:43:56.335', 'mentor', 'test_mentor', NULL, '24', 5);
INSERT INTO public.students VALUES (198, NULL, 1, 'ហៀង ថៃសុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:21:21.522', '2025-10-10 09:21:21.523', '2025-10-14 06:44:46.997', 'mentor', 'test_mentor', NULL, '25', 5);
INSERT INTO public.students VALUES (199, NULL, 1, 'ចាន់ សូនីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:21:45.424', '2025-10-10 09:21:45.425', '2025-10-14 06:45:20.455', 'mentor', 'test_mentor', NULL, '26', 5);
INSERT INTO public.students VALUES (183, NULL, 1, 'ខុម សុភីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, 'comprehension1', NULL, true, true, 100, true, true, '2025-10-10 08:42:50.559', '2025-10-10 08:42:50.562', '2025-10-17 01:00:26.727', 'mentor', 'test_mentor', NULL, '10 ', 4);
INSERT INTO public.students VALUES (182, NULL, 37, 'អេង យីងអាយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 02:36:38.598', '2025-10-10 02:36:38.599', '2025-10-10 02:38:53.761', 'mentor', 'test_mentor', NULL, '3526', 5);
INSERT INTO public.students VALUES (178, NULL, 37, 'គី ម៉េងស៊ាង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 01:44:06.947', '2025-10-10 01:44:06.948', '2025-10-10 01:51:52.55', 'mentor', 'test_mentor', NULL, '3669', 5);
INSERT INTO public.students VALUES (123, NULL, 28, 'សយ សេងហ៊ី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'comprehension1', NULL, true, true, 19, true, true, '2025-10-09 02:58:03.651', '2025-10-09 02:58:03.652', '2025-10-10 08:26:57.243', 'mentor', 'test_mentor', NULL, '00051', 5);
INSERT INTO public.students VALUES (177, NULL, 37, 'ពុធ សុវណ្ណាភូមិ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 01:43:28.931', '2025-10-10 01:43:28.932', '2025-10-10 01:56:56.639', 'mentor', 'test_mentor', NULL, '3598', 5);
INSERT INTO public.students VALUES (176, NULL, 37, 'វុធ នីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension1', NULL, true, true, 10, true, true, '2025-10-10 01:42:59.547', '2025-10-10 01:42:59.548', '2025-10-10 02:01:33.936', 'mentor', 'test_mentor', NULL, '3492', 4);
INSERT INTO public.students VALUES (175, NULL, 37, 'ឆុន លីអុីង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension1', NULL, true, true, 10, true, true, '2025-10-10 01:42:27.825', '2025-10-10 01:42:27.826', '2025-10-10 02:04:34.13', 'mentor', 'test_mentor', NULL, '3107', 4);
INSERT INTO public.students VALUES (174, NULL, 37, 'ហេង ម៉ីលីង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 01:41:53.44', '2025-10-10 01:41:53.442', '2025-10-10 02:07:04.691', 'mentor', 'test_mentor', NULL, '3010', 4);
INSERT INTO public.students VALUES (173, NULL, 37, 'រុំ សុខរឿន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension1', NULL, true, true, 10, true, true, '2025-10-10 01:41:28.106', '2025-10-10 01:41:28.107', '2025-10-10 02:17:06.965', 'mentor', 'test_mentor', NULL, '2317', 4);
INSERT INTO public.students VALUES (192, NULL, 1, 'លី សៀវហ្គិច', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:47:56.89', '2025-10-10 08:47:56.891', '2025-10-10 08:56:27.866', 'mentor', 'test_mentor', NULL, '19', 4);
INSERT INTO public.students VALUES (172, NULL, 37, 'ហួត លីហូវ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, 'comprehension2', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 01:41:04.406', '2025-10-10 01:41:04.407', '2025-10-10 02:20:27.942', 'mentor', 'test_mentor', NULL, '2436', 4);
INSERT INTO public.students VALUES (187, NULL, 1, 'ខុម សុផា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, 'story', NULL, true, true, 100, true, true, '2025-10-10 08:45:15.525', '2025-10-10 08:45:15.526', '2025-10-17 01:02:14.253', 'mentor', 'test_mentor', NULL, '14', 4);
INSERT INTO public.students VALUES (184, NULL, 1, 'អៀវ នីហ្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:43:19.066', '2025-10-10 08:43:19.067', '2025-10-10 09:01:11.312', 'mentor', 'test_mentor', NULL, '11', 4);
INSERT INTO public.students VALUES (171, NULL, 37, 'វ៉ាន់ សុបញ្ញា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, 'comprehension2', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 01:40:37.752', '2025-10-10 01:40:37.753', '2025-10-10 02:22:21.59', 'mentor', 'test_mentor', NULL, '2415', 4);
INSERT INTO public.students VALUES (185, NULL, 1, 'គី សុរ៉ូហ្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:43:46.909', '2025-10-10 08:43:46.91', '2025-10-10 09:02:04.236', 'mentor', 'test_mentor', NULL, '12', 4);
INSERT INTO public.students VALUES (186, NULL, 1, 'រដ្ឋា ពិសិដ្ឋ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:44:48.961', '2025-10-10 08:44:48.962', '2025-10-10 09:02:38.816', 'mentor', 'test_mentor', NULL, '13', 4);
INSERT INTO public.students VALUES (181, NULL, 37, 'ភន គឹមឡេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 10, true, true, '2025-10-10 02:24:12.798', '2025-10-10 02:24:12.799', '2025-10-10 02:26:01.419', 'mentor', 'test_mentor', NULL, '2437', 4);
INSERT INTO public.students VALUES (188, NULL, 1, 'ណាក់ សៀវអ៊ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:45:43.443', '2025-10-10 08:45:43.444', '2025-10-10 09:03:51.697', 'mentor', 'test_mentor', NULL, '15', 4);
INSERT INTO public.students VALUES (189, NULL, 1, 'ណុយ សុខេន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:46:09.966', '2025-10-10 08:46:09.967', '2025-10-10 09:04:19.426', 'mentor', 'test_mentor', NULL, '16', 4);
INSERT INTO public.students VALUES (190, NULL, 1, 'វ៉ិន ចាន់រ៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:46:44.528', '2025-10-10 08:46:44.53', '2025-10-10 09:04:51.292', 'mentor', 'test_mentor', NULL, '17', 4);
INSERT INTO public.students VALUES (191, NULL, 1, 'ណាង សៀវម៊ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 08:47:12.732', '2025-10-10 08:47:12.734', '2025-10-10 09:05:25.388', 'mentor', 'test_mentor', NULL, '18', 4);
INSERT INTO public.students VALUES (1, NULL, 1, 'ចាន់ រង្សី', 12, 'ប្រុស', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 25, true, true, '2025-10-02 03:33:27.62', '2025-10-02 03:33:27.621', '2025-10-10 09:09:55.272', 'mentor', 'test_mentor', NULL, '1', 4);
INSERT INTO public.students VALUES (202, NULL, 1, 'ហឿប ចន្ទប្រថ្នា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 100, true, false, '2025-10-10 09:23:49.246', '2025-10-10 09:23:49.249', '2025-10-10 09:23:49.249', 'mentor', 'test_mentor', NULL, '27', 5);
INSERT INTO public.students VALUES (215, NULL, 40, 'ចិន ម៉េងហុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:02:50.363', '2025-10-10 10:02:50.364', '2025-10-10 10:56:38.707', 'mentor', 'test_mentor', NULL, '165', 4);
INSERT INTO public.students VALUES (204, NULL, 40, 'ហ៊ី ឈីងអ៊ាន់', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 09:49:28.824', '2025-10-10 09:49:28.825', '2025-10-10 10:55:02.625', 'mentor', 'test_mentor', NULL, '238', 4);
INSERT INTO public.students VALUES (217, NULL, 40, 'ដែន ហេងឡុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:05:47.977', '2025-10-10 10:05:47.979', '2025-10-10 10:58:24.625', 'mentor', 'test_mentor', NULL, '176', 4);
INSERT INTO public.students VALUES (218, NULL, 40, 'យី ហ្គេកហ័ង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:11:27.431', '2025-10-10 10:11:27.432', '2025-10-10 10:59:30.842', 'mentor', 'test_mentor', NULL, '217', 4);
INSERT INTO public.students VALUES (219, NULL, 40, 'ចិត្រា ឧស្សាហ៍', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:12:22.731', '2025-10-10 10:12:22.732', '2025-10-10 11:00:39.404', 'mentor', 'test_mentor', NULL, '163', 4);
INSERT INTO public.students VALUES (220, NULL, 40, 'ហេង ជូកាំងធីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:13:29.67', '2025-10-10 10:13:29.672', '2025-10-10 11:01:38.787', 'mentor', 'test_mentor', NULL, '236', 4);
INSERT INTO public.students VALUES (221, NULL, 40, 'វឹង ហុងសៀងលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:14:24.626', '2025-10-10 10:14:24.627', '2025-10-10 11:02:42.593', 'mentor', 'test_mentor', NULL, '220', 4);
INSERT INTO public.students VALUES (222, NULL, 40, 'សុភ័ក្រ ជូលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:15:12.792', '2025-10-10 10:15:12.793', '2025-10-10 11:03:38.523', 'mentor', 'test_mentor', NULL, '228', 4);
INSERT INTO public.students VALUES (223, NULL, 40, 'វិបុល វីរៈបុត្រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:16:07.037', '2025-10-10 10:16:07.038', '2025-10-10 11:04:25.071', 'mentor', 'test_mentor', NULL, '223', 4);
INSERT INTO public.students VALUES (225, NULL, 40, 'ហ៊ី ឈីងអ៉ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:21:25.174', '2025-10-10 10:21:25.175', '2025-10-10 11:05:19.448', 'mentor', 'test_mentor', NULL, '239', 5);
INSERT INTO public.students VALUES (226, NULL, 40, 'គាំ លក្ខិណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:22:21.612', '2025-10-10 10:22:21.613', '2025-10-10 11:06:08.736', 'mentor', 'test_mentor', NULL, '215', 5);
INSERT INTO public.students VALUES (227, NULL, 40, 'ដានូ គីមហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:23:09.111', '2025-10-10 10:23:09.112', '2025-10-10 11:06:54.886', 'mentor', 'test_mentor', NULL, '222', 5);
INSERT INTO public.students VALUES (229, NULL, 40, 'ឃាង មួយលីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:24:38.656', '2025-10-10 10:24:38.657', '2025-10-10 11:07:36.995', 'mentor', 'test_mentor', NULL, '218', 5);
INSERT INTO public.students VALUES (230, NULL, 40, 'ថុន ចាន់ខេមរិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:26:09.406', '2025-10-10 10:26:09.407', '2025-10-10 11:08:35.881', 'mentor', 'test_mentor', NULL, '224', 5);
INSERT INTO public.students VALUES (231, NULL, 40, 'ផុន រស្មី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:26:58.53', '2025-10-10 10:26:58.531', '2025-10-10 11:09:17.015', 'mentor', 'test_mentor', NULL, '229', 5);
INSERT INTO public.students VALUES (232, NULL, 40, 'ឈ៉ីវ សៀវឈី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:28:15.953', '2025-10-10 10:28:15.954', '2025-10-10 11:09:59.884', 'mentor', 'test_mentor', NULL, '241', 5);
INSERT INTO public.students VALUES (234, NULL, 40, 'អៀង លីណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:29:33.644', '2025-10-10 10:29:33.645', '2025-10-10 11:10:43.818', 'mentor', 'test_mentor', NULL, '234', 5);
INSERT INTO public.students VALUES (235, NULL, 40, 'គីម មួយលី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:30:19.457', '2025-10-10 10:30:19.458', '2025-10-10 11:11:21.427', 'mentor', 'test_mentor', NULL, '216', 5);
INSERT INTO public.students VALUES (203, NULL, 40, 'ភាព សៀងបុត្រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 09:47:40.999', '2025-10-10 09:47:41.001', '2025-10-10 10:53:02.816', 'mentor', 'test_mentor', NULL, '212', 4);
INSERT INTO public.students VALUES (236, NULL, 40, 'វី ដារី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, true, 16, true, true, '2025-10-10 10:31:23.997', '2025-10-10 10:31:23.998', '2025-10-10 11:11:58.895', 'mentor', 'test_mentor', NULL, '233', 5);
INSERT INTO public.students VALUES (277, NULL, 34, 'ចាន់ រតនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'paragraph', NULL, 'story', NULL, true, true, 103, true, true, '2025-10-11 12:24:07.731', '2025-10-11 12:24:07.732', '2025-10-14 11:31:45.42', 'mentor', 'test_mentor', NULL, '000009', 4);
INSERT INTO public.students VALUES (276, NULL, 34, 'រីម រតនាដាលីស', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'story', NULL, 'comprehension1', NULL, true, true, 103, true, true, '2025-10-11 12:21:58.43', '2025-10-11 12:21:58.431', '2025-10-14 11:34:18.527', 'mentor', 'test_mentor', NULL, '000008', 4);
INSERT INTO public.students VALUES (275, NULL, 34, 'ហាន ប៊ុនណា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'comprehension2', NULL, 'comprehension2', NULL, true, true, 103, true, true, '2025-10-11 12:20:31.963', '2025-10-11 12:20:31.965', '2025-10-14 11:35:21.348', 'mentor', 'test_mentor', NULL, '000007', 4);
INSERT INTO public.students VALUES (274, NULL, 34, 'ហឿន  សុខរ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'story', NULL, 'comprehension1', NULL, true, true, 103, true, true, '2025-10-11 12:19:47.924', '2025-10-11 12:19:47.926', '2025-10-14 11:36:32.021', 'mentor', 'test_mentor', NULL, '000006', 4);
INSERT INTO public.students VALUES (273, NULL, 34, 'ហាន សុខដារ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'story', NULL, 'comprehension1', NULL, true, true, 103, true, true, '2025-10-11 12:18:54.686', '2025-10-11 12:18:54.687', '2025-10-14 11:40:32.063', 'mentor', 'test_mentor', NULL, '000005', 4);
INSERT INTO public.students VALUES (272, NULL, 34, 'យ៉យ  សុវឌ្ឍនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'paragraph', NULL, 'story', NULL, true, true, 103, true, true, '2025-10-11 12:18:03.339', '2025-10-11 12:18:03.34', '2025-10-14 11:42:41.586', 'mentor', 'test_mentor', NULL, '000004', 4);
INSERT INTO public.students VALUES (271, NULL, 34, 'ហុក ឈាងហួត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 103, true, true, '2025-10-11 12:16:59.904', '2025-10-11 12:16:59.905', '2025-10-14 11:44:04.75', 'mentor', 'test_mentor', NULL, '000003', 4);
INSERT INTO public.students VALUES (270, NULL, 34, 'ស៊ីម៉ា រីសារ៉ានុន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'comprehension1', NULL, 'comprehension2', NULL, true, true, 103, true, true, '2025-10-11 12:03:57.707', '2025-10-11 12:03:57.709', '2025-10-14 11:45:06.279', 'mentor', 'test_mentor', NULL, '000002', 4);
INSERT INTO public.students VALUES (269, NULL, 34, 'ចែម សុនីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, 'comprehension2', NULL, 'comprehension2', NULL, true, true, 103, true, true, '2025-10-11 12:01:57.289', '2025-10-11 12:01:57.29', '2025-10-14 11:45:46.445', 'mentor', 'test_mentor', NULL, '000001', 4);
INSERT INTO public.students VALUES (153, NULL, 29, 'ម៉ាប់ ឡា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 9, true, true, '2025-10-09 14:43:14.142', '2025-10-09 14:43:14.143', '2025-10-15 03:17:31.521', 'mentor', 'test_mentor', NULL, '0005', 4);
INSERT INTO public.students VALUES (97, NULL, 8, 'ណាង វណ្ណា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 14, true, true, '2025-10-08 13:16:00.272', '2025-10-08 13:16:00.274', '2025-10-13 01:29:50.466', 'mentor', 'test_mentor', NULL, '0021', 5);
INSERT INTO public.students VALUES (94, NULL, 8, 'ចក់ ហេងសុផាឡែន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 14, true, true, '2025-10-08 13:14:15.808', '2025-10-08 13:14:15.809', '2025-10-13 01:35:31.174', 'mentor', 'test_mentor', NULL, '0018', 4);
INSERT INTO public.students VALUES (305, NULL, 1, 'សេង គន្ធា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'subtraction', true, true, 101, true, true, '2025-10-13 13:56:49.757', '2025-10-13 13:56:49.758', '2025-10-17 00:34:39.596', 'mentor', 'test_mentor', NULL, '000018', 4);
INSERT INTO public.students VALUES (297, NULL, 1, 'ហ៊ុន វឌ្ឍនៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, 'word_problems', true, true, 101, true, true, '2025-10-13 13:51:56.683', '2025-10-13 13:51:56.684', '2025-10-17 00:36:34.902', 'mentor', 'test_mentor', NULL, '000017', 4);
INSERT INTO public.students VALUES (293, NULL, 1, 'ទិត ហ៊ុយមាន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 101, true, true, '2025-10-13 13:44:41.971', '2025-10-13 13:44:41.972', '2025-10-17 01:39:23.755', 'mentor', 'test_mentor', NULL, '000013', 5);
INSERT INTO public.students VALUES (312, NULL, 1, 'សុខម រ៉ៃយ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, 'comprehension2', NULL, true, true, 100, true, true, '2025-10-14 06:16:54.212', '2025-10-14 06:16:54.213', '2025-10-17 00:38:45.605', 'mentor', 'test_mentor', NULL, '30', 5);
INSERT INTO public.students VALUES (292, NULL, 1, 'រ៉ាន់ រឹទ្ធិសាល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 101, true, true, '2025-10-13 13:43:52.665', '2025-10-13 13:43:52.666', '2025-10-13 14:53:32.625', 'mentor', 'test_mentor', NULL, '000012', 4);
INSERT INTO public.students VALUES (291, NULL, 1, 'សីហា លីនណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 101, true, true, '2025-10-13 13:35:02.949', '2025-10-13 13:35:02.951', '2025-10-13 14:56:55.012', 'mentor', 'test_mentor', NULL, '000011', 5);
INSERT INTO public.students VALUES (307, NULL, 1, 'ឯក ប្រុសពេញ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, 'word_problems', true, true, 101, true, true, '2025-10-13 15:01:51.255', '2025-10-13 15:01:51.257', '2025-10-17 00:28:15.98', 'mentor', 'test_mentor', NULL, '000021', 5);
INSERT INTO public.students VALUES (306, NULL, 1, 'វុន សីហាបញ្ញារិទ្ធ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'division', true, true, 101, true, true, '2025-10-13 14:07:42.459', '2025-10-13 14:07:42.46', '2025-10-17 00:31:54.124', 'mentor', 'test_mentor', NULL, '000020', 4);
INSERT INTO public.students VALUES (308, NULL, 1, 'ទូច ជីងអាន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'division', true, true, 101, true, true, '2025-10-13 15:03:22.711', '2025-10-13 15:03:22.712', '2025-10-17 00:25:37.909', 'mentor', 'test_mentor', NULL, '000022', 4);
INSERT INTO public.students VALUES (311, NULL, 1, 'ធិន សុវណ្ណរាជ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:16:15.017', '2025-10-14 06:16:15.019', '2025-10-14 06:47:44.71', 'mentor', 'test_mentor', NULL, '29', 5);
INSERT INTO public.students VALUES (278, NULL, 34, 'ហេង ស្រីល័ក្ខ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, 'story', NULL, 'story', NULL, true, true, 103, true, true, '2025-10-11 12:25:00.453', '2025-10-11 12:25:00.454', '2025-10-14 11:30:37.978', 'mentor', 'test_mentor', NULL, '000010', 4);
INSERT INTO public.students VALUES (245, NULL, 41, 'លី តៃឡឹង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'division', NULL, 'division', true, true, 17, true, true, '2025-10-11 03:30:11.598', '2025-10-11 03:30:11.601', '2025-10-14 09:06:55.624', 'mentor', 'test_mentor', NULL, '021', 5);
INSERT INTO public.students VALUES (239, NULL, 41, 'ឡាន សិនលី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 02:59:40.661', '2025-10-11 02:59:40.662', '2025-10-14 09:01:31.515', 'mentor', 'test_mentor', NULL, '032', 4);
INSERT INTO public.students VALUES (162, NULL, 29, 'យ៉ា​ន ម៉េងហុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, NULL, NULL, 'word_problems', true, true, 9, true, true, '2025-10-09 14:53:31.95', '2025-10-09 14:53:31.951', '2025-10-15 03:33:17.086', 'mentor', 'test_mentor', NULL, '00014', 5);
INSERT INTO public.students VALUES (241, NULL, 41, 'ម៉ៅ តុលា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'division', NULL, 'word_problems', true, true, 17, true, true, '2025-10-11 03:25:22.901', '2025-10-11 03:25:22.903', '2025-10-14 09:04:41.162', 'mentor', 'test_mentor', NULL, '017', 4);
INSERT INTO public.students VALUES (250, NULL, 41, 'ហម ម៉េងលី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 03:33:42.952', '2025-10-11 03:33:42.953', '2025-10-14 09:08:51.141', 'mentor', 'test_mentor', NULL, '036', 5);
INSERT INTO public.students VALUES (258, NULL, 41, 'កេន កយ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 03:40:26.478', '2025-10-11 03:40:26.481', '2025-10-14 09:08:00.878', 'mentor', 'test_mentor', NULL, '041', 5);
INSERT INTO public.students VALUES (237, NULL, 41, 'បូរ៉ា ឆៃយ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'word_problems', true, true, 17, true, true, '2025-10-11 02:57:56.962', '2025-10-11 02:57:56.963', '2025-10-14 08:59:33.353', 'mentor', 'test_mentor', NULL, NULL, 4);
INSERT INTO public.students VALUES (238, NULL, 41, 'រុណ សុផល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 02:58:00.539', '2025-10-11 02:58:00.54', '2025-10-14 09:03:22.93', 'mentor', 'test_mentor', NULL, '023', 4);
INSERT INTO public.students VALUES (249, NULL, 41, 'រស់ ផាន់ណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 03:32:47.936', '2025-10-11 03:32:47.937', '2025-10-14 09:09:53.925', 'mentor', 'test_mentor', NULL, '022', 5);
INSERT INTO public.students VALUES (313, NULL, 1, 'ពៅ ច័ន្ទមេសា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:17:28.393', '2025-10-14 06:17:28.396', '2025-10-15 12:32:42.026', 'mentor', 'test_mentor', NULL, '31', 5);
INSERT INTO public.students VALUES (318, NULL, 1, 'វុធ សុខដារ៉ាវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:20:32.016', '2025-10-14 06:20:32.017', '2025-10-15 12:34:54.626', 'mentor', 'test_mentor', NULL, '34', 5);
INSERT INTO public.students VALUES (319, NULL, 1, 'ធឿន ប៊ុនថេន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:21:04.052', '2025-10-14 06:21:04.053', '2025-10-15 12:35:38.01', 'mentor', 'test_mentor', NULL, '35', 5);
INSERT INTO public.students VALUES (321, NULL, 1, 'ថាច់ ម៉ីម៉ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:21:58.619', '2025-10-14 06:21:58.62', '2025-10-15 12:37:00.959', 'mentor', 'test_mentor', NULL, '37', 5);
INSERT INTO public.students VALUES (322, NULL, 1, 'ម៉ាន់ ច័ន្ទសច្ចៈ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:22:33.558', '2025-10-14 06:22:33.559', '2025-10-15 12:37:34.045', 'mentor', 'test_mentor', NULL, '38', 5);
INSERT INTO public.students VALUES (326, NULL, 1, 'លៀប លីណាវឌី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:24:56.037', '2025-10-14 06:24:56.038', '2025-10-15 12:49:35.141', 'mentor', 'test_mentor', NULL, '42', 5);
INSERT INTO public.students VALUES (325, NULL, 1, 'ថុល ​លាបហេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:24:17.567', '2025-10-14 06:24:17.569', '2025-10-15 12:50:06.415', 'mentor', 'test_mentor', NULL, '41', 5);
INSERT INTO public.students VALUES (296, NULL, 1, 'ម៉ៃ រ៉ាចន្ទ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 101, true, true, '2025-10-13 13:49:03.982', '2025-10-13 13:49:03.983', '2025-10-17 00:38:58.816', 'mentor', 'test_mentor', NULL, '000016', 4);
INSERT INTO public.students VALUES (320, NULL, 1, 'សាគុណ នីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:21:34.162', '2025-10-14 06:21:34.164', '2025-10-15 12:54:25.788', 'mentor', 'test_mentor', NULL, '36', 5);
INSERT INTO public.students VALUES (323, NULL, 1, 'ផា សុខរក្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:22:58.861', '2025-10-14 06:22:58.862', '2025-10-15 12:55:30.902', 'mentor', 'test_mentor', NULL, '39', 5);
INSERT INTO public.students VALUES (309, NULL, 1, 'សុវណ្ណ វីរៈឧត្តម', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word_problems', NULL, NULL, NULL, 'word_problems', true, true, 101, true, true, '2025-10-13 15:15:31.958', '2025-10-13 15:15:31.959', '2025-10-17 00:20:08.216', 'mentor', 'test_mentor', NULL, '000023', 5);
INSERT INTO public.students VALUES (193, NULL, 1, 'វន សុវត្ថិឌី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-10 09:19:01.968', '2025-10-10 09:19:01.969', '2025-10-14 06:37:59.195', 'mentor', 'test_mentor', NULL, '20 ', 5);
INSERT INTO public.students VALUES (310, NULL, 1, 'ផាន ជូវ័យ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:15:40.196', '2025-10-14 06:15:40.199', '2025-10-14 06:45:47.974', 'mentor', 'test_mentor', NULL, '28', 5);
INSERT INTO public.students VALUES (346, NULL, 1, 'កុឡាប សុខហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:34:46.28', '2025-10-14 06:34:46.281', '2025-10-15 12:38:34.799', 'mentor', 'test_mentor', NULL, '60', 5);
INSERT INTO public.students VALUES (345, NULL, 1, 'រ៉ុត រ៉ានុត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:34:21.489', '2025-10-14 06:34:21.49', '2025-10-15 12:39:35.286', 'mentor', 'test_mentor', NULL, '59', 5);
INSERT INTO public.students VALUES (344, NULL, 1, 'ទ្រីរតនា វិភព', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:33:54.21', '2025-10-14 06:33:54.211', '2025-10-15 12:40:21.552', 'mentor', 'test_mentor', NULL, '58', 5);
INSERT INTO public.students VALUES (343, NULL, 1, 'ណាង ស្រីណុច', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:33:10.496', '2025-10-14 06:33:10.497', '2025-10-15 12:40:58.009', 'mentor', 'test_mentor', NULL, '57', 5);
INSERT INTO public.students VALUES (342, NULL, 1, 'តាំង វណ្ណថេប', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:32:48.71', '2025-10-14 06:32:48.711', '2025-10-15 12:41:26.991', 'mentor', 'test_mentor', NULL, '56', 5);
INSERT INTO public.students VALUES (341, NULL, 1, 'លៀប ដាយុត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:32:15.8', '2025-10-14 06:32:15.801', '2025-10-15 12:42:04.047', 'mentor', 'test_mentor', NULL, '55', 5);
INSERT INTO public.students VALUES (340, NULL, 1, 'យ៉ា សៀវហ្គិច', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:31:43.866', '2025-10-14 06:31:43.867', '2025-10-15 12:42:49.849', 'mentor', 'test_mentor', NULL, '54', 5);
INSERT INTO public.students VALUES (338, NULL, 1, 'មិន វាសនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:30:47.793', '2025-10-14 06:30:47.794', '2025-10-15 12:44:26.781', 'mentor', 'test_mentor', NULL, '52', 5);
INSERT INTO public.students VALUES (337, NULL, 1, 'ប៊ុនរ៉ុង ចាន់ម៉ី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:30:23.606', '2025-10-14 06:30:23.61', '2025-10-15 12:45:04.86', 'mentor', 'test_mentor', NULL, '50 ', 5);
INSERT INTO public.students VALUES (334, NULL, 1, 'នី រក្សា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:28:45.371', '2025-10-14 06:28:45.372', '2025-10-15 12:45:38.088', 'mentor', 'test_mentor', NULL, '51', 5);
INSERT INTO public.students VALUES (333, NULL, 1, 'ខៀវ ផេនអាន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:28:18.944', '2025-10-14 06:28:18.945', '2025-10-15 12:46:01.783', 'mentor', 'test_mentor', NULL, '49', 5);
INSERT INTO public.students VALUES (331, NULL, 1, 'ម៉េត ដារីយ៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:27:24.676', '2025-10-14 06:27:24.677', '2025-10-15 12:47:10.81', 'mentor', 'test_mentor', NULL, '47', 5);
INSERT INTO public.students VALUES (329, NULL, 1, 'ណន សូលី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:26:27.351', '2025-10-14 06:26:27.352', '2025-10-15 12:48:08.371', 'mentor', 'test_mentor', NULL, '45', 5);
INSERT INTO public.students VALUES (328, NULL, 1, 'ផាន ណាត់ឋៈយ៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:25:54.968', '2025-10-14 06:25:54.969', '2025-10-15 12:48:41.039', 'mentor', 'test_mentor', NULL, '44', 5);
INSERT INTO public.students VALUES (405, NULL, 25, 'ស៊ាកលីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, false, 69, false, false, NULL, '2025-11-01 07:30:50.301', '2025-11-01 07:31:53.657', 'teacher', 'production', NULL, '11115', 4);
INSERT INTO public.students VALUES (327, NULL, 1, 'ហូរ យៀកលិញ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:25:27.6', '2025-10-14 06:25:27.601', '2025-10-15 12:49:04.526', 'mentor', 'test_mentor', NULL, '43', 5);
INSERT INTO public.students VALUES (330, NULL, 1, 'រួម ចន្ទដារ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, true, true, 100, true, true, '2025-10-14 06:27:00.4', '2025-10-14 06:27:00.401', '2025-10-17 00:23:50.884', 'mentor', 'test_mentor', NULL, '46', 5);
INSERT INTO public.students VALUES (332, NULL, 1, 'ហួន សភា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension1', NULL, NULL, NULL, 'comprehension2', NULL, true, true, 100, true, true, '2025-10-14 06:27:47.767', '2025-10-14 06:27:47.769', '2025-10-17 00:29:15.132', 'mentor', 'test_mentor', NULL, '48', 5);
INSERT INTO public.students VALUES (339, NULL, 1, 'រិទ្ធ ណារីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, 'comprehension1', NULL, true, true, 100, true, true, '2025-10-14 06:31:15.437', '2025-10-14 06:31:15.438', '2025-10-17 00:33:17.201', 'mentor', 'test_mentor', NULL, '53', 5);
INSERT INTO public.students VALUES (360, NULL, 44, 'ឡុង សុខឃីម', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:34:29.192', '2025-10-14 07:34:29.193', '2025-10-14 07:36:19.145', 'mentor', 'test_mentor', NULL, '072', 4);
INSERT INTO public.students VALUES (359, NULL, 44, 'ហាំ ម៉េងហ៊ុន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:33:47.459', '2025-10-14 07:33:47.46', '2025-10-14 07:37:13.198', 'mentor', 'test_mentor', NULL, '069', 5);
INSERT INTO public.students VALUES (358, NULL, 44, 'ហាន នីកា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:32:43.863', '2025-10-14 07:32:43.864', '2025-10-14 07:38:13.219', 'mentor', 'test_mentor', NULL, '067', 5);
INSERT INTO public.students VALUES (356, NULL, 44, 'វ៉ាន់ ណារ៉ុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:31:55.604', '2025-10-14 07:31:55.605', '2025-10-14 07:40:04.935', 'mentor', 'test_mentor', NULL, '064', 5);
INSERT INTO public.students VALUES (354, NULL, 44, 'សំណាង ម៉េងអ៊ុី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:30:08.5', '2025-10-14 07:30:08.501', '2025-10-14 07:40:51.081', 'mentor', 'test_mentor', NULL, '060', 5);
INSERT INTO public.students VALUES (353, NULL, 44, 'តុលា ស្រីមុំ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_1digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:28:49.421', '2025-10-14 07:28:49.422', '2025-10-14 07:41:31.751', 'mentor', 'test_mentor', NULL, '059', 4);
INSERT INTO public.students VALUES (352, NULL, 44, 'ភី ចាន់ណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_1digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:27:57.899', '2025-10-14 07:27:57.901', '2025-10-14 07:42:40.033', 'mentor', 'test_mentor', NULL, '052', 4);
INSERT INTO public.students VALUES (351, NULL, 44, 'នន់ ចាន់ទី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, NULL, true, true, 6, true, true, '2025-10-14 07:27:16.686', '2025-10-14 07:27:16.687', '2025-10-14 07:43:27.223', 'mentor', 'test_mentor', NULL, '047', 5);
INSERT INTO public.students VALUES (362, NULL, 3, 'ទុំ ដារ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 07:52:50.946', '2025-10-14 07:52:50.947', '2025-10-14 07:52:50.947', 'mentor', 'test_mentor', NULL, '245', 4);
INSERT INTO public.students VALUES (363, NULL, 3, 'ណេត ថាណាក់', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 07:53:36.836', '2025-10-14 07:53:36.837', '2025-10-14 07:53:36.837', 'mentor', 'test_mentor', NULL, '250', 4);
INSERT INTO public.students VALUES (364, NULL, 3, 'យុន រ៉ាវង្ស', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 07:54:15.749', '2025-10-14 07:54:15.75', '2025-10-14 07:54:15.75', 'mentor', 'test_mentor', NULL, '263', 4);
INSERT INTO public.students VALUES (365, NULL, 3, 'ទុំ សេរីរតនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 07:54:47.35', '2025-10-14 07:54:47.351', '2025-10-14 07:54:47.351', 'mentor', 'test_mentor', NULL, '267', 4);
INSERT INTO public.students VALUES (366, NULL, 3, 'ប៉ុន គឹមអេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 07:55:32.096', '2025-10-14 07:55:32.097', '2025-10-14 07:55:32.097', 'mentor', 'test_mentor', NULL, '271', 4);
INSERT INTO public.students VALUES (367, NULL, 3, 'ភាង ភក្តី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 08:01:35.047', '2025-10-14 08:01:35.048', '2025-10-14 08:01:35.048', 'mentor', 'test_mentor', NULL, '280', 5);
INSERT INTO public.students VALUES (368, NULL, 3, 'ក្រាល បូរិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 08:02:09.408', '2025-10-14 08:02:09.409', '2025-10-14 08:02:09.409', 'mentor', 'test_mentor', NULL, '289', 5);
INSERT INTO public.students VALUES (369, NULL, 3, 'គឹម ដាណុល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 08:02:47.454', '2025-10-14 08:02:47.455', '2025-10-14 08:03:10.871', 'mentor', 'test_mentor', NULL, '288', 5);
INSERT INTO public.students VALUES (370, NULL, 3, 'ឃីល ដេវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 08:03:53.477', '2025-10-14 08:03:53.479', '2025-10-14 08:04:12.673', 'mentor', 'test_mentor', NULL, '290', 5);
INSERT INTO public.students VALUES (371, NULL, 3, 'លុយ ម៉េងស៊ីន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 12, true, false, '2025-10-14 08:04:46.215', '2025-10-14 08:04:46.216', '2025-10-14 08:04:46.216', 'mentor', 'test_mentor', NULL, '291', 5);
INSERT INTO public.students VALUES (255, NULL, 41, 'ប៊ុត វាសនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'division', true, true, 17, true, true, '2025-10-11 03:37:31.278', '2025-10-11 03:37:31.28', '2025-10-14 09:02:18.706', 'mentor', 'test_mentor', NULL, '011', 4);
INSERT INTO public.students VALUES (253, NULL, 41, 'មឿន សុខបាន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, 'subtraction', NULL, 'word_problems', true, true, 17, true, true, '2025-10-11 03:35:47.201', '2025-10-11 03:35:47.202', '2025-10-14 09:11:09.353', 'mentor', 'test_mentor', NULL, '020', 5);
INSERT INTO public.students VALUES (149, NULL, 29, 'សុខនី ស្រីល័ក្ខ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'division', NULL, 'subtraction', NULL, 'division', true, true, 9, true, true, '2025-10-09 14:38:58.098', '2025-10-09 14:38:58.101', '2025-10-15 03:12:53.605', 'mentor', 'test_mentor', NULL, '0001', 4);
INSERT INTO public.students VALUES (317, NULL, 1, 'សួស ហុងម៉ីង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:19:41.503', '2025-10-14 06:19:41.504', '2025-10-15 12:34:24.749', 'mentor', 'test_mentor', NULL, '33 ', 5);
INSERT INTO public.students VALUES (324, NULL, 1, 'ហ៊ីម ម៉ារី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, NULL, NULL, true, true, 100, true, true, '2025-10-14 06:23:40.973', '2025-10-14 06:23:40.974', '2025-10-15 12:54:57.029', 'mentor', 'test_mentor', NULL, '40', 5);
INSERT INTO public.students VALUES (294, NULL, 1, 'សំប្បូរ ម៉ីហេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 101, true, true, '2025-10-13 13:47:08.554', '2025-10-13 13:47:08.555', '2025-10-17 01:31:27.308', 'mentor', 'test_mentor', NULL, '000014', 5);
INSERT INTO public.students VALUES (379, NULL, 39, 'គឹម ដាណុល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'division', true, true, 12, true, true, '2025-10-17 02:00:07.42', '2025-10-17 02:00:07.421', '2025-10-17 02:31:49.956', 'mentor', 'test_mentor', NULL, '0231', 5);
INSERT INTO public.students VALUES (378, NULL, 39, 'ក្រាល បូរិន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:59:40.474', '2025-10-17 01:59:40.475', '2025-10-17 02:32:51.472', 'mentor', 'test_mentor', NULL, '0991', 5);
INSERT INTO public.students VALUES (377, NULL, 39, 'ភាង ភក្តី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:59:15.83', '2025-10-17 01:59:15.832', '2025-10-17 02:33:38.782', 'mentor', 'test_mentor', NULL, '0845', 5);
INSERT INTO public.students VALUES (375, NULL, 39, 'ទុំ សេរីរតនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:57:59.668', '2025-10-17 01:57:59.669', '2025-10-18 04:45:06.414', 'mentor', 'test_mentor', NULL, '0452', 4);
INSERT INTO public.students VALUES (372, NULL, 39, 'ទុំ ដារ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:56:33.162', '2025-10-17 01:56:33.164', '2025-10-17 02:23:25.194', 'mentor', 'test_mentor', NULL, '0641', 4);
INSERT INTO public.students VALUES (373, NULL, 39, 'ណេត ថាណាត់', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:57:03.938', '2025-10-17 01:57:03.94', '2025-10-17 02:24:51.846', 'mentor', 'test_mentor', NULL, '0898', 4);
INSERT INTO public.students VALUES (374, NULL, 39, 'យុន រ៉ាវង្ស', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 01:57:30.522', '2025-10-17 01:57:30.523', '2025-10-17 02:25:41.296', 'mentor', 'test_mentor', NULL, '0976', 4);
INSERT INTO public.students VALUES (376, NULL, 39, 'ប៊ុន គឹមអេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'number_2digit', true, true, 12, true, true, '2025-10-17 01:58:23.38', '2025-10-17 01:58:23.382', '2025-10-17 02:27:07.227', 'mentor', 'test_mentor', NULL, '0568', 4);
INSERT INTO public.students VALUES (381, NULL, 39, 'លុយ ម៉េងស៊ីន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, 'word_problems', true, true, 12, true, true, '2025-10-17 02:00:59.071', '2025-10-17 02:00:59.073', '2025-10-17 02:29:50.794', 'mentor', 'test_mentor', NULL, '0873', 5);
INSERT INTO public.students VALUES (380, NULL, 39, 'ឃីល ដេវីត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'number_2digit', NULL, NULL, NULL, 'number_2digit', true, true, 12, true, true, '2025-10-17 02:00:32.634', '2025-10-17 02:00:32.635', '2025-10-17 02:30:36.306', 'mentor', 'test_mentor', NULL, '0129', 5);
INSERT INTO public.students VALUES (383, NULL, 23, ' វង់​ស៊ីវម៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 15, true, false, '2025-10-18 08:12:27.503', '2025-10-18 08:12:27.504', '2025-10-18 08:12:27.504', 'mentor', 'test_mentor', NULL, '0097', 4);
INSERT INTO public.students VALUES (387, NULL, 23, 'រស់​ ភក្តី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, true, 15, true, false, '2025-10-18 08:14:07.29', '2025-10-18 08:14:07.291', '2025-10-18 08:14:07.291', 'mentor', 'test_mentor', NULL, '09876', 4);
INSERT INTO public.students VALUES (393, NULL, 25, 'សៅ សុក្រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 22, false, false, NULL, '2025-10-31 03:27:36.68', '2025-10-31 03:27:36.68', 'teacher', 'production', NULL, '3256', 4);
INSERT INTO public.students VALUES (392, NULL, 6, 'sovath-sovath', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', 'number_2digit', NULL, NULL, NULL, NULL, true, false, 7, true, true, '2025-10-30 10:47:33.879', '2025-10-30 10:47:33.88', '2025-10-31 09:35:35.537', 'mentor', 'production', NULL, '999999', 4);
INSERT INTO public.students VALUES (399, NULL, 25, 'លីណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, 'paragraph', NULL, 'comprehension1', NULL, true, false, 69, false, false, NULL, '2025-11-01 06:49:29.097', '2025-11-01 06:59:20.423', 'teacher', 'production', NULL, '11112', 4);
INSERT INTO public.students VALUES (398, NULL, 25, 'វិបុល', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, false, 69, false, false, NULL, '2025-11-01 06:48:50.438', '2025-11-01 06:53:17.942', 'teacher', 'production', NULL, '11111', 4);
INSERT INTO public.students VALUES (400, NULL, 25, 'ប្រិល រ៉ានី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, NULL, NULL, NULL, NULL, true, false, 69, false, false, NULL, '2025-11-01 07:25:41.6', '2025-11-01 07:30:24.392', 'teacher', 'production', NULL, '11113', 4);
INSERT INTO public.students VALUES (406, NULL, 21, 'កហថ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 66, false, false, NULL, '2025-11-01 07:31:02.588', '2025-11-01 07:31:14.122', 'teacher', 'archived', NULL, '97646', 4);
INSERT INTO public.students VALUES (404, NULL, 24, 'នូ ធីពេញ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, false, 85, false, false, NULL, '2025-11-01 07:29:03.653', '2025-11-01 07:32:00.981', 'teacher', 'production', NULL, ' 20222', 4);
INSERT INTO public.students VALUES (403, NULL, 24, 'ប៉ូ សុខខេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, NULL, true, false, 85, false, false, NULL, '2025-11-01 07:28:11.457', '2025-11-01 07:37:40.231', 'teacher', 'production', NULL, '32109', 4);
INSERT INTO public.students VALUES (26, NULL, 23, 'ស្រេង ករុណា', 11, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'letter', NULL, NULL, NULL, NULL, 'word_problems', false, false, 98, false, true, NULL, '2025-10-05 07:51:23.996', '2025-11-12 01:55:06.101', 'teacher', 'archived', NULL, '0987', 4);
INSERT INTO public.students VALUES (21, NULL, 23, 'ជិន គឹមហុង', 10, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, NULL, 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:49:19.448', '2025-11-12 01:55:32.496', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (407, NULL, 21, 'កក្កដា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'word', NULL, 'story', NULL, 'comprehension2', NULL, false, false, 66, false, false, NULL, '2025-11-01 07:31:39.149', '2025-11-12 02:31:30.981', 'teacher', 'archived', NULL, '44738', 4);
INSERT INTO public.students VALUES (409, NULL, 25, 'រតនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'story', NULL, NULL, NULL, NULL, NULL, true, false, 69, false, false, NULL, '2025-11-01 07:35:40.541', '2025-11-01 07:37:14.09', 'teacher', 'production', NULL, '11116', 4);
INSERT INTO public.students VALUES (416, NULL, 45, 'សុខនី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 73, false, false, NULL, '2025-11-01 07:38:58.48', '2025-11-01 07:38:58.48', 'teacher', 'production', NULL, '25001', 4);
INSERT INTO public.students VALUES (408, NULL, 26, 'សែន ផាលីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, false, 82, false, false, NULL, '2025-11-01 07:34:54.437', '2025-11-01 07:39:14.562', 'teacher', 'production', NULL, '12345', 5);
INSERT INTO public.students VALUES (419, NULL, 26, 'ថា សុធី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 62, false, false, NULL, '2025-11-01 07:39:20.986', '2025-11-01 07:39:20.986', 'teacher', 'production', NULL, '11222', 4);
INSERT INTO public.students VALUES (422, NULL, 20, 'ហៅ ដានីកា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 81, false, false, NULL, '2025-11-01 07:39:50.384', '2025-11-01 07:39:50.384', 'teacher', 'production', NULL, '#2222', 5);
INSERT INTO public.students VALUES (425, NULL, 40, 'នេត្រា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 59, false, false, NULL, '2025-11-01 07:40:21.557', '2025-11-01 07:40:21.557', 'teacher', 'production', NULL, '44456', 5);
INSERT INTO public.students VALUES (428, NULL, 26, 'វី សាវ៉ាត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 62, false, false, NULL, '2025-11-01 07:41:05.002', '2025-11-01 07:41:05.002', 'teacher', 'production', NULL, '22211', 4);
INSERT INTO public.students VALUES (429, NULL, 20, 'ហៅ ដានីតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 81, false, false, NULL, '2025-11-01 07:41:23.924', '2025-11-01 07:41:23.924', 'teacher', 'production', NULL, '#1111', 5);
INSERT INTO public.students VALUES (413, NULL, 2, 'ចាន់ សុភាព', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'subtraction', NULL, NULL, NULL, NULL, true, false, 54, false, false, NULL, '2025-11-01 07:36:45.672', '2025-11-01 07:41:32.531', 'teacher', 'production', NULL, '10001', 4);
INSERT INTO public.students VALUES (430, NULL, 40, 'កែវតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 59, false, false, NULL, '2025-11-01 07:41:43.213', '2025-11-01 07:41:43.213', 'teacher', 'production', NULL, '54673', 4);
INSERT INTO public.students VALUES (431, NULL, 26, 'ពៅ ថារីន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 82, false, false, NULL, '2025-11-01 07:42:01.221', '2025-11-01 07:42:01.221', 'teacher', 'production', NULL, '23456', 5);
INSERT INTO public.students VALUES (432, NULL, 19, 'និម ប៊ុនឡេង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 65, false, false, NULL, '2025-11-01 07:42:20.113', '2025-11-01 07:42:20.113', 'teacher', 'production', NULL, 'កែម លីហ្សា', 4);
INSERT INTO public.students VALUES (433, NULL, 45, 'ចាន់ណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 73, false, false, NULL, '2025-11-01 07:42:23.636', '2025-11-01 07:42:23.636', 'teacher', 'production', NULL, '25002', 4);
INSERT INTO public.students VALUES (434, NULL, 22, 'ហងយក', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 77, false, false, NULL, '2025-11-01 08:01:06.314', '2025-11-01 08:01:18.578', 'teacher', 'archived', NULL, '55578', 4);
INSERT INTO public.students VALUES (435, NULL, 22, 'ធី ថាឈីក', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 77, false, false, NULL, '2025-11-01 08:02:55.445', '2025-11-01 08:03:12.661', 'teacher', 'archived', NULL, '០០០០១', 4);
INSERT INTO public.students VALUES (437, NULL, 4, 'Sovath Test', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'paragraph', NULL, NULL, NULL, NULL, NULL, true, true, 4, true, true, '2025-11-08 15:43:34.771', '2025-11-08 15:43:34.773', '2025-11-08 15:45:06.064', 'mentor', 'test_mentor', NULL, '0123123', 4);
INSERT INTO public.students VALUES (18, NULL, 23, 'សួន សុវណ្ណធារី', 12, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'comprehension2', NULL, NULL, 'number_2digit', 'comprehension2', NULL, false, false, 98, false, true, NULL, '2025-10-05 07:48:30.854', '2025-11-12 01:55:46.304', 'teacher', 'archived', NULL, NULL, NULL);
INSERT INTO public.students VALUES (436, NULL, 21, 'លីកា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, false, false, 115, false, false, NULL, '2025-11-08 09:36:49.408', '2025-11-12 02:31:24.652', 'teacher', 'archived', NULL, '112233', 4);
INSERT INTO public.students VALUES (438, NULL, 21, 'អឿន អេរីន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:37:52.626', '2025-11-12 02:37:52.626', 'teacher', 'production', NULL, '99998', 5);
INSERT INTO public.students VALUES (439, NULL, 21, 'អឿន ណាំណឹង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:38:45.944', '2025-11-12 02:38:45.944', 'teacher', 'production', NULL, '99997', 5);
INSERT INTO public.students VALUES (440, NULL, 21, 'ហ៊ីម ម៉េងល័ង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:39:46.079', '2025-11-12 02:39:46.079', 'teacher', 'production', NULL, '99996', 5);
INSERT INTO public.students VALUES (441, NULL, 21, 'សុវណ្ណនី ស្រីនីត', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:40:45.946', '2025-11-12 02:40:45.946', 'teacher', 'production', NULL, '99995', 5);
INSERT INTO public.students VALUES (442, NULL, 21, 'សារី ចន្ទណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:42:00.623', '2025-11-12 02:42:00.623', 'teacher', 'production', NULL, '99994', 5);
INSERT INTO public.students VALUES (443, NULL, 21, 'សាន ម៉ារី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:43:00.779', '2025-11-12 02:43:00.779', 'teacher', 'production', NULL, '99993', 5);
INSERT INTO public.students VALUES (444, NULL, 21, 'វុទ្ធី វុទ្ធា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:43:59.604', '2025-11-12 02:43:59.604', 'teacher', 'production', NULL, '99992', 5);
INSERT INTO public.students VALUES (445, NULL, 21, 'លួន ស្រីតី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:44:48.664', '2025-11-12 02:44:48.664', 'teacher', 'production', NULL, '99991', 5);
INSERT INTO public.students VALUES (448, NULL, 21, 'យុន នីហ្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:46:54.566', '2025-11-12 02:46:54.566', 'teacher', 'production', NULL, '99990', 5);
INSERT INTO public.students VALUES (449, NULL, 21, 'ម៉ុន ស្រីមួយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:47:55.007', '2025-11-12 02:47:55.007', 'teacher', 'production', NULL, '99989', 5);
INSERT INTO public.students VALUES (450, NULL, 21, 'ម៉ុន ស្រីពី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:49:02.724', '2025-11-12 02:49:02.724', 'teacher', 'production', NULL, '99988', 5);
INSERT INTO public.students VALUES (451, NULL, 21, 'ម៉ឺន ពន្លឺ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:50:11.321', '2025-11-12 02:50:11.321', 'teacher', 'production', NULL, '99987', 5);
INSERT INTO public.students VALUES (452, NULL, 21, 'ម៉ី សុខម៉េង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:51:18.775', '2025-11-12 02:51:18.775', 'teacher', 'production', NULL, '99986', 5);
INSERT INTO public.students VALUES (453, NULL, 21, 'ភារម្យ ជីងជីង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:52:12.592', '2025-11-12 02:52:12.592', 'teacher', 'production', NULL, '99985', 5);
INSERT INTO public.students VALUES (454, NULL, 21, 'ភាព សុវណ្ណ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:53:02.632', '2025-11-12 02:53:02.632', 'teacher', 'production', NULL, '99984', 5);
INSERT INTO public.students VALUES (455, NULL, 21, 'ពិសិដ្ឋ រចនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:54:47.491', '2025-11-12 02:54:47.491', 'teacher', 'production', NULL, '99983', 5);
INSERT INTO public.students VALUES (456, NULL, 21, 'ផល សុផា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 02:58:24.563', '2025-11-12 02:58:24.563', 'teacher', 'production', NULL, '99980', 5);
INSERT INTO public.students VALUES (457, NULL, 21, 'បូរ៉ា ចិនឡេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:08:17.38', '2025-11-12 03:08:17.38', 'teacher', 'production', NULL, '99978', 5);
INSERT INTO public.students VALUES (458, NULL, 21, 'ប៊ុនហ៊ាង ឈុនអេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:09:26.546', '2025-11-12 03:09:26.546', 'teacher', 'production', NULL, '99977', 5);
INSERT INTO public.students VALUES (459, NULL, 21, 'នឿន គឹមសួ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:13:11.384', '2025-11-12 03:13:11.384', 'teacher', 'production', NULL, '99976', 5);
INSERT INTO public.students VALUES (460, NULL, 21, 'ធឿន ស្រីយ៉ា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:14:09.682', '2025-11-12 03:14:09.682', 'teacher', 'production', NULL, '99975', 5);
INSERT INTO public.students VALUES (461, NULL, 21, 'ធិ ទីណា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:14:59.804', '2025-11-12 03:14:59.804', 'teacher', 'production', NULL, '99974', 5);
INSERT INTO public.students VALUES (462, NULL, 21, 'ទិន មុន្នីរ័ត្ន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:15:44.173', '2025-11-12 03:15:44.173', 'teacher', 'production', NULL, '99973', 5);
INSERT INTO public.students VALUES (463, NULL, 21, 'ថាំង ស្រីមួយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:16:33.333', '2025-11-12 03:16:33.333', 'teacher', 'production', NULL, '99970', 5);
INSERT INTO public.students VALUES (464, NULL, 21, 'ថាន់ ម៉េងលី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:18:53.421', '2025-11-12 03:18:53.421', 'teacher', 'production', NULL, '99969', 5);
INSERT INTO public.students VALUES (465, NULL, 21, 'ណាន ម៉េងឡុង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:20:16.194', '2025-11-12 03:20:16.194', 'teacher', 'production', NULL, '99968', 5);
INSERT INTO public.students VALUES (466, NULL, 21, 'ជ័យ ភក្ដី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:21:33.956', '2025-11-12 03:21:33.956', 'teacher', 'production', NULL, '99967', 5);
INSERT INTO public.students VALUES (467, NULL, 21, 'ជាតិ ពន្លក', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:22:13.959', '2025-11-12 03:22:13.959', 'teacher', 'production', NULL, '99966', 5);
INSERT INTO public.students VALUES (468, NULL, 21, 'ឆុង ឆេងហ័រ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:23:06.377', '2025-11-12 03:23:06.377', 'teacher', 'production', NULL, '99965', 5);
INSERT INTO public.students VALUES (469, NULL, 21, 'ចិន្ធូ គីមហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:23:47.289', '2025-11-12 03:23:47.289', 'teacher', 'production', NULL, '99964', 5);
INSERT INTO public.students VALUES (471, NULL, 21, 'គា ស្រីណេ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:47:03.424', '2025-11-12 06:47:03.424', 'teacher', 'production', NULL, '1519', 4);
INSERT INTO public.students VALUES (472, NULL, 21, 'គឺ ហ្សានិត', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:47:41.234', '2025-11-12 06:47:41.234', 'teacher', 'production', NULL, '1478', 4);
INSERT INTO public.students VALUES (473, NULL, 21, 'គ័ង គីមហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:48:25.705', '2025-11-12 06:48:25.705', 'teacher', 'production', NULL, '1520', 4);
INSERT INTO public.students VALUES (474, NULL, 21, 'ចាន់រ៉ូ ចាន់ឌី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:49:59.285', '2025-11-12 06:49:59.285', 'teacher', 'production', NULL, '1521', 4);
INSERT INTO public.students VALUES (475, NULL, 21, 'ឆី ភ័ត្រ្តា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:50:45.42', '2025-11-12 06:50:45.42', 'teacher', 'production', NULL, '1528', 4);
INSERT INTO public.students VALUES (476, NULL, 21, 'ឆេងឡា ចិត្រា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:51:47.846', '2025-11-12 06:51:47.846', 'teacher', 'production', NULL, '1522', 4);
INSERT INTO public.students VALUES (477, NULL, 21, 'ឈួង វិឆៃ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:52:26.179', '2025-11-12 06:52:26.179', 'teacher', 'production', NULL, '1659', 4);
INSERT INTO public.students VALUES (478, NULL, 21, 'ឈៀង កក្កដា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:53:13.949', '2025-11-12 06:53:13.949', 'teacher', 'production', NULL, '1524', 4);
INSERT INTO public.students VALUES (479, NULL, 21, 'ដានី ស្រីពេជ្រ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:53:56.943', '2025-11-12 06:53:56.943', 'teacher', 'production', NULL, '1525', 4);
INSERT INTO public.students VALUES (480, NULL, 21, 'ធារុណ សីហា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:54:28.851', '2025-11-12 06:54:28.851', 'teacher', 'production', NULL, '1492', 4);
INSERT INTO public.students VALUES (470, NULL, 21, 'គាន់ រស្មី', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 66, false, false, NULL, '2025-11-12 03:24:21.733', '2025-11-12 06:54:34.992', 'teacher', 'production', NULL, '1477', 5);
INSERT INTO public.students VALUES (481, NULL, 21, 'នី សុខជា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:55:15.021', '2025-11-12 06:55:15.021', 'teacher', 'production', NULL, '1531', 4);
INSERT INTO public.students VALUES (482, NULL, 21, 'ប៊ី វិណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:56:06.663', '2025-11-12 06:56:06.663', 'teacher', 'production', NULL, '1533', 4);
INSERT INTO public.students VALUES (483, NULL, 21, 'ប៊ុនណាង ស៊ីណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:56:44.755', '2025-11-12 06:56:44.755', 'teacher', 'production', NULL, '1534', 4);
INSERT INTO public.students VALUES (484, NULL, 21, 'បុរី កល្យាណ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:57:20.743', '2025-11-12 06:57:20.743', 'teacher', 'production', NULL, '1536', 4);
INSERT INTO public.students VALUES (485, NULL, 21, 'ផន លីហ្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:58:06.716', '2025-11-12 06:58:06.716', 'teacher', 'production', NULL, '1537', 4);
INSERT INTO public.students VALUES (486, NULL, 21, 'ពៅ អើយសុខហេង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:58:58.199', '2025-11-12 06:58:58.199', 'teacher', 'production', NULL, '1540', 4);
INSERT INTO public.students VALUES (487, NULL, 21, 'ភ័ណ្ឌ ស្រីនាង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 06:59:27.273', '2025-11-12 06:59:27.273', 'teacher', 'production', NULL, '1502', 4);
INSERT INTO public.students VALUES (488, NULL, 21, 'ភ័ណ្ឌ អាមួយគា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:00:02.611', '2025-11-12 07:00:02.611', 'teacher', 'production', NULL, '1541', 4);
INSERT INTO public.students VALUES (489, NULL, 21, 'ភាព ស្រីណូត', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:34:32.145', '2025-11-12 07:34:32.145', 'teacher', 'production', NULL, '1543', 4);
INSERT INTO public.students VALUES (490, NULL, 21, 'ភួង សុវណ្ណភូមិ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:35:09.922', '2025-11-12 07:35:09.922', 'teacher', 'production', NULL, '1509', 4);
INSERT INTO public.students VALUES (491, NULL, 21, 'ម៉ឺន សុធា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:35:50.232', '2025-11-12 07:35:50.232', 'teacher', 'production', NULL, '1544', 4);
INSERT INTO public.students VALUES (492, NULL, 21, 'ម៉ៅ លីហ័រ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:36:27.284', '2025-11-12 07:36:27.284', 'teacher', 'production', NULL, '1545', 4);
INSERT INTO public.students VALUES (493, NULL, 21, 'យាន ចាន់ដារ៉ា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:37:07.979', '2025-11-12 07:37:07.979', 'teacher', 'production', NULL, '1463', 4);
INSERT INTO public.students VALUES (494, NULL, 21, 'យ៉ិតសីហា ម៉ូលីកា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:37:43.576', '2025-11-12 07:37:43.576', 'teacher', 'production', NULL, '1546', 4);
INSERT INTO public.students VALUES (495, NULL, 21, 'យ៉េត ចាន់រតនា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:38:31.174', '2025-11-12 07:38:31.174', 'teacher', 'production', NULL, '1547', 4);
INSERT INTO public.students VALUES (496, NULL, 21, 'រ៉ាត ហានសៀវអ៊ុន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:39:29.261', '2025-11-12 07:39:29.261', 'teacher', 'production', NULL, '1548', 4);
INSERT INTO public.students VALUES (497, NULL, 21, 'រ៉ែម ម៉េងហៀង', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:40:01.456', '2025-11-12 07:40:01.456', 'teacher', 'production', NULL, '1549', 4);
INSERT INTO public.students VALUES (498, NULL, 21, 'លីម ម៉េងសួរ', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:40:47.616', '2025-11-12 07:40:47.616', 'teacher', 'production', NULL, '1507', 4);
INSERT INTO public.students VALUES (499, NULL, 21, 'វណ្ណ: ណារិន', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:41:37.105', '2025-11-12 07:41:37.105', 'teacher', 'production', NULL, '1551', 4);
INSERT INTO public.students VALUES (500, NULL, 21, 'វាសនា បញ្ញា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:44:52.449', '2025-11-12 07:44:52.449', 'teacher', 'production', NULL, '1552', 4);
INSERT INTO public.students VALUES (501, NULL, 21, 'វុទ្ធី លក្ខណា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:45:30.391', '2025-11-12 07:45:30.391', 'teacher', 'production', NULL, '1553', 4);
INSERT INTO public.students VALUES (502, NULL, 21, 'ស៊ាត់ សុខគា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:46:14.004', '2025-11-12 07:46:14.004', 'teacher', 'production', NULL, '1605', 4);
INSERT INTO public.students VALUES (503, NULL, 21, 'សុខ រចនា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:47:14.618', '2025-11-12 07:47:14.618', 'teacher', 'production', NULL, '1554', 4);
INSERT INTO public.students VALUES (504, NULL, 21, 'សុខហួង ជីងជីង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:47:52.364', '2025-11-12 07:47:52.364', 'teacher', 'production', NULL, '1660', 4);
INSERT INTO public.students VALUES (505, NULL, 21, 'សួន ស្រីនាង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:48:23.202', '2025-11-12 07:48:23.202', 'teacher', 'production', NULL, '1555', 4);
INSERT INTO public.students VALUES (506, NULL, 21, 'សេន ភក្តី', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:49:07.563', '2025-11-12 07:49:07.563', 'teacher', 'production', NULL, '1515', 4);
INSERT INTO public.students VALUES (507, NULL, 21, 'សៅ រក្សា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:49:45.054', '2025-11-12 07:49:45.054', 'teacher', 'production', NULL, '1661', 4);
INSERT INTO public.students VALUES (508, NULL, 21, 'សៅ កុសល', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:50:17.121', '2025-11-12 07:50:17.121', 'teacher', 'production', NULL, '1662', 4);
INSERT INTO public.students VALUES (509, NULL, 21, 'ហ៊ាង សេងហាន', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:50:52.18', '2025-11-12 07:50:52.18', 'teacher', 'production', NULL, '1514', 4);
INSERT INTO public.students VALUES (510, NULL, 21, 'ហាន ស៊ីត្រា', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:51:36.436', '2025-11-12 07:51:36.436', 'teacher', 'production', NULL, '1604', 4);
INSERT INTO public.students VALUES (511, NULL, 21, 'ហួរ គីមហួយ', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:52:06.294', '2025-11-12 07:52:06.294', 'teacher', 'production', NULL, '1558', 4);
INSERT INTO public.students VALUES (512, NULL, 21, 'ឡុង ស៊ីវឡាង', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:52:44.493', '2025-11-12 07:52:44.493', 'teacher', 'production', NULL, '1606', 4);
INSERT INTO public.students VALUES (513, NULL, 21, 'ឡុង រតន:', NULL, 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:53:16.806', '2025-11-12 07:53:16.806', 'teacher', 'production', NULL, '1476', 4);
INSERT INTO public.students VALUES (514, NULL, 21, 'ឡេង សុជាតា', NULL, 'female', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 115, false, false, NULL, '2025-11-12 07:53:43.041', '2025-11-12 07:53:43.041', 'teacher', 'production', NULL, '1560', 4);


--
-- Data for Name: teacher_school_assignments; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.teacher_school_assignments VALUES (1, 99, 33, 'Language', 3, '2025-10-20 04:31:00.688', true, 'test', '2025-10-20 04:31:00.688', '2025-10-20 04:31:00.688');
INSERT INTO public.teacher_school_assignments VALUES (2, 99, 37, 'Language', 3, '2025-11-05 05:21:59.712', true, 'តេសត', '2025-11-05 05:21:59.712', '2025-11-05 05:21:59.712');
INSERT INTO public.teacher_school_assignments VALUES (3, 99, 37, 'Math', 3, '2025-11-05 05:22:04.709', true, 'តេសត', '2025-11-05 05:22:04.709', '2025-11-05 05:22:04.709');
INSERT INTO public.teacher_school_assignments VALUES (4, 98, 37, 'Language', 3, '2025-11-05 05:22:31.181', true, 'តេស្ត', '2025-11-05 05:22:31.181', '2025-11-05 05:22:31.181');
INSERT INTO public.teacher_school_assignments VALUES (5, 98, 37, 'Math', 3, '2025-11-05 05:22:39.207', true, 'តេស្ត', '2025-11-05 05:22:39.207', '2025-11-05 05:22:39.207');
INSERT INTO public.teacher_school_assignments VALUES (6, 102, 41, 'Language', 3, '2025-11-06 04:18:28.647', true, 'Test', '2025-11-06 04:18:28.647', '2025-11-06 04:18:28.647');
INSERT INTO public.teacher_school_assignments VALUES (7, 80, 24, 'Language', 3, '2025-11-06 04:49:31.298', true, NULL, '2025-11-06 04:49:31.298', '2025-11-06 04:49:31.298');
INSERT INTO public.teacher_school_assignments VALUES (8, 85, 24, 'Language', 3, '2025-11-06 04:50:00.948', true, NULL, '2025-11-06 04:50:00.948', '2025-11-06 04:50:00.948');
INSERT INTO public.teacher_school_assignments VALUES (9, 106, 29, 'Math', 3, '2025-11-06 05:02:50.507', true, NULL, '2025-11-06 05:02:50.507', '2025-11-06 05:02:50.507');
INSERT INTO public.teacher_school_assignments VALUES (10, 56, 29, 'Math', 3, '2025-11-06 05:04:10.543', true, NULL, '2025-11-06 05:04:10.543', '2025-11-06 05:04:10.543');
INSERT INTO public.teacher_school_assignments VALUES (11, 65, 19, 'Language', 3, '2025-11-06 07:15:33.359', true, NULL, '2025-11-06 07:15:33.359', '2025-11-06 07:15:33.359');
INSERT INTO public.teacher_school_assignments VALUES (12, 83, 19, 'Language', 3, '2025-11-06 07:16:59.139', true, NULL, '2025-11-06 07:16:59.139', '2025-11-06 07:16:59.139');
INSERT INTO public.teacher_school_assignments VALUES (13, 25, 15, 'Math', 3, '2025-11-06 07:23:39.418', true, NULL, '2025-11-06 07:23:39.418', '2025-11-06 07:23:39.418');
INSERT INTO public.teacher_school_assignments VALUES (14, 26, 15, 'Math', 3, '2025-11-06 07:24:04.935', true, NULL, '2025-11-06 07:24:04.935', '2025-11-06 07:24:04.935');
INSERT INTO public.teacher_school_assignments VALUES (15, 42, 13, 'Math', 3, '2025-11-06 07:26:11.437', true, NULL, '2025-11-06 07:26:11.437', '2025-11-06 07:26:11.437');
INSERT INTO public.teacher_school_assignments VALUES (16, 28, 11, 'Math', 3, '2025-11-06 07:28:01.951', true, NULL, '2025-11-06 07:28:01.951', '2025-11-06 07:28:01.951');
INSERT INTO public.teacher_school_assignments VALUES (17, 50, 11, 'Math', 3, '2025-11-06 07:28:29.063', true, NULL, '2025-11-06 07:28:29.063', '2025-11-06 07:28:29.063');
INSERT INTO public.teacher_school_assignments VALUES (18, 44, 9, 'Math', 3, '2025-11-06 07:29:12.554', true, NULL, '2025-11-06 07:29:12.554', '2025-11-06 07:29:12.554');
INSERT INTO public.teacher_school_assignments VALUES (19, 38, 9, 'Math', 3, '2025-11-06 07:29:41.894', true, NULL, '2025-11-06 07:29:41.894', '2025-11-06 07:29:41.894');
INSERT INTO public.teacher_school_assignments VALUES (20, 29, 7, 'Language', 3, '2025-11-06 07:30:21.766', true, NULL, '2025-11-06 07:30:21.766', '2025-11-06 07:30:21.766');
INSERT INTO public.teacher_school_assignments VALUES (21, 33, 5, 'Math', 3, '2025-11-06 07:32:51.166', true, NULL, '2025-11-06 07:32:51.166', '2025-11-06 07:32:51.166');
INSERT INTO public.teacher_school_assignments VALUES (22, 37, 5, 'Math', 3, '2025-11-06 07:33:17.161', true, NULL, '2025-11-06 07:33:17.161', '2025-11-06 07:33:17.161');
INSERT INTO public.teacher_school_assignments VALUES (23, 51, 3, 'Language', 3, '2025-11-06 07:33:54.939', true, NULL, '2025-11-06 07:33:54.939', '2025-11-06 07:33:54.939');
INSERT INTO public.teacher_school_assignments VALUES (24, 31, 3, 'Language', 3, '2025-11-06 07:34:19.249', true, NULL, '2025-11-06 07:34:19.249', '2025-11-06 07:34:19.249');
INSERT INTO public.teacher_school_assignments VALUES (25, 73, 45, 'Math', 3, '2025-11-06 07:41:38.743', true, NULL, '2025-11-06 07:41:38.743', '2025-11-06 07:41:38.743');
INSERT INTO public.teacher_school_assignments VALUES (26, 105, 45, 'Math', 3, '2025-11-06 07:44:37.377', true, NULL, '2025-11-06 07:44:37.377', '2025-11-06 07:44:37.377');
INSERT INTO public.teacher_school_assignments VALUES (27, 104, 31, 'Math', 3, '2025-11-06 07:46:00.393', true, NULL, '2025-11-06 07:46:00.393', '2025-11-06 07:46:00.393');
INSERT INTO public.teacher_school_assignments VALUES (28, 58, 30, 'Math', 3, '2025-11-06 07:48:32.899', true, NULL, '2025-11-06 07:48:32.899', '2025-11-06 07:48:32.899');
INSERT INTO public.teacher_school_assignments VALUES (29, 57, 30, 'Math', 3, '2025-11-06 07:48:59.407', true, NULL, '2025-11-06 07:48:59.407', '2025-11-06 07:48:59.407');
INSERT INTO public.teacher_school_assignments VALUES (30, 62, 26, 'Math', 3, '2025-11-06 07:50:59.982', true, NULL, '2025-11-06 07:50:59.982', '2025-11-06 07:50:59.982');
INSERT INTO public.teacher_school_assignments VALUES (31, 82, 26, 'Math', 3, '2025-11-06 07:51:19.506', true, NULL, '2025-11-06 07:51:19.506', '2025-11-06 07:51:19.506');
INSERT INTO public.teacher_school_assignments VALUES (32, 69, 25, 'Language', 3, '2025-11-06 07:52:02.542', true, NULL, '2025-11-06 07:52:02.542', '2025-11-06 07:52:02.542');
INSERT INTO public.teacher_school_assignments VALUES (33, 67, 23, 'Language', 3, '2025-11-06 07:55:44.404', true, NULL, '2025-11-06 07:55:44.404', '2025-11-06 07:55:44.404');
INSERT INTO public.teacher_school_assignments VALUES (34, 76, 23, 'Language', 3, '2025-11-06 07:56:05', true, NULL, '2025-11-06 07:56:05', '2025-11-06 07:56:05');
INSERT INTO public.teacher_school_assignments VALUES (35, 63, 22, 'Language', 3, '2025-11-06 07:58:01.59', true, NULL, '2025-11-06 07:58:01.59', '2025-11-06 07:58:01.59');
INSERT INTO public.teacher_school_assignments VALUES (36, 77, 22, 'Language', 3, '2025-11-06 07:58:20.032', true, NULL, '2025-11-06 07:58:20.032', '2025-11-06 07:58:20.032');
INSERT INTO public.teacher_school_assignments VALUES (37, 66, 21, 'Language', 3, '2025-11-06 07:58:57.962', true, NULL, '2025-11-06 07:58:57.962', '2025-11-06 07:58:57.962');
INSERT INTO public.teacher_school_assignments VALUES (38, 68, 20, 'Language', 3, '2025-11-06 08:00:41.792', true, NULL, '2025-11-06 08:00:41.792', '2025-11-06 08:00:41.792');
INSERT INTO public.teacher_school_assignments VALUES (39, 81, 20, 'Language', 3, '2025-11-06 08:01:03.44', true, NULL, '2025-11-06 08:01:03.44', '2025-11-06 08:01:03.44');
INSERT INTO public.teacher_school_assignments VALUES (40, 78, 18, 'Language', 3, '2025-11-06 08:01:49.243', true, NULL, '2025-11-06 08:01:49.243', '2025-11-06 08:01:49.243');
INSERT INTO public.teacher_school_assignments VALUES (41, 59, 18, 'Language', 3, '2025-11-06 08:02:11.012', true, NULL, '2025-11-06 08:02:11.012', '2025-11-06 08:02:11.012');
INSERT INTO public.teacher_school_assignments VALUES (42, 55, 17, 'Language', 3, '2025-11-06 08:03:38.338', true, NULL, '2025-11-06 08:03:38.338', '2025-11-06 08:03:38.338');
INSERT INTO public.teacher_school_assignments VALUES (43, 54, 17, 'Math', 3, '2025-11-06 08:04:04.089', true, NULL, '2025-11-06 08:04:04.089', '2025-11-06 08:04:04.089');
INSERT INTO public.teacher_school_assignments VALUES (45, 36, 6, 'Language', 3, '2025-11-06 08:06:44.716', true, NULL, '2025-11-06 08:06:44.716', '2025-11-06 08:06:44.716');
INSERT INTO public.teacher_school_assignments VALUES (46, 30, 1, 'Language', 3, '2025-11-06 08:07:47.235', true, NULL, '2025-11-06 08:07:47.235', '2025-11-06 08:07:47.235');
INSERT INTO public.teacher_school_assignments VALUES (47, 60, 44, 'Math', 3, '2025-11-06 08:08:49.91', true, NULL, '2025-11-06 08:08:49.91', '2025-11-06 08:08:49.91');
INSERT INTO public.teacher_school_assignments VALUES (48, 79, 44, 'Math', 3, '2025-11-06 08:09:06.72', true, NULL, '2025-11-06 08:09:06.72', '2025-11-06 08:09:06.72');
INSERT INTO public.teacher_school_assignments VALUES (49, 46, 14, 'Math', 3, '2025-11-06 08:10:28.345', true, NULL, '2025-11-06 08:10:28.345', '2025-11-06 08:10:28.345');
INSERT INTO public.teacher_school_assignments VALUES (50, 24, 14, 'Math', 3, '2025-11-06 08:10:45.321', true, NULL, '2025-11-06 08:10:45.321', '2025-11-06 08:10:45.321');
INSERT INTO public.teacher_school_assignments VALUES (51, 27, 12, 'Math', 3, '2025-11-06 08:12:28.611', true, NULL, '2025-11-06 08:12:28.611', '2025-11-06 08:12:28.611');
INSERT INTO public.teacher_school_assignments VALUES (52, 35, 12, 'Math', 3, '2025-11-06 08:13:18.969', true, NULL, '2025-11-06 08:13:18.969', '2025-11-06 08:13:18.969');
INSERT INTO public.teacher_school_assignments VALUES (53, 45, 10, 'Math', 3, '2025-11-06 08:14:32.998', true, NULL, '2025-11-06 08:14:32.998', '2025-11-06 08:14:32.998');
INSERT INTO public.teacher_school_assignments VALUES (54, 40, 10, 'Math', 3, '2025-11-06 08:14:50.892', true, NULL, '2025-11-06 08:14:50.892', '2025-11-06 08:14:50.892');
INSERT INTO public.teacher_school_assignments VALUES (55, 23, 8, 'Language', 3, '2025-11-06 08:15:44.607', true, NULL, '2025-11-06 08:15:44.607', '2025-11-06 08:15:44.607');
INSERT INTO public.teacher_school_assignments VALUES (56, 34, 8, 'Language', 3, '2025-11-06 08:16:05.277', true, NULL, '2025-11-06 08:16:05.277', '2025-11-06 08:16:05.277');
INSERT INTO public.teacher_school_assignments VALUES (57, 47, 4, 'Language', 3, '2025-11-06 08:16:58.803', true, NULL, '2025-11-06 08:16:58.803', '2025-11-06 08:16:58.803');
INSERT INTO public.teacher_school_assignments VALUES (58, 22, 4, 'Language', 3, '2025-11-06 08:17:13.982', true, NULL, '2025-11-06 08:17:13.982', '2025-11-06 08:17:13.982');
INSERT INTO public.teacher_school_assignments VALUES (59, 41, 2, 'Language', 3, '2025-11-06 08:17:41.126', true, NULL, '2025-11-06 08:17:41.126', '2025-11-06 08:17:41.126');
INSERT INTO public.teacher_school_assignments VALUES (60, 49, 2, 'Language', 3, '2025-11-06 08:18:02.879', true, NULL, '2025-11-06 08:18:02.879', '2025-11-06 08:18:02.879');
INSERT INTO public.teacher_school_assignments VALUES (61, 60, 32, 'Math', 3, '2025-11-06 08:19:15.894', true, NULL, '2025-11-06 08:19:15.894', '2025-11-06 08:19:15.894');
INSERT INTO public.teacher_school_assignments VALUES (62, 79, 32, 'Math', 3, '2025-11-06 08:19:52.726', true, NULL, '2025-11-06 08:19:52.726', '2025-11-06 08:19:52.726');
INSERT INTO public.teacher_school_assignments VALUES (63, 52, 13, 'Math', 3, '2025-11-06 08:23:31.894', true, NULL, '2025-11-06 08:23:31.894', '2025-11-06 08:23:31.894');
INSERT INTO public.teacher_school_assignments VALUES (64, 64, 25, 'Language', 3, '2025-11-06 08:30:15.941', true, NULL, '2025-11-06 08:30:15.941', '2025-11-06 08:30:15.941');
INSERT INTO public.teacher_school_assignments VALUES (65, 113, 16, 'Math', 3, '2025-11-06 09:25:46.618', true, NULL, '2025-11-06 09:25:46.618', '2025-11-06 09:25:46.618');
INSERT INTO public.teacher_school_assignments VALUES (66, 114, 16, 'Math', 3, '2025-11-06 09:26:04.433', true, NULL, '2025-11-06 09:26:04.433', '2025-11-06 09:26:04.433');
INSERT INTO public.teacher_school_assignments VALUES (67, 110, 6, 'Language', 3, '2025-11-06 09:31:47.533', true, NULL, '2025-11-06 09:31:47.533', '2025-11-06 09:31:47.533');
INSERT INTO public.teacher_school_assignments VALUES (68, 74, 28, 'Math', 3, '2025-11-06 09:34:32.482', true, NULL, '2025-11-06 09:34:32.482', '2025-11-06 09:34:32.482');
INSERT INTO public.teacher_school_assignments VALUES (69, 75, 28, 'Math', 3, '2025-11-06 09:34:50.495', true, NULL, '2025-11-06 09:34:50.495', '2025-11-06 09:34:50.495');
INSERT INTO public.teacher_school_assignments VALUES (70, 105, 27, 'Math', 3, '2025-11-06 09:35:56.735', true, NULL, '2025-11-06 09:35:56.735', '2025-11-06 09:35:56.735');
INSERT INTO public.teacher_school_assignments VALUES (71, 73, 27, 'Math', 3, '2025-11-06 09:36:19.551', true, NULL, '2025-11-06 09:36:19.551', '2025-11-06 09:36:19.551');
INSERT INTO public.teacher_school_assignments VALUES (72, 109, 1, 'Math', 3, '2025-11-06 09:38:21.073', true, NULL, '2025-11-06 09:38:21.073', '2025-11-06 09:38:21.073');
INSERT INTO public.teacher_school_assignments VALUES (73, 111, 7, 'Language', 3, '2025-11-06 09:40:12.675', true, NULL, '2025-11-06 09:40:12.675', '2025-11-06 09:40:12.675');


--
-- Data for Name: teaching_activities; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: test_sessions; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: user_schools; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: admin
--

INSERT INTO public.users VALUES (96, 'test.signup.user', 'test.signup.user@quick.login', 'test.signup.user', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, NULL, NULL, true, '2025-10-02 14:20:16.138', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 33, 'Kampong Cham', 'Kampong Cham City', NULL, NULL, true, false, 'username', 'test.signup.user', false, NULL, '[]');
INSERT INTO public.users VALUES (97, 'phalla.somalina', 'phalla.somalina@quick.login', 'phalla.somalina', NULL, NULL, NULL, 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', NULL, true, '2025-10-03 06:33:55.476', '2025-10-13 08:37:41.738', NULL, NULL, NULL, NULL, NULL, 'khmer', 17, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'username', 'phalla.somalina', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"student_edit\",\"report_view\"]"');
INSERT INTO public.users VALUES (98, 'Vibol', 'Vibol@quick.login', 'Vibol', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\",\"test_assessments\",\"conduct_baseline\",\"complete_profile\"]"', NULL, true, '2025-10-05 07:46:55.159', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 23, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'username', 'Vibol', false, NULL, '"[\"student_view\",\"student_edit\",\"assessment_view\",\"report_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (11, 'Nhim Sokha', 'nhim.sokha', 'nhim.sokha', NULL, NULL, NULL, 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-06 05:13:00.402', true, '2025-09-15 20:36:38', '2025-10-13 08:28:33.1', '2025-10-08 05:13:00.402', NULL, 'All', NULL, NULL, 'khmer', 8, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'nhim.sokha', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (103, 'phannsavoeun', 'phannsavoeun@quick.login', 'phannsavoeun', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', NULL, true, '2025-10-10 13:03:31.613', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 34, 'កំពង់ចាម', 'N/A', NULL, NULL, true, false, 'username', 'phannsavoeun', false, NULL, '"[\"student_view\",\"assessment_view\",\"student_edit\",\"assessment_add\",\"report_view\"]"');
INSERT INTO public.users VALUES (17, 'SAN AUN', 'san.aun', 'san.aun', NULL, NULL, '077910606', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_student_management\",\"add_students\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-11 02:54:25.759', true, '2025-09-15 20:36:40', '2025-10-14 09:15:17.576', '2025-10-13 02:54:25.759', NULL, 'All', NULL, NULL, 'math', 41, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', 'san.aun', false, NULL, '"[\"student_view\",\"student_add\",\"assessment_view\",\"student_edit\",\"assessment_add\",\"report_view\"]"');
INSERT INTO public.users VALUES (18, 'Ms. Chhoeng Marady', 'chhoeng.marady', 'chhoeng.marady', NULL, NULL, '012547170', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', NULL, true, '2025-09-15 20:36:40', '2025-10-13 08:28:33.1', '2025-10-03 00:12:56.647', NULL, 'All', NULL, NULL, 'khmer', 8, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'chhoeng.marady', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"student_edit\",\"report_view\"]"');
INSERT INTO public.users VALUES (100, 'Set.Socheat', 'Set.Socheat@quick.login', 'Set.Socheat', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\",\"test_student_management\",\"add_students\"]"', NULL, true, '2025-10-08 03:28:25.048', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'username', 'Set.Socheat', false, NULL, '"[\"student_add\",\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\",\"student_edit\"]"');
INSERT INTO public.users VALUES (34, 'Ny Cheanichniron', 'ny.cheanichniron.bat@teacher.tarl.edu.kh', 'ny.cheanichniron.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:44', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 60, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'ny.cheanichniron.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (35, 'Oeun Kosal', 'oeun.kosal.bat@teacher.tarl.edu.kh', 'oeun.kosal.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:44', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 64, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'oeun.kosal.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (36, 'On Phors', 'on.phors.bat@teacher.tarl.edu.kh', 'on.phors.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:45', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 58, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'on.phors.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (37, 'Ou Sreynuch', 'ou.sreynuch.bat@teacher.tarl.edu.kh', 'ou.sreynuch.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:45', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 57, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'ou.sreynuch.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (38, 'Pat Sokheng', 'pat.sokheng.bat@teacher.tarl.edu.kh', 'pat.sokheng.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:45', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 61, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'pat.sokheng.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (93, 'viewer', 'viewer@quick.login', 'viewer', NULL, NULL, NULL, NULL, NULL, 'viewer', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, NULL, NULL, true, '2025-09-27 05:57:49.325', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, true, false, 'username', 'viewer', true, '2025-10-02 10:29:16.447162', '[]');
INSERT INTO public.users VALUES (95, 'sanaun123', 'sanaun123@quick.login', 'sanaun123', NULL, NULL, NULL, 'ថ្នាក់ទី៤, ថ្នាក់ទី៥', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\"]"', NULL, true, '2025-10-02 10:01:36.097', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 33, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'username', 'sanaun123', true, '2025-10-02 10:29:16.447162', '"[\"student_view\",\"report_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (28, 'Keo Vesith', 'keo.vesith.bat@teacher.tarl.edu.kh', 'keo.vesith.bat', NULL, NULL, '0963677927', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', NULL, true, '2025-09-15 20:36:43', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 63, 'khmer', 3, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'keo.vesith.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (25, 'Ieang Bunthoeurn', 'ieang.bunthoeurn.bat@teacher.tarl.edu.kh', 'ieang.bunthoeurn.bat', NULL, NULL, '01212121', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', NULL, true, '2025-09-15 20:36:42', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 67, 'both', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'ieang.bunthoeurn.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (23, 'Ho Mealtey', 'ho.mealtey.bat@teacher.tarl.edu.kh', 'ho.mealtey.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:41', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 60, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'ho.mealtey.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (24, 'Hol Phanna', 'hol.phanna.bat@teacher.tarl.edu.kh', 'hol.phanna.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:41', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 66, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'hol.phanna.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (26, 'Kan Ray', 'kan.ray.bat@teacher.tarl.edu.kh', 'kan.ray.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:42', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 67, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'kan.ray.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (27, 'Keo Socheat', 'keo.socheat.bat@teacher.tarl.edu.kh', 'keo.socheat.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:42', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 64, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'keo.socheat.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (30, 'Koe Kimsou', 'koe.kimsou.bat@teacher.tarl.edu.kh', 'koe.kimsou.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:43', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 53, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'koe.kimsou.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (20, 'Ms. Phann Savoeun', 'phann.savoeun', 'phann.savoeun', NULL, NULL, '012950314', 'grade_4', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\"]"', '2025-10-14 11:25:46.642', true, '2025-09-15 20:36:40', '2025-11-01 06:26:21.88', '2025-10-16 11:25:46.642', NULL, 'All', NULL, NULL, 'khmer', 34, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', 'phann.savoeun', false, NULL, '"[\"assessment_view\",\"assessment_add\",\"student_view\"]"');
INSERT INTO public.users VALUES (31, 'Ms. Kheav Sreyoun', 'kheav.sreyoun.bat@teacher.tarl.edu.kh', 'kheav.sreyoun.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:43', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 55, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'kheav.sreyoun.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (32, 'Ms. Ret Sreynak', 'ret.sreynak.bat@teacher.tarl.edu.kh', 'ret.sreynak.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:44', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 68, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'ret.sreynak.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (33, 'Nann Phary', 'nann.phary.bat@teacher.tarl.edu.kh', 'nann.phary.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:44', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 57, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'nann.phary.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (99, 'sovath.c', 'sovath.c@quick.login', 'sovath.c', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, NULL, NULL, true, '2025-10-05 07:47:07.865', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'username', 'sovath.c', false, NULL, '"[\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (19, 'Ms. Horn Socheata', 'horn.socheata', 'horn.socheata', NULL, NULL, '0963265936', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-10-08 02:12:23.403', true, '2025-09-15 20:36:40', '2025-10-13 08:28:33.1', '2025-10-10 02:12:23.403', NULL, 'All', NULL, NULL, 'khmer', 28, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'email', 'horn.socheata', false, NULL, '"[\"student_view\",\"assessment_add\",\"student_edit\"]"');
INSERT INTO public.users VALUES (79, 'Ms. Oll Phaleap', 'oll.phaleap.kam@teacher.tarl.edu.kh', 'oll.phaleap.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:56', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 84, 'Maths', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'oll.phaleap.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (101, 'Son.Naisim', 'Son.Naisim@quick.login', 'Son.Naisim', NULL, NULL, NULL, 'grade_5', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', NULL, true, '2025-10-08 03:30:13.671', '2025-10-17 00:09:55.228', NULL, NULL, NULL, NULL, NULL, 'math', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'username', 'Son.Naisim', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (94, 'Cheaphannha', 'Cheaphannha@quick.login', 'Cheaphannha', NULL, NULL, '077806680', 'grade_4', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', NULL, true, '2025-10-02 09:21:17.284', '2025-10-17 03:40:18.808', NULL, NULL, NULL, NULL, NULL, 'math', 17, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'username', 'Cheaphannha', true, '2025-10-02 10:29:16.447162', '"[\"assessment_view\",\"student_view\",\"student_edit\",\"assessment_add\",\"report_view\"]"');
INSERT INTO public.users VALUES (9, 'Chhorn Sopheak', 'chhorn.sopheak', 'chhorn.sopheak', NULL, NULL, '085959222', 'both', 'khmer', 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\",\"test_assessments\",\"conduct_baseline\",\"complete_profile\"]"', NULL, true, '2025-09-15 20:36:38', '2025-10-15 00:54:24.231', NULL, NULL, NULL, NULL, NULL, 'math', 29, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'email', 'chhorn.sopheak', false, NULL, '"[\"assessment_view\",\"student_view\",\"report_view\",\"student_edit\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (12, 'Noa Cham Roeun', 'noa.cham.roeun', 'noa.cham.roeun', NULL, NULL, '012878787', 'grade_4', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-11 03:08:17.616', true, '2025-09-15 20:36:38', '2025-10-16 08:56:48.364', '2025-10-13 03:08:17.616', NULL, 'All', NULL, NULL, 'math', 39, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', 'noa.cham.roeun', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"student_edit\",\"report_view\"]"');
INSERT INTO public.users VALUES (13, 'Rorn Sareang', 'rorn.sareang', 'rorn.sareang', NULL, NULL, NULL, 'grade_4', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-08 12:24:03.687', true, '2025-09-15 20:36:39', '2025-10-13 08:28:33.1', '2025-10-10 12:24:03.687', NULL, 'All', NULL, NULL, 'math', 13, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'rorn.sareang', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (102, 'Son_Naisim', 'Son_Naisim@quick.login', 'Son_Naisim', NULL, NULL, NULL, 'ថ្នាក់ទី៤', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', NULL, true, '2025-10-10 11:33:10.983', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'username', 'Son_Naisim', false, NULL, NULL);
INSERT INTO public.users VALUES (22, 'Chann Leakeana', 'chann.leakeana.bat@teacher.tarl.edu.kh', 'chann.leakeana.bat', NULL, NULL, '011112233', 'grade_4', 'khmer', 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:41', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 56, 'Khmer', 25, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'chann.leakeana.bat', false, NULL, '"[\"assessment_view\",\"student_view\"]"');
INSERT INTO public.users VALUES (39, 'Pech Peakleka', 'pech.peakleka.bat@teacher.tarl.edu.kh', 'pech.peakleka.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:46', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 68, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'pech.peakleka.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (40, 'Raeun Sovathary', 'raeun.sovathary.bat@teacher.tarl.edu.kh', 'raeun.sovathary.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:46', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 62, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'raeun.sovathary.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (41, 'Rin Vannra', 'rin.vannra.bat@teacher.tarl.edu.kh', 'rin.vannra.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:46', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 54, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'rin.vannra.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (42, 'Rom Ratanak', 'rom.ratanak.bat@teacher.tarl.edu.kh', 'rom.ratanak.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:46', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 65, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'rom.ratanak.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (80, 'Ms. Phann Srey Roth', 'phann.srey.roth.kam@teacher.tarl.edu.kh', 'phann.srey.roth.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:57', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 76, 'Khmer', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'phann.srey.roth.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (78, 'Ms. Nov Pelim', 'nov.pelim.kam@teacher.tarl.edu.kh', 'nov.pelim.kam', NULL, NULL, '016896135', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:31:28.099', true, '2025-09-15 20:36:56', '2025-11-01 07:33:07.295', NULL, NULL, NULL, NULL, 70, 'khmer', 40, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'nov.pelim.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (2, 'System Admin', 'admin@prathaminternational.org', 'admin', NULL, NULL, NULL, NULL, NULL, 'admin', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\"]"', NULL, true, '2025-09-15 20:36:36', '2025-10-18 16:36:09.406', NULL, NULL, NULL, NULL, NULL, 'All', NULL, 'All', NULL, NULL, NULL, true, false, 'email', 'admin', false, NULL, '"[\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (74, 'Ms. HENG NEANG', 'heng.neang.kam@teacher.tarl.edu.kh', 'heng.neang.kam', NULL, NULL, '077596728', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:41:40.565', true, '2025-09-15 20:36:55', '2025-11-01 07:42:06.155', NULL, NULL, NULL, NULL, 80, 'math', 28, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'heng.neang.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (83, 'Ms. Seun Sophary', 'seun.sophary.kam@teacher.tarl.edu.kh', 'seun.sophary.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:57', '2025-11-01 07:27:19.716', NULL, NULL, NULL, NULL, 71, 'Khmer', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'seun.sophary.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (77, 'Ms. My Savy', 'my.savy.kam@teacher.tarl.edu.kh', 'my.savy.kam', NULL, NULL, '0976167545', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:41:09.525', true, '2025-09-15 20:36:56', '2025-11-01 07:41:09.525', NULL, NULL, NULL, NULL, 74, 'khmer', 22, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'my.savy.kam', false, NULL, '"[\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (21, 'Sin Borndoul', 'sin.borndoul', 'sin.borndoul', NULL, NULL, '0963677927', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\"]"', '2025-10-08 14:20:53.587', true, '2025-09-15 20:36:41', '2025-10-13 08:28:33.1', '2025-10-10 14:20:53.587', NULL, 'All', NULL, NULL, 'khmer', 2, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'sin.borndoul', false, NULL, '"[\"student_view\",\"assessment_view\",\"assessment_add\",\"student_edit\"]"');
INSERT INTO public.users VALUES (84, 'Ms. THIN DALIN', 'thin.dalin.kam@teacher.tarl.edu.kh', 'thin.dalin.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:58', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 73, 'Khmer', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'thin.dalin.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (43, 'Sak Samnang', 'sak.samnang.bat@teacher.tarl.edu.kh', 'sak.samnang.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:47', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 58, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'sak.samnang.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (44, 'Sang Sangha', 'sang.sangha.bat@teacher.tarl.edu.kh', 'sang.sangha.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:47', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 61, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'sang.sangha.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (45, 'Seum Sovin', 'seum.sovin.bat@teacher.tarl.edu.kh', 'seum.sovin.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:47', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 62, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'seum.sovin.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (46, 'Soeun Danut', 'soeun.danut.bat@teacher.tarl.edu.kh', 'soeun.danut.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:47', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 66, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'soeun.danut.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (47, 'Sokh Chamrong', 'sokh.chamrong.bat@teacher.tarl.edu.kh', 'sokh.chamrong.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:48', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 56, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'sokh.chamrong.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (48, 'Som Phally', 'som.phally.bat@teacher.tarl.edu.kh', 'som.phally.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:48', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 59, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'som.phally.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (49, 'Sor Kimseak', 'sor.kimseak.bat@teacher.tarl.edu.kh', 'sor.kimseak.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:48', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 54, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'sor.kimseak.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (50, 'Soth Thida', 'soth.thida.bat@teacher.tarl.edu.kh', 'soth.thida.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:48', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 63, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'soth.thida.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (51, 'Tep Sokly', 'tep.sokly.bat@teacher.tarl.edu.kh', 'tep.sokly.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:49', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 55, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'tep.sokly.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (52, 'Thiem Thida', 'thiem.thida.bat@teacher.tarl.edu.kh', 'thiem.thida.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:49', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 65, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'thiem.thida.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (53, 'Thy Sophat', 'thy.sophat.bat@teacher.tarl.edu.kh', 'thy.sophat.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:49', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 53, 'Maths', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'thy.sophat.bat', false, NULL, '[]');
INSERT INTO public.users VALUES (55, 'Moy Sodara', 'moy.sodara.kam@teacher.tarl.edu.kh', 'moy.sodara.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:50', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 69, 'Khmer', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'moy.sodara.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (58, 'Khoem Sithuon', 'khoem.sithuon.kam@teacher.tarl.edu.kh', 'khoem.sithuon.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:51', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 82, 'Maths', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'khoem.sithuon.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (3, 'Coordinator One', 'coordinator@prathaminternational.org', 'coordinator', NULL, NULL, NULL, NULL, NULL, 'coordinator', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\"]"', NULL, true, '2025-09-15 20:36:36', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'All', NULL, 'All', NULL, NULL, NULL, true, false, 'email', 'coordinator', false, NULL, '"[\"report_view\",\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (6, 'Leang Chhun Hourth', 'leang.chhun.hourth', 'leang.chhun.hourth', NULL, NULL, '012263407', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\"]"', '2025-10-14 07:22:56.164', true, '2025-09-15 20:36:37', '2025-10-14 07:36:21.42', '2025-10-16 07:22:56.164', NULL, 'All', NULL, NULL, 'math', 44, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', 'leang.chhun.hourth', false, NULL, '"[\"student_view\",\"assessment_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (56, 'CHHOM BORIN', 'chhom.borin.kam@teacher.tarl.edu.kh', 'chhom.borin.kam', NULL, NULL, '01212112', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-10-13 07:51:34.2', true, '2025-09-15 20:36:50', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, 81, 'khmer', 1, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'chhom.borin.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (61, 'ONN THALIN', 'onn.thalin.kam@teacher.tarl.edu.kh', 'onn.thalin.kam', NULL, NULL, NULL, 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 08:30:51.374', true, '2025-09-15 20:36:51', '2025-11-01 08:30:51.374', NULL, NULL, NULL, NULL, 83, 'math', 31, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'onn.thalin.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (82, 'Ms. SEIHA RATANA', 'seiha.ratana.kam@teacher.tarl.edu.kh', 'seiha.ratana.kam', NULL, NULL, '060916728', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:33:08.639', true, '2025-09-15 20:36:57', '2025-11-01 07:39:16.827', NULL, NULL, NULL, NULL, 78, 'both', 26, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'seiha.ratana.kam', false, NULL, '"[\"student_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (85, 'Nheb Channin', '.nheb.channin.kam@teacher.tarl.edu.kh', 'nheb.channin.kam', NULL, NULL, ' 010323903', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:25:00.951', true, '2025-09-15 20:36:58', '2025-11-01 07:32:06.189', NULL, NULL, NULL, NULL, 76, 'khmer', 24, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'nheb.channin.kam', false, NULL, '"[\"student_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (59, 'Neang Spheap', 'neang.spheap.kam@teacher.tarl.edu.kh', 'neang.spheap.kam', NULL, NULL, '010522072', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:31:16.788', true, '2025-09-15 20:36:51', '2025-11-01 07:33:57.373', NULL, NULL, NULL, NULL, 70, 'khmer', 40, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'neang.spheap.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (62, 'Pheap sreynith', 'pheap.sreynith.kam@teacher.tarl.edu.kh', 'pheap.sreynith.kam', NULL, NULL, '015793292', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:33:13.304', true, '2025-09-15 20:36:52', '2025-11-01 07:37:24.31', NULL, NULL, NULL, NULL, 78, 'both', 26, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'pheap.sreynith.kam', false, NULL, '"[\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (4, 'Deab Chhoeun', 'deab.chhoeun', 'deab.chhoeun', NULL, NULL, '092751997', 'grade_4', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"plan_visits\"]"', '2025-10-08 10:30:48.079', true, '2025-09-15 20:36:36', '2025-11-08 15:55:25.624', '2025-10-10 10:30:48.079', NULL, 'All', NULL, NULL, 'khmer', 4, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'deab.chhoeun', false, NULL, '"[\"student_add\",\"student_view\",\"assessment_add\",\"assessment_view\",\"mentoring_add\"]"');
INSERT INTO public.users VALUES (8, 'Mentor Two', 'mentor2@prathaminternational.org', 'mentor2', NULL, NULL, NULL, NULL, NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:37', '2025-10-13 08:28:33.1', NULL, NULL, NULL, NULL, NULL, 'All', NULL, 'All', NULL, NULL, NULL, true, false, 'email', 'mentor2', false, NULL, '[]');
INSERT INTO public.users VALUES (5, 'Heap Sophea', 'heap.sophea', 'heap.sophea', NULL, NULL, '0312512717', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-08 12:12:41.269', true, '2025-09-15 20:36:37', '2025-10-13 08:28:33.1', '2025-10-10 12:12:41.269', NULL, 'All', NULL, NULL, 'math', 9, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'heap.sophea', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (14, 'Sorn Sophaneth', 'sorn.sophaneth', 'sorn.sophaneth', NULL, NULL, '092 702 882', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-08 12:58:39.402', true, '2025-09-15 20:36:39', '2025-10-13 08:28:33.1', '2025-10-10 12:58:39.402', NULL, 'All', NULL, NULL, 'math', 8, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'sorn.sophaneth', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (16, 'El Kunthea', 'el.kunthea', 'el.kunthea', NULL, NULL, '011788573', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"track_progress\",\"test_assessments\",\"conduct_baseline\"]"', '2025-10-10 09:41:49.709', true, '2025-09-15 20:36:39', '2025-10-13 08:28:33.1', '2025-10-12 09:41:49.709', NULL, 'All', NULL, NULL, 'khmer', 40, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', 'el.kunthea', false, NULL, '"[\"student_view\",\"assessment_view\",\"report_view\",\"student_edit\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (1, 'Kairav Admin', 'kairav@prathaminternational.org', 'kairav', NULL, NULL, NULL, NULL, NULL, 'admin', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\"]"', NULL, true, '2025-09-15 20:36:36', '2025-10-18 17:08:40.478', NULL, NULL, NULL, NULL, NULL, 'All', NULL, 'All', NULL, NULL, NULL, true, false, 'email', 'kairav', false, NULL, '"[\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (29, 'Khim Kosal', 'khim.kosal.bat@teacher.tarl.edu.kh', 'khim.kosal.bat', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:43', '2025-10-31 03:22:44.376', NULL, NULL, NULL, NULL, 59, 'Khmer', NULL, 'Battambang', NULL, NULL, NULL, true, false, 'email', 'khim.kosal.bat', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (15, 'Eam Vichhak Rith', 'eam.vichhak.rith', 'eam.vichhak.rith', NULL, NULL, '0976209323', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\"]"', '2025-10-17 02:41:23.709', true, '2025-09-15 20:36:39', '2025-10-18 08:08:32.332', '2025-10-19 02:41:23.709', NULL, 'All', NULL, NULL, 'khmer', 23, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'email', 'eam.vichhak.rith', false, NULL, '"[\"student_view\",\"assessment_add\",\"student_edit\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (7, 'Mentor One', 'mentor1@prathaminternational.org', 'mentor1', NULL, NULL, NULL, NULL, NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"plan_visits\",\"test_assessments\",\"conduct_baseline\"]"', NULL, true, '2025-09-15 20:36:37', '2025-10-30 10:48:01.381', NULL, NULL, NULL, NULL, NULL, 'All', 6, 'Battambang', 'Battambang', NULL, NULL, true, false, 'email', 'mentor1', false, NULL, '"[\"mentoring_add\",\"assessment_view\",\"student_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (72, 'Ms. HENG CHHENGKY', 'heng.chhengky.kam@teacher.tarl.edu.kh', 'heng.chhengky.kam', NULL, NULL, '097270522', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:42:51.4', true, '2025-09-15 20:36:54', '2025-11-01 07:42:51.4', NULL, NULL, NULL, NULL, 83, 'math', 31, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'heng.chhengky.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (71, 'Ms. HEAK TOM', 'heak.tom.kam@teacher.tarl.edu.kh', 'heak.tom.kam', NULL, NULL, NULL, 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 08:28:10.362', true, '2025-09-15 20:36:54', '2025-11-01 08:28:10.362', NULL, NULL, NULL, NULL, 81, 'math', 29, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'heak.tom.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (57, 'Hoat Vimol', 'hoat.vimol.kam@teacher.tarl.edu.kh', 'hoat.vimol.kam', NULL, NULL, '012828760', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:39:36.191', true, '2025-09-15 20:36:50', '2025-11-01 07:39:36.191', NULL, NULL, NULL, NULL, 82, 'math', 30, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'hoat.vimol.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (81, 'Ms. Phornd sokThy', 'phornd.sokthy.kam@teacher.tarl.edu.kh', 'phornd.sokthy.kam', NULL, NULL, '966906676', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:34:42.297', true, '2025-09-15 20:36:57', '2025-11-01 07:34:42.297', NULL, NULL, NULL, NULL, 72, 'khmer', 20, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'phornd.sokthy.kam', false, NULL, '"[\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (69, 'Ms. Chan Kimsrorn', 'chan.kimsrorn.kam@teacher.tarl.edu.kh', 'chan.kimsrorn.kam', NULL, NULL, '011112233', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"track_progress\"]"', '2025-10-05 07:26:18.494', true, '2025-09-15 20:36:54', '2025-11-01 07:30:27.045', NULL, NULL, NULL, NULL, 77, 'both', 25, 'Kampong Cham', 'Kampong Cham', NULL, NULL, true, false, 'email', 'chan.kimsrorn.kam', false, NULL, '"[\"student_view\",\"assessment_view\",\"assessment_add\",\"report_view\",\"student_edit\"]"');
INSERT INTO public.users VALUES (63, 'Phoeurn Virath', 'phoeurn.virath.kam@teacher.tarl.edu.kh', 'phoeurn.virath.kam', NULL, NULL, '0976166211', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:23:57.82', true, '2025-09-15 20:36:52', '2025-11-01 07:31:37.016', NULL, NULL, NULL, NULL, 74, 'khmer', 22, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'phoeurn.virath.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (73, 'Ms. Heng Navy', 'heng.navy.kam@teacher.tarl.edu.kh', 'heng.navy.kam', NULL, NULL, '0969705169', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:35:09.707', true, '2025-09-15 20:36:55', '2025-11-01 07:35:09.707', NULL, NULL, NULL, NULL, 79, 'math', 45, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'heng.navy.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (65, 'Say Kamsath', 'say.kamsath.kam@teacher.tarl.edu.kh', 'say.kamsath.kam', NULL, NULL, '093608648', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:37:18.665', true, '2025-09-15 20:36:53', '2025-11-01 07:37:32.915', NULL, NULL, NULL, NULL, 71, 'both', 19, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'say.kamsath.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (54, 'Chea Putthyda', 'chea.putthyda.kam@teacher.tarl.edu.kh', 'chea.putthyda.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:50', '2025-11-01 07:41:34.087', NULL, NULL, NULL, NULL, 69, 'Maths', 2, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'chea.putthyda.kam', false, NULL, '"[\"student_view\",\"assessment_add\"]"');
INSERT INTO public.users VALUES (67, 'Sum Chek', 'sum.chek.kam@teacher.tarl.edu.kh', 'sum.chek.kam', NULL, NULL, '0977660039', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:39:03.968', true, '2025-09-15 20:36:53', '2025-11-01 07:39:46.798', NULL, NULL, NULL, NULL, 75, 'khmer', 23, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'sum.chek.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (64, 'Phuong Pheap', 'phuong.pheap.kam@teacher.tarl.edu.kh', 'phuong.pheap.kam', NULL, NULL, NULL, NULL, NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, 'null', NULL, true, '2025-09-15 20:36:52', '2025-11-01 08:34:12.796', NULL, NULL, NULL, NULL, 77, 'Khmer', NULL, 'Kampong Cham', NULL, NULL, NULL, true, false, 'email', 'phuong.pheap.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (76, 'Ms. Mach Serynak', 'mach.serynak.kam@teacher.tarl.edu.kh', 'mach.serynak.kam', NULL, NULL, '0975393392', 'grade_5', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"track_progress\"]"', NULL, true, '2025-09-15 20:36:56', '2025-11-12 01:51:56.89', NULL, NULL, NULL, NULL, 75, 'khmer', 23, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'mach.serynak.kam', false, NULL, '"[\"student_view\",\"assessment_view\",\"report_view\"]"');
INSERT INTO public.users VALUES (75, 'Ms. HIM SOKHALEAP', 'him.sokhaleap.kam@teacher.tarl.edu.kh', 'him.sokhaleap.kam', NULL, NULL, '86323116', 'grade_5', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:31:23.456', true, '2025-09-15 20:36:55', '2025-11-01 07:32:03.848', NULL, NULL, NULL, NULL, 80, 'math', 28, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'him.sokhaleap.kam', false, NULL, '"[\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (66, 'SORM VANNAK', 'sorm.vannak.kam@teacher.tarl.edu.kh', 'sorm.vannak.kam', NULL, NULL, '0962447805', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\"]"', '2025-11-01 07:28:41.911', true, '2025-09-15 20:36:53', '2025-11-12 06:54:36.678', NULL, NULL, NULL, NULL, 73, 'khmer', 21, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'sorm.vannak.kam', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"student_edit\"]"');
INSERT INTO public.users VALUES (60, 'Nov Barang', 'nov.barang.kam@teacher.tarl.edu.kh', 'nov.barang.kam', NULL, NULL, '0886743726', 'grade_4', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"track_progress\",\"complete_profile\"]"', '2025-11-01 07:31:37.281', true, '2025-09-15 20:36:51', '2025-11-01 07:38:47.212', NULL, NULL, NULL, NULL, 84, 'math', 44, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'nov.barang.kam', false, NULL, '"[\"student_view\",\"report_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (107, 'Chhinh Sovath', 'chhinh_sovath@tarl.local', 'chhinh_sovath', NULL, NULL, '077806680', NULL, NULL, 'teacher', NULL, '$2b$12$ZP8PY3EVm7Cp/WPscW1L2.ZYUcTbhBpkGJ8chYIApYkuRtCUnJtV6', NULL, NULL, NULL, true, '2025-11-06 08:23:56.579', '2025-11-06 08:23:56.579', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 41, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (108, 'sovath sovath', 'sovath_sovath@tarl.local', 'sovath_sovath', NULL, NULL, '016665544', NULL, NULL, 'teacher', NULL, '$2b$12$m.mxLYYi9shDinXPTllkfex6G59WgZLOOcopzd9HJxUeyjJtLQo1C', NULL, NULL, NULL, true, '2025-11-06 08:57:51.162', '2025-11-06 08:57:51.162', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 6, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (68, 'Teour phanna', 'teour.phanna.kam@teacher.tarl.edu.kh', 'teour.phanna.kam', NULL, NULL, '093423567', 'both', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:38:35.34', true, '2025-09-15 20:36:53', '2025-11-01 07:42:07.755', NULL, NULL, NULL, NULL, 72, 'khmer', 20, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'teour.phanna.kam', false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (104, 'HENGCHHENGkY', 'HENGCHHENGkY@quick.login', 'HENGCHHENGkY', NULL, NULL, '0972705229', 'grade_4', NULL, 'teacher', NULL, '$2b$10$dLP39Xhju7HZXAqISzQKue9IYca.JCQ5GrsQo04yiOZz/r2pGwNQS', NULL, NULL, NULL, true, '2025-11-01 08:00:00.32', '2025-11-01 08:02:20.801', NULL, NULL, NULL, NULL, NULL, 'math', 31, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'username', 'HENGCHHENGkY', false, NULL, NULL);
INSERT INTO public.users VALUES (109, 'Orn Veasna', 'orn_veasna@tarl.local', 'orn_veasna', NULL, NULL, '0967838282', NULL, NULL, 'teacher', NULL, '$2b$12$uWyiGxt5kdaLHVRQ4yO8XurFMI.WJn4LPWrzFFixDg7N3aihwDIaW', NULL, NULL, NULL, true, '2025-11-06 09:10:09.556', '2025-11-06 09:10:09.556', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 1, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (110, 'Sak Sopheap', 'sak_sopheap@tarl.local', 'sak_sopheap', NULL, NULL, '078470074', NULL, NULL, 'teacher', NULL, '$2b$12$SqmNyEXsdtI95J29ZC/Aq.HYyhgmMeZFmZ/KmqyGk3ojmbkBF6jI.', NULL, NULL, NULL, true, '2025-11-06 09:11:28.303', '2025-11-06 09:11:28.303', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 6, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (70, 'Ms. Hort Kunthea', 'chhorn.srey.pov.kam@teacher.tarl.edu.kh', 'chhorn.srey.pov.kam', NULL, NULL, '0884877577', 'grade_5', NULL, 'teacher', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\"]"', '2025-11-01 07:36:46.829', true, '2025-09-15 20:36:54', '2025-11-01 08:25:46.357', NULL, NULL, NULL, NULL, 79, 'math', 45, 'កំពង់ចាម', 'កងមាស', NULL, NULL, true, false, 'email', 'chhorn.srey.pov.kam', false, NULL, '[]');
INSERT INTO public.users VALUES (10, 'Em Rithy', 'em.rithy', 'em.rithy', NULL, NULL, '098740793', 'both', NULL, 'mentor', NULL, '$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe', NULL, '"[\"complete_profile\",\"test_assessments\",\"conduct_baseline\",\"plan_visits\"]"', '2025-10-10 01:21:33.405', true, '2025-09-15 20:36:38', '2025-11-05 05:53:58.871', '2025-10-12 01:21:33.405', NULL, 'All', NULL, NULL, 'khmer', 37, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', 'em.rithy', false, NULL, '"[\"student_view\",\"assessment_add\",\"assessment_view\",\"mentoring_add\"]"');
INSERT INTO public.users VALUES (106, 'Seng Orn', 'sengorn@gmail.com', 'sengorn', NULL, NULL, '011112233', NULL, NULL, 'teacher', NULL, '$2b$12$KPFNmOyxGBa49rn3q4CJzem2dGWSDwg5XneTVCyqPlHC2ZK6dEi.m', NULL, NULL, NULL, true, '2025-11-06 05:01:07.678', '2025-11-06 05:01:07.678', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', NULL, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (112, 'Roeum Pirann', 'roeum_pirann@tarl.local', 'roeum_pirann', NULL, NULL, '081256096', NULL, NULL, 'teacher', NULL, '$2b$12$jT3q3BpcqF0bAnCzogKnRe39nEcF97emJYipSFpv9cyUFlA21Ivq2', NULL, NULL, NULL, true, '2025-11-06 09:15:28.656', '2025-11-06 09:15:28.656', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 12, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (113, 'Phal Sophea', 'phal_sophea@tarl.local', 'phal_sophea', NULL, NULL, '016208382', NULL, NULL, 'teacher', NULL, '$2b$12$r3o7Mx/hAw/zT27LiD8D3uBWd./nH6rOVpjRvQflpBPhn/FPrZNYa', NULL, NULL, NULL, true, '2025-11-06 09:17:30.657', '2025-11-06 09:17:30.657', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 16, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (114, 'Seng Tola', 'seng_tola@tarl.local', 'seng_tola', NULL, NULL, '0969858281', NULL, NULL, 'teacher', NULL, '$2b$12$kKM6vdt4f2zXRfNlvbUhy.fZxi8x1VLXjuWXH8NOggQvk7r63J.u.', NULL, NULL, NULL, true, '2025-11-06 09:18:37.792', '2025-11-06 09:18:37.792', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 16, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (116, 'Kong Vengkorng', 'kong_vengkorng@tarl.local', 'kong_vengkorng', NULL, NULL, '0714499649', NULL, NULL, 'teacher', NULL, '$2b$12$6aU/NlxpzPMWAGOTWegQ7.TTqbZHvzNeHNQVzisH4FdQoucVlAoGq', NULL, NULL, NULL, true, '2025-11-06 09:22:45.658', '2025-11-06 09:22:45.658', NULL, NULL, NULL, NULL, NULL, 'គណិតវិទ្យា', 31, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, NULL);
INSERT INTO public.users VALUES (115, 'Hak Leng', 'hak_leng@tarl.local', 'hak_leng', NULL, NULL, '0964158937', NULL, NULL, 'teacher', NULL, '$2b$12$4kQ85M2EMdx5ZkZv6jLsj.fBsOhSpppDbiOJW4ZMthc43LD8.PCUG', NULL, NULL, NULL, true, '2025-11-06 09:20:19.521', '2025-11-08 09:36:23.825', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 21, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, '"[\"student_view\"]"');
INSERT INTO public.users VALUES (105, 'Hort Kunthea', 'HortKunthea@gmail.com', 'HortKunthea', NULL, NULL, 'admin123', NULL, NULL, 'teacher', NULL, '$2b$12$MwhVAYdZELbYUnilZ/vOreNkspMjrWNmPvKxnKoD.ehsJT9.RWKuW', NULL, '"[\"track_progress\"]"', NULL, true, '2025-11-06 04:41:36.435', '2025-11-08 15:36:31.583', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', NULL, 'កំពង់ចាម', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, '"[\"report_view\",\"student_view\",\"assessment_view\"]"');
INSERT INTO public.users VALUES (111, 'Nin Phearompomnita', 'nin_phearompomnita@tarl.local', 'nin_phearompomnita', NULL, NULL, '0882434682', NULL, NULL, 'teacher', NULL, '$2b$12$QUxfjvV.3qAARO4aJW6zJutj.NqPlbygmHFFFI4sW8A8juVF6qxbu', NULL, NULL, NULL, true, '2025-11-06 09:13:17.953', '2025-11-10 13:58:55.386', NULL, NULL, NULL, NULL, NULL, 'ភាសាខ្មែរ', 7, 'បាត់ដំបង', NULL, NULL, NULL, true, false, 'email', NULL, false, NULL, '"[\"student_view\"]"');


--
-- Name: assessment_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assessment_histories_id_seq', 26, true);


--
-- Name: assessment_locks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assessment_locks_id_seq', 1, false);


--
-- Name: assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.assessments_id_seq', 493, true);


--
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: bulk_imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.bulk_imports_id_seq', 1, false);


--
-- Name: clusters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.clusters_id_seq', 1, false);


--
-- Name: dashboard_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.dashboard_stats_id_seq', 3, true);


--
-- Name: intervention_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.intervention_programs_id_seq', 1, false);


--
-- Name: ip_whitelist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.ip_whitelist_id_seq', 1, false);


--
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.mentor_school_assignments_id_seq', 49, true);


--
-- Name: mentoring_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.mentoring_visits_id_seq', 5, true);


--
-- Name: pilot_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.pilot_schools_id_seq', 24, true);


--
-- Name: progress_trackings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.progress_trackings_id_seq', 1, false);


--
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, false);


--
-- Name: quick_login_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.quick_login_users_id_seq', 95, true);


--
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.rate_limits_id_seq', 1, false);


--
-- Name: report_exports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.report_exports_id_seq', 1, false);


--
-- Name: resource_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.resource_views_id_seq', 1, false);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.resources_id_seq', 1, false);


--
-- Name: school_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.school_classes_id_seq', 1, false);


--
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.schools_id_seq', 1, false);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.student_assessment_eligibilities_id_seq', 1, false);


--
-- Name: student_interventions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.student_interventions_id_seq', 1, false);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.students_id_seq', 514, true);


--
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.teacher_school_assignments_id_seq', 73, true);


--
-- Name: teaching_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.teaching_activities_id_seq', 1, false);


--
-- Name: user_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_schools_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.users_id_seq', 116, true);


--
-- Name: assessment_histories assessment_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_pkey PRIMARY KEY (id);


--
-- Name: assessment_locks assessment_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_pkey PRIMARY KEY (id);


--
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: bulk_imports bulk_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.bulk_imports
    ADD CONSTRAINT bulk_imports_pkey PRIMARY KEY (id);


--
-- Name: clusters clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- Name: dashboard_stats dashboard_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.dashboard_stats
    ADD CONSTRAINT dashboard_stats_pkey PRIMARY KEY (id);


--
-- Name: intervention_programs intervention_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.intervention_programs
    ADD CONSTRAINT intervention_programs_pkey PRIMARY KEY (id);


--
-- Name: ip_whitelist ip_whitelist_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ip_whitelist
    ADD CONSTRAINT ip_whitelist_pkey PRIMARY KEY (id);


--
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_pilot_school_id_subject_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_pilot_school_id_subject_key UNIQUE (mentor_id, pilot_school_id, subject);


--
-- Name: mentor_school_assignments mentor_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pkey PRIMARY KEY (id);


--
-- Name: mentoring_visits mentoring_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pkey PRIMARY KEY (id);


--
-- Name: pilot_schools pilot_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.pilot_schools
    ADD CONSTRAINT pilot_schools_pkey PRIMARY KEY (id);


--
-- Name: progress_trackings progress_trackings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.progress_trackings
    ADD CONSTRAINT progress_trackings_pkey PRIMARY KEY (id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: quick_login_users quick_login_users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.quick_login_users
    ADD CONSTRAINT quick_login_users_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: report_exports report_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_pkey PRIMARY KEY (id);


--
-- Name: resource_views resource_views_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resource_views
    ADD CONSTRAINT resource_views_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: school_classes school_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_pkey PRIMARY KEY (id);


--
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: student_assessment_eligibilities student_assessment_eligibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_pkey PRIMARY KEY (id);


--
-- Name: student_interventions student_interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: teacher_school_assignments teacher_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pkey PRIMARY KEY (id);


--
-- Name: teaching_activities teaching_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_pkey PRIMARY KEY (id);


--
-- Name: test_sessions test_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.test_sessions
    ADD CONSTRAINT test_sessions_pkey PRIMARY KEY (id);


--
-- Name: user_schools user_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_schools
    ADD CONSTRAINT user_schools_pkey PRIMARY KEY (id);


--
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_login_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_login_key UNIQUE (username_login);


--
-- Name: assessment_histories_assessment_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessment_histories_assessment_id_idx ON public.assessment_histories USING btree (assessment_id);


--
-- Name: assessment_locks_assessment_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessment_locks_assessment_id_idx ON public.assessment_locks USING btree (assessment_id);


--
-- Name: assessment_locks_assessment_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX assessment_locks_assessment_id_key ON public.assessment_locks USING btree (assessment_id);


--
-- Name: assessments_assessed_by_mentor_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_assessed_by_mentor_idx ON public.assessments USING btree (assessed_by_mentor);


--
-- Name: assessments_assessed_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_assessed_date_idx ON public.assessments USING btree (assessed_date);


--
-- Name: assessments_assessment_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_assessment_type_idx ON public.assessments USING btree (assessment_type);


--
-- Name: assessments_is_locked_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_is_locked_idx ON public.assessments USING btree (is_locked);


--
-- Name: assessments_is_temporary_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_is_temporary_idx ON public.assessments USING btree (is_temporary);


--
-- Name: assessments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_pilot_school_id_idx ON public.assessments USING btree (pilot_school_id);


--
-- Name: assessments_record_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_record_status_idx ON public.assessments USING btree (record_status);


--
-- Name: assessments_student_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_student_id_idx ON public.assessments USING btree (student_id);


--
-- Name: assessments_subject_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_subject_idx ON public.assessments USING btree (subject);


--
-- Name: assessments_test_session_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_test_session_id_idx ON public.assessments USING btree (test_session_id);


--
-- Name: assessments_verified_by_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX assessments_verified_by_id_idx ON public.assessments USING btree (verified_by_id);


--
-- Name: attendance_records_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_date_idx ON public.attendance_records USING btree (date);


--
-- Name: attendance_records_student_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_student_id_idx ON public.attendance_records USING btree (student_id);


--
-- Name: attendance_records_teacher_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX attendance_records_teacher_id_idx ON public.attendance_records USING btree (teacher_id);


--
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- Name: audit_logs_resource_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_resource_id_idx ON public.audit_logs USING btree (resource_id);


--
-- Name: audit_logs_resource_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_resource_type_idx ON public.audit_logs USING btree (resource_type);


--
-- Name: audit_logs_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_status_idx ON public.audit_logs USING btree (status);


--
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- Name: audit_logs_user_role_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX audit_logs_user_role_idx ON public.audit_logs USING btree (user_role);


--
-- Name: bulk_imports_import_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX bulk_imports_import_type_idx ON public.bulk_imports USING btree (import_type);


--
-- Name: bulk_imports_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX bulk_imports_status_idx ON public.bulk_imports USING btree (status);


--
-- Name: clusters_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX clusters_code_key ON public.clusters USING btree (code);


--
-- Name: dashboard_stats_cache_key_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX dashboard_stats_cache_key_idx ON public.dashboard_stats USING btree (cache_key);


--
-- Name: dashboard_stats_cache_key_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX dashboard_stats_cache_key_key ON public.dashboard_stats USING btree (cache_key);


--
-- Name: dashboard_stats_last_updated_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX dashboard_stats_last_updated_idx ON public.dashboard_stats USING btree (last_updated);


--
-- Name: dashboard_stats_role_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX dashboard_stats_role_idx ON public.dashboard_stats USING btree (role);


--
-- Name: dashboard_stats_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX dashboard_stats_user_id_idx ON public.dashboard_stats USING btree (user_id);


--
-- Name: ip_whitelist_ip_address_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ip_whitelist_ip_address_idx ON public.ip_whitelist USING btree (ip_address);


--
-- Name: ip_whitelist_ip_address_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX ip_whitelist_ip_address_key ON public.ip_whitelist USING btree (ip_address);


--
-- Name: ip_whitelist_is_active_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX ip_whitelist_is_active_idx ON public.ip_whitelist USING btree (is_active);


--
-- Name: mentor_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentor_school_assignments_is_active_idx ON public.mentor_school_assignments USING btree (is_active);


--
-- Name: mentor_school_assignments_mentor_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentor_school_assignments_mentor_id_idx ON public.mentor_school_assignments USING btree (mentor_id);


--
-- Name: mentor_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentor_school_assignments_pilot_school_id_idx ON public.mentor_school_assignments USING btree (pilot_school_id);


--
-- Name: mentor_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentor_school_assignments_subject_idx ON public.mentor_school_assignments USING btree (subject);


--
-- Name: mentoring_visits_class_in_session_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_class_in_session_idx ON public.mentoring_visits USING btree (class_in_session);


--
-- Name: mentoring_visits_is_locked_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_is_locked_idx ON public.mentoring_visits USING btree (is_locked);


--
-- Name: mentoring_visits_mentor_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_mentor_id_idx ON public.mentoring_visits USING btree (mentor_id);


--
-- Name: mentoring_visits_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_pilot_school_id_idx ON public.mentoring_visits USING btree (pilot_school_id);


--
-- Name: mentoring_visits_record_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_record_status_idx ON public.mentoring_visits USING btree (record_status);


--
-- Name: mentoring_visits_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_school_id_idx ON public.mentoring_visits USING btree (school_id);


--
-- Name: mentoring_visits_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_status_idx ON public.mentoring_visits USING btree (status);


--
-- Name: mentoring_visits_subject_observed_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_subject_observed_idx ON public.mentoring_visits USING btree (subject_observed);


--
-- Name: mentoring_visits_teacher_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_teacher_id_idx ON public.mentoring_visits USING btree (teacher_id);


--
-- Name: mentoring_visits_test_session_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_test_session_id_idx ON public.mentoring_visits USING btree (test_session_id);


--
-- Name: mentoring_visits_visit_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX mentoring_visits_visit_date_idx ON public.mentoring_visits USING btree (visit_date);


--
-- Name: pilot_schools_baseline_start_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_baseline_start_date_idx ON public.pilot_schools USING btree (baseline_start_date);


--
-- Name: pilot_schools_cluster_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_cluster_idx ON public.pilot_schools USING btree (cluster);


--
-- Name: pilot_schools_district_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_district_idx ON public.pilot_schools USING btree (district);


--
-- Name: pilot_schools_is_locked_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_is_locked_idx ON public.pilot_schools USING btree (is_locked);


--
-- Name: pilot_schools_midline_start_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_midline_start_date_idx ON public.pilot_schools USING btree (midline_start_date);


--
-- Name: pilot_schools_province_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_province_idx ON public.pilot_schools USING btree (province);


--
-- Name: pilot_schools_school_code_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX pilot_schools_school_code_idx ON public.pilot_schools USING btree (school_code);


--
-- Name: pilot_schools_school_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX pilot_schools_school_code_key ON public.pilot_schools USING btree (school_code);


--
-- Name: progress_trackings_student_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX progress_trackings_student_id_idx ON public.progress_trackings USING btree (student_id);


--
-- Name: progress_trackings_tracking_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX progress_trackings_tracking_date_idx ON public.progress_trackings USING btree (tracking_date);


--
-- Name: provinces_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX provinces_code_key ON public.provinces USING btree (code);


--
-- Name: quick_login_users_username_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX quick_login_users_username_idx ON public.quick_login_users USING btree (username);


--
-- Name: quick_login_users_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX quick_login_users_username_key ON public.quick_login_users USING btree (username);


--
-- Name: rate_limits_blocked_until_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX rate_limits_blocked_until_idx ON public.rate_limits USING btree (blocked_until);


--
-- Name: rate_limits_endpoint_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX rate_limits_endpoint_idx ON public.rate_limits USING btree (endpoint);


--
-- Name: rate_limits_identifier_endpoint_window_start_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX rate_limits_identifier_endpoint_window_start_key ON public.rate_limits USING btree (identifier, endpoint, window_start);


--
-- Name: rate_limits_identifier_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX rate_limits_identifier_idx ON public.rate_limits USING btree (identifier);


--
-- Name: rate_limits_window_start_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX rate_limits_window_start_idx ON public.rate_limits USING btree (window_start);


--
-- Name: report_exports_report_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX report_exports_report_type_idx ON public.report_exports USING btree (report_type);


--
-- Name: report_exports_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX report_exports_status_idx ON public.report_exports USING btree (status);


--
-- Name: resource_views_resource_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX resource_views_resource_id_idx ON public.resource_views USING btree (resource_id);


--
-- Name: resource_views_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX resource_views_user_id_idx ON public.resource_views USING btree (user_id);


--
-- Name: resources_is_public_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX resources_is_public_idx ON public.resources USING btree (is_public);


--
-- Name: resources_type_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX resources_type_idx ON public.resources USING btree (type);


--
-- Name: school_classes_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX school_classes_school_id_idx ON public.school_classes USING btree (school_id);


--
-- Name: schools_code_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX schools_code_idx ON public.schools USING btree (code);


--
-- Name: schools_code_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX schools_code_key ON public.schools USING btree (code);


--
-- Name: schools_province_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX schools_province_id_idx ON public.schools USING btree (province_id);


--
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- Name: student_assessment_eligibilities_student_id_assessment_type_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX student_assessment_eligibilities_student_id_assessment_type_key ON public.student_assessment_eligibilities USING btree (student_id, assessment_type);


--
-- Name: student_assessment_eligibilities_student_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX student_assessment_eligibilities_student_id_idx ON public.student_assessment_eligibilities USING btree (student_id);


--
-- Name: student_interventions_intervention_program_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX student_interventions_intervention_program_id_idx ON public.student_interventions USING btree (intervention_program_id);


--
-- Name: student_interventions_student_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX student_interventions_student_id_idx ON public.student_interventions USING btree (student_id);


--
-- Name: students_added_by_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_added_by_id_idx ON public.students USING btree (added_by_id);


--
-- Name: students_added_by_mentor_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_added_by_mentor_idx ON public.students USING btree (added_by_mentor);


--
-- Name: students_is_temporary_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_is_temporary_idx ON public.students USING btree (is_temporary);


--
-- Name: students_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_pilot_school_id_idx ON public.students USING btree (pilot_school_id);


--
-- Name: students_record_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_record_status_idx ON public.students USING btree (record_status);


--
-- Name: students_school_class_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_school_class_id_idx ON public.students USING btree (school_class_id);


--
-- Name: students_student_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);


--
-- Name: students_test_session_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX students_test_session_id_idx ON public.students USING btree (test_session_id);


--
-- Name: teacher_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teacher_school_assignments_is_active_idx ON public.teacher_school_assignments USING btree (is_active);


--
-- Name: teacher_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teacher_school_assignments_pilot_school_id_idx ON public.teacher_school_assignments USING btree (pilot_school_id);


--
-- Name: teacher_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teacher_school_assignments_subject_idx ON public.teacher_school_assignments USING btree (subject);


--
-- Name: teacher_school_assignments_teacher_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teacher_school_assignments_teacher_id_idx ON public.teacher_school_assignments USING btree (teacher_id);


--
-- Name: teacher_school_assignments_teacher_id_pilot_school_id_subje_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX teacher_school_assignments_teacher_id_pilot_school_id_subje_key ON public.teacher_school_assignments USING btree (teacher_id, pilot_school_id, subject);


--
-- Name: teaching_activities_activity_date_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teaching_activities_activity_date_idx ON public.teaching_activities USING btree (activity_date);


--
-- Name: teaching_activities_teacher_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX teaching_activities_teacher_id_idx ON public.teaching_activities USING btree (teacher_id);


--
-- Name: test_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX test_sessions_expires_at_idx ON public.test_sessions USING btree (expires_at);


--
-- Name: test_sessions_status_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX test_sessions_status_idx ON public.test_sessions USING btree (status);


--
-- Name: test_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX test_sessions_user_id_idx ON public.test_sessions USING btree (user_id);


--
-- Name: test_sessions_user_role_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX test_sessions_user_role_idx ON public.test_sessions USING btree (user_role);


--
-- Name: user_schools_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_schools_school_id_idx ON public.user_schools USING btree (school_id);


--
-- Name: user_schools_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_schools_user_id_idx ON public.user_schools USING btree (user_id);


--
-- Name: user_schools_user_id_pilot_school_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX user_schools_user_id_pilot_school_id_key ON public.user_schools USING btree (user_id, pilot_school_id);


--
-- Name: user_schools_user_id_school_id_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX user_schools_user_id_school_id_key ON public.user_schools USING btree (user_id, school_id);


--
-- Name: user_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_sessions_expires_at_idx ON public.user_sessions USING btree (expires_at);


--
-- Name: user_sessions_is_active_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_sessions_is_active_idx ON public.user_sessions USING btree (is_active);


--
-- Name: user_sessions_last_activity_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_sessions_last_activity_idx ON public.user_sessions USING btree (last_activity);


--
-- Name: user_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX user_sessions_user_id_idx ON public.user_sessions USING btree (user_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX users_pilot_school_id_idx ON public.users USING btree (pilot_school_id);


--
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: admin
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: admin
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: assessment_histories assessment_histories_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessment_locks assessment_locks_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessments assessments_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_locked_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_locked_by_id_fkey FOREIGN KEY (locked_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: assessments assessments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: assessments assessments_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: attendance_records attendance_records_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentor_school_assignments mentor_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentor_school_assignments mentor_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentoring_visits mentoring_visits_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: mentoring_visits mentoring_visits_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: school_classes school_classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: schools schools_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_assessment_eligibilities student_assessment_eligibilities_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_interventions student_interventions_intervention_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_intervention_program_id_fkey FOREIGN KEY (intervention_program_id) REFERENCES public.intervention_programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_interventions student_interventions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: students students_school_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_school_class_id_fkey FOREIGN KEY (school_class_id) REFERENCES public.school_classes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_school_assignments teacher_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: teacher_school_assignments teacher_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teacher_school_assignments teacher_school_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: teaching_activities teaching_activities_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: users users_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict l3yA0DMCH18srEMUrRbumkbOrBXigsLAnv2BPVGa5Dftkz87BDRZug4M2l7NHT6

