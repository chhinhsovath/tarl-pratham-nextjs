'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Progress,
  Table,
  Tag,
  Spin,
  Alert,
  Tabs
} from 'antd';
import {
  BarChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  BookOutlined,
  UserOutlined,
  BankOutlined,
  CalendarOutlined,
  DownloadOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface DashboardStats {
  overview: {
    total_students: number;
    total_assessments: number;
    total_schools: number;
    total_teachers: number;
    assessment_completion_rate: number;
    improvement_rate: number;
  };
  performance_distribution: {
    khmer: Array<{ level: string; count: number; percentage: number }>;
    math: Array<{ level: string; count: number; percentage: number }>;
  };
  progress_tracking: {
    improved: number;
    maintained: number;
    declined: number;
  };
  school_comparison: Array<{
    school_name: string;
    total_students: number;
    avg_khmer_level: number;
    avg_math_level: number;
    improvement_rate: number;
  }>;
  monthly_trends: Array<{
    month: string;
    assessments: number;
    improvements: number;
  }>;
  at_risk_students: Array<{
    id: number;
    name: string;
    school: string;
    khmer_level: string;
    math_level: string;
    last_assessment: string;
  }>;
}

export default function ReportsDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    school_id: '',
    assessment_period: '',
    date_range: null as [dayjs.Dayjs, dayjs.Dayjs] | null
  });
  const [schools, setSchools] = useState([]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.school_id) params.append('school_id', filters.school_id);
      if (filters.assessment_period) params.append('assessment_period', filters.assessment_period);
      if (filters.date_range) {
        params.append('date_from', filters.date_range[0].format('YYYY-MM-DD'));
        params.append('date_to', filters.date_range[1].format('YYYY-MM-DD'));
      }

      const response = await fetch(`/api/reports/dashboard?${params}`);
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error('Error fetching dashboard data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools for filter
  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams({
        format,
        ...filters,
        ...(filters.date_range && {
          date_from: filters.date_range[0].format('YYYY-MM-DD'),
          date_to: filters.date_range[1].format('YYYY-MM-DD')
        })
      });

      window.open(`/api/reports/export?${params}`, '_blank');
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Chart colors
  const KHMER_COLORS = ['#ff4d4f', '#ff7a45', '#ffa940', '#ffec3d', '#a0d911', '#52c41a', '#13c2c2'];
  const MATH_COLORS = ['#ff4d4f', '#ff7a45', '#ffa940', '#ffec3d', '#a0d911', '#52c41a'];
  const PROGRESS_COLORS = ['#52c41a', '#faad14', '#ff4d4f'];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <Alert message="មិនអាចទាញយកទិន្នន័យបាន" type="error" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">
            ផ្ទាំងវិភាគទិន្នន័យ
          </Title>
          
          <Space>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => handleExport('excel')}
            >
              នាំចេញ Excel
            </Button>
            <Button 
              icon={<DownloadOutlined />}
              onClick={() => handleExport('pdf')}
            >
              នាំចេញ PDF
            </Button>
            <Button 
              icon={<PrinterOutlined />}
              onClick={() => window.print()}
            >
              បោះពុម្ព
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              placeholder="ជ្រើសរើសសាលា"
              value={filters.school_id || undefined}
              onChange={(value) => setFilters({ ...filters, school_id: value || '' })}
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
              placeholder="រយៈពេលវាយតម្លៃ"
              value={filters.assessment_period || undefined}
              onChange={(value) => setFilters({ ...filters, assessment_period: value || '' })}
              allowClear
            >
              <Select.Option value="baseline">មូលដ្ឋាន</Select.Option>
              <Select.Option value="midline">កុលសនភាព</Select.Option>
              <Select.Option value="endline">បញ្ចប់</Select.Option>
            </Select>

            <RangePicker
              placeholder={['ចាប់ពី', 'ដល់']}
              value={filters.date_range}
              onChange={(dates) => setFilters({ ...filters, date_range: dates })}
            />
          </div>
        </Card>

        {/* Overview Statistics */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={stats.overview.total_students}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ការវាយតម្លៃសរុប"
                value={stats.overview.total_assessments}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលាសរុប"
                value={stats.overview.total_schools}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="អ្នកបង្រៀនសរុប"
                value={stats.overview.total_teachers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="អត្រាបញ្ចប់ការវាយតម្លៃ"
                value={stats.overview.assessment_completion_rate}
                precision={1}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={stats.overview.assessment_completion_rate} 
                strokeColor="#52c41a"
                size="small"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card>
              <Statistic
                title="អត្រាការរីកចម្រើន"
                value={stats.overview.improvement_rate}
                precision={1}
                suffix="%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress 
                percent={stats.overview.improvement_rate} 
                strokeColor="#1890ff"
                size="small"
              />
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="performance" className="mb-6">
          <TabPane tab="ការអនុវត្តតាមកម្រិត" key="performance">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="ការចែកចាយកម្រិតភាសាខ្មែរ">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.performance_distribution.khmer}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8">
                        {stats.performance_distribution.khmer.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={KHMER_COLORS[index % KHMER_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="ការចែកចាយកម្រិតគណិតវិទ្យា">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.performance_distribution.math}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#82ca9d">
                        {stats.performance_distribution.math.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MATH_COLORS[index % MATH_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="ការតាមដានវឌ្ឍនភាព" key="progress">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="ការចែកចាយវឌ្ឍនភាព">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'រីកចម្រើន', value: stats.progress_tracking.improved },
                          { name: 'រក្សាកម្រិត', value: stats.progress_tracking.maintained },
                          { name: 'ធ្លាក់ចុះ', value: stats.progress_tracking.declined }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {PROGRESS_COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="និន្នាការប្រចាំខែ">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="assessments" stroke="#8884d8" name="ការវាយតម្លៃ" />
                      <Line type="monotone" dataKey="improvements" stroke="#82ca9d" name="ការរីកចម្រើន" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="ការប្រៀបធៀបសាលា" key="schools">
            <Card title="ការប្រៀបធៀបកំណើនរបស់សាលា">
              <Table
                dataSource={stats.school_comparison}
                rowKey="school_name"
                pagination={false}
                scroll={{ x: 800 }}
                columns={[
                  {
                    title: 'សាលា',
                    dataIndex: 'school_name',
                    key: 'school_name',
                    width: 200,
                  },
                  {
                    title: 'សិស្សសរុប',
                    dataIndex: 'total_students',
                    key: 'total_students',
                    align: 'center',
                  },
                  {
                    title: 'កម្រិតភាសាខ្មែរជាមធ្យម',
                    dataIndex: 'avg_khmer_level',
                    key: 'avg_khmer_level',
                    align: 'center',
                    render: (value: number) => value.toFixed(1),
                  },
                  {
                    title: 'កម្រិតគណិតវិទ្យាជាមធ្យម',
                    dataIndex: 'avg_math_level',
                    key: 'avg_math_level',
                    align: 'center',
                    render: (value: number) => value.toFixed(1),
                  },
                  {
                    title: 'អត្រាការរីកចម្រើន',
                    dataIndex: 'improvement_rate',
                    key: 'improvement_rate',
                    align: 'center',
                    render: (value: number) => (
                      <Tag color={value >= 70 ? 'green' : value >= 50 ? 'orange' : 'red'}>
                        {value.toFixed(1)}%
                      </Tag>
                    ),
                  },
                ]}
              />
            </Card>
          </TabPane>

          <TabPane tab="សិស្សប្រឈមមុខនឹងហានិភ័យ" key="at-risk">
            <Card title="សិស្សដែលត្រូវការការយកចិត្តទុកដាក់ពិសេស">
              <Table
                dataSource={stats.at_risk_students}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                columns={[
                  {
                    title: 'ឈ្មោះសិស្ស',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: 'សាលា',
                    dataIndex: 'school',
                    key: 'school',
                  },
                  {
                    title: 'កម្រិតភាសាខ្មែរ',
                    dataIndex: 'khmer_level',
                    key: 'khmer_level',
                    render: (level: string) => (
                      <Tag color="red">{level}</Tag>
                    ),
                  },
                  {
                    title: 'កម្រិតគណិតវិទ្យា',
                    dataIndex: 'math_level',
                    key: 'math_level',
                    render: (level: string) => (
                      <Tag color="red">{level}</Tag>
                    ),
                  },
                  {
                    title: 'ការវាយតម្លៃចុងក្រោយ',
                    dataIndex: 'last_assessment',
                    key: 'last_assessment',
                    render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
                  },
                ]}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}