const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  period: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: function() {
      return this.period === 'monthly';
    },
    min: 1,
    max: 12
  }
}, {
  timestamps: true
});

// 사용자별 카테고리당 기간별 예산은 하나만 허용
budgetSchema.index({ user: 1, category: 1, period: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);