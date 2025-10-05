'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  Button,
  Space,
  Typography,
  Tag,
  Breadcrumb,
  Input
} from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  SearchOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface SchoolComparison {
  pilot_school_id: number;
  school_name: string;
  province: string;
  total_students: number;
  mentor_count: number;
  mentoring_visits: number;
  completed_visits: number;
}

export default function SchoolComparisonPage() {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [schoolData, setSchoolData] = useState<SchoolComparison[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    schoolsWithStudents: 0,
    schoolsWithMentors: 0
  });

  useEffect(() => {
    fetchSchoolData();
  }, []);

  const fetchSchoolData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?type=school-statistics');
      const result = await response.json();

      if (result.data) {
        const pilotSchools = result.data.pilot_schools || [];
        setSchoolData(pilotSchools);

        // Extract unique provinces
        const uniqueProvinces = [...new Set(pilotSchools.map((s: any) => s.province).filter(Boolean))];
        setProvinces(uniqueProvinces);

        // Calculate statistics
        const totalSchools = pilotSchools.length;
        const totalStudents = pilotSchools.reduce((sum: number, s: any) => sum + s.total_students, 0);
        const withStudents = pilotSchools.filter((s: any) => s.total_students > 0).length;
        const withMentors = pilotSchools.filter((s: any) => s.mentor_count > 0).length;

        setStats({
          totalSchools,
          totalStudents,
          schoolsWithStudents: withStudents,
          schoolsWithMentors: withMentors
        });
      }
    } catch (error) {
      console.error('Failed to fetch school data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<SchoolComparison> = [
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (text: string, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <BankOutlined style={{ color: '#1890ff' }} />
            <Text strong>{text}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.province || '-'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'ចំនួនសិស្ស',
      dataIndex: 'total_students',
      key: 'total_students',
      align: 'center',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>
          <TeamOutlined /> {count} សិស្ស
        </Tag>
      ),
      sorter: (a, b) => a.total_students - b.total_students,
    },
    {
      title: 'ចំនួន Mentor',
      dataIndex: 'mentor_count',
      key: 'mentor_count',
      align: 'center',
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'}>
          {count} mentors
        </Tag>
      ),
      sorter: (a, b) => a.mentor_count - b.mentor_count,
    },
    {
      title: 'ការណែនាំសរុប',
      dataIndex: 'mentoring_visits',
      key: 'mentoring_visits',
      align: 'center',
      render: (count: number) => (
        <Text>{count}</Text>
      ),
      sorter: (a, b) => a.mentoring_visits - b.mentoring_visits,
    },
    {
      title: 'ការណែនាំបញ្ចប់',
      dataIndex: 'completed_visits',
      key: 'completed_visits',
      align: 'center',
      render: (count: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color={count > 0 ? 'green' : 'default'}>
            {count} / {record.mentoring_visits}
          </Tag>
          {record.mentoring_visits > 0 && (
            <Text style={{ fontSize: '11px' }}>
              {Math.round((count / record.mentoring_visits) * 100)}%
            </Text>
          )}
        </Space>
      ),
      sorter: (a, b) => a.completed_visits - b.completed_visits,
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      render: (_, record) => {
        const hasStudents = record.total_students > 0;
        const hasMentors = record.mentor_count > 0;

        if (hasStudents && hasMentors) {
          return <Tag color="green">សកម្ម</Tag>;
        } else if (hasStudents || hasMentors) {
          return <Tag color="orange">សកម្មផ្នែក</Tag>;
        } else {
          return <Tag color="default">មិនទាន់ប្រើប្រាស់</Tag>;
        }
      },
    }
  ];

  const filteredData = schoolData.filter(item => {
    const matchesSearch = item.school_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesProvince = !selectedProvince || item.province === selectedProvince;

    return matchesSearch && matchesProvince;
  });

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <Breadcrumb.Item>
            <HomeOutlined /> ទំព័រដើម
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <BarChartOutlined /> របាយការណ៍
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            ប្រៀបធៀបសាលា
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>ប្រៀបធៀបសាលារៀន</Title>
          <Text type="secondary">ប្រៀបធៀបលទ្ធផលរវាងសាលារៀនទាំងអស់</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលារៀនសរុប"
                value={stats.totalSchools}
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={stats.totalStudents}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលាមានសិស្ស"
                value={stats.schoolsWithStudents}
                prefix={<BankOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលាមាន Mentor"
                value={stats.schoolsWithMentors}
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរកសាលារៀន..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="ខេត្ត"
                style={{ width: '100%' }}
                value={selectedProvince}
                onChange={setSelectedProvince}
                allowClear
              >
                {provinces.map(province => (
                  <Option key={province} value={province}>{province}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Comparison Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="pilot_school_id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ពី ${total} សាលារៀន`,
            }}
          />
        </Card>
      </div>
    </HorizontalLayout>
  );
}
