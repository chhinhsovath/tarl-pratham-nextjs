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

const { Title, Text } = Typography;

interface AssessmentWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export interface WizardData {
  student_id?: number;
  student_name?: string;
  assessment_type: 'baseline' | 'midline' | 'endline';
  subject: 'language' | 'math';
  level?: string;
  score?: number;
  assessed_date: string;
  notes?: string;
}

export default function AssessmentWizard({ onComplete, onCancel }: AssessmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    assessment_type: 'baseline',
    subject: 'language',
    assessed_date: new Date().toISOString()
  });
  const [loading, setLoading] = useState(false);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);

  const steps = [
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
    if (currentStep === 0 && !wizardData.student_id) {
      message.warning('សូមជ្រើសរើសសិស្សម្នាក់');
      return;
    }
    if (currentStep === 1 && !wizardData.level) {
      message.warning('សូមជ្រើសរើសកម្រិត');
      return;
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
        throw new Error(result.error || 'Failed to create assessment');
      }

      setAssessmentId(result.data.id);
      message.success('បានរក្សាទុកជោគជ័យ!');
      setCurrentStep(3); // Move to success step
    } catch (error: any) {
      message.error(error.message || 'មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const renderStepContent = () => {
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
                assessed_date: new Date().toISOString()
              });
              setAssessmentId(null);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          marginBottom: '24px',
          color: 'white'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            🎯 ការវាយតម្លៃសិស្ស
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            ធ្វើតាមជំហានដើម្បីបញ្ចូលការវាយតម្លៃថ្មី
          </Text>
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
      {currentStep < 3 && (
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
              {currentStep > 0 && currentStep < 3 && (
                <Button
                  size="large"
                  onClick={handlePrev}
                  disabled={loading}
                  style={{ minWidth: '120px' }}
                >
                  ថយក្រោយ
                </Button>
              )}
              {currentStep < 2 && (
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
              {currentStep === 2 && (
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
    </div>
  );
}
