import React from 'react';
import Skeleton from './Skeleton';
import './ListSkeleton.css';

interface ListSkeletonProps {
  rows?: number;
  type?: 'transaction' | 'budget' | 'category';
}

const ListSkeleton: React.FC<ListSkeletonProps> = ({ rows = 5, type = 'transaction' }) => {
  const renderTransactionRow = (index: number) => (
    <div key={index} className="list-skeleton-row transaction-row">
      <div className="list-skeleton-cell">
        <Skeleton width="80px" height="16px" />
      </div>
      <div className="list-skeleton-cell">
        <Skeleton width="60px" height="16px" />
      </div>
      <div className="list-skeleton-cell">
        <Skeleton width="100px" height="16px" />
      </div>
      <div className="list-skeleton-cell">
        <Skeleton width="120px" height="16px" />
      </div>
      <div className="list-skeleton-cell">
        <Skeleton width="90px" height="16px" />
      </div>
      <div className="list-skeleton-cell">
        <Skeleton width="60px" height="32px" borderRadius="4px" />
      </div>
    </div>
  );

  const renderBudgetRow = (index: number) => (
    <div key={index} className="list-skeleton-row budget-row">
      <div className="list-skeleton-budget-info">
        <Skeleton width="100px" height="18px" />
        <div className="list-skeleton-budget-details">
          <Skeleton width="80px" height="14px" />
          <Skeleton width="90px" height="14px" />
          <Skeleton width="70px" height="14px" />
          <div className="list-skeleton-progress">
            <Skeleton width="100%" height="6px" borderRadius="3px" />
          </div>
          <Skeleton width="40px" height="14px" />
        </div>
      </div>
      <div className="list-skeleton-budget-actions">
        <Skeleton width="60px" height="32px" borderRadius="4px" />
      </div>
    </div>
  );

  const renderCategoryRow = (index: number) => (
    <div key={index} className="list-skeleton-row category-row">
      <div className="list-skeleton-category-info">
        <Skeleton width="20px" height="20px" borderRadius="50%" />
        <Skeleton width="100px" height="16px" />
      </div>
      <div className="list-skeleton-category-actions">
        <Skeleton width="50px" height="28px" borderRadius="4px" />
        <Skeleton width="50px" height="28px" borderRadius="4px" />
      </div>
    </div>
  );

  const renderHeader = () => {
    if (type === 'transaction') {
      return (
        <div className="list-skeleton-header">
          <Skeleton width="60px" height="14px" />
          <Skeleton width="40px" height="14px" />
          <Skeleton width="80px" height="14px" />
          <Skeleton width="100px" height="14px" />
          <Skeleton width="70px" height="14px" />
          <Skeleton width="50px" height="14px" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="list-skeleton">
      {renderHeader()}
      <div className="list-skeleton-body">
        {Array.from({ length: rows }, (_, index) => {
          switch (type) {
            case 'transaction':
              return renderTransactionRow(index);
            case 'budget':
              return renderBudgetRow(index);
            case 'category':
              return renderCategoryRow(index);
            default:
              return renderTransactionRow(index);
          }
        })}
      </div>
    </div>
  );
};

export default ListSkeleton;