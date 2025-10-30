'use client';

import { useState, useEffect } from 'react';
import { Input, Table, Space, Typography, Tag, Button, message, Alert } from 'antd';
import { SearchOutlined, UserAddOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import QuickStudentAdd from '../QuickStudentAdd';

const { Text, Title } = Typography;

interface Student {
  id: number;
  student_id?: string;
  name: string;
  sex?: string;
  gender?: string;
  grade?: number;
  grade_level?: number;
  school_class?: {
    id: number;
    name: string;
    grade: number;
  } | null;
  baseline_khmer_level?: string | null;
  baseline_math_level?: string | null;
  record_status?: string;
  assessment_status?: {
    baseline_language?: boolean;
    baseline_math?: boolean;
    midline_language?: boolean;
    midline_math?: boolean;
    endline_language?: boolean;
    endline_math?: boolean;
  };
}

interface StudentSelectionStepProps {
  selectedStudentId?: number;
  onSelect: (student: Student) => void;
}

export default function StudentSelectionStep({ selectedStudentId, onSelect }: StudentSelectionStepProps) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const urlStudentId = searchParams.get('student_id');
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showAddStudent, setShowAddStudent] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [urlStudentId]);

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
      // If student_id is in URL, fetch only that student
      if (urlStudentId) {
        const response = await fetch(`/api/students/${urlStudentId}`);
        if (response.ok) {
          const result = await response.json();
          const student = result.student;
          if (student) {
            setStudents([student]);
            setFilteredStudents([student]);
            // Auto-select this student
            onSelect(student);
          }
        } else {
          message.error('រកមិនឃើញសិស្ស');
        }
      } else {
        // Otherwise, fetch all students with assessment status
        const response = await fetch('/api/students?include_assessment_status=true');
        if (response.ok) {
          const result = await response.json();
          setStudents(result.data || []);
          setFilteredStudents(result.data || []);
        }
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
        <Space>
          <Text strong>{text}</Text>
          {record.id === selectedStudentId && (
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
          )}
        </Space>
      )
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (_: any, record: Student) => {
        const gender = record.sex || record.gender;
        const genderMap: Record<string, string> = {
          'male': 'ប្រុស',
          'female': 'ស្រី',
          'other': 'ផ្សេងទៀត',
          'ប្រុស': 'ប្រុស',
          'ស្រី': 'ស្រី'
        };
        const label = genderMap[gender as string] || gender || '-';
        const color = (gender === 'male' || gender === 'ប្រុស') ? 'blue' :
                     (gender === 'female' || gender === 'ស្រី') ? 'pink' : 'default';
        return <Tag color={color}>{label}</Tag>;
      }
    },
    {
      title: 'ថ្នាក់',
      key: 'grade',
      width: 100,
      render: (_: any, record: Student) => {
        const grade = record.grade || record.school_class?.grade || record.grade_level;
        return grade ? `ថ្នាក់ទី${grade}` : '-';
      }
    },
    {
      title: 'ការវាយតម្លៃ',
      key: 'assessments',
      width: 250,
      className: 'mobile-hide',
      render: (_: any, record: Student) => {
        const status = record.assessment_status || {};

        return (
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Space size={4} wrap>
              <Text type="secondary" style={{ fontSize: '11px', width: '35px' }}>ដើម:</Text>
              <Tag
                color={status.baseline_language ? 'blue' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.baseline_language ? '✓' : '−'} ខ្មែរ
              </Tag>
              <Tag
                color={status.baseline_math ? 'green' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.baseline_math ? '✓' : '−'} គណិត
              </Tag>
            </Space>
            <Space size={4} wrap>
              <Text type="secondary" style={{ fontSize: '11px', width: '35px' }}>កណ្ដាល:</Text>
              <Tag
                color={status.midline_language ? 'blue' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.midline_language ? '✓' : '−'} ខ្មែរ
              </Tag>
              <Tag
                color={status.midline_math ? 'green' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.midline_math ? '✓' : '−'} គណិត
              </Tag>
            </Space>
            <Space size={4} wrap>
              <Text type="secondary" style={{ fontSize: '11px', width: '35px' }}>ចុង:</Text>
              <Tag
                color={status.endline_language ? 'blue' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.endline_language ? '✓' : '−'} ខ្មែរ
              </Tag>
              <Tag
                color={status.endline_math ? 'green' : 'default'}
                style={{ fontSize: '10px', padding: '0 4px', margin: 0 }}
              >
                {status.endline_math ? '✓' : '−'} គណិត
              </Tag>
            </Space>
          </Space>
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
