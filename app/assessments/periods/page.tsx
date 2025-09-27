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

export default function AssessmentPeriodsPage() {
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
      title: 'School',
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
      title: 'Current Period',
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
      title: 'Baseline',
      key: 'baseline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.baseline_start_date && record.baseline_end_date ? (
            <>
              <div>{dayjs(record.baseline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.baseline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'baseline' && (
                <Tag color="blue" icon={<ClockCircleOutlined />}>ACTIVE</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>Not set</span>
          )}
        </div>
      )
    },
    {
      title: 'Midline',
      key: 'midline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.midline_start_date && record.midline_end_date ? (
            <>
              <div>{dayjs(record.midline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.midline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'midline' && (
                <Tag color="orange" icon={<ClockCircleOutlined />}>ACTIVE</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>Not set</span>
          )}
        </div>
      )
    },
    {
      title: 'Endline',
      key: 'endline',
      render: (_: any, record: AssessmentPeriod) => (
        <div>
          {record.endline_start_date && record.endline_end_date ? (
            <>
              <div>{dayjs(record.endline_start_date).format('DD/MM/YYYY')}</div>
              <div>to {dayjs(record.endline_end_date).format('DD/MM/YYYY')}</div>
              {getCurrentPeriod(record) === 'endline' && (
                <Tag color="green" icon={<ClockCircleOutlined />}>ACTIVE</Tag>
              )}
            </>
          ) : (
            <span style={{ color: '#999' }}>Not set</span>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: AssessmentPeriod) => (
        <Badge
          status={record.is_locked ? 'error' : 'success'}
          text={record.is_locked ? 'Locked' : 'Active'}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AssessmentPeriod) => (
        <Space size="small">
          <Tooltip title="Edit Periods">
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
          
          <Tooltip title={record.is_locked ? 'Unlock' : 'Lock'}>
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
    <div style={{ padding: '24px' }}>
      <Card title="Assessment Period Management">
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Total Schools"
                value={stats.total_schools}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Baseline Active"
                value={stats.baseline_active}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Midline Active"
                value={stats.midline_active}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Endline Active"
                value={stats.endline_active}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={5}>
            <Card>
              <Statistic
                title="Locked"
                value={stats.locked_schools}
                valueStyle={{ color: '#ff4d4f' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Alert
          message="Assessment Period Guidelines"
          description="Configure assessment periods for each school. Assessments can only be entered during their respective active periods. Lock periods to prevent modifications."
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
                  Bulk Edit Periods
                </Button>
                <Button 
                  size="small"
                  onClick={() => setSelectedSchools([])}
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
          dataSource={periods}
          rowKey="pilot_school_id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} schools`,
          }}
        />
      </Card>

      {/* Edit Single Period Modal */}
      <Modal
        title={`Edit Assessment Periods - ${selectedPeriod?.school_name}`}
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
                label="Baseline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="orange">
              <Form.Item
                name="midline"
                label="Midline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="green">
              <Form.Item
                name="endline"
                label="Endline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
          </Timeline>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedPeriod(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Edit Modal */}
      <Modal
        title={`Bulk Edit Assessment Periods (${selectedSchools.length} schools)`}
        open={bulkEditModalVisible}
        onCancel={() => {
          setBulkEditModalVisible(false);
          bulkForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Alert
          message="Bulk Update Warning"
          description="These periods will be applied to all selected schools. Existing periods will be overwritten."
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
                label="Baseline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="orange">
              <Form.Item
                name="midline"
                label="Midline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
            
            <Timeline.Item color="green">
              <Form.Item
                name="endline"
                label="Endline Assessment Period"
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Timeline.Item>
          </Timeline>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Apply to All Selected
              </Button>
              <Button onClick={() => {
                setBulkEditModalVisible(false);
                bulkForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}