'use client';

import { useState, useEffect } from 'react';
import { Input, Table, Space, Typography, Tag, Button, message, Alert } from 'antd';
import { SearchOutlined, UserAddOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import QuickStudentAdd from '../QuickStudentAdd';

const { Text, Title } = Typography;

interface Student {
  id: number;
  name: string;
  sex: string;
  grade_level: number;
  baseline_khmer_level?: string | null;
  baseline_math_level?: string | null;
  record_status: string;
}

interface StudentSelectionStepProps {
  selectedStudentId?: number;
  onSelect: (student: Student) => void;
}

export default function StudentSelectionStep({ selectedStudentId, onSelect }: StudentSelectionStepProps) {
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchText, students]);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const result = await response.json();
        setStudents(result.data || []);
        setFilteredStudents(result.data || []);
      }
    } catch (error) {
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Student) => (
        <Space direction="vertical" size={4}>
          <Space>
            <Text strong>{text}</Text>
            {record.id === selectedStudentId && (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            )}
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.sex === 'male' ? 'ប្រុស' : 'ស្រី'}
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              ថ្នាក់ទី{record.grade_level}
            </Text>
          </Space>
        </Space>
      )
    },
    {
      title: 'ភេទ',
      dataIndex: 'sex',
      key: 'sex',
      width: 80,
      className: 'mobile-hide',
      render: (sex: string) => sex === 'male' ? 'ប្រុស' : 'ស្រី'
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade_level',
      key: 'grade_level',
      width: 80,
      className: 'mobile-hide',
      render: (grade: number) => `ថ្នាក់ទី${grade}`
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 120,
      className: 'mobile-hide',
      render: (_: any, record: Student) => {
        const hasBaseline = record.baseline_khmer_level || record.baseline_math_level;
        return hasBaseline ? (
          <Tag color="green">បានធ្វើតេស្ត</Tag>
        ) : (
          <Tag color="orange">មិនទាន់ធ្វើ</Tag>
        );
      }
    },
    {
      title: '',
      key: 'action',
      width: 100,
      render: (_: any, record: Student) => (
        <Button
          type={record.id === selectedStudentId ? 'primary' : 'default'}
          size="small"
          onClick={() => onSelect(record)}
          style={{ minHeight: '40px' }}
        >
          {record.id === selectedStudentId ? 'បានជ្រើសរើស' : 'ជ្រើសរើស'}
        </Button>
      )
    }
  ];

  const handleStudentAdded = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
    setFilteredStudents(prev => [newStudent, ...prev]);
    setShowAddStudent(false);
    onSelect(newStudent);
    message.success('សិស្សត្រូវបានជ្រើសរើសដោយស្វ័យប្រវត្តិ');
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={4}>ជ្រើសរើសសិស្សម្នាក់</Title>
        <Text type="secondary">
          ជ្រើសរើសសិស្សពីបញ្ជីខាងក្រោម ឬបន្ថែមសិស្សថ្មី
        </Text>
      </div>

      {session?.user?.role === 'mentor' && (
        <Alert
          message="អ្នកណែនាំ"
          description="ទិន្នន័យសិស្សដែលអ្នកបង្កើតនឹងត្រូវរក្សាទុកជាទិន្នន័យបណ្តោះអាសន្នសម្រាប់ការបង្ហាញ"
          type="info"
          showIcon
        />
      )}

      {/* Quick Add Student Form */}
      {showAddStudent && (
        <QuickStudentAdd
          onSuccess={handleStudentAdded}
          onCancel={() => setShowAddStudent(false)}
        />
      )}

      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Input
          placeholder="ស្វែងរកសិស្ស..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '300px' }}
          size="large"
        />
        <Button
          type="dashed"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => setShowAddStudent(!showAddStudent)}
        >
          {showAddStudent ? 'បិទ' : 'បន្ថែមសិស្សថ្មី'}
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `សរុប ${total} នាក់`
        }}
        rowClassName={(record) =>
          record.id === selectedStudentId ? 'ant-table-row-selected' : ''
        }
      />

      {selectedStudentId && (
        <Alert
          message={`បានជ្រើសរើស: ${students.find(s => s.id === selectedStudentId)?.name}`}
          type="success"
          showIcon
        />
      )}
    </Space>
  );
}
