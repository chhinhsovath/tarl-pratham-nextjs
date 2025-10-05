'use client';

import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, Space, message, Spin, Tabs } from 'antd';
import { ArrowLeftOutlined, EditOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

export default function SchoolDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [school, setSchool] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0
  });

  useEffect(() => {
    if (params.id) {
      fetchSchool();
      fetchSchoolStats();
    }
  }, [params.id]);

  const fetchSchool = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pilot-schools/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch school');
      }

      const data = await response.json();
      setSchool(data.school || data.data);
    } catch (error) {
      console.error('Error fetching school:', error);
      message.error('មិនអាចទាញយកទិន្នន័យសាលារៀនបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolStats = async () => {
    try {
      // Fetch students count
      const studentsResponse = await fetch(`/api/students?pilot_school_id=${params.id}`);
      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStats(prev => ({
          ...prev,
          totalStudents: studentsData.pagination?.total || studentsData.students?.length || 0
        }));
      }

      // Fetch teachers count
      const teachersResponse = await fetch(`/api/users?role=teacher&pilot_school_id=${params.id}`);
      if (teachersResponse.ok) {
        const teachersData = await teachersResponse.json();
        setStats(prev => ({
          ...prev,
          totalTeachers: teachersData.pagination?.total || teachersData.users?.length || 0
        }));
      }
    } catch (error) {
      console.error('Error fetching school stats:', error);
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

  if (!school) {
    return (
      <HorizontalLayout>
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">រកមិនឃើញសាលារៀននេះទេ</p>
            <Button
              type="primary"
              onClick={() => router.push('/schools')}
              className="mt-4"
            >
              ត្រលប់ទៅបញ្ជីសាលារៀន
            </Button>
          </div>
        </Card>
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/schools')}
            className="mb-4"
          >
            ត្រលប់ទៅបញ្ជី
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {school.school_name}
              </h1>
              <p className="text-gray-600">
                លេខកូដ: {school.school_code}
              </p>
            </div>

            <Space>
              {(session?.user?.role === 'admin' || session?.user?.role === 'coordinator') && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => router.push(`/schools/${params.id}/edit`)}
                >
                  កែសម្រួល
                </Button>
              )}
            </Space>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <TeamOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">សិស្សសរុប</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <UserOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">គ្រូបង្រៀនសរុប</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalTeachers}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <TeamOutlined className="text-2xl text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">ថ្នាក់សរុប</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalClasses}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* School Details */}
        <Card className="mb-6">
          <Descriptions
            title="ព័ត៌មានសាលារៀន"
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            size="middle"
          >
            <Descriptions.Item label="ឈ្មោះសាលា" span={2}>
              <strong className="text-lg">{school.school_name}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="លេខកូដសាលា">
              <Tag color="blue">{school.school_code}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="ប្រភេទសាលា">
              {school.school_type || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ខេត្ត">
              {school.province || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ស្រុក/ខណ្ឌ">
              {school.district || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ឃុំ/សង្កាត់">
              {school.commune || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="ភូមិ">
              {school.village || '-'}
            </Descriptions.Item>

            {school.address && (
              <Descriptions.Item label="អាសយដ្ឋាន" span={2}>
                {school.address}
              </Descriptions.Item>
            )}

            {school.director_name && (
              <Descriptions.Item label="នាយកសាលា">
                {school.director_name}
              </Descriptions.Item>
            )}

            {school.director_phone && (
              <Descriptions.Item label="លេខទូរស័ព្ទនាយក">
                {school.director_phone}
              </Descriptions.Item>
            )}

            {school.email && (
              <Descriptions.Item label="អ៊ីមែល">
                {school.email}
              </Descriptions.Item>
            )}

            {school.phone && (
              <Descriptions.Item label="លេខទូរស័ព្ទសាលា">
                {school.phone}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="ស្ថានភាព">
              <Tag color={school.is_active ? 'green' : 'red'}>
                {school.is_active ? 'សកម្ម' : 'អសកម្ម'}
              </Tag>
            </Descriptions.Item>

            {school.pilot_program && (
              <Descriptions.Item label="កម្មវិធីសាកល្បង">
                <Tag color="orange">កម្មវិធីសាកល្បង</Tag>
              </Descriptions.Item>
            )}

            <Descriptions.Item label="បង្កើតនៅ">
              {school.created_at ? dayjs(school.created_at).format('DD/MM/YYYY HH:mm') : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="កែប្រែចុងក្រោយ">
              {school.updated_at ? dayjs(school.updated_at).format('DD/MM/YYYY HH:mm') : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Quick Actions */}
        <Card title="សកម្មភាពរហ័ស">
          <Space wrap>
            <Button
              type="primary"
              icon={<TeamOutlined />}
              onClick={() => router.push(`/schools/${params.id}/students`)}
            >
              មើលបញ្ជីសិស្ស
            </Button>
            <Button
              type="default"
              icon={<UserOutlined />}
              onClick={() => router.push(`/schools/${params.id}/teachers`)}
            >
              មើលបញ្ជីគ្រូបង្រៀន
            </Button>
            <Button
              type="default"
              onClick={() => router.push(`/assessments?pilot_school_id=${params.id}`)}
            >
              មើលការវាយតម្លៃ
            </Button>
            <Button
              type="default"
              onClick={() => router.push(`/mentoring?pilot_school_id=${params.id}`)}
            >
              មើលការចុះអប់រំ
            </Button>
          </Space>
        </Card>
      </div>
    </HorizontalLayout>
  );
}
