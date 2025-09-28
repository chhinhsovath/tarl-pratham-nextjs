'use client';

import React from 'react';
import { Card, Typography, Row, Col, Divider, Space, Tag, Timeline } from 'antd';
import { 
  TeamOutlined, 
  BookOutlined, 
  GlobalOutlined,
  BarChartOutlined,
  SafetyOutlined,
  HeartOutlined,
  RocketOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Paragraph, Text } = Typography;

export default function AboutPage() {
  const features = [
    {
      icon: <BookOutlined className="text-2xl text-blue-500" />,
      title: 'បង្រៀនតាមកម្រិតត្រឹមត្រូវ',
      description: 'ប្រព័ន្ធវាយតម្លៃសិស្សតាមកម្រិតភាពជំនាញពិតប្រាកដ ដើម្បីជួយគ្រូបង្រៀនបង្រៀនតាមកម្រិតសមស្រប'
    },
    {
      icon: <BarChartOutlined className="text-2xl text-green-500" />,
      title: 'តាមដានវឌ្ឍនភាព',
      description: 'ប្រព័ន្ធតាមដានលទ្ធផលការសិក្សារបស់សិស្ស និងបង្កើនគុណភាពបង្រៀនជាបន្តបន្ទាប់'
    },
    {
      icon: <TeamOutlined className="text-2xl text-purple-500" />,
      title: 'គ្រប់គ្រងចំណេះដឹង',
      description: 'ការគ្រប់គ្រងទិន្នន័យសិស្ស គ្រូបង្រៀន និងសាលារៀនយ៉ាងមានប្រសិទ្ធភាព'
    },
    {
      icon: <SafetyOutlined className="text-2xl text-orange-500" />,
      title: 'សុវត្ថិភាពទិន្នន័យ',
      description: 'ការធានាសុវត្ថិភាពនិងការការពារទិន្នន័យសិស្សនិងគ្រូបង្រៀនយ៉ាងតឹងរ៉ឹង'
    }
  ];

  const timeline = [
    {
      children: 'ការចាប់ផ្តើមគម្រោង TaRL ប្រាថម នៅប្រទេសកម្ពុជា',
      color: 'blue'
    },
    {
      children: 'អភិវឌ្ឍន៍ប្រព័ន្ធវាយតម្លៃដំបូង សម្រាប់ភាសាខ្មែរ និងគណិតវិទ្យា',
      color: 'green'
    },
    {
      children: 'ការសាកល្បងដំបូងនៅសាលាបីឡូត ក្នុងខេត្តមួយចំនួន',
      color: 'orange'
    },
    {
      children: 'ការពង្រីកប្រព័ន្ធទៅសាលារៀនបន្ថែមទៀត',
      color: 'purple'
    },
    {
      children: 'ការអភិវឌ្ឍន៍ប្រព័ន្ធគ្រប់គ្រងទិន្នន័យដ៏ទូលំទូលាយ',
      color: 'red'
    }
  ];

  return (
    <HorizontalLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title level={1} className="mb-4">
            <BookOutlined className="mr-3" />
            អំពី TaRL ប្រាថម
          </Title>
          <Title level={3} className="text-gray-600 font-normal">
            ប្រព័ន្ធវាយតម្លៃ និងការតាមដានសម្រាប់កម្មវិធីបង្រៀនតាមកម្រិតត្រឹមត្រូវ
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            TaRL (Teaching at the Right Level) ប្រាថម គឺជាប្រព័ន្ធគ្រប់គ្រងការវាយតម្លៃ 
            និងការតាមដានការរៀនសូត្រ ដែលបានរចនាឡើងពិសេសសម្រាប់ការអប់រំនៅប្រទេសកម្ពុជា។
          </Paragraph>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <div className="text-center mb-6">
            <HeartOutlined className="text-4xl text-red-500 mb-4" />
            <Title level={2}>បេសកកម្មរបស់យើង</Title>
          </div>
          <Paragraph className="text-center text-lg leading-relaxed">
            ការធានាថាកុមារកម្ពុជាគ្រប់រូបទទួលបានការអប់រំដ៏មានគុណភាព 
            ដោយការបង្រៀនតាមកម្រិតជំនាញពិតប្រាកដរបស់ពួកគេ ដើម្បីអភិវឌ្ឍន៍សមត្ថភាពអប់រំ
            និងជីវភាពរបស់ពួកគេយ៉ាងប្រសើរ។
          </Paragraph>
        </Card>

        {/* Features Grid */}
        <Card className="mb-8">
          <Title level={2} className="text-center mb-8">
            <RocketOutlined className="mr-2" />
            លក្ខណៈពិសេសរបស់ប្រព័ន្ធ
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} key={index}>
                <Card 
                  className="h-full border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow"
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" size="middle" className="w-full">
                    <div className="flex items-center space-x-3">
                      {feature.icon}
                      <Title level={4} className="mb-0">{feature.title}</Title>
                    </div>
                    <Paragraph className="text-gray-600 mb-0">
                      {feature.description}
                    </Paragraph>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Timeline */}
        <Card className="mb-8">
          <Title level={2} className="text-center mb-8">
            <TrophyOutlined className="mr-2" />
            ផ្លូវដំណើរអភិវឌ្ឍន៍
          </Title>
          <Timeline 
            mode="left"
            items={timeline}
          />
        </Card>

        {/* Technology Stack */}
        <Card className="mb-8">
          <Title level={2} className="text-center mb-6">
            <GlobalOutlined className="mr-2" />
            បច្ចេកវិទ្យាដែលប្រើប្រាស់
          </Title>
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Tag color="blue" className="text-sm py-2 px-4">Next.js 15</Tag>
            </Col>
            <Col>
              <Tag color="green" className="text-sm py-2 px-4">TypeScript</Tag>
            </Col>
            <Col>
              <Tag color="purple" className="text-sm py-2 px-4">Prisma ORM</Tag>
            </Col>
            <Col>
              <Tag color="orange" className="text-sm py-2 px-4">PostgreSQL</Tag>
            </Col>
            <Col>
              <Tag color="red" className="text-sm py-2 px-4">Ant Design</Tag>
            </Col>
            <Col>
              <Tag color="cyan" className="text-sm py-2 px-4">Tailwind CSS</Tag>
            </Col>
            <Col>
              <Tag color="gold" className="text-sm py-2 px-4">NextAuth.js</Tag>
            </Col>
          </Row>
        </Card>

        {/* Support Information */}
        <Card className="text-center">
          <Title level={3}>ការគាំទ្រ និងជំនួយបច្ចេកទេស</Title>
          <Paragraph className="text-lg">
            ប្រសិនបើអ្នកត្រូវការជំនួយ ឬមានសំណួរអំពីការប្រើប្រាស់ប្រព័ន្ធ 
            សូមទាក់ទងមកក្រុមការងារបច្ចេកទេសរបស់យើង។
          </Paragraph>
          <Space size="large" className="mt-4">
            <Text strong>អ៊ីមែល:</Text>
            <Text copyable>support@tarl-pratham.edu.kh</Text>
          </Space>
          <br />
          <Space size="large" className="mt-2">
            <Text strong>ទូរស័ព្ទ:</Text>
            <Text copyable>+855 23 xxx xxx</Text>
          </Space>
        </Card>

        <Divider />
        
        {/* Footer */}
        <div className="text-center text-gray-500">
          <Paragraph>
            © 2024 TaRL ប្រាថម។ រក្សាសិទ្ធិគ្រប់យ៉ាង។ 
            បង្កើតឡើងសម្រាប់ការអប់រំកម្ពុជា។
          </Paragraph>
        </div>
      </div>
    </HorizontalLayout>
  );
}