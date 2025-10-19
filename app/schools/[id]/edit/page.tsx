'use client';

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  message,
  Spin,
  Row,
  Col,
  Breadcrumb,
  Typography,
  Divider,
  Switch,
  Tag
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
const { RangePicker } = DatePicker;

// Only working with these two provinces for TaRL program
const PROVINCES = [
  "កំពង់ចាម", // Kampong Cham
  "បាត់ដំបង"  // Battambang
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

      // Prepare form values with all fields
      const formValues: any = {
        school_name: school.school_name,
        school_code: school.school_code,
        province: school.province,
        district: school.district,
        cluster: school.cluster,
        cluster_id: school.cluster_id,
        is_locked: school.is_locked || false,
      };

      // Convert date strings to dayjs objects for RangePicker
      if (school.baseline_start_date && school.baseline_end_date) {
        formValues.baseline_dates = [
          dayjs(school.baseline_start_date),
          dayjs(school.baseline_end_date)
        ];
      }

      if (school.midline_start_date && school.midline_end_date) {
        formValues.midline_dates = [
          dayjs(school.midline_start_date),
          dayjs(school.midline_end_date)
        ];
      }

      if (school.endline_start_date && school.endline_end_date) {
        formValues.endline_dates = [
          dayjs(school.endline_start_date),
          dayjs(school.endline_end_date)
        ];
      }

      form.setFieldsValue(formValues);
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

      // Transform date ranges to separate start/end dates
      const formattedValues: any = {
        id: parseInt(params.id as string),
        school_name: values.school_name,
        school_code: values.school_code,
        province: values.province,
        district: values.district,
        cluster: values.cluster,
        cluster_id: values.cluster_id || null,
        is_locked: values.is_locked || false,
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

      // Use the more flexible /api/pilot-schools PUT endpoint instead of /api/pilot-schools/[id]
      const response = await fetch(`/api/pilot-schools`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedValues)
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
            <Divider orientation="left">ព័ត៌មានមូលដ្ឋាន</Divider>

            <Row gutter={16}>
              <Col span={12}>
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

              <Col span={12}>
                <Form.Item
                  name="school_code"
                  label="លេខកូដសាលារៀន"
                  rules={[
                    { required: true, message: 'សូមបញ្ចូលលេខកូដសាលារៀន' }
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
                    { required: true, message: 'សូមជ្រើសរើសខេត្ត' }
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
                    { required: true, message: 'សូមបញ្ចូលស្រុក/ខណ្ឌ' }
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
                    { required: true, message: 'សូមបញ្ចូលក្រុម' }
                  ]}
                >
                  <Input placeholder="បញ្ចូលក្រុម" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="cluster_id"
                  label="លេខសម្គាល់ក្រុម (ជម្រើស)"
                >
                  <InputNumber placeholder="បញ្ចូលលេខសម្គាល់ក្រុម" style={{ width: "100%" }} size="large" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="is_locked"
                  label="ស្ថានភាពសោ"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="ជាប់សោ" unCheckedChildren="សកម្ម" />
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
