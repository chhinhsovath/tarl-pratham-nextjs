// Laravel Blade-like Component: StudentProgressCard
// Equivalent to: resources/views/teacher/components/student-progress-card.blade.php

import React from 'react';
import { Card, Progress, Space, Typography, Tag, Avatar, Tooltip } from 'antd';
import { UserOutlined, TrophyOutlined, WarningOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

interface StudentProgressCardProps {
  student: {
    id: number;
    student_name: string;
    grade_level: string;
    recent_score: number;
    baseline_score: number;
    target_score: number;
    last_assessment: string;
    improvement_rate: number;
    status: 'excellent' | 'good' | 'needs_attention' | 'at_risk';
    subject: string;
  };
  onClick?: (studentId: number) => void;
}

// Laravel-style Helper Functions (similar to Blade directives)
const TeacherHelper = {
  getStatusConfig: (status: string) => {
    const configs = {
      excellent: { color: '#52c41a', text: 'ប្រសើរបំផុត', icon: <TrophyOutlined /> },
      good: { color: '#1890ff', text: 'ល្អ', icon: <UserOutlined /> },
      needs_attention: { color: '#faad14', text: 'ត្រូវការកែលម្អ', icon: <WarningOutlined /> },
      at_risk: { color: '#ff4d4f', text: 'មានហានិភ័យ', icon: <WarningOutlined /> }
    };
    return configs[status as keyof typeof configs] || configs.good;
  },

  formatGrade: (grade: string) => {
    const gradeMap = {
      grade_4: 'ថ្នាក់ទី៤',
      grade_5: 'ថ្នាក់ទី៥'
    };
    return gradeMap[grade as keyof typeof gradeMap] || grade;
  },

  getProgressColor: (score: number, target: number) => {
    const percentage = (score / target) * 100;
    if (percentage >= 90) return '#52c41a';
    if (percentage >= 70) return '#1890ff';
    if (percentage >= 50) return '#faad14';
    return '#ff4d4f';
  },

  formatDaysAgo: (date: string) => {
    const daysAgo = dayjs().diff(dayjs(date), 'day');
    if (daysAgo === 0) return 'ថ្ងៃនេះ';
    if (daysAgo === 1) return 'ម្សិលមិញ';
    return `${daysAgo} ថ្ងៃមុន`;
  }
};

const StudentProgressCard: React.FC<StudentProgressCardProps> = ({ student, onClick }) => {
  const statusConfig = TeacherHelper.getStatusConfig(student.status);
  const progressColor = TeacherHelper.getProgressColor(student.recent_score, student.target_score);
  const progressPercentage = Math.min((student.recent_score / student.target_score) * 100, 100);

  return (
    <Card
      size="small"
      hoverable
      onClick={() => onClick?.(student.id)}
      style={{
        borderLeft: `4px solid ${statusConfig.color}`,
        marginBottom: 12
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {/* Student Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Avatar 
              size="small" 
              style={{ backgroundColor: statusConfig.color }}
              icon={statusConfig.icon}
            />
            <div>
              <Text strong style={{ fontSize: '14px' }}>{student.student_name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {TeacherHelper.formatGrade(student.grade_level)} • {student.subject}
              </Text>
            </div>
          </Space>
          <Tag color={statusConfig.color} size="small">
            {statusConfig.text}
          </Tag>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: '12px' }}>
              ពិន្ទុ: {student.recent_score}%
            </Text>
            <Text style={{ fontSize: '12px' }} type="secondary">
              គោលដៅ: {student.target_score}%
            </Text>
          </div>
          <Progress
            percent={progressPercentage}
            strokeColor={progressColor}
            size="small"
            format={() => (
              <span style={{ fontSize: '10px' }}>
                {student.improvement_rate > 0 ? '+' : ''}{student.improvement_rate}%
              </span>
            )}
          />
        </div>

        {/* Assessment Info */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text style={{ fontSize: '11px' }} type="secondary">
              មូលដ្ឋាន: {student.baseline_score}%
            </Text>
            <span style={{ margin: '0 8px', color: '#d9d9d9' }}>|</span>
            <Text style={{ fontSize: '11px' }} type="secondary">
              កែលម្អ: {student.improvement_rate > 0 ? '+' : ''}{student.improvement_rate}%
            </Text>
          </div>
          <Tooltip title={`ការវាយតម្លៃចុងក្រោយ: ${dayjs(student.last_assessment).format('DD/MM/YYYY')}`}>
            <Text style={{ fontSize: '11px' }} type="secondary">
              {TeacherHelper.formatDaysAgo(student.last_assessment)}
            </Text>
          </Tooltip>
        </div>
      </Space>
    </Card>
  );
};

export default StudentProgressCard;