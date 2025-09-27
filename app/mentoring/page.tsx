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
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function MentoringPage() {
  const router = useRouter();
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

  // Check permissions
  if (!hasPermission(user, 'mentoring.view')) {
    router.push('/unauthorized');
    return null;
  }

  useEffect(() => {
    fetchPilotSchools();
    fetchVisits();
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [filters, pagination.current, pagination.pageSize]);

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setPilotSchools(data.schools || []);
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
        setVisits(data.visits || []);
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
      title: 'School',
      dataIndex: 'pilot_school',
      key: 'pilot_school',
      render: (school: any) => (
        <div>
          <strong>{school?.name}</strong>
          <br />
          <Text type="secondary">{school?.code}</Text>
        </div>
      )
    },
    {
      title: 'Visit Date',
      dataIndex: 'visit_date',
      key: 'visit_date',
      width: 120,
      render: (date: string) => (
        <div>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {dayjs(date).format('MMM DD, YYYY')}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: string) => level || '-'
    },
    {
      title: 'Participants',
      dataIndex: 'participants_count',
      key: 'participants_count',
      width: 100,
      render: (count: number) => (
        <div>
          <TeamOutlined style={{ marginRight: 8 }} />
          {count || '-'}
        </div>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      width: 100,
      render: (minutes: number) => (
        <div>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {minutes ? `${minutes}m` : '-'}
        </div>
      )
    },
    {
      title: 'Mentor',
      dataIndex: 'mentor',
      key: 'mentor',
      render: (mentor: any) => (
        <div>
          <strong>{mentor?.name}</strong>
          <br />
          <Tag size="small" color="orange">Mentor</Tag>
        </div>
      )
    },
    {
      title: 'Photos',
      dataIndex: 'photos',
      key: 'photos',
      width: 80,
      render: (photos: string[]) => (
        photos && photos.length > 0 ? (
          <Button 
            size="small" 
            onClick={() => showPhotos(photos)}
          >
            {photos.length} photo{photos.length !== 1 ? 's' : ''}
          </Button>
        ) : '-'
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (record: any) => (
        <Space size="small">
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => router.push(`/mentoring/${record.id}`)}
          >
            View
          </Button>
          
          {hasPermission(user, 'mentoring.edit') && (
            <Button 
              size="small" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/mentoring/${record.id}/edit`)}
            />
          )}
          
          {hasPermission(user, 'mentoring.delete') && (
            <Popconfirm
              title="Are you sure you want to delete this visit?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
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
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2}>Mentoring Visits</Title>
            </Col>
            <Col>
              <Space>
                {hasPermission(user, 'mentoring.export') && (
                  <Button 
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                )}
                
                {hasPermission(user, 'mentoring.create') && (
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/mentoring/create')}
                  >
                    Schedule Visit
                  </Button>
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
                placeholder="Search visits..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
              />
            </Col>
            
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
            
            <Col span={4}>
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="scheduled">Scheduled</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
              </Select>
            </Col>
            
            <Col span={8}>
              <RangePicker
                style={{ width: '100%' }}
                onChange={handleDateRangeChange}
                placeholder={['Start Date', 'End Date']}
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
    </div>
  );
}