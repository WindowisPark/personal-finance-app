const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: '인증 토큰이 없습니다.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        message: '유효하지 않은 토큰입니다.' 
      });
    }

    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ 
      message: '인증에 실패했습니다.',
      error: error.message 
    });
  }
};

module.exports = auth;