"use client";
import { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  Space,
  Table,
  Input,
  message,
  Spin,
  Tag,
  Empty,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Teacher {
  id: number;
  name: string;
  email: string;
  role: string;
  province: string;
}

interface TeacherAssignment {
  id: number;
  teacher_id: number;
  teacher: Teacher;
  subject: string;
  assigned_date: string;
  is_active: boolean;
  notes?: string;
}

interface TeacherAssignmentModalProps {
  visible: boolean;
  schoolId: number;
  schoolName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TeacherAssignmentModal({
  visible,
  schoolId,
  schoolName,
  onClose,
  onSuccess,
}: TeacherAssignmentModalProps) {
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTeachers, setFetchingTeachers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (visible) {
      fetchTeachers();
      fetchAssignments();
    }
  }, [visible, schoolId]);

  const fetchTeachers = async () => {
    try {
      setFetchingTeachers(true);
      const response = await fetch(
        `/api/users?role=teacher&limit=1000`
      );
      if (!response.ok) throw new Error("Failed to fetch teachers");
      const data = await response.json();
      setTeachers(data.data || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      message.error("មិនអាចផ្ទុកលេខយល់ដឹងបានទេ");
    } finally {
      setFetchingTeachers(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/teacher-assignments?pilot_school_id=${schoolId}&limit=1000`
      );
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setAssignments(data.data || []);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      message.error("មិនអាចផ្ទុកការចាត់តាំងបានទេ");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeacher = async (values: any) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/teacher-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          pilot_school_id: schoolId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign teacher");
      }

      message.success("បានចាត់តាំងគ្រូបង្រៀនដោយជោគជ័យ");
      form.resetFields();
      fetchAssignments();
    } catch (error: any) {
      console.error("Error assigning teacher:", error);
      message.error(error.message || "មិនអាចចាត់តាំងគ្រូបង្រៀនបានទេ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      const response = await fetch(
        `/api/teacher-assignments?id=${assignmentId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete assignment");
      }

      message.success("បានលុបការចាត់តាំងដោយជោគជ័យ");
      fetchAssignments();
    } catch (error: any) {
      console.error("Error deleting assignment:", error);
      message.error(error.message || "មិនអាចលុបការចាត់តាំងបានទេ");
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<TeacherAssignment> = [
    {
      title: "គ្រូបង្រៀន",
      key: "teacher",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.teacher.name}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.teacher.email}
          </div>
        </div>
      ),
    },
    {
      title: "មុខវិជ្ជា",
      dataIndex: "subject",
      key: "subject",
      render: (subject: string) => (
        <Tag color={subject === "Language" ? "blue" : "green"}>{subject}</Tag>
      ),
    },
    {
      title: "ស្ថានភាព",
      key: "status",
      render: (_, record) => (
        <Tag color={record.is_active ? "green" : "red"}>
          {record.is_active ? "សកម្ម" : "អសកម្ម"}
        </Tag>
      ),
    },
    {
      title: "បានចាត់តាំង",
      dataIndex: "assigned_date",
      key: "assigned_date",
      render: (date: string) => new Date(date).toLocaleDateString("km-KH"),
    },
    {
      title: "សកម្មភាព",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteAssignment(record.id)}
        >
          លុប
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`ចាត់តាំងគ្រូបង្រៀន - ${schoolName}`}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          បិទ
        </Button>,
      ]}
    >
      <Spin spinning={loading || fetchingTeachers}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Add Teacher Form */}
          <div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
            <h3 style={{ margin: "0 0 16px 0" }}>
              <UserAddOutlined /> បន្ថែមគ្រូបង្រៀនថ្មី
            </h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddTeacher}
              size="middle"
            >
              <Form.Item
                label="ស្វែងរក & ជ្រើសរើសគ្រូបង្រៀន"
                name="teacher_id"
                rules={[
                  {
                    required: true,
                    message: "សូមជ្រើសរើសគ្រូបង្រៀន",
                  },
                ]}
              >
                <Select
                  placeholder="វាយបញ្ចូលឈ្មោះ ឬអ៊ីមែល"
                  showSearch
                  filterOption={false}
                  onSearch={setSearchTerm}
                  loading={fetchingTeachers}
                >
                  {filteredTeachers.map((teacher) => (
                    <Select.Option key={teacher.id} value={teacher.id}>
                      <div>
                        <strong>{teacher.name}</strong>
                        <br />
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {teacher.email}
                        </span>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="មុខវិជ្ជា"
                name="subject"
                rules={[
                  {
                    required: true,
                    message: "សូមជ្រើសរើសមុខវិជ្ជា",
                  },
                ]}
              >
                <Select placeholder="ជ្រើសរើសមុខវិជ្ជា">
                  <Select.Option value="Language">ភាសា</Select.Option>
                  <Select.Option value="Math">គណិតវិទ្យា</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="ចំណាំ (ស្Choice)"
                name="notes"
              >
                <Input.TextArea rows={2} placeholder="ចំណាំលម្អិត..." />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
              >
                <CheckCircleOutlined /> ចាត់តាំង
              </Button>
            </Form>
          </div>

          <Divider style={{ margin: "16px 0" }} />

          {/* Existing Assignments */}
          <div>
            <h3 style={{ margin: "0 0 16px 0" }}>
              គ្រូបង្រៀនដែលបានចាត់តាំង ({assignments.length})
            </h3>
            {assignments.length === 0 ? (
              <Empty description="មិនមានការចាត់តាំង" />
            ) : (
              <Table
                columns={columns}
                dataSource={assignments}
                rowKey="id"
                pagination={false}
                size="small"
              />
            )}
          </div>
        </Space>
      </Spin>
    </Modal>
  );
}
