"use client";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import TeacherAssignmentModal from "@/components/modals/TeacherAssignmentModal";
import MentorAssignmentModal from "@/components/modals/MentorAssignmentModal";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  HomeOutlined,
  BankOutlined,
  EnvironmentOutlined,
  UserAddOutlined,
  TeamOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

const { Title } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  cluster: string;
  cluster_id?: number | null;
  baseline_start_date?: string | null;
  baseline_end_date?: string | null;
  midline_start_date?: string | null;
  midline_end_date?: string | null;
  endline_start_date?: string | null;
  endline_end_date?: string | null;
  is_locked: boolean;
  created_at: string;
  updated_at?: string;
}

interface ApiResponse {
  data: PilotSchool[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const PROVINCES = ["កំពង់ចាម", "បាត់ដំបង"]; // TaRL program provinces

function SchoolsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  // Modal states
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [mentorModalVisible, setMentorModalVisible] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<PilotSchool | null>(null);

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

    fetchSchools();
  }, [session, status, pagination.page, searchTerm, selectedProvince]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedProvince) params.append("province_id", selectedProvince);

      const response = await fetch(`/api/schools?${params}`);
      if (!response.ok) throw new Error("Failed to fetch schools");

      const data: ApiResponse = await response.json();
      setSchools(data.data);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Error fetching schools:", error);
      message.error("មិនអាចផ្ទុកសាលារៀនបានទេ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (schoolId: number) => {
    try {
      const response = await fetch(`/api/schools?id=${schoolId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete school");
      }

      message.success("លុបសាលារៀនបានជោគជ័យ");
      fetchSchools();
    } catch (error) {
      console.error("Error deleting school:", error);
      message.error(error instanceof Error ? error.message : "មិនអាចលុបសាលារៀនបានទេ");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const columns: ColumnsType<PilotSchool> = [
    {
      title: "សាលារៀន",
      key: "school",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{record.school_name}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            <Tag color="blue">{record.school_code}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "ទីតាំង",
      key: "location",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <EnvironmentOutlined style={{ color: "#1890ff", marginRight: "4px" }} />
            {record.province}
          </div>
          {record.district && (
            <div style={{ color: "#666", fontSize: "12px" }}>
              {record.district}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "ក្រុម",
      key: "cluster",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.cluster}</div>
          {record.cluster_id && (
            <div style={{ color: "#666", fontSize: "12px" }}>
              លេខសម្គាល់: {record.cluster_id}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "រយៈពេលវាយតម្លៃ",
      key: "assessment_periods",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.baseline_start_date && (
            <Tag color="blue">ដំបូង</Tag>
          )}
          {record.midline_start_date && (
            <Tag color="orange">កណ្តាល</Tag>
          )}
          {record.endline_start_date && (
            <Tag color="green">ចុងក្រោយ</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "ស្ថានភាព",
      key: "status",
      render: (_, record) => (
        <Tag color={record.is_locked ? "red" : "green"}>
          {record.is_locked ? "ជាប់សោ" : "សកម្ម"}
        </Tag>
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
      width: 280,
      render: (_, record) => (
        <Space size="small" wrap>
          {canEdit && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<UserAddOutlined />}
                onClick={() => {
                  setSelectedSchool(record);
                  setTeacherModalVisible(true);
                }}
              >
                គ្រូ
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<TeamOutlined />}
                onClick={() => {
                  setSelectedSchool(record);
                  setMentorModalVisible(true);
                }}
              >
                ព្រឹក្សា
              </Button>
              <Link href={`/schools/${record.id}/edit`}>
                <Button type="link" icon={<EditOutlined />} size="small">
                  កែប្រែ
                </Button>
              </Link>
            </>
          )}
          {canDelete && (
            <Popconfirm
              title="លុបសាលារៀន"
              description="តើអ្នកប្រាកដជាចង់លុបសាលារៀននេះមែនទេ? នេះនឹងប៉ះពាល់ដល់សិស្ស និងគ្រូបង្រៀនទាំងអស់ផងដែរ។"
              onConfirm={() => handleDelete(record.id)}
              okText="បាទ/ចាស"
              cancelText="ទេ"
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

  const schoolStats = {
    total: pagination.total,
    totalClusters: new Set(schools.map(s => s.cluster)).size,
    totalProvinces: new Set(schools.map(s => s.province)).size,
    lockedSchools: schools.filter(s => s.is_locked).length,
  };

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
          <BankOutlined /> សាលារៀន
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
          គ្រប់គ្រងសាលារៀន
        </Title>
        {canCreate && (
          <Link href="/schools/create">
            <Button type="primary" icon={<PlusOutlined />}>
              បន្ថែមសាលារៀនថ្មី
            </Button>
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="សាលារៀនសរុប"
              value={schoolStats.total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="ក្រុមសរុប"
              value={schoolStats.totalClusters}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="ខេត្តសរុប"
              value={schoolStats.totalProvinces}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="សាលាជាប់សោ"
              value={schoolStats.lockedSchools}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Input
            placeholder="ស្វែងរកសាលារៀន..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="ច្រោះតាមខេត្ត"
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

      {/* Schools Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={schools}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1400 }}
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
              `${range[0]}-${range[1]} នៃ ${total} សាលារៀន`
            }
          />
        </div>
      </Card>

      {/* Modals */}
      {selectedSchool && (
        <>
          <TeacherAssignmentModal
            visible={teacherModalVisible}
            schoolId={selectedSchool.id}
            schoolName={selectedSchool.school_name}
            onClose={() => setTeacherModalVisible(false)}
            onSuccess={() => {
              setTeacherModalVisible(false);
              fetchSchools();
            }}
          />
          <MentorAssignmentModal
            visible={mentorModalVisible}
            schoolId={selectedSchool.id}
            schoolName={selectedSchool.school_name}
            onClose={() => setMentorModalVisible(false)}
            onSuccess={() => {
              setMentorModalVisible(false);
              fetchSchools();
            }}
          />
        </>
      )}
    </div>
  );
}
export default function SchoolsPage() {
  return (
    <HorizontalLayout>
      <SchoolsPageContent />
    </HorizontalLayout>
  );
}
