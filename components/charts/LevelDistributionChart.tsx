'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card } from 'antd';

interface LevelDistributionChartProps {
  data: {
    level: string;
    khmer: number;
    math: number;
  }[];
  title?: string;
}

// Translation map for levels
const levelTranslations: { [key: string]: string } = {
  'Beginning': 'កម្រិតដំបូង',
  'Characters': 'តួអក្សរ',
  'Words': 'ពាក្យ',
  'Paragraphs': 'កថាខណ្ឌ',
  'Story': 'រឿង',
  'Story (Comprehension 1)': 'រឿង (យល់ន័យ១)',
  'Story (Comprehension 2)': 'រឿង (យល់ន័យ២)',
  'Single Digit': 'លេខ១ខ្ទង',
  'Double Digit': 'លេខ២ខ្ទង',
  'Subtraction': 'ប្រមាណវិធីដក',
  'Division': 'ប្រមាណវិធីចែក',
  'Problems': 'ចំណោទ'
};

export default function LevelDistributionChart({
  data,
  title = 'ការចែកចាយតាមកម្រិត'
}: LevelDistributionChartProps) {
  // Translate levels to Khmer
  const chartData = data.map(item => ({
    ...item,
    levelKh: levelTranslations[item.level] || item.level
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: '4px 0 0 0', color: entry.color }}>
              {entry.name}: {entry.value} សិស្ស
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card title={title} style={{ height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="levelKh"
            angle={-45}
            textAnchor="end"
            height={100}
            style={{ fontSize: '11px' }}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              if (value === 'khmer') return 'ភាសា';
              if (value === 'math') return 'គណិតវិទ្យា';
              return value;
            }}
          />
          <Bar dataKey="khmer" name="ភាសា" fill="#1890ff" />
          <Bar dataKey="math" name="គណិតវិទ្យា" fill="#52c41a" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
