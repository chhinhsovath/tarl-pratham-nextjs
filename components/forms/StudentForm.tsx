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
  Upload,
  Image,
  message,
  Spin 
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

const { Option } = Select;

interface StudentFormProps {
  student?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit';
  userRole?: string;
  pilotSchoolId?: number;
}

interface FormData {
  name: string;
  age?: number;
  gender?: string;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  school_class_id?: number;
  pilot_school_id?: number;
}

const StudentForm: React.FC<StudentFormProps> = ({ 
  student, 
  onSubmit, 
  loading = false, 
  mode,
  userRole,
  pilotSchoolId
}) => {
  const [form] = Form.useForm();
  const [classes, setClasses] = useState([]);
  const [pilotSchools, setPilotSchools] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    fetchFormData();
    if (student && mode === 'edit') {
      form.setFieldsValue({
        name: student.name,
        age: student.age,
        gender: student.gender,
        guardian_name: student.guardian_name,
        guardian_phone: student.guardian_phone,
        address: student.address,
        school_class_id: student.school_class_id,
        pilot_school_id: student.pilot_school_id
      });
      
      if (student.photo) {
        setImageUrl(student.photo);
      }
    }
  }, [student, mode, form]);

  const fetchFormData = async () => {
    setLoadingData(true);
    try {
      const requests = [];
      
      // Fetch classes (for regular teachers/admins)
      if (userRole !== 'mentor') {
        requests.push(fetch('/api/school-classes'));
      }
      
      // Fetch pilot schools (for mentors or admin)
      if (userRole === 'mentor' || userRole === 'admin') {
        requests.push(fetch('/api/pilot-schools'));
      }

      const responses = await Promise.all(requests);
      
      let responseIndex = 0;

      if (userRole !== 'mentor' && responses[responseIndex]) {
        const classesData = await responses[responseIndex].json();
        setClasses(classesData.data || classesData.classes || []);
        responseIndex++;
      }

      if ((userRole === 'mentor' || userRole === 'admin') && responses[responseIndex]) {
        const schoolsData = await responses[responseIndex].json();
        setPilotSchools(schoolsData.data || schoolsData.schools || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
      message.error('Failed to load form data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (values: FormData) => {
    try {
      // Include photo if uploaded
      if (imageUrl && imageUrl !== student?.photo) {
        values.photo = imageUrl;
      }

      // Set pilot school for mentors and teachers
      if ((userRole === 'mentor' || userRole === 'teacher') && pilotSchoolId) {
        values.pilot_school_id = pilotSchoolId;
        console.log('✅ [StudentForm] Added pilot_school_id to values:', pilotSchoolId);
      } else {
        console.warn('⚠️ [StudentForm] No pilot_school_id available:', { userRole, pilotSchoolId });
      }

      console.log('📋 [StudentForm] Final form values:', values);

      await onSubmit(values);
      if (mode === 'create') {
        form.resetFields();
        setImageUrl(undefined);
        setFileList([]);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const formData = new FormData();
      formData.append('file', file as File);
      formData.append('type', 'student_photo');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.url);
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

  const handleRemovePhoto = () => {
    setImageUrl(undefined);
    setFileList([]);
    form.setFieldValue('photo', undefined);
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

  const validateAge = (rule: any, value: number) => {
    if (value === undefined || value === null) return Promise.resolve();
    
    if (value < 5 || value > 20) {
      return Promise.reject('Age must be between 5 and 20');
    }
    
    return Promise.resolve();
  };

  const validatePhone = (rule: any, value: string) => {
    if (!value) return Promise.resolve();
    
    const phoneRegex = /^[+]?[\d\s\-()]+$/;
    if (!phoneRegex.test(value) || value.length < 8) {
      return Promise.reject('Invalid phone number format');
    }
    
    return Promise.resolve();
  };

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
    <Card title={mode === 'create' ? 'Add New Student' : 'Edit Student'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
      >
        <Row gutter={16}>
          <Col span={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Student Name"
                  rules={[
                    { required: true, message: 'Student name is required' },
                    { min: 2, message: 'Name must be at least 2 characters' }
                  ]}
                >
                  <Input placeholder="Enter student name" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="age"
                  label="Age"
                  rules={[{ validator: validateAge }]}
                >
                  <InputNumber 
                    placeholder="Enter age" 
                    style={{ width: '100%' }}
                    min={5}
                    max={20}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                >
                  <Select placeholder="ជ្រើសរើសភេទ" allowClear>
                    <Option value="Male">Male (ប្រុស)</Option>
                    <Option value="Female">Female (ស្រី)</Option>
                  </Select>
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="guardian_name"
                  label="Guardian Name"
                >
                  <Input placeholder="Enter guardian/parent name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="guardian_phone"
                  label="Guardian Phone"
                  rules={[{ validator: validatePhone }]}
                >
                  <Input placeholder="Enter guardian phone number" />
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name="address"
                  label="Address"
                >
                  <Input placeholder="Enter student address" />
                </Form.Item>
              </Col>
            </Row>

            {/* Class Assignment - only for non-mentors */}
            {userRole !== 'mentor' && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="school_class_id"
                    label="School Class"
                  >
                    <Select placeholder="ជ្រើសរើសថ្នាក់" allowClear>
                      {classes.map((schoolClass: any) => (
                        <Option key={schoolClass.id} value={schoolClass.id}>
                          {schoolClass.school?.name} - {schoolClass.name} (Grade {schoolClass.grade})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}

            {/* Pilot School Assignment - for mentors and admins */}
            {(userRole === 'admin' || (userRole === 'mentor' && !pilotSchoolId)) && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="pilot_school_id"
                    label="Pilot School"
                  >
                    <Select placeholder="ជ្រើសរើសសាលាសាកល្បង" allowClear>
                      {pilotSchools.map((school: any) => (
                        <Option key={school.id} value={school.id}>
                          {school.name} ({school.code})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>

          {/* Photo Upload Section */}
          <Col span={8}>
            <Form.Item label="Student Photo">
              {imageUrl ? (
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={imageUrl}
                    alt="Student photo"
                    style={{ 
                      width: '100%', 
                      maxWidth: '200px',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      size="small" 
                      onClick={handleRemovePhoto}
                      disabled={loading}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <Upload
                  customRequest={handleUpload}
                  beforeUpload={beforeUpload}
                  fileList={fileList}
                  onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                  maxCount={1}
                  listType="picture-card"
                  disabled={loading}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload Photo</div>
                  </div>
                </Upload>
              )}
              <div style={{ fontSize: '12px', color: '#666', marginTop: 8 }}>
                Upload student photo (max 5MB)
              </div>
            </Form.Item>
          </Col>
        </Row>

        {userRole === 'mentor' && (
          <Row>
            <Col span={24}>
              <div style={{ 
                background: '#fff7e6', 
                border: '1px solid #ffd591', 
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <strong>Note:</strong> As a mentor, this student will be marked as temporary and will be automatically deleted after 48 hours unless permanently saved by an admin or teacher.
              </div>
            </Col>
          </Row>
        )}

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ marginRight: 8 }}
          >
            {mode === 'create' ? 'Add Student' : 'Update Student'}
          </Button>
          
          <Button 
            onClick={() => {
              form.resetFields();
              setImageUrl(undefined);
              setFileList([]);
            }}
            disabled={loading}
          >
            Reset
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default StudentForm;