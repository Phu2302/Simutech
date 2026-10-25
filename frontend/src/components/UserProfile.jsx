import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="auth-card">
      <div className="profile-view">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            className="profile-avatar"
          />
        ) : (
          <div className="profile-avatar-fallback">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-email">{user.email}</p>

        {/* Thông tin tài khoản tối giản */}
        <div className="profile-details-list">
          <div className="profile-detail-row">
            <span className="detail-label">Vai trò</span>
            <span className="role-badge">{user.role || 'candidate'}</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Phương thức</span>
            <span className="detail-value">Google OAuth 2.0</span>
          </div>
          <div className="profile-detail-row">
            <span className="detail-label">Trạng thái</span>
            <span className="status-badge">Đang hoạt động</span>
          </div>
        </div>

        <button onClick={logout} className="btn-logout">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
