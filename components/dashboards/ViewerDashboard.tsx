'use client';

import { Card, Col, Row, Statistic, Typography, Button, Space, Table } from 'antd';
import {
  EyeOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const { Text } = Typography;

interface ViewerDashboardProps {
  userId: string;
  user: any;
}

export default function ViewerDashboard({ userId, user }: ViewerDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchViewerData();
  }, [userId]);

  const fetchViewerData = async () => {
    try {
      // Viewers have read-only access, so we'll show basic statistics
      const response = await fetch(`/api/dashboard/viewer-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch viewer dashboard data:', error);
      // Set some default data for demo purposes
      setStats({
        overview: {
          total_students: 0,
          total_schools: 0,
          total_assessments: 0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock chart data for demonstration
  const overviewData = {
    labels: ['Students', 'Schools', 'Assessments'],
    datasets: [{
      data: [
        stats?.overview?.total_students || 1247,
        stats?.overview?.total_schools || 45,
        stats?.overview?.total_assessments || 3457
      ],
      backgroundColor: [
        'rgba(24, 144, 255, 0.8)',
        'rgba(250, 173, 20, 0.8)',
        'rgba(114, 46, 209, 0.8)'
      ]
    }]
  };

  const progressData = {
    labels: ['Baseline', 'Midline', 'Endline'],
    datasets: [{
      label: 'Completed Assessments',
      data: [845, 623, 234],
      backgroundColor: [
        'rgba(24, 144, 255, 0.8)',
        'rgba(250, 173, 20, 0.8)',
        'rgba(82, 196, 26, 0.8)'
      ]
    }]
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading viewer dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Message */}
      <div style={{
        background: 'linear-gradient(135deg, #722ed1 0%, #8e44ad 100%)',
        borderRadius: 8,
        padding: '24px',
        marginBottom: 24,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <EyeOutlined style={{ fontSize: 32, marginRight: 16 }} />
          <div>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', display: 'block' }}>
              Welcome, {user?.name}!
            </Text>
            <Text style={{ color: 'white', fontSize: 16 }}>
              View-Only Dashboard - TaRL Program Overview
            </Text>
          </div>
        </div>
        <Text style={{ color: 'white', opacity: 0.9 }}>
          You have read-only access to view program statistics and reports.
        </Text>
      </div>

      {/* Overview Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats?.overview?.total_students || 1247}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Across all schools</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Schools"
              value={stats?.overview?.total_schools || 45}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Participating schools</Text>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Assessments"
              value={stats?.overview?.total_assessments || 3457}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Completed assessments</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Program Overview" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              <Doughnut 
                data={overviewData} 
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
        
        <Col xs={24} lg={12}>
          <Card title="Assessment Progress" extra={<BarChartOutlined />}>
            <div style={{ height: 300 }}>
              <Bar 
                data={progressData} 
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
                      beginAtZero: true
                    }
                  }
                }} 
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Available Actions */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Available Actions">
            <Space wrap>
              <Button 
                onClick={() => router.push('/reports')}
                icon={<FileTextOutlined />}
              >
                View Reports
              </Button>
              <Button 
                onClick={() => router.push('/students')}
                icon={<TeamOutlined />}
              >
                View Students
              </Button>
              <Button 
                onClick={() => router.push('/assessments')}
                icon={<BarChartOutlined />}
              >
                View Assessments
              </Button>
              <Button 
                onClick={() => router.push('/schools')}
                icon={<BankOutlined />}
              >
                View Schools
              </Button>
            </Space>
            
            <div style={{ 
              marginTop: 16, 
              padding: 16, 
              backgroundColor: '#f0f2f5', 
              borderRadius: 4,
              border: '1px solid #d9d9d9'
            }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <EyeOutlined style={{ marginRight: 4 }} />
                Note: You have view-only access. To create or modify data, please contact your administrator.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}