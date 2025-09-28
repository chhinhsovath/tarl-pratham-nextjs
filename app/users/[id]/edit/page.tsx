"use client";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Breadcrumb,
  message,
  Row,
  Col,
  Space,
  Spin
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  SaveOutlined
} from "@ant-design/icons";
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
  pilot_school?: {
    id: number;
    name: string;
    code: string;
  };
}

interface PilotSchool {
  id: number;
  name: string;
  code: string;
  province: {
    name_english: string;
  };
}

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "coordinator", label: "Coordinator" },
  { value: "mentor", label: "Mentor" },
  { value: "teacher", label: "Teacher" },
  { value: "viewer", label: "Viewer" }
];

const PROVINCES = [
  "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", 
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
  "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh",
  "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap",
  "Preah Sihanouk", "Stung Treng", "Svay Rieng", "Takeo", "Tbong Khmum"
];

const SUBJECTS = [
  "Khmer", "Mathematics", "Science", "Social Studies", "English", 
  "Physical Education", "Arts", "Life Skills", "Computer"
];

function EditUserPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [pilotSchools, setPilotSchools] = useState<PilotSchool[]>([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check permissions
    const canEdit = session.user.role === "admin" || 
                   session.user.role === "coordinator" || 
                   session.user.id === userId;
                   
    if (!canEdit) {
      message.error("You don't have permission to edit this user");
      router.push("/users");
      return;
    }

    fetchUser();
    fetchPilotSchools();
  }, [session, status, router, userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users?id=${userId}&single=true`);
      if (!response.ok) throw new Error("Failed to fetch user");
      
      const data = await response.json();
      const userData = data.data;
      setUser(userData);
      setSelectedRole(userData.role);
      
      // Set form values
      form.setFieldsValue({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        province: userData.province,
        subject: userData.subject,
        phone: userData.phone,
        pilot_school_id: userData.pilot_school_id
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      message.error("Failed to load user data");
      router.push("/users");
    } finally {
      setFetching(false);
    }
  };

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch("/api/pilot-schools");
      if (!response.ok) throw new Error("Failed to fetch pilot schools");
      
      const data = await response.json();
      setPilotSchools(data.data);
    } catch (error) {
      console.error("Error fetching pilot schools:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Remove password if empty (don't update password)
      const updateData = { ...values, id: parseInt(userId) };
      if (!updateData.password) {
        delete updateData.password;
      }

      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }

      message.success("User updated successfully");
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error instanceof Error ? error.message : "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Clear pilot school if not mentor/teacher
    if (role !== "mentor" && role !== "teacher") {
      form.setFieldValue("pilot_school_id", undefined);
    }
  };

  // Check if current user can edit role
  const canEditRole = session?.user?.role === "admin" || 
                     (session?.user?.role === "coordinator" && user?.role !== "admin");

  if (fetching) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: "16px" }}>Loading user data...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={3}>User not found</Title>
        <Link href="/users">
          <Button type="primary">Back to Users</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/users">
            <TeamOutlined /> Users
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined /> Edit {user.name}
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
          Edit User: {user.name}
        </Title>
        <Link href="/users">
          <Button icon={<ArrowLeftOutlined />}>
            Back to Users
          </Button>
        </Link>
      </div>

      {/* Edit Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the user's name" },
                  { min: 2, message: "Name must be at least 2 characters" }
                ]}
              >
                <Input placeholder="Enter full name" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter email address" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input 
                  placeholder="Enter email address" 
                  size="large"
                  disabled={session?.user?.id === userId && session?.user?.role !== "admin"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="New Password (leave empty to keep current)"
                name="password"
                rules={[
                  { min: 6, message: "Password must be at least 6 characters" }
                ]}
              >
                <Input.Password placeholder="Enter new password" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  { required: true, message: "Please select a role" }
                ]}
              >
                <Select 
                  placeholder="Select role" 
                  size="large"
                  onChange={handleRoleChange}
                  disabled={!canEditRole}
                >
                  {ROLES.map(role => (
                    <Option key={role.value} value={role.value}>
                      {role.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Province"
                name="province"
              >
                <Select 
                  placeholder="Select province" 
                  size="large"
                  showSearch
                  allowClear
                >
                  {PROVINCES.map(province => (
                    <Option key={province} value={province}>
                      {province}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="Subject"
                name="subject"
              >
                <Select 
                  placeholder="Select subject" 
                  size="large"
                  allowClear
                >
                  {SUBJECTS.map(subject => (
                    <Option key={subject} value={subject}>
                      {subject}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phone Number"
                name="phone"
              >
                <Input placeholder="Enter phone number" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {(selectedRole === "mentor" || selectedRole === "teacher") && (
                <Form.Item
                  label="Pilot School"
                  name="pilot_school_id"
                >
                  <Select 
                    placeholder="Select pilot school" 
                    size="large"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        ?.toLowerCase()
                        ?.includes(input.toLowerCase()) ?? false
                    }
                  >
                    {pilotSchools.map(school => (
                      <Option key={school.id} value={school.id}>
                        {school.name} ({school.code}) - {school.province.name_english}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>

          {/* Form Actions */}
          <div style={{ marginTop: "32px" }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                icon={<SaveOutlined />}
              >
                Update User
              </Button>
              <Link href="/users">
                <Button size="large">
                  Cancel
                </Button>
              </Link>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}
export default function EditUserPage() {
  return (
    <HorizontalLayout>
      <EditUserPageContent />
    </HorizontalLayout>
  );
}
