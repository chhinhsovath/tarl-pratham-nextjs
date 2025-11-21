'use client';

import { useState } from 'react';
import { Steps, Card, Button, Space, Typography, message } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  CheckCircleOutlined,
  RocketOutlined
} from '@ant-design/icons';
import StudentSelectionStep from './steps/StudentSelectionStep';
import AssessmentDetailsStep from './steps/AssessmentDetailsStep';
import ReviewStep from './steps/ReviewStep';
import SuccessStep from './steps/SuccessStep';
import MentorSchoolSelector from '@/components/mentor/MentorSchoolSelector';
import { trackActivity } from '@/lib/trackActivity';

const { Title, Text } = Typography;

interface AssessmentWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
  initialStudentId?: number;
  initialStudentName?: string;
  verificationMode?: boolean;
  originalAssessmentId?: string;
  initialAssessmentType?: 'baseline' | 'midline' | 'endline';
  initialSubject?: 'language' | 'math';
}

export interface WizardData {
  student_id?: number;
  student_name?: string;
  assessment_type: 'baseline' | 'midline' | 'endline' | 'baseline_verification' | 'midline_verification' | 'endline_verification';
  subject: 'language' | 'math';
  level?: string;
  assessment_sample: 'ឧបករណ៍តេស្ត លេខ១' | 'ឧបករណ៍តេស្ត លេខ២' | 'ឧបករណ៍តេស្ត លេខ៣' | 'ឧបករណ៍តេស្ត លេខ៤';
  student_consent: 'Yes' | 'No';
  assessed_date: string;
  notes?: string;
  assessed_by_mentor?: boolean;
  mentor_assessment_id?: string;
}

