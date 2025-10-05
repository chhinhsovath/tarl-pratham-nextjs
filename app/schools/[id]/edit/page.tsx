'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  Switch,
  Row,
  Col
} from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Option } = Select;
const { TextArea } = Input;

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSchool();
    }
  }, [params.id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pilot-schools/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch school');
      }

      const data = await response.json();
      const school = data.school || data.data;

      // Set form values
      form.setFieldsValue({
        school_name: school.school_name,
        school_code: school.school_code,
        school_type: school.school_type,
        province: school.province,
        district: school.district,
        commune: school.commune,
        village: school.village,
        address: school.address,
        director_name: school.director_name,
        director_phone: school.director_phone,
        email: school.email,
        phone: school.phone,
        is_active: school.is_active,
        pilot_program: school.pilot_program
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      message.error('មិនអាចទាញយកទិន្នន័យសាលារៀនបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const response = await fetch(`/api/pilot-schools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update school');
      }

      message.success('សាលារៀនត្រូវបានកែប្រែដោយជោគជ័យ');
      router.push(`/schools/${params.id}`);
    } catch (error: any) {
      console.error('Error updating school:', error);
      message.error(error.message || 'មិនអាចកែប្រែសាលារៀនបានទេ');
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/schools/${params.id}`)}
            className="mb-4"
          >
            ត្រលប់ទៅវិញ
          </Button>

          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            កែសម្រួលសាលារៀន
          </h1>
          <p className="text-gray-600">
            កែប្រែព័ត៌មានសាលារៀនលេខ #{params.id}
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
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="school_name"
                  label="ឈ្មោះសាលា"
                  rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសាលា' }]}
                >
                  <Input placeholder="បញ្ចូលឈ្មោះសាលា" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="school_code"
                  label="លេខកូដសាលា"
                  rules={[{ required: true, message: 'សូមបញ្ចូលលេខកូដសាលា' }]}
                >
                  <Input placeholder="បញ្ចូលលេខកូដសាលា" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="school_type"
              label="ប្រភេទសាលា"
            >
              <Select placeholder="ជ្រើសរើសប្រភេទសាលា" allowClear size="large">
                <Option value="មត្តេយ្យសិក្សា">មត្តេយ្យសិក្សា</Option>
                <Option value="បឋមសិក្សា">បឋមសិក្សា</Option>
                <Option value="អនុវិទ្យាល័យ">អនុវិទ្យាល័យ</Option>
                <Option value="វិទ្យាល័យ">វិទ្យាល័យ</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="province"
                  label="ខេត្ត"
                  rules={[{ required: true, message: 'សូមបញ្ចូលខេត្ត' }]}
                >
                  <Input placeholder="បញ្ចូលខេត្ត" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="district"
                  label="ស្រុក/ខណ្ឌ"
                  rules={[{ required: true, message: 'សូមបញ្ចូលស្រុក/ខណ្ឌ' }]}
                >
                  <Input placeholder="បញ្ចូលស្រុក/ខណ្ឌ" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="commune"
                  label="ឃុំ/សង្កាត់"
                >
                  <Input placeholder="បញ្ចូលឃុំ/សង្កាត់" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="village"
                  label="ភូមិ"
                >
                  <Input placeholder="បញ្ចូលភូមិ" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="អាសយដ្ឋាន"
            >
              <TextArea
                rows={3}
                placeholder="បញ្ចូលអាសយដ្ឋានពេញលេញ"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="director_name"
                  label="ឈ្មោះនាយកសាលា"
                >
                  <Input placeholder="បញ្ចូលឈ្មោះនាយកសាលា" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="director_phone"
                  label="លេខទូរស័ព្ទនាយក"
                >
                  <Input placeholder="បញ្ចូលលេខទូរស័ព្ទនាយក" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="អ៊ីមែលសាលា"
                  rules={[{ type: 'email', message: 'សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ' }]}
                >
                  <Input placeholder="បញ្ចូលអ៊ីមែល" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phone"
                  label="លេខទូរស័ព្ទសាលា"
                >
                  <Input placeholder="បញ្ចូលលេខទូរស័ព្ទសាលា" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="is_active"
                  label="ស្ថានភាព"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="សកម្ម"
                    unCheckedChildren="អសកម្ម"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="pilot_program"
                  label="កម្មវិធីសាកល្បង"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="បាទ/ចាស"
                    unCheckedChildren="ទេ"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item className="mt-6">
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
                  onClick={() => router.push(`/schools/${params.id}`)}
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
