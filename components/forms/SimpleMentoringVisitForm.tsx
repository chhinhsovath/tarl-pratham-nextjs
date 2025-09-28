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
  Radio,
  message,
  Spin,
  Typography
} from 'antd';
import { 
  PlusOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface SimpleMentoringVisitFormProps {
  visit?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit' | 'view';
}

const SimpleMentoringVisitForm: React.FC<SimpleMentoringVisitFormProps> = ({ 
  visit, 
  onSubmit, 
  loading = false, 
  mode 
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [pilotSchools, setPilotSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [classInSession, setClassInSession] = useState(true);

  useEffect(() => {
    fetchInitialData();
    if (visit && mode !== 'create') {
      populateFormData();
    }
  }, [visit, mode]);

  const fetchInitialData = async () => {
    setLoadingData(true);
    try {
      // Fetch pilot schools
      const schoolsResponse = await fetch('/api/pilot-schools');
      if (schoolsResponse.ok) {
        const data = await schoolsResponse.json();
        setPilotSchools(data.schools || []);
      }

      // Fetch teachers
      const teachersResponse = await fetch('/api/users?role=teacher');
      if (teachersResponse.ok) {
        const data = await teachersResponse.json();
        setTeachers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('មិនអាចផ្ទុកទិន្នន័យផុរ្ម');
    } finally {
      setLoadingData(false);
    }
  };

  const populateFormData = () => {
    const formData = {
      ...visit,
      visit_date: visit.visit_date ? dayjs(visit.visit_date) : null,
    };
    form.setFieldsValue(formData);
    setClassInSession(visit.class_in_session ?? true);
  };

  const handleSubmit = async (values: any) => {
    try {
      // Transform data to match database schema
      const formData = {
        ...values,
        visit_date: values.visit_date ? dayjs(values.visit_date).format('YYYY-MM-DD') : undefined,
        pilot_school_id: parseInt(values.pilot_school_id),
        teacher_id: values.teacher_id ? parseInt(values.teacher_id) : undefined,
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('សូមមើលគ្រប់ចំណាក់ដែលត្រូវការ');
    }
  };

  if (loadingData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>កំពុងផ្ទុកទិន្នន័យ...</p>
        </div>
      </Card>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      disabled={loading || mode === 'view'}
    >
      {/* Visit Details */}
      <Card title="ព័ត៌មានការចុះអប់រំ" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="pilot_school_id"
              label="សាលារៀនគម្រោង"
              rules={[{ required: true, message: 'សូមជ្រើសរើសសាលារៀន' }]}
            >
              <Select 
                placeholder="ជ្រើសរើសសាលារៀនគម្រោង"
                showSearch
                optionFilterProp="children"
              >
                {pilotSchools.map((school: any) => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name} ({school.school_code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="teacher_id"
              label="គ្រូបង្រៀន"
              rules={[{ required: true, message: 'សូមជ្រើសរើសគ្រូបង្រៀន' }]}
            >
              <Select 
                placeholder="ជ្រើសរើសគ្រូបង្រៀន"
                showSearch
                optionFilterProp="children"
              >
                {teachers.map((teacher: any) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="visit_date"
              label="កាលបរិច្ឆេទចុះអប់រំ"
              rules={[{ required: true, message: 'កាលបរិច្ឆេទចុះអប់រំត្រូវបានទាមទារ' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="subject_observed"
              label="មុខវិច្ឆាដែលបានសំឡេង"
              rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិច្ឆា' }]}
            >
              <Select placeholder="ជ្រើសរើសមុខវិច្ឆា">
                <Option value="khmer">ខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name="grade_group"
              label="ថ្នាក់"
              rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់' }]}
            >
              <Select placeholder="ជ្រើសរើសថ្នាក់">
                <Option value="4">ថ្នាក់ទី ៤</Option>
                <Option value="5">ថ្នាក់ទី ៥</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Class Session */}
      <Card title="ព័ត៌មានសេចក្តីសំឡេងថ្នាក់" style={{ marginBottom: 24 }}>
        <Form.Item
          name="class_in_session"
          label="តើថ្នាក់រៀនកំពុងដំណើរការឬទេ?"
          rules={[{ required: true }]}
        >
          <Radio.Group onChange={(e) => setClassInSession(e.target.value)}>
            <Radio value={true}>បាទ/ចាស</Radio>
            <Radio value={false}>ទេ</Radio>
          </Radio.Group>
        </Form.Item>

        {!classInSession && (
          <Form.Item
            name="class_not_in_session_reason"
            label="មូលហេតុដែលថ្នាក់រៀនមិនដំណើរការ"
            rules={[{ required: true, message: 'សូមផ្តល់មូលហេតុ' }]}
          >
            <TextArea rows={2} placeholder="ពន្យល់ពីមូលហេតុដែលថ្នាក់រៀនមិនដំណើរការ" />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="total_students_enrolled"
              label="ចំនួនសិស្សចុះឈ្មោះសរុប"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="students_present"
              label="ចំនួនសិស្សមកវត្តមាន"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* Overall Assessment */}
      <Card title="ការវាយតម្លៃសរុប" style={{ marginBottom: 24 }}>
        <Form.Item
          name="observation"
          label="ការសំលឹងសរុប"
          rules={[{ required: true }]}
        >
          <TextArea 
            rows={4} 
            placeholder="ផ្តល់ការសំលឹងលម្អិតអំពីមើលបង្រៀន ការចូលរួមរបស់សិស្ស និងបរិបរាកាសបន្ទប់"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="score"
              label="ប្រហំសរុប (១-១០០)"
            >
              <InputNumber 
                min={0} 
                max={100} 
                style={{ width: '100%' }}
                placeholder="បញ្ចូលប្រហំសរុប"
              />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              name="follow_up_required"
              label="តើត្រូវការតាមដានទេ?"
            >
              <Radio.Group>
                <Radio value={true}>បាទ/ចាស</Radio>
                <Radio value={false}>ទេ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="recommendations"
          label="ការជំនាំ"
        >
          <TextArea 
            rows={3} 
            placeholder="បញ្ជីការជំនាំច្បាស់លាស់សម្រាប់ការកែលម្អ"
          />
        </Form.Item>

        <Form.Item
          name="follow_up_actions"
          label="សកម្មភាពតាមដានដែលត្រូវការ"
          dependencies={['follow_up_required']}
        >
          <TextArea 
            rows={3} 
            placeholder="ពន្យល់សកម្មភាពតាមដានច្បាស់លាស់ដែលត្រូវការ"
          />
        </Form.Item>
      </Card>

      {/* Photo Upload */}
      <Card title="រូបភាពសម្រាប់ការចុះអប់រំ" style={{ marginBottom: 24 }}>
        <Form.Item
          name="photo"
          label="ពន្លិតរូបភាពការចុះអប់រំ"
        >
          <Upload
            listType="picture-card"
            maxCount={3}
            beforeUpload={() => false}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>ពន្លិត</div>
            </div>
          </Upload>
        </Form.Item>
      </Card>

      {/* Submit Button */}
      <Card>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
          >
            {mode === 'create' ? 'បញ្ជូនការចុះអប់រំ' : 'កែប្រែការចុះអប់រំ'}
          </Button>
          
          <Button 
            onClick={() => form.resetFields()}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            សម្អាត
          </Button>
        </Form.Item>
      </Card>
    </Form>
  );
};

export default SimpleMentoringVisitForm;