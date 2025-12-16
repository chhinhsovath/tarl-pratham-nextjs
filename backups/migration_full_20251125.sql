--
-- PostgreSQL database dump
--

\restrict eX44hbAOds8soTBtJ6HjXlJogsURqzwmJRUiQ7v6qvM77rnKygiBYfHcDiRsrGu

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 18.1

-- Started on 2025-11-25 11:36:11 +07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 899 (class 1247 OID 130529)
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
-- TOC entry 215 (class 1259 OID 130539)
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
-- TOC entry 216 (class 1259 OID 130545)
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
-- TOC entry 3926 (class 0 OID 0)
-- Dependencies: 216
-- Name: assessment_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_histories_id_seq OWNED BY public.assessment_histories.id;


--
-- TOC entry 217 (class 1259 OID 130546)
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
-- TOC entry 218 (class 1259 OID 130552)
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
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_locks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessment_locks_id_seq OWNED BY public.assessment_locks.id;


--
-- TOC entry 219 (class 1259 OID 130553)
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
-- TOC entry 220 (class 1259 OID 130563)
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
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 220
-- Name: assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assessments_id_seq OWNED BY public.assessments.id;


--
-- TOC entry 221 (class 1259 OID 130564)
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
-- TOC entry 222 (class 1259 OID 130570)
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
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 222
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- TOC entry 223 (class 1259 OID 130571)
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
-- TOC entry 224 (class 1259 OID 130577)
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
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 224
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- TOC entry 225 (class 1259 OID 130578)
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
-- TOC entry 226 (class 1259 OID 130585)
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
-- TOC entry 3931 (class 0 OID 0)
-- Dependencies: 226
-- Name: bulk_imports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bulk_imports_id_seq OWNED BY public.bulk_imports.id;


--
-- TOC entry 227 (class 1259 OID 130586)
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
-- TOC entry 228 (class 1259 OID 130592)
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
-- TOC entry 3932 (class 0 OID 0)
-- Dependencies: 228
-- Name: clusters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.clusters_id_seq OWNED BY public.clusters.id;


--
-- TOC entry 229 (class 1259 OID 130593)
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
-- TOC entry 230 (class 1259 OID 130609)
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
-- TOC entry 3933 (class 0 OID 0)
-- Dependencies: 230
-- Name: dashboard_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboard_stats_id_seq OWNED BY public.dashboard_stats.id;


--
-- TOC entry 231 (class 1259 OID 130610)
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
-- TOC entry 232 (class 1259 OID 130617)
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
-- TOC entry 3934 (class 0 OID 0)
-- Dependencies: 232
-- Name: intervention_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.intervention_programs_id_seq OWNED BY public.intervention_programs.id;


--
-- TOC entry 233 (class 1259 OID 130618)
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
-- TOC entry 234 (class 1259 OID 130625)
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
-- TOC entry 3935 (class 0 OID 0)
-- Dependencies: 234
-- Name: ip_whitelist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ip_whitelist_id_seq OWNED BY public.ip_whitelist.id;


--
-- TOC entry 235 (class 1259 OID 130626)
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
-- TOC entry 236 (class 1259 OID 130634)
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
-- TOC entry 3936 (class 0 OID 0)
-- Dependencies: 236
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentor_school_assignments_id_seq OWNED BY public.mentor_school_assignments.id;


--
-- TOC entry 237 (class 1259 OID 130635)
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
-- TOC entry 238 (class 1259 OID 130648)
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
-- TOC entry 3937 (class 0 OID 0)
-- Dependencies: 238
-- Name: mentoring_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.mentoring_visits_id_seq OWNED BY public.mentoring_visits.id;


--
-- TOC entry 239 (class 1259 OID 130649)
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
-- TOC entry 240 (class 1259 OID 130656)
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
-- TOC entry 3938 (class 0 OID 0)
-- Dependencies: 240
-- Name: pilot_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pilot_schools_id_seq OWNED BY public.pilot_schools.id;


--
-- TOC entry 241 (class 1259 OID 130657)
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
-- TOC entry 242 (class 1259 OID 130663)
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
-- TOC entry 3939 (class 0 OID 0)
-- Dependencies: 242
-- Name: progress_trackings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.progress_trackings_id_seq OWNED BY public.progress_trackings.id;


--
-- TOC entry 243 (class 1259 OID 130664)
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
-- TOC entry 244 (class 1259 OID 130670)
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
-- TOC entry 3940 (class 0 OID 0)
-- Dependencies: 244
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- TOC entry 245 (class 1259 OID 130671)
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
-- TOC entry 246 (class 1259 OID 130680)
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
-- TOC entry 3941 (class 0 OID 0)
-- Dependencies: 246
-- Name: quick_login_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.quick_login_users_id_seq OWNED BY public.quick_login_users.id;


--
-- TOC entry 247 (class 1259 OID 130681)
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
-- TOC entry 248 (class 1259 OID 130689)
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
-- TOC entry 3942 (class 0 OID 0)
-- Dependencies: 248
-- Name: rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rate_limits_id_seq OWNED BY public.rate_limits.id;


--
-- TOC entry 249 (class 1259 OID 130690)
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
-- TOC entry 250 (class 1259 OID 130697)
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
-- TOC entry 3943 (class 0 OID 0)
-- Dependencies: 250
-- Name: report_exports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.report_exports_id_seq OWNED BY public.report_exports.id;


--
-- TOC entry 251 (class 1259 OID 130698)
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
-- TOC entry 252 (class 1259 OID 130704)
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
-- TOC entry 3944 (class 0 OID 0)
-- Dependencies: 252
-- Name: resource_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resource_views_id_seq OWNED BY public.resource_views.id;


--
-- TOC entry 253 (class 1259 OID 130705)
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
-- TOC entry 254 (class 1259 OID 130713)
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
-- TOC entry 3945 (class 0 OID 0)
-- Dependencies: 254
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- TOC entry 255 (class 1259 OID 130714)
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
-- TOC entry 256 (class 1259 OID 130720)
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
-- TOC entry 3946 (class 0 OID 0)
-- Dependencies: 256
-- Name: school_classes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.school_classes_id_seq OWNED BY public.school_classes.id;


--
-- TOC entry 257 (class 1259 OID 130721)
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
-- TOC entry 258 (class 1259 OID 130728)
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
-- TOC entry 3947 (class 0 OID 0)
-- Dependencies: 258
-- Name: schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.schools_id_seq OWNED BY public.schools.id;


--
-- TOC entry 259 (class 1259 OID 130729)
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
-- TOC entry 260 (class 1259 OID 130735)
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
-- TOC entry 3948 (class 0 OID 0)
-- Dependencies: 260
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- TOC entry 261 (class 1259 OID 130736)
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
-- TOC entry 262 (class 1259 OID 130743)
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
-- TOC entry 3949 (class 0 OID 0)
-- Dependencies: 262
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_assessment_eligibilities_id_seq OWNED BY public.student_assessment_eligibilities.id;


--
-- TOC entry 263 (class 1259 OID 130744)
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
-- TOC entry 264 (class 1259 OID 130751)
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
-- TOC entry 3950 (class 0 OID 0)
-- Dependencies: 264
-- Name: student_interventions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.student_interventions_id_seq OWNED BY public.student_interventions.id;


--
-- TOC entry 265 (class 1259 OID 130752)
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
-- TOC entry 266 (class 1259 OID 130763)
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
-- TOC entry 3951 (class 0 OID 0)
-- Dependencies: 266
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 267 (class 1259 OID 130773)
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
-- TOC entry 268 (class 1259 OID 130779)
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
-- TOC entry 3952 (class 0 OID 0)
-- Dependencies: 268
-- Name: teaching_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teaching_activities_id_seq OWNED BY public.teaching_activities.id;


--
-- TOC entry 269 (class 1259 OID 130780)
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
-- TOC entry 270 (class 1259 OID 130791)
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
-- TOC entry 271 (class 1259 OID 130796)
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
-- TOC entry 3953 (class 0 OID 0)
-- Dependencies: 271
-- Name: user_schools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_schools_id_seq OWNED BY public.user_schools.id;


--
-- TOC entry 272 (class 1259 OID 130797)
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
-- TOC entry 273 (class 1259 OID 130806)
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
-- TOC entry 274 (class 1259 OID 130818)
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
-- TOC entry 3954 (class 0 OID 0)
-- Dependencies: 274
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3400 (class 2604 OID 130819)
-- Name: assessment_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories ALTER COLUMN id SET DEFAULT nextval('public.assessment_histories_id_seq'::regclass);


--
-- TOC entry 3402 (class 2604 OID 130820)
-- Name: assessment_locks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks ALTER COLUMN id SET DEFAULT nextval('public.assessment_locks_id_seq'::regclass);


--
-- TOC entry 3404 (class 2604 OID 130821)
-- Name: assessments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments ALTER COLUMN id SET DEFAULT nextval('public.assessments_id_seq'::regclass);


--
-- TOC entry 3410 (class 2604 OID 130822)
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- TOC entry 3412 (class 2604 OID 130823)
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- TOC entry 3414 (class 2604 OID 130824)
-- Name: bulk_imports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports ALTER COLUMN id SET DEFAULT nextval('public.bulk_imports_id_seq'::regclass);


--
-- TOC entry 3417 (class 2604 OID 130825)
-- Name: clusters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters ALTER COLUMN id SET DEFAULT nextval('public.clusters_id_seq'::regclass);


--
-- TOC entry 3419 (class 2604 OID 130826)
-- Name: dashboard_stats id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats ALTER COLUMN id SET DEFAULT nextval('public.dashboard_stats_id_seq'::regclass);


--
-- TOC entry 3431 (class 2604 OID 130827)
-- Name: intervention_programs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs ALTER COLUMN id SET DEFAULT nextval('public.intervention_programs_id_seq'::regclass);


--
-- TOC entry 3434 (class 2604 OID 130828)
-- Name: ip_whitelist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist ALTER COLUMN id SET DEFAULT nextval('public.ip_whitelist_id_seq'::regclass);


--
-- TOC entry 3437 (class 2604 OID 130829)
-- Name: mentor_school_assignments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments ALTER COLUMN id SET DEFAULT nextval('public.mentor_school_assignments_id_seq'::regclass);


--
-- TOC entry 3441 (class 2604 OID 130830)
-- Name: mentoring_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits ALTER COLUMN id SET DEFAULT nextval('public.mentoring_visits_id_seq'::regclass);


--
-- TOC entry 3450 (class 2604 OID 130831)
-- Name: pilot_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools ALTER COLUMN id SET DEFAULT nextval('public.pilot_schools_id_seq'::regclass);


--
-- TOC entry 3453 (class 2604 OID 130832)
-- Name: progress_trackings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings ALTER COLUMN id SET DEFAULT nextval('public.progress_trackings_id_seq'::regclass);


--
-- TOC entry 3455 (class 2604 OID 130833)
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- TOC entry 3457 (class 2604 OID 130834)
-- Name: quick_login_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users ALTER COLUMN id SET DEFAULT nextval('public.quick_login_users_id_seq'::regclass);


--
-- TOC entry 3462 (class 2604 OID 130835)
-- Name: rate_limits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits ALTER COLUMN id SET DEFAULT nextval('public.rate_limits_id_seq'::regclass);


--
-- TOC entry 3466 (class 2604 OID 130836)
-- Name: report_exports id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports ALTER COLUMN id SET DEFAULT nextval('public.report_exports_id_seq'::regclass);


--
-- TOC entry 3469 (class 2604 OID 130837)
-- Name: resource_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views ALTER COLUMN id SET DEFAULT nextval('public.resource_views_id_seq'::regclass);


--
-- TOC entry 3471 (class 2604 OID 130838)
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- TOC entry 3475 (class 2604 OID 130839)
-- Name: school_classes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes ALTER COLUMN id SET DEFAULT nextval('public.school_classes_id_seq'::regclass);


--
-- TOC entry 3477 (class 2604 OID 130840)
-- Name: schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools ALTER COLUMN id SET DEFAULT nextval('public.schools_id_seq'::regclass);


--
-- TOC entry 3480 (class 2604 OID 130841)
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- TOC entry 3482 (class 2604 OID 130842)
-- Name: student_assessment_eligibilities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities ALTER COLUMN id SET DEFAULT nextval('public.student_assessment_eligibilities_id_seq'::regclass);


--
-- TOC entry 3485 (class 2604 OID 130843)
-- Name: student_interventions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions ALTER COLUMN id SET DEFAULT nextval('public.student_interventions_id_seq'::regclass);


--
-- TOC entry 3488 (class 2604 OID 130844)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 3495 (class 2604 OID 130846)
-- Name: teaching_activities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities ALTER COLUMN id SET DEFAULT nextval('public.teaching_activities_id_seq'::regclass);


--
-- TOC entry 3503 (class 2604 OID 130847)
-- Name: user_schools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools ALTER COLUMN id SET DEFAULT nextval('public.user_schools_id_seq'::regclass);


--
-- TOC entry 3510 (class 2604 OID 130848)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3861 (class 0 OID 130539)
-- Dependencies: 215
-- Data for Name: assessment_histories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_histories (id, assessment_id, field_name, old_value, new_value, changed_by, created_at) FROM stdin;
27	489	updated	{"student_id":408,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-16T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":408,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-19T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	62	2025-11-19 13:05:52.145
28	805	updated	{"student_id":492,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-11-20T01:03:47.956Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":492,"assessment_type":"baseline","subject":"language","level":"story","notes":null,"assessed_date":"2025-11-18T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	115	2025-11-20 01:10:30.527
29	807	updated	{"student_id":490,"assessment_type":"baseline","subject":"language","level":"beginner","notes":null,"assessed_date":"2025-11-20T01:08:01.032Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":490,"assessment_type":"baseline","subject":"language","level":"beginner","notes":null,"assessed_date":"2025-11-18T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	115	2025-11-20 01:11:11.662
30	858	updated	{"student_id":988,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-20T03:33:52.002Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":988,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	59	2025-11-20 03:40:00.516
31	858	updated	{"student_id":988,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":988,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	59	2025-11-20 03:40:40.29
32	851	updated	{"student_id":871,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-20T03:29:13.183Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":871,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	59	2025-11-20 03:42:06.772
33	854	updated	{"student_id":993,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-20T03:32:27.378Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	{"student_id":993,"assessment_type":"baseline","subject":"language","level":"word","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	59	2025-11-20 03:42:38.239
34	942	updated	{"student_id":1180,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T08:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":1180,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	24	2025-11-20 05:32:18.906
35	942	updated	{"student_id":1180,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":1180,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	24	2025-11-20 05:33:17.742
36	1929	updated	{"student_id":2705,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":2705,"assessment_type":"baseline","subject":"math","level":"number_2digit","notes":null,"assessed_date":"2025-11-18T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	57	2025-11-21 02:13:22.21
37	2147	updated	{"student_id":2883,"assessment_type":"baseline","subject":"math","level":"division","notes":null,"assessed_date":"2025-11-16T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":2883,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	119	2025-11-21 05:13:20.632
38	2155	updated	{"student_id":1837,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-16T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":1837,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	44	2025-11-21 05:23:27.681
39	2048	updated	{"student_id":2835,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":2835,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-18T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ៣","student_consent":"Yes"}	56	2025-11-21 05:48:24.316
40	1917	updated	{"student_id":2186,"assessment_type":"baseline","subject":"math","level":"division","notes":null,"assessed_date":"2025-11-16T17:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ១","student_consent":"Yes"}	{"student_id":2186,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	42	2025-11-21 06:41:20.309
41	1917	updated	{"student_id":2186,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	{"student_id":2186,"assessment_type":"baseline","subject":"math","level":"subtraction","notes":null,"assessed_date":"2025-11-17T00:00:00.000Z","assessment_sample":"ឧបករណ៍តេស្ត លេខ២","student_consent":"Yes"}	42	2025-11-21 06:42:11.24
\.


--
-- TOC entry 3863 (class 0 OID 130546)
-- Dependencies: 217
-- Data for Name: assessment_locks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessment_locks (id, assessment_id, locked_by, locked_at, reason) FROM stdin;
\.


--
-- TOC entry 3865 (class 0 OID 130553)
-- Dependencies: 219
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.assessments (id, student_id, pilot_school_id, assessment_type, subject, level, notes, assessed_date, added_by_id, is_temporary, assessed_by_mentor, mentor_assessment_id, created_at, updated_at, created_by_role, record_status, test_session_id, assessment_sample, student_consent, verified_by_id, verified_at, verification_notes, is_locked, locked_by_id, locked_at) FROM stdin;
495	563	25	baseline	language	word	\N	2025-11-17 07:23:34.937	69	f	f	\N	2025-11-17 07:24:06.13	2025-11-17 07:24:06.13	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
513	534	19	baseline	language	comprehension2	\N	2025-11-17 08:51:20.933	65	f	f	\N	2025-11-17 08:51:56.912	2025-11-17 08:51:56.912	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
514	535	19	baseline	language	comprehension2	\N	2025-11-17 08:53:23.136	65	f	f	\N	2025-11-17 08:53:47.406	2025-11-17 08:53:47.406	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
532	576	25	baseline	language	story	\N	2025-11-17 11:02:40.181	69	f	f	\N	2025-11-17 11:02:56.01	2025-11-17 11:02:56.01	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
534	578	25	baseline	language	story	\N	2025-11-17 11:04:43.904	69	f	f	\N	2025-11-17 11:05:02.17	2025-11-17 11:05:02.17	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
554	611	25	baseline	language	comprehension2	\N	2025-11-17 11:39:07.338	69	f	f	\N	2025-11-17 11:39:29.308	2025-11-17 11:39:29.308	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
574	527	2	baseline	language	story	\N	2025-11-17 15:21:48.137	41	f	f	\N	2025-11-17 15:22:16.623	2025-11-17 15:22:16.623	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
579	623	24	baseline	language	comprehension2	\N	2025-11-16 17:00:00	85	f	f	\N	2025-11-18 04:47:33.333	2025-11-18 04:47:33.333	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
594	501	21	baseline	language	story	\N	2025-11-18 08:12:23.871	115	f	f	\N	2025-11-18 08:12:50.567	2025-11-18 08:12:50.567	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
596	500	21	baseline	language	comprehension1	\N	2025-11-18 08:13:11.619	115	f	f	\N	2025-11-18 08:13:42.658	2025-11-18 08:13:42.658	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
617	669	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:43:45.189	2025-11-18 08:43:45.189	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
632	792	25	baseline	language	paragraph	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:51:01.414	2025-11-18 09:51:01.414	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
645	469	21	baseline	language	comprehension2	\N	2025-11-18 12:33:23.662	66	f	f	\N	2025-11-18 12:34:19.022	2025-11-18 12:34:19.022	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
647	467	21	baseline	language	word	\N	2025-11-18 12:36:05.829	66	f	f	\N	2025-11-18 12:37:05.679	2025-11-18 12:37:05.679	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
664	450	21	baseline	language	comprehension2	\N	2025-11-18 13:01:34.952	66	f	f	\N	2025-11-18 13:02:08.779	2025-11-18 13:02:08.779	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
666	448	21	baseline	language	letter	\N	2025-11-18 13:04:18.734	66	f	f	\N	2025-11-18 13:04:46.892	2025-11-18 13:04:46.892	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
688	845	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:37:11.325	2025-11-18 13:37:11.325	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
689	860	13	baseline	math	number_2digit	\N	2025-11-18 13:37:38.829	52	f	f	\N	2025-11-18 13:38:11.059	2025-11-18 13:38:11.059	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
691	861	13	baseline	math	word_problems	\N	2025-11-18 13:38:54.701	52	f	f	\N	2025-11-18 13:39:37.102	2025-11-18 13:39:37.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
716	813	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:01:12.584	2025-11-18 14:01:12.584	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
740	722	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:32:57.3	2025-11-18 14:32:57.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
761	920	20	baseline	language	beginner	\N	2025-11-19 01:40:26.614	81	f	f	\N	2025-11-19 01:40:57.751	2025-11-19 01:40:57.751	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
763	925	20	baseline	language	word	\N	2025-11-19 01:42:37.565	81	f	f	\N	2025-11-19 01:42:47.285	2025-11-19 01:42:47.285	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
780	1032	26	baseline	math	number_2digit	\N	2025-11-19 09:27:03.339	62	f	f	\N	2025-11-19 09:28:26.275	2025-11-19 09:28:26.275	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
801	1047	26	baseline	math	number_2digit	\N	2025-11-18 17:00:00	62	f	f	\N	2025-11-20 00:08:39.617	2025-11-20 00:08:39.617	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
817	479	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:21:03.393	2025-11-20 01:21:03.393	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
836	1056	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:43:51.568	2025-11-20 02:43:51.568	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
837	1055	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:45:41.766	2025-11-20 02:45:41.766	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
854	993	18	baseline	language	word	\N	2025-11-17 00:00:00	59	f	f	\N	2025-11-20 03:33:11.558	2025-11-20 03:42:36.258	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
871	1096	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 03:57:29.287	2025-11-20 03:57:29.287	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
887	628	24	baseline	language	comprehension2	\N	2025-11-20 04:34:03.021	85	f	f	\N	2025-11-20 04:34:21.829	2025-11-20 04:34:21.829	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
888	629	24	baseline	language	word	\N	2025-11-20 04:34:37.484	85	f	f	\N	2025-11-20 04:34:59.043	2025-11-20 04:34:59.043	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
910	775	24	baseline	language	comprehension1	\N	2025-11-20 04:46:12.441	85	f	f	\N	2025-11-20 04:46:29.174	2025-11-20 04:46:29.174	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
914	1117	3	baseline	language	story	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:48:11.381	2025-11-20 04:48:11.381	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
916	780	24	baseline	language	comprehension1	\N	2025-11-20 04:48:28.226	85	f	f	\N	2025-11-20 04:48:46.404	2025-11-20 04:48:46.404	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
917	1116	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:48:51.69	2025-11-20 04:48:51.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
936	1065	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 05:02:17.946	2025-11-20 05:02:17.946	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
10	17	25	baseline	language	word	រួចហើយ	2025-10-05 07:36:19.147	69	f	f	\N	2025-10-05 07:37:24.063	2025-11-20 05:20:40.296	teacher	archived	\N	\N	\N	\N	\N	\N	f	\N	\N
951	1187	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:05:20.27	2025-11-20 06:05:20.27	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
962	1245	14	baseline	math	division	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:40:13.968	2025-11-20 06:40:13.968	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
963	1242	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 06:40:51.87	2025-11-20 06:40:51.87	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
977	997	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:25:33.143	2025-11-20 07:25:33.143	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
978	996	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:26:50.319	2025-11-20 07:26:50.319	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
992	982	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:37:23.309	2025-11-20 07:37:23.309	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
993	981	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:38:18.162	2025-11-20 07:38:18.162	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1001	973	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:44:19.683	2025-11-20 07:44:19.683	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
496	562	25	baseline	language	story	\N	2025-11-17 07:24:22.399	69	f	f	\N	2025-11-17 07:24:54.325	2025-11-17 07:24:54.325	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
498	393	25	baseline	language	story	\N	2025-11-17 07:27:11.191	69	f	f	\N	2025-11-17 07:27:28.216	2025-11-17 07:27:28.216	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
515	536	19	baseline	language	comprehension1	\N	2025-11-17 08:54:07.555	65	f	f	\N	2025-11-17 08:54:32.652	2025-11-17 08:54:32.652	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
519	540	19	baseline	language	comprehension2	\N	2025-11-17 08:56:58.582	65	f	f	\N	2025-11-17 08:57:21.114	2025-11-17 08:57:21.114	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
533	577	25	baseline	language	comprehension1	\N	2025-11-17 11:03:45.304	69	f	f	\N	2025-11-17 11:04:05.204	2025-11-17 11:04:05.204	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
555	612	25	baseline	language	story	\N	2025-11-17 11:40:08.974	69	f	f	\N	2025-11-17 11:40:33.127	2025-11-17 11:40:33.127	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
556	613	25	baseline	language	comprehension1	\N	2025-11-17 11:41:13.599	69	f	f	\N	2025-11-17 11:41:39.608	2025-11-17 11:41:39.608	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
557	615	25	baseline	language	comprehension2	\N	2025-11-17 11:42:38.053	69	f	f	\N	2025-11-17 11:42:53.721	2025-11-17 11:42:53.721	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
576	529	2	baseline	language	paragraph	\N	2025-11-17 15:23:21.146	41	f	f	\N	2025-11-17 15:23:40.296	2025-11-17 15:23:40.296	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
580	513	21	baseline	language	letter	\N	2025-11-18 07:41:10.833	115	f	f	\N	2025-11-18 07:44:32.439	2025-11-18 07:44:32.439	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
595	653	25	baseline	language	story	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:13:42.247	2025-11-18 08:13:42.247	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
597	499	21	baseline	language	paragraph	\N	2025-11-18 08:14:29.265	115	f	f	\N	2025-11-18 08:14:54.423	2025-11-18 08:14:54.423	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
598	498	21	baseline	language	letter	\N	2025-11-18 08:15:21.327	115	f	f	\N	2025-11-18 08:15:56.138	2025-11-18 08:15:56.138	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
618	671	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:44:48.941	2025-11-18 08:44:48.941	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
633	797	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:52:18.268	2025-11-18 09:52:18.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
634	800	25	baseline	language	story	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:53:32.578	2025-11-18 09:53:32.578	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
646	468	21	baseline	language	story	\N	2025-11-18 12:34:50.423	66	f	f	\N	2025-11-18 12:35:35.055	2025-11-18 12:35:35.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
648	466	21	baseline	language	story	\N	2025-11-18 12:37:44.076	66	f	f	\N	2025-11-18 12:38:28.685	2025-11-18 12:38:28.685	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
665	449	21	baseline	language	comprehension2	\N	2025-11-18 13:02:47.126	66	f	f	\N	2025-11-18 13:03:45.799	2025-11-18 13:03:45.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
667	445	21	baseline	language	comprehension2	\N	2025-11-18 13:05:12.705	66	f	f	\N	2025-11-18 13:05:40.091	2025-11-18 13:05:40.091	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
668	444	21	baseline	language	comprehension1	\N	2025-11-18 13:06:05.553	66	f	f	\N	2025-11-18 13:06:39.193	2025-11-18 13:06:39.193	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
693	842	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:40:49.547	2025-11-18 13:40:49.547	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
695	836	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:42:29.635	2025-11-18 13:42:29.635	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
698	833	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:45:00.355	2025-11-18 13:45:00.355	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
719	810	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:04:36.19	2025-11-18 14:04:36.19	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
720	809	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:05:53.176	2025-11-18 14:05:53.176	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
741	720	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:33:51.375	2025-11-18 14:33:51.375	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
764	926	20	baseline	language	word	\N	2025-11-19 01:43:03.211	81	f	f	\N	2025-11-19 01:43:15.45	2025-11-19 01:43:15.45	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
766	933	20	baseline	language	letter	\N	2025-11-19 01:44:08.761	81	f	f	\N	2025-11-19 01:44:21.504	2025-11-19 01:44:21.504	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
768	941	20	baseline	language	word	\N	2025-11-19 01:45:00.988	81	f	f	\N	2025-11-19 01:45:09.468	2025-11-19 01:45:09.468	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
781	1031	26	baseline	math	number_2digit	\N	2025-11-19 09:28:55.137	62	f	f	\N	2025-11-19 09:29:34.976	2025-11-19 09:29:34.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
785	1029	26	baseline	math	number_1digit	\N	2025-11-19 09:31:05.014	62	f	f	\N	2025-11-19 09:31:46.271	2025-11-19 09:31:46.271	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
787	1028	26	baseline	math	number_2digit	\N	2025-11-19 09:32:07.999	62	f	f	\N	2025-11-19 09:32:42.65	2025-11-19 09:32:42.65	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
788	1013	26	baseline	math	number_2digit	\N	2025-11-19 09:32:39.547	82	f	f	\N	2025-11-19 09:33:24.933	2025-11-19 09:33:24.933	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
802	1048	26	baseline	math	number_1digit	\N	2025-11-17 17:00:00	62	f	f	\N	2025-11-20 00:10:40.788	2025-11-20 00:10:40.788	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
820	482	21	baseline	language	comprehension1	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:25:06.264	2025-11-20 01:25:06.264	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
821	483	21	baseline	language	comprehension1	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:26:17.723	2025-11-20 01:26:17.723	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
838	1054	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:46:41.307	2025-11-20 02:46:41.307	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
855	1095	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:34:20.341	2025-11-20 03:34:20.341	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
873	1099	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:01:58.6	2025-11-20 04:01:58.6	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
875	1101	11	baseline	math	division	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:04:31.072	2025-11-20 04:04:31.072	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
889	630	24	baseline	language	story	\N	2025-11-20 04:35:12.156	85	f	f	\N	2025-11-20 04:35:33.715	2025-11-20 04:35:33.715	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
911	1118	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:46:40.246	2025-11-20 04:46:40.246	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
920	1114	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:50:27.53	2025-11-20 04:50:27.53	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
921	784	24	baseline	language	word	\N	2025-11-20 04:50:19.967	85	f	f	\N	2025-11-20 04:50:34.511	2025-11-20 04:50:34.511	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
923	785	24	baseline	language	letter	\N	2025-11-20 04:50:41.815	85	f	f	\N	2025-11-20 04:51:04.829	2025-11-20 04:51:04.829	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
497	561	25	baseline	language	story	\N	2025-11-17 07:25:14.547	69	f	f	\N	2025-11-17 07:25:35.455	2025-11-17 07:25:35.455	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
499	564	25	baseline	language	comprehension1	\N	2025-11-17 07:29:27.569	69	f	f	\N	2025-11-17 07:29:49.362	2025-11-17 07:29:49.362	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
516	537	19	baseline	language	story	\N	2025-11-17 08:54:48.928	65	f	f	\N	2025-11-17 08:55:10.655	2025-11-17 08:55:10.655	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
535	579	25	baseline	language	comprehension1	\N	2025-11-17 11:05:45.657	69	f	f	\N	2025-11-17 11:06:24.558	2025-11-17 11:06:24.558	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
536	580	25	baseline	language	comprehension2	\N	2025-11-17 11:08:26.544	69	f	f	\N	2025-11-17 11:08:47.241	2025-11-17 11:08:47.241	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
537	581	25	baseline	language	beginner	\N	2025-11-17 11:09:44.254	69	f	f	\N	2025-11-17 11:10:15.821	2025-11-17 11:10:15.821	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
558	616	25	baseline	language	story	\N	2025-11-17 11:43:38.481	69	f	f	\N	2025-11-17 11:44:06.701	2025-11-17 11:44:06.701	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
560	618	25	baseline	language	story	\N	2025-11-17 11:45:41.709	69	f	f	\N	2025-11-17 11:45:58.175	2025-11-17 11:45:58.175	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
577	530	2	baseline	language	paragraph	\N	2025-11-17 15:23:55.197	41	f	f	\N	2025-11-17 15:24:32.562	2025-11-17 15:24:32.562	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
581	514	21	baseline	language	comprehension1	\N	2025-11-18 07:53:56.878	115	f	f	\N	2025-11-18 07:54:39.493	2025-11-18 07:54:39.493	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
599	497	21	baseline	language	comprehension1	\N	2025-11-18 08:16:15.137	115	f	f	\N	2025-11-18 08:16:57.614	2025-11-18 08:16:57.614	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
619	674	25	baseline	language	comprehension1	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:45:55.924	2025-11-18 08:45:55.924	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
635	802	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:54:44.537	2025-11-18 09:54:44.537	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
649	465	21	baseline	language	comprehension2	\N	2025-11-18 12:38:56.431	66	f	f	\N	2025-11-18 12:39:40.087	2025-11-18 12:39:40.087	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
669	443	21	baseline	language	comprehension2	\N	2025-11-18 13:07:10.773	66	f	f	\N	2025-11-18 13:07:39.994	2025-11-18 13:07:39.994	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
696	864	13	baseline	math	division	\N	2025-11-18 13:42:44.429	52	f	f	\N	2025-11-18 13:43:17.313	2025-11-18 13:43:17.313	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
697	835	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:43:44.649	2025-11-18 13:43:44.649	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
699	866	13	baseline	math	number_2digit	\N	2025-11-18 13:44:48.708	52	f	f	\N	2025-11-18 13:45:11.847	2025-11-18 13:45:11.847	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
700	830	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:46:05.634	2025-11-18 13:46:05.634	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
702	829	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:47:10.608	2025-11-18 13:47:10.608	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
721	808	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:07:04.217	2025-11-18 14:07:04.217	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
722	807	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:08:11.05	2025-11-18 14:08:11.05	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
723	806	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:09:19.666	2025-11-18 14:09:19.666	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
742	716	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:35:10.545	2025-11-18 14:35:10.545	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
745	707	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:39:15.366	2025-11-18 14:39:15.366	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
765	932	20	baseline	language	word	\N	2025-11-19 01:43:40.166	81	f	f	\N	2025-11-19 01:43:52.03	2025-11-19 01:43:52.03	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
767	939	20	baseline	language	word	\N	2025-11-19 01:44:39.288	81	f	f	\N	2025-11-19 01:44:50.031	2025-11-19 01:44:50.031	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
769	953	20	baseline	language	beginner	\N	2025-11-19 01:45:37.616	81	f	f	\N	2025-11-19 01:45:47.278	2025-11-19 01:45:47.278	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
782	1016	26	baseline	math	subtraction	\N	2025-11-19 09:29:02.798	82	f	f	\N	2025-11-19 09:29:52.356	2025-11-19 09:29:52.356	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
786	1014	26	baseline	math	number_2digit	\N	2025-11-19 09:31:38.135	82	f	f	\N	2025-11-19 09:32:12.746	2025-11-19 09:32:12.746	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
790	1012	26	baseline	math	number_2digit	\N	2025-11-19 09:33:55.582	82	f	f	\N	2025-11-19 09:34:27.22	2025-11-19 09:34:27.22	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
803	1049	26	baseline	math	number_1digit	\N	2025-11-17 17:00:00	62	f	f	\N	2025-11-20 00:14:16.214	2025-11-20 00:14:16.214	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
822	484	21	baseline	language	comprehension1	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:27:13.312	2025-11-20 01:27:13.312	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
825	486	21	baseline	language	comprehension2	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:30:16.327	2025-11-20 01:30:16.327	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
839	1053	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:48:11.318	2025-11-20 02:48:11.318	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
840	1052	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:49:21.524	2025-11-20 02:49:21.524	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
856	1080	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:34:59.343	2025-11-20 03:34:59.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
857	1081	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:36:36.967	2025-11-20 03:36:36.967	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
874	1100	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:03:10.923	2025-11-20 04:03:10.923	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
890	631	24	baseline	language	word	\N	2025-11-20 04:35:48.236	85	f	f	\N	2025-11-20 04:36:07.766	2025-11-20 04:36:07.766	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
912	777	24	baseline	language	comprehension2	\N	2025-11-20 04:46:40.156	85	f	f	\N	2025-11-20 04:47:05.268	2025-11-20 04:47:05.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
915	779	24	baseline	language	letter	\N	2025-11-20 04:47:52.339	85	f	f	\N	2025-11-20 04:48:14.139	2025-11-20 04:48:14.139	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
937	1162	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:14:55.702	2025-11-20 05:14:55.702	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
952	1190	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:07:03.265	2025-11-20 06:07:03.265	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
964	1269	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:46:22.635	2025-11-20 06:46:22.635	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
979	995	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:27:50.386	2025-11-20 07:27:50.386	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
500	565	25	baseline	language	word	\N	2025-11-17 07:30:31.54	69	f	f	\N	2025-11-17 07:30:48.009	2025-11-17 07:30:48.009	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
517	538	19	baseline	language	story	\N	2025-11-17 08:55:28.671	65	f	f	\N	2025-11-17 08:55:45.666	2025-11-17 08:55:45.666	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
538	582	25	baseline	language	story	\N	2025-11-17 11:11:37.889	69	f	f	\N	2025-11-17 11:11:58.368	2025-11-17 11:11:58.368	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
540	584	25	baseline	language	story	\N	2025-11-17 11:13:48.61	69	f	f	\N	2025-11-17 11:14:07.41	2025-11-17 11:14:07.41	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
542	586	25	baseline	language	word	\N	2025-11-17 11:15:46.814	69	f	f	\N	2025-11-17 11:16:12.384	2025-11-17 11:16:12.384	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
559	617	25	baseline	language	comprehension1	\N	2025-11-17 11:44:40.355	69	f	f	\N	2025-11-17 11:44:58.426	2025-11-17 11:44:58.426	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
561	619	25	baseline	language	story	\N	2025-11-17 11:46:36.81	69	f	f	\N	2025-11-17 11:46:54.079	2025-11-17 11:46:54.079	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
578	531	2	baseline	language	paragraph	\N	2025-11-17 15:24:49.478	41	f	f	\N	2025-11-17 15:25:07.64	2025-11-17 15:25:07.64	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
582	512	21	baseline	language	letter	\N	2025-11-18 07:55:22.499	115	f	f	\N	2025-11-18 07:56:12.184	2025-11-18 07:56:12.184	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
600	496	21	baseline	language	comprehension1	\N	2025-11-18 08:17:23.236	115	f	f	\N	2025-11-18 08:17:53.952	2025-11-18 08:17:53.952	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
620	677	25	baseline	language	comprehension1	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:49:54.515	2025-11-18 08:49:54.515	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
622	683	25	baseline	language	letter	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:52:32.558	2025-11-18 08:52:32.558	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
636	804	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:55:55.413	2025-11-18 09:55:55.413	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
650	464	21	baseline	language	comprehension2	\N	2025-11-18 12:40:26.674	66	f	f	\N	2025-11-18 12:41:23.864	2025-11-18 12:41:23.864	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
651	463	21	baseline	language	comprehension2	\N	2025-11-18 12:43:14.926	66	f	f	\N	2025-11-18 12:43:55.24	2025-11-18 12:43:55.24	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
670	442	21	baseline	language	comprehension1	\N	2025-11-18 13:08:05.046	66	f	f	\N	2025-11-18 13:08:34.573	2025-11-18 13:08:34.573	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
701	867	13	baseline	math	division	\N	2025-11-18 13:45:51.229	52	f	f	\N	2025-11-18 13:46:27.442	2025-11-18 13:46:27.442	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
703	868	13	baseline	math	word_problems	\N	2025-11-18 13:47:14.188	52	f	f	\N	2025-11-18 13:47:42.496	2025-11-18 13:47:42.496	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
724	805	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:10:32.452	2025-11-18 14:10:32.452	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
743	713	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:36:55.184	2025-11-18 14:36:55.184	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
744	712	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:38:10.16	2025-11-18 14:38:10.16	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
770	870	13	baseline	math	division	\N	2025-11-19 03:06:31.891	52	f	f	\N	2025-11-19 03:07:24.79	2025-11-19 03:07:24.79	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
783	1030	26	baseline	math	number_1digit	\N	2025-11-19 09:29:54.603	62	f	f	\N	2025-11-19 09:30:45.094	2025-11-19 09:30:45.094	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
784	1015	26	baseline	math	number_2digit	\N	2025-11-19 09:30:22.322	82	f	f	\N	2025-11-19 09:30:59.781	2025-11-19 09:30:59.781	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
789	1027	26	baseline	math	number_1digit	\N	2025-11-19 09:33:16.937	62	f	f	\N	2025-11-19 09:33:46.609	2025-11-19 09:33:46.609	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
804	1050	26	baseline	math	number_1digit	\N	2025-11-17 17:00:00	62	f	f	\N	2025-11-20 00:16:05.334	2025-11-20 00:16:05.334	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
823	487	21	baseline	language	letter	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:28:19.186	2025-11-20 01:28:19.186	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
841	1051	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:50:57.035	2025-11-20 02:50:57.035	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
858	988	18	baseline	language	word	\N	2025-11-17 00:00:00	59	f	f	\N	2025-11-20 03:37:22.679	2025-11-20 03:40:37.179	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
876	1104	11	baseline	math	division	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:05:43.913	2025-11-20 04:05:43.913	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
891	758	24	baseline	language	letter	\N	2025-11-20 04:36:45.438	85	f	f	\N	2025-11-20 04:37:07.682	2025-11-20 04:37:07.682	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
892	1122	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:37:30.19	2025-11-20 04:37:30.19	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
913	778	24	baseline	language	paragraph	\N	2025-11-20 04:47:18.854	85	f	f	\N	2025-11-20 04:47:35.704	2025-11-20 04:47:35.704	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
922	1113	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:51:01.545	2025-11-20 04:51:01.545	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
938	1170	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:18:12.098	2025-11-20 05:18:12.098	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
939	1176	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:20:40.871	2025-11-20 05:20:40.871	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
953	1192	14	baseline	math	word_problems	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:09:11.088	2025-11-20 06:09:11.088	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
965	1268	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 06:48:16.83	2025-11-20 06:48:16.83	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
980	994	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:28:37.149	2025-11-20 07:28:37.149	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
994	980	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:39:16.099	2025-11-20 07:39:16.099	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1002	972	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:44:54.267	2025-11-20 07:44:54.267	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1003	971	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:45:36.332	2025-11-20 07:45:36.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1008	967	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:48:20.906	2025-11-20 07:48:20.906	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1015	1437	4	baseline	language	story	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 07:51:37.313	2025-11-20 07:51:37.313	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1017	961	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:53:05.344	2025-11-20 07:53:05.344	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1018	960	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:53:51.956	2025-11-20 07:53:51.956	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
501	566	25	baseline	language	comprehension1	\N	2025-11-17 07:31:27.592	69	f	f	\N	2025-11-17 07:31:53.799	2025-11-17 07:31:53.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
502	567	25	baseline	language	story	\N	2025-11-17 07:32:45.93	69	f	f	\N	2025-11-17 07:33:39.121	2025-11-17 07:33:39.121	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
518	539	19	baseline	language	comprehension1	\N	2025-11-17 08:56:00.207	65	f	f	\N	2025-11-17 08:56:35.502	2025-11-17 08:56:35.502	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
522	543	19	baseline	language	comprehension1	\N	2025-11-17 08:59:24.205	65	f	f	\N	2025-11-17 08:59:50.957	2025-11-17 08:59:50.957	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
539	583	25	baseline	language	beginner	\N	2025-11-17 11:12:36.168	69	f	f	\N	2025-11-17 11:12:57.026	2025-11-17 11:12:57.026	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
541	585	25	baseline	language	comprehension1	\N	2025-11-17 11:14:37.628	69	f	f	\N	2025-11-17 11:14:58.301	2025-11-17 11:14:58.301	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
562	515	2	baseline	language	comprehension2	\N	2025-11-17 15:07:52.489	41	f	f	\N	2025-11-17 15:08:33.466	2025-11-17 15:08:33.466	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
583	511	21	baseline	language	letter	\N	2025-11-18 07:56:28.906	115	f	f	\N	2025-11-18 07:57:16.862	2025-11-18 07:57:16.862	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
601	654	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:18:38.332	2025-11-18 08:18:38.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
602	495	21	baseline	language	word	\N	2025-11-18 08:18:27.705	115	f	f	\N	2025-11-18 08:18:58.647	2025-11-18 08:18:58.647	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
603	494	21	baseline	language	story	\N	2025-11-18 08:19:20.443	115	f	f	\N	2025-11-18 08:20:01.334	2025-11-18 08:20:01.334	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
621	682	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:51:15.839	2025-11-18 08:51:15.839	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
637	655	25	baseline	language	beginner	\N	2025-11-17 17:00:00	64	f	f	\N	2025-11-18 09:57:45.672	2025-11-18 09:57:45.672	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
652	462	21	baseline	language	story	\N	2025-11-18 12:44:59.275	66	f	f	\N	2025-11-18 12:46:15.043	2025-11-18 12:46:15.043	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
671	441	21	baseline	language	story	\N	2025-11-18 13:09:00.843	66	f	f	\N	2025-11-18 13:09:26.251	2025-11-18 13:09:26.251	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
704	827	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:48:08.047	2025-11-18 13:48:08.047	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
725	803	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:11:45.074	2025-11-18 14:11:45.074	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
746	706	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:40:21.315	2025-11-18 14:40:21.315	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
749	673	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:43:08.072	2025-11-18 14:43:08.072	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
771	863	13	baseline	math	subtraction	\N	2025-11-19 03:10:51.395	52	f	f	\N	2025-11-19 03:11:39.479	2025-11-19 03:11:39.479	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
791	1025	26	baseline	math	subtraction	\N	2025-11-19 09:34:34.891	62	f	f	\N	2025-11-19 09:35:05.738	2025-11-19 09:35:05.738	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
805	492	21	baseline	language	story	\N	2025-11-18 00:00:00	115	f	f	\N	2025-11-20 01:04:24.284	2025-11-20 01:10:27.591	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
824	485	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:29:18.955	2025-11-20 01:29:18.955	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
842	1112	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:11:37.137	2025-11-20 03:11:37.137	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
859	1083	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:38:00.744	2025-11-20 03:38:00.744	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
877	1105	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:06:59.412	2025-11-20 04:06:59.412	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
893	759	24	baseline	language	beginner	\N	2025-11-20 04:37:26.35	85	f	f	\N	2025-11-20 04:37:50.109	2025-11-20 04:37:50.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
896	762	24	baseline	language	letter	\N	2025-11-20 04:39:06.717	85	f	f	\N	2025-11-20 04:39:39.407	2025-11-20 04:39:39.407	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
900	766	24	baseline	language	comprehension1	\N	2025-11-20 04:42:14.716	85	f	f	\N	2025-11-20 04:42:34.619	2025-11-20 04:42:34.619	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
918	1115	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:49:37.059	2025-11-20 04:49:37.059	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
919	783	24	baseline	language	word	\N	2025-11-20 04:48:54.894	85	f	f	\N	2025-11-20 04:50:07.05	2025-11-20 04:50:07.05	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
925	1146	24	baseline	language	story	\N	2025-11-20 04:51:52.727	85	f	f	\N	2025-11-20 04:52:10.991	2025-11-20 04:52:10.991	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
940	1178	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:22:39.16	2025-11-20 05:22:39.16	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
954	1194	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:12:23.083	2025-11-20 06:12:23.083	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
966	1284	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:50:48.529	2025-11-20 06:50:48.529	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
981	1390	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:29:11.624	2025-11-20 07:29:11.624	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
982	992	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:29:35.792	2025-11-20 07:29:35.792	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
995	979	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:39:56.189	2025-11-20 07:39:56.189	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1004	970	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:46:17.805	2025-11-20 07:46:17.805	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1009	966	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:49:02.913	2025-11-20 07:49:02.913	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1010	1428	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 07:49:37.001	2025-11-20 07:49:37.001	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1011	965	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:49:47.089	2025-11-20 07:49:47.089	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1019	1444	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 07:53:55.161	2025-11-20 07:53:55.161	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1026	1464	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:59:12.559	2025-11-20 07:59:12.559	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1027	1465	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 07:59:18.427	2025-11-20 07:59:18.427	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1029	951	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:00:15.014	2025-11-20 08:00:15.014	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
503	568	25	baseline	language	story	\N	2025-11-17 07:35:10.12	69	f	f	\N	2025-11-17 07:35:32.421	2025-11-17 07:35:32.421	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
520	541	19	baseline	language	comprehension2	\N	2025-11-17 08:57:57.299	65	f	f	\N	2025-11-17 08:58:21.416	2025-11-17 08:58:21.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
523	544	19	baseline	language	paragraph	\N	2025-11-17 09:00:15.161	65	f	f	\N	2025-11-17 09:00:36.365	2025-11-17 09:00:36.365	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
543	587	25	baseline	language	comprehension1	\N	2025-11-17 11:17:09.921	69	f	f	\N	2025-11-17 11:17:35.355	2025-11-17 11:17:35.355	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
544	589	25	baseline	language	letter	\N	2025-11-17 11:19:35.47	69	f	f	\N	2025-11-17 11:19:53.396	2025-11-17 11:19:53.396	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
563	516	2	baseline	language	comprehension2	\N	2025-11-17 15:10:20.311	41	f	f	\N	2025-11-17 15:11:29.201	2025-11-17 15:11:29.201	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
584	510	21	baseline	language	story	\N	2025-11-18 07:57:38.408	115	f	f	\N	2025-11-18 07:58:28.289	2025-11-18 07:58:28.289	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
585	509	21	baseline	language	letter	\N	2025-11-18 07:58:40.96	115	f	f	\N	2025-11-18 07:59:15.994	2025-11-18 07:59:15.994	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
604	656	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:20:44.34	2025-11-18 08:20:44.34	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
623	687	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:53:44.024	2025-11-18 08:53:44.024	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
638	822	13	baseline	math	subtraction	\N	2025-11-18 10:10:28.254	52	f	f	\N	2025-11-18 10:11:04.328	2025-11-18 10:11:04.328	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
653	461	21	baseline	language	paragraph	\N	2025-11-18 12:47:01.316	66	f	f	\N	2025-11-18 12:47:50.522	2025-11-18 12:47:50.522	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
654	460	21	baseline	language	comprehension1	\N	2025-11-18 12:49:14.203	66	f	f	\N	2025-11-18 12:49:44.516	2025-11-18 12:49:44.516	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
672	440	21	baseline	language	comprehension2	\N	2025-11-18 13:10:34.08	66	f	f	\N	2025-11-18 13:11:34.065	2025-11-18 13:11:34.065	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
673	439	21	baseline	language	comprehension1	\N	2025-11-18 13:13:02.613	66	f	f	\N	2025-11-18 13:13:31.402	2025-11-18 13:13:31.402	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
705	869	13	baseline	math	subtraction	\N	2025-11-18 13:48:52.074	52	f	f	\N	2025-11-18 13:49:14.38	2025-11-18 13:49:14.38	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
706	826	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:49:20.577	2025-11-18 13:49:20.577	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
707	825	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:50:36.418	2025-11-18 13:50:36.418	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
708	823	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:51:31.953	2025-11-18 13:51:31.953	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
726	801	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:12:46.53	2025-11-18 14:12:46.53	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
747	703	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:41:15.912	2025-11-18 14:41:15.912	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
748	700	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:42:13.111	2025-11-18 14:42:13.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
750	665	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:43:59.665	2025-11-18 14:43:59.665	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
751	664	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:44:56.761	2025-11-18 14:44:56.761	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
772	824	13	baseline	math	division	\N	2025-11-19 03:12:25.172	52	f	f	\N	2025-11-19 03:12:52.943	2025-11-19 03:12:52.943	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
792	1011	26	baseline	math	subtraction	\N	2025-11-19 09:34:51.273	82	f	f	\N	2025-11-19 09:35:22.708	2025-11-19 09:35:22.708	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
796	1022	26	baseline	math	number_2digit	\N	2025-11-19 09:37:08.808	62	f	f	\N	2025-11-19 09:38:03.708	2025-11-19 09:38:03.708	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
806	491	21	baseline	language	paragraph	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:05:54.865	2025-11-20 01:05:54.865	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
826	1063	4	baseline	language	beginner	\N	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 02:28:57.071	2025-11-20 02:28:57.071	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
843	1111	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:15:24.537	2025-11-20 03:15:24.537	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
844	1110	14	baseline	math	number_1digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:18:05.003	2025-11-20 03:18:05.003	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
860	1084	11	baseline	math	word_problems	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:39:14.885	2025-11-20 03:39:14.885	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
861	1085	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:40:19.295	2025-11-20 03:40:19.295	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
878	1127	3	baseline	language	letter	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:14:43.318	2025-11-20 04:14:43.318	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
880	1125	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:18:27.845	2025-11-20 04:18:27.845	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
894	760	24	baseline	language	comprehension2	\N	2025-11-20 04:38:02.051	85	f	f	\N	2025-11-20 04:38:25.305	2025-11-20 04:38:25.305	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
895	761	24	baseline	language	comprehension2	\N	2025-11-20 04:38:36.635	85	f	f	\N	2025-11-20 04:38:57.653	2025-11-20 04:38:57.653	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
897	763	24	baseline	language	word	\N	2025-11-20 04:39:58.876	85	f	f	\N	2025-11-20 04:40:19.977	2025-11-20 04:40:19.977	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
898	764	24	baseline	language	story	\N	2025-11-20 04:40:45.2	85	f	f	\N	2025-11-20 04:41:23.487	2025-11-20 04:41:23.487	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
924	1082	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:52:09.609	2025-11-20 04:52:09.609	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
941	1179	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:25:19.799	2025-11-20 05:25:19.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
955	1195	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:18:59.095	2025-11-20 06:18:59.095	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
967	1290	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:52:48.506	2025-11-20 06:52:48.506	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
968	1289	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 06:53:40.27	2025-11-20 06:53:40.27	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
970	1301	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:56:44.645	2025-11-20 06:56:44.645	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
983	991	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:30:15.108	2025-11-20 07:30:15.108	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
504	569	25	baseline	language	letter	\N	2025-11-17 07:36:21.185	69	f	f	\N	2025-11-17 07:36:49.502	2025-11-17 07:36:49.502	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
506	571	25	baseline	language	beginner	\N	2025-11-17 07:38:57.517	69	f	f	\N	2025-11-17 07:39:19.35	2025-11-17 07:39:19.35	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
508	573	25	baseline	language	comprehension2	\N	2025-11-17 07:40:57.878	69	f	f	\N	2025-11-17 07:41:20.769	2025-11-17 07:41:20.769	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
521	542	19	baseline	language	paragraph	\N	2025-11-17 08:58:42.526	65	f	f	\N	2025-11-17 08:59:02.537	2025-11-17 08:59:02.537	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
526	550	19	baseline	language	comprehension2	\N	2025-11-17 09:02:33.761	65	f	f	\N	2025-11-17 09:02:54.797	2025-11-17 09:02:54.797	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
545	593	25	baseline	language	story	\N	2025-11-17 11:23:15.699	69	f	f	\N	2025-11-17 11:23:39.316	2025-11-17 11:23:39.316	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
564	517	2	baseline	language	comprehension2	\N	2025-11-17 15:11:57.559	41	f	f	\N	2025-11-17 15:12:35.849	2025-11-17 15:12:35.849	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
565	518	2	baseline	language	story	\N	2025-11-17 15:13:07.41	41	f	f	\N	2025-11-17 15:13:44.307	2025-11-17 15:13:44.307	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
586	508	21	baseline	language	letter	\N	2025-11-18 08:02:15.921	115	f	f	\N	2025-11-18 08:02:55.055	2025-11-18 08:02:55.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
605	657	25	baseline	language	paragraph	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:25:10.934	2025-11-18 08:25:10.934	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
606	658	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:28:23.974	2025-11-18 08:28:23.974	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
624	692	25	baseline	language	word	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:54:49.442	2025-11-18 08:54:49.442	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
639	828	13	baseline	math	subtraction	\N	2025-11-18 10:11:57.711	52	f	f	\N	2025-11-18 10:12:24.547	2025-11-18 10:12:24.547	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
655	459	21	baseline	language	paragraph	\N	2025-11-18 12:50:39.465	66	f	f	\N	2025-11-18 12:51:21.774	2025-11-18 12:51:21.774	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
657	457	21	baseline	language	story	\N	2025-11-18 12:53:08.403	66	f	f	\N	2025-11-18 12:53:39.316	2025-11-18 12:53:39.316	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
674	438	21	baseline	language	comprehension2	\N	2025-11-18 13:14:32.034	66	f	f	\N	2025-11-18 13:14:53.299	2025-11-18 13:14:53.299	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
709	820	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:52:40.007	2025-11-18 13:52:40.007	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
727	799	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:14:01.133	2025-11-18 14:14:01.133	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
752	948	20	baseline	language	word	\N	2025-11-19 01:29:02.463	81	f	f	\N	2025-11-19 01:29:32.96	2025-11-19 01:29:32.96	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
753	896	20	baseline	language	word	\N	2025-11-19 01:30:27.441	81	f	f	\N	2025-11-19 01:30:55.605	2025-11-19 01:30:55.605	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
773	429	20	baseline	language	letter	\N	2025-11-19 03:45:04.899	81	f	f	\N	2025-11-19 03:45:24.55	2025-11-19 03:45:24.55	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
793	1010	26	baseline	math	number_2digit	\N	2025-11-19 09:35:53.319	82	f	f	\N	2025-11-19 09:36:29.643	2025-11-19 09:36:29.643	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
807	490	21	baseline	language	beginner	\N	2025-11-18 00:00:00	115	f	f	\N	2025-11-20 01:08:26.196	2025-11-20 01:11:08.565	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
827	1064	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:31:45.151	2025-11-20 02:31:45.151	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
845	1109	14	baseline	math	number_1digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:21:21.111	2025-11-20 03:21:21.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
862	1086	11	baseline	math	word_problems	\N	2025-11-20 03:40:36.852	50	f	f	\N	2025-11-20 03:41:43.263	2025-11-20 03:41:43.263	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
879	1126	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:17:35.464	2025-11-20 04:17:35.464	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
899	765	24	baseline	language	paragraph	\N	2025-11-20 04:41:39.754	85	f	f	\N	2025-11-20 04:42:02.526	2025-11-20 04:42:02.526	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
926	1077	3	baseline	language	story	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:52:56.815	2025-11-20 04:52:56.815	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
942	1180	14	baseline	math	subtraction	\N	2025-11-17 00:00:00	24	f	f	\N	2025-11-20 05:27:37.348	2025-11-20 05:33:14.778	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
956	1196	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:21:03.98	2025-11-20 06:21:03.98	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
969	1295	14	baseline	math	word_problems	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:54:36.988	2025-11-20 06:54:36.988	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
984	990	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:30:55.05	2025-11-20 07:30:55.05	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
988	985	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:34:16.54	2025-11-20 07:34:16.54	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
996	978	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:40:46.802	2025-11-20 07:40:46.802	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1005	969	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:46:57.054	2025-11-20 07:46:57.054	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1012	964	18	baseline	language	letter	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:50:42.492	2025-11-20 07:50:42.492	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1013	1430	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:51:21.571	2025-11-20 07:51:21.571	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1021	958	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:55:29.403	2025-11-20 07:55:29.403	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1028	952	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:59:33.477	2025-11-20 07:59:33.477	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1032	946	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:01:26.895	2025-11-20 08:01:26.895	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1034	942	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:02:17.449	2025-11-20 08:02:17.449	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1035	940	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:03:04.704	2025-11-20 08:03:04.704	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1036	1368	32	baseline	math	number_2digit	\N	2025-11-20 08:01:53.698	60	f	f	\N	2025-11-20 08:03:10.186	2025-11-20 08:03:10.186	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1037	938	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:03:47.379	2025-11-20 08:03:47.379	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1038	1481	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 08:03:52.16	2025-11-20 08:03:52.16	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
505	570	25	baseline	language	beginner	\N	2025-11-17 07:37:39.958	69	f	f	\N	2025-11-17 07:38:12.938	2025-11-17 07:38:12.938	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
507	572	25	baseline	language	comprehension2	\N	2025-11-17 07:40:04.327	69	f	f	\N	2025-11-17 07:40:21.545	2025-11-17 07:40:21.545	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
524	545	19	baseline	language	comprehension2	\N	2025-11-17 09:01:05.244	65	f	f	\N	2025-11-17 09:01:30.492	2025-11-17 09:01:30.492	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
546	594	25	baseline	language	letter	\N	2025-11-17 11:24:37.908	69	f	f	\N	2025-11-17 11:25:09.197	2025-11-17 11:25:09.197	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
566	519	2	baseline	language	story	\N	2025-11-17 15:14:16.929	41	f	f	\N	2025-11-17 15:14:58.478	2025-11-17 15:14:58.478	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
570	523	2	baseline	language	story	\N	2025-11-17 15:18:24.026	41	f	f	\N	2025-11-17 15:18:51.576	2025-11-17 15:18:51.576	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
587	507	21	baseline	language	letter	\N	2025-11-18 08:03:10.771	115	f	f	\N	2025-11-18 08:03:53.024	2025-11-18 08:03:53.024	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
607	659	25	baseline	language	paragraph	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:30:47.635	2025-11-18 08:30:47.635	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
608	660	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:32:16.12	2025-11-18 08:32:16.12	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
625	695	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:56:06.397	2025-11-18 08:56:06.397	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
640	831	13	baseline	math	subtraction	\N	2025-11-18 10:13:11.4	52	f	f	\N	2025-11-18 10:13:40.103	2025-11-18 10:13:40.103	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
656	458	21	baseline	language	comprehension1	\N	2025-11-18 12:52:05.47	66	f	f	\N	2025-11-18 12:52:39.541	2025-11-18 12:52:39.541	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
675	851	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:26:15.131	2025-11-18 13:26:15.131	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
676	852	13	baseline	math	number_2digit	\N	2025-11-18 13:26:28.947	52	f	f	\N	2025-11-18 13:26:58.404	2025-11-18 13:26:58.404	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
678	850	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:30:05.56	2025-11-18 13:30:05.56	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
679	854	13	baseline	math	subtraction	\N	2025-11-18 13:29:33.057	52	f	f	\N	2025-11-18 13:30:17.675	2025-11-18 13:30:17.675	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
710	819	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:53:42.653	2025-11-18 13:53:42.653	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
711	818	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:54:48.092	2025-11-18 13:54:48.092	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
728	798	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:14:58.449	2025-11-18 14:14:58.449	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
729	796	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:16:02.987	2025-11-18 14:16:02.987	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
730	795	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:17:05.213	2025-11-18 14:17:05.213	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
732	793	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:19:03.611	2025-11-18 14:19:03.611	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
754	901	20	baseline	language	letter	\N	2025-11-19 01:31:58.503	81	f	f	\N	2025-11-19 01:32:22.68	2025-11-19 01:32:22.68	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
774	422	20	baseline	language	letter	\N	2025-11-19 03:47:05.409	81	f	f	\N	2025-11-19 03:47:27.059	2025-11-19 03:47:27.059	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
794	1024	26	baseline	math	number_2digit	\N	2025-11-19 09:35:31.306	62	f	f	\N	2025-11-19 09:36:31.916	2025-11-19 09:36:31.916	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
808	489	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:12:05.282	2025-11-20 01:12:05.282	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
828	1062	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:34:28.526	2025-11-20 02:34:28.526	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
829	1066	4	baseline	language	beginner	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 02:34:43.78	2025-11-20 02:34:43.78	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
830	1061	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:37:30.417	2025-11-20 02:37:30.417	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
846	1108	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:23:20.343	2025-11-20 03:23:20.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
863	1087	11	baseline	math	division	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:44:39.983	2025-11-20 03:44:39.983	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
865	1089	11	baseline	math	number_2digit	\N	2025-11-20 03:46:19.096	50	f	f	\N	2025-11-20 03:47:12.801	2025-11-20 03:47:12.801	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
881	1124	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:21:30.678	2025-11-20 04:21:30.678	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
901	767	24	baseline	language	comprehension1	\N	2025-11-20 04:42:46.708	85	f	f	\N	2025-11-20 04:43:06.539	2025-11-20 04:43:06.539	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
902	768	24	baseline	language	story	\N	2025-11-20 04:43:17.39	85	f	f	\N	2025-11-20 04:43:35.024	2025-11-20 04:43:35.024	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
905	770	24	baseline	language	letter	\N	2025-11-20 04:44:34.596	85	f	f	\N	2025-11-20 04:44:51.533	2025-11-20 04:44:51.533	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
906	1120	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:44:58.905	2025-11-20 04:44:58.905	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
907	771	24	baseline	language	comprehension1	\N	2025-11-20 04:45:02.546	85	f	f	\N	2025-11-20 04:45:22.619	2025-11-20 04:45:22.619	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
927	1076	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:54:16.352	2025-11-20 04:54:16.352	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
929	1074	3	baseline	language	letter	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:55:57.566	2025-11-20 04:55:57.566	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
943	1181	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:30:14.267	2025-11-20 05:30:14.267	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
957	1200	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:23:22.548	2025-11-20 06:23:22.548	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
971	1311	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 07:00:23.742	2025-11-20 07:00:23.742	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
985	989	18	baseline	language	beginner	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:31:44.852	2025-11-20 07:31:44.852	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
986	987	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:32:31.841	2025-11-20 07:32:31.841	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
991	983	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:35:42.364	2025-11-20 07:35:42.364	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
509	574	25	baseline	language	story	\N	2025-11-17 07:42:01.658	69	f	f	\N	2025-11-17 07:42:18.915	2025-11-17 07:42:18.915	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
525	546	19	baseline	language	paragraph	\N	2025-11-17 09:01:49.082	65	f	f	\N	2025-11-17 09:02:15.011	2025-11-17 09:02:15.011	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
531	554	19	baseline	language	paragraph	\N	2025-11-17 09:06:00.015	65	f	f	\N	2025-11-17 09:06:15.311	2025-11-17 09:06:15.311	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
547	599	25	baseline	language	comprehension1	\N	2025-11-17 11:28:06.855	69	f	f	\N	2025-11-17 11:28:31.152	2025-11-17 11:28:31.152	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
549	604	25	baseline	language	paragraph	\N	2025-11-17 11:31:34.569	69	f	f	\N	2025-11-17 11:32:00.229	2025-11-17 11:32:00.229	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
567	520	2	baseline	language	story	\N	2025-11-17 15:15:20.987	41	f	f	\N	2025-11-17 15:15:50.174	2025-11-17 15:15:50.174	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
588	506	21	baseline	language	comprehension1	\N	2025-11-18 08:04:07.173	115	f	f	\N	2025-11-18 08:04:53.204	2025-11-18 08:04:53.204	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
589	505	21	baseline	language	story	\N	2025-11-18 08:05:16.038	115	f	f	\N	2025-11-18 08:05:54.269	2025-11-18 08:05:54.269	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
590	504	21	baseline	language	story	\N	2025-11-18 08:06:26.569	115	f	f	\N	2025-11-18 08:07:01.668	2025-11-18 08:07:01.668	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
609	661	25	baseline	language	letter	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:33:46.81	2025-11-18 08:33:46.81	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
626	697	25	baseline	language	comprehension1	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:57:19.346	2025-11-18 08:57:19.346	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
627	702	25	baseline	language	paragraph	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:59:39.434	2025-11-18 08:59:39.434	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
641	834	13	baseline	math	number_2digit	\N	2025-11-18 10:14:36.347	52	f	f	\N	2025-11-18 10:15:07.741	2025-11-18 10:15:07.741	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
658	456	21	baseline	language	letter	\N	2025-11-18 12:54:06.536	66	f	f	\N	2025-11-18 12:54:39.593	2025-11-18 12:54:39.593	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
677	853	13	baseline	math	subtraction	\N	2025-11-18 13:28:22.319	52	f	f	\N	2025-11-18 13:28:48.388	2025-11-18 13:28:48.388	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
712	817	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:55:49.158	2025-11-18 13:55:49.158	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
731	794	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:18:02.341	2025-11-18 14:18:02.341	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
755	906	20	baseline	language	beginner	\N	2025-11-19 01:33:10.019	81	f	f	\N	2025-11-19 01:33:32.615	2025-11-19 01:33:32.615	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
756	910	20	baseline	language	word	\N	2025-11-19 01:36:00.077	81	f	f	\N	2025-11-19 01:36:20.107	2025-11-19 01:36:20.107	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
775	1026	26	baseline	math	number_2digit	\N	2025-11-19 09:15:46.867	82	f	f	\N	2025-11-19 09:17:09.214	2025-11-19 09:17:09.214	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
795	1009	26	baseline	math	number_2digit	\N	2025-11-19 09:37:30.276	82	f	f	\N	2025-11-19 09:38:02.675	2025-11-19 09:38:02.675	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
809	472	21	baseline	language	word	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:13:33.43	2025-11-20 01:13:33.43	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
831	1072	4	baseline	language	beginner	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 02:38:18.056	2025-11-20 02:38:18.056	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
834	1058	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:41:42.288	2025-11-20 02:41:42.288	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
847	1106	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:25:01.901	2025-11-20 03:25:01.901	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
848	1103	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:26:48.814	2025-11-20 03:26:48.814	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
864	1088	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:45:59.12	2025-11-20 03:45:59.12	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
866	1090	11	baseline	math	division	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:48:25.926	2025-11-20 03:48:25.926	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
882	1123	3	baseline	language	comprehension1	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:22:11.153	2025-11-20 04:22:11.153	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
903	1121	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:44:20.191	2025-11-20 04:44:20.191	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
928	1075	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:55:06.524	2025-11-20 04:55:06.524	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
944	1129	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 05:33:26.674	2025-11-20 05:33:26.674	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
945	1182	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:35:46.343	2025-11-20 05:35:46.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
946	832	11	baseline	math	number_1digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 05:35:56.541	2025-11-20 05:35:56.541	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
958	1207	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:26:31.416	2025-11-20 06:26:31.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
972	1323	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 07:02:29.018	2025-11-20 07:02:29.018	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
987	986	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:33:21.266	2025-11-20 07:33:21.266	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
997	977	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:41:38.081	2025-11-20 07:41:38.081	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
998	976	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:42:14.979	2025-11-20 07:42:14.979	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1006	1427	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:47:39.012	2025-11-20 07:47:39.012	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1014	963	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:51:31.263	2025-11-20 07:51:31.263	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1020	959	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:54:39.411	2025-11-20 07:54:39.411	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1022	957	18	baseline	language	comprehension2	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:56:13.143	2025-11-20 07:56:13.143	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1024	955	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:57:59.29	2025-11-20 07:57:59.29	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1025	954	18	baseline	language	letter	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:58:44.056	2025-11-20 07:58:44.056	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1030	949	18	baseline	language	paragraph	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:00:51.662	2025-11-20 08:00:51.662	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1033	1475	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:02:08.08	2025-11-20 08:02:08.08	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
510	575	25	baseline	language	comprehension1	\N	2025-11-17 07:43:54.123	69	f	f	\N	2025-11-17 07:44:16.571	2025-11-17 07:44:16.571	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
527	555	19	baseline	language	story	\N	2025-11-17 09:03:23.978	65	f	f	\N	2025-11-17 09:03:45.437	2025-11-17 09:03:45.437	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
529	552	19	baseline	language	comprehension2	\N	2025-11-17 09:04:50.425	65	f	f	\N	2025-11-17 09:05:06.965	2025-11-17 09:05:06.965	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
548	603	25	baseline	language	comprehension2	\N	2025-11-17 11:30:13.843	69	f	f	\N	2025-11-17 11:30:32.172	2025-11-17 11:30:32.172	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
568	521	2	baseline	language	paragraph	\N	2025-11-17 15:16:23.569	41	f	f	\N	2025-11-17 15:17:07.708	2025-11-17 15:17:07.708	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
572	525	2	baseline	language	comprehension2	\N	2025-11-17 15:20:01.618	41	f	f	\N	2025-11-17 15:20:57.33	2025-11-17 15:20:57.33	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
591	503	21	baseline	language	comprehension2	\N	2025-11-18 08:07:35.197	115	f	f	\N	2025-11-18 08:09:11.199	2025-11-18 08:09:11.199	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
610	493	21	baseline	language	letter	\N	2025-11-18 08:33:23.436	115	f	f	\N	2025-11-18 08:33:59.377	2025-11-18 08:33:59.377	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
612	662	25	baseline	language	letter	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:35:10.142	2025-11-18 08:35:10.142	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
613	663	25	baseline	language	word	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:37:07.167	2025-11-18 08:37:07.167	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
628	710	25	baseline	language	word	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:01:37.382	2025-11-18 09:01:37.382	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
629	715	25	baseline	language	word	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:04:30.337	2025-11-18 09:04:30.337	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
642	837	13	baseline	math	number_2digit	\N	2025-11-18 10:17:13.239	52	f	f	\N	2025-11-18 10:17:46.194	2025-11-18 10:17:46.194	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
659	455	21	baseline	language	comprehension1	\N	2025-11-18 12:55:18.679	66	f	f	\N	2025-11-18 12:55:49.546	2025-11-18 12:55:49.546	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
680	849	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:31:33.913	2025-11-18 13:31:33.913	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
681	856	13	baseline	math	subtraction	\N	2025-11-18 13:31:21.786	52	f	f	\N	2025-11-18 13:31:43.981	2025-11-18 13:31:43.981	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
682	848	22	baseline	language	story	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:33:23.906	2025-11-18 13:33:23.906	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
683	857	13	baseline	math	number_2digit	\N	2025-11-18 13:32:45.928	52	f	f	\N	2025-11-18 13:33:30.523	2025-11-18 13:33:30.523	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
684	847	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:34:47.169	2025-11-18 13:34:47.169	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
686	846	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:36:00.327	2025-11-18 13:36:00.327	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
713	816	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:57:04.872	2025-11-18 13:57:04.872	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
733	735	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:20:25.107	2025-11-18 14:20:25.107	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
735	733	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:22:25.878	2025-11-18 14:22:25.878	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
736	732	22	baseline	language	word	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:23:32.036	2025-11-18 14:23:32.036	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
757	913	20	baseline	language	beginner	\N	2025-11-19 01:36:54.443	81	f	f	\N	2025-11-19 01:37:09.541	2025-11-19 01:37:09.541	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
776	1023	26	baseline	math	number_2digit	\N	2025-11-19 09:18:34.775	82	f	f	\N	2025-11-19 09:20:31.395	2025-11-19 09:20:31.395	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
797	1008	26	baseline	math	subtraction	\N	2025-11-19 09:38:29.057	82	f	f	\N	2025-11-19 09:39:01.841	2025-11-19 09:39:01.841	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
798	1020	26	baseline	math	number_1digit	\N	2025-11-19 09:38:33.556	62	f	f	\N	2025-11-19 09:39:11.334	2025-11-19 09:39:11.334	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
810	473	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:14:55.755	2025-11-20 01:14:55.755	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
812	475	21	baseline	language	comprehension1	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:16:36.333	2025-11-20 01:16:36.333	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
813	476	21	baseline	language	paragraph	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:17:16.893	2025-11-20 01:17:16.893	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
814	477	21	baseline	language	beginner	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:18:04.123	2025-11-20 01:18:04.123	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
815	488	21	baseline	language	word	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:19:07.684	2025-11-20 01:19:07.684	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
832	1060	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:39:02.7	2025-11-20 02:39:02.7	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
849	1102	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:28:09.264	2025-11-20 03:28:09.264	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
850	1078	11	baseline	math	division	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:29:49.074	2025-11-20 03:29:49.074	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
867	1091	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:50:38.903	2025-11-20 03:50:38.903	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
869	1093	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:55:05.04	2025-11-20 03:55:05.04	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
883	624	24	baseline	language	story	\N	2025-11-20 04:31:44.473	85	f	f	\N	2025-11-20 04:31:53.358	2025-11-20 04:31:53.358	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
904	769	24	baseline	language	word	\N	2025-11-20 04:44:00.526	85	f	f	\N	2025-11-20 04:44:22.512	2025-11-20 04:44:22.512	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
930	1073	3	baseline	language	word	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:56:54.798	2025-11-20 04:56:54.798	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
932	1070	3	baseline	language	letter	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:58:37.149	2025-11-20 04:58:37.149	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
934	1068	3	baseline	language	letter	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 05:00:37.332	2025-11-20 05:00:37.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
947	1183	14	baseline	math	word_problems	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:37:45.257	2025-11-20 05:37:45.257	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
948	1184	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:41:24.515	2025-11-20 05:41:24.515	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
959	1212	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:28:14.946	2025-11-20 06:28:14.946	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
973	1331	14	baseline	math	division	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 07:04:48.733	2025-11-20 07:04:48.733	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
511	532	19	baseline	language	paragraph	\N	2025-11-17 08:48:14.95	65	f	f	\N	2025-11-17 08:48:42.109	2025-11-17 08:48:42.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
528	551	19	baseline	language	story	\N	2025-11-17 09:04:07.883	65	f	f	\N	2025-11-17 09:04:29.45	2025-11-17 09:04:29.45	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
550	606	25	baseline	language	paragraph	\N	2025-11-17 11:33:02.801	69	f	f	\N	2025-11-17 11:33:23.659	2025-11-17 11:33:23.659	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
552	608	25	baseline	language	story	\N	2025-11-17 11:35:13.678	69	f	f	\N	2025-11-17 11:35:40.132	2025-11-17 11:35:40.132	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
569	522	2	baseline	language	comprehension1	\N	2025-11-17 15:17:28.754	41	f	f	\N	2025-11-17 15:18:03.155	2025-11-17 15:18:03.155	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
573	526	2	baseline	language	paragraph	\N	2025-11-17 15:21:11.219	41	f	f	\N	2025-11-17 15:21:33.684	2025-11-17 15:21:33.684	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
592	502	21	baseline	language	story	\N	2025-11-18 08:09:53.974	115	f	f	\N	2025-11-18 08:10:57.253	2025-11-18 08:10:57.253	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
611	471	21	baseline	language	paragraph	\N	2025-11-18 08:34:46.402	115	f	f	\N	2025-11-18 08:35:04.303	2025-11-18 08:35:04.303	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
630	718	25	baseline	language	comprehension1	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:06:04.561	2025-11-18 09:06:04.561	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
643	838	13	baseline	math	word_problems	\N	2025-11-18 10:20:19.451	52	f	f	\N	2025-11-18 10:21:22.764	2025-11-18 10:21:22.764	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
479	398	25	baseline	language	story	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 06:53:14.958	2025-11-18 10:44:59.229	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
478	399	25	baseline	language	word	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 06:51:41.725	2025-11-18 10:44:59.229	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
660	454	21	baseline	language	comprehension2	\N	2025-11-18 12:57:00.842	66	f	f	\N	2025-11-18 12:57:38.807	2025-11-18 12:57:38.807	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
661	453	21	baseline	language	comprehension1	\N	2025-11-18 12:58:22.48	66	f	f	\N	2025-11-18 12:58:58.784	2025-11-18 12:58:58.784	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
662	452	21	baseline	language	word	\N	2025-11-18 12:59:25.492	66	f	f	\N	2025-11-18 12:59:58.076	2025-11-18 12:59:58.076	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
685	858	13	baseline	math	number_2digit	\N	2025-11-18 13:34:44.491	52	f	f	\N	2025-11-18 13:35:16.388	2025-11-18 13:35:16.388	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
714	815	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:58:59.958	2025-11-18 13:58:59.958	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
717	812	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:02:04.655	2025-11-18 14:02:04.655	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
718	811	22	baseline	language	paragraph	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:03:15.88	2025-11-18 14:03:15.88	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
734	734	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:21:26.245	2025-11-18 14:21:26.245	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
758	914	20	baseline	language	letter	\N	2025-11-19 01:37:29.355	81	f	f	\N	2025-11-19 01:37:42.543	2025-11-19 01:37:42.543	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
777	1021	26	baseline	math	number_2digit	\N	2025-11-19 09:22:51.897	82	f	f	\N	2025-11-19 09:23:46.57	2025-11-19 09:23:46.57	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
799	1019	26	baseline	math	number_2digit	\N	2025-11-19 09:39:29.879	62	f	f	\N	2025-11-19 09:40:21.423	2025-11-19 09:40:21.423	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
489	408	26	baseline	math	subtraction	\N	2025-11-19 00:00:00	82	f	f	\N	2025-11-01 07:39:12.416	2025-11-19 13:05:49.213	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
811	474	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:15:37.815	2025-11-20 01:15:37.815	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
833	1059	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:40:25.343	2025-11-20 02:40:25.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
853	1079	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:33:02.005	2025-11-20 03:33:02.005	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
851	871	18	baseline	language	word	\N	2025-11-17 00:00:00	59	f	f	\N	2025-11-20 03:30:27.167	2025-11-20 03:42:03.647	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
868	1092	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	50	f	f	\N	2025-11-20 03:53:23.916	2025-11-20 03:53:23.916	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
884	625	24	baseline	language	story	\N	2025-11-20 04:32:08.977	85	f	f	\N	2025-11-20 04:32:33.049	2025-11-20 04:32:33.049	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
487	409	25	baseline	language	story	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:37:10.595	2025-11-01 07:37:10.595	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
885	626	24	baseline	language	comprehension2	\N	2025-11-20 04:32:49.715	85	f	f	\N	2025-11-20 04:33:14.617	2025-11-20 04:33:14.617	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
908	1119	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:45:43.293	2025-11-20 04:45:43.293	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
931	1071	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:57:38.646	2025-11-20 04:57:38.646	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
933	1069	3	baseline	language	comprehension1	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 04:59:21.204	2025-11-20 04:59:21.204	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
949	1185	14	baseline	math	division	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 05:56:50.603	2025-11-20 05:56:50.603	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
488	403	24	baseline	language	letter	\N	2025-11-16 17:00:00	85	f	f	\N	2025-11-01 07:37:37.361	2025-11-01 07:37:37.361	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
960	1220	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:30:16.086	2025-11-20 06:30:16.086	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
974	1339	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 07:06:40.148	2025-11-20 07:06:40.148	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
975	1332	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:06:50.732	2025-11-20 07:06:50.732	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
989	1398	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:34:28.843	2025-11-20 07:34:28.843	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
999	975	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:42:58.619	2025-11-20 07:42:58.619	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1007	968	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:47:43.825	2025-11-20 07:47:43.825	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1016	962	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:52:17.489	2025-11-20 07:52:17.489	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1023	956	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:57:06.259	2025-11-20 07:57:06.259	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1031	1476	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 08:01:22.061	2025-11-20 08:01:22.061	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
512	533	19	baseline	language	comprehension2	\N	2025-11-17 08:49:43.951	65	f	f	\N	2025-11-17 08:50:57.395	2025-11-17 08:50:57.395	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
482	400	25	baseline	language	word	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:27:30.942	2025-11-01 07:27:30.942	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
483	405	25	baseline	language	letter	\N	2025-11-16 17:00:00	69	f	f	\N	2025-11-01 07:31:51.793	2025-11-01 07:31:51.793	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
490	413	2	baseline	math	subtraction	\N	2025-11-16 17:00:00	54	f	f	\N	2025-11-01 07:41:29.863	2025-11-01 07:41:29.863	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
484	404	24	baseline	language	paragraph	\N	2025-11-16 17:00:00	85	f	f	\N	2025-11-01 07:31:57.334	2025-11-01 07:31:57.334	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
530	553	19	baseline	language	paragraph	\N	2025-11-17 09:05:23.832	65	f	f	\N	2025-11-17 09:05:40.872	2025-11-17 09:05:40.872	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
551	607	25	baseline	language	word	\N	2025-11-17 11:34:10.59	69	f	f	\N	2025-11-17 11:34:30.455	2025-11-17 11:34:30.455	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
553	609	25	baseline	language	letter	\N	2025-11-17 11:36:28.281	69	f	f	\N	2025-11-17 11:37:54.33	2025-11-17 11:37:54.33	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
571	524	2	baseline	language	story	\N	2025-11-17 15:19:11.653	41	f	f	\N	2025-11-17 15:19:41.454	2025-11-17 15:19:41.454	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
575	528	2	baseline	language	paragraph	\N	2025-11-17 15:22:37.054	41	f	f	\N	2025-11-17 15:23:03.931	2025-11-17 15:23:03.931	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
593	652	25	baseline	language	comprehension2	\N	2025-11-18 08:11:19.003	64	f	f	\N	2025-11-18 08:12:07.834	2025-11-18 08:12:07.834	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
614	666	25	baseline	language	comprehension1	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:39:27.354	2025-11-18 08:39:27.354	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
615	667	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:41:00.097	2025-11-18 08:41:00.097	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
616	668	25	baseline	language	comprehension2	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 08:42:33.025	2025-11-18 08:42:33.025	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
631	719	25	baseline	language	word	\N	2025-11-16 17:00:00	64	f	f	\N	2025-11-18 09:17:25.237	2025-11-18 09:17:25.237	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
644	470	21	baseline	language	comprehension2	\N	2025-11-18 12:31:54.082	66	f	f	\N	2025-11-18 12:32:52.131	2025-11-18 12:32:52.131	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
663	451	21	baseline	language	beginner	\N	2025-11-18 13:00:35.599	66	f	f	\N	2025-11-18 13:01:07.622	2025-11-18 13:01:07.622	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
687	859	13	baseline	math	number_2digit	\N	2025-11-18 13:36:10.684	52	f	f	\N	2025-11-18 13:36:55.703	2025-11-18 13:36:55.703	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
690	844	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:38:23.448	2025-11-18 13:38:23.448	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
692	843	22	baseline	language	comprehension1	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 13:39:37.993	2025-11-18 13:39:37.993	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
694	862	13	baseline	math	word_problems	\N	2025-11-18 13:40:34.563	52	f	f	\N	2025-11-18 13:40:55.602	2025-11-18 13:40:55.602	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
715	814	22	baseline	language	letter	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:00:03.352	2025-11-18 14:00:03.352	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
737	731	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:29:25.133	2025-11-18 14:29:25.133	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
738	727	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:30:31.171	2025-11-18 14:30:31.171	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
739	725	22	baseline	language	comprehension2	\N	2025-11-16 17:00:00	63	f	f	\N	2025-11-18 14:31:54.56	2025-11-18 14:31:54.56	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
759	916	20	baseline	language	word	\N	2025-11-19 01:38:19.331	81	f	f	\N	2025-11-19 01:39:04.875	2025-11-19 01:39:04.875	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
760	918	20	baseline	language	beginner	\N	2025-11-19 01:39:29.894	81	f	f	\N	2025-11-19 01:39:43.273	2025-11-19 01:39:43.273	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
762	922	20	baseline	language	beginner	\N	2025-11-19 01:41:14.119	81	f	f	\N	2025-11-19 01:41:28.21	2025-11-19 01:41:28.21	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
778	1018	26	baseline	math	number_2digit	\N	2025-11-19 09:26:10.338	82	f	f	\N	2025-11-19 09:26:57.164	2025-11-19 09:26:57.164	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
779	1017	26	baseline	math	number_2digit	\N	2025-11-19 09:27:43.788	82	f	f	\N	2025-11-19 09:28:25.636	2025-11-19 09:28:25.636	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
800	1046	26	baseline	math	subtraction	\N	2025-11-18 17:00:00	62	f	f	\N	2025-11-20 00:06:21.309	2025-11-20 00:06:21.309	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
816	478	21	baseline	language	story	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:20:04.104	2025-11-20 01:20:04.104	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
818	480	21	baseline	language	word	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:22:13.537	2025-11-20 01:22:13.537	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
819	481	21	baseline	language	comprehension1	\N	2025-11-17 17:00:00	115	f	f	\N	2025-11-20 01:23:08.71	2025-11-20 01:23:08.71	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
835	1057	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 02:42:42.556	2025-11-20 02:42:42.556	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
852	1097	14	baseline	math	number_2digit	\N	2025-11-17 08:00:00	46	f	f	\N	2025-11-20 03:31:20.12	2025-11-20 03:31:20.12	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
870	1094	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 03:56:18.861	2025-11-20 03:56:18.861	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
872	1098	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 04:00:31.59	2025-11-20 04:00:31.59	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
886	627	24	baseline	language	paragraph	\N	2025-11-20 04:33:30.062	85	f	f	\N	2025-11-20 04:33:47.648	2025-11-20 04:33:47.648	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
909	774	24	baseline	language	comprehension2	\N	2025-11-20 04:45:36.074	85	f	f	\N	2025-11-20 04:45:59.828	2025-11-20 04:45:59.828	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
935	1067	3	baseline	language	beginner	\N	2025-11-16 17:00:00	51	f	f	\N	2025-11-20 05:01:24.966	2025-11-20 05:01:24.966	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
950	1186	14	baseline	math	subtraction	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:02:10.304	2025-11-20 06:02:10.304	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
961	1228	14	baseline	math	division	\N	2025-11-17 08:00:00	24	f	f	\N	2025-11-20 06:33:22.994	2025-11-20 06:33:22.994	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
976	1383	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 07:24:03.69	2025-11-20 07:24:03.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
990	984	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:34:55.922	2025-11-20 07:34:55.922	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1000	974	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 07:43:43.73	2025-11-20 07:43:43.73	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1039	936	18	baseline	language	letter	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:04:26.686	2025-11-20 08:04:26.686	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1040	911	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:05:04.102	2025-11-20 08:05:04.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1713	2352	32	baseline	math	subtraction	\N	2025-11-20 15:35:37.392	79	f	f	\N	2025-11-20 15:36:23.767	2025-11-20 15:36:23.767	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1715	2253	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:37:31.225	2025-11-20 15:37:31.225	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1717	2357	32	baseline	math	division	\N	2025-11-20 15:37:53.651	79	f	f	\N	2025-11-20 15:38:42.534	2025-11-20 15:38:42.534	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1734	2398	31	baseline	math	division	តេស្ត	2025-11-20 23:49:32.618	72	f	f	\N	2025-11-20 23:50:07.219	2025-11-20 23:50:07.219	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1744	2408	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:02:10.567	72	f	f	\N	2025-11-21 00:02:45.034	2025-11-21 00:02:45.034	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1746	2412	31	baseline	math	division	តេស្ត	2025-11-21 00:04:17.363	72	f	f	\N	2025-11-21 00:05:03.297	2025-11-21 00:05:03.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1747	2413	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:05:27.113	72	f	f	\N	2025-11-21 00:05:59.757	2025-11-21 00:05:59.757	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1748	2414	31	baseline	math	word_problems	តេស្ត	2025-11-21 00:06:19.517	72	f	f	\N	2025-11-21 00:06:54.883	2025-11-21 00:06:54.883	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1756	2422	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:16:15.3	72	f	f	\N	2025-11-21 00:16:54.245	2025-11-21 00:16:54.245	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1767	2432	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:25:57.015	72	f	f	\N	2025-11-21 00:26:35.257	2025-11-21 00:26:35.257	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1769	2371	32	baseline	math	subtraction	\N	2025-11-21 00:28:50.463	79	f	f	\N	2025-11-21 00:30:04.349	2025-11-21 00:30:04.349	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1779	2384	32	baseline	math	subtraction	\N	2025-11-21 00:38:15.32	79	f	f	\N	2025-11-21 00:38:53.207	2025-11-21 00:38:53.207	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1789	2393	32	baseline	math	division	\N	2025-11-21 00:46:44.628	79	f	f	\N	2025-11-21 00:47:19.517	2025-11-21 00:47:19.517	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1790	2394	32	baseline	math	number_2digit	\N	2025-11-21 00:47:23.724	79	f	f	\N	2025-11-21 00:47:50.394	2025-11-21 00:47:50.394	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1793	2395	32	baseline	math	subtraction	\N	2025-11-21 00:47:53.44	79	f	f	\N	2025-11-21 00:48:19.949	2025-11-21 00:48:19.949	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1803	2518	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:00:37.289	2025-11-21 01:00:37.289	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1814	2586	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:12:34.819	2025-11-21 01:12:34.819	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1815	2532	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:12:41.956	2025-11-21 01:12:41.956	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1827	2626	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:23:21.841	2025-11-21 01:23:21.841	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1838	2479	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:26:54.392	2025-11-21 01:26:54.392	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1842	2469	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:28:03.854	2025-11-21 01:28:03.854	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1843	2584	10	baseline	math	division	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:28:04.925	2025-11-21 01:28:04.925	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1846	2581	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:28:51.627	2025-11-21 01:28:51.627	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1851	2462	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:30:20.646	2025-11-21 01:30:20.646	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1861	2551	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:33:46.858	2025-11-21 01:33:46.858	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1863	2605	28	baseline	math	number_1digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:34:20.42	2025-11-21 01:34:20.42	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1866	2549	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:35:10.269	2025-11-21 01:35:10.269	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1876	2542	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:38:57.215	2025-11-21 01:38:57.215	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1882	2557	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:40:01.803	2025-11-21 01:40:01.803	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1888	2512	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:41:27.085	2025-11-21 01:41:27.085	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1893	2676	6	baseline	language	story	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:43:18.891	2025-11-21 01:43:18.891	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1894	2567	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:43:36.366	2025-11-21 01:43:36.366	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1898	2509	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:44:23.297	2025-11-21 01:44:23.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1900	2504	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:44:57.679	2025-11-21 01:44:57.679	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1907	2693	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:50:49.638	2025-11-21 01:50:49.638	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1915	2701	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:58:52.675	2025-11-21 01:58:52.675	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1928	1467	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:10:09.084	2025-11-21 02:10:09.084	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1931	1387	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:13:09.933	2025-11-21 02:13:09.933	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1929	2705	30	baseline	math	number_2digit	\N	2025-11-18 00:00:00	57	f	f	\N	2025-11-21 02:11:01.183	2025-11-21 02:13:19.514	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1932	1386	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:13:50.859	2025-11-21 02:13:50.859	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1933	2708	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:14:24.417	2025-11-21 02:14:24.417	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1941	2718	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:22:00.21	2025-11-21 02:22:00.21	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1949	2728	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:28:11.305	2025-11-21 02:28:11.305	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1950	2729	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:28:53.917	2025-11-21 02:28:53.917	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1041	895	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:05:40.507	2025-11-20 08:05:40.507	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1714	2354	32	baseline	math	number_2digit	\N	2025-11-20 15:36:27.34	79	f	f	\N	2025-11-20 15:37:14.932	2025-11-20 15:37:14.932	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1716	2355	32	baseline	math	number_2digit	\N	2025-11-20 15:37:18.17	79	f	f	\N	2025-11-20 15:37:48.78	2025-11-20 15:37:48.78	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1718	2251	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:38:43.812	2025-11-20 15:38:43.812	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1719	2359	32	baseline	math	word_problems	\N	2025-11-20 15:38:46.079	79	f	f	\N	2025-11-20 15:39:33.404	2025-11-20 15:39:33.404	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1735	2399	31	baseline	math	word_problems	តេស្ត	2025-11-20 23:50:59.189	72	f	f	\N	2025-11-20 23:52:31.721	2025-11-20 23:52:31.721	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1738	2402	31	baseline	math	division	តេស្ត	2025-11-20 23:55:55.406	72	f	f	\N	2025-11-20 23:56:27.02	2025-11-20 23:56:27.02	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1745	2411	31	baseline	math	division	តេស្ត	2025-11-21 00:03:05.203	72	f	f	\N	2025-11-21 00:03:56.104	2025-11-21 00:03:56.104	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1757	2423	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:17:38.478	72	f	f	\N	2025-11-21 00:18:13.401	2025-11-21 00:18:13.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1758	2424	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:18:32.075	72	f	f	\N	2025-11-21 00:19:09.481	2025-11-21 00:19:09.481	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1761	2426	31	baseline	math	division	តេស្ត	2025-11-21 00:20:29.651	72	f	f	\N	2025-11-21 00:21:05.036	2025-11-21 00:21:05.036	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1768	2433	31	baseline	math	division	តេស្ត	2025-11-21 00:26:54.164	72	f	f	\N	2025-11-21 00:27:33.911	2025-11-21 00:27:33.911	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1780	2385	32	baseline	math	division	\N	2025-11-21 00:38:58.139	79	f	f	\N	2025-11-21 00:40:03.917	2025-11-21 00:40:03.917	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1791	2456	6	baseline	language	word	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:47:51.717	2025-11-21 00:47:51.717	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1804	2515	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:00:47.848	2025-11-21 01:00:47.848	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1816	2529	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:13:56.355	2025-11-21 01:13:56.355	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1817	2601	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:14:57.009	2025-11-21 01:14:57.009	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1818	2525	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:16:20.026	2025-11-21 01:16:20.026	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1828	2492	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:23:31.926	2025-11-21 01:23:31.926	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1844	2466	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:28:39.699	2025-11-21 01:28:39.699	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1845	2645	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:28:50.761	2025-11-21 01:28:50.761	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1852	2573	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:30:50.217	2025-11-21 01:30:50.217	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1857	2564	10	baseline	math	division	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:32:26.798	2025-11-21 01:32:26.798	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1858	2552	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:33:05.225	2025-11-21 01:33:05.225	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1859	2655	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:33:16.961	2025-11-21 01:33:16.961	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1862	2562	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:34:17.201	2025-11-21 01:34:17.201	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1879	2595	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:39:08.051	2025-11-21 01:39:08.051	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1890	2582	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:41:54.476	2025-11-21 01:41:54.476	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1896	2673	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:43:52.435	2025-11-21 01:43:52.435	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1897	2497	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:44:21.344	2025-11-21 01:44:21.344	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1908	2694	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:52:17.692	2025-11-21 01:52:17.692	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1916	2691	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 01:58:53.108	2025-11-21 01:58:53.108	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1930	1426	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:11:40.49	2025-11-21 02:11:40.49	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1942	2706	8	baseline	language	comprehension1	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 02:22:50.862	2025-11-21 02:22:50.862	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
1951	2647	8	baseline	language	story	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 02:29:29.572	2025-11-21 02:29:29.572	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1953	2733	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:30:46.735	2025-11-21 02:30:46.735	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1955	2735	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:32:20.807	2025-11-21 02:32:20.807	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1968	2751	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:41:11.979	2025-11-21 02:41:11.979	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1970	2752	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:42:07.008	2025-11-21 02:42:07.008	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1973	2754	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:43:34.04	2025-11-21 02:43:34.04	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1974	2726	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:43:47.332	2025-11-21 02:43:47.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1975	2755	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:44:15.651	2025-11-21 02:44:15.651	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1982	2761	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:48:14.909	2025-11-21 02:48:14.909	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1983	2760	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:48:37.927	2025-11-21 02:48:37.927	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1992	2769	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 02:59:43.173	2025-11-21 02:59:43.173	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1993	2770	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:00:35.719	2025-11-21 03:00:35.719	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1042	1486	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:06:11.029	2025-11-20 08:06:11.029	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1043	893	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:06:14.059	2025-11-20 08:06:14.059	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1044	891	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:06:46	2025-11-20 08:06:46	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1045	889	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:07:22.028	2025-11-20 08:07:22.028	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1046	888	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:07:59.116	2025-11-20 08:07:59.116	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1047	886	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:08:33.85	2025-11-20 08:08:33.85	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1048	885	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:09:16.276	2025-11-20 08:09:16.276	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1049	884	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:10:05.117	2025-11-20 08:10:05.117	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1050	883	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:10:46.753	2025-11-20 08:10:46.753	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1051	882	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:11:18.922	2025-11-20 08:11:18.922	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1052	881	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:11:50.976	2025-11-20 08:11:50.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1053	1500	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:12:16.656	2025-11-20 08:12:16.656	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1054	880	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:12:29.003	2025-11-20 08:12:29.003	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1055	879	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:13:20.569	2025-11-20 08:13:20.569	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1056	878	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:14:00.606	2025-11-20 08:14:00.606	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1057	877	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:14:38.351	2025-11-20 08:14:38.351	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1058	876	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:15:24.69	2025-11-20 08:15:24.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1059	875	18	baseline	language	story	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:15:59.482	2025-11-20 08:15:59.482	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1060	874	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:16:29.869	2025-11-20 08:16:29.869	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1061	873	18	baseline	language	comprehension1	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:17:10.133	2025-11-20 08:17:10.133	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1062	872	18	baseline	language	word	\N	2025-11-16 17:00:00	59	f	f	\N	2025-11-20 08:17:40.03	2025-11-20 08:17:40.03	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1063	1516	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:22:43.048	2025-11-20 08:22:43.048	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1064	1522	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:24:42.246	2025-11-20 08:24:42.246	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1065	1446	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:26:01.229	2025-11-20 08:26:01.229	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1066	887	20	baseline	language	comprehension1	\N	2025-11-20 08:23:56.404	81	f	f	\N	2025-11-20 08:26:35.041	2025-11-20 08:26:35.041	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1067	1549	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:31:06.848	2025-11-20 08:31:06.848	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1068	1429	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:34:00.588	2025-11-20 08:34:00.588	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1069	892	20	baseline	language	comprehension1	\N	2025-11-20 08:31:15.403	81	f	f	\N	2025-11-20 08:35:45.069	2025-11-20 08:35:45.069	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1070	1432	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:35:53.164	2025-11-20 08:35:53.164	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1071	1559	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:36:51.332	2025-11-20 08:36:51.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1072	1435	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:37:06.507	2025-11-20 08:37:06.507	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1073	1561	4	baseline	language	word	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 08:37:25.841	2025-11-20 08:37:25.841	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1074	894	20	baseline	language	paragraph	\N	2025-11-20 08:36:34.567	81	f	f	\N	2025-11-20 08:37:30.353	2025-11-20 08:37:30.353	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1075	898	20	baseline	language	paragraph	\N	2025-11-20 08:37:38.964	81	f	f	\N	2025-11-20 08:38:09.266	2025-11-20 08:38:09.266	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1076	899	20	baseline	language	comprehension1	\N	2025-11-20 08:38:14.411	81	f	f	\N	2025-11-20 08:38:48.861	2025-11-20 08:38:48.861	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1077	900	20	baseline	language	paragraph	\N	2025-11-20 08:38:56.035	81	f	f	\N	2025-11-20 08:39:19.256	2025-11-20 08:39:19.256	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1078	902	20	baseline	language	word	\N	2025-11-20 08:39:29.432	81	f	f	\N	2025-11-20 08:40:27.308	2025-11-20 08:40:27.308	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1079	1584	26	baseline	math	subtraction	\N	2025-11-20 08:42:32.228	82	f	f	\N	2025-11-20 08:43:05.243	2025-11-20 08:43:05.243	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1080	903	20	baseline	language	paragraph	\N	2025-11-20 08:42:56.965	81	f	f	\N	2025-11-20 08:43:21.909	2025-11-20 08:43:21.909	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1081	904	20	baseline	language	story	\N	2025-11-20 08:43:26.344	81	f	f	\N	2025-11-20 08:44:19.248	2025-11-20 08:44:19.248	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1082	1599	6	baseline	language	word	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:44:32.21	2025-11-20 08:44:32.21	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1083	1602	26	baseline	math	subtraction	\N	2025-11-20 08:44:11.408	82	f	f	\N	2025-11-20 08:44:36.458	2025-11-20 08:44:36.458	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1084	1596	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:45:33.037	2025-11-20 08:45:33.037	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1085	905	20	baseline	language	story	\N	2025-11-20 08:45:14.182	81	f	f	\N	2025-11-20 08:46:13.408	2025-11-20 08:46:13.408	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1086	1605	26	baseline	math	subtraction	\N	2025-11-20 08:45:59.79	82	f	f	\N	2025-11-20 08:46:41.067	2025-11-20 08:46:41.067	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1087	907	20	baseline	language	comprehension2	\N	2025-11-20 08:47:08.522	81	f	f	\N	2025-11-20 08:47:26.808	2025-11-20 08:47:26.808	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1088	1581	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:47:39.277	2025-11-20 08:47:39.277	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1089	1610	26	baseline	math	division	\N	2025-11-20 08:47:45.004	82	f	f	\N	2025-11-20 08:48:14.022	2025-11-20 08:48:14.022	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1090	1616	26	baseline	math	subtraction	\N	2025-11-20 08:49:22.96	82	f	f	\N	2025-11-20 08:49:47.863	2025-11-20 08:49:47.863	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1091	1583	6	baseline	language	letter	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:51:31.089	2025-11-20 08:51:31.089	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1092	908	20	baseline	language	story	\N	2025-11-20 08:51:47.811	81	f	f	\N	2025-11-20 08:52:32.234	2025-11-20 08:52:32.234	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1093	1626	26	baseline	math	subtraction	\N	2025-11-20 08:52:29.724	82	f	f	\N	2025-11-20 08:52:52.767	2025-11-20 08:52:52.767	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1094	909	20	baseline	language	paragraph	\N	2025-11-20 08:52:42.929	81	f	f	\N	2025-11-20 08:53:04.457	2025-11-20 08:53:04.457	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1095	1629	6	baseline	language	word	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-20 08:53:34.458	2025-11-20 08:53:34.458	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1096	912	20	baseline	language	story	\N	2025-11-20 08:53:09.724	81	f	f	\N	2025-11-20 08:53:40.869	2025-11-20 08:53:40.869	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1097	915	20	baseline	language	story	\N	2025-11-20 08:53:51.248	81	f	f	\N	2025-11-20 08:54:16.007	2025-11-20 08:54:16.007	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1098	1636	26	baseline	math	word_problems	\N	2025-11-20 08:53:57.437	82	f	f	\N	2025-11-20 08:54:29.6	2025-11-20 08:54:29.6	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1099	1633	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 08:55:28.737	2025-11-20 08:55:28.737	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1100	1640	26	baseline	math	number_2digit	\N	2025-11-20 08:55:27.242	82	f	f	\N	2025-11-20 08:55:50.042	2025-11-20 08:55:50.042	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1101	917	20	baseline	language	comprehension2	\N	2025-11-20 08:55:12.55	81	f	f	\N	2025-11-20 08:55:52.901	2025-11-20 08:55:52.901	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1102	919	20	baseline	language	story	\N	2025-11-20 08:55:57.698	81	f	f	\N	2025-11-20 08:56:57.982	2025-11-20 08:56:57.982	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1103	1645	26	baseline	math	subtraction	\N	2025-11-20 08:56:48.526	82	f	f	\N	2025-11-20 08:57:14.731	2025-11-20 08:57:14.731	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1104	1652	26	baseline	math	division	\N	2025-11-20 08:58:24.426	82	f	f	\N	2025-11-20 08:58:57.762	2025-11-20 08:58:57.762	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1105	1657	26	baseline	math	subtraction	\N	2025-11-20 08:59:53.529	82	f	f	\N	2025-11-20 09:00:22.912	2025-11-20 09:00:22.912	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1106	923	20	baseline	language	beginner	\N	2025-11-20 08:57:03.033	81	f	f	\N	2025-11-20 09:00:40.697	2025-11-20 09:00:40.697	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1107	1650	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 09:01:06.267	2025-11-20 09:01:06.267	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1108	927	20	baseline	language	paragraph	\N	2025-11-20 09:00:44.123	81	f	f	\N	2025-11-20 09:01:46.476	2025-11-20 09:01:46.476	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1109	1661	26	baseline	math	subtraction	\N	2025-11-20 09:01:48.988	82	f	f	\N	2025-11-20 09:02:10.754	2025-11-20 09:02:10.754	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1110	928	20	baseline	language	comprehension1	\N	2025-11-20 09:01:52.513	81	f	f	\N	2025-11-20 09:02:41.091	2025-11-20 09:02:41.091	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1111	929	20	baseline	language	paragraph	\N	2025-11-20 09:02:48.446	81	f	f	\N	2025-11-20 09:03:25.037	2025-11-20 09:03:25.037	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1112	1664	26	baseline	math	subtraction	\N	2025-11-20 09:03:03.103	82	f	f	\N	2025-11-20 09:03:32.438	2025-11-20 09:03:32.438	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1113	931	20	baseline	language	comprehension1	\N	2025-11-20 09:03:35.326	81	f	f	\N	2025-11-20 09:03:52.958	2025-11-20 09:03:52.958	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1114	1668	26	baseline	math	division	\N	2025-11-20 09:04:44.264	82	f	f	\N	2025-11-20 09:05:15.533	2025-11-20 09:05:15.533	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1115	934	20	baseline	language	comprehension2	\N	2025-11-20 09:03:57.346	81	f	f	\N	2025-11-20 09:05:23.572	2025-11-20 09:05:23.572	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1116	935	20	baseline	language	paragraph	\N	2025-11-20 09:05:34.867	81	f	f	\N	2025-11-20 09:05:49.381	2025-11-20 09:05:49.381	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1117	1669	26	baseline	math	word_problems	\N	2025-11-20 09:06:14.84	82	f	f	\N	2025-11-20 09:06:48.702	2025-11-20 09:06:48.702	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1118	937	20	baseline	language	comprehension1	\N	2025-11-20 09:05:52.258	81	f	f	\N	2025-11-20 09:06:53.718	2025-11-20 09:06:53.718	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1119	1671	26	baseline	math	subtraction	\N	2025-11-20 09:07:35.186	82	f	f	\N	2025-11-20 09:08:01.686	2025-11-20 09:08:01.686	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1120	1211	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 09:09:08.468	2025-11-20 09:09:08.468	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1121	1678	26	baseline	math	number_2digit	\N	2025-11-20 09:10:57.627	62	f	f	\N	2025-11-20 09:11:23.274	2025-11-20 09:11:23.274	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1122	945	20	baseline	language	story	\N	2025-11-20 09:07:03.07	81	f	f	\N	2025-11-20 09:12:29.568	2025-11-20 09:12:29.568	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1123	1684	26	baseline	math	subtraction	\N	2025-11-20 09:12:29.741	62	f	f	\N	2025-11-20 09:13:39.499	2025-11-20 09:13:39.499	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1124	947	20	baseline	language	story	\N	2025-11-20 09:13:19.885	81	f	f	\N	2025-11-20 09:13:45.721	2025-11-20 09:13:45.721	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1125	1682	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 09:14:54.388	2025-11-20 09:14:54.388	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1126	950	20	baseline	language	story	\N	2025-11-20 09:13:51.724	81	f	f	\N	2025-11-20 09:15:11.864	2025-11-20 09:15:11.864	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1127	1667	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 09:15:42.698	2025-11-20 09:15:42.698	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1128	1665	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 09:17:16.651	2025-11-20 09:17:16.651	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1129	1688	26	baseline	math	subtraction	\N	2025-11-20 09:17:14.392	62	f	f	\N	2025-11-20 09:17:54.182	2025-11-20 09:17:54.182	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1130	1696	26	baseline	math	number_2digit	\N	2025-11-20 09:19:05.692	62	f	f	\N	2025-11-20 09:19:35.254	2025-11-20 09:19:35.254	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1131	1700	26	baseline	math	subtraction	\N	2025-11-20 09:21:04.761	62	f	f	\N	2025-11-20 09:21:38.769	2025-11-20 09:21:38.769	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1132	1705	26	baseline	math	subtraction	\N	2025-11-20 09:22:20.486	62	f	f	\N	2025-11-20 09:22:50.112	2025-11-20 09:22:50.112	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1133	1706	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 09:23:33.384	2025-11-20 09:23:33.384	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1134	1709	26	baseline	math	number_2digit	\N	2025-11-20 09:23:51.861	62	f	f	\N	2025-11-20 09:24:21.382	2025-11-20 09:24:21.382	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1135	1712	26	baseline	math	subtraction	\N	2025-11-20 09:25:14.156	62	f	f	\N	2025-11-20 09:26:02.006	2025-11-20 09:26:02.006	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1136	1720	26	baseline	math	division	\N	2025-11-20 09:27:04.133	62	f	f	\N	2025-11-20 09:28:02.156	2025-11-20 09:28:02.156	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1137	1718	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:28:33.973	2025-11-20 09:28:33.973	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1138	1723	26	baseline	math	number_2digit	\N	2025-11-20 09:28:52.22	62	f	f	\N	2025-11-20 09:29:20.905	2025-11-20 09:29:20.905	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1139	1726	26	baseline	math	word_problems	\N	2025-11-20 09:30:09.985	62	f	f	\N	2025-11-20 09:31:11.979	2025-11-20 09:31:11.979	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1140	1728	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:32:14.76	2025-11-20 09:32:14.76	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1141	1736	26	baseline	math	word_problems	\N	2025-11-20 09:34:09.232	62	f	f	\N	2025-11-20 09:34:35.704	2025-11-20 09:34:35.704	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1142	1735	11	baseline	math	number_1digit	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:35:30.746	2025-11-20 09:35:30.746	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1143	1739	26	baseline	math	subtraction	\N	2025-11-20 09:35:38.986	62	f	f	\N	2025-11-20 09:36:05.824	2025-11-20 09:36:05.824	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1144	1743	26	baseline	math	number_2digit	\N	2025-11-20 09:37:24.898	62	f	f	\N	2025-11-20 09:37:54.269	2025-11-20 09:37:54.269	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1145	1746	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:40:40.424	2025-11-20 09:40:40.424	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1146	1748	26	baseline	math	subtraction	\N	2025-11-20 09:39:58.571	62	f	f	\N	2025-11-20 09:40:41.09	2025-11-20 09:40:41.09	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1147	1749	4	baseline	language	letter	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:42:25.648	2025-11-20 09:42:25.648	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1148	1750	26	baseline	math	number_2digit	\N	2025-11-20 09:42:01.172	62	f	f	\N	2025-11-20 09:42:32.928	2025-11-20 09:42:32.928	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1149	1753	26	baseline	math	number_1digit	\N	2025-11-20 09:43:36.791	62	f	f	\N	2025-11-20 09:44:12.916	2025-11-20 09:44:12.916	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1150	1752	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:44:15.443	2025-11-20 09:44:15.443	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1151	1751	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:44:26.721	2025-11-20 09:44:26.721	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1152	1756	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:46:25.574	2025-11-20 09:46:25.574	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1153	1760	26	baseline	math	number_2digit	\N	2025-11-20 09:46:44.282	62	f	f	\N	2025-11-20 09:47:04.185	2025-11-20 09:47:04.185	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1154	1759	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:48:26.811	2025-11-20 09:48:26.811	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1155	1761	26	baseline	math	subtraction	\N	2025-11-20 09:48:00.994	62	f	f	\N	2025-11-20 09:48:29.346	2025-11-20 09:48:29.346	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1156	1763	26	baseline	math	subtraction	\N	2025-11-20 09:49:46.354	62	f	f	\N	2025-11-20 09:50:10.969	2025-11-20 09:50:10.969	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1157	1762	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:50:13.446	2025-11-20 09:50:13.446	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1158	1764	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:51:17.868	2025-11-20 09:51:17.868	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1159	1766	26	baseline	math	word_problems	\N	2025-11-20 09:51:19.698	62	f	f	\N	2025-11-20 09:51:52.51	2025-11-20 09:51:52.51	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1160	1767	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:52:18.633	2025-11-20 09:52:18.633	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1161	1770	26	baseline	math	number_2digit	\N	2025-11-20 09:53:05.168	62	f	f	\N	2025-11-20 09:53:37.502	2025-11-20 09:53:37.502	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1162	1772	4	baseline	language	word	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:54:52.749	2025-11-20 09:54:52.749	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1163	1773	26	baseline	math	number_2digit	\N	2025-11-20 09:54:33.488	62	f	f	\N	2025-11-20 09:54:59.677	2025-11-20 09:54:59.677	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1164	1768	11	baseline	math	division	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:55:06.857	2025-11-20 09:55:06.857	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1165	1777	26	baseline	math	number_2digit	\N	2025-11-20 09:56:15.244	62	f	f	\N	2025-11-20 09:56:36.692	2025-11-20 09:56:36.692	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1166	1778	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 09:57:21.96	2025-11-20 09:57:21.96	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1167	1782	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 09:59:33.093	2025-11-20 09:59:33.093	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1168	1785	26	baseline	math	number_2digit	\N	2025-11-20 09:59:24.105	62	f	f	\N	2025-11-20 09:59:52.453	2025-11-20 09:59:52.453	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1169	1789	26	baseline	math	subtraction	\N	2025-11-20 10:00:45.208	62	f	f	\N	2025-11-20 10:01:07.643	2025-11-20 10:01:07.643	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1170	1791	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	50	f	f	\N	2025-11-20 10:02:17.95	2025-11-20 10:02:17.95	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1171	1790	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 10:02:20.041	2025-11-20 10:02:20.041	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1172	1796	26	baseline	math	subtraction	\N	2025-11-20 10:02:04.498	62	f	f	\N	2025-11-20 10:02:35.367	2025-11-20 10:02:35.367	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1173	1798	26	baseline	math	number_2digit	\N	2025-11-20 10:03:21.392	62	f	f	\N	2025-11-20 10:03:38.992	2025-11-20 10:03:38.992	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1174	1805	26	baseline	math	subtraction	\N	2025-11-20 10:04:37.686	62	f	f	\N	2025-11-20 10:05:07.376	2025-11-20 10:05:07.376	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1175	1819	26	baseline	math	number_2digit	\N	2025-11-20 10:06:17.469	62	f	f	\N	2025-11-20 10:06:44.252	2025-11-20 10:06:44.252	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1176	1818	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 10:07:43.032	2025-11-20 10:07:43.032	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1177	1823	26	baseline	math	subtraction	\N	2025-11-20 10:07:40.536	62	f	f	\N	2025-11-20 10:08:08.256	2025-11-20 10:08:08.256	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1178	1826	26	baseline	math	subtraction	\N	2025-11-20 10:08:50.484	62	f	f	\N	2025-11-20 10:09:19.167	2025-11-20 10:09:19.167	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1179	1830	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 10:10:15.365	2025-11-20 10:10:15.365	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1180	1844	26	baseline	math	number_2digit	\N	2025-11-20 10:12:04.988	62	f	f	\N	2025-11-20 10:12:36.466	2025-11-20 10:12:36.466	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1181	1840	11	baseline	math	subtraction	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 10:12:37.837	2025-11-20 10:12:37.837	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1182	1849	26	baseline	math	subtraction	\N	2025-11-20 10:13:16.499	62	f	f	\N	2025-11-20 10:13:49.435	2025-11-20 10:13:49.435	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1183	1853	11	baseline	math	number_2digit	\N	2025-11-17 17:00:00	117	f	f	\N	2025-11-20 10:15:33.416	2025-11-20 10:15:33.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1184	1232	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 10:19:10.508	2025-11-20 10:19:10.508	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1185	1590	11	baseline	math	subtraction	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 10:21:33.108	2025-11-20 10:21:33.108	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1186	1884	24	baseline	language	story	\N	2025-11-20 10:22:28.403	85	f	f	\N	2025-11-20 10:22:42.282	2025-11-20 10:22:42.282	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1187	1888	24	baseline	language	story	\N	2025-11-20 10:23:47.394	85	f	f	\N	2025-11-20 10:24:15.185	2025-11-20 10:24:15.185	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1188	1897	24	baseline	language	paragraph	\N	2025-11-20 10:25:25.228	85	f	f	\N	2025-11-20 10:25:46.559	2025-11-20 10:25:46.559	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1189	1906	24	baseline	language	word	\N	2025-11-20 10:27:58.747	85	f	f	\N	2025-11-20 10:28:45.843	2025-11-20 10:28:45.843	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1190	1922	24	baseline	language	beginner	\N	2025-11-20 10:32:27.328	85	f	f	\N	2025-11-20 10:32:56.471	2025-11-20 10:32:56.471	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1191	1926	24	baseline	language	paragraph	\N	2025-11-20 10:33:41.42	85	f	f	\N	2025-11-20 10:34:11.132	2025-11-20 10:34:11.132	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1192	1933	24	baseline	language	story	\N	2025-11-20 10:35:00.336	85	f	f	\N	2025-11-20 10:35:30.904	2025-11-20 10:35:30.904	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1193	1754	17	baseline	math	subtraction	1	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 10:51:10.434	2025-11-20 10:51:10.434	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1194	1769	17	baseline	math	number_2digit	2	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 10:55:31.907	2025-11-20 10:55:31.907	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1195	1771	17	baseline	math	number_2digit	3	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 10:57:33.181	2025-11-20 10:57:33.181	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1196	1960	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 10:59:00.015	2025-11-20 10:59:00.015	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1197	620	23	baseline	language	letter	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 10:59:08.121	2025-11-20 10:59:08.121	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1198	1774	17	baseline	math	subtraction	4	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 10:59:17.494	2025-11-20 10:59:17.494	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1199	621	23	baseline	language	letter	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:00:32.124	2025-11-20 11:00:32.124	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1200	1961	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:00:51.632	2025-11-20 11:00:51.632	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1201	1779	17	baseline	math	number_2digit	5	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:01:10.363	2025-11-20 11:01:10.363	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1202	622	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:02:01.926	2025-11-20 11:02:01.926	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1203	1962	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:02:31.153	2025-11-20 11:02:31.153	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1204	632	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:03:17.851	2025-11-20 11:03:17.851	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1205	1783	17	baseline	math	subtraction	6	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:03:58.765	2025-11-20 11:03:58.765	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1206	633	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:04:51.251	2025-11-20 11:04:51.251	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1207	1965	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:05:29.823	2025-11-20 11:05:29.823	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1208	1784	17	baseline	math	subtraction	7	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:05:39.129	2025-11-20 11:05:39.129	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1209	634	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:05:52.766	2025-11-20 11:05:52.766	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1210	635	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:06:50.272	2025-11-20 11:06:50.272	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1211	1966	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:07:03.363	2025-11-20 11:07:03.363	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1212	1786	17	baseline	math	subtraction	8	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:07:47.234	2025-11-20 11:07:47.234	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1213	1967	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:08:41.208	2025-11-20 11:08:41.208	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1214	1787	17	baseline	math	subtraction	9	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:09:55.549	2025-11-20 11:09:55.549	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1215	1968	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:10:13.295	2025-11-20 11:10:13.295	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1216	1794	17	baseline	math	subtraction	10	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:11:46.681	2025-11-20 11:11:46.681	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1217	1969	4	baseline	language	word	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:11:55.788	2025-11-20 11:11:55.788	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1218	1970	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:13:28.678	2025-11-20 11:13:28.678	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1219	1797	17	baseline	math	number_2digit	11	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:15:53.822	2025-11-20 11:15:53.822	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1220	676	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:16:32.436	2025-11-20 11:16:32.436	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1221	1971	4	baseline	language	paragraph	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:17:03.91	2025-11-20 11:17:03.91	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1222	729	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:17:44.303	2025-11-20 11:17:44.303	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1223	1812	17	baseline	math	subtraction	12	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:17:46.333	2025-11-20 11:17:46.333	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1224	1654	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:18:19.983	2025-11-20 11:18:19.983	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1225	1972	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:19:04.551	2025-11-20 11:19:04.551	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1226	1832	17	baseline	math	subtraction	13	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:19:18.249	2025-11-20 11:19:18.249	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1227	1651	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:20:14.435	2025-11-20 11:20:14.435	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1228	1973	4	baseline	language	word	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:20:25.515	2025-11-20 11:20:25.515	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1229	1835	17	baseline	math	subtraction	14	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 11:20:52.48	2025-11-20 11:20:52.48	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1230	1974	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:21:36.693	2025-11-20 11:21:36.693	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1231	728	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:22:20.775	2025-11-20 11:22:20.775	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1232	1975	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:22:56.323	2025-11-20 11:22:56.323	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1233	1648	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:23:04.879	2025-11-20 11:23:04.879	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1234	1976	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:24:16.191	2025-11-20 11:24:16.191	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1235	1977	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:25:25.632	2025-11-20 11:25:25.632	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1236	1646	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:26:29.771	2025-11-20 11:26:29.771	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1237	726	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:26:43.967	2025-11-20 11:26:43.967	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1238	723	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:27:43.989	2025-11-20 11:27:43.989	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1239	1978	4	baseline	language	paragraph	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:27:47.366	2025-11-20 11:27:47.366	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1240	1641	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:28:32.254	2025-11-20 11:28:32.254	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1241	721	23	baseline	language	story	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:28:57.011	2025-11-20 11:28:57.011	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1242	1979	4	baseline	language	word	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:29:28.662	2025-11-20 11:29:28.662	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1243	1980	4	baseline	language	story	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:30:59.82	2025-11-20 11:30:59.82	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1244	1637	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:31:59.13	2025-11-20 11:31:59.13	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1245	1981	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:32:31.537	2025-11-20 11:32:31.537	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1246	1982	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:34:39.64	2025-11-20 11:34:39.64	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1247	1473	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:35:16.23	2025-11-20 11:35:16.23	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1248	1985	4	baseline	language	paragraph	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:36:55.81	2025-11-20 11:36:55.81	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1249	717	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:38:03.181	2025-11-20 11:38:03.181	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1250	1618	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:38:14.651	2025-11-20 11:38:14.651	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1251	1986	4	baseline	language	word	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:38:35.481	2025-11-20 11:38:35.481	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1252	711	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:39:05.828	2025-11-20 11:39:05.828	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1253	1987	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:39:56.566	2025-11-20 11:39:56.566	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1254	708	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:39:59.892	2025-11-20 11:39:59.892	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1255	1007	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:40:18.395	2025-11-20 11:40:18.395	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1256	1478	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:40:45.677	2025-11-20 11:40:45.677	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1257	705	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:41:04.697	2025-11-20 11:41:04.697	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1258	1988	4	baseline	language	paragraph	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:41:15.968	2025-11-20 11:41:15.968	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1259	704	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:42:05.747	2025-11-20 11:42:05.747	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1260	1006	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:42:33.593	2025-11-20 11:42:33.593	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1261	1989	4	baseline	language	beginner	0	2025-11-16 17:00:00	22	f	f	\N	2025-11-20 11:42:37.85	2025-11-20 11:42:37.85	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1262	1480	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:42:39.897	2025-11-20 11:42:39.897	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1263	701	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:43:07.733	2025-11-20 11:43:07.733	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1264	699	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:44:09.646	2025-11-20 11:44:09.646	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1265	1005	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:44:17.136	2025-11-20 11:44:17.136	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1266	698	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:45:35.631	2025-11-20 11:45:35.631	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1267	757	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:45:44.199	2025-11-20 11:45:44.199	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1268	1617	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:46:42.119	2025-11-20 11:46:42.119	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1269	756	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:47:01.44	2025-11-20 11:47:01.44	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1270	696	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:48:03.268	2025-11-20 11:48:03.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1271	1506	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:48:15.52	2025-11-20 11:48:15.52	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1272	755	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:48:17.864	2025-11-20 11:48:17.864	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1273	693	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:49:03.599	2025-11-20 11:49:03.599	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1274	690	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:50:08.426	2025-11-20 11:50:08.426	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1275	1565	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:50:11.722	2025-11-20 11:50:11.722	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1276	688	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:51:03.727	2025-11-20 11:51:03.727	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1277	754	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:51:56.799	2025-11-20 11:51:56.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1278	1615	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:52:28.757	2025-11-20 11:52:28.757	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1279	753	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:52:47.069	2025-11-20 11:52:47.069	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1280	685	23	baseline	language	story	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:52:52.219	2025-11-20 11:52:52.219	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1281	1603	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:53:51.118	2025-11-20 11:53:51.118	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1282	684	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:53:52.922	2025-11-20 11:53:52.922	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1283	681	23	baseline	language	word	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:54:46.672	2025-11-20 11:54:46.672	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1284	1512	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:55:41.336	2025-11-20 11:55:41.336	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1285	678	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	76	f	f	\N	2025-11-20 11:55:54.099	2025-11-20 11:55:54.099	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1286	752	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:56:25.348	2025-11-20 11:56:25.348	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1287	1612	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:57:07.055	2025-11-20 11:57:07.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1288	751	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:57:20.182	2025-11-20 11:57:20.182	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1289	750	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:58:24.049	2025-11-20 11:58:24.049	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1290	1609	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 11:58:36.947	2025-11-20 11:58:36.947	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1291	749	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 11:59:18.462	2025-11-20 11:59:18.462	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1292	1606	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:00:16.955	2025-11-20 12:00:16.955	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1293	747	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:00:36.477	2025-11-20 12:00:36.477	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1294	748	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:01:01.83	2025-11-20 12:01:01.83	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1295	1598	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:01:56.153	2025-11-20 12:01:56.153	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1296	746	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:02:07.567	2025-11-20 12:02:07.567	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1297	745	23	baseline	language	story	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:02:14.794	2025-11-20 12:02:14.794	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1298	1586	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:03:13.122	2025-11-20 12:03:13.122	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1299	744	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:03:48.102	2025-11-20 12:03:48.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1300	743	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:03:53.385	2025-11-20 12:03:53.385	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1301	1839	17	baseline	math	subtraction	15	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:03:57.51	2025-11-20 12:03:57.51	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1302	1582	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:04:34.174	2025-11-20 12:04:34.174	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1303	742	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:04:55.603	2025-11-20 12:04:55.603	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1304	741	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:05:05.969	2025-11-20 12:05:05.969	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1305	1845	17	baseline	math	number_2digit	16	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:05:30.165	2025-11-20 12:05:30.165	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1306	1579	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:06:04.073	2025-11-20 12:06:04.073	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1307	1850	17	baseline	math	subtraction	17	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:07:13.135	2025-11-20 12:07:13.135	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1308	1578	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:07:24.12	2025-11-20 12:07:24.12	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1309	675	23	baseline	language	comprehension2	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:07:59.642	2025-11-20 12:07:59.642	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1310	1856	17	baseline	math	subtraction	18	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:08:34.129	2025-11-20 12:08:34.129	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1311	1573	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:09:05.466	2025-11-20 12:09:05.466	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1312	1860	17	baseline	math	subtraction	19	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:09:57.878	2025-11-20 12:09:57.878	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1313	1568	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:10:15.357	2025-11-20 12:10:15.357	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1314	672	23	baseline	language	comprehension1	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:11:37.369	2025-11-20 12:11:37.369	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1315	1567	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:11:52.788	2025-11-20 12:11:52.788	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1316	1875	17	baseline	math	subtraction	20	2025-11-16 17:00:00	54	f	f	\N	2025-11-20 12:12:13.288	2025-11-20 12:12:13.288	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1317	1878	17	baseline	math	subtraction	21	2025-11-17 17:00:00	54	f	f	\N	2025-11-20 12:13:46.297	2025-11-20 12:13:46.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1318	1885	17	baseline	math	subtraction	22	2025-11-17 17:00:00	54	f	f	\N	2025-11-20 12:15:14.549	2025-11-20 12:15:14.549	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1319	651	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:16:36.771	2025-11-20 12:16:36.771	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1320	1889	17	baseline	math	subtraction	23	2025-11-17 17:00:00	54	f	f	\N	2025-11-20 12:16:40.414	2025-11-20 12:16:40.414	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1321	1892	17	baseline	math	subtraction	24	2025-11-17 17:00:00	54	f	f	\N	2025-11-20 12:17:45.412	2025-11-20 12:17:45.412	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1323	650	23	baseline	language	paragraph	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:18:25.219	2025-11-20 12:18:25.219	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1324	2037	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:18:47.154	2025-11-20 12:18:47.154	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1328	1143	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:20:23.891	2025-11-20 12:20:23.891	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1330	649	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:20:48.913	2025-11-20 12:20:48.913	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1331	2032	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:21:18.904	2025-11-20 12:21:18.904	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1332	647	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:21:27.273	2025-11-20 12:21:27.273	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1720	2248	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:40:42.488	2025-11-20 15:40:42.488	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1722	2360	32	baseline	math	number_2digit	\N	2025-11-20 15:39:38.497	79	f	f	\N	2025-11-20 15:42:13.935	2025-11-20 15:42:13.935	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1723	2361	32	baseline	math	number_2digit	\N	2025-11-20 15:42:17.404	79	f	f	\N	2025-11-20 15:42:47.222	2025-11-20 15:42:47.222	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1724	2241	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:43:22.202	2025-11-20 15:43:22.202	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1725	2363	32	baseline	math	word_problems	\N	2025-11-20 15:42:51.784	79	f	f	\N	2025-11-20 15:44:19.35	2025-11-20 15:44:19.35	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1727	2364	32	baseline	math	subtraction	\N	2025-11-20 15:44:23.782	79	f	f	\N	2025-11-20 15:44:58.9	2025-11-20 15:44:58.9	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1728	2205	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:45:19.493	2025-11-20 15:45:19.493	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1736	2400	31	baseline	math	subtraction	តេស្ត	2025-11-20 23:52:58.428	72	f	f	\N	2025-11-20 23:53:32.937	2025-11-20 23:53:32.937	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1737	2401	31	baseline	math	division	តេស្ត	2025-11-20 23:53:56.451	72	f	f	\N	2025-11-20 23:55:18.66	2025-11-20 23:55:18.66	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1749	2415	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:07:15.648	72	f	f	\N	2025-11-21 00:07:57.625	2025-11-21 00:07:57.625	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1759	2434	6	baseline	language	word	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:19:30.997	2025-11-21 00:19:30.997	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1760	2425	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:19:28.425	72	f	f	\N	2025-11-21 00:20:00.777	2025-11-21 00:20:00.777	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1770	2373	32	baseline	math	division	\N	2025-11-21 00:31:03.059	79	f	f	\N	2025-11-21 00:32:04.463	2025-11-21 00:32:04.463	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1781	2386	32	baseline	math	number_2digit	\N	2025-11-21 00:40:27.231	79	f	f	\N	2025-11-21 00:42:07.533	2025-11-21 00:42:07.533	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1794	2396	32	baseline	math	number_2digit	\N	2025-11-21 00:48:23.403	79	f	f	\N	2025-11-21 00:48:51.462	2025-11-21 00:48:51.462	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1805	2535	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:02:11.802	2025-11-21 01:02:11.802	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1806	2537	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:02:24.658	2025-11-21 01:02:24.658	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1819	2608	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:17:05.172	2025-11-21 01:17:05.172	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1829	2609	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:24:07.976	2025-11-21 01:24:07.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1847	2465	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:29:10.901	2025-11-21 01:29:10.901	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1848	2579	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:29:29.752	2025-11-21 01:29:29.752	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1849	2464	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:29:46.762	2025-11-21 01:29:46.762	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1864	2550	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:34:29.343	2025-11-21 01:34:29.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1865	2662	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:35:09.8	2025-11-21 01:35:09.8	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1884	2521	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:40:41.926	2025-11-21 01:40:41.926	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1899	2451	28	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:44:38.581	2025-11-21 01:44:38.581	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1909	2695	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:53:17.631	2025-11-21 01:53:17.631	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1918	2689	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:01:11.122	2025-11-21 02:01:11.122	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1919	2688	16	baseline	math	subtraction		2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:02:21.01	2025-11-21 02:02:21.01	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1934	2710	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:15:19.611	2025-11-21 02:15:19.611	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1943	2719	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:24:36.589	2025-11-21 02:24:36.589	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1956	2738	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:34:30.122	2025-11-21 02:34:30.122	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1959	2742	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:36:45.622	2025-11-21 02:36:45.622	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1972	2753	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:42:51.074	2025-11-21 02:42:51.074	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1986	2763	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:52:07.102	2025-11-21 02:52:07.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1994	2771	29	baseline	math	division	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:01:44.269	2025-11-21 03:01:44.269	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1996	2774	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:03:28.157	2025-11-21 03:03:28.157	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1322	1562	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:18:07.747	2025-11-20 12:18:07.747	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1325	1895	17	baseline	math	subtraction	25	2025-11-17 17:00:00	54	f	f	\N	2025-11-20 12:19:04.137	2025-11-20 12:19:04.137	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1326	2035	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:19:52.02	2025-11-20 12:19:52.02	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1327	1558	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:20:05.397	2025-11-20 12:20:05.397	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1329	648	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:20:43.657	2025-11-20 12:20:43.657	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1333	1144	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:21:33.824	2025-11-20 12:21:33.824	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1334	1555	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:21:43.378	2025-11-20 12:21:43.378	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1335	2028	2	baseline	language	story	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:21:57.845	2025-11-20 12:21:57.845	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1336	646	23	baseline	language	word	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:22:21.111	2025-11-20 12:22:21.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1337	1145	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:22:45.505	2025-11-20 12:22:45.505	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1338	2026	2	baseline	language	story	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:22:52.182	2025-11-20 12:22:52.182	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1339	645	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:22:59.573	2025-11-20 12:22:59.573	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1340	1554	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:23:04.953	2025-11-20 12:23:04.953	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1341	644	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:23:34.811	2025-11-20 12:23:34.811	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1342	1147	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:23:47.402	2025-11-20 12:23:47.402	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1343	1552	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:24:32.546	2025-11-20 12:24:32.546	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1344	2025	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:24:43.482	2025-11-20 12:24:43.482	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1345	1148	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:24:43.423	2025-11-20 12:24:43.423	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1346	643	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:24:48.391	2025-11-20 12:24:48.391	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1347	642	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:24:53.916	2025-11-20 12:24:53.916	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1348	1177	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:25:31.258	2025-11-20 12:25:31.258	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1349	2023	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:25:47.137	2025-11-20 12:25:47.137	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1350	1550	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:26:04.47	2025-11-20 12:26:04.47	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1351	1175	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:26:08.004	2025-11-20 12:26:08.004	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1352	1433	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:26:14.588	2025-11-20 12:26:14.588	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1353	2020	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:26:31.494	2025-11-20 12:26:31.494	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1354	640	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:26:50.398	2025-11-20 12:26:50.398	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1355	1174	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:26:53.792	2025-11-20 12:26:53.792	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1356	2019	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:27:28.603	2025-11-20 12:27:28.603	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1357	1173	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:27:33.669	2025-11-20 12:27:33.669	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1358	641	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:27:36.2	2025-11-20 12:27:36.2	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1359	1545	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:27:46.855	2025-11-20 12:27:46.855	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1360	2017	2	baseline	language	comprehension1	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:28:38.645	2025-11-20 12:28:38.645	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1361	1172	7	baseline	language	letter	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:28:40.729	2025-11-20 12:28:40.729	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1362	1388	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:28:43.372	2025-11-20 12:28:43.372	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1363	1544	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:28:53.628	2025-11-20 12:28:53.628	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1364	639	23	baseline	language	letter	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:29:04.421	2025-11-20 12:29:04.421	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1365	2016	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:29:28.8	2025-11-20 12:29:28.8	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1366	638	23	baseline	language	beginner	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:29:46.438	2025-11-20 12:29:46.438	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1367	1171	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:30:00.688	2025-11-20 12:30:00.688	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1368	637	23	baseline	language	beginner	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:30:16.175	2025-11-20 12:30:16.175	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1369	1541	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:30:20.458	2025-11-20 12:30:20.458	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1370	2015	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:30:24.865	2025-11-20 12:30:24.865	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1371	1215	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:30:29.041	2025-11-20 12:30:29.041	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1372	2014	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:31:03.167	2025-11-20 12:31:03.167	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1373	1169	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:31:06.384	2025-11-20 12:31:06.384	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1374	1540	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:31:39.121	2025-11-20 12:31:39.121	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1375	1167	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:31:43.005	2025-11-20 12:31:43.005	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1376	1362	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:32:07.974	2025-11-20 12:32:07.974	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1377	636	23	baseline	language	beginner	\N	2025-11-17 17:00:00	67	f	f	\N	2025-11-20 12:32:16.995	2025-11-20 12:32:16.995	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1386	1163	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:34:24.045	2025-11-20 12:34:24.045	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1721	2244	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:41:53.968	2025-11-20 15:41:53.968	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1726	2211	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:44:21.322	2025-11-20 15:44:21.322	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1739	2403	31	baseline	math	subtraction	តេស្ត	2025-11-20 23:56:53.041	72	f	f	\N	2025-11-20 23:57:28.416	2025-11-20 23:57:28.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1750	2416	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:08:34.382	72	f	f	\N	2025-11-21 00:09:07.57	2025-11-21 00:09:07.57	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1753	2419	31	baseline	math	division	តេស្ត	2025-11-21 00:11:29.852	72	f	f	\N	2025-11-21 00:12:12.352	2025-11-21 00:12:12.352	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1762	2427	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:21:34.512	72	f	f	\N	2025-11-21 00:22:03.553	2025-11-21 00:22:03.553	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1771	2374	32	baseline	math	subtraction	\N	2025-11-21 00:32:11.589	79	f	f	\N	2025-11-21 00:32:58.945	2025-11-21 00:32:58.945	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1772	2376	32	baseline	math	word_problems	\N	2025-11-21 00:33:04.121	79	f	f	\N	2025-11-21 00:33:43.506	2025-11-21 00:33:43.506	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1773	2377	32	baseline	math	number_2digit	\N	2025-11-21 00:33:47.384	79	f	f	\N	2025-11-21 00:34:30.277	2025-11-21 00:34:30.277	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1782	2440	6	baseline	language	word	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:42:32.869	2025-11-21 00:42:32.869	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1783	2387	32	baseline	math	subtraction	\N	2025-11-21 00:42:12.665	79	f	f	\N	2025-11-21 00:42:52.585	2025-11-21 00:42:52.585	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1795	2463	6	baseline	language	word	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:50:28.55	2025-11-21 00:50:28.55	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1797	2471	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:52:32.895	2025-11-21 00:52:32.895	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1807	2545	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:05:09.298	2025-11-21 01:05:09.298	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1820	2522	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:18:07.192	2025-11-21 01:18:07.192	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1830	2490	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:24:14.967	2025-11-21 01:24:14.967	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1850	2574	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:30:12.738	2025-11-21 01:30:12.738	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1853	2459	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:30:52.383	2025-11-21 01:30:52.383	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1867	2560	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:35:42.947	2025-11-21 01:35:42.947	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1871	2664	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:36:52.481	2025-11-21 01:36:52.481	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1885	2554	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:40:46.958	2025-11-21 01:40:46.958	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1887	2587	28	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:40:58.009	2025-11-21 01:40:58.009	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1901	2468	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:45:31.744	2025-11-21 01:45:31.744	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1903	2683	6	baseline	language	story	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:45:58.401	2025-11-21 01:45:58.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1910	2697	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:54:35.944	2025-11-21 01:54:35.944	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1911	2698	30	baseline	math	division	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:55:26.971	2025-11-21 01:55:26.971	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1920	2702	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:03:20.871	2025-11-21 02:03:20.871	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1935	2712	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:17:04.784	2025-11-21 02:17:04.784	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1944	2651	8	baseline	language	comprehension2	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 02:24:59.861	2025-11-21 02:24:59.861	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1946	2723	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:26:14.128	2025-11-21 02:26:14.128	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1957	2740	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:35:12.455	2025-11-21 02:35:12.455	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1976	2756	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:44:56.525	2025-11-21 02:44:56.525	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1977	2724	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:45:06.567	2025-11-21 02:45:06.567	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1978	2757	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:45:51.431	2025-11-21 02:45:51.431	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1979	2722	16	baseline	math	division	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:45:58.581	2025-11-21 02:45:58.581	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1984	2762	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:48:51.487	2025-11-21 02:48:51.487	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1987	2765	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 02:56:01.65	2025-11-21 02:56:01.65	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1990	2768	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 02:58:48.013	2025-11-21 02:58:48.013	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1995	2772	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:02:34.443	2025-11-21 03:02:34.443	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1997	2775	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:04:30.779	2025-11-21 03:04:30.779	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1999	2777	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:06:35.447	2025-11-21 03:06:35.447	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2001	2779	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:08:12.297	2025-11-21 03:08:12.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1378	1166	7	baseline	language	word	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:32:19.526	2025-11-20 12:32:19.526	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1379	1538	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:32:47.903	2025-11-20 12:32:47.903	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1380	1165	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:32:55.183	2025-11-20 12:32:55.183	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1381	1359	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:33:37.279	2025-11-20 12:33:37.279	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1382	1164	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:33:41.583	2025-11-20 12:33:41.583	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1383	1515	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:34:00.102	2025-11-20 12:34:00.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1384	2018	16	baseline	math	division	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:34:04.895	2025-11-20 12:34:04.895	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1385	2013	2	baseline	language	comprehension1	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:34:23.815	2025-11-20 12:34:23.815	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1387	1161	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:34:58.753	2025-11-20 12:34:58.753	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1388	1534	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:35:25.981	2025-11-20 12:35:25.981	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1389	2021	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:35:35.915	2025-11-20 12:35:35.915	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1390	1160	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:35:41.192	2025-11-20 12:35:41.192	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1391	2011	2	baseline	language	story	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:35:58.113	2025-11-20 12:35:58.113	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1392	1217	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:36:19.946	2025-11-20 12:36:19.946	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1393	1159	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:36:35.272	2025-11-20 12:36:35.272	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1394	1531	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:36:49.202	2025-11-20 12:36:49.202	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1395	1149	7	baseline	language	comprehension1	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:37:21.509	2025-11-20 12:37:21.509	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1396	2024	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:37:39.24	2025-11-20 12:37:39.24	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1397	1528	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:37:55.891	2025-11-20 12:37:55.891	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1398	1158	7	baseline	language	comprehension1	\N	2025-11-17 17:00:00	111	f	f	\N	2025-11-20 12:38:02.226	2025-11-20 12:38:02.226	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1399	1221	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:38:17.442	2025-11-20 12:38:17.442	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1400	2009	2	baseline	language	story	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:38:21.733	2025-11-20 12:38:21.733	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1401	1524	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:38:58.358	2025-11-20 12:38:58.358	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1402	2006	2	baseline	language	story	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:39:42.385	2025-11-20 12:39:42.385	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1403	2027	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:39:45.778	2025-11-20 12:39:45.778	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1404	1157	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:39:49.937	2025-11-20 12:39:49.937	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1405	1156	7	baseline	language	comprehension1	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:40:19.636	2025-11-20 12:40:19.636	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1406	1521	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:40:43.572	2025-11-20 12:40:43.572	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1407	1155	7	baseline	language	beginner	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:40:51.144	2025-11-20 12:40:51.144	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1408	1358	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:40:57.343	2025-11-20 12:40:57.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1409	1154	7	baseline	language	letter	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:41:31.564	2025-11-20 12:41:31.564	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1410	2005	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:41:37.518	2025-11-20 12:41:37.518	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1411	1153	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:42:03.597	2025-11-20 12:42:03.597	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1412	1518	12	baseline	math	division	\N	2025-11-16 17:00:00	112	f	f	\N	2025-11-20 12:42:19.211	2025-11-20 12:42:19.211	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1413	1152	7	baseline	language	comprehension1	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:42:37.355	2025-11-20 12:42:37.355	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1414	1151	7	baseline	language	story	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:43:15.429	2025-11-20 12:43:15.429	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1415	2004	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:43:24.085	2025-11-20 12:43:24.085	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1416	1241	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:43:28.136	2025-11-20 12:43:28.136	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1417	1150	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	111	f	f	\N	2025-11-20 12:43:50.633	2025-11-20 12:43:50.633	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1418	1354	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:45:05.703	2025-11-20 12:45:05.703	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1419	2001	2	baseline	language	comprehension2	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:45:11.006	2025-11-20 12:45:11.006	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1420	1353	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:46:24.714	2025-11-20 12:46:24.714	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1421	1991	2	baseline	language	paragraph	\N	2025-11-16 17:00:00	49	f	f	\N	2025-11-20 12:46:35.474	2025-11-20 12:46:35.474	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1422	2091	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:50:40.491	2025-11-20 12:50:40.491	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1423	1352	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:51:41.032	2025-11-20 12:51:41.032	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1424	1248	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:52:43.656	2025-11-20 12:52:43.656	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1425	2033	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:52:51.301	2025-11-20 12:52:51.301	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1426	1349	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:53:59.023	2025-11-20 12:53:59.023	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1427	2092	7	baseline	language	letter	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:54:47.429	2025-11-20 12:54:47.429	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1428	1252	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:55:34.253	2025-11-20 12:55:34.253	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1429	2105	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:55:46.593	2025-11-20 12:55:46.593	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1430	2034	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:56:18.44	2025-11-20 12:56:18.44	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1431	1256	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:56:33.24	2025-11-20 12:56:33.24	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1432	2108	7	baseline	language	word	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:56:37.97	2025-11-20 12:56:37.97	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1433	2110	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:57:29.844	2025-11-20 12:57:29.844	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1434	2038	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:57:36.469	2025-11-20 12:57:36.469	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1435	1348	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:57:41.46	2025-11-20 12:57:41.46	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1436	2112	7	baseline	language	letter	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:58:33.309	2025-11-20 12:58:33.309	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1437	2040	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:58:49.685	2025-11-20 12:58:49.685	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1438	1343	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 12:59:08.884	2025-11-20 12:59:08.884	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1439	2113	7	baseline	language	letter	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 12:59:28.78	2025-11-20 12:59:28.78	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1440	2062	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 12:59:47.017	2025-11-20 12:59:47.017	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1441	2116	7	baseline	language	letter	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:00:18.792	2025-11-20 13:00:18.792	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1442	2060	16	baseline	math	division	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:00:40.859	2025-11-20 13:00:40.859	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1443	1340	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:00:45.208	2025-11-20 13:00:45.208	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1444	2118	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:01:30.171	2025-11-20 13:01:30.171	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1445	1336	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:01:46.12	2025-11-20 13:01:46.12	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1446	2041	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:01:46.828	2025-11-20 13:01:46.828	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1447	2079	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:01:51.306	2025-11-20 13:01:51.306	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1448	2124	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:02:45.682	2025-11-20 13:02:45.682	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1449	1335	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:02:54.617	2025-11-20 13:02:54.617	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1450	2043	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:03:00.253	2025-11-20 13:03:00.253	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1451	2128	7	baseline	language	letter	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:03:40.055	2025-11-20 13:03:40.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1452	1330	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:03:52.418	2025-11-20 13:03:52.418	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1453	2044	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:04:23.252	2025-11-20 13:04:23.252	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1454	2131	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:04:37.335	2025-11-20 13:04:37.335	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1455	1327	12	baseline	math	word_problems	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:04:47.015	2025-11-20 13:04:47.015	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1456	2077	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:04:57.649	2025-11-20 13:04:57.649	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1457	2076	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:05:45.433	2025-11-20 13:05:45.433	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1458	1326	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:05:45.966	2025-11-20 13:05:45.966	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1459	2134	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:05:48.081	2025-11-20 13:05:48.081	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1460	1258	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:06:31.946	2025-11-20 13:06:31.946	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1461	2075	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:06:33.595	2025-11-20 13:06:33.595	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1462	2137	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:06:49.33	2025-11-20 13:06:49.33	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1463	2045	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:07:05.255	2025-11-20 13:07:05.255	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1464	2074	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:07:24.606	2025-11-20 13:07:24.606	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1465	1322	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:07:36.132	2025-11-20 13:07:36.132	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1466	2139	7	baseline	language	story	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:07:48.484	2025-11-20 13:07:48.484	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1467	2047	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 13:08:00.874	2025-11-20 13:08:00.874	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1468	2073	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:08:24.897	2025-11-20 13:08:24.897	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1469	2144	7	baseline	language	comprehension1	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:08:45.404	2025-11-20 13:08:45.404	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1470	1319	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:08:57.599	2025-11-20 13:08:57.599	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1471	2072	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:09:16.111	2025-11-20 13:09:16.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1472	2146	7	baseline	language	story	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:09:46.042	2025-11-20 13:09:46.042	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1473	1314	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:09:51.055	2025-11-20 13:09:51.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1474	2071	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:10:03.325	2025-11-20 13:10:03.325	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1475	2148	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:10:39.484	2025-11-20 13:10:39.484	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1476	1262	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:10:45.748	2025-11-20 13:10:45.748	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1477	2068	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:10:52.933	2025-11-20 13:10:52.933	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1478	2150	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:11:28.907	2025-11-20 13:11:28.907	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1479	2067	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:11:44.02	2025-11-20 13:11:44.02	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1480	1313	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:11:55.871	2025-11-20 13:11:55.871	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1481	2152	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:12:19.681	2025-11-20 13:12:19.681	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1482	1309	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:12:48.197	2025-11-20 13:12:48.197	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1483	2066	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:12:53.486	2025-11-20 13:12:53.486	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1484	2153	7	baseline	language	comprehension1	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:13:07.446	2025-11-20 13:13:07.446	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1485	2065	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:13:41.891	2025-11-20 13:13:41.891	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1486	2155	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:13:57.34	2025-11-20 13:13:57.34	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1487	1305	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:13:57.664	2025-11-20 13:13:57.664	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1488	2064	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:14:38.298	2025-11-20 13:14:38.298	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1489	2158	7	baseline	language	story	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:14:47.437	2025-11-20 13:14:47.437	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1490	1304	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:14:51.727	2025-11-20 13:14:51.727	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1491	2063	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:15:28.024	2025-11-20 13:15:28.024	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1492	1300	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:15:56.503	2025-11-20 13:15:56.503	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1493	2061	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:16:33.387	2025-11-20 13:16:33.387	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1494	1288	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:16:50.005	2025-11-20 13:16:50.005	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1495	2059	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:17:39.711	2025-11-20 13:17:39.711	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1496	1264	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:17:53.438	2025-11-20 13:17:53.438	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1497	2165	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:18:16.186	2025-11-20 13:18:16.186	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1498	2057	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:18:17.949	2025-11-20 13:18:17.949	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1499	1454	4	baseline	language	word	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:18:59.889	2025-11-20 13:18:59.889	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1500	1285	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:19:02.335	2025-11-20 13:19:02.335	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1501	2167	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:19:06.239	2025-11-20 13:19:06.239	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1502	2055	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:19:13.878	2025-11-20 13:19:13.878	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1503	2053	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:20:05.028	2025-11-20 13:20:05.028	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1504	1283	12	baseline	math	division	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:20:05.436	2025-11-20 13:20:05.436	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1505	2169	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:20:08.3	2025-11-20 13:20:08.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1506	2142	31	baseline	math	subtraction	តេស្ត	2025-11-20 13:10:13.611	116	f	f	\N	2025-11-20 13:20:30.004	2025-11-20 13:20:30.004	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1507	1489	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:20:38.252	2025-11-20 13:20:38.252	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1508	2171	7	baseline	language	comprehension2	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:20:53.102	2025-11-20 13:20:53.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1509	2050	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:21:04.089	2025-11-20 13:21:04.089	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1510	1280	12	baseline	math	number_2digit	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:21:50.109	2025-11-20 13:21:50.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1511	1494	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:22:03.033	2025-11-20 13:22:03.033	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1512	2048	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:22:17.185	2025-11-20 13:22:17.185	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1513	1277	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:22:47.542	2025-11-20 13:22:47.542	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1514	2176	7	baseline	language	paragraph	\N	2025-11-16 17:00:00	29	f	f	\N	2025-11-20 13:22:57.146	2025-11-20 13:22:57.146	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1515	2046	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:23:04.898	2025-11-20 13:23:04.898	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1516	1499	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:23:25.567	2025-11-20 13:23:25.567	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1517	1276	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:23:48.844	2025-11-20 13:23:48.844	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1518	2042	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:24:02.207	2025-11-20 13:24:02.207	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1519	2173	31	baseline	math	subtraction	តេស្ត	2025-11-20 13:23:17.906	116	f	f	\N	2025-11-20 13:24:30.848	2025-11-20 13:24:30.848	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1520	1273	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:24:40.605	2025-11-20 13:24:40.605	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1521	2036	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:24:56.853	2025-11-20 13:24:56.853	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1522	1270	12	baseline	math	subtraction	\N	2025-11-16 17:00:00	27	f	f	\N	2025-11-20 13:25:39.28	2025-11-20 13:25:39.28	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1523	1503	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:25:42.481	2025-11-20 13:25:42.481	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1524	2031	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:25:43.677	2025-11-20 13:25:43.677	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1525	2178	31	baseline	math	subtraction	តេស្ត	2025-11-20 13:24:47.871	116	f	f	\N	2025-11-20 13:26:15.116	2025-11-20 13:26:15.116	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1526	2022	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:26:29.934	2025-11-20 13:26:29.934	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1527	1507	4	baseline	language	story	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:26:54.526	2025-11-20 13:26:54.526	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1528	1510	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:28:03.998	2025-11-20 13:28:03.998	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1529	2012	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:28:06.516	2025-11-20 13:28:06.516	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1530	2010	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:29:05.385	2025-11-20 13:29:05.385	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1531	1513	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:29:08.623	2025-11-20 13:29:08.623	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1532	2008	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:30:08.216	2025-11-20 13:30:08.216	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1533	1517	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:30:24.017	2025-11-20 13:30:24.017	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1534	2007	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:30:58.052	2025-11-20 13:30:58.052	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1535	1520	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:31:37.266	2025-11-20 13:31:37.266	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1536	2003	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:31:39.649	2025-11-20 13:31:39.649	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1537	2002	8	baseline	language	letter	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:32:27.706	2025-11-20 13:32:27.706	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1538	1525	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:32:54.467	2025-11-20 13:32:54.467	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1539	1996	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:33:13.162	2025-11-20 13:33:13.162	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1540	1529	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:34:00.227	2025-11-20 13:34:00.227	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1541	1689	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:34:05.394	2025-11-20 13:34:05.394	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1542	1687	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:34:45.148	2025-11-20 13:34:45.148	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1543	1530	4	baseline	language	paragraph	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:35:09.26	2025-11-20 13:35:09.26	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1544	1686	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:35:29.046	2025-11-20 13:35:29.046	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1545	1685	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:36:22.515	2025-11-20 13:36:22.515	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1546	1535	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:36:37.763	2025-11-20 13:36:37.763	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1547	1537	4	baseline	language	comprehension1	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:37:37.178	2025-11-20 13:37:37.178	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1548	1683	8	baseline	language	word	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:37:46.54	2025-11-20 13:37:46.54	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1549	1539	4	baseline	language	word	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:38:31.435	2025-11-20 13:38:31.435	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1550	1679	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:38:35.045	2025-11-20 13:38:35.045	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1551	1677	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:39:15.499	2025-11-20 13:39:15.499	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1552	1543	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:39:35.09	2025-11-20 13:39:35.09	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1553	1675	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:39:50.229	2025-11-20 13:39:50.229	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1554	1674	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:40:30.624	2025-11-20 13:40:30.624	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1555	1546	4	baseline	language	story	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:40:44.685	2025-11-20 13:40:44.685	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1556	1673	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:41:11.741	2025-11-20 13:41:11.741	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1557	1553	4	baseline	language	comprehension2	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:43:10.953	2025-11-20 13:43:10.953	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1558	1672	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:43:16.886	2025-11-20 13:43:16.886	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1559	1670	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:44:05.971	2025-11-20 13:44:05.971	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1560	1551	4	baseline	language	letter	0	2025-11-16 17:00:00	47	f	f	\N	2025-11-20 13:44:28.575	2025-11-20 13:44:28.575	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1561	1655	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:44:56.965	2025-11-20 13:44:56.965	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1562	1653	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:52:27.861	2025-11-20 13:52:27.861	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1563	1649	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:56:15.177	2025-11-20 13:56:15.177	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1564	2239	32	baseline	math	division	\N	2025-11-20 13:57:20.097	60	f	f	\N	2025-11-20 13:58:15.242	2025-11-20 13:58:15.242	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1565	1647	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 13:59:51.242	2025-11-20 13:59:51.242	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1566	1642	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:00:48.442	2025-11-20 14:00:48.442	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1567	2236	32	baseline	math	subtraction	\N	2025-11-20 14:00:26.191	60	f	f	\N	2025-11-20 14:01:00.443	2025-11-20 14:01:00.443	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1568	2183	31	baseline	math	subtraction	តេស្ត	2025-11-20 13:59:53.569	116	f	f	\N	2025-11-20 14:01:07.172	2025-11-20 14:01:07.172	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1569	1635	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:01:46.808	2025-11-20 14:01:46.808	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1570	2049	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 14:01:54.602	2025-11-20 14:01:54.602	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1571	1613	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:02:43.377	2025-11-20 14:02:43.377	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1572	2188	31	baseline	math	number_2digit	តេស្ត	2025-11-20 14:01:39.166	116	f	f	\N	2025-11-20 14:02:47.887	2025-11-20 14:02:47.887	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1573	2051	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 14:02:59.396	2025-11-20 14:02:59.396	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1574	1372	32	baseline	math	number_2digit	\N	2025-11-20 14:01:47.991	60	f	f	\N	2025-11-20 14:03:12.895	2025-11-20 14:03:12.895	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1575	1601	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:03:30.815	2025-11-20 14:03:30.815	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1576	2054	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 14:03:51.487	2025-11-20 14:03:51.487	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1577	2190	31	baseline	math	division	តេស្ត	2025-11-20 14:03:18.175	116	f	f	\N	2025-11-20 14:04:19.591	2025-11-20 14:04:19.591	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1578	1587	8	baseline	language	paragraph	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:04:21.942	2025-11-20 14:04:21.942	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1579	2056	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 14:04:38.234	2025-11-20 14:04:38.234	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1580	1580	8	baseline	language	story	\N	2025-11-16 17:00:00	23	f	f	\N	2025-11-20 14:04:54.274	2025-11-20 14:04:54.274	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1581	2058	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	114	f	f	\N	2025-11-20 14:05:34.445	2025-11-20 14:05:34.445	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1582	1375	32	baseline	math	number_2digit	\N	2025-11-20 14:03:53.758	60	f	f	\N	2025-11-20 14:05:37.759	2025-11-20 14:05:37.759	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1583	2194	31	baseline	math	number_2digit	តេស្ត	2025-11-20 14:05:18.433	116	f	f	\N	2025-11-20 14:06:25.521	2025-11-20 14:06:25.521	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1584	2196	31	baseline	math	division	តេស្ត	2025-11-20 14:06:54.189	116	f	f	\N	2025-11-20 14:08:05.595	2025-11-20 14:08:05.595	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1585	1376	32	baseline	math	number_1digit	\N	2025-11-20 14:06:49.93	60	f	f	\N	2025-11-20 14:08:14.069	2025-11-20 14:08:14.069	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1586	1379	32	baseline	math	number_2digit	\N	2025-11-20 14:08:53.395	60	f	f	\N	2025-11-20 14:09:44.522	2025-11-20 14:09:44.522	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1587	2259	24	baseline	language	word	\N	2025-11-20 14:09:37.161	80	f	f	\N	2025-11-20 14:10:19.715	2025-11-20 14:10:19.715	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1588	1380	32	baseline	math	number_2digit	\N	2025-11-20 14:10:10.389	60	f	f	\N	2025-11-20 14:10:57.009	2025-11-20 14:10:57.009	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1589	2199	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:10:26.567	116	f	f	\N	2025-11-20 14:11:26.24	2025-11-20 14:11:26.24	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1590	1394	32	baseline	math	number_2digit	\N	2025-11-20 14:11:17.153	60	f	f	\N	2025-11-20 14:11:55.931	2025-11-20 14:11:55.931	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1591	2263	24	baseline	language	word	\N	2025-11-20 14:11:49.168	80	f	f	\N	2025-11-20 14:12:33.777	2025-11-20 14:12:33.777	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1592	2201	31	baseline	math	number_2digit	តេស្ត	2025-11-20 14:11:51.899	116	f	f	\N	2025-11-20 14:12:42.231	2025-11-20 14:12:42.231	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1593	1402	32	baseline	math	number_1digit	\N	2025-11-20 14:12:10.302	60	f	f	\N	2025-11-20 14:13:00.178	2025-11-20 14:13:00.178	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1594	1404	32	baseline	math	number_2digit	\N	2025-11-20 14:13:06.536	60	f	f	\N	2025-11-20 14:13:34.992	2025-11-20 14:13:34.992	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1595	2203	31	baseline	math	division	តេស្ត	2025-11-20 14:13:10.922	116	f	f	\N	2025-11-20 14:14:14.324	2025-11-20 14:14:14.324	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1596	1571	11	baseline	math	number_2digit	\N	2025-11-16 17:00:00	117	f	f	\N	2025-11-20 14:14:16.606	2025-11-20 14:14:16.606	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1597	2082	32	baseline	math	number_2digit	\N	2025-11-20 14:13:55.71	60	f	f	\N	2025-11-20 14:14:47.03	2025-11-20 14:14:47.03	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1598	2208	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:14:41.062	116	f	f	\N	2025-11-20 14:15:26.64	2025-11-20 14:15:26.64	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1599	2181	32	baseline	math	division	\N	2025-11-20 14:15:18.542	60	f	f	\N	2025-11-20 14:16:24.563	2025-11-20 14:16:24.563	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1600	2209	31	baseline	math	division	តេស្ត	2025-11-20 14:15:53.918	116	f	f	\N	2025-11-20 14:16:43.862	2025-11-20 14:16:43.862	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1601	2265	24	baseline	language	letter	\N	2025-11-20 14:13:40.531	80	f	f	\N	2025-11-20 14:17:14.279	2025-11-20 14:17:14.279	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1602	2182	32	baseline	math	subtraction	\N	2025-11-20 14:16:32.23	60	f	f	\N	2025-11-20 14:17:26.662	2025-11-20 14:17:26.662	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1603	2212	31	baseline	math	number_2digit	តេស្ត	2025-11-20 14:17:04.378	116	f	f	\N	2025-11-20 14:17:57.274	2025-11-20 14:17:57.274	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1604	2184	32	baseline	math	subtraction	\N	2025-11-20 14:17:31.902	60	f	f	\N	2025-11-20 14:18:25.887	2025-11-20 14:18:25.887	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1605	2215	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:18:21.763	116	f	f	\N	2025-11-20 14:19:10.894	2025-11-20 14:19:10.894	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1606	2187	32	baseline	math	subtraction	\N	2025-11-20 14:19:20.053	60	f	f	\N	2025-11-20 14:20:11.725	2025-11-20 14:20:11.725	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1607	2218	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:19:40.394	116	f	f	\N	2025-11-20 14:20:19.667	2025-11-20 14:20:19.667	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1608	2189	32	baseline	math	subtraction	\N	2025-11-20 14:20:29.887	60	f	f	\N	2025-11-20 14:21:21.375	2025-11-20 14:21:21.375	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1609	2220	31	baseline	math	division	តេស្ត	2025-11-20 14:20:46.553	116	f	f	\N	2025-11-20 14:21:25.87	2025-11-20 14:21:25.87	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1610	2223	31	baseline	math	word_problems	តេស្ត	2025-11-20 14:21:50.979	116	f	f	\N	2025-11-20 14:22:30.908	2025-11-20 14:22:30.908	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1611	2191	32	baseline	math	division	\N	2025-11-20 14:21:41.166	60	f	f	\N	2025-11-20 14:22:46.302	2025-11-20 14:22:46.302	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1612	2226	31	baseline	math	word_problems	តេស្ត	2025-11-20 14:22:53.886	116	f	f	\N	2025-11-20 14:23:36.799	2025-11-20 14:23:36.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1729	2197	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:46:23.307	2025-11-20 15:46:23.307	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1731	2367	32	baseline	math	number_2digit	\N	2025-11-20 15:48:09.663	79	f	f	\N	2025-11-20 15:48:39.062	2025-11-20 15:48:39.062	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1740	2404	31	baseline	math	number_2digit	តេស្ត	2025-11-20 23:57:52.486	72	f	f	\N	2025-11-20 23:58:42.691	2025-11-20 23:58:42.691	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1751	2417	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:09:22.527	72	f	f	\N	2025-11-21 00:10:07.21	2025-11-21 00:10:07.21	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1752	2418	31	baseline	math	subtraction	តេស្ត	2025-11-21 00:10:24.244	72	f	f	\N	2025-11-21 00:11:15.402	2025-11-21 00:11:15.402	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1763	2428	31	baseline	math	division	តេស្ត	2025-11-21 00:22:19.879	72	f	f	\N	2025-11-21 00:22:51.779	2025-11-21 00:22:51.779	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1774	2379	32	baseline	math	word_problems	\N	2025-11-21 00:34:37.065	79	f	f	\N	2025-11-21 00:35:19.154	2025-11-21 00:35:19.154	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1777	2382	32	baseline	math	subtraction	\N	2025-11-21 00:36:43.946	79	f	f	\N	2025-11-21 00:37:42.962	2025-11-21 00:37:42.962	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1784	2388	32	baseline	math	number_2digit	\N	2025-11-21 00:42:56.913	79	f	f	\N	2025-11-21 00:43:21.799	2025-11-21 00:43:21.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1796	2467	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:51:43.817	2025-11-21 00:51:43.817	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1799	2485	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:55:18.355	2025-11-21 00:55:18.355	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1808	2547	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:07:25.082	2025-11-21 01:07:25.082	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1821	2610	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:19:55.52	2025-11-21 01:19:55.52	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1823	2514	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:21:27.493	2025-11-21 01:21:27.493	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1824	2444	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:21:46.763	2025-11-21 01:21:46.763	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1825	2495	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:22:39.191	2025-11-21 01:22:39.191	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1831	2594	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:24:51.69	2025-11-21 01:24:51.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1832	2487	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:24:58.278	2025-11-21 01:24:58.278	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1833	2486	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:25:34.866	2025-11-21 01:25:34.866	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1835	2607	28	baseline	math	word_problems	\N	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:25:51.671	2025-11-21 01:25:51.671	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1837	2590	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:26:30.685	2025-11-21 01:26:30.685	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1840	2641	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:27:21.203	2025-11-21 01:27:21.203	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1841	2472	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:27:30.181	2025-11-21 01:27:30.181	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1854	2448	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:31:27.635	2025-11-21 01:31:27.635	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1860	2563	10	baseline	math	division	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:33:32.007	2025-11-21 01:33:32.007	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1868	2548	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:36:05.908	2025-11-21 01:36:05.908	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1869	2559	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:36:30.118	2025-11-21 01:36:30.118	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1870	2604	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:36:41.375	2025-11-21 01:36:41.375	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1886	2671	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:40:56.763	2025-11-21 01:40:56.763	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1902	2680	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:45:47.348	2025-11-21 01:45:47.348	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1904	2460	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:46:38.995	2025-11-21 01:46:38.995	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1912	2692	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 01:55:59.356	2025-11-21 01:55:59.356	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1921	2686	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:03:43.218	2025-11-21 02:03:43.218	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1923	2704	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:05:51.934	2025-11-21 02:05:51.934	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1936	2714	30	baseline	math	number_1digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:18:35.937	2025-11-21 02:18:35.937	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1938	2716	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:20:29.066	2025-11-21 02:20:29.066	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1945	2721	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:25:22.845	2025-11-21 02:25:22.845	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1958	2741	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:36:04.975	2025-11-21 02:36:04.975	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1961	2745	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:38:14.606	2025-11-21 02:38:14.606	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1980	2758	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:46:41.562	2025-11-21 02:46:41.562	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1988	2766	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 02:56:49.394	2025-11-21 02:56:49.394	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1998	2776	29	baseline	math	division	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:05:43.999	2025-11-21 03:05:43.999	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1613	2192	32	baseline	math	subtraction	\N	2025-11-20 14:22:59.083	60	f	f	\N	2025-11-20 14:23:39.96	2025-11-20 14:23:39.96	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1614	2193	32	baseline	math	subtraction	\N	2025-11-20 14:23:43.964	60	f	f	\N	2025-11-20 14:24:34.344	2025-11-20 14:24:34.344	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1615	2229	31	baseline	math	division	តេស្ត	2025-11-20 14:24:04.964	116	f	f	\N	2025-11-20 14:24:49.358	2025-11-20 14:24:49.358	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1616	2195	32	baseline	math	subtraction	\N	2025-11-20 14:24:37.99	60	f	f	\N	2025-11-20 14:25:25.192	2025-11-20 14:25:25.192	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1617	2231	31	baseline	math	word_problems	តេស្ត	2025-11-20 14:25:16.486	116	f	f	\N	2025-11-20 14:25:59.388	2025-11-20 14:25:59.388	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1618	2284	24	baseline	language	comprehension1	\N	2025-11-20 14:26:03.558	85	f	f	\N	2025-11-20 14:26:39.141	2025-11-20 14:26:39.141	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1619	2198	32	baseline	math	subtraction	\N	2025-11-20 14:25:34.406	60	f	f	\N	2025-11-20 14:27:08.845	2025-11-20 14:27:08.845	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1620	2235	31	baseline	math	word_problems	តេស្ត	2025-11-20 14:26:25.078	116	f	f	\N	2025-11-20 14:27:09.943	2025-11-20 14:27:09.943	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1621	2237	31	baseline	math	division	តេស្ត	2025-11-20 14:27:34.428	116	f	f	\N	2025-11-20 14:28:10.834	2025-11-20 14:28:10.834	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1622	2200	32	baseline	math	subtraction	\N	2025-11-20 14:27:12.705	60	f	f	\N	2025-11-20 14:28:15.493	2025-11-20 14:28:15.493	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1623	2275	24	baseline	language	story	\N	2025-11-20 14:27:51.897	80	f	f	\N	2025-11-20 14:29:08.588	2025-11-20 14:29:08.588	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1624	2289	24	baseline	language	story	\N	2025-11-20 14:28:43.505	85	f	f	\N	2025-11-20 14:29:16.417	2025-11-20 14:29:16.417	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1625	2202	32	baseline	math	subtraction	\N	2025-11-20 14:28:19.502	60	f	f	\N	2025-11-20 14:29:39.791	2025-11-20 14:29:39.791	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1626	2240	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:28:32.988	116	f	f	\N	2025-11-20 14:29:40.487	2025-11-20 14:29:40.487	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1627	2204	32	baseline	math	subtraction	\N	2025-11-20 14:29:46.749	60	f	f	\N	2025-11-20 14:30:31.148	2025-11-20 14:30:31.148	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1628	2295	24	baseline	language	comprehension2	\N	2025-11-20 14:30:15.555	80	f	f	\N	2025-11-20 14:31:02.298	2025-11-20 14:31:02.298	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1629	2242	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:30:23.463	116	f	f	\N	2025-11-20 14:31:15.454	2025-11-20 14:31:15.454	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1630	2206	32	baseline	math	number_2digit	\N	2025-11-20 14:30:35.071	60	f	f	\N	2025-11-20 14:31:20.985	2025-11-20 14:31:20.985	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1631	2294	24	baseline	language	comprehension1	\N	2025-11-20 14:30:03.561	85	f	f	\N	2025-11-20 14:31:40.361	2025-11-20 14:31:40.361	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1632	2207	32	baseline	math	subtraction	\N	2025-11-20 14:31:27.092	60	f	f	\N	2025-11-20 14:31:59.172	2025-11-20 14:31:59.172	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1633	2243	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:31:41.773	116	f	f	\N	2025-11-20 14:32:41.471	2025-11-20 14:32:41.471	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1634	2301	24	baseline	language	story	\N	2025-11-20 14:32:35.318	85	f	f	\N	2025-11-20 14:33:00.331	2025-11-20 14:33:00.331	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1635	2210	32	baseline	math	number_2digit	\N	2025-11-20 14:32:09.523	60	f	f	\N	2025-11-20 14:33:02.222	2025-11-20 14:33:02.222	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1636	2299	24	baseline	language	comprehension1	\N	2025-11-20 14:32:14.022	80	f	f	\N	2025-11-20 14:33:24.654	2025-11-20 14:33:24.654	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1637	2245	31	baseline	math	subtraction	តេស្ត	2025-11-20 14:33:04.877	116	f	f	\N	2025-11-20 14:33:44.962	2025-11-20 14:33:44.962	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1638	2305	24	baseline	language	comprehension1	\N	2025-11-20 14:33:46.885	85	f	f	\N	2025-11-20 14:34:07.083	2025-11-20 14:34:07.083	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1639	2213	32	baseline	math	subtraction	\N	2025-11-20 14:33:12.753	60	f	f	\N	2025-11-20 14:34:27.162	2025-11-20 14:34:27.162	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1640	2247	31	baseline	math	number_2digit	តេស្ត	2025-11-20 14:33:59.029	116	f	f	\N	2025-11-20 14:34:54.719	2025-11-20 14:34:54.719	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1641	2214	32	baseline	math	subtraction	\N	2025-11-20 14:34:33.104	60	f	f	\N	2025-11-20 14:34:59.294	2025-11-20 14:34:59.294	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1642	2308	24	baseline	language	comprehension2	\N	2025-11-20 14:34:25.665	80	f	f	\N	2025-11-20 14:35:32.297	2025-11-20 14:35:32.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1643	2219	32	baseline	math	number_2digit	\N	2025-11-20 14:35:02.78	60	f	f	\N	2025-11-20 14:35:35.52	2025-11-20 14:35:35.52	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1644	2312	24	baseline	language	comprehension2	\N	2025-11-20 14:35:37.199	85	f	f	\N	2025-11-20 14:36:12.141	2025-11-20 14:36:12.141	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1645	2222	32	baseline	math	number_2digit	\N	2025-11-20 14:35:40.229	60	f	f	\N	2025-11-20 14:36:23.976	2025-11-20 14:36:23.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1646	2225	32	baseline	math	number_1digit	\N	2025-11-20 14:36:27.377	60	f	f	\N	2025-11-20 14:36:56.115	2025-11-20 14:36:56.115	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1647	2278	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:37:03.129	2025-11-20 14:37:03.129	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1648	2315	24	baseline	language	comprehension2	\N	2025-11-20 14:36:46.975	80	f	f	\N	2025-11-20 14:37:19.912	2025-11-20 14:37:19.912	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1649	2318	24	baseline	language	comprehension2	\N	2025-11-20 14:37:19.032	85	f	f	\N	2025-11-20 14:37:50.414	2025-11-20 14:37:50.414	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1650	2227	32	baseline	math	subtraction	\N	2025-11-20 14:37:00.685	60	f	f	\N	2025-11-20 14:38:23.622	2025-11-20 14:38:23.622	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1651	2313	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:38:54.433	2025-11-20 14:38:54.433	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1652	2319	24	baseline	language	comprehension1	\N	2025-11-20 14:38:23.371	80	f	f	\N	2025-11-20 14:38:56.287	2025-11-20 14:38:56.287	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1653	2320	24	baseline	language	comprehension1	\N	2025-11-20 14:38:36.213	85	f	f	\N	2025-11-20 14:39:03.434	2025-11-20 14:39:03.434	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1654	2228	32	baseline	math	subtraction	\N	2025-11-20 14:38:29.434	60	f	f	\N	2025-11-20 14:39:57.189	2025-11-20 14:39:57.189	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1655	2311	28	baseline	math	number_1digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:39:58.812	2025-11-20 14:39:58.812	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1656	2322	24	baseline	language	comprehension1	\N	2025-11-20 14:40:08.322	85	f	f	\N	2025-11-20 14:40:29.351	2025-11-20 14:40:29.351	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1657	2230	32	baseline	math	subtraction	\N	2025-11-20 14:40:00.965	60	f	f	\N	2025-11-20 14:40:44.544	2025-11-20 14:40:44.544	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1658	2232	32	baseline	math	subtraction	\N	2025-11-20 14:40:49.651	60	f	f	\N	2025-11-20 14:41:32.885	2025-11-20 14:41:32.885	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1730	2366	32	baseline	math	word_problems	\N	2025-11-20 15:47:23.692	79	f	f	\N	2025-11-20 15:48:04.559	2025-11-20 15:48:04.559	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1732	2370	32	baseline	math	word_problems	\N	2025-11-20 15:48:42.743	79	f	f	\N	2025-11-20 15:49:36.511	2025-11-20 15:49:36.511	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1741	2405	31	baseline	math	subtraction	តេស្ត	2025-11-20 23:59:06.534	72	f	f	\N	2025-11-20 23:59:46.103	2025-11-20 23:59:46.103	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1743	2407	31	baseline	math	division	តេស្ត	2025-11-21 00:01:08.063	72	f	f	\N	2025-11-21 00:01:50.6	2025-11-21 00:01:50.6	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1754	2420	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:12:43.979	72	f	f	\N	2025-11-21 00:13:35.485	2025-11-21 00:13:35.485	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1764	2429	31	baseline	math	word_problems	តេស្ត	2025-11-21 00:23:14.845	72	f	f	\N	2025-11-21 00:23:47.138	2025-11-21 00:23:47.138	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1775	2380	32	baseline	math	word_problems	\N	2025-11-21 00:35:26.246	79	f	f	\N	2025-11-21 00:36:24.532	2025-11-21 00:36:24.532	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1785	2389	32	baseline	math	subtraction	\N	2025-11-21 00:43:42.227	79	f	f	\N	2025-11-21 00:44:22.516	2025-11-21 00:44:22.516	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1786	2390	32	baseline	math	division	\N	2025-11-21 00:44:27.105	79	f	f	\N	2025-11-21 00:44:56.154	2025-11-21 00:44:56.154	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1798	2483	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:55:15.299	2025-11-21 00:55:15.299	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1800	2491	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:57:06.802	2025-11-21 00:57:06.802	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1809	2553	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 01:07:31.687	2025-11-21 01:07:31.687	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1811	2447	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:09:58.816	2025-11-21 01:09:58.816	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1812	2571	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:10:13.253	2025-11-21 01:10:13.253	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1813	2536	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:11:38.073	2025-11-21 01:11:38.073	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1822	2600	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:20:14.166	2025-11-21 01:20:14.166	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1834	2593	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:25:43.9	2025-11-21 01:25:43.9	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1839	2588	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:27:19.769	2025-11-21 01:27:19.769	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1855	2568	10	baseline	math	division	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:31:37.841	2025-11-21 01:31:37.841	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1872	2546	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:37:03.509	2025-11-21 01:37:03.509	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1873	2666	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:37:43.356	2025-11-21 01:37:43.356	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1875	2544	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:38:16.629	2025-11-21 01:38:16.629	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1878	2668	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:38:59.97	2025-11-21 01:38:59.97	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1891	2511	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:42:03.597	2025-11-21 01:42:03.597	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1895	2493	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:43:40.124	2025-11-21 01:43:40.124	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1905	2687	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:48:19.814	2025-11-21 01:48:19.814	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1913	2699	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:56:15.72	2025-11-21 01:56:15.72	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1922	2703	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:04:11.477	2025-11-21 02:04:11.477	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1924	2685	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:06:11.121	2025-11-21 02:06:11.121	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1925	2684	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:07:24.109	2025-11-21 02:07:24.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1926	2681	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:08:22.157	2025-11-21 02:08:22.157	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1937	2715	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:19:41.181	2025-11-21 02:19:41.181	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1939	2717	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 02:21:19.423	2025-11-21 02:21:19.423	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1947	2725	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:27:02.724	2025-11-21 02:27:02.724	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1960	2744	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:37:31.564	2025-11-21 02:37:31.564	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1962	2747	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:38:21.723	2025-11-21 02:38:21.723	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1964	2743	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:39:47.607	2025-11-21 02:39:47.607	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1965	2749	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:39:52.95	2025-11-21 02:39:52.95	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1966	2750	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:40:31.568	2025-11-21 02:40:31.568	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1981	2759	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:47:35.446	2025-11-21 02:47:35.446	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1985	2764	16	baseline	math	number_2digit	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:51:19.142	2025-11-21 02:51:19.142	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1989	2767	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 02:57:47.288	2025-11-21 02:57:47.288	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1991	2180	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 02:59:12.98	2025-11-21 02:59:12.98	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2000	2778	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:07:21.484	2025-11-21 03:07:21.484	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2002	2780	29	baseline	math	division	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:09:12.949	2025-11-21 03:09:12.949	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2003	2781	29	baseline	math	division	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:10:08.268	2025-11-21 03:10:08.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1659	2233	32	baseline	math	division	\N	2025-11-20 14:41:41.244	60	f	f	\N	2025-11-20 14:42:21.515	2025-11-20 14:42:21.515	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1660	2331	24	baseline	language	comprehension2	\N	2025-11-20 14:45:32.597	80	f	f	\N	2025-11-20 14:46:13.255	2025-11-20 14:46:13.255	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1661	2334	24	baseline	language	comprehension2	\N	2025-11-20 14:47:26.747	80	f	f	\N	2025-11-20 14:48:15.662	2025-11-20 14:48:15.662	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1662	2337	24	baseline	language	comprehension2	\N	2025-11-20 14:49:30.829	80	f	f	\N	2025-11-20 14:49:59.361	2025-11-20 14:49:59.361	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1663	2339	24	baseline	language	comprehension1	\N	2025-11-20 14:50:59.651	80	f	f	\N	2025-11-20 14:51:31.141	2025-11-20 14:51:31.141	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1664	2310	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:51:34.325	2025-11-20 14:51:34.325	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1665	2280	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:52:45.508	2025-11-20 14:52:45.508	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1666	2340	24	baseline	language	story	\N	2025-11-20 14:52:50.081	80	f	f	\N	2025-11-20 14:53:23.781	2025-11-20 14:53:23.781	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1667	2282	28	baseline	math	division	បានធ្វើតេស្ដរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:53:48.32	2025-11-20 14:53:48.32	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1668	2307	28	baseline	math	subtraction	បានធ្វើតេស្ដរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:55:11.67	2025-11-20 14:55:11.67	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1669	2345	24	baseline	language	comprehension2	\N	2025-11-20 14:54:51.302	80	f	f	\N	2025-11-20 14:55:42.544	2025-11-20 14:55:42.544	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1670	2283	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:56:58.179	2025-11-20 14:56:58.179	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1671	2349	24	baseline	language	comprehension2	\N	2025-11-20 14:57:15.302	80	f	f	\N	2025-11-20 14:57:52.69	2025-11-20 14:57:52.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1672	2306	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:57:54.178	2025-11-20 14:57:54.178	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1673	2338	14	baseline	math	number_2digit	\N	2025-11-20 14:52:00.788	46	f	f	\N	2025-11-20 14:58:46.084	2025-11-20 14:58:46.084	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1674	2285	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:58:47.2	2025-11-20 14:58:47.2	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1675	2303	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 14:59:45.389	2025-11-20 14:59:45.389	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1676	2353	24	baseline	language	story	\N	2025-11-20 14:59:33.941	80	f	f	\N	2025-11-20 15:00:05.443	2025-11-20 15:00:05.443	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1677	2302	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:00:54.56	2025-11-20 15:00:54.56	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1678	2356	24	baseline	language	comprehension2	\N	2025-11-20 15:01:04.994	80	f	f	\N	2025-11-20 15:01:54.599	2025-11-20 15:01:54.599	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1679	2335	14	baseline	math	number_2digit	\N	2025-11-20 14:58:56.427	46	f	f	\N	2025-11-20 15:02:01.609	2025-11-20 15:02:01.609	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1680	2298	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:02:21.367	2025-11-20 15:02:21.367	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1681	2297	28	baseline	math	word_problems	បានធ្វើតេស្តរួច\n	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:03:17.324	2025-11-20 15:03:17.324	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1682	2358	24	baseline	language	comprehension1	\N	2025-11-20 15:02:48.659	80	f	f	\N	2025-11-20 15:03:17.808	2025-11-20 15:03:17.808	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1683	2296	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:04:18.694	2025-11-20 15:04:18.694	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1684	2362	24	baseline	language	comprehension1	\N	2025-11-20 15:04:22.43	80	f	f	\N	2025-11-20 15:04:49.844	2025-11-20 15:04:49.844	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1685	2333	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:05:00.727	2025-11-20 15:05:00.727	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1686	2286	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:05:16.918	2025-11-20 15:05:16.918	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1687	2293	28	baseline	math	word_problems	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:06:04.968	2025-11-20 15:06:04.968	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1688	2365	24	baseline	language	comprehension2	\N	2025-11-20 15:06:11.823	80	f	f	\N	2025-11-20 15:06:38.087	2025-11-20 15:06:38.087	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1689	2332	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:06:59.437	2025-11-20 15:06:59.437	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1690	2292	28	baseline	math	division	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:07:00.977	2025-11-20 15:07:00.977	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1691	2287	28	baseline	math	division	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:08:12.039	2025-11-20 15:08:12.039	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1692	2369	24	baseline	language	comprehension1	\N	2025-11-20 15:07:49.307	80	f	f	\N	2025-11-20 15:08:37.774	2025-11-20 15:08:37.774	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1693	2326	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:08:38.417	2025-11-20 15:08:38.417	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1694	2291	28	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	75	f	f	\N	2025-11-20 15:09:23.274	2025-11-20 15:09:23.274	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1695	2372	24	baseline	language	comprehension1	\N	2025-11-20 15:10:21.268	80	f	f	\N	2025-11-20 15:10:50.057	2025-11-20 15:10:50.057	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1696	2324	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:11:39.628	2025-11-20 15:11:39.628	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1697	2375	24	baseline	language	story	\N	2025-11-20 15:12:03.022	80	f	f	\N	2025-11-20 15:12:39.265	2025-11-20 15:12:39.265	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1698	2378	24	baseline	language	comprehension1	\N	2025-11-20 15:13:31.476	80	f	f	\N	2025-11-20 15:14:05.59	2025-11-20 15:14:05.59	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1700	2321	14	baseline	math	word_problems	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:25:56.915	2025-11-20 15:25:56.915	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1701	2314	14	baseline	math	division	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:28:20.732	2025-11-20 15:28:20.732	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1702	2309	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:29:34.295	2025-11-20 15:29:34.295	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1703	2341	32	baseline	math	number_2digit	\N	2025-11-20 15:29:46.106	79	f	f	\N	2025-11-20 15:30:43.412	2025-11-20 15:30:43.412	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1704	2304	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:30:51.865	2025-11-20 15:30:51.865	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1705	2346	32	baseline	math	subtraction	\N	2025-11-20 15:30:55.392	79	f	f	\N	2025-11-20 15:31:44.072	2025-11-20 15:31:44.072	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1706	2300	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:32:09.851	2025-11-20 15:32:09.851	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1707	2347	32	baseline	math	number_2digit	\N	2025-11-20 15:31:48.923	79	f	f	\N	2025-11-20 15:32:47.459	2025-11-20 15:32:47.459	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1708	2348	32	baseline	math	word_problems	\N	2025-11-20 15:32:51.358	79	f	f	\N	2025-11-20 15:33:49.275	2025-11-20 15:33:49.275	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1709	2350	32	baseline	math	number_2digit	\N	2025-11-20 15:33:53.199	79	f	f	\N	2025-11-20 15:34:37.811	2025-11-20 15:34:37.811	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1710	2258	14	baseline	math	number_2digit	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:34:47.772	2025-11-20 15:34:47.772	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1711	2351	32	baseline	math	subtraction	\N	2025-11-20 15:34:41.079	79	f	f	\N	2025-11-20 15:35:32.44	2025-11-20 15:35:32.44	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1712	2256	14	baseline	math	subtraction	\N	2025-11-16 17:00:00	46	f	f	\N	2025-11-20 15:36:07.6	2025-11-20 15:36:07.6	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1733	2397	31	baseline	math	word_problems	តេស្ត	2025-11-20 23:47:52.089	72	f	f	\N	2025-11-20 23:49:12.907	2025-11-20 23:49:12.907	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1742	2406	31	baseline	math	word_problems	តេស្ត	2025-11-21 00:00:08.287	72	f	f	\N	2025-11-21 00:00:48.104	2025-11-21 00:00:48.104	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1755	2421	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:15:18.706	72	f	f	\N	2025-11-21 00:15:53.209	2025-11-21 00:15:53.209	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1765	2430	31	baseline	math	division	តេស្ត	2025-11-21 00:24:11.694	72	f	f	\N	2025-11-21 00:24:46.67	2025-11-21 00:24:46.67	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1766	2431	31	baseline	math	number_2digit	តេស្ត	2025-11-21 00:25:06.691	72	f	f	\N	2025-11-21 00:25:45.109	2025-11-21 00:25:45.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1776	2436	6	baseline	language	word	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:37:09.532	2025-11-21 00:37:09.532	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1778	2383	32	baseline	math	subtraction	\N	2025-11-21 00:37:46.805	79	f	f	\N	2025-11-21 00:38:11.388	2025-11-21 00:38:11.388	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1787	2391	32	baseline	math	subtraction	\N	2025-11-21 00:45:05.219	79	f	f	\N	2025-11-21 00:45:51.152	2025-11-21 00:45:51.152	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1788	2392	32	baseline	math	subtraction	\N	2025-11-21 00:45:55.324	79	f	f	\N	2025-11-21 00:46:16.481	2025-11-21 00:46:16.481	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1792	2453	6	baseline	language	word	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:48:00.984	2025-11-21 00:48:00.984	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1801	2503	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 00:58:24.99	2025-11-21 00:58:24.99	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1802	2510	6	baseline	language	paragraph	\N	2025-11-17 17:00:00	110	f	f	\N	2025-11-21 00:58:51.127	2025-11-21 00:58:51.127	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1810	2540	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:07:59.1	2025-11-21 01:07:59.1	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1826	2598	10	baseline	math	word_problems	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:23:18.092	2025-11-21 01:23:18.092	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1836	2484	10	baseline	math	number_2digit	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:26:13.831	2025-11-21 01:26:13.831	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1856	2650	6	baseline	language	story	\N	2025-11-17 17:00:00	36	f	f	\N	2025-11-21 01:31:39.484	2025-11-21 01:31:39.484	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1874	2599	28	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:38:00.802	2025-11-21 01:38:00.802	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1877	2558	10	baseline	math	subtraction	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:38:57.282	2025-11-21 01:38:57.282	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1880	2526	10	baseline	math	division	\N	2025-11-16 17:00:00	40	f	f	\N	2025-11-21 01:39:41.368	2025-11-21 01:39:41.368	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1881	2669	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:39:51.723	2025-11-21 01:39:51.723	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1883	2591	28	baseline	math	number_2digit	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:40:04.132	2025-11-21 01:40:04.132	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1889	2517	10	baseline	math	number_1digit	\N	2025-11-16 17:00:00	45	f	f	\N	2025-11-21 01:41:44.602	2025-11-21 01:41:44.602	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1892	2578	28	baseline	math	subtraction	បានធ្វើតេស្តរួច	2025-11-17 17:00:00	74	f	f	\N	2025-11-21 01:42:50.078	2025-11-21 01:42:50.078	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1906	2690	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:49:34.718	2025-11-21 01:49:34.718	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1914	2700	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	57	f	f	\N	2025-11-21 01:57:11.629	2025-11-21 01:57:11.629	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1927	2679	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:09:07.788	2025-11-21 02:09:07.788	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1940	2653	8	baseline	language	comprehension1	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 02:21:38.232	2025-11-21 02:21:38.232	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
1948	2649	8	baseline	language	comprehension1	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 02:27:31.091	2025-11-21 02:27:31.091	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1952	2732	30	baseline	math	subtraction	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:30:00.642	2025-11-21 02:30:00.642	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1954	2734	30	baseline	math	number_2digit	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:31:35.322	2025-11-21 02:31:35.322	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1963	2748	30	baseline	math	word_problems	\N	2025-11-17 17:00:00	58	f	f	\N	2025-11-21 02:39:05.454	2025-11-21 02:39:05.454	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
1967	2739	16	baseline	math	subtraction	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:40:52.387	2025-11-21 02:40:52.387	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1969	2737	16	baseline	math	word_problems	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:41:56.899	2025-11-21 02:41:56.899	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
1971	2736	16	baseline	math	division	\N	2025-11-16 17:00:00	113	f	f	\N	2025-11-21 02:42:37.755	2025-11-21 02:42:37.755	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2004	2782	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:11:09.056	2025-11-21 03:11:09.056	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2005	2783	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:11:50.669	2025-11-21 03:11:50.669	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2006	2784	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:12:41.186	2025-11-21 03:12:41.186	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2007	2785	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:13:42.284	2025-11-21 03:13:42.284	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2008	2786	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:14:34.905	2025-11-21 03:14:34.905	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2009	2787	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:15:23.479	2025-11-21 03:15:23.479	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2010	2788	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:16:07.982	2025-11-21 03:16:07.982	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2011	2789	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:17:07.356	2025-11-21 03:17:07.356	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2012	2790	29	baseline	math	division	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:18:10.363	2025-11-21 03:18:10.363	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2013	2791	29	baseline	math	subtraction	\N	2025-11-21 03:20:04.645	106	f	f	\N	2025-11-21 03:20:23.821	2025-11-21 03:20:23.821	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2014	2792	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:21:49.452	2025-11-21 03:21:49.452	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2015	2793	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:22:49.188	2025-11-21 03:22:49.188	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2016	2794	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:23:30.402	2025-11-21 03:23:30.402	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2017	2795	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:24:10.328	2025-11-21 03:24:10.328	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2018	2796	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:24:51.603	2025-11-21 03:24:51.603	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2019	2797	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:25:53.792	2025-11-21 03:25:53.792	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2020	2798	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:26:47.421	2025-11-21 03:26:47.421	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2021	2803	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:28:31.565	2025-11-21 03:28:31.565	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2022	2804	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:29:20.435	2025-11-21 03:29:20.435	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2023	2805	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:30:11.881	2025-11-21 03:30:11.881	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2024	2808	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:31:20.316	2025-11-21 03:31:20.316	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2025	2810	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:32:49.384	2025-11-21 03:32:49.384	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2026	2811	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	106	f	f	\N	2025-11-21 03:33:36.856	2025-11-21 03:33:36.856	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2027	2812	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:38:15.746	2025-11-21 03:38:15.746	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2028	2814	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:39:32.62	2025-11-21 03:39:32.62	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2029	2815	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:40:33.46	2025-11-21 03:40:33.46	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2030	2816	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:41:23.526	2025-11-21 03:41:23.526	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2031	2817	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:42:18.2	2025-11-21 03:42:18.2	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2032	2818	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:43:05.204	2025-11-21 03:43:05.204	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2033	2819	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:43:51.126	2025-11-21 03:43:51.126	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2034	2821	29	baseline	math	beginner	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:44:52.127	2025-11-21 03:44:52.127	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2035	2822	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:45:47.269	2025-11-21 03:45:47.269	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2036	2823	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:46:40.014	2025-11-21 03:46:40.014	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2037	2824	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:47:25.948	2025-11-21 03:47:25.948	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2038	2825	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:48:19.119	2025-11-21 03:48:19.119	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2039	2826	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:49:06.391	2025-11-21 03:49:06.391	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2040	2827	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:50:03.142	2025-11-21 03:50:03.142	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2041	2828	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:52:02.051	2025-11-21 03:52:02.051	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2042	2829	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:53:02.294	2025-11-21 03:53:02.294	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2043	2830	29	baseline	math	division	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:53:48.991	2025-11-21 03:53:48.991	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2044	2831	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:54:46.103	2025-11-21 03:54:46.103	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2045	2832	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:55:41.342	2025-11-21 03:55:41.342	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2046	2833	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:56:27.3	2025-11-21 03:56:27.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2047	2834	29	baseline	math	number_1digit	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:57:33.832	2025-11-21 03:57:33.832	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2049	2836	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 03:59:23.14	2025-11-21 03:59:23.14	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2050	2837	29	baseline	math	word_problems	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 04:00:04.315	2025-11-21 04:00:04.315	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2051	2838	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 04:00:58.559	2025-11-21 04:00:58.559	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2052	2839	29	baseline	math	number_2digit	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 04:01:43.925	2025-11-21 04:01:43.925	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2053	2840	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 04:02:40.036	2025-11-21 04:02:40.036	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2054	2841	29	baseline	math	subtraction	\N	2025-11-17 17:00:00	56	f	f	\N	2025-11-21 04:03:28.045	2025-11-21 04:03:28.045	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2055	2643	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:24:54.73	2025-11-21 04:24:54.73	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2056	2640	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:25:52.817	2025-11-21 04:25:52.817	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2057	2470	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:27:14.546	2025-11-21 04:27:14.546	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2058	2635	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:29:09.888	2025-11-21 04:29:09.888	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2059	2678	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:30:14.169	2025-11-21 04:30:14.169	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2060	2631	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:30:27.683	2025-11-21 04:30:27.683	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2061	2677	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:32:19.753	2025-11-21 04:32:19.753	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2062	2585	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:32:29.68	2025-11-21 04:32:29.68	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2063	2629	8	baseline	language	comprehension1	\N	2025-11-17 17:00:00	34	f	f	\N	2025-11-21 04:33:47.474	2025-11-21 04:33:47.474	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2064	2674	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:34:50.361	2025-11-21 04:34:50.361	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2065	2618	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:34:57.786	2025-11-21 04:34:57.786	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2066	2672	13	baseline	math	number_2digit	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:35:57.733	2025-11-21 04:35:57.733	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2067	2627	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:36:15.256	2025-11-21 04:36:15.256	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2068	2853	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:36:27.641	2025-11-21 04:36:27.641	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2069	2670	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:37:29.866	2025-11-21 04:37:29.866	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2070	2617	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:37:44.754	2025-11-21 04:37:44.754	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2071	2852	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:39:08.504	2025-11-21 04:39:08.504	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2072	2615	8	baseline	language	story	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:39:49.487	2025-11-21 04:39:49.487	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2073	2663	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:40:10.877	2025-11-21 04:40:10.877	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2074	2851	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:40:23.756	2025-11-21 04:40:23.756	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2075	2592	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:41:01.939	2025-11-21 04:41:01.939	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2076	2660	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 04:41:31.491	2025-11-21 04:41:31.491	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2077	2850	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:41:49.705	2025-11-21 04:41:49.705	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2078	2613	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:42:08.855	2025-11-21 04:42:08.855	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2079	2849	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:43:28.808	2025-11-21 04:43:28.808	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2080	2611	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:43:33.906	2025-11-21 04:43:33.906	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2081	2848	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:44:22.461	2025-11-21 04:44:22.461	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2082	2606	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:44:48.816	2025-11-21 04:44:48.816	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2083	2847	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:45:46.157	2025-11-21 04:45:46.157	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2084	2846	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:46:37.11	2025-11-21 04:46:37.11	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2085	2845	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:47:29.301	2025-11-21 04:47:29.301	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2086	2844	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:48:03.942	2025-11-21 04:48:03.942	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2087	1866	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:48:46.741	2025-11-21 04:48:46.741	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2088	2843	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:48:52.168	2025-11-21 04:48:52.168	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2089	1951	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:49:37.412	2025-11-21 04:49:37.412	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2090	1862	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:50:14.794	2025-11-21 04:50:14.794	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2091	1949	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:50:22.288	2025-11-21 04:50:22.288	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2092	2854	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:50:37.863	2025-11-21 04:50:37.863	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2093	1947	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:51:00.628	2025-11-21 04:51:00.628	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2094	1859	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:51:20.323	2025-11-21 04:51:20.323	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2095	1945	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:51:31.226	2025-11-21 04:51:31.226	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2096	2856	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:51:44.522	2025-11-21 04:51:44.522	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2097	2857	8	baseline	language	comprehension1	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 04:51:53.013	2025-11-21 04:51:53.013	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2098	1858	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:52:11.534	2025-11-21 04:52:11.534	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2099	2858	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:52:32.256	2025-11-21 04:52:32.256	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2100	1943	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:52:51.107	2025-11-21 04:52:51.107	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2102	2859	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:53:16.719	2025-11-21 04:53:16.719	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2106	1934	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:54:23.868	2025-11-21 04:54:23.868	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2107	1851	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:54:31.141	2025-11-21 04:54:31.141	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2108	2860	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:54:48.793	2025-11-21 04:54:48.793	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2109	1932	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:54:59.985	2025-11-21 04:54:59.985	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2110	1847	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:55:04.854	2025-11-21 04:55:04.854	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2111	1846	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:55:39.433	2025-11-21 04:55:39.433	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2101	1855	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:53:15.637	2025-11-21 04:53:15.637	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2103	1941	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:53:21.583	2025-11-21 04:53:21.583	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2104	1938	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:53:52.796	2025-11-21 04:53:52.796	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2105	1854	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:53:56.091	2025-11-21 04:53:56.091	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2112	2861	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:55:39.771	2025-11-21 04:55:39.771	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2113	1928	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:55:48.181	2025-11-21 04:55:48.181	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2114	1843	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:56:11.573	2025-11-21 04:56:11.573	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2115	2862	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:56:23.85	2025-11-21 04:56:23.85	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2116	1925	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:56:26.921	2025-11-21 04:56:26.921	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2117	1838	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:56:43.003	2025-11-21 04:56:43.003	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2118	1923	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-21 04:57:08.825	2025-11-21 04:57:08.825	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2119	1836	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:57:17.632	2025-11-21 04:57:17.632	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2120	2863	27	baseline	math	word_problems	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:57:19.352	2025-11-21 04:57:19.352	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2121	1834	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:57:58.556	2025-11-21 04:57:58.556	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2122	2864	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:58:16.354	2025-11-21 04:58:16.354	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2123	1831	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:58:29.784	2025-11-21 04:58:29.784	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2124	1828	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:59:01.069	2025-11-21 04:59:01.069	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2125	2865	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 04:59:04.78	2025-11-21 04:59:04.78	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2126	1824	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 04:59:44.536	2025-11-21 04:59:44.536	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2127	2868	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:00:19.922	2025-11-21 05:00:19.922	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2128	1822	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:00:39.879	2025-11-21 05:00:39.879	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2129	2870	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:01:17.254	2025-11-21 05:01:17.254	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2130	1821	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:01:18.333	2025-11-21 05:01:18.333	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2131	1820	9	baseline	math	division	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:01:45.629	2025-11-21 05:01:45.629	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2132	1815	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:02:17.241	2025-11-21 05:02:17.241	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2133	2872	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:02:29.236	2025-11-21 05:02:29.236	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2134	1810	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:02:47.499	2025-11-21 05:02:47.499	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2135	1807	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:03:27.11	2025-11-21 05:03:27.11	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2136	2874	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:03:39.324	2025-11-21 05:03:39.324	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2137	1801	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:03:55.681	2025-11-21 05:03:55.681	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2138	1799	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	38	f	f	\N	2025-11-21 05:04:23.41	2025-11-21 05:04:23.41	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2139	2875	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:04:35.359	2025-11-21 05:04:35.359	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2140	2876	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:05:34.049	2025-11-21 05:05:34.049	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2141	2877	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:06:24.469	2025-11-21 05:06:24.469	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2142	2878	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:07:22.976	2025-11-21 05:07:22.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2143	2879	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:08:15.027	2025-11-21 05:08:15.027	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2144	2880	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:09:26.192	2025-11-21 05:09:26.192	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2145	2881	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:10:18.786	2025-11-21 05:10:18.786	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2146	2882	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:11:14.471	2025-11-21 05:11:14.471	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2147	2883	27	baseline	math	subtraction	\N	2025-11-17 00:00:00	119	f	f	\N	2025-11-21 05:12:13.264	2025-11-21 05:13:17.627	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2148	2656	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:13:27.664	2025-11-21 05:13:27.664	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2149	2884	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:14:36.56	2025-11-21 05:14:36.56	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2150	2885	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:15:48.343	2025-11-21 05:15:48.343	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2151	2654	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:16:39.708	2025-11-21 05:16:39.708	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2152	1833	9	baseline	math	division	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:19:39.535	2025-11-21 05:19:39.535	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2153	2886	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:20:07.665	2025-11-21 05:20:07.665	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2154	2652	13	baseline	math	subtraction	\N	2025-11-21 05:19:32.74	42	f	f	\N	2025-11-21 05:20:35.454	2025-11-21 05:20:35.454	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2156	2887	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:21:36.235	2025-11-21 05:21:36.235	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2157	1848	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:22:14.063	2025-11-21 05:22:14.063	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2158	2888	27	baseline	math	division	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:23:17.581	2025-11-21 05:23:17.581	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2155	1837	9	baseline	math	subtraction	\N	2025-11-17 00:00:00	44	f	f	\N	2025-11-21 05:20:42.969	2025-11-21 05:23:24.858	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2159	2648	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:24:24.996	2025-11-21 05:24:24.996	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2160	2889	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:24:31.488	2025-11-21 05:24:31.488	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2161	2890	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:25:23.106	2025-11-21 05:25:23.106	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2162	2891	27	baseline	math	number_2digit	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:26:34.479	2025-11-21 05:26:34.479	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2163	2892	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:27:36.761	2025-11-21 05:27:36.761	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2164	2893	27	baseline	math	subtraction	\N	2025-11-16 17:00:00	119	f	f	\N	2025-11-21 05:28:34.559	2025-11-21 05:28:34.559	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2165	2646	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:28:45.136	2025-11-21 05:28:45.136	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2166	1852	9	baseline	math	division	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:28:55.962	2025-11-21 05:28:55.962	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2167	1857	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:30:41.825	2025-11-21 05:30:41.825	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2168	2441	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:31:21.959	2025-11-21 05:31:21.959	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2169	1861	9	baseline	math	division	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:32:50.592	2025-11-21 05:32:50.592	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2170	1864	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:33:37.865	2025-11-21 05:33:37.865	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2171	2644	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:34:39.959	2025-11-21 05:34:39.959	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2172	1868	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:34:43.233	2025-11-21 05:34:43.233	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2173	1870	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:35:24.414	2025-11-21 05:35:24.414	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2174	1873	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:36:07.98	2025-11-21 05:36:07.98	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2175	1874	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:37:00.601	2025-11-21 05:37:00.601	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2176	1876	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:37:51.5	2025-11-21 05:37:51.5	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2177	2642	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:37:59.968	2025-11-21 05:37:59.968	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2178	1879	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:38:52.218	2025-11-21 05:38:52.218	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2179	1886	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:39:43.32	2025-11-21 05:39:43.32	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2180	1891	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:40:36.416	2025-11-21 05:40:36.416	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2181	2636	13	baseline	math	number_2digit	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:41:13.344	2025-11-21 05:41:13.344	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2182	1893	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:41:27.167	2025-11-21 05:41:27.167	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2183	1896	9	baseline	math	word_problems	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:42:22.117	2025-11-21 05:42:22.117	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2184	1899	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:43:05.495	2025-11-21 05:43:05.495	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2185	1902	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:44:12.429	2025-11-21 05:44:12.429	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2186	1904	9	baseline	math	subtraction	\N	2025-11-21 05:44:16.972	44	f	f	\N	2025-11-21 05:45:15.278	2025-11-21 05:45:15.278	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2187	2632	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:46:09.637	2025-11-21 05:46:09.637	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2188	1907	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:46:22.459	2025-11-21 05:46:22.459	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2189	2899	29	baseline	math	number_2digit	\N	2025-11-16 17:00:00	56	f	f	\N	2025-11-21 05:46:27.651	2025-11-21 05:46:27.651	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2190	1912	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:47:09.982	2025-11-21 05:47:09.982	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2191	1940	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:48:01.505	2025-11-21 05:48:01.505	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2192	2630	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 05:48:18.356	2025-11-21 05:48:18.356	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2048	2835	29	baseline	math	subtraction	\N	2025-11-18 00:00:00	56	f	f	\N	2025-11-21 03:58:20.153	2025-11-21 05:48:21.032	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2193	1914	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:49:16.124	2025-11-21 05:49:16.124	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2194	1918	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:50:00.667	2025-11-21 05:50:00.667	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2195	1920	9	baseline	math	number_1digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:51:03.007	2025-11-21 05:51:03.007	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2196	1924	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:51:46.6	2025-11-21 05:51:46.6	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2197	1927	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:52:34.834	2025-11-21 05:52:34.834	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2198	1929	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:53:17.945	2025-11-21 05:53:17.945	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2199	1931	9	baseline	math	subtraction	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:53:57.8	2025-11-21 05:53:57.8	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2200	1936	9	baseline	math	number_2digit	\N	2025-11-16 17:00:00	44	f	f	\N	2025-11-21 05:54:52.047	2025-11-21 05:54:52.047	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2201	2628	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:00:13.3	2025-11-21 06:00:13.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2202	2281	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:01:44.227	2025-11-21 06:01:44.227	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2203	2619	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:03:18.101	2025-11-21 06:03:18.101	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2204	2279	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:05:00.074	2025-11-21 06:05:00.074	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2205	2929	1	baseline	language	paragraph	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:06:18.956	2025-11-21 06:06:18.956	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2206	2274	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:07:09.669	2025-11-21 06:07:09.669	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2207	2616	13	baseline	math	number_2digit	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:07:25.175	2025-11-21 06:07:25.175	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2208	2928	1	baseline	language	letter	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:07:29.203	2025-11-21 06:07:29.203	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2209	2927	1	baseline	language	comprehension1	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:08:14.04	2025-11-21 06:08:14.04	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2210	2926	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:09:28.93	2025-11-21 06:09:28.93	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2211	2614	13	baseline	math	number_2digit	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:09:46.553	2025-11-21 06:09:46.553	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2212	2925	1	baseline	language	comprehension2	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:10:24.908	2025-11-21 06:10:24.908	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2213	2273	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:10:30.872	2025-11-21 06:10:30.872	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2214	2924	1	baseline	language	comprehension2	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:11:12.672	2025-11-21 06:11:12.672	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2215	2923	1	baseline	language	letter	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:11:47.159	2025-11-21 06:11:47.159	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2216	2922	1	baseline	language	paragraph	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:12:22.193	2025-11-21 06:12:22.193	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2217	2272	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:12:48.347	2025-11-21 06:12:48.347	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2218	2612	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:12:55.367	2025-11-21 06:12:55.367	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2219	2921	1	baseline	language	comprehension2	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:12:59.283	2025-11-21 06:12:59.283	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2220	2920	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:13:36.859	2025-11-21 06:13:36.859	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2221	2919	1	baseline	language	letter	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:14:15.529	2025-11-21 06:14:15.529	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2222	2271	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:14:22.236	2025-11-21 06:14:22.236	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2223	2602	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:14:37.532	2025-11-21 06:14:37.532	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2224	2918	1	baseline	language	comprehension2	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:14:43.655	2025-11-21 06:14:43.655	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2225	2917	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:15:22.337	2025-11-21 06:15:22.337	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2226	2270	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:15:53.572	2025-11-21 06:15:53.572	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2227	2916	1	baseline	language	paragraph	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:16:08.86	2025-11-21 06:16:08.86	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2228	2915	1	baseline	language	letter	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:16:33.73	2025-11-21 06:16:33.73	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2229	2596	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:16:37.658	2025-11-21 06:16:37.658	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2230	2914	1	baseline	language	comprehension2	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:17:03.906	2025-11-21 06:17:03.906	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2231	2269	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:17:21.719	2025-11-21 06:17:21.719	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2232	2913	1	baseline	language	paragraph	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:18:43.872	2025-11-21 06:18:43.872	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2233	2268	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:18:46.906	2025-11-21 06:18:46.906	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2234	2589	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:18:55.647	2025-11-21 06:18:55.647	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2235	2912	1	baseline	language	word	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:19:19.415	2025-11-21 06:19:19.415	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2236	2267	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:20:17.555	2025-11-21 06:20:17.555	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2237	2911	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:20:22.618	2025-11-21 06:20:22.618	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2238	2910	1	baseline	language	comprehension1	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:20:50.693	2025-11-21 06:20:50.693	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2239	2909	1	baseline	language	comprehension1	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:21:16.019	2025-11-21 06:21:16.019	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2240	2561	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:21:17.324	2025-11-21 06:21:17.324	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2241	2266	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:21:43.223	2025-11-21 06:21:43.223	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2242	2908	1	baseline	language	letter	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:21:53.592	2025-11-21 06:21:53.592	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2243	2907	1	baseline	language	paragraph	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:22:23.532	2025-11-21 06:22:23.532	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2244	2906	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:22:47.171	2025-11-21 06:22:47.171	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2245	1452	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:23:08.582	2025-11-21 06:23:08.582	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2246	2494	13	baseline	math	subtraction	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:23:11.644	2025-11-21 06:23:11.644	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2247	2905	1	baseline	language	story	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:23:13.614	2025-11-21 06:23:13.614	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2248	2904	1	baseline	language	comprehension1	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:23:45.837	2025-11-21 06:23:45.837	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2249	2903	1	baseline	language	comprehension1	\N	2025-11-16 17:00:00	30	f	f	\N	2025-11-21 06:24:06.812	2025-11-21 06:24:06.812	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2250	1459	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:24:23.206	2025-11-21 06:24:23.206	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2251	2489	13	baseline	math	number_2digit	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:25:47.753	2025-11-21 06:25:47.753	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2252	2264	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:25:50.409	2025-11-21 06:25:50.409	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2253	1463	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:27:04.464	2025-11-21 06:27:04.464	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2254	2480	13	baseline	math	word_problems	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:27:55.004	2025-11-21 06:27:55.004	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2255	2261	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:29:12.651	2025-11-21 06:29:12.651	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2256	2475	13	baseline	math	division	\N	2025-11-16 17:00:00	42	f	f	\N	2025-11-21 06:29:37.916	2025-11-21 06:29:37.916	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2257	1466	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:30:39.952	2025-11-21 06:30:39.952	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2258	2260	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:32:29.136	2025-11-21 06:32:29.136	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2259	1474	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:33:42.808	2025-11-21 06:33:42.808	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2260	2257	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:35:07.562	2025-11-21 06:35:07.562	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2261	2255	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:36:30.942	2025-11-21 06:36:30.942	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2262	2254	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:39:13.555	2025-11-21 06:39:13.555	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2263	2252	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:41:13.926	2025-11-21 06:41:13.926	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
1917	2186	13	baseline	math	subtraction	\N	2025-11-17 00:00:00	42	f	f	\N	2025-11-21 02:00:33.748	2025-11-21 06:42:08.496	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2264	2250	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:42:44.888	2025-11-21 06:42:44.888	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2265	2957	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:43:48.601	2025-11-21 06:43:48.601	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2266	2956	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:44:28.549	2025-11-21 06:44:28.549	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2267	2249	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:44:38.41	2025-11-21 06:44:38.41	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2268	2955	1	baseline	math	number_2digit	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:45:14.044	2025-11-21 06:45:14.044	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2269	2954	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:45:43.953	2025-11-21 06:45:43.953	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2270	2246	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:46:21.184	2025-11-21 06:46:21.184	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2271	2953	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:46:31.924	2025-11-21 06:46:31.924	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2272	2952	1	baseline	math	number_2digit	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:46:56.134	2025-11-21 06:46:56.134	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2273	2951	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:47:25.216	2025-11-21 06:47:25.216	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2274	2950	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:47:52.456	2025-11-21 06:47:52.456	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2275	2238	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:47:59.392	2025-11-21 06:47:59.392	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2276	2949	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:48:20.376	2025-11-21 06:48:20.376	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2277	2948	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:48:49.68	2025-11-21 06:48:49.68	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2278	2947	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:49:18.265	2025-11-21 06:49:18.265	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2279	2234	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:49:38.853	2025-11-21 06:49:38.853	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2280	2946	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:49:48.445	2025-11-21 06:49:48.445	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2281	2945	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:50:24.251	2025-11-21 06:50:24.251	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2282	2944	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:50:48.947	2025-11-21 06:50:48.947	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2283	2943	1	baseline	math	number_2digit	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:51:13.731	2025-11-21 06:51:13.731	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2284	2224	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:51:16.309	2025-11-21 06:51:16.309	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2285	2942	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:51:44.765	2025-11-21 06:51:44.765	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2286	2941	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:52:06.05	2025-11-21 06:52:06.05	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2287	2940	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:52:34.962	2025-11-21 06:52:34.962	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2288	1514	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:52:48.349	2025-11-21 06:52:48.349	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2289	2939	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:53:05.268	2025-11-21 06:53:05.268	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2290	2938	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:53:30.49	2025-11-21 06:53:30.49	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2291	2937	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:53:56.212	2025-11-21 06:53:56.212	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2292	1485	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:54:22.754	2025-11-21 06:54:22.754	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2293	2936	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:54:27.564	2025-11-21 06:54:27.564	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2294	2935	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:54:53.444	2025-11-21 06:54:53.444	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2295	1482	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:56:15.313	2025-11-21 06:56:15.313	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2296	1479	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 06:58:07.583	2025-11-21 06:58:07.583	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2297	2934	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:59:08.782	2025-11-21 06:59:08.782	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2298	2933	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:59:33.748	2025-11-21 06:59:33.748	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2299	2932	1	baseline	math	division	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 06:59:59.424	2025-11-21 06:59:59.424	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2300	2931	1	baseline	math	subtraction	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 07:00:31.1	2025-11-21 07:00:31.1	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2301	2930	1	baseline	math	word_problems	\N	2025-11-16 17:00:00	109	f	f	\N	2025-11-21 07:00:52.401	2025-11-21 07:00:52.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2302	1477	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-21 07:01:11.93	2025-11-21 07:01:11.93	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2303	2622	8	baseline	language	comprehension2	\N	2025-11-16 17:00:00	34	f	f	\N	2025-11-21 07:06:28.314	2025-11-21 07:06:28.314	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2304	1747	27	baseline	math	division	\N	2025-11-21 07:10:43.592	105	f	f	\N	2025-11-21 07:10:57.364	2025-11-21 07:10:57.364	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2305	1745	27	baseline	math	subtraction	\N	2025-11-21 07:16:37.03	105	f	f	\N	2025-11-21 07:12:34.13	2025-11-21 07:12:34.13	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2306	1690	27	baseline	math	subtraction	\N	2025-11-21 07:17:57.303	105	f	f	\N	2025-11-21 07:13:35.005	2025-11-21 07:13:35.005	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2307	1691	27	baseline	math	subtraction	\N	2025-11-21 07:18:46.833	105	f	f	\N	2025-11-21 07:14:21.049	2025-11-21 07:14:21.049	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2308	1693	27	baseline	math	word_problems	\N	2025-11-21 07:19:37.095	105	f	f	\N	2025-11-21 07:15:17.503	2025-11-21 07:15:17.503	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2309	1694	27	baseline	math	division	\N	2025-11-21 07:20:31.746	105	f	f	\N	2025-11-21 07:16:38.084	2025-11-21 07:16:38.084	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2310	1695	27	baseline	math	word_problems	\N	2025-11-21 07:21:54.123	105	f	f	\N	2025-11-21 07:17:33.45	2025-11-21 07:17:33.45	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2311	1697	27	baseline	math	subtraction	\N	2025-11-21 07:22:42.551	105	f	f	\N	2025-11-21 07:18:19.32	2025-11-21 07:18:19.32	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2312	1698	27	baseline	math	word_problems	\N	2025-11-21 07:23:30.516	105	f	f	\N	2025-11-21 07:19:01.581	2025-11-21 07:19:01.581	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2313	1699	27	baseline	math	subtraction	\N	2025-11-21 07:24:30.747	105	f	f	\N	2025-11-21 07:20:06.521	2025-11-21 07:20:06.521	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2314	1701	27	baseline	math	word_problems	\N	2025-11-21 07:25:19.262	105	f	f	\N	2025-11-21 07:20:57.918	2025-11-21 07:20:57.918	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2315	1703	27	baseline	math	number_2digit	\N	2025-11-21 07:26:11.169	105	f	f	\N	2025-11-21 07:21:48.339	2025-11-21 07:21:48.339	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2316	1707	27	baseline	math	subtraction	\N	2025-11-21 07:26:58.507	105	f	f	\N	2025-11-21 07:22:34.197	2025-11-21 07:22:34.197	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2317	1708	27	baseline	math	subtraction	\N	2025-11-21 07:27:46.471	105	f	f	\N	2025-11-21 07:23:19.401	2025-11-21 07:23:19.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2318	1710	27	baseline	math	subtraction	\N	2025-11-21 07:28:30.15	105	f	f	\N	2025-11-21 07:24:06.359	2025-11-21 07:24:06.359	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2319	1711	27	baseline	math	subtraction	\N	2025-11-21 07:29:18.04	105	f	f	\N	2025-11-21 07:24:48.554	2025-11-21 07:24:48.554	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2320	1713	27	baseline	math	subtraction	\N	2025-11-21 07:29:55.825	105	f	f	\N	2025-11-21 07:25:29.383	2025-11-21 07:25:29.383	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2321	1715	27	baseline	math	subtraction	\N	2025-11-21 07:30:42.598	105	f	f	\N	2025-11-21 07:26:29.107	2025-11-21 07:26:29.107	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2322	1719	27	baseline	math	division	\N	2025-11-21 07:31:38.234	105	f	f	\N	2025-11-21 07:27:09.061	2025-11-21 07:27:09.061	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2323	1721	27	baseline	math	subtraction	\N	2025-11-21 07:32:22.48	105	f	f	\N	2025-11-21 07:28:49.749	2025-11-21 07:28:49.749	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2324	1722	27	baseline	math	word_problems	\N	2025-11-21 07:34:00.049	105	f	f	\N	2025-11-21 07:29:29.888	2025-11-21 07:29:29.888	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2325	1724	27	baseline	math	subtraction	\N	2025-11-21 07:34:45.564	105	f	f	\N	2025-11-21 07:30:14.457	2025-11-21 07:30:14.457	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2326	1725	27	baseline	math	division	\N	2025-11-21 07:35:21.673	105	f	f	\N	2025-11-21 07:30:53.522	2025-11-21 07:30:53.522	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2327	1727	27	baseline	math	subtraction	\N	2025-11-21 07:36:21.246	105	f	f	\N	2025-11-21 07:32:04.246	2025-11-21 07:32:04.246	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2328	1729	27	baseline	math	word_problems	\N	2025-11-21 07:37:18.919	105	f	f	\N	2025-11-21 07:32:45.882	2025-11-21 07:32:45.882	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2329	1731	27	baseline	math	subtraction	\N	2025-11-21 07:37:52.015	105	f	f	\N	2025-11-21 07:33:20.948	2025-11-21 07:33:20.948	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2330	1733	27	baseline	math	subtraction	\N	2025-11-21 07:38:39.305	105	f	f	\N	2025-11-21 07:34:08.892	2025-11-21 07:34:08.892	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2331	1734	27	baseline	math	subtraction	\N	2025-11-21 07:39:24.251	105	f	f	\N	2025-11-21 07:34:53.936	2025-11-21 07:34:53.936	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2332	1737	27	baseline	math	word_problems	\N	2025-11-21 07:40:07.598	105	f	f	\N	2025-11-21 07:35:34.866	2025-11-21 07:35:34.866	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2333	1738	27	baseline	math	word_problems	\N	2025-11-21 07:40:52.688	105	f	f	\N	2025-11-21 07:36:28.536	2025-11-21 07:36:28.536	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2334	1740	27	baseline	math	number_1digit	\N	2025-11-21 07:41:37.383	105	f	f	\N	2025-11-21 07:37:07.401	2025-11-21 07:37:07.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2335	1741	27	baseline	math	subtraction	\N	2025-11-21 07:42:13.999	105	f	f	\N	2025-11-21 07:37:41.271	2025-11-21 07:37:41.271	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2336	1742	27	baseline	math	subtraction	\N	2025-11-21 07:42:53.367	105	f	f	\N	2025-11-21 07:38:24.091	2025-11-21 07:38:24.091	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2337	1744	27	baseline	math	word_problems	\N	2025-11-21 07:43:36.492	105	f	f	\N	2025-11-21 07:39:08.941	2025-11-21 07:39:08.941	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2338	2990	27	baseline	math	number_2digit	\N	2025-11-21 07:48:51.79	105	f	f	\N	2025-11-21 07:44:36.07	2025-11-21 07:44:36.07	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2339	2992	27	baseline	math	subtraction	\N	2025-11-21 07:50:25.908	105	f	f	\N	2025-11-21 07:45:56.09	2025-11-21 07:45:56.09	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2340	3099	20	baseline	language	paragraph	\N	2025-11-21 10:49:20.013	68	f	f	\N	2025-11-21 10:50:59.013	2025-11-21 10:50:59.013	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2341	2977	20	baseline	language	comprehension2	\N	2025-11-21 10:52:01.809	68	f	f	\N	2025-11-21 10:52:27.175	2025-11-21 10:52:27.175	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2342	2978	20	baseline	language	word	\N	2025-11-21 10:53:06.047	68	f	f	\N	2025-11-21 10:53:26.25	2025-11-21 10:53:26.25	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2343	2979	20	baseline	language	story	\N	2025-11-21 10:56:03.642	68	f	f	\N	2025-11-21 10:56:29.345	2025-11-21 10:56:29.345	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2344	2980	20	baseline	language	story	\N	2025-11-21 10:56:45.086	68	f	f	\N	2025-11-21 10:56:57.128	2025-11-21 10:56:57.128	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2345	2981	20	baseline	language	comprehension2	\N	2025-11-21 10:57:35.831	68	f	f	\N	2025-11-21 10:57:50.639	2025-11-21 10:57:50.639	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2346	2989	20	baseline	language	comprehension2	\N	2025-11-21 10:58:13.637	68	f	f	\N	2025-11-21 10:58:27.775	2025-11-21 10:58:27.775	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2347	3072	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-21 10:59:06.856	2025-11-21 10:59:06.856	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2348	2983	20	baseline	language	letter	\N	2025-11-21 10:58:52.564	68	f	f	\N	2025-11-21 10:59:16.085	2025-11-21 10:59:16.085	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2349	2987	20	baseline	language	story	\N	2025-11-21 11:00:07.617	68	f	f	\N	2025-11-21 11:00:48.232	2025-11-21 11:00:48.232	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2350	2991	20	baseline	language	comprehension1	\N	2025-11-21 11:01:21.512	68	f	f	\N	2025-11-21 11:01:37.049	2025-11-21 11:01:37.049	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2351	2993	20	baseline	language	letter	\N	2025-11-21 11:46:16.323	81	f	f	\N	2025-11-21 11:47:49.572	2025-11-21 11:47:49.572	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2352	2994	20	baseline	language	paragraph	\N	2025-11-21 11:48:04.894	81	f	f	\N	2025-11-21 11:48:26.117	2025-11-21 11:48:26.117	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2353	2995	20	baseline	language	word	\N	2025-11-21 11:48:39.26	81	f	f	\N	2025-11-21 11:49:15.992	2025-11-21 11:49:15.992	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2354	2996	20	baseline	language	comprehension1	\N	2025-11-21 11:49:25.352	81	f	f	\N	2025-11-21 11:50:03.422	2025-11-21 11:50:03.422	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2355	2997	20	baseline	language	story	\N	2025-11-21 11:50:09.15	81	f	f	\N	2025-11-21 11:50:34.858	2025-11-21 11:50:34.858	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2356	2999	20	baseline	language	story	\N	2025-11-21 11:50:40.985	81	f	f	\N	2025-11-21 11:50:59.786	2025-11-21 11:50:59.786	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2357	3000	20	baseline	language	beginner	\N	2025-11-21 11:51:07.03	81	f	f	\N	2025-11-21 11:51:45.409	2025-11-21 11:51:45.409	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2358	3001	20	baseline	language	comprehension1	\N	2025-11-21 11:51:51.047	81	f	f	\N	2025-11-21 11:52:11.241	2025-11-21 11:52:11.241	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2359	3002	20	baseline	language	story	\N	2025-11-21 11:52:17.757	81	f	f	\N	2025-11-21 11:52:30.445	2025-11-21 11:52:30.445	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2360	3004	20	baseline	language	paragraph	\N	2025-11-21 11:52:41.022	81	f	f	\N	2025-11-21 11:52:57.01	2025-11-21 11:52:57.01	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2361	3005	20	baseline	language	letter	\N	2025-11-21 11:53:01.698	81	f	f	\N	2025-11-21 11:53:24.197	2025-11-21 11:53:24.197	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2362	3007	20	baseline	language	comprehension2	\N	2025-11-21 11:53:28.499	81	f	f	\N	2025-11-21 11:53:55.91	2025-11-21 11:53:55.91	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2363	3008	20	baseline	language	comprehension1	\N	2025-11-21 11:54:01.39	81	f	f	\N	2025-11-21 11:54:17.126	2025-11-21 11:54:17.126	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2364	3010	20	baseline	language	story	\N	2025-11-21 11:54:25.428	81	f	f	\N	2025-11-21 11:54:51.736	2025-11-21 11:54:51.736	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2365	3091	20	baseline	language	paragraph	\N	2025-11-21 11:54:55.936	81	f	f	\N	2025-11-21 11:56:19.211	2025-11-21 11:56:19.211	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2366	3021	20	baseline	language	story	\N	2025-11-21 11:56:25.641	81	f	f	\N	2025-11-21 11:56:57.724	2025-11-21 11:56:57.724	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2367	3023	20	baseline	language	beginner	\N	2025-11-21 11:57:09.078	81	f	f	\N	2025-11-21 11:57:25.446	2025-11-21 11:57:25.446	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2368	3079	20	baseline	language	comprehension2	\N	2025-11-21 11:57:29.058	81	f	f	\N	2025-11-21 11:57:45.561	2025-11-21 11:57:45.561	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2369	3080	20	baseline	language	paragraph	\N	2025-11-21 11:57:51.873	81	f	f	\N	2025-11-21 11:58:04.866	2025-11-21 11:58:04.866	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2370	3081	20	baseline	language	letter	\N	2025-11-21 11:58:12.385	81	f	f	\N	2025-11-21 11:58:32.115	2025-11-21 11:58:32.115	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2371	3082	20	baseline	language	story	\N	2025-11-21 11:58:35.69	81	f	f	\N	2025-11-21 11:58:52.097	2025-11-21 11:58:52.097	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2372	3083	20	baseline	language	letter	\N	2025-11-21 11:58:56.493	81	f	f	\N	2025-11-21 11:59:14.779	2025-11-21 11:59:14.779	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2373	3085	20	baseline	language	story	\N	2025-11-21 11:59:18.482	81	f	f	\N	2025-11-21 11:59:34.077	2025-11-21 11:59:34.077	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2374	3086	20	baseline	language	comprehension2	\N	2025-11-21 11:59:37.179	81	f	f	\N	2025-11-21 11:59:52.401	2025-11-21 11:59:52.401	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2375	3088	20	baseline	language	letter	\N	2025-11-21 11:59:57.527	81	f	f	\N	2025-11-21 12:01:39.877	2025-11-21 12:01:39.877	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2376	3093	20	baseline	language	paragraph	\N	2025-11-21 12:01:51.272	81	f	f	\N	2025-11-21 12:02:26.505	2025-11-21 12:02:26.505	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2377	3090	20	baseline	language	letter	\N	2025-11-21 12:02:31.543	81	f	f	\N	2025-11-21 12:02:45.043	2025-11-21 12:02:45.043	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2378	3092	20	baseline	language	story	\N	2025-11-21 12:02:51.008	81	f	f	\N	2025-11-21 12:03:15.997	2025-11-21 12:03:15.997	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2379	3095	20	baseline	language	letter	\N	2025-11-21 12:03:21.506	81	f	f	\N	2025-11-21 12:04:07.041	2025-11-21 12:04:07.041	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2380	3094	20	baseline	language	letter	\N	2025-11-21 12:04:10.953	81	f	f	\N	2025-11-21 12:04:45.391	2025-11-21 12:04:45.391	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2381	3096	20	baseline	language	comprehension1	\N	2025-11-21 12:04:49.523	81	f	f	\N	2025-11-21 12:05:09.089	2025-11-21 12:05:09.089	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2382	3097	20	baseline	language	paragraph	\N	2025-11-21 12:05:14.077	81	f	f	\N	2025-11-21 12:05:34.849	2025-11-21 12:05:34.849	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2383	3098	20	baseline	language	comprehension2	\N	2025-11-21 12:05:42.745	81	f	f	\N	2025-11-21 12:06:01.527	2025-11-21 12:06:01.527	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2384	3071	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:06:25.249	2025-11-22 00:06:25.249	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2385	3070	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:12:12.222	2025-11-22 00:12:12.222	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2386	3069	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:19:05.882	2025-11-22 00:19:05.882	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2387	3068	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:20:59.843	2025-11-22 00:20:59.843	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2388	3067	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:22:52.148	2025-11-22 00:22:52.148	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2389	3066	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:24:23.245	2025-11-22 00:24:23.245	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2390	3064	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:26:15.976	2025-11-22 00:26:15.976	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2391	3065	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:28:58.418	2025-11-22 00:28:58.418	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2392	3063	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:30:21.495	2025-11-22 00:30:21.495	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2393	3062	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:30:34.386	2025-11-22 00:30:34.386	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2394	3061	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:31:58.076	2025-11-22 00:31:58.076	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2395	2958	15	baseline	math	word_problems	\N	2025-11-22 00:32:00.409	26	f	f	\N	2025-11-22 00:33:41.23	2025-11-22 00:33:41.23	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2396	3060	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:33:42.182	2025-11-22 00:33:42.182	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2397	3059	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:35:06.055	2025-11-22 00:35:06.055	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2398	3057	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:37:20.85	2025-11-22 00:37:20.85	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2399	3058	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:37:53.05	2025-11-22 00:37:53.05	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2400	3056	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:39:17.66	2025-11-22 00:39:17.66	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2401	3055	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:40:37.43	2025-11-22 00:40:37.43	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2402	3003	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:41:00.925	2025-11-22 00:41:00.925	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2403	3054	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:41:56.884	2025-11-22 00:41:56.884	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2404	3053	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:43:31.659	2025-11-22 00:43:31.659	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2405	3052	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:44:09.885	2025-11-22 00:44:09.885	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2406	3051	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:45:47.799	2025-11-22 00:45:47.799	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2407	3050	15	baseline	math	subtraction	\N	2025-11-22 00:45:23.072	26	f	f	\N	2025-11-22 00:46:39.094	2025-11-22 00:46:39.094	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2408	3049	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:47:59.272	2025-11-22 00:47:59.272	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2409	2959	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:49:35.684	2025-11-22 00:49:35.684	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2410	3048	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:49:37.862	2025-11-22 00:49:37.862	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2411	3047	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:50:58.831	2025-11-22 00:50:58.831	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2412	3046	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:52:22.878	2025-11-22 00:52:22.878	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2413	2998	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:52:39.025	2025-11-22 00:52:39.025	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2414	3045	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:54:02.653	2025-11-22 00:54:02.653	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2415	3043	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:55:56.352	2025-11-22 00:55:56.352	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2416	3042	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:57:14.21	2025-11-22 00:57:14.21	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2417	3044	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 00:57:34.965	2025-11-22 00:57:34.965	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2418	3041	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 00:59:26.778	2025-11-22 00:59:26.778	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2419	3009	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:01:00.372	2025-11-22 01:01:00.372	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2420	3040	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:01:04.96	2025-11-22 01:01:04.96	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2421	3038	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:02:40.873	2025-11-22 01:02:40.873	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2422	3037	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:04:33.332	2025-11-22 01:04:33.332	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2423	3033	15	baseline	math	division	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:05:53.838	2025-11-22 01:05:53.838	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2424	3036	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:06:11.707	2025-11-22 01:06:11.707	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2425	3035	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:07:50.564	2025-11-22 01:07:50.564	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2426	3034	15	baseline	math	division	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:09:06.109	2025-11-22 01:09:06.109	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2427	3032	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:10:05.238	2025-11-22 01:10:05.238	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2428	3031	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:11:39.993	2025-11-22 01:11:39.993	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2429	3014	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:12:05.316	2025-11-22 01:12:05.316	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2430	3030	15	baseline	math	division	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:13:10.805	2025-11-22 01:13:10.805	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2431	3028	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:14:32.809	2025-11-22 01:14:32.809	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2432	3011	15	baseline	math	subtraction	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:14:38.583	2025-11-22 01:14:38.583	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2433	3026	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:16:30.645	2025-11-22 01:16:30.645	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2434	3020	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	118	f	f	\N	2025-11-22 01:18:18.076	2025-11-22 01:18:18.076	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2435	3017	15	baseline	math	word_problems	\N	2025-11-16 17:00:00	26	f	f	\N	2025-11-22 01:18:58.301	2025-11-22 01:18:58.301	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2436	2381	23	baseline_verification	language	story	\N	2025-11-27 17:00:00	15	f	t	1699	2025-11-22 02:17:23.486	2025-11-22 02:17:23.486	mentor	production	\N	ឧបករណ៍តេស្ត លេខ៤	Yes	\N	\N	\N	f	\N	\N
1699	2381	24	baseline	language	comprehension1	\N	2025-11-20 15:15:28.267	80	f	f	\N	2025-11-20 15:16:09.252	2025-11-22 02:17:26.625	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	15	2025-11-22 02:17:26.624	Verified by mentor assessment #2436	f	\N	\N
2437	3100	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:33:52.346	2025-11-22 03:33:52.346	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2438	3180	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:34:32.539	2025-11-22 03:34:32.539	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2439	1867	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:35:09.949	2025-11-22 03:35:09.949	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2440	3101	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:35:46.111	2025-11-22 03:35:46.111	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2441	1869	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:36:30.867	2025-11-22 03:36:30.867	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2442	3102	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:37:19.293	2025-11-22 03:37:19.293	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2443	1871	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:38:06.01	2025-11-22 03:38:06.01	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2444	3103	5	baseline	language	comprehension1	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:38:55.918	2025-11-22 03:38:55.918	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2445	3104	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:39:51.126	2025-11-22 03:39:51.126	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2446	1877	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:40:46.992	2025-11-22 03:40:46.992	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2447	3105	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:41:32.571	2025-11-22 03:41:32.571	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2448	1880	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:42:10.599	2025-11-22 03:42:10.599	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2449	3107	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:42:55.303	2025-11-22 03:42:55.303	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2450	3169	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:43:41.964	2025-11-22 03:43:41.964	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2451	1881	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:45:02.922	2025-11-22 03:45:02.922	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2452	1882	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:45:41.132	2025-11-22 03:45:41.132	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2453	1883	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:46:17.827	2025-11-22 03:46:17.827	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2454	3170	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:46:57.873	2025-11-22 03:46:57.873	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2455	3181	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:47:46.605	2025-11-22 03:47:46.605	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2456	3171	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:48:21.56	2025-11-22 03:48:21.56	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2457	1887	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:49:06.006	2025-11-22 03:49:06.006	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2458	1890	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:50:24.347	2025-11-22 03:50:24.347	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2459	1894	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:51:18.376	2025-11-22 03:51:18.376	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2460	1898	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:51:48.998	2025-11-22 03:51:48.998	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2461	1900	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:52:31.527	2025-11-22 03:52:31.527	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2462	3172	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:53:08.534	2025-11-22 03:53:08.534	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2463	1903	5	baseline	language	letter	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:54:28.261	2025-11-22 03:54:28.261	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2464	3173	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:55:39.322	2025-11-22 03:55:39.322	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2465	3174	5	baseline	language	comprehension2	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:56:21.273	2025-11-22 03:56:21.273	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2466	3175	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:56:57.108	2025-11-22 03:56:57.108	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2467	3176	5	baseline	language	story	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:57:51.897	2025-11-22 03:57:51.897	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2468	3177	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:58:22.69	2025-11-22 03:58:22.69	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2469	1908	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:58:58.125	2025-11-22 03:58:58.125	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2470	1917	5	baseline	language	beginner	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 03:59:24.687	2025-11-22 03:59:24.687	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2471	1919	5	baseline	language	word	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 04:00:04.8	2025-11-22 04:00:04.8	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2472	3178	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 04:00:42.451	2025-11-22 04:00:42.451	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2473	3179	5	baseline	language	paragraph	\N	2025-11-17 17:00:00	37	f	f	\N	2025-11-22 04:01:10.524	2025-11-22 04:01:10.524	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2474	3108	17	baseline	math	division	26	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:41:30.742	2025-11-22 09:41:30.742	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2475	3109	17	baseline	math	word_problems	27	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:43:21.472	2025-11-22 09:43:21.472	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2476	3110	17	baseline	math	word_problems	28	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:45:59.384	2025-11-22 09:45:59.384	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2477	3111	17	baseline	math	word_problems	29	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:49:41.108	2025-11-22 09:49:41.108	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2478	3112	17	baseline	math	word_problems	30	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:51:53.956	2025-11-22 09:51:53.956	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2479	3113	17	baseline	math	word_problems	31	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:54:23.663	2025-11-22 09:54:23.663	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2480	3114	17	baseline	math	word_problems	32	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:56:18.145	2025-11-22 09:56:18.145	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2481	3115	17	baseline	math	word_problems	33	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 09:59:11.831	2025-11-22 09:59:11.831	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2482	3116	17	baseline	math	division	34	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:01:35.957	2025-11-22 10:01:35.957	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2483	3117	17	baseline	math	division	35	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:03:49.539	2025-11-22 10:03:49.539	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2484	3118	17	baseline	math	word_problems	36	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:06:23.102	2025-11-22 10:06:23.102	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2485	3119	17	baseline	math	word_problems	37	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:08:29.477	2025-11-22 10:08:29.477	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2486	3120	17	baseline	math	word_problems	38	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:10:32.073	2025-11-22 10:10:32.073	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2487	3121	17	baseline	math	word_problems	39	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:12:47.961	2025-11-22 10:12:47.961	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2488	3122	17	baseline	math	word_problems	41	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:15:08.51	2025-11-22 10:15:08.51	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2489	3123	17	baseline	math	number_2digit	42	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:17:19.255	2025-11-22 10:17:19.255	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2490	3124	17	baseline	math	word_problems	43	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:22:24.445	2025-11-22 10:22:24.445	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2491	3125	17	baseline	math	word_problems	44	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:24:18.052	2025-11-22 10:24:18.052	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2492	3135	17	baseline	math	division	45	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:27:09.772	2025-11-22 10:27:09.772	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2493	3136	17	baseline	math	word_problems	46	2025-11-16 17:00:00	54	f	f	\N	2025-11-22 10:29:05.57	2025-11-22 10:29:05.57	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2494	3137	17	baseline	math	division	47	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:31:11.992	2025-11-22 10:31:11.992	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2495	3138	17	baseline	math	word_problems	48	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:32:47.265	2025-11-22 10:32:47.265	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2496	3139	17	baseline	math	division	49	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:34:33.898	2025-11-22 10:34:33.898	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2497	3140	17	baseline	math	word_problems	50	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:36:35.247	2025-11-22 10:36:35.247	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2498	3141	17	baseline	math	word_problems	51	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:40:47.851	2025-11-22 10:40:47.851	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2499	3142	17	baseline	math	word_problems	52	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:43:01.017	2025-11-22 10:43:01.017	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2500	3143	17	baseline	math	word_problems	53	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:44:42.168	2025-11-22 10:44:42.168	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2501	3144	17	baseline	math	word_problems	54	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:48:57.62	2025-11-22 10:48:57.62	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2502	3145	17	baseline	math	word_problems	55	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:50:52.335	2025-11-22 10:50:52.335	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2503	3146	17	baseline	math	word_problems	56	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:52:19.112	2025-11-22 10:52:19.112	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2504	3147	17	baseline	math	word_problems	57	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:53:46.073	2025-11-22 10:53:46.073	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2505	3148	17	baseline	math	word_problems	58	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:55:17.667	2025-11-22 10:55:17.667	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2506	3149	17	baseline	math	word_problems	59	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:56:51.617	2025-11-22 10:56:51.617	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2507	3150	17	baseline	math	word_problems	60	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 10:58:16.419	2025-11-22 10:58:16.419	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2508	3151	17	baseline	math	word_problems	61	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:00:08.997	2025-11-22 11:00:08.997	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2509	3152	17	baseline	math	word_problems	62	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:01:43.105	2025-11-22 11:01:43.105	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2510	3153	17	baseline	math	word_problems	63	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:03:20.196	2025-11-22 11:03:20.196	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2511	3154	17	baseline	math	word_problems	64	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:04:37.41	2025-11-22 11:04:37.41	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2512	3155	17	baseline	math	word_problems	65	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:06:00.297	2025-11-22 11:06:00.297	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2513	3156	17	baseline	math	word_problems	66	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:07:40.675	2025-11-22 11:07:40.675	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2514	3157	17	baseline	math	division	67	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:09:53.854	2025-11-22 11:09:53.854	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2515	3158	17	baseline	math	word_problems	67	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:12:55.471	2025-11-22 11:12:55.471	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2516	3159	17	baseline	math	division	68	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:14:28.519	2025-11-22 11:14:28.519	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2517	3160	17	baseline	math	word_problems	69	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:16:15.865	2025-11-22 11:16:15.865	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2518	3161	17	baseline	math	word_problems	70	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:21:00.045	2025-11-22 11:21:00.045	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2519	3162	17	baseline	math	word_problems	71	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:22:30.53	2025-11-22 11:22:30.53	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2520	3163	17	baseline	math	word_problems	73	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:24:37.843	2025-11-22 11:24:37.843	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2521	3164	17	baseline	math	division	74	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:26:25.694	2025-11-22 11:26:25.694	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2522	3165	17	baseline	math	word_problems	75	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:28:03.756	2025-11-22 11:28:03.756	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2523	3166	17	baseline	math	word_problems	76	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:29:46.624	2025-11-22 11:29:46.624	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2524	3167	17	baseline	math	division	77	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:31:27.028	2025-11-22 11:31:27.028	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2525	3168	17	baseline	math	word_problems	78	2025-11-17 17:00:00	54	f	f	\N	2025-11-22 11:32:55.423	2025-11-22 11:32:55.423	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2526	3182	3	baseline	language	story	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 01:17:27.863	2025-11-24 01:17:27.863	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
2527	3183	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 04:17:49.479	2025-11-24 04:17:49.479	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
2528	3184	3	baseline	language	comprehension1	\N	2025-11-06 17:00:00	31	f	f	\N	2025-11-24 08:09:45.3	2025-11-24 08:09:45.3	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
2529	3185	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:12:14.508	2025-11-24 08:12:14.508	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
2530	3186	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:14:52.236	2025-11-24 08:14:52.236	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
2531	3187	3	baseline	language	word	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:16:45.944	2025-11-24 08:16:45.944	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2532	3188	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:19:30.647	2025-11-24 08:19:30.647	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
2533	3189	3	baseline	language	letter	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:21:09.046	2025-11-24 08:21:09.046	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2534	3190	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:22:40.167	2025-11-24 08:22:40.167	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
2535	3191	3	baseline	language	letter	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:26:36.947	2025-11-24 08:26:36.947	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
2536	3192	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:35:18.723	2025-11-24 08:35:18.723	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	Yes	\N	\N	\N	f	\N	\N
2537	3193	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:37:11.91	2025-11-24 08:37:11.91	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2538	3194	3	baseline	language	word	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 08:40:35.089	2025-11-24 08:40:35.089	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
2539	3195	3	baseline	language	beginner	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:03:07.026	2025-11-24 09:03:07.026	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	Yes	\N	\N	\N	f	\N	\N
2540	3196	3	baseline	language	letter	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:08:42.541	2025-11-24 09:08:42.541	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	Yes	\N	\N	\N	f	\N	\N
2541	3197	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:11:12.409	2025-11-24 09:11:12.409	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
2542	3198	3	baseline	language	comprehension1	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:13:50.084	2025-11-24 09:13:50.084	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
2543	3199	3	baseline	language	letter	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:26:02.914	2025-11-24 09:26:02.914	teacher	production	\N	ឧបករណ៍តេស្ត លេខ២	No	\N	\N	\N	f	\N	\N
2544	3200	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 09:28:36.486	2025-11-24 09:28:36.486	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
2545	3201	3	baseline	language	word	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 16:19:26.059	2025-11-24 16:19:26.059	teacher	production	\N	ឧបករណ៍តេស្ត លេខ៣	No	\N	\N	\N	f	\N	\N
2546	3202	3	baseline	language	paragraph	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 16:23:11.917	2025-11-24 16:23:11.917	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
2547	3203	3	baseline	language	comprehension2	\N	2025-11-16 17:00:00	31	f	f	\N	2025-11-24 16:27:17.89	2025-11-24 16:27:17.89	teacher	production	\N	ឧបករណ៍តេស្ត លេខ១	No	\N	\N	\N	f	\N	\N
\.


--
-- TOC entry 3867 (class 0 OID 130564)
-- Dependencies: 221
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_records (id, student_id, teacher_id, date, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3869 (class 0 OID 130571)
-- Dependencies: 223
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, user_role, user_email, action, resource_type, resource_id, resource_name, old_values, new_values, changed_fields, ip_address, user_agent, session_id, status, error_message, metadata, created_at) FROM stdin;
\.


--
-- TOC entry 3871 (class 0 OID 130578)
-- Dependencies: 225
-- Data for Name: bulk_imports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bulk_imports (id, import_type, file_name, file_path, total_rows, successful_rows, failed_rows, errors, imported_by, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3873 (class 0 OID 130586)
-- Dependencies: 227
-- Data for Name: clusters; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.clusters (id, name, code, description, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3875 (class 0 OID 130593)
-- Dependencies: 229
-- Data for Name: dashboard_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dashboard_stats (id, cache_key, role, user_id, total_schools, total_students, total_teachers, total_mentors, total_assessments, baseline_assessments, midline_assessments, endline_assessments, language_assessments, math_assessments, stats_data, last_updated, created_at) FROM stdin;
8	global	coordinator	\N	33	678	65	21	456	456	0	0	228	228	{"by_level": [{"math": 0, "khmer": 50, "level": "word"}, {"math": 0, "khmer": 83, "level": "comprehension2"}, {"math": 0, "khmer": 63, "level": "story"}, {"math": 0, "khmer": 51, "level": "comprehension1"}, {"math": 0, "khmer": 41, "level": "paragraph"}, {"math": 0, "khmer": 35, "level": "letter"}, {"math": 53, "khmer": 0, "level": "number_2digit"}, {"math": 6, "khmer": 0, "level": "word_problems"}, {"math": 0, "khmer": 27, "level": "beginner"}, {"math": 9, "khmer": 0, "level": "number_1digit"}, {"math": 29, "khmer": 0, "level": "subtraction"}, {"math": 9, "khmer": 0, "level": "division"}], "overall_results_math": [{"cycle": "baseline", "levels": {"division": 9, "subtraction": 29, "number_1digit": 9, "number_2digit": 53, "word_problems": 6}}, {"cycle": "midline", "levels": {}}, {"cycle": "endline", "levels": {}}], "overall_results_khmer": [{"cycle": "baseline", "levels": {"word": 50, "story": 63, "letter": 35, "beginner": 27, "paragraph": 41, "comprehension1": 51, "comprehension2": 83}}, {"cycle": "midline", "levels": {}}, {"cycle": "endline", "levels": {}}]}	2025-11-20 05:22:50.949	2025-11-19 08:33:19.312
\.


--
-- TOC entry 3877 (class 0 OID 130610)
-- Dependencies: 231
-- Data for Name: intervention_programs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.intervention_programs (id, name, description, start_date, end_date, target_group, expected_outcomes, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3879 (class 0 OID 130618)
-- Dependencies: 233
-- Data for Name: ip_whitelist; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ip_whitelist (id, ip_address, description, allowed_roles, is_active, added_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3881 (class 0 OID 130626)
-- Dependencies: 235
-- Data for Name: mentor_school_assignments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mentor_school_assignments (id, mentor_id, pilot_school_id, subject, assigned_by_id, assigned_date, is_active, notes, created_at, updated_at) FROM stdin;
3	97	17	Language	3	2025-10-13 08:23:21.866	t	\N	2025-10-13 08:23:21.866	2025-10-13 08:23:21.866
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
\.


--
-- TOC entry 3883 (class 0 OID 130635)
-- Dependencies: 237
-- Data for Name: mentoring_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mentoring_visits (id, mentor_id, pilot_school_id, visit_date, level, purpose, activities, observations, recommendations, follow_up_actions, photos, participants_count, duration_minutes, status, created_at, updated_at, action_plan, activities_data, activity1_clear_instructions, activity1_demonstrated, activity1_duration, activity1_followed_process, activity1_individual, activity1_name_language, activity1_name_numeracy, activity1_no_clear_instructions_reason, activity1_not_followed_reason, activity1_small_groups, activity1_students_practice, activity1_type, activity1_unclear_reason, activity2_clear_instructions, activity2_demonstrated, activity2_duration, activity2_followed_process, activity2_individual, activity2_name_language, activity2_name_numeracy, activity2_no_clear_instructions_reason, activity2_not_followed_reason, activity2_small_groups, activity2_students_practice, activity2_type, activity2_unclear_reason, activity3_clear_instructions, activity3_demonstrated, activity3_duration, activity3_individual, activity3_name_language, activity3_name_numeracy, activity3_no_clear_instructions_reason, activity3_small_groups, activity3_students_practice, children_grouped_appropriately, class_in_session, class_not_in_session_reason, class_started_on_time, classes_conducted_before, classes_conducted_before_visit, commune, district, feedback_for_teacher, follow_up_required, followed_lesson_plan, followed_session_plan, full_session_observed, grade_group, grades_observed, has_session_plan, is_locked, language_levels_observed, late_start_reason, lesson_plan_feedback, locked_at, locked_by, materials_present, no_follow_plan_reason, no_lesson_plan_reason, no_session_plan_reason, not_followed_reason, num_activities_observed, number_of_activities, numeracy_levels_observed, observation, photo, plan_appropriate_for_levels, program_type, province, questionnaire_data, region, school_id, score, session_plan_appropriate, students_active_participation, students_fully_involved, students_grouped_by_level, students_improved, students_improved_from_last_week, students_present, subject_observed, teacher_feedback, teacher_has_lesson_plan, teacher_id, teaching_materials, total_students_enrolled, village, created_by_role, is_temporary, record_status, test_session_id) FROM stdin;
6	94	17	2025-11-21 00:00:00	\N	\N	\N	\N	\N	\N	null	\N	\N	scheduled	2025-11-21 07:46:55.82	2025-11-21 07:46:55.82	\N	\N	t	f	12	t	\N	ការសន្ទនាសេរី	\N	\N	\N	\N	\N	\N	\N	t	f	12	t	\N	ការពណ៌នារូបភាព	\N	\N	\N	\N	\N	\N	\N	t	f	12	\N	ការចម្លងនិងសរសេរតាមអាន	\N	\N	\N	\N	t	t	\N	t	\N	2	\N	\N	\N	f	\N	t	t	\N	["ទី៤"]	t	f	["កម្រិតដំបូង","តួអក្សរ"]	\N	testing	\N	\N	["លេខ ០-៩៩","ការតម្រៀបល្បះ និងកូនសៀវភៅកែតម្រូវកំហុស","ប្រាក់លេង","សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា"]	\N	\N	\N	\N	\N	4	\N	\N	\N	\N	TaRL	\N	\N	\N	\N	\N	t	f	t	f	\N	2	12	Khmer	12 testing	\N	55	\N	12	\N	\N	f	production	\N
\.


--
-- TOC entry 3885 (class 0 OID 130649)
-- Dependencies: 239
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
32	កំពង់ចាម	កងមាស	\N	កម្រងរាយប៉ាយចុះគាំទ្រ	សាលាបឋមសិក្សារាយប៉ាយ	KAM_REA_470	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:54	2025-10-21 08:16:05.063	f
28	កំពង់ចាម	កងមាស	\N	កម្រងអង្គរបាន ចុះជួយគាំទ្រ	សាលាឋបសិក្សាសាខា២	KAM_SAK_138	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:49	2025-10-21 08:19:22.047	f
27	កំពង់ចាម	កងមាស	\N	កម្រងព្រែកកុយចុះជួយគាំទ្រ	សាលាបឋមសិក្សាព្រែកកុយ	KAM_PRE_826	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-10-05 00:00:00	2025-12-06 00:00:00	2025-09-28 00:00:00	2025-11-08 00:00:00	2025-09-10 19:05:48	2025-10-21 08:21:00.157	f
\.


--
-- TOC entry 3887 (class 0 OID 130657)
-- Dependencies: 241
-- Data for Name: progress_trackings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.progress_trackings (id, student_id, tracking_date, khmer_progress, math_progress, attendance_rate, behavior_notes, teacher_comments, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3889 (class 0 OID 130664)
-- Dependencies: 243
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.provinces (id, name_english, name_khmer, code, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3891 (class 0 OID 130671)
-- Dependencies: 245
-- Data for Name: quick_login_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quick_login_users (id, username, password, role, province, subject, is_active, created_at, updated_at, district, holding_classes, pilot_school_id, onboarding_completed, onboarding_completed_at, show_onboarding) FROM stdin;
8	kairav	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	admin	\N	\N	t	2025-09-27 05:57:48.469	2025-09-27 05:57:48.469	\N	\N	\N	\N	\N	t
9	admin	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	admin	\N	\N	t	2025-09-27 05:57:48.491	2025-09-27 05:57:48.491	\N	\N	\N	\N	\N	t
10	coordinator	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	coordinator	\N	\N	t	2025-09-27 05:57:48.499	2025-09-27 05:57:48.499	\N	\N	\N	\N	\N	t
11	deab.chhoeun	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.507	2025-09-27 05:57:48.507	\N	\N	\N	\N	\N	t
12	heap.sophea	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.52	2025-09-27 05:57:48.52	\N	\N	\N	\N	\N	t
13	leang.chhun.hourth	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	\N	\N	t	2025-09-27 05:57:48.527	2025-09-27 05:57:48.527	\N	\N	\N	\N	\N	t
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
33	kan.ray.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.71	2025-09-27 05:57:48.71	\N	\N	\N	\N	\N	t
34	keo.socheat.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.723	2025-09-27 05:57:48.723	\N	\N	\N	\N	\N	t
36	khim.kosal.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.739	2025-09-27 05:57:48.739	\N	\N	\N	\N	\N	t
37	koe.kimsou.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.753	2025-09-27 05:57:48.753	\N	\N	\N	\N	\N	t
38	kheav.sreyoun.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.763	2025-09-27 05:57:48.763	\N	\N	\N	\N	\N	t
40	nann.phary.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.783	2025-09-27 05:57:48.783	\N	\N	\N	\N	\N	t
41	ny.cheanichniron.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.792	2025-09-27 05:57:48.792	\N	\N	\N	\N	\N	t
43	on.phors.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.815	2025-09-27 05:57:48.815	\N	\N	\N	\N	\N	t
44	ou.sreynuch.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.835	2025-09-27 05:57:48.835	\N	\N	\N	\N	\N	t
45	pat.sokheng.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.843	2025-09-27 05:57:48.843	\N	\N	\N	\N	\N	t
47	raeun.sovathary.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.86	2025-09-27 05:57:48.86	\N	\N	\N	\N	\N	t
48	rin.vannra.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.867	2025-09-27 05:57:48.867	\N	\N	\N	\N	\N	t
49	rom.ratanak.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.88	2025-09-27 05:57:48.88	\N	\N	\N	\N	\N	t
51	sang.sangha.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.898	2025-09-27 05:57:48.898	\N	\N	\N	\N	\N	t
52	seum.sovin.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.906	2025-09-27 05:57:48.906	\N	\N	\N	\N	\N	t
53	soeun.danut.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.919	2025-09-27 05:57:48.919	\N	\N	\N	\N	\N	t
54	sokh.chamrong.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.935	2025-09-27 05:57:48.935	\N	\N	\N	\N	\N	t
25	chhoeng.marady	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	mentor	Battambang	both	t	2025-09-27 05:57:48.64	2025-10-02 03:33:07.818	Battambang	both	1	["complete_profile"]	2025-10-02 03:33:07.818	t
56	sor.kimseak.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.964	2025-09-27 05:57:48.964	\N	\N	\N	\N	\N	t
57	soth.thida.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:48.977	2025-09-27 05:57:48.977	\N	\N	\N	\N	\N	t
58	tep.sokly.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Khmer	t	2025-09-27 05:57:48.993	2025-09-27 05:57:48.993	\N	\N	\N	\N	\N	t
59	thiem.thida.bat	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	Maths	t	2025-09-27 05:57:49.002	2025-09-27 05:57:49.002	\N	\N	\N	\N	\N	t
61	chea.putthyda.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.031	2025-09-27 05:57:49.031	\N	\N	\N	\N	\N	t
62	moy.sodara.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.039	2025-09-27 05:57:49.039	\N	\N	\N	\N	\N	t
63	chhom.borin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.069	2025-09-27 05:57:49.069	\N	\N	\N	\N	\N	t
64	hoat.vimol.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.084	2025-09-27 05:57:49.084	\N	\N	\N	\N	\N	t
65	khoem.sithuon.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.091	2025-09-27 05:57:49.091	\N	\N	\N	\N	\N	t
66	neang.spheap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.105	2025-09-27 05:57:49.105	\N	\N	\N	\N	\N	t
67	nov.barang.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.112	2025-09-27 05:57:49.112	\N	\N	\N	\N	\N	t
69	pheap.sreynith.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.128	2025-09-27 05:57:49.128	\N	\N	\N	\N	\N	t
70	phoeurn.virath.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.135	2025-09-27 05:57:49.135	\N	\N	\N	\N	\N	t
71	phuong.pheap.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.142	2025-09-27 05:57:49.142	\N	\N	\N	\N	\N	t
72	say.kamsath.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.149	2025-09-27 05:57:49.149	\N	\N	\N	\N	\N	t
73	sorm.vannak.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.156	2025-09-27 05:57:49.156	\N	\N	\N	\N	\N	t
74	sum.chek.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.163	2025-09-27 05:57:49.163	\N	\N	\N	\N	\N	t
75	teour.phanna.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.172	2025-09-27 05:57:49.172	\N	\N	\N	\N	\N	t
77	chhorn.srey.pov.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Maths	t	2025-09-27 05:57:49.188	2025-09-27 05:57:49.188	\N	\N	\N	\N	\N	t
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
92	nheb.channin.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Kampong Cham	Khmer	t	2025-09-27 05:57:49.316	2025-09-27 05:57:49.316	\N	\N	\N	\N	\N	t
93	viewer	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	viewer	\N	\N	t	2025-09-27 05:57:49.325	2025-09-27 05:57:49.325	\N	\N	\N	\N	\N	t
76	chan.kimsrorn.kam	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	teacher	Battambang	khmer	t	2025-09-27 05:57:49.179	2025-10-02 04:35:48.541	Battambang	grade_5	1	["complete_profile"]	2025-10-02 03:23:44.848	t
94	Cheaphannha	$2b$10$NUZ4k4BZUpfEgFp5JJTb/.NE8N85B6H3AvtQzzcYL6C6/O9z1XIn6	mentor	Kampong Cham	គណិតវិទ្យា	t	2025-10-02 09:21:17.284	2025-10-02 09:21:17.284	Kampong Cham	ថ្នាក់ទី៤, ថ្នាក់ទី៥	33	\N	\N	t
\.


--
-- TOC entry 3893 (class 0 OID 130681)
-- Dependencies: 247
-- Data for Name: rate_limits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rate_limits (id, identifier, endpoint, requests_count, window_start, blocked_until, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3895 (class 0 OID 130690)
-- Dependencies: 249
-- Data for Name: report_exports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.report_exports (id, report_type, filters, file_path, status, exported_by, created_at, completed_at) FROM stdin;
\.


--
-- TOC entry 3897 (class 0 OID 130698)
-- Dependencies: 251
-- Data for Name: resource_views; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resource_views (id, resource_id, user_id, ip_address, user_agent, viewed_at) FROM stdin;
\.


--
-- TOC entry 3899 (class 0 OID 130705)
-- Dependencies: 253
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.resources (id, title, description, type, file_url, youtube_url, grade_levels, subjects, uploaded_by, is_public, views_count, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3901 (class 0 OID 130714)
-- Dependencies: 255
-- Data for Name: school_classes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.school_classes (id, school_id, name, grade, teacher_name, student_count, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3903 (class 0 OID 130721)
-- Dependencies: 257
-- Data for Name: schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schools (id, name, code, province_id, district, commune, village, school_type, level, total_students, total_teachers, latitude, longitude, phone, email, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3905 (class 0 OID 130729)
-- Dependencies: 259
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, key, value, type, description, updated_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3907 (class 0 OID 130736)
-- Dependencies: 261
-- Data for Name: student_assessment_eligibilities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_assessment_eligibilities (id, student_id, assessment_type, is_eligible, reason, eligible_from, eligible_until, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3909 (class 0 OID 130744)
-- Dependencies: 263
-- Data for Name: student_interventions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.student_interventions (id, student_id, intervention_program_id, start_date, end_date, status, progress_notes, outcome, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3911 (class 0 OID 130752)
-- Dependencies: 265
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.students (id, school_class_id, pilot_school_id, name, age, gender, guardian_name, guardian_phone, address, photo, baseline_assessment, midline_assessment, endline_assessment, baseline_khmer_level, baseline_math_level, midline_khmer_level, midline_math_level, endline_khmer_level, endline_math_level, is_active, is_temporary, added_by_id, added_by_mentor, assessed_by_mentor, mentor_created_at, created_at, updated_at, created_by_role, record_status, test_session_id, student_id, grade) FROM stdin;
563	\N	25	ឈួន វិឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:23:28.361	2025-11-17 07:24:08.947	teacher	production	\N	4839	4
561	\N	25	ជីម រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:20:17.478	2025-11-17 07:25:38.378	teacher	production	\N	4861	4
571	\N	25	បាន ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:38:53.7	2025-11-17 07:39:21.274	teacher	production	\N	4771	4
700	\N	22	ថេត ណាថាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:58:20.765	2025-11-18 14:42:15.025	teacher	production	\N	0004	5
665	\N	22	តឿ លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:37:09.595	2025-11-18 14:44:01.625	teacher	production	\N	០០០២	5
573	\N	25	ផៃ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:40:54.637	2025-11-17 07:41:22.692	teacher	production	\N	4843	4
583	\N	25	យឿន ហុកហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:12:31.246	2025-11-17 11:12:59.825	teacher	production	\N	4824	4
585	\N	25	រ៉ាវី ឆានីន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:14:33.586	2025-11-17 11:15:00.262	teacher	production	\N	4854	4
587	\N	25	មិន វីរៈសត្យា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:17:05.092	2025-11-17 11:17:38.344	teacher	production	\N	4848	4
604	\N	25	សាល ផល្លា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:31:29.265	2025-11-17 11:32:02.099	teacher	production	\N	4858	4
617	\N	25	សោត សុផាត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:44:36.422	2025-11-17 11:45:01.403	teacher	production	\N	4815	4
653	\N	25	ឃុន សុវណ្ណរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:13:01.74	2025-11-18 08:13:45.207	teacher	production	\N	4785	5
666	\N	25	ហន វិសាលា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:38:45.343	2025-11-18 08:39:30.695	teacher	production	\N	4794	5
668	\N	25	ពៅ ស៊ាកឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:41:58.075	2025-11-18 08:42:34.968	teacher	production	\N	4798	5
683	\N	25	សុំ ចន្ធី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:52:04.142	2025-11-18 08:52:34.495	teacher	production	\N	4756	5
908	\N	20	ធាន់ ម៉េងថៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:03:07.003	2025-11-20 08:52:34.673	teacher	production	\N	០១៦	4
797	\N	25	អឿន ហ៊ុយឡាង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:51:57.917	2025-11-18 09:52:20.907	teacher	production	\N	4812	5
800	\N	25	ខ្វៃ ចាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:53:06.192	2025-11-18 09:53:34.426	teacher	production	\N	4809	5
828	\N	13	ចាន់ណា ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:11:51.579	2025-11-18 10:12:27.823	teacher	production	\N	2027	4
913	\N	20	ភឿន ភាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:05:23.477	2025-11-19 01:37:12.656	teacher	production	\N	០២០	4
914	\N	20	មុី ចាន់ទី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:05:53.675	2025-11-19 01:37:47.018	teacher	production	\N	០២១	4
916	\N	20	រ៉ាវុធ សុបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:06:58.722	2025-11-19 01:39:07.617	teacher	production	\N	០២៣	4
774	\N	24	សយ​ អ៊ាងសៀក	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:37:06.814	2025-11-20 04:46:02.809	teacher	production	\N	2831	4
17	\N	25	លោក វិបុល	14	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-10-05 07:35:51.431	2025-11-18 10:44:59.205	teacher	production	\N	\N	\N
827	\N	22	សុះ ស្រីនិត	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:11:34.192	2025-11-18 13:48:11.393	teacher	production	\N	0057	4
820	\N	22	ស៊ាន់ កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:08:20.918	2025-11-18 13:52:42.927	teacher	production	\N	0053	4
819	\N	22	វុឌ្ឍី ឌីណា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:07:48.391	2025-11-18 13:53:45.922	teacher	production	\N	0052	4
817	\N	22	រុន វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:06:21.969	2025-11-18 13:55:52.167	teacher	production	\N	0050	4
816	\N	22	រិត រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:05:41.757	2025-11-18 13:57:08.163	teacher	production	\N	0049	4
815	\N	22	រាន់ វឌ្ឃនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:03:49.652	2025-11-18 13:59:03.351	teacher	production	\N	0048	4
727	\N	22	រស់ សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:09:27.312	2025-11-18 14:30:33.128	teacher	production	\N	0014	5
777	\N	24	ម៉ាដា សុចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:38:13.184	2025-11-20 04:47:08.259	teacher	production	\N	2726	4
778	\N	24	សៀក​ កញ្ចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:38:42.205	2025-11-20 04:47:38.894	teacher	production	\N	2844	4
779	\N	24	ឡេង​ សុខរី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:39:09.92	2025-11-20 04:48:16.042	teacher	production	\N	2845	4
780	\N	24	អូន​ ឈុនលីម	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:39:37.728	2025-11-20 04:48:48.309	teacher	production	\N	2850	4
784	\N	24	លុយ​ ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:40:44.38	2025-11-20 04:50:36.432	teacher	production	\N	2745	4
785	\N	24	ហោ​ ដុងហេ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:41:07.403	2025-11-20 04:51:06.748	teacher	production	\N	2674	4
909	\N	20	ធឿន សុជាតិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:03:35.999	2025-11-20 08:53:07.927	teacher	production	\N	០១៧	4
912	\N	20	ភីន កញ្ចានា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:05:00.933	2025-11-20 08:53:43.574	teacher	production	\N	០១៩	4
915	\N	20	យោក ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:06:20.425	2025-11-20 08:54:18.008	teacher	production	\N	០២២	4
917	\N	20	រិទ្ធិ សុខេមរិន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:07:35.103	2025-11-20 08:55:56.2	teacher	production	\N	០២៤	4
635	\N	23	រិទ្ធ សារ៉ាត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 07:04:34.885	2025-11-20 11:06:52.127	teacher	production	\N	1058	5
728	\N	23	ផល ម៉េងហ័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:09:32.666	2025-11-20 11:22:22.972	admin	production	\N	1045	5
704	\N	23	យ៉ុន ចំរើន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:58:59.721	2025-11-20 11:42:07.851	admin	production	\N	1055	5
699	\N	23	ស្រ៊ុន រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:57:38.759	2025-11-20 11:44:12.986	admin	production	\N	1053	5
685	\N	23	ឈាន ម៉េងឈា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:52:44.122	2025-11-20 11:52:55.891	admin	production	\N	1042	5
684	\N	23	ឆៃ នីឡាង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:52:08.912	2025-11-20 11:53:56.269	admin	production	\N	1041	5
622	\N	23	សេន ម៉េងគ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 02:29:46.949	2025-11-20 12:45:40.313	teacher	production	\N	1063	5
743	\N	23	ភ័ស សំណាង 	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:17:52.063	2025-11-20 12:03:56.688	teacher	production	\N	1006	4
744	\N	23	ធី កែវស៊ីង	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:18:17.351	2025-11-20 12:36:14.226	teacher	production	\N	1008	4
2151	\N	1	សង សុធីរា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:11:17.445	2025-11-21 04:05:52.042	teacher	archived	\N	1310	4
2	\N	1	sovath	13	ប្រុស	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 03:35:20.38	2025-11-21 04:06:43.528	teacher	archived	\N	\N	\N
3	\N	1	salena	12	ស្រី	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 07:56:20.912	2025-11-21 04:06:46.576	teacher	archived	\N	\N	\N
4	\N	1	ស្កាលិត	12	ស្រី	sovath a	0121122121	12121	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	f	f	76	f	f	\N	2025-10-02 08:31:39.48	2025-11-21 04:06:53.361	teacher	archived	\N	\N	\N
562	\N	25	ជី សោភ័ណ្ឌ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:22:10.569	2025-11-17 07:24:57.397	teacher	production	\N	4869	4
575	\N	25	ភួង រ៉ាយុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:43:50.003	2025-11-17 07:44:19.225	teacher	production	\N	4819	4
584	\N	25	សេង សុភី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:13:44.163	2025-11-17 11:14:09.29	teacher	production	\N	4828	4
586	\N	25	គង់ សុម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:15:34.183	2025-11-17 11:16:14.281	teacher	production	\N	4773	4
707	\N	22	ផល្លា ថារីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:00:27.793	2025-11-18 14:39:17.252	teacher	production	\N	0007	5
606	\N	25	សុខ សុភត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:32:52.597	2025-11-17 11:33:26.629	teacher	production	\N	4873	4
618	\N	25	ហួន យទី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:45:37.434	2025-11-17 11:46:00.08	teacher	production	\N	7779	4
499	\N	21	វណ្ណ: ណារិន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:41:37.105	2025-11-18 08:14:56.329	teacher	production	\N	1551	4
654	\N	25	ឆុន ខេមរា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:16:10.672	2025-11-18 08:18:41.592	teacher	production	\N	4816	5
667	\N	25	ប្រិល​ វ៉ានី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:40:25.959	2025-11-18 08:41:02.038	teacher	production	\N	4795	5
706	\N	22	ប្រុស ម៉ាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:59:43.019	2025-11-18 14:40:24.274	teacher	production	\N	0006	5
802	\N	25	អ៊ា សំរាំង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:54:18.49	2025-11-18 09:54:47.78	teacher	production	\N	4715	5
804	\N	25	ឥន្ទ សុវណ្ណរាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:55:33.449	2025-11-18 09:55:58.147	teacher	production	\N	4716	5
921	\N	20	វឿន សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:10:09.041	2025-11-19 01:10:09.041	teacher	production	\N	០២៨	4
786	\N	22	ឈន វិច្ចរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	63	f	f	\N	2025-11-18 09:44:20.037	2025-11-18 12:58:34.324	teacher	archived	\N	0001	5
851	\N	22	អន លីអ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:08:12.451	2025-11-18 13:26:18.395	teacher	production	\N	0029	5
860	\N	13	រ៉េន ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:37:32.792	2025-11-18 13:38:13.028	teacher	production	\N	2042	4
861	\N	13	រ៉េន ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:38:47.33	2025-11-18 13:39:39.07	teacher	production	\N	2043	4
829	\N	22	ស្រ៊ីម ម៉ាណាវ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:12:16.188	2025-11-18 13:47:12.561	teacher	production	\N	0058	4
826	\N	22	សុខហ៊ាង វ៉េងថៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:10:48.728	2025-11-18 13:49:22.471	teacher	production	\N	0056	4
818	\N	22	វណ្ណី ស្រីលក្ខ័	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:07:10.681	2025-11-18 13:54:50.005	teacher	production	\N	0051	4
807	\N	22	តឿ ដារីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:56:59.107	2025-11-18 14:08:12.952	teacher	production	\N	0040	4
803	\N	22	ដា នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:54:33.839	2025-11-18 14:11:48.28	teacher	production	\N	0037	4
801	\N	22	ឈុន ស៊ាវហ៊ើ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:53:56.298	2025-11-18 14:12:49.482	teacher	production	\N	0036	4
725	\N	22	រស្មី ឈុនហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:08:50.006	2025-11-18 14:31:56.529	teacher	production	\N	0013	5
920	\N	20	វ៉ាន់ដា ហេងលី	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:09:25.143	2025-11-19 01:41:00.498	teacher	production	\N	០២៧	4
922	\N	20	សល់ សៀកលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:10:41.002	2025-11-19 01:41:30.13	teacher	production	\N	០២៩	4
871	\N	18	គា គីមម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:44:07.602	2025-11-20 03:30:29.758	teacher	production	\N	136	4
870	\N	13	ហ៊ួន ចាន់ដេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:50:32.383	2025-11-20 01:34:58.472	teacher	production	\N	2053	4
878	\N	18	ឌី គឹមហ៊ុយ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:47:49.738	2025-11-20 08:14:02.561	teacher	production	\N	143	4
877	\N	18	ចាន់ ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:47:11.892	2025-11-20 08:14:40.295	teacher	production	\N	142	4
876	\N	18	ចិត្រា ហ្សាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:46:50.672	2025-11-20 08:15:27.427	teacher	production	\N	141	4
875	\N	18	គីម ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:46:16.749	2025-11-20 08:16:01.398	teacher	production	\N	140	4
874	\N	18	ងី គីមយូ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:45:50.586	2025-11-20 08:16:32.273	teacher	production	\N	139	4
873	\N	18	គូ វិចជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:45:25.574	2025-11-20 08:17:12.049	teacher	production	\N	138	4
872	\N	18	គ័ង វឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:44:40.344	2025-11-20 08:17:41.95	teacher	production	\N	137	4
919	\N	20	រិទ្ធីវឌ្ឍ័ន បញ្ញាសិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:08:49.378	2025-11-20 08:56:59.87	teacher	production	\N	០២៦	4
726	\N	23	សីហា លីឡា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:08:58.286	2025-11-20 11:26:46.11	admin	production	\N	1065	5
688	\N	23	ភោគ វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:53:42.929	2025-11-20 11:51:07.652	admin	production	\N	1046	5
753	\N	23	ថន អេងស៊ីង 	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:22:17.443	2025-11-20 11:52:48.941	teacher	production	\N	1024	4
752	\N	23	ផៃ ប៊ុនរ៉ុង 	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:21:53.738	2025-11-20 11:56:27.234	teacher	production	\N	1023	4
751	\N	23	ឈាវ ចាន់រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:21:32.127	2025-11-20 11:57:23.463	teacher	production	\N	1021	4
750	\N	23	តេង លីមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:21:02.584	2025-11-20 11:58:27.346	teacher	production	\N	1019	4
749	\N	23	វ៉ាត ស្រីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:20:38.229	2025-11-20 11:59:21.618	teacher	production	\N	1018	4
747	\N	23	ចំរើន ម៉ូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:19:34.092	2025-11-20 12:00:38.324	teacher	production	\N	1015	4
748	\N	23	តុង ស័រលីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:20:16.51	2025-11-20 12:01:04.247	teacher	production	\N	1017	4
746	\N	23	គ្រុយ ឈាងតុង 	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:19:05.304	2025-11-20 12:02:09.488	teacher	production	\N	1014	4
745	\N	23	ធា រក្សា 	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:18:39.071	2025-11-20 12:02:16.74	teacher	production	\N	1013	4
640	\N	23	ខន សុខឡាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:13:54.135	2025-11-20 12:26:52.241	teacher	production	\N	1011	4
641	\N	23	កុសល់ ធារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:14:23.04	2025-11-20 12:27:38.11	teacher	production	\N	1012	4
638	\N	23	បឿន រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:12:45.96	2025-11-20 12:29:48.325	teacher	production	\N	1033	4
639	\N	23	ឃឿន ម៉េងឃាង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:13:22.411	2025-11-20 12:29:06.303	teacher	production	\N	1007	4
636	\N	23	ហឿន សុលីនដា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:11:28.073	2025-11-20 12:32:18.909	teacher	production	\N	1009	4
564	\N	25	ញឹម គីមលី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:29:22.92	2025-11-17 07:29:51.221	teacher	production	\N	4842	4
532	\N	19	 ចំរើន រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:40:28.507	2025-11-17 09:06:52.872	teacher	production	\N	2000	5
588	\N	25	លីមហ៊ាង គីមស៊ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:18:22.558	2025-11-17 11:18:22.558	teacher	production	\N	4820	4
607	\N	25	ស៊ីម កញ្ញនា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:34:05.624	2025-11-17 11:34:33.119	teacher	production	\N	4853	4
609	\N	25	សឿន សុវណ្ណរាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:36:24.322	2025-11-17 11:38:17.385	teacher	production	\N	4852	4
619	\N	25	សំអាត សុវត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:46:32.191	2025-11-17 11:46:55.972	teacher	production	\N	4758	4
669	\N	25	ពៅ សាកលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:43:12.35	2025-11-18 08:43:48.007	teacher	production	\N	4799	5
713	\N	22	ភីន សុផាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:02:14.861	2025-11-18 14:36:58.272	teacher	production	\N	0009	5
716	\N	22	ម៉េង សុខកាន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:03:04.598	2025-11-18 14:45:42.5	teacher	production	\N	0010	5
712	\N	22	ពៅ បញ្ញាម៉ាឡាប៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:01:16.736	2025-11-18 14:46:20.84	teacher	production	\N	0008	5
715	\N	25	រិន ស្រីនាត	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:02:44.977	2025-11-18 09:04:32.198	teacher	production	\N	4800	5
718	\N	25	ម៉េង សុខលីម	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:05:34.693	2025-11-18 09:06:07.681	teacher	production	\N	4649	5
924	\N	20	សារ៉ាន ស្រីមុំ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:11:41.468	2025-11-19 01:11:41.468	teacher	production	\N	០៣១	4
655	\N	25	ជា សត្យា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:19:23.649	2025-11-18 09:57:48.964	teacher	production	\N	4786	5
834	\N	13	ណូយ សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:14:15.173	2025-11-20 01:42:29.966	teacher	production	\N	2029	4
925	\N	20	សឹម អុីជឺ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:12:09.002	2025-11-19 01:42:49.185	teacher	production	\N	០៣២	4
926	\N	20	សុខា តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:12:34.898	2025-11-19 01:43:18.651	teacher	production	\N	០៣៣	4
863	\N	13	លុន សារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:41:55.616	2025-11-19 03:11:42.466	teacher	production	\N	20245	4
864	\N	13	លួម ប៊ុនល័ក្ខ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:42:38.935	2025-11-20 01:37:20.927	teacher	production	\N	2046	4
432	\N	19	និម ប៊ុនឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-01 07:42:20.113	2025-11-18 10:44:59.205	teacher	production	\N	កែម លីហ្សា	4
862	\N	13	រឿម ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:40:21.323	2025-11-20 01:38:16.834	teacher	production	\N	2044	4
413	\N	2	ចាន់ សុភាព	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	f	f	54	f	f	\N	2025-11-01 07:36:45.672	2025-11-20 03:29:20.975	teacher	archived	\N	10001	4
885	\N	18	នឿន សុខគីម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:52:08.667	2025-11-20 08:09:19.504	teacher	production	\N	150	4
884	\N	18	រ៉ាវី លីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:50:52.741	2025-11-20 08:10:06.932	teacher	production	\N	149	4
434	\N	22	ហងយក	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	77	f	f	\N	2025-11-01 08:01:06.314	2025-11-18 12:55:27.799	teacher	archived	\N	55578	4
435	\N	22	ធី ថាឈីក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	77	f	f	\N	2025-11-01 08:02:55.445	2025-11-18 12:57:11.997	teacher	archived	\N	០០០០១	4
787	\N	22	តឿ លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	63	f	f	\N	2025-11-18 09:45:00.715	2025-11-18 12:58:42.686	teacher	archived	\N	0002	5
436	\N	21	លីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	115	f	f	\N	2025-11-08 09:36:49.408	2025-11-18 13:12:34.364	teacher	archived	\N	112233	4
852	\N	13	ធឿន មីនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:25:35.954	2025-11-18 13:27:00.312	teacher	production	\N	2035	5
883	\N	18	ធឿន ស្រីពៅ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:50:18.721	2025-11-20 08:10:48.573	teacher	production	\N	148	4
882	\N	18	ថា សុវណ្ណចិន្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:49:44.422	2025-11-20 08:11:20.735	teacher	production	\N	147	4
865	\N	13	វេត មុន្នីកក្តិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:44:03.667	2025-11-18 13:44:03.667	teacher	production	\N	2047	4
833	\N	22	អេង ហ៊ុយសៀកម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:13:50.373	2025-11-18 13:45:02.181	teacher	production	\N	0060	4
866	\N	13	ស៊ុយ លីឡា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:44:36.851	2025-11-18 13:45:13.813	teacher	production	\N	2048	4
806	\N	22	ណាន់ ម៉េងណាវ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:56:22.926	2025-11-18 14:09:21.559	teacher	production	\N	0039	4
805	\N	22	ណា អ៉ីវ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:55:35.778	2025-11-18 14:10:35.372	teacher	production	\N	0038	4
795	\N	22	ខេង ម៉េងរ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:51:10.988	2025-11-18 14:17:07.073	teacher	production	\N	0032	4
732	\N	22	រិន ស៉ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:10:57.228	2025-11-18 14:23:33.983	teacher	production	\N	0016	5
722	\N	22	មីធារាន រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:08:05.349	2025-11-18 14:33:00.407	teacher	production	\N	0012	5
881	\N	18	ឌីណា មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:49:17.247	2025-11-20 08:11:53.77	teacher	production	\N	146	4
880	\N	18	ញ៉ិល សុជាតិ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:48:51.69	2025-11-20 08:12:30.96	teacher	production	\N	145	4
923	\N	20	សារ៉ាត មួយហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:11:07.31	2025-11-20 09:00:42.585	teacher	production	\N	០៣០	4
945	\N	20	អឹម បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:20:09.178	2025-11-20 09:12:32.208	teacher	production	\N	០៤៦	4
947	\N	20	ហេង សុខជូ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:20:32.534	2025-11-20 09:13:47.558	teacher	production	\N	០៤៧	4
729	\N	23	មឿន ឈាងម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:10:06.697	2025-11-20 11:17:47.325	admin	production	\N	1047	5
708	\N	23	ពៅ ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:00:36.2	2025-11-20 11:40:02.839	admin	production	\N	1057	5
757	\N	23	ភាង មួយលីន 	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:24:12.486	2025-11-20 11:45:47.497	teacher	production	\N	1036	4
756	\N	23	ម៉ាញ ពិសី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:23:40.05	2025-11-20 11:47:04.589	teacher	production	\N	1029	4
755	\N	23	ឡាយ លក្ខិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:23:16.65	2025-11-20 11:48:19.813	teacher	production	\N	1028	4
754	\N	23	អៀង ហេងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:22:48.446	2025-11-20 11:51:58.672	teacher	production	\N	1027	4
670	\N	23	ស្រ៊ុន មុន្នីរត្ន័	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	2	f	f	\N	2025-11-18 08:43:53.67	2025-11-20 12:14:51.57	admin	archived	\N	1001	4
644	\N	23	ឈឿន ម៉េងស៉ិន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:18:53.037	2025-11-20 12:23:37.567	teacher	production	\N	1032	4
643	\N	23	ឃា ប៊ុនថា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:17:07.158	2025-11-20 12:24:50.326	teacher	production	\N	1031	4
642	\N	23	ធាន់ ដារាជ្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:15:39.687	2025-11-20 12:24:55.832	teacher	production	\N	1030	4
565	\N	25	ដុប រ៉ាមី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:30:27.386	2025-11-17 07:30:50.738	teacher	production	\N	4829	4
541	\N	19	មឿន សុធីរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:53:55.123	2025-11-17 09:14:35.415	teacher	production	\N	២០០៩	5
589	\N	25	វ៉ុន វឌ្ឍនា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:19:28.552	2025-11-17 11:19:55.296	teacher	production	\N	4837	4
608	\N	25	សំ ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:35:09.837	2025-11-17 11:35:42.02	teacher	production	\N	4776	4
623	\N	24	គីមស៊ាត់ ឆព័ណ្ណរ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:46:16.642	2025-11-18 04:47:36.623	teacher	production	\N	2830	4
656	\N	25	ឈៀង ដាវីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:20:12.015	2025-11-18 08:20:46.93	teacher	production	\N	4788	5
673	\N	22	តេង ម៉េងគ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:44:54.421	2025-11-18 14:43:09.977	teacher	production	\N	0003	5
671	\N	25	ម៉េង រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:44:21.795	2025-11-18 08:44:52.257	teacher	production	\N	4796	5
674	\N	25	ម៉េន ស្រីយ៉ាវ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:45:30.543	2025-11-18 08:45:58.637	teacher	production	\N	4797	5
2113	\N	7	រស់ សុខចំរើន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:59:08.937	2025-11-20 12:59:31.943	teacher	production	\N	5889	4
710	\N	25	ហេង សុខហ៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:01:00.251	2025-11-18 09:01:40.042	teacher	production	\N	4808	5
822	\N	13	កុល សុភ័ណ្ឌវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:08:51.745	2025-11-18 10:11:06.978	teacher	production	\N	2025	4
930	\N	20	សៅ សុខឃៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:14:21.8	2025-11-19 01:14:21.8	teacher	production	\N	០៣៧	4
441	\N	21	សុវណ្ណនី ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:40:45.946	2025-11-18 13:09:29.223	teacher	production	\N	1511	5
624	\N	24	គ្រុយ​ សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:48:30.34	2025-11-20 04:31:56.411	teacher	production	\N	2856	4
835	\N	22	ហាក់ រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:15:01.938	2025-11-18 13:43:46.584	teacher	production	\N	0061	4
853	\N	13	បូរី អុីនណុផា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:28:12.451	2025-11-20 01:41:04.22	teacher	production	\N	2036	4
808	\N	22	ថា ចាន់ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:57:42.361	2025-11-18 14:07:07.194	teacher	production	\N	0041	4
731	\N	22	រិទ្ធិ សូនីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:10:22.036	2025-11-18 14:29:28.206	teacher	production	\N	0015	5
948	\N	20	ភឿន លីឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:20:57.541	2025-11-19 01:29:35.982	teacher	production	\N	០៤៨	4
896	\N	20	ចែម លក្ខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:57:12.437	2025-11-19 01:30:57.528	teacher	production	\N	005	4
901	\N	20	ដាំ លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:59:37.139	2025-11-19 01:32:25.426	teacher	production	\N	០០៩	4
906	\N	20	ធា ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:02:14.454	2025-11-19 01:33:35.572	teacher	production	\N	០១៤	4
910	\N	20	ផាន់ណា រ៉ូហ្សិត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:04:33.438	2025-11-19 01:36:21.984	teacher	production	\N	០១៨	4
933	\N	20	ហ៑ត់ គីមលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:16:54.269	2025-11-19 01:44:23.368	teacher	production	\N	០៤០	4
953	\N	20	រ៉ុន ផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:22:43.336	2025-11-19 01:45:49.218	teacher	production	\N	០៥០	4
867	\N	13	សឿន កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:45:44.97	2025-11-20 01:36:25.084	teacher	production	\N	2049	4
625	\N	24	គ័ង ប៊ែយូឡាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:49:20.679	2025-11-20 04:32:36.696	teacher	production	\N	2828	4
626	\N	24	ចន្ថា ចាន់ណារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:49:57.762	2025-11-20 04:33:16.461	teacher	production	\N	2834	4
627	\N	24	ចាន់ណាសាក់ អាវីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:50:33.076	2025-11-20 04:33:50.505	teacher	production	\N	2778	4
758	\N	24	ធិន ជីងហ្វុង	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:28:23.269	2025-11-20 04:37:10.962	teacher	production	\N	2864	4
961	\N	18	ភី ភារៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:36:08.453	2025-11-20 07:53:08.619	teacher	production	\N	232	5
960	\N	18	ភី ភារុណ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:35:35.88	2025-11-20 07:53:53.868	teacher	production	\N	231	5
959	\N	18	ភាព សៀងបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:35:15.366	2025-11-20 07:54:41.324	teacher	production	\N	230	5
958	\N	18	ពុយ សុខហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:34:49.003	2025-11-20 07:55:32.856	teacher	production	\N	229	5
957	\N	18	ពុយ គីមហ៊ុយ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:34:29.228	2025-11-20 07:56:16.65	teacher	production	\N	228	5
956	\N	18	ប៊ុន មួយឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:33:56.556	2025-11-20 07:57:08.985	teacher	production	\N	226	5
955	\N	18	ប៉ូច ដាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:31:30.509	2025-11-20 07:58:01.205	teacher	production	\N	225	5
954	\N	18	ធី សៀវហ្វុង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:30:54.253	2025-11-20 07:58:45.973	teacher	production	\N	224	5
952	\N	18	ស៊ីវ សៀវឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:22:24.73	2025-11-20 07:59:36.247	teacher	production	\N	222	5
951	\N	18	ថន សុខមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:21:52.915	2025-11-20 08:00:16.934	teacher	production	\N	221	5
949	\N	18	ដារ៉ា សុវណ្ណមករា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:21:25.976	2025-11-20 08:00:54.817	teacher	production	\N	220	5
886	\N	18	ប៊ុនថន វិមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:52:46.645	2025-11-20 08:08:36.452	teacher	production	\N	151	4
928	\N	20	សុភក្រ្ក សុជាតិ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:13:31.49	2025-11-20 09:02:42.986	teacher	production	\N	០៣៥	4
929	\N	20	សួនកែវ សុភក្រ្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:13:56.937	2025-11-20 09:03:26.932	teacher	production	\N	០៣៦	4
931	\N	20	ស្រៀង លីឆេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:14:57.708	2025-11-20 09:03:54.849	teacher	production	\N	០៣៨	4
934	\N	20	ហួត ថារ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:17:34.493	2025-11-20 09:05:26.514	teacher	production	\N	០៤១	4
950	\N	20	ឌុជ មីនស៑ូ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:21:42.006	2025-11-20 09:15:13.812	teacher	production	\N	០៤៩	4
711	\N	23	រស់ ភក្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:01:11.15	2025-11-20 11:39:07.732	admin	production	\N	1059	5
690	\N	23	ម៉ាង គឹមនី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:54:19.631	2025-11-20 11:50:10.323	admin	production	\N	1048	5
646	\N	23	ហៀ វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:20:11.383	2025-11-20 12:22:24.167	teacher	production	\N	1010	4
645	\N	23	កុសល់ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:19:27.149	2025-11-20 12:23:01.512	teacher	production	\N	1034	4
717	\N	23	រ៉ាត់ ហ្គេកល័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:05:15.844	2025-11-20 12:40:15.671	admin	production	\N	1060	5
405	\N	25	ឃ្លី រ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:30:50.301	2025-11-17 07:13:32.166	teacher	production	\N	4818	4
566	\N	25	ឌាន់ សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:31:23.068	2025-11-17 07:31:56.618	teacher	production	\N	4859	4
567	\N	25	ណាន សុខណាត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:32:42.131	2025-11-17 07:33:41.096	teacher	production	\N	4772	4
576	\N	25	មិត្ត គីមហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:02:32.525	2025-11-17 11:02:59.301	teacher	production	\N	4836	4
578	\N	25	មឿន សុខមាន	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:04:40.101	2025-11-17 11:05:04.118	teacher	production	\N	4846	4
593	\N	25	វួន ចន្ទដេវិដ 	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:23:05.672	2025-11-17 11:23:42.007	teacher	production	\N	4851	4
611	\N	25	ហ៊ាង ឆេងហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:39:02.79	2025-11-17 11:39:32.517	teacher	production	\N	4874	4
521	\N	2	ពេទ្យ សុខសំ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:56:36.679	2025-11-17 15:17:10.923	teacher	production	\N	១០០៧	4
599	\N	25	ស៊ង មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:27:41.772	2025-11-17 11:28:34.089	teacher	production	\N	4870	4
648	\N	23	ឡូត លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:21:48.242	2025-11-20 12:20:45.528	teacher	production	\N	1026	4
657	\N	25	ឈីន ប៊ុនណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:23:35.626	2025-11-18 08:25:13.689	teacher	production	\N	4787	5
658	\N	25	ឈួង សុដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:27:49.718	2025-11-18 08:28:25.903	teacher	production	\N	4790	5
792	\N	25	អឿន សេងហួ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:49:51.308	2025-11-18 09:51:04.081	teacher	production	\N	4813	5
720	\N	22	ម៉េងស្រ៊ាន សិរីរត្ន័	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:07:20.269	2025-11-18 14:33:54.763	teacher	production	\N	0011	5
692	\N	25	ស៊្រុយ ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:54:23.451	2025-11-18 08:54:52.168	teacher	production	\N	4781	5
719	\N	25	អឿន ផូឌីន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 09:07:10.659	2025-11-18 09:17:27.944	teacher	production	\N	4814	5
831	\N	13	ណាត វណ្ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:12:54.207	2025-11-18 10:13:43.347	teacher	production	\N	2028	4
890	\N	20	ង៉ែត សក្ខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:55:21.865	2025-11-19 00:55:21.865	teacher	production	\N	#002	4
854	\N	13	ផៃ សុផាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:29:25.937	2025-11-18 13:30:19.579	teacher	production	\N	2037	4
856	\N	13	ពន្លឺ ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:31:05.571	2025-11-18 13:31:45.911	teacher	production	\N	2038	4
842	\N	22	វុទ្ធី គីមស្រ៊ន់	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:00:17.318	2025-11-18 13:40:52.157	teacher	production	\N	0020	5
836	\N	22	ហេង ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:15:47.046	2025-11-18 13:42:31.473	teacher	production	\N	0062	4
868	\N	13	ហូល ចរិយា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:47:06.061	2025-11-18 13:47:44.379	teacher	production	\N	2050	4
823	\N	22	សារ៉ាត់ សុខមាន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:09:20.029	2025-11-18 13:51:33.839	teacher	production	\N	0054	4
809	\N	22	ធី សុខឃីន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:58:27.065	2025-11-18 14:05:55.13	teacher	production	\N	0042	4
734	\N	22	លីហ៊ាង សុវិច្ឆិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:12:25.138	2025-11-18 14:21:29.182	teacher	production	\N	0018	5
733	\N	22	លាង គីមហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:11:42.061	2025-11-18 14:22:27.824	teacher	production	\N	0017	5
1397	\N	16	ថាន រ៉ាឆាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	113	f	f	\N	2025-11-20 07:29:50.748	2025-11-20 07:30:13.168	teacher	archived	\N	590	4
2146	\N	7	វ៉ាត់ ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:09:17.398	2025-11-20 13:09:49.045	teacher	production	\N	6304	4
940	\N	18	ជិន ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:19:15.286	2025-11-20 08:03:06.588	teacher	production	\N	217	5
939	\N	20	ឡាញ់ វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:19:03.09	2025-11-19 01:44:51.969	teacher	production	\N	០៤៤	4
941	\N	20	អុី រ៉ូហ្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:19:29.541	2025-11-19 01:45:11.33	teacher	production	\N	០៤៥	4
628	\N	24	ឆាំ សុយិតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:51:04.416	2025-11-20 04:34:24.92	teacher	production	\N	2791	4
629	\N	24	ញាន​ សុខវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:51:31.64	2025-11-20 04:35:01.01	teacher	production	\N	2799	4
630	\N	24	ណូ វិរ:	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:52:00.863	2025-11-20 04:35:36.67	teacher	production	\N	2833	4
759	\N	24	ផល​ ​សុផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:28:51.752	2025-11-20 04:37:53.196	teacher	production	\N	2802	4
832	\N	11	ថេត សឿ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-18 10:13:34.764	2025-11-20 05:35:58.426	teacher	production	\N	2356	4
938	\N	18	ចិត្រា ឧស្សាហ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:18:55.324	2025-11-20 08:03:50.111	teacher	production	\N	216	5
936	\N	18	គឿន ម៉េងគ័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:18:28.381	2025-11-20 08:04:28.91	teacher	production	\N	215	5
895	\N	18	លីណា សុវណ្ណដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:56:47.204	2025-11-20 08:05:42.391	teacher	production	\N	156	4
893	\N	18	វិចិត្រ ឆាយស៊ីង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:55:59.567	2025-11-20 08:06:17.162	teacher	production	\N	155	4
891	\N	18	រិទ្ធី សូលីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:55:35.364	2025-11-20 08:06:49.366	teacher	production	\N	154	4
889	\N	18	មួន សុខមាន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:55:01.668	2025-11-20 08:07:25.245	teacher	production	\N	153	4
888	\N	18	ប៊ុនធឿន ធីនុន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:54:30.838	2025-11-20 08:08:02.171	teacher	production	\N	152	4
887	\N	20	គាង គីមឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:53:45.33	2025-11-20 08:26:38.374	teacher	production	\N	#001	4
894	\N	20	ចាន់ថា ថាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:56:44.918	2025-11-20 08:37:33.652	teacher	production	\N	004	4
898	\N	20	ឆន ប៑ុនធៀន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:58:12.141	2025-11-20 08:38:12.643	teacher	production	\N	006	4
935	\N	20	ឡាង សៀវមុី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:18:10.39	2025-11-20 09:05:51.248	teacher	production	\N	០៤២	4
937	\N	20	ផូ វួយឈិន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:18:40.746	2025-11-20 09:06:56.975	teacher	production	\N	០៤៣	4
651	\N	23	ស៊ាន់ គឹមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:23:48.776	2025-11-20 12:16:39.451	teacher	production	\N	1025	4
650	\N	23	រ៉ាវុទ្ធ លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:22:53.384	2025-11-20 12:18:27.397	teacher	production	\N	1016	4
649	\N	23	ខន សុខរក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:22:13.736	2025-11-20 12:20:50.821	teacher	production	\N	1035	4
647	\N	23	ស៊ាន់ គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:21:23.376	2025-11-20 12:21:29.178	teacher	production	\N	1022	4
419	\N	26	ថា សុធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	62	f	f	\N	2025-11-01 07:39:20.986	2025-11-19 09:15:05.622	teacher	archived	\N	11222	4
612	\N	25	ហន សុភត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:40:03.142	2025-11-17 11:40:35.87	teacher	production	\N	4760	4
409	\N	25	ខា ចន្ទទ្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:35:40.541	2025-11-17 07:03:42.746	teacher	production	\N	4877	4
400	\N	25	ចិន្ដា វ៉ាន់ហាវ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 07:25:41.6	2025-11-17 07:15:27.142	teacher	production	\N	4860	4
393	\N	25	ចិត្រ រ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-10-31 03:27:36.68	2025-11-17 07:27:30.172	teacher	production	\N	4777	4
568	\N	25	ណេង វ៉ាធីម	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:35:05.229	2025-11-17 07:35:35.107	teacher	production	\N	4847	4
577	\N	25	ម៉ុង ស្រីណុច	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:03:39.344	2025-11-17 11:04:08.435	teacher	production	\N	4825	4
579	\N	25	ម៉េង សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:05:40.851	2025-11-17 11:06:27.97	teacher	production	\N	4850	4
594	\N	25	វ៉ុន រ៉ាវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:24:30.867	2025-11-17 11:25:11.879	teacher	production	\N	4821	4
613	\N	25	អ៊ែល សុភារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:41:09.107	2025-11-17 11:41:41.527	teacher	production	\N	4620	4
615	\N	25	ម៉ុន ស្រីតី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:42:31.479	2025-11-17 11:42:55.644	teacher	production	\N	4875	4
2116	\N	7	ពី ចាន់សេរី	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:59:56.144	2025-11-20 13:00:22.309	teacher	production	\N	5997	4
509	\N	21	ហ៊ាង សេងហាន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:50:52.18	2025-11-18 07:59:17.924	teacher	production	\N	1514	4
659	\N	25	ដឹម គឹមស៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:30:18.95	2025-11-18 08:30:50.694	teacher	production	\N	4789	5
660	\N	25	ឌីណា ដាវ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:31:39.162	2025-11-18 08:32:18.067	teacher	production	\N	4792	5
677	\N	25	ភឿន រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:49:30.78	2025-11-18 08:49:57.282	teacher	production	\N	4713	5
837	\N	13	ថាំង សាវ័ន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:16:07.948	2025-11-18 10:17:49.287	teacher	production	\N	2030	4
824	\N	13	ខឿន រ៉ូស្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:09:38.132	2025-11-19 03:12:55.903	teacher	production	\N	2026	4
422	\N	20	ហៅ ដានីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-01 07:39:50.384	2025-11-19 03:47:30.073	teacher	production	\N	#2222	5
899	\N	20	ជាង ស្រីភា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:58:41.921	2025-11-20 08:38:53.578	teacher	production	\N	០០៧	4
761	\N	24	ពឹម មេសា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:30:15.588	2025-11-20 04:38:59.579	teacher	production	\N	2761	4
408	\N	26	សែន ផាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	82	f	f	\N	2025-11-01 07:34:54.437	2025-11-19 09:15:00.197	teacher	archived	\N	12345	5
900	\N	20	ឈន ឆៃណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:59:13.236	2025-11-20 08:39:21.228	teacher	production	\N	០០៨	4
902	\N	20	ថារី ហេងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:00:11.901	2025-11-20 08:40:30.979	teacher	production	\N	០០១០	4
869	\N	13	ហួត ចន្ធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:48:33.655	2025-11-20 01:35:42.593	teacher	production	\N	2051	4
403	\N	24	ប៉ូ សុខខេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	85	f	f	\N	2025-11-01 07:28:11.457	2025-11-20 04:31:02.801	teacher	archived	\N	32109	4
404	\N	24	នូ ធីពេញ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	85	f	f	\N	2025-11-01 07:29:03.653	2025-11-20 04:31:07.369	teacher	archived	\N	 20222	4
631	\N	24	ទឹម​ឆេងហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 04:52:30.308	2025-11-20 04:36:10.783	teacher	production	\N	2707	4
762	\N	24	ភឿន​ សៀកស៊ីញ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:30:53.258	2025-11-20 04:39:41.226	teacher	production	\N	2852	4
398	\N	25	វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-01 06:48:50.438	2025-11-18 10:44:59.205	teacher	production	\N	11111	4
399	\N	25	លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	paragraph	\N	comprehension1	\N	t	f	69	f	f	\N	2025-11-01 06:49:29.097	2025-11-18 10:44:59.205	teacher	production	\N	11112	4
903	\N	20	ថឹម សុខលីសាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:00:49.769	2025-11-20 08:43:23.879	teacher	production	\N	០១១	4
904	\N	20	ថុង វ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:01:21.138	2025-11-20 08:44:21.955	teacher	production	\N	០១២	4
763	\N	24	ម៉ុន អេងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:31:24.049	2025-11-20 04:40:21.897	teacher	production	\N	2826	4
764	\N	24	អឿ​ន​ ​ចន្រ្ទា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:31:58.867	2025-11-20 04:41:25.437	teacher	production	\N	2891	4
406	\N	21	កហថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	66	f	f	\N	2025-11-01 07:31:02.588	2025-11-18 13:12:43.693	teacher	archived	\N	97646	4
407	\N	21	កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	story	\N	comprehension2	\N	f	f	66	f	f	\N	2025-11-01 07:31:39.149	2025-11-18 13:12:51.983	teacher	archived	\N	44738	4
849	\N	22	ហាក់ ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:06:55.064	2025-11-18 13:31:36.937	teacher	production	\N	0027	5
848	\N	22	ហាក់ លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:06:14.223	2025-11-18 13:33:25.831	teacher	production	\N	0026	5
857	\N	13	ពាក ពេជ្រមីនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:32:37.253	2025-11-18 13:33:32.45	teacher	production	\N	2039	4
847	\N	22	ហាក់ នីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:05:35.364	2025-11-18 13:34:49.094	teacher	production	\N	0025	5
846	\N	22	ហ៊ាន់ សុខមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:04:59.531	2025-11-18 13:36:02.252	teacher	production	\N	0024	5
845	\N	22	ហ៊ាង សៀងហៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:04:18.866	2025-11-18 13:37:14.702	teacher	production	\N	0023	5
844	\N	22	សារ៉ូ ហ្សាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:03:03.072	2025-11-18 13:38:25.412	teacher	production	\N	0022	5
843	\N	22	សារ៉ាយ វ៉ារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:02:10.078	2025-11-18 13:39:39.958	teacher	production	\N	0021	5
830	\N	22	ហ៊ីម មុនីវង្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:12:53.923	2025-11-18 13:46:07.579	teacher	production	\N	0059	4
765	\N	24	យឿ​ន​ ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:32:57.077	2025-11-20 04:42:05.771	teacher	production	\N	2843	4
810	\N	22	ធឿន ផាន់និច	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:59:13.096	2025-11-18 14:04:39.525	teacher	production	\N	0043	4
793	\N	22	ខាន់ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:49:53.335	2025-11-18 14:19:05.467	teacher	production	\N	0030	4
735	\N	22	វ៉ាង ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:13:05.884	2025-11-18 14:20:28.161	teacher	production	\N	0019	4
620	\N	23	ថាត​ វត្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 02:23:01.134	2025-11-20 10:59:10.285	teacher	production	\N	1043	5
676	\N	23	កែវ ហ្សានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:48:56.358	2025-11-20 11:16:34.622	admin	production	\N	1037	5
721	\N	23	សាន ឈុនយ៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:07:22.951	2025-11-20 11:29:00.007	admin	production	\N	1062	5
693	\N	23	ម៉ី ស្រីកែវ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:55:13.934	2025-11-20 11:49:05.49	admin	production	\N	1049	5
681	\N	23	គង់ គឹមឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:50:47.124	2025-11-20 12:41:42.336	admin	production	\N	1039	5
2060	\N	16	អ៊ូក ផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:27:36.982	2025-11-20 13:00:44.125	teacher	production	\N	591	5
569	\N	25	ទីញ ស្រីលក្ខ	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:36:16.031	2025-11-17 07:36:52.525	teacher	production	\N	4783	4
905	\N	20	ធា ចាន់ថុល	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:01:48.64	2025-11-20 08:46:16.024	teacher	production	\N	០១៣	4
632	\N	23	ធី ពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 07:01:13.487	2025-11-20 11:03:20.931	teacher	production	\N	1044	5
428	\N	26	វី សាវ៉ាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	62	f	f	\N	2025-11-01 07:41:05.002	2025-11-19 09:15:21.891	teacher	archived	\N	22211	4
580	\N	25	ធីរ៉ា សុវណ្ណរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:07:42.195	2025-11-17 11:08:49.233	teacher	production	\N	4780	4
431	\N	26	ពៅ ថារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	82	f	f	\N	2025-11-01 07:42:01.221	2025-11-19 09:15:28.636	teacher	archived	\N	23456	5
470	\N	21	គាន់ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:24:21.733	2025-11-18 12:32:56.2	teacher	production	\N	1477	5
469	\N	21	ចិន្ធូ គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:23:47.289	2025-11-18 12:34:22.03	teacher	production	\N	1479	5
468	\N	21	ឆុង ឆេងហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:23:06.377	2025-11-18 12:35:38.114	teacher	production	\N	1481	5
467	\N	21	ជាតិ ពន្លក	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:22:13.959	2025-11-18 12:37:07.593	teacher	production	\N	1414	5
466	\N	21	ជ័យ ភក្ដី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:21:33.956	2025-11-18 12:38:30.634	teacher	production	\N	1485	5
465	\N	21	ណាន ម៉េងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:20:16.194	2025-11-18 12:39:43.358	teacher	production	\N	1487	5
464	\N	21	ថាន់ ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:18:53.421	2025-11-18 12:41:26.931	teacher	production	\N	1489	5
463	\N	21	ថាំង ស្រីមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:16:33.333	2025-11-18 12:43:57.188	teacher	production	\N	1417	5
462	\N	21	ទិន មុន្នីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:15:44.173	2025-11-18 12:46:17.992	teacher	production	\N	1491	5
461	\N	21	ធិ ទីណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:14:59.804	2025-11-18 12:47:53.599	teacher	production	\N	1456	5
460	\N	21	ធឿន ស្រីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:14:09.682	2025-11-18 12:49:46.473	teacher	production	\N	1458	5
459	\N	21	នឿន គឹមសួ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:13:11.384	2025-11-18 12:51:24.778	teacher	production	\N	1494	5
458	\N	21	ប៊ុនហ៊ាង ឈុនអេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:09:26.546	2025-11-18 12:52:42.543	teacher	production	\N	1432	5
457	\N	21	បូរ៉ា ចិនឡេង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 03:08:17.38	2025-11-18 12:53:42.217	teacher	production	\N	1495	5
456	\N	21	ផល សុផា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:58:24.563	2025-11-18 12:54:41.506	teacher	production	\N	1427	5
455	\N	21	ពិសិដ្ឋ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:54:47.491	2025-11-18 12:55:52.536	teacher	production	\N	1497	5
454	\N	21	ភាព សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:53:02.632	2025-11-18 12:57:42.127	teacher	production	\N	1498	5
453	\N	21	ភារម្យ ជីងជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:52:12.592	2025-11-18 12:59:00.723	teacher	production	\N	1499	5
452	\N	21	ម៉ី សុខម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:51:18.775	2025-11-18 13:00:00.013	teacher	production	\N	1503	5
451	\N	21	ម៉ឺន ពន្លឺ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:50:11.321	2025-11-18 13:01:10.512	teacher	production	\N	1501	5
450	\N	21	ម៉ុន ស្រីពី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:49:02.724	2025-11-18 13:02:12.032	teacher	production	\N	1504	5
449	\N	21	ម៉ុន ស្រីមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:47:55.007	2025-11-18 13:03:48.667	teacher	production	\N	1505	5
448	\N	21	យុន នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:46:54.566	2025-11-18 13:04:48.783	teacher	production	\N	1464	5
445	\N	21	លួន ស្រីតី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:44:48.664	2025-11-18 13:05:42.103	teacher	production	\N	1508	5
444	\N	21	វុទ្ធី វុទ្ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:43:59.604	2025-11-18 13:06:41.2	teacher	production	\N	1472	5
443	\N	21	សាន ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:43:00.779	2025-11-18 13:07:42.696	teacher	production	\N	1510	5
442	\N	21	សារី ចន្ទណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:42:00.623	2025-11-18 13:08:37.295	teacher	production	\N	1468	5
440	\N	21	ហ៊ីម ម៉េងល័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:39:46.079	2025-11-18 13:11:37.057	teacher	production	\N	1513	5
439	\N	21	អឿន ណាំណឹង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:38:45.944	2025-11-18 13:13:33.306	teacher	production	\N	1517	5
438	\N	21	អឿន អេរីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	66	f	f	\N	2025-11-12 02:37:52.626	2025-11-18 13:14:56.258	teacher	production	\N	1439	5
472	\N	21	គឺ ហ្សានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:47:41.234	2025-11-20 01:13:35.963	teacher	production	\N	1478	4
1489	\N	4	ភន យុនថេ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:04:54.61	2025-11-20 13:20:41.546	teacher	production	\N	598880	4
582	\N	25	មាស អ៉ីម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:11:32.543	2025-11-17 11:12:01.32	teacher	production	\N	4840	4
794	\N	22	ខុន សំណាង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:50:34.77	2025-11-18 14:18:05.236	teacher	production	\N	0031	4
473	\N	21	គ័ង គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:48:25.705	2025-11-20 01:14:59.129	teacher	production	\N	1520	4
474	\N	21	ចាន់រ៉ូ ចាន់ឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:49:59.285	2025-11-20 01:15:40.834	teacher	production	\N	1521	4
475	\N	21	ឆី ភ័ត្រ្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:50:45.42	2025-11-20 01:16:38.301	teacher	production	\N	1528	4
476	\N	21	ឆេងឡា ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:51:47.846	2025-11-20 01:17:18.861	teacher	production	\N	1522	4
477	\N	21	ឈួង វិឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:52:26.179	2025-11-20 01:18:06.095	teacher	production	\N	1659	4
478	\N	21	ឈៀង កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:53:13.949	2025-11-20 01:20:07.414	teacher	production	\N	1524	4
479	\N	21	ដានី ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:53:56.943	2025-11-20 01:21:06.243	teacher	production	\N	1525	4
480	\N	21	ធារុណ សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:54:28.851	2025-11-20 01:22:15.471	teacher	production	\N	1492	4
481	\N	21	នី សុខជា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:55:15.021	2025-11-20 01:23:10.641	teacher	production	\N	1531	4
482	\N	21	ប៊ី វិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:56:06.663	2025-11-20 01:25:09.462	teacher	production	\N	1533	4
483	\N	21	ប៊ុនណាង ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:56:44.755	2025-11-20 01:26:19.612	teacher	production	\N	1534	4
484	\N	21	បុរី កល្យាណ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:57:20.743	2025-11-20 01:27:16.664	teacher	production	\N	1536	4
485	\N	21	ផន លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:58:06.716	2025-11-20 01:29:21.934	teacher	production	\N	1537	4
492	\N	21	ម៉ៅ លីហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:36:27.284	2025-11-20 01:04:27.005	teacher	production	\N	1545	4
491	\N	21	ម៉ឺន សុធា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:35:50.232	2025-11-20 01:05:57.901	teacher	production	\N	1544	4
490	\N	21	ភួង សុវណ្ណភូមិ	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:35:09.922	2025-11-20 01:08:29.259	teacher	production	\N	1509	4
515	\N	2	មាន សិរិវឌ្ឍនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:51:36.061	2025-11-17 15:08:36.407	teacher	production	\N	១០០១	4
516	\N	2	ហេង គឹមឡាយ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:52:24.47	2025-11-17 15:11:32.222	teacher	production	\N	១០០២	4
517	\N	2	អ៊ូច ស្រីអៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:53:10.164	2025-11-17 15:12:39.063	teacher	production	\N	១០០៣	4
518	\N	2	អាន គីមមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:54:15.966	2025-11-17 15:13:46.182	teacher	production	\N	១០០៤	4
519	\N	2	ផល ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:54:56.369	2025-11-17 15:15:01.496	teacher	production	\N	១០០៥	4
520	\N	2	រី យ៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:55:39.43	2025-11-17 15:15:53.123	teacher	production	\N	១០០៦	4
522	\N	2	រឿន វ៉ាន់នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:57:35.699	2025-11-17 15:18:06.196	teacher	production	\N	១០០៨	4
523	\N	2	វីត សីវណេត	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 08:59:40.625	2025-11-17 15:18:53.476	teacher	production	\N	១០០៩	4
524	\N	2	ប៊ី រ៉ាប៊ីន	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:00:49.892	2025-11-17 15:19:44.506	teacher	production	\N	១០១០	4
525	\N	2	រិន វ៉ាន់នី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:01:30.579	2025-11-17 15:20:59.206	teacher	production	\N	១០១១	4
526	\N	2	ស៊ុន រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:03:07.688	2025-11-17 15:21:35.619	teacher	production	\N	១០១២	4
527	\N	2	វីត សីហា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:03:35.042	2025-11-17 15:22:19.995	teacher	production	\N	១០១៣	4
528	\N	2	បូសេរី មិនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:04:23.037	2025-11-17 15:23:05.886	teacher	production	\N	១០១៤	4
529	\N	2	រិន ចំរើន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:04:49.429	2025-11-17 15:23:43.368	teacher	production	\N	១០១៥	4
534	\N	19	ញ៉េ ម៉ានិត	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:42:13.797	2025-11-17 09:10:06.437	teacher	production	\N	២០០២	5
535	\N	19	ញ៉េ កុម្ភះ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:43:08.71	2025-11-17 09:10:24.315	teacher	production	\N	២០០៣	5
536	\N	19	ឌី ចាន់រី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:43:37.771	2025-11-17 09:10:53.252	teacher	production	\N	២០០៤	5
537	\N	19	ធា រ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:44:03.927	2025-11-17 09:11:19.485	teacher	production	\N	២០០៥	5
538	\N	19	នឿម សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:44:45.411	2025-11-17 09:13:04.864	teacher	production	\N	២០០៦	5
539	\N	19	បៃ សម្បត្តិ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:52:52.015	2025-11-17 09:13:48.754	teacher	production	\N	២០០៧	5
540	\N	19	ផល្លី យៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:53:21.515	2025-11-17 09:14:15.217	teacher	production	\N	២០០៨	5
542	\N	19	ម៉ៅ យូមីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:54:17.827	2025-11-17 09:53:26.704	teacher	production	\N	២០១០	5
544	\N	19	រឿន ខ្វាន់សុី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:55:22.927	2025-11-17 09:54:11.712	teacher	production	\N	២០១២	5
545	\N	19	រើន សៅណេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:55:54.103	2025-11-17 09:54:36.625	teacher	production	\N	២០១៣	5
530	\N	2	ខន ចាន់បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:05:24.692	2025-11-17 15:24:35.554	teacher	production	\N	១០១៦	4
533	\N	19	ឈើត បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:41:35.713	2025-11-17 09:09:08.658	teacher	production	\N	២០០១	5
531	\N	2	ដាវុន ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	41	f	f	\N	2025-11-13 09:05:58.877	2025-11-17 15:25:10.702	teacher	production	\N	១០១៧	4
513	\N	21	ឡុង រតន:	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:53:16.806	2025-11-18 07:44:35.78	teacher	production	\N	1476	4
514	\N	21	ឡេង សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:53:43.041	2025-11-18 07:54:42.477	teacher	production	\N	1560	4
512	\N	21	ឡុង ស៊ីវឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:52:44.493	2025-11-18 07:56:15.169	teacher	production	\N	1606	4
511	\N	21	ហួរ គីមហួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:52:06.294	2025-11-18 07:57:19.781	teacher	production	\N	1558	4
510	\N	21	ហាន ស៊ីត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:51:36.436	2025-11-18 07:58:31.593	teacher	production	\N	1604	4
508	\N	21	សៅ កុសល	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:50:17.121	2025-11-18 08:02:58.284	teacher	production	\N	1662	4
507	\N	21	សៅ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:49:45.054	2025-11-18 08:03:56.282	teacher	production	\N	1661	4
506	\N	21	សេន ភក្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:49:07.563	2025-11-18 08:04:56.257	teacher	production	\N	1515	4
505	\N	21	សួន ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:48:23.202	2025-11-18 08:05:56.24	teacher	production	\N	1555	4
504	\N	21	សុខហួង ជីងជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:47:52.364	2025-11-18 08:07:03.613	teacher	production	\N	1660	4
503	\N	21	សុខ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:47:14.618	2025-11-18 08:09:14.315	teacher	production	\N	1554	4
502	\N	21	ស៊ាត់ សុខគា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:46:14.004	2025-11-18 08:10:59.907	teacher	production	\N	1605	4
501	\N	21	វុទ្ធី លក្ខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:45:30.391	2025-11-18 08:12:53.541	teacher	production	\N	1553	4
500	\N	21	វាសនា បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:44:52.449	2025-11-18 08:13:44.55	teacher	production	\N	1552	4
498	\N	21	លីម ម៉េងសួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:40:47.616	2025-11-18 08:15:58.022	teacher	production	\N	1507	4
497	\N	21	រ៉ែម ម៉េងហៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:40:01.456	2025-11-18 08:16:59.499	teacher	production	\N	1549	4
496	\N	21	រ៉ាត ហានសៀវអ៊ុន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:39:29.261	2025-11-18 08:17:56.92	teacher	production	\N	1548	4
495	\N	21	យ៉េត ចាន់រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:38:31.174	2025-11-18 08:19:01.034	teacher	production	\N	1547	4
494	\N	21	យ៉ិតសីហា ម៉ូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:37:43.576	2025-11-18 08:20:03.718	teacher	production	\N	1546	4
493	\N	21	យាន ចាន់ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:37:07.979	2025-11-18 08:34:02.731	teacher	production	\N	1463	4
489	\N	21	ភាព ស្រីណូត	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:34:32.145	2025-11-20 01:12:08.291	teacher	production	\N	1543	4
487	\N	21	ភ័ណ្ឌ ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:59:27.273	2025-11-20 01:28:22.154	teacher	production	\N	1502	4
616	\N	25	ហ៊ាង ម៉េងហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:43:33.137	2025-11-17 11:44:09.385	teacher	production	\N	4806	4
652	\N	25	គង់ ស្រីនួន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:10:11.164	2025-11-18 08:12:11.037	teacher	production	\N	4784	5
661	\N	25	ណាង ចាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:33:03.749	2025-11-18 08:33:50.092	teacher	production	\N	4791	5
570	\N	25	នៅ ឈុនហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:37:35.403	2025-11-17 07:38:15.692	teacher	production	\N	4835	4
572	\N	25	បៃ ដាវិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:40:00.706	2025-11-17 07:40:23.472	teacher	production	\N	4768	4
574	\N	25	ភាព ឆេងគឹម	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 07:41:57.952	2025-11-17 07:42:21.854	teacher	production	\N	4827	4
471	\N	21	គា ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:47:03.424	2025-11-18 08:35:06.935	teacher	production	\N	1519	4
662	\N	25	គាំ ម៉ារ៉ាឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:34:38.89	2025-11-18 08:35:12.098	teacher	production	\N	4755	5
703	\N	22	ធី ថាឈីក	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:58:58.916	2025-11-18 14:41:18.923	teacher	production	\N	0005	5
663	\N	25	ទីញ សុធី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:36:17.725	2025-11-18 08:37:09.123	teacher	production	\N	4793	5
664	\N	22	ឈន វិច្ចរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 08:36:37.677	2025-11-18 14:44:58.677	teacher	production	\N	០០០១	5
682	\N	25	រ៉ា សាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:50:48.115	2025-11-18 08:51:18.865	teacher	production	\N	483	5
687	\N	25	យ័ន​ បូរី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:53:11.404	2025-11-18 08:53:47.233	teacher	production	\N	4748	5
543	\N	19	យឹម មីនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:54:44.217	2025-11-17 09:53:49.264	teacher	production	\N	២០១១	5
546	\N	19	វ៉ុន សុីនត្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:56:31.644	2025-11-17 09:54:51.31	teacher	production	\N	២០១៤	5
550	\N	19	សារ៉ាត់ ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:05.292	2025-11-17 09:55:27.346	teacher	production	\N	២០១៥	5
551	\N	19	ស៊ាន បូរី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:33.949	2025-11-17 09:55:44.126	teacher	production	\N	២០១៦	5
552	\N	19	សំភាស់ តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:58:59.172	2025-11-17 09:55:59.326	teacher	production	\N	២០១៧	5
553	\N	19	ហ៊ុន ប្រុសគីម	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 07:59:32.397	2025-11-17 09:56:18.596	teacher	production	\N	២០១៨	5
554	\N	19	អុឹម លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 08:00:08.34	2025-11-17 09:56:33.656	teacher	production	\N	២០១៩	5
555	\N	19	ស៊ាន ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	65	f	f	\N	2025-11-14 08:01:44.439	2025-11-17 09:56:46.389	teacher	production	\N	២០២០	5
581	\N	25	ម៉ៅ បូរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:09:16.679	2025-11-17 11:10:17.808	teacher	production	\N	4831	4
695	\N	25	ហាក់ ផាត់ថាណា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:55:41.129	2025-11-18 08:56:09.024	teacher	production	\N	4807	5
603	\N	25	ស៊ុន រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	69	f	f	\N	2025-11-17 11:30:06.745	2025-11-17 11:30:35.427	teacher	production	\N	4871	4
697	\N	25	ហ៊ាង នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:56:47.254	2025-11-18 08:57:22.576	teacher	production	\N	4805	5
767	\N	24	រីន មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:34:08.837	2025-11-20 04:43:09.931	teacher	production	\N	2808	4
702	\N	25	យន់ យូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	64	f	f	\N	2025-11-18 08:58:52.903	2025-11-18 08:59:41.313	teacher	production	\N	4670	5
768	\N	24	លន់​ អមរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:34:33.751	2025-11-20 04:43:37.003	teacher	production	\N	2839	4
769	\N	24	លាង​ ដាវីន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:35:05.032	2025-11-20 04:44:25.781	teacher	production	\N	2836	4
770	\N	24	លាង​ វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:35:37.749	2025-11-20 04:44:53.512	teacher	production	\N	2795	4
771	\N	24	វ៉ាន់​ណាង​ឧស្សាហ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:36:06.044	2025-11-20 04:45:24.598	teacher	production	\N	2647	4
838	\N	13	ធា បញ្ញាបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 10:18:31.41	2025-11-18 10:21:25.542	teacher	production	\N	2031	4
621	\N	23	វ៉ៃ ម៉េងស្រ៊ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 02:24:27.744	2025-11-20 11:00:34.929	teacher	production	\N	1061	5
633	\N	23	ស៊ាំង ចាន់ឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 07:03:13.381	2025-11-20 11:04:53.373	teacher	production	\N	1052	5
634	\N	23	ងីម ស៊ាវម៉ីញ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	76	f	f	\N	2025-11-18 07:03:51.129	2025-11-20 11:05:56.024	teacher	production	\N	1040	5
705	\N	23	ថាត រតនា 	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:59:40.491	2025-11-20 11:41:07.967	admin	production	\N	1056	5
850	\N	22	ហេម ឆេងគាង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	63	f	f	\N	2025-11-18 13:07:34.715	2025-11-18 13:30:07.464	teacher	production	\N	0028	5
858	\N	13	ភ័ក្រ ដានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:34:28.635	2025-11-18 13:35:19.095	teacher	production	\N	2040	4
859	\N	13	មឿន ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	52	f	f	\N	2025-11-18 13:36:03.964	2025-11-18 13:36:59.071	teacher	production	\N	2041	4
825	\N	22	សុខា ផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:10:00.821	2025-11-18 13:50:38.301	teacher	production	\N	0055	4
814	\N	22	រ៉េត លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:02:56.151	2025-11-18 14:00:06.606	teacher	production	\N	0047	4
813	\N	22	រស្មី ឈុនហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:02:13.183	2025-11-18 14:01:15.598	teacher	production	\N	0046	4
812	\N	22	ភា ឈុនហ៊ាង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:01:01.555	2025-11-18 14:02:06.634	teacher	production	\N	0045	4
811	\N	22	ប៊ុនសេង អ៉ីសាំង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 10:00:18.688	2025-11-18 14:03:17.856	teacher	production	\N	0044	4
799	\N	22	ចិន លីជីង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:53:03.639	2025-11-18 14:14:03.011	teacher	production	\N	0035	4
798	\N	22	ចាន់ថន ថាណា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:52:32.071	2025-11-18 14:15:01.364	teacher	production	\N	0034	4
796	\N	22	ចាន់ណា​ គីមលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	77	f	f	\N	2025-11-18 09:51:55.39	2025-11-18 14:16:04.856	teacher	production	\N	0033	4
701	\N	23	ស៊ីម សែនសំ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:58:21.769	2025-11-20 11:43:09.613	admin	production	\N	1054	5
696	\N	23	វង ស៉ីវម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:56:25.827	2025-11-20 11:48:06.268	admin	production	\N	1050	5
678	\N	23	ខំ ចាន់ឌឿន 	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:49:58.531	2025-11-20 11:55:57.39	admin	production	\N	1038	5
742	\N	23	ឡូត ផលឡែន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:16:52.114	2025-11-20 12:04:57.497	teacher	production	\N	1005	4
741	\N	23	យ៉ុន ស្រីឡា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 09:16:05.84	2025-11-20 12:37:08.883	teacher	production	\N	1004	4
1513	\N	4	រឿត ស្រីណេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:16:19.056	2025-11-20 13:29:11.806	teacher	production	\N	320825	4
1525	\N	4	រឿន សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:20:33.535	2025-11-20 13:32:56.28	teacher	production	\N	572467	4
968	\N	18	វិសាល សិរីបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:42:17.783	2025-11-20 07:47:47.167	teacher	production	\N	239	5
966	\N	18	វ៉ឹងហុង សៀងលី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:40:52.703	2025-11-20 07:49:06.096	teacher	production	\N	237	5
1530	\N	4	សម្បត្តិ បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:22:49.123	2025-11-20 13:35:11.4	teacher	production	\N	200972	4
1535	\N	4	ស៊ា សុីណី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:23:54.081	2025-11-20 13:36:39.928	teacher	production	\N	327537	4
965	\N	18	លី សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:40:25.293	2025-11-20 07:49:48.98	teacher	production	\N	236	5
964	\N	18	រដ្ឋា ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:40:02.056	2025-11-20 07:50:45.166	teacher	production	\N	235	5
1539	\N	4	សឿត ឌឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:26:03.956	2025-11-20 13:38:34.111	teacher	production	\N	599404	4
1543	\N	4	សឿត រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:27:23.696	2025-11-20 13:39:37.024	teacher	production	\N	730169	4
963	\N	18	យី ហ្គេកហ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:39:28.267	2025-11-20 07:51:34.538	teacher	production	\N	234	5
1437	\N	4	ខេម ស្រីនុច	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 07:50:36.954	2025-11-20 07:51:39.526	teacher	production	\N	256272	4
1546	\N	4	សំអឿន អេនជឿលី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:28:55.433	2025-11-20 13:40:46.922	teacher	production	\N	756788	4
1551	\N	4	ហូយ លីហួ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:29:50.739	2025-11-20 13:44:30.538	teacher	production	\N	828969	4
1404	\N	32	ព្រឿន​ ស្រីនោ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:33:34.903	2025-11-20 14:13:38.534	teacher	production	\N	5727	4
1571	\N	11	វើន វិជ័យសុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:38:18.672	2025-11-20 14:14:19.202	teacher	production	\N	2328	4
1467	\N	16	នួន  សិលា​	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-20 07:58:37.398	2025-11-21 02:10:11.841	teacher	production	\N	547	4
1452	\N	15	ឆុន ឈៀងម៉ៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 07:54:43.9	2025-11-21 06:23:10.519	teacher	production	\N	72	4
1459	\N	15	ផៃ សុភ័ស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 07:56:24.668	2025-11-21 06:24:25.106	teacher	production	\N	82	4
1464	\N	11	រស់ វីរៈសិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:57:33.609	2025-11-20 07:59:15.584	teacher	production	\N	2311	4
1465	\N	4	ថាវី លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 07:57:43.484	2025-11-20 07:59:20.621	teacher	production	\N	751758	4
1463	\N	15	មាស ផន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 07:57:20.594	2025-11-21 06:27:07.411	teacher	production	\N	84	4
1476	\N	4	ប៊ុនថេត សេរីបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:00:28.532	2025-11-20 08:01:25.405	teacher	production	\N	134197	4
1475	\N	11	រ៉ា មិថុនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:00:28.143	2025-11-20 08:02:11.023	teacher	production	\N	2327	4
942	\N	18	ជឿន ណារ៉ូ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:19:42.981	2025-11-20 08:02:20.678	teacher	production	\N	218	5
1481	\N	4	ប៊ុនធីម មង្គល	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:02:31.127	2025-11-20 08:03:55.495	teacher	production	\N	831143	4
1486	\N	11	រ៉ា ជីវ័ន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:03:57.112	2025-11-20 08:06:12.943	teacher	production	\N	2361	4
1474	\N	15	លី ចិនហ៊ុយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 07:59:37.899	2025-11-21 06:33:45.474	teacher	production	\N	89	4
1514	\N	15	ឧស្សា ឡាដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 08:16:31.193	2025-11-21 06:52:50.304	teacher	production	\N	10២	4
1482	\N	15	សួន នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 08:02:54.5	2025-11-21 06:56:18.731	teacher	production	\N	94	4
1479	\N	15	សូត្រ ចន្ទ័រត្ម័	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 08:02:09.298	2025-11-21 06:58:10.511	teacher	production	\N	93	4
1477	\N	15	វណ្ណ: ម៉ានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 08:00:42.137	2025-11-21 07:01:14.637	teacher	production	\N	90	4
1500	\N	11	រ៉ាវុទ្ធ ចាន់រី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:10:31.466	2025-11-20 08:12:18.658	teacher	production	\N	2364	4
879	\N	18	ជឿន លាងហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 00:48:15.462	2025-11-20 08:13:23.907	teacher	production	\N	144	4
1516	\N	11	ផាន់ សោភា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:17:24.291	2025-11-20 08:22:45.816	teacher	production	\N	2276	4
1446	\N	6	រស្មី ប្រុសផាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 07:53:51.653	2025-11-20 08:26:03.109	teacher	production	\N	2110	4
1549	\N	11	រិន ភារុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:29:26.484	2025-11-20 08:31:09.576	teacher	production	\N	2334	4
892	\N	20	ចន្ទ្រា ម៉ារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 00:55:53.365	2025-11-20 08:35:47.92	teacher	production	\N	#003	4
1432	\N	6	ឌឿន ម៉ាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 07:49:25.341	2025-11-20 08:35:55.439	teacher	production	\N	2176	4
1559	\N	11	វាសនា សូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:33:40.073	2025-11-20 08:36:54.92	teacher	production	\N	2335	4
1480	\N	12	ផុន វណ្ណដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:02:19.802	2025-11-20 11:42:41.746	teacher	production	\N	45	5
1512	\N	12	ហួន រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:14:59.284	2025-11-20 11:55:43.135	teacher	production	\N	49	5
1582	\N	12	សំ សុខេមា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:41:22.755	2025-11-20 12:04:36.878	teacher	production	\N	76	5
1568	\N	12	ញឿត សុខនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:37:14.913	2025-11-20 12:10:18.723	teacher	production	\N	71	5
1562	\N	12	លី រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:34:42.602	2025-11-20 12:18:09.625	teacher	production	\N	68	5
1555	\N	12	ផល្លា សុភី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:32:02.596	2025-11-20 12:21:46.111	teacher	production	\N	65	5
1544	\N	12	រុណ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:28:00.004	2025-11-20 12:28:55.473	teacher	production	\N	60	5
1541	\N	12	ភឿត សុភួ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:26:55.132	2025-11-20 12:30:22.396	teacher	production	\N	59	5
1540	\N	12	ណុប ហេងស្រស់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:26:08.495	2025-11-20 12:31:42.142	teacher	production	\N	58	5
1538	\N	12	កែវ សម្ភស្ស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:25:21.023	2025-11-20 12:32:51.064	teacher	production	\N	57	5
1534	\N	12	ម៉ៅ ស្រីនុច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:23:44.638	2025-11-20 12:35:27.871	teacher	production	\N	56	5
1531	\N	12	ម៉ុន ស្រីនុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:22:49.976	2025-11-20 12:36:52.384	teacher	production	\N	55	5
1528	\N	12	ម៉ី សំនៀង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:21:37.771	2025-11-20 12:37:57.81	teacher	production	\N	54	5
918	\N	20	រាជ សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:08:00.447	2025-11-19 01:39:45.193	teacher	production	\N	០២៥	4
932	\N	20	សំអៀន ផានន្ន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:15:25.198	2025-11-19 01:43:55.578	teacher	production	\N	០៣៩	4
429	\N	20	ហៅ ដានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-01 07:41:23.924	2025-11-19 03:45:28.089	teacher	production	\N	#1111	5
994	\N	18	ឡុង ប៉េងហួត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:18:17.832	2025-11-20 07:28:40.196	teacher	production	\N	169	4
992	\N	18	ហេងជៀប ប៊ុនណាភារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:17:36.349	2025-11-20 07:29:37.761	teacher	production	\N	167	4
991	\N	18	ហេងជៀប ប៊ុនណាភារី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:17:07.373	2025-11-20 07:30:18.341	teacher	production	\N	166	4
990	\N	18	លី ម៉េងហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:06:21.29	2025-11-20 07:30:58.07	teacher	production	\N	165	4
989	\N	18	ស្រៀង ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:05:57.751	2025-11-20 07:31:48.235	teacher	production	\N	164	4
987	\N	18	សំបូរ មួយលីម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:04:19.841	2025-11-20 07:32:33.814	teacher	production	\N	162	4
986	\N	18	ស្នា វួចឡែន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:03:58.295	2025-11-20 07:33:23.908	teacher	production	\N	161	4
985	\N	18	សៀន រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:03:29.205	2025-11-20 07:34:18.471	teacher	production	\N	160	4
1018	\N	26	មាន លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:10:30.226	2025-11-19 09:26:59.859	teacher	production	\N	2580	5
1017	\N	26	ភ័ស ស្រ៊ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:09:55.403	2025-11-19 09:28:27.524	teacher	production	\N	2570	5
1016	\N	26	ពៅ ថារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:08:51.651	2025-11-19 09:29:55.762	teacher	production	\N	2560	5
1015	\N	26	មិថុនា ភក្ត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:08:16.298	2025-11-19 09:31:01.708	teacher	production	\N	2550	5
1014	\N	26	ធី សុយុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:07:11.982	2025-11-19 09:32:14.713	teacher	production	\N	2520	5
1013	\N	26	ណេង ចិន្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:06:14.058	2025-11-19 09:33:26.868	teacher	production	\N	2500	5
1012	\N	26	ឌីណា មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:05:01.621	2025-11-19 09:34:29.186	teacher	production	\N	2480	5
1011	\N	26	ចាន់ណា ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:03:22.606	2025-11-19 09:35:25.984	teacher	production	\N	2450	5
1010	\N	26	គឿន រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:02:44.331	2025-11-19 09:36:32.663	teacher	production	\N	2440	5
1009	\N	26	គឿន ស៊ូយិន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:01:56.243	2025-11-19 09:38:05.745	teacher	production	\N	2430	5
1008	\N	26	គុង បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:01:02.925	2025-11-19 09:39:04.815	teacher	production	\N	2420	5
1020	\N	26	ខឿន យូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:11:13.19	2025-11-19 09:39:13.225	teacher	production	\N	1740	4
1019	\N	26	ថុន នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:10:32.72	2025-11-19 09:40:24.096	teacher	production	\N	1700	4
993	\N	18	ហ៊ាង ជីងជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:17:56.506	2025-11-20 03:33:14.802	teacher	production	\N	168	4
988	\N	18	សារ៉ាន់ សូលីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:04:48.351	2025-11-20 03:37:25.873	teacher	production	\N	163	4
997	\N	18	ខេង លីហួ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:19:29.54	2025-11-20 07:25:36.33	teacher	production	\N	172	4
996	\N	18	រ៉ាវី លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:19:08.072	2025-11-20 07:26:52.181	teacher	production	\N	171	4
995	\N	18	សារ៉ាន់ រ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:18:42.776	2025-11-20 07:27:53.359	teacher	production	\N	170	4
1398	\N	11	ពិសិដ្ឋ វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:31:04.982	2025-11-20 07:34:31.658	teacher	production	\N	2345	4
984	\N	18	សូសាន គីមទៀង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:03:10.267	2025-11-20 07:34:58.908	teacher	production	\N	159	4
983	\N	18	សុខ ខៃយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:02:42.449	2025-11-20 07:35:44.338	teacher	production	\N	158	4
982	\N	18	ឈឺន សុលីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:01:37.231	2025-11-20 07:37:26.559	teacher	production	\N	253	5
981	\N	18	គីម រដ្ឋដាឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:01:14.512	2025-11-20 07:38:20.045	teacher	production	\N	252	5
980	\N	18	អឿន សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:00:49.049	2025-11-20 07:39:19.272	teacher	production	\N	251	5
979	\N	18	ហ័រ លីអ៊័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:00:23.051	2025-11-20 07:39:59.08	teacher	production	\N	250	5
978	\N	18	ហេនជូកាំង ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 02:00:00.596	2025-11-20 07:40:50.111	teacher	production	\N	249	5
977	\N	18	ហេង តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:59:38.425	2025-11-20 07:41:41.837	teacher	production	\N	248	5
976	\N	18	ហេង ខេងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:59:19.865	2025-11-20 07:42:16.868	teacher	production	\N	247	5
975	\N	18	ហ៊ី ឈីងអ៊ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:59:02.186	2025-11-20 07:43:01.301	teacher	production	\N	246	5
974	\N	18	ហៀង រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:58:07.964	2025-11-20 07:43:46.9	teacher	production	\N	245	5
973	\N	18	ស្រ៊ាន់ សម្បត្តិ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:57:19.555	2025-11-20 07:44:21.527	teacher	production	\N	244	5
972	\N	18	សេង សៀវហ្វុង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:56:52.843	2025-11-20 07:44:57.456	teacher	production	\N	243	5
971	\N	18	សេង សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:56:28.564	2025-11-20 07:45:38.191	teacher	production	\N	242	5
970	\N	18	សុភ័ក្រ ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:55:55.256	2025-11-20 07:46:19.648	teacher	production	\N	241	5
969	\N	18	ស៊ន វ៉ាន់សាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:55:21.736	2025-11-20 07:47:00.336	teacher	production	\N	240	5
1199	\N	12	ឈឿន ណាំឈីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	27	f	f	\N	2025-11-20 06:21:15.925	2025-11-20 07:47:33.707	teacher	archived	\N	01	4
967	\N	18	វិបុល វីរៈបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:41:54.229	2025-11-20 07:48:24.225	teacher	production	\N	238	5
1428	\N	4	ឆៃ ឆាក់ណាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 07:48:19.352	2025-11-20 07:49:39.162	teacher	production	\N	700502	4
1007	\N	23	សៀ ចាន់មុន្នីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-19 04:46:44.674	2025-11-20 11:40:20.266	teacher	production	\N	1003(1)	4
1006	\N	23	ឈាង ម៉េងជូ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-19 04:45:13.485	2025-11-20 11:42:35.474	teacher	production	\N	1002(1)	4
1005	\N	23	ស្រ៊ុន មុន្នីរ័ត្ន(1)	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-19 04:43:00.239	2025-11-20 11:44:19.083	teacher	production	\N	1001(1)	4
1026	\N	26	សឿង វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:13:35.266	2025-11-19 09:17:11.96	teacher	production	\N	2680	5
2118	\N	7	ធី ច័ន្ទរតន:	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:00:53.486	2025-11-20 13:01:32.102	teacher	production	\N	6139	4
1023	\N	26	សារ៉ាត់ សៀវម៉ីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:12:14.923	2025-11-19 09:20:34.686	teacher	production	\N	2630	5
1021	\N	26	វី សាវ៉ាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-19 09:11:27.903	2025-11-19 09:23:49.798	teacher	production	\N	2620	5
1032	\N	26	ភាន ហុងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:16:47.644	2025-11-19 09:28:28.968	teacher	production	\N	1970	4
1031	\N	26	ពៅ ធារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:16:17.286	2025-11-19 09:29:38.542	teacher	production	\N	1950	4
1030	\N	26	ប្រុស គង្គា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:15:47.898	2025-11-19 09:30:48.128	teacher	production	\N	1910	4
1029	\N	26	បឿន ស៊ូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:15:12.01	2025-11-19 09:31:48.207	teacher	production	\N	1900	4
1028	\N	26	បូរ៉ាន់ នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:14:49.165	2025-11-19 09:32:44.598	teacher	production	\N	1890	4
1027	\N	26	ប៊ុនណា នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:14:08.234	2025-11-19 09:33:48.535	teacher	production	\N	1870	4
1025	\N	26	នាន់ សាវីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:13:28.272	2025-11-19 09:35:08.631	teacher	production	\N	1840	4
1024	\N	26	ដារ៉ូ ព្រឹក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:12:38.812	2025-11-19 09:36:35.194	teacher	production	\N	1800	4
1022	\N	26	ថៃ ស្រីលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-19 09:11:52.239	2025-11-19 09:38:05.632	teacher	production	\N	1790	4
1046	\N	26	រ៉ាត់ ស្រីអិត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 00:03:05.867	2025-11-20 05:20:46.141	teacher	production	\N	2091	4
1048	\N	26	សត្យា ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 00:09:42.134	2025-11-20 05:19:30.586	teacher	production	\N	2391	4
1047	\N	26	រិន សុផា 	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 00:07:31.595	2025-11-20 05:19:44.408	teacher	production	\N	2390	4
1050	\N	26	ហៃ មេត្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 00:15:34.368	2025-11-20 05:17:47.392	teacher	production	\N	2393	4
488	\N	21	ភ័ណ្ឌ អាមួយគា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 07:00:02.611	2025-11-20 01:19:09.653	teacher	production	\N	1541	4
486	\N	21	ពៅ អើយសុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	115	f	f	\N	2025-11-12 06:58:58.199	2025-11-20 01:30:18.283	teacher	production	\N	1540	4
1063	\N	4	ចាន់ សុខមីនា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 02:25:35.446	2025-11-20 02:29:00.381	teacher	production	\N	300033	4
1064	\N	14	អឿនឌី ស្រីដាវ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:25:41.774	2025-11-20 02:31:47.941	teacher	production	\N	2605235	5
1062	\N	14	អ៊ួញ អុី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:25:02.382	2025-11-20 02:34:31.284	teacher	production	\N	2606233	5
1066	\N	4	ឈន រ៉ាឈឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 02:31:04.673	2025-11-20 02:34:45.989	teacher	production	\N	544714	4
1061	\N	14	ឡម ដារ៉ាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:24:19.101	2025-11-20 02:37:32.349	teacher	production	\N	2605231	5
1072	\N	4	យាន វីយោ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 02:36:07.478	2025-11-20 02:38:20.784	teacher	production	\N	117031	4
1060	\N	14	សឿត ដាណាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:23:10.599	2025-11-20 02:39:05.965	teacher	production	\N	2605226	5
1059	\N	14	សុផល សុភីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:22:26.733	2025-11-20 02:40:28.962	teacher	production	\N	2605223	5
1058	\N	14	រ័ត្ន វីរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:21:21.044	2025-11-20 02:41:44.468	teacher	production	\N	2605215	5
1057	\N	14	រិទ្ធ គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:20:33.08	2025-11-20 02:42:45.342	teacher	production	\N	2605213	5
1056	\N	14	រតនៈ ឈិតច្បា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:19:32.54	2025-11-20 02:43:54.81	teacher	production	\N	2605212	5
1055	\N	14	ម៉ាប់ សុខរៀម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:18:31.175	2025-11-20 02:45:43.667	teacher	production	\N	2605211	5
1054	\N	14	ផាន ថុណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:17:46.426	2025-11-20 02:46:43.961	teacher	production	\N	2605206	5
1053	\N	14	ផាត សុនេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:16:17.253	2025-11-20 02:48:14.584	teacher	production	\N	2605205	5
1052	\N	14	ឆៃ គឹមសែន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:15:17.844	2025-11-20 02:49:23.418	teacher	production	\N	2605196	5
1051	\N	14	គង់ ម៉េងហៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 02:14:00.675	2025-11-20 02:50:59.783	teacher	production	\N	2605195	5
1079	\N	11	ចាន់  សុខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:42:18.808	2025-11-20 03:33:03.816	teacher	production	\N	2299	5
1080	\N	11	ចាន់វាសនា  បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:43:48.236	2025-11-20 03:35:02.888	teacher	production	\N	2296	5
1081	\N	11	ចិត្ត  ចឺម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:44:32.787	2025-11-20 03:36:38.892	teacher	production	\N	2373	5
1083	\N	11	ជិន  ស៊ីវហ្វុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:48:26.902	2025-11-20 03:38:03.719	teacher	production	\N	2289	5
1084	\N	11	ឈិន  ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:49:11.77	2025-11-20 03:39:18.034	teacher	production	\N	2283	5
1086	\N	11	និល  អុីនណាម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:51:27.922	2025-11-20 03:41:45.974	teacher	production	\N	2293	5
1082	\N	3	ទិត្យ គួមិញ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:45:38.075	2025-11-20 04:52:12.889	teacher	production	\N	108	4
1077	\N	3	ធា ម៉េងលី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:39:40.28	2025-11-20 04:52:59.857	teacher	production	\N	109	4
1076	\N	3	រិទ្ធ សៅយ៉ីង	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:39:14.098	2025-11-20 04:54:19.366	teacher	production	\N	115	4
1075	\N	3	គង់ សៀវអឺ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:38:09.286	2025-11-20 04:55:09.541	teacher	production	\N	100	4
1074	\N	3	ឈុន ឆៃយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:37:41.978	2025-11-20 04:55:59.49	teacher	production	\N	105	4
1073	\N	3	សាន ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:37:10.54	2025-11-20 04:56:57.775	teacher	production	\N	125	4
1071	\N	3	ហាន់ សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:35:28.551	2025-11-20 04:57:41.741	teacher	production	\N	127	4
1070	\N	3	វាសនា សុម៉ាលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:34:58.702	2025-11-20 04:58:39.529	teacher	production	\N	120	4
1069	\N	3	សួម សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:33:53.756	2025-11-20 04:59:23.186	teacher	production	\N	126	4
1067	\N	3	ឈុន ឆៃណា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:31:22.914	2025-11-20 05:01:27.586	teacher	production	\N	104	4
1065	\N	3	វីវ៉ា សុវណ្ណឫទ្ធិ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:30:30.983	2025-11-20 05:02:21.254	teacher	production	\N	122	4
1049	\N	26	សុជា មករា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 00:13:25.813	2025-11-20 05:18:54.464	teacher	production	\N	2392	4
1112	\N	14	អុល រ៉ាឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:09:57.803	2025-11-20 03:11:40.345	teacher	production	\N	2604159	4
1111	\N	14	សំបូរ ស្រីឡៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:09:05.215	2025-11-20 03:15:27.284	teacher	production	\N	2604153	4
1110	\N	14	វឿន វី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:08:19.025	2025-11-20 03:18:06.934	teacher	production	\N	2604149	4
1109	\N	14	រ៉ុង ផានន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:07:21.003	2025-11-20 03:21:24.112	teacher	production	\N	2604146	4
1108	\N	14	មករា រ៉ាឌឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:06:24.935	2025-11-20 03:23:23.038	teacher	production	\N	2604143	4
1106	\N	14	ផល ផារ៉ាត់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:05:27.047	2025-11-20 03:25:05.172	teacher	production	\N	2604140	4
1103	\N	14	ប៊ុនថេន វណ្ណថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:04:27.809	2025-11-20 03:26:50.726	teacher	production	\N	2604138	4
1102	\N	14	ជីវ័ន្ត ផាហ្វុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:03:32.538	2025-11-20 03:28:12.567	teacher	production	\N	2604133	4
1078	\N	11	គុន  គីមសៀ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:41:25.879	2025-11-20 03:29:50.995	teacher	production	\N	2275	5
1097	\N	14	ចុន គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 03:00:07.937	2025-11-20 03:31:23.32	teacher	production	\N	2604131	4
1095	\N	14	ឃឿម សុចិន្ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 02:59:24.023	2025-11-20 03:34:23.596	teacher	production	\N	2604130	4
1107	\N	11	ឡេ  វណ្ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	50	f	f	\N	2025-11-20 03:05:57.474	2025-11-20 03:39:24.84	teacher	archived	\N	2344	5
1085	\N	11	ធឿន  សុរិន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:50:03.269	2025-11-20 03:40:21.156	teacher	production	\N	2277	5
1087	\N	11	ផល  សុវណ្ណសិទ្ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:52:17.204	2025-11-20 03:44:43.214	teacher	production	\N	2304	5
1088	\N	11	ភក្តី  សុវណ្ណបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:53:32.285	2025-11-20 03:46:02.141	teacher	production	\N	2306	5
1089	\N	11	ម៉ៅ  រដ្ឋា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:54:23.74	2025-11-20 03:47:14.685	teacher	production	\N	2347	5
1090	\N	11	មុត  លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:55:17.74	2025-11-20 03:48:27.844	teacher	production	\N	2310	5
1091	\N	11	រតនៈ  លីនដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:55:57.19	2025-11-20 03:50:42.21	teacher	production	\N	2377	5
1092	\N	11	រ៉ា ចន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:56:39.936	2025-11-20 03:53:26.949	teacher	production	\N	2291	5
1093	\N	11	រើន  វ៉ាន់ឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:57:42.994	2025-11-20 03:55:06.965	teacher	production	\N	2384	5
1094	\N	11	វណ្ណា  វិច្ឆិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:58:44.922	2025-11-20 03:56:22.151	teacher	production	\N	2314	5
1096	\N	11	វី  វណ្ណៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 02:59:26.489	2025-11-20 03:57:32.314	teacher	production	\N	2378	5
1098	\N	11	សុភាព  លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:00:33.811	2025-11-20 04:00:33.544	teacher	production	\N	2315	5
1099	\N	11	សុភ័ក្រ  យូអុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:01:42.641	2025-11-20 04:02:01.786	teacher	production	\N	2313	5
1100	\N	11	សេង  រ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:02:38.672	2025-11-20 04:03:13.842	teacher	production	\N	2278	5
1101	\N	11	សំអាត  ផាន់ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:03:29.8	2025-11-20 04:04:32.93	teacher	production	\N	2317	5
1104	\N	11	សំអឿន  សុវណ្ណដារ៉ាវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:04:30.514	2025-11-20 04:05:46.269	teacher	production	\N	2321	5
1105	\N	11	សឿក សម្ផស្ស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 03:05:22.398	2025-11-20 04:07:02.695	teacher	production	\N	2316	5
1127	\N	3	ណាក់ ណាត	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:30:14.465	2025-11-20 04:14:46.511	teacher	production	\N	107	4
1126	\N	3	រ៉ាត់ សារ៉េត	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:23:03.65	2025-11-20 04:17:38.45	teacher	production	\N	113	4
1125	\N	3	រស់ សុវណ្ណ	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:22:27.39	2025-11-20 04:18:29.708	teacher	production	\N	112	4
1124	\N	3	រី សារ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:20:22.446	2025-11-20 04:21:34.02	teacher	production	\N	117	4
1123	\N	3	ឆាយ វីបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:19:57.052	2025-11-20 04:22:14.598	teacher	production	\N	102	4
1144	\N	7	រដ្ឋា រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 04:43:40.323	2025-11-20 12:21:37.012	teacher	production	\N	6071	5
1145	\N	7	ម៉ៅ សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 04:44:29.859	2025-11-20 12:22:47.363	teacher	production	\N	6548	5
1147	\N	7	មាឃ លាងហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:02:41.274	2025-11-20 12:23:49.29	teacher	production	\N	6030	5
1122	\N	3	ភ័ត្ត្រា ម៉ានី	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:19:14.654	2025-11-20 04:37:32.104	teacher	production	\N	110	4
760	\N	24	ពិសី​ សិរីរតនី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:29:26.84	2025-11-20 04:38:28.323	teacher	production	\N	2728	4
766	\N	24	រ៉េ​ន​ ណារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:33:40.716	2025-11-20 04:42:36.421	teacher	production	\N	2854	4
1121	\N	3	យ៉ាន ចាន់នី	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:18:30.294	2025-11-20 04:44:22.805	teacher	production	\N	111	4
1120	\N	3	ឌឿន វណ្ណសុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:17:25.082	2025-11-20 04:45:00.886	teacher	production	\N	106	4
1119	\N	3	រិទ្ធ សុខយៀង	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:16:52.845	2025-11-20 04:45:46.252	teacher	production	\N	114	4
775	\N	24	សារិន​ ហេងវៃលឹស	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:37:40.875	2025-11-20 04:46:32.176	teacher	production	\N	2849	4
1118	\N	3	លីវ មីញសឺ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:16:22.714	2025-11-20 04:46:43.537	teacher	production	\N	119	4
1117	\N	3	ជី លាងជីង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:15:54.113	2025-11-20 04:48:13.293	teacher	production	\N	103	4
1116	\N	3	ឃុន ធីរ៉ាយុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:14:56.686	2025-11-20 04:48:53.594	teacher	production	\N	101	4
1115	\N	3	រិទ្ធ សុខយ៉ាន	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:14:27.123	2025-11-20 04:49:40.156	teacher	production	\N	116	4
783	\N	24	អាន​ នុងនេន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-18 09:40:20.338	2025-11-20 04:50:09.022	teacher	production	\N	2744	4
1114	\N	3	ហួច ម៉េងហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:13:55.499	2025-11-20 04:50:29.461	teacher	production	\N	128	4
1113	\N	3	វិចិត្រ វឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 03:13:23.116	2025-11-20 04:51:03.406	teacher	production	\N	121	4
1146	\N	24	ហ៊​ន​ ឆេងហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 04:51:48.843	2025-11-20 04:52:12.969	teacher	production	\N	2862	4
1068	\N	3	សម្បត្តិ រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	51	f	f	\N	2025-11-20 02:32:28.995	2025-11-20 05:00:39.217	teacher	production	\N	124	4
1162	\N	14	ក្រឹម ចាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:13:30.844	2025-11-20 05:14:58.436	teacher	production	\N	2605191	5
2148	\N	7	វាសនា ធីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:10:13.825	2025-11-20 13:10:41.411	teacher	production	\N	6052	4
1170	\N	14	ខិន ទូច	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:16:52.291	2025-11-20 05:18:14.834	teacher	production	\N	2605192	5
1173	\N	7	សារ៉ា បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:18:05.258	2025-11-20 12:27:35.552	teacher	production	\N	6119	5
1176	\N	14	ខ្មៅ ហ្វុនតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:19:46.729	2025-11-20 05:20:42.788	teacher	production	\N	2605193	5
1178	\N	14	គង់ ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:21:42.564	2025-11-20 05:22:42.153	teacher	production	\N	2605194	5
1179	\N	14	ជឿម ថេវ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:23:46.901	2025-11-20 05:25:22.836	teacher	production	\N	2605197	5
1180	\N	14	ឈឿត មច្ឆនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:26:40.7	2025-11-20 05:27:40.245	teacher	production	\N	2605198	5
1181	\N	14	ឈឿត សុខវណ្ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:28:44.59	2025-11-20 05:30:17.567	teacher	production	\N	2605199	5
1129	\N	11	កុសល សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 04:31:38.658	2025-11-20 05:33:29.105	teacher	production	\N	2350	4
1182	\N	14	ឈៀង ស្រីនិច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:34:31.595	2025-11-20 05:35:48.234	teacher	production	\N	2605200	5
1183	\N	14	ត្រី សុភារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:36:49.972	2025-11-20 05:37:48.642	teacher	production	\N	2605201	5
1184	\N	14	និត ស្រីនិច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:39:06.652	2025-11-20 05:41:26.488	teacher	production	\N	2605202	5
1185	\N	14	ប៉ុន យ៉ាកុប	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:55:13.699	2025-11-20 05:56:53.634	teacher	production	\N	2605203	5
1186	\N	14	ផល ស្រីភា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 05:58:46.666	2025-11-20 06:02:13.202	teacher	production	\N	2605204	5
1187	\N	14	ភាព ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:04:17.137	2025-11-20 06:05:23.44	teacher	production	\N	2605207	5
1190	\N	14	ភារុន មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:06:19.344	2025-11-20 06:07:05.819	teacher	production	\N	2605208	5
1192	\N	14	ភឿន មេត្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:08:16.24	2025-11-20 06:09:14.417	teacher	production	\N	2605209	5
1427	\N	11	រដ្ឋា ចាន់ធឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:45:31.689	2025-11-20 07:47:42.288	teacher	production	\N	2295	4
1194	\N	14	មករា ភត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:11:28.268	2025-11-20 06:12:26.428	teacher	production	\N	2605210	5
1195	\N	14	រឿម សារ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:14:02.659	2025-11-20 06:19:02.322	teacher	production	\N	2605214	5
1196	\N	14	លី វននីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:20:17.052	2025-11-20 06:21:07.206	teacher	production	\N	2605216	5
1200	\N	14	វិត សុវណ្ណារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:22:37.995	2025-11-20 06:23:25.729	teacher	production	\N	2605217	5
1444	\N	4	ណាង យូណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 07:52:47.655	2025-11-20 07:53:58.476	teacher	production	\N	374872	4
1148	\N	7	ភុន ស៊ីដារ៉ូ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:05:02.706	2025-11-20 12:24:46.89	teacher	production	\N	6066	5
1177	\N	7	អ៊ួង សុម៉ារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:19:58.628	2025-11-20 12:25:34.218	teacher	production	\N	6073	5
1207	\N	14	វី រ៉ាយាន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:25:38.824	2025-11-20 06:26:34.769	teacher	production	\N	2605218	5
1175	\N	7	យ៉ត វ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:19:31.876	2025-11-20 12:26:10.985	teacher	production	\N	6267	5
1174	\N	7	គីរី ជីម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:18:36.23	2025-11-20 12:26:56.49	teacher	production	\N	5975	5
1172	\N	7	រឿន ដាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:17:32.437	2025-11-20 12:28:43.783	teacher	production	\N	6116	5
1171	\N	7	សឿន សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:17:05.342	2025-11-20 12:30:02.639	teacher	production	\N	5991	5
1212	\N	14	វុទ្ធ សុម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:27:33.041	2025-11-20 06:28:17.637	teacher	production	\N	2605219	5
1215	\N	12	វិសិទ្ធ សៀវមិញ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:28:22.56	2025-11-20 12:30:30.954	teacher	production	\N	03	4
1169	\N	7	ថូ ពុទ្ធារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:16:38.23	2025-11-20 12:31:09.746	teacher	production	\N	6185	5
1167	\N	7	ប៊ុនរ៉ុង ណារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:16:12.658	2025-11-20 12:31:46.282	teacher	production	\N	5922	5
1166	\N	7	និត សុនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:15:43.408	2025-11-20 12:32:21.47	teacher	production	\N	6161	5
1165	\N	7	ផល ម៉េងសុម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:15:11.895	2025-11-20 12:32:57.058	teacher	production	\N	6005	5
1164	\N	7	ទ្រី ម៉េងហាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:14:29.966	2025-11-20 12:33:43.474	teacher	production	\N	6199	5
1163	\N	7	រិទ្ធ ស្សាវរីយ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:13:57.893	2025-11-20 12:34:25.96	teacher	production	\N	6035	5
1161	\N	7	រើន ម៉ារីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:13:25.971	2025-11-20 12:35:00.681	teacher	production	\N	6270	5
1160	\N	7	ប៊ុនរ៉ា ធិម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:12:57.462	2025-11-20 12:35:44.509	teacher	production	\N	6305	5
1217	\N	12	រឿន លិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:28:58.863	2025-11-20 12:36:21.89	teacher	production	\N	04	4
1159	\N	7	កាន ស៊ីថា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:12:03.831	2025-11-20 12:36:38.568	teacher	production	\N	6181	5
1149	\N	7	នីម រ៉ាទី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:05:53.058	2025-11-20 12:37:23.405	teacher	production	\N	6065	5
1158	\N	7	សាក់ វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:11:34.843	2025-11-20 12:38:05.283	teacher	production	\N	6145	5
1221	\N	12	រដ្ឋ ធារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:29:32.767	2025-11-20 12:38:20.238	teacher	production	\N	05	4
1157	\N	7	វុទ្ធី វិសុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:10:47.277	2025-11-20 12:39:51.807	teacher	production	\N	6197	5
1156	\N	7	យឺន ជីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:09:54.732	2025-11-20 12:40:22.84	teacher	production	\N	6113	5
1155	\N	7	សាត ឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:09:25.123	2025-11-20 12:40:53.109	teacher	production	\N	5915	5
1154	\N	7	ឆម ភារុណ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:08:48.875	2025-11-20 12:41:33.437	teacher	production	\N	6135	5
1153	\N	7	អេង កនផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:08:18.805	2025-11-20 12:42:05.517	teacher	production	\N	6132	5
1151	\N	7	រ៉េន សារ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:07:00.521	2025-11-20 12:43:18.752	teacher	production	\N	6284	5
1150	\N	7	ជុង ណារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:06:25.18	2025-11-20 12:43:53.016	teacher	production	\N	6032	5
1343	\N	12	ថាន សុឃីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:06:37.758	2025-11-20 12:59:10.884	teacher	production	\N	36	4
1220	\N	14	សារ៉ន ភារីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:29:24.525	2025-11-20 06:30:19.044	teacher	production	\N	2605220	5
1340	\N	12	ភន សុខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:06:00.527	2025-11-20 13:00:48.565	teacher	production	\N	35	4
1336	\N	12	រ៉ាត់ រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:05:06.299	2025-11-20 13:01:49.193	teacher	production	\N	34	4
1335	\N	12	ជុន ស៊ីណាត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:04:24.279	2025-11-20 13:02:56.585	teacher	production	\N	33	4
1228	\N	14	សុខ កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:32:26.528	2025-11-20 06:33:25.711	teacher	production	\N	2605221	5
1430	\N	11	រដ្ឋា សុវណ្ណមតី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:49:16.991	2025-11-20 07:51:23.444	teacher	production	\N	2366	4
1232	\N	11	ឈិល ឈឿត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 06:35:17.921	2025-11-20 10:19:13.156	teacher	production	\N	2338	4
1241	\N	12	ជៀប សុជាតា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:38:07.465	2025-11-20 12:43:31.873	teacher	production	\N	07	4
1231	\N	12	មិន ម៉ាន់នូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	27	f	f	\N	2025-11-20 06:34:25.097	2025-11-20 06:34:42.154	teacher	archived	\N	06	4
1248	\N	12	ធី រ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:39:45.556	2025-11-20 12:52:46.366	teacher	production	\N	08	4
1349	\N	12	ចាន់ វីរ៉ានុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:10:32.56	2025-11-20 12:54:02.289	teacher	production	\N	38	4
1252	\N	12	រឿន ផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:41:06.298	2025-11-20 12:55:37.397	teacher	production	\N	09	4
1256	\N	12	ម៉ៅ សុភក្រ័	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:42:03.149	2025-11-20 12:56:35.134	teacher	production	\N	10	4
1348	\N	12	យ៉េង សុម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:09:28.08	2025-11-20 12:57:43.46	teacher	production	\N	37	4
1330	\N	12	រ៉ាយ វីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:03:19.196	2025-11-20 13:03:55.74	teacher	production	\N	32	4
1327	\N	12	ធឿន វ៉ាន់ធីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:02:36.199	2025-11-20 13:04:48.903	teacher	production	\N	31	4
1326	\N	12	រុន វុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:01:46.647	2025-11-20 13:05:47.861	teacher	production	\N	30	4
1258	\N	12	ឈុន ណាលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:42:41.555	2025-11-20 13:06:34.719	teacher	production	\N	11	4
1319	\N	12	យូន ដាវិន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:00:37.312	2025-11-20 13:08:59.546	teacher	production	\N	28	4
1314	\N	12	ថា បុនសា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:59:28.344	2025-11-20 13:09:52.987	teacher	production	\N	27	4
1262	\N	12	សុខា ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:43:21.432	2025-11-20 13:10:48.592	teacher	production	\N	12	4
1245	\N	14	សុថា រ៉ាឈីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:38:54.195	2025-11-20 06:40:16.623	teacher	production	\N	2605222	5
1313	\N	12	ផន មឿត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:58:47.379	2025-11-20 13:11:57.742	teacher	production	\N	26	4
1242	\N	11	ចិត្ត ចាន់ថា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 06:38:14.991	2025-11-20 06:40:53.73	teacher	production	\N	2365	4
2152	\N	7	សុង ស៊ីវហ័ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:12:01.995	2025-11-20 13:12:22.809	teacher	production	\N	6089	4
2153	\N	7	រិទ្ធី ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:12:49.086	2025-11-20 13:13:10.461	teacher	production	\N	6409	4
1305	\N	12	សំណាង កូនណុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:57:18.637	2025-11-20 13:13:59.593	teacher	production	\N	24	4
1300	\N	12	ផល ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:55:46.959	2025-11-20 13:15:58.43	teacher	production	\N	22	4
1288	\N	12	យ៉ង ពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:51:28.597	2025-11-20 13:16:51.929	teacher	production	\N	21	4
1264	\N	12	ម៉េត សុចាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:44:02.067	2025-11-20 13:17:55.366	teacher	production	\N	13	4
1285	\N	12	ទូច សុខលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:50:37.806	2025-11-20 13:19:04.229	teacher	production	\N	20	4
1283	\N	12	ស៊ាន វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:49:48.796	2025-11-20 13:20:08.43	teacher	production	\N	19	4
1280	\N	12	ភឿត សុផានី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:48:42.635	2025-11-20 13:21:53.168	teacher	production	\N	18	4
1277	\N	12	រឿន សារិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:47:57.785	2025-11-20 13:22:49.362	teacher	production	\N	17	4
1276	\N	12	ញ៉ាំង មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:47:23.738	2025-11-20 13:23:50.761	teacher	production	\N	16	4
1273	\N	12	ចំរើន រ៉ាណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:46:42.19	2025-11-20 13:24:42.548	teacher	production	\N	15	4
1269	\N	14	សុភ័ក្រ្ត ណាំវ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:45:07.898	2025-11-20 06:46:26.395	teacher	production	\N	2605224	5
1270	\N	12	ថៅ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:45:08.605	2025-11-20 13:25:41.139	teacher	production	\N	14	4
2149	\N	1	រ័ត្ន រីមុន្នីរណ្ណ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:10:44.202	2025-11-21 04:05:54.713	teacher	archived	\N	1142	4
1268	\N	11	ដារ៉ា រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 06:44:50.275	2025-11-20 06:48:19.519	teacher	production	\N	2370	4
1284	\N	14	សុភ័ក្រ្ត ណាំវ៉ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:49:49.693	2025-11-20 06:50:51.37	teacher	production	\N	2605225	5
1290	\N	14	សឿម វីរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:52:04.873	2025-11-20 06:52:51.574	teacher	production	\N	2605227	5
1289	\N	11	ដិប ចន្ធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 06:51:48.53	2025-11-20 06:53:42.225	teacher	production	\N	2282	4
1295	\N	14	សំណាង កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:53:50.666	2025-11-20 06:54:40.326	teacher	production	\N	2605228	5
1301	\N	14	ហេង បរមីណ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:55:54.049	2025-11-20 06:56:46.599	teacher	production	\N	2605229	5
1308	\N	11	ត្រហៀត ហៃយាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	117	f	f	\N	2025-11-20 06:57:55.855	2025-11-20 06:58:47.54	teacher	archived	\N	2362	4
1311	\N	14	ហេង ផាត់សាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 06:58:41.588	2025-11-20 07:00:27.028	teacher	production	\N	2605230	5
1323	\N	14	អុីន គឹមលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 07:01:30.032	2025-11-20 07:02:31.688	teacher	production	\N	2605232	5
1331	\N	14	អាត ស្រីអៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 07:03:30.747	2025-11-20 07:04:52.063	teacher	production	\N	2605234	5
1339	\N	14	អឿប សិលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	24	f	f	\N	2025-11-20 07:05:57.798	2025-11-20 07:06:43.181	teacher	production	\N	2605236	5
1332	\N	11	ថា ចាន់ឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:04:01.075	2025-11-20 07:06:52.661	teacher	production	\N	2302	4
1390	\N	11	និល ណានីរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:26:53.632	2025-11-20 07:29:14.721	teacher	production	\N	3340	4
1389	\N	16	ណាង លីណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	113	f	f	\N	2025-11-20 07:25:55.431	2025-11-20 07:30:24.967	teacher	archived	\N	605	4
2068	\N	8	សាបាន់ ថាវីសា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:32:28.632	2025-11-20 13:10:56.638	teacher	production	\N	5779	4
1499	\N	4	ភេទ ប៉ារីនេត្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:09:56.353	2025-11-20 13:23:27.788	teacher	production	\N	169242	4
1503	\N	4	មឿន ថាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:11:46.505	2025-11-20 13:25:44.612	teacher	production	\N	613348	4
1507	\N	4	រ៉ា សារុាំង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:13:19.014	2025-11-20 13:26:57.745	teacher	production	\N	930529	4
962	\N	18	យិត សៀកហួ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:38:48.567	2025-11-20 07:52:20.521	teacher	production	\N	233	5
1510	\N	4	រី មន្នីរត្ន័	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:14:56.878	2025-11-20 13:28:07.339	teacher	production	\N	813576	4
1517	\N	4	រឿន រុំដាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:18:02.684	2025-11-20 13:30:27.181	teacher	production	\N	986500	4
1520	\N	4	រឿន រតនុន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:19:14.353	2025-11-20 13:31:40.123	teacher	production	\N	276354	4
1529	\N	4	លី បុរិន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:21:38.909	2025-11-20 13:34:02.085	teacher	production	\N	950739	4
1537	\N	4	សុខណា កន្និកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:25:03.103	2025-11-20 13:37:40.504	teacher	production	\N	159272	4
1383	\N	11	សុវុទ្ធី នរៈបូណ៌មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 07:21:46.44	2025-11-20 07:24:06.375	teacher	production	\N	2330	4
1375	\N	32	នី​ សូលីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:18:50.678	2025-11-20 14:05:39.612	teacher	production	\N	5713	4
2196	\N	31	ផល្លា រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:39:49.074	2025-11-20 14:08:08.359	teacher	production	\N	123129	5
1376	\N	32	ផល​ ធារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:19:25.239	2025-11-20 14:08:16.873	teacher	production	\N	5715	4
1379	\N	32	វល្លា​ វណ្ណេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:20:03.048	2025-11-20 14:09:47.231	teacher	production	\N	5718	4
946	\N	18	ដែន ហេងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:20:12.604	2025-11-20 08:01:29.123	teacher	production	\N	219	5
1368	\N	32	ខេង​ វ៉ាន់ឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:16:15.911	2025-11-20 08:03:12.028	teacher	production	\N	5703	4
1380	\N	32	ផៃ​ ម៉ាណែត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:20:34.515	2025-11-20 14:10:59.013	teacher	production	\N	5720	4
2191	\N	32	ថុន​ វណ្ណថេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:37:57.944	2025-11-20 14:22:48.905	teacher	production	\N	5710	4
2222	\N	32	វ៉ន​ ស្រីវ៉ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:48:53.619	2025-11-20 14:36:25.856	teacher	production	\N	5734	4
1387	\N	16	ឌីណា វិភព	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-20 07:25:11.556	2025-11-21 02:13:11.859	teacher	production	\N	575	4
1386	\N	16	ខីម ម្នោរា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-20 07:23:47.638	2025-11-21 02:13:52.797	teacher	production	\N	539	4
911	\N	18	លីណា​ រ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	59	f	f	\N	2025-11-19 01:04:41.287	2025-11-20 08:05:06.048	teacher	production	\N	157	4
1485	\N	15	ហឿត ស្រីហ៊ួ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 08:03:42.712	2025-11-21 06:54:26.026	teacher	production	\N	99	4
1522	\N	6	បូរ ចន្ទមីនា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:19:31.831	2025-11-20 08:24:44.931	teacher	production	\N	2045	4
1429	\N	6	វីរះ ដានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 07:48:47.533	2025-11-20 08:34:03.291	teacher	production	\N	2072	4
1435	\N	6	ឌឿន ម៉ាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 07:50:19.96	2025-11-20 08:37:09.144	teacher	production	\N	2177	4
1570	\N	9	ង៉ែត ស្រីពៅ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	38	f	f	\N	2025-11-20 08:38:05.986	2025-11-20 08:39:38.992	teacher	archived	\N	036	5
1566	\N	9	ឡុង សៀវលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	44	f	f	\N	2025-11-20 08:36:10.43	2025-11-20 08:39:56.189	teacher	archived	\N	026	4
1560	\N	9	ង៉ែត ស្រីពៅ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	38	f	f	\N	2025-11-20 08:33:56.192	2025-11-20 08:40:06.564	teacher	archived	\N	014	5
1473	\N	12	ផល សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 07:59:27.614	2025-11-20 11:35:18.388	teacher	production	\N	47	5
1506	\N	12	ថា ម៉ាណុប	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:13:13.97	2025-11-20 11:48:17.431	teacher	production	\N	48	5
1565	\N	12	សារ៉ាន វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:35:29.075	2025-11-20 11:50:14.888	teacher	production	\N	69	5
1573	\N	12	ម៉េង សុខបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:38:23.689	2025-11-20 12:09:08.298	teacher	production	\N	73	5
1567	\N	12	ចេប ស៊ូលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:36:23.958	2025-11-20 12:11:54.775	teacher	production	\N	70	5
1558	\N	12	ម៉ូ ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:33:39.631	2025-11-20 12:20:07.286	teacher	production	\N	67	5
1554	\N	12	វ៉ាន់ ស្រីនុន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:31:12.733	2025-11-20 12:23:06.81	teacher	production	\N	64	5
1552	\N	12	នីម រដ្ឋា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:30:25.161	2025-11-20 12:24:35.284	teacher	production	\N	63	5
1545	\N	12	វ៉ិត បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:28:54.617	2025-11-20 12:27:49.881	teacher	production	\N	61	5
1388	\N	12	មិនា ម៉ាន់នូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:25:15.859	2025-11-20 12:28:45.273	teacher	production	\N	66	4
1362	\N	12	ផល សុណេម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:14:12.401	2025-11-20 12:32:09.886	teacher	production	\N	44	4
1359	\N	12	សំរិត បុប្ផាលីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:13:39.947	2025-11-20 12:33:39.984	teacher	production	\N	43	4
1515	\N	12	ថៃ ស្រីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:16:38.964	2025-11-20 12:34:03.11	teacher	production	\N	50	5
1524	\N	12	ទិត្យ សុនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:20:26.831	2025-11-20 12:39:00.314	teacher	production	\N	53	5
1521	\N	12	នុយ ស្រីនីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:19:19.049	2025-11-20 12:40:46.925	teacher	production	\N	52	5
1358	\N	12	ម៉ុន សូលីដែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:12:57.866	2025-11-20 12:41:00.542	teacher	production	\N	42	4
1518	\N	12	ជាង ច័ន្ទដារាបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:18:17.487	2025-11-20 12:42:21.155	teacher	production	\N	51	5
1354	\N	12	នៀង ចន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:12:19.051	2025-11-20 12:45:07.575	teacher	production	\N	41	4
1353	\N	12	គូ សុខគីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:11:45.813	2025-11-20 12:46:27.431	teacher	production	\N	40	4
1352	\N	12	ជាន លីម៉ុងហ៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:11:11.274	2025-11-20 12:51:44.879	teacher	production	\N	39	4
2124	\N	7	រ៉ា ម៉េងឈុន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:02:08.23	2025-11-20 13:02:49.057	teacher	production	\N	6428	4
1586	\N	12	ហ៊ុន ហ្វីលីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:42:29.234	2025-11-20 12:03:16.354	teacher	production	\N	77	5
2150	\N	7	អ៊ុំ ផានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:11:07.406	2025-11-20 13:11:30.833	teacher	production	\N	6395	4
1309	\N	12	សុង សុផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:57:58.53	2025-11-20 13:12:50.118	teacher	production	\N	25	4
2048	\N	8	ថា ស៊ាវឈិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:23:56.193	2025-11-20 13:22:19.101	teacher	production	\N	5851	4
2176	\N	7	ប្រុស ចាន់រ៉េត	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:22:14.681	2025-11-20 13:22:59.06	teacher	production	\N	6070	4
2046	\N	8	ឌីម៉ង់ គឹមហ៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:23:11.716	2025-11-20 13:23:06.812	teacher	production	\N	5820	4
2194	\N	31	ប៊ុនហ៊ាន វិសា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:38:59.256	2025-11-20 14:06:28.776	teacher	production	\N	123128	5
2201	\N	31	ពៅ ថាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:41:28.194	2025-11-20 14:12:44.444	teacher	production	\N	123131	5
2223	\N	31	លុច ​សិលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:48:54.045	2025-11-20 14:22:33.067	teacher	production	\N	123139	5
2193	\N	32	ធា​ សុខចាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:38:49.636	2025-11-20 14:24:36.273	teacher	production	\N	5712	4
2195	\N	32	ប៊ុនណា​ ដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:39:46.13	2025-11-20 14:25:28.469	teacher	production	\N	5714	4
2295	\N	24	ខន សុខឡេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:30:08.553	2025-11-20 14:31:04.479	teacher	production	\N	2648	5
2225	\N	32	សាន​ ពិសី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:49:18.077	2025-11-20 14:36:57.997	teacher	production	\N	5735	4
2310	\N	28	ស្រេង ម៉េងល័ក្ខ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:34:53.445	2025-11-20 14:51:38.177	teacher	production	\N	20 54	5
2358	\N	24	ពឹម រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:02:40.429	2025-11-20 15:03:19.941	teacher	production	\N	2805	5
2297	\N	28	ផារ៉ា លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:30:54.17	2025-11-20 15:03:20.035	teacher	production	\N	20 48	5
2324	\N	14	សំបូរ ស្រីឡៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:41:17.749	2025-11-20 15:11:41.839	teacher	production	\N	២៦០៤១៥៣	4
2378	\N	24	ថាក់ ស្រីឈីង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:13:25.051	2025-11-20 15:14:08.276	teacher	production	\N	2700	5
2248	\N	14	ធាង ប៊ុនថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:58:36.405	2025-11-20 15:40:45.75	teacher	production	\N	២៦០៤១៣៦	4
2408	\N	31	នឿន សោភ័ណ្ឌ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:56:42.172	2025-11-21 00:02:48.285	teacher	production	\N	123161	4
2411	\N	31	ប៊ុល សំបូរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:58:25.404	2025-11-21 00:03:59.07	teacher	production	\N	123162	4
2412	\N	31	ផល្លា សុខគា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:59:11.356	2025-11-21 00:05:05.194	teacher	production	\N	123163	4
2413	\N	31	ពិសី រីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:59:54.334	2025-11-21 00:06:01.655	teacher	production	\N	123164	4
2379	\N	32	ភាក់​ ផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:13:55.509	2025-11-21 00:35:22.506	teacher	production	\N	5563	5
2518	\N	6	នៅ ស៊ីនឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:59:49.114	2025-11-21 01:00:39.948	teacher	production	\N	2165	4
2571	\N	6	ហ៊ុយ សៀវហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:09:26.846	2025-11-21 01:10:15.188	teacher	production	\N	2166	5
2586	\N	6	ធី យូប៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:11:52.807	2025-11-21 01:12:37.495	teacher	production	\N	2179	4
2572	\N	8	កែវ អេន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	34	f	f	\N	2025-11-21 01:09:29.547	2025-11-21 01:16:41.605	teacher	archived	\N	60221	5
2576	\N	8	កែវ វុទ្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	34	f	f	\N	2025-11-21 01:10:15.139	2025-11-21 01:16:59.602	teacher	archived	\N	56602	5
2588	\N	10	ហ៊ុត លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:12:07.875	2025-11-21 01:27:21.667	teacher	production	\N	3032	5
2579	\N	10	សារី លីហ្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:10:57.675	2025-11-21 01:29:31.657	teacher	production	\N	3029	5
2574	\N	10	សម្ផស្ស ម៉ីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:10:07.806	2025-11-21 01:30:15.452	teacher	production	\N	3028	5
2573	\N	10	វិត លក្ខណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:09:38.205	2025-11-21 01:30:52.155	teacher	production	\N	3027	5
2562	\N	10	រ៉ាត់ សុជាតិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:08:06.253	2025-11-21 01:34:20.281	teacher	production	\N	3023	5
2550	\N	10	ម៉ាប់ ចន្ធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:04:47.564	2025-11-21 01:34:32.474	teacher	production	\N	3015	5
2560	\N	10	រ៉ា ដេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:07:41.995	2025-11-21 01:35:46.312	teacher	production	\N	3022	5
2546	\N	10	ធឿន ស្រីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:03:42.143	2025-11-21 01:37:06.685	teacher	production	\N	3012	5
2595	\N	28	យ៉ុល ស៊ាងហៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:13:18.279	2025-11-21 01:39:11.366	teacher	production	\N	20 30	4
2526	\N	10	ជា ស្រីឡាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:00:32.182	2025-11-21 01:39:43.263	teacher	production	\N	2009	5
2587	\N	28	ងួន វី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:12:03.389	2025-11-21 01:41:00.241	teacher	production	\N	20 28	4
2517	\N	10	ឃឿន ដាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:59:43.106	2025-11-21 01:41:46.498	teacher	production	\N	2007	5
2578	\N	28	ធឿន គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:10:30.734	2025-11-21 01:42:52.797	teacher	production	\N	20 26	4
2504	\N	10	ខន ថាវរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:57:46.502	2025-11-21 01:44:59.626	teacher	production	\N	2003	5
2460	\N	28	ឈុន សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 00:48:49.314	2025-11-21 01:46:42.373	teacher	production	\N	2023	4
2177	\N	1	សុបិន្ត​ រុងរឿង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:22:45.769	2025-11-21 04:05:10.562	teacher	archived	\N	2483	4
2175	\N	1	ផាន ផារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:22:07.072	2025-11-21 04:05:23.45	teacher	archived	\N	2482	4
2616	\N	13	មាន វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:20:07.494	2025-11-21 06:07:27.084	teacher	production	\N	7484	5
2561	\N	13	ប៊ុនថា សុវណ្ណចិន្ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:07:53.336	2025-11-21 06:21:19.272	teacher	production	\N	5087	5
2489	\N	13	ត្រា ចាន់ឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:56:03.149	2025-11-21 06:25:50.777	teacher	production	\N	8777	5
2260	\N	15	នាយ ហាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:09:34.615	2025-11-21 06:32:32.401	teacher	production	\N	1122	4
2224	\N	15	កាន់ វណ្ណី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 13:49:02.62	2025-11-21 06:51:18.278	teacher	production	\N	1112	4
1575	\N	9	ចាន់ ចេម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	38	f	f	\N	2025-11-20 08:38:36.544	2025-11-20 08:39:34.551	teacher	archived	\N	037	5
1576	\N	9	នី រតន:	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	44	f	f	\N	2025-11-20 08:38:48.885	2025-11-20 08:39:45.919	teacher	archived	\N	011	4
1599	\N	6	ឌី សីហា 	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:43:39.466	2025-11-20 08:44:35.457	teacher	production	\N	2094	4
1596	\N	6	វាសនា ឌីណា 	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:43:03.968	2025-11-20 08:45:36.197	teacher	production	\N	2093	4
2512	\N	10	ឆាយ ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:59:21.099	2025-11-21 01:41:29.046	teacher	production	\N	2006	5
1598	\N	12	សុផានី រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:43:37.271	2025-11-20 12:01:58.077	teacher	production	\N	79	5
1579	\N	12	ហាប់ ស្រីដាវ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:40:02.656	2025-11-20 12:06:05.961	teacher	production	\N	75	5
1578	\N	12	ពៅ សុំឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:39:20.536	2025-11-20 12:07:26.795	teacher	production	\N	74	5
2131	\N	7	ឃន ស៊ីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:04:10.232	2025-11-20 13:04:40.03	teacher	production	\N	6117	4
2155	\N	7	សុផាន់ឡី លីហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:13:38.304	2025-11-20 13:13:59.275	teacher	production	\N	6031	4
2031	\N	8	គង់ វីរឆាត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:16:46.408	2025-11-20 13:25:47.565	teacher	production	\N	57831	4
1601	\N	8	ជាតិ ឧត្តរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:43:52.87	2025-11-20 14:03:32.726	teacher	production	\N	5682	5
1580	\N	8	កែវ អេន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:40:49.283	2025-11-20 14:04:56.179	teacher	production	\N	6022	5
2259	\N	24	ប៉ូ សុខខេង	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:09:30.63	2025-11-20 14:10:22.575	teacher	production	\N	2715	5
2199	\N	31	ពែក តាំងអ៊័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:40:47.956	2025-11-20 14:11:28.481	teacher	production	\N	1231230	5
2226	\N	31	វ៉ា ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:49:50.377	2025-11-20 14:23:38.88	teacher	production	\N	123140	5
2198	\N	32	ផល​ ផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:40:24.723	2025-11-20 14:27:10.753	teacher	production	\N	5716	4
2312	\N	24	សុខ សុមនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:35:31.123	2025-11-20 14:36:14.831	teacher	production	\N	2817	5
2227	\N	32	សារ៉ា​ វន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:50:01.792	2025-11-20 14:38:26.849	teacher	production	\N	5736	4
2311	\N	28	ហន សុខលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:35:18.899	2025-11-20 14:40:01.716	teacher	production	\N	20 55	5
2331	\N	24	នូ ធីពេញ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:45:22.985	2025-11-20 14:46:17.177	teacher	production	\N	2681	5
2280	\N	28	ចាន់ ត្រ័យលក្ខណ៍	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:23:15.846	2025-11-20 14:52:48.539	teacher	production	\N	20 38	5
2345	\N	24	គឹម បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:54:45.151	2025-11-20 14:55:44.652	teacher	production	\N	2655	5
2298	\N	28	ពីន រដ្ឋាវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:31:38.034	2025-11-20 15:02:23.23	teacher	production	\N	20 49	5
2365	\N	24	សៀង ឡាវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:06:06.663	2025-11-20 15:06:40.295	teacher	production	\N	2755	5
2332	\N	14	ឡុក សំណាង	\N	other	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:45:36.764	2025-11-20 15:07:02.59	teacher	production	\N	២៦០៤១៥៦	4
2381	\N	24	ស្រ៊ុន ថុនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:15:22.702	2025-11-20 15:16:12.513	teacher	production	\N	2756	5
2346	\N	32	គុយ​ ចន្ទ្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:54:53.291	2025-11-20 15:31:47.287	teacher	production	\N	5542	5
2360	\N	32	តុលា​ ស្រីមុំ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:03:33.608	2025-11-20 15:42:15.834	teacher	production	\N	5551	5
2361	\N	32	ថន​ ផានុ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:04:10.29	2025-11-20 15:42:49.12	teacher	production	\N	5552	5
2414	\N	31	យ៉ូន ស៊ូអ៉ើរ័	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:07:49.921	2025-11-21 00:06:56.784	teacher	production	\N	123165	4
2415	\N	31	រឿន ឆេងគាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:08:44.49	2025-11-21 00:08:00.895	teacher	production	\N	123166	4
2416	\N	31	លន់ គីមល័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:09:30.583	2025-11-21 00:09:10.539	teacher	production	\N	123167	4
2417	\N	31	លាប លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:10:31.866	2025-11-21 00:10:10.368	teacher	production	\N	123168	4
2380	\N	32	ភាព​ ផាន់នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:15:16.871	2025-11-21 00:36:27.79	teacher	production	\N	5580	5
2382	\N	32	ភាព​ លីនដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:15:50.958	2025-11-21 00:37:44.92	teacher	production	\N	5564	5
2463	\N	6	វ៉ាន់ វ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:49:09.335	2025-11-21 00:50:31.335	teacher	production	\N	2157	5
2503	\N	6	សាន សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:57:45.584	2025-11-21 00:58:27.737	teacher	production	\N	2198	4
2510	\N	6	សុឃឿន វ៉ាន់ខេម	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:58:08.973	2025-11-21 00:58:53.049	teacher	production	\N	2123	4
2515	\N	6	ឡូតូ ភារុណ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:59:37.924	2025-11-21 01:00:51.086	teacher	production	\N	2064	4
2522	\N	10	ស៊ឹម សាលីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:00:08.481	2025-11-21 01:18:09.912	teacher	production	\N	3100	4
2462	\N	10	ឆោម ចាន់ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:48:56.445	2025-11-21 01:30:22.562	teacher	production	\N	4	4
2549	\N	10	ភី សុផាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:04:23.686	2025-11-21 01:35:12.138	teacher	production	\N	3014	5
2548	\N	10	ផន ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:04:02.893	2025-11-21 01:36:09.291	teacher	production	\N	3013	5
2521	\N	10	ឆេន ឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:00:05.692	2025-11-21 01:40:44.582	teacher	production	\N	2008	5
1581	\N	6	វឿង ជីវ័ន 	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:41:02.877	2025-11-21 01:40:53.132	teacher	production	\N	2089	4
2511	\N	10	ង៉ោក សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:58:31.69	2025-11-21 01:42:06.837	teacher	production	\N	2005	5
2159	\N	1	សុខ កានដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:15:07.05	2025-11-21 04:05:40.866	teacher	archived	\N	1278	4
2160	\N	1	សូរ​ អេលីយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:15:43.862	2025-11-21 04:05:47.198	teacher	archived	\N	1271	4
2154	\N	1	សាត​ គុណវឌ្ឍន៍	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:13:14.47	2025-11-21 04:05:50.113	teacher	archived	\N	1230	4
2281	\N	15	អួន វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:23:27.336	2025-11-21 06:01:47.444	teacher	production	\N	1135	4
2274	\N	15	ហ៊ាង ស្រីណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:20:50.543	2025-11-21 06:07:12.398	teacher	production	\N	1133	4
2267	\N	15	រ៉ុង ដារ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:14:29.016	2025-11-21 06:20:19.458	teacher	production	\N	1126	4
2250	\N	15	ប្រុស វ៉ាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:00:19.092	2025-11-21 06:42:48.188	teacher	production	\N	1117	4
1679	\N	8	វ៉ិត មួយជិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:11:06.558	2025-11-20 13:38:37.769	teacher	production	\N	5824	4
1677	\N	8	រី សារ៉ាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:10:23.992	2025-11-20 13:39:17.434	teacher	production	\N	5821	4
1675	\N	8	ពិសិដ្ឋ ស៊ូហ្សាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:09:53.875	2025-11-20 13:39:52.119	teacher	production	\N	5823	4
1674	\N	8	ជុំ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:09:07.253	2025-11-20 13:40:33.443	teacher	production	\N	5845	4
1673	\N	8	ចន្ថា លីហួ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:08:30.398	2025-11-20 13:41:15.106	teacher	production	\N	5783	4
1672	\N	8	អែល ណាហ្វី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:07:49.442	2025-11-20 13:43:18.726	teacher	production	\N	5934	5
1670	\N	8	ហេន ជូប៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:07:04.433	2025-11-20 13:44:08.695	teacher	production	\N	5692	5
1584	\N	26	ខុំ រីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:42:23.963	2025-11-20 08:43:08.056	teacher	production	\N	2400	5
1655	\N	8	ហៀន សុផាដារិន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:59:29.169	2025-11-20 13:45:00.486	teacher	production	\N	5632	5
1602	\N	26	ខឿន ចំបុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:44:05.784	2025-11-20 08:44:39.618	teacher	production	\N	2410	5
1653	\N	8	ហាក់ពេជ្រ លីស៊ីងយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:58:45.307	2025-11-20 13:52:30.539	teacher	production	\N	5648	5
1649	\N	8	សំបូរ រ៉ាឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:57:33.445	2025-11-20 13:56:18.321	teacher	production	\N	5630	5
1654	\N	12	ហង់ ស៊ីធាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:58:57.103	2025-11-20 11:18:21.908	teacher	production	\N	98	5
1647	\N	8	ស្រេង ហេងលាភ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:56:52.569	2025-11-20 13:59:54.488	teacher	production	\N	5684	5
1605	\N	26	ជេន សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:45:51.959	2025-11-20 08:46:44.283	teacher	production	\N	2460	5
1642	\N	8	សាវណ្ណ ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:55:52.779	2025-11-20 14:00:51.227	teacher	production	\N	5866	5
907	\N	20	ធា ធូហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:02:39.036	2025-11-20 08:47:30.08	teacher	production	\N	០១៥	4
1635	\N	8	វេត ម៉ាត់តាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:53:49.847	2025-11-20 14:01:50.772	teacher	production	\N	5636	5
1610	\N	26	ថន ចាន់ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:47:37.031	2025-11-20 08:48:16.645	teacher	production	\N	2470	5
1613	\N	8	រដ្ឋណា ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:48:27.785	2025-11-20 14:02:46.534	teacher	production	\N	6330	5
1616	\N	26	ណំ សុខណាំ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:49:17.351	2025-11-20 08:49:49.709	teacher	production	\N	2490	5
1587	\N	8	កែវ វុទ្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 08:42:28.981	2025-11-20 14:04:23.953	teacher	production	\N	5660	5
1583	\N	6	វឿង ជីវីន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:41:48.73	2025-11-20 08:51:33.85	teacher	production	\N	2090	4
1626	\N	26	ណាត នឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:52:24.297	2025-11-20 08:52:56.521	teacher	production	\N	2510	5
1629	\N	6	រ៉ង សារ៉ុម	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-20 08:52:46.839	2025-11-20 08:53:37.786	teacher	production	\N	2188	4
1636	\N	26	ប៊ុនថន រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:53:50.412	2025-11-20 08:54:31.53	teacher	production	\N	2530	5
1633	\N	11	ត្រហៀត ហៃយ៉ាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:53:33.293	2025-11-20 08:55:31.022	teacher	production	\N	2340	4
1640	\N	26	បឿន សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:55:21.637	2025-11-20 08:55:53.339	teacher	production	\N	2540	5
1645	\N	26	លាប លីលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:56:35.457	2025-11-20 08:57:16.669	teacher	production	\N	2590	5
1652	\N	26	វ៉ាន់ថា ពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:58:16.01	2025-11-20 08:59:00.448	teacher	production	\N	2600	5
1657	\N	26	វឿន រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 08:59:48.158	2025-11-20 09:00:25.87	teacher	production	\N	2610	5
1650	\N	11	ភ័ក្រ្ត ស្រីរៀម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:58:10.722	2025-11-20 09:01:08.998	teacher	production	\N	2305	4
927	\N	20	សិទ្ធី ណាអុីន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	81	f	f	\N	2025-11-19 01:13:06.786	2025-11-20 09:01:49.675	teacher	production	\N	០៣៤	4
1661	\N	26	ស្រៀន ម៉េងស្រ៊ីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 09:01:43.427	2025-11-20 09:02:12.653	teacher	production	\N	2640	5
1664	\N	26	សាន ភារិន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 09:02:57.582	2025-11-20 09:03:34.334	teacher	production	\N	2650	5
1668	\N	26	សុង ស្រីណាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 09:04:37.841	2025-11-20 09:05:18.733	teacher	production	\N	2660	5
1669	\N	26	សែន ផាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 09:06:09.036	2025-11-20 09:06:51.978	teacher	production	\N	2670	5
1671	\N	26	ហេង វត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	82	f	f	\N	2025-11-20 09:07:29.978	2025-11-20 09:08:03.586	teacher	production	\N	2690	5
1211	\N	12	ផុន ស្រីនុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:27:30.724	2025-11-20 09:09:10.824	teacher	production	\N	02	4
1682	\N	11	រស់ វីរៈសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:11:43.891	2025-11-20 09:14:57.139	teacher	production	\N	2309	4
1667	\N	12	វិន ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 09:04:03.285	2025-11-20 09:15:46.063	teacher	production	\N	132	5
1665	\N	12	គឹម ចិន្ដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 09:02:57.854	2025-11-20 09:17:18.609	teacher	production	\N	123	5
1651	\N	12	សឿម សាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:58:11.808	2025-11-20 11:20:16.672	teacher	production	\N	97	5
1648	\N	12	យី ស្រីរ៉េន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:57:33.478	2025-11-20 11:23:07.109	teacher	production	\N	96	5
1646	\N	12	ស៊ីណា កក្ដដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:56:45.905	2025-11-20 11:26:32.56	teacher	production	\N	95	5
1641	\N	12	ធារ៉ា ផារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:55:22.082	2025-11-20 11:28:34.131	teacher	production	\N	92	5
1637	\N	12	សាយ សៅវីរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:54:07.523	2025-11-20 11:32:01.769	teacher	production	\N	91	5
1618	\N	12	ណៃ ស្រីនីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:50:53.474	2025-11-20 11:38:16.551	teacher	production	\N	88	5
1617	\N	12	នីម ស្រីម៉ុច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:49:58.234	2025-11-20 11:46:44.818	teacher	production	\N	87	5
1615	\N	12	ពួន ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:49:06.049	2025-11-20 11:52:30.628	teacher	production	\N	86	5
1612	\N	12	ម៉ៃ ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:48:14.718	2025-11-20 11:57:08.941	teacher	production	\N	85	5
1609	\N	12	សល់ លីលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:47:07.756	2025-11-20 11:58:38.88	teacher	production	\N	83	5
1606	\N	12	ហឿន ស៊ីថា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:46:05.63	2025-11-20 12:00:20.076	teacher	production	\N	81	5
1687	\N	8	សុះ ម៉ានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:14:04.794	2025-11-20 13:34:47.741	teacher	production	\N	5867	4
1678	\N	26	កឹម ម៉េងអុឺ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:10:51.874	2025-11-20 09:11:26.43	teacher	production	\N	1690	4
1686	\N	8	សុខៈ លីឈីង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:13:27.734	2025-11-20 13:35:30.859	teacher	production	\N	5833	4
1684	\N	26	ខយ ជីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:12:21.578	2025-11-20 09:13:42.483	teacher	production	\N	1710	4
1685	\N	8	សល់ សុខហ្សារីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:12:38.631	2025-11-20 13:36:25.222	teacher	production	\N	5814	4
1688	\N	26	ខី សុខឃីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:14:41.155	2025-11-20 09:17:57.466	teacher	production	\N	1720	4
1696	\N	26	ខុំ កុលពេជ្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:18:58.828	2025-11-20 09:19:38.51	teacher	production	\N	1730	4
1700	\N	26	ខេន ស្រីលាក់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:20:58.881	2025-11-20 09:21:41.516	teacher	production	\N	1750	4
1683	\N	8	វិន សៀវមិន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:11:48.462	2025-11-20 13:37:48.759	teacher	production	\N	6097	4
1745	\N	27	អាត ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:38:22.958	2025-11-21 07:12:37.398	teacher	production	\N	254033	5
1705	\N	26	ខែម លក្ខិណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:22:16.683	2025-11-20 09:22:52.025	teacher	production	\N	1760	4
1706	\N	11	ចាន់ ស៊ូជី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:22:22.975	2025-11-20 09:23:36.094	teacher	production	\N	2341	4
1709	\N	26	ចន សុខឌីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:23:47.192	2025-11-20 09:24:24.637	teacher	production	\N	1770	4
1690	\N	27	គីមឡុង ម៉ីអុីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:15:02.397	2025-11-21 07:13:36.916	teacher	production	\N	254002	5
1712	\N	26	ចិន សុខមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:25:08.824	2025-11-20 09:26:04.71	teacher	production	\N	1780	4
1691	\N	27	គ្រី កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:16:23.418	2025-11-21 07:14:24.306	teacher	production	\N	254004	5
1693	\N	27	ចំរើន បញ្ញចក្ររុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:17:07.955	2025-11-21 07:15:20.654	teacher	production	\N	254005	5
1720	\N	26	ណំ សុខណាន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:26:58.781	2025-11-20 09:28:05.541	teacher	production	\N	1810	4
1718	\N	11	ស៊ីថា រ៉ាមីលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:26:27.331	2025-11-20 09:28:36.785	teacher	production	\N	23244	4
1723	\N	26	ធុច ស្រីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:28:46.615	2025-11-20 09:29:23.68	teacher	production	\N	1820	4
1726	\N	26	នាង រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:30:03.349	2025-11-20 09:31:15.212	teacher	production	\N	1830	4
1694	\N	27	ឆៃ ឈូអុីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:17:51.809	2025-11-21 07:16:41.324	teacher	production	\N	254006	5
1695	\N	27	ដន ម៉ូនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:18:38.475	2025-11-21 07:17:35.282	teacher	production	\N	255009	5
1728	\N	11	សុខា នេម៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:30:31.288	2025-11-20 09:32:18.084	teacher	production	\N	2342	4
1732	\N	26	នាន់ សាវីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	62	f	f	\N	2025-11-20 09:32:12.382	2025-11-20 09:33:27.559	teacher	archived	\N	18400	4
1736	\N	26	លាភ នីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:34:05.377	2025-11-20 09:34:37.592	teacher	production	\N	1850	4
1735	\N	11	សុធា បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:34:03.492	2025-11-20 09:35:32.657	teacher	production	\N	2349	4
1739	\N	26	នីន រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:35:33.815	2025-11-20 09:36:08.569	teacher	production	\N	1860	4
1743	\N	26	បាន ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:37:12.843	2025-11-20 09:37:56.989	teacher	production	\N	1880	4
1697	\N	27	ឌី សៀកម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:19:21.179	2025-11-21 07:18:21.209	teacher	production	\N	254068	5
1698	\N	27	តាំង ម៉េងអ៊ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:20:10.342	2025-11-21 07:19:04.851	teacher	production	\N	254010	5
1701	\N	27	ភី អច្ចរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:21:26.3	2025-11-21 07:21:00.976	teacher	production	\N	254014	5
1703	\N	27	មាន ថៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:21:59.3	2025-11-21 07:21:50.753	teacher	production	\N	254015	5
1707	\N	27	មុំ រិទ្ធិមាន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:22:57.933	2025-11-21 07:22:37.47	teacher	production	\N	254016	5
1708	\N	27	យ៉ាន ស្រីម៉ាច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:23:44.722	2025-11-21 07:23:22.371	teacher	production	\N	254017	5
1710	\N	27	យី សុមនោ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:24:26.471	2025-11-21 07:24:09.463	teacher	production	\N	254018	5
1711	\N	27	រ៉ាន់ រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:25:02.865	2025-11-21 07:24:50.528	teacher	production	\N	254019	5
1713	\N	27	រ៉ាន់ សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:25:31.822	2025-11-21 07:25:32.545	teacher	production	\N	254020	5
1715	\N	27	លី លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:26:06.064	2025-11-21 07:26:32.043	teacher	production	\N	254021	5
1719	\N	27	វណ្ណ គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:26:40.914	2025-11-21 07:27:11.966	teacher	production	\N	254022	5
1722	\N	27	ស៊ាន់ សៀវមុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:28:12.528	2025-11-21 07:29:32.556	teacher	production	\N	254024	5
1724	\N	27	សាន គីមហ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:29:07.013	2025-11-21 07:30:16.327	teacher	production	\N	255025	5
1725	\N	27	សុខ ចាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:29:38.207	2025-11-21 07:30:55.391	teacher	production	\N	254026	5
1727	\N	27	សុគន្ធ រត្ន័នា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:30:14.022	2025-11-21 07:32:07.462	teacher	production	\N	254027	5
1729	\N	27	សុធា សំអាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:31:16.465	2025-11-21 07:32:47.75	teacher	production	\N	254058	5
1731	\N	27	សឿន ប៊ុនសាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:31:59.747	2025-11-21 07:33:23.817	teacher	production	\N	254028	5
1733	\N	27	សឿន សុភារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:32:40.575	2025-11-21 07:34:11.867	teacher	production	\N	255028	5
1734	\N	27	សៀក ប៉េងស៊ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:33:18.433	2025-11-21 07:34:56.92	teacher	production	\N	255029	5
1738	\N	27	សៅ វណ្ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:34:55.273	2025-11-21 07:36:31.823	teacher	production	\N	254030	5
1740	\N	27	ហ៊ាន់ ម៉េងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:35:39.028	2025-11-21 07:37:10.419	teacher	production	\N	255031	5
1741	\N	27	ហេង ពុទ្ធិចន្ទ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:36:14.554	2025-11-21 07:37:43.19	teacher	production	\N	254031	5
1742	\N	27	ហំ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:36:51.247	2025-11-21 07:38:26.877	teacher	production	\N	254065	5
1744	\N	27	ឡេង ស្រីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:37:49.433	2025-11-21 07:39:11.564	teacher	production	\N	254032	5
1746	\N	11	សឿត ឫទ្ធីគីរី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:38:32.934	2025-11-20 09:40:43.278	teacher	production	\N	2326	4
1748	\N	26	ផល្លា ថាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:39:45.285	2025-11-20 09:40:43.814	teacher	production	\N	1920	4
1749	\N	4	ខាយ ស្រីខួច	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:41:07.881	2025-11-20 09:42:28.893	teacher	production	\N	739789	5
1750	\N	26	ផល់ មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:41:51.231	2025-11-20 09:42:36.233	teacher	production	\N	1930	4
1753	\N	26	ផូ រតន:	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:43:31.181	2025-11-20 09:44:15.748	teacher	production	\N	1940	4
1752	\N	4	គឿន មុទិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:43:18.344	2025-11-20 09:44:18.548	teacher	production	\N	557105	5
1751	\N	11	សេង ចាន់នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:42:33.366	2025-11-20 09:44:28.98	teacher	production	\N	2380	4
1821	\N	9	ផល សុផាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:07:02.963	2025-11-21 05:01:21.053	teacher	production	\N	054	5
1820	\N	9	ផល ផាន់ឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:06:31.888	2025-11-21 05:01:47.513	teacher	production	\N	055	5
1815	\N	9	ធី ដាណារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:05:36.153	2025-11-21 05:02:19.133	teacher	production	\N	056	5
1756	\N	4	ឃាង កញ្ញនា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:45:34.458	2025-11-20 09:46:28.274	teacher	production	\N	382576	5
1760	\N	26	ពៅ មិនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:46:39.938	2025-11-20 09:47:06.846	teacher	production	\N	1960	4
1759	\N	11	សំអាត វត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:46:19.566	2025-11-20 09:48:28.969	teacher	production	\N	2346	4
1761	\N	26	ភាព រ៉ូហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:47:55.458	2025-11-20 09:48:31.208	teacher	production	\N	1980	4
1763	\N	26	ភ័ណ្ឌ នីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:49:32.248	2025-11-20 09:50:13.633	teacher	production	\N	1990	4
1762	\N	4	ចន្ធី ជីវ័ន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:48:08.131	2025-11-20 09:50:16.793	teacher	production	\N	525712	5
1810	\N	9	តាន់ មុយឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:05:04.445	2025-11-21 05:02:49.427	teacher	production	\N	058	5
1764	\N	11	សំអឿន រីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:49:39.706	2025-11-20 09:51:20.098	teacher	production	\N	2363	4
1766	\N	26	ម៉ម ចៃឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:51:13.303	2025-11-20 09:51:55.278	teacher	production	\N	20000	4
1767	\N	4	ចេង សុខរក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:51:24.38	2025-11-20 09:52:21.901	teacher	production	\N	803686	5
1770	\N	26	រដ្ធា រ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:53:00.153	2025-11-20 09:53:39.686	teacher	production	\N	2010	4
1772	\N	4	ចោម រដ្ឋា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:54:08.15	2025-11-20 09:54:56.455	teacher	production	\N	804359	5
1773	\N	26	រ៉ា ភារុណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:54:24.211	2025-11-20 09:55:02.314	teacher	production	\N	2020	4
1768	\N	11	ហឿត រដ្ឋថន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:52:37.839	2025-11-20 09:55:09.208	teacher	production	\N	2358	4
1807	\N	9	ចិន្ដា ដាឡាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:04:37.98	2025-11-21 05:03:29.016	teacher	production	\N	059	5
1801	\N	9	ចាន់ ចេម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:04:02.76	2025-11-21 05:03:57.575	teacher	production	\N	060	5
1777	\N	26	វណ្ណា ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:56:11.124	2025-11-20 09:56:39.035	teacher	production	\N	20400	4
1799	\N	9	ង៉ែត ស្រីពៅ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:03:26.391	2025-11-21 05:04:25.342	teacher	production	\N	061	5
1747	\N	27	អុល ថៃសាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:38:54.498	2025-11-21 07:11:00.261	teacher	production	\N	254034	5
1778	\N	4	ឌីណា ច័ន្ទរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 09:56:21.128	2025-11-20 09:57:24.607	teacher	production	\N	600236	5
1782	\N	11	ហឿត​​ រដ្ឋថង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 09:57:21.728	2025-11-20 09:59:35.853	teacher	production	\N	2367	4
1785	\N	26	លាង ម៉េងហ៊ាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 09:59:17.518	2025-11-20 09:59:55.581	teacher	production	\N	2060	4
1789	\N	26	សល់ ស្រីពីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:00:40.608	2025-11-20 10:01:10.465	teacher	production	\N	2080	4
1791	\N	11	ឡេ វណ្ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	50	f	f	\N	2025-11-20 10:00:49.71	2025-11-20 10:02:20.582	teacher	production	\N	2245	5
1790	\N	11	ហឿត លីនណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 10:00:46.314	2025-11-20 10:02:23.216	teacher	production	\N	2331	4
1796	\N	26	សារ៉េត សៀកម៉េង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:01:54.749	2025-11-20 10:02:37.218	teacher	production	\N	20900	4
1798	\N	26	សារី លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:03:15.864	2025-11-20 10:03:42.158	teacher	production	\N	2100	4
1805	\N	26	សាអែម សុខឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:04:33.204	2025-11-20 10:05:10.066	teacher	production	\N	21100	4
1819	\N	26	សុខឃាន់ ហ្វុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:06:11.589	2025-11-20 10:06:47.051	teacher	production	\N	2120	4
1818	\N	11	រិទ្ធី ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 10:06:02.771	2025-11-20 10:07:46.327	teacher	production	\N	2013	4
1823	\N	26	សុខុម ចាន់រ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:07:32.683	2025-11-20 10:08:10.179	teacher	production	\N	2140	4
1769	\N	17	ឃុន ឈីញឈីញ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:52:53.44	2025-11-20 10:55:36.144	teacher	production	\N	221043	4
1771	\N	17	ងី សុខណាំ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:54:01.689	2025-11-20 10:57:36.221	teacher	production	\N	221085	4
1774	\N	17	ងួន សុលីហ៊្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:55:10.124	2025-11-20 10:59:20.484	teacher	production	\N	221153	4
1779	\N	17	ចិន្តា លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:56:25.685	2025-11-20 11:01:13.32	teacher	production	\N	221165	4
1783	\N	17	ថាត  ស៊ីវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:57:24.612	2025-11-20 11:04:01.946	teacher	production	\N	221047	4
1784	\N	17	ថាត ហុងឡាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:58:21.081	2025-11-20 11:05:41.085	teacher	production	\N	221046	4
1786	\N	17	ថាត លីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:59:18.334	2025-11-20 11:07:50.513	teacher	production	\N	221006	4
1787	\N	17	ទ្រី ពិសិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:00:23.915	2025-11-20 11:09:57.721	teacher	production	\N	221008	4
1794	\N	17	ធី លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:01:18.7	2025-11-20 11:11:49.409	teacher	production	\N	221116	4
1797	\N	17	ម៉េង លីឈីវ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:02:22.816	2025-11-20 11:15:57.089	teacher	production	\N	221013	4
1812	\N	17	យឿន ធារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:05:15.781	2025-11-20 11:17:49.977	teacher	production	\N	221058	4
2128	\N	7	សល់ វិចិត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:03:14.261	2025-11-20 13:03:42.744	teacher	production	\N	6299	4
1830	\N	11	ហេង គឹមហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 10:09:04.055	2025-11-20 10:10:18.659	teacher	production	\N	2324	4
1826	\N	26	សែន គីមលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	f	f	62	f	f	\N	2025-11-20 10:08:36.894	2025-11-20 10:11:12.599	teacher	archived	\N	2150	4
1832	\N	17	លីម បុណ្ណាធីរ:	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:09:27.668	2025-11-20 11:19:21.459	teacher	production	\N	221019	4
2158	\N	7	ចំរើន ណារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:14:23.382	2025-11-20 13:14:49.444	teacher	production	\N	6492	4
1561	\N	4	ឧត្តម ម៉ាយាវីន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:34:04.038	2025-11-20 13:50:02.926	teacher	production	\N	536244	4
2236	\N	32	អូន​ ផលែន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:53:22.692	2025-11-20 14:01:03.181	teacher	production	\N	5742	4
2231	\N	31	សាន លីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:51:49.056	2025-11-20 14:26:02.116	teacher	production	\N	123142	5
2235	\N	31	សុភ័ក្រ្ត ចន្ទលីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:53:00.15	2025-11-20 14:27:11.849	teacher	production	\N	123143	5
2237	\N	31	ស៊្រាង លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:53:47.563	2025-11-20 14:28:12.743	teacher	production	\N	123144	5
2200	\N	32	ផល​ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:41:03.83	2025-11-20 14:28:17.673	teacher	production	\N	5717	4
2275	\N	24	ពូជ ថៃលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:21:11.894	2025-11-20 14:29:10.505	teacher	production	\N	2695	5
2202	\N	32	ផេី​ មេត្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:41:44.914	2025-11-20 14:29:41.718	teacher	production	\N	5719	4
2204	\N	32	ពេជ្រ​ កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:42:33.643	2025-11-20 14:30:33.05	teacher	production	\N	5722	4
2299	\N	24	ភ័ស ភារម្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:32:06.421	2025-11-20 14:33:27.813	teacher	production	\N	2725	5
2278	\N	28	ង៉ា សង្ហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:22:27.414	2025-11-20 14:37:05.278	teacher	production	\N	20 37	5
2315	\N	24	ម៉ុន អេងលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:36:34.473	2025-11-20 14:37:23.157	teacher	production	\N	2732	5
2232	\N	32	ហ៊ាន​ វន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:52:01.562	2025-11-20 14:41:38.486	teacher	production	\N	5740	4
2233	\N	32	ហុង​ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:52:49.005	2025-11-20 14:42:23.407	teacher	production	\N	5741	4
2334	\N	24	ម៉ី សុបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:47:21.495	2025-11-20 14:48:18.924	teacher	production	\N	2730	5
2362	\N	24	ប៉ាវ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:04:11.6	2025-11-20 15:04:51.706	teacher	production	\N	2710	5
2333	\N	14	អុីន សុភក្រ្ត័ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:47:16.039	2025-11-20 15:05:02.692	teacher	production	\N	២៦០៤១៥៧	4
2326	\N	14	ហាន ស្រីអូន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:43:02.778	2025-11-20 15:08:40.248	teacher	production	\N	២៦០៤១៥៤	4
2314	\N	14	សម្ផស្ស ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:36:13.813	2025-11-20 15:28:23.546	teacher	production	\N	២៦០៤១៥០	4
2348	\N	32	ឃឿន​ ភីធីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:56:42.837	2025-11-20 15:33:51.205	teacher	production	\N	5541	5
2251	\N	14	ប្រុស សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:00:43.656	2025-11-20 15:38:45.728	teacher	production	\N	២៦០៤១៣៩	4
2366	\N	32	ធឿន​ សុខធា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:06:37.555	2025-11-20 15:48:07.803	teacher	production	\N	5555	5
2418	\N	31	លី ផៃលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:14:39.787	2025-11-21 00:11:17.246	teacher	production	\N	123169	4
2419	\N	31	វណ្ណា សុធារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:15:33.018	2025-11-21 00:12:14.257	teacher	production	\N	123170	4
2420	\N	31	វី ជីវ័ន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:16:15.986	2025-11-21 00:13:38.677	teacher	production	\N	123171	4
2421	\N	31	វ៉ាត ផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:17:00.462	2025-11-21 00:15:56.41	teacher	production	\N	123172	4
2383	\N	32	ភារិន​ ម៉ារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:16:40.433	2025-11-21 00:38:13.382	teacher	production	\N	5565	5
2384	\N	32	យាត​ រ៉ាយុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:17:16.287	2025-11-21 00:38:56.422	teacher	production	\N	5566	5
2385	\N	32	រដ្ឋា​ សៀវអ៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:18:09.865	2025-11-21 00:40:06.813	teacher	production	\N	5567	5
2386	\N	32	រ៉ា​ ស្រីពៅ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:18:44.698	2025-11-21 00:42:10.716	teacher	production	\N	5568	5
2440	\N	6	រុន រដ្ឋារ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:39:49.651	2025-11-21 00:42:36.017	teacher	production	\N	2178	4
2387	\N	32	រី​ ផល្លា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:19:18.394	2025-11-21 00:42:54.424	teacher	production	\N	5603	5
2388	\N	32	រឿន​ សុផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:20:51.114	2025-11-21 00:43:25.185	teacher	production	\N	5569	5
2466	\N	10	ថន ស្រីតី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:50:22.086	2025-11-21 01:28:42.746	teacher	production	\N	7	4
2465	\N	10	ឌួ ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:49:57.011	2025-11-21 01:29:14.167	teacher	production	\N	6	4
2464	\N	10	ដែន ខាងឃី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:49:25.974	2025-11-21 01:29:48.669	teacher	production	\N	5	4
2468	\N	28	ថន ប៊ុនលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 00:50:33.037	2025-11-21 01:45:34.502	teacher	production	\N	2024	4
2180	\N	13	គីម សុធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-20 13:32:34.304	2025-11-21 02:59:14.934	teacher	production	\N	8783	5
2470	\N	13	ឆារិទ្ធ សិភ័គនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:51:42.165	2025-11-21 04:27:17.207	teacher	production	\N	4647	5
1831	\N	9	លី នីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:09:09.969	2025-11-21 04:58:33.176	teacher	production	\N	050	5
1824	\N	9	រដ្ឋា កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:08:15.159	2025-11-21 04:59:47.839	teacher	production	\N	052	5
2441	\N	13	ចាន់ណា ផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:40:43.293	2025-11-21 05:31:25.152	teacher	production	\N	9635	5
2279	\N	15	ឡន ប៊ុនឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:22:43.961	2025-11-21 06:05:02.031	teacher	production	\N	1134	4
2261	\N	15	 នី ហ៊ុនជី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:10:39.214	2025-11-21 06:29:15.914	teacher	production	\N	1123	4
2475	\N	13	ឈិត វ៉ាន់ឈី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:52:24.879	2025-11-21 06:29:41.32	teacher	production	\N	4908	5
2234	\N	15	ខា បញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 13:52:54.767	2025-11-21 06:49:40.723	teacher	production	\N	1113	4
1866	\N	9	ស៊ី ឆានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:16:47.566	2025-11-21 04:48:48.669	teacher	production	\N	062	5
1862	\N	9	វី ផៃណាម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:15:55.527	2025-11-21 04:50:16.723	teacher	production	\N	038	5
1859	\N	9	អូន ស្រីអន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:15:16.967	2025-11-21 04:51:22.196	teacher	production	\N	039	5
1844	\N	26	សែន គីមលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:11:56.941	2025-11-20 10:12:38.407	teacher	production	\N	21500	4
1840	\N	11	អឿន រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 10:11:31.475	2025-11-20 10:12:40.706	teacher	production	\N	2329	4
1849	\N	26	ស្រៀន សៀកម៉េង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	62	f	f	\N	2025-11-20 10:13:11.532	2025-11-20 10:13:51.388	teacher	production	\N	2160	4
1853	\N	11	លី គីមឆេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 10:13:58.942	2025-11-20 10:15:36.805	teacher	production	\N	2360	4
1858	\N	9	ហូ មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:14:50.9	2025-11-21 04:52:14.792	teacher	production	\N	040	5
1855	\N	9	ហ៊ួត នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:14:31.373	2025-11-21 04:53:17.536	teacher	production	\N	041	5
1854	\N	9	ហ៊ាន មួយអ៉ិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:14:04.999	2025-11-21 04:53:57.937	teacher	production	\N	042	5
1847	\N	9	សុគន្ធ រដ្ឋា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:12:57.793	2025-11-21 04:55:06.717	teacher	production	\N	044	5
1590	\N	11	កឹម សក្កាឫទ្ធាពង្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	117	f	f	\N	2025-11-20 08:42:40.537	2025-11-20 10:21:36.47	teacher	production	\N	2351	4
1884	\N	24	អ៊ីម ឆេងហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:22:24.457	2025-11-20 10:22:44.963	teacher	production	\N	2662	4
1888	\N	24	ឆេន បណ្ឌិត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:23:16.815	2025-11-20 10:24:18.158	teacher	production	\N	2642	4
1839	\N	17	សំណាង ម៉ានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:11:31.461	2025-11-20 12:03:59.759	teacher	production	\N	221108	4
1845	\N	17	 ហស្ប មួយជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:12:25.132	2025-11-20 12:05:32.83	teacher	production	\N	221071	4
1850	\N	17	ហ៊ាង បញ្ញារាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:13:22.212	2025-11-20 12:07:15.289	teacher	production	\N	221031	4
1856	\N	17	ហុក លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:14:32.015	2025-11-20 12:08:36.841	teacher	production	\N	221102	4
1860	\N	17	ហួរ មន្នីវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:15:35.298	2025-11-20 12:10:00.797	teacher	production	\N	221033	4
1878	\N	17	ថារីទីប៉	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:20:24.248	2025-11-20 12:13:49.053	teacher	production	\N	211100	5
1885	\N	17	ធីម៉ានីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:22:30.312	2025-11-20 12:15:17.279	teacher	production	\N	211062	5
1889	\N	17	ស៊ីវឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:23:21.602	2025-11-20 12:16:43.681	teacher	production	\N	211202	5
1892	\N	17	សឿសេដ្ឋាវត្តី	\N	other	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:24:16.356	2025-11-20 12:17:48.403	teacher	production	\N	211033	5
1895	\N	17	ឌឿនភារម្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:25:18.122	2025-11-20 12:19:06.286	teacher	production	\N	212009	5
1846	\N	9	សុខន រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:12:27.635	2025-11-21 04:55:41.301	teacher	production	\N	045	5
1843	\N	9	សាំង សុភក្រ័ត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:11:48.603	2025-11-21 04:56:13.437	teacher	production	\N	046	5
1838	\N	9	សាយ ស្រីណេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:11:15.982	2025-11-21 04:56:44.866	teacher	production	\N	047	5
1836	\N	9	សាក់ ស្រីនិច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:10:47.128	2025-11-21 04:57:19.478	teacher	production	\N	048	5
1834	\N	9	វឿន ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:10:23.96	2025-11-21 04:58:01.876	teacher	production	\N	049	5
1828	\N	9	រ៉ា សោភ័ណ្ឌ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:08:45.095	2025-11-21 04:59:03.372	teacher	production	\N	051	5
1833	\N	9	កុម្ភៈ ជូអ៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:10:12.448	2025-11-21 05:19:42.473	teacher	production	\N	035	4
1837	\N	9	គឹម វុនចាន់ថាណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:11:15.582	2025-11-21 05:20:44.889	teacher	production	\N	034	4
1848	\N	9	គួយ ប៊ុនហាំង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:13:02.763	2025-11-21 05:22:17.025	teacher	production	\N	033	4
1852	\N	9	ចន្តា វិជ្ជា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:13:46.242	2025-11-21 05:28:57.853	teacher	production	\N	032	4
1857	\N	9	ចាន់ សុភ័ណ្ឌ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:14:48.673	2025-11-21 05:30:44.554	teacher	production	\N	031	4
1861	\N	9	ចិត្រ  ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:15:36.538	2025-11-21 05:32:53.891	teacher	production	\N	030	4
1864	\N	9	ឈឿត ចាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:16:22.352	2025-11-21 05:33:39.785	teacher	production	\N	029	4
1868	\N	9	ញ៉ឹប ចន្ថា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:17:08.761	2025-11-21 05:34:45.093	teacher	production	\N	028	4
1873	\N	9	ធួន វ៉ាន់ថេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:18:39.187	2025-11-21 05:36:09.902	teacher	production	\N	0០26	4
1874	\N	9	នី រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:19:20.206	2025-11-21 05:37:02.522	teacher	production	\N	025	4
1876	\N	9	ប៊ុន​ ណារ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:20:05.208	2025-11-21 05:37:54.729	teacher	production	\N	024	4
1879	\N	9	បុល ចន្ថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:20:37.214	2025-11-21 05:38:55.345	teacher	production	\N	023	4
1886	\N	9	ពឿន រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:22:34.044	2025-11-21 05:39:45.311	teacher	production	\N	022	4
1891	\N	9	រ៉ាយូ វីដាវ៉ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:23:29.786	2025-11-21 05:40:39.473	teacher	production	\N	021	4
1867	\N	5	ស៊ូ​ហេង​ លីហៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:16:47.596	2025-11-22 03:35:11.886	teacher	production	\N	587545	4
1869	\N	5	គឹម​ ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:17:23.461	2025-11-22 03:36:32.807	teacher	production	\N	116521	4
1877	\N	5	ធី​ មួយអ៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:20:07.721	2025-11-22 03:40:48.873	teacher	production	\N	465389	4
1880	\N	5	ជា​ រដ្ឋា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:20:38.673	2025-11-22 03:42:12.491	teacher	production	\N	367833	4
1881	\N	5	ឈឹម​ ចាន់សុវណ្ណរ៉ាវីន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:21:17.788	2025-11-22 03:45:06.14	teacher	production	\N	506406	4
1882	\N	5	ស៉ិន​ ឧត្តម	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:21:53.245	2025-11-22 03:45:42.943	teacher	production	\N	195762	4
1883	\N	5	ចិន្តា​ ចាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:22:23.657	2025-11-22 03:46:19.639	teacher	production	\N	426138	4
1887	\N	5	វេត​ ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:22:52.385	2025-11-22 03:49:09.178	teacher	production	\N	391808	4
1890	\N	5	ខឿន​ មេសា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:23:23.808	2025-11-22 03:50:27.348	teacher	production	\N	771023	4
1304	\N	12	លឿម ឆៃលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 06:56:26.182	2025-11-20 13:14:53.734	teacher	production	\N	23	4
1689	\N	8	សឿន សុវណ្ណពេជ្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 09:14:50.045	2025-11-20 13:34:09.092	teacher	production	\N	5776	4
1553	\N	4	ហឿត ចិន្ដា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:31:04.842	2025-11-20 13:43:13.667	teacher	production	\N	668975	4
2049	\N	16	វិន សុផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:24:07.338	2025-11-20 14:01:56.502	teacher	production	\N	557	5
2190	\N	31	ធី វណ្ណរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:37:35.755	2025-11-20 14:04:21.497	teacher	production	\N	123127	5
2203	\N	31	ភាត់ ឧត្ដម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:42:30.209	2025-11-20 14:14:16.61	teacher	production	\N	123132	5
2181	\N	32	គិត​ ម៉េងលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:35:00.341	2025-11-20 14:16:27.834	teacher	production	\N	5704	4
2209	\N	31	ភាស់ ​លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:44:40.218	2025-11-20 14:16:46.022	teacher	production	\N	123134	5
2229	\N	31	ស៊ាង ​ប៊ុនធាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:50:52.117	2025-11-20 14:24:51.286	teacher	production	\N	123141	5
2206	\N	32	ភា​ ចន្ទ្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:43:16.041	2025-11-20 14:31:24.199	teacher	production	\N	5725	4
2319	\N	24	សុត ចាន់សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:38:16.36	2025-11-20 14:38:58.208	teacher	production	\N	2749	5
2228	\N	32	ស៊ុន​ សុខលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:50:45.69	2025-11-20 14:39:59.083	teacher	production	\N	5738	4
2230	\N	32	សឿន​ ពិសី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:51:22.61	2025-11-20 14:40:47.788	teacher	production	\N	5739	4
2282	\N	28	ចាន់ សុខវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:24:02.126	2025-11-20 14:53:52.023	teacher	production	\N	20 39	5
2349	\N	24	ស៊ីម សូណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:57:07.422	2025-11-20 14:57:55.367	teacher	production	\N	2814	5
2335	\N	14	អឺយ ភូផា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:48:18.979	2025-11-20 15:02:04.249	teacher	production	\N	២៦០៤១៥៨	4
2300	\N	14	រ៉ា ដារ៉េន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:32:08.928	2025-11-20 15:32:11.777	teacher	production	\N	២៦០៤១៤៥	4
2350	\N	32	ចិន​ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:57:20.883	2025-11-20 15:34:39.734	teacher	production	\N	5545	5
2253	\N	14	ផាត វិច្ឆកា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:02:05.988	2025-11-20 15:37:33.637	teacher	production	\N	២៦០៤១៤១	4
2363	\N	32	ថុន​ ចាន់ថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:05:04.416	2025-11-20 15:44:21.25	teacher	production	\N	5553	5
2205	\N	14	ទ្រី សុភា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:42:40.781	2025-11-20 15:45:21.866	teacher	production	\N	២៦០៤១៣៥	4
2370	\N	32	ផល​ បុរី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:08:12.177	2025-11-20 15:49:38.408	teacher	production	\N	5557	5
2422	\N	31	សាប់ រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:38:01.914	2025-11-21 00:16:57.165	teacher	production	\N	123173	4
2423	\N	31	សាយ រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:38:44.274	2025-11-21 00:18:16.419	teacher	production	\N	123174	4
2424	\N	31	សុង ​ដាណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:39:26.989	2025-11-21 00:19:11.405	teacher	production	\N	123175	4
2425	\N	31	សេង ​ហុងឡេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:40:07.907	2025-11-21 00:20:02.979	teacher	production	\N	123176	4
2426	\N	31	ហៀង ប៊ុនណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:41:00.973	2025-11-21 00:21:06.957	teacher	production	\N	123177	4
2389	\N	32	សារឿន​ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:21:31.119	2025-11-21 00:44:25.858	teacher	production	\N	5572	5
2390	\N	32	ស្រស់​ វណ្ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:22:28.5	2025-11-21 00:44:58.105	teacher	production	\N	5573	5
2391	\N	32	ស្រុង​ ម៉េងឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:23:10.959	2025-11-21 00:45:53.821	teacher	production	\N	5574	5
2392	\N	32	ហ៊ីន​ សុខរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:23:56.16	2025-11-21 00:46:18.352	teacher	production	\N	5575	5
2467	\N	6	ថន រដ្ឋា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:50:28.83	2025-11-21 00:51:47.05	teacher	production	\N	2071	4
2545	\N	6	ផែន សុភព	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 01:03:35.655	2025-11-21 01:05:12.886	teacher	production	\N	2066	5
2529	\N	10	សុខ ចំណូល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:00:55.096	2025-11-21 01:13:59.167	teacher	production	\N	3300	4
2610	\N	28	ឡូត សុផាឡែន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:17:33.341	2025-11-21 01:19:58.728	teacher	production	\N	20 36	4
2600	\N	10	អូន តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:14:00.127	2025-11-21 01:20:16.897	teacher	production	\N	3037	5
2514	\N	10	វីន ស្រីណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:59:36.29	2025-11-21 01:21:29.626	teacher	production	\N	3000	4
2444	\N	28	ចន្តា វិតុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 00:42:40.933	2025-11-21 01:21:48.63	teacher	production	\N	2021	4
2564	\N	10	រិន នេ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:08:53.419	2025-11-21 01:32:28.735	teacher	production	\N	3025	5
2563	\N	10	រ៉ូ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:08:30.27	2025-11-21 01:33:33.85	teacher	production	\N	3024	5
2567	\N	28	ទៀង សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:09:16.056	2025-11-21 01:43:38.599	teacher	production	\N	20 25	4
2627	\N	8	សាវុធ វឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:22:40.48	2025-11-21 04:36:18.594	teacher	production	\N	56838	5
2617	\N	8	វន សុវណ្ណបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:20:23.628	2025-11-21 04:37:46.63	teacher	production	\N	56813	5
1893	\N	9	រ៉ុង រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:24:32.686	2025-11-21 05:41:29.113	teacher	production	\N	020	4
2628	\N	13	រដ្ឋា សុវណ្ណនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:22:58.236	2025-11-21 06:00:16.103	teacher	production	\N	2638	5
2619	\N	13	រ៉ា លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:21:25.914	2025-11-21 06:03:21.448	teacher	production	\N	3883	5
2264	\N	15	យិត យ៉ាហន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:11:41.201	2025-11-21 06:25:52.314	teacher	production	\N	1124	4
2622	\N	8	ស៊ីណា ស៊ីវហ្គោល	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:21:56.272	2025-11-21 07:06:31.411	teacher	production	\N	56906	5
1894	\N	5	ហៀង​ ភូមិន្ទ​	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:24:33.003	2025-11-22 03:51:20.239	teacher	production	\N	566340	4
1898	\N	5	គា​ ជូមុង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:25:46.181	2025-11-22 03:51:51.416	teacher	production	\N	394786	4
1900	\N	5	យ៉េម​ សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:26:24.244	2025-11-22 03:52:33.438	teacher	production	\N	254645	4
2134	\N	7	ទត សុធារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:05:19.198	2025-11-20 13:05:51.618	teacher	production	\N	6096	4
2239	\N	32	ថន​ ចាន់ថេន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:54:26.302	2025-11-20 13:58:17.903	teacher	production	\N	5745	4
1372	\N	32	តេង​ ចន្ទពេជ្របុរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:18:01.576	2025-11-20 14:03:16.955	teacher	production	\N	5707	4
1394	\N	32	ផៃ​ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:28:37.377	2025-11-20 14:11:59.194	teacher	production	\N	5721	4
2263	\N	24	ប៊ុនធឿន លីលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:11:38.116	2025-11-20 14:12:35.716	teacher	production	\N	2692	5
1402	\N	32	ពៅ​ ផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 07:32:28.923	2025-11-20 14:13:02.621	teacher	production	\N	5723	4
2208	\N	31	ភាច ស្រីខួច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:43:54.283	2025-11-20 14:15:29.797	teacher	production	\N	123133	5
2265	\N	24	បូ ថៃសត្យា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:12:03.034	2025-11-20 14:17:16.196	teacher	production	\N	2705	5
2182	\N	32	ណាន​ ផាន់ណេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:35:32.708	2025-11-20 14:17:28.545	teacher	production	\N	5705	4
2284	\N	24	សុន ម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:25:53.91	2025-11-20 14:26:41.865	teacher	production	\N	2813	5
2289	\N	24	សួន  រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:28:21.343	2025-11-20 14:29:18.337	teacher	production	\N	2815	5
2240	\N	31	ស៊្រាន់ ម៉េងស័ង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:54:41.746	2025-11-20 14:29:44.224	teacher	production	\N	123145	5
2242	\N	31	ហាក់ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:55:52.503	2025-11-20 14:31:17.354	teacher	production	\N	123146	5
2207	\N	32	ភារម្យ​ ដាណាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:43:50.448	2025-11-20 14:32:02.111	teacher	production	\N	5726	4
2301	\N	24	សុខ សុវណ្ណលីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:32:27.213	2025-11-20 14:33:03.23	teacher	production	\N	2616	5
2318	\N	24	មឿន  ម៉់ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:37:13.323	2025-11-20 14:37:52.344	teacher	production	\N	2693	5
2313	\N	28	អៀន សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:35:45.831	2025-11-20 14:38:57.312	teacher	production	\N	20 56	5
2320	\N	24	សឿន ស្រីតែម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:38:27.463	2025-11-20 14:39:05.536	teacher	production	\N	2821	5
2337	\N	24	អៀង ចរិយា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:49:24.287	2025-11-20 14:50:02.332	teacher	production	\N	2748	5
2283	\N	28	ចំរើន ចាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:25:43.717	2025-11-20 14:57:00.867	teacher	production	\N	20 40	5
2338	\N	14	អុល រ៉ាឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:49:41.255	2025-11-20 14:58:49.047	teacher	production	\N	២៦០៤១៥៩	4
2285	\N	28	ថា សុខហួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:26:10.617	2025-11-20 14:58:49.874	teacher	production	\N	20 41	5
2286	\N	28	ថៃ ដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:26:42.432	2025-11-20 15:05:19.683	teacher	production	\N	20 42	5
2302	\N	28	ភ័ក្រ្ត ចិត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:32:35.064	2025-11-20 15:11:39.257	teacher	production	\N	20 50	5
2351	\N	32	ចន្តា​ លីហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:58:14.877	2025-11-20 15:35:35.721	teacher	production	\N	5546	5
2241	\N	14	ឆន មីញសឿ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:55:34.079	2025-11-20 15:43:24.1	teacher	production	\N	២៦០៤១៣២	4
2364	\N	32	ធូ​ ចាន់រ៉ាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:05:54.793	2025-11-20 15:45:00.798	teacher	production	\N	5554	5
2427	\N	31	ហុក គីមស្រស់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:41:45.278	2025-11-21 00:22:06.588	teacher	production	\N	123178	4
2428	\N	31	ហុង​ ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:42:26.382	2025-11-21 00:22:55.03	teacher	production	\N	123179	4
2429	\N	31	ហុង ​មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:43:03.855	2025-11-21 00:23:49.981	teacher	production	\N	123180	4
2430	\N	31	ហេង តុងផៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:43:39.602	2025-11-21 00:24:49.704	teacher	production	\N	123181	4
2431	\N	31	ឡុន សុខណៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:44:29.768	2025-11-21 00:25:47.029	teacher	production	\N	123182	4
2432	\N	31	ឡេង វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:45:16.667	2025-11-21 00:26:38.581	teacher	production	\N	123183	4
2433	\N	31	អ៊ួ គីមសួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 23:46:18.302	2025-11-21 00:27:37.044	teacher	production	\N	123184	4
2393	\N	32	ហេង​ គិមហ៊ុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:24:54.193	2025-11-21 00:47:22.294	teacher	production	\N	5576	5
2394	\N	32	ហៃ​ ស្រីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:25:46.566	2025-11-21 00:47:52.339	teacher	production	\N	5577	5
2395	\N	32	អ៊ាន់​ ឈុនលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:26:28.461	2025-11-21 00:48:21.893	teacher	production	\N	5578	5
2471	\N	6	ធឿន ចាន់ថា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:51:54.956	2025-11-21 00:52:34.857	teacher	production	\N	2168	4
2580	\N	8	ឃី ម៉ាន់ទី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	34	f	f	\N	2025-11-21 01:11:06.563	2025-11-21 01:16:34.687	teacher	archived	\N	56403	5
2581	\N	10	សិទ្ធិ ពិសី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:11:21.223	2025-11-21 01:28:53.542	teacher	production	\N	3030	5
2568	\N	10	រុំ សាមាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:09:17.295	2025-11-21 01:31:40.544	teacher	production	\N	3026	5
2554	\N	10	រដ្ឋា ម៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:06:05.003	2025-11-21 01:40:50.03	teacher	production	\N	3018	5
2582	\N	28	ផល គីមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:11:35.023	2025-11-21 01:41:56.411	teacher	production	\N	20 27	4
2168	\N	1	ហុង​ ឡៃហ៊ុន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:19:07.511	2025-11-21 04:05:29.227	teacher	archived	\N	1250	4
2161	\N	1	សេង ​គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:16:19.757	2025-11-21 04:05:35.106	teacher	archived	\N	1136	4
2618	\N	8	វ៉ែន ស៊ាវហ្វី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:21:09.436	2025-11-21 04:34:59.712	teacher	production	\N	62484	5
2611	\N	8	ដឿន ម៉ារីយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:17:50.896	2025-11-21 04:43:35.78	teacher	production	\N	56939	5
1896	\N	9	រុំ ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:25:22.754	2025-11-21 05:42:24.05	teacher	production	\N	019	4
2612	\N	13	ម៉ាន ស្រីនុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:18:28.917	2025-11-21 06:12:58.199	teacher	production	\N	3048	5
2589	\N	13	បូរ រ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:12:08.157	2025-11-21 06:18:58.968	teacher	production	\N	5072	5
2266	\N	15	រតន: ចាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:12:38.463	2025-11-21 06:21:45.077	teacher	production	\N	1125	4
2255	\N	15	ពៅ សុរ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:04:30.255	2025-11-21 06:36:32.788	teacher	production	\N	1120	4
2238	\N	15	ក្រៀម ពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 13:53:59.359	2025-11-21 06:48:02.635	teacher	production	\N	1114	4
1897	\N	24	នី​ សុភ័ណ្ណប៊ែលី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:25:22.973	2025-11-20 10:25:49.72	teacher	production	\N	2777	4
1322	\N	12	ម៉េង សុធារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:01:17.562	2025-11-20 13:07:38.05	teacher	production	\N	29	4
2139	\N	7	ហ៊ុត លីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:07:20.616	2025-11-20 13:07:50.442	teacher	production	\N	6043	4
2183	\N	31	ថាន បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:35:53.013	2025-11-20 14:01:09.357	teacher	production	\N	123125	5
2243	\N	31	ហេង ហាច	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:56:32.227	2025-11-20 14:32:44.564	teacher	production	\N	123147	5
2210	\N	32	យឺន​ លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:45:11.585	2025-11-20 14:33:05.54	teacher	production	\N	5729	4
2213	\N	32	យ៉ុង​ បញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:45:35.831	2025-11-20 14:34:29.091	teacher	production	\N	5730	4
2214	\N	32	រិន​ គឺមសួន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:46:05.209	2025-11-20 14:35:01.151	teacher	production	\N	5731	4
2339	\N	24	យាម លីអេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:50:52.405	2025-11-20 14:51:34.579	teacher	production	\N	2741	5
2141	\N	1	រ៉ន​ ​សូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:07:41.137	2025-11-21 04:06:02.331	teacher	archived	\N	1242	4
2292	\N	28	ធី សុខលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:29:20.625	2025-11-20 15:07:03.766	teacher	production	\N	20 45	5
2287	\N	28	ទូច ភ័ក្ត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:27:15.609	2025-11-20 15:08:14.133	teacher	production	\N	20 43 	5
2369	\N	24	សំណាង ស្រីពុធ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:07:44.047	2025-11-20 15:08:41.011	teacher	production	\N	2779	5
2321	\N	14	សុថា វិជ្ចា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:39:52.065	2025-11-20 15:26:00.136	teacher	production	\N	២៦០៤១៥១	4
2256	\N	14	ភឿន បុប្ផា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:06:08.419	2025-11-20 15:36:09.531	teacher	production	\N	២៦០៤១៤២	4
2352	\N	32	ជ្រៀន​ កញ្ចនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:58:57.179	2025-11-20 15:36:25.692	teacher	production	\N	5547	5
2354	\N	32	ជី​ កល្យាណ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:59:50.445	2025-11-20 15:37:16.848	teacher	production	\N	5633	5
2367	\N	32	នូ​ ខេមម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:07:19.088	2025-11-20 15:48:41.003	teacher	production	\N	5556	5
2434	\N	6	រិទ្ធ ផាដេត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:17:05.339	2025-11-21 00:19:34.029	teacher	production	\N	2111	4
2371	\N	32	ផល​ សុខភា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:09:00.845	2025-11-21 00:30:06.57	teacher	production	\N	5558	5
2453	\N	6	ហ៊ាង គឹមឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:46:26.623	2025-11-21 00:48:02.853	teacher	production	\N	2099	4
2396	\N	32	អូន​ សំអ៊ី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:27:01.805	2025-11-21 00:48:54.747	teacher	production	\N	5579	5
2535	\N	6	ហឿត ស្រីណេរ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 01:01:40.556	2025-11-21 01:02:14.466	teacher	production	\N	2124	4
2553	\N	6	ស៊ន ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 01:05:42.09	2025-11-21 01:07:35.012	teacher	production	\N	2015	5
2540	\N	10	ហេន សុខរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:02:08.752	2025-11-21 01:08:01.886	teacher	production	\N	3600	4
2447	\N	10	ខោល លីខូវ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:45:23.908	2025-11-21 01:10:01.035	teacher	production	\N	1	4
2532	\N	10	ស្រាក់ ស័កណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:01:20.118	2025-11-21 01:12:43.829	teacher	production	\N	3400	4
2597	\N	8	ឆាទ្រី រិទ្ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:13:40.87	2025-11-21 01:13:40.87	teacher	production	\N	55396	5
2601	\N	6	ធូ សារាវឌីណារិនត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:14:09.686	2025-11-21 01:14:58.967	teacher	production	\N	2164	4
2525	\N	10	សាត ចាន់រ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:00:29.806	2025-11-21 01:16:21.982	teacher	production	\N	3200	4
2603	\N	8	ជាតិ ឧត្តរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	34	f	f	\N	2025-11-21 01:14:33.809	2025-11-21 01:16:23.517	teacher	archived	\N	56827	5
2608	\N	6	ផាន ផាយ៉ៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:16:14.179	2025-11-21 01:17:08.462	teacher	production	\N	2102	4
2486	\N	10	ផល្លី ភ័ក្ដ្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:55:17.268	2025-11-21 01:25:36.744	teacher	production	\N	1200	4
2593	\N	10	ហេង កែវសម្រុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:12:55.354	2025-11-21 01:25:46.61	teacher	production	\N	3034	5
2607	\N	28	វឿន សុផាន់និត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:16:10.179	2025-11-21 01:25:53.548	teacher	production	\N	20 34	4
2590	\N	10	ហាវ សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:12:32.088	2025-11-21 01:26:32.562	teacher	production	\N	3033	5
2472	\N	10	ប៉ាល់ សុវណ្ណធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:52:03.255	2025-11-21 01:27:32.059	teacher	production	\N	9	4
2551	\N	10	ម៉ៅ វិច្ឆិកា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:05:12.565	2025-11-21 01:33:50.066	teacher	production	\N	3016	5
2605	\N	28	វណ្ណី លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:15:25.894	2025-11-21 01:34:22.595	teacher	production	\N	20 33	4
2557	\N	10	រដ្ឋា បញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:06:34.024	2025-11-21 01:40:03.776	teacher	production	\N	3019	5
2303	\N	28	មីវីរ: ស័ក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:33:08.96	2025-11-21 01:48:54.236	teacher	production	\N	20 51	5
2138	\N	1	មុំ វីរៈឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:07:07.354	2025-11-21 04:06:05.652	teacher	archived	\N	1243	4
2143	\N	1	រ៉ាន់  រិទ្ធិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:08:13.685	2025-11-21 04:06:10.596	teacher	archived	\N	1093	4
2592	\N	8	ចេង លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:12:51.19	2025-11-21 04:41:04.894	teacher	production	\N	56695	5
2613	\N	8	ផាន់ សៀវជិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:18:41.977	2025-11-21 04:42:10.77	teacher	production	\N	57190	5
2606	\N	8	ជួ វិមានពិសិដ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:15:43.132	2025-11-21 04:44:52.111	teacher	production	\N	56378	5
2602	\N	13	ម៉ាន រ៉ាយ៉ុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:14:27.253	2025-11-21 06:14:39.436	teacher	production	\N	3739	5
2270	\N	15	ស្រូយ លីហួង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:17:17.866	2025-11-21 06:15:55.475	teacher	production	\N	1129	4
2596	\N	13	ភក្ដី វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:13:21.6	2025-11-21 06:16:39.487	teacher	production	\N	3677	5
2269	\N	15	វីរ: បូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:16:09.224	2025-11-21 06:17:23.546	teacher	production	\N	1128	4
2480	\N	13	ណែត ណាមហ្វា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:53:25.537	2025-11-21 06:27:56.88	teacher	production	\N	4567	5
2254	\N	15	ផលវី សោមា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:03:17.101	2025-11-21 06:39:16.319	teacher	production	\N	1119	4
1949	\N	5	សាន​ ស្រីនុច	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:39:14.957	2025-11-21 04:50:24.144	teacher	production	\N	135100	5
1947	\N	5	អង្គារ៍​ ចន្ទ្រា​	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:38:42.734	2025-11-21 04:51:02.555	teacher	production	\N	395910	5
1906	\N	24	គ្រី ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:27:53.429	2025-11-20 10:28:48.604	teacher	production	\N	2671	4
1945	\N	5	យាំង​ ចំរុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:38:06.809	2025-11-21 04:51:33.081	teacher	production	\N	456685	5
1943	\N	5	ហែម​ ឧស្សាហ៍​	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:37:26.698	2025-11-21 04:52:53.781	teacher	production	\N	280102	5
1913	\N	9	សំណាង ចាន់នេត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:29:55.271	2025-11-20 10:29:55.271	teacher	production	\N	013	4
1941	\N	5	ភ័ក្រ​ សុភា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:36:45.755	2025-11-21 04:53:23.431	teacher	production	\N	772372	5
1938	\N	5	ចិន្តា​ ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:36:08.056	2025-11-21 04:53:54.645	teacher	production	\N	464731	5
1934	\N	5	ឈឿន​  រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:35:26.894	2025-11-21 04:54:25.732	teacher	production	\N	647015	5
1922	\N	24	អ៊ឹម​ វ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:32:24.627	2025-11-20 10:32:59.616	teacher	production	\N	2679	4
1926	\N	24	ម៉ាប់ ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:33:36.664	2025-11-20 10:34:13.825	teacher	production	\N	2789	4
1932	\N	5	ធី​ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:34:50.254	2025-11-21 04:55:01.85	teacher	production	\N	113268	5
1933	\N	24	អាត​ ជូទី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 10:34:53.583	2025-11-20 10:35:33.664	teacher	production	\N	2652	4
1928	\N	5	សាន់​ ផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:34:14.048	2025-11-21 04:55:50.044	teacher	production	\N	240188	5
1925	\N	5	ឈាន​ សុខេម	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:33:35.761	2025-11-21 04:56:28.821	teacher	production	\N	765018	5
1923	\N	5	សល់​ ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:32:49.111	2025-11-21 04:57:10.673	teacher	production	\N	324017	5
1942	\N	9	ហា លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:37:19.094	2025-11-20 10:37:19.094	teacher	production	\N	003	4
1944	\N	9	ហា លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:37:51.413	2025-11-20 10:37:51.413	teacher	production	\N	002	4
1899	\N	9	លាម រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:25:56.181	2025-11-21 05:43:08.172	teacher	production	\N	018	4
1948	\N	9	ឆៃដែន ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:38:44.004	2025-11-20 10:38:44.004	teacher	production	\N	០001	4
1950	\N	9	ញ៉ាញ់ ស្រីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:39:21.949	2025-11-20 10:39:21.949	teacher	production	\N	0000	4
1902	\N	9	វឿន វ៉ាយ៉ុក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:26:39.945	2025-11-21 05:44:15.74	teacher	production	\N	017	4
1754	\N	17	គន្ធី នីក្វាន់យូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 09:45:28.844	2025-11-20 10:51:13.474	teacher	production	\N	221152	4
1952	\N	5	យាំង​ ចំរេីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	37	f	f	\N	2025-11-20 10:40:15.424	2025-11-20 10:54:16.671	teacher	archived	\N	181708	5
1904	\N	9	វ័ន្ត ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:27:13	2025-11-21 05:45:18.248	teacher	production	\N	016	4
1907	\N	9	សុផាត សូលីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:28:06.842	2025-11-21 05:46:25.252	teacher	production	\N	015	4
1912	\N	9	សៀង អាលីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:29:12.897	2025-11-21 05:47:11.874	teacher	production	\N	០014	4
1940	\N	9	ហៃ សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:36:41.164	2025-11-21 05:48:04.265	teacher	production	\N	០004	4
1914	\N	9	ហន ឆៃយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:30:31.782	2025-11-21 05:49:19.471	teacher	production	\N	012	4
1918	\N	9	ហ៊ិន ស្រីហួច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:31:33.6	2025-11-21 05:50:03.374	teacher	production	\N	០011	4
1920	\N	9	ឡុង សៀវលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:32:10.113	2025-11-21 05:51:06.013	teacher	production	\N	010	4
1960	\N	4	ណុប ស្រីស	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 10:57:42.584	2025-11-20 10:59:03.26	teacher	production	\N	0	5
1961	\N	4	តុលា វិច្ជិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 10:59:50.303	2025-11-20 11:00:54.81	teacher	production	\N	219470	5
1962	\N	4	ធារ៉ា ស៊ិរៈដា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:01:42.001	2025-11-20 11:02:33.924	teacher	production	\N	478981	5
1924	\N	9	ឡេង ប៊ុនហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:32:54.682	2025-11-21 05:51:48.516	teacher	production	\N	009	4
1927	\N	9	ឡេះ រ៉ាយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:33:42.35	2025-11-21 05:52:36.748	teacher	production	\N	008	4
1965	\N	4	នី ម៉ាលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:04:54.849	2025-11-20 11:05:32.891	teacher	production	\N	815381	5
1966	\N	4	ប៉ាក់ ខេមម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:06:18.263	2025-11-20 11:07:05.224	teacher	production	\N	584108	5
1967	\N	4	បាន រីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:07:50.627	2025-11-20 11:08:43.08	teacher	production	\N	710419	5
1968	\N	4	បូរ៉ា និមុល	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:09:20.575	2025-11-20 11:10:16.656	teacher	production	\N	609080	5
1969	\N	4	ផាត សុភឿន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:11:12.085	2025-11-20 11:11:57.693	teacher	production	\N	344731	5
1970	\N	4	ភក្តី ម៉ាយូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:12:42.233	2025-11-20 11:13:30.669	teacher	production	\N	389762	5
1971	\N	4	ភិរម្យ អរុណ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:15:49.038	2025-11-20 11:17:07.263	teacher	production	\N	751019	5
1972	\N	4	ម៉ៅ សា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:18:26.588	2025-11-20 11:19:07.771	teacher	production	\N	709191	5
1973	\N	4	មឿតឡត ម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:19:44.326	2025-11-20 11:20:27.473	teacher	production	\N	791658	5
1835	\N	17	សុងថុន គីមយុក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:10:28.204	2025-11-20 11:20:55.233	teacher	production	\N	221134	4
1974	\N	4	រដ្ឋ ឆានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:21:05.632	2025-11-20 11:21:39.685	teacher	production	\N	412060	5
1975	\N	4	រើន ស្រីណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:22:19.376	2025-11-20 11:22:59.668	teacher	production	\N	202523	5
1931	\N	9	ចាន់ ម៉េងជូ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:34:45.661	2025-11-21 05:54:00.216	teacher	production	\N	០006	4
1936	\N	9	វ័ន្ត ភត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:35:48.201	2025-11-21 05:54:54.694	teacher	production	\N	០005	4
1903	\N	5	ភាព​ កក្កដា​	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:27:04.391	2025-11-22 03:54:31.555	teacher	production	\N	709442	4
1908	\N	5	វុទ្ធី​  សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:28:09.661	2025-11-22 03:58:59.979	teacher	production	\N	858095	4
1917	\N	5	សារេីុន​ កក្កដា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:31:29.186	2025-11-22 03:59:26.634	teacher	production	\N	658683	4
1919	\N	5	លាង​ ឡុងឌី	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:32:05.604	2025-11-22 04:00:06.747	teacher	production	\N	758547	4
1976	\N	4	លឿន សក្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:23:41.315	2025-11-20 11:24:19.844	teacher	production	\N	449407	5
1977	\N	4	វណ្ណារ៉ា ឆានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:24:53.276	2025-11-20 11:25:28.398	teacher	production	\N	156950	5
723	\N	23	សេង ស៊ាងហ៊ាប	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 09:08:21.66	2025-11-20 11:27:46.209	admin	production	\N	1064	5
1978	\N	4	វណ្ណៈ សុខនី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:26:24.061	2025-11-20 11:27:49.341	teacher	production	\N	456787	5
1979	\N	4	វឿត កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:28:37.454	2025-11-20 11:29:30.84	teacher	production	\N	825626	5
1980	\N	4	សម្បត្តិ សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:30:08.235	2025-11-20 11:31:02.817	teacher	production	\N	682993	5
1981	\N	4	សម្បត្តិ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:31:46.148	2025-11-20 11:32:33.445	teacher	production	\N	221811	5
1982	\N	4	សម្ជស្ស លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:33:30.354	2025-11-20 11:34:42.874	teacher	production	\N	726961	5
1985	\N	4	សារុំ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:36:16.967	2025-11-20 11:36:58.793	teacher	production	\N	649279	5
1986	\N	4	ហ៊ូ មិនហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:37:49.561	2025-11-20 11:38:37.38	teacher	production	\N	391367	5
1987	\N	4	ឧត្តម បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:39:15.1	2025-11-20 11:39:58.465	teacher	production	\N	826495	5
1478	\N	12	ឡេង លិងហ្គិច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:01:07.113	2025-11-20 11:40:48.363	teacher	production	\N	46	5
1988	\N	4	វឿន ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:40:30.648	2025-11-20 11:41:19.128	teacher	production	\N	697734	5
1989	\N	4	អើន សុផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:41:57.531	2025-11-20 11:42:39.994	teacher	production	\N	336442	5
1990	\N	4	វិចិត្រ ចាន់នូ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	22	f	f	\N	2025-11-20 11:44:33.079	2025-11-20 11:44:33.079	teacher	production	\N	834289	5
698	\N	23	សុខ សូលីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:57:05.547	2025-11-20 11:45:37.58	admin	production	\N	1051	5
1603	\N	12	វាសនា បញ្ញាស្កាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:44:43.312	2025-11-20 11:53:54.091	teacher	production	\N	80	5
2022	\N	8	កុសល បូរីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:14:13.097	2025-11-20 13:26:32.163	teacher	production	\N	5881	4
2012	\N	8	វីរៈ លីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:08:19.449	2025-11-20 13:28:09.274	teacher	production	\N	5834	4
2010	\N	8	ស៊ន បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:07:35.494	2025-11-20 13:29:08.631	teacher	production	\N	5938	4
2008	\N	8	ផេង គឹមឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:06:52.166	2025-11-20 13:30:11.488	teacher	production	\N	6327	4
2007	\N	8	អុឹង ច័ន្ទបញ្ញាបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:06:01.307	2025-11-20 13:31:00.172	teacher	production	\N	5830	4
2003	\N	8	ហៀង សៀវអុី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:04:07.977	2025-11-20 13:31:41.516	teacher	production	\N	5894	4
2002	\N	8	ហៀក មេងហួ	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:03:09.566	2025-11-20 13:32:30.244	teacher	production	\N	5890	4
1996	\N	8	សំផូ សុវណ្ណរតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:00:25.647	2025-11-20 13:33:16.813	teacher	production	\N	61851	4
2145	\N	1	រើន សុខ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:08:45.003	2025-11-21 04:05:57.244	teacher	archived	\N	1227	4
672	\N	23	ឈាង ម៉េងជូ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	2	f	f	\N	2025-11-18 08:44:35.281	2025-11-20 12:11:39.336	admin	production	\N	1002	4
1875	\N	17	អ៊ាង   សុគន្ធកន្និកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-20 10:19:23.388	2025-11-20 12:12:15.953	teacher	production	\N	221141	4
2016	\N	2	ម៉ៅ យូមីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:11:03.947	2025-11-20 12:29:30.738	teacher	production	\N	១០២៨	5
2032	\N	2	សំភាស់ តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:16:47.544	2025-11-20 12:21:20.811	teacher	production	\N	១០៣៦	5
2028	\N	2	ស៊ា បូរី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:16:03.809	2025-11-20 12:22:01.073	teacher	production	\N	១០៣៥	5
2026	\N	2	ស៊ា ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:15:34.871	2025-11-20 12:22:54.126	teacher	production	\N	១០៣៤	5
2025	\N	2	សារ៉ាត ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:15:11.47	2025-11-20 12:24:45.42	teacher	production	\N	១០៣៣	5
2023	\N	2	វ៉ុន សីនត្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:14:32.748	2025-11-20 12:25:50.395	teacher	production	\N	១០៣២	5
2020	\N	2	រើន សៅណេង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:13:38.242	2025-11-20 12:26:34.388	teacher	production	\N	១០៣១	5
2019	\N	2	រឿន ខ្វាន់សី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:12:55.875	2025-11-20 12:27:30.492	teacher	production	\N	១០៣០	5
2017	\N	2	យឹម មីនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:11:47.799	2025-11-20 12:28:40.546	teacher	production	\N	១០២៩	5
2015	\N	2	មឿន សុធីរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:10:14.687	2025-11-20 12:30:28.072	teacher	production	\N	១០២៧	5
2014	\N	2	ផល្លី យ៉ៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:08:55.624	2025-11-20 12:31:05.036	teacher	production	\N	១០២៦	5
2018	\N	16	ខេង សុម៉ាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:12:29.762	2025-11-20 12:34:06.809	teacher	production	\N	572	5
2013	\N	2	បៃ សម្បត្តិ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:08:23.175	2025-11-20 12:34:25.739	teacher	production	\N	១០២៥	5
2021	\N	16	គីម នេសារ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:14:03.921	2025-11-20 12:35:37.805	teacher	production	\N	573	5
2011	\N	2	នឿម សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:07:50.667	2025-11-20 12:36:00.062	teacher	production	\N	១០២៤	5
2005	\N	2	ញ៉េ កុម្ភះ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:04:47.823	2025-11-20 12:41:39.461	teacher	production	\N	១០២១	5
2009	\N	2	ធា រ៉ាយុ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:06:53.085	2025-11-20 12:38:23.587	teacher	production	\N	១០២៣	5
2006	\N	2	ឌី ចាន់រី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:05:17.862	2025-11-20 12:39:45.058	teacher	production	\N	១០២២	5
2027	\N	16	ជួន វ៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:15:56.408	2025-11-20 12:39:48.51	teacher	production	\N	574	5
2001	\N	2	ឈើត បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:02:33.585	2025-11-20 12:45:13.686	teacher	production	\N	១០១៩	5
2024	\N	16	ឃន ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	f	f	114	f	f	\N	2025-11-20 12:14:55.089	2025-11-20 12:48:34.323	teacher	archived	\N	538	5
1991	\N	2	ចំរើន រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 11:59:01.947	2025-11-20 12:46:38.513	teacher	production	\N	១០១៨	5
2033	\N	16	ឈឿត មុន្នីបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:16:50.203	2025-11-20 12:52:53.199	teacher	production	\N	620	5
2034	\N	16	ឌិន ជីវន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:17:23.231	2025-11-20 12:56:21.155	teacher	production	\N	504	5
1143	\N	7	ប៊ុនរឿត ស្រីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 04:43:01.925	2025-11-20 12:20:25.798	teacher	production	\N	6088	5
2040	\N	16	ទ្រិន វ៉ាន់ណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:18:46.287	2025-11-20 12:58:51.684	teacher	production	\N	579	5
2044	\N	16	មាស ស្រីនាត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:21:23.049	2025-11-20 13:04:26.236	teacher	production	\N	582	5
2137	\N	7	ហួន សុវណ្ណារាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:06:22.838	2025-11-20 13:06:51.282	teacher	production	\N	6393	4
2165	\N	7	អឿម ចាន់ស៊ីម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:17:51.536	2025-11-20 13:18:19.003	teacher	production	\N	6148	4
1454	\N	4	តន់ ម៉ារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 07:55:02.078	2025-11-20 13:19:02.123	teacher	production	\N	991866	4
2167	\N	7	វឿន ជូលី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:18:43.307	2025-11-20 13:19:08.199	teacher	production	\N	6509	4
2036	\N	8	គុណ ច័ន្ទសុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:17:30.269	2025-11-20 13:24:59.764	teacher	production	\N	5774	4
2188	\N	31	ធា ដានីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:36:46.51	2025-11-20 14:02:51.152	teacher	production	\N	123126	5
2212	\N	31	ម៉ាប់ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:45:35.388	2025-11-20 14:17:59.496	teacher	production	\N	123135	5
2184	\N	32	តារា​ មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:36:08.806	2025-11-20 14:18:28.996	teacher	production	\N	5706	4
2215	\N	31	យាន់ ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:46:20.224	2025-11-20 14:19:14.117	teacher	production	\N	123136	5
2218	\N	31	រិន ស្រីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:47:10.794	2025-11-20 14:20:22.868	teacher	production	\N	123137	5
2189	\N	32	ថុង​ ថេវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:37:15.655	2025-11-20 14:21:24.565	teacher	production	\N	5709	4
2220	\N	31	លាង ​ភារម្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:48:07.246	2025-11-20 14:21:28.074	teacher	production	\N	123138	5
2247	\N	31	អុី មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:58:20.644	2025-11-20 14:34:58.918	teacher	production	\N	123149	5
2308	\N	24	ចាន់ សេងហួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:34:19.422	2025-11-20 14:35:34.139	teacher	production	\N	2651	5
2219	\N	32	រី​ ប៊ុនណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:47:14.515	2025-11-20 14:35:38.274	teacher	production	\N	5732	4
2322	\N	24	យឿន ម៉េងស័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:40:01.506	2025-11-20 14:40:32.297	teacher	production	\N	28807	5
2340	\N	24	ពៅ ណារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:52:42.12	2025-11-20 14:53:25.787	teacher	production	\N	2687	5
2307	\N	28	លីម ម៉េងស្រ៊ាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:34:15.1	2025-11-20 14:55:14.806	teacher	production	\N	20 53	5
2306	\N	28	មួន លក្ខិណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:33:46.456	2025-11-20 14:57:57.45	teacher	production	\N	20 52	5
2353	\N	24	ភូង ឆៃអៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 14:59:28.048	2025-11-20 15:00:07.577	teacher	production	\N	2606	5
2291	\N	28	ធា សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:28:33.406	2025-11-20 15:09:26.298	teacher	production	\N	20 44	5
2372	\N	24	អេង វណ្ណនុន	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:10:15.511	2025-11-20 15:10:52.835	teacher	production	\N	2768	5
2309	\N	14	វន ស្រីនុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:34:22.064	2025-11-20 15:29:36.281	teacher	production	\N	២៦០៤១៤៨	4
2304	\N	14	រិម លីហ្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:33:21.369	2025-11-20 15:30:53.794	teacher	production	\N	២៦០៤១៤៧	4
2357	\N	32	ណាក់​ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:01:58.948	2025-11-20 15:38:44.464	teacher	production	\N	5549	5
2244	\N	14	ថា សៀវមុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:56:59.011	2025-11-20 15:41:57.211	teacher	production	\N	២៦០៤១៣៤	4
2211	\N	14	ជីវន្ត័ ផាហ្វុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:45:14.786	2025-11-20 15:44:23.2	teacher	production	\N	២៦០៤១៣៣	4
2197	\N	14	ខៀវ ពិសាល	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 13:40:24.542	2025-11-20 15:46:26.64	teacher	production	\N	២៦០៤១២៩	4
2397	\N	31	គ្រី នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:47:39.941	2025-11-20 23:49:15.741	teacher	production	\N	123150	4
2398	\N	31	ឃាប ម៉េងគាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:48:38.354	2025-11-20 23:50:10.325	teacher	production	\N	123151	4
2399	\N	31	ចន្ថា បុប្ផា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:49:21.043	2025-11-20 23:52:34.854	teacher	production	\N	123152	4
2400	\N	31	ចំរើន សេរីវឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:50:16.385	2025-11-20 23:53:35.811	teacher	production	\N	123153	4
2373	\N	32	ផល្លា​ សៀវហ្វុង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:10:24.541	2025-11-21 00:32:07.521	teacher	production	\N	5559	5
2374	\N	32	ផល្លី​ នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:11:08.679	2025-11-21 00:33:02.109	teacher	production	\N	5560	5
2456	\N	6	សន លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:46:53.556	2025-11-21 00:47:54.948	teacher	production	\N	2095	4
2537	\N	6	សឿត ចន្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:01:44.749	2025-11-21 01:02:26.523	teacher	production	\N	2199	4
2547	\N	6	ពេជ ម៉ូនីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:03:52.163	2025-11-21 01:07:27.744	teacher	production	\N	2076	5
2536	\N	10	ហន លីរចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 01:01:41.366	2025-11-21 01:11:40.013	teacher	production	\N	3500	4
2459	\N	10	ចំរើន លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:47:47.586	2025-11-21 01:30:54.283	teacher	production	\N	3	4
2448	\N	10	ចិន្ដា មនីវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:45:57.161	2025-11-21 01:31:30.291	teacher	production	\N	2	4
2552	\N	10	យ៉ូន វិចិត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:05:40.955	2025-11-21 01:33:07.436	teacher	production	\N	3017	5
2559	\N	10	រស់ ស្រីរ៉ុង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:07:22.261	2025-11-21 01:36:32.091	teacher	production	\N	3021	5
2591	\N	28	យ៉ម យ៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:12:35.402	2025-11-21 01:40:06.032	teacher	production	\N	20 29	4
2172	\N	1	រស្មី រ៉ានីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:20:51.211	2025-11-21 04:05:26.515	teacher	archived	\N	2481	4
2166	\N	1	ស៊ុយ ហាប់ស៊ាវជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:18:30.418	2025-11-21 04:05:37.182	teacher	archived	\N	1412	4
2615	\N	8	រឿង តេវ៉ាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:19:34.832	2025-11-21 04:39:52.477	teacher	production	\N	57132	5
2614	\N	13	ម៉េង ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:19:12.324	2025-11-21 06:09:49.993	teacher	production	\N	3839	5
2271	\N	15	សៀ ភិញ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:18:08.059	2025-11-21 06:14:24.136	teacher	production	\N	1130	4
2257	\N	15	ទិ ស៊ិងស៊ិង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:07:19.928	2025-11-21 06:35:10.195	teacher	production	\N	1121	4
2041	\N	16	ផង់ ស្រីណាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:19:39.58	2025-11-20 13:01:48.756	teacher	production	\N	548	5
2037	\N	2	អឹម លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:17:59.505	2025-11-20 12:18:49.327	teacher	production	\N	១០៣៨	5
2359	\N	32	ណាក់​ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:02:41.029	2025-11-20 15:39:35.322	teacher	production	\N	5550	5
2043	\N	16	ផុន សិលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:20:21.619	2025-11-20 13:05:02.183	teacher	production	\N	581	5
2144	\N	7	យ៉ែម នីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:08:14.927	2025-11-20 13:08:47.324	teacher	production	\N	6118	4
2053	\N	8	ម៉ាត់ អេះស្អារី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:25:15.728	2025-11-20 13:20:07.627	teacher	production	\N	5784	4
2169	\N	7	ហេង ម៉ីអ៉ីងហ្វុង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:19:43.518	2025-11-20 13:20:11.595	teacher	production	\N	6023	4
2142	\N	31	ឈាន់ សីហា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:08:07.467	2025-11-20 13:20:32.206	teacher	production	\N	123122	5
1494	\N	4	ភី ផាន់នី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	47	f	f	\N	2025-11-20 08:07:43.832	2025-11-20 13:22:05.118	teacher	production	\N	453242	4
2178	\N	31	ថាត ពន្លក	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:23:00.133	2025-11-20 13:26:18.463	teacher	production	\N	123124	5
2187	\N	32	ថាន​ សូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:36:46.132	2025-11-20 14:20:15.036	teacher	production	\N	5708	4
2192	\N	32	ធន់​ ស្រីនិច្ច	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 13:38:28.894	2025-11-20 14:23:42.403	teacher	production	\N	5711	4
2294	\N	24	យ៉ាន មិនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:29:57.207	2025-11-20 14:31:42.234	teacher	production	\N	2740	5
2245	\N	31	ឡុង​ ម៉េងលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:57:19.622	2025-11-20 14:33:47.065	teacher	production	\N	123148	5
2305	\N	24	ស្រេត ធារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	85	f	f	\N	2025-11-20 14:33:35.464	2025-11-20 14:34:09.012	teacher	production	\N	2812	5
2356	\N	24	តិល ថៃប៉ុនរ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:00:59.457	2025-11-20 15:01:56.483	teacher	production	\N	2800	5
2296	\N	28	នៅ សុខពេជ្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:30:24.917	2025-11-20 15:04:21.332	teacher	production	\N	20 47	5
2293	\N	28	ធុល ស៊ុខថ័យ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	75	f	f	\N	2025-11-20 14:29:52.652	2025-11-20 15:06:07.716	teacher	production	\N	20 46	5
2375	\N	24	ម៉ៃ ណេត	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	80	f	f	\N	2025-11-20 15:11:56.316	2025-11-20 15:12:42.02	teacher	production	\N	2735	5
2341	\N	32	ខៃ​ ផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:53:08.28	2025-11-20 15:30:46.72	teacher	production	\N	5544	5
2347	\N	32	ឃីម​ ករុណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 14:55:56.768	2025-11-20 15:32:49.864	teacher	production	\N	5543	5
2258	\N	14	យឿន រ៉ាយុទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	46	f	f	\N	2025-11-20 14:08:07.124	2025-11-20 15:34:51.059	teacher	production	\N	២៦០៤១៤៤	4
2355	\N	32	ឌី​ សាមីដា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:00:42.994	2025-11-20 15:37:51.687	teacher	production	\N	5548	5
2401	\N	31	ថន ប៊ុនឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:51:04.964	2025-11-20 23:55:20.491	teacher	production	\N	123154	4
2402	\N	31	ថៃ វណ្ណរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:51:57.65	2025-11-20 23:56:28.851	teacher	production	\N	123155	4
2403	\N	31	ធារ៉ា ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:52:42.203	2025-11-20 23:57:31.721	teacher	production	\N	123156	4
2404	\N	31	ធា រ័ត្នធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:53:32.409	2025-11-20 23:58:45.614	teacher	production	\N	123157	4
2405	\N	31	ធី កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:54:15.737	2025-11-20 23:59:48.032	teacher	production	\N	123158	4
2406	\N	31	ធី រតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:55:07.264	2025-11-21 00:00:49.969	teacher	production	\N	123159	4
2407	\N	31	នាង វឌ្ឍនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	72	f	f	\N	2025-11-20 22:55:59.589	2025-11-21 00:01:52.53	teacher	production	\N	123160	4
2376	\N	32	ព្រឹក​ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:12:06.646	2025-11-21 00:33:45.348	teacher	production	\N	5561	5
2377	\N	32	ភ័ក្រ​ ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	79	f	f	\N	2025-11-20 15:12:46.664	2025-11-21 00:34:32.118	teacher	production	\N	5562	5
2436	\N	6	រី ពិសិដ្ឋមុនីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:36:12.195	2025-11-21 00:43:58.876	teacher	production	\N	2184	4
2483	\N	6	នៀថ គង្គារ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 00:54:20.888	2025-11-21 00:55:17.937	teacher	production	\N	2052	4
2485	\N	6	រ៉ង ថារីន 	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:54:32.174	2025-11-21 00:55:20.242	teacher	production	\N	2175	4
2491	\N	6	ស៊ុន ចាន់រ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 00:56:26.77	2025-11-21 00:57:08.647	teacher	production	\N	2191	4
2495	\N	10	រើន ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:57:03.72	2025-11-21 01:22:41.059	teacher	production	\N	1600	4
2492	\N	10	រ៉េត ថានា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:56:36.013	2025-11-21 01:23:35.233	teacher	production	\N	1500	4
2490	\N	10	ម៉េត បូរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:56:10.644	2025-11-21 01:24:18.316	teacher	production	\N	1400	4
2487	\N	10	ភាក លីវិន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:55:47.458	2025-11-21 01:25:00.155	teacher	production	\N	1300	4
2484	\N	10	ប្រុស ចាន់នី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:54:26.861	2025-11-21 01:26:16.531	teacher	production	\N	1100	4
2544	\N	10	ធី លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:03:17.943	2025-11-21 01:38:18.481	teacher	production	\N	3011	5
2542	\N	10	ណុល ស៊ីណាត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:02:55.218	2025-11-21 01:39:00.293	teacher	production	\N	3010	5
2493	\N	10	កែវ នីណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:56:39.161	2025-11-21 01:43:42.021	teacher	production	\N	2001	5
2497	\N	10	ក្រឹម លីនណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:57:12.12	2025-11-21 01:44:23.797	teacher	production	\N	2002	5
2509	\N	10	ខុន យូរី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 00:58:08.059	2025-11-21 01:44:25.242	teacher	production	\N	2004	5
2249	\N	15	ញោម សុភី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 13:58:59.985	2025-11-21 06:44:41.602	teacher	production	\N	1116	4
2170	\N	1	ឡាលីន យ៉ូស៊ីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:20:01.496	2025-11-21 04:05:32.255	teacher	archived	\N	1387	4
2272	\N	15	សាត រីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:18:59.547	2025-11-21 06:12:54.976	teacher	production	\N	1131	4
2494	\N	13	ធឿន ថាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 00:56:45.246	2025-11-21 06:23:14.908	teacher	production	\N	2903	5
2252	\N	15	បូ ចន្ទ័ខួចវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:01:37.425	2025-11-21 06:41:16.635	teacher	production	\N	1118	4
2186	\N	13	គន្ធា ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-20 13:36:39.171	2025-11-21 06:41:20.836	teacher	production	\N	8795	5
2035	\N	2	ហ៊ុន ប្រុសគីម	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:17:24.921	2025-11-20 12:19:55.256	teacher	production	\N	១០៣៧	5
2062	\N	16	អ៊ូ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:28:15.879	2025-11-20 12:59:48.915	teacher	production	\N	580	5
1550	\N	12	វី រ៉ាវុធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	112	f	f	\N	2025-11-20 08:29:37.128	2025-11-20 12:26:07.821	teacher	production	\N	62	5
1433	\N	12	ឈឿន ណាំឈីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	27	f	f	\N	2025-11-20 07:49:42.934	2025-11-20 12:26:17.614	teacher	production	\N	001	4
637	\N	23	ថេង វុទ្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	67	f	f	\N	2025-11-18 07:12:06.795	2025-11-20 12:30:18.112	teacher	production	\N	1020	4
2079	\N	8	ឡេង ជំនោរ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:40:40.379	2025-11-20 13:01:53.207	teacher	production	\N	5786	4
2077	\N	8	អាត ពេជ្ររតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:38:10.579	2025-11-20 13:05:00.547	teacher	production	\N	5799	4
2076	\N	8	ឡៃ សៀកម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:37:05.811	2025-11-20 13:05:47.328	teacher	production	\N	5795	4
675	\N	23	សៀ ចាន់មុន្នីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	f	f	2	f	f	\N	2025-11-18 08:46:14.21	2025-11-20 12:42:25.384	admin	archived	\N	1003	4
1152	\N	7	រ័ត្ន ស្រីនុត	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	111	f	f	\N	2025-11-20 05:07:41.486	2025-11-20 12:42:39.216	teacher	production	\N	6166	5
2004	\N	2	ញ៉េ ម៉ានិត	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	49	f	f	\N	2025-11-20 12:04:15.712	2025-11-20 12:43:26.025	teacher	production	\N	១០២០	5
2075	\N	8	ហ្វី លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:36:32.398	2025-11-20 13:06:36.569	teacher	production	\N	5810	4
2045	\N	16	រឿន ដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:22:06.19	2025-11-20 13:07:07.193	teacher	production	\N	586	5
2074	\N	8	ហេង លីហួត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:35:52.574	2025-11-20 13:07:27.355	teacher	production	\N	5787	4
2047	\N	16	លន សាលីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:23:25.052	2025-11-20 13:08:04.218	teacher	production	\N	623	5
2073	\N	8	ហាន សិរីរត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:35:14.174	2025-11-20 13:08:27.094	teacher	production	\N	5781	4
2072	\N	8	ហ៊ីម យ៉ារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:33:53.492	2025-11-20 13:09:19.573	teacher	production	\N	5841	4
2071	\N	8	សំបូរ សក្កម៉ី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:33:22.407	2025-11-20 13:10:05.245	teacher	production	\N	58331	4
2067	\N	8	ស៊ន សុផាលីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:31:52.127	2025-11-20 13:11:45.894	teacher	production	\N	5775	4
2066	\N	8	លី សុវណ្ណនីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:30:45.079	2025-11-20 13:12:55.397	teacher	production	\N	5811	4
2091	\N	16	ឃន ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:49:58.28	2025-11-20 12:50:43.726	teacher	production	\N	537	5
2065	\N	8	លី ទិតវឌ្ឍនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:30:09.282	2025-11-20 13:13:44.661	teacher	production	\N	5785	4
2064	\N	8	រិទ្ធ ប៉េងហួត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:29:14.556	2025-11-20 13:14:41.456	teacher	production	\N	5802	4
2063	\N	8	រ៉ាត់ រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:28:30.802	2025-11-20 13:15:31.1	teacher	production	\N	6092	4
2061	\N	8	រស់ ឧត្ដម	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:27:39.347	2025-11-20 13:16:36.14	teacher	production	\N	5840	4
2059	\N	8	រដ្ឋ កណិការ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:27:00.206	2025-11-20 13:17:43.12	teacher	production	\N	5839	4
2057	\N	8	មិត្ត សានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:26:24.221	2025-11-20 13:18:21.162	teacher	production	\N	5825	4
2055	\N	8	មាន អេងហៀង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:25:49.347	2025-11-20 13:19:15.888	teacher	production	\N	5852	4
2092	\N	7	ចាន់ សុវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:50:14.971	2025-11-20 12:54:49.343	teacher	production	\N	6013	4
2171	\N	7	រួម លីណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 13:20:31.954	2025-11-20 13:20:55.3	teacher	production	\N	6021	4
2050	\N	8	ពន្លក សុលិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:24:35.301	2025-11-20 13:21:05.991	teacher	production	\N	5818	4
2105	\N	7	ជា ណារ័ត្ន	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:55:20.926	2025-11-20 12:55:49.853	teacher	production	\N	5918	4
2108	\N	7	ឌុល គឹមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:56:14.855	2025-11-20 12:56:39.878	teacher	production	\N	6188	4
2110	\N	7	ឆេន ភីម៉ៃ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:57:06.86	2025-11-20 12:57:32.559	teacher	production	\N	6076	4
2038	\N	16	ថន ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:18:01.289	2025-11-20 12:57:38.37	teacher	production	\N	564	5
2112	\N	7	វី ជីវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	29	f	f	\N	2025-11-20 12:58:05.583	2025-11-20 12:58:35.309	teacher	production	\N	6164	4
2042	\N	8	ជាតិ សុបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	23	f	f	\N	2025-11-20 12:19:52.543	2025-11-20 13:24:04.152	teacher	production	\N	5777	4
2173	\N	31	ណាត លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	116	f	f	\N	2025-11-20 13:21:41.931	2025-11-20 13:24:32.798	teacher	production	\N	123123	5
2051	\N	16	វឿន ណាគីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:24:48.44	2025-11-20 14:03:01.583	teacher	production	\N	588	5
2054	\N	16	វឿន វណ្ណថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:25:39.385	2025-11-20 14:03:53.393	teacher	production	\N	558	5
2056	\N	16	សីហា លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:26:10.55	2025-11-20 14:04:41.414	teacher	production	\N	589	5
2058	\N	16	សុខា សុភ័ក្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	114	f	f	\N	2025-11-20 12:26:45.097	2025-11-20 14:05:36.468	teacher	production	\N	455	5
2082	\N	32	ម៉ាច​ កែវតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	60	f	f	\N	2025-11-20 12:43:48.29	2025-11-20 14:14:49.985	teacher	production	\N	57277	4
2111	\N	1	ពុទ្ធី គីមហាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:57:55.757	2025-11-21 04:06:12.614	teacher	archived	\N	1164	4
2107	\N	1	បញ្ញា ចន្ទរតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:55:52.177	2025-11-21 04:06:15.277	teacher	archived	\N	1223	4
2109	\N	1	ប៉ៃ​ ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:56:36.408	2025-11-21 04:06:17.753	teacher	archived	\N	1160	4
2104	\N	1	ណាង សូរិយានុត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:55:01.678	2025-11-21 04:06:21.799	teacher	archived	\N	1143	4
2102	\N	1	ឌឹម​ លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:54:10.548	2025-11-21 04:06:25.546	teacher	archived	\N	1087	4
2099	\N	1	ឌី​ រាជសី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:53:33.498	2025-11-21 04:06:28.127	teacher	archived	\N	1430	4
2097	\N	1	ដឿន ពៅ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:52:50.687	2025-11-21 04:06:30.794	teacher	archived	\N	1149	4
2095	\N	1	ចិន​ នេសា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:52:19.813	2025-11-21 04:06:36.382	teacher	archived	\N	1101	4
2093	\N	1	ចន គឹមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:51:00.665	2025-11-21 04:06:39.313	teacher	archived	\N	1261	4
2246	\N	15	ជា ម៉េងហ៊ួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 13:58:01.405	2025-11-21 06:46:23.152	teacher	production	\N	1115	4
2598	\N	10	ឯម សាម៉ាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:13:41.621	2025-11-21 01:23:20.818	teacher	production	\N	3036	5
2626	\N	6	ផាន ជីជី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:22:37.841	2025-11-21 01:23:25.114	teacher	production	\N	2161	4
2609	\N	28	សយ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:16:42.8	2025-11-21 01:24:10.92	teacher	production	\N	20 35	4
2594	\N	10	ហេង កែវសម្រិត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:13:17.779	2025-11-21 01:24:54.372	teacher	production	\N	3035	5
2678	\N	13	អាត ប៊ុនណាត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:44:03.917	2025-11-21 04:30:16.86	teacher	production	\N	3590	5
2479	\N	10	ប៊ុន ធារិទ្ធ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:53:23.568	2025-11-21 01:26:56.302	teacher	production	\N	1000	4
2641	\N	6	សុង ម៉ាលីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:26:44.379	2025-11-21 01:27:23.081	teacher	production	\N	2078	4
2469	\N	10	ធឿន លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	40	f	f	\N	2025-11-21 00:51:33.06	2025-11-21 01:28:05.767	teacher	production	\N	8	4
2584	\N	10	សំណាង អូនជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:11:45.885	2025-11-21 01:28:08.208	teacher	production	\N	3031	5
2645	\N	6	ហាក់ គឹមនា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:28:19.705	2025-11-21 01:28:52.708	teacher	production	\N	2104	4
2650	\N	6	មឿក សារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:31:07.989	2025-11-21 01:31:42.674	teacher	production	\N	2155	4
2655	\N	6	សាង អុីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:32:50.614	2025-11-21 01:33:18.898	teacher	production	\N	2156	5
2662	\N	6	សាមឿន លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:34:43.949	2025-11-21 01:35:11.8	teacher	production	\N	2058	5
2604	\N	28	រ៉ន ណារីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:14:38.549	2025-11-21 01:36:43.63	teacher	production	\N	20 32	4
2664	\N	6	សុភ័ណ្ឌ សុភិចគ្រីស្មៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:36:21.575	2025-11-21 01:36:54.436	teacher	production	\N	2059	5
2666	\N	30	ចាន់ថា ចាន់រីម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:36:54.502	2025-11-21 01:37:45.207	teacher	production	\N	9090	4
2599	\N	28	យ៉ួង យ៉ារ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 01:13:54.645	2025-11-21 01:38:04.057	teacher	production	\N	20 31	4
2558	\N	10	រស់ វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	45	f	f	\N	2025-11-21 01:07:00.746	2025-11-21 01:38:59.445	teacher	production	\N	3020	5
2668	\N	6	ហេន ផានីត	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	36	f	f	\N	2025-11-21 01:38:00.404	2025-11-21 01:39:01.822	teacher	production	\N	2169	5
2669	\N	30	ណន​ ម៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:38:22.458	2025-11-21 01:39:53.62	teacher	production	\N	៩០៩១	4
2671	\N	30	ធឿន ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:40:27.285	2025-11-21 01:40:59.913	teacher	production	\N	៩០៩២	4
2673	\N	30	មែន ថាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:41:35.266	2025-11-21 01:43:55.796	teacher	production	\N	៩០៩៥	4
2451	\N	28	ឆៃយ៉ា ណាថានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	74	f	f	\N	2025-11-21 00:46:20.985	2025-11-21 01:44:41.885	teacher	production	\N	2022	4
2676	\N	6	លឿម ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	f	f	110	f	f	\N	2025-11-21 01:42:37.917	2025-11-21 01:44:48.814	teacher	archived	\N	2106	4
2680	\N	30	លឿង យូលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:44:46.828	2025-11-21 01:45:49.189	teacher	production	\N	៩០៩៦	4
2683	\N	6	លឿម ណាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	110	f	f	\N	2025-11-21 01:45:29.28	2025-11-21 01:46:00.607	teacher	production	\N	2126	4
2685	\N	16	វុធ វ៉ាន់ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:46:29.373	2025-11-21 02:06:13.043	teacher	production	\N	612	4
2684	\N	16	វ៉ាន់ លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:45:51.111	2025-11-21 02:07:26.039	teacher	production	\N	587	4
2681	\N	16	រឿន បូសូភា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:45:07.35	2025-11-21 02:08:24.081	teacher	production	\N	609	4
2679	\N	16	រុន ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:44:16.961	2025-11-21 02:09:11.077	teacher	production	\N	608	4
2653	\N	8	ឡុង លីសូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:32:09.242	2025-11-21 02:21:40.958	teacher	production	\N	57002	5
2651	\N	8	ហោ មុន្នីនាថ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:31:35.113	2025-11-21 02:25:02.613	teacher	production	\N	56571	5
2649	\N	8	ហេង ម៉េងហៀក	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:30:55.987	2025-11-21 02:27:34.421	teacher	production	\N	56419	5
2647	\N	8	ហៀង ចន្ទ័បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:30:08.084	2025-11-21 02:29:31.5	teacher	production	\N	60627	5
2640	\N	8	សុវណ្ណ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:26:27.032	2025-11-21 04:25:55.714	teacher	production	\N	56292	5
2635	\N	8	សុផុន សោភណ្ឌបូភា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:25:27.75	2025-11-21 04:29:12.969	teacher	production	\N	56630	5
2631	\N	8	សឺង ស៊ានមីញ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:24:27.68	2025-11-21 04:30:29.644	teacher	production	\N	57010	5
2677	\N	13	ឡុង ស្រីនូ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:43:13.662	2025-11-21 04:32:21.634	teacher	production	\N	3693	5
2629	\N	8	សិទ្ធ សុផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:23:28.001	2025-11-21 04:33:50.9	teacher	production	\N	56619	5
2674	\N	13	សុវណ្ណ ឈុនហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:41:57.643	2025-11-21 04:34:53.115	teacher	production	\N	3690	5
2672	\N	13	សំអុល សុជាតិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:40:30.962	2025-11-21 04:36:00.763	teacher	production	\N	3694	5
2670	\N	13	សៀត អាមួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:39:48.208	2025-11-21 04:37:33.3	teacher	production	\N	3699	5
2660	\N	13	វិបុល បុប្ផាវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:34:25.925	2025-11-21 04:41:33.373	teacher	production	\N	3568	5
2656	\N	13	វ៉ាន់នី ដារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:33:36.735	2025-11-21 05:13:30.135	teacher	production	\N	3554	5
2654	\N	13	លឿត លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:32:19.165	2025-11-21 05:16:43.039	teacher	production	\N	3454	5
2652	\N	13	លឹម វណ្ណនីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:31:42.713	2025-11-21 05:20:38.196	teacher	production	\N	7895	5
2648	\N	13	លីម សៀងឡាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:30:14.844	2025-11-21 05:24:28.068	teacher	production	\N	5069	5
2646	\N	13	លាប ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:29:29.41	2025-11-21 05:28:47.032	teacher	production	\N	1735	5
2644	\N	13	លាន សៀវឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:27:47.511	2025-11-21 05:34:41.819	teacher	production	\N	4940	5
2642	\N	13	រស្មី ម៉ាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:27:11.043	2025-11-21 05:38:03.284	teacher	production	\N	3948	5
2636	\N	13	រ៉ម វិឆ័យ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:25:31.162	2025-11-21 05:41:15.29	teacher	production	\N	7394	5
2632	\N	13	រ៉ាត់ រាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:24:29.748	2025-11-21 05:46:12.573	teacher	production	\N	3903	5
2687	\N	30	វ៉ាន់ ដានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:47:59.838	2025-11-21 01:48:22.564	teacher	production	\N	៩០៩៧	4
2690	\N	30	ស្លេះ សៃយូតី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:49:10.526	2025-11-21 01:49:37.548	teacher	production	\N	០៩៩៨	4
2693	\N	30	ស្រូយ ប៊ុនឡេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:50:25.347	2025-11-21 01:50:52.38	teacher	production	\N	៩០៩៩	4
2694	\N	30	ឡុក មករា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:51:53.324	2025-11-21 01:52:20.981	teacher	production	\N	៩១០០	4
2695	\N	30	ថាច សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:52:53.01	2025-11-21 01:53:20.584	teacher	production	\N	៩០០២	4
2697	\N	30	សារឿន សុឃុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:54:07.347	2025-11-21 01:54:39.238	teacher	production	\N	៩០០៣	4
2698	\N	30	រ៉ាហ្វីន ម៉ានសារ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:55:02.918	2025-11-21 01:55:28.916	teacher	production	\N	៩០០៤	4
2692	\N	16	អាន សុកថេ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:50:19.877	2025-11-21 01:56:02.114	teacher	production	\N	552	4
2699	\N	30	លុច្ស ម៉េងលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:55:52.619	2025-11-21 01:56:18.484	teacher	production	\N	៩០០៥	4
2700	\N	30	សុផល លីហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:56:49.547	2025-11-21 01:57:14.865	teacher	production	\N	៩០០៦	4
2701	\N	30	សម្ជស្ស ស៊ីណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 01:57:48.716	2025-11-21 01:58:55.556	teacher	production	\N	៩០០៧	4
2691	\N	16	សឿ ប៊ុនតេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:49:39.546	2025-11-21 01:58:56.701	teacher	production	\N	616	4
2689	\N	16	សុផុន អាវីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:49:04.158	2025-11-21 02:01:13.102	teacher	production	\N	615	4
2688	\N	16	សុគុណ លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:48:12.118	2025-11-21 02:02:23.258	teacher	production	\N	614	4
2702	\N	30	ស្រេង មួយលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:01:03.363	2025-11-21 02:03:22.705	teacher	production	\N	9008	4
2686	\N	16	សុខា សោភ័ណ្ឌ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 01:47:38.135	2025-11-21 02:03:46.927	teacher	production	\N	553	4
2703	\N	30	នឿន នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:03:53.479	2025-11-21 02:04:14.5	teacher	production	\N	៩០១០	4
2704	\N	30	ម៉ៅ ស្រីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:05:34.683	2025-11-21 02:05:53.806	teacher	production	\N	៩០១១	4
1426	\N	16	ថុង សុខធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-20 07:43:46.649	2025-11-21 02:11:43.458	teacher	production	\N	578	4
2705	\N	30	យាង គឹមម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:10:04.628	2025-11-21 02:13:23.02	teacher	production	\N	៩០១២	4
2708	\N	30	សុខឃឿន កលិកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:14:06.288	2025-11-21 02:14:26.344	teacher	production	\N	៩០១៣	4
2710	\N	30	ឡេក ម៉េងស៊ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:14:57.557	2025-11-21 02:15:23.088	teacher	production	\N	៩០១៤	4
2712	\N	30	អៃ យូបសពីរីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:15:52.002	2025-11-21 02:17:07.454	teacher	production	\N	៩០១៥	4
2714	\N	30	លាភ រស្មី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:18:11.369	2025-11-21 02:18:38.725	teacher	production	\N	៩០១៦	4
2715	\N	30	វ៉ាន់ឌី ម៉ារ៉ាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:19:08.769	2025-11-21 02:19:44.021	teacher	production	\N	៩០១៧	4
2716	\N	30	ដា គឹមហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:20:09.837	2025-11-21 02:20:31.018	teacher	production	\N	៩០១៩	4
2717	\N	30	ដា ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:20:59.613	2025-11-21 02:21:21.316	teacher	production	\N	៩០២០	4
2718	\N	30	អ៊ាង ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	57	f	f	\N	2025-11-21 02:21:42.208	2025-11-21 02:22:03.463	teacher	production	\N	៩០២១	4
2706	\N	8	អ៉ឹម ម៉ាថេ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 02:11:48.255	2025-11-21 02:22:54.097	teacher	production	\N	56773	5
2719	\N	30	គី ថៃណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:24:11.934	2025-11-21 02:24:39.458	teacher	production	\N	9021	5
2720	\N	16	គេង ឆានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:24:39.271	2025-11-21 02:24:39.271	teacher	production	\N	598	4
2721	\N	30	ឆេង គ្រីណាឌីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:25:02.349	2025-11-21 02:25:25.513	teacher	production	\N	9022	5
2723	\N	30	ណាសៀត ខេរ៉ុល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:25:54.789	2025-11-21 02:26:16.326	teacher	production	\N	9023	5
2725	\N	30	តាក់ ចាន់ណាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:26:38.239	2025-11-21 02:27:05.55	teacher	production	\N	9025	5
2728	\N	30	ផុស សុផាន់ណាត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:27:50.479	2025-11-21 02:28:14.335	teacher	production	\N	9026	5
2729	\N	30	ផេន ផាន់ដាណែត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:28:37.424	2025-11-21 02:28:55.855	teacher	production	\N	9027	5
2732	\N	30	ផៃ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:29:39.687	2025-11-21 02:30:02.578	teacher	production	\N	9028	5
2733	\N	30	ពិសិដ្ឋ មិថុនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:30:28.183	2025-11-21 02:30:49.154	teacher	production	\N	9029	5
2734	\N	30	ពេជ្រ ចិន្រ្តា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:31:12.282	2025-11-21 02:31:37.254	teacher	production	\N	9030	5
2735	\N	30	យូ កើសនីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:32:00.074	2025-11-21 02:32:22.736	teacher	production	\N	9031	5
2738	\N	30	រិន​ លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:34:08.842	2025-11-21 02:34:32.814	teacher	production	\N	9032	5
2740	\N	30	រិន សំណាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:34:55.152	2025-11-21 02:35:15.202	teacher	production	\N	9033	5
2741	\N	30	វិរៈ សុរៈយុទ្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:35:43.518	2025-11-21 02:36:08.257	teacher	production	\N	9034	5
2742	\N	30	វី រាវុធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:36:26.766	2025-11-21 02:36:47.505	teacher	production	\N	9035	5
2743	\N	16	អ៊ុន ចាន់វិច្ចរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:36:39.657	2025-11-21 02:39:49.559	teacher	production	\N	599	4
2739	\N	16	វ៉ែន សំណាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:34:10.895	2025-11-21 02:40:54.316	teacher	production	\N	613	4
2737	\N	16	បូរ​ សុដាវី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:32:56.062	2025-11-21 02:41:58.819	teacher	production	\N	607	4
2736	\N	16	ធឿប ប៊ុនធីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:32:08.95	2025-11-21 02:42:39.695	teacher	production	\N	602	4
2726	\N	16	ថៃ សេងហាំង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:27:29.792	2025-11-21 02:43:49.32	teacher	production	\N	619	4
2724	\N	16	គុណ ធារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:26:07.192	2025-11-21 02:45:08.475	teacher	production	\N	603	4
2722	\N	16	ខុម ច័ន្ទទីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:25:18.616	2025-11-21 02:46:00.494	teacher	production	\N	600	4
2744	\N	30	សាន សុភក្តី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:37:10.565	2025-11-21 02:37:34.635	teacher	production	\N	9037	5
2749	\N	30	សារ៉េត រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:39:34.257	2025-11-21 02:39:54.902	teacher	production	\N	9040	5
2750	\N	30	សុខ ជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:40:13.047	2025-11-21 02:40:33.52	teacher	production	\N	9041	5
2751	\N	30	សុខហេង ចាន់ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:40:53.437	2025-11-21 02:41:15.397	teacher	production	\N	9042	5
2745	\N	16	រឿន សុខលី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:37:14.025	2025-11-21 02:38:16.521	teacher	production	\N	675	4
2747	\N	30	សាកូត គូប៉ុលហ្វាស្នា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:38:03.482	2025-11-21 02:38:23.676	teacher	production	\N	9038	5
2748	\N	30	សារ៉ុន ហេងទី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:38:49.391	2025-11-21 02:39:08.715	teacher	production	\N	9039	5
2752	\N	30	សុធឿន មនោ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:41:44.702	2025-11-21 02:42:08.998	teacher	production	\N	9043	5
2753	\N	30	សុភាត សេងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:42:31.895	2025-11-21 02:42:52.992	teacher	production	\N	9044	5
2754	\N	30	សុវណ្ណៈ គីមហ័រ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:43:12.514	2025-11-21 02:43:36.028	teacher	production	\N	9046	5
2755	\N	30	សឿន ចរិយា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:43:56.634	2025-11-21 02:44:18.163	teacher	production	\N	9048	5
2756	\N	30	ហាក់ កនិ្នដ្ឋា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:44:39.059	2025-11-21 02:45:01.721	teacher	production	\N	9049	5
2757	\N	30	ហុង ចាន់សុគន្ឋ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:45:36.118	2025-11-21 02:45:53.338	teacher	production	\N	9050	5
2758	\N	30	ហោ ចំរ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:46:20.211	2025-11-21 02:46:44.379	teacher	production	\N	9051	5
2759	\N	30	ឡុង លីហាក់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:47:05.434	2025-11-21 02:47:38.037	teacher	production	\N	9053	5
2761	\N	30	ឡេ ម៉ានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:47:58.182	2025-11-21 02:48:17.572	teacher	production	\N	9055	5
2760	\N	16	ភោគ ដាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:47:42.908	2025-11-21 02:48:39.79	teacher	production	\N	651	4
2762	\N	30	ឡេះ ហ្វាទីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	58	f	f	\N	2025-11-21 02:48:36.642	2025-11-21 02:48:53.399	teacher	production	\N	9056	5
2764	\N	16	ថាន រ៉ាឆាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:50:33.614	2025-11-21 02:51:20.952	teacher	production	\N	៥៩០	4
2763	\N	16	ណាង លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	113	f	f	\N	2025-11-21 02:49:51.802	2025-11-21 02:52:10.39	teacher	production	\N	៦០៥	4
2765	\N	29	កើ អាហ្វីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 02:55:36.937	2025-11-21 02:56:04.363	teacher	production	\N	9060	4
2766	\N	29	ក្រី កុលឡានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 02:56:28.527	2025-11-21 02:56:52.233	teacher	production	\N	9061	4
2767	\N	29	ខែង សុភា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 02:57:12.94	2025-11-21 02:57:50.079	teacher	production	\N	9063	4
2768	\N	29	ហ្គោនី សាហ្វីកោះ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 02:58:13.179	2025-11-21 02:58:49.907	teacher	production	\N	9064	4
2769	\N	29	ធារ៉ា សុខនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 02:59:14.403	2025-11-21 02:59:46.301	teacher	production	\N	9065	4
2770	\N	29	នី ហ្វារី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:00:07.828	2025-11-21 03:00:37.564	teacher	production	\N	9066	4
2771	\N	29	ប៊ុនណាត ចន្ទរក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:01:13.897	2025-11-21 03:01:47.543	teacher	production	\N	9067	4
2772	\N	29	ភ័ក ស្រីពា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:02:08.294	2025-11-21 03:02:37.507	teacher	production	\N	9068	4
2774	\N	29	រ៉នី ហ្វាអ៊ីហ្សះ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:03:07.107	2025-11-21 03:03:30.068	teacher	production	\N	9069	4
2775	\N	29	លាង ស្រីតី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:03:59.42	2025-11-21 03:04:32.729	teacher	production	\N	9070	4
2776	\N	29	លាង ម៉ែនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:05:14.098	2025-11-21 03:05:45.91	teacher	production	\N	9071	4
2777	\N	29	លីម ដារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:06:07.274	2025-11-21 03:06:37.396	teacher	production	\N	9072	4
2778	\N	29	សារី រ៉នី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:06:57.804	2025-11-21 03:07:24.133	teacher	production	\N	9073	4
2779	\N	29	សុខនី សុវណ្ណវីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:07:47.093	2025-11-21 03:08:15.017	teacher	production	\N	9074	4
2780	\N	29	សុទ្ឋ ពិសី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:08:51.573	2025-11-21 03:09:14.805	teacher	production	\N	9078	4
2781	\N	29	សែ ម៉េងសែម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:09:46.196	2025-11-21 03:10:10.173	teacher	production	\N	9079	4
2782	\N	29	ស្មាឯល អាលីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:10:45.119	2025-11-21 03:11:10.908	teacher	production	\N	9080	4
2783	\N	29	ហ៊ូវ ម៉ូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:11:33.002	2025-11-21 03:11:52.581	teacher	production	\N	9081	4
2784	\N	29	អុន ផល្លា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:12:15.684	2025-11-21 03:12:44.02	teacher	production	\N	9082	4
2785	\N	29	កន ពិសី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:13:10.086	2025-11-21 03:13:44.966	teacher	production	\N	9083	4
2786	\N	29	កូបហាំម៉ាត់ ហ្គោលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:14:09.636	2025-11-21 03:14:36.785	teacher	production	\N	9085	4
2787	\N	29	គ្រី ហ្សាលីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:15:02.14	2025-11-21 03:15:25.464	teacher	production	\N	9086	4
2788	\N	29	ឃួន សៀវអ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:15:47.562	2025-11-21 03:16:09.861	teacher	production	\N	9088	4
2789	\N	29	ប៊ុនណាត ចន្ទលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:16:26.887	2025-11-21 03:17:10.546	teacher	production	\N	9089	4
2790	\N	29	នី ហ្វីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:17:48.402	2025-11-21 03:18:12.223	teacher	production	\N	9111	4
2791	\N	29	យូសុះ នីយ៉ាណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:18:34.593	2025-11-21 03:20:26.628	teacher	production	\N	9112	4
2792	\N	29	រ៉សេត នូអៃនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:21:06.241	2025-11-21 03:21:51.313	teacher	production	\N	9013	4
2793	\N	29	រ៉សេត ហាំម៉ាត់ហ្សៃហ្វូល 	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:22:27.628	2025-11-21 03:22:51.91	teacher	production	\N	9014	4
2794	\N	29	លី ហ្វីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:23:09.609	2025-11-21 03:23:33.092	teacher	production	\N	9015	4
2795	\N	29	វុទ្ឋ ចន្ទធី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:23:55.339	2025-11-21 03:24:12.505	teacher	production	\N	9016	4
2796	\N	29	សួ គីមល័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:24:36.23	2025-11-21 03:24:53.498	teacher	production	\N	9018	4
2797	\N	29	សារី ហ្វាហ្សី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:25:30.533	2025-11-21 03:25:55.705	teacher	production	\N	9019	4
2798	\N	29	ហាំពលី រ៉ូហានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:26:19.016	2025-11-21 03:26:49.303	teacher	production	\N	9020	4
2803	\N	29	ស្លេះ សាគីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:28:12.999	2025-11-21 03:28:34.323	teacher	production	\N	9130	4
2804	\N	29	លី ចិន្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:28:59.507	2025-11-21 03:29:23.199	teacher	production	\N	9125	4
2805	\N	29	អ៊ែល រ៉ូស៊ីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:29:46.602	2025-11-21 03:30:13.803	teacher	production	\N	9127	4
2808	\N	29	អ៊ែល អារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:30:47.115	2025-11-21 03:31:22.251	teacher	production	\N	9129	4
2810	\N	29	សេន ហាណាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:32:06.715	2025-11-21 03:32:51.328	teacher	production	\N	9139	4
2811	\N	29	ហ្វា អ៊ីលីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	106	f	f	\N	2025-11-21 03:33:15.66	2025-11-21 03:33:39.613	teacher	production	\N	9131	4
2812	\N	29	ណុយ រ៉ហ៊ីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:37:55.042	2025-11-21 03:38:18.387	teacher	production	\N	9141	5
2814	\N	29	ងីម ឆារ៉ាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:39:02.845	2025-11-21 03:39:35.308	teacher	production	\N	9241	5
2815	\N	29	ឋាន ថាវរៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:40:11.282	2025-11-21 03:40:36.222	teacher	production	\N	9342	5
2816	\N	29	ណុយ រ៉ហ៊ីនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:41:01.298	2025-11-21 03:41:25.454	teacher	production	\N	9343	5
2817	\N	29	ភាព សៀវអ៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:41:58.092	2025-11-21 03:42:20.084	teacher	production	\N	9344	5
2818	\N	29	ភាព ហេងលាភ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:42:43.266	2025-11-21 03:43:07.132	teacher	production	\N	9345	5
2819	\N	29	មុំ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:43:33.1	2025-11-21 03:43:53.055	teacher	production	\N	9346	5
2821	\N	29	យែម ស្រីល័ក្ខ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:44:28.193	2025-11-21 03:44:55.49	teacher	production	\N	9347	5
2822	\N	29	រ៉ា អេរិច	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:45:26.111	2025-11-21 03:45:49.232	teacher	production	\N	9348	5
2823	\N	29	លន់ ស្រីស្រស់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:46:19.614	2025-11-21 03:46:42.76	teacher	production	\N	9349	5
2824	\N	29	លី រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:47:05.785	2025-11-21 03:47:27.871	teacher	production	\N	9350	5
2825	\N	29	វុទ្ឋា ស្រីពេជ្រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:47:59.47	2025-11-21 03:48:22.401	teacher	production	\N	9351	5
2826	\N	29	វាសនា សុភ័ត្រ្តា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:48:51.669	2025-11-21 03:49:08.303	teacher	production	\N	9352	5
2827	\N	29	សារី ស៊ុលកីផ្លី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:49:41.91	2025-11-21 03:50:05.825	teacher	production	\N	9354	5
2828	\N	29	សម្បត្តិ ហេងទូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:51:30.895	2025-11-21 03:52:05.092	teacher	production	\N	9356	5
2829	\N	29	ស៊ឺន ស៊ឹងថាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:52:33.109	2025-11-21 03:53:04.219	teacher	production	\N	9357	5
2830	\N	29	សិដ្ឋ សុវណ្ណរស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:53:26.344	2025-11-21 03:53:50.921	teacher	production	\N	9358	5
2831	\N	29	សួ ឈុនសែ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:54:24.899	2025-11-21 03:54:48.8	teacher	production	\N	9359	5
2832	\N	29	សារី រ៉ូយ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:55:15.961	2025-11-21 03:55:43.235	teacher	production	\N	9360	5
2833	\N	29	សុទះ សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:56:06.596	2025-11-21 03:56:30.051	teacher	production	\N	9361	5
2834	\N	29	សុខគ្រី សាលីម៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_1digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:57:10.008	2025-11-21 03:57:36.626	teacher	production	\N	9370	5
2835	\N	29	ហឿន ឆេងលីម	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:58:00.263	2025-11-21 03:58:22.086	teacher	production	\N	9371	5
2836	\N	29	ហ៊ូសេន សាគីរ៉ស់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:59:04.14	2025-11-21 03:59:25.097	teacher	production	\N	9374	5
2837	\N	29	អាន អារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 03:59:46.588	2025-11-21 04:00:06.292	teacher	production	\N	9376	5
2838	\N	29	សុះ អ៊ីមរ៉ន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 04:00:35.587	2025-11-21 04:01:01.721	teacher	production	\N	9377	5
2839	\N	29	ថន តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 04:01:20.243	2025-11-21 04:01:46.638	teacher	production	\N	9378	5
2840	\N	29	ថា ម៉េងលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 04:02:14.032	2025-11-21 04:02:41.942	teacher	production	\N	9381	5
2841	\N	29	ធឿន សៅហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 04:03:08.367	2025-11-21 04:03:29.893	teacher	production	\N	9382	5
2147	\N	1	រឿន សុធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:10:13.705	2025-11-21 04:05:59.899	teacher	archived	\N	1388	4
2132	\N	1	ពៅ វុទ្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 13:04:28.852	2025-11-21 04:06:08.447	teacher	archived	\N	1146	4
2088	\N	1	ងិន​ ច័ន្ទសុភ័ត្រ្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	f	30	f	f	\N	2025-11-20 12:49:30.609	2025-11-21 04:06:49.597	teacher	archived	\N	1431	4
2643	\N	8	សួន ឆេងស៊ីម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:27:33.982	2025-11-21 04:24:57.749	teacher	production	\N	56423	5
2585	\N	8	ចក់ ហេងសុផាឡែន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 01:11:52.183	2025-11-21 04:32:31.564	teacher	production	\N	56554	5
2853	\N	5	សឿន​ តុលា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:34:45.15	2025-11-21 04:36:29.587	teacher	production	\N	988968	5
2852	\N	5	លៀម​ ចាន់ឡុង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:34:12.34	2025-11-21 04:39:10.421	teacher	production	\N	353480	5
2663	\N	13	វុទ្ធី មុន្នីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:36:03.123	2025-11-21 04:40:14.001	teacher	production	\N	3687	5
2851	\N	5	ទៀង​ យូអ៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:33:18.305	2025-11-21 04:40:27.147	teacher	production	\N	834213	5
2850	\N	5	គា​ ឧស្សាហ៍​	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:31:47.001	2025-11-21 04:41:52.457	teacher	production	\N	919496	5
2849	\N	5	ឌី​ សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:31:13.842	2025-11-21 04:43:31.478	teacher	production	\N	123456	5
2848	\N	5	លៀម​ សុខលី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:30:32.62	2025-11-21 04:44:25.546	teacher	production	\N	580138	5
2847	\N	5	នួន​ សុវណ្ណ​មុន្នី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:29:47.433	2025-11-21 04:45:48.122	teacher	production	\N	445808	5
2846	\N	5	សាម៉េត​ បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:28:50.78	2025-11-21 04:46:40.826	teacher	production	\N	439209	5
2845	\N	5	រ៉ាន់​ ណារីម	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:28:07.845	2025-11-21 04:47:32.607	teacher	production	\N	126245	5
2844	\N	5	យ៉ីន​ ភក្ដី​	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:25:12.867	2025-11-21 04:48:05.871	teacher	production	\N	600223	5
2843	\N	5	យាំង​ ចំរេីន	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 04:21:25.408	2025-11-21 04:48:55.435	teacher	production	\N	181707	5
1951	\N	5	ឡុង​ លីដា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:39:45.305	2025-11-21 04:49:40.593	teacher	production	\N	424998	5
2854	\N	27	គ្រី រតនះសម្បត្តិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:50:06.132	2025-11-21 04:50:39.816	teacher	production	\N	253002	4
2856	\N	27	ង៉ែត យ៉ាងយ៉ាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:51:06.433	2025-11-21 04:51:46.451	teacher	production	\N	253003	4
2857	\N	8	ឃី ម៉ាន់ទី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	34	f	f	\N	2025-11-21 04:51:13.364	2025-11-21 04:51:54.95	teacher	production	\N	5640	5
2858	\N	27	ចាន់ធូ យ៉ារត្ន័	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:52:12.985	2025-11-21 04:52:35.423	teacher	production	\N	253004	4
2859	\N	27	ឆាត ឈីងឈីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:52:59.931	2025-11-21 04:53:18.584	teacher	production	\N	253005	4
1851	\N	9	សុវណ្ណរ៉ាក់ ចន្ដាមុន្នី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:13:27.457	2025-11-21 04:54:33.038	teacher	production	\N	043	5
2860	\N	27	ជា ធារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:54:22.897	2025-11-21 04:54:50.656	teacher	production	\N	253039	4
2861	\N	27	ឈាង ដេវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:55:16.912	2025-11-21 04:55:41.621	teacher	production	\N	253006	4
2862	\N	27	ដន បញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:56:04.305	2025-11-21 04:56:25.754	teacher	production	\N	254008	4
2863	\N	27	ដោរ ហេងលាភ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:56:58.018	2025-11-21 04:57:22.625	teacher	production	\N	253008	4
2864	\N	27	ឌីណា រះសិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:57:53.449	2025-11-21 04:58:18.292	teacher	production	\N	253009	4
2865	\N	27	ណេង រ៉ានី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 04:58:46.609	2025-11-21 04:59:06.805	teacher	production	\N	254009	4
2868	\N	27	តូលី ណាវីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:00:00.433	2025-11-21 05:00:23.244	teacher	production	\N	25300	4
1822	\N	9	ផាត សុខស្រីលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	38	f	f	\N	2025-11-20 10:07:31.298	2025-11-21 05:00:43.132	teacher	production	\N	053	5
2870	\N	27	តេង មានហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:00:56.841	2025-11-21 05:01:19.153	teacher	production	\N	53009	4
2872	\N	27	ថុល ធីរក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:01:55.309	2025-11-21 05:02:32.991	teacher	production	\N	23008	4
2874	\N	27	ថុល ម៉ាលីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:03:12.53	2025-11-21 05:03:41.232	teacher	production	\N	453009	4
2875	\N	27	ធា លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:04:12.274	2025-11-21 05:04:38.751	teacher	production	\N	253024	4
2876	\N	27	ភា ស្រីម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:05:08.274	2025-11-21 05:05:36.02	teacher	production	\N	253019	4
2877	\N	27	ភាព សុភី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:06:02.797	2025-11-21 05:06:26.443	teacher	production	\N	254013	4
2878	\N	27	ម៉េង សៀវហ័រ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:06:57.805	2025-11-21 05:07:25.729	teacher	production	\N	253020	4
2879	\N	27	វណ្ណ មង្គល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:07:50.57	2025-11-21 05:08:17.793	teacher	production	\N	253021	4
2880	\N	27	វ៉ែន ស្រីពីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:08:44.792	2025-11-21 05:09:29.189	teacher	production	\N	254052	4
2881	\N	27	សាន លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:09:57.05	2025-11-21 05:10:21.909	teacher	production	\N	253022	4
2882	\N	27	សុក ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:10:56.367	2025-11-21 05:11:17.26	teacher	production	\N	253023	4
2884	\N	27	សឿន កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:14:12.737	2025-11-21 05:14:38.579	teacher	production	\N	253026	4
2883	\N	27	សុភាព ជីងហ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:11:46.768	2025-11-21 05:13:21.179	teacher	production	\N	253025	4
2885	\N	27	សឿន គីមឡាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:15:07.734	2025-11-21 05:15:51.069	teacher	production	\N	253027	4
2886	\N	27	សៀក ស្រីលាភ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:19:45.964	2025-11-21 05:20:09.536	teacher	production	\N	253028	4
2887	\N	27	សេង រចនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:20:51.561	2025-11-21 05:21:39.281	teacher	production	\N	253029	4
2888	\N	27	ហុន ជីមីង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:22:45.379	2025-11-21 05:23:20.684	teacher	production	\N	253030	4
2889	\N	27	ឡាយ ស្រីអ៊ីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:24:02.737	2025-11-21 05:24:33.441	teacher	production	\N	253067	4
2890	\N	27	អន រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:24:57.996	2025-11-21 05:25:25.782	teacher	production	\N	253031	4
2891	\N	27	អន លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:26:06.055	2025-11-21 05:26:37.229	teacher	production	\N	253032	4
2892	\N	27	អ៊ា ជីងហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:27:14.836	2025-11-21 05:27:39.466	teacher	production	\N	253033	4
2893	\N	27	អុល ម៉េងស៊ីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	119	f	f	\N	2025-11-21 05:28:15.084	2025-11-21 05:28:36.456	teacher	production	\N	253034	4
1870	\N	9	ធីម រាជនី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:17:54.862	2025-11-21 05:35:26.274	teacher	production	\N	027	4
2899	\N	29	ស៊ុំ ណាធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	56	f	f	\N	2025-11-21 05:45:51.791	2025-11-21 05:46:29.541	teacher	production	\N	9254	5
2630	\N	13	រឿន ផាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	42	f	f	\N	2025-11-21 01:23:44.314	2025-11-21 05:48:20.293	teacher	production	\N	3309	5
1929	\N	9	សៃ សាគិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	44	f	f	\N	2025-11-20 10:34:14.257	2025-11-21 05:53:20.57	teacher	production	\N	007	4
2918	\N	1	សេង​ សុធីរា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:56:20.198	2025-11-21 06:14:46.79	teacher	production	\N	5015	4
2917	\N	1	រេីន​ សុខ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:56:00.868	2025-11-21 06:15:24.237	teacher	production	\N	5014	4
2916	\N	1	រ៉ាន់​ រិទ្ធិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:55:29.878	2025-11-21 06:16:10.695	teacher	production	\N	5013	4
2915	\N	1	រ៉ន​ សូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:55:08.529	2025-11-21 06:16:35.644	teacher	production	\N	5012	4
2914	\N	1	មុំ​ វីរៈឆាយ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:54:49.565	2025-11-21 06:17:05.733	teacher	production	\N	5011	4
2913	\N	1	ពៅ​ វុទ្ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:54:30.056	2025-11-21 06:18:47.505	teacher	production	\N	5010	4
2911	\N	1	ប៉ៃ​ ម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:53:35.799	2025-11-21 06:20:24.522	teacher	production	\N	5008	4
2910	\N	1	បញ្ញា​ ចន្ទរតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:53:12.178	2025-11-21 06:20:52.596	teacher	production	\N	5007	4
2909	\N	1	ណាង​ សុរិយានុត	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:52:43.3	2025-11-21 06:21:17.87	teacher	production	\N	5006	4
2908	\N	1	ឌឹម​ លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:52:11.32	2025-11-21 06:21:55.892	teacher	production	\N	5005	4
2907	\N	1	ឌី​ រាជសី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:51:09.145	2025-11-21 06:22:25.383	teacher	production	\N	5004	4
2906	\N	1	ដឿន​ ពៅ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:50:49.155	2025-11-21 06:22:49.021	teacher	production	\N	5003	4
2905	\N	1	ចិន​ នេសា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:50:00.623	2025-11-21 06:23:15.552	teacher	production	\N	5002	4
2904	\N	1	ចន​ គឹមហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:49:19.537	2025-11-21 06:23:47.742	teacher	production	\N	5001	4
2929	\N	1	រ័ត្ន​ រីមុន្នីរណ្ណ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 06:01:56.603	2025-11-21 06:06:20.915	teacher	production	\N	5026	4
2928	\N	1	ផាន​ ណារីន	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 06:01:12.19	2025-11-21 06:07:31.112	teacher	production	\N	5025	4
2927	\N	1	រឿន​ សុធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 06:00:49.962	2025-11-21 06:08:17.316	teacher	production	\N	5024	4
2926	\N	1	ឡាលីន​ យ៉ូស៊ីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 06:00:25.78	2025-11-21 06:09:31.724	teacher	production	\N	5023	4
2925	\N	1	ហុង​ ឡៃហ៊ុន	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 06:00:00.438	2025-11-21 06:10:26.887	teacher	production	\N	5022	4
2273	\N	15	ហ៊ាង លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:19:57.725	2025-11-21 06:10:32.829	teacher	production	\N	1132	4
2924	\N	1	ស៊ុយ​ ហាប់ស៊ាវជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:59:27.681	2025-11-21 06:11:14.653	teacher	production	\N	5021	4
2923	\N	1	សេង​ គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:59:04.173	2025-11-21 06:11:49.112	teacher	production	\N	5020	4
2922	\N	1	សូរ​ អាលីយ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:58:37.07	2025-11-21 06:12:25.139	teacher	production	\N	5019	4
2921	\N	1	សុខ​ កានដា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:58:05.676	2025-11-21 06:13:01.175	teacher	production	\N	5018	4
2920	\N	1	សុបិន្ត​ រុងរឿង	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:57:15.512	2025-11-21 06:13:39.894	teacher	production	\N	5017	4
2919	\N	1	សាត​ គុណវឌ្ឍន៍	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:56:44.628	2025-11-21 06:14:18.514	teacher	production	\N	5016	4
2268	\N	15	រ៉ា រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 14:15:17.141	2025-11-21 06:18:49.812	teacher	production	\N	1127	4
2912	\N	1	ពុទ្ធី​ គីមហាន	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:54:02.221	2025-11-21 06:19:22.678	teacher	production	\N	5009	4
2903	\N	1	ងិន​ ច័ន្ទសុភ័ក្ត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	30	f	f	\N	2025-11-21 05:47:54.34	2025-11-21 06:24:10.066	teacher	production	\N	5000	4
1466	\N	15	នី លីហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	118	f	f	\N	2025-11-20 07:58:29.845	2025-11-21 06:30:42.703	teacher	production	\N	78	4
2957	\N	1	អិល​ វិទូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:41:13.097	2025-11-21 06:43:51.89	teacher	production	\N	5054	5
2956	\N	1	អាន​ សេងហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:40:52.575	2025-11-21 06:44:30.469	teacher	production	\N	5053	5
2955	\N	1	ឧត្តម​ បញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:40:32.096	2025-11-21 06:45:17.249	teacher	production	\N	5052	5
2954	\N	1	ឧកញ្ញា​ សុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:40:06.835	2025-11-21 06:45:46.749	teacher	production	\N	5051	5
2953	\N	1	ឡុង​ ជីនណា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:39:44.736	2025-11-21 06:46:33.865	teacher	production	\N	5050	5
2952	\N	1	ហឿត​ យ៉ាស្មីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:39:21.138	2025-11-21 06:46:58.894	teacher	production	\N	5049	5
2951	\N	1	ស្រាន​ សុខចំរេីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:38:57.069	2025-11-21 06:47:28.566	teacher	production	\N	5048	5
2950	\N	1	សៀន​ សៀងហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:37:29.488	2025-11-21 06:47:55.7	teacher	production	\N	5047	5
2949	\N	1	សឿង​ សាមិនតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:37:05.172	2025-11-21 06:48:22.268	teacher	production	\N	5046	5
2948	\N	1	សម្បូណ៍​ ម៉ីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:36:47.041	2025-11-21 06:48:51.639	teacher	production	\N	5045	5
2947	\N	1	វុន​ សីហាបញ្ញារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:36:03.174	2025-11-21 06:49:20.135	teacher	production	\N	5044	5
2946	\N	1	វិចិត្រ​ ជីសៀន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:35:15.5	2025-11-21 06:49:51.802	teacher	production	\N	5043	5
2945	\N	1	វណ្ណី​ សុភ័ក្ត្រា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:34:54.3	2025-11-21 06:50:26.215	teacher	production	\N	5042	5
2944	\N	1	រិទ្ធ​ រ៉ាដូរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:33:59.272	2025-11-21 06:50:52.239	teacher	production	\N	5041	5
2943	\N	1	រស់​ មង្គលវីឆែ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:33:35.666	2025-11-21 06:51:15.65	teacher	production	\N	5040	5
2942	\N	1	យ៉ា​ ធារ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:33:13.207	2025-11-21 06:51:46.724	teacher	production	\N	5039	5
2941	\N	1	ម៉ៅ​ សុរិយា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:32:51.417	2025-11-21 06:52:08.002	teacher	production	\N	5038	5
2940	\N	1	ម៉ៃ​ រ៉ាចន្ទ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:32:29.058	2025-11-21 06:52:37.935	teacher	production	\N	5037	5
2939	\N	1	ម៉ែន​ សុមុនីរ័ត្ន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:32:00.276	2025-11-21 06:53:07.22	teacher	production	\N	5036	5
2938	\N	1	ម៉ី​ សុខរ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:31:33.841	2025-11-21 06:53:32.442	teacher	production	\N	5035	5
2937	\N	1	ព្រឹក​ ឡាក់សាមី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:31:15.405	2025-11-21 06:53:58.124	teacher	production	\N	5034	5
2936	\N	1	ផត់​ ភក្តី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:30:58.11	2025-11-21 06:54:30.822	teacher	production	\N	5033	5
2935	\N	1	ថន​ គង់សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:29:51.695	2025-11-21 06:54:56.653	teacher	production	\N	5032	5
2934	\N	1	ដេតឌី​ គង់សំបូរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:29:08.918	2025-11-21 06:59:11.959	teacher	production	\N	5031	5
2933	\N	1	ឈុយ​ រីឆាត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:28:41.763	2025-11-21 06:59:35.742	teacher	production	\N	5030	5
2932	\N	1	ជម​ សុភ័ក្រ្តត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:28:17.945	2025-11-21 07:00:02.742	teacher	production	\N	5029	5
2931	\N	1	ចាន់​ ដាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:27:45.224	2025-11-21 07:00:32.954	teacher	production	\N	5028	5
2930	\N	1	កង​ រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	109	f	f	\N	2025-11-21 06:27:09.126	2025-11-21 07:00:54.255	teacher	production	\N	5027	5
2959	\N	15	កុង ស្រីនាង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:02:54.781	2025-11-22 00:49:38.609	teacher	production	\N	2012	5
1699	\N	27	ប្រេ ដាលីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:20:47.246	2025-11-21 07:20:09.514	teacher	production	\N	254012	5
1721	\N	27	វឿន ស៊ូហាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:27:25.586	2025-11-21 07:28:51.596	teacher	production	\N	254023	5
1737	\N	27	សេរី ស្រីរត្ន័	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-20 09:34:18.489	2025-11-21 07:35:36.758	teacher	production	\N	254029	5
2982	\N	20	ជឹង លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:39:14.037	2025-11-21 07:39:14.037	teacher	production	\N	៣៦	5
2990	\N	27	ធា លីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-21 07:43:53.435	2025-11-21 07:44:38.733	teacher	production	\N	253017	4
2992	\N	27	បញ្ញា លីហួរ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	105	f	f	\N	2025-11-21 07:45:29.451	2025-11-21 07:45:59.371	teacher	production	\N	253016	4
3012	\N	20	ហ៊ុន សុវណ្ណវឌ្ឍនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 08:01:07.794	2025-11-21 08:01:07.794	teacher	production	\N	៥៥	5
2978	\N	20	គឿន ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:37:16.199	2025-11-21 10:53:28.156	teacher	production	\N	២២២	5
2979	\N	20	ឃីម គីមហ៑ាន់	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:37:48.207	2025-11-21 10:56:32.315	teacher	production	\N	៣៣	5
2980	\N	20	ជា ឡៅហ៊ូ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:38:17.068	2025-11-21 10:57:00.228	teacher	production	\N	៣៤	5
2981	\N	20	ជិនចន្ទ វីរៈបុត្រ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:38:48.061	2025-11-21 10:57:52.614	teacher	production	\N	៣៥	5
2989	\N	20	ជឹង លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:43:41.363	2025-11-21 10:58:30.27	teacher	production	\N	៣៩	5
2983	\N	20	ឌន ស្រីនូ	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:39:32.487	2025-11-21 10:59:17.979	teacher	production	\N	៣៧	5
2987	\N	20	ណន ដាលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:42:50.128	2025-11-21 11:00:50.123	teacher	production	\N	៣៨	5
2991	\N	20	ធារ៉ា សោភា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:44:38.045	2025-11-21 11:01:40.072	teacher	production	\N	៤០	5
2993	\N	20	ថាច សុខគា	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:45:52.173	2025-11-21 11:47:52.511	teacher	production	\N	៤១	5
2994	\N	20	ថន ជូមិត្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:46:38.834	2025-11-21 11:48:27.983	teacher	production	\N	៤២	5
2995	\N	20	ថែន ចាន់រ៉ន	\N	female	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:47:53.51	2025-11-21 11:49:18.588	teacher	production	\N	៤៣	5
2996	\N	20	ណាក់ រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:48:39.329	2025-11-21 11:50:06.557	teacher	production	\N	៤៤	5
2997	\N	20	ណាត ឆេងលាភ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:49:20.078	2025-11-21 11:50:38.096	teacher	production	\N	៤៥	5
2999	\N	20	ឆេង កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:50:17.762	2025-11-21 11:51:01.621	teacher	production	\N	៤៦	5
3000	\N	20	ធឿន ភារម្យ	\N	male	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:52:09.39	2025-11-21 11:51:47.301	teacher	production	\N	៤៧	5
3001	\N	20	ប្រុស នីត្រា	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:52:57.815	2025-11-21 11:52:13.131	teacher	production	\N	៤៨	5
3002	\N	20	ផានិត ឡៃហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:53:44.768	2025-11-21 11:52:32.334	teacher	production	\N	៤៩	5
3004	\N	20	ពិសី លីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:54:35.224	2025-11-21 11:52:58.931	teacher	production	\N	៥០	5
3005	\N	20	ពៅ ថៃហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:55:18.522	2025-11-21 11:53:26.089	teacher	production	\N	៥១	5
3007	\N	20	ភា ថាណៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:56:17.822	2025-11-21 11:53:57.74	teacher	production	\N	៥២	5
3008	\N	20	លឹម សុខលាង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:57:14.283	2025-11-21 11:54:19.508	teacher	production	\N	៥៣	5
3010	\N	20	វ៉ាត សុខហ៊ុយ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:58:38.54	2025-11-21 11:54:53.624	teacher	production	\N	៥៤	5
3021	\N	20	យ៉ុន ថាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 08:06:38.434	2025-11-21 11:57:00.93	teacher	production	\N	៥៦	5
3023	\N	20	សិទ្ធ ចិន្ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 08:08:09.181	2025-11-21 11:57:27.305	teacher	production	\N	៥៧	5
3003	\N	15	គង ចំរ៉ុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:54:32.059	2025-11-22 00:41:02.931	teacher	production	\N	2014	5
2998	\N	15	កុសល់ បូព្រឹក្ស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:49:33.243	2025-11-22 00:52:40.9	teacher	production	\N	20131	5
3009	\N	15	គង់ ធី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:58:18.237	2025-11-22 01:01:02.255	teacher	production	\N	20151	5
3040	\N	15	ភឿន សុផាន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:38:41.412	2025-11-22 01:01:06.845	teacher	production	\N	20312	5
3038	\N	15	ភឿន ចន្ថា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:36:21.535	2025-11-22 01:02:43.918	teacher	production	\N	20300	5
3037	\N	15	ផុន ផាន់នី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:33:36.507	2025-11-22 01:04:35.271	teacher	production	\N	20290	5
3033	\N	15	នាង ទី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:25:46.061	2025-11-22 01:05:56.846	teacher	production	\N	20242	5
3036	\N	15	ប៊ុណ្ណា មិថុនា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:32:12.914	2025-11-22 01:06:13.646	teacher	production	\N	20281	5
3035	\N	15	ប៊ន សុខហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:30:09.083	2025-11-22 01:07:52.481	teacher	production	\N	20270	5
3034	\N	15	នី រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:28:02	2025-11-22 01:09:08.023	teacher	production	\N	20260	5
3032	\N	15	ធី ស្រីណេត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:23:39.08	2025-11-22 01:10:08.512	teacher	production	\N	20240	5
3031	\N	15	ថុល ធីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:21:32.527	2025-11-22 01:11:41.899	teacher	production	\N	20310	5
3014	\N	15	ង៉ាន់ សុីវម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:02:17.157	2025-11-22 01:12:08.573	teacher	production	\N	20171	5
3030	\N	15	ឌីណា សាទីន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:17:06.797	2025-11-22 01:13:12.708	teacher	production	\N	20220	5
3028	\N	15	ដា រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:13:36.846	2025-11-22 01:14:34.711	teacher	production	\N	20210	5
3011	\N	15	គង់ ពីសី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:59:59.973	2025-11-22 01:14:40.483	teacher	production	\N	2016	5
3026	\N	15	ជៀន នីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:09:29.452	2025-11-22 01:16:33.67	teacher	production	\N	20221	5
3020	\N	15	ចំរើន សុវណ្ណរិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:06:23.945	2025-11-22 01:18:20.002	teacher	production	\N	20191	5
3017	\N	15	ចាន់ ហ្វជី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:03:41.471	2025-11-22 01:19:01.554	teacher	production	\N	2018	5
3087	\N	20	ស៑ុន វិច្ចិរ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:44:20.431	2025-11-21 10:44:20.431	teacher	production	\N	៦៥	5
3089	\N	20	សុទ្ធារិទ្ធ លីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:45:06.285	2025-11-21 10:45:06.285	teacher	production	\N	៦៧	5
3072	\N	15	ឡុង ខិចហួង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:40:04.309	2025-11-21 10:59:08.831	teacher	production	\N	20603	5
3091	\N	20	ហ៑ាត់ ឡុងអុី	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:45:50.435	2025-11-21 11:56:22.398	teacher	production	\N	៦៩	5
3079	\N	20	វាសនា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:40:34.284	2025-11-21 11:57:47.423	teacher	production	\N	៥៨	5
3080	\N	20	វ័ន្តពីយ៉ាសា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:41:12.702	2025-11-21 11:58:06.726	teacher	production	\N	៥៩	4
3081	\N	20	សុីណាត រតនា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:41:39.654	2025-11-21 11:58:33.975	teacher	production	\N	៦០	5
3082	\N	20	សុខា កញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:41:59.001	2025-11-21 11:58:53.956	teacher	production	\N	៦១	5
3083	\N	20	រ៉ន រ៉ាត	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:42:28.114	2025-11-21 11:59:16.641	teacher	production	\N	៦២	5
3085	\N	20	នីតា រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:42:58.491	2025-11-21 11:59:35.936	teacher	production	\N	៦៣	5
3086	\N	20	សាន្ត វិបុល	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:43:27.281	2025-11-21 11:59:54.259	teacher	production	\N	៦៤	5
3088	\N	20	សុង គីមលាង	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:44:39.073	2025-11-21 12:01:43.221	teacher	production	\N	៦៦	5
3093	\N	20	សុទ្ធារិទ្ធ លីហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:46:41.055	2025-11-21 12:02:29.655	teacher	production	\N	៧១	5
3090	\N	20	ស្រ៑ាន សុខនី	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:45:30.918	2025-11-21 12:02:46.994	teacher	production	\N	៦៨	5
3092	\N	20	ណុប យ៉ុងហុយ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:46:18.057	2025-11-21 12:03:17.835	teacher	production	\N	៧០	5
3095	\N	20	ហៅ ដានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:47:28.805	2025-11-21 12:04:08.879	teacher	production	\N	៧៣	5
3094	\N	20	ហៅ ដានីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:47:09.177	2025-11-21 12:04:47.342	teacher	production	\N	៧២	5
3096	\N	20	ឡេង អារីយ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:47:52.289	2025-11-21 12:05:11.042	teacher	production	\N	៧៤	5
3097	\N	20	អូន រាជផាន់ណា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:48:12.306	2025-11-21 12:05:36.802	teacher	production	\N	៧៥	5
3098	\N	20	អៀង រ៉ាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:48:42.01	2025-11-21 12:06:03.363	teacher	production	\N	៧៦	5
3071	\N	15	ហេង គឹមហួ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:36:55.531	2025-11-22 00:06:28.237	teacher	production	\N	20602	5
3070	\N	15	ស៊្រូយ លីថា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:35:32.066	2025-11-22 00:12:15.166	teacher	production	\N	20601	5
3069	\N	15	សេង ឣង្គាគុជ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:31:01.457	2025-11-22 00:19:08.894	teacher	production	\N	20600	5
3068	\N	15	សឿត ចាន់រី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:29:02.828	2025-11-22 00:21:01.759	teacher	production	\N	20509	5
3067	\N	15	សួន សាមន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:27:31.33	2025-11-22 00:22:55.048	teacher	production	\N	20508	5
3066	\N	15	សុខ ប៊ីប៊ី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:24:50.394	2025-11-22 00:24:26.162	teacher	production	\N	20506	5
3064	\N	15	សារិត បូរី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:20:51.034	2025-11-22 00:26:19.193	teacher	production	\N	20505	5
3065	\N	15	សុក ស្រីនីត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:21:56.152	2025-11-22 00:29:01.38	teacher	production	\N	20507	5
3063	\N	15	សាន ពីងពីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:19:42.864	2025-11-22 00:30:23.371	teacher	production	\N	20504	5
3062	\N	15	ស៊ុន រក្សា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:18:00.624	2025-11-22 00:30:36.263	teacher	production	\N	20503	5
3061	\N	15	សម្បត្តិ ឆាវិឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:16:47.831	2025-11-22 00:32:01.191	teacher	production	\N	20502	5
3060	\N	15	វ៉េត ភារាជ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:15:21.952	2025-11-22 00:33:44.165	teacher	production	\N	20501	5
3059	\N	15	វឿន លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:13:00.665	2025-11-22 00:35:08.038	teacher	production	\N	20500	5
3057	\N	15	វុត វ៉ាន់ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:09:45.078	2025-11-22 00:37:24.189	teacher	production	\N	20408	5
3058	\N	15	វុត មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:11:16.492	2025-11-22 00:37:55.002	teacher	production	\N	20409	5
3056	\N	15	វិសាល វណ្ណាសុិង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:07:29.792	2025-11-22 00:39:20.79	teacher	production	\N	20407	5
3055	\N	15	វុន តៃវ៉ា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:05:44.21	2025-11-22 00:40:39.378	teacher	production	\N	20406	5
3054	\N	15	វ៉ាត វណ្ណារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:03:49.683	2025-11-22 00:42:00.229	teacher	production	\N	20405	5
3053	\N	15	វណ្ណ: រ៉ានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:02:07.519	2025-11-22 00:43:34.992	teacher	production	\N	20404	5
3052	\N	15	វណ្ណ: ដាណេ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 09:00:14.673	2025-11-22 00:44:11.833	teacher	production	\N	20403	5
3051	\N	15	វង្ស វ៉ាន់ដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:58:36.258	2025-11-22 00:45:50.892	teacher	production	\N	 20402	5
3050	\N	15	លន់ ឡេងឆេងឣុី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:57:16.241	2025-11-22 00:46:41.028	teacher	production	\N	20401	5
3049	\N	15	រឿម ដាលីស	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:55:30.415	2025-11-22 00:48:02.486	teacher	production	\N	203400	5
3048	\N	15	រឿង ធេវ៉ា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:53:58.397	2025-11-22 00:49:39.737	teacher	production	\N	20390	5
3047	\N	15	រី សារិទ្ធ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:51:33.018	2025-11-22 00:51:00.706	teacher	production	\N	20380	5
3046	\N	15	រី រក្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:50:02.736	2025-11-22 00:52:25.964	teacher	production	\N	20370	5
3045	\N	15	រី ធារី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:48:50.042	2025-11-22 00:54:05.73	teacher	production	\N	20360	5
3043	\N	15	ម៉ៅ សុខកញ្ញា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:44:51.788	2025-11-22 00:55:59.474	teacher	production	\N	20340	5
3042	\N	15	ម៉ៅ ថានន់	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:43:21.423	2025-11-22 00:57:16.187	teacher	production	\N	20333	5
3044	\N	15	យ៉ាត ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:46:11.735	2025-11-22 00:57:36.926	teacher	production	\N	30350	5
3041	\N	15	ម៉េង ដាវី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	subtraction	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 08:41:22.744	2025-11-22 00:59:29.742	teacher	production	\N	20321	5
3099	\N	20	ប៑ុននី ស្រីលីន	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 10:49:10.522	2025-11-21 10:51:02.293	teacher	production	\N	៧៧	5
2977	\N	20	ខុម ដាលី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	68	f	f	\N	2025-11-21 07:35:13.668	2025-11-21 10:52:29.089	teacher	production	\N	១១១	5
3101	\N	5	គង់​ វ៉ាន់នី	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 10:53:00.421	2025-11-22 03:35:48.122	teacher	production	\N	726123	4
3102	\N	5	ថុន​ មករា	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 10:53:51.518	2025-11-22 03:37:21.317	teacher	production	\N	410822	4
3103	\N	5	សែម​ ម៉ែដាម	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 10:59:11.96	2025-11-22 03:38:59.143	teacher	production	\N	636694	4
3104	\N	5	ឈុនលី​ សៀវម៉ី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 11:00:07.926	2025-11-22 03:39:53.04	teacher	production	\N	938118	4
3105	\N	5	សំណាង​ ពេជ្រចន្ទសូលីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 11:01:07.169	2025-11-22 03:41:34.452	teacher	production	\N	513620	4
3107	\N	5	សម័យ​ ជីងអឺ	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 11:01:57.197	2025-11-22 03:42:57.225	teacher	production	\N	234567	4
3108	\N	17	ខេង សិរីរតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:27:49.871	2025-11-22 09:41:33.752	teacher	production	\N	221076	4
3109	\N	17	ណារ៉េត លីវីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:29:32.396	2025-11-22 09:43:24.79	teacher	production	\N	221113	4
3110	\N	17	  ថា រិទ្ធិវង្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:30:51.595	2025-11-22 09:46:01.318	teacher	production	\N	221049	4
3111	\N	17	និត្យ  វិជិតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:32:01.176	2025-11-22 09:49:44.187	teacher	production	\N	221010	4
3112	\N	17	នី លឹមហុង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:32:57.589	2025-11-22 09:51:57.019	teacher	production	\N	221086	4
3113	\N	17	ប៉ូឡូ រ៉ូហ្សា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:33:57.277	2025-11-22 09:54:26.705	teacher	production	\N	221011	4
3114	\N	17	បុល សិរីវឌ្ឍនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:34:59.085	2025-11-22 09:56:21.15	teacher	production	\N	221120	4
3115	\N	17	ផាក ហុងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:36:01.308	2025-11-22 09:59:15.028	teacher	production	\N	221012	4
3116	\N	17	ពិសាល ថានន្ត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:37:16.799	2025-11-22 10:01:39.199	teacher	production	\N	221163	4
3117	\N	17	យីម បញ្ញាលីដា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:38:22.533	2025-11-22 10:03:52.544	teacher	production	\N	221015	4
3118	\N	17	រតនៈ ឡែនបញ្ញារិទ្ធិ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:39:33.348	2025-11-22 10:06:26.343	teacher	production	\N	221127	4
3119	\N	17	រិទ្ធ ភួងបុប្ផា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:40:36.064	2025-11-22 10:08:32.779	teacher	production	\N	221017	4
3120	\N	17	 វណ្ណ  វិស្សុតបញ្ញា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:41:47.861	2025-11-22 10:10:33.965	teacher	production	\N	221021	4
3121	\N	17	វ៉ា ធារ៉ាវឌី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:42:54.394	2025-11-22 10:12:49.888	teacher	production	\N	221020	4
3122	\N	17	វ៉ា សុវណ្ណសុជាតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:51:00.962	2025-11-22 10:15:11.502	teacher	production	\N	221130	4
3123	\N	17	សារួន សិរីមង្គល	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	number_2digit	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:52:20.41	2025-11-22 10:17:22.59	teacher	production	\N	221067	4
3124	\N	17	ស្រូយ សុគន្ធា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:53:17.201	2025-11-22 10:22:27.576	teacher	production	\N	221164	4
3125	\N	17	ហ៊ាង ម៉េងគីម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 12:54:48.845	2025-11-22 10:24:21.465	teacher	production	\N	221103	4
3135	\N	17	អាង មុន្នីវណ្ណ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:07:05.282	2025-11-22 10:27:12.995	teacher	production	\N	221038	4
3136	\N	17	អូន សុខកាន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:08:10.693	2025-11-22 10:29:08.645	teacher	production	\N	221098	4
3137	\N	17	គីមរតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:22:58.001	2025-11-22 10:31:13.949	teacher	production	\N	211050	5
3138	\N	17	ឃីម៉ីជីង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:24:03.58	2025-11-22 10:32:50.153	teacher	production	\N	215127	5
3139	\N	17	ចនពិសី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:24:58.122	2025-11-22 10:34:37.306	teacher	production	\N	211142	5
3140	\N	17	ជាដាវីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:26:00.404	2025-11-22 10:36:37.101	teacher	production	\N	211007	5
3141	\N	17	ឈុនពេជ្រសូនីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:26:59.695	2025-11-22 10:40:50.842	teacher	production	\N	211097	5
3142	\N	17	ណេរ៉ានុត	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:28:11.535	2025-11-22 10:43:03.901	teacher	production	\N	211147	5
3143	\N	17	តែឈុងបួយ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:29:08.442	2025-11-22 10:44:45.148	teacher	production	\N	211148	5
3144	\N	17	នីច័ន្ទកន្និកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:30:17.996	2025-11-22 10:49:00.772	teacher	production	\N	211152	5
3145	\N	17	ប៉ូចអាវីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:31:19.635	2025-11-22 10:50:55.411	teacher	production	\N	211105	5
3146	\N	17	ម៉ុតសុខហេងមុនីរក្ស	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:32:14.812	2025-11-22 10:52:21.996	teacher	production	\N	211156	5
3147	\N	17	លីហុកម៉េង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:33:19.193	2025-11-22 10:53:49.016	teacher	production	\N	215126	5
3148	\N	17	លនសុភ័ក្រ្តវាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:34:18.893	2025-11-22 10:55:19.497	teacher	production	\N	211162	5
3149	\N	17	វ៉ាន់គន្ធា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:35:14.843	2025-11-22 10:56:53.493	teacher	production	\N	211211	5
3150	\N	17	វិសាលសុវណ្ណនុន	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:36:28.646	2025-11-22 10:58:19.349	teacher	production	\N	211121	4
3151	\N	17	វុធលីហ័ង	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:37:26.353	2025-11-22 11:00:11.985	teacher	production	\N	211192	5
3152	\N	17	វ៉េងវឌ្ឍនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:38:26.233	2025-11-22 11:01:45.004	teacher	production	\N	211075	5
3153	\N	17	សុខម៉េងឈាង	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:39:32.857	2025-11-22 11:03:22.091	teacher	production	\N	211078	5
3154	\N	17	សុខវ៉េងជីនជីន	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:40:31.509	2025-11-22 11:04:40.446	teacher	production	\N	215128	5
2958	\N	15	កុង ស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	26	f	f	\N	2025-11-21 07:00:25.319	2025-11-22 00:33:44.231	teacher	production	\N	2011	5
3100	\N	5	ហេង​ សុភាឬទ្ធិ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-21 10:51:54.225	2025-11-22 03:33:55.12	teacher	production	\N	42198	4
3180	\N	5	លឿន​ ភីរ៉ាផាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:31:15.232	2025-11-22 03:34:35.389	teacher	production	\N	568116	4
1871	\N	5	រ៉ី​ ណារ៉ាត់	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-20 10:18:10.813	2025-11-22 03:38:09.289	teacher	production	\N	359987	4
3169	\N	5	ផេង​ សៀវមុយ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:11:04.196	2025-11-22 03:43:45.171	teacher	production	\N	000001	4
3170	\N	5	ហឿន​ វិឆៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:15:42.6	2025-11-22 03:46:59.744	teacher	production	\N	677905	4
3181	\N	5	សល់​ រតនា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:32:08.018	2025-11-22 03:47:48.409	teacher	production	\N	101045	4
3171	\N	5	វីន​ គឹមឆេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:18:24.454	2025-11-22 03:48:23.432	teacher	production	\N	000002	4
3172	\N	5	សុគា​ វិសាល	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:19:17.728	2025-11-22 03:53:10.855	teacher	production	\N	495837	4
3173	\N	5	ប៊ុង​ រស្មី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:23:00.805	2025-11-22 03:55:41.24	teacher	production	\N	140449	4
3174	\N	5	ព្រីដា​ ឧត្តម​	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:23:50.173	2025-11-22 03:56:23.196	teacher	production	\N	840126	4
3175	\N	5	សំណាង​ លីណា	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:24:25.184	2025-11-22 03:57:00.281	teacher	production	\N	266575	4
3176	\N	5	ទីន​ ពិសី	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:25:41.201	2025-11-22 03:57:55.224	teacher	production	\N	621231	4
3177	\N	5	លីន​ កក្កដា​	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:26:46.473	2025-11-22 03:58:24.635	teacher	production	\N	433021	4
3178	\N	5	ខឿន​ ពិសិដ្ឋ​	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:27:40.348	2025-11-22 04:00:45.744	teacher	production	\N	794658	4
3179	\N	5	ហៀង​ លីហៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	37	f	f	\N	2025-11-22 03:28:15.798	2025-11-22 04:01:12.449	teacher	production	\N	207165	4
3155	\N	17	សុភ័ក្រ្តសិទ្ធិការ្យ	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:41:20.433	2025-11-22 11:06:03.331	teacher	production	\N	211077	5
3156	\N	17	សុនសិរីរតនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:42:14.412	2025-11-22 11:07:43.095	teacher	production	\N	215159	5
3157	\N	17	សឿនជែកស៊ីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:43:15.109	2025-11-22 11:09:56.79	teacher	production	\N	211126	5
3158	\N	17	សេងមរកត	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:44:20.359	2025-11-22 11:12:58.534	teacher	production	\N	211169	5
3159	\N	17	សម្បត្តិបញ្ញាភា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:45:20.371	2025-11-22 11:14:30.468	teacher	production	\N	211122	5
3160	\N	17	ហួរស្រីកា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:46:17.908	2025-11-22 11:16:18.908	teacher	production	\N	211176	5
3161	\N	17	ហនពេជ្រឧត្តម	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:47:09.281	2025-11-22 11:21:02.997	teacher	production	\N	211037	5
3162	\N	17	ឡាអ៊ែងជីឡូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:47:57.241	2025-11-22 11:22:33.362	teacher	production	\N	721500	5
3163	\N	17	អាតសុនិមល	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:49:09.832	2025-11-22 11:24:39.649	teacher	production	\N	211046	5
3164	\N	17	អ៊ុនសុវត្តី	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:50:03.796	2025-11-22 11:26:28.601	teacher	production	\N	211180	5
3165	\N	17	អូនម៉េងលី	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:51:02.562	2025-11-22 11:28:06.687	teacher	production	\N	211190	5
3166	\N	17	អៀអ៊ាវហ៊ុយ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:52:12.374	2025-11-22 11:29:48.491	teacher	production	\N	211182	5
3167	\N	17	អំណាងណាលីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	\N	division	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:53:08.337	2025-11-22 11:31:29.973	teacher	production	\N	211179	5
3168	\N	17	អ៑ន់កវីថារ៉ូ	\N	male	\N	\N	\N	\N	\N	\N	\N	\N	word_problems	\N	\N	\N	\N	t	f	54	f	f	\N	2025-11-21 13:54:03.447	2025-11-22 11:32:58.6	teacher	production	\N	211137	5
3182	\N	3	ឃឿន អូនវណ្ណ	\N	female	\N	\N	\N	\N	\N	\N	\N	story	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 01:07:43.779	2025-11-24 01:17:30.637	teacher	production	\N	0200	5
3183	\N	3	នីន ដាណេ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 01:09:40.932	2025-11-24 04:17:52.501	teacher	production	\N	0201	5
3184	\N	3	រុន សុផានិត	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 01:16:08.487	2025-11-24 08:09:48.324	teacher	production	\N	0202	5
3185	\N	3	ស្រួ ហេងទី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:11:04.128	2025-11-24 08:12:16.939	teacher	production	\N	0203	5
3186	\N	3	ឆាយ ពន្លឺ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:13:41.057	2025-11-24 08:14:55.942	teacher	production	\N	0204	5
3187	\N	3	យឹម វីត	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:16:01.865	2025-11-24 08:16:48.663	teacher	production	\N	0205	5
3188	\N	3	វណ្ណ ចាន់វី	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:18:27.077	2025-11-24 08:19:33.915	teacher	production	\N	0206	5
3189	\N	3	ណាង ស៉ីណេត	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:20:34.248	2025-11-24 08:21:11.836	teacher	production	\N	0207	5
3190	\N	3	ធា លីហេង	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:22:04.085	2025-11-24 08:22:42.121	teacher	production	\N	0208	5
3191	\N	3	ហ្វី ផាន់ណា	\N	female	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:23:42.589	2025-11-24 08:26:40.204	teacher	production	\N	0209	5
3192	\N	3	ឆាន អ៉ីលុយ	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:34:29.627	2025-11-24 08:35:21.404	teacher	production	\N	0210	5
3193	\N	3	ញឹម ឌីសា	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:36:25.314	2025-11-24 08:37:14.626	teacher	production	\N	0211	5
3194	\N	3	ផាត លីហៀង	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 08:38:50.19	2025-11-24 08:40:37.795	teacher	production	\N	0212	5
3195	\N	3	ខុម សមប្រាថ្នា	\N	female	\N	\N	\N	\N	\N	\N	\N	beginner	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:01:23.75	2025-11-24 09:03:09.836	teacher	production	\N	0213	5
3196	\N	3	ព្រឿង ឆានុន	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:07:48.198	2025-11-24 09:08:45.29	teacher	production	\N	0214	5
3197	\N	3	ធឿន ថាវីត	\N	male	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:10:19.573	2025-11-24 09:11:15.202	teacher	production	\N	0215	5
3198	\N	3	លី ម៉ារី	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension1	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:13:00.494	2025-11-24 09:13:52.723	teacher	production	\N	0216	5
3199	\N	3	ឃីម សុខណៃ	\N	male	\N	\N	\N	\N	\N	\N	\N	letter	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:15:05.009	2025-11-24 09:26:06.508	teacher	production	\N	0217	5
3200	\N	3	សឹម ហ្វានីតា	\N	female	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:26:52.296	2025-11-24 09:28:39.121	teacher	production	\N	0218	5
3201	\N	3	យ័ន វាសនា	\N	male	\N	\N	\N	\N	\N	\N	\N	word	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 09:29:45.255	2025-11-24 16:19:28.959	teacher	production	\N	0219	5
3202	\N	3	វន សៀវហេង	\N	female	\N	\N	\N	\N	\N	\N	\N	paragraph	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 16:20:37.682	2025-11-24 16:23:17.062	teacher	production	\N	0220	5
3203	\N	3	សារឿន វឌ្ឍនៈ	\N	male	\N	\N	\N	\N	\N	\N	\N	comprehension2	\N	\N	\N	\N	\N	t	f	31	f	f	\N	2025-11-24 16:26:10.901	2025-11-24 16:27:22.05	teacher	production	\N	0221	5
\.


--
-- TOC entry 3913 (class 0 OID 130773)
-- Dependencies: 267
-- Data for Name: teaching_activities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.teaching_activities (id, teacher_id, activity_date, subject, topic, duration, materials_used, student_count, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3915 (class 0 OID 130780)
-- Dependencies: 269
-- Data for Name: test_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_sessions (id, user_id, user_role, started_at, expires_at, status, student_count, assessment_count, mentoring_visit_count, notes, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3916 (class 0 OID 130791)
-- Dependencies: 270
-- Data for Name: user_schools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_schools (id, user_id, school_id, pilot_school_id, assigned_date, assigned_by, is_primary) FROM stdin;
\.


--
-- TOC entry 3918 (class 0 OID 130797)
-- Dependencies: 272
-- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_sessions (id, user_id, user_role, ip_address, user_agent, device_info, started_at, last_activity, expires_at, is_active, terminated_at, termination_reason, created_at) FROM stdin;
\.


--
-- TOC entry 3919 (class 0 OID 130806)
-- Dependencies: 273
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, username, profile_photo, sex, phone, holding_classes, assigned_subject, role, email_verified_at, password, remember_token, onboarding_completed, onboarding_completed_at, show_onboarding, created_at, updated_at, profile_expires_at, original_school_id, original_subject, original_classes, school_id, subject, pilot_school_id, province, district, commune, village, is_active, test_mode_enabled, login_type, username_login, migrated_from_quick_login, migration_date, onboarding_activities) FROM stdin;
97	phalla.somalina	phalla.somalina@quick.login	phalla.somalina	\N	\N	\N	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-03 06:33:55.476	2025-10-13 08:37:41.738	\N	\N	\N	\N	\N	khmer	17	Kampong Cham	Kampong Cham	\N	\N	t	f	username	phalla.somalina	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
11	Nhim Sokha	nhim.sokha	nhim.sokha	\N	\N	\N	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-06 05:13:00.402	t	2025-09-15 20:36:38	2025-10-13 08:28:33.1	2025-10-08 05:13:00.402	\N	All	\N	\N	khmer	8	Battambang	Battambang	\N	\N	t	f	email	nhim.sokha	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
117	Keo Visith	keo_visith@tarl.local	keo_visith	\N	\N	\N	\N	\N	teacher	\N	$2b$12$/4kv1VvBf9fZuhXrwlE4deLEX.wjzkNfh8ouE2F/De5JmSJWuhdRG	\N	"[\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-11-18 09:24:54.047	2025-11-20 10:23:37.857	\N	\N	\N	\N	\N	គណិតវិទ្យា	11	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"student_edit\\",\\"report_view\\"]"
18	Ms. Chhoeng Marady	chhoeng.marady	chhoeng.marady	\N	\N	012547170	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-09-15 20:36:40	2025-10-13 08:28:33.1	2025-10-03 00:12:56.647	\N	All	\N	\N	khmer	8	Battambang	Battambang	\N	\N	t	f	email	chhoeng.marady	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
100	Set.Socheat	Set.Socheat@quick.login	Set.Socheat	\N	\N	\N	ថ្នាក់ទី៤	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\",\\"test_student_management\\",\\"add_students\\"]"	\N	t	2025-10-08 03:28:25.048	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	ភាសាខ្មែរ	1	Battambang	Battambang	\N	\N	t	f	username	Set.Socheat	f	\N	"[\\"student_add\\",\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\",\\"student_edit\\"]"
17	SAN AUN	san.aun	san.aun	\N	\N	077910606	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_student_management\\",\\"add_students\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-11 02:54:25.759	t	2025-09-15 20:36:40	2025-10-14 09:15:17.576	2025-10-13 02:54:25.759	\N	All	\N	\N	math	\N	កំពង់ចាម	\N	\N	\N	t	f	email	san.aun	f	\N	"[\\"student_view\\",\\"student_add\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\"]"
93	viewer	viewer@quick.login	viewer	\N	\N	\N	\N	\N	viewer	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	\N	\N	t	2025-09-27 05:57:49.325	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	f	username	viewer	t	2025-10-02 10:29:16.447162	[]
24	Hol Phanna	hol.phanna.bat@teacher.tarl.edu.kh	hol.phanna.bat	\N	\N	0889802366	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-20 02:12:58.942	t	2025-09-15 20:36:41	2025-11-20 02:52:49.247	\N	\N	\N	\N	66	math	14	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	hol.phanna.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
23	Ho Mealtey	ho.mealtey.bat@teacher.tarl.edu.kh	ho.mealtey.bat	\N	\N	012405227	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-13 09:25:50.524	t	2025-09-15 20:36:41	2025-11-20 13:01:55.224	\N	\N	\N	\N	60	khmer	8	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ho.mealtey.bat	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_view\\",\\"assessment_add\\"]"
27	Keo Socheat	keo.socheat.bat@teacher.tarl.edu.kh	keo.socheat.bat	\N	\N	0967749600	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 03:28:21.462	t	2025-09-15 20:36:42	2025-11-20 12:26:20.046	\N	\N	\N	\N	64	math	12	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	keo.socheat.bat	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\",\\"assessment_add\\"]"
30	Koe Kimsou	koe.kimsou.bat@teacher.tarl.edu.kh	koe.kimsou.bat	\N	\N	092625466	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-19 09:54:07.9	t	2025-09-15 20:36:43	2025-11-21 06:06:23.048	\N	\N	\N	\N	53	khmer	1	បាត់ដំបង	បាត់ដំបង	\N	\N	t	f	email	koe.kimsou.bat	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\",\\"student_edit\\",\\"assessment_add\\"]"
38	Pat Sokheng	pat.sokheng.bat@teacher.tarl.edu.kh	pat.sokheng.bat	\N	\N	088 678 9269	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 08:28:50.872	t	2025-09-15 20:36:45	2025-11-21 04:48:50.724	\N	\N	\N	\N	61	math	9	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	pat.sokheng.bat	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\",\\"assessment_add\\"]"
26	Kan Ray	kan.ray.bat@teacher.tarl.edu.kh	kan.ray.bat	\N	\N	0972373907	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-21 06:42:35.761	t	2025-09-15 20:36:42	2025-11-21 10:59:10.32	\N	\N	\N	\N	67	math	15	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	kan.ray.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
36	On Phors	on.phors.bat@teacher.tarl.edu.kh	on.phors.bat	\N	\N	098281878	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-21 00:34:29.594	t	2025-09-15 20:36:45	2025-11-21 00:38:27.52	\N	\N	\N	\N	58	khmer	6	Battambang	Battambang	\N	\N	t	f	email	on.phors.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\"]"
37	Ou Sreynuch	ou.sreynuch.bat@teacher.tarl.edu.kh	ou.sreynuch.bat	\N	\N	0718708989	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-13 01:40:43.409	t	2025-09-15 20:36:45	2025-11-22 04:03:30.117	\N	\N	\N	\N	57	khmer	5	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ou.sreynuch.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
31	Ms. Kheav Sreyoun	kheav.sreyoun.bat@teacher.tarl.edu.kh	kheav.sreyoun.bat	\N	\N	0968224042	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\"]"	2025-11-23 01:34:48.207	t	2025-09-15 20:36:43	2025-11-24 01:17:32.404	\N	\N	\N	\N	55	khmer	3	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	kheav.sreyoun.bat	f	\N	"[\\"student_view\\",\\"report_view\\",\\"assessment_add\\"]"
41	Rin Vannra	rin.vannra.bat@teacher.tarl.edu.kh	rin.vannra.bat	\N	\N	0798949210	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-13 08:48:58.75	t	2025-09-15 20:36:46	2025-11-17 15:08:37.802	\N	\N	\N	\N	54	khmer	2	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	rin.vannra.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
21	Sin Borndoul	sin.borndoul	sin.borndoul	\N	\N	0963677927	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 14:20:53.587	t	2025-09-15 20:36:41	2025-11-17 22:02:40.351	2025-10-10 14:20:53.587	\N	All	\N	\N	khmer	2	Battambang	Battambang	\N	\N	t	f	email	sin.borndoul	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"student_edit\\",\\"report_view\\"]"
101	Son.Naisim	Son.Naisim@quick.login	Son.Naisim	\N	\N	\N	grade_5	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-08 03:30:13.671	2025-10-17 00:09:55.228	\N	\N	\N	\N	\N	math	1	Battambang	Battambang	\N	\N	t	f	username	Son.Naisim	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
9	Chhorn Sopheak	chhorn.sopheak	chhorn.sopheak	\N	\N	085959222	both	khmer	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"complete_profile\\"]"	\N	t	2025-09-15 20:36:38	2025-10-15 00:54:24.231	\N	\N	\N	\N	\N	math	29	Kampong Cham	Kampong Cham	\N	\N	t	f	email	chhorn.sopheak	f	\N	"[\\"assessment_view\\",\\"student_view\\",\\"report_view\\",\\"student_edit\\",\\"assessment_add\\"]"
13	Rorn Sareang	rorn.sareang	rorn.sareang	\N	\N	\N	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:24:03.687	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-10 12:24:03.687	\N	All	\N	\N	math	13	Battambang	Battambang	\N	\N	t	f	email	rorn.sareang	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
33	Nann Phary	nann.phary.bat@teacher.tarl.edu.kh	nann.phary.bat	\N	\N	0972444728	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-20 04:48:21.676	t	2025-09-15 20:36:44	2025-11-20 04:50:03.912	\N	\N	\N	\N	57	khmer	5	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	nann.phary.bat	f	\N	"[\\"student_view\\"]"
80	Ms. Phann Srey Roth	phann.srey.roth.kam@teacher.tarl.edu.kh	phann.srey.roth.kam	\N	\N	098855411	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 14:07:44.122	t	2025-09-15 20:36:57	2025-11-20 14:10:25.134	\N	\N	\N	\N	76	khmer	24	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phann.srey.roth.kam	f	\N	"[\\"assessment_view\\",\\"student_view\\",\\"assessment_add\\"]"
77	Ms. My Savy	my.savy.kam@teacher.tarl.edu.kh	my.savy.kam	\N	\N	0976167545	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:41:09.525	t	2025-09-15 20:36:56	2025-11-18 09:33:36.534	\N	\N	\N	\N	74	khmer	22	កំពង់ចាម	កងមាស	\N	\N	t	f	email	my.savy.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"student_edit\\"]"
2	System Admin	admin@prathaminternational.org	admin	\N	\N	\N	\N	\N	admin	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-18 16:36:09.406	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	admin	f	\N	"[\\"assessment_view\\",\\"report_view\\"]"
83	Ms. Seun Sophary	seun.sophary.kam@teacher.tarl.edu.kh	seun.sophary.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:57	2025-11-22 03:20:44.666	\N	\N	\N	\N	71	Khmer	19	Kampong Cham	\N	\N	\N	t	f	email	seun.sophary.kam	f	\N	"[\\"student_view\\"]"
40	Raeun Sovathary	raeun.sovathary.bat@teacher.tarl.edu.kh	raeun.sovathary.bat	\N	\N	070757944	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-21 00:37:41.617	t	2025-09-15 20:36:46	2025-11-21 01:47:29.532	\N	\N	\N	\N	62	math	10	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	raeun.sovathary.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
79	Ms. Oll Phaleap	oll.phaleap.kam@teacher.tarl.edu.kh	oll.phaleap.kam	\N	\N	\N	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-20 14:52:13.291	t	2025-09-15 20:36:56	2025-11-20 15:30:48.722	\N	\N	\N	\N	84	math	32	កំពង់ចាម	កងមាស	\N	\N	t	f	email	oll.phaleap.kam	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_add\\"]"
22	Chann Leakeana	chann.leakeana.bat@teacher.tarl.edu.kh	chann.leakeana.bat	\N	\N	0977777777	grade_4	khmer	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-09-15 20:36:41	2025-11-20 09:42:30.891	\N	\N	\N	\N	56	khmer	4	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	chann.leakeana.bat	f	\N	"[\\"assessment_view\\",\\"student_view\\",\\"report_view\\",\\"assessment_add\\"]"
42	Rom Ratanak	rom.ratanak.bat@teacher.tarl.edu.kh	rom.ratanak.bat	\N	\N	\N	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 10:24:30.798	t	2025-09-15 20:36:46	2025-11-21 02:00:38.045	\N	\N	\N	\N	65	math	13	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	rom.ratanak.bat	f	\N	"[\\"assessment_view\\",\\"student_view\\",\\"assessment_add\\"]"
118	Ieang Bunthoeurn	ieang_bunthoeurn@tarl.local	ieang_bunthoeurn	\N	\N	\N	\N	\N	teacher	\N	$2b$12$qJueAsJzr7pdZmOLKe8Fx.NL6x37UStF.z13SDa22OPVPiJNBkpn6	\N	\N	\N	t	2025-11-20 07:42:17.202	2025-11-21 06:01:48.882	\N	\N	\N	\N	\N	គណិតវិទ្យា	15	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
74	Ms. HENG NEANG	heng.neang.kam@teacher.tarl.edu.kh	heng.neang.kam	\N	\N	077596728	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:41:40.565	t	2025-09-15 20:36:55	2025-11-21 01:48:55.698	\N	\N	\N	\N	80	math	28	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heng.neang.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\"]"
94	Cheaphannha	Cheaphannha@quick.login	Cheaphannha	\N	\N	077806680	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\",\\"plan_visits\\"]"	\N	t	2025-10-02 09:21:17.284	2025-11-21 07:46:54.075	\N	\N	\N	\N	\N	math	17	Kampong Cham	Kampong Cham	\N	\N	t	f	username	Cheaphannha	t	2025-10-02 10:29:16.447162	"[\\"assessment_view\\",\\"student_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\",\\"mentoring_add\\"]"
78	Ms. Nov Pelim	nov.pelim.kam@teacher.tarl.edu.kh	nov.pelim.kam	\N	\N	016896135	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:31:28.099	t	2025-09-15 20:36:56	2025-11-22 03:20:44.666	\N	\N	\N	\N	70	khmer	18	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nov.pelim.kam	f	\N	"[\\"student_view\\"]"
52	Thiem Thida	thiem.thida.bat@teacher.tarl.edu.kh	thiem.thida.bat	\N	\N	010651008	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-18 10:06:51.795	t	2025-09-15 20:36:49	2025-11-20 01:34:59.902	\N	\N	\N	\N	65	math	13	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	thiem.thida.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\"]"
3	Coordinator One	coordinator@prathaminternational.org	coordinator	\N	\N	\N	\N	\N	coordinator	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	coordinator	f	\N	"[\\"report_view\\",\\"student_view\\",\\"assessment_view\\"]"
85	Nheb Channin	.nheb.channin.kam@teacher.tarl.edu.kh	nheb.channin.kam	\N	\N	 010323903	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:25:00.951	t	2025-09-15 20:36:58	2025-11-18 09:29:45.677	\N	\N	\N	\N	76	khmer	24	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nheb.channin.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\"]"
82	Ms. SEIHA RATANA	seiha.ratana.kam@teacher.tarl.edu.kh	seiha.ratana.kam	\N	\N	060916728	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:33:08.639	t	2025-09-15 20:36:57	2025-11-19 09:24:05.017	\N	\N	\N	\N	78	both	26	កំពង់ចាម	កងមាស	\N	\N	t	f	email	seiha.ratana.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
4	Deab Chhoeun	deab.chhoeun	deab.chhoeun	\N	\N	092751997	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"plan_visits\\"]"	2025-10-08 10:30:48.079	t	2025-09-15 20:36:36	2025-11-08 15:55:25.624	2025-10-10 10:30:48.079	\N	All	\N	\N	khmer	4	Battambang	Battambang	\N	\N	t	f	email	deab.chhoeun	f	\N	"[\\"student_add\\",\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"mentoring_add\\"]"
5	Heap Sophea	heap.sophea	heap.sophea	\N	\N	0312512717	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:12:41.269	t	2025-09-15 20:36:37	2025-10-13 08:28:33.1	2025-10-10 12:12:41.269	\N	All	\N	\N	math	9	Battambang	Battambang	\N	\N	t	f	email	heap.sophea	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
14	Sorn Sophaneth	sorn.sophaneth	sorn.sophaneth	\N	\N	092 702 882	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 12:58:39.402	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-10 12:58:39.402	\N	All	\N	\N	math	8	Battambang	Battambang	\N	\N	t	f	email	sorn.sophaneth	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
6	Leang Chhun Hourth	leang.chhun.hourth	leang.chhun.hourth	\N	\N	012263407	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-14 07:22:56.164	t	2025-09-15 20:36:37	2025-10-14 07:36:21.42	2025-10-16 07:22:56.164	\N	All	\N	\N	math	\N	កំពង់ចាម	\N	\N	\N	t	f	email	leang.chhun.hourth	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
50	Soth Thida	soth.thida.bat@teacher.tarl.edu.kh	soth.thida.bat	\N	\N	0979306040	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-12 16:16:50.511	t	2025-09-15 20:36:48	2025-11-20 04:32:32.98	\N	\N	\N	\N	63	math	11	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	soth.thida.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
46	Soeun Danut	soeun.danut.bat@teacher.tarl.edu.kh	soeun.danut.bat	\N	\N	\N	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 02:58:07.832	t	2025-09-15 20:36:47	2025-11-20 03:35:06.292	\N	\N	\N	\N	66	math	14	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	soeun.danut.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
62	Pheap sreynith	pheap.sreynith.kam@teacher.tarl.edu.kh	pheap.sreynith.kam	\N	\N	015793292	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:33:13.304	t	2025-09-15 20:36:52	2025-11-20 05:17:16.103	\N	\N	\N	\N	78	both	26	កំពង់ចាម	កងមាស	\N	\N	t	f	email	pheap.sreynith.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"student_edit\\"]"
51	Tep Sokly	tep.sokly.bat@teacher.tarl.edu.kh	tep.sokly.bat	\N	\N	0969009404	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-20 02:30:10.426	t	2025-09-15 20:36:49	2025-11-20 04:56:08.4	\N	\N	\N	\N	55	khmer	3	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	tep.sokly.bat	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\"]"
55	Moy Sodara	moy.sodara.kam@teacher.tarl.edu.kh	moy.sodara.kam	\N	\N	\N	\N	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	null	\N	t	2025-09-15 20:36:50	2025-11-22 03:20:44.666	\N	\N	\N	\N	69	Khmer	17	Kampong Cham	\N	\N	\N	t	f	email	moy.sodara.kam	f	\N	"[\\"student_view\\"]"
56	CHHOM BORIN	chhom.borin.kam@teacher.tarl.edu.kh	chhom.borin.kam	\N	\N	01212112	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-13 07:51:34.2	t	2025-09-15 20:36:50	2025-11-21 05:46:40.348	\N	\N	\N	\N	81	math	29	កំពង់ចាម	កងមាស	\N	\N	t	f	email	chhom.borin.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
47	Sokh Chamrong	sokh.chamrong.bat@teacher.tarl.edu.kh	sokh.chamrong.bat	\N	\N	099306006	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-20 02:23:27.234	t	2025-09-15 20:36:48	2025-11-20 13:50:04.663	\N	\N	\N	\N	56	khmer	4	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	sokh.chamrong.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\"]"
49	Sor Kimseak	sor.kimseak.bat@teacher.tarl.edu.kh	sor.kimseak.bat	\N	\N	\N	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-20 11:57:08.317	t	2025-09-15 20:36:48	2025-11-20 12:18:50.759	\N	\N	\N	\N	54	khmer	2	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	sor.kimseak.bat	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_add\\"]"
58	Khoem Sithuon	khoem.sithuon.kam@teacher.tarl.edu.kh	khoem.sithuon.kam	\N	\N	098786566	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-21 02:23:40.471	t	2025-09-15 20:36:51	2025-11-21 02:24:40.998	\N	\N	\N	\N	82	math	30	កំពង់ចាម	កងមាស	\N	\N	t	f	email	khoem.sithuon.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
44	Sang Sangha	sang.sangha.bat@teacher.tarl.edu.kh	sang.sangha.bat	\N	\N	0886247559	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-20 08:28:59.747	t	2025-09-15 20:36:47	2025-11-21 05:58:28.817	\N	\N	\N	\N	61	math	9	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	sang.sangha.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"report_view\\"]"
1	Kairav Admin	kairav@prathaminternational.org	kairav	\N	\N	\N	\N	\N	admin	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\"]"	\N	t	2025-09-15 20:36:36	2025-10-18 17:08:40.478	\N	\N	\N	\N	\N	All	\N	All	\N	\N	\N	t	f	email	kairav	f	\N	"[\\"assessment_view\\",\\"report_view\\"]"
65	Say Kamsath	say.kamsath.kam@teacher.tarl.edu.kh	say.kamsath.kam	\N	\N	093608648	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:37:18.665	t	2025-09-15 20:36:53	2025-11-17 08:52:13.832	\N	\N	\N	\N	71	both	19	កំពង់ចាម	កងមាស	\N	\N	t	f	email	say.kamsath.kam	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_add\\",\\"assessment_view\\"]"
69	Ms. Chan Kimsrorn	chan.kimsrorn.kam@teacher.tarl.edu.kh	chan.kimsrorn.kam	\N	\N	011112233	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-05 07:26:18.494	t	2025-09-15 20:36:54	2025-11-01 07:30:27.045	\N	\N	\N	\N	77	both	25	Kampong Cham	Kampong Cham	\N	\N	t	f	email	chan.kimsrorn.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\",\\"student_edit\\"]"
64	Phuong Pheap	phuong.pheap.kam@teacher.tarl.edu.kh	phuong.pheap.kam	\N	\N	016556738	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-18 07:45:19.387	t	2025-09-15 20:36:52	2025-11-18 08:18:50.717	\N	\N	\N	\N	77	khmer	25	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phuong.pheap.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\"]"
66	SORM VANNAK	sorm.vannak.kam@teacher.tarl.edu.kh	sorm.vannak.kam	\N	\N	0962447805	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:28:41.911	t	2025-09-15 20:36:53	2025-11-12 06:54:36.678	\N	\N	\N	\N	73	khmer	21	កំពង់ចាម	កងមាស	\N	\N	t	f	email	sorm.vannak.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\"]"
54	Chea Putthyda	chea.putthyda.kam@teacher.tarl.edu.kh	chea.putthyda.kam	\N	\N	012899926	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-16 07:22:24.774	t	2025-09-15 20:36:50	2025-11-18 14:29:20.922	\N	\N	\N	\N	69	math	17	កំពង់ចាម	កំពង់ចា	\N	\N	t	f	email	chea.putthyda.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
29	Khim Kosal	khim.kosal.bat@teacher.tarl.edu.kh	khim.kosal.bat	\N	\N	\N	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-20 12:49:34.551	t	2025-09-15 20:36:43	2025-11-20 12:54:51.028	\N	\N	\N	\N	59	khmer	7	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	khim.kosal.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
63	Phoeurn Virath	phoeurn.virath.kam@teacher.tarl.edu.kh	phoeurn.virath.kam	\N	\N	0976166211	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:23:57.82	t	2025-09-15 20:36:52	2025-11-18 13:26:20.113	\N	\N	\N	\N	74	khmer	22	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phoeurn.virath.kam	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_add\\"]"
81	Ms. Phornd sokThy	phornd.sokthy.kam@teacher.tarl.edu.kh	phornd.sokthy.kam	\N	\N	966906676	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:34:42.297	t	2025-09-15 20:36:57	2025-11-19 01:29:37.994	\N	\N	\N	\N	72	khmer	20	កំពង់ចាម	កងមាស	\N	\N	t	f	email	phornd.sokthy.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
76	Ms. Mach Serynak	mach.serynak.kam@teacher.tarl.edu.kh	mach.serynak.kam	\N	\N	0975393392	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-09-15 20:36:56	2025-11-20 10:59:12.485	\N	\N	\N	\N	75	khmer	23	កំពង់ចាម	កងមាស	\N	\N	t	f	email	mach.serynak.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\",\\"assessment_add\\"]"
113	Phal Sophea	phal_sophea@tarl.local	phal_sophea	\N	\N	016208382	\N	\N	teacher	\N	$2b$12$r3o7Mx/hAw/zT27LiD8D3uBWd./nH6rOVpjRvQflpBPhn/FPrZNYa	\N	"[\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:17:30.657	2025-11-21 01:56:04.472	\N	\N	\N	\N	\N	គណិតវិទ្យា	16	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"report_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
45	Seum Sovin	seum.sovin.bat@teacher.tarl.edu.kh	seum.sovin.bat	\N	\N	016205912	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\"]"	2025-11-21 00:26:32.295	t	2025-09-15 20:36:47	2025-11-21 01:46:02.495	\N	\N	\N	\N	62	math	10	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	seum.sovin.bat	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"report_view\\"]"
67	Sum Chek	sum.chek.kam@teacher.tarl.edu.kh	sum.chek.kam	\N	\N	0977660039	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:39:03.968	t	2025-09-15 20:36:53	2025-11-20 11:40:21.947	\N	\N	\N	\N	75	khmer	23	កំពង់ចាម	កងមាស	\N	\N	t	f	email	sum.chek.kam	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_view\\",\\"assessment_add\\"]"
72	Ms. HENG CHHENGKY	heng.chhengky.kam@teacher.tarl.edu.kh	heng.chhengky.kam	\N	\N	097270522	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-11-01 07:42:51.4	t	2025-09-15 20:36:54	2025-11-21 00:28:11.642	\N	\N	\N	\N	83	math	31	កំពង់ចាម	កងមាស	\N	\N	t	f	email	heng.chhengky.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\"]"
75	Ms. HIM SOKHALEAP	him.sokhaleap.kam@teacher.tarl.edu.kh	him.sokhaleap.kam	\N	\N	86323116	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:31:23.456	t	2025-09-15 20:36:55	2025-11-20 15:11:40.723	\N	\N	\N	\N	80	math	28	កំពង់ចាម	កងមាស	\N	\N	t	f	email	him.sokhaleap.kam	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\",\\"student_edit\\"]"
57	Hoat Vimol	hoat.vimol.kam@teacher.tarl.edu.kh	hoat.vimol.kam	\N	\N	012828760	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:39:36.191	t	2025-09-15 20:36:50	2025-11-21 02:12:52.076	\N	\N	\N	\N	82	math	30	កំពង់ចាម	កងមាស	\N	\N	t	f	email	hoat.vimol.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\",\\"assessment_view\\"]"
15	Eam Vichhak Rith	eam.vichhak.rith	eam.vichhak.rith	\N	\N	0976209323	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"plan_visits\\",\\"track_progress\\"]"	2025-10-17 02:41:23.709	t	2025-09-15 20:36:39	2025-11-22 02:17:59.922	2025-10-19 02:41:23.709	\N	All	\N	\N	khmer	23	Kampong Cham	Kampong Cham	\N	\N	t	f	email	eam.vichhak.rith	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\",\\"assessment_view\\",\\"mentoring_add\\",\\"report_view\\"]"
104	HENGCHHENGkY	HENGCHHENGkY@quick.login	HENGCHHENGkY	\N	\N	0972705229	grade_4	\N	teacher	\N	$2b$10$dLP39Xhju7HZXAqISzQKue9IYca.JCQ5GrsQo04yiOZz/r2pGwNQS	\N	\N	\N	t	2025-11-01 08:00:00.32	2025-11-01 08:02:20.801	\N	\N	\N	\N	\N	math	31	កំពង់ចាម	កងមាស	\N	\N	t	f	username	HENGCHHENGkY	f	\N	\N
114	Seng Tola	seng_tola@tarl.local	seng_tola	\N	\N	0969858281	\N	\N	teacher	\N	$2b$12$kKM6vdt4f2zXRfNlvbUhy.fZxi8x1VLXjuWXH8NOggQvk7r63J.u.	\N	"[\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:18:37.792	2025-11-20 13:59:59.982	\N	\N	\N	\N	\N	គណិតវិទ្យា	16	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\",\\"assessment_view\\"]"
110	Sak Sopheap	sak_sopheap@tarl.local	sak_sopheap	\N	\N	078470074	\N	\N	teacher	\N	$2b$12$SqmNyEXsdtI95J29ZC/Aq.HYyhgmMeZFmZ/KmqyGk3ojmbkBF6jI.	\N	"[\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:11:28.303	2025-11-20 08:36:15.415	\N	\N	\N	\N	\N	ភាសាខ្មែរ	6	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_add\\",\\"assessment_view\\"]"
10	Em Rithy	em.rithy	em.rithy	\N	\N	098740793	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"plan_visits\\"]"	2025-10-10 01:21:33.405	t	2025-09-15 20:36:38	2025-11-05 05:53:58.871	2025-10-12 01:21:33.405	\N	All	\N	\N	khmer	\N	បាត់ដំបង	\N	\N	\N	t	f	email	em.rithy	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"mentoring_add\\"]"
115	Hak Leng	hak_leng@tarl.local	hak_leng	\N	\N	0964158937	\N	\N	teacher	\N	$2b$12$4kQ85M2EMdx5ZkZv6jLsj.fBsOhSpppDbiOJW4ZMthc43LD8.PCUG	\N	"[\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:20:19.521	2025-11-18 07:52:01.442	\N	\N	\N	\N	\N	ភាសាខ្មែរ	21	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
19	Ms. Horn Socheata	horn.socheata	horn.socheata	\N	\N	0963265936	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-08 02:12:23.403	t	2025-09-15 20:36:40	2025-11-15 16:57:23.538	2025-10-10 02:12:23.403	\N	All	\N	\N	khmer	28	Kampong Cham	Kampong Cham	\N	\N	t	f	email	horn.socheata	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"student_edit\\",\\"assessment_view\\",\\"report_view\\"]"
103	phannsavoeun	phannsavoeun@quick.login	phannsavoeun	\N	\N	\N	ថ្នាក់ទី៤	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-10-10 13:03:31.613	2025-10-13 08:28:33.1	\N	\N	\N	\N	\N	ភាសាខ្មែរ	\N	កំពង់ចាម	N/A	\N	\N	t	f	username	phannsavoeun	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\",\\"report_view\\"]"
60	Nov Barang	nov.barang.kam@teacher.tarl.edu.kh	nov.barang.kam	\N	\N	0886743726	grade_4	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"track_progress\\",\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:31:37.281	t	2025-09-15 20:36:51	2025-11-20 08:00:34.358	\N	\N	\N	\N	84	math	32	កំពង់ចាម	កងមាស	\N	\N	t	f	email	nov.barang.kam	f	\N	"[\\"student_view\\",\\"report_view\\",\\"assessment_view\\",\\"student_edit\\",\\"assessment_add\\"]"
105	Hort Kunthea	HortKunthea@gmail.com	HortKunthea	\N	\N	admin123	grade_5	\N	teacher	\N	$2b$12$MwhVAYdZELbYUnilZ/vOreNkspMjrWNmPvKxnKoD.ehsJT9.RWKuW	\N	"[\\"track_progress\\",\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-20 09:11:23.573	t	2025-11-06 04:41:36.435	2025-11-21 07:11:02.215	\N	\N	\N	\N	\N	គណិតវិទ្យា	27	កំពង់ចាម	កងមាស	\N	\N	t	f	email	\N	f	\N	"[\\"report_view\\",\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
112	Roeum Pirann	roeum_pirann@tarl.local	roeum_pirann	\N	\N	081256096	grade_5	\N	teacher	\N	$2b$12$jT3q3BpcqF0bAnCzogKnRe39nEcF97emJYipSFpv9cyUFlA21Ivq2	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:15:28.656	2025-11-20 09:09:12.508	\N	\N	\N	\N	\N	math	12	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"report_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
116	Kong Vengkorng	kong_vengkorng@tarl.local	kong_vengkorng	\N	\N	0714499649	\N	\N	teacher	\N	$2b$12$6aU/NlxpzPMWAGOTWegQ7.TTqbZHvzNeHNQVzisH4FdQoucVlAoGq	\N	"[\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:22:45.658	2025-11-20 13:20:33.934	\N	\N	\N	\N	\N	គណិតវិទ្យា	31	កំពង់ចាម	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
111	Nin Phearompomnita	nin_phearompomnita@tarl.local	nin_phearompomnita	\N	\N	0882434682	\N	\N	teacher	\N	$2b$12$QUxfjvV.3qAARO4aJW6zJutj.NqPlbygmHFFFI4sW8A8juVF6qxbu	\N	"[\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	\N	t	2025-11-06 09:13:17.953	2025-11-20 12:45:31.582	\N	\N	\N	\N	\N	ភាសាខ្មែរ	7	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"assessment_view\\",\\"assessment_add\\",\\"report_view\\"]"
106	Seng Orn	sengorn@gmail.com	sengorn	\N	\N	086401187	grade_4	\N	teacher	\N	$2b$12$KPFNmOyxGBa49rn3q4CJzem2dGWSDwg5XneTVCyqPlHC2ZK6dEi.m	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-21 02:54:01.661	t	2025-11-06 05:01:07.678	2025-11-21 03:22:11.201	\N	\N	\N	\N	\N	math	29	កំពង់ចាម	កងមាស	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
34	Ny Cheanichniron	ny.cheanichniron.bat@teacher.tarl.edu.kh	ny.cheanichniron.bat	\N	\N	069376534	grade_5	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-13 09:24:52.536	t	2025-09-15 20:36:44	2025-11-21 02:21:43.31	\N	\N	\N	\N	60	khmer	8	បាត់ដំបង	រតនមណ្ឌល	\N	\N	t	f	email	ny.cheanichniron.bat	f	\N	"[\\"student_view\\",\\"student_edit\\",\\"report_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
68	Teour phanna	teour.phanna.kam@teacher.tarl.edu.kh	teour.phanna.kam	\N	\N	093423567	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\"]"	2025-11-01 07:38:35.34	t	2025-09-15 20:36:53	2025-11-21 10:51:04.007	\N	\N	\N	\N	72	khmer	20	កំពង់ចាម	កងមាស	\N	\N	t	f	email	teour.phanna.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\"]"
119	heng.navy.kam	heng.navy.kam@quick.login	heng.navy.kam	\N	\N	0969705169	grade_4	\N	teacher	\N	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-21 02:00:15.558	t	2025-11-21 01:57:42.423	2025-11-21 05:12:29.327	\N	\N	\N	\N	\N	math	27	កំពង់ចាម	កងមាស	\N	\N	t	f	username	heng.navy.kam	t	2025-11-21 01:57:42.423096	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
109	Orn Veasna	orn_veasna@tarl.local	orn_veasna	\N	\N	0967838282	\N	\N	teacher	\N	$2b$12$uWyiGxt5kdaLHVRQ4yO8XurFMI.WJn4LPWrzFFixDg7N3aihwDIaW	\N	"[\\"test_assessments\\",\\"conduct_baseline\\"]"	\N	t	2025-11-06 09:10:09.556	2025-11-21 06:43:54.235	\N	\N	\N	\N	\N	គណិតវិទ្យា	1	បាត់ដំបង	\N	\N	\N	t	f	email	\N	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"assessment_add\\"]"
20	Ms. Phann Savoeun	phann.savoeun	phann.savoeun	\N	\N	012950314	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-14 11:25:46.642	t	2025-09-15 20:36:40	2025-11-01 06:26:21.88	2025-10-16 11:25:46.642	\N	All	\N	\N	khmer	\N	កំពង់ចាម	\N	\N	\N	t	f	email	phann.savoeun	f	\N	"[\\"assessment_view\\",\\"assessment_add\\",\\"student_view\\"]"
12	Noa Cham Roeun	noa.cham.roeun	noa.cham.roeun	\N	\N	012878787	grade_4	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\",\\"track_progress\\"]"	2025-10-11 03:08:17.616	t	2025-09-15 20:36:38	2025-10-16 08:56:48.364	2025-10-13 03:08:17.616	\N	All	\N	\N	math	\N	កំពង់ចាម	\N	\N	\N	t	f	email	noa.cham.roeun	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\",\\"student_edit\\",\\"report_view\\"]"
16	El Kunthea	el.kunthea	el.kunthea	\N	\N	011788573	both	\N	mentor	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"track_progress\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-10-10 09:41:49.709	t	2025-09-15 20:36:39	2025-10-13 08:28:33.1	2025-10-12 09:41:49.709	\N	All	\N	\N	khmer	\N	កំពង់ចាម	\N	\N	\N	t	f	email	el.kunthea	f	\N	"[\\"student_view\\",\\"assessment_view\\",\\"report_view\\",\\"student_edit\\",\\"assessment_add\\"]"
59	Neang Spheap	neang.spheap.kam@teacher.tarl.edu.kh	neang.spheap.kam	\N	\N	010522072	both	\N	teacher	\N	$2b$10$ym5S/.f8w9kpphqIzY10quTWIR68RBFctQLzELsch4rNEiiXOZ1Fe	\N	"[\\"complete_profile\\",\\"test_assessments\\",\\"conduct_baseline\\"]"	2025-11-01 07:31:16.788	t	2025-09-15 20:36:51	2025-11-20 07:23:42.831	\N	\N	\N	\N	70	khmer	18	កំពង់ចាម	កងមាស	\N	\N	t	f	email	neang.spheap.kam	f	\N	"[\\"student_view\\",\\"assessment_add\\",\\"assessment_view\\"]"
120	chhorn.srey.pov.kam	chhorn.srey.pov.kam@quick.login	chhorn.srey.pov.kam	\N	\N	\N		\N	teacher	\N	$2b$10$/GAEx8rNAgVN6kGzchAe3uh82GU8pKyi1bUenNNw5GkGmigWFwH/S	\N	\N	\N	t	2025-11-21 01:58:17.086	2025-11-21 01:58:17.086	\N	\N	\N	\N	\N	Maths	\N	Kampong Cham		\N	\N	t	f	username	chhorn.srey.pov.kam	t	2025-11-21 01:58:17.08614	\N
\.


--
-- TOC entry 3955 (class 0 OID 0)
-- Dependencies: 216
-- Name: assessment_histories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessment_histories_id_seq', 41, true);


--
-- TOC entry 3956 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_locks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessment_locks_id_seq', 1, false);


--
-- TOC entry 3957 (class 0 OID 0)
-- Dependencies: 220
-- Name: assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.assessments_id_seq', 2547, true);


--
-- TOC entry 3958 (class 0 OID 0)
-- Dependencies: 222
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 1, false);


--
-- TOC entry 3959 (class 0 OID 0)
-- Dependencies: 224
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- TOC entry 3960 (class 0 OID 0)
-- Dependencies: 226
-- Name: bulk_imports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bulk_imports_id_seq', 1, false);


--
-- TOC entry 3961 (class 0 OID 0)
-- Dependencies: 228
-- Name: clusters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.clusters_id_seq', 1, false);


--
-- TOC entry 3962 (class 0 OID 0)
-- Dependencies: 230
-- Name: dashboard_stats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.dashboard_stats_id_seq', 11, true);


--
-- TOC entry 3963 (class 0 OID 0)
-- Dependencies: 232
-- Name: intervention_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.intervention_programs_id_seq', 1, false);


--
-- TOC entry 3964 (class 0 OID 0)
-- Dependencies: 234
-- Name: ip_whitelist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ip_whitelist_id_seq', 1, false);


--
-- TOC entry 3965 (class 0 OID 0)
-- Dependencies: 236
-- Name: mentor_school_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mentor_school_assignments_id_seq', 51, true);


--
-- TOC entry 3966 (class 0 OID 0)
-- Dependencies: 238
-- Name: mentoring_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mentoring_visits_id_seq', 7, true);


--
-- TOC entry 3967 (class 0 OID 0)
-- Dependencies: 240
-- Name: pilot_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pilot_schools_id_seq', 24, true);


--
-- TOC entry 3968 (class 0 OID 0)
-- Dependencies: 242
-- Name: progress_trackings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.progress_trackings_id_seq', 1, false);


--
-- TOC entry 3969 (class 0 OID 0)
-- Dependencies: 244
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, false);


--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 246
-- Name: quick_login_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.quick_login_users_id_seq', 95, true);


--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 248
-- Name: rate_limits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rate_limits_id_seq', 1, false);


--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 250
-- Name: report_exports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.report_exports_id_seq', 1, false);


--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 252
-- Name: resource_views_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resource_views_id_seq', 1, false);


--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 254
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.resources_id_seq', 1, false);


--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 256
-- Name: school_classes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.school_classes_id_seq', 1, false);


--
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 258
-- Name: schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.schools_id_seq', 1, false);


--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 260
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, false);


--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 262
-- Name: student_assessment_eligibilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_assessment_eligibilities_id_seq', 1, false);


--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 264
-- Name: student_interventions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.student_interventions_id_seq', 1, false);


--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 266
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.students_id_seq', 3203, true);


--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 268
-- Name: teaching_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.teaching_activities_id_seq', 1, false);


--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 271
-- Name: user_schools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_schools_id_seq', 1, false);


--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 274
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 120, true);


--
-- TOC entry 3520 (class 2606 OID 130850)
-- Name: assessment_histories assessment_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_pkey PRIMARY KEY (id);


--
-- TOC entry 3524 (class 2606 OID 130852)
-- Name: assessment_locks assessment_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_pkey PRIMARY KEY (id);


--
-- TOC entry 3532 (class 2606 OID 130854)
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- TOC entry 3540 (class 2606 OID 130856)
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- TOC entry 3546 (class 2606 OID 130858)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3554 (class 2606 OID 130860)
-- Name: bulk_imports bulk_imports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bulk_imports
    ADD CONSTRAINT bulk_imports_pkey PRIMARY KEY (id);


--
-- TOC entry 3558 (class 2606 OID 130862)
-- Name: clusters clusters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clusters
    ADD CONSTRAINT clusters_pkey PRIMARY KEY (id);


--
-- TOC entry 3563 (class 2606 OID 130864)
-- Name: dashboard_stats dashboard_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboard_stats
    ADD CONSTRAINT dashboard_stats_pkey PRIMARY KEY (id);


--
-- TOC entry 3567 (class 2606 OID 130866)
-- Name: intervention_programs intervention_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.intervention_programs
    ADD CONSTRAINT intervention_programs_pkey PRIMARY KEY (id);


--
-- TOC entry 3572 (class 2606 OID 130868)
-- Name: ip_whitelist ip_whitelist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ip_whitelist
    ADD CONSTRAINT ip_whitelist_pkey PRIMARY KEY (id);


--
-- TOC entry 3576 (class 2606 OID 130870)
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_pilot_school_id_subject_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_pilot_school_id_subject_key UNIQUE (mentor_id, pilot_school_id, subject);


--
-- TOC entry 3579 (class 2606 OID 130872)
-- Name: mentor_school_assignments mentor_school_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pkey PRIMARY KEY (id);


--
-- TOC entry 3586 (class 2606 OID 130874)
-- Name: mentoring_visits mentoring_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pkey PRIMARY KEY (id);


--
-- TOC entry 3600 (class 2606 OID 130876)
-- Name: pilot_schools pilot_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pilot_schools
    ADD CONSTRAINT pilot_schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3605 (class 2606 OID 130878)
-- Name: progress_trackings progress_trackings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.progress_trackings
    ADD CONSTRAINT progress_trackings_pkey PRIMARY KEY (id);


--
-- TOC entry 3610 (class 2606 OID 130880)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 3612 (class 2606 OID 130882)
-- Name: quick_login_users quick_login_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quick_login_users
    ADD CONSTRAINT quick_login_users_pkey PRIMARY KEY (id);


--
-- TOC entry 3620 (class 2606 OID 130884)
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- TOC entry 3623 (class 2606 OID 130886)
-- Name: report_exports report_exports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_exports
    ADD CONSTRAINT report_exports_pkey PRIMARY KEY (id);


--
-- TOC entry 3627 (class 2606 OID 130888)
-- Name: resource_views resource_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resource_views
    ADD CONSTRAINT resource_views_pkey PRIMARY KEY (id);


--
-- TOC entry 3632 (class 2606 OID 130890)
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- TOC entry 3635 (class 2606 OID 130892)
-- Name: school_classes school_classes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_pkey PRIMARY KEY (id);


--
-- TOC entry 3640 (class 2606 OID 130894)
-- Name: schools schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3645 (class 2606 OID 130896)
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- TOC entry 3647 (class 2606 OID 130898)
-- Name: student_assessment_eligibilities student_assessment_eligibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_pkey PRIMARY KEY (id);


--
-- TOC entry 3652 (class 2606 OID 130900)
-- Name: student_interventions student_interventions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_pkey PRIMARY KEY (id);


--
-- TOC entry 3659 (class 2606 OID 130902)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 3666 (class 2606 OID 130906)
-- Name: teaching_activities teaching_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_pkey PRIMARY KEY (id);


--
-- TOC entry 3670 (class 2606 OID 130908)
-- Name: test_sessions test_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_sessions
    ADD CONSTRAINT test_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3675 (class 2606 OID 130910)
-- Name: user_schools user_schools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schools
    ADD CONSTRAINT user_schools_pkey PRIMARY KEY (id);


--
-- TOC entry 3684 (class 2606 OID 130912)
-- Name: user_sessions user_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT user_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3690 (class 2606 OID 130914)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3694 (class 2606 OID 130916)
-- Name: users users_username_login_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_login_key UNIQUE (username_login);


--
-- TOC entry 3518 (class 1259 OID 130917)
-- Name: assessment_histories_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_histories_assessment_id_idx ON public.assessment_histories USING btree (assessment_id);


--
-- TOC entry 3521 (class 1259 OID 130918)
-- Name: assessment_locks_assessment_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessment_locks_assessment_id_idx ON public.assessment_locks USING btree (assessment_id);


--
-- TOC entry 3522 (class 1259 OID 130919)
-- Name: assessment_locks_assessment_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX assessment_locks_assessment_id_key ON public.assessment_locks USING btree (assessment_id);


--
-- TOC entry 3525 (class 1259 OID 130920)
-- Name: assessments_assessed_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_by_mentor_idx ON public.assessments USING btree (assessed_by_mentor);


--
-- TOC entry 3526 (class 1259 OID 130921)
-- Name: assessments_assessed_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessed_date_idx ON public.assessments USING btree (assessed_date);


--
-- TOC entry 3527 (class 1259 OID 130922)
-- Name: assessments_assessment_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_assessment_type_idx ON public.assessments USING btree (assessment_type);


--
-- TOC entry 3528 (class 1259 OID 130923)
-- Name: assessments_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_locked_idx ON public.assessments USING btree (is_locked);


--
-- TOC entry 3529 (class 1259 OID 130924)
-- Name: assessments_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_is_temporary_idx ON public.assessments USING btree (is_temporary);


--
-- TOC entry 3530 (class 1259 OID 130925)
-- Name: assessments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_pilot_school_id_idx ON public.assessments USING btree (pilot_school_id);


--
-- TOC entry 3533 (class 1259 OID 130926)
-- Name: assessments_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_record_status_idx ON public.assessments USING btree (record_status);


--
-- TOC entry 3534 (class 1259 OID 130927)
-- Name: assessments_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_student_id_idx ON public.assessments USING btree (student_id);


--
-- TOC entry 3535 (class 1259 OID 130928)
-- Name: assessments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_subject_idx ON public.assessments USING btree (subject);


--
-- TOC entry 3536 (class 1259 OID 130929)
-- Name: assessments_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_test_session_id_idx ON public.assessments USING btree (test_session_id);


--
-- TOC entry 3537 (class 1259 OID 130930)
-- Name: assessments_verified_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX assessments_verified_by_id_idx ON public.assessments USING btree (verified_by_id);


--
-- TOC entry 3538 (class 1259 OID 130931)
-- Name: attendance_records_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_date_idx ON public.attendance_records USING btree (date);


--
-- TOC entry 3541 (class 1259 OID 130932)
-- Name: attendance_records_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_student_id_idx ON public.attendance_records USING btree (student_id);


--
-- TOC entry 3542 (class 1259 OID 130933)
-- Name: attendance_records_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX attendance_records_teacher_id_idx ON public.attendance_records USING btree (teacher_id);


--
-- TOC entry 3543 (class 1259 OID 130934)
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- TOC entry 3544 (class 1259 OID 130935)
-- Name: audit_logs_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_created_at_idx ON public.audit_logs USING btree (created_at);


--
-- TOC entry 3547 (class 1259 OID 130936)
-- Name: audit_logs_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_id_idx ON public.audit_logs USING btree (resource_id);


--
-- TOC entry 3548 (class 1259 OID 130937)
-- Name: audit_logs_resource_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_resource_type_idx ON public.audit_logs USING btree (resource_type);


--
-- TOC entry 3549 (class 1259 OID 130938)
-- Name: audit_logs_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_status_idx ON public.audit_logs USING btree (status);


--
-- TOC entry 3550 (class 1259 OID 130939)
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- TOC entry 3551 (class 1259 OID 130940)
-- Name: audit_logs_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_role_idx ON public.audit_logs USING btree (user_role);


--
-- TOC entry 3552 (class 1259 OID 130941)
-- Name: bulk_imports_import_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_import_type_idx ON public.bulk_imports USING btree (import_type);


--
-- TOC entry 3555 (class 1259 OID 130942)
-- Name: bulk_imports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX bulk_imports_status_idx ON public.bulk_imports USING btree (status);


--
-- TOC entry 3556 (class 1259 OID 130943)
-- Name: clusters_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX clusters_code_key ON public.clusters USING btree (code);


--
-- TOC entry 3559 (class 1259 OID 130944)
-- Name: dashboard_stats_cache_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_cache_key_idx ON public.dashboard_stats USING btree (cache_key);


--
-- TOC entry 3560 (class 1259 OID 130945)
-- Name: dashboard_stats_cache_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX dashboard_stats_cache_key_key ON public.dashboard_stats USING btree (cache_key);


--
-- TOC entry 3561 (class 1259 OID 130946)
-- Name: dashboard_stats_last_updated_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_last_updated_idx ON public.dashboard_stats USING btree (last_updated);


--
-- TOC entry 3564 (class 1259 OID 130947)
-- Name: dashboard_stats_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_role_idx ON public.dashboard_stats USING btree (role);


--
-- TOC entry 3565 (class 1259 OID 130948)
-- Name: dashboard_stats_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX dashboard_stats_user_id_idx ON public.dashboard_stats USING btree (user_id);


--
-- TOC entry 3568 (class 1259 OID 130949)
-- Name: ip_whitelist_ip_address_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_ip_address_idx ON public.ip_whitelist USING btree (ip_address);


--
-- TOC entry 3569 (class 1259 OID 130950)
-- Name: ip_whitelist_ip_address_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ip_whitelist_ip_address_key ON public.ip_whitelist USING btree (ip_address);


--
-- TOC entry 3570 (class 1259 OID 130951)
-- Name: ip_whitelist_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ip_whitelist_is_active_idx ON public.ip_whitelist USING btree (is_active);


--
-- TOC entry 3573 (class 1259 OID 130952)
-- Name: mentor_school_assignments_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_is_active_idx ON public.mentor_school_assignments USING btree (is_active);


--
-- TOC entry 3574 (class 1259 OID 130953)
-- Name: mentor_school_assignments_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_mentor_id_idx ON public.mentor_school_assignments USING btree (mentor_id);


--
-- TOC entry 3577 (class 1259 OID 130954)
-- Name: mentor_school_assignments_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_pilot_school_id_idx ON public.mentor_school_assignments USING btree (pilot_school_id);


--
-- TOC entry 3580 (class 1259 OID 130955)
-- Name: mentor_school_assignments_subject_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentor_school_assignments_subject_idx ON public.mentor_school_assignments USING btree (subject);


--
-- TOC entry 3581 (class 1259 OID 130956)
-- Name: mentoring_visits_class_in_session_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_class_in_session_idx ON public.mentoring_visits USING btree (class_in_session);


--
-- TOC entry 3582 (class 1259 OID 130957)
-- Name: mentoring_visits_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_is_locked_idx ON public.mentoring_visits USING btree (is_locked);


--
-- TOC entry 3583 (class 1259 OID 130958)
-- Name: mentoring_visits_mentor_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_mentor_id_idx ON public.mentoring_visits USING btree (mentor_id);


--
-- TOC entry 3584 (class 1259 OID 130959)
-- Name: mentoring_visits_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_pilot_school_id_idx ON public.mentoring_visits USING btree (pilot_school_id);


--
-- TOC entry 3587 (class 1259 OID 130960)
-- Name: mentoring_visits_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_record_status_idx ON public.mentoring_visits USING btree (record_status);


--
-- TOC entry 3588 (class 1259 OID 130961)
-- Name: mentoring_visits_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_school_id_idx ON public.mentoring_visits USING btree (school_id);


--
-- TOC entry 3589 (class 1259 OID 130962)
-- Name: mentoring_visits_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_status_idx ON public.mentoring_visits USING btree (status);


--
-- TOC entry 3590 (class 1259 OID 130963)
-- Name: mentoring_visits_subject_observed_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_subject_observed_idx ON public.mentoring_visits USING btree (subject_observed);


--
-- TOC entry 3591 (class 1259 OID 130964)
-- Name: mentoring_visits_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_teacher_id_idx ON public.mentoring_visits USING btree (teacher_id);


--
-- TOC entry 3592 (class 1259 OID 130965)
-- Name: mentoring_visits_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_test_session_id_idx ON public.mentoring_visits USING btree (test_session_id);


--
-- TOC entry 3593 (class 1259 OID 130966)
-- Name: mentoring_visits_visit_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mentoring_visits_visit_date_idx ON public.mentoring_visits USING btree (visit_date);


--
-- TOC entry 3594 (class 1259 OID 130967)
-- Name: pilot_schools_baseline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_baseline_start_date_idx ON public.pilot_schools USING btree (baseline_start_date);


--
-- TOC entry 3595 (class 1259 OID 130968)
-- Name: pilot_schools_cluster_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_cluster_idx ON public.pilot_schools USING btree (cluster);


--
-- TOC entry 3596 (class 1259 OID 130969)
-- Name: pilot_schools_district_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_district_idx ON public.pilot_schools USING btree (district);


--
-- TOC entry 3597 (class 1259 OID 130970)
-- Name: pilot_schools_is_locked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_is_locked_idx ON public.pilot_schools USING btree (is_locked);


--
-- TOC entry 3598 (class 1259 OID 130971)
-- Name: pilot_schools_midline_start_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_midline_start_date_idx ON public.pilot_schools USING btree (midline_start_date);


--
-- TOC entry 3601 (class 1259 OID 130972)
-- Name: pilot_schools_province_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_province_idx ON public.pilot_schools USING btree (province);


--
-- TOC entry 3602 (class 1259 OID 130973)
-- Name: pilot_schools_school_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pilot_schools_school_code_idx ON public.pilot_schools USING btree (school_code);


--
-- TOC entry 3603 (class 1259 OID 130974)
-- Name: pilot_schools_school_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX pilot_schools_school_code_key ON public.pilot_schools USING btree (school_code);


--
-- TOC entry 3606 (class 1259 OID 130975)
-- Name: progress_trackings_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_student_id_idx ON public.progress_trackings USING btree (student_id);


--
-- TOC entry 3607 (class 1259 OID 130976)
-- Name: progress_trackings_tracking_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX progress_trackings_tracking_date_idx ON public.progress_trackings USING btree (tracking_date);


--
-- TOC entry 3608 (class 1259 OID 130977)
-- Name: provinces_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX provinces_code_key ON public.provinces USING btree (code);


--
-- TOC entry 3613 (class 1259 OID 130978)
-- Name: quick_login_users_username_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX quick_login_users_username_idx ON public.quick_login_users USING btree (username);


--
-- TOC entry 3614 (class 1259 OID 130979)
-- Name: quick_login_users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX quick_login_users_username_key ON public.quick_login_users USING btree (username);


--
-- TOC entry 3615 (class 1259 OID 130980)
-- Name: rate_limits_blocked_until_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_blocked_until_idx ON public.rate_limits USING btree (blocked_until);


--
-- TOC entry 3616 (class 1259 OID 130981)
-- Name: rate_limits_endpoint_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_endpoint_idx ON public.rate_limits USING btree (endpoint);


--
-- TOC entry 3617 (class 1259 OID 130982)
-- Name: rate_limits_identifier_endpoint_window_start_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX rate_limits_identifier_endpoint_window_start_key ON public.rate_limits USING btree (identifier, endpoint, window_start);


--
-- TOC entry 3618 (class 1259 OID 130983)
-- Name: rate_limits_identifier_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_identifier_idx ON public.rate_limits USING btree (identifier);


--
-- TOC entry 3621 (class 1259 OID 130984)
-- Name: rate_limits_window_start_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX rate_limits_window_start_idx ON public.rate_limits USING btree (window_start);


--
-- TOC entry 3624 (class 1259 OID 130985)
-- Name: report_exports_report_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_report_type_idx ON public.report_exports USING btree (report_type);


--
-- TOC entry 3625 (class 1259 OID 130986)
-- Name: report_exports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX report_exports_status_idx ON public.report_exports USING btree (status);


--
-- TOC entry 3628 (class 1259 OID 130987)
-- Name: resource_views_resource_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_resource_id_idx ON public.resource_views USING btree (resource_id);


--
-- TOC entry 3629 (class 1259 OID 130988)
-- Name: resource_views_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resource_views_user_id_idx ON public.resource_views USING btree (user_id);


--
-- TOC entry 3630 (class 1259 OID 130989)
-- Name: resources_is_public_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_is_public_idx ON public.resources USING btree (is_public);


--
-- TOC entry 3633 (class 1259 OID 130990)
-- Name: resources_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX resources_type_idx ON public.resources USING btree (type);


--
-- TOC entry 3636 (class 1259 OID 130991)
-- Name: school_classes_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX school_classes_school_id_idx ON public.school_classes USING btree (school_id);


--
-- TOC entry 3637 (class 1259 OID 130992)
-- Name: schools_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_code_idx ON public.schools USING btree (code);


--
-- TOC entry 3638 (class 1259 OID 130993)
-- Name: schools_code_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX schools_code_key ON public.schools USING btree (code);


--
-- TOC entry 3641 (class 1259 OID 130994)
-- Name: schools_province_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX schools_province_id_idx ON public.schools USING btree (province_id);


--
-- TOC entry 3642 (class 1259 OID 130995)
-- Name: settings_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX settings_key_idx ON public.settings USING btree (key);


--
-- TOC entry 3643 (class 1259 OID 130996)
-- Name: settings_key_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX settings_key_key ON public.settings USING btree (key);


--
-- TOC entry 3648 (class 1259 OID 130997)
-- Name: student_assessment_eligibilities_student_id_assessment_type_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX student_assessment_eligibilities_student_id_assessment_type_key ON public.student_assessment_eligibilities USING btree (student_id, assessment_type);


--
-- TOC entry 3649 (class 1259 OID 130998)
-- Name: student_assessment_eligibilities_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_assessment_eligibilities_student_id_idx ON public.student_assessment_eligibilities USING btree (student_id);


--
-- TOC entry 3650 (class 1259 OID 130999)
-- Name: student_interventions_intervention_program_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_intervention_program_id_idx ON public.student_interventions USING btree (intervention_program_id);


--
-- TOC entry 3653 (class 1259 OID 131000)
-- Name: student_interventions_student_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX student_interventions_student_id_idx ON public.student_interventions USING btree (student_id);


--
-- TOC entry 3654 (class 1259 OID 131001)
-- Name: students_added_by_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_id_idx ON public.students USING btree (added_by_id);


--
-- TOC entry 3655 (class 1259 OID 131002)
-- Name: students_added_by_mentor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_added_by_mentor_idx ON public.students USING btree (added_by_mentor);


--
-- TOC entry 3656 (class 1259 OID 131003)
-- Name: students_is_temporary_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_is_temporary_idx ON public.students USING btree (is_temporary);


--
-- TOC entry 3657 (class 1259 OID 131004)
-- Name: students_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_pilot_school_id_idx ON public.students USING btree (pilot_school_id);


--
-- TOC entry 3660 (class 1259 OID 131005)
-- Name: students_record_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_record_status_idx ON public.students USING btree (record_status);


--
-- TOC entry 3661 (class 1259 OID 131006)
-- Name: students_school_class_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_school_class_id_idx ON public.students USING btree (school_class_id);


--
-- TOC entry 3662 (class 1259 OID 131007)
-- Name: students_student_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);


--
-- TOC entry 3663 (class 1259 OID 131008)
-- Name: students_test_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX students_test_session_id_idx ON public.students USING btree (test_session_id);


--
-- TOC entry 3664 (class 1259 OID 131014)
-- Name: teaching_activities_activity_date_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_activity_date_idx ON public.teaching_activities USING btree (activity_date);


--
-- TOC entry 3667 (class 1259 OID 131015)
-- Name: teaching_activities_teacher_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX teaching_activities_teacher_id_idx ON public.teaching_activities USING btree (teacher_id);


--
-- TOC entry 3668 (class 1259 OID 131016)
-- Name: test_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_expires_at_idx ON public.test_sessions USING btree (expires_at);


--
-- TOC entry 3671 (class 1259 OID 131017)
-- Name: test_sessions_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_status_idx ON public.test_sessions USING btree (status);


--
-- TOC entry 3672 (class 1259 OID 131018)
-- Name: test_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_id_idx ON public.test_sessions USING btree (user_id);


--
-- TOC entry 3673 (class 1259 OID 131019)
-- Name: test_sessions_user_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX test_sessions_user_role_idx ON public.test_sessions USING btree (user_role);


--
-- TOC entry 3676 (class 1259 OID 131020)
-- Name: user_schools_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_school_id_idx ON public.user_schools USING btree (school_id);


--
-- TOC entry 3677 (class 1259 OID 131021)
-- Name: user_schools_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_schools_user_id_idx ON public.user_schools USING btree (user_id);


--
-- TOC entry 3678 (class 1259 OID 131022)
-- Name: user_schools_user_id_pilot_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_pilot_school_id_key ON public.user_schools USING btree (user_id, pilot_school_id);


--
-- TOC entry 3679 (class 1259 OID 131023)
-- Name: user_schools_user_id_school_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX user_schools_user_id_school_id_key ON public.user_schools USING btree (user_id, school_id);


--
-- TOC entry 3680 (class 1259 OID 131024)
-- Name: user_sessions_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_expires_at_idx ON public.user_sessions USING btree (expires_at);


--
-- TOC entry 3681 (class 1259 OID 131025)
-- Name: user_sessions_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_is_active_idx ON public.user_sessions USING btree (is_active);


--
-- TOC entry 3682 (class 1259 OID 131026)
-- Name: user_sessions_last_activity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_last_activity_idx ON public.user_sessions USING btree (last_activity);


--
-- TOC entry 3685 (class 1259 OID 131027)
-- Name: user_sessions_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_sessions_user_id_idx ON public.user_sessions USING btree (user_id);


--
-- TOC entry 3686 (class 1259 OID 131028)
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- TOC entry 3687 (class 1259 OID 131029)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 3688 (class 1259 OID 131030)
-- Name: users_pilot_school_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_pilot_school_id_idx ON public.users USING btree (pilot_school_id);


--
-- TOC entry 3691 (class 1259 OID 131031)
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- TOC entry 3692 (class 1259 OID 131032)
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- TOC entry 3695 (class 2606 OID 131033)
-- Name: assessment_histories assessment_histories_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_histories
    ADD CONSTRAINT assessment_histories_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3696 (class 2606 OID 131038)
-- Name: assessment_locks assessment_locks_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessment_locks
    ADD CONSTRAINT assessment_locks_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3697 (class 2606 OID 131043)
-- Name: assessments assessments_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3698 (class 2606 OID 131048)
-- Name: assessments assessments_locked_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_locked_by_id_fkey FOREIGN KEY (locked_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3699 (class 2606 OID 131053)
-- Name: assessments assessments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3700 (class 2606 OID 131058)
-- Name: assessments assessments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3701 (class 2606 OID 131063)
-- Name: assessments assessments_verified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_verified_by_id_fkey FOREIGN KEY (verified_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3702 (class 2606 OID 131068)
-- Name: attendance_records attendance_records_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3703 (class 2606 OID 131073)
-- Name: mentor_school_assignments mentor_school_assignments_assigned_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_assigned_by_id_fkey FOREIGN KEY (assigned_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3704 (class 2606 OID 131078)
-- Name: mentor_school_assignments mentor_school_assignments_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3705 (class 2606 OID 131083)
-- Name: mentor_school_assignments mentor_school_assignments_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentor_school_assignments
    ADD CONSTRAINT mentor_school_assignments_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3706 (class 2606 OID 131088)
-- Name: mentoring_visits mentoring_visits_mentor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3707 (class 2606 OID 131093)
-- Name: mentoring_visits mentoring_visits_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mentoring_visits
    ADD CONSTRAINT mentoring_visits_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3708 (class 2606 OID 131098)
-- Name: school_classes school_classes_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_classes
    ADD CONSTRAINT school_classes_school_id_fkey FOREIGN KEY (school_id) REFERENCES public.schools(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3709 (class 2606 OID 131103)
-- Name: schools schools_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schools
    ADD CONSTRAINT schools_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3710 (class 2606 OID 131108)
-- Name: student_assessment_eligibilities student_assessment_eligibilities_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_assessment_eligibilities
    ADD CONSTRAINT student_assessment_eligibilities_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3711 (class 2606 OID 131113)
-- Name: student_interventions student_interventions_intervention_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_intervention_program_id_fkey FOREIGN KEY (intervention_program_id) REFERENCES public.intervention_programs(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3712 (class 2606 OID 131118)
-- Name: student_interventions student_interventions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.student_interventions
    ADD CONSTRAINT student_interventions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3713 (class 2606 OID 131123)
-- Name: students students_added_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_added_by_id_fkey FOREIGN KEY (added_by_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3714 (class 2606 OID 131128)
-- Name: students students_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3715 (class 2606 OID 131133)
-- Name: students students_school_class_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_school_class_id_fkey FOREIGN KEY (school_class_id) REFERENCES public.school_classes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3716 (class 2606 OID 131153)
-- Name: teaching_activities teaching_activities_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teaching_activities
    ADD CONSTRAINT teaching_activities_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3717 (class 2606 OID 131158)
-- Name: users users_pilot_school_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pilot_school_id_fkey FOREIGN KEY (pilot_school_id) REFERENCES public.pilot_schools(id) ON UPDATE CASCADE ON DELETE SET NULL;


-- Completed on 2025-11-25 11:36:12 +07

--
-- PostgreSQL database dump complete
--

\unrestrict eX44hbAOds8soTBtJ6HjXlJogsURqzwmJRUiQ7v6qvM77rnKygiBYfHcDiRsrGu

