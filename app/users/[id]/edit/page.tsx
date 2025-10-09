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
    school_name: string;
    school_code: string;
    province?: string; // province is a string
  };
}

interface PilotSchool {
  id: number;
  name: string;
  code: string;
  province?: string; // province is a string
}

const ROLES = [
  { value: "admin", label: "អ្នកគ្រប់គ្រង" },
  { value: "coordinator", label: "អ្នកសម្របសម្រួល" },
  { value: "mentor", label: "អ្នកណែនាំ" },
  { value: "teacher", label: "គ្រូបង្រៀន" },
  { value: "viewer", label: "អ្នកមើល" }
];

const PROVINCES = [
  "បន្ទាយមានជ័យ", "បាត់ដំបង", "កំពង់ចាម", "កំពង់ឆ្នាំង",
  "កំពង់ស្ពឺ", "កំពង់ធំ", "កំពត", "កណ្តាល", "កែប", "កោះកុង",
  "ក្រចេះ", "មណ្ឌលគិរី", "ឧត្តរមានជ័យ", "ប៉ៃលិន", "ភ្នំពេញ",
  "ព្រះវិហារ", "ព្រៃវែង", "ពោធិ៍សាត់", "រតនគិរី", "សៀមរាប",
  "ព្រះសីហនុ", "ស្ទឹងត្រែង", "ស្វាយរៀង", "តាកែវ", "ត្បូងឃ្មុំ"
];

const SUBJECTS = [
  "ភាសាខ្មែរ", "គណិតវិទ្យា", "វិទ្យាសាស្ត្រ", "សិក្សាសង្គម", "ភាសាអង់គ្លេស",
  "កីឡា", "សិល្បៈ", "ជំនាញរស់នៅ", "កុំព្យូទ័រ"
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
      message.error("អ្នកមិនមានសិទ្ធិកែប្រែអ្នកប្រើប្រាស់នេះទេ");
      router.push("/users");
      return;
    }

    fetchUser();
    fetchPilotSchools();
  }, [session, status, router, userId]);

  const fetchUser = async () => {
    try {
      // Use correct API endpoint: /api/users/[id]
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "មិនអាចទាញយកទិន្នន័យអ្នកប្រើប្រាស់");
      }

      const data = await response.json();
      const userData = data.data;

      console.log('[USER EDIT] Fetched user data:', userData);

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
      message.error(error instanceof Error ? error.message : "មិនអាចផ្ទុកទិន្នន័យអ្នកប្រើប្រាស់");
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
        throw new Error(error.error || "មិនអាចកែប្រែអ្នកប្រើប្រាស់");
      }

      message.success("បានកែប្រែអ្នកប្រើប្រាស់ដោយជោគជ័យ");
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(error instanceof Error ? error.message : "មិនអាចកែប្រែអ្នកប្រើប្រាស់");
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
        <div style={{ marginTop: "16px" }}>កំពុងផ្ទុកទិន្នន័យអ្នកប្រើប្រាស់...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Title level={3}>រកមិនឃើញអ្នកប្រើប្រាស់</Title>
        <Link href="/users">
          <Button type="primary">ត្រឡប់ទៅអ្នកប្រើប្រាស់</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> ទំព័រដើម
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/users">
            <TeamOutlined /> អ្នកប្រើប្រាស់
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <EditOutlined /> កែប្រែ {user.name}
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
          កែប្រែអ្នកប្រើប្រាស់៖ {user.name}
        </Title>
        <Link href="/users">
          <Button icon={<ArrowLeftOutlined />}>
            ត្រឡប់ទៅអ្នកប្រើប្រាស់
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
                label="ឈ្មោះពេញ"
                name="name"
                rules={[
                  { required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់" },
                  { min: 2, message: "ឈ្មោះត្រូវតែមានយ៉ាងតិច ២ តួអក្សរ" }
                ]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះពេញ" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="អាសយដ្ឋានអ៊ីមែល"
                name="email"
                rules={[
                  { required: true, message: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល" },
                  { type: "email", message: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ" }
                ]}
              >
                <Input
                  placeholder="បញ្ចូលអាសយដ្ឋានអ៊ីមែល"
                  size="large"
                  disabled={session?.user?.id === userId && session?.user?.role !== "admin"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ពាក្យសម្ងាត់ថ្មី (ទុកចោលប្រសិនបើចង់រក្សាពាក្យសម្ងាត់បច្ចុប្បន្ន)"
                name="password"
                rules={[
                  { min: 6, message: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងតិច ៦ តួអក្សរ" }
                ]}
              >
                <Input.Password placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="តួនាទី"
                name="role"
                rules={[
                  { required: true, message: "សូមជ្រើសរើសតួនាទី" }
                ]}
              >
                <Select
                  placeholder="ជ្រើសរើសតួនាទី"
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
                label="ខេត្ត"
                name="province"
              >
                <Select
                  placeholder="ជ្រើសរើសខេត្ត"
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
                label="មុខវិជ្ជា"
                name="subject"
              >
                <Select
                  placeholder="ជ្រើសរើសមុខវិជ្ជា"
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
                label="លេខទូរស័ព្ទ"
                name="phone"
              >
                <Input placeholder="បញ្ចូលលេខទូរស័ព្ទ" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {(selectedRole === "mentor" || selectedRole === "teacher") && (
                <Form.Item
                  label="សាលាសាកល្បង"
                  name="pilot_school_id"
                >
                  <Select
                    placeholder="ជ្រើសរើសសាលាសាកល្បង"
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
                        {school.name} ({school.code}){school.province ? ` - ${school.province}` : ''}
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
                កែប្រែអ្នកប្រើប្រាស់
              </Button>
              <Link href="/users">
                <Button size="large">
                  បោះបង់
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
