'use client';

import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  message
} from 'antd';

const { Option } = Select;

interface StudentFormProps {
  student?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
}

interface FormData {
  student_id?: string;
  name: string;
  gender?: string;
  grade?: number;
}

const StudentForm: React.FC<StudentFormProps> = ({
  student,
  onSubmit,
  loading = false,
  mode
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (student && mode === 'edit') {
      form.setFieldsValue({
        student_id: student.student_id,
        name: student.name,
        gender: student.gender,
        grade: student.grade
      });
    }
  }, [student, mode, form]);

  const handleSubmit = async (values: FormData) => {
    try {
      await onSubmit(values);
      if (mode === 'create') {
        form.resetFields();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="student_id"
              label="លេខសម្គាល់សិស្ស"
            >
              <Input
                placeholder="បញ្ចូលលេខសម្គាល់សិស្ស"
                size="large"
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
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

          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="gender"
              label="ភេទ"
            >
              <Select placeholder="ជ្រើសរើសភេទ" size="large">
                <Option value="male">ប្រុស</Option>
                <Option value="female">ស្រី</Option>
                <Option value="other">ផ្សេងទៀត</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={8}>
            <Form.Item
              name="grade"
              label="ថ្នាក់"
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
            loading={loading}
            size="large"
          >
            {mode === 'create' ? 'បង្កើតសិស្ស' : 'រក្សាទុក'}
          </Button>
          <Button
            className="ml-2"
            onClick={() => form.resetFields()}
            size="large"
          >
            សម្អាត
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StudentForm;
