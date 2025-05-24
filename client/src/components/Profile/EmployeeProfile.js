import React, { useState } from 'react';
import ProfileService from '../../services/ProfileService';
import './ProfileComponents.css';

const EmployeeProfile = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || '',
    position: profile?.position || ''
  });
  const [loading, setLoading] = useState(false);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      const response = await ProfileService.updateEmployeeProfile(formData);
      
      if (response.success) {
        setSuccessMessage(response.message);
        onUpdate(formData);
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrors({ general: response.message });
      }
    } catch (error) {
      setErrors({ general: 'Lỗi khi cập nhật thông tin' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: profile?.fullName || '',
      position: profile?.position || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="profile-form-container">
      <div className="profile-form-header">
        <h3>Thông tin nhân viên</h3>
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
          <label htmlFor="position">
            <i className="fas fa-briefcase"></i>
            Chức vụ
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Nhập chức vụ"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-at"></i>
            Username
          </label>
          <input
            type="text"
            value={profile?.username || ''}
            disabled
            className="readonly-field"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-user-tag"></i>
            Loại tài khoản
          </label>
          <input
            type="text"
            value="Nhân viên"
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
              disabled={loading}
            >
              <i className="fas fa-times"></i>
              Hủy
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? (
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

export default EmployeeProfile; 