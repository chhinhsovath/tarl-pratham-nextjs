'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Tabs,
  Badge,
  Tooltip,
  Popconfirm,
  Typography
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
  ReloadOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { getLevelLabelKM } from '@/lib/constants/assessment-levels';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function VerificationPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState<number[]>([]);
  const [verifyModalVisible, setVerifyModalVisible] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [filters, setFilters] = useState({
    search: '',
    assessment_type: '',
    subject: '',
    school_id: '',
    teacher_id: ''
  });

  // Comparison data state
  const [comparisons, setComparisons] = useState([]);
  const [comparisonStats, setComparisonStats] = useState({
    total_assessments: 0,
    verified_count: 0,
    pending_count: 0,
    level_match_count: 0,
    level_mismatch_count: 0
  });

  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    verified: 0,
    rejected: 0,
    total: 0
  });

  const [form] = Form.useForm();

  // Check permission
  useEffect(() => {
    if (session && !['admin', 'coordinator', 'mentor'].includes(session.user?.role || '')) {
      message.error('អ្នកមិនមានសិទ្ធិចូលទៅទំព័រនេះទេ');
      router.push('/dashboard');
    }
  }, [session, router]);

  useEffect(() => {
    if (activeTab === 'comparison') {
      fetchComparisons();
    } else {
      fetchAssessments();
      fetchStats();
    }
  }, [activeTab, filters]);

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      // Fetch all assessments by paginating through API (max 100 per request)
      // Build query params
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.assessment_type) params.append('assessment_type', filters.assessment_type);
      if (filters.subject) params.append('subject', filters.subject);

      // Single request - no pagination, get ALL records
      const response = await fetch(`/api/assessments/verify?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }

      const data = await response.json();
      const allAssessments = data.assessments || [];

      console.log(`✅ Frontend received: ${allAssessments.length} assessments`);
      console.log(`✅ API says total is: ${data.pagination?.total || 'unknown'}`);
      console.log(`✅ Statistics: ${JSON.stringify(data.statistics)}`);

      // Update stats
      if (data.statistics) {
        setStats(data.statistics);
      }

      console.log(`✅ All verification assessments fetched: ${allAssessments.length} total`);

      // Transform assessments to add status field based on verified_at
      // All data is production now, use verification status instead
      const transformedAssessments = allAssessments.map((assessment: any) => {
        let status = 'pending';

        // Check verification status
        if (assessment.verified_at) {
          // Has been verified - check if rejected
          if (assessment.verification_notes &&
              assessment.verification_notes.toLowerCase().includes('rejected')) {
            status = 'rejected';
          } else {
            status = 'verified';
          }
        }
        // else: verified_at is null, status remains 'pending'

        return {
          ...assessment,
          status
        };
      });

      setAssessments(transformedAssessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យ');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/assessments/verify?status=pending&limit=1');
      if (response.ok) {
        const data = await response.json();
        if (data.statistics) {
          setStats(data.statistics);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchComparisons = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.assessment_type) params.append('assessment_type', filters.assessment_type);
      if (filters.subject) params.append('subject', filters.subject);
      if (filters.school_id) params.append('school_id', filters.school_id);

      const response = await fetch(`/api/assessments/verify/comparison?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      setComparisons(data.comparisons || []);
      setComparisonStats(data.statistics || {});
    } catch (error) {
      console.error('Error fetching comparisons:', error);
      message.error('មានបញ្ហាក្នុងការទាញយកទិន្នន័យប្រៀបធៀប');
      setComparisons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (record: any) => {
    setSelectedAssessment(record);
    setVerifyModalVisible(true);
  };

  const handleVerifySubmit = async () => {
    try {
      const values = await form.validateFields();

      const response = await fetch('/api/assessments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessment_ids: [selectedAssessment.id],
          action: values.action === 'verify' ? 'approve' : 'reject',
          notes: values.notes
        })
      });

      const data = await response.json();

      if (response.ok) {
        message.success(data.message || `ការវាយតម្លៃត្រូវបាន${values.action === 'verify' ? 'ផ្ទៀងផ្ទាត់' : 'បដិសេធ'}ដោយជោគជ័យ`);
        setVerifyModalVisible(false);
        form.resetFields();
        fetchAssessments();
        fetchStats();
      } else {
        message.error(data.error || 'មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
      }
    } catch (error) {
      console.error('Verification error:', error);
      message.error('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
    }
  };

  const handleExportComparison = async () => {
    try {
      setLoading(true);
      message.loading('កំពុងទាញយកទិន្នន័យប្រៀបធៀប...');

      // Use the already loaded comparison data
      const dataToExport = comparisons;
      const stats = comparisonStats;

      if (!dataToExport || dataToExport.length === 0) {
        message.warning('មិនមានទិន្នន័យសម្រាប់នាំចេញ');
        setLoading(false);
        return;
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // 1. Summary sheet
      const summaryData = [
        ['របាយការណ៍ប្រៀបធៀបកម្រិតការវាយតម្លៃគ្រូ និងការផ្ទៀងផ្ទាត់របស់គ្រូណែនាំ'],
        ['កាលបរិច្ឆេទនាំចេញ:', dayjs().format('YYYY-MM-DD HH:mm')],
        [],
        ['សង្ខេបទិន្នន័យ'],
        ['ចំនួនការវាយតម្លៃដោយគ្រូសរុប:', stats.total_assessments || 0],
        ['បានផ្ទៀងផ្ទាត់ដោយគ្រូណែនាំ:', stats.verified_count || 0],
        ['រង់ចាំការផ្ទៀងផ្ទាត់:', stats.pending_count || 0],
        [],
        ['សម្រាប់ការផ្ទៀងផ្ទាត់ដែលបានធ្វើ:'],
        ['កម្រិតត្រូវគ្នា:', stats.level_match_count || 0],
        ['កម្រិតមិនត្រូវគ្នា:', stats.level_mismatch_count || 0],
        ['ភាគរយកម្រិតត្រូវគ្នា:', stats.verified_count > 0 ?
          ((stats.level_match_count / stats.verified_count * 100).toFixed(1) + '%') : '0%'],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'សង្ខេប');

      // 2. Detailed comparison sheet - Focus on LEVEL comparison
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
        'ឈ្មោះគ្រូ',
        'កាលបរិច្ឆេទវាយតម្លៃ',
        'កម្រិតវាយតម្លៃដោយគ្រូ',
        'ឈ្មោះគ្រូណែនាំ',
        'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់',
        'កម្រិតផ្ទៀងផ្ទាត់ដោយគ្រូណែនាំ',
        'កម្រិតត្រូវគ្នាឬទេ',
        'ភាពខុសគ្នានៃកម្រិត',
        'ស្ថានភាព',
        'កំណត់ចំណាំ'
      ];

      const detailData = dataToExport.map((comp: any) => {
        // Calculate level difference
        let levelDifference = '';
        if (comp.teacher_level && comp.mentor_level && comp.teacher_level !== comp.mentor_level) {
          levelDifference = `គ្រូ: ${getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.teacher_level
          )} → គ្រូណែនាំ: ${getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.mentor_level
          )}`;
        }

        return [
          comp.student_id || '',
          comp.student_name || '',
          comp.gender === 'M' ? 'ប្រុស' : comp.gender === 'F' ? 'ស្រី' : '',
          comp.age || '',
          comp.grade || '',
          comp.school_name || '',
          comp.province || '',
          comp.district || '',
          comp.assessment_type === 'baseline' ? 'មូលដ្ឋាន' : 
            comp.assessment_type === 'midline' ? 'ពាក់កណ្តាល' : 
            comp.assessment_type === 'endline' ? 'បញ្ចប់' : '',
          comp.subject === 'language' || comp.subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា',
          comp.teacher_name || '',
          comp.teacher_assessment_date ? dayjs(comp.teacher_assessment_date).format('YYYY-MM-DD') : '',
          getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.teacher_level
          ),
          comp.mentor_name || 'មិនទាន់ផ្ទៀងផ្ទាត់',
          comp.mentor_verification_date ? dayjs(comp.mentor_verification_date).format('YYYY-MM-DD') : '',
          comp.mentor_level ? getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.mentor_level
          ) : '',
          comp.level_match === true ? '✓ ត្រូវគ្នា' : comp.level_match === false ? '✗ មិនត្រូវគ្នា' : '',
          levelDifference,
          comp.verification_status === 'verified' ? 'បានផ្ទៀងផ្ទាត់' : 'រង់ចាំ',
          comp.verification_notes || ''
        ];
      });

      const detailSheet = XLSX.utils.aoa_to_sheet([detailHeaders, ...detailData]);
      
      // Auto-size columns
      const colWidths = detailHeaders.map((header, i) => {
        const maxLength = Math.max(
          header.length,
          ...detailData.map((row: any[]) => String(row[i] || '').length)
        );
        return { wch: Math.min(maxLength + 2, 30) };
      });
      detailSheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, detailSheet, 'ការប្រៀបធៀបលម្អិត');

      // 3. Pending verifications sheet (students not yet verified)
      const pendingComparisons = dataToExport.filter((c: any) => c.verification_status === 'pending');
      if (pendingComparisons.length > 0) {
        const pendingHeaders = [
          'លេខសិស្ស',
          'ឈ្មោះសិស្ស',
          'សាលា',
          'ខេត្ត',
          'ស្រុក',
          'ប្រភេទ',
          'មុខវិជ្ជា',
          'គ្រូ',
          'កាលបរិច្ឆេទ',
          'កម្រិតវាយតម្លៃដោយគ្រូ'
        ];

        const pendingData = pendingComparisons.map((comp: any) => [
          comp.student_id || '',
          comp.student_name || '',
          comp.school_name || '',
          comp.province || '',
          comp.district || '',
          comp.assessment_type === 'baseline' ? 'មូលដ្ឋាន' : 
            comp.assessment_type === 'midline' ? 'ពាក់កណ្តាល' : 'បញ្ចប់',
          comp.subject === 'language' || comp.subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា',
          comp.teacher_name || '',
          comp.teacher_assessment_date ? dayjs(comp.teacher_assessment_date).format('YYYY-MM-DD') : '',
          getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.teacher_level
          )
        ]);

        const pendingSheet = XLSX.utils.aoa_to_sheet([pendingHeaders, ...pendingData]);
        XLSX.utils.book_append_sheet(wb, pendingSheet, 'រង់ចាំផ្ទៀងផ្ទាត់');
      }

      // 4. Level discrepancies sheet (different levels between teacher and mentor)
      const levelDiscrepancies = dataToExport.filter((c: any) =>
        c.level_match === false && c.mentor_level !== null
      );

      if (levelDiscrepancies.length > 0) {
        const discrepancyHeaders = [
          'សិស្ស',
          'សាលា',
          'ខេត្ត', 
          'ស្រុក',
          'ប្រភេទ',
          'មុខវិជ្ជា',
          'កម្រិតវាយតម្លៃដោយគ្រូ',
          'កម្រិតផ្ទៀងផ្ទាត់ដោយគ្រូណែនាំ',
          'ការផ្លាស់ប្តូរកម្រិត'
        ];

        const discrepancyData = levelDiscrepancies.map((comp: any) => {
          const teacherLevelLabel = getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.teacher_level
          );
          const mentorLevelLabel = getLevelLabelKM(
            comp.subject === 'language' || comp.subject === 'khmer' ? 'language' : 'math',
            comp.mentor_level
          );
          
          return [
            comp.student_name || '',
            comp.school_name || '',
            comp.province || '',
            comp.district || '',
            comp.assessment_type === 'baseline' ? 'មូលដ្ឋាន' : 
              comp.assessment_type === 'midline' ? 'ពាក់កណ្តាល' : 'បញ្ចប់',
            comp.subject === 'language' || comp.subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា',
            teacherLevelLabel,
            mentorLevelLabel,
            `${teacherLevelLabel} → ${mentorLevelLabel}`
          ];
        });

        const discrepancySheet = XLSX.utils.aoa_to_sheet([discrepancyHeaders, ...discrepancyData]);
        XLSX.utils.book_append_sheet(wb, discrepancySheet, 'កម្រិតមិនត្រូវគ្នា');
      }

      // Generate filename with timestamp
      const fileName = `verification_comparison_${dayjs().format('YYYY-MM-DD_HHmm')}.xlsx`;

      // Write and download
      XLSX.writeFile(wb, fileName);
      
      message.success('បាននាំចេញទិន្នន័យប្រៀបធៀបដោយជោគជ័យ');
    } catch (error) {
      console.error('Export error:', error);
      message.error('មានបញ្ហាក្នុងការនាំចេញទិន្នន័យ');
    } finally {
      setLoading(false);
    }
  };

  const handleExportMarkdown = async () => {
    try {
      message.loading('កំពុងបង្កើតរបាយការណ៍ Markdown...');
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
      message.success('បាននាំចេញរបាយការណ៍ Markdown ដោយជោគជ័យ');
    } catch (error) {
      console.error('Error exporting markdown:', error);
      message.error('មានបញ្ហាក្នុងការនាំចេញរបាយការណ៍');
    }
  };

  const handleBulkVerify = async () => {
    if (selectedAssessments.length === 0) {
      message.warning('សូមជ្រើសរើសការវាយតម្លៃយ៉ាងហោចណាស់មួយ');
      return;
    }

    Modal.confirm({
      title: 'ផ្ទៀងផ្ទាត់ច្រើន',
      content: `តើអ្នកពិតជាចង់ផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${selectedAssessments.length} មែនទេ?`,
      okText: 'យល់ព្រម',
      cancelText: 'បោះបង់',
      onOk: async () => {
        try {
          const response = await fetch('/api/assessments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              assessment_ids: selectedAssessments,
              action: 'approve',
              notes: 'Bulk verification'
            })
          });

          const data = await response.json();

          if (response.ok) {
            message.success(data.message || `បានផ្ទៀងផ្ទាត់ការវាយតម្លៃចំនួន ${selectedAssessments.length} ដោយជោគជ័យ`);
            setSelectedAssessments([]);
            fetchAssessments();
            fetchStats();
          } else {
            message.error(data.error || 'មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
          }
        } catch (error) {
          message.error('មានបញ្ហាក្នុងការផ្ទៀងផ្ទាត់');
        }
      }
    });
  };

  const columns = [
    {
      title: 'លេខសិស្ស',
      key: 'student_id',
      width: 100,
      render: (record: any) => record.students?.student_id || '-'
    },
    {
      title: 'សិស្ស',
      key: 'student',
      render: (record: any) => (
        <div className="font-semibold">{record.students?.name || '-'}</div>
      )
    },
    {
      title: 'សាលា',
      key: 'school',
      render: (record: any) => (
        <div className="text-sm">{record.pilot_schools?.school_name || '-'}</div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
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
      render: (subject: string) => (
        <Tag color={subject === 'language' || subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject === 'language' || subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
        </Tag>
      )
    },
    {
      title: 'កម្រិត',
      dataIndex: 'level',
      key: 'level',
      render: (level: string, record: any) => {
        // Use helper function to get proper Khmer label based on subject
        const subject = record.subject === 'language' || record.subject === 'khmer' ? 'language' : 'math';
        return getLevelLabelKM(subject, level);
      }
    },
    {
      title: 'វាយតម្លៃដោយ',
      key: 'assessor',
      render: (record: any) => (
        <div className="text-sm">{record.users_assessments_added_by_idTousers?.name || '-'}</div>
      )
    },
    {
      title: 'ស្ថានភាព',
      key: 'status',
      render: (record: any) => {
        if (record.status === 'verified') {
          return (
            <Tooltip title={`ផ្ទៀងផ្ទាត់ដោយ ${record.verified_by} នៅ ${record.verified_date}`}>
              <Tag icon={<CheckCircleOutlined />} color="green">បានផ្ទៀងផ្ទាត់</Tag>
            </Tooltip>
          );
        } else if (record.status === 'rejected') {
          return (
            <Tooltip title={`បដិសេធដោយ ${record.rejected_by}: ${record.rejected_reason}`}>
              <Tag icon={<CloseCircleOutlined />} color="red">បានបដិសេធ</Tag>
            </Tooltip>
          );
        } else {
          return <Tag icon={<ExclamationCircleOutlined />} color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }
      }
    },
    {
      title: 'សកម្មភាព',
      key: 'actions',
      render: (record: any) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Tooltip title="ផ្ទៀងផ្ទាត់ (វាយតម្លៃឡើងវិញ)">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => {
                    // Redirect to assessment form in verification mode
                    const params = new URLSearchParams({
                      verificationMode: 'true',
                      originalAssessmentId: record.id.toString(),
                      studentId: record.students?.id?.toString() || '',
                      studentName: record.students?.name || '',
                      assessmentType: record.assessment_type || '',
                      subject: record.subject || ''
                    });
                    router.push(`/assessments/create?${params.toString()}`);
                  }}
                >
                  ផ្ទៀងផ្ទាត់
                </Button>
              </Tooltip>
              <Tooltip title="មើលការវាយតម្លៃដើម">
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => router.push(`/assessments/${record.id}`)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'verified' && (
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => router.push(`/assessments/${record.id}`)}
            >
              មើល
            </Button>
          )}
          {record.status === 'rejected' && (
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => {
                const params = new URLSearchParams({
                  verificationMode: 'true',
                  originalAssessmentId: record.id.toString(),
                  studentId: record.students?.id?.toString() || '',
                  studentName: record.students?.name || ''
                });
                router.push(`/assessments/create?${params.toString()}`);
              }}
            >
              ពិនិត្យឡើងវិញ
            </Button>
          )}
        </Space>
      )
    }
  ];

  // Comparison columns for side-by-side view
  const comparisonColumns = [
    {
      title: 'សិស្ស',
      key: 'student',
      fixed: 'left' as const,
      width: 150,
      render: (record: any) => (
        <div>
          <div className="font-semibold">{record.student_name}</div>
          <div className="text-xs text-gray-500">{record.student_id}</div>
        </div>
      )
    },
    {
      title: 'សាលា',
      key: 'school',
      width: 150,
      render: (record: any) => (
        <div className="text-sm">{record.school_name || '-'}</div>
      )
    },
    {
      title: 'ប្រភេទ',
      dataIndex: 'assessment_type',
      key: 'assessment_type',
      width: 100,
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
      width: 100,
      render: (subject: string) => (
        <Tag color={subject === 'language' || subject === 'khmer' ? 'purple' : 'cyan'}>
          {subject === 'language' || subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
        </Tag>
      )
    },
    {
      title: 'កម្រិតរបស់គ្រូ',
      key: 'teacher_level',
      width: 150,
      render: (record: any) => {
        const subject = record.subject === 'language' || record.subject === 'khmer' ? 'language' : 'math';
        return (
          <div>
            <div className="font-medium">{getLevelLabelKM(subject, record.teacher_level)}</div>
            <div className="text-xs text-gray-500">{record.teacher_name}</div>
          </div>
        );
      }
    },
    {
      title: 'កម្រិតរបស់គ្រូណែនាំ',
      key: 'mentor_level',
      width: 150,
      render: (record: any) => {
        if (record.verification_status === 'pending') {
          return <Tag color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }
        const subject = record.subject === 'language' || record.subject === 'khmer' ? 'language' : 'math';
        const mentorLevel = record.mentor_level || record.teacher_level;
        return (
          <div>
            <div className="font-medium">{getLevelLabelKM(subject, mentorLevel)}</div>
            <div className="text-xs text-gray-500">{record.mentor_name}</div>
          </div>
        );
      }
    },
    {
      title: 'ស្ថានភាព',
      key: 'comparison_status',
      width: 120,
      render: (record: any) => {
        if (record.verification_status === 'pending') {
          return <Tag color="orange">រង់ចាំផ្ទៀងផ្ទាត់</Tag>;
        }

        // Check if levels match
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
      width: 130,
      render: (record: any) => {
        if (record.verified_at) {
          return dayjs(record.verified_at).format('DD/MM/YYYY');
        }
        return '-';
      }
    }
  ];

  const rowSelection = {
    selectedRowKeys: selectedAssessments,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedAssessments(selectedRowKeys as number[]);
    },
    getCheckboxProps: (record: any) => ({
      disabled: record.status !== 'pending'
    })
  };

  return (
    <HorizontalLayout>
      <div className="max-w-full overflow-x-hidden">
        {/* Page Header */}
        <div className="mb-6">
          <Title level={2}>ផ្ទៀងផ្ទាត់ការវាយតម្លៃ</Title>
          <Text type="secondary">ពិនិត្យ និងផ្ទៀងផ្ទាត់ការវាយតម្លៃដែលធ្វើដោយគ្រូបង្រៀន</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[8, 8]} className="mb-6">
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="រង់ចាំផ្ទៀងផ្ទាត់"
                value={stats.pending}
                valueStyle={{ color: '#faad14', fontSize: '20px' }}
                prefix={<ExclamationCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="បានផ្ទៀងផ្ទាត់"
                value={stats.verified}
                valueStyle={{ color: '#52c41a', fontSize: '20px' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="បានបដិសេធ"
                value={stats.rejected}
                valueStyle={{ color: '#ff4d4f', fontSize: '20px' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card bodyStyle={{ padding: '16px' }}>
              <Statistic
                title="សរុប"
                value={stats.total}
                valueStyle={{ fontSize: '20px' }}
                prefix={<LockOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters */}
        <Card className="mb-6" bodyStyle={{ padding: '16px' }}>
          <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="ស្វែងរក..."
                prefix={<SearchOutlined />}
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                size="middle"
              />
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="ប្រភេទ"
                value={filters.assessment_type}
                onChange={(value) => setFilters({...filters, assessment_type: value})}
                allowClear
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="baseline">មូលដ្ឋាន</Option>
                <Option value="midline">ពាក់កណ្តាល</Option>
                <Option value="endline">បញ្ចប់</Option>
              </Select>
            </Col>
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="មុខវិជ្ជា"
                value={filters.subject}
                onChange={(value) => setFilters({...filters, subject: value})}
                allowClear
                style={{ width: '100%' }}
                size="middle"
              >
                <Option value="khmer">ភាសាខ្មែរ</Option>
                <Option value="math">គណិតវិទ្យា</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space wrap style={{ width: '100%' }}>
                <Button
                  onClick={() => {
                    setFilters({
                      search: '',
                      assessment_type: '',
                      subject: '',
                      school_id: '',
                      teacher_id: ''
                    });
                  }}
                  size="middle"
                >
                  សម្អាត
                </Button>
                {activeTab === 'comparison' && (
                  <>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportComparison}
                      loading={loading}
                      size="middle"
                      type="default"
                      disabled={comparisons.length === 0}
                    >
                      នាំចេញ Excel
                    </Button>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={handleExportMarkdown}
                      size="middle"
                      type="default"
                      disabled={comparisons.length === 0}
                    >
                      នាំចេញ Markdown
                    </Button>
                  </>
                )}
                {selectedAssessments.length > 0 && (
                  <Button
                    type="primary"
                    onClick={handleBulkVerify}
                    size="middle"
                  >
                    ផ្ទៀងផ្ទាត់ ({selectedAssessments.length})
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabs for different statuses */}
        <Card bodyStyle={{ padding: '16px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                key: 'pending',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    រង់ចាំ
                    <Badge count={stats.pending} offset={[5, 0]} style={{ marginLeft: '4px' }} />
                  </span>
                )
              },
              {
                key: 'verified',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    បានផ្ទៀងផ្ទាត់
                    <Badge count={stats.verified} offset={[5, 0]} showZero color="green" style={{ marginLeft: '4px' }} />
                  </span>
                )
              },
              {
                key: 'rejected',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    បានបដិសេធ
                    <Badge count={stats.rejected} offset={[5, 0]} showZero color="red" style={{ marginLeft: '4px' }} />
                  </span>
                )
              },
              {
                key: 'comparison',
                label: (
                  <span style={{ fontSize: '14px' }}>
                    ការប្រៀបធៀប
                    <Badge count={comparisonStats.total_assessments} offset={[5, 0]} showZero color="blue" style={{ marginLeft: '4px' }} />
                  </span>
                )
              }
            ]}
          />

          {/* Conditional rendering based on active tab */}
          {activeTab === 'comparison' ? (
            // Comparison Table with statistics
            <>
              <Row gutter={16} className="mb-4">
                <Col xs={12} sm={8} md={6}>
                  <Card>
                    <Statistic
                      title="សរុប"
                      value={comparisonStats.total_assessments}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card>
                    <Statistic
                      title="បានផ្ទៀងផ្ទាត់"
                      value={comparisonStats.verified_count}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card>
                    <Statistic
                      title="រង់ចាំ"
                      value={comparisonStats.pending_count}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Card>
                    <Statistic
                      title="មិនត្រូវគ្នា"
                      value={comparisonStats.level_mismatch_count}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
              </Row>
              <Table
                scroll={{ x: 1200, y: 600 }}
                columns={comparisonColumns}
                dataSource={comparisons}
                rowKey={(record) => `${record.teacher_assessment_id}_${record.student_id}`}
                loading={loading}
                pagination={{
                  pageSize: 20,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  showTotal: (total) => `សរុប ${total} ការវាយតម្លៃ`
                }}
                size="small"
              />
            </>
          ) : (
            // Regular verification table
            <Table
              scroll={{ x: 800, y: 600 }}
              rowSelection={activeTab === 'pending' ? rowSelection : undefined}
              columns={columns}
              dataSource={assessments.filter(a => a.status === activeTab)}
              rowKey="id"
              loading={loading}
              pagination={false}  // Disable pagination completely
              size="small"
              footer={() => (
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  សរុប {assessments.filter(a => a.status === activeTab).length} ការវាយតម្លៃ
                </div>
              )}
            />
          )}
        </Card>

        {/* Verification Modal */}
        <Modal
          title="ផ្ទៀងផ្ទាត់ការវាយតម្លៃ"
          open={verifyModalVisible}
          onOk={handleVerifySubmit}
          onCancel={() => {
            setVerifyModalVisible(false);
            form.resetFields();
          }}
          okText="រក្សាទុក"
          cancelText="បោះបង់"
          width={600}
        >
          {selectedAssessment && (
            <div className="mb-4">
              <div className="bg-gray-50 p-4 rounded">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="text-sm">
                      <strong>សិស្ស:</strong> {selectedAssessment.student_name}
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="text-sm">
                      <strong>ពិន្ទុ:</strong> {selectedAssessment.score}%
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="text-sm">
                      <strong>មុខវិជ្ជា:</strong> {selectedAssessment.subject === 'khmer' ? 'ភាសាខ្មែរ' : 'គណិតវិទ្យា'}
                    </div>
                  </Col>
                  <Col span={12} className="mt-2">
                    <div className="text-sm">
                      <strong>កម្រិត:</strong> {selectedAssessment.level}
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          )}

          <Form form={form} layout="vertical">
            <Form.Item
              name="action"
              label="សកម្មភាព"
              rules={[{ required: true, message: 'សូមជ្រើសរើសសកម្មភាព' }]}
              initialValue="verify"
            >
              <Select>
                <Option value="verify">
                  <CheckCircleOutlined style={{ color: 'green' }} /> ផ្ទៀងផ្ទាត់
                </Option>
                <Option value="reject">
                  <CloseCircleOutlined style={{ color: 'red' }} /> បដិសេធ
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="comments"
              label="មតិយោបល់"
              rules={[{ required: true, message: 'សូមបញ្ចូលមតិយោបល់' }]}
            >
              <TextArea rows={4} placeholder="បញ្ចូលមតិយោបល់របស់អ្នក..." />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </HorizontalLayout>
  );
}