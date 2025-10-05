'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect, Suspense } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Select, 
  Input, 
  Row, 
  Col, 
  message,
  Space,
  Typography,
  Tag,
  Checkbox,
  Alert
} from 'antd';
import { SearchOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';

const { Title, Text } = Typography;
const { Option } = Select;

function SelectStudentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    school_class_id: null,
    pilot_school_id: null,
    gender: null
  });
  const [classes, setClasses] = useState([]);
  const [pilotSchools, setPilotSchools] = useState([]);

  // Get URL parameters
  const assessmentType = searchParams.get('type') || 'baseline';
  const subject = searchParams.get('subject') || 'khmer';

  // Check permissions
  if (!hasPermission(user, 'assessments.create')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    fetchFormData();
    fetchStudents();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchFormData = async () => {
    try {
      const requests = [];
      
      if (user?.role !== 'mentor') {
        requests.push(fetch('/api/school-classes'));
      }
      
      if (user?.role === 'mentor' || user?.role === 'admin') {
        requests.push(fetch('/api/pilot-schools'));
      }

      const responses = await Promise.all(requests);
      
      let responseIndex = 0;
      
      if (user?.role !== 'mentor' && responses[responseIndex]) {
        const classesData = await responses[responseIndex].json();
        setClasses(classesData.classes || []);
        responseIndex++;
      }
      
      if ((user?.role === 'mentor' || user?.role === 'admin') && responses[responseIndex]) {
        const schoolsData = await responses[responseIndex].json();
        setPilotSchools(schoolsData.schools || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.school_class_id) params.append('school_class_id', filters.school_class_id);
      if (filters.pilot_school_id) params.append('pilot_school_id', filters.pilot_school_id);
      if (filters.gender) params.append('gender', filters.gender);
      
      // Apply role-based filtering
      if (user?.role === 'teacher' || user?.role === 'mentor') {
        if (user.pilot_school_id) {
          params.append('pilot_school_id', user.pilot_school_id.toString());
        }
      }

      const response = await fetch(`/api/students?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.data || data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យសិស្ស');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((student: any) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleProceed = () => {
    if (selectedStudents.length === 0) {
      message.warning('សូមជ្រើសរើសសិស្សយ៉ាងហោចណាស់ម្នាក់');
      return;
    }

    // Navigate to data entry with selected students
    const params = new URLSearchParams({
      students: selectedStudents.join(','),
      type: assessmentType,
      subject: subject
    });

    router.push(`/assessments/data-entry?${params.toString()}`);
  };

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
          checked={selectedStudents.length === students.length && students.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        >
          ជ្រើសរើសទាំងអស់
        </Checkbox>
      ),
      dataIndex: 'id',
      key: 'select',
      width: 120,
      render: (id: number) => (
        <Checkbox
          checked={selectedStudents.includes(id)}
          onChange={(e) => handleSelectStudent(id, e.target.checked)}
        />
      )
    },
    {
      title: 'រូបថត',
      dataIndex: 'photo',
      key: 'photo',
      width: 80,
      render: (photo: string, record: any) => (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {photo ? (
            <img
              src={photo}
              alt={record.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <UserOutlined style={{ color: '#d9d9d9' }} />
          )}
        </div>
      )
    },
    {
      title: 'ឈ្មោះ',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <strong>{name}</strong>
          {record.is_temporary && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              បណ្តោះអាសន្ន
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'អាយុ',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      render: (age: number) => age || '-'
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => gender || '-'
    },
    {
      title: 'ថ្នាក់/សាលា',
      key: 'assignment',
      render: (record: any) => (
        <div>
          {record.school_class ? (
            <div>
              <div>{record.school_class.school?.name}</div>
              <Text type="secondary">{record.school_class.name}</Text>
            </div>
          ) : record.pilot_school ? (
            <div>
              <div>{record.pilot_school.school_name}</div>
              <Text type="secondary">សាលាសាកល្បង</Text>
            </div>
          ) : (
            <Text type="secondary">មិនទាន់បានកំណត់</Text>
          )}
        </div>
      )
    },
    {
      title: 'ការវាយតម្លៃពីមុន',
      key: 'assessments',
      render: (record: any) => {
        const assessments = record.assessments || [];
        const hasBaseline = assessments.some((a: any) => a.assessment_type === 'baseline' && a.subject === subject);
        const hasMidline = assessments.some((a: any) => a.assessment_type === 'midline' && a.subject === subject);
        const hasEndline = assessments.some((a: any) => a.assessment_type === 'endline' && a.subject === subject);

        return (
          <Space size="small">
            <Tag color={hasBaseline ? 'green' : 'default'}>
              ដើមគ្រា {hasBaseline ? '✓' : '✗'}
            </Tag>
            <Tag color={hasMidline ? 'green' : 'default'}>
              កណ្តាលគ្រា {hasMidline ? '✓' : '✗'}
            </Tag>
            <Tag color={hasEndline ? 'green' : 'default'}>
              ចុងគ្រា {hasEndline ? '✓' : '✗'}
            </Tag>
          </Space>
        );
      }
    }
  ];

  return (
    <div className="max-w-full overflow-x-hidden">
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>ជ្រើសរើសសិស្សសម្រាប់ការវាយតម្លៃ</Title>
          <Space size="large">
            <div>
              <Text strong>ប្រភេទការវាយតម្លៃ: </Text>
              <Tag color={assessmentType === 'baseline' ? 'blue' : assessmentType === 'midline' ? 'orange' : 'green'}>
                {assessmentType === 'baseline' ? 'តេស្តដើមគ្រា' : assessmentType === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' : 'តេស្តចុងក្រោយគ្រា'}
              </Tag>
            </div>
            <div>
              <Text strong>មុខវិជ្ជា: </Text>
              <Tag color={subject === 'language' ? 'purple' : 'cyan'}>
                {subject === 'language' ? 'ខ្មែរ' : 'គណិតវិទ្យា'}
              </Tag>
            </div>
            <div>
              <Text strong>បានជ្រើសរើស: </Text>
              <Tag color="green">{selectedStudents.length} សិស្ស</Tag>
            </div>
          </Space>
        </div>

        {user?.role === 'mentor' && (
          <Alert
            message="ការវាយតម្លៃដោយអ្នកណែនាំ"
            description="ការវាយតម្លៃដែលបង្កើតដោយអ្នកណែនាំត្រូវបានសម្គាល់ថាជាបណ្តោះអាសន្ន ហើយនឹងត្រូវលុបដោយស្វ័យប្រវត្តិបន្ទាប់ពី 48 ម៉ោង លុះត្រាតែត្រូវបានរក្សាទុកជាអចិន្ត្រៃយ៍ដោយអ្នកគ្រប់គ្រង ឬគ្រូបង្រៀន។"
            type="warning"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* Filters */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="ស្វែងរកសិស្ស..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </Col>
            
            {user?.role !== 'mentor' && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="ជ្រើសរើសថ្នាក់"
                  value={filters.school_class_id}
                  onChange={(value) => handleFilterChange('school_class_id', value)}
                  allowClear
                  style={{ width: '100%' }}
                  size="large"
                >
                  {classes.map((schoolClass: any) => (
                    <Option key={schoolClass.id} value={schoolClass.id}>
                      {schoolClass.school?.name} - {schoolClass.name}
                    </Option>
                  ))}
                </Select>
              </Col>
            )}

            {(user?.role === 'mentor' || user?.role === 'admin') && (
              <Col xs={24} sm={12} md={8} lg={6}>
                <Select
                  placeholder="ជ្រើសរើសសាលាសាកល្បង"
                  value={filters.pilot_school_id}
                  onChange={(value) => handleFilterChange('pilot_school_id', value)}
                  allowClear
                  style={{ width: '100%' }}
                  size="large"
                >
                  {pilotSchools.map((school: any) => (
                    <Option key={school.id} value={school.id}>
                      {school.name} ({school.code})
                    </Option>
                  ))}
                </Select>
              </Col>
            )}

            <Col xs={24} sm={12} md={8} lg={6}>
              <Select
                placeholder="ជ្រើសរើសភេទ"
                value={filters.gender}
                onChange={(value) => handleFilterChange('gender', value)}
                allowClear
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="ប្រុស">ប្រុស</Option>
                <Option value="ស្រី">ស្រី</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <Table scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            total: students.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ពី ${total} សិស្ស`
          }}
        />

        {/* Action Buttons */}
        <div style={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          padding: '16px 0',
          borderTop: '1px solid #f0f0f0',
          marginTop: '16px'
        }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Text strong>
                {selectedStudents.length} សិស្សបានជ្រើសរើស
              </Text>
            </Col>
            <Col>
              <Space>
                <Button onClick={() => router.back()}>
                  បោះបង់
                </Button>
                <Button
                  type="primary"
                  onClick={handleProceed}
                  disabled={selectedStudents.length === 0}
                  icon={<ArrowRightOutlined />}
                >
                  បន្តទៅការវាយតម្លៃ
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}

function SelectStudentsPageContent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectStudentsContent />
    </Suspense>
  );
}
export default function SelectStudentsPage() {
  return (
    <HorizontalLayout>
      <SelectStudentsPageContent />
    </HorizontalLayout>
  );
}
