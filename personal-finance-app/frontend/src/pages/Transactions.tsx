import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Transactions.css';

interface Transaction {
  _id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (searchParams.get('add') === 'true') {
      setShowForm(true);
    }

    fetchTransactions();
  }, [isAuthenticated, navigate, searchParams]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setShowForm(false);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8000/api/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Failed to delete transaction:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="transactions">
      <div className="transactions-container">
        <div className="transactions-header">
          <h1>거래 내역</h1>
          <button onClick={() => setShowForm(true)} className="add-btn">
            새 거래 추가
          </button>
        </div>

        {showForm && (
          <div className="transaction-form-overlay">
            <div className="transaction-form">
              <h2>새 거래 추가</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>종류</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'income' | 'expense'})}
                  >
                    <option value="expense">지출</option>
                    <option value="income">수입</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>금액</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>카테고리</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="예: 식비, 교통비, 급여 등"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>설명</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="거래에 대한 설명"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>날짜</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">추가</button>
                  <button type="button" onClick={() => setShowForm(false)} className="cancel-btn">
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="transactions-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <p>아직 거래 내역이 없습니다.</p>
              <button onClick={() => setShowForm(true)} className="add-btn">
                첫 거래 추가하기
              </button>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction._id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-info">
                  <div className="transaction-main">
                    <span className="transaction-category">{transaction.category}</span>
                    <span className="transaction-description">{transaction.description}</span>
                  </div>
                  <div className="transaction-details">
                    <span className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('ko-KR')}
                    </span>
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}₩{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(transaction._id)}
                  className="delete-btn"
                >
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;