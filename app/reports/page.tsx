'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Statistic, 
  Table,
  Select,
  DatePicker,
  Space,
  Typography,
  Tag,
  Progress
} from 'antd';
import { 
  BarChartOutlined,
  FileTextOutlined,
  DownloadOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function ReportsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check permissions
  if (!hasPermission(user, 'reports.view')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    fetchReportData();
  }, [user]);

  const fetchReportData = async () => {
    if (!user) return;
    
    try {
      const params = new URLSearchParams({
        role: user.role,
        userId: user.id.toString(),
        ...(user.pilot_school_id && { pilotSchoolId: user.pilot_school_id.toString() })
      });

      const response = await fetch(`/api/dashboard/stats?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Report data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      title: 'Student Performance Report',
      description: 'Analyze student progress across assessments',
      icon: <TrophyOutlined />,
      path: '/reports/student-performance',
      color: '#1890ff',
      permission: 'reports.view'
    },
    {
      title: 'School Comparison Report',
      description: 'Compare performance across schools',
      icon: <BarChartOutlined />,
      path: '/reports/school-comparison',
      color: '#52c41a',
      permission: 'reports.view'
    },
    {
      title: 'Assessment Analysis',
      description: 'Detailed assessment data analysis',
      icon: <FileTextOutlined />,
      path: '/reports/assessment-analysis',
      color: '#722ed1',
      permission: 'reports.view'
    },
    {
      title: 'Progress Tracking',
      description: 'Track student learning progression',
      icon: <RiseOutlined />,
      path: '/reports/progress-tracking',
      color: '#fa8c16',
      permission: 'reports.view'
    },
    {
      title: 'Mentoring Impact',
      description: 'Analyze mentoring visit effectiveness',
      icon: <TeamOutlined />,
      path: '/reports/mentoring-impact',
      color: '#13c2c2',
      permission: 'mentoring.view'
    }
  ];

  const quickStats = stats ? [
    {
      title: 'Total Assessments',
      value: stats.overview.total_assessments,
      suffix: 'assessments',
      color: '#1890ff'
    },
    {
      title: 'Students Assessed',
      value: stats.overview.total_students,
      suffix: 'students',
      color: '#52c41a'
    },
    {
      title: 'Assessment Completion',
      value: stats.overview.total_assessments > 0 ? 
        Math.round((stats.distributions.assessments_by_type.baseline || 0) / stats.overview.total_students * 100) : 0,
      suffix: '%',
      color: '#fa8c16'
    },
    {
      title: 'Recent Activity',
      value: stats.recent_activity.assessments_last_7_days,
      suffix: 'this week',
      color: '#722ed1'
    }
  ] : [];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Reports & Analytics</Title>
        <Text type="secondary">
          Generate comprehensive reports and analyze TaRL program data
        </Text>
      </div>

      {/* Quick Statistics */}
      {!loading && stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {quickStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Assessment Distribution */}
      {!loading && stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="Assessment Type Distribution">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Baseline</Text>
                  <Text strong>{stats.distributions.assessments_by_type.baseline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.baseline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#1890ff"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Midline</Text>
                  <Text strong>{stats.distributions.assessments_by_type.midline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.midline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#faad14"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Endline</Text>
                  <Text strong>{stats.distributions.assessments_by_type.endline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.endline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#52c41a"
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="Subject Distribution">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Khmer Language</Text>
                  <Text strong>{stats.distributions.assessments_by_subject.khmer || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_subject.khmer || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#722ed1"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Mathematics</Text>
                  <Text strong>{stats.distributions.assessments_by_subject.math || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_subject.math || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#13c2c2"
                />
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Report Cards */}
      <Row gutter={[16, 16]}>
        {reportCards.map((report, index) => {
          if (!hasPermission(user, report.permission)) {
            return null;
          }
          
          return (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ 
                  fontSize: '24px', 
                  color: report.color, 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {report.icon}
                </div>
                
                <Title level={4} style={{ textAlign: 'center', marginBottom: '8px' }}>
                  {report.title}
                </Title>
                
                <Text type="secondary" style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px',
                  flex: 1
                }}>
                  {report.description}
                </Text>
                
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push(report.path)}
                  style={{ backgroundColor: report.color, borderColor: report.color }}
                >
                  Generate Report
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Role-specific reports */}
      {user?.role === 'teacher' && (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Teacher Reports">
              <Space wrap>
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={() => router.push('/reports/my-students')}
                >
                  My Students Report
                </Button>
                <Button 
                  icon={<BarChartOutlined />}
                  onClick={() => router.push('/reports/class-progress')}
                >
                  Class Progress
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {user?.role === 'mentor' && (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="Mentor Reports">
              <Space wrap>
                <Button 
                  icon={<TeamOutlined />}
                  onClick={() => router.push('/reports/my-mentoring')}
                >
                  My Mentoring Visits
                </Button>
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={() => router.push('/reports/school-visits')}
                >
                  School Visit Reports
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Export Options */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="Export Data">
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              Export comprehensive data for external analysis
            </Text>
            <Space wrap>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // This would trigger a comprehensive export
                  window.open('/api/reports/export?type=comprehensive');
                }}
              >
                Export All Data (Excel)
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // This would trigger assessments export
                  window.open('/api/assessments/export');
                }}
              >
                Export Assessments
              </Button>
              {hasPermission(user, 'mentoring.view') && (
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    // This would trigger mentoring export
                    window.open('/api/mentoring/export');
                  }}
                >
                  Export Mentoring Visits
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}