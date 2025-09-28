/**
 * Mock Dashboard Data Generator
 * Provides realistic fallback data for dashboard charts and graphs
 * when database is empty or returns no data
 */

// Generate random number within range
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate trend data for line charts
const generateTrendData = (months: number = 6) => {
  const data = [];
  const currentDate = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    
    data.push({
      month: date.toLocaleDateString('km-KH', { month: 'short' }),
      monthEn: date.toLocaleDateString('en-US', { month: 'short' }),
      value: randomInRange(40, 95),
      baseline: randomInRange(30, 50),
      midline: randomInRange(50, 70),
      endline: randomInRange(70, 90)
    });
  }
  
  return data;
};

// Admin Dashboard Mock Data
export const generateAdminDashboardMockData = () => {
  return {
    // Key Performance Indicators
    stats: {
      totalSchools: 33,
      totalTeachers: 156,
      totalStudents: 2847,
      totalAssessments: 8541,
      activeUsers: 85,
      completionRate: 78.5,
      averageScore: 72.3,
      mentoringVisits: 234
    },

    // School Performance Comparison
    schoolPerformance: [
      { school: 'សាលាបឋមសិក្សាគំរូទី១', khmer: 85, math: 78, students: 120 },
      { school: 'សាលាបឋមសិក្សាវត្តភ្នំ', khmer: 82, math: 80, students: 98 },
      { school: 'សាលាបឋមសិក្សាព្រែកលៀប', khmer: 79, math: 75, students: 105 },
      { school: 'សាលាបឋមសិក្សាចំការដូង', khmer: 88, math: 82, students: 112 },
      { school: 'សាលាបឋមសិក្សាទួលទំពូង', khmer: 76, math: 73, students: 89 }
    ],

    // Assessment Progress Over Time
    assessmentTrend: generateTrendData(6),

    // Student Level Distribution
    levelDistribution: {
      khmer: [
        { level: 'Beginner', count: 320, percentage: 11.2 },
        { level: 'Letter', count: 580, percentage: 20.4 },
        { level: 'Word', count: 750, percentage: 26.3 },
        { level: 'Paragraph', count: 680, percentage: 23.9 },
        { level: 'Story', count: 517, percentage: 18.2 }
      ],
      math: [
        { level: 'Beginner', count: 380, percentage: 13.4 },
        { level: 'Letter', count: 620, percentage: 21.8 },
        { level: 'Word', count: 700, percentage: 24.6 },
        { level: 'Paragraph', count: 650, percentage: 22.8 },
        { level: 'Story', count: 497, percentage: 17.4 }
      ]
    },

    // Province Distribution
    provinceDistribution: [
      { province: 'ភ្នំពេញ', schools: 8, students: 750, teachers: 42 },
      { province: 'កណ្តាល', schools: 6, students: 580, teachers: 35 },
      { province: 'បាត់ដំបង', schools: 5, students: 420, teachers: 28 },
      { province: 'សៀមរាប', schools: 4, students: 380, teachers: 24 },
      { province: 'កំពង់ចាម', schools: 4, students: 360, teachers: 22 },
      { province: 'តាកែវ', schools: 3, students: 280, teachers: 18 },
      { province: 'ព្រៃវែង', schools: 3, students: 77, teachers: 15 }
    ],

    // Gender Distribution
    genderDistribution: {
      male: 1423,
      female: 1424,
      malePercentage: 50.0,
      femalePercentage: 50.0
    },

    // Assessment Phase Completion
    phaseCompletion: {
      baseline: { completed: 2560, total: 2847, percentage: 89.9 },
      midline: { completed: 1850, total: 2847, percentage: 65.0 },
      endline: { completed: 980, total: 2847, percentage: 34.4 }
    },

    // Recent Activities
    recentActivities: [
      {
        id: 1,
        type: 'assessment',
        description: 'បានបញ្ចប់ការវាយតម្លៃដើមគ្រា',
        user: 'គ្រូ សុខា',
        school: 'សាលាបឋមសិក្សាគំរូទី១',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      },
      {
        id: 2,
        type: 'mentoring',
        description: 'ការទស្សនកិច្ចណែនាំថ្មី',
        user: 'អ្នកណែនាំ ចាន់ សុភា',
        school: 'សាលាបឋមសិក្សាវត្តភ្នំ',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
      },
      {
        id: 3,
        type: 'student',
        description: 'បានបន្ថែមសិស្សថ្មី ២៥ នាក់',
        user: 'គ្រូ ដារា',
        school: 'សាលាបឋមសិក្សាព្រែកលៀប',
        timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
      }
    ],

    // Mock flag indicator
    mock: true,
    message: 'កំពុងប្រើទិន្នន័យគំរូសម្រាប់បង្ហាញ'
  };
};

