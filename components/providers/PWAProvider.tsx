'use client';

import { useEffect, useState } from 'react';
import { message } from 'antd';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // UNREGISTER ALL SERVICE WORKERS - DISABLED FOR DEVELOPMENT
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          console.log('🗑️ Unregistering Service Worker:', registration);
          registration.unregister();
        });
      });

      // Clear all caches
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            console.log('🗑️ Deleting cache:', cacheName);
            caches.delete(cacheName);
          });
        });
      }

      console.log('✅ All Service Workers and caches cleared');
    }

    // Handle PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      
      // Show install suggestion after 30 seconds
      setTimeout(() => {
        if (isInstallable) {
          message.info({
            content: (
              <div>
                <p>ដំឡើងកម្មវិធីនេះលើទូរស័ព្ទរបស់អ្នក</p>
                <button
                  onClick={() => promptInstall()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  ដំឡើងឥឡូវនេះ
                </button>
              </div>
            ),
            duration: 10,
          });
        }
      }, 30000);
    };

    const promptInstall = async () => {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        message.success('កម្មវិធីបានដំឡើងដោយជោគជ័យ!');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA installed successfully');
      message.success('កម្មវិធីបានដំឡើងដោយជោគជ័យ!');
    });

    // Request persistent storage
    if ('storage' in navigator && 'persist' in navigator.storage) {
      navigator.storage.persist()
        .then((granted) => {
          if (granted) {
            console.log('Persistent storage granted');
          }
        })
        .catch((error) => {
          console.log('Persistent storage request failed:', error);
        });
    }

    // Handle visibility change for background sync
    const handleVisibilityChange = () => {
      if (!document.hidden && navigator.onLine) {
        // Trigger background sync when app becomes visible
        if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready
            .then((registration) => {
              return registration.sync.register('sync-assessments');
            })
            .catch((error) => {
              console.log('Background sync registration failed:', error);
            });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [deferredPrompt, isInstallable]);

  return <>{children}</>;
}