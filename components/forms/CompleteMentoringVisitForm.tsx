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
  Checkbox,
  Divider,
  Steps,
  message,
  Spin,
  Space,
  Typography,
  Alert,
  Tabs,
  Table,
  Tag
} from 'antd';
import { 
  UploadOutlined, 
  PlusOutlined, 
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  BookOutlined,
  ScheduleOutlined,
  FormOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import type { UploadFile } from 'antd';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface CompleteMentoringVisitFormProps {
  visit?: any;
  onSubmit: (values: any) => Promise<void>;
  loading?: boolean;
  mode: 'create' | 'edit' | 'view';
}

const CompleteMentoringVisitForm: React.FC<CompleteMentoringVisitFormProps> = ({ 
  visit, 
  onSubmit, 
  loading = false, 
  mode 
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [currentStep, setCurrentStep] = useState(0);
  const [pilotSchools, setPilotSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [classInSession, setClassInSession] = useState(true);
  const [subjectObserved, setSubjectObserved] = useState<string>('');
  const [numberOfActivities, setNumberOfActivities] = useState(1);

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
    setSubjectObserved(visit.subject_observed || '');
    setNumberOfActivities(visit.number_of_activities || 1);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Transform data to match database schema
      const formData = {
        ...values,
        visit_date: values.visit_date ? dayjs(values.visit_date).format('YYYY-MM-DD') : undefined,
        pilot_school_id: parseInt(values.pilot_school_id),
        teacher_id: values.teacher_id ? parseInt(values.teacher_id) : undefined,
        
        // Convert string arrays to JSON for database storage
        language_levels_observed: Array.isArray(values.language_levels_observed) ? 
          JSON.stringify(values.language_levels_observed) : values.language_levels_observed,
        numeracy_levels_observed: Array.isArray(values.numeracy_levels_observed) ? 
          JSON.stringify(values.numeracy_levels_observed) : values.numeracy_levels_observed,
        teaching_materials: Array.isArray(values.teaching_materials) ? 
          JSON.stringify(values.teaching_materials) : values.teaching_materials,
      };
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('សូមមើលគ្រប់ចំណាក់ដែលត្រូវការ');
    }
  };

  const steps = [
    {
      title: 'ព័ត៌មានជាមូលដ្ឋាន',
      icon: <FormOutlined />,
    },
    {
      title: 'ការសំឡឹងថ្នាក់',
      icon: <TeamOutlined />,
    },
    {
      title: 'សកម្មភាពបង្រៀន',
      icon: <BookOutlined />,
    },
    {
      title: 'មតិយោបល់ & សកម្មភាព',
      icon: <ScheduleOutlined />,
    },
  ];

  const renderBasicInformation = () => (
    <Card>
      <Title level={4} style={{ fontFamily: 'Hanuman, sans-serif' }}>ព័ត៌មានការចុះអប់រំ</Title>
      
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
            name="program_type"
            label="ប្រភេទកម្មវិធី"
            initialValue="TaRL"
          >
            <Select>
              <Option value="TaRL">TaRL</Option>
              <Option value="CAMBODIeL">CAMBODIeL</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="grade_group"
            label="ក្រុមថ្នាក់"
          >
            <Select placeholder="ជ្រើសរើសក្រុមថ្នាក់">
              <Option value="4">ថ្នាក់ទី ៤</Option>
              <Option value="5">ថ្នាក់ទី ៥</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      
      <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ព័ត៌មានទីតាំង</Title>
      
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="province" label="ខេត្ត">
            <Input placeholder="បញ្ចូលខេត្ត" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="district" label="ស្រុក/ក្រុង">
            <Input placeholder="បញ្ចូលស្រុក/ក្រុង" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="commune" label="ឃុំ/សង្កាត់">
            <Input placeholder="បញ្ចូលឃុំ/សង្កាត់" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="village" label="ភូមិ">
            <Input placeholder="បញ្ចូលភូមិ" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const renderClassObservation = () => (
    <Card>
      <Title level={4} style={{ fontFamily: 'Hanuman, sans-serif' }}>ព័ត៌មានសំឡេងថ្នាក់</Title>
      
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

      {classInSession && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_session_observed"
                label="តើបានសំឡេងមើលពេញមួយសេសិនទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="class_started_on_time"
                label="តើថ្នាក់រៀនចាប់ផ្តើមទាន់ពេលវេលាទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="late_start_reason"
            label="ប្រសិនបើយឺត មូលហេតុនៃការចាប់ផ្តើមយឺត"
            dependencies={['class_started_on_time']}
          >
            <TextArea rows={2} placeholder="ពន្យល់ពីមូលហេតុនៃការចាប់ផ្តើមយឺត" />
          </Form.Item>

          <Divider />
          
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ព័ត៌មានសិស្ស</Title>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="total_students_enrolled"
                label="ចំនួនសិស្សចុះឈ្មោះសរុប"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="students_present"
                label="ចំនួនសិស្សមកវត្តមាន"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="students_improved"
                label="ចំនួនសិស្សដែលមានភាពកែលម្អ"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classes_conducted_before_visit"
                label="ចំនួនកម្រិតថ្នាក់ដែលបានធ្វើមុនការចុះអប់រំ"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="students_improved_from_last_week"
                label="ចំនួនសិស្សមានភាពកែលម្អចាប់ពីសប្តាហ៍មុន"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>មុខវិច្ឆា និងកម្រិត</Title>
          
          <Form.Item
            name="subject_observed"
            label="មុខវិច្ឆាដែលបានសំឡេង"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={(e) => setSubjectObserved(e.target.value)}>
              <Radio value="khmer">ខ្មែរ</Radio>
              <Radio value="math">គណិតវិទ្យា</Radio>
            </Radio.Group>
          </Form.Item>

          {subjectObserved === 'khmer' && (
            <Form.Item
              name="language_levels_observed"
              label="កម្រិតភាសាដែលបានសំឡេង"
            >
              <Checkbox.Group>
                <Row>
                  <Col span={6}><Checkbox value="beginner">ចាប់ផ្តើម</Checkbox></Col>
                  <Col span={6}><Checkbox value="letter">អក្សរ</Checkbox></Col>
                  <Col span={6}><Checkbox value="word">ពាក្យ</Checkbox></Col>
                  <Col span={6}><Checkbox value="paragraph">កណ្ដាប់</Checkbox></Col>
                  <Col span={6}><Checkbox value="story">រឿះនិយាយ</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          )}

          {subjectObserved === 'math' && (
            <Form.Item
              name="numeracy_levels_observed"
              label="កម្រិតលេខដែលបានសំឡេង"
            >
              <Checkbox.Group>
                <Row>
                  <Col span={6}><Checkbox value="beginner">ចាប់ផ្តើម</Checkbox></Col>
                  <Col span={6}><Checkbox value="1-9">លេខ ១-៩</Checkbox></Col>
                  <Col span={6}><Checkbox value="10-99">លេខ ១០-៩៩</Checkbox></Col>
                  <Col span={6}><Checkbox value="100-999">លេខ ១០០-៩៩៩</Checkbox></Col>
                  <Col span={6}><Checkbox value="operations">ការឃុសគុណ</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          )}

          <Divider />
          
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ការរៀបចំក្នុងបន្ទប់</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="students_grouped_by_level"
                label="តើសិស្សបានបញ្ចូលក្នុងក្រុមតាមកម្រិតទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="children_grouped_appropriately"
                label="តើកុមារបានបញ្ចូលក្នុងក្រុមតាមរៀបៀបសមរម្យទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="students_active_participation"
                label="តើសិស្សមានការចុះរួមយ៉ាងសកម្មទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="students_fully_involved"
                label="តើសិស្សមានការចុះរួមពេញលេំទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ការរៀបចំរបស់គ្រូ</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="has_session_plan"
                label="តើគ្រូមានការរៀបចំមើលទេ?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="followed_session_plan"
                label="តើគ្រូបានចម្ថែងតាមការរៀបចំមើលទេ?"
                dependencies={['has_session_plan']}
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="no_session_plan_reason"
            label="ប្រសិនបើមិនមានការរៀបចំ សូមពន្យល់មូលហេតុ"
            dependencies={['has_session_plan']}
          >
            <TextArea rows={2} placeholder="មូលហេតុមិនមានការរៀបចំមើល" />
          </Form.Item>

          <Form.Item
            name="no_follow_plan_reason"
            label="ប្រសិនបើមិនបានចម្ថែងតាមការរៀបចំ សូមពន្យល់មូលហេតុ"
            dependencies={['followed_session_plan']}
          >
            <TextArea rows={2} placeholder="មូលហេតុមិនបានចម្ថែងតាមការរៀបចំ" />
          </Form.Item>

          <Form.Item
            name="session_plan_appropriate"
            label="តើការរៀបចំមើលសមរម្យសម្រាប់កម្រិតទេ?"
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Divider />
          
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ឧបករណ៍បង្រៀន</Title>
          
          <Form.Item
            name="teaching_materials"
            label="ឧបករណ៍បង្រៀនដែលបានប្រើ"
          >
            <Checkbox.Group>
              <Row>
                <Col span={6}><Checkbox value="textbooks">សេចក្តីសិក្សា</Checkbox></Col>
                <Col span={6}><Checkbox value="cards">កាតវិចារ</Checkbox></Col>
                <Col span={6}><Checkbox value="charts">គំរូរីស៊</Checkbox></Col>
                <Col span={6}><Checkbox value="games">ក្រេះ</Checkbox></Col>
                <Col span={6}><Checkbox value="digital">ឧបករណ៍ដិជិតាល</Checkbox></Col>
                <Col span={6}><Checkbox value="other">ផ្សេងទៀត</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="materials_present"
            label="ឧបករណ៍មាន និងប្រើបាន"
          >
            <TextArea rows={2} placeholder="ពន្យល់ពីឧបករណ៍ដែលមាន" />
          </Form.Item>
        </>
      )}
    </Card>
  );

  const renderActivity = (activityNumber: number) => {
    const prefix = `activity${activityNumber}_`;
    
    return (
      <Card key={activityNumber} style={{ marginBottom: 16 }}>
        <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>សកម្មភាព {activityNumber}</Title>
        
        {subjectObserved === 'khmer' ? (
          <Form.Item
            name={`${prefix}name_language`}
            label="ឈ្មោះសកម្មភាពភាសា"
            rules={[{ required: true }]}
          >
            <Select placeholder="ជ្រើសរើសសកម្មភាពភាសា">
              <Option value="letter_recognition">ការស្គាល់អក្សរ</Option>
              <Option value="word_building">ការបង្កើតពាក្យ</Option>
              <Option value="reading_aloud">ការអានក្លាំង</Option>
              <Option value="story_telling">ការនិយាយរឿះ</Option>
              <Option value="writing_practice">ការចម្រីនសរសេរ</Option>
              <Option value="vocabulary">គម្រោពាក្យ</Option>
              <Option value="comprehension">ការយុលដឹង</Option>
            </Select>
          </Form.Item>
        ) : null}

        {subjectObserved === 'math' ? (
          <Form.Item
            name={`${prefix}name_numeracy`}
            label="ឈ្មោះសកម្មភាពលេខ"
            rules={[{ required: true }]}
          >
            <Select placeholder="ជ្រើសរើសសកម្មភាពលេខ">
              <Option value="number_recognition">ការស្គាល់លេខ</Option>
              <Option value="counting">ការរំប្រាប់</Option>
              <Option value="addition">ការបំណាក់</Option>
              <Option value="subtraction">ការដក</Option>
              <Option value="multiplication">ការគុណ</Option>
              <Option value="division">ការᡪគារ</Option>
              <Option value="problem_solving">ការដោះស្រាយបញ្ហា</Option>
              <Option value="patterns">លំដាប់ & លំដាប់បន្ត</Option>
            </Select>
          </Form.Item>
        ) : null}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`${prefix}duration`}
              label="រយៈពេល (នាទី)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}clear_instructions`}
              label="តើបានផ្តល់ការណេនាំច្បាស់ទេ?"
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}demonstrated`}
              label="តើបានបង្ហាញសកម្មភាពទេ?"
            >
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name={`${prefix}no_clear_instructions_reason`}
          label="ប្រសិនបើការណេនាំមិនច្បាស់ សូមពន្យល់មូលហេតុ"
          dependencies={[`${prefix}clear_instructions`]}
        >
          <TextArea rows={2} placeholder="មូលហេតុនៃការណេនាំមិនច្បាស់" />
        </Form.Item>

        {activityNumber <= 2 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={`${prefix}followed_process`}
                  label="តើបានចម្ថែងតាមដំណើរការត្រឹមត្រូវទេ?"
                >
                  <Radio.Group>
                    <Radio value={true}>Yes</Radio>
                    <Radio value={false}>No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              
              <Col span={12}>
                <Form.Item
                  name={`${prefix}type`}
                  label="ប្រភេទសកម្មភាព"
                >
                  <Select placeholder="ជ្រើសរើសប្រភេទសកម្មភាព">
                    <Option value="individual">ការងារក្នុងអ្នកមួយ</Option>
                    <Option value="pairs">ការងារជាកប្រាឃពីរ</Option>
                    <Option value="small_group">ក្រុមតូច</Option>
                    <Option value="whole_class">ធ្នាប់ទាំងមូល</Option>
                    <Option value="mixed">ចម្រុះ</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={`${prefix}not_followed_reason`}
              label="ប្រសិនបើមិនបានចម្ថែងតាមដំណើរការ សូមពន្យល់មូលហេតុ"
              dependencies={[`${prefix}followed_process`]}
            >
              <TextArea rows={2} placeholder="មូលហេតុមិនបានចម្ថែងតាមដំណើរការ" />
            </Form.Item>
          </>
        )}

        <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>ការចម្រីនរបស់សិស្ស</Title>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`${prefix}students_practice`}
              label="តើសិស្សបានចម្រីនទេ?"
            >
              <Select placeholder="ជ្រើសរើសកម្រិតការចម្រីន">
                <Option value="all">សិស្សទាំងអស់</Option>
                <Option value="most">សិស្សផ្នែកឈ្ចើន</Option>
                <Option value="some">សិស្សមួយចំនួន</Option>
                <Option value="few">សិស្សប្រាក់តិច</Option>
                <Option value="none">គ្មានសិស្សទេ</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}small_groups`}
              label="ការងារក្រុមតូច?"
            >
              <Select placeholder="ជ្រើសរើសប្រសិទ្ធភាព">
                <Option value="very_effective">មានប្រសិទ្ធភាពក្បំបំផុត</Option>
                <Option value="effective">មានប្រសិទ្ធភាព</Option>
                <Option value="somewhat_effective">មានប្រសិទ្ធភាពមួយចំណែក</Option>
                <Option value="not_effective">មិនមានប្រសិទ្ធភាព</Option>
                <Option value="na">មិនមាន</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name={`${prefix}individual`}
              label="ការងារធ្នាប់ក្នុងអ្នកមួយ?"
            >
              <Select placeholder="ជ្រើសរើសប្រសិទ្ធភាព">
                <Option value="very_effective">មានប្រសិទ្ធភាពក្បំបំផុត</Option>
                <Option value="effective">មានប្រសិទ្ធភាព</Option>
                <Option value="somewhat_effective">មានប្រសិទ្ធភាពមួយចំណែក</Option>
                <Option value="not_effective">មិនមានប្រសិទ្ធភាព</Option>
                <Option value="na">មិនមាន</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderTeachingActivities = () => (
    <Card>
      <Title level={4} style={{ fontFamily: 'Hanuman, sans-serif' }}>សកម្មភាពបង្រៀនដែលបានសំឡេង</Title>
      
      <Form.Item
        name="number_of_activities"
        label="ចំនួនសកម្មភាពដែលបានសំឡេង"
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={(e) => setNumberOfActivities(e.target.value)}>
          <Radio value={1}>សកម្មភាព ១</Radio>
          <Radio value={2}>សកម្មភាព ២</Radio>
          <Radio value={3}>សកម្មភាព ៣</Radio>
        </Radio.Group>
      </Form.Item>

      {[...Array(numberOfActivities)].map((_, i) => renderActivity(i + 1))}
    </Card>
  );

  const renderFeedbackAndActions = () => (
    <Card>
      <Title level={4} style={{ fontFamily: 'Hanuman, sans-serif' }}>មតិយោបល់ និងសកម្មភាពបន្ត</Title>
      
      <Form.Item
        name="observation"
        label="ការសំឡេងសរុប"
        rules={[{ required: true }]}
      >
        <TextArea 
          rows={4} 
          placeholder="ផ្តល់ការសំឡេងលមាប់អំពីមើលបង្រៀន ការចុះរួមរបស់សិស្ស និងបរិ័កាសបន្ទប់"
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
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="feedback_for_teacher"
        label="មតិយោបល់សម្រាប់គ្រូ"
        rules={[{ required: true }]}
      >
        <TextArea 
          rows={4} 
          placeholder="ផ្តល់មតិយោបល់ច្បាស់លាស់ និងការគាំត្រសម្រាប់គ្រូ"
        />
      </Form.Item>

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
        name="action_plan"
        label="សកម្មភាពនៃការនិញ្ញការ"
      >
        <TextArea 
          rows={3} 
          placeholder="បញ្ជីសកម្មភាពច្បាស់លាស់ដែលត្រូវគ្រេងមុនការចុះអប់រំបន្ទាប់"
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

      <Divider />
      
      <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>រូបភាពសម្រាប់ការចុះអប់រំ</Title>
      
      <Form.Item
        name="photo"
        label="ពន្លិតរូបភាពការចុះអប់រំ"
      >
        <Upload
          listType="picture-card"
          maxCount={5}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>ពន្លិត</div>
          </div>
        </Upload>
      </Form.Item>
    </Card>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInformation();
      case 1:
        return renderClassObservation();
      case 2:
        return renderTeachingActivities();
      case 3:
        return renderFeedbackAndActions();
      default:
        return null;
    }
  };

  if (loadingData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>កំពុងផ្ទុកទិន្នន័យផុរ្ម...</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <Steps 
          current={currentStep} 
          items={steps}
          onChange={setCurrentStep}
        />
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading || mode === 'view'}
        style={{ marginTop: 24 }}
      >
        {renderStepContent()}

        <Card style={{ marginTop: 24 }}>
          <Space>
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                ក្រោយ
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                បន្ត
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {mode === 'create' ? 'បញ្ជូនការចុះអប់រំ' : 'កែប្រេការចុះអប់រំ'}
              </Button>
            )}
            
            <Button 
              onClick={() => {
                form.resetFields();
                setCurrentStep(0);
              }}
              disabled={loading}
            >
              សម្ឡាត
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default CompleteMentoringVisitForm;