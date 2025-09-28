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
  DatePicker,
  Line
} from 'antd';
import {
  LineChartOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface ProgressTracking {
  id: number;
  student_name: string;
  school_name: string;
  grade: string;
  subject: string;
  baseline_date: string;
  baseline_score: number;
  midline_date: string;
  midline_score: number;
  endline_date: string;
  endline_score: number;
  current_level: string;
  progress_trend: 'improving' | 'stable' | 'declining';
  days_in_program: number;
  weekly_progress: number[];
  target_score: number;
  achievement_rate: number;
}

interface TimelineData {
  month: string;
  baseline: number;
  midline: number;
  endline: number;
  target: number;
}

export default function ProgressTrackingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);

  // Mock data for progress tracking
  const [progressData, setProgressData] = useState<ProgressTracking[]>([
    {
      id: 1,
      student_name: 'ម៉ាលីកា ច័ន្ទ',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      grade: 'ថ្នាក់ទី៤',
      subject: 'គណិតវិទ្យា',
      baseline_date: '2023-09-15',
      baseline_score: 45,
      midline_date: '2023-12-15',
      midline_score: 62,
      endline_date: '2024-03-15',
      endline_score: 78,
      current_level: 'កម្រិតខ្ពស់',
      progress_trend: 'improving',
      days_in_program: 182,
      weekly_progress: [45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78],
      target_score: 75,
      achievement_rate: 104.0
    },
    {
      id: 2,
      student_name: 'រតនា គឹម',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      grade: 'ថ្នាក់ទី៥',
      subject: 'ភាសាខ្មែរ',
      baseline_date: '2023-09-15',
      baseline_score: 38,
      midline_date: '2023-12-15',
      midline_score: 55,
      endline_date: '2024-03-15',
      endline_score: 72,
      current_level: 'កម្រិតមធ្យម',
      progress_trend: 'improving',
      days_in_program: 182,
      weekly_progress: [38, 42, 46, 49, 52, 55, 58, 62, 66, 69, 72],
      target_score: 70,
      achievement_rate: 102.9
    },
    {
      id: 3,
      student_name: 'សុវណ្ណ ហុង',
      school_name: 'សាលាបឋមសិក្សាសៀមរាប',
      grade: 'ថ្នាក់ទី៤',
      subject: 'គណិតវិទ្យា',
      baseline_date: '2023-09-15',
      baseline_score: 52,
      midline_date: '2023-12-15',
      midline_score: 58,
      endline_date: '2024-03-15',
      endline_score: 65,
      current_level: 'កម្រិតមធ្យម',
      progress_trend: 'stable',
      days_in_program: 182,
      weekly_progress: [52, 53, 55, 56, 57, 58, 59, 61, 62, 64, 65],
      target_score: 70,
      achievement_rate: 92.9
    },
    {
      id: 4,
      student_name: 'ញាត្តា ស៊ុន',
      school_name: 'សាលាបឋមសិក្សាបាត់ដំបង',
      grade: 'ថ្នាក់ទី៥',
      subject: 'ភាសាខ្មែរ',
      baseline_date: '2023-09-15',
      baseline_score: 41,
      midline_date: '2023-12-15',
      midline_score: 48,
      endline_date: '2024-03-15',
      endline_score: 53,
      current_level: 'កម្រិតទាប',
      progress_trend: 'stable',
      days_in_program: 182,
      weekly_progress: [41, 42, 44, 45, 46, 48, 49, 50, 51, 52, 53],
      target_score: 65,
      achievement_rate: 81.5
    }
  ]);

  // Timeline data for charts
  const [timelineData, setTimelineData] = useState<TimelineData[]>([
    { month: 'កញ្ញា', baseline: 44.2, midline: 0, endline: 0, target: 70 },
    { month: 'តុលា', baseline: 44.2, midline: 0, endline: 0, target: 70 },
    { month: 'វិច្ឆិកា', baseline: 44.2, midline: 0, endline: 0, target: 70 },
    { month: 'ធ្នូ', baseline: 44.2, midline: 55.8, endline: 0, target: 70 },
    { month: 'មករា', baseline: 44.2, midline: 55.8, endline: 0, target: 70 },
    { month: 'កុម្ភៈ', baseline: 44.2, midline: 55.8, endline: 0, target: 70 },
    { month: 'មីនា', baseline: 44.2, midline: 55.8, endline: 67.0, target: 70 }
  ]);

  // Overall statistics
  const [stats, setStats] = useState({
    totalStudents: 1248,
    averageProgress: 67.2,
    onTrackStudents: 892,
    needsSupport: 156
  });

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <RiseOutlined style={{ color: '#52c41a' }} />;
    if (trend === 'declining') return <FallOutlined style={{ color: '#f5222d' }} />;
    return <LineChartOutlined style={{ color: '#faad14' }} />;
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return 'green';
    if (trend === 'declining') return 'red';
    return 'orange';
  };

  const getTrendText = (trend: string) => {
    const texts = {
      improving: 'កំពុងកែលម្អ',
      stable: 'មានស្ថេរភាព',
      declining: 'កំពុងធ្លាក់ចុះ'
    };
    return texts[trend as keyof typeof texts] || trend;
  };

  const getLevelColor = (level: string) => {
    if (level === 'កម្រិតខ្ពស់') return 'green';
    if (level === 'កម្រិតមធ្យម') return 'blue';
    if (level === 'កម្រិតទាប') return 'orange';
    return 'default';
  };

  const columns: ColumnsType<ProgressTracking> = [
    {
      title: 'សិស្ស',
      dataIndex: 'student_name',
      key: 'student_name',
      render: (text: string, record) => (
        <Space>
          <UserOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.grade} - {record.subject}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (school: string) => (
        <Text style={{ fontSize: '13px' }}>{school}</Text>
      ),
    },
    {
      title: 'ពិន្ទុដំបូង',
      dataIndex: 'baseline_score',
      key: 'baseline_score',
      align: 'center',
      render: (score: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
            {score}%
          </Tag>
          <Text style={{ fontSize: '11px' }}>
            {dayjs(record.baseline_date).format('DD/MM')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'ពិន្ទុកណ្តាល',
      dataIndex: 'midline_score',
      key: 'midline_score',
      align: 'center',
      render: (score: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
            {score}%
          </Tag>
          <Text style={{ fontSize: '11px' }}>
            {dayjs(record.midline_date).format('DD/MM')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'ពិន្ទុចុងក្រោយ',
      dataIndex: 'endline_score',
      key: 'endline_score',
      align: 'center',
      render: (score: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
            {score}%
          </Tag>
          <Text style={{ fontSize: '11px' }}>
            {dayjs(record.endline_date).format('DD/MM')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'វឌ្ឍនភាព',
      key: 'progress',
      align: 'center',
      render: (_, record) => {
        const totalProgress = record.endline_score - record.baseline_score;
        return (
          <Space direction="vertical" size="small">
            <Progress 
              percent={Math.min(totalProgress, 100)} 
              size="small"
              strokeColor={totalProgress > 25 ? '#52c41a' : totalProgress > 10 ? '#faad14' : '#f5222d'}
            />
            <Text style={{ fontSize: '11px' }}>
              +{totalProgress.toFixed(1)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'កម្រិតបច្ចុប្បន្ន',
      dataIndex: 'current_level',
      key: 'current_level',
      render: (level: string) => (
        <Tag color={getLevelColor(level)}>
          {level}
        </Tag>
      ),
    },
    {
      title: 'ទំនោរ',
      dataIndex: 'progress_trend',
      key: 'progress_trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Tag color={getTrendColor(trend)}>
            {getTrendText(trend)}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'ការសម្រេច',
      dataIndex: 'achievement_rate',
      key: 'achievement_rate',
      align: 'center',
      render: (rate: number) => (
        <Tag color={rate >= 100 ? 'green' : rate >= 80 ? 'blue' : rate >= 60 ? 'orange' : 'red'}>
          {rate.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.achievement_rate - b.achievement_rate,
    },
    {
      title: 'ថ្ងៃក្នុងកម្មវិធី',
      dataIndex: 'days_in_program',
      key: 'days_in_program',
      align: 'center',
      render: (days: number) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{days} ថ្ងៃ</Text>
        </Space>
      ),
    }
  ];

  const filteredData = progressData.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSchool = !selectedSchool || item.school_name === selectedSchool;
    const matchesGrade = !selectedGrade || item.grade === selectedGrade;
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    
    return matchesSearch && matchesSchool && matchesGrade && matchesSubject;
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
          <Text type="secondary">តាមដានវឌ្ឍនភាពសិក្សារបស់សិស្សតាមរយៈពេលវេលា</Text>
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
                title="វឌ្ឍនភាពមធ្យម"
                value={stats.averageProgress}
                suffix="%"
                prefix={<RiseOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សតាមគោលដៅ"
                value={stats.onTrackStudents}
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
                prefix={<CalendarOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={5}>
              <Input
                placeholder="ស្វែងរកសិស្ស..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="សាលារៀន"
                style={{ width: '100%' }}
                value={selectedSchool}
                onChange={setSelectedSchool}
                allowClear
              >
                <Option value="សាលាបឋមសិក្សាភ្នំពេញ">សាលាបឋមសិក្សាភ្នំពេញ</Option>
                <Option value="សាលាបឋមសិក្សាកំពត">សាលាបឋមសិក្សាកំពត</Option>
                <Option value="សាលាបឋមសិក្សាសៀមរាប">សាលាបឋមសិក្សាសៀមរាប</Option>
                <Option value="សាលាបឋមសិក្សាបាត់ដំបង">សាលាបឋមសិក្សាបាត់ដំបង</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={3}>
              <Select
                placeholder="ថ្នាក់"
                style={{ width: '100%' }}
                value={selectedGrade}
                onChange={setSelectedGrade}
                allowClear
              >
                <Option value="ថ្នាក់ទី៤">ថ្នាក់ទី៤</Option>
                <Option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={3}>
              <Select
                placeholder="មុខវិជ្ជា"
                style={{ width: '100%' }}
                value={selectedSubject}
                onChange={setSelectedSubject}
                allowClear
              >
                <Option value="គណិតវិទ្យា">គណិតវិទ្យា</Option>
                <Option value="ភាសាខ្មែរ">ភាសាខ្មែរ</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                placeholder={['ពីកាលបរិច្ឆេទ', 'ដល់កាលបរិច្ឆេទ']}
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Progress Tracking Content */}
        <Card>
          <Tabs defaultActiveKey="detailed">
            <TabPane tab="តាមដានលម្អិត" key="detailed">
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
            </TabPane>
            <TabPane tab="ទំនោរវឌ្ឍនភាព" key="trends">
              <div className="p-4">
                <Title level={4}>ទំនោរវឌ្ឍនភាពរួម</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="សិស្សកំពុងកែលម្អ"
                        value={75}
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<RiseOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="សិស្សមានស្ថេរភាព"
                        value={20}
                        suffix="%"
                        valueStyle={{ color: '#faad14' }}
                        prefix={<LineChartOutlined />}
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