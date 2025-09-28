'use client';

import { useEffect } from 'react';

export default function WarningSuppressor({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Suppress Ant Design React 19 warnings on client side
    const originalWarn = console.warn;
    const originalError = console.error;
    
    const shouldSuppress = (message: any): boolean => {
      if (!message) return false;
      const msgStr = typeof message === 'string' ? message : message.toString();
      
      return (
        msgStr.includes('[antd: compatible]') ||
        msgStr.includes('[antd: message]') ||
        msgStr.includes('[antd: Dropdown]') ||
        msgStr.includes('[antd: Card]') ||
        msgStr.includes('[antd: Modal]') ||
        msgStr.includes('[antd: notification]') ||
        msgStr.includes('antd v5 support React is') ||
        msgStr.includes('u.ant.design/v5-for-19') ||
        msgStr.includes('Static function can not consume context') ||
        msgStr.includes('deprecated') && msgStr.includes('antd') ||
        msgStr.includes('borderless') && msgStr.includes('variant')
      );
    };
    
    console.warn = function(...args: any[]) {
      if (args.some(arg => shouldSuppress(arg))) {
        return;
      }
      originalWarn.apply(console, args);
    };

    console.error = function(...args: any[]) {
      if (args.some(arg => shouldSuppress(arg))) {
        return;
      }
      originalError.apply(console, args);
    };

    // Cleanup on unmount
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, []);

  return <>{children}</>;
}