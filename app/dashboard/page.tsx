'use client';

import { Typography } from 'antd';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import MentorDashboard from '@/components/dashboards/MentorDashboard';
import CoordinatorDashboard from '@/components/dashboards/CoordinatorDashboard';
import ViewerDashboard from '@/components/dashboards/ViewerDashboard';

const { Text, Title } = Typography;

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>កំពុងដំណើរការ...</Text>
        </div>
      </DashboardLayout>
    );
  }

  const renderRoleSpecificDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard userId={user.id} />;
      case 'teacher':
        return <TeacherDashboard userId={user.id} user={user} />;
      case 'mentor':
        return <MentorDashboard userId={user.id} user={user} />;
      case 'coordinator':
        return <CoordinatorDashboard userId={user.id} user={user} />;
      case 'viewer':
        return <ViewerDashboard userId={user.id} user={user} />;
      default:
        return (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Title level={4}>សួស្តី {user.name}!</Title>
            <Text type="secondary">
              ផ្ទាំងគ្រប់គ្រងរបស់អ្នក ({user.role}) កំពុងអភិវឌ្ឍន៍។
            </Text>
          </div>
        );
    }
  };

  return (
    <DashboardLayout>
      {renderRoleSpecificDashboard()}
    </DashboardLayout>
  );
}