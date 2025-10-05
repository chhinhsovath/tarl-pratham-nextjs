'use client';

import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Tag, Button, Space, message, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import dayjs from 'dayjs';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const data = await response.json();
      setUser(data.user || data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      message.error('មិនអាចទាញយកទិន្នន័យអ្នកប្រើប្រាស់បានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        message.success('អ្នកប្រើប្រាស់ត្រូវបានលុបដោយជោគជ័យ');
        router.push('/users');
      } else {
        const error = await response.json();
        message.error(error.error || 'មិនអាចលុបអ្នកប្រើប្រាស់បានទេ');
      }
    } catch (error) {
      message.error('មិនអាចលុបអ្នកប្រើប្រាស់បានទេ');
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

  if (!user) {
    return (
      <HorizontalLayout>
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">រកមិនឃើញអ្នកប្រើប្រាស់នេះទេ</p>
            <Button
              type="primary"
              onClick={() => router.push('/users')}
              className="mt-4"
            >
              ត្រលប់ទៅបញ្ជីអ្នកប្រើប្រាស់
            </Button>
          </div>
        </Card>
      </HorizontalLayout>
    );
  }

  const roleMap = {
    admin: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ',
    coordinator: 'អ្នកសម្របសម្រួល',
    mentor: 'អ្នកណែនាំ',
    teacher: 'គ្រូបង្រៀន',
    viewer: 'អ្នកមើល'
  };

  return (
    <HorizontalLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push('/users')}
            className="mb-4"
          >
            ត្រលប់ទៅបញ្ជី
          </Button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                ព័ត៌មានលម្អិតអ្នកប្រើប្រាស់
              </h1>
              <p className="text-gray-600">
                អ្នកប្រើប្រាស់លេខ #{user.id}
              </p>
            </div>

            <Space>
              {session?.user?.role === 'admin' && (
                <>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => router.push(`/users/${params.id}/edit`)}
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
                </>
              )}
            </Space>
          </div>
        </div>

        {/* User Details */}
        <Card className="mb-6">
          <Descriptions
            title="ព័ត៌មានទូទៅ"
            bordered
            column={{ xs: 1, sm: 1, md: 2 }}
            size="middle"
          >
            <Descriptions.Item label="ឈ្មោះអ្នកប្រើប្រាស់">
              <strong>{user.username}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="ឈ្មោះពេញ">
              <strong>{user.name}</strong>
            </Descriptions.Item>

            <Descriptions.Item label="អ៊ីមែល">
              {user.email || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="លេខទូរស័ព្ទ">
              {user.phone || '-'}
            </Descriptions.Item>

            <Descriptions.Item label="តួនាទី">
              <Tag color={
                user.role === 'admin' ? 'red' :
                user.role === 'coordinator' ? 'orange' :
                user.role === 'mentor' ? 'blue' :
                user.role === 'teacher' ? 'green' : 'default'
              }>
                {roleMap[user.role as keyof typeof roleMap] || user.role}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="ស្ថានភាព">
              <Tag color={user.is_active ? 'green' : 'red'}>
                {user.is_active ? 'សកម្ម' : 'អសកម្ម'}
              </Tag>
            </Descriptions.Item>

            {user.pilot_school && (
              <Descriptions.Item label="សាលារៀន" span={2}>
                <strong>{user.pilot_school.school_name}</strong>
                <br />
                <span className="text-gray-500">{user.pilot_school.school_code}</span>
              </Descriptions.Item>
            )}

            {user.province && (
              <Descriptions.Item label="ខេត្ត">
                {user.province}
              </Descriptions.Item>
            )}

            {user.district && (
              <Descriptions.Item label="ស្រុក">
                {user.district}
              </Descriptions.Item>
            )}

            {user.commune && (
              <Descriptions.Item label="ឃុំ">
                {user.commune}
              </Descriptions.Item>
            )}

            {user.village && (
              <Descriptions.Item label="ភូមិ">
                {user.village}
              </Descriptions.Item>
            )}

            <Descriptions.Item label="បង្កើតនៅ">
              {user.created_at ? dayjs(user.created_at).format('DD/MM/YYYY HH:mm') : '-'}
            </Descriptions.Item>

            <Descriptions.Item label="កែប្រែចុងក្រោយ">
              {user.updated_at ? dayjs(user.updated_at).format('DD/MM/YYYY HH:mm') : '-'}
            </Descriptions.Item>

            {user.last_login && (
              <Descriptions.Item label="ចូលប្រើចុងក្រោយ">
                {dayjs(user.last_login).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* Additional Information */}
        {(user.bio || user.notes) && (
          <Card title="ព័ត៌មានបន្ថែម">
            {user.bio && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">ប្រវត្តិសង្ខេប</h4>
                <p className="text-gray-700">{user.bio}</p>
              </div>
            )}
            {user.notes && (
              <div>
                <h4 className="font-semibold mb-2">កំណត់សម្គាល់</h4>
                <p className="text-gray-700">{user.notes}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </HorizontalLayout>
  );
}
