'use client';

import React from 'react';
import { Card, Typography, Button, Space, Alert, Steps, Divider, List } from 'antd';
import { 
  TeamOutlined, 
  UserAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  SettingOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export default function UserManagementHelpPage() {
  const router = useRouter();

  const steps = [
    {
      title: 'បង្កើតអ្នកប្រើប្រាស់',
      description: 'ចូលទៅ អ្នកប្រើប្រាស់ > បន្ថែមអ្នកប្រើប្រាស់ថ្មី',
      icon: <UserAddOutlined />
    },
    {
      title: 'កំណត់តួនាទី',
      description: 'ជ្រើសរើសតួនាទីសមរម្យ៖ Admin, Mentor, Teacher, Coordinator, Viewer',
      icon: <SettingOutlined />
    },
    {
      title: 'កំណត់ព័ត៌មាន',
      description: 'បំពេញព័ត៌មានដូចជា ឈ្មោះ អ៊ីមែល ទូរស័ព្ទ និងសាលារៀន',
      icon: <EditOutlined />
    }
  ];

  const permissions = {
    admin: [
      'គ្រប់គ្រងអ្នកប្រើប្រាស់ទាំងអស់',
      'កំណត់ការកំណត់ប្រព័ន្ធ',
      'មើលរបាយការណ៍ទាំងអស់',
      'គ្រប់គ្រងសាលារៀនទាំងអស់'
    ],
    mentor: [
      'ផ្ទៀងផ្ទាត់ការវាយតម្លៃ',
      'កត់ត្រាទស្សនកិច្ចណែនាំ',
      'តាមដានគ្រូបង្រៀនក្នុងតំបន់',
      'មើលរបាយការណ៍វឌ្ឍនភាព'
    ],
    teacher: [
      'បញ្ចូលការវាយតម្លៃសិស្ស',
      'គ្រប់គ្រងសិស្សក្នុងថ្នាក់',
      'មើលរបាយការណ៍សិស្ស',
      'កែប្រែប្រវត្តិរូបផ្ទាល់ខ្លួន'
    ],
    coordinator: [
      'គ្រប់គ្រងទិន្នន័យតំបន់',
      'សម្របសម្រួលប្រត្តិបត្តិការសាលា',
      'តាមដានវឌ្ឍនភាពទូទៅ',
      'នាំចេញរបាយការណ៍តំបន់'
    ],
    viewer: [
      'មើលរបាយការណ៍ (អានតែប៉ុណ្ណោះ)',
      'ចូលមើលទិន្នន័យសិស្ស',
      'ស្ថិតិការវាយតម្លៃ',
      'ការតាមដានវឌ្ឍនភាព'
    ]
  };

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Header */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
            className="mb-4"
          >
            ត្រលប់ទៅជំនួយ
          </Button>
          <Title level={2}>
            <TeamOutlined className="mr-2" />
            ការគ្រប់គ្រងអ្នកប្រើប្រាស់
          </Title>
          <Paragraph className="text-lg text-gray-600">
            មគ្គុទ្ទេសក៍សម្រាប់ការបង្កើត កែប្រែ និងគ្រប់គ្រងគណនីអ្នកប្រើប្រាស់
          </Paragraph>
        </div>

        {/* Alert */}
        <Alert
          message="ការគ្រប់គ្រងអ្នកប្រើប្រាស់ត្រូវការសិទ្ធិ Admin"
          description="មានតែអ្នកដែលមានតួនាទី Admin ប៉ុណ្ណោះដែលអាចគ្រប់គ្រងអ្នកប្រើប្រាស់បាន។"
          type="warning"
          showIcon
          className="mb-6"
        />

        {/* Steps */}
        <Card title="ជំហានបង្កើតអ្នកប្រើប្រាស់ថ្មី" className="mb-6">
          <Steps
            direction="vertical"
            items={steps}
            current={-1}
          />
        </Card>

        {/* User Roles and Permissions */}
        <Card title="តួនាទីនិងការអនុញ្ញាត" className="mb-6">
          <Space direction="vertical" size="large" className="w-full">
            {Object.entries(permissions).map(([role, perms]) => (
              <Card
                key={role}
                type="inner"
                title={
                  <Text strong className="capitalize">
                    {role === 'admin' && 'អ្នកគ្រប់គ្រង (Admin)'}
                    {role === 'mentor' && 'អ្នកណែនាំ (Mentor)'}
                    {role === 'teacher' && 'គ្រូបង្រៀន (Teacher)'}
                    {role === 'coordinator' && 'អ្នកសម្របសម្រួល (Coordinator)'}
                    {role === 'viewer' && 'អ្នកមើល (Viewer)'}
                  </Text>
                }
              >
                <List
                  dataSource={perms}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </Card>
            ))}
          </Space>
        </Card>

        {/* Common Tasks */}
        <Card title="កិច្ចការទូទៅ" className="mb-6">
          <List
            dataSource={[
              {
                title: 'បង្កើតគណនីថ្មី',
                description: 'អ្នកប្រើប្រាស់ > បន្ថែមអ្នកប្រើប្រាស់ថ្មី > បំពេញព័ត៌មាន > រក្សាទុក'
              },
              {
                title: 'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់',
                description: 'អ្នកប្រើប្រាស់ > ជ្រើសរើសអ្នកប្រើប្រាស់ > កែប្រែ > ធ្វើបច្ចុប្បន្នភាព'
              },
              {
                title: 'ប្តូរតួនាទី',
                description: 'អ្នកប្រើប្រាស់ > កែប្រែ > ជ្រើសរើសតួនាទីថ្មី > រក្សាទុក'
              },
              {
                title: 'បិទគណនី',
                description: 'អ្នកប្រើប្រាស់ > កែប្រែ > ប្តូរស្ថានភាព > បិទប្រើប្រាស់'
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text strong>{item.title}</Text>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Best Practices */}
        <Card title="ការអនុវត្តល្អបំផុត" className="mb-6">
          <List
            dataSource={[
              'ធ្វើបច្ចុប្បន្នភាពព័ត៌មានទំនាក់ទំនងឱ្យបានទៀងទាត់',
              'កំណត់តួនាទីត្រឹមត្រូវតាមភារកិច្ចរបស់អ្នកប្រើប្រាស់',
              'ពិនិត្យស្ថានភាពគណនីឱ្យបានទៀងទាត់',
              'រក្សាទុកពាក្យសម្ងាត់ដោយសុវត្ថិភាព'
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>

        <Divider />

        {/* Navigation */}
        <div className="text-center">
          <Space size="large">
            <Button onClick={() => router.push('/help')}>
              ត្រលប់ទៅជំនួយធំ
            </Button>
            <Button type="primary" onClick={() => router.push('/users')}>
              ចូលទៅគ្រប់គ្រងអ្នកប្រើប្រាស់
            </Button>
          </Space>
        </div>
      </div>
    </HorizontalLayout>
  );
}