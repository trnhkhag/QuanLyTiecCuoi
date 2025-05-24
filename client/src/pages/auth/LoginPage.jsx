import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import authService from '../../services/authService';
import '../../styles/auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (authService.isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card login-card">
          <div className="auth-header">
            <h2 className="auth-title">Chào mừng</h2>
            <p className="auth-subtitle">Đăng nhập vào tài khoản của bạn</p>
          </div>
          <div className="auth-body">
            <LoginForm />
          </div>
          <div className="auth-footer">
            <p>Bạn chưa có tài khoản? <a href="/register" className="auth-link">Đăng ký ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 