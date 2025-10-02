'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  DatePicker,
  message,
  Spin,
  Steps,
  Radio,
  Space,
  Typography,
  Tag,
  Alert
} from 'antd';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions,
  getLevelLabelKM,
  getLevelLabelEN
} from '@/lib/constants/assessment-levels';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;

interface AssessmentFormProps {
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  students?: any[];
  selectedStudents?: number[];
  assessmentType?: string;
  subject?: string;
  mode: 'single' | 'bulk';
}

interface AssessmentData {
  student_id: number;
  assessment_type: string;
  subject: string;
  level?: string;
  score?: number;
  notes?: string;
  assessed_date?: string;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  onSubmit, 
  loading = false,
  students = [],
  selectedStudents = [],
  assessmentType,
  subject,
  mode = 'single'
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<number, AssessmentData>>({});
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (mode === 'single') {
      fetchStudents();
    } else {
      // Initialize assessment data for selected students
      const initialData: Record<number, AssessmentData> = {};
      selectedStudents.forEach(studentId => {
        initialData[studentId] = {
          student_id: studentId,
          assessment_type: assessmentType || 'baseline',
          subject: subject || 'language',
          assessed_date: dayjs().format('YYYY-MM-DD')
        };
      });
      setAssessmentData(initialData);
    }
  }, [mode, selectedStudents, assessmentType, subject]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const params = new URLSearchParams();
      if (user?.role === 'teacher' || user?.role === 'mentor') {
        if (user.pilot_school_id) {
          params.append('pilot_school_id', user.pilot_school_id.toString());
        }
      }

      const response = await fetch(`/api/students?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Get options from constants - includes all 7 language + 6 math levels
  const assessmentTypes = getAssessmentTypeOptions();
  const subjects = getSubjectOptions();

  // State for dynamically loaded levels based on subject
  const [selectedSubject, setSelectedSubject] = useState<'language' | 'math'>('language');
  const [availableLevels, setAvailableLevels] = useState(getLevelOptions('language'));

  // Update levels when subject changes
  const handleSubjectChange = (value: 'language' | 'math') => {
    setSelectedSubject(value);
    setAvailableLevels(getLevelOptions(value));
    // Reset level field when subject changes
    form.setFieldValue('level', undefined);
  };

  const handleSingleSubmit = async (values: any) => {
    try {
      await onSubmit([values]);
      form.resetFields();
      message.success('Assessment saved successfully');
    } catch (error) {
      console.error('Assessment submission error:', error);
    }
  };

  const handleBulkNext = () => {
    form.validateFields().then(values => {
      // Save current student's data
      const studentId = selectedStudents[currentStudentIndex];
      setAssessmentData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ...values
        }
      }));

      if (currentStudentIndex < selectedStudents.length - 1) {
        setCurrentStudentIndex(prev => prev + 1);
        // Load next student's data
        const nextStudentId = selectedStudents[currentStudentIndex + 1];
        const nextData = assessmentData[nextStudentId] || {};
        form.setFieldsValue(nextData);
      } else {
        setCurrentStep(1); // Move to review step
      }
    });
  };

  const handleBulkPrevious = () => {
    if (currentStudentIndex > 0) {
      // Save current data
      const studentId = selectedStudents[currentStudentIndex];
      const currentValues = form.getFieldsValue();
      setAssessmentData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ...currentValues
        }
      }));

      setCurrentStudentIndex(prev => prev - 1);
      // Load previous student's data
      const prevStudentId = selectedStudents[currentStudentIndex - 1];
      const prevData = assessmentData[prevStudentId] || {};
      form.setFieldsValue(prevData);
    }
  };

  const handleBulkSubmit = async () => {
    try {
      // Save current form data
      const currentValues = form.getFieldsValue();
      const studentId = selectedStudents[currentStudentIndex];
      const finalData = {
        ...assessmentData,
        [studentId]: {
          ...assessmentData[studentId],
          ...currentValues
        }
      };

      // Convert to array
      const assessmentArray = Object.values(finalData);
      await onSubmit(assessmentArray);
      
      message.success('All assessments submitted successfully');
    } catch (error) {
      console.error('Bulk assessment submission error:', error);
    }
  };

  const getCurrentStudent = () => {
    if (mode === 'single') return null;
    const studentId = selectedStudents[currentStudentIndex];
    return students.find(s => s.id === studentId);
  };

  const validateScore = (rule: any, value: number) => {
    if (value === undefined || value === null) return Promise.resolve();
    
    if (value < 0 || value > 100) {
      return Promise.reject('Score must be between 0 and 100');
    }
    
    return Promise.resolve();
  };

  if (loadingStudents) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading students...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={
      mode === 'single' ? 'Create Assessment' : 
      `Bulk Assessment Entry (${currentStudentIndex + 1}/${selectedStudents.length})`
    }>
      {mode === 'bulk' && (
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="Data Entry" />
          <Step title="Review & Submit" />
        </Steps>
      )}

      {user?.role === 'mentor' && (
        <Alert
          message="Mentor Assessment"
          description="This assessment will be marked as temporary and automatically deleted after 48 hours unless permanently saved by an admin or teacher."
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {mode === 'bulk' && currentStep === 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>
            Current Student: {getCurrentStudent()?.name}
          </Title>
          <Text type="secondary">
            Progress: {currentStudentIndex + 1} of {selectedStudents.length}
          </Text>
        </div>
      )}

      {currentStep === 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={mode === 'single' ? handleSingleSubmit : handleBulkNext}
          disabled={loading}
          initialValues={{
            assessment_type: assessmentType || 'baseline',
            subject: subject || 'language',
            assessed_date: dayjs()
          }}
        >
          {mode === 'single' && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="student_id"
                  label="Select Student"
                  rules={[{ required: true, message: 'Student is required' }]}
                >
                  <Select
                    placeholder="Choose a student"
                    showSearch
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {availableStudents.map((student: any) => (
                      <Option key={student.id} value={student.id}>
                        {student.name} 
                        {student.school_class && ` - ${student.school_class.name}`}
                        {student.pilot_school && ` (${student.pilot_school.name})`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assessment_type"
                label="Assessment Type"
                rules={[{ required: true, message: 'Assessment type is required' }]}
              >
                <Radio.Group>
                  {assessmentTypes.map(type => (
                    <Radio.Button key={type.value} value={type.value}>
                      <Tag color={type.color} style={{ margin: 0 }}>
                        {type.label}
                      </Tag>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="subject"
                label="Subject"
                rules={[{ required: true, message: 'Subject is required' }]}
              >
                <Radio.Group onChange={(e) => handleSubjectChange(e.target.value)}>
                  {subjects.map(subj => (
                    <Radio.Button key={subj.value} value={subj.value}>
                      <Tag color={subj.value === 'language' ? 'purple' : 'cyan'} style={{ margin: 0 }}>
                        {subj.label_km}
                      </Tag>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label={`${selectedSubject === 'language' ? 'Language' : 'Math'} Level`}
                rules={[{ required: true, message: 'Level is required' }]}
              >
                <Select placeholder="Select student level">
                  {availableLevels.map(level => (
                    <Option key={level.value} value={level.value}>
                      <div>
                        <strong>{level.label_km}</strong>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {level.label_en}
                        </Text>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="score"
                label="Score (%)"
                rules={[{ validator: validateScore }]}
              >
                <InputNumber 
                  placeholder="Enter score (0-100)" 
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assessed_date"
                label="Assessment Date"
                rules={[{ required: true, message: 'Assessment date is required' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea 
                  rows={4} 
                  placeholder="Add any observations or notes about the assessment..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              {mode === 'single' ? (
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Save Assessment
                </Button>
              ) : (
                <>
                  {currentStudentIndex > 0 && (
                    <Button onClick={handleBulkPrevious}>
                      Previous Student
                    </Button>
                  )}
                  
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={loading}
                  >
                    {currentStudentIndex < selectedStudents.length - 1 ? 
                      'Next Student' : 'Review All'
                    }
                  </Button>
                </>
              )}
              
              <Button 
                onClick={() => form.resetFields()}
                disabled={loading}
              >
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {mode === 'bulk' && currentStep === 1 && (
        <div>
          <Title level={4}>Review All Assessments</Title>
          
          <div style={{ marginBottom: '24px' }}>
            {selectedStudents.map(studentId => {
              const student = students.find(s => s.id === studentId);
              const data = assessmentData[studentId];
              
              return (
                <Card key={studentId} size="small" style={{ marginBottom: '8px' }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <strong>{student?.name}</strong>
                    </Col>
                    <Col span={4}>
                      <Tag color="blue">{data?.assessment_type?.toUpperCase()}</Tag>
                    </Col>
                    <Col span={4}>
                      <Tag color="purple">{data?.subject?.toUpperCase()}</Tag>
                    </Col>
                    <Col span={4}>
                      <Tag color="orange">{data?.level?.toUpperCase()}</Tag>
                    </Col>
                    <Col span={3}>
                      Score: {data?.score || '-'}%
                    </Col>
                    <Col span={3}>
                      {data?.assessed_date}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>

          <Space>
            <Button onClick={() => setCurrentStep(0)}>
              Back to Edit
            </Button>
            <Button 
              type="primary" 
              onClick={handleBulkSubmit}
              loading={loading}
              icon={<SendOutlined />}
            >
              Submit All Assessments
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default AssessmentForm;