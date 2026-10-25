import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

export default function GoogleLoginCard() {
  const { loginWithGoogle, authError } = useAuth();

  return (
    <div className="auth-card">
      <h1 className="card-title">Đăng nhập SimuTech</h1>
      <p className="card-desc">Sử dụng tài khoản Google để truy cập nền tảng</p>

      {authError && <div className="error-box">{authError}</div>}

      <div className="google-btn-container">
        <GoogleLogin
          onSuccess={(res) => {
            if (res.credential) {
              loginWithGoogle(res.credential);
            }
          }}
          onError={() => {
            console.error('Đăng nhập Google thất bại');
          }}
          useOneTap
          theme="filled_black"
          shape="rectangular"
          size="large"
          width="100%"
        />
      </div>

      <div className="card-footer-note">
        Xác thực bằng HttpOnly Cookie & JWT
      </div>
    </div>
  );
}
