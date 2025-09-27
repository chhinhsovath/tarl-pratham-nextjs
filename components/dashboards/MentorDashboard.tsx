'use client';

import { Card, Col, Row, Statistic, Progress, Typography, Tag, Button, Space, Alert, Table } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const { Text } = Typography;

interface MentorDashboardProps {
  userId: string;
  user: any;
}

export default function MentorDashboard({ userId, user }: MentorDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    fetchMentorData();
  }, [userId]);

  const fetchMentorData = async () => {
    try {
      const response = await fetch(`/api/dashboard/mentor-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
        setRecentAssessments(data.recent_assessments || []);
        setChartData(data.charts);
      }
    } catch (error) {
      console.error('Failed to fetch mentor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data for assessment distribution
  const assessmentDistributionData = {
    labels: ['Baseline', 'Midline', 'Endline'],
    datasets: [{
      data: [
        chartData?.assessment_distribution?.baseline || 45,
        chartData?.assessment_distribution?.midline || 28,
        chartData?.assessment_distribution?.endline || 15
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ]
    }]
  };

  // Chart data for school performance comparison
  const schoolComparisonData = {
    labels: chartData?.school_comparison?.labels || ['School A', 'School B', 'School C', 'School D'],
    datasets: [
      {
        label: 'Khmer',
        data: chartData?.school_comparison?.khmer || [75, 82, 68, 91],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Math',
        data: chartData?.school_comparison?.math || [68, 78, 72, 85],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ]
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (name: string, record: any) => (
        <div>
          <strong>{name}</strong>
          {record.is_temporary && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              Temp
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Type',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      render: (type: string) => (
        <Tag color={type === 'baseline' ? 'blue' : type === 'midline' ? 'orange' : 'green'}>
          {type?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject?.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => level ? (
        <Tag color={
          level === 'beginner' ? 'red' :
          level === 'letter' ? 'orange' :
          level === 'word' ? 'gold' :
          level === 'paragraph' ? 'green' : 'blue'
        }>
          {level.toUpperCase()}
        </Tag>
      ) : '-'
    },
    {
      title: 'Date',
      dataIndex: 'assessed_date',
      key: 'assessed_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading mentor dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Special Mentor Notice */}
      <Alert
        message="អ្នកណែនាំ ផ្ទាំងគ្រប់គ្រង"
        description="ចងចាំ៖ សិស្ស និងការវាយតម្លៃដែលអ្នកបង្កើតគឺជាបណ្តោះអាសន្ន ហើយនឹងត្រូវបានលុបបន្ទាប់ពី 48 ម៉ោង លុះត្រាតែត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍។"
        type="info"
        showIcon
        icon={<ExclamationCircleOutlined />}
        style={{ marginBottom: 24 }}
      />

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats?.overview?.total_students || 145}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              {stats?.overview?.temporary_students > 0 && (
                <Tag color="orange" size="small">
                  {stats.overview.temporary_students} temporary
                </Tag>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pilot Schools"
              value={stats?.overview?.total_pilot_schools || 12}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Under Mentorship</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Assessments"
              value={stats?.overview?.total_assessments || 387}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              {stats?.overview?.temporary_assessments > 0 && (
                <Tag color="orange" size="small">
                  {stats.overview.temporary_assessments} temporary
                </Tag>
              )}
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="This Week"
              value={stats?.recent_activity?.assessments_last_7_days || 23}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">New Assessments</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Quick Actions">
            <Space wrap>
              <Button 
                type="primary" 
                onClick={() => router.push('/students/create')}
              >
                Add Student
              </Button>
              <Button 
                onClick={() => router.push('/assessments/create')}
              >
                Create Assessment
              </Button>
              <Button 
                onClick={() => router.push('/mentoring/create')}
              >
                Schedule Visit
              </Button>
              <Button 
                onClick={() => router.push('/students/bulk-import')}
              >
                Bulk Import
              </Button>
              <Button 
                onClick={() => router.push('/reports')}
              >
                View Reports
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Recent Assessments */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Assessments" 
            extra={
              <Button 
                size="small" 
                onClick={() => router.push('/assessments')}
              >
                View All
              </Button>
            }
          >
            <Table
              columns={columns}
              dataSource={recentAssessments}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No recent assessments' }}
            />
          </Card>
        </Col>

        {/* Assessment Distribution */}
        <Col xs={24} lg={8}>
          <Card title="Assessment Distribution">
            <div style={{ height: 250 }}>
              <Doughnut 
                data={assessmentDistributionData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }} 
              />
            </div>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Baseline:</Text>
                <Text strong>{stats?.distributions?.assessments_by_type?.baseline || 45}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Midline:</Text>
                <Text strong>{stats?.distributions?.assessments_by_type?.midline || 28}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Endline:</Text>
                <Text strong>{stats?.distributions?.assessments_by_type?.endline || 15}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* School Performance Comparison */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="School Performance Comparison">
            <div style={{ height: 400 }}>
              <Bar 
                data={schoolComparisonData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top'
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      title: {
                        display: true,
                        text: 'Average Score (%)'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Schools'
                      }
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}