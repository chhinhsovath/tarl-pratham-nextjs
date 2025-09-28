'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Space,
  Table,
  Tag,
  Button,
  Alert,
  List,
  Avatar,
  Divider
} from 'antd';
import { 
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Laravel-style Service Layer
class TeacherDashboardService {
  static async getDashboardStats(teacherId: string) {
    // Mock data simulating Laravel Controller -> Service -> Repository pattern
    return {
      my_students: 28,
      pending_assessments: 5,
      completed_assessments: 45,
      class_average: 74.5,
      improvement_rate: 18.2
    };
  }

  static async getRecentStudents(teacherId: string) {
    return [
      {
        id: 1,
        student_name: 'គុណ សុវណ្ណ',
        grade_level: 'grade_4',
        last_assessment: '2024-01-20',
        recent_score: 78,
        status: 'active'
      },
      {
        id: 2,
        student_name: 'ញឹម បញ្ញា',
        grade_level: 'grade_5',
        last_assessment: '2024-01-18',
        recent_score: 82,
        status: 'active'
      },
      {
        id: 3,
        student_name: 'ចន្ទ ព្រេង',
        grade_level: 'grade_4',
        last_assessment: '2024-01-15',
        recent_score: 65,
        status: 'needs_attention'
      },
      {
        id: 4,
        student_name: 'វន្នី ស្រេង',
        grade_level: 'grade_5',
        last_assessment: '2024-01-17',
        recent_score: 88,
        status: 'excellent'
      }
    ];
  }

  static async getPendingTasks(teacherId: string) {
    return [
      {
        id: 1,
        type: 'assessment',
        title: 'ការវាយតម្លៃមូលដ្ឋានសម្រាប់ថ្នាក់ទី៤',
        due_date: '2024-01-25',
        priority: 'high',
        students_count: 12
      },
      {
        id: 2,
        type: 'report',
        title: 'របាយការណ៍ការបង្រៀនប្រចាំខែ',
        due_date: '2024-01-30',
        priority: 'medium',
        status: 'draft'
      },
      {
        id: 3,
        type: 'mentoring',
        title: 'ការពិគ្រោះយោបល់ជាមួយអ្នកណែនាំ',
        due_date: '2024-01-23',
        priority: 'high',
        mentor_name: 'សោភ័ណ រតន៍'
      }
    ];
  }

  static async getProgressData(teacherId: string) {
    return {
      subjects: [
        {
          subject: 'ភាសាខ្មែរ',
          baseline: 45,
          current: 68,
          target: 75,
          improvement: 23
        },
        {
          subject: 'គណិតវិទ្យា',
          baseline: 52,
          current: 71,
          target: 80,
          improvement: 19
        }
      ],
      weekly_progress: [
        { week: 'សប្តាហ៍ទី១', score: 45 },
        { week: 'សប្តាហ៍ទី២', score: 52 },
        { week: 'សប្តាហ៍ទី៣', score: 58 },
        { week: 'សប្តាហ៍ទី៤', score: 68 }
      ]
    };
  }
}

// Laravel-style Resource/Presenter Layer
class TeacherDashboardPresenter {
  static formatStudentStatus(status: string) {
    const statusMap = {
      active: { color: 'green', text: 'សកម្ម' },
      needs_attention: { color: 'orange', text: 'ត្រូវការការយកចិត្តទុកដាក់' },
      excellent: { color: 'blue', text: 'ប្រសើរ' },
      inactive: { color: 'red', text: 'អសកម្ម' }
    };
    return statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
  }

  static formatPriority(priority: string) {
    const priorityMap = {
      high: { color: 'red', text: 'បន្ទាន់' },
      medium: { color: 'orange', text: 'មធ្យម' },
      low: { color: 'green', text: 'ទាប' }
    };
    return priorityMap[priority as keyof typeof priorityMap] || { color: 'default', text: priority };
  }

  static formatGradeLevel(grade: string) {
    const gradeMap = {
      grade_4: 'ថ្នាក់ទី៤',
      grade_5: 'ថ្នាក់ទី៥'
    };
    return gradeMap[grade as keyof typeof gradeMap] || grade;
  }
}

function TeacherDashboardContent() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>({});

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Laravel-style service calls
      const [stats, students, tasks, progress] = await Promise.all([
        TeacherDashboardService.getDashboardStats(user.id.toString()),
        TeacherDashboardService.getRecentStudents(user.id.toString()),
        TeacherDashboardService.getPendingTasks(user.id.toString()),
        TeacherDashboardService.getProgressData(user.id.toString())
      ]);

      setDashboardStats(stats);
      setRecentStudents(students);
      setPendingTasks(tasks);
      setProgressData(progress);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImprovementColor = (value: number) => {
    if (value > 20) return '#52c41a';
    if (value > 10) return '#faad14';
    return '#ff4d4f';
  };

  const studentColumns = [
    {
      title: 'សិស្ស',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (name: string, record: any) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div><strong>{name}</strong></div>
            <Text type="secondary">{TeacherDashboardPresenter.formatGradeLevel(record.grade_level)}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'ការវាយតម្លៃចុងក្រោយ',
      dataIndex: 'last_assessment',
      key: 'last_assessment',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'ពិន្ទុថ្មី',
      dataIndex: 'recent_score',
      key: 'recent_score',
      render: (score: number) => (
        <Tag color={score > 80 ? 'green' : score > 60 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      )
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const formatted = TeacherDashboardPresenter.formatStudentStatus(status);
        return <Tag color={formatted.color}>{formatted.text}</Tag>;
      }
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />} />
          <Button size="small" icon={<EditOutlined />} />
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>កំពុងទាញយកទិន្នន័យ...</Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <Card>
        <Title level={2} style={{ margin: 0 }}>
          <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          ផ្ទាំងគ្រប់គ្រងសម្រាប់គ្រូបង្រៀន
        </Title>
        <Text type="secondary">
          សូមស្វាគមន៍ {user?.name || 'គ្រូបង្រៀន'} - គ្រប់គ្រងថ្នាក់រៀន និងតាមដានដំណើរការរបស់សិស្ស
        </Text>
      </Card>

      {/* Statistics Overview */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={4}>
          <Card>
            <Statistic
              title="សិស្សរបស់ខ្ញុំ"
              value={dashboardStats.my_students}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card>
            <Statistic
              title="ការវាយតម្លៃមិនទាន់ធ្វើ"
              value={dashboardStats.pending_assessments}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card>
            <Statistic
              title="ការវាយតម្លៃបានធ្វើ"
              value={dashboardStats.completed_assessments}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card>
            <Statistic
              title="ពិន្ទុមធ្យមថ្នាក់"
              value={dashboardStats.class_average}
              suffix="%"
              prefix={<BarChartOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Card>
            <Statistic
              title="អត្រាកែលម្អ"
              value={dashboardStats.improvement_rate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="សកម្មភាពរហ័ស">
        <Row gutter={16}>
          <Col xs={12} sm={8} lg={6}>
            <Button 
              type="primary" 
              block 
              icon={<PlusOutlined />}
              onClick={() => router.push('/assessments/create')}
            >
              បន្ថែមការវាយតម្លៃ
            </Button>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Button 
              block 
              icon={<UserOutlined />}
              onClick={() => router.push('/students')}
            >
              គ្រប់គ្រងសិស្ស
            </Button>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Button 
              block 
              icon={<BarChartOutlined />}
              onClick={() => router.push('/reports')}
            >
              មើលរបាយការណ៍
            </Button>
          </Col>
          <Col xs={12} sm={8} lg={6}>
            <Button 
              block 
              icon={<CalendarOutlined />}
              onClick={() => router.push('/mentoring')}
            >
              កាលវិភាគអប់រំ
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* Recent Students */}
        <Col xs={24} lg={16}>
          <Card 
            title="សិស្សថ្មីៗ"
            extra={
              <Button 
                type="link" 
                onClick={() => router.push('/students')}
              >
                មើលទាំងអស់
              </Button>
            }
          >
            <Table
              columns={studentColumns}
              dataSource={recentStudents}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Pending Tasks */}
        <Col xs={24} lg={8}>
          <Card title="កិច្ចការមិនទាន់ធ្វើ">
            <List
              dataSource={pendingTasks}
              renderItem={(task: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: task.type === 'assessment' ? '#1890ff' : 
                                            task.type === 'report' ? '#52c41a' : '#faad14'
                        }}
                        icon={
                          task.type === 'assessment' ? <BookOutlined /> :
                          task.type === 'report' ? <BarChartOutlined /> : <UserOutlined />
                        }
                      />
                    }
                    title={
                      <div>
                        <Text strong>{task.title}</Text>
                        <Tag 
                          size="small" 
                          color={TeacherDashboardPresenter.formatPriority(task.priority).color}
                          style={{ marginLeft: 8 }}
                        >
                          {TeacherDashboardPresenter.formatPriority(task.priority).text}
                        </Tag>
                      </div>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          <CalendarOutlined /> ថ្ងៃកំណត់: {dayjs(task.due_date).format('DD/MM/YYYY')}
                        </Text>
                        {task.students_count && (
                          <Text type="secondary">
                            <UserOutlined /> {task.students_count} សិស្ស
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Subject Progress */}
      <Card title="ការវិវត្តតាমমុខវិជ្ជា">
        <Row gutter={16}>
          {progressData.subjects?.map((subject: any, index: number) => (
            <Col xs={24} md={12} key={index}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>{subject.subject}</Text>
                  <div style={{ float: 'right' }}>
                    <Text type="secondary">មូលដ្ឋាន: {subject.baseline}%</Text>
                    <Divider type="vertical" />
                    <Text strong>បច្ចុប្បន្ន: {subject.current}%</Text>
                    <Divider type="vertical" />
                    <Text type="secondary">គោលដៅ: {subject.target}%</Text>
                  </div>
                </div>
                <Progress
                  percent={(subject.current / subject.target) * 100}
                  strokeColor={getImprovementColor(subject.improvement)}
                  format={() => (
                    <span style={{ color: getImprovementColor(subject.improvement) }}>
                      +{subject.improvement}%
                    </span>
                  )}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Daily Insights */}
      <Alert
        message="ការវិភាគប្រចាំថ្ងៃ"
        description={
          <div>
            <p>• <strong>ការកែលម្អល្អ:</strong> សិស្សរបស់អ្នកបានកែលម្អពិន្ទុមធ្យម {dashboardStats.improvement_rate}% ក្នុងខែនេះ</p>
            <p>• <strong>ការយកចិត្តទុកដាក់:</strong> សិស្ស {recentStudents.filter(s => s.status === 'needs_attention').length} នាក់ត្រូវការការយកចិត្តទុកដាក់បន្ថែម</p>
            <p>• <strong>កិច្ចការបន្ទាន់:</strong> អ្នកមានកិច្ចការបន្ទាន់ចំនួន {pendingTasks.filter(t => t.priority === 'high').length} ក្នុងសប្តាហ៍នេះ</p>
          </div>
        }
        type="info"
        showIcon
      />
    </Space>
  );
}

export default function TeacherDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Laravel-style Middleware/Guard simulation
  if (!user || !hasPermission(user, 'teacher.workspace')) {
    return (
      <HorizontalLayout>
        <Alert 
          message="មិនមានសិទ្ធិចូលប្រើ" 
          description="អ្នកមិនមានសិទ្ធិចូលដំណើរការផ្ទាំងគ្រប់គ្រងគ្រូបង្រៀនទេ។"
          type="error" 
          showIcon 
        />
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <TeacherDashboardContent />
    </HorizontalLayout>
  );
}