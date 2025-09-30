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
  DatePicker,
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
  SearchOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  student_name: string;
  gender: 'male' | 'female';
  birth_date: string;
  grade_level: 'grade_4' | 'grade_5';
  student_status: 'active' | 'inactive' | 'transferred';
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Mock data for now - replace with actual API call
      const mockData: Student[] = [
        {
          id: 1,
          student_name: 'គុណ សុវណ្ណ',
          gender: 'male',
          birth_date: '2014-05-15',
          grade_level: 'grade_4',
          student_status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          student_name: 'ញឹម បញ្ញា',
          gender: 'female',
          birth_date: '2013-08-22',
          grade_level: 'grade_5',
          student_status: 'active',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ];
      setStudents(mockData);
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
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
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      birth_date: dayjs(student.birth_date)
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      // Mock delete - replace with actual API call
      setStudents(prev => prev.filter(s => s.id !== id));
      message.success('លុបសិស្សបានជោគជ័យ');
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការលុបសិស្ស');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const studentData = {
        ...values,
        birth_date: values.birth_date.format('YYYY-MM-DD')
      };

      if (editingStudent) {
        // Mock update - replace with actual API call
        const updated = { ...editingStudent, ...studentData, updated_at: new Date().toISOString() };
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? updated : s));
        message.success('ធ្វើបច្ចុប្បន្នភាពសិស្សបានជោគជ័យ');
      } else {
        // Mock create - replace with actual API call
        const newStudent: Student = {
          id: Date.now(),
          ...studentData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setStudents(prev => [newStudent, ...prev]);
        message.success('បន្ថែមសិស្សបានជោគជ័យ');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
    }
  };

  const filteredStudents = students.filter(student =>
    student.student_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'student_name',
      key: 'student_name',
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
          {gender === 'male' ? 'ប្រុស' : 'ស្រី'}
        </Tag>
      ),
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade_level',
      key: 'grade_level',
      render: (grade: string) => (
        <Tag color="green">
          {grade === 'grade_4' ? 'ថ្នាក់ទី៤' : 'ថ្នាក់ទី៥'}
        </Tag>
      ),
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'student_status',
      key: 'student_status',
      render: (status: string) => {
        const colors = {
          active: 'green',
          inactive: 'orange',
          transferred: 'red'
        };
        const labels = {
          active: 'សកម្ម',
          inactive: 'អសកម្ម',
          transferred: 'ផ្ទេរ'
        };
        return <Tag color={colors[status as keyof typeof colors]}>{labels[status as keyof typeof labels]}</Tag>;
      },
    },
    {
      title: 'កាលបរិច្ឆេទកំណើត',
      dataIndex: 'birth_date',
      key: 'birth_date',
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
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
              >
                បន្ថែមសិស្សថ្មី
              </Button>
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
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select placeholder="ថ្នាក់" style={{ width: '100%' }} allowClear>
                <Option value="grade_4">ថ្នាក់ទី៤</Option>
                <Option value="grade_5">ថ្នាក់ទី៥</Option>
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
            name="student_name"
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
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="ថ្នាក់រៀន"
                name="grade_level"
                rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់!' }]}
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់">
                  <Option value="grade_4">ថ្នាក់ទី៤</Option>
                  <Option value="grade_5">ថ្នាក់ទី៥</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="កាលបរិច្ឆេទកំណើត"
                name="birth_date"
                rules={[{ required: true, message: 'សូមជ្រើសរើសកាលបរិច្ឆេទកំណើត!' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="ជ្រើសរើសកាលបរិច្ឆេទ"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="ស្ថានភាព"
                name="student_status"
                rules={[{ required: true, message: 'សូមជ្រើសរើសស្ថានភាព!' }]}
              >
                <Select placeholder="ជ្រើសរើសស្ថានភាព">
                  <Option value="active">សកម្ម</Option>
                  <Option value="inactive">អសកម្ម</Option>
                  <Option value="transferred">ផ្ទេរ</Option>
                </Select>
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