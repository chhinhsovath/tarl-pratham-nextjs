'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Row,
  Col
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions
} from '@/lib/constants/assessment-levels';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [assessment, setAssessment] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<'language' | 'math'>('language');
  const [availableLevels, setAvailableLevels] = useState(getLevelOptions('language'));

  useEffect(() => {
    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  // Update available levels when subject changes
  useEffect(() => {
    setAvailableLevels(getLevelOptions(selectedSubject));
  }, [selectedSubject]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch students first
      const studentsResponse = await fetch('/api/students');
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        const studentsList = studentsData.students || studentsData.data || [];
        console.log('✅ Students loaded:', studentsList.length);
        setStudents(studentsList);
      } else {
        console.error('❌ Failed to load students:', studentsResponse.status);
        const errorData = await studentsResponse.json();
        console.error('Error details:', errorData);
      }

      // Then fetch assessment
      const assessmentResponse = await fetch(`/api/assessments/${params.id}`);
      if (!assessmentResponse.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await assessmentResponse.json();
      const assessmentData = data.assessment || data.data;
      setAssessment(assessmentData);
      console.log('✅ Assessment loaded:', assessmentData);

      // Small delay to ensure students state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Set subject state and update available levels
      const currentSubject = assessmentData.subject || 'language';
      setSelectedSubject(currentSubject);
      setAvailableLevels(getLevelOptions(currentSubject));

      // Set form values after students are loaded
      form.setFieldsValue({
        student_id: assessmentData.student_id,
        assessment_type: assessmentData.assessment_type,
        subject: currentSubject,
        level: assessmentData.level,
        assessment_sample: assessmentData.assessment_sample || 'ឧបករណ៍តេស្ត លេខ១',
        student_consent: assessmentData.student_consent || 'Yes',
        assessed_date: assessmentData.assessed_date ? dayjs(assessmentData.assessed_date) : null,
        notes: assessmentData.notes
      });
      console.log('✅ Form values set with student_id:', assessmentData.student_id);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('មិនអាចទាញយកទិន្នន័យបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectChange = (value: 'language' | 'math') => {
    setSelectedSubject(value);
    // Clear level when subject changes
    form.setFieldValue('level', undefined);
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const payload = {
        ...values,
        assessed_date: values.assessed_date ? values.assessed_date.format('YYYY-MM-DD') : null
      };

      const response = await fetch(`/api/assessments/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': session?.user?.id?.toString() || '',
          'user-role': session?.user?.role || ''
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update assessment');
      }

      message.success('ការវាយតម្លៃត្រូវបានកែប្រែដោយជោគជ័យ');
      router.push(`/assessments/${params.id}`);
    } catch (error: any) {
      console.error('Error updating assessment:', error);
      message.error(error.message || 'មិនអាចកែប្រែការវាយតម្លៃបានទេ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <HorizontalLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/assessments/${params.id}`)}
            className="mb-4"
          >
            ត្រលប់ទៅវិញ
          </Button>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            កែសម្រួលការវាយតម្លៃ
          </h1>
          <p className="text-gray-600">
            កែប្រែព័ត៌មានការវាយតម្លៃលេខ #{params.id}
          </p>
        </div>

        {/* Edit Form with Card-based Layout */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Header */}
              <div>
                <Title level={4}>
                  <BookOutlined /> លម្អិតការវាយតម្លៃ
                </Title>
                <Text type="secondary">
                  កែប្រែពត៌មានការវាយតម្លៃសិស្ស
                </Text>
              </div>

              {/* Student Selection */}
              <Card size="small" title="សិស្ស">
                <Form.Item
                  name="student_id"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសសិស្ស' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select
                    placeholder="ជ្រើសរើសសិស្ស"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                    loading={loading && students.length === 0}
                    notFoundContent={loading ? 'កំពុងផ្ទុក...' : 'មិនមានសិស្ស'}
                    size="large"
                  >
                    {students.map((student: any) => (
                      <Option key={student.id} value={student.id}>
                        {student.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Card>

              {/* Assessment Type and Subject */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Card size="small" title="ប្រភេទការវាយតម្លៃ" style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name="assessment_type"
                      rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទ' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select placeholder="ជ្រើសរើសប្រភេទ" size="large">
                        {getAssessmentTypeOptions().map(type => (
                          <Option key={type.value} value={type.value}>
                            <strong>{type.label_km}</strong>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card size="small" title="មុខវិជ្ជា" style={{ marginBottom: '16px' }}>
                    <Form.Item
                      name="subject"
                      rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        placeholder="ជ្រើសរើសមុខវិជ្ជា"
                        size="large"
                        onChange={handleSubjectChange}
                      >
                        {getSubjectOptions().map(subject => (
                          <Option key={subject.value} value={subject.value}>
                            <strong>{subject.label_km}</strong>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              {/* Level */}
              <Card
                size="small"
                title={
                  <Space>
                    <TrophyOutlined />
                    <Text>កម្រិតសិស្ស</Text>
                  </Space>
                }
              >
                <Form.Item
                  name="level"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសកម្រិត' }]}
                  style={{ marginBottom: 0 }}
                >
                  <Select placeholder="ជ្រើសរើសកម្រិត" allowClear size="large">
                    {availableLevels.map(level => (
                      <Option key={level.value} value={level.value}>
                        <Text strong style={{ fontSize: '15px' }}>
                          {level.label_km}
                        </Text>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
                  {selectedSubject === 'language' ? '7 កម្រិតសម្រាប់ភាសាខ្មែរ' : '6 កម្រិតសម្រាប់គណិតវិទ្យា'}
                </Text>
              </Card>

              {/* Sample and Consent */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Card size="small" title="គម្រូតេស្ត">
                    <Form.Item
                      name="assessment_sample"
                      rules={[{ required: true, message: 'សូមជ្រើសរើសលេខឧបករណ៍តេស្ត' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select placeholder="ជ្រើសរើសលេខឧបករណ៍តេស្ត" size="large">
                        <Option value="ឧបករណ៍តេស្ត លេខ១">ឧបករណ៍តេស្ត លេខ១</Option>
                        <Option value="ឧបករណ៍តេស្ត លេខ២">ឧបករណ៍តេស្ត លេខ២</Option>
                        <Option value="ឧបករណ៍តេស្ត លេខ៣">ឧបករណ៍តេស្ត លេខ៣</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card size="small" title="យល់ព្រមចូលរួម">
                    <Form.Item
                      name="student_consent"
                      rules={[{ required: true, message: 'សូមជ្រើសរើសការយល់ព្រម' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Select placeholder="ជ្រើសរើសការយល់ព្រម" size="large">
                        <Option value="Yes">Yes</Option>
                        <Option value="No">No</Option>
                      </Select>
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              {/* Assessment Date */}
              <Row gutter={16}>
                <Col xs={24}>
                  <Card size="small" title="កាលបរិច្ឆេទវាយតម្លៃ">
                    <Form.Item
                      name="assessed_date"
                      rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' }]}
                      style={{ marginBottom: 0 }}
                    >
                      <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                        style={{ width: '100%' }}
                        size="large"
                      />
                    </Form.Item>
                  </Card>
                </Col>
              </Row>

              {/* Notes */}
              <Card size="small" title="កំណត់ចំណាំ (ស្រេចចិត្ត)">
                <Form.Item name="notes" style={{ marginBottom: 0 }}>
                  <TextArea
                    rows={4}
                    placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម..."
                    maxLength={500}
                    showCount
                  />
                </Form.Item>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={() => router.push(`/assessments/${params.id}`)}
                  size="large"
                >
                  បោះបង់
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  រក្សាទុក
                </Button>
              </div>
            </Space>
          </Form>
        </Card>
      </div>
    </HorizontalLayout>
  );
}
