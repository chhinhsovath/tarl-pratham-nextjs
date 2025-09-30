'use client';

import { useState, useEffect } from 'react';
import { Card, Table, Button, Select, Space, Modal, message, Statistic, Tag, Alert, Tabs } from 'antd';
import { DeleteOutlined, SaveOutlined, ExportOutlined, ReloadOutlined, ExperimentOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { confirm } = Modal;
const { TabPane } = Tabs;

interface TestDataSummary {
  record_status: string;
  students: number;
  assessments: number;
  mentoring_visits: number;
  total: number;
}

interface TestSession {
  id: string;
  user_id: number;
  user_role: string;
  status: string;
  started_at: string;
  expires_at: string | null;
  student_count: number;
  assessment_count: number;
  mentoring_visit_count: number;
}

export default function TestDataManagementPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<TestDataSummary[]>([]);
  const [sessions, setSessions] = useState<TestSession[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('test_mentor');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    fetchSummary();
    fetchSessions();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/admin/test-data/summary');
      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary || []);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/test-sessions/list');
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions || []);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleBulkDelete = () => {
    confirm({
      title: 'បញ្ជាក់ការលុប',
      content: `តើអ្នកប្រាកដថាចង់លុបទិន្នន័យសាកល្បងទាំងអស់ប្រភេទ "${selectedStatus}"?`,
      okText: 'លុប',
      okType: 'danger',
      cancelText: 'បោះបង់',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/bulk/delete-test-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record_status: selectedStatus })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(`បានលុប ${data.deleted.total} កំណត់ត្រា`);
            fetchSummary();
            fetchSessions();
          } else {
            message.error(data.error);
          }
        } catch (error) {
          message.error('មានបញ្ហាក្នុងការលុបទិន្នន័យ');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleBulkArchive = () => {
    confirm({
      title: 'បញ្ជាក់ការរក្សាទុក',
      content: `តើអ្នកចង់រក្សាទុកទិន្នន័យសាកល្បងប្រភេទ "${selectedStatus}"?`,
      okText: 'រក្សាទុក',
      cancelText: 'បោះបង់',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/bulk/archive-test-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record_status: selectedStatus })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(`បានរក្សាទុក ${data.archived.total} កំណត់ត្រា`);
            fetchSummary();
            fetchSessions();
          } else {
            message.error(data.error);
          }
        } catch (error) {
          message.error('មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handlePromoteToProduction = () => {
    confirm({
      title: 'បញ្ជាក់ការផ្លាស់ប្តូរ',
      content: `តើអ្នកចង់ផ្លាស់ប្តូរទិន្នន័យសាកល្បងប្រភេទ "${selectedStatus}" ទៅផលិតកម្ម?`,
      okText: 'ផ្លាស់ប្តូរ',
      cancelText: 'បោះបង់',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/test-data/promote-to-production', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ record_status: selectedStatus })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(`បានផ្លាស់ប្តូរ ${data.promoted.total} កំណត់ត្រា`);
            fetchSummary();
            fetchSessions();
          } else {
            message.error(data.error);
          }
        } catch (error) {
          message.error('មានបញ្ហាក្នុងការផ្លាស់ប្តូរទិន្នន័យ');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleExpireSession = (sessionId: string, action: 'delete' | 'archive') => {
    confirm({
      title: action === 'delete' ? 'បញ្ជាក់ការលុប' : 'បញ្ជាក់ការរក្សាទុក',
      content: `តើអ្នកចង់${action === 'delete' ? 'លុប' : 'រក្សាទុក'}ទិន្នន័យក្នុងសម័យនេះ?`,
      okText: action === 'delete' ? 'លុប' : 'រក្សាទុក',
      okType: action === 'delete' ? 'danger' : 'primary',
      cancelText: 'បោះបង់',
      onOk: async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/test-sessions/${sessionId}/expire`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(data.message);
            fetchSummary();
            fetchSessions();
          } else {
            message.error(data.error);
          }
        } catch (error) {
          message.error('មានបញ្ហា');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const summaryColumns: ColumnsType<TestDataSummary> = [
    {
      title: 'ស្ថានភាព',
      dataIndex: 'record_status',
      key: 'record_status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          test_mentor: 'blue',
          test_teacher: 'cyan',
          demo: 'orange',
          archived: 'default'
        };
        return <Tag color={colors[status] || 'default'}>{status}</Tag>;
      }
    },
    {
      title: 'សិស្ស',
      dataIndex: 'students',
      key: 'students',
      align: 'right'
    },
    {
      title: 'ការវាយតម្លៃ',
      dataIndex: 'assessments',
      key: 'assessments',
      align: 'right'
    },
    {
      title: 'ទស្សនកិច្ច',
      dataIndex: 'mentoring_visits',
      key: 'mentoring_visits',
      align: 'right'
    },
    {
      title: 'សរុប',
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      render: (total: number) => <strong>{total}</strong>
    }
  ];

  const sessionColumns: ColumnsType<TestSession> = [
    {
      title: 'លេខសម័យ',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <code className="text-xs">{id.substring(0, 8)}...</code>
    },
    {
      title: 'តួនាទី',
      dataIndex: 'user_role',
      key: 'user_role',
      render: (role: string) => <Tag>{role}</Tag>
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colors: Record<string, string> = {
          active: 'green',
          expired: 'red',
          archived: 'default',
          completed: 'blue'
        };
        return <Tag color={colors[status]}>{status}</Tag>;
      }
    },
    {
      title: 'ចាប់ផ្តើម',
      dataIndex: 'started_at',
      key: 'started_at',
      render: (date: string) => new Date(date).toLocaleDateString('km-KH')
    },
    {
      title: 'ផុតកំណត់',
      dataIndex: 'expires_at',
      key: 'expires_at',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString('km-KH') : '-'
    },
    {
      title: 'ទិន្នន័យ',
      key: 'counts',
      render: (record: TestSession) => (
        <Space>
          <Tag>S: {record.student_count}</Tag>
          <Tag>A: {record.assessment_count}</Tag>
          <Tag>V: {record.mentoring_visit_count}</Tag>
        </Space>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (record: TestSession) => (
        <Space>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleExpireSession(record.id, 'delete')}
            disabled={record.status === 'expired'}
          >
            លុប
          </Button>
          <Button
            size="small"
            icon={<SaveOutlined />}
            onClick={() => handleExpireSession(record.id, 'archive')}
            disabled={record.status === 'archived'}
          >
            រក្សាទុក
          </Button>
        </Space>
      )
    }
  ];

  const totalTestData = summary.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ExperimentOutlined />
            គ្រប់គ្រងទិន្នន័យសាកល្បង
          </h1>
          <p className="text-gray-600 mt-1">
            គ្រប់គ្រង លុប រក្សាទុក និងផ្លាស់ប្តូរទិន្នន័យសាកល្បង
          </p>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => {
          fetchSummary();
          fetchSessions();
        }}>
          ផ្ទុកឡើងវិញ
        </Button>
      </div>

      {/* Statistics */}
      <Card>
        <div className="grid grid-cols-4 gap-4">
          <Statistic
            title="ទិន្នន័យសាកល្បងសរុប"
            value={totalTestData}
            prefix={<ExperimentOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
          <Statistic
            title="សម័យសកម្ម"
            value={sessions.filter(s => s.status === 'active').length}
            valueStyle={{ color: '#52c41a' }}
          />
          <Statistic
            title="សម័យផុតកំណត់"
            value={sessions.filter(s => s.status === 'expired').length}
            valueStyle={{ color: '#ff4d4f' }}
          />
          <Statistic
            title="សម័យរក្សាទុក"
            value={sessions.filter(s => s.status === 'archived').length}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </div>
      </Card>

      <Tabs defaultActiveKey="summary">
        <TabPane tab="សង្ខេប" key="summary">
          {/* Summary Table */}
          <Card title="ទិន្នន័យសាកល្បងតាមប្រភេទ">
            <Table
              dataSource={summary}
              columns={summaryColumns}
              rowKey="record_status"
              pagination={false}
              loading={loading}
            />
          </Card>

          {/* Bulk Actions */}
          <Card title="សកម្មភាពជាបណ្តុំ" className="mt-4">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <Alert
                message="ប្រយ័ត្ន"
                description="សកម្មភាពទាំងនេះនឹងប៉ះពាល់ទិន្នន័យច្រើន សូមពិនិត្យជាមុនសិន"
                type="warning"
                showIcon
              />

              <Space>
                <span>ជ្រើសរើសប្រភេទ:</span>
                <Select
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  style={{ width: 200 }}
                >
                  <Option value="test_mentor">Test (Mentor)</Option>
                  <Option value="test_teacher">Test (Teacher)</Option>
                  <Option value="demo">Demo</Option>
                </Select>
              </Space>

              <Space>
                <Button
                  type="primary"
                  icon={<ExportOutlined />}
                  onClick={handlePromoteToProduction}
                  loading={loading}
                >
                  ផ្លាស់ប្តូរទៅផលិតកម្ម
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleBulkArchive}
                  loading={loading}
                >
                  រក្សាទុក
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBulkDelete}
                  loading={loading}
                >
                  លុបជាស្ថាពរ
                </Button>
              </Space>
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="សម័យសាកល្បង" key="sessions">
          {/* Sessions Table */}
          <Card title="សម័យសាកល្បងទាំងអស់">
            <Table
              dataSource={sessions}
              columns={sessionColumns}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}