'use client';

import { Card, Col, Row, Statistic, Progress, Typography, Tag, Button, Space, Table } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement, RadialLinearScale } from 'chart.js';
import { Bar, Doughnut, Line, Pie, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const { Text } = Typography;

interface AdminDashboardProps {
  userId: string;
}

export default function AdminDashboard({ userId }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any>({});

  useEffect(() => {
    fetchAdminData();
  }, [userId]);

  const fetchAdminData = async () => {
    try {
      const response = await fetch(`/api/dashboard/admin-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
        setChartData(data.charts);
      }
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollmentTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Students',
        data: chartData?.enrollment_trends?.active || [120, 135, 150, 165, 180, 195],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1
      },
      {
        label: 'Dropped Out',
        data: chartData?.enrollment_trends?.dropped || [5, 8, 3, 12, 7, 4],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1
      }
    ]
  };

  const levelDistributionData = {
    labels: ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story'],
    datasets: [
      {
        label: 'Khmer',
        data: chartData?.level_distribution?.khmer || [45, 67, 89, 23, 12],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
      {
        label: 'Math',
        data: chartData?.level_distribution?.math || [38, 52, 71, 34, 18],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      }
    ]
  };

  const assessmentProgressData = {
    labels: ['Baseline', 'Midline', 'Endline'],
    datasets: [{
      label: 'Average Score',
      data: chartData?.assessment_performance || [65, 72, 78],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
    }]
  };

  const attendancePatternsData = {
    labels: ['Present', 'Absent', 'Late', 'Excused'],
    datasets: [{
      data: chartData?.attendance_patterns || [850, 45, 23, 12],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ]
    }]
  };

  const geographicDistributionData = {
    labels: ['Phnom Penh', 'Siem Reap', 'Battambang', 'Kandal', 'Kampong Cham'],
    datasets: [{
      data: chartData?.geographic_distribution || [125, 89, 67, 45, 34],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ]
    }]
  };

  const interventionEffectivenessData = {
    labels: ['Reading Support', 'Math Tutoring', 'Attendance Program', 'Family Engagement'],
    datasets: [{
      label: 'Success Rate (%)',
      data: chartData?.intervention_effectiveness || [85, 78, 92, 73],
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
    }]
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading admin dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Summary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats?.summary_stats?.total_students || 1247}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">{stats?.summary_stats?.active_students || 1198} active</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Attendance"
              value={stats?.summary_stats?.average_attendance || 89.2}
              suffix="%"
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Last 30 days</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Assessments Completed"
              value={stats?.summary_stats?.assessments_completed || 3457}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">This month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="At Risk Students"
              value={stats?.summary_stats?.students_needing_intervention || 47}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Need intervention</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 - Enrollment and TaRL Level Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Enrollment Trends" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              <Line data={enrollmentTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="TaRL Level Distribution" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              <Bar data={levelDistributionData} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 - Assessment, Attendance, Intervention */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="Assessment Progress" extra={<LineChartOutlined />}>
            <div style={{ height: 250 }}>
              <Radar 
                data={assessmentProgressData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Attendance Patterns" extra={<PieChartOutlined />}>
            <div style={{ height: 250 }}>
              <Doughnut 
                data={attendancePatternsData} 
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
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Intervention Effectiveness" extra={<BarChartOutlined />}>
            <div style={{ height: 250 }}>
              <Bar 
                data={interventionEffectivenessData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Geographic Distribution */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="Geographic Distribution">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <div style={{ height: 300 }}>
                  <Pie 
                    data={geographicDistributionData} 
                    options={{ 
                      responsive: true, 
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right'
                        }
                      }
                    }} 
                  />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div>
                  <Text strong style={{ fontSize: 16, marginBottom: 12, display: 'block' }}>
                    Distribution by Province
                  </Text>
                  <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                    {(geographicDistributionData.labels || []).map((province, index) => (
                      <div key={province} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: 4,
                        marginBottom: 8
                      }}>
                        <Text>{province}</Text>
                        <Text strong>{geographicDistributionData.datasets[0].data[index]}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* At-Risk Students Table */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="Students Requiring Attention" 
            extra={
              <Button type="primary">
                Export Report
              </Button>
            }
          >
            <Table
              columns={[
                {
                  title: 'Student',
                  dataIndex: 'student_name',
                  key: 'student_name',
                  render: (name) => <Text strong>{name}</Text>
                },
                {
                  title: 'Grade',
                  dataIndex: 'grade',
                  key: 'grade'
                },
                {
                  title: 'Attendance',
                  dataIndex: 'attendance_rate',
                  key: 'attendance_rate',
                  render: (rate) => (
                    <Text type={rate < 75 ? 'danger' : 'secondary'}>
                      {rate}%
                    </Text>
                  )
                },
                {
                  title: 'Performance',
                  dataIndex: 'academic_performance',
                  key: 'academic_performance',
                  render: (performance) => (
                    <Text type={performance < 50 ? 'danger' : 'secondary'}>
                      {performance}%
                    </Text>
                  )
                },
                {
                  title: 'Risk Factors',
                  dataIndex: 'risk_factors',
                  key: 'risk_factors',
                  render: (factors) => (
                    <Space wrap>
                      {(factors || []).map((factor: string) => (
                        <Tag key={factor} color="red" size="small">
                          {factor.replace('_', ' ')}
                        </Tag>
                      ))}
                    </Space>
                  )
                },
                {
                  title: 'Action',
                  key: 'action',
                  render: () => (
                    <Button type="link" size="small">
                      View Details
                    </Button>
                  )
                }
              ]}
              dataSource={stats?.at_risk_students || [
                {
                  key: '1',
                  student_name: 'Sok Dara',
                  grade: 4,
                  attendance_rate: 68,
                  academic_performance: 42,
                  risk_factors: ['low_attendance', 'poor_performance']
                },
                {
                  key: '2',
                  student_name: 'Chea Sophea',
                  grade: 5,
                  attendance_rate: 72,
                  academic_performance: 38,
                  risk_factors: ['poor_performance', 'language_barrier']
                }
              ]}
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}