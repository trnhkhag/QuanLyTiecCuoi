import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import PasswordInput from './common/PasswordInput';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await authService.login(data.email, data.password);
      toast.success('Đăng nhập thành công!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow p-4">
      <h3 className="text-center mb-4">Đăng Nhập</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="email"
            {...register('email', { 
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Địa chỉ email không hợp lệ'
              }
            })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <PasswordInput
            id="password"
            className={errors.password ? 'is-invalid' : ''}
            {...register('password', { 
              required: 'Mật khẩu là bắt buộc',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
              }
            })}
          />
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password.message}</div>
          )}
        </div>

        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-3">
        <p>
          Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 