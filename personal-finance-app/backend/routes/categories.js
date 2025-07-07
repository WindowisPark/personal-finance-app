const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// 기본 카테고리 데이터
const defaultCategories = [
  // 수입 카테고리
  { name: '급여', type: 'income', color: '#27ae60', icon: '💰', isDefault: true },
  { name: '부업', type: 'income', color: '#2ecc71', icon: '💼', isDefault: true },
  { name: '투자수익', type: 'income', color: '#16a085', icon: '📈', isDefault: true },
  { name: '기타수입', type: 'income', color: '#1abc9c', icon: '💵', isDefault: true },
  
  // 지출 카테고리
  { name: '식비', type: 'expense', color: '#e74c3c', icon: '🍽️', isDefault: true },
  { name: '교통비', type: 'expense', color: '#e67e22', icon: '🚗', isDefault: true },
  { name: '쇼핑', type: 'expense', color: '#f39c12', icon: '🛍️', isDefault: true },
  { name: '문화생활', type: 'expense', color: '#9b59b6', icon: '🎬', isDefault: true },
  { name: '의료비', type: 'expense', color: '#3498db', icon: '🏥', isDefault: true },
  { name: '교육비', type: 'expense', color: '#2980b9', icon: '📚', isDefault: true },
  { name: '생활용품', type: 'expense', color: '#34495e', icon: '🏠', isDefault: true },
  { name: '통신비', type: 'expense', color: '#8e44ad', icon: '📱', isDefault: true },
  { name: '기타지출', type: 'expense', color: '#95a5a6', icon: '💸', isDefault: true }
];

// 기본 카테고리 초기화
const initializeDefaultCategories = async () => {
  try {
    const existingDefaults = await Category.find({ isDefault: true });
    if (existingDefaults.length === 0) {
      await Category.insertMany(defaultCategories);
      console.log('기본 카테고리가 초기화되었습니다.');
    }
  } catch (error) {
    console.error('기본 카테고리 초기화 오류:', error);
  }
};

// 서버 시작 시 기본 카테고리 초기화
initializeDefaultCategories();

// 모든 카테고리 조회 (기본 + 사용자 정의)
router.get('/', auth, async (req, res) => {
  try {
    const { type } = req.query;
    
    let filter = {
      $or: [
        { isDefault: true },
        { user: req.user._id }
      ]
    };
    
    if (type) {
      filter.type = type;
    }

    const categories = await Category.find(filter).sort({ isDefault: -1, name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: '카테고리를 불러오는 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// 새 카테고리 추가 (사용자 정의)
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, color, icon } = req.body;

    // 중복 확인
    const existingCategory = await Category.findOne({
      name: name,
      type: type,
      $or: [
        { isDefault: true },
        { user: req.user._id }
      ]
    });

    if (existingCategory) {
      return res.status(400).json({
        message: '이미 존재하는 카테고리입니다.'
      });
    }

    const category = new Category({
      name,
      type,
      color: color || '#3498db',
      icon: icon || '',
      user: req.user._id
    });

    await category.save();
    res.status(201).json({
      message: '카테고리가 추가되었습니다.',
      category
    });
  } catch (error) {
    res.status(500).json({ 
      message: '카테고리 추가 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// 카테고리 수정 (사용자 정의만)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, color, icon } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDefault: false
    });

    if (!category) {
      return res.status(404).json({ 
        message: '카테고리를 찾을 수 없거나 수정할 수 없습니다.' 
      });
    }

    category.name = name || category.name;
    category.color = color || category.color;
    category.icon = icon || category.icon;

    await category.save();
    res.json({
      message: '카테고리가 수정되었습니다.',
      category
    });
  } catch (error) {
    res.status(500).json({ 
      message: '카테고리 수정 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

// 카테고리 삭제 (사용자 정의만)
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user._id,
      isDefault: false
    });

    if (!category) {
      return res.status(404).json({ 
        message: '카테고리를 찾을 수 없거나 삭제할 수 없습니다.' 
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ 
      message: '카테고리가 삭제되었습니다.' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: '카테고리 삭제 중 오류가 발생했습니다.',
      error: error.message 
    });
  }
});

module.exports = router;