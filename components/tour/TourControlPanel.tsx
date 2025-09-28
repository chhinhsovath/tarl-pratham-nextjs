'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, List, Space, Typography, Switch, message, Divider, Badge } from 'antd';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PlayCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  BookOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface TourItem {
  key: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  page: string;
  icon: React.ReactNode;
  path: string;
}

export default function TourControlPanel() {
  const { data: session } = useSession();
  const router = useRouter();
  const [completedTours, setCompletedTours] = useState<string[]>([]);
  const [language, setLanguage] = useState<'km' | 'en'>('km');
  const [autoTours, setAutoTours] = useState(true);

  useEffect(() => {
    // Load completed tours and settings
    const completed = localStorage.getItem('tarl-completed-tours');
    const autoSetting = localStorage.getItem('tarl-auto-tours');
    const langSetting = localStorage.getItem('tarl-tour-language');

    if (completed) {
      setCompletedTours(JSON.parse(completed));
    }
    if (autoSetting) {
      setAutoTours(JSON.parse(autoSetting));
    }
    if (langSetting) {
      setLanguage(langSetting as 'km' | 'en');
    }
  }, []);

  const tours: TourItem[] = [
    {
      key: 'navigation',
      title: 'ការណែនាំម៉ឺនុយទូទៅ',
      titleEn: 'General Navigation Tour',
      description: 'ស្វែងយល់អំពីម៉ឺនុយសំខាន់ៗនិងការរុករកប្រព័ន្ធ',
      descriptionEn: 'Learn about main navigation and system exploration',
      page: 'navigation',
      icon: <GlobalOutlined />,
      path: '/dashboard'
    },
    {
      key: 'dashboard',
      title: 'ការណែនាំផ្ទាំងគ្រប់គ្រង',
      titleEn: 'Dashboard Tour',
      description: 'ស្វែងយល់អំពីស្ថិតិ ក្រាហ្វិក និងទិន្នន័យសំខាន់ៗ',
      descriptionEn: 'Learn about statistics, charts, and important data',
      page: 'dashboard',
      icon: <DashboardOutlined />,
      path: '/dashboard'
    },
    {
      key: 'reports',
      title: 'ការណែនាំរបាយការណ៍',
      titleEn: 'Reports Tour',
      description: 'ស្វែងយល់អំពីប្រភេទរបាយការណ៍និងការវិភាគទិន្នន័យ',
      descriptionEn: 'Learn about report types and data analysis',
      page: 'reports',
      icon: <BarChartOutlined />,
      path: '/reports'
    },
    {
      key: 'assessments',
      title: 'ការណែនាំការវាយតម្លៃ',
      titleEn: 'Assessments Tour',
      description: 'ស្វែងយល់អំពីការបង្កើត គ្រប់គ្រង និងការវាយតម្លៃ',
      descriptionEn: 'Learn about creating, managing, and assessments',
      page: 'assessments',
      icon: <FileTextOutlined />,
      path: '/assessments'
    },
    {
      key: 'students',
      title: 'ការណែនាំគ្រប់គ្រងសិស្ស',
      titleEn: 'Student Management Tour',
      description: 'ស្វែងយល់អំពីការគ្រប់គ្រងព័ត៌មានសិស្ស',
      descriptionEn: 'Learn about managing student information',
      page: 'students',
      icon: <TeamOutlined />,
      path: '/students'
    },
  ];

  const getRoleSpecificTours = (userRole: string) => {
    const baseTours = tours.filter(tour => ['navigation', 'dashboard'].includes(tour.key));

    switch (userRole) {
      case 'admin':
        return tours; // All tours
      case 'teacher':
        return tours.filter(tour => ['navigation', 'dashboard', 'assessments', 'students', 'reports'].includes(tour.key));
      case 'mentor':
        return tours.filter(tour => ['navigation', 'dashboard', 'assessments', 'students', 'reports'].includes(tour.key));
      case 'coordinator':
        return baseTours;
      case 'viewer':
        return tours.filter(tour => ['navigation', 'dashboard', 'reports'].includes(tour.key));
      default:
        return baseTours;
    }
  };

  const isCompleted = (tourKey: string) => {
    if (!session?.user?.role) return false;
    const fullKey = `${session.user.role}-${tourKey}`;
    return completedTours.includes(fullKey);
  };

  const startTour = (tour: TourItem) => {
    router.push(tour.path);
    // Small delay to ensure page loads
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('startTour', {
        detail: { page: tour.page, role: session?.user?.role }
      }));
    }, 500);
  };

  const resetAllTours = () => {
    localStorage.removeItem('tarl-completed-tours');
    setCompletedTours([]);
    message.success(language === 'km' ? 'បានកំណត់ការណែនាំឡើងវិញ' : 'Tours reset successfully');
  };

  const resetSpecificTour = (tourKey: string) => {
    if (!session?.user?.role) return;

    const fullKey = `${session.user.role}-${tourKey}`;
    const newCompleted = completedTours.filter(key => key !== fullKey);
    setCompletedTours(newCompleted);
    localStorage.setItem('tarl-completed-tours', JSON.stringify(newCompleted));
    message.success(language === 'km' ? 'បានកំណត់ការណែនាំឡើងវិញ' : 'Tour reset successfully');
  };

  const toggleAutoTours = (enabled: boolean) => {
    setAutoTours(enabled);
    localStorage.setItem('tarl-auto-tours', JSON.stringify(enabled));
    message.success(
      enabled
        ? (language === 'km' ? 'បានបើកការណែនាំស្វ័យប្រវត្តិ' : 'Auto tours enabled')
        : (language === 'km' ? 'បានបិទការណែនាំស្វ័យប្រវត្តិ' : 'Auto tours disabled')
    );
  };

  const toggleLanguage = () => {
    const newLang = language === 'km' ? 'en' : 'km';
    setLanguage(newLang);
    localStorage.setItem('tarl-tour-language', newLang);
  };

  const availableTours = session?.user?.role ? getRoleSpecificTours(session.user.role) : [];

  return (
    <div className="space-y-6">
      <Card>
        <div className="text-center mb-6">
          <Title level={3} className="font-khmer">
            {language === 'km' ? '🎯 ការណែនាំប្រព័ន្ធ' : '🎯 System Tours'}
          </Title>
          <Paragraph className="font-khmer">
            {language === 'km'
              ? 'ស្វែងយល់អំពីមុខងារនានារបស់ប្រព័ន្ធតាមរយៈការណែនាំជាជំហាន'
              : 'Learn about system features through step-by-step guidance'
            }
          </Paragraph>
        </div>

        {/* Settings */}
        <Card size="small" className="mb-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <Space>
              <SettingOutlined />
              <Text className="font-khmer">
                {language === 'km' ? 'ការកំណត់ការណែនាំ' : 'Tour Settings'}
              </Text>
            </Space>
            <Space>
              <Switch
                checked={autoTours}
                onChange={toggleAutoTours}
                checkedChildren={language === 'km' ? 'ស្វ័យប្រវត្តិ' : 'Auto'}
                unCheckedChildren={language === 'km' ? 'ម៉ាន់ុយ' : 'Manual'}
              />
              <Button onClick={toggleLanguage} size="small">
                {language === 'km' ? 'English' : 'ខ្មែរ'}
              </Button>
              <Button
                onClick={resetAllTours}
                size="small"
                danger
                icon={<ReloadOutlined />}
              >
                {language === 'km' ? 'កំណត់ឡើងវិញ' : 'Reset All'}
              </Button>
            </Space>
          </div>
        </Card>

        {/* Tour List */}
        <List
          itemLayout="horizontal"
          dataSource={availableTours}
          renderItem={(tour) => {
            const completed = isCompleted(tour.key);
            return (
              <List.Item
                actions={[
                  <Button
                    key="start"
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => startTour(tour)}
                    className="font-khmer"
                  >
                    {language === 'km' ? 'ចាប់ផ្តើម' : 'Start'}
                  </Button>,
                  completed && (
                    <Button
                      key="reset"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={() => resetSpecificTour(tour.key)}
                      className="font-khmer"
                    >
                      {language === 'km' ? 'ធ្វើម្តងទៀត' : 'Retry'}
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Badge dot={!completed} color="orange">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {tour.icon}
                      </div>
                    </Badge>
                  }
                  title={
                    <div className="flex items-center gap-2">
                      <Text className="font-khmer font-semibold">
                        {language === 'km' ? tour.title : tour.titleEn}
                      </Text>
                      {completed && (
                        <Badge count="✓" style={{ backgroundColor: '#52c41a' }} />
                      )}
                    </div>
                  }
                  description={
                    <Text className="font-khmer text-gray-600">
                      {language === 'km' ? tour.description : tour.descriptionEn}
                    </Text>
                  }
                />
              </List.Item>
            );
          }}
        />

        <Divider />

        {/* Progress */}
        <div className="text-center">
          <Text className="font-khmer text-gray-500">
            {language === 'km' ? 'បានបញ្ចប់' : 'Completed'}: {completedTours.filter(key => key.startsWith(session?.user?.role || '')).length} / {availableTours.length}
          </Text>
        </div>
      </Card>
    </div>
  );
}