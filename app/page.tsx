'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Row, Col, Statistic, Progress } from 'antd';
import {
  TeamOutlined,
  FileDoneOutlined,
  BankOutlined,
  BookOutlined,
} from '@ant-design/icons';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';
import AssessmentCycleChart from '@/components/charts/AssessmentCycleChart';
import SubjectComparisonChart from '@/components/charts/SubjectComparisonChart';
import LevelDistributionChart from '@/components/charts/LevelDistributionChart';
import {
  HomeIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Simple Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo and Title */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <HomeIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TaRL ប្រាថម</h1>
          </div>
          <p className="text-sm text-gray-500 ml-13">Teaching at the Right Level</p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <a
              href="https://plp.moeys.gov.kh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              <span>PLP</span>
            </a>
            <Link
              href="/auth/login"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors font-medium"
            >
              <span>ចូលប្រព័ន្ធ</span>
              <ArrowRightIcon className="ml-auto w-4 h-4" />
            </Link>
          </div>
        </nav>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>សិស្ស:</span>
              <span className="font-semibold text-gray-900">{stats.total_students}</span>
            </div>
            <div className="flex justify-between">
              <span>សាលារៀន:</span>
              <span className="font-semibold text-gray-900">{stats.total_schools}</span>
            </div>
            <div className="flex justify-between">
              <span>ការវាយតម្លៃ:</span>
              <span className="font-semibold text-gray-900">{stats.total_assessments}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-full p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              លទ្ធផលការវាយតម្លៃសិស្ស
            </h2>
            <p className="text-gray-600">
              Assessment Results - Student performance across all test cycles
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">កំពុងផ្ទុកទិន្នន័យ...</p>
              </div>
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
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">មិនមានទិន្នន័យការវាយតម្លៃ</p>
                  <p className="text-gray-400 text-sm mt-2">No assessment data available yet</p>
                  <p className="text-gray-400 text-xs mt-4">Please login as coordinator and refresh stats cache</p>
                </div>
              )}

              {/* Color Legend */}
              <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 Understanding the Color System
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  Consistent colors across Language and Math show equivalent proficiency levels:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#DC2626' }}></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Level 1</div>
                      <div className="text-xs text-gray-600">Beginner</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#F97316' }}></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Level 2</div>
                      <div className="text-xs text-gray-600">Letter/1-Digit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#EAB308' }}></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Level 3</div>
                      <div className="text-xs text-gray-600">Word/2-Digit</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#84CC16' }}></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Level 4</div>
                      <div className="text-xs text-gray-600">Paragraph/Subtraction</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                    <div>
                      <div className="text-xs font-semibold text-gray-900">Level 5</div>
                      <div className="text-xs text-gray-600">Story/Division</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
