'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Spin,
  message,
  Badge,
  Timeline,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  CalendarOutlined,
  BankOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface MentoringVisit {
  id: number;
  visit_date: string;
  mentor: {
    id: number;
    name: string;
    email: string;
  };
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  pilot_school: {
    id: number;
    name: string;
    school_name: string;
    school_code: string;
  };
  observation: string;
  score?: number;
  action_plan?: string;
  follow_up_required?: boolean;
  is_locked: boolean;
  is_temporary: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields
  region?: string;
  cluster?: string;
  program_type?: string;
  class_in_session?: boolean;
  class_not_in_session_reason?: string;
  full_session_observed?: boolean;
  grade_group?: string;
  grades_observed?: string[];
  subject_observed?: string;
  language_levels_observed?: string[];
  numeracy_levels_observed?: string[];
  
  // Student data
  total_students_enrolled?: number;
  students_present?: number;
  students_improved?: number;
  classes_conducted_before?: number;
  
  // Delivery questions
  class_started_on_time?: boolean;
  late_start_reason?: string;
  teaching_materials?: string[];
  
  // Classroom organization
  students_grouped_by_level?: boolean;
  students_active_participation?: boolean;
  
  // Teacher planning
  teacher_has_lesson_plan?: boolean;
  no_lesson_plan_reason?: string;
  followed_lesson_plan?: boolean;
  not_followed_reason?: string;
  plan_appropriate_for_levels?: boolean;
  lesson_plan_feedback?: string;
  
  // Activities
  num_activities_observed?: number;
  activity1_type?: string;
  activity1_duration?: number;
  activity1_clear_instructions?: boolean;
  activity1_unclear_reason?: string;
  activity1_followed_process?: boolean;
  activity1_not_followed_reason?: string;
  activity2_type?: string;
  activity2_duration?: number;
  activity2_clear_instructions?: boolean;
  activity2_unclear_reason?: string;
  activity2_followed_process?: boolean;
  activity2_not_followed_reason?: string;
  
  teacher_feedback?: string;
}

