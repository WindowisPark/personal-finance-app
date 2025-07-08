const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all transactions for user
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    
    let filter = { user: req.user._id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .populate('user', 'username email');

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ 
      message: '거래 내역을 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Get transaction by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ 
        message: '거래 내역을 찾을 수 없습니다.' 
      });
    }

    res.json(transaction);

  } catch (error) {
    res.status(500).json({ 
      message: '거래 내역을 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Create new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = new Transaction({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || new Date()
    });

    await transaction.save();

    res.status(201).json({
      message: '거래 내역이 추가되었습니다.',
      transaction
    });

  } catch (error) {
    res.status(500).json({ 
      message: '거래 내역 추가 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Update transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { type, amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ 
        message: '거래 내역을 찾을 수 없습니다.' 
      });
    }

    res.json({
      message: '거래 내역이 수정되었습니다.',
      transaction
    });

  } catch (error) {
    res.status(500).json({ 
      message: '거래 내역 수정 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ 
        message: '거래 내역을 찾을 수 없습니다.' 
      });
    }

    res.json({ 
      message: '거래 내역이 삭제되었습니다.' 
    });

  } catch (error) {
    res.status(500).json({ 
      message: '거래 내역 삭제 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Get transaction statistics
router.get('/stats/summary', auth, async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const income = stats.find(s => s._id === 'income')?.total || 0;
    const expense = stats.find(s => s._id === 'expense')?.total || 0;

    res.json({
      income,
      expense,
      balance: income - expense
    });

  } catch (error) {
    res.status(500).json({ 
      message: '통계 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Get monthly statistics
router.get('/stats/monthly', auth, async (req, res) => {
  try {
    const { year } = req.query;
    const matchYear = year ? parseInt(year) : new Date().getFullYear();
    
    const stats = await Transaction.aggregate([
      { 
        $match: { 
          user: req.user._id,
          date: {
            $gte: new Date(`${matchYear}-01-01`),
            $lte: new Date(`${matchYear}-12-31`)
          }
        } 
      },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const income = stats.find(s => s._id.month === month && s._id.type === 'income')?.total || 0;
      const expense = stats.find(s => s._id.month === month && s._id.type === 'expense')?.total || 0;
      
      monthlyData.push({
        month: `${month}월`,
        income,
        expense,
        balance: income - expense
      });
    }

    res.json(monthlyData);

  } catch (error) {
    res.status(500).json({ 
      message: '월별 통계 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// Get category statistics
router.get('/stats/categories', auth, async (req, res) => {
  try {
    const { type = 'expense' } = req.query;
    
    const stats = await Transaction.aggregate([
      { 
        $match: { 
          user: req.user._id,
          type: type
        } 
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const totalAmount = stats.reduce((sum, item) => sum + item.total, 0);
    
    const categoryData = stats.map(item => ({
      category: item._id,
      amount: item.total,
      count: item.count,
      percentage: totalAmount > 0 ? ((item.total / totalAmount) * 100).toFixed(1) : 0
    }));

    res.json(categoryData);

  } catch (error) {
    res.status(500).json({ 
      message: '카테고리 통계 데이터를 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

module.exports = router;