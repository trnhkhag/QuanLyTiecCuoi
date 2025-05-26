import React from 'react';
import { useAuthSync } from '../../hooks/useAuthSync';

const UserProfileCard = () => {
  const { user, isAuthenticated } = useAuthSync();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="user-profile-card">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="avatar-circle me-3">
              <i className="fas fa-user"></i>
            </div>
            <div className="user-info">
              <h6 className="mb-1">{user.name || user.fullName || 'Người dùng'}</h6>
              <p className="text-muted mb-1 small">{user.email}</p>
              <p className="text-muted mb-0 small">
                <i className="fas fa-phone me-1"></i>
                {user.phoneNumber || user.SoDienThoai || 'Chưa cập nhật'}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className="badge bg-primary">{user.role || 'Người dùng'}</span>
            {user.userType && (
              <span className="badge bg-secondary ms-1">
                {user.userType === 'customer' ? 'Khách hàng' : 'Nhân viên'}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }
        
        .user-profile-card .card {
          transition: transform 0.2s ease;
        }
        
        .user-profile-card .card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default UserProfileCard; 