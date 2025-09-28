"use client";

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Switch, Space, Typography, message, Row, Col } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Title } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role: string;
  pilot_school_id?: number;
  is_active: boolean;
  assigned_schools?: number[];
}

export default function CreateUserPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Check admin access
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/pilot-schools');
        if (response.ok) {
          const data = await response.json();
          setSchools(data.schools || []);
        }
      } catch (error) {
        console.error('Error fetching schools:', error);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchSchools();
    }
  }, [session]);

  const handleSubmit = async (values: FormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
        pilot_school_id: values.pilot_school_id,
        is_active: values.is_active,
        assigned_schools: values.assigned_schools || [],
      };

      const response = await fetch('/api/rbac/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        router.push('/rbac');
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      message.error('Error creating user');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    
    // Clear school fields when role changes
    if (role !== 'mentor') {
      form.setFieldValue('assigned_schools', undefined);
    }
    if (!['teacher', 'mentor'].includes(role)) {
      form.setFieldValue('pilot_school_id', undefined);
    }
  };

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Space style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/rbac')}
        >
          Back to RBAC
        </Button>
      </Space>

      <Card>
        <Title level={3}>
          <UserOutlined style={{ marginRight: '8px' }} />
          Create New User
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: true,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="Enter full name"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter email address"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Enter password"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="Confirm password"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number (Optional)"
              >
                <Input 
                  prefix={<PhoneOutlined />} 
                  placeholder="Enter phone number"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="role"
                label="User Role"
                rules={[{ required: true, message: 'Role is required' }]}
              >
                <Select 
                  placeholder="Select user role"
                  size="large"
                  onChange={handleRoleChange}
                >
                  <Option value="admin">Admin</Option>
                  <Option value="coordinator">Coordinator</Option>
                  <Option value="mentor">Mentor</Option>
                  <Option value="teacher">Teacher</Option>
                  <Option value="viewer">Viewer</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {(selectedRole === 'teacher' || selectedRole === 'mentor') && (
            <Form.Item
              name="pilot_school_id"
              label="Primary School"
              rules={[{ required: true, message: 'School assignment is required for this role' }]}
            >
              <Select 
                placeholder="Select primary school"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {schools.map(school => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {selectedRole === 'mentor' && (
            <Form.Item
              name="assigned_schools"
              label="Additional Assigned Schools (Optional)"
              help="Mentors can be assigned to multiple schools for visits and oversight"
            >
              <Select 
                mode="multiple"
                placeholder="Select additional schools"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {schools.map(school => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="is_active"
            label="Account Status"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: '32px' }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={loading}
              >
                Create User
              </Button>
              <Button 
                size="large"
                onClick={() => router.push('/rbac')}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}