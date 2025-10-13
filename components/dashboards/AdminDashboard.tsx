'use client';

import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Spin, Typography, Tag } from 'antd';
import {
  TeamOutlined,
  BankOutlined,
  FileDoneOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import AssessmentCycleChart from '@/components/charts/AssessmentCycleChart';
import SubjectComparisonChart from '@/components/charts/SubjectComparisonChart';
import LevelDistributionChart from '@/components/charts/LevelDistributionChart';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';

const { Title, Text } = Typography;

interface AdminStats {
  total_students: number;
  active_students: number;
  total_schools: number;
  total_teachers: number;
  total_mentors: number;
  total_assessments: number;
  total_mentoring_visits: number;
  pending_verifications: number;
  at_risk_students_count: number;
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
  schools?: {
    total: number;
    by_province: Array<{
      province: string;
      schools: number;
    }>;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/admin-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
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

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '0 12px' }}>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              ផ្ទាំងគ្រប់គ្រងប្រព័ន្ធ
            </Title>
            <Text style={{ color: '#666' }}>
              ទិដ្ឋភាពទូទៅនៃប្រព័ន្ធទាំងមូល
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
              title="និស្សិតសរុប"
              value={stats.total_students}
              prefix={<TeamOutlined style={{ fontSize: 24, color: '#2563eb' }} />}
              valueStyle={{ color: '#1e40af', fontSize: 28 }}
            />
            <Tag color="blue" style={{ marginTop: 8 }}>
              សកម្ម: {stats.active_students}
            </Tag>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#f0fdf4', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="ការវាយតម្លៃ"
              value={stats.total_assessments}
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
              value={stats.total_schools}
              prefix={<BankOutlined style={{ fontSize: 24, color: '#ca8a04' }} />}
              valueStyle={{ color: '#a16207', fontSize: 28 }}
            />
            <Button
              type="link"
              size="small"
              onClick={() => router.push('/schools')}
              style={{ padding: 0, marginTop: 8 }}
            >
              គ្រប់គ្រងសាលា →
            </Button>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card style={{ backgroundColor: '#faf5ff', borderRadius: 8 }} bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="គ្រូបង្រៀន"
              value={stats.total_teachers}
              prefix={<UserOutlined style={{ fontSize: 24, color: '#9333ea' }} />}
              valueStyle={{ color: '#7e22ce', fontSize: 28 }}
            />
            <Tag color="purple" style={{ marginTop: 8 }}>
              ព្រឹក្សា: {stats.total_mentors}
            </Tag>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="ដំណើរទស្សនកិច្ច"
              value={stats.total_mentoring_visits}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#13c2c2', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="រងចាំផ្ទៀងផ្ទាត់"
              value={stats.pending_verifications}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.pending_verifications > 0 ? '#faad14' : '#52c41a', fontSize: 24 }}
            />
            {stats.pending_verifications > 0 && (
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
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="សិស្សចាំបាច់ជួយ"
              value={stats.at_risk_students_count}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.at_risk_students_count > 0 ? '#ff4d4f' : '#52c41a', fontSize: 24 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={8} lg={6}>
          <Card bodyStyle={{ padding: '20px' }}>
            <Statistic
              title="អត្រាសកម្ម"
              value={stats.total_students > 0 ? Math.round((stats.active_students / stats.total_students) * 100) : 0}
              suffix="%"
              valueStyle={{ color: '#52c41a', fontSize: 24 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Assessment Results Section with Subject Toggle */}
      {stats.total_assessments > 0 && (stats.assessments?.overall_results_khmer || stats.assessments?.overall_results_math) && (
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
            >
              គណិតវិទ្យា
            </Button>
          </div>

          {/* Overall Results Chart */}
          {selectedSubject === 'khmer' && stats.assessments?.overall_results_khmer && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_khmer}
              title="លទ្ធផលសរុប - ខ្មែរ"
            />
          )}

          {selectedSubject === 'math' && stats.assessments?.overall_results_math && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_math}
              title="លទ្ធផលសរុប - គណិតវិទ្យា"
            />
          )}
        </Card>
      )}

      {/* Charts Section */}
      {stats.total_assessments > 0 && (
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
            <Card title="ស្ថានភាពប្រព័ន្ធ" style={{ height: '100%' }}>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Statistic
                    title="សាលាសកម្ម"
                    value={stats.total_schools}
                    valueStyle={{ color: '#52c41a', fontSize: 24 }}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="គ្រូសរុប"
                    value={stats.total_teachers + stats.total_mentors}
                    valueStyle={{ color: '#1890ff', fontSize: 24 }}
                  />
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={24}>
                  <Tag color="green" style={{ width: '100%', textAlign: 'center', padding: '8px' }}>
                    ប្រព័ន្ធដំណើរការធម្មតា
                  </Tag>
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

      {/* Province Distribution */}
      {stats.schools?.by_province && stats.schools.by_province.length > 0 && (
        <Card title="ការចែកចាយសាលារៀនតាមខេត្ត" style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            {stats.schools.by_province.map((province, index) => (
              <Col xs={12} sm={8} md={6} lg={4} key={index}>
                <Card size="small" bodyStyle={{ textAlign: 'center' }}>
                  <Statistic
                    title={province.province}
                    value={province.schools}
                    valueStyle={{ fontSize: 20, color: '#1890ff' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
}
