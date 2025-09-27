'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Select, Typography, Space, Row, Col, Tag, App } from 'antd';
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

function LoginContent() {
  const router = useRouter();
  const { message } = App.useApp();
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
      const response = await fetch('/api/users/quick-login');
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
        // Group users by role
        const grouped = data.users.reduce((acc: Record<string, QuickUser[]>, user: QuickUser) => {
          if (!acc[user.role]) acc[user.role] = [];
          acc[user.role].push(user);
          return acc;
        }, {});
        setGroupedUsers(grouped);
      }
    } catch (error) {
      console.error('Failed to fetch quick users:', error);
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

  const formatRoleName = (role: string) => {
    switch(role) {
      case 'admin': return 'អ្នកគ្រប់គ្រង';
      case 'coordinator': return 'អ្នកសម្របសម្រួល';
      case 'mentor': return 'អ្នកណែនាំ';
      case 'teacher': return 'គ្រូបង្រៀន';
      case 'viewer': return 'អ្នកមើល';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'red';
      case 'coordinator': return 'purple';
      case 'mentor': return 'blue';
      case 'teacher': return 'green';
      case 'viewer': return 'default';
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
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            <LoginOutlined /> TaRL កម្ពុជា
          </Title>
          <Text type="secondary">
            ប្រព័ន្ធគ្រប់គ្រងការបង្រៀនតាមកម្រិតត្រឹមត្រូវ
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="ជ្រើសអ្នកប្រើប្រាស់"
            rules={[{ required: true, message: 'សូមជ្រើសអ្នកប្រើប្រាស់!' }]}
          >
            <Select
              placeholder="-- ជ្រើសរើសអ្នកប្រើប្រាស់ --"
              size="large"
              loading={usersLoading}
              onChange={handleUserSelect}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                <OptGroup key={role} label={formatRoleName(role)}>
                  {roleUsers.map(user => (
                    <Option 
                      key={user.username} 
                      value={user.username}
                      label={user.username}
                    >
                      <Space>
                        <UserOutlined />
                        <span>{user.username}</span>
                        <Tag color={getRoleColor(user.role)} style={{ marginLeft: 8 }}>
                          {formatRoleName(user.role)}
                        </Tag>
                      </Space>
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="password"
            label="ពាក្យសម្ងាត់"
            rules={[{ required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="បញ្ចូលពាក្យសម្ងាត់ (admin123)"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%', height: 48, fontSize: 16 }}
            >
              ចូលប្រើប្រាស់
            </Button>
          </Form.Item>

          {selectedUser && (
            <div style={{ 
              textAlign: 'center', 
              padding: '12px', 
              background: '#f0f9ff', 
              borderRadius: '8px',
              marginTop: 16
            }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                កំពុងចូលជា: <strong>{selectedUser.username}</strong>
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                តួនាទី: <Tag color={getRoleColor(selectedUser.role)} size="small">{formatRoleName(selectedUser.role)}</Tag>
              </Text>
            </div>
          )}
        </Form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 24, 
          padding: '16px', 
          background: '#fef3c7', 
          borderRadius: '8px' 
        }}>
          <Text style={{ fontSize: 13, color: '#92400e' }}>
            <strong>សម្រាប់សាកល្បង:</strong> ប្រើពាក្យសម្ងាត់ <strong>admin123</strong>
          </Text>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <App>
      <LoginContent />
    </App>
  );
}