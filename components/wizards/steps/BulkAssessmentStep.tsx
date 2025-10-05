'use client';

import { useState, useEffect } from 'react';
import { Radio, Space, Typography, Tag, Button, message, Alert, Card, Row, Col } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface Student {
  id: number;
  name: string;
  sex?: string;
  gender?: string;
  grade_level?: number;
}

interface BulkAssessmentData {
  student_id: number;
  student_name: string;
  assessment_type: string;
  subject: 'language' | 'math';
  gender?: 'male' | 'female';
  existing_gender?: string; // Track existing gender from database
  level?: string;
  score?: number;
}

interface BulkAssessmentStepProps {
  selectedStudents: Student[];
  assessmentType: 'baseline' | 'midline' | 'endline';
  subject: 'language' | 'math';
  onSubmit: (assessments: BulkAssessmentData[]) => Promise<void>;
  onBack: () => void;
}

// Khmer level options
const LANGUAGE_LEVELS = [
  { value: 'beginner', label: 'កម្រិតដំបូង' },
  { value: 'letter', label: 'តួអក្សរ' },
  { value: 'word', label: 'ពាក្យ' },
  { value: 'paragraph', label: 'កថាខណ្ឌ' },
  { value: 'story', label: 'រឿង' },
  { value: 'comprehension_1', label: 'យល់ន័យ១' },
  { value: 'comprehension_2', label: 'យល់ន័យ២' }
];

const MATH_LEVELS = [
  { value: 'beginner', label: 'កម្រិតដំបូង' },
  { value: 'number_1_digit', label: 'លេខ១ខ្ទង' },
  { value: 'number_2_digit', label: 'លេខ២ខ្ទង' },
  { value: 'subtraction', label: 'ប្រមាណវិធីដក' },
  { value: 'division', label: 'ប្រមាណវិធីចែក' },
  { value: 'problem', label: 'ចំណោទ' }
];

