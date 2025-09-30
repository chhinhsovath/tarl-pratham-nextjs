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
  Pagination
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined
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
}

const ROLES = [
  { value: "admin", label: "Admin", color: "red" },
  { value: "coordinator", label: "Coordinator", color: "blue" },
  { value: "mentor", label: "Mentor", color: "green" },
  { value: "teacher", label: "Teacher", color: "orange" },
  { value: "viewer", label: "Viewer", color: "default" }
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

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  // Check permissions
  const canCreate = session?.user?.role === "admin" || session?.user?.role === "coordinator";
  const canEdit = session?.user?.role === "admin" || session?.user?.role === "coordinator";
  const canDelete = session?.user?.role === "admin";

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

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const getRoleColor = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role);
    return roleConfig?.color || "default";
  };

  const columns: ColumnsType<User> = [
    {
      title: "User",
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
      title: "Role",
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
      title: "Province",
      dataIndex: "province",
      key: "province",
      render: (province: string) => province || "-",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => subject || "-",
    },
    {
      title: "Pilot School",
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
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "-",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.role === "teacher" && (
            <Tag color={record.teacher_profile_setup ? "green" : "orange"}>
              Profile: {record.teacher_profile_setup ? "Complete" : "Incomplete"}
            </Tag>
          )}
          {record.role === "mentor" && (
            <Tag color={record.mentor_profile_complete ? "green" : "orange"}>
              Mentor: {record.mentor_profile_complete ? "Complete" : "Incomplete"}
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {canEdit && (
            <Link href={`/users/${record.id}/edit`}>
              <Button type="link" icon={<EditOutlined />} size="small">
                Edit
              </Button>
            </Link>
          )}
          {canDelete && record.id !== parseInt(session?.user?.id || "0") && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const userStats = {
    total: pagination.total,
    admins: users.filter(u => u.role === "admin").length,
    mentors: users.filter(u => u.role === "mentor").length,
    teachers: users.filter(u => u.role === "teacher").length,
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TeamOutlined /> Users
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
          User Management
        </Title>
        {canCreate && (
          <Link href="/users/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add User
            </Button>
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={userStats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Admins"
              value={userStats.admins}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mentors"
              value={userStats.mentors}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Teachers"
              value={userStats.teachers}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Input
            placeholder="Search users..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by role"
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
            placeholder="Filter by province"
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
              `${range[0]}-${range[1]} of ${total} users`
            }
          />
        </div>
      </Card>
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
