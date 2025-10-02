'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Select, Typography, Space, App, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeTwoTone, UserAddOutlined, EnvironmentOutlined, BookOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
}

function SignupContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState<string>('');

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      const data = await response.json();
      if (data.data) {
        setSchools(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error);
      message.error('មិនអាចផ្ទុកបញ្ជីសាលារៀនបានទេ');
    } finally {
      setSchoolsLoading(false);
    }
  };

  const provinces = [...new Set(schools.map(s => s.province))].sort();
  const filteredSchools = selectedProvince
    ? schools.filter(s => s.province === selectedProvince)
    : schools;

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          role: values.role,
          province: values.province,
          district: values.district,
          subject: values.subject,
          pilot_school_id: values.pilot_school_id,
          holding_classes: values.holding_classes
        })
      });

      const data = await response.json();

      if (!response.ok) {
        message.error(data.error || 'កំហុសបានកើតឡើងក្នុងការចុះឈ្មោះ');
        return;
      }

      message.success(data.message || 'ការចុះឈ្មោះបានជោគជ័យ!');

      // Wait a moment then redirect to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);

    } catch (error) {
      console.error('Signup error:', error);
      message.error('កំហុសបានកើតឡើងក្នុងការចុះឈ្មោះ');
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    form.setFieldsValue({
      pilot_school_id: undefined,
      district: undefined
    });
  };

  const handleSchoolChange = (schoolId: number) => {
    const school = schools.find(s => s.id === schoolId);
    if (school) {
      form.setFieldsValue({
        district: school.district,
        province: school.province
      });
      setSelectedProvince(school.province);
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
          maxWidth: 600,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            <UserAddOutlined /> ចុះឈ្មោះគ្រូបង្រៀន
          </Title>
          <Text type="secondary">
            បង្កើតគណនីថ្មីសម្រាប់ចូលប្រើប្រាស់ប្រព័ន្ធ TaRL
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="username"
                label="ឈ្មោះអ្នកប្រើប្រាស់"
                rules={[
                  { required: true, message: 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់!' },
                  { min: 3, message: 'ឈ្មោះអ្នកប្រើប្រាស់ត្រូវតែមានយ៉ាងហោចណាស់ 3 តួអក្សរ' },
                  {
                    pattern: /^[a-zA-Z0-9._]+$/,
                    message: 'ឈ្មោះអ្នកប្រើប្រាស់គួរតែមានតែអក្សរ លេខ និង . _ ប៉ុណ្ណោះ'
                  }
                ]}
                tooltip="ឧទាហរណ៍៖ sok.samnang, chan.kimsrorn"
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="sok.samnang"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="ពាក្យសម្ងាត់"
                rules={[
                  { required: true, message: 'សូមបញ្ចូលពាក្យសម្ងាត់!' },
                  { min: 6, message: 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="បញ្ចូលពាក្យសម្ងាត់"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="confirm_password"
                label="បញ្ជាក់ពាក្យសម្ងាត់"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'សូមបញ្ជាក់ពាក្យសម្ងាត់!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('ពាក្យសម្ងាត់មិនត្រូវគ្នា!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                  size="large"
                  iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="role"
                label="តួនាទី"
                rules={[{ required: true, message: 'សូមជ្រើសរើសតួនាទី!' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសតួនាទី"
                  size="large"
                >
                  <Option value="teacher">គ្រូបង្រៀន</Option>
                  <Option value="mentor">អ្នកណែនាំ</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="subject"
                label="មុខវិជ្ជា"
                rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា!' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសមុខវិជ្ជា"
                  size="large"
                  prefix={<BookOutlined />}
                >
                  <Option value="គណិតវិទ្យា">គណិតវិទ្យា</Option>
                  <Option value="ភាសាខ្មែរ">ភាសាខ្មែរ</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="province"
                label="ខេត្ត/រាជធានី"
                rules={[{ required: true, message: 'សូមជ្រើសរើសខេត្ត!' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសខេត្ត"
                  size="large"
                  loading={schoolsLoading}
                  onChange={handleProvinceChange}
                  showSearch
                  optionFilterProp="children"
                  prefix={<EnvironmentOutlined />}
                >
                  {provinces.map(province => (
                    <Option key={province} value={province}>
                      {province}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="holding_classes"
                label="ថ្នាក់រៀនបង្រៀន"
                rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់រៀន!' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសថ្នាក់រៀន"
                  size="large"
                  mode="multiple"
                >
                  <Option value="ថ្នាក់ទី៤">ថ្នាក់ទី៤</Option>
                  <Option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="pilot_school_id"
            label="សាលារៀន"
            rules={[{ required: true, message: 'សូមជ្រើសរើសសាលារៀន!' }]}
          >
            <Select
              placeholder="ជ្រើសរើសសាលារៀន"
              size="large"
              loading={schoolsLoading}
              onChange={handleSchoolChange}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                const label = option?.label?.toString() || '';
                return label.toLowerCase().includes(input.toLowerCase());
              }}
            >
              {filteredSchools.map(school => (
                <Option
                  key={school.id}
                  value={school.id}
                  label={`${school.school_name} (${school.school_code})`}
                >
                  <div>
                    <div><strong>{school.school_name}</strong></div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {school.school_code} - {school.district}
                    </Text>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="district"
            label="ស្រុក/ខណ្ឌ"
            hidden
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{ width: '100%', height: 48, fontSize: 16 }}
            >
              ចុះឈ្មោះ
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              មានគណនីរួចហើយ? {' '}
              <Link href="/auth/login" style={{ fontWeight: 500 }}>
                ចូលប្រើប្រាស់
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <App>
      <SignupContent />
    </App>
  );
}
