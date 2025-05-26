import React from 'react';
import { useAuthSync } from '../hooks/useAuthSync';

const UserInfoDisplay = () => {
  const { user } = useAuthSync();

  if (!user) {
    return (
      <div className="user-info-display">
        <p>Không có thông tin người dùng</p>
      </div>
    );
  }

  return (
    <div className="user-info-display">
      <div className="alert alert-info">
        <h6><i className="fas fa-info-circle"></i> Thông tin từ Redux Store (Real-time)</h6>
        <div className="row">
          <div className="col-md-6">
            <strong>Tên:</strong> {user.name || user.fullName || 'Chưa cập nhật'}
          </div>
          <div className="col-md-6">
            <strong>Email:</strong> {user.email || 'Chưa cập nhật'}
          </div>
          <div className="col-md-6">
            <strong>Số điện thoại:</strong> {user.phoneNumber || user.SoDienThoai || 'Chưa cập nhật'}
          </div>
          <div className="col-md-6">
            <strong>Vai trò:</strong> {user.role || 'Chưa cập nhật'}
          </div>
        </div>
        <small className="text-muted">
          * Thông tin này được cập nhật tự động khi bạn thay đổi profile
        </small>
      </div>
    </div>
  );
};

export default UserInfoDisplay; 