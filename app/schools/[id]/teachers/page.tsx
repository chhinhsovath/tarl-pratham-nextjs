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
      message.error('បរាជ័យក្នុងការផ្ទុកទិន្នន័យសាលារៀន');
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
      message.error('បរាជ័យក្នុងការផ្ទុកគ្រូបង្រៀន');
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
        message.success(`បានចាត់តាំងគ្រូ ${teacherIds.length} ក្របាប់បានជោគជ័យ`);
        setAssignModalVisible(false);
        setSelectedTeachers([]);
        fetchTeachers();
        fetchStats();
      } else {
        throw new Error('Failed to assign teachers');
      }
    } catch (error) {
      console.error('Error assigning teachers:', error);
      message.error('បរាជ័យក្នុងការចាត់តាំងគ្រូបង្រៀន');
    }
  };

  const handleRemoveTeacher = async (teacherId: number) => {
    try {
      const response = await fetch(`/api/schools/${schoolId}/teachers/${teacherId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('បានលុបគ្រូចេញពីសាលារៀនបានជោគជ័យ');
        fetchTeachers();
        fetchStats();
      } else {
        throw new Error('Failed to remove teacher');
      }
    } catch (error) {
      console.error('Error removing teacher:', error);
      message.error('បរាជ័យក្នុងការលុបគ្រូ');
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
      message.success('បានក្រោយលក្ខណ៍ការចាត់តាំងគ្រូបានជោគជ័យ');
    } catch (error) {
      console.error('Error updating assignments:', error);
      message.error('បរាជ័យក្នុងការក្រោយលក្ខណ៍ការចាត់តាំងគ្រូ');
    }
  };

  const columns = [
    {
      title: 'គ្រូ',
      key: 'teacher',
      render: (_: any, record: Teacher) => (
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div><strong>{record.name}</strong></div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.role === 'teacher' ? 'គ្រូបង្រៀន' : record.role === 'mentor' ? 'ព្រឹក្សាគរុកោសល្យ' : record.role}
            </Text>
          </div>
        </Space>
      )
    },
    {
      title: 'ទំនាក់ទំនង',
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
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject?: string) => {
        if (!subject) return <Tag>មិនបានកំណត់</Tag>;

        const subjectMap: any = {
          'Language': 'ភាសាខ្មែរ',
          'Math': 'គណិតវិទ្យា',
          'language': 'ភាសាខ្មែរ',
          'math': 'គណិតវិទ្យា',
          'both': 'ភាសា & គណិតវិទ្យា'
        };

        const colors: any = {
          'Language': 'purple',
          'Math': 'cyan',
          'language': 'purple',
          'math': 'cyan',
          'both': 'green'
        };

        const icons: any = {
          'Language': '📖',
          'Math': '🔢',
          'language': '📖',
          'math': '🔢',
          'both': '📚'
        };

        return (
          <Tag color={colors[subject] || 'default'} icon={<span>{icons[subject]}</span>}>
            {subjectMap[subject] || subject}
          </Tag>
        );
      }
    },
    {
      title: 'ថ្នាក់រៀន',
      dataIndex: 'holding_classes',
      key: 'classes',
      render: (classes?: string) => (
        <Text>{classes || 'មិនបានលម្អិត'}</Text>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      render: (_: any, record: Teacher) => (
        <Badge
          status={record.is_active ? 'success' : 'default'}
          text={record.is_active ? 'សកម្ម' : 'អសកម្ម'}
        />
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (_: any, record: Teacher) => (
        <Space size="small">
          <Tooltip title="មើលព័ត៌មាន">
            <Button
              type="link"
              icon={<UserOutlined />}
              onClick={() => router.push(`/users/${record.id}`)}
            />
          </Tooltip>

          <Popconfirm
            title="លុបគ្រូចេញពីសាលារៀន?"
            description="នឹងលុបការចាត់តាំងគ្រូចេញពីសាលារៀននេះ។"
            onConfirm={() => handleRemoveTeacher(record.id)}
            okText="ដោះស្រាយ"
            cancelText="បោះបង់"
          >
            <Tooltip title="លុបចេញពីសាលារៀន">
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
    <div className="max-w-full overflow-x-hidden">
      {/* School Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <Title level={3} style={{ margin: 0 }}>
              ការគ្រប់គ្រងគ្រូបង្រៀន
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
                ចាត់តាំងគ្រូ
              </Button>

              <Button
                icon={<SwapOutlined />}
                onClick={() => {
                  fetchAvailableTeachers();
                  setTransferModalVisible(true);
                }}
              >
                គ្រប់គ្រងស្វ័យប្រវត្តិ
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
              title="ចំនួនគ្រូសរុប"
              value={stats.total_teachers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="គ្រូសកម្ម"
              value={stats.active_teachers}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="គ្រូខ្មែរ"
              value={stats.khmer_teachers}
              valueStyle={{ color: '#9254de' }}
              suffix={`/ ${stats.total_teachers}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="គ្រូគណិតវិទ្យា"
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
          message="មិនមានគ្រូដែលបានចាត់តាំង"
          description="សាលារៀននេះមិនមានគ្រូដែលបានចាត់តាំងនៅឡើយ។ ចូលលើ 'ចាត់តាំងគ្រូ' ដើម្បីបន្ថែមគ្រូ។"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Teachers Table */}
      <Card title={`គ្រូបង្រៀន (${teachers.length})`}>
        <Table scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={teachers}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `សរុប ${total} គ្រូបង្រៀន`,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '50']
          }}
          locale={{
            emptyText: (
              <Empty
                description="មិនមានគ្រូដែលបានចាត់តាំង"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    fetchAvailableTeachers();
                    setAssignModalVisible(true);
                  }}
                >
                  ចាត់តាំងគ្រូឡើងវិញ
                </Button>
              </Empty>
            )
          }}
        />
      </Card>

      {/* Assign Teacher Modal */}
      <Modal
        title="ចាត់តាំងគ្រូទៅសាលារៀន"
        open={assignModalVisible}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedTeachers([]);
        }}
        onOk={() => handleAssignTeacher(selectedTeachers)}
        okText="ចាត់តាំងដែលបានជ្រើស"
        cancelText="បោះបង់"
        width={600}
      >
        <Alert
          message="ជ្រើសរើសគ្រូដែលត្រូវចាត់តាំងទៅសាលារៀននេះ"
          description="មានតែគ្រូដែលមិនបានចាត់តាំងប៉ុណ្ណោះដែលបង្ហាញនៅទីនេះ"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="ជ្រើសរើសគ្រូដែលត្រូវចាត់តាំង"
          value={selectedTeachers}
          onChange={setSelectedTeachers}
          filterOption={(input, option) =>
            option?.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {availableTeachers.map(teacher => (
            <Option key={teacher.id} value={teacher.id}>
              {teacher.name} - {teacher.email} ({teacher.subject ? (teacher.subject === 'Language' ? 'ភាសាខ្មែរ' : teacher.subject === 'Math' ? 'គណិតវិទ្យា' : teacher.subject) : 'មិនបានកំណត់'})
            </Option>
          ))}
        </Select>
      </Modal>

      {/* Bulk Manage Modal */}
      <Modal
        title="គ្រប់គ្រងការចាត់តាំងគ្រូស្វ័យប្រវត្តិ"
        open={transferModalVisible}
        onCancel={() => setTransferModalVisible(false)}
        onOk={handleTransferSubmit}
        width={800}
        okText="រក្សាទុកលម្អិត"
        cancelText="បោះបង់"
      >
        <Alert
          message="គ្រប់គ្រងការចាត់តាំងគ្រូទាំងអស់"
          description="ផ្លាស់ប្តូរគ្រូរវាងបញ្ជីលក់ដែលមាន និងបញ្ជីដែលបានចាត់តាំង"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Transfer
          dataSource={transferDataSource}
          targetKeys={targetKeys}
          onChange={handleTransferChange}
          render={item => item.title}
          titles={['គ្រូដែលមាន', 'ចាត់តាំងទៅសាលារៀន']}
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
