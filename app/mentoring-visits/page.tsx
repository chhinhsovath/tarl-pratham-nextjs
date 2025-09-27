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
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined,
  MoreOutlined,
  FilterOutlined,
  CalendarOutlined,
  BankOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface MentoringVisit {
  id: number;
  visit_date: string;
  mentor: {
    id: number;
    name: string;
    email: string;
  };
  teacher?: {
    id: number;
    name: string;
    email: string;
  };
  pilot_school: {
    id: number;
    name: string;
    school_name: string;
    school_code: string;
  };
  observation: string;
  score?: number;
  action_plan?: string;
  follow_up_required?: boolean;
  is_locked: boolean;
  is_temporary: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export default function MentoringVisitsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mentoringVisits, setMentoringVisits] = useState<MentoringVisit[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    pilot_school_id: '',
    mentor_id: '',
    visit_date_from: '',
    visit_date_to: ''
  });

  const [schools, setSchools] = useState([]);
  const [mentors, setMentors] = useState([]);

  // Fetch mentoring visits
  const fetchMentoringVisits = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters
      });

      const response = await fetch(`/api/mentoring-visits?${params}`);
      const data = await response.json();

      if (response.ok) {
        setMentoringVisits(data.data);
        setPagination({
          current: page,
          pageSize,
          total: data.pagination.total
        });
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
      }
    } catch (error) {
      console.error('Error fetching mentoring visits:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools and mentors for filters
  const fetchFilterOptions = async () => {
    try {
      const [schoolsRes, mentorsRes] = await Promise.all([
        fetch('/api/pilot-schools'),
        fetch('/api/users?role=mentor')
      ]);

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.data || []);
      }

      if (mentorsRes.ok) {
        const mentorsData = await mentorsRes.json();
        setMentors(mentorsData.data || []);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  useEffect(() => {
    fetchMentoringVisits();
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchMentoringVisits(1, pagination.pageSize);
  }, [filters]);

  // Handle delete
  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'តើអ្នកពិតជាចង់លុបកាត់ទុកវិជ្ជាការនេះមែនទេ?',
      content: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ',
      okText: 'លុប',
      cancelText: 'បោះបង់',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/mentoring-visits/${id}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            message.success('លុបកាត់ទុកវិជ្ជាការបានជោគជ័យ');
            fetchMentoringVisits(pagination.current, pagination.pageSize);
          } else {
            const data = await response.json();
            message.error(data.error || 'មានបញ្ហាក្នុងការលុបកាត់ទុកវិជ្ជាការ');
          }
        } catch (error) {
          console.error('Error deleting mentoring visit:', error);
          message.error('មានបញ្ហាក្នុងការលុបកាត់ទុកវិជ្ជាការ');
        }
      }
    });
  };

  // Get row actions based on user role
  const getRowActions = (record: MentoringVisit) => {
    const canEdit = session?.user?.role === 'admin' || 
                   (session?.user?.role === 'mentor' && record.mentor.id === parseInt(session.user.id));
    const canDelete = canEdit && !record.is_locked;

    const items = [
      {
        key: 'view',
        label: 'មើលលម្អិត',
        icon: <EyeOutlined />,
        onClick: () => router.push(`/mentoring-visits/${record.id}`)
      }
    ];

    if (canEdit && !record.is_locked) {
      items.push({
        key: 'edit',
        label: 'កែសម្រួល',
        icon: <EditOutlined />,
        onClick: () => router.push(`/mentoring-visits/${record.id}/edit`)
      });
    }

    if (canDelete) {
      items.push({
        key: 'delete',
        label: 'លុប',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDelete(record.id)
      });
    }

    return items;
  };

  // Table columns
  const columns = [
    {
      title: 'កាលបរិច្ឆេទចុះអប់រំ',
      dataIndex: 'visit_date',
      key: 'visit_date',
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
      title: 'សាលា',
      dataIndex: 'pilot_school',
      key: 'pilot_school',
      width: 200,
      render: (school: any) => (
        <div>
          <div className="font-medium">
            <BankOutlined className="mr-1" />
            {school.school_name}
          </div>
          <div className="text-xs text-gray-500">{school.school_code}</div>
        </div>
      )
    },
    {
      title: 'អ្នកបង្រៀន',
      dataIndex: 'teacher',
      key: 'teacher',
      width: 150,
      render: (teacher: any) => (
        teacher ? (
          <div>
            <UserOutlined className="mr-1" />
            {teacher.name}
          </div>
        ) : (
          <span className="text-gray-400">មិនបានបញ្ជាក់</span>
        )
      )
    },
    {
      title: 'អ្នកគ្រប់គ្រង',
      dataIndex: 'mentor',
      key: 'mentor',
      width: 150,
      render: (mentor: any) => (
        <div>
          <UserOutlined className="mr-1" />
          {mentor.name}
        </div>
      )
    },
    {
      title: 'ពិន្ទុ',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      align: 'center' as const,
      render: (score: number) => (
        score !== undefined ? (
          <Badge 
            count={score} 
            showZero 
            color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}
          />
        ) : (
          <span className="text-gray-400">-</span>
        )
      )
    },
    {
      title: 'ការតាមដាន',
      dataIndex: 'follow_up_required',
      key: 'follow_up_required',
      width: 100,
      align: 'center' as const,
      render: (followUp: boolean) => (
        <Tag color={followUp ? 'orange' : 'green'}>
          {followUp ? 'ត្រូវការ' : 'មិនត្រូវការ'}
        </Tag>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 120,
      render: (record: MentoringVisit) => (
        <Space direction="vertical" size="small">
          {record.is_locked && <Tag color="red">ជាប់សោ</Tag>}
          {record.is_temporary && (
            <Tooltip title={`ផុតកំណត់: ${dayjs(record.expires_at).format('DD/MM/YYYY HH:mm')}`}>
              <Tag color="orange">បណ្តោះអាសន្ន</Tag>
            </Tooltip>
          )}
          {!record.is_locked && !record.is_temporary && <Tag color="green">សកម្ម</Tag>}
        </Space>
      )
    },
    {
      title: 'កំណត់ហេតុ',
      dataIndex: 'observation',
      key: 'observation',
      width: 200,
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          {text || <span className="text-gray-400">មិនមានកំណត់ហេតុ</span>}
        </Tooltip>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 100,
      align: 'center' as const,
      render: (record: MentoringVisit) => (
        <Dropdown menu={{ items: getRowActions(record) }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Filter section
  const filterSection = (
    <Card className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          placeholder="ស្វែងរក..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          prefix={<SearchOutlined />}
          allowClear
        />
        
        <Select
          placeholder="ជ្រើសរើសសាលា"
          value={filters.pilot_school_id || undefined}
          onChange={(value) => setFilters({ ...filters, pilot_school_id: value || '' })}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {schools.map((school: any) => (
            <Select.Option key={school.id} value={school.id.toString()}>
              {school.school_name} ({school.school_code})
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="ជ្រើសរើសអ្នកគ្រប់គ្រង"
          value={filters.mentor_id || undefined}
          onChange={(value) => setFilters({ ...filters, mentor_id: value || '' })}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {mentors.map((mentor: any) => (
            <Select.Option key={mentor.id} value={mentor.id.toString()}>
              {mentor.name}
            </Select.Option>
          ))}
        </Select>

        <RangePicker
          placeholder={['ចាប់ពី', 'ដល់']}
          value={filters.visit_date_from && filters.visit_date_to ? 
            [dayjs(filters.visit_date_from), dayjs(filters.visit_date_to)] : null}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setFilters({
                ...filters,
                visit_date_from: dates[0].format('YYYY-MM-DD'),
                visit_date_to: dates[1].format('YYYY-MM-DD')
              });
            } else {
              setFilters({
                ...filters,
                visit_date_from: '',
                visit_date_to: ''
              });
            }
          }}
        />

        <Button 
          icon={<FilterOutlined />}
          onClick={() => setFilters({
            search: '',
            pilot_school_id: '',
            mentor_id: '',
            visit_date_from: '',
            visit_date_to: ''
          })}
        >
          សម្អាត
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="mb-0">
          ការចុះអប់រំ និងត្រួតពិនិត្យ
        </Title>
        
        {(session?.user?.role === 'admin' || session?.user?.role === 'mentor') && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={() => router.push('/mentoring-visits/create')}
          >
            បង្កើតកាត់ទុកថ្មី
          </Button>
        )}
      </div>

      {filterSection}

      <Card>
        <Table
          columns={columns}
          dataSource={mentoringVisits}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} នៃ ${total} កាត់ទុក`,
            onChange: (page, pageSize) => {
              fetchMentoringVisits(page, pageSize);
            }
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>
    </div>
  );
}