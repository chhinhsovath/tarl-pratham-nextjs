'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Select,
  Button,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  DatePicker,
  message,
  Spin,
  Steps,
  Radio,
  Space,
  Typography,
  Tag,
  Alert
} from 'antd';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import {
  getAssessmentTypeOptions,
  getSubjectOptions,
  getLevelOptions,
  getLevelLabelKM,
  getLevelLabelEN
} from '@/lib/constants/assessment-levels';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;

interface AssessmentFormProps {
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  students?: any[];
  selectedStudents?: number[];
  assessmentType?: string;
  subject?: string;
  mode: 'single' | 'bulk';
}

interface AssessmentData {
  student_id: number;
  assessment_type: string;
  subject: string;
  level?: string;
  score?: number;
  notes?: string;
  assessed_date?: string;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ 
  onSubmit, 
  loading = false,
  students = [],
  selectedStudents = [],
  assessmentType,
  subject,
  mode = 'single'
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<Record<number, AssessmentData>>({});
  const [availableStudents, setAvailableStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    if (mode === 'single') {
      fetchStudents();
    } else {
      // Initialize assessment data for selected students
      const initialData: Record<number, AssessmentData> = {};
      selectedStudents.forEach(studentId => {
        initialData[studentId] = {
          student_id: studentId,
          assessment_type: assessmentType || 'baseline',
          subject: subject || 'language',
          assessed_date: dayjs().format('YYYY-MM-DD')
        };
      });
      setAssessmentData(initialData);
    }
  }, [mode, selectedStudents, assessmentType, subject]);

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const params = new URLSearchParams();
      if (user?.role === 'teacher' || user?.role === 'mentor') {
        if (user.pilot_school_id) {
          params.append('pilot_school_id', user.pilot_school_id.toString());
        }
      }

      const response = await fetch(`/api/students?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('បរាជ័យក្នុងការផ្ទុកសិស្ស');
    } finally {
      setLoadingStudents(false);
    }
  };

  // Get options from constants - includes all 7 language + 6 math levels
  const assessmentTypes = getAssessmentTypeOptions();
  const subjects = getSubjectOptions();

  // State for dynamically loaded levels based on subject
  const [selectedSubject, setSelectedSubject] = useState<'language' | 'math'>('language');
  const [availableLevels, setAvailableLevels] = useState(getLevelOptions('language'));

  // Update levels when subject changes
  const handleSubjectChange = (value: 'language' | 'math') => {
    setSelectedSubject(value);
    setAvailableLevels(getLevelOptions(value));
    // Reset level field when subject changes
    form.setFieldValue('level', undefined);
  };

  const handleSingleSubmit = async (values: any) => {
    try {
      await onSubmit([values]);
      form.resetFields();
      message.success('រក្សាទុកការវាយតម្លៃបានជោគជ័យ');
    } catch (error) {
      console.error('Assessment submission error:', error);
    }
  };

  const handleBulkNext = () => {
    form.validateFields().then(values => {
      // Save current student's data
      const studentId = selectedStudents[currentStudentIndex];

      // Format the assessed_date if it's a dayjs object
      const formattedValues = {
        ...values,
        assessed_date: values.assessed_date ? dayjs(values.assessed_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };

      setAssessmentData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ...formattedValues
        }
      }));

      if (currentStudentIndex < selectedStudents.length - 1) {
        setCurrentStudentIndex(prev => prev + 1);
        // Load next student's data
        const nextStudentId = selectedStudents[currentStudentIndex + 1];
        const nextData = assessmentData[nextStudentId] || {
          assessment_type: assessmentType || 'baseline',
          subject: subject || 'language',
          assessed_date: dayjs()
        };

        // Set form values with proper dayjs conversion
        form.setFieldsValue({
          ...nextData,
          assessed_date: nextData.assessed_date ? dayjs(nextData.assessed_date) : dayjs()
        });
      } else {
        setCurrentStep(1); // Move to review step
      }
    }).catch(error => {
      console.error('Validation error:', error);
    });
  };

  const handleBulkPrevious = () => {
    if (currentStudentIndex > 0) {
      // Save current data
      const studentId = selectedStudents[currentStudentIndex];
      const currentValues = form.getFieldsValue();

      // Format the assessed_date if it's a dayjs object
      const formattedValues = {
        ...currentValues,
        assessed_date: currentValues.assessed_date ? dayjs(currentValues.assessed_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };

      setAssessmentData(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          ...formattedValues
        }
      }));

      setCurrentStudentIndex(prev => prev - 1);
      // Load previous student's data
      const prevStudentId = selectedStudents[currentStudentIndex - 1];
      const prevData = assessmentData[prevStudentId] || {
        assessment_type: assessmentType || 'baseline',
        subject: subject || 'language',
        assessed_date: dayjs()
      };

      // Set form values with proper dayjs conversion
      form.setFieldsValue({
        ...prevData,
        assessed_date: prevData.assessed_date ? dayjs(prevData.assessed_date) : dayjs()
      });
    }
  };

  const handleBulkSubmit = async () => {
    try {
      // Save current form data
      const currentValues = form.getFieldsValue();
      const studentId = selectedStudents[currentStudentIndex];

      // Format the assessed_date if it's a dayjs object
      const formattedValues = {
        ...currentValues,
        assessed_date: currentValues.assessed_date ? dayjs(currentValues.assessed_date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
      };

      const finalData = {
        ...assessmentData,
        [studentId]: {
          ...assessmentData[studentId],
          ...formattedValues
        }
      };

      // Convert to array
      const assessmentArray = Object.values(finalData);
      await onSubmit(assessmentArray);

      message.success('រក្សាទុកការវាយតម្លៃទាំងអស់បានជោគជ័យ');
    } catch (error) {
      console.error('Bulk assessment submission error:', error);
    }
  };

  const getCurrentStudent = () => {
    if (mode === 'single') return null;
    const studentId = selectedStudents[currentStudentIndex];
    return students.find(s => s.id === studentId);
  };

  const validateScore = (rule: any, value: number) => {
    if (value === undefined || value === null) return Promise.resolve();

    if (value < 0 || value > 100) {
      return Promise.reject('ពិន្ទុត្រូវតែនៅចន្លោះ 0 និង 100');
    }

    return Promise.resolve();
  };

  if (loadingStudents) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>កំពុងផ្ទុកសិស្ស...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={
      mode === 'single' ? 'បង្កើតការវាយតម្លៃ' :
      `បញ្ចូលការវាយតម្លៃជាក្រុម (${currentStudentIndex + 1}/${selectedStudents.length})`
    }>
      {mode === 'bulk' && (
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          <Step title="បញ្ចូលទិន្នន័យ" />
          <Step title="ពិនិត្យ និងដាក់ស្នើ" />
        </Steps>
      )}

      {user?.role === 'mentor' && (
        <Alert
          message="ការវាយតម្លៃរបស់អ្នកណែនាំ"
          description="ការវាយតម្លៃនេះនឹងត្រូវបានសម្គាល់ថាជាបណ្តោះអាសន្ន និងនឹងត្រូវលុបដោយស្វ័យប្រវត្តិបន្ទាប់ពី ៤៨ ម៉ោង លុះត្រាតែត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍ដោយអ្នកគ្រប់គ្រង ឬគ្រូបង្រៀន។"
          type="warning"
          showIcon
          style={{ marginBottom: '24px' }}
        />
      )}

      {mode === 'bulk' && currentStep === 0 && (
        <div style={{ marginBottom: '24px' }}>
          <Title level={4}>
            សិស្សសព្វថ្ងៃ៖ {getCurrentStudent()?.name}
          </Title>
          <Text type="secondary">
            ដំណើរការ៖ {currentStudentIndex + 1} នៃ {selectedStudents.length}
          </Text>
        </div>
      )}

      {currentStep === 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={mode === 'single' ? handleSingleSubmit : handleBulkNext}
          disabled={loading}
          initialValues={{
            assessment_type: assessmentType || 'baseline',
            subject: subject || 'language',
            assessed_date: dayjs()
          }}
        >
          {mode === 'single' && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="student_id"
                  label="ជ្រើសរើសសិស្ស"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសសិស្ស' }]}
                >
                  <Select
                    placeholder="ជ្រើសរើសសិស្ស"
                    showSearch
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {availableStudents.map((student: any) => (
                      <Option key={student.id} value={student.id}>
                        {student.name}
                        {student.school_class && ` - ${student.school_class.name}`}
                        {student.pilot_school && ` (${student.pilot_school.name})`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assessment_type"
                label="ប្រភេទតេស្ត"
                rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទតេស្ត' }]}
              >
                <Radio.Group>
                  {assessmentTypes.map(type => (
                    <Radio.Button key={type.value} value={type.value}>
                      <Tag color={type.color} style={{ margin: 0 }}>
                        {type.label_km}
                      </Tag>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="subject"
                label="មុខវិជ្ជា"
                rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា' }]}
              >
                <Radio.Group onChange={(e) => handleSubjectChange(e.target.value)}>
                  {subjects.map(subj => (
                    <Radio.Button key={subj.value} value={subj.value}>
                      <Tag color={subj.value === 'language' ? 'purple' : 'cyan'} style={{ margin: 0 }}>
                        {subj.label_km}
                      </Tag>
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="level"
                label="កម្រិតសិស្ស"
                rules={[{ required: true, message: 'សូមជ្រើសរើសកម្រិត' }]}
              >
                <Select placeholder="ជ្រើសរើសកម្រិត">
                  {availableLevels.map(level => (
                    <Option key={level.value} value={level.value}>
                      <strong>{level.label_km}</strong>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="score"
                label="ពិន្ទុ (%)"
                rules={[{ validator: validateScore }]}
              >
                <InputNumber
                  placeholder="បញ្ចូលពិន្ទុ (0-100)"
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="assessed_date"
                label="កាលបរិច្ឆេទវាយតម្លៃ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទវាយតម្លៃ' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current > dayjs().endOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="notes"
                label="កំណត់ចំណាំ"
              >
                <TextArea
                  rows={4}
                  placeholder="បន្ថែមសេចក្តីសម្គាល់ ឬកំណត់ចំណាំអំពីការវាយតម្លៃ..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              {mode === 'single' ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  រក្សាទុកការវាយតម្លៃ
                </Button>
              ) : (
                <>
                  {currentStudentIndex > 0 && (
                    <Button onClick={handleBulkPrevious}>
                      សិស្សមុន
                    </Button>
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    {currentStudentIndex < selectedStudents.length - 1 ?
                      'សិស្សបន្ទាប់' : 'ពិនិត្យទាំងអស់'
                    }
                  </Button>
                </>
              )}

              <Button
                onClick={() => form.resetFields()}
                disabled={loading}
              >
                កំណត់ឡើងវិញ
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}

      {mode === 'bulk' && currentStep === 1 && (
        <div>
          <Title level={4}>ពិនិត្យការវាយតម្លៃទាំងអស់</Title>

          <div style={{ marginBottom: '24px' }}>
            {selectedStudents.map(studentId => {
              const student = students.find(s => s.id === studentId);
              const data = assessmentData[studentId];

              // Get Khmer labels
              const getAssessmentTypeLabel = (type: string) => {
                switch(type) {
                  case 'baseline': return 'តេស្តដើមគ្រា';
                  case 'midline': return 'តេស្តពាក់កណ្ដាលគ្រា';
                  case 'endline': return 'តេស្តចុងក្រោយគ្រា';
                  default: return type;
                }
              };

              const getSubjectLabel = (subj: string) => {
                switch(subj) {
                  case 'khmer':
                  case 'language': return 'ភាសាខ្មែរ';
                  case 'math': return 'គណិតវិទ្យា';
                  default: return subj;
                }
              };

              return (
                <Card key={studentId} size="small" style={{ marginBottom: '8px' }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <strong>{student?.name}</strong>
                    </Col>
                    <Col span={4}>
                      <Tag color="blue">{getAssessmentTypeLabel(data?.assessment_type)}</Tag>
                    </Col>
                    <Col span={4}>
                      <Tag color="purple">{getSubjectLabel(data?.subject)}</Tag>
                    </Col>
                    <Col span={4}>
                      <Tag color="orange">{data?.level?.toUpperCase()}</Tag>
                    </Col>
                    <Col span={3}>
                      ពិន្ទុ៖ {data?.score || '-'}%
                    </Col>
                    <Col span={3}>
                      {data?.assessed_date}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>

          <Space>
            <Button onClick={() => setCurrentStep(0)}>
              ត្រឡប់ទៅកែសម្រួល
            </Button>
            <Button
              type="primary"
              onClick={handleBulkSubmit}
              loading={loading}
              icon={<SendOutlined />}
            >
              ដាក់ស្នើការវាយតម្លៃទាំងអស់
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default AssessmentForm;