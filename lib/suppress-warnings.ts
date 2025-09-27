'use client';

// Suppress specific Ant Design React 19 compatibility warnings
if (typeof window !== 'undefined' && typeof console !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Filter out Ant Design v5 React 19 compatibility warnings
    if (
      args[0] && 
      typeof args[0] === 'string' && 
      args[0].includes('[antd: compatible]') && 
      args[0].includes('antd v5 support React is 16 ~ 18')
    ) {
      return; // Suppress this specific warning
    }
    // Let other warnings through
    originalWarn.apply(console, args);
  };
}

export {};