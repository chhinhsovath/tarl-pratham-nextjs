'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Tag,
  Progress,
  message,
  Select,
  Input
} from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Text } = Typography;
const { Option } = Select;

interface SchoolOverview {
  school_id: number;
  school_name: string;
  school_code: string;
  total_students: number;
  baseline_count: number;
  midline_count: number;
  endline_count: number;
  total_assessments: number;
  verified_count: number;
  mentoring_visits: number;
  has_mentor: boolean;
  mentor_name?: string;
}

interface SummaryStats {
  total_schools: number;
  total_students: number;
  schools_with_baseline: number;
  schools_with_midline: number;
  schools_with_endline: number;
  schools_with_verification: number;
  schools_with_mentoring: number;
  total_assessments: number;
}

function SchoolOverviewContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState<SchoolOverview[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/school-overview');
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      setData(result.schools || []);
      setSummary(result.summary || null);
    } catch (error) {
      console.error('Error fetching school overview:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/reports/school-overview/export');
      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `school-overview-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('Export បានជោគជ័យ');
    } catch (error) {
      message.error('Export បរាជ័យ');
    }
  };

  const filteredData = data.filter(school => {
    const matchesSearch = school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.school_code.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterType) {
      case 'with_baseline':
        return school.baseline_count > 0;
      case 'with_midline':
        return school.midline_count > 0;
      case 'with_endline':
        return school.endline_count > 0;
      case 'with_mentor':
        return school.has_mentor;
      case 'no_assessments':
        return school.total_assessments === 0;
      default:
        return true;
    }
  });

  const columns = [
    {
      title: 'សាលារៀន',
      key: 'school',
      fixed: 'left' as const,
      width: 200,
      render: (record: SchoolOverview) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.school_name}</div>
          <Tag color="blue">{record.school_code}</Tag>
        </div>
      )
    },
    {
      title: 'សិស្សសរុប',
      dataIndex: 'total_students',
      key: 'total_students',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Statistic
          value={count}
          valueStyle={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}
        />
      )
    },
    {
      title: 'Baseline',
      dataIndex: 'baseline_count',
      key: 'baseline_count',
      width: 120,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: count > 0 ? '#52c41a' : '#ccc' }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#1890ff"
            />
          )}
        </div>
      )
    },
    {
      title: 'Midline',
      dataIndex: 'midline_count',
      key: 'midline_count',
      width: 120,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: count > 0 ? '#faad14' : '#ccc' }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#fa8c16"
            />
          )}
        </div>
      )
    },
    {
      title: 'Endline',
      dataIndex: 'endline_count',
      key: 'endline_count',
      width: 120,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div>
          <div style={{ fontSize: 18, fontWeight: 'bold', color: count > 0 ? '#52c41a' : '#ccc' }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#52c41a"
            />
          )}
        </div>
      )
    },
    {
      title: 'ការវាយតម្លៃសរុប',
      dataIndex: 'total_assessments',
      key: 'total_assessments',
      width: 120,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'} style={{ fontSize: 14 }}>
          {count}
        </Tag>
      )
    },
    {
      title: 'ផ្ទៀងផ្ទាត់',
      dataIndex: 'verified_count',
      key: 'verified_count',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'purple' : 'default'} style={{ fontSize: 14 }}>
          {count}
        </Tag>
      )
    },
    {
      title: 'ការណែនាំ/សង្កេត',
      dataIndex: 'mentoring_visits',
      key: 'mentoring_visits',
      width: 120,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'cyan' : 'default'} style={{ fontSize: 14 }}>
          {count} ដង
        </Tag>
      )
    },
    {
      title: 'អ្នកណែនាំ',
      key: 'mentor',
      width: 150,
      render: (record: SchoolOverview) => (
        record.has_mentor ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            {record.mentor_name || 'មាន'}
          </Tag>
        ) : (
          <Tag color="red">មិនមាន</Tag>
        )
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (record: SchoolOverview) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => router.push(`/schools/${record.school_id}`)}
          >
            មើល
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>របាយការណ៍ទូទៅសាលារៀន</Title>
        <Text type="secondary">ទិដ្ឋភាពទូទៅនៃសាលារៀន សិស្ស ការវាយតម្លៃ និងការណែនាំ</Text>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សាលារៀនសរុប"
                value={summary.total_schools}
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={summary.total_students}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ការវាយតម្លៃសរុប"
                value={summary.total_assessments}
                prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សាលាមានអ្នកណែនាំ"
                value={summary.schools_with_mentoring}
                suffix={`/ ${summary.total_schools}`}
                prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Assessment Coverage */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមាន Baseline"
                value={summary.schools_with_baseline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_baseline / summary.total_schools) * 100)}
                strokeColor="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមាន Midline"
                value={summary.schools_with_midline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#fa8c16' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_midline / summary.total_schools) * 100)}
                strokeColor="#fa8c16"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមាន Endline"
                value={summary.schools_with_endline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_endline / summary.total_schools) * 100)}
                strokeColor="#52c41a"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input
              placeholder="ស្វែងរកសាលារៀន..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 200 }}
            >
              <Option value="all">ទាំងអស់</Option>
              <Option value="with_baseline">មាន Baseline</Option>
              <Option value="with_midline">មាន Midline</Option>
              <Option value="with_endline">មាន Endline</Option>
              <Option value="with_mentor">មានអ្នកណែនាំ</Option>
              <Option value="no_assessments">គ្មានការវាយតម្លៃ</Option>
            </Select>
          </Space>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            Export Excel
          </Button>
        </Space>
      </Card>

      {/* Data Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="school_id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total} សាលារៀន`
          }}
        />
      </Card>
    </>
  );
}

export default function SchoolOverviewPage() {
  return (
    <HorizontalLayout>
      <SchoolOverviewContent />
    </HorizontalLayout>
  );
}