export default function BulkAssessmentStep({
  selectedStudents,
  assessmentType,
  subject,
  onSubmit,
  onBack
}: BulkAssessmentStepProps) {
  const [assessments, setAssessments] = useState<BulkAssessmentData[]>([]);
  const [loading, setLoading] = useState(false);

  const levelOptions = subject === 'language' ? LANGUAGE_LEVELS : MATH_LEVELS;

  useEffect(() => {
    // Initialize assessments for each student
    setAssessments(
      selectedStudents.map(student => {
        // Support both 'sex' and 'gender' field names (API inconsistency)
        const studentGender = student.sex || student.gender;
        return {
          student_id: student.id,
          student_name: student.name,
          assessment_type: assessmentType,
          subject: subject,
          gender: studentGender as 'male' | 'female' | undefined,
          existing_gender: studentGender, // Track existing gender from database
          level: undefined,
          score: undefined
        };
      })
    );
  }, [selectedStudents, assessmentType, subject]);

  const updateLevel = (studentId: number, level: string) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.student_id === studentId
          ? { ...assessment, level }
          : assessment
      )
    );
  };

  const handleSubmit = async () => {
    // Validate all assessments have required fields
    const incompleteAssessments = assessments.filter(a => !a.level);
    if (incompleteAssessments.length > 0) {
      message.warning(`សូមជ្រើសរើសកម្រិតសម្រាប់សិស្សទាំងអស់ (${incompleteAssessments.length} នៅសល់)`);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(assessments);
    } catch (error: any) {
      message.error(error.message || 'មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setLoading(false);
    }
  };

  const completedCount = assessments.filter(a => a.level).length;
  const totalCount = assessments.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={4}>ការវាយតម្លៃច្រើននាក់ក្នុងពេលតែមួយ</Title>
        <Text type="secondary">
          ជ្រើសរើសកម្រិតសម្រាប់សិស្សនីមួយៗដោយប្រើប៊ូតុងវិទ្យុ
        </Text>
      </div>

      {/* Assessment Info */}
      <Row gutter={16}>
        <Col>
          <Tag color="blue" style={{ fontSize: '14px', padding: '8px 16px' }}>
            {assessmentType === 'baseline' ? 'តេស្តដើមគ្រា' :
             assessmentType === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' :
             'តេស្តចុងក្រោយគ្រា'}
          </Tag>
        </Col>
        <Col>
          <Tag color="purple" style={{ fontSize: '14px', padding: '8px 16px' }}>
            {subject === 'language' ? 'ខ្មែរ' : 'គណិតវិទ្យា'}
          </Tag>
        </Col>
        <Col>
          <Tag color={progressPercentage === 100 ? 'green' : 'orange'} style={{ fontSize: '14px', padding: '8px 16px' }}>
            ការវឌ្ឍនភាព: {completedCount}/{totalCount} សិស្ស
          </Tag>
        </Col>
      </Row>

      {/* Data Entry Grid */}
      <Card size="small">
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{
                  border: '1px solid #d9d9d9',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  minWidth: '150px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#f0f0f0',
                  zIndex: 1
                }}>
                  ឈ្មោះសិស្ស
                </th>

                <th style={{
                  border: '1px solid #d9d9d9',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  backgroundColor: '#e6f7ff',
                  minWidth: '100px'
                }}>
                  ភេទ
                </th>

                <th colSpan={levelOptions.length} style={{
                  border: '1px solid #d9d9d9',
                  padding: '12px 8px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  backgroundColor: '#f9f0ff'
                }}>
                  កម្រិតសិស្ស
                </th>
              </tr>

              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{
                  border: '1px solid #d9d9d9',
                  padding: '8px',
                  position: 'sticky',
                  left: 0,
                  backgroundColor: '#fafafa',
                  zIndex: 1
                }}></th>

                <th style={{
                  border: '1px solid #d9d9d9',
                  padding: '8px',
                  textAlign: 'center',
                  fontSize: '13px'
                }}></th>

                {levelOptions.map(level => (
                  <th key={level.value} style={{
                    border: '1px solid #d9d9d9',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize: '13px',
                    minWidth: '100px',
                    maxWidth: '120px',
                    wordWrap: 'break-word'
                  }}>
                    {level.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {assessments.map((assessment, index) => (
                <tr key={assessment.student_id} style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                }}>
                  <td style={{
                    border: '1px solid #d9d9d9',
                    padding: '12px 8px',
                    fontWeight: 'bold',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa',
                    zIndex: 1
                  }}>
                    {assessment.student_name}
                  </td>

                  <td style={{
                    border: '1px solid #d9d9d9',
                    padding: '8px',
                    textAlign: 'center'
                  }}>
                    {assessment.existing_gender ? (
                      <Tag color={assessment.existing_gender === 'ប្រុស' ? 'blue' : 'pink'}>
                        {assessment.existing_gender}
                      </Tag>
                    ) : (
                      <Text type="secondary">-</Text>
                    )}
                  </td>

                  {levelOptions.map(level => (
                    <td key={level.value} style={{
                      border: '1px solid #d9d9d9',
                      padding: '8px',
                      textAlign: 'center'
                    }}>
                      <Radio
                        checked={assessment.level === level.value}
                        onChange={() => updateLevel(assessment.student_id, level.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {completedCount < totalCount && (
        <Alert
          message={`សូមបំពេញការវាយតម្លៃសម្រាប់សិស្ស ${totalCount - completedCount} នាក់ទៀត`}
          type="warning"
          showIcon
        />
      )}

      {/* Action Buttons */}
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Button
          size="large"
          onClick={onBack}
          disabled={loading}
        >
          ថយក្រោយ
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit}
          loading={loading}
          icon={<SaveOutlined />}
          disabled={completedCount < totalCount}
        >
          រក្សាទុកការវាយតម្លៃទាំងអស់ ({completedCount}/{totalCount})
        </Button>
      </Space>
    </Space>
  );
}
