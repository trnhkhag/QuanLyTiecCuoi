import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../../components/DashboardNavbar';
import authService from '../../services/authService';
import '../../styles/dashboard.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!authService.isLoggedIn()) {
      navigate('/login');
      return;
    }
    
    // Safely get current user data
    try {
      const userData = authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  // Helper function to check if user has specific permission
  const hasPermission = (permissionBit) => {
    return user && user.user && user.user.permissions && (user.user.permissions & permissionBit) !== 0;
  };

  return (
    <div className="app-container">
      <DashboardNavbar />
      
      <div className="content-container">
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
              {user && user.user ? (
                <>
                  <h3>Xin chào, {user.user.name || 'Người dùng'}!</h3>
                  <p className="user-email">{user.user.email || ''}</p>
                  <p className="user-role">Vai trò: {user.user.role || 'Người dùng'}</p>
                </>
              ) : (
                <h3>Đang tải thông tin...</h3>
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
    </div>
  );
};

export default DashboardPage; 