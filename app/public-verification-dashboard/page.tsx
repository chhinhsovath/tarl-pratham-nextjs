'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Space,
  Typography,
  Spin,
  Tag,
  Divider
} from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  UserOutlined,
  FileDoneOutlined,
  CloseCircleOutlined,
  BookOutlined,
  CalculatorOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface VerificationStats {
  overall: {
    total_assessments: number;
    verified_assessments: number;
    pending_assessments: number;
    rejected_assessments: number;
    unique_students_verified: number;
    verification_rate: string;
  };
  by_assessment_type: {
    baseline: { total: number; verified: number };
    midline: { total: number; verified: number };
    endline: { total: number; verified: number };
  };
  by_subject: {
    language: { total: number; verified: number };
    math: { total: number; verified: number };
  };
  mentor_stats: Array<{
    mentor_id: number;
    mentor_name: string;
    verifications_count: number;
  }>;
  top_mentors: Array<{
    mentor_id: number;
    mentor_name: string;
    verifications_count: number;
  }>;
  last_updated: string;
}

export default function PublicVerificationDashboard() {
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/verification-stats');
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching verification stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <Text type="danger">មិនអាចទាញយកទិន្នន័យបានទេ</Text>
        </Card>
      </div>
    );
  }

  const mentorColumns = [
    {
      title: 'ចំណាត់ថ្នាក់',
      key: 'rank',
      width: 80,
      render: (_: any, __: any, index: number) => (
        <Space>
          {index === 0 && <TrophyOutlined style={{ color: '#FFD700' }} />}
          {index === 1 && <TrophyOutlined style={{ color: '#C0C0C0' }} />}
          {index === 2 && <TrophyOutlined style={{ color: '#CD7F32' }} />}
          <Text strong>{index + 1}</Text>
        </Space>
      )
    },
    {
      title: 'ឈ្មោះគ្រូណែនាំ',
      dataIndex: 'mentor_name',
      key: 'mentor_name',
      render: (name: string) => (
        <Space>
          <UserOutlined />
          <Text strong>{name}</Text>
        </Space>
      )
    },
    {
      title: 'ចំនួនការផ្ទៀងផ្ទាត់',
      dataIndex: 'verifications_count',
      key: 'verifications_count',
      align: 'center' as const,
      render: (count: number) => (
        <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
          {count.toLocaleString()}
        </Tag>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-2">
            📊 របាយការណ៍ការផ្ទៀងផ្ទាត់ការវាយតម្លៃ
          </Title>
          <Title level={4} type="secondary" className="font-light">
            TaRL Pratham Assessment Verification Dashboard
          </Title>
          <Text type="secondary">
            ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: {new Date(stats.last_updated).toLocaleString('km-KH')}
          </Text>
        </div>

        {/* Overall Statistics */}
        <Card className="mb-6 shadow-lg" title={<Title level={3}>📈 សង្ខេបទូទៅ</Title>}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <Statistic
                  title={<Text strong>សរុបការវាយតម្លៃទាំងអស់</Text>}
                  value={stats.overall.total_assessments}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
                <Statistic
                  title={<Text strong>បានផ្ទៀងផ្ទាត់</Text>}
                  value={stats.overall.verified_assessments}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  suffix={
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      ({stats.overall.verification_rate}%)
                    </Text>
                  }
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
                <Statistic
                  title={<Text strong>រង់ចាំផ្ទៀងផ្ទាត់</Text>}
                  value={stats.overall.pending_assessments}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <Statistic
                  title={<Text strong>សិស្សត្រូវបានផ្ទៀងផ្ទាត់</Text>}
                  value={stats.overall.unique_students_verified}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
                <Statistic
                  title={<Text strong>បានបដិសេធ</Text>}
                  value={stats.overall.rejected_assessments}
                  prefix={<CloseCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-300">
                <Statistic
                  title={<Text strong>អត្រាការផ្ទៀងផ្ទាត់</Text>}
                  value={parseFloat(stats.overall.verification_rate)}
                  suffix="%"
                  valueStyle={{ color: '#13c2c2' }}
                />
                <Progress
                  percent={parseFloat(stats.overall.verification_rate)}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                  }}
                  showInfo={false}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Verification by Assessment Type and Subject */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} lg={12}>
            <Card
              className="shadow-lg h-full"
              title={<Title level={4}>📝 តាមប្រភេទការវាយតម្លៃ</Title>}
            >
              <Space direction="vertical" className="w-full" size="large">
                {Object.entries(stats.by_assessment_type).map(([type, data]) => {
                  const percentage = data.total > 0 ? (data.verified / data.total) * 100 : 0;
                  const typeLabels: Record<string, string> = {
                    baseline: 'មូលដ្ឋាន',
                    midline: 'ពាក់កណ្តាល',
                    endline: 'បញ្ចប់'
                  };

                  return (
                    <div key={type}>
                      <div className="flex justify-between mb-2">
                        <Text strong>{typeLabels[type]}</Text>
                        <Text>
                          {data.verified} / {data.total}
                        </Text>
                      </div>
                      <Progress
                        percent={parseFloat(percentage.toFixed(1))}
                        strokeColor={{
                          '0%': '#108ee9',
                          '100%': '#87d068'
                        }}
                      />
                    </div>
                  );
                })}
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              className="shadow-lg h-full"
              title={<Title level={4}>📚 តាមប្រភេទមុខវិជ្ជា</Title>}
            >
              <Space direction="vertical" className="w-full" size="large">
                {Object.entries(stats.by_subject).map(([subject, data]) => {
                  const percentage = data.total > 0 ? (data.verified / data.total) * 100 : 0;
                  const subjectConfig: Record<string, { label: string; icon: any }> = {
                    language: { label: 'ភាសាខ្មែរ', icon: <BookOutlined /> },
                    math: { label: 'គណិតវិទ្យា', icon: <CalculatorOutlined /> }
                  };

                  return (
                    <div key={subject}>
                      <div className="flex justify-between mb-2">
                        <Space>
                          {subjectConfig[subject].icon}
                          <Text strong>{subjectConfig[subject].label}</Text>
                        </Space>
                        <Text>
                          {data.verified} / {data.total}
                        </Text>
                      </div>
                      <Progress
                        percent={parseFloat(percentage.toFixed(1))}
                        strokeColor={{
                          '0%': subject === 'language' ? '#722ed1' : '#13c2c2',
                          '100%': subject === 'language' ? '#9254de' : '#36cfc9'
                        }}
                      />
                    </div>
                  );
                })}
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Top Mentors Table */}
        <Card
          className="shadow-lg"
          title={
            <Space>
              <TrophyOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              <Title level={3}>🏆 គ្រូណែនាំដែលបានផ្ទៀងផ្ទាត់ច្រើនបំផុត</Title>
            </Space>
          }
        >
          <Table
            columns={mentorColumns}
            dataSource={stats.top_mentors}
            rowKey="mentor_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => `សរុប ${total} នាក់`
            }}
            scroll={{ x: 600 }}
          />
        </Card>

        <Divider />

        {/* All Mentors Stats */}
        {stats.mentor_stats.length > 10 && (
          <Card
            className="shadow-lg mt-6"
            title={<Title level={4}>📋 គ្រូណែនាំទាំងអស់</Title>}
          >
            <Table
              columns={mentorColumns}
              dataSource={stats.mentor_stats}
              rowKey="mentor_id"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showTotal: (total) => `សរុប ${total} នាក់`
              }}
              scroll={{ x: 600 }}
            />
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <Text type="secondary">
            © 2024 TaRL Pratham Cambodia | ប្រព័ន្ធគ្រប់គ្រងការវាយតម្លៃសិស្ស
          </Text>
        </div>
      </div>
    </div>
  );
}