export default function AssessmentWizard({
  onComplete,
  onCancel,
  initialStudentId,
  initialStudentName,
  verificationMode = false,
  originalAssessmentId,
  initialAssessmentType,
  initialSubject
}: AssessmentWizardProps) {
  // If student is pre-selected, start at step 0 (Assessment Details), otherwise step 0 is Student Selection
  const hasPreSelectedStudent = initialStudentId !== undefined;
  const [currentStep, setCurrentStep] = useState(hasPreSelectedStudent ? 0 : 0);

  // Convert assessment type to verification type if in verification mode
  const getAssessmentType = (): WizardData['assessment_type'] => {
    if (!verificationMode || !initialAssessmentType) {
      return initialAssessmentType || 'baseline';
    }
    // Convert: baseline → baseline_verification
    return `${initialAssessmentType}_verification` as WizardData['assessment_type'];
  };

  const [wizardData, setWizardData] = useState<WizardData>({
    student_id: initialStudentId,
    student_name: initialStudentName,
    assessment_type: getAssessmentType(),
    subject: initialSubject || 'language',
    assessment_sample: 'ឧបករណ៍តេស្ត លេខ១',
    student_consent: 'Yes',
    assessed_date: new Date().toISOString(),
    assessed_by_mentor: verificationMode,
    mentor_assessment_id: originalAssessmentId
  });
  const [loading, setLoading] = useState(false);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [showSchoolSelector, setShowSchoolSelector] = useState(false);

  // Define steps based on whether student is pre-selected
  const steps = hasPreSelectedStudent ? [
    {
      title: 'លម្អិតការវាយតម្លៃ',
      icon: <BookOutlined />,
      description: 'បញ្ចូលពត៌មានការវាយតម្លៃ'
    },
    {
      title: 'ពិនិត្យ',
      icon: <CheckCircleOutlined />,
      description: 'ពិនិត្យនិងបញ្ជាក់ទិន្នន័យ'
    },
    {
      title: 'បញ្ចប់',
      icon: <RocketOutlined />,
      description: 'បានរក្សាទុកជោគជ័យ'
    }
  ] : [
    {
      title: 'ជ្រើសរើសសិស្ស',
      icon: <UserOutlined />,
      description: 'ជ្រើសរើសសិស្សដែលត្រូវធ្វើតេស្ត'
    },
    {
      title: 'លម្អិតការវាយតម្លៃ',
      icon: <BookOutlined />,
      description: 'បញ្ចូលពត៌មានការវាយតម្លៃ'
    },
    {
      title: 'ពិនិត្យ',
      icon: <CheckCircleOutlined />,
      description: 'ពិនិត្យនិងបញ្ជាក់ទិន្នន័យ'
    },
    {
      title: 'បញ្ចប់',
      icon: <RocketOutlined />,
      description: 'បានរក្សាទុកជោគជ័យ'
    }
  ];

  const updateWizardData = (data: Partial<WizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    // Validate current step before moving forward
    if (!hasPreSelectedStudent) {
      // Original flow with student selection
      if (currentStep === 0 && !wizardData.student_id) {
        message.warning('សូមជ្រើសរើសសិស្សម្នាក់');
        return;
      }
      if (currentStep === 1 && !wizardData.level) {
        message.warning('សូមជ្រើសរើសកម្រិត');
        return;
      }
    } else {
      // Pre-selected student flow (3 steps)
      if (currentStep === 0 && !wizardData.level) {
        message.warning('សូមជ្រើសរើសកម្រិត');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Check if error is due to missing school assignment
        if (result.code === 'SCHOOL_REQUIRED') {
          setLoading(false);
          setShowSchoolSelector(true);
          message.warning('សូមជ្រើសរើសសាលារៀនរបស់អ្នកជាមុនសិន');
          return;
        }
        throw new Error(result.error || 'Failed to create assessment');
      }

      setAssessmentId(result.data.id);
      message.success('បានរក្សាទុកជោគជ័យ!');

      // Track activity: User created an assessment
      trackActivity('assessment_add');

      // Move to success step (step 2 for pre-selected, step 3 for full flow)
      setCurrentStep(hasPreSelectedStudent ? 2 : 3);
    } catch (error: any) {
      message.error(error.message || 'មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setLoading(false);
    }
  };

  const handleSchoolSelected = () => {
    setShowSchoolSelector(false);
    // After school is selected, automatically retry submission
    setTimeout(() => {
      handleSubmit();
    }, 1500);
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderStepContent = () => {
    if (hasPreSelectedStudent) {
      // 3-step flow: Assessment Details → Review → Success
      switch (currentStep) {
        case 0: // Assessment Details
          return (
            <AssessmentDetailsStep
              data={wizardData}
              onChange={updateWizardData}
              verificationMode={verificationMode}
            />
          );
        case 1: // Review
          return (
            <ReviewStep
              data={wizardData}
              onEdit={(step) => setCurrentStep(step)}
            />
          );
        case 2: // Success
          return (
            <SuccessStep
              assessmentId={assessmentId}
              studentName={wizardData.student_name}
              onFinish={handleFinish}
              onAddAnother={() => {
                setCurrentStep(0);
                setWizardData({
                  student_id: initialStudentId,
                  student_name: initialStudentName,
                  assessment_type: 'baseline',
                  subject: 'language',
                  assessment_sample: 'ឧបករណ៍តេស្ត លេខ១',
                  student_consent: 'Yes',
                  assessed_date: new Date().toISOString()
                });
                setAssessmentId(null);
              }}
            />
          );
        default:
          return null;
      }
    } else {
      // 4-step flow: Student Selection → Assessment Details → Review → Success
      switch (currentStep) {
        case 0:
          return (
            <StudentSelectionStep
              selectedStudentId={wizardData.student_id}
              onSelect={(student) => {
                updateWizardData({
                  student_id: student.id,
                  student_name: student.name
                });
              }}
            />
          );
        case 1:
          return (
            <AssessmentDetailsStep
              data={wizardData}
              onChange={updateWizardData}
              verificationMode={verificationMode}
            />
          );
        case 2:
          return (
            <ReviewStep
              data={wizardData}
              onEdit={(step) => setCurrentStep(step)}
            />
          );
        case 3:
          return (
            <SuccessStep
              assessmentId={assessmentId}
              studentName={wizardData.student_name}
              onFinish={handleFinish}
              onAddAnother={() => {
                setCurrentStep(0);
                setWizardData({
                  assessment_type: 'baseline',
                  subject: 'language',
                  assessment_sample: 'ឧបករណ៍តេស្ត លេខ១',
                  student_consent: 'Yes',
                  assessed_date: new Date().toISOString()
                });
                setAssessmentId(null);
              }}
            />
          );
        default:
          return null;
      }
    }
  };

  return (
    <div className="wizard-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Card
        style={{
          background: verificationMode
            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          marginBottom: '24px',
          color: 'white'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            {verificationMode ? '✅ ផ្ទៀងផ្ទាត់ការវាយតម្លៃ (វាយតម្លៃឡើងវិញ)' : '🎯 ការវាយតម្លៃសិស្ស'}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            {verificationMode
              ? 'វាយតម្លៃសិស្សឡើងវិញដើម្បីផ្ទៀងផ្ទាត់លទ្ធផលពីគ្រូបង្រៀន'
              : 'ធ្វើតាមជំហានដើម្បីបញ្ចូលការវាយតម្លៃថ្មី'}
          </Text>
          {verificationMode && originalAssessmentId && (
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
              កំពុងផ្ទៀងផ្ទាត់ការវាយតម្លៃលេខ: {originalAssessmentId}
            </Text>
          )}
        </Space>
      </Card>

      {/* Progress Steps */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={currentStep}
          items={steps}
          responsive={true}
        />
      </Card>

      {/* Step Content */}
      <Card
        className="wizard-step-content"
        style={{ marginBottom: '24px', minHeight: '400px' }}
        bodyStyle={{ padding: '32px' }}
      >
        {renderStepContent()}
      </Card>

      {/* Navigation Buttons */}
      {currentStep < (hasPreSelectedStudent ? 2 : 3) && (
        <Card className="wizard-nav-buttons">
          <Space style={{ width: '100%', justifyContent: 'space-between' }} wrap>
            <Button
              size="large"
              onClick={onCancel}
              disabled={loading}
              style={{ minWidth: '120px' }}
            >
              បោះបង់
            </Button>
            <Space wrap>
              {currentStep > 0 && currentStep < (hasPreSelectedStudent ? 2 : 3) && (
                <Button
                  size="large"
                  onClick={handlePrev}
                  disabled={loading}
                  style={{ minWidth: '120px' }}
                >
                  ថយក្រោយ
                </Button>
              )}
              {currentStep < (hasPreSelectedStudent ? 1 : 2) && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  disabled={loading}
                  style={{ minWidth: '120px' }}
                >
                  បន្ទាប់
                </Button>
              )}
              {currentStep === (hasPreSelectedStudent ? 1 : 2) && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSubmit}
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  style={{ minWidth: '120px' }}
                >
                  រក្សាទុក
                </Button>
              )}
            </Space>
          </Space>
        </Card>
      )}

      {/* Mentor School Selector Modal */}
      <MentorSchoolSelector
        visible={showSchoolSelector}
        onSuccess={handleSchoolSelected}
        onCancel={() => setShowSchoolSelector(false)}
        forceSelection={true}
      />
    </div>
  );
}
