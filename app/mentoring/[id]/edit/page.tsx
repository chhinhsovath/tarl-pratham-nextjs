'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { message, Typography, Spin, Alert, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import ComprehensiveMentoringForm from '@/components/forms/ComprehensiveMentoringForm';

const { Title } = Typography;

interface MentoringVisit {
  id: number;
  visit_date: string;
  pilot_school_id: number;
  teacher_id?: number;
  mentor_id: number;
  program_type?: string;
  grade_group?: string;
  class_in_session?: boolean;
  class_not_in_session_reason?: string;
  full_session_observed?: boolean;
  grades_observed?: string[];
  subject_observed?: string;
  language_levels_observed?: string[];
  numeracy_levels_observed?: string[];
  class_started_on_time?: boolean;
  late_start_reason?: string;
  total_students_enrolled?: number;
  students_present?: number;
  students_improved?: number;
  classes_conducted_before_visit?: number;
  students_improved_from_last_week?: number;
  teaching_materials?: string[];
  students_grouped_by_level?: boolean;
  children_grouped_appropriately?: boolean;
  students_active_participation?: boolean;
  students_fully_involved?: boolean;
  has_session_plan?: boolean;
  no_session_plan_reason?: string;
  followed_session_plan?: boolean;
  no_follow_plan_reason?: string;
  session_plan_appropriate?: boolean;
  number_of_activities?: number;
  activity1_name_language?: string;
  activity1_name_numeracy?: string;
  activity1_duration?: number;
  activity1_clear_instructions?: boolean;
  activity1_no_clear_instructions_reason?: string;
  activity1_followed_process?: boolean;
  activity1_not_followed_reason?: string;
  activity1_demonstrated?: boolean;
  activity1_students_practice?: string;
  activity1_small_groups?: string;
  activity1_individual?: string;
  activity2_name_language?: string;
  activity2_name_numeracy?: string;
  activity2_duration?: number;
  activity2_clear_instructions?: boolean;
  activity2_no_clear_instructions_reason?: string;
  activity2_followed_process?: boolean;
  activity2_not_followed_reason?: string;
  activity2_demonstrated?: boolean;
  activity2_students_practice?: string;
  activity2_small_groups?: string;
  activity2_individual?: string;
  activity3_name_language?: string;
  activity3_name_numeracy?: string;
  activity3_duration?: number;
  activity3_clear_instructions?: boolean;
  activity3_no_clear_instructions_reason?: string;
  activity3_demonstrated?: boolean;
  activity3_students_practice?: string;
  activity3_small_groups?: string;
  activity3_individual?: string;
  observation?: string;
  score?: number;
  follow_up_required?: boolean;
  feedback_for_teacher?: string;
  action_plan?: string;
  status?: string;
  mentor?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  teacher?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  pilot_school?: {
    id: number;
    name: string;
    code: string;
    province?: {
      name_english: string;
      name_khmer: string;
    };
  };
}

