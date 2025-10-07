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
  message,
  Popconfirm,
  Tag,
  Modal,
  Form,
  Row,
  Col,
  Tooltip,
  Spin,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  BankOutlined,
  BookOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;
const { Option } = Select;

interface Mentor {
  id: number;
  name: string;
  email: string;
  province?: string;
}

interface PilotSchool {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  cluster: string;
}

interface Assignment {
  id: number;
  mentor_id: number;
  pilot_school_id: number;
  subject: string;
  assigned_date: string;
  is_active: boolean;
  notes?: string;
  mentor: Mentor;
  pilot_school: PilotSchool;
  assigned_by?: {
    id: number;
    name: string;
  };
}

interface ApiResponse {
  data: Assignment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function MentorAssignmentsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Filters
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown data
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);

  const [form] = Form.useForm();

  // Check permissions - only coordinators and admins can access
  const canManage = session?.user?.role === "admin" || session?.user?.role === "coordinator";

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check if user has permission
    if (!canManage) {
      router.push("/unauthorized");
      return;
    }

    fetchAssignments();
    fetchMentors();
    fetchSchools();
  }, [session, status, pagination.page, selectedMentor, selectedSchool, selectedSubject, selectedStatus]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedMentor) params.append("mentor_id", selectedMentor);
      if (selectedSchool) params.append("pilot_school_id", selectedSchool);
      if (selectedSubject) params.append("subject", selectedSubject);
      if (selectedStatus) params.append("is_active", selectedStatus);

      const response = await fetch(`/api/mentor-assignments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch assignments");

      const data: ApiResponse = await response.json();
      setAssignments(data.data);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("មានបញ្ហាក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    setLoadingMentors(true);
    try {
      const response = await fetch("/api/users?role=mentor&limit=1000");
      if (!response.ok) throw new Error("Failed to fetch mentors");

      const data = await response.json();
      setMentors(data.data || []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    } finally {
      setLoadingMentors(false);
    }
  };

  const fetchSchools = async () => {
    setLoadingSchools(true);
    try {
      const response = await fetch("/api/pilot-schools");
      if (!response.ok) throw new Error("Failed to fetch schools");

      const data = await response.json();
      setSchools(data.data || data || []);
    } catch (error) {
      console.error("Error fetching schools:", error);
    } finally {
      setLoadingSchools(false);
    }
  };

  const handleCreate = () => {
    setEditingAssignment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    form.setFieldsValue({
      mentor_id: assignment.mentor_id,
      pilot_school_id: assignment.pilot_school_id,
      subject: assignment.subject,
      notes: assignment.notes,
      is_active: assignment.is_active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/mentor-assignments?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete assignment");
      }

      message.success("បានលុបការចាត់តាំងដោយជោគជ័យ");
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
      message.error(error instanceof Error ? error.message : "មានបញ្ហាក្នុងការលុប");
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const url = editingAssignment
        ? "/api/mentor-assignments"
        : "/api/mentor-assignments";

      const method = editingAssignment ? "PUT" : "POST";

      const body = editingAssignment
        ? { id: editingAssignment.id, ...values }
        : values;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save assignment");
      }

      message.success(
        editingAssignment
          ? "បានកែប្រែការចាត់តាំងដោយជោគជ័យ"
          : "បានបង្កើតការចាត់តាំងដោយជោគជ័យ"
      );
      setIsModalVisible(false);
      form.resetFields();
      fetchAssignments();
    } catch (error) {
      console.error("Error saving assignment:", error);
      message.error(error instanceof Error ? error.message : "មានបញ្ហាក្នុងការរក្សាទុក");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Assignment> = [
    {
      title: "ម៉ង់ទ័រ (Mentor)",
      dataIndex: ["mentor", "name"],
      key: "mentor_name",
      render: (text: string, record: Assignment) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.mentor.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "សាលារៀន (School)",
      dataIndex: ["pilot_school", "school_name"],
      key: "school_name",
      render: (text: string, record: Assignment) => (
        <Space direction="vertical" size={0}>
          <div>
            <BankOutlined /> {text}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.pilot_school.province} - {record.pilot_school.district}
          </Text>
        </Space>
      ),
    },
    {
      title: "មុខវិជ្ជា (Subject)",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => (
        <Tag
          icon={<BookOutlined />}
          color={subject === "Language" ? "blue" : "green"}
        >
          {subject === "Language" ? "ភាសា" : "គណិតវិទ្យា"}
        </Tag>
      ),
    },
    {
      title: "ស្ថានភាព (Status)",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "សកម្ម" : "អសកម្ម"}
        </Tag>
      ),
    },
    {
      title: "កាលបរិច្ឆេទចាត់តាំង (Assigned Date)",
      dataIndex: "assigned_date",
      key: "assigned_date",
      render: (date: string) => new Date(date).toLocaleDateString("km-KH"),
    },
    {
      title: "សកម្មភាព (Actions)",
      key: "actions",
      render: (_: any, record: Assignment) => (
        <Space>
          <Tooltip title="កែប្រែ">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="លុប">
            <Popconfirm
              title="តើអ្នកប្រាកដថាចង់លុបការចាត់តាំងនេះ?"
              onConfirm={() => handleDelete(record.id)}
              okText="លុប"
              cancelText="បោះបង់"
            >
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <HorizontalLayout>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            ចាត់តាំងម៉ង់ទ័រទៅសាលារៀន
            <br />
            <Text type="secondary" style={{ fontSize: 16 }}>
              Assign Mentors to Schools for Subjects
            </Text>
          </Title>
        </div>

        {/* Filters and Actions */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសម៉ង់ទ័រ (Select Mentor)"
                allowClear
                loading={loadingMentors}
                onChange={(value) => setSelectedMentor(value || "")}
                value={selectedMentor || undefined}
              >
                {mentors.map((mentor) => (
                  <Option key={mentor.id} value={mentor.id.toString()}>
                    {mentor.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសសាលារៀន (Select School)"
                allowClear
                loading={loadingSchools}
                onChange={(value) => setSelectedSchool(value || "")}
                value={selectedSchool || undefined}
              >
                {schools.map((school) => (
                  <Option key={school.id} value={school.id.toString()}>
                    {school.school_name} ({school.province})
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសមុខវិជ្ជា (Select Subject)"
                allowClear
                onChange={(value) => setSelectedSubject(value || "")}
                value={selectedSubject || undefined}
              >
                <Option value="Language">ភាសា (Language)</Option>
                <Option value="Math">គណិតវិទ្យា (Math)</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសស្ថានភាព (Select Status)"
                allowClear
                onChange={(value) => setSelectedStatus(value || "")}
                value={selectedStatus || undefined}
              >
                <Option value="true">សកម្ម (Active)</Option>
                <Option value="false">អសកម្ម (Inactive)</Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: 16 }}>
            <Col span={24}>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreate}
                >
                  បង្កើតការចាត់តាំងថ្មី (Create Assignment)
                </Button>
                <Button onClick={fetchAssignments}>
                  ផ្ទុកឡើងវិញ (Refresh)
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Table */}
        <Card>
          <Table
            columns={columns}
            dataSource={assignments}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              onChange: (page) => {
                setPagination((prev) => ({ ...prev, page }));
              },
              showSizeChanger: false,
              showTotal: (total) => `សរុប ${total} ការចាត់តាំង`,
            }}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          title={
            editingAssignment
              ? "កែប្រែការចាត់តាំងម៉ង់ទ័រ (Edit Assignment)"
              : "បង្កើតការចាត់តាំងថ្មី (Create Assignment)"
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              is_active: true,
            }}
          >
            <Form.Item
              name="mentor_id"
              label="ជ្រើសរើសម៉ង់ទ័រ (Select Mentor)"
              rules={[{ required: true, message: "សូមជ្រើសរើសម៉ង់ទ័រ" }]}
            >
              <Select
                placeholder="ជ្រើសរើសម៉ង់ទ័រ"
                loading={loadingMentors}
                disabled={!!editingAssignment}
                showSearch
                optionFilterProp="children"
              >
                {mentors.map((mentor) => (
                  <Option key={mentor.id} value={mentor.id}>
                    {mentor.name} ({mentor.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="pilot_school_id"
              label="ជ្រើសរើសសាលារៀន (Select School)"
              rules={[{ required: true, message: "សូមជ្រើសរើសសាលារៀន" }]}
            >
              <Select
                placeholder="ជ្រើសរើសសាលារៀន"
                loading={loadingSchools}
                disabled={!!editingAssignment}
                showSearch
                optionFilterProp="children"
              >
                {schools.map((school) => (
                  <Option key={school.id} value={school.id}>
                    {school.school_name} - {school.province}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="subject"
              label="ជ្រើសរើសមុខវិជ្ជា (Select Subject)"
              rules={[{ required: true, message: "សូមជ្រើសរើសមុខវិជ្ជា" }]}
            >
              <Select placeholder="ជ្រើសរើសមុខវិជ្ជា" disabled={!!editingAssignment}>
                <Option value="Language">ភាសា (Language)</Option>
                <Option value="Math">គណិតវិទ្យា (Math)</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="កំណត់ចំណាំ (Notes)">
              <Input.TextArea
                rows={3}
                placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម (ប្រសិនបើមាន)"
              />
            </Form.Item>

            {editingAssignment && (
              <Form.Item
                name="is_active"
                label="ស្ថានភាព (Status)"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>សកម្ម (Active)</Option>
                  <Option value={false}>អសកម្ម (Inactive)</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {editingAssignment ? "រក្សាទុក (Save)" : "បង្កើត (Create)"}
                </Button>
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                >
                  បោះបង់ (Cancel)
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HorizontalLayout>
  );
}

export default function MentorAssignmentsPage() {
  return <MentorAssignmentsPageContent />;
}
