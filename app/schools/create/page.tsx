"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  Breadcrumb,
  Typography
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

const PROVINCES = [
  "បន្ទាយមានជ័យ", "បាត់ដំបង", "កំពង់ចាម", "កំពង់ឆ្នាំង",
  "កំពង់ស្ពឺ", "កំពង់ធំ", "កំពត", "កណ្តាល", "កែប", "កោះកុង",
  "ក្រចេះ", "មណ្ឌលគិរី", "ឧត្តរមានជ័យ", "ប៉ៃលិន", "ភ្នំពេញ",
  "ព្រះវិហារ", "ព្រៃវែង", "ពោធិ៍សាត់", "រតនគិរី", "សៀមរាប",
  "ព្រះសីហនុ", "ស្ទឹងត្រែង", "ស្វាយរៀង", "តាកែវ", "ត្បូងឃ្មុំ"
];

// Note: school_type is not used in pilot_schools table
// PilotSchool only has: province, district, cluster, school_name, school_code

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

      const response = await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values)
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
          <Form.Item
            name="name"
            label="ឈ្មោះសាលារៀន"
            rules={[
              { required: true, message: "សូមបញ្ចូលឈ្មោះសាលារៀន" },
              { min: 3, message: "ឈ្មោះសាលារៀនត្រូវតែមានយ៉ាងតិច ៣ តួអក្សរ" }
            ]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះសាលារៀន" size="large" />
          </Form.Item>

          <Form.Item
            name="province"
            label="ខេត្ត"
            rules={[
              { required: true, message: "សូមជ្រើសរើសខេត្ត" }
            ]}
          >
            <Select
              placeholder="ជ្រើសរើសខេត្ត"
              size="large"
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)
                  ?.toLowerCase()
                  ?.includes(input.toLowerCase()) ?? false
              }
            >
              {PROVINCES.map(province => (
                <Option key={province} value={province}>
                  {province}
                </Option>
              ))}
            </Select>
          </Form.Item>

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
