'use client';

import { Card, Row, Col, Progress, Space, Typography, Statistic } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ProgressSummaryProps {
  currentPeriod: 'baseline' | 'midline' | 'endline';
  periodLabel: string;
  studentsAssessed: number;
  studentsRemaining: number;
  totalStudents: number;
  progressPercentage: number;
}

export default function ProgressSummary({
  currentPeriod,
  periodLabel,
  studentsAssessed,
  studentsRemaining,
  totalStudents,
  progressPercentage
}: ProgressSummaryProps) {

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'baseline': return '#667eea';
      case 'midline': return '#f5576c';
      case 'endline': return '#4facfe';
      default: return '#667eea';
    }
  };

  const getProgressStatus = () => {
    if (progressPercentage >= 100) return { status: 'success', text: 'បានបញ្ចប់', icon: <TrophyOutlined /> };
    if (progressPercentage >= 75) return { status: 'success', text: 'ជិតបញ្ចប់', icon: <RiseOutlined /> };
    if (progressPercentage >= 50) return { status: 'active', text: 'កំពុងដំណើរការ', icon: <ClockCircleOutlined /> };
    return { status: 'active', text: 'ចាប់ផ្តើម', icon: <ClockCircleOutlined /> };
  };

  const status = getProgressStatus();
  const periodColor = getPeriodColor(currentPeriod);

  return (
    <Card
      style={{
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
      }}
    >
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* Header */}
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              {status.icon}
              <Title level={4} style={{ margin: 0 }}>
                {periodLabel}
              </Title>
            </Space>
          </Col>
          <Col>
            <Text
              strong
              style={{
                color: periodColor,
                fontSize: '16px',
                padding: '4px 12px',
                background: `${periodColor}20`,
                borderRadius: '8px'
              }}
            >
              {status.text}
            </Text>
          </Col>
        </Row>

        {/* Progress Bar */}
        <div>
          <Progress
            percent={progressPercentage}
            status={status.status as any}
            strokeColor={{
              '0%': periodColor,
              '100%': '#52c41a'
            }}
            strokeWidth={12}
            format={(percent) => (
              <Text strong style={{ fontSize: '18px' }}>
                {percent}%
              </Text>
            )}
          />
        </div>

        {/* Statistics */}
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Card
              size="small"
              style={{
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text>បានធ្វើរួច</Text>
                  </Space>
                }
                value={studentsAssessed}
                suffix={`/ ${totalStudents}`}
                valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              size="small"
              style={{
                background: '#fff7e6',
                border: '1px solid #ffd591',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                    <Text>នៅសល់</Text>
                  </Space>
                }
                value={studentsRemaining}
                suffix="នាក់"
                valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card
              size="small"
              style={{
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                textAlign: 'center'
              }}
            >
              <Statistic
                title={
                  <Space>
                    <TrophyOutlined style={{ color: periodColor }} />
                    <Text>សរុប</Text>
                  </Space>
                }
                value={totalStudents}
                suffix="នាក់"
                valueStyle={{ color: periodColor, fontSize: '24px' }}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );
}
