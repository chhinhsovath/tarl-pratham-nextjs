'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Card,
  Typography,
  message,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  DatePicker,
  Switch,
  Tooltip,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  BankOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  LockOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface PilotSchool {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  cluster: string;
  cluster_id?: number;
  baseline_start_date?: string;
  baseline_end_date?: string;
  midline_start_date?: string;
  midline_end_date?: string;
  endline_start_date?: string;
  endline_end_date?: string;
  is_locked: boolean;
  created_at: string;
}

const PROVINCES = [
  'កំពង់ចាម', 'បាត់ដំបង', 'ព្រះវិហារ', 'សៀមរាប', 'ឧត្តរមានជ័យ',
  'បន្ទាយមានជ័យ', 'កំពង់ស្ពឺ', 'ត្បូងឃ្មុំ', 'កោះកុង', 'កំពង់ធំ'
];

function PilotSchoolsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchool, setEditingSchool] = useState<PilotSchool | null>(null);
  const [form] = Form.useForm();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showLocked, setShowLocked] = useState<boolean | undefined>(undefined);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    locked: 0,
    with_periods: 0,
  });

  // Check permissions
  const canCreate = session?.user?.role === 'admin' || session?.user?.role === 'coordinator';
  const canEdit = session?.user?.role === 'admin' || session?.user?.role === 'coordinator';
  const canDelete = session?.user?.role === 'admin' || session?.user?.role === 'coordinator';

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (session.user.role !== 'admin' && session.user.role !== 'coordinator') {
      message.error('អ្នកមិនមានសិទ្ធិចូលមើលទំព័រនេះ');
      router.push('/');
      return;
    }

    fetchSchools();
  }, [session, status, searchTerm, selectedProvince, showLocked]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pilot-schools');
      if (!response.ok) throw new Error('Failed to fetch schools');

      const data = await response.json();
      let filteredSchools = data.data || [];

      // Apply filters
      if (searchTerm) {
        filteredSchools = filteredSchools.filter((school: PilotSchool) =>
          school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.school_code.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedProvince) {
        filteredSchools = filteredSchools.filter((school: PilotSchool) =>
          school.province === selectedProvince
        );
      }

      if (showLocked !== undefined) {
        filteredSchools = filteredSchools.filter((school: PilotSchool) =>
          school.is_locked === showLocked
        );
      }

      setSchools(filteredSchools);

      // Calculate stats
      setStats({
        total: filteredSchools.length,
        locked: filteredSchools.filter((s: PilotSchool) => s.is_locked).length,
        with_periods: filteredSchools.filter((s: PilotSchool) =>
          s.baseline_start_date || s.midline_start_date || s.endline_start_date
        ).length,
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      message.error('មិនអាចផ្ទុកសាលារៀនបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSchool(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (school: PilotSchool) => {
    setEditingSchool(school);
    form.setFieldsValue({
      school_name: school.school_name,
      school_code: school.school_code,
      province: school.province,
      district: school.district,
      cluster: school.cluster,
      cluster_id: school.cluster_id,
      baseline: school.baseline_start_date && school.baseline_end_date
        ? [dayjs(school.baseline_start_date), dayjs(school.baseline_end_date)]
        : undefined,
      midline: school.midline_start_date && school.midline_end_date
        ? [dayjs(school.midline_start_date), dayjs(school.midline_end_date)]
        : undefined,
      endline: school.endline_start_date && school.endline_end_date
        ? [dayjs(school.endline_start_date), dayjs(school.endline_end_date)]
        : undefined,
      is_locked: school.is_locked,
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...(editingSchool && { id: editingSchool.id }),
        school_name: values.school_name,
        school_code: values.school_code,
        province: values.province,
        district: values.district,
        cluster: values.cluster,
        cluster_id: values.cluster_id,
        baseline_start_date: values.baseline?.[0]?.format('YYYY-MM-DD'),
        baseline_end_date: values.baseline?.[1]?.format('YYYY-MM-DD'),
        midline_start_date: values.midline?.[0]?.format('YYYY-MM-DD'),
        midline_end_date: values.midline?.[1]?.format('YYYY-MM-DD'),
        endline_start_date: values.endline?.[0]?.format('YYYY-MM-DD'),
        endline_end_date: values.endline?.[1]?.format('YYYY-MM-DD'),
        is_locked: values.is_locked || false,
      };

      const url = '/api/pilot-schools';
      const method = editingSchool ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save school');
      }

      message.success(editingSchool ? 'បានកែប្រែសាលារៀនដោយជោគជ័យ' : 'បានបង្កើតសាលារៀនដោយជោគជ័យ');
      setIsModalVisible(false);
      form.resetFields();
      fetchSchools();
    } catch (error: any) {
      console.error('Error saving school:', error);
      message.error(error.message || 'មិនអាចរក្សាទុកសាលារៀន');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/pilot-schools?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete school');
      }

      message.success('បានលុបសាលារៀនដោយជោគជ័យ');
      fetchSchools();
    } catch (error: any) {
      console.error('Error deleting school:', error);
      message.error(error.message || 'មិនអាចលុបសាលារៀន');
    }
  };

  const columns: ColumnsType<PilotSchool> = [
    {
      title: 'លេខកូដ',
      dataIndex: 'school_code',
      key: 'school_code',
      width: 120,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'ឈ្មោះសាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          {record.is_locked && (
            <Tag icon={<LockOutlined />} color="red" style={{ marginTop: 4 }}>
              ជាប់សោ
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'ទីតាំង',
      key: 'location',
      render: (_, record) => (
        <div>
          <div><EnvironmentOutlined /> {record.province}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.district} - {record.cluster}
          </div>
        </div>
      ),
    },
    {
      title: 'រយៈពេលវាយតម្លៃ',
      key: 'periods',
      render: (_, record) => {
        const hasPeriods = record.baseline_start_date || record.midline_start_date || record.endline_start_date;
        return hasPeriods ? (
          <Space direction="vertical" size="small">
            {record.baseline_start_date && (
              <Tag color="blue" icon={<CalendarOutlined />}>
                Baseline: {dayjs(record.baseline_start_date).format('DD/MM/YY')}
              </Tag>
            )}
            {record.midline_start_date && (
              <Tag color="orange" icon={<CalendarOutlined />}>
                Midline: {dayjs(record.midline_start_date).format('DD/MM/YY')}
              </Tag>
            )}
            {record.endline_start_date && (
              <Tag color="green" icon={<CalendarOutlined />}>
                Endline: {dayjs(record.endline_start_date).format('DD/MM/YY')}
              </Tag>
            )}
          </Space>
        ) : (
          <Tag color="default">មិនទាន់កំណត់</Tag>
        );
      },
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 100,
      render: (_, record) => record.is_locked ? (
        <Tag icon={<LockOutlined />} color="red">ជាប់សោ</Tag>
      ) : (
        <Tag icon={<UnlockOutlined />} color="green">ដោះសោ</Tag>
      ),
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Tooltip title="កែប្រែ">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}
          {canDelete && (
            <Popconfirm
              title="លុបសាលារៀន"
              description="តើអ្នកប្រាកដជាចង់លុបសាលារៀននេះមែនទេ?"
              onConfirm={() => handleDelete(record.id)}
              okText="បាទ/ចាស"
              cancelText="បោះបង់"
            >
              <Tooltip title="លុប">
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <HorizontalLayout>
      <div>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <BankOutlined /> គ្រប់គ្រងសាលារៀនសាកល្បង
          </Title>
        </div>

        {/* Stats Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Card>
              <Statistic title="សាលារៀនសរុប" value={stats.total} prefix={<BankOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="មានរយៈពេលវាយតម្លៃ" value={stats.with_periods} prefix={<CalendarOutlined />} />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic title="ជាប់សោ" value={stats.locked} prefix={<LockOutlined />} valueStyle={{ color: '#cf1322' }} />
            </Card>
          </Col>
        </Row>

        {/* Filters & Actions */}
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                placeholder="ស្វែងរកតាមឈ្មោះ ឬលេខកូដ"
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="ខេត្ត"
                value={selectedProvince}
                onChange={setSelectedProvince}
                style={{ width: '100%' }}
                allowClear
              >
                {PROVINCES.map((province) => (
                  <Option key={province} value={province}>
                    {province}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={6}>
              <Select
                placeholder="ស្ថានភាព"
                value={showLocked}
                onChange={setShowLocked}
                style={{ width: '100%' }}
                allowClear
              >
                <Option value={false}>ដោះសោ</Option>
                <Option value={true}>ជាប់សោ</Option>
              </Select>
            </Col>
            <Col span={4}>
              {canCreate && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                  block
                >
                  បង្កើតថ្មី
                </Button>
              )}
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={schools}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `សរុប ${total} សាលារៀន`,
            }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={editingSchool ? 'កែប្រែសាលារៀន' : 'បង្កើតសាលារៀនថ្មី'}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={900}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="school_name"
                  label="ឈ្មោះសាលារៀន"
                  rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសាលារៀន' }]}
                >
                  <Input placeholder="ឧទាហរណ៍: សាលាបឋមសិក្សា..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="school_code"
                  label="លេខកូដសាលារៀន"
                  rules={[{ required: true, message: 'សូមបញ្ចូលលេខកូដ' }]}
                >
                  <Input placeholder="ឧទាហរណ៍: SCH001" disabled={!!editingSchool} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="province"
                  label="ខេត្ត"
                  rules={[{ required: true, message: 'សូមជ្រើសរើសខេត្ត' }]}
                >
                  <Select placeholder="ជ្រើសរើសខេត្ត">
                    {PROVINCES.map((province) => (
                      <Option key={province} value={province}>
                        {province}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="district"
                  label="ស្រុក/ខណ្ឌ"
                  rules={[{ required: true, message: 'សូមបញ្ចូលស្រុក/ខណ្ឌ' }]}
                >
                  <Input placeholder="ឧទាហរណ៍: ស្រុកកំពង់ស្វាយ" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="cluster"
                  label="ចង្កោមសាលា"
                  rules={[{ required: true, message: 'សូមបញ្ចូលចង្កោមសាលា' }]}
                >
                  <Input placeholder="ឧទាហរណ៍: ចង្កោម A" />
                </Form.Item>
              </Col>
            </Row>

            <Title level={5} style={{ marginTop: 16, marginBottom: 16 }}>
              រយៈពេលវាយតម្លៃ (ស្រេចចិត្ត)
            </Title>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="baseline" label="តេស្តដើមគ្រា (Baseline)">
                  <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="midline" label="តេស្តពាក់កណ្ដាលគ្រា (Midline)">
                  <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="endline" label="តេស្តចុងក្រោយគ្រា (Endline)">
                  <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="is_locked" label="ជាប់សោ" valuePropName="checked">
              <Switch checkedChildren={<LockOutlined />} unCheckedChildren={<UnlockOutlined />} />
            </Form.Item>

            <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editingSchool ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតសាលារៀន'}
                </Button>
                <Button onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                }}>
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

export default function PilotSchoolsPage() {
  return <PilotSchoolsPageContent />;
}
