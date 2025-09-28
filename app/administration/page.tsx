"use client";

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Button, Statistic, message, Divider } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BankOutlined, 
  FileTextOutlined,
  SettingOutlined,
  UploadOutlined,
  CalendarOutlined,
  LockOutlined,
  BarChartOutlined,
  FolderOutlined,
  DatabaseOutlined,
  SafetyOutlined,
  TrophyOutlined,
  BookOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Text } = Typography;

interface AdminStats {
  total_users: number;
  active_users: number;
  total_schools: number;
  total_students: number;
  total_assessments: number;
  total_mentoring_visits: number;
}

function AdministrationPageContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Check admin access
  useEffect(() => {
    if (session && session.user?.role !== 'admin') {
      message.error('Access denied. Admin privileges required.');
      router.push('/dashboard');
      return;
    }
  }, [session, router]);

  // Fetch admin statistics
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/administration/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.role === 'admin') {
      fetchAdminStats();
    }
  }, [session]);

  const adminSections = [
    {
      title: 'គ្រប់គ្រងអ្នកប្រើប្រាស់',
      titleEn: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <UserOutlined />,
      color: '#1890ff',
      route: '/rbac',
      items: [
        'Create and edit users',
        'Role assignment',
        'Account activation/deactivation',
        'Password management'
      ]
    },
    {
      title: 'នាំចូលអ្នកប្រើប្រាស់',
      titleEn: 'Bulk User Import',
      description: 'Import users from Excel/CSV files',
      icon: <UploadOutlined />,
      color: '#52c41a',
      route: '/users/bulk-import',
      items: [
        'Excel/CSV bulk import',
        'Template download',
        'Validation and error handling',
        'Enhanced import options'
      ]
    },
    {
      title: 'នាំចូល Student',
      titleEn: 'Student Bulk Import',
      description: 'Import student data from spreadsheets',
      icon: <TeamOutlined />,
      color: '#722ed1',
      route: '/students/bulk-import',
      items: [
        'Student bulk import',
        'Teacher assignments',
        'Student template download',
        'Quick add functionality'
      ]
    },
    {
      title: 'Manage School',
      titleEn: 'School Management',
      description: 'Manage schools and geographic data',
      icon: <BankOutlined />,
      color: '#fa8c16',
      route: '/schools',
      items: [
        'School information management',
        'Geographic organization',
        'Bulk school import',
        'School template download'
      ]
    },
    {
      title: 'Info វាយតម្លៃ កាលបរិច្ឆេទ',
      titleEn: 'Assessment Date Configuration',
      description: 'Configure assessment dates and cycles',
      icon: <CalendarOutlined />,
      color: '#eb2f96',
      route: '/schools/assessment-dates',
      items: [
        'Assessment cycle management',
        'School-specific scheduling',
        'Baseline/Midline/Endline dates',
        'Assessment calendar'
      ]
    },
    {
      title: 'Info វាយតម្លៃ Management',
      titleEn: 'Assessment Management',
      description: 'Lock/unlock assessments and manage data integrity',
      icon: <LockOutlined />,
      color: '#f5222d',
      route: '/assessment-management',
      items: [
        'Lock/unlock assessments',
        'Bulk operations',
        'Data protection',
        'Assessment filtering'
      ]
    },
    {
      title: 'អ្នកណែនាំ Management',
      titleEn: 'Mentoring Visit Management',
      description: 'Manage mentoring visits and mentor assignments',
      icon: <TrophyOutlined />,
      color: '#13c2c2',
      route: '/assessment-management?tab=mentoring-visits',
      items: [
        'Lock/unlock visits',
        'Mentor assignments',
        'Visit tracking',
        'Bulk operations'
      ]
    },
    {
      title: 'Manage Resources',
      titleEn: 'Resource Management',
      description: 'Upload and manage educational resources',
      icon: <FolderOutlined />,
      color: '#a0d911',
      route: '/resources',
      items: [
        'File upload (100MB max)',
        'YouTube integration',
        'Resource categorization',
        'View analytics'
      ]
    },
    {
      title: 'Info កំណត់',
      titleEn: 'System Settings',
      description: 'Configure system settings and preferences',
      icon: <SettingOutlined />,
      color: '#595959',
      route: '/settings',
      items: [
        'Application configuration',
        'Timezone settings',
        'Language preferences',
        'Email configuration'
      ]
    },
    {
      title: 'RBAC Management',
      titleEn: 'Role-Based Access Control',
      description: 'Advanced user role and permission management',
      icon: <SafetyOutlined />,
      color: '#9254de',
      route: '/rbac',
      items: [
        'Role permissions matrix',
        'Data access control',
        'User statistics',
        'Activity monitoring'
      ]
    },
    {
      title: 'Data Analytics',
      titleEn: 'System Analytics',
      description: 'View system statistics and reports',
      icon: <BarChartOutlined />,
      color: '#faad14',
      route: '/analytics-dashboard',
      items: [
        'System overview',
        'User activity reports',
        'Assessment analytics',
        'Performance metrics'
      ]
    },
    {
      title: 'Database Management',
      titleEn: 'Database Tools',
      description: 'Database maintenance and management tools',
      icon: <DatabaseOutlined />,
      color: '#2f54eb',
      route: '/database-tools',
      items: [
        'Data backup',
        'Database optimization',
        'Data integrity checks',
        'Maintenance tools'
      ]
    }
  ];

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="w-full">
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2}>
          <SettingOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
          ផ្ទាំងគ្រប់គ្រងបច្ចេកទេស
        </Title>
        <Title level={3} type="secondary" style={{ margin: '8px 0 24px 0' }}>
          Administration Dashboard
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          ប្រព័ន្ធគ្រប់គ្រងទាំងអស់នៃ TaRL Pratham Platform
        </Text>
      </div>

      {/* System Statistics */}
      {stats && (
        <Card style={{ marginBottom: '32px' }} title="ស្ថិតិប្រព័ន្ធ / System Statistics">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="អ្នកប្រើប្រាស់សរុប"
                value={stats.total_users}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="អ្នកប្រើប្រាស់សកម្មភាព"
                value={stats.active_users}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="សាលារៀន"
                value={stats.total_schools}
                prefix={<BankOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="សិស្ស"
                value={stats.total_students}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="ការវាយតម្លៃ"
                value={stats.total_assessments}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <Statistic
                title="ការជួបជុំ"
                value={stats.total_mentoring_visits}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#13c2c2' }}
              />
            </Col>
          </Row>
        </Card>
      )}

      <Divider style={{ margin: '32px 0' }} />

      {/* Administration Sections */}
      <Row gutter={[24, 24]}>
        {adminSections.map((section, index) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={index}>
            <Card
              hoverable
              style={{ 
                height: '320px',
                borderRadius: '12px',
                border: `2px solid ${section.color}20`,
                transition: 'all 0.3s ease'
              }}
              bodyStyle={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = section.color;
                e.currentTarget.style.boxShadow = `0 8px 24px ${section.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${section.color}20`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '16px',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: `${section.color}10`
                }}>
                  <div style={{ 
                    fontSize: '32px', 
                    color: section.color,
                    marginBottom: '8px'
                  }}>
                    {section.icon}
                  </div>
                  <Title level={5} style={{ margin: 0, color: section.color }}>
                    {section.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {section.titleEn}
                  </Text>
                </div>

                <Text type="secondary" style={{ 
                  display: 'block', 
                  marginBottom: '12px',
                  textAlign: 'center',
                  fontSize: '13px'
                }}>
                  {section.description}
                </Text>

                <ul style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  paddingLeft: '16px',
                  margin: '12px 0'
                }}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} style={{ marginBottom: '4px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                type="primary" 
                block
                style={{ 
                  backgroundColor: section.color,
                  borderColor: section.color,
                  fontWeight: 'bold'
                }}
                onClick={() => router.push(section.route)}
              >
                ចូលប្រើ / Access
              </Button>
            </Card>
          </Col>
        ))}
      </Row>

      <Divider style={{ margin: '48px 0 24px 0' }} />

      <div style={{ textAlign: 'center' }}>
        <Text type="secondary">
          សម្រាប់ជំនួយបន្ថែម សូមទាក់ទងក្រុម IT / For additional help, please contact the IT team
        </Text>
      </div>
    </div>
  );
}
export default function AdministrationPage() {
  return (
    <HorizontalLayout>
      <AdministrationPageContent />
    </HorizontalLayout>
  );
}
