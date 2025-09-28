'use client';

import React, { useState, useEffect } from 'react';
import {
  Form,
  Table,
  Input,
  Select,
  Button,
  Card,
  Space,
  message,
  Alert,
  Tag,
  Row,
  Col,
  Statistic,
  Modal,
  Checkbox,
  Radio,
  DatePicker,
  Typography,
  Divider,
  Upload,
  Progress
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FileExcelOutlined,
  DownloadOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface Student {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  pilot_school_id?: number;
  baseline_khmer_level?: string;
  baseline_math_level?: string;
  midline_khmer_level?: string;
  midline_math_level?: string;
  endline_khmer_level?: string;
  endline_math_level?: string;
}

interface AssessmentData {
  student_id: number;
  khmer_level?: string;
  khmer_score?: number;
  math_level?: string;
  math_score?: number;
  notes?: string;
}

export default function BulkAssessmentForm() {
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);
  const [assessmentType, setAssessmentType] = useState<string>('ដើមគ្រា');
  const [assessmentSubject, setAssessmentSubject] = useState<string>('both');
  const [assessmentDate, setAssessmentDate] = useState(dayjs());
  const [pilotSchools, setPilotSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    assessed_khmer: 0,
    assessed_math: 0,
    completed: 0
  });

  const khmerLevels = ['beginner', 'letter', 'word', 'paragraph', 'story'];
  const mathLevels = ['beginner', '1-9', '10-99', '100-999', 'operations'];

  useEffect(() => {
    fetchPilotSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      fetchStudents();
    }
  }, [selectedSchool]);

  useEffect(() => {
    updateStats();
  }, [assessmentData]);

  const fetchPilotSchools = async () => {
    try {
      const response = await fetch('/api/pilot-schools');
      if (response.ok) {
        const data = await response.json();
        setPilotSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchStudents = async () => {
    if (!selectedSchool) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/students?pilot_school_id=${selectedSchool}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        
        // Initialize assessment data for all students
        const initialData = data.students.map((student: Student) => ({
          student_id: student.id,
          khmer_level: undefined,
          khmer_score: undefined,
          math_level: undefined,
          math_score: undefined,
          notes: ''
        }));
        setAssessmentData(initialData);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = () => {
    const total = assessmentData.length;
    const assessed_khmer = assessmentData.filter(a => a.khmer_level).length;
    const assessed_math = assessmentData.filter(a => a.math_level).length;
    const completed = assessmentData.filter(a => 
      (assessmentSubject === 'khmer' && a.khmer_level) ||
      (assessmentSubject === 'math' && a.math_level) ||
      (assessmentSubject === 'both' && a.khmer_level && a.math_level)
    ).length;
    
    setStats({ total, assessed_khmer, assessed_math, completed });
  };

  const handleAssessmentChange = (studentId: number, field: string, value: any) => {
    setAssessmentData(prev => prev.map(item =>
      item.student_id === studentId
        ? { ...item, [field]: value }
        : item
    ));
  };

  const handleBulkSave = async () => {
    if (!selectedSchool) {
      message.warning('Please select a school');
      return;
    }

    const toSave = selectedStudents.length > 0
      ? assessmentData.filter(a => selectedStudents.includes(a.student_id))
      : assessmentData;

    if (toSave.length === 0) {
      message.warning('No students to assess');
      return;
    }

    Modal.confirm({
      title: 'Save Bulk Assessments',
      content: `Are you sure you want to save assessments for ${toSave.length} students?`,
      onOk: async () => {
        setLoading(true);
        try {
          const payload = {
            assessment_type: assessmentType,
            assessed_date: assessmentDate.format('YYYY-MM-DD'),
            pilot_school_id: selectedSchool,
            assessments: toSave.map(a => ({
              student_id: a.student_id,
              assessments: []
                .concat(a.khmer_level && assessmentSubject !== 'math' ? [{
                  subject: 'khmer',
                  level: a.khmer_level,
                  score: a.khmer_score
                }] : [])
                .concat(a.math_level && assessmentSubject !== 'khmer' ? [{
                  subject: 'math',
                  level: a.math_level,
                  score: a.math_score
                }] : []),
              notes: a.notes
            }))
          };

          const response = await fetch('/api/assessments/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const result = await response.json();
            message.success(`Saved assessments for ${result.saved} students`);
            
            // Reset form
            setSelectedStudents([]);
            fetchStudents();
          } else {
            throw new Error('Failed to save assessments');
          }
        } catch (error) {
          console.error('Error saving assessments:', error);
          message.error('Failed to save assessments');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleImportExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      
      // Map Excel data to assessment data
      const importedData = json.map((row: any) => ({
        student_id: parseInt(row['Student ID']),
        khmer_level: row['Khmer Level']?.toLowerCase(),
        khmer_score: parseFloat(row['Khmer Score']) || undefined,
        math_level: row['Math Level']?.toLowerCase(),
        math_score: parseFloat(row['Math Score']) || undefined,
        notes: row['Notes'] || ''
      }));
      
      // Merge with existing data
      setAssessmentData(prev => {
        const merged = [...prev];
        importedData.forEach((imported: AssessmentData) => {
          const index = merged.findIndex(a => a.student_id === imported.student_id);
          if (index >= 0) {
            merged[index] = { ...merged[index], ...imported };
          }
        });
        return merged;
      });
      
      message.success(`Imported assessments for ${importedData.length} students`);
      setImportModalVisible(false);
    };
    reader.readAsArrayBuffer(file);
    return false;
  };

  const handleExportTemplate = () => {
    const template = students.map(s => ({
      'Student ID': s.id,
      'Student Name': s.name,
      'Age': s.age || '',
      'Gender': s.gender || '',
      'Khmer Level': '',
      'Khmer Score': '',
      'Math Level': '',
      'Math Score': '',
      'Notes': ''
    }));
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assessment Template');
    XLSX.writeFile(wb, `assessment_template_${assessmentType}_${dayjs().format('YYYYMMDD')}.xlsx`);
    
    message.success('Template downloaded successfully');
  };

  const columns = [
    {
      title: 'Student',
      key: 'student',
      fixed: 'left',
      width: 200,
      render: (_: any, record: any) => {
        const student = students.find(s => s.id === record.student_id);
        return (
          <div>
            <div><strong>{student?.name}</strong></div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              ID: {student?.id} | Age: {student?.age || 'N/A'} | {student?.gender || 'N/A'}
            </div>
          </div>
        );
      }
    },
    ...(assessmentSubject === 'khmer' || assessmentSubject === 'both' ? [
      {
        title: 'Khmer Level',
        key: 'khmer_level',
        width: 150,
        render: (_: any, record: AssessmentData) => (
          <Select
            value={record.khmer_level}
            onChange={(value) => handleAssessmentChange(record.student_id, 'khmer_level', value)}
            style={{ width: '100%' }}
            placeholder="Select level"
          >
            {khmerLevels.map(level => (
              <Option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Option>
            ))}
          </Select>
        )
      },
      {
        title: 'Khmer Score',
        key: 'khmer_score',
        width: 100,
        render: (_: any, record: AssessmentData) => (
          <Input
            type="number"
            value={record.khmer_score}
            onChange={(e) => handleAssessmentChange(record.student_id, 'khmer_score', parseFloat(e.target.value))}
            placeholder="0-100"
            min={0}
            max={100}
          />
        )
      }
    ] : []),
    ...(assessmentSubject === 'math' || assessmentSubject === 'both' ? [
      {
        title: 'Math Level',
        key: 'math_level',
        width: 150,
        render: (_: any, record: AssessmentData) => (
          <Select
            value={record.math_level}
            onChange={(value) => handleAssessmentChange(record.student_id, 'math_level', value)}
            style={{ width: '100%' }}
            placeholder="Select level"
          >
            {mathLevels.map(level => (
              <Option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Option>
            ))}
          </Select>
        )
      },
      {
        title: 'Math Score',
        key: 'math_score',
        width: 100,
        render: (_: any, record: AssessmentData) => (
          <Input
            type="number"
            value={record.math_score}
            onChange={(e) => handleAssessmentChange(record.student_id, 'math_score', parseFloat(e.target.value))}
            placeholder="0-100"
            min={0}
            max={100}
          />
        )
      }
    ] : []),
    {
      title: 'Previous',
      key: 'previous',
      width: 150,
      render: (_: any, record: any) => {
        const student = students.find(s => s.id === record.student_id);
        const prevKhmer = student?.[`${assessmentType === 'ដើមគ្រា' ? '' : assessmentType === 'ពាក់កណ្តាលគ្រា' ? 'baseline' : 'midline'}_khmer_level`];
        const prevMath = student?.[`${assessmentType === 'ដើមគ្រា' ? '' : assessmentType === 'ពាក់កណ្តាលគ្រា' ? 'baseline' : 'midline'}_math_level`];
        
        return (
          <div style={{ fontSize: '12px' }}>
            {prevKhmer && <Tag color="purple">K: {prevKhmer}</Tag>}
            {prevMath && <Tag color="cyan">M: {prevMath}</Tag>}
            {!prevKhmer && !prevMath && <span style={{ color: '#999' }}>No previous</span>}
          </div>
        );
      }
    },
    {
      title: 'Notes',
      key: 'notes',
      width: 200,
      render: (_: any, record: AssessmentData) => (
        <Input.TextArea
          value={record.notes}
          onChange={(e) => handleAssessmentChange(record.student_id, 'notes', e.target.value)}
          placeholder="Optional notes..."
          rows={1}
        />
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      render: (_: any, record: AssessmentData) => {
        const isComplete = 
          (assessmentSubject === 'khmer' && record.khmer_level) ||
          (assessmentSubject === 'math' && record.math_level) ||
          (assessmentSubject === 'both' && record.khmer_level && record.math_level);
        
        return isComplete ? (
          <Tag color="green" icon={<CheckCircleOutlined />}>Complete</Tag>
        ) : (
          <Tag color="orange" icon={<ExclamationCircleOutlined />}>Pending</Tag>
        );
      }
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedStudents,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedStudents(selectedRowKeys as number[]);
    }
  };

  return (
    <div>
      <Card title="Bulk Student Assessment" style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={stats.total}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Khmer Assessed"
                value={stats.assessed_khmer}
                valueStyle={{ color: stats.assessed_khmer === stats.total ? '#52c41a' : undefined }}
              />
              <Progress 
                percent={stats.total ? Math.round((stats.assessed_khmer / stats.total) * 100) : 0} 
                size="small"
                strokeColor="#9254de"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Math Assessed"
                value={stats.assessed_math}
                valueStyle={{ color: stats.assessed_math === stats.total ? '#52c41a' : undefined }}
              />
              <Progress 
                percent={stats.total ? Math.round((stats.assessed_math / stats.total) * 100) : 0}
                size="small"
                strokeColor="#13c2c2"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Completed"
                value={stats.completed}
                valueStyle={{ color: stats.completed === stats.total ? '#52c41a' : '#faad14' }}
              />
              <Progress 
                percent={stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}
                size="small"
                status={stats.completed === stats.total ? 'success' : 'active'}
              />
            </Card>
          </Col>
        </Row>

        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="School" required>
                <Select
                  value={selectedSchool}
                  onChange={setSelectedSchool}
                  placeholder="Select school"
                  showSearch
                  optionFilterProp="children"
                >
                  {pilotSchools.map((school: any) => (
                    <Option key={school.id} value={school.id}>
                      {school.school_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Assessment Type" required>
                <Select
                  value={assessmentType}
                  onChange={setAssessmentType}
                >
                  <Option value="ដើមគ្រា">ដើមគ្រា</Option>
                  <Option value="ពាក់កណ្តាលគ្រា">ពាក់កណ្តាលគ្រា</Option>
                  <Option value="ចុងគ្រា">ចុងគ្រា</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Subject" required>
                <Select
                  value={assessmentSubject}
                  onChange={setAssessmentSubject}
                >
                  <Option value="khmer">Khmer Only</Option>
                  <Option value="math">Mathematics Only</Option>
                  <Option value="both">Both Subjects</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col span={6}>
              <Form.Item label="Assessment Date" required>
                <DatePicker
                  value={assessmentDate}
                  onChange={(date) => setAssessmentDate(date || dayjs())}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleBulkSave}
            loading={loading}
            disabled={stats.completed === 0}
          >
            Save {selectedStudents.length > 0 ? `${selectedStudents.length} Selected` : 'All'} Assessments
          </Button>
          
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            Import from Excel
          </Button>
          
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportTemplate}
            disabled={students.length === 0}
          >
            Download Template
          </Button>
        </Space>

        {selectedStudents.length > 0 && (
          <Alert
            message={`${selectedStudents.length} students selected`}
            type="info"
            showIcon
            closable
            onClose={() => setSelectedStudents([])}
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={assessmentData}
          rowKey="student_id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} students`,
            defaultPageSize: 20
          }}
        />
      </Card>

      <Modal
        title="Import Assessments from Excel"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Alert
          message="Excel Format Requirements"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>File must be in .xlsx or .xls format</li>
              <li>First row must contain column headers</li>
              <li>Required columns: Student ID, Student Name</li>
              <li>Assessment columns: Khmer Level, Khmer Score, Math Level, Math Score</li>
              <li>Optional: Notes</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Upload.Dragger
          accept=".xlsx,.xls"
          beforeUpload={handleImportExcel}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined style={{ fontSize: 48, color: '#52c41a' }} />
          </p>
          <p className="ant-upload-text">Click or drag Excel file to this area</p>
          <p className="ant-upload-hint">Support for single file upload only</p>
        </Upload.Dragger>
      </Modal>
    </div>
  );
}