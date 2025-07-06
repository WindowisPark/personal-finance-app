import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Dashboard.css';

interface Stats {
  income: number;
  expense: number;
  balance: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/transactions/stats/summary');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>대시보드</h1>
        
        <div className="stats-grid">
          <div className="stat-card income">
            <h3>총 수입</h3>
            <p className="stat-value">₩{stats.income.toLocaleString()}</p>
          </div>
          
          <div className="stat-card expense">
            <h3>총 지출</h3>
            <p className="stat-value">₩{stats.expense.toLocaleString()}</p>
          </div>
          
          <div className="stat-card balance">
            <h3>잔액</h3>
            <p className={`stat-value ${stats.balance >= 0 ? 'positive' : 'negative'}`}>
              ₩{stats.balance.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="quick-actions">
          <button onClick={() => navigate('/transactions')} className="action-btn">
            거래 내역 보기
          </button>
          <button onClick={() => navigate('/transactions?add=true')} className="action-btn primary">
            새 거래 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;