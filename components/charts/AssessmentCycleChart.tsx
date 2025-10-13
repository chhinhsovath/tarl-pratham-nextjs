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
  LineChart,
  Line
} from 'recharts';
import { Card } from 'antd';

interface AssessmentCycleChartProps {
  data: {
    baseline: number;
    midline: number;
    endline: number;
  };
  title?: string;
  type?: 'bar' | 'line';
}

export default function AssessmentCycleChart({
  data,
  title = 'ការប្រៀបធៀបតាមវដ្តវាយតម្លៃ',
  type = 'bar'
}: AssessmentCycleChartProps) {
  const chartData = [
    {
      name: 'តេស្តដើមគ្រា',
      count: data.baseline || 0,
      fill: '#8884d8'
    },
    {
      name: 'តេស្តពាក់កណ្ដាលគ្រា',
      count: data.midline || 0,
      fill: '#82ca9d'
    },
    {
      name: 'តេស្តចុងក្រោយគ្រា',
      count: data.endline || 0,
      fill: '#ffc658'
    }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.name}</p>
          <p style={{ margin: '4px 0 0 0', color: payload[0].fill }}>
            សិស្ស: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title={title} style={{ height: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={{ fontSize: '12px' }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8884d8">
              {chartData.map((entry, index) => (
                <Bar key={`cell-${index}`} dataKey="count" fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              style={{ fontSize: '12px' }}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}
