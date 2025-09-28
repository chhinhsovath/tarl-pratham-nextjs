'use client';

// Suppress specific Ant Design React 19 compatibility warnings
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.warn = (...args) => {
    // Filter out Ant Design v5 React 19 compatibility warnings
    const message = args[0]?.toString() || '';
    if (
      message.includes('[antd: compatible]') ||
      message.includes('[antd: message]') ||
      message.includes('[antd: Dropdown]') ||
      message.includes('[antd: Card]') ||
      message.includes('https://u.ant.design/v5-for-19') ||
      message.includes('antd v5 support React is 16 ~ 18')
    ) {
      return; // Suppress these specific warnings
    }
    // Let other warnings through
    originalWarn.apply(console, args);
  };

  // Also suppress similar errors
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('[antd: compatible]') ||
      message.includes('https://u.ant.design/v5-for-19')
    ) {
      return; // Suppress these specific errors
    }
    // Let other errors through
    originalError.apply(console, args);
  };
}

export {};