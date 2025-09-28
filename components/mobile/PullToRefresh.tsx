'use client';

import React from 'react';
import { SyncOutlined } from '@ant-design/icons';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { isPulling, isRefreshing, pullDistance, pullPercentage } = usePullToRefresh({
    onRefresh,
  });

  return (
    <div className="relative">
      {/* Pull indicator */}
      <div
        className={`absolute top-0 left-0 right-0 flex justify-center transition-all duration-200 ${
          isPulling || isRefreshing ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translateY(${pullDistance - 60}px)`,
          height: '60px',
        }}
      >
        <div className="flex items-center justify-center">
          <div
            className={`rounded-full bg-white shadow-lg p-3 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${pullPercentage * 3.6}deg) scale(${
                0.5 + pullPercentage * 0.005
              })`,
              transition: isPulling ? 'none' : 'transform 0.2s',
            }}
          >
            <SyncOutlined 
              className={`text-2xl ${
                pullPercentage >= 100 ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          transform: isPulling || isRefreshing
            ? `translateY(${pullDistance}px)`
            : 'translateY(0)',
          transition: isPulling ? 'none' : 'transform 0.3s',
        }}
      >
        {children}
      </div>

      {/* Refresh status text */}
      {isRefreshing && (
        <div className="fixed top-20 left-0 right-0 flex justify-center pointer-events-none z-50">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
            <span className="text-sm font-medium">កំពុងផ្ទុកឡើងវិញ...</span>
          </div>
        </div>
      )}
    </div>
  );
}