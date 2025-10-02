'use client';

import { Descriptions, Space, Typography, Card, Button, Tag } from 'antd';
import { EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  getAssessmentTypeLabelKM,
  getSubjectLabelKM,
  getLevelLabelKM
} from '@/lib/constants/assessment-levels';
import { WizardData } from '../AssessmentWizard';

const { Title, Text } = Typography;

interface ReviewStepProps {
  data: WizardData;
  onEdit: (step: number) => void;
}

export default function ReviewStep({ data, onEdit }: ReviewStepProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
        <Title level={4} style={{ marginTop: '16px' }}>
          ពិនិត្យនិងបញ្ជាក់ទិន្នន័យ
        </Title>
        <Text type="secondary">
          សូមពិនិត្យទិន្នន័យខាងក្រោមមុនពេលរក្សាទុក
        </Text>
      </div>

      <Card
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text strong>ព័ត៌មានសិស្ស</Text>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(0)}
            >
              កែសម្រួល
            </Button>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="ឈ្មោះសិស្ស">
            <Text strong style={{ fontSize: '16px' }}>
              {data.student_name || 'N/A'}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="លេខសម្គាល់">
            #{data.student_id}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text strong>ព័ត៌មានការវាយតម្លៃ</Text>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(1)}
            >
              កែសម្រួល
            </Button>
          </Space>
        }
      >
        <Descriptions column={1}>
          <Descriptions.Item label="ប្រភេទការវាយតម្លៃ">
            <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {getAssessmentTypeLabelKM(data.assessment_type)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="មុខវិជ្ជា">
            <Tag color="purple" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {getSubjectLabelKM(data.subject)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="កម្រិតសិស្ស">
            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
              {data.level ? getLevelLabelKM(data.subject, data.level) : 'N/A'}
            </Tag>
          </Descriptions.Item>
          {data.score !== undefined && (
            <Descriptions.Item label="ពិន្ទុ">
              <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                {data.score}/100
              </Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="កាលបរិច្ឆេទ">
            {dayjs(data.assessed_date).format('DD/MM/YYYY')}
          </Descriptions.Item>
          {data.notes && (
            <Descriptions.Item label="កំណត់ចំណាំ">
              <Text>{data.notes}</Text>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card
        style={{
          background: '#e6f7ff',
          border: '1px solid #91d5ff'
        }}
      >
        <Space direction="vertical" size={4}>
          <Text strong style={{ color: '#0050b3' }}>
            📝 ការរក្សាទុកទិន្នន័យ
          </Text>
          <Text style={{ fontSize: '13px' }}>
            • ទិន្នន័យនឹងត្រូវរក្សាទុកក្នុងប្រព័ន្ធភ្លាមៗ
          </Text>
          <Text style={{ fontSize: '13px' }}>
            • កម្រិតសិស្សនឹងត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយស្វ័យប្រវត្តិ
          </Text>
          <Text style={{ fontSize: '13px' }}>
            • អ្នកអាចមើលលទ្ធផលនៅក្នុងរបាយការណ៍
          </Text>
        </Space>
      </Card>
    </Space>
  );
}
