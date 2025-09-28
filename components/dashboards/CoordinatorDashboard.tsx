'use client';

import { Card, Col, Row, Statistic, Typography, Tag, Button, Space, Modal, Divider } from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  DownloadOutlined,
  GlobalOutlined,
  SettingOutlined,
  EditOutlined,
  SwitcherOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface CoordinatorDashboardProps {
  userId: string;
  user: any;
}

export default function CoordinatorDashboard({ userId, user }: CoordinatorDashboardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  useEffect(() => {
    fetchCoordinatorData();
  }, [userId]);

  const fetchCoordinatorData = async () => {
    try {
      const response = await fetch(`/api/dashboard/coordinator-stats?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch coordinator dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English' },
    { code: 'km', name: 'ភាសាខ្មែរ (Khmer)' }
  ];

  const currentLanguage = 'km'; // This should come from app state

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text>Loading coordinator dashboard...</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, marginBottom: 4 }}>
            ផ្ទាំងគ្រប់គ្រងអ្នកសម្របសម្រួល
          </Title>
          <Text type="secondary">
            មជ្ឈមណ្ឌលទិដ្ឋភាពទូទៅប្រព័ន្ធ និងការគ្រប់គ្រងទិន្នន័យ
          </Text>
        </div>
        <Tag color="purple" style={{ fontSize: 14, padding: '8px 16px' }}>
          {availableLanguages.find(lang => lang.code === currentLanguage)?.name}
        </Tag>
      </div>

      {/* Primary Statistics - Using verification page pattern */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="សាលារៀន"
              value={stats?.total_schools || 150}
              valueStyle={{ color: '#1890ff' }}
              prefix={<BankOutlined />}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>ចុះបញ្ជីសរុប</Text>}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="គ្រូបង្រៀន"
              value={stats?.total_teachers || 420}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>គណនីសកម្ម</Text>}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="អ្នកណែនាំ"
              value={stats?.total_mentors || 85}
              valueStyle={{ color: '#faad14' }}
              prefix={<UserOutlined />}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>គណនីសកម្ម</Text>}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="អ្នកសម្របសម្រួល"
              value={stats?.total_coordinators || 12}
              valueStyle={{ color: '#722ed1' }}
              prefix={<SwitcherOutlined />}
              suffix={<Text type="secondary" style={{ fontSize: 12 }}>គណនីសកម្ម</Text>}
            />
          </Card>
        </Col>
      </Row>

      {/* Import Activity Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="សកម្មភាពខែនេះ" style={{ height: '100%' }}>
            <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
              <Col span={12}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {stats?.import_stats?.schools_this_month || 15}
                </div>
                <Text type="secondary">សាលារៀនដែលបានបន្ថែម</Text>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats?.import_stats?.users_this_month || 68}
                </div>
                <Text type="secondary">អ្នកប្រើប្រាស់ដែលបានបន្ថែម</Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="សកម្មភាពថ្ងៃនេះ" style={{ height: '100%' }}>
            <Row gutter={[16, 16]} style={{ textAlign: 'center' }}>
              <Col span={12}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                  {stats?.import_stats?.schools_today || 3}
                </div>
                <Text type="secondary">សាលារៀនដែលបានបន្ថែម</Text>
              </Col>
              <Col span={12}>
                <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                  {stats?.import_stats?.users_today || 12}
                </div>
                <Text type="secondary">អ្នកប្រើប្រាស់ដែលបានបន្ថែម</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Main Action Areas */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {/* Data Import Center */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                <UploadOutlined style={{ marginRight: 8 }} />
                មជ្ឈមណ្ឌលនាំចូលទិន្នន័យ
              </div>
            }
            headStyle={{ backgroundColor: '#1890ff', border: 'none' }}
            style={{ border: '2px solid #1890ff' }}
          >
            {/* Import Actions */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<BankOutlined />}
                  onClick={() => router.push('/imports/schools')}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>នាំចូលសាលារៀន</div>
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<TeamOutlined />}
                  onClick={() => router.push('/imports/teachers')}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>នាំចូលគ្រូបង្រៀន</div>
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<UserOutlined />}
                  onClick={() => router.push('/imports/mentors')}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>នាំចូលអ្នកណែនាំ</div>
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<DownloadOutlined />}
                  onClick={() => router.push('/imports/templates')}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>គំរូ</div>
                </Button>
              </Col>
            </Row>

            {/* Quick Templates */}
            <Divider orientation="left" style={{ fontSize: 14 }}>ទាញយកជាប់រហ័ស</Divider>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="text" 
                block 
                icon={<DownloadOutlined />}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>គំរូសាលារៀន</span>
              </Button>
              <Button 
                type="text" 
                block 
                icon={<DownloadOutlined />}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>គំរូគ្រូបង្រៀន</span>
              </Button>
              <Button 
                type="text" 
                block 
                icon={<DownloadOutlined />}
                style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>គំរូអ្នកណែនាំ</span>
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Language Management Center */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <div style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
                <GlobalOutlined style={{ marginRight: 8 }} />
                មជ្ឈមណ្ឌលភាសា
              </div>
            }
            headStyle={{ backgroundColor: '#722ed1', border: 'none' }}
            style={{ border: '2px solid #722ed1' }}
          >
            {/* Language Status */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, fontWeight: 'bold', color: '#722ed1', marginBottom: 8 }}>
                {availableLanguages.length}
              </div>
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                ភាសាដែលមាន
              </Title>
              <Tag color="purple" style={{ fontSize: 14, padding: '8px 16px' }}>
                បច្ចុប្បន្ន: {availableLanguages.find(lang => lang.code === currentLanguage)?.name}
              </Tag>
            </div>

            {/* Language Actions */}
            <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<SettingOutlined />}
                  onClick={() => router.push('/localization/settings')}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>ការកំណត់</div>
                </Button>
              </Col>
              <Col span={12}>
                <Button 
                  type="default" 
                  block 
                  icon={<SwitcherOutlined />}
                  onClick={() => setLanguageModalVisible(true)}
                  style={{ height: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <div>ប្តូរ</div>
                </Button>
              </Col>
            </Row>

            {/* Translation Tools */}
            <Divider orientation="left" style={{ fontSize: 14 }}>ឧបករណ៍បកប្រែ</Divider>
            <Button 
              type="primary" 
              block 
              icon={<EditOutlined />}
              onClick={() => router.push('/localization/editor')}
              style={{ height: 50 }}
            >
              បើកកម្មវិធីកែសម្រួលការបកប្រែ
            </Button>
          </Card>
        </Col>
      </Row>

      {/* System Overview */}
      <Card style={{ backgroundColor: '#f5f5f5' }}>
        <Row gutter={[24, 24]} style={{ textAlign: 'center' }}>
          <Col xs={24} md={8}>
            <Title level={5} type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              អ្នកប្រើប្រាស់ប្រព័ន្ធសរុប
            </Title>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#333', marginTop: 8 }}>
              {stats?.total_users || 517}
            </div>
            <Text type="secondary">គ្រូបង្រៀន អ្នកណែនាំ អ្នកសម្របសម្រួល</Text>
          </Col>
          <Col xs={24} md={8}>
            <Title level={5} type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              ភាសាបច្ចុប្បន្ន
            </Title>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 8 }}>
              {currentLanguage.toUpperCase()}
            </div>
            <Text type="secondary">
              {availableLanguages.find(lang => lang.code === currentLanguage)?.name}
            </Text>
          </Col>
          <Col xs={24} md={8}>
            <Title level={5} type="secondary" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
              តួនាទីរបស់អ្នក
            </Title>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 8 }}>
              អ្នកសម្របសម្រួល
            </div>
            <Text type="secondary">ការចូលប្រើការគ្រប់គ្រងទិន្នន័យ</Text>
          </Col>
        </Row>
      </Card>

      {/* Language Switch Modal */}
      <Modal
        title="ប្តូរភាសា"
        open={languageModalVisible}
        onCancel={() => setLanguageModalVisible(false)}
        footer={null}
        width={400}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {availableLanguages.map((lang) => (
            <Button
              key={lang.code}
              type={lang.code === currentLanguage ? 'primary' : 'default'}
              block
              disabled={lang.code === currentLanguage}
              onClick={() => {
                // Handle language switch
                setLanguageModalVisible(false);
              }}
              style={{ textAlign: 'left', height: 50 }}
            >
              {lang.name} {lang.code === currentLanguage && '(បច្ចុប្បន្ន)'}
            </Button>
          ))}
        </Space>
      </Modal>
    </div>
  );
}