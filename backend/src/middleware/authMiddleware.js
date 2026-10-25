const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');

/**
 * Middleware xác thực token từ HttpOnly Cookie
 */
const requireAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy phiên đăng nhập. Vui lòng đăng nhập lại.',
      });
    }

    // Verify JWT token với secret key
    const decoded = jwt.verify(token, config.jwtSecret);

    // Kiểm tra sự tồn tại của user trong hệ thống
    const user = userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản không tồn tại hoặc đã bị vô hiệu hóa.',
      });
    }

    // Gắn thông tin user vào request object để các middleware/controller sau sử dụng
    req.user = user;
    next();
  } catch (error) {
    console.error('Lỗi xác thực JWT:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ.',
    });
  }
};

module.exports = {
  requireAuth,
};
