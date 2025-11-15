'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Select, Card, Row, Col, Button, Radio, Space, Table, Spin, Statistic } from 'antd';
import { 
  TeamOutlined,
  FileTextOutlined,
  BankOutlined,
  SolutionOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Option } = Select;

interface School {
  id: number;
  school_name: string;
  province: string;
  district: string;
}

export default function SimpleDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  // Filter states - matching Laravel exactly
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  
  // Simple stats - matching Laravel exactly
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalSchools: 0,
    totalMentoringVisits: 0
  });
  
  // Chart controls - matching Laravel
  const [currentSubject, setCurrentSubject] = useState('khmer');
  
  // Simple chart data - matching Laravel
  const [assessmentData, setAssessmentData] = useState({
    baseline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
    midline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 },
    endline: { beginner: 0, letter: 0, word: 0, paragraph: 0, story: 0 }
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    reloadData();
  }, [selectedProvince, selectedDistrict, selectedSchool, currentSubject]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load schools - matching Laravel
      const schoolsRes = await fetch('/api/pilot-schools');
      const schoolsData = await schoolsRes.json();
      
      if (schoolsData.data) {
        setSchools(schoolsData.data);
        const uniqueProvinces = [...new Set(schoolsData.data.map((s: School) => s.province))].filter(Boolean).sort();
        setProvinces(uniqueProvinces);
      }
      
      // Load simple stats - matching Laravel
      const statsRes = await fetch('/api/dashboard/stats');
      const statsData = await statsRes.json();
      setStats(statsData.data || {
        totalStudents: 0,
        totalAssessments: 0,
        totalSchools: 0,
        totalMentoringVisits: 0
      });
      
      // Load assessment data
      const assessmentRes = await fetch(`/api/dashboard/assessment-data?subject=${currentSubject}`);
      const assessmentResults = await assessmentRes.json();
      if (assessmentResults.data) {
        setAssessmentData(assessmentResults.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reloadData = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedSchool) params.append('school_id', selectedSchool);
      params.append('subject', currentSubject);
      
      const assessmentRes = await fetch(`/api/dashboard/assessment-data?${params}`);
      const assessmentResults = await assessmentRes.json();
      if (assessmentResults.data) {
        setAssessmentData(assessmentResults.data);
      }
    } catch (error) {
      console.error('Error reloading data:', error);
    }
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedSchool('');
    
    if (value) {
      const filteredSchools = schools.filter(s => s.province === value);
      const uniqueDistricts = [...new Set(filteredSchools.map(s => s.district))].filter(Boolean).sort();
      setDistricts(uniqueDistricts);
    } else {
      setDistricts([]);
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedSchool('');
  };

  // Simple chart data - matching Laravel's stacked bar chart
  const chartData = {
    labels: ['មូលដ្ឋាន', 'កុលសនភាព', 'បញ្ចប់'],
    datasets: [
      {
        label: 'កម្រិតដំបូង',
        data: [assessmentData.baseline.beginner, assessmentData.midline.beginner, assessmentData.endline.beginner],
        backgroundColor: '#ff4d4f',
      },
      {
        label: 'អក្សរ',
        data: [assessmentData.baseline.letter, assessmentData.midline.letter, assessmentData.endline.letter],
        backgroundColor: '#faad14',
      },
      {
        label: 'ពាក្យ',
        data: [assessmentData.baseline.word, assessmentData.midline.word, assessmentData.endline.word],
        backgroundColor: '#ffd93d',
      },
      {
        label: 'ប្រយោគ',
        data: [assessmentData.baseline.paragraph, assessmentData.midline.paragraph, assessmentData.endline.paragraph],
        backgroundColor: '#73d13d',
      },
      {
        label: 'រឿង',
        data: [assessmentData.baseline.story, assessmentData.midline.story, assessmentData.endline.story],
        backgroundColor: '#52c41a',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    },
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    }
  };

  // Role helpers - matching Laravel
  const isAdmin = session?.user?.role === 'admin';
  const isTeacher = session?.user?.role === 'teacher';
  const isMentor = session?.user?.role === 'mentor';
  const isCoordinator = session?.user?.role === 'coordinator';
  const showFilters = isAdmin || isMentor;
  const canAddStudents = isAdmin || isTeacher;
  const canCreateAssessment = isAdmin || isTeacher || isMentor;
  const canRecordVisit = isAdmin || isMentor;

  return (
    <div>
      {/* Page Title - matching Laravel */}
      <h1 style={{ fontSize: '24px', marginBottom: '24px', fontWeight: 600 }}>
        ផ្ទាំងគ្រប់គ្រង
      </h1>

      <Spin spinning={loading}>
        {/* Statistics Cards - EXACTLY like verification page */}
        <Row gutter={16} className="mb-6">
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="សិស្សសរុប"
                value={stats.totalStudents}
                valueStyle={{ color: '#1890ff' }}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="ការវាយតម្លៃសរុប"
                value={stats.totalAssessments}
                valueStyle={{ color: '#52c41a' }}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="សាលារៀន"
                value={stats.totalSchools}
                valueStyle={{ color: '#faad14' }}
                prefix={<BankOutlined />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="ដំណើរទស្សនកិច្ច"
                value={stats.totalMentoringVisits}
                valueStyle={{ color: '#722ed1' }}
                prefix={<SolutionOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Filters - Laravel style */}
        {showFilters && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ខេត្ត</label>
                <Select
                  className="w-full"
                  placeholder="ជ្រើសរើសខេត្ត"
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  allowClear
                  size="large"
                >
                  {provinces.map(province => (
                    <Option key={province} value={province}>{province}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ស្រុក</label>
                <Select
                  className="w-full"
                  placeholder="ជ្រើសរើសស្រុក"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                  allowClear
                  size="large"
                >
                  {districts.map(district => (
                    <Option key={district} value={district}>{district}</Option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">សាលារៀន</label>
                <Select
                  className="w-full"
                  placeholder="ជ្រើសរើសសាលារៀន"
                  value={selectedSchool}
                  onChange={setSelectedSchool}
                  disabled={!selectedDistrict}
                  allowClear
                  size="large"
                >
                  {schools
                    .filter(s => s.province === selectedProvince && s.district === selectedDistrict)
                    .map(school => (
                      <Option key={school.id} value={school.id.toString()}>
                        {school.school_name}
                      </Option>
                    ))}
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Results - Laravel style */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">លទ្ធផលការវាយតម្លៃ</h3>
            <Radio.Group value={currentSubject} onChange={(e) => setCurrentSubject(e.target.value)}>
              <Radio.Button value="khmer">ខ្មែរ</Radio.Button>
              <Radio.Button value="math">គណិតវិទ្យា</Radio.Button>
            </Radio.Group>
          </div>
          
          <div className="h-64 md:h-96 mb-6">
            <Bar data={chartData} options={chartOptions} />
          </div>
          
          {/* Simple Summary Table - Laravel style */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    រយៈពេល
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ចំនួនសរុប
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">មូលដ្ឋាន</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Object.values(assessmentData.baseline).reduce((a, b) => a + b, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">កុលសនភាព</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Object.values(assessmentData.midline).reduce((a, b) => a + b, 0)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">បញ្ចប់</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Object.values(assessmentData.endline).reduce((a, b) => a + b, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions - Laravel style */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">សកម្មភាពរហ័ស</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {canAddStudents && (
              <Link href="/students/create" className="block">
                <div className="bg-indigo-50 hover:bg-indigo-100 rounded-lg p-4 text-center transition-colors duration-150">
                  <UserAddOutlined className="text-indigo-600 text-2xl mb-2" />
                  <div className="text-sm font-medium text-indigo-900">បន្ថែមសិស្ស</div>
                </div>
              </Link>
            )}
            {canCreateAssessment && (
              <Link href="/assessments/create" className="block">
                <div className="bg-green-50 hover:bg-green-100 rounded-lg p-4 text-center transition-colors duration-150">
                  <FileTextOutlined className="text-green-600 text-2xl mb-2" />
                  <div className="text-sm font-medium text-green-900">ការវាយតម្លៃថ្មី</div>
                </div>
              </Link>
            )}
            {canRecordVisit && (
              <Link href="/mentoring/create" className="block">
                <div className="bg-yellow-50 hover:bg-yellow-100 rounded-lg p-4 text-center transition-colors duration-150">
                  <CheckCircleOutlined className="text-yellow-600 text-2xl mb-2" />
                  <div className="text-sm font-medium text-yellow-900">កត់ត្រាដំណើរទស្សនកិច្ច</div>
                </div>
              </Link>
            )}
            <Link href="/reports" className="block">
              <div className="bg-purple-50 hover:bg-purple-100 rounded-lg p-4 text-center transition-colors duration-150">
                <BarChartOutlined className="text-purple-600 text-2xl mb-2" />
                <div className="text-sm font-medium text-purple-900">មើលរបាយការណ៍</div>
              </div>
            </Link>
          </div>
        </div>
      </Spin>
    </div>
  );
}