// Coordinator Dashboard Mock Data
export const generateCoordinatorDashboardMockData = () => {
  return {
    stats: {
      totalSchools: 12,
      totalTeachers: 68,
      totalStudents: 980,
      totalAssessments: 2940,
      completionRate: 75.2,
      averageScore: 70.5,
      pendingVerifications: 45,
      recentMentoringVisits: 28
    },

    // Regional Performance
    regionalPerformance: generateTrendData(6),

    // School Rankings in Region
    schoolRankings: [
      { rank: 1, school: 'សាលាបឋមសិក្សាគំរូទី១', score: 88.5, trend: 'up' },
      { rank: 2, school: 'សាលាបឋមសិក្សាវត្តភ្នំ', score: 85.2, trend: 'up' },
      { rank: 3, school: 'សាលាបឋមសិក្សាព្រែកលៀប', score: 82.7, trend: 'stable' },
      { rank: 4, school: 'សាលាបឋមសិក្សាចំការដូង', score: 79.3, trend: 'down' },
      { rank: 5, school: 'សាលាបឋមសិក្សាទួលទំពូង', score: 76.8, trend: 'up' }
    ],

    // Teacher Performance Distribution
    teacherPerformance: {
      excellent: 15,
      good: 28,
      satisfactory: 20,
      needsImprovement: 5
    },

    // Assessment Coverage
    assessmentCoverage: {
      baseline: { khmer: 92, math: 88 },
      midline: { khmer: 68, math: 65 },
      endline: { khmer: 35, math: 32 }
    },

    // Pending Actions
    pendingActions: [
      { type: 'verification', count: 45, urgent: 12 },
      { type: 'mentorVisitReview', count: 8, urgent: 2 },
      { type: 'teacherApproval', count: 3, urgent: 1 }
    ],

    mock: true,
    message: 'ទិន្នន័យគំរូសម្រាប់អ្នកសម្របសម្រួល'
  };
};

// Mentor Dashboard Mock Data
export const generateMentorDashboardMockData = () => {
  return {
    stats: {
      assignedSchools: 3,
      totalTeachers: 18,
      totalStudents: 280,
      completedVisits: 42,
      upcomingVisits: 5,
      temporaryStudents: 12,
      averageClassSize: 28,
      improvementRate: 68.5
    },

    // Visit Calendar Data
    visitSchedule: [
      { date: '2025-09-30', school: 'សាលាបឋមសិក្សាគំរូទី១', status: 'scheduled' },
      { date: '2025-10-02', school: 'សាលាបឋមសិក្សាវត្តភ្នំ', status: 'scheduled' },
      { date: '2025-10-05', school: 'សាលាបឋមសិក្សាព្រែកលៀប', status: 'scheduled' }
    ],

    // Teacher Support Metrics
    teacherSupport: {
      lessonsObserved: 85,
      feedbackProvided: 78,
      improvementPlans: 12,
      followUpRequired: 8
    },

    // Class Observation Summary
    classObservations: [
      { aspect: 'ការរៀបចំថ្នាក់រៀន', score: 4.2, maxScore: 5 },
      { aspect: 'ការប្រើប្រាស់សម្ភារៈ', score: 3.8, maxScore: 5 },
      { aspect: 'ការចូលរួមរបស់សិស្ស', score: 4.0, maxScore: 5 },
      { aspect: 'គម្រោងមេរៀន', score: 3.5, maxScore: 5 },
      { aspect: 'វិធីសាស្ត្របង្រៀន', score: 3.9, maxScore: 5 }
    ],

    // Student Progress in Supported Classes
    studentProgress: generateTrendData(4),

    // Temporary Data Status (48-hour tracking)
    temporaryDataStatus: {
      activeStudents: 12,
      activeAssessments: 24,
      expiringIn24Hours: 3,
      expiringIn48Hours: 5,
      recentlyVerified: 8
    },

    mock: true,
    message: 'ទិន្នន័យគំរូសម្រាប់អ្នកណែនាំ'
  };
};

