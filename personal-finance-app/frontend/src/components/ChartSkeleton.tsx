import React from 'react';
import Skeleton from './Skeleton';
import './ChartSkeleton.css';

interface ChartSkeletonProps {
  title?: string;
  type?: 'bar' | 'line' | 'pie';
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ title, type = 'bar' }) => {
  const renderBarChart = () => (
    <div className="chart-skeleton-bars">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="chart-skeleton-bar">
          <Skeleton 
            width="100%" 
            height={`${Math.random() * 60 + 40}%`} 
            borderRadius="4px 4px 0 0"
          />
          <div className="chart-skeleton-bar-label">
            <Skeleton width="80%" height="12px" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="chart-skeleton-line">
      <svg width="100%" height="300" viewBox="0 0 600 300">
        {/* Grid lines */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`grid-${i}`}
            x1="0"
            y1={i * 50}
            x2="600"
            y2={i * 50}
            stroke="#e0e0e0"
            strokeWidth="1"
          />
        ))}
        {/* Skeleton path */}
        <path
          d="M 0 150 Q 100 100 200 120 T 400 80 T 600 100"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="3"
        />
        {/* Data points */}
        {Array.from({ length: 12 }, (_, i) => (
          <circle
            key={`point-${i}`}
            cx={i * 50}
            cy={Math.random() * 200 + 50}
            r="4"
            fill="#e0e0e0"
          />
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => (
    <div className="chart-skeleton-pie">
      <div className="chart-skeleton-pie-chart">
        <Skeleton width="200px" height="200px" borderRadius="50%" />
      </div>
      <div className="chart-skeleton-pie-legend">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="chart-skeleton-pie-legend-item">
            <Skeleton width="12px" height="12px" borderRadius="2px" />
            <Skeleton width="80px" height="12px" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="chart-skeleton">
      <div className="chart-skeleton-header">
        <Skeleton width="150px" height="20px" />
      </div>
      <div className="chart-skeleton-content">
        {type === 'bar' && renderBarChart()}
        {type === 'line' && renderLineChart()}
        {type === 'pie' && renderPieChart()}
      </div>
    </div>
  );
};

export default ChartSkeleton;