'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Table,
  Tag,
  Spin,
  Alert,
  Tabs,
  Statistic,
  Progress
} from 'antd';
import {
  BarChartOutlined,
  TeamOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FilterOutlined,
  UserOutlined,
  TrophyOutlined
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
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart
} from 'recharts';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface AssessmentAnalysisData {
  overview: {
    total_assessments: number;
    total_students: number;
    avg_khmer_score: number;
    avg_math_score: number;
    completion_rate: number;
  };
  skill_analysis: {
    khmer_skills: Array<{ skill: string; mastery_rate: number; total_assessed: number }>;
    math_skills: Array<{ skill: string; mastery_rate: number; total_assessed: number }>;
  };
  demographic_analysis: {
    by_gender: Array<{ gender: string; avg_khmer: number; avg_math: number; count: number }>;
    by_age_group: Array<{ age_group: string; avg_khmer: number; avg_math: number; count: number }>;
    by_class: Array<{ class: number; avg_khmer: number; avg_math: number; count: number }>;
  };
  temporal_analysis: {
    monthly_progress: Array<{ month: string; baseline: number; midline: number; endline: number }>;
    cycle_comparison: Array<{ cycle: string; khmer_avg: number; math_avg: number; count: number }>;
  };
  performance_gaps: {
    struggling_students: Array<{
      id: number;
      name: string;
      school: string;
      khmer_level: string;
      math_level: string;
      gap_score: number;
    }>;
    top_performers: Array<{
      id: number;
      name: string;
      school: string;
      khmer_level: string;
      math_level: string;
      improvement_score: number;
    }>;
  };
  intervention_recommendations: Array<{
    category: string;
    description: string;
    target_students: number;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export default function AssessmentAnalysisPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AssessmentAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    school_id: '',
    assessment_period: '',
    subject: '',
    date_range: null as [dayjs.Dayjs, dayjs.Dayjs] | null
  });
  const [schools, setSchools] = useState([]);

  // Fetch analysis data
  const fetchAnalysisData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.school_id) params.append('school_id', filters.school_id);
      if (filters.assessment_period) params.append('assessment_period', filters.assessment_period);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.date_range) {
        params.append('date_from', filters.date_range[0].format('YYYY-MM-DD'));
        params.append('date_to', filters.date_range[1].format('YYYY-MM-DD'));
      }

      const response = await fetch(`/api/reports/assessment-analysis?${params}`);
      const result = await response.json();

      if (response.ok) {
        setData(result);
      } else {
        console.error('Error fetching analysis data:', result.error);
      }
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch schools for filter
  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const result = await response.json();
        setSchools(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchAnalysisData();
  }, [filters]);

  const handleExport = async (format: string) => {
    try {
      const params = new URLSearchParams({
        format,
        report_type: 'assessment-analysis',
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
  const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa8c16', '#13c2c2'];

  if (loading) {
    return (
      <HorizontalLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  if (!data) {
    return (
      <HorizontalLayout>
        <Alert message="មិនអាចទាញយកទិន្នន័យបាន" type="error" />
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Title level={2} className="mb-0">
            របាយការណ៍វិភាគការវាយតម្លៃ
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <Select
              placeholder="មុខវិជ្ជា"
              value={filters.subject || undefined}
              onChange={(value) => setFilters({ ...filters, subject: value || '' })}
              allowClear
            >
              <Select.Option value="khmer">ភាសាខ្មែរ</Select.Option>
              <Select.Option value="math">គណិតវិទ្យា</Select.Option>
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
                title="ការវាយតម្លៃសរុប"
                value={data.overview.total_assessments}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={data.overview.total_students}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ពិន្ទុភាសាខ្មែរជាមធ្យម"
                value={data.overview.avg_khmer_score}
                precision={1}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ពិន្ទុគណិតវិទ្យាជាមធ្យម"
                value={data.overview.avg_math_score}
                precision={1}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} className="mb-6">
          <Col span={24}>
            <Card>
              <Statistic
                title="អត្រាបញ្ចប់ការវាយតម្លៃ"
                value={data.overview.completion_rate}
                precision={1}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress 
                percent={data.overview.completion_rate} 
                strokeColor="#52c41a"
                size="small"
              />
            </Card>
          </Col>
        </Row>

        <Tabs defaultActiveKey="skills" className="mb-6">
          <TabPane tab="វិភាគជំនាញ" key="skills">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="ជំនាញភាសាខ្មែរ">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.skill_analysis.khmer_skills}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'អត្រាស្ទាត់']} />
                      <Bar dataKey="mastery_rate" fill="#1890ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="ជំនាញគណិតវិទ្យា">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.skill_analysis.math_skills}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'អត្រាស្ទាត់']} />
                      <Bar dataKey="mastery_rate" fill="#52c41a" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="វិភាគប្រជាសាស្រ្ត" key="demographics">
            <Row gutter={16} className="mb-4">
              <Col xs={24} lg={8}>
                <Card title="តាមភេទ">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.demographic_analysis.by_gender}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gender" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_khmer" fill="#1890ff" name="ភាសាខ្មែរ" />
                      <Bar dataKey="avg_math" fill="#52c41a" name="គណិតវិទ្យា" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="តាមក្រុមអាយុ">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.demographic_analysis.by_age_group}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age_group" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_khmer" fill="#1890ff" name="ភាសាខ្មែរ" />
                      <Bar dataKey="avg_math" fill="#52c41a" name="គណិតវិទ្យា" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card title="តាមថ្នាក់">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.demographic_analysis.by_class}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="class" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avg_khmer" fill="#1890ff" name="ភាសាខ្មែរ" />
                      <Bar dataKey="avg_math" fill="#52c41a" name="គណិតវិទ្យា" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="វិភាគពេលវេលា" key="temporal">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="វឌ្ឍនភាពប្រចាំខែ">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.temporal_analysis.monthly_progress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="baseline" stroke="#ff4d4f" name="មូលដ្ឋាន" />
                      <Line type="monotone" dataKey="midline" stroke="#faad14" name="កុលសនភាព" />
                      <Line type="monotone" dataKey="endline" stroke="#52c41a" name="បញ្ចប់" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="ការប្រៀបធៀបរយៈពេល">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data.temporal_analysis.cycle_comparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="cycle" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="khmer_avg" fill="#1890ff" name="ភាសាខ្មែរ" />
                      <Bar dataKey="math_avg" fill="#52c41a" name="គណិតវិទ្យា" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="ភាពខុសគ្នានៃការអនុវត្ត" key="gaps">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="សិស្សដែលត្រូវការជំនួយ">
                  <Table scroll={{ x: "max-content" }}
                    dataSource={data.performance_gaps.struggling_students}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    columns={[
                      {
                        title: 'ឈ្មោះ',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                      },
                      {
                        title: 'សាលា',
                        dataIndex: 'school',
                        key: 'school',
                        width: 100,
                      },
                      {
                        title: 'ភាសាខ្មែរ',
                        dataIndex: 'khmer_level',
                        key: 'khmer_level',
                        render: (level: string) => (
                          <Tag color="red" style={{ fontSize: '10px' }}>{level}</Tag>
                        ),
                      },
                      {
                        title: 'គណិតវិទ្យា',
                        dataIndex: 'math_level',
                        key: 'math_level',
                        render: (level: string) => (
                          <Tag color="red" style={{ fontSize: '10px' }}>{level}</Tag>
                        ),
                      },
                      {
                        title: 'ពិន្ទុប្រហោង',
                        dataIndex: 'gap_score',
                        key: 'gap_score',
                        render: (score: number) => score.toFixed(1),
                      },
                    ]}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="សិស្សល្អបំផុត">
                  <Table scroll={{ x: "max-content" }}
                    dataSource={data.performance_gaps.top_performers}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    size="small"
                    columns={[
                      {
                        title: 'ឈ្មោះ',
                        dataIndex: 'name',
                        key: 'name',
                        width: 120,
                      },
                      {
                        title: 'សាលា',
                        dataIndex: 'school',
                        key: 'school',
                        width: 100,
                      },
                      {
                        title: 'ភាសាខ្មែរ',
                        dataIndex: 'khmer_level',
                        key: 'khmer_level',
                        render: (level: string) => (
                          <Tag color="green" style={{ fontSize: '10px' }}>{level}</Tag>
                        ),
                      },
                      {
                        title: 'គណិតវិទ្យា',
                        dataIndex: 'math_level',
                        key: 'math_level',
                        render: (level: string) => (
                          <Tag color="green" style={{ fontSize: '10px' }}>{level}</Tag>
                        ),
                      },
                      {
                        title: 'ពិន្ទុកំណើន',
                        dataIndex: 'improvement_score',
                        key: 'improvement_score',
                        render: (score: number) => score.toFixed(1),
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="អនុសាសន៍អន្តរាគមន៍" key="recommendations">
            <Card title="អនុសាសន៍សម្រាប់ការអន្តរាគមន៍">
              <div className="space-y-4">
                {data.intervention_recommendations.map((rec, index) => (
                  <Card key={index} size="small" className={`border-l-4 ${
                    rec.priority === 'high' ? 'border-l-red-500' :
                    rec.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Text strong>{rec.category}</Text>
                          <Tag color={
                            rec.priority === 'high' ? 'red' :
                            rec.priority === 'medium' ? 'orange' : 'green'
                          }>
                            {rec.priority === 'high' ? 'អាទិភាពខ្ពស់' :
                             rec.priority === 'medium' ? 'អាទិភាពមធ្យម' : 'អាទិភាពទាប'}
                          </Tag>
                        </div>
                        <Text>{rec.description}</Text>
                      </div>
                      <div className="text-right">
                        <Text type="secondary">គោលដៅ: {rec.target_students} សិស្ស</Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </HorizontalLayout>
  );
}