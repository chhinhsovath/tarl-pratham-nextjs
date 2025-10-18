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
import HorizontalStackedBarChart from '@/components/charts/HorizontalStackedBarChart';

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
  const [selectedCycle, setSelectedCycle] = useState<'baseline' | 'midline' | 'endline'>('baseline');
  const [loading, setLoading] = useState(true);
  const [schoolDataLoading, setSchoolDataLoading] = useState(false);
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
  const [schoolData, setSchoolData] = useState<Array<{
    schoolName: string;
    levels: Record<string, number>;
  }>>([]);

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

  // Fetch school comparison data (ALL subjects combined)
  const fetchSchoolData = async (cycle: string) => {
    setSchoolDataLoading(true);
    try {
      // Fetch ALL subjects (no subject parameter = get both language + math)
      const response = await fetch(`/api/public/results-by-school?cycle=${cycle}`);
      if (!response.ok) throw new Error('Failed to fetch school data');

      const data = await response.json();
      console.log(`[HOMEPAGE] Fetched ${data.schools?.length || 0} schools for ${cycle}`);
      setSchoolData(data.schools || []);
    } catch (error) {
      console.error('Error fetching school data:', error);
      setSchoolData([]);
    } finally {
      setSchoolDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSchoolData(selectedCycle);
  }, []);

  useEffect(() => {
    fetchSchoolData(selectedCycle);
  }, [selectedCycle]);

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

          {/* Charts Section - 2 columns */}
          {stats.total_assessments > 0 && (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={24} md={12}>
                <AssessmentCycleChart
                  data={stats.assessments?.by_type || { baseline: 0, midline: 0, endline: 0 }}
                  title="ការប្រៀបធៀបតាមវដ្តវាយតម្លៃ"
                  type="bar"
                />
              </Col>
              <Col xs={24} sm={24} md={12}>
                <SubjectComparisonChart
                  data={stats.assessments?.by_subject || { language: 0, math: 0 }}
                  title="ការប្រៀបធៀបតាមមុខវិជ្ជា"
                />
              </Col>
            </Row>
          )}

          {/* Level Distribution Charts - Side by Side */}
          {stats.assessments?.by_level && stats.assessments.by_level.length > 0 && (
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              {/* Language Chart - Only show levels with language data */}
              <Col xs={24} sm={24} md={12}>
                <LevelDistributionChart
                  data={stats.assessments.by_level.filter(item => item.khmer > 0)}
                  title="ការចែកចាយសិស្សតាមកម្រិត - ភាសា"
                  showOnlyLanguage={true}
                />
              </Col>
              {/* Math Chart - Only show levels with math data */}
              <Col xs={24} sm={24} md={12}>
                <LevelDistributionChart
                  data={stats.assessments.by_level.filter(item => item.math > 0)}
                  title="ការចែកចាយសិស្សតាមកម្រិត - គណិតវិទ្យា"
                  showOnlyMath={true}
                />
              </Col>
            </Row>
          )}

          {/* School Comparison Chart - Full Width */}
          {!schoolDataLoading && schoolData.length > 0 && (
            <Card title="លទ្ធផលតាមសាលារៀន" style={{ marginBottom: 24 }} id="school-comparison-chart">
              {/* Cycle Toggle Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                <Button
                  type={selectedCycle === 'baseline' ? 'primary' : 'default'}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCycle('baseline');
                  }}
                  style={{
                    backgroundColor: selectedCycle === 'baseline' ? '#3b82f6' : '#e5e7eb',
                    color: selectedCycle === 'baseline' ? 'white' : '#374151',
                    border: 'none',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  តេស្តដើមគ្រា
                </Button>
                <Button
                  type={selectedCycle === 'midline' ? 'primary' : 'default'}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCycle('midline');
                  }}
                  style={{
                    backgroundColor: selectedCycle === 'midline' ? '#3b82f6' : '#e5e7eb',
                    color: selectedCycle === 'midline' ? 'white' : '#374151',
                    border: 'none',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  តេស្តពាក់កណ្ដាលគ្រា
                </Button>
                <Button
                  type={selectedCycle === 'endline' ? 'primary' : 'default'}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCycle('endline');
                  }}
                  style={{
                    backgroundColor: selectedCycle === 'endline' ? '#3b82f6' : '#e5e7eb',
                    color: selectedCycle === 'endline' ? 'white' : '#374151',
                    border: 'none',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  តេស្តចុងក្រោយគ្រា
                </Button>
              </div>

              {/* Horizontal Stacked Bar Chart */}
              <HorizontalStackedBarChart
                data={schoolData}
                title=""
                maxHeight={600}
              />
            </Card>
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
