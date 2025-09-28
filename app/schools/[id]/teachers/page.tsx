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
  Select,
  message,
  Avatar,
  Row,
  Col,
  Statistic,
  Alert,
  Transfer,
  Divider,
  Typography,
  Tooltip,
  Badge,
  Empty,
  Popconfirm
} from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  BookOutlined,
  TeamOutlined,
  MailOutlined,
  PhoneOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Teacher {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  holding_classes?: string;
  role: string;
  is_active: boolean;
}

interface School {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  total_teachers?: number;
  total_students?: number;
}

function SchoolTeachersPageContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const schoolId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState<School | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<number[]>([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total_teachers: 0,
    active_teachers: 0,
    khmer_teachers: 0,
    math_teachers: 0,
    both_subjects: 0
  });

  useEffect(() => {
    fetchSchoolData();
    fetchTeachers();
    fetchStats();
  }, [schoolId]);

  const fetchSchoolData = async () => {
    try {
      const response = await fetch(`/api/schools/${schoolId}`);
      if (response.ok) {
        const data = await response.json();
        setSchool(data);
      }
    } catch (error) {
      console.error('Error fetching school:', error);
      message.error('Failed to load school data');
    }
  };

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers`);
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
        setTargetKeys(data.teachers.map((t: Teacher) => t.id.toString()));
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      message.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTeachers = async () => {
    try {
      const response = await fetch('/api/users?role=teacher&unassigned=true');
      if (response.ok) {
        const data = await response.json();
        setAvailableTeachers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching available teachers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAssignTeacher = async (teacherIds: number[]) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacher_ids: teacherIds,
          assigned_by: session?.user?.id
        })
      });

      if (response.ok) {
        message.success(`Assigned ${teacherIds.length} teacher(s) successfully`);
        setAssignModalVisible(false);
        setSelectedTeachers([]);
        fetchTeachers();
        fetchStats();
      } else {
        throw new Error('Failed to assign teachers');
      }
    } catch (error) {
      console.error('Error assigning teachers:', error);
      message.error('Failed to assign teachers');
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers/${teacherId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('Teacher removed from school');
        fetchTeachers();
        fetchStats();
      } else {
        throw new Error('Failed to remove teacher');
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      message.error('Failed to remove teacher');
    }
  };

  const handleTransferChange = (newTargetKeys: string[]) => {
    setTargetKeys(newTargetKeys);
  };

  const handleTransferSubmit = async () => {
    const addedTeachers = targetKeys.filter(key => !teachers.find(t => t.id.toString() === key));
    const removedTeachers = teachers
      .filter(t => !targetKeys.includes(t.id.toString()))
      .map(t => t.id);

    try {
      if (addedTeachers.length > 0) {
        await handleAssignTeacher(addedTeachers.map(id => parseInt(id)));
      }
      
      for (const teacherId of removedTeachers) {
        await handleRemoveTeacher(teacherId);
      }
      
      setTransferModalVisible(false);
      message.success('Teacher assignments updated successfully');
    } catch (error) {
      console.error('Error updating assignments:', error);
      message.error('Failed to update teacher assignments');
    }
  };

  const columns = [
    {
      title: 'Teacher',
      key: 'teacher',
      render: (_: any, record: Teacher) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div><strong>{record.name}</strong></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.role.charAt(0).toUpperCase() + record.role.slice(1)}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: any, record: Teacher) => (
        <div>
          <div>
            <MailOutlined style={{ marginRight: 4 }} />
            <Text copyable style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
          {record.phone && (
            <div>
              <PhoneOutlined style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 12 }}>{record.phone}</Text>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject?: string) => {
        if (!subject) return <Tag>Not Assigned</Tag>;
        
        const colors: any = {
          khmer: 'purple',
          math: 'cyan',
          both: 'green'
        };
        
        const icons: any = {
          khmer: '📖',
          math: '🔢',
          both: '📚'
        };
        
        return (
          <Tag color={colors[subject]} icon={<span>{icons[subject]}</span>}>
            {subject === 'both' ? 'Khmer & Math' : subject.charAt(0).toUpperCase() + subject.slice(1)}
          </Tag>
        );
      }
    },
    {
      title: 'Classes',
      dataIndex: 'holding_classes',
      key: 'classes',
      render: (classes?: string) => (
        <Text>{classes || 'Not specified'}</Text>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: Teacher) => (
        <Badge
          status={record.is_active ? 'success' : 'default'}
          text={record.is_active ? 'Active' : 'Inactive'}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Teacher) => (
        <Space size="small">
          <Tooltip title="View Profile">
            <Button
              type="link"
              icon={<UserOutlined />}
              onClick={() => router.push(`/users/${record.id}`)}
            />
          </Tooltip>
          
          <Popconfirm
            title="Remove teacher from school?"
            description="This will unassign the teacher from this school."
            onConfirm={() => handleRemoveTeacher(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Remove from School">
              <Button
                type="link"
                danger
                icon={<UserDeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const transferDataSource = [...teachers, ...availableTeachers].map(teacher => ({
    key: teacher.id.toString(),
    title: teacher.name,
    description: `${teacher.email} | ${teacher.subject || 'No subject'}`,
    chosen: teachers.some(t => t.id === teacher.id)
  }));

  return (
    <div style={{ padding: '24px' }}>
      {/* School Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              Teacher Management
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
                onClick={() => {
                  fetchAvailableTeachers();
                  setAssignModalVisible(true);
                }}
              >
                Assign Teacher
              </Button>
              
              <Button
                icon={<SwapOutlined />}
                onClick={() => {
                  fetchAvailableTeachers();
                  setTransferModalVisible(true);
                }}
              >
                Bulk Manage
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Teachers"
              value={stats.total_teachers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Teachers"
              value={stats.active_teachers}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khmer Teachers"
              value={stats.khmer_teachers}
              valueStyle={{ color: '#9254de' }}
              suffix={`/ ${stats.total_teachers}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Math Teachers"
              value={stats.math_teachers}
              valueStyle={{ color: '#13c2c2' }}
              suffix={`/ ${stats.total_teachers}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Teacher Availability Alert */}
      {stats.total_teachers === 0 && (
        <Alert
          message="No Teachers Assigned"
          description="This school currently has no teachers assigned. Click 'Assign Teacher' to add teachers."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Teachers Table */}
      <Card title={`Teachers (${teachers.length})`}>
        <Table
          columns={columns}
          dataSource={teachers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} teachers`,
          }}
          locale={{
            emptyText: (
              <Empty
                description="No teachers assigned"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button 
                  type="primary" 
                  onClick={() => {
                    fetchAvailableTeachers();
                    setAssignModalVisible(true);
                  }}
                >
                  Assign First Teacher
                </Button>
              </Empty>
            )
          }}
        />
      </Card>

      {/* Assign Teacher Modal */}
      <Modal
        title="Assign Teachers to School"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedTeachers([]);
        }}
        onOk={() => handleAssignTeacher(selectedTeachers)}
        okText="Assign Selected"
        width={600}
      >
        <Alert
          message="Select teachers to assign to this school"
          description="Only unassigned teachers are shown here"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="Select teachers to assign"
          value={selectedTeachers}
          onChange={setSelectedTeachers}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {availableTeachers.map(teacher => (
            <Option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.email} ({teacher.subject || 'No subject'})
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Bulk Manage Modal */}
      <Modal
        title="Bulk Manage Teacher Assignments"
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={handleTransferSubmit}
        width={800}
        okText="Save Changes"
      >
        <Alert
          message="Manage all teacher assignments"
          description="Move teachers between 'Available' and 'Assigned' lists"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Transfer
          dataSource={transferDataSource}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          render={item => item.title}
          titles={['Available Teachers', 'Assigned to School']}
          listStyle={{ width: 350, height: 400 }}
          showSearch
          filterOption={(inputValue, option) =>
            option.title.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 ||
            option.description.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
          }
        />
      </Modal>
    </div>
  );
}
export default function SchoolTeachersPage() {
  return (
    <HorizontalLayout>
      <SchoolTeachersPageContent />
    </HorizontalLayout>
  );
}
