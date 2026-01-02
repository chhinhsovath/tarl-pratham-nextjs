'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Statistic,
  Row,
  Col,
  Tag,
  Progress,
  message,
  Select,
  Input,
  Dropdown,
  MenuProps,
  Modal,
  Popconfirm
} from 'antd';
import {
  BankOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
  SearchOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import SoftDeleteButton from '@/components/common/SoftDeleteButton';

const { Title, Text } = Typography;
const { Option } = Select;

interface SchoolOverview {
  school_id: number;
  school_name: string;
  school_code: string;
  total_students: number;
  baseline_count: number;
  midline_count: number;
  endline_count: number;
  total_assessments: number;
  verified_count: number;
  mentoring_visits: number;
  has_mentor: boolean;
  mentor_name?: string;
}

interface SummaryStats {
  total_schools: number;
  total_students: number;
  schools_with_baseline: number;
  schools_with_midline: number;
  schools_with_endline: number;
  schools_with_verification: number;
  schools_with_mentoring: number;
  total_assessments: number;
}

function SchoolOverviewContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const [data, setData] = useState<SchoolOverview[]>([]);
  const [summary, setSummary] = useState<SummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Modal state for viewing students
  const [studentsModalVisible, setStudentsModalVisible] = useState(false);
  const [studentsModalLoading, setStudentsModalLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolOverview | null>(null);
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<string>('');
  const [modalStudents, setModalStudents] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports/school-overview');
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();
      setData(result.schools || []);
      setSummary(result.summary || null);
    } catch (error) {
      console.error('Error fetching school overview:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'excel' | 'pdf', lang: 'km' | 'en') => {
    try {
      const response = await fetch(`/api/reports/school-overview/export?format=${format}&lang=${lang}`);
      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      link.download = `school-overview-${new Date().toISOString().split('T')[0]}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success(`Export ${format.toUpperCase()} បានជោគជ័យ`);
    } catch (error) {
      message.error('Export បរាជ័យ');
    }
  };

  const handleViewStudents = async (school: SchoolOverview, assessmentType: string) => {
    setSelectedSchool(school);
    setSelectedAssessmentType(assessmentType);
    setStudentsModalVisible(true);
    setStudentsModalLoading(true);

    try {
      const response = await fetch(
        `/api/reports/school-overview/${school.school_id}/students?assessment_type=${assessmentType}`
      );
      if (!response.ok) throw new Error('Failed to fetch students');

      const result = await response.json();
      setModalStudents(result.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
      setModalStudents([]);
    } finally {
      setStudentsModalLoading(false);
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    // Refresh modal data after deletion
    if (selectedSchool && selectedAssessmentType) {
      await handleViewStudents(selectedSchool, selectedAssessmentType);
      await fetchData(); // Refresh main table
    }
  };

  const exportMenuItems: MenuProps['items'] = [
    {
      key: 'excel-km',
      icon: <FileExcelOutlined />,
      label: 'Excel (ខ្មែរ)',
      onClick: () => handleExport('excel', 'km')
    },
    {
      key: 'excel-en',
      icon: <FileExcelOutlined />,
      label: 'Excel (English)',
      onClick: () => handleExport('excel', 'en')
    },
    {
      type: 'divider'
    },
    {
      key: 'pdf-km',
      icon: <FilePdfOutlined />,
      label: 'PDF (ខ្មែរ)',
      onClick: () => handleExport('pdf', 'km')
    },
    {
      key: 'pdf-en',
      icon: <FilePdfOutlined />,
      label: 'PDF (English)',
      onClick: () => handleExport('pdf', 'en')
    }
  ];

  const filteredData = data.filter(school => {
    const matchesSearch = school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.school_code.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (filterType) {
      case 'with_baseline':
        return school.baseline_count > 0;
      case 'with_midline':
        return school.midline_count > 0;
      case 'with_endline':
        return school.endline_count > 0;
      case 'with_mentor':
        return school.has_mentor;
      case 'no_assessments':
        return school.total_assessments === 0;
      default:
        return true;
    }
  });

  const columns = [
    {
      title: 'សាលារៀន',
      key: 'school',
      fixed: 'left' as const,
      width: 200,
      render: (record: SchoolOverview) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.school_name}</div>
          <Tag color="blue">{record.school_code}</Tag>
        </div>
      )
    },
    {
      title: 'សិស្សសរុប',
      dataIndex: 'total_students',
      key: 'total_students',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Statistic
          value={count}
          valueStyle={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}
        />
      )
    },
    {
      title: 'តេស្តដើមគ្រា',
      dataIndex: 'baseline_count',
      key: 'baseline_count',
      width: 120,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div
          style={{
            cursor: count > 0 && session?.user?.role === 'coordinator' ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (count > 0 && session?.user?.role === 'coordinator') {
              handleViewStudents(record, 'baseline');
            }
          }}
        >
          <div style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: count > 0 ? '#52c41a' : '#ccc',
            textDecoration: count > 0 && session?.user?.role === 'coordinator' ? 'underline' : 'none'
          }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#1890ff"
            />
          )}
        </div>
      )
    },
    {
      title: 'តេស្តពាក់កណ្ដាលគ្រា',
      dataIndex: 'midline_count',
      key: 'midline_count',
      width: 140,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div
          style={{
            cursor: count > 0 && session?.user?.role === 'coordinator' ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (count > 0 && session?.user?.role === 'coordinator') {
              handleViewStudents(record, 'midline');
            }
          }}
        >
          <div style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: count > 0 ? '#faad14' : '#ccc',
            textDecoration: count > 0 && session?.user?.role === 'coordinator' ? 'underline' : 'none'
          }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#fa8c16"
            />
          )}
        </div>
      )
    },
    {
      title: 'តេស្តចុងក្រោយគ្រា',
      dataIndex: 'endline_count',
      key: 'endline_count',
      width: 140,
      align: 'center' as const,
      render: (count: number, record: SchoolOverview) => (
        <div
          style={{
            cursor: count > 0 && session?.user?.role === 'coordinator' ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (count > 0 && session?.user?.role === 'coordinator') {
              handleViewStudents(record, 'endline');
            }
          }}
        >
          <div style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: count > 0 ? '#52c41a' : '#ccc',
            textDecoration: count > 0 && session?.user?.role === 'coordinator' ? 'underline' : 'none'
          }}>
            {count}
          </div>
          {record.total_students > 0 && (
            <Progress
              percent={Math.round((count / record.total_students) * 100)}
              size="small"
              strokeColor="#52c41a"
            />
          )}
        </div>
      )
    },
    {
      title: 'ការវាយតម្លៃសរុប',
      dataIndex: 'total_assessments',
      key: 'total_assessments',
      width: 120,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'} style={{ fontSize: 14 }}>
          {count}
        </Tag>
      )
    },
    {
      title: 'ផ្ទៀងផ្ទាត់',
      dataIndex: 'verified_count',
      key: 'verified_count',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'purple' : 'default'} style={{ fontSize: 14 }}>
          {count}
        </Tag>
      )
    },
    {
      title: 'ការណែនាំ/សង្កេត',
      dataIndex: 'mentoring_visits',
      key: 'mentoring_visits',
      width: 120,
      align: 'center' as const,
      render: (count: number) => (
        <Tag color={count > 0 ? 'cyan' : 'default'} style={{ fontSize: 14 }}>
          {count} ដង
        </Tag>
      )
    },
    {
      title: 'អ្នកណែនាំ',
      key: 'mentor',
      width: 150,
      render: (record: SchoolOverview) => (
        record.has_mentor ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>
            {record.mentor_name || 'មាន'}
          </Tag>
        ) : (
          <Tag color="red">មិនមាន</Tag>
        )
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (record: SchoolOverview) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => router.push(`/schools/${record.school_id}`)}
          >
            មើល
          </Button>
        </Space>
      )
    }
  ];

  return (
    <>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>របាយការណ៍ទូទៅសាលារៀន</Title>
        <Text type="secondary">ទិដ្ឋភាពទូទៅនៃសាលារៀន សិស្ស ការវាយតម្លៃ និងការណែនាំ</Text>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សាលារៀនសរុប"
                value={summary.total_schools}
                prefix={<BankOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={summary.total_students}
                prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ការវាយតម្លៃសរុប"
                value={summary.total_assessments}
                prefix={<FileTextOutlined style={{ color: '#722ed1' }} />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សាលាមានអ្នកណែនាំ"
                value={summary.schools_with_mentoring}
                suffix={`/ ${summary.total_schools}`}
                prefix={<CheckCircleOutlined style={{ color: '#fa8c16' }} />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Assessment Coverage */}
      {summary && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមានតេស្តដើមគ្រា"
                value={summary.schools_with_baseline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#1890ff' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_baseline / summary.total_schools) * 100)}
                strokeColor="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមានតេស្តពាក់កណ្ដាលគ្រា"
                value={summary.schools_with_midline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#fa8c16' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_midline / summary.total_schools) * 100)}
                strokeColor="#fa8c16"
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card>
              <Statistic
                title="សាលាមានតេស្តចុងក្រោយគ្រា"
                value={summary.schools_with_endline}
                suffix={`/ ${summary.total_schools}`}
                valueStyle={{ color: '#52c41a' }}
              />
              <Progress
                percent={Math.round((summary.schools_with_endline / summary.total_schools) * 100)}
                strokeColor="#52c41a"
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Filters and Actions */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space wrap>
            <Input
              placeholder="ស្វែងរកសាលារៀន..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 220 }}
            >
              <Option value="all">ទាំងអស់</Option>
              <Option value="with_baseline">មានតេស្តដើមគ្រា</Option>
              <Option value="with_midline">មានតេស្តពាក់កណ្ដាលគ្រា</Option>
              <Option value="with_endline">មានតេស្តចុងក្រោយគ្រា</Option>
              <Option value="with_mentor">មានអ្នកណែនាំ</Option>
              <Option value="no_assessments">គ្មានការវាយតម្លៃ</Option>
            </Select>
          </Space>
          <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
            >
              Export
            </Button>
          </Dropdown>
        </Space>
      </Card>

      {/* Data Table */}
      <Card>
        {/* Total count display */}
        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
          <Text strong>សរុប: {filteredData.length} សាលារៀន</Text>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="school_id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={false}
        />
      </Card>

      {/* Students Modal for Coordinators */}
      <Modal
        title={
          <Space direction="vertical" size={0}>
            <Text strong style={{ fontSize: 18 }}>
              {selectedSchool?.school_name} - {
                selectedAssessmentType === 'baseline' ? 'តេស្តដើមគ្រា' :
                selectedAssessmentType === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' :
                'តេស្តចុងក្រោយគ្រា'
              }
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }}>
              សិស្សទាំងអស់ដែលបានធ្វើការវាយតម្លៃ
            </Text>
          </Space>
        }
        open={studentsModalVisible}
        onCancel={() => setStudentsModalVisible(false)}
        footer={null}
        width={1000}
      >
        <Table
          dataSource={modalStudents}
          loading={studentsModalLoading}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `សរុប ${total} សិស្ស`
          }}
          columns={[
            {
              title: 'លេខសិស្ស',
              dataIndex: 'student_id',
              key: 'student_id',
              width: 100
            },
            {
              title: 'ឈ្មោះសិស្ស',
              dataIndex: 'name',
              key: 'name',
              width: 150
            },
            {
              title: 'ភេទ',
              dataIndex: 'gender',
              key: 'gender',
              width: 80,
              render: (gender: string) => gender === 'male' ? 'ប្រុស' : 'ស្រី'
            },
            {
              title: 'អាយុ',
              dataIndex: 'age',
              key: 'age',
              width: 70,
              align: 'center' as const
            },
            {
              title: 'ថ្នាក់',
              dataIndex: 'grade',
              key: 'grade',
              width: 70,
              align: 'center' as const
            },
            {
              title: 'ការវាយតម្លៃ',
              key: 'assessments',
              render: (record: any) => (
                <Space direction="vertical" size="small">
                  {record.assessments?.map((assessment: any) => (
                    <Tag
                      key={assessment.id}
                      color={assessment.subject === 'language' ? 'purple' : 'cyan'}
                    >
                      {assessment.subject === 'language' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}: {assessment.level}
                    </Tag>
                  ))}
                </Space>
              )
            },
            {
              title: 'សកម្មភាព',
              key: 'actions',
              fixed: 'right' as const,
              width: 120,
              render: (record: any) => (
                <Space size="small">
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/students/${record.id}/edit`)}
                    title="កែសម្រួលសិស្ស"
                  />
                  <SoftDeleteButton
                    type="student"
                    id={record.id}
                    displayName={record.name}
                    size="small"
                    iconOnly={true}
                    onSuccess={handleDeleteStudent}
                  />
                </Space>
              )
            }
          ]}
        />
      </Modal>
    </>
  );
}

export default function SchoolOverviewPage() {
  return (
    <HorizontalLayout>
      <SchoolOverviewContent />
    </HorizontalLayout>
  );
}
