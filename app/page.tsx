'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  EyeIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartDataLabels
);

export default function Home() {
  const [subject, setSubject] = useState<'khmer' | 'math'>('khmer');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [cycleData, setCycleData] = useState({
    baseline: '—',
    midline: '—',
    endline: '—',
    total: 0
  });

  // Fetch assessment data
  const fetchAssessmentData = async (selectedSubject: 'khmer' | 'math') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/public/assessment-data?subject=${selectedSubject}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Update chart data with enhanced styling
      if (data.chartData) {
        setChartData({
          ...data.chartData,
          datasets: data.chartData.datasets.map((dataset: any) => ({
            ...dataset,
            backgroundColor: selectedSubject === 'khmer' 
              ? 'rgba(59, 130, 246, 0.8)' 
              : 'rgba(16, 185, 129, 0.8)',
            borderColor: selectedSubject === 'khmer' 
              ? 'rgb(59, 130, 246)' 
              : 'rgb(16, 185, 129)',
            borderWidth: 2,
            borderRadius: 4,
          }))
        });
      }
      
      // Update cycle data
      setCycleData({
        baseline: data.cycleData.baseline || '—',
        midline: data.cycleData.midline || '—',
        endline: data.cycleData.endline || '—',
        total: data.cycleData.total || 0
      });
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      // Set default data if error
      const defaultLevels = selectedSubject === 'khmer' 
        ? ['ចាប់ផ្តើម', 'អក្សរ', 'ពាក្យ', 'កថាខណ្ឌ', 'រឿង', 'យល់ដឹង ១', 'យល់ដឹង ២']
        : ['ចាប់ផ្តើម', 'លេខ១ខ្ទង់', 'លេខ២ខ្ទង់', 'ដក', 'ចែក', 'ល្បាយពាក្យ'];
      
      setChartData({
        labels: defaultLevels,
        datasets: [{
          label: 'សិស្ស',
          data: new Array(defaultLevels.length).fill(0),
          backgroundColor: selectedSubject === 'khmer' 
            ? 'rgba(59, 130, 246, 0.8)' 
            : 'rgba(16, 185, 129, 0.8)',
          borderColor: selectedSubject === 'khmer' 
            ? 'rgb(59, 130, 246)' 
            : 'rgb(16, 185, 129)',
          borderWidth: 2,
          borderRadius: 4,
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAssessmentData(subject);
  }, [subject]);

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: subject === 'khmer' ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
        borderWidth: 1,
        cornerRadius: 8,
      },
      datalabels: {
        display: function(context: any) {
          return context.dataset.data[context.dataIndex] > 0;
        },
        color: 'black',
        font: {
          weight: 'bold' as const,
          size: 12
        },
        formatter: function(value: any) {
          return value;
        },
        anchor: 'end' as const,
        align: 'right' as const
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#374151',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };

  // Mock data for additional charts
  const progressData = {
    labels: ['ដើមគ្រា', 'ពាក់កណ្តាលគ្រា', 'ចុងគ្រា'],
    datasets: [{
      label: 'ចំនួនសិស្ស',
      data: [cycleData.baseline !== '—' ? parseInt(cycleData.baseline) : 0, 
             cycleData.midline !== '—' ? parseInt(cycleData.midline) : 0, 
             cycleData.endline !== '—' ? parseInt(cycleData.endline) : 0],
      borderColor: subject === 'khmer' ? 'rgb(59, 130, 246)' : 'rgb(16, 185, 129)',
      backgroundColor: subject === 'khmer' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    }]
  };

  const performanceData = {
    labels: ['ខ្មែរ', 'គណិតវិទ្យា'],
    datasets: [{
      data: [65, 45],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)',
      ],
      borderWidth: 2,
    }]
  };

  const stats = [
    {
      name: 'សរុបសិស្ស',
      value: cycleData.total.toLocaleString(),
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'ការវាយតម្លៃ',
      value: '3',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'មុខវិជ្ជា',
      value: '2',
      icon: BookOpenIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'កម្រិត',
      value: subject === 'khmer' ? '7' : '6',
      icon: AcademicCapIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-white" data-chartjs-loaded="true">
      {/* Clean Header */}
      <header className="bg-white shadow-sm border-b">
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
              <a href="#assessments" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                ការវាយតម្លៃ
              </a>
              <a href="#progress" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                វឌ្ឍនភាព
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                ចូលប្រព័ន្ធ
                <ArrowRightIcon className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Clean Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ប្រព័ន្ធការបង្រៀនស្របតាមសមត្ថភាព
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Teaching at the Right Level - ប្រព័ន្ធវាយតម្លៃ និងការតាមដានទំនើបសម្រាប់កម្មវិធី TaRL នៅកម្ពុជា
            </p>
            
          </div>
        </div>
      </section>

      {/* Clean Stats Section */}
      <section id="overview" className="py-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">ទិដ្ឋភាពរួមនៃប្រព័ន្ធ</h2>
            <p className="text-sm text-gray-600">
              សង្ខេបនៃទិន្នន័យសំខាន់ៗ និងការវាយតម្លៃក្នុងប្រព័ន្ធ TaRL
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow-sm p-3 border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-600 truncate">{stat.name}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Dashboard Section */}
      <section id="assessments" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">លទ្ធផលការវាយតម្លៃតាមកម្រិត</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              ការបង្ហាញទិន្នន័យអន្តរកម្មសម្រាប់ការវាយតម្លៃសិស្សតាមកម្រិតសមត្ថភាព
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    ការវិភាគទិន្នន័យសិស្ស
                  </h3>
                  <p className="text-sm text-gray-600">ជ្រើសរើសមុខវិជ្ជាដើម្បីមើលលទ្ធផលការវាយតម្លៃ</p>
                </div>

                {/* Beautiful Ant Design Subject Selector */}
                <div className="flex gap-2">
                  <Button
                    type={subject === 'khmer' ? 'primary' : 'default'}
                    size="middle"
                    icon={<BookOpenIcon className="w-4 h-4" />}
                    onClick={() => setSubject('khmer')}
                    className="font-khmer-bold flex items-center h-10 px-5"
                    style={subject === 'khmer' ? { backgroundColor: '#1677ff', borderColor: '#1677ff' } : {}}
                  >
                    ខ្មែរ
                  </Button>
                  <Button
                    type={subject === 'math' ? 'primary' : 'default'}
                    size="middle"
                    icon={<AcademicCapIcon className="w-4 h-4" />}
                    onClick={() => setSubject('math')}
                    className="font-khmer-bold flex items-center h-10 px-5"
                    style={subject === 'math' ? { backgroundColor: '#52c41a', borderColor: '#52c41a' } : {}}
                  >
                    គណិតវិទ្យា
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Enhanced Chart Container */}
            <div className="p-5">
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-4" style={{ height: '450px' }}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 z-10 rounded-2xl backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                      <p className="mt-4 text-lg font-medium text-gray-700">កំពុងផ្ទុកទិន្នន័យ...</p>
                      <p className="text-sm text-gray-500">សូមរង់ចាំ</p>
                    </div>
                  </div>
                )}
                {chartData && (
                  <Bar 
                    data={chartData} 
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        tooltip: {
                          ...chartOptions.plugins.tooltip,
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 13 },
                          padding: 12,
                          cornerRadius: 12,
                        }
                      }
                    }}
                    plugins={[ChartDataLabels as any]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress and Performance Charts */}
      <section id="progress" className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Progress Chart */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">វឌ្ឍនភាពតាមរយៈកាល</h3>
              </div>
              <div className="p-6">
                <div style={{ height: '300px' }}>
                  <Line 
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
                          beginAtZero: true,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">ការធ្វើតេស្តតាមមុខវិជ្ជា</h3>
              </div>
              <div className="p-6">
                <div style={{ height: '300px' }}>
                  <Doughnut 
                    data={performanceData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            padding: 20,
                            usePointStyle: true,
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Cycles Table */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">សរុបការវាយតម្លៃតាមវដ្ត</h3>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ប្រភេទ
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ដើមគ្រា
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ពាក់កណ្តាលគ្រា
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ចុងគ្រា
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        សិស្សបានធ្វើតេស្ត
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {cycleData.baseline}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {cycleData.midline}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {cycleData.endline}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  សរុបសិស្សបានវាយតម្លៃ: 
                  <span className="font-semibold text-gray-900 ml-2">{cycleData.total.toLocaleString()}</span> នាក់
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">TaRL ប្រាថម</h3>
              <p className="text-gray-600">
                ប្រព័ន្ធការបង្រៀនស្របតាមសមត្ថភាពសម្រាប់ការអភិវឌ្ឍការអប់រំនៅកម្ពុជា
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">តំណភ្ជាប់</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">អំពីយើង</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">ការវាយតម្លៃ</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">ទំនាក់ទំនង</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">ភាគីដៃគូ</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="https://plp.moeys.gov.kh" className="hover:text-blue-600 transition-colors">PLP កម្ពុជា</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">ក្រសួងអប់រំ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>&copy; 2024 TaRL ប្រាថម. រក្សាសិទ្ធិគ្រប់យ៉ាង។</p>
          </div>
        </div>
      </footer>
    </div>
  );
}