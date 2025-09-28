'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Tag, 
  Button, 
  Image, 
  Timeline,
  Statistic,
  Descriptions,
  Progress,
  message,
  Spin,
  Alert,
  Tabs,
  Table
} from 'antd';
import { 
  EditOutlined, 
  UserOutlined, 
  PhoneOutlined, 
  HomeOutlined,
  CalendarOutlined,
  TrophyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface StudentDetailsPageProps {
  params: { id: string };
}

function StudentDetailsPageContent({ params }: StudentDetailsPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [student, setStudent] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check permissions
  if (!hasPermission(user, 'students.view')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    fetchStudentDetails();
  }, [params.id]);

  const fetchStudentDetails = async () => {
    try {
      const [studentRes, historyRes] = await Promise.all([
        fetch(`/api/students/${params.id}`),
        fetch(`/api/students/${params.id}/assessment-history`)
      ]);

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData.student);
      } else {
        message.error('Student not found');
        router.push('/students');
        return;
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setAssessmentHistory(historyData);
      }
    } catch (error) {
      console.error('Fetch student details error:', error);
      message.error('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'beginner': '#f50',
      'letter': '#ff7a00',
      'word': '#faad14',
      'paragraph': '#52c41a',
      'story': '#1890ff'
    };
    return colors[level] || '#d9d9d9';
  };

  const getLevelProgress = (level: string) => {
    const progress: Record<string, number> = {
      'beginner': 20,
      'letter': 40,
      'word': 60,
      'paragraph': 80,
      'story': 100
    };
    return progress[level] || 0;
  };

  const calculateImprovement = (current: any[], previous: any[]) => {
    if (!current[0] || !previous[0] || !current[0].score || !previous[0].score) {
      return null;
    }
    
    const improvement = current[0].score - previous[0].score;
    const percentage = ((improvement / previous[0].score) * 100).toFixed(1);
    
    return {
      improvement,
      percentage: parseFloat(percentage),
      isPositive: improvement > 0
    };
  };

  const assessmentColumns = [
    {
      title: 'Date',
      dataIndex: 'assessed_date',
      key: 'assessed_date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Type',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      render: (type: string) => (
        <Tag color={type === 'baseline' ? 'blue' : type === 'midline' ? 'orange' : 'green'}>
          {type.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => level ? (
        <Tag color={getLevelColor(level)}>
          {level.toUpperCase()}
        </Tag>
      ) : '-'
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score ? `${score}%` : '-'
    },
    {
      title: 'Assessed By',
      dataIndex: 'added_by',
      key: 'added_by',
      render: (addedBy: any) => addedBy ? (
        <div>
          <div>{addedBy.name}</div>
          <Tag size="small" color={addedBy.role === 'mentor' ? 'orange' : 'blue'}>
            {addedBy.role}
          </Tag>
        </div>
      ) : '-'
    },
    {
      title: 'Temporary',
      dataIndex: 'is_temporary',
      key: 'is_temporary',
      render: (isTemporary: boolean) => (
        isTemporary ? <Tag color="orange">Yes</Tag> : <Tag color="green">No</Tag>
      )
    }
  ];

  if (loading) {
    return (
      <div className="w-full">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Loading student details...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={24} align="middle">
          <Col span={4}>
            {student.photo ? (
              <Image
                src={student.photo}
                alt={student.name}
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            ) : (
              <div style={{
                width: '120px',
                height: '120px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}>
                <UserOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              </div>
            )}
          </Col>
          
          <Col span={16}>
            <Title level={2} style={{ marginBottom: '8px' }}>
              {student.name}
              {student.is_temporary && (
                <Tag color="orange" style={{ marginLeft: '12px' }}>
                  Temporary
                </Tag>
              )}
            </Title>
            
            <Row gutter={16}>
              <Col span={8}>
                <Text type="secondary">Age: </Text>
                <Text strong>{student.age || 'Not specified'}</Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">Gender: </Text>
                <Text strong>{student.gender || 'Not specified'}</Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">Class: </Text>
                <Text strong>
                  {student.school_class ? 
                    `${student.school_class.school?.name} - ${student.school_class.name}` :
                    student.pilot_school ? 
                      `${student.pilot_school.name} (Pilot)` :
                      'Not assigned'
                  }
                </Text>
              </Col>
            </Row>
          </Col>
          
          <Col span={4} style={{ textAlign: 'right' }}>
            {hasPermission(user, 'students.edit') && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => router.push(`/students/${student.id}/edit`)}
              >
                Edit Student
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {/* Temporary Student Warning */}
      {student.is_temporary && (
        <Alert
          message="Temporary Student"
          description={
            <div>
              This student was created by a mentor and is marked as temporary. 
              {student.mentor_created_at && (
                <>
                  <br />Created on: {new Date(student.mentor_created_at).toLocaleString()}
                  <br />Will be automatically deleted after 48 hours unless permanently saved.
                </>
              )}
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Overview" key="overview">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="Personal Information" style={{ marginBottom: '24px' }}>
                <Descriptions column={1}>
                  <Descriptions.Item label="Full Name">
                    {student.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Age">
                    {student.age || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Gender">
                    {student.gender || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Guardian Name">
                    {student.guardian_name || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Guardian Phone">
                    {student.guardian_phone || 'Not specified'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Address">
                    {student.address || 'Not specified'}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={12}>
              {assessmentHistory && (
                <Card title="Assessment Statistics" style={{ marginBottom: '24px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic 
                        title="Total Assessments" 
                        value={assessmentHistory.stats.total_assessments}
                        prefix={<TrophyOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic 
                        title="Temporary Assessments" 
                        value={assessmentHistory.stats.temporary_assessments}
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                  </Row>
                  
                  <Row gutter={16} style={{ marginTop: '16px' }}>
                    <Col span={8}>
                      <Text type="secondary">មូលដ្ឋាន:</Text>
                      <div>{assessmentHistory.stats.assessment_types.baseline}</div>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">កុលសនភាព:</Text>
                      <div>{assessmentHistory.stats.assessment_types.midline}</div>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">បញ្ចប់:</Text>
                      <div>{assessmentHistory.stats.assessment_types.endline}</div>
                    </Col>
                  </Row>
                </Card>
              )}
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="ដំណើរការវាយតម្លៃ" key="progress">
          {assessmentHistory && (
            <Row gutter={24}>
              <Col span={12}>
                <Card title="ដំណើរការភាសាខ្មែរ" style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>កម្រិតបច្ចុប្បន្ន:</Text>
                    <div style={{ marginTop: '8px' }}>
                      <div>មូលដ្ឋាន: {assessmentHistory.levelProgression.khmer.baseline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.khmer.baseline)}>
                          {assessmentHistory.levelProgression.khmer.baseline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                      
                      <div>កុលសនភាព: {assessmentHistory.levelProgression.khmer.midline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.khmer.midline)}>
                          {assessmentHistory.levelProgression.khmer.midline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                      
                      <div>បញ្ចប់: {assessmentHistory.levelProgression.khmer.endline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.khmer.endline)}>
                          {assessmentHistory.levelProgression.khmer.endline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                    </div>
                  </div>

                  {assessmentHistory.levelProgression.khmer.baseline && (
                    <Progress 
                      percent={getLevelProgress(assessmentHistory.levelProgression.khmer.baseline)}
                      strokeColor={getLevelColor(assessmentHistory.levelProgression.khmer.baseline)}
                      format={() => assessmentHistory.levelProgression.khmer.baseline.toUpperCase()}
                    />
                  )}
                </Card>
              </Col>

              <Col span={12}>
                <Card title="ដំណើរការគណិតវិទ្យា" style={{ marginBottom: '24px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text strong>កម្រិតបច្ចុប្បន្ន:</Text>
                    <div style={{ marginTop: '8px' }}>
                      <div>មូលដ្ឋាន: {assessmentHistory.levelProgression.math.baseline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.math.baseline)}>
                          {assessmentHistory.levelProgression.math.baseline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                      
                      <div>កុលសនភាព: {assessmentHistory.levelProgression.math.midline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.math.midline)}>
                          {assessmentHistory.levelProgression.math.midline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                      
                      <div>បញ្ចប់: {assessmentHistory.levelProgression.math.endline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.math.endline)}>
                          {assessmentHistory.levelProgression.math.endline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">Not assessed</Text>}</div>
                    </div>
                  </div>

                  {assessmentHistory.levelProgression.math.baseline && (
                    <Progress 
                      percent={getLevelProgress(assessmentHistory.levelProgression.math.baseline)}
                      strokeColor={getLevelColor(assessmentHistory.levelProgression.math.baseline)}
                      format={() => assessmentHistory.levelProgression.math.baseline.toUpperCase()}
                    />
                  )}
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>

        <TabPane tab="Assessment History" key="history">
          {assessmentHistory && (
            <Card title="All Assessments">
              <Table
                columns={assessmentColumns}
                dataSource={assessmentHistory.assessments}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}
export default function StudentDetailsPage() {
  return (
    <HorizontalLayout>
      <StudentDetailsPageContent />
    </HorizontalLayout>
  );
}
