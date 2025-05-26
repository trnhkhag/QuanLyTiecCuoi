import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import PasswordInput from './common/PasswordInput';

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Thêm userType là customer khi đăng ký
      await authService.register(data.name, data.email, data.phoneNumber, data.password, 'customer');
      toast.success('Đăng ký thành công!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="card shadow p-4">
      <h3 className="text-center mb-4">Đăng Ký</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Họ và tên</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="name"
            {...register('name', { 
              required: 'Họ tên là bắt buộc',
              minLength: {
                value: 3,
                message: 'Họ tên phải có ít nhất 3 ký tự'
              }
            })}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name.message}</div>
          )}
        </div>

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
          <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
          <input
            type="tel"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
            id="phoneNumber"
            placeholder="Nhập số điện thoại"
            {...register('phoneNumber', { 
              required: 'Số điện thoại là bắt buộc',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải có 10-11 chữ số'
              }
            })}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mật khẩu</label>
          <PasswordInput
            id="password"
            showStrengthIndicator={true}
            watchValue={password}
            className={errors.password ? 'is-invalid' : ''}
            {...register('password', { 
              required: 'Mật khẩu là bắt buộc',
              minLength: {
                value: 8,
                message: 'Mật khẩu phải có ít nhất 8 ký tự'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
              }
            })}
          />
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            className={errors.confirmPassword ? 'is-invalid' : ''}
            {...register('confirmPassword', { 
              required: 'Vui lòng xác nhận mật khẩu',
              validate: value => value === password || 'Mật khẩu không khớp'
            })}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>
          )}
        </div>

        <div className="d-grid gap-2">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </div>
      </form>
      
      <div className="text-center mt-3">
        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập tại đây</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm; 