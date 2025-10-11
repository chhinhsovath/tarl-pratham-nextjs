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

  // Get verification mode parameters
  const verificationMode = searchParams.get('verificationMode') === 'true';
  const originalAssessmentId = searchParams.get('originalAssessmentId');
  const assessmentType = searchParams.get('assessmentType');
  const subject = searchParams.get('subject');

  const handleComplete = () => {
    if (verificationMode) {
      // After verification, go back to verification list
      router.push('/verification');
    } else {
      router.push('/dashboard');
    }
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
        verificationMode={verificationMode}
        originalAssessmentId={originalAssessmentId || undefined}
        initialAssessmentType={assessmentType as 'baseline' | 'midline' | 'endline' | undefined}
        initialSubject={subject as 'language' | 'math' | undefined}
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
