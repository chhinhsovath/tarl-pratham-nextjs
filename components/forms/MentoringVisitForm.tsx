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
  DatePicker,
  Upload,
  Image,
  message,
  Spin,
  Space,
  Typography,
  Alert
} from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import type { UploadFile, UploadProps } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface MentoringVisitFormProps {
  visit?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
}

interface FormData {
  pilot_school_id: number;
  visit_date: string;
  level?: string;
  purpose?: string;
  activities?: string;
  observations?: string;
  recommendations?: string;
  follow_up_actions?: string;
  participants_count?: number;
  duration_minutes?: number;
  status: string;
  photos?: string[];
}

const MentoringVisitForm: React.FC<MentoringVisitFormProps> = ({ 
  visit, 
  onSubmit, 
  loading = false, 
  mode 
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [pilotSchools, setPilotSchools] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchPilotSchools();
    if (visit && mode === 'edit') {
      form.setFieldsValue({
        pilot_school_id: visit.pilot_school_id,
        visit_date: visit.visit_date ? dayjs(visit.visit_date) : null,
        level: visit.level,
        purpose: visit.purpose,
        activities: visit.activities,
        observations: visit.observations,
        recommendations: visit.recommendations,
        follow_up_actions: visit.follow_up_actions,
        participants_count: visit.participants_count,
        duration_minutes: visit.duration_minutes,
        status: visit.status
      });
      
      if (visit.photos && Array.isArray(visit.photos)) {
        setUploadedPhotos(visit.photos);
      }
    }
  }, [visit, mode, form]);

  const fetchPilotSchools = async () => {
    setLoadingData(true);
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setPilotSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Error fetching pilot schools:', error);
      message.error('Failed to load pilot schools');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: FormData) => {
    try {
      // Include uploaded photos
      const formData = {
        ...values,
        visit_date: values.visit_date ? dayjs(values.visit_date).format('YYYY-MM-DD') : undefined,
        photos: uploadedPhotos
      };
      
      await onSubmit(formData);
      
      if (mode === 'create') {
        form.resetFields();
        setUploadedPhotos([]);
        setFileList([]);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handlePhotoUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const formData = new FormData();
      formData.append('file', file as File);
      formData.append('type', 'mentoring_photos');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setUploadedPhotos(prev => [...prev, data.url]);
        onSuccess?.(data);
        message.success('Photo uploaded successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error as Error);
      message.error('Failed to upload photo');
    }
  };

  const handleRemovePhoto = (photoUrl: string) => {
    setUploadedPhotos(prev => prev.filter(url => url !== photoUrl));
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    
    return true;
  };

  const levels = [
    'Pre-Primary',
    'Primary',
    'Lower Secondary',
    'Upper Secondary',
    'Mixed Levels'
  ];

  const statuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'blue' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
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
    <Card title={mode === 'create' ? 'Schedule Mentoring Visit' : 'Edit Mentoring Visit'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        initialValues={{
          status: 'scheduled',
          visit_date: dayjs()
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="pilot_school_id"
              label="Pilot School"
              rules={[{ required: true, message: 'Pilot school is required' }]}
            >
              <Select placeholder="Select pilot school">
                {pilotSchools.map((school: any) => (
                  <Option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="visit_date"
              label="Visit Date"
              rules={[{ required: true, message: 'Visit date is required' }]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < dayjs().startOf('day')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="level"
              label="Education Level"
            >
              <Select placeholder="Select education level" allowClear>
                {levels.map(level => (
                  <Option key={level} value={level}>
                    {level}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="participants_count"
              label="Number of Participants"
            >
              <InputNumber 
                placeholder="Enter participant count" 
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="duration_minutes"
              label="Duration (minutes)"
            >
              <InputNumber 
                placeholder="Visit duration in minutes" 
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="purpose"
              label="Purpose of Visit"
            >
              <TextArea 
                rows={3} 
                placeholder="Describe the main purpose and objectives of this visit..."
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Status is required' }]}
            >
              <Select placeholder="Select status">
                {statuses.map(status => (
                  <Option key={status.value} value={status.value}>
                    <span style={{ color: status.color }}>
                      {status.label}
                    </span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="activities"
              label="Activities Conducted"
            >
              <TextArea 
                rows={4} 
                placeholder="Describe the activities and interventions conducted during the visit..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="observations"
              label="Observations"
            >
              <TextArea 
                rows={4} 
                placeholder="Record key observations about teaching methods, student engagement, classroom environment..."
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="recommendations"
              label="Recommendations"
            >
              <TextArea 
                rows={4} 
                placeholder="Provide specific recommendations for improvement and next steps..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="follow_up_actions"
              label="Follow-up Actions"
            >
              <TextArea 
                rows={3} 
                placeholder="List specific actions to be taken as follow-up to this visit..."
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Photo Upload Section */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Visit Photos">
              <div style={{ marginBottom: '16px' }}>
                <Upload
                  customRequest={handlePhotoUpload}
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                  multiple
                  listType="picture-card"
                  disabled={loading}
                  showUploadList={false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Add Photos</div>
                  </div>
                </Upload>
              </div>

              {uploadedPhotos.length > 0 && (
                <div>
                  <Title level={5}>Uploaded Photos:</Title>
                  <Row gutter={16}>
                    {uploadedPhotos.map((photoUrl, index) => (
                      <Col span={6} key={index} style={{ marginBottom: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={photoUrl}
                            alt={`Visit photo ${index + 1}`}
                            style={{ 
                              width: '100%',
                              height: '120px',
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                          />
                          <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px'
                            }}
                            onClick={() => handleRemovePhoto(photoUrl)}
                            disabled={loading}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Upload photos from the mentoring visit (max 5MB per image)
              </div>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {mode === 'create' ? 'Schedule Visit' : 'Update Visit'}
            </Button>
            
            <Button 
              onClick={() => {
                form.resetFields();
                setUploadedPhotos([]);
                setFileList([]);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MentoringVisitForm;