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

interface Mentor {
  id: number;
  name: string;
  email: string;
  role: string;
  province: string;
}

interface MentorAssignment {
  id: number;
  mentor_id: number;
  mentor: Mentor;
  subject: string;
  assigned_date: string;
  is_active: boolean;
  notes?: string;
}

interface MentorAssignmentModalProps {
  visible: boolean;
  schoolId: number;
  schoolName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MentorAssignmentModal({
  visible,
  schoolId,
  schoolName,
  onClose,
  onSuccess,
}: MentorAssignmentModalProps) {
  const [form] = Form.useForm();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [assignments, setAssignments] = useState<MentorAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMentors, setFetchingMentors] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (visible) {
      fetchMentors();
      fetchAssignments();
    }
  }, [visible, schoolId]);

  const fetchMentors = async () => {
    try {
      setFetchingMentors(true);
      const response = await fetch(
        `/api/users?role=mentor&limit=1000`
      );
      if (!response.ok) throw new Error("Failed to fetch mentors");
      const data = await response.json();
      setMentors(data.data || []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      message.error("មិនអាចផ្ទុកគ្រូព្រឹក្សាគរុកោសល្យបានទេ");
    } finally {
      setFetchingMentors(false);
    }
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/mentor-assignments?pilot_school_id=${schoolId}&limit=1000`
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

  const handleAddMentor = async (values: any) => {
    try {
      setSubmitting(true);
      const response = await fetch("/api/mentor-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          pilot_school_id: schoolId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to assign mentor");
      }

      message.success("បានចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យដោយជោគជ័យ");
      form.resetFields();
      fetchAssignments();
    } catch (error: any) {
      console.error("Error assigning mentor:", error);
      message.error(error.message || "មិនអាចចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យបានទេ");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      const response = await fetch(
        `/api/mentor-assignments?id=${assignmentId}`,
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

  const filteredMentors = mentors.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnsType<MentorAssignment> = [
    {
      title: "គ្រូព្រឹក្សាគរុកោសល្យ",
      key: "mentor",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.mentor.name}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.mentor.email}
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
      title={`ចាត់តាំងគ្រូព្រឹក្សាគរុកោសល្យ - ${schoolName}`}
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          បិទ
        </Button>,
      ]}
    >
      <Spin spinning={loading || fetchingMentors}>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* Add Mentor Form */}
          <div style={{ padding: "16px", background: "#f5f5f5", borderRadius: "4px" }}>
            <h3 style={{ margin: "0 0 16px 0" }}>
              <UserAddOutlined /> បន្ថែមគ្រូព្រឹក្សាគរុកោសល្យថ្មី
            </h3>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddMentor}
              size="middle"
            >
              <Form.Item
                label="ស្វែងរក & ជ្រើសរើសគ្រូព្រឹក្សាគរុកោសល្យ"
                name="mentor_id"
                rules={[
                  {
                    required: true,
                    message: "សូមជ្រើសរើសគ្រូព្រឹក្សាគរុកោសល្យ",
                  },
                ]}
              >
                <Select
                  placeholder="វាយបញ្ចូលឈ្មោះ ឬអ៊ីមែល"
                  showSearch
                  filterOption={false}
                  onSearch={setSearchTerm}
                  loading={fetchingMentors}
                >
                  {filteredMentors.map((mentor) => (
                    <Select.Option key={mentor.id} value={mentor.id}>
                      <div>
                        <strong>{mentor.name}</strong>
                        <br />
                        <span style={{ color: "#999", fontSize: "12px" }}>
                          {mentor.email}
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
              គ្រូព្រឹក្សាគរុកោសល្យដែលបានចាត់តាំង ({assignments.length})
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
