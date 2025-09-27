'use client';

import React, { useState, useEffect } from 'react';
import { Card, Statistic, Progress, Row, Col, Button, Space, Tag, Avatar } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  RiseOutlined,
  FallOutlined,
  ArrowRightOutlined,
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import MobileLayout from '@/components/layout/MobileLayout';
import { MobileList } from '@/components/mobile/MobileList';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import kmTranslations from '@/lib/translations/km';
import dayjs from 'dayjs';

export default function MobileDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalSchools: 0,
    totalAssessments: 0,
    studentGrowth: 0,
    completionRate: 0,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      title: 'ការវាយតម្លៃថ្មី',
      titleKm: 'ការវាយតម្លៃថ្មី',
      subtitle: 'Baseline Assessment',
      subtitleKm: 'វាយតម្លៃដំបូង',
      status: 'completed' as const,
      details: [
        { label: 'សាលា', labelKm: 'សាលា', value: 'បឋមសិក្សា ក' },
        { label: 'សិស្ស', labelKm: 'សិស្ស', value: '25 នាក់' },
        { label: 'កាលបរិច្ឆេទ', labelKm: 'កាលបរិច្ឆេទ', value: dayjs().format('DD/MM/YYYY') },
      ],
    },
    {
      id: 2,
      title: 'ការទស្សនាណែនាំ',
      titleKm: 'ការទស្សនាណែនាំ',
      subtitle: 'Mentoring Visit',
      subtitleKm: 'ការណែនាំគ្រូ',
      status: 'pending' as const,
      details: [
        { label: 'សាលា', labelKm: 'សាលា', value: 'បឋមសិក្សា ខ' },
        { label: 'គោលបំណង', labelKm: 'គោលបំណង', value: 'តាមដានការអនុវត្ត' },
        { label: 'កាលបរិច្ឆេទ', labelKm: 'កាលបរិច្ឆេទ', value: dayjs().add(2, 'day').format('DD/MM/YYYY') },
      ],
    },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
  };

  // Quick action cards based on user role
  const getQuickActions = () => {
    const actions = [];
    
    if (session?.user?.role === 'admin' || session?.user?.role === 'teacher') {
      actions.push({
        icon: <TeamOutlined style={{ fontSize: 24 }} />,
        title: kmTranslations.students.addStudent,
        subtitle: 'Add New Student',
        color: '#1890ff',
        onClick: () => router.push('/students/create'),
      });
    }

    if (session?.user?.role !== 'viewer') {
      actions.push({
        icon: <FileTextOutlined style={{ fontSize: 24 }} />,
        title: kmTranslations.assessment.createAssessment,
        subtitle: 'Create Assessment',
        color: '#52c41a',
        onClick: () => router.push('/assessments/create'),
      });
    }

    if (session?.user?.role === 'mentor' || session?.user?.role === 'admin') {
      actions.push({
        icon: <CalendarOutlined style={{ fontSize: 24 }} />,
        title: kmTranslations.mentoring.scheduleVisit,
        subtitle: 'Schedule Visit',
        color: '#faad14',
        onClick: () => router.push('/mentoring/create'),
      });
    }

    actions.push({
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      title: kmTranslations.reports.title,
      subtitle: 'View Reports',
      color: '#722ed1',
      onClick: () => router.push('/reports'),
    });

    return actions;
  };

  return (
    <MobileLayout title={kmTranslations.menu.dashboard}>
      <div className="space-y-4">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0">
          <div className="text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-khmer font-bold mb-1">
                  សូមស្វាគមន៍ {session?.user?.name}!
                </h2>
                <p className="text-blue-100 text-sm">
                  Welcome back! Here's your overview.
                </p>
              </div>
              <Avatar 
                size={48}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                icon={<UserOutlined />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Tag color="blue" className="font-khmer">
                {session?.user?.role === 'admin' && kmTranslations.roles.admin}
                {session?.user?.role === 'teacher' && kmTranslations.roles.teacher}
                {session?.user?.role === 'mentor' && kmTranslations.roles.mentor}
                {session?.user?.role === 'coordinator' && kmTranslations.roles.coordinator}
                {session?.user?.role === 'viewer' && kmTranslations.roles.viewer}
              </Tag>
              <Tag color="green">
                {kmTranslations.common.today}: {dayjs().format('DD/MM/YYYY')}
              </Tag>
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        <Row gutter={[12, 12]}>
          <Col xs={12}>
            <Card className="text-center border-0 shadow-sm">
              <Statistic
                title={
                  <span className="font-khmer text-gray-600">
                    {kmTranslations.students.title}
                  </span>
                }
                value={stats.totalStudents}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                <RiseOutlined className="text-green-500" /> {stats.studentGrowth}%
              </div>
            </Card>
          </Col>
          <Col xs={12}>
            <Card className="text-center border-0 shadow-sm">
              <Statistic
                title={
                  <span className="font-khmer text-gray-600">
                    {kmTranslations.menu.assessments}
                  </span>
                }
                value={stats.totalAssessments}
                prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ fontSize: 24, fontWeight: 'bold' }}
              />
              <div className="mt-2 text-xs text-gray-500">
                {stats.completionRate}% {kmTranslations.common.completed}
              </div>
            </Card>
          </Col>
        </Row>

        {/* Progress Cards */}
        <Card className="border-0 shadow-sm">
          <h3 className="font-khmer text-base font-bold mb-4">វឌ្ឍនភាពការវាយតម្លៃ</h3>
          <Space direction="vertical" className="w-full" size="middle">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-khmer text-sm">{kmTranslations.assessment.baseline}</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress percent={85} strokeColor="#52c41a" showInfo={false} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-khmer text-sm">{kmTranslations.assessment.midline}</span>
                <span className="text-sm font-medium">62%</span>
              </div>
              <Progress percent={62} strokeColor="#faad14" showInfo={false} />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-khmer text-sm">{kmTranslations.assessment.endline}</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <Progress percent={23} strokeColor="#1890ff" showInfo={false} />
            </div>
          </Space>
        </Card>

        {/* Quick Actions */}
        <div>
          <h3 className="font-khmer text-base font-bold mb-3">សកម្មភាពរហ័ស</h3>
          <Row gutter={[12, 12]}>
            {getQuickActions().map((action, index) => (
              <Col xs={12} key={index}>
                <Card
                  className="border-0 shadow-sm text-center"
                  hoverable
                  onClick={action.onClick}
                  bodyStyle={{ padding: 16 }}
                >
                  <div style={{ color: action.color }} className="mb-2">
                    {action.icon}
                  </div>
                  <div className="font-khmer text-sm font-semibold">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {action.subtitle}
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-khmer text-base font-bold">សកម្មភាពថ្មីៗ</h3>
            <Button
              type="link"
              className="font-khmer p-0"
              onClick={() => router.push('/activities')}
            >
              មើលទាំងអស់ <ArrowRightOutlined />
            </Button>
          </div>
          
          <MobileList
            items={recentActivities}
            loading={loading}
            onView={(item) => router.push(`/activities/${item.id}`)}
            showSearch={false}
            showFilter={false}
            cardActions={false}
          />
        </div>

        {/* Achievement Cards */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-khmer text-base font-bold mb-2">សមិទ្ធិផលប្រចាំសប្តាហ៍</h3>
              <p className="text-sm text-gray-600">Weekly Achievement</p>
              <div className="mt-3">
                <Tag color="gold" className="font-khmer">
                  <TrophyOutlined /> វាយតម្លៃ 50+ សិស្ស
                </Tag>
              </div>
            </div>
            <TrophyOutlined style={{ fontSize: 48, color: '#faad14', opacity: 0.3 }} />
          </div>
        </Card>
      </div>

      {/* Mobile-specific styles */}
      <style jsx global>{`
        /* Ensure cards are touch-friendly */
        .ant-card {
          border-radius: 12px;
          transition: all 0.2s;
        }
        
        .ant-card:active {
          transform: scale(0.98);
        }
        
        /* Larger touch targets for statistics */
        .ant-statistic-title {
          font-size: 12px;
          margin-bottom: 4px;
        }
        
        /* Progress bar improvements */
        .ant-progress-inner {
          border-radius: 100px;
          height: 8px !important;
        }
        
        /* Tag styling */
        .ant-tag {
          border-radius: 6px;
          padding: 2px 10px;
          font-size: 12px;
        }
        
        /* Safe area padding for iOS */
        @supports (padding: max(0px)) {
          .space-y-4 {
            padding-bottom: max(20px, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </MobileLayout>
  );
}