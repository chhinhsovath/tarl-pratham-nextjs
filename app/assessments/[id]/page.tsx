'use client';

import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAssessment();
    }
  }, [params.id]);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assessments/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch assessment');
      }

      const data = await response.json();
      setAssessment(data.assessment || data.data);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      message.error('មិនអាចទាញយកទិន្នន័យការវាយតម្លៃបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/assessments/${params.id}`, {
        method: 'DELETE',
        headers: {
          'user-id': session?.user?.id?.toString() || '',
          'user-role': session?.user?.role || ''
        }
      });

      if (response.ok) {
        message.success('ការវាយតម្លៃត្រូវបានលុបដោយជោគជ័យ');
        router.push('/assessments');
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចលុបការវាយតម្លៃបានទេ');
      }
    } catch (error) {
      message.error('មិនអាចលុបការវាយតម្លៃបានទេ');
    }
  };

  if (loading) {
    return (
      <HorizontalLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spin size="large" />
        </div>
      </HorizontalLayout>
    );
  }

  if (!assessment) {
    return (
      <HorizontalLayout>
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">រកមិនឃើញការវាយតម្លៃនេះទេ</p>
            <Button
              type="primary"
              onClick={() => router.push('/assessments')}
              className="mt-4"
            >
              ត្រលប់ទៅបញ្ជីការវាយតម្លៃ
            </Button>
          </div>
        </Card>
      </HorizontalLayout>
    );
  }

  const typeMap = {
    'ដើមគ្រា': 'តេស្តដើមគ្រា',
    'ពាក់កណ្តាលគ្រា': 'តេស្តពាក់កណ្ដាលគ្រា',
    'ចុងគ្រា': 'តេស្តចុងក្រោយគ្រា',
    'baseline': 'តេស្តដើមគ្រា',
    'midline': 'តេស្តពាក់កណ្ដាលគ្រា',
    'endline': 'តេស្តចុងក្រោយគ្រា'
  };

  const subjectMap = {
    khmer: 'ភាសាខ្មែរ',
    math: 'គណិតវិទ្យា',
    language: 'ភាសាខ្មែរ'
  };

  const levelMap = {
    beginner: 'កម្រិតដំបូង',
    letter: 'តួអក្សរ',
    word: 'ពាក្យ',
    paragraph: 'កថាខណ្ឌ',
    story: 'រឿង'
  };

  return (
    <HorizontalLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/assessments')}
            className="mb-4"
          >
            ត្រលប់ទៅបញ្ជី
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                ព័ត៌មានលម្អិតការវាយតម្លៃ
              </h1>
              <p className="text-gray-600">
                ការវាយតម្លៃលេខ #{assessment.id}
              </p>
            </div>

            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => router.push(`/assessments/${params.id}/edit`)}
              >
                កែសម្រួល
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                លុប
              </Button>
            </Space>
          </div>
        </div>

        {/* Assessment Details */}
        <Card className="mb-6">
          <Descriptions
            title="ព័ត៌មានការវាយតម្លៃ"
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            size="middle"
          >
            <Descriptions.Item label="សិស្ស">
              <div>
                <strong>{assessment.student?.name}</strong>
                {assessment.student?.is_temporary && (
                  <Tag color="orange" size="small" className="ml-2">
                    បណ្តោះអាសន្ន
                  </Tag>
                )}
              </div>
            </Descriptions.Item>

            <Descriptions.Item label="ប្រភេទការវាយតម្លៃ">
              <Tag color={
                assessment.assessment_type === 'ដើមគ្រា' ? 'blue' :
                assessment.assessment_type === 'ពាក់កណ្តាលគ្រា' ? 'orange' : 'green'
              }>
                {typeMap[assessment.assessment_type as keyof typeof typeMap] || assessment.assessment_type}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="មុខវិជ្ជា">
              <Tag color={assessment.subject === 'khmer' ? 'purple' : 'cyan'}>
                {subjectMap[assessment.subject as keyof typeof subjectMap] || assessment.subject}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="កម្រិត">
              {assessment.level ? (
                <Tag color={
                  assessment.level === 'beginner' ? 'red' :
                  assessment.level === 'letter' ? 'orange' :
                  assessment.level === 'word' ? 'gold' :
                  assessment.level === 'paragraph' ? 'green' : 'blue'
                }>
                  {levelMap[assessment.level as keyof typeof levelMap] || assessment.level}
                </Tag>
              ) : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ពិន្ទុ">
              {assessment.score ? (
                <Tag color={
                  assessment.score >= 80 ? 'green' :
                  assessment.score >= 60 ? 'orange' : 'red'
                } style={{ fontSize: '16px', padding: '4px 12px' }}>
                  {assessment.score}%
                </Tag>
              ) : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="កាលបរិច្ឆេទវាយតម្លៃ">
              {assessment.assessed_date ? dayjs(assessment.assessed_date).format('DD/MM/YYYY') : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="វាយតម្លៃដោយ">
              {assessment.added_by ? (
                <div>
                  <div><strong>{assessment.added_by.name}</strong></div>
                  <Tag size="small" color={assessment.added_by.role === 'mentor' ? 'orange' : 'blue'}>
                    {assessment.added_by.role === 'mentor' ? 'អ្នកណែនាំ' : 'គ្រូបង្រៀន'}
                  </Tag>
                </div>
              ) : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ស្ថានភាព">
              <Space direction="vertical" size="small">
                {assessment.is_temporary && (
                  <Tag color="orange">បណ្តោះអាសន្ន</Tag>
                )}
                {assessment.assessed_by_mentor && (
                  <Tag color="gold">អ្នកណែនាំ</Tag>
                )}
                {!assessment.is_temporary && !assessment.assessed_by_mentor && (
                  <Tag color="green">ស្ថិរ</Tag>
                )}
              </Space>
            </Descriptions.Item>

            {assessment.pilot_school && (
              <Descriptions.Item label="សាលារៀន" span={2}>
                {assessment.pilot_school.school_name}
              </Descriptions.Item>
            )}

            {assessment.notes && (
              <Descriptions.Item label="កំណត់សម្គាល់" span={2}>
                {assessment.notes}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="បង្កើតនៅ">
              {dayjs(assessment.created_at).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>

            <Descriptions.Item label="កែប្រែចុងក្រោយ">
              {dayjs(assessment.updated_at).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Assessment Data */}
        {assessment.assessment_data && (
          <Card title="ទិន្នន័យការវាយតម្លៃ">
            <pre className="bg-gray-50 p-4 rounded overflow-auto">
              {JSON.stringify(assessment.assessment_data, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </HorizontalLayout>
  );
}
