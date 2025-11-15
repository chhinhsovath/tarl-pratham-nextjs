--
-- PostgreSQL database dump
--

\restrict eGhu2LpG6KcjzcD9n9iiepYhrYf6hDaJXxOkxauRQ1D7nymrCviocOUQgPA1Ri4

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Homebrew)

-- Started on 2025-11-15 10:33:19 +07

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
-- TOC entry 901 (class 1247 OID 16391)
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
-- TOC entry 215 (class 1259 OID 16401)
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
-- TOC entry 216 (class 1259 OID 16407)
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
-- TOC entry 3947 (class 0 OID 0)
-- Dependencies: 216
-- Name: assessment_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_histories_id_seq OWNED BY public.assessment_histories.id;


--
-- TOC entry 217 (class 1259 OID 16408)
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
-- TOC entry 218 (class 1259 OID 16414)
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
-- TOC entry 3948 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_locks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_locks_id_seq OWNED BY public.assessment_locks.id;


--
-- TOC entry 219 (class 1259 OID 16415)
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
-- TOC entry 220 (class 1259 OID 16425)
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
-- TOC entry 3949 (class 0 OID 0)
-- Dependencies: 220
-- Name: assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessments_id_seq OWNED BY public.assessments.id;


--
-- TOC entry 221 (class 1259 OID 16426)
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
-- TOC entry 222 (class 1259 OID 16432)
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
-- TOC entry 3950 (class 0 OID 0)
-- Dependencies: 222
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- TOC entry 223 (class 1259 OID 16433)
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
-- TOC entry 224 (class 1259 OID 16439)
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
-- TOC entry 3951 (class 0 OID 0)
-- Dependencies: 224
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 225 (class 1259 OID 16440)
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
-- TOC entry 226 (class 1259 OID 16447)
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
-- TOC entry 3952 (class 0 OID 0)
-- Dependencies: 226
-- Name: bulk_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bulk_imports_id_seq OWNED BY public.bulk_imports.id;


--
-- TOC entry 227 (class 1259 OID 16448)
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
-- TOC entry 228 (class 1259 OID 16454)
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
-- TOC entry 3953 (class 0 OID 0)
-- Dependencies: 228
-- Name: clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;


--
-- TOC entry 276 (class 1259 OID 17002)
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
-- TOC entry 275 (class 1259 OID 17001)
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
-- TOC entry 3954 (class 0 OID 0)
-- Dependencies: 275
-- Name: dashboard_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_stats_id_seq OWNED BY public.dashboard_stats.id;


--
-- TOC entry 229 (class 1259 OID 16455)
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
-- TOC entry 230 (class 1259 OID 16462)
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
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 230
-- Name: intervention_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intervention_programs_id_seq OWNED BY public.intervention_programs.id;


--
-- TOC entry 231 (class 1259 OID 16463)
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
-- TOC entry 232 (class 1259 OID 16470)
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
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 232
-- Name: ip_whitelist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ip_whitelist_id_seq OWNED BY public.ip_whitelist.id;


--
-- TOC entry 233 (class 1259 OID 16471)
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
-- TOC entry 234 (class 1259 OID 16479)
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
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 234
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentor_school_assignments_id_seq OWNED BY public.mentor_school_assignments.id;


--
-- TOC entry 235 (class 1259 OID 16480)
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
-- TOC entry 236 (class 1259 OID 16493)
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
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 236
-- Name: mentoring_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentoring_visits_id_seq OWNED BY public.mentoring_visits.id;


--
-- TOC entry 237 (class 1259 OID 16494)
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
-- TOC entry 238 (class 1259 OID 16501)
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
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 238
-- Name: pilot_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pilot_schools_id_seq OWNED BY public.pilot_schools.id;


--
-- TOC entry 239 (class 1259 OID 16502)
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
-- TOC entry 240 (class 1259 OID 16508)
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
-- TOC entry 3960 (class 0 OID 0)
-- Dependencies: 240
-- Name: progress_trackings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_trackings_id_seq OWNED BY public.progress_trackings.id;


--
-- TOC entry 241 (class 1259 OID 16509)
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
-- TOC entry 242 (class 1259 OID 16515)
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
-- TOC entry 3961 (class 0 OID 0)
-- Dependencies: 242
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- TOC entry 243 (class 1259 OID 16516)
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
-- TOC entry 244 (class 1259 OID 16525)
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
-- TOC entry 3962 (class 0 OID 0)
-- Dependencies: 244
-- Name: quick_login_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quick_login_users_id_seq OWNED BY public.quick_login_users.id;


--
-- TOC entry 245 (class 1259 OID 16526)
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
-- TOC entry 246 (class 1259 OID 16534)
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
-- TOC entry 3963 (class 0 OID 0)
-- Dependencies: 246
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- TOC entry 247 (class 1259 OID 16535)
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
-- TOC entry 248 (class 1259 OID 16542)
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
-- TOC entry 3964 (class 0 OID 0)
-- Dependencies: 248
-- Name: report_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.report_exports_id_seq OWNED BY public.report_exports.id;


--
-- TOC entry 249 (class 1259 OID 16543)
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
-- TOC entry 250 (class 1259 OID 16549)
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
-- TOC entry 3965 (class 0 OID 0)
-- Dependencies: 250
-- Name: resource_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_views_id_seq OWNED BY public.resource_views.id;


--
-- TOC entry 251 (class 1259 OID 16550)
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
-- TOC entry 252 (class 1259 OID 16558)
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
-- TOC entry 3966 (class 0 OID 0)
-- Dependencies: 252
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- TOC entry 253 (class 1259 OID 16559)
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
-- TOC entry 254 (class 1259 OID 16565)
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
-- TOC entry 3967 (class 0 OID 0)
-- Dependencies: 254
-- Name: school_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_classes_id_seq OWNED BY public.school_classes.id;


--
-- TOC entry 255 (class 1259 OID 16566)
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
-- TOC entry 256 (class 1259 OID 16573)
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
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 256
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- TOC entry 257 (class 1259 OID 16574)
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
-- TOC entry 258 (class 1259 OID 16580)
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
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 258
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- TOC entry 259 (class 1259 OID 16581)
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
-- TOC entry 260 (class 1259 OID 16588)
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
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 260
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_assessment_eligibilities_id_seq OWNED BY public.student_assessment_eligibilities.id;


--
-- TOC entry 261 (class 1259 OID 16589)
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
-- TOC entry 262 (class 1259 OID 16596)
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
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 262
-- Name: student_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_interventions_id_seq OWNED BY public.student_interventions.id;


--
-- TOC entry 263 (class 1259 OID 16597)
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
-- TOC entry 264 (class 1259 OID 16608)
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
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 264
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 265 (class 1259 OID 16609)
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
-- TOC entry 266 (class 1259 OID 16617)
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
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 266
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teacher_school_assignments_id_seq OWNED BY public.teacher_school_assignments.id;


--
-- TOC entry 267 (class 1259 OID 16618)
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
-- TOC entry 268 (class 1259 OID 16624)
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
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 268
-- Name: teaching_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teaching_activities_id_seq OWNED BY public.teaching_activities.id;


--
-- TOC entry 269 (class 1259 OID 16625)
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
-- TOC entry 270 (class 1259 OID 16636)
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
-- TOC entry 271 (class 1259 OID 16641)
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
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 271
-- Name: user_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_schools_id_seq OWNED BY public.user_schools.id;


--
-- TOC entry 272 (class 1259 OID 16642)
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
-- TOC entry 273 (class 1259 OID 16651)
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
-- TOC entry 274 (class 1259 OID 16663)
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
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 274
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3405 (class 2604 OID 16664)
-- Name: assessment_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories ALTER COLUMN id SET DEFAULT nextval('public.assessment_histories_id_seq'::regclass);


--
-- TOC entry 3407 (class 2604 OID 16665)
-- Name: assessment_locks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks ALTER COLUMN id SET DEFAULT nextval('public.assessment_locks_id_seq'::regclass);


--
-- TOC entry 3409 (class 2604 OID 16666)
-- Name: assessments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments ALTER COLUMN id SET DEFAULT nextval('public.assessments_id_seq'::regclass);


--
-- TOC entry 3415 (class 2604 OID 16667)
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- TOC entry 3417 (class 2604 OID 16668)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 3419 (class 2604 OID 16669)
-- Name: bulk_imports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports ALTER COLUMN id SET DEFAULT nextval('public.bulk_imports_id_seq'::regclass);


--
-- TOC entry 3422 (class 2604 OID 16670)
-- Name: clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);


--
-- TOC entry 3515 (class 2604 OID 17005)
-- Name: dashboard_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats ALTER COLUMN id SET DEFAULT nextval('public.dashboard_stats_id_seq'::regclass);


--
-- TOC entry 3424 (class 2604 OID 16671)
-- Name: intervention_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs ALTER COLUMN id SET DEFAULT nextval('public.intervention_programs_id_seq'::regclass);


--
-- TOC entry 3427 (class 2604 OID 16672)
-- Name: ip_whitelist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist ALTER COLUMN id SET DEFAULT nextval('public.ip_whitelist_id_seq'::regclass);


--
-- TOC entry 3430 (class 2604 OID 16673)
-- Name: mentor_school_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.mentor_school_assignments_id_seq'::regclass);


--
-- TOC entry 3434 (class 2604 OID 16674)
-- Name: mentoring_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits ALTER COLUMN id SET DEFAULT nextval('public.mentoring_visits_id_seq'::regclass);


--
-- TOC entry 3443 (class 2604 OID 16675)
-- Name: pilot_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools ALTER COLUMN id SET DEFAULT nextval('public.pilot_schools_id_seq'::regclass);


--
-- TOC entry 3446 (class 2604 OID 16676)
-- Name: progress_trackings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings ALTER COLUMN id SET DEFAULT nextval('public.progress_trackings_id_seq'::regclass);


--
-- TOC entry 3448 (class 2604 OID 16677)
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- TOC entry 3450 (class 2604 OID 16678)
-- Name: quick_login_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users ALTER COLUMN id SET DEFAULT nextval('public.quick_login_users_id_seq'::regclass);


--
-- TOC entry 3455 (class 2604 OID 16679)
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- TOC entry 3459 (class 2604 OID 16680)
-- Name: report_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports ALTER COLUMN id SET DEFAULT nextval('public.report_exports_id_seq'::regclass);


--
-- TOC entry 3462 (class 2604 OID 16681)
-- Name: resource_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views ALTER COLUMN id SET DEFAULT nextval('public.resource_views_id_seq'::regclass);


--
-- TOC entry 3464 (class 2604 OID 16682)
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- TOC entry 3468 (class 2604 OID 16683)
-- Name: school_classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes ALTER COLUMN id SET DEFAULT nextval('public.school_classes_id_seq'::regclass);


--
-- TOC entry 3470 (class 2604 OID 16684)
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- TOC entry 3473 (class 2604 OID 16685)
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- TOC entry 3475 (class 2604 OID 16686)
-- Name: student_assessment_eligibilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities ALTER COLUMN id SET DEFAULT nextval('public.student_assessment_eligibilities_id_seq'::regclass);


--
-- TOC entry 3478 (class 2604 OID 16687)
-- Name: student_interventions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions ALTER COLUMN id SET DEFAULT nextval('public.student_interventions_id_seq'::regclass);


--
-- TOC entry 3481 (class 2604 OID 16688)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 3488 (class 2604 OID 16689)
-- Name: teacher_school_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.teacher_school_assignments_id_seq'::regclass);


--
-- TOC entry 3492 (class 2604 OID 16690)
-- Name: teaching_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities ALTER COLUMN id SET DEFAULT nextval('public.teaching_activities_id_seq'::regclass);


--
-- TOC entry 3500 (class 2604 OID 16691)
-- Name: user_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools ALTER COLUMN id SET DEFAULT nextval('public.user_schools_id_seq'::regclass);


