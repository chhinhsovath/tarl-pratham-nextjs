import { Step } from 'react-joyride';

export interface TourStep extends Step {
  id: string;
  page?: string;
  role?: string[];
}

export interface TourContent {
  title: string;
  content: string;
  skip?: string;
  next?: string;
  back?: string;
  last?: string;
  close?: string;
}

// Multilingual content for tours
export const tourTexts = {
  km: {
    welcome: {
      title: 'សូមស្វាគមន៍មកកាន់ TaRL ប្រាថម!',
      content: 'សូមអនុញ្ញាតឱ្យយើងណែនាំអ្នកជុំវិញមុខងារសំខាន់ៗនៃប្រព័ន្ធនេះ។',
    },
    navigation: {
      title: 'ម៉ឺនុយសំខាន់',
      content: 'នេះជាតំណភ្ជាប់សំខាន់ៗដើម្បីចូលទៅកាន់មុខងារនីមួយៗ។',
    },
    dashboard: {
      title: 'ផ្ទាំងគ្រប់គ្រង',
      content: 'មើលទិន្នន័យសរុបនិងស្ថិតិសំខាន់ៗនៅទីនេះ។',
    },
    assessments: {
      title: 'ការវាយតម្លៃ',
      content: 'បង្កើត និងគ្រប់គ្រងការវាយតម្លៃសិស្សនៅទីនេះ។',
    },
    students: {
      title: 'គ្រប់គ្រងសិស្ស',
      content: 'បន្ថែម កែសម្រួល និងតាមដានព័ត៌មានសិស្ស។',
    },
    reports: {
      title: 'របាយការណ៍',
      content: 'មើលរបាយការណ៍លម្អិតនិងវិភាគទិន្នន័យ។',
    },
    profile: {
      title: 'ប្រវត្តិរូបអ្នកប្រើ',
      content: 'កែសម្រួលព័ត៌មានផ្ទាល់ខ្លួន និងការកំណត់។',
    },
    help: {
      title: 'ជំនួយ',
      content: 'រកឃើញការណែនាំនិងជំនួយបន្ថែម។',
    },
    stats: {
      title: 'ស្ថិតិសំខាន់',
      content: 'ទិន្នន័យសំខាន់ៗត្រូវបានបង្ហាញនៅទីនេះ។',
    },
    charts: {
      title: 'តារាងនិងក្រាហ្វិក',
      content: 'មើលលទ្ធផលតាមទម្រង់ក្រាហ្វិកនិងតារាង។',
    },
    filters: {
      title: 'ត្រងទិន្នន័យ',
      content: 'ប្រើប្រាស់ឧបករណ៍ត្រងដើម្បីស្វែងរកទិន្នន័យ។',
    },
    actions: {
      title: 'សកម្មភាពរហ័ស',
      content: 'ចុចទីនេះដើម្បីធ្វើសកម្មភាពនានា។',
    },
    controls: {
      skip: 'រំលង',
      next: 'បន្ទាប់',
      back: 'ត្រលប់',
      last: 'បញ្ចប់',
      close: 'បិទ',
    }
  },
  en: {
    welcome: {
      title: 'Welcome to TaRL Pratham!',
      content: 'Let us guide you through the key features of this system.',
    },
    navigation: {
      title: 'Main Navigation',
      content: 'These are the important links to access different features.',
    },
    dashboard: {
      title: 'Dashboard',
      content: 'View overall statistics and important data here.',
    },
    assessments: {
      title: 'Assessments',
      content: 'Create and manage student assessments here.',
    },
    students: {
      title: 'Student Management',
      content: 'Add, edit, and track student information.',
    },
    reports: {
      title: 'Reports',
      content: 'View detailed reports and data analysis.',
    },
    profile: {
      title: 'User Profile',
      content: 'Edit your personal information and settings.',
    },
    help: {
      title: 'Help',
      content: 'Find additional guidance and support.',
    },
    stats: {
      title: 'Key Statistics',
      content: 'Important data is displayed here.',
    },
    charts: {
      title: 'Charts and Graphs',
      content: 'View results in graphical and tabular format.',
    },
    filters: {
      title: 'Data Filters',
      content: 'Use filter tools to search for data.',
    },
    actions: {
      title: 'Quick Actions',
      content: 'Click here to perform various actions.',
    },
    controls: {
      skip: 'Skip',
      next: 'Next',
      back: 'Back',
      last: 'Finish',
      close: 'Close',
    }
  }
};

