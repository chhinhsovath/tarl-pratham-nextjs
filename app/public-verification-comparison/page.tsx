'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Space,
  Typography,
  Spin,
  Tag,
  Select,
  Button,
  Divider
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  CalculatorOutlined,
  UserOutlined,
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getLevelLabelKM } from '@/lib/constants/assessment-levels';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;

interface ComparisonData {
  student_id: string;
  student_name: string;
  gender: string;
  age: number;
  grade: string;
  school_name: string;
  school_code: string;
  province: string;
  district: string;
  assessment_type: string;
  subject: string;
  teacher_name: string;
  teacher_level: string;
  teacher_assessment_date: string;
  mentor_name: string;
  mentor_level: string;
  mentor_verification_date: string;
  verification_status: string;
  level_match: boolean;
  verified_at: string;
}

interface ComparisonStats {
  total_assessments: number;
  verified_count: number;
  pending_count: number;
  level_match_count: number;
  level_mismatch_count: number;
}

export default function PublicVerificationComparison() {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [stats, setStats] = useState<ComparisonStats>({
    total_assessments: 0,
    verified_count: 0,
    pending_count: 0,
    level_match_count: 0,
    level_mismatch_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    assessment_type: '',
    subject: '',
    status: ''
  });

  useEffect(() => {
    fetchComparisons();
  }, [filters]);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.assessment_type) params.append('assessment_type', filters.assessment_type);
      if (filters.subject) params.append('subject', filters.subject);

      const response = await fetch(`/api/public/verification-comparison?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }
      const data = await response.json();

      let filteredComparisons = data.comparisons || [];

      // Apply status filter
      if (filters.status === 'verified') {
        filteredComparisons = filteredComparisons.filter((c: ComparisonData) => c.verification_status === 'verified');
      } else if (filters.status === 'pending') {
        filteredComparisons = filteredComparisons.filter((c: ComparisonData) => c.verification_status === 'pending');
      } else if (filters.status === 'mismatch') {
        filteredComparisons = filteredComparisons.filter((c: ComparisonData) =>
          c.verification_status === 'verified' && !c.level_match
        );
      }

      setComparisons(filteredComparisons);
      setStats(data.statistics || {});
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToMarkdown = async () => {
    try {
      const response = await fetch('/api/reports/generate-comparison-md');
      if (!response.ok) {
        throw new Error('Failed to generate markdown report');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `COMPARISON_REPORT_${dayjs().format('YYYY-MM-DD_HHmm')}.md`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting markdown:', error);
    }
  };

  const handleExportToExcel = () => {
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryHeaders = ['របាយការណ៍ប្រៀបធៀបការវាយតម្លៃគ្រូ និងការផ្ទៀងផ្ទាត់គ្រូណែនាំ'];
      const summaryData = [
        summaryHeaders,
        [],
        ['សង្ខេប', 'ចំនួន'],
        ['សរុបទាំងអស់', stats.total_assessments],
        ['បានផ្ទៀងផ្ទាត់', stats.verified_count],
        ['រង់ចាំផ្ទៀងផ្ទាត់', stats.pending_count],
        ['ត្រូវគ្នា', stats.level_match_count],
        ['មិនត្រូវគ្នា', stats.level_mismatch_count],
        [],
        ['កាលបរិច្ឆេទនាំចេញ:', dayjs().format('DD/MM/YYYY HH:mm')]
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'សង្ខេប');

      // Detailed comparison sheet
      const detailHeaders = [
        'លេខសិស្ស',
        'ឈ្មោះសិស្ស',
        'ភេទ',
        'អាយុ',
        'ថ្នាក់',
        'សាលា',
        'ខេត្ត',
        'ស្រុក',
        'ប្រភេទការវាយតម្លៃ',
        'មុខវិជ្ជា',
        'គ្រូ',
        'កម្រិតគ្រូ',
        'កាលបរិច្ឆេទវាយតម្លៃគ្រូ',
        'គ្រូណែនាំ',
        'កម្រិតគ្រូណែនាំ',
        'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់',
        'ស្ថានភាព'
      ];

      const detailData = comparisons.map((comp) => {
        const subject = comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math';
        const teacherLevelLabel = getLevelLabelKM(subject, comp.teacher_level);
        const mentorLevelLabel = comp.mentor_level ? getLevelLabelKM(subject, comp.mentor_level) : '-';

        let statusLabel = '';
        if (comp.verification_status === 'pending') {
          statusLabel = 'រង់ចាំផ្ទៀងផ្ទាត់';
        } else if (comp.level_match) {
          statusLabel = 'ត្រូវគ្នា';
        } else {
          statusLabel = 'មិនត្រូវគ្នា';
        }

        const assessmentTypeLabel =
          comp.assessment_type === 'baseline' ? 'តេស្តដើមគ្រា' :
          comp.assessment_type === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' : 'បញ្ចប់';

        const subjectLabel = (comp.subject === 'language' || comp.subject === 'khmer') ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា';

        return [
          comp.student_id || '-',
          comp.student_name || '-',
          comp.gender || '-',
          comp.age || '-',
          comp.grade || '-',
          comp.school_name || '-',
          comp.province || '-',
          comp.district || '-',
          assessmentTypeLabel,
          subjectLabel,
          comp.teacher_name || '-',
          teacherLevelLabel,
          comp.teacher_assessment_date ? dayjs(comp.teacher_assessment_date).format('DD/MM/YYYY') : '-',
          comp.mentor_name || '-',
          mentorLevelLabel,
          comp.verified_at ? dayjs(comp.verified_at).format('DD/MM/YYYY') : '-',
          statusLabel
        ];
      });

      const detailSheet = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailData]);
      XLSX.utils.book_append_sheet(wb, detailSheet, 'ការប្រៀបធៀបលម្អិត');

      // Mismatch only sheet
      const mismatchComparisons = comparisons.filter(c => c.verification_status === 'verified' && !c.level_match);

      if (mismatchComparisons.length > 0) {
        const mismatchData = mismatchComparisons.map((comp) => {
          const subject = comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math';
          const teacherLevelLabel = getLevelLabelKM(subject, comp.teacher_level);
          const mentorLevelLabel = comp.mentor_level ? getLevelLabelKM(subject, comp.mentor_level) : '-';

          const assessmentTypeLabel =
            comp.assessment_type === 'baseline' ? 'តេស្តដើមគ្រា' :
            comp.assessment_type === 'midline' ? 'តេស្តពាក់កណ្ដាលគ្រា' : 'បញ្ចប់';

          const subjectLabel = (comp.subject === 'language' || comp.subject === 'khmer') ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា';

          return [
            comp.student_id || '-',
            comp.student_name || '-',
            comp.school_name || '-',
            comp.province || '-',
            comp.district || '-',
            assessmentTypeLabel,
            subjectLabel,
            teacherLevelLabel,
            mentorLevelLabel,
            `${teacherLevelLabel} → ${mentorLevelLabel}`
          ];
        });

        const mismatchHeaders = [
          'លេខសិស្ស',
          'ឈ្មោះសិស្ស',
          'សាលា',
          'ខេត្ត',
          'ស្រុក',
          'ប្រភេទ',
          'មុខវិជ្ជា',
          'កម្រិតគ្រូ',
          'កម្រិតគ្រូណែនាំ',
          'ភាពខុសគ្នា'
        ];

        const mismatchSheet = XLSX.utils.aoa_to_sheet([mismatchHeaders, ...mismatchData]);
        XLSX.utils.book_append_sheet(wb, mismatchSheet, 'មិនត្រូវគ្នា');
      }

      // Generate filename with timestamp
      const fileName = `comparison_report_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;

      // Write and download
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const columns = [
    {
      title: 'សិស្ស',
      key: 'student',
      fixed: 'left' as const,
      width: 150,
      render: (record: ComparisonData) => (
        <div>
          <div className="font-semibold">{record.student_name}</div>
          <div className="text-xs text-gray-500">{record.student_id}</div>
        </div>
      )
    },
    {
      title: 'សាលា',
      key: 'school',
      width: 180,
      render: (record: ComparisonData) => (
        <div>
          <div className="text-sm font-medium">{record.school_name || '-'}</div>
          <div className="text-xs text-gray-500">{record.province} - {record.district}</div>
        </div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      width: 110,
      render: (type: string) => {
        const typeMap = {
          baseline: { label: 'មូលដ្ឋាន', color: 'blue' },
          midline: { label: 'ពាក់កណ្តាល', color: 'orange' },
          endline: { label: 'បញ្ចប់', color: 'green' }
        };
        const config = typeMap[type as keyof typeof typeMap];
        return <Tag color={config?.color}>{config?.label}</Tag>;
      }
    },
    {
      title: 'មុខវិជ្ជា',
      dataIndex: 'subject',
      key: 'subject',
      width: 110,
      render: (subject: string) => {
        const isLanguage = subject === 'language' || subject === 'khmer';
        return (
          <Space>
            {isLanguage ? <BookOutlined /> : <CalculatorOutlined />}
            <Tag color={isLanguage ? 'purple' : 'cyan'}>
              {isLanguage ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
            </Tag>
          </Space>
        );
      }
    },
    {
      title: 'កម្រិតរបស់គ្រូ',
      key: 'teacher_level',
      width: 160,
      render: (record: ComparisonData) => {
        const subject = record.subject === 'language' || record.subject === 'khmer' ? 'language' : 'math';
        return (
          <div>
            <div className="font-medium text-blue-600">{getLevelLabelKM(subject, record.teacher_level)}</div>
            <div className="text-xs text-gray-500">
              <UserOutlined /> {record.teacher_name}
            </div>
          </div>
        );
      }
    },
    {
      title: 'កម្រិតរបស់គ្រូណែនាំ',
      key: 'mentor_level',
      width: 160,
      render: (record: ComparisonData) => {
        if (record.verification_status === 'pending') {
          return <Tag color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }
        const subject = record.subject === 'language' || record.subject === 'khmer' ? 'language' : 'math';
        const mentorLevel = record.mentor_level || record.teacher_level;
        return (
          <div>
            <div className="font-medium text-green-600">{getLevelLabelKM(subject, mentorLevel)}</div>
            <div className="text-xs text-gray-500">
              <UserOutlined /> {record.mentor_name}
            </div>
          </div>
        );
      }
    },
    {
      title: 'ស្ថានភាព',
      key: 'comparison_status',
      width: 130,
      render: (record: ComparisonData) => {
        if (record.verification_status === 'pending') {
          return <Tag color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }

        const teacherLevel = record.teacher_level;
        const mentorLevel = record.mentor_level || record.teacher_level;
        const levelsMatch = teacherLevel === mentorLevel;

        if (levelsMatch) {
          return <Tag icon={<CheckCircleOutlined />} color="green">ត្រូវគ្នា</Tag>;
        } else {
          return <Tag icon={<CloseCircleOutlined />} color="red">មិនត្រូវគ្នា</Tag>;
        }
      }
    },
    {
      title: 'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់',
      key: 'verified_at',
      width: 140,
      render: (record: ComparisonData) => {
        if (record.verified_at) {
          return (
            <div>
              <div>{dayjs(record.verified_at).format('DD/MM/YYYY')}</div>
              <div className="text-xs text-gray-500">{dayjs(record.verified_at).format('HH:mm')}</div>
            </div>
          );
        }
        return '-';
      }
    }
  ];

  if (loading && comparisons.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="mb-2">
            📊 ការប្រៀបធៀបការវាយតម្លៃគ្រូ និងការផ្ទៀងផ្ទាត់គ្រូណែនាំ
          </Title>
          <Title level={4} type="secondary" className="font-light">
            Teacher Assessment vs Mentor Verification Comparison
          </Title>
        </div>

        {/* Statistics */}
        <Card className="mb-6 shadow-lg" title={<Title level={3}>📈 សង្ខេបទូទៅ</Title>}>
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12} md={6}>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300">
                <Statistic
                  title={<Text strong>សរុបទាំងអស់</Text>}
                  value={stats.total_assessments}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-300">
                <Statistic
                  title={<Text strong>បានផ្ទៀងផ្ទាត់</Text>}
                  value={stats.verified_count}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300">
                <Statistic
                  title={<Text strong>រង់ចាំផ្ទៀងផ្ទាត់</Text>}
                  value={stats.pending_count}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300">
                <Statistic
                  title={<Text strong>ត្រូវគ្នា</Text>}
                  value={stats.level_match_count}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-300">
                <Statistic
                  title={<Text strong>មិនត្រូវគ្នា</Text>}
                  value={stats.level_mismatch_count}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Filters */}
        <Card className="mb-6 shadow-lg" title={<Space><FilterOutlined /> តម្រង</Space>}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="ប្រភេទការវាយតម្លៃ"
                value={filters.assessment_type}
                onChange={(value) => setFilters({...filters, assessment_type: value})}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="baseline">តេស្តដើមគ្រា</Option>
                <Option value="midline">តេស្តពាក់កណ្ដាលគ្រា</Option>
                <Option value="endline">តេស្តចុងក្រោយគ្រា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="មុខវិជ្ជា"
                value={filters.subject}
                onChange={(value) => setFilters({...filters, subject: value})}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="khmer">ភាសាខ្មែរ</Option>
                <Option value="language">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="ស្ថានភាព"
                value={filters.status}
                onChange={(value) => setFilters({...filters, status: value})}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="verified">បានផ្ទៀងផ្ទាត់</Option>
                <Option value="pending">រង់ចាំផ្ទៀងផ្ទាត់</Option>
                <Option value="mismatch">មិនត្រូវគ្នា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space style={{ width: '100%' }}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setFilters({
                      assessment_type: '',
                      subject: '',
                      status: ''
                    });
                  }}
                  style={{ flex: 1 }}
                >
                  សម្អាតតម្រង
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleExportToExcel}
                  disabled={comparisons.length === 0}
                  style={{ flex: 1 }}
                >
                  នាំចេញ Excel
                </Button>
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  onClick={handleExportToMarkdown}
                  disabled={comparisons.length === 0}
                  style={{ flex: 1 }}
                >
                  នាំចេញ Markdown
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Comparison Table */}
        <Card
          className="shadow-lg"
          title={
            <Space>
              <Title level={3}>📋 តារាងប្រៀបធៀប</Title>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={comparisons}
            rowKey={(record) => `${record.student_id}_${record.teacher_assessment_date}`}
            loading={loading}
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal: (total) => `សរុប ${total} ការវាយតម្លៃ`
            }}
            scroll={{ x: 1200 }}
            size="small"
          />
        </Card>

        <Divider />

        {/* Footer */}
        <div className="text-center mt-8 pb-4">
          <Text type="secondary">
            © 2024 TaRL Pratham Cambodia | ប្រព័ន្ធគ្រប់គ្រងការវាយតម្លៃសិស្ស
          </Text>
        </div>
      </div>
    </div>
  );
}
