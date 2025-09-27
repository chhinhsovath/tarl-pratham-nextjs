'use client';

import React from 'react';
import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div style={{ 
      padding: '24px', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <Result
        status="403"
        title="403 - Unauthorized Access"
        subTitle={
          session?.user ? 
            "Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is an error." :
            "Please log in to access this page."
        }
        extra={
          <div style={{ textAlign: 'center' }}>
            <Button 
              type="primary" 
              onClick={() => router.push('/dashboard')}
              style={{ marginRight: 8 }}
            >
              Go to Dashboard
            </Button>
            <Button onClick={() => router.back()}>
              Go Back
            </Button>
          </div>
        }
      />
    </div>
  );
}