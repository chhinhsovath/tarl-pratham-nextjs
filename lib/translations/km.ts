// Khmer Language Translations
export const kmTranslations = {
  // App Name
  appName: 'គម្រោង TaRL',
  appFullName: 'ការបង្រៀនស្របតាមសមត្ថភាព',
  
  // User Roles
  roles: {
    admin: 'អ្នកគ្រប់គ្រង',
    coordinator: 'អ្នកសម្របសម្រួល',
    mentor: 'អ្នកណែនាំ',
    teacher: 'គ្រូបង្រៀន',
    viewer: 'អ្នកមើល',
  },

  // Navigation Menu
  menu: {
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    analyticsDashboard: 'វិភាគទិន្នន័យ',
    assessments: 'ការវាយតម្លៃ',
    verification: 'ផ្ទៀងផ្ទាត់',
    students: 'សិស្ស',
    mentoring: 'ប្រឹក្សាគរុកោសល្យ',
    teacherWorkspace: 'កន្លែងធ្វើការគ្រូ',
    reports: 'របាយការណ៍',
    coordinatorWorkspace: 'កន្លែងធ្វើការសម្របសម្រួល',
    administration: 'រដ្ឋបាល',
    help: 'ជំនួយ',
    
    // Sub-menus
    users: 'អ្នកប្រើប្រាស់',
    schools: 'សាលារៀន',
    classes: 'ថ្នាក់រៀន',
    settings: 'ការកំណត់',
    resources: 'ធនធាន',
    
    // Reports sub-menu
    reportsAnalytics: 'ផ្ទាំងវិភាគទិន្នន័យ',
    assessmentAnalysis: 'វិភាគការវាយតម្លៃ',
    attendanceReport: 'របាយការណ៍វត្តមាន',
    interventionReport: 'របាយការណ៍អន្តរាគមន៍',
    allReports: 'របាយការណ៍ទាំងអស់',
  },

  // User Menu
  userMenu: {
    profile: 'ប្រវត្តិរូបរបស់ខ្ញុំ',
    changePassword: 'ផ្លាស់ប្តូរពាក្យសម្ងាត់',
    gettingStarted: 'ណែនាំចាប់ផ្តើម',
    helpTutorials: 'ជំនួយ និងការណែនាំ',
    aboutProject: 'អំពីគម្រោង',
    signOut: 'ចាកចេញ',
  },

  // Common Actions
  actions: {
    add: 'បន្ថែម',
    edit: 'កែសម្រួល',
    delete: 'លុប',
    save: 'រក្សាទុក',
    cancel: 'បោះបង់',
    submit: 'បញ្ជូន',
    search: 'ស្វែងរក',
    filter: 'ត្រង',
    export: 'នាំចេញ',
    import: 'នាំចូល',
    download: 'ទាញយក',
    upload: 'ផ្ទុកឡើង',
    view: 'មើល',
    print: 'បោះពុម្ព',
    refresh: 'ផ្ទុកឡើងវិញ',
    back: 'ត្រឡប់',
    next: 'បន្ទាប់',
    previous: 'មុន',
    confirm: 'បញ្ជាក់',
    select: 'ជ្រើសរើស',
    selectAll: 'ជ្រើសរើសទាំងអស់',
    clear: 'សម្អាត',
    close: 'បិទ',
  },

  // Forms
  forms: {
    required: 'ចាំបាច់',
    optional: 'ស្រេចចិត្ត',
    email: 'អ៊ីមែល',
    password: 'ពាក្យសម្ងាត់',
    confirmPassword: 'បញ្ជាក់ពាក្យសម្ងាត់',
    name: 'ឈ្មោះ',
    phone: 'លេខទូរស័ព្ទ',
    address: 'អាសយដ្ឋាន',
    province: 'ខេត្ត',
    district: 'ស្រុក/ខ័ណ្ឌ',
    commune: 'ឃុំ/សង្កាត់',
    village: 'ភូមិ',
    gender: 'ភេទ',
    male: 'ប្រុស',
    female: 'ស្រី',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    age: 'អាយុ',
    photo: 'រូបថត',
    
    // Validation messages
    validation: {
      required: 'ទិន្នន័យនេះចាំបាច់ត្រូវបំពេញ',
      email: 'អ៊ីមែលមិនត្រឹមត្រូវ',
      minLength: 'ត្រូវតែមានយ៉ាងហោចណាស់ {{min}} តួអក្សរ',
      maxLength: 'មិនអាចលើសពី {{max}} តួអក្សរ',
      passwordMatch: 'ពាក្យសម្ងាត់មិនដូចគ្នា',
      phoneFormat: 'លេខទូរស័ព្ទមិនត្រឹមត្រូវ',
      ageRange: 'អាយុត្រូវតែនៅចន្លោះ {{min}} និង {{max}}',
      fileSize: 'ទំហំឯកសារមិនអាចលើសពី {{size}}MB',
      fileType: 'ប្រភេទឯកសារមិនត្រឹមត្រូវ',
    },
  },

  // Student Management
  students: {
    title: 'គ្រប់គ្រងសិស្ស',
    addStudent: 'បន្ថែមសិស្សថ្មី',
    editStudent: 'កែសម្រួលព័ត៌មានសិស្ស',
    studentList: 'បញ្ជីសិស្ស',
    studentProfile: 'ប្រវត្តិរូបសិស្ស',
    bulkImport: 'នាំចូលសិស្សច្រើន',
    
    fields: {
      studentId: 'លេខសម្គាល់សិស្ស',
      studentName: 'ឈ្មោះសិស្ស',
      guardianName: 'ឈ្មោះអាណាព្យាបាល',
      guardianPhone: 'ទូរស័ព្ទអាណាព្យាបាល',
      grade: 'ថ្នាក់ទី',
      class: 'ថ្នាក់',
      school: 'សាលារៀន',
    },
    
    messages: {
      addSuccess: 'បានបន្ថែមសិស្សដោយជោគជ័យ',
      updateSuccess: 'បានកែសម្រួលព័ត៌មានសិស្សដោយជោគជ័យ',
      deleteSuccess: 'បានលុបសិស្សដោយជោគជ័យ',
      deleteConfirm: 'តើអ្នកពិតជាចង់លុបសិស្សនេះមែនទេ?',
      importSuccess: 'បាននាំចូលសិស្សចំនួន {{count}} នាក់',
      noStudents: 'មិនមានសិស្សក្នុងប្រព័ន្ធ',
    },
  },

  // Assessment
  assessment: {
    title: 'ការវាយតម្លៃ',
    createAssessment: 'បង្កើតការវាយតម្លៃថ្មី',
    assessmentType: 'ប្រភេទការវាយតម្លៃ',
    baseline: 'វាយតម្លៃដំបូង',
    midline: 'វាយតម្លៃពាក់កណ្តាល',
    endline: 'វាយតម្លៃចុងក្រោយ',
    
    subjects: {
      khmer: 'ភាសាខ្មែរ',
      math: 'គណិតវិទ្យា',
    },
    
    levels: {
      beginner: 'កម្រិតដំបូង',
      letter: 'អក្សរ',
      word: 'ពាក្យ',
      paragraph: 'កថាខណ្ឌ',
      story: 'រឿង',
    },
    
    fields: {
      assessmentDate: 'កាលបរិច្ឆេទវាយតម្លៃ',
      subject: 'មុខវិជ្ជា',
      level: 'កម្រិត',
      score: 'ពិន្ទុ',
      notes: 'កំណត់ចំណាំ',
      selectStudents: 'ជ្រើសរើសសិស្ស',
      studentCount: 'ចំនួនសិស្ស',
    },
    
    messages: {
      selectAtLeastOne: 'សូមជ្រើសរើសសិស្សយ៉ាងហោចណាស់ម្នាក់',
      assessmentSaved: 'បានរក្សាទុកការវាយតម្លៃ',
      assessmentSubmitted: 'បានបញ្ជូនការវាយតម្លៃទាំងអស់',
      noAssessments: 'មិនមានការវាយតម្លៃ',
    },
  },

  // Schools
  schools: {
    title: 'គ្រប់គ្រងសាលារៀន',
    addSchool: 'បន្ថែមសាលាថ្មី',
    editSchool: 'កែសម្រួលសាលា',
    schoolList: 'បញ្ជីសាលារៀន',
    pilotSchools: 'សាលាសាកល្បង',
    
    fields: {
      schoolName: 'ឈ្មោះសាលា',
      schoolCode: 'កូដសាលា',
      schoolType: 'ប្រភេទសាលា',
      principal: 'នាយកសាលា',
      teachers: 'ចំនួនគ្រូ',
      students: 'ចំនួនសិស្ស',
      location: 'ទីតាំង',
      contact: 'ទំនាក់ទំនង',
    },
    
    types: {
      primary: 'បឋមសិក្សា',
      secondary: 'មធ្យមសិក្សាបឋមភូមិ',
      high: 'មធ្យមសិក្សាទុតិយភូមិ',
    },
  },

  // Mentoring
  mentoring: {
    title: 'ប្រឹក្សាគរុកោសល្យ',
    scheduleVisit: 'កំណត់ការទស្សនា',
    visitList: 'បញ្ជីការទស្សនា',
    visitReport: 'របាយការណ៍ទស្សនា',
    
    fields: {
      visitDate: 'កាលបរិច្ឆេទទស្សនា',
      school: 'សាលា',
      purpose: 'គោលបំណង',
      activities: 'សកម្មភាព',
      observations: 'ការសង្កេត',
      recommendations: 'អនុសាសន៍',
      followUp: 'ការតាមដាន',
      participants: 'អ្នកចូលរួម',
      duration: 'រយៈពេល',
      photos: 'រូបភាព',
    },
    
    status: {
      scheduled: 'បានកំណត់',
      completed: 'បានបញ្ចប់',
      cancelled: 'បានលុបចោល',
    },
  },

  // Reports
  reports: {
    title: 'របាយការណ៍',
    dashboard: 'ផ្ទាំងគ្រប់គ្រង',
    studentPerformance: 'លទ្ធផលសិស្ស',
    schoolComparison: 'ប្រៀបធៀបសាលា',
    progressTracking: 'តាមដានវឌ្ឍនភាព',
    exportReport: 'នាំចេញរបាយការណ៍',
    
    filters: {
      dateRange: 'ចន្លោះពេល',
      school: 'សាលា',
      class: 'ថ្នាក់',
      subject: 'មុខវិជ្ជា',
      assessmentType: 'ប្រភេទការវាយតម្លៃ',
    },
  },

  // Common
  common: {
    loading: 'កំពុងផ្ទុក...',
    saving: 'កំពុងរក្សាទុក...',
    searching: 'កំពុងស្វែងរក...',
    noData: 'គ្មានទិន្នន័យ',
    error: 'មានបញ្ហា',
    success: 'ជោគជ័យ',
    warning: 'ព្រមាន',
    info: 'ព័ត៌មាន',
    total: 'សរុប',
    showing: 'បង្ហាញ',
    of: 'នៃ',
    entries: 'ទិន្នន័យ',
    page: 'ទំព័រ',
    
    // Time
    today: 'ថ្ងៃនេះ',
    yesterday: 'ម្សិលមិញ',
    thisWeek: 'សប្តាហ៍នេះ',
    thisMonth: 'ខែនេះ',
    thisYear: 'ឆ្នាំនេះ',
    
    // Status
    active: 'សកម្ម',
    inactive: 'អសកម្ម',
    pending: 'រង់ចាំ',
    approved: 'បានអនុម័ត',
    rejected: 'បានបដិសេធ',
    
    // Confirmation
    areYouSure: 'តើអ្នកប្រាកដទេ?',
    cannotUndo: 'សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ',
    yes: 'បាទ/ចាស',
    no: 'ទេ',
  },

  // Mobile specific
  mobile: {
    menu: 'ម៉ឺនុយ',
    tapToSelect: 'ចុចដើម្បីជ្រើសរើស',
    swipeToDelete: 'អូសដើម្បីលុប',
    pullToRefresh: 'ទាញចុះដើម្បីផ្ទុកឡើងវិញ',
    tapToViewMore: 'ចុចដើម្បីមើលបន្ថែម',
    rotateDevice: 'បង្វិលឧបករណ៍សម្រាប់ទិដ្ឋភាពកាន់តែប្រសើរ',
  },

  // Dates (Khmer format)
  months: {
    january: 'មករា',
    february: 'កុម្ភៈ',
    march: 'មីនា',
    april: 'មេសា',
    may: 'ឧសភា',
    june: 'មិថុនា',
    july: 'កក្កដា',
    august: 'សីហា',
    september: 'កញ្ញា',
    october: 'តុលា',
    november: 'វិច្ឆិកា',
    december: 'ធ្នូ',
  },

  days: {
    monday: 'ច័ន្ទ',
    tuesday: 'អង្គារ',
    wednesday: 'ពុធ',
    thursday: 'ព្រហស្បតិ៍',
    friday: 'សុក្រ',
    saturday: 'សៅរ៍',
    sunday: 'អាទិត្យ',
  },
};

export default kmTranslations;