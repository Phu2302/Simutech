/**
 * SimuTech - API Services
 * Quản lý các lệnh gọi HTTP tới Backend API với credentials: 'include' để truyền HttpOnly Cookie
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Gửi Google ID Token lên server để xác thực và nhận JWT cookie
 * @param {string} credential - Google ID Token
 */
export async function loginWithGoogleApi(credential) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Quan trọng: Bắt buộc bật credentials để trình duyệt nhận và lưu HttpOnly Cookie từ backend
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Đăng nhập Google thất bại');
  }

  return data;
}

/**
 * Lấy thông tin user hiện tại từ cookie JWT
 */
export async function getCurrentUserApi() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // Gửi kèm cookie token
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      return null; // Chưa đăng nhập hoặc token hết hạn
    }
    const data = await response.json();
    throw new Error(data.message || 'Lỗi khi lấy thông tin người dùng');
  }

  const data = await response.json();
  return data.user;
}

/**
 * Đăng xuất khỏi hệ thống và yêu cầu server xóa HttpOnly cookie
 */
export async function logoutApi() {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Đăng xuất thất bại');
  }

  return data;
}
