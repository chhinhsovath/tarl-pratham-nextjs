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
  ExclamationCircleOutlined,
  FileTextOutlined,
  CheckSquareOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

// Service Layer - Connects to real API endpoints
class TeacherDashboardService {
  static async getDashboardStats(teacherId: string) {
    try {
      const response = await fetch(`/api/dashboard/teacher-stats?userId=${teacherId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to fetch stats');
      }
      const data = await response.json();

      // Transform API response to match dashboard expectations
      const stats = data.statistics || {};
      return {
        my_students: stats.student_count || 0,
        pending_assessments: stats.assessment_stats?.baseline?.not_started || 0,
        completed_assessments: (
          (stats.assessment_stats?.baseline?.completed || 0) +
          (stats.assessment_stats?.midline?.completed || 0) +
          (stats.assessment_stats?.endline?.completed || 0)
        ),
        class_average: 0, // TODO: Calculate from actual assessment scores
        improvement_rate: 0 // TODO: Calculate from baseline vs current
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        my_students: 0,
        pending_assessments: 0,
        completed_assessments: 0,
        class_average: 0,
        improvement_rate: 0
      };
    }
  }

  static async getRecentStudents(teacherId: string) {
    try {
      const response = await fetch(`/api/students?teacher_id=${teacherId}&limit=5&with_latest_assessment=true`);
      if (!response.ok) return [];
      const data = await response.json();

      return (data.students || []).map((student: any) => ({
        id: student.id,
        student_name: student.name,
        grade_level: `grade_${student.class || 4}`,
        last_assessment: student.latest_assessment?.assessed_date || null,
        recent_score: student.latest_assessment?.score || 0,
        status: student.latest_assessment ? 'active' : 'needs_attention'
      }));
    } catch (error) {
      console.error('Error fetching recent students:', error);
      return [];
    }
  }

  static async getPendingTasks(teacherId: string) {
    // TODO: Implement pending tasks from mentoring visits API
    return [];
  }

  static async getProgressData(teacherId: string) {
    // TODO: Implement progress tracking from assessments API
    return {
      subjects: [],
      weekly_progress: []
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
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [pendingTasks, setPendingTasks] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any>({});

  useEffect(() => {
    // Only fetch data if user and user.id are both defined
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]); // Depend on user.id specifically

  const fetchDashboardData = async () => {
    if (!user?.id) {
      console.warn('Cannot fetch dashboard data: user.id is undefined');
      return;
    }
    
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
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            title="មើលលម្អិតសិស្ស"
          />
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => router.push(`/students/${record.id}/edit`)}
            title="កែប្រែសិស្ស"
          />
          {user?.role === 'mentor' && (
            <>
              <Button
                size="small"
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => router.push(`/assessments/create?student_id=${record.id}`)}
                title="វាយតម្លៃដោយផ្ទាល់"
              />
              <Button
                size="small"
                type="default"
                icon={<CheckSquareOutlined />}
                onClick={() => router.push(`/assessments/verify?student_id=${record.id}`)}
                title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ"
              />
            </>
          )}
        </Space>
      )
    }
  ];

  // Show loading state while session is loading or while fetching data
  if (sessionStatus === 'loading' || (loading && !user?.id)) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>កំពុងទាញយកទិន្នន័យ...</Text>
      </div>
    );
  }

  // Show message if user session is ready but user.id is still undefined
  if (!user?.id) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Alert
          message="មានបញ្ហា"
          description="មិនអាចទាញយកព័ត៌មានអ្នកប្រើប្រាស់បានទេ។ សូមព្យាយាមចូលម្តងទៀត។"
          type="warning"
          showIcon
        />
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
            <Table scroll={{ x: "max-content" }}
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

      {/* Daily Insights - Only show if there's data */}
      {(dashboardStats.my_students > 0 || recentStudents.length > 0) && (
        <Alert
          message="ការវិភាគប្រចាំថ្ងៃ"
          description={
            <div>
              {dashboardStats.my_students > 0 && (
                <p>• <strong>សិស្សសរុប:</strong> អ្នកមានសិស្សចំនួន {dashboardStats.my_students} នាក់</p>
              )}
              {dashboardStats.completed_assessments > 0 && (
                <p>• <strong>ការវាយតម្លៃបានធ្វើ:</strong> ការវាយតម្លៃសរុប {dashboardStats.completed_assessments} ដង</p>
              )}
              {recentStudents.filter(s => s.status === 'needs_attention').length > 0 && (
                <p>• <strong>ការយកចិត្តទុកដាក់:</strong> សិស្ស {recentStudents.filter(s => s.status === 'needs_attention').length} នាក់ត្រូវការការយកចិត្តទុកដាក់បន្ថែម</p>
              )}
              {pendingTasks.filter(t => t.priority === 'high').length > 0 && (
                <p>• <strong>កិច្ចការបន្ទាន់:</strong> អ្នកមានកិច្ចការបន្ទាន់ចំនួន {pendingTasks.filter(t => t.priority === 'high').length} ក្នុងសប្តាហ៍នេះ</p>
              )}
            </div>
          }
          type="info"
          showIcon
        />
      )}
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