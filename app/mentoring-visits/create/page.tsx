'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Divider,
  message,
  Space,
  Radio,
  Checkbox,
  TimePicker
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  SchoolOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function CreateMentoringVisitPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);

  // Form state for conditional fields
  const [classInSession, setClassInSession] = useState<boolean>(true);
  const [hasLessonPlan, setHasLessonPlan] = useState<boolean>(true);
  const [followedLessonPlan, setFollowedLessonPlan] = useState<boolean>(true);
  const [numActivities, setNumActivities] = useState<number>(1);
  const [activity1ClearInstructions, setActivity1ClearInstructions] = useState<boolean>(true);
  const [activity1FollowedProcess, setActivity1FollowedProcess] = useState<boolean>(true);
  const [activity2ClearInstructions, setActivity2ClearInstructions] = useState<boolean>(true);
  const [activity2FollowedProcess, setActivity2FollowedProcess] = useState<boolean>(true);

  // Fetch initial data
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchTeachers = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/users?role=teacher&school_id=${schoolId}`);
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const onSchoolChange = (schoolId: number) => {
    setSelectedSchool(schoolId);
    form.setFieldValue('teacher_id', undefined);
    if (schoolId) {
      fetchTeachers(schoolId);
    } else {
      setTeachers([]);
    }
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Format date and time values
      const formattedValues = {
        ...values,
        visit_date: values.visit_date ? values.visit_date.format('YYYY-MM-DD') : null,
        teaching_materials: values.teaching_materials || [],
        grades_observed: values.grades_observed || [],
        language_levels_observed: values.language_levels_observed || [],
        numeracy_levels_observed: values.numeracy_levels_observed || []
      };

      const response = await fetch('/api/mentoring-visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedValues)
      });

      const data = await response.json();

      if (response.ok) {
        message.success('បង្កើតកាត់ទុកវិជ្ជាការបានជោគជ័យ');
        router.push(`/mentoring-visits/${data.data.id}`);
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការបង្កើតកាត់ទុកវិជ្ជាការ');
      }
    } catch (error) {
      console.error('Error creating mentoring visit:', error);
      message.error('មានបញ្ហាក្នុងការបង្កើតកាត់ទុកវិជ្ជាការ');
    } finally {
      setLoading(false);
    }
  };

  const teachingMaterialOptions = [
    'សៀវភៅសិក្សា',
    'ក្រដាសធម្មតា',
    'ក្រដាសខៀន',
    'ប៊ិច/ខ្មៅដៃ',
    'បន្ទះខៀន',
    'រូបភាព',
    'ប្រដាប់លេងការសិក្សា',
    'កុំព្យូទ័រ/ថេប្លេត',
    'វីដេអូ',
    'អ្វីផ្សេងទៀត'
  ];

  const gradeOptions = [
    'ថ្នាក់រៀនតូច',
    'ថ្នាក់រៀនធំ',
    'ថ្នាក់ទី១',
    'ថ្នាក់ទី២',
    'ថ្នាក់ទី៣',
    'ថ្នាក់ទី៤',
    'ថ្នាក់ទី៥',
    'ថ្នាក់ទី៦'
  ];

  const languageLevelOptions = [
    'មិនចេះអាន',
    'ស្គាល់អក្សរ',
    'អានពាក្យ',
    'អានប្រយោគ',
    'អានកថាខណ្ឌ',
    'អានរឿងខ្លី',
    'អានស្ទាបស្ទង់'
  ];

  const numeracyLevelOptions = [
    'មិនចេះរាប់',
    'រាប់ ១-៩',
    'រាប់ ១-៩៩',
    'បូកដក',
    'គុណ',
    'ចែក'
  ];

  const activityTypeOptions = [
    'ការអាន',
    'ការសរសេរ',
    'គណិតវិទ្យា',
    'ការលេង',
    'ការពិភាក្សាក្រុម',
    'ការបង្រៀនផ្ទាល់ខ្លួន',
    'ការអនុវត្តជាក្រុម',
    'ការប្រកួតប្រជែង',
    'ការសម្ដែង',
    'អ្វីផ្សេងទៀត'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            ត្រឡប់ក្រោយ
          </Button>
          <Title level={2} className="mb-0">
            បង្កើតកាត់ទុកវិជ្ជាការថ្មី
          </Title>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          visit_date: dayjs(),
          class_in_session: true,
          full_session_observed: true,
          teacher_has_lesson_plan: true,
          followed_lesson_plan: true,
          plan_appropriate_for_levels: true,
          students_grouped_by_level: true,
          students_active_participation: true,
          class_started_on_time: true,
          activity1_clear_instructions: true,
          activity1_followed_process: true,
          activity2_clear_instructions: true,
          activity2_followed_process: true,
          num_activities_observed: 1,
          follow_up_required: false
        }}
      >
        {/* Basic Information */}
        <Card title="ព័ត៌មានមូលដ្ឋាន" className="mb-4">
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="visit_date"
                label="កាលបរិច្ឆេទចុះអប់រំ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  format="DD/MM/YYYY"
                  placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pilot_school_id"
                label="សាលា"
                rules={[{ required: true, message: 'សូមជ្រើសរើសសាលា' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសសាលា"
                  showSearch
                  optionFilterProp="children"
                  onChange={onSchoolChange}
                >
                  {schools.map((school: any) => (
                    <Select.Option key={school.id} value={school.id}>
                      {school.school_name} ({school.school_code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="teacher_id"
                label="អ្នកបង្រៀន"
              >
                <Select
                  placeholder="ជ្រើសរើសអ្នកបង្រៀន"
                  showSearch
                  optionFilterProp="children"
                  disabled={!selectedSchool}
                >
                  {teachers.map((teacher: any) => (
                    <Select.Option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="region" label="តំបន់">
                <Input placeholder="បញ្ចូលតំបន់" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cluster" label="ជួរ">
                <Input placeholder="បញ្ចូលជួរ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="program_type" label="ប្រភេទកម្មវិធី">
                <Select placeholder="ជ្រើសរើសប្រភេទកម្មវិធី">
                  <Select.Option value="TaRL">TaRL</Select.Option>
                  <Select.Option value="រូបវិទ្យា">រូបវិទ្យា</Select.Option>
                  <Select.Option value="គណិតវិទ្យា">គណិតវិទ្យា</Select.Option>
                  <Select.Option value="ភាសាខ្មែរ">ភាសាខ្មែរ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Class Information */}
        <Card title="ព័ត៌មានថ្នាក់រៀន" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="class_in_session" label="ថ្នាក់រៀនកំពុងបង្រៀន" valuePropName="checked">
                <Switch 
                  onChange={setClassInSession}
                  checkedChildren="បាទ/ចាស"
                  unCheckedChildren="ទេ"
                />
              </Form.Item>
              {!classInSession && (
                <Form.Item name="class_not_in_session_reason" label="មូលហេតុដែលមិនបានបង្រៀន">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              <Form.Item name="full_session_observed" label="អង្កេតពេញមួយមេរៀន" valuePropName="checked">
                <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="grade_group" label="ក្រុមថ្នាក់">
                <Select placeholder="ជ្រើសរើសក្រុមថ្នាក់">
                  <Select.Option value="មត្តេយ្យ">មត្តេយ្យ</Select.Option>
                  <Select.Option value="បឋម">បឋម</Select.Option>
                  <Select.Option value="ចម្រុះ">ចម្រុះ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="grades_observed" label="ថ្នាក់រៀនដែលបានអង្កេត">
                <Select
                  mode="multiple"
                  placeholder="ជ្រើសរើសថ្នាក់រៀន"
                  options={gradeOptions.map(grade => ({ label: grade, value: grade }))}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="subject_observed" label="មុខវិជ្ជាដែលបានអង្កេត">
                <Select placeholder="ជ្រើសរើសមុខវិជ្ជា">
                  <Select.Option value="ភាសាខ្មែរ">ភាសាខ្មែរ</Select.Option>
                  <Select.Option value="គណិតវិទ្យា">គណិតវិទ្យា</Select.Option>
                  <Select.Option value="រូបវិទ្យា">រូបវិទ្យា</Select.Option>
                  <Select.Option value="ចម្រុះ">ចម្រុះ</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="language_levels_observed" label="កម្រិតភាសាដែលបានអង្កេត">
                <Select
                  mode="multiple"
                  placeholder="ជ្រើសរើសកម្រិតភាសា"
                  options={languageLevelOptions.map(level => ({ label: level, value: level }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numeracy_levels_observed" label="កម្រិតគណិតវិទ្យាដែលបានអង្កេត">
                <Select
                  mode="multiple"
                  placeholder="ជ្រើសរើសកម្រិតគណិតវិទ្យា"
                  options={numeracyLevelOptions.map(level => ({ label: level, value: level }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Student Data */}
        <Card title="ទិន្នន័យសិស្ស" className="mb-4">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="total_students_enrolled" label="សិស្សចុះឈ្មោះសរុប">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="students_present" label="សិស្សមកវត្តមាន">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="students_improved" label="សិស្សមានការរីកចម្រើន">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="classes_conducted_before" label="ថ្នាក់រៀនដែលធ្វើពីមុន">
                <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Delivery Questions */}
        <Card title="សំណួរអំពីការបង្រៀន" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="class_started_on_time" label="ថ្នាក់រៀនចាប់ផ្តើមទាន់ពេល" valuePropName="checked">
                <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
              </Form.Item>
              <Form.Item name="late_start_reason" label="មូលហេតុចាប់ផ្តើមយឺត">
                <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ (ប្រសិនបើមាន)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teaching_materials" label="ឧបករណ៍បង្រៀន">
                <Select
                  mode="multiple"
                  placeholder="ជ្រើសរើសឧបករណ៍បង្រៀន"
                  options={teachingMaterialOptions.map(material => ({ label: material, value: material }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Classroom Organization */}
        <Card title="ការរៀបចំថ្នាក់រៀន" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="students_grouped_by_level" label="សិស្សបានដាក់ក្រុមតាមកម្រិត" valuePropName="checked">
                <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="students_active_participation" label="សិស្សចូលរួមយ៉ាងសកម្ម" valuePropName="checked">
                <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Teacher Planning */}
        <Card title="ការរៀបចំរបស់អ្នកបង្រៀន" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="teacher_has_lesson_plan" label="អ្នកបង្រៀនមានផែនការបង្រៀន" valuePropName="checked">
                <Switch 
                  onChange={setHasLessonPlan}
                  checkedChildren="បាទ/ចាស" 
                  unCheckedChildren="ទេ" 
                />
              </Form.Item>
              {!hasLessonPlan && (
                <Form.Item name="no_lesson_plan_reason" label="មូលហេតុមិនមានផែនការបង្រៀន">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}
            </Col>
            <Col span={12}>
              {hasLessonPlan && (
                <>
                  <Form.Item name="followed_lesson_plan" label="បានធ្វើតាមផែនការបង្រៀន" valuePropName="checked">
                    <Switch 
                      onChange={setFollowedLessonPlan}
                      checkedChildren="បាទ/ចាស" 
                      unCheckedChildren="ទេ" 
                    />
                  </Form.Item>
                  {!followedLessonPlan && (
                    <Form.Item name="not_followed_reason" label="មូលហេតុមិនធ្វើតាមផែនការ">
                      <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                    </Form.Item>
                  )}
                </>
              )}
            </Col>
          </Row>

          {hasLessonPlan && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="plan_appropriate_for_levels" label="ផែនការសមរម្យសម្រាប់កម្រិតសិស្ស" valuePropName="checked">
                  <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="lesson_plan_feedback" label="មតិយោបល់អំពីផែនការបង្រៀន">
                  <TextArea rows={3} placeholder="បញ្ចូលមតិយោបល់" />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        {/* Activity Tracking */}
        <Card title="ការតាមដានសកម្មភាព" className="mb-4">
          <Form.Item name="num_activities_observed" label="ចំនួនសកម្មភាពដែលបានអង្កេត">
            <InputNumber 
              min={0} 
              max={10} 
              onChange={setNumActivities}
              style={{ width: '100%' }} 
            />
          </Form.Item>

          {numActivities >= 1 && (
            <>
              <Divider orientation="left">សកម្មភាពទី ១</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="activity1_type" label="ប្រភេទសកម្មភាព">
                    <Select
                      placeholder="ជ្រើសរើសប្រភេទសកម្មភាព"
                      options={activityTypeOptions.map(type => ({ label: type, value: type }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="activity1_duration" label="រយៈពេល (នាទី)">
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="activity1_clear_instructions" label="មានការណែនាំច្បាស់លាស់" valuePropName="checked">
                    <Switch 
                      onChange={setActivity1ClearInstructions}
                      checkedChildren="បាទ/ចាស" 
                      unCheckedChildren="ទេ" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              {!activity1ClearInstructions && (
                <Form.Item name="activity1_unclear_reason" label="មូលហេតុការណែនាំមិនច្បាស់">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="activity1_followed_process" label="បានធ្វើតាមដំណើរការ" valuePropName="checked">
                    <Switch 
                      onChange={setActivity1FollowedProcess}
                      checkedChildren="បាទ/ចាស" 
                      unCheckedChildren="ទេ" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              {!activity1FollowedProcess && (
                <Form.Item name="activity1_not_followed_reason" label="មូលហេតុមិនធ្វើតាមដំណើរការ">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}
            </>
          )}

          {numActivities >= 2 && (
            <>
              <Divider orientation="left">សកម្មភាពទី ២</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="activity2_type" label="ប្រភេទសកម្មភាព">
                    <Select
                      placeholder="ជ្រើសរើសប្រភេទសកម្មភាព"
                      options={activityTypeOptions.map(type => ({ label: type, value: type }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="activity2_duration" label="រយៈពេល (នាទី)">
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="activity2_clear_instructions" label="មានការណែនាំច្បាស់លាស់" valuePropName="checked">
                    <Switch 
                      onChange={setActivity2ClearInstructions}
                      checkedChildren="បាទ/ចាស" 
                      unCheckedChildren="ទេ" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              {!activity2ClearInstructions && (
                <Form.Item name="activity2_unclear_reason" label="មូលហេតុការណែនាំមិនច្បាស់">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="activity2_followed_process" label="បានធ្វើតាមដំណើរការ" valuePropName="checked">
                    <Switch 
                      onChange={setActivity2FollowedProcess}
                      checkedChildren="បាទ/ចាស" 
                      unCheckedChildren="ទេ" 
                    />
                  </Form.Item>
                </Col>
              </Row>

              {!activity2FollowedProcess && (
                <Form.Item name="activity2_not_followed_reason" label="មូលហេតុមិនធ្វើតាមដំណើរការ">
                  <TextArea rows={2} placeholder="បញ្ចូលមូលហេតុ" />
                </Form.Item>
              )}
            </>
          )}
        </Card>

        {/* Observations and Feedback */}
        <Card title="សេចក្តីសម្គាល់ និងមតិយោបល់" className="mb-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="observation" label="សេចក្តីសម្គាល់">
                <TextArea rows={4} placeholder="បញ្ចូលសេចក្តីសម្គាល់" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="teacher_feedback" label="មតិយោបល់ចំពោះអ្នកបង្រៀន">
                <TextArea rows={4} placeholder="បញ្ចូលមតិយោបល់" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="score" label="ពិន្ទុ (0-100)">
                <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="follow_up_required" label="ត្រូវការការតាមដាន" valuePropName="checked">
                <Switch checkedChildren="បាទ/ចាស" unCheckedChildren="ទេ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="action_plan" label="ផែនការសកម្មភាព">
                <TextArea rows={3} placeholder="បញ្ចូលផែនការសកម្មភាព" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button onClick={() => router.back()}>
            បោះបង់
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            រក្សាទុក
          </Button>
        </div>
      </Form>
    </div>
  );
}