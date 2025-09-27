'use client';

import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, theme, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BankOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  BookOutlined,
  SolutionOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ImportOutlined,
  TranslationOutlined,
  QuestionCircleOutlined,
  SafetyOutlined,
  FolderOutlined,
  AreaChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Helper function to check role permissions
  const hasRole = (roles: string[]) => {
    return roles.includes(session?.user?.role || '');
  };

  const isAdmin = () => hasRole(['admin']);
  const isCoordinator = () => hasRole(['coordinator']);
  const isMentor = () => hasRole(['mentor']);
  const isTeacher = () => hasRole(['teacher']);
  const isViewer = () => hasRole(['viewer']);

  // Build menu items based on user role
  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    // Dashboard - All except Coordinator
    if (!isCoordinator()) {
      items.push({
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'ផ្ទាំងគ្រប់គ្រង',
        onClick: () => router.push('/dashboard'),
      });

      items.push({
        key: '/analytics-dashboard',
        icon: <AreaChartOutlined />,
        label: 'វិភាគ ផ្ទាំងគ្រប់គ្រង',
        onClick: () => router.push('/analytics-dashboard'),
      });
    }

    // Assessments - Admin, Teacher, Mentor, Viewer
    if (hasRole(['admin', 'teacher', 'mentor', 'viewer'])) {
      items.push({
        key: 'assessments',
        icon: <FileTextOutlined />,
        label: 'ការវាយតម្លៃ',
        children: [
          {
            key: '/assessments',
            label: 'បង្កើតការវាយតម្លៃ',
            onClick: () => router.push('/assessments'),
          },
          {
            key: '/assessments/create',
            label: 'ការវាយតម្លៃថ្មី',
            onClick: () => router.push('/assessments/create'),
          },
          ...(hasRole(['admin', 'mentor']) ? [{
            key: '/assessments/manage',
            label: 'គ្រប់គ្រងការវាយតម្លៃ',
            onClick: () => router.push('/assessments/manage'),
          }] : [])
        ],
      });
    }

    // Verification - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/verification',
        icon: <CheckCircleOutlined />,
        label: 'ផ្ទៀងផ្ទាត់',
        onClick: () => router.push('/verification'),
      });
    }

    // Students - Admin, Teacher, Mentor
    if (hasRole(['admin', 'teacher', 'mentor'])) {
      items.push({
        key: '/students',
        icon: <TeamOutlined />,
        label: 'សិស្ស',
        onClick: () => router.push('/students'),
      });
    }

    // Mentoring Visits - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/mentoring-visits',
        icon: <SolutionOutlined />,
        label: 'ការចុះអប់រំ និងត្រួតពិនិត្យ',
        onClick: () => router.push('/mentoring-visits'),
      });
    }

    // Teacher Workspace - Mentor only
    if (isMentor()) {
      items.push({
        key: '/teacher-workspace',
        icon: <BookOutlined />,
        label: 'កន្លែងធ្វើការគ្រូ',
        onClick: () => router.push('/teacher/dashboard'),
      });
    }

    // Reports - All except Coordinator
    if (!isCoordinator()) {
      items.push({
        key: 'reports',
        icon: <BarChartOutlined />,
        label: 'របាយការណ៍',
        children: [
          {
            key: '/reports/dashboard',
            label: 'ផ្ទាំងវិភាគទិន្នន័យ',
            onClick: () => router.push('/reports/dashboard'),
          },
          {
            key: '/reports/assessment-analysis',
            label: 'របាយការណ៍វិភាគការវាយតម្លៃ',
            onClick: () => router.push('/reports/assessment-analysis'),
          },
          {
            key: '/reports/attendance',
            label: 'របាយការណ៍វត្តមាន',
            onClick: () => router.push('/reports/attendance'),
          },
          {
            key: '/reports/intervention',
            label: 'របាយការណ៍អន្តរាគមន៍',
            onClick: () => router.push('/reports/intervention'),
          },
          {
            type: 'divider',
          },
          {
            key: '/reports',
            label: 'របាយការណ៍ទាំងអស់',
            onClick: () => router.push('/reports'),
          },
        ],
      });
    }

    // Coordinator Workspace - Admin, Coordinator
    if (hasRole(['admin', 'coordinator'])) {
      items.push({
        key: '/coordinator',
        icon: <AppstoreOutlined />,
        label: isCoordinator() ? 'កន្លែងធ្វើការ' : 'កន្លែងធ្វើការសម្របសម្រួល',
        onClick: () => router.push('/coordinator/workspace'),
      });
    }

    // Administration - Admin only
    if (isAdmin()) {
      items.push({
        key: 'administration',
        icon: <SafetyOutlined />,
        label: 'រដ្ឋបាល',
        children: [
          {
            key: '/users',
            icon: <UserOutlined />,
            label: 'អ្នកប្រើប្រាស់',
            onClick: () => router.push('/users'),
          },
          {
            key: '/schools',
            icon: <BankOutlined />,
            label: 'សាលារៀន',
            onClick: () => router.push('/schools'),
          },
          {
            key: '/classes',
            icon: <BookOutlined />,
            label: 'ថ្នាក់',
            onClick: () => router.push('/classes'),
          },
          {
            type: 'divider',
          },
          {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'ការកំណត់',
            onClick: () => router.push('/settings'),
          },
          {
            key: '/resources',
            icon: <FolderOutlined />,
            label: 'ធនធាន',
            onClick: () => router.push('/resources'),
          },
          {
            type: 'divider',
          },
          {
            key: '/administration',
            label: 'រដ្ឋបាលទាំងអស់',
            onClick: () => router.push('/administration'),
          },
        ],
      });
    }

    // Help - All users
    items.push({
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: 'ជំនួយ',
      onClick: () => router.push('/help'),
    });

    return items;
  };

  // User menu dropdown items
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      type: 'group',
      label: (
        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 4 }}>{session?.user?.name}</div>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>{session?.user?.email}</div>
          <div style={{ fontSize: '11px', color: token.colorTextTertiary, marginTop: 4 }}>
            {session?.user?.role === 'admin' && 'អ្នកគ្រប់គ្រង'}
            {session?.user?.role === 'teacher' && 'គ្រូបង្រៀន'}
            {session?.user?.role === 'mentor' && 'អ្នកណែនាំ'}
            {session?.user?.role === 'coordinator' && 'សម្របសម្រួល'}
            {session?.user?.role === 'viewer' && 'អ្នកមើល'}
          </div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'ប្រវត្តិរូបរបស់ខ្ញុំ',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'profile-setup',
      icon: <SettingOutlined />,
      label: 'កំណត់ប្រវត្តិរូប',
      onClick: () => router.push('/profile-setup'),
    },
    {
      key: 'change-password',
      icon: <SettingOutlined />,
      label: 'ផ្លាស់ពាក្យសម្ងាត់',
      onClick: () => router.push('/profile#password'),
    },
    {
      type: 'divider',
    },
    {
      key: 'onboarding',
      icon: <BookOutlined />,
      label: 'ណែនាំចាប់ផ្តើម',
      onClick: () => router.push('/onboarding'),
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'ជំនួយ & ការណែនាំ',
      onClick: () => router.push('/help'),
    },
    {
      key: 'about',
      icon: <GlobalOutlined />,
      label: 'អំពីគម្រោង',
      onClick: () => router.push('/about'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ចាកចេញ',
      danger: true,
      onClick: () => signOut({ callbackUrl: '/auth/login' }),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
        }}
        width={250}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          backgroundColor: '#fff',
        }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: collapsed ? 16 : 20,
              fontFamily: 'Hanuman, sans-serif',
              color: token.colorPrimary,
              fontWeight: 'bold',
            }}>
              {collapsed ? 'TaRL' : 'គម្រោង TaRL'}
            </h2>
          </Link>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[pathname]}
          defaultOpenKeys={['reports', 'administration']}
          items={getMenuItems()}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <Link 
              href="https://plp.moeys.gov.kh" 
              target="_blank"
              style={{ 
                color: token.colorTextSecondary,
                textDecoration: 'none',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              គម្រោង PLP
              <GlobalOutlined style={{ fontSize: 12 }} />
            </Link>
          </Space>

          <Space size={16}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ backgroundColor: token.colorPrimary }}
                  icon={<UserOutlined />}
                >
                  {session?.user?.name?.substring(0, 2).toUpperCase()}
                </Avatar>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{session?.user?.name}</div>
                  <div style={{ fontSize: 12, color: token.colorTextSecondary, textTransform: 'capitalize' }}>
                    {session?.user?.role === 'admin' && 'អ្នកគ្រប់គ្រង'}
                    {session?.user?.role === 'teacher' && 'គ្រូបង្រៀន'}
                    {session?.user?.role === 'mentor' && 'អ្នកណែនាំ'}
                    {session?.user?.role === 'coordinator' && 'សម្របសម្រួល'}
                    {session?.user?.role === 'viewer' && 'អ្នកមើល'}
                  </div>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}