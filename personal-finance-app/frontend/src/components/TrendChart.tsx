import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TrendData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface TrendChartProps {
  data: TrendData[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return `₩${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h3>수입/지출 트렌드</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#4CAF50" 
            strokeWidth={3}
            name="수입"
            dot={{ fill: '#4CAF50', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#f44336" 
            strokeWidth={3}
            name="지출"
            dot={{ fill: '#f44336', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#2196F3" 
            strokeWidth={3}
            name="잔액"
            dot={{ fill: '#2196F3', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;