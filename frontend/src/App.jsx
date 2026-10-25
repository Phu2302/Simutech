import React from 'react';
import Navbar from './components/Navbar';
import GoogleLoginCard from './components/GoogleLoginCard';
import UserProfile from './components/UserProfile';
import { useAuth } from './context/AuthContext';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  return (
    <div className="layout">
      <Navbar />

      <main className="main">
        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <span>Đang tải thông tin...</span>
          </div>
        ) : user ? (
          <UserProfile />
        ) : (
          <GoogleLoginCard />
        )}
      </main>
    </div>
  );
}

export default App;
