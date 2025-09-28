'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { TeamOutlined, FileTextOutlined, PercentageOutlined, TrophyOutlined, BarChartOutlined, BankOutlined, UserOutlined, ClockIcon } from '@ant-design/icons';

export default function SimpleReportsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Simple stats matching Laravel
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalAssessments: 3750,
    completionRate: 85,
    averageScore: 72
  });

  // Report cards with specific icons
  const reportCards = [
    {
      title: 'លទ្ធផលសិស្ស',
      subtitle: 'Student Performance',
      path: '/reports/student-performance',
      color: 'bg-blue-50',
      iconColor: 'bg-blue-500',
      icon: 'chart',
      description: 'មើលលទ្ធផលវាយតម្លៃរបស់សិស្ស'
    },
    {
      title: 'ប្រៀបធៀបសាលា',
      subtitle: 'School Comparison',
      path: '/reports/school-comparison',
      color: 'bg-green-50',
      iconColor: 'bg-green-500',
      icon: 'school',
      description: 'ប្រៀបធៀបលទ្ធផលរវាងសាលារៀន'
    },
    {
      title: 'ផលប៉ះពាល់ការណែនាំ',
      subtitle: 'Mentoring Impact',
      path: '/reports/mentoring-impact',
      color: 'bg-yellow-50',
      iconColor: 'bg-yellow-500',
      icon: 'user',
      description: 'វិភាគផលប៉ះពាល់នៃការណែនាំ'
    },
    {
      title: 'តាមដានវឌ្ឍនភាព',
      subtitle: 'Progress Tracking',
      path: '/reports/progress-tracking',
      color: 'bg-purple-50',
      iconColor: 'bg-purple-500',
      icon: 'trend',
      description: 'តាមដានវឌ្ឍនភាពតាមរយៈពេល'
    },
    {
      title: 'វឌ្ឍនភាពថ្នាក់',
      subtitle: 'Class Progress',
      path: '/reports/class-progress',
      color: 'bg-indigo-50',
      iconColor: 'bg-indigo-500',
      icon: 'group',
      description: 'មើលវឌ្ឍនភាពតាមថ្នាក់រៀន'
    },
    {
      title: 'របាយការណ៍វត្តមាន',
      subtitle: 'Attendance Report',
      path: '/reports/attendance',
      color: 'bg-red-50',
      iconColor: 'bg-red-500',
      icon: 'clock',
      description: 'តាមដានវត្តមានសិស្ស'
    }
  ];

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Page Header - Laravel style */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">របាយការណ៍</h1>
          <p className="mt-2 text-sm text-gray-600">
            ជ្រើសរើសប្រភេទរបាយការណ៍ដែលអ្នកចង់មើល
          </p>
        </div>

        {/* Statistics Cards - Dashboard style with colored backgrounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students Card */}
          <div className="bg-blue-50 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <TeamOutlined className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-5">
              <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">សិស្សសរុប</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.totalStudents.toLocaleString()}</div>
            </div>
          </div>

          {/* Total Assessments Card */}
          <div className="bg-green-50 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <FileTextOutlined className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-5">
              <div className="text-xs font-medium text-green-600 uppercase tracking-wider">ការវាយតម្លៃសរុប</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.totalAssessments.toLocaleString()}</div>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-yellow-50 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center">
                <PercentageOutlined className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-5">
              <div className="text-xs font-medium text-yellow-600 uppercase tracking-wider">អត្រាបញ្ចប់</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.completionRate}%</div>
            </div>
          </div>

          {/* Average Score Card */}
          <div className="bg-purple-50 rounded-lg p-6 flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <TrophyOutlined className="text-white text-xl" />
              </div>
            </div>
            <div className="ml-5">
              <div className="text-xs font-medium text-purple-600 uppercase tracking-wider">ពិន្ទុមធ្យម</div>
              <div className="text-3xl font-semibold text-gray-900">{stats.averageScore}</div>
            </div>
          </div>
        </div>

        {/* Clean Report Cards Grid - Following codebase patterns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((report, index) => {
            // Icon mapping function
            const getIcon = (iconType: string) => {
              const iconClass = "text-xl text-white";
              switch(iconType) {
                case 'chart': return <BarChartOutlined className={iconClass} />;
                case 'school': return <BankOutlined className={iconClass} />;
                case 'user': return <UserOutlined className={iconClass} />;
                case 'trend': return <TrophyOutlined className={iconClass} />;
                case 'group': return <TeamOutlined className={iconClass} />;
                case 'clock': return <FileTextOutlined className={iconClass} />;
                default: return <BarChartOutlined className={iconClass} />;
              }
            };

            return (
              <Link href={report.path} key={index}>
                <div className={`${report.color} rounded-xl p-6 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer border border-gray-100`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 ${report.iconColor} rounded-lg flex items-center justify-center shadow-sm`}>
                        {getIcon(report.icon)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{report.subtitle}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{report.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium text-indigo-600">
                      មើលរបាយការណ៍
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Simple Recent Activity Table - Laravel style */}
        <div className="mt-8">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">សកម្មភាពថ្មីៗ</h3>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      កាលបរិច្ឆេទ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ប្រភេទ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      សាលារៀន
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ស្ថានភាព
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date().toLocaleDateString('km-KH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ការវាយតម្លៃ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      សាលាបឋមសិក្សាភ្នំពេញ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        បញ្ចប់
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(Date.now() - 86400000).toLocaleDateString('km-KH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ការណែនាំ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      សាលាបឋមសិក្សាសៀមរាប
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        កំពុងដំណើរការ
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(Date.now() - 172800000).toLocaleDateString('km-KH')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      របាយការណ៍
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      សាលាបឋមសិក្សាកំពត
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        បញ្ចប់
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Print Button - Laravel style */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-2 -ml-1 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            បោះពុម្ពរបាយការណ៍
          </button>
        </div>
      </div>
    </HorizontalLayout>
  );
}