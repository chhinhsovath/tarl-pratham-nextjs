'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Table,
  Tag,
  Space,
  Alert,
  Timeline,
  Badge,
  Tooltip,
  Button
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  SyncOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
import { Typography } from 'antd';

interface SystemHealth {
  total_users: number;
  active_users: number;
  total_schools: number;
  total_students: number;
  total_assessments: number;
  assessments_today: number;
  assessments_this_week: number;
  pending_verifications: number;
  active_periods: {
    baseline: number;
    midline: number;
    endline: number;
  };
  recent_activities: Array<{
    id: number;
    type: string;
    description: string;
    user_name: string;
    created_at: string;
  }>;
  system_stats: {
    database_size: string;
    uptime: string;
    last_backup: string;
  };
}

function CoordinatorMonitoringContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    fetchSystemHealth();
    const interval = setInterval(fetchSystemHealth, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchSystemHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coordinator/monitoring');
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching system health:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!health) {
    return <div>Loading...</div>;
  }

  const healthScore = Math.round(
    ((health.active_users / (health.total_users || 1)) * 25) +
    ((health.assessments_this_week / 100) * 25) +
    ((1 - (health.pending_verifications / (health.total_assessments || 1))) * 25) +
    25
  );

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { status: 'success', text: 'Excellent' };
    if (score >= 60) return { status: 'normal', text: 'Good' };
    if (score >= 40) return { status: 'warning', text: 'Fair' };
    return { status: 'exception', text: 'Poor' };
  };

  const healthStatus = getHealthStatus(healthScore);

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>តាមដានប្រព័ន្ធ</Title>
          <Text type="secondary">
            ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ: {dayjs(lastUpdate).format('DD/MM/YYYY HH:mm:ss')}
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchSystemHealth}
          loading={loading}
        >
          ផ្ទុកឡើងវិញ
        </Button>
      </div>

      {/* System Health Score */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Title level={4}>សុខភាពប្រព័ន្ធទូទៅ</Title>
              <Progress
                type="circle"
                percent={healthScore}
                status={healthStatus.status as any}
                width={200}
                format={(percent) => (
                  <div>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>{percent}%</div>
                    <div style={{ fontSize: 14 }}>{healthStatus.text}</div>
                  </div>
                )}
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Core Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="អ្នកប្រើប្រាស់សរុប"
              value={health.total_users}
              prefix={<UserOutlined />}
              suffix={
                <Tag color="green">
                  {health.active_users} សកម្ម
                </Tag>
              }
            />
            <Progress
              percent={Math.round((health.active_users / health.total_users) * 100)}
              size="small"
              strokeColor="#52c41a"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="សាលារៀនសរុប"
              value={health.total_schools}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="សិស្សសរុប"
              value={health.total_students}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="ការវាយតម្លៃសរុប"
              value={health.total_assessments}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Assessment Activity */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card title="ការវាយតម្លៃថ្ងៃនេះ">
            <Statistic
              value={health.assessments_today}
              prefix={<ClockCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontSize: 32 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="សប្តាហ៍នេះ">
            <Statistic
              value={health.assessments_this_week}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontSize: 32 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="រងចាំផ្ទៀងផ្ទាត់">
            <Statistic
              value={health.pending_verifications}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontSize: 32 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Active Assessment Periods */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="រយៈពេលវាយតម្លៃកំពុងដំណើរការ">
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="មូលដ្ឋានសកម្ម"
                    value={health.active_periods.baseline}
                    suffix="សាលារៀន"
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="កណ្តាលសកម្ម"
                    value={health.active_periods.midline}
                    suffix="សាលារៀន"
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="ចុងក្រោយសកម្ម"
                    value={health.active_periods.endline}
                    suffix="សាលារៀន"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="សកម្មភាពថ្មីៗ" extra={<Badge status="processing" text="ផ្ទាល់" />}>
            <Timeline mode="left">
              {health.recent_activities.slice(0, 10).map((activity) => (
                <Timeline.Item
                  key={activity.id}
                  color={
                    activity.type === 'assessment' ? 'blue' :
                    activity.type === 'verification' ? 'green' :
                    activity.type === 'user' ? 'purple' : 'gray'
                  }
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{activity.description}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                      By {activity.user_name} • {dayjs(activity.created_at).fromNow()}
                    </div>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* System Stats */}
      <Row gutter={16}>
        <Col span={24}>
          <Card title="ព័ត៌មានប្រព័ន្ធ">
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="ទំហំមូលដ្ឋានទិន្នន័យ"
                  value={health.system_stats.database_size}
                  prefix={<SyncOutlined spin />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="ពេលវេលាដំណើរការប្រព័ន្ធ"
                  value={health.system_stats.uptime}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="បម្រុងទុកចុងក្រោយ"
                  value={health.system_stats.last_backup}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default function CoordinatorMonitoringPage() {
  return (
    <HorizontalLayout>
      <CoordinatorMonitoringContent />
    </HorizontalLayout>
  );
}
