'use client';

import React, { useState, useEffect } from 'react';
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
  Modal,
  Popconfirm,
  DatePicker,
  Dropdown,
  Menu
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  DownOutlined,
  FileTextOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import OnboardingTour from '@/components/tour/OnboardingTour';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function AssessmentsContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    assessment_type: '',
    subject: '',
    student_id: '',
    pilot_school_id: '',
    is_temporary: '',
    date_from: '',
    date_to: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [students, setStudents] = useState([]);
  const [pilotSchools, setPilotSchools] = useState([]);

  useEffect(() => {
    fetchFormData();
    fetchAssessments();
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [filters, pagination.current, pagination.pageSize]);

  const fetchFormData = async () => {
    try {
      const requests = [];
      
      requests.push(fetch('/api/students'));
      
      if (user?.role === 'mentor' || user?.role === 'admin') {
        requests.push(fetch('/api/pilot-schools'));
      }

      const responses = await Promise.all(requests);
      
      if (responses[0]) {
        const studentsData = await responses[0].json();
        setStudents(studentsData.students || []);
      }
      
      if (responses[1]) {
        const schoolsData = await responses[1].json();
        setPilotSchools(schoolsData.schools || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      });

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/assessments?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();

      setAssessments(data.assessments || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យការវាយតម្លៃ');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        date_from: dates[0].format('YYYY-MM-DD'),
        date_to: dates[1].format('YYYY-MM-DD')
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        date_from: '',
        date_to: ''
      }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: 'DELETE',
        headers: {
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        }
      });

      if (response.ok) {
        message.success('Assessment deleted successfully');
        fetchAssessments();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to delete assessment');
      }
    } catch (error) {
      message.error('Failed to delete assessment');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/assessments/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `assessments_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('Assessments exported successfully');
      } else {
        message.error('Failed to export assessments');
      }
    } catch (error) {
      message.error('Failed to export assessments');
    }
  };

  const createAssessmentMenuItems = [
    {
      key: 'single',
      icon: <FileTextOutlined />,
      label: 'វាយតម្លៃទារ្ទិច',
      onClick: () => router.push('/assessments/create')
    },
    {
      key: 'bulk',
      icon: <TeamOutlined />,
      label: 'វាយតម្លៃរួមកាន់',
      onClick: () => router.push('/assessments/select-students')
    }
  ];

  const columns = [
    {
      title: 'សិស្ស',
      dataIndex: 'student',
      key: 'student',
      render: (student: any) => (
        <div>
          <strong>{student?.name}</strong>
          {student?.is_temporary && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              បណ្តោះអាសន្ន
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          'ដើមគ្រា': 'ដើមគ្រា',
          'ពាក់កណ្តាលគ្រា': 'ពាក់កណ្តាលគ្រា',
          'ចុងគ្រា': 'ចុងគ្រា'
        };
        return (
          <Tag color={type === 'ដើមគ្រា' ? 'blue' : type === 'ពាក់កណ្តាលគ្រា' ? 'orange' : 'green'}>
            {typeMap[type as keyof typeof typeMap]}
          </Tag>
        );
      }
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
      render: (subject: string) => {
        const subjectMap = {
          khmer: 'ភាសាខ្មែរ',
          math: 'គណិតវិទ្យា'
        };
        return (
          <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
            {subjectMap[subject as keyof typeof subjectMap]}
          </Tag>
        );
      }
    },
    {
      title: 'កម្រិត',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: string) => {
        if (!level) return '-';
        const levelMap = {
          beginner: 'ចាប់ផ្តើម',
          letter: 'អក្សរ',
          word: 'ពាក្យ',
          paragraph: 'កថាខណ្ឌ'
        };
        return (
          <Tag color={
            level === 'beginner' ? 'red' :
            level === 'letter' ? 'orange' :
            level === 'word' ? 'gold' :
            level === 'paragraph' ? 'green' : 'blue'
          }>
            {levelMap[level as keyof typeof levelMap]}
          </Tag>
        );
      }
    },
    {
      title: 'ពិន្ទុ',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => score ? (
        <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      ) : '-'
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'assessed_date',
      key: 'assessed_date',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'វាយតម្លៃដោយ',
      dataIndex: 'added_by',
      key: 'added_by',
      render: (addedBy: any) => addedBy ? (
        <div>
          <div><strong>{addedBy.name}</strong></div>
          <Tag size="small" color={addedBy.role === 'mentor' ? 'orange' : 'blue'}>
            {addedBy.role === 'mentor' ? 'អ្នកណែនាំ' : 'គ្រូបង្រៀន'}
          </Tag>
        </div>
      ) : '-'
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 100,
      render: (record: any) => (
        <Space direction="vertical" size="small">
          {record.is_temporary && (
            <Tag color="orange" size="small">បណ្តោះអាសន្ន</Tag>
          )}
          {record.assessed_by_mentor && (
            <Tag color="gold" size="small">អ្នកណែនាំ</Tag>
          )}
          {!record.is_temporary && !record.assessed_by_mentor && (
            <Tag color="green" size="small">ស្ថិរ</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 150,
      render: (record: any) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => router.push(`/assessments/${record.id}`)}
          >
            មើល
          </Button>
          
          {hasPermission(user, 'assessments.edit') && (
            <Button 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/assessments/${record.id}/edit`)}
            />
          )}
          
          {hasPermission(user, 'assessments.delete') && (
            <Popconfirm
              title="តើអ្នកពិតជាចង់លុបការវាយតម្លៃនេះមែនទេ?"
              onConfirm={() => handleDelete(record.id)}
              okText="យល់ព្រម"
              cancelText="បោះបង់"
            >
              <Button 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          )}
        </Space>
      )
    }
  ];

  return (
    <>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>ការវាយតម្លៃ</Title>
              <Text type="secondary">គ្រប់គ្រង និងតាមដានការវាយតម្លៃសិស្ស</Text>
            </Col>
            <Col>
              <Space>
                {hasPermission(user, 'assessments.export') && (
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                )}
                
                {hasPermission(user, 'assessments.create') && (
                  <Dropdown menu={{ items: createAssessmentMenuItems }} trigger={['click']}>
                    <Button type="primary" icon={<PlusOutlined />}>
                      Create Assessment <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Row gutter={16}>
            <Col span={6}>
              <Input
                placeholder="Search assessments..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </Col>
            
            <Col span={4}>
              <Select
                placeholder="Assessment Type"
                value={filters.assessment_type}
                onChange={(value) => handleFilterChange('assessment_type', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="ដើមគ្រា">ដើមគ្រា</Option>
                <Option value="ពាក់កណ្តាលគ្រា">ពាក់កណ្តាលគ្រា</Option>
                <Option value="ចុងគ្រា">ចុងគ្រា</Option>
              </Select>
            </Col>
            
            <Col span={4}>
              <Select
                placeholder="មុខវិច្ឆា"
                value={filters.subject}
                onChange={(value) => handleFilterChange('subject', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="khmer">ខ្មែរ</Option>
                <Option value="math">Math</Option>
              </Select>
            </Col>
            
            <Col span={5}>
              <Select
                placeholder="ជ្រើសរើសសិស្ស"
                value={filters.student_id}
                onChange={(value) => handleFilterChange('student_id', value)}
                allowClear
                showSearch
                style={{ width: '100%' }}
                filterOption={(input: string, option: any) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {students.map((student: any) => (
                  <Option key={student.id} value={student.id}>
                    {student.name}
                  </Option>
                ))}
              </Select>
            </Col>
            
            <Col span={5}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['Start Date', 'End Date']}
              />
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginTop: '8px' }}>
            {(user?.role === 'mentor' || user?.role === 'admin') && (
              <Col span={6}>
                <Select
                  placeholder="Pilot School"
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
            
            <Col span={4}>
              <Select
                placeholder="Status"
                value={filters.is_temporary}
                onChange={(value) => handleFilterChange('is_temporary', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="true">Temporary</Option>
                <Option value="false">Permanent</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Assessments Table */}
        <Table
          columns={columns}
          dataSource={assessments}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} assessments`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 20
              }));
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </>
  );
}

export default function AssessmentsPage() {
  return (
    <HorizontalLayout>
      <AssessmentsContent />
      {/* Assessments-specific tour */}
      <OnboardingTour page="assessments" autoStart={true} showStartButton={false} />
    </HorizontalLayout>
  );
}