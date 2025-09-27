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
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}