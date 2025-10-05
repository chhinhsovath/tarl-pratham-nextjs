'use client';

import { useRouter } from 'next/navigation';
import { Card, Badge, Typography, Space } from 'antd';

const { Text } = Typography;

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
  badge?: number;
}

export default function QuickActionCard({
  title,
  description,
  icon,
  link,
  color,
  badge
}: QuickActionCardProps) {
  const router = useRouter();

  return (
    <Badge count={badge} offset={[-10, 10]} showZero={false}>
      <Card
        hoverable
        onClick={() => router.push(link)}
        style={{
          background: color,
          border: 'none',
          borderRadius: '12px',
          minHeight: '140px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
        bodyStyle={{
          padding: '16px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
        className="quick-action-card"
      >
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <div style={{ fontSize: '28px', lineHeight: 1 }}>
            {icon}
          </div>
          <Text strong style={{ color: 'white', fontSize: '15px', display: 'block', lineHeight: '1.3' }}>
            {title}
          </Text>
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px', display: 'block', lineHeight: '1.4' }}>
            {description}
          </Text>
        </Space>
      </Card>
    </Badge>
  );
}
