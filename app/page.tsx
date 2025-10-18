'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Card, Row, Col, Statistic } from 'antd';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  EyeIcon,
  ArrowRightIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_students: 0,
    total_schools: 0,
    total_assessments: 0,
    total_mentoring_visits: 0,
    baseline_assessments: 0,
    midline_assessments: 0,
    endline_assessments: 0,
  });
  const [chartData, setChartData] = useState<{
    overall_results_khmer: Array<{ cycle: string; levels: Record<string, number> }>;
    overall_results_math: Array<{ cycle: string; levels: Record<string, number> }>;
  } | null>(null);

  // Fetch comprehensive assessment data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch from coordinator stats API (public data)
      const response = await fetch('/api/coordinator/stats');
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      // Update statistics
      setStatistics({
        total_students: data.total_students || 0,
        total_schools: data.total_schools || 0,
        total_assessments: data.total_assessments || 0,
        total_mentoring_visits: 0, // Not in coordinator stats
        baseline_assessments: data.baseline_assessments || 0,
        midline_assessments: data.midline_assessments || 0,
        endline_assessments: data.endline_assessments || 0,
      });

      // Update chart data
      setChartData({
        overall_results_khmer: data.overall_results_khmer || [],
        overall_results_math: data.overall_results_math || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty data if error
      setChartData({
        overall_results_khmer: [],
        overall_results_math: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchData();
  }, []);

  const stats = [
    {
      name: 'សិស្សសរុប',
      value: statistics.total_students.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Total Students Assessed'
    },
    {
      name: 'សាលារៀន',
      value: statistics.total_schools.toLocaleString(),
      icon: HomeIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Pilot Schools'
    },
    {
      name: 'ការវាយតម្លៃ',
      value: statistics.total_assessments.toLocaleString(),
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Total Assessments'
    },
    {
      name: 'ការវាយតម្លៃចុងក្រោយ',
      value: statistics.endline_assessments.toLocaleString(),
      icon: TrophyIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Endline Assessments'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TaRL ប្រាថម</h1>
                  <p className="text-xs text-gray-500">Teaching at the Right Level</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#overview" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ទិដ្ឋភាពរួម
              </a>
              <a href="#results" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                លទ្ធផល
              </a>
              <a href="#impact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ផលប៉ះពាល់
              </a>
              <a
                href="https://plp.moeys.gov.kh"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                PLP
              </a>
            </nav>

            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
              >
                ចូលប្រព័ន្ធ
                <ArrowRightIcon className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Impact Message */}
      <section className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full mb-6">
              <TrophyIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Transforming Education in Cambodia</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ប្រព័ន្ធការបង្រៀនស្របតាមសមត្ថភាព
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Teaching at the Right Level - Data-driven assessment and monitoring system empowering educators to reach every student at their learning level
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="#results"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                View Results
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </a>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="overview" className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Program Impact at a Glance</h2>
            <p className="text-lg text-gray-600">
              Real-time data from our Teaching at the Right Level implementation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all transform hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-xs text-gray-500 mb-2">{stat.description}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Assessment Results Section */}
      <section id="results" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Assessment Results by Learning Level</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive student performance data showing progression across baseline, midline, and endline assessments
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">Loading comprehensive data...</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Subject Toggle */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Student Performance Analysis
                    </h3>
                    <p className="text-sm text-gray-600">
                      Select subject to view detailed assessment results across all test cycles
                    </p>
                  </div>

                  {/* Subject Selector */}
                  <div style={{
                    display: 'flex',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '12px',
                    padding: '4px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <Button
                      type={selectedSubject === 'khmer' ? 'primary' : 'text'}
                      size="large"
                      icon={<BookOpenIcon className="w-5 h-5" />}
                      onClick={() => setSelectedSubject('khmer')}
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '600',
                        backgroundColor: selectedSubject === 'khmer' ? '#3b82f6' : 'transparent',
                        color: selectedSubject === 'khmer' ? '#fff' : '#666',
                        boxShadow: selectedSubject === 'khmer' ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      📚 Language / ខ្មែរ
                    </Button>
                    <Button
                      type={selectedSubject === 'math' ? 'primary' : 'text'}
                      size="large"
                      icon={<AcademicCapIcon className="w-5 h-5" />}
                      onClick={() => setSelectedSubject('math')}
                      style={{
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: '600',
                        backgroundColor: selectedSubject === 'math' ? '#10b981' : 'transparent',
                        color: selectedSubject === 'math' ? '#fff' : '#666',
                        boxShadow: selectedSubject === 'math' ? '0 2px 4px rgba(16, 185, 129, 0.3)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      🔢 Math / គណិតវិទ្យា
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comprehensive Chart */}
              <div className="p-6">
                {selectedSubject === 'khmer' && chartData?.overall_results_khmer && chartData.overall_results_khmer.length > 0 && (
                  <StackedPercentageBarChart
                    data={chartData.overall_results_khmer}
                    title="Language Assessment Results - Progression Across Test Cycles"
                  />
                )}

                {selectedSubject === 'math' && chartData?.overall_results_math && chartData.overall_results_math.length > 0 && (
                  <StackedPercentageBarChart
                    data={chartData.overall_results_math}
                    title="Math Assessment Results - Progression Across Test Cycles"
                  />
                )}

                {chartData && (
                  selectedSubject === 'khmer'
                    ? (!chartData.overall_results_khmer || chartData.overall_results_khmer.length === 0)
                    : (!chartData.overall_results_math || chartData.overall_results_math.length === 0)
                ) && (
                  <div className="text-center py-12">
                    <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No assessment data available for {selectedSubject === 'khmer' ? 'Language' : 'Math'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Color Legend Explanation for Donors */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrophyIcon className="w-5 h-5 mr-2 text-blue-600" />
              Understanding the Results
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              Our consistent color-coding system helps you quickly understand student proficiency levels across both Language and Math:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC2626' }}></div>
                <span className="text-xs font-medium">Level 1: Beginner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F97316' }}></div>
                <span className="text-xs font-medium">Level 2: Letter/1-Digit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EAB308' }}></div>
                <span className="text-xs font-medium">Level 3: Word/2-Digit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84CC16' }}></div>
                <span className="text-xs font-medium">Level 4: Paragraph/Subtraction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }}></div>
                <span className="text-xs font-medium">Level 5: Story/Division</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">
              The same colors represent equivalent proficiency levels across subjects, making it easy to compare student progress in Language and Math.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Impact</h2>
            <p className="text-lg text-gray-600">
              Transforming education through data-driven instruction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <Statistic
                title={<span className="text-lg font-semibold">Assessment Coverage</span>}
                value={statistics.total_assessments > 0
                  ? Math.round((statistics.total_assessments / (statistics.total_students * 3)) * 100)
                  : 0}
                suffix="%"
                valueStyle={{ color: '#3b82f6', fontSize: '3rem', fontWeight: 'bold' }}
              />
              <p className="text-sm text-gray-600 mt-2">
                of students assessed across all cycles
              </p>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <Statistic
                title={<span className="text-lg font-semibold">Program Reach</span>}
                value={statistics.total_schools}
                valueStyle={{ color: '#10b981', fontSize: '3rem', fontWeight: 'bold' }}
              />
              <p className="text-sm text-gray-600 mt-2">
                pilot schools participating in TaRL program
              </p>
            </Card>

            <Card className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <Statistic
                title={<span className="text-lg font-semibold">Student Reach</span>}
                value={statistics.total_students}
                valueStyle={{ color: '#f59e0b', fontSize: '3rem', fontWeight: 'bold' }}
              />
              <p className="text-sm text-gray-600 mt-2">
                students benefiting from targeted instruction
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">TaRL ប្រាថម</h3>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Teaching at the Right Level - Empowering educators with data-driven insights to reach every student at their learning level.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a></li>
                <li><a href="#results" className="hover:text-blue-600 transition-colors">Assessment Results</a></li>
                <li><a href="#impact" className="hover:text-blue-600 transition-colors">Our Impact</a></li>
                <li><Link href="/auth/login" className="hover:text-blue-600 transition-colors">Login to System</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Partners</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <a
                    href="https://plp.moeys.gov.kh"
                    className="hover:text-blue-600 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PLP Cambodia
                  </a>
                </li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Ministry of Education</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pratham Education Foundation</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2024-2025 TaRL Pratham Cambodia. All rights reserved.</p>
            <p className="mt-2 text-xs">Transforming education through Teaching at the Right Level methodology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
