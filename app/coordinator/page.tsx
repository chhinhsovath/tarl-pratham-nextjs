'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Space,
  Table,
  Tag,
  Progress,
  Alert,
  Typography,
  Tabs,
  Badge,
  Timeline,
  List,
  Avatar,
  Tooltip
} from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  FileExcelOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  WarningOutlined,
  GlobalOutlined,
  BarChartOutlined,
  CalendarOutlined,
  UserAddOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface WorkspaceStats {
  total_schools: number;
  total_teachers: number;
  total_students: number;
  total_assessments: number;
  pending_verifications: number;
  recent_imports: number;
  active_mentoring_visits: number;
  languages_configured: number;
}

interface RecentActivity {
  id: string;
  type: 'import' | 'assessment' | 'mentoring' | 'user';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'error';
  user?: string;
}

function CoordinatorWorkspaceContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<WorkspaceStats>({
    total_schools: 0,
    total_teachers: 0,
    total_students: 0,
    total_assessments: 0,
    pending_verifications: 0,
    recent_imports: 0,
    active_mentoring_visits: 0,
    languages_configured: 2
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [importHistory, setImportHistory] = useState([]);

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/coordinator/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/coordinator/activities');
      if (activitiesResponse.ok) {
        const data = await activitiesResponse.json();
        setRecentActivities(data.activities || []);
      }

      // Fetch import history
      const importsResponse = await fetch('/api/bulk-import/history');
      if (importsResponse.ok) {
        const data = await importsResponse.json();
        setImportHistory(data.imports || []);
      }
    } catch (error) {
      console.error('Error fetching workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'នាំចូលអ្នកប្រើប្រាស់ជាបណ្តុំ',
      icon: <UserAddOutlined style={{ fontSize: 24 }} />,
      color: '#1890ff',
      description: 'នាំចូលគ្រូបង្រៀន និងអ្នកណែនាំពី Excel',
      path: '/coordinator/imports/users'
    },
    {
      title: 'នាំចូលសាលារៀន',
      icon: <BankOutlined style={{ fontSize: 24 }} />,
      color: '#52c41a',
      description: 'នាំចូលទិន្នន័យសាលារៀនជាបណ្តុំ',
      path: '/coordinator/imports/schools'
    },
    {
      title: 'នាំចូលសិស្ស',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#722ed1',
      description: 'នាំចូលកំណត់ត្រាសិស្ស',
      path: '/coordinator/imports/students'
    },
    {
      title: 'ការកំណត់ភាសា',
      icon: <GlobalOutlined style={{ fontSize: 24 }} />,
      color: '#13c2c2',
      description: 'កំណត់ការបកប្រែភាសា',
      path: '/coordinator/languages'
    },
    {
      title: 'រយៈពេលវាយតម្លៃ',
      icon: <CalendarOutlined style={{ fontSize: 24 }} />,
      color: '#fa8c16',
      description: 'គ្រប់គ្រងរយៈពេលវាយតម្លៃ',
      path: '/assessments/periods'
    },
    {
      title: 'ជួរផ្ទៀងផ្ទាត់',
      icon: <FileDoneOutlined style={{ fontSize: 24 }} />,
      color: '#eb2f96',
      description: 'ពិនិត្យការវាយតម្លៃរងចាំ',
      path: '/assessments/verify'
    },
    {
      title: 'របាយការណ៍ប្រព័ន្ធ',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#faad14',
      description: 'បង្កើតរបាយការណ៍ទូលំទូលាយ',
      path: '/reports'
    },
    {
      title: 'តាមដានប្រព័ន្ធ',
      icon: <DashboardOutlined style={{ fontSize: 24 }} />,
      color: '#a0d911',
      description: 'តាមដានសុខភាពប្រព័ន្ធ',
      path: '/coordinator/monitoring'
    }
  ];

  const importHistoryColumns = [
    {
      title: 'Type',
      dataIndex: 'import_type',
      key: 'type',
      render: (type: string) => {
        const colors: any = {
          users: 'blue',
          schools: 'green',
          students: 'purple',
          assessments: 'orange'
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'File',
      dataIndex: 'file_name',
      key: 'file',
      ellipsis: true
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any, record: any) => {
        const percent = record.total_rows > 0 
          ? Math.round((record.successful_rows / record.total_rows) * 100)
          : 0;
        return (
          <div style={{ width: 100 }}>
            <Progress 
              percent={percent} 
              size="small"
              status={record.status === 'failed' ? 'exception' : record.status === 'completed' ? 'success' : 'active'}
            />
            <Text style={{ fontSize: '11px' }}>
              {record.successful_rows}/{record.total_rows}
            </Text>
          </div>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: any = {
          pending: { color: 'orange', icon: <SyncOutlined spin /> },
          processing: { color: 'blue', icon: <SyncOutlined spin /> },
          completed: { color: 'green', icon: <CheckCircleOutlined /> },
          failed: { color: 'red', icon: <WarningOutlined /> }
        };
        const config = statusConfig[status];
        return (
          <Tag color={config?.color} icon={config?.icon}>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YY HH:mm')
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'import':
        return <CloudUploadOutlined />;
      case 'assessment':
        return <FileDoneOutlined />;
      case 'mentoring':
        return <TeamOutlined />;
      case 'user':
        return <UserAddOutlined />;
      default:
        return <ExclamationCircleOutlined />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#52c41a';
      case 'error':
        return '#ff4d4f';
      case 'pending':
        return '#faad14';
      default:
        return '#1890ff';
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              កន្លែងធ្វើការអ្នកសម្របសម្រួល
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              គ្រប់គ្រងប្រតិបត្តិការជាបណ្តុំ ការកំណត់ប្រព័ន្ធ និងតាមដានសកម្មភាពវេទិកា
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={() => router.push('/coordinator/imports')}
              >
                នាំចូលជាបណ្តុំ
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => router.push('/coordinator/settings')}
              >
                ការកំណត់
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Overview */}
      {/* Statistics Cards - Using verification page pattern */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="សាលារៀនសរុប"
              value={stats.total_schools}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="គ្រូបង្រៀនសរុប"
              value={stats.total_teachers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="សិស្សសរុប"
              value={stats.total_students}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="ការផ្ទៀងផ្ទាត់រងចាំ"
              value={stats.pending_verifications}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: stats.pending_verifications > 0 ? '#faad14' : '#52c41a' }}
            />
            {stats.pending_verifications > 0 && (
              <Button
                type="link"
                size="small"
                onClick={() => router.push('/assessments/verify')}
                style={{ padding: 0, marginTop: 8 }}
              >
                ពិនិត្យឥឡូវ →
              </Button>
            )}
          </Card>
        </Col>
      </Row>

      {/* Quick Actions Grid */}
      <Card title="សកម្មភាពរហ័ស" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {quickActions.map((action, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                hoverable
                onClick={() => router.push(action.path)}
                style={{ textAlign: 'center', height: '100%' }}
              >
                <div style={{ 
                  width: 60, 
                  height: 60, 
                  margin: '0 auto 16px',
                  background: `${action.color}20`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: action.color }}>
                    {action.icon}
                  </span>
                </div>
                <Title level={5} style={{ marginBottom: 8 }}>
                  {action.title}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {action.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Activity Tabs */}
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <SyncOutlined /> សកម្មភាពថ្មីៗ
              </span>
            }
            key="1"
          >
            {recentActivities.length > 0 ? (
              <Timeline>
                {recentActivities.map((activity) => (
                  <Timeline.Item
                    key={activity.id}
                    dot={
                      <div style={{
                        color: getActivityColor(activity.status),
                        fontSize: 16
                      }}>
                        {getActivityIcon(activity.type)}
                      </div>
                    }
                  >
                    <div>
                      <Text strong>{activity.title}</Text>
                      {activity.user && (
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          ដោយ {activity.user}
                        </Text>
                      )}
                      <div>
                        <Text type="secondary">{activity.description}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {dayjs(activity.timestamp).format('DD/MM/YYYY HH:mm')}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">មិនមានសកម្មភាពថ្មី</Text>
              </div>
            )}
          </TabPane>

          <TabPane
            tab={
              <span>
                <FileExcelOutlined /> ប្រវត្តិនាំចូល
                {stats.recent_imports > 0 && (
                  <Badge count={stats.recent_imports} style={{ marginLeft: 8 }} />
                )}
              </span>
            }
            key="2"
          >
            <Table scroll={{ x: "max-content" }}
              dataSource={importHistory}
              columns={importHistoryColumns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              size="small"
            />
          </TabPane>

          <TabPane
            tab={
              <span>
                <WarningOutlined /> ការព្រមានប្រព័ន្ធ
              </span>
            }
            key="3"
          >
            <List
              dataSource={[
                {
                  title: 'Assessment Period Ending',
                  description: '5 schools have baseline assessment period ending in 3 days',
                  type: 'warning'
                },
                {
                  title: 'Unverified Assessments',
                  description: `${stats.pending_verifications} assessments pending verification for over 48 hours`,
                  type: 'warning'
                },
                {
                  title: 'Import Success',
                  description: 'Successfully imported 150 students yesterday',
                  type: 'success'
                }
              ]}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: item.type === 'warning' ? '#faad14' : '#52c41a'
                        }}
                        icon={item.type === 'warning' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
                      />
                    }
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* System Health Alert */}
      <Alert
        message="សុខភាពប្រព័ន្ធ"
        description={
          <Row gutter={16}>
            <Col span={6}>
              <Text>មូលដ្ឋានទិន្នន័យ: </Text>
              <Tag color="green">ល្អ</Tag>
            </Col>
            <Col span={6}>
              <Text>ការឆ្លើយតប API: </Text>
              <Tag color="green">លឿន (120ms)</Tag>
            </Col>
            <Col span={6}>
              <Text>ទំហំផ្ទុក: </Text>
              <Tag color="orange">75% ប្រើ</Tag>
            </Col>
            <Col span={6}>
              <Text>បម្រុងទុកចុងក្រោយ: </Text>
              <Tag color="green">២ ម៉ោងមុន</Tag>
            </Col>
          </Row>
        }
        type="info"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
}

export default function CoordinatorWorkspacePage() {
  return (
    <HorizontalLayout>
      <CoordinatorWorkspaceContent />
    </HorizontalLayout>
  );
}