export default function EditMentoringVisitPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [visit, setVisit] = useState<MentoringVisit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const visitId = params.id as string;

  useEffect(() => {
    fetchVisit();
  }, [visitId]);

  const fetchVisit = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mentoring/${visitId}`);
      const data = await response.json();

      if (response.ok) {
        setVisit(data.data);
      } else {
        setError(data.error || 'ការទាញយកទិន្នន័យមានបញ្ហា');
      }
    } catch (error) {
      console.error('Error fetching visit:', error);
      setError('ការទាញយកទិន្នន័យមានបញ្ហា');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch(`/api/mentoring/${visitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'ការកែសម្រួលបានជោគជ័យ');
        router.push(`/mentoring/${visitId}`);
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចកែសម្រួលបាន');
      }
    } catch (error) {
      console.error('Update visit error:', error);
      message.error('មិនអាចកែសម្រួលបាន');
    }
  };

  const handleBack = () => {
    router.push(`/mentoring/${visitId}`);
  };

  // Check if user can edit this visit
  const canEdit = !visit?.is_locked && (
    session?.user?.role === 'admin' || 
    session?.user?.role === 'coordinator' || 
    (session?.user?.role === 'mentor' && visit?.mentor_id === parseInt(session.user.id))
  );

  if (loading) {
    return (
      <HorizontalLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>កំពុងទាញយកទិន្នន័យ...</div>
        </div>
      </HorizontalLayout>
    );
  }

  if (error) {
    return (
      <HorizontalLayout>
        <Alert
          message="បញ្ហាក្នុងការទាញយកទិន្នន័យ"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" danger onClick={handleBack}>
              ត្រលប់ក្រោយ
            </Button>
          }
        />
      </HorizontalLayout>
    );
  }

  if (!visit) {
    return (
      <HorizontalLayout>
        <Alert
          message="រកមិនឃើញការចុះអប់រំ"
          description="ការចុះអប់រំដែលអ្នកស្វែងរកមិនមានទេ"
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              ត្រលប់ក្រោយ
            </Button>
          }
        />
      </HorizontalLayout>
    );
  }

  if (!canEdit) {
    const isLocked = visit?.is_locked;
    return (
      <HorizontalLayout>
        <Alert
          message={isLocked ? "ការចុះអប់រំត្រូវបានចាក់សោ" : "គ្មានសិទ្ធិកែសម្រួល"}
          description={
            isLocked 
              ? "ការចុះអប់រំនេះត្រូវបានចាក់សោ និងមិនអាចកែសម្រួលបានទេ។ សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធដើម្បីដោះសោ។"
              : "អ្នកមិនមានសិទ្ធិកែសម្រួលការចុះអប់រំនេះទេ"
          }
          type={isLocked ? "error" : "warning"}
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              ត្រលប់ក្រោយ
            </Button>
          }
        />
      </HorizontalLayout>
    );
  }

  // Convert visit data to form initial values
  const initialValues = {
    mentor_name: visit.mentor?.name,
    pilot_school_id: visit.pilot_school_id,
    teacher_id: visit.teacher_id,
    visit_date: visit.visit_date,
    program_type: visit.program_type || 'TaRL',
    grade_group: visit.grade_group,
    class_in_session: visit.class_in_session ? 1 : 0,
    class_not_in_session_reason: visit.class_not_in_session_reason,
    full_session_observed: visit.full_session_observed ? 1 : 0,
    grades_observed: visit.grades_observed,
    subject_observed: visit.subject_observed,
    language_levels_observed: visit.language_levels_observed,
    numeracy_levels_observed: visit.numeracy_levels_observed,
    class_started_on_time: visit.class_started_on_time ? 1 : 0,
    late_start_reason: visit.late_start_reason,
    total_students_enrolled: visit.total_students_enrolled,
    students_present: visit.students_present,
    students_improved: visit.students_improved,
    classes_conducted_before_visit: visit.classes_conducted_before_visit,
    students_improved_from_last_week: visit.students_improved_from_last_week,
    teaching_materials: visit.teaching_materials,
    students_grouped_by_level: visit.students_grouped_by_level ? 1 : 0,
    children_grouped_appropriately: visit.children_grouped_appropriately ? 1 : 0,
    students_active_participation: visit.students_active_participation ? 1 : 0,
    students_fully_involved: visit.students_fully_involved ? 1 : 0,
    has_session_plan: visit.has_session_plan ? 1 : 0,
    no_session_plan_reason: visit.no_session_plan_reason,
    followed_session_plan: visit.followed_session_plan ? 1 : 0,
    no_follow_plan_reason: visit.no_follow_plan_reason,
    session_plan_appropriate: visit.session_plan_appropriate ? 1 : 0,
    number_of_activities: visit.number_of_activities,
    activity1_name_language: visit.activity1_name_language,
    activity1_name_numeracy: visit.activity1_name_numeracy,
    activity1_duration: visit.activity1_duration,
    activity1_clear_instructions: visit.activity1_clear_instructions ? 1 : 0,
    activity1_no_clear_instructions_reason: visit.activity1_no_clear_instructions_reason,
    activity1_followed_process: visit.activity1_followed_process ? 1 : 0,
    activity1_not_followed_reason: visit.activity1_not_followed_reason,
    activity1_demonstrated: visit.activity1_demonstrated ? 1 : 0,
    activity1_students_practice: visit.activity1_students_practice,
    activity1_small_groups: visit.activity1_small_groups,
    activity1_individual: visit.activity1_individual,
    activity2_name_language: visit.activity2_name_language,
    activity2_name_numeracy: visit.activity2_name_numeracy,
    activity2_duration: visit.activity2_duration,
    activity2_clear_instructions: visit.activity2_clear_instructions ? 1 : 0,
    activity2_no_clear_instructions_reason: visit.activity2_no_clear_instructions_reason,
    activity2_followed_process: visit.activity2_followed_process ? 1 : 0,
    activity2_not_followed_reason: visit.activity2_not_followed_reason,
    activity2_demonstrated: visit.activity2_demonstrated ? 1 : 0,
    activity2_students_practice: visit.activity2_students_practice,
    activity2_small_groups: visit.activity2_small_groups,
    activity2_individual: visit.activity2_individual,
    activity3_name_language: visit.activity3_name_language,
    activity3_name_numeracy: visit.activity3_name_numeracy,
    activity3_duration: visit.activity3_duration,
    activity3_clear_instructions: visit.activity3_clear_instructions ? 1 : 0,
    activity3_no_clear_instructions_reason: visit.activity3_no_clear_instructions_reason,
    activity3_demonstrated: visit.activity3_demonstrated ? 1 : 0,
    activity3_students_practice: visit.activity3_students_practice,
    activity3_small_groups: visit.activity3_small_groups,
    activity3_individual: visit.activity3_individual,
    observation: visit.observation,
    score: visit.score,
    follow_up_required: visit.follow_up_required ? 1 : 0,
    feedback_for_teacher: visit.feedback_for_teacher,
    action_plan: visit.action_plan,
    status: visit.status || 'scheduled'
  };

  return (
    <HorizontalLayout>
      <div>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginBottom: 16 }}
        >
          ត្រលប់ក្រោយ
        </Button>
        
        <Title level={2} style={{ marginBottom: 24, fontFamily: 'Hanuman, sans-serif' }}>
          កែសម្រួលការចុះអប់រំ និងត្រួតពិនិត្យ
        </Title>
        
        <ComprehensiveMentoringForm 
          mode="edit" 
          onSubmit={handleSubmit}
          initialValues={initialValues}
        />
      </div>
    </HorizontalLayout>
  );
}