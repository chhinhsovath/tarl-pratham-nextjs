'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { message, Typography } from 'antd';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ComprehensiveMentoringForm from '@/components/forms/ComprehensiveMentoringForm';
const { Title } = Typography;

export default function CreateMentoringVisitPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

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
        message.success(data.message || 'ការចុះអប់រំបានកំណត់ដោយជោគជ័យ');
        router.push('/mentoring');
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចកំណត់ការចុះអប់រំ');
      }
    } catch (error) {
      console.error('Create visit error:', error);
      message.error('មិនអាចកំណត់ការចុះអប់រំ');
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Title level={2} style={{ marginBottom: 24, fontFamily: 'Hanuman, sans-serif' }}>
          បង្កើតការចុះអប់រំ និងត្រួតពិនិត្យថ្មី
        </Title>
        <ComprehensiveMentoringForm 
          mode="create" 
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
}