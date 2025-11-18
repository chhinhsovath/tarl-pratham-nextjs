'use client';

import { Suspense } from 'react';
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
  Popconfirm,
  DatePicker,
  Image,
  Modal
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  CalendarOutlined,
  TeamOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function MentoringContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    pilot_school_id: '',
    status: '',
    date_from: '',
    date_to: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [pilotSchools, setPilotSchools] = useState([]);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasInitialFetchRef = React.useRef(false);

  // Initialize filters from URL query parameters on component mount
  useEffect(() => {
    const initialFilters: any = { ...filters };
    let hasQueryParams = false;

    // Read all query parameters and apply to filters
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (value && Object.keys(filters).includes(key)) {
        initialFilters[key] = value;
        queryParams[key] = value;
        hasQueryParams = true;
      }
    });

    // Update filters with URL parameters if they exist
    if (hasQueryParams) {
      setFilters(initialFilters);
      console.log('📍 Initialized filters from URL:', queryParams);
    }

    // Mark as initialized regardless of whether we found query params
    setIsInitialized(true);
  }, []);

  // Fetch pilot schools on mount
  useEffect(() => {
    fetchPilotSchools();
  }, []);

  // Single consolidated effect for all data fetching to prevent double-fetch
  useEffect(() => {
    if (!isInitialized) return;

    // Prevent the initial fetch from running twice
    if (!hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      fetchVisits();
      return;
    }

    // For subsequent filter/pagination changes, fetch with debounce
    const debounceTimer = setTimeout(() => {
      fetchVisits();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [isInitialized, filters, pagination.current, pagination.pageSize]);

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

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      params.append('page', pagination.current.toString());
      params.append('limit', pagination.pageSize.toString());
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Apply role-based filtering
      if (user?.role === 'mentor') {
        params.append('mentor_id', user.id.toString());
      }

      const response = await fetch(`/api/mentoring?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setVisits(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching visits:', error);
      message.error('Failed to load mentoring visits');
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
      const response = await fetch(`/api/mentoring/${id}`, {
        method: 'DELETE',
        headers: {
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        }
      });

      if (response.ok) {
        message.success('Mentoring visit deleted successfully');
        fetchVisits();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to delete visit');
      }
    } catch (error) {
      message.error('Failed to delete visit');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      if (user?.role === 'mentor') {
        params.append('mentor_id', user.id.toString());
      }

      const response = await fetch(`/api/mentoring/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mentoring_visits_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('Mentoring visits exported successfully');
      } else {
        message.error('Failed to export visits');
      }
    } catch (error) {
      message.error('Failed to export visits');
    }
  };

  const showPhotos = (photos: string[]) => {
    setSelectedPhotos(photos);
    setPhotoModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'ឈ្មោះសាលា',
      dataIndex: 'pilot_school',
      key: 'pilot_school',
      render: (school: any) => (
        <div>
          <strong>{school?.school_name || 'មិនបានកំណត់'}</strong>
          <br />
          <Text type="secondary">{school?.school_code || ''}</Text>
        </div>
      )
    },
    {
      title: 'កាលបរិច្ចេទ',
      dataIndex: 'visit_date',
      key: 'visit_date',
      width: 120,
      render: (date: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {dayjs(date).format('DD/MM/YYYY')}
        </div>
      )
    },
    {
      title: 'អ្នកណែនាំ',
      dataIndex: 'mentor',
      key: 'mentor',
      render: (mentor: any) => (
        <div>
          <strong>{mentor?.name}</strong>
          <br />
          <Text type="secondary">{mentor?.email}</Text>
        </div>
      )
    },
    {
      title: 'គ្រូបង្រៀន',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: any) => (
        <div>
          <strong>{teacher?.name || 'មិនបានកំណត់'}</strong>
          {teacher?.email && (
            <>
              <br />
              <Text type="secondary">{teacher.email}</Text>
            </>
          )}
        </div>
      )
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject_observed',
      key: 'subject_observed',
      width: 100,
      render: (subject: string) => (
        subject ? (
          <Tag color={subject === 'ភាសាខ្មែរ' ? 'blue' : 'green'}>
            {subject}
          </Tag>
        ) : '-'
      )
    },
    {
      title: 'សិស្សចុះឈ្មោះ',
      dataIndex: 'total_students_enrolled',
      key: 'total_students_enrolled',
      width: 100,
      render: (count: number) => (
        <div style={{ textAlign: 'center' }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          {count || 0}
        </div>
      )
    },
    {
      title: 'សិស្សមកថ្នាក់',
      dataIndex: 'students_present',
      key: 'students_present',
      width: 100,
      render: (count: number) => (
        <div style={{ textAlign: 'center' }}>
          <TeamOutlined style={{ marginRight: 8 }} />
          {count || 0}
        </div>
      )
    },
    {
      title: 'ពិន្ទុ',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => (
        score ? (
          <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
            {score}
          </Tag>
        ) : '-'
      )
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          'scheduled': { label: 'កំពុងដំណើរការ', color: 'blue' },
          'completed': { label: 'បានបញ្ចប់', color: 'green' },
          'cancelled': { label: 'បានបោះបង់', color: 'red' }
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'default' };
        return (
          <Tag color={statusInfo.color}>
            {statusInfo.label}
          </Tag>
        );
      }
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
            onClick={() => router.push(`/mentoring/${record.id}`)}
            title="មើលលម្អិត"
          />
          
          {(user?.role === 'admin' || user?.role === 'coordinator' || 
            (user?.role === 'mentor' && record.mentor_id === parseInt(user.id))) && (
            <Button 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/mentoring/${record.id}/edit`)}
              title="កែសម្រួល"
            />
          )}
          
          {(user?.role === 'admin' || 
            (user?.role === 'mentor' && record.mentor_id === parseInt(user.id))) && (
            <Popconfirm
              title="តើអ្នកពិតជាចង់លុបការចុះអប់រំនេះមែនទេ?"
              onConfirm={() => handleDelete(record.id)}
              okText="បាទ/ចាស"
              cancelText="ទេ"
            >
              <Button 
                size="small" 
                danger 
                icon={<DeleteOutlined />}
                title="លុប"
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
              <Title level={2}>ការចុះអប់រំ និងត្រួតពិនិត្យ</Title>
              <Text type="secondary">គ្រប់គ្រង និងតាមដានការចុះអប់រំពីអ្នកណែនាំ</Text>
            </Col>
            <Col>
              <Space>
                {(user?.role === 'admin' || user?.role === 'coordinator' || user?.role === 'mentor') && (
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                  >
                    នាំចេញ
                  </Button>
                )}
                
                {(user?.role === 'admin' || user?.role === 'coordinator' || user?.role === 'mentor') && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/mentoring/create')}
                  >
                    បង្កើតការចុះអប់រំថ្មី
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card bodyStyle={{ padding: '16px' }} style={{ marginBottom: '16px' }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={8}>
              <Input
                placeholder="ស្វែងរកការចុះអប់រំ..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
                size="large"
              />
            </Col>

            <Col xs={12} md={6}>
              <Select
                placeholder="ជ្រើសរើសសាលា"
                value={filters.pilot_school_id}
                onChange={(value) => handleFilterChange('pilot_school_id', value)}
                allowClear
                style={{ width: '100%' }}
                size="large"
              >
                {pilotSchools.map((school: any) => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={12} md={5}>
              <Select
                placeholder="ស្ថានភាព"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="scheduled">កំពុងដំណើរការ</Option>
                <Option value="completed">បានបញ្ចប់</Option>
                <Option value="cancelled">បានបោះបង់</Option>
              </Select>
            </Col>

            <Col xs={24} md={5}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['ចាប់ពី', 'ដល់']}
                size="large"
              />
            </Col>
          </Row>
        </Card>

        {/* Visits Table */}
        <Table
          columns={columns}
          dataSource={visits}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} visits`,
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

      {/* Photo Modal */}
      <Modal
        title="Visit Photos"
        open={photoModalVisible}
        onCancel={() => setPhotoModalVisible(false)}
        footer={null}
        width={800}
      >
        <Row gutter={16}>
          {selectedPhotos.map((photoUrl, index) => (
            <Col span={12} key={index} style={{ marginBottom: '16px' }}>
              <Image
                src={photoUrl}
                alt={`Visit photo ${index + 1}`}
                style={{ 
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
            </Col>
          ))}
        </Row>
      </Modal>
    </>
  );
}

export default function MentoringPage() {
  return (
    <HorizontalLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <MentoringContent />
      </Suspense>
    </HorizontalLayout>
  );
}