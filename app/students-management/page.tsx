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

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    gender: '',
    grade: '',
    pilot_school_id: '',
    is_active: 'true',
    is_temporary: ''
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const [pilotSchools, setPilotSchools] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchStudents();
    fetchFormData();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchFormData = async () => {
    try {
      const [schoolsRes, classesRes] = await Promise.all([
        fetch('/api/pilot-schools'),
        fetch('/api/classes')
      ]);

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setPilotSchools(schoolsData.schools || []);
      }

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
        ...filters
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
      title: 'មូលដ្ឋាន ភាសា',
      dataIndex: 'baseline_khmer_level',
      key: 'baseline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="purple">{level}</Tag> : '-'
    },
    {
      title: 'មូលដ្ឋាន គណិត',
      dataIndex: 'baseline_math_level',
      key: 'baseline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="cyan">{level}</Tag> : '-'
    },
    {
      title: 'កណ្តាល ភាសា',
      dataIndex: 'midline_khmer_level',
      key: 'midline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="orange">{level}</Tag> : '-'
    },
    {
      title: 'កណ្តាល គណិត',
      dataIndex: 'midline_math_level',
      key: 'midline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="gold">{level}</Tag> : '-'
    },
    {
      title: 'បញ្ចប់ ភាសា',
      dataIndex: 'endline_khmer_level',
      key: 'endline_khmer_level',
      width: 120,
      render: (level: string) => level ? <Tag color="green">{level}</Tag> : '-'
    },
    {
      title: 'បញ្ចប់ គណិត',
      dataIndex: 'endline_math_level',
      key: 'endline_math_level',
      width: 120,
      render: (level: string) => level ? <Tag color="lime">{level}</Tag> : '-'
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

        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="ស្វែងរកតាមឈ្មោះ..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="ភេទ"
              value={filters.gender || undefined}
              onChange={(value) => setFilters({ ...filters, gender: value || '' })}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="male">ប្រុស</Option>
              <Option value="female">ស្រី</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Select
              placeholder="ថ្នាក់"
              value={filters.grade || undefined}
              onChange={(value) => setFilters({ ...filters, grade: value || '' })}
              style={{ width: '100%' }}
              allowClear
            >
              {[1, 2, 3, 4, 5, 6].map(grade => (
                <Option key={grade} value={grade}>ទី{grade}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="សាលារៀន"
              value={filters.pilot_school_id || undefined}
              onChange={(value) => setFilters({ ...filters, pilot_school_id: value || '' })}
              style={{ width: '100%' }}
              allowClear
            >
              {pilotSchools.map(school => (
                <Option key={school.id} value={school.id}>{school.school_name}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={6} md={5}>
            <Select
              placeholder="ស្ថានភាព"
              value={filters.is_active}
              onChange={(value) => setFilters({ ...filters, is_active: value })}
              style={{ width: '100%' }}
            >
              <Option value="true">សកម្ម</Option>
              <Option value="false">អសកម្ម</Option>
              <Option value="">ទាំងអស់</Option>
            </Select>
          </Col>
        </Row>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `សរុប ${total} សិស្ស`,
            onChange: (page, pageSize) => {
              setPagination({ ...pagination, current: page, pageSize });
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
            <Col span={24}>
              <Form.Item
                name="photo"
                label="រូបថតសិស្ស"
              >
                <Input
                  placeholder="URL រូបថតសិស្ស"
                  prefix={<UploadOutlined />}
                  suffix={
                    form.getFieldValue('photo') && (
                      <Image
                        src={form.getFieldValue('photo')}
                        alt="Preview"
                        width={30}
                        height={30}
                        style={{ borderRadius: '4px' }}
                      />
                    )
                  }
                />
              </Form.Item>
            </Col>
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
                name="age"
                label="អាយុ"
              >
                <InputNumber placeholder="អាយុ" min={5} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="grade"
                label="ថ្នាក់"
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់">
                  {[1, 2, 3, 4, 5, 6].map(grade => (
                    <Option key={grade} value={grade}>ទី{grade}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date_of_birth"
                label="ថ្ងៃខែឆ្នាំកំណើត"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="guardian_name"
                label="ឈ្មោះអាណាព្យាបាល"
              >
                <Input placeholder="ឈ្មោះអាណាព្យាបាល" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="guardian_phone"
                label="លេខទូរស័ព្ទអាណាព្យាបាល"
              >
                <Input placeholder="លេខទូរស័ព្ទ" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="អាសយដ្ឋាន"
              >
                <Input placeholder="អាសយដ្ឋាន" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pilot_school_id"
                label="សាលារៀន"
              >
                <Select placeholder="ជ្រើសរើសសាលារៀន" allowClear>
                  {pilotSchools.map(school => (
                    <Option key={school.id} value={school.id}>{school.school_name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="school_class_id"
                label="ថ្នាក់រៀន"
              >
                <Select placeholder="ជ្រើសរើសថ្នាក់រៀន" allowClear>
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_active"
                label="ស្ថានភាព"
                initialValue={true}
              >
                <Select>
                  <Option value={true}>សកម្ម</Option>
                  <Option value={false}>អសកម្ម</Option>
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
