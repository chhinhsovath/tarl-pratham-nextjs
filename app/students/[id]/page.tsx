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
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function StudentDetailsPageContent() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const user = session?.user;
  const studentId = params?.id as string;
  
  const [student, setStudent] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check permissions
  if (!hasPermission(user, 'students.view')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId]);

  const fetchStudentDetails = async () => {
    if (!studentId) return;

    try {
      const [studentRes, historyRes] = await Promise.all([
        fetch(`/api/students/${studentId}`),
        fetch(`/api/students/${studentId}/assessment-history`)
      ]);

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        setStudent(studentData.student);
      } else {
        message.error('រកមិនឃើញសិស្ស');
        router.push('/students');
        return;
      }

      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setAssessmentHistory(historyData);
      }
    } catch (error) {
      console.error('Fetch student details error:', error);
      message.error('មិនអាចផ្ទុកទិន្នន័យសិស្ស');
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
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'assessed_date',
      key: 'assessed_date',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      render: (type: string) => (
        <Tag color={type === 'baseline' ? 'blue' : type === 'midline' ? 'orange' : 'green'}>
          {type === 'baseline' ? 'មូលដ្ឋាន' : type === 'midline' ? 'កុលសនភាព' : 'បញ្ចប់'}
        </Tag>
      )
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
        </Tag>
      )
    },
    {
      title: 'កម្រិត',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => level ? (
        <Tag color={getLevelColor(level)}>
          {level.toUpperCase()}
        </Tag>
      ) : '-'
    },
    {
      title: 'ពិន្ទុ',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score ? `${score}%` : '-'
    },
    {
      title: 'វាយតម្លៃដោយ',
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
      title: 'បណ្តោះអាសន្ន',
      dataIndex: 'is_temporary',
      key: 'is_temporary',
      render: (isTemporary: boolean) => (
        isTemporary ? <Tag color="orange">បាទ/ចាស</Tag> : <Tag color="green">ទេ</Tag>
      )
    }
  ];

  if (loading) {
    return (
      <div className="max-w-full overflow-x-hidden">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>កំពុងផ្ទុកទិន្នន័យសិស្ស...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="max-w-full overflow-x-hidden">
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
                  បណ្តោះអាសន្ន
                </Tag>
              )}
            </Title>

            <Row gutter={16}>
              <Col span={8}>
                <Text type="secondary">អាយុ: </Text>
                <Text strong>{student.age || 'មិនបានបញ្ជាក់'}</Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">ភេទ: </Text>
                <Text strong>{student.gender || 'មិនបានបញ្ជាក់'}</Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">ថ្នាក់: </Text>
                <Text strong>
                  {student.school_class ?
                    `${student.school_class.school?.name} - ${student.school_class.name}` :
                    student.pilot_school ?
                      `${student.pilot_school.school_name} (សាកល្បង)` :
                      'មិនបានកំណត់'
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
                កែប្រែសិស្ស
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {/* Temporary Student Warning */}
      {student.is_temporary && (
        <Alert
          message="សិស្សបណ្តោះអាសន្ន"
          description={
            <div>
              សិស្សនេះត្រូវបានបង្កើតដោយអ្នកណែនាំ ហើយត្រូវបានសម្គាល់ថាជាបណ្តោះអាសន្ន។
              {student.mentor_created_at && (
                <>
                  <br />កាលបរិច្ឆេទបង្កើត: {new Date(student.mentor_created_at).toLocaleString()}
                  <br />នឹងត្រូវបានលុបដោយស្វ័យប្រវត្តិបន្ទាប់ពី ៤៨ ម៉ោង ប្រសិនបើមិនត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍។
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
        <TabPane tab="ទិដ្ឋភាពទូទៅ" key="overview">
          <Row gutter={24}>
            <Col span={12}>
              <Card title="ព័ត៌មានសិស្ស" style={{ marginBottom: '24px' }}>
                <Descriptions column={1}>
                  <Descriptions.Item label="លេខសម្គាល់សិស្ស">
                    {student.student_id || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item label="ឈ្មោះសិស្ស">
                    {student.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="ភេទ">
                    <Tag color={student.gender === 'male' ? 'blue' : student.gender === 'female' ? 'pink' : 'default'}>
                      {student.gender === 'male' ? 'ប្រុស' : student.gender === 'female' ? 'ស្រី' : student.gender === 'other' ? 'ផ្សេងទៀត' : '-'}
                    </Tag>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={12}>
              {assessmentHistory && (
                <Card title="ស្ថិតិការវាយតម្លៃ" style={{ marginBottom: '24px' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="ការវាយតម្លៃសរុប"
                        value={assessmentHistory.stats.total_assessments}
                        prefix={<TrophyOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="ការវាយតម្លៃបណ្តោះអាសន្ន"
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
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>

                      <div>កុលសនភាព: {assessmentHistory.levelProgression.khmer.midline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.khmer.midline)}>
                          {assessmentHistory.levelProgression.khmer.midline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>

                      <div>បញ្ចប់: {assessmentHistory.levelProgression.khmer.endline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.khmer.endline)}>
                          {assessmentHistory.levelProgression.khmer.endline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>
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
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>

                      <div>កុលសនភាព: {assessmentHistory.levelProgression.math.midline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.math.midline)}>
                          {assessmentHistory.levelProgression.math.midline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>

                      <div>បញ្ចប់: {assessmentHistory.levelProgression.math.endline ? (
                        <Tag color={getLevelColor(assessmentHistory.levelProgression.math.endline)}>
                          {assessmentHistory.levelProgression.math.endline.toUpperCase()}
                        </Tag>
                      ) : <Text type="secondary">មិនទាន់វាយតម្លៃ</Text>}</div>
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

        <TabPane tab="ប្រវត្តិការវាយតម្លៃ" key="history">
          {assessmentHistory && (
            <Card title="ការវាយតម្លៃទាំងអស់">
              <Table scroll={{ x: "max-content" }}
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
