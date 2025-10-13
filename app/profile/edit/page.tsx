'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Form, Input, Button, Card, Select, Typography, Space, message, Divider, Tabs } from 'antd';
import { UserOutlined, PhoneOutlined, SaveOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface PilotSchool {
  id: number;
  school_name: string;
  province: string;
  district: string;
}

export default function ProfileEditPage() {
  const { data: session, update } = useSession();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);

  useEffect(() => {
    fetchSchools();
    
    // Load existing profile data
    if (session?.user) {
      profileForm.setFieldsValue({
        name: session.user.name || '',
        email: session.user.email || '',
        pilot_school_id: session.user.pilot_school_id || undefined,
        subject: session.user.subject || undefined,
        holding_classes: session.user.holding_classes || undefined,
        phone: session.user.phone || ''
      });
    }
  }, [session, profileForm]);

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

  const onProfileFinish = async (values: any) => {
    setProfileLoading(true);
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
        message.success('ព័ត៌មានប្រវត្តិរូបបានធ្វើបច្ចុប្បន្នភាពបានជោគជ័យ!');
      } else {
        message.error('មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូប');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      message.error('មានកំហុសមិនរំពឹងទុក');
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា');
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/profile/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        }),
      });

      if (response.ok) {
        passwordForm.resetFields();
        message.success('ពាក្យសម្ងាត់បានផ្លាស់ប្តូរបានជោគជ័យ!');
      } else {
        const error = await response.json();
        message.error(error.message || 'មានបញ្ហាក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់');
      }
    } catch (error) {
      console.error('Password change error:', error);
      message.error('មានកំហុសមិនរំពឹងទុក');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <HorizontalLayout>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
        <Card>
          <Title level={2}>
            <UserOutlined /> កែប្រែព័ត៌មានប្រវត្តិរូប
          </Title>
          <Text type="secondary" style={{ marginBottom: 24, display: 'block' }}>
            គ្រប់គ្រងព័ត៌មានប្រវត្តិរូប និងពាក្យសម្ងាត់របស់អ្នក
          </Text>

          <Tabs defaultActiveKey="profile">
            <TabPane tab="ព័ត៌មានប្រវត្តិរូប" key="profile">
              <Form
                form={profileForm}
                layout="vertical"
                onFinish={onProfileFinish}
                size="large"
              >
                <Form.Item
                  label="ឈ្មោះ"
                  name="name"
                  rules={[{ required: true, message: 'សូមបំពេញឈ្មោះ' }]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="ឈ្មោះរបស់អ្នក"
                  />
                </Form.Item>

                <Form.Item
                  label="អ៊ីមែល"
                  name="email"
                  rules={[
                    { required: true, message: 'សូមបំពេញអ៊ីមែល' }
                  ]}
                >
                  <Input
                    placeholder="អ៊ីមែលរបស់អ្នក"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="សាលារៀន"
                  name="pilot_school_id"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសសាលារៀន' }]}
                >
                  <Select
                    placeholder="ជ្រើសរើសសាលារៀនរបស់អ្នក"
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
                  label="មុខវិជ្ជា"
                  name="subject"
                >
                  <Select placeholder="ជ្រើសរើសមុខវិជ្ជា" allowClear>
                    <Option value="khmer">ភាសាខ្មែរ</Option>
                    <Option value="math">គណិតវិទ្យា</Option>
                    <Option value="both">ទាំងពីរ</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="ថ្នាក់រៀន"
                  name="holding_classes"
                >
                  <Select placeholder="ជ្រើសរើសថ្នាក់រៀន" allowClear>
                    <Option value="grade_4">ថ្នាក់ទី៤</Option>
                    <Option value="grade_5">ថ្នាក់ទី៥</Option>
                    <Option value="both">ទាំងពីរ</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="លេខទូរស័ព្ទ"
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
                    loading={profileLoading}
                    icon={<SaveOutlined />}
                    style={{ minWidth: 150 }}
                  >
                    រក្សាទុកព័ត៌មាន
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="ផ្លាស់ប្តូរពាក្យសម្ងាត់" key="password" id="password-update">
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={onPasswordFinish}
                size="large"
              >
                <Form.Item
                  label="ពាក្យសម្ងាត់បច្ចុប្បន្ន"
                  name="currentPassword"
                  rules={[{ required: true, message: 'សូមបំពេញពាក្យសម្ងាត់បច្ចុប្បន្ន' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="ពាក្យសម្ងាត់បច្ចុប្បន្ន"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item
                  label="ពាក្យសម្ងាត់ថ្មី"
                  name="newPassword"
                  rules={[
                    { required: true, message: 'សូមបំពេញពាក្យសម្ងាត់ថ្មី' },
                    { min: 6, message: 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="ពាក្យសម្ងាត់ថ្មី"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item
                  label="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                  name="confirmPassword"
                  rules={[
                    { required: true, message: 'សូមបញ្ជាក់ពាក្យសម្ងាត់ថ្មី' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('newPassword') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('ពាក្យសម្ងាត់មិនត្រូវគ្នា'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={passwordLoading}
                    icon={<LockOutlined />}
                    style={{ minWidth: 150 }}
                  >
                    ផ្លាស់ប្តូរពាក្យសម្ងាត់
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </HorizontalLayout>
  );
}