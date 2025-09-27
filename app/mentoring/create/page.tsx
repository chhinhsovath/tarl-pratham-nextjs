'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useSession } from 'next-auth/react';
import MentoringVisitForm from '@/components/forms/MentoringVisitForm';
import { hasPermission } from '@/lib/permissions';

export default function CreateMentoringVisitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Check permissions
  if (!hasPermission(user, 'mentoring.create')) {
    router.push('/unauthorized');
    return null;
  }

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/mentoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'Mentoring visit scheduled successfully');
        router.push('/mentoring');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to schedule visit');
      }
    } catch (error) {
      console.error('Create visit error:', error);
      message.error('Failed to schedule visit');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <MentoringVisitForm 
        mode="create" 
        onSubmit={handleSubmit}
      />
    </div>
  );
}