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
  Timeline,
  Avatar
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  RiseOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  StarOutlined,
  HeartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface MentoringImpact {
  id: number;
  mentor_name: string;
  school_name: string;
  district: string;
  province: string;
  total_visits: number;
  total_teachers_mentored: number;
  students_impacted: number;
  avg_improvement_before: number;
  avg_improvement_after: number;
  impact_score: number;
  satisfaction_rating: number;
  visit_frequency: number;
  last_visit_date: string;
  status: 'highly_effective' | 'effective' | 'developing' | 'needs_improvement';
  focus_areas: string[];
}

interface VisitActivity {
  id: number;
  mentor_name: string;
  school_name: string;
  visit_date: string;
  duration_hours: number;
  teachers_met: number;
  key_activities: string[];
  outcomes: string;
  next_steps: string;
}

export default function MentoringImpactPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [activeTab, setActiveTab] = useState('impact');

  // Mock data for mentoring impact
  const [impactData, setImpactData] = useState<MentoringImpact[]>([
    {
      id: 1,
      mentor_name: 'បញ្ញា ចាន់សុវណ្ណ',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      district: 'ដូនពេញ',
      province: 'ភ្នំពេញ',
      total_visits: 24,
      total_teachers_mentored: 8,
      students_impacted: 245,
      avg_improvement_before: 42.3,
      avg_improvement_after: 78.4,
      impact_score: 85.2,
      satisfaction_rating: 4.8,
      visit_frequency: 2.0,
      last_visit_date: '2024-01-15',
      status: 'highly_effective',
      focus_areas: ['វិធីសាស្រ្តបង្រៀន', 'ការវាយតម្លៃ', 'ការគ្រប់គ្រងថ្នាក់']
    },
    {
      id: 2,
      mentor_name: 'សុភា ម៉េងហុង',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      district: 'កំពត',
      province: 'កំពត',
      total_visits: 18,
      total_teachers_mentored: 6,
      students_impacted: 189,
      avg_improvement_before: 38.7,
      avg_improvement_after: 72.3,
      impact_score: 86.8,
      satisfaction_rating: 4.7,
      visit_frequency: 1.5,
      last_visit_date: '2024-01-12',
      status: 'highly_effective',
      focus_areas: ['ការអានសេចក្តី', 'គណិតវិទ្យា', 'ការចូលរួម']
    },
    {
      id: 3,
      mentor_name: 'រតន៍ ពិសាខ',
      school_name: 'សាលាបឋមសិក្សាសៀមរាប',
      district: 'សៀមរាប',
      province: 'សៀមរាប',
      total_visits: 15,
      total_teachers_mentored: 9,
      students_impacted: 312,
      avg_improvement_before: 35.2,
      avg_improvement_after: 68.7,
      impact_score: 95.2,
      satisfaction_rating: 4.9,
      visit_frequency: 1.2,
      last_visit_date: '2024-01-10',
      status: 'highly_effective',
      focus_areas: ['ការបង្រៀនចម្រុះ', 'ធនធានសិក្សា', 'ការធ្វើតេស្ត']
    },
    {
      id: 4,
      mentor_name: 'មករា ស្រីលក្ខណ៍',
      school_name: 'សាលាបឋមសិក្សាបាត់ដំបង',
      district: 'បាត់ដំបង',
      province: 'បាត់ដំបង',
      total_visits: 12,
      total_teachers_mentored: 5,
      students_impacted: 178,
      avg_improvement_before: 41.8,
      avg_improvement_after: 61.7,
      impact_score: 47.6,
      satisfaction_rating: 4.2,
      visit_frequency: 1.0,
      last_visit_date: '2024-01-08',
      status: 'effective',
      focus_areas: ['ការអប់រំជីវិត', 'សុខភាពស្វែងយល់', 'ការបង្រៀនសកម្ម']
    }
  ]);

  // Recent visit activities
  const [visitActivities, setVisitActivities] = useState<VisitActivity[]>([
    {
      id: 1,
      mentor_name: 'បញ្ញា ចាន់សុវណ្ណ',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      visit_date: '2024-01-15',
      duration_hours: 4,
      teachers_met: 3,
      key_activities: ['ពិនិត្យគំរូបង្រៀន', 'ជជែកគូរបានតួនាទី', 'ធ្វើតេស្តសាកល្បង'],
      outcomes: 'គ្រូបានកែលម្អវិធីសាស្រ្តបង្រៀនថ្មី និងសិស្សបានយល់កាន់តែច្បាស់',
      next_steps: 'បន្តតាមដានការអនុវត្ត និងវាយតម្លៃលទ្ធផលក្នុងសប្តាហ៍ក្រោយ'
    },
    {
      id: 2,
      mentor_name: 'សុភា ម៉េងហុង',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      visit_date: '2024-01-12',
      duration_hours: 3,
      teachers_met: 2,
      key_activities: ['ការបង្រៀនអាន', 'ការប្រើឧបករណ៍បំរុងទុក', 'ការវាយតម្លៃតាមដាន'],
      outcomes: 'គ្រូមានជំនាញថ្មីក្នុងការបង្រៀនអាន និងសិស្សចាប់ផ្តើមអានបានលឿន',
      next_steps: 'រៀបចំធនធានបន្ថែម និងបន្តហ្វឹកហ្វឺនគ្រូនៅសាលា'
    }
  ]);

  // Overall statistics
  const [stats, setStats] = useState({
    totalMentors: 12,
    totalSchools: 24,
    avgImpactScore: 78.7,
    highPerformers: 8
  });

  const getStatusColor = (status: string) => {
    const colors = {
      highly_effective: 'green',
      effective: 'blue',
      developing: 'orange',
      needs_improvement: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      highly_effective: 'មានប្រសិទ្ធភាពខ្ពស់',
      effective: 'មានប្រសិទ្ធភាព',
      developing: 'កំពុងអភិវឌ្ឍ',
      needs_improvement: 'ត្រូវការកែលម្អ'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const impactColumns: ColumnsType<MentoringImpact> = [
    {
      title: 'អ្នកណែនាំ',
      dataIndex: 'mentor_name',
      key: 'mentor_name',
      render: (text: string, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.school_name}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'ទីតាំង',
      key: 'location',
      render: (_, record) => (
        <div>
          <div>{record.district}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.province}</Text>
        </div>
      ),
    },
    {
      title: 'ការចូលមើល',
      dataIndex: 'total_visits',
      key: 'total_visits',
      align: 'center',
      render: (visits: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{visits} ដង</Tag>
          <Text style={{ fontSize: '11px' }}>
            {record.visit_frequency.toFixed(1)} ដង/ខែ
          </Text>
        </Space>
      ),
    },
    {
      title: 'គ្រូដែលបានណែនាំ',
      dataIndex: 'total_teachers_mentored',
      key: 'total_teachers_mentored',
      align: 'center',
      render: (teachers: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color="green">{teachers} គ្រូ</Tag>
          <Text style={{ fontSize: '11px' }}>
            {record.students_impacted} សិស្ស
          </Text>
        </Space>
      ),
    },
    {
      title: 'ការកែលម្អ',
      key: 'improvement',
      align: 'center',
      render: (_, record) => {
        const improvement = record.avg_improvement_after - record.avg_improvement_before;
        return (
          <Space direction="vertical" size="small">
            <Progress 
              percent={Math.min(improvement, 100)} 
              size="small"
              strokeColor={improvement > 30 ? '#52c41a' : improvement > 15 ? '#faad14' : '#f5222d'}
            />
            <Text style={{ fontSize: '11px' }}>
              {record.avg_improvement_before.toFixed(1)}% → {record.avg_improvement_after.toFixed(1)}%
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'ពិន្ទុផលប៉ះពាល់',
      dataIndex: 'impact_score',
      key: 'impact_score',
      align: 'center',
      render: (score: number) => (
        <Tag color={score > 80 ? 'green' : score > 60 ? 'blue' : score > 40 ? 'orange' : 'red'}>
          {score.toFixed(1)}%
        </Tag>
      ),
      sorter: (a, b) => a.impact_score - b.impact_score,
    },
    {
      title: 'ការវាយតម្លៃ',
      dataIndex: 'satisfaction_rating',
      key: 'satisfaction_rating',
      align: 'center',
      render: (rating: number) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating.toFixed(1)}/5</Text>
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
    },
    {
      title: 'ការចូលមើលចុងក្រោយ',
      dataIndex: 'last_visit_date',
      key: 'last_visit_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    }
  ];

  const filteredData = impactData.filter(item => {
    const matchesSearch = item.mentor_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesProvince = !selectedProvince || item.province === selectedProvince;
    const matchesMentor = !selectedMentor || item.mentor_name === selectedMentor;
    
    return matchesSearch && matchesProvince && matchesMentor;
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
            ផលប៉ះពាល់ការណែនាំ
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>ផលប៉ះពាល់ការណែនាំ</Title>
          <Text type="secondary">វិភាគផលប៉ះពាល់នៃការណែនាំដល់គ្រូបង្រៀន និងលទ្ធផលសិស្ស</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="អ្នកណែនាំសរុប"
                value={stats.totalMentors}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សាលារៀនសរុប"
                value={stats.totalSchools}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ពិន្ទុផលប៉ះពាល់មធ្យម"
                value={stats.avgImpactScore}
                suffix="%"
                prefix={<RiseOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="អ្នកណែនាំល្អបំផុត"
                value={stats.highPerformers}
                prefix={<StarOutlined style={{ color: '#f5222d' }} />}
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
                placeholder="ស្វែងរកអ្នកណែនាំ..."
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
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="អ្នកណែនាំ"
                style={{ width: '100%' }}
                value={selectedMentor}
                onChange={setSelectedMentor}
                allowClear
              >
                <Option value="បញ្ញា ចាន់សុវណ្ណ">បញ្ញា ចាន់សុវណ្ណ</Option>
                <Option value="សុភា ម៉េងហុង">សុភា ម៉េងហុង</Option>
                <Option value="រតន៍ ពិសាខ">រតន៍ ពិសាខ</Option>
                <Option value="មករា ស្រីលក្ខណ៍">មករា ស្រីលក្ខណ៍</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={10}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Impact Analysis */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="ផលប៉ះពាល់លម្អិត" key="impact">
              <Table
                columns={impactColumns}
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
                    `${range[0]}-${range[1]} ពី ${total} អ្នកណែនាំ`,
                }}
              />
            </TabPane>
            <TabPane tab="សកម្មភាពថ្មីៗ" key="activities">
              <Timeline>
                {visitActivities.map((activity, index) => (
                  <Timeline.Item 
                    key={activity.id}
                    dot={<CalendarOutlined style={{ fontSize: '16px' }} />}
                    color="blue"
                  >
                    <Card size="small" style={{ marginBottom: '16px' }}>
                      <Row gutter={16}>
                        <Col span={18}>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                              <Text strong>{activity.mentor_name}</Text>
                              <Text type="secondary"> - {activity.school_name}</Text>
                            </div>
                            <Text type="secondary">
                              {dayjs(activity.visit_date).format('DD/MM/YYYY')} - រយៈពេល {activity.duration_hours} ម៉ោង
                            </Text>
                            <div>
                              <Text strong>សកម្មភាព:</Text>
                              <ul style={{ marginLeft: '20px', marginBottom: '8px' }}>
                                {activity.key_activities.map((act, i) => (
                                  <li key={i}>{act}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <Text strong>លទ្ធផល:</Text> {activity.outcomes}
                            </div>
                            <div>
                              <Text strong>ជំហានបន្ទាប់:</Text> {activity.next_steps}
                            </div>
                          </Space>
                        </Col>
                        <Col span={6}>
                          <Space direction="vertical" size="small">
                            <Tag color="blue">
                              <TeamOutlined /> {activity.teachers_met} គ្រូ
                            </Tag>
                            <Tag color="green">
                              <CheckCircleOutlined /> បានបញ្ចប់
                            </Tag>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </Timeline.Item>
                ))}
              </Timeline>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </HorizontalLayout>
  );
}