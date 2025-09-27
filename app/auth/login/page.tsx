'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Select, message, Typography, Space, Row, Col, Tag } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option, OptGroup } = Select;

interface QuickUser {
  id: number;
  username: string;
  role: string;
  province: string | null;
  subject: string | null;
}

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<QuickUser[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<Record<string, QuickUser[]>>({});
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
        setGroupedUsers(data.groupedUsers || {});
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
    // Update form fields to ensure validation passes
    form.setFieldsValue({ 
      username: username,
      password: 'admin123' 
    });
    // Clear any validation errors on the username field
    form.setFields([
      {
        name: 'username',
        errors: [],
      },
    ]);
  };

  const onFinish = async (values: { username: string; password: string }) => {
    // Extra validation - this should not be needed if form validation works correctly
    if (!values.username || !selectedUser) {
      message.error('សូមជ្រើសអ្នកប្រើប្រាស់!');
      return;
    }

    if (!values.password) {
      message.error('សូមបញ្ចូលពាក្យសម្ងាត់!');
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
        message.error('ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
      } else {
        message.success(`សូមស្វាគមន៍ ${selectedUser.username}!`);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('កំហុសបានកើតឡើងអំឡុងពេលចូល');
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
      case 'viewer': return 'orange';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'អ្នកគ្រប់គ្រង';
      case 'coordinator': return 'អ្នកសម្របសម្រួល';
      case 'mentor': return 'អ្នកណែនាំ';
      case 'teacher': return 'គ្រូបង្រៀន';
      case 'viewer': return 'អ្នកមើល';
      default: return role;
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
            <Title level={2} style={{ marginBottom: 8 }}>TaRL Pratham</Title>
            <Text type="secondary">Teaching at the Right Level - ចូលប្រព័ន្ធ</Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            data-testid="quick-login-form"
          >
            <Form.Item
              label="ជ្រើសអ្នកប្រើប្រាស់"
              name="username"
              rules={[{ required: true, message: 'សូមជ្រើសអ្នកប្រើប្រាស់!' }]}
            >
              <Select
                placeholder="ជ្រើសឈ្មោះរបស់អ្នកពីបញ្ជី"
                size="large"
                loading={usersLoading}
                onChange={handleUserSelect}
                showSearch
                filterOption={(input, option) => {
                  if (!option?.value) return false;
                  return option.value.toString().toLowerCase().includes(input.toLowerCase());
                }}
              >
                {['admin', 'coordinator', 'mentor', 'teacher', 'viewer'].map(role => 
                  groupedUsers[role] && groupedUsers[role].length > 0 && (
                    <OptGroup key={role} label={getRoleLabel(role)}>
                      {groupedUsers[role].map(user => (
                        <Option key={user.username} value={user.username}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{user.username} ({user.role})</span>
                            {user.province && user.province !== 'All' && (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                ({user.province})
                              </Text>
                            )}
                            {user.subject && user.subject !== 'All' && (
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                - {user.subject}
                              </Text>
                            )}
                          </div>
                        </Option>
                      ))}
                    </OptGroup>
                  )
                )}
              </Select>
              
              {/* Users count */}
              <p style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                បង្ហាញអ្នកប្រើប្រាស់ {users.length} នាក់
              </p>
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
                    <Text strong>តួនាទី:</Text>
                    <div>
                      <Tag color={getRoleColor(selectedUser.role)}>
                        {getRoleLabel(selectedUser.role)}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>ខេត្ត:</Text>
                    <div>
                      <Text>{selectedUser.province || 'ទាំងអស់'}</Text>
                    </div>
                  </Col>
                  <Col span={24} style={{ marginTop: 8 }}>
                    <Text strong>មុខវិជ្ជា:</Text>
                    <div>
                      <Text>{selectedUser.subject || 'ទាំងអស់'}</Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            <Form.Item
              label="ពាក្យសម្ងាត់"
              name="password"
              rules={[{ required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="បញ្ចូលពាក្យសម្ងាត់"
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
                ចូលប្រព័ន្ធ
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}