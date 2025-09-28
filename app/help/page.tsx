'use client';

import React, { useState } from 'react';
import { 
  Card, 
  Collapse, 
  Typography, 
  Button, 
  Space, 
  Row, 
  Col, 
  Alert,
  Divider,
  List,
  Tag,
  Input,
  Empty
} from 'antd';
import {
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  BookOutlined,
  UserOutlined,
  FileTextOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  DownloadOutlined,
  FileSearchOutlined,
  FormOutlined,
  SolutionOutlined,
  ContactsOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import TourControlPanel from '@/components/tour/TourControlPanel';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Search } = Input;

export default function HelpPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKey, setActiveKey] = useState<string[]>(['1']);

  // FAQ សំណួរដែលសួរញឹកញាប់
  const faqData = [
    {
      key: '0',
      category: 'ការណែនាំប្រព័ន្ធ',
      icon: <PlayCircleOutlined />,
      questions: [
        {
          q: 'តើខ្ញុំអាចទទួលបានការណែនាំប្រព័ន្ធដោយរបៀបណា?',
          a: 'ចុចលើប៊ូតុង "🎯 ការណែនាំប្រព័ន្ធ" នៅជ្រុងខាងស្តាំបាត ឬចូលទៅផ្នែក "ការណែនាំប្រព័ន្ធ" ខាងក្រោមនេះ។'
        },
        {
          q: 'តើការណែនាំនឹងដំណើរការជាស្វ័យប្រវត្តិឬ?',
          a: 'ការណែនាំនឹងដំណើរការស្វ័យប្រវត្តិនៅលើកដំបូងដែលអ្នកចូលទៅទំព័រនីមួយៗ។ អ្នកអាចបិទឬបើកមុខងារនេះនៅក្នុងការកំណត់។'
        },
        {
          q: 'តើខ្ញុំអាចធ្វើការណែនាំម្តងទៀតបានទេ?',
          a: 'បាទ/ចាស អ្នកអាចធ្វើការណែនាំម្តងទៀតនៅពេលណាក៏បាន។ ចុច "ធ្វើម្តងទៀត" នៅក្រោមការណែនាំនីមួយៗ។'
        }
      ]
    },
    {
      key: '1',
      category: 'ការចូលប្រើប្រាស់',
      icon: <UserOutlined />,
      questions: [
        {
          q: 'តើខ្ញុំអាចចូលប្រើប្រព័ន្ធដោយរបៀបណា?',
          a: 'អ្នកអាចចូលប្រើប្រាស់ប្រព័ន្ធតាមរយៈគណនីដែលបានផ្តល់ដោយអ្នកគ្រប់គ្រង។ បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ និងពាក្យសម្ងាត់របស់អ្នកនៅទំព័រចូល។'
        },
        {
          q: 'តើធ្វើយ៉ាងណាប្រសិនបើខ្ញុំភ្លេចពាក្យសម្ងាត់?',
          a: 'សូមទាក់ទងអ្នកគ្រប់គ្រងប្រព័ន្ធ ឬអ្នកសម្របសម្រួលរបស់អ្នកដើម្បីកំណត់ពាក្យសម្ងាត់ឡើងវិញ។ ពួកគាត់អាចជួយកំណត់ពាក្យសម្ងាត់ថ្មីសម្រាប់គណនីរបស់អ្នក។'
        },
        {
          q: 'តើខ្ញុំអាចប្តូរពាក្យសម្ងាត់របស់ខ្ញុំបានទេ?',
          a: 'បាទ/ចាស អ្នកអាចប្តូរពាក្យសម្ងាត់តាមរយៈ ប្រវត្តិរូប > ប្តូរពាក្យសម្ងាត់។ អ្នកត្រូវការពាក្យសម្ងាត់បច្ចុប្បន្នដើម្បីកំណត់ពាក្យសម្ងាត់ថ្មី។'
        }
      ]
    },
    {
      key: '2',
      category: 'ការវាយតម្លៃ',
      icon: <FileTextOutlined />,
      questions: [
        {
          q: 'តើខ្ញុំបញ្ចូលការវាយតម្លៃដោយរបៀបណា?',
          a: 'ចូលទៅកាន់ ការវាយតម្លៃ > បង្កើតការវាយតម្លៃ។ ជ្រើសរើសសិស្ស ប្រភេទវាយតម្លៃ (មូលដ្ឋាន/ពាក់កណ្តាល/បញ្ចប់) មុខវិជ្ជា និងបញ្ចូលពិន្ទុ។'
        },
        {
          q: 'តើប្រភេទវាយតម្លៃខុសគ្នាយ៉ាងណា?',
          a: 'មូលដ្ឋាន: វាយតម្លៃដំបូងមុនពេលបង្រៀន។ ពាក់កណ្តាល: វាយតម្លៃពាក់កណ្តាលវគ្គ។ បញ្ចប់: វាយតម្លៃចុងក្រោយបន្ទាប់ពីបញ្ចប់ការបង្រៀន។'
        },
        {
          q: 'តើខ្ញុំអាចកែប្រែការវាយតម្លៃដែលបានបញ្ចូលរួចបានទេ?',
          a: 'អ្នកអាចកែប្រែការវាយតម្លៃបានលុះត្រាតែវាមិនទាន់ត្រូវបានផ្ទៀងផ្ទាត់។ បន្ទាប់ពីផ្ទៀងផ្ទាត់ អ្នកត្រូវស្នើសុំការអនុញ្ញាតពីអ្នកណែនាំ។'
        },
        {
          q: 'តើខ្ញុំវាយតម្លៃសិស្សច្រើននាក់ក្នុងពេលតែមួយបានទេ?',
          a: 'បាទ/ចាស! ប្រើមុខងារ "វាយតម្លៃរួម" ដើម្បីជ្រើសរើសសិស្សច្រើននាក់ និងបញ្ចូលពិន្ទុសម្រាប់ពួកគេក្នុងពេលតែមួយ។'
        }
      ]
    },
    {
      key: '3',
      category: 'ការគ្រប់គ្រងសិស្ស',
      icon: <TeamOutlined />,
      questions: [
        {
          q: 'តើខ្ញុំបន្ថែមសិស្សថ្មីដោយរបៀបណា?',
          a: 'ចូលទៅ និស្សិត > បន្ថែមសិស្សថ្មី។ បំពេញព័ត៌មានដូចជា ឈ្មោះ ភេទ ថ្ងៃខែឆ្នាំកំណើត ថ្នាក់រៀន និងព័ត៌មានទំនាក់ទំនង។'
        },
        {
          q: 'តើខ្ញុំអាចបញ្ចូលសិស្សច្រើននាក់តាមរយៈ Excel បានទេ?',
          a: 'បាទ/ចាស អ្នកអាចប្រើមុខងារ "បញ្ចូលច្រើន" ដើម្បីបញ្ចូលសិស្សតាមរយៈឯកសារ Excel។ ទាញយកគំរូឯកសារ និងបំពេញព័ត៌មានតាមទម្រង់ដែលបានកំណត់។'
        },
        {
          q: 'តើធ្វើយ៉ាងណាដើម្បីផ្ទេរសិស្សទៅថ្នាក់ផ្សេង?',
          a: 'ចូលទៅប្រវត្តិរូបសិស្ស ចុច "កែប្រែ" និងប្តូរថ្នាក់រៀន។ ប្រវត្តិចាស់នឹងត្រូវបានរក្សាទុកសម្រាប់ការតាមដាន។'
        }
      ]
    },
    {
      key: '4',
      category: 'ការណែនាំ និងការផ្ទៀងផ្ទាត់',
      icon: <SolutionOutlined />,
      questions: [
        {
          q: 'តើអ្នកណែនាំផ្ទៀងផ្ទាត់ការវាយតម្លៃដោយរបៀបណា?',
          a: 'អ្នកណែនាំចូលទៅ ផ្ទៀងផ្ទាត់ > ពិនិត្យការវាយតម្លៃរង់ចាំ > ចុចផ្ទៀងផ្ទាត់ ឬបដិសេធ។ ត្រូវបញ្ជាក់មូលហេតុសម្រាប់ការបដិសេធ។'
        },
        {
          q: 'តើខ្ញុំកត់ត្រាការទស្សនកិច្ចណែនាំដោយរបៀបណា?',
          a: 'ចូលទៅ ការណែនាំ > បង្កើតទស្សនកិច្ចថ្មី។ បំពេញព័ត៌មានអំពីសាលារៀន គ្រូបង្រៀន សកម្មភាពដែលបានអនុវត្ត និងអនុសាសន៍។'
        },
        {
          q: 'តើខ្ញុំអាចមើលប្រវត្តិការណែនាំបានទេ?',
          a: 'បាទ/ចាស ចូលទៅ ការណែនាំ > ប្រវត្តិទស្សនកិច្ច។ អ្នកអាចមើលការទស្សនកិច្ចទាំងអស់ តម្រៀបតាមកាលបរិច្ឆេទ សាលា ឬគ្រូបង្រៀន។'
        }
      ]
    },
    {
      key: '5',
      category: 'របាយការណ៍',
      icon: <BarChartOutlined />,
      questions: [
        {
          q: 'តើខ្ញុំអាចទាញយករបាយការណ៍ប្រភេទអ្វីខ្លះ?',
          a: 'អ្នកអាចទាញយករបាយការណ៍៖ លទ្ធផលសិស្ស ការប្រៀបធៀបសាលា ផលប៉ះពាល់ការណែនាំ វឌ្ឍនភាពសិស្ស វឌ្ឍនភាពថ្នាក់ និងវត្តមាន។'
        },
        {
          q: 'តើខ្ញុំនាំចេញរបាយការណ៍ជា Excel បានទេ?',
          a: 'បាទ/ចាស គ្រប់របាយការណ៍អាចនាំចេញជា Excel។ ចុចប៊ូតុង "នាំចេញ" នៅលើរបាយការណ៍ និងជ្រើសរើស Excel format។'
        },
        {
          q: 'តើរបាយការណ៍ត្រូវបានធ្វើបច្ចុប្បន្នភាពញឹកញាប់ប៉ុណ្ណា?',
          a: 'របាយការណ៍ត្រូវបានធ្វើបច្ចុប្បន្នភាពភ្លាមៗនៅពេលទិន្នន័យថ្មីត្រូវបានបញ្ចូល។ អ្នកតែងតែមើលឃើញព័ត៌មានចុងក្រោយបំផុត។'
        }
      ]
    },
    {
      key: '6',
      category: 'បញ្ហាបច្ចេកទេស',
      icon: <ExclamationCircleOutlined />,
      questions: [
        {
          q: 'តើធ្វើយ៉ាងណាប្រសិនបើប្រព័ន្ធដំណើរការយឺត?',
          a: 'សូមពិនិត្យការតភ្ជាប់អ៊ីនធឺណិតរបស់អ្នក។ សម្អាត browser cache។ ប្រសិនបើបញ្ហានៅតែកើតមាន សូមទាក់ទងក្រុមជំនួយបច្ចេកទេស។'
        },
        {
          q: 'ទិន្នន័យរបស់ខ្ញុំមិនបានរក្សាទុក តើត្រូវធ្វើយ៉ាងណា?',
          a: 'ត្រូវប្រាកដថាអ្នកចុច "រក្សាទុក" មុនពេលចាកចេញពីទំព័រ។ ពិនិត្យមើលការតភ្ជាប់អ៊ីនធឺណិត។ ប្រសិនបើបញ្ហាកើតឡើងញឹកញាប់ សូមរាយការណ៍ទៅក្រុមបច្ចេកទេស។'
        },
        {
          q: 'តើខ្ញុំអាចប្រើប្រព័ន្ធលើទូរស័ព្ទបានទេ?',
          a: 'បាទ/ចាស ប្រព័ន្ធត្រូវបានរចនាសម្រាប់ប្រើប្រាស់លើទូរស័ព្ទ។ បើក browser លើទូរស័ព្ទរបស់អ្នក និងចូលដូចធម្មតា។'
        }
      ]
    }
  ];

  // User guides based on role
  const getUserGuides = () => {
    const role = session?.user?.role;
    
    const guides = {
      admin: [
        { title: 'ការគ្រប់គ្រងអ្នកប្រើប្រាស់', icon: <TeamOutlined />, link: '/help/user-management' },
        { title: 'ការកំណត់ប្រព័ន្ធ', icon: <SettingOutlined />, link: '/help/settings' },
        { title: 'របាយការណ៍រដ្ឋបាល', icon: <BarChartOutlined />, link: '/help/admin-reports' },
        { title: 'ការគ្រប់គ្រងសាលារៀន', icon: <SafetyOutlined />, link: '/help/school-management' }
      ],
      mentor: [
        { title: 'ការផ្ទៀងផ្ទាត់វាយតម្លៃ', icon: <CheckCircleOutlined />, link: '/help/verification' },
        { title: 'ទស្សនកិច្ចណែនាំ', icon: <SolutionOutlined />, link: '/help/mentoring' },
        { title: 'តាមដានគ្រូបង្រៀន', icon: <UserOutlined />, link: '/help/teacher-monitoring' },
        { title: 'របាយការណ៍វឌ្ឍនភាព', icon: <BarChartOutlined />, link: '/help/progress-reports' }
      ],
      teacher: [
        { title: 'បញ្ចូលការវាយតម្លៃ', icon: <FormOutlined />, link: '/help/assessment-entry' },
        { title: 'គ្រប់គ្រងសិស្ស', icon: <TeamOutlined />, link: '/help/student-management' },
        { title: 'មើលរបាយការណ៍', icon: <FileSearchOutlined />, link: '/help/view-reports' },
        { title: 'កែប្រែប្រវត្តិរូប', icon: <UserOutlined />, link: '/help/profile' }
      ],
      coordinator: [
        { title: 'គ្រប់គ្រងទិន្នន័យ', icon: <DatabaseOutlined />, link: '/help/data-management' },
        { title: 'សម្របសម្រួលសាលា', icon: <SafetyOutlined />, link: '/help/school-coordination' },
        { title: 'តាមដានវឌ្ឍនភាព', icon: <BarChartOutlined />, link: '/help/progress-tracking' }
      ],
      viewer: [
        { title: 'មើលរបាយការណ៍', icon: <FileSearchOutlined />, link: '/help/view-reports' },
        { title: 'ទិន្នន័យសិស្ស', icon: <TeamOutlined />, link: '/help/student-data' },
        { title: 'ស្ថិតិវាយតម្លៃ', icon: <BarChartOutlined />, link: '/help/assessment-stats' }
      ]
    };

    return guides[role as keyof typeof guides] || guides.viewer;
  };

  // Filter FAQs based on search
  const filterFAQs = (data: any[]) => {
    if (!searchTerm) return data;
    
    return data.map(category => ({
      ...category,
      questions: category.questions.filter((item: any) => 
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
  };

  const filteredFAQs = filterFAQs(faqData);

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="text-center mb-8">
          <Title level={2}>
            <QuestionCircleOutlined className="mr-2" />
            ជំនួយ និងការណែនាំ
          </Title>
          <Paragraph className="text-lg text-gray-600">
            ស្វែងរកចម្លើយសម្រាប់សំណួររបស់អ្នក និងរៀនពីរបៀបប្រើប្រាស់ប្រព័ន្ធ
          </Paragraph>
        </div>

        {/* Quick Contact Info */}
        <Alert
          message="ត្រូវការជំនួយបន្ទាន់?"
          description={
            <Space direction="vertical" className="mt-2">
              <Text>
                <PhoneOutlined className="mr-2" />
                ទូរស័ព្ទ៖ ០២៣ ៩៩៩ ៨៨៨ (ច័ន្ទ-សុក្រ ៨:០០ព្រឹក - ៥:០០ល្ងាច)
              </Text>
              <Text>
                <MailOutlined className="mr-2" />
                អ៊ីមែល៖ support@tarl.edu.kh
              </Text>
            </Space>
          }
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Search Bar */}
        <Card className="mb-6">
          <Search
            placeholder="ស្វែងរកសំណួរ ឬពាក្យគន្លឹះ..."
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-full overflow-x-hidden"
          />
        </Card>

        {/* Quick Guides for User Role */}
        <Card title="មគ្គុទ្ទេសក៍រហ័សសម្រាប់អ្នក" className="mb-6">
          <Row gutter={[16, 16]}>
            {getUserGuides().map((guide, index) => (
              <Col xs={12} sm={8} md={6} key={index}>
                <Button
                  type="default"
                  block
                  size="large"
                  icon={guide.icon}
                  className="h-auto py-4"
                  onClick={() => {
                    // Navigate to the help sub-page
                    router.push(guide.link);
                  }}
                >
                  <div className="text-sm">{guide.title}</div>
                </Button>
              </Col>
            ))}
          </Row>
        </Card>

        {/* FAQs Section */}
        <Card title="សំណួរដែលសួរញឹកញាប់" className="mb-6">
          {filteredFAQs.length > 0 ? (
            <Collapse 
              activeKey={activeKey}
              onChange={(keys) => setActiveKey(keys as string[])}
              expandIconPosition="right"
            >
              {filteredFAQs.map(category => (
                <Panel 
                  header={
                    <Space>
                      {category.icon}
                      <Text strong>{category.category}</Text>
                      <Tag color="blue">{category.questions.length} សំណួរ</Tag>
                    </Space>
                  } 
                  key={category.key}
                >
                  <List
                    dataSource={category.questions}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<QuestionCircleOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
                          title={<Text strong>{item.q}</Text>}
                          description={
                            <Paragraph className="mt-2 text-gray-600">
                              {item.a}
                            </Paragraph>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          ) : (
            <Empty 
              description="រកមិនឃើញសំណួរដែលត្រូវនឹងការស្វែងរករបស់អ្នក"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Card>

        {/* Video Tutorials */}
        <Card title="វីដេអូណែនាំ" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable
                cover={
                  <div className="bg-gray-200 h-40 flex items-center justify-center">
                    <PlayCircleOutlined style={{ fontSize: 48, color: '#999' }} />
                  </div>
                }
              >
                <Card.Meta
                  title="ការចាប់ផ្តើមប្រើប្រាស់"
                  description="រៀនពីរបៀបចូលប្រើប្រាស់ និងការកំណត់ដំបូង"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable
                cover={
                  <div className="bg-gray-200 h-40 flex items-center justify-center">
                    <PlayCircleOutlined style={{ fontSize: 48, color: '#999' }} />
                  </div>
                }
              >
                <Card.Meta
                  title="ការបញ្ចូលការវាយតម្លៃ"
                  description="របៀបបញ្ចូល និងគ្រប់គ្រងការវាយតម្លៃសិស្ស"
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card 
                hoverable
                cover={
                  <div className="bg-gray-200 h-40 flex items-center justify-center">
                    <PlayCircleOutlined style={{ fontSize: 48, color: '#999' }} />
                  </div>
                }
              >
                <Card.Meta
                  title="ការប្រើប្រាស់របាយការណ៍"
                  description="របៀបទាញយក និងវិភាគរបាយការណ៍"
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Download Resources */}
        <Card title="ឯកសារដែលអាចទាញយក">
          <List>
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  key="download1"
                >
                  ទាញយក
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title="សៀវភៅណែនាំអ្នកប្រើប្រាស់"
                description="សៀវភៅណែនាំពេញលេញសម្រាប់ការប្រើប្រាស់ប្រព័ន្ធ (PDF, 2.5MB)"
              />
            </List.Item>
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  key="download2"
                >
                  ទាញយក
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title="គំរូឯកសារ Excel សម្រាប់បញ្ចូលទិន្នន័យ"
                description="គំរូសម្រាប់បញ្ចូលសិស្ស និងការវាយតម្លៃ (XLSX, 156KB)"
              />
            </List.Item>
            <List.Item
              actions={[
                <Button 
                  type="link" 
                  icon={<DownloadOutlined />}
                  key="download3"
                >
                  ទាញយក
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title="សៀវភៅណែនាំរហ័ស"
                description="ការណែនាំសង្ខេបសម្រាប់មុខងារសំខាន់ៗ (PDF, 850KB)"
              />
            </List.Item>
          </List>
        </Card>

        <Divider />

        {/* Help Sections Based on User Role */}
        <div id="user-management" className="mb-8">
          <Card title="ការគ្រប់គ្រងអ្នកប្រើប្រាស់" className="mb-6">
            <Paragraph>
              ការគ្រប់គ្រងអ្នកប្រើប្រាស់អនុញ្ញាតឱ្យអ្នកគ្រប់គ្រងប្រព័ន្ធបង្កើត កែប្រែ និងលុបគណនីអ្នកប្រើប្រាស់។
            </Paragraph>
            <List
              dataSource={[
                'បង្កើតគណនីអ្នកប្រើប្រាស់ថ្មី',
                'កំណត់តួនាទីនិងការអនុញ្ញាត',
                'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់',
                'ធ្វើបច្ចុប្បន្នភាពស្ថានភាពគណនី'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="settings" className="mb-8">
          <Card title="ការកំណត់ប្រព័ន្ធ" className="mb-6">
            <Paragraph>
              ការកំណត់ប្រព័ន្ធអនុញ្ញាតឱ្យអ្នកគ្រប់គ្រងប្រព័ន្ធកំណត់ការកំណត់ទូទៅរបស់ប្រព័ន្ធ។
            </Paragraph>
            <List
              dataSource={[
                'កំណត់ភាសាប្រព័ន្ធ',
                'កំណត់ការជូនដំណឹង',
                'គ្រប់គ្រងការបម្រុងទុកទិន្នន័យ',
                'កំណត់សុវត្ថិភាពប្រព័ន្ធ'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="verification" className="mb-8">
          <Card title="ការផ្ទៀងផ្ទាត់វាយតម្លៃ" className="mb-6">
            <Paragraph>
              ការផ្ទៀងផ្ទាត់វាយតម្លៃគឺជាដំណើរការសំខាន់ដើម្បីធានាដល់គុណភាពនៃទិន្នន័យវាយតម្លៃ។
            </Paragraph>
            <List
              dataSource={[
                'ពិនិត្យការវាយតម្លៃដែលរង់ចាំ',
                'អនុម័តឬបដិសេធការវាយតម្លៃ',
                'ផ្តល់មតិយោបល់អំពីការវាយតម្លៃ',
                'តាមដានស្ថានភាពការផ្ទៀងផ្ទាត់'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        {/* System Tours Section */}
        <div id="tours" className="mb-8">
          <TourControlPanel />
        </div>

        <div id="mentoring" className="mb-8">
          <Card title="ទស្សនកិច្ចណែនាំ" className="mb-6">
            <Paragraph>
              ទស្សនកិច្ចណែនាំជួយបង្កើនគុណភាពបង្រៀននិងការវាយតម្លៃតាមរយៈការណែនាំផ្ទាល់។
            </Paragraph>
            <List
              dataSource={[
                'រៀបចំកាលវិភាគទស្សនកិច្ច',
                'កត់ត្រាអំឡុងពេលទស្សនកិច្ច',
                'ផ្តល់អនុសាសន៍ដល់គ្រូបង្រៀន',
                'តាមដានការអនុវត្តអនុសាសន៍'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="assessment-entry" className="mb-8">
          <Card title="បញ្ចូលការវាយតម្លៃ" className="mb-6">
            <Paragraph>
              ការបញ្ចូលការវាយតម្លៃត្រឹមត្រូវនិងទាន់ពេលវេលាគឺជាមូលដ្ឋានសម្រាប់ការតាមដានវឌ្ឍនភាពសិស្ស។
            </Paragraph>
            <List
              dataSource={[
                'ជ្រើសរើសសិស្សសម្រាប់វាយតម្លៃ',
                'បញ្ចូលពិន្ទុតាមមុខវិជ្ជា',
                'កត់ត្រាការសង្កេត',
                'បញ្ជូនការវាយតម្លៃសម្រាប់ផ្ទៀងផ្ទាត់'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="student-management" className="mb-8">
          <Card title="គ្រប់គ្រងសិស្ស" className="mb-6">
            <Paragraph>
              ការគ្រប់គ្រងសិស្សអនុញ្ញាតឱ្យអ្នកបន្ថែម កែប្រែ និងតាមដានព័ត៌មានសិស្ស។
            </Paragraph>
            <List
              dataSource={[
                'បន្ថែមសិស្សថ្មី',
                'កែប្រែព័ត៌មានសិស្ស',
                'ផ្ទេរសិស្សទៅថ្នាក់ផ្សេង',
                'មើលប្រវត្តិការវាយតម្លៃ'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="view-reports" className="mb-8">
          <Card title="មើលរបាយការណ៍" className="mb-6">
            <Paragraph>
              របាយការណ៍ផ្តល់ព័ត៌មានវិភាគសម្រាប់ការសម្រេចចិត្តនិងការកែលម្អ។
            </Paragraph>
            <List
              dataSource={[
                'របាយការណ៍លទ្ធផលសិស្ស',
                'របាយការណ៍វឌ្ឍនភាពថ្នាក់',
                'របាយការណ៍ប្រៀបធៀបសាលា',
                'នាំចេញរបាយការណ៍ជា Excel'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <div id="data-management" className="mb-8">
          <Card title="គ្រប់គ្រងទិន្នន័យ" className="mb-6">
            <Paragraph>
              ការគ្រប់គ្រងទិន្នន័យធានាបាននូវភាពត្រឹមត្រូវនិងសុវត្ថិភាពនៃទិន្នន័យ។
            </Paragraph>
            <List
              dataSource={[
                'បម្រុងទុកទិន្នន័យ',
                'នាំចេញទិន្នន័យ',
                'តម្អាតទិន្នន័យ',
                'ការកំណត់សុវត្ថិភាព'
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </div>

        <Divider />

        {/* Footer Contact Section */}
        <div className="text-center py-8">
          <Title level={4}>នៅតែត្រូវការជំនួយ?</Title>
          <Paragraph className="text-gray-600 mb-4">
            ក្រុមគាំទ្របច្ចេកទេសរបស់យើងខ្ញុំរង់ចាំជួយអ្នក
          </Paragraph>
          <Space size="large">
            <Button 
              type="primary" 
              size="large" 
              icon={<ContactsOutlined />}
            >
              ទាក់ទងយើងខ្ញុំ
            </Button>
            <Button 
              size="large" 
              icon={<BookOutlined />}
            >
              សៀវភៅណែនាំពេញលេញ
            </Button>
          </Space>
        </div>
      </div>
    </HorizontalLayout>
  );
}