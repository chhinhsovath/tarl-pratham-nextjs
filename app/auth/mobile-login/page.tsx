'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Space, Divider, ConfigProvider } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  LoginOutlined,
  MobileOutlined,
  MailOutlined,
} from '@ant-design/icons';
import kmTranslations from '@/lib/translations/km';
import Image from 'next/image';

export default function MobileLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'quick'>('email');

  const onFinish = async (values: { email?: string; username?: string; password: string }) => {
    setLoading(true);
    try {
      const credentials = loginType === 'email' 
        ? { email: values.email, password: values.password }
        : { email: values.username, password: values.password };

      const result = await signIn('credentials', {
        redirect: false,
        ...credentials,
      });

      if (result?.error) {
        message.error('ឈ្មោះអ្នកប្រើ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
      } else {
        message.success('ចូលប្រើប្រាស់ដោយជោគជ័យ!');
        router.push('/mobile-dashboard');
      }
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការចូលប្រើប្រាស់');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: '"Hanuman", "Khmer OS", sans-serif',
          fontSize: 16,
          borderRadius: 8,
          colorPrimary: '#1890ff',
        },
        components: {
          Button: {
            controlHeight: 48,
            fontSize: 16,
          },
          Input: {
            controlHeight: 48,
            fontSize: 16,
          },
        },
      }}
    >
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
        {/* Header with Logo */}
        <div className="pt-12 pb-8 px-6 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-3xl font-bold font-khmer">TaRL</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold font-khmer text-gray-900 mb-2">
            {kmTranslations.appName}
          </h1>
          <p className="text-sm text-gray-600 font-khmer">
            {kmTranslations.appFullName}
          </p>
        </div>

        {/* Login Form */}
        <div className="flex-1 px-6">
          <Card className="shadow-lg border-0 rounded-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-khmer font-bold text-gray-800 mb-2">
                សូមស្វាគមន៍
              </h2>
              <p className="text-sm text-gray-500">Welcome Back</p>
            </div>

            {/* Login Type Selector */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setLoginType('email')}
                  className={`py-2 px-4 rounded-md font-khmer text-sm transition-all ${
                    loginType === 'email'
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  អ៊ីមែល
                </button>
                <button
                  onClick={() => setLoginType('quick')}
                  className={`py-2 px-4 rounded-md font-khmer text-sm transition-all ${
                    loginType === 'quick'
                      ? 'bg-white text-blue-600 shadow-sm font-semibold'
                      : 'text-gray-600'
                  }`}
                >
                  ចូលរហ័ស
                </button>
              </div>
            </div>

            <Form
              name="mobile-login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              requiredMark={false}
            >
              {loginType === 'email' ? (
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: kmTranslations.forms.validation.required },
                    { type: 'email', message: kmTranslations.forms.validation.email },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="អ៊ីមែល (Email)"
                    size="large"
                    className="font-khmer rounded-lg"
                    style={{ fontSize: 16 }}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: kmTranslations.forms.validation.required },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="ឈ្មោះអ្នកប្រើ (Username)"
                    size="large"
                    className="font-khmer rounded-lg"
                    style={{ fontSize: 16 }}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: kmTranslations.forms.validation.required },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="ពាក្យសម្ងាត់ (Password)"
                  size="large"
                  className="font-khmer rounded-lg"
                  style={{ fontSize: 16 }}
                />
              </Form.Item>

              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  icon={<LoginOutlined />}
                  className="h-12 font-khmer font-semibold text-base rounded-lg shadow-md"
                >
                  ចូលប្រើប្រាស់
                </Button>
              </Form.Item>

              <div className="text-center">
                <a className="text-blue-600 text-sm font-khmer">
                  ភ្លេចពាក្យសម្ងាត់?
                </a>
              </div>
            </Form>

            <Divider className="my-6">
              <span className="text-gray-400 text-sm font-khmer">ឬ</span>
            </Divider>

            {/* Quick Access for Different Roles */}
            <div className="space-y-3">
              <div className="text-center mb-3">
                <p className="text-sm text-gray-600 font-khmer">ចូលប្រើប្រាស់រហ័ស</p>
                <p className="text-xs text-gray-400">Quick Access</p>
              </div>
              
              <Button
                block
                size="large"
                className="h-12 font-khmer text-sm"
                onClick={() => {
                  onFinish({ username: 'teacher', password: 'teacher123' });
                }}
              >
                <UserOutlined /> គ្រូបង្រៀន (Teacher)
              </Button>
              
              <Button
                block
                size="large"
                className="h-12 font-khmer text-sm"
                onClick={() => {
                  onFinish({ username: 'mentor', password: 'mentor123' });
                }}
              >
                <UserOutlined /> អ្នកណែនាំ (Mentor)
              </Button>
            </div>
          </Card>

          {/* Language Selector */}
          <div className="mt-6 text-center">
            <Space size="large">
              <button className="text-blue-600 font-khmer text-sm font-semibold">
                ភាសាខ្មែរ
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-gray-500 text-sm">
                English
              </button>
            </Space>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 text-center">
          <p className="text-xs text-gray-400 font-khmer">
            © 2024 គម្រោង TaRL - រក្សាសិទ្ធិគ្រប់យ៉ាង
          </p>
          <p className="text-xs text-gray-400">
            Teaching at the Right Level
          </p>
        </div>

        {/* Mobile-specific styles */}
        <style jsx global>{`
          /* Khmer font */
          .font-khmer {
            font-family: 'Hanuman', 'Khmer OS', sans-serif !important;
          }
          
          /* Remove zoom on input focus for iOS */
          input, select, textarea {
            font-size: 16px !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          
          /* Button press effect */
          button:active {
            transform: scale(0.98);
          }
          
          /* Card shadow */
          .ant-card {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          }
          
          /* Input styling */
          .ant-input-affix-wrapper {
            border-radius: 8px !important;
            border: 1px solid #e5e7eb !important;
          }
          
          .ant-input-affix-wrapper:focus,
          .ant-input-affix-wrapper-focused {
            border-color: #1890ff !important;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1) !important;
          }
          
          /* Safe area for iOS */
          @supports (padding: max(0px)) {
            body {
              padding-bottom: env(safe-area-inset-bottom);
            }
          }
          
          /* Prevent text selection on buttons */
          button {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}