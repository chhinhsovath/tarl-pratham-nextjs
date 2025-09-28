'use client';

import { WifiOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to home page when back online
      window.location.href = '/';
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <WifiOutlined className="text-6xl text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          អ្នកកំពុងនៅក្រៅបណ្តាញ
        </h1>
        <p className="text-gray-600 mb-6">
          សូមពិនិត្យមើលការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។ 
          អ្នកនៅតែអាចមើលទិន្នន័យដែលបានរក្សាទុកក្នុងមូលដ្ឋាន។
        </p>
        
        {isOnline ? (
          <div className="text-green-600">
            <p>ការតភ្ជាប់បានស្តារឡើងវិញ!</p>
            <Button 
              type="primary" 
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              ផ្ទុកឡើងវិញ
            </Button>
          </div>
        ) : (
          <div>
            <Button 
              onClick={() => window.location.reload()}
              className="mr-2"
            >
              ព្យាយាមម្តងទៀត
            </Button>
            <Button 
              type="primary"
              onClick={() => window.history.back()}
            >
              ត្រឡប់ក្រោយ
            </Button>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">
            មុខងារដែលអាចប្រើបាននៅពេលគ្មានអ៊ីនធឺណិត:
          </h2>
          <ul className="text-left text-sm text-blue-800 space-y-1">
            <li>• មើលបញ្ជីសិស្សដែលបានរក្សាទុក</li>
            <li>• បញ្ចូលការវាយតម្លៃថ្មី (នឹងធ្វើសមកាលកម្មនៅពេលមានអ៊ីនធឺណិត)</li>
            <li>• មើលរបាយការណ៍ដែលបានទាញយក</li>
            <li>• ប្រើប្រាស់មុខងារគណនា</li>
          </ul>
        </div>
      </div>
    </div>
  );
}