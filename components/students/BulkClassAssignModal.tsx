'use client';

import { useState } from 'react';
import { Modal, Form, Select, message, Typography } from 'antd';
import { useSession } from 'next-auth/react';

const { Text } = Typography;
const { Option } = Select;

interface BulkClassAssignModalProps {
  visible: boolean;
  studentIds: number[];
  pilotSchoolId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BulkClassAssignModal({
  visible,
  studentIds,
  pilotSchoolId,
  onSuccess,
  onCancel
}: BulkClassAssignModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await fetch('/api/students/bulk-assign-class', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_ids: studentIds,
          grade: values.grade,
          pilot_school_id: pilotSchoolId,
          class_name: `ថ្នាក់ទី${values.grade}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message || 'កំណត់ថ្នាក់បានជោគជ័យ');
        form.resetFields();
        onSuccess();
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការកំណត់ថ្នាក់');
      }
    } catch (error: any) {
      console.error('Error assigning class:', error);
      message.error('មានបញ្ហាក្នុងការកំណត់ថ្នាក់');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`កំណត់ថ្នាក់សម្រាប់សិស្ស ${studentIds.length} នាក់`}
      open={visible}
      onOk={handleSubmit}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      confirmLoading={loading}
      okText="កំណត់ថ្នាក់"
      cancelText="បោះបង់"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '24px' }}
      >
        <Form.Item
          name="grade"
          label="ជ្រើសរើសកម្រិតថ្នាក់"
          rules={[{ required: true, message: 'សូមជ្រើសរើសកម្រិតថ្នាក់' }]}
        >
          <Select
            placeholder="ជ្រើសរើសថ្នាក់"
            size="large"
          >
            <Option value={1}>ថ្នាក់ទី១</Option>
            <Option value={2}>ថ្នាក់ទី២</Option>
            <Option value={3}>ថ្នាក់ទី៣</Option>
            <Option value={4}>ថ្នាក់ទី៤</Option>
            <Option value={5}>ថ្នាក់ទី៥</Option>
            <Option value={6}>ថ្នាក់ទី៦</Option>
          </Select>
        </Form.Item>

        <Text type="secondary">
          ការកំណត់នេះនឹងបង្កើតថ្នាក់ថ្មី ប្រសិនបើវាមិនទាន់មាន។
        </Text>
      </Form>
    </Modal>
  );
}
