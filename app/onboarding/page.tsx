'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, Button, Progress, Typography, Space, Tag, Divider, Row, Col, Alert, Modal, message as antdMessage } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  PlayCircleOutlined,
  SettingOutlined,
  UserOutlined,
  UploadOutlined,
  BarChartOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  HomeOutlined,
  LineChartOutlined,
  TranslationOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  tasks: string[];
  route: string;
  icon: string;
  estimated_time: string;
}

interface OnboardingData {
  title: string;
  description: string;
  steps: OnboardingStep[];
}

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      generateOnboardingData();
      getCompletedSteps();
    }
  }, [session]);

  const generateOnboardingData = () => {
    const role = session?.user?.role;
    const workflows: Record<string, OnboardingData> = {
      admin: {
        title: 'ការណែនាំសម្រាប់អ្នកគ្រប់គ្រង (Administrator Guide)',
        description: 'ស្វាគមន៍មកកាន់ប្រព័ន្ធ TaRL! ជាអ្នកគ្រប់គ្រង អ្នកមានសិទ្ធិពេញលេញក្នុងការគ្រប់គ្រងប្រព័ន្ធ។',
        steps: [
          {
            id: 'setup_system',
            title: '១. រៀបចំប្រព័ន្ធ',
            description: 'ចាប់ផ្តើមដោយការរៀបចំព័ត៌មានមូលដ្ឋាននៃប្រព័ន្ធ',
            tasks: [
              'បង្កើតសាលារៀន និងព័ត៌មានផ្សេងៗ',
              'កំណត់កាលបរិច្ឆេទវាយតម្លៃ',
              'ពិនិត្យការកំណត់ប្រព័ន្ធ'
            ],
            route: '/admin/schools',
            icon: 'setting',
            estimated_time: '15 នាទី'
          },
          {
            id: 'manage_users',
            title: '២. គ្រប់គ្រងអ្នកប្រើប្រាស់',
            description: 'បន្ថែម និងគ្រប់គ្រងគ្រូបង្រៀន អ្នកណែនាំ និងអ្នកសម្របសម្រួល',
            tasks: [
              'បង្កើតគណនីគ្រូបង្រៀន',
              'កំណត់តួនាទីអ្នកណែនាំ',
              'ផ្តល់សិទ្ធិដល់អ្នកប្រើប្រាស់'
            ],
            route: '/admin/users',
            icon: 'team',
            estimated_time: '20 នាទី'
          },
          {
            id: 'import_data',
            title: '៣. នាំចូលទិន្នន័យ',
            description: 'នាំចូលទិន្នន័យសិស្ស និងព័ត៌មានចាំបាច់ផ្សេងៗ',
            tasks: [
              'ទាញយកគំរូ Excel',
              'រៀបចំទិន្នន័យសិស្ស',
              'នាំចូលទិន្នន័យ'
            ],
            route: '/admin/import',
            icon: 'upload',
            estimated_time: '30 នាទី'
          },
          {
            id: 'monitor_system',
            title: '៤. ត្រួតពិនិត្យប្រព័ន្ធ',
            description: 'ពិនិត្យការប្រើប្រាស់ និងរបាយការណ៍',
            tasks: [
              'មើលរបាយការណ៍សង្ខេប',
              'ពិនិត្យការវាយតម្លៃ',
              'វិភាគលទ្ធផល'
            ],
            route: '/reports',
            icon: 'bar-chart',
            estimated_time: '10 នាទី'
          }
        ]
      },
      teacher: {
        title: 'ការណែនាំសម្រាប់គ្រូបង្រៀន (Teacher Guide)',
        description: 'ស្វាគមន៍គ្រូ! ប្រព័ន្ធនេះនឹងជួយអ្នកក្នុងការគ្រប់គ្រងសិស្ស និងធ្វើការវាយតម្លៃ TaRL។',
        steps: [
          {
            id: 'complete_profile',
            title: '១. បំពេញប្រវត្តិរូប',
            description: 'បំពេញព័ត៌មានផ្ទាល់ខ្លួន និងព័ត៌មានការងារ',
            tasks: [
              'បំពេញឈ្មោះ និងព័ត៌មានទំនាក់ទំនង',
              'កំណត់មុខវិជ្ជាបង្រៀន',
              'បញ្ជាក់ថ្នាក់រៀនទទួលបន្ទុក'
            ],
            route: '/profile-setup',
            icon: 'user',
            estimated_time: '5 នាទី'
          },
          {
            id: 'add_students',
            title: '២. បន្ថែមសិស្ស',
            description: 'បន្ថែមសិស្សក្នុងថ្នាក់របស់អ្នក',
            tasks: [
              'បន្ថែមសិស្សម្នាក់ៗ',
              'ឬបន្ថែមសិស្សច្រើននាក់ក្នុងពេលតែមួយ',
              'ពិនិត្យព័ត៌មានសិស្ស'
            ],
            route: '/students',
            icon: 'team',
            estimated_time: '15 នាទី'
          },
          {
            id: 'conduct_baseline',
            title: '៣. ធ្វើការវាយតម្លៃមូលដ្ឋាន',
            description: 'វាយតម្លៃកម្រិតចំណេះដឹងដើមរបស់សិស្ស',
            tasks: [
              'វាយតម្លៃភាសាខ្មែរ',
              'វាយតម្លៃគណិតវិទ្យា',
              'រក្សាទុកលទ្ធផល'
            ],
            route: '/assessments',
            icon: 'file-text',
            estimated_time: '45 នាទី'
          },
          {
            id: 'track_progress',
            title: '៤. តាមដានការរីកចម្រើន',
            description: 'មើលរបាយការណ៍ និងតាមដានការរីកចម្រើនរបស់សិស្ស',
            tasks: [
              'មើលរបាយការណ៍សិស្សរបស់ខ្ញុំ',
              'វិភាគលទ្ធផលវាយតម្លៃ',
              'រៀបចំផែនការបង្រៀន'
            ],
            route: '/reports',
            icon: 'line-chart',
            estimated_time: '10 នាទី'
          }
        ]
      },
      mentor: {
        title: 'ការណែនាំសម្រាប់អ្នកណែនាំ (Mentor Guide)',
        description: 'ស្វាគមន៍អ្នកណែនាំ! អ្នកអាចប្រើប្រាស់មុខងារគ្រូបង្រៀន និងមុខងារណែនាំ។ ទិន្នន័យរបស់អ្នកនឹងត្រូវលុបក្រោយ 48 ម៉ោង។',
        steps: [
          {
            id: 'complete_profile',
            title: '១. បំពេញប្រវត្តិរូប',
            description: 'កំណត់សាលារៀន មុខវិជ្ជា និងថ្នាក់ដែលអ្នកទទួលបន្ទុក',
            tasks: [
              'ជ្រើសរើសសាលារៀនពីបញ្ជី',
              'កំណត់មុខវិជ្ជា (ភាសាខ្មែរ/គណិតវិទ្យា)',
              'បញ្ជាក់ថ្នាក់រៀន (ថ្នាក់ទី៤/៥)'
            ],
            route: '/profile-setup',
            icon: 'user',
            estimated_time: '5 នាទី'
          },
          {
            id: 'test_student_management',
            title: '២. សាកល្បងគ្រប់គ្រងសិស្ស',
            description: 'បង្កើតសិស្សសាកល្បង (លុបស្វ័យប្រវត្តិក្រោយ 48 ម៉ោង)',
            tasks: [
              'បន្ថែមសិស្សសាកល្បង',
              'កែប្រែព័ត៌មានសិស្ស',
              'មើលបញ្ជីសិស្ស'
            ],
            route: '/students',
            icon: 'team',
            estimated_time: '10 នាទី'
          },
          {
            id: 'test_assessments',
            title: '៣. សាកល្បងធ្វើការវាយតម្លៃ',
            description: 'សាកល្បងបង្កើតការវាយតម្លៃ (លុបស្វ័យប្រវត្តិក្រោយ 48 ម៉ោង)',
            tasks: [
              'វាយតម្លៃសិស្សសាកល្បង',
              'បញ្ចូលពិន្ទុ',
              'រក្សាទុកលទ្ធផល'
            ],
            route: '/assessments',
            icon: 'file-text',
            estimated_time: '15 នាទី'
          },
          {
            id: 'plan_visits',
            title: '៤. រៀបចំទស្សនកិច្ចណែនាំ',
            description: 'រៀបចំកាលវិភាគទស្សនកិច្ចណែនាំ',
            tasks: [
              'កំណត់សាលាដែលត្រូវទៅ',
              'បង្កើតកាលវិភាគ',
              'រៀបចំសម្ភារៈចាំបាច់'
            ],
            route: '/mentoring',
            icon: 'calendar',
            estimated_time: '15 នាទី'
          }
        ]
      },
      coordinator: {
        title: 'ការណែនាំសម្រាប់អ្នកសម្របសម្រួល (Coordinator Guide)',
        description: 'ស្វាគមន៍អ្នកសម្របសម្រួល! អ្នកនឹងជួយគាំទ្រការអនុវត្ត TaRL នៅកម្រិតតំបន់។',
        steps: [
          {
            id: 'system_overview',
            title: '១. ពិនិត្យស្ថានភាពទូទៅ',
            description: 'មើលទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ',
            tasks: [
              'ពិនិត្យចំនួនសាលា',
              'មើលចំនួនគ្រូ និងសិស្ស',
              'វិភាគការប្រើប្រាស់ប្រព័ន្ធ'
            ],
            route: '/dashboard',
            icon: 'home',
            estimated_time: '10 នាទី'
          },
          {
            id: 'bulk_operations',
            title: '២. ការងារជាបរិមាណធំ',
            description: 'នាំចូលទិន្នន័យ និងគ្រប់គ្រងជាបរិមាណធំ',
            tasks: [
              'នាំចូលទិន្នន័យសាលា',
              'បង្កើតគណនីគ្រូជាបណ្តុំ',
              'នាំចូលទិន្នន័យសិស្ស'
            ],
            route: '/import',
            icon: 'upload',
            estimated_time: '25 នាទី'
          },
          {
            id: 'monitor_progress',
            title: '៣. តាមដានការរីកចម្រើន',
            description: 'ពិនិត្យលទ្ធផល និងរបាយការណ៍',
            tasks: [
              'មើលរបាយការណ៍ប្រៀបធៀបសាលា',
              'វិភាគការរីកចម្រើន',
              'រៀបចំរបាយការណ៍'
            ],
            route: '/reports',
            icon: 'bar-chart',
            estimated_time: '15 នាទី'
          }
        ]
      },
      viewer: {
        title: 'ការណែនាំសម្រាប់អ្នកមើល (Viewer Guide)',
        description: 'ស្វាគមន៍! អ្នកអាចមើលរបាយការណ៍ និងទិន្នន័យនានា។',
        steps: [
          {
            id: 'explore_dashboard',
            title: '១. ស្វែងយល់ពីផ្ទាំងគ្រប់គ្រង',
            description: 'មើលព័ត៌មានសង្ខេពទូទៅ',
            tasks: [
              'មើលស្ថិតិសំខាន់ៗ',
              'ពិនិត្យតារាងព័ត៌មាន',
              'យល់ពីសញ្ញាសម្គាល់'
            ],
            route: '/dashboard',
            icon: 'home',
            estimated_time: '5 នាទី'
          },
          {
            id: 'view_reports',
            title: '២. មើលរបាយការណ៍',
            description: 'ស្វែងរករបាយការណ៍ដែលអ្នកត្រូវការ',
            tasks: [
              'មើលការអនុវត្តសិស្ស',
              'ពិនិត្យការរីកចម្រើន',
              'ទាញយករបាយការណ៍'
            ],
            route: '/reports',
            icon: 'file-text',
            estimated_time: '10 នាទី'
          },
          {
            id: 'analyze_data',
            title: '៣. វិភាគទិន្នន័យ',
            description: 'ប្រើប្រាស់ឧបករណ៍វិភាគ',
            tasks: [
              'បកស្រាយតារាង',
              'យល់ពីទិន្នន័យ',
              'ស្វែងរកនិន្នាការ'
            ],
            route: '/assessments',
            icon: 'line-chart',
            estimated_time: '15 នាទី'
          }
        ]
      }
    };

    setOnboardingData(workflows[role as keyof typeof workflows] || workflows.viewer);
    setLoading(false);
  };

  const getCompletedSteps = async () => {
    // Fetch fresh session data from the API
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        const completed = user?.onboarding_completed;

        // Auto-complete step 1 if profile is set up
        if (user && user.pilot_school_id) {
          // User has completed profile setup
          if (!completed || (Array.isArray(completed) && !completed.includes('complete_profile'))) {
            // Auto-mark step 1 as complete
            await markStepComplete('complete_profile');
            return;
          }
        }

        if (completed) {
          const parsed = typeof completed === 'string' ? JSON.parse(completed) : completed;
          setCompletedSteps(Array.isArray(parsed) ? parsed : []);
          console.log('✅ Loaded completed steps:', parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error fetching onboarding status:', e);
    }

    // Fallback to session if API fails
    const completed = session?.user?.onboarding_completed;
    if (completed) {
      try {
        const parsed = typeof completed === 'string' ? JSON.parse(completed) : completed;
        setCompletedSteps(Array.isArray(parsed) ? parsed : []);
      } catch (e) {
        setCompletedSteps([]);
      }
    }
  };

  const getStepIcon = (iconName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      'setting': <SettingOutlined />,
      'user': <UserOutlined />,
      'team': <TeamOutlined />,
      'upload': <UploadOutlined />,
      'bar-chart': <BarChartOutlined />,
      'file-text': <FileTextOutlined />,
      'line-chart': <LineChartOutlined />,
      'calendar': <CalendarOutlined />,
      'home': <HomeOutlined />,
      'translate': <TranslationOutlined />
    };
    return iconMap[iconName] || <QuestionCircleOutlined />;
  };

  const calculateProgress = () => {
    if (!onboardingData) return { completed: 0, total: 0, percentage: 0 };
    
    const total = onboardingData.steps.length;
    const completed = completedSteps.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const handleStepClick = (step: OnboardingStep) => {
    console.log('🔥 Step clicked:', step.title, 'Route:', step.route);
    router.push(step.route);
  };

  const markStepComplete = async (stepId: string) => {
    try {
      // Show loading state
      const loadingMessage = message.loading('កំពុងរក្សាទុក...', 0);

      const response = await fetch('/api/onboarding/complete-step', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stepId }),
      });

      // Close loading
      loadingMessage();

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Step marked complete:', data);

        // Refresh completed steps
        await getCompletedSteps();

        // Show success message with celebration
        message.success({
          content: '🎉 ល្អណាស់! អ្នកបានបញ្ចប់ជំហាននេះដោយជោគជ័យ!',
          duration: 3,
          style: {
            marginTop: '20vh',
            fontSize: 16
          }
        });

        // Check if all steps completed
        const newProgress = calculateProgress();
        if (newProgress.percentage === 100) {
          setTimeout(() => {
            Modal.success({
              title: '🎊 អបអរសាទរ!',
              content: 'អ្នកបានបញ្ចប់ការណែនាំទាំងអស់! ឥឡូវនេះអ្នករួចរាល់ហើយ។',
              okText: 'ទៅផ្ទាំងគ្រប់គ្រង',
              centered: true,
              onOk: () => router.push('/dashboard')
            });
          }, 500);
        }
      } else {
        message.error('មិនអាចរក្សាទុក សូមព្យាយាមម្តងទៀត');
      }
    } catch (error) {
      console.error('Error marking step complete:', error);
      message.error('មានបញ្ហា សូមព្យាយាមម្តងទៀត');
    }
  };

  const isStepCompleted = (stepId: string) => completedSteps.includes(stepId);
  
  const isStepNext = (index: number) => {
    // Allow all steps to be clickable, not just sequential
    return true;
  };

  if (loading || !onboardingData) {
    return <div>Loading...</div>;
  }

  const progress = calculateProgress();
  const totalMinutes = onboardingData.steps.reduce((sum, step) => {
    const match = step.estimated_time.match(/\d+/);
    return sum + (match ? parseInt(match[0]) : 0);
  }, 0);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Title level={2} style={{ marginBottom: 8 }}>
                {onboardingData.title}
              </Title>
              <Text type="secondary" style={{ fontSize: 16 }}>
                {onboardingData.description}
              </Text>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Text type="secondary">វឌ្ឍនភាព</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Progress 
                  percent={progress.percentage} 
                  size="small" 
                  style={{ width: 120 }}
                  strokeColor="#1890ff"
                />
                <Text strong style={{ color: '#1890ff' }}>
                  {progress.completed}/{progress.total}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Welcome Alert */}
        <Alert
          message="ស្វាគមន៍មកកាន់ប្រព័ន្ធ TaRL!"
          description={
            <div>
              <Text>{onboardingData.description} សូមធ្វើតាមជំហានទាំងនេះដើម្បីចាប់ផ្តើមប្រើប្រាស់ប្រព័ន្ធ។</Text>
              <div style={{ marginTop: 8, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Text type="secondary">
                    <ClockCircleOutlined style={{ marginRight: 4 }} />
                    ប្រមាណ {totalMinutes} នាទី សរុប
                  </Text>
                  <Text type="secondary">
                    <CheckCircleOutlined style={{ marginRight: 4 }} />
                    {progress.completed} ពី {progress.total} ជំហាន
                  </Text>
                </div>
                <Button
                  type="default"
                  onClick={() => router.push('/dashboard')}
                  size="small"
                >
                  រំលងទៅ Dashboard →
                </Button>
              </div>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {/* Onboarding Steps */}
        <Row gutter={[16, 16]}>
          {onboardingData.steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.id);
            const isNext = !isCompleted && isStepNext(index);
            
            return (
              <Col key={step.id} xs={24} lg={12}>
                <Card 
                  style={{ 
                    height: '100%',
                    border: `2px solid ${isCompleted ? '#52c41a' : isNext ? '#1890ff' : '#d9d9d9'}`
                  }}
                  hoverable
                >
                  {/* Step Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isCompleted ? '#f6ffed' : isNext ? '#e6f7ff' : '#fafafa',
                        color: isCompleted ? '#52c41a' : isNext ? '#1890ff' : '#8c8c8c',
                        fontSize: 18
                      }}>
                        {isCompleted ? <CheckCircleOutlined /> : getStepIcon(step.icon)}
                      </div>
                      <div>
                        <Title level={4} style={{ 
                          marginBottom: 4,
                          color: isCompleted ? '#52c41a' : isNext ? '#1890ff' : '#595959'
                        }}>
                          {step.title}
                        </Title>
                        <Text type="secondary">{step.description}</Text>
                      </div>
                    </div>
                    <Tag color={isCompleted ? 'green' : 'blue'}>
                      {step.estimated_time}
                    </Tag>
                  </div>

                  {/* Tasks List */}
                  <div style={{ marginBottom: 16 }}>
                    <Space direction="vertical" size={4}>
                      {step.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CheckCircleOutlined 
                            style={{ 
                              color: isCompleted ? '#52c41a' : '#d9d9d9',
                              fontSize: 12
                            }} 
                          />
                          <Text 
                            type={isCompleted ? 'success' : 'secondary'}
                            style={{ fontSize: 14 }}
                          >
                            {task}
                          </Text>
                        </div>
                      ))}
                    </Space>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isCompleted ? (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag color="success" icon={<CheckCircleOutlined />} style={{ fontSize: 14, padding: '4px 12px' }}>
                          ✅ បានបញ្ចប់
                        </Tag>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => handleStepClick(step)}
                        >
                          មើលឡើងវិញ →
                        </Button>
                      </div>
                    ) : (
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          block
                          size="large"
                          onClick={() => handleStepClick(step)}
                          style={{ height: 44 }}
                        >
                          ចាប់ផ្តើម
                        </Button>
                        <Button
                          type="dashed"
                          icon={<CheckCircleOutlined />}
                          block
                          onClick={() => {
                            Modal.confirm({
                              title: 'បញ្ជាក់ការបញ្ចប់',
                              content: `តើអ្នកបានបញ្ចប់ "${step.title}" ហើយមែនទេ?`,
                              okText: 'បាទ/ចាស បានបញ្ចប់',
                              cancelText: 'បោះបង់',
                              onOk: () => markStepComplete(step.id),
                              centered: true
                            });
                          }}
                          style={{ borderStyle: 'dashed', color: '#52c41a' }}
                        >
                          ✓ សម្គាល់ថាបានបញ្ចប់
                        </Button>
                      </Space>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Quick Actions */}
        <Card 
          title="សកម្មភាពរហ័ស" 
          style={{ marginTop: 24 }}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            តំណភ្ជាប់ដែលអ្នកប្រើញឹកញាប់
          </Text>
          <Row gutter={[12, 12]}>
            <Col xs={12} sm={6}>
              <Button 
                icon={<TeamOutlined />} 
                onClick={() => router.push('/students')}
                block
              >
                សិស្ស
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<FileTextOutlined />} 
                onClick={() => router.push('/assessments')}
                block
              >
                វាយតម្លៃ
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<BarChartOutlined />} 
                onClick={() => router.push('/reports')}
                block
              >
                របាយការណ៍
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button 
                icon={<QuestionCircleOutlined />} 
                onClick={() => router.push('/help')}
                block
              >
                ជំនួយ
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Help Section */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary">
            ត្រូវការជំនួយ? 
            <Button type="link" onClick={() => router.push('/help')}>
              មើលការណែនាំលម្អិត
            </Button>
            ឬទាក់ទងក្រុមបច្ចេកទេស។
          </Text>
        </div>
      </div>
    </div>
  );
}