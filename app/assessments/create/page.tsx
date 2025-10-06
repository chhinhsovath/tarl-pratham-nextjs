'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Spin } from 'antd';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import AssessmentWizard from '@/components/wizards/AssessmentWizard';

function AssessmentCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get student info from URL parameters
  const studentId = searchParams.get('studentId');
  const studentName = searchParams.get('studentName');

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <HorizontalLayout>
      <AssessmentWizard
        onComplete={handleComplete}
        onCancel={handleCancel}
        initialStudentId={studentId ? parseInt(studentId) : undefined}
        initialStudentName={studentName || undefined}
      />
    </HorizontalLayout>
  );
}

export default function AssessmentCreatePage() {
  return (
    <Suspense fallback={
      <HorizontalLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    }>
      <AssessmentCreateContent />
    </Suspense>
  );
}
