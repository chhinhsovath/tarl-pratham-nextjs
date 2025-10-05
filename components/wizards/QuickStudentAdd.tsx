'use client';

import { useState } from 'react';
import { Form, Input, Select, Button, Space, Card, message, Row, Col } from 'antd';
import { UserAddOutlined, CloseOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';

const { Option } = Select;

interface QuickStudentAddProps {
  onSuccess: (student: any) => void;
  onCancel: () => void;
}

export default function QuickStudentAdd({ onSuccess, onCancel }: QuickStudentAddProps) {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          gender: values.gender,
          grade_level: values.grade_level,
          date_of_birth: values.date_of_birth || null,
          pilot_school_id: session?.user?.pilot_school_id || null
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create student');
      }

      message.success('បានបន្ថែមសិស្សជោគជ័យ!');
      form.resetFields();
      onSuccess(result.data);
    } catch (error: any) {
      message.error(error.message || 'មានបញ្ហាក្នុងការបន្ថែមសិស្ស');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <UserAddOutlined />
          <span>បន្ថែមសិស្សថ្មី</span>
        </Space>
      }
      extra={
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onCancel}
        >
          បិទ
        </Button>
      }
      style={{
        marginBottom: '16px',
        border: '2px solid #1890ff',
        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)'
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          gender: 'ប្រុស',
          grade_level: 4
        }}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="ឈ្មោះសិស្ស"
              name="name"
              rules={[
                { required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស' },
                { min: 2, message: 'ឈ្មោះត្រូវមានយ៉ាងហោចណាស់ 2 តួអក្សរ' }
              ]}
            >
              <Input
                size="large"
                placeholder="បញ្ចូលឈ្មោះពេញ"
                autoFocus
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              label="ភេទ"
              name="gender"
              rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ' }]}
            >
              <Select size="large">
                <Option value="ប្រុស">ប្រុស</Option>
                <Option value="ស្រី">ស្រី</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={6}>
            <Form.Item
              label="ថ្នាក់"
              name="grade_level"
              rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់' }]}
            >
              <Select size="large">
                <Option value={1}>ថ្នាក់ទី១</Option>
                <Option value={2}>ថ្នាក់ទី២</Option>
                <Option value={3}>ថ្នាក់ទី៣</Option>
                <Option value={4}>ថ្នាក់ទី៤</Option>
                <Option value={5}>ថ្នាក់ទី៥</Option>
                <Option value={6}>ថ្នាក់ទី៦</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="ឆ្នាំកំណើត (ស្រេចចិត្ត)"
              name="date_of_birth"
            >
              <Input
                size="large"
                type="number"
                placeholder="ឧទាហរណ៍: 2015"
                min={2000}
                max={new Date().getFullYear()}
              />
            </Form.Item>
          </Col>
        </Row>

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            size="large"
            onClick={onCancel}
            disabled={loading}
          >
            បោះបង់
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
            icon={<UserAddOutlined />}
          >
            បន្ថែមសិស្ស
          </Button>
        </Space>
      </Form>
    </Card>
  );
}
