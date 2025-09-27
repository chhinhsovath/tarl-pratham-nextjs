'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useSession } from 'next-auth/react';
import StudentForm from '@/components/forms/StudentForm';
import { hasPermission } from '@/lib/permissions';

export default function CreateStudentPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  // Check permissions
  if (!hasPermission(user, 'students.create')) {
    router.push('/unauthorized');
    return null;
  }

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || '',
          'pilot-school-id': user?.pilot_school_id?.toString() || ''
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || 'Student created successfully');
        
        if (user?.role === 'mentor') {
          message.info('Note: This student will be automatically deleted after 48 hours unless permanently saved by an admin or teacher.');
        }
        
        router.push('/students');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to create student');
      }
    } catch (error) {
      console.error('Create student error:', error);
      message.error('Failed to create student');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <StudentForm 
        mode="create" 
        onSubmit={handleSubmit}
        userRole={user?.role}
        pilotSchoolId={user?.pilot_school_id}
      />
    </div>
  );
}