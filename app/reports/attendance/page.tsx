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
  Calendar,
  Badge,
  Alert
} from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  TeamOutlined,
  BookOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

interface AttendanceRecord {
  id: number;
  student_name: string;
  school_name: string;
  class_name: string;
  grade: string;
  total_days: number;
  days_present: number;
  days_absent: number;
  days_late: number;
  attendance_rate: number;
  consecutive_absences: number;
  last_absence_date: string;
  attendance_trend: 'improving' | 'stable' | 'declining';
  status: 'excellent' | 'good' | 'concerning' | 'critical';
  recent_attendance: string[]; // Array of P (Present), A (Absent), L (Late) for last 10 days
}

interface DailyAttendance {
  date: string;
  school_name: string;
  class_name: string;
  total_students: number;
  present: number;
  absent: number;
  late: number;
  attendance_rate: number;
  notable_absences: string[];
}

interface MonthlyTrend {
  month: string;
  attendance_rate: number;
  total_students: number;
  average_absences: number;
}

export default function AttendancePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [dateRange, setDateRange] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  // Mock data for attendance records
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([
    {
      id: 1,
      student_name: 'ម៉ាលីកា ច័ន្ទ',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      class_name: 'ថ្នាក់ទី៤ក',
      grade: 'ថ្នាក់ទី៤',
      total_days: 150,
      days_present: 142,
      days_absent: 6,
      days_late: 2,
      attendance_rate: 94.7,
      consecutive_absences: 0,
      last_absence_date: '2024-01-10',
      attendance_trend: 'stable',
      status: 'excellent',
      recent_attendance: ['P', 'P', 'P', 'L', 'P', 'P', 'P', 'P', 'A', 'P']
    },
    {
      id: 2,
      student_name: 'រតនា គឹម',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      class_name: 'ថ្នាក់ទី៥ខ',
      grade: 'ថ្នាក់ទី៥',
      total_days: 150,
      days_present: 135,
      days_absent: 12,
      days_late: 3,
      attendance_rate: 90.0,
      consecutive_absences: 1,
      last_absence_date: '2024-01-15',
      attendance_trend: 'stable',
      status: 'good',
      recent_attendance: ['P', 'P', 'A', 'P', 'P', 'L', 'P', 'P', 'P', 'P']
    },
    {
      id: 3,
      student_name: 'សុវណ្ណ ហុង',
      school_name: 'សាលាបឋមសិក្សាសៀមរាប',
      class_name: 'ថ្នាក់ទី៤គ',
      grade: 'ថ្នាក់ទី៤',
      total_days: 150,
      days_present: 120,
      days_absent: 25,
      days_late: 5,
      attendance_rate: 80.0,
      consecutive_absences: 2,
      last_absence_date: '2024-01-14',
      attendance_trend: 'declining',
      status: 'concerning',
      recent_attendance: ['A', 'A', 'P', 'L', 'P', 'P', 'A', 'P', 'P', 'L']
    },
    {
      id: 4,
      student_name: 'ញាត្តា ស៊ុន',
      school_name: 'សាលាបឋមសិក្សាបាត់ដំបង',
      class_name: 'ថ្នាក់ទី៥ច',
      grade: 'ថ្នាក់ទី៥',
      total_days: 150,
      days_present: 105,
      days_absent: 38,
      days_late: 7,
      attendance_rate: 70.0,
      consecutive_absences: 5,
      last_absence_date: '2024-01-15',
      attendance_trend: 'declining',
      status: 'critical',
      recent_attendance: ['A', 'A', 'A', 'A', 'A', 'P', 'A', 'A', 'L', 'P']
    }
  ]);

  // Mock daily attendance data
  const [dailyData, setDailyData] = useState<DailyAttendance[]>([
    {
      date: '2024-01-15',
      school_name: 'សាលាបឋមសិក្សាភ្នំពេញ',
      class_name: 'ថ្នាក់ទី៤ក',
      total_students: 32,
      present: 28,
      absent: 3,
      late: 1,
      attendance_rate: 87.5,
      notable_absences: ['ញាត្តា ស៊ុន', 'សុវណ្ណ ហុង']
    },
    {
      date: '2024-01-15',
      school_name: 'សាលាបឋមសិក្សាកំពត',
      class_name: 'ថ្នាក់ទី៥ខ',
      total_students: 28,
      present: 25,
      absent: 2,
      late: 1,
      attendance_rate: 89.3,
      notable_absences: ['រតនា គឹម']
    }
  ]);

  // Overall statistics
  const [stats, setStats] = useState({
    totalStudents: 1248,
    overallAttendance: 87.3,
    absentToday: 156,
    chronicAbsentees: 42
  });

  const getStatusColor = (status: string) => {
    const colors = {
      excellent: 'green',
      good: 'blue',
      concerning: 'orange',
      critical: 'red'
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts = {
      excellent: 'ល្អបំផុត',
      good: 'ល្អ',
      concerning: 'ត្រូវការការយកចិត្តទុកដាក់',
      critical: 'ចាំបាច់ត្រូវមានការអន្តរាគមន៍'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    if (trend === 'declining') return <ExclamationCircleOutlined style={{ color: '#f5222d' }} />;
    return <ClockCircleOutlined style={{ color: '#faad14' }} />;
  };

  const renderAttendancePattern = (pattern: string[]) => {
    return (
      <Space>
        {pattern.map((status, index) => {
          let color = '#52c41a'; // Present - green
          let text = 'P';
          if (status === 'A') {
            color = '#f5222d'; // Absent - red
            text = 'A';
          } else if (status === 'L') {
            color = '#faad14'; // Late - yellow
            text = 'L';
          }
          return (
            <Badge 
              key={index}
              count={text} 
              style={{ backgroundColor: color, fontSize: '10px', minWidth: '18px', height: '18px' }}
            />
          );
        })}
      </Space>
    );
  };

  const columns: ColumnsType<AttendanceRecord> = [
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
              {record.class_name}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (school: string, record) => (
        <div>
          <div>{school}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.grade}</Text>
        </div>
      ),
    },
    {
      title: 'វត្តមាន',
      key: 'attendance_stats',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Text style={{ fontSize: '12px' }}>
            <CheckCircleOutlined style={{ color: '#52c41a' }} /> {record.days_present} ថ្ងៃ
          </Text>
          <Text style={{ fontSize: '12px' }}>
            <CloseCircleOutlined style={{ color: '#f5222d' }} /> {record.days_absent} ថ្ងៃ
          </Text>
          <Text style={{ fontSize: '12px' }}>
            <ClockCircleOutlined style={{ color: '#faad14' }} /> {record.days_late} ថ្ងៃ
          </Text>
        </Space>
      ),
    },
    {
      title: 'អត្រាវត្តមាន',
      dataIndex: 'attendance_rate',
      key: 'attendance_rate',
      align: 'center',
      render: (rate: number) => (
        <Space direction="vertical" size="small">
          <Progress 
            type="circle" 
            percent={rate} 
            size={50}
            strokeColor={rate >= 90 ? '#52c41a' : rate >= 80 ? '#faad14' : '#f5222d'}
          />
          <Text style={{ fontSize: '11px' }}>{rate.toFixed(1)}%</Text>
        </Space>
      ),
      sorter: (a, b) => a.attendance_rate - b.attendance_rate,
    },
    {
      title: 'ទំនោរ',
      dataIndex: 'attendance_trend',
      key: 'attendance_trend',
      render: (trend: string) => (
        <Space>
          {getTrendIcon(trend)}
          <Text style={{ fontSize: '12px' }}>
            {trend === 'improving' ? 'កំពុងកែលម្អ' : 
             trend === 'declining' ? 'កំពុងធ្លាក់ចុះ' : 'មានស្ថេរភាព'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'អវត្តមានជាប់គ្នា',
      dataIndex: 'consecutive_absences',
      key: 'consecutive_absences',
      align: 'center',
      render: (absences: number, record) => (
        <Space direction="vertical" size="small">
          <Tag color={absences === 0 ? 'green' : absences <= 2 ? 'orange' : 'red'}>
            {absences} ថ្ងៃ
          </Tag>
          {absences > 0 && (
            <Text style={{ fontSize: '11px' }}>
              ចុងក្រោយ: {dayjs(record.last_absence_date).format('DD/MM')}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'ទំរង់វត្តមាន ១០ថ្ងៃចុងក្រោយ',
      dataIndex: 'recent_attendance',
      key: 'recent_attendance',
      render: (pattern: string[]) => renderAttendancePattern(pattern),
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

  const dailyColumns: ColumnsType<DailyAttendance> = [
    {
      title: 'ថ្នាក់រៀន',
      key: 'class_info',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.class_name}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.school_name}</Text>
        </div>
      ),
    },
    {
      title: 'សិស្សសរុប',
      dataIndex: 'total_students',
      key: 'total_students',
      align: 'center',
    },
    {
      title: 'វត្តមាន',
      dataIndex: 'present',
      key: 'present',
      align: 'center',
      render: (present: number) => (
        <Tag color="green">{present}</Tag>
      ),
    },
    {
      title: 'អវត្តមាន',
      dataIndex: 'absent',
      key: 'absent',
      align: 'center',
      render: (absent: number) => (
        <Tag color="red">{absent}</Tag>
      ),
    },
    {
      title: 'មកយឺត',
      dataIndex: 'late',
      key: 'late',
      align: 'center',
      render: (late: number) => (
        <Tag color="orange">{late}</Tag>
      ),
    },
    {
      title: 'អត្រាវត្តមាន',
      dataIndex: 'attendance_rate',
      key: 'attendance_rate',
      align: 'center',
      render: (rate: number) => (
        <Progress 
          percent={rate} 
          size="small"
          strokeColor={rate >= 90 ? '#52c41a' : rate >= 80 ? '#faad14' : '#f5222d'}
        />
      ),
    }
  ];

  const filteredData = attendanceData.filter(item => {
    const matchesSearch = item.student_name.toLowerCase().includes(searchText.toLowerCase()) ||
                         item.school_name.toLowerCase().includes(searchText.toLowerCase());
    const matchesSchool = !selectedSchool || item.school_name === selectedSchool;
    const matchesClass = !selectedClass || item.class_name === selectedClass;
    const matchesGrade = !selectedGrade || item.grade === selectedGrade;
    
    return matchesSearch && matchesSchool && matchesClass && matchesGrade;
  });

  // Calendar cell renderer
  const dateCellRender = (value: dayjs.Dayjs) => {
    // Mock attendance data for calendar
    const rate = Math.floor(Math.random() * 30) + 70; // Random rate between 70-100
    let status = 'success';
    if (rate < 80) status = 'error';
    else if (rate < 90) status = 'warning';
    
    return (
      <Badge status={status as any} text={`${rate}%`} />
    );
  };

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
            របាយការណ៍វត្តមាន
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>របាយការណ៍វត្តមាន</Title>
          <Text type="secondary">តាមដានវត្តមានសិស្ស និងកំណត់អត្តសញ្ញាណកុមារដែលត្រូវការការអន្តរាគមន៍</Text>
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
                title="អត្រាវត្តមានរួម"
                value={stats.overallAttendance}
                suffix="%"
                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="អវត្តមានថ្ងៃនេះ"
                value={stats.absentToday}
                prefix={<CloseCircleOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="អវត្តមានរ៉ាំរ៉ៃ"
                value={stats.chronicAbsentees}
                prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Alerts */}
        <Row gutter={16} className="mb-6">
          <Col span={24}>
            <Alert
              message="ការជូនដំណឹងអវត្តមាន"
              description="មានសិស្ស 5 នាក់ដែលអវត្តមានជាប់គ្នាជាង 3 ថ្ងៃ ត្រូវការការយកចិត្តទុកដាក់ពិសេស"
              type="warning"
              showIcon
              closable
            />
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
            <Col xs={24} sm={12} md={4}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                placeholder={['ពីកាលបរិច្ឆេទ', 'ដល់កាលបរិច្ឆេទ']}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button icon={<DownloadOutlined />}>ទាញយក</Button>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Attendance Content */}
        <Card>
          <Tabs defaultActiveKey="individual">
            <TabPane tab="វត្តមានបុគ្គល" key="individual">
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
            <TabPane tab="វត្តមានថ្ងៃនេះ" key="daily">
              <Table
                columns={dailyColumns}
                dataSource={dailyData}
                rowKey="class_name"
                loading={loading}
                scroll={{ x: 'max-content' }}
                pagination={false}
              />
            </TabPane>
            <TabPane tab="ប្រតិទិនវត្តមាន" key="calendar">
              <Calendar 
                dateCellRender={dateCellRender}
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </HorizontalLayout>
  );
}