'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Spin, Typography, Tag, Table, Timeline } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  FileDoneOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import AssessmentCycleChart from '@/components/charts/AssessmentCycleChart';
import SubjectComparisonChart from '@/components/charts/SubjectComparisonChart';
import LevelDistributionChart from '@/components/charts/LevelDistributionChart';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';

const { Title, Text } = Typography;

// Helper function to check if overall results have any level data
function hasLevelData(results: any[] | undefined): boolean {
  if (!results || !Array.isArray(results)) return false;
  return results.some(cycle => {
    if (!cycle.levels || typeof cycle.levels !== 'object') return false;
    return Object.keys(cycle.levels).length > 0;
  });
}

interface MentorStats {
  mentor: {
    id: number;
    name: string;
    email: string;
  };
  assignments: {
    total: number;
    schools: number;
    subjects: string[];
    language_schools: number;
    math_schools: number;
    details: Array<{
      assignment: any;
      stats: {
        student_count: number;
        language_assessments: number;
        math_assessments: number;
        total_assessments: number;
        recent_visits: number;
      };
    }>;
  };
  summary: {
    total_students: number;
    total_assessments: number;
    total_visits: number;
    pending_verifications: number;
  };
  assessments?: {
    total: number;
    by_type: {
      baseline: number;
      midline: number;
      endline: number;
    };
    by_subject: {
      language: number;
      math: number;
    };
    by_level?: Array<{
      level: string;
      khmer: number;
      math: number;
    }>;
    pending_verification: number;
    overall_results_khmer?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
    overall_results_math?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
  };
  recent_activities: Array<any>;
  recent_visits: Array<any>;
}

