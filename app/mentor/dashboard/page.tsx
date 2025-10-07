"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Typography,
  Timeline,
  Badge,
  Spin,
  Alert,
  Button,
  Select,
  Divider,
} from "antd";
import {
  BankOutlined,
  UserOutlined,
  FileTextOutlined,
  EyeOutlined,
  BookOutlined,
  CalendarOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface SchoolAssignment {
  assignment: {
    id: number;
    pilot_school_id: number;
    subject: string;
    assigned_date: string;
    pilot_school: {
      id: number;
      school_name: string;
      school_code: string;
      province: string;
      district: string;
      cluster: string;
    };
  };
  stats: {
    student_count: number;
    language_assessments: number;
    math_assessments: number;
    total_assessments: number;
    recent_visits: number;
  };
}

interface DashboardData {
  mentor: {
    id: number;
    name: string;
    email: string;
  };
  assignments: {
    total: number;
    schools: number;
    subjects: string[];
    language_schools: number;
    math_schools: number;
    details: SchoolAssignment[];
  };
  summary: {
    total_students: number;
    total_assessments: number;
    total_visits: number;
    pending_verifications: number;
  };
  recent_activities: Array<{
    type: string;
    description: string;
    school: string;
    user: string;
    created_at: string;
  }>;
  recent_visits: any[];
}

function MentorDashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [selectedSchool, setSelectedSchool] = useState<number | "all">("all");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    if (session.user.role !== "mentor") {
      router.push("/unauthorized");
      return;
    }

    fetchDashboardData();
  }, [session, status]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/dashboard/mentor");
      if (!response.ok) throw new Error("Failed to fetch dashboard data");

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <HorizontalLayout>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  if (!dashboardData) {
    return (
      <HorizontalLayout>
        <Alert
          message="មិនអាចទាញយកទិន្នន័យបាន"
          description="សូមព្យាយាមម្តងទៀត"
          type="error"
          showIcon
        />
      </HorizontalLayout>
    );
  }

  // Filter data by selected school
  const filteredAssignments =
    selectedSchool === "all"
      ? dashboardData.assignments.details
      : dashboardData.assignments.details.filter(
          (a) => a.assignment.pilot_school_id === selectedSchool
        );

  const filteredActivities =
    selectedSchool === "all"
      ? dashboardData.recent_activities
      : dashboardData.recent_activities.filter((a) => {
          const assignment = dashboardData.assignments.details.find(
            (detail) => detail.assignment.pilot_school.school_name === a.school
          );
          return assignment?.assignment.pilot_school_id === selectedSchool;
        });

  const columns: ColumnsType<SchoolAssignment> = [
    {
      title: "សាលារៀន (School)",
      dataIndex: ["assignment", "pilot_school", "school_name"],
      key: "school_name",
      render: (text: string, record: SchoolAssignment) => (
        <Space direction="vertical" size={0}>
          <Text strong>
            <BankOutlined /> {text}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.assignment.pilot_school.province} -{" "}
            {record.assignment.pilot_school.district}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            កូដ: {record.assignment.pilot_school.school_code}
          </Text>
        </Space>
      ),
    },
    {
      title: "មុខវិជ្ជា (Subject)",
      dataIndex: ["assignment", "subject"],
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
      title: "សិស្ស (Students)",
      dataIndex: ["stats", "student_count"],
      key: "student_count",
      render: (count: number) => (
        <Statistic
          value={count}
          prefix={<TeamOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
      ),
    },
    {
      title: "ការវាយតម្លៃ (Assessments)",
      dataIndex: ["stats", "total_assessments"],
      key: "total_assessments",
      render: (_: any, record: SchoolAssignment) => (
        <Space direction="vertical" size={0}>
          <Text>
            <FileTextOutlined /> សរុប: {record.stats.total_assessments}
          </Text>
          {record.assignment.subject === "Language" && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              ភាសា: {record.stats.language_assessments}
            </Text>
          )}
          {record.assignment.subject === "Math" && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              គណិត: {record.stats.math_assessments}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "ទស្សនកិច្ច (Visits)",
      dataIndex: ["stats", "recent_visits"],
      key: "recent_visits",
      render: (count: number) => (
        <Statistic
          value={count}
          prefix={<EyeOutlined />}
          valueStyle={{ fontSize: 16 }}
        />
      ),
    },
    {
      title: "ចាប់ផ្តើម (Assigned)",
      dataIndex: ["assignment", "assigned_date"],
      key: "assigned_date",
      render: (date: string) => (
        <Text type="secondary">{dayjs(date).format("DD/MM/YYYY")}</Text>
      ),
    },
  ];

  return (
    <HorizontalLayout>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            តារាងត្រួតពិនិត្យម៉ង់ទ័រ
            <br />
            <Text type="secondary" style={{ fontSize: 16 }}>
              Mentor Dashboard
            </Text>
          </Title>
          <Paragraph>
            សួស្តី {dashboardData.mentor.name}! អ្នកត្រូវបានចាត់តាំងឱ្យណែនាំ{" "}
            {dashboardData.assignments.schools} សាលារៀន
          </Paragraph>
        </div>

        {/* Summary Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សាលារៀនទាំងអស់ (Total Schools)"
                value={dashboardData.assignments.schools}
                prefix={<BankOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="សិស្សទាំងអស់ (Total Students)"
                value={dashboardData.summary.total_students}
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ការវាយតម្លៃ (Assessments)"
                value={dashboardData.summary.total_assessments}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="ទស្សនកិច្ច (Visits)"
                value={dashboardData.summary.total_visits}
                prefix={<EyeOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Subject Badges */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="មុខវិជ្ជាទទួលបន្ទុក (Your Subject Responsibilities)">
              <Space size="large">
                <div>
                  <Tag
                    icon={<BookOutlined />}
                    color="blue"
                    style={{ fontSize: 14, padding: "4px 12px" }}
                  >
                    ភាសា (Language): {dashboardData.assignments.language_schools}{" "}
                    សាលា
                  </Tag>
                </div>
                <div>
                  <Tag
                    icon={<BookOutlined />}
                    color="green"
                    style={{ fontSize: 14, padding: "4px 12px" }}
                  >
                    គណិតវិទ្យា (Math): {dashboardData.assignments.math_schools}{" "}
                    សាលា
                  </Tag>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* School Filter */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Card size="small">
              <Space>
                <Text strong>ជ្រើសរើសសាលារៀន (Select School):</Text>
                <Select
                  value={selectedSchool}
                  onChange={setSelectedSchool}
                  style={{ minWidth: 250 }}
                >
                  <Option value="all">សាលារៀនទាំងអស់ (All Schools)</Option>
                  {dashboardData.assignments.details.map((detail) => (
                    <Option
                      key={detail.assignment.pilot_school_id}
                      value={detail.assignment.pilot_school_id}
                    >
                      {detail.assignment.pilot_school.school_name}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Assigned Schools Table */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Card title="សាលារៀនទទួលបន្ទុក (Assigned Schools)">
              <Table
                columns={columns}
                dataSource={filteredAssignments}
                rowKey={(record) => record.assignment.id}
                pagination={false}
              />
            </Card>
          </Col>
        </Row>

        {/* Recent Activities and Visits */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card
              title="សកម្មភាពថ្មីៗ (Recent Activities)"
              extra={
                <Badge
                  count={filteredActivities.length}
                  style={{ backgroundColor: "#52c41a" }}
                />
              }
            >
              <Timeline
                items={filteredActivities.slice(0, 10).map((activity) => ({
                  color:
                    activity.type === "student_added" ? "blue" : "purple",
                  children: (
                    <div>
                      <Text strong>{activity.description}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {activity.school} • {activity.user}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <ClockCircleOutlined />{" "}
                        {dayjs(activity.created_at).fromNow()}
                      </Text>
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="ទស្សនកិច្ចថ្មីៗ (Recent Visits)"
              extra={
                <Button type="link" href="/mentoring-visits">
                  មើលទាំងអស់
                </Button>
              }
            >
              <Timeline
                items={dashboardData.recent_visits.slice(0, 5).map((visit) => ({
                  color: "green",
                  children: (
                    <div>
                      <Text strong>
                        {visit.pilot_school?.school_name || "Unknown School"}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {visit.mentor?.name || "Unknown Mentor"} •{" "}
                        {dayjs(visit.visit_date).format("DD/MM/YYYY")}
                      </Text>
                      {visit.observation && (
                        <>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {visit.observation.substring(0, 100)}...
                          </Text>
                        </>
                      )}
                    </div>
                  ),
                }))}
              />
            </Card>
          </Col>
        </Row>

        {/* Pending Items Alert */}
        {dashboardData.summary.pending_verifications > 0 && (
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Alert
                message="ការវាយតម្លៃរង់ចាំផ្ទៀងផ្ទាត់ (Pending Verifications)"
                description={`មានការវាយតម្លៃ ${dashboardData.summary.pending_verifications} ដែលកំពុងរង់ចាំផ្ទៀងផ្ទាត់`}
                type="warning"
                showIcon
                icon={<ClockCircleOutlined />}
                action={
                  <Button size="small" type="primary" href="/assessments/verify">
                    ផ្ទៀងផ្ទាត់ឥឡូវនេះ
                  </Button>
                }
              />
            </Col>
          </Row>
        )}
      </div>
    </HorizontalLayout>
  );
}

export default function MentorDashboardPage() {
  return <MentorDashboardContent />;
}
