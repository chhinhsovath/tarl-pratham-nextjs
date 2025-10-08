'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Spin,
  Row,
  Col,
  Breadcrumb,
  Typography
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  HomeOutlined,
  BankOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import Link from 'next/link';

const { Option } = Select;
const { Title } = Typography;

const PROVINCES = [
  "បន្ទាយមានជ័យ", "បាត់ដំបង", "កំពង់ចាម", "កំពង់ឆ្នាំង",
  "កំពង់ស្ពឺ", "កំពង់ធំ", "កំពត", "កណ្តាល", "កែប", "កោះកុង",
  "ក្រចេះ", "មណ្ឌលគិរី", "ឧត្តរមានជ័យ", "ប៉ៃលិន", "ភ្នំពេញ",
  "ព្រះវិហារ", "ព្រៃវែង", "ពោធិ៍សាត់", "រតនគិរី", "សៀមរាប",
  "ព្រះសីហនុ", "ស្ទឹងត្រែង", "ស្វាយរៀង", "តាកែវ", "ត្បូងឃ្មុំ"
];

export default function EditSchoolPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Check permissions - only admin and coordinator can edit schools
    const canEdit = session.user.role === "admin" || session.user.role === "coordinator";

    if (!canEdit) {
      message.error("អ្នកមិនមានសិទ្ធិកែប្រែសាលារៀនទេ");
      router.push("/schools");
      return;
    }

    if (params.id) {
      fetchSchool();
    }
  }, [params.id, session, status, router]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pilot-schools/${params.id}`);

      if (!response.ok) {
        throw new Error('មិនអាចទាញយកទិន្នន័យសាលារៀនបានទេ');
      }

      const data = await response.json();
      const school = data.data || data.school;

      // Set form values - only pilot_schools fields
      form.setFieldsValue({
        school_name: school.school_name,
        school_code: school.school_code,
        province: school.province,
        district: school.district,
        cluster: school.cluster || ""
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      message.error('មិនអាចទាញយកទិន្នន័យសាលារៀនបានទេ');
      router.push('/schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const response = await fetch(`/api/pilot-schools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'មិនអាចកែប្រែសាលារៀនបានទេ');
      }

      message.success('បានកែប្រែសាលារៀនដោយជោគជ័យ');
      router.push('/schools');
    } catch (error: any) {
      console.error('Error updating school:', error);
      message.error(error.message || 'មិនអាចកែប្រែសាលារៀនបានទេ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <HorizontalLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
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
            <EditOutlined /> កែប្រែសាលារៀន
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
            កែប្រែសាលារៀន
          </Title>
          <Link href="/schools">
            <Button icon={<ArrowLeftOutlined />}>
              ត្រឡប់ទៅសាលារៀន
            </Button>
          </Link>
        </div>

        {/* Edit Form */}
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="school_name"
                  label="ឈ្មោះសាលារៀន"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលឈ្មោះសាលារៀន' },
                    { min: 3, message: 'ឈ្មោះសាលារៀនត្រូវតែមានយ៉ាងតិច ៣ តួអក្សរ' }
                  ]}
                >
                  <Input placeholder="បញ្ចូលឈ្មោះសាលារៀន" size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="school_code"
                  label="លេខកូដសាលារៀន"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលលេខកូដសាលារៀន' },
                    { min: 2, message: 'លេខកូដត្រូវតែមានយ៉ាងតិច ២ តួអក្សរ' }
                  ]}
                >
                  <Input placeholder="បញ្ចូលលេខកូដសាលារៀន" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="province"
                  label="ខេត្ត"
                  rules={[
                    { required: true, message: 'សូមជ្រើសរើសខេត្ត' }
                  ]}
                >
                  <Select
                    placeholder="ជ្រើសរើសខេត្ត"
                    size="large"
                    showSearch
                    allowClear
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
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="district"
                  label="ស្រុក/ខណ្ឌ"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលស្រុក/ខណ្ឌ' }
                  ]}
                >
                  <Input placeholder="បញ្ចូលស្រុក/ខណ្ឌ" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="cluster"
              label="ក្លាស្ទ័រ (Cluster)"
            >
              <Input placeholder="បញ្ចូលក្លាស្ទ័រ (ប្រសិនបើមិនមាន សូមទុកចោល)" size="large" />
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
                  រក្សាទុក
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
    </HorizontalLayout>
  );
}
