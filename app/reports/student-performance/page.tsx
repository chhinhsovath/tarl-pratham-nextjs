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
  Breadcrumb,
  Input
} from 'antd';
import {
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  SearchOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface StudentPerformance {
  student_id: number;
  student_name: string;
  gender: string;
  school: string;
  latest_language_level: string | null;
  latest_math_level: string | null;
  assessment_count: number;
  language_progress: {
    trend: string;
    improvement: number;
  };
  math_progress: {
    trend: string;
    improvement: number;
  };
}

export default function StudentPerformancePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    studentsWithAssessments: 0,
    femaleStudents: 0,
    maleStudents: 0
  });
  const [schools, setSchools] = useState<string[]>([]);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reports?type=student-performance');
      const result = await response.json();

      if (result.data) {
        const students = result.data.student_performance || [];
        setPerformanceData(students);

        // Extract unique schools
        const uniqueSchools = [...new Set(students.map((s: any) => s.school).filter((s: string) => s && s !== '-'))];
        setSchools(uniqueSchools);

        // Calculate statistics
        const totalStudents = students.length;
        const withAssessments = students.filter((s: any) => s.assessment_count > 0).length;
        const female = students.filter((s: any) => s.gender === 'female').length;
        const male = students.filter((s: any) => s.gender === 'male').length;

        setStats({
          totalStudents,
          studentsWithAssessments: withAssessments,
          femaleStudents: female,
          maleStudents: male
        });
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (count: number) => {
    return count > 0 ? 'green' : 'orange';
  };

  const getStatusText = (count: number) => {
    return count > 0 ? 'មានការវាយតម្លៃ' : 'មិនទាន់វាយតម្លៃ';
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

  const columns: ColumnsType<StudentPerformance> = [
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
      title: 'កម្រិតភាសា',
      dataIndex: 'latest_language_level',
      key: 'latest_language_level',
      align: 'center',
      render: (level: string | null) => (
        <Tag color={level ? 'blue' : 'default'}>
          {getLevelText(level)}
        </Tag>
      ),
    },
    {
      title: 'កម្រិតគណិត',
      dataIndex: 'latest_math_level',
      key: 'latest_math_level',
      align: 'center',
      render: (level: string | null) => (
        <Tag color={level ? 'green' : 'default'}>
          {getLevelText(level)}
        </Tag>
      ),
    },
    {
      title: 'ចំនួនការវាយតម្លៃ',
      dataIndex: 'assessment_count',
      key: 'assessment_count',
      align: 'center',
      render: (count: number) => (
        <Text strong>{count}</Text>
      ),
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'assessment_count',
      key: 'status',
      render: (count: number) => (
        <Tag color={getStatusColor(count)}>
          {getStatusText(count)}
        </Tag>
      ),
    }
  ];

  const filteredData = performanceData.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school.toLowerCase().includes(searchText.toLowerCase());
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
            លទ្ធផលសិស្ស
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>លទ្ធផលសិស្ស</Title>
          <Text type="secondary">មើលលទ្ធផលវាយតម្លៃរបស់សិស្សគ្រប់រូប និងការវិវត្តទាំងអស់</Text>
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
                title="មានការវាយតម្លៃ"
                value={stats.studentsWithAssessments}
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សស្រី"
                value={stats.femaleStudents}
                prefix={<BookOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សប្រុស"
                value={stats.maleStudents}
                prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
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

        {/* Performance Table */}
        <Card>
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
                `${range[0]}-${range[1]} ពី ${total} សិស្ស`,
            }}
          />
        </Card>
      </div>
    </HorizontalLayout>
  );
}