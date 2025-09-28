'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  Progress,
  Breadcrumb,
  Tabs,
  Input,
  Badge
} from 'antd';
import {
  BankOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  TeamOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface SchoolComparison {
  id: number;
  school_name: string;
  district: string;
  province: string;
  total_students: number;
  total_teachers: number;
  average_baseline: number;
  average_midline: number;
  average_endline: number;
  improvement_rate: number;
  performance_rank: number;
  subjects: {
    math_avg: number;
    khmer_avg: number;
  };
  status: 'excellent' | 'good' | 'average' | 'needs_support';
}

export default function SchoolComparisonPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortBy, setSortBy] = useState('performance_rank');

  // Mock data for school comparison
  const [schoolData, setSchoolData] = useState<SchoolComparison[]>([
    {
      id: 1,
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      district: 'ដូនពេញ',
      province: 'ភ្នំពេញ',
      total_students: 245,
      total_teachers: 12,
      average_baseline: 52.3,
      average_midline: 68.7,
      average_endline: 78.4,
      improvement_rate: 49.9,
      performance_rank: 1,
      subjects: {
        math_avg: 76.2,
        khmer_avg: 80.6
      },
      status: 'excellent'
    },
    {
      id: 2,
      school_name: 'សាលាបឋមសិក្សាកំពត',
      district: 'កំពត',
      province: 'កំពត',
      total_students: 189,
      total_teachers: 8,
      average_baseline: 48.7,
      average_midline: 62.1,
      average_endline: 72.3,
      improvement_rate: 48.5,
      performance_rank: 2,
      subjects: {
        math_avg: 70.1,
        khmer_avg: 74.5
      },
      status: 'excellent'
    },
    {
      id: 3,
      school_name: 'សាលាបឋមសិក្សាសៀមរាប',
      district: 'សៀមរាប',
      province: 'សៀមរាប',
      total_students: 312,
      total_teachers: 15,
      average_baseline: 45.2,
      average_midline: 58.9,
      average_endline: 68.7,
      improvement_rate: 52.0,
      performance_rank: 3,
      subjects: {
        math_avg: 65.4,
        khmer_avg: 71.9
      },
      status: 'good'
    },
    {
      id: 4,
      school_name: 'សាលាបឋមសិក្សាបាត់ដំបង',
      district: 'បាត់ដំបង',
      province: 'បាត់ដំបង',
      total_students: 178,
      total_teachers: 9,
      average_baseline: 41.8,
      average_midline: 53.2,
      average_endline: 61.7,
      improvement_rate: 47.6,
      performance_rank: 4,
      subjects: {
        math_avg: 58.9,
        khmer_avg: 64.5
      },
      status: 'average'
    },
    {
      id: 5,
      school_name: 'សាលាបឋមសិក្សាកណ្តាល',
      district: 'កណ្តាល',
      province: 'កណ្តាល',
      total_students: 156,
      total_teachers: 7,
      average_baseline: 39.4,
      average_midline: 48.1,
      average_endline: 55.3,
      improvement_rate: 40.4,
      performance_rank: 5,
      subjects: {
        math_avg: 52.7,
        khmer_avg: 57.9
      },
      status: 'needs_support'
    }
  ]);

  // Overall statistics
  const [stats, setStats] = useState({
    totalSchools: 24,
    averageImprovement: 47.7,
    topPerformers: 8,
    needsSupport: 3
  });

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'green',
      good: 'blue',
      average: 'orange',
      needs_support: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      excellent: 'ល្អបំផុត',
      good: 'ល្អ',
      average: 'មធ្យម',
      needs_support: 'ត្រូវការជំនួយ'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge count="🥇" style={{ backgroundColor: '#gold' }} />;
    if (rank === 2) return <Badge count="🥈" style={{ backgroundColor: '#silver' }} />;
    if (rank === 3) return <Badge count="🥉" style={{ backgroundColor: '#bronze' }} />;
    return <Badge count={rank} style={{ backgroundColor: '#87d068' }} />;
  };

  const columns: ColumnsType<SchoolComparison> = [
    {
      title: 'ចំណាត់ថ្នាក់',
      dataIndex: 'performance_rank',
      key: 'performance_rank',
      width: 80,
      align: 'center',
      render: (rank: number) => getRankBadge(rank),
      sorter: (a, b) => a.performance_rank - b.performance_rank,
    },
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
            {record.district}, {record.province}
          </Text>
        </Space>
      ),
    },
    {
      title: 'សិស្ស/គ្រូ',
      key: 'student_teacher',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '13px' }}>
            <TeamOutlined /> {record.total_students} សិស្ស
          </Text>
          <Text style={{ fontSize: '13px' }}>
            <TrophyOutlined /> {record.total_teachers} គ្រូ
          </Text>
        </Space>
      ),
    },
    {
      title: 'ពិន្ទុដំបូង',
      dataIndex: 'average_baseline',
      key: 'average_baseline',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.average_baseline - b.average_baseline,
    },
    {
      title: 'ពិន្ទុកណ្តាល',
      dataIndex: 'average_midline',
      key: 'average_midline',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.average_midline - b.average_midline,
    },
    {
      title: 'ពិន្ទុចុងក្រោយ',
      dataIndex: 'average_endline',
      key: 'average_endline',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.average_endline - b.average_endline,
    },
    {
      title: 'ការកែលម្អ',
      dataIndex: 'improvement_rate',
      key: 'improvement_rate',
      align: 'center',
      render: (rate: number) => (
        <Space direction="vertical" size="small">
          <Progress 
            percent={Math.min(rate, 100)} 
            size="small"
            strokeColor={rate > 45 ? '#52c41a' : rate > 30 ? '#faad14' : '#f5222d'}
          />
          <Space>
            {rate > 40 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#f5222d' }} />}
            <Text style={{ fontSize: '11px' }}>+{rate.toFixed(1)}%</Text>
          </Space>
        </Space>
      ),
      sorter: (a, b) => a.improvement_rate - b.improvement_rate,
    },
    {
      title: 'មុខវិជ្ជា',
      key: 'subjects',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            គណិត: <Tag size="small" color="blue">{record.subjects.math_avg.toFixed(1)}%</Tag>
          </Text>
          <Text style={{ fontSize: '12px' }}>
            ខ្មែរ: <Tag size="small" color="green">{record.subjects.khmer_avg.toFixed(1)}%</Tag>
          </Text>
        </Space>
      ),
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    }
  ];

  const filteredData = schoolData.filter(item => {
    const matchesSearch = item.school_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.district.toLowerCase().includes(searchText.toLowerCase());
    const matchesProvince = !selectedProvince || item.province === selectedProvince;
    const matchesDistrict = !selectedDistrict || item.district === selectedDistrict;
    
    return matchesSearch && matchesProvince && matchesDistrict;
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
          <Text type="secondary">ប្រៀបធៀបលទ្ធផលរវាងសាលារៀនទាំងអស់ និងការវិវត្តរបស់ពួកគេ</Text>
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
                title="ការកែលម្អមធ្យម"
                value={stats.averageImprovement}
                suffix="%"
                prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលាល្អបំផុត"
                value={stats.topPerformers}
                prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ត្រូវការជំនួយ"
                value={stats.needsSupport}
                prefix={<TeamOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="ស្វែងរកសាលារៀន..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="ខេត្ត"
                style={{ width: '100%' }}
                value={selectedProvince}
                onChange={setSelectedProvince}
                allowClear
              >
                <Option value="ភ្នំពេញ">ភ្នំពេញ</Option>
                <Option value="កំពត">កំពត</Option>
                <Option value="សៀមរាប">សៀមរាប</Option>
                <Option value="បាត់ដំបង">បាត់ដំបង</Option>
                <Option value="កណ្តាល">កណ្តាល</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="ស្រុក"
                style={{ width: '100%' }}
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                allowClear
              >
                <Option value="ដូនពេញ">ដូនពេញ</Option>
                <Option value="កំពត">កំពត</Option>
                <Option value="សៀមរាប">សៀមរាប</Option>
                <Option value="បាត់ដំបង">បាត់ដំបង</Option>
                <Option value="កណ្តាល">កណ្តាល</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="តម្រៀបតាម"
                style={{ width: '100%' }}
                value={sortBy}
                onChange={setSortBy}
              >
                <Option value="performance_rank">ចំណាត់ថ្នាក់</Option>
                <Option value="improvement_rate">ការកែលម្អ</Option>
                <Option value="average_endline">ពិន្ទុចុងក្រោយ</Option>
                <Option value="total_students">ចំនួនសិស្ស</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Comparison Table */}
        <Card>
          <Tabs defaultActiveKey="comparison">
            <TabPane tab="ប្រៀបធៀបលម្អិត" key="comparison">
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="id"
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
            </TabPane>
            <TabPane tab="សង្ខេបតាមខេត្ត" key="province-summary">
              <div className="p-4">
                <Row gutter={16}>
                  <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                      <Statistic
                        title="ភ្នំពេញ - ពិន្ទុមធ្យម"
                        value={78.4}
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                      <Statistic
                        title="កំពត - ពិន្ទុមធ្យម"
                        value={72.3}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                      <Statistic
                        title="សៀមរាប - ពិន្ទុមធ្យម"
                        value={68.7}
                        suffix="%"
                        valueStyle={{ color: '#faad14' }}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </HorizontalLayout>
  );
}