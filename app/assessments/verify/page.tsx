'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  message, 
  Modal, 
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Alert,
  Tabs,
  Badge,
  Tooltip,
  Radio
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function AssessmentVerificationPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState<number[]>([]);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: 'pending',
    assessment_type: '',
    subject: '',
    school_id: '',
    date_from: '',
    date_to: ''
  });
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
    locked: 0
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAssessments();
    fetchStats();
  }, [filters]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== '')
      ).toString();
      
      const response = await fetch(`/api/assessments/verification?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setAssessments(data.assessments || []);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('Failed to load assessments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/assessments/verification/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleVerify = async (assessmentId: number, status: 'verified' | 'rejected', notes?: string) => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verification_status: status,
          verification_notes: notes,
          verified_by: session?.user?.id
        })
      });

      if (response.ok) {
        message.success(`Assessment ${status} successfully`);
        fetchAssessments();
        fetchStats();
        setVerifyModalVisible(false);
        setSelectedAssessment(null);
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying assessment:', error);
      message.error('Failed to verify assessment');
    }
  };

  const handleBulkVerify = async (status: 'verified' | 'rejected') => {
    if (selectedAssessments.length === 0) {
      message.warning('Please select assessments to verify');
      return;
    }

    Modal.confirm({
      title: `Bulk ${status === 'verified' ? 'Verify' : 'Reject'} Assessments`,
      content: `Are you sure you want to ${status} ${selectedAssessments.length} assessments?`,
      onOk: async () => {
        try {
          const response = await fetch('/api/assessments/bulk-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assessment_ids: selectedAssessments,
              verification_status: status,
              verified_by: session?.user?.id
            })
          });

          if (response.ok) {
            message.success(`${selectedAssessments.length} assessments ${status} successfully`);
            setSelectedAssessments([]);
            fetchAssessments();
            fetchStats();
          }
        } catch (error) {
          console.error('Error bulk verifying:', error);
          message.error('Failed to verify assessments');
        }
      }
    });
  };

  const handleLock = async (assessmentId: number, lock: boolean) => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          lock,
          locked_by: session?.user?.id
        })
      });

      if (response.ok) {
        message.success(`Assessment ${lock ? 'locked' : 'unlocked'} successfully`);
        fetchAssessments();
      }
    } catch (error) {
      console.error('Error locking assessment:', error);
      message.error(`Failed to ${lock ? 'lock' : 'unlock'} assessment`);
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
      render: (student: any) => (
        <div>
          <div><strong>{student.name}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {student.id} | Age: {student.age || 'N/A'}
          </div>
        </div>
      )
    },
    {
      title: 'School',
      dataIndex: 'pilot_school',
      key: 'school',
      render: (school: any) => (
        <div>
          <div>{school?.school_name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{school?.district}</div>
        </div>
      )
    },
    {
      title: 'Assessment',
      key: 'assessment',
      render: (_: any, record: any) => (
        <div>
          <Tag color={
            record.assessment_type === 'baseline' ? 'blue' :
            record.assessment_type === 'midline' ? 'orange' : 'green'
          }>
            {record.assessment_type?.toUpperCase()}
          </Tag>
          <Tag color={record.subject === 'khmer' ? 'purple' : 'cyan'}>
            {record.subject?.toUpperCase()}
          </Tag>
          <div style={{ marginTop: '4px' }}>
            <Tag>Level: {record.level || 'N/A'}</Tag>
            {record.score !== null && <Tag>Score: {record.score}</Tag>}
          </div>
        </div>
      )
    },
    {
      title: 'Assessed By',
      dataIndex: 'added_by',
      key: 'added_by',
      render: (user: any) => (
        <div>
          <div>{user?.name || 'Unknown'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {dayjs(user?.created_at).format('DD/MM/YYYY')}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        const status = record.verification_status || 'pending';
        const colors = {
          pending: 'orange',
          verified: 'green',
          rejected: 'red'
        };
        return (
          <Tag color={colors[status as keyof typeof colors]} icon={
            status === 'verified' ? <CheckCircleOutlined /> :
            status === 'rejected' ? <CloseCircleOutlined /> :
            <ExclamationCircleOutlined />
          }>
            {status.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="Verify Assessment">
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setSelectedAssessment(record);
                setVerifyModalVisible(true);
              }}
              disabled={record.verification_status === 'verified' || record.is_locked}
            />
          </Tooltip>
          
          <Tooltip title={record.is_locked ? 'Unlock' : 'Lock'}>
            <Button
              type="link"
              danger={record.is_locked}
              icon={record.is_locked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleLock(record.id, !record.is_locked)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedAssessments,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedAssessments(selectedRowKeys as number[]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.verification_status === 'verified' || record.is_locked,
    }),
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Assessment Verification Queue" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending Verification"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Verified"
                value={stats.verified}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Rejected"
                value={stats.rejected}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Locked"
                value={stats.locked}
                valueStyle={{ color: '#1890ff' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Alert
          message="Verification Guidelines"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Verify that student information matches school records</li>
              <li>Check assessment scores are within valid ranges</li>
              <li>Ensure assessment type matches the current period</li>
              <li>Lock assessments to prevent further modifications after verification</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Form layout="inline" onFinish={(values) => setFilters({...filters, ...values})}>
            <Form.Item name="status" initialValue="pending">
              <Select style={{ width: 150 }} placeholder="Status">
                <Option value="">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="verified">Verified</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Form.Item>

            <Form.Item name="assessment_type">
              <Select style={{ width: 150 }} placeholder="Assessment Type">
                <Option value="">All Types</Option>
                <Option value="baseline">Baseline</Option>
                <Option value="midline">Midline</Option>
                <Option value="endline">Endline</Option>
              </Select>
            </Form.Item>

            <Form.Item name="subject">
              <Select style={{ width: 120 }} placeholder="Subject">
                <Option value="">All Subjects</Option>
                <Option value="khmer">Khmer</Option>
                <Option value="math">Mathematics</Option>
              </Select>
            </Form.Item>

            <Form.Item name="date_from">
              <DatePicker placeholder="From Date" />
            </Form.Item>

            <Form.Item name="date_to">
              <DatePicker placeholder="To Date" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Search
              </Button>
            </Form.Item>

            <Form.Item>
              <Button onClick={() => {
                setFilters({
                  status: 'pending',
                  assessment_type: '',
                  subject: '',
                  school_id: '',
                  date_from: '',
                  date_to: ''
                });
                form.resetFields();
              }}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {selectedAssessments.length > 0 && (
          <Alert
            message={`${selectedAssessments.length} assessments selected`}
            type="info"
            showIcon
            action={
              <Space>
                <Button 
                  size="small" 
                  type="primary"
                  onClick={() => handleBulkVerify('verified')}
                >
                  Verify All
                </Button>
                <Button 
                  size="small" 
                  danger
                  onClick={() => handleBulkVerify('rejected')}
                >
                  Reject All
                </Button>
                <Button 
                  size="small"
                  onClick={() => setSelectedAssessments([])}
                >
                  Clear Selection
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={assessments}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} assessments`,
          }}
        />
      </Card>

      <Modal
        title="Verify Assessment"
        open={verifyModalVisible}
        onCancel={() => {
          setVerifyModalVisible(false);
          setSelectedAssessment(null);
        }}
        footer={null}
        width={600}
      >
        {selectedAssessment && (
          <Form
            layout="vertical"
            onFinish={(values) => {
              handleVerify(
                selectedAssessment.id, 
                values.status, 
                values.notes
              );
            }}
          >
            <Alert
              message="Assessment Details"
              description={
                <div>
                  <p><strong>Student:</strong> {selectedAssessment.student?.name}</p>
                  <p><strong>School:</strong> {selectedAssessment.pilot_school?.school_name}</p>
                  <p><strong>Type:</strong> {selectedAssessment.assessment_type}</p>
                  <p><strong>Subject:</strong> {selectedAssessment.subject}</p>
                  <p><strong>Level:</strong> {selectedAssessment.level || 'N/A'}</p>
                  <p><strong>Score:</strong> {selectedAssessment.score || 'N/A'}</p>
                  <p><strong>Assessed By:</strong> {selectedAssessment.added_by?.name}</p>
                  <p><strong>Date:</strong> {dayjs(selectedAssessment.assessed_date).format('DD/MM/YYYY')}</p>
                </div>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              name="status"
              label="Verification Decision"
              rules={[{ required: true, message: 'Please select a decision' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="verified">
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      Verify - Assessment data is correct and complete
                    </Space>
                  </Radio>
                  <Radio value="rejected">
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      Reject - Assessment needs correction
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Verification Notes"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('status') === 'rejected' && !value) {
                      return Promise.reject('Please provide a reason for rejection');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="Enter verification notes or reason for rejection..."
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Submit Verification
                </Button>
                <Button onClick={() => {
                  setVerifyModalVisible(false);
                  setSelectedAssessment(null);
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}