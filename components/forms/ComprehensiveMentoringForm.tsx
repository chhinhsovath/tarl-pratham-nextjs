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
  Button,
  Card,
  Typography,
  Row,
  Col,
  Radio,
  Checkbox,
  Progress,
  message,
  Divider
} from 'antd';
import dayjs from 'dayjs';
import { trackActivity } from '@/lib/trackActivity';

const { Title } = Typography;
const { TextArea } = Input;

interface ComprehensiveMentoringFormProps {
  mode?: 'create' | 'edit';
  visit?: any;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: any;
  loading?: boolean;
}

const ComprehensiveMentoringForm: React.FC<ComprehensiveMentoringFormProps> = ({ 
  mode = 'create',
  visit, 
  onSubmit,
  initialValues,
  loading = false
}) => {
  const [form] = Form.useForm();
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  
  // State for dynamic behavior
  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [classInSession, setClassInSession] = useState(true);
  const [fullSessionObserved, setFullSessionObserved] = useState(true); // FIXED: Added missing state
  const [subjectObserved, setSubjectObserved] = useState('');
  const [classStartedOnTime, setClassStartedOnTime] = useState(null);
  const [hasSessionPlan, setHasSessionPlan] = useState(null);
  const [followedSessionPlan, setFollowedSessionPlan] = useState(null);
  const [numberOfActivities, setNumberOfActivities] = useState(0);
  const [numActivities, setNumActivities] = useState(0); // FIXED: Added missing state (used in populateFormData)
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Activity conditional states
  const [activity1ClearInstructions, setActivity1ClearInstructions] = useState(null);
  const [activity1FollowedProcess, setActivity1FollowedProcess] = useState(null);
  const [activity2ClearInstructions, setActivity2ClearInstructions] = useState(null);
  const [activity2FollowedProcess, setActivity2FollowedProcess] = useState(null);
  const [activity3ClearInstructions, setActivity3ClearInstructions] = useState(null);
  const [activity3FollowedProcess, setActivity3FollowedProcess] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchSchools();

    // Auto-fill mentor name for create mode
    if (mode === 'create' && user) {
      form.setFieldsValue({
        mentor_name: user.name
      });
    }

    if (mode === 'edit' && initialValues) {
      populateFormData();
    } else if (visit && mode !== 'create') {
      populateFormData();
    }
  }, [visit, mode, initialValues, user]);

  const fetchSchools = async () => {
    try {
      // For mentors, fetch their assigned schools
      if (user?.role === 'mentor') {
        const response = await fetch('/api/mentor/schools');
        if (response.ok) {
          const data = await response.json();
          // Transform mentor assignments to school format
          const mentorSchools = data.schools?.map((assignment: any) => ({
            id: assignment.pilot_school_id,
            school_name: assignment.school_name,
            province: assignment.province,
            district: assignment.district,
            subject: assignment.subject // Keep subject info for reference
          })) || [];

          // Remove duplicate schools (mentor might have same school for Language and Math)
          const uniqueSchools = mentorSchools.reduce((acc: any[], current: any) => {
            const exists = acc.find(item => item.id === current.id);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, []);

          setSchools(uniqueSchools);
        }
      } else {
        // For admin/coordinator, fetch all pilot schools
        const response = await fetch('/api/pilot-schools');
        if (response.ok) {
          const data = await response.json();
          setSchools(data.data || []);
        }
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
        setTeachers(data.data || data.users || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const populateFormData = () => {
    const dataSource = initialValues || visit;
    if (!dataSource) return;

    const formData = {
      ...dataSource,
      visit_date: dataSource.visit_date ? dayjs(dataSource.visit_date) : null,
    };
    form.setFieldsValue(formData);

    // Set initial state values for conditional fields
    if (dataSource.pilot_school_id) {
      setSelectedSchool(dataSource.pilot_school_id);
      // Fetch teachers for the selected school in edit mode
      fetchTeachers(dataSource.pilot_school_id);
    }
    if (dataSource.class_in_session !== undefined) {
      setClassInSession(dataSource.class_in_session === 1 || dataSource.class_in_session === true);
    }
    if (dataSource.full_session_observed !== undefined) {
      setFullSessionObserved(dataSource.full_session_observed === 1 || dataSource.full_session_observed === true);
    }
    if (dataSource.subject_observed) {
      setSubjectObserved(dataSource.subject_observed);
    }
    if (dataSource.number_of_activities) {
      setNumActivities(dataSource.number_of_activities);
      setNumberOfActivities(dataSource.number_of_activities); // Also set the visibility state
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

  const updateProgress = () => {
    const values = form.getFieldsValue();
    const requiredFields = [
      'visit_date', 'pilot_school_id', 'teacher_id', 'class_in_session',
      'full_session_observed', 'subject_observed'
    ];
    
    let filledCount = 0;
    requiredFields.forEach(field => {
      if (values[field] !== undefined && values[field] !== '' && values[field] !== null) {
        filledCount++;
      }
    });
    
    const percentage = Math.round((filledCount / requiredFields.length) * 100);
    setProgressPercentage(percentage);
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        visit_date: values.visit_date ? values.visit_date.format('YYYY-MM-DD') : undefined,
        mentor_id: user?.id,
        mentor_name: user?.name,
        pilot_school_id: parseInt(values.pilot_school_id),
        teacher_id: values.teacher_id ? parseInt(values.teacher_id) : undefined,
      };

      // Track activity: User created mentoring visit (only in create mode)
      if (mode === 'create') {
        trackActivity('mentoring_add');
      }

      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      message.error('មានបញ្ហាក្នុងការបញ្ជូនទម្រង់');
    }
  };

  // Teaching materials exactly from Laravel
  const teachingMaterials = [
    'Chartលេខ ០-៩៩',
    'Chartតម្លៃលេខតាមខ្ទង់',
    'បណ្ណតម្លៃលេខតាមខ្ទង់',
    'Chartបូកលេខដោយផ្ទាល់មាត់',
    'Chartដកលេខដោយផ្ទាល់មាត់',
    'Chartគុណលេខដោយផ្ទាល់មាត់',
    'ប្រាក់លេង',
    'សៀវភៅគ្រូមុខវិទ្យាគណិតវិទ្យា',
    'ទុយោ',
    'កូនសៀវភៅចំណោទ (បូក ដក គុណ ចែក)',
    'Chartព្យាង្គ',
    'បណ្ណរូបភាព',
    'ការតម្រៀបល្បះ និងកូនសៀវភៅកែតម្រូវកំហុស',
    'បណ្ណពាក្យ/បណ្ណព្យាង្គ',
    'បណ្ណរឿង/អត្ថបទ',
    'សៀវភៅគ្រូមុខវិជ្ជាភាសាខ្មែរ'
  ];

  // Language levels exactly from Laravel
  const languageLevels = [
    'កម្រិតដំបូង',
    'តួអក្សរ',
    'ពាក្យ',
    'កថាខណ្ឌ',
    'អត្ថបទខ្លី',
    'ការយល់ដឹងទី១',
    'ការយល់ដឹងទី២'
  ];

  // Numeracy levels exactly from Laravel
  const numeracyLevels = [
    'កម្រិតដំបូង',
    'លេខ១ខ្ទង់',
    'លេខ២ខ្ទង់',
    'ប្រមាណវិធីដក',
    'ប្រមាណវិធីចែក',
    'ចំណោទ'
  ];

  // Khmer activities exactly from Laravel (18 activities)
  const khmerActivities = [
    'ការសន្ទនាសេរី',
    'ការពណ៌នារូបភាព',
    'ការអានកថាខណ្ឌ',
    'ផែនទីគំនិត',
    'ការចម្លងនិងសរសេរតាមអាន',
    'ល្បែងបោះចូលកន្ត្រក (បោះព្យញ្ជនៈ, ស្រៈ , ពាក្យ ចូលកន្ត្រក)',
    'ល្បែងត្រឡប់បណ្ណពាក្យ',
    'ល្បែងលោតលើតួអក្សរ',
    'ការអានChartព្យាង្គ',
    'ការកំណត់ចំនួនព្យាង្គក្នុងពាក្យ',
    'ការបង្កើតពាក្យនិងប្រយោគ',
    'ពាក្យចួន',
    'ល្បែងគ្រ័រ',
    'ការបង្កើតពាក្យតាមសូរចុង',
    'ការកែតម្រូវកំហុស',
    'ការបង្កើតសាច់រឿងបន្ត',
    'សកម្មភាពផ្អែកលើមេរៀន (៨ ជំហាន)'
  ];

  // Math activities exactly from Laravel (25 activities)
  const mathActivities = [
    'ចំនួនដោយប្រើបាច់ឈើនិងឈើ',
    'ការអានChartលេខ',
    'ល្បែងកង់លេខ',
    'ល្បែងលោតលើលេខ',
    'ការទះដៃនិងផ្ទាត់ម្រាមដៃ',
    'Chartតម្លៃលេខតាមខ្ទង់',
    'បណ្ណតម្លៃលេខតាមខ្ទង់',
    'សៀវភៅកំណត់ត្រាលេខ',
    'ចំនួនជាមួយប្រាក់លេង',
    'ការដោះស្រាយចំណោទ',
    'រកផលគុណជាមួយលេខប្រាំបួន',
    'ប្រមាណវិធីបូកដោយប្រើបាច់ឈើនិងឈើ',
    'ប្រមាណវិធីដកដោយប្រើបាច់ឈើនិងឈើ',
    'ប្រមាណវិធីបូកដកដោយផ្ទាល់មាត់',
    'ប្រមាណវិធីបូកដោយប្រើប្រាក់លេង',
    'ប្រមាណវិធីដកដោយប្រើប្រាក់លេង',
    'ប្រមាណវិធីគុណដោយប្រើឈើ',
    'ប្រមាណវិធីគុណដោយបំបែកលេខ',
    'ការសូត្រChartមេគុណ',
    'ប្រមាណវិធីគុណក្នុងប្រអប់',
    'ប្រមាណវិធីគុណដោយប្រើChartតម្លៃលេខតាមខ្ទង់',
    'ប្រមាណវិធីចែកដោយប្រើឈើ',
    'ប្រមាណវិធីចែកដោយប្រើប្រាក់លេង',
    'ប្រមាណវិធីចែកដោយប្រើChartមេគុណ'
  ];

  return (
    <div>
      {/* Progress Bar */}
      <Card className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">វឌ្ឍនភាព</span>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        <Progress percent={progressPercentage} showInfo={false} />
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={updateProgress}
        disabled={loading || mode === 'view'}
      >
        {/* Section 1: Visit Details */}
        <Card title="ព័ត៌មានលម្អិតនៃការចុះអង្កេត" className="mb-6">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="visit_date"
                label="កាលបរិច្ឆេទនៃការចុះ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទ' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mentor_name"
                label="ឈ្មោះទីប្រឹក្សាគរុកោសល្យ"
              >
                <Input disabled style={{ backgroundColor: '#f5f5f5' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="pilot_school_id"
                label="ឈ្មោះសាលារៀន"
                rules={[{ required: true, message: 'សូមជ្រើសរើសសាលារៀន' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសសាលារៀន"
                  onChange={onSchoolChange}
                  showSearch
                  optionFilterProp="children"
                >
                  {schools.map((school: any) => (
                    <Select.Option key={school.id} value={school.id}>
                      {school.school_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="teacher_id"
                label="ឈ្មោះគ្រូបង្រៀន"
                rules={[{ required: true, message: 'សូមជ្រើសរើសគ្រូបង្រៀន' }]}
              >
                <Select
                  placeholder="ជ្រើសរើសគ្រូបង្រៀន"
                  disabled={!selectedSchool}
                  showSearch
                  optionFilterProp="children"
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
        </Card>

        {/* Section 2: Class Status */}
        <Card title="ស្ថានភាពថ្នាក់រៀន" className="mb-6">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="class_in_session"
                label="តើថ្នាក់រៀន TaRL មានដំណើរការនៅថ្ងៃចុះអង្កេតដែរឬទេ?"
                rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
              >
                <Radio.Group onChange={(e) => setClassInSession(e.target.value === 1)}>
                  <Radio value={1}>បាទ/ចាស</Radio>
                  <Radio value={0}>ទេ</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Conditional: Class not in session reason */}
          {classInSession === false && (
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="class_not_in_session_reason"
                  label="ហេតុអ្វីបានជាថ្នាក់រៀន TaRL មិនដំណើរការ?"
                >
                  <TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Show remaining fields only if class is in session */}
          {classInSession !== false && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="full_session_observed"
                    label="តើអ្នកបានអង្កេតការបង្រៀនពេញមួយវគ្គដែរឬទេ?"
                  >
                    <Radio.Group>
                      <Radio value={1}>បាទ/ចាស</Radio>
                      <Radio value={0}>ទេ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="grades_observed"
                    label="កម្រិតថ្នាក់ដែលបានអង្កេត"
                  >
                    <Checkbox.Group>
                      <Checkbox value="ទី៤">ទី៤</Checkbox>
                      <Checkbox value="ទី៥">ទី៥</Checkbox>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="subject_observed"
                    label="មុខវិជ្ជាដែលបានអង្កេត"
                    rules={[{ required: true, message: 'សូមជ្រើសរើសមុខវិជ្ជា' }]}
                  >
                    <Select 
                      placeholder="ជ្រើសរើសមុខវិជ្ជា"
                      onChange={setSubjectObserved}
                    >
                      <Select.Option value="Khmer">ខ្មែរ</Select.Option>
                      <Select.Option value="Math">គណិតវិទ្យា</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Conditional: Language levels for Khmer */}
              {subjectObserved === 'Khmer' && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="language_levels_observed"
                      label="កម្រិតសមត្ថភាព TaRL (Khmer) ដែលបានអង្កេត"
                    >
                      <Checkbox.Group>
                        {languageLevels.map(level => (
                          <Checkbox key={level} value={level}>{level}</Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Conditional: Numeracy levels for Math */}
              {subjectObserved === 'Math' && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="numeracy_levels_observed"
                      label="កម្រិតសមត្ថភាព (Math) ដែលបានអង្កេត"
                    >
                      <Checkbox.Group>
                        {numeracyLevels.map(level => (
                          <Checkbox key={level} value={level}>{level}</Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Student Statistics */}
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item
                    name="total_students_enrolled"
                    label="ចំនួនសិស្សសរុបក្នុងថ្នាក់ TaRL"
                  >
                    <InputNumber min={0} max={20} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="students_present"
                    label="ចំនួនសិស្សមានវត្តមាននៅថ្ងៃចុះអង្កេត"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="students_improved_from_last_week"
                    label="ចំនួនសិស្សដែលមានការកើនឡើងសមត្ថភាពធៀបនឹងសប្តាហ៍មុន"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item
                    name="classes_conducted_before_visit"
                    label="តើមានថ្នាក់រៀនប៉ុន្មានបានដំណើរការមុនថ្ងៃចុះអង្កេតនេះ?"
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Card>

        {/* Show remaining sections only if class is in session */}
        {classInSession !== false && (
          <>
            {/* Section 3: Delivery Questions */}
            <Card title="សំណួរអំពីការបង្រៀន" className="mb-6">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="class_started_on_time"
                    label="តើថ្នាក់រៀនបានចាប់ផ្តើមទាន់ពេលដែរឬទេ (ក្នុងរយៈពេល ៥ នាទី)?"
                  >
                    <Radio.Group onChange={(e) => setClassStartedOnTime(e.target.value)}>
                      <Radio value={1}>បាទ/ចាស</Radio>
                      <Radio value={0}>ទេ</Radio>
                      <Radio value={-1}>មិនដឹង</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              {/* Conditional: Late start reason */}
              {classStartedOnTime === 0 && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="late_start_reason"
                      label="ហេតុអ្វីបានជាថ្នាក់រៀនមិនចាប់ផ្តើមទាន់ពេល?"
                      rules={[{ required: true, message: 'សូមបញ្ចូលមូលហេតុ' }]}
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Card>

            {/* Section 4: Classroom Questions */}
            <Card title="សំណួរទាក់ទងនឹងថ្នាក់រៀន" className="mb-6">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="materials_present"
                    label="តើសម្ភារឧបទេសអ្វីខ្លះដែលអ្នកបានឃើញមាននៅក្នុងថ្នាក់រៀន?"
                  >
                    <Checkbox.Group>
                      <Row>
                        {teachingMaterials.map((material, index) => (
                          <Col span={12} key={index}>
                            <Checkbox value={material}>{material}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="children_grouped_appropriately"
                    label="តើសិស្សត្រូវបានបែងចែកជាក្រុមសមស្របតាមកម្រិតសមត្ថភាពដែរឬទេ?"
                  >
                    <Radio.Group>
                      <Radio value={1}>បាទ/ចាស</Radio>
                      <Radio value={0}>ទេ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="students_fully_involved"
                    label="តើសិស្សបានចូលរួមយ៉ាងសកម្មក្នុងសកម្មភាពដែរឬទេ?"
                  >
                    <Radio.Group>
                      <Radio value={1}>បាទ/ចាស</Radio>
                      <Radio value={0}>ទេ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Section 5: Teacher Questions */}
            <Card title="សំណួរទាក់ទងនឹងគ្រូបង្រៀន" className="mb-6">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="has_session_plan"
                    label="តើគ្រូមានកិច្ចតែងការបង្រៀន (ផែនការមេរៀន) ដែរឬទេ?"
                  >
                    <Radio.Group onChange={(e) => setHasSessionPlan(e.target.value)}>
                      <Radio value={1}>បាទ/ចាស</Radio>
                      <Radio value={0}>ទេ</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              {/* Conditional: No session plan reason */}
              {hasSessionPlan === 0 && (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="no_session_plan_reason"
                      label="ហេតុអ្វីបានជាគ្រូមិនមានកិច្ចតែងការបង្រៀន?"
                    >
                      <TextArea rows={3} />
                    </Form.Item>
                  </Col>
                </Row>
              )}

              {/* Session plan details - show only if has session plan */}
              {hasSessionPlan === 1 && (
                <>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="followed_session_plan"
                        label="តើគ្រូបានបង្រៀនតាមកិច្ចតែងការបង្រៀនដែរឬទេ?"
                      >
                        <Radio.Group onChange={(e) => setFollowedSessionPlan(e.target.value)}>
                          <Radio value={1}>បាទ/ចាស</Radio>
                          <Radio value={0}>ទេ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="session_plan_appropriate"
                        label="តើកិច្ចតែងការបង្រៀនសមស្របនឹងកម្រិតសមត្ថភាពរបស់សិស្សដែរឬទេ?"
                      >
                        <Radio.Group>
                          <Radio value={1}>បាទ/ចាស</Radio>
                          <Radio value={0}>ទេ</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Conditional: No follow plan reason */}
                  {followedSessionPlan === 0 && (
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="no_follow_plan_reason"
                          label="ហេតុអ្វីបានជាគ្រូមិនបានបង្រៀនតាមកិច្ចតែងការបង្រៀន?"
                        >
                          <TextArea rows={3} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        name="session_plan_notes"
                        label="កំណត់ចំណាំ/មតិកែលម្អដែលបានផ្តល់លើកិច្ចតែងការបង្រៀន"
                      >
                        <TextArea rows={3} />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Card>

            {/* Section 6: Activities */}
            <Card title="សំណួរទាក់ទងនឹងសកម្មភាព" className="mb-6">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="number_of_activities"
                    label="តើមានសកម្មភាពប៉ុន្មានត្រូវបានអង្កេត?"
                  >
                    <Select 
                      style={{ width: 200 }}
                      onChange={setNumberOfActivities}
                    >
                      <Select.Option value={0}>0</Select.Option>
                      <Select.Option value={1}>1</Select.Option>
                      <Select.Option value={2}>2</Select.Option>
                      <Select.Option value={3}>3</Select.Option>
                      <Select.Option value={4}>4</Select.Option>
                      <Select.Option value={5}>5</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Activity 1 */}
              {numberOfActivities >= 1 && (
                <>
                  <Divider orientation="left">សកម្មភាពទី១</Divider>
                  <div style={{ borderLeft: '4px solid #1890ff', paddingLeft: '16px', marginBottom: '24px' }}>
                    <Row gutter={16}>
                      {/* Activity name based on subject */}
                      {subjectObserved === 'Khmer' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity1_name_language"
                            label="តើសកម្មភាពទីមួយណាដែលត្រូវបានអនុវត្ត? (Khmer)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {khmerActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      {subjectObserved === 'Math' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity1_name_numeracy"
                            label="តើសកម្មភាពទីមួយណាដែលត្រូវបានអនុវត្ត? (Math)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {mathActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col span={12}>
                        <Form.Item
                          name="activity1_duration"
                          label="តើសកម្មភាពទីមួយប្រើរយៈពេលប៉ុន្មាន? (នាទី)"
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity1_clear_instructions"
                          label="តើគ្រូបានណែនាំពីសកម្មភាពទីមួយបានច្បាស់លាស់ដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity1ClearInstructions(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: No clear instructions reason */}
                    {activity1ClearInstructions === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity1_no_clear_instructions_reason"
                            label="ហេតុអ្វីបានជាគ្រូមិនបានណែនាំពីសកម្មភាពទីមួយបានច្បាស់លាស់?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity1_followed_process"
                          label="តើគ្រូបានអនុវត្តតាមដំណើរការនៃសកម្មភាពដូចមានក្នុងកិច្ចតែងការបង្រៀនដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity1FollowedProcess(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: Not followed reason */}
                    {activity1FollowedProcess === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity1_not_followed_reason"
                            label="បើមិនបានអនុវត្តតាម, ហេតុអ្វី?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </div>
                </>
              )}

              {/* Activity 2 */}
              {numberOfActivities >= 2 && (
                <>
                  <Divider orientation="left">សកម្មភាពទី២</Divider>
                  <div style={{ borderLeft: '4px solid #52c41a', paddingLeft: '16px', marginBottom: '24px' }}>
                    <Row gutter={16}>
                      {/* Activity name based on subject */}
                      {subjectObserved === 'Khmer' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity2_name_language"
                            label="តើសកម្មភាពទីពីរណាដែលត្រូវបានអនុវត្ត? (Khmer)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {khmerActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      {subjectObserved === 'Math' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity2_name_numeracy"
                            label="តើសកម្មភាពទីពីរណាដែលត្រូវបានអនុវត្ត? (Math)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {mathActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col span={12}>
                        <Form.Item
                          name="activity2_duration"
                          label="តើសកម្មភាពទីពីរប្រើរយៈពេលប៉ុន្មាន? (នាទី)"
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity2_clear_instructions"
                          label="តើគ្រូបានណែនាំពីសកម្មភាពទីពីរបានច្បាស់លាស់ដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity2ClearInstructions(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: No clear instructions reason */}
                    {activity2ClearInstructions === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity2_no_clear_instructions_reason"
                            label="ហេតុអ្វីបានជាគ្រូមិនបានណែនាំពីសកម្មភាពទីពីរបានច្បាស់លាស់?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity2_followed_process"
                          label="តើគ្រូបានអនុវត្តតាមដំណើរការនៃសកម្មភាពដូចមានក្នុងកិច្ចតែងការបង្រៀនដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity2FollowedProcess(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: Not followed reason */}
                    {activity2FollowedProcess === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity2_not_followed_reason"
                            label="បើមិនបានអនុវត្តតាម, ហេតុអ្វី?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </div>
                </>
              )}

              {/* Activity 3 */}
              {numberOfActivities >= 3 && (
                <>
                  <Divider orientation="left">សកម្មភាពទី៣</Divider>
                  <div style={{ borderLeft: '4px solid #722ed1', paddingLeft: '16px', marginBottom: '24px' }}>
                    <Row gutter={16}>
                      {/* Activity name based on subject */}
                      {subjectObserved === 'Khmer' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity3_name_language"
                            label="តើសកម្មភាពទីបីណាដែលត្រូវបានអនុវត្ត? (Khmer)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {khmerActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      {subjectObserved === 'Math' && (
                        <Col span={12}>
                          <Form.Item
                            name="activity3_name_numeracy"
                            label="តើសកម្មភាពទីបីណាដែលត្រូវបានអនុវត្ត? (Math)"
                          >
                            <Select placeholder="ជ្រើសរើសសកម្មភាព">
                              {mathActivities.map(activity => (
                                <Select.Option key={activity} value={activity}>
                                  {activity}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col span={12}>
                        <Form.Item
                          name="activity3_duration"
                          label="តើសកម្មភាពទីបីប្រើរយៈពេលប៉ុន្មាន? (នាទី)"
                        >
                          <InputNumber min={0} style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity3_clear_instructions"
                          label="តើគ្រូបានណែនាំពីសកម្មភាពទីបីបានច្បាស់លាស់ដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity3ClearInstructions(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: No clear instructions reason */}
                    {activity3ClearInstructions === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity3_no_clear_instructions_reason"
                            label="ហេតុអ្វីបានជាគ្រូមិនបានណែនាំពីសកម្មភាពទីបីបានច្បាស់លាស់?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="activity3_followed_process"
                          label="តើគ្រូបានអនុវត្តតាមដំណើរការនៃសកម្មភាពដូចមានក្នុងកិច្ចតែងការបង្រៀនដែរឬទេ?"
                        >
                          <Radio.Group onChange={(e) => setActivity3FollowedProcess(e.target.value)}>
                            <Radio value={1}>បាទ/ចាស</Radio>
                            <Radio value={0}>ទេ</Radio>
                          </Radio.Group>
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Conditional: Not followed reason */}
                    {activity3FollowedProcess === 0 && (
                      <Row gutter={16}>
                        <Col span={24}>
                          <Form.Item
                            name="activity3_not_followed_reason"
                            label="បើមិនបានអនុវត្តតាម, ហេតុអ្វី?"
                          >
                            <TextArea rows={2} />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </div>
                </>
              )}
            </Card>

            {/* Section 7: Miscellaneous */}
            <Card title="ផ្សេងៗ" className="mb-6">
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="teacher_feedback"
                    label="មតិយោបល់សម្រាប់គ្រូបង្រៀន (ប្រសិនបើមាន) (១០០-១២០ ពាក្យ)"
                  >
                    <TextArea rows={4} placeholder="សូមបញ្ចូលមតិយោបល់សម្រាប់គ្រូបង្រៀន (១០០-១២០ ពាក្យ)" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </>
        )}

        {/* Form Actions */}
        <Card>
          <div className="flex justify-between">
            <Button onClick={() => router.back()}>
              បោះបង់
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              បញ្ជូន
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default ComprehensiveMentoringForm;