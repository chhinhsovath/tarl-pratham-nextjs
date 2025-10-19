"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Row,
  Col,
  Breadcrumb,
  Typography,
  Divider,
  Switch
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  HomeOutlined,
  BankOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import HorizontalLayout from "@/components/layout/HorizontalLayout";
import Link from "next/link";

const { Option } = Select;
const { Title } = Typography;

// Only working with these two provinces for TaRL program
const PROVINCES = [
  "កំពង់ចាម", // Kampong Cham
  "បាត់ដំបង"  // Battambang
];

const { RangePicker } = DatePicker;

function CreateSchoolPageContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check permissions - only admin and coordinator can create schools
    const canCreate = session.user.role === "admin" || session.user.role === "coordinator";

    if (!canCreate) {
      message.error("អ្នកមិនមានសិទ្ធិបង្កើតសាលារៀនទេ");
      router.push("/schools");
      return;
    }
  }, [session, status, router]);

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      // Transform date ranges to separate start/end dates
      const formattedValues: any = {
        school_name: values.school_name,
        school_code: values.school_code,
        province: values.province,
        district: values.district,
        cluster: values.cluster,
        cluster_id: values.cluster_id || null,
      };

      // Handle baseline dates
      if (values.baseline_dates && values.baseline_dates.length === 2) {
        formattedValues.baseline_start_date = values.baseline_dates[0].toISOString();
        formattedValues.baseline_end_date = values.baseline_dates[1].toISOString();
      }

      // Handle midline dates
      if (values.midline_dates && values.midline_dates.length === 2) {
        formattedValues.midline_start_date = values.midline_dates[0].toISOString();
        formattedValues.midline_end_date = values.midline_dates[1].toISOString();
      }

      // Handle endline dates
      if (values.endline_dates && values.endline_dates.length === 2) {
        formattedValues.endline_start_date = values.endline_dates[0].toISOString();
        formattedValues.endline_end_date = values.endline_dates[1].toISOString();
      }

      const response = await fetch("/api/pilot-schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formattedValues)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "មិនអាចបង្កើតសាលារៀនបានទេ");
      }

      const data = await response.json();
      message.success("បានបង្កើតសាលារៀនដោយជោគជ័យ");
      router.push("/schools");
    } catch (error: any) {
      console.error("Error creating school:", error);
      message.error(error.message || "មិនអាចបង្កើតសាលារៀនបានទេ");
    } finally {
      setSubmitting(false);
    }
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
          <Link href="/schools">
            <BankOutlined /> សាលារៀន
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <PlusOutlined /> បន្ថែមសាលារៀនថ្មី
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
          បន្ថែមសាលារៀនថ្មី
        </Title>
        <Link href="/schools">
          <Button icon={<ArrowLeftOutlined />}>
            ត្រឡប់ទៅសាលារៀន
          </Button>
        </Link>
      </div>

      {/* Create Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Divider orientation="left">ព័ត៌មានមូលដ្ឋាន</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="school_name"
                label="ឈ្មោះសាលារៀន"
                rules={[
                  { required: true, message: "សូមបញ្ចូលឈ្មោះសាលារៀន" },
                  { min: 3, message: "ឈ្មោះសាលារៀនត្រូវតែមានយ៉ាងតិច ៣ តួអក្សរ" }
                ]}
              >
                <Input placeholder="បញ្ចូលឈ្មោះសាលារៀន" size="large" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="school_code"
                label="លេខកូដសាលារៀន"
                rules={[
                  { required: true, message: "សូមបញ្ចូលលេខកូដសាលារៀន" }
                ]}
              >
                <Input placeholder="បញ្ចូលលេខកូដសាលារៀន (តែមួយគត់)" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="province"
                label="ខេត្ត"
                rules={[
                  { required: true, message: "សូមជ្រើសរើសខេត្ត" }
                ]}
              >
                <Select placeholder="ជ្រើសរើសខេត្ត" size="large" showSearch>
                  {PROVINCES.map(province => (
                    <Option key={province} value={province}>
                      {province}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="district"
                label="ស្រុក/ខណ្ឌ"
                rules={[
                  { required: true, message: "សូមបញ្ចូលស្រុក/ខណ្ឌ" }
                ]}
              >
                <Input placeholder="បញ្ចូលស្រុក/ខណ្ឌ" size="large" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="cluster"
                label="ក្រុម"
                rules={[
                  { required: true, message: "សូមបញ្ចូលក្រុម" }
                ]}
              >
                <Input placeholder="បញ្ចូលក្រុម" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="cluster_id"
                label="លេខសម្គាល់ក្រុម (ជម្រើស)"
              >
                <InputNumber placeholder="បញ្ចូលលេខសម្គាល់ក្រុម" style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">រយៈពេលវាយតម្លៃ (ជម្រើស)</Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="baseline_dates" label="រយៈពេលដំបូង">
                <RangePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="midline_dates" label="រយៈពេលកណ្តាល">
                <RangePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="endline_dates" label="រយៈពេលចុងក្រោយ">
                <RangePicker style={{ width: "100%" }} size="large" />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div style={{ marginTop: "32px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                icon={<SaveOutlined />}
                size="large"
              >
                បង្កើតសាលារៀន
              </Button>
              <Link href="/schools">
                <Button size="large">
                  បោះបង់
                </Button>
              </Link>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default function CreateSchoolPage() {
  return (
    <HorizontalLayout>
      <CreateSchoolPageContent />
    </HorizontalLayout>
  );
}
