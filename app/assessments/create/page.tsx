'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card, 
  Table, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Alert, 
  Tag, 
  Progress,
  message,
  Spin
} from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  name: string;
  class: number;
  age: number;
  gender: string;
  pilot_school_id: number;
  pilotSchool: {
    school_name: string;
  };
  has_assessment: boolean;
  assessment_level: string | null;
  previous_assessment: {
    level: string;
    cycle: string;
    assessed_date: string;
  } | null;
  is_assessment_locked: boolean;
}

interface AssessmentLevel {
  value: string;
  label: string;
  color: string;
}

function AssessmentCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessmentPeriod, setAssessmentPeriod] = useState('baseline');
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [schools, setSchools] = useState([]);
  const [savingMap, setSavingMap] = useState<{ [key: number]: boolean }>({});
  const [savedMap, setSavedMap] = useState<{ [key: number]: boolean }>({});

  // Get assessment period from URL params
  useEffect(() => {
    const period = searchParams.get('period');
    if (period && ['baseline', 'midline', 'endline'].includes(period)) {
      setAssessmentPeriod(period);
    }
  }, [searchParams]);

  // Fetch available schools
  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      const data = await response.json();
      
      if (response.ok) {
        setSchools(data.data || []);
        if (session?.user?.pilot_school_id) {
          setSelectedSchool(session.user.pilot_school_id);
        }
      } else {
        console.error('Error fetching schools:', data.error);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [session]);

  // Fetch eligible students
  const fetchStudents = async () => {
    if (!assessmentPeriod || !selectedSchool) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        period: assessmentPeriod,
        school_id: selectedSchool.toString()
      });

      const response = await fetch(`/api/assessments/students?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setStudents(data.students || []);
      } else {
        console.error('Error fetching students:', data.error);
        message.error(data.error || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [assessmentPeriod, selectedSchool]);

  // Save student assessment
  const saveAssessment = async (studentId: number, khmerLevel: string, mathLevel: string) => {
    setSavingMap(prev => ({ ...prev, [studentId]: true }));
    
    try {
      const response = await fetch('/api/assessments/save-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: studentId,
          assessment_period: assessmentPeriod,
          khmer_level: khmerLevel,
          math_level: mathLevel,
          assessment_date: new Date().toISOString()
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`បានរក្សាទុកការវាយតម្លៃសម្រាប់សិស្ស`);
        setSavedMap(prev => ({ ...prev, [studentId]: true }));
        
        // Refresh the student list to get updated data
        setTimeout(() => {
          setSavedMap(prev => ({ ...prev, [studentId]: false }));
          fetchStudents();
        }, 2000);
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការរក្សាទុកការវាយតម្លៃ');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      message.error('មានបញ្ហាក្នុងការរក្សាទុកការវាយតម្លៃ');
    } finally {
      setSavingMap(prev => ({ ...prev, [studentId]: false }));
    }
  };

  // Assessment level definitions
  const khmerLevels: AssessmentLevel[] = [
    { value: 'មិនចេះអាន', label: 'មិនចេះអាន', color: 'red' },
    { value: 'ស្គាល់អក្សរ', label: 'ស្គាល់អក្សរ', color: 'orange' },
    { value: 'អានពាក្យ', label: 'អានពាក្យ', color: 'gold' },
    { value: 'អានប្រយោគ', label: 'អានប្រយោគ', color: 'yellow' },
    { value: 'អានកថាខណ្ឌ', label: 'អានកថាខណ្ឌ', color: 'lime' },
    { value: 'អានរឿងខ្លី', label: 'អានរឿងខ្លី', color: 'green' },
    { value: 'អានស្ទាបស្ទង់', label: 'អានស្ទាបស្ទង់', color: 'cyan' }
  ];

  const mathLevels: AssessmentLevel[] = [
    { value: 'មិនចេះរាប់', label: 'មិនចេះរាប់', color: 'red' },
    { value: 'រាប់ ១-៩', label: 'រាប់ ១-៩', color: 'orange' },
    { value: 'រាប់ ១-៩៩', label: 'រាប់ ១-៩៩', color: 'gold' },
    { value: 'បូកដក', label: 'បូកដក', color: 'yellow' },
    { value: 'គុណ', label: 'គុណ', color: 'lime' },
    { value: 'ចែក', label: 'ចែក', color: 'green' }
  ];

  // Table columns
  const columns = [
    {
      title: 'លេខរៀង',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_: any, __: any, index: number) => index + 1
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Student) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-xs text-gray-500">
            ថ្នាក់ទី{record.class} | អាយុ {record.age} | {record.gender === 'M' ? 'ប្រុស' : 'ស្រី'}
          </div>
        </div>
      )
    },
    {
      title: 'សាលា',
      dataIndex: 'pilotSchool',
      key: 'school',
      width: 150,
      render: (school: any) => (
        <div className="text-sm">{school?.school_name}</div>
      )
    },
    {
      title: 'ការវាយតម្លៃពីមុន',
      key: 'previous',
      width: 180,
      render: (record: Student) => {
        if (record.previous_assessment) {
          return (
            <div className="text-xs">
              <div>រយៈពេល: {record.previous_assessment.cycle}</div>
              <div>កម្រិត: {record.previous_assessment.level}</div>
              <div>កាលបរិច្ឆេទ: {new Date(record.previous_assessment.assessed_date).toLocaleDateString('km')}</div>
            </div>
          );
        }
        return <span className="text-gray-400">មិនមាន</span>;
      }
    },
    {
      title: 'កម្រិតភាសាខ្មែរ',
      key: 'khmer_level',
      width: 200,
      render: (record: Student) => {
        if (record.is_assessment_locked) {
          return (
            <div className="flex items-center space-x-2">
              <Tag color="gray">{record.assessment_level || 'មិនមាន'}</Tag>
              <ExclamationCircleOutlined className="text-red-500" />
            </div>
          );
        }

        if (record.has_assessment) {
          return (
            <div className="flex items-center space-x-2">
              <Tag color="green">{record.assessment_level || 'បានវាយតម្លៃ'}</Tag>
              <CheckCircleOutlined className="text-green-500" />
            </div>
          );
        }

        return (
          <Select
            placeholder="ជ្រើសរើសកម្រិត"
            onChange={(value) => {
              const mathLevel = document.querySelector(`#math-${record.id}`) as any;
              if (mathLevel?.value) {
                saveAssessment(record.id, value, mathLevel.value);
              }
            }}
            className="w-full"
            id={`khmer-${record.id}`}
            disabled={savingMap[record.id]}
          >
            {khmerLevels.map(level => (
              <Option key={level.value} value={level.value}>
                <Tag color={level.color}>{level.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: 'កម្រិតគណិតវិទ្យា',
      key: 'math_level',
      width: 200,
      render: (record: Student) => {
        if (record.is_assessment_locked || record.has_assessment) {
          return null;
        }

        return (
          <Select
            placeholder="ជ្រើសរើសកម្រិត"
            onChange={(value) => {
              const khmerLevel = document.querySelector(`#khmer-${record.id}`) as any;
              if (khmerLevel?.value) {
                saveAssessment(record.id, khmerLevel.value, value);
              }
            }}
            className="w-full"
            id={`math-${record.id}`}
            disabled={savingMap[record.id]}
          >
            {mathLevels.map(level => (
              <Option key={level.value} value={level.value}>
                <Tag color={level.color}>{level.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      }
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (record: Student) => {
        if (savingMap[record.id]) {
          return <Spin size="small" />;
        }

        if (savedMap[record.id]) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              បានរក្សាទុក
            </Tag>
          );
        }

        if (record.is_assessment_locked) {
          return (
            <Tag icon={<ExclamationCircleOutlined />} color="error">
              ជាប់សោ
            </Tag>
          );
        }

        if (record.has_assessment) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success">
              បានវាយតម្លៃ
            </Tag>
          );
        }

        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            រង់ចាំ
          </Tag>
        );
      }
    }
  ];

  // Get period display text
  const getPeriodText = (period: string) => {
    switch (period) {
      case 'baseline': return 'មូលដ្ឋាន';
      case 'midline': return 'កុលសនភាព';
      case 'endline': return 'បញ្ចប់';
      default: return period;
    }
  };

  // Calculate statistics
  const totalStudents = students.length;
  const assessedStudents = students.filter(s => s.has_assessment).length;
  const lockedStudents = students.filter(s => s.is_assessment_locked).length;
  const eligibleStudents = students.filter(s => !s.has_assessment && !s.is_assessment_locked).length;
  const completionRate = totalStudents > 0 ? (assessedStudents / totalStudents) * 100 : 0;

  return (
    <HorizontalLayout>
      <div className="p-6">
        <Title level={2}>បង្កើតការវាយតម្លៃថ្មី</Title>
        
        {/* Period and School Selection */}
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Text strong>រយៈពេលវាយតម្លៃ:</Text>
              <Select
                value={assessmentPeriod}
                onChange={setAssessmentPeriod}
                className="w-full mt-2"
                size="large"
              >
                <Option value="baseline">មូលដ្ឋាន</Option>
                <Option value="midline">កុលសនភាព</Option>
                <Option value="endline">បញ្ចប់</Option>
              </Select>
            </div>
            
            <div>
              <Text strong>សាលា:</Text>
              <Select
                value={selectedSchool}
                onChange={setSelectedSchool}
                className="w-full mt-2"
                size="large"
                placeholder="ជ្រើសរើសសាលា"
                showSearch
                optionFilterProp="children"
                disabled={!!session?.user?.pilot_school_id}
              >
                {schools.map((school: any) => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name} ({school.school_code})
                  </Option>
                ))}
              </Select>
            </div>
            
            <div>
              <Text strong>កាលបរិច្ឆេទវាយតម្លៃ:</Text>
              <div className="mt-2">
                <Text className="text-lg">{new Date().toLocaleDateString('km')}</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
              <div className="text-sm text-gray-600">សិស្សសរុប</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{assessedStudents}</div>
              <div className="text-sm text-gray-600">បានវាយតម្លៃ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{eligibleStudents}</div>
              <div className="text-sm text-gray-600">អាចវាយតម្លៃបាន</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{lockedStudents}</div>
              <div className="text-sm text-gray-600">ជាប់សោ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">បានបញ្ចប់</div>
              <Progress percent={completionRate} size="small" />
            </div>
          </div>
        </Card>

        {/* Period-based alerts */}
        {assessmentPeriod === 'midline' && (
          <Alert
            message="ការវាយតម្លៃកុលសនភាព"
            description="សិស្សអាចធ្វើការវាយតម្លៃកុលសនភាពបានលុះត្រាតែពួកគេមានការវាយតម្លៃមូលដ្ឋាន។"
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        {assessmentPeriod === 'endline' && (
          <Alert
            message="ការវាយតម្លៃបញ្ចប់"
            description="សិស្សអាចធ្វើការវាយតម្លៃបញ្ចប់បានលុះត្រាតែពួកគេមានការវាយតម្លៃមូលដ្ឋាន និង/ឬ កុលសនភាព។"
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        {/* Level Legend */}
        <Card title="កម្រិត TaRL" className="mb-4">
          <Space wrap>
            <Text strong>ភាសាខ្មែរ:</Text>
            {khmerLevels.map(level => (
              <Tag key={level.value} color={level.color}>
                {level.label}
              </Tag>
            ))}
          </Space>
          <br />
          <br />
          <Space wrap>
            <Text strong>គណិតវិទ្យា:</Text>
            {mathLevels.map(level => (
              <Tag key={level.value} color={level.color}>
                {level.label}
              </Tag>
            ))}
          </Space>
        </Card>

        {/* Students Table */}
        <Card>
          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={students}
              rowKey="id"
              pagination={{
                pageSize: 50,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} នៃ ${total} សិស្ស`
              }}
              scroll={{ x: 800 }}
              size="small"
              locale={{
                emptyText: 'មិនមានសិស្សដែលអាចវាយតម្លៃបាន'
              }}
            />
          </Spin>
        </Card>
      </div>
    </HorizontalLayout>
  );
}

export default function AssessmentCreatePage() {
  return (
    <Suspense fallback={<HorizontalLayout><div className="flex justify-center items-center h-64"><Spin size="large" /></div></HorizontalLayout>}>
      <AssessmentCreateContent />
    </Suspense>
  );
}