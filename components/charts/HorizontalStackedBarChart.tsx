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

interface HorizontalStackedBarChartProps {
  data: {
    schoolName: string;
    levels: {
      [levelName: string]: number; // Original counts
    };
  }[];
  title?: string;
  colors?: { [levelName: string]: string };
  maxHeight?: number;
}

// Level translations
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

// Default colors for levels (CONSISTENT with StackedPercentageBarChart)
const defaultColors: { [key: string]: string } = {
  // Level 1: Beginner (Red)
  'beginner': '#DC2626',       // RED

  // Level 2: Letter/1-Digit (Orange)
  'letter': '#F97316',         // ORANGE

  // Level 3: Word/2-Digit (Yellow)
  'word': '#EAB308',           // YELLOW

  // Level 4: Paragraph/Subtraction (Green)
  'paragraph': '#84CC16',      // GREEN

  // Level 5: Story/Division (Blue)
  'story': '#3B82F6',          // BLUE

  // Advanced levels (Purple/Pink)
  'comprehension1': '#8B5CF6', // PURPLE
  'comprehension2': '#EC4899', // PINK

  // Legacy support (old naming)
  'Beginning': '#DC2626',
  'Characters': '#F97316',
  'Words': '#EAB308',
  'Paragraphs': '#84CC16',
  'Story': '#3B82F6',
  'Story (Comprehension 1)': '#8B5CF6',
  'Story (Comprehension 2)': '#EC4899',
  'Single Digit': '#F97316',
  'Double Digit': '#EAB308',
  'Subtraction': '#84CC16',
  'Division': '#3B82F6',
  'Problems': '#8B5CF6'
};

export default function HorizontalStackedBarChart({
  data,
  title = 'លទ្ធផលតាមសាលារៀន',
  colors = defaultColors,
  maxHeight = 600
}: HorizontalStackedBarChartProps) {
  // Get all unique level names from the data
  const levelNames = React.useMemo(() => {
    const names = new Set<string>();
    data.forEach(school => {
      Object.keys(school.levels).forEach(level => names.add(level));
    });
    return Array.from(names);
  }, [data]);

  // Transform data: convert counts to percentages while preserving original counts
  const chartData = React.useMemo(() => {
    return data.map(school => {
      // Calculate total for this school
      const total = Object.values(school.levels).reduce((sum, count) => sum + count, 0);

      // Create percentage data with original counts preserved
      const percentageData: any = {
        schoolName: school.schoolName,
        total: total, // Preserve total for tooltip
      };

      // Add percentage for each level
      levelNames.forEach(levelName => {
        const count = school.levels[levelName] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        percentageData[levelName] = percentage;
        percentageData[`${levelName}_count`] = count; // Preserve original count
      });

      return percentageData;
    });
  }, [data, levelNames]);

  // Calculate dynamic height based on number of schools
  const chartHeight = React.useMemo(() => {
    const barHeight = 60; // Height per school bar (increased for better visibility)
    const minHeight = 400;
    const calculatedHeight = Math.max(minHeight, data.length * barHeight + 100);
    return Math.min(calculatedHeight, maxHeight);
  }, [data.length, maxHeight]);

  // Custom tooltip showing both percentage and count
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const total = payload[0].payload.total;

      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '1px solid #ccc',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '8px' }}>{label}</p>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>
            សរុប: {total} សិស្ស
          </p>
          {payload.map((entry: any, index: number) => {
            const count = entry.payload[`${entry.dataKey}_count`];
            const percentage = entry.value;

            return (
              <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '12px' }}>
                {levelTranslations[entry.dataKey] || entry.dataKey}: {Math.round(percentage * 10) / 10}% ({count})
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom label formatter for bars - only show if > 3%
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    // Only show label if percentage is greater than 3%
    if (value < 3) return null;

    // Determine text color based on segment size
    const textColor = value > 30 ? 'white' : '#374151';

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill={textColor}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '11px', fontWeight: 'bold' }}
      >
        {Math.round(value * 10) / 10}%
      </text>
    );
  };

  return (
    <Card title={title} style={{ height: '100%' }}>
      <div style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              style={{ fontSize: '11px' }}
            />
            <YAxis
              type="category"
              dataKey="schoolName"
              width={200}
              style={{ fontSize: '11px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
              formatter={(value) => levelTranslations[value as string] || value}
            />

            {/* Render a Bar for each level */}
            {levelNames.map((levelName) => (
              <Bar
                key={levelName}
                dataKey={levelName}
                stackId="levels"
                fill={colors[levelName] || '#8884d8'}
                label={renderCustomLabel}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
