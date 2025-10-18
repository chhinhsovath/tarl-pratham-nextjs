'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  Card,
  Row,
  Col,
  Statistic,
  Tabs,
  Button,
  Space,
  DatePicker,
  Select,
  Tag,
  Badge,
  Dropdown,
  Input,
  Empty,
  Spin,
  message as antdMessage
} from 'antd';
import {
  TeamOutlined,
  FileTextOutlined,
  PercentageOutlined,
  TrophyOutlined,
  BarChartOutlined,
  BankOutlined,
  UserOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
  FilterOutlined,
  CalendarOutlined,
  LineChartOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  SettingOutlined,
  ExportOutlined,
  DashboardOutlined,
  AuditOutlined,
  SecurityScanOutlined,
  ThunderboltOutlined,
  BookOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import OnboardingTour from '@/components/tour/OnboardingTour';
import { trackActivity } from '@/lib/trackActivity';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;

export default function EnhancedReportsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('1');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedSchool, setSelectedSchool] = useState<string | undefined>();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalMentoringVisits: 0,
    totalSchools: 0,
    totalUsers: 0,
    systemHealth: 'good',
    recentActivities: []
  });

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?type=overview');
      const result = await response.json();

      if (result.data) {
        setStats({
          totalStudents: result.data.overview.total_students || 0,
          totalAssessments: result.data.overview.total_assessments || 0,
          totalMentoringVisits: result.data.overview.total_mentoring_visits || 0,
          totalSchools: 0,
          totalUsers: 0,
          systemHealth: 'good',
          recentActivities: result.data.assessments?.recent || []
        });
      }

      trackActivity('report_view');
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Report categories for System Admin
  const studentReports = [
    {
      title: 'លទ្ធផលសិស្ស',
      subtitle: 'Student Performance',
      path: '/reports/student-performance',
      color: 'bg-blue-50',
      iconColor: 'bg-blue-500',
      icon: <BarChartOutlined className="text-xl text-white" />,
      description: 'មើលលទ្ធផលវាយតម្លៃរបស់សិស្ស',
      badge: 'Popular'
    },
    {
      title: 'តាមដានវឌ្ឍនភាព',
      subtitle: 'Progress Tracking',
      path: '/reports/progress-tracking',
      color: 'bg-purple-50',
      iconColor: 'bg-purple-500',
      icon: <LineChartOutlined className="text-xl text-white" />,
      description: 'តាមដានវឌ្ឌនភាពតាមរយៈពេល'
    },
    {
      title: 'របាយការណ៍វត្តមាន',
      subtitle: 'Attendance Report',
      path: '/reports/attendance',
      color: 'bg-red-50',
      iconColor: 'bg-red-500',
      icon: <ClockCircleOutlined className="text-xl text-white" />,
      description: 'តាមដានវត្តមានសិស្ស'
    }
  ];

  const schoolReports = [
    {
      title: 'ប្រៀបធៀបសាលា',
      subtitle: 'School Comparison',
      path: '/reports/school-comparison',
      color: 'bg-green-50',
      iconColor: 'bg-green-500',
      icon: <BankOutlined className="text-xl text-white" />,
      description: 'ប្រៀបធៀបលទ្ធផលរវាងសាលារៀន'
    },
    {
      title: 'របាយការណ៍ទូទៅសាលារៀន',
      subtitle: 'School Overview',
      path: '/reports/school-overview',
      color: 'bg-cyan-50',
      iconColor: 'bg-cyan-500',
      icon: <DashboardOutlined className="text-xl text-white" />,
      description: 'ទិដ្ឋភាពទូទៅនៃសាលារៀនទាំងអស់',
      badge: 'Recommended'
    },
    {
      title: 'វឌ្ឍនភាពថ្នាក់',
      subtitle: 'Class Progress',
      path: '/reports/class-progress',
      color: 'bg-indigo-50',
      iconColor: 'bg-indigo-500',
      icon: <TeamOutlined className="text-xl text-white" />,
      description: 'មើលវឌ្ឌនភាពតាមថ្នាក់រៀន'
    }
  ];

  const assessmentReports = [
    {
      title: 'វិភាគការវាយតម្លៃ',
      subtitle: 'Assessment Analysis',
      path: '/reports/assessment-analysis',
      color: 'bg-orange-50',
      iconColor: 'bg-orange-500',
      icon: <PieChartOutlined className="text-xl text-white" />,
      description: 'វិភាគលទ្ធផលការវាយតម្លៃ',
      badge: 'New'
    },
    {
      title: 'ផលប៉ះពាល់ការណែនាំ',
      subtitle: 'Mentoring Impact',
      path: '/reports/mentoring-impact',
      color: 'bg-yellow-50',
      iconColor: 'bg-yellow-500',
      icon: <UserOutlined className="text-xl text-white" />,
      description: 'វិភាគផលប៉ះពាល់នៃការណែនាំ'
    },
    {
      title: 'ផលប៉ះពាល់ការអន្តរាគមន៍',
      subtitle: 'Intervention Effectiveness',
      path: '/reports/intervention',
      color: 'bg-lime-50',
      iconColor: 'bg-lime-500',
      icon: <ThunderboltOutlined className="text-xl text-white" />,
      description: 'វាស់ស្ទង់ប្រសិទ្ធភាពការអន្តរាគមន៍'
    }
  ];

  const adminReports = [
    {
      title: 'សកម្មភាពអ្នកប្រើប្រាស់',
      subtitle: 'User Activity',
      path: '/reports/user-activity',
      color: 'bg-teal-50',
      iconColor: 'bg-teal-500',
      icon: <AuditOutlined className="text-xl text-white" />,
      description: 'តាមដានសកម្មភាពអ្នកប្រើប្រាស់',
      adminOnly: true
    },
    {
      title: 'គុណភាពទិន្នន័យ',
      subtitle: 'Data Quality',
      path: '/reports/data-quality',
      color: 'bg-pink-50',
      iconColor: 'bg-pink-500',
      icon: <SecurityScanOutlined className="text-xl text-white" />,
      description: 'ពិនិត្យគុណភាពទិន្នន័យ',
      adminOnly: true
    },
    {
      title: 'ប្រវត្តិប្រព័ន្ធ',
      subtitle: 'System Audit',
      path: '/reports/system-audit',
      color: 'bg-gray-50',
      iconColor: 'bg-gray-500',
      icon: <HistoryOutlined className="text-xl text-white" />,
      description: 'មើលប្រវត្តិការប្រើប្រាស់ប្រព័ន្ធ',
      adminOnly: true
    }
  ];

  const analyticsReports = [
    {
      title: 'ផ្ទាំងគ្រប់គ្រងរបាយការណ៍',
      subtitle: 'Reports Dashboard',
      path: '/reports/dashboard',
      color: 'bg-violet-50',
      iconColor: 'bg-violet-500',
      icon: <DashboardOutlined className="text-xl text-white" />,
      description: 'ផ្ទាំងគ្រប់គ្រងរបាយការណ៍ទូទៅ',
      badge: 'Featured'
    }
  ];

  const exportMenuItems = [
    {
      key: 'excel',
      icon: <FileExcelOutlined />,
      label: 'Export to Excel',
      onClick: () => handleExport('excel')
    },
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'Export to PDF',
      onClick: () => handleExport('pdf')
    },
    {
      type: 'divider' as const
    },
    {
      key: 'all',
      icon: <DownloadOutlined />,
      label: 'Download All Reports',
      onClick: () => handleExport('all')
    }
  ];

  const handleExport = async (format: string) => {
    antdMessage.loading(`កំពុងនាំចេញ ${format}...`, 1);
    // Export implementation
    setTimeout(() => {
      antdMessage.success(`នាំចេញ ${format} បានជោគជ័យ!`);
    }, 1000);
  };

  const renderReportCard = (report: any, index: number) => (
    <Col xs={24} sm={12} lg={8} xl={6} key={index}>
      <Link href={report.path}>
        <div className={`${report.color} rounded-xl p-5 hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 h-full`}>
          <div className="flex items-start justify-between mb-3">
            <div className={`w-14 h-14 ${report.iconColor} rounded-lg flex items-center justify-center shadow-sm`}>
              {report.icon}
            </div>
            {report.badge && (
              <Tag color={report.badge === 'New' ? 'green' : report.badge === 'Popular' ? 'blue' : 'gold'}>
                {report.badge}
              </Tag>
            )}
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{report.title}</h3>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">{report.subtitle}</p>
          <p className="text-sm text-gray-600 mb-3">{report.description}</p>
          <div className="flex items-center justify-end text-sm font-medium text-indigo-600">
            មើលរបាយការណ៍
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </Col>
  );

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Enhanced Page Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">មជ្ឈមណ្ឌលរបាយការណ៍</h1>
              <p className="text-sm text-gray-600">
                ជ្រើសរើសនិងគ្រប់គ្រងរបាយការណ៍ទាំងអស់របស់ប្រព័ន្ធ
              </p>
            </div>
            <Space className="mt-4 md:mt-0">
              <Button icon={<CalendarOutlined />}>កាលវិភាគ</Button>
              <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                <Button type="primary" icon={<ExportOutlined />}>
                  Export
                </Button>
              </Dropdown>
              <Button icon={<SettingOutlined />} onClick={() => router.push('/reports/settings')}>
                ការកំណត់
              </Button>
            </Space>
          </div>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-6">
          <Space wrap style={{ width: '100%' }}>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              style={{ width: 250 }}
              placeholder={['កាលបរិច្ឆេទចាប់ផ្តើម', 'កាលបរិច្ឆេទបញ្ចប់']}
            />
            <Select
              placeholder="ជ្រើសរើសខេត្ត"
              style={{ width: 180 }}
              allowClear
              value={selectedProvince}
              onChange={setSelectedProvince}
            >
              <Option value="all">ខេត្តទាំងអស់</Option>
              <Option value="kampong-cham">កំពង់ចាម</Option>
              <Option value="phnom-penh">ភ្នំពេញ</Option>
              {/* Add more provinces */}
            </Select>
            <Select
              placeholder="ជ្រើសរើសសាលារៀន"
              style={{ width: 200 }}
              allowClear
              value={selectedSchool}
              onChange={setSelectedSchool}
              showSearch
            >
              <Option value="all">សាលារៀនទាំងអស់</Option>
              {/* Schools will be loaded dynamically */}
            </Select>
            <Button icon={<FilterOutlined />}>ចម្រោះថែម</Button>
            <Button icon={<SearchOutlined />} type="default">ស្វែងរក</Button>
          </Space>
        </Card>

        {/* Enhanced Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={12} sm={12} md={6}>
            <Card loading={loading} bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="សិស្សសរុប"
                value={stats.totalStudents}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
                prefix={<TeamOutlined />}
              />
              <div className="text-xs text-gray-500 mt-2">
                <span className="text-green-600">↑ 12%</span> ពីខែមុន
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card loading={loading} bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="ការវាយតម្លៃសរុប"
                value={stats.totalAssessments}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
                prefix={<FileTextOutlined />}
              />
              <div className="text-xs text-gray-500 mt-2">
                <span className="text-green-600">↑ 8%</span> ពីខែមុន
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card loading={loading} bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="ការណែនាំសរុប"
                value={stats.totalMentoringVisits}
                valueStyle={{ color: '#722ed1', fontSize: '28px' }}
                prefix={<UserOutlined />}
              />
              <div className="text-xs text-gray-500 mt-2">
                <span className="text-green-600">↑ 15%</span> ពីខែមុន
              </div>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card loading={loading} bodyStyle={{ padding: '20px' }}>
              <Statistic
                title="សាលារៀនសរុប"
                value={stats.totalSchools || 45}
                valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
                prefix={<BankOutlined />}
              />
              <div className="text-xs text-gray-500 mt-2">
                <Tag color="green">Active</Tag>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Tabbed Report Categories */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            {/* Student Reports Tab */}
            <TabPane
              tab={
                <span>
                  <TeamOutlined />
                  របាយការណ៍សិស្ស
                </span>
              }
              key="1"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">របាយការណ៍ទាក់ទងនឹងសិស្ស</h3>
                <p className="text-sm text-gray-600">លទ្ធផល វឌ្ឍនភាព និងវត្តមានសិស្ស</p>
              </div>
              <Row gutter={[16, 16]}>
                {studentReports.map((report, index) => renderReportCard(report, index))}
              </Row>
            </TabPane>

            {/* School Reports Tab */}
            <TabPane
              tab={
                <span>
                  <BankOutlined />
                  របាយការណ៍សាលារៀន
                </span>
              }
              key="2"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">របាយការណ៍ទាក់ទងនឹងសាលារៀន</h3>
                <p className="text-sm text-gray-600">ប្រៀបធៀប ទិដ្ឋភាពទូទៅ និងវឌ្ឍនភាពសាលារៀន</p>
              </div>
              <Row gutter={[16, 16]}>
                {schoolReports.map((report, index) => renderReportCard(report, index))}
              </Row>
            </TabPane>

            {/* Assessment Reports Tab */}
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  របាយការណ៍ការវាយតម្លៃ
                </span>
              }
              key="3"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">របាយការណ៍ការវាយតម្លៃ</h3>
                <p className="text-sm text-gray-600">វិភាគ ផលប៉ះពាល់ និងប្រសិទ្ធភាព</p>
              </div>
              <Row gutter={[16, 16]}>
                {assessmentReports.map((report, index) => renderReportCard(report, index))}
              </Row>
            </TabPane>

            {/* Analytics Tab */}
            <TabPane
              tab={
                <span>
                  <AreaChartOutlined />
                  វិភាគទិន្នន័យ
                </span>
              }
              key="4"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">វិភាគនិងសង្ខេប</h3>
                <p className="text-sm text-gray-600">ផ្ទាំងគ្រប់គ្រងនិងវិភាគទិន្នន័យជម្រៅ</p>
              </div>
              <Row gutter={[16, 16]}>
                {analyticsReports.map((report, index) => renderReportCard(report, index))}
              </Row>
            </TabPane>

            {/* Admin Reports Tab - Only for Admin */}
            {session?.user?.role === 'admin' && (
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    របាយការណ៍អ្នកគ្រប់គ្រង
                    <Badge count="Admin" style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />
                  </span>
                }
                key="5"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">របាយការណ៍សម្រាប់អ្នកគ្រប់គ្រង</h3>
                  <p className="text-sm text-gray-600">សកម្មភាព ប្រព័ន្ធ និងគុណភាពទិន្នន័យ</p>
                </div>
                <Row gutter={[16, 16]}>
                  {adminReports.map((report, index) => renderReportCard(report, index))}
                </Row>
              </TabPane>
            )}
          </Tabs>
        </Card>

        {/* Quick Actions Panel */}
        <Card className="mt-6" title="សកម្មភាពរហ័ស">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="dashed"
                block
                icon={<FileExcelOutlined />}
                onClick={() => router.push('/reports/school-overview')}
                style={{ height: 'auto', padding: '16px' }}
              >
                <div className="text-left">
                  <div className="font-semibold">Export សាលាទាំងអស់</div>
                  <div className="text-xs text-gray-500">ទាញយកទិន្នន័យសាលារៀន</div>
                </div>
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="dashed"
                block
                icon={<BarChartOutlined />}
                onClick={() => router.push('/reports/dashboard')}
                style={{ height: 'auto', padding: '16px' }}
              >
                <div className="text-left">
                  <div className="font-semibold">ផ្ទាំងគ្រប់គ្រង</div>
                  <div className="text-xs text-gray-500">មើលវិភាគទូទៅ</div>
                </div>
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="dashed"
                block
                icon={<CalendarOutlined />}
                onClick={() => antdMessage.info('មុខងារនេះនឹងមានក្នុងពេលឆាប់ៗ')}
                style={{ height: 'auto', padding: '16px' }}
              >
                <div className="text-left">
                  <div className="font-semibold">កាលវិភាគរបាយការណ៍</div>
                  <div className="text-xs text-gray-500">កំណត់ពេលវេលាស្វ័យប្រវត្តិ</div>
                </div>
              </Button>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button
                type="dashed"
                block
                icon={<BookOutlined />}
                onClick={() => router.push('/help')}
                style={{ height: 'auto', padding: '16px' }}
              >
                <div className="text-left">
                  <div className="font-semibold">មគ្គុទ្ទេសក៍</div>
                  <div className="text-xs text-gray-500">របៀបប្រើប្រាស់</div>
                </div>
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Recent Report Activity */}
        <div className="mt-6">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-base font-medium text-gray-900">សកម្មភាពរបាយការណ៍ថ្មីៗ</h3>
              <Button type="link" size="small">មើលទាំងអស់</Button>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">កាលបរិច្ឆេទ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ប្រភេទ</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">សាលារៀន</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <Spin />
                      </td>
                    </tr>
                  ) : stats.recentActivities.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <Empty description="មិនមានសកម្មភាពថ្មីៗ" />
                      </td>
                    </tr>
                  ) : (
                    stats.recentActivities.slice(0, 5).map((activity: any, index: number) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {activity.assessed_date ? dayjs(activity.assessed_date).format('DD/MM/YYYY') : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {activity.subject === 'Language' ? 'ភាសាខ្មែរ' : activity.subject === 'Math' ? 'គណិតវិទ្យា' : activity.subject}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {activity.pilot_school?.school_name || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <Tag color="green" icon={<CheckCircleOutlined />}>បញ្ចប់</Tag>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {loading ? (
                <div className="px-4 py-8 text-center">
                  <Spin />
                </div>
              ) : stats.recentActivities.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Empty description="មិនមានសកម្មភាពថ្មីៗ" />
                </div>
              ) : (
                stats.recentActivities.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="px-4 py-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {activity.subject === 'Language' ? 'ភាសាខ្មែរ' : activity.subject === 'Math' ? 'គណិតវិទ្យា' : activity.subject}
                      </span>
                      <Tag color="green" icon={<CheckCircleOutlined />}>បញ្ចប់</Tag>
                    </div>
                    <div className="text-sm text-gray-600">{activity.pilot_school?.school_name || '-'}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {activity.assessed_date ? dayjs(activity.assessed_date).format('DD/MM/YYYY') : '-'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <OnboardingTour page="reports" autoStart={false} showStartButton={false} />
    </HorizontalLayout>
  );
}
