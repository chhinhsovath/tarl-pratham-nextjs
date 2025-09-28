'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Statistic, 
  Table,
  Select,
  DatePicker,
  Space,
  Typography,
  Tag,
  Progress,
  Modal,
  Form,
  Input,
  message,
  Dropdown,
  Popconfirm,
  Alert,
  Spin
} from 'antd';
import { 
  BarChartOutlined,
  FileTextOutlined,
  DownloadOutlined,
  TeamOutlined,
  TrophyOutlined,
  RiseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface CustomReport {
  id: number;
  name: string;
  description: string;
  type: string;
  filters: any;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingReport, setEditingReport] = useState<CustomReport | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      fetchReportData();
      fetchCustomReports();
    }
  }, [user]);

  const fetchReportData = async () => {
    if (!user) return;
    
    try {
      const params = new URLSearchParams({
        role: user.role,
        userId: user.id.toString(),
        ...(user.pilot_school_id && { pilotSchoolId: user.pilot_school_id.toString() })
      });

      const response = await fetch(`/api/dashboard/stats?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Report data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomReports = async () => {
    try {
      const response = await fetch('/api/reports/custom');
      if (response.ok) {
        const data = await response.json();
        setCustomReports(data.data || []);
      }
    } catch (error) {
      console.error('Custom reports fetch error:', error);
    }
  };

  const handleCreateReport = () => {
    setEditingReport(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditReport = (report: CustomReport) => {
    setEditingReport(report);
    form.setFieldsValue({
      name: report.name,
      description: report.description,
      type: report.type
    });
    setIsModalVisible(true);
  };

  const handleDeleteReport = async (id: number) => {
    try {
      const response = await fetch(`/api/reports/custom/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        message.success('លុបរបាយការណ៍បានជោគជ័យ');
        fetchCustomReports();
      } else {
        message.error('មានបញ្ហាក្នុងការលុបរបាយការណ៍');
      }
    } catch (error) {
      console.error('Delete report error:', error);
      message.error('មានបញ្ហាក្នុងការលុបរបាយការណ៍');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const url = editingReport ? `/api/reports/custom/${editingReport.id}` : '/api/reports/custom';
      const method = editingReport ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });
      
      if (response.ok) {
        message.success(editingReport ? 'កែសម្រួលរបាយការណ៍បានជោគជ័យ' : 'បង្កើតរបាយការណ៍បានជោគជ័យ');
        setIsModalVisible(false);
        fetchCustomReports();
      } else {
        message.error('មានបញ្ហាក្នុងការរក្សាទុករបាយការណ៍');
      }
    } catch (error) {
      console.error('Save report error:', error);
      message.error('មានបញ្ហាក្នុងការរក្សាទុករបាយការណ៍');
    }
  };

  const getCustomReportActions = (record: CustomReport) => {
    return [
      {
        key: 'view',
        label: 'មើលរបាយការណ៍',
        icon: <FileTextOutlined />,
        onClick: () => router.push(`/reports/custom/${record.id}`)
      },
      {
        key: 'edit',
        label: 'កែសម្រួល',
        icon: <EditOutlined />,
        onClick: () => handleEditReport(record)
      },
      {
        key: 'delete',
        label: 'លុប',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleDeleteReport(record.id)
      }
    ];
  };

  const reportCards = [
    {
      title: 'របាយការណ៍សមត្ថភាពសិស្ស',
      description: 'វិភាគលទ្ធផលរីកចម្រើនរបស់សិស្សតាមរយៈការវាយតម្លៃ',
      icon: <TrophyOutlined />,
      path: '/reports/student-performance',
      color: '#1890ff',
      permission: 'reports.view'
    },
    {
      title: 'របាយការណ៍ប្រៀបធៀបសាលា',
      description: 'ប្រៀបធៀបលទ្ធផលរវាងសាលាផ្សេងៗ',
      icon: <BarChartOutlined />,
      path: '/reports/school-comparison',
      color: '#52c41a',
      permission: 'reports.view'
    },
    {
      title: 'វិភាគការវាយតម្លៃ',
      description: 'វិភាគទិន្នន័យការវាយតម្លៃលម្អិត',
      icon: <FileTextOutlined />,
      path: '/reports/assessment-analysis',
      color: '#722ed1',
      permission: 'reports.view'
    },
    {
      title: 'ការតាមដានលទ្ធផល',
      description: 'តាមដានរីកចម្រើនរបស់សិស្សនៅក្នុងការរៀន',
      icon: <RiseOutlined />,
      path: '/reports/progress-tracking',
      color: '#fa8c16',
      permission: 'reports.view'
    },
    {
      title: 'ប្រសិទ្ធភាពការបង្រៀន',
      description: 'វិភាគប្រសិទ្ធភាពការចុះអប់រំ និងបង្រៀន',
      icon: <TeamOutlined />,
      path: '/reports/mentoring-impact',
      color: '#13c2c2',
      permission: 'mentoring.view'
    }
  ];

  const quickStats = stats ? [
    {
      title: 'ការវាយតម្លៃសរុប',
      value: stats.overview.total_assessments,
      suffix: 'ការវាយតម្លៃ',
      color: '#1890ff'
    },
    {
      title: 'សិស្សបានវាយតម្លៃ',
      value: stats.overview.total_students,
      suffix: 'សិស្ស',
      color: '#52c41a'
    },
    {
      title: 'ភាគរយបញ្ចប់ការវាយតម្លៃ',
      value: stats.overview.total_assessments > 0 ? 
        Math.round((stats.distributions.assessments_by_type.baseline || 0) / stats.overview.total_students * 100) : 0,
      suffix: '%',
      color: '#fa8c16'
    },
    {
      title: 'សកម្មភាពថ្មីៗ',
      value: stats.recent_activity.assessments_last_7_days,
      suffix: 'សប្តាហ៍នេះ',
      color: '#722ed1'
    }
  ] : [];

  // Show loading while checking permissions
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Show unauthorized if no permission
  if (!hasPermission(user, 'reports.view')) {
    return (
      <DashboardLayout>
        <Alert
          message="មិនមានសិទ្ធិចូលប្រើ"
          description="អ្នកមិនមានសិទ្ធិមើលរបាយការណ៍ទេ"
          type="error"
          showIcon
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title level={2}>របាយការណ៍ និងការវិភាគ</Title>
            <Text type="secondary">
              បង្កើតរបាយការណ៍ទូលំទូលាយ និងវិភាគទិន្នន័យកម្មវិធី TaRL
            </Text>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateReport}
          >
            បង្កើតរបាយការណ៍ផ្ទាល់ខ្លួន
          </Button>
        </div>
      </div>

      {/* Quick Statistics */}
      {!loading && stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          {quickStats.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Assessment Distribution */}
      {!loading && stats && (
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} lg={12}>
            <Card title="ការចង្កាយបញ្ញើស។សរុបប្រភេទការវាយតម្លៃ">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>រៀងសារ (មូលដ្ហាន)</Text>
                  <Text strong>{stats.distributions.assessments_by_type.baseline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.baseline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#1890ff"
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>កាលកណ្ដាល</Text>
                  <Text strong>{stats.distributions.assessments_by_type.midline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.midline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#faad14"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>ចុងក្រោយ</Text>
                  <Text strong>{stats.distributions.assessments_by_type.endline || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_type.endline || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#52c41a"
                />
              </div>
            </Card>
          </Col>
          
          <Col xs={24} lg={12}>
            <Card title="ការចង្កាយបញ្ញើស។សរុបតាមមុខវិជ្ជា">
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>ភាសាខ្មែរ</Text>
                  <Text strong>{stats.distributions.assessments_by_subject.khmer || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_subject.khmer || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#722ed1"
                />
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>គណិតវិទ្យា</Text>
                  <Text strong>{stats.distributions.assessments_by_subject.math || 0}</Text>
                </div>
                <Progress 
                  percent={
                    stats.overview.total_assessments > 0 ? 
                    Math.round((stats.distributions.assessments_by_subject.math || 0) / stats.overview.total_assessments * 100) : 0
                  }
                  strokeColor="#13c2c2"
                />
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Report Cards */}
      <Row gutter={[16, 16]}>
        {reportCards.map((report, index) => {
          if (!hasPermission(user, report.permission)) {
            return null;
          }
          
          return (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card 
                hoverable
                style={{ height: '100%' }}
                bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ 
                  fontSize: '24px', 
                  color: report.color, 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  {report.icon}
                </div>
                
                <Title level={4} style={{ textAlign: 'center', marginBottom: '8px' }}>
                  {report.title}
                </Title>
                
                <Text type="secondary" style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px',
                  flex: 1
                }}>
                  {report.description}
                </Text>
                
                <Button 
                  type="primary" 
                  block
                  onClick={() => router.push(report.path)}
                  style={{ backgroundColor: report.color, borderColor: report.color }}
                >
                  បង្កើតរបាយការណ៍
                </Button>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Custom Reports */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card 
            title="របាយការណ៍ផ្ទាល់ខ្លួន" 
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleCreateReport}
              >
                បង្កើតរបាយការណ៍ថ្មី
              </Button>
            }
          >
            <Table
              dataSource={customReports}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: 'ឈ្មោះរបាយការណ៍',
                  dataIndex: 'name',
                  key: 'name'
                },
                {
                  title: 'ពណ្ណនា',
                  dataIndex: 'description',
                  key: 'description',
                  ellipsis: true
                },
                {
                  title: 'ប្រភេទ',
                  dataIndex: 'type',
                  key: 'type',
                  render: (type: string) => <Tag color="blue">{type}</Tag>
                },
                {
                  title: 'កាលបរិច្ឆេទបង្កើត',
                  dataIndex: 'created_at',
                  key: 'created_at',
                  render: (date: string) => dayjs(date).format('DD/MM/YYYY')
                },
                {
                  title: 'សកម្មភាព',
                  key: 'actions',
                  render: (record: CustomReport) => (
                    <Dropdown 
                      menu={{ items: getCustomReportActions(record) }}
                      trigger={['click']}
                    >
                      <Button icon={<MoreOutlined />} />
                    </Dropdown>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Role-specific reports */}
      {user?.role === 'teacher' && (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="របាយការណ៍សម្រាប់គ្រូបង្រៀន">
              <Space wrap>
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={() => router.push('/reports/my-students')}
                >
                  របាយការណ៍សិស្សរបស់ខ្ញុំ
                </Button>
                <Button 
                  icon={<BarChartOutlined />}
                  onClick={() => router.push('/reports/class-progress')}
                >
                  លទ្ធផលថ្នាក់រៀន
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {user?.role === 'mentor' && (
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={24}>
            <Card title="របាយការណ៍សម្រាប់អ្នកនែនាំ">
              <Space wrap>
                <Button 
                  icon={<TeamOutlined />}
                  onClick={() => router.push('/reports/my-mentoring')}
                >
                  ការចុះអប់រំរបស់ខ្ញុំ
                </Button>
                <Button 
                  icon={<FileTextOutlined />}
                  onClick={() => router.push('/reports/school-visits')}
                >
                  របាយការណ៍ការចុះសាលា
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Export Options */}
      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={24}>
          <Card title="នាំចេញទិន្នន័យ">
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              នាំចេញទិន្នន័យទូលំទុលាយសម្រាប់ការវិភាគខាងក្រៅ
            </Text>
            <Space wrap>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // This would trigger a comprehensive export
                  window.open('/api/reports/export?type=comprehensive');
                }}
              >
                នាំចេញទិន្នន័យទាំងអស់ (Excel)
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={() => {
                  // This would trigger assessments export
                  window.open('/api/assessments/export');
                }}
              >
                នាំចេញការវាយតម្លៃ
              </Button>
              {hasPermission(user, 'mentoring.view') && (
                <Button 
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    // This would trigger mentoring export
                    window.open('/api/mentoring/export');
                  }}
                >
                  នាំចេញការចុះអប់រំ
                </Button>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
      {/* Custom Report Modal */}
      <Modal
        title={editingReport ? 'កែសម្រួលរបាយការណ៍' : 'បង្កើតរបាយការណ៍ថ្មី'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingReport ? 'រក្សាទុកការកែសម្រួល' : 'បង្កើត'}
        cancelText="បោះបង់"
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="ឈ្មោះរបាយការណ៍"
            rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះរបាយការណ៍' }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះរបាយការណ៍" />
          </Form.Item>
          
          <Form.Item 
            name="description" 
            label="ពណ្ណនា"
            rules={[{ required: true, message: 'សូមបញ្ចូលពណ្ណនា' }]}
          >
            <TextArea rows={3} placeholder="បញ្ចូលពណ្ណនាអំពីរបាយការណ៍" />
          </Form.Item>
          
          <Form.Item 
            name="type" 
            label="ប្រភេទរបាយការណ៍"
            rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទ' }]}
          >
            <Select placeholder="ជ្រើសរើសប្រភេទ">
              <Option value="សមត្ថភាពសិស្ស">សមត្ថភាពសិស្ស</Option>
              <Option value="វិភាគការវាយតម្លៃ">វិភាគការវាយតម្លៃ</Option>
              <Option value="ការប្រៀបធៀបសាលា">ការប្រៀបធៀបសាលា</Option>
              <Option value="ការចុះអប់រំ">ការចុះអប់រំ</Option>
              <Option value="ប្រសិទ្ធភាពកម្មវិធី">ប្រសិទ្ធភាពកម្មវិធី</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </DashboardLayout>
  );
}