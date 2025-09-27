'use client';

import { Typography } from 'antd';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import UnifiedDashboard from '@/components/dashboards/UnifiedDashboard';

const { Text } = Typography;

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

  return (
    <DashboardLayout>
      <UnifiedDashboard />
    </DashboardLayout>
  );
}