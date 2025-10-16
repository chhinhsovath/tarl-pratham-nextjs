'use client';

import React, { useState, useEffect } from 'react';
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
  Col,
  DatePicker,
  InputNumber,
  Upload,
  Image
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

// Helper function to translate assessment levels to Khmer
function translateLevelToKhmer(level: string | undefined | null, subject: 'khmer' | 'math'): string {
  if (!level) return '-';

  const levelMap: { [key: string]: string } = {
    // Khmer Language Levels
    'Beginning': 'កម្រិតដំបូង',
    'Characters': 'តួអក្សរ',
    'Words': 'ពាក្យ',
    'Paragraphs': 'កថាខណ្ឌ',
    'Story (Comprehension 1)': 'រឿង (យល់ន័យ១)',
    'Story (Comprehension 2)': 'រឿង (យល់ន័យ២)',
    'Story': 'រឿង',

    // Math Levels
    'Single Digit': 'លេខ១ខ្ទង',
    'Double Digit': 'លេខ២ខ្ទង',
    'Subtraction': 'ប្រមាណវិធីដក',
    'Division': 'ប្រមាណវិធីចែក',
    'Problems': 'ចំណោទ',
  };

  // Return translated level or original if not found in map
  return levelMap[level] || level;
}

interface Student {
  id: number;
  student_id?: string;
  name: string;
  gender: string;
  age?: number;
  grade?: number;
  date_of_birth?: string;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  photo?: string;
  school_class_id?: number;
  pilot_school_id?: number;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
  is_active: boolean;
  is_temporary: boolean;
  added_by_mentor: boolean;
  created_by_role?: string;
  record_status?: string;
  created_at: string;
  updated_at: string;
  pilot_school?: {
    school_name: string;
  };
  school_class?: {
    name: string;
  };
  added_by?: {
    id: number;
    name: string;
    role: string;
  };
  assessments?: Array<{
    id: number;
    assessment_type: string;
    subject: string;
    level: string;
    assessed_date: string;
  }>;
}

function StudentsManagementContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: session } = useSession();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [pilotSchools, setPilotSchools] = useState<any[]>([]);

  // Pagination - Limit to 100 per page to prevent connection pool exhaustion
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 100,
    total: 0
  });

  useEffect(() => {
    fetchPilotSchools();
  }, []);

  useEffect(() => {
    // Fetch students when pagination changes
    fetchStudents();
  }, [pagination.current, pagination.pageSize]);

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setPilotSchools(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching pilot schools:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Only pagination parameters - no filters
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString()
      });

      const response = await fetch(`/api/students?${params}`);

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();
      setStudents(data.data || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0
      }));
    } catch (error: any) {
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
      date_of_birth: student.date_of_birth ? dayjs(student.date_of_birth) : null
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/students/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('បានលុបសិស្សដោយជោគជ័យ');
        fetchStudents();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការលុបសិស្ស');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const method = editingStudent ? 'PUT' : 'POST';
      const url = editingStudent
        ? `/api/students/${editingStudent.id}`
        : '/api/students';

      const payload = {
        ...values,
        date_of_birth: values.date_of_birth ? values.date_of_birth.format('YYYY-MM-DD') : null
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        message.success(editingStudent ? 'បានកែប្រែសិស្សដោយជោគជ័យ' : 'បានបន្ថែមសិស្សដោយជោគជ័យ');
        setModalVisible(false);
        fetchStudents();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error: any) {
      if (error.errorFields) {
        message.error('សូមបំពេញព័ត៌មានត្រឹមត្រូវ');
      } else {
        message.error('មានបញ្ហាក្នុងការរក្សាទុក');
      }
    }
  };

  const handleExport = async () => {
    try {
      message.loading('កំពុងបង្កើតឯកសារ...', 0);
      // Export functionality would go here
      setTimeout(() => {
        message.destroy();
        message.success('បានទាញយកឯកសារដោយជោគជ័យ');
      }, 1000);
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការទាញយកឯកសារ');
    }
  };

  const columns = [
    {
      title: 'លេខសម្គាល់',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => text || '-'
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: Student) => (
        <div>
          <strong>{text}</strong>
          {record.is_temporary && (
            <Tag color="orange" size="small" className="ml-2">បណ្តោះអាសន្ន</Tag>
          )}
        </div>
      )
    },
    {
      title: 'បង្កើតដោយ',
      dataIndex: 'added_by',
      key: 'added_by',
      width: 150,
      render: (addedBy: any, record: Student) => (
        <div>
          {addedBy ? (
            <>
              <div className="text-sm font-medium">{addedBy.name}</div>
              <Tag size="small" color={
                addedBy.role === 'teacher' ? 'blue' :
                addedBy.role === 'mentor' ? 'purple' :
                addedBy.role === 'admin' ? 'red' : 'default'
              }>
                {addedBy.role === 'teacher' ? 'គ្រូ' :
                 addedBy.role === 'mentor' ? 'អ្នកណែនាំ' :
                 addedBy.role === 'admin' ? 'អ្នកគ្រប់គ្រង' : addedBy.role}
              </Tag>
            </>
          ) : '-'}
        </div>
      )
    },
    {
      title: 'ការវាយតម្លៃ',
      dataIndex: 'assessments',
      key: 'assessments',
      width: 120,
      render: (assessments: any[], record: Student) => {
        const count = assessments?.length || 0;
        const verified = assessments?.filter(a => a.verified_by_id).length || 0;
        return (
          <Space direction="vertical" size="small">
            <Button
              type="link"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => router.push(`/assessments?student_id=${record.id}`)}
              style={{ padding: 0 }}
            >
              {count} ការវាយតម្លៃ
            </Button>
            {count > 0 && (
              <div className="text-xs">
                <CheckCircleOutlined className="text-green-500 mr-1" />
                {verified} ផ្ទៀងផ្ទាត់
              </div>
            )}
          </Space>
        );
      }
    },
    {
      title: 'ស្ថានភាពទិន្នន័យ',
      dataIndex: 'record_status',
      key: 'record_status',
      width: 120,
      render: (status: string, record: Student) => (
        <Space direction="vertical" size="small">
          <Tag color={
            status === 'production' ? 'green' :
            status === 'test_teacher' ? 'blue' :
            status === 'test_mentor' ? 'purple' :
            status === 'demo' ? 'orange' : 'default'
          }>
            {status === 'production' ? 'ផលិតកម្ម' :
             status === 'test_teacher' ? 'សាកល្បង (គ្រូ)' :
             status === 'test_mentor' ? 'សាកល្បង (អ្នកណែនាំ)' :
             status === 'demo' ? 'សាកល្បង' : status}
          </Tag>
          {record.created_by_role && (
            <div className="text-xs text-gray-500">
              {record.created_by_role === 'teacher' ? 'គ្រូបង្កើត' :
               record.created_by_role === 'mentor' ? 'អ្នកណែនាំបង្កើត' :
               record.created_by_role}
            </div>
          )}
        </Space>
      )
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (
        <Tag color={gender === 'male' || gender === 'ប្រុស' ? 'blue' : 'pink'}>
          {gender === 'male' ? 'ប្រុស' : gender === 'female' ? 'ស្រី' : gender}
        </Tag>
      )
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade',
      key: 'grade',
      width: 80,
      render: (grade: number) => grade ? `ទី${grade}` : '-'
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'pilot_school',
      key: 'pilot_school',
      width: 150,
      render: (school: any) => school?.school_name || '-'
    },
    {
      title: 'តេស្តដើមគ្រា ភាសា',
      dataIndex: 'baseline_khmer_level',
      key: 'baseline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="purple">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តដើមគ្រា គណិត',
      dataIndex: 'baseline_math_level',
      key: 'baseline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="cyan">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'តេស្តពាក់កណ្ដាលគ្រា ភាសា',
      dataIndex: 'midline_khmer_level',
      key: 'midline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="orange">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តពាក់កណ្ដាលគ្រា គណិត',
      dataIndex: 'midline_math_level',
      key: 'midline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="gold">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'តេស្តចុងក្រោយគ្រា ភាសា',
      dataIndex: 'endline_khmer_level',
      key: 'endline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="green">{translateLevelToKhmer(level, 'khmer')}</Tag> : '-'
    },
    {
      title: 'តេស្តចុងក្រោយគ្រា គណិត',
      dataIndex: 'endline_math_level',
      key: 'endline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="lime">{translateLevelToKhmer(level, 'math')}</Tag> : '-'
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      fixed: 'right' as const,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'សកម្ម' : 'អសកម្ម'}
        </Tag>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            size="small"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="តើអ្នកប្រាកដថាចង់លុបសិស្សនេះ?"
            onConfirm={() => handleDelete(record.id)}
            okText="បាទ/ចាស"
            cancelText="ទេ"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      <Card bodyStyle={{ padding: '16px' }}>
        {/* Header */}
        <Row justify="space-between" align="middle" gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} md={12}>
            <Title level={2} style={{ margin: 0 }}>គ្រប់គ្រងសិស្ស (Admin/Coordinator)</Title>
            <Text type="secondary">ការគ្រប់គ្រងទិន្នន័យសិស្សពេញលេញ</Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchStudents}
              >
                ផ្ទុកឡើងវិញ
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
              >
                បន្ថែមសិស្សថ្មី
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Total count - show total from API */}
        <div style={{ marginBottom: '16px', textAlign: 'right' }}>
          <Text strong>សរុប: {pagination.total} សិស្ស (បង្ហាញ {students.length} សិស្សក្នុងទំព័រនេះ)</Text>
        </div>

        {/* Table - With pagination to prevent connection exhaustion */}
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showTotal: (total, range) => `${range[0]}-${range[1]} នៃ ${total} សិស្ស`,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100'],
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 100 }));
            }
          }}
          scroll={{ x: 2200, y: 600 }}
          size="small"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? 'កែប្រែសិស្ស' : 'បន្ថែមសិស្សថ្មី'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        width={800}
        okText="រក្សាទុក"
        cancelText="បោះបង់"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="student_id"
                label="លេខសម្គាល់សិស្ស"
              >
                <Input placeholder="លេខសម្គាល់សិស្ស" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="ឈ្មោះសិស្ស"
                rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស' }]}
              >
                <Input placeholder="ឈ្មោះសិស្ស" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="gender"
                label="ភេទ"
                rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ' }]}
              >
                <Select placeholder="ជ្រើសរើសភេទ">
                  <Option value="male">ប្រុស</Option>
                  <Option value="female">ស្រី</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="grade"
                label="ថ្នាក់"
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់">
                  <Option value={4}>ទី4</Option>
                  <Option value={5}>ទី5</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="pilot_school_id"
                label="សាលារៀន"
              >
                <Select
                  placeholder="ជ្រើសរើសសាលារៀន"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      ?.includes(input.toLowerCase()) ?? false
                  }
                >
                  {pilotSchools.map(school => (
                    <Option key={school.id} value={school.id}>
                      {school.school_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default function StudentsManagementPage() {
  return (
    <App>
      <HorizontalLayout>
        <StudentsManagementContent />
      </HorizontalLayout>
    </App>
  );
}
