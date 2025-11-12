'use client';

import React, { useEffect, useState } from 'react';
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
  Tooltip,
  Spin
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
  BarChartOutlined,
  CalendarOutlined,
  UserAddOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  BookOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { message as antdMessage } from 'antd';
import dayjs from 'dayjs';
import AssessmentCycleChart from '@/components/charts/AssessmentCycleChart';
import SubjectComparisonChart from '@/components/charts/SubjectComparisonChart';
import LevelDistributionChart from '@/components/charts/LevelDistributionChart';
import StackedPercentageBarChart from '@/components/charts/StackedPercentageBarChart';
import ComprehensiveExportButton from '@/components/export/ComprehensiveExportButton';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface WorkspaceStats {
  total_schools: number;
  total_teachers: number;
  total_mentors: number;
  total_students: number;
  total_assessments: number;
  pending_verifications: number;
  recent_imports: number;
  active_mentoring_visits: number;
  languages_configured: number;
  assessments?: {
    total: number;
    today: number;
    this_week: number;
    this_month: number;
    by_type: {
      baseline: number;
      midline: number;
      endline: number;
    };
    by_creator: {
      mentor: number;
      teacher: number;
    };
    by_subject: {
      language: number;
      math: number;
    };
    by_level?: Array<{
      level: string;
      khmer: number;
      math: number;
    }>;
    pending_verification: number;
    overall_results_khmer?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
    overall_results_math?: Array<{
      cycle: string;
      levels: Record<string, number>;
    }>;
  };
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

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [statsLoading, setStatsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [importsLoading, setImportsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<'khmer' | 'math'>('khmer');
  const [stats, setStats] = useState<WorkspaceStats>({
    total_schools: 0,
    total_teachers: 0,
    total_mentors: 0,
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
    // SEQUENTIAL LOADING - One at a time to prevent connection exhaustion
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    // CRITICAL: ONLY LOAD STATS - No activities, no imports to minimize connections
    setStatsLoading(true);
    try {
      const statsResponse = await fetch('/api/coordinator/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }

    // REMOVED: Activities API call (caused connection exhaustion)
    // REMOVED: Imports API call (reduce connections further)
  };

  const handleRefreshStats = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/admin/refresh-stats', {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        antdMessage.success('ស្ថិតិត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ');
        // Reload stats from cache
        await fetchWorkspaceData();
      } else {
        const error = await response.json();
        antdMessage.error(error.error || 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថិតិ');
      }
    } catch (error) {
      console.error('Error refreshing stats:', error);
      antdMessage.error('បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថិតិ');
    } finally {
      setRefreshing(false);
    }
  };

  const quickActions = [
    {
      title: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
      icon: <UserAddOutlined style={{ fontSize: 24 }} />,
      color: '#1890ff',
      description: 'មើល កែប្រែ លុប និងកំណត់ពាក្យសម្ងាត់ឡើងវិញ',
      path: '/users'
    },
    {
      title: 'គ្រប់គ្រងសាលារៀន',
      icon: <BankOutlined style={{ fontSize: 24 }} />,
      color: '#52c41a',
      description: 'បន្ថែម កែប្រែ និងលុបសាលារៀន',
      path: '/schools'
    },
    {
      title: 'គ្រប់គ្រងសិស្ស',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#722ed1',
      description: 'បើទំព័រគ្រប់គ្រងសិស្ស',
      path: '/students-management'
    },
    {
      title: 'ចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យ',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#13c2c2',
      description: 'ចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យទៅសាលារៀនសម្រាប់មុខវិជ្ជា',
      path: '/coordinator/mentor-assignments'
    },
    {
      title: 'ចាត់តាំងគ្រូបង្រៀន',
      icon: <TeamOutlined style={{ fontSize: 24 }} />,
      color: '#52c41a',
      description: 'ចាត់តាំងគ្រូបង្រៀនទៅថ្នាក់រៀននិងសាលារៀន',
      path: '/coordinator/teacher-assignments'
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
      title: 'របាយការណ៍ទូទៅសាលារៀន',
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      color: '#faad14',
      description: 'ទិដ្ឋភាពទូទៅសិស្ស ការវាយតម្លៃ និងការណែនាំ',
      path: '/reports/school-overview'
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
              កន្លែងធ្វើការអ្នកគ្រប់គ្រងប្រព័ន្ធ
            </Title>
            <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
              គ្រប់គ្រងប្រតិបត្តិការជាបណ្តុំ ការកំណត់ប្រព័ន្ធ និងតាមដានសកម្មភាពវេទិកា
            </Paragraph>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefreshStats}
                loading={refreshing}
                title="ធ្វើបច្ចុប្បន្នភាពស្ថិតិ (Refresh Statistics)"
              >
                ធ្វើបច្ចុប្បន្នភាព
              </Button>
              <ComprehensiveExportButton variant="default" size="middle" />
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={() => router.push('/coordinator/imports')}
              >
                នាំចូលជាបណ្តុំ
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => router.push('/settings')}
              >
                ការកំណត់
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Overview - Laravel Style */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card style={{ backgroundColor: '#eff6ff', borderRadius: 8 }}>
            <Statistic
              title="និស្សិតសរុប"
              value={stats.total_students}
              prefix={<TeamOutlined style={{ fontSize: 24, color: '#2563eb' }} />}
              valueStyle={{ color: '#1e40af', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card style={{ backgroundColor: '#f0fdf4', borderRadius: 8 }}>
            <Statistic
              title="ការវាយតម្លៃ"
              value={stats.total_assessments}
              prefix={<FileDoneOutlined style={{ fontSize: 24, color: '#16a34a' }} />}
              valueStyle={{ color: '#15803d', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card style={{ backgroundColor: '#fefce8', borderRadius: 8 }}>
            <Statistic
              title="សាលារៀន"
              value={stats.total_schools}
              prefix={<BankOutlined style={{ fontSize: 24, color: '#ca8a04' }} />}
              valueStyle={{ color: '#a16207', fontSize: 32 }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={6}>
          <Card style={{ backgroundColor: '#faf5ff', borderRadius: 8 }}>
            <Statistic
              title="ដំណើរទស្សនកិច្ច"
              value={stats.active_mentoring_visits}
              prefix={<TeamOutlined style={{ fontSize: 24, color: '#9333ea' }} />}
              valueStyle={{ color: '#7e22ce', fontSize: 32 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Assessment Results Section with Subject Toggle */}
      {stats.total_assessments > 0 && (stats.assessments?.overall_results_khmer || stats.assessments?.overall_results_math) && (
        <Card title="លទ្ធផលការវាយតម្លៃ" style={{ marginBottom: 24 }}>
          {/* Subject Toggle Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
            <Button
              type={selectedSubject === 'khmer' ? 'primary' : 'default'}
              onClick={() => setSelectedSubject('khmer')}
              style={{
                backgroundColor: selectedSubject === 'khmer' ? '#3b82f6' : '#e5e7eb',
                color: selectedSubject === 'khmer' ? 'white' : '#374151',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              ខ្មែរ
            </Button>
            <Button
              type={selectedSubject === 'math' ? 'primary' : 'default'}
              onClick={() => setSelectedSubject('math')}
              style={{
                backgroundColor: selectedSubject === 'math' ? '#3b82f6' : '#e5e7eb',
                color: selectedSubject === 'math' ? 'white' : '#374151',
                border: 'none',
                transition: 'all 0.2s'
              }}
            >
              គណិតវិទ្យា
            </Button>
          </div>

          {/* Overall Results Chart */}
          {selectedSubject === 'khmer' && stats.assessments?.overall_results_khmer && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_khmer}
              title="លទ្ធផលសរុប - ខ្មែរ"
            />
          )}

          {selectedSubject === 'math' && stats.assessments?.overall_results_math && (
            <StackedPercentageBarChart
              data={stats.assessments.overall_results_math}
              title="លទ្ធផលសរុប - គណិតវិទ្យា"
            />
          )}
        </Card>
      )}

      {/* Charts Section - 2 columns */}
      {stats.total_assessments > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={24} md={12}>
            <AssessmentCycleChart
              data={stats.assessments?.by_type || { baseline: 0, midline: 0, endline: 0 }}
              title="ការប្រៀបធៀបតាមវដ្តវាយតម្លៃ"
              type="bar"
            />
          </Col>
          <Col xs={24} sm={24} md={12}>
            <SubjectComparisonChart
              data={stats.assessments?.by_subject || { language: 0, math: 0 }}
              title="ការប្រៀបធៀបតាមមុខវិជ្ជា"
            />
          </Col>
        </Row>
      )}

      {/* Level Distribution Chart - Full Width */}
      {stats.assessments?.by_level && stats.assessments.by_level.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <LevelDistributionChart
              data={stats.assessments.by_level}
              title="ការចែកចាយសិស្សតាមកម្រិតវាយតម្លៃ"
            />
          </Col>
        </Row>
      )}

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
