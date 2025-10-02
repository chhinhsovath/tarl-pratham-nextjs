'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import BulkAssessmentWizard from '@/components/wizards/BulkAssessmentWizard';

function BulkAssessmentCreateContent() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <HorizontalLayout>
      <BulkAssessmentWizard onComplete={handleComplete} onCancel={handleCancel} />
    </HorizontalLayout>
  );
}

export default function BulkAssessmentCreatePage() {
  return (
    <Suspense fallback={
      <HorizontalLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    }>
      <BulkAssessmentCreateContent />
    </Suspense>
  );
}
