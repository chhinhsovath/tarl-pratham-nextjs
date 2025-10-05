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
  InputNumber
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function EditAssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (params.id) {
      fetchAssessment();
      fetchStudents();
    }
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assessments/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      const assessment = data.assessment || data.data;

      // Set form values
      form.setFieldsValue({
        student_id: assessment.student_id,
        assessment_type: assessment.assessment_type,
        subject: assessment.subject,
        level: assessment.level,
        score: assessment.score,
        assessed_date: assessment.assessed_date ? dayjs(assessment.assessed_date) : null,
        notes: assessment.notes
      });
    } catch (error) {
      console.error('Error fetching assessment:', error);
      message.error('មិនអាចទាញយកទិន្នន័យការវាយតម្លៃបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
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

        {/* Edit Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="student_id"
              label="សិស្ស"
              rules={[{ required: true, message: 'សូមជ្រើសរើសសិស្ស' }]}
            >
              <Select
                placeholder="ជ្រើសរើសសិស្ស"
                showSearch
                optionFilterProp="children"
                size="large"
              >
                {students.map((student: any) => (
                  <Option key={student.id} value={student.id}>
                    {student.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="assessment_type"
              label="ប្រភេទការវាយតម្លៃ"
              rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទ' }]}
            >
              <Select placeholder="ជ្រើសរើសប្រភេទ" size="large">
                <Option value="baseline">តេស្តដើមគ្រា</Option>
                <Option value="midline">តេស្តពាក់កណ្ដាលគ្រា</Option>
                <Option value="endline">តេស្តចុងក្រោយគ្រា</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="subject"
              label="មុខវិជ្ជា"
              rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា' }]}
            >
              <Select placeholder="ជ្រើសរើសមុខវិជ្ជា" size="large">
                <Option value="language">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="level"
              label="កម្រិត TaRL"
            >
              <Select placeholder="ជ្រើសរើសកម្រិត" allowClear size="large">
                <Option value="beginner">កម្រិតដំបូង</Option>
                <Option value="letter">តួអក្សរ</Option>
                <Option value="word">ពាក្យ</Option>
                <Option value="paragraph">កថាខណ្ឌ</Option>
                <Option value="story">រឿង</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="score"
              label="ពិន្ទុ (%)"
              rules={[
                { required: true, message: 'សូមបញ្ចូលពិន្ទុ' },
                { type: 'number', min: 0, max: 100, message: 'ពិន្ទុត្រូវតែនៅចន្លោះ 0 និង 100' }
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="បញ្ចូលពិន្ទុ"
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="assessed_date"
              label="កាលបរិច្ឆេទវាយតម្លៃ"
              rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="notes"
              label="កំណត់សម្គាល់"
            >
              <TextArea
                rows={4}
                placeholder="បញ្ចូលកំណត់សម្គាល់បន្ថែម (ប្រសិនបើមាន)"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex gap-3">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  រក្សាទុក
                </Button>
                <Button
                  onClick={() => router.push(`/assessments/${params.id}`)}
                  size="large"
                >
                  បោះបង់
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </HorizontalLayout>
  );
}
