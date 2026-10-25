const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');

// Khởi tạo Google OAuth2 Client
const googleClient = new OAuth2Client(config.googleClientId);

/**
 * Cấu hình Cookie cho JWT Token
 */
const getCookieOptions = () => ({
  httpOnly: true, // Ngăn chặn XSS đọc cookie qua document.cookie
  secure: config.isProduction, // Chỉ bật HTTPS khi chạy production
  sameSite: config.isProduction ? 'none' : 'lax', // Hỗ trợ cross-origin trong production và an toàn ở localhost
  maxAge: 60 * 60 * 1000, // 1 giờ (trùng khớp thời hạn của JWT)
  path: '/',
});

/**
 * [POST] /api/auth/google
 * Xác thực Google ID Token, tạo/cập nhật user, tạo JWT và lưu vào HttpOnly Cookie
 */
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu Google credential (ID Token) trong body.',
      });
    }

    // 1. Dùng OAuth2Client để verify Google ID Token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId,
      });
    } catch (verifyError) {
      console.error('Lỗi khi verify ID Token từ Google:', verifyError.message);
      return res.status(401).json({
        success: false,
        message: 'Google ID Token không hợp lệ hoặc đã hết hạn.',
      });
    }

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Không lấy được thông tin từ Google ID Token.',
      });
    }

    // 2. Trích xuất thông tin người dùng từ Google Token
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google Account không cung cấp email hợp lệ.',
      });
    }

    // 3. Kiểm tra xem user đã tồn tại chưa (theo googleId hoặc email)
    let user = userModel.findByGoogleId(googleId) || userModel.findByEmail(email);

    if (!user) {
      // Nếu chưa có, tạo user mới với role mặc định là 'candidate'
      user = userModel.createUser({
        googleId,
        email,
        name,
        picture,
        role: 'candidate',
      });
      console.log(`[AUTH] Tạo tài khoản ứng viên mới: ${email} (${user.id})`);
    } else {
      // Cập nhật thông tin mới nhất từ Google nếu cần
      user = userModel.updateUser(user.id, {
        googleId,
        name: name || user.name,
        picture: picture || user.picture,
      });
      console.log(`[AUTH] Ứng viên đăng nhập lại: ${email} (${user.id})`);
    }

    // 4. Ký JWT token nội bộ với thời hạn 1 giờ
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    // 5. Gắn JWT vào HttpOnly Cookie
    res.cookie('token', token, getCookieOptions());

    // 6. Trả về thông tin user cho Client
    return res.status(200).json({
      success: true,
      message: 'Đăng nhập Google thành công!',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi xử lý đăng nhập Google:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra ở máy chủ khi xác thực Google.',
    });
  }
};

/**
 * [GET] /api/auth/me
 * Đọc cookie `token`, verify JWT và trả về thông tin user để giữ trạng thái khi F5/refresh
 */
const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập (không có cookie token).',
        user: null,
      });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Phiên làm việc hết hạn hoặc token không hợp lệ.',
        user: null,
      });
    }

    // Lấy thông tin user hiện tại
    const user = userModel.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy thông tin tài khoản người dùng.',
        user: null,
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Lỗi getMe:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng.',
      user: null,
    });
  }
};

/**
 * [POST] /api/auth/logout
 * Xóa cookie `token` để đăng xuất
 */
const logout = async (req, res) => {
  try {
    // Xóa cookie token bằng cách set options tương tự và expire ngay
    res.clearCookie('token', {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? 'none' : 'lax',
      path: '/',
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công!',
    });
  } catch (error) {
    console.error('Lỗi khi logout:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng xuất.',
    });
  }
};

module.exports = {
  googleAuth,
  getMe,
  logout,
};