// Teacher Dashboard Mock Data
export const generateTeacherDashboardMockData = () => {
  return {
    stats: {
      totalStudents: 45,
      boysCount: 23,
      girlsCount: 22,
      averageAttendance: 92.5,
      completedAssessments: 135,
      pendingAssessments: 15,
      classAverage: 68.7,
      improvementRate: 15.2
    },

    // Class Performance Overview
    classPerformance: {
      khmer: {
        beginner: 5,
        letter: 8,
        word: 12,
        paragraph: 15,
        story: 5
      },
      math: {
        beginner: 6,
        letter: 9,
        word: 13,
        paragraph: 12,
        story: 5
      }
    },

    // Student Progress Tracking
    studentProgressChart: generateTrendData(4),

    // Recent Assessment Results
    recentAssessments: [
      { student: 'សុខ សុភា', subject: 'ភាសាខ្មែរ', level: 'Word', score: 75, date: '2025-09-25' },
      { student: 'ចាន់ ដារា', subject: 'គណិតវិទ្យា', level: 'Paragraph', score: 82, date: '2025-09-25' },
      { student: 'លី សុខា', subject: 'ភាសាខ្មែរ', level: 'Letter', score: 68, date: '2025-09-24' },
      { student: 'ហេង បូរី', subject: 'គណិតវិទ្យា', level: 'Word', score: 71, date: '2025-09-24' }
    ],

    // Individual Student Highlights
    topPerformers: [
      { name: 'សុខ សុភា', improvement: 25, currentLevel: 'Paragraph' },
      { name: 'ចាន់ ដារា', improvement: 22, currentLevel: 'Paragraph' },
      { name: 'លី សុខា', improvement: 18, currentLevel: 'Word' }
    ],

    needsSupport: [
      { name: 'សេង ពិសិដ្ឋ', currentLevel: 'Beginner', subject: 'ភាសាខ្មែរ' },
      { name: 'រិន សុវណ្ណា', currentLevel: 'Letter', subject: 'គណិតវិទ្យា' },
      { name: 'ជា សំអាត', currentLevel: 'Beginner', subject: 'ភាសាខ្មែរ' }
    ],

    // Attendance Pattern
    attendancePattern: [
      { day: 'ច័ន្ទ', present: 43, absent: 2 },
      { day: 'អង្គារ', present: 44, absent: 1 },
      { day: 'ពុធ', present: 42, absent: 3 },
      { day: 'ព្រហស្បតិ៍', present: 45, absent: 0 },
      { day: 'សុក្រ', present: 41, absent: 4 }
    ],

    // Upcoming Tasks
    upcomingTasks: [
      { task: 'ការវាយតម្លៃពាក់កណ្តាលគ្រា', dueDate: '2025-10-15', studentsRemaining: 12 },
      { task: 'ការប្រជុំមាតាបិតា', dueDate: '2025-10-20', status: 'scheduled' },
      { task: 'របាយការណ៍ប្រចាំខែ', dueDate: '2025-09-30', status: 'pending' }
    ],

    mock: true,
    message: 'ទិន្នន័យគំរូសម្រាប់គ្រូបង្រៀន'
  };
};

