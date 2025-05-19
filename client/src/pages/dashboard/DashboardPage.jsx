import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!authService.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Helper function to check if user has specific permission
  const hasPermission = (permissionBit) => {
    return user && user.user.permissions && (user.user.permissions & permissionBit) !== 0;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Quản Lý Tiệc Cưới</h2>
        <button 
          onClick={handleLogout}
          className="logout-btn"
        >
          Đăng xuất
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info-card">
          <div className="user-greeting">
            {user && (
              <>
                <h3>Xin chào, {user.user.name}!</h3>
                <p className="user-email">{user.user.email}</p>
                <p className="user-role">Vai trò: {user.user.role}</p>
              </>
            )}
          </div>
        </div>
        
        <div className="dashboard-widgets">
          <div className="widget">
            <h4>Thống Kê Nhanh</h4>
            <div className="widget-content">
              <p>Bảng điều khiển của bạn đã sẵn sàng!</p>
            </div>
          </div>
          
          <div className="widget">
            <h4>Hoạt Động Gần Đây</h4>
            <div className="widget-content">
              <p>Không có hoạt động nào gần đây.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 