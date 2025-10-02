'use client';

import { useState, useEffect } from 'react';
import { Table, Select, InputNumber, Space, Typography, Tag, Button, message, Progress, Alert } from 'antd';
import { CheckCircleOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions
} from '@/lib/constants/assessment-levels';

const { Text, Title } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  name: string;
  sex: string;
  grade_level: number;
}

interface BulkAssessmentData {
  student_id: number;
  student_name: string;
  assessment_type: string;
  subject: 'language' | 'math';
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

export default function BulkAssessmentStep({
  selectedStudents,
  assessmentType,
  subject,
  onSubmit,
  onBack
}: BulkAssessmentStepProps) {
  const [assessments, setAssessments] = useState<BulkAssessmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableLevels] = useState(getLevelOptions(subject));

  useEffect(() => {
    // Initialize assessments for each student
    setAssessments(
      selectedStudents.map(student => ({
        student_id: student.id,
        student_name: student.name,
        assessment_type: assessmentType,
        subject: subject,
        level: undefined,
        score: undefined
      }))
    );
  }, [selectedStudents, assessmentType, subject]);

  const updateAssessment = (studentId: number, field: string, value: any) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.student_id === studentId
          ? { ...assessment, [field]: value }
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

  const columns = [
    {
      title: 'លេខរៀង',
      key: 'index',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (name: string, record: BulkAssessmentData) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          {record.level && (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              បានបញ្ចូល
            </Tag>
          )}
        </Space>
      )
    },
    {
      title: 'កម្រិត',
      key: 'level',
      width: 250,
      render: (_: any, record: BulkAssessmentData) => (
        <Select
          value={record.level}
          onChange={(value) => updateAssessment(record.student_id, 'level', value)}
          placeholder="ជ្រើសរើសកម្រិត"
          style={{ width: '100%' }}
          size="large"
        >
          {availableLevels.map(level => (
            <Option key={level.value} value={level.value}>
              <div style={{ padding: '4px 0' }}>
                <Text strong>{level.label_km}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {level.label_en}
                </Text>
              </div>
            </Option>
          ))}
        </Select>
      )
    },
    {
      title: 'ពិន្ទុ (ស្រេចចិត្ត)',
      key: 'score',
      width: 150,
      render: (_: any, record: BulkAssessmentData) => (
        <InputNumber
          value={record.score}
          onChange={(value) => updateAssessment(record.student_id, 'score', value || undefined)}
          min={0}
          max={100}
          placeholder="0-100"
          style={{ width: '100%' }}
          size="large"
        />
      )
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: any, record: BulkAssessmentData) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setAssessments(prev => prev.filter(a => a.student_id !== record.student_id));
          }}
        />
      )
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={4}>ការវាយតម្លៃច្រើននាក់ក្នុងពេលតែមួយ</Title>
        <Text type="secondary">
          បញ្ចូលកម្រិតសម្រាប់សិស្សនីមួយៗ
        </Text>
      </div>

      {/* Progress Summary */}
      <Alert
        message={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text strong>ការវឌ្ឍនភាព</Text>
            <Text strong style={{ color: '#1890ff' }}>
              {completedCount}/{totalCount} សិស្ស
            </Text>
          </Space>
        }
        description={
          <Progress
            percent={progressPercentage}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            status={progressPercentage === 100 ? 'success' : 'active'}
          />
        }
        type="info"
        showIcon
      />

      {/* Assessment Info */}
      <Space size="middle" wrap>
        <Tag color="blue" style={{ fontSize: '14px', padding: '8px 16px' }}>
          {assessmentType === 'baseline' ? 'តេស្តដើមគ្រា' :
           assessmentType === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' :
           'តេស្តចុងក្រោយគ្រា'}
        </Tag>
        <Tag color="purple" style={{ fontSize: '14px', padding: '8px 16px' }}>
          {subject === 'language' ? 'ខ្មែរ' : 'គណិតវិទ្យា'}
        </Tag>
        <Tag color="green" style={{ fontSize: '14px', padding: '8px 16px' }}>
          {subject === 'language' ? '7 កម្រិត' : '6 កម្រិត'}
        </Tag>
      </Space>

      {/* Students Table */}
      <Table
        columns={columns}
        dataSource={assessments}
        rowKey="student_id"
        pagination={false}
        scroll={{ x: 800, y: 400 }}
        size="small"
      />

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
          disabled={completedCount === 0}
        >
          រក្សាទុកការវាយតម្លៃទាំងអស់ ({completedCount})
        </Button>
      </Space>
    </Space>
  );
}
