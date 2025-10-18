'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';
import {
  HomeIcon,
  ArrowRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total_students: 0,
    total_schools: 0,
    total_assessments: 0,
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
      const response = await fetch('/api/coordinator/stats');
      if (!response.ok) throw new Error('Failed to fetch data');

      const data = await response.json();

      setStatistics({
        total_students: data.total_students || 0,
        total_schools: data.total_schools || 0,
        total_assessments: data.total_assessments || 0,
        baseline_assessments: data.baseline_assessments || 0,
        midline_assessments: data.midline_assessments || 0,
        endline_assessments: data.endline_assessments || 0,
      });

      // Chart data is nested under assessments
      setChartData({
        overall_results_khmer: data.assessments?.overall_results_khmer || data.overall_results_khmer || [],
        overall_results_math: data.assessments?.overall_results_math || data.overall_results_math || [],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData({
        overall_results_khmer: [],
        overall_results_math: [],
      });
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

        {/* Menu Items - Only 2 items */}
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
              <span className="font-semibold text-gray-900">{statistics.total_students}</span>
            </div>
            <div className="flex justify-between">
              <span>សាលារៀន:</span>
              <span className="font-semibold text-gray-900">{statistics.total_schools}</span>
            </div>
            <div className="flex justify-between">
              <span>ការវាយតម្លៃ:</span>
              <span className="font-semibold text-gray-900">{statistics.total_assessments}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area - All Charts */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              លទ្ធផលការវាយតម្លៃសិស្ស
            </h2>
            <p className="text-gray-600">
              Assessment Results - Comprehensive student performance data across all test cycles
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                <p className="mt-4 text-lg font-medium text-gray-700">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Baseline Assessments</div>
                  <div className="text-3xl font-bold text-blue-600">{statistics.baseline_assessments}</div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Midline Assessments</div>
                  <div className="text-3xl font-bold text-yellow-600">{statistics.midline_assessments}</div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="text-sm text-gray-600 mb-1">Endline Assessments</div>
                  <div className="text-3xl font-bold text-green-600">{statistics.endline_assessments}</div>
                </div>
              </div>

              {/* Subject Toggle and Charts */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Subject Selector Header */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Student Performance by Learning Level
                      </h3>
                      <p className="text-sm text-gray-600">
                        Select subject to view detailed progression across baseline, midline, and endline
                      </p>
                    </div>

                    {/* Subject Toggle Buttons */}
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
                        📚 Language
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
                        🔢 Math
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="p-6 bg-white">
                  {selectedSubject === 'khmer' && chartData?.overall_results_khmer && chartData.overall_results_khmer.length > 0 && (
                    <StackedPercentageBarChart
                      data={chartData.overall_results_khmer}
                      title="Language Assessment Results - ខ្មែរ"
                    />
                  )}

                  {selectedSubject === 'math' && chartData?.overall_results_math && chartData.overall_results_math.length > 0 && (
                    <StackedPercentageBarChart
                      data={chartData.overall_results_math}
                      title="Math Assessment Results - គណិតវិទ្យា"
                    />
                  )}

                  {chartData && (
                    selectedSubject === 'khmer'
                      ? (!chartData.overall_results_khmer || chartData.overall_results_khmer.length === 0)
                      : (!chartData.overall_results_math || chartData.overall_results_math.length === 0)
                  ) && (
                    <div className="text-center py-20">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No data available for {selectedSubject === 'khmer' ? 'Language' : 'Math'}</p>
                      <p className="text-gray-400 text-sm mt-2">Please refresh stats cache from coordinator dashboard</p>
                    </div>
                  )}
                </div>
              </div>

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
