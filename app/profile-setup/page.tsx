'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Select, message, Typography, Space, Alert, Radio, App } from 'antd';
import { UserOutlined, PhoneOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
  province: string;
  district: string;
}

function ProfileSetupContent() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const { message } = App.useApp();

  const isFirstTime = !session?.user?.pilot_school_id || !session?.user?.subject || !session?.user?.holding_classes;
  const isMentor = session?.user?.role === 'mentor';

  useEffect(() => {
    fetchSchools();
    
    // Pre-fill form with existing data
    if (session?.user) {
      form.setFieldsValue({
        pilot_school_id: session.user.pilot_school_id,
        subject: session.user.subject,
        holding_classes: session.user.holding_classes,
        phone: session.user.phone || ''
      });
    }
  }, [session, form]);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but got:', contentType, text.substring(0, 200));
        throw new Error('Expected JSON response but got: ' + contentType);
      }
      
      const data = await response.json();
      if (data.data) {
        setSchools(data.data.map((school: any) => ({
          id: school.id,
          school_name: school.school_name,
          province: school.province,
          district: school.district
        })));
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('Failed to load schools');
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
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the session with new data
        await update();
        
        const successMessage = isMentor && isFirstTime
          ? 'ប្រវត្តិរូបបានបំពេញដោយជោគជ័យ! ការកំណត់ប្រវត្តិរូបរបស់អ្នកនឹងត្រូវកំណត់ឡើងវិញបន្ទាប់ពី 48 ម៉ោង។'
          : 'ប្រវត្តិរូបបានបំពេញដោយជោគជ័យ!';
        
        message.success(successMessage);
        
        if (isFirstTime) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      } else {
        message.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      message.error('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/login' });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Welcome Banner */}
        <Card 
          style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            color: 'white',
            marginBottom: 24,
            border: 'none'
          }}
        >
          <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
            {isFirstTime ? `សូមស្វាគមន៍, ${session?.user?.name}!` : `កែប្រែប្រវត្តិរូប - ${session?.user?.name}`}
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
            {isFirstTime 
              ? 'សូមបំពេញព័ត៌មានរៀបចំប្រវត្តិរូបរបស់អ្នកដើម្បីចាប់ផ្តើមគ្រប់គ្រងថ្នាក់របស់អ្នក'
              : 'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានប្រវត្តិរូប និងការចាត់តាំងបង្រៀនរបស់អ្នក'
            }
          </Text>
        </Card>

        {/* Mentor Notice */}
        {isMentor && (
          <Alert
            message="សម្គាល់សម្រាប់អ្នកណែនាំ"
            description="ទិន្នន័យទាំងអស់ដែលអ្នកបង្កើត (សិស្ស, ការវាយតម្លៃ) នឹងត្រូវលុបស្វ័យប្រវត្តិក្រោយរយៈពេល 48 ម៉ោង។ នេះអនុញ្ញាតឲ្យអ្នកសាកល្បងប្រព័ន្ធដោយគ្មានផលប៉ះពាល់អចិន្ត្រៃយ៍។"
            type="warning"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Profile Setup Form */}
        <Card 
          title={isFirstTime ? 'ការរៀបចំប្រវត្តិរូបគ្រូបង្រៀន' : 'ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូបគ្រូបង្រៀន'}
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            size="large"
          >
            {/* School Selection */}
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>ជ្រើសរើសសាលារៀនរបស់អ្នក <span style={{ color: 'red' }}>*</span></span>}
              name="pilot_school_id"
              rules={[{ required: true, message: 'សូមជ្រើសរើសសាលារៀនរបស់អ្នក!' }]}
            >
              <Select
                placeholder="-- ជ្រើសរើសសាលារៀនរបស់អ្នក --"
                loading={schoolsLoading}
                showSearch
                filterOption={(input, option) =>
                  (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {schools.map(school => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name} - {school.district}, {school.province}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Subject Selection */}
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>មុខវិជ្ជាដែលអ្នកបង្រៀន <span style={{ color: 'red' }}>*</span></span>}
              name="subject"
              rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា!' }]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="khmer">
                      <div>
                        <div style={{ fontWeight: 500 }}>ភាសាខ្មែរ</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនភាសាខ្មែរ</div>
                      </div>
                    </Radio>
                  </Card>
                  
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="math">
                      <div>
                        <div style={{ fontWeight: 500 }}>គណិតវិទ្យា</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនគណិតវិទ្យា</div>
                      </div>
                    </Radio>
                  </Card>
                  
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="both">
                      <div>
                        <div style={{ fontWeight: 500 }}>មុខវិជ្ជាទាំងពីរ</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនទាំងភាសាខ្មែរ និងគណិតវិទ្យា</div>
                      </div>
                    </Radio>
                  </Card>
                </Space>
              </Radio.Group>
            </Form.Item>

            {/* Grade Level Selection */}
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>ថ្នាក់ដែលអ្នកបង្រៀន <span style={{ color: 'red' }}>*</span></span>}
              name="holding_classes"
              rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់!' }]}
            >
              <Radio.Group style={{ width: '100%' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="grade_4">
                      <div>
                        <div style={{ fontWeight: 500 }}>ថ្នាក់ទី៤</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនសិស្សថ្នាក់ទី៤</div>
                      </div>
                    </Radio>
                  </Card>
                  
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="grade_5">
                      <div>
                        <div style={{ fontWeight: 500 }}>ថ្នាក់ទី៥</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនសិស្សថ្នាក់ទី៥</div>
                      </div>
                    </Radio>
                  </Card>
                  
                  <Card size="small" style={{ cursor: 'pointer' }}>
                    <Radio value="both">
                      <div>
                        <div style={{ fontWeight: 500 }}>ថ្នាក់ទាំងពីរ</div>
                        <div style={{ fontSize: 12, color: '#666' }}>ខ្ញុំបង្រៀនទាំងថ្នាក់ទី៤ និងថ្នាក់ទី៥</div>
                      </div>
                    </Radio>
                  </Card>
                </Space>
              </Radio.Group>
            </Form.Item>

            {/* Phone Number */}
            <Form.Item
              label="លេខទូរស័ព្ទ (ស្រេចចិត្ត)"
              name="phone"
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="012 345 678"
              />
            </Form.Item>

            {/* Submit Buttons */}
            <Form.Item style={{ marginTop: 32 }}>
              <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                <Button 
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{ color: '#666' }}
                >
                  ចាកចេញ
                </Button>
                
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                  style={{ minWidth: 200 }}
                >
                  {isFirstTime ? 'រក្សាទុក និងបន្ត →' : 'ធ្វើបច្ចុប្បន្នភាពប្រវត្តិរូប'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* Help Text */}
        <Card style={{ marginTop: 24, backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <Space>
            <UserOutlined style={{ color: '#3b82f6' }} />
            <div>
              <Text strong style={{ color: '#1e40af' }}>ហេតុអ្វីបានជាយើងត្រូវការព័ត៌មាននេះ?</Text>
              <br />
              <Text style={{ color: '#1e40af' }}>
                ព័ត៌មាននេះជួយយើងក្នុងការរៀបចំសិស្សតាមសាលារៀន ថ្នាក់រៀន និងមុខវិជ្ជា ដើម្បីធានាការតាមដាននិងវាយតម្លៃបានត្រឹមត្រូវ។
              </Text>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}

export default function ProfileSetupPage() {
  return <ProfileSetupContent />;
}