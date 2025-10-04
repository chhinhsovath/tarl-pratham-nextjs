'use client';

import { useState } from 'react';
import { Steps, Card, Button, Space, Typography, message, Select, Row, Col } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  SaveOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import StudentSelectionStep from './steps/StudentSelectionStep';
import BulkAssessmentStep from './steps/BulkAssessmentStep';
import SuccessStep from './steps/SuccessStep';

const { Title, Text } = Typography;
const { Option } = Select;

interface BulkAssessmentWizardProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

interface Student {
  id: number;
  name: string;
  sex?: string;
  gender?: string;
  grade_level: number;
}

export default function BulkAssessmentWizard({ onComplete, onCancel }: BulkAssessmentWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [assessmentType, setAssessmentType] = useState<'baseline' | 'midline' | 'endline'>('baseline');
  const [subject, setSubject] = useState<'language' | 'math'>('language');
  const [loading, setLoading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const steps = [
    {
      title: 'ជ្រើសរើសសិស្ស',
      icon: <TeamOutlined />,
      description: 'ជ្រើសរើសសិស្សច្រើននាក់'
    },
    {
      title: 'បញ្ចូលការវាយតម្លៃ',
      icon: <BookOutlined />,
      description: 'បញ្ចូលកម្រិតសម្រាប់សិស្សនីមួយៗ'
    },
    {
      title: 'បញ្ចប់',
      icon: <RocketOutlined />,
      description: 'បានរក្សាទុកជោគជ័យ'
    }
  ];

  const handleStudentToggle = (student: Student) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s.id === student.id);
      if (exists) {
        return prev.filter(s => s.id !== student.id);
      } else {
        return [...prev, student];
      }
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && selectedStudents.length === 0) {
      message.warning('សូមជ្រើសរើសសិស្សយ៉ាងហោចណាស់ម្នាក់');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBulkSubmit = async (assessments: any[]) => {
    setLoading(true);
    let successfulCount = 0;
    const errors: string[] = [];

    try {
      // Submit assessments one by one
      for (const assessment of assessments) {
        try {
          // Create assessment
          const response = await fetch('/api/assessments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              student_id: assessment.student_id,
              assessment_type: assessment.assessment_type,
              subject: assessment.subject,
              level: assessment.level,
              score: assessment.score,
              assessed_date: new Date().toISOString()
            })
          });

          if (response.ok) {
            successfulCount++;
          } else {
            const result = await response.json();
            errors.push(`${assessment.student_name}: ${result.error}`);
          }
        } catch (error) {
          errors.push(`${assessment.student_name}: Network error`);
        }
      }

      setSuccessCount(successfulCount);

      if (errors.length > 0) {
        message.warning(`រក្សាទុក ${successfulCount}/${assessments.length} ការវាយតម្លៃ`);
        console.error('Bulk assessment errors:', errors);
      } else {
        message.success(`បានរក្សាទុក ${successfulCount} ការវាយតម្លៃជោគជ័យ!`);
      }

      setCurrentStep(2); // Move to success step
    } catch (error: any) {
      message.error('មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={4}>ជ្រើសរើសសិស្សច្រើននាក់</Title>
              <Text type="secondary">
                ជ្រើសរើសសិស្សពីបញ្ជីដើម្បីធ្វើការវាយតម្លៃរួមគ្នា
              </Text>
            </div>

            {/* Assessment Settings */}
            <Card size="small" title="ការកំណត់ការវាយតម្លៃ">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>ប្រភេទការវាយតម្លៃ</Text>
                    <Select
                      value={assessmentType}
                      onChange={setAssessmentType}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Option value="baseline">តេស្តដើមគ្រា</Option>
                      <Option value="midline">តេស្តពាក់កណ្ដាលគ្រា</Option>
                      <Option value="endline">តេស្តចុងក្រោយគ្រា</Option>
                    </Select>
                  </Space>
                </Col>
                <Col xs={24} md={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>មុខវិជ្ជា</Text>
                    <Select
                      value={subject}
                      onChange={setSubject}
                      style={{ width: '100%' }}
                      size="large"
                    >
                      <Option value="language">ខ្មែរ</Option>
                      <Option value="math">គណិតវិទ្យា</Option>
                    </Select>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Student Selection */}
            <Card
              size="small"
              title={`សិស្សដែលបានជ្រើសរើស: ${selectedStudents.length} នាក់`}
            >
              <StudentSelectionStep
                selectedStudentId={undefined}
                onSelect={handleStudentToggle}
              />
            </Card>
          </Space>
        );
      case 1:
        return (
          <BulkAssessmentStep
            selectedStudents={selectedStudents}
            assessmentType={assessmentType}
            subject={subject}
            onSubmit={handleBulkSubmit}
            onBack={() => setCurrentStep(0)}
          />
        );
      case 2:
        return (
          <SuccessStep
            assessmentId={null}
            studentName={`${successCount} សិស្ស`}
            onFinish={() => {
              if (onComplete) {
                onComplete();
              } else {
                router.push('/dashboard');
              }
            }}
            onAddAnother={() => {
              setCurrentStep(0);
              setSelectedStudents([]);
              setSuccessCount(0);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Card
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          marginBottom: '24px',
          color: 'white'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ margin: 0, color: 'white' }}>
            👥 ការវាយតម្លៃសិស្សច្រើននាក់
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
            វាយតម្លៃសិស្សច្រើននាក់ក្នុងពេលតែមួយ
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
      {currentStep === 0 && (
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
            <Button
              type="primary"
              size="large"
              onClick={handleNext}
              disabled={loading || selectedStudents.length === 0}
              style={{ minWidth: '120px' }}
            >
              បន្ទាប់ ({selectedStudents.length} សិស្ស)
            </Button>
          </Space>
        </Card>
      )}
    </div>
  );
}
