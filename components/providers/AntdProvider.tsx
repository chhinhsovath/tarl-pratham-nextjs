'use client';

import { ConfigProvider } from 'antd';
import { ReactNode } from 'react';

// Suppress Ant Design React 19 compatibility warning
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (args[0]?.includes?.('[antd: compatible]')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export default function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          // Apply Khmer fonts to all Ant Design components
          fontFamily: "'Hanuman', 'Khmer OS', 'Moul', sans-serif",
          fontSize: 16,
          lineHeight: 1.6,
        },
        components: {
          Typography: {
            fontFamily: "'Hanuman', 'Khmer OS', 'Moul', sans-serif",
          },
          Button: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Input: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Select: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Table: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Menu: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Card: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Modal: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Form: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Alert: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Message: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
          Notification: {
            fontFamily: "'Hanuman', 'Khmer OS', sans-serif",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}