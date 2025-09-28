'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, Descriptions, Spin, Button, Tag, Alert, Space, Divider, Typography, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, ArrowLeftOutlined, ExportOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';

const { Title, Text } = Typography;

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
  teaching_materials?: string[];
  students_grouped_by_level?: boolean;
  students_active_participation?: boolean;
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
  activity2_name_language?: string;
  activity2_name_numeracy?: string;
  activity2_duration?: number;
  activity2_clear_instructions?: boolean;
  activity2_no_clear_instructions_reason?: string;
  activity2_followed_process?: boolean;
  activity2_not_followed_reason?: string;
  activity3_name_language?: string;
  activity3_name_numeracy?: string;
  activity3_duration?: number;
  activity3_clear_instructions?: boolean;
  activity3_no_clear_instructions_reason?: string;
  observation?: string;
  score?: number;
  follow_up_required?: boolean;
  feedback_for_teacher?: string;
  action_plan?: string;
  status?: string;
  is_locked?: boolean;
  locked_by?: number;
  locked_at?: string;
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

export default function MentoringVisitDetailPage() {
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

  const handleEdit = () => {
    router.push(`/mentoring/${visitId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបការចុះអប់រំនេះមែនទេ?')) {
      try {
        const response = await fetch(`/api/mentoring/${visitId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/mentoring');
        } else {
          const data = await response.json();
          alert(data.error || 'មិនអាចលុបបាន');
        }
      } catch (error) {
        console.error('Error deleting visit:', error);
        alert('មិនអាចលុបបាន');
      }
    }
  };

  const handleBack = () => {
    router.push('/mentoring');
  };

  const handleLock = async () => {
    try {
      const response = await fetch(`/api/mentoring/${visitId}/lock`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setVisit(data.data);
        alert('ការចុះអប់រំត្រូវបានចាក់សោដោយជោគជ័យ');
      } else {
        const data = await response.json();
        alert(data.error || 'មិនអាចចាក់សោបាន');
      }
    } catch (error) {
      console.error('Error locking visit:', error);
      alert('មិនអាចចាក់សោបាន');
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await fetch(`/api/mentoring/${visitId}/lock`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setVisit(data.data);
        alert('ការចុះអប់រំត្រូវបានដោះសោដោយជោគជ័យ');
      } else {
        const data = await response.json();
        alert(data.error || 'មិនអាចដោះសោបាន');
      }
    } catch (error) {
      console.error('Error unlocking visit:', error);
      alert('មិនអាចដោះសោបាន');
    }
  };

  const canEdit = !visit?.is_locked && (
    session?.user?.role === 'admin' || 
    session?.user?.role === 'coordinator' || 
    (session?.user?.role === 'mentor' && visit?.mentor_id === parseInt(session.user.id))
  );

  const canDelete = !visit?.is_locked && (
    session?.user?.role === 'admin' || 
    (session?.user?.role === 'mentor' && visit?.mentor_id === parseInt(session.user.id))
  );

  const canLock = session?.user?.role === 'admin';
  const canUnlock = session?.user?.role === 'admin';

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>កំពុងទាញយកទិន្នន័យ...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  if (!visit) {
    return (
      <DashboardLayout>
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ marginBottom: 16 }}
          >
            ត្រលប់ក្រោយ
          </Button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ margin: 0, fontFamily: 'Hanuman, sans-serif' }}>
              ព័ត៌មានលម្អិតការចុះអប់រំ
            </Title>
            
            <Space>
              {canLock && !visit.is_locked && (
                <Button 
                  icon={<LockOutlined />}
                  onClick={handleLock}
                >
                  ចាក់សោ
                </Button>
              )}
              {canUnlock && visit.is_locked && (
                <Button 
                  icon={<UnlockOutlined />}
                  onClick={handleUnlock}
                >
                  ដោះសោ
                </Button>
              )}
              {canEdit && (
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={handleEdit}
                >
                  កែសម្រួល
                </Button>
              )}
              {canDelete && (
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  លុប
                </Button>
              )}
            </Space>
          </div>
        </div>

        {/* Basic Information */}
        <Card title="ព័ត៌មានមូលដ្ឋាន" style={{ marginBottom: 24 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="កាលបរិច្ចេទចុះអប់រំ">
              {new Date(visit.visit_date).toLocaleDateString('km-KH')}
            </Descriptions.Item>
            <Descriptions.Item label="ឈ្មោះសាលា">
              {visit.pilot_school?.name} ({visit.pilot_school?.code})
            </Descriptions.Item>
            <Descriptions.Item label="ឈ្មោះអ្នកណែនាំ">
              {visit.mentor?.name}
            </Descriptions.Item>
            <Descriptions.Item label="ឈ្មោះគ្រូបង្រៀន">
              {visit.teacher?.name || 'មិនបានកំណត់'}
            </Descriptions.Item>
            <Descriptions.Item label="ប្រភេទកម្មវិធី">
              {visit.program_type || 'TaRL'}
            </Descriptions.Item>
            <Descriptions.Item label="ស្ថានភាព">
              <Tag color={visit.status === 'completed' ? 'green' : visit.status === 'cancelled' ? 'red' : 'blue'}>
                {visit.status === 'completed' ? 'បានបញ្ចប់' : 
                 visit.status === 'cancelled' ? 'បានបោះបង់' : 'កំពុងដំណើរការ'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="ស្ថានភាពសោ">
              <Tag color={visit.is_locked ? 'red' : 'green'} icon={visit.is_locked ? <LockOutlined /> : <UnlockOutlined />}>
                {visit.is_locked ? 'បានចាក់សោ' : 'មិនបានចាក់សោ'}
              </Tag>
              {visit.is_locked && visit.locked_at && (
                <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                  ចាក់សោនៅ: {new Date(visit.locked_at).toLocaleString('km-KH')}
                </div>
              )}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Class Session Status */}
        <Card title="ស្ថានភាពថ្នាក់រៀន" style={{ marginBottom: 24 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="តើថ្នាក់រៀន TaRL មានដំណើរការនៅថ្ងៃចុះអង្កេតដែរឬទេ?">
              <Tag color={visit.class_in_session ? 'green' : 'red'}>
                {visit.class_in_session ? 'បាទ/ចាស' : 'ទេ'}
              </Tag>
            </Descriptions.Item>
            {!visit.class_in_session && visit.class_not_in_session_reason && (
              <Descriptions.Item label="ហេតុអ្វីបានជាថ្នាក់រៀន TaRL មិនដំណើរការ?">
                {visit.class_not_in_session_reason}
              </Descriptions.Item>
            )}
            {visit.class_in_session && (
              <>
                <Descriptions.Item label="តើអ្នកបានអង្កេតពេញមួយម៉ោងដែរឬទេ?">
                  <Tag color={visit.full_session_observed ? 'green' : 'orange'}>
                    {visit.full_session_observed ? 'បាទ/ចាស' : 'ទេ'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="កម្រិតថ្នាក់ដែលបានអង្កេត">
                  {visit.grades_observed?.map(grade => (
                    <Tag key={grade}>{grade}</Tag>
                  ))}
                </Descriptions.Item>
                <Descriptions.Item label="មុខវិជ្ជាដែលបានអង្កេត">
                  <Tag color="blue">{visit.subject_observed}</Tag>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>

        {/* Student Data */}
        {visit.class_in_session && (
          <Card title="ទិន្នន័យសិស្ស" style={{ marginBottom: 24 }}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                      {visit.total_students_enrolled || 0}
                    </div>
                    <div>សិស្សចុះឈ្មោះសរុប</div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                      {visit.students_present || 0}
                    </div>
                    <div>សិស្សមកថ្នាក់</div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                      {visit.students_improved || 0}
                    </div>
                    <div>សិស្សប្រសើរឡើង</div>
                  </div>
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                      {visit.classes_conducted_before_visit || 0}
                    </div>
                    <div>ថ្នាក់រៀនធ្វើពីមុន</div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        )}

        {/* Activities */}
        {visit.class_in_session && visit.number_of_activities && visit.number_of_activities > 0 && (
          <Card title="សកម្មភាពបង្រៀន" style={{ marginBottom: 24 }}>
            <div>
              {[1, 2, 3].slice(0, visit.number_of_activities).map(i => {
                const activityName = visit.subject_observed === 'ភាសាខ្មែរ' 
                  ? visit[`activity${i}_name_language` as keyof MentoringVisit] as string
                  : visit[`activity${i}_name_numeracy` as keyof MentoringVisit] as string;
                const duration = visit[`activity${i}_duration` as keyof MentoringVisit] as number;
                const clearInstructions = visit[`activity${i}_clear_instructions` as keyof MentoringVisit] as boolean;
                const followedProcess = visit[`activity${i}_followed_process` as keyof MentoringVisit] as boolean;

                if (!activityName) return null;

                return (
                  <Card key={i} size="small" title={`សកម្មភាពទី ${i}`} style={{ marginBottom: 16 }}>
                    <Descriptions column={2}>
                      <Descriptions.Item label="ឈ្មោះសកម្មភាព">
                        {activityName}
                      </Descriptions.Item>
                      <Descriptions.Item label="រយៈពេល">
                        {duration} នាទី
                      </Descriptions.Item>
                      <Descriptions.Item label="ការណែនាំច្បាស់លាស់">
                        <Tag color={clearInstructions ? 'green' : 'red'}>
                          {clearInstructions ? 'បាទ/ចាស' : 'ទេ'}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="ធ្វើតាមដំណើរការ">
                        <Tag color={followedProcess ? 'green' : 'red'}>
                          {followedProcess ? 'បាទ/ចាស' : 'ទេ'}
                        </Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                );
              })}
            </div>
          </Card>
        )}

        {/* Observations and Feedback */}
        <Card title="សេចក្តីសម្គាល់ និងយោបល់" style={{ marginBottom: 24 }}>
          <Descriptions column={1} bordered>
            {visit.observation && (
              <Descriptions.Item label="សេចក្តីសម្គាល់">
                <Text>{visit.observation}</Text>
              </Descriptions.Item>
            )}
            {visit.feedback_for_teacher && (
              <Descriptions.Item label="យោបល់សម្រាប់គ្រូ">
                <Text>{visit.feedback_for_teacher}</Text>
              </Descriptions.Item>
            )}
            {visit.action_plan && (
              <Descriptions.Item label="ផែនការសកម្មភាព">
                <Text>{visit.action_plan}</Text>
              </Descriptions.Item>
            )}
            {visit.score !== undefined && visit.score !== null && (
              <Descriptions.Item label="ពិន្ទុ">
                <Tag color={visit.score >= 80 ? 'green' : visit.score >= 60 ? 'orange' : 'red'}>
                  {visit.score}/100
                </Tag>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="ត្រូវការតាមដានបន្ថែម">
              <Tag color={visit.follow_up_required ? 'orange' : 'green'}>
                {visit.follow_up_required ? 'បាទ/ចាស' : 'ទេ'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </DashboardLayout>
  );
}