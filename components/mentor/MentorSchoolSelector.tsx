'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Select, Button, Alert, Space, Typography, Card, Row, Col, Tag, message } from 'antd';
import { BankOutlined, CheckCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface PilotSchool {
  id: number;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  cluster: string;
}

interface MentorSchoolSelectorProps {
  visible: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  forceSelection?: boolean; // If true, user cannot close modal without selecting
}

export default function MentorSchoolSelector({
  visible,
  onSuccess,
  onCancel,
  forceSelection = false
}: MentorSchoolSelectorProps) {
  const [schools, setSchools] = useState<PilotSchool[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<'Language' | 'Math' | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      fetchSchools();
    }
  }, [visible]);

  const fetchSchools = async () => {
    setLoadingSchools(true);
    setError(null);
    try {
      const response = await fetch('/api/pilot-schools');
      if (!response.ok) throw new Error('Failed to fetch schools');

      const data = await response.json();
      // API returns { data: [...schools] }
      setSchools(data.data || []);
    } catch (err: any) {
      console.error('Error fetching schools:', err);
      setError('មិនអាចទាញយកបញ្ជីសាលារៀន');
    } finally {
      setLoadingSchools(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedSchoolId) {
      message.warning('សូមជ្រើសរើសសាលារៀនមួយ');
      return;
    }

    if (!selectedSubject) {
      message.warning('សូមជ្រើសរើសមុខវិជ្ជា');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/mentor/assign-school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilot_school_id: selectedSchoolId,
          subject: selectedSubject
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to assign school');
      }

      message.success('បានជ្រើសរើសសាលារៀនដោយជោគជ័យ!');

      // Reload the page to refresh session data
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      onSuccess();
    } catch (err: any) {
      console.error('Error assigning school:', err);
      setError(err.message || 'មានបញ្ហាក្នុងការកំណត់សាលារៀន');
      message.error(err.message || 'មានបញ្ហាក្នុងការកំណត់សាលារៀន');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (forceSelection) {
      message.warning('អ្នកត្រូវតែជ្រើសរើសសាលារៀនមួយដើម្បីបន្ត');
      return;
    }
    if (onCancel) {
      onCancel();
    }
  };

  const selectedSchool = schools.find(s => s.id === selectedSchoolId);

  return (
    <Modal
      title={
        <Space direction="vertical" size={0}>
          <Title level={4} style={{ margin: 0 }}>
            <BankOutlined /> ជ្រើសរើសសាលារៀនរបស់អ្នក
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Select Your School Assignment
          </Text>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      closable={!forceSelection}
      maskClosable={!forceSelection}
      width={700}
      footer={[
        !forceSelection && (
          <Button key="cancel" onClick={handleCancel}>
            បោះបង់
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={!selectedSchoolId || !selectedSubject}
          icon={<CheckCircleOutlined />}
        >
          បញ្ជាក់ការជ្រើសរើស
        </Button>
      ]}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {forceSelection && (
          <Alert
            message="ត្រូវការជ្រើសរើសសាលារៀន"
            description="អ្នកត្រូវតែជ្រើសរើសសាលារៀនមួយ និងមុខវិជ្ជាមួយ ដើម្បីអាចបង្កើតការវាយតម្លៃបាន។"
            type="warning"
            showIcon
          />
        )}

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

        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* School Selection */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                <BankOutlined /> សាលារៀន (School) <Text type="danger">*</Text>
              </Text>
              <Select
                showSearch
                placeholder="ជ្រើសរើសសាលារៀន..."
                style={{ width: '100%' }}
                value={selectedSchoolId}
                onChange={setSelectedSchoolId}
                loading={loadingSchools}
                disabled={loadingSchools}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                options={schools.map(school => ({
                  value: school.id,
                  label: `${school.school_name} (${school.school_code})`,
                  school: school
                }))}
                optionRender={(option) => {
                  const school = option.data.school as PilotSchool;
                  return (
                    <Space direction="vertical" size={0}>
                      <Text strong>{school.school_name}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <EnvironmentOutlined /> {school.province} - {school.district} - {school.cluster}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        កូដ: {school.school_code}
                      </Text>
                    </Space>
                  );
                }}
              />
            </div>

            {/* Subject Selection */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                មុខវិជ្ជា (Subject) <Text type="danger">*</Text>
              </Text>
              <Select
                placeholder="ជ្រើសរើសមុខវិជ្ជា..."
                style={{ width: '100%' }}
                value={selectedSubject}
                onChange={setSelectedSubject}
              >
                <Option value="Language">
                  <Tag color="blue">ភាសា (Language)</Tag>
                </Option>
                <Option value="Math">
                  <Tag color="green">គណិតវិទ្យា (Math)</Tag>
                </Option>
              </Select>
              <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                ជ្រើសរើសមុខវិជ្ជាដែលអ្នកនឹងណែនាំនៅសាលារៀននេះ
              </Text>
            </div>

            {/* Preview Selected School */}
            {selectedSchool && selectedSubject && (
              <Card
                size="small"
                style={{ backgroundColor: '#f0f5ff', border: '1px solid #adc6ff' }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong style={{ color: '#1890ff' }}>
                    <CheckCircleOutlined /> ការជ្រើសរើសរបស់អ្នក:
                  </Text>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>សាលារៀន:</Text>
                      <br />
                      <Text strong>{selectedSchool.school_name}</Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary" style={{ fontSize: 12 }}>មុខវិជ្ជា:</Text>
                      <br />
                      <Tag color={selectedSubject === 'Language' ? 'blue' : 'green'}>
                        {selectedSubject === 'Language' ? 'ភាសា' : 'គណិតវិទ្យា'}
                      </Tag>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: 12 }}>ខេត្ត:</Text>
                      <br />
                      <Text>{selectedSchool.province}</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: 12 }}>ស្រុក:</Text>
                      <br />
                      <Text>{selectedSchool.district}</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: 12 }}>ក្រុម:</Text>
                      <br />
                      <Text>{selectedSchool.cluster}</Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            )}
          </Space>
        </Card>

        <Alert
          message="ព័ត៌មាន"
          description="បន្ទាប់ពីជ្រើសរើសសាលារៀន អ្នកនឹងអាចបង្កើតការវាយតម្លៃសម្រាប់សិស្សនៅសាលារៀននោះ។ អ្នកអាចផ្លាស់ប្តូរសាលារៀនពេលក្រោយបាន។"
          type="info"
          showIcon
          style={{ fontSize: 12 }}
        />
      </Space>
    </Modal>
  );
}
