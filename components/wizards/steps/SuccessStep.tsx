'use client';

import { Space, Typography, Button, Card, Result } from 'antd';
import {
  CheckCircleOutlined,
  PlusOutlined,
  HomeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

const { Title, Text } = Typography;

interface SuccessStepProps {
  assessmentId: number | null;
  studentName?: string;
  onFinish: () => void;
  onAddAnother: () => void;
}

export default function SuccessStep({
  assessmentId,
  studentName,
  onFinish,
  onAddAnother
}: SuccessStepProps) {
  const router = useRouter();
  const { width, height } = useWindowSize();

  return (
    <>
      {/* Celebration confetti */}
      <Confetti
        width={width || 300}
        height={height || 300}
        recycle={false}
        numberOfPieces={200}
        gravity={0.3}
      />

      <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
        <Result
          status="success"
          icon={
            <CheckCircleOutlined
              style={{
                fontSize: '72px',
                color: '#52c41a'
              }}
            />
          }
          title={
            <Title level={3} style={{ color: '#52c41a' }}>
              🎉 ជោគជ័យ!
            </Title>
          }
          subTitle={
            <Space direction="vertical" size={4}>
              <Text style={{ fontSize: '16px' }}>
                ការវាយតម្លៃរបស់ <Text strong>{studentName}</Text> ត្រូវបានរក្សាទុក
              </Text>
              {assessmentId && (
                <Text type="secondary">
                  លេខសម្គាល់: #{assessmentId}
                </Text>
              )}
            </Space>
          }
        />

        {/* Success Message Card */}
        <Card
          style={{
            background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
            border: '1px solid #b7eb8f',
            maxWidth: '500px',
            margin: '0 auto'
          }}
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Text strong style={{ fontSize: '15px', color: '#389e0d' }}>
              ✅ អ្វីដែលបានធ្វើ
            </Text>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text>• បានរក្សាទុកការវាយតម្លៃក្នុងប្រព័ន្ធ</Text>
              <Text>• បានធ្វើបច្ចុប្បន្នភាពកម្រិតសិស្ស</Text>
              <Text>• ទិន្នន័យអាចប្រើបានភ្លាមៗ</Text>
            </Space>
          </Space>
        </Card>

        {/* Action Buttons */}
        <Space direction="vertical" size={12} style={{ width: '100%', marginTop: '24px' }}>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={onAddAnother}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '56px',
              fontSize: '16px'
            }}
          >
            បន្ថែមការវាយតម្លៃថ្មី
          </Button>

          <Button
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => router.push('/assessments')}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '56px',
              fontSize: '16px'
            }}
          >
            មើលបញ្ជីការវាយតម្លៃ
          </Button>

          <Button
            size="large"
            icon={<HomeOutlined />}
            onClick={onFinish}
            style={{
              width: '100%',
              maxWidth: '400px',
              height: '56px',
              fontSize: '16px'
            }}
          >
            ត្រឡប់ទៅទំព័រដើម
          </Button>
        </Space>
      </Space>
    </>
  );
}
