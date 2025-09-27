'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Select, Card, Row, Col, Button, Radio, Space, Table, Spin } from 'antd';
import { 
  UsergroupAddOutlined, 
  CheckCircleOutlined,
  BankOutlined,
  TeamOutlined,
  UserAddOutlined,
  FileTextOutlined,
  UserOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const { Option } = Select;

interface School {
  id: number;
  school_name: string;
  province: string;
  district: string;
  cluster?: string;
}

export default function UnifiedDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [clusters, setClusters] = useState<string[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  
  // Data states
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssessments: 0,
    totalSchools: 0,
    totalMentoringVisits: 0
  });
  
  // Chart controls
  const [currentSubject, setCurrentSubject] = useState('khmer');
  const [currentCycle, setCurrentCycle] = useState('baseline');
  
  // Chart data
  const [overallChart, setOverallChart] = useState<any>(null);
  const [schoolChart, setSchoolChart] = useState<any>(null);
  const [overallData, setOverallData] = useState<any>({
    baseline: 0,
    midline: 0,
    endline: 0
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    reloadData();
  }, [selectedProvince, selectedDistrict, selectedCluster, selectedSchool, currentSubject, currentCycle]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load schools and provinces
      const schoolsRes = await fetch('/api/pilot-schools');
      const schoolsData = await schoolsRes.json();
      
      if (schoolsData.data) {
        setSchools(schoolsData.data);
        
        // Extract unique provinces
        const uniqueProvinces = [...new Set(schoolsData.data.map((s: School) => s.province))].filter(Boolean).sort();
        setProvinces(uniqueProvinces);
      }
      
      // Load dashboard stats
      await loadDashboardStats();
      await loadOverallResults();
      
      // Load school results if mentor/admin
      if (['mentor', 'admin'].includes(session?.user?.role || '')) {
        await loadSchoolResults();
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSchool) params.append('school_id', selectedSchool);
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedCluster) params.append('cluster', selectedCluster);
      
      const response = await fetch(`/api/dashboard/stats?${params}`);
      const data = await response.json();
      
      setStats({
        totalStudents: data.total_students || 0,
        totalAssessments: data.total_assessments || 0,
        totalSchools: data.total_schools || 0,
        totalMentoringVisits: data.total_mentoring_visits || 0
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const loadOverallResults = async () => {
    try {
      const params = new URLSearchParams();
      params.append('subject', currentSubject);
      if (selectedSchool) params.append('school_id', selectedSchool);
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedCluster) params.append('cluster', selectedCluster);
      
      const response = await fetch(`/api/dashboard/overall-results?${params}`);
      const data = await response.json();
      
      if (data.chartData) {
        setOverallChart(data.chartData);
      }
      
      if (data.totals) {
        setOverallData(data.totals);
      }
    } catch (error) {
      console.error('Error loading overall results:', error);
    }
  };

  const loadSchoolResults = async () => {
    try {
      const params = new URLSearchParams();
      params.append('subject', currentSubject);
      params.append('cycle', currentCycle);
      if (selectedSchool) params.append('school_id', selectedSchool);
      if (selectedProvince) params.append('province', selectedProvince);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (selectedCluster) params.append('cluster', selectedCluster);
      
      const response = await fetch(`/api/dashboard/results-by-school?${params}`);
      const data = await response.json();
      
      if (data.chartData) {
        setSchoolChart(data.chartData);
      }
    } catch (error) {
      console.error('Error loading school results:', error);
    }
  };

  const reloadData = () => {
    loadDashboardStats();
    loadOverallResults();
    if (['mentor', 'admin'].includes(session?.user?.role || '')) {
      loadSchoolResults();
    }
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict('');
    setSelectedCluster('');
    setSelectedSchool('');
    
    if (value) {
      const provinceDistricts = [...new Set(schools
        .filter(s => s.province === value)
        .map(s => s.district))].filter(Boolean).sort();
      setDistricts(provinceDistricts);
    } else {
      setDistricts([]);
    }
    setClusters([]);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCluster('');
    setSelectedSchool('');
    
    if (value && selectedProvince) {
      const districtClusters = [...new Set(schools
        .filter(s => s.province === selectedProvince && s.district === value && s.cluster)
        .map(s => s.cluster))].filter(Boolean).sort();
      setClusters(districtClusters as string[]);
    } else {
      setClusters([]);
    }
  };

  const handleClusterChange = (value: string) => {
    setSelectedCluster(value);
    setSelectedSchool('');
  };

  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    
    if (value) {
      const school = schools.find(s => s.id.toString() === value);
      if (school) {
        setSelectedProvince(school.province);
        setSelectedDistrict(school.district);
        setSelectedCluster(school.cluster || '');
        
        // Update dropdowns
        const provinceDistricts = [...new Set(schools
          .filter(s => s.province === school.province)
          .map(s => s.district))].filter(Boolean).sort();
        setDistricts(provinceDistricts);
        
        if (school.district) {
          const districtClusters = [...new Set(schools
            .filter(s => s.province === school.province && s.district === school.district && s.cluster)
            .map(s => s.cluster))].filter(Boolean).sort();
          setClusters(districtClusters as string[]);
        }
      }
    }
  };

  const filteredSchools = schools.filter(school => {
    if (selectedProvince && school.province !== selectedProvince) return false;
    if (selectedDistrict && school.district !== selectedDistrict) return false;
    if (selectedCluster && school.cluster !== selectedCluster) return false;
    return true;
  });

  const isAdmin = session?.user?.role === 'admin';
  const isMentor = session?.user?.role === 'mentor';
  const isTeacher = session?.user?.role === 'teacher';
  const showFilters = isAdmin || isMentor;

  return (
    <div className="py-6">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Filters for Mentor/Admin */}
        {showFilters && (
          <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">ត្រងទិន្នន្យ:</h3>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <label className="block text-xs font-medium text-gray-700 mb-1">ខេត្ត:</label>
                <Select
                  className="w-full"
                  placeholder="ខេត្តទាំងអស់"
                  value={selectedProvince || undefined}
                  onChange={handleProvinceChange}
                  allowClear
                >
                  {provinces.map(province => (
                    <Option key={province} value={province}>{province}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} md={6}>
                <label className="block text-xs font-medium text-gray-700 mb-1">ស្រុក:</label>
                <Select
                  className="w-full"
                  placeholder="ស្រុកទាំងអស់"
                  value={selectedDistrict || undefined}
                  onChange={handleDistrictChange}
                  disabled={!selectedProvince}
                  allowClear
                >
                  {districts.map(district => (
                    <Option key={district} value={district}>{district}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} md={6}>
                <label className="block text-xs font-medium text-gray-700 mb-1">ចង្កោម:</label>
                <Select
                  className="w-full"
                  placeholder="ចង្កោមទាំងអស់"
                  value={selectedCluster || undefined}
                  onChange={handleClusterChange}
                  disabled={!selectedDistrict}
                  allowClear
                >
                  {clusters.map(cluster => (
                    <Option key={cluster} value={cluster}>{cluster}</Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} md={6}>
                <label className="block text-xs font-medium text-gray-700 mb-1">សាលារៀន:</label>
                <Select
                  className="w-full"
                  placeholder="សាលារៀនទាំងអស់"
                  value={selectedSchool || undefined}
                  onChange={handleSchoolChange}
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {filteredSchools.map(school => (
                    <Option key={school.id} value={school.id.toString()}>
                      {school.school_name}
                    </Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        )}

        {/* Summary Statistics Cards */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UsergroupAddOutlined className="text-4xl text-blue-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">និស្សិតសរុប</div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {loading ? '—' : stats.totalStudents.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleOutlined className="text-4xl text-green-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">ការវាយតម្លៃ</div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {loading ? '—' : stats.totalAssessments.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BankOutlined className="text-4xl text-yellow-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">សាលារៀន</div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {loading ? '—' : stats.totalSchools.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TeamOutlined className="text-4xl text-purple-600" />
                </div>
                <div className="ml-5">
                  <div className="text-sm font-medium text-gray-500">ដំណើរទស្សនកិច្ច</div>
                  <div className="text-3xl font-semibold text-gray-900">
                    {loading ? '—' : stats.totalMentoringVisits.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Assessment Results Section */}
        <Card className="mb-6">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">លទ្ធផលការវាយតម្លៃ</h3>
            
            {/* Subject Toggle */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                type={currentSubject === 'khmer' ? 'primary' : 'default'}
                onClick={() => setCurrentSubject('khmer')}
                className={currentSubject === 'khmer' ? 'bg-blue-500' : ''}
              >
                ខ្មែរ
              </Button>
              <Button
                type={currentSubject === 'math' ? 'primary' : 'default'}
                onClick={() => setCurrentSubject('math')}
                className={currentSubject === 'math' ? 'bg-blue-500' : ''}
              >
                គណិតវិទ្យា
              </Button>
            </div>

            <Row gutter={[24, 24]}>
              {/* Overall Results Chart */}
              <Col xs={24} lg={showFilters ? 12 : 24}>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-center font-medium mb-4">លទ្ធផលសរុប</h4>
                  <div style={{ height: 300 }}>
                    {overallChart && (
                      <Bar
                        data={overallChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: { stacked: true },
                            y: { 
                              stacked: true,
                              beginAtZero: true,
                              max: 100,
                              title: {
                                display: true,
                                text: 'ភាគរយនិស្សិត'
                              },
                              ticks: {
                                callback: function(value) {
                                  return value + '%';
                                }
                              }
                            }
                          },
                          plugins: {
                            legend: { position: 'bottom' },
                            datalabels: {
                              display: true,
                              color: 'white',
                              font: { weight: 'bold', size: 11 },
                              formatter: (value: any) => Math.round(value) + '%'
                            }
                          }
                        }}
                        plugins={[ChartDataLabels as any]}
                      />
                    )}
                  </div>
                  
                  {/* Summary Table */}
                  <table className="mt-4 w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left">វដ្តការវាយតម្លៃ</th>
                        <th className="px-2 py-1 text-center">ដើមគ្រា</th>
                        <th className="px-2 py-1 text-center">ពាក់កណ្តាលគ្រា</th>
                        <th className="px-2 py-1 text-center">ចុងគ្រា</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-1 font-medium">និស្សិត</td>
                        <td className="px-2 py-1 text-center">{overallData.baseline || '—'}</td>
                        <td className="px-2 py-1 text-center">{overallData.midline || '—'}</td>
                        <td className="px-2 py-1 text-center">{overallData.endline || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Col>

              {/* School Results Chart - Only for Mentor/Admin */}
              {showFilters && (
                <Col xs={24} lg={12}>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-center font-medium mb-4">លទ្ធផលតាមសាលារៀន</h4>
                    
                    {/* Cycle Selector */}
                    <div className="flex justify-center gap-2 mb-4">
                      <Button
                        size="small"
                        type={currentCycle === 'baseline' ? 'primary' : 'default'}
                        onClick={() => setCurrentCycle('baseline')}
                        className={currentCycle === 'baseline' ? 'bg-indigo-500' : ''}
                      >
                        ដើមគ្រា
                      </Button>
                      <Button
                        size="small"
                        type={currentCycle === 'midline' ? 'primary' : 'default'}
                        onClick={() => setCurrentCycle('midline')}
                        className={currentCycle === 'midline' ? 'bg-indigo-500' : ''}
                      >
                        ពាក់កណ្តាលគ្រា
                      </Button>
                      <Button
                        size="small"
                        type={currentCycle === 'endline' ? 'primary' : 'default'}
                        onClick={() => setCurrentCycle('endline')}
                        className={currentCycle === 'endline' ? 'bg-indigo-500' : ''}
                      >
                        ចុងគ្រា
                      </Button>
                    </div>
                    
                    <div style={{ height: 400, overflowY: 'auto' }}>
                      {schoolChart && (
                        <Bar
                          data={schoolChart}
                          options={{
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                              x: { 
                                stacked: true,
                                beginAtZero: true,
                                max: 100,
                                title: {
                                  display: true,
                                  text: 'ភាគរយ'
                                },
                                ticks: {
                                  callback: function(value) {
                                    return value + '%';
                                  }
                                }
                              },
                              y: { 
                                stacked: true,
                                title: {
                                  display: true,
                                  text: 'សាលារៀន'
                                }
                              }
                            },
                            plugins: {
                              legend: { position: 'bottom' },
                              datalabels: {
                                display: function(context: any) {
                                  return context.dataset.data[context.dataIndex] > 3;
                                },
                                color: 'white',
                                font: { weight: 'bold', size: 11 },
                                formatter: (value: any) => Math.round(value) + '%'
                              }
                            }
                          }}
                          plugins={[ChartDataLabels as any]}
                        />
                      )}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">សកម្មភាពរហ័ស</h3>
            <Row gutter={[16, 16]}>
              {(isAdmin || isTeacher) && (
                <Col xs={12} sm={6}>
                  <Link href="/students/create">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <UserAddOutlined className="text-3xl text-blue-600 mb-2" />
                      <div className="text-sm">បន្ថែមនិស្សិត</div>
                    </div>
                  </Link>
                </Col>
              )}
              
              {(isAdmin || isTeacher || isMentor) && (
                <Col xs={12} sm={6}>
                  <Link href="/assessments/create">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <FileTextOutlined className="text-3xl text-green-600 mb-2" />
                      <div className="text-sm">ការវាយតម្លៃថ្មី</div>
                    </div>
                  </Link>
                </Col>
              )}
              
              {(isAdmin || isMentor) && (
                <Col xs={12} sm={6}>
                  <Link href="/mentoring/create">
                    <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      <UserOutlined className="text-3xl text-purple-600 mb-2" />
                      <div className="text-sm">កត់ត្រាដំណើរទស្សនកិច្ច</div>
                    </div>
                  </Link>
                </Col>
              )}
              
              <Col xs={12} sm={6}>
                <Link href="/reports">
                  <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                    <BarChartOutlined className="text-3xl text-yellow-600 mb-2" />
                    <div className="text-sm">មើលរបាយការណ៍</div>
                  </div>
                </Link>
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </div>
  );
}