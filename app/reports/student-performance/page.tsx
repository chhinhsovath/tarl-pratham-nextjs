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
  DatePicker,
  Button,
  Space,
  Typography,
  Tag,
  Progress,
  Breadcrumb,
  Tabs,
  Input
} from 'antd';
import {
  TrophyOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface StudentPerformance {
  id: number;
  student_name: string;
  grade: string;
  school: string;
  subject: string;
  baseline_score: number;
  midline_score: number;
  endline_score: number;
  improvement: number;
  status: 'excellent' | 'good' | 'needs_improvement' | 'poor';
  assessment_date: string;
  teacher: string;
}

export default function StudentPerformancePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformance[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageImprovement: 0,
    excellentPerformers: 0,
    needsImprovement: 0
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

        // Transform API data to match our interface
        const transformedData: StudentPerformance[] = students.map((student: any, index: number) => {
          const khmerAssessments = student.assessments?.filter((a: any) => a.subject === 'khmer') || [];
          const mathAssessments = student.assessments?.filter((a: any) => a.subject === 'math') || [];

          const getScore = (assessments: any[], type: string) => {
            const assessment = assessments.find((a: any) => a.assessment_type === type);
            return assessment?.score || 0;
          };

          const baselineScore = (getScore(khmerAssessments, 'baseline') + getScore(mathAssessments, 'baseline')) / 2;
          const midlineScore = (getScore(khmerAssessments, 'midline') + getScore(mathAssessments, 'midline')) / 2;
          const endlineScore = (getScore(khmerAssessments, 'endline') + getScore(mathAssessments, 'endline')) / 2;

          const improvement = baselineScore > 0 ? ((endlineScore - baselineScore) / baselineScore) * 100 : 0;

          let status: 'excellent' | 'good' | 'needs_improvement' | 'poor' = 'poor';
          if (improvement >= 50) status = 'excellent';
          else if (improvement >= 25) status = 'good';
          else if (improvement >= 0) status = 'needs_improvement';

          return {
            id: student.student_id || index,
            student_name: student.student_name || '-',
            grade: student.grade || '-',
            school: student.school || '-',
            subject: khmerAssessments.length > mathAssessments.length ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា',
            baseline_score: Math.round(baselineScore),
            midline_score: Math.round(midlineScore),
            endline_score: Math.round(endlineScore),
            improvement: Math.round(improvement * 10) / 10,
            status,
            assessment_date: student.assessments?.[0]?.assessed_date || new Date().toISOString(),
            teacher: student.teacher || '-'
          };
        });

        setPerformanceData(transformedData);

        // Extract unique schools
        const uniqueSchools = [...new Set(transformedData.map(s => s.school))];
        setSchools(uniqueSchools);

        // Calculate statistics
        const totalStudents = transformedData.length;
        const avgImprovement = transformedData.reduce((sum, s) => sum + s.improvement, 0) / (totalStudents || 1);
        const excellent = transformedData.filter(s => s.status === 'excellent').length;
        const needsImpr = transformedData.filter(s => s.status === 'needs_improvement' || s.status === 'poor').length;

        setStats({
          totalStudents,
          averageImprovement: Math.round(avgImprovement * 10) / 10,
          excellentPerformers: excellent,
          needsImprovement: needsImpr
        });
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'green',
      good: 'blue',
      needs_improvement: 'orange',
      poor: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      excellent: 'ល្អបំផុត',
      good: 'ល្អ',
      needs_improvement: 'ត្រូវការកែលម្អ',
      poor: 'ខ្សោយ'
    };
    return texts[status as keyof typeof texts] || status;
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
            <div style={{ fontSize: '12px', color: '#666' }}>{record.grade}</div>
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
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color="blue">{subject}</Tag>
      ),
    },
    {
      title: 'ពិន្ទុដំបូង',
      dataIndex: 'baseline_score',
      key: 'baseline_score',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'ពិន្ទុកណ្តាល',
      dataIndex: 'midline_score',
      key: 'midline_score',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'ពិន្ទុចុងក្រោយ',
      dataIndex: 'endline_score',
      key: 'endline_score',
      align: 'center',
      render: (score: number) => (
        <Tag color={score < 50 ? 'red' : score < 70 ? 'orange' : 'green'}>
          {score}%
        </Tag>
      ),
    },
    {
      title: 'ការកែលម្អ',
      dataIndex: 'improvement',
      key: 'improvement',
      align: 'center',
      render: (improvement: number) => (
        <div style={{ width: '80px' }}>
          <Progress 
            percent={Math.min(improvement, 100)} 
            size="small"
            strokeColor={improvement > 50 ? '#52c41a' : improvement > 25 ? '#faad14' : '#f5222d'}
          />
          <Text style={{ fontSize: '11px' }}>+{improvement.toFixed(1)}%</Text>
        </div>
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
    },
    {
      title: 'គ្រូបង្រៀន',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher: string) => (
        <Text style={{ fontSize: '12px' }}>{teacher}</Text>
      ),
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'assessment_date',
      key: 'assessment_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    }
  ];

  const filteredData = performanceData.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school.toLowerCase().includes(searchText.toLowerCase());
    const matchesGrade = !selectedGrade || item.grade === selectedGrade;
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    const matchesSchool = !selectedSchool || item.school === selectedSchool;
    
    return matchesSearch && matchesGrade && matchesSubject && matchesSchool;
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
                title="ការកែលម្អមធ្យម"
                value={stats.averageImprovement}
                suffix="%"
                prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សដែលមានលទ្ធផលល្អបំផុត"
                value={stats.excellentPerformers}
                prefix={<BookOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ត្រូវការកែលម្អ"
                value={stats.needsImprovement}
                prefix={<CalendarOutlined style={{ color: '#f5222d' }} />}
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
                placeholder="ស្វែងរកសិស្ស ឬ សាលារៀន..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="ថ្នាក់រៀន"
                style={{ width: '100%' }}
                value={selectedGrade}
                onChange={setSelectedGrade}
                allowClear
              >
                <Option value="ថ្នាក់ទី៤">ថ្នាក់ទី៤</Option>
                <Option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
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
            <Col xs={24} sm={12} md={6}>
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
            <Col xs={24} sm={12} md={4}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Performance Table */}
        <Card>
          <Tabs defaultActiveKey="table">
            <TabPane tab="តារាងលម្អិត" key="table">
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
            <TabPane tab="សង្ខេបតាមថ្នាក់" key="summary">
              <div className="p-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="ថ្នាក់ទី៤ - ពិន្ទុមធ្យម"
                        value={68.2}
                        suffix="%"
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small">
                      <Statistic
                        title="ថ្នាក់ទី៥ - ពិន្ទុមធ្យម"
                        value={72.5}
                        suffix="%"
                        valueStyle={{ color: '#52c41a' }}
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