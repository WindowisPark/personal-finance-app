const express = require('express');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all budgets for user
router.get('/', auth, async (req, res) => {
  try {
    const { year, month, period } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    let filter = { user: req.user._id };
    
    if (period === 'monthly') {
      filter.period = 'monthly';
      filter.year = currentYear;
      filter.month = currentMonth;
    } else if (period === 'yearly') {
      filter.period = 'yearly';
      filter.year = currentYear;
    } else {
      // 기본적으로 현재 월의 예산을 가져옴
      filter.period = 'monthly';
      filter.year = currentYear;
      filter.month = currentMonth;
    }

    const budgets = await Budget.find(filter).sort({ category: 1 });
    res.json(budgets);

  } catch (error) {
    res.status(500).json({ 
      message: '예산 목록을 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Create or update budget
router.post('/', auth, async (req, res) => {
  try {
    const { category, amount, period = 'monthly', year, month } = req.body;
    
    const budgetData = {
      user: req.user._id,
      category,
      amount,
      period,
      year: year || new Date().getFullYear()
    };
    
    if (period === 'monthly') {
      budgetData.month = month || new Date().getMonth() + 1;
    }

    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        period,
        year: budgetData.year,
        ...(period === 'monthly' && { month: budgetData.month })
      },
      budgetData,
      { new: true, upsert: true }
    );

    res.json({
      message: '예산이 설정되었습니다.',
      budget
    });

  } catch (error) {
    res.status(500).json({ 
      message: '예산 설정 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ 
        message: '예산을 찾을 수 없습니다.' 
      });
    }

    res.json({ 
      message: '예산이 삭제되었습니다.' 
    });

  } catch (error) {
    res.status(500).json({ 
      message: '예산 삭제 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Get budget vs actual spending comparison
router.get('/comparison', auth, async (req, res) => {
  try {
    const { year, month, period = 'monthly' } = req.query;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    
    let budgetFilter = { user: req.user._id, period };
    let transactionFilter = { user: req.user._id, type: 'expense' };
    
    if (period === 'monthly') {
      budgetFilter.year = currentYear;
      budgetFilter.month = currentMonth;
      
      transactionFilter.date = {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1)
      };
    } else if (period === 'yearly') {
      budgetFilter.year = currentYear;
      
      transactionFilter.date = {
        $gte: new Date(currentYear, 0, 1),
        $lt: new Date(currentYear + 1, 0, 1)
      };
    }

    const [budgets, spending] = await Promise.all([
      Budget.find(budgetFilter),
      Transaction.aggregate([
        { $match: transactionFilter },
        {
          $group: {
            _id: '$category',
            spent: { $sum: '$amount' }
          }
        }
      ])
    ]);

    const comparison = budgets.map(budget => {
      const spentData = spending.find(s => s._id === budget.category);
      const spent = spentData ? spentData.spent : 0;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      return {
        budgetId: budget._id,
        category: budget.category,
        budgetAmount: budget.amount,
        spentAmount: spent,
        remainingAmount: budget.amount - spent,
        percentage: percentage.toFixed(1),
        isOverBudget: spent > budget.amount,
        period: budget.period,
        year: budget.year,
        month: budget.month
      };
    });

    res.json(comparison);

  } catch (error) {
    res.status(500).json({ 
      message: '예산 비교 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

module.exports = router;