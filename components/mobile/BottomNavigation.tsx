'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  BarChartOutlined,
  PlusCircleOutlined 
} from '@ant-design/icons';

interface NavItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
  labelKh: string;
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      key: 'home',
      path: '/',
      icon: <HomeOutlined />,
      label: 'Home',
      labelKh: 'ទំព័រដើម',
    },
    {
      key: 'students',
      path: '/students',
      icon: <UserOutlined />,
      label: 'Students',
      labelKh: 'សិស្ស',
    },
    {
      key: 'assessment',
      path: '/assessments/new',
      icon: <PlusCircleOutlined />,
      label: 'Assess',
      labelKh: 'វាយតម្លៃ',
    },
    {
      key: 'reports',
      path: '/reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      labelKh: 'របាយការណ៍',
    },
    {
      key: 'visits',
      path: '/mentoring-visits',
      icon: <FileTextOutlined />,
      label: 'Visits',
      labelKh: 'ទស្សនកិច្ច',
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Spacer to prevent content from being hidden behind navigation */}
      <div className="h-16 md:hidden" />
      
      {/* Bottom Navigation Bar - Only visible on mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50 safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.path || 
                           (item.path !== '/' && pathname.startsWith(item.path));
            
            return (
              <button
                key={item.key}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors ${
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-gray-500 active:text-gray-700'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className={`text-xl mb-1 ${
                  item.key === 'assessment' && !isActive ? 'text-2xl' : ''
                } ${
                  item.key === 'assessment' && isActive ? 'text-2xl text-blue-600' : ''
                }`}>
                  {item.icon}
                </span>
                <span className="text-xs font-medium truncate max-w-full">
                  {item.labelKh}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}