--
-- TOC entry 3507 (class 2604 OID 16692)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3880 (class 0 OID 16401)
-- Dependencies: 215
-- Data for Name: assessment_histories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_histories (id, assessment_id, field_name, old_value, new_value, changed_by, created_at) FROM stdin;
1	12	updated	{"student_id":26,"assessment_type":"baseline","subject":"language","level":"letter","notes":"Mr.Vibol","assessed_date":"2025-10-05T07:59:18.993Z","assessment_sample":null,"student_consent":null}	{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"Sample 1","student_consent":"Yes"}	98	2025-10-05 09:41:22.961
2	20	updated	{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T09:03:22.036Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 10:17:51.548
3	20	updated	{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":18,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"No"}	98	2025-10-05 10:18:34.736
4	12	updated	{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":26,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 10:20:13.89
5	16	updated	{"student_id":22,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T08:57:35.332Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":22,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 10:43:50.341
6	20	updated	{"student_id":18,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"No"}	{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}	98	2025-10-05 10:53:09.158
7	20	updated	{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}	{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}	98	2025-10-05 10:54:02.071
8	20	updated	{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}	{"student_id":18,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"No"}	98	2025-10-05 10:54:36.27
9	15	updated	{"student_id":23,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:04:54.365Z","assessment_sample":null,"student_consent":null}	{"student_id":23,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 10:55:24.558
10	14	updated	{"student_id":24,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:04:15.125Z","assessment_sample":null,"student_consent":null}	{"student_id":24,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 10:56:13.724
11	17	updated	{"student_id":21,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T08:58:44.830Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":21,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-05 11:08:10.843
12	11	updated	{"student_id":27,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T07:56:37.518Z","assessment_sample":null,"student_consent":null}	{"student_id":27,"assessment_type":"baseline","subject":"language","level":"story","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-06 05:37:19.315
13	13	updated	{"student_id":25,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T08:03:30.627Z","assessment_sample":null,"student_consent":null}	{"student_id":25,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":"Mr.Vibol","assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-06 05:38:30.164
14	18	updated	{"student_id":20,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":null,"assessed_date":"2025-10-05T08:59:19.394Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":20,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-06 05:39:17.627
15	19	updated	{"student_id":19,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T09:02:52.673Z","assessment_sample":"Sample 1","student_consent":"Yes"}	{"student_id":19,"assessment_type":"baseline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-05T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	98	2025-10-06 05:40:03.271
16	66	updated	{"student_id":73,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្ត","assessed_date":"2025-10-08T13:16:07.968Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":73,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្ត","assessed_date":"2025-10-07T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	5	2025-10-08 13:33:16.031
17	77	updated	{"student_id":92,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-09-24T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":92,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-09-25T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	14	2025-10-08 14:11:41.457
18	164	updated	{"student_id":177,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-25T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":177,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	10	2025-10-10 02:32:13.749
19	161	updated	{"student_id":178,"assessment_type":"baseline","subject":"language","level":"comprehension1","notes":null,"assessed_date":"2025-09-25T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	10	2025-10-10 02:34:09.479
20	161	updated	{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":178,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-09-26T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	10	2025-10-10 02:34:49.414
21	157	updated	{"student_id":144,"assessment_type":"baseline","subject":"language","level":"beginner","notes":"test by sovath","assessed_date":"2025-10-09T05:03:54.146Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":144,"assessment_type":"baseline","subject":"language","level":"paragraph","notes":"test by set socheat","assessed_date":"2025-10-09T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	100	2025-10-10 08:34:30.102
22	287	updated	{"student_id":93,"assessment_type":"endline","subject":"math","level":"division","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-10-09T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":93,"assessment_type":"endline","subject":"math","level":"word_problems","notes":"បានធ្វើតេស្តរួច","assessed_date":"2025-10-10T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	14	2025-10-13 01:39:26.015
23	296	updated	{"student_id":306,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្ចើតេស្តរួចរាល់","assessed_date":"2025-09-28T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":306,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":"បានធ្ចើតេស្តរួចរាល់","assessed_date":"2025-09-30T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	101	2025-10-13 15:13:00.668
24	337	updated	{"student_id":258,"assessment_type":"midline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-10-02T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	17	2025-10-14 08:45:48.2
25	337	updated	{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":258,"assessment_type":"midline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	17	2025-10-14 08:46:58.501
26	459	updated	{"student_id":18,"assessment_type":"endline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-09T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":18,"assessment_type":"midline","subject":"language","level":"comprehension2","notes":null,"assessed_date":"2025-10-03T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	15	2025-10-18 08:09:29.49
\.


--
-- TOC entry 3882 (class 0 OID 16408)
-- Dependencies: 217
-- Data for Name: assessment_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_locks (id, assessment_id, locked_by, locked_at, reason) FROM stdin;
\.


--
-- TOC entry 3884 (class 0 OID 16415)
-- Dependencies: 219
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessments (id, student_id, pilot_school_id, assessment_type, subject, level, notes, assessed_date, added_by_id, is_temporary, assessed_by_mentor, mentor_assessment_id, created_at, updated_at, created_by_role, record_status, test_session_id, assessment_sample, student_consent, verified_by_id, verified_at, verification_notes, is_locked, locked_by_id, locked_at) FROM stdin;
10	17	25	baseline	language	word	រួចហើយ	2025-10-05 07:36:19.147	69	f	f	\N	2025-10-05 07:37:24.063	2025-10-05 07:37:24.063	teacher	production	\N	\N	\N	\N	\N	\N	f	\N	\N
40	60	4	baseline	language	beginner	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:09:25.317	2025-10-08 11:09:25.317	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
11	27	23	baseline	language	story	Mr.Vibol	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 07:57:45.308	2025-10-06 05:37:16.41	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
41	59	4	baseline	language	word	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:11:26.125	2025-10-08 11:11:26.125	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
26	38	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:38:05.008	2025-10-06 05:38:05.008	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
13	25	23	baseline	language	comprehension2	Mr.Vibol	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:03:54.86	2025-10-06 05:38:28.311	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
12	26	23	baseline	language	story	Mr.Vibol	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 07:59:36.645	2025-10-05 10:20:11.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
16	22	23	baseline	language	comprehension2	\N	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:58:04.317	2025-10-05 10:43:47.379	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
18	20	23	baseline	language	paragraph	\N	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:59:38.084	2025-10-06 05:39:14.618	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
20	18	23	baseline	language	comprehension2	\N	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 09:03:34.693	2025-10-05 10:54:33.369	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
15	23	23	baseline	language	comprehension2	Mr.Vibol	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:05:08.877	2025-10-05 10:55:21.568	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
14	24	23	baseline	language	comprehension2	Mr.Vibol	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:04:30.694	2025-10-05 10:56:10.497	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
17	21	23	baseline	language	comprehension2	\N	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 08:59:01.432	2025-10-05 11:08:07.833	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
22	35	8	baseline	language	word	បានធ្វើតេស្តរួច	2025-10-06 04:05:15.631	18	t	t	\N	2025-10-06 04:05:59.86	2025-10-06 04:05:59.86	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
23	34	8	baseline	language	paragraph	តេស្ត	2025-10-06 04:06:47.984	18	t	t	\N	2025-10-06 04:07:24.733	2025-10-06 04:07:24.733	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
24	36	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:30:29.2	2025-10-06 05:30:29.2	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
25	37	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:36:14.206	2025-10-06 05:36:14.206	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
19	19	23	baseline	language	comprehension2	\N	2025-10-05 00:00:00	98	f	f	\N	2025-10-05 09:03:02.576	2025-10-06 05:40:00.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
27	39	8	baseline	language	story	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:40:07.347	2025-10-06 05:40:07.347	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
28	40	8	baseline	language	word	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:41:34.956	2025-10-06 05:41:34.956	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
29	41	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:43:02.566	2025-10-06 05:43:02.566	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
30	42	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:44:30.782	2025-10-06 05:44:30.782	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
31	43	8	baseline	language	letter	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:45:46.073	2025-10-06 05:45:46.073	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
32	44	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:47:20.047	2025-10-06 05:47:20.047	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
33	45	8	baseline	language	paragraph	\N	2025-09-24 17:00:00	11	t	t	\N	2025-10-06 05:48:48.809	2025-10-06 05:48:48.809	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
35	54	8	baseline	math	word_problems	បានធ្វើតេស្តរួចរាល់	2025-09-24 17:00:00	18	t	t	\N	2025-10-06 09:08:45.589	2025-10-06 09:08:45.589	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
36	64	4	baseline	language	beginner	បានធ្វើតេស្ត	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 10:54:20.501	2025-10-08 10:54:20.501	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
37	63	4	baseline	language	paragraph	បានធ្វើតេស្ត	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 10:59:01.101	2025-10-08 10:59:01.101	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
38	62	4	baseline	language	beginner	បានធ្វើតេស្ត	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:04:47.267	2025-10-08 11:04:47.267	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
39	61	4	baseline	language	letter	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:07:13.871	2025-10-08 11:07:13.871	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
42	58	4	baseline	language	letter	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:13:57.461	2025-10-08 11:13:57.461	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
43	57	4	baseline	language	paragraph	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:15:59.483	2025-10-08 11:15:59.483	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
44	56	4	baseline	language	paragraph	បានធ្វើរួច	2025-09-24 17:00:00	4	t	t	\N	2025-10-08 11:17:58.392	2025-10-08 11:17:58.392	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
45	76	9	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 12:45:29.001	2025-10-08 12:45:29.001	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
46	75	9	baseline	math	number_2digit	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 12:50:00.488	2025-10-08 12:50:00.488	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
47	73	9	baseline	math	number_2digit	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 12:53:05.603	2025-10-08 12:53:05.603	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
48	86	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 12:53:25.178	2025-10-08 12:53:25.178	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
49	72	9	baseline	math	subtraction	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 12:55:09.237	2025-10-08 12:55:09.237	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
50	85	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 12:56:43.95	2025-10-08 12:56:43.95	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
51	71	9	baseline	math	number_2digit	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 12:56:50.816	2025-10-08 12:56:50.816	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
52	84	13	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 12:58:49.72	2025-10-08 12:58:49.72	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
53	70	9	baseline	math	number_2digit	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 13:00:17.142	2025-10-08 13:00:17.142	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
54	83	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:01:05.899	2025-10-08 13:01:05.899	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
55	82	13	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:02:55.84	2025-10-08 13:02:55.84	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
56	69	9	baseline	math	number_2digit	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 13:03:57.233	2025-10-08 13:03:57.233	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
57	68	9	baseline	math	word_problems	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 13:06:09.269	2025-10-08 13:06:09.269	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
58	67	9	baseline	math	subtraction	បានធ្វើតេស្ត	2025-09-24 17:00:00	5	t	t	\N	2025-10-08 13:08:01.745	2025-10-08 13:08:01.745	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
59	81	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:08:03.874	2025-10-08 13:08:03.874	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
60	80	13	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:10:15.87	2025-10-08 13:10:15.87	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
61	78	13	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:11:55.912	2025-10-08 13:11:55.912	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
62	76	9	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:13:01.816	2025-10-08 13:13:01.816	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
63	77	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:13:17.458	2025-10-08 13:13:17.458	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
64	74	13	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	13	t	t	\N	2025-10-08 13:14:54.224	2025-10-08 13:14:54.224	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
65	75	9	endline	math	division	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:15:09.964	2025-10-08 13:15:09.964	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
67	72	9	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:21:12.757	2025-10-08 13:21:12.757	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
68	71	9	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:23:29.274	2025-10-08 13:23:29.274	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
69	70	9	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:25:10.317	2025-10-08 13:25:10.317	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
70	69	9	endline	math	number_2digit	មិនបានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:27:08.501	2025-10-08 13:27:08.501	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
71	68	9	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:28:44.398	2025-10-08 13:28:44.398	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
72	67	9	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-06 17:00:00	5	t	t	\N	2025-10-08 13:30:27.525	2025-10-08 13:30:27.525	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
73	87	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 13:32:35.883	2025-10-08 13:32:35.883	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
66	73	9	endline	math	division	បានធ្វើតេស្ត	2025-10-07 00:00:00	5	t	t	\N	2025-10-08 13:18:07.707	2025-10-08 13:33:13.117	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
74	88	8	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 13:36:28.88	2025-10-08 13:36:28.88	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
75	90	8	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 13:38:29.035	2025-10-08 13:38:29.035	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
76	91	8	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 13:48:00.636	2025-10-08 13:48:00.636	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
78	93	8	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 13:58:39.936	2025-10-08 13:58:39.936	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
79	94	8	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 14:00:13.396	2025-10-08 14:00:13.396	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
80	95	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 14:03:02.477	2025-10-08 14:03:02.477	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
81	96	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 14:04:26.78	2025-10-08 14:04:26.78	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
82	97	8	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	14	t	t	\N	2025-10-08 14:07:37.911	2025-10-08 14:07:37.911	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
77	92	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-25 00:00:00	14	t	t	\N	2025-10-08 13:49:30.501	2025-10-08 14:11:38.53	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
83	98	2	baseline	language	beginner	តេស្តរួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:32:59.258	2025-10-08 14:32:59.258	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
84	99	2	baseline	language	paragraph	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:34:24.516	2025-10-08 14:34:24.516	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
85	107	2	baseline	language	paragraph	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:35:21.811	2025-10-08 14:35:21.811	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
86	106	2	baseline	language	comprehension2	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:36:03.914	2025-10-08 14:36:03.914	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
87	105	2	baseline	language	beginner	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:36:36.238	2025-10-08 14:36:36.238	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
88	104	2	baseline	language	letter	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:37:14.173	2025-10-08 14:37:14.173	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
89	103	2	baseline	language	word	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:37:53.501	2025-10-08 14:37:53.501	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
90	102	2	baseline	language	story	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:38:34.83	2025-10-08 14:38:34.83	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
91	101	2	baseline	language	comprehension2	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:39:17.781	2025-10-08 14:39:17.781	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
92	100	2	baseline	language	beginner	រួច	2025-09-24 17:00:00	21	t	t	\N	2025-10-08 14:39:57.422	2025-10-08 14:39:57.422	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
93	99	2	midline	language	paragraph	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:43:16.566	2025-10-08 14:43:16.566	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
94	101	2	midline	language	comprehension2	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:44:19.577	2025-10-08 14:44:19.577	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
95	102	2	midline	language	story	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:45:31.23	2025-10-08 14:45:31.23	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
96	103	2	midline	language	paragraph	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:46:11.835	2025-10-08 14:46:11.835	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
97	104	2	midline	language	letter	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:47:05.845	2025-10-08 14:47:05.845	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
98	105	2	midline	language	word	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:47:48.229	2025-10-08 14:47:48.229	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
99	107	2	midline	language	story	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:48:30.107	2025-10-08 14:48:30.107	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
100	99	2	endline	language	comprehension2	រួច	2025-10-04 17:00:00	21	t	t	\N	2025-10-08 14:49:24.354	2025-10-08 14:49:24.354	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
101	100	2	endline	language	word	រួច	2025-10-08 14:49:34.685	21	t	t	\N	2025-10-08 14:50:01.893	2025-10-08 14:50:01.893	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
102	101	2	endline	language	comprehension2	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:50:50.769	2025-10-08 14:50:50.769	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
103	102	2	endline	language	comprehension2	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:51:27.731	2025-10-08 14:51:27.731	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
104	104	2	endline	language	word	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:52:09.409	2025-10-08 14:52:09.409	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
105	105	2	endline	language	word	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:53:05.466	2025-10-08 14:53:05.466	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
106	107	2	endline	language	comprehension2	រួច	2025-09-30 17:00:00	21	t	t	\N	2025-10-08 14:53:36.445	2025-10-08 14:53:36.445	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
107	108	33	baseline	math	division	បានធ្វើតេស្តរួច	2023-09-26 17:00:00	94	t	t	\N	2025-10-08 15:31:29.671	2025-10-08 15:31:29.671	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
108	109	33	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:33:37.951	2025-10-08 15:33:37.951	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
109	110	33	baseline	math	division	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:35:10.588	2025-10-08 15:35:10.588	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
110	111	33	baseline	math	division	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:36:27.775	2025-10-08 15:36:27.775	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
111	112	33	baseline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:37:36.514	2025-10-08 15:37:36.514	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
112	113	33	baseline	math	subtraction	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:38:50.658	2025-10-08 15:38:50.658	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
113	114	33	baseline	math	division	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:40:54.259	2025-10-08 15:40:54.259	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
114	115	33	baseline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:42:10.91	2025-10-08 15:42:10.91	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
115	116	33	baseline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:43:18.152	2025-10-08 15:43:18.152	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
116	117	33	baseline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-09-26 17:00:00	94	t	t	\N	2025-10-08 15:44:24.18	2025-10-08 15:44:24.18	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
117	108	33	midline	math	division	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:46:03.744	2025-10-08 15:46:03.744	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
118	109	33	midline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:47:34.82	2025-10-08 15:47:34.82	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
119	110	33	midline	math	division	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:50:02.416	2025-10-08 15:50:02.416	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
120	111	33	midline	math	division	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:51:23.366	2025-10-08 15:51:23.366	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
121	112	33	midline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:52:53.234	2025-10-08 15:52:53.234	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
122	113	33	midline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:54:03.883	2025-10-08 15:54:03.883	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
123	115	33	midline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:55:21.432	2025-10-08 15:55:21.432	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
124	116	33	midline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-03 17:00:00	94	t	t	\N	2025-10-08 15:56:44.647	2025-10-08 15:56:44.647	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
125	108	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-07 17:00:00	94	t	t	\N	2025-10-08 15:58:09.998	2025-10-08 15:58:09.998	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
126	109	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-07 17:00:00	94	t	t	\N	2025-10-08 15:59:26.587	2025-10-08 15:59:26.587	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
127	110	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 15:59:48.439	94	t	t	\N	2025-10-08 16:00:28.067	2025-10-08 16:00:28.067	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
128	111	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 16:00:56.034	94	t	t	\N	2025-10-08 16:01:53.862	2025-10-08 16:01:53.862	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
129	112	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 16:02:29.513	94	t	t	\N	2025-10-08 16:03:12.093	2025-10-08 16:03:12.093	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
130	113	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 16:03:36.759	94	t	t	\N	2025-10-08 16:04:18.822	2025-10-08 16:04:18.822	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
131	115	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 16:04:40.649	94	t	t	\N	2025-10-08 16:05:22.216	2025-10-08 16:05:22.216	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
132	116	33	endline	math	word_problems	បាន​ធ្វើតេស្តរួច	2025-10-08 16:05:40.429	94	t	t	\N	2025-10-08 16:06:20.083	2025-10-08 16:06:20.083	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
133	127	28	baseline	language	story	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:26:15.883	2025-10-09 03:26:15.883	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
134	126	28	baseline	language	comprehension1	បានធ្វើតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:32:14.016	2025-10-09 03:32:14.016	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
135	125	28	baseline	language	story	\N	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:34:46.528	2025-10-09 03:34:46.528	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
136	124	28	baseline	language	paragraph	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:36:37.367	2025-10-09 03:36:37.367	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
137	123	28	baseline	language	story	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:38:08.453	2025-10-09 03:38:08.453	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
138	122	28	baseline	language	paragraph	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:39:31.247	2025-10-09 03:39:31.247	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
139	121	28	baseline	language	story	\N	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:40:38.275	2025-10-09 03:40:38.275	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
140	120	28	baseline	language	paragraph	\N	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:41:28.66	2025-10-09 03:41:28.66	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
141	119	28	baseline	language	comprehension1	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:42:49.545	2025-10-09 03:42:49.545	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
142	118	28	baseline	language	paragraph	បានតេស្ត	2025-09-24 17:00:00	19	t	t	\N	2025-10-09 03:44:04.839	2025-10-09 03:44:04.839	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
143	127	28	endline	language	story	\N	2025-10-06 17:00:00	19	t	t	\N	2025-10-09 03:50:35.826	2025-10-09 03:50:35.826	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
144	126	28	endline	language	comprehension2	\N	2025-10-06 17:00:00	19	t	t	\N	2025-10-09 03:54:43.933	2025-10-09 03:54:43.933	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
145	137	33	baseline	language	comprehension2	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:03:18.018	2025-10-09 04:03:18.018	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
146	136	33	baseline	language	comprehension2	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:05:34.873	2025-10-09 04:05:34.873	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
147	135	33	baseline	language	story	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:06:45.366	2025-10-09 04:06:45.366	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
148	134	33	baseline	language	comprehension2	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:09:17.356	2025-10-09 04:09:17.356	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
149	133	33	baseline	language	comprehension1	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:11:07.416	2025-10-09 04:11:07.416	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
150	132	33	baseline	language	comprehension2	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:12:08.155	2025-10-09 04:12:08.155	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
151	131	33	baseline	language	comprehension2	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:12:55.008	2025-10-09 04:12:55.008	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
152	130	33	baseline	language	comprehension1	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:13:56.44	2025-10-09 04:13:56.44	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
153	129	33	baseline	language	word	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:14:51.577	2025-10-09 04:14:51.577	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
154	128	33	baseline	language	story	\N	2025-09-26 17:00:00	97	t	t	\N	2025-10-09 04:19:05.613	2025-10-09 04:19:05.613	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
155	137	33	baseline	math	subtraction	\N	2025-10-09 04:26:50.374	94	t	t	\N	2025-10-09 04:29:39.765	2025-10-09 04:29:39.765	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
158	125	28	endline	language	story	បានតេស្ត	2025-10-06 17:00:00	19	t	t	\N	2025-10-09 08:57:19.639	2025-10-09 08:57:19.639	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
159	124	28	endline	language	story	បានតេស្ត	2025-10-06 17:00:00	19	t	t	\N	2025-10-09 08:59:09.266	2025-10-09 08:59:09.266	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
160	123	28	endline	language	comprehension1	បានតេស្ត	2025-10-06 17:00:00	19	t	t	\N	2025-10-09 09:04:21.638	2025-10-09 09:04:21.638	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
162	178	37	midline	language	comprehension1	\N	2025-10-01 17:00:00	10	t	t	\N	2025-10-10 01:50:42.746	2025-10-10 01:50:42.746	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
157	144	1	baseline	language	paragraph	test by set socheat	2025-10-09 00:00:00	100	t	t	\N	2025-10-09 05:04:17.054	2025-10-10 08:34:27.022	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
163	178	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 01:51:49.787	2025-10-10 01:51:49.787	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
165	177	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 01:54:09.831	2025-10-10 01:54:09.831	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
166	177	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 01:56:54.709	2025-10-10 01:56:54.709	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
167	176	37	baseline	language	paragraph	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 01:57:52.856	2025-10-10 01:57:52.856	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
168	176	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 01:58:56.19	2025-10-10 01:58:56.19	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
169	176	37	endline	language	comprehension1	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:01:32.097	2025-10-10 02:01:32.097	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
170	175	37	baseline	language	paragraph	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:02:49.567	2025-10-10 02:02:49.567	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
171	175	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:03:44.883	2025-10-10 02:03:44.883	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
172	175	37	endline	language	comprehension1	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:04:30.909	2025-10-10 02:04:30.909	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
173	174	37	baseline	language	paragraph	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:05:30.304	2025-10-10 02:05:30.304	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
174	174	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:06:11.885	2025-10-10 02:06:11.885	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
175	174	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:07:01.406	2025-10-10 02:07:01.406	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
176	173	37	baseline	language	paragraph	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:08:14.417	2025-10-10 02:08:14.417	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
177	173	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:08:56.032	2025-10-10 02:08:56.032	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
178	173	37	endline	language	comprehension1	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:17:03.133	2025-10-10 02:17:03.133	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
179	172	37	baseline	language	comprehension1	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:18:43.481	2025-10-10 02:18:43.481	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
180	172	37	midline	language	comprehension2	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:19:38.972	2025-10-10 02:19:38.972	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
181	172	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:20:26.07	2025-10-10 02:20:26.07	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
182	171	37	baseline	language	comprehension1	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:21:17.939	2025-10-10 02:21:17.939	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
183	171	37	midline	language	comprehension2	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:21:53.142	2025-10-10 02:21:53.142	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
184	171	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:22:19.699	2025-10-10 02:22:19.699	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
185	181	37	baseline	language	story	\N	2025-09-25 17:00:00	10	t	t	\N	2025-10-10 02:24:54.124	2025-10-10 02:24:54.124	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
186	181	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:25:28.448	2025-10-10 02:25:28.448	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
187	181	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:25:59.47	2025-10-10 02:25:59.47	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
164	177	37	baseline	language	story	\N	2025-09-26 00:00:00	10	t	t	\N	2025-10-10 01:53:06.709	2025-10-10 02:32:10.756	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
161	178	37	baseline	language	story	\N	2025-09-26 00:00:00	10	t	t	\N	2025-10-10 01:46:20.956	2025-10-10 02:34:47.439	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
188	182	37	baseline	language	story	\N	2025-09-28 17:00:00	10	t	t	\N	2025-10-10 02:37:33.446	2025-10-10 02:37:33.446	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
189	182	37	midline	language	comprehension1	\N	2025-10-02 17:00:00	10	t	t	\N	2025-10-10 02:38:23.047	2025-10-10 02:38:23.047	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
190	182	37	endline	language	comprehension2	\N	2025-10-05 17:00:00	10	t	t	\N	2025-10-10 02:38:51.921	2025-10-10 02:38:51.921	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
191	143	1	baseline	language	story	set socheat	2025-10-10 08:54:10.056	100	t	t	\N	2025-10-10 08:55:27.953	2025-10-10 08:55:27.953	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
192	192	1	baseline	language	comprehension2	set socheat	2025-10-10 08:55:35.16	100	t	t	\N	2025-10-10 08:56:24.933	2025-10-10 08:56:24.933	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
193	138	1	baseline	language	story	set socheat	2025-10-10 08:56:29.317	100	t	t	\N	2025-10-10 08:57:09.772	2025-10-10 08:57:09.772	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
194	139	1	baseline	language	comprehension2	set socheat	2025-10-10 08:57:13.548	100	t	t	\N	2025-10-10 08:57:42.632	2025-10-10 08:57:42.632	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
195	140	1	baseline	language	comprehension2	set socheat	2025-10-10 08:57:44.825	100	t	t	\N	2025-10-10 08:58:12.263	2025-10-10 08:58:12.263	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
196	141	1	baseline	language	comprehension2	set socheat	2025-10-10 08:58:14.022	100	t	t	\N	2025-10-10 08:58:50.369	2025-10-10 08:58:50.369	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
197	142	1	baseline	language	comprehension2	set socheat	2025-10-10 08:58:52.881	100	t	t	\N	2025-10-10 08:59:47.717	2025-10-10 08:59:47.717	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
198	183	1	baseline	language	paragraph	set socheat	2025-10-10 08:59:55.124	100	t	t	\N	2025-10-10 09:00:38.471	2025-10-10 09:00:38.471	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
199	184	1	baseline	language	comprehension2	set socheat	2025-10-10 09:00:41.618	100	t	t	\N	2025-10-10 09:01:09.387	2025-10-10 09:01:09.387	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
200	185	1	baseline	language	comprehension2	set socheat	2025-10-10 09:01:12.796	100	t	t	\N	2025-10-10 09:02:02.337	2025-10-10 09:02:02.337	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
201	186	1	baseline	language	comprehension2	set socheat	2025-10-10 09:02:04.162	100	t	t	\N	2025-10-10 09:02:36.89	2025-10-10 09:02:36.89	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
202	187	1	baseline	language	paragraph	set socheat	2025-10-10 09:02:40.081	100	t	t	\N	2025-10-10 09:03:14.2	2025-10-10 09:03:14.2	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
203	188	1	baseline	language	comprehension2	set socheat	2025-10-10 09:03:16.132	100	t	t	\N	2025-10-10 09:03:49.772	2025-10-10 09:03:49.772	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
204	189	1	baseline	language	comprehension2	set socheat	2025-10-10 09:03:51.697	100	t	t	\N	2025-10-10 09:04:17.5	2025-10-10 09:04:17.5	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
205	190	1	baseline	language	comprehension2	set socheat	2025-10-10 09:04:20.221	100	t	t	\N	2025-10-10 09:04:49.397	2025-10-10 09:04:49.397	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
206	191	1	baseline	language	comprehension2	set socheat	2025-10-10 09:04:53.134	100	t	t	\N	2025-10-10 09:05:22.4	2025-10-10 09:05:22.4	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
207	1	1	baseline	language	comprehension2	set socheat	2025-10-10 09:09:12.006	100	t	t	\N	2025-10-10 09:09:52.264	2025-10-10 09:09:52.264	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
208	148	1	baseline	language	comprehension2	set socheat	2025-10-10 09:11:46.484	100	t	t	\N	2025-10-10 09:12:19.75	2025-10-10 09:12:19.75	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
209	203	40	baseline	language	letter	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 10:52:59.841	2025-10-10 10:52:59.841	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
210	204	40	baseline	language	word	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 10:54:59.916	2025-10-10 10:54:59.916	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
211	215	40	baseline	language	word	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 10:56:35.967	2025-10-10 10:56:35.967	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
212	217	40	baseline	language	word	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 10:58:22.724	2025-10-10 10:58:22.724	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
213	218	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 10:59:28.307	2025-10-10 10:59:28.307	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
214	219	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:00:36.684	2025-10-10 11:00:36.684	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
215	220	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:01:36.043	2025-10-10 11:01:36.043	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
216	221	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:02:40.684	2025-10-10 11:02:40.684	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
217	222	40	baseline	language	letter	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:03:36.506	2025-10-10 11:03:36.506	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
218	223	40	baseline	language	letter	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:04:22.345	2025-10-10 11:04:22.345	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
219	225	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:05:16.065	2025-10-10 11:05:16.065	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
220	226	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:06:05.948	2025-10-10 11:06:05.948	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
221	227	40	baseline	language	story	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:06:52.909	2025-10-10 11:06:52.909	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
222	229	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:07:35.042	2025-10-10 11:07:35.042	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
223	230	40	baseline	language	story	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:08:32.543	2025-10-10 11:08:32.543	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
224	231	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:09:15.067	2025-10-10 11:09:15.067	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
225	232	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:09:57.242	2025-10-10 11:09:57.242	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
226	234	40	baseline	language	story	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:10:41.87	2025-10-10 11:10:41.87	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
227	235	40	baseline	language	paragraph	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:11:19.578	2025-10-10 11:11:19.578	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
228	236	40	baseline	language	word	បានតេស្ដរួចរាល់	2025-09-30 17:00:00	16	t	t	\N	2025-10-10 11:11:56.939	2025-10-10 11:11:56.939	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
229	149	29	baseline	math	division	បានធ្វើតេស្តរួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:32:50.277	2025-10-10 13:32:50.277	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
230	150	29	baseline	math	division	បានធ្វើតេស្តរួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:35:52.455	2025-10-10 13:35:52.455	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
231	151	29	baseline	math	division	បានធ្វើតេស្តរួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:38:47.043	2025-10-10 13:38:47.043	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
232	152	29	baseline	math	division	បានតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:42:32.009	2025-10-10 13:42:32.009	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
233	153	29	baseline	math	subtraction	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:44:54.506	2025-10-10 13:44:54.506	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
234	154	29	baseline	math	division	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:46:47.999	2025-10-10 13:46:47.999	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
235	155	29	baseline	math	subtraction	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:47:53.521	2025-10-10 13:47:53.521	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
236	156	29	baseline	math	division	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:49:05.58	2025-10-10 13:49:05.58	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
237	157	29	baseline	math	number_2digit	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:50:45.171	2025-10-10 13:50:45.171	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
238	158	29	baseline	math	word_problems	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:51:49.953	2025-10-10 13:51:49.953	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
239	159	29	baseline	math	division	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:53:02.173	2025-10-10 13:53:02.173	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
240	160	29	baseline	math	number_2digit	\N	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:53:53.387	2025-10-10 13:53:53.387	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
241	161	29	baseline	math	division	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:54:39.166	2025-10-10 13:54:39.166	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
242	162	29	baseline	math	division	បានធ្វើតេស្តដើមគ្រារួចហើយ	2025-09-29 17:00:00	9	t	t	\N	2025-10-10 13:55:18.425	2025-10-10 13:55:18.425	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
243	86	13	endline	math	subtraction	បានធ្វើតេស្តរួច	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:22:11.556	2025-10-11 01:22:11.556	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
244	85	13	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:24:44.043	2025-10-11 01:24:44.043	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
245	84	13	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:27:10.567	2025-10-11 01:27:10.567	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
246	83	13	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:30:11.445	2025-10-11 01:30:11.445	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
247	82	13	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:31:40.581	2025-10-11 01:31:40.581	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
248	81	13	endline	math	division	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:32:58.163	2025-10-11 01:32:58.163	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
249	80	13	endline	math	number_2digit	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:34:33.384	2025-10-11 01:34:33.384	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
250	78	13	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:36:02.95	2025-10-11 01:36:02.95	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
251	77	13	endline	math	division	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:37:29.626	2025-10-11 01:37:29.626	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
252	74	13	endline	math	division	បានធ្វើតេស្ត	2025-10-05 17:00:00	13	t	t	\N	2025-10-11 01:38:43.32	2025-10-11 01:38:43.32	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
254	278	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	f	\N	2025-10-11 12:36:36.584	2025-10-11 12:36:36.584	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
255	277	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	f	\N	2025-10-11 12:38:32.821	2025-10-11 12:38:32.821	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
256	276	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	f	\N	2025-10-11 12:40:53.972	2025-10-11 12:40:53.972	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
257	275	34	baseline	language	story	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:43:30.151	2025-10-11 12:43:30.151	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
258	274	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:45:06.517	2025-10-11 12:45:06.517	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
259	273	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:46:13.241	2025-10-11 12:46:13.241	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
260	272	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:48:28.662	2025-10-11 12:48:28.662	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
261	271	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:49:54.64	2025-10-11 12:49:54.64	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
262	270	34	baseline	language	paragraph	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:50:50.65	2025-10-11 12:50:50.65	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
263	269	34	baseline	language	story	\N	2025-09-26 17:00:00	103	t	t	\N	2025-10-11 12:51:35.893	2025-10-11 12:51:35.893	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
264	278	34	midline	language	story	\N	2025-10-02 17:00:00	103	t	f	\N	2025-10-12 00:55:21.384	2025-10-12 00:55:21.384	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
265	277	34	midline	language	paragraph	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 00:56:30.59	2025-10-12 00:56:30.59	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
266	276	34	midline	language	story	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 00:57:41.446	2025-10-12 00:57:41.446	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
267	275	34	midline	language	comprehension2	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 00:58:42.548	2025-10-12 00:58:42.548	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
268	274	34	midline	language	story	\N	2025-10-12 00:58:53.26	103	t	t	\N	2025-10-12 00:59:46.996	2025-10-12 00:59:46.996	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
269	273	34	midline	language	story	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 01:00:48.897	2025-10-12 01:00:48.897	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
270	272	34	midline	language	paragraph	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 01:01:37.462	2025-10-12 01:01:37.462	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
271	271	34	midline	language	comprehension1	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 01:02:42.203	2025-10-12 01:02:42.203	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
272	270	34	midline	language	comprehension1	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 01:03:44.426	2025-10-12 01:03:44.426	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
273	269	34	midline	language	comprehension2	\N	2025-10-02 17:00:00	103	t	t	\N	2025-10-12 01:04:28.048	2025-10-12 01:04:28.048	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
274	46	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 02:53:58.231	2025-10-12 02:53:58.231	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
275	47	8	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 02:57:30.591	2025-10-12 02:57:30.591	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
276	48	8	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 02:59:01.865	2025-10-12 02:59:01.865	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
277	49	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:00:59.9	2025-10-12 03:00:59.9	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
278	50	8	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:02:34.678	2025-10-12 03:02:34.678	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
279	51	8	baseline	math	division	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:04:01.982	2025-10-12 03:04:01.982	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
280	52	8	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:05:34.485	2025-10-12 03:05:34.485	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
281	53	8	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:06:53.956	2025-10-12 03:06:53.956	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
282	55	8	baseline	math	word_problems	បានធ្វើតស្តរួច	2025-09-24 17:00:00	18	t	f	\N	2025-10-12 03:09:47.451	2025-10-12 03:09:47.451	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
283	97	8	endline	math	subtraction	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:29:47.748	2025-10-13 01:29:47.748	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
284	96	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:32:25.17	2025-10-13 01:32:25.17	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
285	95	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:34:06.734	2025-10-13 01:34:06.734	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
286	94	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:35:28.5	2025-10-13 01:35:28.5	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
287	93	8	endline	math	word_problems	បានធ្វើតេស្តរួច	2025-10-10 00:00:00	14	t	f	\N	2025-10-13 01:36:55.346	2025-10-13 01:39:23.05	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
288	92	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:40:57.474	2025-10-13 01:40:57.474	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
289	91	8	endline	math	word_problems	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:42:25.196	2025-10-13 01:42:25.196	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
290	90	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:44:08.258	2025-10-13 01:44:08.258	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
291	88	8	endline	math	word_problems	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:45:47.796	2025-10-13 01:45:47.796	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
292	87	8	endline	math	division	បានធ្វើតេស្តរួច	2025-10-09 17:00:00	14	t	f	\N	2025-10-13 01:47:14.876	2025-10-13 01:47:14.876	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
297	305	1	baseline	math	number_2digit	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	f	\N	2025-10-13 14:33:50.874	2025-10-13 14:33:50.874	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
298	296	1	baseline	math	number_2digit	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:37:38.452	2025-10-13 14:37:38.452	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
299	295	1	baseline	math	number_2digit	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:40:21.721	2025-10-13 14:40:21.721	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
300	297	1	baseline	math	word_problems	បានធ្វើតេស្តរួចរាល់	2025-09-29 17:00:00	101	t	t	\N	2025-10-13 14:44:43.321	2025-10-13 14:44:43.321	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
301	294	1	baseline	math	subtraction	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:46:45.108	2025-10-13 14:46:45.108	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
302	293	1	baseline	math	division	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:51:10.355	2025-10-13 14:51:10.355	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
303	292	1	baseline	math	subtraction	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:53:29.461	2025-10-13 14:53:29.461	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
304	291	1	baseline	math	subtraction	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	t	\N	2025-10-13 14:56:52.148	2025-10-13 14:56:52.148	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
305	308	1	baseline	math	division	បានធ្វើតេស្តរួចរាល់	2025-09-28 17:00:00	101	t	f	\N	2025-10-13 15:05:51.685	2025-10-13 15:05:51.685	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
306	307	1	baseline	math	word_problems	បានធ្វើតេស្តរួចរាល់	2025-09-29 17:00:00	101	t	t	\N	2025-10-13 15:08:03.14	2025-10-13 15:08:03.14	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
296	306	1	baseline	math	subtraction	បានធ្ចើតេស្តរួចរាល់	2025-09-30 00:00:00	101	t	f	\N	2025-10-13 14:19:40.477	2025-10-13 15:12:57.714	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
307	309	1	baseline	math	word_problems	បានធ្វើតេស្តរួចរាល់	2025-09-29 17:00:00	101	t	f	\N	2025-10-13 15:17:20.502	2025-10-13 15:17:20.502	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
308	193	1	baseline	language	comprehension2	set socheat	2025-09-29 17:00:00	100	t	f	\N	2025-10-14 06:37:56.339	2025-10-14 06:37:56.339	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
309	194	1	baseline	language	comprehension2	set socheat	2025-09-29 17:00:00	100	t	t	\N	2025-10-14 06:41:26.263	2025-10-14 06:41:26.263	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
310	195	1	baseline	language	comprehension2	set socheat	2025-10-14 06:42:11.529	100	t	t	\N	2025-10-14 06:42:44.45	2025-10-14 06:42:44.45	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
311	196	1	baseline	language	comprehension2	\N	2025-10-14 06:42:50.675	100	t	t	\N	2025-10-14 06:43:20.499	2025-10-14 06:43:20.499	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
312	197	1	baseline	language	comprehension2	\N	2025-10-14 06:43:26.119	100	t	t	\N	2025-10-14 06:43:54.451	2025-10-14 06:43:54.451	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
313	198	1	baseline	language	comprehension2	\N	2025-10-14 06:43:58.725	100	t	t	\N	2025-10-14 06:44:44.865	2025-10-14 06:44:44.865	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
314	199	1	baseline	language	comprehension1	\N	2025-10-14 06:44:49.728	100	t	t	\N	2025-10-14 06:45:18.577	2025-10-14 06:45:18.577	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
315	310	1	baseline	language	comprehension2	\N	2025-10-14 06:45:23.96	100	t	t	\N	2025-10-14 06:45:46.108	2025-10-14 06:45:46.108	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
316	311	1	baseline	language	comprehension2	\N	2025-10-14 06:47:06.713	100	t	t	\N	2025-10-14 06:47:41.686	2025-10-14 06:47:41.686	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
317	360	44	baseline	math	subtraction	\N	2025-10-09 17:00:00	6	t	f	\N	2025-10-14 07:36:16.453	2025-10-14 07:36:16.453	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
318	359	44	baseline	math	subtraction	\N	2025-10-09 17:00:00	6	t	t	\N	2025-10-14 07:37:10.413	2025-10-14 07:37:10.413	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
319	358	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:38:11.334	2025-10-14 07:38:11.334	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
320	356	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	f	\N	2025-10-14 07:40:02.267	2025-10-14 07:40:02.267	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
321	354	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:40:48.435	2025-10-14 07:40:48.435	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
322	353	44	baseline	math	number_1digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:41:29.811	2025-10-14 07:41:29.811	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
323	352	44	baseline	math	number_1digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:42:38.181	2025-10-14 07:42:38.181	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
324	351	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:43:25.371	2025-10-14 07:43:25.371	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
325	348	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:44:18.251	2025-10-14 07:44:18.251	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
326	347	44	baseline	math	number_2digit	\N	2025-09-28 17:00:00	6	t	t	\N	2025-10-14 07:45:00.671	2025-10-14 07:45:00.671	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
327	258	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:16:02.465	2025-10-14 08:16:02.465	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
328	255	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:17:21.083	2025-10-14 08:17:21.083	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
329	253	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:18:16.221	2025-10-14 08:18:16.221	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
330	250	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:19:21.124	2025-10-14 08:19:21.124	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
331	249	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:20:36.756	2025-10-14 08:20:36.756	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
332	245	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:21:29.667	2025-10-14 08:21:29.667	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
333	241	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:22:15.64	2025-10-14 08:22:15.64	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
334	239	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:22:58.477	2025-10-14 08:22:58.477	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
335	238	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:23:42.491	2025-10-14 08:23:42.491	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
336	237	41	baseline	math	number_2digit	\N	2025-09-28 17:00:00	17	t	f	\N	2025-10-14 08:24:58.936	2025-10-14 08:24:58.936	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
338	241	41	midline	math	division	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:43:26.25	2025-10-14 08:43:26.25	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
339	245	41	midline	math	division	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:45:09.264	2025-10-14 08:45:09.264	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
337	258	41	midline	math	subtraction	\N	2025-10-03 00:00:00	17	t	f	\N	2025-10-14 08:36:07.168	2025-10-14 08:46:55.546	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
340	250	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:48:15.328	2025-10-14 08:48:15.328	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
341	255	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:49:17.681	2025-10-14 08:49:17.681	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
342	249	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:50:50.442	2025-10-14 08:50:50.442	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
343	253	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	f	\N	2025-10-14 08:55:01.445	2025-10-14 08:55:01.445	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
344	237	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	t	\N	2025-10-14 08:55:50.061	2025-10-14 08:55:50.061	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
345	238	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	t	\N	2025-10-14 08:56:38.797	2025-10-14 08:56:38.797	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
346	239	41	midline	math	subtraction	\N	2025-10-02 17:00:00	17	t	t	\N	2025-10-14 08:57:23.047	2025-10-14 08:57:23.047	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
347	237	41	endline	math	word_problems	បញ្ចប់	2025-10-09 17:00:00	17	t	f	\N	2025-10-14 08:59:30.731	2025-10-14 08:59:30.731	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
348	239	41	endline	math	division	រួចរាល់	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:01:28.87	2025-10-14 09:01:28.87	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
349	255	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:02:16.618	2025-10-14 09:02:16.618	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
350	238	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:03:19.68	2025-10-14 09:03:19.68	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
351	241	41	endline	math	word_problems	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:04:38.515	2025-10-14 09:04:38.515	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
352	245	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:06:53.735	2025-10-14 09:06:53.735	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
353	258	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:07:59.024	2025-10-14 09:07:59.024	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
354	250	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:08:47.927	2025-10-14 09:08:47.927	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
355	249	41	endline	math	division	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:09:51.167	2025-10-14 09:09:51.167	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
356	253	41	endline	math	word_problems	\N	2025-10-09 17:00:00	17	t	t	\N	2025-10-14 09:11:07.422	2025-10-14 09:11:07.422	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
357	278	34	endline	language	story	\N	2025-10-12 17:00:00	20	t	f	\N	2025-10-14 11:30:35.213	2025-10-14 11:30:35.213	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
358	277	34	endline	language	story	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:31:43.482	2025-10-14 11:31:43.482	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
359	276	34	endline	language	comprehension1	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:34:14.763	2025-10-14 11:34:14.763	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
360	275	34	endline	language	comprehension2	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:35:18.766	2025-10-14 11:35:18.766	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
361	274	34	endline	language	comprehension1	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:36:30.218	2025-10-14 11:36:30.218	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
362	273	34	endline	language	comprehension1	\N	2025-10-12 17:00:00	20	t	f	\N	2025-10-14 11:40:29.398	2025-10-14 11:40:29.398	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
363	272	34	endline	language	story	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:42:38.819	2025-10-14 11:42:38.819	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
364	271	34	endline	language	comprehension2	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:44:02.887	2025-10-14 11:44:02.887	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
365	270	34	endline	language	comprehension2	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:45:03.045	2025-10-14 11:45:03.045	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
366	269	34	endline	language	comprehension2	\N	2025-10-12 17:00:00	20	t	t	\N	2025-10-14 11:45:43.681	2025-10-14 11:45:43.681	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
367	149	29	midline	math	subtraction	\N	2025-10-03 17:00:00	9	t	f	\N	2025-10-15 03:06:23.23	2025-10-15 03:06:23.23	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
368	151	29	endline	math	word_problems	បានធ្វើតេស្តបញ្ជាប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:11:17.978	2025-10-15 03:11:17.978	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
369	149	29	endline	math	division	បានធ្វើតេស្តបញ្ជប់រួហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:12:50.919	2025-10-15 03:12:50.919	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
370	152	29	endline	math	division	\N	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:16:45.447	2025-10-15 03:16:45.447	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
371	153	29	endline	math	division	\N	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:17:28.924	2025-10-15 03:17:28.924	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
372	154	29	endline	math	word_problems	\N	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:18:25.524	2025-10-15 03:18:25.524	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
373	155	29	endline	math	word_problems	\N	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:19:24.896	2025-10-15 03:19:24.896	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
374	156	29	endline	math	word_problems	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:27:20.201	2025-10-15 03:27:20.201	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
375	157	29	endline	math	division	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:28:25.441	2025-10-15 03:28:25.441	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
376	158	29	endline	math	word_problems	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:29:22.024	2025-10-15 03:29:22.024	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
377	159	29	endline	math	division	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:30:06.264	2025-10-15 03:30:06.264	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
378	160	29	endline	math	division	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:31:26.34	2025-10-15 03:31:26.34	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
379	161	29	endline	math	division	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:32:37.334	2025-10-15 03:32:37.334	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
380	162	29	endline	math	word_problems	បានធ្វើតេស្តបញ្ចប់រួចហើយ	2025-10-12 17:00:00	9	t	f	\N	2025-10-15 03:33:15.269	2025-10-15 03:33:15.269	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
381	313	1	baseline	language	comprehension2	\N	2025-10-15 12:31:27.113	100	t	f	\N	2025-10-15 12:32:39.381	2025-10-15 12:32:39.381	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
382	317	1	baseline	language	comprehension2	\N	2025-10-15 12:32:45.945	100	t	t	\N	2025-10-15 12:34:21.836	2025-10-15 12:34:21.836	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
383	318	1	baseline	language	comprehension2	\N	2025-10-15 12:34:26.302	100	t	t	\N	2025-10-15 12:34:51.68	2025-10-15 12:34:51.68	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
384	319	1	baseline	language	comprehension2	\N	2025-10-15 12:34:56.046	100	t	t	\N	2025-10-15 12:35:36.138	2025-10-15 12:35:36.138	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
385	321	1	baseline	language	comprehension2	\N	2025-10-15 12:36:20.784	100	t	t	\N	2025-10-15 12:36:58.042	2025-10-15 12:36:58.042	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
386	322	1	baseline	language	comprehension2	\N	2025-10-15 12:37:02.728	100	t	t	\N	2025-10-15 12:37:32.173	2025-10-15 12:37:32.173	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
387	346	1	baseline	language	comprehension2	\N	2025-10-15 12:38:09.458	100	t	f	\N	2025-10-15 12:38:32.944	2025-10-15 12:38:32.944	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
388	345	1	baseline	language	comprehension2	\N	2025-10-15 12:39:01.691	100	t	f	\N	2025-10-15 12:39:32.552	2025-10-15 12:39:32.552	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
389	344	1	baseline	language	comprehension2	\N	2025-10-15 12:39:50.812	100	t	f	\N	2025-10-15 12:40:18.983	2025-10-15 12:40:18.983	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
390	343	1	baseline	language	comprehension2	\N	2025-10-15 12:40:26.96	100	t	f	\N	2025-10-15 12:40:55.066	2025-10-15 12:40:55.066	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
391	342	1	baseline	language	story	\N	2025-10-15 12:41:01.139	100	t	f	\N	2025-10-15 12:41:25.082	2025-10-15 12:41:25.082	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
392	341	1	baseline	language	story	\N	2025-10-15 12:41:30.932	100	t	f	\N	2025-10-15 12:42:01.443	2025-10-15 12:42:01.443	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
393	340	1	baseline	language	comprehension2	\N	2025-10-15 12:42:20.63	100	t	f	\N	2025-10-15 12:42:48.062	2025-10-15 12:42:48.062	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
394	339	1	baseline	language	story	\N	2025-10-15 12:42:53.29	100	t	f	\N	2025-10-15 12:43:24.411	2025-10-15 12:43:24.411	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
395	338	1	baseline	language	comprehension2	\N	2025-10-15 12:43:30.568	100	t	f	\N	2025-10-15 12:44:23.553	2025-10-15 12:44:23.553	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
396	337	1	baseline	language	comprehension2	\N	2025-10-15 12:44:28.972	100	t	t	\N	2025-10-15 12:45:03.049	2025-10-15 12:45:03.049	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
397	334	1	baseline	language	comprehension2	\N	2025-10-15 12:45:05.976	100	t	t	\N	2025-10-15 12:45:36.203	2025-10-15 12:45:36.203	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
398	333	1	baseline	language	comprehension2	\N	2025-10-15 12:45:39.248	100	t	t	\N	2025-10-15 12:45:59.961	2025-10-15 12:45:59.961	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
399	332	1	baseline	language	comprehension1	\N	2025-10-15 12:46:03.168	100	t	t	\N	2025-10-15 12:46:30.43	2025-10-15 12:46:30.43	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
400	331	1	baseline	language	comprehension2	\N	2025-10-15 12:46:36.341	100	t	f	\N	2025-10-15 12:47:08.192	2025-10-15 12:47:08.192	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
401	330	1	baseline	language	comprehension2	\N	2025-10-15 12:47:12.626	100	t	t	\N	2025-10-15 12:47:41.288	2025-10-15 12:47:41.288	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
402	329	1	baseline	language	comprehension2	\N	2025-10-15 12:47:45.486	100	t	t	\N	2025-10-15 12:48:06.556	2025-10-15 12:48:06.556	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
403	328	1	baseline	language	comprehension2	\N	2025-10-15 12:48:10.728	100	t	t	\N	2025-10-15 12:48:39.209	2025-10-15 12:48:39.209	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
404	327	1	baseline	language	comprehension2	\N	2025-10-15 12:48:41.858	100	t	t	\N	2025-10-15 12:49:02.696	2025-10-15 12:49:02.696	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
405	326	1	baseline	language	comprehension2	\N	2025-10-15 12:49:12.701	100	t	t	\N	2025-10-15 12:49:33.324	2025-10-15 12:49:33.324	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
406	325	1	baseline	language	comprehension1	\N	2025-10-15 12:49:36.448	100	t	t	\N	2025-10-15 12:50:04.601	2025-10-15 12:50:04.601	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
407	312	1	baseline	language	comprehension1	\N	2025-10-15 12:50:07.501	100	t	t	\N	2025-10-15 12:53:04.712	2025-10-15 12:53:04.712	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
408	320	1	baseline	language	comprehension1	\N	2025-10-15 12:53:14.415	100	t	t	\N	2025-10-15 12:54:22.782	2025-10-15 12:54:22.782	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
409	324	1	baseline	language	comprehension2	\N	2025-10-15 12:54:29.114	100	t	t	\N	2025-10-15 12:54:55.214	2025-10-15 12:54:55.214	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
410	323	1	baseline	language	comprehension1	\N	2025-10-15 12:54:58.196	100	t	t	\N	2025-10-15 12:55:29.086	2025-10-15 12:55:29.086	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
411	309	1	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:20:05.462	2025-10-17 00:20:05.462	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
412	330	1	endline	language	comprehension2	\N	2025-10-17 00:21:15.923	100	t	f	\N	2025-10-17 00:23:48.223	2025-10-17 00:23:48.223	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
413	308	1	endline	math	division	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:25:35.215	2025-10-17 00:25:35.215	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
414	307	1	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:28:13.231	2025-10-17 00:28:13.231	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
415	332	1	endline	language	comprehension2	\N	2025-10-17 00:28:52.603	100	t	f	\N	2025-10-17 00:29:12.522	2025-10-17 00:29:12.522	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
416	306	1	endline	math	division	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:31:50.787	2025-10-17 00:31:50.787	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
417	339	1	endline	language	comprehension1	\N	2025-10-17 00:30:45.39	100	t	f	\N	2025-10-17 00:33:14.086	2025-10-17 00:33:14.086	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
418	305	1	endline	math	subtraction	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:34:37.668	2025-10-17 00:34:37.668	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
419	297	1	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:36:32.289	2025-10-17 00:36:32.289	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
420	312	1	endline	language	comprehension2	\N	2025-10-17 00:37:58.467	100	t	f	\N	2025-10-17 00:38:42.727	2025-10-17 00:38:42.727	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
421	296	1	endline	math	division	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 00:38:56.062	2025-10-17 00:38:56.062	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
422	138	1	endline	language	comprehension2	\N	2025-10-17 00:51:01.009	100	t	f	\N	2025-10-17 00:53:15.878	2025-10-17 00:53:15.878	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
423	183	1	endline	language	comprehension1	\N	2025-10-17 00:59:41.731	100	t	f	\N	2025-10-17 01:00:23.41	2025-10-17 01:00:23.41	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
424	187	1	endline	language	story	\N	2025-10-17 01:00:31.661	100	t	t	\N	2025-10-17 01:02:11.652	2025-10-17 01:02:11.652	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
425	143	1	endline	language	comprehension1	\N	2025-10-17 01:03:08.936	100	t	f	\N	2025-10-17 01:05:43.535	2025-10-17 01:05:43.535	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
426	144	1	endline	language	story	\N	2025-10-17 01:07:14.876	100	t	f	\N	2025-10-17 01:09:24.053	2025-10-17 01:09:24.053	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
427	295	1	endline	math	division	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 01:28:00.167	2025-10-17 01:28:00.167	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
428	294	1	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 01:31:24.131	2025-10-17 01:31:24.131	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
429	293	1	endline	math	word_problems	បានធ្វើតេស្ត	2025-10-09 17:00:00	101	t	f	\N	2025-10-17 01:39:21.052	2025-10-17 01:39:21.052	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
430	381	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:07:40.717	2025-10-17 02:07:40.717	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
431	380	39	baseline	math	number_2digit	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:08:46.884	2025-10-17 02:08:46.884	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
432	379	39	baseline	math	number_2digit	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:09:40.325	2025-10-17 02:09:40.325	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
433	378	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:10:49.569	2025-10-17 02:10:49.569	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
434	377	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:12:24.553	2025-10-17 02:12:24.553	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
435	376	39	baseline	math	number_2digit	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:14:00.153	2025-10-17 02:14:00.153	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
436	375	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:15:07.377	2025-10-17 02:15:07.377	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
437	374	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:19:33.851	2025-10-17 02:19:33.851	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
438	373	39	baseline	math	subtraction	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:21:02.523	2025-10-17 02:21:02.523	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
439	372	39	baseline	math	number_2digit	\N	2025-09-28 17:00:00	12	t	f	\N	2025-10-17 02:22:16.069	2025-10-17 02:22:16.069	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
440	372	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:23:22.337	2025-10-17 02:23:22.337	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
441	373	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:24:48.975	2025-10-17 02:24:48.975	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
442	374	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:25:38.326	2025-10-17 02:25:38.326	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
443	376	39	endline	math	number_2digit	សិស្សមានការភ្លេចច្រើន	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:27:05.057	2025-10-17 02:27:05.057	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
444	381	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:29:47.378	2025-10-17 02:29:47.378	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
445	380	39	endline	math	number_2digit	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:30:33.372	2025-10-17 02:30:33.372	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
446	379	39	endline	math	division	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:31:48.078	2025-10-17 02:31:48.078	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
447	378	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:32:49.601	2025-10-17 02:32:49.601	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
448	377	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-17 02:33:35.891	2025-10-17 02:33:35.891	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
449	27	23	endline	language	story	\N	2025-10-09 17:00:00	98	f	f	\N	2025-10-17 03:19:40.521	2025-10-17 03:19:40.521	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
450	375	39	endline	math	word_problems	\N	2025-10-09 17:00:00	12	t	f	\N	2025-10-18 04:45:03.456	2025-10-18 04:45:03.456	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
451	26	23	endline	math	word_problems	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 07:55:21.507	2025-10-18 07:55:21.507	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
452	25	23	endline	math	word_problems	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 07:56:16.302	2025-10-18 07:56:16.302	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
453	24	23	endline	language	comprehension2	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 07:57:35.443	2025-10-18 07:57:35.443	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
454	21	23	endline	language	comprehension2	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 07:59:17.188	2025-10-18 07:59:17.188	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
468	392	6	baseline	language	word	test	2025-10-30 10:47:39.932	7	f	f	\N	2025-10-30 10:47:57.013	2025-10-31 09:35:33.944	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	7	2025-10-31 09:35:33.943	Bulk verification	f	\N	\N
478	399	25	baseline	language	word	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 06:51:41.725	2025-11-01 06:51:41.725	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
486	407	21	midline	language	story	\N	2025-12-30 17:00:00	66	f	f	\N	2025-11-01 07:34:35.311	2025-11-01 07:34:35.311	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
492	437	4	baseline	language	paragraph	test	2025-11-08 15:44:03.461	4	f	f	\N	2025-11-08 15:45:03.318	2025-11-08 15:49:10.358	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	4	2025-11-08 15:49:10.357	Verified by mentor assessment #493	f	\N	\N
455	23	23	endline	language	comprehension2	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 08:00:52.602	2025-10-18 08:00:52.602	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
456	22	23	endline	language	comprehension2	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 08:01:39.822	2025-10-18 08:01:39.822	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
457	20	23	endline	language	story	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 08:03:09.391	2025-10-18 08:03:09.391	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
476	392	6	baseline_verification	math	division	fdfd	2025-10-31 09:10:03.413	7	f	t	469	2025-10-31 09:10:12.894	2025-10-31 09:10:12.894	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
469	392	6	baseline	math	number_2digit	test	2025-10-30 10:49:19.152	7	f	f	\N	2025-10-30 11:01:56.704	2025-10-31 09:35:33.944	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	7	2025-10-31 09:35:33.943	Bulk verification	f	\N	\N
479	398	25	baseline	language	story	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 06:53:14.958	2025-11-01 06:53:14.958	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
480	399	25	midline	language	paragraph	\N	2025-12-30 17:00:00	69	f	f	\N	2025-11-01 06:56:49.711	2025-11-01 06:56:49.711	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
487	409	25	baseline	language	story	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:37:10.595	2025-11-01 07:37:10.595	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
489	408	26	baseline	math	subtraction	\N	2025-11-16 17:00:00	82	f	f	\N	2025-11-01 07:39:12.416	2025-11-01 07:39:12.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
493	437	4	baseline_verification	language	comprehension1	test verify	2025-11-08 15:47:52.819	4	f	t	492	2025-11-08 15:49:07.045	2025-11-08 15:49:07.045	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
458	19	23	endline	language	comprehension2	\N	2025-10-09 17:00:00	15	t	f	\N	2025-10-18 08:04:13	2025-10-18 08:04:13	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
459	18	23	midline	language	comprehension2	\N	2025-10-03 00:00:00	15	t	f	\N	2025-10-18 08:07:17.11	2025-10-18 08:09:26.651	mentor	test_mentor	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
477	392	6	baseline_verification	language	comprehension1	https://tarl.openplp.com/assessments/create?verificationMode=true&originalAssessmentId=468&studentId=392&studentName=sovath-sovath&assessmentType=baseline&subject=language	2025-10-31 09:10:31.002	7	f	t	468	2025-10-31 09:10:46.826	2025-10-31 09:10:46.826	mentor	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
481	399	25	endline	language	comprehension1	\N	2026-02-01 17:00:00	69	f	f	\N	2025-11-01 06:59:17.465	2025-11-01 06:59:17.465	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
488	403	24	baseline	language	letter	\N	2025-11-16 17:00:00	85	f	f	\N	2025-11-01 07:37:37.361	2025-11-01 07:37:37.361	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
494	560	44	baseline	math	word_problems	\N	2025-11-14 09:05:15.312	60	f	f	\N	2025-11-14 09:06:38.345	2025-11-14 09:06:38.345	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
482	400	25	baseline	language	word	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:27:30.942	2025-11-01 07:27:30.942	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
483	405	25	baseline	language	letter	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:31:51.793	2025-11-01 07:31:51.793	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
490	413	2	baseline	math	subtraction	\N	2025-11-16 17:00:00	54	f	f	\N	2025-11-01 07:41:29.863	2025-11-01 07:41:29.863	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
484	404	24	baseline	language	paragraph	\N	2025-11-16 17:00:00	85	f	f	\N	2025-11-01 07:31:57.334	2025-11-01 07:31:57.334	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
485	407	21	baseline	language	word	\N	2025-11-16 17:00:00	66	f	f	\N	2025-11-01 07:32:38.367	2025-11-01 07:32:38.367	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
491	407	21	endline	language	comprehension2	\N	2026-02-01 17:00:00	66	f	f	\N	2025-11-01 07:43:14.268	2025-11-01 07:43:14.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
\.


--
-- TOC entry 3886 (class 0 OID 16426)
-- Dependencies: 221
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_records (id, student_id, teacher_id, date, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3888 (class 0 OID 16433)
-- Dependencies: 223
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, user_role, user_email, action, resource_type, resource_id, resource_name, old_values, new_values, changed_fields, ip_address, user_agent, session_id, status, error_message, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 3890 (class 0 OID 16440)
-- Dependencies: 225
-- Data for Name: bulk_imports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bulk_imports (id, import_type, file_name, file_path, total_rows, successful_rows, failed_rows, errors, imported_by, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3892 (class 0 OID 16448)
-- Dependencies: 227
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clusters (id, name, code, description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3941 (class 0 OID 17002)
-- Dependencies: 276
-- Data for Name: dashboard_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dashboard_stats (id, cache_key, role, user_id, total_schools, total_students, total_teachers, total_mentors, total_assessments, baseline_assessments, midline_assessments, endline_assessments, language_assessments, math_assessments, stats_data, last_updated, created_at) FROM stdin;
3	global	coordinator	\N	45	292	69	23	443	266	47	130	221	222	{"by_level": [{"math": 0, "khmer": 14, "level": "word"}, {"math": 0, "khmer": 6, "level": "beginner"}, {"math": 0, "khmer": 40, "level": "story"}, {"math": 0, "khmer": 47, "level": "paragraph"}, {"math": 0, "khmer": 89, "level": "comprehension2"}, {"math": 0, "khmer": 8, "level": "letter"}, {"math": 58, "khmer": 0, "level": "word_problems"}, {"math": 56, "khmer": 0, "level": "division"}, {"math": 40, "khmer": 0, "level": "number_2digit"}, {"math": 51, "khmer": 0, "level": "subtraction"}, {"math": 0, "khmer": 32, "level": "comprehension1"}, {"math": 2, "khmer": 0, "level": "number_1digit"}], "overall_results_math": [{"cycle": "baseline", "levels": {"division": 21, "subtraction": 31, "number_1digit": 2, "number_2digit": 36, "word_problems": 16}}, {"cycle": "midline", "levels": {"division": 5, "subtraction": 9, "word_problems": 5}}, {"cycle": "endline", "levels": {"division": 30, "subtraction": 11, "number_2digit": 4, "word_problems": 37}}], "overall_results_khmer": [{"cycle": "baseline", "levels": {"word": 10, "story": 24, "letter": 7, "beginner": 6, "paragraph": 43, "comprehension1": 12, "comprehension2": 58}}, {"cycle": "midline", "levels": {"word": 1, "story": 6, "letter": 1, "paragraph": 4, "comprehension1": 10, "comprehension2": 6}}, {"cycle": "endline", "levels": {"word": 3, "story": 10, "comprehension1": 10, "comprehension2": 25}}]}	2025-10-18 08:46:18.216	2025-10-18 08:46:18.216
\.


--
-- TOC entry 3894 (class 0 OID 16455)
-- Dependencies: 229
-- Data for Name: intervention_programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.intervention_programs (id, name, description, start_date, end_date, target_group, expected_outcomes, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3896 (class 0 OID 16463)
-- Dependencies: 231
-- Data for Name: ip_whitelist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ip_whitelist (id, ip_address, description, allowed_roles, is_active, added_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3898 (class 0 OID 16471)
-- Dependencies: 233
-- Data for Name: mentor_school_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mentor_school_assignments (id, mentor_id, pilot_school_id, subject, assigned_by_id, assigned_date, is_active, notes, created_at, updated_at) FROM stdin;
3	97	17	Language	3	2025-10-13 08:23:21.866	t	\N	2025-10-13 08:23:21.866	2025-10-13 08:23:21.866
5	12	42	Language	12	2025-10-14 08:05:37.445	t	Auto-created from profile setup	2025-10-14 08:05:37.445	2025-10-14 08:05:37.445
6	9	35	Math	9	2025-10-14 08:07:22.618	t	Auto-created from profile setup	2025-10-14 08:07:22.618	2025-10-14 08:07:22.618
7	20	34	Language	20	2025-10-14 11:25:47.728	t	Auto-created from profile setup	2025-10-14 11:25:47.728	2025-10-14 11:25:47.728
9	12	39	Language	12	2025-10-15 01:41:46.141	t	Auto-created from profile setup	2025-10-15 01:41:46.141	2025-10-15 01:41:46.141
10	12	42	Math	12	2025-10-15 01:42:37.216	t	Auto-created from profile setup	2025-10-15 01:42:37.216	2025-10-15 01:42:37.216
11	12	39	Math	12	2025-10-16 08:56:49.461	t	Auto-created from profile setup	2025-10-16 08:56:49.461	2025-10-16 08:56:49.461
12	101	1	Math	101	2025-10-17 00:09:33.887	t	Auto-created from profile setup	2025-10-17 00:09:33.887	2025-10-17 00:09:33.887
13	15	23	Language	15	2025-10-17 02:41:24.788	t	Auto-created from profile setup	2025-10-17 02:41:24.788	2025-10-17 02:41:24.788
14	94	17	Math	3	2025-10-17 03:39:11.062	t	sovath entry	2025-10-17 03:39:11.062	2025-10-17 03:39:11.062
15	21	2	Language	3	2025-10-17 03:43:53.17	t	\N	2025-10-17 03:43:53.17	2025-10-17 03:43:53.17
16	21	3	Language	3	2025-10-17 03:43:57.532	t	\N	2025-10-17 03:43:57.532	2025-10-17 03:43:57.532
17	100	1	Language	3	2025-10-18 12:25:31.134	t	\N	2025-10-18 12:25:31.134	2025-10-18 12:25:31.134
18	4	4	Language	3	2025-10-18 12:29:00.231	t	\N	2025-10-18 12:29:00.231	2025-10-18 12:29:00.231
19	4	5	Language	3	2025-10-18 12:29:04.357	t	\N	2025-10-18 12:29:04.357	2025-10-18 12:29:04.357
20	11	7	Language	3	2025-10-18 12:31:52.782	t	\N	2025-10-18 12:31:52.782	2025-10-18 12:31:52.782
21	11	8	Language	3	2025-10-18 12:31:55.824	t	\N	2025-10-18 12:31:55.824	2025-10-18 12:31:55.824
22	5	9	Math	3	2025-10-18 12:32:55.515	t	\N	2025-10-18 12:32:55.515	2025-10-18 12:32:55.515
23	5	10	Math	3	2025-10-18 12:32:58.659	t	\N	2025-10-18 12:32:58.659	2025-10-18 12:32:58.659
24	14	11	Math	3	2025-10-18 12:34:16.45	t	\N	2025-10-18 12:34:16.45	2025-10-18 12:34:16.45
25	14	12	Math	3	2025-10-18 12:34:20.562	t	\N	2025-10-18 12:34:20.562	2025-10-18 12:34:20.562
26	13	13	Math	3	2025-10-18 12:35:59.251	t	\N	2025-10-18 12:35:59.251	2025-10-18 12:35:59.251
27	13	14	Math	3	2025-10-18 12:36:02.4	t	\N	2025-10-18 12:36:02.4	2025-10-18 12:36:02.4
28	13	15	Math	3	2025-10-18 12:36:05.575	t	\N	2025-10-18 12:36:05.575	2025-10-18 12:36:05.575
29	13	16	Math	3	2025-10-18 12:36:08.79	t	\N	2025-10-18 12:36:08.79	2025-10-18 12:36:08.79
30	16	18	Language	3	2025-10-18 12:38:22.881	t	\N	2025-10-18 12:38:22.881	2025-10-18 12:38:22.881
31	16	19	Language	3	2025-10-18 12:38:25.919	t	\N	2025-10-18 12:38:25.919	2025-10-18 12:38:25.919
32	16	20	Language	3	2025-10-18 12:38:28.961	t	\N	2025-10-18 12:38:28.961	2025-10-18 12:38:28.961
33	19	21	Language	3	2025-10-18 12:39:27.485	t	\N	2025-10-18 12:39:27.485	2025-10-18 12:39:27.485
34	19	22	Language	3	2025-10-18 12:39:31.664	t	\N	2025-10-18 12:39:31.664	2025-10-18 12:39:31.664
35	15	24	Language	3	2025-10-18 12:40:33.458	t	\N	2025-10-18 12:40:33.458	2025-10-18 12:40:33.458
36	15	25	Language	3	2025-10-18 12:40:36.513	t	\N	2025-10-18 12:40:36.513	2025-10-18 12:40:36.513
37	17	26	Math	3	2025-10-18 12:41:35.821	t	\N	2025-10-18 12:41:35.821	2025-10-18 12:41:35.821
38	17	27	Math	3	2025-10-18 12:41:39.93	t	\N	2025-10-18 12:41:39.93	2025-10-18 12:41:39.93
39	12	28	Math	3	2025-10-18 12:42:38.121	t	\N	2025-10-18 12:42:38.121	2025-10-18 12:42:38.121
40	12	29	Math	3	2025-10-18 12:42:41.371	t	\N	2025-10-18 12:42:41.371	2025-10-18 12:42:41.371
41	12	30	Math	3	2025-10-18 12:42:44.683	t	\N	2025-10-18 12:42:44.683	2025-10-18 12:42:44.683
42	6	31	Math	3	2025-10-18 12:43:30.431	t	\N	2025-10-18 12:43:30.431	2025-10-18 12:43:30.431
43	6	32	Math	3	2025-10-18 12:43:33.734	t	\N	2025-10-18 12:43:33.734	2025-10-18 12:43:33.734
44	4	6	Language	3	2025-10-18 12:49:59.801	t	\N	2025-10-18 12:49:59.801	2025-10-18 12:49:59.801
45	7	33	Language	3	2025-10-20 04:32:25.938	t	test	2025-10-20 04:32:25.938	2025-10-20 04:32:25.938
46	7	6	Language	7	2025-10-30 05:31:54.891	t	Self-assigned by mentor	2025-10-30 05:31:54.891	2025-10-30 05:31:54.891
47	10	37	Language	3	2025-11-05 05:20:50.319	t	តេសត	2025-11-05 05:20:50.319	2025-11-05 05:20:50.319
48	10	37	Math	3	2025-11-05 05:20:54.408	t	តេសត	2025-11-05 05:20:54.408	2025-11-05 05:20:54.408
49	17	45	Math	3	2025-11-06 07:38:14.481	t	\N	2025-11-06 07:38:14.481	2025-11-06 07:38:14.481
\.


--
-- TOC entry 3900 (class 0 OID 16480)
-- Dependencies: 235
-- Data for Name: mentoring_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mentoring_visits (id, mentor_id, pilot_school_id, visit_date, level, purpose, activities, observations, recommendations, follow_up_actions, photos, participants_count, duration_minutes, status, created_at, updated_at, action_plan, activities_data, activity1_clear_instructions, activity1_demonstrated, activity1_duration, activity1_followed_process, activity1_individual, activity1_name_language, activity1_name_numeracy, activity1_no_clear_instructions_reason, activity1_not_followed_reason, activity1_small_groups, activity1_students_practice, activity1_type, activity1_unclear_reason, activity2_clear_instructions, activity2_demonstrated, activity2_duration, activity2_followed_process, activity2_individual, activity2_name_language, activity2_name_numeracy, activity2_no_clear_instructions_reason, activity2_not_followed_reason, activity2_small_groups, activity2_students_practice, activity2_type, activity2_unclear_reason, activity3_clear_instructions, activity3_demonstrated, activity3_duration, activity3_individual, activity3_name_language, activity3_name_numeracy, activity3_no_clear_instructions_reason, activity3_small_groups, activity3_students_practice, children_grouped_appropriately, class_in_session, class_not_in_session_reason, class_started_on_time, classes_conducted_before, classes_conducted_before_visit, commune, district, feedback_for_teacher, follow_up_required, followed_lesson_plan, followed_session_plan, full_session_observed, grade_group, grades_observed, has_session_plan, is_locked, language_levels_observed, late_start_reason, lesson_plan_feedback, locked_at, locked_by, materials_present, no_follow_plan_reason, no_lesson_plan_reason, no_session_plan_reason, not_followed_reason, num_activities_observed, number_of_activities, numeracy_levels_observed, observation, photo, plan_appropriate_for_levels, program_type, province, questionnaire_data, region, school_id, score, session_plan_appropriate, students_active_participation, students_fully_involved, students_grouped_by_level, students_improved, students_improved_from_last_week, students_present, subject_observed, teacher_feedback, teacher_has_lesson_plan, teacher_id, teaching_materials, total_students_enrolled, village, created_by_role, is_temporary, record_status, test_session_id) FROM stdin;
1	7	33	2025-10-20 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-10-20 18:38:04.998	2025-10-20 18:38:04.998	\N	\N	t	f	12	t	\N	\N	ចំនួនដោយប្រើបាច់ឈើនិងឈើ	\N	\N	\N	\N	\N	\N	t	f	12	t	\N	\N	ការអានChartលេខ	\N	\N	\N	\N	\N	\N	t	f	12	\N	\N	ល្បែងលោតលើលេខ	\N	\N	\N	t	t	\N	t	\N	12	\N	\N	\N	f	\N	f	t	\N	["ទី៤"]	f	f	\N	\N	\N	\N	\N	["Chartលេខ ០-៩៩","បណ្ណតម្លៃលេខតាមខ្ទង់","Chartដកលេខដោយផ្ទាល់មាត់","Chartបូកលេខដោយផ្ទាល់មាត់","Chartតម្លៃលេខតាមខ្ទង់","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ"]	\N	\N	\N	\N	\N	3	["កម្រិតដំបូង","លេខ២ខ្ទង់","ប្រមាណវិធីដក"]	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	f	f	t	f	\N	12	12	Math	tst	\N	96	\N	12	\N	\N	f	production	\N
2	7	33	2025-10-21 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-10-21 07:51:55.086	2025-10-21 07:51:55.086	\N	\N	t	f	12	t	\N	ការសន្ទនាសេរី	\N	\N	\N	\N	\N	\N	\N	t	f	12	t	\N	ល្បែងបោះចូលកន្ត្រក (បោះព្យញ្ជនៈ, ស្រៈ , ពាក្យ ចូលកន្ត្រក)	\N	\N	\N	\N	\N	\N	\N	t	f	12	\N	ការអានកថាខណ្ឌ	\N	\N	\N	\N	t	t	\N	t	\N	12	\N	\N	\N	f	\N	t	t	\N	["ទី៤"]	t	f	["កម្រិតដំបូង","តួអក្សរ","ពាក្យ"]	\N	test	\N	\N	["Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","ការតម្រៀបល្បះ និងកូនសៀវភៅកែតម្រូវកំហុស","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)","Chartបូកលេខដោយផ្ទាល់មាត់","បណ្ណពាក្យ/បណ្ណព្យាង្គ","Chartគុណលេខដោយផ្ទាល់មាត់"]	\N	\N	\N	\N	\N	3	\N	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	t	f	t	f	\N	12	12	Khmer	test	\N	96	\N	12	\N	\N	f	production	\N
3	7	33	2025-10-31 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-10-31 10:09:52.529	2025-10-31 14:15:41.449	\N	\N	t	f	12	t	\N	ការពណ៌នារូបភាព	\N	\N	\N	\N	\N	\N	\N	t	f	12	t	\N	ល្បែងត្រឡប់បណ្ណពាក្យ	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	t	t	\N	t	\N	12	\N	\N	\N	f	\N	f	t	\N	["ទី៤"]	t	f	["តួអក្សរ","កថាខណ្ឌ","អត្ថបទខ្លី"]	\N	test	\N	\N	["Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា","Chartគុណលេខដោយផ្ទាល់មាត់"]	\N	\N	\N	\N	\N	2	\N	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	f	f	t	f	\N	12	12	Khmer	មតិយោបល់សម្រាប់គ្រូបង្រៀន (ប្រសិនបើមាន) (១០០-១២០ ពាក្យ)	\N	95	\N	12	\N	\N	f	production	\N
4	10	37	2025-11-05 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-11-05 05:53:58.391	2025-11-05 05:53:58.391	\N	\N	t	f	12	t	\N	ការអានកថាខណ្ឌ	\N	\N	\N	\N	\N	\N	\N	t	f	12	t	\N	ល្បែងត្រឡប់បណ្ណពាក្យ	\N	\N	\N	\N	\N	\N	\N	f	f	\N	\N	\N	\N	\N	\N	\N	t	t	\N	t	\N	12	\N	\N	\N	f	\N	t	t	\N	["ទី៤"]	t	f	["កម្រិតដំបូង","តួអក្សរ","ពាក្យ","កថាខណ្ឌ"]	\N	sdfdsf	\N	\N	["Chartលេខ ០-៩៩","Chartដកលេខដោយផ្ទាល់មាត់","Chartព្យាង្គ","បណ្ណរឿង/អត្ថបទ","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)","Chartគុណលេខដោយផ្ទាល់មាត់","Chartបូកលេខដោយផ្ទាល់មាត់"]	\N	\N	\N	\N	\N	2	\N	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	t	f	t	f	\N	12	12	Khmer	sdfdsf	\N	99	\N	12	\N	\N	f	production	\N
5	4	4	2025-11-08 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-11-08 15:55:27.414	2025-11-08 15:55:27.414	\N	\N	t	f	5	t	\N	ការសន្ទនាសេរី	\N	\N	\N	\N	\N	\N	\N	t	f	5	t	\N	ការអានកថាខណ្ឌ	\N	\N	\N	\N	\N	\N	\N	t	f	15	\N	ការចម្លងនិងសរសេរតាមអាន	\N	\N	\N	\N	t	t	\N	t	\N	2	\N	\N	\N	f	\N	t	t	\N	["ទី៤"]	t	f	["កម្រិតដំបូង","ពាក្យ","កថាខណ្ឌ","តួអក្សរ"]	\N	test	\N	\N	["លេខ ០-៩៩","ដកលេខដោយផ្ទាល់មាត់","ទុយោ","គុណលេខដោយផ្ទាល់មាត់","កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)"]	\N	\N	\N	\N	\N	5	\N	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	t	f	t	f	\N	2	2	Khmer	test	\N	47	\N	30	\N	\N	f	production	\N
\.


--
-- TOC entry 3902 (class 0 OID 16494)
-- Dependencies: 237
-- Data for Name: pilot_schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pilot_schools (id, province, district, cluster_id, cluster, school_name, school_code, baseline_start_date, baseline_end_date, midline_start_date, midline_end_date, endline_start_date, endline_end_date, created_at, updated_at, is_locked) FROM stdin;
19	កំពង់ចាម	កងមាស	\N	កម្រងស្តៅលើអ្នកចុះគាំទ្រ	សាលាបឋមសិក្សាស្តៅ	KAM_SDA_841	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:37	2025-10-21 07:29:35.033	f
16	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងភ្ជាវចុះគាំទ្រ	សាលាបឋមសិក្សារកាភីង	BAT_ROK_614	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:32	2025-10-21 07:36:53.29	f
24	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកលីវចុះគាំទ្រ	សាលាបឋមសិក្សាស្វាយស្រណោះ	KAM_SVA_757	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:43	2025-10-21 07:38:29.287	f
15	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងភ្ជាវចុះគាំទ្រ	សាលាបឋមសិក្សាតាគ្រក់	BAT_TAK_691	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:31	2025-10-21 07:41:26.645	f
13	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងភ្ជាវចុះគាំទ្រ	សាលាបឋមសិក្សាភ្ជាវ	BAT_PCH_569	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:29	2025-10-21 07:43:19.842	f
11	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងព្រៃអំពេរចុះគាំទ្រ	សាលាបឋមសិក្សាសីនតុ	BAT_SIN_290	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:26	2025-10-21 07:45:49.296	f
9	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងបឹងខ្ទុមចុះគាំទ្រ	សាលាបឋមសិក្សាបឹងខ្ទុម	BAT_BEU_872	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:23	2025-10-21 07:49:39.855	f
7	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងស្តៅចុះគាំទ្រ	សាលាបឋមសិក្សាបឹងអំពិល	BAT_BEU_882	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:20	2025-10-21 07:52:28.956	f
5	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងត្រែងចុះគាំទ្រ	សាលាបឋមសិក្សាត្រែង	BAT_TRE_344	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:18	2025-10-21 07:55:43.065	f
3	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងបាដាកចុះគាំទ្រ	បឋមសិក្សាបាដាក	BAT_BAD_335	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:15	2025-10-21 07:58:04.447	f
45	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកកុយចុះគាំទ្រ	បឋមសិក្សាព្រែកកុយ	កំព014718	\N	\N	\N	\N	\N	\N	2025-10-14 04:26:55.8	2025-10-21 08:04:30.036	f
43	កំពង់ចាម	កងមាស	\N	សាលាMentorដែលចុះអនុវត្តជាមួយសិស្ស (មិនមែនសាលាគោលដៅ)	សាលាបឋមសិក្សាគងជ័យ	កំព837368	\N	\N	\N	\N	\N	\N	2025-10-13 07:00:38.403	2025-10-21 08:06:13.331	f
37	បាត់ដំបង	បាត់តំបង	\N	សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាអូរតាគាំ១ (Mentor សាលល្បង)	340946	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-10-09 04:15:42.013	2025-10-21 08:10:25.824	f
41	កំពង់ចាម	កងមាស	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាគងជ័យ( Mentor សាកល្បង)	កំព675304	\N	\N	\N	\N	\N	\N	2025-10-09 09:37:56.378	2025-10-21 08:11:52.692	f
40	កំពង់ចាម	កងមាស	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាស្តៅលើ (Mentor សាកល្បង)	កំព646150	\N	\N	\N	\N	\N	\N	2025-10-09 09:37:29.05	2025-10-21 08:12:25.866	f
34	កំពង់ចាម	កំពង់ចាម	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាបឹងកុក (POE សាកល្បង) កំពង់ចាម	កំព029213	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-10-08 06:30:30.286	2025-10-21 08:13:35.872	f
33	កំពង់ចាម	កំពង់ចាម	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	សាលាសាលល្បងចុះទិន្ន័យរបស៉ Mentor PTTC	DEMO001	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-16 00:15:08	2025-10-21 08:14:56.385	f
31	កំពង់ចាម	កងមាស	\N	កម្រងរាយប៉ាយចុះគាំទ្រ	សាលាបឋមសិក្សាទួលវិហារ	KAM_TOU_631	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:53	2025-10-21 08:16:50.65	f
30	កំពង់ចាម	កងមាស	\N	កម្រងអង្គរបានចុះគាំទ្រ	សាលាបឋមសិក្សាសាខា១	KAM_SAK_402	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:51	2025-10-21 08:17:22.713	f
29	កំពង់ចាម	កងមាស	\N	កម្រងអង្គរបានចុះជួយគាំទ្រ	សាលាបឋមសិក្សាអន្ទង់ស	KAM_ANT_574	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:50	2025-10-21 08:18:10.633	f
26	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកកុយចុះជួយគាំទ្រ	សាលាបឋមសិក្សាអូរស្វាយ	KAM_OUS_666	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:47	2025-10-21 08:21:44.762	f
21	កំពង់ចាម	កងមាស	\N	អ្នកគ្រូ សុជាតា DOE ចុះជួយគាំទ្រ	សាលាបឋមសិក្សាព្រែកតាឡោក	KAM_PRE_559	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:40	2025-10-21 08:23:54.031	f
22	កំពង់ចាម	កងមាស	\N	អ្នកគ្រូ សុជាតា DOE ចុះជួយគាំទ្រ	សាលាបឋមសិក្សាទួលបី	KAM_TOU_569	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:41	2025-10-21 08:24:34.959	f
6	Battambang	Battambang	\N	កម្រងត្រែងចុះគាំទ្រ	Raksmey Sangha PS	BAT_RAK_596	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:19	2025-10-21 08:28:22.857	f
1	បាត់ដំបង	បាត់ដំបង	\N	លោកគ្រូ សែត សុជាតិ និង អ្នកគ្រូ សុន ណៃស៊ីមចុះគាំទ្រ	បឋមសិក្សាអនុវត្តន៍	BAT_ANO_832	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:11	2025-10-21 08:29:43.119	f
20	កំពង់ចាម	កងមាស	\N	កម្រងស្តៅលើអ្នកចុះគាំទ្រ	សាលាបឋមសិក្សាវត្តចាស់	KAM_WAT_774	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:38	2025-10-21 07:27:34.401	f
18	កំពង់ចាម	កងមាស	\N	កម្រងស្តៅលើអ្នកចុះគាំទ្រ	សាលាបឋមសិក្សាស្តៅលើ	KAM_SDA_609	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:36	2025-10-21 07:31:09.198	f
17	កំពង់ចាម	កំពង់ចា	\N	លោកគ្រូបញ្ញា និង អ្មកគ្រូ សុម៉ាលីណា PTTC ចុះគាំទ្រ	សាលាបឋមសិក្សាវាលវង់ 	KAM_VEA_307	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:34	2025-10-21 07:34:36.771	f
23	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកលីវចុះគាំទ្រ	សាលាបឋមសិក្សាខ្ចៅ	KAM_KCH_793	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:42	2025-10-21 07:39:17.641	f
25	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកលីវចុះគាំទ្រ	សាលាបឋមសិក្សារកាអារ	KAM_ROK_564	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:45	2025-10-21 07:40:03.136	f
14	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងភ្ជាវចុះគាំទ្រ	សាលាបឋមសិក្សាជីសាង	BAT_CHI_242	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:30	2025-10-21 07:42:24.02	f
12	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងព្រៃអំពេរចុះគាំទ្រ	សាលាបឋមសិក្សាព្រៃអំពេរ	BAT_PRE_453	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:28	2025-10-21 07:44:52.004	f
10	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងបឹងខ្ទុមចុះគាំទ្រ	សាលាបឋមសិក្សាផ្លូវមាស 	BAT_PLO_314	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:25	2025-10-21 07:48:56.827	f
8	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងស្តៅចុះគាំទ្រ	សាលាបឋមសិក្សាអ៊ុីនសុីដារ៉េ 	BAT_INS_670	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:22	2025-10-21 07:51:28.642	f
4	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងត្រែងចុះគាំទ្រ	សាលាបឋមសិក្សាមាសពិទូគីឡូ៣៨ 	BAT_MEA_377	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:16	2025-10-21 07:57:14.532	f
2	បាត់ដំបង	រតនមណ្ឌល	\N	កម្រងបាដាកចុះគាំទ្រ	សាលាបឋមសិក្សាពេជ្រចង្វា	BAT_PEC_497	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:14	2025-10-21 08:00:26.548	f
44	កំពង់ចាម	កងមាស	\N	កម្រងរាយប៉ាយចុះគាំទ្រ	សាលាបឋមសិក្សារាយប៉ាយ	កំព854437	\N	\N	\N	\N	\N	\N	2025-10-13 07:00:55.847	2025-10-21 08:05:06.843	f
42	កំពង់ចាម	កងមាស	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាសំបួរមាស	កំព794439	\N	\N	\N	\N	\N	\N	2025-10-13 06:59:55.512	2025-10-21 08:07:10.867	f
38	បាត់ដំបង	បាត់ដំបង	\N	សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	សាលាបឋមសិក្សាក្តុលដូនទាវ	252914	\N	\N	\N	\N	\N	\N	2025-10-09 09:30:53.995	2025-10-21 08:09:05.244	f
36	កំពង់ចាម	កំពង់ចាម	\N	សាលាដែលMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាដីដុះ (BTEC សាកល្បង) កំពង់ចាម	267727	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-10-08 06:34:28.263	2025-10-21 08:11:00.745	f
39	កំពង់ចាម	កងមាស	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	សំបួរមាស ( Mentor សាកល្បង)	កំព603674	\N	\N	\N	\N	\N	\N	2025-10-09 09:36:45.572	2025-10-21 08:12:44.589	f
35	កំពង់ចាម	គំពង់ចាម	\N	សាលាMentor ចុះអនុវត្តជាមួយសិស្ស មិនមែនសាលាគោលដៅទេ	បឋមសិក្សាបឹងស្នាយ (POE សាកល្បង)	កំព254119	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-10-08 06:34:15.197	2025-10-21 08:13:12.126	f
32	កំពង់ចាម	កងមាស	\N	កម្រងរាយប៉ាយចុះគាំទ្រ	សាលាបឋមសិក្សារាយប៉ាយ	KAM_REA_470	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:54	2025-10-21 08:16:05.063	f
28	កំពង់ចាម	កងមាស	\N	កម្រងអង្គរបាន ចុះជួយគាំទ្រ	សាលាឋបសិក្សាសាខា២	KAM_SAK_138	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:49	2025-10-21 08:19:22.047	f
27	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកកុយចុះជួយគាំទ្រ	សាលាបឋមសិក្សាព្រែកកុយ	KAM_PRE_826	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:48	2025-10-21 08:21:00.157	f
\.


--
-- TOC entry 3904 (class 0 OID 16502)
-- Dependencies: 239
-- Data for Name: progress_trackings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress_trackings (id, student_id, tracking_date, khmer_progress, math_progress, attendance_rate, behavior_notes, teacher_comments, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3906 (class 0 OID 16509)
-- Dependencies: 241
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provinces (id, name_english, name_khmer, code, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3908 (class 0 OID 16516)
-- Dependencies: 243
-- Data for Name: quick_login_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quick_login_users (id, username, password, role, province, subject, is_active, created_at, updated_at, district, holding_classes, pilot_school_id, onboarding_completed, onboarding_completed_at, show_onboarding) FROM stdin;
8	kairav	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	admin	\N	\N	t	2025-09-27 05:57:48.469	2025-09-27 05:57:48.469	\N	\N	\N	\N	\N	t
9	admin	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	admin	\N	\N	t	2025-09-27 05:57:48.491	2025-09-27 05:57:48.491	\N	\N	\N	\N	\N	t
10	coordinator	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	coordinator	\N	\N	t	2025-09-27 05:57:48.499	2025-09-27 05:57:48.499	\N	\N	\N	\N	\N	t
11	deab.chhoeun	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.507	2025-09-27 05:57:48.507	\N	\N	\N	\N	\N	t
12	heap.sophea	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.52	2025-09-27 05:57:48.52	\N	\N	\N	\N	\N	t
13	leang.chhun.hourth	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.527	2025-09-27 05:57:48.527	\N	\N	\N	\N	\N	t
14	mentor1	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.536	2025-09-27 05:57:48.536	\N	\N	\N	\N	\N	t
15	mentor2	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.557	2025-09-27 05:57:48.557	\N	\N	\N	\N	\N	t
16	chhorn.sopheak	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.564	2025-09-27 05:57:48.564	\N	\N	\N	\N	\N	t
17	em.rithy	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.572	2025-09-27 05:57:48.572	\N	\N	\N	\N	\N	t
18	nhim.sokha	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.58	2025-09-27 05:57:48.58	\N	\N	\N	\N	\N	t
19	noa.cham.roeun	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.588	2025-09-27 05:57:48.588	\N	\N	\N	\N	\N	t
20	rorn.sareang	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.595	2025-09-27 05:57:48.595	\N	\N	\N	\N	\N	t
21	sorn.sophaneth	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.602	2025-09-27 05:57:48.602	\N	\N	\N	\N	\N	t
22	eam.vichhak.rith	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.612	2025-09-27 05:57:48.612	\N	\N	\N	\N	\N	t
23	el.kunthea	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.619	2025-09-27 05:57:48.619	\N	\N	\N	\N	\N	t
24	san.aun	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.626	2025-09-27 05:57:48.626	\N	\N	\N	\N	\N	t
26	horn.socheata	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.647	2025-09-27 05:57:48.647	\N	\N	\N	\N	\N	t
27	phann.savoeun	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.655	2025-09-27 05:57:48.655	\N	\N	\N	\N	\N	t
28	sin.borndoul	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.67	2025-09-27 05:57:48.67	\N	\N	\N	\N	\N	t
29	chann.leakeana.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.678	2025-09-27 05:57:48.678	\N	\N	\N	\N	\N	t
30	ho.mealtey.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.686	2025-09-27 05:57:48.686	\N	\N	\N	\N	\N	t
31	hol.phanna.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.694	2025-09-27 05:57:48.694	\N	\N	\N	\N	\N	t
32	ieang.bunthoeurn.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.701	2025-09-27 05:57:48.701	\N	\N	\N	\N	\N	t
33	kan.ray.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.71	2025-09-27 05:57:48.71	\N	\N	\N	\N	\N	t
34	keo.socheat.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.723	2025-09-27 05:57:48.723	\N	\N	\N	\N	\N	t
35	keo.vesith.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.731	2025-09-27 05:57:48.731	\N	\N	\N	\N	\N	t
36	khim.kosal.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.739	2025-09-27 05:57:48.739	\N	\N	\N	\N	\N	t
37	koe.kimsou.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.753	2025-09-27 05:57:48.753	\N	\N	\N	\N	\N	t
38	kheav.sreyoun.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.763	2025-09-27 05:57:48.763	\N	\N	\N	\N	\N	t
39	ret.sreynak.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.775	2025-09-27 05:57:48.775	\N	\N	\N	\N	\N	t
40	nann.phary.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.783	2025-09-27 05:57:48.783	\N	\N	\N	\N	\N	t
41	ny.cheanichniron.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.792	2025-09-27 05:57:48.792	\N	\N	\N	\N	\N	t
42	oeun.kosal.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.807	2025-09-27 05:57:48.807	\N	\N	\N	\N	\N	t
43	on.phors.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.815	2025-09-27 05:57:48.815	\N	\N	\N	\N	\N	t
44	ou.sreynuch.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.835	2025-09-27 05:57:48.835	\N	\N	\N	\N	\N	t
45	pat.sokheng.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.843	2025-09-27 05:57:48.843	\N	\N	\N	\N	\N	t
46	pech.peakleka.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.852	2025-09-27 05:57:48.852	\N	\N	\N	\N	\N	t
47	raeun.sovathary.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.86	2025-09-27 05:57:48.86	\N	\N	\N	\N	\N	t
48	rin.vannra.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.867	2025-09-27 05:57:48.867	\N	\N	\N	\N	\N	t
49	rom.ratanak.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.88	2025-09-27 05:57:48.88	\N	\N	\N	\N	\N	t
50	sak.samnang.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.889	2025-09-27 05:57:48.889	\N	\N	\N	\N	\N	t
51	sang.sangha.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.898	2025-09-27 05:57:48.898	\N	\N	\N	\N	\N	t
52	seum.sovin.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.906	2025-09-27 05:57:48.906	\N	\N	\N	\N	\N	t
53	soeun.danut.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.919	2025-09-27 05:57:48.919	\N	\N	\N	\N	\N	t
54	sokh.chamrong.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.935	2025-09-27 05:57:48.935	\N	\N	\N	\N	\N	t
25	chhoeng.marady	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	Battambang	both	t	2025-09-27 05:57:48.64	2025-10-02 03:33:07.818	Battambang	both	1	["complete_profile"]	2025-10-02 03:33:07.818	t
55	som.phally.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.951	2025-09-27 05:57:48.951	\N	\N	\N	\N	\N	t
56	sor.kimseak.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.964	2025-09-27 05:57:48.964	\N	\N	\N	\N	\N	t
57	soth.thida.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.977	2025-09-27 05:57:48.977	\N	\N	\N	\N	\N	t
58	tep.sokly.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.993	2025-09-27 05:57:48.993	\N	\N	\N	\N	\N	t
59	thiem.thida.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:49.002	2025-09-27 05:57:49.002	\N	\N	\N	\N	\N	t
60	thy.sophat.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:49.021	2025-09-27 05:57:49.021	\N	\N	\N	\N	\N	t
61	chea.putthyda.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.031	2025-09-27 05:57:49.031	\N	\N	\N	\N	\N	t
62	moy.sodara.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.039	2025-09-27 05:57:49.039	\N	\N	\N	\N	\N	t
63	chhom.borin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.069	2025-09-27 05:57:49.069	\N	\N	\N	\N	\N	t
64	hoat.vimol.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.084	2025-09-27 05:57:49.084	\N	\N	\N	\N	\N	t
65	khoem.sithuon.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.091	2025-09-27 05:57:49.091	\N	\N	\N	\N	\N	t
66	neang.spheap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.105	2025-09-27 05:57:49.105	\N	\N	\N	\N	\N	t
67	nov.barang.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.112	2025-09-27 05:57:49.112	\N	\N	\N	\N	\N	t
68	onn.thalin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.119	2025-09-27 05:57:49.119	\N	\N	\N	\N	\N	t
69	pheap.sreynith.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.128	2025-09-27 05:57:49.128	\N	\N	\N	\N	\N	t
70	phoeurn.virath.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.135	2025-09-27 05:57:49.135	\N	\N	\N	\N	\N	t
71	phuong.pheap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.142	2025-09-27 05:57:49.142	\N	\N	\N	\N	\N	t
72	say.kamsath.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.149	2025-09-27 05:57:49.149	\N	\N	\N	\N	\N	t
73	sorm.vannak.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.156	2025-09-27 05:57:49.156	\N	\N	\N	\N	\N	t
74	sum.chek.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.163	2025-09-27 05:57:49.163	\N	\N	\N	\N	\N	t
75	teour.phanna.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.172	2025-09-27 05:57:49.172	\N	\N	\N	\N	\N	t
77	chhorn.srey.pov.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.188	2025-09-27 05:57:49.188	\N	\N	\N	\N	\N	t
78	heak.tom.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.195	2025-09-27 05:57:49.195	\N	\N	\N	\N	\N	t
79	heng.chhengky.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.202	2025-09-27 05:57:49.202	\N	\N	\N	\N	\N	t
80	heng.navy.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.209	2025-09-27 05:57:49.209	\N	\N	\N	\N	\N	t
81	heng.neang.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.217	2025-09-27 05:57:49.217	\N	\N	\N	\N	\N	t
82	him.sokhaleap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.224	2025-09-27 05:57:49.224	\N	\N	\N	\N	\N	t
83	mach.serynak.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.234	2025-09-27 05:57:49.234	\N	\N	\N	\N	\N	t
84	my.savy.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.241	2025-09-27 05:57:49.241	\N	\N	\N	\N	\N	t
85	nov.pelim.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.251	2025-09-27 05:57:49.251	\N	\N	\N	\N	\N	t
86	oll.phaleap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.257	2025-09-27 05:57:49.257	\N	\N	\N	\N	\N	t
87	phann.srey.roth.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.275	2025-09-27 05:57:49.275	\N	\N	\N	\N	\N	t
88	phornd.sokthy.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.281	2025-09-27 05:57:49.281	\N	\N	\N	\N	\N	t
89	seiha.ratana.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.293	2025-09-27 05:57:49.293	\N	\N	\N	\N	\N	t
90	seun.sophary.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.3	2025-09-27 05:57:49.3	\N	\N	\N	\N	\N	t
91	thin.dalin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.307	2025-09-27 05:57:49.307	\N	\N	\N	\N	\N	t
92	nheb.channin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.316	2025-09-27 05:57:49.316	\N	\N	\N	\N	\N	t
93	viewer	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	viewer	\N	\N	t	2025-09-27 05:57:49.325	2025-09-27 05:57:49.325	\N	\N	\N	\N	\N	t
95	sanaun123	$2b$10$AfG4Ksb5y0stEKzgA7FIUO15Y53Fq9eUGVkHATPGJB0fkKcw0x6Fi	teacher	Kampong Cham	គណិតវិទ្យា	t	2025-10-02 10:01:36.097	2025-10-02 10:01:36.097	Kampong Cham	ថ្នាក់ទី៤, ថ្នាក់ទី៥	33	\N	\N	t
76	chan.kimsrorn.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	khmer	t	2025-09-27 05:57:49.179	2025-10-02 04:35:48.541	Battambang	grade_5	1	["complete_profile"]	2025-10-02 03:23:44.848	t
94	Cheaphannha	$2b$10$NUZ4k4BZUpfEgFp5JJTb/.NE8N85B6H3AvtQzzcYL6C6/O9z1XIn6	mentor	Kampong Cham	គណិតវិទ្យា	t	2025-10-02 09:21:17.284	2025-10-02 09:21:17.284	Kampong Cham	ថ្នាក់ទី៤, ថ្នាក់ទី៥	33	\N	\N	t
\.


--
-- TOC entry 3910 (class 0 OID 16526)
-- Dependencies: 245
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate_limits (id, identifier, endpoint, requests_count, window_start, blocked_until, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3912 (class 0 OID 16535)
-- Dependencies: 247
-- Data for Name: report_exports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_exports (id, report_type, filters, file_path, status, exported_by, created_at, completed_at) FROM stdin;
\.


--
-- TOC entry 3914 (class 0 OID 16543)
-- Dependencies: 249
-- Data for Name: resource_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_views (id, resource_id, user_id, ip_address, user_agent, viewed_at) FROM stdin;
\.


--
-- TOC entry 3916 (class 0 OID 16550)
-- Dependencies: 251
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, title, description, type, file_url, youtube_url, grade_levels, subjects, uploaded_by, is_public, views_count, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3918 (class 0 OID 16559)
-- Dependencies: 253
-- Data for Name: school_classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.school_classes (id, school_id, name, grade, teacher_name, student_count, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3920 (class 0 OID 16566)
-- Dependencies: 255
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, code, province_id, district, commune, village, school_type, level, total_students, total_teachers, latitude, longitude, phone, email, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3922 (class 0 OID 16574)
-- Dependencies: 257
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, key, value, type, description, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3924 (class 0 OID 16581)
-- Dependencies: 259
-- Data for Name: student_assessment_eligibilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_assessment_eligibilities (id, student_id, assessment_type, is_eligible, reason, eligible_from, eligible_until, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3926 (class 0 OID 16589)
-- Dependencies: 261
-- Data for Name: student_interventions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_interventions (id, student_id, intervention_program_id, start_date, end_date, status, progress_notes, outcome, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3928 (class 0 OID 16597)
-- Dependencies: 263
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, school_class_id, pilot_school_id, name, age, gender, guardian_name, guardian_phone, address, photo, baseline_assessment, midline_assessment, endline_assessment, baseline_khmer_level, baseline_math_level, midline_khmer_level, midline_math_level, endline_khmer_level, endline_math_level, is_active, is_temporary, added_by_id, added_by_mentor, assessed_by_mentor, mentor_created_at, created_at, updated_at, created_by_role, record_status, test_session_id, student_id, grade) FROM stdin;
47	\N	8	អាត ឧត្តមបញ្ញាសិរីវឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:43:39.774	2025-10-06 08:43:39.775	2025-10-12 02:57:33.283	mentor	test_mentor	\N	3027	4
46	\N	8	ថេង ណាថាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:42:20.923	2025-10-06 08:42:20.926	2025-10-12 02:54:01.384	mentor	test_mentor	\N	3213	5
48	\N	8	វណ្ណ សុផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:44:21.293	2025-10-06 08:44:21.296	2025-10-12 02:59:04.928	mentor	test_mentor	\N	3106	5
49	\N	8	សំណាង ចិន្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:44:58.897	2025-10-06 08:44:58.899	2025-10-12 03:01:03.083	mentor	test_mentor	\N	2991	4
50	\N	8	សេថាន ប្រាយុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:46:26.566	2025-10-06 08:46:26.567	2025-10-12 03:02:36.468	mentor	test_mentor	\N	3082	5
51	\N	8	សែន ចាន់ស៊ីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:47:06.9	2025-10-06 08:47:06.901	2025-10-12 03:04:03.84	mentor	test_mentor	\N	3190	5
4	\N	1	ស្កាលិត	12	ស្រី	sovath a	0121122121	12121	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 08:31:39.48	2025-10-06 10:40:48.091	teacher	archived	\N	\N	\N
2	\N	1	sovath	13	ប្រុស	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 03:35:20.38	2025-10-06 10:40:43.441	teacher	archived	\N	\N	\N
5	\N	33	អាត ណារាត់	13	ប្រុស	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:38:17.424	2025-10-02 11:38:17.424	teacher	production	\N	\N	\N
6	\N	33	ហម ម៉េងលី	11	ប្រុស	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:40:33.382	2025-10-02 11:40:33.382	teacher	production	\N	\N	\N
7	\N	33	រស់ ផាន់ណា	12	ស្រី	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:41:31.483	2025-10-02 11:41:31.483	teacher	production	\N	\N	\N
8	\N	33	មឿន សុខបាន	13	ប្រុស	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:42:47.283	2025-10-02 11:42:47.283	teacher	production	\N	\N	\N
9	\N	33	លី តៃឡឹង	11	ប្រុស	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:48:35.499	2025-10-02 11:48:35.499	teacher	production	\N	\N	\N
10	\N	33	បូរ៉ា ឆៃយ៉ា	10	ប្រុស	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	95	f	f	\N	2025-10-02 11:54:44.495	2025-10-02 11:54:44.495	teacher	production	\N	\N	\N
52	\N	8	ណាល់ វ៉ាឃីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:47:54.315	2025-10-06 08:47:54.316	2025-10-12 03:05:37.164	mentor	test_mentor	\N	3101	4
53	\N	8	កែវ យ៉ីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:48:32.084	2025-10-06 08:48:32.085	2025-10-12 03:06:56.893	mentor	test_mentor	\N	3133	5
14	\N	33	ម៉ៅ តុលា	9	ប្រុស	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	95	f	t	\N	2025-10-02 11:57:18.254	2025-10-04 15:39:18.715	teacher	production	\N	\N	\N
13	\N	33	រុន សុផល	9	ប្រុស	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	95	f	t	\N	2025-10-02 11:56:32.287	2025-10-05 07:20:58.036	teacher	production	\N	\N	\N
12	\N	33	ប៊ុត វាសនា	9	ប្រុស	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	95	f	t	\N	2025-10-02 11:56:04.793	2025-10-05 07:21:01.948	teacher	production	\N	\N	\N
11	\N	33	ឡាន សិនលី	9	ប្រុស	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	95	f	t	\N	2025-10-02 11:55:13.614	2025-10-05 07:21:05.575	teacher	production	\N	\N	\N
35	\N	8	មាន សម្រស់	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 04:02:43.318	2025-10-06 04:02:43.319	2025-10-06 04:06:03.17	mentor	test_mentor	\N	00111៤	4
34	\N	8	រស់ សាក់សម្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 04:02:10.115	2025-10-06 04:02:10.117	2025-10-06 04:07:27.398	mentor	test_mentor	\N	001113	4
36	\N	8	យឿន វិច្ឆកា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:15:35.064	2025-10-06 05:15:35.067	2025-10-06 05:30:32.21	mentor	test_mentor	\N	5725	4
37	\N	8	សឺន រ័ត្ននី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:16:56.965	2025-10-06 05:16:56.967	2025-10-06 05:36:17.54	mentor	test_mentor	\N	5650	4
38	\N	8	សឺន ទិត្យសុភា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:19:06.983	2025-10-06 05:19:06.984	2025-10-06 05:38:07.78	mentor	test_mentor	\N	5651	4
39	\N	8	ស៊ាវ ដាលីញ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:20:03.884	2025-10-06 05:20:03.885	2025-10-06 05:40:09.801	mentor	test_mentor	\N	5743	4
40	\N	8	ឆង សុវណ្ណរាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:21:37.279	2025-10-06 05:21:37.28	2025-10-06 05:41:38.207	mentor	test_mentor	\N	5676	4
41	\N	8	សឺន សុខវាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:22:44.819	2025-10-06 05:22:44.82	2025-10-06 05:43:05.255	mentor	test_mentor	\N	5580	5
42	\N	8	ហ្វី ហ្វាហ្ស៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:23:49.165	2025-10-06 05:23:49.166	2025-10-06 05:44:32.654	mentor	test_mentor	\N	5813	5
43	\N	8	ភ្នំ វិថៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:24:48.208	2025-10-06 05:24:48.209	2025-10-06 05:45:48.726	mentor	test_mentor	\N	5550	5
44	\N	8	វុន មិនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:25:28.161	2025-10-06 05:25:28.162	2025-10-06 05:47:23.299	mentor	test_mentor	\N	5547	5
45	\N	8	ភ័ក្រ លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	11	t	t	2025-10-06 05:26:17.509	2025-10-06 05:26:17.51	2025-10-06 05:48:50.718	mentor	test_mentor	\N	5453	5
3	\N	1	salena	12	ស្រី	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 07:56:20.912	2025-10-06 10:40:39.375	teacher	archived	\N	\N	\N
54	\N	8	ចំរើន លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:49:32.562	2025-10-06 08:49:32.563	2025-10-06 09:08:48.833	mentor	test_mentor	\N	2772	5
17	\N	25	លោក វិបុល	14	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	f	f	69	f	f	\N	2025-10-05 07:35:51.431	2025-10-06 10:40:59.882	teacher	archived	\N	\N	\N
56	\N	4	ប៉ាក់ ខេមម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:33:18.075	2025-10-08 10:33:18.077	2025-10-08 11:18:01.049	mentor	test_mentor	\N	1915	4
32	\N	29	មាន វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	9	t	t	2025-10-05 10:30:04.665	2025-10-05 10:30:04.666	2025-10-09 04:48:13.151	mentor	test_mentor	\N	32	5
348	\N	44	ធឿន សុខជា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:26:09.029	2025-10-14 07:26:09.03	2025-10-14 07:44:20.576	mentor	test_mentor	\N	037	4
347	\N	44	ណៃដា នុច	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:25:23.748	2025-10-14 07:25:23.749	2025-10-14 07:45:03.371	mentor	test_mentor	\N	034	5
295	\N	1	ជា រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	101	t	t	2025-10-13 13:48:13.826	2025-10-13 13:48:13.827	2025-10-17 01:28:02.998	mentor	test_mentor	\N	000015	4
64	\N	4	ខាយ ស្រីខួច	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:41:35.582	2025-10-08 10:41:35.583	2025-10-08 10:54:23.736	mentor	test_mentor	\N	1897	4
63	\N	4	ចេង សុខរក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:40:45.408	2025-10-08 10:40:45.409	2025-10-08 10:59:04.042	mentor	test_mentor	\N	1902	4
62	\N	4	អើន សុផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:39:58.658	2025-10-08 10:39:58.659	2025-10-08 11:04:49.975	mentor	test_mentor	\N	1938	4
61	\N	4	ចោម រដ្ឋា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:39:10.01	2025-10-08 10:39:10.011	2025-10-08 11:07:16.747	mentor	test_mentor	\N	1901	4
24	\N	23	ឈឿន មង្គលឧត្តម	13	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:50:35.307	2025-11-12 01:55:15.968	teacher	archived	\N	\N	\N
23	\N	23	ថា សុខសីម៉ូលី	13	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:50:14.929	2025-11-12 01:55:21.028	teacher	archived	\N	0986	5
22	\N	23	សា រ៉ាវី	15	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:49:50.594	2025-11-12 01:55:27.651	teacher	archived	\N	\N	\N
20	\N	23	នាង មូលី	12	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	story	\N	f	f	98	f	t	\N	2025-10-05 07:48:54.547	2025-11-12 01:55:36.909	teacher	archived	\N	\N	\N
19	\N	23	លី ហ្វីហុង	12	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:48:52.65	2025-11-12 01:55:41.851	teacher	archived	\N	\N	\N
27	\N	23	វិបុល សុខបញ្ញា	10	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	story	\N	f	f	98	f	f	\N	2025-10-05 07:52:10.076	2025-11-12 01:47:01.036	teacher	archived	\N	001	4
25	\N	23	ស៊្រន់ សូនីតា	14	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	word_problems	f	f	98	f	t	\N	2025-10-05 07:51:03.382	2025-11-12 01:55:12.457	teacher	archived	\N	\N	\N
60	\N	4	ហូន ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:38:20.639	2025-10-08 10:38:20.64	2025-10-08 11:09:28.019	mentor	test_mentor	\N	1937	4
59	\N	4	ចន្ធី ជីវន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:37:32.294	2025-10-08 10:37:32.295	2025-10-08 11:11:29.387	mentor	test_mentor	\N	1921	4
58	\N	4	ភិរម្យ អរុណ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:35:30.976	2025-10-08 10:35:30.977	2025-10-08 11:14:00.78	mentor	test_mentor	\N	1919	4
57	\N	4	មឿន ឡតម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	4	t	t	2025-10-08 10:34:34.334	2025-10-08 10:34:34.335	2025-10-08 11:16:01.387	mentor	test_mentor	\N	1920	4
55	\N	8	អាង សូរស័ក្ដិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	18	t	t	2025-10-06 08:50:35.152	2025-10-06 08:50:35.153	2025-10-12 03:09:49.321	mentor	test_mentor	\N	3103	4
96	\N	8	ហេន ណារាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:15:22.387	2025-10-08 13:15:22.388	2025-10-13 01:32:28.153	mentor	test_mentor	\N	0020	5
95	\N	8	គីម ហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:14:51.028	2025-10-08 13:14:51.029	2025-10-13 01:34:09.511	mentor	test_mentor	\N	0019	5
70	\N	9	សល់ សូណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	5	t	t	2025-10-08 12:27:43.798	2025-10-08 12:27:43.799	2025-10-08 13:25:12.995	mentor	test_mentor	\N	005	4
69	\N	9	ចាន់ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	number_2digit	t	t	5	t	t	2025-10-08 12:26:30.169	2025-10-08 12:26:30.17	2025-10-08 13:27:11.745	mentor	test_mentor	\N	004	4
68	\N	9	រុំ ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	word_problems	t	t	5	t	t	2025-10-08 12:24:29.466	2025-10-08 12:24:29.467	2025-10-08 13:28:47.099	mentor	test_mentor	\N	003	4
85	\N	13	គង់ ចិន្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	13	t	t	2025-10-08 12:39:39.132	2025-10-08 12:39:39.133	2025-10-11 01:24:46.635	mentor	test_mentor	\N	044	4
67	\N	9	ធី ឡាយហួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	subtraction	t	t	5	t	t	2025-10-08 12:22:16.644	2025-10-08 12:22:16.647	2025-10-08 13:30:29.419	mentor	test_mentor	\N	002	4
84	\N	13	វ៉ិត ជីវ័ន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	13	t	t	2025-10-08 12:38:59.812	2025-10-08 12:38:59.814	2025-10-11 01:27:13.281	mentor	test_mentor	\N	065	5
83	\N	13	សម្បត្តិ រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	subtraction	t	t	13	t	t	2025-10-08 12:37:48.203	2025-10-08 12:37:48.204	2025-10-11 01:30:14.712	mentor	test_mentor	\N	066	4
92	\N	8	លឹម ថោងសុខគៀង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:12:28.557	2025-10-08 13:12:28.558	2025-10-13 01:41:00.217	mentor	test_mentor	\N	0016	4
82	\N	13	លឹម សេងលីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	13	t	t	2025-10-08 12:36:50.187	2025-10-08 12:36:50.188	2025-10-11 01:31:43.165	mentor	test_mentor	\N	063	4
81	\N	13	យុត ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	13	t	t	2025-10-08 12:35:55.01	2025-10-08 12:35:55.011	2025-10-11 01:33:00.068	mentor	test_mentor	\N	058	4
93	\N	8	សុវណ្ណ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	14	t	t	2025-10-08 13:13:12.196	2025-10-08 13:13:12.197	2025-10-13 01:39:26.559	mentor	test_mentor	\N	0017	4
91	\N	8	ហាក់ពេជ្រ លីស៊ីងយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	14	t	t	2025-10-08 13:11:24.746	2025-10-08 13:11:24.747	2025-10-13 01:42:27.621	mentor	test_mentor	\N	0015	4
90	\N	8	ជាតិ ឧត្តរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:10:25.639	2025-10-08 13:10:25.64	2025-10-13 01:44:11.488	mentor	test_mentor	\N	0014	4
80	\N	13	សារឿន រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	number_2digit	t	t	13	t	t	2025-10-08 12:34:24.497	2025-10-08 12:34:24.499	2025-10-11 01:34:35.192	mentor	test_mentor	\N	068	4
88	\N	8	អែល ណាហ្វី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	14	t	t	2025-10-08 13:09:11.953	2025-10-08 13:09:11.954	2025-10-13 01:45:50.524	mentor	test_mentor	\N	0013	4
78	\N	13	បូ សាកាយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	13	t	t	2025-10-08 12:33:20.014	2025-10-08 12:33:20.015	2025-10-11 01:36:06.13	mentor	test_mentor	\N	054	4
77	\N	13	គឹង បូណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	13	t	t	2025-10-08 12:32:28.966	2025-10-08 12:32:28.967	2025-10-11 01:37:32.347	mentor	test_mentor	\N	046	4
76	\N	9	សាំង សុភក្រ្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	5	t	t	2025-10-08 12:32:24.845	2025-10-08 12:32:24.846	2025-10-08 13:13:04.587	mentor	test_mentor	\N	010	5
74	\N	13	គឹង បូរិន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	13	t	t	2025-10-08 12:31:06.029	2025-10-08 12:31:06.03	2025-10-11 01:38:45.169	mentor	test_mentor	\N	045	4
87	\N	8	សាវណ្ណ ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:06:17.189	2025-10-08 13:06:17.19	2025-10-13 01:47:16.76	mentor	test_mentor	\N	0012	4
75	\N	9	រ៉ា សោភ័ណ្ឌ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	5	t	t	2025-10-08 12:31:34.554	2025-10-08 12:31:34.555	2025-10-08 13:15:11.842	mentor	test_mentor	\N	009	5
73	\N	9	ចិន្ដា ដាឡាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	5	t	t	2025-10-08 12:30:46.739	2025-10-08 12:30:46.74	2025-10-08 13:18:10.372	mentor	test_mentor	\N	008	5
72	\N	9	ម៉ាប់ លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	subtraction	t	t	5	t	t	2025-10-08 12:30:03.914	2025-10-08 12:30:03.915	2025-10-08 13:21:15.964	mentor	test_mentor	\N	007	5
71	\N	9	ជ្រឿន សម្ផស្ស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	5	t	t	2025-10-08 12:28:56.6	2025-10-08 12:28:56.601	2025-10-08 13:23:32.254	mentor	test_mentor	\N	006	5
98	\N	2	ឆន អេលី	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	t	21	t	t	2025-10-08 14:21:57.411	2025-10-08 14:21:57.414	2025-10-08 14:33:02.458	mentor	test_mentor	\N	00001	4
102	\N	2	សៀប លីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	story	\N	comprehension2	\N	t	t	21	t	t	2025-10-08 14:24:01.897	2025-10-08 14:24:01.898	2025-10-08 14:51:29.599	mentor	test_mentor	\N	00005	4
99	\N	2	ណារ៉ង់ ហ្សាគី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	paragraph	\N	comprehension2	\N	t	t	21	t	t	2025-10-08 14:22:36.799	2025-10-08 14:22:36.8	2025-10-08 14:49:26.222	mentor	test_mentor	\N	00002	4
106	\N	2	លឿយ ដាឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	21	t	t	2025-10-08 14:30:13.115	2025-10-08 14:30:13.116	2025-10-08 14:36:05.781	mentor	test_mentor	\N	00009	5
107	\N	2	សឿន ចំរើន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	story	\N	comprehension2	\N	t	t	21	t	t	2025-10-08 14:30:39.353	2025-10-08 14:30:39.354	2025-10-08 14:53:38.322	mentor	test_mentor	\N	00010	4
105	\N	2	ហ៊ីម គឹមហាន	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	word	\N	word	\N	t	t	21	t	t	2025-10-08 14:28:32.129	2025-10-08 14:28:32.13	2025-10-08 14:53:07.353	mentor	test_mentor	\N	00008	5
104	\N	2	ណាត នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	letter	\N	word	\N	t	t	21	t	t	2025-10-08 14:25:02.094	2025-10-08 14:25:02.097	2025-10-08 14:52:11.27	mentor	test_mentor	\N	00007	5
103	\N	2	ឡុង ល្វីស៊ីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	paragraph	\N	\N	\N	t	t	21	t	t	2025-10-08 14:24:33.186	2025-10-08 14:24:33.188	2025-10-08 14:46:14.769	mentor	test_mentor	\N	00006	5
101	\N	2	សំបូរ ពេជ្រពណ្ណរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	comprehension2	\N	comprehension2	\N	t	t	21	t	t	2025-10-08 14:23:33.194	2025-10-08 14:23:33.195	2025-10-08 14:50:54.003	mentor	test_mentor	\N	00004	4
100	\N	2	ឡឺត សុខវិកែវ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	word	\N	t	t	21	t	t	2025-10-08 14:23:02.026	2025-10-08 14:23:02.027	2025-10-08 14:50:04.553	mentor	test_mentor	\N	00003	4
86	\N	13	ជឿន ស្រីដេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	subtraction	t	t	13	t	t	2025-10-08 12:40:38.693	2025-10-08 12:40:38.694	2025-10-11 01:22:14.158	mentor	test_mentor	\N	048	4
110	\N	33	ហាក់ សាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	division	\N	word_problems	t	t	94	t	t	2025-10-08 15:21:00.167	2025-10-08 15:21:00.168	2025-10-08 16:00:29.926	mentor	test_mentor	\N	03	4
118	\N	28	ចាន់ សុខវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	19	t	t	2025-10-09 02:51:51.655	2025-10-09 02:51:51.657	2025-10-09 03:44:07.991	mentor	test_mentor	\N	00041	4
127	\N	28	ស្រ៊ីម ធារៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	story	\N	t	t	19	t	t	2025-10-09 03:01:39.438	2025-10-09 03:01:39.439	2025-10-09 03:50:38.759	mentor	test_mentor	\N	00055	5
114	\N	33	រ៉េន សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	t	94	t	t	2025-10-08 15:24:23.407	2025-10-08 15:24:23.408	2025-10-08 15:40:57.431	mentor	test_mentor	\N	07	5
117	\N	33	យាន វុទ្ធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	t	94	t	t	2025-10-08 15:26:09.215	2025-10-08 15:26:09.216	2025-10-08 15:44:26.031	mentor	test_mentor	\N	10	5
126	\N	28	សំរិទ្ធ ឈីងលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	comprehension2	\N	t	t	19	t	t	2025-10-09 03:00:58.914	2025-10-09 03:00:58.915	2025-10-09 03:54:47.137	mentor	test_mentor	\N	00054	5
108	\N	33	កេង លីឈួ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	division	\N	word_problems	t	t	94	t	t	2025-10-08 15:19:43.688	2025-10-08 15:19:43.69	2025-10-08 15:58:12.646	mentor	test_mentor	\N	01	4
109	\N	33	ខេមរៈ វីរៈបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	word_problems	\N	word_problems	t	t	94	t	t	2025-10-08 15:20:29.76	2025-10-08 15:20:29.761	2025-10-08 15:59:28.55	mentor	test_mentor	\N	02	4
111	\N	33	នី ម៉ូលីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	division	\N	word_problems	t	t	94	t	t	2025-10-08 15:21:53.722	2025-10-08 15:21:53.723	2025-10-08 16:01:56.805	mentor	test_mentor	\N	04	4
112	\N	33	ចក្រី មួយលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	word_problems	\N	word_problems	t	t	94	t	t	2025-10-08 15:23:07.006	2025-10-08 15:23:07.007	2025-10-08 16:03:14.735	mentor	test_mentor	\N	05	5
113	\N	33	តាំង ស៊ាវហឺ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	word_problems	\N	word_problems	t	t	94	t	t	2025-10-08 15:23:52.258	2025-10-08 15:23:52.26	2025-10-08 16:04:20.697	mentor	test_mentor	\N	06	5
115	\N	33	លី ម៉ីជូ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	word_problems	\N	word_problems	t	t	94	t	t	2025-10-08 15:25:01.022	2025-10-08 15:25:01.023	2025-10-08 16:05:24.089	mentor	test_mentor	\N	08	5
116	\N	33	វិចិត្ត ជិលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	word_problems	\N	word_problems	t	t	94	t	t	2025-10-08 15:25:37.62	2025-10-08 15:25:37.621	2025-10-08 16:06:21.932	mentor	test_mentor	\N	09	5
122	\N	28	ង៉ា សង្ហា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	19	t	t	2025-10-09 02:57:05.033	2025-10-09 02:57:05.035	2025-10-09 03:39:33.941	mentor	test_mentor	\N	00045	4
121	\N	28	ចាន់ ត្រ័យលក្ខណ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	19	t	t	2025-10-09 02:55:40.942	2025-10-09 02:55:40.944	2025-10-09 03:40:40.468	mentor	test_mentor	\N	00044	4
120	\N	28	ទូច ភ័ក្ត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	19	t	t	2025-10-09 02:54:30.631	2025-10-09 02:54:30.633	2025-10-09 03:41:30.582	mentor	test_mentor	\N	00043	4
119	\N	28	ធី សុខលាប	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	19	t	t	2025-10-09 02:53:21.045	2025-10-09 02:53:21.046	2025-10-09 03:42:52.681	mentor	test_mentor	\N	00042	4
136	\N	33	យឿន ឈីវសា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:57:55.208	2025-10-09 03:57:55.209	2025-10-09 04:05:37.47	mentor	test_mentor	\N	0108	5
135	\N	33	ភេង យូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:57:24.594	2025-10-09 03:57:24.596	2025-10-09 04:06:48.615	mentor	test_mentor	\N	0107	5
151	\N	29	ធួន ចរិយា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:41:40.636	2025-10-09 14:41:40.637	2025-10-15 03:11:21.14	mentor	test_mentor	\N	0003	4
134	\N	33	លី រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:55:57.452	2025-10-09 03:55:57.453	2025-10-09 04:09:19.251	mentor	test_mentor	\N	0106	5
133	\N	33	អ៉ឹម រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:55:27.428	2025-10-09 03:55:27.43	2025-10-09 04:11:10.066	mentor	test_mentor	\N	0105	5
132	\N	33	សេង លីឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:54:47.083	2025-10-09 03:54:47.084	2025-10-09 04:12:10.01	mentor	test_mentor	\N	0104	5
131	\N	33	ឌី យូម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:54:15.73	2025-10-09 03:54:15.731	2025-10-09 04:12:57.793	mentor	test_mentor	\N	0103	4
130	\N	33	ហៀង ដាវិន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:53:41.346	2025-10-09 03:53:41.347	2025-10-09 04:13:59.675	mentor	test_mentor	\N	0102	4
129	\N	33	លី សក្កា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:53:07.616	2025-10-09 03:53:07.617	2025-10-09 04:14:54.801	mentor	test_mentor	\N	0101	4
128	\N	33	ស៊ីណាត អេលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:50:52.368	2025-10-09 03:50:52.37	2025-10-09 04:19:08.786	mentor	test_mentor	\N	0100	4
137	\N	33	អ៊ាង រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	subtraction	\N	\N	\N	\N	t	t	97	t	t	2025-10-09 03:58:36.299	2025-10-09 03:58:36.3	2025-10-09 04:29:42.614	mentor	test_mentor	\N	0109	5
152	\N	29	ម៉ាប់ លីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:42:34.088	2025-10-09 14:42:34.089	2025-10-15 03:16:48.17	mentor	test_mentor	\N	0004	4
154	\N	29	ហៀង សុវណ្ណរាជ្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:44:00.624	2025-10-09 14:44:00.625	2025-10-15 03:18:28.25	mentor	test_mentor	\N	0006	4
155	\N	29	ធៀប ប៊ុនស្រីនិច្ច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:44:45.369	2025-10-09 14:44:45.37	2025-10-15 03:19:26.804	mentor	test_mentor	\N	0007	4
125	\N	28	ណោ ស្រីនីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	story	\N	t	t	19	t	t	2025-10-09 03:00:05.921	2025-10-09 03:00:05.922	2025-10-09 08:57:22.634	mentor	test_mentor	\N	00053	5
124	\N	28	ហួត លីហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	story	\N	t	t	19	t	t	2025-10-09 02:58:57.28	2025-10-09 02:58:57.281	2025-10-09 09:00:52.533	mentor	test_mentor	\N	00052	5
144	\N	1	ហឺយ ជាដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	story	\N	t	t	100	t	t	2025-10-09 04:55:04.579	2025-10-09 04:55:04.58	2025-10-17 01:09:26.743	mentor	test_mentor	\N	9	4
156	\N	29	ភា ស៊ីងហួង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:45:43.584	2025-10-09 14:45:43.585	2025-10-15 03:27:23.466	mentor	test_mentor	\N	0008	4
157	\N	29	ឈាវ ស្រីលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:46:20.506	2025-10-09 14:46:20.507	2025-10-15 03:28:28.035	mentor	test_mentor	\N	0009	4
158	\N	29	ស៊ុន សុខវួចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:47:41.905	2025-10-09 14:47:41.906	2025-10-15 03:29:24.695	mentor	test_mentor	\N	០០០១០	5
159	\N	29	សុខនី ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:49:54.491	2025-10-09 14:49:54.494	2025-10-15 03:30:08.173	mentor	test_mentor	\N	00011	5
143	\N	1	លី សុភារិទ្ធិ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	comprehension1	\N	t	t	100	t	t	2025-10-09 04:54:28.228	2025-10-09 04:54:28.229	2025-10-17 01:05:46.849	mentor	test_mentor	\N	8	4
139	\N	1	ភិន សៃណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-09 04:52:24.263	2025-10-09 04:52:24.264	2025-10-10 08:57:44.567	mentor	test_mentor	\N	4	4
140	\N	1	វុន ស៊ីង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-09 04:53:04.336	2025-10-09 04:53:04.337	2025-10-10 08:58:14.132	mentor	test_mentor	\N	5	4
141	\N	1	លាង លក្ខិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-09 04:53:27.606	2025-10-09 04:53:27.607	2025-10-10 08:58:52.306	mentor	test_mentor	\N	6	4
142	\N	1	ភើយ ម៉ីលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-09 04:53:55.272	2025-10-09 04:53:55.273	2025-10-10 08:59:51.024	mentor	test_mentor	\N	7	4
148	\N	1	តាក់ វិន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-09 05:05:52.509	2025-10-09 05:05:52.51	2025-10-10 09:12:22.699	mentor	test_mentor	\N	2	4
160	\N	29	អ៉ិន ហ្គេកលិវ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:51:00.264	2025-10-09 14:51:00.265	2025-10-15 03:31:28.155	mentor	test_mentor	\N	00012	5
150	\N	29	អ៊ុនសៀវ ឡាយឃ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	t	9	t	t	2025-10-09 14:40:55.131	2025-10-09 14:40:55.132	2025-10-10 13:35:55.183	mentor	test_mentor	\N	0002	4
161	\N	29	សេង ហួលីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:52:19.174	2025-10-09 14:52:19.175	2025-10-15 03:32:39.929	mentor	test_mentor	\N	00013	5
138	\N	1	សំណាង ណារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	comprehension2	\N	t	t	100	t	t	2025-10-09 04:51:30.773	2025-10-09 04:51:30.775	2025-10-17 00:53:19.041	mentor	test_mentor	\N	3	4
194	\N	1	លឹម វ៉ាន់សក្ដិ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:19:33.103	2025-10-10 09:19:33.104	2025-10-14 06:41:29.487	mentor	test_mentor	\N	21	5
195	\N	1	សយ សុម៉ានីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:19:59.847	2025-10-10 09:19:59.848	2025-10-14 06:42:47.447	mentor	test_mentor	\N	22	5
196	\N	1	វីរៈ ឫទ្ធីរាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:20:25.315	2025-10-10 09:20:25.316	2025-10-14 06:43:22.645	mentor	test_mentor	\N	23	5
197	\N	1	ឡាយ សុវណ្ណឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:20:55.173	2025-10-10 09:20:55.174	2025-10-14 06:43:56.335	mentor	test_mentor	\N	24	5
198	\N	1	ហៀង ថៃសុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:21:21.522	2025-10-10 09:21:21.523	2025-10-14 06:44:46.997	mentor	test_mentor	\N	25	5
199	\N	1	ចាន់ សូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:21:45.424	2025-10-10 09:21:45.425	2025-10-14 06:45:20.455	mentor	test_mentor	\N	26	5
183	\N	1	ខុម សុភីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	comprehension1	\N	t	t	100	t	t	2025-10-10 08:42:50.559	2025-10-10 08:42:50.562	2025-10-17 01:00:26.727	mentor	test_mentor	\N	10 	4
182	\N	37	អេង យីងអាយ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	comprehension1	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 02:36:38.598	2025-10-10 02:36:38.599	2025-10-10 02:38:53.761	mentor	test_mentor	\N	3526	5
178	\N	37	គី ម៉េងស៊ាង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	comprehension1	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 01:44:06.947	2025-10-10 01:44:06.948	2025-10-10 01:51:52.55	mentor	test_mentor	\N	3669	5
123	\N	28	សយ សេងហ៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	comprehension1	\N	t	t	19	t	t	2025-10-09 02:58:03.651	2025-10-09 02:58:03.652	2025-10-10 08:26:57.243	mentor	test_mentor	\N	00051	5
177	\N	37	ពុធ សុវណ្ណាភូមិ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	comprehension1	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 01:43:28.931	2025-10-10 01:43:28.932	2025-10-10 01:56:56.639	mentor	test_mentor	\N	3598	5
176	\N	37	វុធ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension1	\N	t	t	10	t	t	2025-10-10 01:42:59.547	2025-10-10 01:42:59.548	2025-10-10 02:01:33.936	mentor	test_mentor	\N	3492	4
175	\N	37	ឆុន លីអុីង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension1	\N	t	t	10	t	t	2025-10-10 01:42:27.825	2025-10-10 01:42:27.826	2025-10-10 02:04:34.13	mentor	test_mentor	\N	3107	4
174	\N	37	ហេង ម៉ីលីង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 01:41:53.44	2025-10-10 01:41:53.442	2025-10-10 02:07:04.691	mentor	test_mentor	\N	3010	4
173	\N	37	រុំ សុខរឿន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension1	\N	t	t	10	t	t	2025-10-10 01:41:28.106	2025-10-10 01:41:28.107	2025-10-10 02:17:06.965	mentor	test_mentor	\N	2317	4
192	\N	1	លី សៀវហ្គិច	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:47:56.89	2025-10-10 08:47:56.891	2025-10-10 08:56:27.866	mentor	test_mentor	\N	19	4
172	\N	37	ហួត លីហូវ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	comprehension2	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 01:41:04.406	2025-10-10 01:41:04.407	2025-10-10 02:20:27.942	mentor	test_mentor	\N	2436	4
187	\N	1	ខុម សុផា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	story	\N	t	t	100	t	t	2025-10-10 08:45:15.525	2025-10-10 08:45:15.526	2025-10-17 01:02:14.253	mentor	test_mentor	\N	14	4
184	\N	1	អៀវ នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:43:19.066	2025-10-10 08:43:19.067	2025-10-10 09:01:11.312	mentor	test_mentor	\N	11	4
171	\N	37	វ៉ាន់ សុបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	comprehension2	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 01:40:37.752	2025-10-10 01:40:37.753	2025-10-10 02:22:21.59	mentor	test_mentor	\N	2415	4
185	\N	1	គី សុរ៉ូហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:43:46.909	2025-10-10 08:43:46.91	2025-10-10 09:02:04.236	mentor	test_mentor	\N	12	4
186	\N	1	រដ្ឋា ពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:44:48.961	2025-10-10 08:44:48.962	2025-10-10 09:02:38.816	mentor	test_mentor	\N	13	4
181	\N	37	ភន គឹមឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	comprehension1	\N	comprehension2	\N	t	t	10	t	t	2025-10-10 02:24:12.798	2025-10-10 02:24:12.799	2025-10-10 02:26:01.419	mentor	test_mentor	\N	2437	4
188	\N	1	ណាក់ សៀវអ៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:45:43.443	2025-10-10 08:45:43.444	2025-10-10 09:03:51.697	mentor	test_mentor	\N	15	4
189	\N	1	ណុយ សុខេន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:46:09.966	2025-10-10 08:46:09.967	2025-10-10 09:04:19.426	mentor	test_mentor	\N	16	4
190	\N	1	វ៉ិន ចាន់រ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:46:44.528	2025-10-10 08:46:44.53	2025-10-10 09:04:51.292	mentor	test_mentor	\N	17	4
191	\N	1	ណាង សៀវម៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 08:47:12.732	2025-10-10 08:47:12.734	2025-10-10 09:05:25.388	mentor	test_mentor	\N	18	4
1	\N	1	ចាន់ រង្សី	12	ប្រុស	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	25	t	t	2025-10-02 03:33:27.62	2025-10-02 03:33:27.621	2025-10-10 09:09:55.272	mentor	test_mentor	\N	1	4
202	\N	1	ហឿប ចន្ទប្រថ្នា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	100	t	f	2025-10-10 09:23:49.246	2025-10-10 09:23:49.249	2025-10-10 09:23:49.249	mentor	test_mentor	\N	27	5
215	\N	40	ចិន ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:02:50.363	2025-10-10 10:02:50.364	2025-10-10 10:56:38.707	mentor	test_mentor	\N	165	4
204	\N	40	ហ៊ី ឈីងអ៊ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 09:49:28.824	2025-10-10 09:49:28.825	2025-10-10 10:55:02.625	mentor	test_mentor	\N	238	4
217	\N	40	ដែន ហេងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:05:47.977	2025-10-10 10:05:47.979	2025-10-10 10:58:24.625	mentor	test_mentor	\N	176	4
218	\N	40	យី ហ្គេកហ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:11:27.431	2025-10-10 10:11:27.432	2025-10-10 10:59:30.842	mentor	test_mentor	\N	217	4
219	\N	40	ចិត្រា ឧស្សាហ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:12:22.731	2025-10-10 10:12:22.732	2025-10-10 11:00:39.404	mentor	test_mentor	\N	163	4
220	\N	40	ហេង ជូកាំងធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:13:29.67	2025-10-10 10:13:29.672	2025-10-10 11:01:38.787	mentor	test_mentor	\N	236	4
221	\N	40	វឹង ហុងសៀងលី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:14:24.626	2025-10-10 10:14:24.627	2025-10-10 11:02:42.593	mentor	test_mentor	\N	220	4
222	\N	40	សុភ័ក្រ ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:15:12.792	2025-10-10 10:15:12.793	2025-10-10 11:03:38.523	mentor	test_mentor	\N	228	4
223	\N	40	វិបុល វីរៈបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:16:07.037	2025-10-10 10:16:07.038	2025-10-10 11:04:25.071	mentor	test_mentor	\N	223	4
225	\N	40	ហ៊ី ឈីងអ៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:21:25.174	2025-10-10 10:21:25.175	2025-10-10 11:05:19.448	mentor	test_mentor	\N	239	5
226	\N	40	គាំ លក្ខិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:22:21.612	2025-10-10 10:22:21.613	2025-10-10 11:06:08.736	mentor	test_mentor	\N	215	5
227	\N	40	ដានូ គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:23:09.111	2025-10-10 10:23:09.112	2025-10-10 11:06:54.886	mentor	test_mentor	\N	222	5
229	\N	40	ឃាង មួយលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:24:38.656	2025-10-10 10:24:38.657	2025-10-10 11:07:36.995	mentor	test_mentor	\N	218	5
230	\N	40	ថុន ចាន់ខេមរិន	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:26:09.406	2025-10-10 10:26:09.407	2025-10-10 11:08:35.881	mentor	test_mentor	\N	224	5
231	\N	40	ផុន រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:26:58.53	2025-10-10 10:26:58.531	2025-10-10 11:09:17.015	mentor	test_mentor	\N	229	5
232	\N	40	ឈ៉ីវ សៀវឈី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:28:15.953	2025-10-10 10:28:15.954	2025-10-10 11:09:59.884	mentor	test_mentor	\N	241	5
234	\N	40	អៀង លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:29:33.644	2025-10-10 10:29:33.645	2025-10-10 11:10:43.818	mentor	test_mentor	\N	234	5
235	\N	40	គីម មួយលី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:30:19.457	2025-10-10 10:30:19.458	2025-10-10 11:11:21.427	mentor	test_mentor	\N	216	5
203	\N	40	ភាព សៀងបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 09:47:40.999	2025-10-10 09:47:41.001	2025-10-10 10:53:02.816	mentor	test_mentor	\N	212	4
236	\N	40	វី ដារី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	t	16	t	t	2025-10-10 10:31:23.997	2025-10-10 10:31:23.998	2025-10-10 11:11:58.895	mentor	test_mentor	\N	233	5
277	\N	34	ចាន់ រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	paragraph	\N	story	\N	t	t	103	t	t	2025-10-11 12:24:07.731	2025-10-11 12:24:07.732	2025-10-14 11:31:45.42	mentor	test_mentor	\N	000009	4
276	\N	34	រីម រតនាដាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	story	\N	comprehension1	\N	t	t	103	t	t	2025-10-11 12:21:58.43	2025-10-11 12:21:58.431	2025-10-14 11:34:18.527	mentor	test_mentor	\N	000008	4
275	\N	34	ហាន ប៊ុនណា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	comprehension2	\N	comprehension2	\N	t	t	103	t	t	2025-10-11 12:20:31.963	2025-10-11 12:20:31.965	2025-10-14 11:35:21.348	mentor	test_mentor	\N	000007	4
274	\N	34	ហឿន  សុខរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	story	\N	comprehension1	\N	t	t	103	t	t	2025-10-11 12:19:47.924	2025-10-11 12:19:47.926	2025-10-14 11:36:32.021	mentor	test_mentor	\N	000006	4
273	\N	34	ហាន សុខដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	story	\N	comprehension1	\N	t	t	103	t	t	2025-10-11 12:18:54.686	2025-10-11 12:18:54.687	2025-10-14 11:40:32.063	mentor	test_mentor	\N	000005	4
272	\N	34	យ៉យ  សុវឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	paragraph	\N	story	\N	t	t	103	t	t	2025-10-11 12:18:03.339	2025-10-11 12:18:03.34	2025-10-14 11:42:41.586	mentor	test_mentor	\N	000004	4
271	\N	34	ហុក ឈាងហួត	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension2	\N	t	t	103	t	t	2025-10-11 12:16:59.904	2025-10-11 12:16:59.905	2025-10-14 11:44:04.75	mentor	test_mentor	\N	000003	4
270	\N	34	ស៊ីម៉ា រីសារ៉ានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	comprehension1	\N	comprehension2	\N	t	t	103	t	t	2025-10-11 12:03:57.707	2025-10-11 12:03:57.709	2025-10-14 11:45:06.279	mentor	test_mentor	\N	000002	4
269	\N	34	ចែម សុនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	comprehension2	\N	comprehension2	\N	t	t	103	t	t	2025-10-11 12:01:57.289	2025-10-11 12:01:57.29	2025-10-14 11:45:46.445	mentor	test_mentor	\N	000001	4
153	\N	29	ម៉ាប់ ឡា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	9	t	t	2025-10-09 14:43:14.142	2025-10-09 14:43:14.143	2025-10-15 03:17:31.521	mentor	test_mentor	\N	0005	4
97	\N	8	ណាង វណ្ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	14	t	t	2025-10-08 13:16:00.272	2025-10-08 13:16:00.274	2025-10-13 01:29:50.466	mentor	test_mentor	\N	0021	5
94	\N	8	ចក់ ហេងសុផាឡែន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	14	t	t	2025-10-08 13:14:15.808	2025-10-08 13:14:15.809	2025-10-13 01:35:31.174	mentor	test_mentor	\N	0018	4
305	\N	1	សេង គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	subtraction	t	t	101	t	t	2025-10-13 13:56:49.757	2025-10-13 13:56:49.758	2025-10-17 00:34:39.596	mentor	test_mentor	\N	000018	4
297	\N	1	ហ៊ុន វឌ្ឍនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	word_problems	t	t	101	t	t	2025-10-13 13:51:56.683	2025-10-13 13:51:56.684	2025-10-17 00:36:34.902	mentor	test_mentor	\N	000017	4
293	\N	1	ទិត ហ៊ុយមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	101	t	t	2025-10-13 13:44:41.971	2025-10-13 13:44:41.972	2025-10-17 01:39:23.755	mentor	test_mentor	\N	000013	5
312	\N	1	សុខម រ៉ៃយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	comprehension2	\N	t	t	100	t	t	2025-10-14 06:16:54.212	2025-10-14 06:16:54.213	2025-10-17 00:38:45.605	mentor	test_mentor	\N	30	5
292	\N	1	រ៉ាន់ រឹទ្ធិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	101	t	t	2025-10-13 13:43:52.665	2025-10-13 13:43:52.666	2025-10-13 14:53:32.625	mentor	test_mentor	\N	000012	4
291	\N	1	សីហា លីនណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	101	t	t	2025-10-13 13:35:02.949	2025-10-13 13:35:02.951	2025-10-13 14:56:55.012	mentor	test_mentor	\N	000011	5
307	\N	1	ឯក ប្រុសពេញ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	word_problems	t	t	101	t	t	2025-10-13 15:01:51.255	2025-10-13 15:01:51.257	2025-10-17 00:28:15.98	mentor	test_mentor	\N	000021	5
306	\N	1	វុន សីហាបញ្ញារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	division	t	t	101	t	t	2025-10-13 14:07:42.459	2025-10-13 14:07:42.46	2025-10-17 00:31:54.124	mentor	test_mentor	\N	000020	4
308	\N	1	ទូច ជីងអាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	division	t	t	101	t	t	2025-10-13 15:03:22.711	2025-10-13 15:03:22.712	2025-10-17 00:25:37.909	mentor	test_mentor	\N	000022	4
311	\N	1	ធិន សុវណ្ណរាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:16:15.017	2025-10-14 06:16:15.019	2025-10-14 06:47:44.71	mentor	test_mentor	\N	29	5
278	\N	34	ហេង ស្រីល័ក្ខ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	story	\N	story	\N	t	t	103	t	t	2025-10-11 12:25:00.453	2025-10-11 12:25:00.454	2025-10-14 11:30:37.978	mentor	test_mentor	\N	000010	4
245	\N	41	លី តៃឡឹង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	division	\N	division	t	t	17	t	t	2025-10-11 03:30:11.598	2025-10-11 03:30:11.601	2025-10-14 09:06:55.624	mentor	test_mentor	\N	021	5
239	\N	41	ឡាន សិនលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 02:59:40.661	2025-10-11 02:59:40.662	2025-10-14 09:01:31.515	mentor	test_mentor	\N	032	4
162	\N	29	យ៉ា​ន ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	word_problems	t	t	9	t	t	2025-10-09 14:53:31.95	2025-10-09 14:53:31.951	2025-10-15 03:33:17.086	mentor	test_mentor	\N	00014	5
241	\N	41	ម៉ៅ តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	division	\N	word_problems	t	t	17	t	t	2025-10-11 03:25:22.901	2025-10-11 03:25:22.903	2025-10-14 09:04:41.162	mentor	test_mentor	\N	017	4
250	\N	41	ហម ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 03:33:42.952	2025-10-11 03:33:42.953	2025-10-14 09:08:51.141	mentor	test_mentor	\N	036	5
258	\N	41	កេន កយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 03:40:26.478	2025-10-11 03:40:26.481	2025-10-14 09:08:00.878	mentor	test_mentor	\N	041	5
237	\N	41	បូរ៉ា ឆៃយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	word_problems	t	t	17	t	t	2025-10-11 02:57:56.962	2025-10-11 02:57:56.963	2025-10-14 08:59:33.353	mentor	test_mentor	\N	\N	4
238	\N	41	រុណ សុផល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 02:58:00.539	2025-10-11 02:58:00.54	2025-10-14 09:03:22.93	mentor	test_mentor	\N	023	4
249	\N	41	រស់ ផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 03:32:47.936	2025-10-11 03:32:47.937	2025-10-14 09:09:53.925	mentor	test_mentor	\N	022	5
313	\N	1	ពៅ ច័ន្ទមេសា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:17:28.393	2025-10-14 06:17:28.396	2025-10-15 12:32:42.026	mentor	test_mentor	\N	31	5
318	\N	1	វុធ សុខដារ៉ាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:20:32.016	2025-10-14 06:20:32.017	2025-10-15 12:34:54.626	mentor	test_mentor	\N	34	5
319	\N	1	ធឿន ប៊ុនថេន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:21:04.052	2025-10-14 06:21:04.053	2025-10-15 12:35:38.01	mentor	test_mentor	\N	35	5
321	\N	1	ថាច់ ម៉ីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:21:58.619	2025-10-14 06:21:58.62	2025-10-15 12:37:00.959	mentor	test_mentor	\N	37	5
322	\N	1	ម៉ាន់ ច័ន្ទសច្ចៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:22:33.558	2025-10-14 06:22:33.559	2025-10-15 12:37:34.045	mentor	test_mentor	\N	38	5
326	\N	1	លៀប លីណាវឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:24:56.037	2025-10-14 06:24:56.038	2025-10-15 12:49:35.141	mentor	test_mentor	\N	42	5
325	\N	1	ថុល ​លាបហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:24:17.567	2025-10-14 06:24:17.569	2025-10-15 12:50:06.415	mentor	test_mentor	\N	41	5
296	\N	1	ម៉ៃ រ៉ាចន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	101	t	t	2025-10-13 13:49:03.982	2025-10-13 13:49:03.983	2025-10-17 00:38:58.816	mentor	test_mentor	\N	000016	4
320	\N	1	សាគុណ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:21:34.162	2025-10-14 06:21:34.164	2025-10-15 12:54:25.788	mentor	test_mentor	\N	36	5
323	\N	1	ផា សុខរក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:22:58.861	2025-10-14 06:22:58.862	2025-10-15 12:55:30.902	mentor	test_mentor	\N	39	5
309	\N	1	សុវណ្ណ វីរៈឧត្តម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	word_problems	t	t	101	t	t	2025-10-13 15:15:31.958	2025-10-13 15:15:31.959	2025-10-17 00:20:08.216	mentor	test_mentor	\N	000023	5
193	\N	1	វន សុវត្ថិឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-10 09:19:01.968	2025-10-10 09:19:01.969	2025-10-14 06:37:59.195	mentor	test_mentor	\N	20 	5
310	\N	1	ផាន ជូវ័យ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:15:40.196	2025-10-14 06:15:40.199	2025-10-14 06:45:47.974	mentor	test_mentor	\N	28	5
346	\N	1	កុឡាប សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:34:46.28	2025-10-14 06:34:46.281	2025-10-15 12:38:34.799	mentor	test_mentor	\N	60	5
345	\N	1	រ៉ុត រ៉ានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:34:21.489	2025-10-14 06:34:21.49	2025-10-15 12:39:35.286	mentor	test_mentor	\N	59	5
344	\N	1	ទ្រីរតនា វិភព	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:33:54.21	2025-10-14 06:33:54.211	2025-10-15 12:40:21.552	mentor	test_mentor	\N	58	5
343	\N	1	ណាង ស្រីណុច	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:33:10.496	2025-10-14 06:33:10.497	2025-10-15 12:40:58.009	mentor	test_mentor	\N	57	5
342	\N	1	តាំង វណ្ណថេប	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:32:48.71	2025-10-14 06:32:48.711	2025-10-15 12:41:26.991	mentor	test_mentor	\N	56	5
341	\N	1	លៀប ដាយុត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:32:15.8	2025-10-14 06:32:15.801	2025-10-15 12:42:04.047	mentor	test_mentor	\N	55	5
340	\N	1	យ៉ា សៀវហ្គិច	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:31:43.866	2025-10-14 06:31:43.867	2025-10-15 12:42:49.849	mentor	test_mentor	\N	54	5
338	\N	1	មិន វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:30:47.793	2025-10-14 06:30:47.794	2025-10-15 12:44:26.781	mentor	test_mentor	\N	52	5
337	\N	1	ប៊ុនរ៉ុង ចាន់ម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:30:23.606	2025-10-14 06:30:23.61	2025-10-15 12:45:04.86	mentor	test_mentor	\N	50 	5
334	\N	1	នី រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:28:45.371	2025-10-14 06:28:45.372	2025-10-15 12:45:38.088	mentor	test_mentor	\N	51	5
333	\N	1	ខៀវ ផេនអាន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:28:18.944	2025-10-14 06:28:18.945	2025-10-15 12:46:01.783	mentor	test_mentor	\N	49	5
331	\N	1	ម៉េត ដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:27:24.676	2025-10-14 06:27:24.677	2025-10-15 12:47:10.81	mentor	test_mentor	\N	47	5
329	\N	1	ណន សូលី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:26:27.351	2025-10-14 06:26:27.352	2025-10-15 12:48:08.371	mentor	test_mentor	\N	45	5
328	\N	1	ផាន ណាត់ឋៈយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:25:54.968	2025-10-14 06:25:54.969	2025-10-15 12:48:41.039	mentor	test_mentor	\N	44	5
405	\N	25	ស៊ាកលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:30:50.301	2025-11-01 07:31:53.657	teacher	production	\N	11115	4
327	\N	1	ហូរ យៀកលិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:25:27.6	2025-10-14 06:25:27.601	2025-10-15 12:49:04.526	mentor	test_mentor	\N	43	5
330	\N	1	រួម ចន្ទដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	t	t	100	t	t	2025-10-14 06:27:00.4	2025-10-14 06:27:00.401	2025-10-17 00:23:50.884	mentor	test_mentor	\N	46	5
332	\N	1	ហួន សភា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	comprehension2	\N	t	t	100	t	t	2025-10-14 06:27:47.767	2025-10-14 06:27:47.769	2025-10-17 00:29:15.132	mentor	test_mentor	\N	48	5
339	\N	1	រិទ្ធ ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	comprehension1	\N	t	t	100	t	t	2025-10-14 06:31:15.437	2025-10-14 06:31:15.438	2025-10-17 00:33:17.201	mentor	test_mentor	\N	53	5
360	\N	44	ឡុង សុខឃីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:34:29.192	2025-10-14 07:34:29.193	2025-10-14 07:36:19.145	mentor	test_mentor	\N	072	4
359	\N	44	ហាំ ម៉េងហ៊ុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:33:47.459	2025-10-14 07:33:47.46	2025-10-14 07:37:13.198	mentor	test_mentor	\N	069	5
358	\N	44	ហាន នីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:32:43.863	2025-10-14 07:32:43.864	2025-10-14 07:38:13.219	mentor	test_mentor	\N	067	5
356	\N	44	វ៉ាន់ ណារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:31:55.604	2025-10-14 07:31:55.605	2025-10-14 07:40:04.935	mentor	test_mentor	\N	064	5
354	\N	44	សំណាង ម៉េងអ៊ុី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:30:08.5	2025-10-14 07:30:08.501	2025-10-14 07:40:51.081	mentor	test_mentor	\N	060	5
353	\N	44	តុលា ស្រីមុំ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:28:49.421	2025-10-14 07:28:49.422	2025-10-14 07:41:31.751	mentor	test_mentor	\N	059	4
352	\N	44	ភី ចាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:27:57.899	2025-10-14 07:27:57.901	2025-10-14 07:42:40.033	mentor	test_mentor	\N	052	4
351	\N	44	នន់ ចាន់ទី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	t	6	t	t	2025-10-14 07:27:16.686	2025-10-14 07:27:16.687	2025-10-14 07:43:27.223	mentor	test_mentor	\N	047	5
362	\N	3	ទុំ ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 07:52:50.946	2025-10-14 07:52:50.947	2025-10-14 07:52:50.947	mentor	test_mentor	\N	245	4
363	\N	3	ណេត ថាណាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 07:53:36.836	2025-10-14 07:53:36.837	2025-10-14 07:53:36.837	mentor	test_mentor	\N	250	4
364	\N	3	យុន រ៉ាវង្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 07:54:15.749	2025-10-14 07:54:15.75	2025-10-14 07:54:15.75	mentor	test_mentor	\N	263	4
365	\N	3	ទុំ សេរីរតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 07:54:47.35	2025-10-14 07:54:47.351	2025-10-14 07:54:47.351	mentor	test_mentor	\N	267	4
366	\N	3	ប៉ុន គឹមអេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 07:55:32.096	2025-10-14 07:55:32.097	2025-10-14 07:55:32.097	mentor	test_mentor	\N	271	4
367	\N	3	ភាង ភក្តី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 08:01:35.047	2025-10-14 08:01:35.048	2025-10-14 08:01:35.048	mentor	test_mentor	\N	280	5
368	\N	3	ក្រាល បូរិន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 08:02:09.408	2025-10-14 08:02:09.409	2025-10-14 08:02:09.409	mentor	test_mentor	\N	289	5
369	\N	3	គឹម ដាណុល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 08:02:47.454	2025-10-14 08:02:47.455	2025-10-14 08:03:10.871	mentor	test_mentor	\N	288	5
370	\N	3	ឃីល ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 08:03:53.477	2025-10-14 08:03:53.479	2025-10-14 08:04:12.673	mentor	test_mentor	\N	290	5
371	\N	3	លុយ ម៉េងស៊ីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	12	t	f	2025-10-14 08:04:46.215	2025-10-14 08:04:46.216	2025-10-14 08:04:46.216	mentor	test_mentor	\N	291	5
255	\N	41	ប៊ុត វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	division	t	t	17	t	t	2025-10-11 03:37:31.278	2025-10-11 03:37:31.28	2025-10-14 09:02:18.706	mentor	test_mentor	\N	011	4
253	\N	41	មឿន សុខបាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	subtraction	\N	word_problems	t	t	17	t	t	2025-10-11 03:35:47.201	2025-10-11 03:35:47.202	2025-10-14 09:11:09.353	mentor	test_mentor	\N	020	5
149	\N	29	សុខនី ស្រីល័ក្ខ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	subtraction	\N	division	t	t	9	t	t	2025-10-09 14:38:58.098	2025-10-09 14:38:58.101	2025-10-15 03:12:53.605	mentor	test_mentor	\N	0001	4
317	\N	1	សួស ហុងម៉ីង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:19:41.503	2025-10-14 06:19:41.504	2025-10-15 12:34:24.749	mentor	test_mentor	\N	33 	5
324	\N	1	ហ៊ីម ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	t	100	t	t	2025-10-14 06:23:40.973	2025-10-14 06:23:40.974	2025-10-15 12:54:57.029	mentor	test_mentor	\N	40	5
294	\N	1	សំប្បូរ ម៉ីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	101	t	t	2025-10-13 13:47:08.554	2025-10-13 13:47:08.555	2025-10-17 01:31:27.308	mentor	test_mentor	\N	000014	5
379	\N	39	គឹម ដាណុល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	division	t	t	12	t	t	2025-10-17 02:00:07.42	2025-10-17 02:00:07.421	2025-10-17 02:31:49.956	mentor	test_mentor	\N	0231	5
378	\N	39	ក្រាល បូរិន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:59:40.474	2025-10-17 01:59:40.475	2025-10-17 02:32:51.472	mentor	test_mentor	\N	0991	5
377	\N	39	ភាង ភក្តី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:59:15.83	2025-10-17 01:59:15.832	2025-10-17 02:33:38.782	mentor	test_mentor	\N	0845	5
375	\N	39	ទុំ សេរីរតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:57:59.668	2025-10-17 01:57:59.669	2025-10-18 04:45:06.414	mentor	test_mentor	\N	0452	4
372	\N	39	ទុំ ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:56:33.162	2025-10-17 01:56:33.164	2025-10-17 02:23:25.194	mentor	test_mentor	\N	0641	4
373	\N	39	ណេត ថាណាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:57:03.938	2025-10-17 01:57:03.94	2025-10-17 02:24:51.846	mentor	test_mentor	\N	0898	4
374	\N	39	យុន រ៉ាវង្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 01:57:30.522	2025-10-17 01:57:30.523	2025-10-17 02:25:41.296	mentor	test_mentor	\N	0976	4
376	\N	39	ប៊ុន គឹមអេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	number_2digit	t	t	12	t	t	2025-10-17 01:58:23.38	2025-10-17 01:58:23.382	2025-10-17 02:27:07.227	mentor	test_mentor	\N	0568	4
381	\N	39	លុយ ម៉េងស៊ីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	word_problems	t	t	12	t	t	2025-10-17 02:00:59.071	2025-10-17 02:00:59.073	2025-10-17 02:29:50.794	mentor	test_mentor	\N	0873	5
380	\N	39	ឃីល ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	number_2digit	t	t	12	t	t	2025-10-17 02:00:32.634	2025-10-17 02:00:32.635	2025-10-17 02:30:36.306	mentor	test_mentor	\N	0129	5
383	\N	23	 វង់​ស៊ីវម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	15	t	f	2025-10-18 08:12:27.503	2025-10-18 08:12:27.504	2025-10-18 08:12:27.504	mentor	test_mentor	\N	0097	4
387	\N	23	រស់​ ភក្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	t	15	t	f	2025-10-18 08:14:07.29	2025-10-18 08:14:07.291	2025-10-18 08:14:07.291	mentor	test_mentor	\N	09876	4
393	\N	25	សៅ សុក្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-10-31 03:27:36.68	2025-10-31 03:27:36.68	teacher	production	\N	3256	4
392	\N	6	sovath-sovath	\N	male	\N	\N	\N	\N	\N	\N	\N	word	number_2digit	\N	\N	\N	\N	t	f	7	t	t	2025-10-30 10:47:33.879	2025-10-30 10:47:33.88	2025-10-31 09:35:35.537	mentor	production	\N	999999	4
399	\N	25	លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	paragraph	\N	comprehension1	\N	t	f	69	f	f	\N	2025-11-01 06:49:29.097	2025-11-01 06:59:20.423	teacher	production	\N	11112	4
398	\N	25	វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 06:48:50.438	2025-11-01 06:53:17.942	teacher	production	\N	11111	4
400	\N	25	ប្រិល រ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:25:41.6	2025-11-01 07:30:24.392	teacher	production	\N	11113	4
406	\N	21	កហថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	66	f	f	\N	2025-11-01 07:31:02.588	2025-11-01 07:31:14.122	teacher	archived	\N	97646	4
404	\N	24	នូ ធីពេញ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-01 07:29:03.653	2025-11-01 07:32:00.981	teacher	production	\N	 20222	4
403	\N	24	ប៉ូ សុខខេង	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-01 07:28:11.457	2025-11-01 07:37:40.231	teacher	production	\N	32109	4
26	\N	23	ស្រេង ករុណា	11	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	word_problems	f	f	98	f	t	\N	2025-10-05 07:51:23.996	2025-11-12 01:55:06.101	teacher	archived	\N	0987	4
21	\N	23	ជិន គឹមហុង	10	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:49:19.448	2025-11-12 01:55:32.496	teacher	archived	\N	\N	\N
407	\N	21	កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	story	\N	comprehension2	\N	f	f	66	f	f	\N	2025-11-01 07:31:39.149	2025-11-12 02:31:30.981	teacher	archived	\N	44738	4
409	\N	25	រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:35:40.541	2025-11-01 07:37:14.09	teacher	production	\N	11116	4
416	\N	45	សុខនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	73	f	f	\N	2025-11-01 07:38:58.48	2025-11-01 07:38:58.48	teacher	production	\N	25001	4
408	\N	26	សែន ផាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-01 07:34:54.437	2025-11-01 07:39:14.562	teacher	production	\N	12345	5
419	\N	26	ថា សុធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-01 07:39:20.986	2025-11-01 07:39:20.986	teacher	production	\N	11222	4
422	\N	20	ហៅ ដានីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-01 07:39:50.384	2025-11-01 07:39:50.384	teacher	production	\N	#2222	5
425	\N	40	នេត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-01 07:40:21.557	2025-11-01 07:40:21.557	teacher	production	\N	44456	5
428	\N	26	វី សាវ៉ាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-01 07:41:05.002	2025-11-01 07:41:05.002	teacher	production	\N	22211	4
429	\N	20	ហៅ ដានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-01 07:41:23.924	2025-11-01 07:41:23.924	teacher	production	\N	#1111	5
432	\N	19	និម ប៊ុនឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	65	f	f	\N	2025-11-01 07:42:20.113	2025-11-14 07:39:16.212	teacher	archived	\N	កែម លីហ្សា	4
430	\N	40	កែវតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-01 07:41:43.213	2025-11-01 07:41:43.213	teacher	production	\N	54673	4
431	\N	26	ពៅ ថារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-01 07:42:01.221	2025-11-01 07:42:01.221	teacher	production	\N	23456	5
433	\N	45	ចាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	73	f	f	\N	2025-11-01 07:42:23.636	2025-11-01 07:42:23.636	teacher	production	\N	25002	4
434	\N	22	ហងយក	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	77	f	f	\N	2025-11-01 08:01:06.314	2025-11-01 08:01:18.578	teacher	archived	\N	55578	4
435	\N	22	ធី ថាឈីក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	77	f	f	\N	2025-11-01 08:02:55.445	2025-11-01 08:03:12.661	teacher	archived	\N	០០០០១	4
437	\N	4	Sovath Test	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	t	4	t	t	2025-11-08 15:43:34.771	2025-11-08 15:43:34.773	2025-11-08 15:45:06.064	mentor	test_mentor	\N	0123123	4
18	\N	23	សួន សុវណ្ណធារី	12	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	number_2digit	comprehension2	\N	f	f	98	f	t	\N	2025-10-05 07:48:30.854	2025-11-12 01:55:46.304	teacher	archived	\N	\N	\N
436	\N	21	លីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	115	f	f	\N	2025-11-08 09:36:49.408	2025-11-12 02:31:24.652	teacher	archived	\N	112233	4
438	\N	21	អឿន អេរីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:37:52.626	2025-11-12 02:37:52.626	teacher	production	\N	99998	5
439	\N	21	អឿន ណាំណឹង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:38:45.944	2025-11-12 02:38:45.944	teacher	production	\N	99997	5
440	\N	21	ហ៊ីម ម៉េងល័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:39:46.079	2025-11-12 02:39:46.079	teacher	production	\N	99996	5
441	\N	21	សុវណ្ណនី ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:40:45.946	2025-11-12 02:40:45.946	teacher	production	\N	99995	5
442	\N	21	សារី ចន្ទណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:42:00.623	2025-11-12 02:42:00.623	teacher	production	\N	99994	5
443	\N	21	សាន ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:43:00.779	2025-11-12 02:43:00.779	teacher	production	\N	99993	5
444	\N	21	វុទ្ធី វុទ្ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:43:59.604	2025-11-12 02:43:59.604	teacher	production	\N	99992	5
445	\N	21	លួន ស្រីតី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:44:48.664	2025-11-12 02:44:48.664	teacher	production	\N	99991	5
448	\N	21	យុន នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:46:54.566	2025-11-12 02:46:54.566	teacher	production	\N	99990	5
449	\N	21	ម៉ុន ស្រីមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:47:55.007	2025-11-12 02:47:55.007	teacher	production	\N	99989	5
450	\N	21	ម៉ុន ស្រីពី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:49:02.724	2025-11-12 02:49:02.724	teacher	production	\N	99988	5
451	\N	21	ម៉ឺន ពន្លឺ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:50:11.321	2025-11-12 02:50:11.321	teacher	production	\N	99987	5
452	\N	21	ម៉ី សុខម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:51:18.775	2025-11-12 02:51:18.775	teacher	production	\N	99986	5
453	\N	21	ភារម្យ ជីងជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:52:12.592	2025-11-12 02:52:12.592	teacher	production	\N	99985	5
454	\N	21	ភាព សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:53:02.632	2025-11-12 02:53:02.632	teacher	production	\N	99984	5
455	\N	21	ពិសិដ្ឋ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:54:47.491	2025-11-12 02:54:47.491	teacher	production	\N	99983	5
456	\N	21	ផល សុផា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:58:24.563	2025-11-12 02:58:24.563	teacher	production	\N	99980	5
457	\N	21	បូរ៉ា ចិនឡេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:08:17.38	2025-11-12 03:08:17.38	teacher	production	\N	99978	5
458	\N	21	ប៊ុនហ៊ាង ឈុនអេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:09:26.546	2025-11-12 03:09:26.546	teacher	production	\N	99977	5
459	\N	21	នឿន គឹមសួ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:13:11.384	2025-11-12 03:13:11.384	teacher	production	\N	99976	5
460	\N	21	ធឿន ស្រីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:14:09.682	2025-11-12 03:14:09.682	teacher	production	\N	99975	5
461	\N	21	ធិ ទីណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:14:59.804	2025-11-12 03:14:59.804	teacher	production	\N	99974	5
462	\N	21	ទិន មុន្នីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:15:44.173	2025-11-12 03:15:44.173	teacher	production	\N	99973	5
463	\N	21	ថាំង ស្រីមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:16:33.333	2025-11-12 03:16:33.333	teacher	production	\N	99970	5
464	\N	21	ថាន់ ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:18:53.421	2025-11-12 03:18:53.421	teacher	production	\N	99969	5
465	\N	21	ណាន ម៉េងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:20:16.194	2025-11-12 03:20:16.194	teacher	production	\N	99968	5
466	\N	21	ជ័យ ភក្ដី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:21:33.956	2025-11-12 03:21:33.956	teacher	production	\N	99967	5
467	\N	21	ជាតិ ពន្លក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:22:13.959	2025-11-12 03:22:13.959	teacher	production	\N	99966	5
468	\N	21	ឆុង ឆេងហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:23:06.377	2025-11-12 03:23:06.377	teacher	production	\N	99965	5
469	\N	21	ចិន្ធូ គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:23:47.289	2025-11-12 03:23:47.289	teacher	production	\N	99964	5
471	\N	21	គា ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:47:03.424	2025-11-12 06:47:03.424	teacher	production	\N	1519	4
472	\N	21	គឺ ហ្សានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:47:41.234	2025-11-12 06:47:41.234	teacher	production	\N	1478	4
473	\N	21	គ័ង គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:48:25.705	2025-11-12 06:48:25.705	teacher	production	\N	1520	4
474	\N	21	ចាន់រ៉ូ ចាន់ឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:49:59.285	2025-11-12 06:49:59.285	teacher	production	\N	1521	4
475	\N	21	ឆី ភ័ត្រ្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:50:45.42	2025-11-12 06:50:45.42	teacher	production	\N	1528	4
476	\N	21	ឆេងឡា ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:51:47.846	2025-11-12 06:51:47.846	teacher	production	\N	1522	4
477	\N	21	ឈួង វិឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:52:26.179	2025-11-12 06:52:26.179	teacher	production	\N	1659	4
478	\N	21	ឈៀង កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:53:13.949	2025-11-12 06:53:13.949	teacher	production	\N	1524	4
479	\N	21	ដានី ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:53:56.943	2025-11-12 06:53:56.943	teacher	production	\N	1525	4
480	\N	21	ធារុណ សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:54:28.851	2025-11-12 06:54:28.851	teacher	production	\N	1492	4
413	\N	2	ចាន់ សុភាព	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	f	f	54	f	f	\N	2025-11-01 07:36:45.672	2025-11-13 08:50:45.618	teacher	archived	\N	10001	4
470	\N	21	គាន់ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:24:21.733	2025-11-12 06:54:34.992	teacher	production	\N	1477	5
481	\N	21	នី សុខជា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:55:15.021	2025-11-12 06:55:15.021	teacher	production	\N	1531	4
482	\N	21	ប៊ី វិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:56:06.663	2025-11-12 06:56:06.663	teacher	production	\N	1533	4
483	\N	21	ប៊ុនណាង ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:56:44.755	2025-11-12 06:56:44.755	teacher	production	\N	1534	4
484	\N	21	បុរី កល្យាណ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:57:20.743	2025-11-12 06:57:20.743	teacher	production	\N	1536	4
485	\N	21	ផន លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:58:06.716	2025-11-12 06:58:06.716	teacher	production	\N	1537	4
486	\N	21	ពៅ អើយសុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:58:58.199	2025-11-12 06:58:58.199	teacher	production	\N	1540	4
487	\N	21	ភ័ណ្ឌ ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:59:27.273	2025-11-12 06:59:27.273	teacher	production	\N	1502	4
488	\N	21	ភ័ណ្ឌ អាមួយគា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:00:02.611	2025-11-12 07:00:02.611	teacher	production	\N	1541	4
489	\N	21	ភាព ស្រីណូត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:34:32.145	2025-11-12 07:34:32.145	teacher	production	\N	1543	4
490	\N	21	ភួង សុវណ្ណភូមិ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:35:09.922	2025-11-12 07:35:09.922	teacher	production	\N	1509	4
491	\N	21	ម៉ឺន សុធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:35:50.232	2025-11-12 07:35:50.232	teacher	production	\N	1544	4
492	\N	21	ម៉ៅ លីហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:36:27.284	2025-11-12 07:36:27.284	teacher	production	\N	1545	4
493	\N	21	យាន ចាន់ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:37:07.979	2025-11-12 07:37:07.979	teacher	production	\N	1463	4
494	\N	21	យ៉ិតសីហា ម៉ូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:37:43.576	2025-11-12 07:37:43.576	teacher	production	\N	1546	4
495	\N	21	យ៉េត ចាន់រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:38:31.174	2025-11-12 07:38:31.174	teacher	production	\N	1547	4
496	\N	21	រ៉ាត ហានសៀវអ៊ុន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:39:29.261	2025-11-12 07:39:29.261	teacher	production	\N	1548	4
497	\N	21	រ៉ែម ម៉េងហៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:40:01.456	2025-11-12 07:40:01.456	teacher	production	\N	1549	4
498	\N	21	លីម ម៉េងសួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:40:47.616	2025-11-12 07:40:47.616	teacher	production	\N	1507	4
499	\N	21	វណ្ណ: ណារិន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:41:37.105	2025-11-12 07:41:37.105	teacher	production	\N	1551	4
500	\N	21	វាសនា បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:44:52.449	2025-11-12 07:44:52.449	teacher	production	\N	1552	4
501	\N	21	វុទ្ធី លក្ខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:45:30.391	2025-11-12 07:45:30.391	teacher	production	\N	1553	4
502	\N	21	ស៊ាត់ សុខគា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:46:14.004	2025-11-12 07:46:14.004	teacher	production	\N	1605	4
503	\N	21	សុខ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:47:14.618	2025-11-12 07:47:14.618	teacher	production	\N	1554	4
504	\N	21	សុខហួង ជីងជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:47:52.364	2025-11-12 07:47:52.364	teacher	production	\N	1660	4
505	\N	21	សួន ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:48:23.202	2025-11-12 07:48:23.202	teacher	production	\N	1555	4
506	\N	21	សេន ភក្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:49:07.563	2025-11-12 07:49:07.563	teacher	production	\N	1515	4
507	\N	21	សៅ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:49:45.054	2025-11-12 07:49:45.054	teacher	production	\N	1661	4
508	\N	21	សៅ កុសល	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:50:17.121	2025-11-12 07:50:17.121	teacher	production	\N	1662	4
509	\N	21	ហ៊ាង សេងហាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:50:52.18	2025-11-12 07:50:52.18	teacher	production	\N	1514	4
510	\N	21	ហាន ស៊ីត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:51:36.436	2025-11-12 07:51:36.436	teacher	production	\N	1604	4
511	\N	21	ហួរ គីមហួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:52:06.294	2025-11-12 07:52:06.294	teacher	production	\N	1558	4
512	\N	21	ឡុង ស៊ីវឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:52:44.493	2025-11-12 07:52:44.493	teacher	production	\N	1606	4
513	\N	21	ឡុង រតន:	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:53:16.806	2025-11-12 07:53:16.806	teacher	production	\N	1476	4
514	\N	21	ឡេង សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:53:43.041	2025-11-12 07:53:43.041	teacher	production	\N	1560	4
515	\N	2	មាន សិរិវឌ្ឍនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:51:36.061	2025-11-13 08:51:36.061	teacher	production	\N	១០០១	4
516	\N	2	ហេង គឹមឡាយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:52:24.47	2025-11-13 08:52:24.47	teacher	production	\N	១០០២	4
517	\N	2	អ៊ូច ស្រីអៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:53:10.164	2025-11-13 08:53:10.164	teacher	production	\N	១០០៣	4
518	\N	2	អាន គីមមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:54:15.966	2025-11-13 08:54:15.966	teacher	production	\N	១០០៤	4
519	\N	2	ផល ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:54:56.369	2025-11-13 08:54:56.369	teacher	production	\N	១០០៥	4
520	\N	2	រី យ៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:55:39.43	2025-11-13 08:55:39.43	teacher	production	\N	១០០៦	4
521	\N	2	ពេទ្យ សុខសំ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:56:36.679	2025-11-13 08:56:36.679	teacher	production	\N	១០០៧	4
522	\N	2	រឿន វ៉ាន់នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:57:35.699	2025-11-13 08:57:35.699	teacher	production	\N	១០០៨	4
523	\N	2	វីត សីវណេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:59:40.625	2025-11-13 08:59:40.625	teacher	production	\N	១០០៩	4
524	\N	2	ប៊ី រ៉ាប៊ីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:00:49.892	2025-11-13 09:00:49.892	teacher	production	\N	១០១០	4
525	\N	2	រិន វ៉ាន់នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:01:30.579	2025-11-13 09:01:30.579	teacher	production	\N	១០១១	4
526	\N	2	ស៊ុន រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:03:07.688	2025-11-13 09:03:07.688	teacher	production	\N	១០១២	4
527	\N	2	វីត សីហា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:03:35.042	2025-11-13 09:03:35.042	teacher	production	\N	១០១៣	4
528	\N	2	បូសេរី មិនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:04:23.037	2025-11-13 09:04:23.037	teacher	production	\N	១០១៤	4
529	\N	2	រិន ចំរើន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:04:49.429	2025-11-13 09:04:49.429	teacher	production	\N	១០១៥	4
530	\N	2	ខន ចាន់បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:05:24.692	2025-11-13 09:05:24.692	teacher	production	\N	១០១៦	4
531	\N	2	ដាវុន ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:05:58.877	2025-11-13 09:05:58.877	teacher	production	\N	១០១៧	4
532	\N	19	 ចំរើន រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:40:28.507	2025-11-14 07:40:28.507	teacher	production	\N	2001	5
533	\N	19	ឈើត បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:41:35.713	2025-11-14 07:41:35.713	teacher	production	\N	២០០១	5
534	\N	19	ញ៉េ ម៉ានិត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:42:13.797	2025-11-14 07:42:13.797	teacher	production	\N	២០០៣	5
535	\N	19	ញ៉េ កុម្ភះ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:43:08.71	2025-11-14 07:43:08.71	teacher	production	\N	២០០៤	5
536	\N	19	ឌី ចាន់រី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:43:37.771	2025-11-14 07:43:37.771	teacher	production	\N	២០០៥	5
537	\N	19	ធា រ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:44:03.927	2025-11-14 07:44:03.927	teacher	production	\N	២០០៦	5
538	\N	19	នឿម សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:44:45.411	2025-11-14 07:44:45.411	teacher	production	\N	២០០៧	5
539	\N	19	បៃ សម្បត្តិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:52:52.015	2025-11-14 07:52:52.015	teacher	production	\N	២០០៨	5
540	\N	19	ផល្លី យៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:53:21.515	2025-11-14 07:53:21.515	teacher	production	\N	២០០៩	5
541	\N	19	មឿន សុធីរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:53:55.123	2025-11-14 07:53:55.123	teacher	production	\N	២០១០	5
542	\N	19	ម៉ៅ យូមីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:54:17.827	2025-11-14 07:54:17.827	teacher	production	\N	២០១១	5
544	\N	19	រឿន ខ្វាន់សុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:55:22.927	2025-11-14 07:55:22.927	teacher	production	\N	២០១៣	5
545	\N	19	រើន សៅណេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:55:54.103	2025-11-14 07:55:54.103	teacher	production	\N	២០១៤	5
546	\N	19	វ៉ុន សុីនត្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:56:31.644	2025-11-14 07:56:31.644	teacher	production	\N	២០១៥	5
550	\N	19	សារ៉ាត់ ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:05.292	2025-11-14 07:58:05.292	teacher	production	\N	២០១៦	5
551	\N	19	ស៊ាន បូរី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:33.949	2025-11-14 07:58:33.949	teacher	production	\N	២០១៧	5
552	\N	19	សំភាស់ តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:59.172	2025-11-14 07:58:59.172	teacher	production	\N	២០១៨	5
553	\N	19	ហ៊ុន ប្រុសគីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:59:32.397	2025-11-14 07:59:32.397	teacher	production	\N	២០១៩	5
554	\N	19	អុឹម លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 08:00:08.34	2025-11-14 08:00:08.34	teacher	production	\N	២០២០	5
555	\N	19	ស៊ាន ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 08:01:44.439	2025-11-14 08:01:44.439	teacher	production	\N	២០២១	5
543	\N	19	យឹម មីនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:54:44.217	2025-11-14 08:02:20.717	teacher	production	\N	២០១២	5
559	\N	44	សុផាត​ វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-14 09:02:25.13	2025-11-14 09:02:25.13	teacher	production	\N	១	4
560	\N	44	គ្រី​ គីមណយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-14 09:04:12.278	2025-11-14 09:06:41.245	teacher	production	\N	២	4
\.


--
-- TOC entry 3930 (class 0 OID 16609)
-- Dependencies: 265
-- Data for Name: teacher_school_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teacher_school_assignments (id, teacher_id, pilot_school_id, subject, assigned_by_id, assigned_date, is_active, notes, created_at, updated_at) FROM stdin;
1	99	33	Language	3	2025-10-20 04:31:00.688	t	test	2025-10-20 04:31:00.688	2025-10-20 04:31:00.688
2	99	37	Language	3	2025-11-05 05:21:59.712	t	តេសត	2025-11-05 05:21:59.712	2025-11-05 05:21:59.712
3	99	37	Math	3	2025-11-05 05:22:04.709	t	តេសត	2025-11-05 05:22:04.709	2025-11-05 05:22:04.709
4	98	37	Language	3	2025-11-05 05:22:31.181	t	តេស្ត	2025-11-05 05:22:31.181	2025-11-05 05:22:31.181
5	98	37	Math	3	2025-11-05 05:22:39.207	t	តេស្ត	2025-11-05 05:22:39.207	2025-11-05 05:22:39.207
6	102	41	Language	3	2025-11-06 04:18:28.647	t	Test	2025-11-06 04:18:28.647	2025-11-06 04:18:28.647
7	80	24	Language	3	2025-11-06 04:49:31.298	t	\N	2025-11-06 04:49:31.298	2025-11-06 04:49:31.298
8	85	24	Language	3	2025-11-06 04:50:00.948	t	\N	2025-11-06 04:50:00.948	2025-11-06 04:50:00.948
9	106	29	Math	3	2025-11-06 05:02:50.507	t	\N	2025-11-06 05:02:50.507	2025-11-06 05:02:50.507
10	56	29	Math	3	2025-11-06 05:04:10.543	t	\N	2025-11-06 05:04:10.543	2025-11-06 05:04:10.543
11	65	19	Language	3	2025-11-06 07:15:33.359	t	\N	2025-11-06 07:15:33.359	2025-11-06 07:15:33.359
12	83	19	Language	3	2025-11-06 07:16:59.139	t	\N	2025-11-06 07:16:59.139	2025-11-06 07:16:59.139
13	25	15	Math	3	2025-11-06 07:23:39.418	t	\N	2025-11-06 07:23:39.418	2025-11-06 07:23:39.418
14	26	15	Math	3	2025-11-06 07:24:04.935	t	\N	2025-11-06 07:24:04.935	2025-11-06 07:24:04.935
15	42	13	Math	3	2025-11-06 07:26:11.437	t	\N	2025-11-06 07:26:11.437	2025-11-06 07:26:11.437
16	28	11	Math	3	2025-11-06 07:28:01.951	t	\N	2025-11-06 07:28:01.951	2025-11-06 07:28:01.951
17	50	11	Math	3	2025-11-06 07:28:29.063	t	\N	2025-11-06 07:28:29.063	2025-11-06 07:28:29.063
18	44	9	Math	3	2025-11-06 07:29:12.554	t	\N	2025-11-06 07:29:12.554	2025-11-06 07:29:12.554
19	38	9	Math	3	2025-11-06 07:29:41.894	t	\N	2025-11-06 07:29:41.894	2025-11-06 07:29:41.894
20	29	7	Language	3	2025-11-06 07:30:21.766	t	\N	2025-11-06 07:30:21.766	2025-11-06 07:30:21.766
21	33	5	Math	3	2025-11-06 07:32:51.166	t	\N	2025-11-06 07:32:51.166	2025-11-06 07:32:51.166
22	37	5	Math	3	2025-11-06 07:33:17.161	t	\N	2025-11-06 07:33:17.161	2025-11-06 07:33:17.161
23	51	3	Language	3	2025-11-06 07:33:54.939	t	\N	2025-11-06 07:33:54.939	2025-11-06 07:33:54.939
24	31	3	Language	3	2025-11-06 07:34:19.249	t	\N	2025-11-06 07:34:19.249	2025-11-06 07:34:19.249
25	73	45	Math	3	2025-11-06 07:41:38.743	t	\N	2025-11-06 07:41:38.743	2025-11-06 07:41:38.743
26	105	45	Math	3	2025-11-06 07:44:37.377	t	\N	2025-11-06 07:44:37.377	2025-11-06 07:44:37.377
27	104	31	Math	3	2025-11-06 07:46:00.393	t	\N	2025-11-06 07:46:00.393	2025-11-06 07:46:00.393
28	58	30	Math	3	2025-11-06 07:48:32.899	t	\N	2025-11-06 07:48:32.899	2025-11-06 07:48:32.899
29	57	30	Math	3	2025-11-06 07:48:59.407	t	\N	2025-11-06 07:48:59.407	2025-11-06 07:48:59.407
30	62	26	Math	3	2025-11-06 07:50:59.982	t	\N	2025-11-06 07:50:59.982	2025-11-06 07:50:59.982
31	82	26	Math	3	2025-11-06 07:51:19.506	t	\N	2025-11-06 07:51:19.506	2025-11-06 07:51:19.506
32	69	25	Language	3	2025-11-06 07:52:02.542	t	\N	2025-11-06 07:52:02.542	2025-11-06 07:52:02.542
33	67	23	Language	3	2025-11-06 07:55:44.404	t	\N	2025-11-06 07:55:44.404	2025-11-06 07:55:44.404
34	76	23	Language	3	2025-11-06 07:56:05	t	\N	2025-11-06 07:56:05	2025-11-06 07:56:05
35	63	22	Language	3	2025-11-06 07:58:01.59	t	\N	2025-11-06 07:58:01.59	2025-11-06 07:58:01.59
36	77	22	Language	3	2025-11-06 07:58:20.032	t	\N	2025-11-06 07:58:20.032	2025-11-06 07:58:20.032
37	66	21	Language	3	2025-11-06 07:58:57.962	t	\N	2025-11-06 07:58:57.962	2025-11-06 07:58:57.962
38	68	20	Language	3	2025-11-06 08:00:41.792	t	\N	2025-11-06 08:00:41.792	2025-11-06 08:00:41.792
39	81	20	Language	3	2025-11-06 08:01:03.44	t	\N	2025-11-06 08:01:03.44	2025-11-06 08:01:03.44
40	78	18	Language	3	2025-11-06 08:01:49.243	t	\N	2025-11-06 08:01:49.243	2025-11-06 08:01:49.243
41	59	18	Language	3	2025-11-06 08:02:11.012	t	\N	2025-11-06 08:02:11.012	2025-11-06 08:02:11.012
42	55	17	Language	3	2025-11-06 08:03:38.338	t	\N	2025-11-06 08:03:38.338	2025-11-06 08:03:38.338
43	54	17	Math	3	2025-11-06 08:04:04.089	t	\N	2025-11-06 08:04:04.089	2025-11-06 08:04:04.089
45	36	6	Language	3	2025-11-06 08:06:44.716	t	\N	2025-11-06 08:06:44.716	2025-11-06 08:06:44.716
46	30	1	Language	3	2025-11-06 08:07:47.235	t	\N	2025-11-06 08:07:47.235	2025-11-06 08:07:47.235
47	60	44	Math	3	2025-11-06 08:08:49.91	t	\N	2025-11-06 08:08:49.91	2025-11-06 08:08:49.91
48	79	44	Math	3	2025-11-06 08:09:06.72	t	\N	2025-11-06 08:09:06.72	2025-11-06 08:09:06.72
49	46	14	Math	3	2025-11-06 08:10:28.345	t	\N	2025-11-06 08:10:28.345	2025-11-06 08:10:28.345
50	24	14	Math	3	2025-11-06 08:10:45.321	t	\N	2025-11-06 08:10:45.321	2025-11-06 08:10:45.321
51	27	12	Math	3	2025-11-06 08:12:28.611	t	\N	2025-11-06 08:12:28.611	2025-11-06 08:12:28.611
52	35	12	Math	3	2025-11-06 08:13:18.969	t	\N	2025-11-06 08:13:18.969	2025-11-06 08:13:18.969
53	45	10	Math	3	2025-11-06 08:14:32.998	t	\N	2025-11-06 08:14:32.998	2025-11-06 08:14:32.998
54	40	10	Math	3	2025-11-06 08:14:50.892	t	\N	2025-11-06 08:14:50.892	2025-11-06 08:14:50.892
55	23	8	Language	3	2025-11-06 08:15:44.607	t	\N	2025-11-06 08:15:44.607	2025-11-06 08:15:44.607
56	34	8	Language	3	2025-11-06 08:16:05.277	t	\N	2025-11-06 08:16:05.277	2025-11-06 08:16:05.277
57	47	4	Language	3	2025-11-06 08:16:58.803	t	\N	2025-11-06 08:16:58.803	2025-11-06 08:16:58.803
58	22	4	Language	3	2025-11-06 08:17:13.982	t	\N	2025-11-06 08:17:13.982	2025-11-06 08:17:13.982
59	41	2	Language	3	2025-11-06 08:17:41.126	t	\N	2025-11-06 08:17:41.126	2025-11-06 08:17:41.126
60	49	2	Language	3	2025-11-06 08:18:02.879	t	\N	2025-11-06 08:18:02.879	2025-11-06 08:18:02.879
61	60	32	Math	3	2025-11-06 08:19:15.894	t	\N	2025-11-06 08:19:15.894	2025-11-06 08:19:15.894
62	79	32	Math	3	2025-11-06 08:19:52.726	t	\N	2025-11-06 08:19:52.726	2025-11-06 08:19:52.726
63	52	13	Math	3	2025-11-06 08:23:31.894	t	\N	2025-11-06 08:23:31.894	2025-11-06 08:23:31.894
64	64	25	Language	3	2025-11-06 08:30:15.941	t	\N	2025-11-06 08:30:15.941	2025-11-06 08:30:15.941
65	113	16	Math	3	2025-11-06 09:25:46.618	t	\N	2025-11-06 09:25:46.618	2025-11-06 09:25:46.618
66	114	16	Math	3	2025-11-06 09:26:04.433	t	\N	2025-11-06 09:26:04.433	2025-11-06 09:26:04.433
67	110	6	Language	3	2025-11-06 09:31:47.533	t	\N	2025-11-06 09:31:47.533	2025-11-06 09:31:47.533
68	74	28	Math	3	2025-11-06 09:34:32.482	t	\N	2025-11-06 09:34:32.482	2025-11-06 09:34:32.482
69	75	28	Math	3	2025-11-06 09:34:50.495	t	\N	2025-11-06 09:34:50.495	2025-11-06 09:34:50.495
70	105	27	Math	3	2025-11-06 09:35:56.735	t	\N	2025-11-06 09:35:56.735	2025-11-06 09:35:56.735
71	73	27	Math	3	2025-11-06 09:36:19.551	t	\N	2025-11-06 09:36:19.551	2025-11-06 09:36:19.551
72	109	1	Math	3	2025-11-06 09:38:21.073	t	\N	2025-11-06 09:38:21.073	2025-11-06 09:38:21.073
73	111	7	Language	3	2025-11-06 09:40:12.675	t	\N	2025-11-06 09:40:12.675	2025-11-06 09:40:12.675
\.


--
-- TOC entry 3932 (class 0 OID 16618)
-- Dependencies: 267
-- Data for Name: teaching_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teaching_activities (id, teacher_id, activity_date, subject, topic, duration, materials_used, student_count, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3934 (class 0 OID 16625)
-- Dependencies: 269
-- Data for Name: test_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_sessions (id, user_id, user_role, started_at, expires_at, status, student_count, assessment_count, mentoring_visit_count, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3935 (class 0 OID 16636)
-- Dependencies: 270
-- Data for Name: user_schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_schools (id, user_id, school_id, pilot_school_id, assigned_date, assigned_by, is_primary) FROM stdin;
\.


--
-- TOC entry 3937 (class 0 OID 16642)
-- Dependencies: 272
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (id, user_id, user_role, ip_address, user_agent, device_info, started_at, last_activity, expires_at, is_active, terminated_at, termination_reason, created_at) FROM stdin;
\.


--
-- TOC entry 3938 (class 0 OID 16651)
-- Dependencies: 273
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, username, profile_photo, sex, phone, holding_classes, assigned_subject, role, email_verified_at, password, remember_token, onboarding_completed, onboarding_completed_at, show_onboarding, created_at, updated_at, profile_expires_at, original_school_id, original_subject, original_classes, school_id, subject, pilot_school_id, province, district, commune, village, is_active, test_mode_enabled, login_type, username_login, migrated_from_quick_login, migration_date, onboarding_activities) FROM stdin;
96	test.signup.user	test.signup.user@quick.login	test.signup.user	\N	\N	\N	ថ្នាក់ទី៤	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	\N	\N	t	2025-10-02 14:20:16.138	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	គណិតវិទ្យា	33	Kampong Cham	Kampong Cham City	\N	\N	t	f	username	test.signup.user	f	\N	[]
97	phalla.somalina	phalla.somalina@quick.login	phalla.somalina	\N	\N	\N	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-03 06:33:55.476	2025-10-13 08:37:41.738	\N	\N	\N	\N	\N	khmer	17	Kampong Cham	Kampong Cham	\N	\N	t	f	username	phalla.somalina	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
98	Vibol	Vibol@quick.login	Vibol	\N	\N	\N	ថ្នាក់ទី៤	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"complete_profile\\"]"	\N	t	2025-10-05 07:46:55.159	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	ភាសាខ្មែរ	23	Kampong Cham	Kampong Cham	\N	\N	t	f	username	Vibol	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_view\\",\\"report_view\\",\\"assessment_add\\"]"
11	Nhim Sokha	nhim.sokha	nhim.sokha	\N	\N	\N	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-06 05:13:00.402	t	2025-09-15 20:36:38	2025-10-13 08:28:33.1	2025-10-08 05:13:00.402	\N	All	\N	\N	khmer	8	Battambang	Battambang	\N	\N	t	f	email	nhim.sokha	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
103	phannsavoeun	phannsavoeun@quick.login	phannsavoeun	\N	\N	\N	ថ្នាក់ទី៤	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-10 13:03:31.613	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	ភាសាខ្មែរ	34	កំពង់ចាម	N/A	\N	\N	t	f	username	phannsavoeun	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\"]"
17	SAN AUN	san.aun	san.aun	\N	\N	077910606	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_student_management\\",\\"add_students\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-11 02:54:25.759	t	2025-09-15 20:36:40	2025-10-14 09:15:17.576	2025-10-13 02:54:25.759	\N	All	\N	\N	math	41	កំពង់ចាម	\N	\N	\N	t	f	email	san.aun	f	\N	"[\\"student_view\\",\\"student_add\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\"]"
18	Ms. Chhoeng Marady	chhoeng.marady	chhoeng.marady	\N	\N	012547170	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-09-15 20:36:40	2025-10-13 08:28:33.1	2025-10-03 00:12:56.647	\N	All	\N	\N	khmer	8	Battambang	Battambang	\N	\N	t	f	email	chhoeng.marady	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
100	Set.Socheat	Set.Socheat@quick.login	Set.Socheat	\N	\N	\N	ថ្នាក់ទី៤	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\",\\"test_student_management\\",\\"add_students\\"]"	\N	t	2025-10-08 03:28:25.048	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	ភាសាខ្មែរ	1	Battambang	Battambang	\N	\N	t	f	username	Set.Socheat	f	\N	"[\\"student_add\\",\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\",\\"student_edit\\"]"
35	Oeun Kosal	oeun.kosal.bat@teacher.tarl.edu.kh	oeun.kosal.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:44	2025-10-13 08:28:33.1	\N	\N	\N	\N	64	Maths	\N	Battambang	\N	\N	\N	t	f	email	oeun.kosal.bat	f	\N	[]
36	On Phors	on.phors.bat@teacher.tarl.edu.kh	on.phors.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:45	2025-10-13 08:28:33.1	\N	\N	\N	\N	58	Khmer	\N	Battambang	\N	\N	\N	t	f	email	on.phors.bat	f	\N	[]
38	Pat Sokheng	pat.sokheng.bat@teacher.tarl.edu.kh	pat.sokheng.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:45	2025-10-13 08:28:33.1	\N	\N	\N	\N	61	Maths	\N	Battambang	\N	\N	\N	t	f	email	pat.sokheng.bat	f	\N	[]
93	viewer	viewer@quick.login	viewer	\N	\N	\N	\N	\N	viewer	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	\N	\N	t	2025-09-27 05:57:49.325	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	username	viewer	t	2025-10-02 10:29:16.447162	[]
95	sanaun123	sanaun123@quick.login	sanaun123	\N	\N	\N	ថ្នាក់ទី៤, ថ្នាក់ទី៥	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-10-02 10:01:36.097	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	គណិតវិទ្យា	33	Kampong Cham	Kampong Cham	\N	\N	t	f	username	sanaun123	t	2025-10-02 10:29:16.447162	"[\\"student_view\\",\\"report_view\\",\\"assessment_view\\"]"
25	Ieang Bunthoeurn	ieang.bunthoeurn.bat@teacher.tarl.edu.kh	ieang.bunthoeurn.bat	\N	\N	01212121	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	\N	t	2025-09-15 20:36:42	2025-10-13 08:28:33.1	\N	\N	\N	\N	67	both	1	Battambang	Battambang	\N	\N	t	f	email	ieang.bunthoeurn.bat	f	\N	[]
24	Hol Phanna	hol.phanna.bat@teacher.tarl.edu.kh	hol.phanna.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:41	2025-10-13 08:28:33.1	\N	\N	\N	\N	66	Maths	\N	Battambang	\N	\N	\N	t	f	email	hol.phanna.bat	f	\N	[]
26	Kan Ray	kan.ray.bat@teacher.tarl.edu.kh	kan.ray.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:42	2025-10-13 08:28:33.1	\N	\N	\N	\N	67	Maths	\N	Battambang	\N	\N	\N	t	f	email	kan.ray.bat	f	\N	[]
27	Keo Socheat	keo.socheat.bat@teacher.tarl.edu.kh	keo.socheat.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:42	2025-10-13 08:28:33.1	\N	\N	\N	\N	64	Maths	\N	Battambang	\N	\N	\N	t	f	email	keo.socheat.bat	f	\N	[]
30	Koe Kimsou	koe.kimsou.bat@teacher.tarl.edu.kh	koe.kimsou.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:43	2025-10-13 08:28:33.1	\N	\N	\N	\N	53	Khmer	\N	Battambang	\N	\N	\N	t	f	email	koe.kimsou.bat	f	\N	[]
20	Ms. Phann Savoeun	phann.savoeun	phann.savoeun	\N	\N	012950314	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-14 11:25:46.642	t	2025-09-15 20:36:40	2025-11-01 06:26:21.88	2025-10-16 11:25:46.642	\N	All	\N	\N	khmer	34	កំពង់ចាម	\N	\N	\N	t	f	email	phann.savoeun	f	\N	"[\\"assessment_view\\",\\"assessment_add\\",\\"student_view\\"]"
37	Ou Sreynuch	ou.sreynuch.bat@teacher.tarl.edu.kh	ou.sreynuch.bat	\N	\N	0718708989	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-13 01:40:43.409	t	2025-09-15 20:36:45	2025-11-13 01:40:43.409	\N	\N	\N	\N	57	khmer	5	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ou.sreynuch.bat	f	\N	"[\\"student_view\\"]"
28	Keo Vesith	keo.vesith.bat@teacher.tarl.edu.kh	keo.vesith.bat	\N	\N	0963677927	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	\N	t	2025-09-15 20:36:43	2025-11-14 06:56:26.353	\N	\N	\N	\N	63	khmer	3	Battambang	Battambang	\N	\N	t	f	email	keo.vesith.bat	f	\N	"[\\"student_view\\"]"
23	Ho Mealtey	ho.mealtey.bat@teacher.tarl.edu.kh	ho.mealtey.bat	\N	\N	012405227	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-13 09:25:50.524	t	2025-09-15 20:36:41	2025-11-14 12:33:56.818	\N	\N	\N	\N	60	khmer	8	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ho.mealtey.bat	f	\N	"[\\"student_view\\"]"
31	Ms. Kheav Sreyoun	kheav.sreyoun.bat@teacher.tarl.edu.kh	kheav.sreyoun.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:43	2025-10-13 08:28:33.1	\N	\N	\N	\N	55	Khmer	\N	Battambang	\N	\N	\N	t	f	email	kheav.sreyoun.bat	f	\N	[]
32	Ms. Ret Sreynak	ret.sreynak.bat@teacher.tarl.edu.kh	ret.sreynak.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:44	2025-10-13 08:28:33.1	\N	\N	\N	\N	68	Maths	\N	Battambang	\N	\N	\N	t	f	email	ret.sreynak.bat	f	\N	[]
33	Nann Phary	nann.phary.bat@teacher.tarl.edu.kh	nann.phary.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:44	2025-10-13 08:28:33.1	\N	\N	\N	\N	57	Khmer	\N	Battambang	\N	\N	\N	t	f	email	nann.phary.bat	f	\N	[]
99	sovath.c	sovath.c@quick.login	sovath.c	\N	\N	\N	ថ្នាក់ទី៤	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	\N	\N	t	2025-10-05 07:47:07.865	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	គណិតវិទ្យា	1	Battambang	Battambang	\N	\N	t	f	username	sovath.c	f	\N	"[\\"student_view\\",\\"assessment_view\\"]"
19	Ms. Horn Socheata	horn.socheata	horn.socheata	\N	\N	0963265936	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-10-08 02:12:23.403	t	2025-09-15 20:36:40	2025-10-13 08:28:33.1	2025-10-10 02:12:23.403	\N	All	\N	\N	khmer	28	Kampong Cham	Kampong Cham	\N	\N	t	f	email	horn.socheata	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\"]"
79	Ms. Oll Phaleap	oll.phaleap.kam@teacher.tarl.edu.kh	oll.phaleap.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:56	2025-10-13 08:28:33.1	\N	\N	\N	\N	84	Maths	\N	Kampong Cham	\N	\N	\N	t	f	email	oll.phaleap.kam	f	\N	[]
101	Son.Naisim	Son.Naisim@quick.login	Son.Naisim	\N	\N	\N	grade_5	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-08 03:30:13.671	2025-10-17 00:09:55.228	\N	\N	\N	\N	\N	math	1	Battambang	Battambang	\N	\N	t	f	username	Son.Naisim	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
94	Cheaphannha	Cheaphannha@quick.login	Cheaphannha	\N	\N	077806680	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-02 09:21:17.284	2025-10-17 03:40:18.808	\N	\N	\N	\N	\N	math	17	Kampong Cham	Kampong Cham	\N	\N	t	f	username	Cheaphannha	t	2025-10-02 10:29:16.447162	"[\\"assessment_view\\",\\"student_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\"]"
9	Chhorn Sopheak	chhorn.sopheak	chhorn.sopheak	\N	\N	085959222	both	khmer	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"complete_profile\\"]"	\N	t	2025-09-15 20:36:38	2025-10-15 00:54:24.231	\N	\N	\N	\N	\N	math	29	Kampong Cham	Kampong Cham	\N	\N	t	f	email	chhorn.sopheak	f	\N	"[\\"assessment_view\\",\\"student_view\\",\\"report_view\\",\\"student_edit\\",\\"assessment_add\\"]"
12	Noa Cham Roeun	noa.cham.roeun	noa.cham.roeun	\N	\N	012878787	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-11 03:08:17.616	t	2025-09-15 20:36:38	2025-10-16 08:56:48.364	2025-10-13 03:08:17.616	\N	All	\N	\N	math	39	កំពង់ចាម	\N	\N	\N	t	f	email	noa.cham.roeun	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
13	Rorn Sareang	rorn.sareang	rorn.sareang	\N	\N	\N	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:24:03.687	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-10 12:24:03.687	\N	All	\N	\N	math	13	Battambang	Battambang	\N	\N	t	f	email	rorn.sareang	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
102	Son_Naisim	Son_Naisim@quick.login	Son_Naisim	\N	\N	\N	ថ្នាក់ទី៤	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	\N	t	2025-10-10 11:33:10.983	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	គណិតវិទ្យា	1	Battambang	Battambang	\N	\N	t	f	username	Son_Naisim	f	\N	\N
22	Chann Leakeana	chann.leakeana.bat@teacher.tarl.edu.kh	chann.leakeana.bat	\N	\N	011112233	grade_4	khmer	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:41	2025-10-13 08:28:33.1	\N	\N	\N	\N	56	Khmer	25	Battambang	Battambang	\N	\N	t	f	email	chann.leakeana.bat	f	\N	"[\\"assessment_view\\",\\"student_view\\"]"
39	Pech Peakleka	pech.peakleka.bat@teacher.tarl.edu.kh	pech.peakleka.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:46	2025-10-13 08:28:33.1	\N	\N	\N	\N	68	Maths	\N	Battambang	\N	\N	\N	t	f	email	pech.peakleka.bat	f	\N	[]
40	Raeun Sovathary	raeun.sovathary.bat@teacher.tarl.edu.kh	raeun.sovathary.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:46	2025-10-13 08:28:33.1	\N	\N	\N	\N	62	Maths	\N	Battambang	\N	\N	\N	t	f	email	raeun.sovathary.bat	f	\N	[]
42	Rom Ratanak	rom.ratanak.bat@teacher.tarl.edu.kh	rom.ratanak.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:46	2025-10-13 08:28:33.1	\N	\N	\N	\N	65	Maths	\N	Battambang	\N	\N	\N	t	f	email	rom.ratanak.bat	f	\N	[]
80	Ms. Phann Srey Roth	phann.srey.roth.kam@teacher.tarl.edu.kh	phann.srey.roth.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:57	2025-10-13 08:28:33.1	\N	\N	\N	\N	76	Khmer	\N	Kampong Cham	\N	\N	\N	t	f	email	phann.srey.roth.kam	f	\N	[]
78	Ms. Nov Pelim	nov.pelim.kam@teacher.tarl.edu.kh	nov.pelim.kam	\N	\N	016896135	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:31:28.099	t	2025-09-15 20:36:56	2025-11-01 07:33:07.295	\N	\N	\N	\N	70	khmer	40	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nov.pelim.kam	f	\N	"[\\"student_view\\"]"
2	System Admin	admin@prathaminternational.org	admin	\N	\N	\N	\N	\N	admin	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-18 16:36:09.406	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	admin	f	\N	"[\\"assessment_view\\",\\"report_view\\"]"
74	Ms. HENG NEANG	heng.neang.kam@teacher.tarl.edu.kh	heng.neang.kam	\N	\N	077596728	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:41:40.565	t	2025-09-15 20:36:55	2025-11-01 07:42:06.155	\N	\N	\N	\N	80	math	28	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heng.neang.kam	f	\N	"[\\"student_view\\"]"
83	Ms. Seun Sophary	seun.sophary.kam@teacher.tarl.edu.kh	seun.sophary.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:57	2025-11-01 07:27:19.716	\N	\N	\N	\N	71	Khmer	\N	Kampong Cham	\N	\N	\N	t	f	email	seun.sophary.kam	f	\N	"[\\"student_view\\"]"
77	Ms. My Savy	my.savy.kam@teacher.tarl.edu.kh	my.savy.kam	\N	\N	0976167545	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:41:09.525	t	2025-09-15 20:36:56	2025-11-01 07:41:09.525	\N	\N	\N	\N	74	khmer	22	កំពង់ចាម	កងមាស	\N	\N	t	f	email	my.savy.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\"]"
41	Rin Vannra	rin.vannra.bat@teacher.tarl.edu.kh	rin.vannra.bat	\N	\N	0798949210	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-13 08:48:58.75	t	2025-09-15 20:36:46	2025-11-13 08:48:58.75	\N	\N	\N	\N	54	khmer	2	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	rin.vannra.bat	f	\N	"[\\"student_view\\"]"
21	Sin Borndoul	sin.borndoul	sin.borndoul	\N	\N	0963677927	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-08 14:20:53.587	t	2025-09-15 20:36:41	2025-10-13 08:28:33.1	2025-10-10 14:20:53.587	\N	All	\N	\N	khmer	2	Battambang	Battambang	\N	\N	t	f	email	sin.borndoul	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"student_edit\\"]"
84	Ms. THIN DALIN	thin.dalin.kam@teacher.tarl.edu.kh	thin.dalin.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:58	2025-10-13 08:28:33.1	\N	\N	\N	\N	73	Khmer	\N	Kampong Cham	\N	\N	\N	t	f	email	thin.dalin.kam	f	\N	[]
43	Sak Samnang	sak.samnang.bat@teacher.tarl.edu.kh	sak.samnang.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:47	2025-10-13 08:28:33.1	\N	\N	\N	\N	58	Khmer	\N	Battambang	\N	\N	\N	t	f	email	sak.samnang.bat	f	\N	[]
44	Sang Sangha	sang.sangha.bat@teacher.tarl.edu.kh	sang.sangha.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:47	2025-10-13 08:28:33.1	\N	\N	\N	\N	61	Maths	\N	Battambang	\N	\N	\N	t	f	email	sang.sangha.bat	f	\N	[]
45	Seum Sovin	seum.sovin.bat@teacher.tarl.edu.kh	seum.sovin.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:47	2025-10-13 08:28:33.1	\N	\N	\N	\N	62	Maths	\N	Battambang	\N	\N	\N	t	f	email	seum.sovin.bat	f	\N	[]
46	Soeun Danut	soeun.danut.bat@teacher.tarl.edu.kh	soeun.danut.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:47	2025-10-13 08:28:33.1	\N	\N	\N	\N	66	Maths	\N	Battambang	\N	\N	\N	t	f	email	soeun.danut.bat	f	\N	[]
47	Sokh Chamrong	sokh.chamrong.bat@teacher.tarl.edu.kh	sokh.chamrong.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:48	2025-10-13 08:28:33.1	\N	\N	\N	\N	56	Khmer	\N	Battambang	\N	\N	\N	t	f	email	sokh.chamrong.bat	f	\N	[]
49	Sor Kimseak	sor.kimseak.bat@teacher.tarl.edu.kh	sor.kimseak.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:48	2025-10-13 08:28:33.1	\N	\N	\N	\N	54	Khmer	\N	Battambang	\N	\N	\N	t	f	email	sor.kimseak.bat	f	\N	[]
51	Tep Sokly	tep.sokly.bat@teacher.tarl.edu.kh	tep.sokly.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:49	2025-10-13 08:28:33.1	\N	\N	\N	\N	55	Khmer	\N	Battambang	\N	\N	\N	t	f	email	tep.sokly.bat	f	\N	[]
52	Thiem Thida	thiem.thida.bat@teacher.tarl.edu.kh	thiem.thida.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:49	2025-10-13 08:28:33.1	\N	\N	\N	\N	65	Maths	\N	Battambang	\N	\N	\N	t	f	email	thiem.thida.bat	f	\N	[]
53	Thy Sophat	thy.sophat.bat@teacher.tarl.edu.kh	thy.sophat.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:49	2025-10-13 08:28:33.1	\N	\N	\N	\N	53	Maths	\N	Battambang	\N	\N	\N	t	f	email	thy.sophat.bat	f	\N	[]
55	Moy Sodara	moy.sodara.kam@teacher.tarl.edu.kh	moy.sodara.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:50	2025-10-13 08:28:33.1	\N	\N	\N	\N	69	Khmer	\N	Kampong Cham	\N	\N	\N	t	f	email	moy.sodara.kam	f	\N	[]
58	Khoem Sithuon	khoem.sithuon.kam@teacher.tarl.edu.kh	khoem.sithuon.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:51	2025-10-13 08:28:33.1	\N	\N	\N	\N	82	Maths	\N	Kampong Cham	\N	\N	\N	t	f	email	khoem.sithuon.kam	f	\N	[]
3	Coordinator One	coordinator@prathaminternational.org	coordinator	\N	\N	\N	\N	\N	coordinator	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	coordinator	f	\N	"[\\"report_view\\",\\"student_view\\",\\"assessment_view\\"]"
6	Leang Chhun Hourth	leang.chhun.hourth	leang.chhun.hourth	\N	\N	012263407	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-14 07:22:56.164	t	2025-09-15 20:36:37	2025-10-14 07:36:21.42	2025-10-16 07:22:56.164	\N	All	\N	\N	math	44	កំពង់ចាម	\N	\N	\N	t	f	email	leang.chhun.hourth	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
56	CHHOM BORIN	chhom.borin.kam@teacher.tarl.edu.kh	chhom.borin.kam	\N	\N	01212112	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-10-13 07:51:34.2	t	2025-09-15 20:36:50	2025-10-13 08:28:33.1	\N	\N	\N	\N	81	khmer	1	Battambang	Battambang	\N	\N	t	f	email	chhom.borin.kam	f	\N	[]
61	ONN THALIN	onn.thalin.kam@teacher.tarl.edu.kh	onn.thalin.kam	\N	\N	\N	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 08:30:51.374	t	2025-09-15 20:36:51	2025-11-01 08:30:51.374	\N	\N	\N	\N	83	math	31	កំពង់ចាម	កងមាស	\N	\N	t	f	email	onn.thalin.kam	f	\N	"[\\"student_view\\"]"
48	Som Phally	som.phally.bat@teacher.tarl.edu.kh	som.phally.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:48	2025-11-14 03:53:51.008	\N	\N	\N	\N	59	Khmer	\N	Battambang	\N	\N	\N	t	f	email	som.phally.bat	f	\N	"[\\"student_view\\"]"
82	Ms. SEIHA RATANA	seiha.ratana.kam@teacher.tarl.edu.kh	seiha.ratana.kam	\N	\N	060916728	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:33:08.639	t	2025-09-15 20:36:57	2025-11-01 07:39:16.827	\N	\N	\N	\N	78	both	26	កំពង់ចាម	កងមាស	\N	\N	t	f	email	seiha.ratana.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
85	Nheb Channin	.nheb.channin.kam@teacher.tarl.edu.kh	nheb.channin.kam	\N	\N	 010323903	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:25:00.951	t	2025-09-15 20:36:58	2025-11-01 07:32:06.189	\N	\N	\N	\N	76	khmer	24	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nheb.channin.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
59	Neang Spheap	neang.spheap.kam@teacher.tarl.edu.kh	neang.spheap.kam	\N	\N	010522072	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:31:16.788	t	2025-09-15 20:36:51	2025-11-01 07:33:57.373	\N	\N	\N	\N	70	khmer	40	កំពង់ចាម	កងមាស	\N	\N	t	f	email	neang.spheap.kam	f	\N	"[\\"student_view\\"]"
62	Pheap sreynith	pheap.sreynith.kam@teacher.tarl.edu.kh	pheap.sreynith.kam	\N	\N	015793292	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:33:13.304	t	2025-09-15 20:36:52	2025-11-01 07:37:24.31	\N	\N	\N	\N	78	both	26	កំពង់ចាម	កងមាស	\N	\N	t	f	email	pheap.sreynith.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\"]"
4	Deab Chhoeun	deab.chhoeun	deab.chhoeun	\N	\N	092751997	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"plan_visits\\"]"	2025-10-08 10:30:48.079	t	2025-09-15 20:36:36	2025-11-08 15:55:25.624	2025-10-10 10:30:48.079	\N	All	\N	\N	khmer	4	Battambang	Battambang	\N	\N	t	f	email	deab.chhoeun	f	\N	"[\\"student_add\\",\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"mentoring_add\\"]"
50	Soth Thida	soth.thida.bat@teacher.tarl.edu.kh	soth.thida.bat	\N	\N	0979306040	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-12 16:16:50.511	t	2025-09-15 20:36:48	2025-11-12 16:16:50.511	\N	\N	\N	\N	63	math	11	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	soth.thida.bat	f	\N	"[\\"student_view\\"]"
8	Mentor Two	mentor2@prathaminternational.org	mentor2	\N	\N	\N	\N	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:37	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	mentor2	f	\N	[]
5	Heap Sophea	heap.sophea	heap.sophea	\N	\N	0312512717	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:12:41.269	t	2025-09-15 20:36:37	2025-10-13 08:28:33.1	2025-10-10 12:12:41.269	\N	All	\N	\N	math	9	Battambang	Battambang	\N	\N	t	f	email	heap.sophea	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
14	Sorn Sophaneth	sorn.sophaneth	sorn.sophaneth	\N	\N	092 702 882	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:58:39.402	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-10 12:58:39.402	\N	All	\N	\N	math	8	Battambang	Battambang	\N	\N	t	f	email	sorn.sophaneth	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
16	El Kunthea	el.kunthea	el.kunthea	\N	\N	011788573	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-10 09:41:49.709	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-12 09:41:49.709	\N	All	\N	\N	khmer	40	កំពង់ចាម	\N	\N	\N	t	f	email	el.kunthea	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\",\\"student_edit\\",\\"assessment_add\\"]"
1	Kairav Admin	kairav@prathaminternational.org	kairav	\N	\N	\N	\N	\N	admin	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-18 17:08:40.478	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	kairav	f	\N	"[\\"assessment_view\\",\\"report_view\\"]"
29	Khim Kosal	khim.kosal.bat@teacher.tarl.edu.kh	khim.kosal.bat	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:43	2025-10-31 03:22:44.376	\N	\N	\N	\N	59	Khmer	\N	Battambang	\N	\N	\N	t	f	email	khim.kosal.bat	f	\N	"[\\"student_view\\"]"
15	Eam Vichhak Rith	eam.vichhak.rith	eam.vichhak.rith	\N	\N	0976209323	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-17 02:41:23.709	t	2025-09-15 20:36:39	2025-10-18 08:08:32.332	2025-10-19 02:41:23.709	\N	All	\N	\N	khmer	23	Kampong Cham	Kampong Cham	\N	\N	t	f	email	eam.vichhak.rith	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\",\\"assessment_view\\"]"
7	Mentor One	mentor1@prathaminternational.org	mentor1	\N	\N	\N	\N	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"plan_visits\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-09-15 20:36:37	2025-10-30 10:48:01.381	\N	\N	\N	\N	\N	All	6	Battambang	Battambang	\N	\N	t	f	email	mentor1	f	\N	"[\\"mentoring_add\\",\\"assessment_view\\",\\"student_view\\",\\"assessment_add\\"]"
72	Ms. HENG CHHENGKY	heng.chhengky.kam@teacher.tarl.edu.kh	heng.chhengky.kam	\N	\N	097270522	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:42:51.4	t	2025-09-15 20:36:54	2025-11-01 07:42:51.4	\N	\N	\N	\N	83	math	31	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heng.chhengky.kam	f	\N	"[\\"student_view\\"]"
71	Ms. HEAK TOM	heak.tom.kam@teacher.tarl.edu.kh	heak.tom.kam	\N	\N	\N	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 08:28:10.362	t	2025-09-15 20:36:54	2025-11-01 08:28:10.362	\N	\N	\N	\N	81	math	29	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heak.tom.kam	f	\N	[]
57	Hoat Vimol	hoat.vimol.kam@teacher.tarl.edu.kh	hoat.vimol.kam	\N	\N	012828760	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:39:36.191	t	2025-09-15 20:36:50	2025-11-01 07:39:36.191	\N	\N	\N	\N	82	math	30	កំពង់ចាម	កងមាស	\N	\N	t	f	email	hoat.vimol.kam	f	\N	"[\\"student_view\\"]"
81	Ms. Phornd sokThy	phornd.sokthy.kam@teacher.tarl.edu.kh	phornd.sokthy.kam	\N	\N	966906676	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:34:42.297	t	2025-09-15 20:36:57	2025-11-01 07:34:42.297	\N	\N	\N	\N	72	khmer	20	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phornd.sokthy.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\"]"
69	Ms. Chan Kimsrorn	chan.kimsrorn.kam@teacher.tarl.edu.kh	chan.kimsrorn.kam	\N	\N	011112233	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-05 07:26:18.494	t	2025-09-15 20:36:54	2025-11-01 07:30:27.045	\N	\N	\N	\N	77	both	25	Kampong Cham	Kampong Cham	\N	\N	t	f	email	chan.kimsrorn.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\",\\"student_edit\\"]"
63	Phoeurn Virath	phoeurn.virath.kam@teacher.tarl.edu.kh	phoeurn.virath.kam	\N	\N	0976166211	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:23:57.82	t	2025-09-15 20:36:52	2025-11-01 07:31:37.016	\N	\N	\N	\N	74	khmer	22	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phoeurn.virath.kam	f	\N	[]
65	Say Kamsath	say.kamsath.kam@teacher.tarl.edu.kh	say.kamsath.kam	\N	\N	093608648	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:37:18.665	t	2025-09-15 20:36:53	2025-11-14 08:02:22.432	\N	\N	\N	\N	71	both	19	កំពង់ចាម	កងមាស	\N	\N	t	f	email	say.kamsath.kam	f	\N	"[\\"student_view\\",\\"student_edit\\"]"
73	Ms. Heng Navy	heng.navy.kam@teacher.tarl.edu.kh	heng.navy.kam	\N	\N	0969705169	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:35:09.707	t	2025-09-15 20:36:55	2025-11-01 07:35:09.707	\N	\N	\N	\N	79	math	45	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heng.navy.kam	f	\N	"[\\"student_view\\"]"
54	Chea Putthyda	chea.putthyda.kam@teacher.tarl.edu.kh	chea.putthyda.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:50	2025-11-01 07:41:34.087	\N	\N	\N	\N	69	Maths	2	Kampong Cham	\N	\N	\N	t	f	email	chea.putthyda.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
67	Sum Chek	sum.chek.kam@teacher.tarl.edu.kh	sum.chek.kam	\N	\N	0977660039	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:39:03.968	t	2025-09-15 20:36:53	2025-11-01 07:39:46.798	\N	\N	\N	\N	75	khmer	23	កំពង់ចាម	កងមាស	\N	\N	t	f	email	sum.chek.kam	f	\N	"[\\"student_view\\"]"
64	Phuong Pheap	phuong.pheap.kam@teacher.tarl.edu.kh	phuong.pheap.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:52	2025-11-01 08:34:12.796	\N	\N	\N	\N	77	Khmer	\N	Kampong Cham	\N	\N	\N	t	f	email	phuong.pheap.kam	f	\N	"[\\"student_view\\"]"
76	Ms. Mach Serynak	mach.serynak.kam@teacher.tarl.edu.kh	mach.serynak.kam	\N	\N	0975393392	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\"]"	\N	t	2025-09-15 20:36:56	2025-11-12 01:51:56.89	\N	\N	\N	\N	75	khmer	23	កំពង់ចាម	កងមាស	\N	\N	t	f	email	mach.serynak.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\"]"
75	Ms. HIM SOKHALEAP	him.sokhaleap.kam@teacher.tarl.edu.kh	him.sokhaleap.kam	\N	\N	86323116	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:31:23.456	t	2025-09-15 20:36:55	2025-11-01 07:32:03.848	\N	\N	\N	\N	80	math	28	កំពង់ចាម	កងមាស	\N	\N	t	f	email	him.sokhaleap.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\"]"
66	SORM VANNAK	sorm.vannak.kam@teacher.tarl.edu.kh	sorm.vannak.kam	\N	\N	0962447805	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:28:41.911	t	2025-09-15 20:36:53	2025-11-12 06:54:36.678	\N	\N	\N	\N	73	khmer	21	កំពង់ចាម	កងមាស	\N	\N	t	f	email	sorm.vannak.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\"]"
113	Phal Sophea	phal_sophea@tarl.local	phal_sophea	\N	\N	016208382	\N	\N	teacher	\N	$2b$12$r3o7Mx/hAw/zT27LiD8D3uBWd./nH6rOVpjRvQflpBPhn/FPrZNYa	\N	\N	\N	t	2025-11-06 09:17:30.657	2025-11-12 14:06:13.855	\N	\N	\N	\N	\N	គណិតវិទ្យា	16	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\"]"
107	Chhinh Sovath	chhinh_sovath@tarl.local	chhinh_sovath	\N	\N	077806680	\N	\N	teacher	\N	$2b$12$ZP8PY3EVm7Cp/WPscW1L2.ZYUcTbhBpkGJ8chYIApYkuRtCUnJtV6	\N	\N	\N	t	2025-11-06 08:23:56.579	2025-11-06 08:23:56.579	\N	\N	\N	\N	\N	ភាសាខ្មែរ	41	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	\N
108	sovath sovath	sovath_sovath@tarl.local	sovath_sovath	\N	\N	016665544	\N	\N	teacher	\N	$2b$12$m.mxLYYi9shDinXPTllkfex6G59WgZLOOcopzd9HJxUeyjJtLQo1C	\N	\N	\N	t	2025-11-06 08:57:51.162	2025-11-06 08:57:51.162	\N	\N	\N	\N	\N	ភាសាខ្មែរ	6	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	\N
68	Teour phanna	teour.phanna.kam@teacher.tarl.edu.kh	teour.phanna.kam	\N	\N	093423567	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:38:35.34	t	2025-09-15 20:36:53	2025-11-01 07:42:07.755	\N	\N	\N	\N	72	khmer	20	កំពង់ចាម	កងមាស	\N	\N	t	f	email	teour.phanna.kam	f	\N	"[\\"student_view\\"]"
104	HENGCHHENGkY	HENGCHHENGkY@quick.login	HENGCHHENGkY	\N	\N	0972705229	grade_4	\N	teacher	\N	$2b$10$dLP39Xhju7HZXAqISzQKue9IYca.JCQ5GrsQo04yiOZz/r2pGwNQS	\N	\N	\N	t	2025-11-01 08:00:00.32	2025-11-01 08:02:20.801	\N	\N	\N	\N	\N	math	31	កំពង់ចាម	កងមាស	\N	\N	t	f	username	HENGCHHENGkY	f	\N	\N
109	Orn Veasna	orn_veasna@tarl.local	orn_veasna	\N	\N	0967838282	\N	\N	teacher	\N	$2b$12$uWyiGxt5kdaLHVRQ4yO8XurFMI.WJn4LPWrzFFixDg7N3aihwDIaW	\N	\N	\N	t	2025-11-06 09:10:09.556	2025-11-06 09:10:09.556	\N	\N	\N	\N	\N	គណិតវិទ្យា	1	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	\N
110	Sak Sopheap	sak_sopheap@tarl.local	sak_sopheap	\N	\N	078470074	\N	\N	teacher	\N	$2b$12$SqmNyEXsdtI95J29ZC/Aq.HYyhgmMeZFmZ/KmqyGk3ojmbkBF6jI.	\N	\N	\N	t	2025-11-06 09:11:28.303	2025-11-06 09:11:28.303	\N	\N	\N	\N	\N	ភាសាខ្មែរ	6	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	\N
70	Ms. Hort Kunthea	chhorn.srey.pov.kam@teacher.tarl.edu.kh	chhorn.srey.pov.kam	\N	\N	0884877577	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:36:46.829	t	2025-09-15 20:36:54	2025-11-01 08:25:46.357	\N	\N	\N	\N	79	math	45	កំពង់ចាម	កងមាស	\N	\N	t	f	email	chhorn.srey.pov.kam	f	\N	[]
10	Em Rithy	em.rithy	em.rithy	\N	\N	098740793	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"plan_visits\\"]"	2025-10-10 01:21:33.405	t	2025-09-15 20:36:38	2025-11-05 05:53:58.871	2025-10-12 01:21:33.405	\N	All	\N	\N	khmer	37	បាត់ដំបង	\N	\N	\N	t	f	email	em.rithy	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"mentoring_add\\"]"
106	Seng Orn	sengorn@gmail.com	sengorn	\N	\N	011112233	\N	\N	teacher	\N	$2b$12$KPFNmOyxGBa49rn3q4CJzem2dGWSDwg5XneTVCyqPlHC2ZK6dEi.m	\N	\N	\N	t	2025-11-06 05:01:07.678	2025-11-06 05:01:07.678	\N	\N	\N	\N	\N	គណិតវិទ្យា	\N	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	\N
112	Roeum Pirann	roeum_pirann@tarl.local	roeum_pirann	\N	\N	081256096	\N	\N	teacher	\N	$2b$12$jT3q3BpcqF0bAnCzogKnRe39nEcF97emJYipSFpv9cyUFlA21Ivq2	\N	\N	\N	t	2025-11-06 09:15:28.656	2025-11-06 09:15:28.656	\N	\N	\N	\N	\N	គណិតវិទ្យា	12	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	\N
114	Seng Tola	seng_tola@tarl.local	seng_tola	\N	\N	0969858281	\N	\N	teacher	\N	$2b$12$kKM6vdt4f2zXRfNlvbUhy.fZxi8x1VLXjuWXH8NOggQvk7r63J.u.	\N	\N	\N	t	2025-11-06 09:18:37.792	2025-11-06 09:18:37.792	\N	\N	\N	\N	\N	គណិតវិទ្យា	16	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	\N
116	Kong Vengkorng	kong_vengkorng@tarl.local	kong_vengkorng	\N	\N	0714499649	\N	\N	teacher	\N	$2b$12$6aU/NlxpzPMWAGOTWegQ7.TTqbZHvzNeHNQVzisH4FdQoucVlAoGq	\N	\N	\N	t	2025-11-06 09:22:45.658	2025-11-06 09:22:45.658	\N	\N	\N	\N	\N	គណិតវិទ្យា	31	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	\N
115	Hak Leng	hak_leng@tarl.local	hak_leng	\N	\N	0964158937	\N	\N	teacher	\N	$2b$12$4kQ85M2EMdx5ZkZv6jLsj.fBsOhSpppDbiOJW4ZMthc43LD8.PCUG	\N	\N	\N	t	2025-11-06 09:20:19.521	2025-11-08 09:36:23.825	\N	\N	\N	\N	\N	ភាសាខ្មែរ	21	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\"]"
105	Hort Kunthea	HortKunthea@gmail.com	HortKunthea	\N	\N	admin123	\N	\N	teacher	\N	$2b$12$MwhVAYdZELbYUnilZ/vOreNkspMjrWNmPvKxnKoD.ehsJT9.RWKuW	\N	"[\\"track_progress\\"]"	\N	t	2025-11-06 04:41:36.435	2025-11-08 15:36:31.583	\N	\N	\N	\N	\N	ភាសាខ្មែរ	\N	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	"[\\"report_view\\",\\"student_view\\",\\"assessment_view\\"]"
111	Nin Phearompomnita	nin_phearompomnita@tarl.local	nin_phearompomnita	\N	\N	0882434682	\N	\N	teacher	\N	$2b$12$QUxfjvV.3qAARO4aJW6zJutj.NqPlbygmHFFFI4sW8A8juVF6qxbu	\N	\N	\N	t	2025-11-06 09:13:17.953	2025-11-10 13:58:55.386	\N	\N	\N	\N	\N	ភាសាខ្មែរ	7	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\"]"
34	Ny Cheanichniron	ny.cheanichniron.bat@teacher.tarl.edu.kh	ny.cheanichniron.bat	\N	\N	069376534	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-13 09:24:52.536	t	2025-09-15 20:36:44	2025-11-13 09:24:52.536	\N	\N	\N	\N	60	khmer	8	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ny.cheanichniron.bat	f	\N	"[\\"student_view\\"]"
60	Nov Barang	nov.barang.kam@teacher.tarl.edu.kh	nov.barang.kam	\N	\N	0886743726	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:31:37.281	t	2025-09-15 20:36:51	2025-11-14 09:06:42.926	\N	\N	\N	\N	84	math	44	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nov.barang.kam	f	\N	"[\\"student_view\\",\\"report_view\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\"]"
\.


--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 216
-- Name: assessment_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessment_histories_id_seq', 26, true);


--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_locks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessment_locks_id_seq', 1, false);


--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 220
-- Name: assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessments_id_seq', 494, true);


--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 222
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 1, false);


--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 224
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 226
-- Name: bulk_imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bulk_imports_id_seq', 1, false);


--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 228
-- Name: clusters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clusters_id_seq', 1, false);


--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 275
-- Name: dashboard_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dashboard_stats_id_seq', 3, true);


--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 230
-- Name: intervention_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.intervention_programs_id_seq', 1, false);


--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 232
-- Name: ip_whitelist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ip_whitelist_id_seq', 1, false);


--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 234
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mentor_school_assignments_id_seq', 49, true);


--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 236
-- Name: mentoring_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mentoring_visits_id_seq', 5, true);


--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 238
-- Name: pilot_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pilot_schools_id_seq', 24, true);


--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 240
-- Name: progress_trackings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_trackings_id_seq', 1, false);


--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 242
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, false);


--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 244
-- Name: quick_login_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quick_login_users_id_seq', 95, true);


--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 246
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rate_limits_id_seq', 1, false);


--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 248
-- Name: report_exports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.report_exports_id_seq', 1, false);


--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 250
-- Name: resource_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resource_views_id_seq', 1, false);


--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 252
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resources_id_seq', 1, false);


--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 254
-- Name: school_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.school_classes_id_seq', 1, false);


--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 256
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 1, false);


--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 258
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 260
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_assessment_eligibilities_id_seq', 1, false);


--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 262
-- Name: student_interventions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_interventions_id_seq', 1, false);


--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 264
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_id_seq', 560, true);


--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 266
-- Name: teacher_school_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teacher_school_assignments_id_seq', 73, true);


--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 268
-- Name: teaching_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teaching_activities_id_seq', 1, false);


--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 271
-- Name: user_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_schools_id_seq', 1, false);


--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 274
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 116, true);


--
-- TOC entry 3529 (class 2606 OID 16694)
-- Name: assessment_histories assessment_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 3533 (class 2606 OID 16696)
-- Name: assessment_locks assessment_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_pkey PRIMARY KEY (id);


--
-- TOC entry 3541 (class 2606 OID 16698)
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- TOC entry 3549 (class 2606 OID 16700)
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 3555 (class 2606 OID 16702)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3563 (class 2606 OID 16704)
-- Name: bulk_imports bulk_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports
    ADD CONSTRAINT bulk_imports_pkey PRIMARY KEY (id);


--
-- TOC entry 3567 (class 2606 OID 16706)
-- Name: clusters clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- TOC entry 3708 (class 2606 OID 17020)
-- Name: dashboard_stats dashboard_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats
    ADD CONSTRAINT dashboard_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 3569 (class 2606 OID 16708)
-- Name: intervention_programs intervention_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs
    ADD CONSTRAINT intervention_programs_pkey PRIMARY KEY (id);


--
-- TOC entry 3574 (class 2606 OID 16710)
-- Name: ip_whitelist ip_whitelist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist
    ADD CONSTRAINT ip_whitelist_pkey PRIMARY KEY (id);


--
-- TOC entry 3578 (class 2606 OID 16712)
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_pilot_school_id_subject_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_pilot_school_id_subject_key UNIQUE (mentor_id, pilot_school_id, subject);


--
-- TOC entry 3581 (class 2606 OID 16714)
-- Name: mentor_school_assignments mentor_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3588 (class 2606 OID 16716)
-- Name: mentoring_visits mentoring_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pkey PRIMARY KEY (id);


--
-- TOC entry 3602 (class 2606 OID 16718)
-- Name: pilot_schools pilot_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools
    ADD CONSTRAINT pilot_schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3607 (class 2606 OID 16720)
-- Name: progress_trackings progress_trackings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings
    ADD CONSTRAINT progress_trackings_pkey PRIMARY KEY (id);


--
-- TOC entry 3612 (class 2606 OID 16722)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 3614 (class 2606 OID 16724)
-- Name: quick_login_users quick_login_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users
    ADD CONSTRAINT quick_login_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3622 (class 2606 OID 16726)
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- TOC entry 3625 (class 2606 OID 16728)
-- Name: report_exports report_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_pkey PRIMARY KEY (id);


--
-- TOC entry 3629 (class 2606 OID 16730)
-- Name: resource_views resource_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views
    ADD CONSTRAINT resource_views_pkey PRIMARY KEY (id);


--
-- TOC entry 3634 (class 2606 OID 16732)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3637 (class 2606 OID 16734)
-- Name: school_classes school_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_pkey PRIMARY KEY (id);


--
-- TOC entry 3642 (class 2606 OID 16736)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3647 (class 2606 OID 16738)
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3649 (class 2606 OID 16740)
-- Name: student_assessment_eligibilities student_assessment_eligibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_pkey PRIMARY KEY (id);


--
-- TOC entry 3654 (class 2606 OID 16742)
-- Name: student_interventions student_interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_pkey PRIMARY KEY (id);


--
-- TOC entry 3661 (class 2606 OID 16744)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 3669 (class 2606 OID 16746)
-- Name: teacher_school_assignments teacher_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3675 (class 2606 OID 16748)
-- Name: teaching_activities teaching_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 3679 (class 2606 OID 16750)
-- Name: test_sessions test_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_sessions
    ADD CONSTRAINT test_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 16752)
-- Name: user_schools user_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools
    ADD CONSTRAINT user_schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3693 (class 2606 OID 16754)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3699 (class 2606 OID 16756)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3703 (class 2606 OID 16758)
-- Name: users users_username_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_login_key UNIQUE (username_login);


--
-- TOC entry 3527 (class 1259 OID 16759)
-- Name: assessment_histories_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_histories_assessment_id_idx ON public.assessment_histories USING btree (assessment_id);


--
-- TOC entry 3530 (class 1259 OID 16760)
-- Name: assessment_locks_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_locks_assessment_id_idx ON public.assessment_locks USING btree (assessment_id);


--
-- TOC entry 3531 (class 1259 OID 16761)
-- Name: assessment_locks_assessment_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_locks_assessment_id_key ON public.assessment_locks USING btree (assessment_id);


--
-- TOC entry 3534 (class 1259 OID 16762)
-- Name: assessments_assessed_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_by_mentor_idx ON public.assessments USING btree (assessed_by_mentor);


--
-- TOC entry 3535 (class 1259 OID 16763)
-- Name: assessments_assessed_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_date_idx ON public.assessments USING btree (assessed_date);


--
-- TOC entry 3536 (class 1259 OID 16764)
-- Name: assessments_assessment_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessment_type_idx ON public.assessments USING btree (assessment_type);


--
-- TOC entry 3537 (class 1259 OID 16765)
-- Name: assessments_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_locked_idx ON public.assessments USING btree (is_locked);


--
-- TOC entry 3538 (class 1259 OID 16766)
-- Name: assessments_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_temporary_idx ON public.assessments USING btree (is_temporary);


--
-- TOC entry 3539 (class 1259 OID 16767)
-- Name: assessments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_pilot_school_id_idx ON public.assessments USING btree (pilot_school_id);


--
-- TOC entry 3542 (class 1259 OID 16768)
-- Name: assessments_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_record_status_idx ON public.assessments USING btree (record_status);


--
-- TOC entry 3543 (class 1259 OID 16769)
-- Name: assessments_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_student_id_idx ON public.assessments USING btree (student_id);


--
-- TOC entry 3544 (class 1259 OID 16770)
-- Name: assessments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_subject_idx ON public.assessments USING btree (subject);


--
-- TOC entry 3545 (class 1259 OID 16771)
-- Name: assessments_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_test_session_id_idx ON public.assessments USING btree (test_session_id);


--
-- TOC entry 3546 (class 1259 OID 16772)
-- Name: assessments_verified_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_verified_by_id_idx ON public.assessments USING btree (verified_by_id);


--
-- TOC entry 3547 (class 1259 OID 16773)
-- Name: attendance_records_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_date_idx ON public.attendance_records USING btree (date);


--
-- TOC entry 3550 (class 1259 OID 16774)
-- Name: attendance_records_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_student_id_idx ON public.attendance_records USING btree (student_id);


--
-- TOC entry 3551 (class 1259 OID 16775)
-- Name: attendance_records_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_teacher_id_idx ON public.attendance_records USING btree (teacher_id);


--
-- TOC entry 3552 (class 1259 OID 16776)
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- TOC entry 3553 (class 1259 OID 16777)
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- TOC entry 3556 (class 1259 OID 16778)
-- Name: audit_logs_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_id_idx ON public.audit_logs USING btree (resource_id);


--
-- TOC entry 3557 (class 1259 OID 16779)
-- Name: audit_logs_resource_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_type_idx ON public.audit_logs USING btree (resource_type);


--
-- TOC entry 3558 (class 1259 OID 16780)
-- Name: audit_logs_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_status_idx ON public.audit_logs USING btree (status);


--
-- TOC entry 3559 (class 1259 OID 16781)
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- TOC entry 3560 (class 1259 OID 16782)
-- Name: audit_logs_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_role_idx ON public.audit_logs USING btree (user_role);


--
-- TOC entry 3561 (class 1259 OID 16783)
-- Name: bulk_imports_import_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_import_type_idx ON public.bulk_imports USING btree (import_type);


--
-- TOC entry 3564 (class 1259 OID 16784)
-- Name: bulk_imports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_status_idx ON public.bulk_imports USING btree (status);


--
-- TOC entry 3565 (class 1259 OID 16785)
-- Name: clusters_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX clusters_code_key ON public.clusters USING btree (code);


--
-- TOC entry 3704 (class 1259 OID 17022)
-- Name: dashboard_stats_cache_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_cache_key_idx ON public.dashboard_stats USING btree (cache_key);


--
-- TOC entry 3705 (class 1259 OID 17021)
-- Name: dashboard_stats_cache_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboard_stats_cache_key_key ON public.dashboard_stats USING btree (cache_key);


--
-- TOC entry 3706 (class 1259 OID 17025)
-- Name: dashboard_stats_last_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_last_updated_idx ON public.dashboard_stats USING btree (last_updated);


--
-- TOC entry 3709 (class 1259 OID 17023)
-- Name: dashboard_stats_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_role_idx ON public.dashboard_stats USING btree (role);


--
-- TOC entry 3710 (class 1259 OID 17024)
-- Name: dashboard_stats_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_user_id_idx ON public.dashboard_stats USING btree (user_id);


--
-- TOC entry 3570 (class 1259 OID 16786)
-- Name: ip_whitelist_ip_address_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_ip_address_idx ON public.ip_whitelist USING btree (ip_address);


--
-- TOC entry 3571 (class 1259 OID 16787)
-- Name: ip_whitelist_ip_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ip_whitelist_ip_address_key ON public.ip_whitelist USING btree (ip_address);


--
-- TOC entry 3572 (class 1259 OID 16788)
-- Name: ip_whitelist_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_is_active_idx ON public.ip_whitelist USING btree (is_active);


--
-- TOC entry 3575 (class 1259 OID 16789)
-- Name: mentor_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_is_active_idx ON public.mentor_school_assignments USING btree (is_active);


--
-- TOC entry 3576 (class 1259 OID 16790)
-- Name: mentor_school_assignments_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_mentor_id_idx ON public.mentor_school_assignments USING btree (mentor_id);


--
-- TOC entry 3579 (class 1259 OID 16791)
-- Name: mentor_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_pilot_school_id_idx ON public.mentor_school_assignments USING btree (pilot_school_id);


--
-- TOC entry 3582 (class 1259 OID 16792)
-- Name: mentor_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_subject_idx ON public.mentor_school_assignments USING btree (subject);


--
-- TOC entry 3583 (class 1259 OID 16793)
-- Name: mentoring_visits_class_in_session_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_class_in_session_idx ON public.mentoring_visits USING btree (class_in_session);


--
-- TOC entry 3584 (class 1259 OID 16794)
-- Name: mentoring_visits_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_is_locked_idx ON public.mentoring_visits USING btree (is_locked);


--
-- TOC entry 3585 (class 1259 OID 16795)
-- Name: mentoring_visits_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_mentor_id_idx ON public.mentoring_visits USING btree (mentor_id);


--
-- TOC entry 3586 (class 1259 OID 16796)
-- Name: mentoring_visits_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_pilot_school_id_idx ON public.mentoring_visits USING btree (pilot_school_id);


--
-- TOC entry 3589 (class 1259 OID 16797)
-- Name: mentoring_visits_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_record_status_idx ON public.mentoring_visits USING btree (record_status);


--
-- TOC entry 3590 (class 1259 OID 16798)
-- Name: mentoring_visits_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_school_id_idx ON public.mentoring_visits USING btree (school_id);


--
-- TOC entry 3591 (class 1259 OID 16799)
-- Name: mentoring_visits_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_status_idx ON public.mentoring_visits USING btree (status);


--
-- TOC entry 3592 (class 1259 OID 16800)
-- Name: mentoring_visits_subject_observed_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_subject_observed_idx ON public.mentoring_visits USING btree (subject_observed);


--
-- TOC entry 3593 (class 1259 OID 16801)
-- Name: mentoring_visits_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_teacher_id_idx ON public.mentoring_visits USING btree (teacher_id);


--
-- TOC entry 3594 (class 1259 OID 16802)
-- Name: mentoring_visits_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_test_session_id_idx ON public.mentoring_visits USING btree (test_session_id);


--
-- TOC entry 3595 (class 1259 OID 16803)
-- Name: mentoring_visits_visit_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_visit_date_idx ON public.mentoring_visits USING btree (visit_date);


--
-- TOC entry 3596 (class 1259 OID 16804)
-- Name: pilot_schools_baseline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_baseline_start_date_idx ON public.pilot_schools USING btree (baseline_start_date);


--
-- TOC entry 3597 (class 1259 OID 16805)
-- Name: pilot_schools_cluster_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_cluster_idx ON public.pilot_schools USING btree (cluster);


--
-- TOC entry 3598 (class 1259 OID 16806)
-- Name: pilot_schools_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_district_idx ON public.pilot_schools USING btree (district);


--
-- TOC entry 3599 (class 1259 OID 16807)
-- Name: pilot_schools_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_is_locked_idx ON public.pilot_schools USING btree (is_locked);


--
-- TOC entry 3600 (class 1259 OID 16808)
-- Name: pilot_schools_midline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_midline_start_date_idx ON public.pilot_schools USING btree (midline_start_date);


--
-- TOC entry 3603 (class 1259 OID 16809)
-- Name: pilot_schools_province_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_province_idx ON public.pilot_schools USING btree (province);


--
-- TOC entry 3604 (class 1259 OID 16810)
-- Name: pilot_schools_school_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_school_code_idx ON public.pilot_schools USING btree (school_code);


--
-- TOC entry 3605 (class 1259 OID 16811)
-- Name: pilot_schools_school_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pilot_schools_school_code_key ON public.pilot_schools USING btree (school_code);


--
-- TOC entry 3608 (class 1259 OID 16812)
-- Name: progress_trackings_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_student_id_idx ON public.progress_trackings USING btree (student_id);


--
-- TOC entry 3609 (class 1259 OID 16813)
-- Name: progress_trackings_tracking_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_tracking_date_idx ON public.progress_trackings USING btree (tracking_date);


--
-- TOC entry 3610 (class 1259 OID 16814)
-- Name: provinces_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX provinces_code_key ON public.provinces USING btree (code);


--
-- TOC entry 3615 (class 1259 OID 16815)
-- Name: quick_login_users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quick_login_users_username_idx ON public.quick_login_users USING btree (username);


--
-- TOC entry 3616 (class 1259 OID 16816)
-- Name: quick_login_users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quick_login_users_username_key ON public.quick_login_users USING btree (username);


--
-- TOC entry 3617 (class 1259 OID 16817)
-- Name: rate_limits_blocked_until_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_blocked_until_idx ON public.rate_limits USING btree (blocked_until);


--
-- TOC entry 3618 (class 1259 OID 16818)
-- Name: rate_limits_endpoint_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_endpoint_idx ON public.rate_limits USING btree (endpoint);


--
-- TOC entry 3619 (class 1259 OID 16819)
-- Name: rate_limits_identifier_endpoint_window_start_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rate_limits_identifier_endpoint_window_start_key ON public.rate_limits USING btree (identifier, endpoint, window_start);


--
-- TOC entry 3620 (class 1259 OID 16820)
-- Name: rate_limits_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_identifier_idx ON public.rate_limits USING btree (identifier);


--
-- TOC entry 3623 (class 1259 OID 16821)
-- Name: rate_limits_window_start_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_window_start_idx ON public.rate_limits USING btree (window_start);


--
-- TOC entry 3626 (class 1259 OID 16822)
-- Name: report_exports_report_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_report_type_idx ON public.report_exports USING btree (report_type);


--
-- TOC entry 3627 (class 1259 OID 16823)
-- Name: report_exports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_status_idx ON public.report_exports USING btree (status);


--
-- TOC entry 3630 (class 1259 OID 16824)
-- Name: resource_views_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_resource_id_idx ON public.resource_views USING btree (resource_id);


--
-- TOC entry 3631 (class 1259 OID 16825)
-- Name: resource_views_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_user_id_idx ON public.resource_views USING btree (user_id);


--
-- TOC entry 3632 (class 1259 OID 16826)
-- Name: resources_is_public_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_is_public_idx ON public.resources USING btree (is_public);


--
-- TOC entry 3635 (class 1259 OID 16827)
-- Name: resources_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_type_idx ON public.resources USING btree (type);


--
-- TOC entry 3638 (class 1259 OID 16828)
-- Name: school_classes_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX school_classes_school_id_idx ON public.school_classes USING btree (school_id);


--
-- TOC entry 3639 (class 1259 OID 16829)
-- Name: schools_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_code_idx ON public.schools USING btree (code);


--
-- TOC entry 3640 (class 1259 OID 16830)
-- Name: schools_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schools_code_key ON public.schools USING btree (code);


--
-- TOC entry 3643 (class 1259 OID 16831)
-- Name: schools_province_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_province_id_idx ON public.schools USING btree (province_id);


--
-- TOC entry 3644 (class 1259 OID 16832)
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- TOC entry 3645 (class 1259 OID 16833)
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- TOC entry 3650 (class 1259 OID 16834)
-- Name: student_assessment_eligibilities_student_id_assessment_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_assessment_eligibilities_student_id_assessment_type_key ON public.student_assessment_eligibilities USING btree (student_id, assessment_type);


--
-- TOC entry 3651 (class 1259 OID 16835)
-- Name: student_assessment_eligibilities_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_assessment_eligibilities_student_id_idx ON public.student_assessment_eligibilities USING btree (student_id);


--
-- TOC entry 3652 (class 1259 OID 16836)
-- Name: student_interventions_intervention_program_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_intervention_program_id_idx ON public.student_interventions USING btree (intervention_program_id);


--
-- TOC entry 3655 (class 1259 OID 16837)
-- Name: student_interventions_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_student_id_idx ON public.student_interventions USING btree (student_id);


--
-- TOC entry 3656 (class 1259 OID 16838)
-- Name: students_added_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_id_idx ON public.students USING btree (added_by_id);


--
-- TOC entry 3657 (class 1259 OID 16839)
-- Name: students_added_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_mentor_idx ON public.students USING btree (added_by_mentor);


--
-- TOC entry 3658 (class 1259 OID 16840)
-- Name: students_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_is_temporary_idx ON public.students USING btree (is_temporary);


--
-- TOC entry 3659 (class 1259 OID 16841)
-- Name: students_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_pilot_school_id_idx ON public.students USING btree (pilot_school_id);


--
-- TOC entry 3662 (class 1259 OID 16842)
-- Name: students_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_record_status_idx ON public.students USING btree (record_status);


--
-- TOC entry 3663 (class 1259 OID 16843)
-- Name: students_school_class_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_school_class_id_idx ON public.students USING btree (school_class_id);


--
-- TOC entry 3664 (class 1259 OID 16844)
-- Name: students_student_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);


--
-- TOC entry 3665 (class 1259 OID 16845)
-- Name: students_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_test_session_id_idx ON public.students USING btree (test_session_id);


--
-- TOC entry 3666 (class 1259 OID 16846)
-- Name: teacher_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_is_active_idx ON public.teacher_school_assignments USING btree (is_active);


--
-- TOC entry 3667 (class 1259 OID 16847)
-- Name: teacher_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_pilot_school_id_idx ON public.teacher_school_assignments USING btree (pilot_school_id);


--
-- TOC entry 3670 (class 1259 OID 16848)
-- Name: teacher_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_subject_idx ON public.teacher_school_assignments USING btree (subject);


--
-- TOC entry 3671 (class 1259 OID 16849)
-- Name: teacher_school_assignments_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teacher_school_assignments_teacher_id_idx ON public.teacher_school_assignments USING btree (teacher_id);


--
-- TOC entry 3672 (class 1259 OID 16850)
-- Name: teacher_school_assignments_teacher_id_pilot_school_id_subje_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX teacher_school_assignments_teacher_id_pilot_school_id_subje_key ON public.teacher_school_assignments USING btree (teacher_id, pilot_school_id, subject);


--
-- TOC entry 3673 (class 1259 OID 16851)
-- Name: teaching_activities_activity_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_activity_date_idx ON public.teaching_activities USING btree (activity_date);


--
-- TOC entry 3676 (class 1259 OID 16852)
-- Name: teaching_activities_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_teacher_id_idx ON public.teaching_activities USING btree (teacher_id);


--
-- TOC entry 3677 (class 1259 OID 16853)
-- Name: test_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_expires_at_idx ON public.test_sessions USING btree (expires_at);


--
-- TOC entry 3680 (class 1259 OID 16854)
-- Name: test_sessions_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_status_idx ON public.test_sessions USING btree (status);


--
-- TOC entry 3681 (class 1259 OID 16855)
-- Name: test_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_id_idx ON public.test_sessions USING btree (user_id);


--
-- TOC entry 3682 (class 1259 OID 16856)
-- Name: test_sessions_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_role_idx ON public.test_sessions USING btree (user_role);


--
-- TOC entry 3685 (class 1259 OID 16857)
-- Name: user_schools_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_school_id_idx ON public.user_schools USING btree (school_id);


--
-- TOC entry 3686 (class 1259 OID 16858)
-- Name: user_schools_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_user_id_idx ON public.user_schools USING btree (user_id);


--
-- TOC entry 3687 (class 1259 OID 16859)
-- Name: user_schools_user_id_pilot_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_pilot_school_id_key ON public.user_schools USING btree (user_id, pilot_school_id);


--
-- TOC entry 3688 (class 1259 OID 16860)
-- Name: user_schools_user_id_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_school_id_key ON public.user_schools USING btree (user_id, school_id);


--
-- TOC entry 3689 (class 1259 OID 16861)
-- Name: user_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_expires_at_idx ON public.user_sessions USING btree (expires_at);


--
-- TOC entry 3690 (class 1259 OID 16862)
-- Name: user_sessions_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_is_active_idx ON public.user_sessions USING btree (is_active);


--
-- TOC entry 3691 (class 1259 OID 16863)
-- Name: user_sessions_last_activity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_last_activity_idx ON public.user_sessions USING btree (last_activity);


--
-- TOC entry 3694 (class 1259 OID 16864)
-- Name: user_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_user_id_idx ON public.user_sessions USING btree (user_id);


--
-- TOC entry 3695 (class 1259 OID 16865)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3696 (class 1259 OID 16866)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3697 (class 1259 OID 16867)
-- Name: users_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_pilot_school_id_idx ON public.users USING btree (pilot_school_id);


--
-- TOC entry 3700 (class 1259 OID 16868)
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- TOC entry 3701 (class 1259 OID 16869)
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- TOC entry 3711 (class 2606 OID 16870)
-- Name: assessment_histories assessment_histories_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3712 (class 2606 OID 16875)
-- Name: assessment_locks assessment_locks_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3713 (class 2606 OID 16880)
-- Name: assessments assessments_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3714 (class 2606 OID 16885)
-- Name: assessments assessments_locked_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_locked_by_id_fkey FOREIGN KEY (locked_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3715 (class 2606 OID 16890)
-- Name: assessments assessments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3716 (class 2606 OID 16895)
-- Name: assessments assessments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3717 (class 2606 OID 16900)
-- Name: assessments assessments_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3718 (class 2606 OID 16905)
-- Name: attendance_records attendance_records_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3719 (class 2606 OID 16910)
-- Name: mentor_school_assignments mentor_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3720 (class 2606 OID 16915)
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3721 (class 2606 OID 16920)
-- Name: mentor_school_assignments mentor_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3722 (class 2606 OID 16925)
-- Name: mentoring_visits mentoring_visits_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3723 (class 2606 OID 16930)
-- Name: mentoring_visits mentoring_visits_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3724 (class 2606 OID 16935)
-- Name: school_classes school_classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3725 (class 2606 OID 16940)
-- Name: schools schools_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3726 (class 2606 OID 16945)
-- Name: student_assessment_eligibilities student_assessment_eligibilities_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3727 (class 2606 OID 16950)
-- Name: student_interventions student_interventions_intervention_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_intervention_program_id_fkey FOREIGN KEY (intervention_program_id) REFERENCES public.intervention_programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3728 (class 2606 OID 16955)
-- Name: student_interventions student_interventions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3729 (class 2606 OID 16960)
-- Name: students students_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3730 (class 2606 OID 16965)
-- Name: students students_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3731 (class 2606 OID 16970)
-- Name: students students_school_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_school_class_id_fkey FOREIGN KEY (school_class_id) REFERENCES public.school_classes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3732 (class 2606 OID 16975)
-- Name: teacher_school_assignments teacher_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3733 (class 2606 OID 16980)
-- Name: teacher_school_assignments teacher_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3734 (class 2606 OID 16985)
-- Name: teacher_school_assignments teacher_school_assignments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teacher_school_assignments
    ADD CONSTRAINT teacher_school_assignments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3735 (class 2606 OID 16990)
-- Name: teaching_activities teaching_activities_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3736 (class 2606 OID 16995)
-- Name: users users_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-11-15 10:33:23 +07

--
-- PostgreSQL database dump complete
--

\unrestrict eGhu2LpG6KcjzcD9n9iiepYhrYf6hDaJXxOkxauRQ1D7nymrCviocOUQgPA1Ri4

