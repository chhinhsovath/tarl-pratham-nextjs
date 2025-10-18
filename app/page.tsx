'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Statistic, Progress } from 'antd';
import {
  TeamOutlined,
  FileDoneOutlined,
  BankOutlined,
  BookOutlined,
  LoginOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';
import AssessmentCycleChart from '@/components/charts/AssessmentCycleChart';
import SubjectComparisonChart from '@/components/charts/SubjectComparisonChart';
import LevelDistributionChart from '@/components/charts/LevelDistributionChart';

const { Title, Paragraph } = require('antd').Typography;

interface WorkspaceStats {
  total_schools: number;
  total_students: number;
  total_teachers: number;
  total_mentors: number;
  total_assessments: number;
  baseline_assessments: number;
  midline_assessments: number;
  endline_assessments: number;
  active_mentoring_visits: number;
  assessments?: {
    by_type?: {
      baseline: number;
      midline: number;
      endline: number;
    };
    by_subject?: {
      language: number;
      math: number;
    };
    by_creator?: {
      mentor: number;
      teacher: number;
    };
    by_level?: Array<{
      level: string;
      khmer: number;
      math: number;
    }>;
    overall_results_khmer?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
    overall_results_math?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
  };
}

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WorkspaceStats>({
    total_students: 0,
    total_schools: 0,
    total_teachers: 0,
    total_mentors: 0,
    total_assessments: 0,
    baseline_assessments: 0,
    midline_assessments: 0,
    endline_assessments: 0,
    active_mentoring_visits: 0,
  });

  // Fetch data from PUBLIC endpoint (no authentication required)
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/public/stats');
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-full overflow-x-hidden" style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header - EXACTLY like coordinator */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              TaRL ប្រាថម
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              Teaching at the Right Level - Assessment Results
            </Paragraph>
          </Col>
          <Col>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                icon={<GlobalOutlined />}
                href="https://plp.moeys.gov.kh"
                target="_blank"
              >
                PLP
              </Button>
              <Button
                type="primary"
                icon={<LoginOutlined />}
                href="/auth/login"
              >
                Login
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <div style={{ fontSize: 18, color: '#666' }}>កំពុងផ្ទុកទិន្នន័យ...</div>
        </div>
      ) : (
        <>
          {/* Stats Overview - 4 Cards (EXACTLY like coordinator) */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Card style={{ backgroundColor: '#eff6ff', borderRadius: 8 }}>
                <Statistic
                  title="និស្សិតសរុប"
                  value={stats.total_students}
                  prefix={<TeamOutlined style={{ fontSize: 24, color: '#2563eb' }} />}
                  valueStyle={{ color: '#1e40af', fontSize: 32 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Card style={{ backgroundColor: '#f0fdf4', borderRadius: 8 }}>
                <Statistic
                  title="ការវាយតម្លៃ"
                  value={stats.total_assessments}
                  prefix={<FileDoneOutlined style={{ fontSize: 24, color: '#16a34a' }} />}
                  valueStyle={{ color: '#15803d', fontSize: 32 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Card style={{ backgroundColor: '#fefce8', borderRadius: 8 }}>
                <Statistic
                  title="សាលារៀន"
                  value={stats.total_schools}
                  prefix={<BankOutlined style={{ fontSize: 24, color: '#ca8a04' }} />}
                  valueStyle={{ color: '#a16207', fontSize: 32 }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={12} lg={6}>
              <Card style={{ backgroundColor: '#faf5ff', borderRadius: 8 }}>
                <Statistic
                  title="ដំណើរទស្សនកិច្ច"
                  value={stats.active_mentoring_visits}
                  prefix={<TeamOutlined style={{ fontSize: 24, color: '#9333ea' }} />}
                  valueStyle={{ color: '#7e22ce', fontSize: 32 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Assessment Details Card (EXACTLY like coordinator) */}
          {stats.total_assessments > 0 && (
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Card title="ព័ត៌មានលម្អិតការវាយតម្លៃ" style={{ marginBottom: 0 }}>
                  <Row gutter={16}>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="ដោយគ្រូព្រឹក្សា"
                        value={stats.assessments?.by_creator?.mentor || 0}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#13c2c2', fontSize: 20 }}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="ដោយគ្រូបង្រៀន"
                        value={stats.assessments?.by_creator?.teacher || 0}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#52c41a', fontSize: 20 }}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="ភាសា"
                        value={stats.assessments?.by_subject?.language || 0}
                        prefix={<BookOutlined />}
                        valueStyle={{ color: '#1890ff', fontSize: 20 }}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="គណិតវិទ្យា"
                        value={stats.assessments?.by_subject?.math || 0}
                        prefix={<BookOutlined />}
                        valueStyle={{ color: '#52c41a', fontSize: 20 }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="តេស្តដើមគ្រា"
                        value={stats.assessments?.by_type?.baseline || 0}
                        valueStyle={{ fontSize: 20 }}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="តេស្តពាក់កណ្ដាលគ្រា"
                        value={stats.assessments?.by_type?.midline || 0}
                        valueStyle={{ fontSize: 20 }}
                      />
                    </Col>
                    <Col xs={12} sm={8} md={6}>
                      <Statistic
                        title="តេស្តចុងក្រោយគ្រា"
                        value={stats.assessments?.by_type?.endline || 0}
                        valueStyle={{ fontSize: 20 }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          )}

          {/* Assessment Results Section with Subject Toggle - EXACTLY like coordinator */}
          {stats.total_assessments > 0 && (stats.assessments?.overall_results_khmer || stats.assessments?.overall_results_math) && (
            <Card title="លទ្ធផលការវាយតម្លៃ" style={{ marginBottom: 24 }}>
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

          {/* Charts Section - 3 columns (EXACTLY like coordinator) */}
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
              {/* Teacher Creator Card with Progress Bars (EXACTLY like coordinator) */}
              <Col xs={24} sm={24} md={24} lg={8}>
                <Card title="ការវាយតម្លៃដោយគ្រូ" style={{ height: '100%' }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="គ្រូព្រឹក្សាគរុកោសល្យ"
                        value={stats.assessments?.by_creator?.mentor || 0}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#13c2c2' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="គ្រូបង្រៀន"
                        value={stats.assessments?.by_creator?.teacher || 0}
                        prefix={<TeamOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 24 }}>
                    <Col span={24}>
                      <Progress
                        percent={stats.total_assessments > 0 ? Math.round(((stats.assessments?.by_creator?.mentor || 0) / stats.total_assessments) * 100) : 0}
                        strokeColor="#13c2c2"
                        format={(percent) => `គ្រូព្រឹក្សា ${percent}%`}
                      />
                      <Progress
                        percent={stats.total_assessments > 0 ? Math.round(((stats.assessments?.by_creator?.teacher || 0) / stats.total_assessments) * 100) : 0}
                        strokeColor="#52c41a"
                        format={(percent) => `គ្រូបង្រៀន ${percent}%`}
                        style={{ marginTop: 16 }}
                      />
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

          {/* No data message */}
          {stats.total_assessments === 0 && (
            <Card style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
              <Title level={4}>មិនមានទិន្នន័យការវាយតម្លៃ</Title>
              <Paragraph style={{ color: '#666' }}>No assessment data available yet</Paragraph>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
