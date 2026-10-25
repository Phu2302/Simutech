import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleLogout } from '@react-oauth/google';
import { loginWithGoogleApi, getCurrentUserApi, logoutApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Khi ứng dụng khởi chạy hoặc F5, kiểm tra session bằng cookie qua /api/auth/me
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUserApi();
        if (isMounted) {
          setUser(currentUser);
        }
      } catch (err) {
        console.warn('Phiên đăng nhập chưa được thiết lập:', err.message);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Xử lý đăng nhập bằng Google Credential (ID Token)
   */
  const handleGoogleSuccess = async (credential) => {
    try {
      setAuthError(null);
      setLoading(true);
      const result = await loginWithGoogleApi(credential);
      setUser(result.user);
      return result.user;
    } catch (err) {
      console.error('Lỗi khi đăng nhập bằng Google:', err);
      setAuthError(err.message || 'Đăng nhập Google thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Xử lý đăng xuất
   */
  const handleLogout = async () => {
    try {
      setLoading(true);
      // Gọi backend để xóa HttpOnly Cookie
      await logoutApi();
      // Xóa phiên đăng nhập Google trên client
      googleLogout();
      setUser(null);
      setAuthError(null);
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
      setAuthError(err.message || 'Đăng xuất thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        setAuthError,
        loginWithGoogle: handleGoogleSuccess,
        logout: handleLogout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
