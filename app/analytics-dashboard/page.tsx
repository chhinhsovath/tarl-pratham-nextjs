'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography, 
  Select, 
  DatePicker, 
  Space,
  Table,
  Tag,
  Divider,
  Alert,
  Spin
} from 'antd';
import { 
  AreaChartOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface AnalyticsData {
  overview: {
    total_students: number;
    total_assessments: number;
    active_schools: number;
    avg_improvement: number;
  };
  assessmentTrends: any[];
  subjectPerformance: any[];
  schoolComparison: any[];
  recentActivity: any[];
}

function AnalyticsDashboardContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<any[]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      total_students: 0,
      total_assessments: 0,
      active_schools: 0,
      avg_improvement: 0
    },
    assessmentTrends: [],
    subjectPerformance: [],
    schoolComparison: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedSchool]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Mock data for analytics dashboard
      const mockData: AnalyticsData = {
        overview: {
          total_students: 245,
          total_assessments: 1284,
          active_schools: 8,
          avg_improvement: 23.5
        },
        assessmentTrends: [
          { date: '2024-01-01', baseline: 45, midline: 52, endline: 67 },
          { date: '2024-01-15', baseline: 48, midline: 55, endline: 70 },
          { date: '2024-02-01', baseline: 52, midline: 59, endline: 73 },
          { date: '2024-02-15', baseline: 55, midline: 62, endline: 76 }
        ],
        subjectPerformance: [
          { subject: 'ភាសាខ្មែរ', baseline: 48, current: 65, improvement: 35.4 },
          { subject: 'គណិតវិទ្យា', baseline: 52, current: 68, improvement: 30.8 }
        ],
        schoolComparison: [
          { school: 'សាលាប្រាសាទ', students: 35, avg_score: 72, improvement: 28 },
          { school: 'សាលាអង្គរ', students: 42, avg_score: 68, improvement: 31 },
          { school: 'សាលាបាយ័ន', students: 38, avg_score: 70, improvement: 25 },
          { school: 'សាលាតាព្រហ្ម', students: 41, avg_score: 74, improvement: 33 }
        ],
        recentActivity: [
          { 
            id: 1, 
            type: 'assessment', 
            description: 'ការវាយតម្លៃថ្មីបានបញ្ចប់សម្រាប់ថ្នាក់ទី៤', 
            school: 'សាលាប្រាសាទ', 
            date: '2024-01-20',
            status: 'completed'
          },
          { 
            id: 2, 
            type: 'visit', 
            description: 'ការចុះអប់រំនៅសាលាអង្គរ', 
            school: 'សាលាអង្គរ', 
            date: '2024-01-19',
            status: 'completed'
          },
          { 
            id: 3, 
            type: 'training', 
            description: 'ការបណ្តុះបណ្តាលគ្រូបង្រៀន', 
            school: 'សាលាបាយ័ន', 
            date: '2024-01-18',
            status: 'scheduled'
          }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImprovementColor = (value: number) => {
    if (value > 30) return '#52c41a';
    if (value > 20) return '#faad14';
    return '#ff4d4f';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'scheduled': return 'blue';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const schoolComparisonColumns = [
    {
      title: 'សាលារៀន',
      dataIndex: 'school',
      key: 'school',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'ចំនួនសិស្ស',
      dataIndex: 'students',
      key: 'students',
      render: (count: number) => (
        <Space>
          <UserOutlined />
          {count}
        </Space>
      )
    },
    {
      title: 'ពិន្ទុមធ្យម',
      dataIndex: 'avg_score',
      key: 'avg_score',
      render: (score: number) => (
        <Tag color={score > 70 ? 'green' : score > 60 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      )
    },
    {
      title: 'ការកែលម្អ',
      dataIndex: 'improvement',
      key: 'improvement',
      render: (improvement: number) => (
        <Space>
          {improvement > 0 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#ff4d4f' }} />}
          <span style={{ color: getImprovementColor(improvement) }}>
            +{improvement}%
          </span>
        </Space>
      )
    }
  ];

  const activityColumns = [
    {
      title: 'ប្រភេទ',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap = {
          assessment: 'ការវាយតម្លៃ',
          visit: 'ការចុះអប់រំ',
          training: 'ការបណ្តុះបណ្តាល'
        };
        return <Tag color="blue">{typeMap[type as keyof typeof typeMap]}</Tag>;
      }
    },
    {
      title: 'សកម្មភាព',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school',
      key: 'school'
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          completed: 'បានបញ្ចប់',
          scheduled: 'បានកំណត់',
          pending: 'កំពុងរង់ចាំ'
        };
        return <Tag color={getStatusColor(status)}>{statusMap[status as keyof typeof statusMap]}</Tag>;
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16 }}>កំពុងទាញយកទិន្នន័យ...</p>
      </div>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Header */}
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <AreaChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              ផ្ទាំងវិភាគទិន្នន័យ
            </Title>
            <Text type="secondary">ទិដ្ឋភាពលម្អិតនៃការអនុវត្ត TaRL</Text>
          </Col>
          <Col>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD/MM/YYYY"
              />
              <Select
                style={{ width: 200 }}
                placeholder="ជ្រើសរើសសាលារៀន"
                value={selectedSchool}
                onChange={setSelectedSchool}
              >
                <Option value="all">សាលារៀនទាំងអស់</Option>
                <Option value="1">សាលាប្រាសាទ</Option>
                <Option value="2">សាលាអង្គរ</Option>
                <Option value="3">សាលាបាយ័ន</Option>
                <Option value="4">សាលាតាព្រហ្ម</Option>
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Overview Statistics */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ចំនួនសិស្សសរុប"
              value={analyticsData.overview.total_students}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ការវាយតម្លៃសរុប"
              value={analyticsData.overview.total_assessments}
              prefix={<BookOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="សាលារៀនសកម្ម"
              value={analyticsData.overview.active_schools}
              prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ការកែលម្អមធ្យម"
              value={analyticsData.overview.avg_improvement}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Subject Performance */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <PieChartOutlined style={{ color: '#1890ff' }} />
              ការអនុវត្តតាមមុខវិជ្ជា
            </Space>
          }>
            <Space direction="vertical" style={{ width: '100%' }}>
              {analyticsData.subjectPerformance.map((subject, index) => (
                <div key={index}>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text strong>{subject.subject}</Text>
                    <Space>
                      <Text type="secondary">មូលដ្ឋាន: {subject.baseline}%</Text>
                      <Text strong>បច្ចុប្បន្ន: {subject.current}%</Text>
                    </Space>
                  </Row>
                  <Progress
                    percent={subject.current}
                    strokeColor={getImprovementColor(subject.improvement)}
                    format={(percent) => (
                      <span style={{ color: getImprovementColor(subject.improvement) }}>
                        +{subject.improvement}%
                      </span>
                    )}
                  />
                  <Divider style={{ margin: '16px 0' }} />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title={
            <Space>
              <BarChartOutlined style={{ color: '#52c41a' }} />
              ការប្រៀបធៀបសាលារៀន
            </Space>
          }>
            <Table
              columns={schoolComparisonColumns}
              dataSource={analyticsData.schoolComparison}
              pagination={false}
              size="small"
              rowKey="school"
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card title={
        <Space>
          <LineChartOutlined style={{ color: '#faad14' }} />
          សកម្មភាពថ្មីៗ
        </Space>
      }>
        <Table
          columns={activityColumns}
          dataSource={analyticsData.recentActivity}
          pagination={{ pageSize: 5 }}
          size="middle"
          rowKey="id"
        />
      </Card>

      {/* Insights Alert */}
      <Alert
        message="ការវិភាគ និងអនុសាសន៍"
        description={
          <div>
            <p>• <strong>ការកែលម្អល្អ:</strong> សិស្សបានកែលម្អប្រសិទ្ធភាពមធ្យម 23.5% ក្នុងរយៈពេល 30 ថ្ងៃចុងក្រោយ</p>
            <p>• <strong>មុខវិជ្ជាពិសេស:</strong> ភាសាខ្មែរបានកែលម្អច្រើនជាងគណិតវិទ្យា (35.4% vs 30.8%)</p>
            <p>• <strong>សាលាល្អបំផុត:</strong> សាលាតាព្រហ្មបានលទ្ធផលល្អបំផុតនៅពេលនេះ (74% និង +33% ការកែលម្អ)</p>
            <p>• <strong>អនុសាសន៍:</strong> គួរបង្កើនការចុះអប់រំនៅសាលាដែលមានការកែលម្អទាប</p>
          </div>
        }
        type="info"
        showIcon
      />
    </Space>
  );
}

export default function AnalyticsDashboardPage() {
  return (
    <DashboardLayout>
      <AnalyticsDashboardContent />
    </DashboardLayout>
  );
}