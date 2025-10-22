'use client';

import { useEffect } from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="ទំព័រដែល​អ្នក​កំពុង​ស្វែង​រក​ មិន​ទាន់​មាន​នៅ​ឡើយ​ទេ។"
      extra={
        <Button 
          type="primary" 
          onClick={() => router.push('/')}
        >
          ត្រឡប់ទៅទំព័រដើម
        </Button>
      }
    />
  );
}