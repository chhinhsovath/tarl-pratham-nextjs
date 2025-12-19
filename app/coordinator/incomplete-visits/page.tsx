'use client';

import React, { useState, useEffect } from 'react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import {
  Card,
  Table,
  Button,
  Tag,
  Progress,
  Space,
  Modal,
  Form,
  Select,
  Input,
  InputNumber,
  Radio,
  message,
  Statistic,
  Row,
  Col,
  Alert,
  Tooltip,
  Divider
} from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Option } = Select;

interface IncompleteVisit {
  id: number;
  visit_date: string;
  mentor_id: number;
  pilot_school_id: number;
  completeness_percentage: number;
  missing_fields_count: number;
  missing_fields: string[];
  is_complete: boolean;
  mentor_name?: string;
  mentor_email?: string;
  school_name?: string;
  school_code?: string;
  subject_observed?: string;
  total_students_enrolled?: number;
  students_present?: number;
}

interface ReportSummary {
  total_visits: number;
  complete_visits: number;
  incomplete_visits: number;
  average_completeness: number;
  most_common_missing_fields: Array<{
    field: string;
    count: number;
    percentage: number;
  }>;
  completeness_distribution: {
    '0-25%': number;
    '26-50%': number;
    '51-75%': number;
    '76-99%': number;
    '100%': number;
  };
}

// Field labels in Khmer
const FIELD_LABELS: Record<string, string> = {
  students_grouped_by_level: 'សិស្សបានដាក់ក្រុមតាមកម្រិត',
  students_active_participation: 'សិស្សចូលរួមយ៉ាងសកម្ម',
  teacher_has_lesson_plan: 'មានផែនការបង្រៀន',
  followed_lesson_plan: 'បានធ្វើតាមផែនការ',
  plan_appropriate_for_levels: 'ផែនការសមរម្យ',
  num_activities_observed: 'ចំនួនសកម្មភាពអង្កេត',
  observation: 'សេចក្តីសម្គាល់',
  feedback_for_teacher: 'មតិយោបល់ចំពោះអ្នកបង្រៀន',
  action_plan: 'ផែនការសកម្មភាព',
  score: 'ពិន្ទុ',
  grade_group: 'ក្រុមថ្នាក់'
};

function IncompleteVisitsContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [visits, setVisits] = useState<IncompleteVisit[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<IncompleteVisit | null>(null);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchIncompleteVisits();
  }, []);

  const fetchIncompleteVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/mentoring/incomplete?includeDetails=true');
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        // Only show incomplete visits by default
        setVisits(data.visits.filter((v: IncompleteVisit) => !v.is_complete));
      } else {
        message.error('មិនអាចទាញទិន្នន័យបានទេ');
      }
    } catch (error) {
      console.error('Error fetching incomplete visits:', error);
      message.error('មានបញ្ហាក្នុងការទាញទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (visit: IncompleteVisit) => {
    setCurrentVisit(visit);
    setEditModalVisible(true);

    // Pre-populate form with default values for missing fields
    const initialValues: any = {};

    // Set defaults for boolean fields (assume "No" if missing)
    if (visit.missing_fields.includes('students_grouped_by_level')) {
      initialValues.children_grouped_appropriately = false;
    }
    if (visit.missing_fields.includes('students_active_participation')) {
      initialValues.students_fully_involved = false;
    }
    if (visit.missing_fields.includes('teacher_has_lesson_plan')) {
      initialValues.has_session_plan = false;
    }
    if (visit.missing_fields.includes('followed_lesson_plan')) {
      initialValues.followed_session_plan = false;
    }
    if (visit.missing_fields.includes('plan_appropriate_for_levels')) {
      initialValues.session_plan_appropriate = false;
    }

    form.setFieldsValue(initialValues);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      // Update the visit via API
      const response = await fetch('/api/mentoring', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentVisit?.id,
          ...values
        })
      });

      if (response.ok) {
        message.success('បានរក្សាទុកដោយជោគជ័យ');
        setEditModalVisible(false);
        form.resetFields();
        // Refresh the list
        fetchIncompleteVisits();
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចរក្សាទុកបានទេ');
      }
    } catch (error) {
      console.error('Error saving visit:', error);
      message.error('មានបញ្ហាក្នុងការរក្សាទុក');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'visit_date',
      key: 'visit_date',
      render: (date: string) => new Date(date).toLocaleDateString('km-KH'),
      width: 120
    },
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      ellipsis: true,
      width: 200
    },
    {
      title: 'គ្រូព្រឹក្សា',
      dataIndex: 'mentor_name',
      key: 'mentor_name',
      ellipsis: true,
      width: 150
    },
    {
      title: 'ភាពពេញលេញ',
      key: 'completeness',
      width: 150,
      render: (_: any, record: IncompleteVisit) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Progress
            percent={record.completeness_percentage}
            size="small"
            status={record.completeness_percentage >= 75 ? 'success' : 'exception'}
          />
          <small style={{ color: '#999' }}>
            បាត់បង់ {record.missing_fields_count} វាល
          </small>
        </Space>
      )
    },
    {
      title: 'វាលដែលបាត់',
      key: 'missing_fields',
      render: (_: any, record: IncompleteVisit) => (
        <div style={{ maxWidth: 300 }}>
          {record.missing_fields.slice(0, 3).map(field => (
            <Tag key={field} color="red" style={{ marginBottom: 4, fontSize: 11 }}>
              {FIELD_LABELS[field] || field}
            </Tag>
          ))}
          {record.missing_fields.length > 3 && (
            <Tag color="orange" style={{ fontSize: 11 }}>
              +{record.missing_fields.length - 3} ទៀត
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: IncompleteVisit) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            កែសម្រួល
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <Row align="middle">
          <Col flex="auto">
            <h2 style={{ margin: 0 }}>
              <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
              គ្រប់គ្រងការចុះអប់រំមិនពេញលេញ
            </h2>
            <p style={{ margin: '8px 0 0 0', color: '#666' }}>
              ពិនិត្យ និងបំពេញទិន្នន័យដែលបាត់សម្រាប់ការចុះអប់រំដែលមានស្រាប់
            </p>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchIncompleteVisits}
              loading={loading}
            >
              ធ្វើបច្ចុប្បន្នភាព
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Summary Statistics */}
      {summary && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ការចុះសរុប"
                value={summary.total_visits}
                prefix={<InfoCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="មិនពេញលេញ"
                value={summary.incomplete_visits}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ភាពពេញលេញមធ្យម"
                value={summary.average_completeness}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{
                  color: summary.average_completeness >= 75 ? '#52c41a' : '#faad14'
                }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="ពេញលេញ"
                value={summary.complete_visits}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Most Common Missing Fields Alert */}
      {summary && summary.most_common_missing_fields.length > 0 && (
        <Alert
          message="វាលដែលបាត់ញឹកញាប់បំផុត"
          description={
            <div style={{ marginTop: 8 }}>
              {summary.most_common_missing_fields.slice(0, 5).map(field => (
                <Tag key={field.field} color="orange" style={{ marginBottom: 4 }}>
                  {FIELD_LABELS[field.field] || field.field}: {field.percentage}% ({field.count}/{summary.total_visits})
                </Tag>
              ))}
            </div>
          }
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Incomplete Visits Table */}
      <Card
        title={`ការចុះអប់រំមិនពេញលេញ (${visits.length})`}
        extra={
          <Tag color="orange">
            ត្រូវការបំពេញទិន្នន័យ
          </Tag>
        }
      >
        <Table
          columns={columns}
          dataSource={visits}
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `សរុប ${total} ការចុះអប់រំ`
          }}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>បំពេញទិន្នន័យដែលបាត់ - {currentVisit?.school_name}</span>
          </Space>
        }
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
        }}
        onOk={handleSave}
        confirmLoading={saving}
        width={800}
        okText="រក្សាទុក"
        cancelText="បោះបង់"
      >
        {currentVisit && (
          <>
            <Alert
              message={`ភាពពេញលេញ: ${currentVisit.completeness_percentage}% | បាត់បង់: ${currentVisit.missing_fields_count} វាល`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Form form={form} layout="vertical">
              <Divider orientation="left">ការរៀបចំថ្នាក់រៀន</Divider>

              {currentVisit.missing_fields.includes('students_grouped_by_level') && (
                <Form.Item
                  name="children_grouped_appropriately"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>សិស្សបានដាក់ក្រុមតាមកម្រិត</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>បាទ/ចាស</Radio>
                    <Radio value={false}>ទេ</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('students_active_participation') && (
                <Form.Item
                  name="students_fully_involved"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>សិស្សចូលរួមយ៉ាងសកម្ម</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>បាទ/ចាស</Radio>
                    <Radio value={false}>ទេ</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              <Divider orientation="left">ផែនការបង្រៀន</Divider>

              {currentVisit.missing_fields.includes('teacher_has_lesson_plan') && (
                <Form.Item
                  name="has_session_plan"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>មានផែនការបង្រៀន</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>បាទ/ចាស</Radio>
                    <Radio value={false}>ទេ</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('followed_lesson_plan') && (
                <Form.Item
                  name="followed_session_plan"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>បានធ្វើតាមផែនការ</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>បាទ/ចាស</Radio>
                    <Radio value={false}>ទេ</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('plan_appropriate_for_levels') && (
                <Form.Item
                  name="session_plan_appropriate"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>ផែនការសមរម្យ</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Radio.Group>
                    <Radio value={true}>បាទ/ចាស</Radio>
                    <Radio value={false}>ទេ</Radio>
                  </Radio.Group>
                </Form.Item>
              )}

              <Divider orientation="left">ព័ត៌មានបន្ថែម</Divider>

              {currentVisit.missing_fields.includes('grade_group') && (
                <Form.Item
                  name="grade_group"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>ក្រុមថ្នាក់</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមជ្រើសរើស' }]}
                >
                  <Select placeholder="ជ្រើសរើសក្រុមថ្នាក់">
                    <Option value="1-2">ថ្នាក់ទី១-២</Option>
                    <Option value="3-4">ថ្នាក់ទី៣-៤</Option>
                    <Option value="5-6">ថ្នាក់ទី៥-៦</Option>
                  </Select>
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('num_activities_observed') && (
                <Form.Item
                  name="number_of_activities"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>ចំនួនសកម្មភាពអង្កេត</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមបញ្ចូលចំនួន' }]}
                >
                  <InputNumber min={0} max={5} style={{ width: '100%' }} />
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('score') && (
                <Form.Item
                  name="score"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>ពិន្ទុ</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមបញ្ចូលពិន្ទុ' }]}
                >
                  <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('observation') && (
                <Form.Item
                  name="observation"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>សេចក្តីសម្គាល់</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមបញ្ចូលសេចក្តីសម្គាល់' }]}
                >
                  <TextArea rows={3} placeholder="សរសេរសេចក្តីសម្គាល់..." />
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('feedback_for_teacher') && (
                <Form.Item
                  name="teacher_feedback"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>មតិយោបល់ចំពោះអ្នកបង្រៀន</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមបញ្ចូលមតិយោបល់' }]}
                >
                  <TextArea rows={3} placeholder="សរសេរមតិយោបល់..." />
                </Form.Item>
              )}

              {currentVisit.missing_fields.includes('action_plan') && (
                <Form.Item
                  name="action_plan"
                  label={
                    <Space>
                      <WarningOutlined style={{ color: '#faad14' }} />
                      <span>ផែនការសកម្មភាព</span>
                    </Space>
                  }
                  rules={[{ required: true, message: 'សូមបញ្ចូលផែនការសកម្មភាព' }]}
                >
                  <TextArea rows={3} placeholder="សរសេរផែនការសកម្មភាព..." />
                </Form.Item>
              )}
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
}

export default function IncompleteVisitsPage() {
  return (
    <HorizontalLayout>
      <IncompleteVisitsContent />
    </HorizontalLayout>
  );
}
