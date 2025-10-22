'use client';

import React, { useMemo } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { AntdRegistry as OfficialAntdRegistry } from '@ant-design/nextjs-registry';

// Client-side component: Create fresh cache per component mount to ensure proper style extraction
export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  // Memoize cache creation to avoid unnecessary recreations
  const cache = useMemo(() => createCache(), []);

  return (
    <StyleProvider cache={cache}>
      <OfficialAntdRegistry>
        {children}
      </OfficialAntdRegistry>
    </StyleProvider>
  );
}

// Server-side style provider: Extract all Ant Design styles at build time
// This prevents Flash of Unstyled Content (FOUC)
let serverCache: any = null;

export function AntdStyleProvider({ children }: { children: React.ReactNode }) {
  // Initialize cache only once on server
  if (!serverCache) {
    serverCache = createCache();
  }

  return (
    <>
      <style
        id="antd-style"
        dangerouslySetInnerHTML={{ __html: extractStyle(serverCache, true) }}
      />
      {children}
    </>
  );
}
