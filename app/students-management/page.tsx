'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Card,
  Popconfirm,
  Tag,
  App,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Upload,
  Image,
  Tabs,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined,
  TeamOutlined,
  HomeOutlined,
  LineChartOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import SoftDeleteButton from '@/components/common/SoftDeleteButton';
import StudentStatisticsExportButton from '@/components/export/StudentStatisticsExportButton';

const { Title, Text } = Typography;
const { Option } = Select;

// Helper function to translate assessment levels to Khmer
function translateLevelToKhmer(level: string | undefined | null, subject: 'khmer' | 'math'): string {
  if (!level) return '-';

  const levelMap: { [key: string]: string } = {
    // Khmer Language Levels
    'Beginning': 'កម្រិតដំបូង',
    'Characters': 'តួអក្សរ',
    'Words': 'ពាក្យ',
    'Paragraphs': 'កថាខណ្ឌ',
    'Story (Comprehension 1)': 'រឿង (យល់ន័យ១)',
    'Story (Comprehension 2)': 'រឿង (យល់ន័យ២)',
    'Story': 'រឿង',

    // Math Levels
    'Single Digit': 'លេខ១ខ្ទង',
    'Double Digit': 'លេខ២ខ្ទង',
    'Subtraction': 'ប្រមាណវិធីដក',
    'Division': 'ប្រមាណវិធីចែក',
    'Problems': 'ចំណោទ',
  };

  // Return translated level or original if not found in map
  return levelMap[level] || level;
}

interface Student {
  id: number;
  student_id?: string;
  name: string;
  gender: string;
  age?: number;
  grade?: number;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  school_class_id?: number;
  pilot_school_id?: number;
  added_by_id?: number;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
  is_active: boolean;
  is_temporary: boolean;
  added_by_mentor: boolean;
  created_by_role?: string;
  record_status?: string;
  created_at: string;
  updated_at: string;
  // NO JOINS - just raw IDs from students table
}

function StudentsManagementContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: session } = useSession();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [pilotSchools, setPilotSchools] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('students');

  // Search and Filter state
  const [searchText, setSearchText] = useState('');
  const [filterSchool, setFilterSchool] = useState<number | undefined>(undefined);
  const [filterGrade, setFilterGrade] = useState<number | undefined>(undefined);
  const [filterGender, setFilterGender] = useState<string | undefined>(undefined);
  const [filterActive, setFilterActive] = useState<boolean | undefined>(true); // Default to active students

  // Statistics state
  const [stats, setStats] = useState({
    teachers: 0,
    mentors: 0,
    schools: 0,
    assessments: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Pagination - Limit to 100 per page to prevent connection pool exhaustion
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0
  });

  useEffect(() => {
    fetchPilotSchools();
  }, []);

  useEffect(() => {
    // Fetch students when pagination or filters change
    fetchStudents();
  }, [pagination.current, pagination.pageSize, searchText, filterSchool, filterGrade, filterGender, filterActive]);

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setPilotSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pilot schools:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Build query parameters with pagination, search, and filters
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString()
      });

      // Add search parameter
      if (searchText) {
        params.append('search', searchText);
      }

      // Add filter parameters
      if (filterSchool) {
        params.append('pilot_school_id', filterSchool.toString());
      }
      if (filterGrade) {
        params.append('grade', filterGrade.toString());
      }
      if (filterGender) {
        params.append('gender', filterGender);
      }
      if (filterActive !== undefined) {
        params.append('is_active', filterActive.toString());
      }

      const response = await fetch(`/api/students?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0
      }));
    } catch (error: any) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch('/api/stats/summary');

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const result = await response.json();
      setStats(result.data || { teachers: 0, mentors: 0, schools: 0, assessments: 0 });
    } catch (error: any) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យស្ថិតិ');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      date_of_birth: student.date_of_birth ? dayjs(student.date_of_birth) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('បានលុបសិស្សដោយជោគជ័យ');
        fetchStudents();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការលុបសិស្ស');
    }
  };

  const handleClearFilters = () => {
    setSearchText('');
    setFilterSchool(undefined);
    setFilterGrade(undefined);
    setFilterGender(undefined);
    setFilterActive(true);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = editingStudent ? 'PUT' : 'POST';
      const url = editingStudent
        ? `/api/students/${editingStudent.id}`
        : '/api/students';

      const payload = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        message.success(editingStudent ? 'បានកែប្រែសិស្សដោយជោគជ័យ' : 'បានបន្ថែមសិស្សដោយជោគជ័យ');
        setModalVisible(false);
        fetchStudents();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('សូមបំពេញព័ត៌មានត្រឹមត្រូវ');
      } else {
        message.error('មានបញ្ហាក្នុងការរក្សាទុក');
      }
    }
  };

  const handleExport = async () => {
    try {
      const startTime = Date.now();
      message.loading({ content: 'កំពុងបង្កើតឯកសារ Excel...', key: 'export', duration: 0 });

      const response = await fetch('/api/students/export', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export students');
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `TaRL_Students_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);
      message.success({
        content: `បានទាញយកឯកសារដោយជោគជ័យក្នុងរយៈពេល ${duration}វិនាទី! ឯកសារ: ${filename}`,
        key: 'export',
        duration: 5,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      message.error({
        content: `មានបញ្ហាក្នុងការទាញយកឯកសារ: ${error.message}`,
        key: 'export',
        duration: 5,
      });
    }
  };

  const columns = [
    {
      title: 'លេខសម្គាល់',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => text || '-'
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: Student) => (
        <div>
          <strong>{text}</strong>
          {record.is_temporary && (
            <Tag color="orange" size="small" className="ml-2">បណ្តោះអាសន្ន</Tag>
          )}
        </div>
      )
    },
    {
      title: 'បង្កើតដោយ',
      key: 'created_by',
      width: 120,
      render: (_: any, record: Student) => {
        // Show role from created_by_role field (no join needed)
        const role = record.created_by_role || '-';
        return (
          <Tag size="small" color={
            role === 'teacher' ? 'blue' :
            role === 'mentor' ? 'purple' :
            role === 'admin' ? 'red' : 'default'
          }>
            {role === 'teacher' ? 'គ្រូ' :
             role === 'mentor' ? 'អ្នកណែនាំ' :
             role === 'admin' ? 'អ្នកគ្រប់គ្រង' : role}
          </Tag>
        );
      }
    },
    {
      title: 'ការវាយតម្លៃ',
      key: 'assessments',
      width: 120,
      render: (_: any, record: Student) => (
        <Button
          type="link"
          size="small"
          icon={<FileTextOutlined />}
          onClick={() => router.push(`/assessments?student_id=${record.id}`)}
          style={{ padding: 0 }}
        >
          មើល
        </Button>
      )
    },
    {
      title: 'ស្ថានភាពទិន្នន័យ',
      dataIndex: 'record_status',
      key: 'record_status',
      width: 120,
      render: (status: string, record: Student) => (
        <Space direction="vertical" size="small">
          <Tag color={
            status === 'production' ? 'green' :
            status === 'test_teacher' ? 'blue' :
            status === 'test_mentor' ? 'purple' :
            status === 'demo' ? 'orange' : 'default'
          }>
            {status === 'production' ? 'ផលិតកម្ម' :
             status === 'test_teacher' ? 'សាកល្បង (គ្រូ)' :
             status === 'test_mentor' ? 'សាកល្បង (អ្នកណែនាំ)' :
             status === 'demo' ? 'សាកល្បង' : status}
          </Tag>
          {record.created_by_role && (
            <div className="text-xs text-gray-500">
              {record.created_by_role === 'teacher' ? 'គ្រូបង្កើត' :
               record.created_by_role === 'mentor' ? 'អ្នកណែនាំបង្កើត' :
               record.created_by_role}
            </div>
          )}
        </Space>
      )
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === 'male' || gender === 'ប្រុស' ? 'blue' : 'pink'}>
          {gender === 'male' ? 'ប្រុស' : gender === 'female' ? 'ស្រី' : gender}
        </Tag>
      )
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      render: (grade: number) => grade ? `ទី${grade}` : '-'
    },
    {
      title: 'សាលារៀន ID',
      dataIndex: 'pilot_school_id',
      key: 'pilot_school_id',
      width: 120,
      render: (id: number) => id || '-'
    },
    {
      title: 'តេស្តដើមគ្រា ភាសា',
      dataIndex: 'baseline_khmer_level',
      key: 'baseline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="purple">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តដើមគ្រា គណិត',
      dataIndex: 'baseline_math_level',
      key: 'baseline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="cyan">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'តេស្តពាក់កណ្ដាលគ្រា ភាសា',
      dataIndex: 'midline_khmer_level',
      key: 'midline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="orange">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តពាក់កណ្ដាលគ្រា គណិត',
      dataIndex: 'midline_math_level',
      key: 'midline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="gold">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'តេស្តចុងក្រោយគ្រា ភាសា',
      dataIndex: 'endline_khmer_level',
      key: 'endline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="green">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តចុងក្រោយគ្រា គណិត',
      dataIndex: 'endline_math_level',
      key: 'endline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="lime">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      fixed: 'right' as const,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'សកម្ម' : 'អសកម្ម'}
        </Tag>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <SoftDeleteButton
            type="student"
            id={record.id}
            displayName={record.name}
            size="small"
            buttonType="text"
            iconOnly={true}
            onSuccess={fetchStudents}
            additionalInfo={`ភេទ: ${record.gender}, ថ្នាក់: ${record.grade || 'N/A'}`}
          />
        </Space>
      )
    }
  ];

  // Statistics component
  const StatisticsTab = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="គ្រូបង្រៀន"
            value={stats.teachers}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="អ្នកណែនាំ"
            value={stats.mentors}
            prefix={<UserOutlined />}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="សាលារៀន"
            value={stats.schools}
            prefix={<HomeOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="ការវាយតម្លៃ"
            value={stats.assessments}
            prefix={<BarChartOutlined />}
            valueStyle={{ color: '#fa8c16' }}
          />
        </Card>
      </Col>
    </Row>
  );

  // Students table component
  const StudentsTab = () => (
    <>
      {/* Header Actions */}
      <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} md={12}>
          <Text type="secondary">ការគ្រប់គ្រងទិន្នន័យសិស្សពេញលេញ</Text>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space wrap>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchStudents}
            >
              ផ្ទុកឡើងវិញ
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              title="Export បញ្ជីសិស្សទាំងអស់ (Raw Data)"
            >
              Export សិស្ស
            </Button>
            {(session?.user as any)?.role && ['admin', 'coordinator', 'super_admin'].includes((session?.user as any)?.role) && (
              <StudentStatisticsExportButton size="middle" showIcon={true} />
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              បន្ថែមសិស្សថ្មី
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card size="small" style={{ marginBottom: '16px', backgroundColor: '#fafafa' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="ស្វែងរកតាមឈ្មោះ, អាណាព្យាបាល, ទូរស័ព្ទ..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={5}>
            <Select
              placeholder="សាលារៀន"
              value={filterSchool}
              onChange={(value) => {
                setFilterSchool(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase()) ?? false
              }
            >
              {pilotSchools.map(school => (
                <Option key={school.id} value={school.id}>
                  {school.school_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4} lg={3}>
            <Select
              placeholder="ថ្នាក់"
              value={filterGrade}
              onChange={(value) => {
                setFilterGrade(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={1}>ទី១</Option>
              <Option value={2}>ទី២</Option>
              <Option value={3}>ទី៣</Option>
              <Option value={4}>ទី៤</Option>
              <Option value={5}>ទី៥</Option>
              <Option value={6}>ទី៦</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4} lg={3}>
            <Select
              placeholder="ភេទ"
              value={filterGender}
              onChange={(value) => {
                setFilterGender(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="male">ប្រុស</Option>
              <Option value="female">ស្រី</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4} lg={4}>
            <Select
              placeholder="ស្ថានភាព"
              value={filterActive}
              onChange={(value) => {
                setFilterActive(value);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}
              style={{ width: '100%' }}
            >
              <Option value={true}>សកម្ម</Option>
              <Option value={false}>អសកម្ម</Option>
            </Select>
          </Col>
          <Col xs={12} sm={8} md={4} lg={3}>
            <Button
              onClick={handleClearFilters}
              style={{ width: '100%' }}
            >
              សម្អាតតម្រង
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Total count - show total from API */}
      <div style={{ marginBottom: '16px', textAlign: 'right' }}>
        <Text strong>សរុប: {pagination.total} សិស្ស (បង្ហាញ {students.length} សិស្សក្នុងទំព័រនេះ)</Text>
      </div>

      {/* Table - With pagination to prevent connection exhaustion */}
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total} សិស្ស`,
          showSizeChanger: true,
          pageSizeOptions: ['50', '100'],
          onChange: (page, pageSize) => {
            setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 100 }));
          }
        }}
        scroll={{ x: 2200, y: 600 }}
        size="small"
      />
    </>
  );

  const tabItems = [
    {
      key: 'students',
      label: (
        <span>
          <UserOutlined />
          បញ្ជីសិស្ស
        </span>
      ),
      children: <StudentsTab />
    },
    {
      key: 'statistics',
      label: (
        <span>
          <LineChartOutlined />
          ស្ថិតិ
        </span>
      ),
      children: <StatisticsTab />
    }
  ];

  return (
    <>
      <Card bodyStyle={{ padding: '16px' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>គ្រប់គ្រងសិស្ស (Admin/Coordinator)</Title>
          </Col>
        </Row>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            if (key === 'statistics') {
              fetchStats();
            }
          }}
          items={tabItems}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? 'កែប្រែសិស្ស' : 'បន្ថែមសិស្សថ្មី'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        okText="រក្សាទុក"
        cancelText="បោះបង់"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="student_id"
                label="លេខសម្គាល់សិស្ស"
              >
                <Input placeholder="លេខសម្គាល់សិស្ស" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="ឈ្មោះសិស្ស"
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស' }]}
              >
                <Input placeholder="ឈ្មោះសិស្ស" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="ភេទ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ' }]}
              >
                <Select placeholder="ជ្រើសរើសភេទ">
                  <Option value="male">ប្រុស</Option>
                  <Option value="female">ស្រី</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="grade"
                label="ថ្នាក់"
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់">
                  <Option value={4}>ទី4</Option>
                  <Option value={5}>ទី5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pilot_school_id"
                label="សាលារៀន"
              >
                <Select
                  placeholder="ជ្រើសរើសសាលារៀន"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      ?.includes(input.toLowerCase()) ?? false
                  }
                >
                  {pilotSchools.map(school => (
                    <Option key={school.id} value={school.id}>
                      {school.school_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default function StudentsManagementPage() {
  return (
    <App>
      <HorizontalLayout>
        <StudentsManagementContent />
      </HorizontalLayout>
    </App>
  );
}
