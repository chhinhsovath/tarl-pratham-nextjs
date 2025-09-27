'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Select, message, Typography, Space, Divider, Row, Col, Tag } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

interface QuickUser {
  id: number;
  username: string;
  role: string;
  province: string | null;
  subject: string | null;
}

export default function QuickLoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<QuickUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<QuickUser | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    fetchQuickUsers();
  }, []);

  const fetchQuickUsers = async () => {
    try {
      const response = await fetch('/api/auth/quick-users');
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUserSelect = (username: string) => {
    const user = users.find(u => u.username === username);
    setSelectedUser(user || null);
    form.setFieldsValue({ password: 'admin123' }); // Default password like Laravel version
  };

  const onFinish = async (values: { username: string; password: string }) => {
    if (!selectedUser) {
      message.error('Please select a user');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: values.username,
        password: values.password,
        loginType: 'quick'
      });

      if (result?.error) {
        message.error('Invalid username or password');
      } else {
        message.success(`Welcome back, ${selectedUser.username}!`);
        router.push('/dashboard');
      }
    } catch (error) {
      message.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'red';
      case 'coordinator': return 'purple';
      case 'mentor': return 'blue';
      case 'teacher': return 'green';
      default: return 'default';
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{ 
          width: '100%',
          maxWidth: 450, 
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px'
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>Quick ចូល</Title>
            <Text type="secondary">TaRL Pratham - Quick Login</Text>
          </div>

          <Form
            form={form}
            name="quickLogin"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Select User"
              name="username"
              rules={[{ required: true, message: 'Please select a user!' }]}
            >
              <Select
                placeholder="Choose your name from the list"
                size="large"
                loading={usersLoading}
                onChange={handleUserSelect}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase())
                }
              >
                {users.map(user => (
                  <Option key={user.username} value={user.username}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{user.username}</span>
                      <Tag color={getRoleColor(user.role)} size="small">
                        {user.role}
                      </Tag>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedUser && (
              <Card 
                size="small" 
                style={{ 
                  marginBottom: 16, 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef'
                }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Text strong>Role:</Text>
                    <div>
                      <Tag color={getRoleColor(selectedUser.role)}>
                        {selectedUser.role}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>Province:</Text>
                    <div>
                      <Text>{selectedUser.province || 'All'}</Text>
                    </div>
                  </Col>
                  <Col span={24} style={{ marginTop: 8 }}>
                    <Text strong>Subject:</Text>
                    <div>
                      <Text>{selectedUser.subject || 'All'}</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input the password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter password"
                size="large"
                iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                icon={<LoginOutlined />}
                disabled={!selectedUser}
              >
                Quick Login
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">or</Text>
          </Divider>

          <div style={{ textAlign: 'center' }}>
            <Link href="/auth/login">
              <Button type="link" size="large">
                Use Regular Login with Email
              </Button>
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
}