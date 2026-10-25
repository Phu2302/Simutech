/**
 * SimuTech - In-Memory User Repository
 * Mô hình lưu trữ user tối giản phục vụ demo/development.
 * Có thể dễ dàng thay thế bằng MongoDB (Mongoose), PostgreSQL (Prisma), v.v.
 */

// Danh sách user lưu trong bộ nhớ RAM
const users = new Map();

const userModel = {
  /**
   * Tìm user theo Google ID (sub)
   * @param {string} googleId
   * @returns {object|null}
   */
  findByGoogleId: (googleId) => {
    for (const user of users.values()) {
      if (user.googleId === googleId) {
        return user;
      }
    }
    return null;
  },

  /**
   * Tìm user theo Email
   * @param {string} email
   * @returns {object|null}
   */
  findByEmail: (email) => {
    for (const user of users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return null;
  },

  /**
   * Tìm user theo internal ID
   * @param {string} id
   * @returns {object|null}
   */
  findById: (id) => {
    return users.get(id) || null;
  },

  /**
   * Tạo mới user với role mặc định là 'candidate'
   * @param {object} userData
   * @returns {object}
   */
  createUser: ({ googleId, email, name, picture, role = 'candidate' }) => {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newUser = {
      id,
      googleId,
      email,
      name: name || 'Anonymous Candidate',
      picture: picture || '',
      role: role || 'candidate', // Vai trò mặc định cho ứng viên trên SimuTech
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.set(id, newUser);
    return newUser;
  },

  /**
   * Cập nhật thông tin user (ví dụ: cập nhật avatar, tên khi đăng nhập lại)
   * @param {string} id
   * @param {object} updates
   * @returns {object|null}
   */
  updateUser: (id, updates) => {
    const existing = users.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    users.set(id, updated);
    return updated;
  },

  /**
   * Lấy toàn bộ danh sách users (debug/admin)
   */
  getAll: () => Array.from(users.values()),
};

module.exports = userModel;
