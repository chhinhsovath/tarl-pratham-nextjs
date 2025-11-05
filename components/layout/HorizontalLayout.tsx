'use client';

import React, { useState } from 'react';
import { Menu, Avatar, Dropdown, Button, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  UserOutlined,
  MenuOutlined,
  LogoutOutlined,
  SettingOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import OnboardingTour from '@/components/tour/OnboardingTour';

interface HorizontalLayoutProps {
  children: React.ReactNode;
}

export default function HorizontalLayout({ children }: HorizontalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  // Helper function to check role permissions
  const hasRole = (roles: string[]) => {
    return roles.includes(session?.user?.role || '');
  };

  const isCoordinator = () => hasRole(['coordinator']);

  // Build horizontal menu items based on user role - matching Laravel exactly
  const getMenuItems = (): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    // Dashboard - All except Coordinator
    if (!isCoordinator()) {
      items.push({
        key: '/dashboard',
        label: (
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            ផ្ទាំងគ្រប់គ្រង
          </Link>
        ),
      });
    }

    // Assessments - Admin, Teacher, Mentor, Viewer
    if (hasRole(['admin', 'teacher', 'mentor', 'viewer'])) {
      items.push({
        key: '/assessments',
        label: (
          <Link href="/assessments" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            ការវាយតម្លៃ
          </Link>
        ),
      });
    }

    // Verification - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/verification',
        label: (
          <Link href="/verification" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            ផ្ទៀងផ្ទាត់
          </Link>
        ),
      });
    }

    // Students - Admin/Coordinator (management), Teacher/Mentor (simple)
    if (hasRole(['admin', 'coordinator'])) {
      items.push({
        key: '/students-management',
        label: (
          <Link href="/students-management" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            សិស្ស
          </Link>
        ),
      });
    } else if (hasRole(['teacher', 'mentor'])) {
      items.push({
        key: '/students',
        label: (
          <Link href="/students" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            សិស្ស
          </Link>
        ),
      });
    }

    // Mentoring - Admin, Mentor
    if (hasRole(['admin', 'mentor'])) {
      items.push({
        key: '/mentoring',
        label: (
          <Link href="/mentoring" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            ការណែនាំ
          </Link>
        ),
      });
    }

    // Teacher Workspace - Mentor only
    if (hasRole(['mentor'])) {
      items.push({
        key: '/teacher/dashboard',
        label: (
          <Link href="/teacher/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            កន្លែងធ្វើការគ្រូ
          </Link>
        ),
      });
    }

    // Reports - All except Coordinator
    if (!isCoordinator()) {
      items.push({
        key: '/reports',
        label: (
          <Link href="/reports" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            របាយការណ៍
          </Link>
        ),
      });
    }

    // Coordinator Workspace - Admin, Coordinator
    if (hasRole(['admin', 'coordinator'])) {
      items.push({
        key: '/coordinator',
        label: (
          <Link href="/coordinator" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            កន្លែងធ្វើការសម្របសម្រួល
          </Link>
        ),
      });
    }

    // Administration - Admin only
    if (hasRole(['admin'])) {
      items.push({
        key: '/users',
        label: (
          <Link href="/users" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            រដ្ឋបាល
          </Link>
        ),
      });
    }

    // Help - All users
    items.push({
      key: '/help',
      label: (
        <Link href="/help" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
          ជំនួយ
        </Link>
      ),
    });

    return items;
  };

  // User menu dropdown items - matching Laravel
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      type: 'group',
      label: (
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
          <div className="text-xs text-gray-500">{session?.user?.email}</div>
          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
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
      onClick: () => router.push('/profile/edit'),
    },
    {
      key: 'change-password',
      icon: <SettingOutlined />,
      label: 'ផ្លាស់ពាក្យសម្ងាត់',
      onClick: () => router.push('/profile/edit#password-update'),
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

  // Get current page name for active state
  const getCurrentPageClass = (path: string) => {
    return pathname === path 
      ? 'border-indigo-400 text-gray-900 border-b-2' 
      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Header Navigation - Professional Design */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="horizontal-layout-content">
          <div className="flex justify-between items-center h-16 px-4 md:px-6">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/dashboard" className="flex items-center group">
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 group">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md"></div>
                    <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                      <span className="text-white font-black text-sm">ត</span>
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <h1
                      className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200"
                      style={{ fontFamily: 'Hanuman, sans-serif', letterSpacing: '0.05em' }}
                    >
                      គម្រោង TaRL
                    </h1>
                    <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Hanuman, sans-serif' }}>
                      Pratham
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1">
              {getMenuItems().map((item: any) => {
                const isActive = pathname === item.key;
                return (
                  <div key={item.key} className="relative group">
                    {React.cloneElement(item.label, {
                      className: `inline-flex items-center px-3 lg:px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ease-in-out ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 shadow-sm'
                          : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'
                      }`
                    })}
                    {isActive && (
                      <div className="absolute inset-x-2 bottom-0 h-0.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-full shadow-md"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right side - User menu */}
            <div className="flex items-center space-x-2 md:space-x-3">

              {/* User Dropdown */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                overlayStyle={{ zIndex: 1050, minWidth: '300px' }}
                overlayClassName="user-dropdown-menu professional-dropdown"
              >
                <button className="flex items-center space-x-2 md:space-x-3 px-2.5 py-1.5 md:px-3.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group active:scale-95">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 blur transition-opacity duration-200"></div>
                    <Avatar
                      size={40}
                      className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 font-black text-white shadow-lg group-hover:shadow-xl transition-shadow duration-200 border-2 border-white"
                      icon={<UserOutlined />}
                    >
                      {session?.user?.name?.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-md animate-pulse"></div>
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: 'Hanuman, sans-serif' }}>
                      {session?.user?.name}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold" style={{ fontFamily: 'Hanuman, sans-serif' }}>
                      {session?.user?.role === 'admin' && 'អ្នកគ្រប់គ្រង'}
                      {session?.user?.role === 'teacher' && 'គ្រូបង្រៀន'}
                      {session?.user?.role === 'mentor' && 'អ្នកណែនាំ'}
                      {session?.user?.role === 'coordinator' && 'សម្របសម្រួល'}
                      {session?.user?.role === 'viewer' && 'អ្នកមើល'}
                    </div>
                  </div>
                </button>
              </Dropdown>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu - Slide Down */}
        {mobileMenuOpen && (
          <div
            className="md:hidden bg-white border-t border-gray-200 shadow-xl animate-in slide-in-from-top-2 duration-200"
            style={{
              position: 'fixed',
              top: '64px',
              left: 0,
              right: 0,
              zIndex: 1000,
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'auto'
            }}
          >
            <div className="px-2 py-3 space-y-1">
              {getMenuItems().map((item: any) => {
                const isActive = pathname === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.key}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 relative ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 border-l-4 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent'
                    }`}
                    style={{ fontFamily: 'Hanuman, sans-serif' }}
                  >
                    {item.label.props.children}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Backdrop overlay when menu is open */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50"
            style={{ zIndex: 999, top: '64px' }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </nav>

      {/* Main Content Area */}
      <main className="py-6">
        <div className="horizontal-layout-content">
          {children}
        </div>
      </main>

      {/* Onboarding Tour - Disabled */}
      {/* <OnboardingTour page="navigation" autoStart={false} showStartButton={true} /> */}
    </div>
  );
}