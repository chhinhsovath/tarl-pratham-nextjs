'use client';

// Suppress specific Ant Design React 19 compatibility warnings
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;
  
  // Helper function to check if message should be suppressed
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
      msgStr.includes('deprecated') && msgStr.includes('antd')
    );
  };
  
  console.warn = function(...args: any[]) {
    // Check all arguments for suppression patterns
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress the warning
    }
    originalWarn.apply(console, args);
  };

  console.error = function(...args: any[]) {
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress the error
    }
    originalError.apply(console, args);
  };

  // Some libraries might use console.log for warnings
  console.log = function(...args: any[]) {
    if (args.some(arg => shouldSuppress(arg))) {
      return; // Suppress the log
    }
    originalLog.apply(console, args);
  };
}

export {};