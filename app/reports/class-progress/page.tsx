'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Select,
  Button,
  Space,
  Typography,
  Tag,
  Breadcrumb,
  Input,
  Alert
} from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  SearchOutlined,
  PrinterOutlined,
  HomeOutlined,
  BarChartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface ClassData {
  id: number;
  name: string;
  grade: number;
  teacher_name: string;
  student_count: number;
  school_name: string;
}

export default function ClassProgressPage() {
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [classData, setClassData] = useState<ClassData[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudentsInClasses: 0,
    classesWithTeachers: 0,
    averageClassSize: 0
  });

  useEffect(() => {
    fetchClassData();
  }, []);

  const fetchClassData = async () => {
    try {
      setLoading(true);

      // For now, show informational message since we don't have class-student relationships
      // In future, this would fetch from /api/reports?type=class-progress

      setStats({
        totalClasses: 0,
        totalStudentsInClasses: 0,
        classesWithTeachers: 0,
        averageClassSize: 0
      });

    } catch (error) {
      console.error('Failed to fetch class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ClassData> = [
    {
      title: 'ថ្នាក់រៀន',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record) => (
        <Space>
          <BookOutlined style={{ color: '#1890ff' }} />
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ថ្នាក់ទី{record.grade}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text || '-'}</Text>
      ),
    },
    {
      title: 'គ្រូបង្រៀន',
      dataIndex: 'teacher_name',
      key: 'teacher_name',
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text || '-'}</Text>
      ),
    },
    {
      title: 'ចំនួនសិស្ស',
      dataIndex: 'student_count',
      key: 'student_count',
      align: 'center',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>
          <TeamOutlined /> {count} សិស្ស
        </Tag>
      ),
      sorter: (a, b) => a.student_count - b.student_count,
    }
  ];

  const filteredData = classData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         (item.teacher_name && item.teacher_name.toLowerCase().includes(searchText.toLowerCase()));
    const matchesGrade = !selectedGrade || item.grade.toString() === selectedGrade;

    return matchesSearch && matchesGrade;
  });

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Breadcrumb */}
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <Breadcrumb.Item>
            <HomeOutlined /> ទំព័រដើម
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <BarChartOutlined /> របាយការណ៍
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            វឌ្ឍនភាពថ្នាក់
          </Breadcrumb.Item>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>វឌ្ឍនភាពថ្នាក់រៀន</Title>
          <Text type="secondary">តាមដានវឌ្ឍនភាពតាមថ្នាក់រៀន</Text>
        </div>

        {/* Info Alert */}
        <Alert
          message="ព័ត៌មានអំពីរបាយការណ៍"
          description="របាយការណ៍នេះនឹងបង្ហាញព័ត៌មានលម្អិតអំពីថ្នាក់រៀននៅពេលមានទិន្នន័យថ្នាក់-សិស្សនៅក្នុងប្រព័ន្ធ។ បច្ចុប្បន្ន សិស្សត្រូវបានគ្រប់គ្រងដោយផ្ទាល់តាមសាលា។"
          type="info"
          icon={<InfoCircleOutlined />}
          showIcon
          style={{ marginBottom: '24px' }}
        />

        {/* Statistics Cards */}
        <Row gutter={16} className="mb-6">
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ថ្នាក់រៀនសរុប"
                value={stats.totalClasses}
                prefix={<BookOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={stats.totalStudentsInClasses}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ថ្នាក់មានគ្រូ"
                value={stats.classesWithTeachers}
                prefix={<BookOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ទំហំថ្នាក់មធ្យម"
                value={stats.averageClassSize}
                suffix="សិស្ស"
                prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6">
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរកថ្នាក់ ឬ គ្រូ..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                placeholder="ថ្នាក់"
                style={{ width: '100%' }}
                value={selectedGrade}
                onChange={setSelectedGrade}
                allowClear
              >
                <Option value="4">ថ្នាក់ទី៤</Option>
                <Option value="5">ថ្នាក់ទី៥</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space>
                <Button icon={<PrinterOutlined />} onClick={() => window.print()}>បោះពុម្ព</Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Class Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            loading={loading}
            scroll={{ x: 'max-content' }}
            locale={{
              emptyText: 'មិនមានទិន្នន័យថ្នាក់រៀននៅឡើយទេ'
            }}
            pagination={{
              total: filteredData.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} ពី ${total} ថ្នាក់`,
            }}
          />
        </Card>
      </div>
    </HorizontalLayout>
  );
}
