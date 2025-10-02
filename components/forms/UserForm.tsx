'use client';

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  message,
  Spin 
} from 'antd';
import { User } from '@/types/user';

const { Option } = Select;

interface UserFormProps {
  user?: User;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  province?: string;
  subject?: string;
  phone?: string;
  pilot_school_id?: number;
}

const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  loading = false, 
  mode 
}) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [pilotSchools, setPilotSchools] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchFormData();
    if (user && mode === 'edit') {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        province: user.province,
        subject: user.subject,
        phone: user.phone,
        pilot_school_id: user.pilot_school_id
      });
    }
  }, [user, mode, form]);

  const fetchFormData = async () => {
    setLoadingData(true);
    try {
      const [provincesRes, schoolsRes] = await Promise.all([
        fetch('/api/provinces'),
        fetch('/api/pilot-schools')
      ]);

      if (provincesRes.ok) {
        const provincesData = await provincesRes.json();
        setProvinces(provincesData.provinces || []);
      }

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setPilotSchools(schoolsData.schools || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
      message.error('Failed to load form data');
    } finally {
      setLoadingData(false);
    }
  };

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

  const validateEmail = async (rule: any, value: string) => {
    if (!value) return Promise.resolve();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject('Invalid email format');
    }

    // Check uniqueness for new users or different email
    if (mode === 'create' || (user && user.email !== value)) {
      try {
        const response = await fetch(
          `/api/users/validate-email?email=${encodeURIComponent(value)}${
            user ? `&exclude=${user.id}` : ''
          }`
        );
        const data = await response.json();
        
        if (!data.isUnique) {
          return Promise.reject('Email address is already in use');
        }
      } catch (error) {
        return Promise.reject('Unable to validate email');
      }
    }

    return Promise.resolve();
  };

  const roles = [
    { value: 'admin', label: 'Admin (អ្នកគ្រប់គ្រង)' },
    { value: 'coordinator', label: 'Coordinator (សម្របសម្រួល)' },
    { value: 'mentor', label: 'Mentor (អ្នកណែនាំ)' },
    { value: 'teacher', label: 'Teacher (គ្រូបង្រៀន)' },
    { value: 'viewer', label: 'Viewer (អ្នកមើល)' }
  ];

  const subjects = [
    'Khmer Language',
    'Mathematics',
    'Science',
    'Social Studies',
    'English',
    'Physical Education',
    'Arts',
    'Other'
  ];

  if (loadingData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading form data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={mode === 'create' ? 'Create New User' : 'Edit User'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Full Name"
              rules={[
                { required: true, message: 'Name is required' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Email is required' },
                { validator: validateEmail }
              ]}
            >
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { 
                  required: mode === 'create', 
                  message: 'Password is required' 
                },
                { 
                  min: 6, 
                  message: 'Password must be at least 6 characters' 
                }
              ]}
            >
              <Input.Password 
                placeholder={
                  mode === 'create' 
                    ? "Enter password" 
                    : "Leave blank to keep current password"
                } 
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Role is required' }]}
            >
              <Select placeholder="ជ្រើសរើសតួនាទី">
                {roles.map(role => (
                  <Option key={role.value} value={role.value}>
                    {role.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="province"
              label="Province"
            >
              <Select placeholder="ជ្រើសរើសខេត្ត" allowClear>
                {provinces.map((province: any) => (
                  <Option key={province.id} value={province.name_english}>
                    {province.name_english} ({province.name_khmer})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="subject"
              label="Teaching Subject"
            >
              <Select placeholder="ជ្រើសរើសមុខវិជ្ជា" allowClear>
                {subjects.map(subject => (
                  <Option key={subject} value={subject}>
                    {subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                {
                  pattern: /^[+]?[\d\s\-()]+$/,
                  message: 'Invalid phone number format'
                }
              ]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="pilot_school_id"
              label="Pilot School (for Mentors/Teachers)"
            >
              <Select placeholder="ជ្រើសរើសសាលាសាកល្បង" allowClear>
                {pilotSchools.map((school: any) => (
                  <Option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ marginRight: 8 }}
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
          
          <Button 
            onClick={() => form.resetFields()}
            disabled={loading}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default UserForm;