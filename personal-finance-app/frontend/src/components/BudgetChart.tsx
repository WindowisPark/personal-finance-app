import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

interface BudgetData {
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: string;
  isOverBudget: boolean;
}

interface BudgetChartProps {
  data: BudgetData[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return `₩${value.toLocaleString()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p>예산: {formatCurrency(data.budgetAmount)}</p>
          <p>지출: {formatCurrency(data.spentAmount)}</p>
          <p>잔여: {formatCurrency(data.remainingAmount)}</p>
          <p>진행률: {data.percentage}%</p>
          {data.isOverBudget && <p style={{ color: '#f44336' }}>⚠️ 예산 초과!</p>}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (percentage: string) => {
    const percent = parseFloat(percentage);
    if (percent >= 100) return '#f44336'; // 빨간색 (초과)
    if (percent >= 80) return '#ff9800'; // 주황색 (위험)
    if (percent >= 60) return '#ffc107'; // 노란색 (주의)
    return '#4caf50'; // 초록색 (안전)
  };

  return (
    <div className="chart-container">
      <h3>예산 vs 실제 지출</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="budgetAmount" fill="#e0e0e0" name="예산" />
          <Bar dataKey="spentAmount" name="지출">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;