export default function MentorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [stats, setStats] = useState<MentorStats | null>(null);

  useEffect(() => {
    loadMentorStats();
  }, []);

  const loadMentorStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/mentor');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading mentor stats:', error);
    } finally {
      setLoading(false);
    }
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

  if (!stats) {
    return (
      <Card>
        <Text type="secondary">មិនមានទិន្នន័យ</Text>
      </Card>
    );
  }

  // School assignments table columns
  const schoolColumns = [
    {
      title: 'សាលារៀន',
      dataIndex: ['assignment', 'pilot_school', 'school_name'],
      key: 'school_name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'ខេត្ត',
      dataIndex: ['assignment', 'pilot_school', 'province'],
      key: 'province',
    },
    {
      title: 'សិស្ស',
      dataIndex: ['stats', 'student_count'],
      key: 'students',
      render: (count: number) => <Tag color="blue">{count}</Tag>,
    },
    {
      title: 'ការវាយតម្លៃ',
      dataIndex: ['stats', 'total_assessments'],
      key: 'assessments',
      render: (count: number) => <Tag color="green">{count}</Tag>,
    },
    {
      title: 'ការទស្សនកិច្ច',
      dataIndex: ['stats', 'recent_visits'],
      key: 'visits',
      render: (count: number) => <Tag color="purple">{count}</Tag>,
    },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '0 12px' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              ផ្ទាំងគ្រប់គ្រងគ្រូព្រឹក្សា
            </Title>
            <Text style={{ color: '#666' }}>
              សាលារៀនដែលបានចាត់តាំង: {stats.assignments.schools} សាលា
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<BarChartOutlined />}
              onClick={() => router.push('/reports')}
            >
              របាយការណ៍លម្អិត
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Laravel-Style KPI Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#eff6ff', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="សិស្សសរុប"
              value={stats.summary.total_students}
              prefix={<TeamOutlined style={{ fontSize: 24, color: '#2563eb' }} />}
              valueStyle={{ color: '#1e40af', fontSize: 28 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#f0fdf4', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="ការវាយតម្លៃ"
              value={stats.summary.total_assessments}
              prefix={<FileDoneOutlined style={{ fontSize: 24, color: '#16a34a' }} />}
              valueStyle={{ color: '#15803d', fontSize: 28 }}
            />
            <Button
              type="link"
              size="small"
              onClick={() => router.push('/assessments')}
              style={{ padding: 0, marginTop: 8 }}
            >
              មើលទាំងអស់ →
            </Button>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#fefce8', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="សាលារៀន"
              value={stats.assignments.schools}
              prefix={<BankOutlined style={{ fontSize: 24, color: '#ca8a04' }} />}
              valueStyle={{ color: '#a16207', fontSize: 28 }}
            />
            <div style={{ marginTop: 8 }}>
              <Tag color="blue">ខ្មែរ: {stats.assignments.language_schools}</Tag>
              <Tag color="green">គណិត: {stats.assignments.math_schools}</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#faf5ff', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="ការទស្សនកិច្ច"
              value={stats.summary.total_visits}
              prefix={<EyeOutlined style={{ fontSize: 24, color: '#9333ea' }} />}
              valueStyle={{ color: '#7e22ce', fontSize: 28 }}
            />
            <Button
              type="link"
              size="small"
              onClick={() => router.push('/mentoring-visits')}
              style={{ padding: 0, marginTop: 8 }}
            >
              មើលទាំងអស់ →
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="រងចាំផ្ទៀងផ្ទាត់"
              value={stats.summary.pending_verifications}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.summary.pending_verifications > 0 ? '#faad14' : '#52c41a', fontSize: 24 }}
            />
            {stats.summary.pending_verifications > 0 && (
              <Button
                type="link"
                size="small"
                onClick={() => router.push('/assessments/verify')}
                style={{ padding: 0, marginTop: 8 }}
              >
                ពិនិត្យឥឡូវ →
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      {/* Assessment Results Section with Subject Toggle */}
      {stats.summary.total_assessments > 0 && (hasLevelData(stats.assessments?.overall_results_khmer) || hasLevelData(stats.assessments?.overall_results_math)) && (
        <Card title="លទ្ធផលការវាយតម្លៃសរុប" style={{ marginBottom: 24 }}>
          {/* Subject Toggle Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            <Button
              type={selectedSubject === 'khmer' ? 'primary' : 'default'}
              onClick={() => setSelectedSubject('khmer')}
              style={{
                backgroundColor: selectedSubject === 'khmer' ? '#3b82f6' : '#e5e7eb',
                color: selectedSubject === 'khmer' ? 'white' : '#374151',
                border: 'none',
                transition: 'all 0.2s'
              }}
              disabled={!hasLevelData(stats.assessments?.overall_results_khmer)}
            >
              ខ្មែរ
            </Button>
            <Button
              type={selectedSubject === 'math' ? 'primary' : 'default'}
              onClick={() => setSelectedSubject('math')}
              style={{
                backgroundColor: selectedSubject === 'math' ? '#3b82f6' : '#e5e7eb',
                color: selectedSubject === 'math' ? 'white' : '#374151',
                border: 'none',
                transition: 'all 0.2s'
              }}
              disabled={!hasLevelData(stats.assessments?.overall_results_math)}
            >
              គណិតវិទ្យា
            </Button>
          </div>

          {/* Overall Results Chart */}
          {selectedSubject === 'khmer' && hasLevelData(stats.assessments?.overall_results_khmer) && stats.assessments?.overall_results_khmer && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_khmer}
              title="លទ្ធផលសរុប - ខ្មែរ"
            />
          )}

          {selectedSubject === 'khmer' && !hasLevelData(stats.assessments?.overall_results_khmer) && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              <Text>មិនមានទិន្នន័យកម្រិតសម្រាប់ខ្មែរ</Text>
            </div>
          )}

          {selectedSubject === 'math' && hasLevelData(stats.assessments?.overall_results_math) && stats.assessments?.overall_results_math && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_math}
              title="លទ្ធផលសរុប - គណិតវិទ្យា"
            />
          )}

          {selectedSubject === 'math' && !hasLevelData(stats.assessments?.overall_results_math) && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
              <Text>មិនមានទិន្នន័យកម្រិតសម្រាប់គណិតវិទ្យា</Text>
            </div>
          )}
        </Card>
      )}

      {/* Charts Section */}
      {stats.summary.total_assessments > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} md={12} lg={8}>
            <AssessmentCycleChart
              data={stats.assessments?.by_type || { baseline: 0, midline: 0, endline: 0 }}
              title="ការប្រៀបធៀបតាមវដ្តវាយតម្លៃ"
              type="bar"
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={8}>
            <SubjectComparisonChart
              data={stats.assessments?.by_subject || { language: 0, math: 0 }}
              title="ការប្រៀបធៀបតាមមុខវិជ្ជា"
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card title="សង្ខេបការងារ" style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="ការងារសរុប"
                    value={stats.assignments.total}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="សាលាសកម្ម"
                    value={stats.assignments.schools}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>មុខវិជ្ជា:</Text>
                  </div>
                  {stats.assignments.subjects.map((subject, idx) => (
                    <Tag key={idx} color={subject === 'Language' ? 'blue' : 'green'}>
                      {subject === 'Language' ? 'ខ្មែរ' : 'គណិតវិទ្យា'}
                    </Tag>
                  ))}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}

      {/* Level Distribution Chart - Full Width */}
      {stats.assessments?.by_level && stats.assessments.by_level.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <LevelDistributionChart
              data={stats.assessments.by_level}
              title="ការចែកចាយសិស្សតាមកម្រិតវាយតម្លៃ"
            />
          </Col>
        </Row>
      )}

      {/* School Assignments Table */}
      {stats.assignments.details && stats.assignments.details.length > 0 && (
        <Card title="សាលារៀនដែលបានចាត់តាំង" style={{ marginBottom: 24 }}>
          <Table
            columns={schoolColumns}
            dataSource={stats.assignments.details}
            rowKey={(record) => record.assignment.id}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      {/* Recent Activities and Visits */}
      <Row gutter={[16, 16]}>
        {/* Recent Activities */}
        {stats.recent_activities && stats.recent_activities.length > 0 && (
          <Col xs={24} md={12}>
            <Card title="សកម្មភាពថ្មីៗ" style={{ height: '100%' }}>
              <Timeline>
                {stats.recent_activities.slice(0, 5).map((activity, idx) => (
                  <Timeline.Item
                    key={idx}
                    dot={<CheckCircleOutlined style={{ fontSize: '16px' }} />}
                    color="green"
                  >
                    <Text strong>{activity.description}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.school} • {activity.user}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        )}

        {/* Recent Visits */}
        {stats.recent_visits && stats.recent_visits.length > 0 && (
          <Col xs={24} md={12}>
            <Card title="ការទស្សនកិច្ចថ្មីៗ" style={{ height: '100%' }}>
              <Timeline>
                {stats.recent_visits.slice(0, 5).map((visit, idx) => (
                  <Timeline.Item
                    key={idx}
                    dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}
                    color="blue"
                  >
                    <Text strong>{visit.pilot_school?.school_name}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {new Date(visit.visit_date).toLocaleDateString('km-KH')}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
