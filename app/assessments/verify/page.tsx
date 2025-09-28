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
import HorizontalLayout from '@/components/layout/HorizontalLayout';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

function AssessmentVerificationPage() {
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
      title: 'សិស្ស',
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
      title: 'សាលារៀន',
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
      title: 'ការវាយតម្លៃ',
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
      title: 'វាយតម្លៃដោយ',
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
      title: 'ស្ថានភាព',
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
      title: 'សកម្មភាព',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space size="small">
          <Tooltip title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ">
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
          
          <Tooltip title={record.is_locked ? 'ដោះសោ' : 'ចាក់សោ'}>
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
    <HorizontalLayout>
      <Card title="ជួររង់ចាំការផ្ទៀងផ្ទាត់ការវាយតម្លៃ" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="រង់ចាំការផ្ទៀងផ្ទាត់"
                value={stats.pending}
                valueStyle={{ color: '#faad14' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="បានផ្ទៀងផ្ទាត់"
                value={stats.verified}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="បានបដិសេធ"
                value={stats.rejected}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="បានចាក់សោ"
                value={stats.locked}
                valueStyle={{ color: '#1890ff' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Alert
          message="គោលការណ៍ណែនាំការផ្ទៀងផ្ទាត់"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>ផ្ទៀងផ្ទាត់ថាព័ត៌មានសិស្សត្រូវគ្នានឹងកំណត់ត្រាសាលារៀន</li>
              <li>ពិនិត្យមើលពិន្ទុការវាយតម្លៃស្ថិតក្នុងជួរត្រឹមត្រូវ</li>
              <li>ធានាថាប្រភេទការវាយតម្លៃត្រូវគ្នានឹងកាលបរិច្ឆេទបច្ចុប្បន្ន</li>
              <li>ចាក់សោការវាយតម្លៃដើម្បីការពារការកែប្រែបន្ថែមបន្ទាប់ពីការផ្ទៀងផ្ទាត់</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Card variant="borderless" style={{ marginBottom: 16 }}>
          <Form layout="inline" onFinish={(values) => setFilters({...filters, ...values})}>
            <Form.Item name="status" initialValue="pending">
              <Select style={{ width: 150 }} placeholder="ស្ថានភាព">
                <Option value="">ស្ថានភាពទាំងអស់</Option>
                <Option value="pending">រង់ចាំ</Option>
                <Option value="verified">បានផ្ទៀងផ្ទាត់</Option>
                <Option value="rejected">បានបដិសេធ</Option>
              </Select>
            </Form.Item>

            <Form.Item name="assessment_type">
              <Select style={{ width: 150 }} placeholder="ប្រភេទការវាយតម្លៃ">
                <Option value="">ប្រភេទទាំងអស់</Option>
                <Option value="baseline">បន្ទាត់មូលដ្ឋាន</Option>
                <Option value="midline">បន្ទាត់កណ្តាល</Option>
                <Option value="endline">បន្ទាត់បញ្ចប់</Option>
              </Select>
            </Form.Item>

            <Form.Item name="subject">
              <Select style={{ width: 120 }} placeholder="មុខវិជ្ជា">
                <Option value="">មុខវិជ្ជាទាំងអស់</Option>
                <Option value="khmer">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Form.Item>

            <Form.Item name="date_from">
              <DatePicker placeholder="ពីកាលបរិច្ឆេទ" />
            </Form.Item>

            <Form.Item name="date_to">
              <DatePicker placeholder="ដល់កាលបរិច្ឆេទ" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                ស្វែងរក
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
                កំណត់ឡើងវិញ
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {selectedAssessments.length > 0 && (
          <Alert
            message={`បានជ្រើសរើសការវាយតម្លៃ ${selectedAssessments.length}`}
            type="info"
            showIcon
            action={
              <Space>
                <Button 
                  size="small" 
                  type="primary"
                  onClick={() => handleBulkVerify('verified')}
                >
                  ផ្ទៀងផ្ទាត់ទាំងអស់
                </Button>
                <Button 
                  size="small" 
                  danger
                  onClick={() => handleBulkVerify('rejected')}
                >
                  បដិសេធទាំងអស់
                </Button>
                <Button 
                  size="small"
                  onClick={() => setSelectedAssessments([])}
                >
                  សម្អាតការជ្រើសរើស
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        <Table scroll={{ x: "max-content" }}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={assessments}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `សរុប ${total} ការវាយតម្លៃ`,
          }}
        />
      </Card>

      <Modal
        title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ"
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
              message="ព័ត៌មានលម្អិតការវាយតម្លៃ"
              description={
                <div>
                  <p><strong>សិស្ស:</strong> {selectedAssessment.student?.name}</p>
                  <p><strong>សាលារៀន:</strong> {selectedAssessment.pilot_school?.school_name}</p>
                  <p><strong>ប្រភេទ:</strong> {selectedAssessment.assessment_type}</p>
                  <p><strong>មុខវិជ្ជា:</strong> {selectedAssessment.subject}</p>
                  <p><strong>កម្រិត:</strong> {selectedAssessment.level || 'មិនមាន'}</p>
                  <p><strong>ពិន្ទុ:</strong> {selectedAssessment.score || 'មិនមាន'}</p>
                  <p><strong>វាយតម្លៃដោយ:</strong> {selectedAssessment.added_by?.name}</p>
                  <p><strong>កាលបរិច្ឆេទ:</strong> {dayjs(selectedAssessment.assessed_date).format('DD/MM/YYYY')}</p>
                </div>
              }
              type="info"
              style={{ marginBottom: 16 }}
            />

            <Form.Item
              name="status"
              label="ការសម្រេចចិត្តផ្ទៀងផ្ទាត់"
              rules={[{ required: true, message: 'សូមជ្រើសរើសការសម្រេចចិត្ត' }]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="verified">
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      ផ្ទៀងផ្ទាត់ - ទិន្នន័យការវាយតម្លៃត្រឹមត្រូវ និងពេញលេញ
                    </Space>
                  </Radio>
                  <Radio value="rejected">
                    <Space>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      បដិសេធ - ការវាយតម្លៃត្រូវការកែតម្រូវ
                    </Space>
                  </Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="notes"
              label="កំណត់ចំណាំការផ្ទៀងផ្ទាត់"
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue('status') === 'rejected' && !value) {
                      return Promise.reject('សូមផ្តល់ហេតុផលសម្រាប់ការបដិសេធ');
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <TextArea 
                rows={4} 
                placeholder="បញ្ចូលកំណត់ចំណាំការផ្ទៀងផ្ទាត់ ឬហេតុផលបដិសេធ..."
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  ដាក់ស្នើការផ្ទៀងផ្ទាត់
                </Button>
                <Button onClick={() => {
                  setVerifyModalVisible(false);
                  setSelectedAssessment(null);
                }}>
                  បោះបង់
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </HorizontalLayout>
  );
}

export default AssessmentVerificationPage;