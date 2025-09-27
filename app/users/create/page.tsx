"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  Space
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  PlusOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import Link from "next/link";

const { Title } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  name: string;
  code: string;
  province: {
    name_english: string;
  };
}

const ROLES = [
  { value: "admin", label: "អ្នកគ្រប់គ្រង" },
  { value: "coordinator", label: "សម្របសម្រួល" },
  { value: "mentor", label: "អ្នកណែនាំ" },
  { value: "teacher", label: "គ្រូបង្រៀន" },
  { value: "viewer", label: "អ្នកមើល" }
];

const PROVINCES = [
  "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang", 
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong",
  "Kratie", "Mondulkiri", "Oddar Meanchey", "Pailin", "Phnom Penh",
  "Preah Vihear", "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap",
  "Preah Sihanouk", "Stung Treng", "Svay Rieng", "Takeo", "Tbong Khmum"
];

const SUBJECTS = [
  "ភាសាខ្មែរ", "គណិតវិទ្យា", "វិទ្យាសាស្ត្រ", "សង្គម", "អង់គ្លេស", 
  "កីឡា", "កលាបត្ថម្ម", "ជំនាញរស់នៅ", "កុំព្យូទ័រ"
];

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pilotSchools, setPilotSchools] = useState<PilotSchool[]>([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check permissions
    if (session.user.role !== "admin" && session.user.role !== "coordinator") {
      message.error("អ្នកមិនមានសិទ្ធិបង្កើតអ្នកប្រើប្រាស់ទេ");
      router.push("/users");
      return;
    }

    fetchPilotSchools();
  }, [session, status, router]);

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch("/api/pilot-schools");
      if (!response.ok) throw new Error("Failed to fetch pilot schools");
      
      const data = await response.json();
      setPilotSchools(data.data);
    } catch (error) {
      console.error("Error fetching pilot schools:", error);
      message.error("មិនអាចទាញយកបញ្ជីសាលាបាន");
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

      message.success("បង្កើតអ្នកប្រើប្រាស់ដោយជោគជ័យ");
      router.push("/users");
    } catch (error) {
      console.error("Error creating user:", error);
      message.error(error instanceof Error ? error.message : "មិនអាចបង្កើតអ្នកប្រើប្រាស់បាន");
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

  return (
    <div style={{ padding: "24px" }}>
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> ផ្ទាំងគ្រប់គ្រង
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/users">
            <TeamOutlined /> អ្នកប្រើប្រាស់
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <PlusOutlined /> បង្កើតអ្នកប្រើប្រាស់
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
          បង្កើតអ្នកប្រើប្រាស់ថ្មី
        </Title>
        <Link href="/users">
          <Button icon={<ArrowLeftOutlined />}>
            ត្រលប់ទៅអ្នកប្រើប្រាស់
          </Button>
        </Link>
      </div>

      {/* Create Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: "teacher"
          }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ឈ្មោះពេញ"
                name="name"
                rules={[
                  { required: true, message: "សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់" },
                  { min: 2, message: "ឈ្មោះត្រូវតែមានចាប់ពី ២ តួអក្សរឡើងទៅ" }
                ]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះពេញ" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                label="អីម៉ែល"
                name="email"
                rules={[
                  { required: true, message: "សូមបញ្ចូលអាសយដ្ឋានអីម៉ែល" },
                  { type: "email", message: "សូមបញ្ចូលអីម៉ែលត្រឹមត្រូវ" }
                ]}
              >
                <Input placeholder="បញ្ចូលអាសយដ្ឋានអីម៉ែល" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="ពាក្យសម្ងាត់"
                name="password"
                rules={[
                  { required: true, message: "សូមបញ្ចូលពាក្យសម្ងាត់" },
                  { min: 6, message: "ពាក្យសម្ងាត់ត្រូវតែមានចាប់ពី ៦ តួអក្សរឡើងទៅ" }
                ]}
              >
                <Input.Password placeholder="បញ្ចូលពាក្យសម្ងាត់" size="large" />
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
                icon={<PlusOutlined />}
              >
                បង្កើតអ្នកប្រើប្រាស់
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