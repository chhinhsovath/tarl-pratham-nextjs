'use client';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
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
  DatePicker,
  Select,
  Row,
  Col,
  Timeline,
  Alert,
  Statistic,
  Progress,
  Tooltip,
  Badge
} from 'antd';
import {
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AssessmentPeriod {
  id: number;
  pilot_school_id: number;
  school_name: string;
  baseline_start_date: string | null;
  baseline_end_date: string | null;
  midline_start_date: string | null;
  midline_end_date: string | null;
  endline_start_date: string | null;
  endline_end_date: string | null;
  is_locked: boolean;
}

function AssessmentPeriodsPageContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState<AssessmentPeriod[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [bulkEditModalVisible, setBulkEditModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<AssessmentPeriod | null>(null);
  const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [stats, setStats] = useState({
    total_schools: 0,
    baseline_active: 0,
    midline_active: 0,
    endline_active: 0,
    locked_schools: 0
  });

  useEffect(() => {
    fetchPeriods();
    fetchStats();
  }, []);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessments/periods');
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.periods || []);
      }
    } catch (error) {
      console.error('Error fetching periods:', error);
      message.error('Failed to load assessment periods');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/assessments/periods/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getCurrentPeriod = (period: AssessmentPeriod): string => {
    const today = dayjs();
    
    if (period.baseline_start_date && period.baseline_end_date) {
      if (today.isBetween(dayjs(period.baseline_start_date), dayjs(period.baseline_end_date), 'day', '[]')) {
        return 'baseline';
      }
    }
    
    if (period.midline_start_date && period.midline_end_date) {
      if (today.isBetween(dayjs(period.midline_start_date), dayjs(period.midline_end_date), 'day', '[]')) {
        return 'midline';
      }
    }
    
    if (period.endline_start_date && period.endline_end_date) {
      if (today.isBetween(dayjs(period.endline_start_date), dayjs(period.endline_end_date), 'day', '[]')) {
        return 'endline';
      }
    }
    
    return 'inactive';
  };

  const handleUpdatePeriod = async (values: any) => {
    try {
      const response = await fetch(`/api/assessments/periods/${selectedPeriod?.pilot_school_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_start_date: values.baseline?.[0]?.format('YYYY-MM-DD'),
          baseline_end_date: values.baseline?.[1]?.format('YYYY-MM-DD'),
          midline_start_date: values.midline?.[0]?.format('YYYY-MM-DD'),
          midline_end_date: values.midline?.[1]?.format('YYYY-MM-DD'),
          endline_start_date: values.endline?.[0]?.format('YYYY-MM-DD'),
          endline_end_date: values.endline?.[1]?.format('YYYY-MM-DD'),
        })
      });

      if (response.ok) {
        message.success('Assessment periods updated successfully');
        setEditModalVisible(false);
        fetchPeriods();
        fetchStats();
      } else {
        throw new Error('Failed to update periods');
      }
    } catch (error) {
      console.error('Error updating periods:', error);
      message.error('Failed to update assessment periods');
    }
  };

  const handleBulkUpdate = async (values: any) => {
    if (selectedSchools.length === 0) {
      message.warning('Please select schools to update');
      return;
    }

    try {
      const response = await fetch('/api/assessments/periods/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_ids: selectedSchools,
          baseline_start_date: values.baseline?.[0]?.format('YYYY-MM-DD'),
          baseline_end_date: values.baseline?.[1]?.format('YYYY-MM-DD'),
          midline_start_date: values.midline?.[0]?.format('YYYY-MM-DD'),
          midline_end_date: values.midline?.[1]?.format('YYYY-MM-DD'),
          endline_start_date: values.endline?.[0]?.format('YYYY-MM-DD'),
          endline_end_date: values.endline?.[1]?.format('YYYY-MM-DD'),
        })
      });

      if (response.ok) {
        message.success(`Updated periods for ${selectedSchools.length} schools`);
        setBulkEditModalVisible(false);
        setSelectedSchools([]);
        fetchPeriods();
        fetchStats();
      }
    } catch (error) {
      console.error('Error bulk updating:', error);
      message.error('Failed to update periods');
    }
  };

  const handleLockToggle = async (schoolId: number, lock: boolean) => {
    try {
      const response = await fetch(`/api/assessments/periods/${schoolId}/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lock })
      });

      if (response.ok) {
        message.success(`School ${lock ? 'locked' : 'unlocked'} successfully`);
        fetchPeriods();
        fetchStats();
      }
    } catch (error) {
      console.error('Error toggling lock:', error);
      message.error('Failed to update lock status');
    }
  };

  const columns = [
    {
      title: 'សាលារៀន',
      dataIndex: 'school_name',
      key: 'school_name',
      render: (name: string, record: AssessmentPeriod) => (
        <div>
          <div><strong>{name}</strong></div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            ID: {record.pilot_school_id}
          </div>
        </div>
      )
    },
    {
      title: 'រយៈពេលបច្ចុប្បន្ន',
      key: 'current',
      render: (_: any, record: AssessmentPeriod) => {
        const current = getCurrentPeriod(record);
        const colors = {
          baseline: 'blue',
          midline: 'orange',
          endline: 'green',
          inactive: 'default'
        };
        return (
          <Tag color={colors[current as keyof typeof colors]}>
            {current.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'មូលដ្ឋាន',
      key: 'baseline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.baseline_start_date && record.baseline_end_date ? (
            <>
              <div>{dayjs(record.baseline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.baseline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'baseline' && (
                <Tag color="blue" icon={<ClockCircleOutlined />}>កំពុងដំណើរការ</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>មិនទាន់កំណត់</span>
          )}
        </div>
      )
    },
    {
      title: 'កុលសនភាព',
      key: 'midline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.midline_start_date && record.midline_end_date ? (
            <>
              <div>{dayjs(record.midline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.midline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'midline' && (
                <Tag color="orange" icon={<ClockCircleOutlined />}>កំពុងដំណើរការ</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>មិនទាន់កំណត់</span>
          )}
        </div>
      )
    },
    {
      title: 'បញ្ចប់',
      key: 'endline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.endline_start_date && record.endline_end_date ? (
            <>
              <div>{dayjs(record.endline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.endline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'endline' && (
                <Tag color="green" icon={<ClockCircleOutlined />}>កំពុងដំណើរការ</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>មិនទាន់កំណត់</span>
          )}
        </div>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      render: (_: any, record: AssessmentPeriod) => (
        <Badge
          status={record.is_locked ? 'error' : 'success'}
          text={record.is_locked ? 'ជាប់សោ' : 'កំពុងដំណើរការ'}
        />
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (_: any, record: AssessmentPeriod) => (
        <Space size="small">
          <Tooltip title="កែសម្រួលរយៈពេល">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPeriod(record);
                form.setFieldsValue({
                  baseline: record.baseline_start_date && record.baseline_end_date ? [
                    dayjs(record.baseline_start_date),
                    dayjs(record.baseline_end_date)
                  ] : null,
                  midline: record.midline_start_date && record.midline_end_date ? [
                    dayjs(record.midline_start_date),
                    dayjs(record.midline_end_date)
                  ] : null,
                  endline: record.endline_start_date && record.endline_end_date ? [
                    dayjs(record.endline_start_date),
                    dayjs(record.endline_end_date)
                  ] : null,
                });
                setEditModalVisible(true);
              }}
              disabled={record.is_locked}
            />
          </Tooltip>
          
          <Tooltip title={record.is_locked ? 'ដោះសោ' : 'ចាក់សោ'}>
            <Button
              type="link"
              danger={record.is_locked}
              icon={record.is_locked ? <UnlockOutlined /> : <LockOutlined />}
              onClick={() => handleLockToggle(record.pilot_school_id, !record.is_locked)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedSchools,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedSchools(selectedRowKeys as number[]);
    },
    getCheckboxProps: (record: AssessmentPeriod) => ({
      disabled: record.is_locked,
    }),
  };

  return (
    <div className="w-full">
      <Card title="ការគ្រប់ឃ្រងរយៈពេលវាយតម្លៃ">
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="សាលារៀនសរុប"
                value={stats.total_schools}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="មូលដ្ឋានកំពុងដំណើរការ"
                value={stats.baseline_active}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="កុលសនភាពកំពុងដំណើរការ"
                value={stats.midline_active}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="បញ្ចប់កំពុងដំណើរការ"
                value={stats.endline_active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="ជាប់សោ"
                value={stats.locked_schools}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Alert
          message="ឌ្បង់ការវាយតម្លៃរយៈពេល"
          description="កំណត់រយៈពេលវាយតម្លៃសម្រាប់សាលារៀននីមួយទើទែរ។ វាយតម្លៃត្រូវបានប៉ុណ្ណោះក្នុងរយៈពេលកំពុងដំណើរការមួយទេរបស់ពួកគេ។ ជាប់សោរយៈពេលដើម្បីបង្ការកែសម្រួល។"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {selectedSchools.length > 0 && (
          <Alert
            message={`${selectedSchools.length} schools selected`}
            type="info"
            showIcon
            action={
              <Space>
                <Button 
                  size="small" 
                  type="primary"
                  icon={<SettingOutlined />}
                  onClick={() => setBulkEditModalVisible(true)}
                >
                  កែសម្រួលរយៈពេលដោយក្រុម
                </Button>
                <Button 
                  size="small"
                  onClick={() => setSelectedSchools([])}
                >
                  សម្រាប់ការជ្រើសរើស
                </Button>
              </Space>
            }
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={periods}
          rowKey="pilot_school_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `សាលារៀនសរុប ${total}`,
          }}
        />
      </Card>

      {/* Edit Single Period Modal */}
      <Modal
        title={`កែសម្រួលរយៈពេលវាយតម្លៃ - ${selectedPeriod?.school_name}`}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedPeriod(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdatePeriod}
        >
          <Timeline style={{ marginBottom: 24 }}>
            <Timeline.Item color="blue">
              <Form.Item
                name="baseline"
                label="រយៈពេលវាយតម្លៃមូលដ្ឋាន"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="orange">
              <Form.Item
                name="midline"
                label="រយៈពេលវាយតម្លៃកុលសនភាព"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="green">
              <Form.Item
                name="endline"
                label="រយៈពេលវាយតម្លៃបញ្ចប់"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
          </Timeline>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                រក្សាទុកការផ្លាស់ប្តូរ
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedPeriod(null);
                form.resetFields();
              }}>
                បោះបង់
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal
        title={`កែសម្រួលរយៈពេលវាយតម្លៃដោយក្រុម (${selectedSchools.length} សាលារៀន)`}
        open={bulkEditModalVisible}
        onCancel={() => {
          setBulkEditModalVisible(false);
          bulkForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Alert
          message="ការប្រាប់ភ្នាក់ប្រេងការធ្វើបច្រើនដោយក្រុម"
          description="រយៈពេលទាំងនេះនឹងត្រូវបានដំណើរការចំភោះសាលារៀនទាំងអស់ដែលបានជ្រើសរើស។ រយៈពេលដែលមានរក់រ៉ាប់នឹងត្រូវបានកត់បង្កើត់។"
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form
          form={bulkForm}
          layout="vertical"
          onFinish={handleBulkUpdate}
        >
          <Timeline style={{ marginBottom: 24 }}>
            <Timeline.Item color="blue">
              <Form.Item
                name="baseline"
                label="រយៈពេលវាយតម្លៃមូលដ្ឋាន"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="orange">
              <Form.Item
                name="midline"
                label="រយៈពេលវាយតម្លៃកុលសនភាព"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="green">
              <Form.Item
                name="endline"
                label="រយៈពេលវាយតម្លៃបញ្ចប់"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
          </Timeline>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                ដំណើរការចំភោះទាំងអស់ដែលបានជ្រើសរើស
              </Button>
              <Button onClick={() => {
                setBulkEditModalVisible(false);
                bulkForm.resetFields();
              }}>
                បោះបង់
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default function AssessmentPeriodsPage() {
  return (
    <HorizontalLayout>
      <AssessmentPeriodsPageContent />
    </HorizontalLayout>
  );
}
