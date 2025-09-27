'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BypassPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Force update session to bypass profile setup
    fetch('/api/auth/session', {
      method: 'GET',
    }).then(() => {
      router.push('/dashboard');
    });
  }, [router]);

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Bypassing profile setup...</h2>
    </div>
  );
}