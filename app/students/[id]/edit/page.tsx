'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { message, Spin, Card, Form, Input, Select, Button, Row, Col } from 'antd';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import { trackActivity } from '@/lib/trackActivity';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Option } = Select;

function EditStudentPageContent() {
  const router = useRouter();
  const params = useParams();
  const studentId = params?.id as string;
  const { data: session } = useSession();
  const user = session?.user;
  const [form] = Form.useForm();

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check permissions
  if (!hasPermission(user, 'students.edit')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    if (studentId) {
      fetchStudent();
    }
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await fetch(`/api/students/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setStudent(data.student);

        // Set form values
        form.setFieldsValue({
          student_id: data.student.student_id,
          name: data.student.name,
          gender: data.student.gender,
          grade: data.student.grade
        });
      } else {
        message.error('រកមិនឃើញសិស្ស');
        router.push('/students');
      }
    } catch (error) {
      console.error('Fetch student error:', error);
      message.error('មិនអាចផ្ទុកទិន្នន័យសិស្ស');
      router.push('/students');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        const data = await response.json();
        message.success('កែប្រែសិស្សបានជោគជ័យ! 🎉');

        // Track activity: User edited a student
        trackActivity('student_edit');

        router.push('/students');
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចកែប្រែសិស្ស');
      }
    } catch (error) {
      console.error('Update student error:', error);
      message.error('មិនអាចកែប្រែសិស្ស');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>កំពុងផ្ទុកទិន្នន័យសិស្ស...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => router.push('/students')}
        className="mb-4"
        size="large"
      >
        ត្រលប់ទៅវិញ
      </Button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        កែសម្រួលសិស្ស
      </h1>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="student_id"
                label="លេខសម្គាល់សិស្ស"
                rules={[{ required: true, message: 'សូមបញ្ចូលលេខសម្គាល់សិស្ស!' }]}
              >
                <Input
                  placeholder="បញ្ចូលលេខសម្គាល់សិស្ស"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="name"
                label="ឈ្មោះ"
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស!' }]}
              >
                <Input
                  placeholder="បញ្ចូលឈ្មោះសិស្ស"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="gender"
                label="ភេទ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ!' }]}
              >
                <Select placeholder="ជ្រើសរើសភេទ" size="large">
                  <Option value="male">ប្រុស</Option>
                  <Option value="female">ស្រី</Option>
                  <Option value="other">ផ្សេងទៀត</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={12}>
              <Form.Item
                name="grade"
                label="ថ្នាក់"
                rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់!' }]}
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់" size="large">
                  <Option value={4}>ថ្នាក់ទី៤</Option>
                  <Option value={5}>ថ្នាក់ទី៥</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mt-4">
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              size="large"
            >
              រក្សាទុក
            </Button>
            <Button
              className="ml-2"
              onClick={() => router.push('/students')}
              size="large"
              disabled={submitting}
            >
              បោះបង់
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default function EditStudentPage() {
  return (
    <HorizontalLayout>
      <EditStudentPageContent />
    </HorizontalLayout>
  );
}
