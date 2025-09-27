'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Form, Input, Button, Card, Select, Typography, Space, message } from 'antd';
import { UserOutlined, PhoneOutlined, SaveOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';

const { Title, Text } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
  province: string;
  district: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
    
    // Load existing profile data
    if (session?.user) {
      form.setFieldsValue({
        name: session.user.name || '',
        email: session.user.email || '',
        pilot_school_id: session.user.pilot_school_id || undefined,
        subject: session.user.subject || undefined,
        holding_classes: session.user.holding_classes || undefined,
        phone: session.user.phone || ''
      });
    }
  }, [session, form]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setSchools(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setSchoolsLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await update();
        message.success('Profile updated successfully!');
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Card>
          <Title level={2}>
            <UserOutlined /> Profile Management
          </Title>
          <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
            Manage your profile information and preferences
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            <Form.Item
              label="Name"
              name="name"
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Your name"
                disabled
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
            >
              <Input 
                placeholder="Your email"
                disabled
              />
            </Form.Item>

            <Form.Item
              label="School"
              name="pilot_school_id"
            >
              <Select
                placeholder="Select your school"
                loading={schoolsLoading}
                showSearch
                allowClear
                filterOption={(input, option) => {
                  const schoolName = option?.children?.toString() || '';
                  return schoolName.toLowerCase().includes(input.toLowerCase());
                }}
              >
                {schools.map(school => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name} - {school.district}, {school.province}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Subject"
              name="subject"
            >
              <Select placeholder="Select subject" allowClear>
                <Option value="khmer">Khmer</Option>
                <Option value="math">Mathematics</Option>
                <Option value="both">Both</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Classes"
              name="holding_classes"
            >
              <Select placeholder="Select classes" allowClear>
                <Option value="grade_4">Grade 4</Option>
                <Option value="grade_5">Grade 5</Option>
                <Option value="both">Both</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="012 345 678"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                style={{ minWidth: 150 }}
              >
                Save Profile
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
}