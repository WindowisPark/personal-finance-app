const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  color: {
    type: String,
    default: '#3498db'
  },
  icon: {
    type: String,
    default: ''
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return !this.isDefault;
    }
  }
}, {
  timestamps: true
});

categorySchema.index({ name: 1, type: 1, user: 1 });
categorySchema.index({ isDefault: 1 });

module.exports = mongoose.model('Category', categorySchema);