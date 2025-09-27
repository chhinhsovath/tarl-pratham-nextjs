'use client';

import React, { useState } from 'react';
import { Layout, Drawer, Button, Menu, Avatar, Space, Badge, ConfigProvider } from 'antd';
import {
  MenuOutlined,
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LogoutOutlined,
  BellOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  SolutionOutlined,
  AppstoreOutlined,
  SafetyOutlined,
  QuestionCircleOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import kmTranslations from '@/lib/translations/km';

const { Header, Content } = Layout;

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function MobileLayout({ children, title, showBack = false }: MobileLayoutProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Helper function to check role permissions
  const hasRole = (roles: string[]) => {
    return roles.includes(session?.user?.role || '');
  };

  // Build mobile menu items
  const getMobileMenuItems = () => {
    const items: any[] = [];

    // Dashboard
    if (!hasRole(['coordinator'])) {
      items.push({
        key: '/dashboard',
        icon: <DashboardOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.dashboard}</span>
            <span className="text-xs text-gray-500">Dashboard</span>
          </div>
        ),
        onClick: () => {
          router.push('/dashboard');
          setDrawerVisible(false);
        },
      });
    }

    // Assessments
    if (hasRole(['admin', 'teacher', 'mentor', 'viewer'])) {
      items.push({
        key: '/assessments',
        icon: <FileTextOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.assessments}</span>
            <span className="text-xs text-gray-500">Assessments</span>
          </div>
        ),
        onClick: () => {
          router.push('/assessments');
          setDrawerVisible(false);
        },
      });
    }

    // Students
    if (hasRole(['admin', 'teacher', 'mentor'])) {
      items.push({
        key: '/students',
        icon: <TeamOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.students}</span>
            <span className="text-xs text-gray-500">Students</span>
          </div>
        ),
        onClick: () => {
          router.push('/students');
          setDrawerVisible(false);
        },
      });
    }

    // Verification - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/verification',
        icon: <CheckCircleOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.verification}</span>
            <span className="text-xs text-gray-500">Verification</span>
          </div>
        ),
        onClick: () => {
          router.push('/verification');
          setDrawerVisible(false);
        },
      });
    }

    // Mentoring - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/mentoring',
        icon: <SolutionOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.mentoring}</span>
            <span className="text-xs text-gray-500">Mentoring</span>
          </div>
        ),
        onClick: () => {
          router.push('/mentoring');
          setDrawerVisible(false);
        },
      });
    }

    // Reports
    if (!hasRole(['coordinator'])) {
      items.push({
        key: '/reports',
        icon: <BarChartOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.reports}</span>
            <span className="text-xs text-gray-500">Reports</span>
          </div>
        ),
        onClick: () => {
          router.push('/reports');
          setDrawerVisible(false);
        },
      });
    }

    // Coordinator Workspace
    if (hasRole(['admin', 'coordinator'])) {
      items.push({
        key: '/coordinator',
        icon: <AppstoreOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.coordinatorWorkspace}</span>
            <span className="text-xs text-gray-500">Coordinator</span>
          </div>
        ),
        onClick: () => {
          router.push('/coordinator/workspace');
          setDrawerVisible(false);
        },
      });
    }

    // Administration - Admin only
    if (hasRole(['admin'])) {
      items.push({
        key: '/administration',
        icon: <SafetyOutlined style={{ fontSize: 20 }} />,
        label: (
          <div className="flex flex-col">
            <span className="text-base font-khmer">{kmTranslations.menu.administration}</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
        ),
        onClick: () => {
          router.push('/administration');
          setDrawerVisible(false);
        },
      });
    }

    // Divider
    items.push({ type: 'divider' });

    // Settings
    items.push({
      key: '/settings',
      icon: <SettingOutlined style={{ fontSize: 20 }} />,
      label: (
        <div className="flex flex-col">
          <span className="text-base font-khmer">{kmTranslations.menu.settings}</span>
          <span className="text-xs text-gray-500">Settings</span>
        </div>
      ),
      onClick: () => {
        router.push('/profile');
        setDrawerVisible(false);
      },
    });

    // Help
    items.push({
      key: '/help',
      icon: <QuestionCircleOutlined style={{ fontSize: 20 }} />,
      label: (
        <div className="flex flex-col">
          <span className="text-base font-khmer">{kmTranslations.menu.help}</span>
          <span className="text-xs text-gray-500">Help</span>
        </div>
      ),
      onClick: () => {
        router.push('/help');
        setDrawerVisible(false);
      },
    });

    // Sign Out
    items.push({
      key: 'logout',
      icon: <LogoutOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />,
      label: (
        <div className="flex flex-col">
          <span className="text-base font-khmer text-red-500">{kmTranslations.userMenu.signOut}</span>
          <span className="text-xs text-red-400">Sign Out</span>
        </div>
      ),
      onClick: () => {
        signOut({ callbackUrl: '/auth/login' });
        setDrawerVisible(false);
      },
    });

    return items;
  };

  const getRoleLabel = (role?: string) => {
    switch(role) {
      case 'admin': return kmTranslations.roles.admin;
      case 'teacher': return kmTranslations.roles.teacher;
      case 'mentor': return kmTranslations.roles.mentor;
      case 'coordinator': return kmTranslations.roles.coordinator;
      case 'viewer': return kmTranslations.roles.viewer;
      default: return '';
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Hanuman", "Khmer OS", sans-serif',
          fontSize: 16,
          borderRadius: 8,
          colorPrimary: '#1890ff',
        },
        components: {
          Button: {
            controlHeight: 48,
            fontSize: 16,
            borderRadius: 8,
          },
          Input: {
            controlHeight: 48,
            fontSize: 16,
            borderRadius: 8,
          },
          Select: {
            controlHeight: 48,
          },
          DatePicker: {
            controlHeight: 48,
          },
          Card: {
            borderRadius: 12,
            paddingLG: 16,
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <Header className="bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed w-full z-50 h-16">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.back()}
                className="p-0"
              />
            ) : (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
                className="p-0"
                style={{ fontSize: 20 }}
              />
            )}
            
            <div>
              <h1 className="text-lg font-bold font-khmer text-gray-900 m-0">
                {title || kmTranslations.appName}
              </h1>
              {!title && (
                <p className="text-xs text-gray-500 m-0">
                  {kmTranslations.appFullName}
                </p>
              )}
            </div>
          </div>

          <Space size={12}>
            <Badge count={5} size="small">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 20 }} />}
                className="p-0"
              />
            </Badge>
            <Avatar 
              size={32}
              style={{ backgroundColor: '#1890ff' }}
              icon={<UserOutlined />}
            >
              {session?.user?.name?.substring(0, 1).toUpperCase()}
            </Avatar>
          </Space>
        </Header>

        {/* Mobile Drawer Menu */}
        <Drawer
          title={
            <div className="py-4">
              <div className="flex items-center gap-3 mb-4">
                <Avatar 
                  size={48}
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                >
                  {session?.user?.name?.substring(0, 2).toUpperCase()}
                </Avatar>
                <div>
                  <div className="font-bold text-base">{session?.user?.name}</div>
                  <div className="text-xs text-gray-500">{getRoleLabel(session?.user?.role)}</div>
                  <div className="text-xs text-gray-400">{session?.user?.email}</div>
                </div>
              </div>
            </div>
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={300}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={getMobileMenuItems()}
            style={{ border: 0 }}
            className="mobile-menu"
          />
        </Drawer>

        {/* Content Area */}
        <Content className="mt-16 min-h-screen">
          <div className="p-4 pb-20">
            {children}
          </div>
        </Content>

        {/* Bottom Navigation for Quick Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around z-40">
          <Button
            type="text"
            icon={<DashboardOutlined style={{ fontSize: 24 }} />}
            className="flex flex-col items-center p-0 h-auto"
            onClick={() => router.push('/dashboard')}
          >
            <span className="text-xs mt-1 font-khmer">
              {pathname === '/dashboard' ? 
                <span className="text-blue-500">{kmTranslations.menu.dashboard}</span> : 
                kmTranslations.menu.dashboard
              }
            </span>
          </Button>
          
          <Button
            type="text"
            icon={<FileTextOutlined style={{ fontSize: 24 }} />}
            className="flex flex-col items-center p-0 h-auto"
            onClick={() => router.push('/assessments')}
          >
            <span className="text-xs mt-1 font-khmer">
              {pathname === '/assessments' ? 
                <span className="text-blue-500">{kmTranslations.menu.assessments}</span> : 
                kmTranslations.menu.assessments
              }
            </span>
          </Button>
          
          <Button
            type="text"
            icon={<TeamOutlined style={{ fontSize: 24 }} />}
            className="flex flex-col items-center p-0 h-auto"
            onClick={() => router.push('/students')}
          >
            <span className="text-xs mt-1 font-khmer">
              {pathname === '/students' ? 
                <span className="text-blue-500">{kmTranslations.menu.students}</span> : 
                kmTranslations.menu.students
              }
            </span>
          </Button>
          
          <Button
            type="text"
            icon={<BarChartOutlined style={{ fontSize: 24 }} />}
            className="flex flex-col items-center p-0 h-auto"
            onClick={() => router.push('/reports')}
          >
            <span className="text-xs mt-1 font-khmer">
              {pathname === '/reports' ? 
                <span className="text-blue-500">{kmTranslations.menu.reports}</span> : 
                kmTranslations.menu.reports
              }
            </span>
          </Button>
        </div>

        {/* Custom Styles for Mobile */}
        <style jsx global>{`
          .font-khmer {
            font-family: 'Hanuman', 'Khmer OS', sans-serif !important;
          }
          
          .mobile-menu .ant-menu-item {
            height: auto !important;
            line-height: 1.5 !important;
            padding: 12px 16px !important;
          }
          
          .ant-drawer-title {
            padding: 0 !important;
          }
          
          /* Touch-friendly tap targets */
          button, a, .ant-menu-item {
            min-height: 44px;
            min-width: 44px;
          }
          
          /* Improve text readability */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Prevent zoom on input focus */
          input, select, textarea {
            font-size: 16px !important;
          }
          
          /* Safe area for iOS devices */
          @supports (padding: max(0px)) {
            .ant-layout-header {
              padding-top: max(0px, env(safe-area-inset-top));
            }
            
            .fixed.bottom-0 {
              padding-bottom: max(0px, env(safe-area-inset-bottom));
            }
          }
        `}</style>
      </Layout>
    </ConfigProvider>
  );
}