export default function MentoringVisitDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const [mentoringVisit, setMentoringVisit] = useState<MentoringVisit | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMentoringVisit = async () => {
    try {
      const response = await fetch(`/api/mentoring-visits/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setMentoringVisit(data.data);
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
        router.push('/mentoring-visits');
      }
    } catch (error) {
      console.error('Error fetching mentoring visit:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
      router.push('/mentoring-visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchMentoringVisit();
    }
  }, [params.id]);

  const canEdit = () => {
    if (!mentoringVisit || !session?.user) return false;
    
    return (
      (session.user.role === 'admin' || 
       (session.user.role === 'mentor' && mentoringVisit.mentor.id === parseInt(session.user.id))) &&
      !mentoringVisit.is_locked
    );
  };

  const renderBooleanIcon = (value?: boolean) => {
    if (value === undefined) return <span className="text-gray-400">មិនបានបញ្ជាក់</span>;
    return value ? (
      <CheckCircleOutlined className="text-green-500" />
    ) : (
      <CloseCircleOutlined className="text-red-500" />
    );
  };

  const renderScoreBadge = (score?: number) => {
    if (score === undefined) return <span className="text-gray-400">មិនបានដាក់ពិន្ទុ</span>;
    
    let color = 'red';
    if (score >= 80) color = 'green';
    else if (score >= 60) color = 'orange';
    
    return <Badge count={score} color={color} />;
  };

  if (loading) {
    return (
      <HorizontalLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  if (!mentoringVisit) {
    return (
      <HorizontalLayout>
        <Alert
          message="រកមិនឃើញកាត់ទុកវិជ្ជាការ"
          description="កាត់ទុកវិជ្ជាការនេះប្រហែលជាត្រូវបានលុប ឬអ្នកមិនមានសិទ្ធិមើល"
          type="error"
          showIcon
        />
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            ត្រឡប់ក្រោយ
          </Button>
          <Title level={2} className="mb-0">
            លម្អិតកាត់ទុកវិជ្ជាការ
          </Title>
        </div>
        
        <Space>
          {canEdit() && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => router.push(`/mentoring-visits/${mentoringVisit.id}/edit`)}
            >
              កែសម្រួល
            </Button>
          )}
        </Space>
      </div>

      {/* Status Alerts */}
      {mentoringVisit.is_temporary && (
        <Alert
          message="កាត់ទុកបណ្តោះអាសន្ន"
          description={`កាត់ទុកនេះនឹងផុតកំណត់នៅ: ${dayjs(mentoringVisit.expires_at).format('DD/MM/YYYY HH:mm')}`}
          type="warning"
          icon={<ClockCircleOutlined />}
          className="mb-4"
        />
      )}

      {mentoringVisit.is_locked && (
        <Alert
          message="កាត់ទុកត្រូវបានជាប់សោ"
          description="កាត់ទុកនេះមិនអាចកែសម្រួលបានទេ"
          type="info"
          icon={<LockOutlined />}
          className="mb-4"
        />
      )}

      {/* Basic Information */}
      <Card title="ព័ត៌មានមូលដ្ឋាន" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="កាលបរិច្ឆេទចុះអប់រំ">
                <CalendarOutlined className="mr-2" />
                {dayjs(mentoringVisit.visit_date).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="សាលា">
                <BankOutlined className="mr-2" />
                {mentoringVisit.pilot_school.school_name} ({mentoringVisit.pilot_school.school_code})
              </Descriptions.Item>
              <Descriptions.Item label="អ្នកបង្រៀន">
                <UserOutlined className="mr-2" />
                {mentoringVisit.teacher?.name || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
              <Descriptions.Item label="អ្នកគ្រប់គ្រង">
                <UserOutlined className="mr-2" />
                {mentoringVisit.mentor.name}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="តំបន់">
                {mentoringVisit.region || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
              <Descriptions.Item label="ជួរ">
                {mentoringVisit.cluster || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
              <Descriptions.Item label="ប្រភេទកម្មវិធី">
                {mentoringVisit.program_type || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
              <Descriptions.Item label="ពិន្ទុ">
                {renderScoreBadge(mentoringVisit.score)}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Class Information */}
      <Card title="ព័ត៌មានថ្នាក់រៀន" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ថ្នាក់រៀនកំពុងបង្រៀន">
                {renderBooleanIcon(mentoringVisit.class_in_session)}
                {mentoringVisit.class_in_session ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
              {!mentoringVisit.class_in_session && mentoringVisit.class_not_in_session_reason && (
                <Descriptions.Item label="មូលហេតុមិនបានបង្រៀន">
                  {mentoringVisit.class_not_in_session_reason}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="អង្កេតពេញមួយមេរៀន">
                {renderBooleanIcon(mentoringVisit.full_session_observed)}
                {mentoringVisit.full_session_observed ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
              <Descriptions.Item label="ក្រុមថ្នាក់">
                {mentoringVisit.grade_group || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ថ្នាក់រៀនដែលបានអង្កេត">
                {mentoringVisit.grades_observed?.length ? 
                  mentoringVisit.grades_observed.map(grade => (
                    <Tag key={grade} color="blue">{grade}</Tag>
                  )) : 'មិនបានបញ្ជាក់'
                }
              </Descriptions.Item>
              <Descriptions.Item label="មុខវិជ្ជាដែលបានអង្កេត">
                {mentoringVisit.subject_observed || 'មិនបានបញ្ជាក់'}
              </Descriptions.Item>
              <Descriptions.Item label="កម្រិតភាសាដែលបានអង្កេត">
                {mentoringVisit.language_levels_observed?.length ? 
                  mentoringVisit.language_levels_observed.map(level => (
                    <Tag key={level} color="green">{level}</Tag>
                  )) : 'មិនបានបញ្ជាក់'
                }
              </Descriptions.Item>
              <Descriptions.Item label="កម្រិតគណិតវិទ្យាដែលបានអង្កេត">
                {mentoringVisit.numeracy_levels_observed?.length ? 
                  mentoringVisit.numeracy_levels_observed.map(level => (
                    <Tag key={level} color="orange">{level}</Tag>
                  )) : 'មិនបានបញ្ជាក់'
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Student Data */}
      <Card title="ទិន្នន័យសិស្ស" className="mb-4">
        <Row gutter={16}>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mentoringVisit.total_students_enrolled || 0}
              </div>
              <div className="text-sm text-gray-600">សិស្សចុះឈ្មោះសរុប</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mentoringVisit.students_present || 0}
              </div>
              <div className="text-sm text-gray-600">សិស្សមកវត្តមាន</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mentoringVisit.students_improved || 0}
              </div>
              <div className="text-sm text-gray-600">សិស្សមានការរីកចម្រើន</div>
            </div>
          </Col>
          <Col span={6}>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {mentoringVisit.classes_conducted_before || 0}
              </div>
              <div className="text-sm text-gray-600">ថ្នាក់រៀនដែលធ្វើពីមុន</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Teaching Details */}
      <Card title="ការបង្រៀន និងការរៀបចំ" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ថ្នាក់រៀនចាប់ផ្តើមទាន់ពេល">
                {renderBooleanIcon(mentoringVisit.class_started_on_time)}
                {mentoringVisit.class_started_on_time ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
              {mentoringVisit.late_start_reason && (
                <Descriptions.Item label="មូលហេតុចាប់ផ្តើមយឺត">
                  {mentoringVisit.late_start_reason}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="សិស្សបានដាក់ក្រុមតាមកម្រិត">
                {renderBooleanIcon(mentoringVisit.students_grouped_by_level)}
                {mentoringVisit.students_grouped_by_level ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
              <Descriptions.Item label="សិស្សចូលរួមយ៉ាងសកម្ម">
                {renderBooleanIcon(mentoringVisit.students_active_participation)}
                {mentoringVisit.students_active_participation ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col span={12}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="ឧបករណ៍បង្រៀន">
                {mentoringVisit.teaching_materials?.length ? 
                  mentoringVisit.teaching_materials.map(material => (
                    <Tag key={material} color="cyan">{material}</Tag>
                  )) : 'មិនបានបញ្ជាក់'
                }
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* Teacher Planning */}
      <Card title="ការរៀបចំរបស់អ្នកបង្រៀន" className="mb-4">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="មានផែនការបង្រៀន">
            {renderBooleanIcon(mentoringVisit.teacher_has_lesson_plan)}
            {mentoringVisit.teacher_has_lesson_plan ? ' បាទ/ចាស' : ' ទេ'}
          </Descriptions.Item>
          {mentoringVisit.teacher_has_lesson_plan && (
            <>
              <Descriptions.Item label="បានធ្វើតាមផែនការបង្រៀន">
                {renderBooleanIcon(mentoringVisit.followed_lesson_plan)}
                {mentoringVisit.followed_lesson_plan ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
              <Descriptions.Item label="ផែនការសមរម្យសម្រាប់កម្រិតសិស្ស">
                {renderBooleanIcon(mentoringVisit.plan_appropriate_for_levels)}
                {mentoringVisit.plan_appropriate_for_levels ? ' បាទ/ចាស' : ' ទេ'}
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
        
        {mentoringVisit.no_lesson_plan_reason && (
          <div className="mt-3">
            <Text strong>មូលហេតុមិនមានផែនការបង្រៀន:</Text>
            <div>{mentoringVisit.no_lesson_plan_reason}</div>
          </div>
        )}
        
        {mentoringVisit.not_followed_reason && (
          <div className="mt-3">
            <Text strong>មូលហេតុមិនធ្វើតាមផែនការ:</Text>
            <div>{mentoringVisit.not_followed_reason}</div>
          </div>
        )}
        
        {mentoringVisit.lesson_plan_feedback && (
          <div className="mt-3">
            <Text strong>មតិយោបល់អំពីផែនការបង្រៀន:</Text>
            <div>{mentoringVisit.lesson_plan_feedback}</div>
          </div>
        )}
      </Card>

      {/* Activities */}
      {mentoringVisit.num_activities_observed && mentoringVisit.num_activities_observed > 0 && (
        <Card title={`សកម្មភាពដែលបានអង្កេត (${mentoringVisit.num_activities_observed} សកម្មភាព)`} className="mb-4">
          {mentoringVisit.activity1_type && (
            <>
              <Title level={5}>សកម្មភាពទី ១</Title>
              <Descriptions column={2} size="small" className="mb-4">
                <Descriptions.Item label="ប្រភេទសកម្មភាព">
                  <Tag color="blue">{mentoringVisit.activity1_type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="រយៈពេល">
                  {mentoringVisit.activity1_duration} នាទី
                </Descriptions.Item>
                <Descriptions.Item label="មានការណែនាំច្បាស់លាស់">
                  {renderBooleanIcon(mentoringVisit.activity1_clear_instructions)}
                  {mentoringVisit.activity1_clear_instructions ? ' បាទ/ចាស' : ' ទេ'}
                </Descriptions.Item>
                <Descriptions.Item label="បានធ្វើតាមដំណើរការ">
                  {renderBooleanIcon(mentoringVisit.activity1_followed_process)}
                  {mentoringVisit.activity1_followed_process ? ' បាទ/ចាស' : ' ទេ'}
                </Descriptions.Item>
              </Descriptions>
              
              {mentoringVisit.activity1_unclear_reason && (
                <div className="mb-2">
                  <Text strong>មូលហេតុការណែនាំមិនច្បាស់:</Text>
                  <div>{mentoringVisit.activity1_unclear_reason}</div>
                </div>
              )}
              
              {mentoringVisit.activity1_not_followed_reason && (
                <div className="mb-2">
                  <Text strong>មូលហេតុមិនធ្វើតាមដំណើរការ:</Text>
                  <div>{mentoringVisit.activity1_not_followed_reason}</div>
                </div>
              )}
            </>
          )}

          {mentoringVisit.num_activities_observed >= 2 && mentoringVisit.activity2_type && (
            <>
              <Divider />
              <Title level={5}>សកម្មភាពទី ២</Title>
              <Descriptions column={2} size="small" className="mb-4">
                <Descriptions.Item label="ប្រភេទសកម្មភាព">
                  <Tag color="green">{mentoringVisit.activity2_type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="រយៈពេល">
                  {mentoringVisit.activity2_duration} នាទី
                </Descriptions.Item>
                <Descriptions.Item label="មានការណែនាំច្បាស់លាស់">
                  {renderBooleanIcon(mentoringVisit.activity2_clear_instructions)}
                  {mentoringVisit.activity2_clear_instructions ? ' បាទ/ចាស' : ' ទេ'}
                </Descriptions.Item>
                <Descriptions.Item label="បានធ្វើតាមដំណើរការ">
                  {renderBooleanIcon(mentoringVisit.activity2_followed_process)}
                  {mentoringVisit.activity2_followed_process ? ' បាទ/ចាស' : ' ទេ'}
                </Descriptions.Item>
              </Descriptions>
              
              {mentoringVisit.activity2_unclear_reason && (
                <div className="mb-2">
                  <Text strong>មូលហេតុការណែនាំមិនច្បាស់:</Text>
                  <div>{mentoringVisit.activity2_unclear_reason}</div>
                </div>
              )}
              
              {mentoringVisit.activity2_not_followed_reason && (
                <div className="mb-2">
                  <Text strong>មូលហេតុមិនធ្វើតាមដំណើរការ:</Text>
                  <div>{mentoringVisit.activity2_not_followed_reason}</div>
                </div>
              )}
            </>
          )}
        </Card>
      )}

      {/* Observations and Feedback */}
      <Card title="សេចក្តីសម្គាល់ និងមតិយោបល់" className="mb-4">
        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <Text strong>សេចក្តីសម្គាល់:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {mentoringVisit.observation || 'មិនមានសេចក្តីសម្គាល់'}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-4">
              <Text strong>មតិយោបល់ចំពោះអ្នកបង្រៀន:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {mentoringVisit.teacher_feedback || 'មិនមានមតិយោបល់'}
              </div>
            </div>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <div className="mb-4">
              <Text strong>ផែនការសកម្មភាព:</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">
                {mentoringVisit.action_plan || 'មិនមានផែនការសកម្មភាព'}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="mb-4">
              <Text strong>ការតាមដាន:</Text>
              <div className="mt-2">
                <Tag color={mentoringVisit.follow_up_required ? 'orange' : 'green'} icon={mentoringVisit.follow_up_required ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}>
                  {mentoringVisit.follow_up_required ? 'ត្រូវការការតាមដាន' : 'មិនត្រូវការការតាមដាន'}
                </Tag>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Timeline */}
      <Card title="ប្រវត្តិកាត់ទុក">
        <Timeline
          items={[
            {
              dot: <CheckCircleOutlined className="text-green-500" />,
              children: (
                <div>
                  <div className="font-medium">បង្កើតកាត់ទុក</div>
                  <div className="text-sm text-gray-500">
                    {dayjs(mentoringVisit.created_at).format('DD/MM/YYYY HH:mm')}
                  </div>
                </div>
              )
            },
            {
              dot: <EditOutlined className="text-blue-500" />,
              children: (
                <div>
                  <div className="font-medium">កែសម្រួលចុងក្រោយ</div>
                  <div className="text-sm text-gray-500">
                    {dayjs(mentoringVisit.updated_at).format('DD/MM/YYYY HH:mm')}
                  </div>
                </div>
              )
            }
          ]}
        />
      </Card>
    </HorizontalLayout>
  );
}