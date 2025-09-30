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
  Alert,
  Tooltip,
  Upload,
  Typography,
  Divider,
  Progress,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  UploadOutlined,
  SearchOutlined,
  FilterOutlined,
  LineChartOutlined,
  BarChartOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

function InterventionReportsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [interventions, setInterventions] = useState([]);
  const [selectedInterventions, setSelectedInterventions] = useState<number[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    intervention_type: '',
    school_id: '',
    date_from: '',
    date_to: '',
    teacher_id: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
    effectiveness_rate: 0
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInterventions();
    fetchStats();
  }, [filters]);

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ).toString();

      // TODO: Create interventions API endpoint
      // For now, return empty array until API is implemented
      setInterventions([]);
    } catch (error) {
      console.error('Error fetching interventions:', error);
      message.error('មិនអាចទាញយកទិន្នន័យបានទេ');
      setInterventions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats
      setStats({
        total: 15,
        active: 5,
        completed: 8,
        pending: 2,
        effectiveness_rate: 82
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreate = () => {
    setSelectedIntervention(null);
    setIsEditing(false);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: any) => {
    setSelectedIntervention(record);
    setIsEditing(true);
    setModalVisible(true);
    form.setFieldsValue({
      intervention_name: record.intervention_name,
      intervention_type: record.intervention_type,
      target_students: record.target_students,
      start_date: dayjs(record.start_date),
      end_date: dayjs(record.end_date),
      description: record.description,
      materials_used: record.materials_used,
      status: record.status
    });
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'លុបការអន្តរាគមន៍',
      content: 'តើអ្នកពិតជាចង់លុបការអន្តរាគមន៍នេះមែនទេ?',
      okText: 'លុប',
      cancelText: 'បោះបង់',
      okType: 'danger',
      onOk: async () => {
        try {
          // API call would go here
          message.success('បានលុបការអន្តរាគមន៍ដោយជោគជ័យ');
          fetchInterventions();
        } catch (error) {
          message.error('មិនអាចលុបបានទេ');
        }
      }
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        start_date: values.start_date?.format('YYYY-MM-DD'),
        end_date: values.end_date?.format('YYYY-MM-DD'),
        created_by: session?.user?.id
      };

      if (isEditing) {
        // Update API call
        message.success('បានកែប្រែការអន្តរាគមន៍ដោយជោគជ័យ');
      } else {
        // Create API call
        message.success('បានបង្កើតការអន្តរាគមន៍ដោយជោគជ័យ');
      }

      setModalVisible(false);
      fetchInterventions();
      fetchStats();
    } catch (error) {
      message.error('មិនអាចរក្សាទុកបានទេ');
    }
  };

  const handleExport = () => {
    // Export functionality
    message.info('កំពុងនាំចេញរបាយការណ៍...');
  };

  const columns = [
    {
      title: 'ឈ្មោះការអន្តរាគមន៍',
      dataIndex: 'intervention_name',
      key: 'intervention_name',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.school?.school_name} - {record.school?.district}
          </div>
        </div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'intervention_type',
      key: 'intervention_type',
      render: (type: string) => (
        <Tag color={type === 'literacy' ? 'blue' : type === 'numeracy' ? 'green' : 'orange'}>
          {type === 'literacy' && 'អក្សរសាស្ត្រ'}
          {type === 'numeracy' && 'គណិតវិទ្យា'}
          {type === 'combined' && 'រួមបញ្ចូល'}
        </Tag>
      )
    },
    {
      title: 'សិស្សចូលរួម',
      key: 'participants',
      render: (_: any, record: any) => (
        <div>
          <div>{record.actual_participants}/{record.target_students}</div>
          <Progress 
            percent={Math.round((record.actual_participants / record.target_students) * 100)} 
            size="small" 
            showInfo={false}
          />
        </div>
      )
    },
    {
      title: 'រយៈពេល',
      key: 'duration',
      render: (_: any, record: any) => (
        <div>
          <div>{dayjs(record.start_date).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ដល់ {dayjs(record.end_date).format('DD/MM/YYYY')}
          </div>
        </div>
      )
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors = {
          active: 'processing',
          completed: 'success',
          pending: 'warning',
          cancelled: 'error'
        };
        const labels = {
          active: 'កំពុងដំណើរការ',
          completed: 'បានបញ្ចប់',
          pending: 'រង់ចាំ',
          cancelled: 'បានបោះបង់'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      }
    },
    {
      title: 'ប្រសិទ្ធភាព',
      dataIndex: 'effectiveness_score',
      key: 'effectiveness_score',
      render: (score: number) => (
        <div>
          <Progress 
            percent={score} 
            size="small" 
            status={score >= 80 ? 'success' : score >= 60 ? 'normal' : 'exception'}
          />
        </div>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="កែប្រែ">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="លុប">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedInterventions,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInterventions(selectedRowKeys as number[]);
    },
  };

  return (
    <HorizontalLayout>
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={3} style={{ margin: 0 }}>របាយការណ៍អន្តរាគមន៍</Title>
                <Space>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                    បង្កើតអន្តរាគមន៍ថ្មី
                  </Button>
                  <Button icon={<FileExcelOutlined />} onClick={handleExport}>
                    នាំចេញ Excel
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="សរុបការអន្តរាគមន៍"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="កំពុងដំណើរការ"
                value={stats.active}
                valueStyle={{ color: '#52c41a' }}
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="បានបញ្ចប់"
                value={stats.completed}
                valueStyle={{ color: '#722ed1' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="អត្រាប្រសិទ្ធភាព"
                value={stats.effectiveness_rate}
                suffix="%"
                valueStyle={{ color: '#f5222d' }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginBottom: 24 }}>
          <Form layout="inline" onFinish={(values) => setFilters({...filters, ...values})}>
            <Form.Item name="status">
              <Select style={{ width: 150 }} placeholder="ស្ថានភាព">
                <Option value="">ស្ថានភាពទាំងអស់</Option>
                <Option value="active">កំពុងដំណើរការ</Option>
                <Option value="completed">បានបញ្ចប់</Option>
                <Option value="pending">រង់ចាំ</Option>
              </Select>
            </Form.Item>

            <Form.Item name="intervention_type">
              <Select style={{ width: 150 }} placeholder="ប្រភេទអន្តរាគមន៍">
                <Option value="">ប្រភេទទាំងអស់</Option>
                <Option value="literacy">អក្សរសាស្ត្រ</Option>
                <Option value="numeracy">គណិតវិទ្យា</Option>
                <Option value="combined">រួមបញ្ចូល</Option>
              </Select>
            </Form.Item>

            <Form.Item name="date_from">
              <DatePicker placeholder="ពីកាលបរិច្ឆេទ" />
            </Form.Item>

            <Form.Item name="date_to">
              <DatePicker placeholder="ដល់កាលបរិច្ឆេទ" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                ស្វែងរក
              </Button>
            </Form.Item>

            <Form.Item>
              <Button onClick={() => {
                setFilters({
                  status: '',
                  intervention_type: '',
                  school_id: '',
                  date_from: '',
                  date_to: '',
                  teacher_id: ''
                });
                form.resetFields();
              }}>
                កំណត់ឡើងវិញ
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card>
          <Table scroll={{ x: "max-content" }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={interventions}
            rowKey="id"
            loading={loading}
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `សរុប ${total} ការអន្តរាគមន៍`,
            }}
          />
        </Card>

        <Modal
          title={isEditing ? 'កែប្រែការអន្តរាគមន៍' : 'បង្កើតការអន្តរាគមន៍ថ្មី'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="intervention_name"
                  label="ឈ្មោះការអន្តរាគមន៍"
                  rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះការអន្តរាគមន៍' }]}
                >
                  <Input placeholder="បញ្ចូលឈ្មោះការអន្តរាគមន៍" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="intervention_type"
                  label="ប្រភេទអន្តរាគមន៍"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសប្រភេទអន្តរាគមន៍' }]}
                >
                  <Select placeholder="ជ្រើសរើសប្រភេទ">
                    <Option value="literacy">អក្សរសាស្ត្រ</Option>
                    <Option value="numeracy">គណិតវិទ្យា</Option>
                    <Option value="combined">រួមបញ្ចូល</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="target_students"
                  label="ចំនួនសិស្សគោលដៅ"
                  rules={[{ required: true, message: 'សូមបញ្ចូលចំនួនសិស្សគោលដៅ' }]}
                >
                  <Input type="number" placeholder="ចំនួនសិស្ស" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="start_date"
                  label="កាលបរិច្ឆេទចាប់ផ្តើម"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទចាប់ផ្តើម' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="end_date"
                  label="កាលបរិច្ឆេទបញ្ចប់"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទបញ្ចប់' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="description"
              label="ការពិពណ៌នា"
              rules={[{ required: true, message: 'សូមបញ្ចូលការពិពណ៌នា' }]}
            >
              <TextArea rows={3} placeholder="ពិពណ៌នាអំពីការអន្តរាគមន៍" />
            </Form.Item>

            <Form.Item
              name="materials_used"
              label="សម្ភារៈដែលប្រើ"
            >
              <TextArea rows={2} placeholder="រាយមកសម្ភារៈដែលប្រើក្នុងការអន្តរាគមន៍" />
            </Form.Item>

            {isEditing && (
              <Form.Item
                name="status"
                label="ស្ថានភាព"
              >
                <Select>
                  <Option value="pending">រង់ចាំ</Option>
                  <Option value="active">កំពុងដំណើរការ</Option>
                  <Option value="completed">បានបញ្ចប់</Option>
                  <Option value="cancelled">បានបោះបង់</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {isEditing ? 'កែប្រែ' : 'បង្កើត'}
                </Button>
                <Button onClick={() => setModalVisible(false)}>
                  បោះបង់
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HorizontalLayout>
  );
}

export default InterventionReportsPage;