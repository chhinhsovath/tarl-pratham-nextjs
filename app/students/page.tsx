'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Card,
  Popconfirm,
  Tag,
  App,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';
import { trackActivity } from '@/lib/trackActivity';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  name: string;
  gender: string;
  age?: number;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  school_class_id?: number;
  pilot_school_id?: number;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function StudentsContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const data = await response.json();
      setStudents(data.data || []);

      // Track activity: User viewed student list
      trackActivity('student_view');
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    router.push(`/students/${student.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        message.success('លុបសិស្សបានជោគជ័យ');
      } else {
        const error = await response.json();
        message.error(error.error || 'មានបញ្ហាក្នុងការលុបសិស្ស');
      }
    } catch (error) {
      console.error('Delete student error:', error);
      message.error('មានបញ្ហាក្នុងការលុបសិស្ស');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const studentData = {
        name: values.name,
        gender: values.gender,
        age: parseInt(values.age)
      };

      if (editingStudent) {
        // Update existing student via API
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStudent.id, ...studentData })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពសិស្ស');
        }

        const result = await response.json();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? result.data : s));
        message.success('ធ្វើបច្ចុប្បន្នភាពសិស្សបានជោគជ័យ');
      } else {
        // Create new student via API
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });

        if (!response.ok) {
          let error;
          try {
            error = await response.json();
            console.error('API Error Response:', error);
          } catch (jsonError) {
            const text = await response.text();
            console.error('Non-JSON Error Response:', text);
            throw new Error(`Server error (${response.status}): ${text.substring(0, 200)}`);
          }
          throw new Error(error.message || error.error || 'មានបញ្ហាក្នុងការបន្ថែមសិស្ស');
        }

        const result = await response.json();
        setStudents(prev => [result.data, ...prev]);
        message.success('បន្ថែមសិស្សបានជោគជ័យ');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving student:', error);
      message.error(error instanceof Error ? error.message : 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(filteredStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  // Handle individual selection
  const handleSelectStudent = (studentId: number, checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(prev => [...prev, studentId]);
    } else {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    }
  };

  // Navigate to bulk assessment
  const handleBulkAssessment = () => {
    if (selectedStudentIds.length === 0) {
      message.warning('សូមជ្រើសរើសសិស្សយ៉ាងតិច ១នាក់');
      return;
    }
    const studentIdsParam = selectedStudentIds.join(',');
    router.push(`/assessments/create-bulk?student_ids=${studentIdsParam}`);
  };

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={selectedStudentIds.length === filteredStudents.length && filteredStudents.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      ),
      key: 'select',
      width: 50,
      render: (_: any, record: Student) => (
        <input
          type="checkbox"
          checked={selectedStudentIds.includes(record.id)}
          onChange={(e) => handleSelectStudent(record.id, e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
      ),
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Student) => (
        <Space>
          <UserOutlined style={{ color: record.gender === 'male' ? '#1890ff' : '#f759ab' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <Tag color={gender === 'male' ? 'blue' : 'pink'}>
          {gender === 'male' ? 'ប្រុស' : gender === 'female' ? 'ស្រី' : gender}
        </Tag>
      ),
    },
    {
      title: 'អាយុ',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => age || '-',
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'សកម្ម' : 'អសកម្ម'}
        </Tag>
      ),
    },
    {
      title: 'កាលបរិច្ឆេទបង្កើត',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            title="មើលព័ត៌មានសិស្ស"
          />
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/assessments/create?student_id=${record.id}`)}
            title="បង្កើតការវាយតម្លៃ"
          >
            វាយតម្លៃ
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="កែសម្រួលសិស្ស"
          />
          <Popconfirm
            title="លុបសិស្ស"
            description="តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?"
            onConfirm={() => handleDelete(record.id)}
            okText="យល់ព្រម"
            cancelText="បោះបង់"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="លុបសិស្ស"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Card>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={2} style={{ margin: 0 }}>គ្រប់គ្រងសិស្ស</Title>
              <Text type="secondary">គ្រប់គ្រង និងតាមដានព័ត៌មានសិស្សរបស់អ្នក</Text>
            </Col>
            <Col>
              <Space size="middle">
                {selectedStudentIds.length > 0 && (
                  <Button
                    type="default"
                    icon={<FileTextOutlined />}
                    onClick={handleBulkAssessment}
                    size="large"
                  >
                    វាយតម្លៃសិស្សដែលបានជ្រើសរើស ({selectedStudentIds.length})
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                >
                  បន្ថែមសិស្សថ្មី
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Search and Filters */}
        <Card>
          <Row gutter={16} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select placeholder="ភេទ" style={{ width: '100%' }} allowClear>
                <Option value="male">ប្រុស</Option>
                <Option value="female">ស្រី</Option>
                <Option value="other">ផ្សេងទៀត</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select placeholder="ស្ថានភាព" style={{ width: '100%' }} allowClear>
                <Option value="true">សកម្ម</Option>
                <Option value="false">អសកម្ម</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <Card>
          <Table scroll={{ x: "max-content" }}
            columns={columns}
            dataSource={filteredStudents}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredStudents.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} ពី ${total} សិស្ស`,
            }}
          />
        </Card>
      </Space>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? 'កែប្រែសិស្ស' : 'បន្ថែមសិស្សថ្មី'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="ឈ្មោះសិស្ស"
            name="name"
            rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស!' }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះពេញ" />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="ភេទ"
                name="gender"
                rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ!' }]}
              >
                <Select placeholder="ជ្រើសរើសភេទ">
                  <Option value="male">ប្រុស</Option>
                  <Option value="female">ស្រី</Option>
                  <Option value="other">ផ្សេងទៀត</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="អាយុ"
                name="age"
                rules={[
                  { required: true, message: 'សូមបញ្ចូលអាយុ!' },
                  {
                    validator: (_, value) => {
                      const num = parseInt(value);
                      if (isNaN(num) || num < 1 || num > 25) {
                        return Promise.reject('អាយុត្រូវតែនៅចន្លោះ 1-25');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" placeholder="បញ្ចូលអាយុ" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                បោះបង់
              </Button>
              <Button type="primary" htmlType="submit">
                {editingStudent ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បន្ថែម'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default function StudentsPage() {
  return (
    <App>
      <HorizontalLayout>
        <StudentsContent />
      </HorizontalLayout>
    </App>
  );
}