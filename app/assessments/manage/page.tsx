'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Select, 
  DatePicker, 
  Card, 
  Typography, 
  Tag, 
  Dropdown, 
  Modal, 
  message,
  Tooltip,
  Badge,
  Checkbox,
  Progress,
  Alert,
  Tabs
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  SyncOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import DashboardLayout from '@/components/layout/DashboardLayout';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface Assessment {
  id: number;
  student_id: number;
  student: {
    id: number;
    name: string;
    class: number;
    age: number;
    gender: string;
    pilot_school_id: number;
    pilotSchool: {
      school_name: string;
      school_code: string;
    };
  };
  teacher: {
    id: number;
    name: string;
    email: string;
  };
  assessment_period: string;
  assessment_date: string;
  khmer_level: string;
  math_level: string;
  is_verified: boolean;
  is_locked: boolean;
  is_temporary: boolean;
  verified_by?: {
    id: number;
    name: string;
  };
  verified_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export default function AssessmentManagementPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    assessment_period: '',
    school_id: '',
    teacher_id: '',
    is_verified: '',
    is_locked: '',
    is_temporary: '',
    date_from: '',
    date_to: ''
  });

  const [schools, setSchools] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch assessments
  const fetchAssessments = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters,
        tab: activeTab
      });

      const response = await fetch(`/api/assessments/manage?${params}`);
      const data = await response.json();

      if (response.ok) {
        setAssessments(data.data);
        setPagination({
          current: page,
          pageSize,
          total: data.pagination.total
        });
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [schoolsRes, teachersRes] = await Promise.all([
        fetch('/api/pilot-schools'),
        fetch('/api/users?role=teacher')
      ]);

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.data || []);
      }

      if (teachersRes.ok) {
        const teachersData = await teachersRes.json();
        setTeachers(teachersData.data || []);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchAssessments(1, pagination.pageSize);
  }, [filters, activeTab]);

  // Bulk operations
  const handleBulkOperation = async (operation: string) => {
    if (selectedRowKeys.length === 0) {
      message.warning('សូមជ្រើសរើសការវាយតម្លៃយ៉ាងហោចណាស់មួយ');
      return;
    }

    Modal.confirm({
      title: `តើអ្នកពិតជាចង់${getOperationText(operation)}?`,
      content: `សកម្មភាពនេះនឹងប៉ះពាល់ដល់ការវាយតម្លៃចំនួន ${selectedRowKeys.length}`,
      okText: 'បាទ/ចាស',
      cancelText: 'បោះបង់',
      onOk: async () => {
        try {
          const response = await fetch('/api/assessments/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              assessment_ids: selectedRowKeys,
              operation
            })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(data.message);
            setSelectedRowKeys([]);
            fetchAssessments(pagination.current, pagination.pageSize);
          } else {
            message.error(data.error || 'មានបញ្ហាក្នុងការធ្វើសកម្មភាព');
          }
        } catch (error) {
          console.error('Error performing bulk operation:', error);
          message.error('មានបញ្ហាក្នុងការធ្វើសកម្មភាព');
        }
      }
    });
  };

  const getOperationText = (operation: string) => {
    switch (operation) {
      case 'lock': return 'ចាក់សោ';
      case 'unlock': return 'ដោះសោ';
      case 'verify': return 'ផ្ទៀងផ្ទាត់';
      case 'unverify': return 'លុបការផ្ទៀងផ្ទាត់';
      case 'delete': return 'លុប';
      default: return operation;
    }
  };

  // Individual operations
  const handleIndividualOperation = async (assessmentId: number, operation: string) => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/${operation}`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message);
        fetchAssessments(pagination.current, pagination.pageSize);
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការធ្វើសកម្មភាព');
      }
    } catch (error) {
      console.error('Error performing operation:', error);
      message.error('មានបញ្ហាក្នុងការធ្វើសកម្មភាព');
    }
  };

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: Assessment) => ({
      disabled: record.is_locked && ['delete'].includes(''),
    }),
  };

  // Get row actions based on user role and assessment status
  const getRowActions = (record: Assessment) => {
    const canEdit = session?.user?.role === 'admin' || 
                   (session?.user?.role === 'mentor' && !record.is_locked);
    const canVerify = session?.user?.role === 'admin' || session?.user?.role === 'mentor';
    const canLock = session?.user?.role === 'admin';

    const items = [
      {
        key: 'view',
        label: 'មើលលម្អិត',
        icon: <EyeOutlined />,
        onClick: () => router.push(`/assessments/${record.id}`)
      }
    ];

    if (canEdit && !record.is_locked) {
      items.push({
        key: 'edit',
        label: 'កែសម្រួល',
        icon: <EditOutlined />,
        onClick: () => router.push(`/assessments/${record.id}/edit`)
      });
    }

    if (canVerify) {
      if (record.is_verified) {
        items.push({
          key: 'unverify',
          label: 'លុបការផ្ទៀងផ្ទាត់',
          icon: <ExclamationCircleOutlined />,
          onClick: () => handleIndividualOperation(record.id, 'unverify')
        });
      } else {
        items.push({
          key: 'verify',
          label: 'ផ្ទៀងផ្ទាត់',
          icon: <CheckCircleOutlined />,
          onClick: () => handleIndividualOperation(record.id, 'verify')
        });
      }
    }

    if (canLock) {
      if (record.is_locked) {
        items.push({
          key: 'unlock',
          label: 'ដោះសោ',
          icon: <UnlockOutlined />,
          onClick: () => handleIndividualOperation(record.id, 'unlock')
        });
      } else {
        items.push({
          key: 'lock',
          label: 'ចាក់សោ',
          icon: <LockOutlined />,
          onClick: () => handleIndividualOperation(record.id, 'lock')
        });
      }
    }

    if (canEdit && !record.is_locked) {
      items.push({
        key: 'delete',
        label: 'លុប',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleIndividualOperation(record.id, 'delete')
      });
    }

    return items;
  };

  // Table columns
  const columns = [
    {
      title: 'សិស្ស',
      dataIndex: 'student',
      key: 'student',
      width: 200,
      render: (student: any) => (
        <div>
          <div className="font-medium">
            <UserOutlined className="mr-1" />
            {student.name}
          </div>
          <div className="text-xs text-gray-500">
            ថ្នាក់ទី{student.class} | អាយុ {student.age}
          </div>
          <div className="text-xs text-gray-400">
            {student.pilotSchool.school_name}
          </div>
        </div>
      )
    },
    {
      title: 'រយៈពេល',
      dataIndex: 'assessment_period',
      key: 'assessment_period',
      width: 100,
      render: (period: string) => (
        <Tag color={
          period === 'baseline' ? 'blue' :
          period === 'midline' ? 'orange' : 'green'
        }>
          {period === 'baseline' ? 'មូលដ្ឋាន' :
           period === 'midline' ? 'កុលសនភាព' : 'បញ្ចប់'}
        </Tag>
      )
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'assessment_date',
      key: 'assessment_date',
      width: 120,
      render: (date: string) => (
        <div>
          <CalendarOutlined className="mr-1" />
          {dayjs(date).format('DD/MM/YYYY')}
        </div>
      ),
      sorter: true
    },
    {
      title: 'កម្រិតភាសាខ្មែរ',
      dataIndex: 'khmer_level',
      key: 'khmer_level',
      width: 120,
      render: (level: string) => (
        <Tag color="green">{level}</Tag>
      )
    },
    {
      title: 'កម្រិតគណិតវិទ្យា',
      dataIndex: 'math_level',
      key: 'math_level',
      width: 120,
      render: (level: string) => (
        <Tag color="blue">{level}</Tag>
      )
    },
    {
      title: 'អ្នកវាយតម្លៃ',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 150,
      render: (teacher: any) => (
        <div>
          <UserOutlined className="mr-1" />
          {teacher.name}
        </div>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 150,
      render: (record: Assessment) => (
        <Space direction="vertical" size="small">
          {record.is_verified ? (
            <Tag color="green" icon={<CheckCircleOutlined />}>
              បានផ្ទៀងផ្ទាត់
            </Tag>
          ) : (
            <Tag color="orange" icon={<ExclamationCircleOutlined />}>
              មិនទាន់ផ្ទៀងផ្ទាត់
            </Tag>
          )}
          
          {record.is_locked && (
            <Tag color="red" icon={<LockOutlined />}>
              ជាប់សោ
            </Tag>
          )}
          
          {record.is_temporary && (
            <Tooltip title={`ផុតកំណត់: ${dayjs(record.expires_at).format('DD/MM/YYYY HH:mm')}`}>
              <Tag color="purple">
                បណ្តោះអាសន្ន
              </Tag>
            </Tooltip>
          )}
        </Space>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (record: Assessment) => (
        <Dropdown menu={{ items: getRowActions(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Filter section
  const filterSection = (
    <Card className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Input
          placeholder="ស្វែងរកសិស្ស..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          prefix={<SearchOutlined />}
          allowClear
        />
        
        <Select
          placeholder="រយៈពេលវាយតម្លៃ"
          value={filters.assessment_period || undefined}
          onChange={(value) => setFilters({ ...filters, assessment_period: value || '' })}
          allowClear
        >
          <Select.Option value="baseline">មូលដ្ឋាន</Select.Option>
          <Select.Option value="midline">កុលសនភាព</Select.Option>
          <Select.Option value="endline">បញ្ចប់</Select.Option>
        </Select>

        <Select
          placeholder="ជ្រើសរើសសាលា"
          value={filters.school_id || undefined}
          onChange={(value) => setFilters({ ...filters, school_id: value || '' })}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {schools.map((school: any) => (
            <Select.Option key={school.id} value={school.id.toString()}>
              {school.school_name}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="ស្ថានភាពផ្ទៀងផ្ទាត់"
          value={filters.is_verified || undefined}
          onChange={(value) => setFilters({ ...filters, is_verified: value || '' })}
          allowClear
        >
          <Select.Option value="true">បានផ្ទៀងផ្ទាត់</Select.Option>
          <Select.Option value="false">មិនទាន់ផ្ទៀងផ្ទាត់</Select.Option>
        </Select>

        <Select
          placeholder="ស្ថានភាពសោ"
          value={filters.is_locked || undefined}
          onChange={(value) => setFilters({ ...filters, is_locked: value || '' })}
          allowClear
        >
          <Select.Option value="true">ជាប់សោ</Select.Option>
          <Select.Option value="false">មិនជាប់សោ</Select.Option>
        </Select>

        <Button 
          icon={<FilterOutlined />}
          onClick={() => setFilters({
            search: '',
            assessment_period: '',
            school_id: '',
            teacher_id: '',
            is_verified: '',
            is_locked: '',
            is_temporary: '',
            date_from: '',
            date_to: ''
          })}
        >
          សម្អាត
        </Button>
      </div>
    </Card>
  );

  // Bulk actions toolbar
  const bulkActionsToolbar = selectedRowKeys.length > 0 && (
    <Alert
      className="mb-4"
      message={
        <Space size="large">
          <Text>បានជ្រើសរើស {selectedRowKeys.length} ការវាយតម្លៃ</Text>
          <Space>
            {session?.user?.role === 'admin' && (
              <>
                <Button 
                  size="small" 
                  icon={<LockOutlined />}
                  onClick={() => handleBulkOperation('lock')}
                >
                  ចាក់សោ
                </Button>
                <Button 
                  size="small" 
                  icon={<UnlockOutlined />}
                  onClick={() => handleBulkOperation('unlock')}
                >
                  ដោះសោ
                </Button>
              </>
            )}
            {(session?.user?.role === 'admin' || session?.user?.role === 'mentor') && (
              <>
                <Button 
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleBulkOperation('verify')}
                >
                  ផ្ទៀងផ្ទាត់
                </Button>
                <Button 
                  size="small" 
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => handleBulkOperation('unverify')}
                >
                  លុបការផ្ទៀងផ្ទាត់
                </Button>
              </>
            )}
            <Button 
              size="small" 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleBulkOperation('delete')}
            >
              លុប
            </Button>
          </Space>
        </Space>
      }
      type="info"
      closable
      onClose={() => setSelectedRowKeys([])}
    />
  );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">
            គ្រប់គ្រងការវាយតម្លៃ
          </Title>
          
          <Space>
            <Button 
              icon={<ReloadOutlined />}
              onClick={() => fetchAssessments(pagination.current, pagination.pageSize)}
            >
              ផ្ទុកឡើងវិញ
            </Button>
            <Button 
              icon={<FileExcelOutlined />}
              onClick={() => {
                // Export functionality
                window.open('/api/assessments/export', '_blank');
              }}
            >
              នាំចេញ Excel
            </Button>
          </Space>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
          <TabPane tab="ទាំងអស់" key="all" />
          <TabPane tab="មិនទាន់ផ្ទៀងផ្ទាត់" key="unverified" />
          <TabPane tab="បានផ្ទៀងផ្ទាត់" key="verified" />
          <TabPane tab="ជាប់សោ" key="locked" />
          <TabPane tab="បណ្តោះអាសន្ន" key="temporary" />
        </Tabs>

        {filterSection}
        {bulkActionsToolbar}

        <Card>
          <Table
            columns={columns}
            dataSource={assessments}
            rowKey="id"
            loading={loading}
            rowSelection={rowSelection}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} នៃ ${total} ការវាយតម្លៃ`,
              onChange: (page, pageSize) => {
                fetchAssessments(page, pageSize);
              }
            }}
            scroll={{ x: 1400 }}
            size="small"
          />
        </Card>
      </div>
    </DashboardLayout>
  );
}