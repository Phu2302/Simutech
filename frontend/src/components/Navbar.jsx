import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-wrapper">
          <span className="brand">SimuTech</span>
          <span className="brand-badge">Interview</span>
        </div>

        {user && (
          <div className="header-user">
            {user.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="header-avatar"
              />
            ) : (
              <div className="header-avatar-fallback">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <span className="header-name">{user.name}</span>
            <button onClick={logout} className="btn-logout-small">
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
