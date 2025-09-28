'use client';

import React, { useEffect, useState } from 'react';
import { WifiOutlined, SyncOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { offlineStorage } from '@/lib/offline-storage';

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);
    setShowIndicator(!navigator.onLine);

    // Check for pending items
    checkPendingItems();

    const handleOnline = async () => {
      setIsOnline(true);
      setShowIndicator(true);
      
      // Auto-sync when back online
      await syncData();
      
      // Hide indicator after 3 seconds if sync successful
      setTimeout(() => {
        if (syncStatus === 'success') {
          setShowIndicator(false);
        }
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'SYNC_COMPLETE') {
          setSyncStatus('success');
          checkPendingItems();
        }
      });
    }

    // Check pending items periodically when offline
    const interval = setInterval(() => {
      if (!navigator.onLine) {
        checkPendingItems();
      }
    }, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkPendingItems = async () => {
    try {
      const items = await offlineStorage.getQueuedItems();
      setPendingCount(items.length);
    } catch (error) {
      console.error('Error checking pending items:', error);
    }
  };

  const syncData = async () => {
    setSyncStatus('syncing');
    try {
      const result = await offlineStorage.syncOfflineData();
      if (result.failed === 0) {
        setSyncStatus('success');
        setPendingCount(0);
      } else {
        setSyncStatus('error');
        setPendingCount(result.failed);
      }
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync failed:', error);
    }
  };

  if (!showIndicator) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isOnline ? 'bg-green-500' : 'bg-orange-500'
    }`}>
      <div className="flex items-center justify-between px-4 py-2 text-white text-sm">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              {syncStatus === 'syncing' && (
                <>
                  <SyncOutlined className="animate-spin" />
                  <span>កំពុងធ្វើសមកាលកម្ម...</span>
                </>
              )}
              {syncStatus === 'success' && (
                <>
                  <CheckCircleOutlined />
                  <span>ទិន្នន័យបានធ្វើសមកាលកម្ម</span>
                </>
              )}
              {syncStatus === 'error' && (
                <>
                  <ExclamationCircleOutlined />
                  <span>សមកាលកម្មមានបញ្ហា</span>
                </>
              )}
              {syncStatus === 'idle' && (
                <>
                  <WifiOutlined />
                  <span>តភ្ជាប់អ៊ីនធឺណិត</span>
                </>
              )}
            </>
          ) : (
            <>
              <WifiOutlined className="line-through" />
              <span>កំពុងដំណើរការក្រៅបណ្តាញ</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
              {pendingCount} រង់ចាំ
            </span>
          )}
          
          {isOnline && syncStatus === 'error' && (
            <button
              onClick={syncData}
              className="bg-white/20 px-3 py-1 rounded-full text-xs hover:bg-white/30 transition-colors"
            >
              ព្យាយាមម្តងទៀត
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for syncing */}
      {syncStatus === 'syncing' && (
        <div className="h-1 bg-white/20">
          <div className="h-full bg-white animate-pulse" style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
}