// Role-based tour steps configuration
export const getTourSteps = (role: string, language: 'km' | 'en' = 'km'): TourStep[] => {
  const texts = tourTexts[language];

  const commonSteps: TourStep[] = [
    {
      id: 'welcome',
      target: 'body',
      content: texts.welcome.content,
      title: texts.welcome.title,
      placement: 'center',
      disableBeacon: true,
    },
    {
      id: 'main-logo',
      target: '[href="/dashboard"]',
      content: texts.navigation.content,
      title: texts.navigation.title,
      placement: 'bottom',
    },
    {
      id: 'user-profile',
      target: '.ant-dropdown-trigger',
      content: texts.profile.content,
      title: texts.profile.title,
      placement: 'bottom-end',
    },
  ];

  // Role-specific steps
  const roleSteps: Record<string, TourStep[]> = {
    admin: [
      ...commonSteps,
      {
        id: 'dashboard-nav',
        target: '[href="/dashboard"]',
        content: texts.dashboard.content,
        title: texts.dashboard.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'assessments-nav',
        target: '[href="/assessments"]',
        content: texts.assessments.content,
        title: texts.assessments.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'students-nav',
        target: '[href="/students"]',
        content: texts.students.content,
        title: texts.students.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'reports-nav',
        target: '[href="/reports"]',
        content: texts.reports.content,
        title: texts.reports.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'admin-nav',
        target: '[href="/users"]',
        content: 'គ្រប់គ្រងអ្នកប្រើប្រាស់ និងការកំណត់ប្រព័ន្ធ។',
        title: 'ផ្នែករដ្ឋបាល',
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'help-nav',
        target: '[href="/help"]',
        content: texts.help.content,
        title: texts.help.title,
        placement: 'bottom',
        page: 'navigation',
      },
    ],
    teacher: [
      ...commonSteps,
      {
        id: 'dashboard-nav',
        target: '[href="/dashboard"]',
        content: texts.dashboard.content,
        title: texts.dashboard.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'assessments-nav',
        target: '[href="/assessments"]',
        content: texts.assessments.content,
        title: texts.assessments.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'students-nav',
        target: '[href="/students"]',
        content: texts.students.content,
        title: texts.students.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'reports-nav',
        target: '[href="/reports"]',
        content: texts.reports.content,
        title: texts.reports.title,
        placement: 'bottom',
        page: 'navigation',
      },
    ],
    mentor: [
      ...commonSteps,
      {
        id: 'dashboard-nav',
        target: '[href="/dashboard"]',
        content: texts.dashboard.content,
        title: texts.dashboard.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'assessments-nav',
        target: '[href="/assessments"]',
        content: texts.assessments.content,
        title: texts.assessments.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'mentoring-nav',
        target: '[href="/mentoring"]',
        content: 'គ្រប់គ្រងការណែនាំ និងដំណើរទស្សនកិច្ច។',
        title: 'ការណែនាំ',
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'students-nav',
        target: '[href="/students"]',
        content: texts.students.content,
        title: texts.students.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'reports-nav',
        target: '[href="/reports"]',
        content: texts.reports.content,
        title: texts.reports.title,
        placement: 'bottom',
        page: 'navigation',
      },
    ],
    coordinator: [
      ...commonSteps,
      {
        id: 'coordinator-nav',
        target: '[href="/coordinator"]',
        content: 'កន្លែងធ្វើការសម្រាប់សម្របសម្រួលការងារ។',
        title: 'កន្លែងធ្វើការសម្របសម្រួល',
        placement: 'bottom',
        page: 'navigation',
      },
    ],
    viewer: [
      ...commonSteps,
      {
        id: 'dashboard-nav',
        target: '[href="/dashboard"]',
        content: texts.dashboard.content,
        title: texts.dashboard.title,
        placement: 'bottom',
        page: 'navigation',
      },
      {
        id: 'reports-nav',
        target: '[href="/reports"]',
        content: texts.reports.content,
        title: texts.reports.title,
        placement: 'bottom',
        page: 'navigation',
      },
    ],
  };

  return roleSteps[role] || commonSteps;
};

// Dashboard-specific tour steps
export const getDashboardTourSteps = (role: string, language: 'km' | 'en' = 'km'): TourStep[] => {
  const texts = tourTexts[language];

  return [
    {
      id: 'dashboard-stats',
      target: '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4',
      content: texts.stats.content,
      title: texts.stats.title,
      placement: 'bottom',
      page: 'dashboard',
    },
    {
      id: 'dashboard-chart',
      target: '.h-64.md\\:h-96, .h-64.md\\:h-80',
      content: texts.charts.content,
      title: texts.charts.title,
      placement: 'top',
      page: 'dashboard',
    },
    {
      id: 'dashboard-actions',
      target: '.ant-card:last-child',
      content: texts.actions.content,
      title: texts.actions.title,
      placement: 'top',
      page: 'dashboard',
    },
  ];
};

// Reports page tour steps
export const getReportsTourSteps = (language: 'km' | 'en' = 'km'): TourStep[] => {
  const texts = tourTexts[language];

  return [
    {
      id: 'reports-stats',
      target: '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4',
      content: texts.stats.content,
      title: texts.stats.title,
      placement: 'bottom',
      page: 'reports',
    },
    {
      id: 'reports-cards',
      target: '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3',
      content: 'ជ្រើសរើសប្រភេទរបាយការណ៍ដែលអ្នកចង់មើល។',
      title: 'ប្រភេទរបាយការណ៍',
      placement: 'top',
      page: 'reports',
    },
  ];
};

// Assessments page tour steps
export const getAssessmentsTourSteps = (language: 'km' | 'en' = 'km'): TourStep[] => {
  const texts = tourTexts[language];

  return [
    {
      id: 'assessments-create',
      target: '[href="/assessments/create"]',
      content: 'ចុចទីនេះដើម្បីបង្កើតការវាយតម្លៃថ្មី។',
      title: 'បង្កើតការវាយតម្លៃ',
      placement: 'bottom',
      page: 'assessments',
    },
    {
      id: 'assessments-filters',
      target: '.ant-card:first-child',
      content: texts.filters.content,
      title: texts.filters.title,
      placement: 'bottom',
      page: 'assessments',
    },
    {
      id: 'assessments-table',
      target: '.ant-table',
      content: 'បញ្ជីការវាយតម្លៃទាំងអស់ត្រូវបានបង្ហាញនៅទីនេះ។',
      title: 'បញ្ជីការវាយតម្លៃ',
      placement: 'top',
      page: 'assessments',
    },
  ];
};