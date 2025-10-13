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
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card } from 'antd';

interface StackedPercentageBarChartProps {
  data: {
    cycle: string;
    levels: {
      [levelName: string]: number; // Original counts
    };
  }[];
  title?: string;
  colors?: { [levelName: string]: string };
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

// Default colors for levels
const defaultColors: { [key: string]: string } = {
  'Beginning': '#EF4444',      // red-500
  'Characters': '#F59E0B',     // amber-500
  'Words': '#EAB308',          // yellow-500
  'Paragraphs': '#84CC16',     // lime-500
  'Story': '#22C55E',          // green-500
  'Story (Comprehension 1)': '#10B981', // emerald-500
  'Story (Comprehension 2)': '#14B8A6', // teal-500
  'Single Digit': '#F59E0B',   // amber-500
  'Double Digit': '#EAB308',   // yellow-500
  'Subtraction': '#84CC16',    // lime-500
  'Division': '#22C55E',       // green-500
  'Problems': '#10B981'        // emerald-500
};

export default function StackedPercentageBarChart({
  data,
  title = 'លទ្ធផលការវាយតម្លៃ',
  colors = defaultColors
}: StackedPercentageBarChartProps) {
  // Get all unique level names from the data
  const levelNames = React.useMemo(() => {
    const names = new Set<string>();
    data.forEach(cycle => {
      Object.keys(cycle.levels).forEach(level => names.add(level));
    });
    return Array.from(names);
  }, [data]);

  // Transform data: convert counts to percentages while preserving original counts
  const chartData = React.useMemo(() => {
    return data.map(cycle => {
      // Calculate total for this cycle
      const total = Object.values(cycle.levels).reduce((sum, count) => sum + count, 0);

      // Create percentage data with original counts preserved
      const percentageData: any = {
        cycle: cycle.cycle,
        total: total, // Preserve total for tooltip
      };

      // Add percentage for each level
      levelNames.forEach(levelName => {
        const count = cycle.levels[levelName] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        percentageData[levelName] = percentage;
        percentageData[`${levelName}_count`] = count; // Preserve original count
      });

      return percentageData;
    });
  }, [data, levelNames]);

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
                {levelTranslations[entry.dataKey] || entry.dataKey}: {Math.round(percentage)}% ({count})
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom label formatter for bars - only show if > 5%
  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;

    // Only show label if percentage is greater than 5%
    if (value < 5) return null;

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: '11px', fontWeight: 'bold' }}
      >
        {Math.round(value)}%
      </text>
    );
  };

  return (
    <Card title={title} style={{ height: '100%' }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="cycle"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            label={{ value: 'ភាគរយនិស្សិត', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
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

      {/* Summary table below chart */}
      <div style={{ marginTop: '16px', overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F3F4F6' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E7EB' }}>វដ្តការវាយតម្លៃ</th>
              {data.map((cycle) => (
                <th key={cycle.cycle} style={{ padding: '8px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                  {cycle.cycle}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', border: '1px solid #E5E7EB' }}>និស្សិត</td>
              {data.map((cycle) => {
                const total = Object.values(cycle.levels).reduce((sum, count) => sum + count, 0);
                return (
                  <td key={cycle.cycle} style={{ padding: '8px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
                    {total}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
