'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Row, Col, Typography, Space, Spin, Progress, Badge, Tag } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  FireOutlined,
  RocketOutlined
} from '@ant-design/icons';
import QuickActionCard from './QuickActionCard';
import TaskList from './TaskList';
import ProgressSummary from './ProgressSummary';
import AdminDashboard from './AdminDashboard';

const { Title, Text, Paragraph } = Typography;

interface DashboardStats {
  currentPeriod: 'baseline' | 'midline' | 'endline';
  periodLabel: string;
  tasksToday: Task[];
  progressPercentage: number;
  studentsAssessed: number;
  studentsRemaining: number;
  totalStudents: number;
  upcomingDeadlines: Deadline[];
  recentActivity: Activity[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
}

interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'assessment' | 'visit' | 'report';
}

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  icon: string;
}

export default function SmartDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  // Show AdminDashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/smart-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Set default data for demo
      setStats({
        currentPeriod: 'baseline',
        periodLabel: 'តេស្តដើមគ្រា',
        tasksToday: [
          {
            id: '1',
            title: 'បញ្ចប់ការវាយតម្លៃសិស្សនៅសល់',
            description: '7 នាក់នៅសល់ត្រូវធ្វើតេស្ត',
            priority: 'high',
            completed: false
          },
          {
            id: '2',
            title: 'ពិនិត្យលទ្ធផលតេស្តពីម្សិលមិញ',
            description: 'ពិនិត្យនិងបញ្ជាក់លទ្ធផល',
            priority: 'medium',
            completed: false
          }
        ],
        progressPercentage: 76,
        studentsAssessed: 23,
        studentsRemaining: 7,
        totalStudents: 30,
        upcomingDeadlines: [
          {
            id: '1',
            title: 'តេស្តពាក់កណ្ដាលគ្រា',
            date: '2025-10-15',
            type: 'assessment'
          },
          {
            id: '2',
            title: 'ជួបអ្នកណែនាំ',
            date: '2025-10-20',
            type: 'visit'
          }
        ],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'baseline': return '#667eea';
      case 'midline': return '#f5576c';
      case 'endline': return '#4facfe';
      default: return '#667eea';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'អរុណសួស្តី';
    if (hour < 17) return 'ទិវាសួស្តី';
    return 'សាយណ្ហសួស្តី';
  };

  const getQuickActions = () => {
    if (user?.role === 'teacher') {
      return [
        {
          title: 'ធ្វើតេស្តសិស្ស',
          description: 'ចាប់ផ្តើមការវាយតម្លៃថ្មី',
          icon: '📝',
          link: '/assessments/create',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          badge: stats?.studentsRemaining || 0
        },
        {
          title: 'ធ្វើតេស្តច្រើននាក់',
          description: 'វាយតម្លៃសិស្សច្រើននាក់ក្នុងពេលតែមួយ',
          icon: '👥',
          link: '/assessments/create-bulk',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          title: 'មើលសិស្ស',
          description: 'បញ្ជីសិស្សទាំងអស់',
          icon: '👨‍🎓',
          link: '/students',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
          title: 'របាយការណ៍',
          description: 'មើលលទ្ធផលនិងរបាយការណ៍',
          icon: '📊',
          link: '/reports',
          color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
      ];
    } else if (user?.role === 'mentor') {
      return [
        {
          title: 'ចាប់ផ្តើមការទស្សនកិច្ច',
          description: 'បង្កើតការទស្សនកិច្ចថ្មី',
          icon: '🎯',
          link: '/mentoring-visits/create',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
          title: 'សិស្សបណ្តោះអាសន្ន',
          description: 'មើលសិស្សសាកល្បង',
          icon: '👥',
          link: '/students?is_temporary=true',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
          title: 'បង្កើតសិស្សសាកល្បង',
          description: 'សម្រាប់ការបង្ហាញ',
          icon: '➕',
          link: '/students/create',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        },
        {
          title: 'ការទស្សនកិច្ចរបស់ខ្ញុំ',
          description: 'មើលការទស្សនកិច្ចទាំងអស់',
          icon: '📋',
          link: '/mentoring-visits',
          color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        }
      ];
    }

    // Default actions for other roles
    return [
      {
        title: 'ទំព័រដើម',
        description: 'ត្រឡប់ទៅទំព័រដើម',
        icon: '🏠',
        link: '/',
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }
    ];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>កំពុងផ្ទុក...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '0 12px' }}>
      {/* Welcome Header */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${getPeriodColor(stats?.currentPeriod || 'baseline')} 0%, ${getPeriodColor(stats?.currentPeriod || 'baseline')}dd 100%)`,
          border: 'none',
          marginBottom: '24px',
          color: 'white',
          width: '100%'
        }}
        bodyStyle={{ padding: '16px' }}
      >
        <Row align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Space direction="vertical" size={4}>
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                👋 {getGreeting()} គ្រូ {user?.name}!
              </Title>
              <Paragraph style={{ margin: 0, color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                📅 ថ្ងៃនេះ: <strong>{stats?.periodLabel}</strong>
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
            <Tag color="white" style={{ color: getPeriodColor(stats?.currentPeriod || 'baseline'), fontSize: '14px', padding: '8px 16px' }}>
              <FireOutlined /> វគ្គបច្ចុប្បន្ន
            </Tag>
          </Col>
        </Row>
      </Card>

      {/* Today's Tasks */}
      {stats?.tasksToday && stats.tasksToday.length > 0 && (
        <Card
          title={
            <Space>
              <RocketOutlined style={{ color: '#667eea' }} />
              <Text strong style={{ fontSize: '18px' }}>🎯 ការងារថ្ងៃនេះ</Text>
            </Space>
          }
          style={{ marginBottom: '24px', width: '100%' }}
          bodyStyle={{ padding: '16px' }}
          extra={
            <Badge count={stats.tasksToday.filter(t => !t.completed).length} showZero>
              <Text type="secondary">នៅសល់</Text>
            </Badge>
          }
        >
          <TaskList tasks={stats.tasksToday} onTaskComplete={loadDashboardData} />

          {/* Progress Bar */}
          {stats.totalStudents > 0 && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={18}>
                  <Space direction="vertical" size={4} style={{ width: '100%' }}>
                    <Text strong>ការវឌ្ឍនភាពការវាយតម្លៃ</Text>
                    <Progress
                      percent={stats.progressPercentage}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      size="small"
                    />
                  </Space>
                </Col>
                <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                  <Space direction="vertical" size={0}>
                    <Text strong style={{ fontSize: '24px', color: '#52c41a' }}>
                      {stats.studentsAssessed}/{stats.totalStudents}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>សិស្សបានធ្វើតេស្ត</Text>
                  </Space>
                </Col>
              </Row>

              {stats.studentsRemaining > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <Text type="warning">
                    ⚠️ នៅសល់ <strong>{stats.studentsRemaining} នាក់</strong> ត្រូវធ្វើតេស្ត
                  </Text>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <Card
        title={
          <Space>
            <FireOutlined style={{ color: '#f5222d' }} />
            <Text strong style={{ fontSize: '18px' }}>🔥 ជម្រើសរហ័ស</Text>
          </Space>
        }
        style={{ marginBottom: '24px', width: '100%' }}
        bodyStyle={{ padding: '16px' }}
      >
        <Row gutter={[12, 12]} className="quick-actions-grid">
          {getQuickActions().map((action, index) => (
            <Col xs={24} sm={12} md={6} key={index}>
              <QuickActionCard {...action} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Upcoming Deadlines */}
      {stats?.upcomingDeadlines && stats.upcomingDeadlines.length > 0 && (
        <Card
          title={
            <Space>
              <ClockCircleOutlined style={{ color: '#fa8c16' }} />
              <Text strong style={{ fontSize: '18px' }}>📅 ការណាត់ជួបខាងមុខ</Text>
            </Space>
          }
          style={{ width: '100%' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {stats.upcomingDeadlines.map(deadline => (
              <div
                key={deadline.id}
                style={{
                  padding: '12px 16px',
                  background: '#fafafa',
                  borderRadius: '8px',
                  borderLeft: '4px solid #1890ff'
                }}
              >
                <Row justify="space-between" align="middle" gutter={[8, 8]}>
                  <Col xs={24} sm={16}>
                    <Text strong>{deadline.title}</Text>
                  </Col>
                  <Col xs={24} sm={8} style={{ textAlign: 'right' }}>
                    <Tag color="blue">{deadline.date}</Tag>
                  </Col>
                </Row>
              </div>
            ))}
          </Space>
        </Card>
      )}

      {/* Achievement Badge (if high progress) */}
      {stats && stats.progressPercentage >= 80 && (
        <Card
          style={{
            marginTop: '24px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            border: 'none',
            width: '100%',
            maxWidth: '100%'
          }}
          bodyStyle={{ textAlign: 'center', padding: '16px' }}
        >
          <Space direction="vertical" size="small">
            <TrophyOutlined style={{ fontSize: '48px', color: 'white' }} />
            <Title level={4} style={{ margin: 0, color: 'white' }}>
              អបអរសាទរ! 🎉
            </Title>
            <Text style={{ color: 'white' }}>
              អ្នកបានបញ្ចប់ {stats.progressPercentage}% នៃការវាយតម្លៃ!
            </Text>
          </Space>
        </Card>
      )}
    </div>
  );
}
