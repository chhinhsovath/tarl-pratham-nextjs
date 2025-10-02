'use client';

import { Typography } from 'antd';
import HorizontalLayout from '@/components/layout/HorizontalLayout';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import SmartDashboard from '@/components/dashboards/SmartDashboard';
import OnboardingTour from '@/components/tour/OnboardingTour';

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
      <HorizontalLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Text>កំពុងដំណើរការ...</Text>
        </div>
      </HorizontalLayout>
    );
  }

  return (
    <HorizontalLayout>
      <SmartDashboard />
      {/* Dashboard-specific tour */}
      <OnboardingTour page="dashboard" autoStart={true} showStartButton={false} />
    </HorizontalLayout>
  );
}