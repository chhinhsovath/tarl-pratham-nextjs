'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Card,
  Popconfirm,
  Tag,
  App,
  Row,
  Col
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  ExportOutlined
} from '@ant-design/icons';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';
import { trackActivity } from '@/lib/trackActivity';
import { useSession } from 'next-auth/react';
import {
  ASSESSMENT_TYPE_LABELS_KM,
  MATH_LEVEL_LABELS_KM,
  LANGUAGE_LEVEL_LABELS_KM,
  getLevelLabelKM
} from '@/lib/constants/assessment-levels';

const { Title, Text } = Typography;
const { Option } = Select;

interface Student {
  id: number;
  student_id?: string;
  name: string;
  gender: string;
  age?: number;
  grade?: number;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  school_class_id?: number;
  pilot_school_id?: number;
  pilot_school?: {
    id: number;
    school_name: string;
    province?: string;
  };
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  assessments?: Array<{
    id: number;
    assessment_type: string;
    subject: string;
    level?: string;
    assessed_date?: string;
  }>;
}

function StudentsContent() {
  const router = useRouter();
  const { message } = App.useApp();
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [exportFilter, setExportFilter] = useState<'all' | 'both' | 'three'>('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all students by paginating through API (max 100 per request)
      let allStudents: Student[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await fetch(`/api/students?limit=100&page=${currentPage}`);
        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ API Error:', errorData);
          throw new Error(errorData.message || errorData.error || 'Failed to fetch students');
        }

        const data = await response.json();
        const students = data.data || [];
        allStudents = [...allStudents, ...students];

        console.log(`✅ Page ${currentPage} fetched: ${students.length} students (Total: ${allStudents.length}/${data.pagination?.total || 0})`);

        // Check if there are more pages
        if (data.pagination && currentPage < data.pagination.pages) {
          currentPage++;
        } else {
          hasMore = false;
        }
      }

      console.log(`✅ All students fetched: ${allStudents.length} total`);

      // Fetch assessments to populate assessment levels
      if (allStudents.length > 0) {
        const studentIds = allStudents.map(s => s.id);
        const assessmentResponse = await fetch(`/api/assessments/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ student_ids: studentIds })
        });

        if (assessmentResponse.ok) {
          const assessmentData = await assessmentResponse.json();
          const assessmentMap = new Map();

          // Build a map of student_id -> assessment levels
          assessmentData.forEach((assessment: any) => {
            const key = assessment.student_id;
            if (!assessmentMap.has(key)) {
              assessmentMap.set(key, {
                baseline_khmer_level: null,
                baseline_math_level: null,
                midline_khmer_level: null,
                midline_math_level: null,
                endline_khmer_level: null,
                endline_math_level: null
              });
            }

            const levels = assessmentMap.get(key);
            const subject = assessment.subject.toLowerCase().includes('khmer') ? 'khmer' : 'math';
            const levelKey = `${assessment.assessment_type.toLowerCase()}_${subject}_level`;

            if (assessment.level) {
              levels[levelKey] = assessment.level;
            }
          });

          // Merge assessment levels into students
          allStudents = allStudents.map(student => {
            const assessmentLevels = assessmentMap.get(student.id) || {};
            return {
              ...student,
              ...assessmentLevels
            };
          });

          console.log('✅ Assessment levels enriched');
        }
      }

      setStudents(allStudents);

      // Track activity: User viewed student list
      trackActivity('student_view');
    } catch (error: any) {
      console.error('Error fetching students:', error);
      message.error(error.message || 'មានបញ្ហាក្នុងការទាញយកទិន្នន័យសិស្ស');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (student: Student) => {
    router.push(`/students/${student.id}/edit`);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/students?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
        message.success('លុបសិស្សបានជោគជ័យ');
      } else {
        const error = await response.json();
        message.error(error.error || 'មានបញ្ហាក្នុងការលុបសិស្ស');
      }
    } catch (error) {
      console.error('Delete student error:', error);
      message.error('មានបញ្ហាក្នុងការលុបសិស្ស');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (exportFilter !== 'all') {
        params.append('assessment_filter', exportFilter);
      }

      const response = await fetch(`/api/students/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `students_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('ឯកសារលម្អិតសិស្សបានទាញចេញដោយជោគជ័យ');
      } else {
        const error = await response.json();
        message.error(error.error || 'មានបញ្ហាក្នុងការទាញចេញឯកសារ');
      }
    } catch (error) {
      console.error('Export error:', error);
      message.error('មានបញ្ហាក្នុងការទាញចេញឯកសារ');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const studentData = {
        student_id: values.student_id,
        name: values.name,
        gender: values.gender,
        grade: values.grade ? parseInt(values.grade) : undefined
      };

      if (editingStudent) {
        // Update existing student via API
        const response = await fetch('/api/students', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStudent.id, ...studentData })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'មានបញ្ហាក្នុងការធ្វើបច្ចុប្បន្នភាពសិស្ស');
        }

        const result = await response.json();
        setStudents(prev => prev.map(s => s.id === editingStudent.id ? result.data : s));
        message.success('ធ្វើបច្ចុប្បន្នភាពសិស្សបានជោគជ័យ! 🎉');
      } else {
        // Create new student via API
        const response = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(studentData)
        });

        if (!response.ok) {
          let error;
          try {
            error = await response.json();
            console.error('❌ API Error Response:', error);
          } catch (jsonError) {
            const text = await response.text();
            console.error('❌ Non-JSON Error Response:', text);
            throw new Error(`បញ្ហាម៉ាស៊ីនមេ (${response.status}): ${text.substring(0, 200)}`);
          }
          throw new Error(error.message || error.error || 'មានបញ្ហាក្នុងការបន្ថែមសិស្ស');
        }

        const result = await response.json();
        setStudents(prev => [result.data, ...prev]);
        message.success('បន្ថែមសិស្សបានជោគជ័យ! 🎉');
      }

      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('❌ Error saving student:', error);
      message.error(error instanceof Error ? error.message : 'មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ សូមព្យាយាមម្តងទៀត');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      // Count total assessments for each student
      const countAssessments = (student: Student) => {
        let count = 0;
        if (student.baseline_khmer_level) count++;
        if (student.baseline_math_level) count++;
        if (student.midline_khmer_level) count++;
        if (student.midline_math_level) count++;
        if (student.endline_khmer_level) count++;
        if (student.endline_math_level) count++;
        return count;
      };

      const aCount = countAssessments(a);
      const bCount = countAssessments(b);

      // Sort descending: students with more assessments first
      return bCount - aCount;
    });

  const columns = [
    {
      title: 'លេខសម្គាល់សិស្ស',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 150,
      render: (student_id: string) => student_id || '-',
    },
    {
      title: 'ឈ្មោះសិស្ស',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Student) => (
        <Space>
          <UserOutlined style={{ color: record.gender === 'male' ? '#1890ff' : '#f759ab' }} />
          <strong>{text}</strong>
        </Space>
      ),
    },
    {
      title: 'ភេទ',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender: string) => {
        const genderMap = {
          'male': 'ប្រុស',
          'female': 'ស្រី',
          'other': 'ផ្សេងទៀត',
          'ប្រុស': 'ប្រុស',
          'ស្រី': 'ស្រី'
        };
        const label = genderMap[gender as keyof typeof genderMap] || gender || '-';
        return (
          <Tag color={gender === 'male' || gender === 'ប្រុស' ? 'blue' : gender === 'female' || gender === 'ស្រី' ? 'pink' : 'default'}>
            {label}
          </Tag>
        );
      },
    },
    {
      title: 'ថ្នាក់',
      dataIndex: 'grade',
      key: 'grade',
      width: 100,
      render: (grade: number) => grade ? `ថ្នាក់ទី${grade}` : '-',
    },
    {
      title: 'ការវាយតម្លៃ',
      key: 'assessment_levels',
      width: 200,
      render: (_: any, record: Student) => {
        const levels = [];
        const assessmentCounts = {
          baseline: (record.baseline_khmer_level ? 1 : 0) + (record.baseline_math_level ? 1 : 0),
          midline: (record.midline_khmer_level ? 1 : 0) + (record.midline_math_level ? 1 : 0),
          endline: (record.endline_khmer_level ? 1 : 0) + (record.endline_math_level ? 1 : 0),
        };

        if (assessmentCounts.baseline > 0) levels.push('Baseline');
        if (assessmentCounts.midline > 0) levels.push('Midline');
        if (assessmentCounts.endline > 0) levels.push('Endline');

        return (
          <Space size="small" wrap>
            {levels.length > 0 ? (
              levels.map((level, idx) => (
                <Tag key={idx} color={level === 'Baseline' ? 'blue' : level === 'Midline' ? 'orange' : 'green'}>
                  {level}
                </Tag>
              ))
            ) : (
              <Tag color="default">មិនទាន់</Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_: any, record: Student) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/students/${record.id}`)}
            title="មើលព័ត៌មានសិស្ស"
            size="small"
          />
          <Button
            type="primary"
            size="small"
            icon={<FileTextOutlined />}
            onClick={() => router.push(`/assessments/create?student_id=${record.id}`)}
            title="បង្កើតការវាយតម្លៃ"
          >
            វាយតម្លៃ
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            title="កែសម្រួលសិស្ស"
            size="small"
          />
          <Popconfirm
            title="លុបសិស្ស"
            description="តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?"
            onConfirm={() => handleDelete(record.id)}
            okText="យល់ព្រម"
            cancelText="បោះបង់"
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              title="លុបសិស្ស"
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <Card bodyStyle={{ padding: '16px' }}>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={24} md={12}>
              <Title level={2} style={{ margin: 0, fontSize: '20px' }}>គ្រប់គ្រងសិស្ស</Title>
              <Text type="secondary" className="hidden md:block">គ្រប់គ្រង និងតាមដានព័ត៌មានសិស្សរបស់អ្នក</Text>
            </Col>
            <Col xs={24} md={12}>
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAdd}
                  size="large"
                  className="flex-1 md:flex-none"
                >
                  បន្ថែមសិស្សថ្មី
                </Button>
                <Select
                  value={exportFilter}
                  onChange={setExportFilter}
                  style={{ width: 200 }}
                  size="large"
                  className="flex-1 md:flex-none"
                >
                  <Option value="all">ការវាយតម្លៃទាំងអស់</Option>
                  <Option value="both">Baseline + Endline</Option>
                  <Option value="three">Baseline + Midline + Endline</Option>
                </Select>
                <Button
                  icon={<ExportOutlined />}
                  onClick={handleExport}
                  size="large"
                  className="flex-1 md:flex-none"
                >
                  ទាញចេញ
                </Button>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Search and Filters */}
        <Card bodyStyle={{ padding: '16px' }}>
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={14}>
              <Input
                placeholder="ស្វែងរកឈ្មោះសិស្ស..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                size="large"
              />
            </Col>
            <Col xs={12} md={5}>
              <Select placeholder="ភេទ" style={{ width: '100%' }} allowClear size="large">
                <Option value="male">ប្រុស</Option>
                <Option value="female">ស្រី</Option>
                <Option value="other">ផ្សេងទៀត</Option>
              </Select>
            </Col>
            <Col xs={12} md={5}>
              <Select placeholder="ស្ថានភាព" style={{ width: '100%' }} allowClear size="large">
                <Option value="true">សកម្ម</Option>
                <Option value="false">អសកម្ម</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Students List - Mobile-First Card Design */}
        <div className="students-list">
          {/* Desktop: Show Table */}
          <Card className="hidden md:block">
            <Table
              scroll={{ x: 1000 }}
              columns={columns}
              dataSource={filteredStudents}
              rowKey="id"
              loading={loading}
              pagination={{
                total: filteredStudents.length,
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} ពី ${total} សិស្ស`,
              }}
              size="middle"
            />
          </Card>

          {/* Mobile: Show Cards */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <Card>
                <div className="text-center py-8">
                  <Text>កំពុងផ្ទុក...</Text>
                </div>
              </Card>
            ) : filteredStudents.length === 0 ? (
              <Card>
                <div className="text-center py-8">
                  <Text type="secondary">មិនមានសិស្ស</Text>
                </div>
              </Card>
            ) : (
              filteredStudents.map((student, index) => (
                <Card
                  key={student.id}
                  className="student-card-modern"
                  style={{
                    borderRadius: '16px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  bodyStyle={{ padding: 0 }}
                  hoverable
                >
                  {/* Card Header with Gradient */}
                  <div style={{
                    background: student.gender === 'male' || student.gender === 'ប្រុស'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    padding: '20px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                  }}>
                    {/* Student Number Counter */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '50px',
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.3)',
                      backdropFilter: 'blur(10px)',
                      fontSize: '28px',
                      color: 'white',
                      fontWeight: 700,
                      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      flexShrink: 0
                    }}>
                      {index + 1}
                    </div>

                    {/* Student ID Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(10px)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      color: 'white',
                      fontWeight: 600
                    }}>
                      #{student.student_id || student.id}
                    </div>

                    {/* Student Name and Icon */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: 'white',
                        flexShrink: 0
                      }}>
                        <UserOutlined />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: 'white',
                          fontSize: '16px',
                          fontWeight: 700,
                          marginBottom: '4px',
                          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {student.name}
                        </div>
                        {student.pilot_school && (
                          <div style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: '12px',
                            marginBottom: '4px',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {student.pilot_school.school_name}
                          </div>
                        )}
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: 'rgba(255,255,255,0.25)',
                            backdropFilter: 'blur(10px)',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: 'white',
                            fontWeight: 600
                          }}>
                            {student.gender === 'male' || student.gender === 'ប្រុស' ? 'ប្រុស' : student.gender === 'female' || student.gender === 'ស្រី' ? 'ស្រី' : student.gender || '-'}
                          </span>
                          {student.grade && (
                            <span style={{
                              background: 'rgba(255,255,255,0.25)',
                              backdropFilter: 'blur(10px)',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: 600
                            }}>
                              ថ្នាក់ទី{student.grade}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body - Assessment Levels */}
                  <div style={{ padding: '20px' }}>
                    {/* Baseline */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{
                        fontSize: '11px',
                        color: '#8c8c8c',
                        marginBottom: '8px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '16px',
                          height: '16px',
                          borderRadius: '3px',
                          background: '#667eea',
                          color: 'white',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>1</span>
                        តេស្តដើមគ្រា (Baseline)
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {student.baseline_khmer_level ? (
                          <span style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(102,126,234,0.3)'
                          }}>
                            ភាសាខ្មែរ: {LANGUAGE_LEVEL_LABELS_KM[student.baseline_khmer_level as keyof typeof LANGUAGE_LEVEL_LABELS_KM] || student.baseline_khmer_level}
                          </span>
                        ) : null}
                        {student.baseline_math_level ? (
                          <span style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(17,153,142,0.3)'
                          }}>
                            គណិតវិទ្យា: {MATH_LEVEL_LABELS_KM[student.baseline_math_level as keyof typeof MATH_LEVEL_LABELS_KM] || student.baseline_math_level}
                          </span>
                        ) : null}
                        {!student.baseline_khmer_level && !student.baseline_math_level && (
                          <span style={{ fontSize: '13px', color: '#bfbfbf' }}>មិនទាន់មាន</span>
                        )}
                      </div>
                    </div>

                    {/* Midline */}
                    {(student.midline_khmer_level || student.midline_math_level) && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#8c8c8c',
                          marginBottom: '8px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            background: '#fa709a',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 700
                          }}>2</span>
                          តេស្តពាក់កណ្ដាលគ្រា (Midline)
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {student.midline_khmer_level && (
                            <span style={{
                              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              boxShadow: '0 2px 4px rgba(240,147,251,0.3)'
                            }}>
                              ភាសាខ្មែរ: {LANGUAGE_LEVEL_LABELS_KM[student.midline_khmer_level as keyof typeof LANGUAGE_LEVEL_LABELS_KM] || student.midline_khmer_level}
                            </span>
                          )}
                          {student.midline_math_level && (
                            <span style={{
                              background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                              color: 'white',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              boxShadow: '0 2px 4px rgba(250,112,154,0.3)'
                            }}>
                              គណិតវិទ្យា: {MATH_LEVEL_LABELS_KM[student.midline_math_level as keyof typeof MATH_LEVEL_LABELS_KM] || student.midline_math_level}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Endline */}
                    {(student.endline_khmer_level || student.endline_math_level) && (
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{
                          fontSize: '11px',
                          color: '#8c8c8c',
                          marginBottom: '8px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: '16px',
                            height: '16px',
                            borderRadius: '3px',
                            background: '#52c41a',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 700
                          }}>3</span>
                          តេស្តចុងក្រោយគ្រា (Endline)
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {student.endline_khmer_level && (
                            <span style={{
                              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                              color: '#333',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              boxShadow: '0 2px 4px rgba(168,237,234,0.3)'
                            }}>
                              ភាសាខ្មែរ: {LANGUAGE_LEVEL_LABELS_KM[student.endline_khmer_level as keyof typeof LANGUAGE_LEVEL_LABELS_KM] || student.endline_khmer_level}
                            </span>
                          )}
                          {student.endline_math_level && (
                            <span style={{
                              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                              color: '#333',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 600,
                              boxShadow: '0 2px 4px rgba(255,236,210,0.3)'
                            }}>
                              គណិតវិទ្យា: {MATH_LEVEL_LABELS_KM[student.endline_math_level as keyof typeof MATH_LEVEL_LABELS_KM] || student.endline_math_level}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer - Actions */}
                  <div style={{
                    padding: '16px 20px',
                    background: '#fafafa',
                    borderTop: '1px solid #f0f0f0',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <Button
                      type="primary"
                      icon={<FileTextOutlined />}
                      onClick={() => router.push(`/assessments/create?student_id=${student.id}`)}
                      style={{
                        flex: 1,
                        borderRadius: '8px',
                        fontWeight: 600,
                        height: '40px'
                      }}
                    >
                      វាយតម្លៃ
                    </Button>
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => router.push(`/students/${student.id}`)}
                      style={{
                        borderRadius: '8px',
                        height: '40px',
                        width: '40px'
                      }}
                    />
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(student)}
                      style={{
                        borderRadius: '8px',
                        height: '40px',
                        width: '40px'
                      }}
                    />
                    <Popconfirm
                      title="លុបសិស្ស"
                      description="តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?"
                      onConfirm={() => handleDelete(student.id)}
                      okText="យល់ព្រម"
                      cancelText="បោះបង់"
                    >
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        style={{
                          borderRadius: '8px',
                          height: '40px',
                          width: '40px'
                        }}
                      />
                    </Popconfirm>
                  </div>
                </Card>
              ))
            )}

            {/* Mobile Pagination Info */}
            {filteredStudents.length > 0 && (
              <Card>
                <div className="text-center">
                  <Text type="secondary">
                    សរុប: {filteredStudents.length} សិស្ស
                  </Text>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Space>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? 'កែប្រែសិស្ស' : 'បន្ថែមសិស្សថ្មី'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="លេខសម្គាល់សិស្ស"
            name="student_id"
            rules={[{ required: true, message: 'សូមបញ្ចូលលេខសម្គាល់សិស្ស!' }]}
          >
            <Input placeholder="បញ្ចូលលេខសម្គាល់សិស្ស" size="large" />
          </Form.Item>

          <Form.Item
            label="ឈ្មោះសិស្ស"
            name="name"
            rules={[{ required: true, message: 'សូមបញ្ចូលឈ្មោះសិស្ស!' }]}
          >
            <Input placeholder="បញ្ចូលឈ្មោះពេញ" size="large" />
          </Form.Item>

          <Form.Item
            label="ភេទ"
            name="gender"
            rules={[{ required: true, message: 'សូមជ្រើសរើសភេទ!' }]}
          >
            <Select placeholder="ជ្រើសរើសភេទ" size="large">
              <Option value="male">ប្រុស</Option>
              <Option value="female">ស្រី</Option>
              <Option value="other">ផ្សេងទៀត</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="ថ្នាក់"
            name="grade"
            rules={[{ required: true, message: 'សូមជ្រើសរើសថ្នាក់!' }]}
          >
            <Select placeholder="ជ្រើសរើសថ្នាក់" size="large">
              <Option value={4}>ថ្នាក់ទី៤</Option>
              <Option value={5}>ថ្នាក់ទី៥</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)} disabled={submitting}>
                បោះបង់
              </Button>
              <Button type="primary" htmlType="submit" loading={submitting}>
                {editingStudent ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បន្ថែម'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default function StudentsPage() {
  return (
    <App>
      <HorizontalLayout>
        <StudentsContent />
      </HorizontalLayout>
    </App>
  );
}