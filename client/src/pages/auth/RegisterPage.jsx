import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/RegisterForm';
import authService from '../../services/authService';
import '../../styles/auth.css';

const RegisterPage = () => {
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
        <div className="auth-card register-card">
          <div className="auth-header">
            <h2 className="auth-title">Tạo tài khoản</h2>
            <p className="auth-subtitle">Tạo tài khoản để trở thành thành viên của chúng tôi</p>
          </div>
          <div className="auth-body">
            <RegisterForm />
          </div>
          <div className="auth-footer">
            <p>Bạn đã có tài khoản? <a href="/login" className="auth-link">Đăng nhập ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 