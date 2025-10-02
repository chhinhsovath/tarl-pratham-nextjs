'use client';

import { Card, Descriptions, Tag, Space, Avatar, Divider, Row, Col, Typography } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BookOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface EnrichedStudentCardProps {
  student: {
    id: number;
    name: string;
    age?: number;
    gender?: string;
    baseline_khmer_level?: string;
    baseline_math_level?: string;
    midline_khmer_level?: string;
    midline_math_level?: string;
    endline_khmer_level?: string;
    endline_math_level?: string;
    teacher?: {
      id: number;
      name: string;
      email: string;
      username?: string;
      role: string;
      subject?: string;
      province?: string;
      district?: string;
      phone?: string;
    };
    school?: {
      id: number;
      school_name: string;
      school_code: string;
      province?: string;
      district?: string;
    };
    class?: {
      id: number;
      name: string;
      grade_level?: string;
    };
  };
  showTeacherInfo?: boolean;
  showSchoolInfo?: boolean;
  showAssessmentLevels?: boolean;
}

export default function EnrichedStudentCard({
  student,
  showTeacherInfo = true,
  showSchoolInfo = true,
  showAssessmentLevels = true
}: EnrichedStudentCardProps) {
  const getLevelColor = (level?: string) => {
    if (!level) return 'default';
    const levelColors: { [key: string]: string } = {
      'beginner': 'red',
      'letter': 'orange',
      'word': 'gold',
      'paragraph': 'green',
      'story': 'blue',
      'comprehension_1': 'purple',
      'comprehension_2': 'magenta'
    };
    return levelColors[level] || 'default';
  };

  return (
    <Card
      title={
        <Space>
          <Avatar size="large" icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0, fontFamily: 'Hanuman, sans-serif' }}>
              {student.name}
            </Title>
            <Text type="secondary">
              {student.age ? `អាយុ ${student.age} ឆ្នាំ` : ''}
              {student.gender ? ` | ${student.gender === 'male' ? 'ប្រុស' : 'ស្រី'}` : ''}
            </Text>
          </div>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      {/* Class Information */}
      {student.class && (
        <>
          <Descriptions column={1} size="small">
            <Descriptions.Item label={<><TeamOutlined /> ថ្នាក់</>}>
              <Tag color="blue">{student.class.name}</Tag>
              {student.class.grade_level && (
                <Text type="secondary"> (កម្រិត {student.class.grade_level})</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
        </>
      )}

      {/* School Information */}
      {showSchoolInfo && student.school && (
        <>
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>
            <BankOutlined /> ព័ត៌មានសាលា
          </Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="ឈ្មោះសាលា">
              <Text strong>{student.school.school_name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="លេខកូដ">
              <Tag>{student.school.school_code}</Tag>
            </Descriptions.Item>
            {student.school.province && (
              <Descriptions.Item label="ខេត្ត">
                <EnvironmentOutlined /> {student.school.province}
              </Descriptions.Item>
            )}
            {student.school.district && (
              <Descriptions.Item label="ស្រុក">
                {student.school.district}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Divider />
        </>
      )}

      {/* Teacher Information */}
      {showTeacherInfo && student.teacher && (
        <>
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>
            <UserOutlined /> ព័ត៌មានគ្រូបង្រៀន
          </Title>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="ឈ្មោះគ្រូ">
              <Text strong>{student.teacher.name}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="តួនាទី">
              <Tag color={
                student.teacher.role === 'admin' ? 'red' :
                student.teacher.role === 'coordinator' ? 'orange' :
                student.teacher.role === 'mentor' ? 'blue' :
                'green'
              }>
                {student.teacher.role.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="អ៊ីមែល">
              <MailOutlined /> <Text copyable={{ text: student.teacher.email }}>
                {student.teacher.email}
              </Text>
            </Descriptions.Item>
            {student.teacher.username && (
              <Descriptions.Item label="ឈ្មោះអ្នកប្រើប្រាស់">
                {student.teacher.username}
              </Descriptions.Item>
            )}
            {student.teacher.subject && (
              <Descriptions.Item label="មុខវិជ្ជា">
                <BookOutlined /> {student.teacher.subject}
              </Descriptions.Item>
            )}
            {student.teacher.phone && (
              <Descriptions.Item label="លេខទូរស័ព្ទ">
                <PhoneOutlined /> <Text copyable={{ text: student.teacher.phone }}>
                  {student.teacher.phone}
                </Text>
              </Descriptions.Item>
            )}
            {student.teacher.province && (
              <Descriptions.Item label="ខេត្តគ្រូ">
                <EnvironmentOutlined /> {student.teacher.province}
              </Descriptions.Item>
            )}
            {student.teacher.district && (
              <Descriptions.Item label="ស្រុកគ្រូ">
                {student.teacher.district}
              </Descriptions.Item>
            )}
          </Descriptions>
          <Divider />
        </>
      )}

      {/* Assessment Levels */}
      {showAssessmentLevels && (
        <>
          <Title level={5} style={{ fontFamily: 'Hanuman, sans-serif' }}>
            📊 កម្រិតការវាយតម្លៃ
          </Title>

          <Row gutter={[16, 16]}>
            {/* Baseline */}
            <Col span={8}>
              <Card size="small" title="តេស្តដើមគ្រា" bordered={false}>
                <Space direction="vertical" size="small">
                  <div>
                    <Text type="secondary">ខ្មែរ: </Text>
                    {student.baseline_khmer_level ? (
                      <Tag color={getLevelColor(student.baseline_khmer_level)}>
                        {student.baseline_khmer_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                  <div>
                    <Text type="secondary">គណិត: </Text>
                    {student.baseline_math_level ? (
                      <Tag color={getLevelColor(student.baseline_math_level)}>
                        {student.baseline_math_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Midline */}
            <Col span={8}>
              <Card size="small" title="តេស្តពាក់កណ្ដាលគ្រា" bordered={false}>
                <Space direction="vertical" size="small">
                  <div>
                    <Text type="secondary">ខ្មែរ: </Text>
                    {student.midline_khmer_level ? (
                      <Tag color={getLevelColor(student.midline_khmer_level)}>
                        {student.midline_khmer_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                  <div>
                    <Text type="secondary">គណិត: </Text>
                    {student.midline_math_level ? (
                      <Tag color={getLevelColor(student.midline_math_level)}>
                        {student.midline_math_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>

            {/* Endline */}
            <Col span={8}>
              <Card size="small" title="តេស្តចុងក្រោយគ្រា" bordered={false}>
                <Space direction="vertical" size="small">
                  <div>
                    <Text type="secondary">ខ្មែរ: </Text>
                    {student.endline_khmer_level ? (
                      <Tag color={getLevelColor(student.endline_khmer_level)}>
                        {student.endline_khmer_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                  <div>
                    <Text type="secondary">គណិត: </Text>
                    {student.endline_math_level ? (
                      <Tag color={getLevelColor(student.endline_math_level)}>
                        {student.endline_math_level}
                      </Tag>
                    ) : (
                      <Tag>មិនទាន់</Tag>
                    )}
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Card>
  );
}
