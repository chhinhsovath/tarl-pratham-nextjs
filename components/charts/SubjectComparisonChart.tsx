'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import { Card } from 'antd';

interface SubjectComparisonChartProps {
  data: {
    language: number;
    math: number;
  };
  title?: string;
}

const COLORS = {
  language: '#1890ff',
  math: '#52c41a'
};

export default function SubjectComparisonChart({
  data,
  title = 'ការប្រៀបធៀបតាមមុខវិជ្ជា'
}: SubjectComparisonChartProps) {
  const chartData = [
    {
      name: 'ភាសា',
      value: data.language || 0,
      color: COLORS.language
    },
    {
      name: 'គណិតវិទ្យា',
      value: data.math || 0,
      color: COLORS.math
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percent = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p style={{ margin: '4px 0 0 0' }}>
            សិស្ស: {payload[0].value}
          </p>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            {percent}%
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card title={title} style={{ height: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              return `${value}: ${entry.payload.value}`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
