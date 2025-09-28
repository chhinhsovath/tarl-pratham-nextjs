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
  Avatar,
  List,
  Badge
} from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  StarOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ClassProgress {
  id: number;
  class_name: string;
  school_name: string;
  teacher_name: string;
  grade_level: string;
  subject: string;
  total_students: number;
  students_assessed: number;
  average_baseline: number;
  average_midline: number;
  average_endline: number;
  improvement_rate: number;
  top_performers: number;
  struggling_students: number;
  attendance_rate: number;
  completion_rate: number;
  class_rank: number;
  performance_level: 'excellent' | 'good' | 'average' | 'needs_support';
  last_assessment: string;
}

interface StudentSummary {
  id: number;
  student_name: string;
  current_score: number;
  improvement: number;
  level: string;
  status: 'excelling' | 'on_track' | 'at_risk' | 'struggling';
}

export default function ClassProgressPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Mock data for class progress
  const [classData, setClassData] = useState<ClassProgress[]>([
    {
      id: 1,
      class_name: 'ថ្នាក់ទី៤ក',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      teacher_name: 'លោកគ្រូ សុភា',
      grade_level: 'ថ្នាក់ទី៤',
      subject: 'គណិតវិទ្យា',
      total_students: 32,
      students_assessed: 30,
      average_baseline: 52.3,
      average_midline: 68.7,
      average_endline: 78.4,
      improvement_rate: 49.9,
      top_performers: 8,
      struggling_students: 3,
      attendance_rate: 93.8,
      completion_rate: 96.9,
      class_rank: 1,
      performance_level: 'excellent',
      last_assessment: '2024-01-15'
    },
    {
      id: 2,
      class_name: 'ថ្នាក់ទី៥ខ',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      teacher_name: 'លោកស្រី មីនា',
      grade_level: 'ថ្នាក់ទី៥',
      subject: 'ភាសាខ្មែរ',
      total_students: 28,
      students_assessed: 27,
      average_baseline: 48.7,
      average_midline: 62.1,
      average_endline: 72.3,
      improvement_rate: 48.5,
      top_performers: 6,
      struggling_students: 4,
      attendance_rate: 89.3,
      completion_rate: 92.9,
      class_rank: 2,
      performance_level: 'excellent',
      last_assessment: '2024-01-12'
    },
    {
      id: 3,
      class_name: 'ថ្នាក់ទី៤គ',
      school_name: 'សាលាបឋមសិក្សាសៀមរាប',
      teacher_name: 'លោកគ្រូ ច័ន្ទតារា',
      grade_level: 'ថ្នាក់ទី៤',
      subject: 'គណិតវិទ្យា',
      total_students: 35,
      students_assessed: 33,
      average_baseline: 45.2,
      average_midline: 58.9,
      average_endline: 68.7,
      improvement_rate: 52.0,
      top_performers: 7,
      struggling_students: 6,
      attendance_rate: 86.7,
      completion_rate: 89.3,
      class_rank: 3,
      performance_level: 'good',
      last_assessment: '2024-01-10'
    },
    {
      id: 4,
      class_name: 'ថ្នាក់ទី៥ច',
      school_name: 'សាលាបឋមសិក្សាបាត់ដំបង',
      teacher_name: 'លោកស្រី ស្រីពេជ្រ',
      grade_level: 'ថ្នាក់ទី៥',
      subject: 'ភាសាខ្មែរ',
      total_students: 26,
      students_assessed: 24,
      average_baseline: 41.8,
      average_midline: 53.2,
      average_endline: 61.7,
      improvement_rate: 47.6,
      top_performers: 4,
      struggling_students: 8,
      attendance_rate: 82.1,
      completion_rate: 84.6,
      class_rank: 4,
      performance_level: 'average',
      last_assessment: '2024-01-08'
    }
  ]);

  // Sample student summary for selected class
  const [studentSummary, setStudentSummary] = useState<StudentSummary[]>([
    {
      id: 1,
      student_name: 'ម៉ាលីកា ច័ន្ទ',
      current_score: 85,
      improvement: 38,
      level: 'កម្រិតខ្ពស់',
      status: 'excelling'
    },
    {
      id: 2,
      student_name: 'សុវណ្ណ រត្ន',
      current_score: 78,
      improvement: 25,
      level: 'កម្រិតល្អ',
      status: 'on_track'
    },
    {
      id: 3,
      student_name: 'ពិសាខ គឹម',
      current_score: 65,
      improvement: 15,
      level: 'កម្រិតមធ្យម',
      status: 'at_risk'
    },
    {
      id: 4,
      student_name: 'មករា ហុង',
      current_score: 58,
      improvement: 8,
      level: 'កម្រិតទាប',
      status: 'struggling'
    }
  ]);

  // Overall statistics
  const [stats, setStats] = useState({
    totalClasses: 48,
    averageClassSize: 29.5,
    averageImprovement: 49.5,
    topPerformingClasses: 12
  });

  const getPerformanceColor = (level: string) => {
    const colors = {
      excellent: 'green',
      good: 'blue',
      average: 'orange',
      needs_support: 'red'
    };
    return colors[level as keyof typeof colors] || 'default';
  };

  const getPerformanceText = (level: string) => {
    const texts = {
      excellent: 'ល្អបំផុត',
      good: 'ល្អ',
      average: 'មធ្យម',
      needs_support: 'ត្រូវការជំនួយ'
    };
    return texts[level as keyof typeof texts] || level;
  };

  const getStudentStatusColor = (status: string) => {
    const colors = {
      excelling: 'green',
      on_track: 'blue',
      at_risk: 'orange',
      struggling: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStudentStatusText = (status: string) => {
    const texts = {
      excelling: 'ពូកែបំផុត',
      on_track: 'តាមគោលដៅ',
      at_risk: 'មានហានិភ័យ',
      struggling: 'ពិបាកសិក្សា'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge count="🥇" style={{ backgroundColor: '#gold' }} />;
    if (rank === 2) return <Badge count="🥈" style={{ backgroundColor: '#silver' }} />;
    if (rank === 3) return <Badge count="🥉" style={{ backgroundColor: '#bronze' }} />;
    return <Badge count={rank} style={{ backgroundColor: '#87d068' }} />;
  };

  const columns: ColumnsType<ClassProgress> = [
    {
      title: 'ចំណាត់ថ្នាក់',
      dataIndex: 'class_rank',
      key: 'class_rank',
      width: 80,
      align: 'center',
      render: (rank: number) => getRankBadge(rank),
      sorter: (a, b) => a.class_rank - b.class_rank,
    },
    {
      title: 'ថ្នាក់រៀន',
      key: 'class_info',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <Text strong>{record.class_name}</Text>
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.school_name}
          </Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.teacher_name}
          </Text>
        </Space>
      ),
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string, record) => (
        <Space direction="vertical" size="small">
          <Tag color="blue">{subject}</Tag>
          <Text style={{ fontSize: '12px' }}>{record.grade_level}</Text>
        </Space>
      ),
    },
    {
      title: 'សិស្ស',
      key: 'students',
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text>
            <UserOutlined /> {record.students_assessed}/{record.total_students}
          </Text>
          <Text style={{ fontSize: '11px', color: '#666' }}>
            ការវាយតម្លៃ: {((record.students_assessed / record.total_students) * 100).toFixed(1)}%
          </Text>
        </Space>
      ),
    },
    {
      title: 'ពិន្ទុមធ្យម',
      key: 'scores',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            ដំបូង: <Tag size="small" color="volcano">{record.average_baseline.toFixed(1)}%</Tag>
          </Text>
          <Text style={{ fontSize: '12px' }}>
            កណ្តាល: <Tag size="small" color="orange">{record.average_midline.toFixed(1)}%</Tag>
          </Text>
          <Text style={{ fontSize: '12px' }}>
            ចុងក្រោយ: <Tag size="small" color="green">{record.average_endline.toFixed(1)}%</Tag>
          </Text>
        </Space>
      ),
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
      title: 'ស្ថានភាព',
      key: 'performance_summary',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Tag color={getPerformanceColor(record.performance_level)}>
            {getPerformanceText(record.performance_level)}
          </Tag>
          <Text style={{ fontSize: '11px' }}>
            <TrophyOutlined /> {record.top_performers} ពូកែ
          </Text>
          <Text style={{ fontSize: '11px', color: '#f5222d' }}>
            <CalendarOutlined /> {record.struggling_students} ត្រូវការជំនួយ
          </Text>
        </Space>
      ),
    },
    {
      title: 'វត្តមាន/បញ្ចប់',
      key: 'rates',
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            វត្តមាន: <Tag size="small" color="blue">{record.attendance_rate.toFixed(1)}%</Tag>
          </Text>
          <Text style={{ fontSize: '12px' }}>
            បញ្ចប់: <Tag size="small" color="green">{record.completion_rate.toFixed(1)}%</Tag>
          </Text>
        </Space>
      ),
    },
    {
      title: 'ការវាយតម្លៃចុងក្រោយ',
      dataIndex: 'last_assessment',
      key: 'last_assessment',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    }
  ];

  const filteredData = classData.filter(item => {
    const matchesSearch = item.class_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.teacher_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSchool = !selectedSchool || item.school_name === selectedSchool;
    const matchesGrade = !selectedGrade || item.grade_level === selectedGrade;
    const matchesSubject = !selectedSubject || item.subject === selectedSubject;
    const matchesTeacher = !selectedTeacher || item.teacher_name === selectedTeacher;
    
    return matchesSearch && matchesSchool && matchesGrade && matchesSubject && matchesTeacher;
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
            វឌ្ឍនភាពថ្នាក់
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>វឌ្ឍនភាពថ្នាក់រៀន</Title>
          <Text type="secondary">មើលវឌ្ឍនភាពសិក្សាតាមថ្នាក់រៀន និងការប្រៀបធៀបរវាងថ្នាក់</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ថ្នាក់រៀនសរុប"
                value={stats.totalClasses}
                prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ចំនួនសិស្សមធ្យម"
                value={stats.averageClassSize}
                prefix={<UserOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ការកែលម្អមធ្យម"
                value={stats.averageImprovement}
                suffix="%"
                prefix={<RiseOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ថ្នាក់ល្អបំផុត"
                value={stats.topPerformingClasses}
                prefix={<TrophyOutlined style={{ color: '#f5222d' }} />}
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
                placeholder="ស្វែងរកថ្នាក់..."
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
              <Select
                placeholder="គ្រូបង្រៀន"
                style={{ width: '100%' }}
                value={selectedTeacher}
                onChange={setSelectedTeacher}
                allowClear
              >
                <Option value="លោកគ្រូ សុភា">លោកគ្រូ សុភា</Option>
                <Option value="លោកស្រី មីនា">លោកស្រី មីនា</Option>
                <Option value="លោកគ្រូ ច័ន្ទតារា">លោកគ្រូ ច័ន្ទតារា</Option>
                <Option value="លោកស្រី ស្រីពេជ្រ">លោកស្រី ស្រីពេជ្រ</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Class Progress Content */}
        <Card>
          <Tabs defaultActiveKey="classes">
            <TabPane tab="វឌ្ឍនភាពថ្នាក់" key="classes">
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
                    `${range[0]}-${range[1]} ពី ${total} ថ្នាក់`,
                }}
              />
            </TabPane>
            <TabPane tab="សិស្សក្នុងថ្នាក់" key="students">
              <Row gutter={16}>
                <Col span={16}>
                  <Title level={4}>សិស្សក្នុងថ្នាក់ទី៤ក - សាលាបឋមសិក្សាភ្នំពេញ</Title>
                  <List
                    dataSource={studentSummary}
                    renderItem={(student) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar icon={<UserOutlined />} />}
                          title={student.student_name}
                          description={
                            <Space direction="vertical" size="small">
                              <Space>
                                <Text>ពិន្ទុ: </Text>
                                <Tag color={student.current_score >= 70 ? 'green' : student.current_score >= 60 ? 'blue' : 'orange'}>
                                  {student.current_score}%
                                </Tag>
                                <Text>កម្រិត: </Text>
                                <Tag>{student.level}</Tag>
                              </Space>
                              <Progress 
                                percent={student.improvement} 
                                size="small" 
                                strokeColor={student.improvement > 30 ? '#52c41a' : '#faad14'} 
                              />
                            </Space>
                          }
                        />
                        <Tag color={getStudentStatusColor(student.status)}>
                          {getStudentStatusText(student.status)}
                        </Tag>
                      </List.Item>
                    )}
                  />
                </Col>
                <Col span={8}>
                  <Card size="small" title="សង្ខេបថ្នាក់">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Statistic title="សិស្សសរុប" value={30} />
                      <Statistic title="ពិន្ទុមធ្យម" value={78.4} suffix="%" />
                      <Statistic title="អត្រាវត្តមាន" value={93.8} suffix="%" />
                      <div>
                        <Text strong>ចំណាត់ថ្នាក់តាមស្ថានភាព:</Text>
                        <ul style={{ marginTop: '8px' }}>
                          <li><Tag color="green">ពូកែបំផុត: 8 នាក់</Tag></li>
                          <li><Tag color="blue">តាមគោលដៅ: 15 នាក់</Tag></li>
                          <li><Tag color="orange">មានហានិភ័យ: 4 នាក់</Tag></li>
                          <li><Tag color="red">ត្រូវការជំនួយ: 3 នាក់</Tag></li>
                        </ul>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </HorizontalLayout>
  );
}