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

    // Students - Admin, Teacher, Mentor
    if (hasRole(['admin', 'teacher', 'mentor'])) {
      items.push({
        key: '/students',
        label: (
          <Link href="/students" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
            និស្សិត
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
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Header Navigation */}
      <nav className="bg-white shadow h-16">
        <div className="horizontal-layout-content">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <h1 className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Hanuman, sans-serif' }}>
                  គម្រោង TaRL
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {getMenuItems().map((item: any) => (
                <div key={item.key}>
                  {React.cloneElement(item.label, {
                    className: `${getCurrentPageClass(item.key)} inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-150 ease-in-out`
                  })}
                </div>
              ))}
            </div>

            {/* Right side - User menu and external link */}
            <div className="flex items-center space-x-4">
              {/* External PLP Link */}
              <Link 
                href="https://plp.moeys.gov.kh" 
                target="_blank"
                className="hidden lg:flex text-sm text-gray-500 hover:text-gray-700 items-center space-x-1"
              >
                <span>គម្រោង PLP</span>
                <GlobalOutlined className="w-3 h-3" />
              </Link>

              {/* User Dropdown */}
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                overlayStyle={{ zIndex: 1050, minWidth: '320px' }}
                overlayClassName="user-dropdown-menu"
              >
                <button className="flex items-center space-x-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md p-2">
                  <Avatar 
                    size={32}
                    className="bg-indigo-600"
                    icon={<UserOutlined />}
                  >
                    {session?.user?.name?.substring(0, 2).toUpperCase()}
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <div className="text-sm font-medium text-gray-900">{session?.user?.name}</div>
                    <div className="text-xs text-gray-500">
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
                  className="text-gray-500 hover:text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 pt-3 pb-4 space-y-2">
              {getMenuItems().map((item: any) => (
                <Link
                  key={item.key}
                  href={item.key}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    pathname === item.key
                      ? 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                  }`}
                  style={{ fontFamily: 'Hanuman, sans-serif' }}
                >
                  {item.label.props.children}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="py-6">
        <div className="horizontal-layout-content">
          {children}
        </div>
      </main>

      {/* Onboarding Tour */}
      <OnboardingTour page="navigation" autoStart={false} showStartButton={true} />
    </div>
  );
}