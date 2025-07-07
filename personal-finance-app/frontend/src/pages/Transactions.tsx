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

interface Category {
  _id: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  isDefault: boolean;
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
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    searchText: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
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
    fetchCategories();
  }, [isAuthenticated, navigate, searchParams, filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`http://localhost:8000/api/transactions?${params}`);
      let filteredTransactions = response.data;
      
      if (filters.searchText) {
        filteredTransactions = filteredTransactions.filter((transaction: Transaction) =>
          transaction.description.toLowerCase().includes(filters.searchText.toLowerCase()) ||
          transaction.category.toLowerCase().includes(filters.searchText.toLowerCase())
        );
      }
      
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await axios.put(`http://localhost:8000/api/transactions/${editingTransaction._id}`, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      } else {
        await axios.post('http://localhost:8000/api/transactions', {
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      setShowForm(false);
      setEditingTransaction(null);
      setFormData({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchTransactions();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      category: transaction.category,
      description: transaction.description,
      date: transaction.date.split('T')[0]
    });
    setShowForm(true);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

        <div className="filters-section">
          <div className="filter-row">
            <div className="filter-group">
              <label>검색</label>
              <input
                type="text"
                placeholder="설명이나 카테고리 검색"
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>종류</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">전체</option>
                <option value="income">수입</option>
                <option value="expense">지출</option>
              </select>
            </div>
            <div className="filter-group">
              <label>카테고리</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">전체</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>시작일</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="filter-group">
              <label>종료일</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            <div className="filter-group quick-filters">
              <label>빠른 필터</label>
              <div className="quick-filter-buttons">
                <button
                  onClick={() => {
                    const now = new Date();
                    setFilters({
                      ...filters,
                      startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0],
                      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]
                    });
                  }}
                  className="quick-filter-btn"
                >
                  이번달
                </button>
                <button
                  onClick={() => {
                    const now = new Date();
                    setFilters({
                      ...filters,
                      startDate: new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0],
                      endDate: new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0]
                    });
                  }}
                  className="quick-filter-btn"
                >
                  올해
                </button>
                <button
                  onClick={() => setFilters({
                    type: '',
                    category: '',
                    startDate: '',
                    endDate: '',
                    searchText: ''
                  })}
                  className="quick-filter-btn clear"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="transaction-form-overlay">
            <div className="transaction-form">
              <h2>{editingTransaction ? '거래 수정' : '새 거래 추가'}</h2>
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="">카테고리 선택</option>
                    {categories
                      .filter(cat => cat.type === formData.type)
                      .map(category => (
                        <option key={category._id} value={category.name}>
                          {category.icon} {category.name}
                        </option>
                      ))
                    }
                  </select>
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
                  <button type="submit" className="submit-btn">
                    {editingTransaction ? '수정' : '추가'}
                  </button>
                  <button type="button" onClick={() => {
                    setShowForm(false);
                    setEditingTransaction(null);
                  }} className="cancel-btn">
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
            <>
              {currentTransactions.map((transaction) => (
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
                  <div className="transaction-actions">
                    <button 
                      onClick={() => handleEdit(transaction)}
                      className="edit-btn"
                    >
                      수정
                    </button>
                    <button 
                      onClick={() => handleDelete(transaction._id)}
                      className="delete-btn"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    이전
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;