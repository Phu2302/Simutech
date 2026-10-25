const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * Routes xác thực người dùng cho SimuTech
 */

// Đăng nhập bằng Google ID Token
router.post('/google', authController.googleAuth);

// Lấy thông tin user hiện tại từ HttpOnly Cookie token
router.get('/me', authController.getMe);

// Đăng xuất và xóa cookie
router.post('/logout', authController.logout);

module.exports = router;