// Viewer Dashboard Mock Data
export const generateViewerDashboardMockData = () => {
  return {
    // Overview Statistics (Read-only)
    overviewStats: {
      totalSchools: 33,
      totalStudents: 2847,
      totalAssessments: 8541,
      averageScore: 72.3,
      dataLastUpdated: new Date().toISOString()
    },

    // Performance Summary Charts
    performanceSummary: {
      byProvince: [
        { province: 'ភ្នំពេញ', average: 78.5 },
        { province: 'កណ្តាល', average: 75.2 },
        { province: 'បាត់ដំបង', average: 72.8 },
        { province: 'សៀមរាប', average: 71.5 },
        { province: 'កំពង់ចាម', average: 69.2 }
      ],
      bySubject: {
        khmer: 73.5,
        math: 71.1
      },
      byPhase: {
        baseline: 62.3,
        midline: 70.8,
        endline: 79.5
      }
    },

    // Trend Analysis
    trendAnalysis: generateTrendData(6),

    // Distribution Charts
    distributions: {
      levelDistribution: [
        { level: 'Beginner', percentage: 12 },
        { level: 'Letter', percentage: 20 },
        { level: 'Word', percentage: 28 },
        { level: 'Paragraph', percentage: 25 },
        { level: 'Story', percentage: 15 }
      ],
      genderDistribution: {
        male: 50.2,
        female: 49.8
      }
    },

    // Key Metrics Summary
    keyMetrics: [
      { metric: 'ការលើកកម្ពស់ជាមធ្យម', value: '15.2%', trend: 'positive' },
      { metric: 'អត្រាបញ្ចប់', value: '78.5%', trend: 'positive' },
      { metric: 'សិស្សក្នុងកម្រិត Story', value: '15%', trend: 'stable' },
      { metric: 'សិស្សត្រូវការជំនួយ', value: '12%', trend: 'negative' }
    ],

    // Export Options
    exportAvailable: true,
    lastExportDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),

    mock: true,
    message: 'ទិន្នន័យគំរូសម្រាប់អ្នកមើល (បានអនុញ្ញាតតែមើល)'
  };
};

// Overall Dashboard Assessment Data Generator
export const generateAssessmentChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  return {
    // Line Chart - Progress Over Time
    progressOverTime: months.map(month => ({
      month,
      baseline: randomInRange(55, 65),
      midline: randomInRange(65, 75),
      endline: randomInRange(75, 85)
    })),

    // Bar Chart - Subject Comparison
    subjectComparison: [
      { subject: 'ភាសាខ្មែរ', baseline: 62, midline: 71, endline: 80 },
      { subject: 'គណិតវិទ្យា', baseline: 58, midline: 68, endline: 77 }
    ],

    // Pie Chart - Current Level Distribution
    levelDistribution: [
      { name: 'Beginner', value: 320, color: '#ff6b6b' },
      { name: 'Letter', value: 580, color: '#4ecdc4' },
      { name: 'Word', value: 750, color: '#45b7d1' },
      { name: 'Paragraph', value: 680, color: '#96ceb4' },
      { name: 'Story', value: 517, color: '#6c5ce7' }
    ],

    // Area Chart - Cumulative Progress
    cumulativeProgress: months.map((month, index) => ({
      month,
      students: (index + 1) * 475,
      assessments: (index + 1) * 1423
    })),

    // Radar Chart - Skill Assessment
    skillAssessment: [
      { skill: 'អាន', score: 75 },
      { skill: 'សរសេរ', score: 68 },
      { skill: 'ស្តាប់', score: 72 },
      { skill: 'និយាយ', score: 70 },
      { skill: 'គណនា', score: 65 },
      { skill: 'វិភាគ', score: 62 }
    ],

    // Heat Map - School Performance Matrix
    performanceMatrix: [
      [85, 78, 82, 79, 88], // School 1 subjects
      [82, 80, 78, 75, 85], // School 2 subjects
      [79, 75, 74, 72, 80], // School 3 subjects
      [88, 82, 85, 80, 87], // School 4 subjects
      [76, 73, 71, 70, 75]  // School 5 subjects
    ],

    mock: true
  };
};

// Utility function to check if data is empty
export const shouldUseMockData = (data: any): boolean => {
  if (!data) return true;
  if (Array.isArray(data) && data.length === 0) return true;
  if (typeof data === 'object' && Object.keys(data).length === 0) return true;
  return false;
};

// Wrapper function to return mock or real data
export const getDashboardData = (realData: any, roleType: string) => {
  if (shouldUseMockData(realData)) {
    switch (roleType) {
      case 'admin':
        return generateAdminDashboardMockData();
      case 'coordinator':
        return generateCoordinatorDashboardMockData();
      case 'mentor':
        return generateMentorDashboardMockData();
      case 'teacher':
        return generateTeacherDashboardMockData();
      case 'viewer':
        return generateViewerDashboardMockData();
      default:
        return generateAdminDashboardMockData();
    }
  }
  return { ...realData, mock: false };
};

export default {
  generateAdminDashboardMockData,
  generateCoordinatorDashboardMockData,
  generateMentorDashboardMockData,
  generateTeacherDashboardMockData,
  generateViewerDashboardMockData,
  generateAssessmentChartData,
  shouldUseMockData,
  getDashboardData
};