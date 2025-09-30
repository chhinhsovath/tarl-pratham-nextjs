'use client';

import { useState, useEffect } from 'react';
import { Switch, Alert, Spin, Modal, Statistic, Button, Space } from 'antd';
import { ExperimentOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface TestModeToggleProps {
  userId: number;
  initialEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
  showStats?: boolean;
}

interface TestModeStatus {
  user: {
    id: number;
    name: string;
    role: string;
    test_mode_enabled: boolean;
    can_use_test_mode: boolean;
  };
  active_session?: {
    id: string;
    expires_at: string;
    status: string;
  } | null;
  test_data_count: {
    students: number;
    assessments: number;
    mentoring_visits: number;
    total: number;
  };
}

export default function TestModeToggle({
  userId,
  initialEnabled = false,
  onToggle,
  showStats = true
}: TestModeToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<TestModeStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Fetch test mode status
  useEffect(() => {
    fetchStatus();
  }, [userId]);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/toggle-test-mode`);
      const data = await response.json();

      if (response.ok) {
        setStatus(data);
        setEnabled(data.user.test_mode_enabled);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Failed to fetch test mode status:', err);
      setError('មិនអាចទាញយកស្ថានភាពរបៀបសាកល្បង');
    }
  };

  const handleToggle = async (checked: boolean) => {
    // If disabling and has test data, show warning
    if (!checked && status && status.test_data_count.total > 0) {
      setShowWarningModal(true);
      return;
    }

    await performToggle(checked);
  };

  const performToggle = async (checked: boolean) => {
    setLoading(true);
    setError(null);
    setShowWarningModal(false);

    try {
      const response = await fetch(`/api/users/${userId}/toggle-test-mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: checked })
      });

      const data = await response.json();

      if (response.ok) {
        setEnabled(checked);
        await fetchStatus(); // Refresh status
        onToggle?.(checked);
      } else {
        setError(data.error || data.warning);
        // If there's test data warning, show the counts
        if (data.test_data_count) {
          setStatus(prev => prev ? {
            ...prev,
            test_data_count: data.test_data_count
          } : null);
        }
      }
    } catch (err) {
      console.error('Toggle test mode error:', err);
      setError('មានបញ្ហាក្នុងការកែប្រែរបៀបសាកល្បង');
    } finally {
      setLoading(false);
    }
  };

  if (!status) {
    return <Spin />;
  }

  if (!status.user.can_use_test_mode) {
    return (
      <Alert
        message="មិនអាចប្រើរបៀបសាកល្បង"
        description="មានតែគ្រូបង្រៀនប៉ុណ្ណោះដែលអាចប្រើរបៀបសាកល្បង"
        type="info"
        showIcon
      />
    );
  }

  const hasTestData = status.test_data_count.total > 0;
  const hasActiveSession = status.active_session !== null;

  return (
    <div className="test-mode-toggle">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <ExperimentOutlined style={{ fontSize: '24px', color: enabled ? '#52c41a' : '#8c8c8c' }} />
            <div>
              <div className="font-semibold text-base">
                {enabled ? 'របៀបសាកល្បងបើកដំណើរការ' : 'របៀបសាកល្បងបិទ'}
              </div>
              <div className="text-sm text-gray-600">
                {enabled
                  ? 'ទិន្នន័យដែលបង្កើតនឹងត្រូវកំណត់ជាទិន្នន័យសាកល្បង'
                  : 'ទិន្នន័យដែលបង្កើតនឹងត្រូវកំណត់ជាទិន្នន័យផលិតកម្ម'}
              </div>
            </div>
          </div>
          <Switch
            checked={enabled}
            onChange={handleToggle}
            loading={loading}
            checkedChildren="បើក"
            unCheckedChildren="បិទ"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            message="កំហុស"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}

        {/* Active Session Info */}
        {hasActiveSession && (
          <Alert
            message="សម័យសាកល្បងសកម្ម"
            description={
              <div>
                <div>លេខសម័យ: {status.active_session?.id}</div>
                <div>ផុតកំណត់: {new Date(status.active_session!.expires_at).toLocaleString('km-KH')}</div>
              </div>
            }
            type="info"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}

        {/* Test Data Statistics */}
        {showStats && hasTestData && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-base font-semibold mb-3">ទិន្នន័យសាកល្បង</div>
            <div className="grid grid-cols-3 gap-4">
              <Statistic
                title="សិស្ស"
                value={status.test_data_count.students}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="ការវាយតម្លៃ"
                value={status.test_data_count.assessments}
                valueStyle={{ color: '#1890ff' }}
              />
              <Statistic
                title="ទស្សនកិច្ច"
                value={status.test_data_count.mentoring_visits}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <Statistic
                title="សរុប"
                value={status.test_data_count.total}
                valueStyle={{ color: '#0050b3', fontWeight: 'bold' }}
              />
            </div>
          </div>
        )}

        {/* Help Text */}
        <Alert
          message="អំពីរបៀបសាកល្បង"
          description={
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>បើករបៀបសាកល្បងដើម្បីសាកល្បងលើមុខងារមិនប៉ះពាល់ទិន្នន័យផលិតកម្ម</li>
              <li>ទិន្នន័យសាកល្បងនឹងត្រូវកំណត់ពេលផុតកំណត់ក្នុងរយៈពេល ៧ ថ្ងៃ</li>
              <li>អ្នកអាចលុប ឬផ្លាស់ប្តូរទិន្នន័យសាកល្បងទៅផលិតកម្មបាន</li>
              <li>បិទរបៀបសាកល្បងជាមុនសិននៅពេលចង់ធ្វើការជាមួយទិន្នន័យពិត</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Space>

      {/* Warning Modal for Disabling with Test Data */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <WarningOutlined style={{ color: '#faad14' }} />
            <span>មានទិន្នន័យសាកល្បងនៅសេសសល់</span>
          </div>
        }
        open={showWarningModal}
        onCancel={() => setShowWarningModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowWarningModal(false)}>
            បោះបង់
          </Button>,
          <Button
            key="manage"
            type="primary"
            onClick={() => {
              setShowWarningModal(false);
              // Navigate to test data management page
              window.location.href = '/admin/test-data';
            }}
          >
            គ្រប់គ្រងទិន្នន័យ
          </Button>
        ]}
      >
        <div className="space-y-4">
          <p>
            អ្នកមានទិន្នន័យសាកល្បង <strong>{status.test_data_count.total}</strong> កំណត់ត្រា។
            សូមលុប ឬផ្លាស់ប្តូរទៅផលិតកម្មជាមុនសិន។
          </p>

          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm space-y-1">
              <div>សិស្ស: {status.test_data_count.students}</div>
              <div>ការវាយតម្លៃ: {status.test_data_count.assessments}</div>
              <div>ទស្សនកិច្ចណែនាំ: {status.test_data_count.mentoring_visits}</div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}