'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [subject, setSubject] = useState<'khmer' | 'math'>('khmer');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>(null);
  const [cycleData, setCycleData] = useState({
    baseline: '—',
    midline: '—',
    endline: '—',
    total: 0
  });

  // Fetch assessment data
  const fetchAssessmentData = async (selectedSubject: 'khmer' | 'math') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/public/assessment-data?subject=${selectedSubject}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      
      // Update chart data
      setChartData(data.chartData);
      
      // Update cycle data
      setCycleData({
        baseline: data.cycleData.baseline || '—',
        midline: data.cycleData.midline || '—',
        endline: data.cycleData.endline || '—',
        total: data.cycleData.total || 0
      });
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      // Set default data if error
      const defaultLevels = selectedSubject === 'khmer' 
        ? ['Beginner', 'Letter', 'Word', 'Paragraph', 'Story', 'Comp. 1', 'Comp. 2']
        : ['Beginner', '1-Digit', '2-Digit', 'Subtraction', 'Division', 'Word Problem'];
      
      setChartData({
        labels: defaultLevels,
        datasets: [{
          label: 'Students',
          data: new Array(defaultLevels.length).fill(0),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgb(59, 130, 246)',
          borderWidth: 1
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAssessmentData(subject);
  }, [subject]);

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      datalabels: {
        display: function(context: any) {
          return context.dataset.data[context.dataIndex] > 0;
        },
        color: 'black',
        font: {
          weight: 'bold' as const,
          size: 11
        },
        formatter: function(value: any) {
          return value;
        },
        anchor: 'end' as const,
        align: 'right' as const
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Reading Level'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">TaRL Project</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="https://plp.moeys.gov.kh" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out"
                target="_blank"
                rel="noopener noreferrer"
              >
                PLP
              </a>
              <Link 
                href="/auth/login" 
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Login / ចូល
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="max-w-4xl mx-auto mt-10 p-6 border shadow rounded-lg bg-white">
          {/* Header */}
          <h2 className="text-xl font-semibold text-center mb-4">
            Assessment Results / លទ្ធផលវាយតម្លៃ
          </h2>
          
          {/* Subject Selector */}
          <div className="flex justify-center gap-2 mb-6">
            <button 
              onClick={() => setSubject('khmer')}
              className={`px-3 py-1 rounded transition-all duration-200 ${
                subject === 'khmer' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Khmer / ខ្មែរ
            </button>
            <button 
              onClick={() => setSubject('math')}
              className={`px-3 py-1 rounded transition-all duration-200 ${
                subject === 'math' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Math / គណិតវិទ្យា
            </button>
          </div>
          
          {/* Chart Container */}
          <div className="mb-8 relative" style={{ height: '300px' }}>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}
            {chartData && (
              <Bar 
                data={chartData} 
                options={chartOptions}
                plugins={[ChartDataLabels as any]}
              />
            )}
          </div>
          
          {/* Test Cycle Table */}
          <table className="table-auto mt-4 border mx-auto text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Test Cycle / វដ្តតេស្ត</th>
                <th className="border px-4 py-2">Baseline / ដើមគ្រា</th>
                <th className="border px-4 py-2">Midline / ពាក់កណ្តាលគ្រា</th>
                <th className="border px-4 py-2">Endline / ចុងគ្រា</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2 font-medium">Students / សិស្ស</td>
                <td className="border px-4 py-2 text-center">{cycleData.baseline}</td>
                <td className="border px-4 py-2 text-center">{cycleData.midline}</td>
                <td className="border px-4 py-2 text-center">{cycleData.endline}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Total Students */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Total Students Assessed / សរុបសិស្សបានវាយតម្លៃ: 
            <span className="font-semibold ml-2">{cycleData.total}</span>
          </p>
        </div>
      </main>
    </div>
  );
}