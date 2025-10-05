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
import BulkClassAssignModal from '@/components/students/BulkClassAssignModal';
import { useSession } from 'next-auth/react';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  student_id?: string;
  name: string;
  gender: string;
  age?: number;
  grade?: number;
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
  assessments?: Array<{
    id: number;
    assessment_type: string;
    subject: string;
    level?: string;
    assessed_date?: string;
  }>;
}

function StudentsContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [bulkClassModalVisible, setBulkClassModalVisible] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students?limit=100');
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || errorData.error || 'Failed to fetch students');
      }
      const data = await response.json();
      console.log('✅ Students fetched:', data.data?.length || 0);
      setStudents(data.data || []);

      // Track activity: User viewed student list
      trackActivity('student_view');
    } catch (error: any) {
      console.error('Error fetching students:', error);
      message.error(error.message || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
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
      setSubmitting(true);

      const studentData = {
        student_id: values.student_id,
        name: values.name,
        gender: values.gender,
        grade: values.grade ? parseInt(values.grade) : undefined
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
        message.success('ធ្វើបច្ចុប្បន្នភាពសិស្សបានជោគជ័យ! 🎉');
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
            console.error('❌ API Error Response:', error);
          } catch (jsonError) {
            const text = await response.text();
            console.error('❌ Non-JSON Error Response:', text);
            throw new Error(`បញ្ហាម៉ាស៊ីនមេ (${response.status}): ${text.substring(0, 200)}`);
          }
          throw new Error(error.message || error.error || 'មានបញ្ហាក្នុងការបន្ថែមសិស្ស');
        }

        const result = await response.json();
        setStudents(prev => [result.data, ...prev]);
        message.success('បន្ថែមសិស្សបានជោគជ័យ! 🎉');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('❌ Error saving student:', error);
      message.error(error instanceof Error ? error.message : 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ សូមព្យាយាមម្តងទៀត');
    } finally {
      setSubmitting(false);
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
      width: 60,
      fixed: 'left',
      render: (_: any, record: Student) => (
        <input
          type="checkbox"
          checked={selectedStudentIds.includes(record.id)}
          onChange={(e) => handleSelectStudent(record.id, e.target.checked)}
          style={{ cursor: 'pointer', minWidth: '20px', minHeight: '20px' }}
        />
      ),
    },
    {
      title: 'លេខសម្គាល់សិស្ស',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 150,
      render: (student_id: string) => student_id || '-',
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      width: 200,
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
      width: 100,
      render: (gender: string) => {
        const genderMap = {
          'male': 'ប្រុស',
          'female': 'ស្រី',
          'other': 'ផ្សេងទៀត',
          'ប្រុស': 'ប្រុស',
          'ស្រី': 'ស្រី'
        };
        const label = genderMap[gender as keyof typeof genderMap] || gender || '-';
        return (
          <Tag color={gender === 'male' || gender === 'ប្រុស' ? 'blue' : gender === 'female' || gender === 'ស្រី' ? 'pink' : 'default'}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: (grade: number) => grade ? `ថ្នាក់ទី${grade}` : '-',
    },
    {
      title: 'ចំនួនការវាយតម្លៃ',
      key: 'assessment_count',
      width: 150,
      render: (_: any, record: Student) => {
        const assessments = record.assessments || [];
        const count = assessments.length;

        return (
          <Tag color={count > 0 ? 'blue' : 'default'}>
            {count} ដង
          </Tag>
        );
      },
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            title="មើលព័ត៌មានសិស្ស"
            size="small"
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
            size="small"
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
              size="small"
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
        <Card bodyStyle={{ padding: '16px' }}>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Title level={2} style={{ margin: 0, fontSize: '20px' }}>គ្រប់គ្រងសិស្ស</Title>
              <Text type="secondary" className="hidden md:block">គ្រប់គ្រង និងតាមដានព័ត៌មានសិស្សរបស់អ្នក</Text>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {selectedStudentIds.length > 0 && (
                  <>
                    <Button
                      type="default"
                      onClick={() => setBulkClassModalVisible(true)}
                      size="large"
                      className="flex-1 md:flex-none"
                    >
                      កំណត់ថ្នាក់ ({selectedStudentIds.length})
                    </Button>
                    <Button
                      type="default"
                      icon={<FileTextOutlined />}
                      onClick={handleBulkAssessment}
                      size="large"
                      className="flex-1 md:flex-none"
                    >
                      វាយតម្លៃ ({selectedStudentIds.length})
                    </Button>
                  </>
                )}
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                  className="flex-1 md:flex-none"
                >
                  បន្ថែមសិស្សថ្មី
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Search and Filters */}
        <Card bodyStyle={{ padding: '16px' }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={14}>
              <Input
                placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} md={5}>
              <Select placeholder="ភេទ" style={{ width: '100%' }} allowClear size="large">
                <Option value="male">ប្រុស</Option>
                <Option value="female">ស្រី</Option>
                <Option value="other">ផ្សេងទៀត</Option>
              </Select>
            </Col>
            <Col xs={12} md={5}>
              <Select placeholder="ស្ថានភាព" style={{ width: '100%' }} allowClear size="large">
                <Option value="true">សកម្ម</Option>
                <Option value="false">អសកម្ម</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Students List - Mobile-First Card Design */}
        <div className="students-list">
          {/* Desktop: Show Table */}
          <Card className="hidden md:block">
            <Table
              scroll={{ x: 1000 }}
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
              size="middle"
            />
          </Card>

          {/* Mobile: Show Cards */}
          <div className="md:hidden space-y-3">
            {loading ? (
              <Card>
                <div className="text-center py-8">
                  <Text>កំពុងផ្ទុក...</Text>
                </div>
              </Card>
            ) : filteredStudents.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <Text type="secondary">មិនមានសិស្ស</Text>
                </div>
              </Card>
            ) : (
              filteredStudents.slice(0, 50).map((student) => (
                <Card
                  key={student.id}
                  className="student-card"
                  style={{
                    borderLeft: selectedStudentIds.includes(student.id) ? '4px solid #1890ff' : '1px solid #f0f0f0',
                    backgroundColor: selectedStudentIds.includes(student.id) ? '#f0f7ff' : 'white'
                  }}
                  bodyStyle={{ padding: '16px' }}
                >
                  {/* Card Header - Checkbox + Name */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                        style={{
                          cursor: 'pointer',
                          minWidth: '20px',
                          minHeight: '20px',
                          marginTop: '2px'
                        }}
                      />
                      <div className="flex-1">
                        {/* លេខសម្គាល់សិស្ស */}
                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>
                          លេខសម្គាល់: {student.student_id || '-'}
                        </Text>

                        {/* ឈ្មោះសិស្ស */}
                        <div className="flex items-center gap-2 mb-2">
                          <UserOutlined
                            style={{
                              color: student.gender === 'male' || student.gender === 'ប្រុស' ? '#1890ff' : '#f759ab',
                              fontSize: '16px'
                            }}
                          />
                          <Text strong style={{ fontSize: '15px' }}>{student.name}</Text>
                        </div>

                        {/* ភេទ + ថ្នាក់ */}
                        <div className="flex items-center gap-2 mb-2">
                          <Text type="secondary" style={{ fontSize: '11px' }}>ភេទ:</Text>
                          <Tag size="small" color={student.gender === 'male' || student.gender === 'ប្រុស' ? 'blue' : student.gender === 'female' || student.gender === 'ស្រី' ? 'pink' : 'default'}>
                            {student.gender === 'male' ? 'ប្រុស' : student.gender === 'female' ? 'ស្រី' : student.gender || '-'}
                          </Tag>
                          {student.grade && (
                            <>
                              <Text type="secondary" style={{ fontSize: '11px' }}>ថ្នាក់:</Text>
                              <Tag size="small" color="blue">ទី{student.grade}</Tag>
                            </>
                          )}
                        </div>

                        {/* Baseline Assessment */}
                        <div className="mb-1">
                          <Text type="secondary" style={{ fontSize: '11px' }}>មូលដ្ឋាន: </Text>
                          {student.baseline_khmer_level && (
                            <Tag size="small" color="purple">ភាសា: {student.baseline_khmer_level}</Tag>
                          )}
                          {student.baseline_math_level && (
                            <Tag size="small" color="cyan">គណិត: {student.baseline_math_level}</Tag>
                          )}
                          {!student.baseline_khmer_level && !student.baseline_math_level && (
                            <Text style={{ fontSize: '11px' }}>-</Text>
                          )}
                        </div>

                        {/* Midline Assessment */}
                        {(student.midline_khmer_level || student.midline_math_level) && (
                          <div className="mb-1">
                            <Text type="secondary" style={{ fontSize: '11px' }}>កណ្តាល: </Text>
                            {student.midline_khmer_level && (
                              <Tag size="small" color="orange">ភាសា: {student.midline_khmer_level}</Tag>
                            )}
                            {student.midline_math_level && (
                              <Tag size="small" color="gold">គណិត: {student.midline_math_level}</Tag>
                            )}
                          </div>
                        )}

                        {/* Endline Assessment */}
                        {(student.endline_khmer_level || student.endline_math_level) && (
                          <div className="mb-1">
                            <Text type="secondary" style={{ fontSize: '11px' }}>បញ្ចប់: </Text>
                            {student.endline_khmer_level && (
                              <Tag size="small" color="green">ភាសា: {student.endline_khmer_level}</Tag>
                            )}
                            {student.endline_math_level && (
                              <Tag size="small" color="lime">គណិត: {student.endline_math_level}</Tag>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={() => router.push(`/assessments/create?student_id=${student.id}`)}
                    >
                      វាយតម្លៃ
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => router.push(`/students/${student.id}`)}
                    />
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(student)}
                    />
                    <Popconfirm
                      title="លុបសិស្ស"
                      description="តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?"
                      onConfirm={() => handleDelete(student.id)}
                      okText="យល់ព្រម"
                      cancelText="បោះបង់"
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                      />
                    </Popconfirm>
                  </div>
                </Card>
              ))
            )}

            {/* Mobile Pagination Info */}
            {filteredStudents.length > 50 && (
              <Card>
                <div className="text-center">
                  <Text type="secondary">
                    បង្ហាញ 50 ពី {filteredStudents.length} សិស្ស
                  </Text>
                </div>
              </Card>
            )}
          </div>
        </div>
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
            label="លេខសម្គាល់សិស្ស"
            name="student_id"
            rules={[{ required: true, message: 'សូមបញ្ចូលលេខសម្គាល់សិស្ស!' }]}
          >
            <Input placeholder="បញ្ចូលលេខសម្គាល់សិស្ស" size="large" />
          </Form.Item>

          <Form.Item
            label="ឈ្មោះសិស្ស"
            name="name"
            rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស!' }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះពេញ" size="large" />
          </Form.Item>

          <Form.Item
            label="ភេទ"
            name="gender"
            rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ!' }]}
          >
            <Select placeholder="ជ្រើសរើសភេទ" size="large">
              <Option value="male">ប្រុស</Option>
              <Option value="female">ស្រី</Option>
              <Option value="other">ផ្សេងទៀត</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ថ្នាក់"
            name="grade"
            rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់!' }]}
          >
            <Select placeholder="ជ្រើសរើសថ្នាក់" size="large">
              <Option value={4}>ថ្នាក់ទី៤</Option>
              <Option value={5}>ថ្នាក់ទី៥</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} disabled={submitting}>
                បោះបង់
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingStudent ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បន្ថែម'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Class Assignment Modal */}
      <BulkClassAssignModal
        visible={bulkClassModalVisible}
        studentIds={selectedStudentIds}
        pilotSchoolId={session?.user?.pilot_school_id || 33}
        onSuccess={() => {
          setBulkClassModalVisible(false);
          setSelectedStudentIds([]);
          fetchStudents();
        }}
        onCancel={() => setBulkClassModalVisible(false)}
      />
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