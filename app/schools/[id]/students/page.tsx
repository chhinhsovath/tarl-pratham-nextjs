'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Row,
  Col,
  Statistic,
  Alert,
  Upload,
  Progress,
  Divider,
  Typography,
  Avatar,
  Dropdown,
  Menu,
  Badge,
  Tabs
} from 'antd';
import {
  TeamOutlined,
  UserAddOutlined,
  UploadOutlined,
  DownloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileExcelOutlined,
  ManOutlined,
  WomanOutlined,
  MoreOutlined,
  FilterOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import * as XLSX from 'xlsx';
import BulkAssessmentForm from '@/components/assessments/BulkAssessmentForm';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Student {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
  is_active: boolean;
  created_at: string;
}

interface School {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  total_students?: number;
}

function SchoolStudentsPageContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const schoolId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<School | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bulkAddModalVisible, setBulkAddModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [filters, setFilters] = useState({
    gender: '',
    level: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    assessed_baseline: 0,
    assessed_midline: 0,
    assessed_endline: 0
  });

  useEffect(() => {
    fetchSchoolData();
    fetchStudents();
  }, [schoolId, filters]);

  const fetchSchoolData = async () => {
    try {
      const response = await fetch(`/api/schools/${schoolId}`);
      if (response.ok) {
        const data = await response.json();
        setSchool(data);
      }
    } catch (error) {
      console.error('Error fetching school:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ).toString();
      
      const response = await fetch(`/api/schools/${schoolId}/students?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (values: any) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          pilot_school_id: parseInt(schoolId),
          added_by_id: session?.user?.id
        })
      });

      if (response.ok) {
        message.success('Student added successfully');
        setAddModalVisible(false);
        form.resetFields();
        fetchStudents();
      } else {
        throw new Error('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
      message.error('Failed to add student');
    }
  };

  const handleEditStudent = async (values: any) => {
    if (!selectedStudent) return;
    
    try {
      const response = await fetch(`/api/students/${selectedStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('Student updated successfully');
        setEditModalVisible(false);
        setSelectedStudent(null);
        form.resetFields();
        fetchStudents();
      } else {
        throw new Error('Failed to update student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
      message.error('Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId: number) => {
    Modal.confirm({
      title: 'Delete Student',
      content: 'Are you sure you want to delete this student? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const response = await fetch(`/api/students/${studentId}`, {
            method: 'DELETE'
          });

          if (response.ok) {
            message.success('Student deleted successfully');
            fetchStudents();
          } else {
            throw new Error('Failed to delete student');
          }
        } catch (error) {
          console.error('Error deleting student:', error);
          message.error('Failed to delete student');
        }
      }
    });
  };

  const handleBulkAdd = async (values: any) => {
    const studentsData = values.students.split('\\n')
      .filter((line: string) => line.trim())
      .map((line: string) => {
        const parts = line.split(',').map(p => p.trim());
        return {
          name: parts[0],
          age: parts[1] ? parseInt(parts[1]) : undefined,
          gender: parts[2],
          guardian_name: parts[3],
          guardian_phone: parts[4]
        };
      });

    try {
      const response = await fetch('/api/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: studentsData,
          pilot_school_id: parseInt(schoolId),
          added_by_id: session?.user?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        message.success(`Added ${result.created} students successfully`);
        setBulkAddModalVisible(false);
        bulkForm.resetFields();
        fetchStudents();
      } else {
        throw new Error('Failed to add students');
      }
    } catch (error) {
      console.error('Error bulk adding students:', error);
      message.error('Failed to add students');
    }
  };

  const handleExportStudents = () => {
    const exportData = students.map(s => ({
      'Student ID': s.id,
      'Name': s.name,
      'Age': s.age || '',
      'Gender': s.gender || '',
      'Guardian Name': s.guardian_name || '',
      'Guardian Phone': s.guardian_phone || '',
      'Address': s.address || '',
      'មូលដ្ឋានខ្មែរ': s.baseline_khmer_level || '',
      'មូលដ្ឋានគណិត': s.baseline_math_level || '',
      'កុលសនភាពខ្មែរ': s.midline_khmer_level || '',
      'កុលសនភាពគណិត': s.midline_math_level || '',
      'បញ្ចប់ខ្មែរ': s.endline_khmer_level || '',
      'បញ្ចប់គណិត': s.endline_math_level || '',
      'Status': s.is_active ? 'Active' : 'Inactive',
      'Created Date': new Date(s.created_at).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `students_${school?.school_code}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    message.success('Student list exported successfully');
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      render: (_: any, record: Student) => (
        <Space>
          <Avatar style={{ backgroundColor: record.gender === 'male' ? '#1890ff' : '#eb2f96' }}>
            {record.gender === 'male' ? <ManOutlined /> : <WomanOutlined />}
          </Avatar>
          <div>
            <div><strong>{record.name}</strong></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.id} | Age: {record.age || 'N/A'}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Guardian',
      key: 'guardian',
      render: (_: any, record: Student) => (
        <div>
          {record.guardian_name ? (
            <>
              <div>{record.guardian_name}</div>
              {record.guardian_phone && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  📱 {record.guardian_phone}
                </Text>
              )}
            </>
          ) : (
            <Text type="secondary">Not provided</Text>
          )}
        </div>
      )
    },
    {
      title: 'Assessment Progress',
      key: 'progress',
      render: (_: any, record: Student) => {
        const baselineComplete = !!(record.baseline_khmer_level || record.baseline_math_level);
        const midlineComplete = !!(record.midline_khmer_level || record.midline_math_level);
        const endlineComplete = !!(record.endline_khmer_level || record.endline_math_level);
        
        return (
          <Space size="small">
            <Tag color={baselineComplete ? 'blue' : 'default'}>
              មូលដ្ឋាន
            </Tag>
            <Tag color={midlineComplete ? 'orange' : 'default'}>
              កុលសនភាព
            </Tag>
            <Tag color={endlineComplete ? 'green' : 'default'}>
              បញ្ចប់
            </Tag>
          </Space>
        );
      }
    },
    {
      title: 'Current Levels',
      key: 'levels',
      render: (_: any, record: Student) => {
        const getLatestLevel = (type: 'khmer' | 'math') => {
          if (type === 'khmer') {
            return record.endline_khmer_level || 
                   record.midline_khmer_level || 
                   record.baseline_khmer_level;
          } else {
            return record.endline_math_level || 
                   record.midline_math_level || 
                   record.baseline_math_level;
          }
        };
        
        const khmerLevel = getLatestLevel('khmer');
        const mathLevel = getLatestLevel('math');
        
        return (
          <Space size="small">
            {khmerLevel && <Tag color="purple">K: {khmerLevel}</Tag>}
            {mathLevel && <Tag color="cyan">M: {mathLevel}</Tag>}
            {!khmerLevel && !mathLevel && <Text type="secondary">Not assessed</Text>}
          </Space>
        );
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Student) => (
        <Badge
          status={record.is_active ? 'success' : 'default'}
          text={record.is_active ? 'Active' : 'Inactive'}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => {
        const menuItems = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => router.push(`/students/${record.id}`)
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: 'Edit Student',
            onClick: () => {
              setSelectedStudent(record);
              form.setFieldsValue(record);
              setEditModalVisible(true);
            }
          },
          {
            key: 'assess',
            icon: <FileExcelOutlined />,
            label: 'Add Assessment',
            onClick: () => router.push(`/students/${record.id}/assess`)
          },
          {
            type: 'divider'
          },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Delete Student',
            danger: true,
            onClick: () => handleDeleteStudent(record.id)
          }
        ];
        
        return (
          <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      }
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedStudents,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedStudents(selectedRowKeys as number[]);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* School Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              Student Management
            </Title>
            {school && (
              <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                {school.school_name} ({school.school_code})
                <Divider type="vertical" />
                {school.district}, {school.province}
              </Paragraph>
            )}
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                onClick={() => setAddModalVisible(true)}
              >
                Add Student
              </Button>
              
              <Button
                icon={<TeamOutlined />}
                onClick={() => setBulkAddModalVisible(true)}
              >
                Bulk Add
              </Button>
              
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExportStudents}
                disabled={students.length === 0}
              >
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="Male"
              value={stats.male}
              valueStyle={{ color: '#1890ff' }}
              suffix={`/ ${stats.total}`}
            />
            <Progress
              percent={stats.total ? Math.round((stats.male / stats.total) * 100) : 0}
              size="small"
              showInfo={false}
            />
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="Female"
              value={stats.female}
              valueStyle={{ color: '#eb2f96' }}
              suffix={`/ ${stats.total}`}
            />
            <Progress
              percent={stats.total ? Math.round((stats.female / stats.total) * 100) : 0}
              size="small"
              showInfo={false}
              strokeColor="#eb2f96"
            />
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="មូលដ្ឋាន"
              value={stats.assessed_baseline}
              suffix={`/ ${stats.total}`}
            />
            <Progress
              percent={stats.total ? Math.round((stats.assessed_baseline / stats.total) * 100) : 0}
              size="small"
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="កុលសនភាព"
              value={stats.assessed_midline}
              suffix={`/ ${stats.total}`}
            />
            <Progress
              percent={stats.total ? Math.round((stats.assessed_midline / stats.total) * 100) : 0}
              size="small"
              strokeColor="#fa8c16"
            />
          </Card>
        </Col>
        <Col xs={12} lg={4}>
          <Card>
            <Statistic
              title="បញ្ចប់"
              value={stats.assessed_endline}
              suffix={`/ ${stats.total}`}
            />
            <Progress
              percent={stats.total ? Math.round((stats.assessed_endline / stats.total) * 100) : 0}
              size="small"
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Student List" key="list">
            {/* Filters */}
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search by name..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                style={{ width: 200 }}
              />
              
              <Select
                placeholder="Gender"
                value={filters.gender}
                onChange={(value) => setFilters({ ...filters, gender: value })}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
              </Select>
              
              <Button
                onClick={() => setFilters({ gender: '', level: '', search: '' })}
              >
                Clear Filters
              </Button>
            </Space>

            {selectedStudents.length > 0 && (
              <Alert
                message={`${selectedStudents.length} students selected`}
                type="info"
                showIcon
                closable
                onClose={() => setSelectedStudents([])}
                style={{ marginBottom: 16 }}
              />
            )}

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={students}
              rowKey="id"
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} students`,
              }}
            />
          </TabPane>
          
          <TabPane tab="Bulk Assessment" key="assessment">
            <BulkAssessmentForm />
          </TabPane>
        </Tabs>
      </Card>

      {/* Add Student Modal */}
      <Modal
        title="Add New Student"
        open={addModalVisible}
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStudent}
        >
          <Form.Item
            name="name"
            label="Student Name"
            rules={[{ required: true, message: 'Please enter student name' }]}
          >
            <Input placeholder="Enter student full name" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="age" label="Age">
                <InputNumber min={3} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="guardian_name" label="Guardian Name">
            <Input placeholder="Enter guardian name" />
          </Form.Item>
          
          <Form.Item name="guardian_phone" label="Guardian Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Student
              </Button>
              <Button onClick={() => {
                setAddModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        title="Edit Student"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedStudent(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditStudent}
        >
          <Form.Item
            name="name"
            label="Student Name"
            rules={[{ required: true, message: 'Please enter student name' }]}
          >
            <Input placeholder="Enter student full name" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="age" label="Age">
                <InputNumber min={3} max={20} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item name="guardian_name" label="Guardian Name">
            <Input placeholder="Enter guardian name" />
          </Form.Item>
          
          <Form.Item name="guardian_phone" label="Guardian Phone">
            <Input placeholder="Enter phone number" />
          </Form.Item>
          
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} placeholder="Enter address" />
          </Form.Item>
          
          <Form.Item name="is_active" label="Status">
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Student
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedStudent(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Add Modal */}
      <Modal
        title="Bulk Add Students"
        open={bulkAddModalVisible}
        onCancel={() => {
          setBulkAddModalVisible(false);
          bulkForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Alert
          message="Format Instructions"
          description="Enter one student per line in the format: Name, Age, Gender, Guardian Name, Guardian Phone"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={bulkForm}
          layout="vertical"
          onFinish={handleBulkAdd}
        >
          <Form.Item
            name="students"
            label="Student Data"
            rules={[{ required: true, message: 'Please enter student data' }]}
          >
            <Input.TextArea
              rows={10}
              placeholder={`Example:
John Doe, 10, male, Jane Doe, 0123456789
Mary Smith, 9, female, Bob Smith, 0987654321`}
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Students
              </Button>
              <Button onClick={() => {
                setBulkAddModalVisible(false);
                bulkForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default function SchoolStudentsPage() {
  return (
    <HorizontalLayout>
      <SchoolStudentsPageContent />
    </HorizontalLayout>
  );
}
