import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  LinearProgress,
  Alert,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import { Delete as DeleteIcon, TrendingUp, TrendingDown } from '@mui/icons-material';
import BudgetChart from './BudgetChart';
import ChartSkeleton from './ChartSkeleton';
import ListSkeleton from './ListSkeleton';
import { useToast } from '../contexts/ToastContext';

interface BudgetData {
  budgetId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: string;
  isOverBudget: boolean;
}

interface Category {
  _id: string;
  name: string;
  type: string;
  color: string;
  isDefault: boolean;
}

const BudgetManager: React.FC = () => {
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [budgetAmount, setBudgetAmount] = useState<string>('');
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const theme = useTheme();

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, [period, selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        period,
        year: selectedYear.toString(),
        ...(period === 'monthly' && { month: selectedMonth.toString() })
      });

      const response = await axios.get(`http://localhost:8000/api/budgets/comparison?${params}`);
      setBudgetData(response.data);
    } catch (error) {
      console.error('Failed to fetch budget data:', error);
      addToast({
        type: 'error',
        title: '데이터 로딩 실패',
        message: '예산 데이터를 불러오는 중 오류가 발생했습니다.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories?type=expense');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      addToast({
        type: 'error',
        title: '카테고리 로딩 실패',
        message: '카테고리 목록을 불러오는 중 오류가 발생했습니다.'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !budgetAmount) {
      addToast({
        type: 'warning',
        title: '입력 오류',
        message: '카테고리와 예산 금액을 입력해주세요.'
      });
      return;
    }

    try {
      const budgetData = {
        category: selectedCategory,
        amount: parseFloat(budgetAmount),
        period,
        year: selectedYear,
        ...(period === 'monthly' && { month: selectedMonth })
      };

      await axios.post('http://localhost:8000/api/budgets', budgetData);
      
      setSelectedCategory('');
      setBudgetAmount('');
      fetchData();
      
      addToast({
        type: 'success',
        title: '예산 설정 완료',
        message: `${selectedCategory} 카테고리의 예산이 설정되었습니다.`
      });
    } catch (error) {
      console.error('Failed to create budget:', error);
      addToast({
        type: 'error',
        title: '예산 설정 실패',
        message: '예산 설정 중 오류가 발생했습니다.'
      });
    }
  };

  const handleDelete = async (budgetId: string, category: string) => {
    if (!window.confirm('정말로 이 예산을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/budgets/${budgetId}`);
      fetchData();
      addToast({
        type: 'success',
        title: '예산 삭제 완료',
        message: `${category} 카테고리의 예산이 삭제되었습니다.`
      });
    } catch (error) {
      console.error('Failed to delete budget:', error);
      addToast({
        type: 'error',
        title: '예산 삭제 실패',
        message: '예산 삭제 중 오류가 발생했습니다.'
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          로딩 중...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            예산 설정
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>기간</InputLabel>
                <Select
                  value={period}
                  label="기간"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'monthly' || value === 'yearly') {
                      setPeriod(value);
                    }
                  }}
                >
                  <MenuItem value="monthly">월별</MenuItem>
                  <MenuItem value="yearly">연도별</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth>
                <InputLabel>연도</InputLabel>
                <Select
                  value={selectedYear}
                  label="연도"
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
            </Grid>
            
            {period === 'monthly' && (
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>월</InputLabel>
                  <Select
                    value={selectedMonth}
                    label="월"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (typeof value === 'string' && value) {
                        setSelectedMonth(parseInt(value));
                      }
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <MenuItem key={month} value={month}>{month}월</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2} sx={{ alignItems: 'end' }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>카테고리</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="카테고리"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (typeof value === 'string') {
                        setSelectedCategory(value);
                      }
                    }}
                    required
                  >
                    <MenuItem value="">카테고리 선택</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category._id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="예산 금액"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (typeof value === 'string') {
                      setBudgetAmount(value);
                    }
                  }}
                  placeholder="예산 금액 입력"
                  inputProps={{ min: 0, step: 1000 }}
                  required
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 4 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  fullWidth
                  sx={{ height: 56 }}
                >
                  예산 설정
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <ChartSkeleton type="bar" />
      ) : (
        budgetData.length > 0 && (
          <BudgetChart data={budgetData} />
        )
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            설정된 예산
          </Typography>
          
          {loading ? (
            <ListSkeleton rows={3} type="budget" />
          ) : budgetData.length === 0 ? (
            <Alert severity="info">설정된 예산이 없습니다.</Alert>
          ) : (
            <Grid container spacing={2}>
              {budgetData.map((item, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={index}>
                  <Paper 
                    elevation={item.isOverBudget ? 3 : 1}
                    sx={{ 
                      p: 2, 
                      border: item.isOverBudget ? `2px solid ${theme.palette.error.main}` : 'none',
                      bgcolor: item.isOverBudget ? theme.palette.error.light + '10' : 'background.paper'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h4">
                        {item.category}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          icon={item.isOverBudget ? <TrendingDown /> : <TrendingUp />}
                          label={`${item.percentage}%`}
                          color={item.isOverBudget ? 'error' : 'success'}
                          size="small"
                        />
                        <IconButton 
                          onClick={() => handleDelete(item.budgetId, item.category)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        예산: ₩{item.budgetAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        지출: ₩{item.spentAmount.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        잔여: ₩{item.remainingAmount.toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(parseFloat(item.percentage), 100)}
                      color={item.isOverBudget ? 'error' : 'success'}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BudgetManager;