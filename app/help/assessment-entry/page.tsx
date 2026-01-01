'use client';

import React from 'react';
import { Card, Typography, Button, Space, Alert, Steps, Divider, List, Tag, Tabs } from 'antd';
import { 
  FormOutlined, 
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function AssessmentEntryHelpPage() {
  const router = useRouter();

  const assessmentSteps = [
    {
      title: 'ជ្រើសរើសប្រភេទការវាយតម្លៃ',
      description: 'តេស្តដើមគ្រា (Baseline), ពាក់តេស្តពាក់កណ្ដាលគ្រា (Midline), ឬ តេស្តចុងក្រោយគ្រា (Endline)',
      icon: <FileTextOutlined />
    },
    {
      title: 'ជ្រើសរើសសិស្ស',
      description: 'ជ្រើសរើសសិស្សម្នាក់ ឬច្រើននាក់សម្រាប់ការវាយតម្លៃ',
      icon: <FormOutlined />
    },
    {
      title: 'បញ្ចូលពិន្ទុ',
      description: 'បញ្ចូលពិន្ទុតាមមុខវិជ្ជា៖ គណិតវិទ្យា និងភាសាខ្មែរ',
      icon: <BarChartOutlined />
    },
    {
      title: 'ផ្ទៀងផ្ទាត់និងបញ្ជូន',
      description: 'ពិនិត្យឡើងវិញនិងបញ្ជូនសម្រាប់ការអនុម័ត',
      icon: <CheckCircleOutlined />
    }
  ];

  const subjects = [
    {
      name: 'គណិតវិទ្យា',
      levels: ['កម្រិត ១', 'កម្រិត ២', 'កម្រិត ៣', 'កម្រិត ៤', 'កម្រិត ៥'],
      description: 'ការវាយតម្លៃជំនាញគណិតវិទ្យាពីមូលដ្ឋានដល់កម្រិតខ្ពស់'
    },
    {
      name: 'ភាសាខ្មែរ',
      levels: ['អានពាក្យ', 'អានប្រយោគ', 'អានកថាខណ្ឌ', 'យល់ន័យ', 'សរសេរ'],
      description: 'ការវាយតម្លៃជំនាញអាន សរសេរ និងយល់ន័យភាសាខ្មែរ'
    }
  ];

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
            <FormOutlined className="mr-2" />
            បញ្ចូលការវាយតម្លៃ
          </Title>
          <Paragraph className="text-lg text-gray-600">
            មគ្គុទ្ទេសក៍សម្រាប់ការបញ្ចូលនិងគ្រប់គ្រងការវាយតម្លៃសិស្ស
          </Paragraph>
        </div>

        {/* Alert */}
        <Alert
          message="សំខាន់៖ ការវាយតម្លៃត្រឹមត្រូវ"
          description="ការបញ្ចូលការវាយតម្លៃត្រឹមត្រូវនិងទាន់ពេលវេលាគឺជាមូលដ្ឋានសម្រាប់ការតាមដានវឌ្ឍនភាពសិស្ស។"
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Assessment Process */}
        <Card title="ដំណើរការវាយតម្លៃ" className="mb-6">
          <Steps
            direction="vertical"
            items={assessmentSteps}
            current={-1}
          />
        </Card>

        {/* Assessment Types */}
        <Card title="ប្រភេទការវាយតម្លៃ" className="mb-6">
          <Space direction="vertical" size="large" className="w-full">
            <Card type="inner" title={<><CheckCircleOutlined className="text-green-500 mr-2" />តេស្តដើមគ្រា (Baseline)</>}>
              <Paragraph>
                ការវាយតម្លៃដំបូងដើម្បីវាស់កម្រិតជំនាញដើមរបស់សិស្សមុនពេលចាប់ផ្តើមការបង្រៀន។
              </Paragraph>
              <List
                size="small"
                dataSource={[
                  'ធ្វើនៅដើមឆ្នាំសិក្សា',
                  'កំណត់ចំណុចចាប់ផ្តើម',
                  'រៀបចំកម្មវិធីបង្រៀន'
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>

            <Card type="inner" title={<><ClockCircleOutlined className="text-orange-500 mr-2" />ពាក់តេស្តពាក់កណ្ដាលគ្រា (Midline)</>}>
              <Paragraph>
                ការវាយតម្លៃពាក់កណ្តាលដើម្បីតាមដានវឌ្ឍនភាពនិងកែតម្រូវវិធីសាស្រ្តបង្រៀន។
              </Paragraph>
              <List
                size="small"
                dataSource={[
                  'ធ្វើនៅពាក់កណ្តាលឆ្នាំសិក្សា',
                  'តាមដានវឌ្ឍនភាព',
                  'កែតម្រូវការបង្រៀន'
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>

            <Card type="inner" title={<><ExclamationCircleOutlined className="text-red-500 mr-2" />តេស្តចុងក្រោយគ្រា (Endline)</>}>
              <Paragraph>
                ការវាយតម្លៃចុងក្រោយដើម្បីវាស់លទ្ធផលការសិក្សាបន្ទាប់ពីបញ្ចប់ការបង្រៀន។
              </Paragraph>
              <List
                size="small"
                dataSource={[
                  'ធ្វើនៅចុងឆ្នាំសិក្សា',
                  'វាស់លទ្ធផលសរុប',
                  'ប្រៀបធៀបជាមួយមូលដ្ឋាន'
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
          </Space>
        </Card>

        {/* Subjects and Levels */}
        <Card title="មុខវិជ្ជានិងកម្រិតវាយតម្លៃ" className="mb-6">
          <Tabs defaultActiveKey="0">
            {subjects.map((subject, index) => (
              <TabPane tab={subject.name} key={index}>
                <Paragraph>{subject.description}</Paragraph>
                <Space wrap className="mb-4">
                  {subject.levels.map((level, idx) => (
                    <Tag key={idx} color="blue">{level}</Tag>
                  ))}
                </Space>
              </TabPane>
            ))}
          </Tabs>
        </Card>

        {/* Tips and Best Practices */}
        <Card title="ពិនិត្យមុនបញ្ជូន" className="mb-6">
          <List
            dataSource={[
              'ត្រូវប្រាកដថាបានជ្រើសរើសប្រភេទការវាយតម្លៃត្រឹមត្រូវ',
              'ពិនិត្យពិន្ទុដែលបានបញ្ចូលម្តងទៀត',
              'ធ្វើឱ្យប្រាកដថាសិស្សទាំងអស់បានវាយតម្លៃ',
              'បញ្ចូលការសម្គាល់បន្ថែម (ប្រសិនបើចាំបាច់)'
            ]}
            renderItem={(item, index) => (
              <List.Item>
                <CheckCircleOutlined className="text-green-500 mr-2" />
                {item}
              </List.Item>
            )}
          />
        </Card>

        {/* Common Issues */}
        <Card title="បញ្ហាញឹកញាប់" className="mb-6">
          <List
            dataSource={[
              {
                problem: 'ការវាយតម្លៃមិនបានរក្សាទុក',
                solution: 'ត្រូវប្រាកដថាចុច "រក្សាទុក" មុនពេលចាកចេញពីទំព័រ'
              },
              {
                problem: 'មិនអាចជ្រើសរើសសិស្សបាន',
                solution: 'ពិនិត្យថាតើសិស្សបានចុះឈ្មោះក្នុងថ្នាក់រៀនរបស់អ្នកឬនៅ'
              },
              {
                problem: 'ពិន្ទុលុបបាត់',
                solution: 'រក្សាទុកការងារញឹកញាប់ និងកុំបិទ browser ដោយមិនរក្សាទុក'
              }
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<Text type="danger">{item.problem}</Text>}
                  description={<Text type="success">{item.solution}</Text>}
                />
              </List.Item>
            )}
          />
        </Card>

        <Divider />

        {/* Navigation */}
        <div className="text-center">
          <Space size="large">
            <Button onClick={() => router.push('/help')}>
              ត្រលប់ទៅជំនួយធំ
            </Button>
            <Button type="primary" onClick={() => router.push('/assessments/create')}>
              ចាប់ផ្តើមវាយតម្លៃ
            </Button>
          </Space>
        </div>
      </div>
    </HorizontalLayout>
  );
}