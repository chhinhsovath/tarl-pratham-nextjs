'use client';

import { useEffect, useState } from 'react';
import { message } from 'antd';

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  message.info('កំណែថ្មីអាចប្រើបាន។ សូមផ្ទុកទំព័រឡើងវិញ។');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
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
      navigator.storage.persist().then((granted) => {
        if (granted) {
          console.log('Persistent storage granted');
        }
      });
    }

    // Handle visibility change for background sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && navigator.onLine) {
        // Trigger background sync when app becomes visible
        if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
          navigator.serviceWorker.ready.then((registration) => {
            return registration.sync.register('sync-assessments');
          });
        }
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt, isInstallable]);

  return <>{children}</>;
}