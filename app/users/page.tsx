"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Card,
  Typography,
  Breadcrumb,
  message,
  Popconfirm,
  Tag,
  Avatar,
  Tooltip,
  Row,
  Col,
  Statistic,
  Pagination,
  Modal,
  Form
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  KeyOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  province?: string;
  subject?: string;
  phone?: string;
  pilot_school_id?: number;
  teacher_profile_setup: boolean;
  mentor_profile_complete: boolean;
  created_at: string;
  updated_at: string;
  pilot_school?: {
    id: number;
    name: string;
    code: string;
  };
}

interface ApiResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: {
    admin: number;
    coordinator: number;
    mentor: number;
    teacher: number;
    viewer: number;
  };
}

const ROLES = [
  { value: "admin", label: "អ្នកគ្រប់គ្រង", color: "red" },
  { value: "coordinator", label: "អ្នកសម្របសម្រួល", color: "blue" },
  { value: "mentor", label: "អ្នកណែនាំ", color: "green" },
  { value: "teacher", label: "គ្រូបង្រៀន", color: "orange" },
  { value: "viewer", label: "អ្នកមើល", color: "default" }
];

const PROVINCES = [
  "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", 
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
  "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh",
  "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap",
  "Preah Sihanouk", "Stung Treng", "Svay Rieng", "Takeo", "Tbong Khmum"
];

function UsersPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [stats, setStats] = useState({
    admin: 0,
    coordinator: 0,
    mentor: 0,
    teacher: 0,
    viewer: 0
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  // Reset password modal
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [form] = Form.useForm();

  // Check permissions
  const canCreate = session?.user?.role === "admin" || session?.user?.role === "coordinator";
  const canEdit = session?.user?.role === "admin" || session?.user?.role === "coordinator";
  const canDelete = session?.user?.role === "admin";
  const canResetPassword = session?.user?.role === "admin" || session?.user?.role === "coordinator";

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }
    
    fetchUsers();
  }, [session, status, pagination.page, searchTerm, selectedRole, selectedProvince]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedRole) params.append("role", selectedRole);
      if (selectedProvince) params.append("province", selectedProvince);

      const response = await fetch(`/api/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data: ApiResponse = await response.json();
      setUsers(data.data);
      setPagination(prev => ({ ...prev, ...data.pagination }));
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }

      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error(error instanceof Error ? error.message : "Failed to delete user");
    }
  };

  const handleResetPassword = async (values: { new_password: string }) => {
    if (!selectedUser) return;

    setResettingPassword(true);
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_password: values.new_password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to reset password");
      }

      message.success("កំណត់ពាក្យសម្ងាត់ឡើងវិញបានជោគជ័យ");
      setResetPasswordModal(false);
      form.resetFields();
      setSelectedUser(null);
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setResettingPassword(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getRoleColor = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role);
    return roleConfig?.color || "default";
  };

  const columns: ColumnsType<User> = [
    {
      title: "អ្នកប្រើប្រាស់",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ color: "#666", fontSize: "12px" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "តួនាទី",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {ROLES.find(r => r.value === role)?.label || role.toUpperCase()}
        </Tag>
      ),
      filters: ROLES.map(role => ({ text: role.label, value: role.value })),
      filteredValue: selectedRole ? [selectedRole] : null,
    },
    {
      title: "ខេត្ត",
      dataIndex: "province",
      key: "province",
      render: (province: string) => province || "-",
    },
    {
      title: "មុខវិជ្ជា",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => subject || "-",
    },
    {
      title: "សាលារៀន",
      key: "pilot_school",
      render: (_, record) => (
        record.pilot_school ? (
          <Tooltip title={record.pilot_school.school_name}>
            <Tag color="blue">{record.pilot_school.school_code}</Tag>
          </Tooltip>
        ) : "-"
      ),
    },
    {
      title: "លេខទូរសព្ទ",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "-",
    },
    {
      title: "ស្ថានភាព",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.role === "teacher" && (
            <Tag color={record.teacher_profile_setup ? "green" : "orange"}>
              ប្រវត្តិរូប៖ {record.teacher_profile_setup ? "បានបំពេញ" : "មិនទាន់បំពេញ"}
            </Tag>
          )}
          {record.role === "mentor" && (
            <Tag color={record.mentor_profile_complete ? "green" : "orange"}>
              គ្រូព្រឹក្សាគរុកោសល្យ៖ {record.mentor_profile_complete ? "បានបំពេញ" : "មិនទាន់បំពេញ"}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "បានបង្កើត",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: "សកម្មភាព",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Link href={`/users/${record.id}/edit`}>
              <Button type="link" icon={<EditOutlined />} size="small">
                កែប្រែ
              </Button>
            </Link>
          )}
          {canResetPassword && (
            <Button
              type="link"
              icon={<KeyOutlined />}
              size="small"
              onClick={() => {
                setSelectedUser(record);
                setResetPasswordModal(true);
              }}
            >
              កំណត់ពាក្យសម្ងាត់
            </Button>
          )}
          {canDelete && record.id !== parseInt(session?.user?.id || "0") && (
            <Popconfirm
              title="លុបអ្នកប្រើប្រាស់"
              description="តើអ្នកពិតជាចង់លុបអ្នកប្រើប្រាស់នេះមែនទេ?"
              onConfirm={() => handleDelete(record.id)}
              okText="យល់ព្រម"
              cancelText="បោះបង់"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                លុប
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> ផ្ទាំងគ្រប់គ្រង
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TeamOutlined /> អ្នកប្រើប្រាស់
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "24px" 
      }}>
        <Title level={2} style={{ margin: 0 }}>
          គ្រប់គ្រងអ្នកប្រើប្រាស់
        </Title>
        {canCreate && (
          <Link href="/users/create">
            <Button type="primary" icon={<PlusOutlined />}>
              បន្ថែមអ្នកប្រើប្រាស់ថ្មី
            </Button>
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="អ្នកប្រើប្រាស់សរុប"
              value={pagination.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="អ្នកគ្រប់គ្រង"
              value={stats.admin}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="អ្នកសម្របសម្រួល"
              value={stats.coordinator}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="អ្នកណែនាំ"
              value={stats.mentor}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="គ្រូបង្រៀន"
              value={stats.teacher}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <Card>
            <Statistic
              title="អ្នកមើល"
              value={stats.viewer}
              valueStyle={{ color: "#8c8c8c" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Input
            placeholder="ស្វែងរកអ្នកប្រើប្រាស់..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="តម្រងតាមតួនាទី"
            value={selectedRole}
            onChange={setSelectedRole}
            style={{ width: 150 }}
            allowClear
          >
            {ROLES.map(role => (
              <Option key={role.value} value={role.value}>
                {role.label}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="តម្រងតាមខេត្ត"
            value={selectedProvince}
            onChange={setSelectedProvince}
            style={{ width: 200 }}
            allowClear
            showSearch
          >
            {PROVINCES.map(province => (
              <Option key={province} value={province}>
                {province}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1200 }}
        />
        
        {/* Custom Pagination */}
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            onChange={handlePageChange}
            showSizeChanger={false}
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} នៃ ${total} អ្នកប្រើប្រាស់`
            }
          />
        </div>
      </Card>

      {/* Reset Password Modal */}
      <Modal
        title="កំណត់ពាក្យសម្ងាត់ឡើងវិញ"
        open={resetPasswordModal}
        onCancel={() => {
          setResetPasswordModal(false);
          form.resetFields();
          setSelectedUser(null);
        }}
        onOk={() => form.submit()}
        confirmLoading={resettingPassword}
        okText="កំណត់ពាក្យសម្ងាត់"
        cancelText="បោះបង់"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item label="អ្នកប្រើប្រាស់">
            <Input value={selectedUser?.name} disabled />
          </Form.Item>
          <Form.Item label="អ៊ីមែល">
            <Input value={selectedUser?.email} disabled />
          </Form.Item>
          <Form.Item
            label="ពាក្យសម្ងាត់ថ្មី"
            name="new_password"
            rules={[
              { required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់ថ្មី" },
              { min: 6, message: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច 6 តួអក្សរ" }
            ]}
          >
            <Input.Password placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default function UsersPage() {
  return (
    <HorizontalLayout>
      <UsersPageContent />
    </HorizontalLayout>
  );
}
