'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, theme, Button, Drawer } from 'antd';
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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { token } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    }

    // Assessments - Admin, Teacher, Viewer (Mentors use Verification instead)
    if (hasRole(['admin', 'teacher', 'viewer'])) {
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
          ...(hasRole(['admin']) ? [{
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
        key: '/assessments/verify',
        icon: <CheckCircleOutlined />,
        label: 'ផ្ទៀងផ្ទាត់',
        onClick: () => router.push('/assessments/verify'),
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
            label: 'រដ្ឋបាល',
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
        <div style={{ 
          padding: '8px 12px',
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 0,
        }}>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: 600, 
            marginBottom: 1,
            lineHeight: 1.2,
          }}>
            {session?.user?.name}
          </div>
          <div style={{ 
            fontSize: '11px', 
            color: token.colorTextSecondary,
            marginBottom: 2,
            lineHeight: 1.1,
          }}>
            {session?.user?.email}
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: token.colorTextTertiary,
            backgroundColor: token.colorFillQuaternary,
            padding: '1px 4px',
            borderRadius: 2,
            display: 'inline-block',
            lineHeight: 1.2,
          }}>
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
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          ប្រវត្តិរូបរបស់ខ្ញុំ
        </span>
      ),
      onClick: () => router.push('/profile/edit'),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
    {
      key: 'change-password',
      icon: <SettingOutlined />,
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          ផ្លាស់ពាក្យសម្ងាត់
        </span>
      ),
      onClick: () => router.push('/profile/edit#password-update'),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'onboarding',
      icon: <BookOutlined />,
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          ណែនាំចាប់ផ្តើម
        </span>
      ),
      onClick: () => router.push('/onboarding'),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          ជំនួយ & ការណែនាំ
        </span>
      ),
      onClick: () => router.push('/help'),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
    {
      key: 'about',
      icon: <GlobalOutlined />,
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          អំពីគម្រោង
        </span>
      ),
      onClick: () => router.push('/about'),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: (
        <span style={{ 
          padding: isMobile ? '8px 0' : '4px 0',
          fontSize: isMobile ? '15px' : '14px',
          lineHeight: 1.4,
        }}>
          ចាកចេញ
        </span>
      ),
      danger: true,
      onClick: () => signOut({ callbackUrl: '/auth/login' }),
      style: { 
        minHeight: isMobile ? 48 : 36,
        padding: isMobile ? '12px 16px' : '8px 12px',
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title={
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <h2 style={{ 
                margin: 0, 
                fontSize: 18,
                fontFamily: 'Hanuman, sans-serif',
                color: token.colorPrimary,
                fontWeight: 'bold',
              }}>
                គម្រោង TaRL
              </h2>
            </Link>
          }
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{ body: { padding: 0 } }}
          width={280}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={['reports', 'administration']}
            items={getMenuItems()}
            style={{ borderRight: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        </Drawer>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
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
      )}
      
      <Layout style={{ 
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 250), 
        transition: 'all 0.2s',
      }}>
        <Header
          style={{
            padding: isMobile ? '0 16px' : '0 24px',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            height: isMobile ? 56 : 64,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={isMobile ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={() => isMobile ? setMobileMenuOpen(true) : setCollapsed(!collapsed)}
              style={{ 
                fontSize: isMobile ? 18 : 16,
                padding: isMobile ? '8px' : '4px 8px',
              }}
            />
            {!isMobile && (
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
            )}
          </Space>

          <Space size={isMobile ? 8 : 16}>
            <Dropdown 
              menu={{ items: userMenuItems }} 
              placement="bottomRight"
              overlayStyle={{
                minWidth: isMobile ? 280 : 240,
              }}
            >
              <Space style={{ 
                cursor: 'pointer',
                padding: isMobile ? '4px 8px' : '0',
                borderRadius: 6,
              }}>
                <Avatar 
                  size={isMobile ? 36 : 32}
                  style={{ backgroundColor: token.colorPrimary }}
                  icon={<UserOutlined />}
                >
                  {session?.user?.name?.substring(0, 2).toUpperCase()}
                </Avatar>
                {!isMobile && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{session?.user?.name}</div>
                    <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                      {session?.user?.role === 'admin' && 'អ្នកគ្រប់គ្រង'}
                      {session?.user?.role === 'teacher' && 'គ្រូបង្រៀន'}
                      {session?.user?.role === 'mentor' && 'អ្នកណែនាំ'}
                      {session?.user?.role === 'coordinator' && 'សម្របសម្រួល'}
                      {session?.user?.role === 'viewer' && 'អ្នកមើល'}
                    </div>
                  </div>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: isMobile ? 16 : 24,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            padding: isMobile ? 16 : 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}