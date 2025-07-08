import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  useTheme,
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  AccountBalance, 
  Add, 
  Assessment 
} from '@mui/icons-material';
import MonthlyChart from '../components/MonthlyChart';
import CategoryChart from '../components/CategoryChart';
import TrendChart from '../components/TrendChart';
import BudgetManager from '../components/BudgetManager';
import ChartSkeleton from '../components/ChartSkeleton';
import MobileOptimized from '../components/MobileOptimized';
import './Dashboard.css';
import '../components/Charts.css';
import '../components/BudgetManager.css';

interface Stats {
  income: number;
  expense: number;
  balance: number;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ income: 0, expense: 0, balance: 0 });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState<'charts' | 'budget'>('charts');
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsResponse, monthlyResponse, categoryResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/transactions/stats/summary'),
          axios.get(`http://localhost:8000/api/transactions/stats/monthly?year=${selectedYear}`),
          axios.get('http://localhost:8000/api/transactions/stats/categories?type=expense')
        ]);

        setStats(statsResponse.data);
        setMonthlyData(monthlyResponse.data);
        setCategoryData(categoryResponse.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, selectedYear]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Typography variant="h6" color="text.secondary">
            로딩 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <MobileOptimized>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold">
          대시보드
        </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  총 수입
                </Typography>
              </Box>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                ₩{stats.income.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  총 지출
                </Typography>
              </Box>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                ₩{stats.expense.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  잔액
                </Typography>
              </Box>
              <Typography 
                variant="h4" 
                color={stats.balance >= 0 ? 'success.main' : 'error.main'} 
                fontWeight="bold"
              >
                ₩{stats.balance.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/transactions')}
          startIcon={<Assessment />}
        >
          거래 내역 보기
        </Button>
        <Button 
          variant="contained" 
          onClick={() => navigate('/transactions?add=true')}
          startIcon={<Add />}
        >
          새 거래 추가
        </Button>
      </Box>

        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, value) => {
              if (value === 'charts' || value === 'budget') {
                setActiveTab(value);
              }
            }}
            centered
            variant="fullWidth"
          >
            <Tab value="charts" label="차트 분석" />
            <Tab value="budget" label="예산 관리" />
          </Tabs>
        </Paper>

        {activeTab === 'charts' && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>연도 선택</InputLabel>
                <Select
                  value={selectedYear}
                  label="연도 선택"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (typeof value === 'string' && value) {
                      setSelectedYear(parseInt(value));
                    }
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <MenuItem key={year} value={year}>{year}년</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 8 }}>
                {loading ? (
                  <>
                    <ChartSkeleton type="bar" />
                    <ChartSkeleton type="line" />
                  </>
                ) : (
                  <>
                    <MonthlyChart data={monthlyData} />
                    <TrendChart data={monthlyData} />
                  </>
                )}
              </Grid>
              <Grid size={{ xs: 12, lg: 4 }}>
                {loading ? (
                  <ChartSkeleton type="pie" />
                ) : (
                  <CategoryChart data={categoryData} title="지출 카테고리별 비중" />
                )}
              </Grid>
            </Grid>
          </>
        )}

        {activeTab === 'budget' && (
          <BudgetManager />
        )}
      </Container>
    </MobileOptimized>
  );
};

export default Dashboard;