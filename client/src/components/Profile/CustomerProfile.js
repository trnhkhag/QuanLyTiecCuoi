import React, { useState } from 'react';
import useProfile from '../../hooks/useProfile';
import './ProfileComponents.css';

const CustomerProfile = ({ profile, onUpdate }) => {
  const { updateProfile, updateLoading, updateError } = useProfile();
  
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    phoneNumber: profile?.phoneNumber || '',
    email: profile?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ (10-11 số)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSuccessMessage('');

    try {
      const result = await updateProfile(formData);
      
      if (result.type.endsWith('/fulfilled')) {
        setSuccessMessage('Cập nhật thông tin thành công');
        onUpdate(formData);
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrors({ general: updateError || 'Lỗi khi cập nhật thông tin' });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi khi cập nhật thông tin' });
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      phoneNumber: profile?.phoneNumber || '',
      email: profile?.email || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-header">
        <h3>Thông tin khách hàng</h3>
        {!isEditing && (
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(true)}
          >
            <i className="fas fa-edit"></i>
            Chỉnh sửa
          </button>
        )}
      </div>

      {successMessage && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="fullName">
            <i className="fas fa-user"></i>
            Họ và tên
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={errors.fullName ? 'error' : ''}
            placeholder="Nhập họ và tên"
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">
            <i className="fas fa-phone"></i>
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={errors.phoneNumber ? 'error' : ''}
            placeholder="Nhập số điện thoại"
          />
          {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <i className="fas fa-envelope"></i>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={errors.email ? 'error' : ''}
            placeholder="Nhập địa chỉ email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-user-tag"></i>
            Loại tài khoản
          </label>
          <input
            type="text"
            value="Khách hàng"
            disabled
            className="readonly-field"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-shield-alt"></i>
            Vai trò
          </label>
          <input
            type="text"
            value={profile?.role || ''}
            disabled
            className="readonly-field"
          />
        </div>

        {isEditing && (
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={updateLoading}
            >
              <i className="fas fa-times"></i>
              Hủy
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CustomerProfile; 