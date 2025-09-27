'use client';

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
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students');
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
      message.warning('Please select at least one student');
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
          Select All
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
      title: 'Photo',
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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: any) => (
        <div>
          <strong>{name}</strong>
          {record.is_temporary && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              Temporary
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      render: (age: number) => age || '-'
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => gender || '-'
    },
    {
      title: 'Class/School',
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
              <div>{record.pilot_school.name}</div>
              <Text type="secondary">Pilot School</Text>
            </div>
          ) : (
            <Text type="secondary">Not assigned</Text>
          )}
        </div>
      )
    },
    {
      title: 'Previous Assessments',
      key: 'assessments',
      render: (record: any) => {
        const assessments = record.assessments || [];
        const hasBaseline = assessments.some((a: any) => a.assessment_type === 'baseline' && a.subject === subject);
        const hasMidline = assessments.some((a: any) => a.assessment_type === 'midline' && a.subject === subject);
        const hasEndline = assessments.some((a: any) => a.assessment_type === 'endline' && a.subject === subject);
        
        return (
          <Space size="small">
            <Tag color={hasBaseline ? 'green' : 'default'}>
              Baseline {hasBaseline ? '✓' : '✗'}
            </Tag>
            <Tag color={hasMidline ? 'green' : 'default'}>
              Midline {hasMidline ? '✓' : '✗'}
            </Tag>
            <Tag color={hasEndline ? 'green' : 'default'}>
              Endline {hasEndline ? '✓' : '✗'}
            </Tag>
          </Space>
        );
      }
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>Select Students for Assessment</Title>
          <Space size="large">
            <div>
              <Text strong>Assessment Type: </Text>
              <Tag color={assessmentType === 'baseline' ? 'blue' : assessmentType === 'midline' ? 'orange' : 'green'}>
                {assessmentType.toUpperCase()}
              </Tag>
            </div>
            <div>
              <Text strong>Subject: </Text>
              <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
                {subject.toUpperCase()}
              </Tag>
            </div>
            <div>
              <Text strong>Selected: </Text>
              <Tag color="green">{selectedStudents.length} students</Tag>
            </div>
          </Space>
        </div>

        {user?.role === 'mentor' && (
          <Alert
            message="Mentor Assessment"
            description="Assessments created by mentors are marked as temporary and will be automatically deleted after 48 hours unless permanently saved by an admin or teacher."
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
                placeholder="Search students..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </Col>
            
            {user?.role !== 'mentor' && (
              <Col span={6}>
                <Select
                  placeholder="Select class"
                  value={filters.school_class_id}
                  onChange={(value) => handleFilterChange('school_class_id', value)}
                  allowClear
                  style={{ width: '100%' }}
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
              <Col span={6}>
                <Select
                  placeholder="Select pilot school"
                  value={filters.pilot_school_id}
                  onChange={(value) => handleFilterChange('pilot_school_id', value)}
                  allowClear
                  style={{ width: '100%' }}
                >
                  {pilotSchools.map((school: any) => (
                    <Option key={school.id} value={school.id}>
                      {school.name} ({school.code})
                    </Option>
                  ))}
                </Select>
              </Col>
            )}
            
            <Col span={6}>
              <Select
                placeholder="Select gender"
                value={filters.gender}
                onChange={(value) => handleFilterChange('gender', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            total: students.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} students`
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
                {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
              </Text>
            </Col>
            <Col>
              <Space>
                <Button onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleProceed}
                  disabled={selectedStudents.length === 0}
                  icon={<ArrowRightOutlined />}
                >
                  Proceed to Assessment Entry
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}

export default function SelectStudentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectStudentsContent />
    </Suspense>
  );
}