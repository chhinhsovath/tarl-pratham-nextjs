// Laravel Blade-like Component: ClassPerformanceWidget
// Equivalent to: resources/views/teacher/components/class-performance-widget.blade.php

import React from 'react';
import { Card, Row, Col, Statistic, Progress, Space, Typography, Divider } from 'antd';
import { 
  TrophyOutlined, 
  UserOutlined, 
  BarChartOutlined, 
  RiseOutlined,
  FallOutlined,
  MinusOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface ClassPerformanceData {
  total_students: number;
  class_average: number;
  improvement_rate: number;
  subject_breakdown: {
    subject: string;
    average: number;
    improvement: number;
    students_above_target: number;
    total_students: number;
  }[];
  performance_distribution: {
    excellent: number;  // 80-100%
    good: number;       // 60-79%
    fair: number;       // 40-59%
    poor: number;       // 0-39%
  };
}

interface ClassPerformanceWidgetProps {
  data: ClassPerformanceData;
  period?: 'week' | 'month' | 'term';
}

// Laravel-style Helper Class
class PerformanceHelper {
  static getImprovementIcon(rate: number) {
    if (rate > 0) return <RiseOutlined style={{ color: '#52c41a' }} />;
    if (rate < 0) return <FallOutlined style={{ color: '#ff4d4f' }} />;
    return <MinusOutlined style={{ color: '#faad14' }} />;
  }

  static getImprovementColor(rate: number) {
    if (rate > 15) return '#52c41a';
    if (rate > 5) return '#1890ff';
    if (rate > -5) return '#faad14';
    return '#ff4d4f';
  }

  static getPerformanceColor(average: number) {
    if (average >= 80) return '#52c41a';
    if (average >= 60) return '#1890ff';
    if (average >= 40) return '#faad14';
    return '#ff4d4f';
  }

  static formatSubjectName(subject: string) {
    const subjectMap = {
      'khmer': 'ភាសាខ្មែរ',
      'math': 'គណិតវិទ្យា',
      'science': 'វិទ្យាសាស្ត្រ',
      'english': 'ភាសាអង់គ្លេស'
    };
    return subjectMap[subject as keyof typeof subjectMap] || subject;
  }

  static getPeriodText(period: string) {
    const periodMap = {
      week: 'សប្តាហ៍នេះ',
      month: 'ខែនេះ',
      term: 'ឆមាសនេះ'
    };
    return periodMap[period as keyof typeof periodMap] || 'ពេលនេះ';
  }
}

const ClassPerformanceWidget: React.FC<ClassPerformanceWidgetProps> = ({ 
  data, 
  period = 'month' 
}) => {
  const totalStudents = data.total_students;
  const { performance_distribution } = data;

  return (
    <Card 
      title={
        <Space>
          <BarChartOutlined style={{ color: '#1890ff' }} />
          <span>ការអនុវត្តថ្នាក់រៀន - {PerformanceHelper.getPeriodText(period)}</span>
        </Space>
      }
      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        
        {/* Overall Statistics */}
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="ចំនួនសិស្សសរុប"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ fontSize: '18px' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="ពិន្ទុមធ្យម"
              value={data.class_average}
              suffix="%"
              valueStyle={{ 
                fontSize: '18px',
                color: PerformanceHelper.getPerformanceColor(data.class_average)
              }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="អត្រាកែលម្អ"
              value={Math.abs(data.improvement_rate)}
              suffix="%"
              prefix={PerformanceHelper.getImprovementIcon(data.improvement_rate)}
              valueStyle={{ 
                fontSize: '18px',
                color: PerformanceHelper.getImprovementColor(data.improvement_rate)
              }}
            />
          </Col>
        </Row>

        <Divider style={{ margin: '12px 0' }} />

        {/* Subject Breakdown */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>ការវិភាគតាមមុខវិជ្ជា</Title>
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            {data.subject_breakdown.map((subject, index) => (
              <div key={index}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: 4
                }}>
                  <Text strong style={{ fontSize: '13px' }}>
                    {PerformanceHelper.formatSubjectName(subject.subject)}
                  </Text>
                  <Space size="small">
                    <Text style={{ fontSize: '12px' }}>
                      {subject.average}%
                    </Text>
                    <Text 
                      style={{ 
                        fontSize: '12px',
                        color: PerformanceHelper.getImprovementColor(subject.improvement)
                      }}
                    >
                      {subject.improvement > 0 ? '+' : ''}{subject.improvement}%
                    </Text>
                  </Space>
                </div>
                
                <Progress
                  percent={subject.average}
                  strokeColor={PerformanceHelper.getPerformanceColor(subject.average)}
                  size="small"
                  format={() => (
                    <span style={{ fontSize: '10px' }}>
                      {subject.students_above_target}/{subject.total_students}
                    </span>
                  )}
                />
                
                <Text 
                  type="secondary" 
                  style={{ fontSize: '11px', display: 'block', marginTop: 2 }}
                >
                  {subject.students_above_target} ក្នុងចំណោម {subject.total_students} សិស្សឈានដល់គោលដៅ
                </Text>
              </div>
            ))}
          </Space>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Performance Distribution */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>ការចែកចាយការអនុវត្ត</Title>
          <Row gutter={8}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#52c41a', 
                  borderRadius: '4px', 
                  padding: '8px',
                  marginBottom: '4px'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {performance_distribution.excellent}
                  </Text>
                </div>
                <Text style={{ fontSize: '11px' }}>ប្រសើរ</Text>
                <br />
                <Text style={{ fontSize: '10px' }} type="secondary">80-100%</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#1890ff', 
                  borderRadius: '4px', 
                  padding: '8px',
                  marginBottom: '4px'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {performance_distribution.good}
                  </Text>
                </div>
                <Text style={{ fontSize: '11px' }}>ល្អ</Text>
                <br />
                <Text style={{ fontSize: '10px' }} type="secondary">60-79%</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#faad14', 
                  borderRadius: '4px', 
                  padding: '8px',
                  marginBottom: '4px'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {performance_distribution.fair}
                  </Text>
                </div>
                <Text style={{ fontSize: '11px' }}>មធ្យម</Text>
                <br />
                <Text style={{ fontSize: '10px' }} type="secondary">40-59%</Text>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  backgroundColor: '#ff4d4f', 
                  borderRadius: '4px', 
                  padding: '8px',
                  marginBottom: '4px'
                }}>
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {performance_distribution.poor}
                  </Text>
                </div>
                <Text style={{ fontSize: '11px' }}>ត្រូវកែលម្អ</Text>
                <br />
                <Text style={{ fontSize: '10px' }} type="secondary">0-39%</Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* Summary Insight */}
        <div style={{ 
          backgroundColor: '#f6f6f6', 
          padding: '12px', 
          borderRadius: '6px',
          marginTop: '8px'
        }}>
          <Text style={{ fontSize: '12px' }}>
            <TrophyOutlined style={{ color: '#faad14', marginRight: '4px' }} />
            <strong>សង្ខេប:</strong> ថ្នាក់របស់អ្នកមាន{' '}
            <Text style={{ color: '#52c41a' }}>
              {performance_distribution.excellent + performance_distribution.good} សិស្ស
            </Text>{' '}
            ដែលមានការអនុវត្តល្អ និង{' '}
            <Text style={{ color: data.improvement_rate > 0 ? '#52c41a' : '#ff4d4f' }}>
              កែលម្អ {Math.abs(data.improvement_rate)}%
            </Text>{' '}
            ក្នុង{PerformanceHelper.getPeriodText(period)}។
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ClassPerformanceWidget;