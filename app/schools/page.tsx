"use client";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
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
  PhoneOutlined
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";

const { Title } = Typography;
const { Option } = Select;

interface School {
  id: number;
  name: string;
  code: string;
  province_id: number;
  district?: string;
  commune?: string;
  village?: string;
  school_type?: string;
  level?: string;
  total_students?: number;
  total_teachers?: number;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  created_at: string;
  province: {
    id: number;
    name_english: string;
    name_khmer?: string;
    code: string;
  };
  classes: {
    id: number;
    name: string;
    grade: number;
    student_count?: number;
  }[];
}

interface Province {
  id: number;
  name_english: string;
  name_khmer?: string;
  code: string;
}

interface ApiResponse {
  data: School[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const SCHOOL_TYPES = ["Primary", "Secondary", "High School", "Technical", "Vocational"];
const LEVELS = ["Primary", "Lower Secondary", "Upper Secondary", "Mixed"];

function SchoolsPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
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
  const [selectedSchoolType, setSelectedSchoolType] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");

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
    fetchProvinces();
  }, [session, status, pagination.page, searchTerm, selectedProvince, selectedSchoolType, selectedLevel]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (searchTerm) params.append("search", searchTerm);
      if (selectedProvince) params.append("province_id", selectedProvince);
      if (selectedSchoolType) params.append("school_type", selectedSchoolType);
      if (selectedLevel) params.append("level", selectedLevel);

      const response = await fetch(`/api/schools?${params}`);
      if (!response.ok) throw new Error("Failed to fetch schools");
      
      const data: ApiResponse = await response.json();
      setSchools(data.data);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error("Error fetching schools:", error);
      message.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await fetch("/api/provinces");
      if (!response.ok) throw new Error("Failed to fetch provinces");
      
      const data = await response.json();
      setProvinces(data.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
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

      message.success("School deleted successfully");
      fetchSchools();
    } catch (error) {
      console.error("Error deleting school:", error);
      message.error(error instanceof Error ? error.message : "Failed to delete school");
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const columns: ColumnsType<School> = [
    {
      title: "School",
      key: "school",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{record.name}</div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            <Tag color="blue">{record.code}</Tag>
            {record.email && <span>{record.email}</span>}
          </div>
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <EnvironmentOutlined style={{ color: "#1890ff", marginRight: "4px" }} />
            {record.province.name_english}
          </div>
          {record.district && (
            <div style={{ color: "#666", fontSize: "12px" }}>
              {record.district}
              {record.commune && `, ${record.commune}`}
              {record.village && `, ${record.village}`}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Type & Level",
      key: "type_level",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.school_type && <Tag color="green">{record.school_type}</Tag>}
          {record.level && <Tag color="orange">{record.level}</Tag>}
        </Space>
      ),
    },
    {
      title: "Students",
      dataIndex: "total_students",
      key: "total_students",
      render: (count: number, record) => (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 500, fontSize: "16px" }}>
            {count || 0}
          </div>
          <div style={{ color: "#666", fontSize: "12px" }}>
            {record.classes.length} classes
          </div>
        </div>
      ),
      sorter: true,
    },
    {
      title: "Teachers",
      dataIndex: "total_teachers",
      key: "total_teachers",
      render: (count: number) => (
        <div style={{ textAlign: "center", fontWeight: 500 }}>
          {count || 0}
        </div>
      ),
      sorter: true,
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <div>
          {record.phone && (
            <div style={{ marginBottom: "2px" }}>
              <PhoneOutlined style={{ color: "#52c41a", marginRight: "4px" }} />
              {record.phone}
            </div>
          )}
          {record.latitude && record.longitude && (
            <Tooltip title={`Coordinates: ${record.latitude}, ${record.longitude}`}>
              <Tag color="cyan" style={{ fontSize: "10px" }}>GPS</Tag>
            </Tooltip>
          )}
        </div>
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
            <Link href={`/schools/${record.id}/edit`}>
              <Button type="link" icon={<EditOutlined />} size="small">
                Edit
              </Button>
            </Link>
          )}
          {canDelete && (
            <Popconfirm
              title="Delete School"
              description="Are you sure you want to delete this school? This will also affect all associated classes and students."
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

  const schoolStats = {
    total: pagination.total,
    totalStudents: schools.reduce((sum, school) => sum + (school.total_students || 0), 0),
    totalTeachers: schools.reduce((sum, school) => sum + (school.total_teachers || 0), 0),
    totalClasses: schools.reduce((sum, school) => sum + school.classes.length, 0),
  };

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link href="/dashboard">
            <HomeOutlined /> Dashboard
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BankOutlined /> Schools
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
          School Management
        </Title>
        {canCreate && (
          <Link href="/schools/create">
            <Button type="primary" icon={<PlusOutlined />}>
              Add School
            </Button>
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: "24px" }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Schools"
              value={schoolStats.total}
              prefix={<BankOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={schoolStats.totalStudents}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Teachers"
              value={schoolStats.totalTeachers}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Classes"
              value={schoolStats.totalClasses}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: "24px" }}>
        <Space wrap>
          <Input
            placeholder="Search schools..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Select
            placeholder="Filter by province"
            value={selectedProvince}
            onChange={setSelectedProvince}
            style={{ width: 200 }}
            allowClear
            showSearch
          >
            {provinces.map(province => (
              <Option key={province.id} value={province.id.toString()}>
                {province.name_english}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by type"
            value={selectedSchoolType}
            onChange={setSelectedSchoolType}
            style={{ width: 150 }}
            allowClear
          >
            {SCHOOL_TYPES.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by level"
            value={selectedLevel}
            onChange={setSelectedLevel}
            style={{ width: 150 }}
            allowClear
          >
            {LEVELS.map(level => (
              <Option key={level} value={level}>
                {level}
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
              `${range[0]}-${range[1]} of ${total} schools`
            }
          />
        </div>
      </Card>
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
