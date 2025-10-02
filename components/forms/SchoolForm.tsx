'use client';

import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  InputNumber,
  Switch,
  message,
  Spin 
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;

interface SchoolFormProps {
  school?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  code: string;
  province_id: number;
  district?: string;
  commune?: string;
  village?: string;
  school_type?: string;
  level?: string;
  total_students?: number;
  total_teachers?: number;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  is_active: boolean;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ 
  school, 
  onSubmit, 
  loading = false, 
  mode 
}) => {
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchProvinces();
    if (school && mode === 'edit') {
      form.setFieldsValue({
        name: school.name,
        code: school.code,
        province_id: school.province_id,
        district: school.district,
        commune: school.commune,
        village: school.village,
        school_type: school.school_type,
        level: school.level,
        total_students: school.total_students,
        total_teachers: school.total_teachers,
        latitude: school.latitude,
        longitude: school.longitude,
        phone: school.phone,
        email: school.email,
        is_active: school.is_active
      });
    }
  }, [school, mode, form]);

  const fetchProvinces = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/provinces');
      if (response.ok) {
        const data = await response.json();
        setProvinces(data.provinces || []);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      message.error('Failed to load provinces');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: FormData) => {
    try {
      await onSubmit(values);
      if (mode === 'create') {
        form.resetFields();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const validateSchoolCode = async (rule: any, value: string) => {
    if (!value) return Promise.resolve();
    
    // Check uniqueness for new schools or different code
    if (mode === 'create' || (school && school.code !== value)) {
      try {
        const response = await fetch(
          `/api/schools/validate-code?code=${encodeURIComponent(value)}${
            school ? `&exclude=${school.id}` : ''
          }`
        );
        const data = await response.json();
        
        if (!data.isUnique) {
          return Promise.reject('School code is already in use');
        }
      } catch (error) {
        return Promise.reject('Unable to validate school code');
      }
    }

    return Promise.resolve();
  };

  const validateEmail = (rule: any, value: string) => {
    if (!value) return Promise.resolve();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject('Invalid email format');
    }
    
    return Promise.resolve();
  };

  const validateCoordinate = (type: 'latitude' | 'longitude') => {
    return (rule: any, value: number) => {
      if (value === undefined || value === null) return Promise.resolve();
      
      if (type === 'latitude') {
        if (value < -90 || value > 90) {
          return Promise.reject('Latitude must be between -90 and 90');
        }
      } else {
        if (value < -180 || value > 180) {
          return Promise.reject('Longitude must be between -180 and 180');
        }
      }
      
      return Promise.resolve();
    };
  };

  const schoolTypes = [
    'Primary School',
    'Secondary School',
    'High School',
    'Vocational School',
    'University',
    'Other'
  ];

  const schoolLevels = [
    'Pre-Primary',
    'Primary',
    'Lower Secondary',
    'Upper Secondary',
    'Higher Education',
    'Mixed'
  ];

  if (loadingData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Loading form data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={mode === 'create' ? 'Create New School' : 'Edit School'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        initialValues={{ is_active: true }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="School Name"
              rules={[
                { required: true, message: 'School name is required' },
                { min: 2, message: 'Name must be at least 2 characters' }
              ]}
            >
              <Input placeholder="Enter school name" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="code"
              label="School Code"
              rules={[
                { required: true, message: 'School code is required' },
                { min: 2, message: 'Code must be at least 2 characters' },
                { validator: validateSchoolCode }
              ]}
            >
              <Input placeholder="Enter unique school code" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="province_id"
              label="Province"
              rules={[{ required: true, message: 'Province is required' }]}
            >
              <Select placeholder="ជ្រើសរើសខេត្ត">
                {provinces.map((province: any) => (
                  <Option key={province.id} value={province.id}>
                    {province.name_english} ({province.name_khmer})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="district"
              label="District"
            >
              <Input placeholder="Enter district name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="commune"
              label="Commune"
            >
              <Input placeholder="Enter commune name" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="village"
              label="Village"
            >
              <Input placeholder="Enter village name" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="school_type"
              label="School Type"
            >
              <Select placeholder="ជ្រើសរើសប្រភេទសាលា" allowClear>
                {schoolTypes.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="level"
              label="Education Level"
            >
              <Select placeholder="ជ្រើសរើសកម្រិតអប់រំ" allowClear>
                {schoolLevels.map(level => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="total_students"
              label="Total Students"
              rules={[
                { type: 'number', min: 0, message: 'Must be a positive number' }
              ]}
            >
              <InputNumber 
                placeholder="Enter total students" 
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="total_teachers"
              label="Total Teachers"
              rules={[
                { type: 'number', min: 0, message: 'Must be a positive number' }
              ]}
            >
              <InputNumber 
                placeholder="Enter total teachers" 
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="latitude"
              label="Latitude"
              rules={[{ validator: validateCoordinate('latitude') }]}
            >
              <InputNumber 
                placeholder="Enter latitude (-90 to 90)" 
                style={{ width: '100%' }}
                step={0.000001}
                precision={6}
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="longitude"
              label="Longitude"
              rules={[{ validator: validateCoordinate('longitude') }]}
            >
              <InputNumber 
                placeholder="Enter longitude (-180 to 180)" 
                style={{ width: '100%' }}
                step={0.000001}
                precision={6}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Contact Phone"
              rules={[
                {
                  pattern: /^[+]?[\d\s\-()]+$/,
                  message: 'Invalid phone number format'
                }
              ]}
            >
              <Input placeholder="Enter contact phone number" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="email"
              label="Contact Email"
              rules={[{ validator: validateEmail }]}
            >
              <Input type="email" placeholder="Enter contact email address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="is_active"
              label="Active Status"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Active" 
                unCheckedChildren="Inactive" 
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ marginRight: 8 }}
          >
            {mode === 'create' ? 'Create School' : 'Update School'}
          </Button>
          
          <Button 
            onClick={() => form.resetFields()}
            disabled={loading}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SchoolForm;