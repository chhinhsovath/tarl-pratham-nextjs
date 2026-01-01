'use client';

import { Card, Col, Row, Statistic, Progress, Typography, Tag, Button, Space, Alert, Divider } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface TeacherDashboardProps {
  userId: string;
  user: any;
}

export default function TeacherDashboard({ userId, user }: TeacherDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchTeacherData();
    } else {
      setLoading(false);
    }
    checkProfileCompletion();
  }, [userId]);

  const fetchTeacherData = async () => {
    if (!userId) {
      console.warn('Cannot fetch teacher data: userId is undefined');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/dashboard/teacher-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      } else if (response.status === 400 || response.status === 404) {
        console.warn('Failed to fetch teacher stats:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch teacher dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkProfileCompletion = () => {
    const isComplete = user?.pilot_school_id && user?.assigned_subject && user?.holding_classes;
    setProfileComplete(isComplete);
  };

  const getAssessmentProgress = (type: string) => {
    if (!stats?.assessment_stats) return { completed: 0, in_progress: 0, not_started: 0 };
    return stats.assessment_stats[type] || { completed: 0, in_progress: 0, not_started: 0 };
  };

  const getProgressPercent = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>កំពុងដំណើរការ...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        borderRadius: 8,
        padding: '24px',
        marginBottom: 24,
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', margin: 0, marginBottom: 8 }}>
          ស្វាគមន៍ត្រលប់មកវិញ, {user?.name}!
        </Title>
        <Text style={{ color: 'white', fontSize: 16 }}>
          ផ្ទាំងគ្រប់គ្រងគ្រូបង្រៀន
        </Text>
      </div>

      {/* Profile Incomplete Warning */}
      {!profileComplete && (
        <Alert
          message="សូមបំពេញការរៀបចំប្រវត្តិរូបដើម្បីចូលប្រើលក្ខណៈពិសេសទាំងអស់"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
          action={
            <Button 
              type="primary" 
              size="small"
              onClick={() => router.push('/profile-setup')}
            >
              បំពេញការរៀបចំប្រវត្តិរូប
            </Button>
          }
        />
      )}

      {/* Quick Action Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <UserOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>ប្រវត្តិរូប</Title>
              <Text type="secondary">កែសម្រួលប្រវត្តិរូប</Text>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push('/profile-setup')}
                >
                  កែសម្រួលប្រវត្តិរូប
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>សិស្ស</Title>
              <Text>{stats?.student_count || 0} សិស្ស</Text>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push('/students/manage')}
                >
                  គ្រប់គ្រងសិស្ស
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <FileTextOutlined style={{ fontSize: 32, color: '#722ed1', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>ការវាយតម្លៃ</Title>
              <Text type="secondary">ធ្វើតេស្ត</Text>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push('/assessments/create')}
                >
                  ចាប់ផ្តើមវាយតម្លៃ
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <div style={{ textAlign: 'center' }}>
              <EditOutlined style={{ fontSize: 32, color: '#fa8c16', marginBottom: 16 }} />
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>បញ្ជីសិស្ស</Title>
              <Text type="secondary">មើលទាំងអស់</Text>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push('/students')}
                >
                  មើលសិស្ស
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Assessment Progress Section */}
      {profileComplete && (
        <Card title="ដំណើរការវាយតម្លៃ" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {['baseline', 'midline', 'endline'].map((type) => {
              const progress = getAssessmentProgress(type);
              const total = progress.completed + progress.in_progress + progress.not_started;
              const completedPercent = getProgressPercent(progress.completed, total);
              
              return (
                <Col xs={24} sm={8} key={type}>
                  <div style={{ 
                    border: '1px solid #f0f0f0', 
                    borderRadius: 8, 
                    padding: 16,
                    height: '100%'
                  }}>
                    <Title level={5} style={{ marginBottom: 16, textAlign: 'center' }}>
                      ការវាយតម្លៃ {type === 'baseline' ? 'ដើមគ្រា' : type === 'midline' ? 'ពាក់កណ្តាលគ្រា' : 'ចុងគ្រា'}
                    </Title>
                    
                    <div style={{ marginBottom: 16, textAlign: 'center' }}>
                      <Progress 
                        type="circle" 
                        percent={completedPercent}
                        size={80}
                        format={(percent) => `${percent}%`}
                      />
                    </div>

                    <div style={{ space: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text type="secondary">បានតេស្តចុងក្រោយគ្រា:</Text>
                        <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                          <CheckCircleOutlined style={{ marginRight: 4 }} />
                          {progress.completed}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text type="secondary">កំពុងដំណើរការ:</Text>
                        <Text style={{ color: '#faad14', fontWeight: 'bold' }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {progress.in_progress}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">មិនទានចាប់ផ្តើម:</Text>
                        <Text style={{ color: '#8c8c8c', fontWeight: 'bold' }}>
                          {progress.not_started}
                        </Text>
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Mentor Special Notice */}
      {user?.role === 'mentor' && (
        <Alert
          message="អ្នកណែនាំ ផ្ទាំងគ្រប់គ្រង"
          description={
            <div>
              <div>ចងចាំ៖ សិស្ស និងការវាយតម្លៃដែលអ្នកបង្កើតគឺជាបណ្តោះអាសន្ន ហើយនឹងត្រូវបានលុបបន្ទាប់ពី 48 ម៉ោង លុះត្រាតែត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍។</div>
              {user.profile_expires_at && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#fa8c16' }}>
                  ⏰ ប្រវត្តិរូបរបស់អ្នកនឹងផុតកំណត់នៅ: {new Date(user.profile_expires_at).toLocaleString('km-KH', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Help Section */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          <InfoCircleOutlined style={{ fontSize: 20, color: '#1890ff', marginRight: 12, marginTop: 2 }} />
          <div>
            <Text strong style={{ display: 'block', marginBottom: 4 }}>
              ត្រូវការជំនួយ?
            </Text>
            <Text type="secondary">
              អ្នកអាចធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប បន្ថែមសិស្សថ្មី ឬធ្វើការវាយតម្លៃពីផ្ទាំងគ្រប់គ្រងនេះបាន
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}