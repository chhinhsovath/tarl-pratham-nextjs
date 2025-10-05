'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  message, 
  Modal, 
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Tabs,
  Badge,
  Tooltip,
  Popconfirm,
  Typography
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function VerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState<number[]>([]);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    search: '',
    assessment_type: '',
    subject: '',
    school_id: '',
    teacher_id: ''
  });
  
  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
    total: 0
  });

  const [form] = Form.useForm();

  // Check permission
  useEffect(() => {
    if (session && !['admin', 'mentor'].includes(session.user?.role || '')) {
      message.error('អ្នកមិនមានសិទ្ធិចូលទៅទំព័រនេះទេ');
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    fetchAssessments();
    fetchStats();
  }, [activeTab, filters]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // TODO: Create verification API endpoint
      // For now, return empty array until API is implemented
      setAssessments([]);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // TODO: Fetch real statistics from API
    setStats({
      pending: 0,
      verified: 0,
      rejected: 0,
      total: 0
    });
  };

  const handleVerify = async (record: any) => {
    setSelectedAssessment(record);
    setVerifyModalVisible(true);
  };

  const handleVerifySubmit = async () => {
    try {
      const values = await form.validateFields();
      
      message.success(`ការវាយតម្លៃត្រូវបាន${values.action === 'verify' ? 'ផ្ទៀងផ្ទាត់' : 'បដិសេធ'}ដោយជោគជ័យ`);
      
      setVerifyModalVisible(false);
      form.resetFields();
      fetchAssessments();
      fetchStats();
    } catch (error) {
      console.error('Verification error:', error);
      message.error('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
    }
  };

  const handleBulkVerify = async () => {
    if (selectedAssessments.length === 0) {
      message.warning('សូមជ្រើសរើសការវាយតម្លៃយ៉ាងហោចណាស់មួយ');
      return;
    }

    Modal.confirm({
      title: 'ផ្ទៀងផ្ទាត់ច្រើន',
      content: `តើអ្នកពិតជាចង់ផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${selectedAssessments.length} មែនទេ?`,
      okText: 'យល់ព្រម',
      cancelText: 'បោះបង់',
      onOk: async () => {
        try {
          message.success(`បានផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${selectedAssessments.length} ដោយជោគជ័យ`);
          setSelectedAssessments([]);
          fetchAssessments();
          fetchStats();
        } catch (error) {
          message.error('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
        }
      }
    });
  };

  const columns = [
    {
      title: 'សិស្ស',
      key: 'student',
      render: (record: any) => (
        <div>
          <div className="font-semibold">{record.student_name}</div>
          <div className="text-xs text-gray-500">{record.student_id}</div>
        </div>
      )
    },
    {
      title: 'សាលា/ថ្នាក់',
      key: 'school',
      render: (record: any) => (
        <div>
          <div className="text-sm">{record.school}</div>
          <div className="text-xs text-gray-500">{record.class}</div>
        </div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      render: (type: string) => {
        const typeMap = {
          baseline: { label: 'មូលដ្ឋាន', color: 'blue' },
          midline: { label: 'ពាក់កណ្តាល', color: 'orange' },
          endline: { label: 'បញ្ចប់', color: 'green' }
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      }
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject: string) => (
        <Tag color={subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
        </Tag>
      )
    },
    {
      title: 'កម្រិត',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => {
        const levelMap = {
          beginner: 'ចាប់ផ្តើម',
          letter: 'អក្សរ',
          word: 'ពាក្យ',
          paragraph: 'កថាខណ្ឌ'
        };
        return levelMap[level as keyof typeof levelMap] || level;
      }
    },
    {
      title: 'ពិន្ទុ',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag color={score >= 80 ? 'green' : score >= 60 ? 'orange' : 'red'}>
          {score}%
        </Tag>
      )
    },
    {
      title: 'វាយតម្លៃដោយ',
      key: 'assessor',
      render: (record: any) => (
        <div>
          <div className="text-sm">{record.assessed_by}</div>
          <div className="text-xs text-gray-500">{record.assessed_date}</div>
        </div>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      render: (record: any) => {
        if (record.status === 'verified') {
          return (
            <Tooltip title={`ផ្ទៀងផ្ទាត់ដោយ ${record.verified_by} នៅ ${record.verified_date}`}>
              <Tag icon={<CheckCircleOutlined />} color="green">បានផ្ទៀងផ្ទាត់</Tag>
            </Tooltip>
          );
        } else if (record.status === 'rejected') {
          return (
            <Tooltip title={`បដិសេធដោយ ${record.rejected_by}: ${record.rejected_reason}`}>
              <Tag icon={<CloseCircleOutlined />} color="red">បានបដិសេធ</Tag>
            </Tooltip>
          );
        } else {
          return <Tag icon={<ExclamationCircleOutlined />} color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }
      }
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Tooltip title="ផ្ទៀងផ្ទាត់">
                <Button 
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => handleVerify(record)}
                >
                  ផ្ទៀងផ្ទាត់
                </Button>
              </Tooltip>
              <Tooltip title="មើលលម្អិត">
                <Button 
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => router.push(`/assessments/${record.id}`)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'verified' && (
            <Button 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/assessments/${record.id}`)}
            >
              មើល
            </Button>
          )}
          {record.status === 'rejected' && (
            <Button 
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => handleVerify(record)}
            >
              ពិនិត្យឡើងវិញ
            </Button>
          )}
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedAssessments,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedAssessments(selectedRowKeys as number[]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 'pending'
    })
  };

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>ផ្ទៀងផ្ទាត់ការវាយតម្លៃ</Title>
          <Text type="secondary">ពិនិត្យ និងផ្ទៀងផ្ទាត់ការវាយតម្លៃដែលធ្វើដោយគ្រូបង្រៀន</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[8, 8]} className="mb-6">
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="រង់ចាំផ្ទៀងផ្ទាត់"
                value={stats.pending}
                valueStyle={{ color: '#faad14', fontSize: '20px' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="បានផ្ទៀងផ្ទាត់"
                value={stats.verified}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="បានបដិសេធ"
                value={stats.rejected}
                valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="សរុប"
                value={stats.total}
                valueStyle={{ fontSize: '20px' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6" bodyStyle={{ padding: '16px' }}>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរក..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                size="middle"
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="ប្រភេទ"
                value={filters.assessment_type}
                onChange={(value) => setFilters({...filters, assessment_type: value})}
                allowClear
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="baseline">មូលដ្ឋាន</Option>
                <Option value="midline">ពាក់កណ្តាល</Option>
                <Option value="endline">បញ្ចប់</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="មុខវិជ្ជា"
                value={filters.subject}
                onChange={(value) => setFilters({...filters, subject: value})}
                allowClear
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="khmer">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space wrap style={{ width: '100%' }}>
                <Button
                  onClick={() => {
                    setFilters({
                      search: '',
                      assessment_type: '',
                      subject: '',
                      school_id: '',
                      teacher_id: ''
                    });
                  }}
                  size="middle"
                >
                  សម្អាត
                </Button>
                {selectedAssessments.length > 0 && (
                  <Button
                    type="primary"
                    onClick={handleBulkVerify}
                    size="middle"
                  >
                    ផ្ទៀងផ្ទាត់ ({selectedAssessments.length})
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabs for different statuses */}
        <Card bodyStyle={{ padding: '16px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'pending',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    រង់ចាំ
                    <Badge count={stats.pending} offset={[5, 0]} style={{ marginLeft: '4px' }} />
                  </span>
                )
              },
              {
                key: 'verified',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    បានផ្ទៀងផ្ទាត់
                    <Badge count={stats.verified} offset={[5, 0]} showZero color="green" style={{ marginLeft: '4px' }} />
                  </span>
                )
              },
              {
                key: 'rejected',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    បានបដិសេធ
                    <Badge count={stats.rejected} offset={[5, 0]} showZero color="red" style={{ marginLeft: '4px' }} />
                  </span>
                )
              }
            ]}
          />

          {/* Table */}
          <Table
            scroll={{ x: 800 }}
            rowSelection={activeTab === 'pending' ? rowSelection : undefined}
            columns={columns}
            dataSource={assessments}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total}`,
              simple: typeof window !== 'undefined' && window.innerWidth < 768
            }}
            size="small"
          />
        </Card>

        {/* Verification Modal */}
        <Modal
          title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ"
          open={verifyModalVisible}
          onOk={handleVerifySubmit}
          onCancel={() => {
            setVerifyModalVisible(false);
            form.resetFields();
          }}
          okText="រក្សាទុក"
          cancelText="បោះបង់"
          width={600}
        >
          {selectedAssessment && (
            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="text-sm">
                      <strong>សិស្ស:</strong> {selectedAssessment.student_name}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-sm">
                      <strong>ពិន្ទុ:</strong> {selectedAssessment.score}%
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="text-sm">
                      <strong>មុខវិជ្ជា:</strong> {selectedAssessment.subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="text-sm">
                      <strong>កម្រិត:</strong> {selectedAssessment.level}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          <Form form={form} layout="vertical">
            <Form.Item
              name="action"
              label="សកម្មភាព"
              rules={[{ required: true, message: 'សូមជ្រើសរើសសកម្មភាព' }]}
              initialValue="verify"
            >
              <Select>
                <Option value="verify">
                  <CheckCircleOutlined style={{ color: 'green' }} /> ផ្ទៀងផ្ទាត់
                </Option>
                <Option value="reject">
                  <CloseCircleOutlined style={{ color: 'red' }} /> បដិសេធ
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="comments"
              label="មតិយោបល់"
              rules={[{ required: true, message: 'សូមបញ្ចូលមតិយោបល់' }]}
            >
              <TextArea rows={4} placeholder="បញ្ចូលមតិយោបល់របស់អ្នក..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HorizontalLayout>
  );
}