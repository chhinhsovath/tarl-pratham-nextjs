"use client";

import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Space, Typography, message, Row, Col, Divider, Switch } from 'antd';
import { SettingOutlined, SaveOutlined, ReloadOutlined, GlobalOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;
const { Option } = Select;

interface Settings {
  app_name: string;
  app_timezone: string;
  app_locale: string;
  mail_from_address: string;
  mail_from_name: string;
}

const timezones = [
  { value: 'Asia/Phnom_Penh', label: 'Asia/Phnom_Penh (Cambodia)' },
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (Thailand)' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (Vietnam)' },
  { value: 'Asia/Jakarta', label: 'Asia/Jakarta (Indonesia)' },
  { value: 'America/New_York', label: 'America/New_York (EST)' },
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
];

const locales = [
  { value: 'km', label: 'ភាសាខ្មែរ (Khmer)' },
  { value: 'en', label: 'English' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Check admin access
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data.settings);
          form.setFieldsValue(data.settings);
        } else {
          message.error('Failed to load settings');
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        message.error('Error loading settings');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchSettings();
    }
  }, [session, form]);

  const handleSubmit = async (values: Settings) => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();
        message.success(result.message);
        setSettings(values);
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      message.error('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      form.setFieldsValue(settings);
      message.info('Form reset to saved values');
    }
  };

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2}>
          <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          ការកំណត់ប្រព័ន្ធ
        </Title>
        <Title level={3} type="secondary" style={{ margin: '8px 0 16px 0' }}>
          System Settings
        </Title>
        <Text type="secondary">
          កំណត់ការការពារ និងការកំណត់ប្រព័ន្ធទូទៅ
        </Text>
      </div>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
        >
          {/* Application Settings */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4}>
              <GlobalOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
              Application Settings
            </Title>
            <Divider />

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="app_name"
                  label="Application Name"
                  rules={[
                    { required: true, message: 'Application name is required' },
                    { max: 255, message: 'Application name must be less than 255 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Enter application name"
                    prefix={<GlobalOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="app_locale"
                  label="Default Language"
                  rules={[{ required: true, message: 'Language is required' }]}
                >
                  <Select placeholder="Select default language">
                    {locales.map(locale => (
                      <Option key={locale.value} value={locale.value}>
                        {locale.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="app_timezone"
              label="Timezone"
              rules={[{ required: true, message: 'Timezone is required' }]}
            >
              <Select 
                placeholder="Select timezone"
                showSearch
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().includes(input.toLowerCase())
                }
              >
                {timezones.map(timezone => (
                  <Option key={timezone.value} value={timezone.value}>
                    {timezone.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Email Settings */}
          <div style={{ marginBottom: '32px' }}>
            <Title level={4}>
              <MailOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
              Email Configuration
            </Title>
            <Divider />

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="mail_from_address"
                  label="From Email Address"
                  rules={[
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    placeholder="noreply@example.com"
                    prefix={<MailOutlined />}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="mail_from_name"
                  label="From Name"
                  rules={[
                    { max: 255, message: 'From name must be less than 255 characters' }
                  ]}
                >
                  <Input 
                    placeholder="TaRL Pratham System"
                    prefix={<GlobalOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Current Values Display */}
          {settings && (
            <div style={{ marginBottom: '32px' }}>
              <Title level={4}>
                <ClockCircleOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
                Current Settings
              </Title>
              <Divider />
              
              <Card size="small" style={{ backgroundColor: '#f9f9f9' }}>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={12}>
                    <Text strong>App Name:</Text> {settings.app_name}
                  </Col>
                  <Col xs={24} sm={12}>
                    <Text strong>Language:</Text> {locales.find(l => l.value === settings.app_locale)?.label}
                  </Col>
                  <Col xs={24} sm={12}>
                    <Text strong>Timezone:</Text> {settings.app_timezone}
                  </Col>
                  <Col xs={24} sm={12}>
                    <Text strong>Email:</Text> {settings.mail_from_address || 'Not set'}
                  </Col>
                </Row>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <Form.Item style={{ marginTop: '32px', textAlign: 'center' }}>
            <Space size="middle">
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={saving}
                size="large"
              >
                Save Settings
              </Button>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleReset}
                size="large"
              >
                Reset Form
              </Button>
              <Button 
                onClick={() => router.push('/administration')}
                size="large"
              >
                Back to Administration
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          * ការផ្លាស់ប្តូរនេះនឹងប៉ះពាល់ដល់ការប្រព្រឹត្តិទូទៅនៃប្រព័ន្ធ<br />
          * These changes will affect the overall system behavior
        </Text>
      </div>
    </div>
  );
}