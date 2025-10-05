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
  LineChartOutlined,
  TrophyOutlined,
  SearchOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProgressTracking {
  student_id: number;
  student_name: string;
  gender: string;
  school: string;
  language_progress: {
    trend: string;
    improvement: number;
  };
  math_progress: {
    trend: string;
    improvement: number;
  };
  latest_language_level: string | null;
  latest_math_level: string | null;
  assessment_count: number;
}

export default function ProgressTrackingPage() {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [progressData, setProgressData] = useState<ProgressTracking[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    improving: 0,
    stable: 0,
    insufficient: 0
  });

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?type=student-performance');
      const result = await response.json();

      if (result.data) {
        const students = result.data.student_performance || [];
        setProgressData(students);

        // Extract unique schools
        const uniqueSchools = [...new Set(students.map((s: any) => s.school).filter(Boolean))];
        setSchools(uniqueSchools);

        // Calculate statistics
        const totalStudents = students.length;
        const improving = students.filter((s: any) =>
          s.language_progress?.trend === 'improving' || s.math_progress?.trend === 'improving'
        ).length;
        const stable = students.filter((s: any) =>
          s.language_progress?.trend === 'stable' || s.math_progress?.trend === 'stable'
        ).length;
        const insufficient = students.filter((s: any) =>
          s.language_progress?.trend === 'insufficient_data' && s.math_progress?.trend === 'insufficient_data'
        ).length;

        setStats({
          totalStudents,
          improving,
          stable,
          insufficient
        });
      }
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'green';
    if (trend === 'declining') return 'red';
    if (trend === 'stable') return 'orange';
    return 'default';
  };

  const getTrendText = (trend: string) => {
    const texts: any = {
      improving: 'កំពុងកែលម្អ',
      stable: 'មានស្ថេរភាព',
      declining: 'កំពុងធ្លាក់ចុះ',
      insufficient_data: 'មិនគ្រប់គ្រាន់'
    };
    return texts[trend] || trend;
  };

  const getLevelText = (level: string | null) => {
    if (!level) return '-';
    const levels: any = {
      'beginner': 'ដំបូង',
      'letter': 'អក្សរ',
      'word': 'ពាក្យ',
      'paragraph': 'កថាខណ្ឌ',
      'story': 'រឿង',
      'comprehension1': 'ការយល់ដឹង១',
      'comprehension2': 'ការយល់ដឹង២'
    };
    return levels[level] || level;
  };

  const columns: ColumnsType<ProgressTracking> = [
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (text: string, record) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.gender === 'female' ? 'ស្រី' : record.gender === 'male' ? 'ប្រុស' : '-'}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school',
      key: 'school',
      render: (school: string) => (
        <Text style={{ fontSize: '13px' }}>{school}</Text>
      ),
    },
    {
      title: 'វឌ្ឍនភាពភាសា',
      key: 'language_progress',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getTrendColor(record.language_progress?.trend || 'insufficient_data')}>
            {getTrendText(record.language_progress?.trend || 'insufficient_data')}
          </Tag>
          <Text style={{ fontSize: '12px' }}>
            កម្រិត: {getLevelText(record.latest_language_level)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'វឌ្ឍនភាពគណិត',
      key: 'math_progress',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getTrendColor(record.math_progress?.trend || 'insufficient_data')}>
            {getTrendText(record.math_progress?.trend || 'insufficient_data')}
          </Tag>
          <Text style={{ fontSize: '12px' }}>
            កម្រិត: {getLevelText(record.latest_math_level)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'ចំនួនការវាយតម្លៃ',
      dataIndex: 'assessment_count',
      key: 'assessment_count',
      align: 'center',
      render: (count: number) => (
        <Tag color={count >= 2 ? 'blue' : 'orange'}>
          {count} ការវាយតម្លៃ
        </Tag>
      ),
      sorter: (a, b) => a.assessment_count - b.assessment_count,
    }
  ];

  const filteredData = progressData.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         (item.school && item.school.toLowerCase().includes(searchText.toLowerCase()));
    const matchesSchool = !selectedSchool || item.school === selectedSchool;

    return matchesSearch && matchesSchool;
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
            តាមដានវឌ្ឍនភាព
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>តាមដានវឌ្ឍនភាព</Title>
          <Text type="secondary">តាមដានវឌ្ឍនភាពសិស្សតាមរយៈពេល</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={stats.totalStudents}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="កំពុងកែលម្អ"
                value={stats.improving}
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="មានស្ថេរភាព"
                value={stats.stable}
                prefix={<LineChartOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="មិនគ្រប់គ្រាន់"
                value={stats.insufficient}
                prefix={<LineChartOutlined style={{ color: '#999' }} />}
                valueStyle={{ color: '#999' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរកសិស្ស ឬ សាលារៀន..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="សាលារៀន"
                style={{ width: '100%' }}
                value={selectedSchool}
                onChange={setSelectedSchool}
                allowClear
              >
                {schools.map(school => (
                  <Option key={school} value={school}>{school}</Option>
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

        {/* Progress Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="student_id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ពី ${total} សិស្ស`,
            }}
          />
        </Card>
      </div>
    </HorizontalLayout>
  );
}
