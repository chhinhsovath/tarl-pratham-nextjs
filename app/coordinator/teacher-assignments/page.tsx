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

interface Teacher {
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
  teacher_id: number;
  pilot_school_id: number;
  subject: string;
  assigned_date: string;
  is_active: boolean;
  notes?: string;
  teacher: Teacher;
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

function TeacherAssignmentsPageContent() {
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
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dropdown data
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
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
    fetchTeachers();
    fetchSchools();
  }, [session, status, pagination.page, selectedTeacher, selectedSchool, selectedSubject, selectedStatus]);

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (selectedTeacher) params.append("teacher_id", selectedTeacher);
      if (selectedSchool) params.append("pilot_school_id", selectedSchool);
      if (selectedSubject) params.append("subject", selectedSubject);
      if (selectedStatus) params.append("is_active", selectedStatus);

      const url = `/api/teacher-assignments?${params}`;
      console.log("📡 Fetching teacher assignments from:", url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        throw new Error(errorData.error || "Failed to fetch assignments");
      }

      const data: ApiResponse = await response.json();
      console.log("✅ Received data:", data);
      console.log("📊 Assignments count:", data.data?.length || 0);
      console.log("📄 Pagination:", data.pagination);

      setAssignments(data.data || []);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("💥 Error fetching assignments:", error);
      message.error(error instanceof Error ? error.message : "មានបញ្ហាក្នុងការទាញយកទិន្នន័យ");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    setLoadingTeachers(true);
    try {
      const response = await fetch("/api/users?role=teacher&limit=1000");
      if (!response.ok) throw new Error("Failed to fetch teachers");

      const data = await response.json();
      setTeachers(data.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    } finally {
      setLoadingTeachers(false);
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
      teacher_id: assignment.teacher_id,
      pilot_school_id: assignment.pilot_school_id,
      subject: assignment.subject,
      notes: assignment.notes,
      is_active: assignment.is_active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/teacher-assignments?id=${id}`, {
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

  const handleSubmit = async (values: any, keepOpen: boolean = false) => {
    setSubmitting(true);
    try {
      // If editing, single update
      if (editingAssignment) {
        const response = await fetch("/api/teacher-assignments", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: editingAssignment.id, ...values }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update assignment");
        }

        message.success("បានកែប្រែការចាត់តាំងដោយជោគជ័យ");
        setIsModalVisible(false);
        form.resetFields();
        fetchAssignments();
        return;
      }

      // Creating new assignments: support multiple schools and subjects
      const schoolIds = Array.isArray(values.pilot_school_id)
        ? values.pilot_school_id
        : [values.pilot_school_id];

      const subjects = Array.isArray(values.subject)
        ? values.subject
        : [values.subject];

      // Create all combinations of schools × subjects
      const assignments = [];
      for (const schoolId of schoolIds) {
        for (const subject of subjects) {
          assignments.push({
            teacher_id: values.teacher_id,
            pilot_school_id: schoolId,
            subject: subject,
            notes: values.notes,
          });
        }
      }

      // Create all assignments
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];

      for (const assignment of assignments) {
        try {
          const response = await fetch("/api/teacher-assignments", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assignment),
          });

          if (!response.ok) {
            const error = await response.json();
            errors.push(error.error || "Failed to create assignment");
            errorCount++;
          } else {
            successCount++;
          }
        } catch (error) {
          errorCount++;
          errors.push(error instanceof Error ? error.message : "Unknown error");
        }
      }

      // Show result message
      if (successCount > 0) {
        message.success(`បានបង្កើតការចាត់តាំង ${successCount} ដោយជោគជ័យ`);
      }
      if (errorCount > 0) {
        message.error(`មានបញ្ហា ${errorCount} ការចាត់តាំង: ${errors.join(", ")}`);
      }

      fetchAssignments();

      if (keepOpen) {
        // Keep modal open, reset schools and subjects but keep teacher
        const teacherId = form.getFieldValue('teacher_id');
        form.resetFields();
        form.setFieldsValue({ teacher_id: teacherId });
      } else {
        setIsModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error saving assignment:", error);
      message.error(error instanceof Error ? error.message : "មានបញ្ហាក្នុងការរក្សាទុក");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnsType<Assignment> = [
    {
      title: "គ្រូបង្រៀន",
      dataIndex: ["teacher", "name"],
      key: "teacher_name",
      render: (text: string, record: Assignment) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.teacher.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "សាលារៀន",
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
      title: "មុខវិជ្ជា",
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
      title: "ស្ថានភាព",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "សកម្ម" : "អសកម្ម"}
        </Tag>
      ),
    },
    {
      title: "កាលបរិច្ឆេទចាត់តាំង",
      dataIndex: "assigned_date",
      key: "assigned_date",
      render: (date: string) => new Date(date).toLocaleDateString("km-KH"),
    },
    {
      title: "សកម្មភាព",
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
            ចាត់តាំងគ្រូបង្រៀន
          </Title>
        </div>

        {/* Filters and Actions */}
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសគ្រូបង្រៀន"
                allowClear
                loading={loadingTeachers}
                onChange={(value) => setSelectedTeacher(value || "")}
                value={selectedTeacher || undefined}
              >
                {teachers.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសសាលារៀន"
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
                placeholder="ជ្រើសរើសមុខវិជ្ជា"
                allowClear
                onChange={(value) => setSelectedSubject(value || "")}
                value={selectedSubject || undefined}
              >
                <Option value="Language">ភាសា</Option>
                <Option value="Math">គណិតវិទ្យា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="ជ្រើសរើសស្ថានភាព"
                allowClear
                onChange={(value) => setSelectedStatus(value || "")}
                value={selectedStatus || undefined}
              >
                <Option value="true">សកម្ម</Option>
                <Option value="false">អសកម្ម</Option>
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
                  បង្កើតការចាត់តាំងថ្មី
                </Button>
                <Button onClick={fetchAssignments}>
                  ផ្ទុកឡើងវិញ
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
            locale={{
              emptyText: (
                <div style={{ padding: "40px", textAlign: "center" }}>
                  <UserOutlined style={{ fontSize: 48, color: "#d9d9d9", marginBottom: 16 }} />
                  <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>
                    មិនមានការចាត់តាំងគ្រូបង្រៀន
                  </div>
                  <div style={{ fontSize: 14, color: "#999" }}>
                    សូមចុចប៊ូតុង "បង្កើតការចាត់តាំងថ្មី" ដើម្បីចាត់តាំងគ្រូបង្រៀនទៅសាលារៀន
                  </div>
                </div>
              ),
            }}
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
              ? "កែប្រែការចាត់តាំងគ្រូបង្រៀន"
              : "បង្កើតការចាត់តាំងថ្មី"
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
              name="teacher_id"
              label="ជ្រើសរើសគ្រូបង្រៀន"
              rules={[{ required: true, message: "សូមជ្រើសរើសគ្រូបង្រៀន" }]}
            >
              <Select
                placeholder="ជ្រើសរើសគ្រូបង្រៀន"
                loading={loadingTeachers}
                disabled={!!editingAssignment}
                showSearch
                optionFilterProp="children"
              >
                {teachers.map((teacher) => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="pilot_school_id"
              label={editingAssignment ? "សាលារៀន" : "ជ្រើសរើសសាលារៀន (អាចជ្រើសបានច្រើន)"}
              rules={[{ required: true, message: "សូមជ្រើសរើសសាលារៀន" }]}
            >
              <Select
                mode={editingAssignment ? undefined : "multiple"}
                placeholder="ជ្រើសរើសសាលារៀន"
                loading={loadingSchools}
                disabled={!!editingAssignment}
                showSearch
                optionFilterProp="children"
                maxTagCount="responsive"
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
              label={editingAssignment ? "មុខវិជ្ជា" : "ជ្រើសរើសមុខវិជ្ជា (អាចជ្រើសបានច្រើន)"}
              rules={[{ required: true, message: "សូមជ្រើសរើសមុខវិជ្ជា" }]}
            >
              <Select
                mode={editingAssignment ? undefined : "multiple"}
                placeholder="ជ្រើសរើសមុខវិជ្ជា"
                disabled={!!editingAssignment}
                maxTagCount="responsive"
              >
                <Option value="Language">ភាសា</Option>
                <Option value="Math">គណិតវិទ្យា</Option>
              </Select>
            </Form.Item>

            <Form.Item name="notes" label="កំណត់ចំណាំ">
              <Input.TextArea
                rows={3}
                placeholder="បញ្ចូលកំណត់ចំណាំបន្ថែម (ប្រសិនបើមាន)"
              />
            </Form.Item>

            {editingAssignment && (
              <Form.Item
                name="is_active"
                label="ស្ថានភាព"
                valuePropName="checked"
              >
                <Select>
                  <Option value={true}>សកម្ម</Option>
                  <Option value={false}>អសកម្ម</Option>
                </Select>
              </Form.Item>
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  {editingAssignment ? "រក្សាទុក" : "រក្សាទុក"}
                </Button>
                {!editingAssignment && (
                  <Button
                    type="default"
                    loading={submitting}
                    onClick={() => {
                      form.validateFields().then((values) => {
                        handleSubmit(values, true);
                      }).catch((error) => {
                        console.error("Validation failed:", error);
                      });
                    }}
                  >
                    រក្សាទុក និងបន្ថែមទៀត
                  </Button>
                )}
                <Button
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                  }}
                  disabled={submitting}
                >
                  បោះបង់
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HorizontalLayout>
  );
}

export default function TeacherAssignmentsPage() {
  return <TeacherAssignmentsPageContent />;
}
