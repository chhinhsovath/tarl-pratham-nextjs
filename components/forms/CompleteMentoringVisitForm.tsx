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
      message.error('Failed to load form data');
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
      const formData = {
        ...values,
        visit_date: values.visit_date ? dayjs(values.visit_date).format('YYYY-MM-DD') : undefined,
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('Please check all required fields');
    }
  };

  const steps = [
    {
      title: 'Basic Information',
      icon: <FormOutlined />,
    },
    {
      title: 'Class Observation',
      icon: <TeamOutlined />,
    },
    {
      title: 'Teaching Activities',
      icon: <BookOutlined />,
    },
    {
      title: 'Feedback & Actions',
      icon: <ScheduleOutlined />,
    },
  ];

  const renderBasicInformation = () => (
    <Card>
      <Title level={4}>Visit Information</Title>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="pilot_school_id"
            label="Pilot School"
            rules={[{ required: true, message: 'Please select a school' }]}
          >
            <Select 
              placeholder="Select pilot school"
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
            label="Teacher"
            rules={[{ required: true, message: 'Please select a teacher' }]}
          >
            <Select 
              placeholder="Select teacher"
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
            label="Visit Date"
            rules={[{ required: true, message: 'Visit date is required' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        
        <Col span={8}>
          <Form.Item
            name="program_type"
            label="Program Type"
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
            label="Grade Group"
          >
            <Select placeholder="Select grade group">
              <Option value="1-2">Grades 1-2</Option>
              <Option value="3-4">Grades 3-4</Option>
              <Option value="5-6">Grades 5-6</Option>
              <Option value="mixed">Mixed Grades</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider />
      
      <Title level={5}>Location Details</Title>
      
      <Row gutter={16}>
        <Col span={6}>
          <Form.Item name="province" label="Province">
            <Input placeholder="Enter province" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="district" label="District">
            <Input placeholder="Enter district" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="commune" label="Commune">
            <Input placeholder="Enter commune" />
          </Form.Item>
        </Col>
        
        <Col span={6}>
          <Form.Item name="village" label="Village">
            <Input placeholder="Enter village" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const renderClassObservation = () => (
    <Card>
      <Title level={4}>Class Session Information</Title>
      
      <Form.Item
        name="class_in_session"
        label="Was the class in session?"
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={(e) => setClassInSession(e.target.value)}>
          <Radio value={true}>Yes</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>

      {!classInSession && (
        <Form.Item
          name="class_not_in_session_reason"
          label="Reason for class not in session"
          rules={[{ required: true, message: 'Please provide a reason' }]}
        >
          <TextArea rows={2} placeholder="Explain why the class was not in session" />
        </Form.Item>
      )}

      {classInSession && (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_session_observed"
                label="Was the full session observed?"
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
                label="Did the class start on time?"
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
            label="If late, reason for late start"
            dependencies={['class_started_on_time']}
          >
            <TextArea rows={2} placeholder="Explain reason for late start" />
          </Form.Item>

          <Divider />
          
          <Title level={5}>Student Information</Title>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="total_students_enrolled"
                label="Total Students Enrolled"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="students_present"
                label="Students Present"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={8}>
              <Form.Item
                name="students_improved"
                label="Students Improved"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="classes_conducted_before_visit"
                label="Classes Conducted Before Visit"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="students_improved_from_last_week"
                label="Students Improved from Last Week"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          
          <Title level={5}>Subject and Levels</Title>
          
          <Form.Item
            name="subject_observed"
            label="Subject Observed"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={(e) => setSubjectObserved(e.target.value)}>
              <Radio value="khmer">Khmer</Radio>
              <Radio value="math">Mathematics</Radio>
              <Radio value="both">Both</Radio>
            </Radio.Group>
          </Form.Item>

          {(subjectObserved === 'khmer' || subjectObserved === 'both') && (
            <Form.Item
              name="language_levels_observed"
              label="Language Levels Observed"
            >
              <Checkbox.Group>
                <Row>
                  <Col span={6}><Checkbox value="beginner">Beginner</Checkbox></Col>
                  <Col span={6}><Checkbox value="letter">Letter</Checkbox></Col>
                  <Col span={6}><Checkbox value="word">Word</Checkbox></Col>
                  <Col span={6}><Checkbox value="paragraph">Paragraph</Checkbox></Col>
                  <Col span={6}><Checkbox value="story">Story</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          )}

          {(subjectObserved === 'math' || subjectObserved === 'both') && (
            <Form.Item
              name="numeracy_levels_observed"
              label="Numeracy Levels Observed"
            >
              <Checkbox.Group>
                <Row>
                  <Col span={6}><Checkbox value="beginner">Beginner</Checkbox></Col>
                  <Col span={6}><Checkbox value="1-9">Numbers 1-9</Checkbox></Col>
                  <Col span={6}><Checkbox value="10-99">Numbers 10-99</Checkbox></Col>
                  <Col span={6}><Checkbox value="100-999">Numbers 100-999</Checkbox></Col>
                  <Col span={6}><Checkbox value="operations">Operations</Checkbox></Col>
                </Row>
              </Checkbox.Group>
            </Form.Item>
          )}

          <Divider />
          
          <Title level={5}>Classroom Organization</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="students_grouped_by_level"
                label="Were students grouped by level?"
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
                label="Were children grouped appropriately?"
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
                label="Active student participation?"
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
                label="Were students fully involved?"
              >
                <Radio.Group>
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Divider />
          
          <Title level={5}>Teacher Planning</Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="has_session_plan"
                label="Does teacher have session plan?"
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
                label="Did teacher follow the session plan?"
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
            label="If no plan, explain why"
            dependencies={['has_session_plan']}
          >
            <TextArea rows={2} placeholder="Reason for not having session plan" />
          </Form.Item>

          <Form.Item
            name="no_follow_plan_reason"
            label="If plan not followed, explain why"
            dependencies={['followed_session_plan']}
          >
            <TextArea rows={2} placeholder="Reason for not following plan" />
          </Form.Item>

          <Form.Item
            name="session_plan_appropriate"
            label="Was the session plan appropriate for levels?"
          >
            <Radio.Group>
              <Radio value={true}>Yes</Radio>
              <Radio value={false}>No</Radio>
            </Radio.Group>
          </Form.Item>

          <Divider />
          
          <Title level={5}>Classroom Materials</Title>
          
          <Form.Item
            name="teaching_materials"
            label="Teaching Materials Used"
          >
            <Checkbox.Group>
              <Row>
                <Col span={6}><Checkbox value="textbooks">Textbooks</Checkbox></Col>
                <Col span={6}><Checkbox value="cards">Flash Cards</Checkbox></Col>
                <Col span={6}><Checkbox value="charts">Charts</Checkbox></Col>
                <Col span={6}><Checkbox value="games">Games</Checkbox></Col>
                <Col span={6}><Checkbox value="digital">Digital Tools</Checkbox></Col>
                <Col span={6}><Checkbox value="other">Other</Checkbox></Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item
            name="materials_present"
            label="Materials Present and Available"
          >
            <TextArea rows={2} placeholder="Describe available materials" />
          </Form.Item>
        </>
      )}
    </Card>
  );

  const renderActivity = (activityNumber: number) => {
    const prefix = `activity${activityNumber}_`;
    
    return (
      <Card key={activityNumber} style={{ marginBottom: 16 }}>
        <Title level={5}>Activity {activityNumber}</Title>
        
        {subjectObserved === 'khmer' || subjectObserved === 'both' ? (
          <Form.Item
            name={`${prefix}name_language`}
            label="Language Activity Name"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select language activity">
              <Option value="letter_recognition">Letter Recognition</Option>
              <Option value="word_building">Word Building</Option>
              <Option value="reading_aloud">Reading Aloud</Option>
              <Option value="story_telling">Story Telling</Option>
              <Option value="writing_practice">Writing Practice</Option>
              <Option value="vocabulary">Vocabulary</Option>
              <Option value="comprehension">Comprehension</Option>
            </Select>
          </Form.Item>
        ) : null}

        {subjectObserved === 'math' || subjectObserved === 'both' ? (
          <Form.Item
            name={`${prefix}name_numeracy`}
            label="Numeracy Activity Name"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select numeracy activity">
              <Option value="number_recognition">Number Recognition</Option>
              <Option value="counting">Counting</Option>
              <Option value="addition">Addition</Option>
              <Option value="subtraction">Subtraction</Option>
              <Option value="multiplication">Multiplication</Option>
              <Option value="division">Division</Option>
              <Option value="problem_solving">Problem Solving</Option>
              <Option value="patterns">Patterns & Sequences</Option>
            </Select>
          </Form.Item>
        ) : null}

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`${prefix}duration`}
              label="Duration (minutes)"
              rules={[{ required: true }]}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}clear_instructions`}
              label="Clear Instructions Given?"
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
              label="Activity Demonstrated?"
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
          label="If instructions unclear, explain why"
          dependencies={[`${prefix}clear_instructions`]}
        >
          <TextArea rows={2} placeholder="Reason for unclear instructions" />
        </Form.Item>

        {activityNumber <= 2 && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={`${prefix}followed_process`}
                  label="Followed Correct Process?"
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
                  label="Activity Type"
                >
                  <Select placeholder="Select activity type">
                    <Option value="individual">Individual</Option>
                    <Option value="pairs">Pairs</Option>
                    <Option value="small_group">Small Group</Option>
                    <Option value="whole_class">Whole Class</Option>
                    <Option value="mixed">Mixed</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={`${prefix}not_followed_reason`}
              label="If process not followed, explain why"
              dependencies={[`${prefix}followed_process`]}
            >
              <TextArea rows={2} placeholder="Reason for not following process" />
            </Form.Item>
          </>
        )}

        <Title level={5}>Student Practice</Title>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`${prefix}students_practice`}
              label="Students Practiced?"
            >
              <Select placeholder="Select practice level">
                <Option value="all">All Students</Option>
                <Option value="most">Most Students</Option>
                <Option value="some">Some Students</Option>
                <Option value="few">Few Students</Option>
                <Option value="none">No Students</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}small_groups`}
              label="Small Group Work?"
            >
              <Select placeholder="Select effectiveness">
                <Option value="very_effective">Very Effective</Option>
                <Option value="effective">Effective</Option>
                <Option value="somewhat_effective">Somewhat Effective</Option>
                <Option value="not_effective">Not Effective</Option>
                <Option value="na">N/A</Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item
              name={`${prefix}individual`}
              label="Individual Work?"
            >
              <Select placeholder="Select effectiveness">
                <Option value="very_effective">Very Effective</Option>
                <Option value="effective">Effective</Option>
                <Option value="somewhat_effective">Somewhat Effective</Option>
                <Option value="not_effective">Not Effective</Option>
                <Option value="na">N/A</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  const renderTeachingActivities = () => (
    <Card>
      <Title level={4}>Teaching Activities Observed</Title>
      
      <Form.Item
        name="number_of_activities"
        label="Number of Activities Observed"
        rules={[{ required: true }]}
      >
        <Radio.Group onChange={(e) => setNumberOfActivities(e.target.value)}>
          <Radio value={1}>1 Activity</Radio>
          <Radio value={2}>2 Activities</Radio>
          <Radio value={3}>3 Activities</Radio>
        </Radio.Group>
      </Form.Item>

      {[...Array(numberOfActivities)].map((_, i) => renderActivity(i + 1))}
    </Card>
  );

  const renderFeedbackAndActions = () => (
    <Card>
      <Title level={4}>Feedback and Follow-up Actions</Title>
      
      <Form.Item
        name="observation"
        label="Overall Observation"
        rules={[{ required: true }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Provide detailed observations about the teaching session, student engagement, and classroom environment"
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="score"
            label="Overall Score (1-100)"
          >
            <InputNumber 
              min={0} 
              max={100} 
              style={{ width: '100%' }}
              placeholder="Enter overall score"
            />
          </Form.Item>
        </Col>
        
        <Col span={12}>
          <Form.Item
            name="follow_up_required"
            label="Follow-up Required?"
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
        label="Feedback for Teacher"
        rules={[{ required: true }]}
      >
        <TextArea 
          rows={4} 
          placeholder="Provide specific, constructive feedback for the teacher"
        />
      </Form.Item>

      <Form.Item
        name="recommendations"
        label="Recommendations"
      >
        <TextArea 
          rows={3} 
          placeholder="List specific recommendations for improvement"
        />
      </Form.Item>

      <Form.Item
        name="action_plan"
        label="Action Plan"
      >
        <TextArea 
          rows={3} 
          placeholder="Outline specific actions to be taken before next visit"
        />
      </Form.Item>

      <Form.Item
        name="follow_up_actions"
        label="Follow-up Actions Required"
        dependencies={['follow_up_required']}
      >
        <TextArea 
          rows={3} 
          placeholder="Detail specific follow-up actions needed"
        />
      </Form.Item>

      <Divider />
      
      <Title level={5}>Photo Documentation</Title>
      
      <Form.Item
        name="photo"
        label="Upload Visit Photos"
      >
        <Upload
          listType="picture-card"
          maxCount={5}
          beforeUpload={() => false}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
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
          <p style={{ marginTop: 16 }}>Loading form data...</p>
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
                Previous
              </Button>
            )}
            
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Button>
            )}
            
            {currentStep === steps.length - 1 && (
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                {mode === 'create' ? 'Submit Visit' : 'Update Visit'}
              </Button>
            )}
            
            <Button 
              onClick={() => {
                form.resetFields();
                setCurrentStep(0);
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </Space>
        </Card>
      </Form>
    </div>
  );
};

export default CompleteMentoringVisitForm;