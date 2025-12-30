'use client';

import { Suspense } from 'react';
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  Input,
  Row,
  Col,
  message,
  Space,
  Typography,
  Tag,
  Modal,
  Popconfirm,
  DatePicker
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasPermission } from '@/lib/permissions';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import OnboardingTour from '@/components/tour/OnboardingTour';
import dayjs from 'dayjs';
import { trackActivity } from '@/lib/trackActivity';
import { getLevelLabelKM, getSubjectLabelKM, getAssessmentTypeLabelKM } from '@/lib/constants/assessment-levels';
import SoftDeleteButton from '@/components/common/SoftDeleteButton';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

function AssessmentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user;

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    assessment_type: '',
    subject: '',
    student_id: '',
    pilot_school_id: '',
    is_temporary: '',
    date_from: '',
    date_to: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [students, setStudents] = useState([]);
  const [pilotSchools, setPilotSchools] = useState([]);

  // Track if component has mounted and filters have been initialized
  const [isInitialized, setIsInitialized] = useState(false);
  // Use a ref to track if we've done the initial fetch to prevent duplicate calls
  const hasInitialFetchRef = React.useRef(false);

  // Initialize filters from URL query parameters on component mount
  useEffect(() => {
    const initialFilters: any = { ...filters };
    let hasQueryParams = false;

    // Read all query parameters and apply to filters
    const queryParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (value && Object.keys(filters).includes(key)) {
        initialFilters[key] = value;
        queryParams[key] = value;
        hasQueryParams = true;
      }
    });

    // Update filters with URL parameters if they exist
    if (hasQueryParams) {
      setFilters(initialFilters);
      console.log('📍 Initialized filters from URL:', queryParams);
    }

    // Mark as initialized regardless of whether we found query params
    setIsInitialized(true);
  }, []);

  // Fetch form data only on mount
  useEffect(() => {
    fetchFormData();
  }, []);

  // Single consolidated effect for all data fetching
  // This prevents the double-fetch issue by consolidating all triggers
  useEffect(() => {
    if (!isInitialized) return;

    // Prevent the initial fetch from running twice
    if (!hasInitialFetchRef.current) {
      hasInitialFetchRef.current = true;
      fetchAssessments();
      return;
    }

    // For subsequent filter/pagination changes, fetch with a small debounce
    // to prevent multiple rapid calls
    const debounceTimer = setTimeout(() => {
      fetchAssessments();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [isInitialized, filters, pagination.current, pagination.pageSize]);

  const fetchFormData = async () => {
    try {
      const requests = [];
      
      requests.push(fetch('/api/students'));
      
      if (user?.role === 'mentor' || user?.role === 'admin') {
        requests.push(fetch('/api/pilot-schools'));
      }

      const responses = await Promise.all(requests);
      
      if (responses[0]) {
        const studentsData = await responses[0].json();
        setStudents(studentsData.students || []);
      }
      
      if (responses[1]) {
        const schoolsData = await responses[1].json();
        setPilotSchools(schoolsData.schools || []);
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      });

      // Add filters (skip empty strings to avoid filtering)
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/assessments?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();

      setAssessments(data.data || data.assessments || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || data.total || 0
      }));

      // Track activity: User viewed assessment list
      trackActivity('assessment_view');
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យការវាយតម្លៃ');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilters(prev => ({
        ...prev,
        date_from: dates[0].format('YYYY-MM-DD'),
        date_to: dates[1].format('YYYY-MM-DD')
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        date_from: '',
        date_to: ''
      }));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: 'DELETE',
        headers: {
          'user-id': user?.id?.toString() || '',
          'user-role': user?.role || ''
        }
      });

      if (response.ok) {
        message.success('Assessment deleted successfully');
        fetchAssessments();
      } else {
        const error = await response.json();
        message.error(error.error || 'Failed to delete assessment');
      }
    } catch (error) {
      message.error('Failed to delete assessment');
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await fetch(`/api/assessments/export?${params.toString()}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `assessments_${dayjs().format('YYYY-MM-DD')}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success('Assessments exported successfully');
      } else {
        message.error('Failed to export assessments');
      }
    } catch (error) {
      message.error('Failed to export assessments');
    }
  };

  const columns = [
    {
      title: 'លេខសិស្ស',
      key: 'student_id',
      width: 100,
      render: (record: any) => {
        // Try multiple possible locations for student_id
        const studentId = record.students?.student_id || record.student_id || '-';
        return <span>{studentId}</span>;
      }
    },
    {
      title: 'សិស្ស',
      dataIndex: 'students',
      key: 'students',
      render: (student: any) => (
        <div>
          <strong>{student?.name}</strong>
          {student?.is_temporary && (
            <Tag color="orange" size="small" style={{ marginLeft: 8 }}>
              បណ្តោះអាសន្ន
            </Tag>
          )}
        </div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      width: 120,
      render: (type: string) => {
        const typeMap = {
          'baseline': 'តេស្តដើមគ្រា',
          'midline': 'តេស្តពាក់កណ្ដាលគ្រា',
          'endline': 'តេស្តចុងក្រោយគ្រា',
          'ដើមគ្រា': 'តេស្តដើមគ្រា',
          'ពាក់កណ្តាលគ្រា': 'តេស្តពាក់កណ្ដាលគ្រា',
          'ចុងគ្រា': 'តេស្តចុងក្រោយគ្រា'
        };
        return (
          <Tag color={type === 'baseline' || type === 'ដើមគ្រា' ? 'blue' : type === 'midline' || type === 'ពាក់កណ្តាលគ្រា' ? 'orange' : 'green'}>
            {typeMap[type as keyof typeof typeMap] || type}
          </Tag>
        );
      }
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      width: 100,
      render: (subject: string) => {
        const subjectMap = {
          khmer: 'ភាសាខ្មែរ',
          math: 'គណិតវិទ្យា',
          language: 'ភាសាខ្មែរ'
        };
        return (
          <Tag color={subject === 'khmer' || subject === 'language' ? 'purple' : 'cyan'}>
            {subjectMap[subject as keyof typeof subjectMap] || subject}
          </Tag>
        );
      }
    },
    {
      title: 'កម្រិត',
      dataIndex: 'level',
      key: 'level',
      width: 120,
      render: (level: string, record: any) => {
        if (!level) return '-';
        return (
          <Tag color={
            level === 'beginner' ? 'red' :
            level === 'letter' ? 'orange' :
            level === 'word' ? 'gold' :
            level === 'paragraph' ? 'green' :
            level === 'story' ? 'blue' :
            level === 'comprehension1' ? 'purple' :
            level === 'comprehension2' ? 'magenta' :
            level === 'number_1digit' ? 'cyan' :
            level === 'number_2digit' ? 'geekblue' :
            level === 'subtraction' ? 'lime' :
            level === 'division' ? 'volcano' :
            level === 'word_problems' ? 'orange' : 'default'
          }>
            {getLevelLabelKM(record.subject, level)}
          </Tag>
        );
      }
    },
    {
      title: 'គំរូតេស្ត',
      dataIndex: 'assessment_sample',
      key: 'assessment_sample',
      width: 100,
      render: (sample: string) => sample || '-'
    },
    {
      title: 'ការយល់ព្រម',
      dataIndex: 'student_consent',
      key: 'student_consent',
      width: 100,
      render: (consent: string) => (
        <Tag color={consent === 'Yes' ? 'green' : consent === 'No' ? 'red' : 'default'}>
          {consent === 'Yes' ? 'បាទ/ចាស' : consent === 'No' ? 'ទេ' : '-'}
        </Tag>
      )
    },
    {
      title: 'កាលបរិច្ឆេទ',
      dataIndex: 'assessed_date',
      key: 'assessed_date',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    {
      title: 'វាយតម្លៃដោយ',
      dataIndex: 'added_by',
      key: 'added_by',
      render: (addedBy: any) => addedBy ? (
        <div>
          <div><strong>{addedBy.name}</strong></div>
          <Tag size="small" color={addedBy.role === 'mentor' ? 'orange' : 'blue'}>
            {addedBy.role === 'mentor' ? 'អ្នកណែនាំ' : 'គ្រូបង្រៀន'}
          </Tag>
        </div>
      ) : '-'
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      width: 100,
      render: (record: any) => (
        <Space direction="vertical" size="small">
          {record.is_temporary && (
            <Tag color="orange" size="small">បណ្តោះអាសន្ន</Tag>
          )}
          {record.assessed_by_mentor && (
            <Tag color="gold" size="small">អ្នកណែនាំ</Tag>
          )}
          {!record.is_temporary && !record.assessed_by_mentor && (
            <Tag color="green" size="small">ស្ថិរ</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      width: 200,
      render: (record: any) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/assessments/${record.id}`)}
          >
            មើល
          </Button>

          {hasPermission(user, 'assessments.edit') && (
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => router.push(`/assessments/${record.id}/edit`)}
            />
          )}

          {record.is_temporary && hasPermission(user, 'assessments.verify') && (
            <Button
              size="small"
              type="primary"
              danger={false}
              icon={<CheckCircleOutlined />}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => router.push(`/assessments/verify?assessment_id=${record.id}`)}
              title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ"
            >
              ផ្ទៀងផ្ទាត់
            </Button>
          )}

          <SoftDeleteButton
            type="assessment"
            id={record.id}
            displayName={`${record.students?.name || 'N/A'} - ${getSubjectLabelKM(record.subject)}`}
            size="small"
            buttonType="default"
            iconOnly={true}
            onSuccess={fetchAssessments}
            additionalInfo={`ប្រភេទ: ${getAssessmentTypeLabelKM(record.assessment_type)}, កម្រិត: ${getLevelLabelKM(record.level)}`}
          />
        </Space>
      )
    }
  ];

  return (
    <>
      <Card bodyStyle={{ padding: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Row justify="space-between" align="middle" gutter={[8, 8]}>
            <Col xs={24} md={12}>
              <Title level={2} style={{ marginBottom: '4px' }}>ការវាយតម្លៃ</Title>
              <Text type="secondary">គ្រប់គ្រង និងតាមដានការវាយតម្លៃសិស្ស</Text>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: 'right' }}>
              <Space wrap>
                {hasPermission(user, 'assessments.create') && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/assessments/create')}
                    size="large"
                  >
                    បង្កើតការវាយតម្លៃថ្មី
                  </Button>
                )}
                {hasPermission(user, 'assessments.export') && (
                  <Button
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    size="large"
                  >
                    Export
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {/* Filters */}
        <Card bodyStyle={{ padding: '16px' }} style={{ marginBottom: '16px' }}>
          <Row gutter={[12, 12]}>
            <Col xs={24} md={10}>
              <Input
                placeholder="ស្វែងរក..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                allowClear
                size="large"
              />
            </Col>

            <Col xs={12} md={7}>
              <Select
                placeholder="ប្រភេទ"
                value={filters.assessment_type}
                onChange={(value) => handleFilterChange('assessment_type', value)}
                allowClear
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="baseline">តេស្តដើមគ្រា</Option>
                <Option value="midline">តេស្តពាក់កណ្ដាលគ្រា</Option>
                <Option value="endline">តេស្តចុងក្រោយគ្រា</Option>
              </Select>
            </Col>

            <Col xs={12} md={7}>
              <Select
                placeholder="មុខវិជ្ជា"
                value={filters.subject}
                onChange={(value) => handleFilterChange('subject', value)}
                allowClear
                style={{ width: '100%' }}
                size="large"
              >
                <Option value="language">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Col>
          </Row>
        </Card>

        {/* Assessments Table */}
        <Table
          columns={columns}
          dataSource={assessments}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} នៃ ${total}`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 20
              }));
            },
            simple: typeof window !== 'undefined' && window.innerWidth < 768
          }}
          scroll={{ x: 1000 }}
          size="small"
        />
      </Card>
    </>
  );
}

export default function AssessmentsPage() {
  return (
    <HorizontalLayout>
      <Suspense fallback={<div style={{ padding: '50px', textAlign: 'center' }}>កំពុងផ្ទុក...</div>}>
        <AssessmentsContent />
      </Suspense>
      {/* Assessments-specific tour - Disabled */}
      {/* <OnboardingTour page="assessments" autoStart={false} showStartButton={false} /> */}
    </HorizontalLayout>
  );
}